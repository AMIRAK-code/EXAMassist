import type { Unit } from '../../types';
import { algebraUnit } from './algebra';
import { analyticalWritingUnit } from './analytical-writing';
import { arithmeticUnit } from './arithmetic';
import { dataAnalysisUnit } from './data-analysis';
import { geometryUnit } from './geometry';
import { gettingStartedUnit } from './getting-started';
import { quantQuestionTypesUnit } from './quant-question-types';
import { readingComprehensionUnit } from './reading-comprehension';
import { sentenceEquivalenceUnit } from './sentence-equivalence';
import { textCompletionUnit } from './text-completion';

/** The course's units, in teaching order: Verbal, then Quant, then the essay. */
export const greUnits: Unit[] = [
  gettingStartedUnit,
  textCompletionUnit,
  sentenceEquivalenceUnit,
  readingComprehensionUnit,
  quantQuestionTypesUnit,
  arithmeticUnit,
  algebraUnit,
  geometryUnit,
  dataAnalysisUnit,
  analyticalWritingUnit,
];
