# Handoff

State of the platform at the end of the build session, what is verified, what is
missing, and what to do next.

Read `docs/VERIFICATION.md` alongside this: it holds the evidence for every
claim made here.

---

## 1. What works

A learner can do all of this today, end to end, verified in a browser:

- **Discover** — land on the homepage, browse six exam hubs grouped by
  undergraduate / law / graduate admission, read a format and scoring guide that
  cites the test maker for every fact and shows the date it was checked.
- **Practise** — start a session with no account (a guest session is created
  automatically), choose topic, difficulty and length, answer questions of every
  supported response type, and see a worked explanation plus per-distractor
  reasoning immediately after each answer.
- **Resume** — close the tab and come back. Question order, answers, flags and
  remaining time are all server state; nothing is regenerated.
- **Submit and review** — get results reporting accuracy, raw points (with
  negative marking where the exam has it), timing, and a per-skill breakdown
  against the test maker's own taxonomy, followed by a question-by-question
  review with explanations.
- **Improve** — a dashboard with recommendations that state their reasoning, a
  mistake notebook, bookmarks, and a study plan built from target date and
  weekly time.
- **Account** — sign up (keeping guest history), sign in, export their data,
  delete their account.
- **Report** — flag a question as wrong or ambiguous, which an editor triages in
  a role-gated admin area.

**43 routes**, typecheck clean, **170 unit and integration tests**, **37 browser
tests** across desktop and mobile, production build succeeds.

## 2. How to run it

```bash
npm install
cp .env.example .env          # set SESSION_SECRET to a long random value
npm run db:migrate
npm run db:seed
npm run build && npm start    # http://localhost:3000
```

An admin account is created by `npm run db:seed` if `ADMIN_EMAIL` and
`ADMIN_PASSWORD` are set in the environment.

> `npm run dev` does not start on the build machine: an Application Control
> policy blocks Next.js's native SWC binary. `npm run build && npm start` works
> and is what the tests use. On an unrestricted machine `npm run dev` is normal.

Verification:

```bash
npm run verify   # typecheck + content validation + 170 tests
npm run e2e      # 37 browser tests; prepares its own database
```

## 3. Coverage per exam — the honest table

Reviewed questions and what each exam can actually offer. "Practice" is the
open, untimed drill; "timed section" reproduces a real published section; a
simulation needs both verified rules and enough content.

| Exam | Reviewed questions | Domains covered | Practice | Diagnostic | Timed section | Full simulation |
| --- | --- | --- | --- | --- | --- | --- |
| Digital SAT | 24 | 8 / 8 | Yes | Yes | No — needs 22–27 per module | No — needs 98 |
| GRE General | 23 | 7 / 8 | Yes | 1 short | Quant section 1 | Rules not fully verified |
| Bocconi (undergraduate) | 23 | 4 / 4 | Yes | 1 short | No — needs 50 | Rules verified; needs 50 |
| Enhanced ACT | 22 | 13 / 17 | Yes | 4 short | No | No — ACT's own documents conflict on breaks |
| Bocconi (law) | 22 | 5 / 5 | Yes | Yes | No — needs 50 | Rules verified; needs 50 |
| LSAT | 21 | 3 / 4 | Yes | Yes | No — needs ~24 per section | LSAC does not publish item counts |
| GMAT | 8 published, 14 in review | 2 / 8 | Pending review | No | No | No — question-level adaptive, algorithm proprietary |

The uncovered domains are the two essay domains we deliberately do not author
(GRE Analyze an Issue, LSAT Argumentative Writing), the ACT science section, and
the GMAT domains still in review. Two items are **quarantined**, not published,
because an independent reviewer found a second defensible answer.

**This is a starter library, not a course.** The brief's target was 20 reviewed
questions per exam. Six of the seven configurations now meet it; GMAT's 14 new
items are written and awaiting their blind independent solve, which is the last
step before they publish.

Every one of those gaps is visible in the product, with its reason, before a
learner commits to anything. Nothing is presented as available and then fails.

## 4. What is verified, and what is deliberately absent

### Verified against official sources

Sections, question counts, timing, navigation rules, calculator policy, scoring
rules and the official skill taxonomy for all six exams, each with a source URL
and a verification date (`docs/research/`). The coordinating agent re-checked
every load-bearing number first-hand; see `VERIFICATION.md` §1.

### Deliberately absent, and why

- **No scaled scores.** No test maker publishes raw-to-scale conversion, and the
  digital SAT is not scored by counting correct answers at all. Producing a
  400–1600 number would be fabrication.
- **No percentiles.** They require a calibrated reference population.
- **No calibrated difficulty.** Every label is `editorial` and says so.
- **No full-length simulations yet.** Both gates must pass.
- **No admission probabilities.** Bocconi's published floors are shown as
  requirements; observed averages are never presented as thresholds.

### Corrections made to the supplied brief

Full register in `docs/research/DISCREPANCY-REGISTER.md`. The most significant:

1. **LSAT** — Analytical Reasoning ("logic games") was removed in August 2024.
   Nothing in the product references it. LSAC also does not publish per-section
   item counts, so our timed LSAT counts are labelled as our editorial choice.
2. **ACT** — under the enhanced format the core test is 131 administered / 108
   scored questions in 125 minutes; commonly quoted totals describe the retired
   format.
3. **SAT** — College Board does publish the unscored-question count: two pretest
   questions per module, eight in total. It also states that scoring is
   IRT-based, which is precisely why no practice tool can produce an honest
   scaled score.
4. **Bocconi** — there are **three** test variants, not two (undergraduate, law,
   and an international graduate form with different penalties and attempt
   caps). Navigation is forward-only in screens of three. Negative marking is
   real: −0.2, or −0.33 on three-option critical-thinking items. The 17-point
   floor is an official eligibility requirement, not a competitive score.
5. **Adaptive scoring** — the SAT is adaptive at *module* level, the GRE at
   *section* level, the GMAT at *question* level; the ACT and LSAT are not
   adaptive at all. None publish their routing rules, so the only adaptive
   behaviour implemented is our own transparent two-stage rule for the GRE,
   labelled as ours wherever it appears.
6. **SEO assumptions** — FAQ rich results were withdrawn, practice-problem
   markup was deprecated, and no major provider has adopted `llms.txt`. The
   crawler policy instead distinguishes model-training crawlers from AI-search
   crawlers, because blocking the former does not remove you from the latter.

There was **no separate question attachment** in the repository; the only
supplied document was the brief itself. So no supplied questions were audited or
quarantined, and none are claimed to have been. The editorial checks the brief
asked for are instead enforced on everything *we* author.

## 5. Known limitations

| Limitation | Impact | Notes |
| --- | --- | --- |
| Thin question bank | Sectional and full-length formats are still gated | Six of seven exams now meet the 20-item target; see §6 |
| SQLite, not PostgreSQL | Single writer | Forced by the environment; porting path in `ARCHITECTURE.md` |
| No screen-reader or axe pass | Accessibility is an intent, not a tested claim | Structural checks are automated |
| No dark theme | — | One theme done properly |
| Essays are not scored | GRE and ACT writing show a rubric only | Deliberate: automated essay scoring would be a fabricated number |
| Admin question view reads JSON at request time | Fine at this size | Independent-solve evidence is not in the database |
| Privacy and terms are drafts | Not legally reviewed | Each ends with explicit open questions |
| No email delivery | No password reset | Requires a mail provider decision |

## 6. Next-release backlog, in priority order

1. **Grow the bank towards sectional practice.** Every exam now has open
   practice, but a timed section needs the exam's real item count (22–27 for an
   SAT module, ~24 for an LSAT section, 50 for a Bocconi form). Priority: ACT
   science (no items at all), GMAT quantitative and verbal depth, SAT modules.
   The pipeline, in this order:
   author → `normalise-option-order` → `export-review-batch` → blind solve →
   `apply-review` → `db:seed`. Normalisation runs BEFORE review so option order
   is fixed while an item is still unpublished.
2. **Accessibility conformance.** An axe-core run in CI plus a screen-reader
   walkthrough of the player, then replace the intent claim with a real one.
3. **Rewrite the two quarantined items.** `lsat-lr-disagreement-115` and
   `enhanced-act-read-time-use-table-023` each have a second defensible reading.
   Each file records why, and neither is served to learners.
4. **Password reset**, which needs an email provider.
5. **Move independent-solve evidence into the database** (a migration adding
   `question_versions.independent_solve_json` and `quarantine_reason`).
6. **A second editorial reviewer for explanations**, not just answers. The blind
   solve verifies the key; nobody currently re-reads the explanation for
   pedagogy.
7. **Italian localisation.** Copy is centralised enough to extract, and the
   Bocconi audience is the obvious first case. Add `hreflang` only once real
   translations exist.
8. **Refresh cadence for exam facts.** These specifications decay. Put a
   quarterly re-verification in the calendar; the procedure is in
   `docs/research/README.md`.

## 7. Decisions needed from the owner

1. **Deployment target.** Nothing is deployed. The application is a standard
   Next.js server plus a SQLite file; any Node host works, but a persistent
   filesystem is required. Serverless platforms need the PostgreSQL port first.
2. **Whether to port to PostgreSQL now.** Advisable before multi-instance
   hosting.
3. **The brand.** "Examer" is a placeholder in one constant
   (`src/lib/site.ts`). Renaming is a single edit plus a favicon.
4. **Legal review** of the privacy and terms drafts, and a decision on the
   contracting entity and jurisdiction.
5. **Whether to offer an AI tutor.** Not implemented. The brief's constraints
   are sound, and the architecture supports adding it as an optional,
   clearly-labelled review-mode feature grounded in the stored explanation. It
   would need an API key, a spend limit and a usage policy.
6. **Search indexing.** `SEARCH_INDEXING_ENABLED` defaults to `false`, so any
   deployment is `noindex` until deliberately switched on. Do that only when the
   content is worth indexing.

## 8. Credentials and configuration

No credentials are committed. `.env` is git-ignored; `.env.example` documents
every variable.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_PATH` | Yes | SQLite file location |
| `SESSION_SECRET` | Yes | At least 32 characters; rotating it signs everyone out |
| `NEXT_PUBLIC_SITE_URL` | For production | Canonical URLs, sitemap, Open Graph |
| `SEARCH_INDEXING_ENABLED` | No | `true` to allow indexing; anything else means site-wide noindex |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | No | Seeds an administrator |

**The git remote push is outstanding.** The work is committed on `main`; pushing
to `github.com/AMIRAK-code/EXAMassist` needs the repository owner's GitHub
credentials, which are theirs to supply:

```bash
git push -u origin main
```
