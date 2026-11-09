import { md, type Lesson } from '../../types';

export const linesAndConicsLesson: Lesson = {
  slug: 'lines-and-conics',
  title: 'Lines and conics: secant, tangent or apart',
  summary: 'Decide whether a line cuts, touches or misses a circle or parabola, find the common points, and choose a parameter that makes the line tangent.',
  minutes: 22,
  objectives: [
    'Find the common points of a line and a circle or parabola by substitution.',
    'Classify the position of a line relative to a conic with the discriminant, or for a circle by comparing a distance with the radius.',
    'Find the value of a parameter for which a line is tangent to a conic, or meets it in two points.',
  ],
  teachMd: md`
### Three possible positions

A straight line and a circle can meet in two points (the line is a **secant**), in exactly one point (the line is **tangent**, touching the circle without crossing it), or not at all (the line is **external**). The same three cases describe a line and a parabola, with one exception covered below. Questions ask either for the position, for the common points themselves, or for the value of a parameter that produces a given position.

### Method 1: substitute and look at the discriminant

The common points satisfy both equations, so solve the system. Solve the line for one variable (usually $y$), substitute into the conic, and collect everything on one side. You get a second-degree equation in one unknown, the **resolvent equation**. Its discriminant $\Delta$ decides the position:

| Discriminant | Common points | Position |
| --- | --- | --- |
| $\Delta > 0$ | two | secant |
| $\Delta = 0$ | one (a double root) | tangent |
| $\Delta < 0$ | none | external |

If the question asks for the points, solve the resolvent equation and put each root back into the **line's** equation to get the other coordinate. The line is simpler, and each root gives exactly one point.

Only the discriminant's sign matters for the position, so you can often stop before solving. When the $x$-coefficient $b$ is even, the reduced discriminant $\frac{\Delta}{4} = \left(\frac{b}{2}\right)^2 - ac$ has the same sign and smaller numbers.

### Method 2 for circles: distance against radius

For a circle there is a quicker route. Compute the distance $d$ from the centre to the line with the point-to-line formula from the lesson on [points, distances and lines](/courses/bocconi/points-distances-and-lines), then compare it with the radius:

- $d < r$: secant;
- $d = r$: tangent;
- $d > r$: external.

This avoids expanding squares, and it is the natural method for questions such as "for which radius is this circle tangent to this line?". When $d$ and $r$ are both roots, compare $d^2$ and $r^2$ instead. Method 2 tells you the position but not the points; use method 1 when the points are asked for.

The tangent point itself is the foot of the perpendicular from the centre to the line. A tangent is always perpendicular to the radius at the point of contact, so the tangent at a point $T$ of a circle with centre $C$ is the line through $T$ perpendicular to $CT$.

### Parabolas: the vertical line exception

For a parabola $y = ax^2 + bx + c$ there is no centre, so method 1 is the tool. One case needs care. A **vertical** line $x = h$ meets this parabola in exactly one point, $(h, ah^2 + bh + c)$, but it is not tangent: it crosses the curve, parallel to the axis. Substitution here gives no quadratic at all, so the discriminant test does not apply. Only non-vertical lines are tangent when $\Delta = 0$.

### Parameters: tangent lines and families

Many questions contain a letter: "for which $q$ is the line $y = 2x + q$ tangent to the parabola?" Substitute, form the resolvent equation with $q$ still in it, and set $\Delta = 0$ (tangent), $\Delta > 0$ (two points) or $\Delta < 0$ (none). The result is an equation or inequality in the parameter.

Think about the picture to check the direction of an inequality. Lines $y = 2x + q$ are all parallel; as $q$ grows they slide upwards. For an upward-opening parabola, high lines cut it in two points and low lines miss it, so "two points" must come out as $q$ greater than the tangent value. If your inequality points the other way, look for a sign slip.

### A routine that works every time

1. Write the line as $y = \ldots$ (or $x = \ldots$ if that is simpler).
2. Substitute into the conic and move every term to one side.
3. Simplify, and divide by any common factor.
4. Use the sign of $\Delta$ for the position, or the roots for the points.
5. Check one common point in both original equations.
`,
  examples: [
    {
      id: 'example-line-circle-points',
      title: 'Common points of a line and a circle',
      problemMd: md`Find the common points of the line $y = x + 1$ and the circle $x^2 + y^2 = 13$.`,
      steps: [
        md`Substitute: $x^2 + (x + 1)^2 = 13$, so $2x^2 + 2x + 1 - 13 = 0$, that is $2x^2 + 2x - 12 = 0$. Divide by 2: $x^2 + x - 6 = 0$.`,
        md`$\Delta = 1 + 24 = 25 > 0$: the line is a secant. Factor: $(x + 3)(x - 2) = 0$, so $x = 2$ or $x = -3$.`,
        md`Back into the line: $x = 2$ gives $y = 3$; $x = -3$ gives $y = -2$.`,
        md`Check on the circle: $4 + 9 = 13$ and $9 + 4 = 13$. By method 2: the line $x - y + 1 = 0$ is $\frac{1}{\sqrt{2}}$ from the centre $(0, 0)$, well below $\sqrt{13}$.`,
      ],
      answerMd: md`The line cuts the circle at $(2, 3)$ and $(-3, -2)$. Expanding $(x + 1)^2$ as $x^2 + 1$ is the slip that wrecks this calculation.`,
    },
    {
      id: 'example-tangent-by-distance',
      title: 'Tangent by distance, and the point of contact',
      problemMd: md`Show that the line $2x + y + 1 = 0$ is tangent to the circle $(x - 1)^2 + (y - 2)^2 = 5$, and find the point of contact.`,
      steps: [
        md`Centre $(1, 2)$, radius $\sqrt{5}$.`,
        md`Distance from the centre to the line: $\frac{\lvert 2 + 2 + 1 \rvert}{\sqrt{4 + 1}} = \frac{5}{\sqrt{5}} = \sqrt{5}$, equal to the radius: tangent.`,
        md`The contact point is where the perpendicular from the centre meets the line. That perpendicular has direction $(2, 1)$, so its points are $(1 + 2t, 2 + t)$. On the line: $2(1 + 2t) + (2 + t) + 1 = 0$, so $5t + 5 = 0$ and $t = -1$, giving $(-1, 1)$.`,
        md`Check by method 1: $y = -2x - 1$ in the circle gives $(x - 1)^2 + (-2x - 3)^2 = 5$, which simplifies to $5x^2 + 10x + 5 = 0$, that is $(x + 1)^2 = 0$: a double root at $x = -1$, and $y = 1$.`,
      ],
      answerMd: md`The line is tangent at $(-1, 1)$.`,
    },
    {
      id: 'example-tangent-parameter-parabola',
      title: 'A tangent line to a parabola',
      problemMd: md`For which $q$ is the line $y = 2x + q$ tangent to the parabola $y = x^2 - 2x + 3$? For which $q$ does it meet the parabola in two points?`,
      steps: [
        md`Substitute: $x^2 - 2x + 3 = 2x + q$, so $x^2 - 4x + 3 - q = 0$.`,
        md`$\Delta = 16 - 4(3 - q) = 4 + 4q$.`,
        md`Tangent: $4 + 4q = 0$, so $q = -1$. The resolvent becomes $x^2 - 4x + 4 = (x - 2)^2 = 0$, so the contact point is $x = 2$, $y = 3$. Check on the parabola: $4 - 4 + 3 = 3$.`,
        md`Two points: $4 + 4q > 0$, so $q > -1$. This agrees with the picture: the parabola opens upwards, so lines above the tangent cut it twice.`,
      ],
      answerMd: md`Tangent for $q = -1$ (at $(2, 3)$); two common points for $q > -1$; none for $q < -1$.`,
    },
  ],
  traps: [
    {
      title: 'Comparing the distance with the radius squared',
      md: md`Method 2 compares $d$ with $r$, or $d^2$ with $r^2$, never $d$ with $r^2$. With $x^2 + y^2 = 9$, a line at distance 4 from the centre is external, even though $4 < 9$.`,
    },
    {
      title: 'One common point does not always mean tangent',
      md: md`A vertical line meets $y = ax^2 + bx + c$ exactly once and crosses it. Tangency needs a double root of a resolvent quadratic, not just a single common point.`,
    },
    {
      title: 'Sign slips when the parameter moves sides',
      md: md`Moving $q$ from the right to the left changes its sign: $x^2 - 2x + 3 = 2x + q$ becomes $x^2 - 4x + 3 - q = 0$. Losing that minus reverses every inequality that follows. Check the direction against a sketch.`,
    },
    {
      title: 'Expanding the square of a binomial',
      md: md`$(5 - x)^2 = 25 - 10x + x^2$. Dropping the middle term changes the discriminant, and often turns a secant into an external line on paper.`,
    },
  ],
  check: [
    {
      id: 'check-two-points-parameter',
      title: 'When does the line cut the parabola twice?',
      topic: 'Positions of lines and conics',
      stemMd: md`For which values of $q$ does the line $y = 2x + q$ meet the parabola $y = x^2 + 3$ in two distinct points?`,
      options: [
        { id: 'A', text: md`$q < 2$`, note: md`The direction is reversed. The parabola opens upwards, so the lines that cut it twice lie above the tangent line, with larger $q$. Try $q = 0$: $x^2 - 2x + 3 = 0$ has $\Delta = -8$, no points.` },
        { id: 'B', text: md`$q = 2$`, note: md`This is the tangent case, $\Delta = 0$, with a single common point at $(1, 4)$.` },
        { id: 'C', text: md`$q < -2$`, note: md`This comes from writing the resolvent as $x^2 - 2x + 3 + q = 0$, keeping the sign of $q$ when moving it across.` },
        { id: 'D', text: md`$q > 2$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Substitute: $x^2 + 3 = 2x + q$, so $x^2 - 2x + 3 - q = 0$. Then $\Delta = 4 - 4(3 - q) = 4q - 8$, and two points need $4q - 8 > 0$, so $q > 2$. Check with $q = 3$: $x^2 - 2x = 0$ gives $x = 0$ and $x = 2$, two points.`,
      lesson: 'Set the discriminant of the resolvent equation positive for two points, and check the direction with one test value.',
    },
    {
      id: 'check-line-circle-points',
      title: 'Common points with a circle',
      topic: 'Positions of lines and conics',
      stemMd: md`What are the common points of the line $x + y = 5$ and the circle $x^2 + y^2 - 2x - 2y - 3 = 0$?`,
      options: [
        { id: 'A', text: md`$(2, 3)$ only`, note: md`This stops at one root. The resolvent $x^2 - 5x + 6 = 0$ has two distinct roots ($\Delta = 1$), so the line is a secant, not a tangent.` },
        { id: 'B', text: md`None`, note: md`This comes from expanding $(5 - x)^2$ as $25 + x^2$, dropping $-10x$: the resolvent becomes $2x^2 + 12 = 0$, which has no roots.` },
        { id: 'C', text: md`$(2, 3)$ and $(3, 2)$`, note: '' },
        { id: 'D', text: md`$(-2, 7)$ and $(-3, 8)$`, note: md`The roots of $x^2 - 5x + 6 = 0$ were taken with the wrong sign. They are $2$ and $3$; the points listed are on the line but not on the circle.` },
      ],
      answer: 'C',
      workingMd: md`Substitute $y = 5 - x$: $x^2 + 25 - 10x + x^2 - 2x - 10 + 2x - 3 = 0$, so $2x^2 - 10x + 12 = 0$, that is $x^2 - 5x + 6 = 0$, with roots $x = 2$ and $x = 3$. The line gives $y = 3$ and $y = 2$. Check $(3, 2)$ on the circle: $9 + 4 - 6 - 4 - 3 = 0$.`,
      lesson: 'Substitute the line into the circle, solve the resolvent, and take each root back to the line for its partner coordinate.',
    },
    {
      id: 'check-tangent-radius',
      title: 'Choosing the radius for tangency',
      topic: 'Positions of lines and conics',
      stemMd: md`For which radius $r > 0$ is the circle $x^2 + y^2 = r^2$ tangent to the line $3x - 4y + 20 = 0$?`,
      options: [
        { id: 'A', text: md`$4$`, note: '' },
        { id: 'B', text: md`$\frac{20}{7}$`, note: md`This divides by $3 + 4$ instead of by $\sqrt{3^2 + 4^2} = 5$ in the distance formula.` },
        { id: 'C', text: md`$16$`, note: md`16 is $r^2$, the value of the right-hand side of the circle's equation, not the radius.` },
        { id: 'D', text: md`$20$`, note: md`This takes the constant term as the distance and forgets to divide by $\sqrt{a^2 + b^2}$.` },
      ],
      answer: 'A',
      workingMd: md`The centre is the origin. Its distance from the line is $\frac{\lvert 0 - 0 + 20 \rvert}{\sqrt{9 + 16}} = \frac{20}{5} = 4$. Tangency means the radius equals that distance: $r = 4$.`,
      lesson: 'A circle is tangent to a line exactly when the distance from its centre to the line equals the radius.',
    },
  ],
  takeaways: [
    md`Substitute the line into the conic: $\Delta > 0$ secant, $\Delta = 0$ tangent, $\Delta < 0$ external.`,
    md`For a circle, compare the centre-to-line distance $d$ with $r$: smaller cuts, equal touches, larger misses.`,
    'A vertical line meets a vertical-axis parabola once without being tangent.',
    'With a parameter, solve the discriminant condition and check the direction with one test value.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-analytic-line-conic-positions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
