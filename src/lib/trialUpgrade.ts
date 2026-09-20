import { matchingSession, paidSchooltime, type Offer, type OfferSession } from './privateOffer';
export const TRIAL_UPGRADE = Object.freeze({
  email: 'stephan-michi@gmx.net', userId: 'bb7c9111-8560-42a8-939c-2a3a4e70179c',
  customerId: 'cus_VIOr4Apz2BT3cJ', subscriptionId: 'sub_1UHo3xDGUBi3vyUQhJGLpwRh',
  offerId: '3823f764-03b8-4617-b808-d798fc9e9a10', trialEnd: 1790528279,
});
export const TRIAL_CAMPAIGN = 'stephan-trial-lifetime-20260920';
export type TrialOffer = Offer & { subscription_id: string; trial_end: number; cancellation_state: 'pending' | 'confirmed' | null };
export type TrialSubscription = { id: string; customer: string; status: string; trial_end: number | null; cancel_at_period_end: boolean; cancel_at: number | null; items: { amount: number | null; currency: string; interval: string | undefined; quantity: number | undefined }[] };
export function scopedTrial(o: TrialOffer): boolean {
  const a = TRIAL_UPGRADE;
  return o.id === a.offerId && o.user_id === a.userId && o.customer_id === a.customerId && o.subscription_id === a.subscriptionId && o.trial_end === a.trialEnd && o.amount === 21900 && o.currency === 'chf';
}
export function trialEligible(o: TrialOffer, s: TrialSubscription, now: number): boolean {
  return scopedTrial(o) && s.id === o.subscription_id && s.customer === o.customer_id
    && s.status === 'trialing' && s.trial_end === o.trial_end && now < o.trial_end - 600
    && !s.cancel_at_period_end && s.cancel_at === null && s.items.length === 1
    && s.items[0].amount === 990 && s.items[0].currency === 'chf' && s.items[0].interval === 'month' && s.items[0].quantity === 1;
}
export interface TrialFulfillment {
  load(): Promise<TrialOffer | null>;
  session(id: string): Promise<OfferSession>;
  grant(o: TrialOffer, s: OfferSession): Promise<boolean>;
  subscription(id: string): Promise<TrialSubscription>;
  cancel(id: string): Promise<void>;
  confirmed(o: TrialOffer): Promise<void>;
}
// Grant and durable cancellation obligation commit together BEFORE contacting Stripe.
// Retries never create Checkout/payment intents and never revoke settled lifetime access.
export async function fulfillTrialUpgrade(sessionId: string, io: TrialFulfillment): Promise<boolean> {
  const o = await io.load();
  const s = await io.session(sessionId); // Always retrieve authoritative Stripe state, not event payload.
  if (!o || !scopedTrial(o) || !matchingSession(s, o) || !paidSchooltime(s) || s.status !== 'complete'
    || s.id !== o.session_id || s.metadata.trial_upgrade_id !== o.id
    || s.metadata.trial_subscription_id !== o.subscription_id || s.expires_at > o.trial_end - 600) throw Error('trial_payment_mismatch');
  const first = await io.grant(o, s);
  if (o.cancellation_state === 'confirmed') return first;
  const sub = await io.subscription(o.subscription_id);
  if (sub.id !== o.subscription_id || sub.customer !== o.customer_id || sub.trial_end !== o.trial_end) throw Error('trial_cancellation_binding_mismatch');
  // Delayed settlement/retries may cross trial end. Once paid, stop this EXACT
  // subscription even if active/past_due. Never prorate, invoice, refund or forgive debt.
  // Existing renewal invoices require separate operator review, not silent mutation.
  if (sub.status !== 'canceled') await io.cancel(sub.id);
  const after = await io.subscription(sub.id);
  if (after.id !== sub.id || after.customer !== o.customer_id || after.status !== 'canceled') throw Error('trial_cancellation_unconfirmed');
  await io.confirmed(o);
  return first;
}

// V3 promises a full seven days. Never send it with a shorter purchasable window.
export function sevenDayTrialWindow(now: number): boolean {
  return now + 604800 <= TRIAL_UPGRADE.trialEnd - 600;
}
