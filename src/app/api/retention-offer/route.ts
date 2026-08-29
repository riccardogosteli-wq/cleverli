import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { logUserActivity } from "@/lib/userActivityServer";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const YEARLY_PRICE_ID = process.env.STRIPE_PRICE_YEARLY ?? "price_1TEQiwDGUBi3vyUQVIRKNl42";
const RETENTION_PRICE_LOOKUP_KEY = "cleverli_retention_yearly_66";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

async function verifyUserToken(userId: string, req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return false;

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data, error } = await supabase.auth.getUser(token);
  return !error && data.user?.id === userId;
}

function subscriptionPeriodEnd(subscription: Stripe.Subscription) {
  return (
    (subscription as unknown as { current_period_end?: number }).current_period_end ??
    subscription.items.data[0]?.current_period_end ??
    null
  );
}

function priceId(price: string | Stripe.Price | Stripe.DeletedPrice) {
  return typeof price === "string" ? price : price.id;
}

async function getRetentionPrice(stripe: Stripe) {
  const existing = await stripe.prices.list({
    lookup_keys: [RETENTION_PRICE_LOOKUP_KEY],
    active: true,
    limit: 1,
  });
  if (existing.data[0]) {
    const price = existing.data[0];
    if (price.currency !== "chf" || price.unit_amount !== 6600 || price.recurring?.interval !== "year") {
      throw new Error("invalid_retention_price_configuration");
    }
    return price;
  }

  const yearlyPrice = await stripe.prices.retrieve(YEARLY_PRICE_ID);
  const product = typeof yearlyPrice.product === "string" ? yearlyPrice.product : yearlyPrice.product.id;

  return stripe.prices.create(
    {
      currency: "chf",
      unit_amount: 6600,
      recurring: { interval: "year" },
      product,
      ...(yearlyPrice.tax_behavior && yearlyPrice.tax_behavior !== "unspecified"
        ? { tax_behavior: yearlyPrice.tax_behavior }
        : {}),
      lookup_key: RETENTION_PRICE_LOOKUP_KEY,
      nickname: "Retention: CHF 66/Jahr",
      metadata: {
        offer: "yearly_66",
        standard_yearly_price: "9900",
      },
    },
    { idempotencyKey: "cleverli-retention-yearly-66-price-v1" }
  );
}

async function scheduleRetentionPrice(stripe: Stripe, subscription: Stripe.Subscription, retentionPriceId: string) {
  const periodEnd = subscriptionPeriodEnd(subscription);
  if (!periodEnd) throw new Error("missing_period_end");

  if (subscription.metadata.retention_offer === "yearly_66") {
    return { periodEnd, scheduleId: typeof subscription.schedule === "string" ? subscription.schedule : subscription.schedule?.id ?? null };
  }

  if (subscription.schedule) {
    const existingSchedule = typeof subscription.schedule === "string"
      ? await stripe.subscriptionSchedules.retrieve(subscription.schedule)
      : subscription.schedule;
    if (existingSchedule.metadata?.retention_offer === "yearly_66") {
      return { periodEnd, scheduleId: existingSchedule.id };
    }
    throw new Error("subscription_has_existing_schedule");
  }

  if (subscription.cancel_at_period_end) {
    await stripe.subscriptions.update(subscription.id, { cancel_at_period_end: false });
  }

  const schedule = await stripe.subscriptionSchedules.create({ from_subscription: subscription.id });
  const currentPhase = schedule.current_phase;
  if (!currentPhase) throw new Error("missing_current_schedule_phase");

  await stripe.subscriptionSchedules.update(schedule.id, {
    end_behavior: "release",
    proration_behavior: "none",
    metadata: {
      retention_offer: "yearly_66",
      retention_price_chf: "66",
    },
    phases: [
      {
        start_date: currentPhase.start_date,
        end_date: periodEnd,
        items: subscription.items.data.map(item => ({
          price: priceId(item.price),
          quantity: item.quantity ?? 1,
        })),
        proration_behavior: "none",
        ...(subscription.trial_end ? { trial_end: subscription.trial_end } : {}),
      },
      {
        start_date: periodEnd,
        items: [{ price: retentionPriceId, quantity: 1 }],
        proration_behavior: "none",
        metadata: {
          retention_offer: "yearly_66",
          retention_price_chf: "66",
        },
      },
    ],
  });

  await stripe.subscriptions.update(subscription.id, {
    metadata: {
      ...subscription.metadata,
      retention_offer: "yearly_66",
      retention_offer_accepted_at: new Date().toISOString(),
    },
  });

  return { periodEnd, scheduleId: schedule.id };
}

export async function POST(req: NextRequest) {
  let userId = "";
  try {
    const body = await req.json();
    userId = typeof body.userId === "string" ? body.userId : "";
    if (!userId) throw new Error("no_user_id");
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!(await verifyUserToken(userId, req))) {
    Sentry.captureMessage("[retention-offer] unauthorized attempt", "warning");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: profile, error: profileError } = await supabase
    .from("parent_profiles")
    .select("stripe_subscription_id, email")
    .eq("id", userId)
    .single();

  if (profileError || !profile?.stripe_subscription_id) {
    return NextResponse.json({ error: "subscription_not_found" }, { status: 404 });
  }

  try {
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
    if (!new Set(["active", "trialing", "past_due"]).has(subscription.status)) {
      return NextResponse.json({ error: "subscription_not_active" }, { status: 409 });
    }

    const retentionPrice = await getRetentionPrice(stripe);
    const { periodEnd, scheduleId } = await scheduleRetentionPrice(stripe, subscription, retentionPrice.id);

    const { error: updateError } = await supabase
      .from("parent_profiles")
      .update({ cancelled: false })
      .eq("id", userId);
    if (updateError) throw updateError;

    await logUserActivity({
      userId,
      email: profile.email,
      activityType: "subscription_updated",
      path: req.nextUrl.pathname,
      metadata: {
        retentionOffer: "yearly_66",
        retentionOutcome: "accepted",
        cancellationReason: "too_expensive",
        standardPriceChf: 99,
        retentionPriceChf: 66,
        effectiveAt: new Date(periodEnd * 1000).toISOString(),
        stripeScheduleId: scheduleId,
      },
    });

    return NextResponse.json({
      ok: true,
      yearlyPriceChf: 66,
      effectiveAt: new Date(periodEnd * 1000).toISOString(),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("[retention-offer] failed:", error);
    return NextResponse.json({ error: "offer_activation_failed" }, { status: 500 });
  }
}
