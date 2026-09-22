import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import {
  MIN_PASSWORD_LENGTH,
  checkPasswordStrength,
  hashPassword,
  verifyPassword,
} from '@/lib/auth/password';
import {
  createGuestUser,
  createSession,
  destroyAllSessionsFor,
  destroySession,
  purgeExpiredSessions,
  resolveSession,
} from '@/lib/auth/session';
import { RATE_LIMITS, callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { createTestDb, createUser } from './helpers/test-db';

let db: Db;

beforeEach(() => {
  db = createTestDb();
});

describe('password hashing', () => {
  it('verifies a correct password', async () => {
    const hash = await hashPassword('a reasonably long passphrase');
    expect(await verifyPassword('a reasonably long passphrase', hash)).toBe(true);
  });

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('a reasonably long passphrase');
    expect(await verifyPassword('a reasonably long passphrasE', hash)).toBe(false);
    expect(await verifyPassword('', hash)).toBe(false);
  });

  it('produces a different hash each time, so equal passwords are not detectable', async () => {
    const a = await hashPassword('identical passphrase here');
    const b = await hashPassword('identical passphrase here');
    expect(a).not.toBe(b);
    expect(await verifyPassword('identical passphrase here', a)).toBe(true);
    expect(await verifyPassword('identical passphrase here', b)).toBe(true);
  });

  it('never stores the password in the hash string', async () => {
    const hash = await hashPassword('correct horse battery staple');
    expect(hash).not.toContain('correct');
    expect(hash.startsWith('scrypt$')).toBe(true);
  });

  it('returns false rather than throwing for a missing or malformed hash', async () => {
    expect(await verifyPassword('anything at all', null)).toBe(false);
    expect(await verifyPassword('anything at all', 'not-a-hash')).toBe(false);
    expect(await verifyPassword('anything at all', 'scrypt$x$y$z$q$r')).toBe(false);
  });

  it('normalises unicode so the same typed password verifies', async () => {
    // U+00E9 versus e + U+0301: visually identical, different bytes.
    const composed = 'passeéphrase long';
    const decomposed = 'passeéphrase long';
    const hash = await hashPassword(composed);
    expect(await verifyPassword(decomposed, hash)).toBe(true);
  });
});

describe('password policy', () => {
  it('requires length rather than character classes', () => {
    expect(checkPasswordStrength('short')?.code).toBe('too-short');
    expect(checkPasswordStrength('a'.repeat(MIN_PASSWORD_LENGTH - 1))?.code).toBe('too-short');
    expect(checkPasswordStrength('the quiet harbour at dawn')).toBeNull();
  });

  it('rejects obvious choices', () => {
    expect(checkPasswordStrength('password123')?.code).toBe('too-common');
    expect(checkPasswordStrength('aaaaaaaaaaaa')?.code).toBe('repeated');
  });

  it('rejects a password containing the email local part', () => {
    expect(checkPasswordStrength('giovanna-rossi-1', 'giovanna@example.com')?.code).toBe(
      'contains-email',
    );
  });

  it('accepts a long passphrase unrelated to the email', () => {
    expect(checkPasswordStrength('two lanterns on the bridge', 'giovanna@example.com')).toBeNull();
  });
});

describe('sessions', () => {
  it('resolves a valid token to its user', () => {
    const userId = createUser(db);
    const { token } = createSession(db, userId);
    expect(resolveSession(db, token)?.id).toBe(userId);
  });

  it('stores only a hash of the token, never the token', () => {
    const userId = createUser(db);
    const { token } = createSession(db, userId);
    const rows = db.prepare('SELECT id FROM sessions').all() as Array<{ id: string }>;
    expect(rows).toHaveLength(1);
    expect(rows[0].id).not.toBe(token);
    expect(rows[0].id).toMatch(/^[0-9a-f]{64}$/);
  });

  it('rejects an unknown, empty or tampered token', () => {
    const userId = createUser(db);
    const { token } = createSession(db, userId);
    expect(resolveSession(db, undefined)).toBeNull();
    expect(resolveSession(db, '')).toBeNull();
    expect(resolveSession(db, 'not-a-real-token')).toBeNull();
    expect(resolveSession(db, `${token}x`)).toBeNull();
  });

  it('rejects and removes an expired session', () => {
    const userId = createUser(db);
    const past = new Date('2020-01-01T00:00:00.000Z');
    const { token } = createSession(db, userId, false, past);

    expect(resolveSession(db, token, new Date('2026-09-22T00:00:00.000Z'))).toBeNull();
    const remaining = db.prepare('SELECT COUNT(*) AS n FROM sessions').get() as { n: number };
    expect(remaining.n).toBe(0);
  });

  it('gives a guest a shorter session than a signed-up user', () => {
    const userId = createUser(db);
    const now = new Date('2026-09-22T00:00:00.000Z');
    const guest = createSession(db, userId, true, now);
    const member = createSession(db, userId, false, now);
    expect(guest.expiresAt.getTime()).toBeLessThan(member.expiresAt.getTime());
  });

  it('signing out invalidates only that session', () => {
    const userId = createUser(db);
    const laptop = createSession(db, userId);
    const phone = createSession(db, userId);

    destroySession(db, laptop.token);
    expect(resolveSession(db, laptop.token)).toBeNull();
    expect(resolveSession(db, phone.token)?.id).toBe(userId);
  });

  it('can revoke every session for a user', () => {
    const userId = createUser(db);
    const a = createSession(db, userId);
    const b = createSession(db, userId);
    destroyAllSessionsFor(db, userId);
    expect(resolveSession(db, a.token)).toBeNull();
    expect(resolveSession(db, b.token)).toBeNull();
  });

  it('does not resolve a session whose user has been deleted', () => {
    const userId = createUser(db);
    const { token } = createSession(db, userId);
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    expect(resolveSession(db, token)).toBeNull();
  });

  it('does not resolve a session for a soft-deleted user', () => {
    const userId = createUser(db);
    const { token } = createSession(db, userId);
    db.prepare('UPDATE users SET deleted_at = ? WHERE id = ?').run(new Date().toISOString(), userId);
    expect(resolveSession(db, token)).toBeNull();
  });

  it('purges expired sessions in bulk', () => {
    const userId = createUser(db);
    createSession(db, userId, false, new Date('2020-01-01T00:00:00.000Z'));
    createSession(db, userId, false, new Date('2026-09-22T00:00:00.000Z'));
    const removed = purgeExpiredSessions(db, new Date('2026-09-23T00:00:00.000Z'));
    expect(removed).toBe(1);
  });
});

describe('guest accounts', () => {
  it('creates a user row with no personal data', () => {
    const guest = createGuestUser(db);
    expect(guest.is_guest).toBe(1);
    expect(guest.email).toBeNull();
    expect(guest.password_hash).toBeNull();
  });
});

describe('rate limiting', () => {
  it('allows up to the limit and then blocks', () => {
    const rule = RATE_LIMITS.signIn;
    let last = checkRateLimit(db, 'signIn', 'ip:198.51.100.7');
    for (let i = 1; i < rule.max; i += 1) {
      last = checkRateLimit(db, 'signIn', 'ip:198.51.100.7');
      expect(last.allowed).toBe(true);
    }
    const blocked = checkRateLimit(db, 'signIn', 'ip:198.51.100.7');
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('keeps separate counters per identifier', () => {
    for (let i = 0; i < RATE_LIMITS.signIn.max + 2; i += 1) {
      checkRateLimit(db, 'signIn', 'ip:198.51.100.7');
    }
    expect(checkRateLimit(db, 'signIn', 'ip:203.0.113.9').allowed).toBe(true);
  });

  it('keeps separate counters per bucket', () => {
    for (let i = 0; i < RATE_LIMITS.signIn.max + 2; i += 1) {
      checkRateLimit(db, 'signIn', 'ip:198.51.100.7');
    }
    expect(checkRateLimit(db, 'signUp', 'ip:198.51.100.7').allowed).toBe(true);
  });

  it('resets in the next window', () => {
    const inWindow = new Date('2026-09-22T10:00:00.000Z');
    for (let i = 0; i < RATE_LIMITS.signIn.max + 2; i += 1) {
      checkRateLimit(db, 'signIn', 'ip:198.51.100.7', inWindow);
    }
    const later = new Date(inWindow.getTime() + RATE_LIMITS.signIn.windowSeconds * 1000 + 1000);
    expect(checkRateLimit(db, 'signIn', 'ip:198.51.100.7', later).allowed).toBe(true);
  });

  it('does not store a raw IP address', () => {
    checkRateLimit(db, 'signIn', 'ip:198.51.100.7');
    const rows = db.prepare('SELECT bucket FROM rate_limits').all() as Array<{ bucket: string }>;
    expect(rows[0].bucket).not.toContain('198.51.100.7');
  });

  it('prefers the user id over the network address when signed in', () => {
    const request = new Request('https://example.invalid/', {
      headers: { 'x-forwarded-for': '198.51.100.7' },
    });
    expect(callerKey(request, 'user-123')).toBe('user:user-123');
    expect(callerKey(request, null)).toBe('ip:198.51.100.7');
  });
});
