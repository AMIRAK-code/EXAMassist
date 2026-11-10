import { md, type Course } from '../../types';
import { bocconiMasterUnits } from './units';

/** Exam facts here are from docs/research/bocconi-master-facts-2026-11-09.md (Bocconi pages S1–S5 and the AY 2027/28 graduate rules PDF). */
export const bocconiMasterCourse: Course = {
  slug: 'bocconi-master',
  title: 'Bocconi master’s admission test course',
  metaTitle: 'Free Bocconi master’s test course: verbal, data insight and quant',
  description: 'A free course for the Online Bocconi Test for MSc and MA applicants: verbal reasoning, data insight and quantitative reasoning, with worked examples.',
  examKeys: ['bocconi-graduate'],
  hubSlug: 'bocconi-master',
  examPublisher: 'Università Bocconi',
  introMd: md`
This course teaches the three areas of the Online Bocconi Test that international applicants take for Bocconi's Master of Science and MA programmes, one idea per lesson. Each lesson explains the concept, works original examples step by step, shows the traps that cost marks, and ends with a short check whose answers stay hidden until you open them. The mind map below shows the whole test at a glance.

### The test in brief

The test has 50 multiple-choice questions in 75 minutes: 24 in verbal reasoning, 16 in data insight and 10 in quantitative reasoning, mixed together by topic and difficulty. It is taken online, in Italian or English, and recorded for review. According to Bocconi's rules for the 2027/28 test, questions come three to a screen, you cannot go back to an earlier screen, and calculators are not allowed. A correct answer scores 1 point, a blank 0 and a wrong answer −0.25 (or −0.33 on some questions, which Bocconi does not name). Bocconi does not consider a score below 15 out of 50, and you can sit the test at most three times a year. Applicants to PPA and GLOBE need no test, and Bocconi accepts the GMAT or GRE instead of its own test.

Bocconi describes verbal reasoning as reading comprehension, data and statements, and critical reasoning; data insight as questions on tables and graphs and data sufficiency; and quantitative reasoning as problems using basic mathematics.

### How to use the course

Start with the two getting-started lessons, then work through the areas in any order. The last unit, Beyond basic maths, is optional: it covers derivatives and hypothesis tests, topics that appeared in a 2024 Bocconi sample but that the current test page does not mention. Take each check before you open the answers, and use the practice link to apply the idea on fresh questions. Every question in this course is original and written for UniExamer; none comes from Bocconi, and difficulty is our editorial judgement.
`,
  publishedOn: '2026-11-09',
  updatedOn: '2026-11-10',
  sources: [
    { label: 'Online Bocconi test for international graduate applicants', url: 'https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/online-bocconi-test-international-graduate-applicants', publisher: 'Università Bocconi' },
    { label: 'MSc and MA admissions', url: 'https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/admissions', publisher: 'Università Bocconi' },
    { label: 'GMAT and GRE for MSc and MA applicants', url: 'https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/gmat-and-gre-test', publisher: 'Università Bocconi' },
    { label: 'Online Bocconi Test, graduate, AY 2027/28: instructions and rules of conduct (PDF)', url: 'https://www.unibocconi.it/sites/default/files/GR_Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf', publisher: 'Università Bocconi' },
  ],
  units: bocconiMasterUnits,
  mindMap: {
    centre: 'Bocconi master’s test',
    centreNote: '50 questions · 75 minutes',
    branchNotes: {
      'getting-started': 'Format, scoring, pacing',
      'verbal-reasoning': '24 questions',
      'data-insight': '16 questions',
      'quantitative-reasoning': '10 questions',
      'beyond-basic-maths': 'Optional extras',
    },
  },
};
