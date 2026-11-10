import type { Lesson } from '../../types';
import { realNumbersPowersAndRadicalsLesson } from './real-numbers-powers-and-radicals';
import { ratiosPercentagesAndDivisibilityLesson } from './ratios-percentages-and-divisibility';
import { polynomialDivisionAndFactorisationLesson } from './polynomial-division-and-factorisation';
import { quadraticEquationsAndInequalitiesLesson } from './quadratic-equations-and-inequalities';
import { rationalInequalitiesAndSystemsLesson } from './rational-inequalities-and-systems';
import { radicalAndAbsoluteValueInequalitiesLesson } from './radical-and-absolute-value-inequalities';
import { exponentialAndLogarithmicEquationsLesson } from './exponential-and-logarithmic-equations';
import { planeGeometryTrianglesAndCirclesLesson } from './plane-geometry-triangles-and-circles';

export const firstMathLessons: Lesson[] = [
  realNumbersPowersAndRadicalsLesson,
  ratiosPercentagesAndDivisibilityLesson,
  polynomialDivisionAndFactorisationLesson,
  quadraticEquationsAndInequalitiesLesson,
  rationalInequalitiesAndSystemsLesson,
  radicalAndAbsoluteValueInequalitiesLesson,
  exponentialAndLogarithmicEquationsLesson,
  planeGeometryTrianglesAndCirclesLesson,
];
