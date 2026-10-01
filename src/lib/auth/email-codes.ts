import { createHmac, randomInt, randomUUID, timingSafeEqual } from 'node:crypto';
import type { Db } from '@/lib/db';
import type { EmailCodeRow, UserRow } from '@/lib/db/rows';
import { codeEmail } from '@/lib/email/messages';
import { defaultMailer, type Mailer, type OutgoingEmail } from '@/lib/email/send';
import { checkPasswordStrength, hashPassword, type PasswordProblem } from './password';
import { destroyAllSessionsFor } from './session';

/**
 * One-time codes sent by email (migration 009), and the three things they do:
 * sign in without a password, reset a forgotten password, and confirm the
 * address on a new account.
 *
 * A code is six digits. That is short enough to type from a phone and, with
 * five guesses per code and a ten-minute life, far too large a space to guess
 * online. Offline it would be trivial, so the database never holds the code or
 * a plain hash of it: only an HMAC keyed with SESSION_SECRET, which lives in
 * the deployment's environment and never in the database.
 *
 * Codes are issued only to registered accounts. A request for an address
 * nobody has signed up with sends nothing, and the caller is answered exactly
 * as if a code had gone out.
 */

export type CodePurpose = EmailCodeRow['purpose'];
export type CodeOutcome = 'ok' | 'invalid' | 'expired' | 'locked';
export type CodeFailure = Exclude<CodeOutcome, 'ok'>;

export const CODE_LENGTH = 6;
export const CODE_TTL_MINUTES = 10;
export const MAX_CODE_ATTEMPTS = 5;
/** Expired rows are deleted once they are this old, the next time a code is issued. */
const PURGE_AFTER_MS = 24 * 60 * 60 * 1000;

/** What each failure tells the learner. One wording per outcome, used by every route. */
export const CODE_FAILURE_MESSAGES: Record<CodeFailure, string> = {
  invalid: 'That code is not right. Check the most recent email we sent you and try again.',
  expired: 'That code has expired. Ask for a new one.',
  locked: 'Too many wrong codes. Ask for a new one.',
};

export interface CodeDeps {
  now?: Date;
  /** The HMAC key. Defaults to SESSION_SECRET; tests pass their own. */
  secret?: string;
}

/**
 * The key codes are hashed with, or null when this deployment has none.
 *
 * Production must set SESSION_SECRET to a real value; the placeholder from
 * .env.example is refused. Development falls back to a fixed key, which is
 * fine because development codes are printed to the console anyway.
 */
export function codeSecret(env: Record<string, string | undefined> = process.env): string | null {
  const secret = env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 32 && !secret.startsWith('change-me')) return secret;
  if (env.NODE_ENV !== 'production') return 'examer-development-only-email-code-secret';
  return null;
}

/**
 * How this deployment sends codes, or null when it cannot: no mailer, or no
 * key to hash codes with. Pages use it to decide whether to offer code
 * sign-in, password reset and address confirmation at all.
 */
export function emailCodesMailer(): Mailer | null {
  if (!codeSecret()) return null;
  return defaultMailer();
}

function requireSecret(deps: CodeDeps): string {
  const secret = deps.secret ?? codeSecret();
  if (!secret) {
    throw new Error('SESSION_SECRET must be set to at least 32 random characters before email codes can be issued.');
  }
  return secret;
}

function digest(secret: string, codeId: string, code: string): Buffer {
  return createHmac('sha256', secret).update(`${codeId}:${code}`).digest();
}

/** Accepts the code however it was typed ("123456", "123 456", "123-456"); null if it is not six digits. */
export function normaliseCode(raw: string): string | null {
  const digits = raw.replace(/[\s-]/g, '');
  return new RegExp(`^\\d{${CODE_LENGTH}}$`).test(digits) ? digits : null;
}

export function generateCode(): string {
  return String(randomInt(0, 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, '0');
}

interface CodeHolder {
  id: string;
  email: string;
}

/**
 * Creates a code and returns it in clear, once, for the email. Any earlier
 * code for the same account and purpose stops working.
 */
export async function issueCode(
  db: Db,
  holder: CodeHolder,
  purpose: CodePurpose,
  deps: CodeDeps = {},
): Promise<{ code: string; expiresAt: Date }> {
  const now = deps.now ?? new Date();
  const secret = requireSecret(deps);
  const id = randomUUID();
  const code = generateCode();
  const expiresAt = new Date(now.getTime() + CODE_TTL_MINUTES * 60_000);

  const store = db.transaction(async () => {
    (await db.prepare('DELETE FROM email_codes WHERE user_id = ? AND purpose = ?').run(holder.id, purpose));
    (await db.prepare('DELETE FROM email_codes WHERE expires_at < ?').run(
      new Date(now.getTime() - PURGE_AFTER_MS).toISOString(),
    ));
    (await db.prepare(
      `INSERT INTO email_codes (id, user_id, purpose, email, code_hash, attempts, created_at, expires_at, consumed_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, NULL)`,
    ).run(id, holder.id, purpose, holder.email, digest(secret, id, code).toString('hex'), now.toISOString(), expiresAt.toISOString()));
  });
  (await store());

  return { code, expiresAt };
}

/**
 * Checks a code and, if it is right, spends it. A wrong guess is counted, and
 * the fifth wrong guess locks the code even if the right one follows.
 */
export async function consumeCode(
  db: Db,
  holder: CodeHolder,
  purpose: CodePurpose,
  rawCode: string,
  deps: CodeDeps = {},
): Promise<CodeOutcome> {
  const now = deps.now ?? new Date();
  const secret = requireSecret(deps);
  const code = normaliseCode(rawCode);

  const check = db.transaction(async (): Promise<CodeOutcome> => {
    // Bound to the address it was sent to: a code proves control of that
    // inbox, not of whatever address the account has now.
    const row = (await db
      .prepare(
        `SELECT * FROM email_codes
          WHERE user_id = ? AND purpose = ? AND email = ? AND consumed_at IS NULL
          ORDER BY created_at DESC LIMIT 1`,
      )
      .get(holder.id, purpose, holder.email)) as EmailCodeRow | undefined;

    if (!row) return 'invalid';
    if (new Date(row.expires_at).getTime() <= now.getTime()) return 'expired';
    if (row.attempts >= MAX_CODE_ATTEMPTS) return 'locked';

    const expected = Buffer.from(row.code_hash, 'hex');
    const given = digest(secret, row.id, code ?? '');
    const matches = code !== null && expected.length === given.length && timingSafeEqual(expected, given);

    if (!matches) {
      (await db.prepare('UPDATE email_codes SET attempts = attempts + 1 WHERE id = ?').run(row.id));
      return row.attempts + 1 >= MAX_CODE_ATTEMPTS ? 'locked' : 'invalid';
    }

    // Only one of two simultaneous submissions of the same code can win.
    const spent = (await db
      .prepare('UPDATE email_codes SET consumed_at = ? WHERE id = ? AND consumed_at IS NULL')
      .run(now.toISOString(), row.id));
    return spent.changes === 1 ? 'ok' : 'invalid';
  });

  return (await check());
}

// ---------------------------------------------------------------------------
// The three uses
// ---------------------------------------------------------------------------

async function registeredAccount(db: Db, email: string): Promise<(UserRow & { email: string }) | undefined> {
  const user = (await db
    .prepare('SELECT * FROM users WHERE email = ? AND is_guest = 0 AND deleted_at IS NULL')
    .get(email)) as UserRow | undefined;
  return user?.email ? (user as UserRow & { email: string }) : undefined;
}

/** Receiving a code proves the inbox works, so any successful code confirms the address. */
async function markVerified(db: Db, userId: string, now: Date): Promise<void> {
  const iso = now.toISOString();
  (await db
    .prepare('UPDATE users SET email_verified_at = COALESCE(email_verified_at, ?), updated_at = ? WHERE id = ?')
    .run(iso, iso, userId));
}

/**
 * For a sign-in or password-reset request: the email to send, or null when no
 * account uses the address. The caller must answer the same way in both cases.
 */
export async function prepareCodeForAddress(
  db: Db,
  request: { purpose: 'sign-in' | 'reset-password'; email: string },
  deps: CodeDeps = {},
): Promise<OutgoingEmail | null> {
  const user = await registeredAccount(db, request.email);
  if (!user) return null;
  const { code } = await issueCode(db, user, request.purpose, deps);
  return codeEmail(request.purpose, user.email, code, CODE_TTL_MINUTES);
}

/** The confirmation email for a signed-in account's own address. */
export async function prepareVerificationEmail(
  db: Db,
  holder: CodeHolder,
  deps: CodeDeps = {},
): Promise<OutgoingEmail> {
  const { code } = await issueCode(db, holder, 'verify-email', deps);
  return codeEmail('verify-email', holder.email, code, CODE_TTL_MINUTES);
}

export type SignInWithCodeResult = { ok: true; user: UserRow } | { ok: false; failure: CodeFailure };

export async function signInWithCode(
  db: Db,
  input: { email: string; code: string },
  deps: CodeDeps = {},
): Promise<SignInWithCodeResult> {
  const user = await registeredAccount(db, input.email);
  if (!user) return { ok: false, failure: 'invalid' };

  const outcome = await consumeCode(db, user, 'sign-in', input.code, deps);
  if (outcome !== 'ok') return { ok: false, failure: outcome };

  (await markVerified(db, user.id, deps.now ?? new Date()));
  return { ok: true, user };
}

export type ResetPasswordResult =
  | { ok: true; user: UserRow }
  | { ok: false; failure: CodeFailure }
  | { ok: false; problem: PasswordProblem };

/**
 * Sets a new password and signs the account out everywhere, since a reset is
 * what someone does when they think their password is known to someone else.
 */
export async function resetPasswordWithCode(
  db: Db,
  input: { email: string; code: string; password: string },
  deps: CodeDeps = {},
): Promise<ResetPasswordResult> {
  // The new password is checked first, so a rejected password does not cost
  // the learner their code.
  const problem = checkPasswordStrength(input.password, input.email);
  if (problem) return { ok: false, problem };

  const user = await registeredAccount(db, input.email);
  if (!user) return { ok: false, failure: 'invalid' };

  const outcome = await consumeCode(db, user, 'reset-password', input.code, deps);
  if (outcome !== 'ok') return { ok: false, failure: outcome };

  const passwordHash = await hashPassword(input.password);
  const now = (deps.now ?? new Date()).toISOString();
  const apply = db.transaction(async () => {
    (await db
      .prepare(
        'UPDATE users SET password_hash = ?, email_verified_at = COALESCE(email_verified_at, ?), updated_at = ? WHERE id = ?',
      )
      .run(passwordHash, now, now, user.id));
    (await destroyAllSessionsFor(db, user.id));
  });
  (await apply());

  return { ok: true, user };
}

export async function verifyEmailWithCode(
  db: Db,
  holder: CodeHolder,
  code: string,
  deps: CodeDeps = {},
): Promise<CodeOutcome> {
  const outcome = await consumeCode(db, holder, 'verify-email', code, deps);
  if (outcome === 'ok') (await markVerified(db, holder.id, deps.now ?? new Date()));
  return outcome;
}
