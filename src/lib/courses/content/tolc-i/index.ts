import { md, type Course } from '../../types';
import { tolcIUnits } from './units';

export const tolcICourse: Course = {
  slug: 'tolc-i',
  title: 'TOLC-I engineering admission test course',
  shortTitle: 'TOLC-I course',
  metaTitle: 'Free TOLC-I course for engineering applicants',
  description: 'Study for the TOLC-I with 28 free lessons in mathematics, logic, sciences and verbal comprehension, with worked examples and five-option checks.',
  examKeys: ['tolc-i'],
  hubSlug: 'cisia-tolc',
  examPublisher: 'CISIA',
  introMd: md`
The four main TOLC-I sections have separate clocks. Mathematics comes first, with 20 questions in 50 minutes. Logic, Sciences and Verbal comprehension follow, each with 10 questions in 20 minutes. English is scored separately. Start with [How the TOLC-I works](/courses/tolc-i/how-the-tolc-i-works) to understand the scoring and what to look for in your programme’s admission notice.

Choose a branch in the map to find a lesson. Try each worked problem on paper before reading its solution, then use the three questions at the end to check your reasoning. The practice link opens the corresponding topic. The examples and questions are original to this course. The logic and reading topics are our editorial groupings of the skills students can practise.
`,
  publishedOn: '2026-11-10',
  updatedOn: '2026-11-10',
  sources: [
    { label: 'TOLC-I structure and syllabus', publisher: 'CISIA', url: 'https://www.cisiaonline.it/en/tolc/tolc-i/structure-and-syllabus' },
    { label: 'Regolamento TOLC 2026 (PDF)', publisher: 'CISIA', url: 'https://www.cisiaonline.it/sites/default/files/Regolamenti/Regolamento-TOLC-2026.pdf' },
  ],
  units: tolcIUnits,
  mindMap: {
    centre: 'TOLC-I',
    centreNote: '50 questions · 110 minutes',
    branchNotes: {
      'getting-started': 'Format, scoring and attempts',
      mathematics: '20 questions · 50 min',
      logic: '10 questions · 20 min',
      sciences: '10 questions · 20 min',
      'verbal-comprehension': '10 questions · 20 min',
    },
  },
};
