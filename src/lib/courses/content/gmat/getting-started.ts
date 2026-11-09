import { md, type Lesson, type Unit } from '../../types';

/**
 * How the GMAT works. Every exam fact comes from the gmac.com rows of
 * docs/research/course-facts-2026-11-04.md. Details that only mba.com states
 * (the order-choice screen, review-screen conditions, break overrun rules,
 * percentiles, retakes) could not be re-checked and are not stated here.
 */

const howTheGmatWorks: Lesson = {
  slug: 'how-the-gmat-works',
  title: 'How the GMAT works: format, adaptivity, review and pacing',
  summary: 'The three 45-minute sections, question-by-question adaptivity, the three-change Review & Edit rule, and a pacing plan built from the timings.',
  minutes: 20,
  objectives: [
    'Describe the three sections, their timings and question counts, and the score scales GMAC states.',
    'Explain what question-by-question adaptivity and the Review & Edit rule mean for how you work a section.',
    'Build a pacing plan with checkpoints for each section from its time and question count.',
  ],
  teachMd: md`
### The shape of the exam

The GMAT is three sections of 45 minutes each, with 64 questions in all and a total testing time of 2 hours 15 minutes. There is no writing assessment.

| Section | Questions | Time | Average per question | Calculator |
| --- | --- | --- | --- | --- |
| Quantitative Reasoning | 21 | 45 min | about 2 min 9 s | none |
| Verbal Reasoning | 23 | 45 min | about 1 min 57 s | none stated (the content does not need one) |
| Data Insights | 20 | 45 min | 2 min 15 s | on-screen calculator |

- **Quantitative Reasoning** is Problem Solving only: 21 multiple-choice questions on algebraic and arithmetic foundations. Data Sufficiency is not in this section.
- **Verbal Reasoning** is 23 multiple-choice Reading Comprehension and Critical Reasoning questions.
- **Data Insights** has five question types: Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation and Two-Part Analysis. GMAC says that on questions with several parts, all parts must be correct to score.

GMAC says test takers can take the sections in whatever order they prefer, and there is an optional 10-minute break after the first or the second section. You may see the exam called the "Focus Edition", or the "11th Edition" in a 2026 GMAC article; GMAC's reference pages use the plain name, GMAT Exam.

### Scores

Each section is scored from 60 to 90. The total runs from 205 to 805, and GMAC says all GMAT Exam scores now end in a 5. The three sections are equally weighted in the total. GMAC lists what the scoring takes into account: the number of questions answered, whether they were answered correctly, and the difficulty and other parameters of the questions answered. The GMAC pages this course checked give no formula, so this course does not guess at one.

One practical reading of that list: the number of questions you answer is itself a factor. Plan to reach the end of every section rather than run out of time with questions untouched.

### Adaptivity, question by question

GMAC describes the exam as computer adaptive: it selects each question for the test taker based on their ability level. Two consequences follow.

- **Difficulty is not a signal.** If questions feel hard, that may simply be the test doing its job. Do not try to read your performance from how difficult the next question seems; work the question in front of you.
- **Each question deserves a real attempt, but not unlimited time.** The test is built one question at a time, and every question you reach and answer counts among the scoring factors. A question you sink six minutes into steals time from several later ones.

GMAC's pages do not say how much any single question, early or late, affects the score. Treat claims that "the first ten questions decide everything" as unsupported.

### Review & Edit

GMAC states that you can bookmark and review as many questions as you want, and change up to three answers per section. Note the asymmetry: bookmarking is unlimited, *changing* is capped at three per section.

That cap shapes good practice:

- **Bookmark freely, with a reason.** When you flag a question, note to yourself why: a calculation you would redo, a word you may have misread.
- **Change only with evidence.** Use a change when you find a specific error (a misread "not", a slip in arithmetic, the wrong unit), not because an answer "feels" wrong on a second look.
- **Leave time for it.** Review needs minutes at the end of the section. If you plan to use it, build those minutes into your pacing from the start.

Further details of how the review screen and the section-order choice work on screen are given on mba.com, which this course could not re-check. Read the current rules there before test day.

### Pacing: averages into checkpoints

An average per question is hard to use mid-section. Checkpoints are easier: a few points where you compare questions done with time used.

To build one, convert the section to seconds and divide: Verbal is $45 \times 60 = 2700$ seconds for 23 questions, about 117 seconds each. At that rate, by 15 minutes you should have done about $\frac{900}{117} \approx 7.7$ questions, and by 30 minutes about 15. Rounded, the plan is: 8 done at 15 minutes, 15 done at 30.

If you plan to keep time for Review & Edit, take it off the top before dividing (Example 2 below). If you fall behind a checkpoint, do not rush every remaining question; choose one question that is clearly going nowhere, make your best guess, and move on to recover the time.

### Which section first?

GMAC lets you choose. This course's advice: decide in advance, during practice, and test your choice in full-length timed sets. Some test takers prefer to begin with their strongest section to settle in; others start with the one that tires them most. Either is reasonable; what matters is not deciding on the day.
`,
  examples: [
    {
      id: 'example-verbal-checkpoints',
      title: 'Checkpoints for Verbal Reasoning',
      problemMd: md`Verbal Reasoning has 23 questions in 45 minutes. Build checkpoints at 15 and 30 minutes.`,
      steps: [
        md`Convert to seconds: $45 \times 60 = 2700$ seconds.`,
        md`Average per question: $\frac{2700}{23} \approx 117.4$ seconds, just under 2 minutes.`,
        md`Questions by 15 minutes (900 s): $\frac{900}{117.4} \approx 7.7$. By 30 minutes (1800 s): $\frac{1800}{117.4} \approx 15.3$.`,
        md`Check by the other route: 23 questions in 3 equal blocks of 15 minutes is $\frac{23}{3} \approx 7.7$ per block, so about 7.7 and 15.3. The two routes agree.`,
      ],
      answerMd: md`About 8 questions done at 15 minutes and about 15 at 30 minutes. Using a flat "2 minutes per question" gives 7.5 and 15, which looks close, but 23 questions at 2 minutes is 46 minutes, one more than the section has; the shortcut quietly plans to run out of time.`,
    },
    {
      id: 'example-review-reserve',
      title: 'Keeping four minutes for Review & Edit',
      problemMd: md`You want to keep 4 minutes at the end of Data Insights for reviewing bookmarked questions. How much time per question does that leave for the 20 questions?`,
      steps: [
        md`Take the reserve off the top: $45 - 4 = 41$ minutes for first attempts.`,
        md`Divide: $\frac{41}{20} = 2.05$ minutes, which is 2 minutes 3 seconds.`,
        md`Compare with no reserve: $\frac{45}{20} = 2.25$ minutes, 2 minutes 15 seconds. The reserve costs 12 seconds per question.`,
        md`Check: $12 \times 20 = 240$ seconds, which is the 4 minutes reserved.`,
      ],
      answerMd: md`About 2 minutes 3 seconds per question. The tempting slip is to keep pacing at 2 minutes 15 seconds and hope the reserve appears; it does not, because the reserve has to come out of every question.`,
    },
    {
      id: 'example-three-changes',
      title: 'Spending three changes on five bookmarks',
      problemMd: md`At the end of Quantitative Reasoning you have time to revisit five bookmarked questions. You find: on question 4, an arithmetic slip, and recomputing gives a different answer; on question 9, you guessed between two options and still have no new reason to prefer either; on question 12, you answered in hours when the question asked for minutes; on question 15, the answer now "feels" wrong but you cannot find an error; on question 19, you missed the word "not" in the question. Which answers do you change?`,
      steps: [
        md`Recall the rule: unlimited bookmarks, but at most three changes per section. Only three of the five can be changed.`,
        md`Sort by evidence. Questions 4, 12 and 19 each have a specific, identified error: a slip, a unit, a misread word. Questions 9 and 15 have no new information.`,
        md`Spend the three changes where the evidence is: 4, 12 and 19. Changing 9 or 15 swaps one uncertain answer for another.`,
      ],
      answerMd: md`Change questions 4, 12 and 19, and leave 9 and 15. The tempting move is to change question 15 because it "feels" wrong; without a found error, that uses a scarce change on a coin toss.`,
    },
  ],
  traps: [
    {
      title: 'Reading difficulty as a score report',
      md: md`In a question-adaptive test, hard questions may simply mean the test is matching your level. Panicking or relaxing because of how hard the questions feel changes your pacing for no reason. Work each question on its own terms.`,
    },
    {
      title: 'Treating bookmarks as changes',
      md: md`Bookmarking is unlimited, but changes are capped at three per section. Flagging fifteen questions "to fix later" is a plan you cannot carry out. Bookmark with a reason, and change only with evidence.`,
    },
    {
      title: 'A reserve that was never budgeted',
      md: md`Planning to "review at the end" while pacing at the full average leaves no time to review. If you want a reserve, take it off the section time before you work out your per-question pace.`,
    },
    {
      title: 'Sinking time into one question',
      md: md`A single stubborn question can take the time of three. Because the number of questions answered is among the scoring factors, running out of time is costly. Set a personal limit in practice, and when you hit it, make your best guess and move on.`,
    },
  ],
  check: [
    {
      id: 'check-quant-pace',
      title: 'Behind at 30 minutes',
      topic: 'Quantitative Reasoning',
      stemMd: md`In Quantitative Reasoning (21 questions, 45 minutes), a test taker has finished 12 questions after 30 minutes. To finish exactly on time, about how much time can each remaining question take?`,
      options: [
        { id: 'A', text: md`1 minute 15 seconds`, note: md`This divides the 15 remaining minutes by the 12 questions already done, not by the 9 still to do.` },
        { id: 'B', text: md`1 minute 40 seconds`, note: '' },
        { id: 'C', text: md`About 2 minutes 9 seconds`, note: md`That is the whole-section average, $\frac{45}{21}$; it ignores that the test taker is behind and has only 15 minutes left.` },
        { id: 'D', text: md`2 minutes 30 seconds`, note: md`This is the pace so far, 30 minutes over 12 questions, not the pace that is still possible.` },
        { id: 'E', text: md`3 minutes 20 seconds`, note: md`This divides the 30 minutes already used by the 9 remaining questions; it uses elapsed time instead of remaining time.` },
      ],
      answer: 'B',
      workingMd: md`Time left: $45 - 30 = 15$ minutes. Questions left: $21 - 12 = 9$. Pace: $\frac{15}{9} = 1\frac{2}{3}$ minutes, which is 1 minute 40 seconds. Check: $9 \times 100$ seconds $= 900$ seconds $= 15$ minutes.`,
      lesson: 'Pace for the rest of a section is remaining time divided by remaining questions.',
    },
    {
      id: 'check-review-edit-rule',
      title: 'The Review & Edit rule',
      topic: 'Question Review & Edit',
      stemMd: md`Which statement matches what GMAC states about Question Review & Edit?`,
      options: [
        { id: 'A', text: md`You may bookmark at most three questions per section.`, note: md`The limit of three applies to changed answers, not to bookmarks; GMAC says you can bookmark as many questions as you want.` },
        { id: 'B', text: md`You may change up to three answers across the whole exam.`, note: md`The cap is per section, not per exam, so up to three changes in each of the three sections.` },
        { id: 'C', text: md`You may bookmark as many questions as you want and change up to three answers per section.`, note: '' },
        { id: 'D', text: md`You may change any number of answers, provided you bookmarked them first.`, note: md`Bookmarking does not lift the cap; whatever was bookmarked, only three answers per section can be changed.` },
        { id: 'E', text: md`Review & Edit is available only in the Quantitative Reasoning section.`, note: md`GMAC states the rule per section, with no exception for Verbal Reasoning or Data Insights.` },
      ],
      answer: 'C',
      workingMd: md`GMAC states that test takers can bookmark and review as many questions as they want and change up to three answers per section. The other statements misplace the limit (on bookmarks, or across the whole exam), remove it, or restrict the feature to one section.`,
      lesson: 'Bookmarks are unlimited; changes are capped at three in each section.',
    },
    {
      id: 'check-format-facts',
      title: 'Sections and scores',
      topic: 'GMAT Exam format',
      stemMd: md`Which statement about the GMAT Exam matches what GMAC states?`,
      options: [
        { id: 'A', text: md`The total score runs from 200 to 800 in steps of 10.`, note: md`GMAC states a total from 205 to 805, and says all GMAT Exam scores now end in a 5.` },
        { id: 'B', text: md`Quantitative Reasoning includes Data Sufficiency questions.`, note: md`Quantitative Reasoning is Problem Solving only; Data Sufficiency belongs to Data Insights.` },
        { id: 'C', text: md`An on-screen calculator is available in Quantitative Reasoning.`, note: md`GMAC says you cannot use a calculator in Quantitative Reasoning; the on-screen calculator is in Data Insights.` },
        { id: 'D', text: md`The exam ends with a 30-minute writing assessment.`, note: md`GMAC states that the exam has no writing assessment.` },
        { id: 'E', text: md`Each of the three sections is scored from 60 to 90, and the three are equally weighted in the total.`, note: '' },
      ],
      answer: 'E',
      workingMd: md`GMAC states section scores of 60 to 90 each and a total of 205 to 805 to which the three sections contribute equally. The total does not run from 200 to 800, Data Sufficiency is in Data Insights rather than Quantitative Reasoning, GMAC says no calculator may be used in Quantitative Reasoning (the on-screen calculator is in Data Insights), and there is no writing assessment.`,
      lesson: 'Three equally weighted sections, each 60 to 90, give a total from 205 to 805.',
    },
  ],
  takeaways: [
    'Three 45-minute sections, 64 questions, 2 hours 15 minutes, no essay; you choose the order.',
    'Sections score 60 to 90, equally weighted; the total runs 205 to 805 and ends in a 5.',
    'The test adapts question by question, so how hard a question feels tells you nothing useful.',
    'Bookmark as many questions as you like, but change at most three answers per section.',
    'Turn averages into checkpoints, and take any review reserve off the top before dividing.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const gettingStartedUnit: Unit = {
  slug: 'getting-started',
  title: 'Getting started',
  summary: 'How the GMAT Exam is put together: three 45-minute sections, adaptive question selection, the Review & Edit rule and the score scales, with a pacing plan you can use in every practice set.',
  lessons: [howTheGmatWorks],
};
