import { md, type Lesson } from '../../types';

export const conditionalProbabilityAndExpectedValueLesson: Lesson = {
  slug: 'conditional-probability-and-expected-value',
  title: 'Conditional probability, Bayes and expected value',
  summary: 'Read conditional probabilities from tables, solve Bayes problems with 1,000 imagined cases, and compute expected values and binomial chances.',
  minutes: 25,
  objectives: [
    'Compute a conditional probability from a table or a tree, and test two events for independence.',
    'Solve a Bayes problem, false positives included, by imagining 1,000 cases.',
    'Compute an expected value, net of any cost, and use the binomial formula with its mean and variance.',
  ],
  teachMd: md`
### Given means a smaller world

$P(A \mid B)$, read "the probability of A given B", is the chance of A once you know that B has happened. Knowing B rules out every outcome outside B, so B becomes the new whole:
$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}.$$
With counts, it is the number of cases with both A and B divided by the number of cases with B. Take 200 surveyed graduates:

| | Works in finance | Works elsewhere | Total |
| --- | --- | --- | --- |
| Studied economics | 48 | 72 | 120 |
| Studied another subject | 16 | 64 | 80 |
| Total | 64 | 136 | 200 |

$P(\text{finance} \mid \text{economics}) = \frac{48}{120} = 0.4$, because the economics row is the new whole. $P(\text{economics} \mid \text{finance}) = \frac{48}{64} = 0.75$, because now the finance column is. Same numerator, different questions, different answers. Before dividing, name the group the question puts you in; its total goes underneath.

Rearranging the definition gives the multiplication rule, $P(A \cap B) = P(B) \cdot P(A \mid B)$, which is what you apply along each branch of a probability tree. The draws without replacement in [counting and probability](/courses/bocconi-master/counting-and-probability) used exactly this rule.

### Independence

A and B are **independent** when knowing one leaves the chance of the other unchanged: $P(A \mid B) = P(A)$. The easiest test to apply is
$$P(A \cap B) = P(A) \cdot P(B).$$
In the table, $P(\text{economics}) \cdot P(\text{finance}) = 0.6 \times 0.32 = 0.192$, but $P(\text{both}) = \frac{48}{200} = 0.24$, so subject and job are not independent. Equivalently, $0.4 \ne 0.32$: economics graduates are more likely than the group as a whole to work in finance.

Independent does not mean mutually exclusive. Two events that cannot happen together have $P(A \cap B) = 0$, so if each has a positive chance they fail the test: learning that one happened tells you the other did not.

### Bayes: imagine 1,000 cases

Bayes questions give the chance of the evidence given the cause and ask for the reverse. By hand, the safest route is to turn the percentages into counts for an imagined group of 1,000. Suppose 10% of borrowers default, and a credit model flags 90% of the borrowers who default and 10% of those who do not:

| | Flagged | Not flagged | Total |
| --- | --- | --- | --- |
| Default | 90 | 10 | 100 |
| No default | 90 | 810 | 900 |
| Total | 180 | 820 | 1,000 |

A flagged borrower is one of 180, and 90 of them default: $P(\text{default} \mid \text{flagged}) = \frac{90}{180} = \frac{1}{2}$. The model catches 90% of defaulters yet is right only half the time when it flags someone, because its 10% false-positive rate applies to a group nine times as large. When the cause is rare, false positives can match or outnumber true ones.

Bayes' theorem says the same in symbols, with $D$ for default and $F$ for flagged:
$$P(D \mid F) = \frac{P(F \mid D)\,P(D)}{P(F \mid D)\,P(D) + P(F \mid \text{not } D)\,P(\text{not } D)} = \frac{0.09}{0.09 + 0.09} = \frac{1}{2}.$$
The denominator is the flagged column of the table. If a percentage of 1,000 is not a whole number, imagine 10,000 instead.

### Expected value

A payoff $X$ that takes the values $x_1, x_2, \ldots$ with probabilities $p_1, p_2, \ldots$ has expected value
$$E[X] = x_1 p_1 + x_2 p_2 + \cdots,$$
a weighted average with the probabilities as weights. It is the average result per play over many repetitions, not necessarily a result that can occur: one roll of a fair die has expected value 3.5. Check first that the probabilities add to 1. A cost paid in every case comes off once at the end: with a €10 ticket and an expected prize of €7, the expected net result is a loss of €3 per ticket. Expected values also add and scale: $E[X + Y] = E[X] + E[Y]$ and $E[aX + b] = aE[X] + b$.

A 2024 sample test on Bocconi's website, not linked from the current test page, included items on expected values. Bocconi publishes no topic list for quantitative reasoning, so treat this as a useful tool rather than a promised topic. The lesson on [scoring, pacing and guessing](/courses/bocconi-master/scoring-pacing-and-guessing) applies expected value to guessing under negative marking.

### The binomial distribution

Repeat the same trial $n$ times, independently, with success probability $p$ each time. The number of successes $X$ then follows the binomial distribution:
$$P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k}.$$
Any one order with $k$ successes and $n - k$ failures has probability $p^k (1 - p)^{n - k}$, and $\binom{n}{k}$ counts the orders, that is, which $k$ of the $n$ trials succeed. Exactly 3 heads in 5 tosses of a fair coin: $\binom{5}{3} \left(\frac{1}{2}\right)^5 = \frac{10}{32} = \frac{5}{16}$.

The mean and variance are
$$E[X] = np, \qquad \operatorname{Var}(X) = np(1 - p),$$
and the standard deviation is $\sqrt{np(1 - p)}$. For 100 tosses of a fair coin, the mean is 50, the variance 25 and the standard deviation 5.

The formula needs a fixed number of trials, two outcomes per trial, the same $p$ every time, and independence. Drawing from a small bag without replacement is not binomial, because each draw's chances depend on what came out before.
`,
  examples: [
    {
      id: 'example-rare-fault',
      title: 'A test for a rare fault',
      problemMd: md`Of the chips a factory makes, 2% are faulty. A quality test flags 95% of faulty chips and 5% of good chips. A chip is flagged. What is the probability that it is faulty?`,
      steps: [
        md`Imagine 1,000 chips: 20 faulty and 980 good.`,
        md`Faulty and flagged: 95% of 20 is 19. Good but flagged: 5% of 980 is 49.`,
        md`Given a flag, the chip is one of the $19 + 49 = 68$ flagged chips, and 19 of those are faulty: $P(\text{faulty} \mid \text{flagged}) = \frac{19}{68}$.`,
        md`Estimate: $\frac{17}{68} = \frac{1}{4}$, so $\frac{19}{68}$ is a little more, about 0.28. Check by the formula: $\frac{0.95 \times 0.02}{0.95 \times 0.02 + 0.05 \times 0.98} = \frac{0.019}{0.068} = \frac{19}{68}$.`,
      ],
      answerMd: md`$\frac{19}{68}$, about 28%. The tempting 95% is the chance of a flag given a fault, the reverse conditional. Most flagged chips are good, because good chips are 49 times as common as faulty ones.`,
    },
    {
      id: 'example-project-value',
      title: 'Expected value net of cost',
      problemMd: md`Developing a product costs €2 million. The firm estimates a 30% chance that the product earns €10 million, a 50% chance that it earns €2 million and a 20% chance that it earns nothing. What is the expected net value of developing it?`,
      steps: [
        md`Check the probabilities: $0.3 + 0.5 + 0.2 = 1$.`,
        md`Expected earnings: $0.3 \times 10 + 0.5 \times 2 + 0.2 \times 0 = 3 + 1 + 0 = 4$ million euros.`,
        md`The €2 million is paid in every case, so subtract it once: $4 - 2 = 2$ million euros.`,
        md`Check with the net outcomes, which are $+8$, $0$ and $-2$ million: $0.3 \times 8 + 0.5 \times 0 + 0.2 \times (-2) = 2.4 - 0.4 = 2$ million.`,
      ],
      answerMd: md`An expected net value of €2 million. Forgetting the cost gives €4 million. €2 million is not one of the possible net results (+€8 million, €0 or −€2 million); it is the long-run average.`,
    },
    {
      id: 'example-start-ups',
      title: 'Four independent start-ups',
      problemMd: md`A fund backs 4 start-ups. Each succeeds with probability $\frac{1}{5}$, independently of the others. Find the probability that exactly one succeeds, the probability that at least one succeeds, and the mean and standard deviation of the number of successes.`,
      steps: [
        md`This is binomial with $n = 4$ and $p = \frac{1}{5}$. Exactly one: $\binom{4}{1} \cdot \frac{1}{5} \cdot \left(\frac{4}{5}\right)^3 = 4 \cdot \frac{1}{5} \cdot \frac{64}{125} = \frac{256}{625}$, about 0.41.`,
        md`At least one is the complement of none: $1 - \left(\frac{4}{5}\right)^4 = 1 - \frac{256}{625} = \frac{369}{625}$, about 0.59.`,
        md`Mean: $np = 4 \times \frac{1}{5} = 0.8$. Variance: $np(1 - p) = 4 \times \frac{1}{5} \times \frac{4}{5} = \frac{16}{25} = 0.64$, so the standard deviation is $\sqrt{0.64} = 0.8$.`,
        md`Check: the probabilities of 0, 1, 2, 3 and 4 successes are $\frac{256}{625}$, $\frac{256}{625}$, $\frac{96}{625}$, $\frac{16}{625}$ and $\frac{1}{625}$, which add to 1.`,
      ],
      answerMd: md`Exactly one: $\frac{256}{625} \approx 0.41$. At least one: $\frac{369}{625} \approx 0.59$. Mean 0.8, standard deviation 0.8. Leaving out $\binom{4}{1} = 4$ gives $\frac{64}{625} \approx 0.10$, the chance that one particular start-up is the only success.`,
    },
  ],
  traps: [
    {
      title: 'Reversing the condition',
      md: md`"90% of defaulters are flagged" is $P(\text{flagged} \mid \text{default})$, not $P(\text{default} \mid \text{flagged})$. The two share a numerator but divide by different groups. Name the group the question says you are in; its total goes underneath.`,
    },
    {
      title: 'Forgetting the false positives',
      md: md`A small false-positive rate applied to a large group produces many false alarms. In a Bayes question, count both routes to the evidence, true and false, before dividing. A table of 1,000 cases makes both routes visible.`,
    },
    {
      title: 'Dividing by everyone',
      md: md`Dividing the flagged defaulters by all 1,000 borrowers gives $P(\text{default and flagged})$, a joint probability. "Given flagged" means dividing by the flagged total only.`,
    },
    {
      title: 'Charging the cost only when you win',
      md: md`An entry fee or an upfront cost is paid in every outcome, including the ones that pay nothing. Subtract it from the expected payoff once, or from every outcome before weighting; never from the winning outcomes alone.`,
    },
    {
      title: 'Leaving out the binomial coefficient',
      md: md`$p^k (1 - p)^{n - k}$ is the probability of one particular order of successes and failures. Multiply by $\binom{n}{k}$, the number of orders, unless the question fixes which trials succeed.`,
    },
  ],
  check: [
    {
      id: 'check-screening-flag',
      title: 'A flagged firm',
      topic: 'Quantitative reasoning: conditional probability',
      stemMd: md`In a region, 5% of firms underreport their taxes. A screening system flags 80% of the firms that underreport and 10% of the firms that do not. A firm is flagged. What is the probability that it underreports?`,
      options: [
        { id: 'A', text: md`$\frac{1}{25}$`, note: md`This is 40 out of all 1,000 firms, the chance that a firm both underreports and is flagged; given the flag, divide by the 135 flagged firms only.` },
        { id: 'B', text: md`$\frac{8}{27}$`, note: '' },
        { id: 'C', text: md`$\frac{8}{19}$`, note: md`Divides the 40 true flags by the 95 false flags; the denominator must be all 135 flagged firms.` },
        { id: 'D', text: md`$\frac{4}{5}$`, note: md`This is the chance of a flag given underreporting, the reverse conditional; it ignores the 95 firms that are flagged although they report correctly.` },
      ],
      answer: 'B',
      workingMd: md`Imagine 1,000 firms: 50 underreport and 950 do not. Flagged: 80% of 50 is 40, and 10% of 950 is 95, so 135 firms are flagged. Then $P(\text{underreports} \mid \text{flagged}) = \frac{40}{135} = \frac{8}{27}$, about 0.30. Check by the formula: $\frac{0.8 \times 0.05}{0.8 \times 0.05 + 0.1 \times 0.95} = \frac{0.04}{0.135} = \frac{8}{27}$.`,
      lesson: 'Imagine 1,000 cases and divide within the group you are told about: here, the flagged firms.',
    },
    {
      id: 'check-dice-game',
      title: 'A game with an entry fee',
      topic: 'Quantitative reasoning: expected value',
      stemMd: md`A game costs €5 to play. A fair six-sided die is rolled once: a 6 pays €12, a 4 or a 5 pays €6, and any other result pays nothing. What is the expected net result of one play?`,
      options: [
        { id: 'A', text: md`A loss of €1`, note: '' },
        { id: 'B', text: md`A gain of €1`, note: md`Averages the three payoffs, $\frac{12 + 6 + 0}{3} = 6$, as if each were equally likely, then takes off the €5; a 4 or a 5 has probability $\frac{2}{6}$ and nothing has $\frac{3}{6}$.` },
        { id: 'C', text: md`A gain of €1.50`, note: md`Subtracts the €5 from the winning outcomes only, $7 \times \frac{1}{6} + 1 \times \frac{2}{6} = 1.5$; a player who wins nothing has still paid €5.` },
        { id: 'D', text: md`A gain of €4`, note: md`This is the expected prize before the €5 cost is taken off.` },
      ],
      answer: 'A',
      workingMd: md`Expected prize: $12 \times \frac{1}{6} + 6 \times \frac{2}{6} + 0 \times \frac{3}{6} = 2 + 2 + 0 = 4$ euros. Net of the €5 cost: $4 - 5 = -1$, a loss of €1 per play. Check with net outcomes of $+7$, $+1$ and $-5$: $\frac{7}{6} + \frac{2}{6} - \frac{15}{6} = -\frac{6}{6} = -1$.`,
      lesson: 'Weight each payoff by its probability, then subtract a cost that is paid in every case.',
    },
    {
      id: 'check-defective-parts',
      title: 'Defective parts',
      topic: 'Quantitative reasoning: binomial probability',
      stemMd: md`Each part a machine makes is defective with probability 0.1, independently of the others. In a batch of 5 parts, what is the probability that exactly 2 are defective?`,
      options: [
        { id: 'A', text: md`0.00729`, note: md`Leaves out $\binom{5}{2} = 10$: $(0.1)^2 (0.9)^3$ is the probability of one particular order, such as the first two parts being the defective ones.` },
        { id: 'B', text: md`0.0081`, note: md`Swaps the exponents, $10 \times (0.1)^3 \times (0.9)^2$, which is the probability of exactly 3 defective parts.` },
        { id: 'C', text: md`0.0729`, note: '' },
        { id: 'D', text: md`0.1`, note: md`Computes $10 \times (0.1)^2$ and drops $(0.9)^3$; the other three parts must also be good.` },
      ],
      answer: 'C',
      workingMd: md`Binomial with $n = 5$, $k = 2$, $p = 0.1$: $\binom{5}{2} (0.1)^2 (0.9)^3 = 10 \times 0.01 \times 0.729 = 0.0729$. By hand, $0.9^2 = 0.81$ and $0.81 \times 0.9 = 0.729$.`,
      lesson: md`Multiply one order's probability, $p^k (1 - p)^{n - k}$, by the number of orders, $\binom{n}{k}$.`,
    },
  ],
  takeaways: [
    md`$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$: the group you are told about supplies the denominator.`,
    md`A and B are independent exactly when $P(A \cap B) = P(A) \cdot P(B)$.`,
    'For Bayes, imagine 1,000 cases, split them by cause and then by evidence, and divide within the evidence group.',
    'Expected value is a probability-weighted average; subtract a cost that is paid in every case.',
    md`Binomial: $P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k}$, with mean $np$ and variance $np(1 - p)$.`,
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-algebra-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
