# Human review: how a question becomes available to learners

Every question is AI-assisted, and before publication a separate AI reviewer
solves it blind (`scripts/apply-review.ts`). That is automated quality control.
It stays, and it is useful, but it is not human review and nothing on the site
treats it as one.

Which questions a new session may draw on depends on the Worker variable
`HUMAN_APPROVAL_REQUIRED`:

- **Unset (the rule since 2026-10-30):** approval is optional. Everything that
  passed the automated gates is served, **except a question a reviewer sent
  back for changes**, which leaves new sessions at once and stays out until
  its content changes or someone approves it.
- **`"true"`:** a question is served only when a named, authorised human
  reviewer has approved its exact current content.

The rule lives in one place, `servableSql` in
`src/lib/content/human-review.ts`, and every path that builds a new session or
shows a question publicly goes through it (`getPool`, `getPublishedVersion`).
Sessions learners already started keep the question versions they pinned.

## What an approval is

- A decision by a person an administrator has authorised as a reviewer for
  that exam, and who has confirmed that authorisation themselves. They record
  it signed in to **their own account**, or, for decisions they returned on a
  CSV or a list, an administrator records it **in their name** in a named
  batch (see below). Either way the reviewer is the decision's author; an
  administrator is never recorded as the reviewer.
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
3. The queue lists questions awaiting human review for your exams, in the
   order they matter most: open learner reports first, then the public
   samples (anyone can read their key), then the questions learners have been
   given most. **Start reviewing** opens the first one; after each decision the
   next one opens by itself, and **Skip** moves on without deciding.
4. The page shows the question as learners see it (stimulus, choices,
   screen-reader text) and the syllabus alignment (section, domain with its
   official share, skill, the taxonomy source). The keyed answer, the
   explanation, the note on every wrong choice and the AI blind solve stay
   hidden until you pick an answer (or choose to show it); if your answer
   differs from the key, the page says so. The review history and the
   publication log are in the side column.
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

## Recording decisions a reviewer returned (administrator)

Reviewers hired by the team often review outside the site: we send them a CSV,
they send it back with a decision on each row. **/admin/review/batch** records
those decisions in bulk. Nothing on that page lets anyone approve a question a
reviewer did not approve.

1. **Send.** Filter the questions awaiting review (exam, section, domain,
   whether and in which file they were already sent, the date the version was
   loaded) and **Download CSV**. Each file holds at most 1,000 questions; to
   send more, filter by *Never sent* and download again. The file has one row
   per question: `export_id`, `question_id`, `version`, `fingerprint`, the exam
   and taxonomy, the stimulus, instructions, stem, options, answer key,
   explanation and distractor notes, then three empty columns for the
   reviewer: `decision`, `reviewer_email`, `notes`. What each file contained
   (question versions and fingerprints) is recorded in `review_exports` and
   `review_export_items`.
2. **Ask the reviewer** to write `approved` in `decision` only when they
   checked all four of answer key, explanation, wording and syllabus
   alignment; `changes` with a note otherwise; and to leave it blank when they
   did not review that row. Other accepted spellings: yes/y/ok/sì/x/✓ and
   no/n/reject. Anything else makes the row unreadable, and it is refused.
   Excel may save the file with semicolons; that is read correctly.
3. **Record.** Upload the returned file under *Import a returned CSV* (it is
   read in the browser; only the id, version, fingerprint, export id, decision
   and reviewer email of each row reach the server, so files of thousands of
   rows stay under the hosting limits; split a file above 10,000 rows). Choose
   the reviewer, confirm the date they decided and that they told you they
   checked all four criteria on every approved row, and run the **dry run**.
   It reports, row by row, what would be approved and why every other row
   would not:
   - *changed since it was sent*: the question's current version or
     fingerprint differs from the file's, or from what the export recorded.
     The reviewer approved a different text, so it is refused; send it again;
   - *already approved*, *duplicate* (counted once), *contradicts another row*
     (all such rows refused), *no decision*, *marked for changes* (record those
     one at a time on the review page, with the reviewer's note), unreadable
     values, unknown ids, drafts and quarantined questions;
   - the reviewer rules of the review page: only exams the reviewer is
     authorised for, never their own work, and never over another reviewer's
     standing request for changes;
   - *no version, fingerprint or export*: a row we cannot tie to a text is
     refused.
   Then **Approve**, and confirm the count. Approvals are written 200 to a
   transaction; each chunk re-checks every question first, so one edited
   meanwhile is skipped, not approved.
4. **Or select.** For a list a reviewer returned some other way, select the
   questions on the same page (select all matching the filters, or shift-click
   ranges), **Record approvals**, describe where the decisions came from, and
   go through the same dry run and confirmation.

Each approval recorded this way has the reviewer's name and credentials, the
exact version and fingerprint, the date they decided, the batch
(`review_batches`: the file name and its SHA-256, or your description; the
export it answered) and you as `recorded_by`; the audit log has the same.
The question's review page says the approval was entered on the reviewer's
behalf. **/admin/review/batches** lists every batch; a batch recorded in error
(the wrong reviewer, the wrong file) is **withdrawn** there as a whole, with a
reason: its approvals stop counting at once and stay in the ledger, marked by
the withdrawn batch. You cannot record a batch in your own name, even if you
are also an authorised reviewer; approve on the review page instead.

The reviewer must still have their own account and have confirmed their
credentials line, exactly as for reviewing on the site. That confirmation is
their consent to being named.

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
  copied as they stood, and for decisions entered on a reviewer's behalf, the
  batch and the administrator who entered them.
- `review_batches`, `review_exports`, `review_export_items`: batches recorded
  on reviewers' behalf, and what was sent to reviewers.
- A reviewer's account export includes both. Deleting the account removes the
  authorisation; recorded decisions are kept, unlinked from the account, as the
  audit trail of what was approved (see docs/HUMAN-APPROVAL-ROLLOUT.md for the
  open privacy question).
