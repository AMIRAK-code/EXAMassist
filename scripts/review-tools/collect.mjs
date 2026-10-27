import fs from 'node:fs';

// Collects blind-solver verdicts and accessibility-fixer reports from a
// workflow journal into by-question.json, and reports coverage, splits and flags.
//
//   node tmp/review8/collect.mjs <journal.jsonl> <index.json> <out-by-question.json>
const [journal, indexPath, outPath] = process.argv.slice(2);
const rows = fs.readFileSync(journal, 'utf8').split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l)).filter((l) => l.type === 'result');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const batchOf = new Map(index.flatMap((b) => b.files.map((f) => [f.replace(/^.*\//, '').replace(/\.json$/, ''), b.batch])));

// A resumed run can leave an earlier empty result for the same agent label;
// count each non-empty solver result once per batch.
const byQ = {};
const runsPerBatch = {};
for (const row of rows) {
  const r = row.result;
  if (!r) { console.log('EMPTY result', row.agentId); continue; }
  if (r.verdicts) {
    if (!r.verdicts.length) { console.log('ZERO verdicts', row.agentId); continue; }
    const batch = batchOf.get(r.verdicts[0].questionId);
    const run = (runsPerBatch[batch] = (runsPerBatch[batch] ?? 0) + 1) - 1;
    for (const v of r.verdicts) (byQ[v.questionId] ??= []).push({ ...v, run });
    console.log(`solver ${row.agentId}: ${batch} run${run}, ${r.verdicts.length} verdicts`);
  } else if (r.reordered) {
    console.log(`a11y ${row.agentId}: checked ${r.checked}, reordered ${r.reordered.length}, other ${r.otherFixes.length} | ${r.qaScan.slice(0, 80)} | ${r.validatorSummary.slice(0, 80)}`);
    for (const o of r.otherFixes) console.log(`   other: ${o.file.replace(/^.*\//, '')}: ${o.what.slice(0, 160)}`);
  }
}
fs.writeFileSync(outPath, JSON.stringify(byQ, null, 1));

const expected = index.flatMap((b) => b.files.map((f) => f.replace(/^.*\//, '').replace(/\.json$/, '')));
const missing = expected.filter((id) => (byQ[id]?.length ?? 0) < 2);
const extra = Object.keys(byQ).filter((id) => !expected.includes(id));
console.log(`\nitems ${expected.length}; with two solves ${expected.length - missing.length}; missing a solve ${missing.length}; unexpected ids ${extra.length}`);
if (missing.length) console.log('MISSING', missing.map((id) => `${id} (${byQ[id]?.length ?? 0})`).join(', '));
if (extra.length) console.log('UNEXPECTED', extra.join(', '));

const norm = (s) => s.toLowerCase().replace(/\s+/g, '').split(',').sort().join(',');
const splits = Object.entries(byQ).filter(([, rs]) => new Set(rs.map((r) => norm(r.solvedAnswer))).size > 1);
console.log(`\nSPLITS ${splits.length}`);
for (const [id, rs] of splits) console.log(`  ${id}: ${rs.map((r) => r.solvedAnswer).join(' vs ')}`);
const ambiguous = Object.entries(byQ).filter(([, rs]) => rs.some((r) => r.ambiguous));
console.log(`\nAMBIGUOUS ${ambiguous.length}`);
for (const [id, rs] of ambiguous) for (const r of rs.filter((x) => x.ambiguous)) console.log(`  ${id} run${r.run}: ${r.ambiguityReason.slice(0, 300)}`);
console.log('\nCONCERNS');
for (const [id, rs] of Object.entries(byQ)) for (const r of rs) if (r.concern && r.concern.trim()) console.log(`  ${id} run${r.run}: ${r.concern.slice(0, 220)}`);
