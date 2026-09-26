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
  '',
];

describe('maths detection for the KaTeX preload', () => {
  it.each(cases)('agrees with the renderer for %j', (source) => {
    expect(containsMath(source)).toBe(renderMarkdown(source).includes('class="katex'));
  });

  it('treats missing text as no maths', () => {
    expect(containsMath(null)).toBe(false);
    expect(containsMath(undefined)).toBe(false);
  });
});
