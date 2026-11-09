import { md, type Lesson } from '../../types';

export const trianglesLesson: Lesson = {
  slug: 'triangles-and-the-pythagorean-theorem',
  title: 'Triangles and the Pythagorean theorem',
  summary: 'Bound a missing side with the triangle inequality, find areas with the right height, and use the Pythagorean theorem only where it applies.',
  minutes: 20,
  objectives: [
    'Use the triangle inequality to find the possible lengths of a third side.',
    'Find a triangle\'s area from any base and the height perpendicular to it.',
    'Apply the Pythagorean theorem and its converse, and recognise the common whole-number right triangles.',
    'Tell from three side lengths whether a triangle is acute, right or obtuse.',
  ],
  teachMd: md`
### What every triangle obeys

Three facts hold for every triangle, whatever its shape.

1. **The angles add to $180^\circ$.**
2. **Bigger sides face bigger angles.** The longest side is opposite the largest angle, and the shortest side opposite the smallest. Equal sides face equal angles: in an isosceles triangle the two angles at the base are equal, and in an equilateral triangle every angle is $60^\circ$.
3. **The triangle inequality.** Each side is shorter than the other two together. If two sides are $a$ and $b$ with $a \ge b$, the third side $x$ satisfies
$$a - b < x < a + b$$

Why strict? If $x$ were exactly $a + b$, the two shorter sides laid end to end would only just reach, and the "triangle" would flatten into a straight segment with no area. Questions that ask how many whole-number lengths are possible depend on getting those two endpoints excluded.

### Area: base times height, with the right height

$$\text{area} = \frac{1}{2} \times \text{base} \times \text{height}$$

Any side can be the base. The **height** is the perpendicular distance from the opposite vertex to the line containing that base. In a right triangle the two legs are a base and its height. In an obtuse triangle the height to one of the short sides falls outside the triangle, onto that side extended; the formula still works.

Because one triangle has one area, the three base–height pairs all give the same product. That is a useful tool: once you know the area, you can find the height to any other side by dividing twice the area by that side.

A slanted side is a height only if it is perpendicular to the base. Multiplying two sides that meet at an angle other than $90^\circ$ gives too large an area.

### The Pythagorean theorem

In a **right** triangle with legs $a$ and $b$ and hypotenuse $c$ (the side opposite the right angle, always the longest side):
$$a^2 + b^2 = c^2$$

The theorem works in both directions. If three sides satisfy $a^2 + b^2 = c^2$, the angle opposite $c$ is a right angle. Comparing $c^2$ with $a^2 + b^2$ (where $c$ is the longest side) also sorts every triangle:

| Longest side $c$ | The angle opposite $c$ is | The triangle is |
| --- | --- | --- |
| $c^2 < a^2 + b^2$ | less than $90^\circ$ | acute |
| $c^2 = a^2 + b^2$ | exactly $90^\circ$ | right |
| $c^2 > a^2 + b^2$ | more than $90^\circ$ | obtuse |

The intuition: hold sides $a$ and $b$ fixed and open the angle between them. The wider the angle, the longer the third side; at exactly $90^\circ$ it equals $\sqrt{a^2 + b^2}$.

### Whole-number right triangles worth knowing

Some side triples come up because they keep the arithmetic clean. Knowing them saves a square root.

| Triple | Check |
| --- | --- |
| $3, 4, 5$ | $9 + 16 = 25$ |
| $5, 12, 13$ | $25 + 144 = 169$ |
| $8, 15, 17$ | $64 + 225 = 289$ |
| $7, 24, 25$ | $49 + 576 = 625$ |

Any multiple of a triple is a triple too: $6, 8, 10$ and $15, 20, 25$ are both $3, 4, 5$ scaled up. Before you square anything, check whether the given sides are a multiple of a known triple. A leg of $10$ with a hypotenuse of $26$ is $5, 12, 13$ doubled, so the other leg is $24$.

Make sure the triple is in the right order. Legs of $5$ and $13$ do not give a hypotenuse of $12$: the hypotenuse is the longest side, so it would be $\sqrt{25 + 169} = \sqrt{194}$.

### Where right triangles hide

Many questions do not show a right triangle; you build one. A rectangle's diagonal splits it into two right triangles. The height of an isosceles triangle drawn to its base cuts the base in half and makes two right triangles. A distance between two points on a grid is the hypotenuse of a triangle whose legs are the horizontal and vertical gaps. When a length is missing, look for a right angle you can create.
`,
  examples: [
    {
      id: 'example-third-side-count',
      title: 'How many whole-number third sides?',
      problemMd: md`Two sides of a triangle measure $7$ and $12$. If the third side is a whole number, how many lengths are possible?`,
      steps: [
        md`Apply the triangle inequality: $12 - 7 < x < 12 + 7$, so $5 < x < 19$.`,
        md`The whole numbers strictly between 5 and 19 run from 6 to 18.`,
        md`Count them: $18 - 6 + 1 = 13$.`,
      ],
      answerMd: md`There are $13$ possible lengths. Including the endpoints 5 and 19 gives the tempting wrong count of 15; both would flatten the triangle into a line.`,
    },
    {
      id: 'example-right-triangle-area',
      title: 'A missing leg, then the area',
      problemMd: md`In right triangle $DEF$, the right angle is at $E$. The hypotenuse $DF$ is $26$ and leg $DE$ is $10$. What is the area of the triangle?`,
      steps: [
        md`The legs are $DE$ and $EF$, because the right angle is at $E$. So $DE^2 + EF^2 = DF^2$.`,
        md`Spot the triple: $10$ and $26$ are $5$ and $13$ doubled, so $EF = 12 \times 2 = 24$. Check: $100 + 576 = 676 = 26^2$.`,
        md`The two legs are a base and its height: area $= \frac{1}{2} \times 10 \times 24 = 120$.`,
      ],
      answerMd: md`The area is $120$. Using the hypotenuse as a height, $\frac{1}{2} \times 10 \times 26 = 130$, is the tempting wrong answer; the hypotenuse is not perpendicular to $DE$.`,
    },
    {
      id: 'example-isosceles-height',
      title: 'An isosceles triangle and two heights',
      problemMd: md`Triangle $ABC$ has $AB = AC = 13$ and $BC = 10$. Find its area, and then the height from $B$ to side $AC$.`,
      steps: [
        md`Drop the height from $A$ to $BC$ at point $M$. In an isosceles triangle this height meets the base at its midpoint, so $BM = 5$ and angle $AMB$ is a right angle.`,
        md`In right triangle $ABM$: $AM^2 = 13^2 - 5^2 = 169 - 25 = 144$, so $AM = 12$ (a $5, 12, 13$ triangle).`,
        md`Area $= \frac{1}{2} \times 10 \times 12 = 60$.`,
        md`Now use $AC$ as the base. The area is still 60, so $\frac{1}{2} \times 13 \times h = 60$ and $h = \frac{120}{13} \approx 9.23$.`,
      ],
      answerMd: md`The area is $60$ and the height from $B$ to $AC$ is $\frac{120}{13}$. Taking the slanted side $13$ as the height, $\frac{1}{2} \times 10 \times 13 = 65$, overstates the area.`,
    },
  ],
  traps: [
    {
      title: 'Pythagoras on a triangle with no right angle',
      md: md`$a^2 + b^2 = c^2$ holds only when the angle opposite $c$ is $90^\circ$. If no right angle is stated or marked, the squares do not add up and you cannot use them to find a side. Look for a right angle you can create instead, such as an altitude.`,
    },
    {
      title: 'Treating the missing side as the hypotenuse',
      md: md`Given sides 6 and 10 of a right triangle, the third side is $8$ if 10 is the hypotenuse, and $\sqrt{136}$ only if 6 and 10 are both legs. Read where the right angle is before deciding which side is $c$.`,
    },
    {
      title: 'Including the endpoints of the triangle inequality',
      md: md`The third side is strictly between the difference and the sum of the other two. With sides 4 and 9, a third side of 5 or 13 gives a flat figure with no area, not a triangle.`,
    },
    {
      title: 'Using a slanted side as the height',
      md: md`The height must be perpendicular to the base. A side that leans is longer than the height it stands in for, so the area comes out too large. If the height is not given, build a right triangle to find it.`,
    },
  ],
  check: [
    {
      id: 'check-possible-perimeter',
      title: 'A possible perimeter',
      topic: 'Triangles',
      stemMd: md`Two sides of a triangle have lengths $5$ and $11$. Which of the following could be the perimeter of the triangle?`,
      options: [
        { id: 'A', text: md`$21$`, note: md`Would make the third side 5, which is less than $11 - 5 = 6$; the two short sides could not meet.` },
        { id: 'B', text: md`$22$`, note: md`Would make the third side exactly 6, the difference of the other two. The figure would be flat, so the inequality is strict.` },
        { id: 'C', text: md`$27$`, note: '' },
        { id: 'D', text: md`$32$`, note: md`Would make the third side exactly 16, the sum of the other two: a flat figure, not a triangle.` },
        { id: 'E', text: md`$33$`, note: md`Would make the third side 17, longer than $5 + 11$; the other two sides could not reach.` },
      ],
      answer: 'C',
      workingMd: md`The third side $x$ satisfies $11 - 5 < x < 11 + 5$, so $6 < x < 16$. The perimeter is $16 + x$, so it lies strictly between $22$ and $32$. Of the options only $27$ (third side $11$) is in that range.`,
      lesson: 'Turn a perimeter question into a third-side question, and keep both ends of the inequality strict.',
    },
    {
      id: 'check-hypotenuse-area',
      title: 'Area from a hypotenuse and a leg',
      topic: 'The Pythagorean theorem',
      stemMd: md`A right triangle has a hypotenuse of length $17$ and one leg of length $8$. What is the area of the triangle?`,
      options: [
        { id: 'A', text: md`$60$`, note: '' },
        { id: 'B', text: md`$68$`, note: md`Uses the hypotenuse as the height: $\frac{1}{2} \times 8 \times 17$. The hypotenuse is not perpendicular to the leg.` },
        { id: 'C', text: md`$120$`, note: md`Finds the right legs, 8 and 15, but forgets the $\frac{1}{2}$ in the area formula.` },
        { id: 'D', text: md`$127.5$`, note: md`Multiplies the other leg by the hypotenuse, $\frac{1}{2} \times 15 \times 17$; those two sides are not perpendicular either.` },
        { id: 'E', text: md`$136$`, note: md`Multiplies the two given sides with no $\frac{1}{2}$: $8 \times 17$.` },
      ],
      answer: 'A',
      workingMd: md`The other leg is $\sqrt{17^2 - 8^2} = \sqrt{289 - 64} = \sqrt{225} = 15$ (an $8, 15, 17$ triangle). The legs are perpendicular, so the area is $\frac{1}{2} \times 8 \times 15 = 60$.`,
      lesson: 'In a right triangle the two legs are base and height; find the missing leg first.',
    },
    {
      id: 'check-largest-angle',
      title: 'Acute, right or obtuse?',
      topic: 'Quantitative Comparison',
      stemMd: md`A triangle has sides of lengths $7$, $8$ and $11$.

**Quantity A:** the measure of the largest angle of the triangle, in degrees

**Quantity B:** $90$`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: '' },
        { id: 'B', text: 'Quantity B is greater.', note: md`Assumes a triangle with no stated right angle must be acute. Comparing squares shows the largest angle is obtuse.` },
        { id: 'C', text: 'The two quantities are equal.', note: md`Treats the triangle as right-angled. That would need $7^2 + 8^2 = 11^2$, but $113 \neq 121$.` },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: md`Three side lengths fix a triangle completely, so its angles are determined even though they are not given.` },
      ],
      answer: 'A',
      workingMd: md`The largest angle is opposite the longest side, 11. Compare $11^2 = 121$ with $7^2 + 8^2 = 49 + 64 = 113$. Since $121 > 113$, the angle opposite 11 is greater than $90^\circ$.`,
      lesson: 'Compare the square of the longest side with the sum of the other two squares to classify a triangle without finding any angle.',
    },
  ],
  takeaways: [
    'The third side lies strictly between the difference and the sum of the other two.',
    'Area is half of base times the height perpendicular to that base; any side can be the base.',
    md`$a^2 + b^2 = c^2$ only in a right triangle, with $c$ the hypotenuse opposite the right angle.`,
    md`Know $3, 4, 5$; $5, 12, 13$; $8, 15, 17$; $7, 24, 25$ and their multiples.`,
    md`Longest side squared against the sum of the other two squares: less is acute, equal is right, more is obtuse.`,
  ],
  practice: { examKey: 'gre', domain: 'quant-geometry', skill: 'geom-pythagorean-theorem' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
