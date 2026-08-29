import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
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
    if (!userId) throw new Error("no userId");
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const verified = await verifyUserToken(userId, req);
  if (!verified) {
    Sentry.captureMessage("[cancel-subscription] unauthorized cancellation attempt", "warning");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  let cancelledCount = 0;
  let cancelError = "";
  let customerEmail: string | null = null;

  // ── Prefer the stored subscription ID; fall back to metadata search ────────
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: profile } = await supabase
      .from("parent_profiles")
      .select("stripe_subscription_id, email")
      .eq("id", userId)
      .single();
    customerEmail = profile?.email ?? null;

    if (profile?.stripe_subscription_id) {
      await stripe.subscriptions.update(profile.stripe_subscription_id, { cancel_at_period_end: true });
      cancelledCount++;
    } else {
      const subscriptions = await stripe.subscriptions.list({
        limit: 10,
        status: "active",
      });

      for (const sub of subscriptions.data) {
        const meta = sub.metadata ?? {};
        if (meta.userId === userId) {
          await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
          cancelledCount++;
        }
      }
    }
  } catch (err) {
    cancelError = String(err);
    Sentry.captureException(err);
    console.error("[cancel-subscription] Stripe error:", err);
  }

  // ── Mark as cancelled in Supabase (premium stays true until period ends) ───
  const updateRes = await fetch(
    `${SUPABASE_URL}/rest/v1/parent_profiles?id=eq.${userId}`,
    {
      method: "PATCH",
      headers: {
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({ cancelled: true }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.text();
    Sentry.captureMessage(`[cancel-subscription] Supabase update failed: ${err}`, "error");
    console.error("[cancel-subscription] Supabase update failed:", err);
    return NextResponse.json({ error: "db_update_failed" }, { status: 500 });
  }

  console.log(`[cancel-subscription] ✅ Cancellation recorded for ${userId}. Stripe subscriptions cancelled: ${cancelledCount}. Premium access continues until period end.`);

  logUserActivity({
    userId,
    email: customerEmail,
    activityType: "subscription_cancel_requested",
    path: req.nextUrl.pathname,
    metadata: {
      cancelledCount,
      warning: cancelError || null,
      cancellationReason,
      cancellationReasonLabel: CANCELLATION_REASONS[cancellationReason],
      cancellationComment: cancellationComment || null,
      hasCancellationComment: Boolean(cancellationComment),
      retentionOffer: retentionOfferShown ? "yearly_66" : null,
      retentionOutcome: retentionOfferShown ? "declined" : null,
    },
  }).catch(() => {});

  if (cancelError && cancelledCount === 0) {
    return NextResponse.json({ ok: true, warning: cancelError });
  }

  return NextResponse.json({ ok: true, cancelledCount });
}
