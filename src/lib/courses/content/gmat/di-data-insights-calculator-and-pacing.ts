import { md, type Lesson } from '../../types';

/** GMAT Data Insights: using the on-screen calculator and pacing the section (docs/COURSE-AUTHORING.md, the plan). */

export const dataInsightsCalculatorPacingLesson: Lesson = {
  slug: 'data-insights-calculator-and-pacing',
  title: 'Data Insights: when to use the calculator, and how to pace 20 questions',
  summary: 'Decide when the on-screen calculator helps and when estimating is faster, catch keying slips, and pace 20 questions in 45 minutes with checkpoints.',
  minutes: 16,
  objectives: [
    'Choose between estimating and using the on-screen calculator for a given step.',
    'Catch a keying error by checking the size of the calculator\'s answer.',
    'Pace the section against checkpoints and recover time when behind.',
  ],
  teachMd: md`
### The facts that shape the section

GMAC describes Data Insights as 20 questions in 45 minutes, and states: "An on-screen calculator is available in this section." In Quantitative Reasoning, by contrast, GMAC says you cannot use a calculator. The section mixes five question types: Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation and Two-Part Analysis. GMAC also says that on questions with several parts, all parts must be correct to score, and that you can bookmark questions, review them and change up to three answers per section.

Two things follow. The calculator is there for arithmetic you would rather not do by hand, and the time per question is short: 45 minutes over 20 questions is $\frac{45}{20} = 2.25$ minutes, **2 minutes 15 seconds** a question on average, and question types built on a table, a graphic or several sources mean reading before any calculating.

### The calculator is a tool, not a method

A calculator removes arithmetic errors only when the right numbers go in. It does not tell you what to compute. The order of work is always: understand the question, set up the calculation on paper, then key it once.

Use the calculator when:

- the numbers are awkward and the answer choices are close (multiplying 4,820 by 0.37 to compare with something near it);
- a statement sits near a threshold and a rough estimate cannot settle it;
- several steps would compound rounding errors if done by hand.

Estimate instead when:

- the choices are far apart, so one significant figure decides;
- the question is a comparison or a ranking, which a single multiplication or a common denominator settles faster;
- you are checking whether a condition holds and one side clearly dominates.

A useful habit: estimate first, always. If the estimate already decides the question, you are done. If it does not, the estimate becomes a check on the calculator's answer.

### Check the size of every result

The common calculator mistakes are keying mistakes: a decimal point in the wrong place, a digit dropped, a percent entered as 7.5 instead of 0.075. Each of these changes the answer by a factor of 10 or more, which a rough estimate catches at once. Before you accept a result, ask whether it is about the size you expected. 7.5% of about 4,600 is about 350; a result of 3,465 or 34.65 is a keying slip.

### Compare without computing

Many Data Insights statements compare two quantities rather than ask for a value. To decide whether $\frac{a}{b}$ exceeds a fraction $\frac{p}{q}$, compare $aq$ with $bp$: one multiplication each, no division. To compare two percentages of different bases, compute both only if a rough look does not separate them.

### A pacing plan with checkpoints

Divide the section into quarters with simple checkpoints:

| Questions finished | Time used, about |
| --- | --- |
| 5 | 11 minutes |
| 10 | 22 to 23 minutes |
| 15 | 34 minutes |
| 20 | 45 minutes |

Glance at the clock only at the checkpoints, not after every question. If you are behind, decide early where to save time; finding three minutes over the next eight questions is easy, finding them over the last two is not.

### Recovering time

Questions are not equally long. A question with several sources or a dense table can need more than the average; a short Data Sufficiency question can need less. When a question is clearly going to take far more than your budget, make your best choice from what you have, bookmark it, and move on. GMAC names the number of questions answered as one of the factors in the score, so plan to reach the last question rather than spend the end of the section on one problem.

Because review lets you change only up to three answers per section, bookmarking is for the few questions where a second look could really change your answer, not for every question you felt unsure about.

### Multi-part questions cost more

When an item has several parts and all must be correct, every part needs the same care. Rushing the last part of a question you have already spent time on throws that time away. If you are going to save time, save it by deciding quickly on a question you cannot solve, not by skimping on the final part of one you can.
`,
  examples: [
    {
      id: 'example-too-close-to-estimate',
      title: 'When an estimate cannot decide',
      problemMd: md`Which is larger: 37% of 4,820 or 29% of 6,150?`,
      steps: [
        md`Estimate first: $0.37 \times 4820$ is under $0.4 \times 4800 = 1920$; $0.29 \times 6150$ is under $0.3 \times 6150 = 1845$. Both are pulled down by different amounts, so the estimate does not settle it.`,
        md`Work each exactly, splitting the percent: $4820 \times 0.37 = 1446 + 337.4 = 1783.4$, since $4820 \times 0.3 = 1446$ and $4820 \times 0.07 = 337.4$.`,
        md`$6150 \times 0.29 = 1845 - 61.5 = 1783.5$, since $6150 \times 0.3 = 1845$ and $6150 \times 0.01 = 61.5$.`,
        md`Compare: $1783.5 > 1783.4$, by just $0.1$. In the section this is a job for the calculator: key each product once and compare.`,
      ],
      answerMd: md`29% of 6,150 is larger, 1,783.5 against 1,783.4. Rounding either number before multiplying would have reversed or hidden a difference this small.`,
    },
    {
      id: 'example-estimate-is-enough',
      title: 'When one multiplication decides',
      problemMd: md`Is $\frac{1284}{3906}$ more or less than one third?`,
      steps: [
        md`Compare $\frac{1284}{3906}$ with $\frac{1}{3}$ by cross-multiplying: compare $3 \times 1284$ with $3906$.`,
        md`$3 \times 1284 = 3852$, which is less than 3,906.`,
        md`So $1284 < \frac{3906}{3}$, and the fraction is less than one third. Check: $\frac{3906}{3} = 1302$, and 1,284 is below it.`,
      ],
      answerMd: md`Less than one third. Dividing 1,284 by 3,906 on the calculator also works, but one multiplication by hand is faster and avoids keying a long division.`,
    },
    {
      id: 'example-behind-at-checkpoint',
      title: 'Behind at a checkpoint',
      problemMd: md`You have just finished question 8 of 20, and 23 minutes of the 45 have passed. How far behind the average pace are you, and how long can you spend on each remaining question if you share the remaining time equally?`,
      steps: [
        md`At 2 minutes 15 seconds a question, 8 questions should take $8 \times 2.25 = 18$ minutes. You have used 23, so you are 5 minutes behind.`,
        md`Remaining: $45 - 23 = 22$ minutes for $20 - 8 = 12$ questions.`,
        md`$\frac{22}{12} \approx 1.83$ minutes, which is 1 minute 50 seconds a question.`,
      ],
      answerMd: md`Five minutes behind, with about 1 minute 50 seconds for each of the last 12 questions. Recover the time over several questions now, for example by deciding quickly on any question you cannot crack, rather than rushing the last few.`,
    },
  ],
  traps: [
    {
      title: 'Keying before setting up',
      md: md`Starting to type before you know what to compute wastes time and invites errors. Write the expression first, such as $\frac{2.92}{110}$ or $0.185 \times 2736 - 0.12 \times 3104$, then key it once.`,
    },
    {
      title: 'Trusting a result without a size check',
      md: md`A misplaced decimal point changes an answer tenfold. Estimate the answer's size before you key it, and reject any result that is far from the estimate.`,
    },
    {
      title: 'Rounding before the calculation',
      md: md`Rounding the inputs is fine for an estimate, but when the choices are close it can move the answer onto the wrong one. If you are using the calculator, use the exact figures.`,
    },
    {
      title: 'Spending the end of the section on one question',
      md: md`A long problem started late can eat the time of three or four short ones. Use the checkpoints, and when one question runs far over budget, choose, bookmark and move on.`,
    },
  ],
  check: [
    {
      id: 'check-two-percents',
      title: 'A difference of two percents',
      topic: 'Data Insights',
      stemMd: md`Which of the following is closest to 18.5% of 2,736 minus 12% of 3,104?`,
      options: [
        { id: 'A', text: md`134`, note: '' },
        { id: 'B', text: md`146`, note: md`This comes from rounding 2,736 to 2,800 and 3,104 to 3,100 before multiplying: $518 - 372 = 146$. The choices are close, so use the exact figures.` },
        { id: 'C', text: md`372`, note: md`This is only 12% of 3,104, the amount being subtracted.` },
        { id: 'D', text: md`506`, note: md`This is only 18.5% of 2,736; the second term was never subtracted.` },
        { id: 'E', text: md`879`, note: md`This adds the two terms, $506.16 + 372.48$, instead of subtracting.` },
      ],
      answer: 'A',
      workingMd: md`$0.185 \times 2736 = 506.16$ (check: $0.2 \times 2736 = 547.2$, minus $0.015 \times 2736 = 41.04$). $0.12 \times 3104 = 372.48$. The difference is $506.16 - 372.48 = 133.68$, closest to 134.`,
      lesson: 'Set up the whole expression before keying it, and keep exact figures when the choices are close.',
    },
    {
      id: 'check-remaining-pace',
      title: 'Time left per question',
      topic: 'Data Insights',
      stemMd: md`In a 45-minute section of 20 questions, a test taker has used 27 minutes and has just finished question 10. If she shares the remaining time equally among the remaining questions, about how long can she spend on each?`,
      options: [
        { id: 'A', text: md`54 seconds`, note: md`This shares the remaining 18 minutes among all 20 questions instead of the 10 still to do.` },
        { id: 'B', text: md`1 minute 38 seconds`, note: md`This divides 18 minutes by 11, counting question 10, which is already finished, as still to do.` },
        { id: 'C', text: md`1 minute 48 seconds`, note: '' },
        { id: 'D', text: md`2 minutes 15 seconds`, note: md`This is the average for the whole section, $\frac{45}{20}$ minutes; she has already used more than half the time.` },
        { id: 'E', text: md`2 minutes 42 seconds`, note: md`This is her pace so far, $\frac{27}{10}$ minutes a question; keeping it would overrun the section.` },
      ],
      answer: 'C',
      workingMd: md`Time left: $45 - 27 = 18$ minutes. Questions left: $20 - 10 = 10$. So $\frac{18}{10} = 1.8$ minutes, which is 1 minute 48 seconds each.`,
      lesson: 'Pace from the time and questions that remain, not from the section average.',
    },
    {
      id: 'check-keying-slip',
      title: 'A result of the wrong size',
      topic: 'Data Insights',
      stemMd: md`A test taker wants 7.5% of 4,620. The calculator shows 3,465. Which of the following best explains the result?`,
      options: [
        { id: 'A', text: md`Nothing is wrong; 7.5% of 4,620 is 3,465`, note: md`7.5% of about 4,600 is about 350, so 3,465 is roughly ten times too large.` },
        { id: 'B', text: md`7.5% was keyed as 0.75; the correct result is 346.5`, note: '' },
        { id: 'C', text: md`7.5% was keyed as 0.0075; the correct result is 34.65`, note: md`0.0075 is 0.75%, not 7.5%, and keying it would give 34.65, not 3,465.` },
        { id: 'D', text: md`The calculation should be a division; the correct result is 61,600`, note: md`A percent of a number is a multiplication; $4620 \div 0.075 = 61{,}600$ answers a different question.` },
        { id: 'E', text: md`The result only needs rounding; the correct result is 3,500`, note: md`Rounding cannot fix a result that is ten times too large; the size check rules out anything near 3,500.` },
      ],
      answer: 'B',
      workingMd: md`7.5% is $0.075$, and $4620 \times 0.075 = 346.5$ (check: 10% is 462, 2.5% is 115.5, and $462 - 115.5 = 346.5$). The displayed 3,465 is exactly $4620 \times 0.75$, ten times too large: the decimal point was keyed one place to the right.`,
      lesson: 'Estimate the size of a result before you trust the calculator; a slip of one decimal place is a factor of ten.',
    },
  ],
  takeaways: [
    'Data Insights has 20 questions in 45 minutes, about 2 minutes 15 seconds each, with an on-screen calculator.',
    'Set up the calculation on paper first, then key it once.',
    'Estimate first: if the estimate decides, stop; if not, it checks the calculator.',
    'Use checkpoints at questions 5, 10 and 15, and recover lost time early.',
  ],
  practice: { examKey: 'gmat', domain: 'di-table-analysis', skill: 'ta-analyze-spreadsheet-data' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
