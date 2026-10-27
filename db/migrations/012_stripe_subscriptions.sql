-- Paid subscriptions through Stripe, sold on the site's own checkout page
-- (src/lib/billing, docs/BILLING.md).
--
-- Replaces the one-row-per-learner Premium table from 010: a learner may now
-- hold several subscriptions at once (one per exam on the single-exam plan),
-- so customers and subscriptions are separate tables. Stripe stays the source
-- of truth; these rows are a copy, refreshed by webhooks and by the pages that
-- need a fresh answer. No card or bank details are stored here: card entry
-- happens in Stripe's own iframes and goes straight to Stripe.

-- One Stripe customer per account.
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
  -- 'all_access' | 'single_exam' (src/lib/billing/plans.ts)
  plan                   TEXT NOT NULL,
  -- The exam a single_exam subscription covers; NULL for all_access.
  exam_key               TEXT,
  -- Stripe's status: active, trialing, past_due, canceled, unpaid,
  -- incomplete, incomplete_expired, paused.
  status                 TEXT NOT NULL,
  price_lookup_key       TEXT,
  current_period_end     TEXT,
  cancel_at_period_end   INTEGER NOT NULL DEFAULT 0,
  -- When the buyer expressly asked for immediate access and acknowledged
  -- losing the 14-day right of withdrawal (EU consumer rule), at checkout.
  withdrawal_waiver_at   TEXT,
  -- Unix seconds of the Stripe state this row reflects. A webhook event older
  -- than this is ignored, so events arriving out of order cannot roll a
  -- subscription back.
  stripe_synced_at       INTEGER NOT NULL DEFAULT 0,
  created_at             TEXT NOT NULL,
  updated_at             TEXT NOT NULL
);

CREATE INDEX idx_billing_subscriptions_user ON billing_subscriptions (user_id, status);
CREATE INDEX idx_billing_subscriptions_customer ON billing_subscriptions (stripe_customer_id);

-- Stripe event ids already processed, so a redelivered webhook is a no-op.
CREATE TABLE billing_events (
  id          TEXT PRIMARY KEY,
  type        TEXT NOT NULL,
  -- 1 when the event changed something here; 0 for an event about a customer
  -- or price that is not this site's.
  handled     INTEGER NOT NULL DEFAULT 0,
  received_at TEXT NOT NULL
);

-- Carry over what migration 010 stored. Every earlier Premium plan opened
-- everything, so it becomes all_access; its lookup key is kept so the plan
-- resolves again when Stripe next reports on it (LEGACY_LOOKUP_KEYS).
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
