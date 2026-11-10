import type { Unit } from '../../types';
import { gettingStartedUnit } from './getting-started';
import { logicUnit } from './logic';
import { mathematicsUnit } from './mathematics';
import { sciencesUnit } from './sciences';
import { verbalComprehensionUnit } from './verbal-comprehension';

export const tolcIUnits: Unit[] = [
  gettingStartedUnit,
  mathematicsUnit,
  logicUnit,
  sciencesUnit,
  verbalComprehensionUnit,
];
