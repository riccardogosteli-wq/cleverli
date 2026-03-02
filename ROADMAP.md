# Cleverli — Product Roadmap & Build Status

> Last updated: 2026-03-02

---

## ✅ DONE — Foundation

### Tech Stack
- Next.js 15 + TypeScript + Tailwind CSS
- Deployed on Vercel → `www.cleverli.ch`
- GitHub: `riccardogosteli-wq/cleverli` (branch: main)
- Cloudflare DNS + Email Routing → `hello@cleverli.ch` → Gmail

### Core Architecture
- Full type system (`src/types/exercise.ts`)
- i18n system: DE / FR / IT / EN (LangContext, `src/lib/i18n.ts`)
- Exercise data: Grades 1–3, Math + German (LP21-aligned)
- localStorage progress tracking (`cleverli_${grade}_${subject}_${topicId}`)
- Freemium gate: first 3 exercises per topic free (`FREE_LIMIT = 3`)

### Pages
| Page | Status |
|------|--------|
| `/` — Landing page | ✅ |
| `/dashboard` — Grade + subject + topic picker | ✅ |
| `/learn/[grade]/[subject]/[topic]` — Exercise player | ✅ |
| `/login` | ✅ (UI only, no auth) |
| `/signup` | ✅ (UI only, no auth) |
| `/impressum` | ✅ |
| `/datenschutz` | ✅ |
| `/not-found` | ✅ |

### Components
- `ExercisePlayer` — orchestrates exercises, scoring, streak, voice
- `MultipleChoice` — keyboard + tap support
- `FillInBlank` — free text input, Enter to submit
- `CountingGame` — tap emoji items to count
- `HintSystem` — progressive hint reveal (max 2 tips + solution)
- `ProgressBar` — exercise counter + streak indicator
- `RewardAnimation` — confetti canvas, correct/wrong/topic-complete states
- `Navigation` — responsive, mobile hamburger, lang switcher, fixed-width (no jitter)
- `StructuredData` — JSON-LD (SoftwareApplication + FAQPage)

### SEO & PWA
- Sitemap (`/sitemap.xml`), robots.txt
- Canonical, hreflang (x4 languages)
- OG image (1200×630), favicon, apple-touch-icon, icon-192/512
- PWA manifest, theme_color green

### Voice & Sound
- **Web Speech API** (Phase 1, free): on-demand read-aloud, "Vorlesen" button
- **Cleverli reaction voice** (opt-in toggle 🐿️/🔇): personality phrases on correct/wrong/streak
- TTS cleaning: strips emoji, `«»`, parentheticals, `___`
- **Web Audio API sound effects**: correct, wrong, streak, complete, hint (5 types, zero files)

### UX Audit (6 rounds completed)
- Mobile-first, touch targets ≥ 44px, iOS zoom fix (font-size 16px)
- Safe area insets, hamburger nav, fixed-width containers (no layout shift)
- Swiss-style quotes `«...»` throughout German content
- Content quality: all 3 German files rewritten; math question wording fixed

### Full i18n
- ALL UI strings translated (DE/FR/IT/EN) — no hardcoded German anywhere
- Navigation, dashboard, exercises, hints, rewards, locked screen: 100% translated

---

## 🚧 IN PROGRESS

- ElevenLabs voice search (API key ready, haven't found "Neugier" voice yet)

---

## 🔮 WHAT'S LEFT TO BUILD

### 1. 🎮 GAMIFICATION (HIGH PRIORITY)

#### Achievements System
- **Badges** earned for milestones:
  - First exercise done, first topic complete, 3-day streak, 7-day streak
  - Perfect score (3 stars), subject master (all topics), grade complete
  - Speed run (finish topic in <2 min), night owl (practice after 8pm), early bird (before 8am)
  - Polyglot (use 2+ languages), helper (use hints then still get it right)
- Badge display: trophy room / collection wall
- Animated badge unlock moment (big reward pop-up)

#### XP & Levels
- XP per correct answer, bonus for streak, bonus for no hints used
- Level progression: "Lernling → Bücherwurm → Mathe-Ninja → Cleverli-Meister"
- Level-up animation + celebration

#### Streaks
- Daily login streak (like Duolingo's fire)
- Visual streak counter in nav/dashboard
- "Streak at risk" notification (push/email)

#### Star Ratings (already have 1–3 stars, extend)
- Show star history per topic
- "Beat your record" motivation on replay

#### Cleverli Character Progression
- Cleverli the Marmot gains accessories/outfits as you level up
- Kids unlock a hat at 10 exercises, cape at 50, crown at 100, etc.
- Visual evolution = emotional attachment

---

### 2. 👧 CHILD DASHBOARD (separate from parent)

- Trophy room: all earned badges displayed
- My levels: XP bar, current level, next unlock
- My topics: color-coded progress map (not a list — a visual journey map)
- Daily challenge: one special exercise per day (bonus XP)
- Leaderboard (optional, within family → up to 3 kids compete)
- "Today I learned..." end-of-session summary
- Character customization (choose color/accessory for Cleverli)

---

### 3. 👨‍👩‍👧 PARENT DASHBOARD (separate view)

- Per-child progress summary: topics done, stars earned, time spent
- Weekly report card (auto email every Sunday)
- Streak history calendar (GitHub-style heatmap)
- Weak spots: "Emma struggles with Subtraction — 2 stars avg"
- Achievement feed: "Lena earned 'Mathe-Ninja' today 🎉"
- Settings: set daily practice goal (10/15/20 min), notifications on/off
- Multi-child toggle (up to 3 profiles)
- Account management, subscription management

---

### 4. 📚 CONTENT EXPANSION

#### Sachkunde (Science/Nature Studies)
- Grade 1: Body parts, animals, seasons, weather, plants
- Grade 2: Habitats, food, materials, senses, Swiss geography basics
- Grade 3: Human body systems, ecosystems, simple physics, Switzerland

#### More Exercise Types (for engagement & variety)
- **Drag & drop**: match word to image, sort numbers, complete sentence
- **Image-based questions**: "Which picture shows a triangle?" → tap image
- **Spelling exercises**: hear word → type it (audio-first)
- **Number line**: slide to the right answer
- **Drawing/tracing**: trace a letter/number (touch/stylus)
- **Memory game**: flip cards, match pairs (great for vocabulary)
- **Word search**: find hidden words in grid
- **Math puzzles**: fill the missing number in sequence

#### Richer Exercise Visuals
- Every exercise should have an image or illustration where relevant
- Mascot Cleverli appears in exercises (thinking, pointing, celebrating)
- Color-coded question types (math = blue, german = orange, science = green)
- Illustrated multiple choice: answer options show images, not just text

---

### 5. 🔊 VOICE — Phase 2 (ElevenLabs)

- ElevenLabs Starter ($5/mo) — commercial license
- Pre-generate all ~336 exercise audio files as MP3
- Store in `public/audio/grade{n}/{subject}/{topicId}/{exerciseIdx}.mp3`
- Fallback to Web Speech API if file missing
- Target voice: "Neugier" / similar warm German child voice

---

### 6. 🔐 AUTH + USER ACCOUNTS (Supabase)

- Real signup/login (email + password, or Google OAuth)
- User profiles: child name, grade, avatar
- Progress synced to Supabase (replace localStorage)
- Multi-child under one parent account
- Session persistence across devices

---

### 7. 💳 PAYMENT (Payrexx)

- TWINT + PayPal (Swiss-native)
- CHF 9.90/month or CHF 118.80/year
- Webhook to unlock premium flag in Supabase
- Grace period logic, cancellation flow

---

### 8. 📱 PUSH NOTIFICATIONS / ENGAGEMENT LOOPS

- Daily reminder: "Zeit zum Üben! Dein Streak wartet 🔥"
- Achievement unlock alerts
- Weekly progress report push
- "Streak at risk" warning (via PWA push or email)

---

### 9. 🌐 GOOGLE SEARCH CONSOLE

- Verify `cleverli.ch` via Cloudflare DNS TXT record
- Submit `https://www.cleverli.ch/sitemap.xml`
- Monitor indexing + Core Web Vitals

---

## 📊 PRIORITY ORDER (suggested)

| Priority | Feature | Why |
|---|---|---|
| 🥇 1 | Gamification: XP + achievements | Core retention loop — kids come back |
| 🥇 1 | Richer visuals in exercises (images) | Engagement + age-appropriate UX |
| 🥈 2 | Child dashboard (trophy room) | Makes progress visible + rewarding |
| 🥈 2 | More exercise types (drag/drop, image-based) | Variety kills boredom |
| 🥉 3 | Sachkunde content | Expands content library |
| 🥉 3 | ElevenLabs voice | Audio quality upgrade |
| 4 | Parent dashboard | Monetization support (parents pay) |
| 4 | Supabase auth | Multi-device, real accounts |
| 5 | Payrexx payment | Revenue |
| 5 | Push notifications | Retention |
| 6 | Google Search Console | SEO |

---

## 💡 VISION: The "Duolingo for Swiss Kids" Loop

```
Open app → Daily challenge (XP bonus) → Earn correct answers → Streak grows
→ Level up Cleverli mascot → Unlock badge → See trophy in child dashboard
→ Parent gets Sunday report → Child brags to sibling → Healthy competition
→ Come back tomorrow to keep streak 🔥
```

The addictiveness comes from: **visible progress + random rewards + social proof (family) + mascot attachment**.

---

## 🐿️ MASCOT ASSETS (existing)

| File | Mood |
|---|---|
| `cleverli-wave.png` | Happy / welcoming |
| `cleverli-think.png` | Thinking / hint |
| `cleverli-celebrate.png` | Correct answer |
| `cleverli-run.png` | Loading / transition |
| `cleverli-sit-read.png` | Subject selection |
| `cleverli-jump-star.png` | Topic complete |

Need to add: cleverli-angry.png (wrong streak?), cleverli-sleep.png (idle), accessory variants (hat, cape, crown)

---

## 🔑 CRITICAL CONTEXT

- **Project**: `~/projects/cleverli`
- **Live**: `www.cleverli.ch`
- **GitHub**: `riccardogosteli-wq/cleverli` (main)
- **Last commit**: `0b2aa92` — full i18n
- **Pricing**: CHF 9.90/mo or CHF 118.80/yr, up to 3 kids
- **Payment**: Payrexx (TWINT + PayPal)
- **Auth**: Supabase (not yet implemented)
- **Voice Phase 2**: ElevenLabs Starter $5/mo, key in CREDENTIALS.md
