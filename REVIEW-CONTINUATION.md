# Grade 1 NMG — sole foreground owner

Requested 2026-09-07. No detached writers, timers, or continuation schedules. Complete NMG only, then report once after verified release. Release authorised.

Baseline: released Grade1 Deutsch commit 79f5c1c (preserves Maths/daily/ranks). Dedicated worktree grade1-nmg-review, branch fix/grade1-nmg-review-20260907. Original dirty project and prior review worktrees must remain untouched.

Authoritative Grade1 QA Sheet: 1LFx4OcNdsbbXRUnxRXYRB7OViz4aDKD-BhW2-YL9wV0, tab Grade 1 QA; expected 1864 existing rows, verify live. Do not use master roadmap as exercise QA sheet. Repository served/localised data determines actual current exercise content.

State: baseline established; no NMG edits/tests/Sheet writes/deployment yet. Next: live Sheet snapshot, served NMG catalogue and per-ID scope reconciliation; individually review and correct. Existing helper at ../grade1-review-closure/.qa/grade1-closure/sheet-compare.py performs read-only full Sheet retrieval using installed credential helper without printing credentials.

Remaining gates: exact scope/review ledger, corrections, semantic/regression tests preserving outside unit, production build, interactive desktop/mobile scoring and real audio QA, Sheet compare/update/full readback, deploy correct project, hard-navigate www.cleverli.ch, cleverli.ch and cleverli-sigma.vercel.app (verify current alias list), final Sheet released notes/full readback, concise evidence-backed report.

## Recovered 2026-09-07 10:08
Live production still verified Deutsch deployment dpl_2sYU2GsXRQhAb3PxrWL5n3KcTdMF, baseline79f5c1c. Live authoritative Sheet reread:1864 rows, exact602 NMG IDs across12 topics, no missing/extra. Current source274 corrections/328 unchanged; delta from old276 explained by round-robin option positions restoring baseline si6 and wt5. Full15190 catalogue outside14588 hashes unchanged. Current semantic, NMG consolidation/rich,60760 speech and15190 global-ID tests and targeted lint pass (regressions-final.log). Previous build stopped on missing inherited QA catalogue fixture, NOT product defect; supplied current catalogue; Maths/daily/build rerunning. No deployment or Sheet write yet. Browser freshly started. Remaining: production build; hosted candidate; desktop/mobile scoring/real audio; Sheet full readback; release and all aliases. No duplicate owner/timers.

## 10:10 boundary correction
Foreign-locale check caught138 localized records changed by the early source hook. Moved exact274 reviewed DE content deltas into src/data/grade1NmgQaCorrections.json applied only in final German localizeExercise branch; removed early index hook. Four obsolete sequentialAnswer fields explicitly removed. German sample-card fix extended narrowly to science. Need rerun all gates for new boundary; prior build passed but is no longer final.

## Final semantic review
All602 served German question/answer records reread in12 topics. Memory renderer actually matches identical cards, not semantic pairs: fixed8 instructions/hints accordingly. Additional grammar/year-length/Swiss Bundesstadt and option/alternative issues fixed. Exact final292 corrected,310unchanged;602 structural/semantic records,14588outside-DE-unit hashes and1806foreign-localized records pass. Final-gates.log now running final source build and regressions. No public release/Sheet mutations yet. Hosted browser matrix prepared for every topic/difficulty and all5formats, plus targeted corrections; real audio pending.
