import fs from 'node:fs';
import path from 'node:path';
import type { Db } from './index';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'db/migrations');

export interface AppliedMigration {
  name: string;
  applied_at: string;
}

function ensureMigrationsTable(db: Db): void {
  db.exec(
    `CREATE TABLE IF NOT EXISTS _migrations (
       name       TEXT PRIMARY KEY,
       applied_at TEXT NOT NULL
     )`,
  );
}

export function listMigrationFiles(dir: string = MIGRATIONS_DIR): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b, 'en'));
}

/**
 * Applies every migration that has not been applied yet, in filename order.
 * Each migration runs inside a transaction, so a failing migration leaves the
 * database untouched.
 */
export function migrate(db: Db, dir: string = MIGRATIONS_DIR): string[] {
  ensureMigrationsTable(db);

  const applied = new Set(
    db
      .prepare('SELECT name FROM _migrations')
      .all()
      .map((row) => (row as { name: string }).name),
  );

  const pending = listMigrationFiles(dir).filter((f) => !applied.has(f));
  const done: string[] = [];

  for (const file of pending) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    const run = db.transaction(() => {
      db.exec(sql);
      db.prepare('INSERT INTO _migrations (name, applied_at) VALUES (?, ?)').run(
        file,
        new Date().toISOString(),
      );
    });
    run();
    done.push(file);
  }

  return done;
}

export function appliedMigrations(db: Db): AppliedMigration[] {
  ensureMigrationsTable(db);
  return db
    .prepare('SELECT name, applied_at FROM _migrations ORDER BY name')
    .all() as AppliedMigration[];
}
