export type AdsLpVariant = "control" | "trial";

const STORAGE_KEY = "cleverli_ads_lp_ab_variant";
const VALID_VARIANTS = new Set<AdsLpVariant>(["control", "trial"]);

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

export function getAdsLpVariant(): AdsLpVariant {
  if (typeof window === "undefined") return "control";

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
  return explicitVariant
    ?? readForcedAdsLpVariant()
    ?? readStoredAdsLpVariant()
    ?? "control";
}
