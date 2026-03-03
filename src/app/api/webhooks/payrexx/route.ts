import { NextRequest, NextResponse } from "next/server";

// Payrexx sends transaction status updates here
// Configure webhook URL in Payrexx dashboard:
//   https://www.cleverli.ch/api/webhooks/payrexx

const SUPABASE_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SIGNING_KEY    = process.env.PAYREXX_SIGNING_KEY ?? "";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const text = await req.text();

    // Verify Payrexx webhook signature
    if (SIGNING_KEY) {
      const sig = req.headers.get("payrexx-signature") ?? req.headers.get("x-payrexx-signature") ?? "";
      const { createHmac } = await import("crypto");
      const expected = createHmac("sha256", SIGNING_KEY).update(text).digest("hex");
      if (sig && sig !== expected) {
        console.warn("[payrexx-webhook] invalid signature");
        return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
      }
    }
    try {
      body = JSON.parse(text);
    } catch {
      // form-encoded fallback
      body = Object.fromEntries(new URLSearchParams(text));
    }
  } catch {
    return NextResponse.json({ error: "bad_body" }, { status: 400 });
  }

  // Payrexx webhook structure:
  // { transaction: { status, referenceId, paidAmount, currency, ... } }
  const txn = (body.transaction ?? body) as Record<string, unknown>;
  const status      = String(txn.status ?? "");
  const referenceId = String(txn.referenceId ?? "");

  console.log("[payrexx-webhook]", { status, referenceId });

  // Only act on confirmed/completed payments
  if (status !== "confirmed" && status !== "completed") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  // referenceId format: "monthly:supabase-user-uuid" or "yearly:uuid"
  const parts  = referenceId.split(":");
  const plan   = parts[0] ?? "monthly";
  const userId = parts[1] ?? null;

  if (!userId) {
    console.warn("[payrexx-webhook] no userId in referenceId:", referenceId);
    return NextResponse.json({ ok: true, warning: "no_user" });
  }

  // Calculate premium_until date
  const now = new Date();
  const premiumUntil = plan === "yearly"
    ? new Date(now.setFullYear(now.getFullYear() + 1)).toISOString()
    : new Date(now.setMonth(now.getMonth() + 1)).toISOString();

  // Flip premium=true in Supabase via REST API (service role bypasses RLS)
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
      body: JSON.stringify({
        premium: true,
        premium_plan: plan,
        premium_until: premiumUntil,
        cancelled: false,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.text();
    console.error("[payrexx-webhook] supabase update failed:", err);
    return NextResponse.json({ error: "db_update_failed" }, { status: 500 });
  }

  console.log(`[payrexx-webhook] ✅ Premium activated for ${userId} (${plan}) until ${premiumUntil}`);
  return NextResponse.json({ ok: true });
}

// Payrexx also sends GET pings to verify the webhook URL
export async function GET() {
  return NextResponse.json({ ok: true, service: "cleverli-payrexx-webhook" });
}
