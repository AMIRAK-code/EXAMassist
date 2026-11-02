import type { Db } from '@/lib/db';

/**
 * Accounts, sign-ins and activity as totals, for the admin Users page.
 *
 * Nothing here returns a person: every figure is a count. "Signed in now" and
 * "active" come from the sessions table, whose rows are deleted at sign-out
 * and expiry, so both are lower bounds. Sign-ins are the daily `sign_in` totals
 * in funnel_counts (src/lib/analytics/funnel.ts), which exist only from the
 * deploy that started counting them. Deleted accounts are left out of the
 * account and activity figures, but their sign-up still happened, so the weekly
 * sign-ups keep them.
 */

export interface Split {
  registered: number;
  guests: number;
}

export interface AccountWeek {
  /** The Monday (UTC) the week starts on, as YYYY-MM-DD. */
  weekStart: string;
  registered: number;
  guests: number;
  /** Null for a week before sign-ins were first counted. */
  signIns: number | null;
}

export interface AccountReport {
  registered: number;
  guests: number;
  verifiedEmails: number;
  staff: number;
  signedInNow: Split;
  activeLast7Days: Split;
  activeLast30Days: Split;
  /** Newest week first. */
  weeks: AccountWeek[];
  /** The first day with a counted sign-in, or null before any. */
  signInsCountedSince: string | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function mondayOf(day: string): string {
  const date = new Date(`${day}T00:00:00Z`);
  return new Date(date.getTime() - ((date.getUTCDay() + 6) % 7) * DAY_MS).toISOString().slice(0, 10);
}

async function peopleWithSessions(db: Db, where: 'expires_at >' | 'last_seen_at >=', at: string): Promise<Split> {
  const rows = (await db
    .prepare(
      `SELECT u.is_guest AS guest, COUNT(DISTINCT s.user_id) AS n
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE u.deleted_at IS NULL AND s.${where} ?
       GROUP BY u.is_guest`,
    )
    .all(at)) as Array<{ guest: number; n: number }>;
  const count = (guest: boolean) => Number(rows.find((r) => Number(r.guest) === (guest ? 1 : 0))?.n ?? 0);
  return { registered: count(false), guests: count(true) };
}

export async function accountReport(db: Db, options: { weeks?: number; now?: Date } = {}): Promise<AccountReport> {
  const now = options.now ?? new Date();
  const weekCount = options.weeks ?? 12;

  const totals = (await db
    .prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN is_guest = 0 THEN 1 ELSE 0 END), 0) AS registered,
         COALESCE(SUM(CASE WHEN is_guest = 1 THEN 1 ELSE 0 END), 0) AS guests,
         COALESCE(SUM(CASE WHEN is_guest = 0 AND email_verified_at IS NOT NULL THEN 1 ELSE 0 END), 0) AS verifiedEmails,
         COALESCE(SUM(CASE WHEN role IN ('admin', 'editor') THEN 1 ELSE 0 END), 0) AS staff
       FROM users WHERE deleted_at IS NULL`,
    )
    .get()) as { registered: number; guests: number; verifiedEmails: number; staff: number };

  const thisWeek = mondayOf(now.toISOString().slice(0, 10));
  const weekStarts = Array.from({ length: weekCount }, (_, i) =>
    new Date(new Date(`${thisWeek}T00:00:00Z`).getTime() - i * 7 * DAY_MS).toISOString().slice(0, 10),
  );
  const from = weekStarts[weekStarts.length - 1];
  const weeks = new Map(weekStarts.map((weekStart) => [weekStart, { weekStart, registered: 0, guests: 0, signIns: 0 }]));

  const signUps = (await db
    .prepare(
      `SELECT substr(created_at, 1, 10) AS day, is_guest AS guest, COUNT(*) AS n
       FROM users WHERE created_at >= ?
       GROUP BY substr(created_at, 1, 10), is_guest`,
    )
    .all(from)) as Array<{ day: string; guest: number; n: number }>;
  for (const row of signUps) {
    const week = weeks.get(mondayOf(row.day));
    if (!week) continue;
    if (Number(row.guest) === 1) week.guests += Number(row.n);
    else week.registered += Number(row.n);
  }

  let signInsCountedSince: string | null = null;
  try {
    const signIns = (await db
      .prepare("SELECT day, SUM(count) AS n FROM funnel_counts WHERE event = 'sign_in' AND day >= ? GROUP BY day")
      .all(from)) as Array<{ day: string; n: number }>;
    for (const row of signIns) {
      const week = weeks.get(mondayOf(row.day));
      if (week) week.signIns += Number(row.n);
    }
    const first = (await db.prepare("SELECT MIN(day) AS day FROM funnel_counts WHERE event = 'sign_in'").get()) as
      | { day: string | null }
      | undefined;
    signInsCountedSince = first?.day ?? null;
  } catch {
    // A database without migration 011 has no counts; the page says so.
  }

  return {
    registered: Number(totals.registered),
    guests: Number(totals.guests),
    verifiedEmails: Number(totals.verifiedEmails),
    staff: Number(totals.staff),
    signedInNow: await peopleWithSessions(db, 'expires_at >', now.toISOString()),
    activeLast7Days: await peopleWithSessions(db, 'last_seen_at >=', new Date(now.getTime() - 7 * DAY_MS).toISOString()),
    activeLast30Days: await peopleWithSessions(db, 'last_seen_at >=', new Date(now.getTime() - 30 * DAY_MS).toISOString()),
    weeks: [...weeks.values()].map((week) => ({
      ...week,
      signIns: signInsCountedSince && week.weekStart >= mondayOf(signInsCountedSince) ? week.signIns : null,
    })),
    signInsCountedSince,
  };
}
