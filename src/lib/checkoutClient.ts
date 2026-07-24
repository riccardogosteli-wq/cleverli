"use client";

import { trackBeginCheckout, type CheckoutPlan } from "@/lib/analytics";
import { getSupabase } from "@/lib/supabase";

export async function startCheckout(plan: CheckoutPlan, source: string, userId?: string) {
  trackBeginCheckout(plan, source);

  if (!userId) {
    window.location.assign("/signup");
    return;
  }

  const supabase = getSupabase();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  const token = data.session?.access_token;

  if (!token) {
    window.location.assign("/login");
    return;
  }

  const res = await fetch(`/api/checkout?plan=${plan}&uid=${userId}`, {
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
