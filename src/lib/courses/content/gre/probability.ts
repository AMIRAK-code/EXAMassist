import { md, type Lesson } from '../../types';

export const probabilityLesson: Lesson = {
  slug: 'probability',
  title: 'Probability: compound events and conditional probability',
  summary: 'Find probabilities by counting, combine events with "and", "or" and "not", draw without replacement, and read conditional probabilities from a two-way table.',
  minutes: 24,
  objectives: [
    'Compute a probability by counting equally likely outcomes, and use the complement for "at least one".',
    'Combine events with the addition rule and, for independent or dependent events, the multiplication rule.',
    'Find a conditional probability from a two-way table and tell P(A given B) from P(B given A).',
  ],
  teachMd: md`
### Probability as a fraction of outcomes

When every outcome is equally likely,

$$P(\text{event}) = \frac{\text{number of favourable outcomes}}{\text{total number of outcomes}}.$$

A probability is always between 0 (impossible) and 1 (certain). Drawing one marble from a bag of 5 red, 3 blue and 2 green, $P(\text{blue}) = \frac{3}{10}$. Everything in this lesson either counts outcomes like this or combines probabilities you already have.

### "Not": the complement

The probability that an event does **not** happen is

$$P(\text{not } A) = 1 - P(A).$$

This is the tool for "at least one". Counting all the ways to get at least one success is messy; the only way to fail is to get **no** successes, which is usually one simple case. So $P(\text{at least one}) = 1 - P(\text{none})$.

### "Or": the addition rule

$$P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)$$

The subtraction removes outcomes counted in both, exactly as in a Venn diagram. If $A$ and $B$ cannot happen together (they are **mutually exclusive**), $P(A \text{ and } B) = 0$ and the probabilities simply add. Rolling a fair six-sided die, "even" and "greater than 4" overlap at 6, so $P = \frac{3}{6} + \frac{2}{6} - \frac{1}{6} = \frac{4}{6} = \frac{2}{3}$; listing the outcomes 2, 4, 5, 6 confirms it.

### "And": the multiplication rule

Two events are **independent** if knowing that one happened does not change the probability of the other: separate coin tosses, separate dice, draws **with** replacement. For independent events,

$$P(A \text{ and } B) = P(A) \times P(B).$$

When the first event changes the situation for the second, the events are **dependent**, and you multiply by the probability of the second **given** the first:

$$P(A \text{ and } B) = P(A) \times P(B \mid A).$$

Drawing without replacement is the usual case. From the bag of 10 marbles above, the probability that two draws are both red is $\frac{5}{10} \times \frac{4}{9}$, because after one red marble is gone, 4 of the 9 left are red.

Do not confuse "independent" with "mutually exclusive". Mutually exclusive events with positive probabilities are never independent: if one happens, the other's probability drops to 0.

### Probability by counting

When the process is a selection, counting methods give the probability directly. The chance that a random group of 2 from the 10 marbles is both red is

$$\frac{\binom{5}{2}}{\binom{10}{2}} = \frac{10}{45} = \frac{2}{9},$$

the same as $\frac{5}{10} \times \frac{4}{9} = \frac{20}{90} = \frac{2}{9}$. Having two routes gives you a check.

When an outcome can happen in more than one order (one red and one blue, say), multiplying along one order counts only that order. Either add the orders, or count unordered groups.

### Conditional probability

$P(A \mid B)$, read "the probability of $A$ given $B$", is the probability of $A$ when you already know $B$ happened. Knowing $B$ shrinks the set of possible outcomes to $B$ itself:

$$P(A \mid B) = \frac{P(A \text{ and } B)}{P(B)}.$$

With a two-way table of counts, this is just a fraction of one row or one column: the count in the cell for "$A$ and $B$" divided by the total for $B$. The word after "given" (or after "of those who", "among") names the total you divide by.

$P(A \mid B)$ and $P(B \mid A)$ are different numbers in general, because they divide by different totals. The probability that a randomly chosen basketball player is tall is high; the probability that a randomly chosen tall person plays basketball is low.

Two events are independent exactly when $P(A \mid B) = P(A)$: knowing $B$ tells you nothing new about $A$. A two-way table lets you test this by comparing a row's proportion with the overall proportion.

### A routine for any question

1. Decide what one outcome is, and whether outcomes are equally likely.
2. Translate the words: "and" multiplies, "or" adds (minus the overlap), "not" and "at least one" use the complement, "given" divides by a smaller total.
3. Check independence before multiplying.
4. Sanity-check: the answer lies between 0 and 1, and an "and" probability is no larger than either event alone.
`,
  examples: [
    {
      id: 'example-two-red',
      title: 'Two draws without replacement',
      problemMd: md`A bag holds 5 red, 3 blue and 2 green marbles. Two marbles are drawn at random without replacement. What is the probability that both are red?`,
      steps: [
        md`First draw: 5 of the 10 marbles are red, so $P(\text{first red}) = \frac{5}{10}$.`,
        md`Given that a red marble is gone, 4 of the remaining 9 are red: $P(\text{second red} \mid \text{first red}) = \frac{4}{9}$.`,
        md`Multiply: $\frac{5}{10} \times \frac{4}{9} = \frac{20}{90} = \frac{2}{9}$.`,
        md`Check by counting: $\binom{5}{2} = 10$ red pairs out of $\binom{10}{2} = 45$ pairs in all, and $\frac{10}{45} = \frac{2}{9}$.`,
      ],
      answerMd: md`The probability is $\frac{2}{9}$, about 0.22. Treating the draws as if the first marble were replaced gives $\frac{5}{10} \times \frac{5}{10} = \frac{1}{4}$, the tempting wrong answer.`,
    },
    {
      id: 'example-at-least-one-failure',
      title: 'At least one, through the complement',
      problemMd: md`On any day, a machine breaks down with probability 0.1, independently of other days. What is the probability that it breaks down on at least one of three days?`,
      steps: [
        md`"At least one" has several cases (one, two or three breakdowns). Its complement, "no breakdown on any day", is a single case.`,
        md`No breakdown on one day: $1 - 0.1 = 0.9$. On three independent days: $0.9 \times 0.9 \times 0.9 = 0.729$.`,
        md`At least one breakdown: $1 - 0.729 = 0.271$.`,
      ],
      answerMd: md`The probability is 0.271. Adding $0.1 + 0.1 + 0.1 = 0.3$ is the tempting wrong answer: it counts the days with two or three breakdowns more than once, and with enough days it would exceed 1.`,
    },
    {
      id: 'example-two-way-table',
      title: 'Conditional probability from a two-way table',
      problemMd: md`A firm's 200 employees, by department and where they work:

| | Remote | Office | Total |
| --- | --- | --- | --- |
| Engineering | 48 | 32 | 80 |
| Sales | 36 | 84 | 120 |
| Total | 84 | 116 | 200 |

An employee is chosen at random. Find $P(\text{remote} \mid \text{engineering})$ and $P(\text{engineering} \mid \text{remote})$, and decide whether working remotely is independent of department.`,
      steps: [
        md`Given engineering, the total is the Engineering row, 80, and 48 of them are remote: $\frac{48}{80} = 0.6$.`,
        md`Given remote, the total is the Remote column, 84, and 48 of them are in engineering: $\frac{48}{84} = \frac{4}{7} \approx 0.571$.`,
        md`Overall, $P(\text{remote}) = \frac{84}{200} = 0.42$.`,
        md`Since $P(\text{remote} \mid \text{engineering}) = 0.6$ is not $0.42$, knowing the department changes the probability: the events are not independent.`,
      ],
      answerMd: md`$P(\text{remote} \mid \text{engineering}) = 0.6$, $P(\text{engineering} \mid \text{remote}) = \frac{4}{7} \approx 0.571$, and the events are not independent. Using $\frac{48}{200} = 0.24$ for either conditional probability is the common slip: that is the probability of "remote and engineering".`,
    },
  ],
  traps: [
    {
      title: 'Adding probabilities that overlap',
      md: md`$P(A) + P(B)$ counts the outcomes in both events twice. Subtract $P(A \text{ and } B)$ unless the events cannot happen together. A sum above 1 is a sure sign of this error.`,
    },
    {
      title: 'Multiplying dependent events as if independent',
      md: md`Without replacement, the second draw comes from a smaller, changed collection. Reduce both the favourable count and the total before multiplying.`,
    },
    {
      title: 'Reversing a conditional probability',
      md: md`"Of the remote workers, what fraction are engineers?" divides by the remote total; "of the engineers, what fraction work remotely?" divides by the engineering total. Name the total after "given" or "of those" before writing the fraction.`,
    },
    {
      title: 'Counting only one order',
      md: md`"One red and one blue" can happen as red then blue or blue then red. Multiplying along one order gives half the answer; add both orders, or count unordered selections.`,
    },
  ],
  check: [
    {
      id: 'check-one-of-each',
      title: 'One of each colour',
      topic: 'Data Analysis: probability',
      stemMd: md`A box contains 4 white tokens and 6 black tokens. Two tokens are drawn at random without replacement. What is the probability that one token is white and the other is black?`,
      options: [
        { id: 'A', text: md`$\frac{2}{15}$`, note: md`This is the probability that both are white, $\frac{4}{10} \times \frac{3}{9}$.` },
        { id: 'B', text: md`$\frac{4}{15}$`, note: md`This counts only one order, white then black ($\frac{4}{10} \times \frac{6}{9}$); black then white is equally likely and must be added.` },
        { id: 'C', text: md`$\frac{1}{3}$`, note: md`This is the probability that both are black, $\frac{6}{10} \times \frac{5}{9}$.` },
        { id: 'D', text: md`$\frac{12}{25}$`, note: md`This is $2 \times \frac{4}{10} \times \frac{6}{10}$, which treats the draws as if the first token were put back.` },
        { id: 'E', text: md`$\frac{8}{15}$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`White then black: $\frac{4}{10} \times \frac{6}{9} = \frac{24}{90}$. Black then white: $\frac{6}{10} \times \frac{4}{9} = \frac{24}{90}$. Total: $\frac{48}{90} = \frac{8}{15}$. By counting: $4 \times 6 = 24$ mixed pairs out of $\binom{10}{2} = 45$ pairs, and $\frac{24}{45} = \frac{8}{15}$. As a further check, $\frac{2}{15} + \frac{1}{3} + \frac{8}{15} = \frac{2 + 5 + 8}{15} = 1$.`,
      lesson: 'For a mixed outcome, count every order or count unordered groups; the two routes must agree.',
    },
    {
      id: 'check-independent-or',
      title: '"Or" for independent events',
      topic: 'Quantitative Comparison',
      stemMd: md`Events $A$ and $B$ are independent, with $P(A) = 0.5$ and $P(B) = 0.4$.

| Quantity A | Quantity B |
| --- | --- |
| The probability that $A$ or $B$ (or both) occurs | 0.7 |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: md`This adds $0.5 + 0.4 = 0.9$ without removing the outcomes where both events occur.` },
        { id: 'B', text: md`Quantity B is greater.`, note: md`This comes from subtracting too much, for example treating "or" as "exactly one of them" ($0.9 - 2 \times 0.2 = 0.5$).` },
        { id: 'C', text: md`The two quantities are equal.`, note: '' },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`The overlap is not given directly, but independence fixes it: $P(A \text{ and } B) = 0.5 \times 0.4$.` },
      ],
      answer: 'C',
      workingMd: md`Because the events are independent, $P(A \text{ and } B) = 0.5 \times 0.4 = 0.2$. Then $P(A \text{ or } B) = 0.5 + 0.4 - 0.2 = 0.7$. Through the complement: $P(\text{neither}) = 0.5 \times 0.6 = 0.3$, and $1 - 0.3 = 0.7$.`,
      lesson: 'Independence gives you the overlap; then use the addition rule or the complement.',
    },
    {
      id: 'check-tea-under-30',
      title: 'Given that they prefer tea',
      topic: 'Data Analysis: conditional probability',
      stimulusMd: md`A survey of 150 people:

| | Prefers tea | Prefers coffee | Total |
| --- | --- | --- | --- |
| Under 30 | 18 | 42 | 60 |
| 30 and over | 54 | 36 | 90 |
| Total | 72 | 78 | 150 |`,
      stemMd: md`One of the people who prefer tea is chosen at random. What is the probability that this person is under 30?`,
      options: [
        { id: 'A', text: md`$\frac{3}{25}$`, note: md`This is $\frac{18}{150}$, the probability that a person from the whole survey is both under 30 and prefers tea.` },
        { id: 'B', text: md`$\frac{1}{4}$`, note: '' },
        { id: 'C', text: md`$\frac{3}{10}$`, note: md`This is $\frac{18}{60}$, the probability of preferring tea given under 30: the condition is reversed.` },
        { id: 'D', text: md`$\frac{2}{5}$`, note: md`This is $\frac{60}{150}$, the share of everyone surveyed who are under 30, ignoring that the person prefers tea.` },
        { id: 'E', text: md`$\frac{12}{25}$`, note: md`This is $\frac{72}{150}$, the probability of preferring tea, not of being under 30.` },
      ],
      answer: 'B',
      workingMd: md`The person is known to prefer tea, so the total is the tea column, 72. Of these, 18 are under 30: $\frac{18}{72} = \frac{1}{4}$.`,
      lesson: 'The condition names the row or column you divide by; the cell where both hold goes on top.',
    },
  ],
  takeaways: [
    '"And" multiplies (using the updated probability if events are dependent); "or" adds and subtracts the overlap.',
    'For "at least one", subtract the probability of "none" from 1.',
    'Without replacement, both the favourable count and the total shrink.',
    md`$P(A \mid B)$ divides by the total for $B$; it is generally not equal to $P(B \mid A)$.`,
  ],
  practice: { examKey: 'gre', domain: 'quant-data-analysis', skill: 'data-elementary-probability' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
