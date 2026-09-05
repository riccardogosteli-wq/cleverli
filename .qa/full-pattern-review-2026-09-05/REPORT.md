# Full Exercise Pattern Review - 2026-09-05

## Scope

- Reviewed the served catalogue: 15,190 exercises and 95,601 visible content fields.
- Looked only for patterns already observed in Alexandra's reports: interaction/type mismatches, direct visual answer cues, malformed distractors, overly obvious answer choices, TTS-sensitive punctuation, and age-inappropriate wording.
- Made no bulk content rewrites.

## Fixed now

1. `1/german/reime/r14`: visible choice options now render as a multiple-choice exercise.
2. `2/german/satzzeichen/sz45`: replaced a malformed generated distractor with complete, plausible alternatives.
3. `2/science/gesunde-ernaehrung/g2-science-gesunde-ernaehrung-g7`: restored age-appropriate nutrition distractors in all supported UI languages.
4. `3/english/food-drink-3/fd3-10`: removed the orange emoji that revealed the answer.

## Verification

- `qa:content-correctness`: passed, 15,190 exercises.
- `qa:grade-suitability-scorer`: passed, 393 guarded targets.
- `qa:topic-catalog`: passed, 366 topics.
- Scoped ESLint and `git diff --check`: passed.
- Direct Grade 2 suitability review for the nutrition item: score 2/5.
- The full LP21 crawler was stopped after it stalled without updating its snapshot. The only remaining full-editorial report flag uses that stale pre-fix snapshot; it is not present in the rendered nutrition exercise.
- Local production build and Vercel production build: passed.
- Production Playwright QA: approved. All four direct retest links returned HTTP 200 on desktop/mobile, showed the corrected content as one focused exercise, and produced zero browser console errors.

## Deployment

- Production deployment: `dpl_9QFoLQwnG9tKyP1NBuDv9otvnQ2E`
- Production URL: `https://www.cleverli.ch`

## Sheets

- The four changed rows are annotated as `fixed` with review date, exact correction and direct retest URL.
