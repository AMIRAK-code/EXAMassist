import type { Unit } from '../../types';
import { lesson as cohesion } from '../tolc-i/cohesion-and-inference';
import { lesson as stated } from '../tolc-i/stated-information-and-meaning-in-context';
import { forTolcE } from './adapt';
import { purposeLesson } from './purpose-and-passage-structure';
import { claimsLesson } from './reading-claims-and-comparisons';

export const verbalComprehensionUnit: Unit = {
  slug: 'verbal-comprehension',
  title: 'Verbal comprehension',
  summary: 'Follow references, recover stated detail, interpret claims and identify purpose. These reading skills are editorial groupings.',
  lessons: [
    forTolcE(stated, 'tolce-verbal', 'tolce-verbal-stated'),
    forTolcE(cohesion, 'tolce-verbal', 'tolce-verbal-inferred'),
    purposeLesson,
    claimsLesson,
  ],
};
