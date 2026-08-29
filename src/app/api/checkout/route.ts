import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { logUserActivity } from "@/lib/userActivityServer";
import { parseAdsExperimentAttribution, parseAdsExperimentMetadata } from "@/lib/adsAbVariant";

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

function trialDaysFromRequest(req: NextRequest) {
  return req.nextUrl.searchParams.get("trial") === "7" ? 7 : undefined;
}

function cleanText(value: unknown, max = 220) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;
}

function cleanAttribution(parsed: unknown) {
  try {
    const value = parsed as {
      first?: Record<string, unknown> | null;
      last?: Record<string, unknown> | null;
    };
    const cleanTouch = (touch: Record<string, unknown> | null | undefined) => {
      if (!touch) return null;
      return {
        channel: cleanText(touch.channel, 80),
        landingPage: cleanText(touch.landingPage),
        path: cleanText(touch.path),
        referrer: cleanText(touch.referrer, 300),
        utmSource: cleanText(touch.utm_source, 120),
        utmMedium: cleanText(touch.utm_medium, 120),
        utmCampaign: cleanText(touch.utm_campaign),
        utmTerm: cleanText(touch.utm_term),
        utmContent: cleanText(touch.utm_content),
        hasGoogleClickId: Boolean(touch.gclid || touch.gbraid || touch.wbraid),
        hasMicrosoftClickId: Boolean(touch.msclkid),
        hasFacebookClickId: Boolean(touch.fbclid),
        capturedAt: cleanText(touch.capturedAt, 40),
      };
    };

    return {
      first: cleanTouch(value.first),
      last: cleanTouch(value.last),
    };
  } catch {
    return null;
  }
}

function parseAttribution(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("attr");
  if (!raw || raw.length > 4096) return null;

  try {
    return cleanAttribution(JSON.parse(raw));
  } catch {
    return null;
  }
}

function stripeAttributionMetadata(attribution: ReturnType<typeof parseAttribution>): Record<string, string> {
  if (!attribution) return {};
  return {
    first_channel: attribution.first?.channel ?? "",
    first_landing_page: attribution.first?.landingPage ?? "",
    first_utm_source: attribution.first?.utmSource ?? "",
    first_utm_medium: attribution.first?.utmMedium ?? "",
    first_utm_campaign: attribution.first?.utmCampaign ?? "",
    first_google_click_id: attribution.first?.hasGoogleClickId ? "true" : "false",
    last_channel: attribution.last?.channel ?? "",
    last_landing_page: attribution.last?.landingPage ?? "",
    last_utm_source: attribution.last?.utmSource ?? "",
    last_utm_medium: attribution.last?.utmMedium ?? "",
    last_utm_campaign: attribution.last?.utmCampaign ?? "",
    last_google_click_id: attribution.last?.hasGoogleClickId ? "true" : "false",
  };
}

function stripeExperimentMetadata(attribution: ReturnType<typeof parseAdsExperimentAttribution>): Record<string, string> {
  if (!attribution) return {};
  return {
    experiment: attribution.experiment,
    variant: attribution.variant,
    experiment_visitor_id: attribution.visitorId,
    experiment_page: attribution.page,
    internal_qa: String(attribution.internalQa),
    forced_variant: String(attribution.forcedVariant),
  };
}

function getCheckoutIdempotencyKey(userId: string, plan: string, source: string, trialDays?: number) {
  const minuteBucket = Math.floor(Date.now() / 60_000);
  return [
    "checkout",
    userId,
    plan,
    source.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80),
    trialDays ? `trial_${trialDays}` : "paid",
    minuteBucket,
  ].join(":").slice(0, 240);
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
  const trialDays = trialDaysFromRequest(req);
  const checkoutSource = req.nextUrl.searchParams.get("source") ?? "checkout_api";
  let attribution = parseAttribution(req);
  let experimentAttribution = parseAdsExperimentAttribution(req.nextUrl.searchParams);

  // Guest: redirect to signup
  if (!userId) {
    const signupUrl = `${BASE_URL}/signup?checkout=${encodeURIComponent(plan)}&source=checkout_api${trialDays ? `&trial=${trialDays}` : ""}`;
    return wantsJson(req)
      ? NextResponse.json({ error: "login_required", url: signupUrl }, { status: 401 })
      : NextResponse.redirect(signupUrl);
  }

  const verified = await verifyUserToken(userId, req);
  if (!verified) {
    Sentry.captureMessage("[checkout] unauthorized uid checkout attempt", "warning");
    return wantsJson(req)
      ? NextResponse.json({ error: "unauthorized" }, { status: 401 })
      : NextResponse.redirect(`${BASE_URL}/login?checkout=${encodeURIComponent(plan)}&source=checkout_api${trialDays ? `&trial=${trialDays}` : ""}`);
  }

  const priceId = PRICE_IDS[plan] ?? PRICE_IDS.monthly;

  // Get user email and existing Stripe customer from Supabase.
  let customerEmail: string | undefined;
  let stripeCustomerId: string | undefined;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { data } = await supabase.auth.admin.getUserById(userId);
    customerEmail = data.user?.email ?? undefined;
    experimentAttribution ??= parseAdsExperimentMetadata(data.user?.user_metadata);
    attribution ??= cleanAttribution(data.user?.user_metadata?.attribution);

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
    const attributionMetadata = stripeAttributionMetadata(attribution);
    const experimentMetadata = stripeExperimentMetadata(experimentAttribution);
    const checkoutIdempotencyKey = getCheckoutIdempotencyKey(userId, plan, checkoutSource, trialDays);
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      locale: "de",
      success_url: `${BASE_URL}/payment/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}${trialDays ? `&trial=${trialDays}` : ""}`,
      cancel_url: `${BASE_URL}/payment/cancel`,
      ...(trialDays ? { payment_method_collection: "always" as const } : {}),
      ...(stripeCustomerId
        ? { customer: stripeCustomerId }
        : customerEmail
          ? { customer_email: customerEmail }
          : {}),
      metadata: {
        userId,
        plan,
        site: "cleverli.ch",
        checkout_source: checkoutSource,
        ...attributionMetadata,
        ...experimentMetadata,
        ...(trialDays ? { trial_days: String(trialDays) } : {}),
      },
      subscription_data: {
        ...(trialDays ? { trial_period_days: trialDays } : {}),
        metadata: {
          userId,
          plan,
          site: "cleverli.ch",
          checkout_source: checkoutSource,
          ...attributionMetadata,
          ...experimentMetadata,
          ...(trialDays ? { trial_days: String(trialDays) } : {}),
        },
      },
    };
    const session = await stripe.checkout.sessions.create(sessionParams, {
      idempotencyKey: checkoutIdempotencyKey,
    });

    if (!session.url) {
      Sentry.captureMessage("[checkout] Stripe session missing URL", "error");
      return NextResponse.json({ error: "gateway_failed" }, { status: 500 });
    }

    const { data: existingLog } = await supabase
      .from("user_activity_events")
      .select("id")
      .eq("activity_type", "checkout_started")
      .contains("metadata", { stripeSessionId: session.id })
      .limit(1)
      .maybeSingle();

    if (!existingLog) {
      logUserActivity({
        userId,
        email: customerEmail ?? null,
        activityType: "checkout_started",
        source: checkoutSource,
        path: req.nextUrl.pathname,
        metadata: {
          plan,
          trialDays: trialDays ?? null,
          stripeSessionId: session.id,
          attribution,
          checkout_source: checkoutSource,
          ...(experimentAttribution
            ? {
                experiment: experimentAttribution.experiment,
                variant: experimentAttribution.variant,
                experiment_visitor_id: experimentAttribution.visitorId,
                experiment_page: experimentAttribution.page,
                internal_qa: experimentAttribution.internalQa,
                forced_variant: experimentAttribution.forcedVariant,
              }
            : {}),
        },
      }).catch(() => {});
    }

    return wantsJson(req)
      ? NextResponse.json({ url: session.url })
      : NextResponse.redirect(session.url, 302);
  } catch (err) {
    Sentry.captureException(err);
    console.error("[checkout] Stripe error:", err);
    return NextResponse.json({ error: "gateway_failed" }, { status: 500 });
  }
}
