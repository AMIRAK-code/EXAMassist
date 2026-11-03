-- Sign in with Google (src/lib/auth/google.ts).
--
-- `oauth_identities` ties an account to the provider's own stable id for the
-- person (Google's `sub`), never to an email address. An address can change
-- hands or be edited; the subject cannot, so once an account is linked, only
-- that Google account signs into it, whatever either side's address becomes.
-- Each account has at most one Google identity, and each Google identity
-- belongs to at most one account.

CREATE TABLE oauth_identities (
  -- 'google'
  provider      TEXT NOT NULL,
  -- The provider's subject identifier (`sub` in the ID token).
  subject       TEXT NOT NULL,
  user_id       TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  -- The verified address the provider gave when the identity was linked, kept
  -- for the account export and support; sign-in never matches on it again.
  email         TEXT NOT NULL,
  created_at    TEXT NOT NULL,
  last_used_at  TEXT NOT NULL,
  PRIMARY KEY (provider, subject)
);

CREATE UNIQUE INDEX idx_oauth_identities_user ON oauth_identities (user_id, provider);

-- One row per sign-in that has been started and not yet finished. The browser
-- holds the random `state` in a short-lived cookie; this table holds only its
-- SHA-256, with the PKCE verifier and the nonce's hash, so the callback can
-- check all three and spend the row exactly once. A row lives ten minutes and
-- is purged the next time anyone starts a sign-in once it is a day past that.

CREATE TABLE oauth_requests (
  -- SHA-256 of the `state` value, hex.
  id             TEXT PRIMARY KEY,
  provider       TEXT NOT NULL,
  code_verifier  TEXT NOT NULL,
  -- SHA-256 of the nonce sent to the provider, hex.
  nonce_hash     TEXT NOT NULL,
  -- Where to go afterwards: a checked path on this site, or NULL.
  next_path      TEXT,
  -- The interface language the sign-in was started in.
  locale         TEXT NOT NULL,
  created_at     TEXT NOT NULL,
  expires_at     TEXT NOT NULL,
  consumed_at    TEXT
);

CREATE INDEX idx_oauth_requests_expires ON oauth_requests (expires_at);
