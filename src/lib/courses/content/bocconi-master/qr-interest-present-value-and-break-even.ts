import { md, type Lesson } from '../../types';

export const interestPresentValueAndBreakEvenLesson: Lesson = {
  slug: 'interest-present-value-and-break-even',
  title: 'Interest, present value and break-even',
  summary: 'Grow money with simple and compound interest, discount it to present value, value perpetuities, and find bond yields and break-even points by hand.',
  minutes: 25,
  objectives: [
    'Tell simple from compound interest and compute future values by hand.',
    'Discount a future amount to its present value, and find the yield of a zero-coupon bond from its price and face value.',
    'Value a level or growing perpetuity, and find a break-even quantity from the contribution margin.',
  ],
  teachMd: md`
### Simple and compound interest

Simple interest is paid on the original amount only. At a rate $r$ a year, each year adds $P \times r$, so after $n$ years the balance is $P(1 + nr)$.

Compound interest is added to the balance and from then on earns interest itself. Each year multiplies the balance by $1 + r$, so after $n$ years
$$\text{FV} = \text{PV} \times (1 + r)^n,$$
where PV is the amount today and FV the future value. This is the multiplier from [percentages and successive changes](/courses/bocconi-master/percentages-and-successive-changes), with the same change applied $n$ times.

€1,000 at 10% a year for three years:

| Year | Simple | Compound |
| --- | --- | --- |
| 1 | 1,100 | 1,100 |
| 2 | 1,200 | 1,210 |
| 3 | 1,300 | 1,331 |

The gap of €31 is interest on interest: 10% of the first year's €100 in year 2, then 10% of the €210 earned so far in year 3. After the first year compounding always gives more, and the gap widens with time.

Read which kind the question describes: "compounded", "reinvested" or "added to the balance" mean compound interest; "simple interest" or interest "paid out each year" mean simple. If a yearly rate is credited in parts, use the rate per period and the number of periods: 10% a year credited every half-year is 5% per half-year, so two years multiply by $1.05^4$, not $1.1^2$.

### Powers by hand

Calculators are not permitted during the test, so keep a few powers ready and build the others:

- $1.1^2 = 1.21$, $1.1^3 = 1.331$, $1.2^2 = 1.44$, $1.2^3 = 1.728$, $1.05^2 = 1.1025$.
- Square any multiplier with $(1 + r)^2 = 1 + 2r + r^2$: $1.06^2 = 1 + 0.12 + 0.0036 = 1.1236$.
- For small rates, $(1 + r)^n \approx 1 + nr + \frac{n(n - 1)}{2}r^2$. For $1.04^3$ this gives $1 + 0.12 + 3 \times 0.0016 = 1.1248$; the exact value is 1.124864.
- To estimate how long money takes to double, divide 72 by the rate in percent: at 8% a year, about 9 years.

### Present value: compounding backwards

A euro today is worth more than a euro in a year, because today's euro can be invested. The **present value** of an amount CF due in $n$ years is the sum that, invested now at rate $r$, grows into CF:
$$\text{PV} = \frac{\text{CF}}{(1 + r)^n}.$$
€1,331 due in three years at 10% is worth $\frac{1331}{1.331} = 1\,000$ euros today. Discounting divides by the growth factor, so a higher rate or a longer wait gives a smaller present value. With several payments, discount each one separately and add: €110 in one year and €121 in two years, at 10%, are worth $\frac{110}{1.1} + \frac{121}{1.21} = 100 + 100 = 200$ euros today. The rate may be called a discount rate, a required return or a cost of capital; it plays the same role each time.

### The yield of a zero-coupon bond

A zero-coupon bond pays one amount, its face value, at maturity and nothing before. Bought below face value, it grows into the face value, and the yearly rate that does this is its yield $y$:
$$\text{price} \times (1 + y)^n = \text{face value}, \qquad (1 + y)^n = \frac{\text{face value}}{\text{price}}.$$
So divide face value by price, then take the $n$-th root. By hand, look for a ratio that is a power you know: a ratio of 1.21 over two years means $1 + y = 1.1$, a yield of 10%. A higher price means a lower yield, because less growth is needed to reach the same face value.

### Perpetuities

A perpetuity pays the same amount $C$ every year forever, starting one year from now. Its present value is
$$\text{PV} = \frac{C}{r}.$$
The reason: deposit $\frac{C}{r}$ at rate $r$, and each year's interest is exactly $C$. You can pay out $C$ every year and never touch the deposit. €600 a year forever, at 4%, is worth $\frac{600}{0.04} = 15\,000$ euros.

A **growing perpetuity** pays $D_1$ in one year, and each later payment is larger than the one before by a rate $g$, forever. If $r > g$, its value today is
$$P = \frac{D_1}{r - g}.$$
The same deposit argument works: a deposit $P$ earns $rP$, and paying out $D_1 = (r - g)P$ leaves $gP$, so the deposit, and with it the next payment, grows by $g$ each year. This is the usual way to value a share whose dividends are expected to grow at a steady rate. Two cautions: $D_1$ is **next** year's payment, so a payment just made must first be multiplied by $1 + g$; and the formula means nothing when $g \ge r$.

### Break-even and contribution margin

Each unit sold brings in its price $p$ and costs its variable cost $v$ (materials, delivery, commission). The difference $p - v$ is the **contribution margin**: what each unit contributes towards the fixed costs $F$, such as rent and salaries, which do not change with output. For $Q$ units,
$$\text{profit} = (p - v)Q - F.$$
Profit is zero at the **break-even quantity**
$$Q = \frac{F}{p - v},$$
and a target profit $T$ needs $Q = \frac{F + T}{p - v}$. With fixed costs of €48,000, a price of €25 and a variable cost of €13, each unit contributes €12, so break-even is $\frac{48\,000}{12} = 4\,000$ units. Units come whole, so round a fractional answer **up**: with fixed costs of €50,000 the division gives about 4,166.7, and 4,166 units fall just short.
`,
  examples: [
    {
      id: 'example-simple-or-compound',
      title: 'Simple or compound?',
      problemMd: md`€5,000 is invested for two years at 6% a year. What is it worth at the end (a) with simple interest, (b) with interest compounded yearly?`,
      steps: [
        md`(a) Simple interest adds 6% of the original €5,000, which is €300, each year: $5\,000 + 2 \times 300 = 5\,600$.`,
        md`(b) Compounding multiplies by 1.06 each year: $1.06^2 = 1 + 0.12 + 0.0036 = 1.1236$, and $5\,000 \times 1.1236 = 5\,618$.`,
        md`Check year by year: after one year the balance is €5,300; 6% of 5,300 is 318, so after two years it is $5\,300 + 318 = 5\,618$.`,
        md`The extra €18 is interest on interest: 6% of the first year's €300.`,
      ],
      answerMd: md`(a) €5,600; (b) €5,618. Squaring 1.06 as 1.12 gives €5,600 again, which is the simple-interest answer.`,
    },
    {
      id: 'example-zero-coupon',
      title: 'Yield of a zero-coupon bond',
      problemMd: md`A zero-coupon bond with a face value of €2,704 matures in two years. It trades at €2,500 today. What is its yield per year?`,
      steps: [
        md`Nothing is paid before maturity, so the price grows into the face value at the yield: $2\,500 \times (1 + y)^2 = 2\,704$.`,
        md`Divide: $(1 + y)^2 = \frac{2704}{2500} = 1.0816$.`,
        md`Take the square root. Both numbers are squares, $2\,704 = 52^2$ and $2\,500 = 50^2$, so $1 + y = \frac{52}{50} = 1.04$.`,
        md`Check forwards: $2\,500 \times 1.04 = 2\,600$ and $2\,600 \times 1.04 = 2\,704$.`,
      ],
      answerMd: md`The yield is 4% a year. Halving the two-year return of $\frac{204}{2500} = 8.16\%$ gives 4.08%, slightly too high, because it ignores compounding.`,
    },
    {
      id: 'example-growing-dividend',
      title: 'A share with growing dividends',
      problemMd: md`A share is expected to pay a dividend of €2.40 a year from now. Dividends are expected to grow by 3% a year forever, and investors require a return of 9% a year. What is the share worth today? What would it be worth if the €2.40 had just been paid instead?`,
      steps: [
        md`The €2.40 arrives in one year, so it is $D_1$. With $r = 0.09$ and $g = 0.03$, $r - g = 0.06$.`,
        md`$P = \frac{2.40}{0.06} = 40$ euros.`,
        md`Check with the deposit argument: 9% of €40 is €3.60; paying out €2.40 leaves €1.20, which is 3% of €40, so the deposit and the dividends both grow at 3%.`,
        md`If €2.40 had just been paid, next year's dividend is $2.40 \times 1.03 = 2.472$, and $P = \frac{2.472}{0.06} = 41.20$ euros.`,
      ],
      answerMd: md`€40, or €41.20 if €2.40 is the dividend just paid. Dividing by 9% alone gives about €26.67, which treats the dividend as if it never grew.`,
    },
    {
      id: 'example-break-even',
      title: 'Break-even and a profit target',
      problemMd: md`A workshop sells chairs at €40 each. Materials and labour cost €22 a chair, and fixed costs are €72,000 a year. How many chairs must it sell in a year to break even, and how many to make a profit of €27,000?`,
      steps: [
        md`Contribution margin: $40 - 22 = 18$ euros a chair.`,
        md`Break-even: $\frac{72\,000}{18} = 4\,000$ chairs.`,
        md`Profit target: $\frac{72\,000 + 27\,000}{18} = \frac{99\,000}{18} = 5\,500$ chairs.`,
        md`Check: 5,500 chairs bring revenue of €220,000 and variable costs of €121,000, and $220\,000 - 121\,000 - 72\,000 = 27\,000$.`,
      ],
      answerMd: md`4,000 chairs to break even and 5,500 for a profit of €27,000. Dividing the fixed costs by the price, $\frac{72\,000}{40} = 1\,800$, forgets that each chair must first cover its own €22.`,
    },
  ],
  traps: [
    {
      title: 'Simple interest where interest compounds',
      md: md`5% a year for two years multiplies by $1.05^2 = 1.1025$, not by 1.10. Over two or three years the two results differ only a little, so both can sit among the options; decide which kind of interest the question describes before computing. If a yearly rate is credited every half-year, use half the rate for twice as many periods: 10% a year credited half-yearly turns €1,000 into about €1,215.51 after two years ($1.05^4 \approx 1.2155$), against €1,210 with yearly crediting.`,
    },
    {
      title: 'Averaging a multi-year return',
      md: md`A zero-coupon bond bought at €1,000 that pays €1,440 in two years earns 44% in all, which is 20% a year, since $1.2^2 = 1.44$, not 22%. Yearly rates compound, so take the $n$-th root of face value over price rather than dividing the total return by $n$.`,
    },
    {
      title: 'Using the dividend just paid',
      md: md`$\frac{D_1}{r - g}$ needs next year's payment. If the question gives the payment just made, multiply it by $1 + g$ first. Adding $g$ to $r$ instead of subtracting it is the other common slip: growth makes the share worth more, so the denominator must shrink.`,
    },
    {
      title: 'Dividing fixed costs by the price',
      md: md`Each unit's price first pays for its own variable cost; only the contribution margin $p - v$ goes towards fixed costs. Divide by the margin, add any target profit to the fixed costs before dividing, and round a fractional answer up.`,
    },
    {
      title: 'Discounting by subtracting a percentage',
      md: md`The present value of €1,210 due in two years at 10% is $\frac{1210}{1.21} = 1\,000$ euros, not $1\,210 \times 0.8 = 968$. Discounting divides by the growth factor; taking a percentage off the future amount uses the wrong base.`,
    },
  ],
  check: [
    {
      id: 'check-deposit-today',
      title: 'How much to deposit',
      topic: 'Quantitative reasoning: interest and present value',
      stemMd: md`An investor wants to have €1,323 in two years' time. Her savings account pays 5% a year, compounded yearly. How much must she deposit today?`,
      options: [
        { id: 'A', text: md`€1,200.00`, note: '' },
        { id: 'B', text: md`€1,202.73`, note: md`Divides by 1.10, which is simple interest for two years; with yearly compounding the factor is $1.05^2 = 1.1025$.` },
        { id: 'C', text: md`€1,260.00`, note: md`Discounts for one year only; this is the balance after the first year, which still needs a second year of growth.` },
        { id: 'D', text: md`€1,458.61`, note: md`Multiplies by 1.1025 instead of dividing: that is what €1,323 would grow to in two more years, not what grows into €1,323.` },
      ],
      answer: 'A',
      workingMd: md`Discount two years at 5%: $\frac{1323}{1.05^2} = \frac{1323}{1.1025} = 1\,200$. By hand, divide by 1.05 twice: $\frac{1323}{1.05} = 1\,260$ and $\frac{1260}{1.05} = 1\,200$. Check forwards: $1\,200 \times 1.05 = 1\,260$ and $1\,260 \times 1.05 = 1\,323$.`,
      lesson: 'Present value divides the future amount by the growth factor for the whole period.',
    },
    {
      id: 'check-growing-dividend',
      title: 'Value of a share',
      topic: 'Quantitative reasoning: interest and present value',
      stemMd: md`A company is expected to pay a dividend of €1.80 per share a year from now, and dividends are expected to grow by 4% a year forever. Investors require a return of 10% a year. Using the growing perpetuity formula, what is one share worth today?`,
      options: [
        { id: 'A', text: md`€12.86`, note: md`Adds the growth rate to the required return and divides by 0.14; growth makes the share worth more, so it is subtracted from the required return.` },
        { id: 'B', text: md`€18.00`, note: md`Divides by the required return alone, as for a level perpetuity; it ignores the 4% growth.` },
        { id: 'C', text: md`€30.00`, note: '' },
        { id: 'D', text: md`€31.20`, note: md`Grows the dividend by 4% first, but €1.80 is already next year's dividend; that step is only for a payment just made.` },
      ],
      answer: 'C',
      workingMd: md`Next year's dividend is given, so $D_1 = 1.80$ and $P = \frac{1.80}{0.10 - 0.04} = \frac{1.80}{0.06} = 30$ euros. Check: 10% of €30 is €3; paying out €1.80 leaves €1.20, which is 4% of €30, so the value grows at the same rate as the dividends.`,
      lesson: md`A growing perpetuity is next year's payment divided by the required return minus the growth rate.`,
    },
    {
      id: 'check-zero-coupon-yield',
      title: 'Yield per year',
      topic: 'Quantitative reasoning: interest and present value',
      stemMd: md`A zero-coupon bond pays €1,089 in two years and nothing before then. It costs €900 today. What is its yield, as a rate per year compounded yearly?`,
      options: [
        { id: 'A', text: md`about 9.1%`, note: md`Takes $1 - \frac{30}{33} = \frac{3}{33}$, measuring each year's growth against the later value; growth is measured from the earlier value, $\frac{3}{30}$.` },
        { id: 'B', text: md`10%`, note: '' },
        { id: 'C', text: md`10.5%`, note: md`Halves the two-year return of $\frac{189}{900} = 21\%$; that ignores compounding, and the true yearly rate is a little lower.` },
        { id: 'D', text: md`21%`, note: md`This is the return over the whole two years; the question asks for the rate per year.` },
      ],
      answer: 'B',
      workingMd: md`$(1 + y)^2 = \frac{1089}{900} = 1.21$, and $1.21 = 1.1^2$. Or note that $1\,089 = 33^2$ and $900 = 30^2$, so $1 + y = \frac{33}{30} = 1.1$. The yield is 10% a year. Check: $900 \times 1.1 = 990$ and $990 \times 1.1 = 1\,089$.`,
      lesson: 'A zero-coupon yield is the n-th root of face value over price, minus one.',
    },
    {
      id: 'check-subscription-boxes',
      title: 'Boxes for a profit target',
      topic: 'Quantitative reasoning: break-even',
      stemMd: md`A firm sells a subscription box for €35. Each box costs €21 to make and deliver, and the firm's fixed costs are €84,000 a year. How many boxes must it sell in a year to make a profit of €14,000?`,
      options: [
        { id: 'A', text: md`2,800`, note: md`Divides by the price, €35; each box must also pay its own €21 cost, so only €14 a box is left for fixed costs and profit.` },
        { id: 'B', text: md`5,000`, note: md`Subtracts the target profit from the fixed costs; the profit is earned on top of covering them, so the two add.` },
        { id: 'C', text: md`6,000`, note: md`This is the break-even quantity, where profit is zero; €14,000 of profit needs 1,000 more boxes at €14 each.` },
        { id: 'D', text: md`7,000`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Contribution margin: $35 - 21 = 14$ euros a box. Fixed costs plus target profit: $84\,000 + 14\,000 = 98\,000$. Boxes: $\frac{98\,000}{14} = 7\,000$. Check: 7,000 boxes contribute $7\,000 \times 14 = 98\,000$ euros; after €84,000 of fixed costs, €14,000 is left.`,
      lesson: 'Quantity for a target profit is fixed costs plus the target, divided by the contribution margin.',
    },
  ],
  takeaways: [
    md`Compound interest multiplies by $1 + r$ each year: $\text{FV} = \text{PV} \times (1 + r)^n$.`,
    md`Present value divides by the same factor: $\text{PV} = \frac{\text{CF}}{(1 + r)^n}$.`,
    md`A zero-coupon yield solves $(1 + y)^n = \frac{\text{face value}}{\text{price}}$.`,
    md`Perpetuity: $\frac{C}{r}$; growing perpetuity: $\frac{D_1}{r - g}$, with $D_1$ next year's payment.`,
    md`Break-even quantity is $\frac{F}{p - v}$, fixed costs over the contribution margin, rounded up.`,
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-numbers-percentages' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
