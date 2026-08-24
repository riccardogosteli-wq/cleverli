# Cleverli SEO Scorecard

Last setup: 2026-08-08
Last reviewed: 2026-08-24

## Review Cadence

- Weekly review: Monday 09:00 Europe/Zurich.
- First priority: new SEO landing pages and high-impression topic pages.
- Output: short Telegram summary with status, wins, risks, and next actions.

## Data Sources

- Google Search Console: indexing, impressions, clicks, CTR, average position, top queries.
- GA4 / telemetry: organic landing sessions, CTA clicks, signup starts, free test clicks, checkout clicks.
- Live page checks: HTTP status, canonical, sitemap inclusion, title/H1, example variety, obvious mobile issues.
- Manual authority check: relevant Swiss family/education links and mentions.

## Latest Review: 2026-08-24

- Live checks: all 15 priority URLs returned `200`, had title/H1, self-canonical, sitemap inclusion, and no obvious broken rendering/404 risk.
- Sitemap: `https://www.cleverli.ch/sitemap.xml` is submitted in GSC, last downloaded `2026-08-22`, with `0` warnings and `0` errors. The sitemap API reports `319` submitted and `0` indexed, but URL Inspection is unavailable through the current Maton route, so that aggregate indexed value is not treated as reliable per-URL evidence.
- Google Search Console, `2026-08-17` to `2026-08-23`: the 12 new class pages total 60 impressions and 4 clicks (6.7% CTR). Ten had impressions this week; 11/12 have produced impressions since launch. `/deutsch-uebungen-2-klasse` still has no impressions, while `/mathe-uebungen-1-klasse` had impressions previously but none this week.
- Strongest class-page signals: `/mathe-uebungen-2-klasse` led impressions (15, 0 clicks); `/deutsch-uebungen-4-klasse` had 11 impressions, 2 clicks, 18.2% CTR, and position 16.8. Pages currently around position 8-20 include `/mathe-uebungen-3-klasse`, `/mathe-uebungen-5-klasse`, `/mathe-uebungen-6-klasse`, `/deutsch-uebungen-4-klasse`, and `/deutsch-uebungen-6-klasse`.
- GA4, `2026-08-17` to `2026-08-23`: organic landing sessions were `/mathe-uebungen-3-klasse` 1, `/mathe-uebungen-6-klasse` 1, and `/deutsch-uebungen-4-klasse` 1. These class pages recorded no organic CTA/checkout/trial/purchase event. Organic free-CTA clicks were recorded on `/mathe-uebungen-kinder` 1 and `/primarschule-uebungen` 1; no organic checkout/trial/purchase event was recorded on priority pages.
- Supabase telemetry is reachable, but CTA rows remain tagged as `ads_lp`, not organic SEO traffic. Last 7 days: `/primarschule-uebungen` 23 ad CTA clicks, `/mathe-uebungen-kinder` 4, `/deutsch-uebungen-kinder` 4, and new class SEO pages 0.
- Decision: prioritise `/deutsch-uebungen-2-klasse` indexing/internal links, improve snippet intent on `/mathe-uebungen-2-klasse`, and add stronger CTA proof on the three class pages receiving organic landing sessions without CTA.

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
| `/mathe-uebungen-1-klasse` | mathe übungen 1 klasse | Likely | 0 | 0 | - | - | - | 0 | Monitor; strengthen internal links if impressions do not return |
| `/mathe-uebungen-2-klasse` | mathe übungen 2 klasse | Likely | 15 | 0 | 0.0% | 41.3 | 2 klasse | 0 | Sharpen title/meta/H1 around class-specific Rechnen intent |
| `/mathe-uebungen-3-klasse` | mathe übungen 3 klasse | Likely | 8 | 1 | 12.5% | 13.3 | - | Improve CTA wording and visual proof; organic landing without CTA |
| `/mathe-uebungen-4-klasse` | mathe übungen 4 klasse | Likely | 1 | 0 | 0.0% | 7.0 | - | Monitor until sample is larger |
| `/mathe-uebungen-5-klasse` | mathe übungen 5 klasse | Likely | 7 | 0 | 0.0% | 16.1 | hauptschule klasse 5 | 0 | Add richer intro, FAQ, examples, and internal links |
| `/mathe-uebungen-6-klasse` | mathe übungen 6 klasse | Likely | 1 | 1 | 100.0% | 8.0 | - | Improve CTA wording and visual proof; organic landing without CTA |
| `/deutsch-uebungen-1-klasse` | deutsch übungen 1 klasse | Likely | 3 | 0 | 0.0% | 7.3 | - | Monitor CTR until sample is larger |
| `/deutsch-uebungen-2-klasse` | deutsch übungen 2 klasse | Unknown | 0 | 0 | - | - | - | 0 | Strengthen internal links + request indexing |
| `/deutsch-uebungen-3-klasse` | deutsch übungen 3 klasse | Likely | 1 | 0 | 0.0% | 1.0 | - | Monitor until sample is larger |
| `/deutsch-uebungen-4-klasse` | deutsch übungen 4 klasse | Likely | 11 | 2 | 18.2% | 16.8 | cleverli | 0 | Improve CTA wording and visual proof; organic landing without CTA |
| `/deutsch-uebungen-5-klasse` | deutsch übungen 5 klasse | Likely | 10 | 0 | 0.0% | 20.6 | deutsch klasse 5 | 0 | Add richer examples, FAQ, and internal links |
| `/deutsch-uebungen-6-klasse` | deutsch übungen 6 klasse | Likely | 3 | 0 | 0.0% | 9.7 | - | Sharpen title/meta/H1 for CTR; retain rich intro and FAQ |
| `/mathe-uebungen-kinder` | mathe übungen kinder | Likely | 7 | 0 | 0.0% | 17.1 | lernhilfe mathe primar | 1 | Add richer intro and internal links to class pages |
| `/deutsch-uebungen-kinder` | deutsch übungen kinder | Likely | 19 | 1 | 5.3% | 45.4 | cleverli | 0 | Strengthen non-brand Deutsch intent in snippet and intro |
| `/primarschule-uebungen` | primarschule übungen | Likely | 1 | 0 | 0.0% | 29.0 | aufgabenblaetter primarschule | 1 | Strengthen examples and internal links to class pages |

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
