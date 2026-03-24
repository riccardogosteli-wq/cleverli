import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.cleverli.ch";

const PRICE_IDS: Record<string, string> = {
  monthly: "price_1TEQiwDGUBi3vyUQcMa6mD3P",
  yearly: "price_1TEQiwDGUBi3vyUQVIRKNl42",
};

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan") ?? "monthly";
  const userId = req.nextUrl.searchParams.get("uid") ?? "";

  // Guest: redirect to signup
  if (!userId) {
    const signupUrl = `${BASE_URL}/signup?next=/api/checkout?plan=${plan}`;
    return NextResponse.redirect(signupUrl);
  }

  const priceId = PRICE_IDS[plan] ?? PRICE_IDS.monthly;

  // Get user email from Supabase
  let customerEmail: string | undefined;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabase.auth.admin.getUserById(userId);
    customerEmail = data.user?.email ?? undefined;
  } catch (e) {
    console.error("[checkout] Supabase user lookup failed:", e);
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_types: ["card"],
      success_url: `${BASE_URL}/payment/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/payment/cancel`,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      metadata: {
        userId,
        plan,
        site: "cleverli.ch",
      },
      subscription_data: {
        metadata: {
          userId,
          plan,
          site: "cleverli.ch",
        },
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "gateway_failed" }, { status: 500 });
    }

    return NextResponse.redirect(session.url, 302);
  } catch (err) {
    console.error("[checkout] Stripe error:", err);
    return NextResponse.json({ error: "gateway_failed" }, { status: 500 });
  }
}
