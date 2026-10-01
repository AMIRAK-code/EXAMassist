-- Operator migration: applies db/migrations/009_email_codes.sql to an EXISTING
-- EXAMassist PostgreSQL database (production on Supabase).
--
-- Run it once, as the schema owner, for example in the Supabase SQL editor,
-- BEFORE setting BREVO_API_KEY on the deployment: the email-code features stay
-- hidden until email is configured, and they need this table. The application's
-- own login (examer_app) has no DDL rights, so the app cannot apply it, and
-- `npm run db:migrate` / `db:seed` refuse to run against Postgres while this
-- row is missing from _migrations.
--
-- A database bootstrapped from db/postgres/schema.sql after this change
-- already has all of this: do not run it there.

BEGIN;
SET LOCAL search_path TO examer, pg_catalog;

ALTER TABLE users ADD COLUMN email_verified_at TEXT;

CREATE TABLE email_codes (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  -- 'sign-in' | 'reset-password' | 'verify-email'
  purpose      TEXT NOT NULL,
  email        TEXT NOT NULL,
  code_hash    TEXT NOT NULL,
  attempts     BIGINT NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL,
  expires_at   TEXT NOT NULL,
  consumed_at  TEXT
);

CREATE INDEX idx_email_codes_user ON email_codes (user_id, purpose, created_at);
CREATE INDEX idx_email_codes_expires ON email_codes (expires_at);

ALTER TABLE examer.email_codes ENABLE ROW LEVEL SECURITY;

-- The same table access the application login has everywhere else. If your
-- restricted login has a different name, change it here; the whole script
-- rolls back if the role does not exist.
GRANT SELECT, INSERT, UPDATE, DELETE ON examer.email_codes TO examer_app;

INSERT INTO _migrations (name, applied_at)
VALUES ('009_email_codes.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
