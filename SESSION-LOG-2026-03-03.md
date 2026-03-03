# Cleverli Session Log — March 3, 2026

## Summary of Everything Built

---

## 1. Billing / Cancel Subscription (commit `b131df6`)

**`/account` page — Billing section:**
- Premium users: plan status + 2-step cancel confirmation (idle → confirm → loading → done/error)
- Free users: upsell card with "Upgrade to Premium" CTA
- 4 languages DE/FR/IT/EN throughout
- Reloads page after successful cancel to update badge

**`/api/cancel-subscription` route:**
- Looks up Payrexx subscriptions by `referenceId` ending with `:userId`
- Cancels via Payrexx `DELETE /v1/Subscription/{id}/`
- Sets `premium=false` in Supabase via REST PATCH
- No new DB columns needed

---

## 2. Full Site Audit #1 — Bugs & Translations (commit `8f56777`)

- `/upgrade`: double nav bar removed (page.tsx had duplicate `<Navigation />`)
- `/upgrade`: grayed-out checkout buttons fixed (session load timing)
- ExercisePlayer: double 🎁 emoji in free banner fixed
- Homepage pricing CTA: `href=/signup` → `/upgrade`
- Signup step labels: hardcoded German → `tr()` 4 languages
- Password error: hardcoded German → i18n
- New i18n keys: `whoAreYou`, `yourAccount`, `yourClass`, `passwordMin6`

---

## 3. Full Site Audit #2 — UX/Journey (commit `a38678c`)

| Journey | Bug | Fix |
|---|---|---|
| Mobile (logged-in) | Hamburger showed Login/Signup instead of Account/Logout | Rebuilt auth-aware hamburger |
| Parent area | Zero nav links to `/parents` | Added 📊 to desktop nav + mobile menu |
| Guest → pays | No uid → payment not linked | Redirects to signup first, `?next=` preserves plan |
| Post-payment | Success page routed before webhook fired | Polls Supabase every 2.5s until `premium=true` |

- Signup step 3: grade label role-aware (parent sees "Welche Klasse besucht dein Kind?")
- Role saved to localStorage (`cleverli_role`) at signup step 1
- OnboardingModal: fully translated 4 languages, parent-aware routing
- ExercisePlayer completion/locked screens: all i18n'd

---

## 4. SEO Audit (committed in batch, pushed with grades 4-6)

- Homepage: server wrapper `page.tsx` + `HomeClient.tsx` (fixed `metadata` + `"use client"` conflict)
- Fake `AggregateRating` removed (Google penalty risk)
- `SearchAction` schema removed
- All hreflang tags → `x-default` only
- `lang="de"` → `lang="de-CH"`
- Sitemap: dynamic from data files, includes `/agb`, `/impressum`, `/datenschutz`, `/upgrade`
- `/impressum` + `/datenschutz`: `noindex` kept (Ricci's preference)
- 8 empty `alt=""` → descriptive alt text
- Organization logo: `cleverli-wave.png` → `cleverli-logo.png`

---

## 5. Competitor Audit (documented in `COMPETITOR-AUDIT.md`)

Key findings:
- **ANTON** (free, 50k+ exercises, German-only) = biggest threat
- **Cleverli wins**: only platform with all 4 Swiss languages, TWINT, parent rewards, price
- **Cleverli loses**: content volume, no native app, grades 1-3 only, no teacher portal
- **Biggest opportunity**: FR/IT market almost completely uncontested

Full report: `~/projects/cleverli/COMPETITOR-AUDIT.md`

---

## 6. Free Tier 3 → 5 + Parent Rewards Preview (commit `f7af921`)

- `FREE_LIMIT` in ExercisePlayer: `3` → `5`
- All i18n strings updated: "Erste 5 Aufgaben…" in DE/FR/IT/EN
- `/upgrade` page: new visual parent rewards preview block
  - Shows example rewards (Zoo, Glace, etc.), 60% progress bar, "Lena hat ihr Ziel erreicht!" notification mock
  - Labeled "Nur bei Premium", fully translated 4 languages
  - Placed between feature list and pricing cards to hook parents before paywall

---

## 7. Grades 4–6 Content + Full Grade Expansion (commits `1254954`, `49803e1`, `adc20ea`, `9dbf8b8`)

**New content files (9 files, 270 exercises total):**

| Grade | Math | German | Science |
|---|---|---|---|
| 4 | Zahlen bis 10000, Einmaleins, Brüche kennenlernen | Satzglieder, Zeitformen, Rechtschreibung | Körper & Gesundheit, Lebensräume, Wetter & Klima |
| 5 | Dezimalzahlen, Fläche & Umfang, Brüche addieren | Direkte Rede, Synonyme & Antonyme, Aufsatz | Ökosysteme, Sonnensystem, Strom & Energie |
| 6 | Negative Zahlen, Prozent & Brüche, Gleichungen | Kasus, Textsorten, Rechtschreibstrategien | Schweiz Geografie, Mittelalter, Aggregatzustände |

**10 exercises per topic** — difficulty 1/2/3 (3/4/3), first 3 marked `free: true`

**All grade selectors updated to 1–6 in:**
- `src/data/index.ts` (GRADES, getTopics map)
- `src/app/dashboard/PageClient.tsx`
- `src/app/kids/PageClient.tsx`
- `src/app/signup/SignupClient.tsx`
- `src/components/OnboardingModal.tsx`
- `src/components/ChildProfileManager.tsx`
- `src/app/rewards/PageClient.tsx`
- `src/app/parents/PageClient.tsx`
- `src/app/daily/PageClient.tsx`
- `src/lib/family.ts`
- `src/app/sitemap.ts`
- `src/hooks/useProfile.ts`

**Bug fixes related to grade expansion:**
- Removed "coming soon" placeholder block for grades 4-6 on dashboard
- `GRADE_COLORS` already had 6 entries (no crash)
- Homepage `page.tsx` split into server wrapper + `HomeClient.tsx` (build error fix)

---

## Git Log (this session, from a38678c)

```
9dbf8b8  fix: extend GRADE_COLORS to 6 entries
adc20ea  fix: remove 'coming soon' placeholder for grades 4-6
49803e1  fix: split homepage into server page.tsx + HomeClient.tsx
1254954  feat: add grades 4-6 content + expand all grade selectors to 1-6
f7af921  feat: free tier 3→5, add parent rewards preview on upgrade page
```

(Earlier session commits: `b131df6`, `8f56777`, `a38678c`)

---

## Evening Session (18:00–19:10)

### 14. Mobile Dashboard Layout Fix (commit `8b6c05e`)

**Problem:** Full desktop Sidebar was rendering inline on mobile, eating ~260px before the grade picker:
- XP/level card
- Reward widget
- Tagesaufgabe card

**Fix:** Added `MobileDailyBar` component — single compact 40px row showing ⚡ Tagesaufgabe +30 XP →
- Hides automatically when daily already done
- Full Sidebar remains desktop-only (`hidden md:block`)
- Grade picker and topic list now appear immediately below the nav on mobile

**Files changed:** `src/app/dashboard/PageClient.tsx`

---

### 15. Drag-Drop Answer Bug Fix (commit `ea40d88`)

**Problem:** Some drag-drop exercises always returned "wrong" even for correct answers.

**Root cause:** 2 exercises had `dropAnswers` in backwards format.
- Correct format: `{ itemId: zoneId }` (item → which zone it belongs to)
- Wrong format they had: `{ zoneId: itemId }` (reversed — keys were zone IDs)

The check logic iterates zones, filters `items.filter(item => answers[item.id] === zone.id)` — with reversed keys this always returns empty, so every answer is marked wrong.

**Fixed:**
| File | Exercise | Was | Fixed |
|------|----------|-----|-------|
| `grade1/german.ts` | ew13 "Tiere zuordnen" | `{ "z-hund": "hund-tile" }` | `{ "hund-tile": "z-hund" }` |
| `grade1/math.ts` | f7 Formen-Drag | `{ "zone-rund": "kreis" }` | `{ "kreis": "zone-rund" }` |

**Audit:** Programmatically scanned all drag-drop exercises across all grades/subjects — only these 2 were wrong. Language-agnostic fix (works for DE/FR/IT/EN).

---

## Current State

- **Live**: https://www.cleverli.ch
- **Repo**: `riccardogosteli-wq/cleverli` (branch: main)
- **HEAD**: `ea40d88`
- **Vercel**: All deployments green ✅

## Open / Pending

1. **Resend setup** — Ricci needs to create free account at resend.com, get API key, verify `hallo@cleverli.ch` as sender domain, add `RESEND_API_KEY` to Vercel
2. **TWINT live payment test** — end-to-end real CHF transaction before launch
3. **Google Search Console** — `verification: { google: "" }` still empty in layout.tsx
4. **Content batch** — all topics thin (~10 exercises), need 20–30 per topic
5. **Grades 4–6** — content + unlock flow still sparse
6. **Vercel Pro upgrade** — deferred until 5 paying customers

---

*Last updated: March 3, 2026 — 19:10*
