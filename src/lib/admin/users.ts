import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { Db } from '@/lib/db';
import type { AccessGrantRow, OAuthIdentityRow } from '@/lib/db/rows';
import type { AuthUser } from '@/lib/auth/session';
import { getExamConfig } from '@/lib/exams/registry';
import { GRANTABLE_PLANS, listAccessGrants } from '@/lib/billing/access-grants';
import { accessGrantToGrant, grantIsLive, passToGrant, toGrant, type Grant } from '@/lib/billing/entitlements';
import { listPasses, listSubscriptions, type PassRow, type SubscriptionRow } from '@/lib/billing/store';

/**
 * The people behind the accounts, for administrators: find an account, see
 * what it has, give or take back access, and change its role.
 *
 * Everything here is admin-only (the routes check, and so does each change
 * below) and every change is written to `audit_log` with who made it and why.
 * Payments are never changed here: a Stripe subscription or pass is managed in
 * the Stripe Dashboard, and access given here never touches Stripe.
 */

export class AdminError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = 'AdminError';
  }
}

export const ROLES = ['learner', 'editor', 'admin'] as const;
export type Role = (typeof ROLES)[number];

const PAGE_SIZE = 50;
const MAX_GRANT_DAYS = 730;

export interface UserListEntry {
  id: string;
  email: string | null;
  displayName: string | null;
  role: Role;
  isGuest: boolean;
  createdAt: string;
  emailVerifiedAt: string | null;
  google: boolean;
  lastSeenAt: string | null;
  /** Short labels for what gives access now: "Plus", "Pass: GMAT", "Given: Plus". */
  access: string[];
}

export interface UserList {
  users: UserListEntry[];
  page: number;
  hasMore: boolean;
}

function assertAdmin(actor: Pick<AuthUser, 'role'>): void {
  if (actor.role !== 'admin') throw new AdminError('forbidden', 'Only an administrator can do this.', 403);
}

/** `%`, `_` and `\` typed into the search box are matched literally. */
function likePattern(text: string): string {
  return `%${text.toLowerCase().replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

function examName(examKey: string | null): string | null {
  return examKey ? (getExamConfig(examKey)?.name ?? examKey) : null;
}

/** "Plus", "Pass: GMAT", "Given: Plus" - what a live grant is called in the list. */
export function accessLabel(grant: Grant): string {
  const plan = grant.plan === 'plus' ? 'Plus' : grant.plan === 'exam_pass' ? 'Pass' : grant.plan;
  const exam = examName(grant.examKey);
  const name = exam ? `${plan}: ${exam}` : plan;
  return grant.kind === 'grant' ? `Given: ${name}` : name;
}

/**
 * Accounts, newest first, 50 a page. `query` matches part of the email
 * address (any case) or a whole account id. Guests have no address and are
 * left out unless asked for.
 */
export async function listUsers(
  db: Db,
  options: { query?: string; page?: number; includeGuests?: boolean } = {},
  now = new Date(),
): Promise<UserList> {
  const page = Math.max(1, Math.floor(options.page ?? 1));
  const query = options.query?.trim() ?? '';
  const where = ['u.deleted_at IS NULL'];
  const params: unknown[] = [];
  if (!options.includeGuests) where.push('u.is_guest = 0');
  if (query) {
    where.push("(LOWER(u.email) LIKE ? ESCAPE '\\' OR u.id = ?)");
    params.push(likePattern(query), query);
  }
  const rows = (await db
    .prepare(
      `SELECT u.id, u.email, u.display_name, u.role, u.is_guest, u.created_at, u.email_verified_at,
              (SELECT MAX(s.last_seen_at) FROM sessions s WHERE s.user_id = u.id) AS last_seen_at,
              (SELECT COUNT(*) FROM oauth_identities o WHERE o.user_id = u.id) AS google_links
         FROM users u
        WHERE ${where.join(' AND ')}
        ORDER BY u.created_at DESC, u.id
        LIMIT ? OFFSET ?`,
    )
    .all(...params, PAGE_SIZE + 1, (page - 1) * PAGE_SIZE)) as Array<{
    id: string;
    email: string | null;
    display_name: string | null;
    role: Role;
    is_guest: number | string;
    created_at: string;
    email_verified_at: string | null;
    last_seen_at: string | null;
    google_links: number | string;
  }>;
  const shown = rows.slice(0, PAGE_SIZE);
  const access = await liveAccessFor(db, shown.map((row) => row.id), now);
  return {
    users: shown.map((row) => ({
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      role: row.role,
      isGuest: Number(row.is_guest) === 1,
      createdAt: row.created_at,
      emailVerifiedAt: row.email_verified_at,
      google: Number(row.google_links) > 0,
      lastSeenAt: row.last_seen_at,
      access: (access.get(row.id) ?? []).map(accessLabel),
    })),
    page,
    hasMore: rows.length > PAGE_SIZE,
  };
}

/** Live grants of each account, in three queries for the whole page. */
async function liveAccessFor(db: Db, userIds: string[], now: Date): Promise<Map<string, Grant[]>> {
  const result = new Map<string, Grant[]>();
  if (userIds.length === 0) return result;
  const marks = userIds.map(() => '?').join(', ');
  const add = (userId: string, grant: Grant) => {
    if (!grantIsLive(grant, now)) return;
    result.set(userId, [...(result.get(userId) ?? []), grant]);
  };
  const subscriptions = (await db
    .prepare(`SELECT * FROM billing_subscriptions WHERE user_id IN (${marks})`)
    .all(...userIds)
    .catch(() => [])) as SubscriptionRow[];
  for (const row of subscriptions) add(row.user_id, toGrant(row));
  const passes = (await db.prepare(`SELECT * FROM billing_passes WHERE user_id IN (${marks})`).all(...userIds).catch(() => [])) as PassRow[];
  for (const row of passes) add(row.user_id, passToGrant(row));
  const given = (await db.prepare(`SELECT * FROM access_grants WHERE user_id IN (${marks})`).all(...userIds).catch(() => [])) as AccessGrantRow[];
  for (const row of given) add(row.user_id, accessGrantToGrant(row));
  return result;
}

export interface AuditEntry {
  action: string;
  actorEmail: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface UserDetail {
  id: string;
  email: string | null;
  displayName: string | null;
  role: Role;
  isGuest: boolean;
  isMinor: boolean;
  locale: string;
  hasPassword: boolean;
  createdAt: string;
  emailVerifiedAt: string | null;
  google: Pick<OAuthIdentityRow, 'email' | 'created_at' | 'last_used_at'> | null;
  liveSessions: number;
  lastSeenAt: string | null;
  attempts: { total: number; submitted: number; lastAt: string | null; exams: string[] };
  targets: Array<{ examKey: string; examName: string; targetDate: string | null }>;
  subscriptions: SubscriptionRow[];
  passes: PassRow[];
  /** Null on a database still awaiting migration 019. */
  grants: AccessGrantRow[] | null;
  /** Live grants of every kind, labelled. */
  access: string[];
  audit: AuditEntry[];
}

export async function getUserDetail(db: Db, userId: string, now = new Date()): Promise<UserDetail | null> {
  const user = (await db.prepare('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL').get(userId)) as
    | {
        id: string;
        email: string | null;
        display_name: string | null;
        role: Role;
        is_guest: number | string;
        is_minor: number | string;
        locale: string;
        password_hash: string | null;
        created_at: string;
        email_verified_at: string | null;
      }
    | undefined;
  if (!user) return null;
  const nowIso = now.toISOString();

  const google = (await db
    .prepare("SELECT email, created_at, last_used_at FROM oauth_identities WHERE user_id = ? AND provider = 'google'")
    .get(userId)
    .catch(() => undefined)) as UserDetail['google'] | undefined;
  const sessions = (await db
    .prepare('SELECT COUNT(*) AS live, (SELECT MAX(last_seen_at) FROM sessions WHERE user_id = ?) AS last_seen FROM sessions WHERE user_id = ? AND expires_at > ?')
    .get(userId, userId, nowIso)) as { live: number | string; last_seen: string | null };
  const attempts = (await db
    .prepare(
      "SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) AS submitted, MAX(started_at) AS last_at FROM attempts WHERE user_id = ?",
    )
    .get(userId)) as { total: number | string; submitted: number | string | null; last_at: string | null };
  const attemptExams = (await db.prepare('SELECT DISTINCT exam_key FROM attempts WHERE user_id = ? ORDER BY exam_key').all(userId)) as Array<{
    exam_key: string;
  }>;
  const targets = (await db.prepare('SELECT exam_key, target_date FROM exam_targets WHERE user_id = ? ORDER BY created_at').all(userId)) as Array<{
    exam_key: string;
    target_date: string | null;
  }>;
  const subscriptions = await listSubscriptions(db, userId).catch(() => [] as SubscriptionRow[]);
  const passes = await listPasses(db, userId).catch(() => [] as PassRow[]);
  const grants = await listAccessGrants(db, userId).catch(() => null);
  const live = [
    ...subscriptions.map(toGrant),
    ...passes.map(passToGrant),
    ...(grants ?? []).map(accessGrantToGrant),
  ].filter((grant) => grantIsLive(grant, now));

  const audit = (await db
    .prepare(
      `SELECT a.action, a.payload_json, a.created_at, u.email AS actor_email
         FROM audit_log a LEFT JOIN users u ON u.id = a.actor_user_id
        WHERE a.entity_type = 'user' AND a.entity_id = ?
        ORDER BY a.created_at DESC, a.id DESC
        LIMIT 30`,
    )
    .all(userId)) as Array<{ action: string; payload_json: string | null; created_at: string; actor_email: string | null }>;

  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    role: user.role,
    isGuest: Number(user.is_guest) === 1,
    isMinor: Number(user.is_minor) === 1,
    locale: user.locale,
    hasPassword: Boolean(user.password_hash),
    createdAt: user.created_at,
    emailVerifiedAt: user.email_verified_at,
    google: google ?? null,
    liveSessions: Number(sessions.live),
    lastSeenAt: sessions.last_seen,
    attempts: {
      total: Number(attempts.total),
      submitted: Number(attempts.submitted ?? 0),
      lastAt: attempts.last_at,
      exams: attemptExams.map((row) => examName(row.exam_key) ?? row.exam_key),
    },
    targets: targets.map((row) => ({ examKey: row.exam_key, examName: examName(row.exam_key) ?? row.exam_key, targetDate: row.target_date })),
    subscriptions,
    passes,
    grants,
    access: live.map(accessLabel),
    audit: audit.map((row) => ({
      action: row.action,
      actorEmail: row.actor_email,
      payload: row.payload_json ? (JSON.parse(row.payload_json) as Record<string, unknown>) : {},
      createdAt: row.created_at,
    })),
  };
}

async function audit(db: Db, actor: AuthUser, action: string, userId: string, payload: Record<string, unknown>, nowIso: string): Promise<void> {
  await db
    .prepare('INSERT INTO audit_log (actor_user_id, action, entity_type, entity_id, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(actor.id, action, 'user', userId, JSON.stringify(payload), nowIso);
}

async function targetAccount(db: Db, userId: string): Promise<{ id: string; email: string | null; role: Role; is_guest: number | string; email_verified_at: string | null }> {
  const user = (await db
    .prepare('SELECT id, email, role, is_guest, email_verified_at FROM users WHERE id = ? AND deleted_at IS NULL')
    .get(userId)) as { id: string; email: string | null; role: Role; is_guest: number | string; email_verified_at: string | null } | undefined;
  if (!user) throw new AdminError('no-such-account', 'There is no such account.', 404);
  return user;
}

export const grantAccessSchema = z
  .object({
    plan: z.enum(GRANTABLE_PLANS),
    examKey: z.string().min(1).max(64).nullable().default(null),
    days: z.number().int().min(1).max(MAX_GRANT_DAYS),
    reason: z.string().trim().min(3).max(300),
  })
  .refine((input) => (input.plan === 'exam_pass') === (input.examKey !== null), {
    message: 'A pass needs an exam; Plus covers every exam and takes none.',
    path: ['examKey'],
  });
export type GrantAccessInput = z.infer<typeof grantAccessSchema>;

/** Gives Plus or a one-exam pass from now for `days` days. */
export async function grantAccess(db: Db, actor: AuthUser, userId: string, input: GrantAccessInput, now = new Date()): Promise<AccessGrantRow> {
  assertAdmin(actor);
  const user = await targetAccount(db, userId);
  if (Number(user.is_guest) === 1) throw new AdminError('guest-account', 'A guest has no account to give access to. They sign up first.', 409);
  if (input.examKey !== null && !getExamConfig(input.examKey)) {
    throw new AdminError('unknown-exam', `"${input.examKey}" is not an exam we serve.`, 400);
  }
  const nowIso = now.toISOString();
  const row: AccessGrantRow = {
    id: randomUUID(),
    user_id: userId,
    plan: input.plan,
    exam_key: input.examKey,
    starts_at: nowIso,
    ends_at: new Date(now.getTime() + input.days * 86_400_000).toISOString(),
    reason: input.reason,
    granted_by: actor.id,
    created_at: nowIso,
    revoked_at: null,
    revoked_by: null,
  };
  try {
    await db
      .prepare(
        `INSERT INTO access_grants (id, user_id, plan, exam_key, starts_at, ends_at, reason, granted_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(row.id, row.user_id, row.plan, row.exam_key, row.starts_at, row.ends_at, row.reason, row.granted_by, row.created_at);
  } catch (error) {
    console.error('[admin] could not give access:', error instanceof Error ? error.message : error);
    throw new AdminError(
      'migration-pending',
      'Access cannot be given yet: run db/postgres/019_access_grants.sql in the Supabase SQL editor first.',
      503,
    );
  }
  await audit(db, actor, 'access.grant', userId, {
    email: user.email,
    grantId: row.id,
    plan: row.plan,
    examKey: row.exam_key,
    endsAt: row.ends_at,
    reason: row.reason,
  }, nowIso);
  return row;
}

export const revokeAccessSchema = z.object({ reason: z.string().trim().min(3).max(300) });

/** Ends a grant now. Its row stays, stamped with who ended it. */
export async function revokeAccess(db: Db, actor: AuthUser, userId: string, grantId: string, reason: string, now = new Date()): Promise<void> {
  assertAdmin(actor);
  const user = await targetAccount(db, userId);
  const nowIso = now.toISOString();
  const result = await db
    .prepare('UPDATE access_grants SET revoked_at = ?, revoked_by = ? WHERE id = ? AND user_id = ? AND revoked_at IS NULL')
    .run(nowIso, actor.id, grantId, userId);
  if (result.changes !== 1) throw new AdminError('no-such-grant', 'That access was not found, or it has already been revoked.', 404);
  await audit(db, actor, 'access.revoke', userId, { email: user.email, grantId, reason }, nowIso);
}

export const setRoleSchema = z.object({
  role: z.enum(ROLES),
  reason: z.string().trim().min(3).max(300),
});

/**
 * Makes an account a learner, an editor or an administrator. Staff roles open
 * every exam and the admin pages, so they need a confirmed address; and nobody
 * changes their own role, so the last administrator cannot lock everyone out.
 */
export async function setRole(db: Db, actor: AuthUser, userId: string, role: Role, reason: string, now = new Date()): Promise<void> {
  assertAdmin(actor);
  if (userId === actor.id) throw new AdminError('own-role', 'You cannot change your own role. Ask another administrator.', 409);
  const user = await targetAccount(db, userId);
  if (Number(user.is_guest) === 1) throw new AdminError('guest-account', 'A guest cannot have a role. They sign up first.', 409);
  if (role !== 'learner' && !user.email_verified_at) {
    throw new AdminError('email-unverified', 'Staff roles need a confirmed email address. Ask them to confirm it first.', 409);
  }
  if (user.role === role) return;
  const nowIso = now.toISOString();
  await db.prepare('UPDATE users SET role = ?, updated_at = ? WHERE id = ?').run(role, nowIso, userId);
  await audit(db, actor, 'user.role', userId, { email: user.email, from: user.role, to: role, reason }, nowIso);
}
