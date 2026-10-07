-- Operator migration: applies db/migrations/011_funnel_counts.sql to an
-- EXISTING EXAMassist PostgreSQL database (production on Supabase).
--
-- Run it once, as the schema owner (for example in the Supabase SQL editor).
-- The code that writes these counts tolerates the table being absent, so the
-- order relative to a deploy does not matter, but `npm run db:seed` refuses to
-- run against PostgreSQL until it is applied.
--
-- A database bootstrapped from db/postgres/schema.sql after this change
-- already has all of this: do not run it there.

BEGIN;
SET LOCAL search_path TO examer, pg_catalog;

CREATE TABLE funnel_counts (
  day     TEXT NOT NULL,
  event   TEXT NOT NULL,
  subject TEXT NOT NULL,
  source  TEXT NOT NULL,
  count   BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (day, event, subject, source)
);

ALTER TABLE examer.funnel_counts ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON examer.funnel_counts TO examer_app;
CREATE POLICY backend_access ON examer.funnel_counts FOR ALL TO examer_app USING (true) WITH CHECK (true);

INSERT INTO _migrations (name, applied_at)
VALUES ('011_funnel_counts.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
