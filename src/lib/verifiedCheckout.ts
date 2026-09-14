import type Stripe from "stripe";

export type VerifiedCheckout = {
  kind: "purchase" | "trial";
  plan: "monthly" | "yearly" | "schooltime";
  transactionId: string;
  metaEventId: string;
  value: number;
  currency: string;
  trialDays?: number;
};

/** Pure allow-list: URL hints, customer data and Stripe objects never reach analytics. */
export function verifiedCheckoutOutcome(session: Stripe.Checkout.Session, userId: string): VerifiedCheckout | null {
  const plan = session.metadata?.plan;
  if (session.metadata?.userId !== userId || session.metadata?.site !== "cleverli.ch" ||
      session.status !== "complete" || !/^cs_[a-zA-Z0-9_]+$/.test(session.id) ||
      !["monthly", "yearly", "schooltime"].includes(plan ?? "")) return null;
  const currency = session.currency?.toUpperCase();
  // Cleverli checkout currently supports CHF only; fail closed for an unexpected currency.
  if (currency !== "CHF") return null;
  const base = { plan: plan as VerifiedCheckout["plan"], transactionId: session.id, currency };
  const subscription = typeof session.subscription === "object" ? session.subscription : null;
  if (session.mode === "subscription" && plan !== "schooltime" && subscription &&
      subscription.status === "trialing" && ["paid", "no_payment_required"].includes(session.payment_status) &&
      session.amount_total === 0 && subscription.trial_start && subscription.trial_end &&
      subscription.trial_end > subscription.trial_start && subscription.trial_end > session.created) {
    return { ...base, kind: "trial", value: 0, metaEventId: `trial_${session.id}`,
      trialDays: (subscription.trial_end - subscription.trial_start) / 86400 };
  }
  if (session.payment_status !== "paid" || !Number.isSafeInteger(session.amount_total) || (session.amount_total ?? 0) <= 0) return null;
  if (session.mode === "payment" && plan === "schooltime") {
    const payment = typeof session.payment_intent === "object" ? session.payment_intent : null;
    if (!payment || payment.status !== "succeeded" || payment.currency.toUpperCase() !== currency ||
        payment.amount_received !== session.amount_total) return null;
    return { ...base, kind: "purchase", value: payment.amount_received / 100, metaEventId: `purchase_${session.id}` };
  }
  if (session.mode === "subscription" && plan !== "schooltime") {
    // The checkout's original invoice, NOT latest_invoice (which changes at renewal).
    const invoice = typeof session.invoice === "object" ? session.invoice : null;
    if (!invoice || invoice.status !== "paid" || invoice.amount_paid <= 0 ||
        invoice.currency.toUpperCase() !== currency || invoice.amount_paid !== session.amount_total) return null;
    return { ...base, kind: "purchase", value: invoice.amount_paid / 100, metaEventId: `purchase_${invoice.id}` };
  }
  return null;
}
