import type { Unit } from '../../types';
import { integersLesson } from './integers-divisibility-and-primes';
import { remaindersLesson } from './remainders-odd-even-and-sign';
import { exponentsLesson } from './exponents-and-roots';
import { fractionsLesson } from './fractions-decimals-and-the-number-line';
import { percentLesson } from './percent-lesson';
import { ratiosLesson } from './ratios-and-proportions';
import { ratesLesson } from './rates-work-and-speed';
import { sequencesLesson } from './sequences';

export const arithmeticUnit: Unit = {
  slug: 'arithmetic',
  title: 'Arithmetic',
  summary:
    'Arithmetic is one of the four content areas of GRE Quantitative Reasoning. This unit covers the integer properties (divisibility, primes, remainders, odd and even), exponents and roots, fractions, decimals and the number line, percent, ratio, rate and sequences of numbers, with the traps each topic sets.',
  lessons: [integersLesson, remaindersLesson, exponentsLesson, fractionsLesson, percentLesson, ratiosLesson, ratesLesson, sequencesLesson],
};
