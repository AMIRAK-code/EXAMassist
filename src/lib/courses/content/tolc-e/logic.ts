import type { Unit } from '../../types';
import { lesson as implications } from '../tolc-i/implications-and-conditions';
import { lesson as quantifiers } from '../tolc-i/quantifiers-negation-and-venn-diagrams';
import { lesson as constraints } from '../tolc-i/constraints-guarantees-and-flows';
import { lesson as sequences } from '../tolc-i/sequences-and-patterns';
import { forTolcE } from './adapt';
import { argumentsLesson } from './arguments-assumptions-and-evidence';

export const logicUnit: Unit = {
  slug: 'logic',
  title: 'Logic',
  summary: 'Practise deduction, constraints, patterns and arguments. These are editorial groupings of reasoning aptitude, not a CISIA topic list.',
  lessons: [
    forTolcE(implications, 'tolce-logic', 'tolce-logic-deduction'),
    forTolcE(quantifiers, 'tolce-logic', 'tolce-logic-deduction'),
    forTolcE(constraints, 'tolce-logic', 'tolce-logic-problems'),
    forTolcE(sequences, 'tolce-logic', 'tolce-logic-sequences'),
    argumentsLesson,
  ],
};
