# Cancellation confirmation handoff

## Boundary

Code only, branch `fix/cancellation-confirmation-20260921`, based on `a70382974d2e1a73a05d3a14f820a7260cbaadf4`. No push, deployment, migration, live customer/profile/subscription reads or writes, payments, email, event replay or Stripe configuration change. The explicitly excluded customer was not investigated or acted on. Main worktree and existing trial-to-lifetime guards are untouched. Parent owns independent review, Stripe native email investigation, tracker, deployment and final customer-facing report.

## Changes

- Cancellation now resolves a verified subscription, updates Stripe only when needed, and reads it back before recording success. Stripe errors, missing subscriptions, ambiguous customer matches and identity conflicts fail closed.
- Stored subscription/customer bindings and metadata are checked. Legacy fallback is customer-scoped, paginated and includes trials, not the first ten active subscriptions across the entire Stripe account.
- Confirmed cancellation persists `cancelled`, the resolved subscription ID and the authoritative Stripe end timestamp. A compare-and-set on plan/customer/subscription prevents overwriting a concurrently changed lifetime profile. Ended subscriptions cannot retain Premium through a successful cancellation retry.
- An unknown end date is returned as unknown. It does not erase an existing database access limit or fabricate a date. Mixed item periods are unknown unless Stripe supplies an explicit cancellation/end timestamp.
- A database failure after Stripe success returns a retryable error, not `ok`. Retrying an already confirmed cancellation performs readback without another Stripe update. This is not a distributed transaction.
- Authenticated GET on `/api/cancel-subscription` is read-only, private/no-store and derives identity from the token. Account loads it on mount, fresh login/reload and focus. Legacy profile `cancelled=true` alone is not accepted as proof of stopped renewal.
- Account separately shows active, trial, cancelled, ended, lifetime, free and payment-attention states. Cancelled status stays visible after reload. Exact timestamps use Europe/Zurich, including seconds/timezone. Unknown date and unavailable status have honest support fallbacks.
- DE/FR/IT/EN copy uses real umlauts and Swiss ss. Cancellation says no automatic renewal, not no further payment. Outstanding invoices remain payable. Existing lifetime wording that promised no further charges was replaced with a statement about that access not renewing.
- Cancellation reasons, optional comments, reason-specific CHF 66 retention offer and activity metadata remain. Retention API, auth/session hook, email code and webhook lifetime guards were not modified.

## Validation

- `node --test scripts/test-cancellation-confirmation.cjs`: 46 tests, all passing. Actual TypeScript policy, route and rendered status component with offline VM adapters.
- `npx tsx --test tests/trial-upgrade.test.ts tests/offer219-transport.test.ts`: 61 existing tests passing.
- `node scripts/test-payment-v5.cjs`: 44 existing fixture checks passing.
- Scoped ESLint over all six changed code/test files: passing.
- Full repository `npm run lint`: not clean, 128 errors and 35 warnings in unchanged files. No lint-policy changes or unrelated repairs.
- Production build: `npm run build -- --webpack`, including catalogue/Lehrplan prebuild and TypeScript. Default Turbopack rejects this worktree's shared external node_modules symlink; webpack is a supported local build workaround. Existing Sentry instrumentation webpack and Node deprecation warnings remain.
- Local browser runner covers the actual production-built `/account` UI: cancellation reasons and offer visibility, failed cancellation without false success, retry, exact confirmation, reload, new isolated context, DE/FR/IT/EN, desktop/mobile, trial/ended/lifetime controls, retention acceptance, missing-date fallback and unavailable status. 22 browser checks passed, with zero page errors or failed requests. The only two console/HTTP errors are deliberately mocked 502 and 503 failure scenarios. See `.qa/cancellation-confirmation/browser-result.json` for diagnostics; desktop/mobile screenshots are in the same local directory.
- This is local fixture QA, not independent or production release approval. Parent must review before release.

## Reproduce safely

Do not use real account credentials or copy a production auth session. In this isolated worktree, with no production `.env` files, build using these deliberately non-secret fixture values:

```sh
NEXT_PUBLIC_SUPABASE_URL=https://cancellation-fixture.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=offline-fixture-not-a-real-key NEXT_TELEMETRY_DISABLED=1 npm run build -- --webpack
NEXT_PUBLIC_SUPABASE_URL=https://cancellation-fixture.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=offline-fixture-not-a-real-key node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3319
node scripts/qa-cancellation-local.cjs
```

The runner rejects non-loopback URLs. It creates a new browser context, uses only a synthetic local SDK identity and unlock state, blocks service workers, intercepts every API and external host, and never sends a fixture token to production. It retains the local fixture identity across reload rather than combining fictional production auth with real auth validation. Status changes are in-memory mock responses, never Stripe operations. The real backend is exercised separately by the 46 offline tests. The 20-second ready-state assertion accommodates existing auth/profile hydration timing; no production authentication hook was altered.

Stop the loopback server after the run. Do not deploy the fixture build: parent must make a normal build using the authorised release environment.

## Residual risks and parent checks

1. Stripe and profile persistence are separate systems. If Stripe succeeds but the DB/readback fails, the response is non-success and may require retry/status refresh. No rollback that would reactivate renewal is attempted.
2. Missing identity, multiple subscriptions, unknown dates and Stripe-managed subscription schedule restrictions require review rather than guessed cancellation. A Stripe-rejected schedule mutation returns failure and never records a false cancellation. No schedule is released or rewritten here.
3. Date display is billing truth, not proof that all invoices were paid. No invoice, balance, refund or collection change is made.
4. Profile compare-and-set is tested with mocks, not a live database concurrency exercise. Existing trial/lifetime regression suites pass, but parent owns independent release review.
5. Status reads depend on Stripe availability. During failures the page explicitly cannot confirm billing, rather than trusting an old cancellation flag. No live status of any customer was checked.
6. Email confirmation/settings remain entirely parent-owned. This change does not implement or send Resend mail.
