export type AdsLpVariant = "control" | "trial";

export type AdsExperimentAttribution = {
  experiment: typeof ADS_LP_EXPERIMENT | typeof V5_CONTROL_COHORT;
  variant: AdsLpVariant;
  visitorId: string;
  page: string;
  internalQa: boolean;
  forcedVariant: boolean;
};

const STORAGE_KEY = "cleverli_ads_lp_ab_variant";
const VISITOR_STORAGE_KEY = "cleverli_ads_lp_ab_visitor_id";
const PAGE_STORAGE_KEY = "cleverli_ads_lp_ab_page";
const INTERNAL_QA_STORAGE_KEY = "cleverli_ads_lp_ab_internal_qa";
const FORCED_VARIANT_STORAGE_KEY = "cleverli_ads_lp_ab_forced";
export const ADS_LP_EXPERIMENT = "ads_lp_7_day_trial";
export const V5_CONTROL_COHORT = "meta_v5_deterministic_control";
const V5_ENTRY_KEY = "cleverli_v5_entry_attribution";
export function isV5ControlEntry() {
  if (typeof window === "undefined" || window.location.pathname !== "/primarschule-uebungen") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("entry") === "meta_v5_52537884711940";
}
function v5Attribution(): AdsExperimentAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    if (isV5ControlEntry()) {
      const visitorId = getOrCreateAdsExperimentVisitorId();
      if (!visitorId) return null;
      const value: AdsExperimentAttribution = { experiment: V5_CONTROL_COHORT, variant: "control", visitorId,
        page: "primarschule_uebungen", internalQa: false, forcedVariant: false };
      window.sessionStorage.setItem(V5_ENTRY_KEY, JSON.stringify(value));
      return value;
    }
    // New campaign entries do not inherit the preceding V5 cohort.
    if (new URLSearchParams(window.location.search).has("utm_campaign")) {
      window.sessionStorage.removeItem(V5_ENTRY_KEY);
      return null;
    }
    const raw = window.sessionStorage.getItem(V5_ENTRY_KEY);
    return raw ? JSON.parse(raw) as AdsExperimentAttribution : null;
  } catch { return null; }
}
const VALID_VARIANTS = new Set<AdsLpVariant>(["control", "trial"]);
const VALID_VISITOR_ID = /^[a-zA-Z0-9-]{8,100}$/;
const VALID_PAGE = /^[a-z0-9_]{1,80}$/;

function createVisitorId() {
  return typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function cleanVisitorId(value: string | null) {
  return value && VALID_VISITOR_ID.test(value) ? value : null;
}

function cleanPage(value: string | null) {
  return value && VALID_PAGE.test(value) ? value : null;
}

export function readForcedAdsLpVariant(): AdsLpVariant | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("ab");
  return VALID_VARIANTS.has(value as AdsLpVariant) ? (value as AdsLpVariant) : null;
}

export function readStoredAdsLpVariant(): AdsLpVariant | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return VALID_VARIANTS.has(value as AdsLpVariant) ? (value as AdsLpVariant) : null;
  } catch {
    return null;
  }
}

export function storeAdsLpVariant(variant: AdsLpVariant) {
  try {
    window.localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    // The page still works if storage is blocked.
  }
}

export function getOrCreateAdsExperimentVisitorId() {
  if (typeof window === "undefined") return null;
  try {
    const existing = cleanVisitorId(window.localStorage.getItem(VISITOR_STORAGE_KEY));
    if (existing) return existing;
    const created = createVisitorId();
    window.localStorage.setItem(VISITOR_STORAGE_KEY, created);
    return created;
  } catch {
    return null;
  }
}

export function readAdsExperimentAttribution(): AdsExperimentAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const v5 = v5Attribution();
    if (v5) return v5;
    const variant = readStoredAdsLpVariant();
    const visitorId = cleanVisitorId(window.localStorage.getItem(VISITOR_STORAGE_KEY));
    const page = cleanPage(window.localStorage.getItem(PAGE_STORAGE_KEY));
    const internalQa = window.localStorage.getItem(INTERNAL_QA_STORAGE_KEY) === "true";
    const forcedVariant = window.localStorage.getItem(FORCED_VARIANT_STORAGE_KEY) === "true";
    if (!variant || !visitorId || !page) return null;
    return { experiment: ADS_LP_EXPERIMENT, variant, visitorId, page, internalQa, forcedVariant };
  } catch {
    return null;
  }
}

export function ensureAdsExperimentAttribution(variant: AdsLpVariant, page: string) {
  if (typeof window === "undefined") return null;
  if (isV5ControlEntry()) return v5Attribution();
  const visitorId = getOrCreateAdsExperimentVisitorId();
  const cleanExperimentPage = cleanPage(page);
  if (!visitorId || !cleanExperimentPage) return null;
  try {
    storeAdsLpVariant(variant);
    const existingPage = cleanPage(window.localStorage.getItem(PAGE_STORAGE_KEY));
    const requestParams = new URLSearchParams(window.location.search);
    const internalQa = requestParams.get("utm_source")?.toLowerCase().startsWith("qa") ?? false;
    const forcedVariant = requestParams.has("ab");
    window.localStorage.setItem(PAGE_STORAGE_KEY, existingPage ?? cleanExperimentPage);
    if (internalQa) window.localStorage.setItem(INTERNAL_QA_STORAGE_KEY, "true");
    if (forcedVariant) window.localStorage.setItem(FORCED_VARIANT_STORAGE_KEY, "true");
    return {
      experiment: ADS_LP_EXPERIMENT,
      variant,
      visitorId,
      page: existingPage ?? cleanExperimentPage,
      internalQa: internalQa || window.localStorage.getItem(INTERNAL_QA_STORAGE_KEY) === "true",
      forcedVariant: forcedVariant || window.localStorage.getItem(FORCED_VARIANT_STORAGE_KEY) === "true",
    } satisfies AdsExperimentAttribution;
  } catch {
    return null;
  }
}

export function parseAdsExperimentAttribution(params: URLSearchParams): AdsExperimentAttribution | null {
  const experiment = params.get("ab_experiment");
  const variant = params.get("ab_variant");
  const visitorId = cleanVisitorId(params.get("ab_visitor"));
  const page = cleanPage(params.get("ab_page"));
  const internalQa = params.get("ab_internal_qa") === "1";
  const forcedVariant = params.get("ab_forced") === "1";
  if ((experiment !== ADS_LP_EXPERIMENT && experiment !== V5_CONTROL_COHORT) || !VALID_VARIANTS.has(variant as AdsLpVariant) || !visitorId || !page) {
    return null;
  }
  return { experiment, variant: variant as AdsLpVariant, visitorId, page, internalQa, forcedVariant };
}

export function parseAdsExperimentMetadata(metadata: Record<string, unknown> | null | undefined): AdsExperimentAttribution | null {
  const experiment = typeof metadata?.ads_ab_experiment === "string" ? metadata.ads_ab_experiment : null;
  const variant = typeof metadata?.ads_ab_variant === "string" ? metadata.ads_ab_variant : null;
  const visitorId = cleanVisitorId(typeof metadata?.ads_ab_visitor_id === "string" ? metadata.ads_ab_visitor_id : null);
  const page = cleanPage(typeof metadata?.ads_ab_page === "string" ? metadata.ads_ab_page : null);
  const internalQa = metadata?.ads_ab_internal_qa === true;
  const forcedVariant = metadata?.ads_ab_forced === true;
  if ((experiment !== ADS_LP_EXPERIMENT && experiment !== V5_CONTROL_COHORT) || !VALID_VARIANTS.has(variant as AdsLpVariant) || !visitorId || !page) {
    return null;
  }
  return { experiment, variant: variant as AdsLpVariant, visitorId, page, internalQa, forcedVariant };
}

export function appendAdsExperimentAttribution(params: URLSearchParams, attribution: AdsExperimentAttribution | null) {
  if (!attribution) return;
  params.set("ab_experiment", attribution.experiment);
  params.set("ab_variant", attribution.variant);
  params.set("ab_visitor", attribution.visitorId);
  params.set("ab_page", attribution.page);
  if (attribution.internalQa) params.set("ab_internal_qa", "1");
  if (attribution.forcedVariant) params.set("ab_forced", "1");
}

export function getAdsLpVariant(): AdsLpVariant {
  if (typeof window === "undefined") return "control";

  if (isV5ControlEntry()) return "control";
  try { window.sessionStorage.removeItem(V5_ENTRY_KEY); } catch { /* storage optional */ }
  const forced = readForcedAdsLpVariant();
  if (forced) {
    storeAdsLpVariant(forced);
    return forced;
  }

  const stored = readStoredAdsLpVariant();
  if (stored) return stored;

  const variant: AdsLpVariant = Math.random() < 0.5 ? "control" : "trial";
  storeAdsLpVariant(variant);
  return variant;
}

export function resolveAdsLpTrackingVariant(explicitVariant?: AdsLpVariant): AdsLpVariant {
  if (isV5ControlEntry()) return "control";
  return explicitVariant
    ?? readForcedAdsLpVariant()
    ?? readStoredAdsLpVariant()
    ?? "control";
}
