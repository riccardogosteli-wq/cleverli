import { trackUserActivity } from "@/lib/userActivityClient";
import { checkoutAttributionEventParams } from "@/lib/attribution";

export type CheckoutPlan = "monthly" | "yearly";
type AdsLpCtaType = "paid" | "free";
type AdsLpCtaLocation = "hero" | "pricing" | "bottom";
type AdsLpPageContext = {
  page?: string;
  page_path?: string;
  experiment?: string;
  variant?: string;
  trial_days?: number;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const PLAN_VALUE: Record<CheckoutPlan, number> = {
  monthly: 9.9,
  yearly: 99,
};

const PLAN_NAME: Record<CheckoutPlan, string> = {
  monthly: "Cleverli Premium Monatsabo",
  yearly: "Cleverli Premium Jahresabo",
};

function isCheckoutPlan(plan: string | null): plan is CheckoutPlan {
  return plan === "monthly" || plan === "yearly";
}

function adsLpRequestContext() {
  if (typeof window === "undefined") return { forced_variant: false, internal_qa: false };
  const params = new URLSearchParams(window.location.search);
  return {
    forced_variant: params.has("ab"),
    internal_qa: params.get("utm_source")?.toLowerCase().startsWith("qa") ?? false,
  };
}

export function pushDataLayerEvent(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...data });
}

export function trackSignUp(method = "email") {
  pushDataLayerEvent("sign_up", { method });
}

export function trackBeginCheckout(plan: CheckoutPlan, source: string) {
  pushDataLayerEvent("begin_checkout", {
    currency: "CHF",
    value: PLAN_VALUE[plan],
    plan,
    source,
    ...checkoutAttributionEventParams(),
    items: [
      {
        item_id: `cleverli_premium_${plan}`,
        item_name: PLAN_NAME[plan],
        price: PLAN_VALUE[plan],
        quantity: 1,
      },
    ],
  });
}

export function trackTrialStarted(plan: CheckoutPlan, source: string, trialDays: number, transactionId?: string | null) {
  pushDataLayerEvent("trial_started", {
    transaction_id: transactionId ?? undefined,
    currency: "CHF",
    value: PLAN_VALUE[plan],
    plan,
    source,
    trial_days: trialDays,
    ...checkoutAttributionEventParams(),
    items: [
      {
        item_id: `cleverli_premium_${plan}`,
        item_name: PLAN_NAME[plan],
        price: PLAN_VALUE[plan],
        quantity: 1,
      },
    ],
  });
}

export async function trackAdsLpCtaClick(
  type: AdsLpCtaType,
  location: AdsLpCtaLocation,
  destination: string,
  plan?: CheckoutPlan,
  pageContext: AdsLpPageContext = {},
) {
  const page = pageContext.page ?? "primarschule_uebungen";
  const pagePath = pageContext.page_path ?? "/primarschule-uebungen";
  const requestContext = adsLpRequestContext();
  const metadata = {
    page,
    page_path: pagePath,
    cta_type: type,
    cta_location: location,
    destination,
    ...(plan
      ? {
          currency: "CHF",
          value: PLAN_VALUE[plan],
          plan,
        }
      : {
          currency: null,
          value: null,
          plan: null,
        }),
    ...(pageContext.experiment ? { experiment: pageContext.experiment } : {}),
    ...(pageContext.variant ? { variant: pageContext.variant } : {}),
    ...(pageContext.trial_days ? { trial_days: pageContext.trial_days } : {}),
    ...requestContext,
  };

  pushDataLayerEvent(type === "paid" ? "ads_lp_paid_cta_click" : "ads_lp_free_cta_click", {
    ...metadata,
  });
  await trackUserActivity("ads_lp_cta_click", {
    path: pagePath,
    source: "ads_lp",
    accessToken: null,
    metadata,
  });
}

export function trackPurchase(planParam: string | null, transactionIdParam: string | null) {
  const plan = isCheckoutPlan(planParam) ? planParam : "monthly";
  const transactionId = transactionIdParam || `cleverli_${plan}_${Date.now()}`;

  pushDataLayerEvent("purchase", {
    transaction_id: transactionId,
    currency: "CHF",
    value: PLAN_VALUE[plan],
    plan,
    ...checkoutAttributionEventParams(),
    items: [
      {
        item_id: `cleverli_premium_${plan}`,
        item_name: PLAN_NAME[plan],
        price: PLAN_VALUE[plan],
        quantity: 1,
      },
    ],
  });
}
