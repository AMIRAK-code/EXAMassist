-- 014_human_review.sql - mandatory human approval of every served question
-- (src/lib/content/human-review.ts, docs/EXPERT-REVIEW.md).
--
-- Every question is AI-assisted and blind-solved by a separate AI reviewer
-- before it may be published. Neither is human review. From this migration on
-- a question version is served to a NEW session only while a named, authorised
-- human reviewer's approval of that exact version and that exact content is on
-- record. Attempts already made keep the question versions they pinned; none
-- of this touches them.

-- A fingerprint of everything a learner sees or is scored against: the stem,
-- instructions, choices, answer key, explanation, distractor notes,
-- accessibility text, taxonomy tags (syllabus alignment), difficulty and the
-- stimulus. Written by the seeder from the content file. An approval names the
-- fingerprint it saw, so editing the content without bumping the version still
-- drops the approval. NULL on rows seeded before this migration: such a row
-- matches no approval until it is re-seeded.
ALTER TABLE question_versions ADD COLUMN review_fingerprint TEXT;

-- People authorised to approve questions. An administrator grants the
-- authorisation with the public wording of the reviewer's credentials; the
-- reviewer then confirms, signed in to their own account, that the wording is
-- accurate and may be shown publicly. Until confirmed, they cannot review.
CREATE TABLE reviewers (
  user_id              TEXT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  public_name          TEXT NOT NULL,
  -- One line, shown publicly next to an approval: "Mathematics teacher,
  -- liceo scientifico, 12 years".
  public_credentials   TEXT NOT NULL,
  -- JSON array of exam keys this person may approve.
  exam_keys_json       TEXT NOT NULL,
  -- JSON array of the names this person writes or edits content under (the
  -- `authoredBy` / `review.author` strings in content files), so they can never
  -- approve their own work.
  author_aliases_json  TEXT NOT NULL DEFAULT '[]',
  granted_by           TEXT NOT NULL,
  granted_at           TEXT NOT NULL,
  confirmed_at         TEXT,
  revoked_at           TEXT,
  revoked_by           TEXT,
  revoke_reason        TEXT,
  updated_at           TEXT NOT NULL
);

-- The review ledger. Append-only: a decision is never edited or deleted, a
-- later decision is a new row. Reviewer name and credentials are copied as
-- they stood when the decision was made, so the public record does not change
-- if the profile later does.
CREATE TABLE question_reviews (
  id                    TEXT PRIMARY KEY,
  question_id           TEXT NOT NULL,
  question_version_id   TEXT NOT NULL REFERENCES question_versions (id),
  question_version      INTEGER NOT NULL,
  review_fingerprint    TEXT NOT NULL,
  exam_key              TEXT NOT NULL,
  -- NULL only if the reviewer later deleted their account; the decision stays.
  reviewer_user_id      TEXT REFERENCES users (id) ON DELETE SET NULL,
  reviewer_name         TEXT NOT NULL,
  reviewer_credentials  TEXT NOT NULL,
  outcome               TEXT NOT NULL,         -- approved | changes_requested
  -- JSON array of what the reviewer checked: answer-key, explanation, wording,
  -- syllabus-alignment. An approval must list all four.
  checked_json          TEXT NOT NULL,
  notes                 TEXT,
  reviewed_on           TEXT NOT NULL,         -- YYYY-MM-DD, the day of the decision
  created_at            TEXT NOT NULL
);
CREATE INDEX idx_question_reviews_version ON question_reviews (question_version_id, created_at);
CREATE INDEX idx_question_reviews_question ON question_reviews (question_id, created_at);
CREATE INDEX idx_question_reviews_reviewer ON question_reviews (reviewer_user_id, created_at);
