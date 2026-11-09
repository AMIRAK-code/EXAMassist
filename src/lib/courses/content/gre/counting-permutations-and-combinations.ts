import { md, type Lesson } from '../../types';

export const countingLesson: Lesson = {
  slug: 'counting-permutations-and-combinations',
  title: 'Counting: permutations, combinations and Venn diagrams',
  summary: 'Count arrangements and selections with the multiplication principle, decide when order matters, handle restrictions, and count overlapping groups.',
  minutes: 22,
  objectives: [
    'Use the multiplication principle to count outcomes of a process done in stages.',
    'Decide whether order matters, and use permutations or combinations accordingly.',
    'Handle restrictions such as fixed positions or items that must stay together.',
    'Count overlapping groups with a Venn diagram and inclusion–exclusion.',
  ],
  teachMd: md`
### The multiplication principle

Almost every counting question reduces to one idea. If a task is done in stages, with $a$ ways to do the first stage and, for each of those, $b$ ways to do the second, then the whole task can be done in $a \times b$ ways. The rule extends to any number of stages.

A café offers 4 sandwiches, 3 drinks and 2 desserts. A meal of one of each can be chosen in $4 \times 3 \times 2 = 24$ ways. Draw one slot per stage, write the number of choices in each slot, and multiply.

Use **addition** instead when the cases are alternatives that cannot happen together: if a meal is either a sandwich (4 options) or a salad (3 options), there are $4 + 3 = 7$ choices. "And" between stages multiplies; "or" between separate cases adds.

### Factorials and arranging everything

The number of ways to arrange $n$ different objects in a row is

$$n! = n \times (n-1) \times \cdots \times 2 \times 1,$$

because there are $n$ choices for the first place, $n - 1$ for the second, and so on. By definition $0! = 1$. Factorials grow fast: $5! = 120$, $6! = 720$, $8! = 40\,320$.

### Permutations: order matters

When you choose $r$ objects from $n$ **and the order matters** (first, second and third prize; a president and a treasurer; a code), the count is

$$P(n, r) = n \times (n-1) \times \cdots \times (n - r + 1) = \frac{n!}{(n-r)!}.$$

Choosing a gold, silver and bronze winner from 10 runners: $10 \times 9 \times 8 = 720$ ways. In practice you rarely need the formula: fill the slots and multiply.

### Combinations: order does not matter

When you choose a **group**, where swapping members gives the same group (a committee, a hand of cards, a set of toppings), each group of $r$ has been counted $r!$ times by the slot method. Divide that out:

$$\binom{n}{r} = \frac{n!}{r!\,(n-r)!}.$$

Choosing 3 runners to advance from 10: $\frac{720}{3!} = \frac{720}{6} = 120$ groups. Two facts save time: $\binom{n}{r} = \binom{n}{n-r}$, because choosing who is in is the same as choosing who is out, and $\binom{n}{1} = n$, $\binom{n}{n} = 1$.

**The test for order:** swap two of the chosen items. If the outcome is different (different roles, positions or sequence), order matters. If it is the same, it does not.

### Restrictions

- **Fill restricted places first.** If a code must start with a vowel, count the first slot's choices before the others.
- **Items that must stay together:** glue them into one block, arrange the block with the other items, then multiply by the number of orders inside the block.
- **Items that must stay apart:** count all arrangements and subtract those where they are together.
- **"At least one":** count everything and subtract the outcomes with none.
- **Identical items:** arranging $n$ objects where $a$ are identical to each other and $b$ are identical to each other gives $\frac{n!}{a!\,b!}$ arrangements, since swapping identical items changes nothing.

### Groups that overlap: Venn diagrams

When people or objects can belong to two groups at once, adding the two group sizes counts the overlap twice. Correct for it once:

$$n(A \cup B) = n(A) + n(B) - n(A \cap B)$$

Here $n(\cdot)$ means "the number in". Everyone not in either group is $\text{total} - n(A \cup B)$. Drawing two overlapping circles and filling in the **overlap first**, then "A only" and "B only", then "neither", turns most of these questions into subtraction.

| Region | How to get it |
| --- | --- |
| both | given, or $n(A) + n(B) - n(A \cup B)$ |
| A only | $n(A) - \text{both}$ |
| B only | $n(B) - \text{both}$ |
| neither | $\text{total} - n(A \cup B)$ |

### Checking an answer

Counting answers are hard to check by recomputing the same way, so look for a second route: count the complement, or try a smaller version you can list by hand. With 4 people choosing 2, there are $\binom{4}{2} = 6$ pairs, and you can write all six down.
`,
  examples: [
    {
      id: 'example-vowel-code',
      title: 'A code with a restricted first place',
      problemMd: md`A code is made of 3 different letters chosen from A, B, C, D, E and F, and the first letter must be a vowel. How many codes are possible?`,
      steps: [
        md`Order matters (ABC and BAC are different codes), so fill slots.`,
        md`Fill the restricted slot first: the vowels available are A and E, so the first place has 2 choices.`,
        md`The second place can be any of the 5 letters not yet used, and the third any of the remaining 4.`,
        md`Multiply: $2 \times 5 \times 4 = 40$.`,
      ],
      answerMd: md`There are 40 codes. Starting with $6 \times 5 \times 4 = 120$ and then trying to adjust is where errors creep in; filling the restricted place first avoids it. (Check: by symmetry, a third of all 120 codes start with one of the 2 vowels out of 6 letters, and $\frac{120}{3} = 40$.)`,
    },
    {
      id: 'example-mixed-committee',
      title: 'A committee drawn from two groups',
      problemMd: md`A committee of 3 teachers and 2 parents is to be chosen from 7 teachers and 5 parents. How many different committees are possible?`,
      steps: [
        md`Order does not matter inside a committee, so use combinations.`,
        md`Teachers: $\binom{7}{3} = \frac{7 \times 6 \times 5}{3 \times 2 \times 1} = 35$ ways.`,
        md`Parents: $\binom{5}{2} = \frac{5 \times 4}{2 \times 1} = 10$ ways.`,
        md`The two choices are made together (teachers **and** parents), so multiply: $35 \times 10 = 350$.`,
      ],
      answerMd: md`350 committees. The tempting $\binom{12}{5} = 792$ counts every group of 5 from all 12 people, including groups with the wrong mix of teachers and parents.`,
    },
    {
      id: 'example-books-together',
      title: 'Two items that must stay together',
      problemMd: md`Five different books are placed in a row on a shelf. In how many arrangements are two particular books, a dictionary and an atlas, next to each other? In how many are they apart?`,
      steps: [
        md`Glue the dictionary and atlas into one block. Now there are 4 items to arrange: the block and the other 3 books, in $4! = 24$ ways.`,
        md`Inside the block the two books can be in either order: $2! = 2$ ways.`,
        md`Together: $24 \times 2 = 48$ arrangements.`,
        md`All arrangements: $5! = 120$. Apart: $120 - 48 = 72$.`,
      ],
      answerMd: md`48 arrangements with the two books together and 72 with them apart. Forgetting the factor of 2 for the order inside the block gives 24, the usual wrong answer.`,
    },
    {
      id: 'example-language-venn',
      title: 'Counting with two overlapping groups',
      problemMd: md`Of 60 students, 34 study French, 25 study Spanish and 9 study both. How many study neither language, and how many study French only?`,
      steps: [
        md`Students in at least one language: $34 + 25 - 9 = 50$. The 9 are subtracted once because they were counted in both groups.`,
        md`Neither: $60 - 50 = 10$.`,
        md`French only: $34 - 9 = 25$. As a check, Spanish only is $25 - 9 = 16$, and $25 + 9 + 16 + 10 = 60$.`,
      ],
      answerMd: md`10 students study neither language and 25 study French only. Adding $34 + 25 = 59$ without removing the overlap would give just 1 student studying neither.`,
    },
  ],
  traps: [
    {
      title: 'Using permutations for a group',
      md: md`Committees, teams, hands and sets do not care about order. If you filled slots for a group, you counted each group $r!$ times; divide by $r!$. Ask: does swapping two members change anything?`,
    },
    {
      title: 'Adding when you should multiply',
      md: md`Choices made one after another, or together, multiply. Addition is only for separate cases that cannot both happen. "3 teachers and 2 parents" multiplies the two counts.`,
    },
    {
      title: 'Forgetting arrangements inside a block',
      md: md`When items must stay together, the block itself can be ordered in several ways. Multiply by the number of internal orders, $2!$ for two items, $3!$ for three.`,
    },
    {
      title: 'Counting the overlap twice',
      md: md`Group sizes in a Venn question include the overlap. Add the groups, subtract the overlap once, and only then subtract from the total to get "neither".`,
    },
  ],
  check: [
    {
      id: 'check-club-officers',
      title: 'Three different posts',
      topic: 'Data Analysis: counting methods',
      stemMd: md`A club has 9 members. A president, a secretary and a treasurer are to be chosen from the members, and no member may hold more than one post. In how many different ways can the three posts be filled?`,
      options: [
        { id: 'A', text: md`27`, note: md`This multiplies the 9 members by the 3 posts. The choices for the posts must be multiplied together, and they shrink as members are used up.` },
        { id: 'B', text: md`84`, note: md`This is $\binom{9}{3}$, the number of groups of three. The posts are different, so the order in which people are assigned matters.` },
        { id: 'C', text: md`504`, note: '' },
        { id: 'D', text: md`729`, note: md`This is $9^3$, which lets one member hold two or three posts.` },
        { id: 'E', text: md`3,024`, note: md`This multiplies four factors, $9 \times 8 \times 7 \times 6$, as if there were four posts.` },
      ],
      answer: 'C',
      workingMd: md`There are 9 choices for president, then 8 for secretary from the remaining members, then 7 for treasurer: $9 \times 8 \times 7 = 504$. Equivalently, each of the $\binom{9}{3} = 84$ groups of three can be assigned to the three posts in $3! = 6$ ways, and $84 \times 6 = 504$.`,
      lesson: 'Distinct roles make order matter: fill the slots and multiply.',
    },
    {
      id: 'check-groups-of-three-and-five',
      title: 'Choosing in or choosing out',
      topic: 'Quantitative Comparison',
      stemMd: md`A coach is choosing players from a squad of 8.

| Quantity A | Quantity B |
| --- | --- |
| The number of different groups of 3 players that can be chosen | The number of different groups of 5 players that can be chosen |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: md`This assumes smaller groups are more numerous; for 8 players, groups of 3 and of 5 come in matching pairs.` },
        { id: 'B', text: md`Quantity B is greater.`, note: md`This assumes more players chosen means more possible groups. Choosing 5 to play is the same as choosing the 3 who sit out.` },
        { id: 'C', text: md`The two quantities are equal.`, note: '' },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`The squad size and both group sizes are fixed, so both counts are definite numbers.` },
      ],
      answer: 'C',
      workingMd: md`Every group of 3 chosen leaves a group of 5 behind, and the other way round, so the counts match: $\binom{8}{3} = \binom{8}{5}$. Directly, $\binom{8}{3} = \frac{8 \times 7 \times 6}{3 \times 2 \times 1} = 56$ and $\binom{8}{5} = \frac{8 \times 7 \times 6 \times 5 \times 4}{5 \times 4 \times 3 \times 2 \times 1} = 56$.`,
      lesson: 'Choosing $r$ from $n$ gives as many groups as choosing the $n - r$ left out.',
    },
    {
      id: 'check-pets-venn',
      title: 'Both, from neither',
      topic: 'Data Analysis: counting methods',
      stemMd: md`In a survey of 120 households, 52 own a dog, 48 own a cat and 27 own neither a dog nor a cat. How many of the households own both a dog and a cat?`,
      options: [
        { id: 'A', text: md`7`, note: '' },
        { id: 'B', text: md`27`, note: md`27 is the number of households that own neither pet, given in the question, not the number that own both.` },
        { id: 'C', text: md`45`, note: md`45 is the number that own a dog but no cat ($52 - 7$), one step past the question.` },
        { id: 'D', text: md`93`, note: md`93 is the number of households that own at least one of the two pets, $120 - 27$.` },
        { id: 'E', text: md`100`, note: md`$52 + 48 = 100$ counts the households owning both pets twice; it is not a number of households.` },
      ],
      answer: 'A',
      workingMd: md`Households owning at least one pet: $120 - 27 = 93$. By inclusion–exclusion, $93 = 52 + 48 - \text{both}$, so both $= 100 - 93 = 7$. Check: dog only 45, cat only 41, both 7, neither 27, and $45 + 41 + 7 + 27 = 120$.`,
      lesson: 'Get the union from the total and "neither", then let inclusion–exclusion give the overlap.',
    },
  ],
  takeaways: [
    'Stages done together multiply; separate alternatives add.',
    'If swapping two chosen items changes the outcome, order matters: fill slots. If not, divide by $r!$.',
    'Fill restricted places first; glue items that must stay together and multiply by their internal orders.',
    md`$n(A \cup B) = n(A) + n(B) - n(A \cap B)$; "neither" is the total minus the union.`,
  ],
  practice: { examKey: 'gre', domain: 'quant-data-analysis', skill: 'data-counting-methods' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
