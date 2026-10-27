-- Operator migration: applies db/migrations/010_billing.sql to an EXISTING
-- EXAMassist PostgreSQL database (production on Supabase).
--
-- Run it once, as the schema owner, for example in the Supabase SQL editor,
-- BEFORE deploying the code that sells Premium: every session start reads
-- this table once STRIPE_SECRET_KEY is set. The application's own login
-- (examer_app) has no DDL rights, so the app cannot apply it.
--
-- A database bootstrapped from db/postgres/schema.sql after this change
-- already has all of this: do not run it there.

BEGIN;
SET LOCAL search_path TO examer, pg_catalog;

CREATE TABLE subscriptions (
  user_id                TEXT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  stripe_customer_id     TEXT NOT NULL UNIQUE,
  stripe_subscription_id TEXT,
  plan                   TEXT,
  status                 TEXT,
  current_period_end     TEXT,
  cancel_at_period_end   BIGINT NOT NULL DEFAULT 0,
  created_at             TEXT NOT NULL,
  updated_at             TEXT NOT NULL
);

ALTER TABLE examer.subscriptions ENABLE ROW LEVEL SECURITY;

-- The same table access the application login has everywhere else. If your
-- restricted login has a different name, change it here; the whole script
-- rolls back if the role does not exist.
GRANT SELECT, INSERT, UPDATE, DELETE ON examer.subscriptions TO examer_app;
CREATE POLICY backend_access ON examer.subscriptions FOR ALL TO examer_app USING (true) WITH CHECK (true);

INSERT INTO _migrations (name, applied_at)
VALUES ('010_billing.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
