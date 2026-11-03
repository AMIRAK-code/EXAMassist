import type { HubContent } from './hub-content';
import {
  IMAT_REFORM_EXCLUSION,
  MUR_IMAT_ANNEXES_2026,
  MUR_IMAT_DECREE_2026,
  MUR_IMAT_PLACES_2026,
  MUR_IMAT_PLACES_UPDATE_2026,
  MUR_IMAT_SYLLABUS_2026,
  UNIVERSITALY,
} from './official-links';

/**
 * The IMAT hub: the 2026/27 rules from D.M. 1005 of 6 August 2026 and its
 * annexes, read first-hand on 3 November 2026 (docs/research/imat.md), where
 * the next cycle stands, which degrees use the test, and a plan that links
 * into practice. The worked samples live on /guides/imat-sample-questions,
 * which the hub lists among its guides, so they are not repeated here.
 *
 * Places are the ministry's Tabella B. The non-EU total after D.M. 1472 is our
 * own sum of the amended table, and the page says so.
 */

export const imat: HubContent = {
  headline: 'IMAT: the admission test for medicine in English in Italy',
  metaTitle: 'IMAT 2026/27: format, scoring, places and practice',
  leadMd: `**The IMAT is the admission test for the English-taught degrees in Medicine and Surgery, Dentistry and Veterinary Medicine at Italian universities.** It is one paper test of 60 questions with five options in 100 minutes, set in English by the Ministry of University and Research (MUR) and run by CINECA: 4 questions on reading skills and knowledge acquired in studies, 5 on logical reasoning and problems, 23 on biology, 15 on chemistry and 13 on physics and mathematics. A right answer scores 1.5, a wrong one −0.4 and a blank 0, out of 90. EU candidates, and non-EU candidates living in Italy, need at least 20 points to be ranked; places then go by national ranking.

The 2025 reform that replaced the entrance test with an open first semester, the *semestre filtro*, covers only the Italian-taught degrees. The 2026/27 IMAT was held on 29 September 2026; the rules for 2027/28 had not been published when we last checked, on 3 November 2026.`,
  status: {
    heading: '2027/28 admission: what is confirmed and what is not',
    checkedOn: '2026-11-03',
    bodyMd: `**Confirmed by the ministry**

- The English-taught degrees are outside the 2025 reform: the decree that brought in the *semestre filtro* says its rules do not apply to programmes taught in English ([D.Lgs. 71/2025, art. 8, in Italian](${IMAT_REFORM_EXCLUSION})).
- For 2026/27 they admitted by the IMAT under [D.M. 1005 of 6 August 2026](${MUR_IMAT_DECREE_2026}), with the same format, scoring and [syllabus](${MUR_IMAT_SYLLABUS_2026}) as in 2025/26.
- New in 2026/27: at registration each candidate chose Medicine and Surgery with Dentistry, **or** Veterinary Medicine, and could not change it once registration closed. There were two national rankings, one for each.
- The test was held on 29 September 2026 at 13:30 Italian time, after registration on [Universitaly](${UNIVERSITALY}) from 26 August to 9 September.

**Not published yet**

- The 2027/28 decree: the date, the registration window, the places, and whether the format, scoring or 20-point threshold change. The 2025 and 2026 decrees were both signed in early August, about seven weeks before the test.
- The registration fee, which is announced on Universitaly when registration opens.`,
  },
  routes: {
    heading: 'Which degrees and universities admit by the IMAT',
    bodyMd: `One test serves all three degrees, and it is the same at every venue. In 2026/27 the ministry's [table of places](${MUR_IMAT_PLACES_2026}) listed:

- **Medicine and Surgery:** 28 entries, at Bari, Bologna, Cagliari, Campania Vanvitelli (Naples), Catania, Cattolica (Rome and Bolzano), Florence, Humanitas (Pieve Emanuele, two entries), Messina, Milan, Milano-Bicocca (Bergamo), Naples Federico II, Neuromed (Pozzilli), Padua (Padua MedTech and Venice), Parma (Piacenza), Pavia, Politecnica delle Marche (Ancona), Rome La Sapienza, Rome Tor Vergata (Rome and Tirana), Turin (Orbassano), UniCamillus (Rome), San Raffaele (Milan) and Campus Bio-Medico (Rome, two programmes). In all, 2,430 places for EU candidates and non-EU candidates living in Italy, and 1,362 for non-EU candidates living abroad; [D.M. 1472 of 30 October 2026](${MUR_IMAT_PLACES_UPDATE_2026}) added 5 more at Florence, which by our count makes 1,367.
- **Dentistry:** Rome La Sapienza and Siena, 49 places plus 11 for non-EU candidates living abroad.
- **Veterinary Medicine:** Bologna (Ozzano dell'Emilia) and Naples Federico II, 63 places plus 7.

Some programmes were still being accredited, and their places depended on it. Non-EU candidates living abroad need a score above 0 rather than 20, and compete only for the places of the university they pre-enrolled at. Each university publishes its own call for applications before the test; read it for your programme.`,
  },
  detailsNote: {
    title: 'These are the 2026/27 rules',
    bodyMd: `The details below come from [D.M. 1005 of 6 August 2026](${MUR_IMAT_DECREE_2026}) and [its annexes](${MUR_IMAT_ANNEXES_2026}), for the test held on 29 September 2026. Until the 2027/28 decree appears they are the best guide to the next test, but not a promise of it.`,
  },
  studyPlan: {
    id: 'study-plan',
    heading: 'How to prepare: an eight-week plan',
    bodyMd: `**Biology and chemistry are 38 of the 60 questions**, so that is where most of your hours go. The test is in English: if you learned the sciences in Italian, learn the English terms as you go. Our practice questions can be shown in Italian while you study, but the full simulation is always in English, like the real test. No practice score, ours included, can tell you your IMAT result or your place in the ranking.

1. **Weeks 1–3: biology and chemistry, untimed.** Work through the [syllabus](${MUR_IMAT_SYLLABUS_2026}) topic by topic and practise as you go: [biology](/practice/imat?domain=imat-biology) and [chemistry](/practice/imat?domain=imat-chemistry). Write down why you missed each question, not only that you did.
2. **Weeks 4–5: physics, mathematics and reasoning.** Practise [physics and mathematics](/practice/imat?domain=imat-physics-maths), [logical reasoning](/practice/imat?domain=imat-logic) and [reading and general knowledge](/practice/imat?domain=imat-reading-knowledge). Do every calculation by hand: no calculator is allowed.
3. **Weeks 6–7: mixed sets against the clock.** The real pace is 100 minutes for 60 questions: about 1 minute 40 seconds a question. Fix your guessing rule now: a blind guess among five options is worth −0.02 points on average, but once you can rule out one option a guess is worth +0.075, so answer whenever you can eliminate something.
4. **Week 8: full simulations.** Two 60-question simulations in 100 minutes, in one sitting each, a few days apart, with the same review afterwards. Our [worked IMAT samples](/guides/imat-sample-questions) show what a good review looks like.

If you have less time, keep the order and shorten each step: the large subjects first, timing second, a full simulation last.`,
  },
  updatedOn: '2026-11-03',
  sources: [
    { label: 'D.M. 1005 of 6 August 2026: IMAT 2026/27 (in Italian)', url: MUR_IMAT_DECREE_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'D.M. 1005/2026, Allegati 1–3: conduct of the test, registration and rankings', url: MUR_IMAT_ANNEXES_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'D.M. 1005/2026, Allegato A: syllabus', url: MUR_IMAT_SYLLABUS_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'D.M. 1005/2026, Tabella B: places', url: MUR_IMAT_PLACES_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'D.M. 1472 of 30 October 2026: five more places at Florence', url: MUR_IMAT_PLACES_UPDATE_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'D.Lgs. 71/2025, art. 8: the reform does not apply to English-taught degrees', url: IMAT_REFORM_EXCLUSION, publisher: 'Normattiva' },
    { label: 'Universitaly: registration, scores and rankings', url: UNIVERSITALY, publisher: 'Ministero dell’Università e della Ricerca' },
  ],
};
