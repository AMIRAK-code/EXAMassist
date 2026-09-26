import type { Db } from '@/lib/db';
import { listUnfinishedAttempts } from '@/lib/attempts/service';
import { dashboardHref, examDisplayName } from './dashboard';

/**
 * The homepage's "Continue studying" line for a returning learner.
 *
 * Only for someone with something to continue: an unfinished attempt, or at
 * least one finished session. A guest session with nothing in it gets nothing,
 * so their homepage is the first-time visitor's. Built per request on the
 * server for the learner the session cookie names; it is never cached.
 */

export interface ContinueStudying {
  kind: 'unfinished' | 'history';
  /** One line: what and where. */
  detail: string;
  href: string;
  actionLabel: string;
}

export function continueStudying(db: Db, userId: string, now = new Date()): ContinueStudying | null {
  const unfinished = listUnfinishedAttempts(db, userId, now);
  if (unfinished.length > 0) {
    const latest = unfinished[0];
    const others = unfinished.length - 1;
    return {
      kind: 'unfinished',
      detail: `${examDisplayName(latest.examKey)}, question ${latest.resumeQuestion} of ${latest.questionCount}${
        others > 0 ? `, and ${others} more unfinished` : ''
      }`,
      href: `/attempt/${latest.id}`,
      actionLabel: 'Continue',
    };
  }

  const finished = db
    .prepare(
      `SELECT exam_key AS examKey FROM attempts
        WHERE user_id = ? AND status IN ('submitted', 'expired')
        ORDER BY COALESCE(submitted_at, started_at) DESC LIMIT 1`,
    )
    .get(userId) as { examKey: string } | undefined;
  if (!finished) return null;

  return {
    kind: 'history',
    detail: `Your ${examDisplayName(finished.examKey)} results and next step are on your dashboard`,
    href: dashboardHref(finished.examKey),
    actionLabel: 'Your dashboard',
  };
}
