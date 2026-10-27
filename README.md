# Examer

A configuration-driven exam practice platform for university admission tests:
the **Bocconi Online Test** (undergraduate and law), the **Digital SAT**, the
**Enhanced ACT**, the **LSAT**, the **GMAT**, the **GRE**, the **Politecnico di
Torino TIL-I and TIL-A**, and the **CISIA TOLC-E, TOLC-F and TOLC-I**.

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
26 tables live in the private examer schema; the restricted examer_app login
can read and write that schema only. Browser publishable keys cannot access it.
Connections use the transaction pooler and verified TLS with the bundled public
Supabase root certificate. No service-role key is required.

Examer has its own Supabase project, "Examer" (eu-central-1), separate from any
other app. To set up a fresh project, run db/postgres/schema.sql and then
db/postgres/app-role.sql as the schema owner; the app connects as
examer_app.<project-ref> through that project's pooler host, which is shown in
the dashboard's Connect dialog.

Configure DATABASE_URL and the other values in .env.example through Vercel
environment variables before deploying the updated source. Keep credentials and
project-specific migration notes in private local files, never in Git.

Run npm run db:check for a PostgreSQL application smoke test that rolls back its
test records. npm run supabase:check independently checks the public API URL/key.

### Cloudflare Workers (uniexamer.com)

The site also runs as the Worker `examer` in the Cloudflare account that holds
the uniexamer.com zone, built with OpenNext (`wrangler.jsonc`,
`open-next.config.ts`). The custom domains give it its DNS records and
certificates. Until 27 October 2026 the site was at exam.assist365.app; that
host and www.uniexamer.com stay attached only to redirect (301) to the same
path on uniexamer.com (`next.config.ts`). A Worker cannot keep a connection pool between requests, so the
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

Rendering any page costs more than 10 ms too (a median of 28 ms, and 381 ms
for the home page, measured in Workers Observability on 2026-10-27). So
`cf:deploy` uploads twice: after the first upload it fetches every public page,
in every language, from the live site and saves it into `.open-next/assets`,
and the second upload serves those files without running the Worker at all
(`scripts/snapshot-pages.ts`, `src/lib/seo/static-pages.ts`). `/pricing` and
everything behind sign-in stay dynamic. Saved pages never pass through
`src/proxy.ts`, so a small inline script makes the same language choice on
them (cookie, then browser languages). The saved pages change only when you
deploy, so deploy again after publishing questions straight to the database.

Static files are answered for any hostname before the Worker's own redirects
run, so the snapshot step needs two Single Redirects in Cloudflare (Rules →
Redirect Rules): `www.uniexamer.com/*` to `https://uniexamer.com/${1}` in the
uniexamer.com zone, and hostname `exam.assist365.app` to
`concat("https://uniexamer.com", http.request.uri.path)` in the assist365.app
zone, both 301 and keeping the query string. Without them `cf:deploy` warns
and leaves every page dynamic.

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
| `npm run stripe:setup` | Create or check the Stripe products and prices for the plans (`-- --dry-run` to only report); see [`docs/BILLING.md`](docs/BILLING.md) |
| `npx tsx scripts/validate-configs.ts` | Validate the exam configurations |

## What is here

- **A verified specification per exam** — `docs/research/`, generated from
  source-backed records in `content/exam-specs/_raw/`. Start with
  [`docs/research/README.md`](docs/research/README.md) and the
  [discrepancy register](docs/research/DISCREPANCY-REGISTER.md).
- **Twelve versioned exam configurations** — `src/lib/exams/configs/`. Sections,
  timing, navigation rules, calculator policy, scoring, official taxonomy, and
  an explicit list of what could not be verified.
- **A configuration-driven assessment engine** — `src/lib/assessment/`. Pure
  functions for scoring, navigation, timing and selection, with no exam
  hardcoded anywhere.
- **An original question bank** — `content/questions/`, every item independently
  solved by a second reviewer before publication.
- **Public educational pages** — exam hubs, format and scoring guides, and
  editorial guides, server-rendered with canonical URLs and structured data.
- **Paid plans** — All access (€39/month) and Single exam (€19.99/month per
  exam) through Stripe, with the pricing page, checkout and plan management on
  the site's own pages; guides, sample questions and a diagnostic for every
  exam stay free. Off unless `BILLING_ENFORCED=true`. Plans, prices and the
  feature matrix are in `src/lib/billing/plans.ts`; setup, webhooks and the
  go-live checklist in [`docs/BILLING.md`](docs/BILLING.md).

- **Bocconi preparation and search** — the Bocconi landing page, its
  supporting guides, the funnel counts and the Search Console runbook are in
  [`docs/BOCCONI-SEARCH.md`](docs/BOCCONI-SEARCH.md); recording a human expert
  review is in [`docs/EXPERT-REVIEW.md`](docs/EXPERT-REVIEW.md); Search Console setup and the indexing
  audit are in [`docs/GOOGLE_SEARCH_CONSOLE_SETUP.md`](docs/GOOGLE_SEARCH_CONSOLE_SETUP.md).
- **Search and AI visibility** — robots policy, share images, llms.txt,
  IndexNow, what to run after a deploy and what needs the owners' accounts:
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

Not affiliated with, endorsed by or accredited by College Board, ACT, LSAC,
GMAC, ETS, Università Bocconi, Politecnico di Torino or CISIA. Exam names are
used descriptively to identify
the exam a guide concerns.
