import { md, type Lesson } from '../../types';

export const equationsAndSystemsLesson: Lesson = {
  slug: 'equations-and-systems',
  title: 'Linear equations and systems',
  summary: 'Solve linear equations cleanly, turn word problems into equations, and solve two-unknown systems by substitution, elimination or a shortcut.',
  minutes: 20,
  objectives: [
    'Solve a linear equation with brackets and fractions without sign slips.',
    'Translate a word problem into one or two equations and solve them.',
    'Choose between substitution and elimination, and spot systems with no solution or infinitely many.',
  ],
  teachMd: md`
### One rule for every linear equation

An equation stays true if you do the same thing to both sides. Solving a linear equation is a sequence of such moves, each chosen to bring $x$ closer to being alone:

1. Clear fractions by multiplying **every term** by the common denominator.
2. Expand brackets, taking care with a minus sign in front of a bracket.
3. Collect the $x$ terms on one side and the numbers on the other.
4. Divide by the coefficient of $x$.
5. Substitute the answer back into the original equation.

Take $\frac{x + 2}{3} - \frac{x - 1}{4} = 2$. Multiply every term by 12: $4(x + 2) - 3(x - 1) = 24$. Expand: $4x + 8 - 3x + 3 = 24$; note that $-3 \times (-1) = +3$. Collect: $x + 11 = 24$, so $x = 13$. Check: $\frac{15}{3} - \frac{12}{4} = 5 - 3 = 2$.

The substitution check in step 5 costs a few seconds and catches nearly every sign slip, which is the most common way to lose a mark on an equation you can actually solve.

### From words to equations

Word problems are equations written in sentences. A reliable routine:

- **Name the unknowns** with letters that remind you what they are ($a$ for adult tickets, $c$ for child tickets), and write down what each letter stands for.
- **Find as many independent facts as unknowns.** Typical facts are a total count, a total value, a difference, or a ratio.
- **Write each fact as an equation**, keeping units consistent (all in euros, all in minutes).
- **Answer the question asked.** If you solved for $a$ but the question wants $c$, take the last step.

"Twice as many A as B" is $A = 2B$, not $2A = B$; test such a sentence with small numbers if unsure. "5 less than $x$" is $x - 5$, not $5 - x$.

### Two equations, two unknowns

**Substitution** suits a system where one equation already gives a variable by itself, or nearly: from $a + c = 40$, write $c = 40 - a$ and substitute.

**Elimination** suits a system where the coefficients line up. Multiply one or both equations so a variable has opposite (or equal) coefficients, then add (or subtract) to remove it. For $3x + 2y = 17$ and $2x - y = 2$, double the second to get $4x - 2y = 4$ and add: $7x = 21$, so $x = 3$, and then $y = 2x - 2 = 4$. Check: $9 + 8 = 17$ and $6 - 4 = 2$.

**Look at what is asked before solving.** If a question wants $x + y$, adding or subtracting the equations may give it directly. From $3x + 2y = 17$ and $2x + 3y = 13$, adding gives $5x + 5y = 30$, so $x + y = 6$ without finding $x$ or $y$.

### When a system has no single answer

Two linear equations are two straight lines. Usually they cross once and there is one solution. But:

| Case | What you see | Solutions |
| --- | --- | --- |
| lines cross | coefficients not proportional | exactly one |
| parallel lines | coefficients proportional, constants not | none |
| same line | whole equations proportional | infinitely many |

For $2x + 4y = 10$ and $x + 2y = k$: halving the first gives $x + 2y = 5$. If $k = 5$, the two equations are the same line and every point on it works; for any other $k$, the lines are parallel and nothing works. When elimination leaves a statement like $0 = 0$, you have the same line; when it leaves $0 = 3$, there is no solution.

### Keeping arithmetic light

Without a calculator, choose moves that keep numbers small. Divide an equation through by a common factor first ($6x + 9y = 42$ becomes $2x + 3y = 14$). Eliminate the variable whose coefficients are easier to match. And if the numbers become ugly, recheck the setup: multiple-choice problems solved by hand often come out in whole numbers or simple fractions.
`,
  examples: [
    {
      id: 'example-fractions',
      title: 'An equation with fractions',
      problemMd: md`Solve $\frac{x + 2}{3} - \frac{x - 1}{4} = 2$.`,
      steps: [
        md`The common denominator is 12. Multiply every term, including the 2 on the right: $4(x + 2) - 3(x - 1) = 24$.`,
        md`Expand, minding the minus in front of the second bracket: $4x + 8 - 3x + 3 = 24$.`,
        md`Collect: $x + 11 = 24$, so $x = 13$.`,
        md`Substitute back: $\frac{13 + 2}{3} - \frac{13 - 1}{4} = 5 - 3 = 2$. Correct.`,
      ],
      answerMd: md`$x = 13$. Writing $-3x - 3$ instead of $-3x + 3$ gives $x + 5 = 24$ and the wrong answer $x = 19$.`,
    },
    {
      id: 'example-tickets',
      title: 'Ticket sales',
      problemMd: md`A theatre sells adult tickets at €12 and child tickets at €7. On one evening it sells 40 tickets for a total of €395. How many child tickets were sold?`,
      steps: [
        md`Let $a$ be adult tickets and $c$ child tickets. Count: $a + c = 40$. Money: $12a + 7c = 395$.`,
        md`Substitute $a = 40 - c$: $12(40 - c) + 7c = 395$, so $480 - 5c = 395$.`,
        md`Then $5c = 85$ and $c = 17$, so $a = 23$.`,
        md`Check: $12 \times 23 = 276$ and $7 \times 17 = 119$, and $276 + 119 = 395$.`,
        md`Second route: if all 40 were child tickets the takings would be $40 \times 7 = 280$. Each swap to an adult ticket adds €5, and $395 - 280 = 115$ needs $\frac{115}{5} = 23$ swaps, so 23 adults and 17 children.`,
      ],
      answerMd: md`17 child tickets were sold. Stopping at 23 answers for adult tickets, which the question did not ask.`,
    },
    {
      id: 'example-shortcut',
      title: 'Asked for a sum, not the parts',
      problemMd: md`If $3x + 2y = 17$ and $2x + 3y = 13$, what is $x + y$?`,
      steps: [
        md`Add the two equations: $5x + 5y = 30$.`,
        md`Divide by 5: $x + y = 6$.`,
        md`Check by solving fully: subtracting gives $x - y = 4$; with $x + y = 6$ this gives $x = 5$ and $y = 1$. Then $15 + 2 = 17$ and $10 + 3 = 13$.`,
      ],
      answerMd: md`$x + y = 6$. Adding the equations gets there in one line; solving for each variable is correct but slower.`,
    },
  ],
  traps: [
    {
      title: 'A minus sign in front of a bracket',
      md: md`$-3(x - 1)$ is $-3x + 3$. Distributing the minus to the first term only is the commonest slip in linear equations. Substituting your answer back into the original equation catches it.`,
    },
    {
      title: 'Clearing fractions term by term',
      md: md`When you multiply by the common denominator, every term on both sides must be multiplied, including whole numbers. Forgetting to multiply the 2 in $\ldots = 2$ by 12 changes the equation.`,
    },
    {
      title: 'Answering for the wrong unknown',
      md: md`Systems give two values; questions usually ask for one. Underline what is asked before you start and check your final line answers it.`,
    },
    {
      title: 'Assuming every system has one solution',
      md: md`If the equations are multiples of each other, every point on the line works; if only the left-hand sides are multiples, nothing works. Compare coefficients before you eliminate.`,
    },
  ],
  check: [
    {
      id: 'check-brackets',
      title: 'Brackets and signs',
      topic: 'Quantitative reasoning: equations',
      stemMd: md`Solve $5 - 2(x - 3) = 3x - 4$.`,
      options: [
        { id: 'A', text: md`$x = \frac{3}{5}$`, note: md`Expands $-2(x - 3)$ as $-2x - 6$; the minus times $-3$ gives $+6$, not $-6$.` },
        { id: 'B', text: md`$x = \frac{6}{5}$`, note: md`Multiplies only the $x$ in the bracket by $-2$, writing $-2x - 3$, so the bracket's $-3$ is never doubled or sign-changed.` },
        { id: 'C', text: md`$x = 3$`, note: '' },
        { id: 'D', text: md`$x = 15$`, note: md`After reaching $11 - 2x = 3x - 4$, moves $-2x$ across without changing its sign, getting $15 = x$ instead of $15 = 5x$.` },
      ],
      answer: 'C',
      workingMd: md`Expand: $5 - 2x + 6 = 3x - 4$, so $11 - 2x = 3x - 4$. Collect: $15 = 5x$, so $x = 3$. Check: left side $5 - 2(0) = 5$, right side $9 - 4 = 5$.`,
      lesson: 'A minus in front of a bracket changes the sign of every term inside it.',
    },
    {
      id: 'check-coffees',
      title: 'Small and large coffees',
      topic: 'Quantitative reasoning: equations',
      stemMd: md`A café sells small coffees at €2 and large coffees at €3. One morning it sells 70 coffees for a total of €172. How many large coffees did it sell?`,
      options: [
        { id: 'A', text: md`32`, note: '' },
        { id: 'B', text: md`35`, note: md`Splits the 70 coffees equally without using the takings; equal numbers would bring in €175, not €172.` },
        { id: 'C', text: md`38`, note: md`This is the number of small coffees; the question asks for the large ones.` },
        { id: 'D', text: md`86`, note: md`Divides the takings by €2 as if every coffee were small; that is not even possible with 70 coffees.` },
      ],
      answer: 'A',
      workingMd: md`Let $s$ and $l$ be small and large coffees: $s + l = 70$ and $2s + 3l = 172$. Substituting $s = 70 - l$ gives $140 + l = 172$, so $l = 32$ and $s = 38$. Check: $76 + 96 = 172$.`,
      lesson: 'Write one equation for the count and one for the value, then answer for the unknown the question names.',
    },
    {
      id: 'check-infinitely-many',
      title: 'Infinitely many solutions',
      topic: 'Quantitative reasoning: equations',
      stemMd: md`For which value of $k$ does the system $3x - 6y = 9$ and $x - 2y = k$ have infinitely many solutions?`,
      options: [
        { id: 'A', text: md`$k = -3$`, note: md`Has the right size but the wrong sign; dividing $3x - 6y = 9$ by 3 gives $x - 2y = 3$, with a positive 3.` },
        { id: 'B', text: md`$k = 3$`, note: '' },
        { id: 'C', text: md`$k = 9$`, note: md`Divides the coefficients of $x$ and $y$ by 3 but not the constant, so the two equations would describe parallel lines, with no solution.` },
        { id: 'D', text: md`No value of $k$ works`, note: md`True for a system with crossing lines, but here the left-hand sides are proportional, so the equations can describe the same line.` },
      ],
      answer: 'B',
      workingMd: md`Divide the first equation by 3: $x - 2y = 3$. It is the same line as $x - 2y = k$ exactly when $k = 3$, and then every point on the line is a solution. For any other $k$ the lines are parallel and there is no solution.`,
      lesson: 'Proportional equations mean one line and infinitely many solutions; proportional left sides with different constants mean no solution.',
    },
  ],
  takeaways: [
    'Clear fractions by multiplying every term, expand carefully, collect, divide, then substitute back.',
    'Write one equation per fact, with as many facts as unknowns.',
    'Use substitution when a variable is already alone, elimination when coefficients line up.',
    md`If the question asks for $x + y$ or $x - y$, try adding or subtracting the equations first.`,
    'Proportional equations: infinitely many solutions; proportional left sides only: none.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-algebra-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
