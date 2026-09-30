import fs from 'node:fs';

// Returns published items whose solver-visible text was edited to review:
// bumps the version, clears the old blind-solve record, and notes why. The
// items are then exported and solved blind again like any new item.
//
//   node tmp/review8/reversion.mjs "<note>" <file>...
const [note, ...files] = process.argv.slice(2);
if (!note || !files.length) throw new Error('usage: reversion.mjs "<note>" <file>...');
for (const file of files) {
  const q = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (q.state !== 'published') throw new Error(`${file}: state is ${q.state}, expected published`);
  q.version += 1;
  q.state = 'in_review';
  q.review.reviewer = null;
  q.review.reviewedOn = null;
  q.review.independentSolve = null;
  q.review.notes = `${q.review.notes ? `${q.review.notes} ` : ''}v${q.version}: ${note}`;
  fs.writeFileSync(file, JSON.stringify(q, null, 2) + '\n');
  console.log(`${q.id}: v${q.version} in_review`);
}
