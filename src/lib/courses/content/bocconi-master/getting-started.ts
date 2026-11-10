import { md, type Lesson, type Unit } from '../../types';

/** Exam facts: docs/research/bocconi-master-facts-2026-11-09.md only. */

const howTheBocconiMasterTestWorks: Lesson = {
  slug: 'how-the-bocconi-master-test-works',
  title: 'How the Bocconi master’s test works',
  summary: 'The Online Bocconi Test for MSc and MA applicants: 50 mixed questions in 75 minutes, three areas, three questions per screen, the penalties and the floor.',
  minutes: 15,
  objectives: [
    'Describe the format: 50 questions, 75 minutes, three areas mixed together, three questions per screen with no return.',
    'Say what Bocconi publishes about each area and what it does not publish.',
    'Turn a set of right, wrong and blank answers into a score, and the 15-point floor into a number of right answers.',
  ],
  teachMd: md`
### Who takes it and what it counts for

International applicants to Bocconi's Master of Science and MA programmes can send one of three test results: the GMAT, the GRE or the Online Bocconi Test. The test result is one of the compulsory parts of the application, together with the undergraduate GPA and the dossier and motivation; an application missing any of them is not evaluated. If you send more than one score, Bocconi says its system takes "the most competitive score". It does not publish how a Bocconi test total is compared with a GMAT or GRE score. The PPA and GLOBE programmes need no test.

### The format at a glance

| Feature | What Bocconi's rules say |
| --- | --- |
| Questions | 50, multiple choice |
| Time | 75 minutes |
| Areas | Verbal reasoning 24, Data insight 16, Quantitative reasoning 10 |
| Order | Mixed by topic and by difficulty, not in blocks |
| Screens | Three questions per screen; after "Next" you cannot return to earlier screens |
| End of test | "Finish" shows a summary of answered and omitted questions; the test submits itself when time runs out |
| Calculator | Not permitted |
| On the desk | One pen or pencil and two blank A4 sheets, among a few other items |
| Language | Italian or English, chosen when you buy the test |
| Delivery | Online at home, with webcam and phone recording reviewed afterwards |

Two of these rules shape your preparation more than the rest. **No calculator** means every percentage, average and growth rate in data insight and quantitative reasoning is worked by hand, so practise that way from the start. **No return to an earlier screen** means there is no second pass: whatever you decide on a screen before pressing "Next" is final.

### The three areas, as Bocconi describes them

**Verbal reasoning (24 questions)** has three item types. *Reading comprehension* asks questions on passages. *Data/Statements* gives some data and some statements and asks you to decide whether each statement is true or false. *Verbal critical reasoning* gives a short passage, which you treat as true, and asks, for example, which condition would best support its thesis.

**Data insight (16 questions)** has two item types. *Numerical critical reasoning* gives tables, histograms, graphs or short passages, each followed by several questions. *Data sufficiency* gives a problem and two statements and asks which of them, if any, is needed to solve it.

**Quantitative reasoning (10 questions)** is described only as numerical and logical problems using basic mathematics and analytical thinking. Bocconi publishes no topic list, so the quantitative unit of this course covers the core arithmetic, algebra, counting and statistics that such problems draw on.

Verbal reasoning is the largest area: 24 of 50 questions, almost half the test. That is why this course gives it eight lessons.

### Scoring and the floor

A right answer earns $+1$, a blank $0$, and a wrong answer $-0.25$, or $-0.33$ on some questions. Bocconi does not say which questions carry $-0.33$. The total includes the penalties, and **a total lower than 15 out of 50 is not considered**. Fifteen is a floor for being considered at all, not a target: Bocconi publishes no average or typical admitted score.

The score from a set of answers is

$$\text{score} = (\text{right}) - 0.25 \times (\text{wrong at } {-0.25}) - 0.33 \times (\text{wrong at } {-0.33}).$$

Blanks add nothing and cost nothing.

### Attempts and results

You can sit the test at most three times in an academic year, not on the same day or on consecutive days, and each attempt costs EUR 60. Your total appears on screen as soon as you finish; a report follows in about 48 hours with the total, the score in each area and the numbers of correct, incorrect and unanswered questions. For the 2027/28 year, attempts from earlier academic years and scores from Bocconi's online simulation cannot be used.

### What Bocconi does not publish

Knowing the gaps stops you planning around guesses. Bocconi does not publish which questions carry $-0.33$, how many options each question has, how much time each area should take, any minimum per area, or a topic list for quantitative reasoning. This course never fills those gaps with invented facts; where a lesson suggests a strategy, it says that the strategy is ours.
`,
  examples: [
    {
      id: 'example-score-from-a-report',
      title: 'Turning a result into a score',
      problemMd: md`A candidate's report shows 31 correct, 11 incorrect and 8 unanswered questions. What is the total if every wrong answer cost $0.25$? What is it if 3 of the 11 wrong answers were on questions that cost $0.33$?`,
      steps: [
        md`Check the counts first: $31 + 11 + 8 = 50$, so every question is accounted for.`,
        md`All wrong answers at $-0.25$: the penalty is $11 \times 0.25 = 2.75$, so the total is $31 - 2.75 = 28.25$.`,
        md`With 3 wrong answers at $-0.33$: the penalty is $8 \times 0.25 + 3 \times 0.33 = 2 + 0.99 = 2.99$, so the total is $31 - 2.99 = 28.01$.`,
        md`The 8 blanks change neither total: a blank scores 0.`,
      ],
      answerMd: md`The total is $28.25$ with every penalty at $0.25$, and $28.01$ if three of the wrong answers cost $0.33$. The unnamed $-0.33$ questions move a total only slightly; counting the blanks as wrong answers would be a much bigger error.`,
    },
    {
      id: 'example-floor-in-right-answers',
      title: 'What the 15-point floor means in right answers',
      problemMd: md`Suppose every wrong answer costs $0.25$. A candidate answers all 50 questions. How many must be right for the total to reach at least 15? How does that change if the candidate answers only 36 questions and leaves 14 blank?`,
      steps: [
        md`Write $c$ for the number right. Answering all 50 leaves $50 - c$ wrong, so the total is $c - 0.25(50 - c) = 1.25c - 12.5$.`,
        md`Set $1.25c - 12.5 \ge 15$, so $1.25c \ge 27.5$ and $c \ge 22$. Check: $22 - 0.25 \times 28 = 22 - 7 = 15$, while $21 - 0.25 \times 29 = 13.75$.`,
        md`Answering 36 leaves $36 - c$ wrong: the total is $c - 0.25(36 - c) = 1.25c - 9$. Then $1.25c \ge 24$ gives $c \ge 19.2$, so $c = 20$.`,
        md`Check: $20 - 0.25 \times 16 = 16$, which clears the floor, while $19 - 0.25 \times 17 = 14.75$ does not.`,
      ],
      answerMd: md`Answering everything, 22 right answers reach exactly 15. Answering 36, 20 right answers give 16. Reading "15 out of 50" as "15 right answers" ignores the penalties and falls short in both cases.`,
    },
    {
      id: 'example-time-budget',
      title: 'The time budget per question and per screen',
      problemMd: md`How much time does an even pace give each question and each screen of three questions?`,
      steps: [
        md`Convert the time to seconds: $75 \times 60 = 4500$ seconds.`,
        md`Per question: $\frac{4500}{50} = 90$ seconds, a minute and a half.`,
        md`Per screen of three: $3 \times 90 = 270$ seconds, four and a half minutes.`,
        md`Because the areas are mixed, this is one budget for the whole test, not separate clocks per area. A verbal passage may need more than 90 seconds and a quick quantitative item less; what matters is the running total.`,
      ],
      answerMd: md`An even pace is 90 seconds per question and $4\frac{1}{2}$ minutes per screen. The next lesson turns this into checkpoints.`,
    },
  ],
  traps: [
    {
      title: 'Treating 15 as a target',
      md: md`A total below 15 is not considered, but nothing says 15 is enough to be admitted; Bocconi publishes no typical admitted score. Plan to score as high as you can, and use the floor only to see how far below it a weak attempt would fall.`,
    },
    {
      title: 'Planning a second pass',
      md: md`Habits from paper tests ("skip it, come back at the end") do not work here: after "Next" an earlier screen cannot be reopened. Practise deciding every question on a screen before you leave it.`,
    },
    {
      title: 'Practising with a calculator',
      md: md`Calculators are not permitted. If you check data insight answers with a calculator during preparation, the test will be the first time you do the arithmetic by hand, under time pressure. Practise with pen and paper only.`,
    },
    {
      title: 'Counting blanks as wrong',
      md: md`A blank scores 0; only a wrong answer is penalised. When you compute a score, apply the penalty to the incorrect answers only.`,
    },
  ],
  check: [
    {
      id: 'check-compute-a-score',
      title: 'Computing a total',
      topic: 'Test format and scoring',
      stemMd: md`A candidate has 30 correct, 12 incorrect and 8 unanswered questions. Every incorrect answer costs $0.25$. What is the total score?`,
      options: [
        { id: 'A', text: md`18`, note: md`This subtracts a full point for each wrong answer; the penalty is a quarter of a point.` },
        { id: 'B', text: md`25`, note: md`This also charges the penalty on the 8 blanks ($20 \times 0.25 = 5$). A blank scores 0.` },
        { id: 'C', text: md`27`, note: '' },
        { id: 'D', text: md`30`, note: md`This counts the right answers and ignores the penalty for the 12 wrong ones.` },
      ],
      answer: 'C',
      workingMd: md`The penalty applies to the incorrect answers only: $12 \times 0.25 = 3$. The total is $30 - 3 = 27$; the 8 blanks add nothing and cost nothing.`,
      lesson: 'Score = right answers minus the penalty on the wrong ones; blanks are zero.',
    },
    {
      id: 'check-floor-right-answers',
      title: 'Reaching the floor',
      topic: 'Test format and scoring',
      stemMd: md`A candidate answers all 50 questions, and every wrong answer costs $0.25$. What is the smallest number of right answers that gives a total of at least 15?`,
      options: [
        { id: 'A', text: md`15`, note: md`This ignores the penalties: with 15 right and 35 wrong the total is $15 - 8.75 = 6.25$.` },
        { id: 'B', text: md`22`, note: '' },
        { id: 'C', text: md`24`, note: md`This uses a penalty of 0.33 for every wrong answer, a worst case; the question states 0.25.` },
        { id: 'D', text: md`28`, note: md`This charges the penalty on all 50 questions ($c - 12.5 \ge 15$) instead of on the wrong answers only.` },
      ],
      answer: 'B',
      workingMd: md`With $c$ right and $50 - c$ wrong, the total is $c - 0.25(50 - c) = 1.25c - 12.5$. Setting $1.25c - 12.5 \ge 15$ gives $c \ge 22$. Check: $22 - 0.25 \times 28 = 15$, and $21 - 0.25 \times 29 = 13.75$, which falls short.`,
      lesson: 'Because every wrong answer also costs a quarter point, the floor needs more right answers than its face value suggests.',
    },
    {
      id: 'check-test-rules',
      title: 'Which rule is right?',
      topic: 'Test format and scoring',
      stemMd: md`Which statement about the Online Bocconi Test for master's applicants agrees with Bocconi's published rules?`,
      options: [
        { id: 'A', text: md`A calculator may be used for the quantitative questions.`, note: md`Bocconi's rules list calculators among the items that may not be present or used.` },
        { id: 'B', text: md`Each area is a separately timed section taken in a fixed order.`, note: md`Bocconi says the questions are mixed by topic and difficulty within the 75 minutes; no per-area time is published.` },
        { id: 'C', text: md`Before submitting, you can reopen any earlier screen and change an answer.`, note: md`The final summary shows which questions were answered or omitted, but earlier screens cannot be reopened after "Next".` },
        { id: 'D', text: md`Questions appear three to a screen, and an earlier screen cannot be reopened.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Bocconi's rules for the 2027/28 graduate test put three questions on each screen and state that after "Next" you cannot return to previous screens. Calculators are prohibited, the three areas are mixed rather than timed separately, and the closing summary does not reopen earlier screens.`,
      lesson: 'The navigation rule is the one that changes how you work: every decision on a screen is final when you press Next.',
    },
  ],
  takeaways: [
    '50 questions in 75 minutes: 24 verbal, 16 data insight, 10 quantitative, mixed together.',
    'Three questions per screen, no return to an earlier screen, and no calculator.',
    md`Right $+1$, blank $0$, wrong $-0.25$ or, on unnamed questions, $-0.33$; a total under 15 is not considered.`,
    'An even pace is 90 seconds per question, four and a half minutes per screen.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-verbal-reasoning' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};

const scoringPacingAndGuessing: Lesson = {
  slug: 'scoring-pacing-and-guessing',
  title: 'Scoring, pacing and guessing',
  summary: 'What a guess is worth under the −0.25 and −0.33 penalties, how elimination changes it, and how to pace a test where you can never go back.',
  minutes: 20,
  objectives: [
    md`Compute the expected value of a guess under the $-0.25$ and $-0.33$ penalties, with and without eliminated options.`,
    'Find the break-even chance of being right above which answering beats leaving a blank.',
    'Pace 50 questions in 75 minutes with checkpoints, knowing that every screen is final.',
  ],
  teachMd: md`
### What Bocconi states, and what is ours

Bocconi's rules give the scoring: $+1$ for a right answer, $0$ for a blank, $-0.25$ for a wrong answer, or $-0.33$ on some questions it does not name. It does not publish how many options each question has, and it gives no advice on guessing or pacing. Everything below the rules is **our analysis**, using one tool from probability.

### Expected value

The expected value of answering is the average number of points the answer would earn if you could repeat the decision many times. With a chance $p$ of being right and a penalty $k$:

$$E = p \times 1 + (1 - p) \times (-k) = p - k(1 - p).$$

A blank always earns $0$, so on average an answer is worth giving when $E > 0$.

### A blind guess on a four-option question

Picking one of four options at random gives $p = \frac{1}{4}$. With the $-0.25$ penalty:

$$E = 0.25 - 0.75 \times 0.25 = 0.25 - 0.1875 = 0.0625 = \tfrac{1}{16}.$$

The same in fractions: $\frac{1}{4} - \frac{3}{4} \times \frac{1}{4} = \frac{4}{16} - \frac{3}{16} = \frac{1}{16}$. A blind guess is worth a sixteenth of a point on average: positive, but tiny. It takes about sixteen blind guesses to gain one point on average.

### When the penalty or the number of options changes

Because Bocconi names neither the $-0.33$ questions nor the option counts, it is worth seeing how sensitive the answer is:

| Options | Penalty | Blind-guess value |
| --- | --- | --- |
| 4 | $-0.25$ | $+0.0625$ |
| 4 | $-0.33$ | $0.25 - 0.75 \times 0.33 = +0.0025$ |
| 5 | $-0.25$ | $0.2 - 0.8 \times 0.25 = 0$ |
| 5 | $-0.33$ | $0.2 - 0.8 \times 0.33 = -0.064$ |
| 3 | $-0.33$ | $\frac{1}{3} - \frac{2}{3} \times 0.33 \approx +0.113$ |

Across these cases a blind guess is worth roughly nothing, sometimes a little more, sometimes a little less. Our working rule is therefore: **do not count on blind guessing to gain points**. What changes the picture is elimination.

### Elimination and the break-even point

Setting $p - k(1 - p) > 0$ and solving gives the break-even chance:

$$p > \frac{k}{1 + k}.$$

For $k = 0.25$ that is $\frac{0.25}{1.25} = 0.2$; for $k = 0.33$ it is $\frac{0.33}{1.33} \approx 0.248$. Ruling out even one option of four with confidence lifts $p$ to $\frac{1}{3}$, above both thresholds:

| Four-option question | Value at $-0.25$ | Value at $-0.33$ |
| --- | --- | --- |
| No option ruled out | $+0.0625$ | $+0.0025$ |
| One ruled out | $\frac{1}{3} - \frac{2}{3}(0.25) = \frac{1}{6} \approx +0.167$ | $\frac{1}{3} - 0.22 \approx +0.113$ |
| Two ruled out | $0.5 - 0.5(0.25) = +0.375$ | $0.5 - 0.5(0.33) = +0.335$ |

So our rule: **if you can confidently eliminate at least one option, answer**; if you cannot eliminate anything, a blank costs you almost nothing. The word "confidently" matters: if a trap option has drawn you in, your real chance may be lower than you think.

### Average is not everything

Expected value describes the long run, and one test is short. Eight blind guesses at $-0.25$ are worth $8 \times 0.0625 = 0.5$ points on average, but the chance that all eight are wrong is $\left(\frac{3}{4}\right)^8 \approx 0.10$, and that outcome costs 2 points. If a few points decide whether you clear the 15-point floor, that spread matters as much as the average.

### Pacing a forward-only test

An even pace is 90 seconds per question and $4\frac{1}{2}$ minutes per screen of three. Because questions are mixed by topic and difficulty, a screen may hold a long passage question next to a two-line calculation, so pace by the running total, not by each question. Our suggested checkpoints:

| After | Questions done | Clock at most |
| --- | --- | --- |
| 5 screens | 15 | 22.5 minutes |
| 10 screens | 30 | 45 minutes |
| 15 screens | 45 | 67.5 minutes |

There is no second pass, so the usual "skip and return" habit does not exist here. On each screen, give every question a final decision before pressing "Next": an answer, an educated guess after elimination, or a deliberate blank. Our suggestion is a soft cap of about three minutes on any single question; past that, eliminate what you can, decide, and move on. When time runs out the test submits itself, so a question you never reached simply stays blank.
`,
  examples: [
    {
      id: 'example-blind-guess-value',
      title: 'The value of a blind guess',
      problemMd: md`On a four-option question with a $-0.25$ penalty you have no idea which option is right. What is a random guess worth on average, compared with a blank?`,
      steps: [
        md`A random pick is right with probability $\frac{1}{4}$ and wrong with probability $\frac{3}{4}$.`,
        md`Expected value: $\frac{1}{4} \times 1 + \frac{3}{4} \times (-0.25) = 0.25 - 0.1875 = 0.0625$.`,
        md`Second route, in sixteenths: $\frac{4}{16} - \frac{3}{16} = \frac{1}{16} = 0.0625$.`,
        md`A blank is worth exactly $0$, so the guess is ahead by $0.0625$ on average.`,
      ],
      answerMd: md`A blind guess is worth $+0.0625$ on average, a sixteenth of a point. It is not exactly zero (the tempting conclusion that "the penalty cancels the guess"), but it is too small to rely on, and if the question carries $-0.33$ it shrinks to $+0.0025$.`,
    },
    {
      id: 'example-two-eliminated',
      title: 'Two options ruled out, penalty unknown',
      problemMd: md`You have ruled out two options of four with confidence and cannot choose between the other two. You do not know whether this question carries $-0.25$ or $-0.33$. Should you answer?`,
      steps: [
        md`With two options left, $p = \frac{1}{2}$.`,
        md`At $-0.25$: $E = 0.5 - 0.5 \times 0.25 = 0.375$.`,
        md`At $-0.33$: $E = 0.5 - 0.5 \times 0.33 = 0.335$.`,
        md`Both are well above $0$, and $p = 0.5$ is far above either break-even point (0.2 or about 0.248), so the unknown penalty does not change the decision.`,
      ],
      answerMd: md`Answer: the guess is worth between $+0.335$ and $+0.375$ on average, whichever penalty applies. Leaving it blank throws away a third of a point on average.`,
    },
    {
      id: 'example-behind-schedule',
      title: 'Catching up after a slow start',
      problemMd: md`After 40 minutes you have finished 8 screens (24 questions). Are you on pace, and how much time per question is left for the rest?`,
      steps: [
        md`At 90 seconds each, 24 questions should take $24 \times 1.5 = 36$ minutes. You have used 40, so you are 4 minutes behind.`,
        md`Remaining: $50 - 24 = 26$ questions in $75 - 40 = 35$ minutes.`,
        md`Per question: $\frac{35}{26} \approx 1.35$ minutes, about 81 seconds. Check: $26 \times 81 = 2106$ seconds, about 35 minutes.`,
        md`Spread the saving across the remaining screens (about 9 seconds per question) rather than racing through the last few screens, where rushing costs most.`,
      ],
      answerMd: md`You are 4 minutes behind, with about 81 seconds per remaining question. A small cut on every screen recovers it; leaving it all to the end risks unreached questions.`,
    },
  ],
  traps: [
    {
      title: 'Believing the penalty exactly cancels a guess',
      md: md`With four options and $-0.25$, a blind guess is worth $+0.0625$, not $0$: the penalty is a quarter point, but you are wrong only three times in four. The opposite belief, that guessing always pays, is also wrong: with $-0.33$, or with more options, a blind guess can be worth nothing or slightly less.`,
    },
    {
      title: 'Assuming every penalty is $-0.25$',
      md: md`Bocconi does not say which questions cost $0.33$. Plan with both values: the decisions that matter (answer after eliminating one option, blank when you can eliminate nothing) come out the same either way.`,
    },
    {
      title: 'Saving hard questions for later',
      md: md`There is no later: after "Next" an earlier screen cannot be reopened. A question left for "a second look" becomes a blank. Decide every question on the screen before you leave it.`,
    },
    {
      title: 'Sinking minutes into one question',
      md: md`Three extra minutes on one stubborn item is the time budget of two other questions. When a question passes your cap, eliminate what you can, apply the guessing rule, and move on.`,
    },
  ],
  check: [
    {
      id: 'check-one-eliminated',
      title: 'One option ruled out',
      topic: 'Scoring and guessing',
      stemMd: md`On a four-option question with a $-0.25$ penalty, you rule out one option with certainty and guess at random among the other three. What is the expected value of the guess?`,
      options: [
        { id: 'A', text: md`$0$`, note: md`This assumes the penalty is set to cancel guessing exactly; with three options left, the right answer is far more likely than that.` },
        { id: 'B', text: md`$+0.0625$`, note: md`This is the value of a blind guess among all four options; it ignores the option you ruled out.` },
        { id: 'C', text: md`about $+0.167$`, note: '' },
        { id: 'D', text: md`about $+0.333$`, note: md`This is only the chance of being right; it leaves out the $-0.25$ lost two times in three.` },
      ],
      answer: 'C',
      workingMd: md`With three options left, $p = \frac{1}{3}$. Then $E = \frac{1}{3} \times 1 + \frac{2}{3} \times (-0.25) = \frac{1}{3} - \frac{1}{6} = \frac{1}{6} \approx 0.167$.`,
      lesson: 'Each confident elimination raises the value of answering sharply.',
    },
    {
      id: 'check-guess-at-033',
      title: 'A blind guess at −0.33',
      topic: 'Scoring and guessing',
      stemMd: md`Suppose a four-option question carries the $-0.33$ penalty and you guess completely at random. What is the expected value of the guess?`,
      options: [
        { id: 'A', text: md`$-0.08$`, note: md`This subtracts the whole penalty from $0.25$; the penalty is lost only when the guess is wrong, three times in four.` },
        { id: 'B', text: md`$+0.0025$`, note: '' },
        { id: 'C', text: md`$+0.0625$`, note: md`This uses the $-0.25$ penalty; the question states $-0.33$.` },
        { id: 'D', text: md`$+0.1675$`, note: md`This weights the penalty by the chance of being right ($\frac{1}{4}$) instead of the chance of being wrong ($\frac{3}{4}$).` },
      ],
      answer: 'B',
      workingMd: md`$E = \frac{1}{4} \times 1 + \frac{3}{4} \times (-0.33) = 0.25 - 0.2475 = 0.0025$. It is positive but negligible: a blind guess on such a question is, in practice, worth nothing.`,
      lesson: 'A blind guess is worth roughly zero; elimination, not luck, is what makes answering pay.',
    },
    {
      id: 'check-screen-plan',
      title: 'Planning around the screens',
      topic: 'Pacing',
      stemMd: md`Given Bocconi's rule that you cannot return to an earlier screen, which plan makes the most sense?`,
      options: [
        { id: 'A', text: md`Skip any hard question and come back to it after finishing the easy ones.`, note: md`After "Next" an earlier screen cannot be reopened, so a skipped question simply stays blank.` },
        { id: 'B', text: md`Answer all the verbal questions first, then the data insight and quantitative ones.`, note: md`The areas are mixed across the test, and you can only move forward, so you cannot choose an order by area.` },
        { id: 'C', text: md`Spend extra time on the first screens, because the questions get easier later.`, note: md`Bocconi says questions are mixed by difficulty; nothing published says later questions are easier.` },
        { id: 'D', text: md`Before pressing Next, give each question on the screen an answer, an elimination guess or a deliberate blank.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Because earlier screens close for good, every decision has to be made on the screen itself. Order by area or by difficulty is not available, since the questions are mixed, and "coming back" is impossible.`,
      lesson: 'On a forward-only test, finish each screen before you leave it.',
    },
  ],
  takeaways: [
    md`Expected value of answering: $E = p - k(1 - p)$; answer when $p > \frac{k}{1+k}$ (0.2 at $-0.25$, about 0.248 at $-0.33$).`,
    md`A blind four-option guess at $-0.25$ is worth exactly $+0.0625$; treat blind guessing as roughly worthless.`,
    'Eliminate at least one option with confidence and answering pays under either penalty (our rule, not Bocconi’s).',
    'Pace at 90 seconds a question, check the clock every five screens, and settle each screen before pressing Next.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};

export const gettingStartedUnit: Unit = {
  slug: 'getting-started',
  title: 'Getting started',
  summary: 'How the Online Bocconi Test for master’s applicants is built and scored: 50 mixed questions in 75 minutes, three per screen with no return, no calculator, the −0.25 and −0.33 penalties and the 15-point floor, and what they mean for guessing and pacing.',
  lessons: [howTheBocconiMasterTestWorks, scoringPacingAndGuessing],
};
