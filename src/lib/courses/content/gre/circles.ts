import { md, type Lesson } from '../../types';

export const circlesLesson: Lesson = {
  slug: 'circles',
  title: 'Circles: arcs, sectors, inscribed angles and tangents',
  summary: 'Work from the radius to circumference, area, arcs and sectors, and use inscribed angles and tangents to turn circle questions into triangle questions.',
  minutes: 20,
  objectives: [
    'Find circumference, area, arc length and sector area from the radius and a central angle.',
    'Relate an inscribed angle to the central angle on the same arc.',
    'Use the right angle between a tangent and a radius, and the equal radii, to build triangles.',
  ],
  teachMd: md`
### Everything starts from the radius

A circle is every point at one fixed distance, the **radius** $r$, from its centre. The **diameter** is $2r$. Two formulas carry most questions:

$$C = 2\pi r = \pi d \qquad A = \pi r^2$$

Whatever the question gives you (a diameter, a circumference, an area), turn it into the radius first; from there every other measure is one step away. A circumference of $10\pi$ means $r = 5$ and an area of $25\pi$. An area of $49\pi$ means $r = 7$ and a circumference of $14\pi$.

Answers to circle questions are usually left in terms of $\pi$. When you need a size, $\pi \approx 3.14$, a little more than 3.

Because circumference grows with $r$ and area with $r^2$, doubling the radius doubles the circumference but multiplies the area by four. All circles are similar to one another, so this is the scaling rule from the similarity lesson at work.

### Arcs and sectors are fractions of the whole

A **central angle** has its vertex at the centre. Its two radii cut off an **arc** of the circle and a **sector** (a pie slice) of its area. Both are the same fraction of the whole as the angle is of $360^\circ$:

$$\text{arc length} = \frac{\theta}{360} \times 2\pi r \qquad \text{sector area} = \frac{\theta}{360} \times \pi r^2$$

An arc has two different measures, and a question can ask for either. Its **degree measure** equals the central angle, whatever the size of the circle. Its **length** is a distance, and depends on the radius. A $60^\circ$ arc is one sixth of any circle, but it is $2\pi$ long on a circle of radius 6 and $\pi$ long on a circle of radius 3.

The **perimeter of a sector** is the arc plus the two radii. Forgetting the radii is a common way to lose an easy mark.

### Inscribed angles

An **inscribed angle** has its vertex on the circle and its sides along two chords. It measures **half the central angle** that cuts off the same arc. If central angle $AOB$ is $100^\circ$, then every inscribed angle $ACB$ with $C$ on the far side of the circle (the longer arc) is $50^\circ$, wherever $C$ sits on that arc.

Two consequences come up often:

- **An angle inscribed in a semicircle is a right angle.** If $AB$ is a diameter, the central angle is $180^\circ$, so any angle $ACB$ with $C$ on the circle is $90^\circ$. A triangle drawn inside a circle with one side along a diameter is therefore a right triangle, and the Pythagorean theorem applies.
- **Inscribed angles on the same arc are equal.** Points $C$ and $D$ on the same side of chord $AB$ see it at the same angle.

If $C$ is on the short arc instead, angle $ACB$ cuts off the other arc, $360 - 100 = 260^\circ$, and measures $130^\circ$.

### Chords, radii and tangents

Any two radii are equal, so a triangle with two vertices on a circle and the third at the centre is isosceles. Look for those triangles whenever a chord and the centre appear together. The line from the centre perpendicular to a chord cuts the chord in half; with the radius as hypotenuse, that is a right triangle.

A **tangent** touches the circle at exactly one point, and it is **perpendicular to the radius** drawn to that point. The radius, the tangent segment and the line from the centre to the outside point form a right triangle whose hypotenuse runs from the centre to the outside point.

### Describing a circle figure in words

A circle figure is fully described by its centre, its radius or diameter, the points that lie on the circle, and the chords, radii and tangents drawn between them. When you meet one, write down each fact in that form ("$O$ is the centre, $OA = OB = 6$, $PT$ is tangent at $T$") before you start; most of the work is spotting the equal radii and the right angles those facts imply.
`,
  examples: [
    {
      id: 'example-sector',
      title: 'Arc length and sector area',
      problemMd: md`A circle has radius $9$. A central angle of $80^\circ$ cuts off an arc and a sector. Find the arc length, the sector area and the sector's perimeter.`,
      steps: [
        md`The fraction of the circle is $\frac{80}{360} = \frac{2}{9}$.`,
        md`Circumference $= 2\pi \times 9 = 18\pi$, so the arc length is $\frac{2}{9} \times 18\pi = 4\pi$.`,
        md`Area $= \pi \times 9^2 = 81\pi$, so the sector area is $\frac{2}{9} \times 81\pi = 18\pi$.`,
        md`The sector's perimeter adds the two radii to the arc: $4\pi + 18 \approx 30.6$.`,
      ],
      answerMd: md`Arc length $4\pi$, sector area $18\pi$, sector perimeter $4\pi + 18$. Giving $4\pi$ as the perimeter is the tempting slip: it leaves out the two straight edges.`,
    },
    {
      id: 'example-inscribed-angle',
      title: 'Inscribed angle on either arc',
      problemMd: md`Points $A$, $B$ and $C$ lie on a circle with centre $O$. Angle $AOB$ measures $110^\circ$. Find angle $ACB$ when $C$ lies on the longer arc $AB$, and when $C$ lies on the shorter arc $AB$.`,
      steps: [
        md`With $C$ on the longer arc, angle $ACB$ cuts off the shorter arc, whose central angle is $110^\circ$. Half of it: $55^\circ$.`,
        md`With $C$ on the shorter arc, angle $ACB$ cuts off the longer arc, whose central angle is $360 - 110 = 250^\circ$. Half of it: $125^\circ$.`,
        md`Check: $A$, $C_1$, $B$, $C_2$ form a quadrilateral inscribed in the circle, and $55 + 125 = 180$, as opposite angles of such a quadrilateral must be.`,
      ],
      answerMd: md`$55^\circ$ on the longer arc and $125^\circ$ on the shorter arc. Taking the inscribed angle equal to the central angle, $110^\circ$, is the tempting wrong answer.`,
    },
    {
      id: 'example-tangent',
      title: 'A tangent from an outside point',
      problemMd: md`A circle has centre $O$ and radius $5$. Point $P$ lies outside the circle with $OP = 13$. Line $PT$ is tangent to the circle at $T$. Find $PT$ and the area of triangle $OTP$.`,
      steps: [
        md`The radius $OT$ is perpendicular to the tangent at $T$, so triangle $OTP$ has a right angle at $T$, with hypotenuse $OP = 13$.`,
        md`$PT = \sqrt{13^2 - 5^2} = \sqrt{169 - 25} = \sqrt{144} = 12$, a $5, 12, 13$ triangle.`,
        md`The legs $OT$ and $PT$ are base and height: area $= \frac{1}{2} \times 5 \times 12 = 30$.`,
      ],
      answerMd: md`$PT = 12$ and the area of triangle $OTP$ is $30$. Treating $OP$ as a leg and adding squares, $\sqrt{169 + 25} = \sqrt{194}$, misses that the right angle is at $T$.`,
    },
  ],
  traps: [
    {
      title: 'Diameter in place of radius',
      md: md`A question that gives a diameter of 12 needs $r = 6$ in both formulas. Using 12 in $\pi r^2$ gives an area four times too large. Write $r = $ on your scratch paper before anything else.`,
    },
    {
      title: 'Inscribed angle equal to the central angle',
      md: md`The angle at the centre is twice the angle at the circle on the same arc. If a question gives a central angle and asks for an angle with its vertex on the circle, halve it; if it gives the inscribed angle, double it to get the arc.`,
    },
    {
      title: 'Arc degrees versus arc length',
      md: md`"The arc measures $60^\circ$" and "the arc is $2\pi$ long" are different kinds of statement. Degrees describe the fraction of the circle; length needs the radius as well.`,
    },
    {
      title: 'Not drawing the radius to the tangent point',
      md: md`A tangent on its own gives no numbers. The right angle only appears once you draw the radius to the point of contact, and that right angle is usually the key to the question.`,
    },
  ],
  check: [
    {
      id: 'check-arc-from-area',
      title: 'An arc from the area',
      topic: 'Circles',
      stemMd: md`A circle has area $36\pi$. What is the length of an arc cut off by a central angle of $60^\circ$?`,
      options: [
        { id: 'A', text: md`$\pi$`, note: md`Takes 6 as the diameter, so uses $r = 3$. An area of $36\pi$ means $r^2 = 36$, so the radius itself is 6.` },
        { id: 'B', text: md`$2\pi$`, note: '' },
        { id: 'C', text: md`$6\pi$`, note: md`This is the sector area, $\frac{60}{360} \times 36\pi$, not the arc length.` },
        { id: 'D', text: md`$10\pi$`, note: md`This is the longer arc, the other $300^\circ$ of the circle.` },
        { id: 'E', text: md`$12\pi$`, note: md`This is the whole circumference; the arc is only one sixth of it.` },
      ],
      answer: 'B',
      workingMd: md`From $\pi r^2 = 36\pi$, $r = 6$, so the circumference is $12\pi$. A $60^\circ$ arc is $\frac{60}{360} = \frac{1}{6}$ of the circle, so its length is $\frac{1}{6} \times 12\pi = 2\pi$.`,
      lesson: 'Turn any given measure into the radius, then take the angle\'s fraction of the circumference.',
    },
    {
      id: 'check-inscribed-comparison',
      title: 'Where on the arc?',
      topic: 'Quantitative Comparison',
      stemMd: md`Points $A$, $B$ and $C$ lie on a circle with centre $O$. Angle $AOB$ measures $100^\circ$, and $C$ lies somewhere on the longer arc $AB$; its exact position is not given.

**Quantity A:** the measure of angle $ACB$, in degrees

**Quantity B:** $50$`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: md`Treats the inscribed angle as equal to the central angle, $100^\circ$, or assumes it grows as $C$ moves. An inscribed angle is half the central angle on the same arc.` },
        { id: 'B', text: 'Quantity B is greater.', note: md`There is no reason for the angle to fall below half the central angle; every inscribed angle on that arc is exactly half.` },
        { id: 'C', text: 'The two quantities are equal.', note: '' },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: md`Assumes the angle depends on where $C$ sits. Any point on the longer arc gives the same angle, because they all cut off the same shorter arc.` },
      ],
      answer: 'C',
      workingMd: md`With $C$ on the longer arc, angle $ACB$ cuts off the shorter arc $AB$, whose central angle is $100^\circ$. An inscribed angle is half the central angle on the same arc, so angle $ACB = 50^\circ$ for every such $C$.`,
      lesson: 'Inscribed angles on the same arc are all equal, so a point\'s exact position on that arc does not matter.',
    },
    {
      id: 'check-tangent-distance',
      title: 'The nearest point of the circle',
      topic: 'Circles',
      stemMd: md`Line $PT$ is tangent at point $T$ to a circle with centre $O$ and radius $8$, and $PT = 15$. What is the shortest distance from $P$ to a point on the circle?`,
      options: [
        { id: 'A', text: md`$7$`, note: md`Subtracts the radius from the tangent length. The tangent segment does not point at the centre, so the radius cannot be taken off it.` },
        { id: 'B', text: md`$9$`, note: '' },
        { id: 'C', text: md`$15$`, note: md`This is the distance to $T$. $T$ is on the circle, but the point on line $PO$ is closer.` },
        { id: 'D', text: md`$17$`, note: md`This is the distance from $P$ to the centre, not to the circle.` },
        { id: 'E', text: md`$25$`, note: md`This is the distance to the farthest point of the circle, $17 + 8$.` },
      ],
      answer: 'B',
      workingMd: md`The radius $OT$ is perpendicular to the tangent, so $OP = \sqrt{8^2 + 15^2} = \sqrt{64 + 225} = \sqrt{289} = 17$ (an $8, 15, 17$ triangle). The nearest point of the circle lies on segment $PO$, one radius from $O$, so the distance is $17 - 8 = 9$.`,
      lesson: 'Draw the radius to the point of tangency: the right angle there turns the question into a Pythagorean one.',
    },
  ],
  takeaways: [
    md`Turn every given measure into the radius first; $C = 2\pi r$, $A = \pi r^2$.`,
    md`Arcs and sectors are the fraction $\frac{\theta}{360}$ of the circumference and of the area.`,
    'An inscribed angle is half the central angle on the same arc; an angle in a semicircle is a right angle.',
    'A tangent is perpendicular to the radius at the point of contact.',
  ],
  practice: { examKey: 'gre', domain: 'quant-geometry', skill: 'geom-circles' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
