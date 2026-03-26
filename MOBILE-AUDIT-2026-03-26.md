# Mobile Audit — Cleverli — 2026-03-26

## Executive Summary

**Mobile Score: 72 / 100**

Cleverli has a solid mobile foundation: the MobileBottomNav is well-implemented, safe-area insets are handled in the layout, viewport meta allows pinch-zoom (good for accessibility), and most exercise types work with touch. However there are several launch-blocking issues and a number of high-priority UX problems that will hurt engagement on iOS Safari and Android Chrome.

**Top 5 blockers:**
1. Login form inputs trigger iOS keyboard zoom (font-size < 16px)
2. WordSearch grid cells are only 28–34px — far below 44px tap target minimum
3. NumberLine slider thumb is 28px — painful for young fingers
4. Dashboard grade/subject picker pages lack bottom padding — content hidden behind MobileBottomNav
5. RewardUnlockedModal only uses `mousedown` for backdrop close — broken on iOS

---

## Critical Issues (launch blockers)

### C1 — Login inputs trigger iOS keyboard zoom
- **What:** `LoginClient.tsx` — email and password `<input>` elements have class `text-sm` (14px) and no explicit `fontSize: "16px"` inline style. iOS Safari auto-zooms any input with font-size < 16px, causing a jarring page zoom on focus.
- **Affected:** All iOS Safari users (iPhone SE → Pro Max)
- **Why:** Every login attempt produces an ugly zoom-in, zoom-out jump. Core user flow.
- **Fix:** Add `style={{ fontSize: "16px" }}` to both inputs, plus `autoComplete="email"` and `inputMode="email"` for the email field, `autoComplete="current-password"` for password.
- **Effort:** Low

### C2 — WordSearch cells below minimum tap target
- **What:** `WordSearch.tsx` — `cellSize` is `34px` for 8×8 grids and `28px` for larger. Apple HIG minimum is 44px; Material is 48px. Primary school children (age 6–12) need even larger targets.
- **Affected:** All devices, most severe on iPhone SE (320px wide)
- **Why:** Children will repeatedly mis-tap, leading to frustration. The exercise becomes unusable on small phones.
- **Fix:** Use CSS container scaling + increase minimum cell size to 36px with `min(calc((100vw - 48px) / gridSize), 44px)` sizing. Wrap grid in `overflow-x-auto` to prevent horizontal scroll.
- **Effort:** Medium

### C3 — NumberLine slider thumb too small (28px)
- **What:** `NumberLine.tsx` — the range input thumb is styled to `width: 28px; height: 28px` — below 44px HIG minimum. Young children struggle with precise slider interaction.
- **Affected:** All touch devices
- **Why:** Core interactive element. Mis-interaction = wrong answers, child frustration.
- **Fix:** Increase thumb to `44px × 44px`. Also increase track height to `h-5` (20px) for a bigger hit area.
- **Effort:** Low

### C4 — Dashboard grade/subject picker pages lack bottom nav clearance
- **What:** `DashboardPageClient.tsx` — the grade picker and subject picker steps use `py-6` with no bottom padding for the MobileBottomNav. The topic list step correctly has `pb-24` but the first two steps don't.
- **Affected:** All mobile users (MobileBottomNav is sm:hidden = always shown on mobile)
- **Why:** The bottom buttons/content get hidden under the 64px nav bar.
- **Fix:** Add `pb-24 sm:pb-6` to both grade-picker and subject-picker container divs.
- **Effort:** Low

### C5 — RewardUnlockedModal backdrop close broken on iOS
- **What:** `RewardUnlockedModal.tsx` — backdrop click-to-close only listens to `mousedown` events. iOS Safari fires synthetic mouse events, but there's a ~300ms delay and unreliable behavior when the touch is on a fixed overlay.
- **Affected:** iOS Safari
- **Why:** Users get stuck in the modal and can't close it easily, or must tap the button.
- **Fix:** Add `touchstart` handler alongside `mousedown`, or switch to `pointerdown`.
- **Effort:** Low

---

## High Priority

### H1 — Login: missing `autocomplete`, `inputMode`, accessibility attributes
- **What:** `LoginClient.tsx` — email input lacks `autoComplete="email"` and `inputMode="email"`. Password input lacks `autoComplete="current-password"`. No password show/hide toggle.
- **Affected:** All mobile users
- **Why:** Without `autocomplete`, iOS can't autofill credentials from Keychain. `inputMode="email"` shows the proper keyboard with `@` key. Password toggle is required for WCAG 1.3.5.
- **Fix:** Add attributes + a show/hide toggle button on the password field.
- **Effort:** Low

### H2 — MemoryGame cards use unoptimized `<img>` for back face
- **What:** `MemoryGame.tsx` — the face-down card uses `<img src="/images/mascot/cleverli-thumbsup.png">` (raw `<img>`, not `next/image`). This bypasses Next.js optimization and lazy loading.
- **Affected:** All mobile (especially slower Android devices)
- **Why:** Unoptimized image loads slow the game, especially on 3G/LTE. Also no `width`/`height` causes layout shift.
- **Fix:** Replace with `<Image>` from `next/image`.
- **Effort:** Low

### H3 — ChildProfileManager avatar buttons at 40px (below 44px HIG)
- **What:** `ChildProfileManager.tsx` — `AvatarPicker` renders buttons with class `w-10 h-10` = 40px × 40px. Apple HIG minimum is 44px.
- **Affected:** iOS users
- **Why:** Users accidentally select wrong avatar; frustrating during onboarding.
- **Fix:** Change to `w-11 h-11` (44px) or add `min-w-[44px] min-h-[44px]`.
- **Effort:** Low

### H4 — ChildProfileManager "Wechseln" button tiny on mobile
- **What:** `ChildCard` — the "Wechseln" button uses `text-xs px-3 py-1.5`, which is approximately 30px height. Below minimum.
- **Affected:** All mobile
- **Why:** Parents can't reliably switch profiles.
- **Fix:** Change to `py-2 text-sm` minimum, add `min-h-[44px]` or use `h-10` minimum.
- **Effort:** Low

### H5 — FillInBlank auto-focuses input on load (bad on mobile)
- **What:** `FillInBlank.tsx` — on mount, `inputRef.current?.focus()` is called. On mobile this immediately shows the keyboard, which covers the question text and progress bar.
- **Affected:** iOS Safari, Android Chrome
- **Why:** Children can't read the question before typing. Keyboard jumps layout.
- **Fix:** Remove the auto-focus on mobile (use `isMobile` check that's already in the component): `if (!isMobile) inputRef.current?.focus()`.
- **Effort:** Low

### H6 — MemoryGame minimum card height 72px on small screens
- **What:** `MemoryGame.tsx` — cards use `minHeight: "72px"` in a grid of up to 4 columns. On a 320px wide screen with 4 columns: `(320 - 32px padding - 3×8px gap) / 4 = 67px`. Cards become only 67px wide but need to be square for readability.
- **Affected:** iPhone SE (320px)
- **Why:** Cards too small to read labels or images.
- **Fix:** Limit to 3 columns maximum on small screens (already using `cols` var), ensure minimum size is 72px. The current `grid-cols-4` for 4 pairs could overflow on 320px — cap at `grid-cols-3`.
- **Effort:** Low

### H7 — DragDrop: draggable item minimum width 70px may be too narrow
- **What:** `DragDrop.tsx` — draggable items have `minWidth: "70px"` but this is a minimum; actual width depends on label length. On 320px screen with many items in a flex-wrap, items can get crowded.
- **Affected:** 320px devices
- **Why:** Items overlap or wrap awkwardly, making drag-and-drop difficult.
- **Fix:** Add `min-w-[76px]` and ensure `py-3` for better touch area. The current `px-3 py-2` gives roughly 36-40px height — needs `py-3` minimum.
- **Effort:** Low

---

## Medium Priority

### M1 — Missing `prefers-reduced-motion` support
- **What:** ExercisePlayer and several components use CSS animations (bounce, wiggle, slideIn, shake, popIn) with no `@media (prefers-reduced-motion: reduce)` check.
- **Affected:** Users with motion sensitivity (vestibular disorders)
- **Why:** Legal accessibility requirement in EU; can cause motion sickness.
- **Fix:** Add `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }` to globals.css.
- **Effort:** Low

### M2 — Dashboard subject switcher horizontal scroll leaks on 320px
- **What:** Dashboard topic list — subject switcher uses `overflow-x-auto flex gap-2 -mx-1 px-1`. On 320px with 7 subjects, buttons can be 80-100px each = 700px total, requiring scroll. The `-mx-1` negative margin could cause issues.
- **Affected:** 320px devices with many subjects (grades 3–6)
- **Why:** Horizontal scroll strip is a good pattern but needs clear visual indication (fade edge) and smooth scrolling.
- **Fix:** Add `scroll-snap-type: x mandatory` and `overscroll-behavior-x: contain`. Add trailing `pr-4` to ensure last item isn't clipped.
- **Effort:** Low

### M3 — ExercisePlayer: tier toast can overlap navigation on iOS
- **What:** ExercisePlayer — `tierToast` uses `fixed top-4 left-1/2 -translate-x-1/2 z-50` but doesn't account for iOS status bar / notch. Top-4 = 16px, which is inside the notch area on iPhone 15 Pro.
- **Affected:** iPhone with notch/Dynamic Island
- **Why:** Toast text hidden behind system UI.
- **Fix:** Change to `top-[max(1rem,env(safe-area-inset-top))]` or `top-16` (after nav bar).
- **Effort:** Low

### M4 — ExercisePlayer: combo badge absolute position may clip
- **What:** ExercisePlayer — combo badge uses `absolute top-2 left-1/2 -translate-x-1/2 z-10` inside a `relative` container. On 320px, the badge text "🔥 8x!" may get clipped.
- **Affected:** 320px devices
- **Why:** Visual feedback broken.
- **Fix:** Use `fixed` positioning instead of `absolute`, similar to tier toast.
- **Effort:** Low

### M5 — Confetti canvas performance on low-end Android
- **What:** `RewardUnlockedModal.tsx` and `Confetti.tsx` use `requestAnimationFrame` canvas loops. On low-end Android devices, this can cause frame drops during the animation.
- **Affected:** Low-end Android devices
- **Why:** App feels janky at critical reward moment.
- **Fix:** Limit particle count on mobile (check `navigator.hardwareConcurrency < 4`), reduce to 40 particles.
- **Effort:** Medium

### M6 — HomeClient `min-h-screen` should be `min-h-dvh`
- **What:** `HomeClient.tsx` — sections use `min-h-screen` which maps to `min-height: 100vh`. On iOS Safari, `100vh` includes the browser toolbar area, causing the hero section to be shorter than the visible viewport.
- **Affected:** iOS Safari
- **Why:** Hero appears cut off or the CTA button not visible without scrolling.
- **Fix:** Use `min-h-dvh` (dynamic viewport height) on the hero section, with `min-h-screen` as fallback.
- **Effort:** Low

### M7 — MobileBottomNav: XP strip may cause height jump
- **What:** `MobileBottomNav.tsx` — the XP strip (`profile.xp > 0`) is conditionally shown above the nav tabs. This causes the nav bar height to change between screens (exercise done vs not started), which can shift content.
- **Affected:** All mobile users
- **Why:** Content jump when XP changes is jarring.
- **Fix:** Reserve the XP strip height always (use `invisible` if no XP), or move it inside the tab row.
- **Effort:** Medium

### M8 — CountingGame emoji buttons rely on `fontSize: clamp(1.75rem, 7vw, 2.5rem)` — may be too small at 320px
- **What:** `CountingGame.tsx` — emoji items use `clamp(1.75rem, 7vw, 2.5rem)` = 22.4px at 320px. The `padding: 6px` and `minWidth: "44px"` are set correctly. Actually at 320px: 7vw = 22.4px font, but the button has `minWidth: 44px` and `minHeight: 44px` — this is OK.
- **Affected:** 320px devices
- **Why:** Actually acceptable - just needs verification.
- **Fix:** None required.
- **Effort:** N/A

---

## Low / Polish

### L1 — Navigation mobile dropdown lacks `overflow-y-scroll` for very small screens
- **What:** `Navigation.tsx` — mobile dropdown can exceed viewport height on very short devices (landscape mode, or many menu items).
- **Fix:** Add `max-h-[80vh] overflow-y-auto` to mobile dropdown.
- **Effort:** Low

### L2 — `active:scale-95` transition may look broken on iOS with tap delay
- **What:** Multiple components use `active:scale-95` for tap feedback. On iOS without `touch-action: manipulation` or `cursor: pointer`, there can be a 300ms delay before active states trigger.
- **Fix:** Add `touch-action: manipulation` or the global CSS `a, button { touch-action: manipulation; }` in globals.css.
- **Effort:** Low

### L3 — Missing ARIA labels on voice toggle button
- **What:** ExercisePlayer — voice toggle button has a `title` attribute but no persistent `aria-label`. On mobile, `title` doesn't show on touch.
- **Fix:** The button already has `title={...}` — change to `aria-label` instead.
- **Effort:** Low

### L4 — RewardWidget not audited (low risk but add aria-labels)
- **What:** `RewardWidget.tsx` — reward progress items likely have icon-only indicators without screen reader context.
- **Fix:** Audit and add `aria-label` descriptions.
- **Effort:** Low

### L5 — Dashboard `loadFamily()` called inside render in an IIFE
- **What:** `DashboardPageClient.tsx` — inside the grade picker render, `loadFamily()` is called inside an IIFE (`(() => { const _fam = loadFamily(); ... })()`). This runs on every render cycle and accesses localStorage synchronously.
- **Fix:** Extract to `useMemo` or existing `useEffect` state.
- **Effort:** Medium

---

## Per-Page Findings

### `/` — Home Page (HomeClient.tsx)
- ✅ Hero CTA buttons have `py-4` (good tap target)
- ✅ `active:scale-95` on CTAs
- ✅ Responsive flex layout switches to column on mobile
- ⚠️ M6: `min-h-screen` instead of `min-h-dvh`
- ⚠️ Subject cards use `hover:shadow` and `hover:-translate-y-0.5` — no `active:` equivalent

### `/login` — Login Page
- 🚨 C1: Input font-size 14px (text-sm) triggers iOS zoom
- 🚨 H1: Missing `autoComplete`, `inputMode` on email; missing `autoComplete="current-password"` on password
- ⚠️ No password show/hide toggle
- ✅ `pb-16` bottom padding sufficient
- ✅ `max-w-sm` container prevents overflow
- ✅ Login button has `py-3 active:scale-95`

### `/signup` — Signup Page
- ✅ `style={{ fontSize: "16px" }}` correctly applied to both inputs
- ✅ `autoComplete="email"` and `inputMode="email"` on email input
- ✅ `autoComplete="new-password"` on password input
- ✅ Submit button has `minHeight: "48px"`
- ✅ `pb-16` bottom padding

### `/dashboard` — Dashboard
- 🚨 C4: Grade picker and subject picker steps missing bottom padding for MobileBottomNav
- ✅ Topic list has `pb-24 sm:pb-5`
- ⚠️ M2: Subject switcher horizontal scroll needs `scroll-snap`
- ✅ Grade buttons are `minHeight: "100px"` — excellent tap targets
- ✅ Subject buttons are `minHeight: "80px"` — excellent
- ✅ Topic cards are `minHeight: "66px"` — acceptable
- ✅ `active:scale-95` on interactive elements
- ✅ Active child profile banner present

### `/learn/[grade]/[subject]/[topic]` — Exercise Page
- 🚨 C2: WordSearch cells 28–34px (too small)
- 🚨 C3: NumberLine slider thumb 28px (too small)
- ✅ MobileBottomNav hidden during exercises (`isExercise` check)
- ⚠️ M3: Tier toast at `top-4` may hit notch
- ⚠️ H5: FillInBlank auto-focuses on mobile showing keyboard immediately
- ✅ ExercisePlayer has `max-w-xl mx-auto` container
- ✅ Progress bar is thin and non-intrusive
- ✅ `pb-28` in review screen for bottom clearance

### `/rewards` — Rewards Page
- ✅ ParentPinGate properly gates parent features
- ⚠️ Not audited in detail; appears responsive

### `/missionen` — Missions Page
- ✅ Subject icons with SVGs
- ⚠️ Achievement icons need `aria-label`

### `/trophies` — (mapped to missionen)
- ✅ Redirects properly

### `/parents` — Parents Dashboard
- ⚠️ Not fully audited; appears to have good structure

---

## Per-Exercise-Type Findings

### MultipleChoice
- ✅ `grid-cols-1` text layout — full width buttons, excellent tap targets (~56px height)
- ✅ `grid-cols-2` image layout — `minHeight: "110px"` per option
- ✅ `active:scale-95` on all options
- ✅ Keyboard shortcuts disabled on mobile (`isMobile` detection)
- ✅ Correct/wrong visual feedback clear

### FillInBlank
- ✅ `fontSize: "clamp(16px, 5vw, 24px)"` — prevents iOS zoom ✓
- ✅ `inputMode` set correctly for numeric vs text
- 🔴 H5: Auto-focuses input on mount — shows keyboard before child reads question on mobile
- ✅ Submit button `py-4` — good tap target

### CountingGame
- ✅ Emoji items have `minWidth: 44px` and `minHeight: 44px`
- ✅ Answer buttons have `minHeight: 56px`
- ✅ `grid-cols-2 sm:grid-cols-4` — 2 columns on mobile (good)

### MemoryGame
- 🔴 H2: Uses `<img>` (not `next/image`) for card back face
- 🔴 H6: 4-column grid on 320px results in ~67px cards (smaller than content needs)
- ✅ `active:scale-95` on cards
- ✅ `minHeight: "72px"` on cards

### DragDrop
- ✅ Uses `pointer` events (works on iOS Safari and Android)
- ✅ `touchAction: "none"` prevents scroll interference
- ✅ Ghost element follows finger correctly
- 🔴 H7: `py-2` on draggable items = ~36px height, needs `py-3`
- ✅ Drop zones `minHeight: "90px"` — adequate

### NumberLine
- 🚨 C3: Slider thumb 28px — below 44px minimum
- ✅ Submit button `py-3 rounded-full` — good
- ✅ Value display circle 64px — clearly visible

### WordSearch
- 🚨 C2: Cell sizes 28–34px — far below 44px minimum
- ✅ `active:scale-90` on cells for feedback
- ⚠️ Grid may cause horizontal scroll on 320px for 8+ columns
- ✅ Word list chips are well-sized

### (Matching — no dedicated component found; implemented as DragDrop)

---

## Quick Wins

| Fix | Impact | File | Effort |
|-----|--------|------|--------|
| Login input `fontSize: 16px` + autocomplete attrs | Stops iOS zoom on login | `LoginClient.tsx` | 5min |
| Dashboard grade/subject picker `pb-24` | Reveals hidden content | `DashboardPageClient.tsx` | 2min |
| FillInBlank: skip autofocus on mobile | Better UX for kids | `FillInBlank.tsx` | 2min |
| NumberLine thumb → 44px | Usable slider for children | `NumberLine.tsx` | 5min |
| WordSearch cell min size increase | Usable word search | `WordSearch.tsx` | 10min |
| `prefers-reduced-motion` in globals.css | Accessibility compliance | `globals.css` | 3min |
| Add `touch-action: manipulation` globally | Removes 300ms tap delay | `globals.css` | 2min |
| RewardModal backdrop: `pointerdown` instead of `mousedown` | Works on iOS | `RewardUnlockedModal.tsx` | 2min |
| MemoryGame: next/image for back face | Performance | `MemoryGame.tsx` | 3min |
| Avatar buttons `w-11 h-11` (44px) | HIG compliant | `ChildProfileManager.tsx` | 2min |
| Navigation mobile dropdown: `max-h-[80vh] overflow-y-auto` | Landscape mode fix | `Navigation.tsx` | 2min |
