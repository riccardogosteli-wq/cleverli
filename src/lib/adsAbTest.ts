"use client";

import { useEffect, useState } from "react";
import { pushDataLayerEvent } from "@/lib/analytics";
import { trackUserActivity } from "@/lib/userActivityClient";
import {
  ADS_LP_EXPERIMENT,
  ensureAdsExperimentAttribution,
  getAdsLpVariant,
  readForcedAdsLpVariant,
  type AdsLpVariant,
} from "@/lib/adsAbVariant";
import { telemetryAttributionMetadata } from "@/lib/attribution";

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
  const attribution = ensureAdsExperimentAttribution(variant, page);
  const key = `cleverli_ads_lp_ab_seen:${page}:${variant}`;
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "true");
  } catch {
    // Duplicate protection is best-effort.
  }

  const funnelAttribution = telemetryAttributionMetadata();
  pushDataLayerEvent("ads_lp_ab_assignment", {
    page,
    page_path: pagePath,
    experiment: ADS_LP_EXPERIMENT,
    variant,
    experiment_visitor_id: attribution?.visitorId ?? null,
    experiment_page: attribution?.page ?? page,
    forced_variant: Boolean(readForcedAdsLpVariant()),
    internal_qa: isInternalQaRequest(),
    anonymous_session_id: funnelAttribution.anonymous_session_id,
  });
  trackUserActivity("ads_lp_ab_assignment", {
    path: pagePath,
    source: "ads_lp_ab_test",
    accessToken: null,
    metadata: {
      page,
      page_path: pagePath,
      experiment: ADS_LP_EXPERIMENT,
      variant,
      experiment_visitor_id: attribution?.visitorId ?? null,
      experiment_page: attribution?.page ?? page,
      forced_variant: Boolean(readForcedAdsLpVariant()),
      internal_qa: isInternalQaRequest(),
      ...funnelAttribution,
    },
  });
}
