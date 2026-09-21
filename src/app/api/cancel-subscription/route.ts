import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { BillingError, confirmCancellation, nonSubscriptionBilling, resolveSubscription, subscriptionBilling } from "@/lib/accountBilling";
import { logUserActivity } from "@/lib/userActivityServer";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

const CANCELLATION_REASONS: Record<string, string> = {
  too_expensive: "Zu teuer",
  child_not_using: "Kind nutzt es zu wenig",
  missing_content: "Passende Aufgaben fehlen",
  level_mismatch: "Niveau passt nicht",
  technical_issue: "Technisches Problem",
  pause_or_alternative: "Pause oder andere Lösung",
  found_alternative: "Nutzt Alternative",
  temporary_break: "Pause",
  other: "Anderer Grund",
  not_provided: "Kein Grund angegeben",
};

function cleanCancellationReason(value: unknown) {
  const reason = typeof value === "string" ? value : "not_provided";
  return CANCELLATION_REASONS[reason] ? reason : "other";
}

function cleanCancellationComment(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
}

async function verifyUserToken(userId: string, req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return false;

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data, error } = await supabase.auth.getUser(token);
  return !error && data.user?.id === userId;
}

export async function POST(req: NextRequest) {
  let userId: string;
  let cancellationReason = "not_provided";
  let cancellationComment = "";
  let retentionOfferShown = false;
  try {
    const body = await req.json();
    userId = body.userId;
    cancellationReason = cleanCancellationReason(body.cancellationReason);
    cancellationComment = cleanCancellationComment(body.cancellationComment);
    retentionOfferShown = body.retentionOfferShown === true && cancellationReason === "too_expensive";
    if (typeof userId !== "string" || !userId) throw new Error("no userId");
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const verified = await verifyUserToken(userId, req).catch(() => false);
  if (!verified) {
    Sentry.captureMessage("[cancel-subscription] unauthorized cancellation attempt", "warning");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: profile, error: profileError } = await supabase
      .from("parent_profiles")
      .select("stripe_subscription_id, stripe_customer_id, premium_plan, premium, premium_until, cancelled, email")
      .eq("id", userId).single();
    if (profileError || !profile) throw new BillingError("profile_unavailable", 503);

    const { subscriptionId, billing } = await confirmCancellation(getStripe(), profile, userId);
    // Compare-and-set identity and plan: do not overwrite a concurrent lifetime upgrade.
    // An unknown date must not erase an existing access limit and accidentally extend access.
    let update = supabase.from("parent_profiles").update({
      cancelled: true,
      stripe_subscription_id: subscriptionId,
      ...(billing.endAt ? { premium_until: billing.endAt } : {}),
      ...(billing.state === "ended" ? { premium: false } : {}),
    }).eq("id", userId);
    update = profile.premium_plan === null ? update.is("premium_plan", null) : update.eq("premium_plan", profile.premium_plan);
    update = profile.stripe_subscription_id === null ? update.is("stripe_subscription_id", null) : update.eq("stripe_subscription_id", profile.stripe_subscription_id);
    update = profile.stripe_customer_id === null ? update.is("stripe_customer_id", null) : update.eq("stripe_customer_id", profile.stripe_customer_id);
    const { data: updated, error: updateError } = await update.select("id");
    if (updateError || updated?.length !== 1) {
      // Stripe may already be cancelled. A retry reads it back without another update.
      throw new BillingError("cancellation_sync_pending", 503);
    }
    logUserActivity({
      userId,
      email: profile.email,
      activityType: "subscription_cancel_requested",
      path: req.nextUrl.pathname,
      metadata: {
        cancelledCount: 1,
        stripeSubscriptionId: subscriptionId,
        premiumUntil: billing.endAt,
        cancellationReason,
        cancellationReasonLabel: CANCELLATION_REASONS[cancellationReason],
        cancellationComment: cancellationComment || null,
        hasCancellationComment: Boolean(cancellationComment),
        retentionOffer: retentionOfferShown ? "yearly_66" : null,
        retentionOutcome: retentionOfferShown ? "declined" : null,
      },
    }).catch(() => {});
    return NextResponse.json({ ok: true, cancelledCount: 1, billing }, { headers: { "Cache-Control": "no-store, private" } });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: error instanceof BillingError ? error.code : "cancellation_failed" },
      { status: error instanceof BillingError ? error.status : 502 });
  }
}

// Authoritative, read-only account status. Never trusts client identity or legacy cancellation flags.
export async function GET(req: NextRequest) {
  const headers = { "Cache-Control": "no-store, private" };
  try {
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: auth, error: authError } = await supabase.auth.getUser(token);
    if (authError || !auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
    const { data: profile, error } = await supabase.from("parent_profiles")
      .select("stripe_subscription_id, stripe_customer_id, premium_plan, premium, premium_until, cancelled, email")
      .eq("id", auth.user.id).single();
    if (error || !profile) throw new BillingError("profile_unavailable", 503);
    const sub = profile.premium_plan === "schooltime" ? null : await resolveSubscription(getStripe(), profile, auth.user.id);
    const billing = sub ? subscriptionBilling(sub) : nonSubscriptionBilling(profile);
    return NextResponse.json({ billing }, { headers });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: error instanceof BillingError ? error.code : "billing_unavailable" },
      { status: error instanceof BillingError ? error.status : 502, headers });
  }
}
