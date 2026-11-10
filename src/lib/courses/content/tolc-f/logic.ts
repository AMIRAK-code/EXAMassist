import type { Unit } from '../../types';
import { logicUnit as source } from '../tolc-i/logic';
import { reviewedAdapt as adapt } from './shared';
import { graphsLesson } from './graphs-and-tables';

export const logicUnit: Unit = {
  ...source,
  summary: 'Test implications, translate quantifiers and constraints, and use elementary mathematical patterns to reach justified conclusions.',
  lessons: [...source.lessons.map((lesson, index) => adapt(lesson, 'tolcf-logic', index < 2 ? 'tolcf-logic-propositions' : 'tolcf-logic-math-reasoning')), graphsLesson],
};
