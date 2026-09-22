# Examer

A configuration-driven exam practice platform for six university admission
tests: the **Bocconi Online Test** (undergraduate and law), the **Digital SAT**,
the **Enhanced ACT**, the **LSAT**, the **GMAT** and the **GRE**.

The organising principle is that the product does not say anything it cannot
source. Every claim about how an exam works is verified against the test
maker's own published pages and carries the URL and the date it was checked;
where a rule is not published, the application says so and switches off the
feature that would have depended on it.

`Examer` is a neutral working name held in one constant (`src/lib/site.ts`).

## Quick start

```bash
npm install
cp .env.example .env          # then edit SESSION_SECRET
npm run db:migrate
npm run db:seed
npm run build && npm start    # http://localhost:3000
```

`npm run dev` is the usual development command. On this machine it does not
start, because an Application Control policy blocks Next.js's native SWC
binary; `npm run build && npm start` works and is what the browser tests use.

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
| `npx tsx scripts/validate-configs.ts` | Validate the exam configurations |

## What is here

- **A verified specification per exam** — `docs/research/`, generated from
  source-backed records in `content/exam-specs/_raw/`. Start with
  [`docs/research/README.md`](docs/research/README.md) and the
  [discrepancy register](docs/research/DISCREPANCY-REGISTER.md).
- **Seven versioned exam configurations** — `src/lib/exams/configs/`. Sections,
  timing, navigation rules, calculator policy, scoring, official taxonomy, and
  an explicit list of what could not be verified.
- **A configuration-driven assessment engine** — `src/lib/assessment/`. Pure
  functions for scoring, navigation, timing and selection, with no exam
  hardcoded anywhere.
- **An original question bank** — `content/questions/`, every item independently
  solved by a second reviewer before publication.
- **Public educational pages** — exam hubs, format and scoring guides, and
  editorial guides, server-rendered with canonical URLs and structured data.

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

Not affiliated with, endorsed by or accredited by College Board, ACT, LSAC,
GMAC, ETS or Università Bocconi. Exam names are used descriptively to identify
the exam a guide concerns.
