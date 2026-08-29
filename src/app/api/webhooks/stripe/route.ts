import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import Stripe from "stripe";
import {
  sendAdminPaymentNotificationEmail,
  sendPaymentConfirmationEmail,
} from "@/lib/email";
import { logUserActivity } from "@/lib/userActivityServer";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

async function patchParentProfile(userId: string, body: Record<string, unknown>) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/parent_profiles?id=eq.${userId}`,
    {
      method: "PATCH",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    Sentry.captureMessage(`[stripe-webhook] Supabase update failed: ${err}`, "error");
    console.error("[stripe-webhook] supabase update failed:", err);
    throw new Error("db_update_failed");
  }
}

function subscriptionPeriodEnd(subscription: Stripe.Subscription): string | null {
  const currentPeriodEnd =
    (subscription as unknown as { current_period_end?: number }).current_period_end ??
    subscription.items.data[0]?.current_period_end;
  return currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null;
}

function attributionFromMetadata(metadata: Stripe.Metadata | null | undefined) {
  if (!metadata) return null;
  return {
    first: {
      channel: metadata.first_channel || null,
      landingPage: metadata.first_landing_page || null,
      utmSource: metadata.first_utm_source || null,
      utmMedium: metadata.first_utm_medium || null,
      utmCampaign: metadata.first_utm_campaign || null,
      hasGoogleClickId: metadata.first_google_click_id === "true",
    },
    last: {
      channel: metadata.last_channel || null,
      landingPage: metadata.last_landing_page || null,
      utmSource: metadata.last_utm_source || null,
      utmMedium: metadata.last_utm_medium || null,
      utmCampaign: metadata.last_utm_campaign || null,
      hasGoogleClickId: metadata.last_google_click_id === "true",
    },
  };
}

function experimentFromMetadata(metadata: Stripe.Metadata | null | undefined) {
  const variant = metadata?.variant;
  if (metadata?.experiment !== "ads_lp_7_day_trial" || (variant !== "control" && variant !== "trial")) {
    return {};
  }
  return {
    experiment: metadata.experiment,
    variant,
    experiment_visitor_id: metadata.experiment_visitor_id || null,
    experiment_page: metadata.experiment_page || null,
    checkout_source: metadata.checkout_source || null,
    internal_qa: metadata.internal_qa === "true",
    forced_variant: metadata.forced_variant === "true",
  };
}

async function getUserByStripeCustomer(stripeCustomerId: string): Promise<{ userId: string; email: string } | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/parent_profiles?stripe_customer_id=eq.${stripeCustomerId}&select=id,email`,
    {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    }
  );
  const rows = await res.json();
  if (!rows?.[0]?.id) return null;
  return { userId: rows[0].id, email: rows[0].email ?? "" };
}

function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const subscription = (invoice as unknown as { subscription?: string | { id?: string } }).subscription;
  if (typeof subscription === "string") return subscription;
  if (subscription?.id) return subscription.id;

  return (
    (invoice as unknown as { parent?: { subscription_details?: { subscription?: string } } })
      .parent?.subscription_details?.subscription ?? null
  );
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const plan = subscription.metadata?.plan ?? "monthly";
  const status = subscription.status;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;
  const premiumUntil = subscriptionPeriodEnd(subscription);
  const premium = ["active", "trialing", "past_due"].includes(status);
  const stripeCustomerId = subscription.customer as string;
  const experiment = experimentFromMetadata(subscription.metadata);
  const attribution = attributionFromMetadata(subscription.metadata);

  if (userId) {
    await patchParentProfile(userId, {
      premium,
      premium_plan: premium ? plan : null,
      premium_until: premium ? premiumUntil : null,
      cancelled: cancelAtPeriodEnd || !premium,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: subscription.id,
    });
    return { userId, email: undefined, plan, status, premium, premiumUntil, cancelAtPeriodEnd, experiment, attribution };
  }

  const user = await getUserByStripeCustomer(stripeCustomerId);
  if (!user) return null;

  await patchParentProfile(user.userId, {
    premium,
    premium_plan: premium ? plan : null,
    premium_until: premium ? premiumUntil : null,
    cancelled: cancelAtPeriodEnd || !premium,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: subscription.id,
  });
  return { userId: user.userId, email: user.email, plan, status, premium, premiumUntil, cancelAtPeriodEnd, experiment, attribution };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    Sentry.captureException(err);
    console.error("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── Subscription activated ──────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode !== "subscription") return NextResponse.json({ ok: true });

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan ?? "monthly";
    const trialDays = Number(session.metadata?.trial_days ?? 0) || null;
    const customerEmail = session.customer_details?.email ?? "";
    const stripeCustomerId = session.customer as string;
    const stripeSubscriptionId = session.subscription as string;

    if (!userId) {
      Sentry.captureMessage("[stripe-webhook] no userId in checkout metadata", "error");
      console.error("[stripe-webhook] no userId in metadata");
      return NextResponse.json({ error: "no_user" }, { status: 400 });
    }

    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    const premiumUntil = subscriptionPeriodEnd(subscription);

    // Activate premium and store Stripe IDs for cancellation lookup.
    await patchParentProfile(userId, {
      premium: true,
      premium_plan: plan,
      premium_until: premiumUntil,
      cancelled: false,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
    });

    logUserActivity({
      userId,
      email: customerEmail,
      activityType: trialDays ? "subscription_trial_started" : "subscription_started",
      source: "stripe_webhook",
      metadata: {
        plan,
        trialDays,
        premiumUntil,
        stripeCustomerId,
        stripeSubscriptionId,
        attribution: attributionFromMetadata(session.metadata),
        ...experimentFromMetadata(session.metadata),
      },
    }).catch(() => {});

    console.log(`[stripe-webhook] ✅ Premium activated for ${userId} (${plan})`);
  }

  // ── Subscription status changed/cancelled ────────────────────────────────
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const synced = await syncSubscription(subscription);

    if (synced) {
      logUserActivity({
        userId: synced.userId,
        email: synced.email,
        activityType: synced.cancelAtPeriodEnd || !synced.premium ? "subscription_cancelled" : "subscription_updated",
        source: "stripe_webhook",
        metadata: {
          plan: synced.plan,
          status: synced.status,
          premium: synced.premium,
          premiumUntil: synced.premiumUntil,
          cancelAtPeriodEnd: synced.cancelAtPeriodEnd,
          stripeSubscriptionId: subscription.id,
          attribution: synced.attribution,
          ...synced.experiment,
        },
      }).catch(() => {});
      console.log(`[stripe-webhook] Subscription ${synced.status} for ${synced.userId}`);
    }
  }

  // ── Subscription renewal paid ─────────────────────────────────────────────
  if (event.type === "invoice.paid" || event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoiceSubscriptionId(invoice);

    if (subscriptionId) {
      const stripe = getStripe();
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const synced = await syncSubscription(subscription);

      if (synced) {
        logUserActivity({
          userId: synced.userId,
          email: synced.email,
          activityType: "subscription_updated",
          source: "stripe_webhook",
          metadata: {
            plan: synced.plan,
            status: synced.status,
            premium: synced.premium,
            premiumUntil: synced.premiumUntil,
            stripeInvoiceId: invoice.id,
            stripeSubscriptionId: subscriptionId,
            billingReason: invoice.billing_reason,
            amountPaid: invoice.amount_paid,
            currency: invoice.currency,
            attribution: synced.attribution,
            ...synced.experiment,
          },
        }).catch(() => {});

        // Send payment emails from the paid invoice event so immediate checkouts,
        // trial conversions and renewals all use the same path. Resend keys make
        // duplicate Stripe deliveries safe; zero-value trial invoices stay silent.
        if (event.type === "invoice.paid" && invoice.amount_paid > 0) {
          const stripeCustomerId = subscription.customer as string;
          let customerEmail = invoice.customer_email ?? synced.email ?? "";
          let customerName = invoice.customer_name ?? "";

          if (!customerEmail && stripeCustomerId) {
            const customer = await stripe.customers.retrieve(stripeCustomerId);
            if (!customer.deleted) {
              customerEmail = customer.email ?? "";
              customerName = customer.name ?? customerName;
            }
          }

          const emailTasks: Promise<unknown>[] = [
            sendAdminPaymentNotificationEmail({
              customerEmail,
              plan: synced.plan as "monthly" | "yearly",
              amountTotal: invoice.amount_paid,
              currency: invoice.currency,
              stripeCustomerId,
              stripeSubscriptionId: subscriptionId,
              idempotencyKey: `cleverli-${invoice.id}-admin`,
            }),
          ];

          if (customerEmail) {
            emailTasks.push(sendPaymentConfirmationEmail(
              customerEmail,
              customerName,
              synced.plan as "monthly" | "yearly",
              { idempotencyKey: `cleverli-${invoice.id}-customer` },
            ));
          }

          const emailResults = await Promise.allSettled(emailTasks);
          emailResults.forEach((result, index) => {
            if (result.status === "rejected") {
              Sentry.captureException(result.reason);
              console.error(`[stripe-webhook] invoice payment email ${index} failed:`, result.reason);
            }
          });
        }

        console.log(`[stripe-webhook] Invoice paid synced subscription ${subscriptionId}`);
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "cleverli-stripe-webhook" });
}
