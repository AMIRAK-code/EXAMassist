import type { Unit } from '../../types';
import { dataInsightUnit } from './data-insight';
import { gettingStartedUnit } from './getting-started';
import { quantitativeReasoningUnit } from './quantitative-reasoning';
import { verbalReasoningUnit } from './verbal-reasoning';

/** The course's units, in the test's own order of areas: verbal reasoning, data insight, quantitative reasoning. */
export const bocconiMasterUnits: Unit[] = [gettingStartedUnit, verbalReasoningUnit, dataInsightUnit, quantitativeReasoningUnit];
