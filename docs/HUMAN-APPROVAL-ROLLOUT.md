# Rolling out mandatory human approval (migrations 014 and 015)

Prepared 2026-10-28/29. Nothing here has been applied to production.

## What changes when this code is deployed

- **New sessions draw only on human-approved questions.** A question needs a
  standing approval of its exact current content by an authorised reviewer
  (docs/EXPERT-REVIEW.md). There is no grandfathering: an AI blind solve, a
  `published` state or a past "reviewer" field in a content file does not
  count.
- **Public sample questions** (home page, exam hubs) are shown only once
  approved.
- **Counts on public pages** ("N reviewed questions", open formats) count only
  approved questions.
- **Nothing already started changes.** Attempts keep the question versions
  they pinned; results, review pages, retries of questions that are still
  approved, exports and the mistake notebook keep working.

## Dry run

`npm run content:coverage -- --write` over the content in this checkout, with
the ledger empty as it is right after migration 014. Full table:
[docs/coverage/HUMAN-APPROVAL-DRY-RUN.md](coverage/HUMAN-APPROVAL-DRY-RUN.md).

| | Today | Strict policy, empty ledger |
| --- | ---: | ---: |
| Published questions (13 live exams) | 963 | 963 |
| Questions served to new sessions | 963 | **0** |
| Open practice formats (rule-allowed) | 66 | **0** |
| Public sample questions shown | 6 | **0** |

Every exam, every format, the free test included, closes until reviewers
approve enough questions. The practice and exam pages say so honestly ("0
reviewed questions", "Not yet"), and the review queue shows what is waiting.
The pages verified in a local copy behave exactly like this.

What reopens a format is set out per exam in
[docs/coverage/AUTHORING-BACKLOG.md](coverage/AUTHORING-BACKLOG.md): for most
formats, approving questions already written is enough (the "pending review"
column); the rest needs new content.

## The decision for you: when to switch it on

The rule is not behind a flag. Deploying this code switches it on. Two
workable orders:

**A. Approve first, then deploy (recommended).** Production keeps the current
code, which ignores the new tables, while reviewers work.

1. Apply `db/postgres/014_human_review.sql` and
   `db/postgres/015_official_practice_scores.sql` in the Supabase SQL editor,
   as the schema owner. Both only add; the live code is unaffected.
2. Give existing rows their fingerprints (production's `db:seed` stays blocked
   while migration 012 is pending):

       npx tsx scripts/backfill-review-fingerprints.ts --target=production
       npx tsx scripts/backfill-review-fingerprints.ts --apply --target=production

3. Run this code somewhere reviewers can reach that is **not** uniexamer.com,
   against the production database: a Worker preview/version not routed to the
   domain, or a machine you control. Authorise reviewers at `/admin/reviewers`;
   they approve at `/admin/review`; watch `/admin/coverage`.
4. When the formats you care about are open on `/admin/coverage`, deploy as
   usual (`npm run cf:deploy` from a clean checkout). The static snapshot is
   taken at deploy, so public pages then show the approved counts.

**B. Deploy now and accept the gap.** Apply 014 and 015, run the fingerprint
backfill, deploy. Practice is closed for everyone until approvals arrive;
public pages say "0 reviewed questions".

Either way 015 must be applied before the deploy: the official-scores pages
read its table.

## Not to do

- Do not insert approvals by SQL, import a list of "already reviewed" items, or
  authorise an account that is not a real, qualified person. The test fixture
  in `tests/e2e/approve-fixture.ts` writes synthetic approvals, and it refuses
  any database other than `tmp/e2e.db`.
- Do not edit a question's text in the database. The review page will refuse
  to approve a row whose text no longer matches its fingerprint; edit the JSON
  file and re-seed instead.

## Open questions for you

1. **Translations.** An approval covers the English original. Italian versions
   are still served after their existing translation check (not a human expert
   review), and the review line says the reviewer approved the English
   original. If Italian text should need human approval too, the fingerprint
   must include it and reviewers must read Italian.
2. **Reviewer records after account deletion.** Decisions are kept with the
   reviewer's public name and credentials as the audit trail
   (`ON DELETE SET NULL`). The privacy notice does not mention reviewers yet;
   this needs the same legal review as the rest of the notice.
3. **Who reviews, and for which exams.** No reviewer exists. The backlog says
   how many approvals each exam needs to reopen each format.
4. **Seeding after approvals.** Once 012 is applied and `npm run db:seed` runs
   again, it recomputes every fingerprint from the files. Any question whose
   file differs from what production serves loses its approval at that point,
   correctly; check the "content changed" entries in the review queue's log.
