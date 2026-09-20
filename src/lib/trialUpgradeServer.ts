import { TRIAL_UPGRADE, scopedTrial, trialEligible, fulfillTrialUpgrade, type TrialOffer, type TrialSubscription } from './trialUpgrade';
import { pages219 } from './offer219Transport';
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { type Offer, type OfferGateway, type OfferSession, type OfferStore } from "./privateOffer";

function services() {
  return {
    db: createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } }),
    stripe: new Stripe(process.env.STRIPE_SECRET_KEY!),
  };
}
export function sessionView(s: Stripe.Checkout.Session): OfferSession {
  return { ...s, customer: typeof s.customer === "string" ? s.customer : s.customer?.id ?? "", metadata: s.metadata ?? {} };
}
export function trialUpgradeServices(dependencies?: ReturnType<typeof services>, now = () => Math.floor(Date.now()/1000)) {
  const { db, stripe } = dependencies ?? services();
  const store: OfferStore = {
    async byHash(hash) {
      const r = await db.from("trial_upgrade_offers").select("*").eq("token_hash", hash).maybeSingle();
      if (r.error) throw new Error("offer_store_unavailable");
      return r.data as Offer | null;
    },
    async byId(id) {
      const r = await db.from("trial_upgrade_offers").select("*").eq("id", id).maybeSingle();
      if (r.error) throw new Error("offer_store_unavailable");
      return r.data as Offer | null;
    },
    async advance(id, generation, expires) {
      expires = Math.min(expires, TRIAL_UPGRADE.trialEnd - 600);
      const r = await db.rpc("advance_trial_upgrade", { p_id: id, p_generation: generation, p_expires: expires });
      if (r.error || !r.data) throw new Error("offer_store_unavailable");
      return (Array.isArray(r.data) ? r.data[0] : r.data) as Offer;
    },
    async attach(id, generation, session) {
      const r = await db.rpc("attach_trial_upgrade", { p_id: id, p_generation: generation, p_session: session });
      if (r.error) throw new Error("offer_store_unavailable");
    },
  };
  const gateway: OfferGateway = {
    async recover(o) {
      // Bounded failure, never assume absence from a truncated page.
      const sessions = await stripe.checkout.sessions.list({ customer: o.customer_id, limit: 100 });
      if (sessions.has_more) throw new Error("offer_recovery_requires_review");
      const found = sessions.data.filter(s => s.metadata?.private_offer_id === o.id && s.metadata?.offer_generation === String(o.generation));
      if (found.length > 1) throw new Error("duplicate_offer_sessions");
      return found[0] ? sessionView(found[0]) : null;
    },
    async eligible(offer) {
      const o = offer as TrialOffer;
      if (!scopedTrial(o)) return false;
      const [profile, auth, customer, subscription] = await Promise.all([
        db.from('parent_profiles').select('email,premium,premium_plan,stripe_customer_id,stripe_subscription_id').eq('id', o.user_id).single(),
        db.auth.admin.getUserById(o.user_id), stripe.customers.retrieve(o.customer_id), stripe.subscriptions.retrieve(o.subscription_id),
      ]);
      const same = (email: string | null | undefined) => email?.trim().toLowerCase() === TRIAL_UPGRADE.email;
      if (profile.error || auth.error || !profile.data || customer.deleted || !same(customer.email) || !same(auth.data.user?.email) || !same(profile.data.email)) return false;
      const p = profile.data;
      if (!p.premium || p.premium_plan !== 'monthly' || p.stripe_customer_id !== o.customer_id || p.stripe_subscription_id !== o.subscription_id
        || !trialEligible(o, subscriptionView(subscription), now())) return false;
      const customers = await pages219(after => stripe.customers.list({ email: TRIAL_UPGRADE.email, limit: 100, starting_after: after }));
      if (!customers.some(c => c.id === o.customer_id)) return false;
      for (const c of customers) {
        const subs = await pages219(after => stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 100, starting_after: after }));
        if (subs.some(s => s.id !== o.subscription_id && !['canceled','incomplete_expired'].includes(s.status))) return false;
        const charges = await pages219(after => stripe.charges.list({ customer: c.id, limit: 100, starting_after: after }));
        const invoices = await pages219(after => stripe.invoices.list({ customer: c.id, limit: 100, starting_after: after }));
        const payments = await pages219(after => stripe.paymentIntents.list({ customer: c.id, limit: 100, starting_after: after }));
        if (charges.some(c => c.paid && c.amount > 0) || invoices.some(i => i.amount_paid > 0 || i.amount_remaining > 0)
          || payments.some(p => !['canceled','requires_payment_method'].includes(p.status))) return false;
      }
      return true;
    },
    async retrieve(id) { return sessionView(await stripe.checkout.sessions.retrieve(id)); },
    async expire(id) { return sessionView(await stripe.checkout.sessions.expire(id)); },
    async create(o) {
      if (!await gateway.eligible(o)) throw Error('trial_changed');
      return sessionView(await stripe.checkout.sessions.create({
        mode: "payment", customer: o.customer_id, client_reference_id: o.user_id,
        payment_method_types: ["card", "twint"], locale: "de", expires_at: o.session_expires!,
        line_items: [{ quantity: 1, price_data: { currency: o.currency, unit_amount: o.amount,
          product_data: { name: "Cleverli Premium lebenslanger Zugang", description: "Einmalzahlung, alle Klassen 1 bis 6, bis zu 3 Kinderprofile." } } }],
        success_url: "https://www.cleverli.ch/payment/success?plan=schooltime&session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://www.cleverli.ch/payment/cancel",
        metadata: { userId: o.user_id, plan: "schooltime", site: "cleverli.ch", trial_upgrade_id: o.id, trial_subscription_id: TRIAL_UPGRADE.subscriptionId, private_offer_id: o.id,
          offer_generation: String(o.generation), checkout_source: "approved_trial_upgrade" },
        payment_intent_data: { metadata: { userId: o.user_id, plan: "schooltime", site: "cleverli.ch", trial_upgrade_id: o.id, trial_subscription_id: TRIAL_UPGRADE.subscriptionId, private_offer_id: o.id } },
      }, { idempotencyKey: `trial-upgrade:${o.id}:${o.generation}` }));
    },
  };
  return { db, stripe, store, gateway };
}


export function subscriptionView(s: Stripe.Subscription): TrialSubscription {
  return { id: s.id, customer: typeof s.customer === 'string' ? s.customer : s.customer.id,
    status: s.status, trial_end: s.trial_end, cancel_at_period_end: s.cancel_at_period_end, cancel_at: s.cancel_at,
    items: s.items.data.map(i => ({ amount: i.price.unit_amount, currency: i.price.currency, interval: i.price.recurring?.interval, quantity: i.quantity })) };
}
export async function redeemTrialUpgrade(sessionId: string) {
  const { db, stripe, store } = trialUpgradeServices();
  return fulfillTrialUpgrade(sessionId, {
    load: async () => await store.byId(TRIAL_UPGRADE.offerId) as TrialOffer | null,
    session: async id => sessionView(await stripe.checkout.sessions.retrieve(id)),
    async grant(o, s) {
      const r = await db.rpc('redeem_trial_upgrade', { p_id: o.id, p_session: s.id, p_user: o.user_id,
        p_customer: s.customer, p_amount: s.amount_total, p_currency: s.currency, p_paid: true, p_expires: s.expires_at });
      if (r.error) throw Error('trial_redemption_failed'); return r.data === true;
    },
    subscription: async id => subscriptionView(await stripe.subscriptions.retrieve(id)),
    async cancel(id) { await stripe.subscriptions.cancel(id, { invoice_now: false, prorate: false }); },
    async confirmed(o) {
      const r = await db.from('trial_upgrade_offers').update({ cancellation_state: 'confirmed', cancellation_confirmed_at: new Date().toISOString(), renewal_review_required: Math.floor(Date.now()/1000) >= o.trial_end })
        .eq('id', o.id).not('redeemed_session', 'is', null).select('id').single();
      if (r.error || !r.data) throw Error('trial_confirmation_failed');
    },
  });
}
export async function reconcileTrialUpgrade() {
  const { store } = trialUpgradeServices();
  const o = await store.byId(TRIAL_UPGRADE.offerId) as TrialOffer | null;
  if (!o?.redeemed_session) return { paid: false, cancellation: 'not_requested' };
  await redeemTrialUpgrade(o.redeemed_session);
  const { stripe } = trialUpgradeServices();
  const invoices = await pages219(after => stripe.invoices.list({ subscription: TRIAL_UPGRADE.subscriptionId, limit: 100, starting_after: after }));
  const renewalInvoices = invoices.filter(i => i.amount_paid > 0 || i.amount_remaining > 0).map(i => ({ id: i.id, status: i.status, amountPaid: i.amount_paid, amountRemaining: i.amount_remaining, currency: i.currency }));
  return { paid: true, cancellation: 'confirmed', renewalReviewRequired: renewalInvoices.length > 0 || Math.floor(Date.now()/1000) >= o.trial_end, renewalInvoices, automaticRefundsOrInvoiceChanges: false };
}

// Fast event guard avoids stale subscription mail/logging. The DB trigger remains
// the race-safe entitlement backstop if payment settles after this read.
export async function settledTrialSubscription(subscriptionId: string): Promise<boolean> {
  if (subscriptionId !== TRIAL_UPGRADE.subscriptionId) return false;
  const { store } = trialUpgradeServices();
  const o = await store.byId(TRIAL_UPGRADE.offerId) as TrialOffer | null;
  return Boolean(o && scopedTrial(o) && o.redeemed_session);
}
