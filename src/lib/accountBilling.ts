import type Stripe from "stripe";

export type AccountBilling = {
  state: "active" | "trial" | "cancelled" | "ended" | "lifetime" | "free" | "attention";
  endAt: string | null;
  accessActive: boolean;
  canCancel: boolean;
};
export type BillingProfile = {
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  premium_plan: string | null;
  premium: boolean;
  premium_until: string | null;
  cancelled: boolean;
  email: string | null;
};
export class BillingError extends Error {
  constructor(public code: string, public status = 409) { super(code); }
}
export function ownsSubscription(sub: Stripe.Subscription, profile: BillingProfile, userId: string) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  if (sub.metadata.userId && sub.metadata.userId !== userId) return false;
  if (profile.stripe_customer_id && customerId !== profile.stripe_customer_id) return false;
  return sub.metadata.userId === userId ||
    (profile.stripe_subscription_id === sub.id && profile.stripe_customer_id === customerId);
}
function iso(seconds: number | null | undefined) {
  return typeof seconds === "number" && Number.isFinite(seconds) && seconds > 0
    ? new Date(seconds * 1000).toISOString() : null;
}
export function subscriptionEnd(sub: Stripe.Subscription) {
  if (sub.status === "canceled") return iso(sub.ended_at);
  if (sub.cancel_at) return iso(sub.cancel_at);
  if (sub.status === "trialing") return iso(sub.trial_end);
  const legacy = (sub as Stripe.Subscription & { current_period_end?: number }).current_period_end;
  const ends = [...new Set(sub.items.data.map(item => item.current_period_end))];
  // Mixed item periods have no single authoritative end. Never invent one.
  return iso(legacy ?? (ends.length === 1 ? ends[0] : null));
}
export function subscriptionBilling(sub: Stripe.Subscription, now = Date.now()): AccountBilling {
  const endAt = subscriptionEnd(sub);
  const ended = sub.status === "canceled" || sub.status === "incomplete_expired";
  const cancelled = ended || sub.cancel_at_period_end || Boolean(sub.cancel_at);
  const accessActive = ["active", "trialing", "past_due"].includes(sub.status) && (!endAt || Date.parse(endAt) > now);
  return {
    state: ended || (cancelled && endAt !== null && Date.parse(endAt) <= now) ? "ended"
      : cancelled ? "cancelled" : sub.status === "trialing" ? "trial"
      : sub.status === "active" ? "active" : "attention",
    endAt,
    accessActive,
    canCancel: !cancelled && ["active", "trialing", "past_due", "unpaid", "paused"].includes(sub.status),
  };
}
export function nonSubscriptionBilling(profile: BillingProfile): AccountBilling {
  if (profile.premium_plan === "schooltime" && profile.premium) {
    return { state: "lifetime", endAt: null, accessActive: true, canCancel: false };
  }
  // A legacy cancelled flag alone does not prove that Stripe renewal stopped.
  if (profile.cancelled || profile.premium) throw new BillingError("subscription_not_found", 404);
  return { state: "free", endAt: null, accessActive: false, canCancel: false };
}

export async function resolveSubscription(stripe: Stripe, profile: BillingProfile, userId: string) {
  if (profile.premium_plan === "schooltime") throw new BillingError("lifetime_access");
  if (profile.stripe_subscription_id) {
    const sub = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
    if (!ownsSubscription(sub, profile, userId)) throw new BillingError("subscription_identity_mismatch");
    return sub;
  }
  if (!profile.stripe_customer_id) return null;
  const candidates: Stripe.Subscription[] = [];
  // Customer-scoped, paginated and exact metadata ownership. Never scan all customers.
  for await (const sub of stripe.subscriptions.list({ customer: profile.stripe_customer_id, status: "all", limit: 100 })) {
    if (!ownsSubscription(sub, profile, userId)) throw new BillingError("subscription_identity_mismatch");
    if (!["canceled", "incomplete_expired"].includes(sub.status)) candidates.push(sub);
  }
  if (candidates.length > 1) throw new BillingError("multiple_subscriptions");
  return candidates[0] ?? null;
}

export async function confirmCancellation(stripe: Stripe, profile: BillingProfile, userId: string) {
  const sub = await resolveSubscription(stripe, profile, userId);
  if (!sub) throw new BillingError("subscription_not_found", 404);
  const before = subscriptionBilling(sub);
  if (before.canCancel) {
    await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
  } else if (!["cancelled", "ended"].includes(before.state)) {
    throw new BillingError("subscription_not_cancellable");
  }
  const confirmed = await stripe.subscriptions.retrieve(sub.id);
  if (!ownsSubscription(confirmed, profile, userId)) throw new BillingError("subscription_identity_mismatch");
  const billing = subscriptionBilling(confirmed);
  if (!["cancelled", "ended"].includes(billing.state)) throw new BillingError("cancellation_not_confirmed", 502);
  return { subscriptionId: sub.id, billing };
}
