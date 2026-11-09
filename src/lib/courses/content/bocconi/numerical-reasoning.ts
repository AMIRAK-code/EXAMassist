import { md, type Lesson, type Unit } from '../../types';

/**
 * Bocconi standard test: Numerical reasoning. Every table and question is
 * original to this course; the firms and figures are invented. The only exam
 * facts used are those in docs/research/course-facts-2026-11-04.md: 6
 * numerical reasoning questions; "advanced knowledge of mathematics is not
 * required"; calculations are simple; the challenge is often to read a chart
 * or table correctly; calculators are not permitted.
 */

const exportsTable = md`**Exports of a small economy by destination, € million**

| Destination | 2023 | 2024 |
| --- | --- | --- |
| Region A | 320 | 368 |
| Region B | 250 | 240 |
| Region C | 180 | 216 |
| Region D | 150 | 176 |
| Total | 900 | 1,000 |`;

const fleetTable = md`**A delivery firm's vans**

| Van type | Number of vans | Fuel use (litres per 100 km) | Average daily distance per van (km) | Purchase price per van (€) |
| --- | --- | --- | --- | --- |
| Small | 12 | 7 | 150 | 28,000 |
| Medium | 8 | 9 | 180 | 36,000 |
| Large | 5 | 12 | 120 | 52,000 |

Every van is driven every working day. Diesel costs €1.80 per litre.`;

const chartsLesson: Lesson = {
  slug: 'charts-and-tables',
  title: 'Reading charts and tables correctly',
  summary: 'Read the frame of a table before its numbers, and keep levels, changes, percentage changes, shares and index points apart.',
  minutes: 20,
  objectives: [
    'Read a table’s title, units, headers and notes before using any number in it.',
    'Distinguish a level, an absolute change and a percentage change, and compute each from a table.',
    'Work with shares, totals and index numbers without mixing up their bases.',
  ],
  teachMd: md`
### What the area tests

Bocconi says that advanced knowledge of mathematics is not required for numerical reasoning: the calculations are simple, and the challenge is often to read a chart or table correctly. The standard test has six numerical reasoning questions, mixed in with the other areas. The skill, then, is less arithmetic than discipline: reading exactly what the data shows before computing anything.

### Read the frame before the numbers

Every table or chart has a frame that tells you what its numbers mean. Read it first, every time.

- **Title:** what is measured, for whom, over what period.
- **Units:** euros or millions of euros; people or percent of people; litres per 100 km.
- **Headers:** which row and which column a number belongs to. In a table with years as columns, a misread column gives a perfectly plausible wrong answer.
- **Notes:** "figures in € million", "2024 provisional", "excludes part-time staff".
- **Axis of a chart:** where the scale starts. A bar chart whose axis starts at 80 rather than 0 makes small differences look large; read the values, not the heights.

### Levels, changes and rates

Most questions ask for one of three things, and the wrong options are often built from the other two.

| Asked for | Calculation | Example: 240 to 300 |
| --- | --- | --- |
| Level | Read the value | 300 |
| Absolute change | new − old | +60 |
| Percentage change | (new − old) ÷ old | +25% |

The largest absolute change and the largest percentage change often belong to different rows. A small starting value can produce a large percentage change from a modest absolute change.

### Shares and totals

When a table gives shares (percent of a total), a falling share does not mean a falling amount: if the total grows, a smaller share of a bigger total can still be more. To compare amounts across years, turn shares into amounts by multiplying by each year's total. A change in a share is measured in percentage points.

### Index numbers

An index sets a base period equal to 100 and expresses other periods relative to it. An index of 124 means 24% above the base period. But a move from 118 to 124 is 6 index points, which is a rise of $\frac{6}{118} \approx 5.1\%$, not 6%: a percentage change is measured from the starting value, not from the base year.

### Averages of rates

If one group grows by 10% and another by 30%, the two together grew by 20% only if they started the same size. The combined rate is a weighted average, closer to the rate of the larger group. To combine, go back to amounts: add the starting amounts, add the final amounts, then compute one percentage change.

### Charts carry the same information

Bar, line and pie charts are tables drawn as pictures. Read them as you would a table: identify the category, the period and the value, write down the values you need, then compute. Estimate from a picture only when the options are far enough apart to allow it.

### A routine for data questions

1. Read the question and name exactly what it asks for: a level, a change, a percentage change, a share or a comparison.
2. Read the frame: units, periods, notes.
3. Write down only the values you need.
4. Compute, then check the order of magnitude against the data.

The routine costs a few seconds and removes the commonest errors, which are not arithmetic errors at all but reading errors.
`,
  examples: [
    {
      id: 'example-largest-increase',
      title: 'Largest increase: absolute or percentage?',
      problemMd: md`**Quarterly sales by region, € thousand**

| Region | Q1 | Q4 |
| --- | --- | --- |
| North | 240 | 300 |
| Centre | 400 | 460 |
| South | 150 | 195 |

Which region had the largest percentage increase in sales from Q1 to Q4?`,
      steps: [
        md`Name the target: a **percentage** increase, so each change must be divided by that region's Q1 value.`,
        md`Absolute changes: North $300 - 240 = 60$; Centre $460 - 400 = 60$; South $195 - 150 = 45$.`,
        md`Percentage changes: North $\frac{60}{240} = 25\%$; Centre $\frac{60}{400} = 15\%$; South $\frac{45}{150} = 30\%$.`,
        md`South has the smallest absolute increase but the largest percentage increase, because it started from the smallest base.`,
      ],
      answerMd: md`South, with 30%. Centre, which has the largest sales, and North, which ties for the largest absolute increase, are the tempting wrong answers.`,
    },
    {
      id: 'example-index-points',
      title: 'Index points are not percent',
      problemMd: md`A price index has 2020 = 100. It stands at 118 in 2023 and 124 in 2024. By what percentage did prices rise from 2023 to 2024?`,
      steps: [
        md`The change is $124 - 118 = 6$ index points.`,
        md`A percentage change is measured from the starting value, which is 118, not the base of 100: $\frac{6}{118}$.`,
        md`By hand: $\frac{6}{118} \approx \frac{6}{120} = 0.05$, and since 118 is a little less than 120 the true value is a little more, about 5.1%.`,
      ],
      answerMd: md`About 5.1%. "6%" is the tempting answer: it treats index points as percentages, which works only when the starting value is exactly 100.`,
    },
    {
      id: 'example-share-and-amount',
      title: 'A smaller share of a bigger total',
      problemMd: md`**Average monthly household spending**

| | 2020 | 2024 |
| --- | --- | --- |
| Total spending (€) | 2,000 | 2,500 |
| Housing, share of total | 30% | 28% |

Did spending on housing rise or fall, and by how much?`,
      steps: [
        md`The share fell by 2 percentage points, but the question asks about the **amount**, so convert each share using its own year's total.`,
        md`2020: $0.30 \times 2{,}000 = 600$ euros. 2024: $0.28 \times 2{,}500 = 700$ euros.`,
        md`Change: $700 - 600 = 100$ euros, which is $\frac{100}{600} \approx 16.7\%$.`,
      ],
      answerMd: md`Housing spending rose by €100 a month, about 16.7%, even though its share fell by 2 percentage points. "It fell" is the tempting wrong answer.`,
    },
  ],
  traps: [
    {
      title: 'Wrong row or column',
      md: md`In a dense table, a value from the neighbouring column or row is read by mistake. The result looks reasonable, so nothing warns you. Put a finger, or the cursor, on the row and column headers before reading a value.`,
    },
    {
      title: 'Absolute change for percentage change',
      md: md`The row with the biggest increase in euros is chosen when the question asks for the biggest percentage increase. Divide each change by its own starting value before comparing.`,
    },
    {
      title: 'Ignoring the units line',
      md: md`A table "in € million" or "in thousands" is read as plain units, and an option a thousand times too small or large is chosen. Read the title and notes first and carry the unit through the calculation.`,
    },
    {
      title: 'Averaging percentages',
      md: md`Two rates are averaged as if the groups were the same size. Go back to the amounts, add them, and compute one percentage from the totals.`,
    },
    {
      title: 'Share down, so amount down',
      md: md`A falling share is read as a falling amount. If the total grew, the amount may have risen. Multiply each share by its own total before comparing.`,
    },
  ],
  check: [
    {
      id: 'check-fastest-growing-destination',
      title: 'Fastest-growing destination',
      topic: 'Numerical reasoning',
      stimulusMd: exportsTable,
      stemMd: md`Which destination had the largest percentage increase in exports from 2023 to 2024?`,
      options: [
        { id: 'A', text: md`Region A`, note: md`Region A had the largest increase in euros (48 million), but on its large base that is only 15%.` },
        { id: 'B', text: md`Region B`, note: md`Exports to Region B fell, from 250 to 240 million.` },
        { id: 'C', text: md`Region C`, note: '' },
        { id: 'D', text: md`Region D`, note: md`Region D grew by $\frac{26}{150} \approx 17.3\%$: close, but below Region C.` },
      ],
      answer: 'C',
      workingMd: md`Changes: A $+48$ on 320, which is 15%; B $-10$ on 250, which is $-4\%$; C $+36$ on 180, which is 20%; D $+26$ on 150, which is about 17.3%. Region C grew fastest in percentage terms.`,
      lesson: 'Rank percentage changes by dividing each change by its own starting value; the largest change in euros is often not the largest percentage.',
    },
    {
      id: 'check-share-change',
      title: 'Region A’s share of exports',
      topic: 'Numerical reasoning',
      stimulusMd: exportsTable,
      stemMd: md`How did Region A's share of total exports change from 2023 to 2024?`,
      options: [
        { id: 'A', text: md`It rose by about 1.2 percentage points.`, note: '' },
        { id: 'B', text: md`It rose by 4.8 percentage points.`, note: md`4.8 is Region A's increase of 48 million as a percentage of the 2024 total. That is not a change in its share.` },
        { id: 'C', text: md`It rose by 15 percentage points.`, note: md`15% is the growth of Region A's exports, a percentage change, not a change in its share of the total.` },
        { id: 'D', text: md`It fell by about 1.2 percentage points.`, note: md`Right size, wrong direction: Region A grew faster (15%) than total exports (about 11%), so its share rose.` },
      ],
      answer: 'A',
      workingMd: md`2023 share: $\frac{320}{900} \approx 35.6\%$. 2024 share: $\frac{368}{1{,}000} = 36.8\%$. Change: $36.8 - 35.6 \approx +1.2$ percentage points. A quick cross-check: Region A grew faster than the total, so its share had to rise.`,
      lesson: 'A share is a part divided by its own year’s total; compare shares in percentage points.',
    },
    {
      id: 'check-faster-than-total',
      title: 'Which grew faster than the total?',
      topic: 'Numerical reasoning',
      stimulusMd: exportsTable,
      stemMd: md`Which destinations' exports grew by a larger percentage than total exports from 2023 to 2024?`,
      options: [
        { id: 'A', text: md`Region C only`, note: md`Region C grew fastest, but the question asks for every destination above the total's rate, not for the fastest.` },
        { id: 'B', text: md`Regions A and C only`, note: md`Leaves out Region D, probably because of its small increase in euros (26 million); in percentage terms it grew by about 17%.` },
        { id: 'C', text: md`All four regions`, note: md`Exports to Region B fell, so B cannot have grown faster than the total.` },
        { id: 'D', text: md`Regions A, C and D`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Total exports grew from 900 to 1,000, which is $\frac{100}{900} \approx 11.1\%$. Region A grew 15%, C 20% and D about 17.3%, all above 11.1%; B fell by 4%. So A, C and D grew faster than the total.`,
      lesson: 'Compare like with like: percentage growth of each part against percentage growth of the total.',
    },
  ],
  takeaways: [
    md`Read the title, units, headers and notes before any number.`,
    md`Decide whether the question asks for a level, an absolute change or a percentage change.`,
    md`A falling share can hide a rising amount; changes in shares are in percentage points.`,
    md`Index points become percentages only when divided by the starting value.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-numerical-reasoning', skill: 'numerical-reasoning-charts-tables' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const relevanceLesson: Lesson = {
  slug: 'relevant-and-superfluous-information',
  title: 'Separating relevant from superfluous information',
  summary: 'Start from the question, write the formula it needs, and take only those inputs from the data, so extra figures cannot pull you off course.',
  minutes: 20,
  objectives: [
    'Write the formula a data question needs before looking for numbers.',
    'Recognise the usual kinds of superfluous information and ignore them.',
    'Tell when an essential input is missing, so that the answer cannot be determined.',
  ],
  teachMd: md`
### More data than you need

Data questions often give more information than the question needs: extra columns in a table, an extra year, figures for a group the question does not ask about, a cost when the question is about a quantity. That is not a trick in itself; real reports look like that. It becomes a trap when you start computing with the first numbers you see instead of with the numbers the question requires.

### Start from the question, not the data

The reliable method runs backwards.

1. **Name the target.** What quantity, in what unit, for which group and which period? "Revenue per kilogram" is not "revenue", and "in March" is not "in the first quarter".
2. **Write the formula.** Revenue = quantity × price. Fuel used = distance × consumption per km. Profit margin = profit ÷ revenue. Room revenue per night = rooms × occupancy rate × price per room.
3. **Fill the formula.** Go to the data for exactly the inputs the formula needs. Everything else is, for this question, noise.

Writing the formula first protects you from the commonest error, which is using a number because it is there.

### Typical superfluous information

| Kind | Example |
| --- | --- |
| A column the formula does not use | Number of staff, when the question is about revenue |
| A different period | Annual figures, when the question asks about one month |
| A different group | Data for all employees, when the question is about part-time staff |
| A total that already contains the part | Total costs and fixed costs, when only variable costs are asked for |
| A figure that matches an option | A number in the data that appears among the options but answers a different question |

### Information that is the same for everyone

When a quantity is the same for every item being compared (one fuel price for all vans, one tax rate for all firms), it cannot change a ranking. You need it to compute an amount in euros, but not to decide which item is cheapest. Spotting this saves time and removes a chance to slip.

### When something essential is missing

The opposite also happens: the data may lack an input the formula needs. A profit margin rising from 8% to 10% does not tell you whether profit rose, because profit = margin × revenue and revenue is not given. If revenue fell from €1,000,000 to €700,000, profit fell from €80,000 to €70,000 despite the higher margin; if revenue held steady, profit rose. When an option says the answer cannot be determined, take it seriously exactly when your formula has an empty slot that no data fills.

### Check consistency, not just relevance

Sometimes the same quantity can be reached two ways, for example a total given in the table and the sum of its parts. If they disagree, re-read the frame: one of them may exclude something (a category, a footnote). Use the figure that matches the question's definition.

### Units are where extra data hides

Superfluous information often arrives in a different unit: grams beside kilograms, months beside years, thousands beside units, litres per 100 km beside kilometres per day. Before combining two numbers, make sure their units fit the formula, and convert once, at the start. A unit that does not cancel properly is a sign you have picked up the wrong number.

### A routine

- Name the target and its unit.
- Write the formula with empty slots.
- Fill each slot from the data; cross out everything else.
- If a slot cannot be filled, consider whether the answer is undeterminable.
`,
  examples: [
    {
      id: 'example-coffee-per-kilo',
      title: 'Price per kilogram, with distractions',
      problemMd: md`A shop sells coffee beans in 250 g bags for €6.50 and in 1 kg bags for €22. Last month it sold 340 of the 250 g bags, 60% of them in the first fortnight, and 85 of the 1 kg bags. The shop is open 26 days a month. How much more does a customer pay per kilogram when buying the small bags?`,
      steps: [
        md`Name the target: price **per kilogram** for each bag size, then the difference. The formula is price ÷ weight in kg.`,
        md`Small bags: 250 g is a quarter of a kilogram, so the price per kg is $6.50 \times 4 = 26$ euros.`,
        md`Large bags: €22 per kg already.`,
        md`Difference: $26 - 22 = 4$ euros per kilogram. The numbers of bags sold, the 60% and the 26 opening days play no part.`,
      ],
      answerMd: md`€4 more per kilogram. Using the sales figures (for example, comparing revenue from each size) answers a different question.`,
    },
    {
      id: 'example-hotel-revenue',
      title: 'Choosing columns',
      problemMd: md`| Hotel | Rooms | Occupancy rate | Average price per occupied room per night (€) | Staff |
| --- | --- | --- | --- | --- |
| P | 120 | 75% | 90 | 40 |
| Q | 80 | 90% | 110 | 35 |
| R | 200 | 50% | 70 | 60 |

Which hotel earns the most room revenue per night?`,
      steps: [
        md`Formula: room revenue per night = rooms × occupancy rate × price per occupied room. The staff column is not in the formula.`,
        md`P: $120 \times 0.75 = 90$ occupied rooms, and $90 \times 90 = 8{,}100$ euros.`,
        md`Q: $80 \times 0.9 = 72$ occupied rooms, and $72 \times 110 = 7{,}920$ euros.`,
        md`R: $200 \times 0.5 = 100$ occupied rooms, and $100 \times 70 = 7{,}000$ euros.`,
      ],
      answerMd: md`Hotel P, with €8,100 a night. Q (highest price and occupancy) and R (most rooms) are tempting if you judge by a single column.`,
    },
    {
      id: 'example-missing-input',
      title: 'When the data cannot answer',
      problemMd: md`A firm's profit margin (profit as a percentage of revenue) rose from 8% in 2023 to 10% in 2024. Did its profit rise?`,
      steps: [
        md`Formula: profit = margin × revenue. The margin is given for both years; revenue is not.`,
        md`Try a case: revenue €1,000,000 in both years gives profit €80,000 then €100,000, a rise.`,
        md`Try another: revenue €1,000,000 then €700,000 gives €80,000 then $0.10 \times 700{,}000 = 70{,}000$ euros, a fall.`,
      ],
      answerMd: md`It cannot be determined from the data: the answer depends on revenue, which is missing. "Yes, because the margin rose" is the tempting wrong answer.`,
    },
  ],
  traps: [
    {
      title: 'Using a number because it is there',
      md: md`Every figure in the data feels as if it must be used. It need not be. Write the formula first; a number with no slot in the formula is noise for this question.`,
    },
    {
      title: 'The number that matches an option',
      md: md`A figure from the table, or a quick product of two figures, appears among the options. Recognition feels like confirmation. Check that the option answers the question asked, in its unit and for its group.`,
    },
    {
      title: 'Filling a missing input by assumption',
      md: md`When an input is missing, it is tempting to assume it stayed the same. Unless the data says so, it may not have. If an empty slot changes the answer, the answer cannot be determined.`,
    },
    {
      title: 'Mixing units',
      md: md`Grams and kilograms, litres per 100 km and kilometres, monthly and yearly figures sit side by side. Convert everything to the units of the formula before multiplying.`,
    },
  ],
  check: [
    {
      id: 'check-medium-van-fuel',
      title: 'Daily fuel for the medium vans',
      topic: 'Numerical reasoning',
      stimulusMd: fleetTable,
      stemMd: md`How many litres of diesel do the medium vans use in total on an average day?`,
      options: [
        { id: 'A', text: md`16.2 litres`, note: md`This is one medium van's daily fuel; there are 8 of them.` },
        { id: 'B', text: md`72 litres`, note: md`Multiplies the number of vans by the fuel use per 100 km, ignoring the daily distance.` },
        { id: 'C', text: md`129.6 litres`, note: '' },
        { id: 'D', text: md`233.28 litres`, note: md`This is the cost of that fuel in euros ($129.6 \times 1.80$), not a quantity in litres.` },
      ],
      answer: 'C',
      workingMd: md`One medium van drives 180 km at 9 litres per 100 km: $1.8 \times 9 = 16.2$ litres a day. Eight vans use $8 \times 16.2 = 129.6$ litres. The purchase prices, the diesel price and the other van types are not needed.`,
      lesson: 'Fuel used = distance × consumption per km × number of vehicles; price and purchase cost belong to other questions.',
    },
    {
      id: 'check-not-needed',
      title: 'What is not needed?',
      topic: 'Numerical reasoning',
      stimulusMd: fleetTable,
      stemMd: md`To decide which van type has the lowest fuel cost per kilometre, which of the given information is NOT needed?`,
      options: [
        { id: 'A', text: md`Everything except the fuel use per 100 km`, note: '' },
        { id: 'B', text: md`Only the purchase prices`, note: md`The number of vans, the daily distances and the diesel price are not needed either: none of them changes the cost per kilometre ranking.` },
        { id: 'C', text: md`The purchase prices and the number of vans`, note: md`Still keeps the daily distance and the diesel price. Per-kilometre cost does not depend on distance, and one price for all vans cannot change a ranking.` },
        { id: 'D', text: md`The purchase prices, the number of vans and the daily distances`, note: md`Keeps the diesel price. You would need it to state the cost in euros, but not to rank the types, because it is the same for all of them.` },
      ],
      answer: 'A',
      workingMd: md`Fuel cost per km = (litres per km) × (price per litre). The price per litre is the same for every type, so the ranking depends only on litres per 100 km: the small van (7) is lowest. Number of vans, daily distance and purchase price do not enter the formula, and the diesel price cannot change the order.`,
      lesson: 'A factor shared equally by everything being compared cannot change a ranking.',
    },
    {
      id: 'check-fleet-fuel-cost',
      title: 'Daily fuel bill for the fleet',
      topic: 'Numerical reasoning',
      stimulusMd: fleetTable,
      stemMd: md`What is the firm's total diesel cost for the whole fleet on an average day?`,
      options: [
        { id: 'A', text: md`€73.98`, note: md`This is the cost for one van of each type; it ignores how many vans of each type there are.` },
        { id: 'B', text: md`€327.60`, note: md`327.6 is the fleet's daily fuel in litres; it still has to be multiplied by €1.80.` },
        { id: 'C', text: md`€460.08`, note: md`Leaves out the large vans, which use 72 litres a day between them.` },
        { id: 'D', text: md`€589.68`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Litres per day: small $12 \times 1.5 \times 7 = 126$; medium $8 \times 1.8 \times 9 = 129.6$; large $5 \times 1.2 \times 12 = 72$. Total $126 + 129.6 + 72 = 327.6$ litres. Cost: $327.6 \times 1.8 = 589.68$ euros. Check: $327.6 \times 2 = 655.2$, minus $327.6 \times 0.2 = 65.52$, gives 589.68.`,
      lesson: 'Build a total from its parts with every multiplier the formula needs, then convert to euros once at the end.',
    },
  ],
  takeaways: [
    md`Name the target and its unit, then write the formula before reading the data.`,
    md`A number with no slot in the formula is superfluous for this question.`,
    md`A factor that is the same for everything compared cannot change a ranking.`,
    md`If a slot in the formula cannot be filled, the answer may not be determinable.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-numerical-reasoning', skill: 'numerical-reasoning-relevance' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const handLesson: Lesson = {
  slug: 'calculating-by-hand',
  title: 'Calculating quickly by hand',
  summary: 'Percentages by pieces, fraction equivalents, splitting products, cross-multiplying and estimating: fast, reliable arithmetic without a calculator.',
  minutes: 20,
  objectives: [
    'Compute percentages, products and quotients by hand with short, safe methods.',
    'Compare fractions and ratios exactly without long division.',
    'Decide from the options how precise a calculation needs to be, and check its order of magnitude.',
  ],
  teachMd: md`
### Why hand calculation is a skill of its own

Calculators are not permitted in the Online Bocconi Test, and Bocconi describes the numerical reasoning calculations as simple. Simple does not mean instant: a multiplication done digit by digit takes time you could spend reading the data. This lesson makes the common calculations short and shows how to check them quickly.

### Look at the options before you calculate

The options tell you how precise you need to be. If they are 6%, 12%, 25% and 40%, a rough estimate decides the question; if two of them are 8.75% and 9%, you need the exact value. Decide the precision first, then calculate only as far as you need.

### Percentages by pieces

Build any percentage from easy pieces: 10% (move the decimal point one place), 5% (half of 10%), 1% (move it two places).

- 18% of 350 = 10% (35) + 5% (17.5) + 3% ($3 \times 3.5 = 10.5$) = 63.
- 2.5% of 36,000 = $2.5 \times 360 = 900$.

A useful swap: $x$% of $y$ equals $y$% of $x$. So 16% of 25 is 25% of 16, which is 4.

### Fractions worth knowing as percentages

| Fraction | Percent | Fraction | Percent |
| --- | --- | --- | --- |
| 1/2 | 50% | 1/8 | 12.5% |
| 1/3 | 33.3% | 1/10 | 10% |
| 1/4 | 25% | 1/12 | 8.3% |
| 1/5 | 20% | 1/20 | 5% |
| 1/6 | 16.7% | 1/25 | 4% |

With these, 87.5% of 640 is 640 minus an eighth of 640: $640 - 80 = 560$. And dividing by 0.125 is the same as multiplying by 8.

### Multiplying and dividing by splitting

Split one factor into easy parts: $24 \times 15 = 24 \times 10 + 24 \times 5 = 240 + 120 = 360$. Or use a nearby round number: $49 \times 18 = 50 \times 18 - 18 = 900 - 18 = 882$.

For division, simplify first: $\frac{40\,500}{450} = \frac{4\,050}{45} = 90$. Cancel common factors before dividing. To divide by 5, double and divide by 10.

### Comparing fractions without dividing

To tell which of $\frac{a}{b}$ and $\frac{c}{d}$ is larger (all numbers positive), compare $a \times d$ with $c \times b$. The larger product goes with the larger fraction. This is often faster than turning both into decimals, and it is exact.

### Percentage change in one line

Percentage change = change ÷ starting value. Work out the change first, then look for an easy relationship with the base: an increase of 45 on 900 is $\frac{45}{900} = \frac{1}{20} = 5\%$.

### Averages from a guess

To average a list of similar numbers, choose a round guess, add up the differences from it, and correct. For 96, 103, 99 and 106 with a guess of 100, the differences are −4, +3, −1 and +6, which sum to +4; spread over 4 numbers that is +1, so the mean is 101.

### Check the size of the answer

Before choosing, ask whether the answer has the right order of magnitude. A 2.5% charge on €36,000 cannot be €9,000 (that would be 25%). A percentage below 100% of a number must be smaller than the number; 5% growth on a million is 50,000, not 500,000. Most hand-calculation errors are misplaced decimal points, and this check catches them.

### Round late, and round both numbers the same way

If you must round, round once, near the end, and when rounding two numbers in a division, round both the same way (both up or both down) so the errors partly cancel. Rounding the numerator up and the denominator down pushes the result off twice.
`,
  examples: [
    {
      id: 'example-percent-pieces',
      title: '35% of 260',
      problemMd: md`What is 35% of 260?`,
      steps: [
        md`10% of 260 is 26, so 30% is $3 \times 26 = 78$.`,
        md`5% is half of 10%: 13.`,
        md`35% = 30% + 5% = $78 + 13 = 91$.`,
        md`Check another way: $260 \times 0.35 = 260 \times \frac{7}{20} = 13 \times 7 = 91$.`,
      ],
      answerMd: md`91. Both routes agree.`,
    },
    {
      id: 'example-compare-fractions',
      title: 'Which ratio is larger?',
      problemMd: md`Branch X converted 37 of 52 enquiries into sales; branch Y converted 43 of 61. Which branch had the higher conversion rate?`,
      steps: [
        md`Compare $\frac{37}{52}$ with $\frac{43}{61}$ by cross-multiplying.`,
        md`$37 \times 61 = 37 \times 60 + 37 = 2{,}220 + 37 = 2{,}257$.`,
        md`$43 \times 52 = 43 \times 50 + 43 \times 2 = 2{,}150 + 86 = 2{,}236$.`,
        md`$2{,}257 > 2{,}236$, so $\frac{37}{52}$ is larger. (As decimals: about 0.712 against 0.705.)`,
      ],
      answerMd: md`Branch X. Branch Y, with more sales in absolute terms, is the tempting wrong answer.`,
    },
    {
      id: 'example-estimate-change',
      title: 'Estimating a percentage change',
      problemMd: md`Sales rose from 4,870 units to 5,360. Which is closest to the percentage increase: 8%, 10%, 12% or 15%?`,
      steps: [
        md`The options are 2 or more points apart, so an estimate is enough.`,
        md`Change: $5{,}360 - 4{,}870 = 490$.`,
        md`10% of 4,870 is 487, almost exactly 490. So the increase is just over 10% (about 10.06%).`,
      ],
      answerMd: md`About 10%. Dividing by the new value instead ($\frac{490}{5{,}360} \approx 9.1\%$) would still round to the nearest option here, but on closer options that slip would cost the mark.`,
    },
    {
      id: 'example-average-from-guess',
      title: 'An average from a guess',
      problemMd: md`Monthly sales over five months were 48, 52, 47, 55 and 53 units. What was the average?`,
      steps: [
        md`Guess 50. Differences: $-2, +2, -3, +5, +3$.`,
        md`Sum of differences: $-2 + 2 - 3 + 5 + 3 = 5$. Spread over 5 months: $+1$.`,
        md`Average $= 50 + 1 = 51$. Check: $48 + 52 + 47 + 55 + 53 = 255$, and $\frac{255}{5} = 51$.`,
      ],
      answerMd: md`51 units a month.`,
    },
  ],
  traps: [
    {
      title: 'Losing a decimal place',
      md: md`Under time pressure, 1.5% becomes 0.15 or 15%, and an option ten times too big or too small is waiting. Check the order of magnitude: 1% of a number is that number with the decimal point moved two places.`,
    },
    {
      title: 'Dividing by the wrong base',
      md: md`A percentage change is computed on the new value instead of the old one. The result is close enough to look right and far enough to match a wrong option. Always divide by the starting value.`,
    },
    {
      title: 'Estimating when the options are close',
      md: md`Rounding is quick, but when two options differ by a fraction of a percentage point, rounding can land on the wrong one. Read the options first and compute exactly when they are close.`,
    },
    {
      title: 'Rounding in opposite directions',
      md: md`In a quotient, rounding the top up and the bottom down moves the result twice in the same direction. Round both the same way, or not at all.`,
    },
  ],
  check: [
    {
      id: 'check-fund-fee',
      title: 'An annual fee',
      topic: 'Numerical reasoning',
      stemMd: md`An investment fund charges an annual fee of 1.5% on a balance of €84,000. What is the fee?`,
      options: [
        { id: 'A', text: md`€126`, note: md`Ten times too small: this is 0.15% of the balance, a decimal slip.` },
        { id: 'B', text: md`€1,260`, note: '' },
        { id: 'C', text: md`€1,500`, note: md`This is 1.5% of a rounded €100,000, not of €84,000.` },
        { id: 'D', text: md`€12,600`, note: md`Ten times too large: this is 15% of the balance.` },
      ],
      answer: 'B',
      workingMd: md`1% of 84,000 is 840; 0.5% is half of that, 420. So 1.5% is $840 + 420 = 1{,}260$ euros. Check: $84{,}000 \times 0.015 = 84 \times 15 = 1{,}260$.`,
      lesson: 'Build a percentage from 1% and its halves, then check the order of magnitude against the options.',
    },
    {
      id: 'check-profit-margins',
      title: 'Comparing profit margins',
      topic: 'Numerical reasoning',
      stemMd: md`Firm X had revenue of €640,000 and profit of €56,000. Firm Y had revenue of €450,000 and profit of €40,500. The profit margin is profit divided by revenue. Which firm had the higher profit margin, and by how much?`,
      options: [
        { id: 'A', text: md`Firm Y, by 0.25 percentage points`, note: '' },
        { id: 'B', text: md`Firm Y, by 2.5 percentage points`, note: md`Right firm, but the gap is ten times too large: 9% minus 8.75% is 0.25 points.` },
        { id: 'C', text: md`Firm X, because its profit is larger`, note: md`A margin is profit relative to revenue. X's larger profit comes with much larger revenue.` },
        { id: 'D', text: md`Neither: both margins are 9%`, note: md`Rounding both margins to about 9% hides the gap. With options this close, compute exactly.` },
      ],
      answer: 'A',
      workingMd: md`X: $\frac{56{,}000}{640{,}000} = \frac{56}{640} = \frac{7}{80} = 0.0875$, so 8.75%. Y: $\frac{40{,}500}{450{,}000} = \frac{405}{4{,}500} = 0.09$, so 9%. Firm Y's margin is higher by $9 - 8.75 = 0.25$ percentage points.`,
      lesson: 'Simplify a ratio by cancelling before dividing, and compute exactly when the options are close together.',
    },
    {
      id: 'check-population-growth',
      title: 'Population growth',
      topic: 'Numerical reasoning',
      stemMd: md`A city's population grew from 1,240,000 to 1,302,000. What was the percentage growth?`,
      options: [
        { id: 'A', text: md`0.5%`, note: md`Moves the decimal point one place too far: 62,000 is a twentieth of 1,240,000, which is 5%.` },
        { id: 'B', text: md`About 4.8%`, note: md`Divides the increase by the new population, 1,302,000, instead of the starting one.` },
        { id: 'C', text: md`5%`, note: '' },
        { id: 'D', text: md`6.2%`, note: md`Reads the increase of 62,000 as a percentage of a round million rather than of 1,240,000.` },
      ],
      answer: 'C',
      workingMd: md`Increase: $1{,}302{,}000 - 1{,}240{,}000 = 62{,}000$. Percentage change: $\frac{62{,}000}{1{,}240{,}000} = \frac{62}{1{,}240} = \frac{1}{20} = 5\%$. Check: 5% of 1,240,000 is 62,000.`,
      lesson: 'Find the change, then look for a simple fraction of the starting value.',
    },
  ],
  takeaways: [
    md`Look at the options first: they tell you how precise the calculation must be.`,
    md`Build percentages from 10%, 5% and 1%, and know the common fractions as percentages.`,
    md`Compare fractions by cross-multiplying instead of dividing.`,
    md`Divide percentage changes by the starting value, and check the order of magnitude before choosing.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-numerical-reasoning', skill: 'numerical-reasoning-hand-calculation' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const numericalReasoningUnit: Unit = {
  slug: 'numerical-reasoning',
  title: 'Numerical reasoning',
  summary: 'Six questions of the standard Online Bocconi Test are numerical reasoning. Bocconi says advanced mathematics is not required and the calculations are simple; the difficulty is often reading a chart or table correctly. Calculators are not allowed. These lessons cover reading data, choosing the information a question needs, and calculating quickly by hand. All tables and figures are invented for the course.',
  lessons: [chartsLesson, relevanceLesson, handLesson],
};
