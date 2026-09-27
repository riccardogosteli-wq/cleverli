# Worksheet website section: parent release handoff

## Ownership and disposition

Implementation is isolated on `feat/worksheet-library-20260927`, based on `ea625c8bf2afbb39c6b7380c2c83516c57602431` in `/Users/riccardogosteli/.openclaw/workspace-cleverli/worksheet-library-review`. Dirty main was never edited. No push, deployment, production storage upload, customer/profile mutation or customer message was performed. Parent owns independent review, storage provisioning, release and Telegram delivery for message 6270.

Local QA disposition: **approved**, subject to parent review and the explicit release prerequisites below. This is author verification, not an independent agent/teacher review or live certification.

## Routes and design

- `/arbeitsblaetter`: indexable public landing page, real Grade 3 Brüche PDF preview, one public pupil PDF with view/download actions, grade teasers and clear Premium benefit.
- `/arbeitsblaetter/bibliothek`: noindex shell. Authenticated catalogue fetched only after server access validation. Grade 1–6 controls, subject selection, topic/LP21 search, result counts, empty state, reset and separate worksheet/solution downloads. Grouped by grade and subject, with narrow original curriculum scope/code/source links.
- `/api/worksheets`: authenticated catalogue when no query; authenticated PDF stream with exact `id` and `type=worksheet|solution`. No bulk/preview/list bypass endpoints or signed public paths.
- One intentional public exception: `/worksheets/beispiel-klasse-3.pdf`, Brüche, Grade 3 mathematics, 1 A4 page, 854519 bytes. SHA-256 `e2538dcd2580dcc874741c9ad5f3f6119263a9184d797c08106521c33a8eea1a`.
- Public thumbnail is rasterised from that actual approved PDF, not a generated mockup. No full-library PDFs or solutions are in public assets, client bundles or deployment payload.
- Discovery links on the home platform overview and teacher page. Child mobile bottom tabs are omitted only on worksheet routes, leaving child navigation elsewhere unchanged.
- Existing login supports a narrowly allowlisted worksheet return route, including initial grade. Upgrade and payment-success wrappers add only a worksheet return link. A validated two-hour sessionStorage hint preserves that link across the existing checkout path. No checkout, event, pricing, consent or billing semantics changed.
- No bulk downloads: omitted to keep access checks, file sizes and teacher interaction simple and auditable.

## Coverage and integrity

303 distinct canonical topics and 606 approved individual PDFs. Grade totals: **36 / 35 / 51 / 61 / 60 / 60**. Current checked-in runtime catalogue independently reconciled: **366 entries = 303 canonical topics + 63 legacy nt/rzg aliases**. Every alias maps to a canonical science topic. No missing-topic claim and no complete LP21 competency certification.

Every source file matches the approved manifest SHA-256 and byte length, including the split pages belonging to the four immutable Grade 2 originals. Source PDFs, originals, exercises and source metadata were never rewritten. The server-only inventory is `src/lib/worksheets/catalogue.json`. All 606 endpoint response bodies were also verified against those hashes with mocked local storage.

Total private PDF content: **529886345 bytes**, intentionally excluded from Vercel deployment. Only the public sample (~835 KiB) and its real thumbnail (~84 KiB) are added as public assets.

## Access and storage design

Server verifies the bearer token through **Supabase auth.getUser**, then reads `parent_profiles.premium,premium_until` and the current user's `teacher_accounts` record with the established service-role runtime. It does not trust localStorage, submitted user IDs, JWT claims without verification or the billing-display API.

Effective entitlement mirrors current `useSession` plus `teacherAccountActive`: authoritative premium=true with null or strictly future valid expiry, OR active, strictly unexpired teacher access. This includes paid/trial/lifetime/manual/manual_owner access according to current app policy, and preserves valid access until its end after cancellation. Expired, malformed, free or revoked access is denied. Any database/config failure is fail-closed.

All API responses, including errors, use private/no-store, Vary Authorization and noindex. PDFs use application/pdf, attachment disposition and nosniff. User inputs select only a fixed manifest ID and type; no arbitrary paths/buckets/URLs or user IDs. Downloaded bytes must match the manifest before they are returned. No customer or billing writes.

New dedicated bucket: `cleverli-worksheets-20260927`, private, PDF only, max object size 4800000. The additive SQL adds a restrictive guard preventing anon/authenticated object access even if unrelated permissive storage policies exist. Service-role backend serves bytes after entitlement checks. No existing bucket or policy is replaced.

### Parent provisioning procedure, before release

1. Review and execute `supabase/2026-09-27-worksheet-library.sql` through the established authorised Supabase SQL/migration runtime. It is transactional and repeatable, creates only the dedicated bucket and guard, and refuses existing public/mismatched state rather than changing it. Preserve its final SELECT readback: `public=false`, restrictive ALL guard for anon/authenticated with both expressions. SQL has been inspected but **not executed against production** in this task.
2. From this worktree, dry-run again if needed:

   `node scripts/worksheets/upload.mjs --root /Users/riccardogosteli/.openclaw/workspace-cleverli/worksheets/all-grades-2026-09-26`

3. Upload using the existing protected runtime file, read internally; no credentials in command arguments or output:

   `node scripts/worksheets/upload.mjs --root /Users/riccardogosteli/.openclaw/workspace-cleverli/worksheets/all-grades-2026-09-26 --apply --env /Users/riccardogosteli/projects/cleverli/.env.vercel.production`

   Script verifies all local hashes before writes, checks the bucket is private, uses sequential paced requests, retries transient failures with backoff, never overwrites a differing object and reads back every PDF hash. Reruns verify and skip identical objects. Save final `{verified:606,...,readback:'all SHA-256 match',public:false}` receipt. Stop on mismatch; do not enable public access as a workaround.
4. Check unauthenticated public-object and authenticated direct-storage access remain denied. Do not create impersonation tokens or grant test entitlements. Use only an existing authorised account for the authenticated storage check, or verify the restrictive SQL policy readback and report the unavailable account boundary.

**Production upload and readback are pending with parent, not claimed complete.** Existing environment names are reused: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on server; existing public anon key for browser auth. No new secrets needed.

## Verification evidence

All paths below are relative to this worktree.

- `node scripts/worksheets/test.cjs`: **1270 checks pass**, including 606 source hashes, 606 actual handler response hashes, 303 mappings, 63 aliases, expiry boundaries, anonymous/invalid/free/paid/trial/lifetime/manual/owner/teacher/lapsed/revoked cases, duplicates/path traversal/arbitrary query rejection, private response headers, corrupt-object fail-closed, and zero mutation calls. Supabase/storage mocked locally, not production auth testing.
- Existing unchanged regressions: payment/tracking **44**, teacher/admin contracts **39**, account identity **8**, cancellation/billing **81** pass. Logs under `.qa/worksheet-library/`.
- Targeted ESLint: clean. `git diff --check`: clean.
- Production build `npm run build -- --webpack`: passes TypeScript and 373 page generation. Default Turbopack cannot follow this isolated external node_modules symlink; using supported webpack required no production config change. Existing Sentry dependency/deprecation warnings remain, not feature errors.
- Build used explicit non-production public fixture configuration for isolated UI tests. Do **not** promote local `.next`; normal Vercel release must rebuild against existing production configuration.
- `scripts/worksheets/browser-qa.cjs`: actual built app, isolated context in OpenClaw-managed Chromium, desktop 1440×1050 and mobile 390×844. Local-only auth/API network fixtures; actual approved PDF bytes. No production fake auth, real signup, payment, email or account mutation.
- Browser interactions: public sample download, grade-specific login and return, 303-topic library, grade/subject/search filtering, empty state/reset, worksheet and solution downloads with approved hashes, free-user gate, upgrade and post-checkout return link. No horizontal overflow. No unexpected page/console or failed request errors; one expected 403 console message proves deliberate free-user denial.
- Native browser navigation to loopback was policy-blocked; no policy settings were changed. The local Playwright test harness used the existing managed Chromium through its supported CDP endpoint. This is local test evidence, not production-browser certification.
- All screenshot evidence visually inspected: `.qa/worksheet-library/public-desktop.png`, `public-mobile.png`, `library-desktop.png`, `library-mobile.png`, `gate-desktop.png`, `empty-state.png`.
- `client-isolation.json`: all 114 built client chunks checked; private worksheet IDs, object paths and bucket identifier absent. Actual built anonymous endpoint returns 401/private/no-store; private shell contains no catalogue and has robots/googlebot noindex,nofollow.
- `upload-dry-run.json`: all 606 approved assets checked, no upload.

## Tracker

Master Sheet `1BOnbcrxZo_CNunRnT195YCEjvZQIvcVmrTXEWJfi90A`, actual **Roadmap row 21**. Scoped row appended, progress updated and read back; unrelated rows compared and unchanged. Final readback evidence: `.qa/worksheet-library/tracker-final.json`. Do not modify unrelated Bugs/Blockers rows or six-account billing warnings.

## Release and handoff checklist

1. Parent independently reviews code, screenshots, access implementation and SQL, then completes storage steps/readback above.
2. Rebase/cherry-pick the implementation commit onto the current release branch only after reviewing newer commits, without touching dirty main. Run normal build and the documented regression tests in the release checkout.
3. Parent pushes/deploys through the usual authorised path. No push/deploy was authorised to this implementation writer.
4. Hard-navigate live `/arbeitsblaetter` and `/arbeitsblaetter/bibliothek` after promotion. Verify desktop/mobile sample display and PDF hash, noindex, sitemap, discovery links, anonymous and genuine existing free/premium/teacher access where authorised, and full approved PDF hash readback. Never seed fake production auth or mutate entitlements to test.
5. Verify production console/page/critical-request results, update and read back Roadmap21 with the actual release ID and live outcome.
6. Parent sends one concise verified result to originating Telegram message6270 and confirms delivery. This handoff is not customer delivery.

Limitations: production provisioning, production entitlement/PDF validation, independent parent review and customer delivery remain pending. No physical printing/classroom validation or external curriculum certification. No newly authored or changed PDF content. Existing six-account billing warning intentionally untouched.
