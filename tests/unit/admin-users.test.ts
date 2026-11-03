import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import type { AuthUser } from '@/lib/auth/session';
import { AdminError, getUserDetail, grantAccess, grantAccessSchema, listUsers, revokeAccess, setRole } from '@/lib/admin/users';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { createTestDb, createUser } from './helpers/test-db';
import { ON } from './helpers/fake-stripe';

let db: Db;
let admin: AuthUser;
let learner: string;

async function authUser(id: string): Promise<AuthUser> {
  const row = (await db.prepare('SELECT * FROM users WHERE id = ?').get(id)) as { id: string; email: string; role: AuthUser['role'] };
  return { id: row.id, email: row.email, role: row.role, isGuest: false, displayName: null, locale: 'en', emailVerifiedAt: null } as unknown as AuthUser;
}

async function confirm(id: string) {
  await db.prepare('UPDATE users SET email_verified_at = ? WHERE id = ?').run('2026-11-01T00:00:00.000Z', id);
}

beforeEach(async () => {
  db = await createTestDb();
  admin = await authUser(await createUser(db, { role: 'admin' }));
  learner = await createUser(db);
});

const NOW = new Date('2026-11-03T12:00:00.000Z');
const access = async (examKey: string, now = NOW) => (await loadEntitlements(db, learner, { settings: ON, now })).can('practice', examKey);

describe('giving access by hand', () => {
  it('opens every exam with Plus for the days given, then closes it', async () => {
    expect(await access('gmat')).toBe(false);
    await grantAccess(db, admin, learner, grantAccessSchema.parse({ plan: 'plus', days: 30, reason: 'Tester' }), NOW);
    expect(await access('gmat')).toBe(true);
    expect(await access('digital-sat')).toBe(true);
    expect(await access('gmat', new Date('2026-12-03T12:00:01.000Z'))).toBe(false);
  });

  it('opens only the chosen exam with a one-exam grant', async () => {
    await grantAccess(db, admin, learner, grantAccessSchema.parse({ plan: 'exam_pass', examKey: 'gmat', days: 10, reason: 'Partner' }), NOW);
    expect(await access('gmat')).toBe(true);
    expect(await access('lsat')).toBe(false);
  });

  it('closes access when revoked, keeps the row, and records both changes', async () => {
    const grant = await grantAccess(db, admin, learner, grantAccessSchema.parse({ plan: 'plus', days: 30, reason: 'Tester' }), NOW);
    await revokeAccess(db, admin, learner, grant.id, 'Test finished', NOW);
    expect(await access('gmat')).toBe(false);
    await expect(revokeAccess(db, admin, learner, grant.id, 'Again', NOW)).rejects.toMatchObject({ code: 'no-such-grant', status: 404 });
    const detail = await getUserDetail(db, learner, NOW);
    expect(detail?.grants).toHaveLength(1);
    expect(detail?.grants?.[0].revoked_by).toBe(admin.id);
    expect(detail?.audit.map((entry) => entry.action)).toEqual(['access.revoke', 'access.grant']);
    expect(detail?.audit[1].payload).toMatchObject({ plan: 'plus', reason: 'Tester' });
  });

  it('refuses a pass without an exam, Plus with one, an unknown exam, a guest, and a non-admin', async () => {
    expect(() => grantAccessSchema.parse({ plan: 'exam_pass', days: 5, reason: 'x y z' })).toThrow();
    expect(() => grantAccessSchema.parse({ plan: 'plus', examKey: 'gmat', days: 5, reason: 'x y z' })).toThrow();
    expect(() => grantAccessSchema.parse({ plan: 'plus', days: 0, reason: 'x y z' })).toThrow();
    await expect(grantAccess(db, admin, learner, { plan: 'exam_pass', examKey: 'not-an-exam', days: 5, reason: 'xyz' }, NOW)).rejects.toMatchObject({
      code: 'unknown-exam',
    });
    const guest = await createUser(db, { isGuest: true });
    await expect(grantAccess(db, admin, guest, { plan: 'plus', examKey: null, days: 5, reason: 'xyz' }, NOW)).rejects.toMatchObject({ code: 'guest-account' });
    const editor = await authUser(await createUser(db, { role: 'editor' }));
    await expect(grantAccess(db, editor, learner, { plan: 'plus', examKey: null, days: 5, reason: 'xyz' }, NOW)).rejects.toBeInstanceOf(AdminError);
    expect(await access('gmat')).toBe(false);
  });
});

describe('roles', () => {
  it('makes a confirmed account an editor and records who did it', async () => {
    await confirm(learner);
    await setRole(db, admin, learner, 'editor', 'Joins the content team', NOW);
    const detail = await getUserDetail(db, learner, NOW);
    expect(detail?.role).toBe('editor');
    expect(detail?.audit[0]).toMatchObject({ action: 'user.role', actorEmail: admin.email, payload: { from: 'learner', to: 'editor' } });
  });

  it('refuses a staff role for an unconfirmed address, and any change to your own role', async () => {
    await expect(setRole(db, admin, learner, 'admin', 'Promote', NOW)).rejects.toMatchObject({ code: 'email-unverified' });
    await expect(setRole(db, admin, admin.id, 'learner', 'Step down', NOW)).rejects.toMatchObject({ code: 'own-role' });
    await setRole(db, admin, learner, 'learner', 'No change', NOW);
    expect((await getUserDetail(db, learner, NOW))?.audit).toHaveLength(0);
  });
});

describe('the list of people', () => {
  it('finds accounts by part of the address in any case, leaves guests out, and labels live access', async () => {
    await createUser(db, { isGuest: true });
    const email = ((await db.prepare('SELECT email FROM users WHERE id = ?').get(learner)) as { email: string }).email;
    await grantAccess(db, admin, learner, { plan: 'exam_pass', examKey: 'gmat', days: 5, reason: 'xyz' }, NOW);
    const all = await listUsers(db, {}, NOW);
    expect(all.users.every((user) => !user.isGuest)).toBe(true);
    expect(all.users).toHaveLength(2);
    const found = await listUsers(db, { query: email.slice(0, 12).toUpperCase() }, NOW);
    expect(found.users.map((user) => user.id)).toEqual([learner]);
    expect(found.users[0].access).toEqual(['Given: Pass: GMAT Exam']);
    expect((await listUsers(db, { query: '%' }, NOW)).users).toHaveLength(0);
    expect((await listUsers(db, { includeGuests: true }, NOW)).users).toHaveLength(3);
  });
});
