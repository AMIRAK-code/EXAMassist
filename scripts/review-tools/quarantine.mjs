import fs from 'node:fs';

// Quarantines an item with a recorded reason. It stays in the bank for a human
// to resolve but is excluded from every format and from blind export.
//
//   node tmp/review8/quarantine.mjs <file> "<reason>"
const [file, reason] = process.argv.slice(2);
if (!file || !reason) throw new Error('usage: quarantine.mjs <file> "<reason>"');
const q = JSON.parse(fs.readFileSync(file, 'utf8'));
q.state = 'quarantined';
q.quarantine = { reason, replacedBy: null };
fs.writeFileSync(file, JSON.stringify(q, null, 2) + '\n');
console.log(`${q.id}: quarantined`);
