import fs from 'node:fs';
import path from 'node:path';
import { renderMarkdown } from '../../src/lib/markdown';

// Renders every string field of the new banks exactly as the site does and
// reports any maths KaTeX cannot typeset.
const bad: string[] = [];
let fields = 0;
const exams = process.argv.slice(2).length ? process.argv.slice(2) : ['polito-til-i', 'polito-til-a', 'tolc-e', 'tolc-f'];
for (const exam of exams) {
  for (const kind of ['questions', 'stimuli']) {
    const dir = path.join('content', kind, exam);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      const item = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      JSON.stringify(item, (key, value) => {
        if (typeof value === 'string' && value.includes('$')) {
          fields++;
          const html = renderMarkdown(value);
          if (/katex-error|math-error/.test(html)) bad.push(`${exam}/${file} [${key}]`);
        }
        return value;
      });
    }
  }
}
console.log(`${fields} maths-bearing field(s) rendered; ${bad.length} with errors`);
console.log(bad.join('\n'));
