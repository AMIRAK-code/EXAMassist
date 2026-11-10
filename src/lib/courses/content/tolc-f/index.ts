import { md, type Course } from '../../types';
import { tolcFUnits } from './units';

export const tolcFCourse: Course = {
  slug: 'tolc-f', title: 'TOLC-F pharmacy admission test course',
  metaTitle: 'Free TOLC-F course for pharmacy applicants',
  description: 'Study TOLC-F biology, chemistry, mathematics, physics and logic with original worked examples, five-option checks and linked practice.',
  examKeys: ['tolc-f'], hubSlug: 'cisia-tolc', examPublisher: 'CISIA',
  introMd: md`
The TOLC-F has five main sections with separate clocks: Biology has 15 questions in 20 minutes, Chemistry 15 in 20, Mathematics 7 in 12, Physics 7 in 12 and Logic 6 in 8. That is 50 questions in 72 minutes. English follows as a separately scored section of 30 questions in 15 minutes; this course covers the five main sections.

Each question has five options and one correct answer. A correct answer scores 1 point, an unanswered question 0 and a wrong answer −0.25. Calculation aids are not allowed. Once a section closes you cannot return to it. CISIA does not publish the rule for changing answers within an open section. Each university sets its own admission requirements and thresholds: read your programme's admission notice.

Choose a unit, attempt its worked examples on paper, and then solve its short check before opening the solutions. The practice link takes you to the corresponding topic. All course examples and questions are original. The TOLC-F question bank is public, but this material is not drawn from it. Some shared mathematics and science lessons also appear in our TOLC-I course.
`,
  publishedOn: '2026-11-10', updatedOn: '2026-11-10',
  sources: [
    { label: 'TOLC-F structure and syllabus', publisher: 'CISIA', url: 'https://www.cisiaonline.it/en/tolc/tolc-f/structure-and-syllabus' },
    { label: 'Regolamento TOLC 2026 (PDF)', publisher: 'CISIA', url: 'https://www.cisiaonline.it/sites/default/files/Regolamenti/Regolamento-TOLC-2026.pdf' },
  ],
  units: tolcFUnits,
  mindMap: { centre: 'TOLC-F', centreNote: '50 questions · 72 minutes', branchNotes: { 'getting-started': 'Format, scoring and practice', biology: '15 questions · 20 min', chemistry: '15 questions · 20 min', mathematics: '7 questions · 12 min', physics: '7 questions · 12 min', logic: '6 questions · 8 min' } },
};
