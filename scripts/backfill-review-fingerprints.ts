import { loadEnvConfig } from '@next/env';
import { getDb, closeDb } from '../src/lib/db';
import type { QuestionVersionRow, StimulusRow } from '../src/lib/db/rows';
import { contentFromRows, reviewFingerprint } from '../src/lib/content/human-review';

loadEnvConfig(process.cwd(), true);

/**
 * Gives existing question_versions rows their content fingerprint (migration
 * 014) without a full re-seed, so reviewers can approve what is already
 * served. The fingerprint is computed from each row's own stored text, i.e.
 * from exactly what learners see; nothing else is written.
 *
 *   npx tsx scripts/backfill-review-fingerprints.ts                 # dry run
 *   npx tsx scripts/backfill-review-fingerprints.ts --apply          # SQLite
 *   npx tsx scripts/backfill-review-fingerprints.ts --apply --target=production
 *
 * A later `npm run db:seed` recomputes every fingerprint from the content
 * files; where a file says something different from its row, the fingerprint
 * changes and any approval of the old text stops counting, as it should.
 *
 * Against PostgreSQL it refuses to run without --target=production, because
 * this checkout's .env.local points at the production database.
 */

async function main(): Promise<void> {
  const apply = process.argv.includes('--apply');
  const db = getDb();
  if (db.dialect === 'postgres' && !process.argv.includes('--target=production')) {
    console.error('DATABASE_URL points at PostgreSQL. Pass --target=production to confirm that is intended.');
    process.exit(1);
  }
  const rows = (await db.prepare('SELECT * FROM question_versions').all()) as QuestionVersionRow[];
  const stimuli = new Map(
    ((await db.prepare('SELECT * FROM stimuli').all()) as StimulusRow[]).map((s) => [`${s.id}@${s.version}`, s]),
  );
  let missing = 0;
  let stale = 0;
  const writes: Array<[string, string]> = [];
  for (const row of rows) {
    const stimulus = row.stimulus_id ? stimuli.get(`${row.stimulus_id}@${row.stimulus_version}`) ?? null : null;
    const fingerprint = reviewFingerprint(contentFromRows(row, stimulus));
    if (row.review_fingerprint === fingerprint) continue;
    if (row.review_fingerprint) stale += 1;
    else missing += 1;
    writes.push([fingerprint, row.id]);
  }
  console.log(`${rows.length} version row(s): ${missing} without a fingerprint, ${stale} whose stored fingerprint no longer matches their text.`);
  if (stale > 0) console.log('Rows whose fingerprint changes lose any approval of their earlier text.');
  if (!apply) {
    console.log('Dry run: nothing written. Add --apply to write.');
    await closeDb();
    return;
  }
  const write = db.transaction(async () => {
    for (const [fingerprint, id] of writes) {
      await db.prepare('UPDATE question_versions SET review_fingerprint = ? WHERE id = ?').run(fingerprint, id);
    }
  });
  await write();
  console.log(`Wrote ${writes.length} fingerprint(s).`);
  await closeDb();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
