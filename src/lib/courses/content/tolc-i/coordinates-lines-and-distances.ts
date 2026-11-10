import { md, type Lesson } from '../../types';

export const coordinatesLinesAndDistancesLesson: Lesson = {
  slug: 'coordinates-lines-and-distances',
  title: "Coordinates, lines and distances",
  summary: "Build a line through a given point, find the shortest distance to it and use coordinate differences to measure lengths and areas.",
  minutes: 20,
  objectives: [
    "Build equations for parallel and perpendicular lines.",
    "Find a point's shortest distance to a line.",
    "Measure a polygon using coordinates.",
  ],
  teachMd: md`
### Read a displacement from two points

Imagine walking from a point on squared paper to a second point. The change in the first coordinate tells you how far to go horizontally, with a negative change meaning left. The second change tells you how far to go vertically. These two signed distances specify a displacement. Subtract the starting coordinate from the finishing coordinate in both directions. Reversing just one subtraction describes a journey to a different point.

A direct journey between the endpoints runs along the hypotenuse of a right triangle whose legs are the horizontal and vertical changes. Squaring removes their signs, so its length is $\sqrt{(\Delta x)^2+(\Delta y)^2}$. Going back gives exactly the same length. Adding the absolute changes instead measures the route along two grid lines. This distinction matters whenever the sides of a polygon run diagonally across the grid.

### Specify a direction and an anchor

A line (*retta*) with a finite slope (*coefficiente angolare*) rises by a fixed amount for each unit step to the right. Divide the vertical change by the horizontal one. A negative result describes a descent as you move right. If the horizontal change is zero, every point on the line shares its first coordinate. Give this vertical line an equation of the form $x=h$. A horizontal line instead has zero vertical change and has equation $y=k$.

An anchor point supplies the information that the slope alone leaves open. Through $(a,b)$ with slope $m$, write $y-b=m(x-a)$. At the anchor both changes vanish. At any other point their ratio gives exactly the requested slope. This makes the equation easy to check even when the intercept is an awkward fraction. To find the intercept later, substitute zero for the first coordinate or expand the brackets.

Parallel lines have the same direction. To make a perpendicular line, picture turning a direction arrow through a quarter-turn. An arrow that runs three units right and two up becomes an arrow running two left and three up. Its slope changes from two thirds to negative three halves. For nonzero finite slopes the product of perpendicular slopes is negative one. A vertical line pairs with a horizontal line, so neither infinity nor division by zero needs to appear in the calculation.

### Measure a perpendicular gap

The distance from a point to a line means the shortest distance to any point on that line. Drop a perpendicular from the point. Any other path to the line is the hypotenuse of a right triangle with this perpendicular as a leg. Measuring a horizontal or vertical gap from the point generally gives a larger value.

Write the line as $Ax+By+C=0$. Its normal direction, at right angles to it, is $(A,B)$. A move of one unit along that direction changes the expression on the left by $\sqrt{A^2+B^2}$. This explains the denominator in the distance formula $d=|Ax_0+By_0+C|/\sqrt{A^2+B^2}$. The numerator tells you how far the test point misses the equation. The absolute value makes distance positive on either side. Multiplying the whole line equation by two doubles both numerator and denominator, leaving the distance unchanged.

### Pick a convenient base for area

Look first for vertices sharing a coordinate. Their joining segment can serve as a horizontal or vertical base. The perpendicular height then comes from the remaining vertex's change in the other coordinate. It measures distance to the entire base line and still works when the perpendicular foot lies beyond the base segment. For a slanted base you may combine its length with the point-to-line distance. Alternatively enclose the triangle in a grid-aligned rectangle and subtract the outside right triangles. For a larger polygon draw a diagonal lying inside it, find the areas of the two pieces and add them. This keeps every height attached to the base it actually measures.
`,
  examples: [
    {
      id: 'orthogonal-rail',
      title: "Turning a direction",
      problemMd: "Find the line through (4, 1) perpendicular to the line joining (0, 1) and (6, 5).",
      steps: [
        "The reference slope is (5 − 1)/(6 − 0) = 2/3.",
        "A perpendicular has slope −3/2. Anchor that slope at (4, 1).",
      ],
      answerMd: md`Its equation is $y-1=-\tfrac32(x-4)$, or $y=7-\tfrac32x$.`,
    },
    {
      id: 'triangular-plot',
      title: "A diagonal base",
      problemMd: md`A triangle has vertices $(0,0),(4,3),(0,5)$. Use the sloping first side as base to find its area.`,
      steps: [
        md`The base lies on $3x-4y=0$ and has length $\sqrt{4^2+3^2}=5$.`,
        md`The distance of $(0,5)$ to the base line is $|-20|/5=4$.`,
        "Multiply the base by the perpendicular height and halve.",
      ],
      answerMd: "The area is 10 square units. Choosing the vertical side of length 5 gives horizontal height 4 as a second check.",
    },
  ],
  traps: [
    { title: "Turning the slope the wrong way", md: "Changing only the sign gives a reflection of a direction across the horizontal axis. For a quarter-turn also take the reciprocal." },
    { title: "Reading a coordinate as a length", md: "If a horizontal base starts away from the vertical axis, its length is the absolute difference of its endpoint coordinates." },
  ],
  check: [
    {
      id: 'parallel-rail',
      title: "Parallel through a point",
      topic: "Analytic geometry and functions",
      stemMd: md`Which line through $(2,-1)$ is parallel to $3x-y=8$?`,
      options: [
        { id: 'A', text: md`$y=3x-7$`, note: "" },
        { id: 'B', text: md`$y=3x-1$`, note: "This takes the point's second coordinate as the intercept." },
        { id: 'C', text: md`$y=-3x+5$`, note: "This passes through the point but changes the sign of the slope." },
        { id: 'D', text: md`$y=-x/3-1/3$`, note: "This takes the perpendicular direction." },
        { id: 'E', text: md`$y=3x+7$`, note: "This changes the sign of the required intercept." },
      ],
      answer: 'A',
      workingMd: md`The original slope is 3. Through the point, $y+1=3(x-2)$ gives $y=3x-7$.`,
      lesson: "Check both the slope and the anchor.",
    },
    {
      id: 'grid-gap',
      title: "A point above a line",
      topic: "Analytic geometry and functions",
      stemMd: md`What is the distance from $(1,4)$ to $3x+4y-4=0$?`,
      options: [
        { id: 'A', text: "15", note: "This evaluates the line expression without normalising it." },
        { id: 'B', text: "3", note: "" },
        { id: 'C', text: "5", note: "This is the length of the normal vector alone." },
        { id: 'D', text: "3.75", note: "This measures the vertical gap at x = 1." },
        { id: 'E', text: "0.6", note: "This divides the expression by the square of the normal length." },
      ],
      answer: 'B',
      workingMd: md`The numerator is $|3+16-4|=15$. The denominator is $\sqrt{9+16}=5$, so the distance is 3.`,
      lesson: "Normalise the line expression when measuring perpendicular distance.",
    },
    {
      id: 'rectangle-diagonal',
      title: "Distance across the grid",
      topic: "Analytic geometry and functions",
      stemMd: "A straight path joins (−2, 3) to (3, −9). How long is it?",
      options: [
        { id: 'A', text: "17", note: "This follows two grid-aligned legs." },
        { id: 'B', text: "7", note: "This subtracts their lengths." },
        { id: 'C', text: "169", note: "This gives the squared distance." },
        { id: 'D', text: "13", note: "" },
        { id: 'E', text: "12", note: "This keeps only the vertical displacement." },
      ],
      answer: 'D',
      workingMd: "The horizontal change is 5 and the vertical change is −12. Their squares sum to 169, whose positive square root is 13.",
      lesson: "Use both coordinate changes as the legs of a right triangle.",
    },
  ],
  takeaways: [
    "Keep changes in both coordinates in the same direction.",
    "A quarter-turn turns a nonzero finite slope into its negative reciprocal.",
    "Pair each base with its own perpendicular height.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-mathematics', skill: 'tolci-math-analytic-functions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
