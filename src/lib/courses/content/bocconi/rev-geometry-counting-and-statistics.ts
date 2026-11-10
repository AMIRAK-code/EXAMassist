import { md, type Lesson } from '../../types';

/**
 * Quick revision: geometry, counting, probability and statistics. Adapted
 * from the site owners' revision deck (slides 14–20), with every number
 * re-derived. Exam facts are from docs/research/course-facts-2026-11-04.md.
 */
export const revisionGeometryCountingAndStatisticsLesson: Lesson = {
  slug: 'revision-geometry-counting-and-statistics',
  title: 'Revision: geometry, counting, probability and statistics',
  summary: 'Lines, circles, parabolas, areas and volumes, the counting matrix, probability rules, averages and compound percentages on one sheet, with drills.',
  minutes: 30,
  objectives: [
    'Recall the line, circle and parabola formulas and read centres, radii and vertices from equations.',
    'Choose between permutations, arrangements with repeats and combinations by asking whether order matters.',
    'Use inclusion–exclusion and the complement rule for "or" and "at least one" probabilities.',
    'Work averages through totals and chain percentage changes as multipliers.',
  ],
  teachMd: md`
### How to use this sheet

These formulas come up across the mathematics questions, and without a calculator the fastest route is usually the formula plus a quick sanity check. Read each block, cover it, and say it back; then do the drills below without looking.

### Lines in the plane

For points $(x_1, y_1)$ and $(x_2, y_2)$:

| Quantity | Formula |
| --- | --- |
| Distance | $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$ |
| Midpoint | $M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)$ |
| Slope | $m = \frac{y_2 - y_1}{x_2 - x_1}$ (for $x_1 \neq x_2$) |
| Line through a point with slope $m$ | $y - y_1 = m(x - x_1)$ |
| Parallel lines | $m_1 = m_2$ |
| Perpendicular lines (neither vertical) | $m_1 m_2 = -1$ |
| Distance from $(x_0, y_0)$ to $ax + by + c = 0$ | $\frac{\lvert ax_0 + by_0 + c \rvert}{\sqrt{a^2 + b^2}}$ |

The line through $A(1, 2)$ and $B(3, 8)$ has slope $\frac{8 - 2}{3 - 1} = 3$, so $y - 2 = 3(x - 1)$, that is $y = 3x - 1$; both points satisfy it. The distance from $(1, 2)$ to $3x + 4y - 1 = 0$ is $\frac{\lvert 3 + 8 - 1 \rvert}{5} = 2$. A line written as $ax + by + c = 0$ has slope $-\frac{a}{b}$ when $b \neq 0$.

### Circles

A circle with centre $(h, k)$ and radius $r$ is $(x - h)^2 + (y - k)^2 = r^2$. In the expanded form $x^2 + y^2 + ax + by + c = 0$:

$$\text{centre} = \left(-\frac{a}{2}, -\frac{b}{2}\right) \qquad r^2 = \frac{a^2}{4} + \frac{b^2}{4} - c$$

It is a real circle only if $r^2 > 0$, and only if $x^2$ and $y^2$ have equal coefficients and there is no $xy$ term. Completing the square gives the same results when you forget the formulas.

### Parabolas

For $y = ax^2 + bx + c$ with $a \neq 0$, the vertex has $x_V = -\frac{b}{2a}$; substitute it to get $y_V$. The axis of symmetry is the vertical line $x = x_V$. The parabola opens upwards if $a > 0$ (the vertex is a minimum) and downwards if $a < 0$. For $y = 2x^2 - 8x + 5$: $x_V = \frac{8}{4} = 2$ and $y_V = 2(4) - 16 + 5 = -3$, so the vertex is $(2, -3)$, a minimum.

### Areas and volumes

| Figure | Formula |
| --- | --- |
| Triangle | $\frac{1}{2} \times \text{base} \times \text{height}$ |
| Equilateral triangle, side $s$ | $\frac{\sqrt{3}}{4}s^2$ |
| Trapezoid | $\frac{1}{2}(b_1 + b_2)h$ |
| Rhombus, diagonals $d_1$, $d_2$ | $\frac{1}{2}d_1 d_2$ |
| Circle | area $\pi r^2$, circumference $2\pi r$ |
| Sector with angle $\theta$ degrees | arc $\frac{\theta}{360} \cdot 2\pi r$, area $\frac{\theta}{360} \cdot \pi r^2$ |
| Cylinder | $V = \pi r^2 h$ |
| Cone | $V = \frac{1}{3}\pi r^2 h$ |
| Sphere | $V = \frac{4}{3}\pi r^3$ |

A sector's arc and area are the **same fraction** of the full circumference and the full area, because both are set by the angle.

### The counting matrix

Ask one question first: does the order of the chosen items matter?

| Model | Order matters? | Formula | Example |
| --- | --- | --- | --- |
| Arranging all $n$ items | yes | $n!$ | 5 books on a shelf: $5! = 120$ |
| Ordered choice of $k$ from $n$ | yes (ranked slots) | $\frac{n!}{(n - k)!}$ | a representative and a deputy from 6: $6 \times 5 = 30$ |
| Arranging items with repeats | yes, but identical items are interchangeable | $\frac{n!}{r_1! \, r_2! \cdots}$ | the letters of BOCCONI: $\frac{7!}{2! \, 2!} = 1260$ |
| Unordered choice of $k$ from $n$ | no (a group) | $\binom{n}{k} = \frac{n!}{k!(n - k)!}$ | 4 delegates from 12: $\binom{12}{4} = 495$ |

Independent stages multiply (the product rule); separate cases that cannot happen together add (the sum rule).

### Probability

With equally likely outcomes, $P(A) = \frac{\text{favourable}}{\text{total}}$. Two rules do most of the work:

- **Inclusion–exclusion:** $P(A \cup B) = P(A) + P(B) - P(A \cap B)$. The overlap is counted inside both $P(A)$ and $P(B)$, so subtract it once.
- **Complement:** $P(\text{at least one}) = 1 - P(\text{none})$. For four tosses of a fair coin, $P(\text{no heads}) = \left(\frac{1}{2}\right)^4 = \frac{1}{16}$, so $P(\text{at least one head}) = \frac{15}{16}$.

For independent events, $P(A \cap B) = P(A)\,P(B)$.

### Statistics

- **Work through totals:** total $=$ mean $\times$ count. Class A (20 students, mean 80) and class B (30 students, mean 70) together have mean $\frac{1600 + 2100}{50} = \frac{3700}{50} = 74$, not the plain average 75 of the two means.
- **Median:** the middle value of the sorted data (the mean of the two middle values when the count is even). It is resistant to outliers: in a set of three or more values, making the largest value much larger moves the mean but leaves the median where it is.
- **Shifting and scaling:** adding $k$ to every value adds $k$ to the mean and median and leaves the range, variance and standard deviation unchanged. Multiplying every value by $k$ multiplies the mean by $k$, the standard deviation by $\lvert k \rvert$ and the variance by $k^2$.

### Compound percentages

A rise of $p\%$ is the multiplier $1 + \frac{p}{100}$, a fall is $1 - \frac{p}{100}$, and successive changes multiply. Up 20% then down 20% is $1.2 \times 0.8 = 0.96$: a net fall of 4%, not 0%. To undo a change, divide by its multiplier: after a 15% discount a laptop costs €680, so the original price was $\frac{680}{0.85} = \frac{68\,000}{85} = 800$ euros (dividing top and bottom by 17 gives $\frac{4000}{5}$). Adding 15% to 680 gives 782, which is wrong.
`,
  examples: [
    {
      id: 'example-circle-centre-radius',
      title: 'Centre and radius from the expanded form',
      problemMd: md`Find the centre and radius of the circle $x^2 + y^2 - 6x + 4y - 12 = 0$.`,
      steps: [
        md`Read $a = -6$, $b = 4$, $c = -12$. The centre is $\left(-\frac{a}{2}, -\frac{b}{2}\right) = (3, -2)$.`,
        md`The radius: $r^2 = \frac{36}{4} + \frac{16}{4} - (-12) = 9 + 4 + 12 = 25$, so $r = 5$.`,
        md`Check by completing the square: $(x - 3)^2 - 9 + (y + 2)^2 - 4 - 12 = 0$, so $(x - 3)^2 + (y + 2)^2 = 25$.`,
      ],
      answerMd: md`Centre $(3, -2)$, radius 5. The usual slips are the signs of the centre, $(-3, 2)$, and subtracting 12 instead of adding it, which gives $r^2 = 1$.`,
    },
    {
      id: 'example-sector-total-area',
      title: 'From a sector to the whole circle',
      problemMd: md`A sector has an arc of length $8\pi$, and its area is $\frac{4}{9}$ of the area of the full circle. Find the area of the full circle.`,
      steps: [
        md`The sector's area and arc are the same fraction of the whole, because both are fixed by the angle. So the arc is $\frac{4}{9}$ of the circumference: $8\pi = \frac{4}{9}C$, and $C = 18\pi$.`,
        md`From $2\pi r = 18\pi$, the radius is $r = 9$.`,
        md`The full area is $\pi r^2 = 81\pi$.`,
        md`Second route: a sector's area is $\frac{1}{2} \times r \times \text{arc} = \frac{1}{2} \times 9 \times 8\pi = 36\pi$, and $36\pi \div \frac{4}{9} = 81\pi$.`,
      ],
      answerMd: md`$81\pi$. Stopping at the sector's own area, $36\pi$, answers a different question.`,
    },
    {
      id: 'example-bocconi-anagrams',
      title: 'Arrangements with repeated letters',
      problemMd: md`How many different arrangements are there of the letters of BOCCONI?`,
      steps: [
        md`Count the letters: B, O, C, C, O, N, I, so 7 letters with O twice and C twice; the other three appear once.`,
        md`If all 7 were different there would be $7! = 5040$ arrangements. Swapping the two Os, or the two Cs, gives the same word, so divide by $2!$ for each: $\frac{5040}{2 \times 2} = 1260$.`,
        md`Second route: choose 2 of the 7 positions for the Cs ($\binom{7}{2} = 21$), 2 of the remaining 5 for the Os ($\binom{5}{2} = 10$), and arrange B, N, I in the last 3 ($3! = 6$): $21 \times 10 \times 6 = 1260$.`,
      ],
      answerMd: md`1260. Using $7! = 5040$ counts each word four times; dividing by $2!$ only once gives 2520.`,
    },
    {
      id: 'example-coins-or-ace',
      title: 'Inclusion–exclusion with a 40-card deck',
      problemMd: md`A deck has 40 cards: four suits (coins, cups, swords and clubs) of 10 cards each, and each suit has one ace. One card is drawn at random. What is the probability that it is a coin or an ace?`,
      steps: [
        md`$P(\text{coin}) = \frac{10}{40}$ and $P(\text{ace}) = \frac{4}{40}$.`,
        md`The ace of coins is in both groups: $P(\text{coin and ace}) = \frac{1}{40}$.`,
        md`Inclusion–exclusion: $\frac{10}{40} + \frac{4}{40} - \frac{1}{40} = \frac{13}{40}$.`,
        md`Second route, by counting: the 10 coins plus the 3 aces of the other suits make 13 favourable cards out of 40.`,
      ],
      answerMd: md`$\frac{13}{40}$. Adding without subtracting the overlap gives $\frac{14}{40}$, which counts the ace of coins twice.`,
    },
  ],
  traps: [
    {
      title: 'Perpendicular slope: only half the change',
      md: md`A perpendicular slope is the **negative reciprocal**: slope $\frac{2}{3}$ becomes $-\frac{3}{2}$. Changing only the sign ($-\frac{2}{3}$) or only flipping the fraction ($\frac{3}{2}$) gives lines that are not perpendicular. Check by multiplying: the product must be $-1$.`,
    },
    {
      title: 'Circle signs and the radius squared',
      md: md`$(x + 3)^2 + (y - 1)^2 = 16$ has centre $(-3, 1)$, because $x + 3 = x - (-3)$, and radius 4, not 16. In the expanded form, $r^2 = \frac{a^2}{4} + \frac{b^2}{4} - c$: a negative $c$ makes $r^2$ larger.`,
    },
    {
      title: 'Ordered or unordered?',
      md: md`"Choose a president and a secretary" is ordered (the roles differ); "choose a committee of two" is not. Using $\binom{n}{k}$ for distinct roles undercounts by $k!$, and using $\frac{n!}{(n - k)!}$ for a group overcounts by $k!$. Ask whether swapping two chosen people gives a different outcome.`,
    },
    {
      title: 'Counting the overlap twice',
      md: md`"Or" in probability includes both. Adding $P(A)$ and $P(B)$ without subtracting $P(A \cap B)$ is right only when the events cannot happen together. If the sum comes out above 1, you have certainly double-counted.`,
    },
    {
      title: 'Averaging averages',
      md: md`The mean of two groups is the plain average of their means only when the groups are the same size. Otherwise convert each mean into a total, add the totals, and divide by the total count.`,
    },
  ],
  check: [
    {
      id: 'check-perpendicular-line',
      title: 'A perpendicular line through a point',
      topic: 'Mathematics: analytical geometry',
      stemMd: md`Which line passes through $(2, -1)$ and is perpendicular to $2x - 3y + 6 = 0$?`,
      options: [
        { id: 'A', text: md`$y = -\frac{3}{2}x + 2$`, note: '' },
        { id: 'B', text: md`$y = \frac{2}{3}x - \frac{7}{3}$`, note: md`This keeps the given slope $\frac{2}{3}$, so it is the parallel line through the point.` },
        { id: 'C', text: md`$y = -\frac{2}{3}x + \frac{1}{3}$`, note: md`This only changes the sign of the slope; the product $\frac{2}{3} \times \left(-\frac{2}{3}\right)$ is not $-1$.` },
        { id: 'D', text: md`$y = \frac{3}{2}x - 4$`, note: md`This flips the fraction but keeps the sign; the product $\frac{2}{3} \times \frac{3}{2}$ is $+1$, not $-1$.` },
      ],
      answer: 'A',
      workingMd: md`Rewrite the given line as $y = \frac{2}{3}x + 2$, so its slope is $\frac{2}{3}$. A perpendicular slope is $-\frac{3}{2}$. Through $(2, -1)$: $y + 1 = -\frac{3}{2}(x - 2)$, so $y = -\frac{3}{2}x + 3 - 1 = -\frac{3}{2}x + 2$. Check: at $x = 2$, $y = -3 + 2 = -1$. All four lines pass through the point, so the slope alone decides.`,
      lesson: 'For a perpendicular line, flip the slope and change its sign, then check that the product of the slopes is −1.',
    },
    {
      id: 'check-roles-and-committee',
      title: 'Roles and a committee',
      topic: 'Mathematics: discrete mathematics',
      stemMd: md`A club has 9 members. It elects a president and a treasurer (two different people), and then picks a 2-person events committee from the 7 members left. In how many ways can this be done?`,
      options: [
        { id: 'A', text: md`126`, note: md`This is $\binom{9}{4}$: it treats all four people as one unordered group and ignores that president and treasurer are different roles.` },
        { id: 'B', text: md`756`, note: md`This is $\binom{9}{2} \times \binom{7}{2}$: it treats the president and treasurer as an unordered pair, so it halves the count.` },
        { id: 'C', text: md`1512`, note: '' },
        { id: 'D', text: md`3024`, note: md`This is $9 \times 8 \times 7 \times 6$: it treats the two committee places as ordered, so each committee is counted twice.` },
      ],
      answer: 'C',
      workingMd: md`The two roles are ordered: $9 \times 8 = 72$ ways. The committee is an unordered pair from the remaining 7: $\binom{7}{2} = 21$. The stages are independent, so multiply: $72 \times 21 = 1512$.`,
      lesson: 'Split a selection into stages, decide for each stage whether order matters, and multiply the stages.',
    },
    {
      id: 'check-at-least-one-six',
      title: 'At least one six',
      topic: 'Mathematics: probability',
      stemMd: md`A fair die is rolled three times. What is the probability of getting at least one six?`,
      options: [
        { id: 'A', text: md`$\frac{75}{216}$`, note: md`This is the probability of exactly one six, $3 \times \frac{1}{6} \times \frac{25}{36}$; it leaves out two and three sixes.` },
        { id: 'B', text: md`$\frac{91}{216}$`, note: '' },
        { id: 'C', text: md`$\frac{1}{2}$`, note: md`This adds $\frac{1}{6}$ three times, which counts the outcomes with more than one six more than once.` },
        { id: 'D', text: md`$\frac{125}{216}$`, note: md`This is the probability of no six at all; it still has to be subtracted from 1.` },
      ],
      answer: 'B',
      workingMd: md`Use the complement. The probability of no six in one roll is $\frac{5}{6}$, so in three independent rolls it is $\left(\frac{5}{6}\right)^3 = \frac{125}{216}$. Then $P(\text{at least one six}) = 1 - \frac{125}{216} = \frac{91}{216}$. Check by cases: exactly one six $\frac{75}{216}$, exactly two $3 \times \frac{5}{216} = \frac{15}{216}$, three $\frac{1}{216}$; total $\frac{91}{216}$.`,
      lesson: 'For "at least one", find the probability of none and subtract it from 1.',
    },
  ],
  takeaways: [
    'Perpendicular slopes multiply to −1; parallel slopes are equal.',
    md`In $x^2 + y^2 + ax + by + c = 0$ the centre is $\left(-\frac{a}{2}, -\frac{b}{2}\right)$ and $r^2 = \frac{a^2}{4} + \frac{b^2}{4} - c$; the parabola's vertex is at $x = -\frac{b}{2a}$.`,
    'Counting: order matters gives arrangements, order does not gives combinations, and repeated items divide by the factorial of each repeat.',
    'Probability: subtract the overlap for "or", and use 1 minus "none" for "at least one".',
    'Averages go through totals, and percentage changes chain as multipliers.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
