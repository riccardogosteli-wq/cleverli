# CHF 219 V3 transport review handoff

Scope: code only. No customer sends, provider mutations, database execution, push or deployment performed.

## Deployment prerequisites

1. Independently review `supabase/2026-09-20-offer219-mail.sql`, then apply it once with the normal database owner workflow. It is additive and transactional. It depends on existing `private_checkout_offers`, `parent_profiles`, and `auth.users`. It does not change entitlements or existing offer deadlines at migration time.
2. The old `private_offer_mail` table has a single-recipient CHECK constraint, so it is left untouched. New `offer219_mail` has a campaign/recipient primary key, campaign/offer unique key, unique provider receipt, RLS, no browser grants and no delete grant for service_role. The reservation RPC is service_role only and freezes all 20 recipient/account/customer/offer tuples independently of the application allowlist.
3. Existing production environment only: RESEND_API_KEY, STRIPE_SECRET_KEY, Supabase service credentials and existing internal dashboard auth secret. No new feature flag and no exported credentials. Resend key must permit contacts/suppressions and email reads; lack of read scope intentionally fails closed. Do not work around a denied scope.
4. Open `/internal-log-dashboard/offer219` after signing into the existing internal dashboard. Independently browser-review desktop/mobile and authenticate the actual production deployment before any sends.

## Operator flow

- Select one approved recipient and upload the original private `customer-material.json` from the approved artifact folder. This file must never enter Git, logs or chat.
- Click **Prüfen, ohne Versand**. The server validates the exact 20-tuple manifest, selected token hash against its bound offer, current identities, payment history and suppression/contact pages. Preview returns hashes and eligibility only, never capability values. The UI displays the fixed exact V3 template with its capability link removed.
- Click **Genau eine E-Mail senden** with explicit checkbox confirmation. Each request handles only one fixed recipient. Never use provider CLI or shell sends.
- Read `?status=1`, then use **Nur lesen, nicht senden**. An API receipt means accepted, not delivered. Provider `last_event` is returned explicitly; delivery, bounce and complaint are distinguished. Historical recipient/subject matches are evidence only and do not authorize retry or automatically attach IDs.
- Any `reserved` record, error, timeout or missing receipt is permanently blocked from resend. This includes provider rejection and post-send database failures. Review provider records manually, never delete/reset the reservation. List results are paginated with fail-closed caps; a missing result never proves that no email was sent.

## Timing and residual limits

The database transaction records dispatch reservation time and offer deadline = reservation + 604800 seconds. The deadline is read back before transport, with a second fresh eligibility check. A reservation older than 15 seconds will not send. Thus the validity clock starts immediately before provider submission, not at eventual inbox delivery (which cannot be known or persisted before submission). Provider acceptance and delivery timestamps are separate. No existing checkout session is mutated; the existing personal-offer route handles renewal against the stored deadline.

External payment/suppression changes cannot be transactionally locked together with email submission. Two fresh checks minimize this unavoidable race. Unknown or incomplete checks fail closed. All charges, invoices, payment intents and subscriptions are paginated for every Stripe customer returned for the fixed email. A paid positive-amount transaction excludes the recipient even when refunded. An active/trial/incomplete subscription also excludes them.

The migration has not been applied to live data and database concurrency must be independently exercised in a disposable database before release. The deterministic in-memory concurrency test verifies the application behavior, not a live PostgreSQL deployment.

## Local commands

- `npx tsx --test tests/offer219-transport.test.ts`
- `npx eslint src/lib/offer219*.ts src/app/internal-log-dashboard/offer219/route.ts`
- `npm run build`

Fixtures use synthetic tokens and mocked providers only. No provider messages are submitted by tests.
