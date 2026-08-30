"use client";

const FIRST_TOUCH_KEY = "cleverli_attribution_first";
const LAST_TOUCH_KEY = "cleverli_attribution_last";
const ANONYMOUS_SESSION_KEY = "cleverli_telemetry_session";

const PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "fbclid",
] as const;

type AttributionParam = (typeof PARAMS)[number];

export type AttributionTouch = {
  capturedAt: string;
  channel: string;
  landingPage: string;
  path: string;
  referrer: string | null;
} & Partial<Record<AttributionParam, string>>;

export type AttributionSnapshot = {
  first: AttributionTouch | null;
  last: AttributionTouch | null;
  current: AttributionTouch | null;
};

export type TelemetryAttributionTouch = Pick<AttributionTouch,
  "capturedAt" | "channel" | "landingPage" | "path" | "referrer"
> & Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content", string>> & {
  hasGoogleClickId: boolean;
  hasMetaClickId: boolean;
  hasMicrosoftClickId: boolean;
};

export type TelemetryAttributionSnapshot = {
  first: TelemetryAttributionTouch | null;
  last: TelemetryAttributionTouch | null;
  current: TelemetryAttributionTouch | null;
};

function readTouch(key: string): AttributionTouch | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeTouch(key: string, touch: AttributionTouch) {
  try {
    localStorage.setItem(key, JSON.stringify(touch));
  } catch {
    // Attribution must never break the product.
  }
}

function clean(value: string | null, max = 180) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function referrerHost(referrer: string | null) {
  if (!referrer) return "";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function inferChannel(params: URLSearchParams, referrer: string | null) {
  const source = params.get("utm_source")?.toLowerCase() ?? "";
  const medium = params.get("utm_medium")?.toLowerCase() ?? "";
  const host = referrerHost(referrer);

  if (params.get("gclid") || params.get("gbraid") || params.get("wbraid")) return "google_ads";
  if (params.get("msclkid")) return "microsoft_ads";
  if (params.get("fbclid")) return "paid_social";
  if (["cpc", "ppc", "paid", "paid_search"].includes(medium)) return "paid_search";
  if (["paid_social", "social_paid"].includes(medium)) return "paid_social";
  if (medium === "organic") return "organic_search";
  if (["chatgpt", "openai", "perplexity", "claude", "gemini"].some(ai => source.includes(ai) || host.includes(ai))) return "ai_assistant";
  if (["google.", "bing.", "duckduckgo.", "search.yahoo."].some(search => host.includes(search))) return "organic_search";
  if (source || medium) return "campaign";
  if (host && !host.endsWith("cleverli.ch")) return "referral";
  return "direct";
}

function currentTouch(): AttributionTouch | null {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);
  const params = url.searchParams;
  const referrer = clean(document.referrer, 300);
  const touch: AttributionTouch = {
    capturedAt: new Date().toISOString(),
    channel: inferChannel(params, referrer),
    landingPage: `${url.pathname}${url.search}`,
    path: url.pathname,
    referrer,
  };

  for (const param of PARAMS) {
    const value = clean(params.get(param));
    if (value) touch[param] = value;
  }

  return touch;
}

function hasMeaningfulSignal(touch: AttributionTouch) {
  return touch.channel !== "direct" || PARAMS.some(param => Boolean(touch[param]));
}

export function captureAttribution() {
  const touch = currentTouch();
  if (!touch) return;

  if (!readTouch(FIRST_TOUCH_KEY)) {
    writeTouch(FIRST_TOUCH_KEY, touch);
  }

  const last = readTouch(LAST_TOUCH_KEY);
  // Keep the most recent meaningful acquisition touch. Internal navigation
  // must not replace a paid/organic/referral source with "direct".
  if (!last || hasMeaningfulSignal(touch)) {
    writeTouch(LAST_TOUCH_KEY, touch);
  }
}

export function getStoredAttribution(): AttributionSnapshot {
  if (typeof window === "undefined") return { first: null, last: null, current: null };
  return {
    first: readTouch(FIRST_TOUCH_KEY),
    last: readTouch(LAST_TOUCH_KEY),
    current: currentTouch(),
  };
}

export function getAnonymousSessionId() {
  if (typeof window === "undefined") return null;

  try {
    const existing = window.localStorage.getItem(ANONYMOUS_SESSION_KEY);
    if (existing) return existing.slice(0, 120);

    const created = typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(ANONYMOUS_SESSION_KEY, created);
    return created;
  } catch {
    return null;
  }
}

function telemetryTouch(touch: AttributionTouch | null): TelemetryAttributionTouch | null {
  if (!touch) return null;
  return {
    capturedAt: touch.capturedAt,
    channel: touch.channel,
    landingPage: scrubClickIds(touch.landingPage),
    path: touch.path,
    referrer: touch.referrer ? scrubClickIds(touch.referrer) : null,
    ...(touch.utm_source ? { utm_source: touch.utm_source } : {}),
    ...(touch.utm_medium ? { utm_medium: touch.utm_medium } : {}),
    ...(touch.utm_campaign ? { utm_campaign: touch.utm_campaign } : {}),
    ...(touch.utm_term ? { utm_term: touch.utm_term } : {}),
    ...(touch.utm_content ? { utm_content: touch.utm_content } : {}),
    hasGoogleClickId: Boolean(touch.gclid || touch.gbraid || touch.wbraid),
    hasMetaClickId: Boolean(touch.fbclid),
    hasMicrosoftClickId: Boolean(touch.msclkid),
  };
}

function scrubClickIds(value: string) {
  try {
    const absolute = /^https?:\/\//i.test(value);
    const url = new URL(value, "https://www.cleverli.ch");
    for (const param of ["gclid", "gbraid", "wbraid", "msclkid", "fbclid"]) {
      url.searchParams.delete(param);
    }
    return absolute
      ? `${url.origin}${url.pathname}${url.search}`
      : `${url.pathname}${url.search}`;
  } catch {
    return value.split("?")[0];
  }
}

export function getTelemetryAttribution(): TelemetryAttributionSnapshot {
  const attribution = getStoredAttribution();
  return {
    first: telemetryTouch(attribution.first),
    last: telemetryTouch(attribution.last),
    current: telemetryTouch(attribution.current),
  };
}

export function telemetryAttributionMetadata() {
  return {
    anonymous_session_id: getAnonymousSessionId(),
    attribution: getTelemetryAttribution(),
  };
}

export function encodeAttributionForCheckout() {
  try {
    return JSON.stringify(getStoredAttribution());
  } catch {
    return "";
  }
}

export function checkoutAttributionEventParams() {
  const attribution = getStoredAttribution();
  const first = attribution.first;
  const last = attribution.last;

  return {
    first_channel: first?.channel,
    first_landing_page: first?.landingPage,
    first_referrer: first?.referrer,
    first_utm_source: first?.utm_source,
    first_utm_medium: first?.utm_medium,
    first_utm_campaign: first?.utm_campaign,
    first_utm_term: first?.utm_term,
    first_utm_content: first?.utm_content,
    first_gclid_present: Boolean(first?.gclid || first?.gbraid || first?.wbraid),
    first_fbclid_present: Boolean(first?.fbclid),
    last_channel: last?.channel,
    last_landing_page: last?.landingPage,
    last_referrer: last?.referrer,
    last_utm_source: last?.utm_source,
    last_utm_medium: last?.utm_medium,
    last_utm_campaign: last?.utm_campaign,
    last_utm_term: last?.utm_term,
    last_utm_content: last?.utm_content,
    last_gclid_present: Boolean(last?.gclid || last?.gbraid || last?.wbraid),
    last_fbclid_present: Boolean(last?.fbclid),
  };
}
