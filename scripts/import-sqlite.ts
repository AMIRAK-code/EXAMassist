import { loadEnvConfig } from '@next/env';
import Database from 'better-sqlite3';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { getDb, closeDb } from '../src/lib/db';

loadEnvConfig(process.cwd(), true);
const quote = (name: string) => '"' + name.replaceAll('"', '""') + '"';
function digest(rows: Record<string, unknown>[], columns: string[]) {
  return createHash('sha256').update(rows.map(row => JSON.stringify(columns.map(c => row[c]))).sort().join('\n')).digest('hex');
}
async function main() {
  if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL to the target PostgreSQL database.');
  const sourceFile = process.argv[2];
  if (!sourceFile) throw new Error('Usage: npm run db:import-sqlite -- path/to/source.db');
  const source = new Database(path.resolve(sourceFile), { readonly: true, fileMustExist: true });
  const folder = path.resolve('tmp/supabase-migration');
  fs.mkdirSync(folder, { recursive: true });
  const snapshot = path.join(folder, `sqlite-export-${Date.now()}.db`);
  try { await source.backup(snapshot); } finally { source.close(); }
  const sqlite = new Database(snapshot);
  try {
    // Upgrade only the snapshot; never change the user's original SQLite file.
    const applied = new Set((sqlite.prepare('SELECT name FROM _migrations').all() as { name: string }[]).map(r => r.name));
    sqlite.transaction(() => {
      for (const name of fs.readdirSync('db/migrations').filter(f => f.endsWith('.sql')).sort()) {
        if (applied.has(name)) continue;
        sqlite.exec(fs.readFileSync(path.join('db/migrations', name), 'utf8'));
        sqlite.prepare('INSERT INTO _migrations (name, applied_at) VALUES (?, ?)').run(name, new Date().toISOString());
      }
    })();
    const tables = (sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name <> '_migrations' ORDER BY rowid").all() as { name: string }[]).map(r => r.name);
    const db = getDb();
    const report = await db.transaction(async () => {
      const result: { table: string; rows: number; sha256: string }[] = [];
      const targetTables = await db.prepare("SELECT tablename FROM pg_tables WHERE schemaname = 'examer' AND tablename <> '_migrations'").all() as { tablename: string }[];
      if (targetTables.length !== tables.length || targetTables.some(t => !tables.includes(t.tablename))) throw new Error('Source and target table sets differ; refusing import.');
      // Hold target tables for the entire copy so concurrent app writes cannot mix with the import.
      await db.exec(`LOCK TABLE ${tables.map(quote).join(', ')} IN ACCESS EXCLUSIVE MODE`);
      for (const table of tables) {
        const count = await db.prepare(`SELECT count(*) AS n FROM ${quote(table)}`).get() as { n: number };
        if (count.n !== 0) throw new Error(`Target ${table} is not empty. Refusing to overwrite existing data.`);
      }
      for (const table of tables) {
        const rows = sqlite.prepare(`SELECT * FROM ${quote(table)}`).all() as Record<string, unknown>[];
        const columns = (sqlite.prepare(`PRAGMA table_info(${quote(table)})`).all() as { name: string }[]).map(c => c.name);
        for (let offset = 0; offset < rows.length; offset += 100) {
          const batch = rows.slice(offset, offset + 100);
          await db.prepare(`INSERT INTO ${quote(table)} (${columns.map(quote).join(', ')}) VALUES ${batch.map(() => '(' + columns.map(() => '?').join(', ') + ')').join(', ')}`)
            .run(...batch.flatMap(row => columns.map(c => row[c])));
        }
        const actual = await db.prepare(`SELECT ${columns.map(quote).join(', ')} FROM ${quote(table)}`).all() as Record<string, unknown>[];
        const hash = digest(rows, columns);
        if (actual.length !== rows.length || digest(actual, columns) !== hash) throw new Error(`Verification failed for ${table}; import will roll back.`);
        result.push({ table, rows: rows.length, sha256: hash });
      }
      return result;
    })();
    fs.writeFileSync(path.join(folder, 'import-report.json'), JSON.stringify({ snapshot, verifiedAt: new Date().toISOString(), tables: report }, null, 2));
    for (const table of report) console.log(`${table.table}: ${table.rows} rows, content verified`);
    console.log('Import committed. An operator must advance identity sequences before enabling production traffic.');
  } finally { sqlite.close(); await closeDb(); }
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : 'Import failed.'); process.exitCode = 1; });
