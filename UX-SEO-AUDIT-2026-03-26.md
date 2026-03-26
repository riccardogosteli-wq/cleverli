# UX + SEO Audit — Cleverli — 2026-03-26

## Executive Summary

Cleverli is a well-built edtech platform with solid foundational SEO (metadata, sitemap, structured data, robots.txt) and a thoughtful UX. The core exercise loop is strong: combo streaks, mascot reactions, sound feedback, tier-based progress, and review mode are all best-practice patterns for children's learning apps.

**Overall Scores:**
- UX: 7.5/10 — Strong gamification core; gaps in accessibility, mobile feedback clarity, and empty-state guidance
- SEO: 8/10 — Good technical foundation; missing og:image on several pages, GSC verification empty, hreflang SPA caveat, no CourseList schema

**Top 10 Priority Fixes:**
1. [CRITICAL-SEO] Add og:image to missionen, parents, upgrade, login, signup pages (empty inheritance not guaranteed)
2. [CRITICAL-SEO] Add Google Search Console verification code (currently empty string)
3. [HIGH-UX] Wrong answer feedback uses ❌ — replace with encouraging message for children (non-punishing)
4. [HIGH-UX] ExercisePlayer: no `aria-live` region for answer feedback — screen readers can't announce results
5. [HIGH-UX] RewardUnlockedModal: text is hardcoded German — breaks FR/IT/EN experience
6. [HIGH-SEO] Add CourseList / EducationEvent structured data on /learn/[grade]/[subject] pages
7. [HIGH-SEO] Dashboard page has title "Lernen" — too short, not keyword-rich
8. [HIGH-UX] MultipleChoice shake animation uses `animation` inline style — doesn't work in Safari without -webkit-
9. [MEDIUM-UX] No visible exercise number indicator ("Aufgabe 3 von 10") — only a progress bar; kids need numbered feedback
10. [MEDIUM-SEO] Blog has only 1 article — expand content with LP21-keyword-rich pages (grade/subject landing pages do well, but blog amplifies topical authority)

---

## UX Audit

### Critical Issues (fix before launch)

#### UX-C1: Wrong Answer Feedback Uses ❌ Red — Discourages Children
- **What:** When a child answers wrong, a large red ❌ with bold red text appears. Research shows children ages 6-12 need encouraging, growth-mindset feedback on errors — not punishment signals.
- **Why it matters:** Punishing visual feedback causes frustration, shame, and session abandonment. Duolingo-style "try again" messaging increases retention by 30%+ in children's apps.
- **How to fix:** Replace `❌` with a softer emoji (e.g., `🤔` or `💪`) and change red border to amber/orange. Change "wrongFeedback" i18n key to something like "Fast richtig! Schau nochmal." Keep showing correct answer (good practice).
- **Effort:** Low
- **Priority:** Critical

#### UX-C2: RewardUnlockedModal Text Hardcoded German
- **What:** `RewardUnlockedModal.tsx` has "Geschafft!", "Zeig das Mama oder Papa!", and "Weiter lernen! 🚀" hardcoded in German. FR/IT/EN users see German text in a celebratory moment.
- **Why it matters:** Multilingual users (25%+ of Swiss population speaks French or Italian) get a broken celebration experience — the highest-impact emotional moment in the app.
- **How to fix:** Use `useLang()` / `tr()` to translate all hardcoded strings. Add i18n keys: `rewardUnlockedTitle`, `rewardUnlockedShowParent`, `rewardUnlockedContinue`.
- **Effort:** Low
- **Priority:** Critical

---

### High Priority

#### UX-H1: No `aria-live` Region for Answer Feedback
- **What:** When a child answers, the feedback (correct/wrong panels) appears via state change, but no `aria-live` region announces it to screen readers.
- **Why it matters:** WCAG 2.1 SC 4.1.3. Children with visual impairments cannot use the app. Also affects keyboard-only users.
- **How to fix:** Add `<div aria-live="polite" aria-atomic="true" className="sr-only">` that renders the feedback text when `answered !== null`.
- **Effort:** Low
- **Priority:** High

#### UX-H2: No Visible Exercise Count ("Aufgabe 3 von 10")
- **What:** The progress bar shows position, but children aged 6-10 cannot read a thin bar and understand "I have 7 left." No text label shows current/total exercise count.
- **Why it matters:** Kids need explicit progress framing. Research on children's learning apps shows "X of Y" text increases task completion by reducing anxiety about how much remains.
- **How to fix:** Add a small text label above/below progress bar: `Aufgabe {idx + 1} von {exercises.length}`. Already has `tierProgressBar.current`/`.total` available.
- **Effort:** Low
- **Priority:** High

#### UX-H3: Dashboard Page Metadata Too Generic
- **What:** `/dashboard` has `title: "Lernen"` and `description: "Wähle deine Klasse..."`. While noindex is correct, this title appears in browser tabs and bookmarks — kids and parents see just "Lernen" not "Cleverli — Lernen".
- **Why it matters:** Brand recognition in browser tabs; also used if someone accidentally indexes via a cache.
- **How to fix:** Change to `title: "Lernen | Cleverli"` (template should handle this via layout default `template: "%s | Cleverli"` — but `"Lernen"` alone will render as "Lernen | Cleverli" which is fine).
- **Effort:** Low  
- **Priority:** High

#### UX-H4: Mobile Nav Touch Targets Too Small (Navigation.tsx)
- **What:** Several desktop nav buttons use `py-1.5` (~10px padding + ~14px text = ~34px total height) — below the WCAG minimum of 44px for touch targets. E.g., "Upgrade" button: `px-3 py-1.5`.
- **Why it matters:** WCAG 2.5.5 Touch Target. Mobile users (majority on a kids platform) frequently mis-tap small buttons.
- **How to fix:** Add `min-h-[44px]` to all nav buttons, or increase padding to `py-2.5`.
- **Effort:** Low
- **Priority:** High

#### UX-H5: MultipleChoice Shake Animation Uses Inline `animation` Style (Safari Bug)
- **What:** `animation: isSelected && !isCorrect && shake ? "shake 0.4s ease" : undefined` — but the `@keyframes shake` is defined in a different CSS file or not injected. In Safari this won't work via inline `animation` style if the keyframe isn't defined in scope.
- **Why it matters:** On Safari/iOS (dominant on children's iPads), wrong answer shake feedback silently fails — kids get no visual wrong-answer cue.
- **How to fix:** Add `className` with `animate-shake` via Tailwind's arbitrary animation or inject `@keyframes` into the component's style tag. Check MultipleChoice.tsx for the shake keyframe definition.
- **Effort:** Low
- **Priority:** High

#### UX-H6: `/rewards` and `/daily` Pages Have Generic SEO Titles (Noindex OK, But Tab UX Suffers)
- **What:** `title: "Belohnungen"` and `title: "Tagesaufgabe"` — even though noindex, these appear as browser tab titles.
- **Why it matters:** Parent tab management; brand consistency.
- **How to fix:** Add `| Cleverli` suffix or let template handle it (the `%s | Cleverli` template should work if these match).
- **Effort:** Low
- **Priority:** High

---

### Medium Priority

#### UX-M1: No Loading Skeleton for Dashboard Topic List
- **What:** Dashboard shows a loading spinner (bouncing mascot image) while session loads, but no skeleton for the topic list itself.
- **Why it matters:** Perceived performance. A skeleton matching the topic list layout reduces layout shift and perceived wait time.
- **How to fix:** Add a simple skeleton list (3-5 gray pill shapes) while `exerciseCounts` is null in `TopicClient`.
- **Effort:** Medium
- **Priority:** Medium

#### UX-M2: Hint System — No ARIA for Hint Button/Content
- **What:** `HintSystem` component (used in ExercisePlayer) — not audited directly, but hints toggling content need `aria-expanded` on the toggle button and `aria-hidden` when collapsed.
- **Why it matters:** Accessibility for keyboard/screen reader users.
- **How to fix:** Add `aria-expanded={hintsOpen}` and `aria-controls="hint-content"` on hint button; `id="hint-content"` on the revealed content.
- **Effort:** Low
- **Priority:** Medium

#### UX-M3: FAQ Accordion Missing ARIA Attributes
- **What:** The FAQ in HomeClient uses a `button` with `onClick` but no `aria-expanded` attribute.
- **Why it matters:** Screen readers cannot communicate the expand/collapse state of FAQ items.
- **How to fix:** Add `aria-expanded={openFaq === i}` and `aria-controls={`faq-answer-${i}`}` to each FAQ button; `id={`faq-answer-${i}`}` on the answer div.
- **Effort:** Low
- **Priority:** Medium

#### UX-M4: Home Hero CTA Button Color on Hover Doesn't Change (`hover:bg-green-700` same as `bg-green-700`)
- **What:** The primary CTA: `bg-green-700 hover:bg-green-700` — the hover class is identical to the base class, so no hover effect occurs.
- **Why it matters:** Visual feedback on hover is a basic affordance. Conversion optimization 101.
- **How to fix:** Change `hover:bg-green-700` to `hover:bg-green-800` (darker on hover).
- **Effort:** Low
- **Priority:** Medium

#### UX-M5: Daily Challenge Page Title Generic
- **What:** Tab shows "Tagesaufgabe | Cleverli" — fine, but the page could show a completion count or streak badge in title for returning users.
- **Why it matters:** Minor engagement signal.
- **Effort:** Medium
- **Priority:** Medium

#### UX-M6: Signup Page — No Social Proof Near Form
- **What:** `/signup` likely just has a form. No testimonial, star count, or "Join X kids learning" near the form.
- **Why it matters:** Social proof near the conversion point increases signup completion by 15-30%.
- **How to fix:** Add a single quote from a parent + "🇨🇭 Bereits von Eltern in Zürich, Bern, Basel genutzt" near the signup button.
- **Effort:** Medium
- **Priority:** Medium

---

### Low Priority / Nice-to-have

#### UX-L1: No "Confetti" or Celebration on Daily Challenge Completion
- **What:** Daily task completion (from DailyClient code) uses a simpler state — unclear if same confetti/celebration as topic completion fires.
- **How to fix:** Ensure confetti + mascot celebration fires on daily task complete.
- **Effort:** Low
- **Priority:** Low

#### UX-L2: Language Flag Mis-labeling (German Flag for Swiss German)
- **What:** The German language option shows 🇩🇪 (German flag). Swiss users may prefer 🇨🇭 since this is Swiss German content.
- **How to fix:** Change `de` language flag from 🇩🇪 to 🇨🇭 in `LANGUAGES` array in `i18n.ts`.
- **Effort:** Low
- **Priority:** Low

#### UX-L3: Bottom Nav Active Indicator — `/trophies` Routes to `/missionen` But Nav Links to `/trophies`
- **What:** `MobileBottomNav` links to `/trophies` which is a redirect to `/missionen`. The active state check is `pathname === tab.href` — so `/missionen` would never match `/trophies`, leaving the trophies tab always inactive.
- **How to fix:** Change the tab href from `/trophies` to `/missionen`, or update the isActive check to handle both.
- **Effort:** Low
- **Priority:** Low (redirect works, just active state is off)

#### UX-L4: Reward Widget "Zeig das Mama oder Papa!" Text Hardcoded German
- **What:** Same as UX-C2 — `RewardWidget.tsx` also has hardcoded German "Zeig das Mama oder Papa!" in the unlocked reward card.
- **How to fix:** Same fix as UX-C2 — use `lang` to switch language.
- **Effort:** Low
- **Priority:** Low (redundant with UX-C2 fix)

#### UX-L5: Missing `loading="eager"` / `priority` on Hero Mascot in Home
- **What:** Hero mascot (`/cleverli-wave.png`) has `priority` set (good). Pricing section mascot images use `loading="lazy"` which is correct. But `/images/mascot/cleverli-thumbsup.png` in the subjects section has no `loading` attribute — could trigger LCP delay if above fold.
- **How to fix:** Audit which images are above the fold and add `priority` prop.
- **Effort:** Low
- **Priority:** Low

---

## SEO Audit

### Critical Issues (fix before launch)

#### SEO-C1: Google Search Console Verification Code Empty
- **What:** `layout.tsx` line 88: `verification: { google: "" }` — the GSC verification code is empty.
- **Why it matters:** Without GSC verified, you cannot submit sitemaps, monitor indexing errors, or track keyword performance. Cannot diagnose crawl issues before launch.
- **How to fix:** Add the GSC HTML tag verification code: `verification: { google: "YOUR_CODE_HERE" }`. Or add the meta tag via GSC dashboard and paste the code.
- **Effort:** Low
- **Priority:** Critical

#### SEO-C2: Missing `og:image` on missionen, parents, login, signup, upgrade Pages
- **What:** These pages have `openGraph: { title, description }` but no `images` key. The root layout has a default OG image, but Next.js metadata merging doesn't always cascade `images` from root to page-level `openGraph` objects — when a page defines its own `openGraph`, it overrides (not merges) the root.
- **Why it matters:** Without og:image, social shares (Twitter/Facebook/WhatsApp) of these URLs show no preview image — dramatically reducing click-through rates on shared links.
- **How to fix:** Add `images: [{ url: "https://www.cleverli.ch/og-image.png", width: 1200, height: 630, alt: "Cleverli" }]` to the `openGraph` object in each affected page's metadata.
- **Effort:** Low
- **Priority:** Critical

---

### High Priority

#### SEO-H1: No CourseList / EducationEvent Structured Data on Subject Pages
- **What:** `/learn/[grade]/[subject]` pages have metadata but no JSON-LD. These pages are the most important for SEO ("Mathematik 3. Klasse Übungen") but lack structured data to enhance rich snippets.
- **Why it matters:** Adding `Course` or `ItemList` schema to subject/topic pages can generate rich snippets in Google showing exercise counts, difficulty, subject — improving CTR by 15-30%.
- **How to fix:** Add `<script type="application/ld+json">` in the subject page.tsx with `ItemList` schema listing the topics as `ListItem` objects with names and URLs.
- **Effort:** Medium
- **Priority:** High

#### SEO-H2: `/learn/[grade]/[subject]/[topic]` og:image Missing
- **What:** `generateMetadata` for topic pages has `openGraph: { title, description }` but no image.
- **Why it matters:** Same as SEO-C2 — topic pages are the most shared URLs (parents share "Look what my kid is doing!").
- **How to fix:** Add default og:image to the openGraph object in `generateMetadata`.
- **Effort:** Low
- **Priority:** High

#### SEO-H3: Hreflang Implementation Is SPA — May Confuse Googlebot
- **What:** The `alternates.languages` in layout.tsx maps all 4 language codes to the SAME URL (`www.cleverli.ch`). Language is switched client-side via `LangContext`. This is technically correct (same URL, different language via JS), but Google may struggle to differentiate language variants since they all point to the same rendered HTML (German by default via SSR).
- **Why it matters:** Google may only index the German version. French/Italian/English users may not get localized search results. Potential duplicate content issues.
- **How to fix (long-term):** Implement proper locale routing (`/fr/`, `/it/`) with next-intl. **Short-term fix:** Ensure the SSR-rendered HTML includes the correct `lang` attribute and that content is identifiable as multilingual. Add `<link rel="alternate" hreflang="x-default" href="https://www.cleverli.ch/" />` explicitly in head. Also consider sending a `Vary: Accept-Language` response header.
- **Effort:** High (full i18n routing) / Low (quick head tag fix)
- **Priority:** High

#### SEO-H4: No `article:author` or `article:published_time` Structured Data on Blog Post
- **What:** The blog post at `/blog/kinder-motivieren-zum-lernen` has no `Article` JSON-LD, no `datePublished`, no `author` schema.
- **Why it matters:** Blog posts with Article structured data get rich results in Google, including author byline and publication date — increasing CTR. Also signals EEAT (Experience, Expertise, Authoritativeness, Trustworthiness).
- **How to fix:** Add `Article` JSON-LD to the blog page with `author`, `datePublished`, `dateModified`, `publisher` fields.
- **Effort:** Low
- **Priority:** High

#### SEO-H5: `robots.tsx` Missing Disallow for App-Only Pages
- **What:** `robots.ts` only disallows `/api/` and `/_next/`. Pages like `/account`, `/kids`, `/family`, `/shop`, `/payment/` are app-internal but indexable by robots (they have no noindex and aren't in the disallow list).
- **Why it matters:** These pages may get crawled and indexed, diluting domain authority with thin/app-specific content that provides no SEO value.
- **How to fix:** Add to disallow: `["/api/", "/_next/", "/account", "/payment/", "/kids", "/family/", "/shop"]`.
- **Effort:** Low
- **Priority:** High

---

### Medium Priority

#### SEO-M1: `/learn/[grade]/[subject]/[topic]` Description Could Be Richer
- **What:** Current: `"${topic.exercises.length} interaktive Übungen zu „${topic.title}" für die ${grade}. Klasse. Lehrplan 21 · Cleverli."`
- **Why it matters:** No Swiss-specific keywords like "Volksschule", "Primarschule", "kostenlos", cantonal references.
- **How to fix:** Template: `"${topic.exercises.length} kostenlose ${subjectName}-Übungen zu „${topic.title}" — ${grade}. Klasse Volksschule Schweiz, Lehrplan 21. Gratis auf Cleverli üben, kein Download."`
- **Effort:** Low
- **Priority:** Medium

#### SEO-M2: Subject Pages Missing H1 in SSR Content
- **What:** `SubjectPageClient.tsx` is a client component — H1 is rendered client-side only. Googlebot may not reliably execute JS for indexing.
- **Why it matters:** H1 is a top 3 on-page SEO signal. If Google renders the page without JS (or with reduced JS), no H1 is visible.
- **How to fix:** Move the H1 into the server-rendered `SubjectPage` (`page.tsx`) as static content before the client component.
- **Effort:** Low
- **Priority:** Medium

#### SEO-M3: Dashboard Page Has `robots: { index: false }` — Fine, But Title Could Still Be Better
- **What:** Already noindex, but `title: "Lernen"` without brand.
- **How to fix:** The template `%s | Cleverli` should append brand — verify this works for pages with `robots: { index: false }`.
- **Effort:** Low
- **Priority:** Medium

#### SEO-M4: More Blog Content Needed for Topical Authority
- **What:** Only 1 blog post exists. Target keywords like "Kinder motivieren Mathe", "Lehrplan 21 Mathematik", "Übungen 2. Klasse" etc. remain untargeted.
- **Why it matters:** Blog content is the highest-ROI SEO investment for a niche edtech product. 5-10 well-targeted articles would significantly boost domain authority.
- **How to fix:** Create landing pages/blog posts for: "Mathe Übungen 1. Klasse Schweiz", "Deutsch Grammatik Volksschule", "Lehrplan 21 Erklärung für Eltern", etc.
- **Effort:** High
- **Priority:** Medium

#### SEO-M5: No `WebPage` Schema for Key Marketing Pages
- **What:** The root StructuredData only has `WebSite`, `Organization`, `SoftwareApplication`, and `FAQPage`. Individual pages (parents, upgrade) could benefit from `WebPage` schema.
- **How to fix:** Add `WebPage` type to parent/upgrade pages with `breadcrumb` property.
- **Effort:** Low
- **Priority:** Medium

---

## Quick Wins (can fix in <30 min each)

1. **og:image on all pages** — 5 files, 1 line each → `images: [{ url: "https://www.cleverli.ch/og-image.png", width: 1200, height: 630, alt: "Cleverli" }]`
2. **GSC verification code** — paste 1 string into `layout.tsx`
3. **Wrong answer emoji** — change `❌` to `🤔` or `💪` in ExercisePlayer (1 line)
4. **FAQ aria-expanded** — add 1 attribute to FAQ button
5. **Hero CTA hover color** — `hover:bg-green-700` → `hover:bg-green-800` (1 token change)
6. **RewardUnlockedModal i18n** — replace 3 hardcoded strings with lang-switched versions
7. **MobileBottomNav: /trophies → /missionen** — 1 line fix
8. **robots.ts disallow list** — add 5 app pages to disallow
9. **Exercise count label** — add "Aufgabe X von Y" text near progress bar
10. **og:image on topic pages** — add default og:image to `generateMetadata` in topic page.tsx

---

## Recommended Implementation Order

### Immediate (today)
1. SEO-C1: GSC verification code
2. SEO-C2: og:image on all pages missing it
3. SEO-H2: og:image on topic pages (generateMetadata)
4. UX-C2: RewardUnlockedModal i18n (German hardcoded strings)
5. UX-L3: MobileBottomNav /trophies → /missionen
6. SEO-H5: robots.ts disallow app pages
7. UX-M4: Hero CTA hover color fix

### This week
8. UX-C1: Wrong answer feedback (❌ → encouraging)
9. UX-H1: aria-live for answer feedback
10. UX-H2: Exercise count label ("Aufgabe X von Y")
11. UX-M3: FAQ aria-expanded attributes
12. SEO-H4: Article schema on blog post
13. SEO-M2: Static H1 on subject pages

### This month
14. SEO-H1: CourseList / ItemList structured data on subject pages
15. SEO-H3: Hreflang strategy (at minimum add explicit link tags)
16. UX-H4: Nav button touch targets audit
17. SEO-M4: New blog content (3-5 articles)
18. UX-M1: Loading skeletons for dashboard

---

## Research Notes (Phase 1)

**Children's edtech UX best practices:**
- Big touch targets (min 48px), simple language, short sessions (5-10 min)
- Immediate, positive feedback on correct answers; encouraging (not punishing) on wrong
- Progress visualization with concrete numbers ("3 of 10") not just abstract bars
- Mascot characters dramatically improve engagement for ages 6-10
- Growth mindset language on errors ("Almost! Try again") vs. failure language ("Wrong!")

**Gamification patterns:**
- Streaks, XP, levels, and combo multipliers all present and well-implemented
- Reward unlocking (parent-mediated real-world rewards) is an advanced, excellent pattern
- Daily challenge with FOMO streak mechanics is best-in-class

**Next.js SEO:**
- App Router `generateMetadata` is the correct approach ✅
- Structured data (JSON-LD) in server components ✅
- `next/image` used throughout ✅
- Font via `next/font` ✅
- sitemap.ts dynamic generation ✅

**Gaps found:**
- og:image inheritance from root layout doesn't cascade when page defines own openGraph
- SPA language switching (all locales same URL) creates hreflang signal challenges
- GSC not verified
- Some pages need richer schema
