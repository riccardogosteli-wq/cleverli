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

async function updateSupabasePremium(
  userId: string,
  plan: string,
  premium: boolean,
  premiumUntil: string | null,
  cancelled = false
) {
  await patchParentProfile(userId, {
    premium,
    premium_plan: premium ? plan : null,
    premium_until: premium ? premiumUntil : null,
    cancelled,
  });
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
      },
    }).catch(() => {});

    // Trial checkouts have no charge today, so avoid a payment-confirmation email.
    if (customerEmail && !trialDays) {
      sendPaymentConfirmationEmail(customerEmail, "", plan as "monthly" | "yearly").catch(error => {
        Sentry.captureException(error);
      });
      sendAdminPaymentNotificationEmail({
        customerEmail,
        plan: plan as "monthly" | "yearly",
        amountTotal: session.amount_total,
        currency: session.currency,
        stripeCustomerId,
        stripeSubscriptionId,
      }).catch(error => {
        Sentry.captureException(error);
      });
    }

    console.log(`[stripe-webhook] ✅ Premium activated for ${userId} (${plan})`);
  }

  // ── Subscription status changed/cancelled ────────────────────────────────
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.userId;
    const plan = subscription.metadata?.plan ?? "monthly";
    const status = subscription.status;
    const cancelAtPeriodEnd = subscription.cancel_at_period_end;
    const premiumUntil = subscriptionPeriodEnd(subscription);
    const premium = ["active", "trialing", "past_due"].includes(status);

    if (userId) {
      await updateSupabasePremium(userId, plan, premium, premiumUntil, cancelAtPeriodEnd || !premium);
      logUserActivity({
        userId,
        activityType: cancelAtPeriodEnd || !premium ? "subscription_cancelled" : "subscription_updated",
        source: "stripe_webhook",
        metadata: { plan, status, premium, premiumUntil, cancelAtPeriodEnd },
      }).catch(() => {});
      console.log(`[stripe-webhook] Subscription ${status} for ${userId}`);
    } else {
      // Fallback: look up by stripe_customer_id
      const user = await getUserByStripeCustomer(subscription.customer as string);
      if (user) {
        await updateSupabasePremium(user.userId, plan, premium, premiumUntil, cancelAtPeriodEnd || !premium);
        logUserActivity({
          userId: user.userId,
          email: user.email,
          activityType: cancelAtPeriodEnd || !premium ? "subscription_cancelled" : "subscription_updated",
          source: "stripe_webhook",
          metadata: { plan, status, premium, premiumUntil, cancelAtPeriodEnd },
        }).catch(() => {});
        console.log(`[stripe-webhook] Subscription ${status} for ${user.userId} (by customer ID)`);
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "cleverli-stripe-webhook" });
}
