type CheckoutPlan = "monthly" | "yearly";
type AdsLpCtaType = "paid" | "free";
type AdsLpCtaLocation = "hero" | "pricing" | "bottom";

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

export function trackAdsLpCtaClick(type: AdsLpCtaType, location: AdsLpCtaLocation, destination: string, plan?: CheckoutPlan) {
  pushDataLayerEvent(type === "paid" ? "ads_lp_paid_cta_click" : "ads_lp_free_cta_click", {
    page: "primarschule_uebungen",
    page_path: "/primarschule-uebungen",
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
