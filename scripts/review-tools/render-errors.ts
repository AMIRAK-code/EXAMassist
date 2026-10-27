import fs from 'node:fs';
import katex from 'katex';

// Prints every maths span KaTeX cannot typeset, with the error, for the given files.
for (const file of process.argv.slice(2)) {
  const q = JSON.parse(fs.readFileSync(file, 'utf8'));
  JSON.stringify(q, (key, value) => {
    if (typeof value !== 'string' || !value.includes('$')) return value;
    const spans = [...value.replace(/\\\$/g, '').matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g)];
    for (const m of spans) {
      const tex = m[1] ?? m[2];
      try {
        katex.renderToString(tex, { throwOnError: true, strict: false });
      } catch (e) {
        console.log(`${file.replace(/^.*\//, '')} [${key}] ${JSON.stringify(tex).slice(0, 90)} -> ${(e as Error).message.slice(0, 110)}`);
      }
    }
    return value;
  });
}
