-- 016_exam_passes.sql - the Single Exam Pass: one exam, paid once, for six
-- calendar months (src/lib/billing, docs/BILLING.md).
--
-- A pass is not a subscription: it is one Stripe invoice (a one-off invoice
-- for the pass price, paid with the Payment Element on our checkout page), so
-- it has its own table. Subscriptions (Plus, and the earlier plans their
-- holders keep) stay in billing_subscriptions, unchanged.
--
-- Stripe stays the source of truth. A row is written as 'pending' when the
-- checkout creates the invoice, and becomes 'paid' only from Stripe's own
-- record of the payment (the invoice.paid webhook, or the invoice read from
-- Stripe by the server): never on the browser's word. The access dates come
-- from the moment Stripe marked the invoice paid.

CREATE TABLE billing_passes (
  stripe_invoice_id        TEXT PRIMARY KEY,
  user_id                  TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  stripe_customer_id       TEXT NOT NULL,
  -- The PaymentIntent that paid the invoice, once known: refunds arrive as
  -- charge events that name it.
  stripe_payment_intent_id TEXT,
  -- 'exam_pass' (src/lib/billing/plans.ts)
  plan                     TEXT NOT NULL,
  -- The one exam this pass covers.
  exam_key                 TEXT NOT NULL,
  price_lookup_key         TEXT NOT NULL,
  -- What was charged, in cents, VAT included, and its currency.
  amount                   INTEGER NOT NULL,
  currency                 TEXT NOT NULL,
  -- pending (invoice open, not paid) | paid | void (abandoned, never paid) |
  -- refunded (fully refunded: access ends).
  status                   TEXT NOT NULL,
  -- When Stripe recorded the payment, and that moment plus six calendar
  -- months. NULL until paid.
  access_starts_at         TEXT,
  access_ends_at           TEXT,
  -- When the buyer expressly asked for immediate access and acknowledged
  -- losing the 14-day right of withdrawal (EU consumer rule), at checkout.
  withdrawal_waiver_at     TEXT,
  -- The exam page the learner came from, for counting only.
  source_exam              TEXT,
  -- Unix seconds of the Stripe state this row reflects; older events are ignored.
  stripe_synced_at         INTEGER NOT NULL DEFAULT 0,
  created_at               TEXT NOT NULL,
  updated_at               TEXT NOT NULL
);

CREATE INDEX idx_billing_passes_user ON billing_passes (user_id, status);
CREATE INDEX idx_billing_passes_payment_intent ON billing_passes (stripe_payment_intent_id);
