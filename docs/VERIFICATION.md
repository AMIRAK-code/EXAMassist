# Verification evidence

What was actually checked, how, and what it produced. Failures and gaps are
recorded alongside the passes; a verification document that reports only
successes is not evidence of anything.

Verification dates: exam facts **2026-09-18**, re-checked by the coordinating
agent **2026-09-18/20**. Test runs **2026-09-23**.

---

## 1. Exam facts, verified first-hand by the coordinating agent

The adversarial fact-check stage of the research workflow never ran — the
session hit a usage limit. Rather than accept unreviewed research, the
coordinating agent re-fetched the load-bearing numbers directly. These are the
numbers rendered to learners and encoded in the engine.

| Exam | Checked against | Result |
| --- | --- | --- |
| **Digital SAT** | `satsuite.collegeboard.org/sat/whats-on-the-test/structure` | Confirmed: 2 sections × 2 modules; Reading and Writing 54 questions / 64 min (32 per module); Math 44 / 70 min (35 per module); 2 h 14 min total; module-level adaptive |
| **Digital SAT** | `satsuite.collegeboard.org/scores/what-scores-mean/how-scores-calculated` | Confirmed: **"Two pretest questions are also included in each module"**, and scoring is IRT-based, not a raw-score table. This is why no scaled score is produced |
| **Enhanced ACT** | `act.org/.../act-exam-sections-and-structure.html` | Confirmed: English 50 administered / 40 scored / 35 min; Math 45 / 41 / 50; Reading 36 / 27 / 40; Science 40 / 34 / 40 (optional); Writing 1 essay / 40 min (optional) |
| **LSAT** | `lsac.org/lsat/taking-lsat/test-format` | Confirmed: **"four 35-minute sections"**, 3 scored + 1 unscored variable; **no Analytical Reasoning**; per-section question counts are *not* published; Argumentative Writing separate, 15 + 35 min |
| **GMAT** | `mba.com/exams/gmat-exam/about/exam-structure` (rendered in a browser; the page is JavaScript-only and returns nothing to a plain fetch) | Confirmed: Quant 21 / 45 min, Verbal 23 / 45, Data Insights 20 / 45; 64 questions, 2 h 15 min; **"you can review as many questions as you would like and can edit up to three (3) answers"**; section order chooseable |
| **GRE** | `ets.org/gre/test-takers/general-test/prepare/test-structure.html` | Confirmed: Analytical Writing 1 task / 30 min; Verbal 12 / 18 and 15 / 23; Quant 12 / 21 and 15 / 26; ~1 h 58 min; section-level adaptive; no unscored research section |
| **Bocconi (UG + Law)** | `unibocconi.it/.../online-bocconi-test` | Confirmed: 50 questions / 75 min; undergraduate 24 / 11 / 6 / 9; law 5 / 11 / 6 / 18 / 10; **+1 correct, 0 missing, −0.2 wrong**, with −0.33 on three-option critical-thinking items; below 17 points excluded from selection |
| **Bocconi navigation** | AY 2027/28 *Instructions and Rules of Conduct* PDF, §3.2–3.3, text extracted locally | Confirmed verbatim: **"The test presents 3 questions on each screen ... By clicking the 'Next' button, you will move to the next screen and will not be able to return to previous screens."** and a summary page listing answered and omitted questions before submission |

### Arithmetic consistency

Independently recomputed, because the brief flagged totals that do not add up:

- SAT: 27 × 2 = 54 ✓, 22 × 2 = 44 ✓, (32 × 2) + (35 × 2) = 134 min = 2 h 14 ✓
- ACT core: 50 + 45 + 36 = 131 administered, 40 + 41 + 27 = 108 scored,
  35 + 50 + 40 = **125 min** (165 with Science) ✓
- GMAT: 21 + 23 + 20 = 64 ✓, 45 × 3 = 135 min = 2 h 15 ✓
- GRE: 12 + 15 + 12 + 15 = 54 scored questions, 30 + 18 + 23 + 21 + 26 = 118 min ✓
- Bocconi: 24 + 11 + 6 + 9 = 50 ✓, 5 + 11 + 6 + 18 + 10 = 50 ✓
- LSAT: 4 × 35 = 140 min + 10-min intermission ✓

### A conflict that had to be resolved

Two research agents reached opposite conclusions about Bocconi navigation. The
coordinating agent fetched the 2027/28 rules PDF and extracted §3.2 directly.
Neither agent was wholly right: a summary page does exist, but it is not
documented as editable, and questions are committed in screens of three rather
than one at a time. The engine gained `pageSize` and `reviewScreenEditable` to
express the real rule, and both configs were rewritten.

---

## 2. Content verification

### Blind independent solve

Every question was solved by a second agent working from a **blinded** copy with
the answer key, explanation and distractor notes stripped
(`scripts/export-review-batch.ts`, which fails if any of those strings appear in
its output). Reviewers were instructed not to open `content/`.

Comparison is **mechanical**: the reviewer's answer is parsed into a `Response`
and run through the same `isResponseCorrect` the application uses
(`scripts/apply-review.ts`). Agreement publishes; disagreement quarantines.

```
96 verdicts applied
  published:   96
  quarantined: 0
```

96 of 96 independent solves agreed with the authors' keys.

A second round covered the 49 questions written to fill coverage gaps:

```
49 verdicts applied
  published:   47
  quarantined:  2
```

Both quarantines came from a finding that **agreement alone would have missed**.
On `lsat-lr-disagreement-115` and `enhanced-act-read-time-use-table-023` the
reviewer's answer matched the key, but they showed a second answer was
defensible — on the ACT item, under one reading of the stem no option is correct
at all. The pipeline originally quarantined only on disagreement, so this was a
real hole: `Verdict.ambiguous` now exists, and an item flagged ambiguous is
quarantined no matter how the answers compared. Neither item is served to
learners, and neither was "repaired" by guessing at the intended answer.

### What review caught that agreement did not

The valuable finding was structural, not an incorrect key. Correct answers
clustered on the first option — on the ACT set, **all nine mathematics items
keyed to "A", and "D" was never correct**. As the reviewer put it, a test-taker
answering "A" to every mathematics question would have scored 9 out of 9 without
reading them.

`scripts/normalise-option-order.ts` fixed it by sorting numeric choice sets
ascending (the real exam convention, so position follows from the maths) and
deterministically shuffling the rest, remapping the key, distractor notes and
audit record together.

| Exam | Key position before | After |
| --- | --- | --- |
| Enhanced ACT | A=9, B=5, C=1, D=0 | A=4, B=5, C=4, D=2 |
| LSAT | A=5, B=1, C=1 | A=1, B=4, C=1, D=1 |
| Digital SAT | B=9, C=7, A=4, D=1 | C=8, B=5, A=4, D=4 |

Other review findings acted on: a mis-tagged GMAT skill slug; and shared-stimulus
items where one question telegraphs another, recorded for the editorial backlog.

### A false positive in our own validator

The validator flagged a SAT punctuation item for having "equivalent" options —
`"light, while"` and `"light while,"`. The bug was ours: the comparator stripped
commas before comparing, which is right for `1,000` versus `1000` and wrong for
an item about commas. Fixed so punctuation is only stripped while testing a
numeric reading. The question was sound.

---

## 3. Automated tests

```
npm run verify     # typecheck + content validation + unit tests
npm run e2e        # browser tests
```

### Unit and integration — 170 passing

| Suite | Tests | Covers |
| --- | --- | --- |
| `score.test.ts` | 33 | Every response type; correct/incorrect/omitted boundaries; negative marking; float and fraction handling; essays excluded from accuracy; type mismatch |
| `navigation.test.ts` | 33 | Free, forward-only and GMAT policies; the three-per-screen rule; edit caps; submitted/expired parts |
| `timing.test.ts` | 20 | Deadlines, expiry at the boundary, the late-write grace, pause semantics |
| `select.test.ts` | 20 | Determinism, difficulty mixes, freshness, passage grouping, sufficiency |
| `attempts.test.ts` | 27 | Full lifecycle against a real database |
| `auth.test.ts` | 27 | Hashing, sessions, revocation, rate limiting |
| `adaptive-routing.test.ts` | 10 | The routing rule, and a full SAT simulation routed end to end |

Tests that speak directly to the definition of done:

- **Isolation** — a second user gets 404 (not 403) on read, answer and submit;
  the attempt is unchanged afterwards.
- **Refresh survival** — question order and answers are identical across reloads.
- **Idempotency** — a repeated start key returns the same attempt; a second
  submit does not score twice.
- **Server-authoritative timing** — an attempt returned to after its deadline is
  expired with unanswered items scored as omitted; a write after the deadline is
  rejected, one just inside it is accepted.
- **Immutability** — publishing a new question version with a *different key*
  does not change an already-scored attempt.
- **Key confidentiality** — the serialised live attempt payload contains no
  explanation text.
- **Content gating** — a blueprint the pool cannot fill is refused with
  `insufficient-content`.

### Bugs these tests found

1. **Duplicate multi-select answers scored as correct.** `["a","a"]` satisfied a
   two-option key: duplicates were only checked on the key side.
2. **Navigation frontier jumped to the last question.** Attempt creation marked
   every item in the first part as seen, so on a forward-only exam every
   question was immediately "already committed".
3. **Second-stage sections could never draw a question.** SAT module 2, GRE
   section 2 and LSAT LR2 select on their own section key, but domains are
   tagged to the first. Fixed with `SectionConfig.poolSectionKey`. Without it,
   half the SAT blueprints were permanently unfillable.
4. **Adaptive routing always routed down.** The completed part was scored
   *after* the routing decision was computed, so accuracy was read off
   unscored rows and came out zero for everyone. Found by the first end-to-end
   routing test; the fix scores the part first, then routes.
5. **A dropped audit field failed silently.** One reviewer omitted `solvedBy`
   from its verdicts, and `JSON.stringify` drops `undefined` properties, so the
   reviewer of record vanished from 15 files instead of the run failing.
   `apply-review` now validates every verdict before writing anything.
6. **Option-order normalisation was not idempotent**, and re-ran on published
   content. Shuffling an already-shuffled list with the same seed gives a new
   order, so every run churned the bank. It now canonicalises before shuffling
   and refuses to touch anything already published, which also moved it to its
   correct place in the pipeline: before review, not after.

### Browser tests — 37 passing, 1 skipped

Desktop Chrome and emulated Pixel 7, against a production build and a freshly
seeded database.

Covers: discovery from homepage to guide; a guest practising and reaching
results; reload survival; the absence of a scaled score; unavailable formats
showing their reason; **cross-context isolation** (a second browser context
cannot read or write the first's attempt); `noindex` on private pages;
cross-site POST rejected with 403; keyboard operation of the player; the skip
link; one `h1` per page; no horizontal scrolling at 360 px; ARIA state on the
question navigator; robots.txt and sitemap behaviour.

The skip is deliberate: Tab-order traversal is asserted on desktop only, since
the mobile project emulates a touch device.

### Authorization, verified against a running server

Checked by hand against the production build, then locked in as browser tests:

| Actor | `/dashboard` | `/admin` | `PATCH /api/admin/flags/:id` |
| --- | --- | --- | --- |
| Signed out | 307 to sign-in | 307 to sign-in | 401 |
| Signed-in learner | 200 | **404** | 403 |
| Editor / admin | 200 | 200 | 200 |

The 404 is deliberate: a learner probing `/admin` cannot tell the area exists.
An earlier implementation rendered a denial page at HTTP 200, which leaked no
data but was semantically wrong and inconsistent with the learner pages; page
guards now live in `src/lib/auth/guards.ts`.

Also verified end to end: account export returns only the acting user's rows and
contains neither the password hash nor any session token; deletion requires
typing the account email, kills the session immediately, and leaves **zero**
orphaned attempts, review-queue rows or sessions; and a second attempt to resolve
an already-decided content flag returns 409 rather than silently overwriting the
first editor's decision.

### Build

```
✓ Compiled successfully in 18.3s — 43 routes
```

Typecheck is clean under `strict`. Configuration validation reports 0 errors and
0 warnings across 7 exam configurations. Content validation reports 0 errors.

---

## 4. What has NOT been verified

Stated plainly, because these are real gaps:

- **No screen-reader pass and no automated axe run.** Accessibility was built to
  the WCAG 2.2 AA checklist and is covered by the structural assertions above,
  but "targets WCAG 2.2 AA" is a design intent here, not a tested conformance
  claim.
- **No load or concurrency testing.**
- **No penetration testing.** Security work was structural: server-side
  authorization on every query, parameterised SQL throughout, an origin check on
  mutations, rate limiting, hashed session tokens, and sanitised rendering.
- **Full-length simulations have not been run**, because no exam yet has enough
  reviewed content to fill one.
- **`npm run dev` does not start on this machine** — an Application Control
  policy blocks Next.js's SWC binary. All verification used
  `npm run build && npm start`.
- **Exam facts drift.** Everything here was true on the date recorded against
  it. `docs/research/README.md` has the refresh procedure.
