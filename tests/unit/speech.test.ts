import { describe, expect, it } from 'vitest';
import { spokenLabel, spokenMath } from '@/lib/speech';

/**
 * Spoken labels for maths answer choices. The cases are real choices from the
 * bank: each one is a radio button that otherwise has no reliable name.
 */

describe('spokenMath', () => {
  it('reads fractions, signs and relations plainly', () => {
    expect(spokenMath('y = \\frac{2}{3}x + 3')).toBe('y equals 2 over 3 x plus 3');
    expect(spokenMath('y = -\\frac{3}{2}x + 3')).toBe('y equals negative 3 over 2 x plus 3');
    expect(spokenMath('-4 \\le x \\le -1')).toBe('negative 4 is less than or equal to x is less than or equal to negative 1');
    expect(spokenMath('x - 1')).toBe('x minus 1');
  });

  it('reads powers, roots, percentages, degrees and logarithms', () => {
    expect(spokenMath('x^3 < x^2')).toBe('x cubed is less than x squared');
    expect(spokenMath('2a^{7}b^{6}')).toBe('2a to the power 7 b to the power 6');
    expect(spokenMath('\\sqrt{2}')).toBe('square root of 2');
    expect(spokenMath('67.5\\%')).toBe('67.5 percent');
    expect(spokenMath('30^\\circ')).toBe('30 degrees');
    expect(spokenMath('\\log_{2}(x)')).toBe('log base 2 of (x)');
    expect(spokenMath('12\\pi')).toBe('12 pi');
  });

  it('keeps text inside \\text and drops spacing commands', () => {
    expect(spokenMath('14\\;\\text{cm}')).toBe('14 cm');
  });
});

describe('spokenLabel', () => {
  it('is null for a choice with no maths, whose visible label already reads well', () => {
    expect(spokenLabel('It is a point granted to the opponents.')).toBeNull();
  });

  it('converts the maths and keeps the words around it', () => {
    expect(spokenLabel('$14$ cm')).toBe('14 cm');
    expect(spokenLabel('Between $\\frac{1}{4}$ and $\\frac{1}{2}$')).toBe('Between 1 over 4 and 1 over 2');
  });
});
