import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { checkoutOffer, matchingSession, paidSchooltime, type Offer, type OfferGateway, type OfferSession, type OfferStore } from "./privateOffer";

function services() {
  return {
    db: createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } }),
    stripe: new Stripe(process.env.STRIPE_SECRET_KEY!),
  };
}
function sessionView(s: Stripe.Checkout.Session): OfferSession {
  return { ...s, customer: typeof s.customer === "string" ? s.customer : s.customer?.id ?? "", metadata: s.metadata ?? {} };
}
export function privateOfferServices() {
  const { db, stripe } = services();
  const store: OfferStore = {
    async byHash(hash) {
      const r = await db.from("private_checkout_offers").select("*").eq("token_hash", hash).maybeSingle();
      if (r.error) throw new Error("offer_store_unavailable");
      return r.data as Offer | null;
    },
    async byId(id) {
      const r = await db.from("private_checkout_offers").select("*").eq("id", id).maybeSingle();
      if (r.error) throw new Error("offer_store_unavailable");
      return r.data as Offer | null;
    },
    async advance(id, generation, expires) {
      const r = await db.rpc("advance_private_offer", { p_id: id, p_generation: generation, p_expires: expires });
      if (r.error || !r.data) throw new Error("offer_store_unavailable");
      return (Array.isArray(r.data) ? r.data[0] : r.data) as Offer;
    },
    async attach(id, generation, session) {
      const r = await db.rpc("attach_private_offer", { p_id: id, p_generation: generation, p_session: session });
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
    async eligible(o) {
      const [profile, user, customer, subscriptions] = await Promise.all([
        db.from("parent_profiles").select("premium,stripe_customer_id,stripe_subscription_id").eq("id", o.user_id).single(),
        db.auth.admin.getUserById(o.user_id), stripe.customers.retrieve(o.customer_id),
        stripe.subscriptions.list({ customer: o.customer_id, status: "all", limit: 100 }),
      ]);
      if (profile.error || user.error || customer.deleted || !user.data.user?.email || !customer.email) return false;
      if (profile.data.premium || profile.data.stripe_subscription_id) return false;
      if (profile.data.stripe_customer_id && profile.data.stripe_customer_id !== o.customer_id) return false;
      if (subscriptions.has_more || subscriptions.data.some(s => !["canceled", "incomplete_expired"].includes(s.status))) return false;
      return user.data.user.email.toLowerCase() === customer.email.toLowerCase();
    },
    async retrieve(id) { return sessionView(await stripe.checkout.sessions.retrieve(id)); },
    async expire(id) { return sessionView(await stripe.checkout.sessions.expire(id)); },
    async create(o) {
      return sessionView(await stripe.checkout.sessions.create({
        mode: "payment", customer: o.customer_id, client_reference_id: o.user_id,
        payment_method_types: ["card", "twint"], locale: "de", expires_at: o.session_expires!,
        line_items: [{ quantity: 1, price_data: { currency: o.currency, unit_amount: o.amount,
          product_data: { name: "Cleverli Premium lebenslanger Zugang", description: "Einmalzahlung, alle Klassen 1 bis 6, bis zu 3 Kinderprofile." } } }],
        success_url: "https://www.cleverli.ch/payment/success?plan=schooltime&session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://www.cleverli.ch/payment/cancel",
        metadata: { userId: o.user_id, plan: "schooltime", site: "cleverli.ch", private_offer_id: o.id,
          offer_generation: String(o.generation), checkout_source: "private_offer" },
        payment_intent_data: { metadata: { userId: o.user_id, plan: "schooltime", site: "cleverli.ch", private_offer_id: o.id } },
      }, { idempotencyKey: `private-offer:${o.id}:${o.generation}` }));
    },
  };
  return { db, stripe, store, gateway };
}

export async function warmPrivateOffers(now = Math.floor(Date.now() / 1000)) {
  const { db, store, gateway } = privateOfferServices();
  const r = await db.from("private_checkout_offers").select("*").eq("revoked", false)
    .is("redeemed_session", null).gt("deadline", now).lte("deadline", now + 86_000);
  if (r.error) throw new Error("offer_store_unavailable");
  let ready = 0;
  for (const offer of r.data as Offer[]) {
    await checkoutOffer(offer, store, gateway, now, true);
    ready++;
  }
  return ready;
}

export async function redeemPrivateOffer(session: Stripe.Checkout.Session): Promise<boolean> {
  const { db, store } = privateOfferServices();
  const o = await store.byId(session.metadata!.private_offer_id);
  const s = sessionView(session);
  if (!o || !matchingSession(s, o) || !paidSchooltime(s)) throw new Error("private_payment_mismatch");
  const r = await db.rpc("redeem_private_offer", { p_id: o.id, p_session: s.id, p_user: o.user_id,
    p_customer: s.customer, p_amount: s.amount_total, p_currency: s.currency,
    p_paid: true, p_expires: s.expires_at });
  if (r.error) throw new Error("private_payment_redemption_failed");
  return r.data === true;
}
