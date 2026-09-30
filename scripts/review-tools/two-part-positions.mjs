import fs from 'node:fs';

// For every two_part item: the position of each column's correct option within
// that column, in array (on-screen) order. A bank where the key is always first
// teaches "pick the first word".
const tally = {};
for (const exam of fs.readdirSync('content/questions')) {
  for (const f of fs.readdirSync(`content/questions/${exam}`)) {
    const q = JSON.parse(fs.readFileSync(`content/questions/${exam}/${f}`, 'utf8'));
    if (q.responseType !== 'two_part') continue;
    const positions = q.answerKey.selections.map(({ columnId, optionId }) => {
      const col = q.options.filter((o) => o.id.startsWith(`${columnId}-`)).map((o) => o.id);
      const pos = col.indexOf(optionId) + 1;
      tally[pos] = (tally[pos] ?? 0) + 1;
      return `${columnId}:${pos}/${col.length}`;
    });
    console.log(`${q.state.padEnd(11)} ${q.id.padEnd(42)} ${positions.join('  ')}`);
  }
}
console.log('\nkey position within column -> count:', JSON.stringify(tally));
