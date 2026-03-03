import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const INSTANCE  = "cleverli";
const API_KEY   = process.env.PAYREXX_API_KEY ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function payrexx(method: string, path: string, body?: Record<string, unknown>) {
  const res = await fetch(`https://api.payrexx.com/v1/${path}/?instance=${INSTANCE}`, {
    method,
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
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

  // ── Find subscription(s) for this user via referenceId lookup ──────────────
  // referenceId format we used when creating gateways: "{plan}:{userId}"
  const subs = await payrexx("GET", "Subscription");

  let cancelledCount = 0;
  let cancelError = "";

  if (subs?.data?.length) {
    for (const sub of subs.data) {
      const ref: string = sub.referenceId ?? "";
      // Match any subscription whose referenceId ends with ":userId"
      if (ref.endsWith(`:${userId}`) || ref === userId) {
        const delResult = await payrexx("DELETE", `Subscription/${sub.id}`);
        if (delResult?.status === "success") {
          cancelledCount++;
        } else {
          cancelError = delResult?.message ?? "cancel_failed";
        }
      }
    }
  }

  // ── Flip premium=false in Supabase regardless (user requested cancel) ──────
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
      body: JSON.stringify({ premium: false }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.text();
    console.error("[cancel-subscription] supabase update failed:", err);
    return NextResponse.json({ error: "db_update_failed" }, { status: 500 });
  }

  console.log(`[cancel-subscription] ✅ Cancelled ${cancelledCount} subscriptions for ${userId}. DB updated.`);

  if (cancelError && cancelledCount === 0) {
    // Subscription may already be cancelled on Payrexx side — premium is still set to false
    return NextResponse.json({ ok: true, warning: cancelError });
  }

  return NextResponse.json({ ok: true, cancelledCount });
}
