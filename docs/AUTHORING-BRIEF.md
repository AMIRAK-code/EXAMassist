# Authoring brief

The rules every question author and content repairer works to. Read this before
touching anything under `content/`.

## Non-negotiable

1. **Original work only.** Do not reproduce, paraphrase or lightly reskin any
   published SAT, ACT, LSAT, GMAT, GRE or Bocconi item. Invent the situation,
   the numbers and the wording. If a stimulus resembles something you have seen,
   change it until it does not.
2. **Exactly one defensible answer.** Before you write the explanation, try to
   argue for each wrong choice. If you can build a case for a second one, the
   item is broken — fix the choices, do not fix the argument.
3. **Never cite option letters in prose.** Write "the choice that limits the
   claim to weekday mornings", not "(C)". Letters move whenever the choice order
   is normalised, and prose does not move with them. This is enforced by
   `validateQuestion` (`stale-option-letter`, `explanation-cites-letters`).
4. **New items enter as `"state": "in_review"`.** Authors never publish. A
   second reviewer solves the item blind, and `scripts/apply-review.ts`
   publishes it mechanically if and only if the blind answer matches the key.
5. **`provenance.aiAssisted` must be `true`** and `provenance.authoredBy` must
   name your assignment. Do not claim a human author.

## The file

One JSON file per question under `content/questions/<examKey>/<id>.json`. The
authoritative schema is `src/lib/content/question-schema.ts` — read it. A good
model to copy the shape from is
`content/questions/lsat/lsat-lr-netting-assumption-120.json`.

Required fields and the things authors get wrong:

| Field | Rule |
| --- | --- |
| `id` | `<examKey-prefix>-<topic>-<slug>-<nnn>`, unique across the bank. Use a number block nobody else is using. |
| `sectionKey`, `domainSlug`, `skillSlug` | Must exist in that exam's config under `content/exam-configs/`. A slug that is not in the config silently removes the item from every blueprint. |
| `stemMd` | Markdown. Maths in `$...$`. Do not put the answer choices in the stem. |
| `options[].id` | Lowercase letter, matching `label`. Two-part items use `<columnId>-<optionId>`, e.g. `loaves-c`. Colons are forbidden. |
| `answerKey` | Shape must match `responseType`. |
| `explanationMd` | Teach the method, not just the answer. Say what a learner should have noticed first, and what check settles it. No option letters. |
| `distractorRationale` | One entry per wrong option id, explaining the specific misreading that produces it. "This is wrong" is not a rationale. |
| `estimatedSeconds` | Honest working time, not the section average. |
| `accessibilityText` | A screen-reader description of anything visual, and of the notation. Written so somebody who cannot see the figure can still solve the item. |
| `review.independentSolve` | Leave `null`. The blind reviewer fills it. |
| `state` | `"in_review"`. |

## Difficulty

`difficultyBasis` is `"editorial"`. We have no response data, so it is never
`"empirical"`. Spread the set across easy/medium/hard rather than writing
everything at the level you find interesting.

## Answer position

Do not think about it. `scripts/normalise-option-order.ts` sorts numeric choice
sets ascending and deterministically shuffles the rest before review, which is
why prose must not name letters.

## Verification you must run and paste

```
npx tsx scripts/validate-content.ts <examKey>
```

Zero errors, and no `stale-option-letter` warnings on your files. Paste the
output verbatim in your report. An agent's self-report is not evidence; the
coordinator re-runs it.

## When you are blocked

If a slug you need does not exist in the exam config, or the schema cannot
express the item, **stop and report it**. Do not edit a shared contract
(`src/lib/assessment/types.ts`, `src/lib/content/question-schema.ts`,
`db/migrations/**`, `content/exam-configs/**`) — those have one owner.
