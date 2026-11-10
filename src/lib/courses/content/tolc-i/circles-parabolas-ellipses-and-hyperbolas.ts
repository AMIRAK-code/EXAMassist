import { md, type Lesson } from '../../types';

export const circlesParabolasEllipsesAndHyperbolasLesson: Lesson = {
  slug: 'circles-parabolas-ellipses-and-hyperbolas',
  title: "Circles, parabolas, ellipses and hyperbolas",
  summary: "Read a conic from its equation, recover its centre or vertex and decide whether a line cuts, touches or misses a circle.",
  minutes: 20,
  objectives: [
    "Recognise axis-aligned conics from their squared terms.",
    "Complete squares to recover a centre or vertex.",
    "Test tangency using a distance or a repeated root.",
  ],
  teachMd: md`
### Read the equation as a set of points

A conic (*conica*) can be described by a rule telling you which points belong to it. Substituting a proposed point into its equation tests membership. To see the whole shape, look at how the two coordinates share the work of satisfying the equation. Begin with equations whose axes of symmetry are parallel to the coordinate axes. These have no product of the two variables. Rotated axes can produce a mixed term and require further analysis.

For a circle (*circonferenza*), every point is at a fixed distance from its centre. Taking the centre as $(h,k)$ gives $(x-h)^2+(y-k)^2=r^2$. Both squared distances enter with equal weights because a horizontal unit is the same length as a vertical unit. A positive right side gives the square of the radius. A zero right side leaves just the centre, and a negative right side gives no real points at all.

Completing a square reveals this pattern when the equation is expanded. The pair $x^2-6x$ occurs inside $(x-3)^2$, whose expansion includes an extra nine. Add nine to both sides of the equation if you insert it on the left. Treat the terms involving the second coordinate independently. A centre with a negative coordinate appears with a plus sign inside its bracket, since that coordinate must make the bracket vanish when substituted.

### Stretch a circle or open it into branches

An ellipse (*ellisse*) with centre at the origin has a form such as $x^2/16+y^2/9=1$. Each coordinate spends part of the same positive allowance. Setting the other coordinate to zero shows that the horizontal extremes are four units from the centre and the vertical extremes three. Those are half-axis lengths. The full width of the ellipse is eight. Translating the centre simply changes the coordinate differences inside the squares.

In a hyperbola (*iperbole*) one squared term is subtracted. Moving farther out along one axis can now compensate for moving farther out along the other. The curve has two separate branches and does not enclose a bounded interior as an ellipse does. After arranging the right side to equal positive one, find the positive squared term. It tells you the axis along which the branches open. For $y^2/9-x^2/16=1$ there are points with horizontal coordinate zero, but there are no points with vertical coordinate zero.

### Read a parabola from its vertex

In $y=a(x-h)^2+k$, the squared displacement from $h$ vanishes at the vertex (*vertice*). It takes the same value at equal distances to the left and right. The sign of $a$ determines whether the vertex gives a minimum or a maximum. There is only one squared variable in this form. An equation with the two coordinates exchanged gives a sideways parabola, whose horizontal coordinate is an extremum at its vertex.

To sketch enough of a parabola by hand, mark the vertex and compute its neighbours one unit on each side. A displacement of two units contributes four times what a displacement of one contributes. A proposed straight line and the parabola meet wherever their equations hold at the same point. Substituting the line into the quadratic gives possible intersection coordinates. A repeated root corresponds to a tangent when the resulting equation is genuinely quadratic.

### Judge contact before solving for intersections

For a circle there is a second route. Imagine moving a straightedge towards a coin laid on a table. When its perpendicular distance from the centre exceeds the radius it misses the coin. When the distance equals the radius it touches at one point. When the distance is smaller the corresponding line cuts across the circle in two places. This reasoning compares ordinary lengths, so take the square root of the right side of the circle equation before comparing it with a distance. Alternatively square both nonnegative lengths and compare the squares.
`,
  examples: [
    {
      id: 'shifted-circle',
      title: "Recovering a hidden circle",
      problemMd: md`Describe $x^2+y^2-8x+2y+8=0$.`,
      steps: [
        md`Move the constant to the right, giving $x^2-8x+y^2+2y=-8$.`,
        md`Add 16 and 1 to both sides to get $(x-4)^2+(y+1)^2=9$.`,
      ],
      answerMd: "The circle has centre (4, −1) and radius 3.",
    },
    {
      id: 'tangent-level',
      title: "A horizontal tangent",
      problemMd: md`Find the value of $c$ for which $y=c$ is tangent to $y=x^2+6x+5$.`,
      steps: [
        md`Complete the square to obtain $y=(x+3)^2-4$.`,
        md`The horizontal line meets the curve when $(x+3)^2=c+4$. One solution occurs exactly when the right side vanishes.`,
      ],
      answerMd: md`The tangent is $y=-4$, touching at $(-3,-4)$.`,
    },
  ],
  traps: [
    { title: "Reading squared axes as lengths", md: "Set the other coordinate displacement to zero and solve for the distance. The denominator in a standard ellipse equation is a squared half-axis." },
    { title: "Calling every pair of squares a circle", md: "Complete the squares and inspect the remaining constant. A negative sum of real squares is impossible." },
  ],
  check: [
    {
      id: 'ellipse-width',
      title: "Full width",
      topic: "Analytic geometry and functions",
      stemMd: md`What is the full horizontal width of $(x+2)^2/25+(y-1)^2/4=1$?`,
      options: [
        { id: 'A', text: "5", note: "This gives the horizontal half-axis." },
        { id: 'B', text: "25", note: "This reads the squared horizontal half-axis." },
        { id: 'C', text: "4", note: "This gives the full vertical height." },
        { id: 'D', text: "10", note: "" },
        { id: 'E', text: "2", note: "This gives the vertical half-axis." },
      ],
      answer: 'D',
      workingMd: md`At $y=1$ the horizontal displacement is $\pm5$. The extremes are ten units apart.`,
      lesson: "Double the horizontal half-axis to find the width.",
    },
    {
      id: 'relative-circle',
      title: "Comparing gap and radius",
      topic: "Analytic geometry and functions",
      stemMd: md`How many points are common to $x^2+y^2=16$ and $3x+4y=20$?`,
      options: [
        { id: 'A', text: "Zero", note: "This treats the unnormalised constant 20 as a distance." },
        { id: 'B', text: "One", note: "" },
        { id: 'C', text: "Two", note: "This compares the distance with the squared radius." },
        { id: 'D', text: "Four", note: "This counts the circle's axis intercepts, not the contacts with the given line." },
        { id: 'E', text: "Infinitely many", note: "This would require the whole line to lie on the circle." },
      ],
      answer: 'B',
      workingMd: md`The centre is the origin and the radius is 4. Its distance from the line is $20/\sqrt{9+16}=4$, so the line is tangent.`,
      lesson: "A centre-to-line distance equal to the radius gives one contact.",
    },
    {
      id: 'hyperbola-direction',
      title: "A pair of branches",
      topic: "Analytic geometry and functions",
      stemMd: md`Which description fits $y^2/16-x^2/9=1$?`,
      options: [
        { id: 'A', text: "Horizontal branches through (±3, 0)", note: "This interchanges the positive and negative squared terms." },
        { id: 'B', text: "An ellipse of width 6", note: "An ellipse would add the two squared terms." },
        { id: 'C', text: "Vertical branches through (0, ±4)", note: "" },
        { id: 'D', text: "Vertical branches through (0, ±16)", note: "This reads the denominator as the displacement." },
        { id: 'E', text: "A circle of radius 4", note: "A circle requires equal coefficients of the same sign." },
      ],
      answer: 'C',
      workingMd: md`Set $x=0$ to get $y=\pm4$. For every real $x$, $y^2=16(1+x^2/9)\ge16$, giving upper and lower branches.`,
      lesson: "After normalising to one, read the direction from the positive square.",
    },
  ],
  takeaways: [
    "Complete both coordinate squares before reading a circle.",
    "Ellipse denominators give squared half-axis lengths.",
    "A repeated intersection root or equal centre distance and radius can establish tangency.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-mathematics', skill: 'tolci-math-analytic-functions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
