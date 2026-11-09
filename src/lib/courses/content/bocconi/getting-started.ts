import { md, type Lesson, type Unit } from '../../types';

/**
 * How the Online Bocconi Test works, and what its scoring means for guessing.
 * Every exam fact comes from section 3 of
 * docs/research/course-facts-2026-11-04.md (Bocconi pages B1–B3). Pacing plans
 * and guessing advice are UniExamer's own analysis and are labelled as such.
 */

const howTheBocconiTestWorks: Lesson = {
  slug: 'how-the-bocconi-test-works',
  title: 'How the Online Bocconi Test works: format, scoring and pacing',
  summary: 'The 50 questions, the four areas, three questions per screen with no going back, the scoring rules and the 17-point floor, and a pacing plan.',
  minutes: 18,
  objectives: [
    'Describe the length, timing, areas and question counts of the standard Online Bocconi Test.',
    'Explain what sequential navigation, three questions per screen and no calculator mean for how you work.',
    'Compute a score from right, wrong and blank answers, including the three-option critical thinking penalty.',
    'Build a pacing plan with checkpoints from the time and the number of screens.',
  ],
  teachMd: md`
### The shape of the test

The standard Online Bocconi Test, used for admission to Bocconi's bachelor's programmes, has **50 multiple-choice questions in 75 minutes**. You take it online, in Italian or in English; the language you choose does not have to match the language of the programme you apply to. Bocconi describes the questions as designed in line with the SAT.

| Area | Questions | Share of the test |
| --- | --- | --- |
| Mathematics | 24 | 48% |
| Reading comprehension | 11 | 22% |
| Numerical reasoning | 6 | 12% |
| Critical thinking | 9 | 18% |

The areas are **not** separate timed sections. Bocconi says the questions are distributed in a mixed way, both by difficulty and by topic, so a reading question can follow a probability question, and a hard question can come early. There is one clock for the whole test.

- **Mathematics** is almost half the test, and it covers a wide syllabus: algebra, functions, plane and analytic geometry, trigonometry, sets, logarithms and exponentials, counting, numbers, probability and statistics.
- **Reading comprehension** asks about explicit information and implicit meaning. Passages for the standard test can deal with economic topics and can contain numbers and data.
- **Numerical reasoning** needs no advanced mathematics; the calculations are simple, and the difficulty is usually reading a chart or table correctly.
- **Critical thinking** has two kinds of question: judging which statements are true (or false) from given data, and judging whether an assertion about a short passage is true, false or cannot be deduced. That second kind has **three** options, not four.

There is also a separate Law version, with a different mix of areas, which is valid only for the integrated Master of Arts in Law and Global Law. The standard test is valid for any programme, and this course follows it.

### Screens and navigation

Questions appear **three to a screen**. When you press Next, you move to the following screen and **cannot return** to the screens before it. At the end, Finish shows a summary of the questions you answered and omitted, followed by the final submission.

This rule changes how you work. On most computer tests you can skip a hard question and come back to it. Here, the moment to decide about a question is while its screen is open. Leaving it blank "for later" means leaving it blank for good.

### No calculator

Calculators, notes and formula sheets are not allowed. Every calculation must be done by hand or in your head, so simplify before you calculate, and save time with estimation, factoring and the algebra identities. Practise without a calculator from the start.

### Scoring

| Answer | Points |
| --- | --- |
| Right | $+1$ |
| Blank | $0$ |
| Wrong | $-0.2$ |
| Wrong, on a three-option critical thinking question | $-0.33$ |

The total includes the penalties, so the maximum is 50. Bocconi does not consider a total **lower than 17**. A score of exactly 17 is not below the floor.

You may take the test up to four times per test type in the same year.

### A pacing plan (our suggestion)

Bocconi sets the time; how to spend it is up to you. Spread evenly, 75 minutes over 50 questions is

$$\frac{75 \text{ min}}{50} = 1.5 \text{ min} = 90 \text{ seconds per question},$$

and a screen of three questions gets about $4.5$ minutes. Fifty questions at three per screen make about 17 screens. Checkpoints are easier to use than a per-question count: about 15 questions answered at 22.5 minutes, 30 at 45 minutes and 45 at 67.5 minutes.

The average hides a spread. Some questions take 30 seconds and some take three minutes. Because there is no going back, the useful habit is to watch the time **per screen**: if a screen has taken much longer than its share, decide on the last open question there and move on, using the expected-value reasoning in the next lesson, [negative marking and guessing](/courses/bocconi/negative-marking-and-guessing).
`,
  examples: [
    {
      id: 'example-pacing-checkpoints',
      title: 'Turning 75 minutes into checkpoints',
      problemMd: md`Build a simple checkpoint plan for the 50-question, 75-minute test, so that you can tell at a glance whether you are on pace.`,
      steps: [
        md`Find the even rate: $\frac{75}{50} = 1.5$ minutes per question, so a screen of three is $3 \times 1.5 = 4.5$ minutes.`,
        md`Pick checkpoints every five screens (15 questions): $15 \times 1.5 = 22.5$ minutes, $30 \times 1.5 = 45$ minutes, $45 \times 1.5 = 67.5$ minutes.`,
        md`Check the end: the last 5 questions get $75 - 67.5 = 7.5$ minutes, which is again $5 \times 1.5$.`,
        md`Round to times you can read off a clock quickly: about 22, 45 and 67 minutes, leaving a few seconds of margin at each.`,
      ],
      answerMd: md`Aim for 15 questions done by about 22 minutes, 30 by 45 minutes and 45 by about 67 minutes. Dividing 75 by the number of **screens** (about 17) instead of the number of questions gives the time per screen, not per question; mixing the two up makes the plan wrong by a factor of three.`,
    },
    {
      id: 'example-score-with-penalties',
      title: 'Working out a total',
      problemMd: md`A candidate answers 32 questions correctly and 9 wrongly, and leaves 9 blank. Of the wrong answers, 2 were three-option critical thinking questions. What is the total?`,
      steps: [
        md`Check the counts add up: $32 + 9 + 9 = 50$.`,
        md`Right answers: $32 \times 1 = 32$ points. Blanks: $0$.`,
        md`Split the wrong answers by penalty: $7$ at $-0.2$ give $-1.4$; $2$ at $-0.33$ give $-0.66$.`,
        md`Total: $32 - 1.4 - 0.66 = 29.94$.`,
      ],
      answerMd: md`The total is $29.94$. Charging every wrong answer at $-0.2$ would give $30.2$, which overstates the total because two of the wrong answers carried the larger penalty.`,
    },
    {
      id: 'example-closing-a-screen',
      title: 'Deciding before you press Next',
      problemMd: md`Twelve minutes into the test you are on the third screen. You have answered two of its three questions, and the third, an algebra question, looks long. Your checkpoint plan says you should have reached about question 8. What should you think through before pressing Next?`,
      steps: [
        md`Locate yourself: question 9 is the last one on screen 3, and 8 questions at $1.5$ minutes would be 12 minutes, so you are roughly on pace.`,
        md`Remember the rule: once you press Next, this question is closed for good. There is no "come back later".`,
        md`Spend what the plan allows: about $1.5$ minutes on this question. If you can rule out one or two options in that time, the expected value of answering rises (see the next lesson).`,
        md`If the time runs out, make the decision now: answer with what you have, or leave it blank on purpose, then move on without carrying the question in your head.`,
      ],
      answerMd: md`Give the question its share of time, then decide on it while the screen is open. Skipping it "for later", as on tests that allow going back, simply turns it into a blank.`,
    },
  ],
  traps: [
    {
      title: 'Planning to come back',
      md: md`Habits from school tests and from other computer tests say "skip it and return at the end". On this test, pressing Next closes the screen. The summary page at the end lists omitted questions, but the screens you have left do not reopen. Decide on every question before you leave its screen.`,
    },
    {
      title: 'Treating a wrong answer as free',
      md: md`A wrong answer costs $0.2$ points, or $0.33$ on three-option critical thinking questions. Small as that is, it is not zero, and a habit of filling every blank without thought adds up. The next lesson shows exactly when an answer is worth giving.`,
    },
    {
      title: 'Expecting the areas in blocks',
      md: md`Because the areas are mixed by topic and by difficulty, you cannot plan "maths first, then reading". Plan your time per screen, and do not assume the hardest questions come at the end.`,
    },
    {
      title: 'Practising with a calculator',
      md: md`If your practice uses a calculator, your timing in practice will not match the test. Do arithmetic by hand from the start, and learn to simplify before calculating: factor, cancel and estimate.`,
    },
  ],
  check: [
    {
      id: 'check-on-pace',
      title: 'Ahead or behind?',
      topic: 'Test format',
      stemMd: md`Using an even pace for the whole test, a candidate has answered 21 questions after 36 minutes. How does this compare with the plan?`,
      options: [
        { id: 'A', text: 'About 4.5 minutes ahead of pace', note: md`The gap is right but the direction is reversed: the plan allows $31.5$ minutes for 21 questions, and 36 minutes is more than that.` },
        { id: 'B', text: 'Exactly on pace', note: md`On pace at 36 minutes would mean $\frac{36}{1.5} = 24$ questions answered, not 21.` },
        { id: 'C', text: 'About 4.5 minutes behind pace', note: '' },
        { id: 'D', text: 'About 15 minutes behind pace', note: md`This uses one minute per question ($36 - 21$). The even pace is 75 minutes over 50 questions, $1.5$ minutes each.` },
      ],
      answer: 'C',
      workingMd: md`The even pace is $\frac{75}{50} = 1.5$ minutes per question, so 21 questions should take $21 \times 1.5 = 31.5$ minutes. The candidate has used 36 minutes, $36 - 31.5 = 4.5$ minutes more than planned: behind pace.`,
      lesson: 'Compare the time used with the time the plan allows for the questions done, not with a one-minute-per-question guess.',
    },
    {
      id: 'check-navigation-rule',
      title: 'What the navigation rules mean',
      topic: 'Test format',
      stemMd: md`Which statement about the Online Bocconi Test is correct?`,
      options: [
        { id: 'A', text: 'You may go back to an earlier screen as long as time remains.', note: md`After Next, the earlier screens cannot be reopened, whatever the time left.` },
        { id: 'B', text: 'Once you press Next, you cannot return to the screens you have left, so each question must be settled while its screen is open.', note: '' },
        { id: 'C', text: 'The summary page at the end lets you go back and answer the questions you omitted.', note: md`The summary lists answered and omitted questions before you submit; it does not reopen the screens you have left.` },
        { id: 'D', text: 'Each area has its own time limit, so unused minutes in one area are lost.', note: md`There is one 75-minute clock; the areas are mixed together rather than timed separately.` },
      ],
      answer: 'B',
      workingMd: md`The rules give three questions per screen and sequential navigation: after Next there is no return to previous screens. The final summary shows what was answered and omitted, and the whole test runs on a single 75-minute clock with the areas mixed. Only the statement about settling each question while its screen is open matches these rules.`,
      lesson: 'Plan as if every screen is final, because it is.',
    },
    {
      id: 'check-score-floor',
      title: 'Who reaches the floor?',
      topic: 'Scoring',
      stemMd: md`Bocconi does not consider totals lower than 17. Four candidates each finished the 50 questions with the results below; "three-option" means a three-option critical thinking question. Whose total is considered?`,
      options: [
        { id: 'A', text: '18 right, 10 wrong (none three-option), 22 blank', note: md`Counting only the 18 right answers misses the penalties: $18 - 10 \times 0.2 = 16$, below 17.` },
        { id: 'B', text: '19 right, 12 wrong (6 of them three-option), 19 blank', note: md`The three-option penalty is larger: $19 - 6 \times 0.2 - 6 \times 0.33 = 19 - 1.2 - 1.98 = 15.82$, below 17.` },
        { id: 'C', text: '20 right, 15 wrong (none three-option), 15 blank', note: '' },
        { id: 'D', text: '18 right, 7 wrong (4 of them three-option), 25 blank', note: md`$18 - 3 \times 0.2 - 4 \times 0.33 = 18 - 0.6 - 1.32 = 16.08$, just below 17.` },
      ],
      answer: 'C',
      workingMd: md`Compute each total with the penalties included. First candidate: $18 - 2 = 16$. Second: $19 - 1.2 - 1.98 = 15.82$. Third: $20 - 15 \times 0.2 = 20 - 3 = 17$. Fourth: $18 - 0.6 - 1.32 = 16.08$. Only the total of exactly 17 is not lower than 17, so only the candidate with 20 right and 15 wrong is considered.`,
      lesson: 'The floor applies to the total after penalties, and a total equal to 17 is not below it.',
    },
  ],
  takeaways: [
    '50 questions in 75 minutes: 24 mathematics, 11 reading, 6 numerical reasoning, 9 critical thinking, all mixed together.',
    'Three questions per screen, and no return after Next: settle each question while its screen is open.',
    md`Right $+1$, blank $0$, wrong $-0.2$, or $-0.33$ on three-option critical thinking questions; totals below 17 are not considered.`,
    'No calculator: practise every calculation by hand.',
    'An even pace is 90 seconds per question, about 4.5 minutes per screen.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const negativeMarkingAndGuessing: Lesson = {
  slug: 'negative-marking-and-guessing',
  title: 'Negative marking and guessing: the expected value of an answer',
  summary: 'Work out exactly what a guess is worth under the −0.2 and −0.33 penalties, how elimination changes it, and how much risk a guess carries.',
  minutes: 18,
  objectives: [
    'Compute the expected value of a guess on four-option and three-option questions under the test’s penalties.',
    'Show how eliminating options raises that expected value, and find the break-even probability.',
    'Tell expected value apart from the spread of possible outcomes when you guess on several questions.',
  ],
  teachMd: md`
### What the rules say, and what they do not

The scoring rules are Bocconi's: $+1$ for a right answer, $0$ for a blank, $-0.2$ for a wrong answer, and $-0.33$ for a wrong answer on a critical thinking question with only three options. Bocconi gives no advice on whether to guess. Everything below is **our analysis** of those rules, using one tool from probability: expected value.

### Expected value

The expected value of a decision is the average number of points it would earn if you could repeat it many times:

$$E = P(\text{right}) \times (+1) + P(\text{wrong}) \times (\text{penalty}).$$

A blank always earns $0$, so an answer is worth giving, on average, whenever its expected value is above $0$.

### A blind guess on a four-option question

If you pick one of four options completely at random, $P(\text{right}) = \frac{1}{4}$ and $P(\text{wrong}) = \frac{3}{4}$:

$$E = 0.25(1) + 0.75(-0.2) = 0.25 - 0.15 = +0.1.$$

The penalty does **not** cancel the reward. One right answer gains as much as five wrong answers lose ($5 \times 0.2 = 1$), but a blind guess is wrong only three times out of four, not five times out of six. On average, a blind guess adds a tenth of a point.

### A blind guess on a three-option critical thinking question

With three options, $P(\text{right}) = \frac{1}{3}$ and $P(\text{wrong}) = \frac{2}{3}$, and the penalty is $-0.33$:

$$E = \tfrac{1}{3}(1) + \tfrac{2}{3}(-0.33) = 0.3333\ldots - 0.22 \approx +0.113.$$

The larger penalty is matched by the better odds of a three-way guess, and the expected value stays slightly positive.

### Elimination raises the value

Each option you can rule out with confidence raises $P(\text{right})$, and the expected value climbs quickly:

| Situation | Chance of being right | Expected points |
| --- | --- | --- |
| Four options, none ruled out | $\frac{1}{4}$ | $+0.10$ |
| Four options, one ruled out | $\frac{1}{3}$ | $+0.20$ |
| Four options, two ruled out | $\frac{1}{2}$ | $+0.40$ |
| Three options, none ruled out | $\frac{1}{3}$ | about $+0.113$ |
| Three options, one ruled out | $\frac{1}{2}$ | $+0.335$ |

For example, with one of four options ruled out: $\frac{1}{3}(1) + \frac{2}{3}(-0.2) = \frac{1}{3} - \frac{0.4}{3} = \frac{0.6}{3} = 0.2$.

### The break-even probability

Write $p$ for your chance of being right. On a four-option question the expected value is $p - 0.2(1 - p) = 1.2p - 0.2$, which is positive when

$$p > \frac{0.2}{1.2} = \frac{1}{6} \approx 0.167.$$

On a three-option question it is $p - 0.33(1 - p) = 1.33p - 0.33$, positive when $p > \frac{0.33}{1.33} \approx 0.248$.

A blind guess ($\frac{1}{4}$ or $\frac{1}{3}$) is above both thresholds. So, as far as expected value goes, answering beats leaving blank **unless your chance of being right is below the threshold**. That can happen: if a question is built so that a tempting wrong option attracts you, and you are confident in that wrong reasoning, your real chance can be below a random guess. Expected value assumes your probability is honest.

### Expected value is an average, not a promise

On one question, a guess earns either $+1$ or a penalty, never $+0.1$. The average shows up only across many questions. Guess blindly on five four-option questions and the expected total is $5 \times 0.1 = +0.5$, but the actual result can be anywhere from $-1$ (all wrong) to $+5$ (all right), and the chance that all five are wrong is $\left(\frac{3}{4}\right)^5 \approx 0.237$, almost one in four.

So the honest summary is: guessing raises your **average** total, slightly when blind and clearly after elimination, and it also widens the spread of results. Whether you accept that spread is your decision; Bocconi does not tell you either way.

### Why this matters more on this test

You cannot come back to a screen. A question left blank "to return to" is a blank for good, so the decision to answer or not has to be made while the screen is open, with the numbers above in mind. A few seconds spent ruling out one option moves a four-option guess from $+0.1$ to $+0.2$, and a second ruled-out option doubles it again.
`,
  examples: [
    {
      id: 'example-blind-four-option',
      title: 'A blind guess on a four-option question',
      problemMd: md`A mathematics question has four options, and you have no idea which is right. What is the expected value of guessing, compared with leaving it blank?`,
      steps: [
        md`List the outcomes: right with probability $\frac{1}{4}$, scoring $+1$; wrong with probability $\frac{3}{4}$, scoring $-0.2$.`,
        md`Weight each score by its probability: $\frac{1}{4} \times 1 = 0.25$ and $\frac{3}{4} \times (-0.2) = -0.15$.`,
        md`Add: $0.25 - 0.15 = +0.1$. A blank scores exactly $0$.`,
        md`Check by imagining 20 such guesses: on average 5 right ($+5$) and 15 wrong ($-3$), a total of $+2$, which is $+0.1$ per guess.`,
      ],
      answerMd: md`The guess is worth $+0.1$ points on average, more than a blank. The tempting conclusion that the penalty "cancels" guessing would need a penalty of $-\frac{1}{3}$ on a four-option question; at $-0.2$ it does not.`,
    },
    {
      id: 'example-blind-three-option',
      title: 'A blind guess on a three-option critical thinking question',
      problemMd: md`A critical thinking question asks whether an assertion is true, false or cannot be deduced, and a wrong answer costs $0.33$. What is a blind guess worth?`,
      steps: [
        md`Right with probability $\frac{1}{3}$, scoring $+1$; wrong with probability $\frac{2}{3}$, scoring $-0.33$.`,
        md`Weight and add: $\frac{1}{3}(1) + \frac{2}{3}(-0.33) = 0.3333\ldots - 0.22$.`,
        md`So $E \approx 0.113$, slightly more than the $0.1$ of a blind four-option guess.`,
      ],
      answerMd: md`About $+0.113$ points. The larger penalty does not make three-option guessing worse, because the chance of a right answer is larger too.`,
    },
    {
      id: 'example-after-elimination',
      title: 'After ruling out options',
      problemMd: md`On a four-option algebra question you can show that two options are impossible (one gives a negative length, the other fails a substitution check). What is guessing between the remaining two worth? And what if you could rule out only one?`,
      steps: [
        md`Two left: right with probability $\frac{1}{2}$, wrong with probability $\frac{1}{2}$. $E = 0.5(1) + 0.5(-0.2) = 0.5 - 0.1 = 0.4$.`,
        md`Three left: $E = \frac{1}{3}(1) + \frac{2}{3}(-0.2) = \frac{1 - 0.4}{3} = 0.2$.`,
        md`Compare with the blind guess, $0.1$: one elimination doubles the value, and two eliminations quadruple it.`,
      ],
      answerMd: md`With two options left the guess is worth $+0.4$; with three left, $+0.2$. Subtracting the whole penalty from one half ($0.5 - 0.2 = 0.3$) is the tempting slip: the penalty only applies in the half of the cases where you are wrong.`,
    },
    {
      id: 'example-spread-of-outcomes',
      title: 'Five blind guesses: average and spread',
      problemMd: md`You guess blindly on five four-option questions. What is the expected total, what are the best and worst totals, and how likely is the worst?`,
      steps: [
        md`Expected values add: $5 \times 0.1 = +0.5$.`,
        md`Best case, all right: $+5$. Worst case, all wrong: $5 \times (-0.2) = -1$.`,
        md`The guesses are independent, each wrong with probability $\frac{3}{4}$, so all five are wrong with probability $\left(\frac{3}{4}\right)^5 = \frac{243}{1024} \approx 0.237$.`,
      ],
      answerMd: md`Expected total $+0.5$, range from $-1$ to $+5$, and about a 24% chance of the worst case. A positive expected value raises the average result, not every result.`,
    },
  ],
  traps: [
    {
      title: 'Believing the penalty cancels the guess',
      md: md`It is easy to assume that negative marking is set so that guessing is worthless. At $-0.2$ on four options it would need to be $-\frac{1}{3}$ to cancel; at $-0.33$ on three options it would need to be $-0.5$. Neither is the case. Compute the expected value instead of assuming it.`,
    },
    {
      title: 'Subtracting the whole penalty',
      md: md`The penalty is weighted by the chance of being wrong. With two options left, the value is $0.5 - 0.5 \times 0.2 = 0.4$, not $0.5 - 0.2 = 0.3$. Write both terms of the expected value every time.`,
    },
    {
      title: 'Using the wrong penalty',
      md: md`The $-0.33$ penalty applies only to critical thinking questions with three options. All other wrong answers cost $0.2$. Mixing them up changes both your score calculations and your guessing thresholds.`,
    },
    {
      title: 'Overrating a "hunch"',
      md: md`Expected value is only as good as the probability you put into it. If you are drawn to an option because it looks familiar, not because you ruled the others out, your chance may be no better than random, or worse if the option is a designed trap. Count only eliminations you can justify.`,
    },
  ],
  check: [
    {
      id: 'check-ten-blind-guesses',
      title: 'Ten blind guesses',
      topic: 'Scoring and guessing',
      stemMd: md`A candidate guesses completely at random on 10 four-option mathematics questions. What is the expected number of points these 10 answers add to the total?`,
      options: [
        { id: 'A', text: '0', note: md`This assumes the penalty is set to cancel guessing. It would need to be $-\frac{1}{3}$ for that; at $-0.2$ each guess is worth $+0.1$.` },
        { id: 'B', text: '0.5', note: md`This takes $0.25 - 0.2$ per guess, subtracting the whole penalty instead of weighting it by the $\frac{3}{4}$ chance of being wrong.` },
        { id: 'C', text: '1', note: '' },
        { id: 'D', text: '2.5', note: md`This counts the expected right answers ($10 \times \frac{1}{4}$) and ignores the penalty on the $7.5$ expected wrong ones.` },
      ],
      answer: 'C',
      workingMd: md`Each blind guess is worth $\frac{1}{4}(1) + \frac{3}{4}(-0.2) = 0.25 - 0.15 = 0.1$. Expected values add, so ten guesses are worth $10 \times 0.1 = 1$ point. Equivalently: on average $2.5$ right ($+2.5$) and $7.5$ wrong ($-1.5$), a total of $+1$.`,
      lesson: 'Weight the penalty by the probability of being wrong, then add the expected values of separate questions.',
    },
    {
      id: 'check-mixed-penalties',
      title: 'A total with both penalties',
      topic: 'Scoring and guessing',
      stemMd: md`A candidate answers 31 questions correctly, 12 wrongly and leaves 7 blank. Three of the wrong answers were on three-option critical thinking questions. What is the total?`,
      options: [
        { id: 'A', text: '28.6', note: md`This charges all 12 wrong answers at $-0.2$ ($31 - 2.4$), missing the larger penalty on the three critical thinking questions.` },
        { id: 'B', text: '28.21', note: '' },
        { id: 'C', text: '27.04', note: md`This charges all 12 wrong answers at $-0.33$ ($31 - 3.96$); only the three-option critical thinking questions carry that penalty.` },
        { id: 'D', text: '19', note: md`This takes a full point off for each wrong answer ($31 - 12$). A wrong answer costs $0.2$ or $0.33$, not $1$.` },
      ],
      answer: 'B',
      workingMd: md`Check the counts: $31 + 12 + 7 = 50$. Of the 12 wrong answers, 9 cost $0.2$ each ($-1.8$) and 3 cost $0.33$ each ($-0.99$). Total: $31 - 1.8 - 0.99 = 28.21$.`,
      lesson: 'Split the wrong answers by penalty before you subtract.',
    },
    {
      id: 'check-three-option-elimination',
      title: 'One option ruled out',
      topic: 'Scoring and guessing',
      stemMd: md`On a true / false / cannot be deduced critical thinking question, you can rule out one of the three options with certainty and must choose between the other two. What is the expected value of answering?`,
      options: [
        { id: 'A', text: '0.113', note: md`This is the value of a blind guess among all three options; ruling one out raises the chance of being right to $\frac{1}{2}$.` },
        { id: 'B', text: '0.17', note: md`This is $0.5 - 0.33$: the whole penalty subtracted, instead of the penalty weighted by the $\frac{1}{2}$ chance of being wrong.` },
        { id: 'C', text: '0.335', note: '' },
        { id: 'D', text: '0.4', note: md`This uses the $-0.2$ penalty. A wrong answer on a three-option critical thinking question costs $0.33$.` },
      ],
      answer: 'C',
      workingMd: md`With two options left, $P(\text{right}) = P(\text{wrong}) = \frac{1}{2}$. The penalty on this kind of question is $-0.33$, so $E = 0.5(1) + 0.5(-0.33) = 0.5 - 0.165 = 0.335$.`,
      lesson: 'Use the penalty that applies to the question type, and weight it by the chance of being wrong.',
    },
  ],
  takeaways: [
    md`Expected value of an answer: $P(\text{right}) \times 1 + P(\text{wrong}) \times \text{penalty}$; a blank is worth $0$.`,
    md`A blind guess is worth $+0.1$ on a four-option question and about $+0.113$ on a three-option critical thinking question.`,
    md`Each option you rule out raises the value: $+0.2$ with three of four options left, $+0.4$ with two.`,
    md`Answering pays on average when your chance of being right exceeds $\frac{1}{6}$ (four options) or about $0.248$ (three options).`,
    'Expected value is an average across many questions; any single guess can still cost points. Bocconi gives no guessing advice; this is our analysis.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-critical-thinking', skill: 'critical-thinking-deducibility' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const gettingStartedUnit: Unit = {
  slug: 'getting-started',
  title: 'Getting started',
  summary: 'How the Online Bocconi Test is built and scored: the four mixed areas, three questions per screen with no return, no calculator, the penalties and the 17-point floor, and what those penalties mean for guessing.',
  lessons: [howTheBocconiTestWorks, negativeMarkingAndGuessing],
};
