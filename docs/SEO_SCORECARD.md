# Cleverli SEO Scorecard

Last setup: 2026-08-08
Last reviewed: 2026-08-10

## Review Cadence

- Weekly review: Monday 09:00 Europe/Zurich.
- First priority: new SEO landing pages and high-impression topic pages.
- Output: short Telegram summary with status, wins, risks, and next actions.

## Data Sources

- Google Search Console: indexing, impressions, clicks, CTR, average position, top queries.
- GA4 / telemetry: organic landing sessions, CTA clicks, signup starts, free test clicks, checkout clicks.
- Live page checks: HTTP status, canonical, sitemap inclusion, title/H1, example variety, obvious mobile issues.
- Manual authority check: relevant Swiss family/education links and mentions.

## Latest Review: 2026-08-10

- Live checks: all 15 priority URLs returned `200`, had title/H1, self-canonical, and sitemap inclusion.
- Sitemap: 12 new class SEO pages are included with `2026-08-08` lastmod.
- Google Search Console: unavailable in local `gog`/`gcloud` environment, so indexing, impressions, clicks, CTR, average position, and top queries could not be retrieved.
- GA4/PostHog: unavailable. Supabase telemetry is available, but current landing data is tagged as `ads_lp`, not organic SEO traffic.
- Supabase last 7 days: `/primarschule-uebungen` had 9 tracked ad landing CTA clicks, `/deutsch-uebungen-kinder` had 2, `/mathe-uebungen-kinder` had 0, and new class SEO pages had 0 tracked CTA rows.
- Decision: keep performance metrics as unknown until GSC/GA4 access exists; focus this week on indexing requests, stronger internal links, and organic landing/CTA instrumentation.

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
| `/mathe-uebungen-1-klasse` | mathe übungen 1 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/mathe-uebungen-2-klasse` | mathe übungen 2 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/mathe-uebungen-3-klasse` | mathe übungen 3 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/mathe-uebungen-4-klasse` | mathe übungen 4 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/mathe-uebungen-5-klasse` | mathe übungen 5 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/mathe-uebungen-6-klasse` | mathe übungen 6 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/deutsch-uebungen-1-klasse` | deutsch übungen 1 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/deutsch-uebungen-2-klasse` | deutsch übungen 2 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/deutsch-uebungen-3-klasse` | deutsch übungen 3 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/deutsch-uebungen-4-klasse` | deutsch übungen 4 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/deutsch-uebungen-5-klasse` | deutsch übungen 5 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/deutsch-uebungen-6-klasse` | deutsch übungen 6 klasse | TBD | - | - | - | - | - | - | Request indexing + strengthen internal links |
| `/mathe-uebungen-kinder` | mathe übungen kinder | TBD | - | - | - | - | - | - | Instrument organic landing CTA |
| `/deutsch-uebungen-kinder` | deutsch übungen kinder | TBD | - | - | - | - | - | - | Instrument organic landing CTA |
| `/primarschule-uebungen` | primarschule übungen | TBD | - | - | - | - | - | - | Instrument organic landing CTA |

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
