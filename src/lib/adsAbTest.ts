"use client";

import { useEffect, useState } from "react";
import { pushDataLayerEvent } from "@/lib/analytics";
import { trackUserActivity } from "@/lib/userActivityClient";
import {
  getAdsLpVariant,
  readForcedAdsLpVariant,
  type AdsLpVariant,
} from "@/lib/adsAbVariant";

export { getAdsLpVariant, type AdsLpVariant } from "@/lib/adsAbVariant";

function isInternalQaRequest() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("utm_source")?.toLowerCase().startsWith("qa") ?? false;
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
    forced_variant: Boolean(readForcedAdsLpVariant()),
    internal_qa: isInternalQaRequest(),
  });
  trackUserActivity("ads_lp_ab_assignment", {
    path: pagePath,
    source: "ads_lp_ab_test",
    accessToken: null,
    metadata: {
      page,
      page_path: pagePath,
      experiment: "ads_lp_7_day_trial",
      variant,
      forced_variant: Boolean(readForcedAdsLpVariant()),
      internal_qa: isInternalQaRequest(),
    },
  });
}
