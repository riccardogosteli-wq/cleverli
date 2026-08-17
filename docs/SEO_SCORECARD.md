# Cleverli SEO Scorecard

Last setup: 2026-08-08
Last reviewed: 2026-08-17

## Review Cadence

- Weekly review: Monday 09:00 Europe/Zurich.
- First priority: new SEO landing pages and high-impression topic pages.
- Output: short Telegram summary with status, wins, risks, and next actions.

## Data Sources

- Google Search Console: indexing, impressions, clicks, CTR, average position, top queries.
- GA4 / telemetry: organic landing sessions, CTA clicks, signup starts, free test clicks, checkout clicks.
- Live page checks: HTTP status, canonical, sitemap inclusion, title/H1, example variety, obvious mobile issues.
- Manual authority check: relevant Swiss family/education links and mentions.

## Latest Review: 2026-08-17

- Live checks: all 15 priority URLs returned `200`, had title/H1, self-canonical, sitemap inclusion, and no obvious broken rendering/404 risk.
- Sitemap: `https://www.cleverli.ch/sitemap.xml` is submitted in GSC, last downloaded `2026-08-14`, with `0` warnings and `0` errors. URL Inspection API was not available through the current Maton route, so per-URL indexing status is inferred from Search Console impressions where present.
- Google Search Console, `2026-08-08` to `2026-08-16`: 11/12 new class SEO pages have impressions; `/deutsch-uebungen-2-klasse` has no impressions yet. New class pages total 123 impressions and 2 clicks.
- GA4, `2026-08-10` to `2026-08-16`: organic landing sessions were `/primarschule-uebungen` 2, `/mathe-uebungen-1-klasse` 1, `/mathe-uebungen-6-klasse` 1. Organic CTA/checkout/trial/purchase events on priority pages were 0.
- Supabase telemetry is reachable, but current CTA rows are still tagged as `ads_lp`, not organic SEO traffic. Last 7 days: `/mathe-uebungen-kinder` 7 ad CTA clicks, `/primarschule-uebungen` 6, `/deutsch-uebungen-kinder` 1, new class SEO pages 0.
- Decision: stop treating every new page as an indexing-only problem. Focus this week on `/deutsch-uebungen-6-klasse` content depth/internal links, low-CTR snippet/above-fold copy on early-impression pages, one no-impression page (`/deutsch-uebungen-2-klasse`), and CTA proof for pages already getting organic landings.

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
| `/mathe-uebungen-1-klasse` | mathe übungen 1 klasse | Likely | 20 | 1 | 5.0% | 59.0 | 1. klasse mathe übungen | 0 | Improve CTA proof; organic landing sessions but no organic CTA |
| `/mathe-uebungen-2-klasse` | mathe übungen 2 klasse | Likely | 21 | 0 | 0.0% | 53.5 | 2 klasse | 0 | Rewrite title/meta/H1 angle for intent clarity |
| `/mathe-uebungen-3-klasse` | mathe übungen 3 klasse | Likely | 5 | 0 | 0.0% | 39.6 | mathematik 3 | 0 | Add richer examples + internal links |
| `/mathe-uebungen-4-klasse` | mathe übungen 4 klasse | Likely | 14 | 0 | 0.0% | 48.4 | grundschule 4. klasse | 0 | Sharpen intro + class-specific examples |
| `/mathe-uebungen-5-klasse` | mathe übungen 5 klasse | Likely | 10 | 0 | 0.0% | 49.9 | 5 klasse | 0 | Sharpen intro + class-specific examples |
| `/mathe-uebungen-6-klasse` | mathe übungen 6 klasse | Likely | 12 | 1 | 8.3% | 47.1 | 6 klasse mathematik | 0 | Improve CTA proof; organic landing sessions but no organic CTA |
| `/deutsch-uebungen-1-klasse` | deutsch übungen 1 klasse | Likely | 13 | 0 | 0.0% | 33.0 | 1 klasse deutsch | 0 | Add stronger Swiss school intro + examples |
| `/deutsch-uebungen-2-klasse` | deutsch übungen 2 klasse | Unknown | 0 | 0 | - | - | - | 0 | Strengthen internal links + request indexing |
| `/deutsch-uebungen-3-klasse` | deutsch übungen 3 klasse | Likely | 3 | 0 | 0.0% | 50.7 | 3 klasse deutsch | 0 | Add internal links from Deutsch hub |
| `/deutsch-uebungen-4-klasse` | deutsch übungen 4 klasse | Likely | 12 | 0 | 0.0% | 32.3 | 4 klasse | 0 | Sharpen title/meta for Deutsch intent |
| `/deutsch-uebungen-5-klasse` | deutsch übungen 5 klasse | Likely | 5 | 0 | 0.0% | 40.4 | deutsch 5 klasse | 0 | Add richer examples + FAQ |
| `/deutsch-uebungen-6-klasse` | deutsch übungen 6 klasse | Likely | 8 | 0 | 0.0% | 18.1 | deutsch 6. klasse | 0 | Add richer intro, FAQ, examples, and internal links |
| `/mathe-uebungen-kinder` | mathe übungen kinder | Likely | 3 | 0 | 0.0% | 27.0 | lernhilfe mathe primar | 0 | Improve internal links to class pages |
| `/deutsch-uebungen-kinder` | deutsch übungen kinder | Likely | 23 | 0 | 0.0% | 47.8 | cleverli | 0 | Rewrite snippet/above-fold copy for non-brand Deutsch intent |
| `/primarschule-uebungen` | primarschule übungen | Likely | 2 | 0 | 0.0% | 34.0 | aufgabenblaetter primarschule | 0 | Improve CTA proof; organic landing sessions but no organic CTA |

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
