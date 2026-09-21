# Independent review fixes

Follow-up to account `0eb32bc` and mail `6614d2e`. Sole writer resumed at the parent's request. No live effects, customer reads, sends, subscription actions, replay, migration, push or deployment.

## 1. Later scheduled termination is not stopped renewal

A `cancel_at` later than the current billing/trial boundary now produces `scheduled`, not `cancelled`. The account explains in all four locales that further automatic renewals may occur. It does not show the no-renewal promise or imply Premium coverage through the eventual termination date.

A shared `noFurtherRenewal` policy compares a known explicit cancellation timestamp to the earliest current renewal boundary. Unknown/mixed boundaries fail conservatively. A date beyond that boundary cannot bypass the explicit cancellation request. For an unmanaged subscription the route requests cancellation at period end, then requires authoritative readback proving no intervening renewal. Stripe-managed schedules are rejected before mutation rather than being rewritten. A failed/unchanged readback never persists cancelled success.

The email producer and retry eligibility use the same policy. Future termination with intervening renewals cannot enqueue or send the no-renewal confirmation. No migration change is needed.

## 2. Unique terminal fallback

Customer-scoped fallback now retains owned terminal subscriptions. If there is no ongoing candidate, exactly one terminal candidate resolves to `ended`, using Stripe `ended_at`. Multiple terminal candidates still fail closed. Incomplete-expired subscriptions without an actual end timestamp show unknown rather than a future item period masquerading as the end.

GET regression verifies a cancelled profile without a stored subscription pointer displays authoritative ended status/date without writes.

## 3. Account-scoped POST completion

Cancellation and retention requests capture user ID and an identity epoch. A layout effect resets mutation state, errors, reason/comment and stale billing data on identity changes; it also invalidates requests on cleanup. Both requests check the captured epoch and authenticated token identity before POST, and ignore stale success, server error and network failure afterward. A → B → A cannot revive an old request.

`scripts/test-account-mutation-identity.cjs` executes the actual Account component with deterministic mocked hooks/auth/fetch. Its eight cases cover both POST paths, all three stale outcomes, A → B → A and reason/comment reset. All eight fail against the pre-review `6614d2e` component and pass with the fix. It uses no production authentication or service traffic.

## Validation

- 122 cancellation/mail/identity Node tests: 62 account/backend/status tests, 52 mail tests, 8 actual-component identity tests.
- 61 existing trial/offer tests, 44 payment checks and 30 offline SQL assertions remain passing.
- Scoped lint and production webpack build pass. Full-repository lint has the same unrelated baseline issues documented in the release handoff.
- All 25 local browser checks passed, including scheduled-termination wording and cancellation control. No page errors or failed requests; only the two deliberately mocked 502/503 error responses. Evidence: `.qa/cancellation-confirmation/browser-result.json` and `scheduled-termination.png`. The account fixture uses the credential-free loopback build with all API/external traffic intercepted; never fabricated production auth.
- Parent retains independent re-review, real PostgreSQL concurrency proof, additive mail migration and release ownership. Email remains implemented locally, not claimed live or delivered.
