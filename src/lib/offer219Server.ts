import { Resend } from 'resend';
import { privateOfferServices } from './privateOfferServer';
import { CAMPAIGN, FROM, RECIPIENTS, SUBJECT } from './offer219Campaign';
import { pages219, type Recipient, type Receipt, type Transport219 } from './offer219Transport';

export function services219(dependencies?: { services: ReturnType<typeof privateOfferServices>; provider: Resend; pace: () => Promise<unknown> }) {
  const { db, stripe, store } = dependencies?.services ?? privateOfferServices();
  if (!dependencies && !process.env.RESEND_API_KEY) throw Error('provider_unavailable');
  const resend = dependencies?.provider ?? new Resend(process.env.RESEND_API_KEY);
  // Resend's default two requests/second. No automatic retries, including 429.
  const pace = dependencies?.pace ?? (() => new Promise(resolve => setTimeout(resolve, 600)));
  async function contacts() {
    return pages219(async after => { await pace(); const r = await resend.contacts.list({ limit: 100, after }); if (r.error || !r.data) throw Error('provider_check_failed'); return r.data; });
  }
  async function suppressions() {
    return pages219(async after => { await pace(); const r = await resend.suppressions.list({ limit: 100, after }); if (r.error || !r.data) throw Error('provider_check_failed'); return r.data; });
  }
  const io: Transport219 = {
    async eligible(r, hash) {
      const offer = await store.byId(r.offerId);
      if (!offer || offer.token_hash !== hash || offer.user_id !== r.userId || offer.customer_id !== r.customerId || offer.amount !== 21900 || offer.currency !== 'chf' || offer.revoked || offer.redeemed_session) return false;
      const [profile, auth, customer] = await Promise.all([
        db.from('parent_profiles').select('email,premium,premium_plan,stripe_customer_id,stripe_subscription_id').eq('id', r.userId).single(),
        db.auth.admin.getUserById(r.userId), stripe.customers.retrieve(r.customerId),
      ]);
      if (profile.error || auth.error || !profile.data || !auth.data.user || customer.deleted) throw Error('identity_check_failed');
      const same = (s: string | null | undefined) => s?.trim().toLowerCase() === r.email;
      if (!same(profile.data.email) || !same(auth.data.user.email) || !same(customer.email) || profile.data.premium || profile.data.premium_plan === 'schooltime' || profile.data.stripe_subscription_id || profile.data.stripe_customer_id !== r.customerId) return false;
      // Search all customers for this exact email too: a second customer may hold a purchase.
      const customers = await pages219(after => stripe.customers.list({ email: r.email, limit: 100, starting_after: after }));
      if (!customers.some(c => c.id === r.customerId)) return false;
      for (const c of customers) {
        const subscriptions = await pages219(after => stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 100, starting_after: after }));
        if (subscriptions.some(s => !['canceled', 'incomplete_expired'].includes(s.status))) return false;
        const charges = await pages219(after => stripe.charges.list({ customer: c.id, limit: 100, starting_after: after }));
        if (charges.some(c => c.paid && c.amount > 0)) return false;
        const invoices = await pages219(after => stripe.invoices.list({ customer: c.id, limit: 100, starting_after: after }));
        if (invoices.some(i => i.status === 'paid' && i.amount_paid > 0)) return false;
        const payments = await pages219(after => stripe.paymentIntents.list({ customer: c.id, limit: 100, starting_after: after }));
        if (payments.some(p => p.status === 'succeeded' && p.amount > 0)) return false;
      }
      if ((await suppressions()).some(s => same(s.email))) return false;
      if ((await contacts()).some(c => same(c.email) && c.unsubscribed)) return false;
      return true;
    },
    async status(email) {
      const r = await db.from('offer219_mail').select('recipient,state,provider_id,deadline,claimed_at,body_hash').eq('campaign', CAMPAIGN).eq('recipient', email).maybeSingle();
      if (r.error) throw Error('ledger_unavailable'); return r.data as Receipt | null;
    },
    async reserve(r, hash, bodyHash) {
      const result = await db.rpc('reserve_offer219_mail', { p_recipient: r.email, p_offer: r.offerId, p_user: r.userId, p_customer: r.customerId, p_hash: hash, p_body: bodyHash });
      if (result.error || !result.data) throw Error('reconciliation_required');
      return (Array.isArray(result.data) ? result.data[0] : result.data) as Receipt;
    },
    async readDeadline(r) { const o = await store.byId(r.offerId); if (!o) throw Error('offer_unavailable'); return Number(o.deadline); },
    async send(payload, key) {
      await pace();
      const r = await resend.emails.send(payload, { idempotencyKey: key });
      if (r.error || !r.data?.id) throw Error('reconciliation_required'); return r.data.id;
    },
    async save(email, id) {
      const r = await db.from('offer219_mail').update({ provider_id: id, state: 'accepted', accepted_at: new Date().toISOString() }).eq('campaign', CAMPAIGN).eq('recipient', email).eq('state', 'reserved').is('provider_id', null).select('provider_id').single();
      if (r.error || r.data?.provider_id !== id) throw Error('reconciliation_required');
    },
  };
  async function verify(r: Recipient) {
    const receipt = await io.status(r.email);
    const matches = (e: { to: string[]; subject: string; from: string }) => e.to.length === 1 && e.to[0].toLowerCase() === r.email && e.subject === SUBJECT && e.from === FROM;
    const summarize = (e: { id: string; last_event: string; created_at: string }) => ({ id: e.id, event: e.last_event, createdAt: e.created_at, accepted: true, delivered: e.last_event === 'delivered', bounced: e.last_event === 'bounced', complained: e.last_event === 'complained' });
    if (receipt?.provider_id) {
      await pace(); const result = await resend.emails.get(receipt.provider_id);
      if (result.error || !result.data || !matches(result.data)) throw Error('provider_verification_failed');
      return { receipt, matches: [summarize(result.data)], readOnly: true };
    }
    const emails = await pages219(async after => { await pace(); const r = await resend.emails.list({ limit: 100, after }); if (r.error || !r.data) throw Error('provider_verification_failed'); return r.data; });
    // Historical matching copies are evidence only. Never authorize retry or attach an uncertain ID.
    return { receipt, matches: emails.filter(matches).map(summarize), readOnly: true, reconciliationRequired: Boolean(receipt), absenceDoesNotAuthorizeRetry: true };
  }
  return { io, verify, async status() { return Promise.all(RECIPIENTS.map(async r => ({ email: r.email, offerId: r.offerId, receipt: await io.status(r.email) }))); } };
}
