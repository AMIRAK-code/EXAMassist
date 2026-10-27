import fs from 'node:fs';
import path from 'node:path';
import type { Db } from './index';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'db/migrations');

export interface AppliedMigration {
  name: string;
  applied_at: string;
}

async function ensureMigrationsTable(db: Db): Promise<void> {
  (await db.exec(
    `CREATE TABLE IF NOT EXISTS _migrations (
       name       TEXT PRIMARY KEY,
       applied_at TEXT NOT NULL
     )`,
  ));
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
export async function migrate(db: Db, dir: string = MIGRATIONS_DIR): Promise<string[]> {
  if (db.dialect === 'sqlite') await ensureMigrationsTable(db);

  const applied = new Set(
    (await db
      .prepare('SELECT name FROM _migrations')
      .all())
      .map((row) => (row as { name: string }).name),
  );

  const pending = listMigrationFiles(dir).filter((f) => !applied.has(f));
  if (db.dialect === 'postgres') {
    if (pending.length) throw new Error('PostgreSQL schema needs an operator migration; SQLite migrations cannot be applied to Supabase.');
    return [];
  }
  const done: string[] = [];

  for (const file of pending) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    const run = db.transaction(async () => {
      (await db.exec(sql));
      (await db.prepare('INSERT INTO _migrations (name, applied_at) VALUES (?, ?)').run(
        file,
        new Date().toISOString(),
      ));
    });
    (await run());
    done.push(file);
  }

  return done;
}

export async function appliedMigrations(db: Db): Promise<AppliedMigration[]> {
  if (db.dialect === 'sqlite') await ensureMigrationsTable(db);
  return (await db
    .prepare('SELECT name, applied_at FROM _migrations ORDER BY name')
    .all()) as AppliedMigration[];
}
