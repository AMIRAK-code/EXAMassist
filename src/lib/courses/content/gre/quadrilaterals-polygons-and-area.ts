import { md, type Lesson } from '../../types';

export const quadrilateralsLesson: Lesson = {
  slug: 'quadrilaterals-polygons-and-area',
  title: 'Quadrilaterals, polygons, area and perimeter',
  summary: 'Know what each quadrilateral guarantees, find any polygon\'s angles, and compute areas of trapezoids, parallelograms and composite shapes.',
  minutes: 22,
  objectives: [
    'Find the interior angle sum of any polygon and each angle of a regular polygon.',
    'Use what parallelograms, rectangles, rhombuses, squares and trapezoids guarantee, and nothing more.',
    'Compute areas with perpendicular heights, including heights found from right triangles.',
    'Split or subtract composite figures into shapes with known areas.',
  ],
  teachMd: md`
### Angles of any polygon

Pick one vertex of a polygon with $n$ sides and draw every diagonal from it. The polygon falls into $n - 2$ triangles, and their angles together make up the polygon's angles. So

$$\text{sum of interior angles} = (n - 2) \times 180^\circ$$

| Sides $n$ | Interior sum | Each angle if regular |
| --- | --- | --- |
| 4 | $360^\circ$ | $90^\circ$ |
| 5 | $540^\circ$ | $108^\circ$ |
| 6 | $720^\circ$ | $120^\circ$ |
| 8 | $1080^\circ$ | $135^\circ$ |

The **exterior angles** (one at each vertex, made by extending a side) always add to $360^\circ$, whatever $n$ is: walking once round the polygon, you turn through one full turn. For a **regular** polygon (all sides and all angles equal) each exterior angle is $\frac{360}{n}$, and each interior angle is $180$ minus that. This is the fastest route from an angle to the number of sides: an interior angle of $150^\circ$ means an exterior angle of $30^\circ$, so $n = \frac{360}{30} = 12$.

### What each quadrilateral guarantees

| Shape | Defined by | Also guaranteed |
| --- | --- | --- |
| Parallelogram | both pairs of opposite sides parallel | opposite sides equal; opposite angles equal; neighbouring angles add to $180^\circ$; diagonals cut each other in half |
| Rectangle | four right angles | everything a parallelogram has; diagonals equal |
| Rhombus | four equal sides | everything a parallelogram has; diagonals perpendicular |
| Square | four equal sides and four right angles | everything above |
| Trapezoid | one pair of parallel sides | the two angles along each leg add to $180^\circ$ |

Each row inherits the rows it belongs to: a square is a rectangle and a rhombus, and both are parallelograms. The reverse never holds without proof. A quadrilateral with four equal sides is a rhombus, but it is a square only if one angle is known to be $90^\circ$. A figure that "looks like" a rectangle is just a quadrilateral until the question says otherwise.

### Area formulas, and why the height is perpendicular

| Shape | Area |
| --- | --- |
| Rectangle | $\ell w$ |
| Parallelogram | $bh$ |
| Trapezoid | $\frac{1}{2}(b_1 + b_2)h$ |
| Rhombus (or any quadrilateral with perpendicular diagonals) | $\frac{1}{2}d_1 d_2$ |
| Regular hexagon with side $s$ | six equilateral triangles: $\frac{3\sqrt{3}}{2}s^2$ |

A parallelogram is a rectangle with one end sliced off and moved to the other end: same base, same perpendicular height, same area. That is why its area is $bh$ and not the product of its two side lengths. The slanted side is longer than the height, so multiplying the two sides overstates the area. A trapezoid's area is its average base times its height. A rhombus is four right triangles whose legs are half-diagonals, so its area is half the product of the diagonals.

When the height is not given, look for a right triangle that contains it. Dropping perpendiculars from the ends of a trapezoid's shorter base splits off two right triangles at the ends. In a parallelogram with a $30^\circ$ angle, the slanted side is the hypotenuse of a 30-60-90 triangle, so the height is half the slanted side; with a $45^\circ$ angle it is the slanted side divided by $\sqrt{2}$.

### Perimeter is not area

Perimeter adds the lengths round the outside; area counts the squares inside. Fixing one does not fix the other. Rectangles with perimeter 20 include $9 \times 1$ (area 9) and $5 \times 5$ (area 25). Among rectangles with a given perimeter, the square has the largest area. In a quantitative comparison that gives only a perimeter, an area is usually not determined.

### Composite figures

A shaded region is usually one known shape minus another, or several known shapes side by side. Describe it to yourself in words first: "a 10 by 6 rectangle with a semicircle of diameter 6 removed from its right end" gives an area of $60 - \frac{1}{2}\pi(3)^2 = 60 - 4.5\pi$. For a perimeter, trace the actual boundary: a cut-out removes some edges and adds new ones, so perimeters are not subtracted the way areas are.
`,
  examples: [
    {
      id: 'example-regular-polygon',
      title: 'From an angle to the number of sides',
      problemMd: md`Find each interior angle of a regular octagon. Then find how many sides a regular polygon has if each interior angle is $144^\circ$.`,
      steps: [
        md`Octagon: interior sum $(8 - 2) \times 180 = 1080^\circ$, shared by 8 equal angles: $\frac{1080}{8} = 135^\circ$.`,
        md`Check with exterior angles: $\frac{360}{8} = 45^\circ$, and $180 - 45 = 135^\circ$.`,
        md`For the second polygon, each exterior angle is $180 - 144 = 36^\circ$, so $n = \frac{360}{36} = 10$.`,
        md`Check: $\frac{(10 - 2) \times 180}{10} = \frac{1440}{10} = 144^\circ$.`,
      ],
      answerMd: md`Each angle of a regular octagon is $135^\circ$, and an interior angle of $144^\circ$ means $10$ sides. Using $n \times 180$ instead of $(n - 2) \times 180$ is the usual slip.`,
    },
    {
      id: 'example-isosceles-trapezoid',
      title: 'A trapezoid with no height given',
      problemMd: md`A trapezoid has parallel sides of $10$ and $22$, and its two non-parallel sides each measure $10$. What is its area?`,
      steps: [
        md`Drop perpendiculars from both ends of the shorter base to the longer base. They cut the longer base into $6$, $10$ and $6$: the middle piece matches the short base, and the two equal legs make the two end pieces equal, $\frac{22 - 10}{2} = 6$.`,
        md`Each end is a right triangle with hypotenuse $10$ and base $6$, so the height is $\sqrt{100 - 36} = 8$ (a $6, 8, 10$ triangle).`,
        md`Area $= \frac{1}{2}(10 + 22) \times 8 = 16 \times 8 = 128$.`,
        md`Check by pieces: the middle rectangle is $10 \times 8 = 80$ and each end triangle is $\frac{1}{2} \times 6 \times 8 = 24$, so $80 + 24 + 24 = 128$.`,
      ],
      answerMd: md`The area is $128$. Using the slanted side as the height, $\frac{1}{2}(10 + 22) \times 10 = 160$, is the tempting wrong answer.`,
    },
    {
      id: 'example-rhombus',
      title: 'A rhombus from its diagonals',
      problemMd: md`The diagonals of a rhombus measure $12$ and $16$. Find its area and its perimeter.`,
      steps: [
        md`Area $= \frac{1}{2} \times 12 \times 16 = 96$.`,
        md`The diagonals of a rhombus bisect each other at right angles, making four right triangles with legs $6$ and $8$.`,
        md`Each side is a hypotenuse: $\sqrt{36 + 64} = 10$, so the perimeter is $4 \times 10 = 40$.`,
        md`Check the area by triangles: four triangles of $\frac{1}{2} \times 6 \times 8 = 24$ make $96$.`,
      ],
      answerMd: md`Area $96$, perimeter $40$. Multiplying the diagonals without halving, $12 \times 16 = 192$, doubles the area.`,
    },
  ],
  traps: [
    {
      title: 'The slanted side as the height',
      md: md`In a parallelogram or trapezoid the height is the perpendicular distance between the parallel sides. The slanted side is always longer unless the figure is a rectangle, so using it inflates the area. Find the height from a right triangle.`,
    },
    {
      title: 'Promoting a shape on its looks',
      md: md`A parallelogram is a rectangle only if an angle is $90^\circ$; a rhombus is a square only with a right angle too. Use the properties of the shape the question names, not the one the figure resembles.`,
    },
    {
      title: 'The wrong polygon formula',
      md: md`The interior sum is $(n - 2) \times 180^\circ$, not $n \times 180^\circ$. And keep interior and exterior apart: $\frac{360}{n}$ is the exterior angle of a regular polygon, not the interior one.`,
    },
    {
      title: 'Assuming a perimeter fixes the area',
      md: md`Many rectangles share a perimeter and have different areas. Unless a second fact (a side, a diagonal, a ratio) pins the shape down, the area is not determined.`,
    },
  ],
  check: [
    {
      id: 'check-parallelogram-area',
      title: 'A parallelogram with an obtuse angle',
      topic: 'Quadrilaterals',
      stemMd: md`A parallelogram has sides of length $8$ and $12$, and one of its angles measures $150^\circ$. What is its area?`,
      options: [
        { id: 'A', text: md`$24$`, note: md`Finds the height 4 correctly but then halves the area, as for a triangle. A parallelogram's area is base times height with no $\frac{1}{2}$.` },
        { id: 'B', text: md`$40$`, note: md`This is the perimeter, $2(8 + 12)$, not the area.` },
        { id: 'C', text: md`$48$`, note: '' },
        { id: 'D', text: md`$48\sqrt{3}$`, note: md`Takes the height as the long leg of the 30-60-90 triangle, $4\sqrt{3}$. The height faces the $30^\circ$ angle, so it is the short leg, 4.` },
        { id: 'E', text: md`$96$`, note: md`Multiplies the two sides, as if the parallelogram were a rectangle. The side of 8 leans, so it is longer than the height.` },
      ],
      answer: 'C',
      workingMd: md`Neighbouring angles add to $180^\circ$, so the acute angle is $30^\circ$. Drop a perpendicular from the end of the side of 8 to the line of the side of 12: it makes a 30-60-90 triangle with hypotenuse 8, and the height, opposite the $30^\circ$ angle, is $4$. Area $= 12 \times 4 = 48$.`,
      lesson: 'A 30 or 150 degree angle in a parallelogram means the height is half the slanted side.',
    },
    {
      id: 'check-polygon-sides',
      title: 'How many sides?',
      topic: 'Quantitative Comparison',
      stemMd: md`Each interior angle of a regular polygon measures $156^\circ$.

**Quantity A:** the number of sides of the polygon

**Quantity B:** $14$`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: '' },
        { id: 'B', text: 'Quantity B is greater.', note: md`Gets the direction backwards. A larger interior angle means a smaller exterior angle, so more sides: a 14-gon's interior angles are only about $154.3^\circ$, and $156^\circ$ needs more than 14 sides.` },
        { id: 'C', text: 'The two quantities are equal.', note: md`A regular 14-gon has interior angles of $\frac{12 \times 180}{14} \approx 154.3^\circ$, not $156^\circ$.` },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: md`In a regular polygon one interior angle fixes the number of sides, because the exterior angles must add to $360^\circ$.` },
      ],
      answer: 'A',
      workingMd: md`Each exterior angle is $180 - 156 = 24^\circ$, and the exterior angles add to $360^\circ$, so $n = \frac{360}{24} = 15$. Check: $\frac{13 \times 180}{15} = \frac{2340}{15} = 156^\circ$. Since $15 > 14$, Quantity A is greater.`,
      lesson: 'For a regular polygon, go through the exterior angle: 360 divided by it is the number of sides.',
    },
    {
      id: 'check-rectangle-diagonal',
      title: 'Area from perimeter and diagonal',
      topic: 'Area',
      stemMd: md`A rectangle has a perimeter of $34$ and a diagonal of length $13$. What is the area of the rectangle?`,
      options: [
        { id: 'A', text: md`$30$`, note: md`Halves the correct product: the area is the whole of $\ell w$, not half of it.` },
        { id: 'B', text: md`$60$`, note: '' },
        { id: 'C', text: md`$72.25$`, note: md`Treats the rectangle as a square with side $8.5$. A square with perimeter 34 has diagonal $8.5\sqrt{2} \approx 12.0$, not 13.` },
        { id: 'D', text: md`$120$`, note: md`This is $2\ell w$, the cross term in $(\ell + w)^2$, before dividing by 2.` },
        { id: 'E', text: md`$169$`, note: md`This is the diagonal squared, $\ell^2 + w^2$, not the product $\ell w$.` },
      ],
      answer: 'B',
      workingMd: md`Half the perimeter gives $\ell + w = 17$, and the diagonal gives $\ell^2 + w^2 = 169$. Squaring the first: $\ell^2 + 2\ell w + w^2 = 289$, so $2\ell w = 289 - 169 = 120$ and $\ell w = 60$. The sides are 12 and 5: $12 + 5 = 17$ and $144 + 25 = 169$.`,
      lesson: 'A sum of sides and a diagonal give the product through the square of the sum.',
    },
  ],
  takeaways: [
    md`Interior angles of an $n$-gon add to $(n - 2) \times 180^\circ$; exterior angles always add to $360^\circ$.`,
    'Use only the properties of the quadrilateral the question names.',
    'Areas need perpendicular heights; build a right triangle to find one.',
    'A perimeter alone does not fix an area.',
  ],
  practice: { examKey: 'gre', domain: 'quant-geometry', skill: 'geom-quadrilaterals' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
