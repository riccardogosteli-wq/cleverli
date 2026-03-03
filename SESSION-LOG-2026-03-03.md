# Cleverli Session Log — March 3, 2026

## What We Built

### 1. Billing / Account Page (commit `d817422`)
**Account page `/account`:**
- Billing section added between premium badge and password card
- Premium users: plan status + 2-step cancel confirmation flow (idle → confirm → loading → done/error)
- Free users: upsell card with "Upgrade to Premium" button
- 4 languages DE/FR/IT/EN throughout
- Cancel reloads page after success to update premium badge

**New API route `/api/cancel-subscription`:**
- Fetches all Payrexx subscriptions for the account
- Finds subscriptions where `referenceId` ends with `:userId`
- Cancels via Payrexx `DELETE /v1/Subscription/{id}/`
- Sets `premium=false` in Supabase via REST PATCH
- No new DB columns needed — uses referenceId lookup at cancel time

---

### 2. Full Site Audit #1 — Bugs, Text, Translations (commit `b131df6`)
**Bugs fixed:**
- `/upgrade`: double navigation bar (layout already adds nav, page.tsx had extra `<Navigation />`)
- `/upgrade`: grayed-out checkout buttons even when logged in (session load timing)
- ExercisePlayer: double 🎁 emoji in free banner (emoji in both i18n string AND JSX)

**Content fixes:**
- freeNoteBanner: "brauchst du ein Konto" → "Premium freischalten" (user might already have account)
- Homepage pricing CTA: `href=/signup` → `/upgrade`
- Signup step labels: hardcoded German → `tr()` with 4-language i18n
- Password error message: hardcoded German → i18n

**New i18n keys (×4 langs):** `whoAreYou`, `yourAccount`, `yourClass`, `passwordMin6`

---

### 3. Full Site Audit #2 — UX/Journey (commit `a38678c`)
**Critical journey bugs fixed:**

| Journey | Bug | Fix |
|---|---|---|
| Mobile (all logged-in users) | Hamburger showed Login/Signup, no Account/Logout/Upgrade | Rebuilt — correct items per auth state |
| Parent: find dashboard | Zero nav links to `/parents` | Added 📊 to desktop nav + mobile menu |
| Guest → pays | No uid → payment not linked to account | Redirects to signup first, `?next=` preserves plan |
| User pays → returns | Success page routes immediately, webhook hasn't fired → user sees paywall | Polls Supabase every 2.5s, spinner until `premium=true` confirmed |

**Journey friction fixed:**
- Signup step 3: "In welcher Klasse bist du?" → "Welche Klasse besucht dein Kind?" for parents
- Role saved to localStorage (`cleverli_role`) at signup → used by OnboardingModal
- OnboardingModal: fully translated 4 languages, parent-aware (parents skip grade step, route to `/parents`)
- ExercisePlayer completion: "Nächstes Thema →", score text, review buttons all i18n'd
- ExercisePlayer locked screen: yearly option + "create free account" i18n'd

**New i18n keys (×4 langs):** `nextTopic`, `perfectRun`, `practiceAgain`, `continueWithout`, `yearlyOption`, `createFreeAccountFirst`, `whichClassChild`, `navParents`, `navAccount`, plus all login/signup error messages

---

### 4. SEO Audit (staged, NOT pushed — saving Vercel build credits)

**Critical fixes:**
- Homepage: added `export const metadata` (was using generic layout fallback)
- Fake `AggregateRating` (47 reviews, 4.9★) removed — Google penalty risk
- `SearchAction` schema removed — Cleverli has no search
- All hreflang tags pointed to same URL → replaced with `x-default` only
- `lang="de"` → `lang="de-CH"` (more precise for Swiss market)

**Important fixes:**
- Sitemap: missing `/agb`, `/impressum`, `/datenschutz`, `/upgrade` → added; topic list now **dynamic from data files** (auto-updates as content grows)
- `/impressum` + `/datenschutz`: `noindex` intentionally kept (Ricci's preference)
- Login, Signup, Account, AGB: split into server `page.tsx` + `*Client.tsx` — proper metadata on each
- Organization logo: `cleverli-wave.png` (mascot) → `cleverli-logo.png`
- 8 empty `alt=""` across marketing/exercise images → descriptive alt text added
- Subject page keywords enhanced; topic fallback "Thema nicht gefunden" → noindex

---

## Architecture / Key Files Reference

| File | Purpose |
|---|---|
| `src/app/api/cancel-subscription/route.ts` | Cancel Payrexx subscription + set premium=false |
| `src/app/api/checkout/route.ts` | Create Payrexx Gateway; now redirects guests to signup |
| `src/app/api/webhooks/payrexx/route.ts` | Receive payment confirmation, flip premium=true |
| `src/app/payment/success/SuccessClient.tsx` | Premium activation polling (2.5s interval, 30s max) |
| `src/app/payment/cancel/CancelClient.tsx` | Multilingual cancel page with uid in retry URLs |
| `src/app/account/AccountClient.tsx` | Account page with billing section |
| `src/components/Navigation.tsx` | Nav with parent link + correct mobile hamburger |
| `src/components/OnboardingModal.tsx` | Multilingual, parent-aware welcome flow |
| `src/app/login/LoginClient.tsx` | Login (was page.tsx — split for metadata) |
| `src/app/signup/SignupClient.tsx` | Signup (was page.tsx — split for metadata) |
| `src/app/sitemap.ts` | Dynamic sitemap from data files |
| `COMPETITOR-AUDIT.md` | Full competitor analysis |

---

## Decisions Made Today

| Decision | Rationale |
|---|---|
| `/impressum` + `/datenschutz` stay noindex | Ricci's explicit preference |
| Cancel subscription: lookup by referenceId at cancel time | Avoids needing new DB column for subscription_id |
| Premium activation: poll Supabase (not webhook push) | Simpler than server-sent events; 30s max wait acceptable |
| Hreflang: x-default only | All language variants share same URL — identical hreflang URLs are pointless/harmful |
| Free tier stays at 3 for now | Competitor audit recommends raising to 10 — pending Ricci decision |

---

## Open Items / Next Steps

### Pending push (SEO fixes staged)
```bash
cd ~/projects/cleverli && git push origin main
```

### Decisions needed from Ricci
1. **Free tier**: keep 3 or raise to 10? (competitor audit recommends 10)
2. **Vercel Pro upgrade**: required before charging real users ($20/mo)
3. **Supabase SQL**: `ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS premium_until timestamptz, ADD COLUMN IF NOT EXISTS premium_plan text;`

### Build queue
- Content sprint: 50 exercises for Addition bis 10, Subtraktion bis 10, Buchstaben, Einfache Wörter
- Grades 4–6 (retention fix — parents cancel at grade 4 today)
- PWA install prompt (close app gap perception vs native competitors)
- Teacher lite mode ("share topic with class" link)
- FR/IT marketing landing pages (uncontested market)
- Homepage: add "why not Anton?" positioning section

---

## Current State
- **Live site**: https://www.cleverli.ch
- **Repo**: `riccardogosteli-wq/cleverli` (branch: main)
- **HEAD pushed**: `a38678c` (UX/journey audit)
- **HEAD staged (not pushed)**: SEO audit fixes
- **Vercel**: deploying on each push to main (Hobby plan — commercial use pending Pro upgrade)
