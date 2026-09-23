# Cleverli SEO Scorecard

Last setup: 2026-08-08
Last reviewed: 2026-09-23

## Review Cadence

- Weekly review: Monday 09:00 Europe/Zurich.
- First priority: new SEO landing pages and high-impression topic pages.
- Output: short Telegram summary with status, wins, risks, and next actions.

## Data Sources

- Google Search Console: indexing, impressions, clicks, CTR, average position, top queries.
- GA4 / telemetry: organic landing sessions, CTA clicks, signup starts, free test clicks, checkout clicks.
- Live page checks: HTTP status, canonical, sitemap inclusion, title/H1, example variety, obvious mobile issues.
- Manual authority check: relevant Swiss family/education links and mentions.

## Latest Review: 2026-09-23

- Reporting window: `2026-09-13` to `2026-09-19` inclusive for GSC final data and GA4, compared with `2026-09-06` to `2026-09-12` for GSC. These are equal seven-day windows, not a comparison against the older five-day review.
- Live checks on September 23: all 15 priority URLs returned `200`, contain title/H1, have self-canonicals and sitemap inclusion, and have no HTML robots noindex directive. No HTML-level 404 risk found. Desktop Mathe 2 and mobile Deutsch 6 browser samples rendered correctly, with no page errors. This is a visual sample, not exhaustive interactive QA of all 15 pages. The browser showed French navigation beside German SEO content, with FR selected; clean-profile language behaviour was not tested. Loaded first-party assets returned 200; some external analytics/advertising requests reported ERR_ABORTED despite 200/204 responses, so tracking delivery is not certified by this smoke check.
- GSC sitemap: last downloaded `2026-09-21`, 366 submitted URLs, 0 warnings/errors. Its aggregate indexed field is 0 and is not used as a page-level indexing verdict. URL Inspection request through Maton returned upstream HTTP 404; current index status and Google-selected canonicals remain unverified.
- All 12 class pages and all 15 priority URLs received impressions, evidence that they appeared in search during the window, not a current URL Inspection verdict. The 12 class pages total 108 impressions and 6 clicks. All 15 total **149 impressions, 7 clicks, 4.7% CTR**, versus **68 impressions, 5 clicks, 7.4% CTR** in the previous week: impressions +119%, clicks +40%. Small samples make CTR changes directional only.
- Top priority page by impressions: `/mathe-uebungen-3-klasse`, 27 impressions, 2 clicks, 7.4% CTR, position 7.4. Best priority-page CTR: `/deutsch-uebungen-3-klasse`, 20.0% from 2 clicks / 10 impressions. Eight priority pages have average position 8–20; see table.
- GA4 Organic Search: **7 landing sessions** across six priority pages: Deutsch 6 (2), Deutsch 2 (1), Deutsch 3 (1), Mathe 3 (1), Mathe 4 (1), Primarschule (1). No CTA/free-test, begin_checkout, sign_up or purchase events were returned for these landing cohorts. Zero recorded events is not proof of zero actual clicks: the organic report contains no CTA/free-test event names anywhere, although checkout/signup/purchase events exist for other organic landings. Audit event wiring before treating this as a conversion failure. Consent/ad blockers can further reduce measurement. PostHog and separate Supabase telemetry were not queried; no independent confirmation is claimed.
- Evidence: workspace `reports/seo-2026-09-23/` contains raw live, GSC and GA4 JSON. Browser screenshots: desktop `6aaa52a2-5166-40c1-a302-46ac5018a22c---c007435e-c3f0-4d08-a6b4-2dbac433a84b.jpg`, mobile `8871b4db-d1e8-456b-9a5f-aa5b7b70c099---05f72bfa-8d96-4268-b5f8-433f83466761.png` in OpenClaw outbound media.

### Top three actions for the coming week

1. **CTR:** prioritise `/mathe-uebungen-kinder` title/meta/H1 and clear Swiss primary-school intent: 25 impressions, 0 clicks, position 8.2. Secondary candidate: Mathe 4, 13 impressions, 0 clicks, position 8.9. Do not prioritise another Mathe 2 rewrite on just one impression; its current title already says Rechnen bis 100.
2. **Ranking:** enrich introductions, real examples, FAQs and contextual links for Mathe 5 (position 8.1) and Deutsch 3 (11.6), then the other six position-8–20 pages. No priority page currently needs an indexing request based on absent impressions.
3. **Conversion:** verify CTA/free-test events reach GA4 with the organic landing attribution, starting with Deutsch 6. Once measurement is sound, improve CTA wording and visual exercise proof on the six pages with organic visits and no recorded conversion. Seven sessions are insufficient for a reliable conversion-rate conclusion.

## Scorecard Rules

- Indexed: if a new page is not indexed after a few days, strengthen internal links and request indexing.
- Impressions, low CTR: rewrite title/meta/H1 and sharpen the above-fold copy.
- Position 8-20: add better intro, FAQ, examples, and internal links.
- No impressions after 2-3 weeks: reassess search intent and internal link strength.
- Organic visits, low CTA: improve CTA wording, visual proof, examples, and trust copy.
- Weak examples: show at least four clearly different formats when real subject examples exist.

## Priority Pages

Metrics: September 13–19. “Search seen” means impressions in this window; current index status is unverified. Top query is the highest-impression disclosed query (alphabetical tie-break); “Not disclosed” reflects GSC privacy omission. GA4 organic sessions are grouped by landing path. CTA 0* means no recorded event, with measurement coverage unverified.

| Page | Intent | Indexed evidence | Impr. | Clicks | CTR | Avg pos. | Top disclosed query | Organic sessions | Recorded CTA | Next action |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- | ---: | ---: | --- |
| `/mathe-uebungen-1-klasse` | mathe übungen 1 klasse | Search seen | 8 | 0 | 0.0% | 7.6 | Not disclosed | 0 | 0* | Monitor CTR; only 8 impressions |
| `/mathe-uebungen-2-klasse` | mathe übungen 2 klasse | Search seen | 1 | 0 | 0.0% | 1.0 | Not disclosed | 0 | 0* | Monitor visibility; only 1 impression, do not infer deindexing |
| `/mathe-uebungen-3-klasse` | mathe übungen 3 klasse | Search seen | 27 | 2 | 7.4% | 7.4 | Not disclosed | 1 | 0* | Monitor CTR; keep links to topic examples |
| `/mathe-uebungen-4-klasse` | mathe übungen 4 klasse | Search seen | 13 | 0 | 0.0% | 8.9 | uebungen 4 klasse | 1 | 0* | Sharpen title/meta/H1; enrich intro and internal links |
| `/mathe-uebungen-5-klasse` | mathe übungen 5 klasse | Search seen | 14 | 2 | 14.3% | 8.1 | Not disclosed | 0 | 0* | Enrich intro/FAQ and links; position 8.1 |
| `/mathe-uebungen-6-klasse` | mathe übungen 6 klasse | Search seen | 8 | 0 | 0.0% | 10.4 | Not disclosed | 0 | 0* | Enrich intro/FAQ and internal links |
| `/deutsch-uebungen-1-klasse` | deutsch übungen 1 klasse | Search seen | 4 | 0 | 0.0% | 7.0 | Not disclosed | 0 | 0* | Monitor small sample; 4 impressions |
| `/deutsch-uebungen-2-klasse` | deutsch übungen 2 klasse | Search seen | 4 | 0 | 0.0% | 9.2 | Not disclosed | 1 | 0* | Enrich intro/FAQ; audit CTA tracking before copy changes |
| `/deutsch-uebungen-3-klasse` | deutsch übungen 3 klasse | Search seen | 10 | 2 | 20.0% | 11.6 | deutsch online lernen 3 klasse | 1 | 0* | Enrich intro/FAQ and add CTA proof after tracking check |
| `/deutsch-uebungen-4-klasse` | deutsch übungen 4 klasse | Search seen | 5 | 0 | 0.0% | 9.2 | Not disclosed | 0 | 0* | Enrich intro/FAQ and internal links |
| `/deutsch-uebungen-5-klasse` | deutsch übungen 5 klasse | Search seen | 8 | 0 | 0.0% | 13.1 | Not disclosed | 0 | 0* | Enrich intro/FAQ and internal links |
| `/deutsch-uebungen-6-klasse` | deutsch übungen 6 klasse | Search seen | 6 | 0 | 0.0% | 5.5 | Not disclosed | 2 | 0* | Audit CTA/free-test tracking, then improve proof; 2 organic sessions |
| `/mathe-uebungen-kinder` | mathe übungen kinder | Search seen | 25 | 0 | 0.0% | 8.2 | cleverli | 0 | 0* | Prioritise title/meta/H1 CTR test; 25 impressions, no clicks |
| `/deutsch-uebungen-kinder` | deutsch übungen kinder | Search seen | 9 | 0 | 0.0% | 2.1 | cleverli | 0 | 0* | Monitor CTR; largely branded disclosed queries |
| `/primarschule-uebungen` | primarschule übungen | Search seen | 7 | 1 | 14.3% | 27.3 | aufgabenblaetter primarschule | 1 | 0* | Clarify primary-school intent; audit CTA measurement |

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

### Approved implementation, September 23

Ricci approved actions 1 and 2 (message 6122). Mathe Kinder gets a clearer Swiss primary-school title, description and H1. Mathe 5 and Deutsch 3 each gain three source-bound worked examples with explanatory solutions, four parent FAQs and contextual topic links. Both subject guides link to the enriched class pages. Existing Deutsch 3 detail content is preserved. No tracking or exercise data changes. Release verification is recorded in `.qa/seo-content-20260923/`; do not infer an SEO improvement before later search data arrives. Compare equal windows after recrawl, allowing several weeks for this small sample.
