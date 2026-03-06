# Cleverli — Runbook

## Setup (one-time)
Add API key to shell so you never type it again:
```bash
echo 'export ANTHROPIC_API_KEY=sk-ant-YOUR-KEY-HERE' >> ~/.zshrc
source ~/.zshrc
```

---

## Daily workflow

### After any code change — quick sanity check (2 min, free)
```bash
cd ~/projects/cleverli
npx playwright test tests/specs/01-smoke.spec.ts tests/specs/15-nav-links.spec.ts
```

### Before a deploy — full functional test (10 min, free)
```bash
cd ~/projects/cleverli
npx playwright test 2>&1 | tee tests/last-run.txt
# Paste only the failures to Goku to fix
```

### Visual/UX audit — Haiku reviews every page (~5 min, ~CHF 0.15)
```bash
cd ~/projects/cleverli

# Step 1: take screenshots of all pages
npx playwright test tests/specs/18-all-routes-screenshot.spec.ts

# Step 2: Haiku reviews them and writes a report
python tests/haiku-visual-review.py

# Step 3: read the report
open tests/reports/visual-audit-$(date +%Y-%m-%d).md
# (or just cat it in terminal)

# Then paste only the 🔴 Critical section to Goku
```

---

## What each command does

| Command | AI involved | Cost | Output |
|---------|-------------|------|--------|
| `npx playwright test` | None | Free | Pass/fail per test |
| `18-all-routes-screenshot` spec | None | Free | PNG files in `tests/screenshots/` |
| `haiku-visual-review.py` | Haiku (vision) | ~CHF 0.15 | Markdown report in `tests/reports/` |
| Chat with Goku (Sonnet) | Sonnet | $$$ | Bug fixes only |

---

## Key test specs

| Spec | Tests |
|------|-------|
| `01-smoke` | All pages load, no crash |
| `14-missionen` | Missionen page, tabs, topic cards |
| `15-nav-links` | No 404s, no dead links, redirect chains |
| `16-progress-persistence` | LocalStorage survives reload, XP, lang |
| `17-exercise-types` | All exercise types + paywall + no duplicate counter |
| `04-exercises` | Every topic in every grade |

---

## Report location
- Functional test output: `tests/last-run.txt`
- Visual audit reports: `tests/reports/visual-audit-YYYY-MM-DD.md`
- Screenshots: `tests/screenshots/` (gitignored)
