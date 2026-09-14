import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { verifiedCheckoutOutcome } from "@/lib/verifiedCheckout";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store, private", "Vary": "Authorization", "Referrer-Policy": "no-referrer" };
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers });

/** Authenticated read only. Never grants entitlements or creates Stripe objects/events. */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (req.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== req.nextUrl.origin))
    return reply({ error: "forbidden" }, 403);
  const token = req.headers.get("authorization")?.match(/^Bearer (\S+)$/)?.[1];
  if (!token) return reply({ error: "unauthorized" }, 401);
  if (!req.headers.get("content-type")?.startsWith("application/json")) return reply({ error: "invalid_request" }, 400);
  try {
    const body = await req.text();
    if (body.length > 512) return reply({ error: "invalid_request" }, 400);
    let sessionId: unknown;
    try { sessionId = JSON.parse(body).sessionId; } catch { return reply({ error: "invalid_request" }, 400); }
    if (typeof sessionId !== "string" || !/^cs_[a-zA-Z0-9_]{8,200}$/.test(sessionId))
      return reply({ error: "invalid_request" }, 400);
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return reply({ error: "unauthorized" }, 401);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["subscription", "invoice", "payment_intent"] });
    // A missing session and another user's session deliberately share the same response.
    if (session.metadata?.userId !== data.user.id) return reply({ error: "not_found" }, 404);
    const outcome = verifiedCheckoutOutcome(session, data.user.id);
    return reply({ outcome });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeInvalidRequestError) return reply({ error: "not_found" }, 404);
    // No raw provider exceptions, tokens, customer details or session URLs in logs/responses.
    return reply({ error: "verification_unavailable" }, 503);
  }
}
