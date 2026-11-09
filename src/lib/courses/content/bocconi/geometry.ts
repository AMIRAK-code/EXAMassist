import type { Unit } from '../../types';
import { planeGeometryFormulasLesson } from './geo-plane-geometry-formulas';
import { pointsDistancesAndLinesLesson } from './geo-points-distances-and-lines';
import { parabolasAndCirclesLesson } from './geo-parabolas-and-circles';
import { linesAndConicsLesson } from './geo-lines-and-conics';
import { trigonometryInRightTrianglesLesson } from './geo-trigonometry-in-right-triangles';
import { trigonometricFunctionsAndIdentitiesLesson } from './geo-trigonometric-functions-and-identities';

export const geometryUnit: Unit = {
  slug: 'geometry',
  title: 'Geometry and trigonometry',
  summary:
    'Bocconi lists plane geometry, analytical geometry and trigonometry among the mathematics topics of its test. This unit covers the area and perimeter formulas for triangles, circles, squares, trapezoids and rhombi; points, distances and lines in the plane; parabolas and circles; the position of a line relative to a circle or parabola; and trigonometry, from right triangles to the main identities. Every figure is described in words, and every value is worked without a calculator.',
  lessons: [
    planeGeometryFormulasLesson,
    pointsDistancesAndLinesLesson,
    parabolasAndCirclesLesson,
    linesAndConicsLesson,
    trigonometryInRightTrianglesLesson,
    trigonometricFunctionsAndIdentitiesLesson,
  ],
};
