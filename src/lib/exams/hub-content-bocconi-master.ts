import type { SampleQuestionSet } from '@/lib/content/guides';
import type { HubContent } from './hub-content';
import { BOCCONI_GRADUATE_GMAT_GRE, BOCCONI_GRADUATE_TEST_PAGE } from './official-links';

/**
 * The Bocconi Master's hub: the direct answer and worked samples for the
 * graduate Online Bocconi test, from Bocconi's graduate test page (re-read
 * 3 November 2026). The title stays the one the page already ranks with.
 *
 * Bocconi publishes no option count for this test; the samples use four
 * options, like most of our bank for it (choiceOptions in
 * src/lib/exams/configs/bocconi-graduate.ts), and say so.
 */

const samples: SampleQuestionSet = {
  sections: [
    {
      id: 'verbal-reasoning-sample',
      heading: 'Verbal reasoning',
      introMd:
        'Verbal reasoning is the largest area: 24 of the 50 questions. Many ask you to judge an argument: what it assumes, and what would strengthen or weaken it.',
      questions: [
        {
          id: 'master-sample-bike-scheme',
          title: 'What weakens a conclusion from a rising count',
          topic: 'Verbal reasoning: evaluating an argument',
          stemMd:
            'In the year after a city launched a bike-sharing scheme, the number of road accidents involving cyclists rose by 15%. A councillor concludes that the scheme has made cycling in the city more dangerous.\n\nWhich of the following, if true, most weakens the councillor’s conclusion?',
          options: [
            { id: 'A', text: 'Most of the accidents happened on roads without a cycle lane.', note: 'Says where accidents happen, not whether cycling became more dangerous. It could even support a call for more lanes.' },
            { id: 'B', text: 'The number of journeys made by bicycle in the city rose by 60% over the same year.', note: '' },
            { id: 'C', text: 'The scheme cost the city less than it had budgeted.', note: 'Cost has nothing to do with how dangerous cycling is.' },
            { id: 'D', text: 'Cyclists who use the shared bikes are, on average, younger than other cyclists.', note: 'Without knowing whether younger cyclists have more or fewer accidents, it neither weakens nor strengthens the conclusion.' },
          ],
          answer: 'B',
          workingMd:
            '“More dangerous” is a claim about risk per journey, but the evidence is a total. If journeys rose by 60% and accidents by only 15%, accidents per journey fell: $1.15 / 1.60 \\approx 0.72$, about 28% fewer per journey. The scheme may have made cycling safer per trip while the total rose. B attacks exactly the step from a count to a rate.',
          lesson: 'When a conclusion is about risk, rates or likelihood but the evidence is a raw count, look for the option that changes the denominator.',
        },
      ],
    },
    {
      id: 'data-insight-sample',
      heading: 'Data insight',
      introMd: 'Data insight has 16 questions on tables and charts. The traps are usually in what a figure is a percentage of.',
      questions: [
        {
          id: 'master-sample-subscription-share',
          title: 'Percentage points or per cent?',
          topic: 'Data insight: shares and changes',
          stimulusMd: `Subscriptions to a streaming service, by plan:

| Plan | 2025 | 2026 |
| --- | ---: | ---: |
| Basic | 1,200 | 1,500 |
| Standard | 800 | 900 |
| Premium | 400 | 600 |`,
          stemMd: 'By how many percentage points did Premium’s share of all subscriptions rise from 2025 to 2026?',
          options: [
            { id: 'A', text: '$3\\tfrac{1}{3}$', note: '' },
            { id: 'B', text: '20', note: '20% is Premium’s share in 2026, not the change in its share.' },
            { id: 'C', text: '25', note: 'All subscriptions grew by 25% (from 2,400 to 3,000). That is the growth of the total, not a change in Premium’s share.' },
            { id: 'D', text: '50', note: 'Premium subscriptions grew by 50% (from 400 to 600). That is a percentage change in Premium itself, not a change in its share in percentage points.' },
          ],
          answer: 'A',
          workingMd:
            'Totals: $1{,}200 + 800 + 400 = 2{,}400$ in 2025 and $1{,}500 + 900 + 600 = 3{,}000$ in 2026. Premium’s share: $400 / 2{,}400 = 16\\tfrac{2}{3}\\%$, then $600 / 3{,}000 = 20\\%$. The rise is $20 - 16\\tfrac{2}{3} = 3\\tfrac{1}{3}$ percentage points.',
          lesson: 'A change in a share is measured in percentage points; a change in a quantity in per cent. Compute both shares before subtracting.',
        },
      ],
    },
    {
      id: 'quantitative-reasoning-sample',
      heading: 'Quantitative reasoning',
      introMd: 'Quantitative reasoning has 10 questions: arithmetic, ratios and percentages, and algebra set as short problems.',
      questions: [
        {
          id: 'master-sample-ages',
          title: 'Turning words into two equations',
          topic: 'Quantitative reasoning: algebra and problem solving',
          stemMd: 'Anna is 10 years older than Bruno. In 4 years’ time, Anna will be twice as old as Bruno was 2 years ago. How old is Bruno now?',
          options: [
            { id: 'A', text: '16', note: '16 is Bruno’s age 2 years ago, the quantity inside the equation, not his age now.' },
            { id: 'B', text: '18', note: '' },
            { id: 'C', text: '22', note: '22 is Bruno’s age in 4 years’ time.' },
            { id: 'D', text: '28', note: '28 is Anna’s age now. Reread which person the question asks about.' },
          ],
          answer: 'B',
          workingMd:
            'Let Bruno be $b$ now, so Anna is $b + 10$. In 4 years Anna is $b + 14$; 2 years ago Bruno was $b - 2$. So $b + 14 = 2(b - 2) = 2b - 4$, which gives $b = 18$. Check: Anna is 28; in 4 years she is 32, and Bruno 2 years ago was 16, half of 32.',
          lesson: 'Give each person’s age now one letter, write every other age in terms of it, and check the answer against every sentence of the problem.',
        },
      ],
    },
  ],
  afterMd: `## About these examples

Written by the UniExamer team for this page with AI assistance, and published on 3 November 2026. They are not Bocconi questions, their difficulty is not calibrated to the real test, and three questions cannot estimate a score. Bocconi does not publish how many options each question has; these use four. They are not in our question bank, so reading the answers spoils no practice session. If you find a mistake, [tell us](/about/support).

Bocconi's own preparation material (a test sample, the Faculty app and an online simulation) is listed on its [graduate test page](${BOCCONI_GRADUATE_TEST_PAGE}).`,
};

export const bocconiMaster: HubContent = {
  headline: 'Bocconi Master’s admission',
  metaTitle: 'Bocconi Master’s admission: format, scoring and practice',
  leadMd: `**Bocconi's graduate Online Bocconi test is one of the ways into its Master of Science and MA programmes**; the GMAT or the GRE can be sent instead ([Bocconi on GMAT and GRE](${BOCCONI_GRADUATE_GMAT_GRE})). It has 50 multiple-choice questions in 75 minutes: Verbal reasoning 24, Data insight 16 and Quantitative reasoning 10. A right answer scores 1, a blank 0 and a wrong answer −0.25 or −0.33. A score below 15 out of 50 is not considered, and you can take the test at most three times in an academic year, never on the same or consecutive days ([graduate test page](${BOCCONI_GRADUATE_TEST_PAGE})).

The test result is one part of the application, alongside your degree results and the evaluation of your dossier. Bocconi publishes no admission cut-off above the 15-point floor.`,
  samples: {
    id: 'samples',
    heading: 'Worked sample questions',
    introMd:
      'One original question from each area, with the working and the reason each wrong option is wrong. On a four-option question with −0.25 for a wrong answer, a blind guess is worth $\\tfrac14 - \\tfrac34 \\times 0.25 = 0.0625$ points on average, and more once you can rule an option out; with −0.33 it is worth about 0. Bocconi does not publish how many options its questions have, so count them on screen before you decide.',
    set: samples,
  },
  updatedOn: '2026-11-03',
  sources: [
    { label: 'Online Bocconi test, international graduate applicants: areas, timing, scoring, the 15-point floor, attempts', url: BOCCONI_GRADUATE_TEST_PAGE, publisher: 'Università Bocconi' },
    { label: 'GMAT and GRE for Master of Science and MA programmes', url: BOCCONI_GRADUATE_GMAT_GRE, publisher: 'Università Bocconi' },
  ],
};
