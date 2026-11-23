import type { Course } from '../../types';
import { electricity } from './electricity';
import { magnetism } from './magnetism';
import { induction } from './induction';
import { waves } from './waves';

export const physicsIICourse: Course = {
  slug: 'polito-physics-ii',
  title: 'Physics II for Computer Engineering',
  shortTitle: 'PoliTo Physics II',
  metaTitle: 'PoliTo Physics II for Computer Engineering',
  description: 'Study electric and magnetic fields, induction and electromagnetic waves with worked problems, interactive checks and a polarisation experiment.',
  examKeys: [],
  hubSlug: null,
  examPublisher: 'Politecnico di Torino',
  introMd: 'This independent study course follows the English-language **Physics II module (5 CFU)** of *Electromagnetism and Circuit theory* in the 2026/27 Computer Engineering programme at Politecnico di Torino. The companion Circuit Theory module carries a further 7 CFU. You will use vectors, derivatives and integrals from Physics I and mathematical analysis.\n\nStart with the fields around a conductor and finish by predicting how much power reaches a polarised receiver. Sketch a diagram and work each example on paper before revealing the steps.',
  publishedOn: '2026-11-23',
  updatedOn: '2026-11-23',
  sources: [
    { label: 'Physics II module syllabus, 2026/27', publisher: 'Politecnico di Torino', url: 'https://didattica.polito.it/pls/portal30/sviluppo.guide.visualizza?p_a_acc=2027&p_cod_ins=01URLYF&p_lang=' },
    { label: 'Computer Engineering study plan and module credits', publisher: 'Politecnico di Torino', url: 'https://didattica.polito.it/pls/portal30/sviluppo.offerta_formativa_2019.vis?p_cds=561&p_coorte=2026&p_sdu=37' },
  ],
  units: [electricity, magnetism, induction, waves],
  interactive: true,
};
