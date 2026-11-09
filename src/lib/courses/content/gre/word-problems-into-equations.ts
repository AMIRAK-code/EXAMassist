import { md, type Lesson } from '../../types';

export const wordProblemsLesson: Lesson = {
  slug: 'word-problems-into-equations',
  title: 'Turning word problems into equations',
  summary: 'Name the unknown precisely, translate the words into an equation phrase by phrase, solve it, and answer the question that was actually asked.',
  minutes: 22,
  objectives: [
    'Define a variable precisely, with its units and the moment it refers to.',
    'Translate phrases such as "less than", "of" and "times as many" into algebra in the right order.',
    'Set up and solve problems about totals and values, ages, and consecutive integers.',
    'Check an answer against the story and confirm it answers the question asked.',
  ],
  teachMd: md`
### Four steps

Almost every algebra word problem yields to the same routine.

1. **Name the unknown.** Write "let $n$ = the number of notebooks bought" rather than just "$n$". Include units and, where it matters, a time: "Sana's age **now**".
2. **Translate.** Turn each sentence of the story into an equation or an expression, phrase by phrase.
3. **Solve** the equation or system.
4. **Answer and check.** Reread the question: is it asking for $n$, or for something built from $n$? Then put the answer back into the story, not into your equation.

Do not skip the fourth step. A problem that asks for the larger of two numbers will usually offer the smaller one as an option, because it is what you find first.

### Translating phrase by phrase

| Words | Algebra |
| --- | --- |
| is, was, will be, equals | $=$ |
| of (with a fraction or percent) | $\times$: "a third of $x$" is $\frac{x}{3}$ |
| 5 more than $x$ | $x + 5$ |
| 5 less than $x$ | $x - 5$ (the order reverses) |
| $x$ less than 5 | $5 - x$ |
| twice as many as $x$ | $2x$ |
| $a$ exceeds $b$ by 4 | $a - b = 4$ |
| the sum of $x$ and $y$, tripled | $3(x + y)$ |

"Less than" is the phrase that catches people. "Nine less than five times a number" starts from five times the number and takes nine away: $5x - 9$. Read it as "five times the number, minus nine".

"Times as many" is the other one. "Ana has three times as many stamps as Ben" gives $A = 3B$: the multiplier goes with the smaller amount. A quick sense check with numbers (if Ben has 10, Ana has 30) confirms the direction.

### Two kinds of quantity: how many and how much

Problems about tickets, coins or items at different prices involve two different totals: the **number** of things and their **value**. Each gives its own equation.

- Number: $a + c = 50$ (adult and child tickets).
- Value: $12a + 7c = 485$ (price times number, added).

Mixing them, for example adding prices to counts, is a common setup error. Write the units next to each equation (tickets, dollars) and check they match on both sides.

### Ages

Age problems compare people at different times. Use one variable for each person's age **now**, then express other times from it: in 8 years, someone aged $n$ is $n + 8$; six years ago, $n - 6$. Shift **every** person by the same number of years. A table with a row for each person and a column for each time keeps this straight.

### Consecutive integers

Call the smallest $n$. Consecutive integers are $n, n + 1, n + 2$; consecutive even or consecutive odd integers are $n, n + 2, n + 4$. Odd integers also go up in steps of 2, not 1. For an odd number of consecutive terms, the sum is the middle term times the number of terms, which gives a quick check: three consecutive odd integers summing to 87 have middle term $\frac{87}{3} = 29$.

### Choose the variable to save work

Let the variable stand for the quantity the question asks for when you can, so the last step of solving is the answer. When the story has two linked unknowns, you can use two variables and a system, or one variable and an expression for the other ($c = 50 - a$). Both work; one variable usually means fewer lines.

### Check against the story

Put the answer back into the words: do the tickets add up to 50, and do the prices add up to \$485? Is an age positive, and a number of people a whole number? An answer that solves your equation but fails the story means the translation, not the algebra, went wrong.

### Units

Convert everything to one unit before you write an equation. A problem that mixes minutes and hours, or cents and dollars, needs one conversion at the start, not a correction at the end.
`,
  examples: [
    {
      id: 'example-tickets',
      title: 'Number and value',
      problemMd: md`A theatre sells adult tickets for \$12 and child tickets for \$7. One evening it sold 50 tickets for a total of \$485. How many adult tickets did it sell?`,
      steps: [
        md`Name the unknowns: let $a$ = the number of adult tickets and $c$ = the number of child tickets.`,
        md`Number equation: $a + c = 50$. Value equation, in dollars: $12a + 7c = 485$.`,
        md`Substitute $c = 50 - a$: $12a + 350 - 7a = 485$, so $5a = 135$ and $a = 27$. Then $c = 23$.`,
        md`Check in the story: $27 + 23 = 50$ tickets, and $12(27) + 7(23) = 324 + 161 = 485$ dollars.`,
      ],
      answerMd: md`27 adult tickets. The number of child tickets, 23, is the value you would give if you lost track of which variable is which.`,
    },
    {
      id: 'example-ages',
      title: 'An age problem with a table',
      problemMd: md`Maya is three times as old as her nephew. In 8 years she will be twice as old as he will be. How old is Maya now?`,
      steps: [
        md`Let $n$ = the nephew's age now. Then Maya is $3n$ now.`,
        md`In 8 years both are 8 years older: the nephew $n + 8$, Maya $3n + 8$.`,
        md`Translate the second sentence: $3n + 8 = 2(n + 8)$, so $3n + 8 = 2n + 16$ and $n = 8$.`,
        md`Maya is $3 \times 8 = 24$. Check: in 8 years she is 32 and he is 16, and 32 is twice 16.`,
      ],
      answerMd: md`Maya is 24. The nephew's age, 8, is the number you solve for first and a likely wrong option. Adding 8 years to Maya only, $3n + 8 = 2n$, gives a negative age, which the story rules out.`,
    },
    {
      id: 'example-consecutive-odd',
      title: 'Consecutive odd integers',
      problemMd: md`The sum of three consecutive odd integers is 87. What is the largest of them?`,
      steps: [
        md`Let $n$ = the smallest. Odd integers go up in steps of 2: $n$, $n + 2$, $n + 4$.`,
        md`$n + (n + 2) + (n + 4) = 87$, so $3n + 6 = 87$ and $n = 27$.`,
        md`The integers are 27, 29 and 31, so the largest is 31.`,
        md`Second route: the middle term is the average, $\frac{87}{3} = 29$, so the integers are 27, 29, 31.`,
      ],
      answerMd: md`31. Stopping at $n = 27$ answers a different question, and using steps of 1 ($3n + 3 = 87$, so $n = 28$) makes the smallest number even, which cannot be right.`,
    },
  ],
  traps: [
    {
      title: 'Reversing "less than"',
      md: md`"7 less than $x$" is $x - 7$, not $7 - x$. The quantity named after "than" is the starting point. Test with a number: 7 less than 10 is 3, which is $10 - 7$.`,
    },
    {
      title: 'Solving for the wrong thing',
      md: md`The variable you solve for is often not what the question asks: the smaller number instead of the larger, the nephew's age instead of Maya's, the pens instead of the notebooks. Reread the last sentence of the question before choosing.`,
    },
    {
      title: 'Shifting only one person in time',
      md: md`In an age problem, "in 5 years" adds 5 to **everyone's** age. A table with one column per moment prevents shifting one person and not the other.`,
    },
    {
      title: 'Steps of 1 for odd or even integers',
      md: md`Consecutive even (or odd) integers differ by 2. Writing $n, n + 1, n + 2$ for them builds an equation whose answer may not even have the right parity.`,
    },
    {
      title: 'Adding unlike quantities',
      md: md`Counts and values, minutes and hours, cents and dollars cannot be added to each other. Label every term with its unit; if two sides of an equation have different units, the setup is wrong.`,
    },
  ],
  check: [
    {
      id: 'check-pens-notebooks',
      title: 'Which item was asked for?',
      topic: 'Algebra',
      stemMd: md`A shop sells pens for \$3 each and notebooks for \$5 each. Lena buys 14 items in all and spends \$54. How many notebooks does she buy?`,
      options: [
        { id: 'A', text: md`$4$`, note: md`Reaches $54 - 42 = 12$ correctly but divides by 3, the pen price, instead of by 2, the difference between the prices.` },
        { id: 'B', text: md`$6$`, note: '' },
        { id: 'C', text: md`$8$`, note: md`This is the number of pens. Swapping the two prices in the value equation also gives 8.` },
        { id: 'D', text: md`$12$`, note: md`This is $2n$ in the equation $42 + 2n = 54$; it still has to be divided by 2.` },
        { id: 'E', text: md`$14$`, note: md`This is the total number of items, pens and notebooks together.` },
      ],
      answer: 'B',
      workingMd: md`Let $n$ = notebooks and $p$ = pens. Then $p + n = 14$ and $3p + 5n = 54$. Substituting $p = 14 - n$: $42 - 3n + 5n = 54$, so $2n = 12$ and $n = 6$, with $p = 8$. Check: $8 + 6 = 14$ items and $3(8) + 5(6) = 24 + 30 = 54$ dollars.`,
      lesson: 'Write one equation for how many and one for how much, then answer for the item the question names.',
    },
    {
      id: 'check-ages-comparison',
      title: 'Six years ago',
      topic: 'Quantitative Comparison',
      stemMd: md`Ravi is 4 years older than Sana. Six years ago, Ravi was twice as old as Sana was then.

| Quantity A | Quantity B |
| --- | --- |
| Sana's age now, in years | $10$ |`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: md`Ravi's age now is 14, which is greater than 10, but Quantity A is Sana's age.` },
        { id: 'B', text: 'Quantity B is greater.', note: md`Sana's age six years ago was 4, which is less than 10, but Quantity A asks for her age now.` },
        { id: 'C', text: 'The two quantities are equal.', note: '' },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: md`The two sentences give two independent equations in two unknowns, which fix both ages.` },
      ],
      answer: 'C',
      workingMd: md`Let $s$ = Sana's age now, so Ravi is $s + 4$. Six years ago they were $s - 6$ and $s - 2$, and $s - 2 = 2(s - 6) = 2s - 12$, so $s = 10$. Check: Ravi is 14; six years ago they were 4 and 8, and 8 is twice 4.`,
      lesson: 'In an age problem, shift every person by the same number of years, then answer for the person and the moment the question names.',
    },
    {
      id: 'check-consecutive-even',
      title: 'Consecutive even integers',
      topic: 'Algebra',
      stemMd: md`The sum of three consecutive even integers is 24 less than 4 times the smallest of the three. What is the smallest of the three integers?`,
      options: [
        { id: 'A', text: md`$18$`, note: md`Moves the 6 across without changing its sign, getting $-n = -18$ from $3n + 6 = 4n - 24$.` },
        { id: 'B', text: md`$27$`, note: md`Uses consecutive integers $n, n + 1, n + 2$, giving $3n + 3 = 4n - 24$; 27 is odd, so it cannot be the smallest of three even integers.` },
        { id: 'C', text: md`$30$`, note: '' },
        { id: 'D', text: md`$32$`, note: md`This is the middle integer, not the smallest.` },
        { id: 'E', text: md`$34$`, note: md`This is the largest integer, not the smallest.` },
      ],
      answer: 'C',
      workingMd: md`Let $n$ be the smallest; the integers are $n$, $n + 2$, $n + 4$. Then $3n + 6 = 4n - 24$, so $n = 30$. Check: $30 + 32 + 34 = 96$ and $4(30) - 24 = 96$.`,
      lesson: md`"24 less than 4 times the smallest" is $4n - 24$; read "less than" as "minus", with the order reversed.`,
    },
  ],
  takeaways: [
    'Name each unknown precisely, with its units and its moment in time.',
    md`"$k$ less than $x$" is $x - k$: the order reverses.`,
    'Write separate equations for how many and how much.',
    'Consecutive even or odd integers go up in steps of 2.',
    'Check the answer in the story, and confirm it is the quantity the question asks for.',
  ],
  practice: { examKey: 'gre', domain: 'quant-algebra', skill: 'alg-word-problem-setup' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
