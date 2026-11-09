import { md, type Lesson } from '../../types';

export const normalCurveLesson: Lesson = {
  slug: 'distributions-and-the-normal-curve',
  title: 'Distributions, expected value and the normal curve',
  summary: 'Read a probability distribution, find an expected value, and use the approximate 68–95–99.7 rule and standard units to answer normal-curve questions.',
  minutes: 22,
  objectives: [
    'Check that a probability distribution is complete and find its expected value.',
    'Relate the shape of a distribution (symmetric or skewed) to its mean and median.',
    'Estimate proportions of a normal distribution with the approximate 68–95–99.7 rule.',
    'Compare values from different distributions using standard units.',
  ],
  teachMd: md`
### Random variables and their distributions

A **random variable** is a quantity whose value depends on chance: the number shown by a die, the number of defective items in a box, the height of a randomly chosen plant. Its **probability distribution** says which values it can take and how likely each is. For a variable with a short list of values, that is a table:

| Value of $X$ | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Probability | 0.5 | 0.3 | 0.15 | 0.05 |

Two rules always hold: every probability is between 0 and 1, and the probabilities add up to exactly 1. A question that leaves one probability blank is usually asking you to use the second rule.

### Expected value

The **expected value** (the mean of the distribution) weights each value by its probability:

$$E(X) = x_1 p_1 + x_2 p_2 + \cdots + x_n p_n.$$

For the table above, $E(X) = 0(0.5) + 1(0.3) + 2(0.15) + 3(0.05) = 0.75$. The expected value need not be a value $X$ can actually take; it is the long-run average over many repetitions. It is the same calculation as the mean of a frequency table, with probabilities in place of relative frequencies.

### Shape: symmetric and skewed

A frequency distribution or probability distribution has a **shape**, and the shape tells you how the mean and median compare.

| Shape | Typical relationship |
| --- | --- |
| symmetric | mean = median |
| long tail to the right (right-skewed) | mean usually greater than median |
| long tail to the left (left-skewed) | mean usually less than median |

The reason is the one from the lesson on averages: the mean is pulled towards extreme values and the median is not. Incomes, house prices and waiting times are typical right-skewed data.

A **uniform** distribution gives every value (or every equal interval) the same probability; its graph is flat.

### The normal distribution

Many measurements, such as heights of plants of one species or errors in repeated measurements, follow a bell-shaped curve called a **normal distribution**. It is described completely by two numbers: its mean $\mu$ and its standard deviation $\sigma$. Its key properties:

- It is symmetric about the mean, so the mean, median and mode are equal.
- The total area under the curve is 1 (or 100%), and the area over an interval is the proportion of values, or the probability, in that interval.
- Most of the area is near the mean and it thins out quickly on both sides.

For any normal distribution, these proportions hold **approximately** (they are rounded values, not exact ones):

| Interval | Approximate share of the data |
| --- | --- |
| within 1 standard deviation of the mean | 68% |
| within 2 standard deviations | 95% |
| within 3 standard deviations | 99.7% |

Use symmetry to split these into pieces. Since about 68% lies within one standard deviation, about 34% lies between the mean and $\mu + \sigma$, and the same between $\mu - \sigma$ and the mean. Then:

| Piece of the curve | Approximate share |
| --- | --- |
| mean to 1 SD (either side) | 34% |
| 1 SD to 2 SD (either side) | 13.5% |
| 2 SD to 3 SD (either side) | 2.35% |
| beyond 2 SD on one side | 2.5% |
| beyond 1 SD on one side | 16% |
| below the mean | 50% |

So a value one standard deviation above the mean sits at roughly the 84th percentile ($50\% + 34\%$), and one two standard deviations below sits at roughly the 2.5th percentile. All of these are approximations, so an answer built on them is approximate too; pick the choice closest to your estimate, and watch for the word "approximately" in the question.

### Standard units

To place a value $x$ on its distribution, measure its distance from the mean in standard deviations:

$$z = \frac{x - \mu}{\sigma}.$$

A positive $z$ is above the mean, a negative $z$ below it. Standard units let you compare values from different distributions: the value with the larger $z$ is higher relative to its own group, even if its raw number is smaller. They also turn any normal-curve question into the pieces above: find $z$ for each boundary, then add the matching areas.

### A method for normal-curve questions

1. Mark the mean and the points 1, 2 and 3 standard deviations either side.
2. Convert each boundary in the question into a number of standard deviations.
3. Add the pieces between the boundaries, using symmetry.
4. If the question asks for a count, multiply the proportion by the number of values.
`,
  examples: [
    {
      id: 'example-defects-distribution',
      title: 'Completing a distribution and finding its expected value',
      problemMd: md`The number of defective items, $X$, in a box has this distribution:

| $X$ | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Probability | 0.5 | 0.3 | 0.15 | $k$ |

Find $k$, the expected value of $X$, and $P(X \ge 2)$.`,
      steps: [
        md`The probabilities must add to 1: $0.5 + 0.3 + 0.15 + k = 1$, so $k = 1 - 0.95 = 0.05$.`,
        md`Expected value: $0(0.5) + 1(0.3) + 2(0.15) + 3(0.05) = 0 + 0.3 + 0.3 + 0.15 = 0.75$.`,
        md`$P(X \ge 2) = P(X = 2) + P(X = 3) = 0.15 + 0.05 = 0.2$. As a check through the complement, $1 - (0.5 + 0.3) = 0.2$.`,
      ],
      answerMd: md`$k = 0.05$, $E(X) = 0.75$, and $P(X \ge 2) = 0.2$. Averaging the four values ($\frac{0 + 1 + 2 + 3}{4} = 1.5$) is the tempting wrong expected value: it ignores that small values are much more likely.`,
    },
    {
      id: 'example-plant-heights',
      title: 'An interval that is not centred on the mean',
      problemMd: md`The heights of 400 plants are approximately normally distributed with mean 40 cm and standard deviation 5 cm. Approximately how many plants are between 35 cm and 50 cm tall?`,
      steps: [
        md`Convert the boundaries: $35 = 40 - 5$ is 1 standard deviation below the mean; $50 = 40 + 2 \times 5$ is 2 standard deviations above.`,
        md`From 1 SD below to the mean: about 34%. From the mean to 2 SD above: half of 95%, about 47.5%.`,
        md`Add the pieces: about $34\% + 47.5\% = 81.5\%$.`,
        md`Convert to a count: $0.815 \times 400 = 326$.`,
      ],
      answerMd: md`About 326 plants, roughly 81.5% of them; the figure is approximate because the 68–95–99.7 percentages are. Using 68% or 95% for the whole interval ignores that it reaches different distances on the two sides.`,
    },
    {
      id: 'example-compare-scores',
      title: 'Which score is better relative to its group?',
      problemMd: md`Ana scored 82 on a test whose scores had mean 70 and standard deviation 8. Ben scored 75 on a different test whose scores had mean 60 and standard deviation 12. Relative to the other people who took the same test, whose score was higher?`,
      steps: [
        md`Ana's standard units: $z = \frac{82 - 70}{8} = \frac{12}{8} = 1.5$.`,
        md`Ben's standard units: $z = \frac{75 - 60}{12} = \frac{15}{12} = 1.25$.`,
        md`A larger $z$ means further above the group's mean, measured in that group's own spread.`,
      ],
      answerMd: md`Ana's score is higher relative to her group (1.5 standard deviations above the mean, against Ben's 1.25). Ben's larger gap of 15 points above his mean is the tempting basis for the wrong answer: his test's scores were more spread out, so 15 points is less unusual there.`,
    },
  ],
  traps: [
    {
      title: 'Using 68% for one side',
      md: md`About 68% lies within one standard deviation on **both** sides together. Between the mean and one standard deviation above is about 34%, and above one standard deviation is about 16%. Sketch the curve and shade the region before choosing a percent.`,
    },
    {
      title: 'Treating the rule as exact',
      md: md`68%, 95% and 99.7% are rounded approximations for a normal distribution, so any answer built on them is approximate. Do not use them for a distribution that is not described as normal, or as approximately normal.`,
    },
    {
      title: 'Comparing raw scores across different distributions',
      md: md`A larger raw score, or a larger distance from the mean in points, does not make a value more unusual. Divide by each distribution's own standard deviation and compare standard units.`,
    },
    {
      title: 'Expected value as the plain average of the values',
      md: md`Each value must be weighted by its probability. The simple average of the values is the expected value only when all values are equally likely.`,
    },
  ],
  check: [
    {
      id: 'check-above-two-sd',
      title: 'The upper tail',
      topic: 'Data Analysis: distributions',
      stemMd: md`The scores on an aptitude test are approximately normally distributed with mean 250 and standard deviation 30. Approximately what percent of the scores are greater than 310?`,
      options: [
        { id: 'A', text: md`2.5%`, note: '' },
        { id: 'B', text: md`5%`, note: md`About 5% of scores are more than 2 standard deviations from the mean on **either** side; only half of that is above 310.` },
        { id: 'C', text: md`13.5%`, note: md`This is the share between 1 and 2 standard deviations above the mean, from 280 to 310, not the share above 310.` },
        { id: 'D', text: md`16%`, note: md`This is the share above 280, one standard deviation above the mean. 310 is two standard deviations above.` },
        { id: 'E', text: md`47.5%`, note: md`This is the share between the mean, 250, and 310: the part below 310, not above it.` },
      ],
      answer: 'A',
      workingMd: md`$310 = 250 + 2 \times 30$, so 310 is 2 standard deviations above the mean. About 95% of scores lie within 2 standard deviations, leaving about 5% outside, split equally between the two tails by symmetry. So about 2.5% of scores are above 310.`,
      lesson: 'Convert the boundary to standard deviations, then halve any "both sides" percent to get one tail.',
    },
    {
      id: 'check-expected-value',
      title: 'Expected value against a number',
      topic: 'Quantitative Comparison',
      stemMd: md`A random variable $X$ has this probability distribution.

| Value of $X$ | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| Probability | 0.1 | 0.2 | 0.3 | 0.4 |

| Quantity A | Quantity B |
| --- | --- |
| The expected value of $X$ | 3 |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: md`This takes the most likely value, 4, as the expected value. The expected value weights every value, including the smaller ones.` },
        { id: 'B', text: md`Quantity B is greater.`, note: md`This uses the plain average of the values, $\frac{1 + 2 + 3 + 4}{4} = 2.5$, which ignores the probabilities.` },
        { id: 'C', text: md`The two quantities are equal.`, note: '' },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`Although $X$ is random, its expected value is a fixed number computed from the distribution.` },
      ],
      answer: 'C',
      workingMd: md`$E(X) = 1(0.1) + 2(0.2) + 3(0.3) + 4(0.4) = 0.1 + 0.4 + 0.9 + 1.6 = 3.0$. The probabilities add to $0.1 + 0.2 + 0.3 + 0.4 = 1$, so the distribution is complete.`,
      lesson: 'Expected value is a probability-weighted sum, not the average of the listed values.',
    },
    {
      id: 'check-count-above',
      title: 'How many are above one standard deviation below?',
      topic: 'Data Analysis: distributions',
      stemMd: md`The weights of 1,000 packages are approximately normally distributed with mean 64 grams and standard deviation 6 grams. Approximately how many of the packages weigh more than 58 grams?`,
      options: [
        { id: 'A', text: md`160`, note: md`This is the number weighing **less** than 58 grams, the lower tail beyond one standard deviation.` },
        { id: 'B', text: md`340`, note: md`This counts only the packages between 58 and 64 grams and leaves out every package above the mean.` },
        { id: 'C', text: md`500`, note: md`This is the number above the mean, 64 grams; 58 is below the mean, so more packages qualify.` },
        { id: 'D', text: md`680`, note: md`This is the number within one standard deviation of the mean, between 58 and 70 grams; it drops the packages above 70.` },
        { id: 'E', text: md`840`, note: '' },
      ],
      answer: 'E',
      workingMd: md`$58 = 64 - 6$ is one standard deviation below the mean. Below that lies about 16% of the packages (half of the 32% outside one standard deviation), so about $100\% - 16\% = 84\%$ weigh more than 58 grams: $0.84 \times 1000 = 840$. Equivalently, $34\% + 50\% = 84\%$.`,
      lesson: 'Split the curve at the mean: add the piece on one side to the 50% on the other.',
    },
  ],
  takeaways: [
    'A probability distribution adds to 1; its expected value weights each value by its probability.',
    'Right-skewed data usually has mean above median; symmetric data has them equal.',
    'Normal curve, approximately: 68% within 1 SD, 95% within 2, 99.7% within 3; split by symmetry.',
    md`Standard units $z = \frac{x - \mu}{\sigma}$ compare values from different distributions.`,
  ],
  practice: { examKey: 'gre', domain: 'quant-data-analysis', skill: 'data-random-variables-distributions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
