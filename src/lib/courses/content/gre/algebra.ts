import type { Unit } from '../../types';
import { linearEquationsLesson } from './linear-equations-and-systems';
import { algebraicExpressionsLesson } from './algebraic-expressions-and-factoring';
import { quadraticEquationsLesson } from './quadratic-equations';
import { inequalitiesLesson } from './inequalities-and-absolute-value';
import { functionsLesson } from './functions-and-symbolic-operations';
import { coordinateLinesLesson } from './coordinate-geometry-lines';
import { wordProblemsLesson } from './word-problems-into-equations';

export const algebraUnit: Unit = {
  slug: 'algebra',
  title: 'Algebra',
  summary:
    'Algebra is one of the four content areas of GRE Quantitative Reasoning. This unit covers linear equations and systems, expressions and factoring, quadratic equations, inequalities and absolute value, functions and invented operations, lines on the coordinate plane, and turning word problems into equations.',
  lessons: [
    linearEquationsLesson,
    algebraicExpressionsLesson,
    quadraticEquationsLesson,
    inequalitiesLesson,
    functionsLesson,
    coordinateLinesLesson,
    wordProblemsLesson,
  ],
};
