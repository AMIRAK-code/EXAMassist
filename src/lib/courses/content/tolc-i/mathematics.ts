import type { Unit } from '../../types';
import { firstMathLessons } from './math-first';
import { secondMathLessons } from './math-second';

export const mathematicsUnit: Unit = {
  slug: 'mathematics',
  title: 'Mathematics',
  summary: 'Work by hand with numbers, equations, geometry, functions, trigonometry and probability. The section allows 50 minutes for 20 questions.',
  lessons: [...firstMathLessons, ...secondMathLessons],
};
