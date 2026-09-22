import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Single shared SQLite connection.
 *
 * Why SQLite: this environment has neither PostgreSQL nor Docker available, so
 * a Postgres-only app could not be run or verified here. The schema and all
 * queries stay deliberately portable; see docs/ARCHITECTURE.md.
 *
 * better-sqlite3 is synchronous, which is exactly what the assessment engine
 * wants: `db.transaction(...)` gives us real atomicity for submit/score without
 * interleaving await points.
 */

export type Db = Database.Database;

declare global {
  // eslint-disable-next-line no-var
  var __examerDb: Db | undefined;
}

function resolveDatabasePath(): string {
  const configured = process.env.DATABASE_PATH ?? './tmp/examer.db';
  return path.isAbsolute(configured) ? configured : path.resolve(process.cwd(), configured);
}

function open(): Db {
  const file = resolveDatabasePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });

  const db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  db.pragma('synchronous = NORMAL');
  return db;
}

/**
 * Next.js dev-mode module reloading would otherwise open a new file handle on
 * every hot reload, so the connection is cached on globalThis.
 */
export function getDb(): Db {
  if (!globalThis.__examerDb) {
    globalThis.__examerDb = open();
  }
  return globalThis.__examerDb;
}

/** Test helper: open an isolated in-memory database. */
export function openMemoryDb(): Db {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  return db;
}

export function closeDb(): void {
  if (globalThis.__examerDb) {
    globalThis.__examerDb.close();
    globalThis.__examerDb = undefined;
  }
}
