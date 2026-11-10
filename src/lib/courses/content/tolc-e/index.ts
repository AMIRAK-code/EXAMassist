import { md, type Course } from '../../types';
import { tolcEUnits } from './units';

export const tolcECourse: Course = {
  slug: 'tolc-e',
  title: 'TOLC-E economics admission test course',
  metaTitle: 'Free TOLC-E course for economics applicants',
  description: 'Prepare for the TOLC-E with 24 lessons in logic, verbal comprehension and mathematics, original worked examples and five-option checks.',
  examKeys: ['tolc-e'],
  hubSlug: 'cisia-tolc',
  examPublisher: 'CISIA',
  introMd: md`
The TOLC-E has three main sections: Logic, Verbal comprehension and Mathematics. Each has its own 30-minute clock. The 36 main questions are followed by separately scored English. Start with [How the TOLC-E works](/courses/tolc-e/how-the-tolc-e-works) to understand the scoring and the requirements to check in your programme's admission notice.

Use each lesson actively: try a worked example on paper, compare your reasoning with the steps, and complete the three-question check. The practice link opens a matching skill. Logic and reading topics are our editorial groupings, not a published CISIA breakdown. The course's questions are original. English is outside this course.
`,
  publishedOn: '2026-11-10',
  updatedOn: '2026-11-10',
  sources: [
    { label: 'TOLC-E structure and syllabus', publisher: 'CISIA', url: 'https://www.cisiaonline.it/en/tolc/tolc-e/structure-and-syllabus' },
    { label: 'Regolamento TOLC 2026 (PDF)', publisher: 'CISIA', url: 'https://www.cisiaonline.it/sites/default/files/Regolamenti/Regolamento-TOLC-2026.pdf' },
  ],
  units: tolcEUnits,
  mindMap: {
    centre: 'TOLC-E',
    centreNote: '36 questions · 90 minutes',
    branchNotes: {
      'getting-started': 'Format, scoring and preparation',
      logic: '13 questions · 30 min',
      'verbal-comprehension': '10 questions · 30 min',
      mathematics: '13 questions · 30 min',
    },
  },
};
