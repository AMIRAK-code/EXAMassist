import type { Unit } from '../../types';
import { linesAndAnglesLesson } from './lines-and-angles';
import { trianglesLesson } from './triangles-and-the-pythagorean-theorem';
import { specialTrianglesLesson } from './special-right-triangles-and-similarity';
import { circlesLesson } from './circles';
import { quadrilateralsLesson } from './quadrilaterals-polygons-and-area';
import { threeDimensionalLesson } from './three-dimensional-figures';

export const geometryUnit: Unit = {
  slug: 'geometry',
  title: 'Geometry',
  summary:
    'Geometry is one of the four content areas of GRE Quantitative Reasoning. This unit covers lines and angles, triangles and the Pythagorean theorem, special right triangles and similar figures, circles, quadrilaterals and other polygons, and three-dimensional figures. Every figure is described in words, and each lesson shows how to read a figure for what it states rather than what it appears to show.',
  lessons: [
    linesAndAnglesLesson,
    trianglesLesson,
    specialTrianglesLesson,
    circlesLesson,
    quadrilateralsLesson,
    threeDimensionalLesson,
  ],
};
