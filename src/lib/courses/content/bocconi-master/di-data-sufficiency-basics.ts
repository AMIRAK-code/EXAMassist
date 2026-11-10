import { md, type Lesson } from '../../types';

/** Bocconi master's, Data insight: data sufficiency basics (docs/COURSE-AUTHORING.md, the plan). */

export const dataSufficiencyBasicsLesson: Lesson = {
  slug: 'data-sufficiency-basics',
  title: 'Data sufficiency: the method',
  summary: 'Decide whether statement (1), statement (2), both or neither give enough to answer a question, without solving more than you must.',
  minutes: 22,
  objectives: [
    'Restate a data sufficiency question as a single value or a definite yes or no.',
    'Test statement (1) alone, statement (2) alone, then both together, in a fixed order.',
    'Pick the answer that names the least information needed, whatever the wording of the choices.',
  ],
  teachMd: md`
### What the item asks

Bocconi lists data sufficiency as the second kind of data insight item: a problem followed by two statements, numbered (1) and (2), where you decide which of them are necessary, if any, to answer it. You are not asked for the answer itself. You are asked whether the information **could** settle it.

That changes how you work. You stop as soon as you know whether a unique answer exists. Solving to the final number is wasted time, and on a test without a calculator, time spent on arithmetic you did not need is time taken from another question.

### About the answer choices

Bocconi does not publish the current wording of its data sufficiency choices. A 2024 sample from Bocconi used four choices, one of which covered either statement being enough on its own, but the form of the test may have changed since. So this lesson teaches the logic, which does not depend on the wording, and the checks on this page use our own four options:

- statement (1) alone is enough; statement (2) alone is not;
- statement (2) alone is enough; statement (1) alone is not;
- both statements together are enough; neither alone is;
- even both statements together are not enough.

Our checks are built so that the fifth possible case, each statement being enough on its own, never arises. On the test, read the choices once and map them onto the five cases below.

### The five possible outcomes

Every item ends in exactly one of these:

| (1) alone | (2) alone | Together | Outcome |
| --- | --- | --- | --- |
| enough | not enough | – | (1) alone |
| not enough | enough | – | (2) alone |
| enough | enough | – | each alone |
| not enough | not enough | enough | both together |
| not enough | not enough | not enough | not enough |

If one statement alone is enough, you never need "both together": the right choice always names the least information that settles the question.

### Step 1: restate the question

Before reading the statements, write down exactly what would settle the question. Two kinds:

- **Value questions** ("What is $x$?", "How many…?") are settled only by **one** value. Two possible values is not enough.
- **Yes/no questions** ("Is $n$ odd?", "Did sales exceed…?") are settled by a **definite** answer, yes or no. A statement that proves the answer is always "no" is enough; only "sometimes yes, sometimes no" is not.

Often the restatement simplifies the work: "What is $x + y$?" needs only the sum, not $x$ and $y$ separately.

### Step 2: statement (1) alone

Forget statement (2) completely. Does (1), with the facts in the question, fix the value or the yes/no answer? If you can think of two cases that fit (1) and give different answers, (1) is not enough.

### Step 3: statement (2) alone

Now forget (1), which is the hard part: information from (1) leaks easily into your reading of (2). Test (2) with the question's facts only.

### Step 4: together, only if needed

If neither alone is enough, combine them. Remember that the statements are always true and never contradict each other. Two statements that say the same thing in different forms (one is a multiple of the other) add nothing together.

### Testing with cases

The fastest way to show a statement is not enough is to find two cases that satisfy it and give different answers. For yes/no questions try a case that gives "yes" and then hunt for one that gives "no". If you search honestly and every case gives the same answer, look for the algebra that proves it.
`,
  examples: [
    {
      id: 'example-sum-not-parts',
      title: 'Only the sum is asked',
      problemMd: md`What is the value of $x + y$?

(1) $2x + 2y = 18$

(2) $x - y = 3$`,
      steps: [
        md`Restate: we need the single value of $x + y$, not $x$ and $y$ separately.`,
        md`(1) alone: dividing by 2 gives $x + y = 9$. One value, so (1) is enough.`,
        md`(2) alone: $x = 4, y = 1$ gives a sum of 5; $x = 10, y = 7$ gives 17. Two different sums, so (2) is not enough.`,
      ],
      answerMd: md`Statement (1) alone is enough; statement (2) alone is not. The tempting wrong answer is "both together", because together they give $x = 6$ and $y = 3$; but the question never asked for $x$ and $y$.`,
    },
    {
      id: 'example-same-statement-twice',
      title: 'Two statements that are one',
      problemMd: md`Notebooks all cost the same, and pens all cost the same. What is the price of one notebook?

(1) Three notebooks and two pens cost €13 in total.

(2) Six notebooks and four pens cost €26 in total.`,
      steps: [
        md`Write $n$ for a notebook and $p$ for a pen. (1) says $3n + 2p = 13$: one equation, two unknowns. $n = 3, p = 2$ and $n = 1, p = 5$ both fit, so (1) is not enough.`,
        md`(2) says $6n + 4p = 26$, which halves to $3n + 2p = 13$: the same equation, so not enough either.`,
        md`Together they are still the one equation, and the two cases above still fit both.`,
      ],
      answerMd: md`Even both statements together are not enough. Counting "two equations, two unknowns" and choosing "both together" is the trap: the second equation is the first one doubled.`,
    },
    {
      id: 'example-each-alone',
      title: 'When each statement is enough',
      problemMd: md`A shop sold 120 shirts, all either blue or white. How many were blue?

(1) The shop sold 30 more white shirts than blue shirts.

(2) Blue shirts made up 37.5% of the shirts sold.`,
      steps: [
        md`(1) alone: with $b$ blue shirts, $b + (b + 30) = 120$, so $2b = 90$ and $b = 45$. Enough.`,
        md`(2) alone: $0.375 \times 120 = \frac{3}{8} \times 120 = 45$. Enough.`,
      ],
      answerMd: md`Each statement alone is enough. This is the case our check options leave out; on the test, look for the choice that says either statement on its own settles the question, and do not choose "both together" just because both work.`,
    },
    {
      id: 'example-yes-no-odd',
      title: 'A yes/no question',
      problemMd: md`$n$ is a positive integer. Is $n$ odd?

(1) $n^2 + 1$ is even.

(2) $n + 4$ is a multiple of 3.`,
      steps: [
        md`Restate: we need a definite yes or a definite no.`,
        md`(1) alone: $n^2 + 1$ even means $n^2$ is odd, and the square of an integer is odd only when the integer is odd. Always yes, so (1) is enough.`,
        md`(2) alone: $n = 2$ gives $6$, a multiple of 3, and 2 is even; $n = 5$ gives $9$, and 5 is odd. Sometimes yes, sometimes no: not enough.`,
      ],
      answerMd: md`Statement (1) alone is enough; statement (2) alone is not. Had (1) proved that $n$ is always **even**, it would still have been enough: a definite "no" settles a yes/no question.`,
    },
  ],
  traps: [
    {
      title: 'Solving all the way',
      md: md`Once you know a unique answer exists, stop. Computing the value proves nothing more and costs time you need elsewhere.`,
    },
    {
      title: 'Choosing "both" when one is enough',
      md: md`If (1) alone settles the question, the answer is (1) alone, even though the two together also settle it. The right choice always names the least information needed.`,
    },
    {
      title: 'Letting statement (1) leak into (2)',
      md: md`After working on (1), its facts feel like part of the problem. When you test (2) alone, cover (1) and use only the question's own information.`,
    },
    {
      title: 'Treating a definite "no" as not enough',
      md: md`For a yes/no question, sufficiency means a definite answer, either way. A statement that proves the answer is always "no" is enough.`,
    },
  ],
  check: [
    {
      id: 'check-train-journey',
      title: 'How long is the journey?',
      topic: 'Data sufficiency',
      stemMd: md`A train travels from P to Q at a constant speed. How long does the journey take?

(1) The distance from P to Q is 180 km.

(2) If the train's speed were 30 km/h higher, the journey would take 1 hour less.`,
      options: [
        { id: 'A', text: md`Statement (1) alone is enough; statement (2) alone is not.`, note: md`The distance alone says nothing about the speed, so the time could be anything.` },
        { id: 'B', text: md`Statement (2) alone is enough; statement (1) alone is not.`, note: md`(2) links speed and distance but fixes neither: 180 km at 60 km/h (3 hours) fits, and so does 60 km at 30 km/h (2 hours).` },
        { id: 'C', text: md`Both statements together are enough; neither alone is.`, note: '' },
        { id: 'D', text: md`Even both statements together are not enough.`, note: md`Together they give one equation in the speed alone, and only one positive speed satisfies it.` },
      ],
      answer: 'C',
      workingMd: md`(1) alone gives no speed. (2) alone: with distance $d$ and speed $v$, $\frac{d}{v} - \frac{d}{v + 30} = 1$, and the cases $d = 180, v = 60$ ($3 - 2 = 1$) and $d = 60, v = 30$ ($2 - 1 = 1$) give times of 3 and 2 hours. Together: $\frac{180}{v} - \frac{180}{v + 30} = 1$ gives $180 \times 30 = v(v + 30)$, so $v^2 + 30v - 5\,400 = 0$, $(v - 60)(v + 90) = 0$, and the only positive speed is 60 km/h. One time, 3 hours, so both together are enough; you did not need to finish solving once you saw a single positive root.`,
      lesson: 'Show a statement is not enough with two cases that fit it and give different answers.',
    },
    {
      id: 'check-revenue-threshold',
      title: 'Did revenue pass €500,000?',
      topic: 'Data sufficiency',
      stemMd: md`A shop's revenue in 2024 was 10% higher than in 2023. Was its 2024 revenue more than €500,000?

(1) Its 2023 revenue was more than €440,000.

(2) Its 2023 revenue was less than €470,000.`,
      options: [
        { id: 'A', text: md`Statement (1) alone is enough; statement (2) alone is not.`, note: md`With 2023 revenue of €450,000, 2024 is €495,000 (no); with €460,000, it is €506,000 (yes). (1) allows both.` },
        { id: 'B', text: md`Statement (2) alone is enough; statement (1) alone is not.`, note: md`An upper limit alone allows tiny revenues (no) and €460,000 (yes).` },
        { id: 'C', text: md`Both statements together are enough; neither alone is.`, note: md`Together they place 2023 revenue between €440,000 and €470,000, but €450,000 and €460,000 both lie in that range and give different answers.` },
        { id: 'D', text: md`Even both statements together are not enough.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`2024 revenue is $1.1 \times$ 2023 revenue, so the answer is yes exactly when 2023 revenue is above $\frac{500\,000}{1.1}$, about 454,500. Even together the statements allow 450,000 (2024: 495,000, no) and 460,000 (2024: 506,000, yes). No definite answer.`,
      lesson: 'For a yes/no question, find the threshold, then check whether the statements keep you on one side of it.',
    },
    {
      id: 'check-language-students',
      title: 'How many study German?',
      topic: 'Data sufficiency',
      stemMd: md`Each of 50 students studies exactly one language, French or German. How many study German?

(1) More of the students study German than French.

(2) The ratio of students studying French to students studying German is 2 : 3.`,
      options: [
        { id: 'A', text: md`Statement (1) alone is enough; statement (2) alone is not.`, note: md`(1) only orders the two groups: 26 or 40 German students both fit.` },
        { id: 'B', text: md`Statement (2) alone is enough; statement (1) alone is not.`, note: '' },
        { id: 'C', text: md`Both statements together are enough; neither alone is.`, note: md`(2) already fixes the number with the total of 50; (1) adds nothing that is needed.` },
        { id: 'D', text: md`Even both statements together are not enough.`, note: md`A ratio plus a known total fixes both counts, so the information is enough.` },
      ],
      answer: 'B',
      workingMd: md`(1) alone: any split with more than 25 German students fits, so not enough. (2) alone: the 50 students split in 5 equal parts of 10, with 2 parts French and 3 parts German, so 30 study German. One value: enough.`,
      lesson: 'A ratio fixes counts only together with a total; here the question supplied the total.',
    },
  ],
  takeaways: [
    'Decide whether the information settles the question; do not compute the answer.',
    'Value questions need one value; yes/no questions need a definite answer either way.',
    'Test (1) alone, then (2) alone with (1) forgotten, then both.',
    'Choose the least information that suffices; a repeated statement adds nothing.',
    'Bocconi does not publish the current wording of its choices; map them onto the five outcomes.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-data-insight', skill: 'grad-data-derived-conclusions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
