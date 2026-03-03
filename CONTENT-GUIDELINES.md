# Cleverli Content Guidelines
_Last updated: 2026-03-03_

## Goal
Each topic needs **50 exercises** (up from ~10). Quality > speed.  
Start with a pilot topic, get approval, then batch the rest.

---

## Exercise Types Available

| Type | Description | When to use |
|------|-------------|-------------|
| `multiple-choice` | 4 options, 1 correct | Most common — facts, vocab, reading |
| `fill-in-blank` | Type the missing word | Spelling, grammar, math results |
| `counting` | Count displayed emoji | Grade 1-2 math, quantities |
| `matching` | Pairs (left ↔ right) | Vocab pairs, word-image, opposites |
| `memory` | Flip card pairs | Vocabulary, animals, vocabulary |
| `drag-drop` | Drag items to zones | Sorting, categorizing, sentence building |
| `number-line` | Place on number line | Math ordering, fractions |
| `word-search` | Find words in grid | Spelling, vocabulary |

**Mix all types per topic** — don't use only multiple-choice.  
Variety = engagement. Each topic should have at least 4 different exercise types.

---

## Exercise Structure Rules

```ts
{
  id: "unique-id",          // e.g. "z1", "m3", "g7"
  type: "multiple-choice",
  free: true,               // ONLY first 3 exercises per topic
  difficulty: 1,            // 1 = easy, 2 = medium, 3 = hard
  question: "...",
  answer: "...",
  options: ["...", "...", "...", "..."],  // for multiple-choice
  hints: ["Erster Tipp.", "Zweiter Tipp."],  // 2 hints per exercise
  mascot: "wave",           // optional: wave | think | run | celebrate
}
```

**Difficulty distribution per 50 exercises:**
- 15 × difficulty 1 (easy, accessible)
- 25 × difficulty 2 (medium, core learning)
- 10 × difficulty 3 (hard, challenge)

**Free exercises:** ONLY the first 3 per topic (`free: true`). Rest are premium.

---

## Emoji & Visual Rules

### ✅ DO
- Use emojis that **directly and obviously represent** the concept/word
- Stick to the **proven whitelist** (emojis already used in existing exercises)
- Use simple, universally supported emojis (Unicode ≤ 13)
- One emoji per concept — don't mix multiple in one label
- Test semantic fit: ask "would a 6-year-old immediately understand this emoji = this word?"

### ❌ DON'T
- Use abstract or clever emoji choices (e.g. ⛄ for "Mein Körper" = WRONG)
- Use exotic Unicode (skin tone modifiers, ZWJ sequences, Unicode 14+)
- Use flags except 🇨🇭
- Use emojis that have double meaning (e.g. 🌟 for "5 Sinne" = wrong)
- Put emoji in both `title:` AND `emoji:` field (creates duplicates on screen)
- Use the same emoji for two different topics in the same subject

### Proven safe emoji categories:
- **Animals:** 🐶 🐱 🐮 🐷 🐔 🦊 🐻 🐨 🐸 🦋 🐝 🐟 🐦 🐇 🦌 🐄 🐴
- **Food:** 🍎 🍓 🥕 🥦 🍕 🍎 🧀 🍞 🥛 🍌 🍋 🍇 🥚
- **Objects:** 📚 📏 📐 ✏️ 🖊️ 📝 🔢 🔡 🔠 📖 🎒
- **Nature:** 🌱 🌳 🌸 🌻 ☀️ 🌧️ ❄️ 🍂 🍁
- **Math:** ➕ ➖ ✖️ ➗ 🔢 🧮 🪙 📏 📐 🍕
- **Time:** 🕐 🕑 📅 🗓️ ⏰
- **People:** 👪 👤 👧 👦 👶 👩 👨
- **Transport:** 🚗 🚌 🚂 🚦 ✈️ 🚲

---

## Text Quality Rules

### Swiss German (CRITICAL)
- Always use `ss` not `ß`: **gross**, **heiss**, **Strasse**, **Fuss**, **weiss**
- Swiss curriculum alignment: LP21
- No TV/screen-based reward examples

### Language by grade:
- **Grade 1:** Very simple sentences. Max 8 words per question. No subordinate clauses.
- **Grade 2:** Simple sentences OK. Short compound sentences allowed.
- **Grade 3:** Normal sentences. Can use subordinate clauses sparingly.

### Question phrasing:
- Always end with `?` or complete sentence
- For counting: "Wie viele [X] siehst du?" + show emoji in question
- For matching: keep both sides short (1-3 words max)
- Hints should genuinely help without giving the answer directly
  - Hint 1: conceptual clue
  - Hint 2: more direct clue (almost gives it away)

### Answer format:
- Capitalize German nouns in answers: "Apfel" not "apfel"
- Numbers as digits in math: "7" not "sieben" (unless it's a language exercise)
- For fill-in-blank: exact match matters — spell out exactly what to type

---

## Gamification Integration

### Combo system (NEW — in PM-18 push)
- Short exercises that can be answered quickly support combo building
- Mix in some easy exercises mid-topic to keep combo going
- Don't make all exercises hard — rhythm matters

### Perfect run (NEW — in PM-18 push)
- Topics need ≥ 5 exercises for perfect run to trigger
- Ensure there are clear "correct" answers (no ambiguity)

### Streak & daily challenge
- Keep exercises completable in <5 min per topic session
- Daily challenge picks 1 exercise from free pool — make free exercises strong

### XP & difficulty
- Harder exercises = more XP via calcXpGain (already handles this)
- Don't bunch all difficulty-3 at the end — spread them through

---

## Discussed Issues to Avoid

These emojis were wrong in the original data and got fixed (don't repeat):
| Was used | For topic | Should be |
|----------|-----------|-----------|
| ⛄ | Mein Körper | 🧍 |
| 👁️ | Pflanzen & Blumen | 🌱 |
| 👩 | Verkehr & Sicherheit | 🚦 |
| 🏠 | Nomen mit Artikel | 🏷️ |
| 🐑 | Einzahl & Mehrzahl | 1️⃣ |
| 🌟 | Meine 5 Sinne | 👃 |
| ✂️ | Verdoppeln & Halbieren | ✌️ |
| 📰 | Texte lesen | 📖 |
| 🔄 | Verben konjugieren | 🏃 |
| 🔍 | Rechtschreibung | ✅ |

These patterns were wrong in titles (stripped):
- "Silben klatschen 👏" — emoji in title = double display
- "Geld & Münzen 🪙" — same
- "Die Schweiz 🇨🇭" — same
- **Rule: never put emoji in title string if there's also an emoji field**

---

## Content Priority Order

Start with most-used topics (entry point for users):

### Batch 1 — Grade 1 (pilot)
1. Zahlen 1–10
2. Addition bis 10
3. Subtraktion bis 10
4. Buchstaben
5. Einfache Wörter
6. Tiere in der Natur

### Batch 2 — Grade 1 remaining + Grade 2 core
### Batch 3 — Grade 2 remaining + Grade 3
### Batch 4 — All science topics (all grades)

---

## Workflow
1. Write one topic (50 exercises)
2. Ricci reviews → approve or flag issues
3. If approved → batch the rest
4. Never self-merge without TypeScript check (`npx tsc --noEmit`)
5. Always commit with clear message: `feat: content — Grade X [Subject] [topic-id] (50 exercises)`
