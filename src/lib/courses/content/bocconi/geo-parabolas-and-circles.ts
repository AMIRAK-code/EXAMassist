import { md, type Lesson } from '../../types';

export const parabolasAndCirclesLesson: Lesson = {
  slug: 'parabolas-and-circles',
  title: 'Parabolas and circles: equations, centres and vertices',
  summary: 'Read the centre and radius of a circle and the vertex, axis and direction of a parabola straight from their equations, and build the equations back.',
  minutes: 22,
  objectives: [
    'Find the centre and radius of a circle from its equation, by formula or by completing the square, and tell when an equation is not a circle.',
    md`Find the vertex, axis, direction and intercepts of a parabola $y = ax^2 + bx + c$.`,
    'Write the equation of a circle or parabola from given points, a centre and radius, or a vertex.',
  ],
  teachMd: md`
### The circle: every point at one distance from the centre

A circle with centre $C(x_0, y_0)$ and radius $r$ is the set of points $(x, y)$ at distance $r$ from $C$. Squaring the distance formula gives its equation:

$$(x - x_0)^2 + (y - y_0)^2 = r^2$$

Watch the signs: $(x + 3)^2 + (y - 1)^2 = 4$ has centre $(-3, 1)$ and radius $2$, because $x + 3 = x - (-3)$. And the right-hand side is $r^2$, so the radius is its square root.

### The expanded form

Multiplying out gives the form questions usually use:

$$x^2 + y^2 + ax + by + c = 0$$

Read the centre and radius from it with two rules:

$$\text{centre} = \left(-\frac{a}{2}, -\frac{b}{2}\right) \qquad r^2 = \frac{a^2}{4} + \frac{b^2}{4} - c$$

Both come from completing the square. For $x^2 - 6x$, half of $-6$ is $-3$, and $x^2 - 6x = (x - 3)^2 - 9$. Doing the same in $y$ and moving the constants across gives the centre form. Completing the square is slower than the formulas but works when you have forgotten them, so practise both.

Three conditions make an equation of this kind a circle:

- the coefficients of $x^2$ and $y^2$ are **equal** (if both are 2, divide the whole equation by 2 first);
- there is **no $xy$ term**;
- the computed $r^2$ is **positive**. If $r^2 = 0$ the "circle" is a single point; if $r^2 < 0$ no point satisfies the equation at all.

A circle with centre $(x_0, y_0)$ touches the $x$-axis exactly when $\lvert y_0 \rvert = r$, and touches the $y$-axis when $\lvert x_0 \rvert = r$. It passes through the origin exactly when $c = 0$.

### The parabola with a vertical axis

The graph of $y = ax^2 + bx + c$ with $a \neq 0$ is a parabola whose axis of symmetry is vertical. Picture a U shape: it opens **upwards** if $a > 0$ (the vertex is the lowest point) and **downwards** if $a < 0$ (the vertex is the highest point). The larger $\lvert a \rvert$, the narrower the U.

The **vertex** has

$$x_V = -\frac{b}{2a}$$

and its $y$-coordinate comes from substituting $x_V$ into the equation. The axis of symmetry is the vertical line $x = x_V$. Other landmarks follow at once:

- the **$y$-intercept** is $(0, c)$;
- the **$x$-intercepts** solve $ax^2 + bx + c = 0$; there are two if the discriminant $\Delta = b^2 - 4ac$ is positive, one (the vertex itself touches the axis) if $\Delta = 0$, and none if $\Delta < 0$;
- the two $x$-intercepts, when they exist, sit symmetrically about the axis, so their average is $x_V$.

### Vertex form

Completing the square writes the parabola as $y = a(x - h)^2 + k$, with vertex $(h, k)$. This form is the fastest way to build a parabola from its vertex and one more point: substitute the point and solve for $a$.

A parabola can also have a horizontal axis, $x = ay^2 + by + c$. Every rule above holds with $x$ and $y$ swapped: it opens to the right if $a > 0$, its vertex has $y_V = -\frac{b}{2a}$, and it is not the graph of a function of $x$.

### Building equations from conditions

Count the unknowns. A circle in expanded form has three ($a$, $b$, $c$), so three points on it fix it; so do a centre and a radius, or the two ends of a diameter (the midpoint is the centre, half the length is the radius). A parabola $y = ax^2 + bx + c$ also has three, so three points fix it, or a vertex (two conditions) and one more point. Always check your final equation with a given point; it costs seconds and catches sign slips.
`,
  examples: [
    {
      id: 'example-circle-centre-radius',
      title: 'Centre and radius from the expanded form',
      problemMd: md`Find the centre and radius of $x^2 + y^2 - 6x + 8y + 9 = 0$, and say how the circle sits relative to the axes.`,
      steps: [
        md`Here $a = -6$, $b = 8$, $c = 9$. Centre: $\left(-\frac{-6}{2}, -\frac{8}{2}\right) = (3, -4)$.`,
        md`Radius squared: $\frac{36}{4} + \frac{64}{4} - 9 = 9 + 16 - 9 = 16$, so $r = 4$.`,
        md`Check by completing the square: $(x - 3)^2 - 9 + (y + 4)^2 - 16 + 9 = 0$, which is $(x - 3)^2 + (y + 4)^2 = 16$.`,
        md`The centre is 4 units from the $x$-axis, equal to the radius, so the circle touches the $x$-axis at $(3, 0)$. It is 3 units from the $y$-axis, less than the radius, so it crosses the $y$-axis twice.`,
      ],
      answerMd: md`Centre $(3, -4)$, radius $4$; tangent to the $x$-axis, crossing the $y$-axis. Reading the centre as $(-3, 4)$, with the signs of the coefficients, is the usual slip.`,
    },
    {
      id: 'example-parabola-landmarks',
      title: 'Landmarks of a parabola',
      problemMd: md`Describe the parabola $y = 2x^2 - 8x + 5$: direction, vertex, axis and intercepts.`,
      steps: [
        md`$a = 2 > 0$, so it opens upwards and the vertex is its lowest point.`,
        md`Vertex: $x_V = -\frac{-8}{2 \cdot 2} = 2$, and $y_V = 2 \cdot 4 - 16 + 5 = -3$. Vertex $(2, -3)$, axis $x = 2$.`,
        md`$y$-intercept: $(0, 5)$. By symmetry about $x = 2$, the point $(4, 5)$ is on the curve too: $32 - 32 + 5 = 5$.`,
        md`$x$-intercepts: $\Delta = 64 - 40 = 24 > 0$, so two. $x = \frac{8 \pm \sqrt{24}}{4} = 2 \pm \frac{\sqrt{6}}{2}$, symmetric about 2 as expected.`,
        md`Check the vertex with vertex form: $2(x - 2)^2 - 3 = 2x^2 - 8x + 8 - 3$, the original equation.`,
      ],
      answerMd: md`Upward parabola, vertex $(2, -3)$, axis $x = 2$, $y$-intercept $5$, $x$-intercepts $2 \pm \frac{\sqrt{6}}{2}$. Using $x_V = \frac{b}{2a}$ without the minus sign gives $-2$, the wrong side.`,
    },
    {
      id: 'example-circle-from-diameter',
      title: 'A circle from the ends of a diameter',
      problemMd: md`The segment from $A(-1, 2)$ to $B(5, -6)$ is a diameter of a circle. Write its equation.`,
      steps: [
        md`The centre is the midpoint: $\left(\frac{-1 + 5}{2}, \frac{2 - 6}{2}\right) = (2, -2)$.`,
        md`The diameter is $\sqrt{6^2 + 8^2} = 10$, so $r = 5$ and $r^2 = 25$.`,
        md`Centre form: $(x - 2)^2 + (y + 2)^2 = 25$. Expanded: $x^2 + y^2 - 4x + 4y + 8 - 25 = 0$, that is $x^2 + y^2 - 4x + 4y - 17 = 0$.`,
        md`Check with $A$: $1 + 4 + 4 + 8 - 17 = 0$. With $B$: $25 + 36 - 20 - 24 - 17 = 0$.`,
      ],
      answerMd: md`$x^2 + y^2 - 4x + 4y - 17 = 0$. Using the full length 10 as the radius gives $r^2 = 100$, a circle twice as wide.`,
    },
    {
      id: 'example-parabola-from-vertex',
      title: 'A parabola from its vertex and a point',
      problemMd: md`A parabola with a vertical axis has vertex $(1, 4)$ and passes through $(3, -4)$. Find its equation.`,
      steps: [
        md`Vertex form: $y = a(x - 1)^2 + 4$.`,
        md`Substitute $(3, -4)$: $-4 = 4a + 4$, so $a = -2$. It opens downwards, as it must, since the point is below the vertex.`,
        md`Expand: $y = -2(x^2 - 2x + 1) + 4 = -2x^2 + 4x + 2$.`,
        md`Check: $x_V = -\frac{4}{2 \cdot (-2)} = 1$, and at $x = 3$, $-18 + 12 + 2 = -4$.`,
      ],
      answerMd: md`$y = -2x^2 + 4x + 2$.`,
    },
  ],
  traps: [
    {
      title: 'The sign of the centre',
      md: md`In $(x - x_0)^2$ the centre coordinate is $x_0$, so $(x + 5)^2$ means $x_0 = -5$. In expanded form the centre is minus half each coefficient. Check a candidate centre by asking whether it makes each bracket zero.`,
    },
    {
      title: 'Radius or radius squared',
      md: md`The constant on the right of the centre form, and the formula $\frac{a^2}{4} + \frac{b^2}{4} - c$, give $r^2$. Answer options often include both $r$ and $r^2$; the radius is the square root.`,
    },
    {
      title: 'Leading coefficients other than 1',
      md: md`In $2x^2 + 2y^2 - 8x + 4y - 2 = 0$, divide by 2 first: $x^2 + y^2 - 4x + 2y - 1 = 0$, centre $(2, -1)$, $r^2 = 4 + 1 + 1 = 6$. Applying the formulas to the undivided equation gives nonsense.`,
    },
    {
      title: 'An equation that is no circle at all',
      md: md`$x^2 + y^2 - 2x + 4y + 10 = 0$ gives $r^2 = 1 + 4 - 10 = -5$. No point satisfies it. If an option says "no circle" or "the empty set", compute $r^2$ before dismissing it.`,
    },
  ],
  check: [
    {
      id: 'check-circle-centre-radius',
      title: 'Reading a circle',
      topic: 'Parabolas and circles',
      stemMd: md`What are the centre and radius of the circle $x^2 + y^2 + 4x - 10y + 20 = 0$?`,
      options: [
        { id: 'A', text: md`Centre $(2, -5)$, radius $3$`, note: md`The signs of the centre are flipped: the centre is minus half of each coefficient, so $+4x$ gives $-2$ and $-10y$ gives $+5$.` },
        { id: 'B', text: md`Centre $(-2, 5)$, radius $9$`, note: md`9 is the radius squared. The radius is its square root.` },
        { id: 'C', text: md`Centre $(-2, 5)$, radius $3$`, note: '' },
        { id: 'D', text: md`Centre $(-4, 10)$, radius $\sqrt{96}$`, note: md`This forgets to halve the coefficients: the centre is $\left(-\frac{4}{2}, \frac{10}{2}\right)$, and the radius formula uses the halves squared.` },
      ],
      answer: 'C',
      workingMd: md`Centre: $\left(-\frac{4}{2}, -\frac{-10}{2}\right) = (-2, 5)$. Radius squared: $4 + 25 - 20 = 9$, so the radius is 3. Check: $(x + 2)^2 + (y - 5)^2 = 9$ expands to $x^2 + 4x + 4 + y^2 - 10y + 25 - 9 = 0$, which is the given equation.`,
      lesson: 'The centre is minus half of each linear coefficient, and the radius is the square root of the computed r squared.',
    },
    {
      id: 'check-parabola-vertex',
      title: 'Vertex of a downward parabola',
      topic: 'Parabolas and circles',
      stemMd: md`What is the vertex of the parabola $y = -x^2 + 6x - 5$?`,
      options: [
        { id: 'A', text: md`$(-3, -32)$`, note: md`This uses $\frac{b}{2a} = -3$ without the leading minus sign of the vertex formula, which puts the vertex on the wrong side of the $y$-axis.` },
        { id: 'B', text: md`$(3, 4)$`, note: '' },
        { id: 'C', text: md`$(3, 22)$`, note: md`The vertex is at $x = 3$, but the $y$-value was computed as if the leading term were $+x^2$: $9 + 18 - 5 = 22$.` },
        { id: 'D', text: md`$(6, -5)$`, note: md`This point is on the curve, but it is the mirror image of the $y$-intercept $(0, -5)$ across the axis $x = 3$, not the vertex.` },
      ],
      answer: 'B',
      workingMd: md`$x_V = -\frac{6}{2 \cdot (-1)} = 3$, and $y_V = -9 + 18 - 5 = 4$. Check with the roots: $-x^2 + 6x - 5 = -(x - 1)(x - 5)$, whose roots 1 and 5 average to 3.`,
      lesson: 'The vertex x is minus b over 2a; then substitute it, keeping the sign of the squared term.',
    },
    {
      id: 'check-circle-parameter',
      title: 'Choosing the constant for a given radius',
      topic: 'Parabolas and circles',
      stemMd: md`For which value of $k$ is $x^2 + y^2 - 2x + 4y + k = 0$ a circle of radius 3?`,
      options: [
        { id: 'A', text: md`$-4$`, note: '' },
        { id: 'B', text: md`$2$`, note: md`This sets $5 - k$ equal to the radius 3 instead of the radius squared 9.` },
        { id: 'C', text: md`$4$`, note: md`This uses $r^2 = 1 + 4 + k$, with the wrong sign on the constant term.` },
        { id: 'D', text: md`$14$`, note: md`This adds 9 to 5 instead of solving $5 - k = 9$.` },
      ],
      answer: 'A',
      workingMd: md`Centre $(1, -2)$, and $r^2 = 1 + 4 - k = 5 - k$. Radius 3 means $5 - k = 9$, so $k = -4$. Check: $(x - 1)^2 + (y + 2)^2 = 9$ expands to $x^2 + y^2 - 2x + 4y + 5 - 9 = 0$, a constant of $-4$.`,
      lesson: 'Set the formula for r squared equal to the square of the radius, then solve for the unknown constant.',
    },
  ],
  takeaways: [
    md`Circle $x^2 + y^2 + ax + by + c = 0$: centre $\left(-\frac{a}{2}, -\frac{b}{2}\right)$, $r^2 = \frac{a^2}{4} + \frac{b^2}{4} - c$, and it is a real circle only if $r^2 > 0$.`,
    md`Parabola $y = ax^2 + bx + c$: vertex at $x = -\frac{b}{2a}$, opens up if $a > 0$, $y$-intercept $c$.`,
    'Vertex form or centre form makes building an equation from conditions quick.',
    'Check every equation you build by substituting a given point.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-analytic-conics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
