import { createHash } from "node:crypto";

export type Offer = {
  id: string; token_hash: string; user_id: string; customer_id: string;
  amount: number; currency: "chf"; deadline: number; generation: number;
  session_id: string | null; session_expires: number | null;
  redeemed_session: string | null; revoked: boolean;
};
export type OfferSession = {
  id: string; status: "open" | "complete" | "expired" | null;
  payment_status: string; expires_at: number; url: string | null;
  customer: string; amount_total: number | null; currency: string | null;
  mode: string; metadata: Record<string, string>;
};
export interface OfferStore {
  byHash(hash: string): Promise<Offer | null>;
  byId(id: string): Promise<Offer | null>;
  // Atomic compare-and-swap. Losers return the current generation, not a new one.
  advance(id: string, expected: number, expires: number): Promise<Offer>;
  attach(id: string, generation: number, session: string): Promise<void>;
}
export interface OfferGateway {
  retrieve(id: string): Promise<OfferSession>;
  create(offer: Offer): Promise<OfferSession>;
  expire(id: string): Promise<OfferSession>;
  eligible(offer: Offer): Promise<boolean>;
  recover(offer: Offer): Promise<OfferSession | null>;
}
export class OfferError extends Error {
  constructor(public code: "unavailable" | "expired" | "redeemed" | "preparing" | "ineligible") { super(code); }
}
export function tokenHash(token: string): string | null {
  return /^[a-f0-9]{64}$/.test(token) ? createHash("sha256").update(token).digest("hex") : null;
}
export function matchingSession(s: OfferSession, o: Offer): boolean {
  return s.customer === o.customer_id && s.amount_total === o.amount && s.currency === o.currency
    && s.mode === "payment" && s.metadata.userId === o.user_id
    && s.metadata.plan === "schooltime" && s.metadata.site === "cleverli.ch"
    && s.metadata.private_offer_id === o.id && s.metadata.offer_generation === String(o.generation)
    && s.expires_at === o.session_expires && s.expires_at <= o.deadline;
}
export function paidSchooltime(s: Pick<OfferSession, "mode" | "payment_status" | "metadata">): boolean {
  return s.mode === "payment" && s.metadata.plan === "schooltime" && s.payment_status === "paid";
}

// Stripe requires >=30 minutes at creation. A final session must be prepared earlier
// by the authenticated daily cron. Never extend expiry to hide a missed preparation.
export async function checkoutOffer(
  o: Offer, store: OfferStore, gateway: OfferGateway, now: number, warmFinal = false,
): Promise<string> {
  if (o.revoked) throw new OfferError("unavailable");
  if (o.redeemed_session) throw new OfferError("redeemed");
  if (now >= o.deadline) throw new OfferError("expired");
  if (!await gateway.eligible(o)) throw new OfferError("ineligible");
  if (!o.session_id && o.session_expires !== null) {
    const recovered = await gateway.recover(o);
    if (recovered) {
      if (!matchingSession(recovered, o)) throw new OfferError("unavailable");
      await store.attach(o.id, o.generation, recovered.id);
      o = { ...o, session_id: recovered.id };
    } else if (o.session_expires <= now) {
      if (o.deadline - now < 1_860) throw new OfferError("preparing");
      o = await store.advance(o.id, o.generation, Math.min(now + 86_000, o.deadline));
    }
  }
  if (o.session_id) {
    let s = await gateway.retrieve(o.session_id);
    if (!matchingSession(s, o)) throw new OfferError("unavailable");
    // Complete but unpaid must not create another independently payable session.
    if (s.status === "complete" || s.payment_status === "paid") throw new OfferError("redeemed");
    const needsFinal = warmFinal && o.deadline - now <= 86_000 && s.expires_at < o.deadline;
    if (s.status === "open" && !needsFinal && s.url) return s.url;
    if (s.status === "open" && needsFinal) {
      if (o.deadline - now < 1_860) throw new OfferError("preparing");
      // A payment winning the expiry race makes Stripe reject expiry. Fail closed.
      s = await gateway.expire(s.id);
    }
    if (s.status !== "expired") throw new OfferError("preparing");
    o = await store.advance(o.id, o.generation, Math.min(now + 86_000, o.deadline));
  } else if (o.session_expires === null) {
    if (o.deadline - now < 1_860) throw new OfferError("preparing");
    o = await store.advance(o.id, o.generation, Math.min(now + 86_000, o.deadline));
  }
  // A competing invocation may already have persisted the session.
  if (o.session_id) return checkoutOffer(o, store, gateway, now);
  if (!o.session_expires || o.session_expires - now < 1_800) throw new OfferError("preparing");
  // Fixed generation AND persisted parameters make retries/crash recovery idempotent.
  const s = await gateway.create(o);
  if (!matchingSession(s, o) || !s.url || s.status !== "open") throw new OfferError("unavailable");
  await store.attach(o.id, o.generation, s.id);
  // Recheck redemption/revocation before disclosing a payable URL.
  const latest = await store.byId(o.id);
  if (!latest || latest.revoked || latest.redeemed_session || latest.generation !== o.generation) {
    await gateway.expire(s.id).catch(() => undefined);
    throw new OfferError("unavailable");
  }
  return s.url;
}
