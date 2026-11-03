-- Operator migration: applies db/migrations/019_access_grants.sql to an
-- EXISTING EXAMassist PostgreSQL database (production on Supabase).
--
-- Run it once, as the schema owner, in the Supabase SQL editor: paste the
-- whole file and run it with nothing selected. Until it runs, the admin users
-- page cannot give access (it says so) and nobody has hand-given access; the
-- rest of the site works as before. The application's own login (examer_app)
-- has no DDL rights, so the app cannot apply it, and `npm run db:migrate` /
-- `db:seed` refuse to run against Postgres while this row is missing from
-- _migrations.
--
-- A database bootstrapped from db/postgres/schema.sql after this change
-- already has all of this: do not run it there.

BEGIN;
SET LOCAL search_path TO examer, pg_catalog;

CREATE TABLE examer.access_grants (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES examer.users (id) ON DELETE CASCADE,
  plan         TEXT NOT NULL,
  exam_key     TEXT,
  starts_at    TEXT NOT NULL,
  ends_at      TEXT NOT NULL,
  reason       TEXT NOT NULL,
  granted_by   TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  revoked_at   TEXT,
  revoked_by   TEXT
);

CREATE INDEX idx_access_grants_user ON examer.access_grants (user_id);

ALTER TABLE examer.access_grants ENABLE ROW LEVEL SECURITY;

-- The same table access the application login has everywhere else. If your
-- restricted login has a different name, change it here; the whole script
-- rolls back if the role does not exist.
GRANT SELECT, INSERT, UPDATE, DELETE ON examer.access_grants TO examer_app;
-- Row-level security is on and examer_app does not bypass it, so without this
-- policy every read would come back empty and every write would be refused.
CREATE POLICY backend_access ON examer.access_grants FOR ALL TO examer_app USING (true) WITH CHECK (true);

INSERT INTO examer._migrations (name, applied_at)
VALUES ('019_access_grants.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
