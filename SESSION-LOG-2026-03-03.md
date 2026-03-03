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

## Current State

- **Live**: https://www.cleverli.ch
- **Repo**: `riccardogosteli-wq/cleverli` (branch: main)
- **HEAD**: `9dbf8b8`
- **Vercel**: All deployments green ✅

## Open / Pending

1. **Free tier raise visible on homepage** — pricing section still says "Erste 3 Aufgaben" in FAQ schema (StructuredData.tsx) and FAQ answer text — needs update to "5"
2. **Homepage copy** — still says "1.–3. Klasse" in hero paragraph and features list → update to "1.–6. Klasse"
3. **Vercel Pro upgrade** — required before charging real users ($20/mo)
4. **Supabase schema migration** — `ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS premium_until timestamptz, ADD COLUMN IF NOT EXISTS premium_plan text;`
5. **Google Search Console** — `verification: { google: "" }` still empty in layout.tsx
6. **Content batch** — 50 exercises for remaining grade 1-3 topics; 20+ for grades 4-6
7. **Test full payment flow** — end-to-end with real TWINT

---

*Last updated: March 3, 2026*
