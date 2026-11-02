import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import { accountReport } from '@/lib/analytics/accounts';
import { createSession, createSignInSession } from '@/lib/auth/session';
import { createTestDb, createUser } from './helpers/test-db';

/** The admin Users page: accounts, sign-ins and activity as totals. */

// A Wednesday: its week starts on Monday 2 November.
const NOW = new Date('2026-11-04T12:00:00Z');
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);

let db: Db;
beforeEach(async () => {
  db = await createTestDb();
});

async function setUser(id: string, column: 'created_at' | 'deleted_at' | 'email_verified_at', at: Date) {
  await db.prepare(`UPDATE users SET ${column} = ? WHERE id = ?`).run(at.toISOString(), id);
}

describe('the account totals', () => {
  it('counts accounts, guests, confirmed addresses and staff, leaving deleted accounts out', async () => {
    const confirmed = await createUser(db);
    await setUser(confirmed, 'email_verified_at', NOW);
    await createUser(db);
    await createUser(db, { role: 'admin' });
    await createUser(db, { isGuest: true });
    await createUser(db, { isGuest: true });
    await setUser(await createUser(db), 'deleted_at', NOW);

    expect(await accountReport(db, { now: NOW })).toMatchObject({ registered: 3, guests: 2, verifiedEmails: 1, staff: 1 });
  });

  it('counts each person signed in or active once, from their sessions', async () => {
    const twoDevices = await createUser(db);
    await createSession(db, twoDevices, false, NOW);
    await createSession(db, twoDevices, false, NOW);
    // Signed in ten days ago: still signed in (30-day session), active in the month only.
    await createSession(db, await createUser(db), false, daysAgo(10));
    // A guest from ten days ago: the 7-day guest session has expired.
    await createSession(db, await createUser(db, { isGuest: true }), true, daysAgo(10));
    await createSession(db, await createUser(db), false, daysAgo(40));
    const deleted = await createUser(db);
    await createSession(db, deleted, false, NOW);
    await setUser(deleted, 'deleted_at', NOW);

    const report = await accountReport(db, { now: NOW });
    expect(report.signedInNow).toEqual({ registered: 2, guests: 0 });
    expect(report.activeLast7Days).toEqual({ registered: 1, guests: 0 });
    expect(report.activeLast30Days).toEqual({ registered: 2, guests: 1 });
  });
});

describe('week by week', () => {
  it('adds up sign-ups and sign-ins per week, and leaves weeks before the first counted sign-in blank', async () => {
    const thisWeek = await createUser(db);
    await setUser(thisWeek, 'created_at', NOW);
    const lastWeek = await createUser(db);
    await setUser(lastWeek, 'created_at', daysAgo(8));
    await setUser(await createUser(db, { isGuest: true }), 'created_at', daysAgo(8));
    await setUser(await createUser(db), 'created_at', daysAgo(200));

    await createSignInSession(db, lastWeek, daysAgo(8));
    await createSignInSession(db, thisWeek, NOW);
    await createSignInSession(db, thisWeek, NOW);

    const report = await accountReport(db, { now: NOW, weeks: 3 });
    expect(report.signInsCountedSince).toBe('2026-10-27');
    expect(report.weeks).toEqual([
      { weekStart: '2026-11-02', registered: 1, guests: 0, signIns: 2 },
      { weekStart: '2026-10-26', registered: 1, guests: 1, signIns: 1 },
      { weekStart: '2026-10-19', registered: 0, guests: 0, signIns: null },
    ]);
  });

  it('shows no sign-in counts when none was ever recorded, even without the counts table', async () => {
    await db.exec('DROP TABLE funnel_counts');
    const report = await accountReport(db, { now: NOW, weeks: 2 });
    expect(report.signInsCountedSince).toBeNull();
    expect(report.weeks.map((w) => w.signIns)).toEqual([null, null]);
  });
});
