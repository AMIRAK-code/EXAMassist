-- Access an administrator gives by hand (src/lib/admin/users.ts).
--
-- Plus (every exam) or a one-exam pass for a fixed term, without a payment:
-- for a tester, a partner or a learner whose payment went wrong. It counts
-- exactly like a paid plan of the same kind (src/lib/billing/entitlements.ts)
-- and never touches Stripe. A grant is never deleted while its account
-- exists: revoking stamps `revoked_at`, so the history stays readable. Who
-- did what is also written to `audit_log`.

CREATE TABLE access_grants (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  -- 'plus' (every exam) or 'exam_pass' (one exam).
  plan         TEXT NOT NULL,
  -- The exam an 'exam_pass' grant covers; NULL for 'plus'.
  exam_key     TEXT,
  starts_at    TEXT NOT NULL,
  ends_at      TEXT NOT NULL,
  -- Why it was given, as the administrator wrote it.
  reason       TEXT NOT NULL,
  -- The administrator's user id. No foreign key: the grant outlives a staff
  -- account that is later deleted.
  granted_by   TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  revoked_at   TEXT,
  revoked_by   TEXT
);

CREATE INDEX idx_access_grants_user ON access_grants (user_id);
