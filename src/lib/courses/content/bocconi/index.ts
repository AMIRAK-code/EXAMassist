import { md, type Course } from '../../types';
import { bocconiUnits } from './units';

/** Exam facts here are from docs/research/course-facts-2026-11-04.md (Bocconi pages B1–B3). */
export const bocconiCourse: Course = {
  slug: 'bocconi',
  title: 'Bocconi admission test course (bachelor’s)',
  shortTitle: 'Bocconi test course',
  metaTitle: 'Free Bocconi test course: maths, reading and reasoning',
  description: 'A free course for the Online Bocconi Test for bachelor’s programmes: maths, reading, numerical reasoning and critical thinking, with worked examples.',
  examKeys: ['bocconi-undergraduate'],
  hubSlug: 'bocconi-online-test',
  examPublisher: 'Università Bocconi',
  introMd: md`
This course teaches every area of the Online Bocconi Test used for admission to Bocconi's bachelor's programmes, one idea per lesson. Each lesson explains the concept, works original examples step by step, shows the traps that cost marks, and ends with a short check whose answers stay hidden until you open them.

### The test in brief

The standard Online Bocconi Test has 50 multiple-choice questions in 75 minutes, taken online in Italian or English: 24 in mathematics, 11 in reading comprehension, 6 in numerical reasoning and 9 in critical thinking. The areas are mixed together rather than timed separately. Questions come three to a screen, and once you move to the next screen you cannot go back. Calculators are not allowed. A correct answer scores 1 point, a blank 0, a wrong answer −0.2, and a wrong answer to a three-option critical thinking question −0.33. Bocconi does not consider a score below 17.

Applicants to Law and Global Law take a separate Law version with a different mix (5 mathematics, 11 reading, 6 numerical reasoning, 18 logic and critical thinking and 10 verbal reasoning). This course follows the standard test; its reading, numerical reasoning and critical thinking lessons are useful for both.

### How to use the course

The mathematics units are the largest because mathematics is almost half the test. The mind map below shows the whole course at a glance, and the last unit, Quick revision, condenses it into tables, rules and drills for the final weeks. Work through a unit in order, take each check before you open the answers, and use the practice link to apply the idea on fresh questions. Every question in this course is original and written for UniExamer; none comes from Bocconi, and difficulty is our editorial judgement.
`,
  publishedOn: '2026-11-04',
  updatedOn: '2026-11-04',
  sources: [
    { label: 'Online Bocconi test', url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test', publisher: 'Università Bocconi' },
    { label: 'Test online Bocconi (Italian)', url: 'https://www.unibocconi.it/it/entrare-bocconi/corsi-di-laurea-triennale-e-giurisprudenza/ammissione/test-online-bocconi', publisher: 'Università Bocconi' },
    { label: 'Bocconi Online Test AY 2027/28: instructions and rules of conduct (PDF)', url: 'https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf', publisher: 'Università Bocconi' },
  ],
  units: bocconiUnits,
  mindMap: {
    centre: 'Online Bocconi Test',
    centreNote: '50 questions · 75 minutes',
    // Mathematics is 24 of the 50 questions across five units, so those branches name the area only.
    branchNotes: {
      'getting-started': 'Format, scoring, guessing',
      'numbers-and-sets': 'Mathematics',
      algebra: 'Mathematics',
      functions: 'Mathematics',
      geometry: 'Mathematics',
      'counting-probability-statistics': 'Mathematics',
      reading: '11 questions',
      'numerical-reasoning': '6 questions',
      'critical-thinking': '9 questions',
      'quick-revision': 'Tables, rules and drills',
    },
  },
};
