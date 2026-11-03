import type { Db } from '@/lib/db';
import type { AccessGrantRow } from '@/lib/db/rows';

/**
 * Access an administrator gave by hand (migration 019; written by
 * src/lib/admin/users.ts). Read here so entitlements can count it exactly like
 * a paid plan of the same kind.
 */

/** Plans an administrator may give: Plus (every exam) or a one-exam pass. */
export const GRANTABLE_PLANS = ['plus', 'exam_pass'] as const;
export type GrantablePlan = (typeof GRANTABLE_PLANS)[number];

/** Every grant of this account, newest first, revoked ones included. */
export async function listAccessGrants(db: Db, userId: string): Promise<AccessGrantRow[]> {
  return (await db
    .prepare('SELECT * FROM access_grants WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId)) as AccessGrantRow[];
}

/**
 * The same, but empty on a database still awaiting migration 019, where nobody
 * can have been given anything: fail closed, never open.
 */
export async function listAccessGrantsOrNone(db: Db, userId: string): Promise<AccessGrantRow[]> {
  return listAccessGrants(db, userId).catch((error: unknown) => {
    console.error('[billing] could not read access grants:', error instanceof Error ? error.message : error);
    return [];
  });
}
