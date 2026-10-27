import fs from 'node:fs';

// Answer-length cueing: how often the single-select key is the longest choice,
// and by how much. With n choices, chance is 1/n; a bank well above that
// teaches "pick the longest". Flags items whose key is at least 30% longer
// than the next-longest choice.
const exams = process.argv.slice(2);
for (const exam of exams) {
  const dir = `content/questions/${exam}`;
  let n = 0, longest = 0, chance = 0;
  const flagged = [];
  for (const f of fs.readdirSync(dir)) {
    const q = JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8'));
    if (q.responseType !== 'single_select' || q.state === 'quarantined') continue;
    if (q.options.some((o) => /^\s*\$?-?[\d.,]+/.test(o.textMd) && o.textMd.length < 25)) continue; // numeric sets
    const key = q.answerKey.optionId;
    const lens = q.options.map((o) => ({ id: o.id, len: o.textMd.length }));
    const k = lens.find((l) => l.id === key)?.len ?? 0;
    const others = lens.filter((l) => l.id !== key).map((l) => l.len);
    const maxOther = Math.max(...others);
    n++;
    chance += 1 / q.options.length;
    if (k > maxOther) longest++;
    if (k >= maxOther * 1.3) flagged.push(`${q.id} (${q.state}): key ${k} vs next ${maxOther}`);
  }
  console.log(`\n${exam}: ${n} verbal single-select items; key is the longest in ${longest} (${Math.round((100 * longest) / n)}%, chance ${Math.round((100 * chance) / n)}%); ${flagged.length} flagged`);
  if (flagged.length) console.log('  ' + flagged.join('\n  '));
}
