import { describe, expect, it } from 'vitest';
import { containsMath, renderMarkdown } from '@/lib/markdown';

/**
 * The maths-font preload (src/lib/content/katex-fonts.ts) runs only for a page
 * with maths. Its test must agree with the renderer exactly: never preload
 * for a page without formulas, never miss one that has them.
 */

const cases = [
  'Solve $x^2 = 4$ for positive $x$.',
  'Display maths:\n\n$$\\frac{a}{b}$$',
  'A plain sentence with no formulas.',
  'An escaped \\$5 fee is not maths.',
  'Ratios of 3:4 and a price of \\$12.50.',
  'A jacket is priced at $\\$80$ before a $25$ percent discount.',
  'A fee of \\$5 and a rate of $\\frac{1}{2}$.',
  '',
];

describe('maths detection for the KaTeX preload', () => {
  it.each(cases)('agrees with the renderer for %j', (source) => {
    expect(containsMath(source)).toBe(renderMarkdown(source).includes('class="katex'));
  });

  it('keeps an escaped dollar inside a formula as part of the formula', () => {
    // Published items write amounts as $\$80$; the escaped dollar must not
    // close the span early and leave a lone backslash for KaTeX to reject.
    const html = renderMarkdown('The price is $\\$80$ and then $\\$64$.');
    expect(html).not.toContain('katex-error');
    expect(html).not.toContain('math-error');
    expect(html.match(/class="katex"/g)).toHaveLength(2);
  });

  it('still reads an escaped dollar outside a formula as plain text', () => {
    const html = renderMarkdown('A fee of \\$5 and another of \\$6.');
    expect(html).not.toContain('class="katex');
    expect(html).toContain('$5');
  });

  it('treats missing text as no maths', () => {
    expect(containsMath(null)).toBe(false);
    expect(containsMath(undefined)).toBe(false);
  });
});
