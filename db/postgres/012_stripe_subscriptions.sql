-- Operator migration: applies db/migrations/012_stripe_subscriptions.sql to an
-- EXISTING EXAMassist PostgreSQL database (production on Supabase).
--
-- Run it once, as the schema owner (for example in the Supabase SQL editor),
-- AFTER deploying the code that reads these tables and BEFORE setting
-- BILLING_ENFORCED=true. The order is in docs/BILLING.md ("Rolling out").
-- The application's own login (examer_app) has no DDL rights, so the app
-- cannot apply it.
--
-- It copies the Premium customers and subscriptions stored by 010 into the
-- new tables (every Premium plan becomes all_access) and then drops the old
-- table, all in one transaction.
--
-- A database bootstrapped from db/postgres/schema.sql after this change
-- already has all of this: do not run it there.

BEGIN;
SET LOCAL search_path TO examer, pg_catalog;

CREATE TABLE billing_customers (
  user_id            TEXT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  created_at         TEXT NOT NULL,
  updated_at         TEXT NOT NULL
);

CREATE TABLE billing_subscriptions (
  stripe_subscription_id TEXT PRIMARY KEY,
  user_id                TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  stripe_customer_id     TEXT NOT NULL,
  plan                   TEXT NOT NULL,
  exam_key               TEXT,
  status                 TEXT NOT NULL,
  price_lookup_key       TEXT,
  current_period_end     TEXT,
  cancel_at_period_end   BIGINT NOT NULL DEFAULT 0,
  withdrawal_waiver_at   TEXT,
  stripe_synced_at       BIGINT NOT NULL DEFAULT 0,
  created_at             TEXT NOT NULL,
  updated_at             TEXT NOT NULL
);

CREATE INDEX idx_billing_subscriptions_user ON billing_subscriptions (user_id, status);
CREATE INDEX idx_billing_subscriptions_customer ON billing_subscriptions (stripe_customer_id);

CREATE TABLE billing_events (
  id          TEXT PRIMARY KEY,
  type        TEXT NOT NULL,
  handled     BIGINT NOT NULL DEFAULT 0,
  received_at TEXT NOT NULL
);

INSERT INTO billing_customers (user_id, stripe_customer_id, created_at, updated_at)
  SELECT user_id, stripe_customer_id, created_at, updated_at FROM subscriptions;

INSERT INTO billing_subscriptions (
  stripe_subscription_id, user_id, stripe_customer_id, plan, exam_key, status, price_lookup_key,
  current_period_end, cancel_at_period_end, withdrawal_waiver_at, stripe_synced_at, created_at, updated_at
)
  SELECT stripe_subscription_id, user_id, stripe_customer_id, 'all_access', NULL, status,
         CASE WHEN plan IS NULL THEN NULL ELSE 'examer_premium_' || plan || '_v1' END,
         current_period_end, cancel_at_period_end, NULL, 0, created_at, updated_at
    FROM subscriptions
   WHERE stripe_subscription_id IS NOT NULL AND status IS NOT NULL;

DROP TABLE subscriptions;

ALTER TABLE examer.billing_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.billing_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.billing_events ENABLE ROW LEVEL SECURITY;

-- The same table access the application login has everywhere else. If your
-- restricted login has a different name, change it here; the whole script
-- rolls back if the role does not exist.
GRANT SELECT, INSERT, UPDATE, DELETE ON examer.billing_customers, examer.billing_subscriptions, examer.billing_events TO examer_app;
CREATE POLICY backend_access ON examer.billing_customers FOR ALL TO examer_app USING (true) WITH CHECK (true);
CREATE POLICY backend_access ON examer.billing_subscriptions FOR ALL TO examer_app USING (true) WITH CHECK (true);
CREATE POLICY backend_access ON examer.billing_events FOR ALL TO examer_app USING (true) WITH CHECK (true);

INSERT INTO _migrations (name, applied_at)
VALUES ('012_stripe_subscriptions.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
