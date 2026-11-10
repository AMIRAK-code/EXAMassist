import { md, type Lesson } from '../../types';

export const setsAndOverlapsLesson: Lesson = {
  slug: 'sets-and-overlaps',
  title: 'Sets, overlaps and worst cases',
  summary: 'Count overlapping groups with inclusion–exclusion and the exactly-two formula, fill Venn diagrams from the centre out, and find worst-case guarantees.',
  minutes: 22,
  objectives: [
    'Count a union, a "neither" group or an overlap of two or three sets with inclusion–exclusion.',
    'Use the exactly-two formula, and fill a three-set Venn diagram from the centre out.',
    'Find the smallest number of draws that guarantees an outcome, and the smallest and largest possible overlap of two groups.',
  ],
  teachMd: md`
### Two sets: add, then remove the double count

When two groups overlap, adding their sizes counts everyone in the overlap twice, so take the overlap off once:
$$|A \cup B| = |A| + |B| - |A \cap B|.$$
Here $|A \cup B|$ is the number in at least one group and $|A \cap B|$ the number in both. Many questions also mention people in neither group, so write the whole population as
$$\text{Total} = |A| + |B| - \text{Both} + \text{Neither}.$$
Any one of the five numbers follows from the other four. Of 40 students, if 25 take finance, 18 take marketing and 7 take both, then $25 + 18 - 7 = 36$ take at least one and $40 - 36 = 4$ take neither. The same rule for probabilities is in [counting and probability](/courses/bocconi-master/counting-and-probability).

A two-way table does the same job and makes the "only" groups visible. Every row and column must add up, so a missing cell can be filled from the others:

| | Marketing | No marketing | Total |
| --- | --- | --- | --- |
| Finance | 7 | 18 | 25 |
| No finance | 11 | 4 | 15 |
| Total | 18 | 22 | 40 |

### Three sets: inclusion–exclusion

$$|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|$$

Follow one person who belongs to all three groups. The first three terms count them three times. They also sit in all three pairwise overlaps, so the subtractions remove them three times, leaving zero; adding $|A \cap B \cap C|$ brings the count back to one. A person in exactly two groups is counted twice and subtracted once, which is right.

In this formula $|A \cap B|$ means everyone in both A and B, **including** those also in C. A question that says "15 firms export to France and Germany" normally means this whole overlap; "only to France and Germany" or "to exactly these two" means the part outside the centre.

### Exactly one, exactly two, all three

Split everyone in at least one group into layers: $E_1$ people in exactly one group, $E_2$ in exactly two and $E_3$ in all three. Then:

- counting people, $E_1 + E_2 + E_3 = \text{Total} - \text{None}$;
- counting memberships, $|A| + |B| + |C| = E_1 + 2E_2 + 3E_3$, because each person is counted once for every group they are in.

Subtracting the first line from the second gives $|A| + |B| + |C| - (\text{Total} - \text{None}) = E_2 + 2E_3$, which rearranges to
$$\text{Total} - \text{None} = |A| + |B| + |C| - (\text{exactly two}) - 2 \times (\text{all three}).$$
The sum of the three groups holds one extra copy of each exactly-two person and two extra copies of each all-three person; the formula removes exactly those copies. Use it when a question gives or asks for "exactly two"; use inclusion–exclusion when it gives pairwise "both" counts. The two connect because the three pairwise counts add up to $E_2 + 3E_3$: an all-three person sits in all three pairs.

### Filling a Venn diagram from the centre out

Three circles make seven regions, plus the outside for "none". When the pairwise counts are given, fill the regions in this order:

1. The centre: all three.
2. Each pair-only region: the pairwise count minus the centre.
3. Each single-only region: the group's total minus its two pair-only regions and the centre.
4. None: the total minus all seven regions.

Each step uses only numbers already found, so nothing is taken off twice. Starting from a group's total instead forces a guess about how much of it lies in the overlaps. Before answering, check that every region is zero or more and that the seven regions add up to the union given by the formula.

### How small or large can an overlap be?

Sometimes only the group sizes are known. If 70 of 100 people like A and 60 like B, at least $70 + 60 - 100 = 30$ like both, because 130 memberships cannot fit into 100 people otherwise; and at most 60 do, when the smaller group lies entirely inside the larger. In general
$$\max(0,\ |A| + |B| - \text{Total}) \le \text{Both} \le \min(|A|, |B|).$$

### Worst cases and guarantees

"How many must be drawn to be sure of…" asks about the worst possible luck, not the average. Build the largest selection that still fails, then add one: the next item cannot avoid success. This is the pigeonhole principle: put more items than boxes into boxes, and some box holds at least two.

- **To be sure of $k$ of the same kind** among $m$ kinds, the worst case holds $k - 1$ of each, so $(k - 1)m + 1$ draws are needed. With 4 kinds, 3 of one kind needs $2 \times 4 + 1 = 9$ draws.
- **A scarce kind caps the worst case.** A kind with fewer than $k - 1$ items can contribute only what it has. Add up what each kind can give without reaching $k$, then add one.
- **To be sure of a particular kind**, the worst case takes every item of the other kinds first.

Test the answer by trying to build a failing selection of that size. If none exists, and one item fewer can fail, the answer is right.
`,
  examples: [
    {
      id: 'example-exactly-two',
      title: 'Exactly two electives',
      problemMd: md`In a cohort of 120 students, 64 take a finance elective, 52 a marketing elective and 40 a data elective; a student may take several. 12 take all three and 8 take none. How many take exactly two of the electives?`,
      steps: [
        md`Those in at least one elective: $120 - 8 = 112$.`,
        md`Sum of the three groups: $64 + 52 + 40 = 156$. This counts each student once for every elective they take.`,
        md`Apply $\text{Total} - \text{None} = |A| + |B| + |C| - (\text{exactly two}) - 2 \times (\text{all three})$: $112 = 156 - E_2 - 2 \times 12$, so $E_2 = 156 - 24 - 112 = 20$.`,
        md`Check by counting memberships: exactly one is $112 - 20 - 12 = 80$, and $80 + 2 \times 20 + 3 \times 12 = 80 + 40 + 36 = 156$, the sum of the groups.`,
      ],
      answerMd: md`20 students take exactly two electives. Subtracting the 12 only once gives 32, and ignoring them gives 44; each all-three student is counted three times in 156 and must lose two copies.`,
    },
    {
      id: 'example-centre-out',
      title: 'Filling the diagram from the centre',
      problemMd: md`Of 100 firms surveyed, 45 export to France, 38 to Germany and 30 to Spain. 15 export to both France and Germany, 12 to both France and Spain, 10 to both Germany and Spain, and 5 to all three. How many export to none of the three countries, and how many to France only?`,
      steps: [
        md`Centre: 5 firms export to all three.`,
        md`Pair-only regions: France and Germany only $15 - 5 = 10$; France and Spain only $12 - 5 = 7$; Germany and Spain only $10 - 5 = 5$.`,
        md`Single-only regions: France only $45 - 10 - 7 - 5 = 23$; Germany only $38 - 10 - 5 - 5 = 18$; Spain only $30 - 7 - 5 - 5 = 13$.`,
        md`In at least one country: $5 + 10 + 7 + 5 + 23 + 18 + 13 = 81$, so none is $100 - 81 = 19$.`,
        md`Check with inclusion–exclusion: $45 + 38 + 30 - 15 - 12 - 10 + 5 = 113 - 37 + 5 = 81$.`,
      ],
      answerMd: md`19 firms export to none of the three and 23 to France only. Taking France only as $45 - 15 - 12 = 18$ removes the 5 all-three firms twice, since both pairwise counts include them.`,
    },
    {
      id: 'example-worst-case',
      title: 'Same colour, guaranteed',
      problemMd: md`A bag holds 9 red, 7 green and 4 yellow counters. Counters are taken out without looking. How many must be taken to be sure of (a) 3 of the same colour, (b) 6 of the same colour?`,
      steps: [
        md`(a) The largest selection without 3 of one colour has 2 of each: $2 + 2 + 2 = 6$ counters. The 7th must make a third of some colour.`,
        md`(b) Without 6 of one colour you can hold at most 5 red and 5 green, but only the 4 yellow that exist: $5 + 5 + 4 = 14$ counters.`,
        md`So 15 counters guarantee 6 of one colour: any 15 with at most 5 red, 5 green and 4 yellow would number at most 14, which is impossible.`,
        md`Check that one fewer can fail: 14 counters can be 5 red, 5 green and 4 yellow, with no colour reaching 6.`,
      ],
      answerMd: md`(a) 7; (b) 15. The formula $(k - 1)m + 1 = 5 \times 3 + 1 = 16$ overshoots in (b), because the bag has only 4 yellow counters, not 5.`,
    },
  ],
  traps: [
    {
      title: 'Reading "both" as "only those two"',
      md: md`Unless the question says "only" or "exactly", a pairwise count such as "15 export to France and Germany" includes those that also export to Spain. Subtract the centre to get the pair-only region; using the pairwise count as the region counts the centre again.`,
    },
    {
      title: 'Subtracting the all-three group only once',
      md: md`In the exactly-two formula each all-three member is counted three times in $|A| + |B| + |C|$ but should count once, so $2 \times$ (all three) comes off. In inclusion–exclusion the centre is instead added back once. Keep the formulas apart: pairwise counts go with plus the centre; exactly-two counts go with minus twice the centre.`,
    },
    {
      title: 'Forgetting the people in no group',
      md: md`The formulas count people in at least one group. If the total includes people in none, take them off first ($\text{Total} - \text{None}$) or add them back at the end. A region that comes out negative means a count was used twice.`,
    },
    {
      title: 'Guaranteeing with luck, or with items that do not exist',
      md: md`A guarantee must survive the worst order, so the best case, just $k$ draws, is never the answer when there are several kinds. And the worst case can only use items that are there: if a kind has fewer than $k - 1$ items, count all of them, not $k - 1$.`,
    },
  ],
  check: [
    {
      id: 'check-shares-or-bonds',
      title: 'Exactly one kind',
      topic: 'Quantitative reasoning: sets and overlaps',
      stemMd: md`In a survey of 160 investors, 95 hold shares, 70 hold bonds and 25 hold neither. How many hold exactly one of the two?`,
      options: [
        { id: 'A', text: md`30`, note: md`This is the number who hold both; they hold two kinds, not one.` },
        { id: 'B', text: md`65`, note: md`Counts only those with shares and no bonds; the 40 with bonds and no shares also hold exactly one kind.` },
        { id: 'C', text: md`105`, note: '' },
        { id: 'D', text: md`135`, note: md`This is the number who hold at least one kind; it still includes the 30 who hold both.` },
      ],
      answer: 'C',
      workingMd: md`At least one kind: $160 - 25 = 135$. Both: $95 + 70 - 135 = 30$. Shares only: $95 - 30 = 65$; bonds only: $70 - 30 = 40$; exactly one: $65 + 40 = 105$. Check: $65 + 40 + 30 + 25 = 160$.`,
      lesson: 'Find the overlap from Total = A + B − Both + Neither first, then read off the region the question asks for.',
    },
    {
      id: 'check-three-activities',
      title: 'Exactly two activities',
      topic: 'Quantitative reasoning: sets and overlaps',
      stemMd: md`A club has 200 members. 110 play tennis, 90 swim and 70 run. 20 members do all three activities and 15 do none. How many members do exactly two of the activities?`,
      options: [
        { id: 'A', text: md`30`, note: md`Treats all 200 members as doing at least one activity; the 15 who do none must be taken off first.` },
        { id: 'B', text: md`45`, note: '' },
        { id: 'C', text: md`65`, note: md`Subtracts the 20 all-three members only once; each is counted three times in the sum of 270, so two extra copies must go.` },
        { id: 'D', text: md`85`, note: md`This is $270 - 185$, which still holds two extra copies of each of the 20 members who do all three.` },
      ],
      answer: 'B',
      workingMd: md`In at least one activity: $200 - 15 = 185$. Sum of the groups: $110 + 90 + 70 = 270$. Then $185 = 270 - E_2 - 2 \times 20$, so $E_2 = 270 - 40 - 185 = 45$. Check: exactly one is $185 - 45 - 20 = 120$, and $120 + 2 \times 45 + 3 \times 20 = 120 + 90 + 60 = 270$.`,
      lesson: 'Total minus none equals the sum of the groups minus exactly two minus twice all three.',
    },
    {
      id: 'check-two-red',
      title: 'Two of one colour',
      topic: 'Quantitative reasoning: worst case',
      stemMd: md`A box holds 10 white, 6 blue and 3 red balls. Balls are taken out one at a time without looking. What is the smallest number that must be taken out to be sure of having at least 2 red balls?`,
      options: [
        { id: 'A', text: md`2`, note: md`This is the best case, two reds in the first two draws; a guarantee must hold in the worst order.` },
        { id: 'B', text: md`4`, note: md`This guarantees two balls of the same colour, whichever colour; here both must be red.` },
        { id: 'C', text: md`17`, note: md`This is the worst case itself, which still holds only one red ball; one more is needed.` },
        { id: 'D', text: md`18`, note: '' },
      ],
      answer: 'D',
      workingMd: md`The worst case takes every ball that is not red first: $10 + 6 = 16$. One red then gives 17 balls with a single red. Only red balls remain, so the 18th is a second red. And 17 is not enough, as that order shows.`,
      lesson: 'To be sure of a particular kind, let the worst case take every item of the other kinds first.',
    },
  ],
  takeaways: [
    md`Two groups: $\text{Total} = |A| + |B| - \text{Both} + \text{Neither}$.`,
    'Three groups with pairwise counts: add the groups, subtract the pairs, add back the centre.',
    md`With exactly-two counts: $\text{Total} - \text{None} = |A| + |B| + |C| - (\text{exactly two}) - 2 \times (\text{all three})$.`,
    'Fill a Venn diagram from the centre out, and check that every region is zero or more.',
    'For a guarantee, build the largest selection that still fails, then add one.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-algebra-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
