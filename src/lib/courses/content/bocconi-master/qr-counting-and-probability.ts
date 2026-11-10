import { md, type Lesson } from '../../types';

export const countingAndProbabilityLesson: Lesson = {
  slug: 'counting-and-probability',
  title: 'Counting and probability',
  summary: 'Count arrangements and selections with the product rule, permutations and combinations, then turn counts into probabilities, using complements.',
  minutes: 24,
  objectives: [
    'Decide whether order matters and count with the product rule, permutations or combinations.',
    'Compute a probability as favourable over total when outcomes are equally likely.',
    'Use complements, independence and draws without replacement correctly.',
  ],
  teachMd: md`
### The product rule

If a choice is made in stages, with $m$ options at the first stage and $n$ at the second whatever happened first, there are $m \times n$ ways in all. A sandwich with 3 breads and 4 fillings can be made in $3 \times 4 = 12$ ways. The rule extends to any number of stages, and nearly every counting formula is built from it.

### Order matters: permutations

Arranging $n$ different items in a row: $n$ choices for the first place, $n - 1$ for the second, and so on, giving
$$n! = n \times (n - 1) \times \cdots \times 2 \times 1.$$
Values to know: $3! = 6$, $4! = 24$, $5! = 120$, $6! = 720$.

Filling only $r$ ordered places from $n$ items gives $n \times (n - 1) \times \cdots$ with $r$ factors. Electing a president, a secretary and a treasurer from 7 people: $7 \times 6 \times 5 = 210$ ways. If repetition is allowed, each place has all $n$ options: a 3-digit code using the digits 1 to 5 with repeats allowed has $5^3 = 125$ possibilities.

### Order does not matter: combinations

Choosing a committee of 3 from 7 people, where the three seats are identical, counts each group once rather than once per ordering. Each group of 3 can be ordered in $3! = 6$ ways, so
$$\binom{7}{3} = \frac{7 \times 6 \times 5}{3 \times 2 \times 1} = \frac{210}{6} = 35.$$
In general, $\binom{n}{r} = \frac{n!}{r!\,(n - r)!}$, and choosing $r$ to take is the same as choosing $n - r$ to leave: $\binom{10}{8} = \binom{10}{2} = 45$. Useful values: $\binom{5}{2} = 10$, $\binom{6}{2} = 15$, $\binom{8}{2} = 28$, $\binom{10}{3} = 120$.

**The deciding question** is whether swapping two chosen items gives a different outcome. Different roles, positions or a code: order matters. A team, a hand of cards, a set of books to take: it does not.

### Probability as counting

When every outcome is equally likely,
$$P(\text{event}) = \frac{\text{number of favourable outcomes}}{\text{total number of outcomes}}.$$
Count the top and the bottom **the same way**: both ordered or both unordered. A probability always lies between 0 and 1; an answer outside that range signals an error.

With two dice, the 36 ordered pairs are the equally likely outcomes, not the 11 possible sums. A sum of 7 arises in 6 ways, so it has probability $\frac{6}{36} = \frac{1}{6}$, while a sum of 2 arises only as $(1, 1)$.

### Rules for combining events

- **Complement:** $P(\text{not } A) = 1 - P(A)$. "At least one" is almost always easiest as $1 - P(\text{none})$.
- **And, for independent events:** multiply. Two fair coin tosses both landing heads: $\frac{1}{2} \times \frac{1}{2} = \frac{1}{4}$.
- **Or:** $P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)$. Subtract the overlap, which would otherwise be counted twice. If the events cannot both happen, the overlap is 0 and you simply add.

For a number chosen at random from 1 to 20, the multiples of 2 are 10 numbers and the multiples of 5 are 4 numbers (5, 10, 15, 20). The multiples of both, 10 and 20, are counted in each list, so there are $10 + 4 - 2 = 12$ numbers that are multiples of 2 or 5, and the probability is $\frac{12}{20} = \frac{3}{5}$.

### Without replacement

When items are drawn and not put back, later draws depend on earlier ones. From a bag of 5 red and 3 blue balls, two drawn without replacement are both red with probability
$$\frac{5}{8} \times \frac{4}{7} = \frac{20}{56} = \frac{5}{14},$$
because after one red is gone, 4 of the remaining 7 are red. Counting gives the same answer: $\frac{\binom{5}{2}}{\binom{8}{2}} = \frac{10}{28} = \frac{5}{14}$. Using $\frac{5}{8} \times \frac{5}{8}$ would treat the draws as if the ball were put back.
`,
  examples: [
    {
      id: 'example-committee-or-officers',
      title: 'Committee or officers?',
      problemMd: md`From 7 club members, (a) how many 3-person committees can be formed, and (b) in how many ways can a president, a secretary and a treasurer be chosen?`,
      steps: [
        md`(b) has distinct roles, so order matters: $7 \times 6 \times 5 = 210$.`,
        md`(a) has identical seats. Each committee of 3 appears $3! = 6$ times among the 210 ordered choices, once for each way of handing out the roles.`,
        md`So the number of committees is $\frac{210}{6} = 35$, which is $\binom{7}{3}$.`,
        md`Check by the formula: $\binom{7}{3} = \frac{7!}{3!\,4!} = \frac{5040}{6 \times 24} = \frac{5040}{144} = 35$.`,
      ],
      answerMd: md`(a) 35 committees; (b) 210 ways to choose officers. Giving 210 for the committee question counts each group six times over.`,
    },
    {
      id: 'example-at-least-one-six',
      title: 'At least one six',
      problemMd: md`Two fair dice are rolled. What is the probability that at least one shows a six?`,
      steps: [
        md`Use the complement: "at least one six" fails only if neither die shows a six.`,
        md`$P(\text{no six on one die}) = \frac{5}{6}$, and the dice are independent, so $P(\text{no six on either}) = \frac{5}{6} \times \frac{5}{6} = \frac{25}{36}$.`,
        md`$P(\text{at least one six}) = 1 - \frac{25}{36} = \frac{11}{36}$.`,
        md`Check by counting ordered pairs: 6 pairs have a six on the first die, 6 on the second, and $(6, 6)$ is in both, so $6 + 6 - 1 = 11$ of the 36 pairs.`,
      ],
      answerMd: md`$\frac{11}{36}$. Adding $\frac{1}{6} + \frac{1}{6} = \frac{12}{36}$ counts the double six twice.`,
    },
    {
      id: 'example-one-of-each',
      title: 'One of each colour',
      problemMd: md`A bag holds 5 red and 3 blue balls. Two are drawn without replacement. What is the probability of getting one red and one blue?`,
      steps: [
        md`Count unordered pairs: there are $\binom{8}{2} = 28$ pairs in all.`,
        md`Pairs with one red and one blue: $5 \times 3 = 15$.`,
        md`Probability $= \frac{15}{28}$.`,
        md`Check in order: red then blue $\frac{5}{8} \times \frac{3}{7} = \frac{15}{56}$, blue then red $\frac{3}{8} \times \frac{5}{7} = \frac{15}{56}$, total $\frac{30}{56} = \frac{15}{28}$. Also, the three cases add to 1: two red $\frac{10}{28}$, two blue $\frac{3}{28}$, mixed $\frac{15}{28}$.`,
      ],
      answerMd: md`$\frac{15}{28}$. Computing only "red then blue", $\frac{15}{56}$, misses the other order.`,
    },
  ],
  traps: [
    {
      title: 'Counting ordered outcomes when order does not matter',
      md: md`A team, a hand or a sample is a set: choosing Ana then Ben is the same team as Ben then Ana. Using $n \times (n - 1) \times \cdots$ for such a question overcounts by a factor of $r!$. Ask whether swapping two chosen items changes the outcome.`,
    },
    {
      title: 'Mixing ordered and unordered counts',
      md: md`In a probability, the top and bottom must be counted the same way. An ordered numerator over an unordered denominator can double an answer, or worse.`,
    },
    {
      title: 'Adding probabilities that overlap',
      md: md`"A or B" is $P(A) + P(B)$ only when A and B cannot happen together. Otherwise subtract $P(A \text{ and } B)$. An "or" probability above 1 is a sure sign of double counting.`,
    },
    {
      title: 'Treating draws without replacement as independent',
      md: md`Once an item is removed, the bag has changed. Reduce both the total and, if relevant, the favourable count before the next draw.`,
    },
  ],
  check: [
    {
      id: 'check-codes',
      title: 'Codes with different digits',
      topic: 'Quantitative reasoning: counting',
      stemMd: md`A code is made of 3 different digits chosen from 1, 2, 3, 4 and 5, and the order of the digits matters. How many codes are possible?`,
      options: [
        { id: 'A', text: md`10`, note: md`This is $\binom{5}{3}$, the number of sets of 3 digits; it ignores that 123 and 321 are different codes.` },
        { id: 'B', text: md`15`, note: md`Multiplies the 5 digits by the 3 places; the number of choices shrinks at each place, and the places multiply with each other.` },
        { id: 'C', text: md`60`, note: '' },
        { id: 'D', text: md`125`, note: md`This is $5^3$, which allows repeated digits such as 113; the digits must be different.` },
      ],
      answer: 'C',
      workingMd: md`5 choices for the first digit, 4 for the second, 3 for the third: $5 \times 4 \times 3 = 60$. Check: each of the $\binom{5}{3} = 10$ sets of digits can be ordered in $3! = 6$ ways, and $10 \times 6 = 60$.`,
      lesson: 'Order matters and no repeats: multiply the shrinking number of choices.',
    },
    {
      id: 'check-two-black',
      title: 'Two black cards',
      topic: 'Quantitative reasoning: probability',
      stemMd: md`A box holds 4 red cards and 2 black cards. Two cards are drawn at random without replacement. What is the probability that both are black?`,
      options: [
        { id: 'A', text: md`$\frac{1}{15}$`, note: '' },
        { id: 'B', text: md`$\frac{1}{9}$`, note: md`This is $\frac{2}{6} \times \frac{2}{6}$, which puts the first card back; without replacement only 1 black card remains among 5.` },
        { id: 'C', text: md`$\frac{2}{15}$`, note: md`Counts the black pair in both orders on top but uses the 15 unordered pairs underneath; top and bottom must be counted the same way.` },
        { id: 'D', text: md`$\frac{1}{3}$`, note: md`This is the chance that the first card alone is black; the second card must be black too.` },
      ],
      answer: 'A',
      workingMd: md`Step by step: $\frac{2}{6} \times \frac{1}{5} = \frac{2}{30} = \frac{1}{15}$. By counting: there are $\binom{6}{2} = 15$ pairs, and only 1 of them is the two black cards, so $\frac{1}{15}$.`,
      lesson: 'Without replacement, update the counts after each draw, or count unordered pairs top and bottom.',
    },
    {
      id: 'check-at-least-one-head',
      title: 'At least one head',
      topic: 'Quantitative reasoning: probability',
      stemMd: md`A fair coin is tossed three times. What is the probability of at least one head?`,
      options: [
        { id: 'A', text: md`$\frac{1}{2}$`, note: md`This is the probability of a head on a single toss; three tosses give three chances.` },
        { id: 'B', text: md`$\frac{3}{8}$`, note: md`This is the probability of exactly one head; "at least one" also includes two or three heads.` },
        { id: 'C', text: md`$\frac{7}{8}$`, note: '' },
        { id: 'D', text: md`$\frac{3}{2}$`, note: md`Adds $\frac{1}{2}$ three times, double counting outcomes with several heads; a probability can never exceed 1.` },
      ],
      answer: 'C',
      workingMd: md`The only outcome with no head is tails three times, with probability $\left(\frac{1}{2}\right)^3 = \frac{1}{8}$. So $P(\text{at least one head}) = 1 - \frac{1}{8} = \frac{7}{8}$. Check: of the 8 equally likely sequences, all but TTT contain a head.`,
      lesson: '"At least one" is one minus the probability of none.',
    },
  ],
  takeaways: [
    'If swapping two chosen items changes the outcome, order matters; otherwise use combinations.',
    md`$\binom{n}{r}$ is the ordered count divided by $r!$.`,
    'Probability is favourable over total, with both counted the same way.',
    md`"At least one" is $1 - P(\text{none})$.`,
    'Without replacement, change the counts after every draw.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
