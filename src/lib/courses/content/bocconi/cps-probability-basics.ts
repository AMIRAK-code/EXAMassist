import { md, type Lesson } from '../../types';

export const probabilityBasicsLesson: Lesson = {
  slug: 'probability-basics',
  title: 'Probability basics: equally likely outcomes and counting',
  summary: 'Build the sample space, make sure its outcomes are equally likely, and turn probability questions into two counts done the same way.',
  minutes: 20,
  objectives: [
    'Write a sample space whose outcomes are equally likely, and use favourable over total.',
    'Compute probabilities for draws with and without replacement, by counting or step by step.',
    'Use the complement and sanity checks to catch impossible answers.',
  ],
  teachMd: md`
### Favourable over total, with one condition

When every outcome of an experiment is **equally likely**, the probability of an event $A$ is
$$P(A) = \frac{\text{number of outcomes in } A}{\text{number of outcomes in total}}.$$
The set of all outcomes is the **sample space**. The condition "equally likely" is not a formality: almost every wrong answer in this topic comes from counting outcomes that are not equally likely.

Take the sum of two dice. The possible sums are $2, 3, \dots, 12$, eleven values, but they are not equally likely: a sum of 2 happens only as $(1,1)$, while a sum of 7 happens six ways. The equally likely outcomes are the **36 ordered pairs** (first die, second die). Treat the dice as different colours, even when the question does not, and you will always get the right sample space.

### Three facts to keep in view

- Every probability lies between 0 and 1. An answer of $\frac{7}{6}$ or $-0.2$ is a signal to start again.
- The probabilities of all the outcomes add up to 1.
- **Complement:** $P(\text{not } A) = 1 - P(A)$. When "not $A$" is easier to count, as with "at least one", count it and subtract.

### Probability by counting

With equally likely outcomes, a probability is a ratio of two counts, so the tools of [counting problems](/courses/bocconi/counting-problems) carry straight over. The one rule: count the numerator and the denominator **the same way**. If the denominator counts ordered draws, so must the numerator; if it counts unordered groups, so must the numerator.

Drawing 2 balls at once from a bag of 5 red and 3 blue, the unordered sample space has $\binom{8}{2} = 28$ equally likely pairs, of which $\binom{5}{2} = 10$ are both red: $P = \frac{10}{28} = \frac{5}{14}$.

### Probability step by step

The same answer comes from imagining the balls drawn one at a time and multiplying:
$$P(\text{red, then red}) = \frac{5}{8} \times \frac{4}{7} = \frac{20}{56} = \frac{5}{14}.$$
The second fraction is $\frac{4}{7}$ because one red ball has gone: 4 red are left among 7 balls. This is drawing **without replacement**. With replacement, the ball goes back, the bag is the same for every draw, and the probability would be $\frac{5}{8} \times \frac{5}{8} = \frac{25}{64}$.

Having two routes is useful in the exam room: do the problem one way and check it the other.

### Independent repetitions

Tosses of a fair coin, rolls of a die, or draws with replacement do not affect each other. For such independent trials, the probability that several specified things all happen is the product of their probabilities: three heads in three tosses has probability $\left(\frac{1}{2}\right)^3 = \frac{1}{8}$.

When the question asks for a number of successes, not a fixed order, count the orders. Exactly two heads in three tosses can happen as HHT, HTH or THH, each with probability $\frac{1}{8}$, so $P = \frac{3}{8}$. In general the count of orders is $\binom{n}{k}$, and with probability $p$ of success at each trial,
$$P(\text{exactly } k \text{ successes in } n) = \binom{n}{k}\,p^k(1-p)^{n-k}.$$

### When the outcomes are not symmetric

If the experiment is a list of options with given probabilities (a spinner with unequal sectors, a loaded die), there is no counting: you add the probabilities of the outcomes in the event. "Favourable over total" only works once the outcomes are equally likely.

### A routine for every question

1. Name the experiment and write, or picture, a sample space of equally likely outcomes.
2. Decide: ordered or unordered, with or without replacement.
3. Count the event, or its complement if that is shorter.
4. Check that the result is between 0 and 1 and roughly the size you expected; then check by the other route.
`,
  examples: [
    {
      id: 'example-two-dice-sums',
      title: 'Sums of two dice',
      problemMd: md`Two fair dice are rolled. Find the probability that (a) the sum is 8; (b) the sum is at least 10.`,
      steps: [
        md`Use the 36 ordered pairs as the sample space; they are equally likely.`,
        md`(a) Sum 8: $(2,6), (3,5), (4,4), (5,3), (6,2)$, five pairs. $P = \frac{5}{36}$.`,
        md`(b) Sum 10: $(4,6), (5,5), (6,4)$; sum 11: $(5,6), (6,5)$; sum 12: $(6,6)$. Six pairs, so $P = \frac{6}{36} = \frac{1}{6}$.`,
        md`Sanity check: the number of pairs for each sum from 2 to 12 is $1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1$, which adds to 36.`,
      ],
      answerMd: md`(a) $\frac{5}{36}$; (b) $\frac{1}{6}$. Treating the eleven sums as equally likely would give $\frac{1}{11}$ and $\frac{3}{11}$, both wrong.`,
    },
    {
      id: 'example-two-balls',
      title: 'Two balls without replacement',
      problemMd: md`A bag holds 5 red and 3 blue balls. Two are drawn without replacement. Find the probability that both are red, that both are blue, and that one of each colour is drawn.`,
      steps: [
        md`Unordered sample space: $\binom{8}{2} = 28$ pairs.`,
        md`Both red: $\binom{5}{2} = 10$, so $\frac{10}{28} = \frac{5}{14}$. Both blue: $\binom{3}{2} = 3$, so $\frac{3}{28}$. One of each: $5 \times 3 = 15$, so $\frac{15}{28}$.`,
        md`The three events cover every pair exactly once: $10 + 3 + 15 = 28$. Good.`,
        md`Step-by-step check for one of each: red then blue $\frac{5}{8} \times \frac{3}{7} = \frac{15}{56}$, blue then red $\frac{3}{8} \times \frac{5}{7} = \frac{15}{56}$; together $\frac{30}{56} = \frac{15}{28}$.`,
      ],
      answerMd: md`Both red $\frac{5}{14}$, both blue $\frac{3}{28}$, one of each $\frac{15}{28}$. Computing only "red then blue", $\frac{15}{56}$, misses the other order.`,
    },
    {
      id: 'example-random-code',
      title: 'A random arrangement',
      problemMd: md`The digits 1, 2, 3, 4 are put in a random order to form a four-digit code, all orders equally likely. What is the probability that the code starts with 1 and ends with 4?`,
      steps: [
        md`Sample space: $4! = 24$ equally likely orders.`,
        md`Favourable: 1 first and 4 last leaves 2 and 3 for the middle in $2! = 2$ ways. $P = \frac{2}{24} = \frac{1}{12}$.`,
        md`Step-by-step check: $P(\text{first is } 1) = \frac{1}{4}$; given that, the last place is one of the 3 remaining digits, so $P(\text{last is } 4) = \frac{1}{3}$. $\frac{1}{4} \times \frac{1}{3} = \frac{1}{12}$.`,
      ],
      answerMd: md`$\frac{1}{12}$. Multiplying $\frac{1}{4} \times \frac{1}{4} = \frac{1}{16}$ wrongly treats the two places as independent, as if a digit could be used twice.`,
    },
  ],
  traps: [
    {
      title: 'Outcomes that are not equally likely',
      md: md`Listing results (sums, numbers of heads, colours) is not the same as listing equally likely outcomes. Two heads out of three tosses is three times as likely as three heads. Go back to the ordered outcomes, such as the 36 dice pairs or the 8 coin sequences, before you divide.`,
    },
    {
      title: 'Ordered numerator, unordered denominator',
      md: md`Dividing $\binom{4}{2} = 6$ unordered pairs by $10 \times 9 = 90$ ordered draws gives an answer half the right size. Count both the numerator and the denominator in the same way, ordered or unordered.`,
    },
    {
      title: 'Ignoring the missing ball',
      md: md`Without replacement, the second draw comes from a smaller bag with one fewer ball of the colour already taken. Using the same fraction twice is the with-replacement answer to a different question.`,
    },
    {
      title: 'Forgetting the other orders',
      md: md`"One red and one blue" includes red-then-blue and blue-then-red. When you multiply step by step, add the probability of every order that produces the event.`,
    },
  ],
  check: [
    {
      id: 'check-even-product',
      title: 'An even product',
      topic: 'Basic probability',
      stemMd: md`Two fair dice are rolled and the two numbers are multiplied. What is the probability that the product is even?`,
      options: [
        { id: 'A', text: md`$\frac{1}{4}$`, note: md`This is the probability that both numbers are even. The product is already even when just one of them is.` },
        { id: 'B', text: md`$\frac{1}{2}$`, note: md`Assumes even and odd products are equally likely, as for a single die. A product is odd only when both numbers are odd, which is rarer.` },
        { id: 'C', text: md`$\frac{3}{4}$`, note: '' },
        { id: 'D', text: md`$1$`, note: md`Adds $P(\text{first even}) + P(\text{second even}) = \frac{1}{2} + \frac{1}{2}$, counting the pairs where both are even twice.` },
      ],
      answer: 'C',
      workingMd: md`The product is odd only if both numbers are odd: $3 \times 3 = 9$ of the 36 pairs. So $P(\text{even}) = 1 - \frac{9}{36} = \frac{27}{36} = \frac{3}{4}$. Check by counting directly: first even (18 pairs) plus first odd and second even ($3 \times 3 = 9$ pairs) gives 27.`,
      lesson: 'When an event happens if any one condition holds, count the complement, where none of them hold.',
    },
    {
      id: 'check-two-green',
      title: 'Two green counters',
      topic: 'Basic probability',
      stemMd: md`A box contains 4 green and 6 yellow counters. Two counters are drawn at random without replacement. What is the probability that both are green?`,
      options: [
        { id: 'A', text: md`$\frac{1}{15}$`, note: md`Divides the $\binom{4}{2} = 6$ unordered green pairs by $10 \times 9 = 90$ ordered draws. Numerator and denominator must be counted the same way.` },
        { id: 'B', text: md`$\frac{2}{15}$`, note: '' },
        { id: 'C', text: md`$\frac{4}{25}$`, note: md`This is $\frac{4}{10} \times \frac{4}{10}$, the answer with replacement. Without replacement only 3 green counters remain among 9 for the second draw.` },
        { id: 'D', text: md`$\frac{2}{5}$`, note: md`This is the probability that a single counter is green; the second draw has not been taken into account.` },
      ],
      answer: 'B',
      workingMd: md`Step by step: $\frac{4}{10} \times \frac{3}{9} = \frac{12}{90} = \frac{2}{15}$. By counting: $\frac{\binom{4}{2}}{\binom{10}{2}} = \frac{6}{45} = \frac{2}{15}$.`,
      lesson: 'Without replacement, the second fraction uses the smaller bag; check by counting unordered pairs.',
    },
    {
      id: 'check-two-heads',
      title: 'Exactly two heads',
      topic: 'Basic probability',
      stemMd: md`A fair coin is tossed three times. What is the probability of getting exactly two heads?`,
      options: [
        { id: 'A', text: md`$\frac{1}{8}$`, note: md`This is the probability of one particular order, such as HHT. Two heads can come in three different orders.` },
        { id: 'B', text: md`$\frac{1}{4}$`, note: md`Treats the four results 0, 1, 2 and 3 heads as equally likely. They are not: 1 or 2 heads can each happen three ways, 0 or 3 heads only one way.` },
        { id: 'C', text: md`$\frac{3}{8}$`, note: '' },
        { id: 'D', text: md`$\frac{1}{2}$`, note: md`This is the probability of **at least** two heads (HHT, HTH, THH, HHH), which includes three heads.` },
      ],
      answer: 'C',
      workingMd: md`The 8 sequences HHH, HHT, HTH, HTT, THH, THT, TTH, TTT are equally likely. Exactly two heads: HHT, HTH, THH, so $\frac{3}{8}$. By formula: $\binom{3}{2}\left(\frac{1}{2}\right)^2\left(\frac{1}{2}\right) = \frac{3}{8}$.`,
      lesson: 'For a number of successes, multiply the probability of one order by the number of orders.',
    },
  ],
  takeaways: [
    'Favourable over total works only when the outcomes are equally likely; treat dice and coins as distinguishable.',
    'Count the numerator and the denominator the same way, ordered or unordered.',
    'Without replacement, the bag shrinks after every draw.',
    md`Use $P(\text{not } A) = 1 - P(A)$ when the complement is shorter to count, and reject any answer outside $[0, 1]$.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-probability-basics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
