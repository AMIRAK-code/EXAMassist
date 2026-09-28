# Draft exams

Exams whose configuration is written but **not yet verified first-hand**. They
live in `DRAFT_EXAM_CONFIGS` and `DRAFT_EXAM_HUBS` in
`src/lib/exams/registry.ts`. Content validation knows them, so questions can be
authored and blind-reviewed against their taxonomy. Nothing else does: they are
never seeded, listed, practised, put in the sitemap or shown to a learner
(`tests/unit/draft-configs.test.ts` holds that line).

They are drafts for one reason. The build environment's network policy refused
every official host (`unito.it`, `saa.unito.it`, `saaexecutive.it`,
`cisiaonline.it`, `polito.it`), so no fact in them could be read from its
source. The project rule is that an exam fact ships only with a source read
first-hand. A draft never claims otherwise: every `verifiedOn` reads
`not yet verified`.

## SAA School of Management, University of Turin

Hub draft `saa-turin`, three admission routes:

| Route | Programme | Served by | Status |
| --- | --- | --- | --- |
| TOLC-E | Italian-taught business bachelor’s (e.g. Economia aziendale, Management dell’informazione e della comunicazione aziendale) | `tolc-e` (draft config, new) | Config and questions drafted; facts unverified |
| SAT | Business & Management (English-taught bachelor’s) | `digital-sat` (live) | Route unverified; SAT practice itself is live |
| MBA | SAA MBA programmes | none | SAA appears to run its own selection; no test linked until its pages are read |

### To verify before going live

Read each item against its source, record the result as a research spec in
`content/exam-specs/_raw/` and run `node scripts/build-research-docs.mjs`.
Correct the config wherever the source differs, then move it.

**TOLC-E** — `src/lib/exams/configs/tolc-e.ts`, `src/lib/exams/configs/_tolc.ts`

- [ ] Sections, order, question counts and times: Logic 13 / 30 min, Verbal
      comprehension 10 / 30 min, Mathematics 13 / 30 min.
      (CISIA TOLC-E structure and syllabus page)
- [ ] Five options per question, one correct; +1 / 0 / -0.25.
      (Regolamento TOLC 2026)
- [ ] English section: 30 questions, 15 minutes, no penalty, scored separately.
- [ ] No calculator or aids (Regolamento TOLC 2026, 4.1.5 as drafted).
- [ ] No return to a closed section; movement within an open section.
- [ ] Topic list per section, against the official TOLC-E syllabus.
- [ ] Once per calendar month; TOLC@UNI and TOLC@CASA; result validity.
- [ ] Whether a negative absolute score is reported as such.

**SAA / University of Turin** — `DRAFT_EXAM_HUBS` in the registry

- [ ] Which SAA programmes require the TOLC-E for 2026/27, and how each uses
      the score (ranking, minimum, remedial obligations). Any published
      threshold becomes a `rawProjection.thresholds` entry with its source.
- [ ] Business & Management admits through the SAT for 2026/27, and how.
- [ ] SAA MBA selection: whether a GMAT or GRE is required or accepted. Link
      the `gmat` or `gre` config only if SAA says so.

**PoliTo TIL-I and TIL-A** — `polito-til-i.ts`, `polito-til-a.ts`

- [ ] Every rule in each config’s header, notes and `unverified` list, against
      the 2026/27 calls and the admission test page they cite. An earlier draft
      recorded these as read on 29 September 2026, after the date it was
      written; that record has been withdrawn.

### Going live

1. Verify as above; correct the config; set `verifiedOn` on the config and
   each source to the date it was read.
2. Move the config from `DRAFT_EXAM_CONFIGS` to `EXAM_CONFIGS`, and the hub
   from `DRAFT_EXAM_HUBS` to `EXAM_HUBS`.
3. Set `capabilities.fullSimulation` from what the sources support.
4. Render `otherRoutes` on the hub page (not built yet: the field is data only).
5. `npm run verify`, `npm run db:seed`, and the browser tests.

## Content

TOLC-E questions are original, under `content/questions/tolc-e/` and
`content/stimuli/tolc-e/`, authored and blind-reviewed through the normal
pipeline (`docs/AUTHORING-BRIEF.md`, `scripts/export-review-batch.ts`,
`scripts/apply-review.ts`). A published draft-exam question is still never
seeded until its config goes live.
