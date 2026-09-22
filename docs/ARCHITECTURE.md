# Architecture

A configuration-driven assessment platform. One engine runs every exam; each
exam is data, not code branches.

## Stack, and why

| Choice | Version | Why this one |
| --- | --- | --- |
| Next.js App Router | 15.5.25 | Server-rendered public pages for search, server components for authorization, route handlers for the API. Pinned to 15.x rather than 16.x deliberately: 15.5 is a supported release whose App Router behaviour is well understood, and correctness mattered more than recency here. |
| React | 19.3 | Required peer of Next 15.5. |
| TypeScript | 5.9, `strict` | `noUncheckedIndexedAccess` is off: the runtime validation below carries that weight instead. |
| Tailwind CSS | 4.3 | CSS-first tokens in `src/app/globals.css`, no component library. |
| SQLite (better-sqlite3) | 13.0 | See "Why not PostgreSQL" below. |
| Zod | 4.6 | One schema per contract, used for both compile-time types and runtime validation. |
| Vitest | 3.2 | Unit and integration tests. |
| Playwright | 1.63 | Browser tests for the learner journeys. |
| marked + sanitize-html + KaTeX | — | Server-side Markdown and maths rendering. |

No ORM, no authentication library, no chart library, no UI kit. Each of those
was weighed and declined: the SQL here is simple and benefits from being
explicit, sessions are 120 lines, the charts are small SVGs that must ship an
accessible table anyway, and a component library would have been styled away.

### Why not PostgreSQL

The brief suggested PostgreSQL. This environment has neither PostgreSQL nor
Docker available, so a Postgres-only application could not have been run,
seeded, tested or demonstrated here — it would have been delivered unverified.

SQLite was chosen so the whole thing actually runs. The consequences were
contained deliberately:

- The schema in `db/migrations/001_core.sql` avoids SQLite-specific syntax
  beyond `INTEGER` booleans and `TEXT` timestamps.
- All access goes through `src/lib/db/` and the repository modules; no SQL is
  written in a component.
- `better-sqlite3` is synchronous, which the assessment engine benefits from:
  `db.transaction(...)` gives real atomicity for submit-and-score with no
  interleaving await points.

**Porting to PostgreSQL** is therefore a contained job: translate the migration
(`INTEGER` booleans to `BOOLEAN`, `TEXT` timestamps to `TIMESTAMPTZ`,
`INTEGER PRIMARY KEY AUTOINCREMENT` to `BIGSERIAL`, keep the partial unique
index), swap the driver in `src/lib/db/index.ts` for `pg`, and make the
repository functions async. The transaction boundaries and the SQL itself carry
over. Estimated at one to two days, mostly mechanical.

## Layers

```
src/lib/assessment/     Pure engine. No database, no clock, no I/O.
  types.ts              THE shared contract: response types, answer keys,
                        navigation policy, scoring policy, exam configuration.
  score.ts              Scoring and aggregation.
  navigation.ts         What a learner may do, given a policy and a part state.
  timing.ts             Deadlines, expiry, pause semantics.
  select.ts             Seeded selection and content-sufficiency checks.

src/lib/exams/          Exam data.
  configs/*.ts          One versioned ExamConfig per exam, built from the
                        verified research in docs/research/.
  registry.ts           Hubs (what a visitor browses) and configs (what the
                        engine runs).

src/lib/attempts/       Stateful orchestration.
  service.ts            The attempt lifecycle. Every function takes the acting
                        userId and filters on it.
  availability.ts       The two gates: verified rules, and enough content.
  view-model.ts         Server-rendered payload for the player.

src/lib/content/        The question bank.
  question-schema.ts    Question contract plus editorial rules.
  loader.ts             Loads and validates content/ JSON.
  repository.ts         Reads. toPresented() never includes an answer key.

src/lib/auth/           Sessions, password hashing, rate limiting.
src/lib/learning/       Recommendations and study plans.
```

The dependency direction is one-way: `assessment` knows nothing about the
database; `attempts` depends on `assessment`, `content` and `exams`; the app
depends on all of them.

## The assessment engine

An exam is an `ExamConfig` (`src/lib/assessment/types.ts`) holding sections,
domains, blueprints, a navigation policy, a scoring policy and a set of
capabilities. Nothing about a specific exam is hardcoded anywhere else.

A **blueprint** is a practice format: parts, item counts, timing, selection
constraints, and an honest `fidelity` label. A blueprint is offered only if it
passes two independent gates (`availability.ts`):

1. **Rules** — the exam's behaviour is verified well enough (from
   `capabilities`, decided by the research record).
2. **Content** — the reviewed bank can fill the blueprint without repeating a
   question (`checkBlueprintSufficiency`).

Failing either gate hides the format *and shows the reason*. This is what stops
a twenty-question bank from being presented as a full-length simulation.

### Immutability

Attempts pin two things at creation: `exam_config_version` and, per item, a
`question_version_id`. Editing a question publishes a new version row; the old
row is untouched, so a historical result can never be changed by later editing.
There is a test for exactly this (`attempts.test.ts`, "content immutability").

### Server authority

- **Timing**: deadlines are timestamps the server wrote. The browser countdown
  is display only. Every write is checked with `acceptsWrite()`, which allows a
  3-second in-flight grace and nothing more.
- **Navigation**: `canNavigateTo` / `canAnswerAt` run on the server for every
  request. The Bocconi forward-only rule and the GMAT three-edit cap are
  enforced in the API, not in the interface.
- **Answer keys**: `toPresented()` strips them. They reach the client only
  through `review`, and only when the learner is entitled to see them (untimed
  practice after answering, or any submitted attempt).

### Shared question pools

Some exams deliver the same content domains across several separately timed
sections (the SAT's two Reading and Writing modules; the GRE's two Verbal
sections). Questions are tagged to the first such section, and later sections
declare `poolSectionKey` pointing back at it. Without this the second module
could never draw a question — a real bug the integration tests caught.

## Data model

See `db/migrations/001_core.sql`, which is commented. The shapes that matter:

- `questions` / `question_versions` — immutable published content.
- `exam_configs` — immutable versioned configuration snapshots.
- `attempts` / `attempt_parts` / `attempt_items` — the persisted exam. Item
  order lives in `attempt_items.position`, so a refresh replays stored rows
  rather than re-running selection.
- `attempt_events` — an audit trail (routing decisions, answer changes,
  expiry), also used to count GMAT-style edits.
- `attempt_results` — computed once, idempotently, including a `methodology`
  block separating official facts from our approximation.
- `review_queue` — spaced review of missed questions.

## Rendering and content safety

Markdown and maths are rendered **only on the server** (`src/lib/markdown.ts`).
The order is deliberate: maths is extracted to placeholders, the Markdown is
rendered and then sanitised with an allowlist, and only then is the trusted
server-generated KaTeX injected. The sanitiser therefore never has to allow
KaTeX's large markup surface, and nothing from the content files reaches the
page unsanitised.

## Known limitations

- SQLite means a single writer; fine for this scale, and the porting path is
  above.
- No dark theme. One theme was done properly rather than two half-checked for
  contrast.
- The dev server cannot start on this machine (an Application Control policy
  blocks Next's SWC binary); `npm run build && npm start` works, and that is
  what the browser tests use.
