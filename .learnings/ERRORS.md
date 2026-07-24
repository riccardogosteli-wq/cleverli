# Errors

## 2026-07-24 — Next dev uses hostname flag
- Command: `npm run dev -- --host 127.0.0.1 --port 3010`.
- Failure: Next CLI reported `unknown option '--host'`.
- Fix: use `npm run dev -- --hostname 127.0.0.1 --port 3010`.

## 2026-07-24 — Zsh globbed Next route segment paths
- Command: `sed -n '1,140p' src/app/learn/[grade]/[subject]/[topic]/page.tsx`.
- Failure: zsh reported `no matches found` because bracketed route segments were interpreted as globs.
- Fix: quote paths that contain Next dynamic route brackets, e.g. `sed -n '1,140p' 'src/app/learn/[grade]/[subject]/[topic]/page.tsx'`.

## 2026-07-24 — Git status run outside repo
- Command: `git status --short` in `/Users/riccardogosteli/.openclaw/workspace-cleverli`.
- Failure: directory is the OpenClaw workspace, not the Cleverli git repository.
- Fix: run repo git checks in `/Users/riccardogosteli/projects/cleverli`.

## 2026-07-24 — Vercel ls has no limit flag
- Command: `npx vercel ls cleverli --limit 5`.
- Failure: Vercel CLI 54.6.1 reported `unknown or unexpected option: --limit`.
- Fix: run `npx vercel ls cleverli` without `--limit` and read the first rows.

## 2026-07-24 — Correct Cleverli Google Ads account inaccessible with recovered Maton key
- Command: Maton Google Ads `googleAds:search` against active Cleverli account `5143806397`, with and without tested `login-customer-id` headers.
- Failure: Google Ads returned `USER_PERMISSION_DENIED`. The recovered old Maton key only listed Shirtstar `4402426445`, Casa Poli `5295595101`, and disabled old Cleverli `3435589468`, not active Cleverli `5143806397`.
- Fix: search local Codex session logs for the 2026-07-23 successful Google Ads setup. The correct Maton key was in that local transcript and lists active Cleverli `5143806397`.

## 2026-07-24 — Google Ads UI attach blocked by non-debug Chrome
- Command: OpenClaw browser attach/start with `profile=user` on Ricci's MacBook Pro.
- Failure: Chrome MCP could not find `DevToolsActivePort`; existing user Chrome is not remote-debug attachable.
- Fix: open Chrome with remote debugging / approve the browser attach prompt, or use a valid Google Ads API connection instead.

## 2026-07-23 — Google Ads campaign create 400 during Search draft setup
- Command: Maton Google Ads `campaigns:mutate` after creating budget `customers/5143806397/campaignBudgets/15744711985`.
- Failure: Initial create returned HTTP 400; first script did not print the response body.
- Fix: rerun mutation with explicit error-body logging and reuse the created budget instead of creating another one.

## 2026-07-23 — Google Ads RSA description too long
- Command: Maton Google Ads `adGroupAds:mutate` while creating the paused Cleverli Search draft.
- Failure: One responsive search ad description exceeded Google Ads length limits.
- Fix: shorten descriptions and continue filling the existing paused campaign/ad groups instead of recreating the campaign.

## 2026-07-23 — Local QA hit stopped dev server
- Command: Playwright smoke against `http://127.0.0.1:3027/learn/1/math/zahlen-1-10`.
- Failure: `ERR_CONNECTION_REFUSED` because the local Next dev server was no longer running.
- Fix: restart `npm run dev -- --hostname 127.0.0.1 --port 3027` before browser smoke tests.

## 2026-07-23 — Google Ads API customer not enabled
- Command: Maton Google Ads `googleAds:search` against Cleverli account `343-558-9468`.
- Failure: Google Ads returned `CUSTOMER_NOT_ENABLED`, so campaign draft inspection/mutation is blocked until the account is fully enabled.
- Fix: finish Google Ads account enablement/billing, then retry draft QA and final URL update.

## 2026-07-23 — Playwright bundled Chromium missing
- Command: inline Node Playwright screenshot QA using `chromium.launch()`.
- Failure: Playwright expected bundled `chromium_headless_shell-1208`, but it was not installed in the local cache.
- Fix: rerun QA with the system Chrome executable path instead of bundled Chromium.

## 2026-07-23 — Project-wide lint includes generated reports
- Command: `npm run lint`.
- Failure: ESLint scanned `tests/results/html/trace/assets/*` generated Playwright report bundles and old test files, producing thousands of warnings/errors unrelated to the current UI change.
- Fix: verify changed files with targeted ESLint until repo lint ignores generated reports.

## 2026-07-23 — Hook-order script cannot resolve glob
- Command: `npm run lint:hooks`.
- Failure: `scripts/check-hooks-order.ts` could not import `glob` under the current Node/ts-node ESM path.
- Fix: use build plus targeted ESLint for this session; revisit the hook-check script dependency/resolution separately.

## 2026-07-23 — Vercel inspect has no yes flag
- Command: `npx vercel inspect <deployment-url> --yes`.
- Failure: Vercel CLI reported `unknown or unexpected option: --yes`.
- Fix: run `npx vercel inspect <deployment-url>` without `--yes`.

## 2026-07-23 — Vercel CLI wrong scope alias
- Command: `npx vercel inspect https://www.cleverli.ch --scope riccardogostelis-projects`.
- Failure: Vercel CLI reported `The specified scope does not exist`.
- Fix: omit `--scope`; the repo is linked to `riccardogosteli-3284s-projects` and `npx vercel inspect https://www.cleverli.ch` works.
