import type { Lesson } from '../../types';
import { solidGeometryAndScalingLesson } from './solid-geometry-and-scaling';
import { coordinatesLinesAndDistancesLesson } from './coordinates-lines-and-distances';
import { circlesParabolasEllipsesAndHyperbolasLesson } from './circles-parabolas-ellipses-and-hyperbolas';
import { functionDomainsInversesAndTransformationsLesson } from './function-domains-inverses-and-transformations';
import { exponentialAndLogarithmicGraphsLesson } from './exponential-and-logarithmic-graphs';
import { unitCircleAndTrigonometricEquationsLesson } from './unit-circle-and-trigonometric-equations';
import { sineAndCosineRulesLesson } from './sine-and-cosine-rules';
import { weightedMeansAndProbabilityLesson } from './weighted-means-and-probability';

export const secondMathLessons: Lesson[] = [
  solidGeometryAndScalingLesson,
  coordinatesLinesAndDistancesLesson,
  circlesParabolasEllipsesAndHyperbolasLesson,
  functionDomainsInversesAndTransformationsLesson,
  exponentialAndLogarithmicGraphsLesson,
  unitCircleAndTrigonometricEquationsLesson,
  sineAndCosineRulesLesson,
  weightedMeansAndProbabilityLesson,
];
