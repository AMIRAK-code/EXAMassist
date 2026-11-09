import { md, type Lesson } from '../../types';

export const ratiosLesson: Lesson = {
  slug: 'ratios-and-proportions',
  title: 'Ratios and proportions',
  summary: 'Turn a ratio into parts with one multiplier, link ratios through a shared term, and solve proportions and changing-ratio problems cleanly.',
  minutes: 20,
  objectives: [
    'Write the quantities in a ratio as multiples of one unknown and find them from a total or a difference.',
    'Tell part-to-part from part-to-whole ratios and convert between them.',
    'Combine two ratios that share a term into one three-way ratio.',
    'Solve proportions, including problems where amounts are added and the ratio changes.',
  ],
  teachMd: md`
### A ratio compares, it does not count

"The ratio of red to blue marbles is $4 : 5$" says that for every 4 red marbles there are 5 blue ones. It does not say there are 4 red marbles. There could be 8 and 10, or 40 and 50. A ratio fixes the **shape** of a group, not its size.

So give the size a name. If red : blue $= 4 : 5$, write

$$\text{red} = 4k, \qquad \text{blue} = 5k$$

for some positive number $k$, the **multiplier**. Every ratio problem becomes a one-unknown equation once you do this. Any one actual figure, whether a total, a difference or one of the parts, pins down $k$.

### Part to part, and part to whole

With red : blue $= 4 : 5$, the whole is $4k + 5k = 9k$. So red marbles are $\frac{4}{9}$ of the total, not $\frac{4}{5}$. The ratio $4 : 5$ is part to part; the fraction $\frac{4}{9}$ is part to whole. Read which one a question gives and which one it asks for. "The ratio of red marbles to all marbles" is $4 : 9$.

### Ratios behave like fractions

A ratio $a : b$ can be written $\frac{a}{b}$ and simplified the same way: $18 : 24 = 3 : 4$. Multiplying or dividing **both** terms by the same number keeps the ratio. Adding the same number to both terms does **not**: $3 : 4$ becomes $4 : 5$ if you add 1 to each, and $\frac{4}{5} \ne \frac{3}{4}$. Adding the same positive amount to both terms always pulls the ratio towards $1 : 1$.

### Three-way ratios through a shared term

If $a : b = 2 : 3$ and $b : c = 4 : 5$, the two ratios mention $b$ with different numbers, 3 and 4. Rescale both so that $b$ gets the same number, their least common multiple, 12:

$$a : b = 8 : 12, \qquad b : c = 12 : 15, \qquad \text{so } a : b : c = 8 : 12 : 15$$

Now $a : c = 8 : 15$. Writing $a : c = 2 : 5$, by simply dropping the middle numbers, is the classic error; it ignores that the two $b$ values were measured on different scales.

### Proportions

A **proportion** says two ratios are equal: $\frac{a}{b} = \frac{c}{d}$. Cross-multiply to solve: $ad = bc$. If 3 kg of flour make 40 loaves, then $x$ kg make 100 loaves where $\frac{3}{40} = \frac{x}{100}$, so $x = 7.5$.

Quantities are **directly proportional** when their ratio is constant: double one and the other doubles ($y = kx$). They are **inversely proportional** when their product is constant: double one and the other halves ($xy = k$). Workers and time to finish a fixed job are the standard inverse pair. Ask before you set up the equation: should the answer go up or down?

### When the ratio changes

Problems where items are added or removed are ratio problems in two stages. Write the "before" quantities with a multiplier, apply the change to the actual amounts, and set the new ratio equal to the "after" ratio. The multiplier belongs to the original group; never apply the change to the ratio numbers themselves.

### Ratios in comparison questions

A ratio on its own never tells you an actual amount. If the only information is "the ratio of $x$ to $y$ is $3 : 4$", then the size of $x$ or of $x + y$ cannot be determined; even which of $x$ and $y$ is larger can flip if negatives are allowed. Ask whether the stem gives a real figure that fixes $k$. If not, look for what the ratio does fix, such as $\frac{x}{y}$ or the fraction of the total.

### A quick check

When you have the parts, divide them back out: they should simplify to the given ratio, and they should add up to any given total. The check takes seconds and catches a misread part-to-whole.
`,
  examples: [
    {
      id: 'example-split-total',
      title: 'Splitting a total',
      problemMd: md`A bag holds 63 marbles, red and blue only, in the ratio red : blue $= 4 : 5$. How many of each colour are there?`,
      steps: [
        md`Name the multiplier: red $= 4k$, blue $= 5k$.`,
        md`The total is $9k = 63$, so $k = 7$.`,
        md`Red $= 28$ and blue $= 35$.`,
        md`Check: $28 + 35 = 63$, and $\frac{28}{35} = \frac{4}{5}$. Second route: red is $\frac{4}{9}$ of 63, which is 28.`,
      ],
      answerMd: md`28 red and 35 blue. Taking red as $\frac{4}{5}$ of 63 (50.4) confuses the part-to-part ratio with a fraction of the whole.`,
    },
    {
      id: 'example-chain-ratios',
      title: 'Linking two ratios',
      problemMd: md`If $a : b = 2 : 3$ and $b : c = 4 : 5$, what is $a : c$?`,
      steps: [
        md`$b$ appears as 3 in one ratio and 4 in the other. Rescale both to give $b$ the value $\operatorname{lcm}(3, 4) = 12$.`,
        md`$a : b = 2 : 3 = 8 : 12$ (multiply by 4), and $b : c = 4 : 5 = 12 : 15$ (multiply by 3).`,
        md`So $a : b : c = 8 : 12 : 15$ and $a : c = 8 : 15$.`,
        md`Check by multiplying fractions: $\frac{a}{c} = \frac{a}{b} \cdot \frac{b}{c} = \frac{2}{3} \cdot \frac{4}{5} = \frac{8}{15}$.`,
      ],
      answerMd: md`$a : c = 8 : 15$. Dropping the middle term, $2 : 5$, is the tempting wrong answer.`,
    },
    {
      id: 'example-changing-ratio',
      title: 'New students join',
      problemMd: md`In a class the ratio of boys to girls is $3 : 5$. Six more boys join, and the ratio becomes $3 : 4$. How many girls are in the class?`,
      steps: [
        md`Before: boys $= 3k$, girls $= 5k$.`,
        md`After: boys $= 3k + 6$, girls still $5k$. Set the new ratio: $\frac{3k + 6}{5k} = \frac{3}{4}$.`,
        md`Cross-multiply: $4(3k + 6) = 15k$, so $12k + 24 = 15k$ and $k = 8$.`,
        md`Girls $= 5 \cdot 8 = 40$. Check: boys go from 24 to 30, and $30 : 40 = 3 : 4$.`,
      ],
      answerMd: md`There are 40 girls. Adding the 6 to the ratio numbers instead of to the actual number of boys, as in $(3 + 6) : 5$, leads nowhere: the change applies to people, not to ratio terms.`,
    },
  ],
  traps: [
    {
      title: 'Part to part read as part to whole',
      md: md`With boys : girls $= 2 : 3$, boys are $\frac{2}{5}$ of the class, not $\frac{2}{3}$. Add the ratio terms to get the whole before you form any fraction of the total.`,
    },
    {
      title: 'Linking ratios without a common term',
      md: md`From $a : b = 2 : 3$ and $b : c = 4 : 5$ you cannot read $a : c = 2 : 5$. Rescale until $b$ has one value in both, or multiply $\frac{a}{b} \cdot \frac{b}{c}$.`,
    },
    {
      title: 'Expecting a ratio to survive addition',
      md: md`Adding the same amount to both terms changes a ratio (unless it is $1 : 1$). Multiplying both by the same amount does not. Ages are the usual test: two people whose ages are in the ratio $1 : 2$ today will not be in that ratio in ten years.`,
    },
    {
      title: 'Reading an amount into a ratio',
      md: md`"$x : y = 3 : 4$" does not mean $x = 3$. In a comparison question with no other figure, an actual size such as $x$ or $y - x$ cannot be determined.`,
    },
  ],
  check: [
    {
      id: 'check-three-way-split',
      title: 'Splitting a fund three ways',
      topic: 'Ratio',
      stemMd: md`A fund is divided among three people in the ratio $2 : 3 : 7$. The largest share is \$1,500 more than the smallest share. What is the total amount of the fund?`,
      options: [
        { id: 'A', text: md`\$600`, note: md`This is the smallest share, $2 \times \$300$, not the whole fund.` },
        { id: 'B', text: md`\$2,100`, note: md`This is the largest share, $7 \times \$300$, not the total.` },
        { id: 'C', text: md`\$3,600`, note: '' },
        { id: 'D', text: md`\$7,500`, note: md`This multiplies \$1,500 by the 5-part difference instead of dividing by it to find one part.` },
        { id: 'E', text: md`\$18,000`, note: md`This treats \$1,500 as the value of one part and multiplies by all 12 parts; \$1,500 is the value of 5 parts.` },
      ],
      answer: 'C',
      workingMd: md`Write the shares as $2k$, $3k$ and $7k$. The difference between the largest and smallest is $7k - 2k = 5k = 1500$, so $k = 300$. The total is $12k = \$3,600$. Check: the shares are \$600, \$900 and \$2,100; they add to \$3,600, and $2100 - 600 = 1500$.`,
      lesson: 'Express every share as a multiple of one unknown, and use the given figure to find that unknown first.',
    },
    {
      id: 'check-add-to-both',
      title: 'Adding 5 to both terms',
      topic: 'Quantitative Comparison',
      stemMd: md`$x$ and $y$ are positive numbers, and the ratio of $x$ to $y$ is $3 : 4$.

| Quantity A | Quantity B |
| --- | --- |
| $\dfrac{x + 5}{y + 5}$ | $\dfrac{3}{4}$ |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: '' },
        { id: 'B', text: md`Quantity B is greater.`, note: md`This assumes that adding to both terms shrinks the ratio. For a ratio below 1, adding the same positive amount moves it up, towards 1.` },
        { id: 'C', text: md`The two quantities are equal.`, note: md`This assumes adding the same number to both terms keeps the ratio; only multiplying both terms does that.` },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`Quantity A does change with $x$, but for every positive $x$ it stays above $\frac{3}{4}$.` },
      ],
      answer: 'A',
      workingMd: md`Write $x = 3k$ and $y = 4k$ with $k > 0$. Compare $\frac{3k + 5}{4k + 5}$ with $\frac{3}{4}$ by cross-multiplying (both denominators are positive): $4(3k + 5) = 12k + 20$ and $3(4k + 5) = 12k + 15$. Since $12k + 20 > 12k + 15$, Quantity A is greater for every $k$. Check: $x = 3$, $y = 4$ gives $\frac{8}{9} \approx 0.89$; $x = 30$, $y = 40$ gives $\frac{35}{45} \approx 0.78$; both exceed 0.75.`,
      lesson: 'Adding the same positive amount to both terms pulls a ratio towards 1.',
    },
    {
      id: 'check-students-to-aides',
      title: 'Students to aides',
      topic: 'Ratio',
      stemMd: md`At a school, the ratio of teachers to classroom aides is $5 : 2$, and the ratio of students to teachers is $12 : 1$. What is the ratio of students to classroom aides?`,
      options: [
        { id: 'A', text: md`$6 : 1$`, note: md`This sets 12 students against 2 aides, as if there were one teacher; the teacher term must first be scaled to 5.` },
        { id: 'B', text: md`$12 : 1$`, note: md`This copies the students-to-teachers ratio and ignores the aides.` },
        { id: 'C', text: md`$24 : 1$`, note: md`This multiplies 12 by the aides' term, 2, instead of combining the ratios through the shared teacher term.` },
        { id: 'D', text: md`$30 : 1$`, note: '' },
        { id: 'E', text: md`$60 : 1$`, note: md`This finds 60 students for 5 teachers but compares them with one aide instead of the two that go with 5 teachers.` },
      ],
      answer: 'D',
      workingMd: md`Make the teacher term match: students : teachers $= 12 : 1 = 60 : 5$, and teachers : aides $= 5 : 2$. So students : teachers : aides $= 60 : 5 : 2$, and students : aides $= 60 : 2 = 30 : 1$. Check by multiplying fractions: $\frac{\text{students}}{\text{aides}} = \frac{12}{1} \cdot \frac{5}{2} = 30$.`,
      lesson: 'To link two ratios, scale them until the shared quantity has the same number in both.',
    },
  ],
  takeaways: [
    md`Write a ratio $a : b$ as $ak$ and $bk$; any one real figure fixes $k$.`,
    md`In $a : b$, the first part is $\frac{a}{a + b}$ of the whole.`,
    'Link two ratios by scaling the shared term to one value.',
    'Multiplying both terms keeps a ratio; adding to both changes it.',
    'A ratio alone never fixes an actual amount.',
  ],
  practice: { examKey: 'gre', domain: 'quant-arithmetic', skill: 'arith-ratio' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
