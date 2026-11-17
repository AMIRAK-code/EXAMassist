import { md, type Course, type CourseSource } from '../../types';
import { imatCourseIt } from './it';
import { imatUnits } from './units';

/**
 * The IMAT course, in English with a full Italian version (./it). Exam facts
 * come only from docs/research/imat.md and src/lib/exams/configs/imat.ts
 * (D.M. 1005/2026, verified on 3 November 2026).
 */
export const IMAT_SOURCES: CourseSource[] = [
  {
    label: 'D.M. 1005 of 6 August 2026: IMAT 2026/27 (format, date, scoring, threshold, rankings)',
    publisher: 'Ministero dell’Università e della Ricerca',
    url: 'https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-1005-del-06-08-2026',
  },
  {
    label: 'D.M. 1005/2026, Allegati 1–3: conduct of the test, registration and rankings',
    publisher: 'Ministero dell’Università e della Ricerca',
    url: 'https://www.mur.gov.it/sites/default/files/2026-08/Decreto%20Ministeriale%20n.%201005%20Allegati%201_2_3.pdf',
  },
  {
    label: 'D.M. 1005/2026, Allegato A: syllabus',
    publisher: 'Ministero dell’Università e della Ricerca',
    url: 'https://www.mur.gov.it/sites/default/files/2026-08/Decreto%20Ministeriale%20n.%201005%20Allegato%20A.pdf',
  },
  { label: 'Universitaly: registration, scores and rankings', publisher: 'Ministero dell’Università e della Ricerca', url: 'https://www.universitaly.it/' },
];

export const imatCourse: Course = {
  slug: 'imat',
  title: 'IMAT medicine admission test course',
  shortTitle: 'IMAT course',
  metaTitle: 'Free interactive IMAT course in English and Italian',
  description: 'Study every IMAT area, from biology and chemistry to physics, maths and logic, with worked examples, instant-feedback checks and flashcards.',
  examKeys: ['imat'],
  hubSlug: 'imat',
  examPublisher: 'MUR and CINECA',
  lang: 'en',
  interactive: true,
  introMd: md`
The IMAT is the admission test for the English-taught degrees in Medicine and Surgery, Dentistry and Veterinary Medicine at Italian universities. For 2026/27 it was one paper test of 60 questions in 100 minutes, in English: Reading skills and knowledge acquired in studies 4, Logical reasoning and problems 5, Biology 23, Chemistry 15, and Physics and mathematics 13. Every question has five options and one correct answer. A correct answer scores 1.5 points, a blank 0 and a wrong answer −0.4, for a maximum of 90. EU candidates, and non-EU candidates resident in Italy, need at least 20 points to be placed in the national ranking; admission then depends on the ranking against the places at each university. No calculator is allowed. The rules for 2027/28 had not been published when this course was written; check the new decree when it appears.

The course follows the published syllabus area by area, with the most lessons where the most questions are. Every lesson is interactive: try each worked example before revealing its next step, answer the check questions to see at once whether you were right and why each wrong option is wrong, then fix the facts with the flashcard deck. Mark a lesson complete and the course page keeps your progress in this browser.

Every lesson is also available in Italian. The test itself is only in English, so the Italian lessons keep the key English terms beside the Italian ones. All examples and questions are original and written for this course.
`,
  publishedOn: '2026-11-16',
  updatedOn: '2026-11-16',
  sources: IMAT_SOURCES,
  units: imatUnits,
  translations: { it: imatCourseIt },
  mindMap: {
    centre: 'IMAT',
    centreNote: '60 questions · 100 minutes',
    branchNotes: {
      'getting-started': 'Format, scoring and pacing',
      'reading-and-knowledge': '4 questions',
      logic: '5 questions',
      biology: '23 questions',
      chemistry: '15 questions',
      physics: 'Part of 13 physics and maths questions',
      mathematics: 'Part of 13 physics and maths questions',
    },
  },
};
