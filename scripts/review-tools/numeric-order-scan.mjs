import fs from 'node:fs';

// Finds single/multi-select items whose choices are all numeric but are not in
// ascending order by true value (an old parser read \frac{9}{2} as 92).
function numericValue(textMd) {
  const withFractions = textMd
    .replace(/\$+/g, '')
    .replace(/\\[dt]?frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '$1/$2');
  if (/\\(?!text\b|mathrm\b)[a-zA-Z]+/.test(withFractions)) return null;
  const cleaned = withFractions
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}]/g, '')
    .replace(/[,\s]/g, '')
    .trim();
  if (cleaned === '') return null;
  const fraction = /^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(cleaned);
  if (fraction && Number(fraction[2]) !== 0) return Number(fraction[1]) / Number(fraction[2]);
  if (!/^-?\d*\.?\d+%?$/.test(cleaned)) return null;
  return Number(cleaned.replace('%', ''));
}

const out = [];
for (const exam of fs.readdirSync('content/questions')) {
  for (const f of fs.readdirSync(`content/questions/${exam}`)) {
    const q = JSON.parse(fs.readFileSync(`content/questions/${exam}/${f}`, 'utf8'));
    if (!['single_select', 'multi_select'].includes(q.responseType)) continue;
    const values = q.options.map((o) => numericValue(o.textMd));
    if (values.some((v) => v === null)) continue;
    const sorted = values.every((v, i) => i === 0 || values[i - 1] <= v);
    if (!sorted) out.push(`${q.state.padEnd(11)} ${exam}/${q.id}: ${q.options.map((o) => o.textMd).join(' | ')}`);
  }
}
console.log(`${out.length} numeric choice set(s) out of ascending order`);
console.log(out.join('\n'));
