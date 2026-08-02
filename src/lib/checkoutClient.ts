"use client";

import { trackBeginCheckout, type CheckoutPlan } from "@/lib/analytics";
import { getSupabase } from "@/lib/supabase";

const CHECKOUT_PLANS = new Set<CheckoutPlan>(["monthly", "yearly"]);

type CheckoutOptions = {
  trialDays?: number;
};

function cleanTrialDays(value: string | number | null | undefined) {
  const parsed = typeof value === "number" ? value : Number(value);
  return parsed === 7 ? 7 : undefined;
}

function getCheckoutAuthUrl(path: "/signup" | "/login", plan: CheckoutPlan, source: string, options: CheckoutOptions = {}) {
  const params = new URLSearchParams({ checkout: plan, source });
  if (options.trialDays) params.set("trial", String(options.trialDays));
  return `${path}?${params.toString()}`;
}

export function getPendingCheckoutIntent(): { plan: CheckoutPlan; source: string; trialDays?: number } | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("checkout") as CheckoutPlan | null;
  if (!plan || !CHECKOUT_PLANS.has(plan)) return null;
  return {
    plan,
    source: params.get("source") || "auth_checkout_resume",
    trialDays: cleanTrialDays(params.get("trial")),
  };
}

export async function startCheckout(plan: CheckoutPlan, source: string, userId?: string, options: CheckoutOptions = {}) {
  trackBeginCheckout(plan, source);

  const supabase = getSupabase();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  const token = data.session?.access_token;
  const verifiedUserId = data.session?.user?.id ?? userId;

  if (!verifiedUserId) {
    window.location.assign(getCheckoutAuthUrl("/signup", plan, source, options));
    return;
  }

  if (!token) {
    window.location.assign(getCheckoutAuthUrl("/login", plan, source, options));
    return;
  }

  const params = new URLSearchParams({ plan, uid: verifiedUserId, source });
  if (options.trialDays) params.set("trial", String(options.trialDays));
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

  window.location.assign(body.url);
}
