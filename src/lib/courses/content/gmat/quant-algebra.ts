import { md, type Lesson, type Unit } from '../../types';

/** GMAT Quantitative Reasoning: the algebra lessons (docs/COURSE-AUTHORING.md, the plan). */

const linearEquationsAndSystems: Lesson = {
  slug: 'linear-equations-and-systems',
  title: 'Linear equations and systems',
  summary: 'Solve one- and two-variable linear equations by hand, combine equations to reach the asked quantity directly, and spot systems with no unique solution.',
  minutes: 20,
  objectives: [
    'Solve a linear equation in one variable without slips in sign or order.',
    'Solve a two-variable system by elimination or substitution, choosing the faster route.',
    'Reach a combination such as $x + y$ or $3x + 4y$ straight from the equations, without solving for each variable.',
    'Tell when two equations give one solution, none or infinitely many.',
  ],
  teachMd: md`
### Why linear algebra is worth fast hands

GMAT Quantitative Reasoning is 21 problem-solving questions in 45 minutes, and you cannot use a calculator in that section. Linear equations appear on their own and inside nearly every word problem, so the gain is not in knowing how to solve them (you do) but in solving them in a few lines, with no sign slips, and in noticing when the question lets you skip most of the work.

### One variable: undo in reverse order

An equation stays true if you do the same thing to both sides. To isolate $x$, undo what was done to it in reverse order: first remove what was added, then what was multiplied.

$$\frac{3x - 4}{5} = 7 \;\Rightarrow\; 3x - 4 = 35 \;\Rightarrow\; 3x = 39 \;\Rightarrow\; x = 13$$

Clear fractions early by multiplying both sides by a common denominator, and expand brackets before collecting terms. When the variable appears on both sides, gather it on the side where its coefficient stays positive; fewer negative signs means fewer slips.

### Two variables: elimination or substitution

A single equation in two unknowns, such as $2x + 3y = 12$, has infinitely many solutions: every point of a line. A second, independent equation pins down one point.

- **Elimination.** Scale one or both equations so that one variable has opposite coefficients, then add. It is usually fastest when coefficients are already matched or are small multiples of each other.
- **Substitution.** Solve one equation for a variable and put the expression into the other. It is fastest when one variable already has coefficient 1, as in $x - y = 6$.

Whichever you use, check the pair in the equation you did **not** use last. That costs ten seconds and catches most arithmetic errors.

### Aim at the quantity asked for

Many questions ask for a combination, not for $x$ and $y$ separately. Before solving, look at what adding or subtracting the equations produces.

If $4a + 7b = 30$ and $7a + 4b = 36$, adding gives $11a + 11b = 66$, so $a + b = 6$ in one line. Subtracting the first from the second gives $3a - 3b = 6$, so $a - b = 2$. If the question wanted $a + b$, you are already done; solving fully would have taken three times as long.

The habit is simple: read the last line of the question first, then ask whether some sum, difference or multiple of the given equations is that quantity, or a multiple of it.

### How many solutions?

Two linear equations in two unknowns behave like two lines:

| Situation | Lines | Solutions |
| --- | --- | --- |
| Coefficients not in proportion | cross once | exactly one |
| Coefficients in proportion, constants not | parallel | none |
| Everything in proportion | the same line | infinitely many |

So $3x - 4y = 5$ and $6x - 8y = 7$ have no solution: the left sides are in ratio $1:2$, but the right sides are not. And $x + 2y = 4$ with $3x + 6y = 12$ is really one equation written twice. Two equations do not always mean one answer; that idea returns in data sufficiency.

### Words into equations

Most linear questions arrive as a story. Name each unknown with a letter that reminds you what it counts ($a$ for adult tickets, $c$ for child tickets), write one equation per fact, and check the units: a count equation adds counts, a money equation adds price times count. When the story has two kinds of thing, a total number and a total value, it is a two-variable system; substituting the count equation into the value equation is usually quickest.
`,
  examples: [
    {
      id: 'example-elimination',
      title: 'Elimination when the coefficients already match',
      problemMd: md`If $3x + 2y = 23$ and $5x - 2y = 17$, what is the value of $x - y$?`,
      steps: [
        md`The $y$ coefficients are $+2$ and $-2$, so adding the equations removes $y$ at once: $8x = 40$, and $x = 5$.`,
        md`Substitute into the first equation: $15 + 2y = 23$, so $2y = 8$ and $y = 4$.`,
        md`Check in the equation not used last: $5(5) - 2(4) = 25 - 8 = 17$. Correct.`,
        md`The question asks for $x - y = 5 - 4 = 1$.`,
      ],
      answerMd: md`$x - y = 1$. Stopping at $x = 5$ and choosing it is the common slip: read the last line again before you answer.`,
    },
    {
      id: 'example-combination',
      title: 'Going straight to $a + b$',
      problemMd: md`If $4a + 7b = 30$ and $7a + 4b = 36$, what is $a + b$?`,
      steps: [
        md`The coefficients are swapped between the equations, a sign that adding them will give equal coefficients.`,
        md`Add: $11a + 11b = 66$. Divide by 11: $a + b = 6$.`,
        md`Second route, as a check: subtracting gives $3a - 3b = 6$, so $a - b = 2$. With $a + b = 6$ this gives $a = 4$, $b = 2$, and indeed $4(4) + 7(2) = 30$ and $7(4) + 4(2) = 36$.`,
      ],
      answerMd: md`$a + b = 6$, found in one line. Solving for $a$ and $b$ separately also works but takes longer.`,
    },
    {
      id: 'example-cafe-drinks',
      title: 'A count equation and a value equation',
      problemMd: md`A café sold 40 drinks, all coffees at $\$3$ each or teas at $\$2$ each, for a total of $\$104$. How many coffees did it sell?`,
      steps: [
        md`Let $c$ be coffees and $t$ teas. Count: $c + t = 40$. Value: $3c + 2t = 104$.`,
        md`Substitute $t = 40 - c$: $3c + 80 - 2c = 104$, so $c = 24$ and $t = 16$.`,
        md`Check the value: $3(24) + 2(16) = 72 + 32 = 104$. Correct.`,
        md`Quick second route: if all 40 were teas the total would be $\$80$; each coffee instead of a tea adds $\$1$, and $104 - 80 = 24$ coffees.`,
      ],
      answerMd: md`24 coffees. Answering 16 means you solved for the teas.`,
    },
  ],
  traps: [
    {
      title: 'Solving for everything when a combination was asked',
      md: md`If the question asks for $x + y$, $2x - y$ or similar, test whether adding, subtracting or scaling the given equations produces it. Solving for each variable is never wrong, but it costs time and gives more chances for an arithmetic slip.`,
    },
    {
      title: 'Subtracting an equation but not every term',
      md: md`When you subtract $(x - y = 6)$ from another equation, the $-y$ becomes $+y$. Write the subtraction in brackets, $(2x + 5y) - (x - y)$, and expand it before simplifying.`,
    },
    {
      title: 'Assuming two equations always give one answer',
      md: md`Two equations whose coefficients are in proportion describe parallel lines (no solution) or the same line (infinitely many). Before solving, glance at the ratios of the coefficients.`,
    },
    {
      title: 'Answering with the wrong variable',
      md: md`Word problems define two unknowns and ask for one. After solving, reread the question and label your result ("24 coffees") before you match it to a choice.`,
    },
  ],
  check: [
    {
      id: 'check-combination-3x-4y',
      title: 'Combine, do not solve',
      topic: 'Problem Solving: algebra',
      stemMd: md`If $2x + 5y = 26$ and $x - y = 6$, what is the value of $3x + 4y$?`,
      options: [
        { id: 'A', text: md`20`, note: md`This is $x + 6y$, what you get by subtracting the second equation from the first instead of adding them.` },
        { id: 'B', text: md`24`, note: md`This is $3x$ alone with $x = 8$; the $4y$ term was left out.` },
        { id: 'C', text: md`26`, note: md`This is the value of the first equation, $2x + 5y$, not the expression asked for.` },
        { id: 'D', text: md`32`, note: '' },
        { id: 'E', text: md`38`, note: md`This is $3y + 4x$: the values $x = 8$ and $y = 2$ were swapped when substituting.` },
      ],
      answer: 'D',
      workingMd: md`Adding the two equations gives $(2x + 5y) + (x - y) = 3x + 4y = 26 + 6 = 32$. Check by solving: $x = y + 6$, so $2y + 12 + 5y = 26$, $y = 2$ and $x = 8$; then $3(8) + 4(2) = 24 + 8 = 32$.`,
      lesson: 'Read what is asked, then look for a sum or difference of the equations that produces it.',
    },
    {
      id: 'check-no-solution-k',
      title: 'When does the system fail?',
      topic: 'Problem Solving: algebra',
      stemMd: md`For which value of $k$ does the system $3x - ky = 5$ and $6x - 8y = 7$ have no solution?`,
      options: [
        { id: 'A', text: md`$-4$`, note: md`With $k = -4$ the first equation is $3x + 4y = 5$, whose coefficients are not in proportion with $6x - 8y$; the lines cross once.` },
        { id: 'B', text: md`$4$`, note: '' },
        { id: 'C', text: md`$8$`, note: md`This copies the $y$ coefficient of the second equation without scaling it; $3x - 8y = 5$ and $6x - 8y = 7$ still meet at one point.` },
        { id: 'D', text: md`$16$`, note: md`This scales the wrong way: the second equation is double the first, so $k$ is half of 8, not double it.` },
        { id: 'E', text: md`No value of $k$`, note: md`A system fails exactly when the lines are parallel and distinct, and one value of $k$ makes them so.` },
      ],
      answer: 'B',
      workingMd: md`No solution means the coefficients are in proportion but the constants are not. The $x$ coefficients are in ratio $3:6 = 1:2$, so the $y$ coefficients need $-k : -8 = 1:2$, giving $k = 4$. Then doubling the first equation gives $6x - 8y = 10$, which cannot also equal 7: parallel, distinct lines. Any other $k$ gives lines that cross once.`,
      lesson: 'Proportional coefficients with non-proportional constants mean parallel lines and no solution.',
    },
    {
      id: 'check-theatre-tickets',
      title: 'Adult and child tickets',
      topic: 'Problem Solving: algebra',
      stemMd: md`A theatre sold 180 tickets. Adult tickets cost $\$12$ and child tickets $\$7$, and ticket sales totalled $\$1{,}810$. How many adult tickets were sold?`,
      options: [
        { id: 'A', text: md`50`, note: md`This comes from substituting $c = 180 - a$ but multiplying only the 180 by 7: $12a + 1260 - a = 1810$.` },
        { id: 'B', text: md`70`, note: md`This is the number of child tickets, or the result of attaching \$12 to child tickets and \$7 to adults.` },
        { id: 'C', text: md`90`, note: md`This assumes half the tickets were adult tickets; at that split sales would be \$1,710, not \$1,810.` },
        { id: 'D', text: md`110`, note: '' },
        { id: 'E', text: md`150`, note: md`This divides \$1,810 by \$12 (about 150.8) and rounds down, as if every ticket were an adult ticket, ignoring the child tickets.` },
      ],
      answer: 'D',
      workingMd: md`Let $a$ be adult and $c$ child tickets: $a + c = 180$ and $12a + 7c = 1810$. Substitute $c = 180 - a$: $12a + 1260 - 7a = 1810$, so $5a = 550$ and $a = 110$, $c = 70$. Check: $12(110) + 7(70) = 1320 + 490 = 1810$. Second route: if all 180 were child tickets, sales would be $\$1{,}260$; each adult ticket adds $\$5$, and $\frac{550}{5} = 110$.`,
      lesson: 'In a count-and-value problem, substitute the count equation into the value equation, then label the result.',
    },
  ],
  takeaways: [
    'Undo operations in reverse order, and clear fractions early.',
    'Use elimination when coefficients match, substitution when a variable has coefficient 1.',
    'Before solving a system, check whether adding or subtracting the equations gives the asked quantity directly.',
    'Proportional coefficients mean no solution or infinitely many, never exactly one.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-elementary-algebra' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const quadraticsAndExponents: Lesson = {
  slug: 'quadratics-and-exponents',
  title: 'Quadratics and exponents',
  summary: 'Factorise quadratics, use the three special products, and apply the exponent rules to solve equations with powers quickly and without a calculator.',
  minutes: 22,
  objectives: [
    'Solve a quadratic by factorising, and use the sum and product of its roots.',
    'Recognise and use the special products $(a+b)^2$, $(a-b)^2$ and $a^2 - b^2$.',
    'Apply the exponent rules, including zero, negative and fractional exponents.',
    'Solve equations with powers by matching bases or factoring out a common power.',
  ],
  teachMd: md`
### Quadratics: get to zero, then factorise

A quadratic equation has a squared term. The reliable method is to move everything to one side so it equals zero, then factorise:

$$x^2 - 3x = 28 \;\Rightarrow\; x^2 - 3x - 28 = 0 \;\Rightarrow\; (x - 7)(x + 4) = 0$$

A product is zero only when one of its factors is zero, so $x = 7$ or $x = -4$. That zero-product rule is why you must reach zero first: $(x - 7)(x + 4) = 10$ tells you nothing about either factor on its own.

To factorise $x^2 + bx + c$, look for two numbers that **multiply to $c$** and **add to $b$**. For $x^2 - 3x - 28$ you want a product of $-28$ and a sum of $-3$: that is $-7$ and $4$. When the leading coefficient is not 1, divide it out if you can, or test factor pairs.

### Sum and product of the roots

For $x^2 + bx + c = 0$, the two roots add to $-b$ and multiply to $c$. With $x^2 - 3x - 28 = 0$ the roots add to 3 and multiply to $-28$, which matches $7 + (-4)$ and $7 \times (-4)$. Questions that ask for the sum or product of the solutions can be answered without finding them.

### Never divide by a variable

From $x^2 = 5x$ it is tempting to divide by $x$ and write $x = 5$. That loses a solution, because $x$ might be zero. Instead write $x^2 - 5x = 0$, factorise as $x(x - 5) = 0$, and keep both $x = 0$ and $x = 5$.

### Three special products

These come up constantly, in both directions:

| Product | Expanded |
| --- | --- |
| $(a + b)^2$ | $a^2 + 2ab + b^2$ |
| $(a - b)^2$ | $a^2 - 2ab + b^2$ |
| $(a + b)(a - b)$ | $a^2 - b^2$ |

The middle term $2ab$ is the one people drop. Used backwards, the difference of squares turns arithmetic into a shortcut: $51 \times 49 = (50 + 1)(50 - 1) = 2500 - 1 = 2499$. The squares also connect sums and products: $a^2 + b^2 = (a + b)^2 - 2ab$.

### Exponent rules

| Rule | Example |
| --- | --- |
| $a^m \cdot a^n = a^{m+n}$ | $2^3 \cdot 2^4 = 2^7$ |
| $\frac{a^m}{a^n} = a^{m-n}$ | $\frac{5^6}{5^2} = 5^4$ |
| $(a^m)^n = a^{mn}$ | $(3^2)^3 = 3^6$ |
| $(ab)^n = a^n b^n$ | $6^3 = 2^3 \cdot 3^3$ |
| $a^0 = 1$ for $a \neq 0$ | $7^0 = 1$ |
| $a^{-n} = \frac{1}{a^n}$ | $2^{-3} = \frac{1}{8}$ |
| $a^{1/n} = \sqrt[n]{a}$ | $27^{1/3} = 3$ |

The rules work only for the **same base** (to multiply) or the **same exponent** (to combine bases). There is no rule for $a^m + a^n$: you cannot add exponents across a plus sign.

### Equations with powers

When both sides can be written as powers of one base, set the exponents equal. Rewrite 4, 8, 16 and 32 as powers of 2, and 9, 27 and 81 as powers of 3:

$$4^{x} = 8^{x-1} \;\Rightarrow\; 2^{2x} = 2^{3x - 3} \;\Rightarrow\; 2x = 3x - 3 \;\Rightarrow\; x = 3$$

When powers of the same base are **added or subtracted**, factor out the smallest one: $3^{x+2} - 3^{x} = 3^{x}(3^2 - 1) = 8 \cdot 3^{x}$. That turns a sum you cannot simplify into a product you can.

### Signs and even powers

An even power is never negative, and it hides the sign: $(-3)^2 = 3^2 = 9$. So $x^2 = 9$ has two solutions, $3$ and $-3$, while $x^3 = -27$ has one, $-3$. The symbol $\sqrt{9}$ means the non-negative root, 3, which is why $\sqrt{x^2} = |x|$ rather than $x$.
`,
  examples: [
    {
      id: 'example-factorise',
      title: 'Factorising after moving everything to one side',
      problemMd: md`If $x^2 - 3x = 28$, what are the possible values of $x$, and what is their sum?`,
      steps: [
        md`Reach zero first: $x^2 - 3x - 28 = 0$.`,
        md`Find two numbers with product $-28$ and sum $-3$: these are $-7$ and $4$, so $(x - 7)(x + 4) = 0$.`,
        md`Zero-product rule: $x = 7$ or $x = -4$. Check: $49 - 21 = 28$ and $16 + 12 = 28$.`,
        md`Sum of the roots: $7 + (-4) = 3$, which matches $-b$ for $b = -3$.`,
      ],
      answerMd: md`$x = 7$ or $x = -4$, with sum 3. Writing $x(x - 3) = 28$ and setting $x = 28$ or $x - 3 = 28$ is the classic error: the product is not zero.`,
    },
    {
      id: 'example-common-power',
      title: 'Factoring out the smallest power',
      problemMd: md`If $3^{x+2} - 3^{x} = 216$, what is $x$?`,
      steps: [
        md`The two terms share the factor $3^{x}$. Factor it out: $3^{x}(3^2 - 1) = 3^{x} \cdot 8$.`,
        md`So $8 \cdot 3^{x} = 216$, and $3^{x} = 27 = 3^3$.`,
        md`Same base, so the exponents match: $x = 3$.`,
        md`Check: $3^5 - 3^3 = 243 - 27 = 216$. Correct.`,
      ],
      answerMd: md`$x = 3$. Subtracting the exponents, as if $3^{x+2} - 3^{x}$ were $3^2$, gives 9, which is not 216 and leads nowhere.`,
    },
    {
      id: 'example-sum-of-squares',
      title: 'From a sum and a product to a sum of squares',
      problemMd: md`If $a + b = 7$ and $ab = 10$, what is $a^2 + b^2$?`,
      steps: [
        md`Use the special product: $(a + b)^2 = a^2 + 2ab + b^2$, so $a^2 + b^2 = (a + b)^2 - 2ab$.`,
        md`Substitute: $49 - 2(10) = 29$.`,
        md`Check with actual numbers: $a$ and $b$ are 5 and 2 (they add to 7 and multiply to 10), and $25 + 4 = 29$.`,
      ],
      answerMd: md`$a^2 + b^2 = 29$. Squaring the sum and stopping gives 49, which forgets the $2ab$ term.`,
    },
  ],
  traps: [
    {
      title: 'Dividing both sides by a variable',
      md: md`From $x^2 = 5x$, dividing by $x$ silently assumes $x \neq 0$ and loses the solution $x = 0$. Move everything to one side and factorise instead.`,
    },
    {
      title: 'Dropping the middle term',
      md: md`$(a + b)^2$ is not $a^2 + b^2$; the cross term $2ab$ is there whenever both $a$ and $b$ are non-zero. Test with numbers if unsure: $(2 + 3)^2 = 25$, but $4 + 9 = 13$.`,
    },
    {
      title: 'Combining powers across a plus sign',
      md: md`$2^5 + 2^5$ is $2 \cdot 2^5 = 2^6$, not $2^{10}$ and not $4^5$. Exponents add only when powers of the same base are **multiplied**. With a sum, factor out the common power.`,
    },
    {
      title: 'Forgetting the negative root',
      md: md`$x^2 = 16$ gives $x = 4$ or $x = -4$. If the question adds a condition such as $x < 0$, it is telling you which root to keep; if it does not, both may matter.`,
    },
  ],
  check: [
    {
      id: 'check-same-base',
      title: 'Matching bases',
      topic: 'Problem Solving: algebra',
      stemMd: md`If $2^{x} \cdot 4^{x+1} = 2048$, what is the value of $x$?`,
      options: [
        { id: 'A', text: md`$\frac{8}{3}$`, note: md`This multiplies the bases to get $8^{x+1}$; bases multiply only when the exponents are equal.` },
        { id: 'B', text: md`$3$`, note: '' },
        { id: 'C', text: md`$\frac{10}{3}$`, note: md`This writes $4^{x+1}$ as $2^{2x+1}$, doubling only the $x$ and not the 1.` },
        { id: 'D', text: md`$\frac{11}{3}$`, note: md`This drops the $+1$ in the exponent entirely, solving $3x = 11$.` },
        { id: 'E', text: md`$5$`, note: md`This treats $4^{x+1}$ as if it were $2^{x+1}$, so the exponents add to $2x + 1$.` },
      ],
      answer: 'B',
      workingMd: md`Write everything in base 2: $4^{x+1} = 2^{2x+2}$ and $2048 = 2^{11}$. Then $2^{x} \cdot 2^{2x+2} = 2^{3x+2} = 2^{11}$, so $3x + 2 = 11$ and $x = 3$. Check: $2^3 \cdot 4^4 = 8 \times 256 = 2048$.`,
      lesson: 'Rewrite every term in one base before you compare exponents.',
    },
    {
      id: 'check-positive-root',
      title: 'Keep the root the question allows',
      topic: 'Problem Solving: algebra',
      stemMd: md`If $x^2 - 2x - 15 = 0$ and $x > 0$, what is the value of $x^2 + 2x$?`,
      options: [
        { id: 'A', text: md`3`, note: md`This uses the root $x = -3$, which the condition $x > 0$ rules out: $9 - 6 = 3$.` },
        { id: 'B', text: md`5`, note: md`This is the value of $x$, not of $x^2 + 2x$.` },
        { id: 'C', text: md`15`, note: md`This treats $x^2 + 2x$ as equal to $x^2 - 2x$, which is 15; the signs of the $2x$ terms differ.` },
        { id: 'D', text: md`25`, note: md`This is $x^2$ alone; the $2x$ term was left out.` },
        { id: 'E', text: md`35`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Factorise: $(x - 5)(x + 3) = 0$, so $x = 5$ or $x = -3$; the condition keeps $x = 5$. Then $x^2 + 2x = 25 + 10 = 35$. Second route: $x^2 + 2x = (x^2 - 2x) + 4x = 15 + 20 = 35$.`,
      lesson: 'Find the roots, apply the stated condition, then evaluate exactly what is asked.',
    },
    {
      id: 'check-x-minus-reciprocal',
      title: 'Squaring a difference',
      topic: 'Problem Solving: algebra',
      stemMd: md`If $x - \frac{1}{x} = 3$, what is the value of $x^2 + \frac{1}{x^2}$?`,
      options: [
        { id: 'A', text: md`6`, note: md`This doubles 3 instead of squaring it.` },
        { id: 'B', text: md`7`, note: md`This subtracts 2 from 9; the cross term is $-2$ inside the square, so it must be added back.` },
        { id: 'C', text: md`9`, note: md`This squares both sides but drops the cross term $-2 \cdot x \cdot \frac{1}{x}$.` },
        { id: 'D', text: md`11`, note: '' },
        { id: 'E', text: md`13`, note: md`This adds 4 to 9, taking the cross term as $2 \times 2$; but $x \cdot \frac{1}{x} = 1$, so the cross term is 2.` },
      ],
      answer: 'D',
      workingMd: md`Square both sides: $\left(x - \frac{1}{x}\right)^2 = x^2 - 2 \cdot x \cdot \frac{1}{x} + \frac{1}{x^2} = x^2 - 2 + \frac{1}{x^2} = 9$. So $x^2 + \frac{1}{x^2} = 9 + 2 = 11$.`,
      lesson: 'When a sum or difference is given and a sum of squares is asked, square what you are given and handle the cross term.',
    },
  ],
  takeaways: [
    'Move everything to one side before factorising; only a product equal to zero splits into cases.',
    'For $x^2 + bx + c = 0$, the roots add to $-b$ and multiply to $c$.',
    md`$(a \pm b)^2$ has a middle term $\pm 2ab$; $a^2 - b^2 = (a + b)(a - b)$.`,
    'Exponents add only when the same base is multiplied; with a sum of powers, factor out the smallest.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-elementary-algebra' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const inequalitiesAndAbsoluteValue: Lesson = {
  slug: 'inequalities-and-absolute-value',
  title: 'Inequalities and absolute value',
  summary: 'Solve linear inequalities without losing the direction, read absolute value as distance, and find the range of a sum, difference or product.',
  minutes: 22,
  objectives: [
    'Solve linear and compound inequalities, flipping the sign only when you must.',
    'Turn $|x - a| < b$ and $|x - a| > b$ into intervals, and count the integers in them.',
    'Solve absolute value equations by cases and reject false solutions.',
    'Find the possible range of $x + y$, $x - y$ or $xy$ from ranges of $x$ and $y$.',
  ],
  teachMd: md`
### Inequalities work like equations, with one exception

You may add or subtract any number on both sides of an inequality, and multiply or divide by any **positive** number, and the direction stays the same. Multiplying or dividing by a **negative** number reverses it:

$$-3x + 7 > 19 \;\Rightarrow\; -3x > 12 \;\Rightarrow\; x < -4$$

Check the result with one number: $x = -5$ gives $15 + 7 = 22 > 19$, as it should.

The exception has a consequence that catches many people: **you cannot multiply or divide by a variable whose sign you do not know.** From $\frac{1}{x} < 2$ you cannot conclude $1 < 2x$, because if $x$ is negative the direction flips. Instead, split into cases ($x > 0$ and $x < 0$) or test numbers.

Two other operations need the same care. Squaring both sides is safe only when both sides are non-negative ($-3 < 2$, but $9 > 4$). Taking reciprocals of two numbers with the same sign reverses the direction ($2 < 5$, but $\frac{1}{2} > \frac{1}{5}$).

### Compound inequalities

A statement such as $-1 < 2x + 3 \le 11$ is two inequalities at once. Do the same thing to all three parts: subtract 3 to get $-4 < 2x \le 8$, then divide by 2 to get $-2 < x \le 4$. Keep track of which ends are strict ($<$) and which include the endpoint ($\le$); that matters the moment the question counts integers.

### Absolute value is distance

$|x|$ is the distance of $x$ from 0 on the number line, so it is never negative. More usefully, $|x - a|$ is the distance between $x$ and $a$. That turns absolute value statements into pictures:

| Statement | Meaning | Solution |
| --- | --- | --- |
| $\lvert x - a \rvert = b$ | $x$ is exactly $b$ from $a$ | $x = a - b$ or $x = a + b$ |
| $\lvert x - a \rvert < b$ | $x$ is less than $b$ from $a$ | $a - b < x < a + b$ |
| $\lvert x - a \rvert > b$ | $x$ is more than $b$ from $a$ | $x < a - b$ or $x > a + b$ |

So $|x - 2| > 5$ means $x$ lies more than 5 away from 2: $x < -3$ or $x > 7$. Notice the word **or**: two separate rays, never one interval. A "less than" statement gives one interval in the middle; a "greater than" statement gives the two outside pieces.

For $|x + 3|$, rewrite it as $|x - (-3)|$: the centre is $-3$, not 3.

### Absolute value equations: cases, then check

When the expression inside is not simply $x - a$, solve by cases. For $|E| = k$, write $E = k$ or $E = -k$ and solve each. If the right-hand side contains the variable, as in $|x + 3| = 2x$, a case can produce a value that does not satisfy the original equation, since an absolute value can never equal a negative number. **Substitute every candidate back** and discard the false ones.

### Counting integers in an interval

From $-\frac{7}{3} < x < 5$, the integers are $-2, -1, 0, 1, 2, 3, 4$: seven of them. Two habits prevent off-by-one errors. Convert awkward endpoints to decimals ($-\frac{7}{3} \approx -2.33$, so $-2$ is the first integer above it). And check each end separately for whether it is included: a strict $< 5$ excludes 5.

### Ranges of combinations

If you know a range for $a$ and a range for $b$, you can bound combinations:

- **Sum:** add the lower ends and add the upper ends.
- **Difference $a - b$:** the largest value is the top of $a$ minus the bottom of $b$; the smallest is the bottom of $a$ minus the top of $b$.
- **Product:** check all four products of the endpoints. Because of signs, the largest product can come from two negatives rather than two positives.

These questions reward a quick table of corner values rather than intuition.
`,
  examples: [
    {
      id: 'example-flip-direction',
      title: 'Dividing by a negative',
      problemMd: md`Solve $-3x + 7 > 19$.`,
      steps: [
        md`Subtract 7 from both sides: $-3x > 12$.`,
        md`Divide by $-3$. Dividing by a negative reverses the inequality: $x < -4$.`,
        md`Test a value: $x = -5$ gives $15 + 7 = 22 > 19$, true. Test $x = 0$ (not in the solution): $7 > 19$, false. The direction is right.`,
      ],
      answerMd: md`$x < -4$. Keeping the original direction gives $x > -4$, which fails the test at $x = 0$.`,
    },
    {
      id: 'example-abs-interval',
      title: 'An absolute value inequality and its integers',
      problemMd: md`How many integers $x$ satisfy $|2x - 5| \le 9$?`,
      steps: [
        md`"Distance at most 9" means $-9 \le 2x - 5 \le 9$.`,
        md`Add 5 to all three parts: $-4 \le 2x \le 14$. Divide by 2: $-2 \le x \le 7$.`,
        md`Both ends are included. The integers from $-2$ to $7$ are $7 - (-2) + 1 = 10$ in number.`,
      ],
      answerMd: md`10 integers. Subtracting the endpoints without adding 1 gives 9, the most common slip.`,
    },
    {
      id: 'example-abs-cases',
      title: 'Cases, then reject a false solution',
      problemMd: md`Solve $|x + 3| = 2x$.`,
      steps: [
        md`Case 1, $x + 3 = 2x$: $x = 3$.`,
        md`Case 2, $x + 3 = -2x$: $3x = -3$, so $x = -1$.`,
        md`Check both. $x = 3$: $|6| = 6$ and $2(3) = 6$, true. $x = -1$: $|2| = 2$ but $2(-1) = -2$, false; an absolute value cannot equal a negative number.`,
      ],
      answerMd: md`Only $x = 3$. Reporting both case results, 3 and $-1$, is the trap.`,
    },
    {
      id: 'example-range-difference',
      title: 'The range of a difference',
      problemMd: md`If $-2 < a < 5$ and $1 < b < 4$, what values can $a - b$ take?`,
      steps: [
        md`$a - b$ is largest when $a$ is as large as possible and $b$ as small as possible: it approaches $5 - 1 = 4$.`,
        md`$a - b$ is smallest when $a$ is as small as possible and $b$ as large as possible: it approaches $-2 - 4 = -6$.`,
        md`All the inequalities are strict, so neither end is reached.`,
      ],
      answerMd: md`$-6 < a - b < 4$. Subtracting the ends in order, $-2 - 1$ and $5 - 4$, gives $-3 < a - b < 1$, which is too narrow.`,
    },
  ],
  traps: [
    {
      title: 'Multiplying by a variable of unknown sign',
      md: md`From $\frac{x}{y} > 1$ you may not conclude $x > y$: with $x = -3$ and $y = -1$, $\frac{x}{y} = 3 > 1$ but $x < y$. Unless you know the sign, split into cases or test numbers.`,
    },
    {
      title: 'Writing "and" where the answer is "or"',
      md: md`$|x - 2| > 5$ is two separate rays, $x < -3$ **or** $x > 7$. Joining them as $-3 > x > 7$ describes no number at all.`,
    },
    {
      title: 'Off-by-one when counting integers',
      md: md`From $a$ to $b$ inclusive there are $b - a + 1$ integers. Then check each end: drop an endpoint that the inequality excludes, and round fractional endpoints inward.`,
    },
    {
      title: 'Reading the range of a product from the ends',
      md: md`With $-4 \le p \le 2$ and $-3 \le q \le 5$, the greatest product is $(-4)(-3) = 12$, not $2 \times 5 = 10$. Check all four corner products.`,
    },
  ],
  check: [
    {
      id: 'check-integers-abs',
      title: 'Counting integers',
      topic: 'Problem Solving: algebra',
      stemMd: md`How many integers $x$ satisfy $|3x - 4| < 11$?`,
      options: [
        { id: 'A', text: md`4`, note: md`This counts only the positive integers 1 to 4, missing 0, $-1$ and $-2$.` },
        { id: 'B', text: md`5`, note: md`This keeps only 0 to 4, as if $x$ had to be non-negative; the left end of the interval is $-\frac{7}{3}$, below $-2$.` },
        { id: 'C', text: md`7`, note: '' },
        { id: 'D', text: md`8`, note: md`This includes 5, but the inequality is strict: at $x = 5$, $|11| = 11$ is not less than 11.` },
        { id: 'E', text: md`9`, note: md`This rounds $-\frac{7}{3}$ outward to include $-3$ and also includes 5; both ends are outside the interval.` },
      ],
      answer: 'C',
      workingMd: md`$-11 < 3x - 4 < 11$ gives $-7 < 3x < 15$, so $-\frac{7}{3} < x < 5$. Since $-\frac{7}{3} \approx -2.33$, the integers are $-2, -1, 0, 1, 2, 3, 4$: seven. Check the edges: $x = -2$ gives $|-10| = 10 < 11$; $x = -3$ gives $13$; $x = 5$ gives $11$, not less than 11.`,
      lesson: 'Write the interval, round fractional ends inward, and check whether each endpoint is included.',
    },
    {
      id: 'check-product-range',
      title: 'Greatest possible product',
      topic: 'Problem Solving: algebra',
      stemMd: md`If $-4 \le p \le 2$ and $-3 \le q \le 5$, what is the greatest possible value of $pq$?`,
      options: [
        { id: 'A', text: md`$-20$`, note: md`This is the least possible product, $(-4)(5)$, not the greatest.` },
        { id: 'B', text: md`$7$`, note: md`This adds the two upper ends, $2 + 5$; the question asks for a product.` },
        { id: 'C', text: md`$10$`, note: md`This multiplies the two upper ends, $2 \times 5$, and misses that two negatives give a larger product.` },
        { id: 'D', text: md`$12$`, note: '' },
        { id: 'E', text: md`$20$`, note: md`This takes $4 \times 5$ and drops the sign: $p = -4$ with $q = 5$ gives $-20$.` },
      ],
      answer: 'D',
      workingMd: md`The extreme products occur at the corners: $(-4)(-3) = 12$, $(-4)(5) = -20$, $(2)(-3) = -6$, $(2)(5) = 10$. The greatest is 12, at $p = -4$ and $q = -3$, both allowed.`,
      lesson: 'For a product, list all four corner products; two negatives can win.',
    },
    {
      id: 'check-abs-greater',
      title: 'More than 5 from 2',
      topic: 'Problem Solving: algebra',
      stemMd: md`Which of the following describes all values of $x$ for which $|x - 2| > 5$?`,
      options: [
        { id: 'A', text: md`$x > 7$`, note: md`This solves only the case $x - 2 > 5$ and drops the case $x - 2 < -5$.` },
        { id: 'B', text: md`$-3 < x < 7$`, note: md`This is the solution of $|x - 2| < 5$, the points within 5 of 2, not beyond it.` },
        { id: 'C', text: md`$x < -3$ or $x > 7$`, note: '' },
        { id: 'D', text: md`$x < -7$ or $x > 3$`, note: md`This uses $-2$ as the centre, which is the solution of $|x + 2| > 5$.` },
        { id: 'E', text: md`$x < -5$ or $x > 5$`, note: md`This ignores the shift by 2 and solves $|x| > 5$.` },
      ],
      answer: 'C',
      workingMd: md`$|x - 2| > 5$ means $x$ is more than 5 from 2: either $x - 2 > 5$, so $x > 7$, or $x - 2 < -5$, so $x < -3$. Check: $x = 8$ gives $6 > 5$; $x = -4$ gives $6 > 5$; $x = 0$ gives $2$, not more than 5.`,
      lesson: 'An absolute value greater than a number gives two outer rays joined by "or".',
    },
  ],
  takeaways: [
    'Multiplying or dividing by a negative reverses an inequality; by an unknown sign, split into cases.',
    md`$|x - a|$ is the distance from $x$ to $a$: "less than" gives one interval, "greater than" two rays.`,
    'Check every case solution of an absolute value equation in the original.',
    'For ranges of sums, differences and products, work from the corner values.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-elementary-algebra' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const functionsSequencesOperations: Lesson = {
  slug: 'functions-sequences-and-custom-operations',
  title: 'Functions, sequences and custom operations',
  summary: 'Evaluate and compose functions, apply operations defined in the question, and work with arithmetic, geometric and recursive sequences.',
  minutes: 22,
  objectives: [
    'Evaluate $f(x)$ for numbers and expressions, and compose two functions in the right order.',
    'Apply a symbol defined in the question exactly as written, including nested uses.',
    'Find terms and sums of arithmetic sequences, and terms of geometric and recursive ones.',
    'Use repeating patterns, such as units digits, to reach far-off terms.',
  ],
  teachMd: md`
### A function is a rule for substitution

$f(x) = 2x^2 - 3$ is an instruction: whatever goes in the brackets replaces every $x$. So $f(3) = 2(9) - 3 = 15$, and $f(a + 1) = 2(a + 1)^2 - 3$. When the input is an expression, **put it in brackets** before you substitute; most errors here come from writing $2a + 1^2$ instead of $2(a + 1)^2$.

Function questions in the problem-solving format usually ask one of four things: evaluate at a number, evaluate at an expression, solve $f(x) = k$ for $x$, or compare $f$ at two inputs. All four are substitution followed by ordinary algebra.

### Composition: inside first

$f(g(x))$ means: apply $g$ first, then apply $f$ to the result. Work from the inside out. With $f(x) = 2x^2 - 3$ and $g(x) = x + 4$:

$$f(g(-1)) = f(3) = 15, \qquad g(f(-1)) = g(-1) = 3$$

The two orders give different answers, which is normal. Composition is not commutative, so read the brackets carefully.

### Custom operations: the question defines the rules

Some questions invent a symbol, for instance "for all numbers $a$ and $b$, let $a \star b = ab - a + b$". The symbol has no meaning beyond that definition. Treat it as a function of two inputs: the first number replaces $a$, the second replaces $b$.

Three habits help:

- **Copy the definition and substitute slowly.** $5 \star 2 = 10 - 5 + 2 = 7$, while $2 \star 5 = 10 - 2 + 5 = 13$. Order matters unless you can show it does not.
- **Nested symbols go inside out**, like composition. In $3 \star (2 \star 5)$, compute $2 \star 5$ first.
- **Questions about properties** ("for which $x$ does $x \star 3 = 3 \star x$?") become equations once you write both sides from the definition.

### Arithmetic sequences

In an arithmetic sequence each term adds the same common difference $d$:

$$a_n = a_1 + (n - 1)d$$

The $(n - 1)$ is the point people miss: from term 1 to term $n$ there are $n - 1$ steps. Two known terms give $d$ directly: if $a_4 = 17$ and $a_{10} = 41$, six steps cover $24$, so $d = 4$.

The sum of the first $n$ terms is the number of terms times the average of the first and last:

$$S_n = \frac{n(a_1 + a_n)}{2}$$

That formula works because the terms pair up from the outside in, each pair adding to $a_1 + a_n$. It also gives sums of runs of consecutive integers: $1 + 2 + \dots + 50 = \frac{50 \times 51}{2} = 1275$.

### Geometric sequences

Each term multiplies by a common ratio $r$: $a_n = a_1 r^{\,n-1}$. A sequence 3, 6, 12, 24, … has $r = 2$, and its 8th term is $3 \cdot 2^7 = 384$. To find $r$ from two terms, divide them: if $a_2 = 6$ and $a_5 = 162$, then $r^3 = 27$ and $r = 3$.

### Recursive definitions

A recursive rule defines each term from the previous one, such as $a_1 = 3$ and $a_{n+1} = 3a_n - 4$. There is usually no shortcut: write the terms one by one ($3, 5, 11, 29, \dots$) and look for a pattern before computing many.

### Patterns that repeat

Units digits of powers repeat in short cycles. The units digits of $7^1, 7^2, 7^3, 7^4$ are $7, 9, 3, 1$, and then the cycle starts again. To find the units digit of $7^{43}$, divide the exponent by the cycle length 4: $43 = 4 \times 10 + 3$, so $7^{43}$ ends like $7^3$, in 3. The same idea, list until it repeats then use the remainder, settles many questions about the 100th term of a repeating pattern.
`,
  examples: [
    {
      id: 'example-composition',
      title: 'Composition in both orders',
      problemMd: md`If $f(x) = 2x^2 - 3$ and $g(x) = x + 4$, find $f(g(-1))$ and $g(f(-1))$.`,
      steps: [
        md`Inside first for $f(g(-1))$: $g(-1) = -1 + 4 = 3$, then $f(3) = 2(9) - 3 = 15$.`,
        md`Inside first for $g(f(-1))$: $f(-1) = 2(1) - 3 = -1$, then $g(-1) = 3$.`,
        md`The results differ because each order applies the rules to different inputs.`,
      ],
      answerMd: md`$f(g(-1)) = 15$ and $g(f(-1)) = 3$. Computing $f(-1)$ and $g(-1)$ and multiplying them ($-1 \times 3 = -3$) is a misreading of composition.`,
    },
    {
      id: 'example-custom-star',
      title: 'A nested custom operation',
      problemMd: md`For all numbers $a$ and $b$, $a \star b = ab - a + b$. What is $3 \star (2 \star 5)$?`,
      steps: [
        md`Innermost first: $2 \star 5 = 2(5) - 2 + 5 = 13$.`,
        md`Then $3 \star 13 = 3(13) - 3 + 13 = 39 - 3 + 13 = 49$.`,
        md`Note that $5 \star 2 = 10 - 5 + 2 = 7$, not 13: the operation is not commutative, so swapping the inner inputs would change the answer.`,
      ],
      answerMd: md`$3 \star (2 \star 5) = 49$. Using $5 \star 2 = 7$ by mistake gives $3 \star 7 = 21 - 3 + 7 = 25$.`,
    },
    {
      id: 'example-arithmetic-sum',
      title: 'Two terms, then a sum',
      problemMd: md`In an arithmetic sequence, the 4th term is 17 and the 10th term is 41. What is the sum of the first 20 terms?`,
      steps: [
        md`From term 4 to term 10 there are 6 steps: $6d = 41 - 17 = 24$, so $d = 4$.`,
        md`Step back three times from the 4th term: $a_1 = 17 - 3(4) = 5$.`,
        md`The 20th term: $a_{20} = 5 + 19(4) = 81$.`,
        md`Sum: $S_{20} = \frac{20(5 + 81)}{2} = 10 \times 86 = 860$. Check $d$ with the 10th term: $5 + 9(4) = 41$.`,
      ],
      answerMd: md`The sum is 860. Using $a_{20} = a_1 + 20d = 85$ instead gives 900, the $n - 1$ slip.`,
    },
    {
      id: 'example-units-digit',
      title: 'A units digit far out',
      problemMd: md`What is the units digit of $7^{43}$?`,
      steps: [
        md`List units digits: $7^1 \to 7$, $7^2 = 49 \to 9$, $7^3 = 343 \to 3$, $7^4 = 2401 \to 1$, then $7^5 \to 7$ again. The cycle has length 4.`,
        md`Divide the exponent by 4: $43 = 4 \times 10 + 3$, remainder 3.`,
        md`Remainder 3 means the same position as $7^3$, whose units digit is 3.`,
      ],
      answerMd: md`The units digit is 3. A remainder of 0 would match $7^4$ (units digit 1), not $7^0$; mixing that up is the usual slip.`,
    },
  ],
  traps: [
    {
      title: 'Substituting an expression without brackets',
      md: md`For $f(x) = x^2 - 2x$, $f(a + 1)$ is $(a + 1)^2 - 2(a + 1)$, not $a^2 + 1 - 2a + 1$. Write the brackets first, then expand.`,
    },
    {
      title: 'Assuming a custom operation is commutative',
      md: md`Most invented operations are not symmetric. $a \star b$ and $b \star a$ must each be computed from the definition; test with numbers before swapping.`,
    },
    {
      title: 'Using $n$ steps instead of $n - 1$',
      md: md`The $n$th term of an arithmetic sequence is $a_1 + (n - 1)d$. Count gaps, not terms: from term 3 to term 8 is 5 steps.`,
    },
    {
      title: 'Forgetting to halve in the sum formula',
      md: md`$S_n = \frac{n(a_1 + a_n)}{2}$: the sum is the number of terms times the average. Without the 2 you have doubled the sum.`,
    },
  ],
  check: [
    {
      id: 'check-f-of-expression',
      title: 'A function of an expression',
      topic: 'Problem Solving: algebra',
      stemMd: md`If $f(x) = x^2 - 2x$, which of the following is equal to $f(a + 1)$?`,
      options: [
        { id: 'A', text: md`$a^2 - 2a - 1$`, note: md`This squares $a + 1$ as $a^2 + 1$, losing the middle term $2a$.` },
        { id: 'B', text: md`$a^2 - 2a + 1$`, note: md`This is $f(a) + 1$: the 1 was added to the output instead of the input.` },
        { id: 'C', text: md`$a^2 - 1$`, note: '' },
        { id: 'D', text: md`$a^2 + 1$`, note: md`This multiplies only the $a$ by $-2$, writing $-2(a + 1)$ as $-2a$, so the $-2$ goes missing.` },
        { id: 'E', text: md`$a^2 + 3$`, note: md`This writes $-2(a + 1)$ as $-2a + 2$, a sign slip on the constant.` },
      ],
      answer: 'C',
      workingMd: md`$f(a + 1) = (a + 1)^2 - 2(a + 1) = a^2 + 2a + 1 - 2a - 2 = a^2 - 1$. Check with $a = 2$: $f(3) = 9 - 6 = 3$, and $2^2 - 1 = 3$.`,
      lesson: 'Bracket the input, substitute it for every $x$, expand, then test with a number.',
    },
    {
      id: 'check-custom-commute',
      title: 'When does the order not matter?',
      topic: 'Problem Solving: algebra',
      stemMd: md`For all numbers $a$ and $b$, $a \oplus b = a^2 - 2b$. If $x \oplus 3 = 3 \oplus x$ and $x \neq 3$, what is the value of $x$?`,
      options: [
        { id: 'A', text: md`$-5$`, note: '' },
        { id: 'B', text: md`$-3$`, note: md`This comes from moving $-2x$ across without changing its sign, giving $x^2 - 2x - 15 = 0$, whose roots are 5 and $-3$.` },
        { id: 'C', text: md`$3$`, note: md`$x = 3$ does satisfy the equation trivially, but the question excludes it.` },
        { id: 'D', text: md`$5$`, note: md`This is the other root of the sign-slipped equation $x^2 - 2x - 15 = 0$; check: $25 - 6 = 19$ but $9 - 10 = -1$.` },
        { id: 'E', text: md`Any value of $x$`, note: md`This assumes the operation is commutative. It is not: $x \oplus 3$ and $3 \oplus x$ are different expressions.` },
      ],
      answer: 'A',
      workingMd: md`From the definition, $x \oplus 3 = x^2 - 6$ and $3 \oplus x = 9 - 2x$. Setting them equal: $x^2 + 2x - 15 = 0$, so $(x + 5)(x - 3) = 0$ and $x = -5$ or $x = 3$. The question excludes 3, so $x = -5$. Check: $25 - 6 = 19$ and $9 + 10 = 19$.`,
      lesson: 'Write both sides from the definition, then solve the ordinary equation that results.',
    },
    {
      id: 'check-arithmetic-sum-10',
      title: 'Sum of the first ten terms',
      topic: 'Problem Solving: algebra',
      stemMd: md`In an arithmetic sequence, the 3rd term is 11 and the 8th term is 31. What is the sum of the first 10 terms?`,
      options: [
        { id: 'A', text: md`170`, note: md`This finds the first term as $11 - 3d = -1$, stepping back three times from the 3rd term instead of twice.` },
        { id: 'B', text: md`210`, note: '' },
        { id: 'C', text: md`230`, note: md`This takes the 10th term as $a_1 + 10d = 43$ instead of $a_1 + 9d = 39$.` },
        { id: 'D', text: md`390`, note: md`This multiplies the number of terms by the last term, $10 \times 39$, instead of by the average term.` },
        { id: 'E', text: md`420`, note: md`This is $10 \times (3 + 39)$: the sum formula without dividing by 2.` },
      ],
      answer: 'B',
      workingMd: md`Five steps from the 3rd to the 8th term: $5d = 20$, so $d = 4$ and $a_1 = 11 - 2(4) = 3$. Then $a_{10} = 3 + 9(4) = 39$ and $S_{10} = \frac{10(3 + 39)}{2} = 210$. Check by listing: $3, 7, 11, 15, 19, 23, 27, 31, 35, 39$, which add to 210.`,
      lesson: 'Count steps between terms, then sum as number of terms times the average of first and last.',
    },
  ],
  takeaways: [
    'Bracket every input before substituting it into a function or a defined operation.',
    'Composition and nested operations go from the inside out, and order matters.',
    md`Arithmetic: $a_n = a_1 + (n - 1)d$ and $S_n = \frac{n(a_1 + a_n)}{2}$.`,
    'For far-off terms of a repeating pattern, find the cycle length and use the remainder.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-applied-arithmetic-algebra' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const estimationAndAnswerChoices: Lesson = {
  slug: 'estimation-and-answer-choices',
  title: 'Estimation and working from the answer choices',
  summary: 'Estimate by hand to the precision the choices need, back-solve from numeric choices, and pick numbers when the choices are expressions.',
  minutes: 20,
  objectives: [
    'Decide from the spread of the choices how precise an estimate must be, and round accordingly.',
    'Back-solve by testing numeric choices, starting from the middle value.',
    'Pick numbers to test algebraic choices, and avoid numbers that make choices coincide.',
  ],
  teachMd: md`
### The choices are information

A problem-solving question is multiple choice, and only one choice is right. That is useful: you need enough work to tell the right choice from the others, and sometimes far less than a full solution. GMAT Quantitative Reasoning gives you 45 minutes for 21 questions without a calculator, so a method that replaces two minutes of arithmetic with thirty seconds of reasoning is worth learning on purpose.

This lesson covers three such methods: estimating, testing the choices, and picking numbers. Each is a real mathematical method, not a guess, and each has a way to go wrong.

### Estimation: let the spread set the precision

Before estimating, look at how far apart the choices are.

- **Choices differ by powers of ten** (0.4, 4, 40, 400): you only need the size of the answer. Round hard.
- **Choices are close** (3.8, 4.0, 4.2): rounding will not separate them. Compute properly, or estimate with care about direction.

Round to numbers that are easy to handle, such as $49.6 \approx 50$, $0.198 \approx 0.2$, $2.47 \approx 2.5$, and keep track of which way each rounding moves the result. If you round one factor up, rounding another down partly cancels it; rounding everything the same way piles up the error.

For powers of ten, write each number in scientific notation and handle the powers separately:

$$\frac{6 \times 10^4 \times 5 \times 10^{-4}}{3 \times 10^{-2}} = \frac{30}{3 \times 10^{-2}} = 10 \times 10^{2} = 1000$$

### Testing the choices (back-solving)

When the question asks for a single number and the choices are numbers, you can put each choice into the conditions of the problem and see which one works. Two habits make it fast:

- **Start with the middle value.** When the choices are in order, a middle choice that comes out too big or too small tells you which direction to move, so you rarely test more than two or three.
- **Test against the original wording**, not against an equation you may have set up wrongly.

Back-solving shines when setting up the equation is harder than checking a value: quadratics with integer answers, age problems, problems with conditions such as "consecutive odd integers".

### Picking numbers

When the choices are expressions in variables, pick simple values for the variables, compute the answer from the story, then evaluate each choice with the same values. The choice that matches is the answer.

Good picks are small, different from each other, and make the arithmetic clean. Avoid 0 and 1, which make many expressions equal (any power of 1 is 1; anything times 0 is 0), and avoid giving two variables the same value. Respect every condition in the stem: if $x$ must be an odd integer, pick 3, not 2.

**Test every choice.** If two choices match your numbers, the pick was unlucky: pick new numbers and test only those two again.

Picking numbers also handles percent and ratio questions with no actual amounts: start from 100 for a percent question, or from a common multiple of the denominators for a fraction question.

### Quick elimination

Even when you plan to compute, a few checks can strike out choices first:

- **Sign:** must the answer be positive?
- **Size:** is it more or less than a value in the stem? A discounted price cannot exceed the original.
- **Type:** must it be an integer, or even, or divisible by 3?
- **Units digit:** the units digit of a product depends only on the units digits of the factors.

### When not to use these methods

If the algebra takes one line, do the algebra. These methods are tools for when the direct route is long or error-prone, not a replacement for it. And an estimate is never safe when two choices sit within the error of your rounding.
`,
  examples: [
    {
      id: 'example-estimate-spread',
      title: 'Estimating when choices differ by powers of ten',
      problemMd: md`Which of the following is closest to $\frac{49.6 \times 0.198}{2.47}$?

0.04, 0.4, 4, 40, 400`,
      steps: [
        md`The choices are a factor of 10 apart, so only the size matters. Round: $49.6 \approx 50$, $0.198 \approx 0.2$, $2.47 \approx 2.5$.`,
        md`Estimate: $\frac{50 \times 0.2}{2.5} = \frac{10}{2.5} = 4$.`,
        md`Direction check: the top was rounded up slightly and the bottom up slightly, so the effects partly cancel. The exact value is about 3.98, comfortably nearest 4.`,
      ],
      answerMd: md`About 4. Losing a decimal place in $0.198$ (treating it as $0.0198$) gives 0.4, a choice placed there for that slip.`,
    },
    {
      id: 'example-back-solve',
      title: 'Back-solving from the middle',
      problemMd: md`The sum of a positive integer and its square is 156. What is the integer?

9, 10, 11, 12, 13`,
      steps: [
        md`Test the middle value, 11: $11 + 121 = 132$. Too small, so the answer is larger; 9 and 10 are out.`,
        md`Test 12: $12 + 144 = 156$. It works.`,
        md`Algebra check: $n^2 + n - 156 = 0$ factorises as $(n + 13)(n - 12) = 0$, and $n$ is positive, so $n = 12$.`,
      ],
      answerMd: md`The integer is 12, found with two tests. 13 is tempting if you notice the factor $(n + 13)$ and forget its root is $-13$.`,
    },
    {
      id: 'example-pick-numbers',
      title: 'Picking numbers for algebraic choices',
      problemMd: md`If $p$ pencils cost $c$ cents, how many pencils can be bought for $d$ dollars?

$\frac{dp}{100c}$, $\frac{100c}{dp}$, $\frac{100dp}{c}$, $\frac{100d}{pc}$, $\frac{cdp}{100}$`,
      steps: [
        md`Pick clean values: $p = 2$ pencils for $c = 10$ cents, and $d = 1$ dollar. Pencils cost 5 cents each, and 1 dollar is 100 cents, so the target is $\frac{100}{5} = 20$ pencils.`,
        md`Evaluate every choice: $\frac{2}{1000}$, $500$, $\frac{200}{10} = 20$, $\frac{100}{20} = 5$, $\frac{20}{100} = 0.2$.`,
        md`Only one choice gives 20, so no second pick is needed.`,
      ],
      answerMd: md`$\frac{100dp}{c}$. The choice $\frac{100d}{pc}$ divides by $p$ where it should multiply; it gives 5, which only happens to equal the price of one pencil in cents.`,
    },
  ],
  traps: [
    {
      title: 'Estimating when the choices are close',
      md: md`If the choices are 3.8, 4.0 and 4.2, rounding each number by a few percent can move you across a boundary. Close choices are a signal to compute exactly.`,
    },
    {
      title: 'Picking 0, 1 or equal values',
      md: md`With $x = 1$, the choices $x$, $x^2$ and $\frac{1}{x}$ all equal 1, so the test cannot tell them apart. Pick small, different values such as 2, 3 and 5.`,
    },
    {
      title: 'Stopping at the first matching choice',
      md: md`When picking numbers, a wrong choice can match by accident. Evaluate every choice; if two match, pick new values and retest those two.`,
    },
    {
      title: 'Picking numbers that break a condition',
      md: md`If the stem says $n$ is odd, or $x > y$, or the result is an integer, your picks must obey that too. A pick that violates the stem can make the right choice look wrong.`,
    },
  ],
  check: [
    {
      id: 'check-powers-of-ten',
      title: 'Closest value',
      topic: 'Problem Solving: approximation and estimation',
      stemMd: md`Which of the following is closest to $\frac{(6.02 \times 10^4)(0.00049)}{3.1 \times 10^{-2}}$?`,
      options: [
        { id: 'A', text: md`9.5`, note: md`This divides by 3.1 and drops the $10^{-2}$ in the denominator, making the result 100 times too small.` },
        { id: 'B', text: md`95`, note: md`This reads $3.1 \times 10^{-2}$ as 0.31, one decimal place off, so the result is 10 times too small.` },
        { id: 'C', text: md`950`, note: '' },
        { id: 'D', text: md`9,500`, note: md`This reads 0.00049 as $4.9 \times 10^{-3}$, one decimal place off, so the result is 10 times too large.` },
        { id: 'E', text: md`95,000`, note: md`This reads 0.00049 as 0.049, two places off, so the result is 100 times too large.` },
      ],
      answer: 'C',
      workingMd: md`Write $0.00049 = 4.9 \times 10^{-4}$. The numerator is $6.02 \times 4.9 \times 10^{0} \approx 29.5$. Dividing by $3.1 \times 10^{-2}$: $\frac{29.5}{3.1} \times 10^{2} \approx 9.5 \times 100 = 950$. Rough check: $\frac{6 \times 10^4 \times 5 \times 10^{-4}}{3 \times 10^{-2}} = \frac{30}{0.03} = 1000$, nearest 950.`,
      lesson: 'Handle the powers of ten separately from the digits; with choices a factor of 10 apart, a rough estimate is enough.',
    },
    {
      id: 'check-pick-travel-time',
      title: 'Minutes for 5 kilometres',
      topic: 'Problem Solving: algebra',
      stemMd: md`A car travels $k$ kilometres in $h$ hours. At the same speed, how many minutes does it take to travel 5 kilometres?`,
      options: [
        { id: 'A', text: md`$\frac{5h}{k}$`, note: md`This is the time in hours; it was never converted to minutes.` },
        { id: 'B', text: md`$\frac{hk}{300}$`, note: md`This multiplies $h$ and $k$ where one should divide by the other; with $k = 30$ and $h = 2$ it gives 0.2.` },
        { id: 'C', text: md`$\frac{300h}{k}$`, note: '' },
        { id: 'D', text: md`$\frac{12k}{h}$`, note: md`This turns the time fraction upside down, dividing the speed $\frac{k}{h}$ by the 5 km instead of the 5 km by the speed, then multiplies by 60; it gives 180 for the test values.` },
        { id: 'E', text: md`$\frac{300k}{h}$`, note: md`This multiplies by the speed instead of dividing by it; it gives 4,500 for the test values.` },
      ],
      answer: 'C',
      workingMd: md`Pick $k = 30$ and $h = 2$: the speed is 15 km per hour, so 5 km takes $\frac{1}{3}$ hour, which is 20 minutes. The choices give $\frac{1}{3}$, $0.2$, $20$, $180$ and $4500$; only $\frac{300h}{k}$ gives 20. Algebra: time $= \frac{5}{k/h} = \frac{5h}{k}$ hours $= \frac{300h}{k}$ minutes. A pick of $k = 10$, $h = 2$ would make $\frac{300h}{k}$ and $\frac{12k}{h}$ both 60, which is why every choice must be tested.`,
      lesson: 'When choices are expressions, pick values, compute the target from the story, and test every choice.',
    },
    {
      id: 'check-consecutive-odds',
      title: 'Consecutive odd integers',
      topic: 'Problem Solving: algebra',
      stemMd: md`The product of two consecutive positive odd integers is 323. What is the larger of the two integers?`,
      options: [
        { id: 'A', text: md`15`, note: md`With 15 as the larger integer the pair is 13 and 15, and $13 \times 15 = 195$, which is too small.` },
        { id: 'B', text: md`17`, note: md`$17 \times 19 = 323$, but 17 is the smaller integer of the pair, not the larger.` },
        { id: 'C', text: md`19`, note: '' },
        { id: 'D', text: md`21`, note: md`$19 \times 21 = 399$, which is too large.` },
        { id: 'E', text: md`23`, note: md`$21 \times 23 = 483$, far too large.` },
      ],
      answer: 'C',
      workingMd: md`Test the middle choice as the larger integer: the pair would be 17 and 19, and $17 \times 19 = 323$. It works. Algebra check: with smaller integer $n$, $n(n + 2) = 323$, so $n^2 + 2n - 323 = 0$, which factorises as $(n + 19)(n - 17) = 0$; $n = 17$, and the larger is 19.`,
      lesson: 'Back-solve from the middle choice, and reread whether the question wants the smaller or the larger value.',
    },
  ],
  takeaways: [
    'Let the spread of the choices decide how precise an estimate needs to be.',
    'Back-solve from the middle numeric choice and move in the direction the result points.',
    'Pick small, distinct numbers that obey the stem, and test every choice.',
    'If the direct algebra is one line, do the algebra.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-approximation-estimation' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const quantAlgebraUnit: Unit = {
  slug: 'quant-algebra',
  title: 'Quantitative Reasoning: algebra',
  summary: 'GMAT Quantitative Reasoning is 21 problem-solving questions in 45 minutes, without a calculator, measuring arithmetic and algebra. This unit covers the algebra: linear equations and systems, quadratics and exponents, inequalities and absolute value, functions, sequences and defined operations, and how to use estimation and the answer choices to save time.',
  lessons: [linearEquationsAndSystems, quadraticsAndExponents, inequalitiesAndAbsoluteValue, functionsSequencesOperations, estimationAndAnswerChoices],
};
