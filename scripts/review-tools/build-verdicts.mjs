import fs from 'node:fs';

// Builds one apply-review verdict per item from two independent blind solves.
// An item is sent for publication only when both solvers gave the same answer
// and neither flagged a second defensible option; otherwise the dissenting or
// ambiguous run is sent, so apply-review quarantines it. Items whose
// solver-visible text changed after the solve are held back for a fresh solve.
//
//   node scripts/review-tools/build-verdicts.mjs <by-question.json> <index.json> <out.json> [held-ids.json]
//
// Set REVIEW_WAVE (e.g. "wave8") to name the reviewers in the published record.

const [byQuestionPath, indexPath, outPath, heldPath] = process.argv.slice(2);
const byQuestion = JSON.parse(fs.readFileSync(byQuestionPath, 'utf8'));
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const held = new Set(heldPath ? JSON.parse(fs.readFileSync(heldPath, 'utf8')) : []);

const batchOf = new Map();
for (const b of index) for (const f of b.files) batchOf.set(f.replace(/^.*\//, '').replace(/\.json$/, ''), b.batch);

const verdicts = [];
const report = { agreed: 0, split: [], ambiguous: [], held: [], incomplete: [] };
for (const [id, runs] of Object.entries(byQuestion)) {
  if (held.has(id)) { report.held.push(id); continue; }
  if (runs.length < 2) { report.incomplete.push(`${id}: ${runs.length} run(s)`); continue; }
  const batch = batchOf.get(id) ?? 'unknown';
  const by = (r) => `blind-reviewer-${process.env.REVIEW_WAVE ?? 'wave'}-${batch}-run${r.run}`;
  // With more than two runs every run must agree; the first two form the record.
  const answers = new Set(runs.map((r) => r.solvedAnswer.trim().toLowerCase()));
  const [a, b] = answers.size === 1 ? runs : [runs[0], runs.find((r) => r.solvedAnswer.trim().toLowerCase() !== runs[0].solvedAnswer.trim().toLowerCase())];
  const flagged = runs.find((r) => r.ambiguous);
  if (flagged) {
    report.ambiguous.push(id);
    verdicts.push({ questionId: id, solvedAnswer: flagged.solvedAnswer, uniquenessChecked: flagged.uniquenessChecked, workingNotes: flagged.workingNotes, solvedBy: by(flagged), ambiguous: true, ambiguityReason: flagged.ambiguityReason, concern: flagged.concern || undefined });
    continue;
  }
  if (a.solvedAnswer.trim().toLowerCase() !== b.solvedAnswer.trim().toLowerCase()) {
    // One of the two must disagree with the key; apply-review decides which,
    // and a split is never published whichever run matches.
    report.split.push(`${id}: ${a.solvedAnswer} vs ${b.solvedAnswer}`);
    verdicts.push({ questionId: id, solvedAnswer: a.solvedAnswer, uniquenessChecked: false, workingNotes: `Two blind solvers disagreed (${a.solvedAnswer} vs ${b.solvedAnswer}). Run 0: ${a.workingNotes} | Run 1: ${b.workingNotes}`, solvedBy: by(a) });
    continue;
  }
  report.agreed++;
  verdicts.push({
    questionId: id,
    solvedAnswer: a.solvedAnswer,
    uniquenessChecked: a.uniquenessChecked && b.uniquenessChecked,
    workingNotes: `${a.workingNotes} [A second, separate blind solve (${by(b)}) reached the same answer: ${b.workingNotes}]`,
    solvedBy: by(a),
    concern: [a.concern, b.concern].filter(Boolean).join(' | ') || undefined,
  });
}
fs.writeFileSync(outPath, JSON.stringify(verdicts, null, 2) + '\n');
console.log(JSON.stringify({ verdicts: verdicts.length, agreed: report.agreed, split: report.split, ambiguous: report.ambiguous, held: report.held.length, incomplete: report.incomplete }, null, 1));
