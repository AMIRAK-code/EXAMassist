import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Drops the database, re-applies migrations and re-seeds the reviewed content.
 *
 *   npm run db:reset
 *
 * Refuses to run against anything that does not look like a local development
 * or test database, so it cannot be pointed at real data by accident.
 */

const configured = process.env.DATABASE_PATH ?? './tmp/examer.db';
const dbPath = path.isAbsolute(configured) ? configured : path.resolve(configured);

const looksDisposable =
  /[\\/]tmp[\\/]/.test(dbPath) || /\.(test|e2e|dev|local)\.db$/.test(path.basename(dbPath));

if (!looksDisposable && process.argv[2] !== '--force') {
  console.error(
    `Refusing to reset ${dbPath}: it does not look like a development or test database.\n` +
      'Pass --force if you are certain.',
  );
  process.exit(1);
}

for (const suffix of ['', '-wal', '-shm']) {
  const file = `${dbPath}${suffix}`;
  if (fs.existsSync(file)) {
    fs.rmSync(file);
    console.log(`removed ${path.relative(process.cwd(), file)}`);
  }
}
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const run = (script: string) =>
  execFileSync('npx', ['tsx', script], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });

run('scripts/migrate.ts');
run('scripts/seed.ts');
console.log('\nDatabase reset.');
