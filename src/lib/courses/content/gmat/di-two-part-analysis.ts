import { md, type Lesson } from '../../types';

/** GMAT Data Insights: Two-Part Analysis (docs/COURSE-AUTHORING.md, the plan). */

export const twoPartAnalysisLesson: Lesson = {
  slug: 'two-part-analysis',
  title: 'Two-Part Analysis: two linked answers from one problem',
  summary: 'Spot whether the two parts are linked, solve the tighter part first, and check every selection against both conditions before you commit.',
  minutes: 20,
  objectives: [
    'Tell a dependent two-part problem (one answer constrains the other) from an independent one.',
    'Set up and solve a pair of equations or constraints, and check the pair against every condition.',
    'Handle verbal two-part problems by giving each part its own test.',
  ],
  teachMd: md`
### What the question type asks

Two-Part Analysis is one of the five question types GMAC lists for Data Insights. As the name says, one problem has two parts to answer, and this lesson practises both numerical and verbal problems of that shape. GMAC states that all parts must be correct to score on Data Insights questions with several parts, so getting one part right earns nothing on its own.

The checks on this page are single-answer multiple choice: each option is a **pair**, written as (first part, second part), and you pick the pair that is right in both places. That keeps the core skill: a pair that satisfies one condition but not the other is wrong.

### First question: are the parts linked?

Every two-part problem is one of two kinds.

- **Dependent parts.** The two answers are tied together: two unknowns in one situation (how many of each ticket), or a choice in one part that limits the other (workers and days for a fixed job). You usually need both conditions to find either answer.
- **Independent parts.** Two separate questions share a setting: which finding strengthens a claim and which weakens it, or the maximum and the minimum of a quantity. Each part has its own test.

Decide which kind you face before you start; it tells you whether to solve together or one at a time.

### Dependent parts: set up, solve, check

For two unknowns, write one equation per fact.

$$\text{count: } a + c = N \qquad \text{value: } p_a a + p_c c = V$$

A fast way to solve the pair is to imagine every item at the cheaper price: $p_c N$. The shortfall $V - p_c N$ is made up by the items at the dearer price, each adding $p_a - p_c$. So

$$a = \frac{V - p_c N}{p_a - p_c}$$

and $c = N - a$. Then **check both equations** with the numbers. The check takes ten seconds and catches the commonest slip in this question type: swapping which number belongs to which part.

### Constraints and trade-offs

Some dependent problems are about trade-offs: more workers means fewer days, a higher price means fewer buyers. The parts are linked by a fixed product or sum, and extra limits (no more than so many, whole numbers only) cut down the choices. Work from the **tightest** constraint: it often leaves only one or two candidates, and the other condition then settles the pair.

### Independent parts: one test per part

When the parts are separate questions, treat them as two small questions. For a verbal problem such as "which finding would most strengthen the claim, and which would most weaken it", state the claim exactly first, including what causes what. Then run each finding through the strengthen test and the weaken test separately. A finding can be irrelevant to both; do not force every choice into one of the two roles.

Things to watch in verbal two-part problems:

- **Causal claims** ("X explains Y") are weakened by evidence that Y happened without X, or by another cause that fits better. They are strengthened by evidence that Y changed only where or when X did.
- **Swapped pairs.** The same two findings may appear in both orders. Decide the role of each finding before you read the pairs.

### Test the pair, not the halves

Wrong pairs can be built from plausible halves. A pair that gets the first part right and the second part wrong looks right if you check only the first part. Before you commit, substitute the whole pair into every condition of the problem.

### Time

A two-part problem has more to read than a single question, but often less to compute once it is set up. Spend the first moments on the setup: what are the two parts, how are they linked, and what condition must each satisfy. If you can write the two equations or the two tests in a line each, the rest is quick.
`,
  examples: [
    {
      id: 'example-coffee-sales',
      title: 'Two unknowns, two facts',
      problemMd: md`A café sells small coffees at \$3.00 and large coffees at \$4.50. One morning it sold 120 coffees for \$441 in total. Select the number of small coffees and the number of large coffees sold.`,
      steps: [
        md`The parts are dependent: one count and one value equation link them. $s + l = 120$ and $3s + 4.5l = 441$.`,
        md`Price every coffee as small: $3 \times 120 = \$360$. The shortfall, $441 - 360 = \$81$, comes from large coffees, each adding $\$1.50$.`,
        md`So $l = \frac{81}{1.5} = 54$ and $s = 120 - 54 = 66$.`,
        md`Check both facts: $66 + 54 = 120$, and $66 \times 3 + 54 \times 4.5 = 198 + 243 = 441$.`,
      ],
      answerMd: md`66 small and 54 large. The pair (54 small, 66 large) is the tempting swap: it also sums to 120, but its value is $162 + 297 = \$459$.`,
    },
    {
      id: 'example-workers-and-days',
      title: 'A trade-off with limits',
      problemMd: md`A job needs exactly 96 worker-days. The site holds at most 10 workers, the job must finish within 14 days, and both the number of workers and the number of days must be whole numbers, with every worker working a full day on every day of the job, so that workers times days is exactly 96. Select the smallest number of workers that can do the job and the number of days it then takes.`,
      steps: [
        md`The parts are linked by the trade-off $\text{workers} \times \text{days} = 96$.`,
        md`The deadline is the tightest condition: $\text{days} \le 14$ means $\text{workers} \ge \frac{96}{14} \approx 6.9$, so at least 7 workers.`,
        md`Whole numbers: the number of workers must divide 96 exactly. 7 does not ($96 = 7 \times 13 + 5$); 8 does, giving $\frac{96}{8} = 12$ days.`,
        md`Check every condition: 8 workers is within the limit of 10, 12 days is within 14, and $8 \times 12 = 96$.`,
      ],
      answerMd: md`8 workers and 12 days. Choosing 7 workers, from rounding $\frac{96}{14}$ up, fails the whole-number condition: 7 workers would need about 13.7 days.`,
    },
    {
      id: 'example-strengthen-and-weaken',
      title: 'A verbal problem with independent parts',
      problemMd: md`Claim: "Closing the car park at the riverside shops on weekday evenings explains why the shops' weekday-evening sales fell this autumn." Findings: (1) Weekday-morning sales, when the car park stayed open, did not fall. (2) Sales also fell this autumn at shops across town whose car parks stayed open. (3) The car park had about 40 spaces. (4) The riverside shops sell mainly groceries. (5) The car park was resurfaced two years ago. Select the finding that would most strengthen the claim and the finding that would most weaken it.`,
      steps: [
        md`State the claim as cause and effect: the closure caused the fall in weekday-evening sales.`,
        md`Strengthen test: does the finding make the closure a better explanation? Finding (1) shows sales fell only at the times the car park was closed, which fits the claim and rules out a general fall.`,
        md`Weaken test: does the finding suggest the fall would have happened anyway? Finding (2) shows a similar fall where nothing closed, pointing to a wider cause.`,
        md`Findings (3), (4) and (5) say nothing about whether the closure caused the fall; they fit neither role.`,
      ],
      answerMd: md`Strengthen: finding (1). Weaken: finding (2). The pair in the other order is the tempting swap; decide each finding's role before looking at the pairs.`,
    },
  ],
  traps: [
    {
      title: 'Swapping the two parts',
      md: md`The pair (54, 66) and the pair (66, 54) both satisfy a sum of 120. Only one satisfies the value equation. Always substitute the pair, in its order, into every condition.`,
    },
    {
      title: 'Checking only one condition',
      md: md`A wrong pair can satisfy one condition exactly. A blend that makes the right total weight at the wrong cost, or a schedule that meets the deadline with a non-whole number of workers, looks right if you stop after the first check.`,
    },
    {
      title: 'Forcing every finding into a role',
      md: md`In a verbal two-part problem some choices can be irrelevant to both parts. A finding that merely sounds related, such as the size of the car park, neither strengthens nor weakens a causal claim. Test each choice; do not assume it must belong somewhere.`,
    },
    {
      title: 'Rounding where whole numbers are required',
      md: md`When people, items or days must be whole, the answer must divide or fit exactly. Rounding a division can give a number that breaks another condition.`,
    },
  ],
  check: [
    {
      id: 'check-theatre-tickets',
      title: 'Adult and child tickets',
      topic: 'Two-Part Analysis',
      stemMd: md`A theatre sells adult tickets at \$18 and child tickets at \$11. For one performance it sold 250 tickets for \$3,870 in total. Which pair gives the number of adult tickets and the number of child tickets sold, in that order?`,
      options: [
        { id: 'A', text: md`(90, 160)`, note: md`This swaps the two parts: 90 adult and 160 child tickets bring in $1620 + 1760 = \$3{,}380$.` },
        { id: 'B', text: md`(150, 100)`, note: md`The count is right, but the value is $2700 + 1100 = \$3{,}800$, \$70 short; it satisfies only one condition.` },
        { id: 'C', text: md`(160, 90)`, note: '' },
        { id: 'D', text: md`(170, 80)`, note: md`The count is right, but the value is $3060 + 880 = \$3{,}940$, \$70 too much.` },
        { id: 'E', text: md`(215, 35)`, note: md`215 is \$3,870 divided by the adult price, as if every ticket were an adult ticket; 35 then fills the count, but the value is far too high.` },
      ],
      answer: 'C',
      workingMd: md`Price all 250 tickets as child tickets: $11 \times 250 = \$2{,}750$. The extra $3870 - 2750 = \$1{,}120$ comes from adult tickets, each \$7 dearer, so there are $\frac{1120}{7} = 160$ adult tickets and $250 - 160 = 90$ child tickets. Check: $160 \times 18 + 90 \times 11 = 2880 + 990 = 3870$.`,
      lesson: 'Solve from the cheaper price up, then substitute the pair, in order, into both conditions.',
    },
    {
      id: 'check-tea-blend',
      title: 'A blend at a target price',
      topic: 'Two-Part Analysis',
      stemMd: md`A shop blends tea X, which costs \$12 per kilogram, with tea Y, which costs \$20 per kilogram, to make 40 kilograms of a blend that costs \$15 per kilogram. Which pair gives the kilograms of X and of Y, in that order?`,
      options: [
        { id: 'A', text: md`(15, 25)`, note: md`This swaps the two parts. With 25 kg of the dearer tea the blend costs \$17 per kilogram.` },
        { id: 'B', text: md`(20, 20)`, note: md`Equal amounts give the average price, \$16 per kilogram, not \$15; the target is nearer X's price, so the blend needs more X.` },
        { id: 'C', text: md`(25, 15)`, note: '' },
        { id: 'D', text: md`(28, 12)`, note: md`The weight is right, but the cost is $336 + 240 = \$576$, \$14.40 per kilogram; only one condition is checked.` },
        { id: 'E', text: md`(30, 10)`, note: md`The weight is right, but the cost is $360 + 200 = \$560$, \$14 per kilogram: too much of the cheaper tea.` },
      ],
      answer: 'C',
      workingMd: md`The blend must cost $40 \times 15 = \$600$. All X would cost $40 \times 12 = \$480$; the extra \$120 comes from Y, each kilogram \$8 dearer, so Y is $\frac{120}{8} = 15$ kg and X is $25$ kg. Check: $25 \times 12 + 15 \times 20 = 300 + 300 = 600$.`,
      lesson: 'A pair that meets the total but not the value, or the other way round, is the commonest wrong selection.',
    },
    {
      id: 'check-library-claim',
      title: 'Strengthen and weaken',
      topic: 'Two-Part Analysis',
      stemMd: md`Claim: "The library's new Sunday opening is the reason its loans rose by 12% this year." Findings: (1) Loans made from Monday to Saturday stayed about the same as last year. (2) Two other libraries in the region, neither open on Sundays, also saw loans rise by about 12% this year. (3) The library's Sunday staff are mostly volunteers. (4) The library has opened on Saturdays for many years. (5) Most Sunday visitors live within two kilometres of the library. Which pair gives the finding that would most strengthen the claim and the finding that would most weaken it, in that order?`,
      options: [
        { id: 'A', text: md`(1, 2)`, note: '' },
        { id: 'B', text: md`(2, 1)`, note: md`This swaps the roles. A similar rise at libraries without Sunday opening points to a wider cause, which weakens the claim.` },
        { id: 'C', text: md`(1, 5)`, note: md`Where Sunday visitors live says nothing about whether Sunday opening caused the rise; it does not weaken the claim.` },
        { id: 'D', text: md`(5, 2)`, note: md`Visitors' home addresses do not show that the rise came from Sunday opening; the finding that the other six days stayed flat does.` },
        { id: 'E', text: md`(3, 2)`, note: md`Who staffs Sundays is irrelevant to what caused the rise in loans; it does not strengthen the claim.` },
      ],
      answer: 'A',
      workingMd: md`The claim is causal: Sunday opening caused the 12% rise. If loans on the other six days stayed flat, the whole rise must have come on Sundays, which fits the claim: that strengthens it. If libraries without Sunday opening rose by the same 12%, the rise is better explained by something they share: that weakens it. The findings about staff, Saturday opening and where visitors live bear on neither.`,
      lesson: 'Decide each finding\'s role on its own before reading the pairs; swapped pairs are built to catch a hurried match.',
    },
  ],
  takeaways: [
    'First decide whether the two parts are linked or separate.',
    'For two unknowns, price everything at the cheaper rate and let the shortfall find the dearer count.',
    'Start a trade-off from the tightest constraint; whole-number conditions rule out rounding.',
    'Substitute the whole pair, in order, into every condition before you commit.',
  ],
  practice: { examKey: 'gmat', domain: 'di-two-part-analysis' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
