# Revenue attribution v1

Owner request: Ricci, 21 October 2026. This adds accounting evidence, not advertising conversions or a new experiment. Existing prices, treatment allocation, Google/Meta events, consent and entitlements stay unchanged.

## Evidence chain
Observed experiment exposures are saved by visitor/cohort, separately from analytics requests. Account binding retains first evidence and flags mixed exposure. Signed first-party cookie provides a checkout fallback if local storage disappears. Login on a new device recovers account attribution. New checkout snapshots are frozen by the existing idempotency key before Stripe creation. The same versioned metadata goes to Checkout plus Subscription or PaymentIntent, including private offers. Invoice copies retain the original subscription attribution for renewals. Later visits never rewrite a paid charge.

Captured successful Stripe charges are the unique accounting key. Zero-value trials and unpaid sessions are not revenue. Refund updates are monotonic and duplicate webhooks do not duplicate revenue. Shared-account products are checked, including archived products. New ambiguous ownership fails reconciliation instead of being silently excluded. Daily reconciliation at 04:20 UTC reads all Stripe charges, repairs missed events and verifies count/gross/refunds against the ledger. Errors go to Sentry and a durable run receipt. Cron needs the existing CRON_SECRET. Max 2,000 scanned charges is an explicit incomplete-run failure; scale to checkpointed batches before reaching that limit.

## Cohorts and limitations
- randomized_control and randomized_trial: observed experiment, unchanged first assignment policy.
- fixed_meta_control: deterministic Meta entry, never randomized Control.
- qa: forced/internal tests, excluded from experiment conclusions.
- conflicting_exposures: evidence for more than one cohort; never silently choose one.
- outside_experiment: no experiment evidence at checkout. This does NOT prove no prior exposure on another device or after deleted storage.
- legacy_unattributed: no versioned snapshot, including renewals from existing subscriptions and already-created offer sessions. Never infer a variant from a seven-day trial.

Context (e.g. private_offer) stays separate from cohort; exposure is not proof that it caused purchase. Existing sessions are not expired or rewritten. Historical reconstructed evidence is not rewritten into strict prospective cohorts. New attribution cannot repair lost historical evidence or link anonymous people across devices. Local storage + all cookies blocked/deleted before identification can still cause unknown/conflict.

## Operations
Apply supabase/2026-10-21-revenue-attribution.sql once, then deploy. Five tables have RLS and no anon/authenticated privileges. Service-role only; no customer-facing revenue endpoint.

Run scripts/report-revenue-attribution.cjs [ISO-start] [ISO-end] using the protected production runtime, never print keys. Output splits currency, cohort and checkout context, payment count, buyers, gross/refund/net minor units and reconciliation health. Stale (>36 hours), failed or unfinished reconciliation exits nonzero. This is captured customer revenue, not bank settlement net of fees. Review unknown/conflicting amounts rather than allocating them to an arm.

The release gate requires policy/account tests, actual checkout adapter tests, SQL/RLS/rollback checks, build, desktop/mobile browser flow checks, and live ledger reconciliation. Safe QA does not make a real payment or send customer email. Synthetic billing tests cover renewals, refunds, duplicates and failures with mocks.
