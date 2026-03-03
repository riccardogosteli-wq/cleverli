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

---

## Late Evening Session (19:10–20:20)

### 16. SEO Improvements (commit `5988214`)
- **hreflang tags** for `de-CH`, `fr-CH`, `it-CH`, `en` added to layout — Google now knows it's multilingual
- **Homepage "Alle Themen" section** — 18 direct `/learn/[grade]/[subject]` links added above footer for PageRank flow to all topic pages
- **Topic pages: SSR exercise count** — "X interaktive Übungen · Mathematik 1. Klasse · Lehrplan 21 Schweiz" now visible to Google
- **BreadcrumbList JSON-LD** schema added to all topic pages → sitelinks in search results
- **Grade 4–6 added** to `GRADE_NAMES` in SubjectPage metadata

### 17. Pre-launch Audit #2 — Fixes (commit `4aa0391`)
- **Upgrade page FR/IT/EN**: "1–3" → "1–6" in all 3 languages
- **Upgrade page "50 Aufgaben"** → "Alle Aufgaben" (no false number claim in all 4 languages)
- **FAQ structured data**: "1., 2. und 3. Klasse" → "1.–6. Klasse" in StructuredData.tsx
- **Webhook signature**: hardened — now blocks requests with missing signature header (was soft-skip)

### 18. Reset Profile Progress (commit `5b7706b`)
- **New "Zurücksetzen" button** on each profile card in family management
- **Confirmation modal**: user must type "reset" to confirm (orange button stays disabled until correct)
- **What gets reset**: XP, streak, achievements (profile name/grade stays)
- Translates to all 4 languages

### 19. i18n Fix — mathDesc keys (commit `8e32c56`)
- `mathDesc`, `germanDesc`, `scienceDesc` were used in HomeClient but missing from i18n.ts
- Added to all 4 languages (DE/FR/IT/EN) — was showing raw key names on homepage

### 20. Cross-device Progress Sync Fix (commit `9b24b76`)
- **Bug**: topic progress (`cleverli_1_math_topic`) NOT restored on new device — only XP/streak was
- **Fix**: `loadTopicProgressFromSupabase()` now called on initial load (not just on profile switch)
- **How it works**: on new device with empty localStorage + logged-in user → restores both profile stats AND all topic progress from Supabase simultaneously

### 21. SEO — Grade 4–6 + Structured Data (included in #16)

### 22. Kanban Board — 7 Cleverli tasks added
Tasks added to command-center DB under "cleverli" type:
- 🔴 Cookie consent banner, Set up Resend email, Live TWINT payment test, GSC verification, Blog content
- 🟡 Backlinks — Swiss edu directories, Core Web Vitals check

### 23. Mobile Audit + Fixes (commit `2d4bdce`)
Full 390×844 audit across 7 pages. Fixed:
- **Dashboard dead space**: grade + subject picker now fill viewport height (`min-h-[100dvh-140px]`)
- **Trophies**: `grid-cols-2` → `grid-cols-1` on mobile — larger touch targets, readable text
- **Bottom nav on signup/login/reset-password**: now hidden (was showing greyed nav with no purpose)
- **Rewards mascot**: hidden on mobile (`hidden sm:block`) — saves 25% vertical height
- **Progress indicator**: "Aufgabe 1 von 10" → clean "1/10" on mobile

### 24. Mascot Size (commit `35d31e0`)
- Subject picker mascot: 52px → 80px

### 25. Lehrplan 21 Label Deduplication (commit `6813912`)
- "Klasse 1–6 · Lehrplan 21 →" was repeating in each of the 3 subject cards on homepage
- Removed from cards, now shown once as centered caption below grid
- Translates for FR/IT/EN

---

## Current State

- **Live**: https://www.cleverli.ch
- **Repo**: `riccardogosteli-wq/cleverli` (branch: main)
- **HEAD**: `6813912`
- **Vercel**: All deployments green ✅

## Open / Pending

1. **Resend setup** — create free account at resend.com, get API key, verify `hallo@cleverli.ch`, add `RESEND_API_KEY` to Vercel
2. **Cookie consent banner** — required before launch (Swiss nFADP + EU GDPR)
3. **TWINT live payment test** — end-to-end real CHF transaction before launch
4. **Google Search Console** — verify site → submit sitemap
5. **Blog content** — 5–10 posts for long-tail SEO
6. **Content** — all topics need 20–30 exercises (currently ~10–15)
7. **Vercel Pro upgrade** — deferred until 5 paying customers

---

*Last updated: March 3, 2026 — 20:20*
