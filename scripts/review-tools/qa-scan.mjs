import fs from 'node:fs';
import path from 'node:path';

// Finds content damaged by scripting accidents that schema validation cannot see:
// control characters where a TeX backslash was eaten ("\f" -> form feed,
// "\t" -> tab, "\b" -> backspace), TeX commands missing their backslash, and
// option counts other than five.
// Exams come from the command line; with none, the four PoliTo and TOLC banks.
const FIVE_OPTION_EXAMS = ['polito-til-i', 'polito-til-a', 'tolc-e', 'tolc-f'];
const EXAMS = process.argv.slice(2).length ? process.argv.slice(2) : FIVE_OPTION_EXAMS;
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/;
const TEX_WORDS = ['frac', 'sqrt', 'times', 'cdot', 'leq', 'geq', 'neq', 'text', 'log', 'sin', 'cos', 'tan', 'pi', 'circ', 'dfrac', 'left', 'right', 'mathrm', 'mathbf', 'operatorname', 'overline', 'vec', 'hat'];
// Inside maths, a command name standing as a whole word with no backslash.
const MATH_BARE = /(?<![\\a-zA-Z])(?:times|cdot|approx|leq|geq|neq|infty|alpha|beta|gamma|Delta|delta|Omega|omega|theta|lambda|rho|sigma|mu|frac|dfrac|sqrt|mathrm|text|circ|quad|ldots|cdots|rightarrow|Rightarrow|pm|degree|equiv|dots)(?![a-zA-Z])/;
const bareTex = new RegExp(`\\$[^$]*(?<![\\\\a-zA-Z])(?:${TEX_WORDS.join('|')})\\{`, 'g');

const report = [];
for (const exam of EXAMS) {
  for (const kind of ['questions', 'stimuli']) {
    const dir = path.join('content', kind, exam);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      let item;
      try {
        item = JSON.parse(raw);
      } catch (error) {
        report.push(`${exam}/${file}: INVALID JSON (${error.message})`);
        continue;
      }
      const fields = {
        stemMd: item.stemMd,
        explanationMd: item.explanationMd,
        bodyMd: item.bodyMd,
        accessibilityText: item.accessibilityText,
        ...Object.fromEntries((item.options ?? []).map((o) => [`option ${o.id}`, o.textMd])),
        ...Object.fromEntries(Object.entries(item.distractorRationale ?? {}).map(([k, v]) => [`rationale ${k}`, v])),
      };
      for (const [name, value] of Object.entries(fields)) {
        if (typeof value !== 'string') continue;
        if (CONTROL.test(value)) report.push(`${exam}/${file}: control character in ${name}`);
        // A tab or carriage return is never intended in content, and a newline
        // inside inline maths is how an eaten "\n" (as in \neq) shows up.
        if (/[\t\r]/.test(value)) report.push(`${exam}/${file}: tab or carriage return in ${name}`);
        for (const m of value.replace(/\\\$/g, '').matchAll(/\$([^$]*)\$/g)) {
          if (m[1].includes('\n')) report.push(`${exam}/${file}: newline inside maths in ${name}: ${JSON.stringify(m[0].slice(0, 30))}`);
          const bareWord = m[1].replace(/\\text\{[^}]*\}/g, '').match(MATH_BARE);
          if (bareWord) report.push(`${exam}/${file}: TeX command without backslash in ${name}: ${JSON.stringify(m[0].slice(0, 40))}`);
        }
        const bare = value.match(bareTex);
        if (bare) report.push(`${exam}/${file}: TeX command without backslash in ${name}: ${bare[0].slice(-30)}`);
        const dollars = (value.replace(/\\\$/g, '').match(/\$/g) ?? []).length;
        if (dollars % 2 === 1) report.push(`${exam}/${file}: unbalanced $ in ${name}`);
      }
      if (kind === 'questions' && FIVE_OPTION_EXAMS.includes(exam) && item.options?.length !== 5) {
        report.push(`${exam}/${file}: ${item.options?.length ?? 0} options, expected 5`);
      }
    }
  }
}
console.log(report.length ? report.join('\n') : 'no damage found');
console.log(`${report.length} problem(s)`);
