-- 021_email_consent.sql - what an account holder agreed to about email
-- (src/lib/account/email-consent.ts).
--
-- Two separate things, asked separately at sign-up:
--  - account_email_consent_at: when the person agreed that we use their
--    address for the minimum the account needs (sign-in codes, messages about
--    their account and purchases). Required to sign up with a password; NULL
--    for accounts created before this migration or through Google sign-in,
--    which does not pass through the sign-up form.
--  - news_consent_at: when the person opted in to news about courses and
--    tests and occasional offers. Optional, never pre-ticked, never for an
--    account marked under 16. NULL means not subscribed; withdrawing sets it
--    back to NULL. Every change is also written to audit_log, so the history
--    of each consent stays readable.

ALTER TABLE users ADD COLUMN account_email_consent_at TEXT;
ALTER TABLE users ADD COLUMN news_consent_at TEXT;
