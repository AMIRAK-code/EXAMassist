import { loadEnvConfig } from '@next/env';
import { getDb } from '../src/lib/db';
import { appliedMigrations, migrate } from '../src/lib/db/migrate';

loadEnvConfig(process.cwd(), true);

async function main(): Promise<void> {
  const db = getDb();
  const applied = (await migrate(db));

  if (applied.length === 0) {
    console.log('Database is up to date.');
  } else {
    for (const name of applied) console.log(`applied  ${name}`);
  }

  console.log('\nMigrations on record:');
  for (const row of (await appliedMigrations(db))) {
    console.log(`  ${row.name}  (${row.applied_at})`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
