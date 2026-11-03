-- Operator migration: applies db/migrations/018_google_sign_in.sql to an
-- EXISTING EXAMassist PostgreSQL database (production on Supabase).
--
-- Run it once, as the schema owner, for example in the Supabase SQL editor,
-- BEFORE setting GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the deployment:
-- the "Continue with Google" button stays hidden until both are set, and the
-- sign-in needs these tables. The application's own login (examer_app) has no
-- DDL rights, so the app cannot apply it, and `npm run db:migrate` / `db:seed`
-- refuse to run against Postgres while this row is missing from _migrations.
--
-- A database bootstrapped from db/postgres/schema.sql after this change
-- already has all of this: do not run it there.

BEGIN;
SET LOCAL search_path TO examer, pg_catalog;

CREATE TABLE oauth_identities (
  -- 'google'
  provider      TEXT NOT NULL,
  -- The provider's subject identifier (`sub` in the ID token).
  subject       TEXT NOT NULL,
  user_id       TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  created_at    TEXT NOT NULL,
  last_used_at  TEXT NOT NULL,
  PRIMARY KEY (provider, subject)
);

CREATE UNIQUE INDEX idx_oauth_identities_user ON oauth_identities (user_id, provider);

CREATE TABLE oauth_requests (
  id             TEXT PRIMARY KEY,
  provider       TEXT NOT NULL,
  code_verifier  TEXT NOT NULL,
  nonce_hash     TEXT NOT NULL,
  next_path      TEXT,
  locale         TEXT NOT NULL,
  created_at     TEXT NOT NULL,
  expires_at     TEXT NOT NULL,
  consumed_at    TEXT
);

CREATE INDEX idx_oauth_requests_expires ON oauth_requests (expires_at);

ALTER TABLE examer.oauth_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.oauth_requests ENABLE ROW LEVEL SECURITY;

-- The same table access the application login has everywhere else. If your
-- restricted login has a different name, change it here; the whole script
-- rolls back if the role does not exist.
GRANT SELECT, INSERT, UPDATE, DELETE ON examer.oauth_identities TO examer_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON examer.oauth_requests TO examer_app;
-- Row-level security is on and examer_app does not bypass it, so without these
-- policies every read would come back empty and every write would be refused.
CREATE POLICY backend_access ON examer.oauth_identities FOR ALL TO examer_app USING (true) WITH CHECK (true);
CREATE POLICY backend_access ON examer.oauth_requests FOR ALL TO examer_app USING (true) WITH CHECK (true);

INSERT INTO _migrations (name, applied_at)
VALUES ('018_google_sign_in.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
