# Examer

A configuration-driven exam practice platform for university admission tests:
the **Bocconi Online Test** (undergraduate and law), the **Digital SAT**, the
**Enhanced ACT**, the **LSAT**, the **GMAT**, the **GRE**, the **Politecnico di
Torino TIL-I and TIL-A**, and the **CISIA TOLC-E and TOLC-F**.

The organising principle is that the product does not say anything it cannot
source. Every claim about how an exam works is verified against the test
maker's own published pages and carries the URL and the date it was checked;
where a rule is not published, the application says so and switches off the
feature that would have depended on it.

`Examer` is a neutral working name held in one constant (`src/lib/site.ts`).

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

### Supabase PostgreSQL on Vercel

The server uses Supabase PostgreSQL when DATABASE_URL is set. Local development
and tests can still use SQLite when DATABASE_URL is absent. Vercel requires
DATABASE_URL and refuses to fall back to an ephemeral SQLite file.

The application retains its existing accounts and session authentication. Its
23 tables live in the private examer schema; the restricted examer_app login
can read and write that schema only. Browser publishable keys cannot access it.
Connections use the transaction pooler and verified TLS with the bundled public
Supabase root certificate. No service-role key is required.

Configure DATABASE_URL and the other values in .env.example through Vercel
environment variables before deploying the updated source. Keep credentials and
project-specific migration notes in private local files, never in Git.

Run npm run db:check for a PostgreSQL application smoke test that rolls back its
test records. npm run supabase:check independently checks the public API URL/key.

### Cloudflare Workers (exam.assist365.app)

The site also runs as the Worker `examer` in the Cloudflare account that holds
the assist365.app zone, built with OpenNext (`wrangler.jsonc`,
`open-next.config.ts`). The custom domain gives it its DNS record and
certificate. A Worker cannot keep a connection pool between requests, so the
database goes through the Hyperdrive config `examer-db`: the same examer_app
login against the Supabase session pooler (port 5432), TLS verify-full with the
Supabase root certificate, and query caching off. Each request opens a small
pool against Hyperdrive.

Public settings are the `vars` in `wrangler.jsonc`; `SESSION_SECRET` is a
Worker secret (`npx wrangler secret put SESSION_SECRET`). OpenNext copies
`.env` and `.env.local` into the Worker bundle, so `npm run cf:deploy` refuses
to run next to them. Deploy from a clean checkout after `npx wrangler login`:

    git worktree add ../examer-cf HEAD
    cd ../examer-cf && npm ci --ignore-scripts && npm run cf:deploy

On the Workers Free plan a request may use 10 ms of CPU. One scrypt password
check takes about 50 ms on a desktop CPU, so sign-in, sign-up and password
reset can fail there (error 1102) until the account is on Workers Paid.

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
- **Eleven versioned exam configurations** — `src/lib/exams/configs/`. Sections,
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
GMAC, ETS, Università Bocconi, Politecnico di Torino or CISIA. Exam names are
used descriptively to identify
the exam a guide concerns.
