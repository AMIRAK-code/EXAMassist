-- Operator migration: applies db/migrations/014_human_review.sql to an
-- EXISTING EXAMassist PostgreSQL database (production on Supabase).
--
-- Run it once, as the schema owner (for example in the Supabase SQL editor).
-- It only adds a column and two tables, so code that predates it keeps working
-- unchanged. The order relative to the content seed and the deploy is in
-- docs/HUMAN-APPROVAL-ROLLOUT.md: the code that reads these tables serves NO
-- question until reviewers have approved some, so read that first.
--
-- A database bootstrapped from db/postgres/schema.sql after this change
-- already has all of this: do not run it there.

BEGIN;
SET LOCAL search_path TO examer, pg_catalog;

ALTER TABLE question_versions ADD COLUMN review_fingerprint TEXT;

CREATE TABLE reviewers (
  user_id              TEXT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  public_name          TEXT NOT NULL,
  public_credentials   TEXT NOT NULL,
  exam_keys_json       TEXT NOT NULL,
  author_aliases_json  TEXT NOT NULL DEFAULT '[]',
  granted_by           TEXT NOT NULL,
  granted_at           TEXT NOT NULL,
  confirmed_at         TEXT,
  revoked_at           TEXT,
  revoked_by           TEXT,
  revoke_reason        TEXT,
  updated_at           TEXT NOT NULL
);

CREATE TABLE question_reviews (
  id                    TEXT PRIMARY KEY,
  question_id           TEXT NOT NULL,
  question_version_id   TEXT NOT NULL REFERENCES question_versions (id),
  question_version      BIGINT NOT NULL,
  review_fingerprint    TEXT NOT NULL,
  exam_key              TEXT NOT NULL,
  reviewer_user_id      TEXT REFERENCES users (id) ON DELETE SET NULL,
  reviewer_name         TEXT NOT NULL,
  reviewer_credentials  TEXT NOT NULL,
  outcome               TEXT NOT NULL,
  checked_json          TEXT NOT NULL,
  notes                 TEXT,
  reviewed_on           TEXT NOT NULL,
  created_at            TEXT NOT NULL
);
CREATE INDEX idx_question_reviews_version ON question_reviews (question_version_id, created_at);
CREATE INDEX idx_question_reviews_question ON question_reviews (question_id, created_at);
CREATE INDEX idx_question_reviews_reviewer ON question_reviews (reviewer_user_id, created_at);

ALTER TABLE examer.reviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.question_reviews ENABLE ROW LEVEL SECURITY;

-- The same table access the application login has everywhere else. If your
-- restricted login has a different name, change it here; the whole script
-- rolls back if the role does not exist. The ledger is append-only in the
-- application; the login keeps the usual rights so account deletion can unlink
-- a reviewer (ON DELETE SET NULL).
GRANT SELECT, INSERT, UPDATE, DELETE ON examer.reviewers, examer.question_reviews TO examer_app;
CREATE POLICY backend_access ON examer.reviewers FOR ALL TO examer_app USING (true) WITH CHECK (true);
CREATE POLICY backend_access ON examer.question_reviews FOR ALL TO examer_app USING (true) WITH CHECK (true);

INSERT INTO _migrations (name, applied_at)
VALUES ('014_human_review.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
