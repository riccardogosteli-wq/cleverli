# Cleverli — Product Roadmap
_Last updated: 2026-03-03_

---

## 🔴 CRITICAL — User Journey Bugs (Fix Before Any Marketing)

These are flow-breaking issues found in the user journey audit. They actively damage trust and conversion.

---

### ✅ UJ-1 · Homepage shows "Kostenlos starten" to logged-in users ⚠️
**Severity:** Critical  
**Where:** `/` (homepage) — hero, pricing section, rewards section, bottom CTA banner  
**Problem:** `page.tsx` never reads `useSession`. A logged-in user sees "Kostenlos starten →", "Konto erstellen", "Jetzt starten" — all pointing at `/signup`. Completely breaks the experience for returning users.  
**Fix:** Import `useSession` in homepage. Replace CTAs based on state:
- Anonymous → current (signup/start free)
- Logged in free → "Weiterlernen →" → `/dashboard`
- Logged in premium → "Zum Dashboard →" + no pricing section

---

### ✅ UJ-2 · Signup collects data but creates no account ⚠️
**Severity:** Critical  
**Where:** `/signup` — Step 3 "Los geht's!"  
**Problem:** `handleStart()` just calls `router.push("/dashboard")`. Name, email, password entered by user are silently discarded. User believes they have an account.  
**Fix (interim, before real auth):** At minimum store session in localStorage on submit:
```js
setSession({ email, name, premium: false });
```
**Fix (proper):** Supabase auth integration

---

### ✅ UJ-3 · Login page accessible to logged-in users — no redirect ⚠️
**Severity:** High  
**Where:** `/login`, `/signup`  
**Problem:** No `useEffect` redirect. A logged-in user can visit `/login` — confusing.  
**Fix:** Add redirect to `/dashboard` if session exists on mount.

---

### UJ-4 · Dashboard has no awareness of premium vs free ⚠️
**Severity:** High  
**Where:** `/dashboard`  
**Problem:** `dashboard/PageClient.tsx` never reads `useSession` or `isPremium`. Topics show identically for free and premium users. No visual indicator of which topics require premium, no upsell CTA. Users don't know what they get with premium.  
**Fix:** Read `isPremium` on dashboard. Mark locked topics with 🔒. Add subtle "Unlock all" banner for free users.

---

### ✅ UJ-5 · Topic completion screen has no "Next topic" flow ⚠️
**Severity:** High  
**Where:** Exercise completion screen in `ExercisePlayer.tsx`  
**Problem:** After finishing a topic, user gets "Nochmal spielen" and "Andere Themen" — no intelligent "Next →" button that takes them to the logical next topic. Duolingo always pushes you forward. Here you have to navigate back and choose.  
**Fix:** Pass topic index + full topic list into ExercisePlayer. After completion, show "Nächstes Thema →" pre-filled with next topic.

---

### ✅ UJ-6 · Wrong answer = immediate next question — no feedback moment ⚠️
**Severity:** High  
**Where:** `ExercisePlayer.tsx` — `onAnswer` handler  
**Problem:** After a wrong answer, the exercise shows the correct answer briefly (via `answered` state + 900ms timeout), then moves on. There's no dedicated "that was wrong, here's why" screen. Kids skip over it without processing. Duolingo shows a full red panel with the correct answer + explanation.  
**Fix:** Add a proper wrong-answer feedback panel — red background, ✗, show correct answer, show `explanation` if present, require user to tap "OK got it" to continue.

---

### ✅ UJ-7 · No "Review mistakes" mode after topic ⚠️
**Severity:** High  
**Where:** Topic completion flow  
**Problem:** Exercises answered incorrectly are not queued for review. User earns stars even with 1/10 correct. Duolingo's core loop is built on this. Kids repeat until mastered.  
**Fix:**
1. Track `wrongIds: string[]` per exercise session
2. After topic done: if `wrongIds.length > 0` → show "Noch {n} Aufgaben üben?" screen
3. Filter exercise list to failed ones, re-run them
4. Bonus 5 XP on clean review pass
5. Dashboard shows 🔄 badge on topics with pending reviews

---

### UJ-8 · Free banner shown to premium users ⚠️
**Severity:** Medium  
**Where:** `ExercisePlayer.tsx` line 317–320  
**Problem:** `{!isPremium && idx < FREE_LIMIT && ...}` shows "3 kostenlose Aufgaben — alle freischalten" banner. If user is premium this is hidden. BUT if session isn't loaded yet (SSR hydration gap), premium users briefly see the free banner. Also it shows during free exercises even when user just signed up.  
**Fix:** Only show after hydration is complete (`loaded === true`).

---

### ✅ UJ-9 · Rewards page has no paywall — anyone sets rewards ⚠️
**Severity:** Medium  
**Where:** `/rewards`  
**Problem:** The rewards dashboard (creating family rewards, setting goals) is accessible to all users regardless of premium status. This is a premium feature per the pricing page.  
**Fix:** Gate rewards creation behind `isPremium`. Free users see a preview + upsell.

---

### UJ-10 · Daily challenge has no streak "protection" info ⚠️
**Severity:** Medium  
**Where:** `/daily`  
**Problem:** Streak is a key retention mechanic but there's no UI explaining what happens if you miss a day, no "streak freeze", no grace period. Users lose streaks silently and feel cheated.  
**Fix:** Add "⚠️ Mach heute noch deine Aufgabe! Streak läuft um Mitternacht ab" reminder. Consider 1-day grace period.

---

### ✅ UJ-11 · No onboarding after signup ⚠️
**Severity:** High  
**Where:** Post-signup redirect → `/dashboard`  
**Problem:** After "signup" (even the broken one), user lands on a dashboard that asks "In welcher Klasse bist du?" — cold, no welcome, no explanation of what XP/stars/streaks mean, no guided first exercise. Duolingo has a full onboarding flow.  
**Fix:** Detect first-time user (no `cleverli_last_grade` in localStorage). Show:
1. Welcome modal "Willkommen bei Cleverli! 🎉"
2. "Welche Klasse?" → select
3. "Dein erstes Thema" → pre-select and start first exercise automatically
4. After first exercise: explain XP + stars

---

### ✅ UJ-12 · No "Back" or breadcrumb during exercise ⚠️
**Severity:** Medium  
**Where:** `/learn/[grade]/[subject]/[topic]`  
**Problem:** The breadcrumb shows above the exercise but during an active exercise session, accidentally tapping "Dashboard" loses all progress. No confirmation dialog.  
**Fix:** If exercise is in progress (`idx > 0 && !done`), intercept navigation with "Übung abbrechen? Fortschritt geht verloren." confirmation.

---

### ✅ UJ-13 · No empty state on dashboard for new users ⚠️
**Severity:** Medium  
**Where:** `/dashboard`  
**Problem:** New user → selects grade → sees topic list. No XP bar shows (XP = 0). No encouragement. No "Start here" highlighted. Just a grid of equal-looking topics.  
**Fix:** For users with 0 XP, highlight the first topic with an arrow + "Hier starten! 👆". Show a subtle "Dein erster Stern wartet!" nudge.

---

### ~~UJ-14 · Language switcher — browser language detection~~
**Status:** REMOVED — not wanted at this time (2026-03-03)

---

### ✅ UJ-15 · Score/progress not visible during exercise ⚠️
**Severity:** Medium  
**Where:** `ExercisePlayer.tsx` — exercise header  
**Problem:** During a 10-exercise topic, user sees current question but no progress indicator (X/10, progress bar). Duolingo has a prominent progress bar + hearts. Users don't know how far they are.  
**Fix:** Add a thin progress bar at top of exercise: `idx / exercises.length`. Show "3/10" counter.

---

### ✅ UJ-16 · Kids and Parents routes freely accessible — no separation ⚠️
**Severity:** Medium  
**Where:** `/kids`, `/parents`  
**Problem:** A child can navigate to `/parents` and see (or worse, modify) parent-side settings. There's no PIN gate.  
**Fix:** See roadmap item PM-4 (Parent PIN Gate below).

---

## 🟠 HIGH PRIORITY — Features

### PM-1 · Real Authentication (Supabase)
Current state: hardcoded test accounts, localStorage session, signup discards data.
- Email + password via Supabase Auth
- `cleverli_session` replaced by JWT cookie (httpOnly)
- Session server-read (SSR-safe, eliminates hydration flash)
- Password reset, email verification
- Profile data stored in Supabase, synced from localStorage on first login

---

### PM-2 · Payment / Checkout (Stripe + TWINT)
- Stripe Checkout for card + Apple Pay
- Payrexx or Stripe's TWINT integration (Swiss-specific)
- Monthly CHF 9.90 + yearly CHF 99
- Webhook → set `premium: true` in Supabase user record
- Manage/cancel in parent dashboard

---

### PM-3 · Parent PIN Gate (no separate login)
**Concept:** Parents tap "🔐 Elternbereich" in nav/settings. Prompted for 4-digit PIN (set on first use). Unlocks for 30 min via `sessionStorage`. Kids never see PIN.

**Parent area includes:**
- PIN setup / change
- Child profile management (up to 3)
- Progress overview per child
- Subscription / billing
- Weekly email report opt-in
- Rewards configuration

---

### PM-4 · Child Profile System (up to 3 kids)
Each profile: name, emoji avatar, grade, own XP/progress/achievements/streak.
- Profile picker on dashboard open ("Wer lernt heute?")
- Kids create own profile on first use (name → grade → start)
- Profile stored in `cleverli_profiles[]` in localStorage (later Supabase)
- ProfileContext updated to support multi-profile + switching

---

### PM-5 · Mistake Correction / Review Mode (Duolingo-style)
See UJ-7 above. After every topic:
- Track `wrongIds[]`
- Queue review if > 0 errors
- "🔄 Wiederholen" badge on topics in dashboard
- Bonus XP on clean pass

---

### PM-6 · Onboarding Flow (First-Time User)
See UJ-11 above.
- Welcome modal
- Grade selection (if not already set)
- First exercise guided launch
- Post-first-exercise: explain XP, stars, streaks

---

## 🟡 MEDIUM PRIORITY

### ✅ PM-7 · Progress Bar During Exercise
See UJ-15. Thin bar at top, "X/10" counter.

### ✅ PM-8 · Wrong Answer Feedback Panel
See UJ-6. Full red panel, correct answer shown, explanation text, tap to continue.

### ✅ PM-9 · Next Topic Auto-Suggest
See UJ-5. After topic completion, suggest next topic with one tap.

### ~~PM-10 · Browser Language Detection~~
**Status:** REMOVED — not wanted at this time (2026-03-03)

### ✅ PM-11 · Navigate-Away Confirmation During Exercise
See UJ-12. Intercept back/breadcrumb if exercise in progress.

### ✅ PM-12 · Empty State + "Start Here" Nudge for New Users
See UJ-13. Highlight first topic, welcome nudge.

### PM-13 · Streak Reminder + Grace Period
See UJ-10. Deadline reminder, 1-day grace period option.

### PM-14 · Premium Paywall on Dashboard (locked topics)
See UJ-4. Lock icon on premium topics, inline upsell for free users.

### ✅ PM-15 · Mobile Layout Optimization — DONE (2026-03-03)

---

## 🟢 NICE TO HAVE

### PM-16 · Offline Mode (PWA)
Service worker, cached exercises, sync on reconnect.

### PM-17 · Teacher Dashboard
Class view, homework assignment, CSV/PDF export.

### PM-18 · Gamification Expansion
Weekly XP leaderboard, seasonal trophies, sound effects, streak milestones.

### PM-19 · Accessibility — Full WCAG AA
Exercise image alt texts (per exercise data), keyboard navigation, high contrast mode.

### PM-20 · Image/Emoji Audit — All Exercises
- Grade 2 science: full emoji review
- Grade 3 science: full emoji review
- All drag-drop + memory exercises: verify visual clarity
- Replace ambiguous emojis with custom SVG illustrations (like plant parts done 2026-03-02)

---

## ✅ Completed

### 2026-03-03

**Auth & CSP fix**
- [x] CSP `connect-src` fix — was blocking Supabase auth calls (`connect-src 'self'` → added `*.supabase.co`, `formspree.io`, GA/GTM domains)
- [x] Signup "Los geht's!" button now works on live site (real Supabase auth confirmed ✅)

**Child profiles UI (PM-3/PM-4)**
- [x] `ChildProfileManager` component — add/switch/delete up to 3 children behind PIN gate
  - Avatar picker (18 emoji), name input, grade selector (1–3)
  - Delete with confirmation step
  - Active profile highlighted green
- [x] Navigation profile switcher dropdown — appears when 2+ profiles exist, avatar pill + child name, switch reloads context
- [x] Child IDs now use `crypto.randomUUID()` — valid UUID, compatible with Supabase FK

**Supabase progress sync (PM-1 extension)**
- [x] `src/lib/progressSync.ts` — new file, all sync helpers:
  - `syncProfileToSupabase(childId, profile)` → upserts XP/streak/counters to `child_progress`
  - `syncTopicProgressToSupabase(...)` → upserts stars/score to `topic_progress`
  - `loadProfileFromSupabase(childId)` → restore profile on new device (cross-device support)
  - `loadTopicProgressFromSupabase(childId)` → restore topic progress on child switch
  - `createChildInSupabase()` / `deleteChildFromSupabase()` — child CRUD in DB
- [x] `useProfile.ts` — `saveProfile()` fires `syncProfileToSupabase()` after every save; on mount: loads from Supabase if localStorage is empty (new device)
- [x] `ExercisePlayer.tsx` — `syncTopicProgressToSupabase()` called on topic complete
- [x] `Navigation.tsx` — `switchProfile()` restores topic progress from Supabase before reload
- [x] Architecture: localStorage = source of truth, Supabase = cross-device backup, all fire-and-forget

**Reward text polish**
- [x] 🍦 "Ein Glace aussuchen" → "Ein Glace essen"
- [x] 🎬 "Kinoabend aussuchen" → "Kinoabend"
- [x] 🧁 "Zusammen einen Kuchen backen" — removed
- [x] Fixed in both `page.tsx` (homepage demo) and `src/lib/rewards.ts` (actual reward templates)

**GTM integration**
- [x] Google Tag Manager GTM-K48335JC added to all pages via root layout
  - Script in `<head>` via `next/script` (beforeInteractive)
  - Noscript iframe at top of `<body>`
  - CSP updated for GTM/GA domains
  - TODO: dataLayer purchase event after Payrexx payment wired up

**Mobile layout polish (PM-15)**
- [x] `MobileBottomNav` component — sticky bottom tab bar, `sm:hidden`
  - 4 tabs: 📚 Lernen / ⚡ Täglich / 🏆 Trophäen / 🎁 Prämien
  - Active tab: green text + top indicator bar
  - Disappears during exercise sessions (focus mode)
  - 4 languages, safe-area padding for iPhone notch
- [x] Logo reduced: 90px → 58px on mobile (`sm:h-[80px]`)
- [x] Double speaker icon 🔊🔊 fixed in ExercisePlayer (emoji was in both JSX and i18n string)
- [x] Bottom padding `pb-24 sm:pb-*` added to all pages: dashboard, trophies, daily, rewards, parents, kids, family, homepage footer
- [x] UJ-14 / PM-10 (browser language detection) removed from roadmap — not wanted

**HEAD commit:** `b36f3f9`

---

### 2026-03-02

### 2026-03-02 (evening — UJ audit batch 1)
- [x] UJ-1: Homepage session-aware CTAs
- [x] UJ-2: Signup persists session to localStorage
- [x] UJ-3: Login + Signup redirect when already logged in
- [x] UJ-5: "Nächstes Thema →" button after topic completion
- [x] UJ-6: Wrong-answer red feedback panel (shows correct answer + explanation)
- [x] UJ-7: Review mode — failed exercises re-queued after topic
- [x] UJ-9: Rewards page gated behind isPremium (free users see upsell)
- [x] UJ-11: Onboarding modal (Welcome → Grade → How-it-works → first topic)
- [x] UJ-12: Leave-exercise confirmation dialog on breadcrumb navigation
- [x] UJ-13: Empty state nudge + highlighted first topic for 0 XP users
- [x] UJ-15: Thin progress bar + X/Y counter always visible during exercise
- [x] UJ-16: Parent dashboard behind 4-digit PIN gate (30 min session)
- Security headers added (CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy)
- Science/NMG topics added to sitemap (26 new pages)
- App pages marked `noindex` with server wrappers (dashboard, trophies, rewards, daily, family, kids, parents)
- 4 missing i18n keys added in FR/IT/EN (costumeHat, costumeCape, costumeCrown, exercisesLeft)
- Mobile nav fully migrated to `tr()` i18n system
- Rewards nav button: aria-label added
- Language switcher: proper `role=listbox`, `aria-selected`, `aria-expanded`
- Skip-to-content link added
- `document.documentElement.lang` syncs dynamically with language switcher
- Footer text contrast: gray-400 → gray-500
- `@keyframes` moved from inline JSX to globals.css
- Dashboard: 3× H1 → H2 (single H1 per page)
- Orphaned assets deleted (~3.5MB: duplicate JPGs, unused PNGs, boilerplate SVGs)
- TWINT/PayPal → honest "TWINT & Kreditkarte (bald)" in all 4 languages
- Premium upsell: "10 Aufgaben" → "Unbegrenzter Zugriff auf alle Aufgaben"
- Plant emojis fixed: custom SVG illustrations for Wurzel, Stängel, Blatt, Blüte, Samen, Boden
- Mascot hat overlay removed from kids + trophies dashboards
- Level progress bar redesigned (cleaner grid, XP progress bar, better labels)
- DragDrop: image items rendered larger (52px min) than emoji items

---

## 🔧 OPS / MONITORING

### MON-1 · Uptime & Flow Monitoring
**Priority:** High — do before payment goes live
**What to monitor:**
- Homepage loads (cleverli.ch)
- Signup flow completes (end-to-end)
- Login flow completes
- Payment flow completes (once live)
- API/Supabase reachability

**Options:**
- **BetterUptime / UptimeRobot** — free tier, pings every 5 min, alerts via email/Telegram
- **Checkly** — can run real browser flows (signup, login) as monitors
- **Vercel Analytics** — basic error tracking (already available, just enable)

**Minimum viable:** UptimeRobot free tier for homepage + Vercel error alerts
**Ideal:** Checkly for full signup/login flow tests + Telegram alerts to Ricci
