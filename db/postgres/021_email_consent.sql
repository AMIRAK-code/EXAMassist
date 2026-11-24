-- Operator migration: applies db/migrations/021_email_consent.sql to an
-- EXISTING EXAMassist PostgreSQL database (production on Supabase).
--
-- Run it once, as the schema owner, in the Supabase SQL editor: paste the
-- whole file and run it with nothing selected. It MUST run before the code
-- that asks for email consent at sign-up is deployed: from that code on,
-- sign-up, the account page and the admin users page read and write these
-- columns and fail without them. It only adds two nullable columns, so the
-- code already running keeps working after it. The application's own login
-- (examer_app) has no DDL rights, so the app cannot apply it.
--
-- A database bootstrapped from db/postgres/schema.sql after this change
-- already has all of this: do not run it there.

BEGIN;
SET LOCAL search_path TO examer, pg_catalog;

ALTER TABLE examer.users ADD COLUMN account_email_consent_at TEXT;
ALTER TABLE examer.users ADD COLUMN news_consent_at TEXT;

INSERT INTO examer._migrations (name, applied_at)
VALUES ('021_email_consent.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
