import { md, type Lesson } from '../../types';

/** Bocconi master's, Data insight: data sufficiency pitfalls (docs/COURSE-AUTHORING.md, the plan). */

export const dataSufficiencyPitfallsLesson: Lesson = {
  slug: 'data-sufficiency-pitfalls',
  title: 'Data sufficiency: the pitfalls',
  summary: 'Catch the data sufficiency errors that cost marks: hidden whole-number limits, signs and squares, ratios versus counts, and counting equations.',
  minutes: 22,
  objectives: [
    'Use the limits a context hides, such as whole numbers and positive amounts, and no others.',
    'Test signs, zero and fractions before trusting an inequality or a square.',
    'Tell when a ratio or percent is enough and when a count is needed, without counting equations.',
  ],
  teachMd: md`
### Why sufficiency goes wrong

The method of the previous lesson is simple; the errors come from what you assume while applying it. Each pitfall below either makes a statement look enough when it is not, or makes it look not enough when it is. As before, the exact wording of Bocconi's current answer choices is not published, so the checks here use our own four options, built so that each statement being enough on its own never arises.

### Pitfall 1: counting equations

"Two equations, two unknowns, so both together" is a habit, not a rule. It fails in three ways:

- **One equation can be enough** when the question asks for a combination: $2x + 2y = 18$ fixes $x + y$.
- **Two equations can be one**: $3a + 2b = 13$ and $6a + 4b = 26$ are the same line.
- **Non-linear equations can have two solutions**: $x^2 = 25$ gives $5$ and $-5$.

Ask instead: does the information leave exactly one possible answer?

### Pitfall 2: hidden whole numbers

Context often restricts the unknowns, and the restriction can make a statement enough. People, tickets and items come in whole, non-negative numbers. If pens cost €3, notebooks €5 and someone spent exactly €30, the only possibilities are 10 pens and no notebooks, 5 pens and 3 notebooks, or 6 notebooks and no pens. A statement that rules out two of these three fixes the answer, even though "one equation, two unknowns" says it cannot.

List the whole-number cases when the numbers are small. It takes less time than it seems, and it is the only reliable test.

### Pitfall 3: assuming limits that are not there

The opposite error is just as common. Unless the question says so, a variable in pure algebra may be negative, zero or a fraction, and two different letters may be equal. Before declaring an inequality settled, try:

- a negative number;
- zero;
- a fraction between 0 and 1;
- two equal values.

Squares are the classic case: $x^2 > 9$ means $x > 3$ **or** $x < -3$, not just $x > 3$.

### Pitfall 4: ratios, percents and counts

A ratio or percent is enough for a question about a ratio or percent, even with no counts at all. A count is enough for a question about a count. Mixing them is where marks go:

- "What percent of respondents were under 30?" is settled by "the number aged 30 or over was 1.5 times the number under 30": that is $\frac{u}{u + 1.5u} = \frac{1}{2.5} = 40\%$, whatever $u$ is.
- "How many respondents were under 30?" is not settled by that ratio unless a total is known.

Ask whether the question wants a relative or an absolute answer, then check whether each statement gives one of the same kind.

### Pitfall 5: data sufficiency on a display

Sometimes the problem comes with a small table or a description of a chart. The display counts as given information, like the question's own facts. Read it with the care of the earlier lessons in this unit: the units, the period, and whether its figures are counts or rates. A statement that gives a rate for a group whose total is already in the table is enough to find a count.

### A last check before choosing

When you think a statement is enough, try once to break it: find a second case that fits and gives a different answer. When you think it is not enough, make sure your two cases really satisfy the statement **and** every fact in the question, including the hidden ones.
`,
  examples: [
    {
      id: 'example-pens-and-notebooks',
      title: 'Whole numbers make one equation enough',
      problemMd: md`Pens cost €3 and notebooks €5. Anna spent exactly €30 on pens and notebooks. How many notebooks did she buy?

(1) She bought at least one pen and at least one notebook.

(2) She bought more pens than notebooks.`,
      steps: [
        md`List whole-number solutions of $3p + 5n = 30$. Since $3p$ and 30 are multiples of 3, $5n$ must be too, so $n$ is 0, 3 or 6: $(p, n) = (10, 0), (5, 3), (0, 6)$.`,
        md`(1) alone: "at least one of each" leaves only $(5, 3)$. Three notebooks, a single value: enough.`,
        md`(2) alone: more pens than notebooks leaves $(10, 0)$ and $(5, 3)$, so 0 or 3 notebooks: not enough.`,
      ],
      answerMd: md`Statement (1) alone is enough; statement (2) alone is not. Treating $3p + 5n = 30$ as an ordinary equation with infinitely many solutions leads to "even together not enough", which ignores that people buy whole numbers of things.`,
    },
    {
      id: 'example-percent-from-ratio',
      title: 'A ratio settles a percent',
      problemMd: md`In a survey, what percent of the respondents were under 30?

(1) 120 respondents were under 30.

(2) The number of respondents aged 30 or over was 1.5 times the number under 30.`,
      steps: [
        md`Restate: we need a percent, a relative answer.`,
        md`(1) alone gives a count but no total: 120 out of 200 or out of 1,000 give 60% or 12%. Not enough.`,
        md`(2) alone: with $u$ under 30, there are $1.5u$ aged 30 or over and $2.5u$ in all, so the share is $\frac{u}{2.5u} = 40\%$ whatever $u$ is. Enough.`,
      ],
      answerMd: md`Statement (2) alone is enough; statement (1) alone is not. The tempting wrong answer is "both together", from feeling that a percent needs actual numbers.`,
    },
    {
      id: 'example-square-inequality',
      title: 'Squares and signs',
      problemMd: md`Is $x > 3$?

(1) $x^2 > 9$

(2) $x > -3$`,
      steps: [
        md`(1) alone: $x^2 > 9$ means $x > 3$ or $x < -3$. $x = 4$ gives yes, $x = -4$ gives no. Not enough.`,
        md`(2) alone: $x = 0$ gives no, $x = 4$ gives yes. Not enough.`,
        md`Together: (2) removes the branch $x < -3$, leaving only $x > 3$. Always yes.`,
      ],
      answerMd: md`Both statements together are enough; neither alone is. Reading $x^2 > 9$ as "$x > 3$" makes (1) look enough, which forgets the negative values.`,
    },
  ],
  traps: [
    {
      title: 'Counting equations instead of answers',
      md: md`The number of equations does not decide sufficiency. A single equation can fix the quantity asked; two equations can be the same; a square can leave two roots. Ask how many answers remain.`,
    },
    {
      title: 'Forgetting whole-number limits',
      md: md`Counts of people and items are whole and not negative, and that can leave only a few cases. When the numbers are small, list them before deciding.`,
    },
    {
      title: 'Assuming positive whole numbers in algebra',
      md: md`Unless the question says otherwise, a letter can be negative, zero or a fraction. Test those before calling an inequality settled.`,
    },
    {
      title: 'Asking for counts when a ratio is enough',
      md: md`A percent or ratio question can be settled by a ratio alone. A count question needs a total as well. Match the kind of answer the question wants.`,
    },
  ],
  check: [
    {
      id: 'check-sales-growth-percent',
      title: 'Percent growth from a ratio',
      topic: 'Data sufficiency',
      stemMd: md`By what percent did a company's sales revenue increase from 2023 to 2024?

(1) Sales revenue in 2024 was 125% of sales revenue in 2023.

(2) Sales revenue in 2024 was €1.2 million higher than in 2023.`,
      options: [
        { id: 'A', text: md`Statement (1) alone is enough; statement (2) alone is not.`, note: '' },
        { id: 'B', text: md`Statement (2) alone is enough; statement (1) alone is not.`, note: md`A rise of €1.2 million is 20% of €6 million but 50% of €2.4 million; without the 2023 level, no percent follows.` },
        { id: 'C', text: md`Both statements together are enough; neither alone is.`, note: md`(1) already gives the percent; (2) would add the euro amounts, which the question does not ask for.` },
        { id: 'D', text: md`Even both statements together are not enough.`, note: md`(1) on its own fixes the increase at 25%, so the information is certainly enough.` },
      ],
      answer: 'A',
      workingMd: md`(1): 2024 revenue is $1.25$ times 2023 revenue, an increase of 25%, a single value. (2): the increase as a percent depends on the 2023 level, which is not given, so two different levels give two different answers.`,
      lesson: 'A percent question can be settled by a ratio alone; an absolute change needs its base.',
    },
    {
      id: 'check-concert-group',
      title: 'Whole-number tickets',
      topic: 'Data sufficiency',
      stemMd: md`Concert tickets cost €8 for students and €12 for everyone else. A group paid €64 in total for its tickets. How many students were in the group?

(1) The group included at least one student and at least one non-student.

(2) The group had more than 6 people.`,
      options: [
        { id: 'A', text: md`Statement (1) alone is enough; statement (2) alone is not.`, note: md`(1) still allows 5 students with 2 others, or 2 students with 4 others.` },
        { id: 'B', text: md`Statement (2) alone is enough; statement (1) alone is not.`, note: md`(2) still allows 8 students alone (8 people) or 5 students with 2 others (7 people).` },
        { id: 'C', text: md`Both statements together are enough; neither alone is.`, note: '' },
        { id: 'D', text: md`Even both statements together are not enough.`, note: md`This treats $8s + 12t = 64$ as having endless solutions; in whole numbers it has only three, and together the statements leave one.` },
      ],
      answer: 'C',
      workingMd: md`With $s$ students and $t$ others, $8s + 12t = 64$, so $2s + 3t = 16$. Then $3t$ must be even, so $t$ is 0, 2 or 4, giving $(s, t) = (8, 0), (5, 2), (2, 4)$. (1) removes $(8, 0)$ and leaves $s = 5$ or $2$. (2) needs $s + t > 6$: sizes are 8, 7 and 6, so $(8, 0)$ and $(5, 2)$ remain, $s = 8$ or $5$. Together only $(5, 2)$ survives: 5 students.`,
      lesson: 'When the unknowns are counts, list the whole-number cases and let each statement strike some out.',
    },
    {
      id: 'check-product-sign',
      title: 'Is the product positive?',
      topic: 'Data sufficiency',
      stemMd: md`$a$ and $b$ are real numbers. Is $ab > 0$?

(1) $a + b > 0$

(2) $a > b$`,
      options: [
        { id: 'A', text: md`Statement (1) alone is enough; statement (2) alone is not.`, note: md`A positive sum allows $a = 1, b = 2$ (product 2, yes) and $a = 3, b = -1$ (product $-3$, no).` },
        { id: 'B', text: md`Statement (2) alone is enough; statement (1) alone is not.`, note: md`$a > b$ allows $a = 3, b = 1$ (yes) and $a = 3, b = -1$ (no).` },
        { id: 'C', text: md`Both statements together are enough; neither alone is.`, note: md`This assumes both numbers are positive. $a = 3, b = -1$ satisfies both statements and gives a negative product.` },
        { id: 'D', text: md`Even both statements together are not enough.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`$a = 3, b = 1$ satisfies both statements ($4 > 0$ and $3 > 1$) and gives $ab = 3 > 0$, yes. $a = 3, b = -1$ also satisfies both ($2 > 0$ and $3 > -1$) and gives $ab = -3$, no. So even together there is no definite answer.`,
      lesson: 'Before trusting an inequality, try a negative value; one counter-case is enough to show a statement is not enough.',
    },
  ],
  takeaways: [
    'Count the possible answers, not the equations.',
    'Counts are whole and non-negative; list the cases when the numbers are small.',
    'In algebra, test negatives, zero and fractions before calling an inequality settled.',
    'A ratio settles a percent; a count needs a total.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-data-insight', skill: 'grad-data-derived-conclusions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
