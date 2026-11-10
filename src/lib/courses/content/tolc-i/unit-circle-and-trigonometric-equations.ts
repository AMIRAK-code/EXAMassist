import { md, type Lesson } from '../../types';

export const unitCircleAndTrigonometricEquationsLesson: Lesson = {
  slug: 'unit-circle-and-trigonometric-equations',
  title: "The unit circle and trigonometric equations",
  summary: "Read signs and exact values from the unit circle, use double-angle identities and find every angle in a specified interval.",
  minutes: 20,
  objectives: [
    "Read sine and cosine as coordinates on the unit circle.",
    "Evaluate related angles and double angles.",
    "List complete solutions within a stated interval.",
  ],
  teachMd: md`
### Turn an angle into a point

Draw a circle of radius one centred at the origin. Start at the point one unit to the right of the centre and travel anticlockwise through an angle. The coordinates where you stop are the cosine (*coseno*) and sine (*seno*) of that angle, in that order. The tangent (*tangente*) is the vertical coordinate divided by the horizontal one whenever the horizontal coordinate differs from zero. The signs now come from ordinary coordinates. In the upper left quarter, for example, the sine is positive, the cosine negative and the tangent negative.

Radians (*radianti*) measure a turn by the arc length it cuts off divided by the radius. Around a unit circle the full distance is $2\pi$, so half a turn is $\pi$ radians or 180 degrees. To convert degrees to radians multiply by $\pi/180$. A negative angle travels clockwise. Adding a whole turn leaves both final coordinates unchanged, although it changes the number describing the journey. Opposite points have both coordinate signs reversed and hence the same tangent where the ratio exists.

### Use one small triangle more than once

Cut an equilateral triangle of side two down its middle. Each half has hypotenuse two and short leg one. Pythagoras gives the long leg as $\sqrt3$. Dividing every side by two makes a unit hypotenuse. For the angle of thirty degrees the vertical leg is the short one, so its sine is one half. Exchanging the roles of the legs gives the complementary angle of sixty degrees. A right triangle with two equal legs instead gives both coordinates as $\sqrt2/2$ at forty-five degrees.

For an angle outside the first quadrant, find the acute angle its terminal ray makes with the horizontal axis. Reflect the corresponding first-quadrant point into the correct quadrant. Reflection in the vertical axis reverses the first coordinate alone. Reflection in the horizontal axis reverses the second coordinate alone. You can therefore read the answer exactly even when the angle is expressed as a large multiple of a familiar fraction of a turn. Removing whole turns before reflecting saves work and leaves all coordinates unchanged.

### Use the circle equation and double-angle rules

The circle equation gives $\cos^2 t+\sin^2 t=1$. Given one coordinate you can recover the magnitude of the other by subtracting its square from one and taking a square root. Choose the sign from the quadrant. Without a location or another condition the sign may remain undetermined. If only a squared value is needed, keep it squared and avoid choosing a sign prematurely.

Doubling an angle moves the point around the circumference. It does not simply double a coordinate. The identities $\sin(2t)=2\sin t\cos t$ and $\cos(2t)=\cos^2 t-\sin^2 t$ describe the new position. The sine formula can be negative even if the original sine is positive. An angle starting in the second quadrant doubles into the lower half of the circle, which agrees with the negative product there.

### Sweep through the requested interval

To solve a sine equation in one turn, draw a horizontal line at the requested height. Count the points at which it meets the circle and follow the turn from its specified start to identify the angles. A cosine equation uses a vertical line instead. If a line passes through a top, bottom or side extreme there may be just one distinct point, and outside the circle there are none. A tangent equation repeats after half a turn wherever the ratio is defined.

For an inequality, first mark the equality points and then follow the arcs where the coordinate satisfies the comparison. A strict inequality leaves the equality points out. For an interval covering multiple turns, add whole periods to the solutions and filter them against both endpoints. The coordinates at zero and a full turn coincide, but both angle values belong in the answer if the given closed interval includes both values and they satisfy the condition.
`,
  examples: [
    {
      id: 'reflected-angle',
      title: "A reflected point",
      problemMd: md`Find the sine and cosine of $5\pi/6$.`,
      steps: [
        md`The angle is $\pi-\pi/6$ and lies in the upper left quadrant.`,
        md`The reference point at $\pi/6$ has coordinates $(\sqrt3/2,1/2)$. Reflect across the vertical axis.`,
      ],
      answerMd: md`The sine is $1/2$ and the cosine is $-\sqrt3/2$.`,
    },
    {
      id: 'high-arc',
      title: "An inequality through one turn",
      problemMd: md`Solve $\sin t>\sqrt3/2$ for $0\le t<2\pi$.`,
      steps: [
        md`The horizontal line at height $\sqrt3/2$ meets the circle at $\pi/3$ and $2\pi/3$.`,
        "The arc between them contains the top point of height 1. Everywhere else lies at or below the line.",
      ],
      answerMd: md`The solution is $\pi/3<t<2\pi/3$.`,
    },
  ],
  traps: [
    { title: "Losing a second angle", md: "A horizontal line between the extreme heights usually meets the circle twice. Read both points before adding any periods." },
    { title: "Taking the positive square root automatically", md: "A square identifies magnitude. Use the quadrant to decide the sign of the missing coordinate." },
  ],
  check: [
    {
      id: 'third-quadrant',
      title: "Signs after reflection",
      topic: "Trigonometry",
      stemMd: md`What is $\cos(7\pi/6)$?`,
      options: [
        { id: 'A', text: md`$\sqrt3/2$`, note: "This reads the reference cosine without its quadrant sign." },
        { id: 'B', text: md`$-1/2$`, note: "This is the sine of the stated angle." },
        { id: 'C', text: md`$-\sqrt3/2$`, note: "" },
        { id: 'D', text: md`$1/2$`, note: "This is the positive sine of the reference angle." },
        { id: 'E', text: md`$-\sqrt3$`, note: "This doubles the cosine magnitude beyond the unit circle." },
      ],
      answer: 'C',
      workingMd: md`The angle is $\pi+\pi/6$. Its point is opposite the point at $\pi/6$, so the horizontal coordinate changes from $\sqrt3/2$ to $-\sqrt3/2$.`,
      lesson: "A half-turn reverses both coordinates.",
    },
    {
      id: 'double-angle',
      title: "Doubling a turn",
      topic: "Trigonometry",
      stemMd: md`If $t$ lies in the second quadrant and $\sin t=3/5$, what is $\sin(2t)$?`,
      options: [
        { id: 'A', text: md`$24/25$`, note: "This uses a positive cosine in the second quadrant." },
        { id: 'B', text: md`$6/5$`, note: "This doubles the sine itself." },
        { id: 'C', text: md`$7/25$`, note: "This computes the double-angle cosine." },
        { id: 'D', text: md`$-12/25$`, note: "This omits the factor two in the double-angle sine." },
        { id: 'E', text: md`$-24/25$`, note: "" },
      ],
      answer: 'E',
      workingMd: md`The cosine is $-\sqrt{1-9/25}=-4/5$. The double-angle sine is $2(3/5)(-4/5)=-24/25$.`,
      lesson: "Find the signed coordinates before applying a double-angle identity.",
    },
    {
      id: 'quarter-circle',
      title: "Two matching angles",
      topic: "Trigonometry",
      stemMd: md`Which list gives every solution of $\cos t=1/2$ in $0\le t<2\pi$?`,
      options: [
        { id: 'A', text: md`$\pi/3$ only`, note: "This misses the lower intersection." },
        { id: 'B', text: md`$\pi/3,5\pi/3$`, note: "" },
        { id: 'C', text: md`$\pi/6,5\pi/6$`, note: "These have sine one half." },
        { id: 'D', text: md`$2\pi/3,4\pi/3$`, note: "These have cosine negative one half." },
        { id: 'E', text: md`$\pi/3,4\pi/3$`, note: "The second point is opposite the first and has the wrong cosine." },
      ],
      answer: 'B',
      workingMd: md`The vertical line at $x=1/2$ cuts the circle at angles $\pi/3$ and $2\pi-\pi/3=5\pi/3$.`,
      lesson: "Use a vertical slice for an equation in cosine.",
    },
  ],
  takeaways: [
    "Cosine is the horizontal coordinate and sine the vertical one.",
    "Choose signs by locating the terminal point.",
    "Check every solution against the stated endpoints.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-mathematics', skill: 'tolci-math-trigonometry' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
