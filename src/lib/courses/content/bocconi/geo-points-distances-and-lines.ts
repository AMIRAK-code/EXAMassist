import { md, type Lesson } from '../../types';

export const pointsDistancesAndLinesLesson: Lesson = {
  slug: 'points-distances-and-lines',
  title: 'Points, distances and lines in the plane',
  summary: 'Find distances, midpoints and slopes, write the equation of a line, and spot parallel and perpendicular lines and where two lines meet.',
  minutes: 22,
  objectives: [
    'Compute the distance and the midpoint between two points, and the distance from a point to a line.',
    md`Find the slope of a line from two points or from an equation in the form $ax + by + c = 0$.`,
    'Write the equation of a line through a point, parallel or perpendicular to a given line.',
    'Find the intersection of two lines by solving a system.',
  ],
  teachMd: md`
### Points and distance

A point in the plane is a pair $(x, y)$. The distance between $A(x_1, y_1)$ and $B(x_2, y_2)$ is the hypotenuse of a right triangle whose legs are the horizontal gap $x_2 - x_1$ and the vertical gap $y_2 - y_1$:

$$AB = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

Because each gap is squared, the order of the points does not matter and negative gaps cause no harm. The **midpoint** of $AB$ averages the coordinates:

$$M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)$$

Distance subtracts; midpoint adds. Mixing the two is the commonest slip in this topic.

### Slope

The slope of the line through $A$ and $B$ is the vertical change per unit of horizontal change:

$$m = \frac{y_2 - y_1}{x_2 - x_1}$$

Subtract in the same order on top and bottom. A positive slope rises from left to right, a negative slope falls, a slope of 0 is a horizontal line, and a vertical line (where $x_2 = x_1$) has no slope at all. The slope is also the tangent of the angle the line makes with the positive $x$-axis, which links this lesson to trigonometry: a slope of 1 means a 45° line.

### Equations of a line

Every non-vertical line can be written as $y = mx + q$, where $m$ is the slope and $q$ the $y$-intercept, the height at which it crosses the $y$-axis. Two other forms are just as useful:

- **Point and slope.** The line through $(x_0, y_0)$ with slope $m$ is $y - y_0 = m(x - x_0)$. This is the fastest way to write a line when a question gives a point and a direction.
- **General form.** $ax + by + c = 0$ covers every line, vertical ones included. If $b \neq 0$, solving for $y$ gives $y = -\frac{a}{b}x - \frac{c}{b}$, so the slope is $-\frac{a}{b}$.

Vertical lines are $x = h$; horizontal lines are $y = k$. A point lies on a line exactly when its coordinates satisfy the equation, which is also the quickest way to test an answer option.

### Parallel and perpendicular

Two non-vertical lines are **parallel** when their slopes are equal, $m_1 = m_2$. They are **perpendicular** when the product of their slopes is $-1$, that is $m_2 = -\frac{1}{m_1}$: flip the fraction and change its sign. A line of slope $\frac{2}{3}$ is perpendicular to every line of slope $-\frac{3}{2}$. The special case: a horizontal line is perpendicular to a vertical one, though neither formula covers it.

In general form there is a shortcut. The lines parallel to $ax + by + c = 0$ are $ax + by + k = 0$ for any $k$: keep $a$ and $b$, change the constant. The lines perpendicular to it are $bx - ay + k = 0$: swap $a$ and $b$ and change one sign. Then fix $k$ by substituting the given point.

### Where two lines meet

The intersection point satisfies both equations, so solve them as a system, by substitution or by elimination. The system has exactly one solution when the slopes differ, none when the lines are parallel and distinct, and infinitely many when the two equations describe the same line (one is a multiple of the other).

### Distance from a point to a line

The shortest distance from $P(x_0, y_0)$ to the line $ax + by + c = 0$ is measured along the perpendicular:

$$d = \frac{\lvert ax_0 + by_0 + c \rvert}{\sqrt{a^2 + b^2}}$$

The line must be in general form, with everything on one side, before you read off $a$, $b$ and $c$. This formula returns in the lesson on [lines and conics](/courses/bocconi/lines-and-conics), where comparing a distance with a radius decides whether a line cuts a circle.

### Working without a calculator

Coordinates in these questions are chosen to give tidy numbers: gaps of 6 and 8 give a distance of 10, a denominator of $\sqrt{3^2 + 4^2} = 5$ divides cleanly. If your working produces an ugly root, recheck a subtraction before you trust it.
`,
  examples: [
    {
      id: 'example-distance-midpoint-slope',
      title: 'Distance, midpoint, slope and equation',
      problemMd: md`For $A(-1, 2)$ and $B(5, 10)$, find $AB$, the midpoint of $AB$, the slope of line $AB$ and its equation.`,
      steps: [
        md`Gaps: $5 - (-1) = 6$ horizontally and $10 - 2 = 8$ vertically.`,
        md`Distance: $\sqrt{6^2 + 8^2} = \sqrt{100} = 10$.`,
        md`Midpoint: $\left(\frac{-1 + 5}{2}, \frac{2 + 10}{2}\right) = (2, 6)$.`,
        md`Slope: $\frac{8}{6} = \frac{4}{3}$.`,
        md`Point and slope through $A$: $y - 2 = \frac{4}{3}(x + 1)$. Multiply by 3: $3y - 6 = 4x + 4$, so $4x - 3y + 10 = 0$. Check with $B$: $20 - 30 + 10 = 0$.`,
      ],
      answerMd: md`$AB = 10$, midpoint $(2, 6)$, slope $\frac{4}{3}$, line $4x - 3y + 10 = 0$. Writing the slope as $\frac{6}{8}$, run over rise, is the tempting inversion.`,
    },
    {
      id: 'example-perpendicular-line',
      title: 'A perpendicular through a given point',
      problemMd: md`Find the line through $P(2, -1)$ perpendicular to $3x - 4y + 7 = 0$.`,
      steps: [
        md`Slope of the given line: $-\frac{a}{b} = -\frac{3}{-4} = \frac{3}{4}$.`,
        md`Perpendicular slope: flip and change sign, $-\frac{4}{3}$.`,
        md`Point and slope: $y + 1 = -\frac{4}{3}(x - 2)$. Multiply by 3: $3y + 3 = -4x + 8$, so $4x + 3y - 5 = 0$.`,
        md`Check with the shortcut: swapping $a$ and $b$ and changing one sign gives $4x + 3y + k = 0$, and $P$ gives $8 - 3 + k = 0$, so $k = -5$. The same line.`,
      ],
      answerMd: md`The line is $4x + 3y - 5 = 0$. Taking only the negative ($-\frac{3}{4}$) or only the reciprocal ($\frac{4}{3}$) gives a line that is not perpendicular.`,
    },
    {
      id: 'example-intersection',
      title: 'Where two lines cross',
      problemMd: md`Find the intersection of $2x + y = 7$ and $x - 3y = 7$.`,
      steps: [
        md`The slopes are $-2$ and $\frac{1}{3}$, which differ, so there is exactly one intersection. (Their product is $-\frac{2}{3}$, so the lines are not perpendicular.)`,
        md`From the first equation, $y = 7 - 2x$. Substitute into the second: $x - 3(7 - 2x) = 7$, so $7x - 21 = 7$ and $x = 4$.`,
        md`Then $y = 7 - 8 = -1$.`,
        md`Check in both: $8 - 1 = 7$ and $4 + 3 = 7$.`,
      ],
      answerMd: md`The lines meet at $(4, -1)$.`,
    },
    {
      id: 'example-point-line-distance',
      title: 'Distance from a point to a line',
      problemMd: md`Find the distance from $P(1, 2)$ to the line $3x + 4y = 21$.`,
      steps: [
        md`Put the line in general form first: $3x + 4y - 21 = 0$, so $a = 3$, $b = 4$, $c = -21$.`,
        md`Numerator: $\lvert 3 + 8 - 21 \rvert = \lvert -10 \rvert = 10$. Denominator: $\sqrt{9 + 16} = 5$.`,
        md`Distance: $\frac{10}{5} = 2$.`,
        md`Second route: the perpendicular from $P$ runs in the direction $(3, 4)$. The point $(1 + 3t, 2 + 4t)$ is on the line when $25t + 11 = 21$, so $t = 0.4$, giving the foot $(2.2, 3.6)$. Its distance from $P$ is $0.4 \cdot \sqrt{3^2 + 4^2} = 2$.`,
      ],
      answerMd: md`The distance is $2$. Using $c = +21$, from the equation before it was rearranged, gives $\frac{32}{5}$, which is wrong.`,
    },
  ],
  traps: [
    {
      title: 'Half a perpendicular',
      md: md`The perpendicular slope needs both moves: reciprocal and sign change. From slope $3$, the perpendicular slope is $-\frac{1}{3}$; $-3$ is the slope of a line with the opposite tilt, and $\frac{1}{3}$ is a line of similar tilt. Check by multiplying: the product must be $-1$.`,
    },
    {
      title: 'Reading the slope off the general form',
      md: md`In $ax + by + c = 0$ the slope is $-\frac{a}{b}$, not $a$, not $\frac{b}{a}$. For $2x - 5y + 4 = 0$ it is $\frac{2}{5}$. If in doubt, solve for $y$.`,
    },
    {
      title: 'Mismatched order in the slope',
      md: md`Writing $\frac{y_2 - y_1}{x_1 - x_2}$ flips the sign of the slope. Subtract the coordinates of the same point first, top and bottom.`,
    },
    {
      title: 'Distance formula on an unrearranged equation',
      md: md`The point-to-line formula needs everything on one side equal to zero. With $3x + 4y = 21$ the constant is $-21$, not $21$.`,
    },
  ],
  check: [
    {
      id: 'check-distance-two-points',
      title: 'Distance between two points',
      topic: 'Points and distances',
      stemMd: md`What is the distance between $P(-2, 5)$ and $Q(4, -3)$?`,
      options: [
        { id: 'A', text: md`$2\sqrt{2}$`, note: md`This adds the coordinates instead of subtracting them, giving gaps of 2 and 2. That is the route to the midpoint, not to the distance.` },
        { id: 'B', text: md`$10$`, note: '' },
        { id: 'C', text: md`$14$`, note: md`This adds the two gaps, $6 + 8$. A straight line is shorter than going across and then up: the gaps are legs of a right triangle.` },
        { id: 'D', text: md`$100$`, note: md`This is the sum of the squared gaps, the distance squared; the square root was left out.` },
      ],
      answer: 'B',
      workingMd: md`The gaps are $4 - (-2) = 6$ and $-3 - 5 = -8$. Distance: $\sqrt{36 + 64} = \sqrt{100} = 10$.`,
      lesson: 'Distance squares the gaps, adds them and takes the root; the sign of each gap does not matter.',
    },
    {
      id: 'check-parallel-through-point',
      title: 'A parallel through a point',
      topic: 'Lines',
      stemMd: md`Which line passes through $(1, 3)$ and is parallel to $2x - 5y + 4 = 0$?`,
      options: [
        { id: 'A', text: md`$5x + 2y - 11 = 0$`, note: md`This line has slope $-\frac{5}{2}$, so it is perpendicular to the given line, not parallel.` },
        { id: 'B', text: md`$5x - 2y + 1 = 0$`, note: md`This line has slope $\frac{5}{2}$, the reciprocal of the right slope; it comes from reading the slope of the given line as $\frac{b}{a}$ with a sign slip.` },
        { id: 'C', text: md`$2x - 5y + 4 = 0$`, note: md`This is the given line itself. It does not pass through $(1, 3)$: $2 - 15 + 4 = -9$, not 0.` },
        { id: 'D', text: md`$2x - 5y + 13 = 0$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Parallel lines keep $a$ and $b$: $2x - 5y + k = 0$. Through $(1, 3)$: $2 - 15 + k = 0$, so $k = 13$. Check by slopes: the given line has slope $-\frac{2}{-5} = \frac{2}{5}$, and so does the answer.`,
      lesson: 'For a parallel line, keep the coefficients of x and y and choose the constant that fits the point.',
    },
    {
      id: 'check-perpendicular-parameter',
      title: 'Making two lines perpendicular',
      topic: 'Lines',
      stemMd: md`For which value of $k$ is the line $kx + 2y - 1 = 0$ perpendicular to the line $3x - y + 5 = 0$?`,
      options: [
        { id: 'A', text: md`$-6$`, note: md`With $k = -6$ the first line has slope 3, equal to the second: the lines are parallel, not perpendicular.` },
        { id: 'B', text: md`$-\frac{2}{3}$`, note: md`This gives slope $\frac{1}{3}$, the reciprocal of 3 without the sign change; the product of slopes is $+1$.` },
        { id: 'C', text: md`$\frac{2}{3}$`, note: '' },
        { id: 'D', text: md`$6$`, note: md`This gives slope $-3$, the negative of 3 without the reciprocal; the product of slopes is $-9$.` },
      ],
      answer: 'C',
      workingMd: md`The second line is $y = 3x + 5$, slope 3. The first has slope $-\frac{k}{2}$. Perpendicular means $3 \cdot \left(-\frac{k}{2}\right) = -1$, so $k = \frac{2}{3}$. Check: the first slope is then $-\frac{1}{3}$, and $3 \cdot \left(-\frac{1}{3}\right) = -1$.`,
      lesson: 'Perpendicular slopes multiply to minus one: reciprocal and sign change together.',
    },
  ],
  takeaways: [
    md`Distance $\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$ subtracts; the midpoint averages.`,
    md`The slope of $ax + by + c = 0$ is $-\frac{a}{b}$.`,
    md`Parallel: equal slopes. Perpendicular: slopes multiply to $-1$.`,
    md`Point to line: $\frac{\lvert ax_0 + by_0 + c \rvert}{\sqrt{a^2 + b^2}}$, with the line written as $ax + by + c = 0$ first.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-analytic-lines' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
