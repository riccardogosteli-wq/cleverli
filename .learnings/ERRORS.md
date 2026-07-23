# Errors

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
