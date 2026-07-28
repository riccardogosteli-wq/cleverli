import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { logUserActivity } from "@/lib/userActivityServer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.cleverli.ch";

const PRICE_IDS: Record<string, string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY ?? "price_1TEQiwDGUBi3vyUQcMa6mD3P",
  yearly: process.env.STRIPE_PRICE_YEARLY ?? "price_1TEQiwDGUBi3vyUQVIRKNl42",
};

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function wantsJson(req: NextRequest) {
  return req.headers.get("accept")?.includes("application/json");
}

async function verifyUserToken(userId: string, req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return false;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supabase.auth.getUser(token);
  return !error && data.user?.id === userId;
}

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan") ?? "monthly";
  const userId = req.nextUrl.searchParams.get("uid") ?? "";

  // Guest: redirect to signup
  if (!userId) {
    const signupUrl = `${BASE_URL}/signup?checkout=${encodeURIComponent(plan)}&source=checkout_api`;
    return wantsJson(req)
      ? NextResponse.json({ error: "login_required", url: signupUrl }, { status: 401 })
      : NextResponse.redirect(signupUrl);
  }

  const verified = await verifyUserToken(userId, req);
  if (!verified) {
    Sentry.captureMessage("[checkout] unauthorized uid checkout attempt", "warning");
    return wantsJson(req)
      ? NextResponse.json({ error: "unauthorized" }, { status: 401 })
      : NextResponse.redirect(`${BASE_URL}/login?checkout=${encodeURIComponent(plan)}&source=checkout_api`);
  }

  const priceId = PRICE_IDS[plan] ?? PRICE_IDS.monthly;

  // Get user email and existing Stripe customer from Supabase.
  let customerEmail: string | undefined;
  let stripeCustomerId: string | undefined;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabase.auth.admin.getUserById(userId);
    customerEmail = data.user?.email ?? undefined;

    const { data: profile } = await supabase
      .from("parent_profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();
    stripeCustomerId = profile?.stripe_customer_id ?? undefined;
  } catch (e) {
    Sentry.captureException(e);
    console.error("[checkout] Supabase user lookup failed:", e);
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      locale: "de",
      success_url: `${BASE_URL}/payment/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/payment/cancel`,
      ...(stripeCustomerId
        ? { customer: stripeCustomerId }
        : customerEmail
          ? { customer_email: customerEmail }
          : {}),
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
      Sentry.captureMessage("[checkout] Stripe session missing URL", "error");
      return NextResponse.json({ error: "gateway_failed" }, { status: 500 });
    }

    logUserActivity({
      userId,
      email: customerEmail ?? null,
      activityType: "checkout_started",
      source: req.nextUrl.searchParams.get("source") ?? "checkout_api",
      path: req.nextUrl.pathname,
      metadata: { plan, stripeSessionId: session.id },
    }).catch(() => {});

    return wantsJson(req)
      ? NextResponse.json({ url: session.url })
      : NextResponse.redirect(session.url, 302);
  } catch (err) {
    Sentry.captureException(err);
    console.error("[checkout] Stripe error:", err);
    return NextResponse.json({ error: "gateway_failed" }, { status: 500 });
  }
}
