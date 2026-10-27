import fs from 'node:fs';

// Keeps blind verdicts valid across an option reorder. Verdicts name option
// ids; reordering renumbers them. Step "snapshot" records each item's
// id -> text before the reorder; step "translate" rewrites every verdict's
// answer to the id that now carries the same text (within the same column for
// two-part items). Any answer that cannot be translated exactly is an error.
//
//   node translate-verdicts.mjs snapshot <by-question.json> <snapshot.json> <id,...>
//   node translate-verdicts.mjs translate <by-question.json> <snapshot.json>
const [step, byQPath, snapPath, idList] = process.argv.slice(2);
const byQ = JSON.parse(fs.readFileSync(byQPath, 'utf8'));
const fileFor = (id) => {
  for (const exam of fs.readdirSync('content/questions')) {
    const f = `content/questions/${exam}/${id}.json`;
    if (fs.existsSync(f)) return f;
  }
  throw new Error(`no file for ${id}`);
};
const optionsOf = (id) => JSON.parse(fs.readFileSync(fileFor(id), 'utf8')).options;

if (step === 'snapshot') {
  const snap = {};
  for (const id of idList.split(',')) snap[id] = Object.fromEntries(optionsOf(id).map((o) => [o.id, o.textMd]));
  fs.writeFileSync(snapPath, JSON.stringify(snap, null, 1));
  console.log(`snapshot of ${Object.keys(snap).length} item(s)`);
} else if (step === 'translate') {
  const snap = JSON.parse(fs.readFileSync(snapPath, 'utf8'));
  let changed = 0;
  for (const [id, before] of Object.entries(snap)) {
    const after = optionsOf(id);
    const column = (optionId) => (optionId.includes('-') ? optionId.slice(0, optionId.lastIndexOf('-')) : '');
    const translateId = (oldId) => {
      const text = before[oldId];
      if (text === undefined) throw new Error(`${id}: verdict names unknown option ${oldId}`);
      const matches = after.filter((o) => o.textMd === text && column(o.id) === column(oldId));
      if (matches.length !== 1) throw new Error(`${id}: option text for ${oldId} matches ${matches.length} options after the reorder`);
      return matches[0].id;
    };
    for (const run of byQ[id] ?? []) {
      const answer = run.solvedAnswer.trim();
      const translated = answer
        .split(/([,;])/)
        .map((token) => {
          if (token === ',' || token === ';') return token;
          const part = token.trim();
          const colon = part.lastIndexOf(':');
          return colon === -1 ? translateId(part) : `${part.slice(0, colon + 1)}${translateId(part.slice(colon + 1))}`;
        })
        .join('');
      if (translated !== answer) changed++;
      run.solvedAnswer = translated;
    }
  }
  fs.writeFileSync(byQPath, JSON.stringify(byQ, null, 1));
  console.log(`translated verdicts for ${Object.keys(snap).length} item(s); ${changed} answer(s) changed id`);
}
