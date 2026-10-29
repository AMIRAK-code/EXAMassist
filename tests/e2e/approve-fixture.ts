import { randomUUID } from 'node:crypto';
import path from 'node:path';
import Database from 'better-sqlite3';

/**
 * Browser-test fixture, run by playwright.config.ts right after the
 * disposable end-to-end database is rebuilt.
 *
 * Only human-approved questions are served (src/lib/content/human-review.ts),
 * and a freshly seeded database has no approvals, so without this every
 * learner journey would find nothing to practise. It writes one synthetic
 * approval per published question straight into the ledger, labelled as a
 * test fixture rather than a person. It is not a review and must never run
 * anywhere but the throwaway test database: it refuses any file other than
 * tmp/e2e.db (the same guard as withE2eDb) and any PostgreSQL connection.
 */

if (process.env.DATABASE_URL) throw new Error('Refusing to run the e2e approval fixture with DATABASE_URL set.');
const file = path.resolve(process.env.DATABASE_PATH ?? 'tmp/e2e.db');
if (path.basename(file) !== 'e2e.db' || path.basename(path.dirname(file)) !== 'tmp') {
  throw new Error(`Refusing to write fixture approvals into ${file}: not the e2e database.`);
}

const db = new Database(file, { fileMustExist: true });
const now = new Date().toISOString();
const rows = db
  .prepare(
    `SELECT qv.id, qv.question_id, qv.version, qv.exam_key, qv.review_fingerprint
       FROM question_versions qv
       JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version
      WHERE q.state = 'published' AND qv.state = 'published' AND qv.review_fingerprint IS NOT NULL`,
  )
  .all() as Array<{ id: string; question_id: string; version: number; exam_key: string; review_fingerprint: string }>;
const insert = db.prepare(
  `INSERT INTO question_reviews (id, question_id, question_version_id, question_version, review_fingerprint, exam_key,
     reviewer_user_id, reviewer_name, reviewer_credentials, outcome, checked_json, notes, reviewed_on, created_at)
   VALUES (?, ?, ?, ?, ?, ?, NULL, 'E2E test fixture', 'Synthetic approval in the disposable browser-test database', 'approved',
           '["answer-key","explanation","wording","syllabus-alignment"]', 'Test fixture, not a review.', ?, ?)`,
);
db.transaction(() => {
  for (const row of rows) insert.run(randomUUID(), row.question_id, row.id, row.version, row.review_fingerprint, row.exam_key, now.slice(0, 10), now);
})();
db.close();
console.log(`e2e fixture: ${rows.length} synthetic approvals written to ${path.relative(process.cwd(), file)}`);
