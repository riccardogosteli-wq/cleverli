# Errors

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
