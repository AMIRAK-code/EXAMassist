import type { Unit } from '../../types';
import { revisionAlgebraAndFunctionsLesson } from './rev-algebra-and-functions';
import { revisionGeometryCountingAndStatisticsLesson } from './rev-geometry-counting-and-statistics';
import { revisionReadingAndTrueFalseLesson } from './rev-reading-and-true-false';
import { revisionLogicAndArgumentsLesson } from './rev-logic-and-arguments';
import { revisionNumericalReasoningLesson } from './rev-numerical-reasoning';

export const quickRevisionUnit: Unit = {
  slug: 'quick-revision',
  title: 'Quick revision',
  summary:
    'The whole course condensed into tables, rules and drills for the last weeks before the test: the algebra and function rules, the geometry, counting, probability and statistics formulas, the reading and true / false / cannot be deduced method, the logic of conditionals and arguments, and the numerical reasoning shortcuts. Each sheet ends with fresh check questions, so you can test yourself on the material as well as reread it.',
  lessons: [
    revisionAlgebraAndFunctionsLesson,
    revisionGeometryCountingAndStatisticsLesson,
    revisionReadingAndTrueFalseLesson,
    revisionLogicAndArgumentsLesson,
    revisionNumericalReasoningLesson,
  ],
};
