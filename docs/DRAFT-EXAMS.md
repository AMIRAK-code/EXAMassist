# Draft exams

Exams and hubs that are written but **not yet verified first-hand**. They live
in `DRAFT_EXAM_CONFIGS` and `DRAFT_EXAM_HUBS` in `src/lib/exams/registry.ts`.
Content validation knows them, so questions can be authored and blind-reviewed
against their taxonomy. Nothing else does: they are never seeded, listed,
practised, put in the sitemap or shown to a learner
(`tests/unit/draft-configs.test.ts` holds that line).

They are drafts because the build environment's network policy refused every
official host (`unito.it`, `saa.unito.it`, `saaexecutive.it`, `mur.gov.it`,
`universitaly.it`), so no fact in them could be read from its source. A draft
never claims otherwise: every `verifiedOn` reads `not yet verified`.

> **Correction (27 October 2026).** An earlier version of this file said the
> PoliTo TIL and TOLC-E configs recorded an impossible verification date and
> withdrew it. That was wrong. Those configs were verified first-hand on
> 29 September 2026 on `main` (`docs/research/polito-til.md`,
> `docs/research/cisia-tolc.md`), after this branch was cut; the branch had
> only an unfinished snapshot of that work. On merging `main`, its verified
> configs replaced the drafts here, and the TOLC-E and PoliTo exams are live.

## IMAT (live since 3 November 2026)

No longer a draft. The config was verified first-hand against D.M. 1005 of
6 August 2026, its annexes and tables (docs/research/imat.md), moved to
`EXAM_CONFIGS`, and given the hub `/exams/imat`. Re-verify when the 2027/28
decree is published.

## SAA School of Management, University of Turin (draft hub `saa-turin`)

| Route | Programme | Served by | Status |
| --- | --- | --- | --- |
| TOLC-E | Italian-taught business bachelor’s | `tolc-e` (live, verified) | Which SAA programmes use it, and how, unverified |
| SAT | Business & Management (English-taught bachelor’s) | `digital-sat` (live) | Route unverified |
| MBA | SAA MBA programmes | none | Selection criteria unverified |

To verify against the University of Turin's 2026/27 calls and SAA's pages:

- [ ] Which SAA programmes require the TOLC-E for 2026/27, and how each uses
      the score (ranking, minimum, remedial obligations).
- [ ] Business & Management admits through the SAT for 2026/27, and how.
- [ ] SAA MBA selection: whether a GMAT or GRE is required or accepted. Link
      the `gmat` or `gre` config only if SAA says so.

## Going live

1. Verify as above, record the result as a research spec in
   `content/exam-specs/_raw/`, run `node scripts/build-research-docs.mjs`,
   correct the config, and set `verifiedOn` to the date each source was read.
2. Move the config to `EXAM_CONFIGS` and the hub to `EXAM_HUBS`.
3. Set `capabilities.fullSimulation` from what the sources support.
4. `npm run verify`, `npm run db:seed`, and the browser tests.
