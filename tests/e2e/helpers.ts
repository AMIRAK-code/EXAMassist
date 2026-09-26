import Database from 'better-sqlite3';
import path from 'node:path';

/**
 * Runs `fn` against the disposable end-to-end database, and refuses to open
 * any other file. Used to reach states a browser cannot reach in reasonable
 * time: a clock that has run out, a guest session in its last days.
 */
export function withE2eDb<T>(fn: (db: Database.Database) => T): T {
  const file = path.resolve(process.env.E2E_DATABASE_PATH ?? 'tmp/e2e.db');
  if (path.basename(file) !== 'e2e.db') throw new Error(`Refusing to open ${file}: not the e2e database`);
  const db = new Database(file, { fileMustExist: true });
  try {
    db.pragma('busy_timeout = 5000');
    return fn(db);
  } finally {
    db.close();
  }
}

/**
 * Clears rate-limit counters in the disposable end-to-end database.
 *
 * Every browser test comes from 127.0.0.1, so a full run across both device
 * projects creates more guest sessions than the production limit allows one
 * address in an hour (20). The limit itself is unchanged; the tests simply do
 * not share one address's budget.
 */
export function resetRateLimits(): void {
  withE2eDb((db) => {
    db.prepare('DELETE FROM rate_limits').run();
  });
}
