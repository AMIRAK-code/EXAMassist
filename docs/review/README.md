# Human review: who records what, and where

Written 2 November 2026. Nothing in this folder records a completed human review: **no reviewer exists yet**, for the question bank or for the public samples. Do not add one who is not a real, qualified person who has agreed in writing.

## Two kinds of content, two ledgers

| Content | Where it lives | Ledger | Procedure |
| --- | --- | --- | --- |
| Question bank (practice, diagnostics, simulations, the home page sample) | `content/questions/`, seeded into the database | Database tables `reviewers` and `question_reviews` (migration 014), through `/admin/reviewers` and `/admin/review` | [docs/EXPERT-REVIEW.md](../EXPERT-REVIEW.md), rollout in [docs/HUMAN-APPROVAL-ROLLOUT.md](../HUMAN-APPROVAL-ROLLOUT.md) |
| Worked samples on public pages: the Bocconi sample-questions guide, the TOLC hub in English and Italian | `src/lib/content/bocconi-sample-guide.ts`, `src/lib/exams/hub-content.ts`, `src/lib/exams/hub-content-it.ts` | `content/reviews/editorial-samples.json` (under version control) | This file |

The remote branch `feature/human-approval-and-official-scores` is fully merged into `main` (checked 2 November 2026: it has no commit that `main` lacks). Its work is the first row. It did not cover the public samples, which are not in the bank, nor Italian text: an approval in the bank covers the English original only.

## What each ledger records

| Requirement | Bank (`reviewers`, `question_reviews`) | Public samples (`editorial-samples.json`) |
| --- | --- | --- |
| Who the reviewer is | Their own account, `public_name` | `publicName` |
| Credentials | `public_credentials`, one line agreed with them | `publicCredentials`, in their own words |
| How the qualification was checked | Not recorded | `qualificationChecked`: a reference, not personal data |
| Consent to be named | `confirmed_at`: they confirm the line in the app before reviewing | `consent.givenOn`, `consent.record` (where the written confirmation is kept), `consent.publishName`, `consent.withdrawnOn` |
| Review date | `reviewed_on` | `reviewedOn` |
| Exact version reviewed | `question_version` and `review_fingerprint` (SHA-256 of the content) | `fingerprint` (SHA-256 of passage, stem, options, notes, key, working, lesson; `sampleFingerprint`) |
| The checks made | Answer key, explanation, wording, syllabus | The same four, plus translation for an Italian sample |
| Conflicts | The server refuses an author approving their own item | `authorAliases`; the procedure below |
| An edit after approval | The approval stops counting (fingerprint mismatch) | `tests/unit/sample-review.test.ts` fails until the approval is re-done or removed |
| Public claims | Shown per question only while the approval stands | The pages must say "no human subject expert has reviewed them" until every sample on the page has a standing approval (tested) |

Gaps that remain, for the owners:

1. **Bank reviewers: how a qualification was checked is not stored.** Keep it with the written consent (see below) until a column is added; adding one needs a migration on production, which this change does not make.
2. **Italian bank text is not human-reviewed** (docs/HUMAN-APPROVAL-ROLLOUT.md, open question 1). The Italian TOLC hub now says on the page that its translation awaits a fluent reviewer.
3. **The privacy notice does not mention reviewers.** Before the first reviewer is named on the site, add a short section saying what is published about them and how to withdraw. That is a change to legal text: owners decide the wording.

## Reviewing the public samples

1. **Find a reviewer.** For the Bocconi samples: someone who teaches or tutors mathematics and reasoning at upper-secondary or first-year level, with no part in writing them. For the TOLC samples: the same for mathematics, logic and sciences; for the Italian page also a native or fluent Italian reader (a liceo teacher is ideal). One person can do both if qualified. Never an AI, a placeholder or one of the authors.
2. **Agree terms in writing** (email is enough): what they review, whether they are paid, and that we publish only the name and credentials line they write, with the date, and remove both if they withdraw. Keep that email in the support mailbox; the ledger stores only a reference to it.
3. **Send the package.** Generate it fresh, so the fingerprints match the text: `npx tsx scripts/sample-review-package.ts`. The 2 November 2026 package is [packages/2026-11-02-bocconi-tolc-samples.md](packages/2026-11-02-bocconi-tolc-samples.md) (27 samples: 11 Bocconi, 8 TOLC in English, 8 TOLC in Italian). It contains the reviewer declaration, the checks and a decisions table.
4. **Record what they return** in `content/reviews/editorial-samples.json`: one entry in `reviewers` (from their declaration), one entry in `reviews` per decision, copying the full fingerprint from the package. A request for changes needs their note.
5. **Edit what they asked to change**, regenerate the package and send them the new text; their earlier approval does not carry over to changed text.
6. **Only then change the pages.** When every sample on a page has a standing approval (`currentApproval`), replace the "no human subject expert has reviewed them" sentence with one naming the reviewer, their credentials line and the date, and for the Italian page remove `translationNote` once the translation check is approved. `npm test` holds the pages to this.

### Ledger entry, for reference

```json
{
  "reviewers": [
    {
      "id": "firstname-lastname",
      "publicName": "As the reviewer wrote it",
      "publicCredentials": "In the reviewer's words, e.g. Mathematics teacher, liceo scientifico, 12 years",
      "subjects": ["mathematics", "logic"],
      "languages": ["en", "it"],
      "consent": { "givenOn": "2026-11-20", "record": "support mailbox, thread 'Sample review terms', 2026-11-20", "publishName": true, "withdrawnOn": null },
      "qualificationChecked": "School staff page, checked 2026-11-20",
      "authorAliases": []
    }
  ],
  "reviews": [
    {
      "page": "hub:cisia-tolc:it",
      "sampleId": "tolc-sample-ratio",
      "fingerprint": "<64 hex characters, from the package>",
      "reviewerId": "firstname-lastname",
      "reviewedOn": "2026-11-25",
      "outcome": "approved",
      "checks": { "answerKey": true, "explanation": true, "wording": true, "syllabus": true, "translation": true },
      "notes": ""
    }
  ]
}
```

The values above are an example of the shape only. Do not commit them.
