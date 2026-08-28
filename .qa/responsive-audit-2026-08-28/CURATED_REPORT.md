# Cleverli mobile and responsive audit — 2026-08-28

Verdict: `changes_requested`

## Scope

- 372 live routes: 32 core/public/app routes and all 340 topic pages.
- Six viewport classes: 320×568, 360×800, 390×844, 430×932, 768×1024 and 1024×768.
- Nine exercise interaction types at 320, 390 and 768 pixels.
- Mobile navigation, authenticated bottom navigation, forms, touch drag/drop, word search, number line, matching, checkout surfaces and long-form pages.

## Confirmed findings

### High

1. **Exercises start below the first mobile viewport on every topic page.**
   - The first exercise starts about 1,041 px from the top on representative topic pages.
   - The shared layout puts parent-facing “Kurz erklärt” copy and a large roadmap before the exercise on all 340 topic pages.
   - At 320–390 px, children must scroll roughly one to two screens before reaching the task they selected.

2. **The fixed mobile bottom navigation covers homepage footer links.**
   - At 320 and 390 px, `Impressum`, `Datenschutz`, `AGB` and `Kontakt` intersect the 63.5 px fixed navigation bar at the bottom.
   - The shared content wrapper reserves only safe-area padding, not the navigation height.

3. **The blog breadcrumb links to a missing `/blog` page.**
   - `/blog/kinder-motivieren-zum-lernen` renders successfully, but prefetching/clicking its `Blog` breadcrumb produces a 404.

### Medium

4. **Word-search cells are below the 44×44 px touch target.**
   - 36×36 px at 320 px.
   - Approximately 41×41 px at 390 and 768 px because the grid width does not include its gaps.

5. **The exercise voice toggle is only 36×36 px.**
   - This affects every exercise type and makes a frequently used mobile control unnecessarily hard to tap.

6. **The six grade-selector buttons shrink to 41×44 px at 320 px.**
   - The selector technically fits but misses the minimum width for reliable touch use.

7. **The 1×1 reference table hides columns without a mobile scroll cue.**
   - The table is 720 px wide inside a horizontal scroller.
   - At 390 px only `×1`–`×4` are visible; nothing indicates that `×5`–`×10` are off-screen.

8. **Tablet header calls-to-action are only 36 px high.**
   - `Anmelden` and `Kostenlos starten` miss the 44 px touch-height target at the 768 px tablet breakpoint.

### Low / observability

9. **Google Tag Manager transport requests are blocked by the production CSP.**
   - `www.googletagmanager.com` is permitted for scripts and frames but omitted from `connect-src`.
   - This does not break the visible UI, but it can create console noise and incomplete tag diagnostics/measurement.

## Verified passes

- No document-level horizontal overflow across any of the 340 topic pages or 32 core routes at the audited widths.
- Login/signup inputs render at 16 px, avoiding iOS focus zoom.
- The hydrated mobile menu opens and fits at 320 and 390 px without overflow.
- Real touch-event drag/drop passed at 320 and 390 px.
- Counting, multiple choice, fill-in, number line, memory and self-review interactions changed state correctly at phone and tablet widths.
- Matching selection and word-search cell selection respond; their audit does not claim completion from arbitrary test pairs/letters.
- The number-line thumb is explicitly 44×44 px even though the range track itself is 20 px high.
- The apparent Supabase 400s were caused only by the audit's intentionally synthetic child ID and are not production learner errors.
- The multiplication table is contained by its own horizontal scroller and does not create page-level overflow.

## Recommended repair order

1. Move/collapse parent SEO content and compress the roadmap on mobile so the exercise is immediately visible.
2. Reserve bottom-nav height throughout eligible mobile pages.
3. Fix the missing blog index/breadcrumb target.
4. Enlarge word-search cells, voice toggle, grade buttons and tablet CTAs.
5. Add a clear horizontal-scroll affordance to the 1×1 table.
6. Correct the GTM `connect-src` policy and rerun analytics verification.
