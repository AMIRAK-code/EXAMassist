import { md, type Lesson, type Unit } from '../../types';

/** GMAT Quantitative Reasoning: the word-problem lessons (docs/COURSE-AUTHORING.md, the plan). */

const overlappingSets: Lesson = {
  slug: 'overlapping-sets',
  title: 'Overlapping sets: Venn diagrams and double-matrix tables',
  summary: 'Count groups that overlap with the two-set formula, a double-matrix table or the three-set formula, and find the largest and smallest overlap.',
  minutes: 20,
  objectives: [
    'Solve two-group overlap questions with the formula or a Venn diagram.',
    'Organise two yes-or-no attributes in a double-matrix table, with counts or percents.',
    'Handle three overlapping groups, telling "exactly two" from pairwise counts.',
    'Find the greatest and least possible overlap of two groups.',
  ],
  teachMd: md`
### Two sets

When some people belong to two groups, adding the group sizes counts the people in both groups twice. Subtract them once, then add anyone in neither group:

$$\text{Total} = A + B - \text{Both} + \text{Neither}$$

A typical two-set question gives four of these five numbers and asks for the fifth. A Venn diagram makes the parts visible: "only $A$" is $A - \text{Both}$, "only $B$" is $B - \text{Both}$, and "exactly one of the two" is the sum of those, $A + B - 2 \times \text{Both}$. Read carefully which region the question asks about: "speaks French" includes the people who speak both languages, "speaks only French" does not.

### The double-matrix table

When everyone is sorted by two yes-or-no attributes (men or women, and on campus or off campus), a two-by-two table with totals is faster and safer than a diagram:

| | Attribute 2: yes | Attribute 2: no | Total |
| --- | --- | --- | --- |
| Attribute 1: yes | | | |
| Attribute 1: no | | | |
| Total | | | grand total |

Every row and every column adds up, so each new number lets you fill in another. You usually need only four well-placed numbers to complete all nine cells. The table works just as well with percents: if no total is given, call the grand total 100.

Be careful with "of". "30% of the employees are remote" is a percent of the grand total; "30% of the sales staff are remote" is a percent of one row. Convert row percents into counts of the whole before you put them in the table.

### Three sets

With three groups $A$, $B$ and $C$, the clearest bookkeeping counts how many groups each person belongs to. Let $E_1$, $E_2$ and $E_3$ be the numbers of people in exactly one, exactly two and all three groups. Then

$$A + B + C = E_1 + 2E_2 + 3E_3$$

because a person in two groups is counted in two of the group totals, and a person in three groups in all three. The number of people in at least one group is $E_1 + E_2 + E_3$. Subtracting one equation from the other gives the formula usually quoted:

$$\text{Total} = A + B + C - E_2 - 2E_3 + \text{Neither}$$

Some questions instead give pairwise overlaps such as "in both $A$ and $B$", which **include** the people in all three. With those, the formula is

$$\text{Total} = A + B + C - (AB + AC + BC) + ABC + \text{Neither}$$

The difference between "exactly two" and "both $A$ and $B$" is the most common source of error in three-set questions, so name which one you have before choosing a formula.

### Greatest and least overlap

Sometimes the overlap is not fixed and the question asks how large or small it can be. In a group of 60 where 42 drink tea and 35 drink coffee:

- **Greatest overlap:** the smaller group sits entirely inside the larger, so at most 35 drink both.
- **Least overlap:** squeeze the groups apart. They can cover at most all 60 people, so at least $42 + 35 - 60 = 17$ drink both.

If the question also fixes how many are in neither group, the people in at least one group replace the 60 in that calculation.

### Checking an answer

Fill in every region and add them up. If the regions do not add to the total, or a region comes out negative, a number went in the wrong place.
`,
  examples: [
    {
      id: 'example-two-languages',
      title: 'Two languages',
      problemMd: md`A company has 120 employees. 70 speak Spanish, 45 speak French and 25 speak neither. How many speak both languages?`,
      steps: [
        md`Employees who speak at least one of the languages: $120 - 25 = 95$.`,
        md`Use the formula: $95 = 70 + 45 - \text{Both}$, so $\text{Both} = 115 - 95 = 20$.`,
        md`Check the regions: only Spanish $70 - 20 = 50$, only French $45 - 20 = 25$, both 20, neither 25; $50 + 25 + 20 + 25 = 120$.`,
      ],
      answerMd: md`20 employees speak both. Forgetting the 25 who speak neither gives $70 + 45 - 120 = -5$, an impossible count that signals the slip.`,
    },
    {
      id: 'example-housing-matrix',
      title: 'A double-matrix table',
      problemMd: md`Of 200 students, 110 are women. 80 students live on campus, and 30 of the men live on campus. How many women live off campus?`,
      steps: [
        md`Set up rows for men and women and columns for on and off campus. Men: $200 - 110 = 90$.`,
        md`Women on campus: $80 - 30 = 50$. Women off campus: $110 - 50 = 60$.`,
        md`Check the other column: men off campus are $90 - 30 = 60$, so off campus totals $60 + 60 = 120 = 200 - 80$.`,
      ],
      answerMd: md`60 women live off campus.`,
    },
    {
      id: 'example-three-apps',
      title: 'Three overlapping groups',
      problemMd: md`In a survey of 100 people, 50 use app X, 40 use app Y and 30 use app Z. 18 people use exactly two of the apps and 6 use all three. How many use none of the three?`,
      steps: [
        md`Membership count: $E_1 + 2 \times 18 + 3 \times 6 = 50 + 40 + 30 = 120$, so $E_1 = 120 - 36 - 18 = 66$.`,
        md`At least one app: $66 + 18 + 6 = 90$. None: $100 - 90 = 10$.`,
        md`Check with the formula: $50 + 40 + 30 - 18 - 2 \times 6 = 90$ use at least one app, the same.`,
      ],
      answerMd: md`10 people use none of the apps. Subtracting the 6 triple users only once gives 96 users and 4 with none.`,
    },
  ],
  traps: [
    {
      title: 'Leaving out "neither"',
      md: md`The two-set formula has a fifth term. If some people are in neither group, the group totals describe only the rest. Subtract the "neither" count from the total before you work with the groups.`,
    },
    {
      title: '"Both" read as "only"',
      md: md`"70 speak Spanish" includes those who also speak French. "Only Spanish" means Spanish minus both. Questions often ask for an "only" region while giving totals, or the other way round.`,
    },
    {
      title: 'Exactly two versus pairwise overlaps',
      md: md`"In exactly two groups" excludes the people in all three; "in both $A$ and $B$" includes them. The three-set formulas differ accordingly. Using pairwise counts in the "exactly two" formula subtracts the triple overlap too many times.`,
    },
    {
      title: 'A percent of a row taken as a percent of all',
      md: md`"25% of the sales staff work remotely" is 25% of one row, not of the whole company. Turn it into a count (or a percent of the grand total) before writing it in the table.`,
    },
  ],
  check: [
    {
      id: 'check-fish-not-dessert',
      title: 'Fish but not dessert',
      topic: 'Problem Solving',
      stemMd: md`At a dinner for 150 guests, 90 ordered fish, 70 ordered dessert and 30 ordered neither. How many guests ordered fish but not dessert?`,
      options: [
        { id: 'A', text: md`20`, note: md`20 is the difference between the fish and dessert totals, $90 - 70$, which describes no group of guests.` },
        { id: 'B', text: md`40`, note: md`40 guests ordered both; the question asks for fish without dessert.` },
        { id: 'C', text: md`50`, note: '' },
        { id: 'D', text: md`60`, note: md`This subtracts the 30 guests who ordered neither from the fish total, but none of those 30 ordered fish.` },
        { id: 'E', text: md`80`, note: md`80 guests ordered exactly one of the two, fish only plus dessert only.` },
      ],
      answer: 'C',
      workingMd: md`At least one: $150 - 30 = 120$. Both: $90 + 70 - 120 = 40$. Fish but not dessert: $90 - 40 = 50$. Check the regions: $50 + 40 + 30 + 30 = 150$ (fish only, both, dessert only, neither).`,
      lesson: 'Find the overlap first, then read off exactly the region the question names.',
    },
    {
      id: 'check-remote-sales-share',
      title: 'Who works remotely?',
      topic: 'Problem Solving',
      stemMd: md`At a firm, 25% of the employees work in sales. Of the sales staff, 60% work remotely; of the other employees, 20% work remotely. What percent of the remote workers are in sales?`,
      options: [
        { id: 'A', text: md`15%`, note: md`15% of all employees are remote sales staff; the question asks for a share of the remote workers only.` },
        { id: 'B', text: md`25%`, note: md`25% is the share of all employees who are in sales, not the share of remote workers.` },
        { id: 'C', text: md`30%`, note: md`30% of all employees work remotely; that is the denominator, not the answer.` },
        { id: 'D', text: md`50%`, note: '' },
        { id: 'E', text: md`60%`, note: md`60% is the share of sales staff who are remote, the reverse of what is asked.` },
      ],
      answer: 'D',
      workingMd: md`Take 100 employees: 25 in sales and 75 not. Remote sales staff: $0.6 \times 25 = 15$. Other remote workers: $0.2 \times 75 = 15$. Remote workers: 30, of whom 15 are in sales, so $\frac{15}{30} = 50\%$.`,
      lesson: 'Turn every "percent of a group" into a count of the whole before dividing.',
    },
    {
      id: 'check-exactly-two-classes',
      title: 'Exactly two classes',
      topic: 'Problem Solving',
      stemMd: md`Each of the 80 members of a gym takes at least one of three classes: yoga, spin and pilates. 40 members take yoga, 35 take spin and 30 take pilates, and 10 members take all three. How many members take exactly two of the classes?`,
      options: [
        { id: 'A', text: md`5`, note: '' },
        { id: 'B', text: md`15`, note: md`This subtracts the 10 triple members once from the excess of 25, but each of them accounts for 2 of that excess.` },
        { id: 'C', text: md`25`, note: md`25 is the excess of the class totals over the members, $105 - 80$; the triple members are still inside it.` },
        { id: 'D', text: md`35`, note: md`35 is the sum of the pairwise overlaps, which counts each triple member three times.` },
        { id: 'E', text: md`65`, note: md`65 members take exactly one class.` },
      ],
      answer: 'A',
      workingMd: md`Membership count: $E_1 + 2E_2 + 3E_3 = 40 + 35 + 30 = 105$, and $E_1 + E_2 + E_3 = 80$. Subtracting, $E_2 + 2E_3 = 25$, and with $E_3 = 10$, $E_2 = 5$. Check: $E_1 = 80 - 5 - 10 = 65$, and $65 + 2 \times 5 + 3 \times 10 = 105$.`,
      lesson: 'Count how many groups each person is in; the class totals add those memberships up.',
    },
  ],
  takeaways: [
    'Two sets: Total = A + B − Both + Neither.',
    'Use a double-matrix table for two yes-or-no attributes; rows and columns must add up.',
    'Three sets: A + B + C = (exactly one) + 2(exactly two) + 3(all three).',
    'Least overlap is A + B − (people in at least one); greatest is the smaller group.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-applied-arithmetic-algebra' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const counting: Lesson = {
  slug: 'counting',
  title: 'Counting: arrangements, selections and restrictions',
  summary: 'Count with the multiplication principle, permutations and combinations, identical items and restrictions, and know which tool each question needs.',
  minutes: 22,
  objectives: [
    'Count outcomes of a sequence of choices with the multiplication principle.',
    'Decide whether order matters, and use permutations or combinations accordingly.',
    'Count arrangements with identical items, and handle "together", "apart" and "at least one".',
  ],
  teachMd: md`
### The multiplication principle

If a task is a sequence of choices, with $m$ options for the first and $n$ for the second whatever the first was, the task can be done in $m \times n$ ways. Almost every counting question is this principle in some form. Draw one slot per choice, write the number of options in each slot, and multiply. A code of one letter from A to E followed by two different digits has $5 \times 10 \times 9 = 450$ possibilities: the second digit has only 9 options because it must differ from the first.

### Fill restricted slots first

When some positions carry conditions, fill those slots first, because a condition can only shrink the options. For a four-digit number the first digit cannot be 0; for an even number the last digit must be even. When two conditions interact (the last digit might be 0, which affects the first digit), split into cases.

### Order matters: permutations

Arranging $r$ of $n$ different items in order is a slot problem with shrinking options:

$$P(n, r) = n \times (n-1) \times \cdots \times (n-r+1) = \frac{n!}{(n-r)!}$$

Arranging all $n$ items gives $n!$. Know the small factorials: $3! = 6$, $4! = 24$, $5! = 120$, $6! = 720$, $7! = 5040$.

### Order does not matter: combinations

Choosing $r$ of $n$ items when order is irrelevant (a committee, a hand of cards, toppings) counts each group once instead of $r!$ times:

$$\binom{n}{r} = \frac{n!}{r!\,(n-r)!}$$

Compute by cancelling, never by multiplying out factorials: $\binom{10}{3} = \frac{10 \times 9 \times 8}{3 \times 2 \times 1} = 120$. Choosing $r$ to take is the same as choosing $n - r$ to leave, so $\binom{10}{7} = \binom{10}{3}$.

To decide which applies, swap two of the chosen items. If the swap gives a different outcome (president and treasurer exchanged), order matters. If it gives the same outcome (two committee members exchanged), it does not.

### Identical items

Arranging $n$ items of which $a$ are identical, $b$ are identical among themselves, and so on, gives

$$\frac{n!}{a!\,b!\,\cdots}$$

because swapping identical items does not create a new arrangement, so each distinct arrangement was counted $a! \times b! \times \cdots$ times among the $n!$.

### Restrictions

- **Must be together.** Glue the items into one block, arrange the block with the others, then multiply by the ways to arrange the items inside the block.
- **Must be apart.** Count all arrangements and subtract those in which they are together.
- **At least one.** Count all selections and subtract those with none. Counting directly ("pick one woman, then anyone") counts some groups more than once.

### Keep the numbers small

Answer choices for counting questions are often far apart, so a sensible estimate of the size of the answer rules out several. Before multiplying, check whether a product such as $\frac{8 \times 7 \times 6}{3 \times 2}$ cancels first: it is $8 \times 7 = 56$.
`,
  examples: [
    {
      id: 'example-committee-with-woman',
      title: 'A committee with at least one woman',
      problemMd: md`A committee of 3 is chosen from 5 men and 4 women. How many committees include at least one woman?`,
      steps: [
        md`Order does not matter, so use combinations. All committees: $\binom{9}{3} = \frac{9 \times 8 \times 7}{6} = 84$.`,
        md`Committees with no woman: $\binom{5}{3} = 10$. With at least one woman: $84 - 10 = 74$.`,
        md`Check directly by cases. One woman: $4 \times \binom{5}{2} = 40$. Two women: $\binom{4}{2} \times 5 = 30$. Three women: $\binom{4}{3} = 4$. Total $40 + 30 + 4 = 74$.`,
      ],
      answerMd: md`74 committees. Choosing one woman and then any two of the other 8 gives $4 \times 28 = 112$, which counts a committee with two women twice.`,
    },
    {
      id: 'example-even-four-digit',
      title: 'Even four-digit numbers with different digits',
      problemMd: md`How many four-digit numbers have four different digits and are even?`,
      steps: [
        md`The last digit must be even and the first digit cannot be 0. Because 0 is even, split on the last digit.`,
        md`Last digit 0: the first digit has 9 options (1 to 9), then 8 and 7 for the middle two: $9 \times 8 \times 7 = 504$.`,
        md`Last digit 2, 4, 6 or 8 (4 options): the first digit has 8 options (not 0, not the last digit), then 8 and 7 for the middle: $4 \times 8 \times 8 \times 7 = 1792$.`,
        md`Total: $504 + 1792 = 2296$. Check by complement: all four-digit numbers with different digits number $9 \times 9 \times 8 \times 7 = 4536$; odd ones have 5 choices of last digit, then $8 \times 8 \times 7$, giving 2240; and $4536 - 2240 = 2296$.`,
      ],
      answerMd: md`2296. Treating the last-digit choice as 5 options in a single case ignores that a last digit of 0 leaves 9, not 8, choices for the first digit.`,
    },
    {
      id: 'example-shelf-ends',
      title: 'Books with fixed ends',
      problemMd: md`Six different books are placed in a row on a shelf. Two of them, an atlas and a dictionary, must be at the two ends. How many arrangements are possible?`,
      steps: [
        md`Fill the restricted slots first: the atlas and dictionary can occupy the ends in $2$ orders.`,
        md`The other four books fill the four middle slots in $4! = 24$ ways.`,
        md`Total: $2 \times 24 = 48$. Check as a fraction: of all $720$ arrangements, the chance the two ends hold exactly these two books is $\frac{2}{6} \times \frac{1}{5} = \frac{1}{15}$, and $\frac{720}{15} = 48$.`,
      ],
      answerMd: md`48 arrangements. Forgetting that the atlas and dictionary can swap ends gives 24.`,
    },
  ],
  traps: [
    {
      title: 'Using order when it does not matter',
      md: md`Picking 3 people for a committee is not $9 \times 8 \times 7$; that counts each committee $3! = 6$ times. Apply the swap test: if exchanging two choices gives the same outcome, divide by the arrangements of the chosen items.`,
    },
    {
      title: 'Counting "at least one" directly',
      md: md`"Choose one woman, then anyone" overcounts groups with more than one woman. Use all selections minus the selections with none, or split into exact cases.`,
    },
    {
      title: 'The leading zero',
      md: md`A four-digit number cannot start with 0, and 0 is also an even digit. When both facts matter, split into cases on whether 0 is used in the restricted slot.`,
    },
    {
      title: 'Forgetting the order inside a block',
      md: md`When items must sit together, the block can be arranged internally too. Two people together give a factor of 2; three give $3! = 6$.`,
    },
  ],
  check: [
    {
      id: 'check-sandwich-count',
      title: 'Building a sandwich',
      topic: 'Problem Solving',
      stemMd: md`A café offers 4 kinds of bread, 5 fillings and 3 sauces. A sandwich is made with one bread, two different fillings and one sauce. How many different sandwiches are possible?`,
      options: [
        { id: 'A', text: md`12`, note: md`$4 \times 3$ leaves the fillings out of the count altogether.` },
        { id: 'B', text: md`60`, note: md`$4 \times 5 \times 3$ chooses only one filling.` },
        { id: 'C', text: md`120`, note: '' },
        { id: 'D', text: md`240`, note: md`$4 \times 5 \times 4 \times 3$ counts the two fillings in order, so each pair is counted twice.` },
        { id: 'E', text: md`300`, note: md`$4 \times 5 \times 5 \times 3$ allows the same filling twice and counts the fillings in order.` },
      ],
      answer: 'C',
      workingMd: md`Bread: 4 ways. Two different fillings, order irrelevant: $\binom{5}{2} = 10$. Sauce: 3 ways. Total $4 \times 10 \times 3 = 120$. Check: ordered fillings give $5 \times 4 = 20$, and dividing by the 2 orders gives 10.`,
      lesson: 'Multiply across independent choices, and use a combination for any choice where order does not matter.',
    },
    {
      id: 'check-flags-in-a-row',
      title: 'Flags with repeated colours',
      topic: 'Problem Solving',
      stemMd: md`Seven flags are hung in a row: 3 identical red flags, 2 identical blue flags and 2 identical green flags. How many different colour sequences are possible?`,
      options: [
        { id: 'A', text: md`24`, note: md`24 is $3! \times 2! \times 2!$, the number to divide by, not the answer.` },
        { id: 'B', text: md`210`, note: '' },
        { id: 'C', text: md`420`, note: md`This divides by $3!$ and one $2!$ only, forgetting that the flags of a second colour are also identical.` },
        { id: 'D', text: md`840`, note: md`This divides only by $3!$ for the red flags.` },
        { id: 'E', text: md`5,040`, note: md`$7!$ treats all seven flags as different.` },
      ],
      answer: 'B',
      workingMd: md`$\frac{7!}{3!\,2!\,2!} = \frac{5040}{6 \times 2 \times 2} = \frac{5040}{24} = 210$. Second route with combinations: choose the red positions, $\binom{7}{3} = 35$, then the blue ones from the remaining four, $\binom{4}{2} = 6$; green fills the rest, and $35 \times 6 = 210$.`,
      lesson: 'Divide by the factorial of each group of identical items.',
    },
    {
      id: 'check-photo-not-adjacent',
      title: 'Two friends kept apart',
      topic: 'Problem Solving',
      stemMd: md`Five friends, including Ana and Ben, stand in a row for a photo. In how many of the arrangements are Ana and Ben not next to each other?`,
      options: [
        { id: 'A', text: md`24`, note: md`24 is the count with Ana and Ben together before allowing for their two orders inside the pair, and it answers the opposite question.` },
        { id: 'B', text: md`48`, note: md`48 is the number of arrangements in which they are next to each other.` },
        { id: 'C', text: md`60`, note: md`This assumes half the arrangements keep them apart; adjacent pairs are fewer than half.` },
        { id: 'D', text: md`72`, note: '' },
        { id: 'E', text: md`96`, note: md`This subtracts 24 rather than 48, forgetting that Ana and Ben can stand in either order when together.` },
      ],
      answer: 'D',
      workingMd: md`All arrangements: $5! = 120$. Together: treat Ana and Ben as one block, so $4! = 24$ arrangements, times 2 for their order, giving 48. Apart: $120 - 48 = 72$. Check directly: of the $\binom{5}{2} = 10$ pairs of positions, 4 are adjacent and 6 are not; $6 \times 2 \times 3! = 72$.`,
      lesson: 'For "apart", count all arrangements and subtract the "together" ones, remembering the order inside the block.',
    },
  ],
  takeaways: [
    'Draw a slot for each choice and multiply; fill restricted slots first.',
    'Swap test: if swapping two choices changes nothing, use combinations.',
    'Divide by the factorial of each group of identical items.',
    'Apart = all − together; at least one = all − none.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-applied-arithmetic-algebra' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const probability: Lesson = {
  slug: 'probability',
  title: 'Probability: counting, complements and combined events',
  summary: 'Find probabilities by counting, use the complement for "at least one", multiply for "and", add for "or", and draw without replacement correctly.',
  minutes: 22,
  objectives: [
    'Compute a probability as favourable outcomes over equally likely outcomes.',
    'Use the complement for "at least one" and "not" questions.',
    'Combine events with the "and" and "or" rules, with and without replacement.',
  ],
  teachMd: md`
### Probability is counting

When all outcomes are equally likely,

$$P(\text{event}) = \frac{\text{number of favourable outcomes}}{\text{total number of outcomes}}$$

so many probability questions are counting questions with a division at the end; the tools in the [counting lesson](/courses/gmat/counting) apply directly. A probability is always between 0 and 1, and the probabilities of all the separate possible outcomes add to 1. Both facts are quick checks on any answer.

### The complement

$$P(\text{not } A) = 1 - P(A)$$

The complement is the fastest route whenever the question says "at least one". Instead of adding the chances of exactly one, exactly two, exactly three, find the chance of none and subtract it from 1. If each of three independent attempts succeeds with probability $0.4$, the chance that all three fail is $0.6^3 = 0.216$, so the chance of at least one success is $1 - 0.216 = 0.784$.

### "And": multiply

The probability that $A$ and $B$ both happen is $P(A) \times P(B \text{ given } A)$. If the events are **independent** (one tells you nothing about the other, such as separate coin tosses or separate people's results), that is simply $P(A) \times P(B)$.

Draws **without replacement** are not independent: each draw changes what is left. From a bag of 5 red and 3 blue counters, the chance that two draws are both red is $\frac{5}{8} \times \frac{4}{7}$, because after one red is gone 4 of the remaining 7 are red. The counting route agrees: $\frac{\binom{5}{2}}{\binom{8}{2}}$.

### "Or": add, then remove the overlap

$$P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)$$

If $A$ and $B$ cannot happen together (mutually exclusive), the last term is zero and the probabilities simply add. Otherwise the outcomes in both are counted twice and must be subtracted once, exactly as with overlapping sets. For an integer chosen from 1 to 60, 15 are divisible by 4 and 10 by 6; the 5 multiples of 12 are in both, so $\frac{15 + 10 - 5}{60} = \frac{1}{3}$ are divisible by 4 or 6.

### "Exactly one": count every order

The chance of exactly one red in two draws is not $\frac{5}{8} \times \frac{3}{7}$. That is red **then** blue; blue then red is a separate outcome with the same probability. Add both, or count with combinations ($5 \times 3$ favourable pairs out of $\binom{8}{2}$), which handles order automatically.

### Choosing a method

| The question says | Reach for |
| --- | --- |
| at least one, not all, not | the complement |
| both, all, and, in a row | multiplication |
| either, or | addition, minus the overlap |
| exactly $k$ of $n$ | multiplication, times the number of orders |
| a selection from a group | combinations over combinations |

### Sanity checks

Before you choose, ask whether the answer is plausibly large or small. "At least one" over several tries should be bigger than a single try's chance; "all of them" should be smaller. And the exactly-zero, exactly-one and exactly-two probabilities of a two-draw question must add to 1.
`,
  examples: [
    {
      id: 'example-two-red',
      title: 'Two draws without replacement',
      problemMd: md`A bag holds 5 red and 3 blue counters. Two counters are drawn at random without replacement. What is the probability that both are red?`,
      steps: [
        md`Multiply along the draws: $\frac{5}{8}$ for the first red, then $\frac{4}{7}$ because one red counter is gone.`,
        md`$\frac{5}{8} \times \frac{4}{7} = \frac{20}{56} = \frac{5}{14}$.`,
        md`Check by counting pairs: $\frac{\binom{5}{2}}{\binom{8}{2}} = \frac{10}{28} = \frac{5}{14}$.`,
      ],
      answerMd: md`$\frac{5}{14}$. Treating the draws as independent gives $\left(\frac{5}{8}\right)^2 = \frac{25}{64}$, which would be right only with replacement.`,
    },
    {
      id: 'example-exactly-one-red',
      title: 'Exactly one red',
      problemMd: md`From the same bag of 5 red and 3 blue counters, two are drawn without replacement. What is the probability that exactly one is red?`,
      steps: [
        md`Red then blue: $\frac{5}{8} \times \frac{3}{7} = \frac{15}{56}$. Blue then red: $\frac{3}{8} \times \frac{5}{7} = \frac{15}{56}$.`,
        md`The two orders are separate outcomes, so add: $\frac{30}{56} = \frac{15}{28}$.`,
        md`Check by counting: $5 \times 3 = 15$ red-blue pairs out of 28, so $\frac{15}{28}$. And the cases add to 1: both red $\frac{10}{28}$, exactly one $\frac{15}{28}$, both blue $\frac{3}{28}$.`,
      ],
      answerMd: md`$\frac{15}{28}$. Stopping at one order gives $\frac{15}{56}$, half the true value.`,
    },
    {
      id: 'example-at-least-one-success',
      title: 'At least one success',
      problemMd: md`A machine makes a successful weld on each attempt with probability $0.4$, independently of other attempts. What is the probability that at least one of three attempts succeeds?`,
      steps: [
        md`Use the complement. All three fail with probability $0.6 \times 0.6 \times 0.6 = 0.216$.`,
        md`At least one success: $1 - 0.216 = 0.784$.`,
        md`Check by cases: exactly one success $3 \times 0.4 \times 0.36 = 0.432$, exactly two $3 \times 0.16 \times 0.6 = 0.288$, all three $0.064$; the total is $0.784$.`,
      ],
      answerMd: md`$0.784$. Adding $0.4$ three times gives $1.2$, an impossible probability that signals overlapping events were added.`,
    },
  ],
  traps: [
    {
      title: 'Forgetting the other order',
      md: md`"Exactly one red" happens as red-blue or blue-red. Multiplying along a single order gives only one of them. Multiply by the number of orders, or count with combinations.`,
    },
    {
      title: 'Assuming replacement',
      md: md`Unless the question says items are put back, each draw changes the numbers left. Lower the counts after each draw.`,
    },
    {
      title: 'Adding events that overlap',
      md: md`Probabilities add only for events that cannot happen together. "Divisible by 6 or by 10" overlaps at multiples of 30, which must be subtracted once.`,
    },
    {
      title: 'Building "at least one" the long way',
      md: md`Listing every case for "at least one" is slow and easy to get wrong. One minus the probability of none is almost always quicker.`,
    },
  ],
  check: [
    {
      id: 'check-defective-bulbs',
      title: 'At least one defective bulb',
      topic: 'Problem Solving',
      stemMd: md`A box contains 4 defective bulbs and 8 working bulbs. Two bulbs are chosen at random without replacement. What is the probability that at least one of them is defective?`,
      options: [
        { id: 'A', text: md`$\frac{1}{11}$`, note: md`This is the probability that both bulbs are defective, not at least one.` },
        { id: 'B', text: md`$\frac{1}{3}$`, note: md`This is the chance that a single chosen bulb is defective; the second bulb was ignored.` },
        { id: 'C', text: md`$\frac{16}{33}$`, note: md`This is the probability of exactly one defective bulb; the case of two defective bulbs is missing.` },
        { id: 'D', text: md`$\frac{5}{9}$`, note: md`This is $1 - \left(\frac{2}{3}\right)^2$, which assumes the first bulb is put back before the second is chosen.` },
        { id: 'E', text: md`$\frac{19}{33}$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Complement: both working has probability $\frac{8}{12} \times \frac{7}{11} = \frac{56}{132} = \frac{14}{33}$, so at least one defective is $1 - \frac{14}{33} = \frac{19}{33}$. Check by cases: both defective $\frac{4}{12} \times \frac{3}{11} = \frac{1}{11} = \frac{3}{33}$; exactly one $2 \times \frac{4}{12} \times \frac{8}{11} = \frac{64}{132} = \frac{16}{33}$; total $\frac{19}{33}$.`,
      lesson: 'For "at least one", subtract the probability of none from 1, and lower the counts after each draw.',
    },
    {
      id: 'check-divisible-6-or-10',
      title: 'Divisible by 6 or by 10',
      topic: 'Problem Solving',
      stemMd: md`An integer is chosen at random from the integers 1 to 90 inclusive. What is the probability that it is divisible by 6 or by 10?`,
      options: [
        { id: 'A', text: md`$\frac{1}{30}$`, note: md`This counts only the 3 integers divisible by both 6 and 10.` },
        { id: 'B', text: md`$\frac{1}{10}$`, note: md`This counts only the 9 multiples of 10.` },
        { id: 'C', text: md`$\frac{1}{6}$`, note: md`This counts only the 15 multiples of 6.` },
        { id: 'D', text: md`$\frac{7}{30}$`, note: '' },
        { id: 'E', text: md`$\frac{4}{15}$`, note: md`This adds 15 and 9 without removing the 3 multiples of 30, which were counted twice.` },
      ],
      answer: 'D',
      workingMd: md`Multiples of 6 up to 90: 15. Multiples of 10: 9. Multiples of both, that is of $\text{lcm}(6, 10) = 30$: 3. Divisible by 6 or 10: $15 + 9 - 3 = 21$, so the probability is $\frac{21}{90} = \frac{7}{30}$.`,
      lesson: 'For "or", add the counts and subtract the overlap, found with the LCM.',
    },
    {
      id: 'check-exactly-one-passes',
      title: 'Exactly one passes',
      topic: 'Problem Solving',
      stemMd: md`The probability that Lena passes a test is $0.7$, and, independently, the probability that Omar passes it is $0.6$. What is the probability that exactly one of them passes?`,
      options: [
        { id: 'A', text: md`$0.12$`, note: md`$0.3 \times 0.4$ is the probability that neither passes.` },
        { id: 'B', text: md`$0.42$`, note: md`$0.7 \times 0.6$ is the probability that both pass.` },
        { id: 'C', text: md`$0.46$`, note: '' },
        { id: 'D', text: md`$0.58$`, note: md`$1 - 0.42$ is the probability that not both pass, which still includes the case where neither passes.` },
        { id: 'E', text: md`$0.88$`, note: md`$1 - 0.12$ is the probability that at least one passes, which includes both passing.` },
      ],
      answer: 'C',
      workingMd: md`Lena passes and Omar fails: $0.7 \times 0.4 = 0.28$. Omar passes and Lena fails: $0.3 \times 0.6 = 0.18$. Exactly one: $0.28 + 0.18 = 0.46$. Check: neither $0.12$, both $0.42$, and $0.12 + 0.42 + 0.46 = 1$.`,
      lesson: 'Split "exactly one" into its separate cases and add them; the cases of a question must total 1.',
    },
  ],
  takeaways: [
    'Probability = favourable ÷ total when outcomes are equally likely.',
    'At least one = 1 − none.',
    'And: multiply, updating counts without replacement. Or: add, then subtract the overlap.',
    'Exactly one needs every order; all the cases must add to 1.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-applied-arithmetic-algebra' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const interestAndGrowth: Lesson = {
  slug: 'interest-and-growth',
  title: 'Interest and growth: simple, compound and repeated change',
  summary: 'Tell simple from compound interest, compute compound growth by hand, compare compounding periods and work growth and decay backwards.',
  minutes: 20,
  objectives: [
    'Compute simple and compound interest, and the difference between them.',
    'Handle compounding more than once a year.',
    'Model repeated growth or decay with a constant factor, and work it backwards to find a rate.',
  ],
  teachMd: md`
### Simple interest grows by a fixed amount

Simple interest is paid only on the original amount, the principal:

$$I = Prt$$

where $P$ is the principal, $r$ the yearly rate as a decimal and $t$ the time in years. $\$2,000$ at 5% simple interest earns $\$100$ every year, so $\$300$ over three years. The balance grows in a straight line.

### Compound interest grows by a fixed factor

Compound interest is paid on the balance, including interest already earned, so each year's interest is larger than the last. With yearly compounding,

$$A = P(1 + r)^t$$

and with compounding $n$ times a year at a yearly rate $r$,

$$A = P\left(1 + \frac{r}{n}\right)^{nt}$$

Quarterly compounding at 8% a year means 2% per quarter, four times a year. The more often interest is compounded, the more the account ends up holding, though the gain from compounding more often is small.

### Powers worth knowing by hand

Without a calculator, these products come up again and again:

| Factor | Square | Cube |
| --- | --- | --- |
| $1.02$ | $1.0404$ | $1.061208$ |
| $1.05$ | $1.1025$ | $1.157625$ |
| $1.1$ | $1.21$ | $1.331$ |
| $1.2$ | $1.44$ | $1.728$ |
| $0.9$ | $0.81$ | $0.729$ |

Square a factor like $1.05$ by expanding: $(1 + 0.05)^2 = 1 + 0.1 + 0.0025 = 1.1025$. The expansion also shows why compounding helps: the extra $0.0025$ is interest on interest.

### Compound minus simple

Over two years at rate $r$, compound interest exceeds simple interest by

$$P(1 + r)^2 - P(1 + 2r) = Pr^2$$

the interest earned in the second year on the first year's interest. On $\$5,000$ at 6% that is $5000 \times 0.0036 = \$18$. Questions that give this difference and ask for the principal or the rate are solved with this one line.

### Growth and decay in general

Interest is one case of repeated percent change. Anything that grows by a fixed percent per period is multiplied by the same factor each period: a population growing 3% a year is multiplied by $1.03$ per year; a car losing 15% of its value a year is multiplied by $0.85$. Quantities that double or triple in a fixed time work the same way: bacteria that triple every 20 minutes are multiplied by $3^6 = 729$ in two hours, since two hours contain six 20-minute periods. Count the periods carefully; that is where most errors start.

### Working backwards

To find an earlier value, divide by the factor. To find a rate, divide the end value by the start value and recognise the power: growth from $\$2,500$ to $\$3,025$ over two years is a factor of $\frac{3025}{2500} = 1.21 = 1.1^2$, so the yearly rate is 10%.

### Estimating

For a rough doubling time, the rule of 72 gives about $\frac{72}{\text{rate in percent}}$ years; at 8% a year, money doubles in roughly 9 years ($1.08^9$ is just under 2). Use it only to discard answer choices that are far off, never for an exact answer.
`,
  examples: [
    {
      id: 'example-simple-versus-compound',
      title: 'Simple against compound',
      problemMd: md`$\$5,000$ is invested for two years at 6% a year. How much more interest does it earn with yearly compounding than with simple interest?`,
      steps: [
        md`Simple interest: $5000 \times 0.06 \times 2 = \$600$.`,
        md`Compound: $1.06^2 = 1 + 0.12 + 0.0036 = 1.1236$, so the balance is $5000 \times 1.1236 = \$5,618$ and the interest is $\$618$.`,
        md`Difference: $618 - 600 = \$18$. Check with $Pr^2 = 5000 \times 0.06^2 = 5000 \times 0.0036 = 18$.`,
      ],
      answerMd: md`$\$18$ more with compounding.`,
    },
    {
      id: 'example-semiannual',
      title: 'Compounding twice a year',
      problemMd: md`$\$8,000$ is deposited for one year at 10% a year, compounded every six months. What is the balance at the end of the year, and how does it compare with yearly compounding?`,
      steps: [
        md`Twice a year at 10% a year means 5% per half-year, applied twice: $8000 \times 1.05^2$.`,
        md`$1.05^2 = 1.1025$, so the balance is $8000 \times 1.1025 = \$8,820$.`,
        md`Check step by step: after six months $8000 \times 1.05 = 8400$; after a year $8400 \times 1.05 = 8820$. Yearly compounding gives $8000 \times 1.1 = \$8,800$.`,
      ],
      answerMd: md`$\$8,820$, which is $\$20$ more than yearly compounding. Applying the full 10% twice would give $\$9,680$, the slip of not dividing the rate by the number of periods.`,
    },
    {
      id: 'example-find-the-rate',
      title: 'Finding the rate',
      problemMd: md`An investment grew from $\$2,500$ to $\$3,025$ in two years with interest compounded yearly at a constant rate. What was the yearly rate?`,
      steps: [
        md`The two-year growth factor is $\frac{3025}{2500} = 1.21$.`,
        md`A two-year factor is the yearly factor squared, and $1.21 = 1.1^2$, so the yearly factor is $1.1$ and the rate is 10%.`,
        md`Check forwards: $2500 \times 1.1 = 2750$ and $2750 \times 1.1 = 3025$.`,
      ],
      answerMd: md`10% a year. Dividing the total growth of 21% by two years gives 10.5%, which treats compound growth as simple interest.`,
    },
  ],
  traps: [
    {
      title: 'Treating compound interest as simple',
      md: md`Compound growth over several periods is a power, not a multiple: 10% a year for two years is a factor of $1.21$, not $1.20$. Dividing a total percent change by the number of years overstates the yearly rate.`,
    },
    {
      title: 'Using the yearly rate for each period',
      md: md`With quarterly compounding the rate per quarter is a quarter of the yearly rate, and there are four times as many periods. Divide the rate and multiply the number of periods.`,
    },
    {
      title: 'Miscounting periods',
      md: md`"Triples every 20 minutes for two hours" is six periods, not two or five. "In the third year" means the interest for one year, earned on the balance after two years, not three years of interest.`,
    },
    {
      title: 'Subtracting a decay three times from the start',
      md: md`A 10% yearly fall over three years is $0.9^3 = 0.729$, a 27.1% fall, not 30%. Each fall is taken of the reduced value.`,
    },
  ],
  check: [
    {
      id: 'check-third-year-interest',
      title: 'Interest in the third year',
      topic: 'Problem Solving',
      stemMd: md`$\$4,000$ is invested at 5% a year, compounded yearly. How much interest is earned during the third year alone?`,
      options: [
        { id: 'A', text: md`\$210.00`, note: md`\$210 is the interest for the second year, earned on \$4,200.` },
        { id: 'B', text: md`\$220.50`, note: '' },
        { id: 'C', text: md`\$600.00`, note: md`\$600 is three years of simple interest, not one year of compound interest.` },
        { id: 'D', text: md`\$630.50`, note: md`\$630.50 is the total interest over all three years.` },
        { id: 'E', text: md`\$4,630.50`, note: md`\$4,630.50 is the balance after three years.` },
      ],
      answer: 'B',
      workingMd: md`After two years the balance is $4000 \times 1.1025 = 4410$. The third year's interest is 5% of that: $0.05 \times 4410 = \$220.50$. Check: after three years $4410 \times 1.05 = 4630.50$, and $4630.50 - 4410 = 220.50$.`,
      lesson: 'Interest in one year is the rate times the balance at the start of that year.',
    },
    {
      id: 'check-quarterly-gain',
      title: 'Quarterly against yearly',
      topic: 'Problem Solving',
      stemMd: md`$\$10,000$ is deposited for one year at 8% a year. How much more will the account hold at the end of the year if interest is compounded quarterly rather than yearly?`,
      options: [
        { id: 'A', text: md`\$0`, note: md`This assumes how often interest is added makes no difference; quarterly compounding earns interest on interest.` },
        { id: 'B', text: md`\$16.00`, note: md`\$16 is the gain from compounding twice a year ($1.04^2 = 1.0816$), not four times.` },
        { id: 'C', text: md`\$24.32`, note: '' },
        { id: 'D', text: md`\$800.00`, note: md`\$800 is the interest with yearly compounding, not the difference between the two methods.` },
        { id: 'E', text: md`\$824.32`, note: md`\$824.32 is the total interest with quarterly compounding, not the extra over yearly compounding.` },
      ],
      answer: 'C',
      workingMd: md`Quarterly: 2% per quarter for four quarters. $1.02^2 = 1.0404$ and $1.0404^2 = 1.0404 + 0.0404 \times 1.0404 = 1.0404 + 0.04203216 = 1.08243216$, so the balance is $\$10,824.32$. Yearly: $\$10,800$. Difference: $\$24.32$. Check by expansion: $(1 + 0.02)^4 = 1 + 4(0.02) + 6(0.0004) + 4(0.000008) + 0.00000016$; everything beyond $1 + 0.08$ is $0.00243216$, and $10\,000 \times 0.00243216 = 24.32$.`,
      lesson: 'More frequent compounding adds a little interest on interest; divide the rate and multiply the periods.',
    },
    {
      id: 'check-population-decline',
      title: 'A shrinking population',
      topic: 'Problem Solving',
      stemMd: md`A town of 12,000 people loses 10% of its population each year. What will its population be after 3 years?`,
      options: [
        { id: 'A', text: md`8,400`, note: md`This takes 10% of the original 12,000 three times, a fall of 30%; each fall is taken of the reduced population.` },
        { id: 'B', text: md`8,748`, note: '' },
        { id: 'C', text: md`9,720`, note: md`9,720 is the population after 2 years, one period short.` },
        { id: 'D', text: md`10,800`, note: md`10,800 is the population after 1 year.` },
        { id: 'E', text: md`15,972`, note: md`This applies 10% growth, $1.1^3$, instead of a 10% decline.` },
      ],
      answer: 'B',
      workingMd: md`Multiply by $0.9$ each year: $12\,000 \times 0.9^3 = 12\,000 \times 0.729 = 8748$. Year by year: $10\,800$, then $9720$, then $8748$.`,
      lesson: 'Repeated percent change is a power of one factor; count the periods.',
    },
  ],
  takeaways: [
    md`Simple interest adds $Prt$; compound interest multiplies by $(1 + r)$ each period.`,
    md`With $n$ compoundings a year, use rate $\frac{r}{n}$ for $nt$ periods.`,
    md`Over two years, compound minus simple interest is $Pr^2$.`,
    'Any repeated percent change is a power of one factor; divide by it to go backwards.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-applied-arithmetic-algebra' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const quantWordProblemsUnit: Unit = {
  slug: 'quant-word-problems',
  title: 'Quantitative Reasoning: word problems',
  summary: 'GMAT Quantitative Reasoning questions are problem solving in arithmetic and algebra, often set in an everyday situation. This unit covers four kinds of word problem that reward a method more than arithmetic: overlapping sets, counting, probability, and interest and growth, all worked by hand since the section allows no calculator.',
  lessons: [overlappingSets, counting, probability, interestAndGrowth],
};
