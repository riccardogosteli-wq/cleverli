# Worksheet download tracking

Effective only after the 2026-10-07 release. Historical downloads cannot be reconstructed by account.

## What is counted
A GET response with verified PDF bytes ready for delivery is recorded in the private Supabase table worksheet_download_events. This measures server PDF deliveries, not confirmed local saves, printing, unique people or intent. Opening a free PDF also counts. Repeated requests can count again. HEAD, recognised prefetch, catalogue lists, authentication denials, invalid resources and integrity failures are not recorded. Known crawler/headless requests are marked automated and excluded from normal reports. This is a heuristic, not a complete bot detector.

All twelve existing public PDF URLs are retained. Next beforeFiles rewrites route them through an exact twelve-file whitelist. The bundled files must match their immutable hashes. Premium API access and entitlement checks are unchanged; the verified adult user ID and effective premium/teacher access are captured only after success. Free events have no account, browser identifier or IP address. Account deletion clears the FK. No email snapshots, child profiles, user agents, answers or referrer query strings are stored. The ledger is service-role-only with RLS and no public/account privileges.

QA: Vercel preview/local environment, authenticated test@cleverli.ch, internal_qa=1 query/same-site referrer or x-cleverli-internal-qa:1 header. A caller-supplied QA marker labels a request, it is not an entitlement. It cannot bypass authorization. Use the marker in all free PDF tests. Ordinary production requests need no marker. Known test accounts are always excluded regardless of client assertions.

## Owner report
Run from a protected environment:

    CLEVERLI_ENV_FILE=/protected/production.env node scripts/report-worksheet-downloads.cjs 2026-10-07T00:00:00Z

The report captures an upper time bound, paginates, excludes QA and recognised automated requests, separates free/premium/teacher and worksheets/solutions, and attributes private downloads to current account email via the privileged Auth API. Never expose the service credential or this command as a public endpoint. Free usage is anonymous counts, not person-level analytics. Preserve the privacy policy and retention/deletion obligations.

## Availability and non-regression
Recording is bounded to three seconds and best effort. A telemetry outage produces a sanitised Sentry error and does not block PDF delivery; counts may have gaps during such an outage. No existing GA4, Google Ads, Meta, goals, consent, cookies, event parameters or bidding inputs were modified. Existing free PDF URLs remain identical, so existing GA4 link tracking keeps its semantics. No new analytics browser identifier or consent prompt was introduced.

Apply supabase/2026-10-07-worksheet-download-events.sql before release. Check service insert permission, anon/authenticated read/write denial and actual stored responses. Rollback code only to the previous production commit if needed; retain the private table/evidence rather than dropping records.
