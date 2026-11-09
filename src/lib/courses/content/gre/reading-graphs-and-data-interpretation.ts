import { md, type Lesson } from '../../types';

export const readingGraphsLesson: Lesson = {
  slug: 'reading-graphs-and-data-interpretation',
  title: 'Reading graphs and data interpretation',
  summary: 'Read tables, bar, line and circle graphs, scatterplots and frequency distributions accurately, and answer data interpretation questions with the right base.',
  minutes: 22,
  objectives: [
    'Read the title, units, scale and totals of a table or graph before answering anything.',
    'Tell absolute changes from percent changes, and counts from percents of different totals.',
    'Locate a median or a share in a grouped frequency distribution, and describe a trend in a scatterplot.',
  ],
  teachMd: md`
### What these questions test

Data analysis is one of the four content areas of GRE Quantitative Reasoning, and much of it means reading data from tables and graphs. Questions can stand alone or come as a Data Interpretation set, several questions about the same data. An on-screen calculator is available in the Quantitative Reasoning sections, so the hard part is rarely the arithmetic. It is reading the display correctly and choosing the right numbers to compare.

### Read before you calculate

Spend the first twenty seconds on a new table or graph, not on the question. Check:

- **The title and labels.** What is being counted, for whom, and when?
- **The units.** "In thousands", "in millions of dollars", "per 1,000 residents". A value of 36 in a column headed "thousands of units" is 36,000 units.
- **The scale.** Where does the axis start? A bar chart whose axis starts at 80 makes a difference of 5 look enormous.
- **Counts or percents.** A circle graph or a column of percents tells you shares; to get counts you also need the total.
- **Totals.** If a table has a total row, use it; if it does not, you may need to add one.

### Tables and bar graphs

A table gives exact values; a bar graph gives the same information as heights, usually read to the nearest gridline. When a question needs a comparison, decide first whether it is about **absolute** amounts (subtract) or **relative** amounts (divide). "Which grew the most?" is ambiguous until you see whether the choices are counts or percents. The region with the biggest increase in units is often not the region with the biggest percent increase, because a small base grows by a large percent from a modest gain.

### Line graphs

A line graph shows a quantity over time. The steepest segment is the largest change **per period in the units of the graph**, which is an absolute change. A percent change also depends on the starting height, so the steepest segment is not automatically the largest percent change. Trends shown on a graph tell you what happened inside the period; continuing a trend beyond the last point is a guess, not something the data shows.

### Circle graphs

A circle graph divides one whole into parts. The parts add to 100% (or to the stated total), and

$$\text{part} = \text{share} \times \text{total}.$$

Two circle graphs with different totals cannot be compared by their percents alone. 20% of a \$5 million budget is more money than 30% of a \$2 million budget. Multiply each share by its own total before comparing amounts. The angle of a sector is its share of $360^\circ$: a 15% sector has an angle of $0.15 \times 360^\circ = 54^\circ$.

### Scatterplots

A scatterplot shows pairs of values as points. Describe it by its overall pattern:

- **Positive association**: as one variable increases, the other tends to increase.
- **Negative association**: as one increases, the other tends to decrease.
- **No clear association**: the points form a shapeless cloud.

A trend line (line of best fit) summarises the pattern; you can use it to estimate a value inside the range of the data by substituting into its equation. A strong association does not show that one variable causes the other, and individual points may sit well off the line.

### Frequency distributions

A frequency distribution lists values, or intervals of values, with how many observations fall in each. A histogram is the bar-graph version. With grouped data you lose the individual values, which changes what you can find:

| You can find exactly | You can only estimate or bound |
| --- | --- |
| the number of observations | the mean |
| which interval holds the median | the exact median |
| the share above or below an interval boundary | the exact range |

To find the interval that holds the median, add the frequencies cumulatively until you pass the middle position, just as with an ungrouped frequency table.

### Estimate first, then compute

When the answer choices are far apart, round the numbers, estimate, and eliminate choices that are clearly wrong before touching the calculator. When choices are close, compute exactly, and keep track of which total each percent belongs to.
`,
  examples: [
    {
      id: 'example-regional-sales',
      title: 'Absolute versus percent increase in a table',
      problemMd: md`A company's sales, in thousands of units, by region:

| Region | 2024 | 2025 |
| --- | --- | --- |
| North | 120 | 150 |
| South | 200 | 236 |
| East | 80 | 72 |
| West | 100 | 118 |

Which region had the greatest increase in units, which had the greatest percent increase, and by what percent did total sales change?`,
      steps: [
        md`Absolute changes (thousands of units): North $+30$, South $+36$, East $-8$, West $+18$. South has the greatest increase in units.`,
        md`Percent changes from the 2024 base: North $\frac{30}{120} = 25\%$, South $\frac{36}{200} = 18\%$, East $\frac{-8}{80} = -10\%$, West $\frac{18}{100} = 18\%$. North has the greatest percent increase.`,
        md`Totals: 2024 is $120 + 200 + 80 + 100 = 500$; 2025 is $150 + 236 + 72 + 118 = 576$.`,
        md`Total percent change: $\frac{576 - 500}{500} = \frac{76}{500} = 15.2\%$.`,
      ],
      answerMd: md`South had the greatest increase in units (36,000), North the greatest percent increase (25%), and total sales rose by 15.2%. Answering "South" to the percent question, or averaging the four regional percents ($\frac{25 + 18 - 10 + 18}{4} = 12.75\%$) for the total, are the slips to avoid.`,
    },
    {
      id: 'example-budget-circle',
      title: 'A circle graph after one part changes',
      problemMd: md`A household's monthly budget of \$3,200 is shown in a circle graph: housing 35%, food 20%, transport 15%, savings 10%, other 20%. If the housing cost rises by \$160 and every other amount stays the same in dollars, what percent of the new budget is housing?`,
      steps: [
        md`Convert the housing share into dollars: $0.35 \times 3200 = 1120$, so housing is \$1,120.`,
        md`Apply the rise: housing becomes \$1,280, and the whole budget becomes \$3,360, because the total grows too.`,
        md`New share: $\frac{1280}{3360} = \frac{8}{21} \approx 0.381$.`,
        md`Check the size: the \$160 rise is 5% of the old budget, but the new total is larger, so the new share must be a little under $35\% + 5\% = 40\%$.`,
      ],
      answerMd: md`Housing is about 38.1% of the new budget. The tempting 40% forgets that the total changed as well as the housing amount.`,
    },
    {
      id: 'example-grouped-median',
      title: 'Median and shares in a grouped distribution',
      problemMd: md`Scores of 25 students on a 49-point quiz, grouped:

| Score | 0–9 | 10–19 | 20–29 | 30–39 | 40–49 |
| --- | --- | --- | --- | --- | --- |
| Students | 2 | 5 | 9 | 6 | 3 |

In which interval is the median score, and what percent of the students scored 30 or more?`,
      steps: [
        md`Total: $2 + 5 + 9 + 6 + 3 = 25$, so the median is the 13th score in order.`,
        md`Cumulative counts: 2 students up to 9 points, $2 + 5 = 7$ up to 19, $7 + 9 = 16$ up to 29. The 13th score lies after the 7th and by the 16th, so it is in 20–29.`,
        md`Scores of 30 or more: $6 + 3 = 9$ students. As a percent: $\frac{9}{25} = 36\%$.`,
      ],
      answerMd: md`The median lies in the 20–29 interval, and 36% of the students scored 30 or more. The exact median cannot be read from grouped data, and picking the middle column of the table (here also 20–29) works only by coincidence; always count.`,
    },
  ],
  traps: [
    {
      title: 'Largest change: units or percent?',
      md: md`"Greatest increase" and "greatest percent increase" usually point to different categories. A large base can produce the biggest absolute gain with a modest percent; a small base the opposite. Read which one the question asks for, and divide by the earlier value for a percent.`,
    },
    {
      title: 'Comparing percents of different totals',
      md: md`Shares from two circle graphs, or two columns of percents, refer to different wholes. Convert each to an amount (share times its own total) before saying which is larger.`,
    },
    {
      title: 'Ignoring units and scales',
      md: md`A column headed "thousands" or an axis that starts above zero changes every reading. Write the unit next to each number you take from the display, and check where the axis starts before judging a difference by eye.`,
    },
    {
      title: 'Treating a trend as a guarantee',
      md: md`A scatterplot's trend line describes the overall pattern, not each point, and a trend within the data says nothing certain about values beyond it. Statements with "must" or "always" about individual points are usually not supported.`,
    },
  ],
  check: [
    {
      id: 'check-total-enrolment',
      title: 'Percent change of a total',
      topic: 'Data Interpretation',
      stimulusMd: md`Enrolment in four courses at a college:

| Course | 2023 | 2025 |
| --- | --- | --- |
| Biology | 240 | 300 |
| Chemistry | 180 | 207 |
| History | 150 | 135 |
| Music | 60 | 84 |`,
      stemMd: md`By approximately what percent did the total enrolment in the four courses increase from 2023 to 2025?`,
      options: [
        { id: 'A', text: md`13.2%`, note: md`This divides the increase of 96 by the 2025 total, 726. A percent increase is measured from the earlier total, 630.` },
        { id: 'B', text: md`15.2%`, note: '' },
        { id: 'C', text: md`17.5%`, note: md`This averages the four course percents (25%, 15%, −10%, 40%). Courses of different sizes cannot be averaged with equal weight.` },
        { id: 'D', text: md`25%`, note: md`This is Biology's increase alone, the largest course, not the change in the total.` },
        { id: 'E', text: md`96%`, note: md`96 is the increase in the number of students, a count, not a percent of the starting total.` },
      ],
      answer: 'B',
      workingMd: md`The 2023 total is $240 + 180 + 150 + 60 = 630$, and the 2025 total is $300 + 207 + 135 + 84 = 726$. The increase is $726 - 630 = 96$, and $\frac{96}{630} \approx 0.152$, an increase of about 15.2%.`,
      lesson: 'For the change in a total, add up each year first, then take one percent change from the earlier total.',
    },
    {
      id: 'check-two-circle-graphs',
      title: 'Shares of two different wholes',
      topic: 'Quantitative Comparison',
      stemMd: md`Company X spent a total of \$2.4 million last year, and a circle graph shows 15% of it went to research. Company Y spent a total of \$1.5 million, and its circle graph shows 22% went to research.

| Quantity A | Quantity B |
| --- | --- |
| The amount Company X spent on research | The amount Company Y spent on research |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: '' },
        { id: 'B', text: md`Quantity B is greater.`, note: md`This compares the shares, 22% against 15%. The shares are of different totals, and X's much larger total outweighs its smaller share.` },
        { id: 'C', text: md`The two quantities are equal.`, note: md`The amounts are close (\$360,000 and \$330,000) but not equal; compute each one rather than judging by eye.` },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`Both totals and both shares are given, so both amounts can be computed exactly.` },
      ],
      answer: 'A',
      workingMd: md`Company X: $0.15 \times 2.4 = 0.36$ million dollars, that is \$360,000. Company Y: $0.22 \times 1.5 = 0.33$ million dollars, that is \$330,000. X spent more on research.`,
      lesson: 'Turn each share into an amount with its own total before comparing across two circle graphs.',
    },
    {
      id: 'check-grouped-median',
      title: 'Where the median can be',
      topic: 'Data Analysis: tables and graphs',
      stimulusMd: md`Finishing times of 40 runners in a race:

| Time (minutes) | Runners |
| --- | --- |
| 20 to under 25 | 3 |
| 25 to under 30 | 9 |
| 30 to under 35 | 14 |
| 35 to under 40 | 10 |
| 40 to under 45 | 4 |`,
      stemMd: md`Which of the following could be the median finishing time, in minutes?`,
      options: [
        { id: 'A', text: md`27.5`, note: md`27.5 is the middle of the 25 to under 30 class, but that class holds only the 4th to the 12th runners, well before the middle of 40.` },
        { id: 'B', text: md`29.9`, note: md`A median just under 30 would need the 20th and 21st runners in the 25 to under 30 class, which ends with the 12th runner.` },
        { id: 'C', text: md`32.0`, note: '' },
        { id: 'D', text: md`35.0`, note: md`A time of exactly 35 belongs to the 35 to under 40 class, which starts with the 27th runner, after the middle pair.` },
        { id: 'E', text: md`40.5`, note: md`This is in the slowest class, which holds only the 37th to 40th runners; it may come from mixing up the number of runners, 40, with a time.` },
      ],
      answer: 'C',
      workingMd: md`There are $3 + 9 + 14 + 10 + 4 = 40$ runners, so the median is the mean of the 20th and 21st times. Cumulatively, 3 runners finish under 25 minutes, 12 under 30 and 26 under 35. The 20th and 21st runners are both in the 30 to under 35 class, so the median is at least 30 and less than 35. Of the choices, only 32.0 lies in that interval.`,
      lesson: 'With grouped data, count cumulatively to find the class holding the middle position; the median can be any value inside that class.',
    },
  ],
  takeaways: [
    'Read the title, units, scale and totals before reading any value.',
    'Decide whether a question wants an absolute change or a percent change; they often have different answers.',
    'Percents of different totals cannot be compared until each becomes an amount.',
    'In grouped data, locate the median by cumulative counts; the exact mean and median are not available.',
    'A trend describes the overall pattern, not every point, and not values beyond the data.',
  ],
  practice: { examKey: 'gre', domain: 'quant-data-analysis', skill: 'data-tables-and-graphs' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
