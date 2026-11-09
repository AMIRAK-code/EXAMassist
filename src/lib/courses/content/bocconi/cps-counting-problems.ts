import { md, type Lesson } from '../../types';

export const countingProblemsLesson: Lesson = {
  slug: 'counting-problems',
  title: 'Counting problems: restrictions, cases and the complement',
  summary: 'Handle restricted positions, people who must sit together or apart, and "at least one" counts by cases or by the complement, checking one with the other.',
  minutes: 22,
  objectives: [
    'Count arrangements with restrictions by filling the restricted places first.',
    'Count objects that must stay together or apart with the block and gap methods.',
    'Count "at least one" selections by the complement and confirm the result by cases.',
  ],
  teachMd: md`
### The plan for any counting problem

A counting problem usually adds one twist to the formulas of [permutations and combinations](/courses/bocconi/permutations-and-combinations): a digit that cannot be zero, two people who refuse to sit next to each other, a team that needs at least one person of some kind. Four tools handle nearly all of these:

1. **Fill the restricted places first**, then the free ones.
2. **Glue objects that must stay together** into one block.
3. **Split into separate cases** and add them (the sum rule).
4. **Count the complement**: everything, minus what you do not want.

Then check with a second tool. Tools 3 and 4 are natural partners: a complement answer can be confirmed by adding the cases, and the other way round.

### Restricted places first

If one position has a condition, deal with it before the others, while the number of choices is still easy to see. To count three-digit numbers with distinct digits, start with the hundreds digit: it cannot be 0, so 9 choices; then the tens digit has 9 (any digit except the one used, and 0 is now allowed); then the units digit has 8. That gives $9 \times 9 \times 8 = 648$. Starting from the units digit would leave you unsure whether 0 was still available for the hundreds place.

### Together: the block method

When two people must sit side by side, tie them into one block. With 6 people in a row and two who must be adjacent, you arrange 5 units (the block and 4 others) in $5! = 120$ ways, and the two inside the block can stand in $2! = 2$ orders: $240$ arrangements. Forgetting the factor $2$ for the inside of the block is the commonest slip.

### Apart: complement or gaps

"Must not be adjacent" is the complement of "must be adjacent": all arrangements minus the adjacent ones. With 6 people that is $720 - 240 = 480$.

The gap method gives the same answer by a second route. Arrange the other 4 people first: $4! = 24$ ways. They leave 5 gaps: one before the first person, three between neighbours and one after the last. Put the two people into 2 different gaps, in order: $5 \times 4 = 20$. Total $24 \times 20 = 480$. Two routes, one answer: you can trust it.

### "At least one": go round the back

"At least one" covers many cases (exactly one, exactly two, and so on), but its complement is a single case: **none**. So
$$\text{at least one} = \text{all} - \text{none}.$$
For a 4-person team from 5 women and 4 men with at least one woman: all teams $\binom{9}{4} = 126$, teams with no woman $\binom{4}{4} = 1$, so $125$.

### The overcounting trap in "at least one"

A tempting shortcut is "choose the one woman who must be there, then choose the rest from everybody": $5 \times \binom{8}{3} = 5 \times 56 = 280$. It is far too big, more than the 126 teams that exist at all. A team with two women is counted twice, once for each woman playing "the required one". Whenever your answer exceeds the total with no restriction, a case has been counted more than once.

### Cases, and when to add

Split by a feature that separates the outcomes cleanly, such as the number of women, the last digit or the first letter. Every outcome must land in exactly one case. Then add. Inside each case, use the product rule.

### Counting digits and numbers

Numbers bring their own restrictions. A leading digit cannot be 0. "Even" fixes the last digit to 0, 2, 4, 6 or 8, and when digits must be distinct, 0 in the last place changes the count for the first place, so even numbers with distinct digits often need two cases: last digit 0, and last digit 2, 4, 6 or 8.

### A sense of size

Before choosing, compare your answer with the total without any restriction. A restricted count must be smaller; a complement must be smaller still when the unwanted case is rare. Rough size checks like these catch most errors on a test where there is no calculator and no going back once you move to the next screen.
`,
  examples: [
    {
      id: 'example-at-least-one-seven',
      title: 'Three-digit numbers with at least one 7',
      problemMd: md`How many whole numbers from 100 to 999 contain the digit 7 at least once?`,
      steps: [
        md`All three-digit numbers: $999 - 100 + 1 = 900$.`,
        md`Complement, no 7 at all: the hundreds digit avoids 0 and 7, so 8 choices; the tens and units digits avoid 7, so 9 choices each. $8 \times 9 \times 9 = 648$.`,
        md`At least one 7: $900 - 648 = 252$.`,
        md`Check by cases on the number of 7s. Exactly one 7: in the hundreds place $1 \times 9 \times 9 = 81$; in the tens place $8 \times 1 \times 9 = 72$; in the units place $8 \times 9 \times 1 = 72$; together 225. Exactly two 7s: hundreds and tens $1 \times 1 \times 9 = 9$, hundreds and units $9$, tens and units $8 \times 1 \times 1 = 8$; together 26. Exactly three: 1. Total $225 + 26 + 1 = 252$.`,
      ],
      answerMd: md`252 numbers. A common wrong answer is $100 + 90 + 90 = 280$: it adds the numbers with a 7 in the hundreds, tens and units places, so 177, 707, 777 and the like are counted more than once.`,
    },
    {
      id: 'example-together-and-apart',
      title: 'Two friends in a row of five',
      problemMd: md`Five people, including Anna and Bruno, sit in a row of five chairs. In how many arrangements are Anna and Bruno next to each other, and in how many are they apart?`,
      steps: [
        md`All arrangements: $5! = 120$.`,
        md`Together: glue Anna and Bruno into one block, leaving 4 units to arrange in $4! = 24$ ways; inside the block they sit in $2$ orders. $24 \times 2 = 48$.`,
        md`Apart, by the complement: $120 - 48 = 72$.`,
        md`Apart, by gaps: seat the other 3 people in $3! = 6$ ways, creating 4 gaps; put Anna and Bruno in 2 different gaps in order, $4 \times 3 = 12$ ways. $6 \times 12 = 72$, as before.`,
      ],
      answerMd: md`48 arrangements with them together, 72 with them apart. Forgetting the factor 2 inside the block gives 24 and then 96, both wrong.`,
    },
    {
      id: 'example-team-with-two-women',
      title: 'A team with at least two women',
      problemMd: md`A team of 4 is chosen from 5 women and 4 men. How many teams contain at least two women?`,
      steps: [
        md`Cases by the number of women. Two women and two men: $\binom{5}{2}\binom{4}{2} = 10 \times 6 = 60$. Three women and one man: $\binom{5}{3}\binom{4}{1} = 10 \times 4 = 40$. Four women: $\binom{5}{4} = 5$.`,
        md`The cases cannot overlap, so add: $60 + 40 + 5 = 105$.`,
        md`Check with the complement. All teams: $\binom{9}{4} = 126$. No woman: $\binom{4}{4} = 1$. Exactly one woman: $5 \times \binom{4}{3} = 20$. So $126 - 1 - 20 = 105$.`,
      ],
      answerMd: md`105 teams. The shortcut "choose two women, then any two others", $10 \times \binom{7}{2} = 210$, double-counts every team with three or four women.`,
    },
    {
      id: 'example-even-numbers-distinct-digits',
      title: 'Even numbers from a set of digits',
      problemMd: md`Using the digits 1, 2, 3, 4, 5, each at most once, how many four-digit even numbers can be formed?`,
      steps: [
        md`Fill the restricted place first: the units digit must be 2 or 4, so 2 choices.`,
        md`The other three places take any of the 4 remaining digits in order: $4 \times 3 \times 2 = 24$.`,
        md`Total $2 \times 24 = 48$.`,
        md`Check by symmetry: all four-digit numbers with distinct digits from the set number $5 \times 4 \times 3 \times 2 = 120$, and each digit is equally likely to end up in the units place, so $\frac{2}{5}$ of them end in 2 or 4: $\frac{2}{5} \times 120 = 48$.`,
      ],
      answerMd: md`48 numbers. Starting from the thousands digit ($5 \times 4 \times 3 \times \dots$) makes the number of even choices left for the last place depend on what was used, which is where errors creep in.`,
    },
  ],
  traps: [
    {
      title: 'Choosing "the required one" first',
      md: md`For "at least one woman", choosing one woman and then any others counts a team with $w$ women $w$ times. Use the complement (all minus none) or split into exact cases. If your count is larger than the unrestricted total, you have fallen into this trap.`,
    },
    {
      title: 'Forgetting the order inside a block',
      md: md`Gluing two people together makes one unit for the outer arrangement, but the two still have $2!$ orders inside (three people glued together have $3! = 6$). Multiply by it every time.`,
    },
    {
      title: 'Letting 0 lead a number',
      md: md`A four-digit number cannot start with 0. Fill the leading place first, or count all strings and subtract those that begin with 0. When digits must be distinct and the number must be even, split on whether the last digit is 0.`,
    },
    {
      title: 'Cases that overlap',
      md: md`Cases may only be added if every outcome lands in exactly one of them. "Contains a 7 in the tens place" and "contains a 7 in the units place" overlap (77 counts in both), so adding them overcounts. Split on something exact, such as the number of 7s.`,
    },
  ],
  check: [
    {
      id: 'check-repeated-digit-codes',
      title: 'Codes with a repeated digit',
      topic: 'Counting problems',
      stemMd: md`A lock code is a string of three digits from 0 to 9 (codes such as 007 are allowed). How many codes contain at least one digit more than once?`,
      options: [
        { id: 'A', text: md`270`, note: md`Counts codes with exactly two equal digits ($3 \times 10 \times 9$) but leaves out the 10 codes whose three digits are all equal.` },
        { id: 'B', text: md`280`, note: '' },
        { id: 'C', text: md`300`, note: md`Adds the three cases "first two equal", "first and last equal", "last two equal", 100 each, without removing overlaps: a code like 444 is counted three times.` },
        { id: 'D', text: md`720`, note: md`This is the number of codes with three different digits, the complement of what was asked.` },
      ],
      answer: 'B',
      workingMd: md`All codes: $10^3 = 1000$. Codes with three different digits: $10 \times 9 \times 8 = 720$. At least one repeat: $1000 - 720 = 280$. Check by cases: exactly two equal digits, choose the pair of places (3 ways), the repeated digit (10) and the other digit (9): 270; all three equal: 10. Total 280.`,
      lesson: 'For "at least one repeat", subtract the all-different count from the total, then confirm with exact cases.',
    },
    {
      id: 'check-books-apart',
      title: 'Two books apart',
      topic: 'Counting problems',
      stemMd: md`Six different books are placed in a row on a shelf. In how many arrangements are two particular books, an atlas and a dictionary, not next to each other?`,
      options: [
        { id: 'A', text: md`240`, note: md`This is the number of arrangements in which the two books **are** together: $5! \times 2$.` },
        { id: 'B', text: md`360`, note: md`Half of $6! = 720$, as if "together" and "apart" were equally likely. They are not: there are 240 together and 480 apart.` },
        { id: 'C', text: md`480`, note: '' },
        { id: 'D', text: md`600`, note: md`Subtracts only $5! = 120$ for the together case, forgetting that the glued books can stand in two orders.` },
      ],
      answer: 'C',
      workingMd: md`All arrangements: $6! = 720$. Together: a block plus 4 books is 5 units, $5! = 120$ ways, times 2 orders inside the block, so 240. Apart: $720 - 240 = 480$. Check with gaps: arrange the other 4 books in $24$ ways, leaving 5 gaps; place the atlas and the dictionary in 2 different gaps in $5 \times 4 = 20$ ways; $24 \times 20 = 480$.`,
      lesson: 'Count "apart" as all minus together, and confirm with the gap method.',
    },
    {
      id: 'check-at-least-one-law-student',
      title: 'At least one law student',
      topic: 'Counting problems',
      stemMd: md`A team of 3 is chosen from 6 economics students and 4 law students. How many teams include at least one law student?`,
      options: [
        { id: 'A', text: md`20`, note: md`This is $\binom{6}{3}$, the number of teams with **no** law student: the complement, not the answer.` },
        { id: 'B', text: md`60`, note: md`Counts only the teams with exactly one law student, $4 \times \binom{6}{2}$; teams with two or three law students also qualify.` },
        { id: 'C', text: md`100`, note: '' },
        { id: 'D', text: md`144`, note: md`Chooses "the" law student first and then any 2 of the other 9, $4 \times 36$. A team with two or three law students is counted two or three times.` },
      ],
      answer: 'C',
      workingMd: md`All teams: $\binom{10}{3} = 120$. Teams with no law student: $\binom{6}{3} = 20$. At least one: $120 - 20 = 100$. Check by cases: one law student $4 \times 15 = 60$, two $\binom{4}{2} \times 6 = 36$, three $\binom{4}{3} = 4$; total $100$.`,
      lesson: 'At least one equals all minus none; a larger answer than the unrestricted total signals double counting.',
    },
  ],
  takeaways: [
    'Fill the restricted places first, then the free ones.',
    'Together: glue into a block and multiply by the orders inside it. Apart: all minus together, or the gap method.',
    'At least one equals all minus none; never choose "the required one" and then the rest.',
    'Add cases only when every outcome falls in exactly one of them, and check by a second route.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-discrete-counting' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
