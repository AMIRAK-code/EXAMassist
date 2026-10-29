-- Operator migration: applies db/migrations/015_official_practice_scores.sql
-- to an EXISTING EXAMassist PostgreSQL database (production on Supabase).
--
-- Run it once, as the schema owner (for example in the Supabase SQL editor),
-- BEFORE deploying the code that reads the table: the account export and the
-- official-scores pages query it. It only adds a table.
--
-- A database bootstrapped from db/postgres/schema.sql after this change
-- already has all of this: do not run it there.

BEGIN;
SET LOCAL search_path TO examer, pg_catalog;

CREATE TABLE official_practice_scores (
  id                   TEXT PRIMARY KEY,
  user_id              TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  exam_key             TEXT NOT NULL,
  scale_key            TEXT NOT NULL,
  provider_key         TEXT NOT NULL,
  test_name            TEXT NOT NULL,
  taken_on             TEXT NOT NULL,
  overall_score        DOUBLE PRECISION,
  section_scores_json  TEXT NOT NULL DEFAULT '{}',
  notes                TEXT,
  created_at           TEXT NOT NULL,
  updated_at           TEXT NOT NULL
);
CREATE INDEX idx_official_scores_user ON official_practice_scores (user_id, exam_key, taken_on);

ALTER TABLE examer.official_practice_scores ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON examer.official_practice_scores TO examer_app;
CREATE POLICY backend_access ON examer.official_practice_scores FOR ALL TO examer_app USING (true) WITH CHECK (true);

INSERT INTO _migrations (name, applied_at)
VALUES ('015_official_practice_scores.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
