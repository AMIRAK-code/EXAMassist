import type { Unit } from '../../types';
import { lesson as cohesionAndInference } from './cohesion-and-inference';
import { lesson as statedInformationAndMeaningInContext } from './stated-information-and-meaning-in-context';

export const verbalComprehensionUnit: Unit = {
  slug: 'verbal-comprehension',
  title: 'Verbal comprehension',
  summary: 'Trace a passage’s argument, locate stated details and test a word against its context.',
  lessons: [cohesionAndInference, statedInformationAndMeaningInContext],
};
