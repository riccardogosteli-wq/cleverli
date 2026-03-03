import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Payrexx sends transaction status updates here
// Configure webhook URL in Payrexx dashboard:
//   https://www.cleverli.ch/api/webhooks/payrexx

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // service role key needed for admin writes
);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    // Payrexx can send JSON or form-encoded body
    const text = await req.text();
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

  // Flip premium=true in Supabase
  const { error } = await supabase
    .from("parent_profiles")
    .update({ premium: true, premium_until: premiumUntil, premium_plan: plan })
    .eq("id", userId);

  if (error) {
    console.error("[payrexx-webhook] supabase update failed:", error);
    return NextResponse.json({ error: "db_update_failed" }, { status: 500 });
  }

  console.log(`[payrexx-webhook] ✅ Premium activated for ${userId} (${plan}) until ${premiumUntil}`);
  return NextResponse.json({ ok: true });
}

// Payrexx also sends GET pings to verify the webhook URL
export async function GET() {
  return NextResponse.json({ ok: true, service: "cleverli-payrexx-webhook" });
}
