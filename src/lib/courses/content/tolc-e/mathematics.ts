import type { Unit } from '../../types';
import { firstMathLessons } from '../tolc-i/math-first';
import { secondMathLessons } from '../tolc-i/math-second';
import { forTolcE } from './adapt';
import { linearEquationsLesson } from './linear-equations-and-modelling';

const skills: Record<string, string> = {
  'real-numbers-powers-and-radicals': 'tolce-math-powers-exp-log',
  'ratios-percentages-and-divisibility': 'tolce-math-numbers',
  'polynomial-division-and-factorisation': 'tolce-math-polynomials',
  'quadratic-equations-and-inequalities': 'tolce-math-equations',
  'rational-inequalities-and-systems': 'tolce-math-equations',
  'radical-and-absolute-value-inequalities': 'tolce-math-equations',
  'exponential-and-logarithmic-equations': 'tolce-math-equations',
  'plane-geometry-triangles-and-circles': 'tolce-math-geometry',
  'solid-geometry-and-scaling': 'tolce-math-geometry',
  'coordinates-lines-and-distances': 'tolce-math-analytic-geometry',
  'circles-parabolas-ellipses-and-hyperbolas': 'tolce-math-analytic-geometry',
  'function-domains-inverses-and-transformations': 'tolce-math-functions',
  'exponential-and-logarithmic-graphs': 'tolce-math-functions',
};

export const mathematicsUnit: Unit = {
  slug: 'mathematics',
  title: 'Mathematics',
  summary: 'Build exact arithmetic and algebra, then connect equations, geometry and elementary functions.',
  lessons: [
    ...firstMathLessons.slice(0, 3).map((lesson) => forTolcE(lesson, 'tolce-mathematics', skills[lesson.slug])),
    linearEquationsLesson,
    ...firstMathLessons.slice(3).map((lesson) => forTolcE(lesson, 'tolce-mathematics', skills[lesson.slug])),
    ...secondMathLessons.slice(0, 5).map((lesson) => forTolcE(lesson, 'tolce-mathematics', skills[lesson.slug])),
  ],
};
