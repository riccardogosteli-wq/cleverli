# Semantic exercise speech review - 2026-09-05

## Scope

- Read-aloud uses a separate semantic prompt layer. It does not change rendered exercise text, answer validation, hints, progress, or exercise identifiers.
- Common German patterns have child-friendly spoken forms for maths, letter work, rhymes, sentence completions, verb forms, pronouns, punctuation, grammar, and NMG.
- `spokenPrompt` plus per-language variants are available for reviewed exceptions without coupling spoken wording to the visual worksheet text.

## Regression gates

- `npm run qa:exercise-speech`: 60,760 catalogue/localisation checks, 16 exact spoken-text fixtures, 0 failures.
- `npm run qa:localization-tts`: 45,570 checks, 0 failures.
- `npm run qa:global-exercise-ids`: 15,190 canonical IDs, 0 failures.
- Scoped ESLint: 0 errors; 2 existing unused-variable warnings in `ExercisePlayer`.
- `npm run build`: passed.

## Live QA

Run `node .qa/exercise-speech-2026-09-05/live-qa.mjs` after production deploy. It verifies the actual `/api/tts` request text, HTTP 200, desktop and mobile screenshots, console errors, and same-origin request failures for `v29` and `z6`.
