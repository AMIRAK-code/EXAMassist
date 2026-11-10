import { md, type Lesson } from '../../types';

/**
 * Quick revision: numerical reasoning. Adapted from the site owners' revision
 * deck (slides 57–69), with corrections: 1/7 is 14.29% to two decimals, not
 * 14.28%; the "100% solvable via estimation" claim is dropped; the per-question
 * time is labelled as our pacing suggestion. Exam facts come only from
 * docs/research/course-facts-2026-11-04.md (6 numerical reasoning questions out
 * of 50; no calculator; simple calculations, the challenge often being to read
 * a chart or table correctly).
 */

export const revisionNumericalReasoningLesson: Lesson = {
  slug: 'revision-numerical-reasoning',
  title: 'Revision: numerical reasoning',
  summary: 'Chart and table extraction, shares of shares, index numbers, estimation, reciprocals and percentage changes on one sheet, with the traps that cost marks.',
  minutes: 28,
  objectives: [
    'Pull the right figures from a table or chart: units, axes, footnotes, and only the rows the question needs.',
    'Work with shares of shares, pie-chart angles and index numbers without confusing points and percent.',
    'Estimate and compare fractions by hand using reciprocal benchmarks and cross-multiplication.',
    'Chain, combine and reverse percentage changes with multipliers.',
  ],
  teachMd: md`
### What the area tests

The standard test has 6 numerical reasoning questions out of 50, 12% of the test. Bocconi says advanced mathematics is not required and the calculations are simple; the challenge is often to read a chart or table correctly. No calculator is allowed. 75 minutes for 50 questions is 90 seconds a question on average; our pacing suggestion, not a Bocconi figure, is about 60 seconds for a numerical reasoning item, and estimation is what makes that possible. Estimation settles many items, but not all: when two options are close, compute exactly.

### A four-step extraction protocol

| Step | Check | Why |
| --- | --- | --- |
| 1. Units | Thousands, millions, or percentage shares? | A figure in €M read as € is off by a factor of a million |
| 2. Axes | Two vertical axes? Which series uses which? | Reading a series against the wrong scale gives a wrong value |
| 3. Footnotes | Exclusions, currency conversions, base years | A footnote can change what a column means |
| 4. Filter | Which rows and columns does the question name? | Most cells are irrelevant to any one question |

### Shares of shares and pie charts

A share of a share multiplies: if equities are 45% of a fund and technology is 20% of equities, technology is $0.45 \times 0.20 = 0.09$, 9% of the fund. In a pie chart the whole is $360^\circ$, so $1\% = 3.6^\circ$: a 15% slice is $54^\circ$, a 25% slice $90^\circ$, and a $108^\circ$ slice is $108 \div 3.6 = 30\%$.

### Index numbers

An index sets a base year to 100. Two series both indexed to 100 in 2020 show growth, not size: if Country A is at 140 in 2025 and Country B at 125, A grew 40% and B 25% since 2020, but which economy is larger cannot be told. Growth between two later years is measured from the earlier value: from 120 to 150 is $\frac{150 - 120}{120} = \frac{30}{120} = 25\%$, not 30%. The 30 is index points.

### Estimation techniques

- **Round to two significant figures.** $48\,912 \div 7\,034 \approx 49\,000 \div 7\,000 = 7$ (exactly, about 6.95).
- **Round both terms the same way.** A fraction keeps its value when top and bottom are scaled by the same factor, so if you round one up, round the other up by about the same percentage.
- **Build percentages from 10%, 5% and 1%.** 10% of 1,105 is 110.5 and 1% is about 11, so 143 is about $10\% + 3\% = 13\%$ of 1,105 (exactly 12.94%).

### Reciprocal benchmarks

| Fraction | Percent | Fraction | Percent |
| --- | --- | --- | --- |
| $\frac{1}{6}$ | 16.67% | $\frac{1}{11}$ | 9.09% ($\frac{2}{11} = 18.18\%$, $\frac{3}{11} = 27.27\%$) |
| $\frac{1}{7}$ | 14.29% ($\frac{2}{7} \approx 28.57\%$) | $\frac{1}{12}$ | 8.33% |
| $\frac{1}{8}$ | 12.5% ($\frac{3}{8} = 37.5\%$) | $\frac{1}{15}$ | 6.67% |
| $\frac{1}{9}$ | 11.11% ($\frac{2}{9} = 22.22\%$) | $\frac{1}{16}$ | 6.25% |

Percentages are rounded to two decimals.

### Percent change and percentage points

| | Relative change | Percentage points |
| --- | --- | --- |
| Formula | $\frac{\text{new} - \text{old}}{\text{old}} \times 100\%$ | new % minus old % |
| Tax rate from 20% to 25% | $\frac{5}{20} = +25\%$ | +5 points, or +500 basis points |

The base of a relative change is always the starting value: the one after "from" or "than". One percentage point is 100 basis points, so one basis point is 0.01 of a percentage point.

### Recovery is asymmetric

| Change | Multiplier | Reverse multiplier | Change needed to get back |
| --- | --- | --- | --- |
| −10% | $0.90$ | $\frac{10}{9} \approx 1.111$ | +11.11% |
| −20% | $0.80$ | $\frac{5}{4} = 1.25$ | +25% |
| −25% | $0.75$ | $\frac{4}{3} \approx 1.333$ | +33.33% |
| +25% | $1.25$ | $\frac{4}{5} = 0.80$ | −20% |

### Products, quotients and weights

- **Revenue = price × volume.** Price up 15% and volume down 10% gives $1.15 \times 0.90 = 1.035$: revenue up 3.5%, not 5%.
- **Real change = nominal multiplier ÷ price multiplier.** A salary up 10% when prices rise 10% gives $\frac{1.10}{1.10} = 1$: no change in purchasing power.
- **A weighted change** is the weighted average of the parts' changes. A portfolio of 60% bonds returning +5% and 40% shares returning −10% returns $0.6 \times 5\% + 0.4 \times (-10\%) = 3\% - 4\% = -1\%$.
- **A reverse base** divides by the combined multiplier, never subtracts the percents.
`,
  examples: [
    {
      id: 'example-profit-per-employee',
      title: 'Three columns, one question',
      problemMd: md`| Division | Revenue (€M) | Operating margin | Headcount |
| --- | --- | --- | --- |
| Cloud Services | 400 | 25% | 800 |
| Hardware Systems | 600 | 10% | 1,500 |
| Fintech Payments | 250 | 30% | 500 |

Which division has the highest operating profit per employee?`,
      steps: [
        md`Operating profit is revenue × margin. Cloud: $400 \times 0.25 = 100$, so €100M. Hardware: $600 \times 0.10 = 60$, so €60M. Fintech: $250 \times 0.30 = 75$, so €75M.`,
        md`Divide by headcount, minding the units: €100M ÷ 800 = €125,000; €60M ÷ 1,500 = €40,000; €75M ÷ 500 = €150,000.`,
        md`A quick check: Fintech has 5/8 of Cloud's headcount but 3/4 of its profit, and $\frac{3}{4} > \frac{5}{8}$, so Fintech is ahead per employee.`,
      ],
      answerMd: md`Fintech Payments, at about €150,000 per employee. Hardware, with the largest revenue, is the tempting wrong answer: it has the lowest profit per employee.`,
    },
    {
      id: 'example-nested-fund',
      title: 'A share of a share, and pie-chart angles',
      problemMd: md`A fund holds €800M. Equities are 45% of the fund, and technology is 20% of the equities. What is the technology holding worth, and what angle would its slice have in a pie chart of the whole fund?`,
      steps: [
        md`Multiply the shares first: $0.45 \times 0.20 = 0.09$, so technology is 9% of the whole fund.`,
        md`9% of €800M: 1% is €8M, so 9% is $9 \times 8 = 72$, that is €72M.`,
        md`Angle: $9 \times 3.6^\circ = 32.4^\circ$.`,
        md`Check by the long route: equities are $0.45 \times 800 = 360$, so €360M, and 20% of that is €72M.`,
      ],
      answerMd: md`€72M, a slice of $32.4^\circ$. Taking 20% of the whole fund (€160M) is the tempting error: the 20% is a share of equities, not of the fund.`,
    },
    {
      id: 'example-compare-fractions',
      title: 'Which fraction is larger?',
      problemMd: md`Without a calculator: which is larger, $\frac{17}{53}$ or $\frac{23}{71}$? And roughly what percentage is $\frac{143}{1\,105}$?`,
      steps: [
        md`Both fractions are just under $\frac{1}{3}$: $17 \times 3 = 51$ and $23 \times 3 = 69$. So $\frac{17}{53} = \frac{1}{3} \times \frac{51}{53}$ and $\frac{23}{71} = \frac{1}{3} \times \frac{69}{71}$.`,
        md`Each falls short of $\frac{1}{3}$ by 2 parts, but 2 out of 71 is a smaller shortfall than 2 out of 53, so $\frac{23}{71}$ is closer to $\frac{1}{3}$ and larger.`,
        md`Confirm by cross-multiplying: $17 \times 71 = 1\,207$ and $23 \times 53 = 1\,219$; since $1\,207 < 1\,219$, $\frac{17}{53} < \frac{23}{71}$.`,
        md`For $\frac{143}{1\,105}$: 10% is 110.5, leaving $143 - 110.5 = 32.5$; 1% is about 11, so 32.5 is about 3%. The total is about 13% (exactly 12.94%).`,
      ],
      answerMd: md`$\frac{23}{71}$ is larger (about 32.4% against 32.1%), and $\frac{143}{1\,105}$ is about 13%. Picking $\frac{17}{53}$ because it has the smaller denominator is the tempting error; the numerators differ too.`,
    },
    {
      id: 'example-reverse-two-years',
      title: 'Two years of growth, backwards',
      problemMd: md`After growing 20% in 2024 and 25% in 2025, a firm's profit reached €90M. What was its profit in 2023?`,
      steps: [
        md`Write each change as a multiplier and combine: $1.20 \times 1.25 = \frac{6}{5} \times \frac{5}{4} = \frac{3}{2} = 1.5$.`,
        md`So $1.5 \times P_{2023} = 90$, and $P_{2023} = \frac{90}{1.5} = 60$, that is €60M.`,
        md`Check forwards: $60 \times 1.2 = 72$, and $72 \times 1.25 = 90$.`,
      ],
      answerMd: md`€60M. Taking 45% off €90M (adding the two percents and subtracting) gives €49.5M, which is wrong twice: the changes multiply, and they were taken of the earlier, smaller values.`,
    },
  ],
  traps: [
    {
      title: 'Index points read as percent',
      md: md`An index going from 120 to 150 has risen 30 points but only 25%. The percent change divides by the earlier value; only from a base of 100 do points and percent coincide.`,
    },
    {
      title: 'Adding changes that multiply',
      md: md`Price up 15% and volume down 10% looks like +5% revenue; it is $1.15 \times 0.9 = 1.035$, +3.5%. Any product of two changing quantities needs the multipliers multiplied.`,
    },
    {
      title: 'Undoing a fall with the same percent',
      md: md`After a 20% fall, a 20% rise leaves you at $0.8 \times 1.2 = 0.96$ of the start. Getting back needs +25%. Use the recovery table or divide by the multiplier.`,
    },
    {
      title: 'A share taken of the wrong whole',
      md: md`"20% of equities" is not 20% of the fund. In nested data, multiply the shares down to the whole the question asks about before you apply them to a total or turn them into an angle.`,
    },
    {
      title: 'Missing a unit or an axis',
      md: md`A column in €M, a chart with a second axis on the right, or a footnote that excludes a region can each turn a correct calculation into a wrong answer. Check units, axes and footnotes before any arithmetic.`,
    },
  ],
  check: [
    {
      id: 'check-sales-index',
      title: 'Growth from an index',
      topic: 'Numerical reasoning',
      stimulusMd: md`A chart shows a retailer's sales as an index, with 2022 = 100. The index stands at 135 in 2024 and at 162 in 2025.`,
      stemMd: md`By what percentage did sales grow from 2024 to 2025?`,
      options: [
        { id: 'A', text: md`About 16.7%`, note: md`Divides the 27-point rise by the 2025 value, 162, instead of the starting value, 135.` },
        { id: 'B', text: md`20%`, note: '' },
        { id: 'C', text: md`27%`, note: md`Reads the 27 index points as a percentage; points equal percent only when measured from the base of 100.` },
        { id: 'D', text: md`62%`, note: md`This is the growth from the 2022 base to 2025, not from 2024 to 2025.` },
      ],
      answer: 'B',
      workingMd: md`The rise is $162 - 135 = 27$ index points. As a percentage of the 2024 value: $\frac{27}{135} = \frac{1}{5} = 20\%$. Check: $135 \times 1.2 = 162$.`,
      lesson: 'Growth between two index values is the difference divided by the earlier value; index points are not percent.',
    },
    {
      id: 'check-metro-angle',
      title: 'A slice of a slice',
      topic: 'Numerical reasoning',
      stimulusMd: md`A city's budget is €1.2 billion. Transport receives 35% of the budget, and the metro receives 40% of the transport money. A pie chart shows the whole budget, with the metro as its own slice.`,
      stemMd: md`What is the central angle of the metro slice?`,
      options: [
        { id: 'A', text: md`$14^\circ$`, note: md`Finds the right share, 14% of the budget, but reads the percent as degrees without multiplying by 3.6.` },
        { id: 'B', text: md`$50.4^\circ$`, note: '' },
        { id: 'C', text: md`$126^\circ$`, note: md`This is the angle of the whole transport slice, 35% of $360^\circ$.` },
        { id: 'D', text: md`$144^\circ$`, note: md`Applies the metro's 40% to the whole circle; the 40% is a share of transport, not of the budget.` },
      ],
      answer: 'B',
      workingMd: md`The metro's share of the whole budget is $0.35 \times 0.40 = 0.14$, or 14%. Each percent of a pie chart is $3.6^\circ$, so the slice is $14 \times 3.6^\circ = 50.4^\circ$. The €1.2 billion total is not needed for the angle (the metro gets €168 million).`,
      lesson: 'Multiply nested shares down to the whole first, then convert: 1% of a pie chart is 3.6 degrees.',
    },
    {
      id: 'check-exports-reverse',
      title: 'Exports before two changes',
      topic: 'Numerical reasoning',
      stimulusMd: md`A firm's exports fell by 20% in 2024 and then rose by 10% in 2025, ending 2025 at €66M.`,
      stemMd: md`What were the firm's exports in 2023?`,
      options: [
        { id: 'A', text: md`€58.1M`, note: md`Applies the two changes forwards to €66M ($66 \times 0.8 \times 1.1$) instead of undoing them.` },
        { id: 'B', text: md`€71.3M`, note: md`Undoes the changes by reversing their signs ($66 \times 1.2 \times 0.9$); a 20% fall is not undone by a 20% rise.` },
        { id: 'C', text: md`€73.3M`, note: md`Adds the percents to a net 10% fall and divides by 0.9; successive changes multiply to 0.88, not 0.90.` },
        { id: 'D', text: md`€75M`, note: '' },
      ],
      answer: 'D',
      workingMd: md`The combined multiplier is $0.8 \times 1.1 = 0.88$, so $0.88 \times E_{2023} = 66$ and $E_{2023} = \frac{66}{0.88} = 75$. Check forwards: $75 \times 0.8 = 60$, and $60 \times 1.1 = 66$.`,
      lesson: 'To recover a starting value, divide by the product of all the multipliers, then check forwards.',
    },
  ],
  takeaways: [
    'Check units, axes and footnotes, then read only the cells the question names.',
    'Multiply nested shares down to the whole; 1% of a pie chart is 3.6 degrees.',
    'Index growth divides by the earlier value; points are not percent.',
    'Successive and combined changes multiply; to go back, divide by the multiplier.',
    'Know the reciprocals: 1/7 is 14.29%, 1/9 is 11.11%, 1/11 is 9.09%, 1/12 is 8.33%.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-numerical-reasoning' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
