# Shared contracts

These are the interfaces everything else depends on. They have **one owner**
(the coordinating agent). Propose a change before making one: a silent edit here
can invalidate stored attempts, published content, or both.

## 1. Assessment types — `src/lib/assessment/types.ts`

The root contract. Defines response types, answer keys, learner responses,
navigation policy, scoring policy, sections, domains, blueprints and
`ExamConfig`. Every schema is a Zod schema, so the same definition provides the
TypeScript type and the runtime validation.

**Rules**

- A new response type requires: a variant in `answerKeySchema` and
  `responseSchema`, a branch in `isResponseCorrect` and `isEmptyResponse`, a
  case in `ResponseInput`, a formatter in `describeAnswerKey`, a parser in
  `scripts/apply-review.ts`, and tests for all of it. Partial support is worse
  than none — it will silently score wrong.
- `scoring.scaledEstimate.enabled` may only become `true` alongside a documented,
  defensible method and a stated set of limitations. No exam currently qualifies.
- `navigation.enforcement` is `'server'` for any rule that restricts the
  learner. Client-only enforcement makes a simulation a lie.
- `capabilities.*` encode whether the **rules** are verified. Content volume is a
  separate, runtime gate (see 4).

## 2. Database schema — `db/migrations/*.sql`

Migrations are append-only. **Never edit an applied migration**; add a new
numbered file. `src/lib/db/migrate.ts` applies each one inside a transaction and
records it in `_migrations`.

**Invariants**

- `attempt_items.question_version_id` references an immutable
  `question_versions` row. Attempts are pinned to what the learner actually saw.
- `attempts.exam_config_version` pins the configuration version.
- `exam_configs` rows are immutable. Changing a published config without bumping
  its version string makes historical attempts describe something that no longer
  exists; the seeder warns loudly when it detects this.
- Every learner-owned table has a `user_id` and every query filters on it.

## 3. Question schema — `src/lib/content/question-schema.ts`

The contract for `content/questions/**` and `content/stimuli/**`, plus the
editorial rules a JSON schema cannot express: equivalent-option detection,
answer-key resolution, required distractor reasoning, and the publication gates.

**Publication gates** (enforced, not advisory). A question may be `published`
only with a named reviewer who is not the author, a review date, and an
independent-solve record whose `agreesWithKey` and `uniquenessChecked` are both
true. `scripts/apply-review.ts` is the only thing that should set these, and it
sets them from a mechanical comparison.

`difficultyBasis` is `'editorial'` unless there is validated response data.
There is none, so it is always `'editorial'`.

## 4. The two availability gates — `src/lib/attempts/availability.ts`

A practice format is offered only if **both** pass:

1. **Rules** — `config.capabilities`, decided from the research record.
2. **Content** — `checkBlueprintSufficiency` confirms the reviewed pool can fill
   the blueprint without repeating a question.

When either fails, the format is hidden **and the reason is displayed**. Do not
add a code path that offers a format without consulting this.

## 5. HTTP API

All route handlers use `src/lib/api/http.ts`.

- Errors are `{ error: { code, message, detail? } }`. `toErrorResponse` maps
  `AttemptError`, `UnauthorizedError`, `ForbiddenError` and `ZodError`; anything
  else becomes a generic 500 and is logged rather than leaked.
- Every mutating route calls `assertSameOrigin(request)` first.
- Every mutating route validates its body with Zod before touching the database.
- The acting user comes from the session only, never from the URL or body.
- Clients send `X-Requested-With: examer` so a request without an `Origin`
  header can still be distinguished from a cross-site form post.

## 6. Content rendering

Markdown and maths are rendered **server-side only**, via
`src/lib/markdown.ts`. The order is load-bearing: extract maths to placeholders,
render Markdown, sanitise with an allowlist, then inject the trusted KaTeX. Do
not render authored Markdown in the browser, and do not pass unsanitised HTML
into `dangerouslySetInnerHTML` from anywhere else.

## 7. Answer-key confidentiality

`toPresented()` returns a question without its key, explanation or distractor
notes. `toReviewable()` returns them. The attempt service decides which a
learner may see: after submission, or in untimed practice once the item is
answered. Any new surface that returns question data must make that choice
explicitly.

## Changing a contract

1. State the problem and the proposed shape.
2. Check the blast radius: stored attempts, published content, seeded configs.
3. Prefer an additive, optional field over changing an existing one —
   `poolSectionKey` and `pageSize` were both added this way, so no existing
   config needed editing.
4. Update the validator, the tests, and this file in the same change.
