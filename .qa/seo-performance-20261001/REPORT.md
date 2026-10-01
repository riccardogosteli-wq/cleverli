# SEO and performance verification, 2026-10-01

## Scope

- Correct page-specific Open Graph and Twitter metadata for `/arbeitsblaetter` and `/lehrpersonen`.
- Add useful server-rendered H1 and explanatory content to `/parents` and `/missionen`.
- Request the navigation logo at its rendered size.
- Defer Supabase progress-sync code until it is needed.
- Stop the homepage from prefetching full app and exercise bundles before a visitor clicks.

## Build and deterministic checks

- `npm run build`: passed, 379 static pages generated.
- ESLint on all changed files: no errors, two pre-existing warnings in `missionen/PageClient.tsx`.
- Targeted mobile navigation, logo and guest-flow checks: 8 passed.
- Mission, persistence and guest-flow batch: 27 passed. Two additional failures were invalid test setup, not product failures: one selector chose the hidden sound switch instead of a visible answer, and one fabricated Supabase session asserted that a transient loader must appear even though the exercise was already available.
- Authenticated local setup could not run because the isolated worktree intentionally had no Supabase environment variables. No fake authenticated session was used as release evidence.

## Raw HTML verification

- `/arbeitsblaetter`: page-specific title, Open Graph title and canonical Open Graph URL present.
- `/lehrpersonen`: page-specific title, Open Graph title and canonical Open Graph URL present.
- `/parents`: one server-rendered H1 and 56 visible raw-HTML words, up from roughly 20.
- `/missionen`: one server-rendered H1 and 58 visible raw-HTML words, up from roughly 24.
- Logo responsive sizes now allow the browser to choose a 128 px or 256 px candidate instead of forcing the 1200 px candidate.

## Lighthouse comparison

| Mode | Metric | Baseline | Final |
| --- | --- | ---: | ---: |
| Mobile | Performance | 73 | 89 |
| Mobile | LCP | 12,775 ms | 3,760 ms |
| Mobile | TBT | 138 ms | 53 ms |
| Mobile | Transfer | 1,769,982 B | 1,264,232 B |
| Mobile | Unused JavaScript | 798,978 B | 496,347 B |
| Desktop | Performance | 99 | 100 |
| Desktop | LCP | 987 ms | 745 ms |
| Desktop | TBT | 0 ms | 0 ms |
| Desktop | Transfer | 5,816,463 B | 5,354,998 B |
| Desktop | Unused JavaScript | 798,989 B | 516,607 B |

One intermediate desktop Lighthouse trace returned `NO_LCP`; it was discarded and the isolated desktop rerun above completed normally.

## Remaining JavaScript floor

The remaining unused code is primarily Sentry, PostHog, Supabase and Google tracking. Those were deliberately not removed or semantically changed because this release must preserve existing monitoring, consent and conversion behaviour.
