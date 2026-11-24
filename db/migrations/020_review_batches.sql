-- 020_review_batches.sql - approvals recorded in bulk on a reviewer's behalf
-- (src/lib/content/review-batches.ts, docs/EXPERT-REVIEW.md).
--
-- Reviewers hired by the team decide on questions sent to them as CSV files
-- and send the files back. An administrator then records those decisions: the
-- approval still names the reviewer who made it, for the exact question
-- version and content fingerprint the reviewer saw, and it also records WHO
-- entered it and FROM WHAT (the returned file, or a selection on the admin
-- screen). A batch can be withdrawn as a whole if it was recorded in error.

-- What went out to reviewers: one row per export file, and the exact question
-- versions and fingerprints in it, so a returned file can be checked against
-- the text that was actually sent, and the batch screen can filter by export.
CREATE TABLE review_exports (
  id            TEXT PRIMARY KEY,
  file_name     TEXT NOT NULL,
  -- The filters the administrator used, as JSON.
  filter_json   TEXT NOT NULL,
  item_count    INTEGER NOT NULL,
  -- The administrator's user id. No foreign key: the record outlives a staff
  -- account that is later deleted.
  created_by    TEXT NOT NULL,
  created_at    TEXT NOT NULL
);

CREATE TABLE review_export_items (
  export_id            TEXT NOT NULL REFERENCES review_exports (id),
  question_id          TEXT NOT NULL,
  question_version_id  TEXT NOT NULL,
  question_version     INTEGER NOT NULL,
  review_fingerprint   TEXT NOT NULL,
  PRIMARY KEY (export_id, question_id)
);
CREATE INDEX idx_review_export_items_question ON review_export_items (question_id);

-- One recorded batch of approvals.
CREATE TABLE review_batches (
  id                    TEXT PRIMARY KEY,
  -- 'csv' (a returned file) or 'selection' (chosen on the admin screen).
  source                TEXT NOT NULL,
  -- The returned file's name, or the administrator's description of where
  -- the decisions came from ("Approved list e-mailed by Prof. Rossi, 12 Nov").
  source_name           TEXT NOT NULL,
  -- SHA-256 of the returned file, so the exact file can be identified later.
  source_sha256         TEXT,
  -- The export the file answered, when known.
  export_id             TEXT REFERENCES review_exports (id),
  -- The reviewer whose decisions these are. NULL only if they later deleted
  -- their account; their name and credentials stay on each decision.
  reviewer_user_id      TEXT REFERENCES users (id) ON DELETE SET NULL,
  reviewer_name         TEXT NOT NULL,
  -- The administrator who entered the batch: never the reviewer of record.
  recorded_by           TEXT NOT NULL,
  -- The day the reviewer made the decisions (YYYY-MM-DD).
  reviewed_on           TEXT NOT NULL,
  approved_count        INTEGER NOT NULL DEFAULT 0,
  created_at            TEXT NOT NULL,
  -- Withdrawing a batch makes every approval in it stop counting. The
  -- decisions themselves stay in the ledger.
  withdrawn_at          TEXT,
  withdrawn_by          TEXT,
  withdraw_reason       TEXT
);
CREATE INDEX idx_review_batches_created ON review_batches (created_at);

-- Which batch a decision came from (NULL: recorded by the reviewer on their
-- own account), and who entered it when that was not the reviewer.
ALTER TABLE question_reviews ADD COLUMN batch_id TEXT REFERENCES review_batches (id);
ALTER TABLE question_reviews ADD COLUMN recorded_by TEXT;
CREATE INDEX idx_question_reviews_batch ON question_reviews (batch_id);
