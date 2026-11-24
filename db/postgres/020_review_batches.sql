-- Operator migration: applies db/migrations/020_review_batches.sql to an
-- EXISTING EXAMassist PostgreSQL database (production on Supabase).
--
-- Run it once, as the schema owner, in the Supabase SQL editor: paste the
-- whole file and run it with nothing selected. It MUST run before the code
-- that records approvals in batches is deployed: from that code on, every
-- query that decides which questions are served reads
-- question_reviews.batch_id and review_batches, and fails without them. It
-- only adds tables and two nullable columns, so the code already running
-- keeps working after it. The application's own login (examer_app) has no DDL
-- rights, so the app cannot apply it, and `npm run db:migrate` /
-- `db:seed` refuse to run against Postgres while this row is missing from
-- _migrations.
--
-- A database bootstrapped from db/postgres/schema.sql after this change
-- already has all of this: do not run it there.

BEGIN;
SET LOCAL search_path TO examer, pg_catalog;

CREATE TABLE examer.review_exports (
  id            TEXT PRIMARY KEY,
  file_name     TEXT NOT NULL,
  filter_json   TEXT NOT NULL,
  item_count    BIGINT NOT NULL,
  created_by    TEXT NOT NULL,
  created_at    TEXT NOT NULL
);

CREATE TABLE examer.review_export_items (
  export_id            TEXT NOT NULL REFERENCES examer.review_exports (id),
  question_id          TEXT NOT NULL,
  question_version_id  TEXT NOT NULL,
  question_version     BIGINT NOT NULL,
  review_fingerprint   TEXT NOT NULL,
  PRIMARY KEY (export_id, question_id)
);
CREATE INDEX idx_review_export_items_question ON examer.review_export_items (question_id);

CREATE TABLE examer.review_batches (
  id                    TEXT PRIMARY KEY,
  source                TEXT NOT NULL,
  source_name           TEXT NOT NULL,
  source_sha256         TEXT,
  export_id             TEXT REFERENCES examer.review_exports (id),
  reviewer_user_id      TEXT REFERENCES examer.users (id) ON DELETE SET NULL,
  reviewer_name         TEXT NOT NULL,
  recorded_by           TEXT NOT NULL,
  reviewed_on           TEXT NOT NULL,
  approved_count        BIGINT NOT NULL DEFAULT 0,
  created_at            TEXT NOT NULL,
  withdrawn_at          TEXT,
  withdrawn_by          TEXT,
  withdraw_reason       TEXT
);
CREATE INDEX idx_review_batches_created ON examer.review_batches (created_at);

ALTER TABLE examer.question_reviews ADD COLUMN batch_id TEXT REFERENCES examer.review_batches (id);
ALTER TABLE examer.question_reviews ADD COLUMN recorded_by TEXT;
CREATE INDEX idx_question_reviews_batch ON examer.question_reviews (batch_id);

ALTER TABLE examer.review_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.review_export_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.review_batches ENABLE ROW LEVEL SECURITY;

-- The same table access the application login has everywhere else. If your
-- restricted login has a different name, change it here; the whole script
-- rolls back if the role does not exist.
GRANT SELECT, INSERT, UPDATE, DELETE ON examer.review_exports, examer.review_export_items, examer.review_batches TO examer_app;
-- Row-level security is on and examer_app does not bypass it, so without these
-- policies every read would come back empty and every write would be refused.
CREATE POLICY backend_access ON examer.review_exports FOR ALL TO examer_app USING (true) WITH CHECK (true);
CREATE POLICY backend_access ON examer.review_export_items FOR ALL TO examer_app USING (true) WITH CHECK (true);
CREATE POLICY backend_access ON examer.review_batches FOR ALL TO examer_app USING (true) WITH CHECK (true);

INSERT INTO examer._migrations (name, applied_at)
VALUES ('020_review_batches.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
