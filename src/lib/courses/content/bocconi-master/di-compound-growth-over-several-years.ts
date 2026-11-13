import { md, type Lesson } from '../../types';

/** Bocconi master's, Data insight: growth over several years, compounding and average annual rates (docs/COURSE-AUTHORING.md). */

export const compoundGrowthOverSeveralYearsLesson: Lesson = {
  slug: 'compound-growth-over-several-years',
  title: 'Growth over several years: compounding and average annual rates',
  metaTitle: 'Compound growth over several years and average annual rates',
  summary: 'Turn several years of growth into one multiplier, find the average annual rate from first and last values, and estimate powers and doubling times by hand.',
  minutes: 22,
  objectives: [
    'Turn several years of growth at one rate into a single multiplier, using benchmark powers.',
    'Find the average annual growth rate from a start and an end value, by matching or bracketing powers.',
    'Explain why adding, or averaging, yearly rates misstates growth over several years.',
    'Estimate multi-year growth and doubling times by hand, and know where the estimates fail.',
  ],
  teachMd: md`
### Several years, one multiplier

A rise of $g$ a year for $n$ years multiplies the starting value by $(1 + g)^n$. Three years at 10% is $1.1 \times 1.1 \times 1.1 = 1.331$: a rise of 33.1%, not 30%. Each year's growth is taken on a level that already includes the earlier growth, so growth earns growth. The lesson on [percentages and growth in data](/courses/bocconi-master/percentages-and-growth-in-data) chains years with different rates; this one is about many years at once, and about the single rate that sums them up.

### Benchmarks to know by heart

No calculator is allowed on the test, so powers come from a few remembered values. Whole numbers make them easy to recall: $11^2 = 121$, $11^3 = 1\,331$, $12^3 = 1\,728$ and $105^2 = 11\,025$ give the decimals below.

| Yearly rate | 2 years | 3 years | 4 years |
| --- | --- | --- | --- |
| 5% | 1.1025 | about 1.158 | about 1.216 |
| 10% | 1.21 | 1.331 | 1.4641 |
| 15% | 1.3225 | about 1.521 | about 1.749 |
| 20% | 1.44 | 1.728 | about 2.07 |
| $-10\%$ | 0.81 | 0.729 | about 0.656 |

Longer spans combine shorter ones: six years at 10% is $1.331^2$, or $1.21^3 \approx 1.772$.

### The average annual growth rate

When a value goes from $S$ to $E$ in $n$ years, the compound average annual growth rate (often shortened to CAGR) is the constant yearly rate $g$ that would make the same journey:

$$(1 + g)^n = \frac{E}{S}$$

By hand, form the ratio $\frac{E}{S}$ and match it to a benchmark: a ratio of 1.44 over two years means 20% a year, since $1.2^2 = 1.44$. If the ratio is not a benchmark, bracket it between two that are, and try the rate in the middle.

Count $n$ as the number of years of growth, the gaps between the dates: from 2021 to 2024 is three years, although a table shows four columns.

### Not the total divided by the years, not the mean of the rates

Two shortcuts give the wrong rate.

- **The total rise divided by $n$.** A rise of 33.1% over three years is 10% a year, not about 11%. Because growth compounds, the yearly rate behind a rise is always below the total rise divided by the number of years.
- **The plain mean of the yearly rates.** Up 25% one year and down 20% the next is $1.25 \times 0.8 = 1$: the value ends where it started, so the average annual growth is 0%, although the mean of the two rates is $+2.5\%$. The compound rate is never above the plain mean of the yearly rates, and equals it only when every year has the same rate.

Some reports use the words "average annual growth" for the plain mean of the yearly rates, so read how a question defines it. A question that asks for a constant rate giving the same end value wants the compound rate.

### Why adding understates growth

Expanding the power shows what the sum of the rates leaves out:

$$(1 + g)^n = 1 + ng + \frac{n(n-1)}{2}g^2 + \dots$$

The term $ng$ is the yearly rates added up. Every later term is growth on growth, and for a rise each one is positive, so adding the yearly rates understates the total. For a fall the effect runs the other way: three years down 10% leave $0.9^3 = 0.729$ of the start, a fall of 27.1%, not 30%. Compounding makes rises bigger, and falls smaller, than the sum of the rates.

### A shortcut for small rates

Keeping the first three terms gives a good estimate when $g$ is small:

$$(1 + g)^n \approx 1 + ng + \frac{n(n-1)}{2}g^2$$

The factor $\frac{n(n-1)}{2}$ counts the pairs of years whose growth compounds: 1 for two years, 3 for three, 6 for four. For two years the formula is exact. For 8% over three years it gives $1 + 0.24 + 3 \times 0.0064 = 1.2592$, against an exact value of about 1.2597. For a rise the estimate is always slightly low, and the error grows with $ng$: at 20% a year for five years it gives 2.4, while the exact value is about 2.49. Use it while $ng$ is no more than about 0.5, and use benchmarks beyond that.

### The rule of 72

A quick estimate of doubling time: at $r\%$ a year, a value doubles in roughly $\frac{72}{r}$ years. At 6% that is about 12 years, and $1.06^{12}$ is indeed about 2.01; at 9%, about 8 years. It also runs backwards: doubling in 6 years needs roughly 12% a year.

The rule is an approximation, not an identity. It is close for rates of a few percent up to the low teens and drifts at higher rates: at 20% it suggests 3.6 years, but $1.2^3 = 1.728$ and $1.2^4 \approx 2.07$, so doubling takes nearly 4 years. When the options are close together, confirm with a power.

### Comparing growth over different spans

Totals over different spans cannot be compared directly. A rise of 21% in two years and a rise of 33.1% in three years are both 10% a year. Convert each to a yearly rate first, or compare over the same number of years.

### A routine for multi-year growth

Count the years of growth. Form the ratio of the end value to the start. Match it to a benchmark, bracket it, or use the shortcut. Before choosing, check the direction: for a rise, the yearly rate must be below the total rise divided by the years; and when every year is a rise, the total must be above the yearly rates added up.
`,
  examples: [
    {
      id: 'example-recognise-a-power',
      title: 'Spotting a benchmark ratio',
      problemMd: md`A company's exports rose from €400 million in 2021 to €532.4 million in 2024. What was the average annual growth rate over the period?`,
      steps: [
        md`Count the years of growth: 2021 to 2024 is three years.`,
        md`Form the ratio: $\frac{532.4}{400} = 1.331$ (divide by 4 to get 133.1, then by 100).`,
        md`Recognise the power: $1\,331 = 11^3$, so $1.331 = 1.1^3$ and the yearly rate is 10%.`,
        md`Check forwards: $400 \to 440 \to 484 \to 532.4$, adding 10% each year.`,
      ],
      answerMd: md`10% a year. Dividing the total rise of 33.1% by three gives about 11%, the tempting wrong answer: it ignores that each year's 10% was taken on a larger base.`,
    },
    {
      id: 'example-bracket-the-rate',
      title: 'A ratio between two benchmarks',
      problemMd: md`An app's monthly users grew from 40,000 to 60,000 over three years. Estimate the average annual growth rate.`,
      steps: [
        md`Ratio: $\frac{60\,000}{40\,000} = 1.5$ over three years.`,
        md`Bracket it with benchmarks: $1.1^3 = 1.331 < 1.5 < 1.728 = 1.2^3$, so the rate is between 10% and 20%.`,
        md`Try the middle: $1.15^2 = 1.3225$, and $1.3225 \times 1.15 = 1.3225 + 0.198 \approx 1.521$. That is just above 1.5, so the rate is just under 15%.`,
      ],
      answerMd: md`Just under 15% a year, about 14.5%. Dividing the 50% rise by three gives about 16.7%, which is too high: at 16.7% a year, three years would multiply the users by more than $1.15^3 \approx 1.52$, which is already above 1.5.`,
    },
    {
      id: 'example-small-rate-shortcut',
      title: 'Four years at 6%',
      problemMd: md`A rent rises by 6% a year for four years. By about what percent has it risen in total?`,
      steps: [
        md`Adding the rates gives $4 \times 6\% = 24\%$. That is the first term of the shortcut; growth on growth comes on top.`,
        md`Pairs of years: $\frac{4 \times 3}{2} = 6$. Second term: $6 \times 0.06^2 = 6 \times 0.0036 = 0.0216$.`,
        md`Estimate: $1 + 0.24 + 0.0216 = 1.2616$, a rise of about 26.2%.`,
        md`Exact check by squaring the two-year multiplier: $1.06^2 = 1.1236$, and $1.1236^2 \approx 1.2625$, again a rise of about 26.2%.`,
      ],
      answerMd: md`About 26.2%. The tempting wrong answer is 24%, the four rates added; the extra 2 points or so are growth on growth.`,
    },
    {
      id: 'example-rule-of-72',
      title: 'Doubling at 9%',
      problemMd: md`Savings grow at 9% a year. Roughly how long do they take to double, and about how many times their starting value are they after 16 years?`,
      steps: [
        md`Rule of 72: $\frac{72}{9} = 8$, so they roughly double in 8 years.`,
        md`Sixteen years is two doubling periods: about $2 \times 2 = 4$ times the start.`,
        md`Check the estimate: $1.09^2 = 1.1881$, $1.1881^2 \approx 1.412$ and $1.412^2 \approx 1.99$. So $1.09^8$ is just under 2, and the rule is close here.`,
      ],
      answerMd: md`About 8 years to double, and about 4 times the start after 16 years (a little under, since $1.09^8$ is just below 2). The tempting wrong answer for the second part is 2.44 times: $1 + 16 \times 0.09 = 2.44$ adds the yearly rates and ignores compounding.`,
    },
  ],
  traps: [
    {
      title: 'Dividing the total rise by the years',
      md: md`A rise of 44% over two years is 20% a year, not 22%, since $1.2^2 = 1.44$. For a rise, the yearly rate is always below the total divided by the number of years; form the ratio and match a power.`,
    },
    {
      title: 'Adding the yearly rates',
      md: md`When every year moves the same way, the sum of the rates understates a rise and overstates a fall: 10% a year for three years is a rise of 33.1%, and a fall of 10% a year is a fall of 27.1%, not 30%.`,
    },
    {
      title: 'Averaging rates that vary',
      md: md`Up 25% and then down 20% averages $+2.5\%$ but leaves the value unchanged. The average annual rate comes from the first and last values, not from the mean of the yearly rates.`,
    },
    {
      title: 'Counting columns instead of years',
      md: md`Values for 2021, 2022, 2023 and 2024 span three years of growth, not four. Count the gaps between dates before taking any root or power.`,
    },
    {
      title: 'Treating the rule of 72 as exact',
      md: md`It is an estimate, good for moderate rates and rougher at 20% or more. If the options are close together, confirm with a power.`,
    },
  ],
  check: [
    {
      id: 'check-alba-six-years',
      title: 'Projecting steady growth',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`The table shows the annual revenue of two firms, in € million.

| Firm | 2021 | 2022 | 2023 | 2024 |
| --- | --- | --- | --- | --- |
| Alba | 800 | 840 | 882 | 926.1 |
| Brera | 250 | 375 | 360 | 432 |`,
      stemMd: md`Alba's revenue grew by the same percentage each year from 2021 to 2024. If it keeps growing at that rate, by about what percent will its 2027 revenue exceed its 2021 revenue?`,
      options: [
        { id: 'A', text: md`30%`, note: md`This adds six yearly rises of 5%. Each rise is taken on a level already raised by the ones before, so the total is larger than the sum.` },
        { id: 'B', text: md`About 31.5%`, note: md`This doubles the three-year rise of about 15.8%. The second three years start from a level already 15.8% higher, so the two multipliers multiply.` },
        { id: 'C', text: md`About 34%`, note: '' },
        { id: 'D', text: md`About 134%`, note: md`1.34 is the multiplier: 2027 revenue would be about 134% **of** 2021 revenue, which is a rise of about 34%.` },
      ],
      answer: 'C',
      workingMd: md`Alba grows 5% a year: $800 \times 1.05 = 840$, and $\frac{882}{800} = 1.1025 = 1.05^2$. From 2021 to 2027 is six years, so the multiplier is $1.05^6$. Shortcut: $1 + 6 \times 0.05 + 15 \times 0.0025 = 1 + 0.3 + 0.0375 = 1.3375$. By benchmarks: $1.05^6 = 1.1025^3$, with $1.1025^2 \approx 1.2155$ and $1.2155 \times 1.1025 \approx 1.340$. Both routes give a rise of about 34%.`,
      lesson: 'Steady growth over n years is one power, and for a rise it always exceeds the sum of the yearly rates.',
    },
    {
      id: 'check-brera-average-rate',
      title: 'Brera’s average annual rate',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the table from the previous question.

| Firm | 2021 | 2022 | 2023 | 2024 |
| --- | --- | --- | --- | --- |
| Alba | 800 | 840 | 882 | 926.1 |
| Brera | 250 | 375 | 360 | 432 |`,
      stemMd: md`At what constant yearly rate would Brera's revenue have grown from its 2021 level to its 2024 level?`,
      options: [
        { id: 'A', text: md`About 14.7%`, note: md`This spreads the ratio of 1.728 over four years because the table has four columns; 2021 to 2024 is three years of growth.` },
        { id: 'B', text: md`20%`, note: '' },
        { id: 'C', text: md`22%`, note: md`This is the plain mean of Brera's yearly rates, $+50\%$, $-4\%$ and $+20\%$. Rates that vary compound to less than their mean.` },
        { id: 'D', text: md`About 24.3%`, note: md`This divides the total rise of 72.8% by three. Because the yearly growth compounds, the constant rate behind that rise is lower.` },
      ],
      answer: 'B',
      workingMd: md`The ratio is $\frac{432}{250} = 1.728$ (check: $250 \times 1.728 = 432$). Since $12^3 = 1\,728$, $1.728 = 1.2^3$, so the constant rate is 20% a year. Check forwards: $250 \to 300 \to 360 \to 432$. The actual yearly path was different ($\frac{375}{250} = 1.5$, $\frac{360}{375} = 0.96$, $\frac{432}{360} = 1.2$), but its product is the same 1.728.`,
      lesson: 'The average annual rate comes from the first and last values; count the gaps between years, not the columns.',
    },
    {
      id: 'check-duomo-doubling',
      title: 'Comparing growth over different spans',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the table from the previous questions. In addition, a third firm, Duomo, had revenue of €150 million in 2016 and €300 million in 2024.

| Firm | 2021 | 2022 | 2023 | 2024 |
| --- | --- | --- | --- | --- |
| Alba | 800 | 840 | 882 | 926.1 |
| Brera | 250 | 375 | 360 | 432 |`,
      stemMd: md`Which statement about the firms' average annual growth is best supported?`,
      options: [
        { id: 'A', text: md`Duomo grew faster each year than Brera, because its revenue rose by 100% and Brera's by 72.8%.`, note: md`This compares total rises over different spans, eight years against three. Per year, Duomo's doubling is about 9%, far below Brera's 20%.` },
        { id: 'B', text: md`Duomo's yearly growth cannot be compared with the other firms', because the periods differ in length.`, note: md`A yearly rate is exactly what makes spans of different length comparable; convert each firm's growth to a rate per year.` },
        { id: 'C', text: md`Duomo grew at about 12.5% a year.`, note: md`This divides the 100% rise by eight years. At 12.5% a year the rule of 72 puts doubling at under 6 years, so eight years would bring well over a doubling.` },
        { id: 'D', text: md`Duomo grew at about 9% a year: faster than Alba, slower than Brera.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Duomo doubled in 8 years (2016 to 2024). By the rule of 72, its rate is about $\frac{72}{8} = 9\%$ a year. A check that does not lean on the rule: at 5% a year for eight years, $1.05^8 = 1.1025^4 \approx 1.48$, short of 2; at 20% a year, $1.2^4 \approx 2.07$ already doubles within four years. So Duomo's rate lies between Alba's 5% and Brera's 20%.`,
      lesson: 'Compare growth over different spans by converting each to a yearly rate.',
    },
  ],
  takeaways: [
    md`$n$ years at rate $g$ multiply by $(1 + g)^n$; know $1.1^3 = 1.331$, $1.2^3 = 1.728$ and $1.05^2 = 1.1025$.`,
    'The average annual rate is the constant rate linking the first and last values; find it from their ratio.',
    'Adding yearly rates understates steady rises and overstates steady falls; dividing a total rise by the years overstates the yearly rate.',
    md`For small $g$, $(1 + g)^n \approx 1 + ng + \frac{n(n-1)}{2}g^2$.`,
    'The rule of 72 estimates doubling time; it is an approximation, so check close calls with a power.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-data-insight', skill: 'grad-data-derived-conclusions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
