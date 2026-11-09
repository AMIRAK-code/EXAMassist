import { md, type Lesson } from '../../types';

export const planeGeometryFormulasLesson: Lesson = {
  slug: 'plane-geometry-formulas',
  title: 'Plane geometry formulas: triangles, circles and quadrilaterals',
  summary: 'Know the area and perimeter formulas for triangles, circles, squares, trapezoids and rhombi, and find the missing length each one needs.',
  minutes: 20,
  objectives: [
    'Recall and apply the area and perimeter formulas for the triangle, circle, square, rectangle, trapezoid and rhombus.',
    'Find a missing height, side or diagonal with the Pythagorean theorem before using a formula.',
    'Split or subtract figures to find the area of a composite region, and predict how area changes when lengths are scaled.',
  ],
  teachMd: md`
### Why formulas are rarely enough on their own

Plane geometry questions almost never hand you every number a formula needs. A trapezoid comes with its slanted side instead of its height; a rhombus comes with a side and one diagonal; a square is described only through the circle around it. The formula is the last step. The real work is finding the one missing length, and that length nearly always comes from a right triangle hidden in the figure.

### The formulas to know cold

| Figure | Area | Perimeter or circumference |
| --- | --- | --- |
| Triangle, base $b$, height $h$ | $\frac{1}{2}bh$ | sum of the three sides |
| Equilateral triangle, side $s$ | $\frac{\sqrt{3}}{4}s^2$ | $3s$ |
| Rectangle, sides $a$, $b$ | $ab$ | $2(a+b)$ |
| Square, side $s$, diagonal $d$ | $s^2 = \frac{d^2}{2}$ | $4s$ |
| Rhombus, diagonals $d_1$, $d_2$, side $s$ | $\frac{d_1 d_2}{2}$ | $4s$ |
| Trapezoid, parallel sides $a$, $b$, height $h$ | $\frac{(a+b)h}{2}$ | sum of the four sides |
| Circle, radius $r$ | $\pi r^2$ | $2\pi r$ |

The **height** of a triangle or trapezoid is always measured at a right angle to the base, never along a slanted side. Any side of a triangle can serve as the base, as long as the height is the one drawn to that side. In a right triangle the two legs are a base and its height, so its area is half the product of the legs.

### The right triangle behind every missing length

The Pythagorean theorem says that in a right triangle with legs $a$, $b$ and hypotenuse $c$, $a^2 + b^2 = c^2$. Without a calculator it helps to recognise the common whole-number triples: $3, 4, 5$; $5, 12, 13$; $8, 15, 17$; $7, 24, 25$; and their multiples such as $6, 8, 10$.

Three hidden right triangles come up again and again:

- **Equilateral triangle.** The height splits it into two right triangles with hypotenuse $s$ and short leg $\frac{s}{2}$, so the height is $\frac{\sqrt{3}}{2}s$. Half the base times that height gives the area formula in the table.
- **Rhombus.** Its diagonals cross at right angles and cut each other in half. Each of the four small right triangles has legs $\frac{d_1}{2}$ and $\frac{d_2}{2}$ and hypotenuse equal to the side $s$. So any two of side, first diagonal and second diagonal give the third.
- **Isosceles trapezoid.** Drop a perpendicular from each end of the shorter parallel side. The two right triangles at the ends each have a horizontal leg of $\frac{b - a}{2}$, where $b$ is the longer parallel side, and the slanted side as hypotenuse. The vertical leg is the height.

A square is both a rectangle and a rhombus: its diagonals are equal, so $\frac{d \cdot d}{2} = \frac{d^2}{2}$ gives its area from the diagonal, and its diagonal is $s\sqrt{2}$.

### Circles, arcs and sectors

Turn whatever is given into the radius first. A circumference of $18\pi$ means $r = 9$ and an area of $81\pi$. A **sector** with central angle $\theta$ degrees is the fraction $\frac{\theta}{360}$ of the whole circle, so its area is $\frac{\theta}{360}\pi r^2$ and its arc is $\frac{\theta}{360} \cdot 2\pi r$. A quarter circle of radius 4 has area $4\pi$ and arc $2\pi$.

When a square sits inside a circle with its four corners on the circle, the square's diagonal is a diameter. When a circle sits inside a square touching all four sides, the circle's diameter equals the square's side. Read which one the question describes; the two give very different numbers.

### Composite regions: add or subtract

A shaded region is usually a big figure minus a small one, or two simple figures joined along a side. Name the pieces before calculating. "The region inside the circle but outside the square" is circle area minus square area. An L-shaped floor plan is two rectangles. Leave $\pi$ and roots in exact form until the end: the answer options usually do too.

### Scaling

If every length of a figure is multiplied by $k$, its perimeter is multiplied by $k$ and its area by $k^2$. Doubling the sides of a square multiplies its area by 4; a circle whose radius grows by 10% has an area $1.1^2 = 1.21$ times as large, 21% more. This is often the fastest route to an answer, and it is a good check on any area you compute.
`,
  examples: [
    {
      id: 'example-rhombus-diagonals',
      title: 'A rhombus from its diagonals',
      problemMd: md`A rhombus has diagonals of length 10 and 24. Find its area, its side, its perimeter and the distance between two opposite sides.`,
      steps: [
        md`Area from the diagonals: $\frac{10 \cdot 24}{2} = 120$.`,
        md`The diagonals bisect each other at right angles, so each of the four small right triangles has legs $5$ and $12$. The side is the hypotenuse: $\sqrt{25 + 144} = \sqrt{169} = 13$.`,
        md`Perimeter: $4 \cdot 13 = 52$.`,
        md`A rhombus is a parallelogram, so its area is also side times the height between opposite sides: $13h = 120$, which gives $h = \frac{120}{13}$.`,
        md`Check: the four small triangles each have area $\frac{5 \cdot 12}{2} = 30$, and $4 \cdot 30 = 120$, as before.`,
      ],
      answerMd: md`Area $120$, side $13$, perimeter $52$, distance between opposite sides $\frac{120}{13}$. Multiplying the diagonals without halving gives $240$, a common slip.`,
    },
    {
      id: 'example-isosceles-trapezoid',
      title: 'A trapezoid given its slanted sides',
      problemMd: md`An isosceles trapezoid has parallel sides 6 and 14 and each slanted side equal to 5. Find its area.`,
      steps: [
        md`Describe the figure: the longer side, 14, is the bottom; the shorter side, 6, is centred above it. Dropping a perpendicular from each end of the top side leaves a $6 \times h$ rectangle in the middle and two equal right triangles at the ends.`,
        md`Each end triangle has a horizontal leg of $\frac{14 - 6}{2} = 4$ and hypotenuse 5 (the slanted side).`,
        md`The height is the vertical leg: $\sqrt{25 - 16} = 3$, a $3, 4, 5$ triangle.`,
        md`Area: $\frac{(6 + 14) \cdot 3}{2} = 30$. Check by pieces: rectangle $6 \cdot 3 = 18$ plus two triangles of $\frac{4 \cdot 3}{2} = 6$ each gives $30$.`,
      ],
      answerMd: md`The area is $30$. Using the slanted side 5 as if it were the height gives $50$, which is too big: the height of a trapezoid is always shorter than its slanted sides.`,
    },
    {
      id: 'example-square-in-circle',
      title: 'A square inside a circle',
      problemMd: md`A square has its four vertices on a circle of radius 5. Find the area of the region inside the circle but outside the square.`,
      steps: [
        md`Corners on the circle means the square's diagonal passes through the centre and is a diameter: $d = 10$.`,
        md`Square area from the diagonal: $\frac{d^2}{2} = \frac{100}{2} = 50$. Check with the side: $s = \frac{10}{\sqrt{2}} = 5\sqrt{2}$, and $s^2 = 50$.`,
        md`Circle area: $\pi \cdot 5^2 = 25\pi$.`,
        md`The region is the difference: $25\pi - 50$. As a sense check, $25\pi$ is about $78.5$, so the region is about $28.5$, positive and smaller than the square, as the picture suggests.`,
      ],
      answerMd: md`The region has area $25\pi - 50$. Taking the square's side to be the diameter gives a square of area $100$, larger than the circle itself, which is impossible for a square drawn inside it.`,
    },
  ],
  traps: [
    {
      title: 'Using a slanted side as the height',
      md: md`In a trapezoid, parallelogram or non-right triangle the slanted side is longer than the height. Multiplying by it overstates the area. Whenever the height is not given, draw the perpendicular in your head and find it with the Pythagorean theorem.`,
    },
    {
      title: 'Forgetting the half',
      md: md`Triangle, rhombus and trapezoid formulas all contain a division by 2. Forgetting it doubles the answer, and the doubled value is a favourite wrong option. Check against a rough estimate: a rhombus must have less area than the rectangle built on its two diagonals.`,
    },
    {
      title: 'Treating a rhombus as a square',
      md: md`A rhombus has four equal sides, but its area is not $s^2$ unless its angles are right angles. With side 10, a rhombus can have any area up to 100. Use the diagonals, or side times height.`,
    },
    {
      title: 'Radius, diameter and inscribed or circumscribed',
      md: md`A square inside a circle has the diameter as its diagonal; a square around a circle has the diameter as its side. Mixing them changes the square's area by a factor of 2. Say which figure is inside before you write a number.`,
    },
  ],
  check: [
    {
      id: 'check-rhombus-side-diagonal',
      title: 'Rhombus from a side and a diagonal',
      topic: 'Plane geometry',
      stemMd: md`A rhombus has side 10 and one diagonal of length 12. What is its area?`,
      options: [
        { id: 'A', text: md`$48$`, note: md`This is the product of the half-diagonals, $6 \cdot 8$. The area is the product of the full diagonals divided by 2, which is twice this.` },
        { id: 'B', text: md`$96$`, note: '' },
        { id: 'C', text: md`$100$`, note: md`This treats the rhombus as a square of side 10. A rhombus has that area only when its angles are right angles, and then its diagonals would both be $10\sqrt{2}$, not 12.` },
        { id: 'D', text: md`$192$`, note: md`This multiplies the diagonals, $12 \cdot 16$, and forgets to divide by 2.` },
      ],
      answer: 'B',
      workingMd: md`The diagonals bisect each other at right angles, so half of the known diagonal (6) and half of the unknown one form a right triangle with the side 10 as hypotenuse. The unknown half is $\sqrt{100 - 36} = 8$, so the second diagonal is 16. Area: $\frac{12 \cdot 16}{2} = 96$.`,
      lesson: 'In a rhombus, the side and the two half-diagonals form a right triangle; find the missing diagonal before using the area formula.',
    },
    {
      id: 'check-square-inscribed-circle',
      title: 'A square inside a circle',
      topic: 'Plane geometry',
      stemMd: md`A circle has circumference $12\pi$. A square is drawn with all four vertices on the circle. What is the area of the square?`,
      options: [
        { id: 'A', text: md`$36$`, note: md`This makes the side of the square equal to the radius, 6. The radius reaches from the centre to a vertex, which is half the diagonal, not the side.` },
        { id: 'B', text: md`$72$`, note: '' },
        { id: 'C', text: md`$36\pi$`, note: md`This is the area of the circle, not of the square inside it.` },
        { id: 'D', text: md`$144$`, note: md`This makes the side equal to the diameter, 12. That is the square drawn around the circle, whose sides touch it; here the vertices are on the circle.` },
      ],
      answer: 'B',
      workingMd: md`From $2\pi r = 12\pi$, the radius is 6 and the diameter 12. The square's diagonal is a diameter, so its area is $\frac{12^2}{2} = 72$. Check: the side is $\frac{12}{\sqrt{2}} = 6\sqrt{2}$, and $(6\sqrt{2})^2 = 72$.`,
      lesson: 'A square with its vertices on a circle has a diameter as its diagonal, and its area is half the diagonal squared.',
    },
    {
      id: 'check-right-trapezoid',
      title: 'A right trapezoid',
      topic: 'Plane geometry',
      stemMd: md`A trapezoid has two right angles. Its parallel sides measure 7 and 13, and its slanted side measures 10. What is its area?`,
      options: [
        { id: 'A', text: md`$80$`, note: '' },
        { id: 'B', text: md`$100$`, note: md`This uses the slanted side 10 as the height. The height is the side perpendicular to the parallel sides, which is shorter than 10.` },
        { id: 'C', text: md`$104$`, note: md`This is the longer parallel side times the height, $13 \cdot 8$, as if the figure were a rectangle; it ignores the triangular corner that is missing.` },
        { id: 'D', text: md`$160$`, note: md`This is $(7 + 13) \cdot 8$: the sum of the parallel sides times the height, without dividing by 2.` },
      ],
      answer: 'A',
      workingMd: md`The two right angles sit on the side perpendicular to the parallel sides, so that side is the height. Dropping a perpendicular from the end of the shorter side leaves a right triangle with horizontal leg $13 - 7 = 6$ and hypotenuse 10, so the height is $\sqrt{100 - 36} = 8$. Area: $\frac{(7 + 13) \cdot 8}{2} = 80$.`,
      lesson: 'When a trapezoid gives a slanted side instead of a height, find the height from the right triangle that the slanted side closes.',
    },
  ],
  takeaways: [
    md`Triangle $\frac{1}{2}bh$, rhombus $\frac{d_1 d_2}{2}$, trapezoid $\frac{(a+b)h}{2}$, circle $\pi r^2$: three of the four divide by 2.`,
    'The missing height, side or diagonal almost always comes from a right triangle hidden in the figure.',
    'A square with its vertices on a circle has a diameter as its diagonal; a square around a circle has a diameter as its side.',
    md`Scaling every length by $k$ scales the area by $k^2$.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-plane-geometry-formulas' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
