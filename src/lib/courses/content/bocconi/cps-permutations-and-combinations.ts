import { md, type Lesson } from '../../types';

export const permutationsAndCombinationsLesson: Lesson = {
  slug: 'permutations-and-combinations',
  title: 'Permutations and combinations, with and without repetition',
  summary: 'Ask two questions, does order matter and can choices repeat, and pick the right one of four counting formulas without a calculator.',
  minutes: 22,
  objectives: [
    'Decide whether a selection is ordered or unordered, and whether repetition is allowed.',
    'Count with the product rule, factorials, permutations and combinations, with or without repetition.',
    'Count the arrangements of letters or objects when some of them are identical.',
  ],
  teachMd: md`
### Two rules underneath everything

Almost every counting question rests on two rules, both listed in the Bocconi syllabus.

- **Product rule.** If a task is done in stages, with $a$ ways for the first stage and $b$ ways for the second whatever happened in the first, the whole task can be done in $a \times b$ ways. A menu with 4 starters and 5 main courses gives $4 \times 5 = 20$ two-course meals.
- **Sum rule.** If a choice falls into separate cases that cannot happen together, add the counts of the cases. A meal that is *either* one of 4 starters *or* one of 5 mains (but not both) can be chosen in $4 + 5 = 9$ ways.

The word that signals each rule is worth hearing: "and then" means multiply; "or, one case or the other" means add.

### Factorials

The number of ways to put $n$ different objects in a row is
$$n! = n \times (n-1) \times \dots \times 2 \times 1,$$
by the product rule: $n$ choices for the first place, $n-1$ for the second, and so on. By convention $0! = 1$. Learn the small values by heart, since there is no calculator on the test: $3! = 6$, $4! = 24$, $5! = 120$, $6! = 720$, $7! = 5040$.

### The two questions

Before you write any formula, answer two questions about the selection of $k$ items from $n$ kinds.

1. **Does order matter?** A president and a secretary are different jobs, so choosing Ada then Ben differs from Ben then Ada: order matters. A two-person committee is the same committee whichever name you say first: order does not matter.
2. **Can an item be chosen more than once?** Digits in a code can repeat; people on a committee cannot.

The answers place you in one cell of this table.

| | No repetition | Repetition allowed |
| --- | --- | --- |
| **Order matters** | $\dfrac{n!}{(n-k)!}$ | $n^k$ |
| **Order does not matter** | $\dbinom{n}{k} = \dfrac{n!}{k!\,(n-k)!}$ | $\dbinom{n+k-1}{k}$ |

### Where the formulas come from

**Ordered, no repetition** (permutations of $k$ out of $n$): $n$ choices for the first place, $n-1$ for the second, down to $n-k+1$ for the $k$-th. Multiply only those $k$ factors; you rarely need the factorial form. Choosing a winner, a runner-up and a third place among 8 finalists gives $8 \times 7 \times 6 = 336$.

**Ordered, with repetition**: each of the $k$ places has all $n$ options, so $n^k$. A three-letter code from the letters A to E, repeats allowed, can be written in $5^3 = 125$ ways.

**Unordered, no repetition** (combinations): count the ordered selections, then divide by the $k!$ orders in which each group was counted. That is why $\binom{n}{k} = \frac{n(n-1)\cdots(n-k+1)}{k!}$. Two facts make the arithmetic short: $\binom{n}{k} = \binom{n}{n-k}$ (choosing who is in is the same as choosing who is out), and $\binom{n}{1} = n$, $\binom{n}{2} = \frac{n(n-1)}{2}$.

**Unordered, with repetition**: picture the $k$ chosen items as stars and the borders between the $n$ kinds as $n-1$ bars. Every selection is one row of $k$ stars and $n-1$ bars, so the count is the number of ways to choose which of the $k + n - 1$ places hold stars: $\binom{n+k-1}{k}$. Buying 2 fruits from apples and pears gives $\binom{3}{2} = 3$: two apples, one of each, two pears.

### Arrangements with identical objects

If some of the $n$ objects in a row are identical, swapping two identical ones creates no new arrangement. Divide $n!$ by the factorial of each group of repeats:
$$\frac{n!}{a!\,b!\,\cdots}$$
The letters of NOON give $\frac{4!}{2!\,2!} = 6$ arrangements, which you can list: NNOO, NONO, NOON, ONNO, ONON, OONN.

### Checking without a calculator

Use a second route whenever you can. A combination should equal the matching permutation divided by $k!$; an arrangement with repeats can be rebuilt by choosing positions group by group; a stars-and-bars answer can be checked on a tiny case you can list. If the two routes disagree, one of them has counted the same thing twice.
`,
  examples: [
    {
      id: 'example-officers-or-committee',
      title: 'Officers or a committee?',
      problemMd: md`A student society has 9 members. (a) In how many ways can it elect a president, a secretary and a treasurer, three different people? (b) In how many ways can it choose a three-person organising committee?`,
      steps: [
        md`(a) The three jobs differ, so order matters and nobody holds two jobs: ordered, no repetition.`,
        md`Product rule: $9$ choices of president, then $8$ of secretary, then $7$ of treasurer: $9 \times 8 \times 7 = 504$.`,
        md`(b) A committee has no roles, so order does not matter. Each committee was counted $3! = 6$ times in part (a), once for each way of handing out the three jobs: $\frac{504}{6} = 84$.`,
        md`Second route for (b): $\binom{9}{3} = \frac{9 \times 8 \times 7}{3 \times 2 \times 1} = 84$. The routes agree.`,
      ],
      answerMd: md`(a) 504 ways; (b) 84 ways. Giving 504 for the committee is the usual slip: it counts the same three people six times.`,
    },
    {
      id: 'example-letters-with-repeats',
      title: 'Arranging letters with repeats',
      problemMd: md`How many different strings can be made by arranging all the letters of the word BALLOON?`,
      steps: [
        md`Count the letters: B, A, L, L, O, O, N is 7 letters, with L twice and O twice.`,
        md`Treat them as different first: $7! = 5040$. Each string is counted $2!$ times for the L's and $2!$ times for the O's, so divide: $\frac{5040}{2 \times 2} = 1260$.`,
        md`Second route, placing letters group by group: choose 2 of the 7 positions for the L's, $\binom{7}{2} = 21$; then 2 of the remaining 5 for the O's, $\binom{5}{2} = 10$; then put B, A, N in the last 3 places in $3! = 6$ ways.`,
        md`$21 \times 10 \times 6 = 1260$. The routes agree.`,
      ],
      answerMd: md`1260 strings. The tempting wrong answer is $7! = 5040$, which treats the two L's and the two O's as different letters.`,
    },
    {
      id: 'example-pastries-with-repetition',
      title: 'A selection with repetition',
      problemMd: md`A bakery sells 4 kinds of pastry and has plenty of each. A customer buys a box of 6 pastries; only how many of each kind matters. How many different boxes are possible?`,
      steps: [
        md`Order does not matter (it is a box) and a kind can be chosen many times: unordered, with repetition, $n = 4$ kinds and $k = 6$ items.`,
        md`Stars and bars: 6 stars for the pastries and $4 - 1 = 3$ bars to split them into the four kinds, so 9 places in a row.`,
        md`Choose which 3 places hold bars: $\binom{9}{3} = \frac{9 \times 8 \times 7}{6} = 84$. This is the same as $\binom{9}{6}$, the formula's $\binom{n+k-1}{k}$.`,
        md`Check the method on a case you can list: 2 kinds and 3 pastries gives $\binom{4}{3} = 4$, and indeed the boxes are $(3,0), (2,1), (1,2), (0,3)$.`,
      ],
      answerMd: md`84 boxes. Answers of $4^6$ (ordered with repetition) or $\binom{6}{4}$ (a misplaced formula) come from skipping the two questions.`,
    },
  ],
  traps: [
    {
      title: 'Using permutations for a group with no roles',
      md: md`A team, a committee, a hand of cards or a set of chosen topics has no order. If you multiply $n(n-1)\cdots$ for such a group, you count every group $k!$ times. Ask "would swapping two chosen items give a different outcome?" If not, divide by $k!$.`,
    },
    {
      title: 'Adding where you should multiply',
      md: md`Stages that happen one after another (a first digit **and then** a second) multiply. Only separate cases that cannot happen together add. "$9 + 8 + 7$ ways to fill three posts" is never right: each choice of president is followed by 8 choices of secretary.`,
    },
    {
      title: 'Forgetting that letters or objects repeat',
      md: md`Before applying $n!$ to an arrangement, scan for identical items. Two identical letters halve the count; three identical letters divide it by 6. Missing a repeat gives an answer that is too large by an exact factor, and a multiple-choice question may well offer that answer.`,
    },
    {
      title: 'Applying $n^k$ when repetition is not allowed',
      md: md`$n^k$ assumes every place can take any of the $n$ options again. People, seats and prizes that go to different winners cannot repeat, so the count falls by one at each stage: $n(n-1)(n-2)\cdots$.`,
    },
  ],
  check: [
    {
      id: 'check-chair-and-deputy',
      title: 'Chair and deputy',
      topic: 'Permutations and combinations',
      stemMd: md`A board of 10 people must choose a chair and a deputy chair, who must be different people. In how many ways can this be done?`,
      options: [
        { id: 'A', text: md`19`, note: md`Adds the 10 choices of chair and the 9 of deputy. The two choices happen one after the other, so they multiply.` },
        { id: 'B', text: md`45`, note: md`This is $\binom{10}{2}$, the number of unordered pairs. Chair and deputy are different roles, so Ada as chair with Ben as deputy differs from the reverse.` },
        { id: 'C', text: md`90`, note: '' },
        { id: 'D', text: md`100`, note: md`This is $10^2$, which lets the same person be both chair and deputy.` },
      ],
      answer: 'C',
      workingMd: md`Order matters (two different roles) and nobody may hold both. There are 10 choices for the chair and then 9 for the deputy, so $10 \times 9 = 90$. Check: the 45 unordered pairs, each with 2 ways to assign the roles, give $45 \times 2 = 90$.`,
      lesson: 'Different roles mean order matters: multiply the shrinking choices and do not divide.',
    },
    {
      id: 'check-rotor',
      title: 'Arranging ROTOR',
      topic: 'Permutations and combinations',
      stemMd: md`How many different strings can be formed by arranging all five letters of the word ROTOR?`,
      options: [
        { id: 'A', text: md`10`, note: md`This is $\binom{5}{2}$, the number of ways to place the two R's only. The O's and the T still have $\binom{3}{2} = 3$ ways to fill the remaining places.` },
        { id: 'B', text: md`30`, note: '' },
        { id: 'C', text: md`60`, note: md`Divides $5!$ by only one $2!$, as if only one letter were repeated. Both R and O appear twice.` },
        { id: 'D', text: md`120`, note: md`This is $5!$, which treats the two R's and the two O's as different letters.` },
      ],
      answer: 'B',
      workingMd: md`ROTOR has 5 letters: R twice, O twice, T once. The count is $\frac{5!}{2!\,2!} = \frac{120}{4} = 30$. Second route: place the R's in $\binom{5}{2} = 10$ ways, the O's in $\binom{3}{2} = 3$ ways, and T in the last place: $10 \times 3 = 30$.`,
      lesson: 'Divide by the factorial of each group of identical letters, and check by placing the groups one at a time.',
    },
    {
      id: 'check-ice-cream-cup',
      title: 'Three scoops from five flavours',
      topic: 'Permutations and combinations',
      stemMd: md`An ice-cream shop offers 5 flavours. A cup holds 3 scoops, the order of the scoops does not matter, and a flavour may be chosen more than once. How many different cups are possible?`,
      options: [
        { id: 'A', text: md`10`, note: md`This is $\binom{5}{3}$, which forbids choosing a flavour twice. The stem allows repeats.` },
        { id: 'B', text: md`35`, note: '' },
        { id: 'C', text: md`60`, note: md`This is $5 \times 4 \times 3$, which treats the scoops as ordered and forbids repeats: wrong on both counts.` },
        { id: 'D', text: md`125`, note: md`This is $5^3$, which allows repeats but counts the order of the scoops, so strawberry then lemon is counted apart from lemon then strawberry.` },
      ],
      answer: 'B',
      workingMd: md`Unordered with repetition: $n = 5$ flavours, $k = 3$ scoops, so $\binom{5 + 3 - 1}{3} = \binom{7}{3} = \frac{7 \times 6 \times 5}{6} = 35$. Check by cases: three different flavours, $\binom{5}{3} = 10$; two scoops of one flavour and one of another, $5 \times 4 = 20$; all three the same, 5. Total $10 + 20 + 5 = 35$.`,
      lesson: 'For an unordered selection with repeats, use stars and bars and check by splitting into cases.',
    },
  ],
  takeaways: [
    'Ask first: does order matter, and can a choice repeat? The answers pick the formula.',
    md`Ordered without repeats: $n(n-1)\cdots(n-k+1)$; with repeats: $n^k$.`,
    md`Unordered without repeats: $\binom{n}{k}$; with repeats: $\binom{n+k-1}{k}$.`,
    md`Identical objects in a row: $\frac{n!}{a!\,b!\cdots}$, dividing by each group of repeats.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-discrete-permutations-combinations' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
