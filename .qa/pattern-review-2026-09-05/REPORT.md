# Alexandra Pattern Review - 2026-09-05

## Fixed now

- Fixed 7 Grade 6 ratio/map-scale TTS cases so `:` is spoken as `zu`, not `durch`.
- Removed 3 direct visual answer clues from active exercise rows:
  - `1/science/tiere/t11`
  - `1/science/tiere/t29`
  - `4/science/lebensraeume-tiere/g4s13`
- Synced all 10 changed rows to the Grade 1, Grade 4 and Grade 6 QA sheets with:
  - `Report status`
  - `Reported at`
  - `Report reason`
  - `Correction made`
  - `Fixed at`
  - `Retest URL`

## QA checks

- Ratio speech samples: 0 `durch` regressions.
- Alexandra regression samples still safe:
  - `Schreibe die Zahl nach der 7: 7, ___`
  - `Lernrunde 4: Verdopple 5: ___`
- Active row readback confirmed all 10 changed IDs and direct retest URLs.

## Next review queue

These patterns should be reviewed in a separate slower pass:

- 421 exact-definition fill-in candidates across Grades 1-6.
- Many are probably valid vocabulary checks, but the risky subgroup is long-answer definition fill-ins that should become multiple-choice.
- Emoji/decorative visual cues still exist broadly. Most are harmless or part of visual-choice exercises; future review should only remove cases where the emoji directly reveals the answer.
- Some older `questionEN`/`questionFR`/`questionIT` fields are machine-mixed and should be handled as a translation-quality pass, separate from German correctness.

Raw audit: `.qa/pattern-review-2026-09-05/pattern-audit-after.json`
