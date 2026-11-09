import { md, type Lesson } from '../../types';

export const specialTrianglesLesson: Lesson = {
  slug: 'special-right-triangles-and-similarity',
  title: 'Special right triangles, similarity and congruence',
  summary: 'Use the 45-45-90 and 30-60-90 side ratios on sight, match similar triangles by their angles, and scale lengths and areas correctly.',
  minutes: 22,
  objectives: [
    'Find every side of a 45-45-90 or 30-60-90 triangle from any one side.',
    'Spot these triangles inside squares, equilateral triangles and other figures.',
    'Prove two triangles similar by their angles and set up proportions between corresponding sides.',
    'Scale areas by the square of the length ratio.',
  ],
  teachMd: md`
### Two right triangles with fixed shapes

Two right triangles come with side ratios you should know without working them out. Both follow from the Pythagorean theorem, and both turn up whenever a square is cut along its diagonal or an equilateral triangle is cut by its height.

| Triangle | Sides, in order (short to long) | Where it comes from |
| --- | --- | --- |
| $45^\circ$-$45^\circ$-$90^\circ$ | $s, \; s, \; s\sqrt{2}$ | half a square, cut along a diagonal |
| $30^\circ$-$60^\circ$-$90^\circ$ | $s, \; s\sqrt{3}, \; 2s$ | half an equilateral triangle, cut by its height |

**The 45-45-90 triangle** is isosceles, so its legs are equal. If each leg is $s$, the hypotenuse is $\sqrt{s^2 + s^2} = s\sqrt{2}$. Going the other way, a hypotenuse $h$ gives legs of $\frac{h}{\sqrt{2}} = \frac{h\sqrt{2}}{2}$.

**The 30-60-90 triangle** is half of an equilateral triangle with side $2s$. The cut runs from one vertex to the midpoint of the opposite side, so the short leg is $s$, the hypotenuse is the full side $2s$, and the long leg is $\sqrt{(2s)^2 - s^2} = s\sqrt{3}$. Keep the order straight with angles: the shortest side faces the smallest angle, $30^\circ$; the hypotenuse faces $90^\circ$; and the middle side, $s\sqrt{3}$, faces $60^\circ$. Since $\sqrt{3} \approx 1.73$ lies between 1 and 2, the long leg sits between the other two sides, as it must.

Always work through the **short leg**. If you are given the long leg, divide by $\sqrt{3}$ to get the short leg; if you are given the hypotenuse, halve it. Then build the rest.

### Where they hide

- A square with side $s$ has diagonal $s\sqrt{2}$. A square with diagonal $d$ has area $\frac{d^2}{2}$.
- An equilateral triangle with side $s$ has height $\frac{s\sqrt{3}}{2}$ and area $\frac{\sqrt{3}}{4}s^2$.
- A $30^\circ$ or $60^\circ$ angle in a parallelogram, trapezoid or rhombus usually means a height can be found from a 30-60-90 triangle. Trigonometry is not tested on the GRE, so when such an angle appears, the special triangle is the route.

### Similar triangles

Two triangles are **similar** when they have the same shape: equal angles, and every side of one equal to the matching side of the other multiplied by the same factor $k$. To prove triangles similar you need only **two pairs of equal angles**, because the third angles are then equal too (all three add to $180^\circ$).

Two set-ups produce similar triangles again and again.

1. **A line parallel to one side.** In triangle $ABC$, draw segment $DE$ with $D$ on $AB$, $E$ on $AC$ and $DE$ parallel to $BC$. Then triangle $ADE$ is similar to triangle $ABC$: they share angle $A$, and the parallels make angle $ADE$ equal to angle $ABC$ (corresponding angles).
2. **Two triangles sharing a vertex angle with a pair of parallel or perpendicular sides,** such as two right triangles that share an acute angle.

**Match sides by angles, not by position on the page.** The sides opposite equal angles correspond. Write the correspondence in order (triangle $ADE$ matches triangle $ABC$, so $AD$ matches $AB$, $DE$ matches $BC$, $AE$ matches $AC$) and the proportions write themselves.

### Scaling lengths, areas and volumes

If two figures are similar with length ratio $k$, then every length (sides, heights, perimeters) scales by $k$, every area by $k^2$ and every volume by $k^3$. The reason: area is length times length, so both factors grow by $k$. A triangle whose sides are three times as long has $9$ times the area, not $3$ times.

### Congruent triangles

Congruent triangles are similar with $k = 1$: same shape and same size. Three conditions guarantee it: three pairs of equal sides (SSS); two sides and the angle between them (SAS); two angles and any side in matching position (ASA or AAS). Two sides with an angle that is not between them do not settle it in general, because two different triangles can share those three facts. On the test, congruence is mostly a reason to copy a known length or angle from one triangle to another.
`,
  examples: [
    {
      id: 'example-equilateral-height',
      title: 'The height and area of an equilateral triangle',
      problemMd: md`An equilateral triangle has sides of length $10$. Find its height and its area.`,
      steps: [
        md`Draw the height from one vertex to the midpoint of the opposite side. It cuts the triangle into two 30-60-90 triangles, each with hypotenuse $10$ and short leg $5$.`,
        md`The height is the long leg: $5\sqrt{3}$. Check with Pythagoras: $10^2 - 5^2 = 75$ and $\sqrt{75} = 5\sqrt{3}$.`,
        md`Area $= \frac{1}{2} \times 10 \times 5\sqrt{3} = 25\sqrt{3} \approx 43.3$. The formula $\frac{\sqrt{3}}{4} \times 10^2 = 25\sqrt{3}$ agrees.`,
      ],
      answerMd: md`The height is $5\sqrt{3}$ and the area is $25\sqrt{3}$. Putting $\sqrt{3}$ on the wrong leg gives a height of $\frac{5}{\sqrt{3}}$, about $2.9$; but the height faces the $60^\circ$ angle, so it must be longer than the half-base of 5 that faces $30^\circ$.`,
    },
    {
      id: 'example-square-diagonal',
      title: 'A square known only by its diagonal',
      problemMd: md`The diagonal of a square is $8$. What is the area of the square?`,
      steps: [
        md`The diagonal splits the square into two 45-45-90 triangles with hypotenuse $8$.`,
        md`Each leg, which is a side of the square, is $\frac{8}{\sqrt{2}} = 4\sqrt{2}$.`,
        md`Area $= (4\sqrt{2})^2 = 16 \times 2 = 32$. The shortcut $\frac{d^2}{2} = \frac{64}{2} = 32$ agrees.`,
      ],
      answerMd: md`The area is $32$. Squaring the diagonal, $8^2 = 64$, is the tempting wrong answer: that is the area of a square whose **side** is 8.`,
    },
    {
      id: 'example-parallel-segment',
      title: 'A segment parallel to a side',
      problemMd: md`In triangle $ABC$, point $D$ lies on side $AB$ and point $E$ lies on side $AC$, with $DE$ parallel to $BC$. $AD = 4$, $DB = 6$ and $DE = 5$. Find $BC$, and the fraction of the area of triangle $ABC$ that lies in triangle $ADE$.`,
      steps: [
        md`Triangles $ADE$ and $ABC$ are similar: they share angle $A$, and angle $ADE$ equals angle $ABC$ because $DE$ is parallel to $BC$.`,
        md`Match whole sides: $AD$ corresponds to $AB$, and $AB = 4 + 6 = 10$. So $k = \frac{AD}{AB} = \frac{4}{10} = \frac{2}{5}$.`,
        md`$DE$ corresponds to $BC$: $\frac{5}{BC} = \frac{2}{5}$, so $BC = 12.5$.`,
        md`Areas scale by $k^2 = \frac{4}{25}$. Triangle $ADE$ is $\frac{4}{25}$ of triangle $ABC$, and the strip $DBCE$ between them is the other $\frac{21}{25}$.`,
      ],
      answerMd: md`$BC = 12.5$, and triangle $ADE$ has $\frac{4}{25}$ of the area. The tempting proportion $\frac{AD}{DB} = \frac{DE}{BC}$ uses the piece $DB$ instead of the whole side $AB$ and gives the wrong value $7.5$.`,
    },
  ],
  traps: [
    {
      title: 'Putting the square root on the wrong side',
      md: md`In a 30-60-90 triangle the hypotenuse is $2s$, not $s\sqrt{3}$, and the long leg is $s\sqrt{3}$, not $2s$. Check the order: $s < s\sqrt{3} < 2s$. If your hypotenuse is not the longest side, the ratios are swapped.`,
    },
    {
      title: 'Matching sides by where they sit on the page',
      md: md`Similar triangles are often drawn flipped or turned, so the "bottom" side of one need not match the "bottom" side of the other. Find the equal angles first and match the sides opposite them.`,
    },
    {
      title: 'Scaling areas by the length ratio',
      md: md`Double every side and the area becomes four times as large. If two similar figures have sides in the ratio $2:3$, their areas are in the ratio $4:9$. Use $k$ for lengths, $k^2$ for areas and $k^3$ for volumes.`,
    },
    {
      title: 'Using a piece instead of the whole side',
      md: md`When a parallel segment cuts a triangle, the small triangle's side is $AD$ and the large triangle's side is $AB$, the whole of it. The leftover piece $DB$ belongs to neither triangle, so a ratio with $DB$ in it is not the scale factor.`,
    },
  ],
  check: [
    {
      id: 'check-long-leg-hypotenuse',
      title: 'From the long leg to the hypotenuse',
      topic: 'Triangles',
      stemMd: md`In a $30^\circ$-$60^\circ$-$90^\circ$ triangle, the side opposite the $60^\circ$ angle has length $9$. What is the length of the hypotenuse?`,
      options: [
        { id: 'A', text: md`$3\sqrt{3}$`, note: md`This is the short leg, opposite the $30^\circ$ angle. The hypotenuse is twice it.` },
        { id: 'B', text: md`$6\sqrt{3}$`, note: '' },
        { id: 'C', text: md`$9\sqrt{2}$`, note: md`Uses the 45-45-90 ratio. The angles here are 30, 60 and 90.` },
        { id: 'D', text: md`$9\sqrt{3}$`, note: md`Treats 9 as the short leg and finds the long leg. But 9 faces the $60^\circ$ angle, so it is already the long leg.` },
        { id: 'E', text: md`$18$`, note: md`Treats 9 as the short leg and doubles it. The side opposite $60^\circ$ is the long leg, not the short one.` },
      ],
      answer: 'B',
      workingMd: md`The side opposite $60^\circ$ is the long leg, $s\sqrt{3} = 9$, so the short leg is $s = \frac{9}{\sqrt{3}} = 3\sqrt{3}$. The hypotenuse is $2s = 6\sqrt{3} \approx 10.4$. Check: $(3\sqrt{3})^2 + 9^2 = 27 + 81 = 108 = (6\sqrt{3})^2$.`,
      lesson: 'In a 30-60-90 triangle, get the short leg first, then double it for the hypotenuse.',
    },
    {
      id: 'check-similar-areas',
      title: 'The area of a larger similar triangle',
      topic: 'Quantitative Comparison',
      stemMd: md`Triangles $PQR$ and $STU$ are similar, with $P$, $Q$ and $R$ corresponding to $S$, $T$ and $U$. $PQ = 6$, $ST = 9$, and the area of triangle $PQR$ is $24$.

**Quantity A:** the area of triangle $STU$

**Quantity B:** $50$`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: '' },
        { id: 'B', text: 'Quantity B is greater.', note: md`Scales the area by the length ratio, $24 \times \frac{3}{2} = 36$. Areas scale by the square of that ratio.` },
        { id: 'C', text: 'The two quantities are equal.', note: md`An area of 50 would need an area ratio of $\frac{50}{24}$, but the side ratio $\frac{3}{2}$ gives an area ratio of $\frac{9}{4}$, which is larger.` },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: md`One pair of corresponding sides fixes the scale factor of similar triangles, so the area of $STU$ is determined even though its shape is not given.` },
      ],
      answer: 'A',
      workingMd: md`The length ratio is $k = \frac{9}{6} = \frac{3}{2}$, so the area ratio is $k^2 = \frac{9}{4}$. The area of $STU$ is $24 \times \frac{9}{4} = 54$, which is greater than 50.`,
      lesson: 'Square the length ratio before you scale an area.',
    },
    {
      id: 'check-parallel-segment',
      title: 'A parallel segment inside a triangle',
      topic: 'Congruent and similar figures',
      stemMd: md`In triangle $JKL$, point $M$ lies on side $JK$ and point $N$ lies on side $JL$, with $MN$ parallel to $KL$. $JM = 3$, $MK = 9$ and $KL = 20$. What is the length of $MN$?`,
      options: [
        { id: 'A', text: md`$5$`, note: '' },
        { id: 'B', text: md`$\frac{20}{3}$`, note: md`Uses $\frac{JM}{MK} = \frac{3}{9}$ as the scale factor. $MK$ is only a piece; the side matching $JM$ is the whole of $JK$.` },
        { id: 'C', text: md`$11$`, note: md`Subtracts instead of scaling: $JM$ is 9 less than $JK$, so takes $MN$ as 9 less than $KL$. Similar figures scale by a factor; they do not shift by a fixed amount.` },
        { id: 'D', text: md`$15$`, note: md`Uses $\frac{MK}{JK} = \frac{9}{12}$, the share of the side that lies outside the small triangle.` },
        { id: 'E', text: md`$\frac{80}{3}$`, note: md`Turns the ratio upside down, $\frac{JK}{MK} = \frac{12}{9}$, and gives a segment longer than $KL$, which the inner segment cannot be.` },
      ],
      answer: 'A',
      workingMd: md`Triangles $JMN$ and $JKL$ share angle $J$, and $MN$ parallel to $KL$ makes angle $JMN$ equal to angle $JKL$, so they are similar. $JK = 3 + 9 = 12$, so the scale factor is $\frac{JM}{JK} = \frac{3}{12} = \frac{1}{4}$, and $MN = \frac{1}{4} \times 20 = 5$.`,
      lesson: 'In a triangle cut by a parallel segment, compare the small triangle\'s side with the whole side of the large one.',
    },
  ],
  takeaways: [
    md`45-45-90: sides $s, s, s\sqrt{2}$. 30-60-90: sides $s, s\sqrt{3}, 2s$, with $s$ opposite $30^\circ$.`,
    'Work through the short leg of a 30-60-90 triangle.',
    'Two equal angle pairs make triangles similar; match sides opposite equal angles.',
    md`Lengths scale by $k$, areas by $k^2$, volumes by $k^3$.`,
  ],
  practice: { examKey: 'gre', domain: 'quant-geometry', skill: 'geom-congruent-similar-figures' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
