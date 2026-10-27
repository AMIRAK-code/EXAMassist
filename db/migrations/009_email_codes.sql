-- One-time codes sent by email: sign-in without a password, password reset,
-- and confirming the address on a new account.
--
-- A code is six digits, so a plain hash of it could be reversed by trying all
-- million values. `code_hash` is therefore an HMAC keyed with SESSION_SECRET,
-- which never reaches the database. A code works once, expires after ten
-- minutes, and stops working after five wrong guesses. Requesting a new code
-- for the same purpose replaces the old one, and rows are purged a day after
-- they expire, so this table only ever holds a handful of recent rows.
--
-- Codes are issued only to registered accounts, never to an address nobody has
-- signed up with, so `user_id` is always set and the rows go with the account.

CREATE TABLE email_codes (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  -- 'sign-in' | 'reset-password' | 'verify-email'
  purpose      TEXT NOT NULL,
  -- The address the code was sent to. A code proves control of this address
  -- only, so it stops working if the account's address changes.
  email        TEXT NOT NULL,
  code_hash    TEXT NOT NULL,
  attempts     INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL,
  expires_at   TEXT NOT NULL,
  consumed_at  TEXT
);

CREATE INDEX idx_email_codes_user ON email_codes (user_id, purpose, created_at);
CREATE INDEX idx_email_codes_expires ON email_codes (expires_at);

-- When the account's address was last shown to work: set by confirming it
-- with a code, and by any other code-based sign-in or reset, since receiving
-- the code proves the same thing. NULL means not yet confirmed.
ALTER TABLE users ADD COLUMN email_verified_at TEXT;
