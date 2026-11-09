import { md, type Lesson } from '../../types';

export const linearEquationsLesson: Lesson = {
  slug: 'linear-equations-and-systems',
  title: 'Linear equations and systems of two equations',
  summary: 'Solve linear equations without sign slips, solve two-equation systems by substitution or elimination, and spot when only a combination is needed.',
  minutes: 20,
  objectives: [
    'Solve a one-variable linear equation, including one with fractions or brackets, and check the result.',
    'Solve a system of two linear equations by substitution or by elimination, choosing the faster route.',
    'Find a combination such as $x + y$ directly, and tell when a system has one, no or infinitely many solutions.',
  ],
  teachMd: md`
### An equation is a balance

A linear equation says that two expressions are equal, and every variable appears only to the first power. Solving it means producing a chain of equivalent equations that ends in $x = \text{number}$. Each step must keep the two sides equal, so whatever you do to one side you do to the whole of the other side: add or subtract the same quantity, or multiply or divide by the same **non-zero** number.

A reliable order for a single equation:

1. Clear fractions by multiplying **every term** on both sides by the lowest common denominator.
2. Expand brackets, taking care with a minus sign in front of a bracket: $-2(x - 3) = -2x + 6$.
3. Collect the variable terms on one side and the numbers on the other.
4. Divide by the coefficient of the variable.
5. Substitute the answer into the original equation, not into one of your working lines.

The last step costs a few seconds and catches most slips, because an error made in step 2 usually survives into step 4 but not into the original equation.

### Two unknowns need two independent facts

One linear equation in $x$ and $y$, such as $2x + y = 10$, has infinitely many solutions: $(0, 10)$, $(5, 0)$, $(3, 4)$ and so on. To pin down one pair you need a second equation that says something new. There are two standard methods.

**Substitution.** Solve one equation for one variable and put that expression into the other equation. It is fastest when a variable already has coefficient 1 or $-1$, as in $y = 3x - 5$ or $x + 2y = 11$.

**Elimination.** Multiply one or both equations so that one variable has opposite coefficients, then add the equations so that variable disappears. It is fastest when no coefficient is 1 but two coefficients are easy multiples of each other, as with $2y$ and $-4y$.

Both methods give the same answer, and after finding one variable you substitute back to find the other. Check the pair in **both** original equations: a pair that satisfies only one of them is a sign that the elimination step went wrong.

### Look at what the question asks for

Many questions do not want $x$ and $y$ separately. They ask for $x + y$, $2a - b$, or the ratio $\frac{x}{y}$. Before you solve, look at the target and at the equations together. If the system is

$$x + 2y = 11 \qquad 3x - y = 5$$

and the question asks for $4x + y$, adding the two equations gives $4x + y = 16$ in one line. Subtracting, or adding multiples, often produces the target just as quickly. Solving fully is never wrong, but it is slower, and every extra line is a chance to slip.

### One, none or infinitely many

Two linear equations in two unknowns are two straight lines, and the solution is where they meet.

| The equations | The lines | Solutions |
| --- | --- | --- |
| Coefficients not in proportion, e.g. $x + y = 5$ and $x - y = 1$ | cross once | exactly one |
| Left sides in proportion, right sides not, e.g. $x + 2y = 3$ and $2x + 4y = 7$ | parallel, distinct | none |
| One equation a multiple of the other, e.g. $x + 2y = 3$ and $2x + 4y = 6$ | the same line | infinitely many |

This matters most in quantitative comparison. If the second equation is just the first one multiplied by a number, it adds no information, and a comparison of $x$ with $y$ usually cannot be decided. Before you solve, glance at whether one equation is a multiple of the other.

### The on-screen calculator

The GRE provides an on-screen calculator for the Quantitative Reasoning section. It helps with awkward arithmetic once an equation is set up, but it does not set the equation up, and it does not catch a minus sign dropped in a bracket. Do the algebra on paper and use the calculator only for the arithmetic at the end.
`,
  examples: [
    {
      id: 'example-fractions',
      title: 'An equation with two fractions',
      problemMd: md`Solve $\frac{x + 4}{3} - \frac{x - 2}{5} = 2$.`,
      steps: [
        md`The denominators are 3 and 5, so multiply **every** term by 15, including the 2 on the right: $5(x + 4) - 3(x - 2) = 30$.`,
        md`Expand, keeping the minus sign in front of the second bracket: $5x + 20 - 3x + 6 = 30$. The $-3 \times (-2)$ gives $+6$.`,
        md`Collect terms: $2x + 26 = 30$, so $2x = 4$ and $x = 2$.`,
        md`Check in the original: $\frac{2 + 4}{3} - \frac{2 - 2}{5} = 2 - 0 = 2$. It holds.`,
      ],
      answerMd: md`$x = 2$. Writing $-3x - 6$ for the second bracket gives $2x + 14 = 30$ and the wrong answer $x = 8$; the check catches it, since $4 - \frac{6}{5} \neq 2$.`,
    },
    {
      id: 'example-elimination',
      title: 'Elimination, checked by substitution',
      problemMd: md`Solve the system $3x + 2y = 18$ and $5x - 4y = 8$.`,
      steps: [
        md`The $y$ coefficients are $2$ and $-4$, so doubling the first equation makes them opposites: $6x + 4y = 36$.`,
        md`Add this to the second equation; the $y$ terms cancel: $11x = 44$, so $x = 4$.`,
        md`Substitute into the first equation: $12 + 2y = 18$, so $y = 3$.`,
        md`Second route, substitution: from the first equation $y = \frac{18 - 3x}{2}$. Then $5x - 2(18 - 3x) = 8$, so $11x - 36 = 8$ and $x = 4$ again.`,
        md`Check both originals: $3(4) + 2(3) = 18$ and $5(4) - 4(3) = 8$.`,
      ],
      answerMd: md`$x = 4$ and $y = 3$.`,
    },
    {
      id: 'example-combination',
      title: 'Finding $a + b$ without finding $a$ and $b$',
      problemMd: md`If $4a + 7b = 23$ and $2a + 5b = 13$, what is the value of $a + b$?`,
      steps: [
        md`The target $a + b$ has equal coefficients. Subtracting the second equation from the first gives equal coefficients too: $(4a - 2a) + (7b - 5b) = 23 - 13$.`,
        md`That is $2a + 2b = 10$, so $a + b = 5$.`,
        md`Check by solving fully: double the second equation to get $4a + 10b = 26$, subtract the first, and $3b = 3$, so $b = 1$ and $a = 4$. Then $a + b = 5$.`,
      ],
      answerMd: md`$a + b = 5$. Adding the equations instead gives $6a + 12b = 36$, so $a + 2b = 6$, which is a different combination; 6 is the tempting wrong answer.`,
    },
    {
      id: 'example-no-solution',
      title: 'When a system has no solution',
      problemMd: md`For what value of $k$ does the system $2x - 3y = 5$ and $kx - 6y = 12$ have no solution?`,
      steps: [
        md`A system has no solution when the left sides are in proportion but the right sides are not. The $y$ coefficients are $-3$ and $-6$, a factor of 2.`,
        md`For the left sides to be in proportion, $k$ must be $2 \times 2 = 4$. Then the second equation reads $4x - 6y = 12$.`,
        md`Twice the first equation is $4x - 6y = 10$. The same left side cannot equal both 10 and 12, so the system has no solution.`,
        md`For any other $k$ the lines have different slopes and cross exactly once.`,
      ],
      answerMd: md`$k = 4$. Had the second right side been 10, the two equations would describe the same line and there would be infinitely many solutions.`,
    },
  ],
  traps: [
    {
      title: 'A minus sign in front of a bracket',
      md: md`$-2(x - 3)$ is $-2x + 6$, not $-2x - 6$. The minus multiplies **every** term inside. Wrong options are often built from exactly this slip, so expand bracket by bracket and check the final answer in the original equation.`,
    },
    {
      title: 'Clearing fractions on one side only',
      md: md`When you multiply through by a common denominator, the whole-number terms must be multiplied too. In $\frac{x}{3} + 1 = 5$, multiplying by 3 gives $x + 3 = 15$, not $x + 1 = 15$.`,
    },
    {
      title: 'Answering $x$ when the question asks for something else',
      md: md`After a few lines of work, the value of $x$ feels like the answer. If the question asked for $x + y$, $2x$ or $y$, the value of $x$ is usually among the options. Underline the target before you start and reread it before you choose.`,
    },
    {
      title: 'Treating two equations as two facts',
      md: md`Two equations fix two unknowns only when neither is a multiple of the other. $2p + 3q = 12$ and $4p + 6q = 24$ are the same fact written twice, so $p$ and $q$ can take many values. In a comparison, that usually means the relationship cannot be determined.`,
    },
  ],
  check: [
    {
      id: 'check-bracket-equation',
      title: 'A bracket with a minus sign',
      topic: 'Algebra',
      stemMd: md`If $5x - 2(x - 3) = 4x - 7$, what is the value of $x$?`,
      options: [
        { id: 'A', text: md`$-13$`, note: md`From $3x + 6 = 4x - 7$ you reach $-x = -13$; dividing by $-1$ gives $13$, not $-13$. The sign was dropped at the last step.` },
        { id: 'B', text: md`$-\frac{13}{7}$`, note: md`Moves $4x$ to the left without changing its sign, giving $7x + 6 = -7$.` },
        { id: 'C', text: md`$1$`, note: md`Expands $-2(x - 3)$ as $-2x - 6$, so the equation becomes $3x - 6 = 4x - 7$.` },
        { id: 'D', text: md`$10$`, note: md`Applies the factor 2 only to the $x$ and the minus sign alone to the 3, giving $5x - 2x + 3$, so $3x + 3 = 4x - 7$.` },
        { id: 'E', text: md`$13$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Expand: $5x - 2x + 6 = 4x - 7$, so $3x + 6 = 4x - 7$. Subtract $3x$ and add 7: $13 = x$. Check: the left side is $65 - 2(10) = 45$ and the right side is $52 - 7 = 45$.`,
      lesson: 'Multiply every term of a bracket by the sign and number in front of it, then check the answer in the original equation.',
    },
    {
      id: 'check-dependent-system',
      title: 'Two equations, one fact',
      topic: 'Quantitative Comparison',
      stemMd: md`$2p + 3q = 12$ and $4p + 6q = 24$.

| Quantity A | Quantity B |
| --- | --- |
| $p$ | $q$ |`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: md`True for one solution, such as $p = 3$ and $q = 2$, but $p = 0$ and $q = 4$ also satisfy both equations and reverse the comparison.` },
        { id: 'B', text: 'Quantity B is greater.', note: md`True for $p = 0$ and $q = 4$, but $p = 6$ and $q = 0$ satisfy both equations too, and then $p$ is greater.` },
        { id: 'C', text: 'The two quantities are equal.', note: md`$p = q = 2.4$ is one solution, found by assuming the two are equal; the equations do not force it.` },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: '' },
      ],
      answer: 'D',
      workingMd: md`The second equation is exactly twice the first, so together they say only $2p + 3q = 12$. That single equation has many solutions: $(p, q) = (6, 0)$ makes $p$ greater, $(0, 4)$ makes $q$ greater, and $(2.4, 2.4)$ makes them equal. The comparison is not fixed.`,
      lesson: 'Before solving a system in a comparison, check whether one equation is a multiple of the other; if it is, there is only one fact.',
    },
    {
      id: 'check-combination',
      title: 'Read the target first',
      topic: 'Algebra',
      stemMd: md`If $x + 2y = 11$ and $3x - y = 5$, what is the value of $4x + y$?`,
      options: [
        { id: 'A', text: md`$3$`, note: md`This is the value of $x$, not of $4x + y$.` },
        { id: 'B', text: md`$4$`, note: md`This is the value of $y$, not of $4x + y$.` },
        { id: 'C', text: md`$7$`, note: md`This is $x + y$, a different combination.` },
        { id: 'D', text: md`$16$`, note: '' },
        { id: 'E', text: md`$21$`, note: md`This is $7x$ from the substitution line $x + 2(3x - 5) = 11$, which becomes $7x = 21$; it still has to be divided by 7 and used to build $4x + y$.` },
      ],
      answer: 'D',
      workingMd: md`Add the equations: $(x + 3x) + (2y - y) = 11 + 5$, so $4x + y = 16$. Check by solving: from the second equation $y = 3x - 5$, so $x + 6x - 10 = 11$, $x = 3$ and $y = 4$; then $4x + y = 12 + 4 = 16$.`,
      lesson: 'Compare the target with the sum and difference of the equations before you solve for each variable.',
    },
  ],
  takeaways: [
    'Do the same thing to the whole of both sides, and multiply or divide only by non-zero numbers.',
    'Substitution suits a variable with coefficient 1; elimination suits coefficients that are easy multiples.',
    md`Look for the target combination, such as $x + y$, by adding or subtracting the equations first.`,
    'Two equations fix two unknowns only when neither is a multiple of the other.',
    'Check a solution in the original equations, not in your working.',
  ],
  practice: { examKey: 'gre', domain: 'quant-algebra', skill: 'alg-simultaneous-equations' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
