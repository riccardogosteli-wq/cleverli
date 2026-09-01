# NMG Rich Enrichment QA - 2026-09-01

## Verdict

approved

## Scope

- Grades: 4, 5, 6
- Added exercises checked individually: 24
- Expected per grade: 8
- Counts by grade: {"4":8,"5":8,"6":8}
- Counts by type: {"matching":6,"memory":4,"drag-drop":8,"word-search":3,"self-review":3}

## Guardrails

- Klasse 4 stays concrete: observing, sorting, everyday cause/effect.
- Klasse 5 uses comparison and simple models.
- Klasse 6 uses justification, consequences and system links.
- Weak generated wording patterns are blocked.

## Failures

- None.

## Live production QA

- Deployment: dpl_6Sqp92ziTbNZVgf7ybe5zovr5HkY
- Production alias: https://www.cleverli.ch
- Browser checks: 12 route/viewport combinations
- Viewports: desktop 1440x900, mobile 390x844
- Routes checked:
  - /learn/4/science/koerper-gesundheit
  - /learn/4/science/wetter-klima
  - /learn/5/science/oekosysteme
  - /learn/5/science/schweiz-politik-5
  - /learn/6/science/demokratie-menschenrechte-6
  - /learn/6/science/energie-nachh-6
- Result: all 200, content rendered, no console/page errors.
- Evidence: .qa/nmg-rich-enrichment-2026-09-01/browser-live/live-results.json

## Cross-agent QA review

approved
