import { getDb } from '../src/lib/db';
import { appliedMigrations, migrate } from '../src/lib/db/migrate';

function main(): void {
  const db = getDb();
  const applied = migrate(db);

  if (applied.length === 0) {
    console.log('Database is up to date.');
  } else {
    for (const name of applied) console.log(`applied  ${name}`);
  }

  console.log('\nMigrations on record:');
  for (const row of appliedMigrations(db)) {
    console.log(`  ${row.name}  (${row.applied_at})`);
  }
}

main();
