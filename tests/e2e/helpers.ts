import Database from 'better-sqlite3';
import path from 'node:path';

/**
 * Clears rate-limit counters in the disposable end-to-end database.
 *
 * Every browser test comes from 127.0.0.1, so a full run across both device
 * projects creates more guest sessions than the production limit allows one
 * address in an hour (20). The limit itself is unchanged; the tests simply do
 * not share one address's budget. Refuses to touch anything but the e2e file.
 */
export function resetRateLimits(): void {
  const file = path.resolve(process.env.E2E_DATABASE_PATH ?? 'tmp/e2e.db');
  if (path.basename(file) !== 'e2e.db') throw new Error(`Refusing to reset rate limits in ${file}`);
  const db = new Database(file, { fileMustExist: true });
  try {
    db.pragma('busy_timeout = 5000');
    db.prepare('DELETE FROM rate_limits').run();
  } finally {
    db.close();
  }
}
