import { md, type Lesson, type Unit } from '../../types';

/**
 * GRE unit 1: how the test is built and scored. Every exam fact here comes
 * from docs/research/course-facts-2026-11-04.md (ETS pages E1, E2, E3, E6, E7, E8).
 */
const howTheGreWorks: Lesson = {
  slug: 'how-the-gre-works',
  title: 'How the GRE works: sections, timing, adaptivity and scoring',
  summary: 'Know the five sections, the time per question, how section-level adaptivity works and why you should never leave a GRE question blank.',
  minutes: 18,
  objectives: [
    'Name the five sections of the GRE General Test with their question counts and times.',
    'Turn a section time into a per-question pace and set checkpoints for it.',
    'Explain what section-level adaptivity changes and what it does not.',
    'Use the scoring rules to decide what to do with unanswered questions.',
  ],
  teachMd: md`
### The shape of the test

The GRE General Test takes about 1 hour and 58 minutes and has five sections. The first is always Analytical Writing: one "Analyze an Issue" task in 30 minutes. After it come two Verbal Reasoning sections and two Quantitative Reasoning sections, which may appear in any order.

| Section | Questions | Time | Average per question |
| --- | --- | --- | --- |
| Analytical Writing | 1 Issue task | 30 min | n/a |
| Verbal Reasoning, section 1 | 12 | 18 min | 90 s |
| Verbal Reasoning, section 2 | 15 | 23 min | about 92 s |
| Quantitative Reasoning, section 1 | 12 | 21 min | 105 s |
| Quantitative Reasoning, section 2 | 15 | 26 min | 104 s |

The section times add up to $30 + 18 + 23 + 21 + 26 = 118$ minutes, which is where "about 1 hour and 58 minutes" comes from. The useful number is the last column: a Verbal question gets about a minute and a half, a Quant question a little under two minutes. Some questions take far less (a one-blank Text Completion you read once), some far more (the third question on a long passage), so the average is a budget to manage, not a speed limit.

### What is in each measure

**Verbal Reasoning** has three question types: Reading Comprehension, Text Completion and Sentence Equivalence. About half of the measure is passage-based. Text Completion gives you one to five sentences with one to three blanks; Sentence Equivalence gives you one sentence with one blank and six choices, of which you pick two. The next two units of this course cover those two types.

**Quantitative Reasoning** has four formats: Quantitative Comparison, multiple choice with one answer (five choices), multiple choice with one or more answers, and Numeric Entry. The content is arithmetic, algebra, geometry and data analysis at a level no higher than a second course in algebra; trigonometry, calculus and inferential statistics are not tested. An on-screen calculator is provided for the Quantitative Reasoning sections.

### Adaptive by section, not by question

The GRE is "section-level adaptive". The first Verbal section and the first Quant section are of average difficulty. How you do on that first section decides the difficulty of the second section of the same measure. Within a section, the questions are fixed once the section starts; your answer to question 3 does not change what question 4 is.

Two consequences follow. First, the first section of each measure deserves full care: it sets up the second. Second, you cannot read anything into how hard a question feels. A hard second section usually means the first went well, but there is nothing to gain by guessing at this during the test. Answer the question in front of you.

### Navigation inside a section

Within a section you can move forward and backward, mark questions with the Mark and Review tool, and change any answer until the section's time runs out. That freedom changes how you should work:

- Do not let one question eat three questions' worth of time. Give it a fair attempt, enter your best answer, mark it, and move on.
- Leave a minute or two at the end of each section to return to marked questions.
- Never leave a question unanswered when you move on. Put in your best guess first; you can change it later if time allows.

### How scoring works

Verbal and Quant are each reported on a 130 to 170 scale in one-point steps. For each measure, the raw score is simply the number of questions you got right. ETS converts it to the scaled score through a process called equating, and does not publish a conversion table, so do not trust anyone who tells you exactly how many questions a given score needs.

The rule that matters most during the test is this one: nothing is subtracted for a wrong answer. A blank and a wrong answer score the same, zero, so a guess can only help. On a Verbal question with several correct answers to select, a Sentence Equivalence question, or a Text Completion with two or three blanks, there is no partial credit: you must get every part right to score the question.

Analytical Writing is scored from 0 to 6 in half-point steps, on a 6-point holistic scale that includes a score from ETS's e-rater engine. It gets its own lessons later in the course.

### What to take into your preparation

Practise with the real timings from the start, because the per-question budget is part of the skill. Learn the question formats now, so that on test day no instruction screen costs you time. And make the no-penalty rule automatic: every question gets an answer before you leave it.
`,
  examples: [
    {
      id: 'example-pacing-plan',
      title: 'A pacing plan for the second Verbal section',
      problemMd: md`The second Verbal Reasoning section has 15 questions in 23 minutes. You want to keep 2 minutes at the end for marked questions. What pace should you aim for, and where should you be at the halfway point?`,
      steps: [
        md`Take the review time out first: $23 - 2 = 21$ minutes for a first pass through 15 questions.`,
        md`Divide: $\frac{21 \times 60}{15} = \frac{1260}{15} = 84$ seconds per question on the first pass.`,
        md`Set a checkpoint rather than timing each question. After 5 questions you should have used about $5 \times 84 = 420$ seconds, that is 7 minutes; after 10 questions, about 14 minutes.`,
        md`Check the plan against the whole: $15 \times 84 = 1260$ seconds $= 21$ minutes, plus the 2 minutes held back, gives the 23 minutes of the section.`,
      ],
      answerMd: md`Aim for about 84 seconds per question, with checkpoints at roughly 7 minutes (question 5) and 14 minutes (question 10). Using the section average of about 92 seconds for the first pass would leave no time for review.`,
    },
    {
      id: 'example-value-of-a-guess',
      title: 'What a guess is worth',
      problemMd: md`You have 20 seconds left on a five-choice, select-one Quant question you have not solved. You have ruled out two choices. Should you leave it blank or guess, and what is a guess worth on average?`,
      steps: [
        md`Recall the rule: the raw score is the number correct, and nothing is subtracted for a wrong answer. A blank scores 0.`,
        md`A guess among the 3 remaining choices is right with probability $\frac{1}{3}$, so it is worth $\frac{1}{3}$ of a raw point on average. A wrong guess still scores 0, the same as a blank.`,
        md`Even a blind guess among all five choices is worth $\frac{1}{5}$ of a point on average, which is more than the 0 of a blank.`,
      ],
      answerMd: md`Guess. With two choices eliminated the guess is worth $\frac{1}{3}$ of a raw point on average, and it cannot cost anything. Leaving it blank "to avoid a penalty" is the wrong habit: the GRE has no penalty.`,
    },
    {
      id: 'example-last-four-minutes',
      title: 'Using the last four minutes',
      problemMd: md`With 4 minutes left in a Quant section, you have one question you never reached and three marked questions that you answered with low confidence. In what order should you spend the time?`,
      steps: [
        md`First make sure nothing is blank: go to the unreached question and enter an answer, even a quick guess. This takes seconds and secures its chance of scoring.`,
        md`Then spend what is left on that same question if it looks quick to solve properly, because you have not yet had a real attempt at it.`,
        md`Use the remaining time on the marked questions, starting with the one where you were closest to a solution. You can change an answer at any time until the section ends.`,
      ],
      answerMd: md`Enter an answer for the unreached question first, then work on it if it looks quick, then revisit the marked questions in order of how close you were. Spending the whole four minutes on one marked question and leaving another question blank is the costly order.`,
    },
  ],
  traps: [
    {
      title: 'Leaving questions blank',
      md: md`Habits from tests with negative marking make some people leave questions empty "to be safe". On the GRE a blank scores exactly what a wrong answer scores, so it is never safer. Put in a guess before you move on, and mark the question if you want to return to it.`,
    },
    {
      title: 'Reading the difficulty as a signal',
      md: md`Because the test is adaptive by section, some people try to judge from how hard the questions feel whether they are doing well, and lose focus doing it. Within a section the questions are already fixed. Nothing you conclude about difficulty changes what you should do: answer the question in front of you.`,
    },
    {
      title: 'Treating the average time as a limit for every question',
      md: md`Ninety seconds is an average. Some Verbal questions need 30 seconds and some need three minutes. If you stop every question at the average you will abandon solvable long ones; if you never stop, one question will cost you three. Use checkpoints every five questions instead.`,
    },
    {
      title: 'Expecting partial credit',
      md: md`On a two-blank Text Completion, a Sentence Equivalence question or a "select one or more" Reading Comprehension question, getting part of it right scores nothing. Before you move on, check that every blank or every selection is filled as you intend.`,
    },
  ],
  check: [
    {
      id: 'check-seconds-per-question',
      title: 'Pace in the second Verbal section',
      topic: 'Test structure',
      stemMd: md`On average, about how many seconds per question does the second Verbal Reasoning section allow?`,
      options: [
        { id: 'A', text: md`72`, note: md`This divides the first Verbal section's 18 minutes by the second section's 15 questions, mixing the two sections.` },
        { id: 'B', text: md`90`, note: md`This is the first Verbal section: 18 minutes for 12 questions.` },
        { id: 'C', text: md`92`, note: '' },
        { id: 'D', text: md`104`, note: md`This is the second Quantitative section: 26 minutes for 15 questions.` },
        { id: 'E', text: md`105`, note: md`This is the first Quantitative section: 21 minutes for 12 questions.` },
      ],
      answer: 'C',
      workingMd: md`The second Verbal section has 15 questions in 23 minutes: $\frac{23 \times 60}{15} = \frac{1380}{15} = 92$ seconds per question.`,
      lesson: 'Work out the per-question budget for each section separately; the four sections do not share one pace.',
    },
    {
      id: 'check-what-adapts',
      title: 'What does the first section decide?',
      topic: 'Test structure',
      stemMd: md`A test taker does very well on the first Quantitative Reasoning section. Which of the following does that performance affect?`,
      options: [
        { id: 'A', text: md`The difficulty of the next question within the first Quantitative section`, note: md`The GRE adapts by section, not by question: within a section the questions are fixed once it starts.` },
        { id: 'B', text: md`The difficulty of the first Verbal Reasoning section`, note: md`The first section of each measure is of average difficulty for everyone; Quant performance does not set the Verbal level.` },
        { id: 'C', text: md`The difficulty of the second Quantitative Reasoning section`, note: '' },
        { id: 'D', text: md`The topic of the Analytical Writing task`, note: md`The Issue task always comes first, before any Quant section has been taken, so Quant performance cannot affect it.` },
        { id: 'E', text: md`The time allowed for the second Quantitative Reasoning section`, note: md`Adaptivity changes difficulty, not timing: the second Quant section is 15 questions in 26 minutes for everyone.` },
      ],
      answer: 'C',
      workingMd: md`The GRE is section-level adaptive. The first section of each measure is of average difficulty, and performance on it determines the difficulty of the second section of the same measure. So a strong first Quant section affects the second Quant section, and nothing else in the list.`,
      lesson: 'Adaptivity on the GRE works between the two sections of the same measure, never inside a section or across measures.',
    },
    {
      id: 'check-two-minutes-left',
      title: 'Two minutes, four questions',
      topic: 'Scoring',
      stemMd: md`With 2 minutes left in a Verbal section, a test taker has four questions she has not answered. Which plan gives her the best expected score?`,
      options: [
        { id: 'A', text: md`Leave all four blank, because wrong answers lose points`, note: md`Nothing is subtracted for a wrong answer on the GRE, so a blank is never safer than a guess.` },
        { id: 'B', text: md`Spend the two minutes trying to solve one of them properly and leave the other three blank`, note: md`One careful attempt is worth having, but leaving three blank throws away their chance of scoring for nothing.` },
        { id: 'C', text: md`Enter an answer for all four first, then use the remaining time to work on whichever looks quickest`, note: '' },
        { id: 'D', text: md`Answer only those where she can eliminate at least two choices, and leave the rest blank`, note: md`Elimination rule-of-thumb belongs to tests with a guessing penalty. On the GRE even a blind guess beats a blank.` },
        { id: 'E', text: md`Answer the two easiest-looking ones and leave the other two blank, keeping time to review earlier answers`, note: md`Reviewing earlier answers may change nothing, while the two blanks are certain zeros; filling them takes only seconds.` },
      ],
      answer: 'C',
      workingMd: md`The raw score is the number of correct answers, and nothing is subtracted for a wrong one. Every filled answer has some chance of scoring and a blank has none, so she should fill all four first (a few seconds each) and then spend what is left improving one of them.`,
      lesson: 'Fill every answer before you spend time improving any of them; on the GRE a guess can only help.',
    },
  ],
  takeaways: [
    'Five sections: the Issue essay first, then two Verbal and two Quant sections in any order, about 1 hour and 58 minutes in all.',
    'Verbal allows about 90 seconds a question and Quant about 105; manage them with checkpoints, not a stopwatch per question.',
    'The first section of each measure is of average difficulty and sets the difficulty of the second.',
    'Nothing is subtracted for wrong answers, and multi-part Verbal questions give no partial credit: answer everything, and answer every part.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-text-completion' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const gettingStartedUnit: Unit = {
  slug: 'getting-started',
  title: 'Getting started',
  summary: 'How the GRE General Test is built: the five sections and their timings, how the second section of each measure adapts to the first, how navigation inside a section works, and how Verbal, Quant and the essay are scored. Read this first; every later lesson assumes it.',
  lessons: [howTheGreWorks],
};
