-- One outstanding checkout per learner, shared across tabs and billing intervals.
CREATE TABLE billing_checkouts (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  attempt_id TEXT NOT NULL,
  session_id TEXT,
  offer TEXT,
  exam_key TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);
