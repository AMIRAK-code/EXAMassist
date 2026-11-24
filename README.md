# UniExamer

**[uniexamer.com](https://uniexamer.com)** — practice for university admission
tests, with every exam rule checked against the test maker's own pages.

UniExamer covers the **Bocconi Online Test** (bachelor, law and master's
forms), the **Digital SAT**, the **Enhanced ACT**, the **LSAT**, the **GMAT**,
the **GRE**, the **Politecnico di Torino TIL-I and TIL-A**, and the **CISIA
TOLC-E, TOLC-F and TOLC-I**. The site is available in English, Italian,
Turkish, Spanish and Polish; TOLC questions can also be practised in Italian.

The organising principle is that the product does not say anything it cannot
source. Every claim about how an exam works is verified against the test
maker's own published pages and carries the URL and the date it was checked;
where a rule is not published, the application says so and switches off the
feature that would have depended on it.

The product name is held in one constant (`src/lib/site.ts`).

## Quick start

```bash
npm install
cp .env.example .env.local    # then edit SESSION_SECRET; leave DATABASE_URL empty for SQLite
npm run db:migrate
npm run db:seed
npm run build && npm start    # http://localhost:3000
```

`npm run dev` is the usual development command and works normally.

If dev fails with an `EINVAL ... readlink '.next/static/...'` error, delete the
`.next` directory and start again: a production build left in place can trip the
dev server on a synced filesystem such as OneDrive.

Local development and tests use SQLite. Production uses PostgreSQL; hosting and
deployment are described in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run verify` | Typecheck, content validation and unit tests |
| `npm test` | Unit and integration tests (Vitest) |
| `npm run e2e` | Browser tests (Playwright); prepares its own database |
| `npm run db:migrate` / `db:seed` / `db:reset` | Database lifecycle |
| `npm run content:validate` | Validate the question bank and report coverage |
| `npm run content:coverage [-- --write]` | Blueprint coverage against human-approved questions, the dry run of the approval policy, and the authoring backlog (docs/coverage/) |
| `npm run content:draft -- --exam=… --domain=…` | Draft questions with Claude into the review queue (`in_review`); `--dry-run` shows the request without calling the model. See docs/AUTHORING-BRIEF.md |
| `npm run stripe:setup` | Create or check the Stripe products and prices for the plans (`-- --dry-run` to only report); see [`docs/BILLING.md`](docs/BILLING.md) |
| `npx tsx scripts/validate-configs.ts` | Validate the exam configurations |

## What is here

- **A verified specification per exam** — `docs/research/`, generated from
  source-backed records in `content/exam-specs/_raw/`. Start with
  [`docs/research/README.md`](docs/research/README.md) and the
  [discrepancy register](docs/research/DISCREPANCY-REGISTER.md).
- **Versioned exam configurations** — `src/lib/exams/configs/`. Sections,
  timing, navigation rules, calculator policy, scoring, official taxonomy, and
  an explicit list of what could not be verified.
- **A configuration-driven assessment engine** — `src/lib/assessment/`. Pure
  functions for scoring, navigation, timing and selection, with no exam
  hardcoded anywhere.
- **An original question bank** — `content/questions/`, every item independently
  solved by a second reviewer before publication. Translations of questions are
  served only after an independent check.
- **Public educational pages** — exam hubs, format and scoring guides, and
  editorial guides, server-rendered with canonical URLs, language alternates
  and structured data.
- **Paid plans** — a Single Exam Pass (€23.99 once, one exam for six months)
  and Plus (€7.99/month or €59.99/year, every exam) through Stripe, with
  Premium (adds the AI tutor) announced but not sold; the pricing page,
  checkout and plan management are on the site's own pages; guides, sample
  questions, a diagnostic for every exam and official score tracking stay
  free. Off unless `BILLING_ENFORCED=true`. Plans, prices and the
  feature matrix are in `src/lib/billing/plans.ts`; setup, webhooks and the
  go-live checklist in [`docs/BILLING.md`](docs/BILLING.md).
- **Bocconi preparation and search** — the Bocconi landing page, its
  supporting guides, the funnel counts and the Search Console runbook are in
  [`docs/BOCCONI-SEARCH.md`](docs/BOCCONI-SEARCH.md); human review, which every
  served question needs, is in [`docs/EXPERT-REVIEW.md`](docs/EXPERT-REVIEW.md)
  and its rollout in [`docs/HUMAN-APPROVAL-ROLLOUT.md`](docs/HUMAN-APPROVAL-ROLLOUT.md); Search Console setup and the indexing
  audit are in [`docs/GOOGLE_SEARCH_CONSOLE_SETUP.md`](docs/GOOGLE_SEARCH_CONSOLE_SETUP.md).
- **Search and AI visibility** — robots policy, share images, llms.txt,
  IndexNow and what to run after a deploy:
  [`docs/SEARCH-AND-AI-VISIBILITY.md`](docs/SEARCH-AND-AI-VISIBILITY.md).

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the design and
[`docs/HANDOFF.md`](docs/HANDOFF.md) for the current state, what is verified and
what is missing.

## Things this product deliberately refuses to do

- **No invented scaled scores.** No test maker publishes its raw-to-scale
  conversion, and the digital SAT is not even scored by counting correct
  answers. Results report accuracy, timing and performance by skill instead.
- **No percentiles**, which would need a calibrated reference population.
- **No copied questions.** Everything is original work.
- **No "competitive score" presented as a requirement.** Where a university
  publishes an actual minimum it is labelled as one; an observed average is
  labelled as an observation.
- **No simulation it cannot deliver.** A full-length simulation appears only
  when the exam's rules are verified *and* the reviewed bank can fill the
  blueprint without repeating a question. Otherwise the reason is shown.

## Independence

UniExamer is an independent study resource. It is not affiliated with,
endorsed by or accredited by College Board, ACT, LSAC, GMAC, ETS, Università
Bocconi, Politecnico di Torino or CISIA. Exam names are used descriptively to
identify the exam a guide concerns.
