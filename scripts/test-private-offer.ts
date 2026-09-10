import assert from "node:assert/strict";
import { checkoutOffer, tokenHash, paidSchooltime, matchingSession, type Offer, type OfferStore, type OfferGateway, type OfferSession } from "../src/lib/privateOffer";

let checks = 0;
const base: Offer = { id: "offer-test", token_hash: "test", user_id: "user-test", customer_id: "cus_test", amount: 19900,
  currency: "chf", deadline: 2_000_000_000, generation: 0, session_id: null, session_expires: null, redeemed_session: null, revoked: false };
function fixture() {
  let state = structuredClone(base), created = 0, eligible = true;
  const sessions = new Map<string, OfferSession>();
  const keys = new Map<number, OfferSession>();
  const store: OfferStore = {
    byHash: async () => structuredClone(state), byId: async () => structuredClone(state),
    advance: async (_id, gen, expires) => {
      if (state.generation === gen) state = { ...state, generation: gen + 1, session_id: null, session_expires: expires };
      return structuredClone(state);
    },
    attach: async (_id, gen, id) => { assert.equal(gen, state.generation); state.session_id = id; },
  };
  const gateway: OfferGateway = {
    eligible: async () => eligible,
    recover: async o => keys.get(o.generation) ?? null,
    retrieve: async id => structuredClone(sessions.get(id)!),
    expire: async id => { const s = sessions.get(id)!; if (s.status !== "open") throw Error("expiry_race"); s.status = "expired"; return structuredClone(s); },
    create: async o => {
      if (keys.has(o.generation)) return structuredClone(keys.get(o.generation)!);
      created++;
      const s: OfferSession = { id: `fake-${created}`, url: "https://checkout.stripe.com/fake-test-only", status: "open", payment_status: "unpaid",
        expires_at: o.session_expires!, customer: o.customer_id, amount_total: o.amount, currency: o.currency, mode: "payment",
        metadata: { private_offer_id: o.id, offer_generation: String(o.generation), userId: o.user_id, plan: "schooltime", site: "cleverli.ch" } };
      sessions.set(s.id, s); keys.set(o.generation, s); return structuredClone(s);
    },
  };
  return { store, gateway, get: () => structuredClone(state), set: (patch: Partial<Offer>) => { state = { ...state, ...patch }; },
    created: () => created, sessions, eligible: () => { eligible = false; } };
}
async function rejects(fn: () => Promise<unknown>, code: string) { await assert.rejects(fn, new RegExp(code)); checks++; }
async function main() {
  assert.equal(tokenHash("not-a-token"), null); assert.equal(tokenHash("a".repeat(64))?.length, 64); checks += 2;
  const f = fixture(), now = base.deadline - 200_000;
  const urls = await Promise.all(Array.from({ length: 12 }, () => checkoutOffer(f.get(), f.store, f.gateway, now)));
  assert.equal(new Set(urls).size, 1); assert.equal(f.created(), 1); checks += 2;
  await checkoutOffer(f.get(), f.store, f.gateway, now + 100); assert.equal(f.created(), 1); checks++;
  const first = f.get().session_id!; f.sessions.get(first)!.status = "expired";
  await checkoutOffer(f.get(), f.store, f.gateway, now + 86_001); assert.equal(f.created(), 2); checks++;
  // Final-day cron replaces only an expired/explicitly expired old session.
  await checkoutOffer(f.get(), f.store, f.gateway, base.deadline - 20_000, true);
  assert.equal(f.get().session_expires, base.deadline); checks++;
  await checkoutOffer(f.get(), f.store, f.gateway, base.deadline - 1); checks++;
  await rejects(() => checkoutOffer(f.get(), f.store, f.gateway, base.deadline), "expired");
  const cold = fixture(); await rejects(() => checkoutOffer(cold.get(), cold.store, cold.gateway, base.deadline - 100), "preparing");
  assert.equal(cold.created(), 0); checks++;
  const done = fixture(); await checkoutOffer(done.get(), done.store, done.gateway, now);
  done.sessions.get(done.get().session_id!)!.status = "complete";
  await rejects(() => checkoutOffer(done.get(), done.store, done.gateway, now + 5), "redeemed");
  assert.equal(done.created(), 1); checks++;
  const redeemed = fixture(); redeemed.set({ redeemed_session: "paid-test" });
  await rejects(() => checkoutOffer(redeemed.get(), redeemed.store, redeemed.gateway, now), "redeemed");
  const revoked = fixture(); revoked.set({ revoked: true }); await rejects(() => checkoutOffer(revoked.get(), revoked.store, revoked.gateway, now), "unavailable");
  const ineligible = fixture(); ineligible.eligible(); await rejects(() => checkoutOffer(ineligible.get(), ineligible.store, ineligible.gateway, now), "ineligible");
  // Crash after Stripe create but before attach recovers that same session.
  const crash = fixture(); await checkoutOffer(crash.get(), crash.store, crash.gateway, now); crash.set({ session_id: null });
  await checkoutOffer(crash.get(), crash.store, crash.gateway, now + 85_000); assert.equal(crash.created(), 1); checks++;
  // Abandoned reservation with no Stripe session can advance only after its expiry.
  const abandoned = fixture(); abandoned.set({ generation: 1, session_expires: now - 1 });
  await checkoutOffer(abandoned.get(), abandoned.store, abandoned.gateway, now); assert.equal(abandoned.created(), 1); checks++;
  const s = f.sessions.get(f.get().session_id!)!;
  assert.equal(matchingSession(s, f.get()), true); checks++;
  for (const patch of [{ customer: "cus_wrong" }, { amount_total: 199 }, { currency: "eur" }, { mode: "subscription" }, { expires_at: base.deadline + 1 }]) {
    assert.equal(matchingSession({ ...s, ...patch }, f.get()), false); checks++;
  }
  for (const status of ["unpaid", "no_payment_required", "processing"]) { assert.equal(paidSchooltime({ ...s, payment_status: status }), false); checks++; }
  assert.equal(paidSchooltime({ ...s, payment_status: "paid" }), true); checks++;
  // Cron racing with a completed payment must never create a replacement.
  const race = fixture(); await checkoutOffer(race.get(), race.store, race.gateway, now);
  race.gateway.expire = async () => { throw Error("expiry_race"); };
  await rejects(() => checkoutOffer(race.get(), race.store, race.gateway, base.deadline - 20_000, true), "expiry_race");
  assert.equal(race.created(), 1); checks++;
  console.log(`Private offer core: ${checks} checks passed; no network or production writes.`);
}
main().catch(() => { console.error("Private offer core test failed"); process.exitCode = 1; });
