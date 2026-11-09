import { md, type CheckQuestion, type Lesson, type Unit } from '../../types';

/** GMAT Data Insights: the data sufficiency lessons (docs/COURSE-AUTHORING.md, the plan). */

type DsAnswer = 'A' | 'B' | 'C' | 'D' | 'E';

/** The five fixed answer statements of a data sufficiency question, in their fixed order. */
const DS_STATEMENTS: Record<DsAnswer, string> = {
  A: 'Statement (1) alone is sufficient, but statement (2) alone is not sufficient.',
  B: 'Statement (2) alone is sufficient, but statement (1) alone is not sufficient.',
  C: 'Both statements together are sufficient, but neither statement alone is sufficient.',
  D: 'Each statement alone is sufficient.',
  E: 'Statements (1) and (2) together are not sufficient.',
};

/** The five options of a data sufficiency check: the key gets an empty note, every other option its own note. */
function dsOptions(answer: DsAnswer, notes: Partial<Record<DsAnswer, string>>): CheckQuestion['options'] {
  return (['A', 'B', 'C', 'D', 'E'] as const).map((id) => ({
    id,
    text: DS_STATEMENTS[id],
    note: id === answer ? '' : (notes[id] ?? ''),
  }));
}

const dataSufficiencyFundamentals: Lesson = {
  slug: 'data-sufficiency-fundamentals',
  title: 'Data sufficiency: how the question works',
  summary: 'Learn what a data sufficiency question asks, the five fixed answers, and a step-by-step routine that tests each statement alone before combining them.',
  minutes: 22,
  objectives: [
    'Explain what "sufficient" means for a value question.',
    'Apply a fixed routine: statement (1) alone, statement (2) alone, then both together.',
    'Use the result of the first statement to cut the five answers down to two or three.',
    'Decide sufficiency without finishing the calculation.',
  ],
  teachMd: md`
### A different kind of question

Data Sufficiency is one of the question types in the GMAT Data Insights section, which has 20 questions in 45 minutes and an on-screen calculator. A data sufficiency question does not ask you to find an answer. It asks whether you **could** find one with the information given.

Each question has a question stem and two numbered statements:

> What is the value of $x$?
>
> (1) $3x + 2y = 12$
>
> (2) $x - y = -1$

Your job is to decide whether statement (1) alone, statement (2) alone, both together, or neither even together, gives enough information to answer the stem. In this course the five answer choices are always worded the same way and come in the same order:

| Choice | Meaning |
| --- | --- |
| A | Statement (1) alone is sufficient, but statement (2) alone is not. |
| B | Statement (2) alone is sufficient, but statement (1) alone is not. |
| C | Both statements together are sufficient, but neither alone is. |
| D | Each statement alone is sufficient. |
| E | Statements (1) and (2) together are not sufficient. |

Learn these once so you never reread them under time pressure.

### What "sufficient" means

A statement is **sufficient** when it leads to exactly one answer to the stem. For a value question ("What is $x$?"), that means exactly one possible value. It does not matter whether the value is large, ugly or negative, only that there is one of it. If two or more values remain possible, the statement is **not sufficient**.

This changes how you work. You do not need the value itself, only proof that it is pinned down. If you can see that a linear equation in one unknown has a single solution, stop: you know it is sufficient without solving it.

### The routine

Work in a fixed order, and keep the statements apart until the last step.

1. **Read the stem and decide what would answer it.** "What is $a + b$?" needs the sum, not $a$ and $b$ separately. Rewrite the stem in its simplest form if you can.
2. **Statement (1) alone.** Forget statement (2) exists. Is there exactly one answer?
3. **Statement (2) alone.** Now forget statement (1). Is there exactly one answer?
4. **Together, only if neither alone worked.** Combine both and ask again.

The order of steps 2 and 3 cuts the choices quickly:

- If (1) alone is sufficient, the answer is A or D. Statement (2) decides between them.
- If (1) alone is not sufficient, the answer is B, C or E. If (2) alone is sufficient, it is B; if not, combine to choose between C and E.

You may start with whichever statement looks easier; just keep track of which choices remain.

### Proving "not sufficient" with two cases

To show a statement is not sufficient, find **two different situations** that both satisfy the statement and give **different answers** to the stem. For "What is $x$?" with $3x + 2y = 12$: $x = 0, y = 6$ and $x = 2, y = 3$ both satisfy it, with different values of $x$. Two cases settle it; you do not need a general argument.

To show a statement **is** sufficient, you need a reason that covers every case, such as "this is one linear equation in one unknown" or "the remainder is fixed by the form $12m + 5$".

### Counting equations, carefully

A useful rule of thumb: to find $n$ unknowns you usually need $n$ independent linear equations. It is only a rule of thumb. It fails when:

- the two equations are really one equation (one is a multiple of the other);
- the stem asks for a combination such as $a + b$, which one equation can give;
- an equation is not linear, so it can have two solutions ($x^2 = 9$);
- the unknowns must be integers, which can leave a single solution to one equation.

The next two lessons return to the last three. For now: when two equations appear, check that they are genuinely different before you call the pair sufficient.

### The statements describe one situation

Treat both statements as true facts about the same situation. A well-built data sufficiency question, including every one in this course, is written so that at least one case satisfies both statements at once. When you combine them, you are looking for exactly those cases. If your work suggests that no case satisfies both, take that as a sign of a slip and recheck.
`,
  examples: [
    {
      id: 'example-two-equations',
      title: 'Neither alone, both together',
      problemMd: md`What is the value of $x$?

(1) $3x + 2y = 12$

(2) $x - y = -1$`,
      steps: [
        md`Statement (1) alone: one equation, two unknowns. Two cases: $x = 0, y = 6$ and $x = 2, y = 3$ both satisfy it, with different $x$. Not sufficient. The answer is B, C or E.`,
        md`Statement (2) alone: $x = 0, y = 1$ and $x = 1, y = 2$ both satisfy it. Not sufficient. The answer is C or E.`,
        md`Together: two linear equations whose coefficients are not in proportion ($3:1$ versus $2:-1$), so exactly one solution. Sufficient.`,
        md`If you want to confirm: $y = x + 1$ gives $3x + 2x + 2 = 12$, so $x = 2$. You did not need this step to choose.`,
      ],
      answerMd: md`Both statements together are sufficient, but neither alone is.`,
    },
    {
      id: 'example-same-equation',
      title: 'Two statements that say the same thing',
      problemMd: md`A shop sells notebooks at one fixed price and pens at another. What is the price of one notebook?

(1) Four notebooks and two pens cost $\$10$ in total.

(2) Two notebooks and one pen cost $\$5$ in total.`,
      steps: [
        md`Write the statements as equations: (1) $4n + 2p = 10$; (2) $2n + p = 5$.`,
        md`Each alone has two unknowns. Cases for either: $n = 2, p = 1$ and $n = 1.5, p = 2$. Not sufficient.`,
        md`Together: statement (1) is exactly twice statement (2), so the pair is one equation written twice. The same two cases satisfy both, with different notebook prices.`,
      ],
      answerMd: md`Statements (1) and (2) together are not sufficient. Choosing "both together" because there are two equations and two unknowns is the trap.`,
    },
    {
      id: 'example-remainder',
      title: 'Sufficient without a value of $k$',
      problemMd: md`$k$ is a positive integer. What is the remainder when $k$ is divided by 6?

(1) When $k$ is divided by 12, the remainder is 5.

(2) When $k$ is divided by 3, the remainder is 2.`,
      steps: [
        md`Statement (1): $k = 12m + 5 = 6(2m) + 5$ for some whole number $m$, so the remainder on division by 6 is always 5 (check: 5, 17, 29 all leave 5). Sufficient, though $k$ itself is unknown. The answer is A or D.`,
        md`Statement (2): $k = 2$ leaves remainder 2 on division by 6, while $k = 5$ leaves 5. Two answers, so not sufficient.`,
      ],
      answerMd: md`Statement (1) alone is sufficient, but statement (2) alone is not. The stem asks for a remainder, not for $k$, so a statement can be sufficient while $k$ stays unknown.`,
    },
  ],
  traps: [
    {
      title: 'Solving when you only need to know you could',
      md: md`Once you can see that exactly one value is possible, stop. Finishing the arithmetic costs time and adds nothing to the answer, which is about sufficiency, not the value.`,
    },
    {
      title: 'Counting equations without checking them',
      md: md`Two equations for two unknowns is not automatically sufficient: one may be a multiple of the other. Compare the coefficients before you choose "both together".`,
    },
    {
      title: 'Answering a different question from the stem',
      md: md`If the stem asks for $a + b$, a statement giving $a + b$ directly is sufficient even though $a$ and $b$ stay unknown. Write down exactly what the stem needs before reading the statements.`,
    },
  ],
  check: [
    {
      id: 'check-ds-sum',
      title: 'What is a + b?',
      topic: 'Data Sufficiency',
      stemMd: md`What is the value of $a + b$?

(1) $2a + 2b = 18$

(2) $a - b = 3$`,
      options: dsOptions('A', {
        B: md`Statement (2) gives only the difference: $a = 3, b = 0$ gives a sum of 3, and $a = 4, b = 1$ a sum of 5.`,
        C: md`Combining is not needed: dividing statement (1) by 2 gives $a + b = 9$ directly, without knowing $a$ or $b$.`,
        D: md`Statement (2) alone fixes only $a - b$; the cases $a = 3, b = 0$ and $a = 4, b = 1$ give different sums.`,
        E: md`Statement (1) alone already gives $a + b = 9$; the stem asks for the sum, not for each variable.`,
      }),
      answer: 'A',
      workingMd: md`Statement (1): divide by 2 to get $a + b = 9$, exactly what the stem asks. Sufficient. Statement (2): $a - b = 3$ allows $a = 3, b = 0$ (sum 3) and $a = 4, b = 1$ (sum 5). Not sufficient. So statement (1) alone is sufficient and statement (2) alone is not.`,
      lesson: 'Decide what the stem needs first; a statement can give a combination without giving the variables.',
    },
    {
      id: 'check-ds-cube',
      title: 'A linear equation and a cube',
      topic: 'Data Sufficiency',
      stemMd: md`What is the value of $x$?

(1) $5x - 7 = 2x + 8$

(2) $x^3 = 125$`,
      options: dsOptions('D', {
        A: md`This treats $x^3 = 125$ like $x^2 = 25$, which has two roots. A cube has only one real root: $x = 5$.`,
        B: md`Statement (1) is a linear equation in one unknown with a non-zero coefficient after collecting terms, so it has exactly one solution.`,
        C: md`Each statement already gives $x = 5$ on its own; combining was never needed.`,
        E: md`Each statement alone pins $x$ to a single value, so they are certainly sufficient together as well.`,
      }),
      answer: 'D',
      workingMd: md`Statement (1): $3x = 15$, so $x = 5$. Sufficient. Statement (2): the only real number whose cube is 125 is 5, since cubing keeps the sign ($(-5)^3 = -125$). Sufficient. Each statement alone is sufficient.`,
      lesson: 'An odd power has one real root; an even power has two. Check which you have before calling a statement insufficient.',
    },
    {
      id: 'check-ds-product',
      title: 'What is xy?',
      topic: 'Data Sufficiency',
      stemMd: md`What is the value of $xy$?

(1) $x + y = 10$

(2) $x^2 + y^2 = 52$`,
      options: dsOptions('C', {
        A: md`Statement (1) allows $x = 5, y = 5$ (product 25) and $x = 4, y = 6$ (product 24).`,
        B: md`Statement (2) allows $x = 4, y = 6$ (product 24) and $x = -4, y = 6$ (product $-24$): signs are not fixed.`,
        D: md`Neither statement alone fixes the product; each allows two cases with different products.`,
        E: md`Together they fix $xy$ through $(x + y)^2 = x^2 + 2xy + y^2$; you need the product, not $x$ and $y$ separately.`,
      }),
      answer: 'C',
      workingMd: md`Statement (1) alone: $(5, 5)$ gives 25 and $(4, 6)$ gives 24. Not sufficient. Statement (2) alone: $(4, 6)$ gives 24 and $(-4, 6)$ gives $-24$. Not sufficient. Together: $(x + y)^2 = x^2 + y^2 + 2xy$, so $100 = 52 + 2xy$ and $xy = 24$. Sufficient. Both together are sufficient, but neither alone is.`,
      lesson: 'A sum and a sum of squares fix the product through the square of the sum.',
    },
  ],
  takeaways: [
    'Sufficient means exactly one answer to the stem; the value itself is not needed.',
    'Test (1) alone, then (2) alone, then together; never let one statement leak into the other.',
    'Two cases with different answers prove "not sufficient".',
    'Two equations are not automatically enough; check that they are independent.',
  ],
  practice: { examKey: 'gmat', domain: 'di-data-sufficiency', skill: 'ds-sufficiency-threshold' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const dataSufficiencyYesNo: Lesson = {
  slug: 'data-sufficiency-yes-no-questions',
  title: 'Data sufficiency: yes/no questions',
  summary: 'Settle yes/no data sufficiency questions by testing well-chosen numbers, rephrasing the stem, and remembering that a certain "no" is sufficient too.',
  minutes: 22,
  objectives: [
    'State when a yes/no question is answered sufficiently, including by a definite "no".',
    'Rephrase a yes/no stem into a simpler condition before testing statements.',
    'Choose test numbers, including negatives, zero and fractions, that expose an insufficient statement.',
  ],
  teachMd: md`
### Sufficient means a definite answer, either way

Many data sufficiency stems ask a yes/no question: "Is $x > 1$?", "Is $n$ odd?", "Is $a$ greater than $b$?" A statement is **sufficient** if it forces the same answer in every case it allows: **always yes** or **always no**.

That second half is the one people forget. If a statement shows that $z$ is less than 8, then the question "Is $z > 10$?" is answered: no, definitely. A definite "no" is just as sufficient as a definite "yes". A statement is **not sufficient** only when it allows at least one case answering yes and at least one answering no.

| Cases the statement allows | Verdict |
| --- | --- |
| all yes | sufficient |
| all no | sufficient |
| some yes, some no | not sufficient |

### Rephrase the stem first

A yes/no stem can often be rewritten as a simpler condition. Doing that once saves you from repeating the algebra with every statement.

- "Is $x^2 > x$?" Factor: $x^2 - x = x(x - 1) > 0$ holds when $x > 1$ or $x < 0$. So the question becomes "Is $x$ outside the interval from 0 to 1?"
- "Is $\frac{a}{b} > 0$?" is the same as "Do $a$ and $b$ have the same sign?"
- "Is $k$ odd?" for an integer $k$ is a question about parity, and statements like "$k + 4$ is odd" translate immediately ($k$ is odd, since adding an even number keeps parity).

Be careful to rephrase without assuming anything the stem does not give. If $x$ might be negative, "Is $x^2 > x$?" cannot be divided by $x$.

### Test numbers on purpose

For yes/no questions, the most reliable method is to try to make a statement give **both** answers. Pick numbers that satisfy the statement and see what the stem says. If you find a yes and a no, the statement is not sufficient and you can move on.

Do not stop at the first easy number. Run through this list, keeping only numbers the statement and stem allow:

| Kind of number | Example | What it catches |
| --- | --- | --- |
| positive integer | 2, 3 | the obvious case |
| zero | 0 | products and squares behave oddly |
| negative integer | $-2$ | squares and even powers hide signs |
| fraction between 0 and 1 | $\frac{1}{2}$ | squares get smaller, reciprocals larger |
| negative fraction | $-\frac{1}{2}$ | both effects at once |
| the boundary itself | 1, if the stem says $> 1$ | strict versus non-strict |

If the stem says the numbers are integers, or positive, the list shrinks; that restriction is often what makes a statement sufficient.

### When to stop testing

Testing can prove "not sufficient" (one yes and one no) but cannot by itself prove "sufficient": three yeses in a row might be luck. When your tests keep giving the same answer, look for the reason. "$x^3 > 1$ means $x > 1$, because cubing keeps order" is a reason. "$k + 4$ odd means $k$ odd" is a reason. If you find one, the statement is sufficient.

### Combining in yes/no questions

When neither statement is sufficient alone, combine them and repeat the search: look for one case satisfying **both** statements that answers yes and another that answers no. The cases you found earlier are a good start: keep those that satisfy both statements and see whether they still disagree. Negative numbers often survive the combination, so try them before concluding that the pair is sufficient.
`,
  examples: [
    {
      id: 'example-square-and-cube',
      title: 'A square hides the sign, a cube does not',
      problemMd: md`Is $x > 1$?

(1) $x^2 > 1$

(2) $x^3 > 1$`,
      steps: [
        md`Statement (1): $x = 2$ satisfies it and answers yes; $x = -2$ satisfies it ($4 > 1$) and answers no. Not sufficient.`,
        md`Statement (2): cubing keeps the order of real numbers, so $x^3 > 1$ exactly when $x > 1$. Every case answers yes. Sufficient.`,
      ],
      answerMd: md`Statement (2) alone is sufficient, but statement (1) alone is not. Testing only positive numbers makes statement (1) look sufficient too, which leads to "each alone".`,
    },
    {
      id: 'example-parity',
      title: 'A statement that is always true says nothing',
      problemMd: md`$k$ is an integer. Is $k$ odd?

(1) $k + 4$ is odd.

(2) $k^2 + k$ is even.`,
      steps: [
        md`Statement (1): adding the even number 4 does not change parity, so $k$ has the same parity as $k + 4$: odd. Always yes. Sufficient.`,
        md`Statement (2): $k^2 + k = k(k + 1)$, a product of two consecutive integers, one of which is even. So it is even for **every** integer: $k = 2$ gives 6 (answer no), $k = 3$ gives 12 (answer yes). Not sufficient.`,
      ],
      answerMd: md`Statement (1) alone is sufficient, but statement (2) alone is not. A statement that holds for every integer cannot tell you anything about $k$.`,
    },
    {
      id: 'example-definite-no',
      title: 'A definite "no" is sufficient',
      problemMd: md`Is $z > 10$?

(1) $z < 8$

(2) $z^2 < 100$`,
      steps: [
        md`Statement (1): every allowed $z$ is below 8, so the answer is always no. Sufficient.`,
        md`Statement (2): $z^2 < 100$ means $-10 < z < 10$. Every allowed $z$ is below 10, so the answer is always no. Sufficient.`,
      ],
      answerMd: md`Each statement alone is sufficient. Calling them insufficient because they never produce a yes is the trap.`,
    },
  ],
  traps: [
    {
      title: 'Treating "no" as insufficient',
      md: md`A statement that always gives "no" answers the question. Only a mix of yes and no makes a statement insufficient.`,
    },
    {
      title: 'Testing only positive integers',
      md: md`Unless the stem restricts $x$, try $0$, a negative number and a fraction between 0 and 1. Squares, reciprocals and products change behaviour exactly there.`,
    },
    {
      title: 'Multiplying through by a variable',
      md: md`From $\frac{a}{b} > 1$ you cannot conclude $a > b$ unless you know $b$ is positive: $a = -3, b = -1$ gives $\frac{a}{b} = 3$ but $a < b$.`,
    },
    {
      title: 'Taking a few agreeing cases as proof',
      md: md`Three yeses in a row do not prove sufficiency; find the reason, or keep looking for a case that answers no.`,
    },
  ],
  check: [
    {
      id: 'check-ds-square-vs-x',
      title: 'Is x squared greater than x?',
      topic: 'Data Sufficiency',
      stemMd: md`Is $x^2 > x$?

(1) $x > \frac{1}{2}$

(2) $x^2 > 1$`,
      options: dsOptions('B', {
        A: md`Statement (1) allows $x = 2$ ($4 > 2$, yes) and $x = \frac{3}{4}$ ($\frac{9}{16}$ is less than $\frac{3}{4}$, no). Testing only whole numbers hides the fractions.`,
        C: md`Statement (2) is already sufficient on its own, so combining is not needed. Treating $x^2 > 1$ as insufficient because it hides the sign misses that both signs answer yes.`,
        D: md`Statement (1) gives both answers: $x = 1$ gives $1 > 1$, which is false, while $x = 2$ gives yes.`,
        E: md`Statement (2) alone answers the question: $x^2 > 1$ means $x > 1$ or $x < -1$, and every such $x$ has $x^2 > x$.`,
      }),
      answer: 'B',
      workingMd: md`Rephrase: $x^2 > x$ means $x(x - 1) > 0$, which is true when $x > 1$ or $x < 0$. Statement (1) allows $x = 2$ (yes) and $x = \frac{3}{4}$ or $x = 1$ (no). Not sufficient. Statement (2): $x^2 > 1$ means $x > 1$ or $x < -1$. Both pieces lie inside the rephrased condition ($x = 2$ gives $4 > 2$; $x = -2$ gives $4 > -2$), so the answer is always yes. Sufficient. Statement (2) alone is sufficient, but statement (1) alone is not.`,
      lesson: 'Rephrase the stem into a condition on $x$, then test fractions and boundary values as well as integers.',
    },
    {
      id: 'check-ds-divisible-6',
      title: 'Divisible by 6?',
      topic: 'Data Sufficiency',
      stemMd: md`$n$ is a positive integer. Is $n$ divisible by 6?

(1) $n$ is divisible by 3.

(2) $n$ is divisible by 4.`,
      options: dsOptions('C', {
        A: md`Statement (1) allows $n = 3$ (not divisible by 6) and $n = 6$ (divisible).`,
        B: md`Statement (2) allows $n = 4$ (not divisible by 6) and $n = 12$ (divisible).`,
        D: md`Each statement alone allows both a yes and a no: 3 and 6 for statement (1), 4 and 12 for statement (2).`,
        E: md`Together $n$ is divisible by both 3 and 4, hence by 12, and every multiple of 12 is a multiple of 6: always yes.`,
      }),
      answer: 'C',
      workingMd: md`Statement (1) alone: $n = 3$ answers no, $n = 6$ yes. Not sufficient. Statement (2) alone: $n = 4$ no, $n = 12$ yes. Not sufficient. Together: divisible by 3 and by 4, which share no prime factor, means divisible by 12, and $12 = 6 \times 2$, so the answer is always yes. Both together are sufficient, but neither alone is.`,
      lesson: 'Divisibility by $6$ needs a factor 2 and a factor 3; look for where each statement supplies them.',
    },
    {
      id: 'check-ds-a-greater-b',
      title: 'Is a greater than b?',
      topic: 'Data Sufficiency',
      stemMd: md`Is $a > b$?

(1) $a^2 > b^2$

(2) $\frac{a}{b} > 1$`,
      options: dsOptions('E', {
        A: md`Statement (1) allows $a = 3, b = 1$ (yes) and $a = -3, b = 1$ (no): a larger square does not mean a larger number.`,
        B: md`This multiplies $\frac{a}{b} > 1$ by $b$ as if $b$ were positive. With $a = -3, b = -1$, $\frac{a}{b} = 3 > 1$ but $a < b$.`,
        C: md`The pair $a = -3, b = -1$ satisfies both statements ($9 > 1$ and $3 > 1$) and answers no, while $a = 3, b = 1$ answers yes.`,
        D: md`Each statement allows a "no" case once negative values are tried: $a = -3, b = 1$ for statement (1) and $a = -3, b = -1$ for statement (2).`,
      }),
      answer: 'E',
      workingMd: md`Statement (1): $a = 3, b = 1$ gives yes; $a = -3, b = 1$ gives no. Not sufficient. Statement (2): $a = 3, b = 1$ gives yes; $a = -3, b = -1$ gives $\frac{a}{b} = 3 > 1$ but $-3 < -1$, no. Not sufficient. Together: $a = 3, b = 1$ satisfies both and gives yes; $a = -3, b = -1$ satisfies both ($9 > 1$, $3 > 1$) and gives no. Not sufficient. The statements together are not sufficient.`,
      lesson: 'When combining, carry the negative cases forward; they often satisfy both statements.',
    },
  ],
  takeaways: [
    'A yes/no statement is sufficient if it always gives yes or always gives no.',
    'Rephrase the stem into its simplest condition before testing statements.',
    'Test zero, negatives and fractions, not only positive integers.',
    'Testing proves "not sufficient"; for "sufficient", find the reason.',
  ],
  practice: { examKey: 'gmat', domain: 'di-data-sufficiency', skill: 'ds-analyze-quantitative-problem' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const dataSufficiencyTraps: Lesson = {
  slug: 'data-sufficiency-traps',
  title: 'Data sufficiency traps',
  summary: 'Avoid the data sufficiency errors that cost the most: leaking one statement into the other, unstated assumptions, hidden integer limits and ranges.',
  minutes: 22,
  objectives: [
    'Keep each statement separate when testing it alone.',
    'Use only what the stem and statements state, not what a story or figure seems to suggest.',
    'Recognise when an integer condition makes a single equation sufficient.',
    'Tell a unique value from a range of values.',
  ],
  teachMd: md`
### Most errors are not arithmetic

Data sufficiency rarely requires long calculation, so most lost marks come from reasoning slips: using information you were not given, or not using information you were. This lesson names the common ones and shows how to check for each.

### Leaking statement (1) into statement (2)

After working through statement (1), its content stays in your head. When you then test statement (2) "alone", it is easy to use what (1) told you without noticing. Suppose the stem asks "Is $k > 5$?", (1) says $k^2 = 49$ and (2) says $k > 0$. Having just found $k = \pm 7$ from (1), you may read (2) and think "so $k = 7$, yes". But (2) alone allows $k = 1$, which answers no.

A practical defence: when you turn to statement (2), cover statement (1) with your hand or say to yourself "new question". Then write down two cases for (2) that do not depend on (1).

### Assuming what is not stated

Only the stem and the statements count. Do not assume:

- that a number is an **integer**, unless the stem says so;
- that it is **positive**, unless the stem says so, or it is a count or a length;
- that two variables are **different**, unless stated;
- that a figure is **drawn to scale**: treat any diagram as a sketch of the relationships described, not as a measurement. An angle that looks like a right angle, or two lines that look parallel, are facts only if the text says so.

Natural restrictions do apply: a number of people is a non-negative integer, a length is positive. Those are facts the situation states, not assumptions. The skill is to tell the two apart.

### Hidden integer limits

One equation in two unknowns is usually not sufficient. But when the unknowns must be non-negative integers, as counts of items are, one equation may allow only a single solution. Suppose mugs cost $\$7$ and plates $\$4$, and someone spent $\$30$ on them. Test the number of mugs: 0 leaves $\$30$ (not a multiple of 4), 1 leaves 23, 2 leaves 16 (four plates), 3 leaves 9, 4 leaves 2. Only two mugs works. One equation, one answer: sufficient.

The same purchase with a total of $\$43$ allows two answers (1 mug and 9 plates, or 5 mugs and 2 plates). So you cannot decide in general; you have to list the integer solutions each time. That listing is fast because the possible counts are small.

### A unique value versus a range

A value question needs exactly one value. A statement that narrows a variable to a range, such as $4 < x < 6$, is not sufficient for "What is $x$?" unless something else (for example, "$x$ is an integer") collapses the range to one value. Equally, two ranges combined are usually still a range. Read the stem: "What is $x$?" needs a point; "Is $x > 3$?" only needs the range to sit wholly on one side of 3.

### The tempting "together"

When neither statement looks sufficient at a glance, combining them feels natural, and "both together" is often chosen too quickly. Two failures follow:

- **One statement was sufficient all along.** Typical cases: a statement gives the required combination directly ($3x = 5y$ gives $\frac{x}{y}$), or an integer condition makes one equation enough.
- **Together is still not enough.** The statements repeat each other, or a negative case satisfies both.

Before choosing "both together", ask whether either statement alone was really insufficient; prove it with two cases. After combining, ask whether a case with the other answer still survives.

### A last routine check

Before you confirm an answer: did you test each statement truly alone? Did you use any fact that is neither in the stem nor in a statement? Did you allow negatives, zero and fractions wherever the stem allows them? Three questions, ten seconds.
`,
  examples: [
    {
      id: 'example-integer-purchase',
      title: 'An integer limit decides it',
      problemMd: md`Mia bought only mugs, at $\$7$ each, and plates, at $\$4$ each. How many mugs did she buy?

(1) She spent $\$43$ in total.

(2) She bought 7 items in total.`,
      steps: [
        md`Statement (1): $7m + 4p = 43$ with $m$ and $p$ non-negative integers. Try $m = 0$ to 6: the leftover $43 - 7m$ is $43, 36, 29, 22, 15, 8, 1$, and only 36 and 8 are multiples of 4. So $(m, p) = (1, 9)$ or $(5, 2)$. Two answers: not sufficient.`,
        md`Statement (2): $m + p = 7$ allows any split from 0 to 7 mugs. Not sufficient.`,
        md`Together: of the two cases from statement (1), only $(5, 2)$ has 7 items ($(1, 9)$ has 10). One answer: sufficient. Check: $5 \times 7 + 2 \times 4 = 35 + 8 = 43$.`,
      ],
      answerMd: md`Both statements together are sufficient, but neither alone is. Had the total in statement (1) been $\$30$, only $(2, 4)$ would work and statement (1) alone would have been sufficient.`,
    },
    {
      id: 'example-leak',
      title: 'Keeping statement (2) alone',
      problemMd: md`Is $x$ positive?

(1) $xy > 0$

(2) $y > 0$`,
      steps: [
        md`Statement (1): $x = 1, y = 1$ gives yes; $x = -1, y = -1$ gives no. Not sufficient.`,
        md`Statement (2), truly alone: it says nothing about $x$. $x = 1$ and $x = -1$ are both allowed. Not sufficient. (If you carried $xy > 0$ over, you would wrongly call it sufficient.)`,
        md`Together: $xy > 0$ means $x$ and $y$ have the same sign, and $y$ is positive, so $x$ is positive. Always yes. Sufficient.`,
      ],
      answerMd: md`Both statements together are sufficient, but neither alone is. Choosing "statement (2) alone" is the leak from statement (1).`,
    },
    {
      id: 'example-ratio-alone',
      title: 'One statement was enough',
      problemMd: md`$y$ is not zero. What is the value of $\frac{x}{y}$?

(1) $3x = 5y$

(2) $x + y = 16$`,
      steps: [
        md`Statement (1): divide both sides by $3y$, allowed because $y \neq 0$: $\frac{x}{y} = \frac{5}{3}$. One value. Sufficient, even though $x$ and $y$ are unknown.`,
        md`Statement (2): $x = 8, y = 8$ gives 1; $x = 10, y = 6$ gives $\frac{5}{3}$. Not sufficient.`,
      ],
      answerMd: md`Statement (1) alone is sufficient, but statement (2) alone is not. Choosing "both together", because together they give $x = 10$ and $y = 6$, is the tempting-together trap.`,
    },
  ],
  traps: [
    {
      title: 'The leak from statement (1)',
      md: md`When testing statement (2) alone, write two cases that satisfy statement (2) only. If your cases also happen to satisfy statement (1), you may be leaking it.`,
    },
    {
      title: 'Assuming integers or positive values',
      md: md`"$4 < x < 6$" pins $x = 5$ only if $x$ is an integer. Unless the stem says so, $x = 4.5$ is allowed.`,
    },
    {
      title: 'Trusting a figure',
      md: md`Do not assume a figure is drawn to scale. Use only the lengths, angles and relations the text states; an angle that looks like $90^\circ$ is not known to be one.`,
    },
    {
      title: 'Ignoring a natural integer limit',
      md: md`Counts of people or items are non-negative integers even if the stem does not repeat it. That can make a single equation sufficient; list the integer solutions before deciding.`,
    },
    {
      title: 'Choosing "together" by reflex',
      md: md`Before combining, prove each statement insufficient with two cases. After combining, look for a surviving case with the other answer.`,
    },
  ],
  check: [
    {
      id: 'check-ds-integer-n',
      title: 'An integer between 3 and 5',
      topic: 'Data Sufficiency',
      stemMd: md`$n$ is an integer. What is the value of $n$?

(1) $3 < n < 5$

(2) $n^2 = 16$`,
      options: dsOptions('A', {
        B: md`Statement (2) allows $n = 4$ and $n = -4$; squaring hides the sign.`,
        C: md`Statement (1) already gives $n = 4$, because the stem says $n$ is an integer and 4 is the only integer strictly between 3 and 5.`,
        D: md`Statement (2) alone leaves two values, 4 and $-4$.`,
        E: md`This ignores the stem's condition that $n$ is an integer; with it, statement (1) leaves only 4.`,
      }),
      answer: 'A',
      workingMd: md`Statement (1): the only integer strictly between 3 and 5 is 4. Sufficient. Statement (2): $n = 4$ or $n = -4$. Not sufficient. Statement (1) alone is sufficient, but statement (2) alone is not.`,
      lesson: 'An integer condition in the stem can turn a range into a single value.',
    },
    {
      id: 'check-ds-k-greater-5',
      title: 'Is k greater than 5?',
      topic: 'Data Sufficiency',
      stemMd: md`Is $k > 5$?

(1) $k^2 = 49$

(2) $k > 0$`,
      options: dsOptions('C', {
        A: md`Statement (1) allows $k = 7$ (yes) and $k = -7$ (no).`,
        B: md`This carries $k^2 = 49$ over from statement (1). Alone, statement (2) allows $k = 1$, which answers no.`,
        D: md`Neither statement alone forces an answer: $k = -7$ satisfies statement (1) with a no, and $k = 1$ satisfies statement (2) with a no, while $k = 7$ gives yes for both.`,
        E: md`Together $k$ is the positive root of 49, which is 7, and $7 > 5$: always yes.`,
      }),
      answer: 'C',
      workingMd: md`Statement (1): $k = 7$ (yes) or $k = -7$ (no). Not sufficient. Statement (2), alone: $k = 1$ (no) and $k = 6$ (yes). Not sufficient. Together: $k^2 = 49$ and $k > 0$ give $k = 7$, and $7 > 5$. Sufficient. Both together are sufficient, but neither alone is.`,
      lesson: 'Test statement (2) with cases chosen from statement (2) only.',
    },
    {
      id: 'check-ds-range',
      title: 'A value or a range?',
      topic: 'Data Sufficiency',
      stemMd: md`What is the value of $x$?

(1) $4 < x < 6$

(2) $x^2 > 20$`,
      options: dsOptions('E', {
        A: md`This assumes $x$ is an integer, which would give $x = 5$. The stem does not say so: $x = 4.5$ and $x = 5$ are both allowed.`,
        B: md`Statement (2) describes a range, $x > \sqrt{20}$ or $x < -\sqrt{20}$, with infinitely many values.`,
        C: md`Together $x$ lies between $\sqrt{20} \approx 4.47$ and 6, still a range: $4.5$, $5$ and $5.5$ all satisfy both statements.`,
        D: md`Each statement gives a range of values, not a single value; neither is sufficient alone.`,
      }),
      answer: 'E',
      workingMd: md`Statement (1): $x = 4.5$ and $x = 5$ both satisfy it. Not sufficient. Statement (2): $x = 5$ and $x = 6$ both satisfy it. Not sufficient. Together: $x$ must exceed $\sqrt{20} \approx 4.47$ and be below 6; $x = 4.5$ ($4.5^2 = 20.25 > 20$) and $x = 5$ both qualify. Still not one value. The statements together are not sufficient.`,
      lesson: 'Two ranges combined are usually still a range; a value question needs a single point.',
    },
  ],
  takeaways: [
    'Test statement (2) with cases taken from statement (2) alone.',
    'Use only stated facts: no assumed integers, signs or measurements from a figure.',
    'When unknowns are counts, list the integer solutions; one equation may be enough.',
    'A value question needs one value; a range is not sufficient.',
    'Before choosing "both together", prove each statement insufficient; after combining, look for a surviving counter-case.',
  ],
  practice: { examKey: 'gmat', domain: 'di-data-sufficiency', skill: 'ds-avoid-unwarranted-assumptions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const dataSufficiencyUnit: Unit = {
  slug: 'data-sufficiency',
  title: 'Data Insights: data sufficiency',
  summary: 'Data Sufficiency is one of the question types in GMAT Data Insights, the section of 20 questions in 45 minutes with an on-screen calculator. Instead of asking for an answer, each question asks whether two statements give enough information to find one. This unit teaches the five fixed answers and a routine for applying them, yes/no questions, and the reasoning traps that cost the most.',
  lessons: [dataSufficiencyFundamentals, dataSufficiencyYesNo, dataSufficiencyTraps],
};
