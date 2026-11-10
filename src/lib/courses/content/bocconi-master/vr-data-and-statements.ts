import { md, type Lesson } from '../../types';

export const dataAndStatementsLesson: Lesson = {
  slug: 'data-and-statements',
  title: 'Data and statements: what must be true',
  summary: 'Sort statements about a set of data into necessarily true, necessarily false and undetermined, using counterexamples, overlaps and orderings.',
  minutes: 20,
  objectives: [
    'Classify a statement as necessarily true, necessarily false or not determined by the data.',
    'Find the minimum and maximum overlap of two groups, and enumerate the arrangements an ordering allows.',
    'Test statements about shares and amounts by computing both on the same base.',
  ],
  teachMd: md`
### What the item type asks

Bocconi describes its Data/Statements items as giving some data and some statements, and asking you to decide whether each statement is true or false. In this course's checks the same skill appears in a single-answer form: "Which statement is necessarily true?" or "Which statement must be false?", with four options. Either way, the job is the same: judge each statement **only against the data given**.

### Three verdicts, not two

Given a set of data, a statement can be:

| Verdict | Meaning | How you show it |
| --- | --- | --- |
| Necessarily true | It holds in every situation consistent with the data | A short proof from the data |
| Necessarily false | It fails in every situation consistent with the data | A contradiction with the data |
| Not determined | It holds in some consistent situations and fails in others | Two examples, one each way |

The middle ground is where most marks are lost. A statement that *could* be true is not "true"; a statement that is not necessarily true is not "false". When a question asks which statement must be true, every "not determined" statement is a wrong option, however likely it seems.

### The counterexample habit

For each statement, try to build a situation that fits all the data but breaks the statement. If you succeed, the statement is not necessarily true. If you try to break it and the data stop you, find the reason, and you have your proof. The same habit run the other way finds necessarily false statements: try to build a situation where the statement holds; if the data always forbid it, it must be false.

### Tool 1: overlapping groups

When the data give the sizes of two groups inside a population of $N$, the overlap is pinned between two limits:

$$\max(0,\ |A| + |B| - N) \le |A \cap B| \le \min(|A|, |B|).$$

The lower limit comes from the fact that the two groups cannot fit into $N$ people without sharing at least the excess. If the data also say how many are in neither group, the overlap is fixed exactly:

$$|A \cap B| = |A| + |B| - (N - \text{neither}).$$

Without the "neither" number, any statement that needs an exact overlap is not determined.

### Tool 2: orderings

For rankings, schedules and seating, list the fixed facts first, then enumerate. With four or five items there are rarely more than a handful of arrangements that satisfy the data, and writing them out takes less time than reasoning in your head. A statement true in every arrangement is necessarily true; one true in none is necessarily false; anything else is not determined.

### Tool 3: shares and amounts

A share is a percentage of a total, and totals change. "The export share fell" does not mean exports fell; it depends on what happened to the total. Convert every share into an amount on one base (call last year's total 100 or $R$) and compare amounts. This is the same habit that data insight questions reward.

### Reading quantifiers exactly

- "Some" means at least one; it does not mean "not all".
- "Most" means more than half.
- "At least 15" allows 15 and any larger number; "exactly 15" allows only 15.
- "No more than" and "at most" are the same limit.

Statements are often wrong only because of their quantifier: the data force "at least 15", the statement says "exactly 15".

### A routine (ours)

1. Rewrite the data in compact form on your scratch sheet: a Venn diagram, a line of positions, or a small table of amounts.
2. Work out what the data **force** (fixed values, limits, arrangements) before reading the statements.
3. For each statement, ask "necessarily?" and look for a counterexample.
4. Use only the data. Real-world likelihood is irrelevant.
`,
  examples: [
    {
      id: 'example-two-courses',
      title: 'Overlap fixed by the "neither" figure',
      problemMd: md`Data: of 200 students, 130 take economics, 110 take statistics and 15 take neither.

Statements: (i) exactly 55 students take both; (ii) 75 students take economics but not statistics; (iii) more students take only statistics than only economics; (iv) some students who take statistics also take economics.`,
      steps: [
        md`Students taking at least one course: $200 - 15 = 185$.`,
        md`Overlap: $130 + 110 - 185 = 55$, so (i) is necessarily true.`,
        md`Only economics: $130 - 55 = 75$, so (ii) is necessarily true. Only statistics: $110 - 55 = 55$. Check: $75 + 55 + 55 + 15 = 200$.`,
        md`(iii) says $55 > 75$, which contradicts the data: necessarily false. (iv) follows from an overlap of 55, which is at least one: necessarily true.`,
        md`Without the "neither" figure, the overlap would only be known to lie between $130 + 110 - 200 = 40$ and $110$, and (i) and (ii) would not be determined.`,
      ],
      answerMd: md`(i), (ii) and (iv) are necessarily true; (iii) is necessarily false. Drop one number from the data and two verdicts change to "not determined", which is why you work out what the data force before judging statements.`,
    },
    {
      id: 'example-branch-ranking',
      title: 'Enumerating an ordering',
      problemMd: md`Data: five branches, P, Q, R, S and T, are ranked 1 to 5 by revenue, with no ties. T is first. P ranks above Q. R ranks immediately below P. S is not last.

Which statements are necessarily true: (i) Q is last; (ii) P is second; (iii) S ranks above R; (iv) R ranks above Q?`,
      steps: [
        md`T takes position 1, so P, Q, R and S fill positions 2 to 5, with R directly after P and Q somewhere after P.`,
        md`P in 2, R in 3: Q and S fill 4 and 5, and S is not last, so S is 4 and Q is 5. Order: T, P, R, S, Q.`,
        md`P in 3, R in 4: Q must come after P, so Q is 5 and S is 2. Order: T, S, P, R, Q.`,
        md`P in 4, R in 5: Q would have to come after P, but no place is left. Impossible.`,
        md`Test the statements on both orders: Q is last in both; R is above Q in both; P is second in only the first; S is above R in only the second.`,
      ],
      answerMd: md`(i) and (iv) are necessarily true; (ii) and (iii) are not determined. Tempting error: finding the first valid order and treating it as the only one, which would make (ii) look true.`,
    },
    {
      id: 'example-share-and-amount',
      title: 'A falling share, a rising amount',
      problemMd: md`Data: in 2023, 40% of a firm's revenue came from exports. In 2024 total revenue was 25% higher, and exports made up 36% of it.

Statement (i): export revenue fell in 2024. Statement (ii): domestic revenue rose in 2024.`,
      steps: [
        md`Put 2023 revenue at $R$. Exports: $0.4R$. Domestic: $0.6R$.`,
        md`2024 revenue is $1.25R$. Exports: $0.36 \times 1.25R = 0.45R$. Domestic: $0.64 \times 1.25R = 0.8R$.`,
        md`Exports went from $0.4R$ to $0.45R$, a rise of $\frac{0.05}{0.4} = 12.5\%$, so (i) is necessarily false.`,
        md`Domestic revenue went from $0.6R$ to $0.8R$, a rise of a third, so (ii) is necessarily true. Check: $0.45R + 0.8R = 1.25R$.`,
      ],
      answerMd: md`(i) is necessarily false and (ii) necessarily true. The falling export share tempts you to say exports fell; the total grew enough to outweigh it.`,
    },
  ],
  traps: [
    {
      title: '"Could be true" taken as "true"',
      md: md`A statement consistent with the data is not necessarily true. If you can build one situation that fits the data and breaks the statement, it is not determined, and it is wrong whenever the question asks what must be true.`,
    },
    {
      title: 'The minimum overlap read as the exact overlap',
      md: md`From group sizes alone, $|A| + |B| - N$ is only the smallest possible overlap. The exact overlap needs the number in neither group. Watch for statements that say "exactly" when the data give only "at least".`,
    },
    {
      title: 'Stopping at the first arrangement',
      md: md`In ordering data, the first arrangement you find is rarely the only one. Enumerate every case before you call a statement necessarily true.`,
    },
    {
      title: 'Shares compared across different totals',
      md: md`A share that falls while its total rises can still be a larger amount. Convert shares to amounts on one base before judging any statement about "more" or "less".`,
    },
  ],
  check: [
    {
      id: 'check-club-overlap',
      title: 'Tennis and padel',
      topic: 'Data/Statements',
      stimulusMd: md`A sports club has 80 members. 50 members play tennis and 45 members play padel.`,
      stemMd: md`Which of the following statements is necessarily true?`,
      options: [
        { id: 'A', text: md`Exactly 15 members play both sports.`, note: md`15 is only the smallest possible overlap; without the number who play neither, the overlap could be anything from 15 to 45.` },
        { id: 'B', text: md`At least 15 members play both sports.`, note: '' },
        { id: 'C', text: md`At most 30 members play tennis but not padel.`, note: md`If only 15 play both, then 35 play tennis but not padel, which breaks the statement.` },
        { id: 'D', text: md`Some members play neither sport.`, note: md`With an overlap of exactly 15, the members playing at least one sport number $50 + 45 - 15 = 80$, so nobody need play neither.` },
      ],
      answer: 'B',
      workingMd: md`Fitting 50 tennis players and 45 padel players into 80 members forces an overlap of at least $50 + 45 - 80 = 15$. The overlap can be any whole number from 15 up to 45, so only the "at least" statement holds in every case. Tennis-only members range from $50 - 45 = 5$ to $50 - 15 = 35$, and members playing neither range from 0 to 30.`,
      lesson: 'Group sizes alone give a range for the overlap; only the lower limit is forced.',
    },
    {
      id: 'check-interview-order',
      title: 'Four interviews',
      topic: 'Data/Statements',
      stimulusMd: md`Four candidates, F, G, H and J, are interviewed on Monday, Tuesday, Wednesday and Thursday of the same week, one per day. G is interviewed before H. J is interviewed on Tuesday or Wednesday. F is not interviewed on Monday.`,
      stemMd: md`Which of the following statements must be false?`,
      options: [
        { id: 'A', text: md`F is interviewed on Tuesday.`, note: md`The order G, F, J, H satisfies every condition with F on Tuesday.` },
        { id: 'B', text: md`H is interviewed on Wednesday.`, note: md`The order G, J, H, F satisfies every condition with H on Wednesday.` },
        { id: 'C', text: md`J is interviewed the day after F.`, note: md`In the order G, F, J, H, F is on Tuesday and J on Wednesday, so this can happen.` },
        { id: 'D', text: md`Someone is interviewed before G.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Enumerate. With J on Tuesday, F is on Wednesday or Thursday, and G must take Monday because it comes before H: G, J, F, H or G, J, H, F. With J on Wednesday, F is on Tuesday or Thursday, and again G takes Monday: G, F, J, H or G, H, J, F. In all four valid orders G is on Monday, so nobody is interviewed before G.`,
      lesson: 'List every arrangement; a statement that fails in all of them is necessarily false.',
    },
    {
      id: 'check-online-share',
      title: 'Online and in-store sales',
      topic: 'Data/Statements',
      stimulusMd: md`In 2023, online sales made up 30% of a retailer's total sales. In 2024 the retailer's total sales were 10% lower than in 2023, and online sales made up 40% of the total.`,
      stemMd: md`Which of the following statements is necessarily true?`,
      options: [
        { id: 'A', text: md`Online sales fell, because total sales fell.`, note: md`The online share rose from 30% to 40%, enough to outweigh the 10% fall in the total: online sales went from $0.3T$ to $0.36T$.` },
        { id: 'B', text: md`In-store sales fell by 10%.`, note: md`10% is the fall in total sales; in-store sales fell from $0.7T$ to $0.54T$, about 22.9%.` },
        { id: 'C', text: md`Online sales rose by 20%.`, note: '' },
        { id: 'D', text: md`Online sales rose by about 33%.`, note: md`This is the change in the online share, $\frac{40 - 30}{30}$, which ignores that the total fell by 10%.` },
      ],
      answer: 'C',
      workingMd: md`Let 2023 total sales be $T$. Online: $0.3T$. In 2024 the total is $0.9T$ and online is $0.4 \times 0.9T = 0.36T$. The change is $\frac{0.36T - 0.3T}{0.3T} = 0.2$, a 20% rise. In-store went from $0.7T$ to $0.6 \times 0.9T = 0.54T$.`,
      lesson: 'Turn every share into an amount on one base before comparing years.',
    },
  ],
  takeaways: [
    'Every statement is necessarily true, necessarily false or not determined; "could be true" is not "true".',
    'Look for a counterexample that fits all the data; if none exists, prove the statement.',
    md`Two groups in $N$ overlap by at least $|A| + |B| - N$; the exact overlap needs the "neither" count.`,
    'Enumerate orderings fully, and compare shares only after turning them into amounts.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-verbal-reasoning', skill: 'grad-verbal-passage-reasoning' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
