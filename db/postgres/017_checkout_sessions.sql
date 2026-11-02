BEGIN;
SET LOCAL search_path TO examer, pg_catalog;
-- One outstanding checkout per learner, shared across tabs and billing intervals.
CREATE TABLE billing_checkouts (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  attempt_id TEXT NOT NULL,
  session_id TEXT,
  offer TEXT,
  exam_key TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

ALTER TABLE billing_checkouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY backend_access ON billing_checkouts FOR ALL TO examer_app USING (true) WITH CHECK (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON billing_checkouts TO examer_app;
INSERT INTO _migrations(name, applied_at) VALUES ('017_checkout_sessions.sql', CURRENT_TIMESTAMP::text);
COMMIT;
