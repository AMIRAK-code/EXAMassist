import { md, type Lesson } from '../../types';

/** Bocconi master's, Data insight: combining tables and charts (docs/COURSE-AUTHORING.md, the plan). */

export const combiningTablesAndChartsLesson: Lesson = {
  slug: 'combining-tables-and-charts',
  title: 'Combining tables, charts and short passages',
  summary: 'Link two displays through a shared key, turn shares into counts with the right totals, and use only the sources a question really needs.',
  minutes: 22,
  objectives: [
    'Link a table, a chart and a short passage through the category or period they share.',
    'Turn a rate from one display into a count with a total from another, then combine the counts.',
    'Decide which sources a question needs, and leave the rest alone.',
  ],
  teachMd: md`
### Why data comes in pieces

Bocconi describes numerical critical reasoning items as tables, histograms, graphs or simple passages followed by several questions. Often one display is not enough: a table gives totals, a chart gives percentages of those totals, and a sentence adds a price or a condition. The questions then reward one skill above all, joining the pieces correctly.

### Find the shared key

Two displays can be combined only through something they share: the same regions, the same years, the same product lines. Before computing anything, check three things:

1. **The same categories.** If the table lists four branches and the chart five, the fifth has no total to multiply.
2. **The same period.** A 2024 total and a 2023 percentage do not combine into a 2024 count.
3. **Compatible units.** Millions against thousands, monthly against yearly, counts against percentages. Convert before you combine.

Write the joined data as one small table on your sheet: one row per category, with the total, the rate, and a column for what you compute from them.

### Rates times totals give counts

The most common join is a total from one display and a percentage from another:

$$\text{count} = \text{rate} \times \text{total}$$

Suppose a table gives a company's revenue by region, North 50, Centre 30 and South 20 (millions of euros), and a bar chart gives the share of each region's revenue that came from online sales: North 40%, Centre 50%, South 25%. Online revenue is $0.4 \times 50 = 20$, $0.5 \times 30 = 15$ and $0.25 \times 20 = 5$ million. The region with the highest online **share**, Centre, is not the region with the most online **revenue**, North.

### Combine counts, never rates

To find the company's overall online share, add the counts: $\frac{20 + 15 + 5}{50 + 30 + 20} = \frac{40}{100} = 40\%$. The simple average of the three shares, $\frac{40 + 50 + 25}{3} \approx 38.3\%$, is wrong because the regions differ in size. This is the weighting rule of the previous lesson, applied across two displays.

### Passages add conditions and conversions

A short passage under the displays often supplies the last link: a price per unit, a cost per person, a definition, or a rule ("only branches with more than 100 staff qualify"). Read it for numbers and for conditions that remove categories. A conversion from a passage usually comes last: find the count from the displays, then apply the price or cost to it.

### Use only what the question needs

With several sources on screen, it is tempting to pull everything in. Instead, ask of each question: which quantity is asked for, and which display holds each ingredient? A question about shares within one chart needs only that chart; a question about counts needs the totals too. Data you did not need is not just wasted time; it is a chance to mix in the wrong period or unit.

### Different wholes in the same set

Two displays may both show percentages but of different wholes: one chart gives each region's share of company revenue, another the share of each region's revenue that is online. The first adds to 100% across regions; the second does not, because each bar has its own region as its whole. Before using a percentage, say what it is a percentage of. Multiplying a share of the company total by a regional total, for example, counts the region twice.

### Keep a running record

Because several questions build on the same set of displays, the joined table you write for the first question often answers the second and third. Label it clearly, keep the units in the header, and check one row by a second route (for example, that the counts add up to the stated total) before relying on it.
`,
  examples: [
    {
      id: 'example-most-online-revenue',
      title: 'Highest share or highest amount?',
      problemMd: md`A table gives a company's 2025 revenue by region, in millions of euros: North 50, Centre 30, South 20. A bar chart gives the percentage of each region's revenue that came from online sales: North 40%, Centre 50%, South 25%. Which region had the most online revenue, and what percent of the company's total revenue was online?`,
      steps: [
        md`Join the displays by region and multiply rate by total: North $0.4 \times 50 = 20$, Centre $0.5 \times 30 = 15$, South $0.25 \times 20 = 5$ (millions).`,
        md`The most online revenue is North's 20 million, although Centre has the highest online share.`,
        md`Overall share: add counts and totals, $\frac{20 + 15 + 5}{50 + 30 + 20} = \frac{40}{100} = 40\%$.`,
      ],
      answerMd: md`North had the most online revenue (€20 million), and 40% of total revenue was online. The tempting wrong answers are Centre (the highest share) and about 38.3% (the simple average of the three shares).`,
    },
    {
      id: 'example-orders-from-passage',
      title: 'Adding a conversion from a passage',
      problemMd: md`With the same displays, a note adds: "Online orders in the South averaged €50 each." How many online orders did the South receive in 2025?`,
      steps: [
        md`South's online revenue from the displays: $0.25 \times 20 = 5$ million euros.`,
        md`Convert with the passage: $\frac{5\,000\,000}{50} = 100\,000$ orders.`,
        md`Check the units: millions of euros divided by euros per order gives orders.`,
      ],
      answerMd: md`100,000 online orders. Dividing all 20 million of South's revenue by €50 gives 400,000, which counts offline sales as orders.`,
    },
  ],
  traps: [
    {
      title: 'Averaging rates from different-sized groups',
      md: md`Once rates are spread across two displays, it is easy to average them directly. Turn each into a count with its own total, add the counts, and divide by the summed totals.`,
    },
    {
      title: 'Highest rate taken for highest amount',
      md: md`A chart of percentages invites the conclusion that the tallest bar is also the largest amount. Amounts need the totals from the other display.`,
    },
    {
      title: 'Mismatched periods or units',
      md: md`A 2024 table and a 2023 chart, or totals in thousands and prices in euros, do not combine without care. Check the title and units of every source before multiplying.`,
    },
    {
      title: 'Using the complement by accident',
      md: md`If a chart shows the share who completed something, the share who did not is 100% minus it. Read whether the question asks about one group or the other before multiplying.`,
    },
  ],
  check: [
    {
      id: 'check-fewest-trained',
      title: 'Fewest employees trained',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`A table gives the number of employees at four branches of a bank in 2024, and a bar chart gives the percentage of each branch's employees who completed a training course that year.

| Branch | Employees | Completed training |
| --- | --- | --- |
| Alpha | 80 | 75% |
| Beta | 120 | 50% |
| Gamma | 50 | 90% |
| Delta | 150 | 40% |

A note adds: "Training costs €400 for each employee who completes it. The bank's 2024 training budget was €100,000."`,
      stemMd: md`Which branch had the fewest employees who completed the training?`,
      options: [
        { id: 'A', text: md`Alpha`, note: md`75% of 80 is 60, the same as Beta and Delta; that is more than Gamma's 45.` },
        { id: 'B', text: md`Beta`, note: md`Beta's 50% looks low, but 50% of 120 is 60 employees, more than Gamma's 45.` },
        { id: 'C', text: md`Gamma`, note: '' },
        { id: 'D', text: md`Delta`, note: md`Delta has the lowest **rate**, 40%, but it is the largest branch: 40% of 150 is 60 employees.` },
      ],
      answer: 'C',
      workingMd: md`Counts: Alpha $0.75 \times 80 = 60$; Beta $0.5 \times 120 = 60$; Gamma $0.9 \times 50 = 45$; Delta $0.4 \times 150 = 60$. The fewest is Gamma's 45.`,
      lesson: 'A question about numbers of people needs each rate multiplied by its own total.',
    },
    {
      id: 'check-overall-training-rate',
      title: 'The bank’s overall training rate',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the training data from the previous question.

| Branch | Employees | Completed training |
| --- | --- | --- |
| Alpha | 80 | 75% |
| Beta | 120 | 50% |
| Gamma | 50 | 90% |
| Delta | 150 | 40% |`,
      stemMd: md`Approximately what percent of the bank's employees at the four branches completed the training?`,
      options: [
        { id: 'A', text: md`44%`, note: md`This is the share who did **not** complete the training, $\frac{175}{400} \approx 43.75\%$.` },
        { id: 'B', text: md`56%`, note: '' },
        { id: 'C', text: md`62.5%`, note: md`62.5% is the median of the four branch rates, the average of 50% and 75%; it ignores branch sizes.` },
        { id: 'D', text: md`64%`, note: md`This is the simple average of the four rates, $\frac{75 + 50 + 90 + 40}{4} = 63.75\%$, which gives small Gamma as much weight as large Delta.` },
      ],
      answer: 'B',
      workingMd: md`Completed: $60 + 60 + 45 + 60 = 225$. Employees: $80 + 120 + 50 + 150 = 400$. Overall rate $\frac{225}{400} = 0.5625$, about 56%.`,
      lesson: 'An overall rate across displays is summed counts over summed totals.',
    },
    {
      id: 'check-training-budget',
      title: 'Was the budget enough?',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the training data and the note from the first question.

| Branch | Employees | Completed training |
| --- | --- | --- |
| Alpha | 80 | 75% |
| Beta | 120 | 50% |
| Gamma | 50 | 90% |
| Delta | 150 | 40% |

Training costs €400 for each employee who completes it. The bank's 2024 training budget was €100,000.`,
      stemMd: md`How did the bank's 2024 training cost at these four branches compare with its budget?`,
      options: [
        { id: 'A', text: md`€10,000 was left unspent.`, note: '' },
        { id: 'B', text: md`€30,000 was left unspent.`, note: md`This costs the 175 employees who did **not** complete training: $175 \times 400 = 70\,000$.` },
        { id: 'C', text: md`The budget was exceeded by €2,000.`, note: md`This uses the simple average rate, 63.75% of 400 = 255 completers, costing €102,000; the rates must be weighted by branch size.` },
        { id: 'D', text: md`The budget was exceeded by €60,000.`, note: md`This charges all 400 employees, €160,000, but the cost applies only to those who completed the training.` },
      ],
      answer: 'A',
      workingMd: md`225 employees completed the training (from the previous question), so the cost was $225 \times 400 = 90\,000$ euros. The budget was 100,000, leaving 10,000 unspent.`,
      lesson: 'Apply a passage’s price or cost last, to the count you built from the displays.',
    },
  ],
  takeaways: [
    'Join displays through a shared category, period and unit.',
    'Rate × total gives a count; combine counts, never rates.',
    'The highest rate is not the largest amount.',
    'Use a passage’s conversion last, and only the sources the question needs.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-data-insight', skill: 'grad-data-derived-conclusions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
