import { md, type Lesson } from '../../types';

export const threeDimensionalLesson: Lesson = {
  slug: 'three-dimensional-figures',
  title: 'Three-dimensional figures: volume, surface area and diagonals',
  metaTitle: 'Three-dimensional figures: volume, surface area, diagonals',
  summary: 'Find volumes and surface areas of boxes, cubes, cylinders and prisms, scale them correctly, and count how many objects really fit inside.',
  minutes: 20,
  objectives: [
    'Find the volume and surface area of a rectangular solid, a cube, a cylinder and a right prism.',
    'Find the space diagonal of a box with the Pythagorean theorem.',
    'Scale surface areas and volumes when every length changes by the same factor.',
    'Count how many objects fit in a container dimension by dimension.',
  ],
  teachMd: md`
### One idea behind most volumes

A solid whose cross-section stays the same from one end to the other (a box, a cube, a cylinder, any right prism) has

$$\text{volume} = \text{area of the base} \times \text{height}$$

Picture stacking identical thin slices of the base, one on another, until the stack is as tall as the solid. That single idea gives every formula below, so you need to remember the base area, not a list.

| Solid | Volume | Surface area |
| --- | --- | --- |
| Rectangular solid $\ell \times w \times h$ | $\ell w h$ | $2(\ell w + \ell h + w h)$ |
| Cube with edge $s$ | $s^3$ | $6s^2$ |
| Cylinder, radius $r$, height $h$ | $\pi r^2 h$ | $2\pi r^2 + 2\pi r h$ |
| Right prism | base area $\times$ height | two bases plus the rectangular sides |

### Surface area: list the faces

Surface area is the total area of everything you could paint on the outside. A box has three pairs of matching rectangles, which is where the $2(\ell w + \ell h + wh)$ comes from. A cylinder has two circular ends, $2\pi r^2$, and a curved side. Unroll the side and it becomes a rectangle whose width is the circumference $2\pi r$ and whose height is $h$, so its area is $2\pi r h$.

Read what a question wants painted or covered. An open-topped tank has only one circular end; a label round a can covers only the curved side (the lateral area). Listing the faces in words before you add saves you from including a face that is not there or missing one that is.

### The space diagonal

The longest straight segment inside a box runs from one corner to the opposite corner, through the middle. Find it with two right triangles. The diagonal of the floor is $\sqrt{\ell^2 + w^2}$. That floor diagonal and the vertical edge $h$ are the legs of a second right triangle standing upright inside the box, so

$$d = \sqrt{\ell^2 + w^2 + h^2}$$

For a cube with edge $s$ this is $s\sqrt{3}$. A box measuring $3 \times 4 \times 12$ has a space diagonal of $\sqrt{9 + 16 + 144} = \sqrt{169} = 13$.

### Describing a solid in words

Without a picture, a solid is fixed by naming its shape and its measurements: "a cylinder standing on one circular end, with radius 3 and height 10", or "a box with a square base of side 4 and height 9". When a solid is cut, filled or stacked, say what changes and what stays fixed. Pouring water from one container into another keeps the **volume** of water; the new depth comes from dividing that volume by the new base area.

### Scaling

If every length of a solid is multiplied by $k$, its surface area is multiplied by $k^2$ and its volume by $k^3$. Double a cube's edge and its surface area becomes 4 times as large while its volume becomes 8 times as large. Volume ratios grow much faster than length ratios: a cube with three times the edge holds 27 times as much.

### Units and fitting

Cubic units convert by the cube of the length factor: 1 metre is 100 centimetres, so $1 \text{ m}^3 = 100^3 = 1{,}000{,}000 \text{ cm}^3$.

When rigid objects are packed into a container, **do not divide volumes**. Work one dimension at a time: how many fit along the length, along the width and up the height, each rounded **down** to a whole number, then multiply. Space left over in one direction cannot be combined with space left over in another, because a cube cannot be cut to fill the gaps. Dividing volumes gives only an upper bound that is often not reachable.

### Beyond boxes and cylinders

Geometry is one of the four content areas of the Quantitative Reasoning measure. This lesson covers solids with a constant cross-section, where base times height applies. For any solid, the same habits work: name each face or base in words, find its area with the plane formulas, and keep track of which measurements are lengths, areas and volumes.
`,
  examples: [
    {
      id: 'example-box',
      title: 'Volume, surface area and diagonal of a box',
      problemMd: md`A rectangular box measures $3$ by $4$ by $12$. Find its volume, its total surface area and the length of its space diagonal.`,
      steps: [
        md`Volume: $3 \times 4 \times 12 = 144$.`,
        md`Surface area: the three pairs of faces have areas $3 \times 4 = 12$, $3 \times 12 = 36$ and $4 \times 12 = 48$, so the total is $2(12 + 36 + 48) = 2 \times 96 = 192$.`,
        md`Space diagonal: the floor diagonal of the $3 \times 4$ face is $5$; with the edge $12$ it forms a $5, 12, 13$ right triangle, so $d = 13$. The formula agrees: $\sqrt{9 + 16 + 144} = \sqrt{169} = 13$.`,
      ],
      answerMd: md`Volume $144$, surface area $192$, space diagonal $13$. Adding the three face areas once, $12 + 36 + 48 = 96$, gives the tempting wrong surface area: each face has a matching opposite face.`,
    },
    {
      id: 'example-pouring',
      title: 'Pouring water between cylinders',
      problemMd: md`A cylindrical tank of radius $3$ and height $10$ holds water to a depth of $4$. All of the water is poured into an empty cylinder of radius $2$. How deep is the water in the second cylinder?`,
      steps: [
        md`The volume of water stays the same. In the first tank it is $\pi \times 3^2 \times 4 = 36\pi$.`,
        md`In the second cylinder the base area is $\pi \times 2^2 = 4\pi$.`,
        md`Depth $= \frac{36\pi}{4\pi} = 9$.`,
        md`Check by ratios: the base area falls from $9\pi$ to $4\pi$, by a factor of $\frac{9}{4}$, so the depth rises by the same factor: $4 \times \frac{9}{4} = 9$.`,
      ],
      answerMd: md`The water is $9$ deep. Scaling the depth by the ratio of the radii, $4 \times \frac{3}{2} = 6$, is the tempting wrong answer; base areas go with the square of the radius.`,
    },
    {
      id: 'example-packing',
      title: 'How many cubes really fit',
      problemMd: md`A box has inside dimensions $10$ by $7$ by $5$. How many cubes with edge $2$ can be packed inside it, with their faces parallel to the box's faces?`,
      steps: [
        md`Along the 10 side: $\frac{10}{2} = 5$ cubes. Along the 7 side: $\frac{7}{2} = 3.5$, so $3$ cubes. Along the 5 side: $\frac{5}{2} = 2.5$, so $2$ cubes.`,
        md`Multiply the whole numbers: $5 \times 3 \times 2 = 30$ cubes.`,
        md`Compare with dividing volumes: $\frac{10 \times 7 \times 5}{2^3} = \frac{350}{8} = 43.75$. The extra space is a slab 1 unit thick along one side and another along the top, and no whole cube fits in either.`,
      ],
      answerMd: md`$30$ cubes fit. Dividing the volumes and rounding down to 43 is the tempting wrong answer.`,
    },
  ],
  traps: [
    {
      title: 'Scaling a volume by the length factor',
      md: md`Multiply every length by $k$ and the volume grows by $k^3$, the surface area by $k^2$. A container with twice the height, width and length holds 8 times as much, not twice as much.`,
    },
    {
      title: 'Missing or extra faces',
      md: md`Total surface area counts every face; lateral area leaves out the bases; an open box has no top. Read which surface is meant, then list the faces in words before adding their areas.`,
    },
    {
      title: 'Diameter in a cylinder formula',
      md: md`$\pi r^2 h$ uses the radius. A cylinder "8 across" has $r = 4$, and using 8 makes the volume four times too large.`,
    },
    {
      title: 'Dividing volumes to count objects',
      md: md`Rigid objects fit dimension by dimension. Round each count down, then multiply. The volume ratio is an upper limit, not the answer.`,
    },
  ],
  check: [
    {
      id: 'check-cube-volume',
      title: 'A cube from its surface area',
      topic: 'Volume',
      stemMd: md`A cube has a total surface area of $96$. What is its volume?`,
      options: [
        { id: 'A', text: md`$16$`, note: md`This is the area of one face, $\frac{96}{6}$. The volume needs the edge, 4, cubed.` },
        { id: 'B', text: md`$24$`, note: md`Divides the surface area by 4, as if the cube had only four faces, and stops there.` },
        { id: 'C', text: md`$64$`, note: '' },
        { id: 'D', text: md`$96$`, note: md`Takes the volume equal to the surface area. They are different kinds of measure and equal only for a cube of edge 6.` },
        { id: 'E', text: md`$216$`, note: md`Uses 6, the number of faces, as the edge length: $6^3$.` },
      ],
      answer: 'C',
      workingMd: md`Six equal faces share the surface area, so each face is $\frac{96}{6} = 16$ and the edge is $\sqrt{16} = 4$. The volume is $4^3 = 64$.`,
      lesson: 'From a cube\'s surface area, divide by 6, take the square root for the edge, then cube it.',
    },
    {
      id: 'check-two-cylinders',
      title: 'Which cylinder holds more?',
      topic: 'Quantitative Comparison',
      stemMd: md`Cylinder $P$ has radius $3$ and height $8$. Cylinder $Q$ has radius $4$ and height $6$.

**Quantity A:** the volume of cylinder $P$

**Quantity B:** the volume of cylinder $Q$`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: md`Favours the taller cylinder. Height enters the volume once, but the radius enters squared.` },
        { id: 'B', text: 'Quantity B is greater.', note: '' },
        { id: 'C', text: 'The two quantities are equal.', note: md`Notices that radius times height is 24 for both. The volume uses radius squared times height, which differs.` },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: md`Both radii and both heights are given, so both volumes can be computed exactly.` },
      ],
      answer: 'B',
      workingMd: md`Volume of $P$: $\pi \times 3^2 \times 8 = 72\pi$. Volume of $Q$: $\pi \times 4^2 \times 6 = 96\pi$. Since $96\pi > 72\pi$, Quantity B is greater.`,
      lesson: 'In a cylinder the radius counts twice, so a wider cylinder can beat a taller one.',
    },
    {
      id: 'check-packing-cubes',
      title: 'Packing a box',
      topic: 'Three-dimensional figures',
      stemMd: md`A box has inside dimensions $9$ by $9$ by $4$. Cubes with edge $2$ are packed inside it, with their faces parallel to the box's faces. What is the greatest number of cubes that can fit?`,
      options: [
        { id: 'A', text: md`$16$`, note: md`Counts only one layer of cubes on the floor. The height of 4 holds two layers.` },
        { id: 'B', text: md`$32$`, note: '' },
        { id: 'C', text: md`$40$`, note: md`Divides the volumes, $\frac{324}{8} = 40.5$, and rounds down. The half-unit gaps along two sides cannot be combined into whole cubes.` },
        { id: 'D', text: md`$50$`, note: md`Rounds $4.5$ up to 5 along each 9 side. A fifth cube would stick out of the box.` },
        { id: 'E', text: md`$162$`, note: md`Divides the volume by the edge, $\frac{324}{2}$, instead of by the cube's volume, $2^3 = 8$.` },
      ],
      answer: 'B',
      workingMd: md`Along each 9 side, $\frac{9}{2} = 4.5$, so 4 cubes fit. Along the 4 side, 2 cubes fit. The greatest number is $4 \times 4 \times 2 = 32$.`,
      lesson: 'Count rigid objects one dimension at a time, rounding each count down before you multiply.',
    },
  ],
  takeaways: [
    'Constant cross-section: volume is base area times height.',
    'Surface area is the sum of the faces; list them before adding.',
    md`Space diagonal of a box: $\sqrt{\ell^2 + w^2 + h^2}$.`,
    md`Lengths scale by $k$, areas by $k^2$, volumes by $k^3$.`,
    'To count objects that fit, round down in each dimension, then multiply.',
  ],
  practice: { examKey: 'gre', domain: 'quant-geometry', skill: 'geom-three-dimensional-figures' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
