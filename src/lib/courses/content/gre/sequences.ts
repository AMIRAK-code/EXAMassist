import { md, type Lesson } from '../../types';

export const sequencesLesson: Lesson = {
  slug: 'sequences',
  title: 'Sequences of numbers',
  summary: 'Find any term of an arithmetic or geometric sequence, count and add terms without off-by-one errors, and handle recursive and repeating patterns.',
  minutes: 20,
  objectives: [
    'Write the nth term of an arithmetic or a geometric sequence and use it to find any term.',
    'Count the terms in a list and add an arithmetic series with the first-plus-last method.',
    'Work out terms of a sequence defined recursively.',
    'Use the cycle length of a repeating sequence to find far-off terms and sums.',
  ],
  teachMd: md`
### Notation

A sequence is an ordered list of numbers. Its terms are written $a_1, a_2, a_3, \ldots$, where the small number is the **position** and $a_n$ is the term in position $n$. A question may define a sequence by a formula for $a_n$, such as $a_n = 2n^2 - 1$ (so $a_3 = 17$), or by a rule that builds each term from the one before.

### Arithmetic sequences

In an **arithmetic** sequence, each term is the previous one plus a fixed **common difference** $d$: 7, 11, 15, 19, … has $d = 4$. To reach $a_n$ from $a_1$ you take $n - 1$ steps, not $n$:

$$a_n = a_1 + (n - 1)d$$

The same idea links any two terms: $a_m - a_k = (m - k)d$. If you know two terms anywhere in the sequence, divide their difference by the number of steps between them to get $d$, then step to whatever term you need.

### Counting terms

How many numbers are in the list 14, 17, 20, …, 98? The gap from first to last is $98 - 14 = 84$, which is $\frac{84}{3} = 28$ steps, and 28 steps join **29** numbers:

$$\text{number of terms} = \frac{\text{last} - \text{first}}{d} + 1$$

The "+1" is the fence-post rule: a fence with 28 gaps has 29 posts. For a range of whole numbers, "from 30 to 75 inclusive" contains $75 - 30 + 1 = 46$ integers. For multiples, first find the first and last multiple inside the range, then count steps.

### Adding an arithmetic sequence

Pair the first term with the last, the second with the second-to-last, and so on: every pair has the same sum. So

$$\text{sum} = \text{number of terms} \times \frac{\text{first} + \text{last}}{2}$$

that is, the count times the average of the first and last terms. The sum of $1 + 2 + \cdots + n$ is $\frac{n(n+1)}{2}$; the sum of the first $n$ odd numbers is $n^2$.

### Geometric sequences

In a **geometric** sequence, each term is the previous one **times** a fixed **common ratio** $r$: 3, 6, 12, 24, … has $r = 2$, and 80, 20, 5, 1.25, … has $r = \frac{1}{4}$. Again there are $n - 1$ steps to the $n$th term:

$$a_n = a_1 r^{n-1}$$

To tell the two kinds apart, check differences and quotients of neighbouring terms: constant differences mean arithmetic, constant quotients mean geometric. A negative ratio makes the signs alternate: with $a_1 = 3$ and $r = -2$ you get 3, $-6$, 12, $-24$, …, so terms in odd positions are positive and terms in even positions negative.

### Recursive sequences

A **recursive** definition gives the first term (or first few) and a rule for the next term: $a_1 = 2$ and $a_n = 3a_{n-1} - 1$ for $n \ge 2$. For the first few terms no shortcut is needed; write the terms out carefully, keeping track of which position each one fills. Most errors here are index slips, such as starting the rule at $a_1$ or labelling the third term computed as $a_3$ when it is $a_4$.

### Repeating sequences

Some sequences cycle: 3, $-1$, 4, 2, 3, $-1$, 4, 2, … repeats every 4 terms. To find a far-off term, divide its position by the cycle length and use the **remainder**, as with remainders and repeating decimals: remainder 1 means the first term of the cycle, and remainder 0 means the last. For a sum of the first $n$ terms, count the complete cycles, multiply by the sum of one cycle, and add the leftover terms.

### Strategy

Write out the first few terms whenever a sequence is defined abstractly. It costs seconds and shows the pattern, the sign changes and the index convention at once. Before you answer, check one value you can verify directly, such as the term you were given.
`,
  examples: [
    {
      id: 'example-two-terms',
      title: 'From two terms to any term',
      problemMd: md`In an arithmetic sequence, $a_3 = 14$ and $a_{10} = 42$. Find $a_1$ and $a_{25}$.`,
      steps: [
        md`From position 3 to position 10 is $10 - 3 = 7$ steps, and the terms differ by $42 - 14 = 28$, so $d = \frac{28}{7} = 4$.`,
        md`Step back from $a_3$: $a_1 = 14 - 2 \cdot 4 = 6$.`,
        md`Step forward: $a_{25} = 6 + 24 \cdot 4 = 102$.`,
        md`Check against a given term: $a_{10} = 6 + 9 \cdot 4 = 42$. A second route to $a_{25}$: $42 + 15 \cdot 4 = 102$.`,
      ],
      answerMd: md`$a_1 = 6$ and $a_{25} = 102$. Using 25 steps instead of 24 gives 106.`,
    },
    {
      id: 'example-sum-of-multiples',
      title: 'Sum of the multiples of 7 between 100 and 200',
      problemMd: md`What is the sum of all the multiples of 7 between 100 and 200?`,
      steps: [
        md`The first multiple of 7 above 100 is $105 = 7 \cdot 15$; the last below 200 is $196 = 7 \cdot 28$.`,
        md`Count them: $\frac{196 - 105}{7} + 1 = 13 + 1 = 14$ terms.`,
        md`Sum $= 14 \times \frac{105 + 196}{2} = 7 \times 301 = 2107$.`,
        md`Second route: the sum is $7(15 + 16 + \cdots + 28)$, and $15 + \cdots + 28 = 14 \times \frac{15 + 28}{2} = 301$, so the sum is $7 \cdot 301 = 2107$.`,
      ],
      answerMd: md`The sum is 2,107. Counting 13 terms instead of 14 gives $13 \times 150.5 = 1956.5$; a sum of whole numbers cannot end in .5, which shows the count was wrong.`,
    },
    {
      id: 'example-recursive',
      title: 'A recursive rule',
      problemMd: md`A sequence has $a_1 = 2$ and $a_n = 3a_{n-1} - 1$ for $n \ge 2$. What is $a_5$?`,
      steps: [
        md`$a_2 = 3 \cdot 2 - 1 = 5$.`,
        md`$a_3 = 3 \cdot 5 - 1 = 14$.`,
        md`$a_4 = 3 \cdot 14 - 1 = 41$.`,
        md`$a_5 = 3 \cdot 41 - 1 = 122$.`,
        md`Check with a pattern you can test on every term so far: $a_n = \frac{3^n + 1}{2}$ gives 2, 5, 14, 41 for $n = 1$ to 4, and $\frac{243 + 1}{2} = 122$ for $n = 5$.`,
      ],
      answerMd: md`$a_5 = 122$. Stopping one step early gives 41, the fourth term.`,
    },
    {
      id: 'example-cycle-sum',
      title: 'Sum of a repeating sequence',
      problemMd: md`The sequence 3, $-1$, 4, 2, 3, $-1$, 4, 2, … repeats the same four terms forever. What is the sum of its first 50 terms?`,
      steps: [
        md`One cycle has 4 terms with sum $3 - 1 + 4 + 2 = 8$.`,
        md`$50 = 4 \times 12 + 2$: twelve complete cycles and two leftover terms.`,
        md`The leftover terms are the first two of a cycle, 3 and $-1$.`,
        md`Sum $= 12 \times 8 + 3 + (-1) = 96 + 2 = 98$.`,
      ],
      answerMd: md`The sum is 98. Dividing 50 by 4 and multiplying 12.5 by 8 gives 100, which wrongly assumes the half cycle adds half of 8.`,
    },
  ],
  traps: [
    {
      title: 'Taking n steps to the nth term',
      md: md`From $a_1$ to $a_n$ there are $n - 1$ steps, so $a_n = a_1 + (n - 1)d$ and $a_n = a_1 r^{n-1}$. Check with $n = 1$: the formula must give $a_1$ back.`,
    },
    {
      title: 'The fence-post error when counting',
      md: md`The integers from 30 to 75 inclusive number $75 - 30 + 1 = 46$, not 45. Dividing the gap by the step counts gaps, not terms; add 1.`,
    },
    {
      title: 'Calling a geometric sequence arithmetic',
      md: md`2, 6, 18, 54 has differences 4, 12, 36, which are not constant, but quotients of 3, which are. Test both before you choose a formula.`,
    },
    {
      title: 'Splitting a cycle evenly',
      md: md`When a sum stops part-way through a cycle, add the actual leftover terms. The first two terms of a cycle rarely add up to half of the cycle's sum.`,
    },
  ],
  check: [
    {
      id: 'check-20th-term',
      title: 'The 20th term',
      topic: 'Sequences',
      stemMd: md`In an arithmetic sequence, the 4th term is 19 and the 9th term is 44. What is the 20th term?`,
      options: [
        { id: 'A', text: md`94`, note: md`This takes 18 steps from the first term instead of 19.` },
        { id: 'B', text: md`99`, note: '' },
        { id: 'C', text: md`100`, note: md`This multiplies the position by $d$, $20 \times 5$, as if the sequence were $5n$; that would need a first term of 5, but it is 4.` },
        { id: 'D', text: md`104`, note: md`This takes 20 steps from the first term; the 20th term is only 19 steps away.` },
        { id: 'E', text: md`114`, note: md`This starts from the 4th term, 19, and adds 19 steps of 5; from the 4th term to the 20th is 16 steps.` },
      ],
      answer: 'B',
      workingMd: md`From the 4th to the 9th term is 5 steps covering $44 - 19 = 25$, so $d = 5$. The first term is $19 - 3 \cdot 5 = 4$, and the 20th is $4 + 19 \cdot 5 = 99$. Check another way: from the 9th term, $44 + 11 \cdot 5 = 99$.`,
      lesson: 'Count the steps between positions: from $a_k$ to $a_m$ is $m - k$ steps.',
    },
    {
      id: 'check-alternating-geometric',
      title: 'An alternating geometric sequence',
      topic: 'Quantitative Comparison',
      stemMd: md`In a geometric sequence, the first term is 3 and the common ratio is $-2$.

| Quantity A | Quantity B |
| --- | --- |
| The 8th term | The 7th term |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: md`This compares sizes only: the 8th term has the larger absolute value, 384, but it is negative.` },
        { id: 'B', text: md`Quantity B is greater.`, note: '' },
        { id: 'C', text: md`The two quantities are equal.`, note: md`This assumes the alternating signs leave neighbouring terms the same size; each term is twice the size of the one before.` },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`The first term and the ratio fix every term, so both quantities are definite numbers.` },
      ],
      answer: 'B',
      workingMd: md`$a_n = 3(-2)^{n-1}$. The 7th term is $3(-2)^6 = 3 \cdot 64 = 192$, and the 8th is $3(-2)^7 = 3 \cdot (-128) = -384$. So $192 > -384$. Check by listing: 3, $-6$, 12, $-24$, 48, $-96$, 192, $-384$.`,
      lesson: 'With a negative ratio, odd and even positions have opposite signs; check the sign before the size.',
    },
    {
      id: 'check-sum-41-to-80',
      title: 'Sum of a run of integers',
      topic: 'Sequences',
      stemMd: md`What is the sum of the integers from 41 to 80, inclusive?`,
      options: [
        { id: 'A', text: md`2,379`, note: md`This subtracts the sum from 1 to 41, which also removes 41 itself; subtract the sum from 1 to 40.` },
        { id: 'B', text: md`2,400`, note: md`This multiplies 40 terms by the average of 40 and 80; the first term is 41, so the average is 60.5.` },
        { id: 'C', text: md`2,420`, note: '' },
        { id: 'D', text: md`3,240`, note: md`This is the sum from 1 to 80; the integers from 1 to 40 were never subtracted.` },
        { id: 'E', text: md`4,840`, note: md`This multiplies the count by first plus last, $40 \times 121$, without dividing by 2.` },
      ],
      answer: 'C',
      workingMd: md`There are $80 - 41 + 1 = 40$ terms, with average $\frac{41 + 80}{2} = 60.5$, so the sum is $40 \times 60.5 = 2420$. Check: $1 + \cdots + 80 = \frac{80 \cdot 81}{2} = 3240$, $1 + \cdots + 40 = \frac{40 \cdot 41}{2} = 820$, and $3240 - 820 = 2420$.`,
      lesson: 'The sum of an arithmetic run is the number of terms times the average of the first and last.',
    },
  ],
  takeaways: [
    md`Arithmetic: $a_n = a_1 + (n - 1)d$. Geometric: $a_n = a_1 r^{n-1}$.`,
    md`Number of terms $= \frac{\text{last} - \text{first}}{d} + 1$.`,
    'Sum of an arithmetic sequence = number of terms × average of first and last.',
    'For a repeating sequence, divide the position by the cycle length and read the remainder.',
  ],
  practice: { examKey: 'gre', domain: 'quant-arithmetic', skill: 'arith-sequences' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
