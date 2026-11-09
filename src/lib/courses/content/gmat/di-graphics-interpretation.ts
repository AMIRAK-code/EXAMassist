import { md, type Lesson } from '../../types';

/** GMAT Data Insights: Graphics Interpretation (docs/COURSE-AUTHORING.md, the plan). */

export const graphicsInterpretationLesson: Lesson = {
  slug: 'graphics-interpretation',
  title: 'Graphics Interpretation: line graphs, bar and pie charts, scatter plots and curves',
  summary: 'Read the axes, scale and legend first, then turn a graph into the few numbers a question needs: changes, shares, gaps from a trend line, areas.',
  minutes: 22,
  objectives: [
    'Read a graph\'s axes, units, scale and legend before taking any value from it.',
    'Tell absolute change from percent change, and shares of a total from amounts.',
    'Use a trend line to judge points above or below a prediction, and the 68–95 rule on a normal curve.',
  ],
  teachMd: md`
### What the question type asks

Graphics Interpretation is one of the five question types GMAC lists for Data Insights. As the name says, the work is reading a graphic, and this lesson covers the common kinds: line graphs, bar charts, pie charts, scatter plots and distribution curves. GMAC states that for Data Insights questions with several parts, all parts must be correct to score. The checks on this page are single-answer multiple choice, one question each, so treat each of them as one part done carefully. What you have to supply is careful reading and a little arithmetic.

This page cannot show images, so each graph below is described in words or given as the data table behind it. That is no handicap: the first thing to do with any graphic is to turn the part you need into a few numbers on your scratch paper.

### Read the frame before the data

Every graphic has a frame, and most errors are frame errors.

- **Title and period.** "Monthly subscribers, January to June" tells you each point is a level at a moment, not a monthly change.
- **Axes and units.** Is the vertical axis in units, thousands, percent or dollars? Does it start at zero? On a bar chart whose axis starts at 80, bars of 90 and 99 differ by 10% but look like a doubling.
- **Gridlines and scale.** Read a value against the nearest gridlines and interpolate; if the answer choices are close together, read carefully; if they are far apart, a rough read is enough.
- **Legend.** With two lines or grouped bars, check which series is which before you read either.

### Line graphs and x/y graphs: levels and changes

A line graph shows levels. Questions usually ask about changes between points:

- **Absolute change** is a subtraction: later value minus earlier value.
- **Percent change** divides that by the earlier value. The steepest segment of a line has the largest absolute change, but not necessarily the largest percent change, because the base differs.
- **Average rate of change** between two points is the change divided by the time between them: the slope of the straight line joining them.

### Bar charts: grouped and stacked

In a grouped chart the bars for each category stand side by side, and you compare heights. In a stacked chart each bar is a total and the segments are its parts: read a segment's size as the top of the segment minus the bottom, never as the height at its top.

### Pie charts: shares need a total

A pie chart shows shares of one total. A share alone gives no amount; you need the total. With two pie charts of different totals, a category's share can fall while its amount rises. Always convert to amounts (share times total) before comparing across charts.

A share change is measured in **percentage points**. A category whose share goes from 10% to 15% gained 5 percentage points, which is a 50% increase in its share.

### Scatter plots and trend lines

A scatter plot shows pairs of values, one point per case. The pattern gives the relationship: points rising to the right show a positive association, falling to the right a negative one, and a shapeless cloud little association. A trend line gives a predicted value for each $x$; a point above the line did better than predicted, a point below it did worse. "How far above" can be asked in units (actual minus predicted) or in percent of the prediction ($\frac{\text{actual} - \text{predicted}}{\text{predicted}}$). Association is not cause: a graphic alone cannot show that one variable drives the other.

### Distribution curves

A curve can show how a quantity is distributed: the area under it between two values is the fraction of cases between them. For a normal (bell-shaped) distribution with mean $\mu$ and standard deviation $\sigma$, a standard rule of thumb holds:

| Interval | Share of cases, about |
| --- | --- |
| $\mu \pm \sigma$ | 68% |
| $\mu \pm 2\sigma$ | 95% |
| $\mu \pm 3\sigma$ | 99.7% |

Because the curve is symmetric, half of what lies outside an interval is in each tail. So about 16% of cases are more than one standard deviation above the mean, and about 2.5% more than two above it.

### A routine for every graphic

Read the frame; name the quantity the question wants (level, change, share, amount, gap from trend); pull only the values you need into a short list; compute; and check the answer against the picture. If the graph shows a line rising steeply and your answer says it fell, a value was misread.
`,
  examples: [
    {
      id: 'example-largest-percent-change',
      title: 'Steepest is not largest in percent',
      problemMd: md`A line graph shows an app's subscribers at the start of each month. Its data: January 12,000; February 13,500; March 15,000; April 14,200; May 16,800; June 19,700. Between which consecutive months was the percent increase largest?`,
      steps: [
        md`Find the absolute changes: Jan–Feb $+1{,}500$; Feb–Mar $+1{,}500$; Mar–Apr $-800$; Apr–May $+2{,}600$; May–Jun $+2{,}900$. The steepest rise on the graph is May to June.`,
        md`Percent change divides by the earlier value: $\frac{1500}{12000} = 12.5\%$; $\frac{1500}{13500} \approx 11.1\%$; $\frac{2600}{14200} \approx 18.3\%$; $\frac{2900}{16800} \approx 17.3\%$.`,
        md`Check the close pair by multiplying: $14{,}200 \times 1.18 = 16{,}756$, below May's 16,800, so April to May is above 18%; $16{,}800 \times 1.18 = 19{,}824$, above June's 19,700, so May to June is below 18%.`,
      ],
      answerMd: md`April to May, about 18.3%. The tempting answer is May to June, the steepest segment: it has the largest absolute rise (2,900) but starts from a bigger base.`,
    },
    {
      id: 'example-pie-shares',
      title: 'A pie chart with a fixed total',
      problemMd: md`A pie chart splits a household's monthly budget of \$3,200: housing 35%, food 18%, transport 12%, savings 15%, other 20%. Housing then rises by \$160 a month, the total stays \$3,200, and the whole \$160 comes out of "other". What share of the budget is "other" now?`,
      steps: [
        md`Turn shares into amounts: other is $0.20 \times 3200 = \$640$, housing is $0.35 \times 3200 = \$1{,}120$.`,
        md`Apply the change: other falls to $640 - 160 = \$480$; housing rises to $\$1{,}280$.`,
        md`Convert back to shares of the unchanged total: other is $\frac{480}{3200} = 15\%$, housing $\frac{1280}{3200} = 40\%$. The shares still sum to 100%: $40 + 18 + 12 + 15 + 15 = 100$.`,
      ],
      answerMd: md`"Other" is now 15% of the budget, down 5 percentage points. Subtracting 160 from the share itself, or calling the change a 5% fall (it is a 25% fall in the amount, $\frac{160}{640}$), are the slips to avoid.`,
    },
    {
      id: 'example-scatter-trend',
      title: 'Points above a trend line, in percent',
      problemMd: md`A scatter plot shows eight shops, with monthly advertising spend $x$ (in \$000) across and monthly sales $y$ (in \$000) up. Its trend line is $y = 2.5x + 40$. The points are A (10, 70), B (14, 82), C (20, 101), D (24, 95), E (30, 121), F (36, 146), G (40, 132), H (44, 168). How many shops had sales more than 10% above the trend line's prediction?`,
      steps: [
        md`Compute each prediction $2.5x + 40$: A 65, B 75, C 90, D 100, E 115, F 130, G 140, H 150.`,
        md`D and G are below their predictions, so they fail at once. For the others, the condition is $y > 1.1 \times \text{prediction}$: A needs more than 71.5 (has 70), B more than 82.5 (has 82), C more than 99 (has 101), E more than 126.5 (has 121), F more than 143 (has 146), H more than 165 (has 168).`,
        md`C, F and H pass. Check by ratio: $\frac{101}{90} \approx 1.122$, $\frac{146}{130} \approx 1.123$, $\frac{168}{150} = 1.12$.`,
      ],
      answerMd: md`Three shops: C, F and H. Counting every point above the line gives 6, which answers a different question; B, at about 9.3% above, is the near miss.`,
    },
  ],
  traps: [
    {
      title: 'Steepest segment as the largest percent change',
      md: md`On a line graph, the steepest rise is the largest absolute change. Percent change divides by the starting level, so a smaller rise from a lower level can be the larger percent. When the question says "percent", divide.`,
    },
    {
      title: 'Comparing shares across pie charts with different totals',
      md: md`A falling share can hide a rising amount when the total grows. Before comparing categories across two pie charts, multiply each share by its own chart's total.`,
    },
    {
      title: 'Reading a stacked segment at its top',
      md: md`In a stacked bar, the top of a segment shows the running total up to that segment. The segment's own value is its top minus its bottom.`,
    },
    {
      title: 'A truncated axis',
      md: md`When the vertical axis does not start at zero, bar heights exaggerate differences. Read the values from the axis and compute; never judge "twice as large" by the look of the bars.`,
    },
  ],
  check: [
    {
      id: 'check-share-points',
      title: 'The largest gain in share',
      topic: 'Graphics Interpretation',
      stemMd: md`A grouped bar chart shows a company's units sold by product in two years. Its data: kettles 400 in 2023 and 460 in 2024; toasters 250 and 300; blenders 180 and 171; mixers 320 and 336. Which product's share of total units sold rose the most, in percentage points, from 2023 to 2024?`,
      options: [
        { id: 'A', text: md`Kettles`, note: md`Kettles had the largest rise in units (60), but their share rose only about 1.5 points, from 34.8% to 36.3%; total units grew too.` },
        { id: 'B', text: md`Toasters`, note: '' },
        { id: 'C', text: md`Blenders`, note: md`Blenders' share moved the most in size, about 2.2 points, but it fell, from 15.7% to 13.5%.` },
        { id: 'D', text: md`Mixers`, note: md`Mixers sold 16 more units, but they grew by only 5%, slower than the total's 10.2%, so their share fell.` },
        { id: 'E', text: md`No product's share rose`, note: md`Shares always sum to 100%, so when blenders' and mixers' shares fall, some other share must rise.` },
      ],
      answer: 'B',
      workingMd: md`Total units: 2023 is $400 + 250 + 180 + 320 = 1150$; 2024 is $460 + 300 + 171 + 336 = 1267$. Shares in 2023 and 2024: kettles $34.8\%$ and $36.3\%$ ($+1.5$ points); toasters $\frac{250}{1150} \approx 21.7\%$ and $\frac{300}{1267} \approx 23.7\%$ ($+1.9$ points); blenders $15.7\%$ and $13.5\%$ ($-2.2$ points); mixers $27.8\%$ and $26.5\%$ ($-1.3$ points). Toasters gained the most share.`,
      lesson: 'A share changes with the total as well as the part: compute both shares before comparing.',
    },
    {
      id: 'check-normal-tail',
      title: 'A tail of the bell curve',
      topic: 'Graphics Interpretation',
      stemMd: md`A curve shows the distribution of a courier's delivery times, which are approximately normal with a mean of 40 minutes and a standard deviation of 6 minutes. About what percent of deliveries take more than 52 minutes?`,
      options: [
        { id: 'A', text: md`2.5%`, note: '' },
        { id: 'B', text: md`5%`, note: md`About 5% of deliveries lie outside the 28 to 52 minute band, but that counts both tails; only the upper tail is asked for.` },
        { id: 'C', text: md`16%`, note: md`16% is the share above one standard deviation, 46 minutes. 52 minutes is two standard deviations above the mean.` },
        { id: 'D', text: md`47.5%`, note: md`47.5% is the share between the mean and 52 minutes, not above 52.` },
        { id: 'E', text: md`95%`, note: md`95% is the share within two standard deviations of the mean, the deliveries that are not extreme on either side.` },
      ],
      answer: 'A',
      workingMd: md`52 minutes is $\frac{52 - 40}{6} = 2$ standard deviations above the mean. About 95% of a normal distribution lies within 2 standard deviations, so about 5% lies outside, split equally between the tails: about 2.5% above 52 minutes.`,
      lesson: 'Convert a value to standard deviations from the mean, then halve what lies outside the band for one tail.',
    },
    {
      id: 'check-two-pies',
      title: 'Two pie charts, two totals',
      topic: 'Graphics Interpretation',
      stemMd: md`Two pie charts show how a city's transport budget was split. In 2023 the total was \$80 million: rail 30%, buses 25%, roads 35%, cycling 10%. In 2025 the total was \$100 million: rail 23%, buses 27%, roads 30%, cycling 20%. How many of the four categories received more money in 2025 than in 2023?`,
      options: [
        { id: 'A', text: md`1`, note: md`Counting only cycling, the category whose share jumped most, misses buses and roads, which also gained money.` },
        { id: 'B', text: md`2`, note: md`Buses and cycling are the categories whose share rose. Roads' share fell, but 30% of \$100 million is more than 35% of \$80 million.` },
        { id: 'C', text: md`3`, note: '' },
        { id: 'D', text: md`4`, note: md`A bigger total does not lift every category: rail fell from \$24 million to \$23 million.` },
        { id: 'E', text: md`It cannot be determined from the charts`, note: md`Both totals are given, so every amount is share times total and can be compared.` },
      ],
      answer: 'C',
      workingMd: md`Amounts in \$ million, 2023 then 2025: rail $0.30 \times 80 = 24$ and $23$; buses $20$ and $27$; roads $28$ and $30$; cycling $8$ and $20$. Buses, roads and cycling gained; rail lost. Three categories.`,
      lesson: 'Across two pie charts, compare amounts, which are share times total, not shares.',
    },
  ],
  takeaways: [
    'Read the title, axes, units, scale and legend before reading any value.',
    'The steepest segment is the largest absolute change; percent change divides by the starting level.',
    'Shares need a total: across two pie charts, compare share times total.',
    'Above a trend line means better than predicted; "more than 10% above" means more than 1.1 times the prediction.',
    'On a normal curve, about 68% lies within one standard deviation and 95% within two; halve the rest for one tail.',
  ],
  practice: { examKey: 'gmat', domain: 'di-graphics-interpretation', skill: 'gi-graphical-inference' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
