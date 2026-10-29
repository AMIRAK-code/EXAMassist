# Human review: how a question becomes available to learners

Every question is AI-assisted, and before publication a separate AI reviewer
solves it blind (`scripts/apply-review.ts`). That is automated quality control.
It stays, and it is useful, but it is not human review and nothing on the site
treats it as one.

Since migration 014, **a question is served to a new session only when a
named, authorised human reviewer has approved its exact current content.**
The rule lives in one place, `humanApprovalSql` in
`src/lib/content/human-review.ts`, and every path that builds a new session or
shows a question publicly goes through it (`getPool`, `getPublishedVersion`).
Sessions learners already started keep the question versions they pinned.

## What an approval is

- A decision recorded by a person signed in to **their own account**, which an
  administrator has authorised as a reviewer for that exam, and which they
  have confirmed themselves.
- For **one question version and one content fingerprint**: a SHA-256 of the
  stem, instructions, choices, answer key, explanation, distractor notes,
  screen-reader text, taxonomy (section, domain, skill), difficulty and
  stimulus. Any edit to any of those, version bump or not, changes the
  fingerprint and the approval stops counting.
- With all four checks confirmed: **answer key, explanation, wording, syllabus
  alignment**. A request for changes needs a note.
- Never by an author: the server refuses a reviewer whose public name, account
  email, display name or listed author aliases match the question's
  `review.author`, `provenance.authoredBy` or `provenance.editedBy`.
- Append-only. A later request for changes on the same content withdraws an
  approval; a later approval can reinstate it. Nothing is edited or deleted.

What learners see: on a question's review page after a session, the reviewer's
public name, their credentials as they confirmed them, the date and the four
checks, for that exact version only. A question shown in Italian adds that the
reviewer approved the English original (the translation is checked separately,
and that check is not a human expert review).

## Setting up a reviewer (administrator)

1. The reviewer creates an ordinary account on the site and tells you its email.
2. Agree with them, in writing, the one line of credentials they are happy to
   have shown publicly, e.g. "Mathematics teacher, liceo scientifico, 12 years".
   No invented titles.
3. Go to **/admin/reviewers**, enter their email, public name, that credentials
   line, the exams they are qualified for, and every name they have written or
   edited content under (so they can never approve their own work). Authorise.
4. Never authorise a placeholder, a shared account, a test account in
   production, or an AI. Authorising yourself is possible and is flagged
   ("Self-authorised") on the list.

To withdraw someone: **/admin/reviewers → Withdraw authorisation**, with a
reason. Their recorded decisions stay. To withdraw a specific approval, another
reviewer records a request for changes on that question.

## Reviewing (the reviewer)

1. Sign in with your own account and open **/admin/review**.
2. The first time, read the line that will be shown beside your approvals. If
   it is accurate, tick the box and **Confirm and start reviewing**. If it is
   not, ask the administrator to correct it; do not confirm a wrong line.
3. The queue lists questions awaiting human review for your exams. Open one.
4. The page shows the question as learners see it (stimulus, choices,
   screen-reader text), the keyed answer, the explanation, the note on every
   wrong choice, the syllabus alignment (section, domain with its official
   share, skill, the taxonomy source), the automated checks (labelled as such),
   the review history and the publication log.
5. Solve it yourself before reading the key. Then check, yourself:
   - **Answer key:** exactly one defensible answer, and it is the keyed one.
   - **Explanation:** correct, and it teaches the method; each distractor note
     names a real misreading.
   - **Wording:** clear, unambiguous, free of errors, fair to a learner.
   - **Syllabus alignment:** it tests the skill and domain it is tagged with,
     within the exam's published scope.
6. If all four hold, tick all four and **Approve this version**. Otherwise
   **Request changes** with a note saying what to change. Never approve
   something you did not check.

If the page says the question changed after you opened it, reload and review
the current text. If it says the content does not match its fingerprint, do
not approve; tell the administrator (the row was changed outside the content
workflow).

## After a request for changes (editor)

Edit the JSON file under `content/questions/`, increment `version` if the
question has ever been served, run `npm run content:validate`, and re-seed. If
you edited it yourself, add your name to `provenance.editedBy` so you cannot
approve it. The new version appears in the queue as awaiting review.

The seeder refuses to rewrite a version that learners' attempts already point
at; bump the version instead. It logs every new version, content change and
state change in `audit_log`, shown on the question's review page.

## Records and privacy

- `reviewers`: who may review, what they confirmed, who authorised them.
- `question_reviews`: every decision, with the reviewer's name and credentials
  copied as they stood.
- A reviewer's account export includes both. Deleting the account removes the
  authorisation; recorded decisions are kept, unlinked from the account, as the
  audit trail of what was approved (see docs/HUMAN-APPROVAL-ROLLOUT.md for the
  open privacy question).
