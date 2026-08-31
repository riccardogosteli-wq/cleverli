# Internal Canton Selector Rollout QA

Date: 2026-08-31 11:19 CEST
Project: Cleverli
Outcome: approved

## Change

- Replaced anonymous percentage rollout with explicit rollout modes:
  - `internal`: only allowlisted internal/test emails see canton profile UI.
  - `all`: future full rollout to all eligible users.
- Existing customer sessions stay on today's profile setup in internal mode.
- New child setup and profile settings read the logged/cached session email before showing the canton selector.
- French Grades 3-4 pages are `noindex,nofollow` while rollout mode is internal.
- Vercel production env now has:
  - `NEXT_PUBLIC_CURRICULUM_PROFILES_ENABLED`
  - `NEXT_PUBLIC_CURRICULUM_PROFILES_ROLLOUT_MODE`

## Deployment

- Commit: `838a109`
- Production deployment: `dpl_FsqbfSQG5wu1YC9cj7bfuMXLTPTc`
- Production URL: `https://www.cleverli.ch`

## Checks

- `npm run qa:curriculum-profiles`: passed
- `npm run qa:french-primary`: passed
- `NEXT_PUBLIC_CURRICULUM_PROFILES_ENABLED=true NEXT_PUBLIC_CURRICULUM_PROFILES_ROLLOUT_MODE=internal npm run build`: passed
- `NEXT_PUBLIC_CURRICULUM_PROFILES_ENABLED=false npm run build`: passed
- Scoped lint on changed files: passed
- Local production Playwright, feature-on/internal mode:
  - 10 passed, 2 skipped
  - Customer account hidden
  - Internal test account visible
  - Legacy child E3/F5 unchanged
  - AI exception hides French without deleting progress
  - BE-DE F3/E5 shows French in Grade 3
  - French Grade 3 exercise route works
  - French Grade 4 desktop route works
  - BE/FR/VS/GR selector handling works
  - GR remains "Vorbereitung"
  - Existing profile can change canton without losing progress
- Local production Playwright, feature-off mode:
  - 2 passed
  - Selector hidden
  - French Grades 3-4 routes unavailable
- Live production Playwright:
  - 4 passed
  - Customer account hidden
  - Internal test account visible
  - Multilingual and GR selector handling works
  - Desktop selector has no overflow
- Live HTTP smoke:
  - `/`: 200
  - `/family`: 200
  - `/dashboard`: 200
- Live metadata:
  - `/learn/3/french`: `noindex,nofollow`
  - `/learn/3/french/bonjour-classe-3`: `noindex,nofollow`

## Notes

- Full live seeded-dashboard tests cannot use fake localStorage auth on production because Supabase correctly clears unauthenticated cached sessions. Those flows were therefore verified against the local production build, while live production QA focused on real-public safe flows.
- No customer-facing broad rollout was enabled. Customers do not see the selector in internal mode.
- Future full rollout should switch rollout mode to `all`, not a percentage rollout.
