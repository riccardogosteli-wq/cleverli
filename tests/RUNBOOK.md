# Cleverli Test Suite — Runbook

## Quick Start

Tell Goku: **"Run the Cleverli test suite"**

## Manual Commands

```bash
cd ~/projects/cleverli

# 1. Refresh auth state (if login stopped working)
npx playwright test tests/auth.setup.ts --project=setup

# 2. Core suites (fast — ~1 min total)
npx playwright test \
  tests/specs/01-smoke.spec.ts \
  tests/specs/02-auth.spec.ts \
  tests/specs/03-dashboard.spec.ts \
  --project=mobile --reporter=line --no-deps --workers=4

# 3. Full exercise suite (slow — ~5 min, 986 tests)
npx playwright test tests/specs/04-exercises.spec.ts \
  --project=mobile --reporter=line --no-deps --workers=4
```

## Test Account
- Email: test@cleverli.ch
- Auth state saved at: `tests/.auth/state.json`

## Suites Overview

| File | What it tests | Tests |
|------|--------------|-------|
| 01-smoke | All pages load, no JS crashes | 16 |
| 02-auth | Login/logout/session/signup | 8 |
| 03-dashboard | Grade×subject×topic navigation | 21 |
| 04-exercises | Exercise types, answers, paywall, TTS | ~986 |
| 05-child-flows | XP, coins, shop, trophies, daily | — |
| 06-parent-flows | Account, family CRUD, upgrade | — |
| 07-tts | Voice API all 4 languages | — |
| 08-mobile | 390×844 layout screenshots | — |
| 09-i18n | All 4 languages (DE/FR/IT/EN) | — |

## When Tests Fail

1. Read `test-results/<test-name>/error-context.md` — shows the actual page snapshot
2. Check if it's a **test selector bug** (page works fine but selector doesn't match)
   or a **real app bug** (page shows "Application error" or wrong content)
3. For real bugs: fix in `src/`, `npm run build`, push → Vercel auto-deploys (~90s)

## Known Selector Rules
- Pages use `<div>` wrappers, **not** `<main>` → use `nav` as presence check
- Login/signup tests: add `test.use({ storageState: { cookies:[], origins:[] } })` 
  (logged-in session redirects `/login` before the form renders)
- Exercise player: detect via `button:has-text('Tipp')` or `h1` (no data-testid on player)

## Vercel Deploy Check
```bash
curl -s "https://api.vercel.com/v6/deployments?projectId=prj_Ag2EEO40W112aEc1yzAYWMCQrwdK&limit=1" \
  -H "Authorization: Bearer $VERCEL_TOKEN" | \
  python3 -c "import json,sys; d=json.load(sys.stdin); print(d['deployments'][0]['state'])"
```
