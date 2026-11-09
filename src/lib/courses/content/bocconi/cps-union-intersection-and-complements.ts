import { md, type Lesson } from '../../types';

export const unionIntersectionAndComplementsLesson: Lesson = {
  slug: 'union-intersection-and-complements',
  title: 'Union, intersection and complement of events',
  summary: 'Use the addition rule, complements and independence to find "or", "and", "neither" and "at least one" probabilities, with a frequency table as a check.',
  minutes: 22,
  objectives: [
    'Apply the addition rule for "A or B" and know when the overlap term vanishes.',
    'Move between "both", "neither", "exactly one" and "at least one" with complements.',
    'Tell mutually exclusive events from independent events and use the product rule for independent ones.',
  ],
  teachMd: md`
### Events are sets

An event is a set of outcomes, so the language of sets carries over directly.

| Words | Set notation | Meaning |
| --- | --- | --- |
| $A$ or $B$ (or both) | $A \cup B$ | at least one of them happens |
| $A$ and $B$ | $A \cap B$ | both happen |
| not $A$ | $\overline{A}$ | $A$ does not happen |
| $A$ and $B$ cannot both happen | $A \cap B = \varnothing$ | mutually exclusive (disjoint) |

In probability, "or" is inclusive unless the question says "exactly one" or "either … but not both".

### The addition rule

$$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$

Adding $P(A)$ and $P(B)$ counts the overlap twice, once inside each, so it is subtracted once. Draw a Venn diagram with the overlap in the middle and the reason is visible. Only when $A$ and $B$ are **mutually exclusive** is the overlap empty, and then $P(A \cup B) = P(A) + P(B)$.

For three events the same idea gives
$$P(A \cup B \cup C) = P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C).$$

### Complements and De Morgan

$P(\overline{A}) = 1 - P(A)$. The two rules that link complements with "and" and "or" are De Morgan's laws:
$$\overline{A \cup B} = \overline{A} \cap \overline{B}, \qquad \overline{A \cap B} = \overline{A} \cup \overline{B}.$$
In words: "not ($A$ or $B$)" is "neither"; "not ($A$ and $B$)" is "not both", which still allows one of them. So
$$P(\text{neither}) = 1 - P(A \cup B), \qquad P(\text{not both}) = 1 - P(A \cap B).$$
These two are easy to swap under time pressure, and a multiple-choice question may well offer both.

### The four regions

Two events split the sample space into four regions: only $A$, only $B$, both, neither. Most questions give you three numbers and ask for a fourth, and the safest way to work is to fill in the four regions:

- both $= P(A \cap B)$
- only $A = P(A) - P(A \cap B)$, only $B = P(B) - P(A \cap B)$
- neither $= 1 - P(A \cup B)$
- exactly one $=$ only $A$ $+$ only $B$ $= P(A \cup B) - P(A \cap B)$

The four regions must add up to 1. Using a group of 100 people (or 1000) instead of decimals turns the regions into whole numbers, which is quicker without a calculator and makes mistakes visible.

### Independent events

$A$ and $B$ are **independent** when knowing that one happened does not change the probability of the other. Then
$$P(A \cap B) = P(A) \times P(B).$$
Separate coin tosses, separate dice and draws with replacement are independent. Draws without replacement are not.

Independence is not the same as mutual exclusivity; for events with positive probability the two ideas are opposites. If $A$ and $B$ are mutually exclusive, knowing that $A$ happened tells you $B$ did **not** happen, which is as far from independence as it gets. Read the question for which one it states.

### At least one, for independent events

The complement of "at least one happens" is "none happens", and for independent events "none" is a product:
$$P(\text{at least one}) = 1 - P(\overline{A})\,P(\overline{B})\cdots$$
For two events this agrees with the addition rule. If $P(A) = 0.3$ and $P(B) = 0.5$ independently, then $1 - 0.7 \times 0.5 = 0.65$, and $0.3 + 0.5 - 0.15 = 0.65$ too.

### Divisibility questions

"A whole number from 1 to $N$ is chosen at random; what is the probability that it is divisible by 3 or 4?" is a union question. Count multiples of each, then subtract the multiples of both, which are the multiples of the least common multiple, here 12. A second check: the pattern repeats every 12 numbers, so count within one block of 12 and scale up.
`,
  examples: [
    {
      id: 'example-divisible-by-3-or-4',
      title: 'Divisible by 3 or by 4',
      problemMd: md`A whole number from 1 to 60 is chosen at random. What is the probability that it is divisible by 3 or by 4?`,
      steps: [
        md`Multiples of 3 up to 60: $\frac{60}{3} = 20$. Multiples of 4: $\frac{60}{4} = 15$. Multiples of both are multiples of 12: $\frac{60}{12} = 5$.`,
        md`Addition rule in counts: $20 + 15 - 5 = 30$, so $P = \frac{30}{60} = \frac{1}{2}$.`,
        md`Check with one block of 12: the numbers divisible by 3 or 4 are 3, 4, 6, 8, 9, 12, six of them. There are 5 blocks in 60, so $6 \times 5 = 30$.`,
      ],
      answerMd: md`$\frac{1}{2}$. Forgetting to subtract the overlap gives $\frac{35}{60} = \frac{7}{12}$, because 12, 24, 36, 48 and 60 are counted twice.`,
    },
    {
      id: 'example-newspaper-and-podcast',
      title: 'Filling the four regions',
      problemMd: md`In a town, 60% of adults read a daily newspaper, 50% listen to a news podcast, and 20% do neither. What percentage do both? What percentage do exactly one?`,
      steps: [
        md`At least one: $P(N \cup Q) = 1 - 0.20 = 0.80$.`,
        md`Addition rule rearranged: $P(N \cap Q) = P(N) + P(Q) - P(N \cup Q) = 0.60 + 0.50 - 0.80 = 0.30$.`,
        md`Exactly one: $P(N \cup Q) - P(N \cap Q) = 0.80 - 0.30 = 0.50$.`,
        md`Check with 100 adults: both 30, newspaper only $60 - 30 = 30$, podcast only $50 - 30 = 20$, neither 20. Total $30 + 30 + 20 + 20 = 100$.`,
      ],
      answerMd: md`30% do both and 50% do exactly one. Taking "both" as $60\% \times 50\% = 30\%$ happens to match here, but it assumes independence, which the data do not state; the addition rule is the method that always works.`,
    },
    {
      id: 'example-two-machines',
      title: 'At least one failure',
      problemMd: md`Two machines work independently. On a given day the first breaks down with probability 0.1 and the second with probability 0.2. Find the probability that at least one breaks down, and that exactly one breaks down.`,
      steps: [
        md`None breaks down: by independence, $0.9 \times 0.8 = 0.72$. At least one: $1 - 0.72 = 0.28$.`,
        md`Check with the addition rule: $P(\text{both}) = 0.1 \times 0.2 = 0.02$, so $0.1 + 0.2 - 0.02 = 0.28$.`,
        md`Exactly one: first only $0.1 \times 0.8 = 0.08$, second only $0.9 \times 0.2 = 0.18$, total $0.26$.`,
        md`Check: the four regions are both 0.02, first only 0.08, second only 0.18, neither 0.72; they add up to 1.`,
      ],
      answerMd: md`At least one: 0.28; exactly one: 0.26. Simply adding $0.1 + 0.2 = 0.30$ counts the day when both break down twice.`,
    },
  ],
  traps: [
    {
      title: 'Adding without subtracting the overlap',
      md: md`$P(A) + P(B)$ is $P(A \cup B)$ only for mutually exclusive events. If a sum of probabilities exceeds 1, the overlap was certainly ignored; if it does not, it may still have been. Ask whether both can happen at once.`,
    },
    {
      title: 'Neither versus not both',
      md: md`"Not both" is $1 - P(A \cap B)$ and includes the cases where one happens. "Neither" is $1 - P(A \cup B)$. The options may list both numbers; write the four regions and point to the one asked for.`,
    },
    {
      title: 'Confusing mutually exclusive with independent',
      md: md`Mutually exclusive means $P(A \cap B) = 0$; independent means $P(A \cap B) = P(A)P(B)$. With $P(A) = 0.3$ and $P(B) = 0.4$, the union is $0.7$ in the first case and $0.58$ in the second. Never multiply probabilities unless independence is given or obvious.`,
    },
    {
      title: 'Adding probabilities for "at least one"',
      md: md`For two independent attempts at 0.7 each, $0.7 + 0.7 = 1.4$ is not even a probability. Use $1 - 0.3 \times 0.3 = 0.91$.`,
    },
  ],
  check: [
    {
      id: 'check-neither-event',
      title: 'Neither event',
      topic: 'Union and intersection of events',
      stemMd: md`For two events, $P(A) = 0.5$, $P(B) = 0.4$ and $P(A \cap B) = 0.15$. What is the probability that neither $A$ nor $B$ happens?`,
      options: [
        { id: 'A', text: md`0.10`, note: md`Uses $1 - (0.5 + 0.4)$, forgetting to subtract the overlap, so the union is overstated as 0.9.` },
        { id: 'B', text: md`0.25`, note: '' },
        { id: 'C', text: md`0.75`, note: md`This is $P(A \cup B)$, the probability that at least one happens; the question asks for the complement.` },
        { id: 'D', text: md`0.85`, note: md`This is $1 - P(A \cap B)$, the probability of "not both", which still includes the cases where exactly one event happens.` },
      ],
      answer: 'B',
      workingMd: md`$P(A \cup B) = 0.5 + 0.4 - 0.15 = 0.75$, so $P(\text{neither}) = 1 - 0.75 = 0.25$. Check with 100 outcomes: both 15, only $A$ 35, only $B$ 25, neither $100 - 75 = 25$.`,
      lesson: 'Neither is the complement of the union, and the union needs the overlap subtracted.',
    },
    {
      id: 'check-divisible-by-4-or-6',
      title: 'Divisible by 4 or by 6',
      topic: 'Union and intersection of events',
      stemMd: md`A whole number from 1 to 120 is chosen at random. What is the probability that it is divisible by 4 or by 6?`,
      options: [
        { id: 'A', text: md`$\frac{1}{12}$`, note: md`This is the probability of being divisible by both, that is by 12: the intersection, not the union.` },
        { id: 'B', text: md`$\frac{1}{3}$`, note: '' },
        { id: 'C', text: md`$\frac{5}{12}$`, note: md`Adds the 30 multiples of 4 and the 20 multiples of 6 without removing the 10 multiples of 12, which were counted twice.` },
        { id: 'D', text: md`$\frac{2}{3}$`, note: md`This is the probability of being divisible by neither 4 nor 6, the complement of the event asked for.` },
      ],
      answer: 'B',
      workingMd: md`Multiples of 4: 30. Multiples of 6: 20. Multiples of both, that is of 12 (not of 24): 10. Union: $30 + 20 - 10 = 40$, so $P = \frac{40}{120} = \frac{1}{3}$. Check on one block of 12: 4, 6, 8, 12 are the four numbers that qualify, and $\frac{4}{12} = \frac{1}{3}$.`,
      lesson: 'For "divisible by a or b", subtract the multiples of the least common multiple.',
    },
    {
      id: 'check-two-attempts',
      title: 'Two attempts',
      topic: 'Union and intersection of events',
      stemMd: md`A basketball player scores a free throw with probability 0.7, and different throws are independent. She takes two throws. What is the probability that she scores at least once?`,
      options: [
        { id: 'A', text: md`0.42`, note: md`This is the probability of scoring exactly once, $2 \times 0.7 \times 0.3$; scoring twice also counts as "at least once".` },
        { id: 'B', text: md`0.49`, note: md`This is the probability of scoring both times, $0.7 \times 0.7$.` },
        { id: 'C', text: md`0.51`, note: md`This is $1 - 0.49$, the probability of not scoring both times, which includes missing both.` },
        { id: 'D', text: md`0.91`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Missing both: $0.3 \times 0.3 = 0.09$. At least once: $1 - 0.09 = 0.91$. Check: exactly once $0.42$ plus twice $0.49$ gives $0.91$.`,
      lesson: 'At least one is one minus none, and for independent trials "none" is a product.',
    },
  ],
  takeaways: [
    md`$P(A \cup B) = P(A) + P(B) - P(A \cap B)$; drop the last term only for mutually exclusive events.`,
    md`Neither is $1 - P(A \cup B)$; not both is $1 - P(A \cap B)$.`,
    md`Multiply probabilities only for independent events; mutually exclusive events with positive probability are never independent.`,
    'Fill the four regions with counts out of 100 and check that they add up.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-probability-union-intersection' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
