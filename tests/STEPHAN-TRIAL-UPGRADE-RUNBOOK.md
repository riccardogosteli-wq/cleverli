# Stephan trial to CHF 219 lifetime: code-first handoff

## RELEASE STATUS: BLOCKED, do not send

Base: origin/main `9030c82aad3ea0b19660e3c6671a0990b022df54`.
Worktree: `/Users/riccardogosteli/projects/cleverli-stephan-trial-lifetime`.
Branch: `feat/stephan-trial-lifetime`.

No live database migration, private material creation, Stripe mutation, payment, email, push or deployment was performed by this implementation task. Original19 offers, material, ledger, functions and templates are unchanged. The old unsent Stephan offer is also unchanged.

### Concrete commercial blocker

The approved V3 says the offer is valid **seven days from email send**. The approved trial ends **27 September 2026 at 18:57:59 Europe/Zurich**, less than seven days after this task/send. This implementation fails closed before trial end and caps every Checkout expiry at **18:47:59** that day (ten-minute safety margin). A stable URL and database deadline lasting seven days would not make Checkout payable for seven days.

Therefore the authenticated send route, production mail adapter AND SQL reservation independently block V3 dispatch when the complete seven-day purchasable window is unavailable. No irreversible mail reservation is made in that case. Do not bypass these guards or shorten the deadline silently. Preview is not permission to send.

Parent must obtain/define one reviewed resolution before further implementation/release: approved revised validity copy, or a separately designed policy permitting a fully reviewed trial-to-active conversion with outstanding-invoice/renewal handling. Do not extend/cancel the trial before paid lifetime merely to make the dates fit. Current code deliberately does not implement an active-before-Checkout bypass. Current exact V3 cannot safely be sent under these constraints.

## Scope and identity

- Email: `stephan-michi@gmx.net`.
- Parent: `bb7c9111-8560-42a8-939c-2a3a4e70179c`.
- Current customer: `cus_VIOr4Apz2BT3cJ`.
- Approved subscription: `sub_1UHo3xDGUBi3vyUQhJGLpwRh`.
- Dedicated new offer ID, no record created: `3823f764-03b8-4617-b808-d798fc9e9a10`.
- NEVER reuse old `592407b7-8c6f-4a84-b586-b54ed7114ac4` or its customer `cus_VIOXq9aXmNgCJh`.
- CHF 21900 minor units, CHF, one-time schooltime access, three child profiles.
- Same existing V3 HTML, subject, sender and reply-to. Only the recipient capability path changes to `/offer/trial-upgrade#<private capability>`.

Evidence read: workspace `.qa/offer219-20260920/stephan-live-review.json` and exact `customer-template.html`. This is earlier parent evidence, not a new live Stripe verification by the child.

## Implementation

Separate `trial_upgrade_offers` and `trial_upgrade_mail` avoid the original active-user unique index and original campaign tuples. SQL CHECK constraints permit exactly the approved identity and amount. Empty additive migration does not seed any offer or change the profile. Raw capabilities are never stored in the database.

Eligibility checks exact profile/auth/customer email, profile customer/subscription binding, unchanged CHF 9.90/month trial and exact trial end; rejects active status, scheduled cancellation, additional live subscriptions, positive collected charges, positive/remaining invoices and pending payment intents across every customer with the exact email. Pagination fails closed. Recheck immediately before Stripe session creation. Existing checkout session reuse is subject to fresh eligibility. Session generation CAS and Stripe idempotency remain isolated from the original offers.

Payment fulfillment retrieves the authoritative Stripe session, checks complete+paid, session ID, amount, currency, identity, generation, expiry, schooltime plan and both upgrade/subscription metadata. An atomic SQL transaction records lifetime plus a durable pending cancellation obligation. Only then call `subscriptions.cancel(exactApprovedId, {invoice_now:false, prorate:false})`, retrieve again, and record confirmed cancellation.

Cancellation/network/persistence failures return a retryable webhook error; lifetime remains granted. Retried fulfillment revalidates the same paid session; it never creates Checkout, charges, payment intents or refunds. A previously canceled subscription is read back and confirmed without a second cancellation call. Concurrent attempts can return a temporary error but cannot create another charge.

Late payment settlement or cancellation retry can cross trial end. **Only after verified paid lifetime**, the exact originally approved subscription may be canceled even if now active/past_due. This stops recurrence without proration or a newly requested final invoice. It does NOT reverse an already-created/collected invoice, guarantee no race with Stripe renewal, or authorize a refund. Cancellation after the trial boundary sets a conservative renewal-review flag. Reconciliation lists any positive/remaining invoices and requires human review; no automatic invoice mutation/refund.

Scoped DB BEFORE UPDATE trigger preserves paid lifetime against late subscription deletion/update, subscription Checkout and invoice writes. A webhook guard avoids known-settled trial events generating stale monthly activation mail; the database trigger provides the transactional entitlement backstop when a read races payment. Unrelated accounts are unchanged. Ordinary updates cannot revoke this paid entitlement; a later refund/revocation needs a separately audited operator procedure.

Webhook retries, the existing daily private-offer cron (schedule unchanged), and the restricted admin `reconcile` action retry a persisted paid obligation. Reconcile never sends email or creates a new payment. No pending payment means no cancellation.

## Parent-owned release sequence, only after resolving blocker

1. Review the entire diff and financial semantics. Keep this task open or report the concrete validity blocker; do not call this send-ready.
2. Independently rehearse `supabase/2026-09-20-stephan-trial-upgrade.sql` on a real PostgreSQL instance, including concurrent redemption vs late profile updates and role checks. Child's embedded PostgreSQL tests are not multi-connection concurrency proof.
3. Apply migration before code deployment. The scoped webhook guard and cron need the new tables. Confirm zero rows, RLS and grants, and original19/old Stephan rows unchanged with readback. Do not replace existing tables/functions or seed live material in the migration.
4. Build, independently review and browser-QA local/preview desktop+mobile public capability page and authenticated admin forms. Child has not certified these rendered routes. Deploy only after authorization. Do not publish the private URL/token in logs or screenshots.
5. Refresh live Stripe subscription/customer/profile, invoices, charges, pending payments and all same-email customers. Check non-provider opt-outs/replies manually as well as API suppressions. If active or any binding differs, stop. No billing change to make eligibility pass.
6. Only with an approved policy resolution, prepare a fresh random 32-byte capability through the parent's protected local workflow. Insert its SHA256 digest with the exact new offer ID/user/customer, amount=21900, currency=chf, exact subscription/trial_end and provisional deadline. Leave generation=0 and all session/redemption/cancellation fields null. Do NOT create an initial Stripe session. Do NOT touch old material or the original campaign ledger.
7. New private material JSON is exactly one object with keys `customerId,email,offerId,subscriptionId,token,userId`, matching constants. Keep it private. No actual material or token is in the commit.
8. Authenticated `/internal-log-dashboard/trial-upgrade`: upload the new file and preview. Strict cookie auth, same-origin, field whitelist, bounded bytes and explicit send confirmation are required. The current release intentionally returns `seven_day_trial_window_requires_review` on send. Do not use `/internal-log-dashboard/offer219` for this recipient.
9. Once the blocking policy is legitimately resolved in reviewed code, parent performs exactly one browser send. SQL reservation is permanent and sets deadline=reservation+604800 with readback; dispatch must be within15seconds and fresh eligibility/suppressions must still pass. This is pre-dispatch reservation time, not proof of provider delivery time. Never reset/retry an uncertain reservation, even after provider idempotency retention expires.
10. Parent reads stored receipt and provider status. `accepted` is not `delivered`. Read-only provider verification paginates; absent history never authorizes resend. Same subject/recipient historical matches without a stored provider ID require manual investigation, not automatic attachment.
11. After a real customer payment, verify paid session, lifetime profile, pending/confirmed obligation, exact subscription canceled, and invoices. Use authenticated reconcile if needed; monitor promptly rather than relying only on daily cron. Do not replay events that send mail for testing.
12. Before concluding, deliver verified result or blocker to originating parent/requester. Primary outreach task is not complete from this code handoff.

## Residual risks and limitations

- **Blocking:** exact V3 seven-day validity versus earlier trial end, enforced by code and SQL.
- No live migration/deployment, private material, send, payment or cancellation executed. No rendered desktop/mobile browser QA yet. Technical release status: blocked.
- Embedded PostgreSQL tests exercise real SQL and the lifetime trigger, but not separate database connections, production schema drift or Stripe integration.
- Stripe settlement/cancellation are not an atomic transaction with Supabase. Retries cannot guarantee no renewal charge during a prolonged outage or delayed settlement. Positive/open invoices require prompt manual review.
- Daily reconciliation is only a backstop. Existing webhook retry delivery/subscribed event types must be verified by parent; this task does not change provider configuration or cron schedule.
- If first redemption commits but cancellation fails, a retry returns duplicate redemption after cancellation succeeds. Existing webhook `firstRedemption` notification gating may omit that lifetime payment-confirmation email. No automatic email replay is added; do not confuse this with the exactly-once V3 offer mail. Owner should decide a separately reviewed notification outbox if required.
- Late events racing initial payment can still emit stale subscription analytics/mail after their preflight read, but cannot overwrite paid lifetime because of the DB guard. General notification serialization is outside this narrowly scoped change.
- Refunded lifetime/revocation handling is not added; the scoped paid-lifetime floor requires an audited policy change for that case.

## Verification commands

- `npx tsx --test tests/trial-upgrade.test.ts tests/offer219-transport.test.ts`
- `npx tsx scripts/test-private-offer.ts`
- `npx eslint src/lib/trialUpgrade*.ts src/app/offer/trial-upgrade/route.ts src/app/internal-log-dashboard/trial-upgrade/route.ts src/app/api/webhooks/stripe/route.ts src/app/api/cron/private-offers/route.ts`
- Offline SQL: install `@electric-sql/pglite` in a disposable directory outside this repo, then set `TRIAL_SQL_QA_MODULE` to that module path when running `node scripts/test-trial-upgrade-sql.cjs`. No production credentials/database are used.
- `npm run build`

Logs: `.qa/trial-upgrade/` in this worktree, not committed. Initial build's out-of-root dependency symlink was replaced with a worktree-local APFS dependency copy; no product configuration was changed to work around it.

## Verified child results, 20 September 2026

- 57 Node tests passed: 24 scoped trial-upgrade tests plus 33 original campaign transport regressions.
- 30 existing private-offer core checks passed.
- 19 offline PostgreSQL assertions passed, including unpaid/mismatched redemption rejection, atomic pending obligation, duplicate redemption, late-event lifetime protection, reserved-ledger uniqueness, browser-role denial and original-offer preservation.
- Scoped ESLint passed. Final `npm run build` passed with both new routes present.
- External approved `customer-template.html` is byte-identical to the reused V3 template before capability substitution.
- Staged secret/capability pattern scan and `git diff --check` passed. Original campaign source/migration files compare unchanged to base.
- Browser QA, independent review, live migration and actual Stripe/provider behavior remain unverified and parent-owned. Overall release verdict: **blocked**, not approved for dispatch.
