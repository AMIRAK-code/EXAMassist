import { md, type Lesson } from '../../types';

export const standardDeviationLesson: Lesson = {
  slug: 'standard-deviation-quartiles-and-boxplots',
  title: 'Standard deviation, quartiles and boxplots',
  summary: 'Judge spread without long calculations: what standard deviation measures, how to find quartiles and the IQR, and what a boxplot can and cannot tell you.',
  minutes: 22,
  objectives: [
    'Compute a standard deviation for a short list, and compare spreads of two lists without computing.',
    'Predict how shifting or scaling data changes its standard deviation and interquartile range.',
    'Find quartiles, the interquartile range and percentiles, and read a five-number summary or boxplot.',
  ],
  teachMd: md`
### Spread: how far values sit from the centre

Two lists can share a mean and still look nothing alike: 28, 29, 30, 31, 32 and 10, 20, 30, 40, 50 both have mean 30, but the second is far more spread out. The range (greatest minus least) catches this, yet it depends on only two values. **Standard deviation** uses every value: it is a typical distance of the data from the mean.

### Computing a standard deviation

For a list of $n$ values with mean $\bar{x}$:

1. Find the mean.
2. Subtract the mean from each value to get its **deviation**.
3. Square each deviation (so negatives do not cancel positives).
4. Average the squares. This average is the **variance**.
5. Take the square root. That is the standard deviation.

$$\sigma = \sqrt{\frac{(x_1 - \bar{x})^2 + (x_2 - \bar{x})^2 + \cdots + (x_n - \bar{x})^2}{n}}$$

Some textbooks divide by $n - 1$ instead of $n$ when the data are a sample. This course divides by $n$ throughout; when two lists of the same length are compared, the choice never changes which spread is larger.

For 3, 5, 7, 9, 11: the mean is 7; the deviations are $-4, -2, 0, 2, 4$; the squares are 16, 4, 0, 4, 16, which add to 40; the variance is $\frac{40}{5} = 8$; and $\sigma = \sqrt{8} = 2\sqrt{2} \approx 2.83$.

### Reasoning about standard deviation without computing

Most comparison questions can be settled with these facts.

- The standard deviation is never negative. It is 0 exactly when every value is the same.
- The further the values sit from their mean, the larger it is. Pulling values towards the mean shrinks it; pushing them away grows it.
- **Adding** the same number to every value does not change it: the whole list slides, but the distances to the mean stay the same. 13, 15, 17, 19, 21 has the same standard deviation as 3, 5, 7, 9, 11.
- **Multiplying** every value by a positive number $k$ multiplies the standard deviation by $k$. Tripling 3, 5, 7, 9, 11 gives a standard deviation of $3 \times 2\sqrt{2} = 6\sqrt{2} \approx 8.49$.
- Adding a new value equal to the mean lowers the standard deviation (unless it is already 0), because a value with zero deviation joins the average of the squares.

### Quartiles and the interquartile range

Quartiles split the **ordered** data into four parts with roughly equal numbers of values. Conventions differ slightly between textbooks, and for small lists they can give slightly different quartiles. This course always uses the **halves method**:

- $Q_2$ is the median of the whole list.
- Split the ordered list into a lower half and an upper half. If the number of values is odd, leave the median out of both halves.
- $Q_1$ is the median of the lower half; $Q_3$ is the median of the upper half.

For 2, 5, 7, 10, 12, 13, 18, 25 (eight values), the median is $\frac{10 + 12}{2} = 11$. The lower half 2, 5, 7, 10 gives $Q_1 = \frac{5 + 7}{2} = 6$; the upper half 12, 13, 18, 25 gives $Q_3 = \frac{13 + 18}{2} = 15.5$.

The **interquartile range** is $\text{IQR} = Q_3 - Q_1$, here $15.5 - 6 = 9.5$. It measures the spread of the middle half of the data, so, like the median, it hardly reacts to outliers. Shifting every value leaves the IQR unchanged; multiplying every value by a positive $k$ multiplies it by $k$.

### Percentiles

The $p$th percentile is a value at or below which about $p\%$ of the data lie. $Q_1$, the median and $Q_3$ are roughly the 25th, 50th and 75th percentiles. A percentile is a position in the data, not a percent score: being at the 90th percentile of a test means scoring at or above about 90% of test takers, whatever the raw mark.

### Boxplots and the five-number summary

A boxplot draws five numbers: the minimum, $Q_1$, the median, $Q_3$ and the maximum. The box runs from $Q_1$ to $Q_3$ with a line at the median, and a whisker runs from each end of the box to the extreme value. (Some boxplots stop a whisker short and mark unusually distant values as separate points.) Read it as a table:

| Minimum | $Q_1$ | Median | $Q_3$ | Maximum |
| --- | --- | --- | --- | --- |
| 12 | 17 | 22 | 30 | 41 |

Each of the four sections, whisker, half-box, half-box, whisker, holds about a quarter of the values, **however long or short it looks**. A long section means the values there are spread out, not that there are more of them. A boxplot shows the range and the IQR directly, but it does not show the mean, the standard deviation or the individual values.
`,
  examples: [
    {
      id: 'example-compute-sd',
      title: 'A standard deviation by hand, then a shortcut',
      problemMd: md`Find the standard deviation of 6, 8, 10, 12, 14. Then give the standard deviation of 106, 108, 110, 112, 114 and of 3, 4, 5, 6, 7 without recomputing.`,
      steps: [
        md`Mean: $\frac{6 + 8 + 10 + 12 + 14}{5} = \frac{50}{5} = 10$.`,
        md`Deviations: $-4, -2, 0, 2, 4$. Squares: 16, 4, 0, 4, 16, with sum 40.`,
        md`Variance: $\frac{40}{5} = 8$, so the standard deviation is $\sqrt{8} = 2\sqrt{2} \approx 2.83$.`,
        md`The second list is the first plus 100 in every place: a shift, so the standard deviation stays $2\sqrt{2}$.`,
        md`The third list is the first multiplied by $\frac{1}{2}$ (6 becomes 3, 14 becomes 7): a scaling, so the standard deviation is halved to $\sqrt{2} \approx 1.41$.`,
      ],
      answerMd: md`$2\sqrt{2} \approx 2.83$ for the first two lists and $\sqrt{2} \approx 1.41$ for the third. Thinking that the list with larger numbers (106 to 114) has a larger standard deviation is the usual mistake: size does not matter, spread does.`,
    },
    {
      id: 'example-quartiles-odd',
      title: 'Quartiles of an odd-length list',
      problemMd: md`Eleven delivery times, in minutes, are 12, 15, 17, 18, 21, 22, 24, 27, 30, 33, 41. Using the halves method, find the five-number summary, the range and the interquartile range.`,
      steps: [
        md`The list is already in order and has 11 values, so the median is the 6th value: 22.`,
        md`With an odd count, leave the median out. Lower half: 12, 15, 17, 18, 21, whose median is $Q_1 = 17$. Upper half: 24, 27, 30, 33, 41, whose median is $Q_3 = 30$.`,
        md`Five-number summary: minimum 12, $Q_1 = 17$, median 22, $Q_3 = 30$, maximum 41.`,
        md`Range: $41 - 12 = 29$. Interquartile range: $30 - 17 = 13$.`,
      ],
      answerMd: md`Summary 12, 17, 22, 30, 41; range 29; IQR 13. Including the median in both halves (another convention) would give halves of six values and $Q_1 = \frac{17 + 18}{2} = 17.5$, $Q_3 = \frac{27 + 30}{2} = 28.5$, which is why this course always says which method it uses.`,
    },
    {
      id: 'example-two-boxplots',
      title: 'What two boxplots do and do not say',
      problemMd: md`Two groups of 80 students took the same test. Their boxplots give these five-number summaries.

| Group | Minimum | $Q_1$ | Median | $Q_3$ | Maximum |
| --- | --- | --- | --- | --- | --- |
| P | 40 | 55 | 62 | 70 | 95 |
| R | 45 | 50 | 66 | 74 | 80 |

Compare the ranges and the IQRs, estimate how many students in P scored between 55 and 70, and say whether you can tell which group had the higher mean.`,
      steps: [
        md`Ranges: P has $95 - 40 = 55$; R has $80 - 45 = 35$. P has the wider range.`,
        md`IQRs: P has $70 - 55 = 15$; R has $74 - 50 = 24$. R's middle half is more spread out, even though its range is smaller.`,
        md`From $Q_1$ to $Q_3$ lies about half the data: roughly $\frac{1}{2} \times 80 = 40$ students in P.`,
        md`The mean is not one of the five numbers, and many different sets of scores fit the same summary. So the plots cannot tell you which mean is higher.`,
      ],
      answerMd: md`P has the larger range (55 against 35), R the larger IQR (24 against 15); about 40 students in P scored between 55 and 70; and which group had the higher mean cannot be determined. R's higher median (66 against 62) is the tempting but unjustified basis for saying R's mean is higher.`,
    },
  ],
  traps: [
    {
      title: 'Thinking a shift changes the spread',
      md: md`Adding 50 to every value makes the numbers bigger but not more spread out; the standard deviation, range and IQR stay the same. Only scaling (multiplying) changes them. Before comparing two spreads, check whether one list is just the other moved along.`,
    },
    {
      title: 'Judging spread by the size of the numbers',
      md: md`A list of large numbers close together, such as 501, 502, 503, has a smaller standard deviation than 1, 5, 9. Look at the gaps between values, not at their size.`,
    },
    {
      title: 'Reading a long whisker as more data',
      md: md`Every section of a boxplot holds about a quarter of the values. A long whisker or a wide half-box means those values are spread over a wide interval, not that there are more of them.`,
    },
    {
      title: 'Expecting a boxplot to show the mean',
      md: md`The line inside the box is the median. A boxplot gives no mean and no standard deviation, so a statement about them usually "cannot be determined" from a boxplot alone.`,
    },
  ],
  check: [
    {
      id: 'check-compare-sd',
      title: 'Two spreads, no calculation',
      topic: 'Quantitative Comparison',
      stemMd: md`List S: 4, 8, 12, 16, 20

List T: 13, 15, 17, 19, 21

| Quantity A | Quantity B |
| --- | --- |
| The standard deviation of list S | The standard deviation of list T |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: '' },
        { id: 'B', text: md`Quantity B is greater.`, note: md`List T has the larger numbers, but the size of the numbers does not matter; T's values are packed more tightly together.` },
        { id: 'C', text: md`The two quantities are equal.`, note: md`Both lists are evenly spaced with five values, but the spacing differs (4 in S, 2 in T), and the spacing sets the spread.` },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`Every value is given, so both standard deviations are fixed numbers; the comparison can always be settled.` },
      ],
      answer: 'A',
      workingMd: md`Each value of T equals half the matching value of S plus 11 ($\frac{4}{2} + 11 = 13$, …, $\frac{20}{2} + 11 = 21$). Halving halves the standard deviation and adding 11 leaves it alone, so T's standard deviation is half of S's. Directly: S has mean 12 and deviations $\pm 8, \pm 4, 0$, so $\sigma_S = \sqrt{\frac{160}{5}} = \sqrt{32}$; T has mean 17 and deviations $\pm 4, \pm 2, 0$, so $\sigma_T = \sqrt{\frac{40}{5}} = \sqrt{8}$. Since $\sqrt{32} = 2\sqrt{8}$, S's standard deviation is larger.`,
      lesson: 'Compare spreads by the gaps between values; shifts do nothing, scaling multiplies.',
    },
    {
      id: 'check-iqr-even',
      title: 'Interquartile range of ten values',
      topic: 'Data Analysis: descriptive statistics',
      stemMd: md`Ten plants grew the following amounts, in millimetres: 6, 9, 11, 14, 15, 18, 20, 23, 27, 31. Using the halves method from this lesson, what is the interquartile range?`,
      options: [
        { id: 'A', text: md`6.5`, note: md`This is $Q_3$ minus the median ($23 - 16.5$), the upper half of the box only.` },
        { id: 'B', text: md`12`, note: '' },
        { id: 'C', text: md`16.5`, note: md`16.5 is the median, $\frac{15 + 18}{2}$, not a measure of spread.` },
        { id: 'D', text: md`23`, note: md`23 is the third quartile itself; the IQR subtracts the first quartile from it.` },
        { id: 'E', text: md`25`, note: md`25 is the range, $31 - 6$, which uses the extremes instead of the quartiles.` },
      ],
      answer: 'B',
      workingMd: md`With ten values, the lower half is the first five, 6, 9, 11, 14, 15, whose median is $Q_1 = 11$. The upper half is the last five, 18, 20, 23, 27, 31, whose median is $Q_3 = 23$. The IQR is $23 - 11 = 12$.`,
      lesson: 'With an even count, the halves are simply the first and last $n/2$ values; take the median of each.',
    },
    {
      id: 'check-boxplot-commute',
      title: 'What a boxplot guarantees',
      topic: 'Data Analysis: tables and graphs',
      stimulusMd: md`A boxplot of 200 commute times, in minutes, has this five-number summary.

| Minimum | $Q_1$ | Median | $Q_3$ | Maximum |
| --- | --- | --- | --- | --- |
| 8 | 18 | 25 | 34 | 70 |`,
      stemMd: md`Which of the following statements is supported by the boxplot?`,
      options: [
        { id: 'A', text: md`The mean commute time is 25 minutes.`, note: md`25 is the median. The boxplot does not show the mean, and the long upper whisker suggests the mean is likely above the median anyway.` },
        { id: 'B', text: md`About half of the commute times are between 18 and 34 minutes.`, note: '' },
        { id: 'C', text: md`More commute times lie between 34 and 70 minutes than between 25 and 34 minutes.`, note: md`The upper whisker is longer, but each section of a boxplot holds about a quarter of the values; length shows spread, not count.` },
        { id: 'D', text: md`The range of the commute times is 52 minutes.`, note: md`52 is $70 - 18$, the maximum minus the first quartile. The range is $70 - 8 = 62$.` },
        { id: 'E', text: md`The interquartile range is 25 minutes.`, note: md`25 is the median. The interquartile range is $34 - 18 = 16$.` },
      ],
      answer: 'B',
      workingMd: md`The box runs from $Q_1 = 18$ to $Q_3 = 34$ and holds about the middle half of the data, so about half of the 200 times, roughly 100, lie between 18 and 34 minutes. The range is 62 and the IQR 16, the mean is not shown, and the upper whisker and the section from 25 to 34 each hold about a quarter of the values.`,
      lesson: 'A boxplot tells you counts by quarters and gives the median, range and IQR; it says nothing exact about the mean.',
    },
  ],
  takeaways: [
    'Standard deviation is a typical distance from the mean; bigger gaps mean a bigger standard deviation.',
    'Adding a constant leaves standard deviation, range and IQR unchanged; multiplying by $k > 0$ multiplies them by $k$.',
    md`Quartiles here use the halves method; $\text{IQR} = Q_3 - Q_1$ covers the middle half of the data.`,
    'Each section of a boxplot holds about a quarter of the values, whatever its length.',
    'A boxplot shows the median, not the mean.',
  ],
  practice: { examKey: 'gre', domain: 'quant-data-analysis', skill: 'data-descriptive-statistics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
