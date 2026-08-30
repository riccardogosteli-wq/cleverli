import { trackUserActivity } from "@/lib/userActivityClient";
import { checkoutAttributionEventParams } from "@/lib/attribution";
import {
  ADS_LP_EXPERIMENT,
  ensureAdsExperimentAttribution,
  resolveAdsLpTrackingVariant,
  type AdsLpVariant,
} from "@/lib/adsAbVariant";
import { trackMetaEvent } from "@/lib/metaPixel";

export type CheckoutPlan = "monthly" | "yearly" | "schooltime";
type AdsLpCtaType = "paid" | "free";
type AdsLpCtaLocation = "hero" | "pricing" | "bottom";
type AdsLpPageContext = {
  page?: string;
  page_path?: string;
  experiment?: string;
  variant?: AdsLpVariant;
  trial_days?: number;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_ADS_ID = "AW-18344865510";
const GOOGLE_ADS_PURCHASE_SEND_TO = `${GOOGLE_ADS_ID}/i_-4CK_QtNUcEObdwatE`;
const ADS_CTA_DEDUP_WINDOW_MS = 3_000;
const ADS_CTA_DEDUP_PREFIX = "cleverli_ads_cta_click:";
const ADS_CTA_SESSION_KEY = "cleverli_ads_cta_session_id";
const recentAdsCtaClicks = new Map<string, number>();

const PLAN_VALUE: Record<CheckoutPlan, number> = {
  monthly: 9.9,
  yearly: 99,
  schooltime: 249,
};

const PLAN_NAME: Record<CheckoutPlan, string> = {
  monthly: "Cleverli Premium Monatsabo",
  yearly: "Cleverli Premium Jahresabo",
  schooltime: "Cleverli Premium lebenslanger Zugang",
};

function isCheckoutPlan(plan: string | null): plan is CheckoutPlan {
  return plan === "monthly" || plan === "yearly" || plan === "schooltime";
}

function adsLpRequestContext() {
  if (typeof window === "undefined") return { forced_variant: false, internal_qa: false };
  const params = new URLSearchParams(window.location.search);
  return {
    forced_variant: params.has("ab"),
    internal_qa: params.get("utm_source")?.toLowerCase().startsWith("qa") ?? false,
  };
}

function adsCtaSessionId() {
  if (typeof window === "undefined") return null;

  try {
    const existing = window.sessionStorage.getItem(ADS_CTA_SESSION_KEY);
    if (existing) return existing;

    const created = typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(ADS_CTA_SESSION_KEY, created);
    return created;
  } catch {
    return null;
  }
}

function claimAdsCtaClick(key: string, now = Date.now()) {
  const memoryTimestamp = recentAdsCtaClicks.get(key);
  if (memoryTimestamp && now - memoryTimestamp < ADS_CTA_DEDUP_WINDOW_MS) return false;

  try {
    const storedTimestamp = Number(window.sessionStorage.getItem(`${ADS_CTA_DEDUP_PREFIX}${key}`));
    if (Number.isFinite(storedTimestamp) && now - storedTimestamp < ADS_CTA_DEDUP_WINDOW_MS) return false;
    window.sessionStorage.setItem(`${ADS_CTA_DEDUP_PREFIX}${key}`, String(now));
  } catch {
    // The in-memory guard still protects the current page when storage is blocked.
  }

  recentAdsCtaClicks.set(key, now);
  return true;
}

function adsCtaEventId() {
  return typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function pushDataLayerEvent(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...data });
}

function ensureGoogleAdsTag() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    document.head.appendChild(script);
  }

  window.gtag("config", GOOGLE_ADS_ID);
}

function trackGoogleAdsPurchaseConversion(transactionId: string, value: number) {
  if (typeof window === "undefined") return;
  ensureGoogleAdsTag();
  window.gtag?.("event", "conversion", {
    send_to: GOOGLE_ADS_PURCHASE_SEND_TO,
    value,
    currency: "CHF",
    transaction_id: transactionId,
  });
}

export function trackSignUp(method = "email") {
  pushDataLayerEvent("sign_up", { method });
  trackMetaEvent("CompleteRegistration", { content_name: "Cleverli account", status: true });
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
  trackMetaEvent("StartTrial", {
    currency: "CHF",
    value: PLAN_VALUE[plan],
    predicted_ltv: PLAN_VALUE[plan],
    content_name: PLAN_NAME[plan],
    trial_days: trialDays,
  }, transactionId ? `trial_${transactionId}` : null);
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
  const dedupeKey = [pagePath, type, destination].join(":");
  if (!claimAdsCtaClick(dedupeKey)) return false;

  const variant = resolveAdsLpTrackingVariant(pageContext.variant);
  const experimentAttribution = ensureAdsExperimentAttribution(variant, page);
  const requestContext = adsLpRequestContext();
  const eventId = adsCtaEventId();
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
    experiment: pageContext.experiment ?? ADS_LP_EXPERIMENT,
    variant,
    experiment_visitor_id: experimentAttribution?.visitorId ?? null,
    experiment_page: experimentAttribution?.page ?? page,
    ...(pageContext.trial_days ? { trial_days: pageContext.trial_days } : {}),
    cta_event_id: eventId,
    cta_session_id: adsCtaSessionId(),
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
  return true;
}

export function trackPurchase(planParam: string | null, transactionIdParam: string | null) {
  const plan = isCheckoutPlan(planParam) ? planParam : "monthly";
  const transactionId = transactionIdParam || `cleverli_${plan}_${Date.now()}`;
  const value = PLAN_VALUE[plan];

  pushDataLayerEvent("purchase", {
    transaction_id: transactionId,
    currency: "CHF",
    value,
    plan,
    ...checkoutAttributionEventParams(),
    items: [
      {
        item_id: `cleverli_premium_${plan}`,
        item_name: PLAN_NAME[plan],
        price: value,
        quantity: 1,
      },
    ],
  });
  trackGoogleAdsPurchaseConversion(transactionId, value);
}
