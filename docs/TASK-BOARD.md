# Task board

Status at the end of the build session. `Done` means verified by the
coordinating agent against the repository, not self-reported by the agent that
did the work.

Evidence commands are runnable from the repository root.

## Phase 1 — Audit and specification

| ID | Task | Owner | Depends on | Status | Files | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- |
| P1-01 | Inspect repository and environment | Coord | — | Done | — | Empty repo, no commits; Node 24.18, npm 11.16, **no Docker, no PostgreSQL**. Drove the SQLite decision. |
| P1-02 | Verify exam specifications from official sources | A ×8 | P1-01 | Done | `content/exam-specs/_raw/*.draft.json` | 8 records, 245 claims, all sources on official domains |
| P1-03 | Adversarial fact-check of P1-02 | A | P1-02 | **Replaced** | — | Stage died on a usage limit. Coordinator re-verified load-bearing numbers first-hand instead; see `VERIFICATION.md` §1 |
| P1-04 | Generate per-exam research documents | Coord | P1-02 | Done | `docs/research/*.md` | `node scripts/build-research-docs.mjs` — deterministic, cannot invent |
| P1-05 | Discrepancy register | A | P1-02 | Done | `docs/research/DISCREPANCY-REGISTER.md` | 495 lines; each of the brief's 7 flagged risks has its own verdict |
| P1-06 | Crawler and structured-data policy | E | — | Done | `docs/research/seo-and-crawler-policy.md` | 15 crawlers classified; 14 unsupportable claims listed |
| P1-07 | Shared contracts | Coord | P1-01 | Done | `src/lib/assessment/types.ts`, `db/migrations/001_core.sql`, `src/lib/content/question-schema.ts` | `docs/CONTRACTS.md` |
| P1-08 | Task board and agent assignments | Coord | — | Done | this file, `docs/AGENTS.md` | — |

## Phase 2 — Working vertical slice

| ID | Task | Owner | Depends on | Status | Files | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- |
| P2-01 | Scoring engine | D | P1-07 | Done | `src/lib/assessment/score.ts` | 33 tests; caught a real duplicate-selection bug |
| P2-02 | Timing engine | D | P1-07 | Done | `src/lib/assessment/timing.ts` | 20 tests |
| P2-03 | Navigation engine | D | P1-07 | Done | `src/lib/assessment/navigation.ts` | 33 tests |
| P2-04 | Selection engine | D | P1-07 | Done | `src/lib/assessment/select.ts` | 20 tests |
| P2-05 | Database layer and migrations | D | P1-07 | Done | `src/lib/db/**`, `db/migrations/` | `npm run db:migrate` |
| P2-06 | Attempt lifecycle service | D | P2-01..05 | Done | `src/lib/attempts/service.ts` | 27 integration tests |
| P2-07 | Authentication, sessions, rate limiting | D | P2-05 | Done | `src/lib/auth/**` | 27 tests |
| P2-08 | API routes | D | P2-06, P2-07 | Done | `src/app/api/**` | 16 routes; `npm run build` |
| P2-09 | Practice player | C | P2-08 | Done | `src/components/player/**` | Browser-verified; 33 E2E tests |
| P2-10 | Results page | C | P2-06 | Done | `src/app/attempt/[id]/results/` | Separates official facts from our approximation |
| P2-11 | End-to-end slice verified in a browser | F | P2-09, P2-10 | Done | — | discover → practice → explanation → submit → results, all observed |

## Phase 3 — Multi-exam expansion

| ID | Task | Owner | Depends on | Status | Files | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- |
| P3-01 | Seven versioned exam configurations | D ×7 | P1-02 | Done | `src/lib/exams/configs/*.ts` | `npx tsx scripts/validate-configs.ts` — 0 errors, 0 warnings |
| P3-02 | Exam registry (6 hubs → 7 configs) | Coord | P3-01 | Done | `src/lib/exams/registry.ts` | — |
| P3-03 | Question bank, first pass | A ×7 | P3-01 | Done | `content/questions/**` | 96 items; 1 validator false positive found and fixed |
| P3-04 | Blind independent solve | F ×7 | P3-03 | Done | `scripts/export-review-batch.ts`, `apply-review.ts` | 96/96 agreed; leak check passed |
| P3-05 | Remove answer-position bias | Coord | P3-04 | Done | `scripts/normalise-option-order.ts` | ACT key spread went from A=9/15 to 4/5/4/2 |
| P3-06 | Question bank top-up for thin exams | A ×6 | P3-04 | **In progress** | `content/questions/**` | Targets LSAT, GMAT, Bocconi Law, ACT reading, GRE verbal, Bocconi UG |
| P3-07 | Learner dashboard | C | P2-06 | Done | `src/app/dashboard/` | — |
| P3-08 | Content administration | C | P2-07 | Done | `src/app/admin/**` | Role-gated; read-only by design |

## Phase 4 — Learning and discovery

| ID | Task | Owner | Depends on | Status | Files | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- |
| P4-01 | Recommendations and study plan | D | P2-06 | Done | `src/lib/learning/recommend.ts` | Suppresses advice below 4 answers per skill |
| P4-02 | Mistake notebook and bookmarks | C | P4-01 | Done | `src/app/review/`, `src/app/api/bookmarks/` | — |
| P4-03 | Study plan screen | C | P4-01 | Done | `src/app/study-plan/` | — |
| P4-04 | Public exam hubs and format guides | C, E | P3-01 | Done | `src/app/exams/**` | Sources and verification dates rendered |
| P4-05 | Editorial guides | E | P1-02 | Done | `src/lib/content/guides.ts`, `src/app/guides/**` | 3 guides, each sourced |
| P4-06 | Metadata, sitemap, robots, structured data | E | P4-04 | Done | `src/app/robots.ts`, `sitemap.ts`, `src/components/seo/` | E2E asserts canonical + BreadcrumbList |
| P4-07 | Policy pages and question reporting | C | P2-07 | Done | `src/app/about/**`, `src/app/report-question/` | Privacy and terms explicitly labelled drafts |

## Phase 5 — Independent verification

| ID | Task | Owner | Depends on | Status | Files | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- |
| P5-01 | Scoring and engine unit tests | F | P2-01..04 | Done | `tests/unit/` | 106 tests |
| P5-02 | Attempt lifecycle integration tests | F | P2-06 | Done | `tests/unit/attempts.test.ts` | 27 tests; found 2 real bugs |
| P5-03 | Auth and rate-limit tests | F | P2-07 | Done | `tests/unit/auth.test.ts` | 27 tests |
| P5-04 | Browser tests, desktop and mobile | F | P2-09 | Done | `tests/e2e/` | 33 passed, 1 skipped |
| P5-05 | User-isolation verification | F | P2-06 | Done | both suites | Unit + cross-context browser test |
| P5-06 | Accessibility checks | F | P2-09 | **Partial** | `tests/e2e/` | Automated: skip link, single h1, keyboard operation, mobile layout, ARIA labels. **No screen-reader pass, no automated axe run** |
| P5-07 | Indexing configuration | E | P4-06 | Done | `tests/e2e/` | robots.txt and sitemap verified in both modes |

## Phase 6 — Delivery

| ID | Task | Owner | Depends on | Status | Files | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- |
| P6-01 | Architecture documentation | Coord | — | Done | `docs/ARCHITECTURE.md` | — |
| P6-02 | Shared contracts documentation | Coord | P1-07 | Done | `docs/CONTRACTS.md` | — |
| P6-03 | Agent assignments and corrections | Coord | — | Done | `docs/AGENTS.md` | — |
| P6-04 | Verification evidence | F | P5-* | Done | `docs/VERIFICATION.md` | — |
| P6-05 | Handoff | Coord | all | Done | `docs/HANDOFF.md` | — |
| P6-06 | Push to remote | Coord | P6-05 | **Blocked** | — | Commit ready on `main`; needs the owner's GitHub credentials |

## Open items, in priority order

1. **P3-06** — finish the top-up so every exam reaches 20 reviewed questions and
   every major domain is covered, then re-run the blind review over the new
   items.
2. **P5-06** — an axe-core pass and a screen-reader walkthrough of the player.
3. Adaptive routing is implemented and unit-covered but has **not** been
   exercised end to end, because no GRE blueprint has enough content to reach
   the second stage.
4. `/admin/questions` reads the content JSON files at request time to show
   independent-solve evidence, which is not in the database. A migration adding
   `question_versions.independent_solve_json` would be cleaner.
5. **C-ACT-023, a content correction tracked on its own** (added 25 September
   2026, outside Phase 2's acceptance). `enhanced-act-read-time-use-table-023`
   stays quarantined and is not served. The stem's "hid the most childcare"
   can be read as an absolute or a proportional measure; under the
   proportional reading no option is correct, so the item has a second
   defensible outcome. Its option letters were fixed in the Phase 2 closeout
   (docs/REDESIGN.md §12.1).
   - **To close:** reword the stem so it names the measure, as a new version;
     re-check every claim the explanation and notes make about the options;
     pass a new blind solve; then publish through `apply-review.ts` and
     `db:seed`.
   - **Availability:** no format waits on it. It is a Reading item, and ACT
     timed Reading is 29 questions short either way.
