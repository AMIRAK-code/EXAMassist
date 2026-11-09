import type { Unit } from '../../types';
import { criticalReasoningUnit } from './critical-reasoning';
import { dataInsightsUnit } from './data-insights';
import { dataSufficiencyUnit } from './data-sufficiency';
import { gettingStartedUnit } from './getting-started';
import { quantAlgebraUnit } from './quant-algebra';
import { quantArithmeticUnit } from './quant-arithmetic';
import { quantWordProblemsUnit } from './quant-word-problems';
import { readingComprehensionUnit } from './reading-comprehension';

/** The course's units, in teaching order: Quant, Verbal, then Data Insights. */
export const gmatUnits: Unit[] = [
  gettingStartedUnit,
  quantArithmeticUnit,
  quantAlgebraUnit,
  quantWordProblemsUnit,
  criticalReasoningUnit,
  readingComprehensionUnit,
  dataSufficiencyUnit,
  dataInsightsUnit,
];
