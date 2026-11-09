import { md, type Lesson } from '../../types';

export const remaindersLesson: Lesson = {
  slug: 'remainders-odd-even-and-sign',
  title: 'Remainders, odd and even, and positive and negative',
  summary: 'Write any remainder as an equation, work out remainders of sums and products, and settle odd, even and sign questions by rule, not by guessing.',
  minutes: 20,
  objectives: [
    'Turn "leaves a remainder of r" into the form $n = dq + r$ and list the numbers that fit.',
    'Find the remainder of a sum, product or power from the remainders of its parts.',
    'Decide whether an expression is odd or even, and positive or negative, from the rules for each operation.',
  ],
  teachMd: md`
### What a remainder really says

Dividing a positive integer $n$ by a positive integer $d$ gives a quotient $q$ and a remainder $r$ with

$$n = dq + r, \qquad 0 \le r < d$$

The condition on $r$ matters: a remainder is never negative and always smaller than the divisor. Dividing by 7 can only leave 0, 1, 2, 3, 4, 5 or 6, and a remainder of 0 means $d$ divides $n$.

The equation is the useful form. "When $n$ is divided by 7 the remainder is 5" becomes $n = 7q + 5$, and you can list the numbers that fit: 5, 12, 19, 26, 33, … Starting from the remainder itself, add the divisor again and again. Notice that the smallest such number is 5, with quotient 0; people often forget it.

### Remainders of sums, products and powers

Remainders can be combined without finding $n$. If $a$ leaves remainder $r$ and $b$ leaves remainder $s$ when divided by $d$, then:

- $a + b$ leaves the same remainder as $r + s$;
- $ab$ leaves the same remainder as $rs$;
- $a^k$ leaves the same remainder as $r^k$.

Each time, reduce at the end: if $r + s$ or $rs$ is $d$ or more, divide it by $d$ again. Why does this work? Write $a = dq + r$. Every term in $a^2 = d^2q^2 + 2dqr + r^2$ except the last is a multiple of $d$, so only $r^2$ affects the remainder.

The units digit of a number is its remainder on division by 10, so the same rule finds units digits of big products and powers. Powers of 3 end in 3, 9, 7, 1 and then repeat; to find the units digit of $3^{50}$, divide 50 by the cycle length 4 (remainder 2), and take the second entry: 9.

### Two conditions at once

When a number must leave one remainder for one divisor and another for a second divisor, list the candidates for the larger divisor and test each against the other condition. Once you find the first number that fits, the rest come every $\operatorname{lcm}$ of the two divisors.

### Odd and even

An integer is even if it is divisible by 2 and odd otherwise. **0 is even**, and negative integers are odd or even too: $-6$ is even, $-3$ is odd.

| Operation | Rule |
| --- | --- |
| sum or difference | even if the two have the same parity; odd if they differ |
| product | even if **at least one** factor is even; odd only if all are odd |
| power $n^k$ ($k \ge 1$) | same parity as $n$ |

Two consequences come up all the time. A product of consecutive integers, such as $n(n+1)$, is always even, because one of any two consecutive integers is even. And if $a + b$ is odd, one of $a$ and $b$ is odd and the other even, so $ab$ is even.

Division has no parity rule: $\frac{12}{2} = 6$ is even while $\frac{6}{2} = 3$ is odd. Work with sums and products instead.

### Positive and negative

The sign of a product depends only on how many negative factors it has: an even number of negatives gives a positive product, an odd number a negative one. Any factor of 0 makes the product 0, which is neither positive nor negative.

So an even power is never negative ($x^2 \ge 0$), and an odd power keeps the sign of its base. Given $xy > 0$, you know $x$ and $y$ have the same sign but not which; given $xy < 0$, they have opposite signs.

### Pick numbers wisely

In a comparison question, variables can be negative, zero or fractions unless the stem says otherwise. Read every restriction ("integer", "positive", "odd"), then test values from each kind the stem allows. A claim that works for 2 and 3 may fail for $-1$ or 0.
`,
  examples: [
    {
      id: 'example-remainder-of-multiple',
      title: 'Remainder of 3n',
      problemMd: md`When the positive integer $n$ is divided by 7, the remainder is 5. What is the remainder when $3n$ is divided by 7?`,
      steps: [
        md`Write the condition as an equation: $n = 7q + 5$.`,
        md`Multiply: $3n = 21q + 15$. The term $21q$ is a multiple of 7, so only 15 matters.`,
        md`Reduce: $15 = 2 \times 7 + 1$, so the remainder is 1.`,
        md`Check with real numbers: $n = 12$ gives $3n = 36 = 5 \times 7 + 1$; $n = 5$ gives $15 = 2 \times 7 + 1$.`,
      ],
      answerMd: md`The remainder is 1. Answering 15 forgets that a remainder must be less than the divisor; answering 5 assumes the remainder is unchanged by multiplying.`,
    },
    {
      id: 'example-two-remainders',
      title: 'Two remainders at once',
      problemMd: md`A positive integer $x$ leaves a remainder of 2 when divided by 5 and a remainder of 3 when divided by 4. How many such integers are less than 100?`,
      steps: [
        md`List numbers that leave remainder 2 on division by 5: 2, 7, 12, 17, 22, 27, …`,
        md`Test each against division by 4: 2 leaves 2, 7 leaves 3. So 7 is the smallest that fits.`,
        md`After 7, the solutions repeat every $\operatorname{lcm}(5, 4) = 20$: 7, 27, 47, 67, 87, and the next, 107, is too big.`,
        md`Check one: $87 = 17 \times 5 + 2$ and $87 = 21 \times 4 + 3$.`,
      ],
      answerMd: md`There are 5 such integers: 7, 27, 47, 67 and 87. Stepping by 5 or by 4 instead of by 20 produces numbers that meet only one condition.`,
    },
    {
      id: 'example-parity',
      title: 'Odd sum, what follows?',
      problemMd: md`$a$ and $b$ are integers and $a + b$ is odd. Is each of $ab$, $a - b$ and $a^2 + b^2$ odd or even?`,
      steps: [
        md`An odd sum means $a$ and $b$ have different parity: one is odd, the other even.`,
        md`$ab$ has an even factor, so it is even.`,
        md`$a - b$ combines an odd and an even number, so it is odd, just like the sum.`,
        md`$a^2$ and $b^2$ keep the parities of $a$ and $b$, so one is odd and one even, and their sum is odd.`,
        md`Check with $a = 2$, $b = 3$: $ab = 6$, $a - b = -1$, $a^2 + b^2 = 13$.`,
      ],
      answerMd: md`$ab$ is even; $a - b$ and $a^2 + b^2$ are odd. The negative value $a - b = -1$ is still odd: parity does not depend on sign.`,
    },
    {
      id: 'example-signs',
      title: 'Chaining sign facts',
      problemMd: md`If $xy < 0$ and $yz > 0$, what is the sign of $xz$?`,
      steps: [
        md`$xy < 0$: $x$ and $y$ have opposite signs.`,
        md`$yz > 0$: $y$ and $z$ have the same sign.`,
        md`So $z$ has the sign of $y$, which is opposite to $x$, and $xz < 0$.`,
        md`A second route: $(xy)(yz) = xy^2z < 0$, and $y^2 > 0$, so $xz < 0$. Numbers agree: $x = 1$, $y = -1$, $z = -2$ gives $xz = -2$.`,
      ],
      answerMd: md`$xz$ is negative. The individual signs are not fixed (both $x = -1$, $y = 1$, $z = 2$ and the example above work), but the sign of $xz$ is.`,
    },
  ],
  traps: [
    {
      title: 'A remainder that is too big',
      md: md`After combining remainders, reduce again. If $a$ and $b$ each leave remainder 6 on division by 7, the remainder of $a + b$ is not 12 but 5. Any answer at least as large as the divisor cannot be a remainder.`,
    },
    {
      title: 'Forgetting the smallest candidate',
      md: md`"Leaves remainder 3 when divided by 8" includes 3 itself (quotient 0). Lists that start at $8 + 3 = 11$ miss it, and "how many less than 50" counts then come out one short.`,
    },
    {
      title: 'Treating 0 as odd or as positive',
      md: md`0 is even, and it is neither positive nor negative. If a stem says "$n$ is a non-negative even integer", 0 is allowed and is often the value that breaks a claim.`,
    },
    {
      title: 'Testing only positive integers',
      md: md`Unless the stem says "positive integer", try a negative and, where allowed, 0 or a fraction. "$x^3 > x$" holds for $x = 2$ but fails for $x = -2$ and for $x = \frac{1}{2}$.`,
    },
  ],
  check: [
    {
      id: 'check-remainder-of-square',
      title: 'Remainder of a square',
      topic: 'Integer properties',
      stemMd: md`When the positive integer $n$ is divided by 9, the remainder is 7. What is the remainder when $n^2$ is divided by 9?`,
      options: [
        { id: 'A', text: md`0`, note: md`This assumes $n^2$ is a multiple of 9 because 9 is a perfect square; nothing about $n$ makes that true.` },
        { id: 'B', text: md`2`, note: md`2 is how far $n$ sits below the next multiple of 9. Squaring that gap leads to the answer, but 2 is not itself the remainder of $n^2$.` },
        { id: 'C', text: md`4`, note: '' },
        { id: 'D', text: md`5`, note: md`This is the remainder of $2n$, from $7 + 7 = 14$, not of $n^2$, from $7 \times 7 = 49$.` },
        { id: 'E', text: md`7`, note: md`This assumes the remainder stays the same after squaring; the remainder of $n^2$ comes from $7^2$.` },
      ],
      answer: 'C',
      workingMd: md`Write $n = 9q + 7$. Only the square of the remainder matters: $7^2 = 49 = 5 \times 9 + 4$, so the remainder is 4. Check with $n = 16$: $256 = 28 \times 9 + 4$. A second route: $n$ is 2 less than a multiple of 9, and $(-2)^2 = 4$.`,
      lesson: 'Combine the remainders, not the numbers, then reduce the result below the divisor.',
    },
    {
      id: 'check-sign-of-z',
      title: 'The sign of z',
      topic: 'Quantitative Comparison',
      stemMd: md`$xyz < 0$ and $xy > 0$.

| Quantity A | Quantity B |
| --- | --- |
| $z$ | 0 |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: md`This reads $xy > 0$ as saying all three numbers are positive; then $xyz$ would be positive too, which contradicts $xyz < 0$.` },
        { id: 'B', text: md`Quantity B is greater.`, note: '' },
        { id: 'C', text: md`The two quantities are equal.`, note: md`If $z$ were 0, the product $xyz$ would be 0, not negative.` },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`The signs of $x$ and $y$ are unknown, but only the sign of their product matters, and that product fixes the sign of $z$.` },
      ],
      answer: 'B',
      workingMd: md`$xyz = (xy) \cdot z$. Since $xy$ is positive and $xyz$ is negative, $z$ must be negative, so $z < 0$. Check: $x = y = 1$, $z = -1$ and $x = y = -2$, $z = -3$ both satisfy the conditions, and in both $z < 0$.`,
      lesson: 'Group the factors whose sign you know, and the sign of what is left follows.',
    },
    {
      id: 'check-must-be-odd',
      title: 'Which must be odd?',
      topic: 'Integer properties',
      stemMd: md`If $n$ is an integer, which of the following must be odd?`,
      options: [
        { id: 'A', text: md`$n + 3$`, note: md`When $n$ is odd, $n + 3$ is even; for example $n = 1$ gives 4.` },
        { id: 'B', text: md`$3n$`, note: md`When $n$ is even, $3n$ is even; for example $n = 2$ gives 6. Multiplying by an odd number keeps the parity of $n$.` },
        { id: 'C', text: md`$n^2 + 2n$`, note: md`When $n$ is even, both terms are even; for example $n = 2$ gives 8.` },
        { id: 'D', text: md`$n^2 + n + 1$`, note: '' },
        { id: 'E', text: md`$n^2 + n$`, note: md`$n^2 + n = n(n+1)$ is a product of consecutive integers, so it is always even, never odd.` },
      ],
      answer: 'D',
      workingMd: md`$n^2 + n = n(n+1)$ is the product of two consecutive integers, one of which is even, so it is always even. Adding 1 makes $n^2 + n + 1$ always odd. Check: $n = 2$ gives 7, $n = 3$ gives 13, $n = 0$ gives 1, $n = -1$ gives 1. Every other choice is even for $n = 1$ or $n = 2$.`,
      lesson: 'Factor an expression into consecutive integers to show it is always even.',
    },
  ],
  takeaways: [
    md`"Remainder $r$ on division by $d$" means $n = dq + r$ with $0 \le r < d$.`,
    'Remainders of sums, products and powers come from the remainders of the parts; reduce at the end.',
    'A product is even if any factor is even; a product of consecutive integers is always even.',
    '0 is even and neither positive nor negative.',
    'The sign of a product depends on how many negative factors it has.',
  ],
  practice: { examKey: 'gre', domain: 'quant-arithmetic', skill: 'arith-integer-properties' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
