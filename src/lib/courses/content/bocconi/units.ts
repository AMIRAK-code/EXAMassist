import type { Unit } from '../../types';
import { algebraUnit } from './algebra';
import { countingProbabilityStatisticsUnit } from './counting-probability-statistics';
import { criticalThinkingUnit } from './critical-thinking';
import { functionsUnit } from './functions';
import { geometryUnit } from './geometry';
import { gettingStartedUnit } from './getting-started';
import { numbersAndSetsUnit } from './numbers-and-sets';
import { numericalReasoningUnit } from './numerical-reasoning';
import { quickRevisionUnit } from './quick-revision';
import { readingUnit } from './reading';

/** The course's units, in teaching order: mathematics first (almost half the test), then the other three areas, and a revision unit that condenses the course. */
export const bocconiUnits: Unit[] = [
  gettingStartedUnit,
  numbersAndSetsUnit,
  algebraUnit,
  functionsUnit,
  geometryUnit,
  countingProbabilityStatisticsUnit,
  readingUnit,
  numericalReasoningUnit,
  criticalThinkingUnit,
  quickRevisionUnit,
];
