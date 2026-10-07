# Recording a human expert review

Every question is AI-assisted, and before publication a separate AI reviewer
solves it blind. That is not human review, and the site says so. When a
qualified person actually reviews a question, record it here so the site can
say so too, for that question only.

## What counts

- A named person who read the question themselves, at a specific version.
- Credentials that may be shown publicly, in one line: "Mathematics teacher,
  liceo scientifico, 12 years" or "Bocconi BSc graduate, private tutor for the
  Bocconi test since 2021". No invented titles; ask the reviewer to approve the
  wording.
- Only what they checked: `answer-key`, `explanation`, `wording`,
  `syllabus-alignment`. The site names exactly these and nothing more.

## How to record it

Add an entry to `content/expert-reviews.json`:

```json
{
  "questionId": "bocconi-ug-prob-bayes-machines-010",
  "examKey": "bocconi-undergraduate",
  "version": 2,
  "reviewer": { "name": "…", "credentials": "…" },
  "reviewedOn": "2026-10-20",
  "checked": ["answer-key", "explanation", "syllabus-alignment"],
  "outcome": "approved",
  "notes": "Optional, internal."
}
```

`version` is the `version` field of the question file at the time of review.
Then run `npm run verify`, which checks that the question and version exist.

If the reviewer asks for changes, record `"outcome": "changes-requested"`,
make the change (which bumps the question's version), and record a new
`approved` entry once they have read the new version.

## What the site shows

- The question review page (after a session) names the reviewer, their
  credentials, the date and what they checked, but only while the question is
  still at the reviewed version. An edit makes the review stale; validation
  then warns, and the line disappears until the new version is reviewed.
- The Bocconi page counts questions with a current approved review. With none
  recorded, it says that none has had a human expert review.
- Nothing else: no badges on unreviewed questions, no "expert-written" copy.
