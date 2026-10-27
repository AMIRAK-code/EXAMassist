import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { getDb, type Db } from '@/lib/db';
import type { SessionRow, UserRow } from '@/lib/db/rows';

/**
 * Database-backed sessions.
 *
 * The cookie carries a random 256-bit token; only its SHA-256 is stored, so a
 * leaked database does not hand over live sessions. Every protected read
 * resolves the session server-side - nothing about identity is trusted from
 * the client.
 */

export const SESSION_COOKIE = 'examer_session';
const SESSION_TTL_DAYS = 30;
export const GUEST_TTL_DAYS = 7;

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
  role: 'learner' | 'editor' | 'admin';
  isGuest: boolean;
  locale: string;
  targetExamKey: string | null;
  targetDate: string | null;
  weeklyMinutes: number | null;
  isMinor: boolean;
  /** When the email address was confirmed with a code; null if it never was. */
  emailVerifiedAt: string | null;
  /**
   * When the session that resolved this user ends. For a guest this is when
   * this browser loses access to their practice, because a guest cannot sign
   * back in. Set only when the user came from a session.
   */
  sessionExpiresAt?: string;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function toAuthUser(row: UserRow): AuthUser {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    isGuest: row.is_guest === 1,
    locale: row.locale,
    targetExamKey: row.target_exam_key,
    targetDate: row.target_date,
    weeklyMinutes: row.weekly_minutes,
    isMinor: row.is_minor === 1,
    // `?? null`: a Postgres database that has not had the 009 operator
    // migration yet has no such column, and the user is simply unconfirmed.
    emailVerifiedAt: row.email_verified_at ?? null,
  };
}

export interface IssuedSession {
  token: string;
  expiresAt: Date;
}

export async function createSession(db: Db, userId: string, isGuest = false, now = new Date()): Promise<IssuedSession> {
  const token = randomBytes(32).toString('base64url');
  const ttlDays = isGuest ? GUEST_TTL_DAYS : SESSION_TTL_DAYS;
  const expiresAt = new Date(now.getTime() + ttlDays * 24 * 60 * 60 * 1000);

  (await db.prepare(
    'INSERT INTO sessions (id, user_id, created_at, expires_at, last_seen_at) VALUES (?, ?, ?, ?, ?)',
  ).run(hashToken(token), userId, now.toISOString(), expiresAt.toISOString(), now.toISOString()));

  return { token, expiresAt };
}

export async function resolveSession(db: Db, token: string | undefined, now = new Date()): Promise<AuthUser | null> {
  if (!token) return null;

  const session = (await db
    .prepare('SELECT * FROM sessions WHERE id = ?')
    .get(hashToken(token))) as SessionRow | undefined;
  if (!session) return null;

  if (new Date(session.expires_at).getTime() <= now.getTime()) {
    (await db.prepare('DELETE FROM sessions WHERE id = ?').run(session.id));
    return null;
  }

  const user = (await db
    .prepare('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL')
    .get(session.user_id)) as UserRow | undefined;
  if (!user) return null;

  // Cheap last-seen tracking, at most once a minute.
  if (now.getTime() - new Date(session.last_seen_at).getTime() > 60_000) {
    (await db.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?').run(now.toISOString(), session.id));
  }

  return { ...toAuthUser(user), sessionExpiresAt: session.expires_at };
}

export async function destroySession(db: Db, token: string | undefined): Promise<void> {
  if (!token) return;
  (await db.prepare('DELETE FROM sessions WHERE id = ?').run(hashToken(token)));
}

export async function destroyAllSessionsFor(db: Db, userId: string): Promise<void> {
  (await db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId));
}

export async function purgeExpiredSessions(db: Db, now = new Date()): Promise<number> {
  const info = (await db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now.toISOString()));
  return info.changes;
}

// ---------------------------------------------------------------------------
// Guests
// ---------------------------------------------------------------------------

/**
 * Guest accounts are real rows, so a guest's practice history and results
 * persist and can later be claimed by signing up. They collect no personal
 * data at all.
 */
export async function createGuestUser(db: Db, now = new Date()): Promise<UserRow> {
  const id = randomUUID();
  (await db.prepare(
    `INSERT INTO users (id, email, password_hash, display_name, role, is_guest, locale,
                        created_at, updated_at)
     VALUES (?, NULL, NULL, 'Guest', 'learner', 1, 'en', ?, ?)`,
  ).run(id, now.toISOString(), now.toISOString()));
  return (await db.prepare('SELECT * FROM users WHERE id = ?').get(id)) as UserRow;
}

// ---------------------------------------------------------------------------
// Request-scoped helpers (Next.js server components and route handlers)
// ---------------------------------------------------------------------------

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  };
}

/** The signed-in user, or null. Never throws. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const store = await cookies();
  return (await resolveSession(getDb(), store.get(SESSION_COOKIE)?.value));
}

export class UnauthorizedError extends Error {
  readonly status = 401;
  constructor(message = 'You need to be signed in to do that.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = 'You do not have access to that.') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export async function requireRole(...roles: Array<AuthUser['role']>): Promise<AuthUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new ForbiddenError();
  return user;
}

/**
 * For pages a guest may use. Returns the existing user, or creates a guest and
 * returns the cookie the caller must set.
 */
export async function getOrCreateGuest(): Promise<{ user: AuthUser; setCookie: IssuedSession | null }> {
  const existing = await getCurrentUser();
  if (existing) return { user: existing, setCookie: null };

  const db = getDb();
  const row = (await createGuestUser(db));
  const issued = (await createSession(db, row.id, true));
  return { user: { ...toAuthUser(row), sessionExpiresAt: issued.expiresAt.toISOString() }, setCookie: issued };
}
