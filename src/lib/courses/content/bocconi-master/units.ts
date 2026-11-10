import type { Unit } from '../../types';
import { dataInsightUnit } from './data-insight';
import { gettingStartedUnit } from './getting-started';
import { quantitativeReasoningUnit } from './quantitative-reasoning';
import { verbalReasoningUnit } from './verbal-reasoning';
import { beyondBasicMathsUnit } from './beyond-basic-maths';

/**
 * The course's units, in the test's own order of areas: verbal reasoning, data
 * insight, quantitative reasoning; then an optional unit on topics Bocconi's
 * 2024 sample included beyond basic mathematics.
 */
export const bocconiMasterUnits: Unit[] = [gettingStartedUnit, verbalReasoningUnit, dataInsightUnit, quantitativeReasoningUnit, beyondBasicMathsUnit];
