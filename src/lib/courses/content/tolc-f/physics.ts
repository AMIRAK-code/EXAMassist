import type { Unit } from '../../types';
import { mechanicsLesson } from '../tolc-i/vectors-motion-and-inclined-planes';
import { energyLesson } from '../tolc-i/energy-fluids-and-ideal-gases';
import { electricityLesson } from '../tolc-i/charges-circuits-and-optics';
import { reviewedAdapt as adapt } from './shared';
import { measuresLesson } from './measures';
import { wavesLesson } from './waves-and-magnetism';

export const physicsUnit: Unit = {
  slug: 'physics', title: 'Physics',
  summary: 'Model motion and forces, follow energy through fluids and gases, and connect charge, circuits and light.',
  lessons: [measuresLesson, adapt(mechanicsLesson, 'tolcf-physics', 'tolcf-phys-mechanics'), adapt(energyLesson, 'tolcf-physics', 'tolcf-phys-fluids-thermo'), adapt(electricityLesson, 'tolcf-physics', 'tolcf-phys-electricity-waves'), wavesLesson],
};
