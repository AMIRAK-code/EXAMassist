/**
 * Speakable text for maths, for use as an accessible name.
 *
 * KaTeX renders maths as MathML plus a visual HTML copy. Some assistive
 * technology reads the MathML well; some reads nothing at all from it, and an
 * answer choice that is only maths - "$\frac{2}{3}x + 3$" - then has no name,
 * so the learner hears "radio button, 1 of 4" and nothing else. Where a choice
 * contains maths, the player gives it an explicit spoken label from here.
 *
 * This covers the notation the bank actually uses (scripts/tex-inventory
 * lists it). It is deliberately plain - "2 over 3 x plus 3" - because a
 * predictable reading beats a clever one, and it errs towards reading a
 * symbol literally rather than dropping it.
 */

function readGroup(source: string, start: number): { body: string; end: number } {
  // A braced group {…} starting at `start`, a single command such as \circ,
  // or a single character.
  if (source[start] === '\\') {
    const command = /^\\[a-zA-Z]+/.exec(source.slice(start));
    if (command) return { body: command[0], end: start + command[0].length };
  }
  if (source[start] !== '{') return { body: source[start] ?? '', end: start + 1 };
  let depth = 0;
  for (let i = start; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return { body: source.slice(start + 1, i), end: i + 1 };
    }
  }
  return { body: source.slice(start + 1), end: source.length };
}

const POWERS: Record<string, string> = { '2': 'squared', '3': 'cubed' };

export function spokenMath(tex: string): string {
  let out = '';
  let i = 0;
  const src = tex.trim();

  while (i < src.length) {
    const rest = src.slice(i);
    const command = /^\\([a-zA-Z]+)/.exec(rest);

    if (command) {
      const name = command[1];
      i += command[0].length;
      switch (name) {
        case 'frac':
        case 'dfrac':
        case 'tfrac': {
          const top = readGroup(src, i);
          const bottom = readGroup(src, top.end);
          i = bottom.end;
          out += ` ${spokenMath(top.body)} over ${spokenMath(bottom.body)} `;
          break;
        }
        case 'sqrt': {
          const body = readGroup(src, i);
          i = body.end;
          out += ` square root of ${spokenMath(body.body)} `;
          break;
        }
        case 'text':
        case 'mathrm':
        case 'textrm': {
          const body = readGroup(src, i);
          i = body.end;
          out += ` ${body.body} `;
          break;
        }
        case 'log': {
          if (src[i] === '_') {
            const base = readGroup(src, i + 1);
            i = base.end;
            out += ` log base ${spokenMath(base.body)} of `;
          } else {
            out += ' log ';
          }
          break;
        }
        case 'le':
        case 'leq':
          out += ' is less than or equal to ';
          break;
        case 'ge':
        case 'geq':
          out += ' is greater than or equal to ';
          break;
        case 'ne':
        case 'neq':
          out += ' is not equal to ';
          break;
        case 'times':
        case 'cdot':
          out += ' times ';
          break;
        case 'div':
          out += ' divided by ';
          break;
        case 'pi':
          out += ' pi ';
          break;
        case 'circ':
          out += ' degrees ';
          break;
        case 'left':
        case 'right':
          break;
        default:
          out += ` ${name} `;
      }
      continue;
    }

    const ch = src[i];
    if (ch === '\\') {
      // \% \; \, \  and friends.
      const next = src[i + 1];
      i += 2;
      if (next === '%') out += ' percent ';
      // A literal "$168" is left as a currency sign: screen readers already
      // read "$168" as "168 dollars".
      else if (next === '$') out += ' $';
      else out += ' ';
      continue;
    }
    if (ch === '^') {
      const power = readGroup(src, i + 1);
      i = power.end;
      const body = power.body.trim();
      if (body === '\\circ') out += ' degrees ';
      else out += POWERS[body] ? ` ${POWERS[body]} ` : ` to the power ${spokenMath(body)} `;
      continue;
    }
    if (ch === '_') {
      const sub = readGroup(src, i + 1);
      i = sub.end;
      out += ` sub ${spokenMath(sub.body)} `;
      continue;
    }
    i += 1;
    switch (ch) {
      case '{':
      case '}':
        break;
      case '<':
        out += ' is less than ';
        break;
      case '>':
        out += ' is greater than ';
        break;
      case '=':
        out += ' equals ';
        break;
      case '+':
        out += ' plus ';
        break;
      case '-':
        out += out.trim() === '' || /(?:equals|than|to|plus|minus|times|over|of|\()\s*$/.test(out) ? ' negative ' : ' minus ';
        break;
      case '%':
        out += ' percent ';
        break;
      default:
        out += ch;
    }
  }

  return out.replace(/\s+/g, ' ').trim();
}

/**
 * Plain spoken text for a short Markdown string that may contain inline maths,
 * such as an answer choice. Returns null when there is no maths, in which case
 * the ordinary rendered label already reads correctly.
 */
export function spokenLabel(markdown: string): string | null {
  // Maths delimiters are unescaped dollar signs; "\$" inside maths is a
  // currency sign, not a delimiter.
  const MATH = /(?<!\\)\$\$((?:\\\$|[^$])+?)(?<!\\)\$\$|(?<!\\)\$((?:\\\$|[^$])+?)(?<!\\)\$/g;
  if (!new RegExp(MATH.source).test(markdown)) return null;
  return markdown
    .replace(MATH, (_, display: string, inline: string) => ` ${spokenMath(display ?? inline)} `)
    .replace(/[*_`]/g, '')
    .replace(/\$\s+/g, '$')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .trim();
}
