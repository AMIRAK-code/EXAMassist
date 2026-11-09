import { md, type Lesson } from '../../types';

export const frequenciesCentreAndSpreadLesson: Lesson = {
  slug: 'frequencies-centre-and-spread',
  title: 'Frequencies, measures of centre and measures of spread',
  summary: 'Read absolute, relative, joint and conditional frequencies, and compute mean, median, mode, range, variance and standard deviation by hand.',
  minutes: 24,
  objectives: [
    'Turn absolute frequencies into relative, cumulative, joint and conditional frequencies.',
    'Find the mean, median and mode of a list or of a frequency table.',
    'Compute range, variance and standard deviation, and predict how they change when every value is shifted or scaled.',
  ],
  teachMd: md`
### Frequencies

A **frequency table** lists each value once with the number of times it occurs. That number is the **absolute frequency** $f_i$. Divide it by the total number of observations $n$ to get the **relative frequency** $\frac{f_i}{n}$, a share that can be written as a fraction, a decimal or a percent. Absolute frequencies add up to $n$; relative frequencies add up to 1. Checking that sum is the quickest way to catch a misread table.

The **cumulative frequency** of a value counts the observations at or below it. It is what you need to find a median from a table.

### Joint and conditional frequencies

When each observation is classified in two ways, a **two-way table** holds the counts. In the table below, 50 customers of a shop are classified by day and by how they paid.

| | Card | Cash | Total |
| --- | --- | --- | --- |
| Weekday | 18 | 12 | 30 |
| Weekend | 14 | 6 | 20 |
| Total | 32 | 18 | 50 |

- A **joint frequency** is an inner cell: 14 customers paid by card at the weekend, a joint relative frequency of $\frac{14}{50} = 0.28$.
- A **marginal frequency** is a row or column total: 32 paid by card.
- A **conditional frequency** is a cell divided by its row or column total, restricted to one group: among weekend customers, $\frac{14}{20} = 70\%$ paid by card; among card payers, $\frac{14}{32} = 43.75\%$ came at the weekend.

These are the same ideas as [conditional probability](/courses/bocconi/conditional-probability-and-bayes), with counts in place of probabilities; the only question is always which total sits in the denominator.

### Measures of centre

- **Mean:** the sum of the values divided by how many there are. From a frequency table, $\bar{x} = \frac{\sum f_i x_i}{n}$: multiply each value by its frequency, add, and divide by the total frequency $n$, **not** by the number of rows.
- **Median:** the middle value once the data are in order. With $n$ observations, it is the value in position $\frac{n+1}{2}$; when $n$ is even, that falls between two positions and the median is the mean of the two middle values. From a frequency table, use cumulative frequencies to see which value occupies the middle positions.
- **Mode:** the most frequent value. A data set can have more than one.

The mean uses every value, so a single extreme value can drag it a long way; the median does not move when the largest value grows. For data with a long tail on one side, mean and median can differ a lot.

### Measures of spread

- **Range:** largest minus smallest. Easy, but decided by two values only.
- **Variance:** the mean of the squared deviations from the mean. In this lesson we use the **population** formula, which divides by $n$:
$$\sigma^2 = \frac{1}{n}\sum (x_i - \bar{x})^2.$$
Some books divide by $n - 1$ for a sample; if a question does not say, look at the answer options, but here and in every example below the divisor is $n$.
- **Standard deviation:** the square root of the variance, $\sigma = \sqrt{\sigma^2}$. It is in the same units as the data, which is why it is the measure people quote.

An equivalent formula is often quicker by hand: the variance equals the mean of the squares minus the square of the mean,
$$\sigma^2 = \frac{1}{n}\sum x_i^2 - \bar{x}^2.$$
Use one formula and check with the other.

### Shifting and scaling the data

If every value is transformed as $y = a x + b$:

| Measure | New value |
| --- | --- |
| mean, median, mode | $a \cdot (\text{old}) + b$ |
| range, standard deviation | $\lvert a \rvert \cdot (\text{old})$ |
| variance | $a^2 \cdot (\text{old})$ |

Adding a constant moves every value by the same amount, so the centre moves and the spread does not. Multiplying stretches the distances between values, so the spread is multiplied too. These rules turn many statistics questions into one line of work.

### Working without a calculator

Choose the route with the smallest numbers. Subtract a convenient value from every observation before averaging, then add it back: the mean of 197, 199, 204 is $200 + \frac{-3 - 1 + 4}{3} = 200$. Deviations from the mean are usually small whole numbers; squaring those is faster and safer than squaring the raw data.
`,
  examples: [
    {
      id: 'example-books-frequency-table',
      title: 'Centre from a frequency table',
      problemMd: md`Twenty students were asked how many novels they read last month. The answers 0, 1, 2, 3, 4 had frequencies 3, 5, 6, 4, 2. Find the relative frequencies, the mean, the median, the mode and the range.`,
      steps: [
        md`Check the total: $3 + 5 + 6 + 4 + 2 = 20$. Relative frequencies: $0.15, 0.25, 0.30, 0.20, 0.10$, which add to 1.`,
        md`Mean: $\frac{0 \times 3 + 1 \times 5 + 2 \times 6 + 3 \times 4 + 4 \times 2}{20} = \frac{0 + 5 + 12 + 12 + 8}{20} = \frac{37}{20} = 1.85$.`,
        md`Median: $n = 20$ is even, so average the 10th and 11th values. Cumulative frequencies: up to 0 is 3, up to 1 is 8, up to 2 is 14. Positions 9 to 14 are all 2, so both middle values are 2 and the median is 2.`,
        md`Mode: 2, with frequency 6. Range: $4 - 0 = 4$.`,
        md`Check the mean with relative frequencies: $0 \times 0.15 + 1 \times 0.25 + 2 \times 0.30 + 3 \times 0.20 + 4 \times 0.10 = 0.25 + 0.6 + 0.6 + 0.4 = 1.85$.`,
      ],
      answerMd: md`Mean 1.85, median 2, mode 2, range 4. Dividing the 37 by the 5 rows instead of the 20 students would give 7.4, larger than every value in the table, which is impossible for a mean.`,
    },
    {
      id: 'example-variance-two-ways',
      title: 'Variance and standard deviation by hand',
      problemMd: md`Find the population variance and standard deviation of 3, 5, 5, 11.`,
      steps: [
        md`Mean: $\frac{3 + 5 + 5 + 11}{4} = \frac{24}{4} = 6$.`,
        md`Deviations from the mean: $-3, -1, -1, 5$. They add to 0, as deviations from the mean always do.`,
        md`Squared deviations: $9, 1, 1, 25$, total 36. Population variance: $\frac{36}{4} = 9$. Standard deviation: $\sqrt{9} = 3$.`,
        md`Check with the mean of the squares: $\frac{9 + 25 + 25 + 121}{4} = \frac{180}{4} = 45$, and $45 - 6^2 = 9$.`,
      ],
      answerMd: md`Variance 9, standard deviation 3. Dividing by $n - 1 = 3$ would give 12, the sample variance, which is not the formula used here.`,
    },
    {
      id: 'example-rescaled-scores',
      title: 'Rescaling a set of scores',
      problemMd: md`A test's scores have mean 60 and standard deviation 8. Every score is multiplied by 1.5 and then 10 points are added. Find the new mean, standard deviation and variance.`,
      steps: [
        md`The transformation is $y = 1.5x + 10$, so $a = 1.5$ and $b = 10$.`,
        md`Mean: $1.5 \times 60 + 10 = 100$.`,
        md`Standard deviation: only the factor acts, $1.5 \times 8 = 12$. The added 10 moves every score equally and leaves the distances unchanged.`,
        md`Variance: $12^2 = 144$. Check: the old variance was $64$, and $1.5^2 \times 64 = 2.25 \times 64 = 144$.`,
      ],
      answerMd: md`Mean 100, standard deviation 12, variance 144. Applying the whole rule to the standard deviation, $1.5 \times 8 + 10 = 22$, is the classic error.`,
    },
  ],
  traps: [
    {
      title: 'Dividing by the number of rows',
      md: md`The mean of a frequency table divides $\sum f_i x_i$ by the total frequency $n$, not by the number of distinct values. A "mean" larger than the largest value or smaller than the smallest shows that the wrong divisor was used.`,
    },
    {
      title: 'Taking the middle row as the median',
      md: md`The median is the middle **observation**, not the middle line of the table. Use cumulative frequencies to find which value sits in position $\frac{n+1}{2}$.`,
    },
    {
      title: 'Mixing up the two variance formulas',
      md: md`Dividing by $n$ gives the population variance; dividing by $n - 1$ gives the sample variance. State which you use and keep to it. If the options include both, the question's wording decides; here every computation divides by $n$.`,
    },
    {
      title: 'Letting a shift change the spread',
      md: md`Adding or subtracting the same number to every value leaves range, variance and standard deviation unchanged. Only multiplication changes them, and the variance by the square of the factor.`,
    },
    {
      title: 'The wrong total for a conditional frequency',
      md: md`"Among weekend customers, the share paying by card" divides by the weekend total, not by all customers and not by all card payers. Name the group after "among" before dividing.`,
    },
  ],
  check: [
    {
      id: 'check-mean-from-table',
      title: 'Mean from a frequency table',
      topic: 'Central tendency and dispersion',
      stemMd: md`In a survey of 10 households, the number of cars per household was recorded. The values 1, 2, 3, 4 had frequencies 5, 2, 2, 1. What is the mean number of cars per household?`,
      options: [
        { id: 'A', text: md`1`, note: md`This is the mode, the most frequent value, not the mean.` },
        { id: 'B', text: md`1.9`, note: '' },
        { id: 'C', text: md`2.5`, note: md`This is the mean of the four values 1, 2, 3, 4, ignoring how often each occurs.` },
        { id: 'D', text: md`4.75`, note: md`Divides the correct total of 19 cars by the 4 rows of the table instead of the 10 households.` },
      ],
      answer: 'B',
      workingMd: md`Total number of cars: $1 \times 5 + 2 \times 2 + 3 \times 2 + 4 \times 1 = 5 + 4 + 6 + 4 = 19$. Number of households: $5 + 2 + 2 + 1 = 10$. Mean: $\frac{19}{10} = 1.9$. Check with relative frequencies: $0.5 + 0.4 + 0.6 + 0.4 = 1.9$.`,
      lesson: 'Weight each value by its frequency and divide by the total frequency.',
    },
    {
      id: 'check-population-variance',
      title: 'Population variance',
      topic: 'Central tendency and dispersion',
      stemMd: md`Using the population formula (dividing by $n$), what is the variance of the data 2, 4, 6, 8, 10?`,
      options: [
        { id: 'A', text: md`$2\sqrt{2}$`, note: md`This is the standard deviation, the square root of the variance.` },
        { id: 'B', text: md`8`, note: '' },
        { id: 'C', text: md`10`, note: md`Divides the sum of squared deviations, 40, by $n - 1 = 4$: the sample formula, not the population formula the question asks for.` },
        { id: 'D', text: md`40`, note: md`This is the sum of the squared deviations, before dividing by the number of values.` },
      ],
      answer: 'B',
      workingMd: md`Mean: $\frac{30}{5} = 6$. Deviations: $-4, -2, 0, 2, 4$; squares: $16, 4, 0, 4, 16$, total 40. Variance: $\frac{40}{5} = 8$. Check: mean of squares $\frac{4 + 16 + 36 + 64 + 100}{5} = \frac{220}{5} = 44$, and $44 - 36 = 8$.`,
      lesson: 'Variance is the mean squared deviation; take the square root only when the standard deviation is asked for.',
    },
    {
      id: 'check-transformed-sd',
      title: 'Scaling and shifting',
      topic: 'Central tendency and dispersion',
      stemMd: md`A list of numbers has mean 20 and standard deviation 4. Every number is multiplied by 3, and then 5 is subtracted. What is the standard deviation of the new list?`,
      options: [
        { id: 'A', text: md`4`, note: md`Assumes the standard deviation never changes. Subtracting 5 leaves it alone, but multiplying by 3 triples it.` },
        { id: 'B', text: md`7`, note: md`Applies the whole rule, $3 \times 4 - 5$, to the standard deviation. The subtraction shifts every value equally and does not affect the spread.` },
        { id: 'C', text: md`12`, note: '' },
        { id: 'D', text: md`144`, note: md`This is the new variance, $12^2$, not the standard deviation.` },
      ],
      answer: 'C',
      workingMd: md`For $y = 3x - 5$ the standard deviation becomes $\lvert 3 \rvert \times 4 = 12$; the $-5$ shifts every value and leaves the spread unchanged. Check with the variance: old variance 16, new variance $3^2 \times 16 = 144$, and $\sqrt{144} = 12$. (The new mean is $3 \times 20 - 5 = 55$, which is not asked.)`,
      lesson: 'Shifts move the centre only; scaling multiplies the standard deviation by the factor and the variance by its square.',
    },
  ],
  takeaways: [
    'Relative frequency is count over total; conditional frequency is count over the total of the group you are restricted to.',
    md`The mean of a frequency table is $\frac{\sum f_i x_i}{n}$; the median is the value in position $\frac{n+1}{2}$.`,
    md`Population variance divides the squared deviations by $n$; the standard deviation is its square root.`,
    md`For $y = ax + b$: the centre becomes $a \cdot \text{old} + b$, the standard deviation $\lvert a \rvert \cdot \text{old}$, the variance $a^2 \cdot \text{old}$.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-statistics-central-dispersion' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
