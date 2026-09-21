import Stripe from "stripe";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { subscriptionBilling } from "./accountBilling";
import { cancellationEmail, cancellationTransition, confirmedMailSubscription, deliverCancellation, CancellationRetry,
  type CancellationMailRow, type CancellationMailIO, type CancellationLocale } from "./cancellationEmail";

function services() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const monthly = process.env.STRIPE_PRICE_MONTHLY ?? "price_1TEQiwDGUBi3vyUQcMa6mD3P";
  const yearly = process.env.STRIPE_PRICE_YEARLY ?? "price_1TEQiwDGUBi3vyUQVIRKNl42";
  async function recurringProduct(sub: Stripe.Subscription) {
    if (sub.items.data.length !== 1) return false;
    const price = sub.items.data[0].price;
    if (!price.recurring || price.currency !== "chf") return false;
    if ([monthly, yearly].includes(price.id)) return true;
    if (price.lookup_key !== "cleverli_retention_yearly_66" || price.unit_amount !== 6600 || price.recurring.interval !== "year") return false;
    const approved = await stripe.prices.retrieve(yearly);
    const product = (value: Stripe.Price["product"]) => typeof value === "string" ? value : value.id;
    return product(price.product) === product(approved.product);
  }
  async function identity(userId: string, customerId: string, subscriptionId: string) {
    // Pending offers have not changed the profile to lifetime and may have no
    // marker on the recurring subscription. The upgrade ledger is authoritative.
    const upgrade = await db.from("trial_upgrade_offers").select("id").eq("subscription_id", subscriptionId).limit(1).maybeSingle();
    if (upgrade.error) throw Error("cancellation_upgrade_check_unavailable");
    if (upgrade.data) return null;
    const [{ data: profile, error }, auth] = await Promise.all([
      db.from("parent_profiles").select("email,premium_plan,stripe_subscription_id,stripe_customer_id").eq("id", userId).single(),
      db.auth.admin.getUserById(userId),
    ]);
    if (error || auth.error) throw Error("cancellation_identity_unavailable");
    const user = auth.data.user;
    if (!profile || !user || profile.premium_plan === "schooltime" || profile.stripe_customer_id !== customerId ||
      (profile.stripe_subscription_id && profile.stripe_subscription_id !== subscriptionId)) return null;
    const email = user.email?.trim().toLowerCase();
    if (!email || profile.email?.trim().toLowerCase() !== email) return null;
    const candidate = user.user_metadata?.lang ?? user.user_metadata?.locale;
    const locale: CancellationLocale = ["de", "fr", "it", "en"].includes(candidate) ? candidate : "de";
    return { email, locale };
  }
  async function status(id: string) {
    const r = await db.from("cancellation_mail_outbox").select("state").eq("id", id).single();
    if (r.error || !r.data) throw Error("cancellation_outbox_unavailable");
    return r.data.state as CancellationMailRow["state"];
  }
  const io: CancellationMailIO = {
    async claim(id) {
      const r = await db.rpc("claim_cancellation_mail", { p_id: id });
      if (r.error) throw Error("cancellation_claim_failed");
      const row = Array.isArray(r.data) ? r.data[0] : r.data;
      return row?.id ? row as CancellationMailRow : null;
    },
    async eligible(row) {
      const sub = await stripe.subscriptions.retrieve(row.subscription_id);
      const end = confirmedMailSubscription(sub, row.cancelled_at);
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      if (subscriptionBilling(sub).accessActive !== row.access_active || !end || Date.parse(end) !== Date.parse(row.end_at) || sub.metadata.userId !== row.user_id || customerId !== row.customer_id || !await recurringProduct(sub)) return false;
      const current = await identity(row.user_id, row.customer_id, row.subscription_id);
      return current?.email === row.payload.to;
    },
    async send(payload, key) {
      if (!process.env.RESEND_API_KEY) throw Error("cancellation_mail_provider_unavailable");
      const provider = new Resend(process.env.RESEND_API_KEY);
      // Explicit field list: no environment sender override, cc/bcc, reply-to fallback or extra recipient.
      const r = await provider.emails.send({ from: "Cleverli <hello@cleverli.ch>", replyTo: "hello@cleverli.ch",
        to: payload.to, subject: payload.subject, html: payload.html, text: payload.text }, { idempotencyKey: key });
      if (r.error || !r.data?.id) {
        const retry = r.headers?.["retry-after"];
        const seconds = retry ? (/^\d+$/.test(retry) ? Number(retry) : Math.ceil((Date.parse(retry) - Date.now()) / 1000)) : 600;
        throw new CancellationRetry(Number.isFinite(seconds) ? Math.max(600, seconds) : 600);
      }
      return r.data.id;
    },
    async finish(row, outcome, providerId, retrySeconds = 600) {
      const r = await db.rpc("finish_cancellation_mail", { p_id: row.id, p_lease: row.lease_id, p_state: outcome, p_provider: providerId ?? null, p_retry_seconds: retrySeconds });
      if (r.error || r.data !== true) throw Error("cancellation_receipt_requires_review");
    },
  };
  return { db, stripe, recurringProduct, identity, status, io };
}

// Called ONLY from the existing signature-verified Stripe webhook. No GET/backfill/scan producer.
export async function processCancellationEmailEvent(event: Stripe.Event, beforeDelivery: () => Promise<void>) {
  // Fast shape gate before constructing services or reading any account.
  if (!cancellationTransition(event, 0)) return "skipped";
  const s = services();
  const activation = await s.db.from("cancellation_mail_activation").select("not_before").eq("singleton", true).single();
  if (activation.error || !activation.data) throw Error("cancellation_mail_migration_required");
  const snapshot = cancellationTransition(event, Number(activation.data.not_before));
  if (!snapshot) return "skipped";
  const sub = await s.stripe.subscriptions.retrieve(snapshot.id);
  const endAt = confirmedMailSubscription(sub, snapshot.canceled_at!);
  if (!endAt || sub.metadata.userId !== snapshot.metadata.userId || !await s.recurringProduct(sub)) return "skipped";
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const snapshotCustomer = typeof snapshot.customer === "string" ? snapshot.customer : snapshot.customer.id;
  if (customerId !== snapshotCustomer) return "skipped";
  const userId = sub.metadata.userId;
  const recipient = await s.identity(userId, customerId, sub.id);
  if (!recipient) return "skipped";
  const payload = cancellationEmail(recipient.email, endAt, recipient.locale, subscriptionBilling(sub).accessActive);
  const r = await s.db.rpc("enqueue_cancellation_mail", {
    p_event: event.id, p_created: event.created, p_user: userId, p_subscription: sub.id,
    p_customer: customerId, p_cancelled: sub.canceled_at, p_end: endAt, p_access: subscriptionBilling(sub).accessActive, p_payload: payload,
  });
  const row = Array.isArray(r.data) ? r.data[0] : r.data;
  if (r.error || !row?.id) throw Error("cancellation_enqueue_failed");
  if (row.state === "pending") {
    // Webhook entitlement sync completes before any potentially slow provider request.
    if (!beforeDelivery) throw Error("cancellation_sync_barrier_required");
    await beforeDelivery();
    const ready = await s.db.rpc("ready_cancellation_mail", { p_id: row.id });
    if (ready.error || ready.data !== true) throw Error("cancellation_readiness_not_persisted");
    await deliverCancellation(s.io, row.id);
  }
  return s.status(row.id);
}

// Existing authenticated daily cron is a bounded backstop, never an account/history scan.
export async function retryCancellationEmails() {
  const s = services();
  const r = await s.db.from("cancellation_mail_outbox").select("id").eq("state", "pending").not("ready_at", "is", null)
    .lte("next_attempt_at", new Date().toISOString()).order("next_attempt_at").limit(20);
  if (r.error) throw Error("cancellation_outbox_unavailable");
  const outcomes: Record<string, number> = {};
  for (const row of r.data ?? []) {
    await deliverCancellation(s.io, row.id);
    const state = await s.status(row.id);
    outcomes[state] = (outcomes[state] ?? 0) + 1;
    if (state === "pending") break; // Do not fan out through provider throttling/outage.
    await new Promise(resolve => setTimeout(resolve, 600));
  }
  const [review, unready] = await Promise.all([
    s.db.from("cancellation_mail_outbox").select("id", { count: "exact", head: true }).eq("state", "review"),
    s.db.from("cancellation_mail_outbox").select("id", { count: "exact", head: true }).eq("state", "pending")
      .is("ready_at", null).lte("created_at", new Date(Date.now() - 10 * 60000).toISOString()),
  ]);
  if (review.error || unready.error) throw Error("cancellation_review_status_unavailable");
  return { outcomes, unready: unready.count ?? 0, requiresReview: (review.count ?? 0) > 0 || (unready.count ?? 0) > 0 };
}
