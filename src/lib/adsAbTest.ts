"use client";

import { useEffect, useState } from "react";
import { pushDataLayerEvent } from "@/lib/analytics";
import { trackUserActivity } from "@/lib/userActivityClient";

export type AdsLpVariant = "control" | "trial";

const STORAGE_KEY = "cleverli_ads_lp_ab_variant";
const VALID_VARIANTS = new Set<AdsLpVariant>(["control", "trial"]);

function readForcedVariant(): AdsLpVariant | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("ab");
  return VALID_VARIANTS.has(value as AdsLpVariant) ? (value as AdsLpVariant) : null;
}

function readStoredVariant(): AdsLpVariant | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return VALID_VARIANTS.has(value as AdsLpVariant) ? (value as AdsLpVariant) : null;
  } catch {
    return null;
  }
}

function storeVariant(variant: AdsLpVariant) {
  try {
    window.localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    // The page still works if storage is blocked.
  }
}

export function getAdsLpVariant(): AdsLpVariant {
  if (typeof window === "undefined") return "control";

  const forced = readForcedVariant();
  if (forced) {
    storeVariant(forced);
    return forced;
  }

  const stored = readStoredVariant();
  if (stored) return stored;

  const variant: AdsLpVariant = Math.random() < 0.5 ? "control" : "trial";
  storeVariant(variant);
  return variant;
}

export function useAdsLpVariant(page: string, pagePath: string): AdsLpVariant {
  const [variant, setVariant] = useState<AdsLpVariant>("control");

  useEffect(() => {
    const assigned = getAdsLpVariant();
    setVariant(assigned);
    trackAdsLpVariantAssignment(page, pagePath, assigned);
  }, [page, pagePath]);

  return variant;
}

export function trackAdsLpVariantAssignment(page: string, pagePath: string, variant: AdsLpVariant) {
  if (typeof window === "undefined") return;
  const key = `cleverli_ads_lp_ab_seen:${page}:${variant}`;
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "true");
  } catch {
    // Duplicate protection is best-effort.
  }

  pushDataLayerEvent("ads_lp_ab_assignment", {
    page,
    page_path: pagePath,
    experiment: "ads_lp_7_day_trial",
    variant,
  });
  trackUserActivity("ads_lp_ab_assignment", {
    path: pagePath,
    source: "ads_lp_ab_test",
    metadata: {
      page,
      page_path: pagePath,
      experiment: "ads_lp_7_day_trial",
      variant,
    },
  });
}
