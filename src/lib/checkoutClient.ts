"use client";

import { trackBeginCheckout, type CheckoutPlan } from "@/lib/analytics";
import { getSupabase } from "@/lib/supabase";

const CHECKOUT_PLANS = new Set<CheckoutPlan>(["monthly", "yearly"]);

function getCheckoutAuthUrl(path: "/signup" | "/login", plan: CheckoutPlan, source: string) {
  const params = new URLSearchParams({ checkout: plan, source });
  return `${path}?${params.toString()}`;
}

export function getPendingCheckoutIntent(): { plan: CheckoutPlan; source: string } | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("checkout") as CheckoutPlan | null;
  if (!plan || !CHECKOUT_PLANS.has(plan)) return null;
  return {
    plan,
    source: params.get("source") || "auth_checkout_resume",
  };
}

export async function startCheckout(plan: CheckoutPlan, source: string, userId?: string) {
  trackBeginCheckout(plan, source);

  const supabase = getSupabase();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  const token = data.session?.access_token;
  const verifiedUserId = data.session?.user?.id ?? userId;

  if (!verifiedUserId) {
    window.location.assign(getCheckoutAuthUrl("/signup", plan, source));
    return;
  }

  if (!token) {
    window.location.assign(getCheckoutAuthUrl("/login", plan, source));
    return;
  }

  const res = await fetch(`/api/checkout?plan=${plan}&uid=${verifiedUserId}`, {
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
