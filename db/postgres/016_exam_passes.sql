-- Operator migration: applies db/migrations/016_exam_passes.sql to an
-- EXISTING EXAMassist PostgreSQL database (production on Supabase).
--
-- Run it once, as the schema owner (for example in the Supabase SQL editor),
-- AFTER 012_stripe_subscriptions.sql and BEFORE deploying the code that reads
-- the table: the pricing, checkout, account and entitlement code query it. It
-- only adds a table; no existing row is changed.
--
-- A database bootstrapped from db/postgres/schema.sql after this change
-- already has all of this: do not run it there.

BEGIN;
SET LOCAL search_path TO examer, pg_catalog;

CREATE TABLE billing_passes (
  stripe_invoice_id        TEXT PRIMARY KEY,
  user_id                  TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  stripe_customer_id       TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  plan                     TEXT NOT NULL,
  exam_key                 TEXT NOT NULL,
  price_lookup_key         TEXT NOT NULL,
  amount                   BIGINT NOT NULL,
  currency                 TEXT NOT NULL,
  status                   TEXT NOT NULL,
  access_starts_at         TEXT,
  access_ends_at           TEXT,
  withdrawal_waiver_at     TEXT,
  source_exam              TEXT,
  stripe_synced_at         BIGINT NOT NULL DEFAULT 0,
  created_at               TEXT NOT NULL,
  updated_at               TEXT NOT NULL
);
CREATE INDEX idx_billing_passes_user ON billing_passes (user_id, status);
CREATE INDEX idx_billing_passes_payment_intent ON billing_passes (stripe_payment_intent_id);

ALTER TABLE examer.billing_passes ENABLE ROW LEVEL SECURITY;

-- The same table access the application login has everywhere else. If your
-- restricted login has a different name, change it here; the whole script
-- rolls back if the role does not exist.
GRANT SELECT, INSERT, UPDATE, DELETE ON examer.billing_passes TO examer_app;
CREATE POLICY backend_access ON examer.billing_passes FOR ALL TO examer_app USING (true) WITH CHECK (true);

INSERT INTO _migrations (name, applied_at)
VALUES ('016_exam_passes.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
