import { md, type Lesson } from '../../types';

export const fractionsRatiosAndProportionsLesson: Lesson = {
  slug: 'fractions-ratios-and-proportions',
  title: 'Fractions, ratios and proportions',
  summary: 'Handle fractions by hand, split totals in a ratio, link two ratios through a shared term, and tell direct from inverse proportion.',
  minutes: 20,
  objectives: [
    'Add, multiply, divide and compare fractions quickly without a calculator.',
    'Split a total in a given ratio and solve ratio problems with a single multiplier.',
    'Combine two ratios that share a term, and recognise direct and inverse proportion.',
  ],
  teachMd: md`
### Fractions by hand

Without a calculator, fractions are usually faster than decimals, because they let you cancel before you multiply.

- **Add or subtract** over a common denominator: $\frac{2}{3} + \frac{3}{4} = \frac{8}{12} + \frac{9}{12} = \frac{17}{12}$.
- **Multiply** tops and bottoms, cancelling first: $\frac{14}{15} \times \frac{25}{28} = \frac{1}{3} \times \frac{5}{2} = \frac{5}{6}$, after cancelling 14 with 28 and 25 with 15.
- **Divide** by multiplying by the reciprocal: $\frac{3}{4} \div \frac{9}{10} = \frac{3}{4} \times \frac{10}{9} = \frac{30}{36} = \frac{5}{6}$.

To **compare** two fractions, cross-multiply: $\frac{a}{b} > \frac{c}{d}$ (with positive denominators) exactly when $ad > bc$. Is $\frac{7}{12}$ or $\frac{11}{19}$ larger? $7 \times 19 = 133$ and $11 \times 12 = 132$, so $\frac{7}{12}$ is larger, by a hair. Benchmarks help too: a fraction whose top is more than half its bottom is above $\frac{1}{2}$.

A few decimal equivalents are worth knowing by heart: $\frac{1}{8} = 0.125$, $\frac{1}{6} \approx 0.167$, $\frac{1}{5} = 0.2$, $\frac{1}{4} = 0.25$, $\frac{1}{3} \approx 0.333$, $\frac{3}{8} = 0.375$.

### A ratio is a recipe

A ratio $3 : 5$ of orange to apple juice says nothing about amounts; it says that for every 3 parts of orange there are 5 parts of apple. The whole has $3 + 5 = 8$ parts, so orange is $\frac{3}{8}$ of the blend and apple $\frac{5}{8}$. Keep the two readings apart:

| Reading | From $3 : 5$ |
| --- | --- |
| part to part | orange is $\frac{3}{5}$ of the apple |
| part to whole | orange is $\frac{3}{8}$ of the blend |

### The multiplier method

Most ratio problems become one equation if you call the size of one part $k$. With orange to apple $3 : 5$, the amounts are $3k$ and $5k$. Whatever the question tells you (the total, the difference, one of the amounts, or what happens after a change) becomes an equation in $k$. For example, if the total is 24 litres, $8k = 24$, so $k = 3$ and there are 9 litres of orange.

The method shines when a ratio changes. If boys and girls are in the ratio $5 : 3$ and 6 girls join to make it $5 : 4$, write boys $= 5k$, girls $= 3k$, and translate the new ratio: $\frac{5k}{3k + 6} = \frac{5}{4}$. Cross-multiplying gives $20k = 15k + 30$, so $k = 6$: 30 boys, and 18 girls who become 24. Check: $30 : 24 = 5 : 4$.

### Linking two ratios

Given $a : b = 3 : 4$ and $b : c = 6 : 5$, you cannot read off $a : c$ directly, because the two $b$ values are on different scales. Rescale both ratios so that $b$ has the same number: the LCM of 4 and 6 is 12, so $a : b = 9 : 12$ and $b : c = 12 : 10$. Now $a : b : c = 9 : 12 : 10$, and $a : c = 9 : 10$. Equivalently, $\frac{a}{c} = \frac{a}{b} \times \frac{b}{c} = \frac{3}{4} \times \frac{6}{5} = \frac{18}{20} = \frac{9}{10}$.

### Direct and inverse proportion

Two quantities are **directly proportional** when their ratio is constant, $y = kx$: double one and the other doubles. Price and quantity at a fixed unit price behave this way. They are **inversely proportional** when their product is constant, $xy = k$: double one and the other halves. Speed and time over a fixed distance behave this way, as do workers and days for a fixed job.

Before you set up a proportion, ask which kind it is: "more of this means more of that" or "more of this means less of that". Then use a ratio for the first and a product for the second. If 4 identical printers finish a job in 9 hours, then the job is $4 \times 9 = 36$ printer-hours, so 6 printers take $\frac{36}{6} = 6$ hours, not $\frac{6}{4} \times 9 = 13.5$.

### Additive changes break ratios

Adding the same amount to both terms of a ratio changes it: $1 : 2$ becomes $3 : 4$ after adding 2 to each. Only multiplying both terms by the same number leaves a ratio unchanged. This is why "the ratio after a change" questions need the multiplier method rather than guesswork.
`,
  examples: [
    {
      id: 'example-split-in-ratio',
      title: 'Splitting a profit three ways',
      problemMd: md`A profit of €7,200 is shared among three partners in the ratio $2 : 3 : 4$. How much does each receive?`,
      steps: [
        md`Count the parts: $2 + 3 + 4 = 9$.`,
        md`One part is worth $\frac{7200}{9} = 800$ euros.`,
        md`Multiply: $2 \times 800 = 1600$, $3 \times 800 = 2400$ and $4 \times 800 = 3200$.`,
        md`Check the shares add back to the total: $1600 + 2400 + 3200 = 7200$.`,
      ],
      answerMd: md`The partners receive €1,600, €2,400 and €3,200. Dividing the total by 3, the number of partners, ignores the ratio.`,
    },
    {
      id: 'example-link-ratios',
      title: 'Joining two ratios through a shared term',
      problemMd: md`In a club, the ratio of juniors to adults is $3 : 4$ and the ratio of adults to seniors is $6 : 5$. What is the ratio of juniors to seniors?`,
      steps: [
        md`Adults appear in both ratios, as 4 parts and as 6 parts. Rescale so adults have the same number of parts: the LCM of 4 and 6 is 12.`,
        md`Juniors : adults $= 3 : 4 = 9 : 12$, and adults : seniors $= 6 : 5 = 12 : 10$.`,
        md`So juniors : adults : seniors $= 9 : 12 : 10$, and juniors : seniors $= 9 : 10$.`,
        md`Second route: $\frac{\text{juniors}}{\text{seniors}} = \frac{3}{4} \times \frac{6}{5} = \frac{18}{20} = \frac{9}{10}$.`,
      ],
      answerMd: md`Juniors to seniors is $9 : 10$. Reading the outer numbers of the two ratios, $3 : 5$, is the tempting error; it treats the 4 and the 6 as if they were the same number of adults.`,
    },
    {
      id: 'example-ratio-after-change',
      title: 'A ratio that changes',
      problemMd: md`A class has boys and girls in the ratio $5 : 3$. After 6 more girls join, the ratio becomes $5 : 4$. How many boys are there?`,
      steps: [
        md`Call one part $k$: boys $= 5k$, girls $= 3k$. The number of boys does not change.`,
        md`After the change: $\frac{5k}{3k + 6} = \frac{5}{4}$.`,
        md`Cross-multiply: $20k = 15k + 30$, so $5k = 30$ and $k = 6$.`,
        md`Boys $= 30$, girls $= 18$, becoming 24. Check: $30 : 24 = 5 : 4$.`,
      ],
      answerMd: md`There are 30 boys. A tempting shortcut is "the girls' share rose by 1 part, and that part is 6 people", which happens to work here only because the boys' term stayed at 5 in both ratios; when the unchanged term differs between the two ratios, the shortcut fails.`,
    },
  ],
  traps: [
    {
      title: 'Part-to-part read as part-to-whole',
      md: md`In a $3 : 5$ mixture, the first ingredient is $\frac{3}{8}$ of the whole, not $\frac{3}{5}$. Add the terms to get the whole before you take a fraction of a total.`,
    },
    {
      title: 'Linking ratios without a common term',
      md: md`From $a : b = 3 : 4$ and $b : c = 6 : 5$, the answer is not $3 : 5$. Rescale until the shared quantity has the same number in both ratios, or multiply the fractions $\frac{a}{b} \times \frac{b}{c}$.`,
    },
    {
      title: 'Using direct proportion where it is inverse',
      md: md`More workers means fewer days, so workers and days multiply to a constant. Scaling the days up with the workers gives an answer that moves in the wrong direction; a quick "should this be bigger or smaller?" catches it.`,
    },
    {
      title: 'Adding to both terms and expecting the same ratio',
      md: md`Adding 10 to both terms of $2 : 3$ gives $12 : 13$, a different ratio. Only multiplying both terms keeps a ratio; any added amount must go through the multiplier method.`,
    },
  ],
  check: [
    {
      id: 'check-juice-blend',
      title: 'Orange in the blend',
      topic: 'Quantitative reasoning: ratios',
      stemMd: md`A juice blend mixes orange juice and apple juice in the ratio $3 : 5$. How many litres of orange juice are in 24 litres of the blend?`,
      options: [
        { id: 'A', text: md`8`, note: md`Divides 24 by 3, the orange term, as if the orange term were the number of parts in the whole.` },
        { id: 'B', text: md`9`, note: '' },
        { id: 'C', text: md`14.4`, note: md`Takes $\frac{3}{5}$ of 24, reading the part-to-part ratio as a fraction of the whole blend.` },
        { id: 'D', text: md`15`, note: md`This is the apple juice, $\frac{5}{8}$ of 24, not the orange juice.` },
      ],
      answer: 'B',
      workingMd: md`The blend has $3 + 5 = 8$ parts, so one part is $\frac{24}{8} = 3$ litres. Orange is $3 \times 3 = 9$ litres and apple $5 \times 3 = 15$ litres, which add to 24.`,
      lesson: 'Add the terms of a ratio to find the whole before taking a share of a total.',
    },
    {
      id: 'check-link-ratios',
      title: 'Two ratios, one answer',
      topic: 'Quantitative reasoning: ratios',
      stemMd: md`If $x : y = 2 : 3$ and $y : z = 4 : 5$, what is $x : z$?`,
      options: [
        { id: 'A', text: md`$2 : 5$`, note: md`Takes the outer numbers of the two ratios, but $y$ is 3 parts in one and 4 parts in the other, so they are on different scales.` },
        { id: 'B', text: md`$3 : 4$`, note: md`Adds the terms, $(2 + 4) : (3 + 5)$; ratios combine by multiplying, not adding.` },
        { id: 'C', text: md`$5 : 6$`, note: md`Divides $\frac{2}{3}$ by $\frac{4}{5}$ instead of multiplying; $\frac{x}{y} \times \frac{y}{z}$ is what cancels $y$.` },
        { id: 'D', text: md`$8 : 15$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Make $y$ the same in both: $x : y = 8 : 12$ and $y : z = 12 : 15$, so $x : y : z = 8 : 12 : 15$ and $x : z = 8 : 15$. Check: $\frac{x}{z} = \frac{2}{3} \times \frac{4}{5} = \frac{8}{15}$.`,
      lesson: 'Rescale ratios until the shared quantity matches, or multiply the fractions so it cancels.',
    },
    {
      id: 'check-counters-change',
      title: 'Adding red counters',
      topic: 'Quantitative reasoning: ratios',
      stemMd: md`A bag holds red and blue counters in the ratio $4 : 7$. After 10 red counters are added, the ratio becomes $6 : 7$. How many counters were in the bag at first?`,
      options: [
        { id: 'A', text: md`20`, note: md`This is the number of red counters at first, not the total.` },
        { id: 'B', text: md`35`, note: md`This is the number of blue counters, which does not change; the question asks for the total.` },
        { id: 'C', text: md`55`, note: '' },
        { id: 'D', text: md`65`, note: md`This is the total after the 10 red counters were added; the question asks for the bag at first.` },
      ],
      answer: 'C',
      workingMd: md`Let red $= 4k$ and blue $= 7k$. Then $\frac{4k + 10}{7k} = \frac{6}{7}$, so $28k + 70 = 42k$, giving $14k = 70$ and $k = 5$. At first there are $20$ red and $35$ blue, $55$ in all. Check: $30 : 35 = 6 : 7$.`,
      lesson: 'Name one part k, write every amount in terms of k, and turn the changed ratio into one equation.',
    },
  ],
  takeaways: [
    md`Compare $\frac{a}{b}$ and $\frac{c}{d}$ by comparing $ad$ with $bc$.`,
    'In a ratio, add the terms to find the whole; each share is its term over that sum.',
    'Call one part k and every ratio problem becomes one equation.',
    'Link two ratios by rescaling the shared term to the same number.',
    'Direct proportion keeps a ratio constant; inverse proportion keeps a product constant.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-numbers-percentages' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
