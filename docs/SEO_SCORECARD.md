# Cleverli SEO Scorecard

Last setup: 2026-08-08
Last reviewed: 2026-08-31

## Review Cadence

- Weekly review: Monday 09:00 Europe/Zurich.
- First priority: new SEO landing pages and high-impression topic pages.
- Output: short Telegram summary with status, wins, risks, and next actions.

## Data Sources

- Google Search Console: indexing, impressions, clicks, CTR, average position, top queries.
- GA4 / telemetry: organic landing sessions, CTA clicks, signup starts, free test clicks, checkout clicks.
- Live page checks: HTTP status, canonical, sitemap inclusion, title/H1, example variety, obvious mobile issues.
- Manual authority check: relevant Swiss family/education links and mentions.

## Latest Review: 2026-08-31

- Live checks: all 15 priority URLs returned `200`, had title/H1, self-canonical, sitemap inclusion, and no obvious broken rendering/404 risk.
- Sitemap: `https://www.cleverli.ch/sitemap.xml` is submitted in GSC, last downloaded `2026-08-26`, with `0` warnings and `0` errors. The sitemap API still reports `319` submitted and `0` indexed, but URL Inspection remains unavailable through the Maton route, so this aggregate indexed value is not treated as reliable page-level evidence.
- Google Search Console, latest available data `2026-08-24` to `2026-08-28`: all 12 new class pages had impressions, providing likely indexing evidence for `12/12`. Together they reached 90 impressions and 7 clicks (7.8% CTR), up from 60 impressions and 4 clicks in the previous review window.
- Strongest class-page signals: `/mathe-uebungen-2-klasse` led impressions (28) but had 0 clicks; `/mathe-uebungen-3-klasse` had 7 impressions, 3 clicks, 42.9% CTR, and position 12.0; `/deutsch-uebungen-3-klasse` had 13 impressions, 4 clicks, 30.8% CTR, and position 7.6. Class pages around position 8-20 are `/mathe-uebungen-3-klasse`, `/mathe-uebungen-5-klasse`, `/deutsch-uebungen-1-klasse`, `/deutsch-uebungen-2-klasse`, and `/deutsch-uebungen-5-klasse`.
- GA4, `2026-08-24` to `2026-08-30`: organic landing sessions were `/deutsch-uebungen-3-klasse` 3, `/mathe-uebungen-3-klasse` 2, and `/mathe-uebungen-5-klasse` 1. These pages recorded no organic CTA, checkout, trial, signup, or purchase event.
- Supabase telemetry is reachable, but all 67 priority-page CTA rows were tagged as `ads_lp`, not organic SEO traffic. PostHog had no separately available reporting credentials in this run.
- Decision: rewrite `/mathe-uebungen-2-klasse` snippet/H1 for CTR, enrich position-8-20 pages starting with `/mathe-uebungen-5-klasse` and `/mathe-uebungen-kinder`, and add stronger CTA proof on the three pages receiving organic landings without CTA.

## Scorecard Rules

- Indexed: if a new page is not indexed after a few days, strengthen internal links and request indexing.
- Impressions, low CTR: rewrite title/meta/H1 and sharpen the above-fold copy.
- Position 8-20: add better intro, FAQ, examples, and internal links.
- No impressions after 2-3 weeks: reassess search intent and internal link strength.
- Organic visits, low CTA: improve CTA wording, visual proof, examples, and trust copy.
- Weak examples: show at least four clearly different formats when real subject examples exist.

## Priority Pages

| Page | Intent | Indexed | Impr. | Clicks | CTR | Avg pos. | Top query | Organic CTA | Next action |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- | ---: | --- |
| `/mathe-uebungen-1-klasse` | mathe übungen 1 klasse | Likely | 2 | 0 | 0.0% | 5.5 | - | 0 | Monitor CTR until sample is larger |
| `/mathe-uebungen-2-klasse` | mathe übungen 2 klasse | Likely | 28 | 0 | 0.0% | 40.1 | 2 klasse mathe | 0 | Rewrite title/meta/H1 around class-specific Rechnen intent |
| `/mathe-uebungen-3-klasse` | mathe übungen 3 klasse | Likely | 7 | 3 | 42.9% | 12.0 | - | 0 | Add stronger CTA wording and visual proof; 2 organic sessions without CTA |
| `/mathe-uebungen-4-klasse` | mathe übungen 4 klasse | Likely | 7 | 0 | 0.0% | 30.7 | uebungen 4 klasse | 0 | Sharpen title/meta/H1 and class-specific examples |
| `/mathe-uebungen-5-klasse` | mathe übungen 5 klasse | Likely | 9 | 0 | 0.0% | 19.3 | hauptschule klasse 5 | 0 | Add richer intro, FAQ, internal links, and CTA proof |
| `/mathe-uebungen-6-klasse` | mathe übungen 6 klasse | Likely | 5 | 0 | 0.0% | 6.2 | - | 0 | Sharpen title/meta/H1; ranking is already promising |
| `/deutsch-uebungen-1-klasse` | deutsch übungen 1 klasse | Likely | 2 | 0 | 0.0% | 16.0 | - | 0 | Add richer intro, FAQ, examples, and internal links |
| `/deutsch-uebungen-2-klasse` | deutsch übungen 2 klasse | Likely | 4 | 0 | 0.0% | 10.8 | - | 0 | Indexing signal achieved; add richer intro, FAQ, and internal links |
| `/deutsch-uebungen-3-klasse` | deutsch übungen 3 klasse | Likely | 13 | 4 | 30.8% | 7.6 | deutsch online lernen 3 klasse | 0 | Add stronger CTA wording and visual proof; 3 organic sessions without CTA |
| `/deutsch-uebungen-4-klasse` | deutsch übungen 4 klasse | Likely | 10 | 0 | 0.0% | 28.5 | 4 klasse | 0 | Rewrite title/meta/H1 for clear Deutsch intent |
| `/deutsch-uebungen-5-klasse` | deutsch übungen 5 klasse | Likely | 1 | 0 | 0.0% | 10.0 | - | 0 | Monitor; enrich intro/FAQ if impressions grow |
| `/deutsch-uebungen-6-klasse` | deutsch übungen 6 klasse | Likely | 2 | 0 | 0.0% | 6.5 | - | 0 | Monitor CTR until sample is larger |
| `/mathe-uebungen-kinder` | mathe übungen kinder | Likely | 13 | 0 | 0.0% | 17.1 | lernhilfe mathe primar | 0 | Add richer intro, FAQ, and internal links to class pages |
| `/deutsch-uebungen-kinder` | deutsch übungen kinder | Likely | 3 | 0 | 0.0% | 4.7 | - | 0 | Monitor CTR until sample is larger |
| `/primarschule-uebungen` | primarschule übungen | Likely | 2 | 0 | 0.0% | 18.5 | aufgabenblaetter primarschule | 0 | Add richer examples, FAQ, and internal links to class pages |

## Weekly Output Format

```text
Cleverli SEO Weekly
Indexing:
- New pages indexed: X/12
- Issues: ...

Performance:
- Top page by impressions: ...
- Best CTR: ...
- Pages at position 8-20: ...

Conversion:
- Organic CTA clicks: ...
- Weak landing page: ...

Actions:
1. ...
2. ...
3. ...
```
