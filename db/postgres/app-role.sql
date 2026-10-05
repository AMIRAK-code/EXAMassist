-- The restricted login the application connects as, for a database bootstrapped
-- from db/postgres/schema.sql. Run it once, as the schema owner (for example in
-- the Supabase SQL editor), right after schema.sql.
--
-- examer_app can read and write the examer schema's tables and nothing else: no
-- DDL, no other schemas, and row-level security still applies (each table gets
-- one policy that lets this login, and only this login, through). _migrations
-- is read-only to it, so the app can check which migrations ran but not change
-- that record.
--
-- Replace the password below with a SCRAM-SHA-256 verifier (or a long random
-- password) before running it, and never commit the real value. With a
-- verifier, the plaintext password never has to leave your machine. The app
-- then connects as examer_app.<project-ref> through the Supabase pooler.

BEGIN;

CREATE ROLE examer_app LOGIN NOCREATEDB NOCREATEROLE NOBYPASSRLS
  PASSWORD 'SCRAM-SHA-256$4096:<salt>$<stored-key>:<server-key>';

GRANT USAGE ON SCHEMA examer TO examer_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA examer TO examer_app;
REVOKE INSERT, UPDATE, DELETE ON examer._migrations FROM examer_app;
GRANT SELECT, USAGE ON ALL SEQUENCES IN SCHEMA examer TO examer_app;

DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'examer' LOOP
    EXECUTE format('CREATE POLICY backend_access ON examer.%I FOR ALL TO examer_app USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

COMMIT;
