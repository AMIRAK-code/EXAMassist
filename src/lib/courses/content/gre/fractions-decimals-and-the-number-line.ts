import { md, type Lesson } from '../../types';

export const fractionsLesson: Lesson = {
  slug: 'fractions-decimals-and-the-number-line',
  title: 'Fractions, decimals and the number line',
  summary: 'Compare and convert fractions and decimals, tell terminating from repeating decimals, and place, measure and divide distances on the number line.',
  minutes: 20,
  objectives: [
    'Compare fractions quickly by cross-multiplying or by converting to decimals.',
    'Tell whether a fraction gives a terminating or a repeating decimal, and find any digit of a repeating one.',
    'Find distances, midpoints and fractional points between two numbers on the number line, including negatives.',
  ],
  teachMd: md`
### Fractions: what the operations do

A fraction $\frac{a}{b}$ is $a$ divided by $b$. The four operations follow from that.

- **Add or subtract** over a common denominator: $\frac{2}{3} + \frac{1}{4} = \frac{8}{12} + \frac{3}{12} = \frac{11}{12}$.
- **Multiply** straight across: $\frac{2}{3} \cdot \frac{9}{10} = \frac{18}{30} = \frac{3}{5}$. Cancel common factors first to keep numbers small.
- **Divide** by multiplying by the reciprocal: $\frac{3}{4} \div \frac{3}{8} = \frac{3}{4} \cdot \frac{8}{3} = 2$. Dividing by a number between 0 and 1 makes the result **larger**.

### Comparing fractions

Three methods, from quickest to most general:

1. **Benchmarks.** Compare each fraction with $\frac{1}{2}$ or 1. $\frac{5}{11}$ is below $\frac{1}{2}$ and $\frac{4}{7}$ is above, so $\frac{4}{7}$ is larger.
2. **Cross-multiplication.** For positive fractions, $\frac{a}{b} > \frac{c}{d}$ exactly when $ad > bc$. To compare $\frac{5}{8}$ with $\frac{7}{11}$: $5 \cdot 11 = 55$ and $8 \cdot 7 = 56$, so $\frac{5}{8} < \frac{7}{11}$.
3. **Decimals.** Divide out to two or three places; the on-screen calculator can do this in Quantitative Reasoning, but cross-multiplication is often faster.

A larger numerator alone, or a smaller denominator alone, tells you nothing. $\frac{5}{8}$ has the larger denominator of $\frac{5}{8}$ and $\frac{3}{5}$, yet it is the larger fraction.

### Terminating and repeating decimals

Every fraction gives a decimal that either stops or repeats. Which one depends only on the denominator **after the fraction is reduced**:

- if the reduced denominator has no prime factors other than 2 and 5, the decimal terminates;
- otherwise it repeats forever.

So $\frac{7}{40}$ terminates ($40 = 2^3 \cdot 5$; it is 0.175), and $\frac{9}{24}$ terminates too, because it reduces to $\frac{3}{8} = 0.375$. But $\frac{7}{12}$ repeats ($12 = 2^2 \cdot 3$; it is $0.58333\ldots$).

The reason: a terminating decimal is a fraction over a power of 10, and $10 = 2 \cdot 5$, so only 2s and 5s can be made into a power of 10.

To find a far-off digit of a repeating decimal, find the **length of the repeating block**, divide the position by that length, and use the remainder. If $\frac{3}{7} = 0.\overline{428571}$ (block of 6), the 100th digit is at remainder $100 - 96 = 4$ within the block, which is 5. A remainder of 0 means the last digit of the block.

### Place value

In 3,507.284 the 2 is in the tenths place, the 8 in the hundredths and the 4 in the thousandths. Rounding to a place looks only at the digit just to its right: 3,507.284 rounded to the nearest hundredth is 3,507.28. Multiplying by 10 moves every digit one place left, which is why $0.0375 \times 1000 = 37.5$.

### The number line

Numbers increase to the right. On the negative side this reverses what feels natural about size: $-7 < -2$, because $-7$ is further left, even though 7 is larger than 2.

The **distance** between $a$ and $b$ is $|a - b|$. From $-2.4$ to $3.6$ it is $|3.6 - (-2.4)| = 6$. This is also what absolute value means: $|x|$ is the distance from $x$ to 0, so $|x| < 3$ describes the points within 3 of zero, the interval $-3 < x < 3$.

The **midpoint** of $a$ and $b$ is their average, $\frac{a + b}{2}$. More generally, the point a fraction $t$ of the way from $a$ to $b$ is

$$a + t(b - a)$$

Start at $a$, then move a fraction $t$ of the full distance towards $b$. If $b$ is to the left of $a$, then $b - a$ is negative and the formula moves left automatically.

### Reciprocals and order

For two **positive** numbers, taking reciprocals reverses the order: $2 < 5$ but $\frac{1}{2} > \frac{1}{5}$. The same happens for two negatives. For one positive and one negative number, the order is kept, because a reciprocal never changes sign. Number-line questions that place $x$, $\frac{1}{x}$, $x^2$ and $-x$ test this along with the size facts for numbers between 0 and 1.

### A habit that saves marks

Before comparing, write every value in one form, all fractions or all decimals, and mark each one on a sketch of the number line. Errors with negatives almost always come from comparing sizes without signs.
`,
  examples: [
    {
      id: 'example-order-fractions',
      title: 'Putting three fractions in order',
      problemMd: md`Put $\frac{5}{8}$, $\frac{7}{11}$ and $\frac{3}{5}$ in increasing order.`,
      steps: [
        md`All three are a little above $\frac{1}{2}$, so the benchmark does not separate them; cross-multiply in pairs.`,
        md`$\frac{3}{5}$ against $\frac{5}{8}$: $3 \cdot 8 = 24$ and $5 \cdot 5 = 25$, so $\frac{3}{5} < \frac{5}{8}$.`,
        md`$\frac{5}{8}$ against $\frac{7}{11}$: $5 \cdot 11 = 55$ and $8 \cdot 7 = 56$, so $\frac{5}{8} < \frac{7}{11}$.`,
        md`Check with decimals: $0.6$, $0.625$ and $0.6\overline{36}$.`,
      ],
      answerMd: md`$\frac{3}{5} < \frac{5}{8} < \frac{7}{11}$. Ordering by numerators or by denominators happens to give the same order here, but only by luck: the same shortcut would rank $\frac{4}{9}$ above $\frac{3}{5}$, which is wrong.`,
    },
    {
      id: 'example-terminating',
      title: 'Which decimals terminate?',
      problemMd: md`Which of $\frac{9}{24}$, $\frac{7}{12}$ and $\frac{11}{40}$ have terminating decimals?`,
      steps: [
        md`Reduce each fraction first. $\frac{9}{24} = \frac{3}{8}$; $\frac{7}{12}$ and $\frac{11}{40}$ are already in lowest terms.`,
        md`Factor the reduced denominators: $8 = 2^3$, $12 = 2^2 \cdot 3$, $40 = 2^3 \cdot 5$.`,
        md`Only 2s and 5s means terminating: $\frac{3}{8}$ and $\frac{11}{40}$ terminate; the 3 in 12 makes $\frac{7}{12}$ repeat.`,
        md`Check by dividing: $\frac{3}{8} = 0.375$, $\frac{11}{40} = 0.275$, $\frac{7}{12} = 0.58333\ldots$`,
      ],
      answerMd: md`$\frac{9}{24}$ and $\frac{11}{40}$ terminate; $\frac{7}{12}$ does not. Judging $\frac{9}{24}$ by its unreduced denominator, $24 = 2^3 \cdot 3$, wrongly predicts a repeating decimal.`,
    },
    {
      id: 'example-point-on-line',
      title: 'A point one third of the way',
      problemMd: md`On the number line, $a = -2.4$ and $b = 3.6$. Find the midpoint of $a$ and $b$, and the point one third of the way from $a$ to $b$.`,
      steps: [
        md`The distance from $a$ to $b$ is $3.6 - (-2.4) = 6$.`,
        md`Midpoint: $\frac{-2.4 + 3.6}{2} = \frac{1.2}{2} = 0.6$. Check: $0.6$ is 3 from each end.`,
        md`One third of the way: $a + \frac{1}{3}(6) = -2.4 + 2 = -0.4$.`,
        md`Check: from $-0.4$ to $-2.4$ is 2 and to $3.6$ is 4, a split of 1 to 2.`,
      ],
      answerMd: md`The midpoint is 0.6 and the point one third of the way is $-0.4$. Taking one third of $b$ alone ($1.2$) is the common slip: the fraction applies to the distance, starting from $a$.`,
    },
    {
      id: 'example-far-digit',
      title: 'The 100th digit',
      problemMd: md`What is the 100th digit to the right of the decimal point in the decimal for $\frac{3}{7}$?`,
      steps: [
        md`Divide: $\frac{3}{7} = 0.428571428571\ldots$, a repeating block of 6 digits: 4, 2, 8, 5, 7, 1.`,
        md`Digits 1 to 96 make 16 complete blocks, since $96 = 6 \times 16$.`,
        md`The 100th digit is the 4th digit of the next block: 4, 2, 8, **5**.`,
        md`Check with the remainder: $100 = 6 \times 16 + 4$, and the 4th digit of the block is 5.`,
      ],
      answerMd: md`The 100th digit is 5. Using the remainder 4 as if it were the digit itself is the tempting mistake.`,
    },
  ],
  traps: [
    {
      title: 'Comparing negatives by size alone',
      md: md`$-\frac{3}{4}$ is less than $-\frac{2}{3}$, because $\frac{3}{4} > \frac{2}{3}$ puts it further left. Sketch the number line and place the points before you compare.`,
    },
    {
      title: 'Testing an unreduced denominator',
      md: md`The terminating test applies to the denominator in **lowest terms**. $\frac{21}{30}$ looks like it has a 3 in its denominator, but it equals $\frac{7}{10} = 0.7$.`,
    },
    {
      title: 'Truncating a repeating decimal',
      md: md`$\frac{2}{3}$ is $0.666\ldots$, so 0.66 and 0.666 are both slightly less than $\frac{2}{3}$. If a question asks whether a value lies between two fractions, compare exactly, by cross-multiplying, not with a truncated decimal.`,
    },
    {
      title: 'Starting from 0 instead of the first point',
      md: md`"Three quarters of the way from $-5$ to 7" is $-5 + \frac{3}{4}(12) = 4$, not $\frac{3}{4} \cdot 7$ and not $\frac{3}{4} \cdot 12 = 9$. Begin at the starting point and add a fraction of the distance.`,
    },
  ],
  check: [
    {
      id: 'check-between-negatives',
      title: 'Between two negative fractions',
      topic: 'The number line',
      stemMd: md`Which of the following numbers lies between $-\frac{3}{4}$ and $-\frac{2}{3}$?`,
      options: [
        { id: 'A', text: md`$-0.8$`, note: md`$-0.8$ is less than $-0.75$, so it lies to the left of the interval. Picking it reverses the order of negatives, treating the number with the larger size as the larger number.` },
        { id: 'B', text: md`$-0.7$`, note: '' },
        { id: 'C', text: md`$-0.66$`, note: md`This truncates $-\frac{2}{3}$ to $-0.66$. In fact $-\frac{2}{3} = -0.666\ldots$, so $-0.66$ lies just to its right, outside the interval.` },
        { id: 'D', text: md`$-0.6$`, note: md`This rounds $\frac{2}{3}$ down to 0.6; $-0.6$ is greater than $-\frac{2}{3}$, to the right of the interval.` },
        { id: 'E', text: md`$0.7$`, note: md`This drops the minus signs: $0.7$ lies between $\frac{2}{3}$ and $\frac{3}{4}$, but the interval in the question is on the negative side.` },
      ],
      answer: 'B',
      workingMd: md`The interval runs from $-0.75$ to $-0.666\ldots$. Of the choices, only $-0.7$ satisfies $-0.75 < -0.7 < -0.666\ldots$. Exactly: $-0.7 = -\frac{7}{10}$, and $\frac{2}{3} < \frac{7}{10} < \frac{3}{4}$ because $20 < 21$ and $28 < 30$ by cross-multiplication, so $-\frac{3}{4} < -\frac{7}{10} < -\frac{2}{3}$.`,
      lesson: 'Convert every value to one form, keep the signs, and place them on a sketch of the line.',
    },
    {
      id: 'check-three-quarters-of-the-way',
      title: 'Three quarters of the way',
      topic: 'Quantitative Comparison',
      stemMd: md`On the number line, point $P$ is at $-5$ and point $Q$ is at 7. Point $R$ lies on segment $PQ$, three quarters of the way from $P$ to $Q$.

| Quantity A | Quantity B |
| --- | --- |
| The coordinate of $R$ | 4 |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: md`This takes $\frac{3}{4}$ of the distance, 9, as the coordinate itself, measuring from 0 instead of from $P$.` },
        { id: 'B', text: md`Quantity B is greater.`, note: md`This measures three quarters of the way from $Q$ back towards $P$, which gives $7 - 9 = -2$.` },
        { id: 'C', text: md`The two quantities are equal.`, note: '' },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`$P$, $Q$ and the fraction are all fixed, so $R$ is a single, known point.` },
      ],
      answer: 'C',
      workingMd: md`The distance from $P$ to $Q$ is $7 - (-5) = 12$. Three quarters of it is 9, so $R = -5 + 9 = 4$. Check: $R$ is 9 from $P$ and 3 from $Q$, a split of 3 to 1.`,
      lesson: 'A point a fraction of the way from $a$ to $b$ is $a + t(b - a)$: start at $a$.',
    },
    {
      id: 'check-50th-digit',
      title: 'The 50th digit of 2/13',
      topic: 'Decimal representation',
      stemMd: md`The decimal for $\frac{2}{13}$ is $0.153846153846\ldots$, with the block 153846 repeating. What is the 50th digit to the right of the decimal point?`,
      options: [
        { id: 'A', text: md`0`, note: md`This assumes the decimal stops after a few digits; a denominator of 13 means it repeats forever.` },
        { id: 'B', text: md`1`, note: md`This takes the first digit of the block, as if the 50th digit began a new block; the block restarts at the 49th digit.` },
        { id: 'C', text: md`3`, note: md`This is off by one: it treats the 48th digit as the start of a block instead of its end.` },
        { id: 'D', text: md`5`, note: '' },
        { id: 'E', text: md`6`, note: md`This takes the last digit of the block, which is right only when the position is a multiple of 6; 50 is not.` },
      ],
      answer: 'D',
      workingMd: md`The block has 6 digits. $50 = 6 \times 8 + 2$, so digits 1 to 48 are 8 full blocks, the 49th digit is 1 and the 50th is the 2nd digit of the block, 5.`,
      lesson: 'Divide the position by the block length; the remainder names the digit, and a remainder of 0 means the last one.',
    },
  ],
  takeaways: [
    md`For positive fractions, $\frac{a}{b} > \frac{c}{d}$ exactly when $ad > bc$.`,
    'A reduced fraction terminates only if its denominator has no primes but 2 and 5.',
    'For a far-off digit of a repeating decimal, divide the position by the block length and read the remainder.',
    md`Distance is $|a - b|$; the point a fraction $t$ of the way from $a$ to $b$ is $a + t(b - a)$.`,
    'On the negative side, the number with the larger size is the smaller number.',
  ],
  practice: { examKey: 'gre', domain: 'quant-arithmetic', skill: 'arith-number-line' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
