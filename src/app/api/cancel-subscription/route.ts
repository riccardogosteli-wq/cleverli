import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: NextRequest) {
  let userId: string;
  try {
    const body = await req.json();
    userId = body.userId;
    if (!userId) throw new Error("no userId");
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const stripe = getStripe();
  let cancelledCount = 0;
  let cancelError = "";

  // ── Find active Stripe subscriptions for this user via metadata ────────────
  try {
    const subscriptions = await stripe.subscriptions.list({
      limit: 10,
      status: "active",
    });

    for (const sub of subscriptions.data) {
      const meta = sub.metadata ?? {};
      if (meta.userId === userId) {
        // Cancel at period end (user keeps access until billing cycle ends)
        await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
        cancelledCount++;
      }
    }
  } catch (err) {
    cancelError = String(err);
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
    console.error("[cancel-subscription] Supabase update failed:", err);
    return NextResponse.json({ error: "db_update_failed" }, { status: 500 });
  }

  console.log(`[cancel-subscription] ✅ Cancellation recorded for ${userId}. Stripe subscriptions cancelled: ${cancelledCount}. Premium access continues until period end.`);

  if (cancelError && cancelledCount === 0) {
    return NextResponse.json({ ok: true, warning: cancelError });
  }

  return NextResponse.json({ ok: true, cancelledCount });
}
