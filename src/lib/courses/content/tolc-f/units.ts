import type { Unit } from '../../types';
import { biologyUnit } from './biology';
import { chemistryUnit } from './chemistry';
import { mathematicsUnit } from './mathematics';
import { physicsUnit } from './physics';
import { logicUnit } from './logic';
import { gettingStartedUnit } from './getting-started';

export const tolcFUnits: Unit[] = [gettingStartedUnit, biologyUnit, chemistryUnit, mathematicsUnit, physicsUnit, logicUnit];
