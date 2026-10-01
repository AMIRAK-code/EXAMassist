import { createHash } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Db } from '@/lib/db';
import type { EmailCodeRow, UserRow } from '@/lib/db/rows';
import {
  CODE_TTL_MINUTES,
  MAX_CODE_ATTEMPTS,
  codeSecret,
  consumeCode,
  issueCode,
  normaliseCode,
  prepareCodeForAddress,
  prepareVerificationEmail,
  resetPasswordWithCode,
  signInWithCode,
  verifyEmailWithCode,
} from '@/lib/auth/email-codes';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, resolveSession } from '@/lib/auth/session';
import { codeEmail } from '@/lib/email/messages';
import { EmailDeliveryError, defaultMailer, emailSettings } from '@/lib/email/send';
import { createTestDb, createUser } from './helpers/test-db';

const SECRET = 'a-test-secret-that-is-comfortably-over-32-characters';
const deps = { secret: SECRET };
let db: Db;

beforeEach(async () => {
  db = (await createTestDb());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function account(options: { isGuest?: boolean } = {}): Promise<{ id: string; email: string }> {
  const id = await createUser(db, options);
  return { id, email: `${id}@example.invalid` };
}

/** The same code with its first digit changed, so it is certainly wrong. */
function wrong(code: string): string {
  return `${(Number(code[0]) + 1) % 10}${code.slice(1)}`;
}

/** The six-digit code inside an email's text. */
function codeIn(text: string): string {
  const match = text.match(/\b\d{6}\b/);
  if (!match) throw new Error('no code in the email');
  return match[0];
}

async function userRow(id: string): Promise<UserRow> {
  return (await db.prepare('SELECT * FROM users WHERE id = ?').get(id)) as UserRow;
}

describe('normaliseCode', () => {
  it('accepts the code however it was typed', () => {
    expect(normaliseCode('123456')).toBe('123456');
    expect(normaliseCode(' 123 456 ')).toBe('123456');
    expect(normaliseCode('123-456')).toBe('123456');
  });

  it('rejects anything that is not six digits', () => {
    expect(normaliseCode('12345')).toBeNull();
    expect(normaliseCode('1234567')).toBeNull();
    expect(normaliseCode('12a456')).toBeNull();
    expect(normaliseCode('')).toBeNull();
  });
});

describe('issuing and checking a code', () => {
  it('stores a keyed hash, never the code or a plain hash of it', async () => {
    const holder = await account();
    const { code } = await issueCode(db, holder, 'sign-in', deps);
    expect(code).toMatch(/^\d{6}$/);

    const row = (await db.prepare('SELECT * FROM email_codes WHERE user_id = ?').get(holder.id)) as EmailCodeRow;
    expect(row.code_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(row.code_hash).not.toContain(code);
    expect(row.code_hash).not.toBe(createHash('sha256').update(code).digest('hex'));
    expect(row.email).toBe(holder.email);
  });

  it('accepts the right code exactly once', async () => {
    const holder = await account();
    const { code } = await issueCode(db, holder, 'sign-in', deps);
    expect(await consumeCode(db, holder, 'sign-in', code, deps)).toBe('ok');
    expect(await consumeCode(db, holder, 'sign-in', code, deps)).toBe('invalid');
  });

  it('counts wrong guesses and locks the code at the limit, even against the right code', async () => {
    const holder = await account();
    const { code } = await issueCode(db, holder, 'sign-in', deps);
    for (let guess = 1; guess < MAX_CODE_ATTEMPTS; guess += 1) {
      expect(await consumeCode(db, holder, 'sign-in', wrong(code), deps)).toBe('invalid');
    }
    expect(await consumeCode(db, holder, 'sign-in', wrong(code), deps)).toBe('locked');
    expect(await consumeCode(db, holder, 'sign-in', code, deps)).toBe('locked');
  });

  it('expires after the stated number of minutes', async () => {
    const holder = await account();
    const issuedAt = new Date('2026-10-01T10:00:00Z');
    const justBefore = new Date(issuedAt.getTime() + CODE_TTL_MINUTES * 60_000 - 1000);
    const justAfter = new Date(issuedAt.getTime() + CODE_TTL_MINUTES * 60_000 + 1000);

    const first = await issueCode(db, holder, 'sign-in', { ...deps, now: issuedAt });
    expect(await consumeCode(db, holder, 'sign-in', first.code, { ...deps, now: justAfter })).toBe('expired');

    const second = await issueCode(db, holder, 'sign-in', { ...deps, now: issuedAt });
    expect(await consumeCode(db, holder, 'sign-in', second.code, { ...deps, now: justBefore })).toBe('ok');
  });

  it('stops the previous code working when a new one is issued', async () => {
    const holder = await account();
    const first = await issueCode(db, holder, 'sign-in', deps);
    let second = await issueCode(db, holder, 'sign-in', deps);
    // One chance in a million that the two codes coincide; draw again if so.
    while (second.code === first.code) second = await issueCode(db, holder, 'sign-in', deps);

    expect(await consumeCode(db, holder, 'sign-in', first.code, deps)).toBe('invalid');
    expect(await consumeCode(db, holder, 'sign-in', second.code, deps)).toBe('ok');
  });

  it('works only for the address it was sent to and the purpose it was issued for', async () => {
    const holder = await account();
    const { code } = await issueCode(db, holder, 'sign-in', deps);
    expect(await consumeCode(db, { ...holder, email: 'someone-else@example.invalid' }, 'sign-in', code, deps)).toBe(
      'invalid',
    );
    expect(await consumeCode(db, holder, 'reset-password', code, deps)).toBe('invalid');
    expect(await consumeCode(db, holder, 'sign-in', code, deps)).toBe('ok');
  });

  it('cannot be checked without the secret it was hashed with', async () => {
    const holder = await account();
    const { code } = await issueCode(db, holder, 'sign-in', deps);
    expect(await consumeCode(db, holder, 'sign-in', code, { secret: `${SECRET}-rotated` })).toBe('invalid');
  });

  it('purges codes once they are more than a day past their expiry', async () => {
    const early = await account();
    const late = await account();
    const issuedAt = new Date('2026-10-01T10:00:00Z');
    (await issueCode(db, early, 'sign-in', { ...deps, now: issuedAt }));
    (await issueCode(db, late, 'sign-in', { ...deps, now: new Date(issuedAt.getTime() + 25 * 60 * 60 * 1000) }));

    const remaining = (await db.prepare('SELECT user_id FROM email_codes').all()) as Array<{ user_id: string }>;
    expect(remaining.map((row) => row.user_id)).toEqual([late.id]);
  });

  it('goes with the account when the account is deleted', async () => {
    const holder = await account();
    (await issueCode(db, holder, 'sign-in', deps));
    (await db.prepare('DELETE FROM users WHERE id = ?').run(holder.id));
    expect(await db.prepare('SELECT COUNT(*) AS n FROM email_codes').get()).toEqual({ n: 0 });
  });
});

describe('requesting a code for an address', () => {
  it('sends nothing when no registered account uses the address', async () => {
    (await account({ isGuest: true }));
    expect(await prepareCodeForAddress(db, { purpose: 'sign-in', email: 'nobody@example.invalid' }, deps)).toBeNull();
    expect(await db.prepare('SELECT COUNT(*) AS n FROM email_codes').get()).toEqual({ n: 0 });
  });

  it('addresses the email to the account and puts the code in the subject and body', async () => {
    const holder = await account();
    const message = await prepareCodeForAddress(db, { purpose: 'reset-password', email: holder.email }, deps);
    expect(message?.to).toBe(holder.email);
    const code = codeIn(message!.text);
    expect(message!.subject.startsWith(code)).toBe(true);
    expect(await consumeCode(db, holder, 'reset-password', code, deps)).toBe('ok');
  });
});

describe('signing in with a code', () => {
  it('signs in with the right code and confirms the address', async () => {
    const holder = await account();
    const message = await prepareCodeForAddress(db, { purpose: 'sign-in', email: holder.email }, deps);
    const result = await signInWithCode(db, { email: holder.email, code: codeIn(message!.text) }, deps);
    expect(result.ok && result.user.id).toBe(holder.id);
    expect((await userRow(holder.id)).email_verified_at).not.toBeNull();
  });

  it('refuses a wrong code and an unknown address alike', async () => {
    const holder = await account();
    const message = await prepareCodeForAddress(db, { purpose: 'sign-in', email: holder.email }, deps);
    const code = codeIn(message!.text);
    expect(await signInWithCode(db, { email: holder.email, code: wrong(code) }, deps)).toEqual({
      ok: false,
      failure: 'invalid',
    });
    expect(await signInWithCode(db, { email: 'nobody@example.invalid', code }, deps)).toEqual({
      ok: false,
      failure: 'invalid',
    });
    expect((await userRow(holder.id)).email_verified_at).toBeNull();
  });
});

describe('resetting a password with a code', () => {
  it('rejects a weak new password without spending the code', async () => {
    const holder = await account();
    const message = await prepareCodeForAddress(db, { purpose: 'reset-password', email: holder.email }, deps);
    const code = codeIn(message!.text);

    const weak = await resetPasswordWithCode(db, { email: holder.email, code, password: 'short' }, deps);
    expect(weak).toMatchObject({ ok: false, problem: { code: 'too-short' } });

    const strong = await resetPasswordWithCode(
      db,
      { email: holder.email, code, password: 'a quiet harbour at dawn' },
      deps,
    );
    expect(strong.ok).toBe(true);
  });

  it('sets the new password, confirms the address and signs out every session', async () => {
    const holder = await account();
    const before = await createSession(db, holder.id);
    expect(await resolveSession(db, before.token)).not.toBeNull();

    const message = await prepareCodeForAddress(db, { purpose: 'reset-password', email: holder.email }, deps);
    const result = await resetPasswordWithCode(
      db,
      { email: holder.email, code: codeIn(message!.text), password: 'a quiet harbour at dawn' },
      deps,
    );
    expect(result.ok).toBe(true);

    const row = await userRow(holder.id);
    expect(await verifyPassword('a quiet harbour at dawn', row.password_hash)).toBe(true);
    expect(row.email_verified_at).not.toBeNull();
    expect(await resolveSession(db, before.token)).toBeNull();
  });

  it('does not accept a sign-in code for a reset', async () => {
    const holder = await account();
    const message = await prepareCodeForAddress(db, { purpose: 'sign-in', email: holder.email }, deps);
    const result = await resetPasswordWithCode(
      db,
      { email: holder.email, code: codeIn(message!.text), password: 'a quiet harbour at dawn' },
      deps,
    );
    expect(result).toEqual({ ok: false, failure: 'invalid' });
  });
});

describe('confirming an address', () => {
  it('records when the address was confirmed and keeps the first date', async () => {
    const holder = await account();
    const confirmedAt = new Date('2026-10-01T10:00:00Z');
    const message = await prepareVerificationEmail(db, holder, { ...deps, now: confirmedAt });
    expect(await verifyEmailWithCode(db, holder, codeIn(message.text), { ...deps, now: confirmedAt })).toBe('ok');
    expect((await userRow(holder.id)).email_verified_at).toBe(confirmedAt.toISOString());

    // A later code-based sign-in does not move the date.
    const later = new Date('2026-10-05T10:00:00Z');
    const signIn = await prepareCodeForAddress(db, { purpose: 'sign-in', email: holder.email }, { ...deps, now: later });
    (await signInWithCode(db, { email: holder.email, code: codeIn(signIn!.text) }, { ...deps, now: later }));
    expect((await userRow(holder.id)).email_verified_at).toBe(confirmedAt.toISOString());
  });
});

describe('the hashing key', () => {
  it('refuses a missing, short or placeholder secret in production', () => {
    expect(codeSecret({ NODE_ENV: 'production' })).toBeNull();
    expect(codeSecret({ NODE_ENV: 'production', SESSION_SECRET: 'too-short' })).toBeNull();
    expect(
      codeSecret({ NODE_ENV: 'production', SESSION_SECRET: 'change-me-to-a-long-random-value-at-least-32-chars' }),
    ).toBeNull();
    expect(codeSecret({ NODE_ENV: 'production', SESSION_SECRET: SECRET })).toBe(SECRET);
  });

  it('falls back to a development key outside production', () => {
    expect(codeSecret({ NODE_ENV: 'development' })).toEqual(expect.any(String));
  });
});

describe('sending', () => {
  it('uses Brevo with a key and a sender, the console in development, and nothing in production without them', () => {
    expect(emailSettings({ BREVO_API_KEY: 'k', EMAIL_FROM_ADDRESS: 'noreply@example.invalid' }).mode).toBe('brevo');
    expect(emailSettings({ NODE_ENV: 'development' }).mode).toBe('console');
    expect(emailSettings({ NODE_ENV: 'production', BREVO_API_KEY: 'k' }).mode).toBe('off');
    expect(defaultMailer(emailSettings({ NODE_ENV: 'production' }))).toBeNull();
  });

  it('sends plain text only, from the configured sender, with the key in the header', async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response('{"messageId":"<1@relay>"}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    const mailer = defaultMailer(
      emailSettings({ BREVO_API_KEY: 'brevo-key', EMAIL_FROM_ADDRESS: 'noreply@example.invalid', EMAIL_FROM_NAME: 'Examer' }),
    );
    (await mailer!(codeEmail('sign-in', 'learner@example.invalid', '123456', CODE_TTL_MINUTES)));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.brevo.com/v3/smtp/email');
    expect((init?.headers as Record<string, string>)['api-key']).toBe('brevo-key');
    const body = JSON.parse(String(init?.body));
    expect(body.sender).toEqual({ name: 'Examer', email: 'noreply@example.invalid' });
    expect(body.to).toEqual([{ email: 'learner@example.invalid' }]);
    expect(body.subject).toBe('123456 is your Examer sign-in code');
    expect(body.textContent).toContain('123456');
    expect(body).not.toHaveProperty('htmlContent');
  });

  it('reports a refused message as a delivery error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{"message":"unauthorized: IP not authorized"}', { status: 401 })));
    const mailer = defaultMailer(emailSettings({ BREVO_API_KEY: 'k', EMAIL_FROM_ADDRESS: 'noreply@example.invalid' }));
    const sending = mailer!(codeEmail('sign-in', 'learner@example.invalid', '123456', CODE_TTL_MINUTES));
    await expect(sending).rejects.toBeInstanceOf(EmailDeliveryError);
    await expect(sending).rejects.toThrow(/HTTP 401.*IP not authorized/);
  });

  it('tells the reader how long the code lasts and what to do if they did not ask for it', () => {
    const message = codeEmail('reset-password', 'learner@example.invalid', '654321', CODE_TTL_MINUTES);
    expect(message.text).toContain(`expires in ${CODE_TTL_MINUTES} minutes`);
    expect(message.text).toContain('Your password has not changed');
  });
});
