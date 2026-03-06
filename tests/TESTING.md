# Cleverli — Testing Strategy & Runbook

## Layers

| Layer | Tool | Cost | Catches |
|-------|------|------|---------|
| **1. Playwright** | `npx playwright test` | Free (CI) | Crashes, broken flows, missing elements, JS errors, 404s, paywall logic |
| **2. Haiku visual review** | `python tests/haiku-visual-review.py` | ~$0.15/run | Layout issues, truncated text, wrong colors, confusing UX, duplicate info |
| **3. Sonnet (us)** | OpenClaw chat | $$$ | Bug fixing only |

**Rule:** Never burn Sonnet on bug *discovery*. Use Playwright + Haiku for that.

---

## Quick commands

```bash
# Run ALL functional tests (full suite, ~10 min)
npx playwright test

# Run one spec only
npx playwright test tests/specs/14-missionen.spec.ts

# Run mobile viewport tests only
npx playwright test --project=mobile

# Run fast subset (smoke + nav + progress)
npx playwright test 01-smoke 15-nav-links 16-progress-persistence

# ── Visual review workflow ──

# Step 1: Take screenshots of every page
npx playwright test 18-all-routes-screenshot.spec.ts

# Step 2: Run Haiku review (needs ANTHROPIC_API_KEY)
export ANTHROPIC_API_KEY=sk-ant-...
python tests/haiku-visual-review.py

# Step 2b: Review only mobile screenshots
python tests/haiku-visual-review.py mobile

# Report saved to: tests/reports/visual-audit-YYYY-MM-DD.md
```

---

## Test specs overview

| File | What it tests |
|------|--------------|
| `01-smoke` | All pages load, no crash |
| `02-auth` | Login, logout, session persistence |
| `03-dashboard` | Dashboard layout, grade switching, child profiles |
| `04-exercises` | Exercise player for every topic in every grade |
| `05-child-flows` | XP, coins, shop, trophies, daily challenge |
| `06-parent-flows` | Account, family, upgrade, subscription |
| `07-tts` | TTS API endpoint for all 4 languages |
| `08-mobile` | Layout at 390×844 on key pages |
| `09-i18n` | Language switching DE/FR/IT/EN |
| `10-progress-map` | Roadmap SVG, checkpoint dots, tier progress |
| `11-go-live` | Auth guards, paywall, SEO, performance |
| `12-multi-child` | Multiple child profiles, grade isolation |
| `13-audit-fixes` | Specific regression tests for past bugs |
| `14-missionen` | New Missionen page: tabs, topic cards, links |
| `15-nav-links` | All routes resolve, no 404s, redirect chains |
| `16-progress-persistence` | localStorage save/reload, XP, lang pref |
| `17-exercise-types` | All exercise types render + accept input |
| `18-all-routes-screenshot` | Screenshot capture (input for Haiku review) |

---

## When to run what

| Situation | Run |
|-----------|-----|
| After any code change | `01-smoke 15-nav-links` (fast, 2 min) |
| After exercise/topic changes | `04-exercises 17-exercise-types` |
| After UI/design changes | `18-all-routes-screenshot` → Haiku review |
| Before deploy | Full suite `npx playwright test` |
| Weekly visual audit | Haiku review (~$0.15, 5 min) |

---

## Screenshots

Stored in `tests/screenshots/` (gitignored).
Named: `{mobile|desktop}--{page-name}.png`

---

## Haiku review output

Saved to `tests/reports/visual-audit-YYYY-MM-DD.md`
Severity levels:
- 🔴 **Critical** — fix before next deploy
- 🟡 **Warning** — fix soon
- 🔵 **Minor** — cosmetic, low priority
