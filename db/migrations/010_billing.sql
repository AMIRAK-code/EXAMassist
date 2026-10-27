-- Premium through Stripe. One row per learner who has started a checkout:
-- the Stripe customer that pays for them, and a copy of the subscription that
-- decides their plan. Stripe stays the source of truth; this copy is refreshed
-- on every checkout, webhook and stale read (src/lib/billing/service.ts).
--
-- No card or bank details are ever stored here: Stripe Checkout collects them
-- on Stripe's own pages. The row goes with the account.

CREATE TABLE subscriptions (
  user_id                TEXT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  stripe_customer_id     TEXT NOT NULL UNIQUE,
  stripe_subscription_id TEXT,
  -- 'monthly' | 'quarterly' | 'yearly'; NULL until a checkout completes
  plan                   TEXT,
  -- Stripe's subscription status: active, trialing, past_due, canceled, ...
  status                 TEXT,
  current_period_end     TEXT,
  cancel_at_period_end   INTEGER NOT NULL DEFAULT 0,
  created_at             TEXT NOT NULL,
  updated_at             TEXT NOT NULL
);
