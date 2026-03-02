# Cleverli — Product Roadmap

_Last updated: 2026-03-02_

---

## 🔴 Critical (Pre-Launch)

### 1. Real Authentication (Backend)
Current state: 100% localStorage — no real accounts, data lost on device change.
- Replace hardcoded test accounts with Supabase auth
- Email + password signup/login
- Session persistence (JWT cookies)
- Password reset flow

### 2. Payment / Checkout
Current state: "TWINT & Kreditkarte (bald)" shown, no actual checkout.
- Integrate Stripe or Payrexx (Swiss-friendly, supports TWINT)
- Monthly (CHF 9.90) + yearly (CHF 99) plans
- Webhook → set `premium: true` in user record
- Cancel/manage subscription in parent dashboard

---

## 🟠 High Priority

### 3. Mistake Correction / Review Mode (Duolingo-style)
**Concept:** After a child completes a topic, any exercises they answered wrong are queued for a "Review Round." They must answer them correctly before earning full stars.

**Implementation:**
- Track `wrongIds: string[]` in topic progress (already have score/completed)
- After topic completion: if `wrongIds.length > 0`, show "Übungsstunde!" screen
- Filter exercises to only the failed ones, re-run them
- Reward bonus XP on clean review pass
- Visual: show a "🔄 Wiederholen" badge on topics with pending reviews on dashboard

**Files to touch:** `ExercisePlayer.tsx`, `lib/progress.ts` (new), topic result screen

---

### 4. Parents Section — PIN Access (no separate login)
**Concept:** No separate parent login. Instead, within the app, parents tap a "Eltern-Bereich" button and enter a 4-digit PIN they set themselves. Kids never see the PIN prompt unless they navigate there.

**What the parents section includes:**
- PIN setup (first time) / PIN change
- Child profile management (see below)
- Learning progress per child (already partially built in /parents)
- Billing / subscription management
- Notification preferences
- Weekly progress report (email opt-in)

**Implementation:**
- Store hashed PIN in localStorage under `cleverli_parent_pin`
- "Eltern-Bereich" button visible in nav (gear icon or lock icon)
- Entering correct PIN → unlocks parent dashboard for 30 min (stored in sessionStorage)
- No re-auth needed until session expires or app is closed

**Files:** new `ParentPinGate` component, `/parents/PageClient.tsx` refactor

---

### 5. Child Profile System (up to 3 kids)
**Concept:** Parents create up to 3 child profiles. Each profile has:
- Name (required)
- Avatar/emoji choice
- Grade setting (1–3)
- Own XP / progress / achievements / streak (isolated per profile)

**Profile switching:**
- On dashboard: show "Wer lernt heute?" profile picker if multiple profiles exist
- Kids can create their own profile on first use (name + grade, no account needed)
- Parent dashboard shows progress per child

**Implementation:**
- Profile data structure: `{ id, name, emoji, grade, xp, achievements, streak, ... }`
- Store array of profiles in localStorage: `cleverli_profiles: Profile[]`
- `activeProfileId` stored in localStorage
- `ProfileContext` updated to support multiple profiles + switching
- Profile creation wizard (2 steps: name → grade → start!)

**Files:** `lib/ProfileContext.tsx` refactor, new `ProfilePicker` component, `/kids/PageClient.tsx`

---

### 6. Mobile Layout — Top Content Too Large
**Issue:** On mobile, the header/mascot hero section is too tall. When scrolling down, the exercise content area is squeezed.

**Fixes:**
- Reduce mascot size in kids dashboard hero (96px → 72px on small screens)
- Make nav height responsive (currently fixed h-14)
- Sticky progress bar: compress on scroll (JS intersection observer)
- Reduce padding on mobile for `/learn/` pages
- Consider bottom navigation bar for mobile (replaces hamburger menu)

---

## 🟡 Medium Priority

### 7. Image / Emoji Quality Audit — All Exercises
**Issue:** Several exercise emojis don't visually match the concept (Wurzel = worm 🪱, Boden = worm 🪱). Grade 1 science fixed (2026-03-02), others need review.

**To do:**
- [ ] Grade 2 science — full emoji audit
- [ ] Grade 3 science — full emoji audit  
- [ ] All drag-drop exercises — verify drop zone labels match visual items
- [ ] All memory pairs — verify both sides of pair are clearly related
- [ ] Consider using real images (PNG) for complex concepts instead of emoji

---

### 8. Exercise Content Expansion
- Grade 1–3 for all 3 subjects: currently ~200 exercises
- Target: 500+ exercises
- Missing exercise types: ordering/sequencing, audio-based, drawing/tracing (future)
- All exercises need reviewed by an educator

---

### 9. Daily Challenge Improvements
- Streak freeze (miss a day → grace period)
- Weekend mode (shorter challenges)
- Seasonal/special challenges (Christmas math, etc.)

---

## 🟢 Nice to Have

### 10. Accessibility — Screen Reader / WCAG AA Completion
- Exercise question images need meaningful alt text (tracked per exercise)
- Full keyboard navigation through exercises
- High contrast mode toggle

### 11. Offline Mode (PWA)
- Service worker for cached content
- Queue progress locally, sync when back online
- Install prompt on mobile

### 12. Teacher Dashboard
- Class view: aggregate progress across students
- Assign specific topics as homework
- Export reports (CSV/PDF)

### 13. Gamification Expansion
- Weekly XP leaderboard (family/class)
- Seasonal trophies (🎃 Halloween, ⛄ Winter, 🌸 Spring)
- Sound effects and animations on correct answers
- Streak milestone celebrations

---

## ✅ Completed (2026-03-02)

- [x] Security headers (CSP, X-Frame-Options, HSTS, etc.)
- [x] Science/NMG topics added to sitemap (26 new pages)
- [x] App pages marked noindex (dashboard, trophies, etc.)
- [x] i18n — 4 missing keys added in FR/IT/EN
- [x] Mobile nav fully i18n-ized (removed hardcoded ternary chains)
- [x] Rewards nav button — aria-label added
- [x] Language switcher — proper role=listbox, aria-selected
- [x] skip-to-content link added
- [x] HTML lang attribute syncs dynamically with language switcher
- [x] Footer contrast: gray-400 → gray-500
- [x] @keyframes moved from inline JSX to globals.css
- [x] Dashboard: 3x H1 → H2 (single H1 per page)
- [x] Orphaned assets deleted (~3.5MB)
- [x] TWINT/PayPal → "TWINT & Kreditkarte (bald)" (honest copy)
- [x] Premium upsell: "10 Aufgaben" → "Unbegrenzter Zugriff auf alle Aufgaben"
- [x] Plant emojis fixed: Wurzel 🌾, Stängel 🪴, Samen 🌱, Boden 🟫
- [x] Mascot hat overlay removed from kids + trophies dashboards
- [x] Level progress bar redesigned (cleaner grid layout, XP bar, better labels)
