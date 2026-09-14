import type { VerifiedCheckout } from "@/lib/verifiedCheckout";
import { trackUserActivity } from "@/lib/userActivityClient";
import {
  checkoutAttributionEventParams,
  getAnonymousSessionId,
  telemetryAttributionMetadata,
} from "@/lib/attribution";
import {
  ADS_LP_EXPERIMENT,
  isV5ControlEntry,
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
const GOOGLE_ADS_TRIAL_STARTED_SEND_TO = `${GOOGLE_ADS_ID}/PVdpCL6_ve0cEObdwatE`;
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
    forced_variant: !isV5ControlEntry() && params.has("ab"),
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

function trackGoogleAdsTrialStartedConversion(transactionId: string, value: number) {
  if (typeof window === "undefined") return;
  ensureGoogleAdsTag();
  window.gtag?.("event", "conversion", {
    send_to: GOOGLE_ADS_TRIAL_STARTED_SEND_TO,
    value,
    currency: "CHF",
    transaction_id: transactionId,
  });
}

export function trackSignUp(method = "email") {
  pushDataLayerEvent("sign_up", {
    method,
    anonymous_session_id: getAnonymousSessionId(),
    ...checkoutAttributionEventParams(),
  });
  trackMetaEvent("CompleteRegistration", { content_name: "Cleverli account", status: true });
}

export function trackSignupStarted() {
  const metadata = telemetryAttributionMetadata();
  pushDataLayerEvent("signup_started", {
    anonymous_session_id: metadata.anonymous_session_id,
    ...checkoutAttributionEventParams(),
  });
  return trackUserActivity("signup_started", {
    path: window.location.pathname,
    source: "signup_form",
    accessToken: null,
    metadata,
  });
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
    experiment: experimentAttribution?.experiment ?? pageContext.experiment ?? ADS_LP_EXPERIMENT,
    assignment_method: isV5ControlEntry() ? "deterministic_ad_entry" : "randomized",
    variant,
    experiment_visitor_id: experimentAttribution?.visitorId ?? null,
    experiment_page: experimentAttribution?.page ?? page,
    ...(pageContext.trial_days ? { trial_days: pageContext.trial_days } : {}),
    cta_event_id: eventId,
    cta_session_id: adsCtaSessionId(),
    ...telemetryAttributionMetadata(),
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

// Only suppress duplicates within this loaded document. Reloads/cross-browser retries
// intentionally replay stable provider IDs: enqueueing is NOT proof of ingestion.
const checkoutEventsQueued = new Set<string>();
export function trackVerifiedCheckout(outcome: VerifiedCheckout) {
  const { kind, plan, transactionId, metaEventId, value, currency } = outcome;
  if (!isCheckoutPlan(plan) || !/^cs_[a-zA-Z0-9_]+$/.test(transactionId) || currency !== "CHF" ||
      !Number.isFinite(value) || (kind !== "purchase" && kind !== "trial") ||
      (kind === "purchase" ? value <= 0 : value !== 0 || !(outcome.trialDays && outcome.trialDays > 0))) return;
  const key = `${kind}:${transactionId}`;
  if (checkoutEventsQueued.has(key)) return;
  pushDataLayerEvent(kind === "purchase" ? "purchase" : "trial_started", {
    transaction_id: transactionId, currency, value, plan,
    ...checkoutAttributionEventParams(),
    ...(kind === "trial" ? { trial_days: outcome.trialDays, source: "stripe_checkout_success" } : {}),
    items: [{ item_id: `cleverli_premium_${plan}`, item_name: PLAN_NAME[plan], price: value, quantity: 1 }],
  });
  if (kind === "purchase") trackGoogleAdsPurchaseConversion(transactionId, value);
  else trackGoogleAdsTrialStartedConversion(transactionId, 0);
  trackMetaEvent(kind === "purchase" ? "Purchase" : "StartTrial", {
    currency, value, content_name: PLAN_NAME[plan],
    ...(kind === "trial" ? { trial_days: outcome.trialDays } : {}),
  }, metaEventId);
  checkoutEventsQueued.add(key);
}
