"use client";

import { trackBeginCheckout, type CheckoutPlan } from "@/lib/analytics";
import { encodeAttributionForCheckout } from "@/lib/attribution";
import { getSupabase } from "@/lib/supabase";
import {
  appendAdsExperimentAttribution,
  parseAdsExperimentAttribution,
  readAdsExperimentAttribution,
  type AdsExperimentAttribution,
} from "@/lib/adsAbVariant";
import { getMetaBrowserIdentifiers, trackMetaEvent } from "@/lib/metaPixel";

const CHECKOUT_PLANS = new Set<CheckoutPlan>(["monthly", "yearly"]);
let checkoutInFlightKey: string | null = null;

type CheckoutOptions = {
  trialDays?: number;
  experimentAttribution?: AdsExperimentAttribution | null;
};

export type PendingCheckoutIntent = {
  plan: CheckoutPlan;
  source: string;
  trialDays?: number;
  experimentAttribution: AdsExperimentAttribution | null;
};

function cleanTrialDays(value: string | number | null | undefined) {
  const parsed = typeof value === "number" ? value : Number(value);
  return parsed === 7 ? 7 : undefined;
}

function getCachedSupabaseAuth(): { accessToken: string; userId: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("cleverli_supabase_session");
    const cached = raw ? JSON.parse(raw) : null;
    if (!cached?.access_token || !cached?.user?.id) return null;
    return {
      accessToken: cached.access_token,
      userId: cached.user.id,
    };
  } catch {
    return null;
  }
}

async function getCheckoutAuth(userId?: string): Promise<{ token?: string; userId?: string }> {
  const cached = getCachedSupabaseAuth();
  if (cached) return { token: cached.accessToken, userId: cached.userId };

  const supabase = getSupabase();
  if (!supabase) return { userId };

  try {
    const sessionResult = await Promise.race([
      supabase.auth.getSession(),
      new Promise<null>(resolve => setTimeout(() => resolve(null), 1500)),
    ]);
    const session = sessionResult?.data.session;
    return {
      token: session?.access_token,
      userId: session?.user?.id ?? userId,
    };
  } catch {
    return { userId };
  }
}

export function getCheckoutAuthUrl(path: "/signup" | "/login", plan: CheckoutPlan, source: string, options: CheckoutOptions = {}) {
  const params = new URLSearchParams({ checkout: plan, source });
  if (options.trialDays) params.set("trial", String(options.trialDays));
  appendAdsExperimentAttribution(params, options.experimentAttribution ?? readAdsExperimentAttribution());
  return `${path}?${params.toString()}`;
}

export function getPendingCheckoutIntent(): PendingCheckoutIntent | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("checkout") as CheckoutPlan | null;
  if (!plan || !CHECKOUT_PLANS.has(plan)) return null;
  return {
    plan,
    source: params.get("source") || "auth_checkout_resume",
    trialDays: cleanTrialDays(params.get("trial")),
    experimentAttribution: parseAdsExperimentAttribution(params) ?? readAdsExperimentAttribution(),
  };
}

export async function startCheckout(plan: CheckoutPlan, source: string, userId?: string, options: CheckoutOptions = {}) {
  const trialDays = cleanTrialDays(options.trialDays);
  const experimentAttribution = options.experimentAttribution ?? readAdsExperimentAttribution();
  const checkoutKey = [plan, source, userId ?? "guest", trialDays ?? "no_trial"].join(":");
  if (checkoutInFlightKey) return;
  checkoutInFlightKey = checkoutKey;

  try {
    trackBeginCheckout(plan, source);

    const auth = await getCheckoutAuth(userId);
    const token = auth.token;
    const verifiedUserId = auth.userId;

    if (!verifiedUserId) {
      window.location.assign(getCheckoutAuthUrl("/signup", plan, source, { trialDays, experimentAttribution }));
      return;
    }

    if (!token) {
      window.location.assign(getCheckoutAuthUrl("/login", plan, source, { trialDays, experimentAttribution }));
      return;
    }

    const params = new URLSearchParams({ plan, uid: verifiedUserId, source });
    if (trialDays) params.set("trial", String(trialDays));
    appendAdsExperimentAttribution(params, experimentAttribution);
    const attribution = encodeAttributionForCheckout();
    if (attribution) params.set("attr", attribution);
    const meta = getMetaBrowserIdentifiers();
    if (meta.fbp) params.set("fbp", meta.fbp);
    if (meta.fbc) params.set("fbc", meta.fbc);
    const res = await fetch(`/api/checkout?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.url) {
      window.location.assign("/upgrade?checkout=error");
      return;
    }

    trackMetaEvent("InitiateCheckout", {
      currency: "CHF",
      value: plan === "yearly" ? 99 : 9.9,
      content_name: `Cleverli Premium ${plan}`,
      content_type: "product",
    }, body.metaEventId);

    window.location.assign(body.url);
  } catch (error) {
    checkoutInFlightKey = null;
    throw error;
  }
}
