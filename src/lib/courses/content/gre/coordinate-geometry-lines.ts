import { md, type Lesson } from '../../types';

export const coordinateLinesLesson: Lesson = {
  slug: 'coordinate-geometry-lines',
  title: 'Coordinate geometry: lines, slopes and intercepts',
  summary: 'Find slopes and intercepts, write the equation of a line, use parallel and perpendicular slopes, and find midpoints and distances on the plane.',
  minutes: 22,
  objectives: [
    'Find the slope of a line from two points or from its equation in any form.',
    'Write the equation of a line from a point and a slope, and find its intercepts.',
    'Use the slope rules for parallel and perpendicular lines.',
    'Find the midpoint of, and the distance between, two points.',
  ],
  teachMd: md`
### Slope is rise over run

The slope of the line through $(x_1, y_1)$ and $(x_2, y_2)$ is

$$m = \frac{y_2 - y_1}{x_2 - x_1}$$

It measures how much $y$ changes when $x$ increases by 1. Take both differences in the **same order**: if you start the top with the second point, start the bottom with the second point too. Mixing the order flips the sign.

| Slope | The line |
| --- | --- |
| positive | rises from left to right |
| negative | falls from left to right |
| zero | horizontal, $y = c$ |
| undefined | vertical, $x = c$ |

### Three forms of a line

**Slope-intercept form**, $y = mx + b$: $m$ is the slope and $b$ is the $y$-intercept, where the line crosses the $y$-axis. This is the most useful form for reading a line at a glance.

**Point-slope form**, $y - y_1 = m(x - x_1)$: use it when you know one point $(x_1, y_1)$ and the slope. Then rearrange to $y = mx + b$.

**Standard form**, $Ax + By = C$: common in questions. To read its slope, solve for $y$: $y = -\frac{A}{B}x + \frac{C}{B}$, so the slope is $-\frac{A}{B}$. Forgetting the minus sign is the usual slip.

### Intercepts

The $y$-intercept is where $x = 0$; the $x$-intercept is where $y = 0$. For $3x + 4y = 24$, setting $x = 0$ gives $y = 6$, and setting $y = 0$ gives $x = 8$. Standard form makes intercepts quick; slope-intercept form makes the slope quick. Choose the form that suits the question.

### Is a point on the line?

A point lies on a line exactly when its coordinates satisfy the equation. To test $(4, 1)$ against $y = -\frac{1}{2}x + 3$, substitute $x = 4$: $y = -2 + 3 = 1$. It matches, so the point is on the line. This is often the fastest way through a question that lists points as options.

### Parallel and perpendicular lines

- Parallel lines have **equal** slopes (and different intercepts).
- Perpendicular lines have slopes whose product is $-1$: each slope is the **negative reciprocal** of the other. A slope of $\frac{2}{3}$ pairs with $-\frac{3}{2}$; a slope of $-4$ pairs with $\frac{1}{4}$.

Both parts of "negative reciprocal" matter. Flipping the fraction without changing the sign, or changing the sign without flipping, gives a line that is not perpendicular. A horizontal line (slope 0) is perpendicular to a vertical line, which has no slope; this is the one case the product rule does not cover.

### Midpoint and distance

The midpoint of $(x_1, y_1)$ and $(x_2, y_2)$ averages the coordinates:

$$\left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)$$

The distance between them comes from the Pythagorean theorem, with the horizontal and vertical gaps as the two legs:

$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

Sketching the right triangle is often quicker than the formula, and it shows when the gaps form a familiar triple such as 6, 8, 10.

### Regions on either side of a line

An inequality such as $y > 2x - 1$ describes the points above the line $y = 2x - 1$, and $y < 2x - 1$ the points below it. To check which side a region is on, test a convenient point such as $(0, 0)$: here $0 > -1$ is true, so the origin is in the region $y > 2x - 1$.

### Draw it

Even a rough sketch on scratch paper catches sign errors. A line through $(-1, 4)$ and $(3, -4)$ obviously falls, so a positive slope is impossible; a perpendicular slope that has the same sign as the original slope is impossible too.
`,
  examples: [
    {
      id: 'example-two-points',
      title: 'From two points to an equation',
      problemMd: md`Find the equation of the line through $(-1, 4)$ and $(3, -4)$, and its $x$-intercept.`,
      steps: [
        md`Slope, taking both differences in the same order: $m = \frac{-4 - 4}{3 - (-1)} = \frac{-8}{4} = -2$.`,
        md`Point-slope form with $(-1, 4)$: $y - 4 = -2(x + 1)$, so $y = -2x - 2 + 4 = -2x + 2$.`,
        md`Check with the other point: $-2(3) + 2 = -4$. It matches.`,
        md`$x$-intercept: set $y = 0$, so $0 = -2x + 2$ and $x = 1$.`,
      ],
      answerMd: md`$y = -2x + 2$, with $x$-intercept 1 and $y$-intercept 2. Computing $3 - (-1)$ as $2$ would give a slope of $-4$, which the check with $(3, -4)$ rejects.`,
    },
    {
      id: 'example-perpendicular',
      title: 'A perpendicular line through a point',
      problemMd: md`Find the line perpendicular to $2x + 3y = 6$ that passes through $(4, 1)$.`,
      steps: [
        md`Slope of the given line: $3y = -2x + 6$, so $y = -\frac{2}{3}x + 2$ and the slope is $-\frac{2}{3}$.`,
        md`Negative reciprocal: flip to $-\frac{3}{2}$ and change the sign to get $\frac{3}{2}$. Check: $-\frac{2}{3} \times \frac{3}{2} = -1$.`,
        md`Point-slope form: $y - 1 = \frac{3}{2}(x - 4)$, so $y = \frac{3}{2}x - 6 + 1 = \frac{3}{2}x - 5$.`,
        md`Check the point: $\frac{3}{2}(4) - 5 = 1$.`,
      ],
      answerMd: md`$y = \frac{3}{2}x - 5$. Using $-\frac{3}{2}$ (flipped but not negated) gives a line that is not perpendicular.`,
    },
    {
      id: 'example-intercept-triangle',
      title: 'The triangle cut off by a line',
      problemMd: md`The line $3x + 4y = 24$ and the two axes enclose a triangle. Find its area and the length of its longest side.`,
      steps: [
        md`Intercepts: $x = 0$ gives $y = 6$; $y = 0$ gives $x = 8$. The vertices are $(0, 0)$, $(8, 0)$ and $(0, 6)$.`,
        md`The legs lie along the axes, with lengths 8 and 6, so the area is $\frac{1}{2} \times 8 \times 6 = 24$.`,
        md`The longest side joins $(8, 0)$ and $(0, 6)$: $\sqrt{8^2 + 6^2} = \sqrt{100} = 10$.`,
      ],
      answerMd: md`The area is 24 and the longest side is 10. Forgetting the $\frac{1}{2}$ gives 48.`,
    },
    {
      id: 'example-midpoint-distance',
      title: 'Midpoint and distance',
      problemMd: md`Find the midpoint of, and the distance between, $(-2, 5)$ and $(4, -3)$.`,
      steps: [
        md`Midpoint: $\left(\frac{-2 + 4}{2}, \frac{5 + (-3)}{2}\right) = (1, 1)$.`,
        md`Gaps: horizontal $4 - (-2) = 6$, vertical $-3 - 5 = -8$, which has length 8.`,
        md`Distance: $\sqrt{6^2 + 8^2} = \sqrt{100} = 10$.`,
        md`Check: the midpoint should be half the distance from each end; from $(1, 1)$ to $(4, -3)$ is $\sqrt{9 + 16} = 5$.`,
      ],
      answerMd: md`The midpoint is $(1, 1)$ and the distance is 10.`,
    },
  ],
  traps: [
    {
      title: 'Run over rise',
      md: md`Slope is the change in $y$ over the change in $x$. Writing it upside down gives the reciprocal, which is often an option. Say "rise over run" as you write it.`,
    },
    {
      title: 'The sign of a slope from standard form',
      md: md`$Ax + By = C$ has slope $-\frac{A}{B}$. For $2x - 5y = 10$ the slope is $-\frac{2}{-5} = \frac{2}{5}$. Solving for $y$ is slower but safer than a remembered formula.`,
    },
    {
      title: 'Half a negative reciprocal',
      md: md`A line perpendicular to slope $\frac{2}{5}$ has slope $-\frac{5}{2}$. Only flipping ($\frac{5}{2}$) or only negating ($-\frac{2}{5}$) is wrong, and both are tempting options.`,
    },
    {
      title: 'Subtracting a negative coordinate',
      md: md`$3 - (-1) = 4$, not 2. Write the brackets in every difference of coordinates.`,
    },
  ],
  check: [
    {
      id: 'check-y-intercept',
      title: 'From two points to the intercept',
      topic: 'Coordinate Geometry',
      stemMd: md`Line $k$ passes through the points $(2, -1)$ and $(6, 7)$. What is the $y$-intercept of line $k$?`,
      options: [
        { id: 'A', text: md`$-5$`, note: '' },
        { id: 'B', text: md`$-2$`, note: md`Uses the slope upside down, $\frac{1}{2}$, so $-1 = 1 + b$.` },
        { id: 'C', text: md`$\frac{5}{2}$`, note: md`This is the $x$-intercept, where $y = 0$, not the $y$-intercept.` },
        { id: 'D', text: md`$3$`, note: md`Uses a slope of $-2$, with the differences taken in opposite orders, so $-1 = -4 + b$.` },
        { id: 'E', text: md`$5$`, note: md`From $-1 = 4 + b$, adds 4 instead of subtracting it.` },
      ],
      answer: 'A',
      workingMd: md`Slope: $\frac{7 - (-1)}{6 - 2} = \frac{8}{4} = 2$. Then $-1 = 2(2) + b$, so $b = -5$. Check with the other point: $2(6) - 5 = 7$.`,
      lesson: md`Find the slope, then substitute one point into $y = mx + b$ and check with the other point.`,
    },
    {
      id: 'check-perpendicular-slope',
      title: 'Comparing two slopes',
      topic: 'Quantitative Comparison',
      stemMd: md`Line $\ell$ has equation $2x - 5y = 10$. Line $p$ is perpendicular to line $\ell$.

| Quantity A | Quantity B |
| --- | --- |
| The slope of line $\ell$ | The slope of line $p$ |`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: '' },
        { id: 'B', text: 'Quantity B is greater.', note: md`Reads the slope of $\ell$ as $-\frac{2}{5}$ by dropping the sign of $-5y$; then the perpendicular slope would be $\frac{5}{2}$, which is larger.` },
        { id: 'C', text: 'The two quantities are equal.', note: md`Equal slopes belong to parallel lines; perpendicular lines have slopes that multiply to $-1$.` },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: md`Line $p$ could be any of many perpendicular lines, but all of them share the slope $-\frac{5}{2}$.` },
      ],
      answer: 'A',
      workingMd: md`Solve for $y$: $-5y = -2x + 10$, so $y = \frac{2}{5}x - 2$, and the slope of $\ell$ is $\frac{2}{5}$. The perpendicular slope is $-\frac{5}{2}$. Since $\frac{2}{5} > -\frac{5}{2}$, Quantity A is greater.`,
      lesson: 'Rewrite a line in the form y = mx + b before reading its slope, then take the negative reciprocal for a perpendicular line.',
    },
    {
      id: 'check-point-on-line',
      title: 'Which point is on the line?',
      topic: 'Coordinate Geometry',
      stemMd: md`A line has slope $-\frac{1}{2}$ and $y$-intercept 3. Which of the following points lies on the line?`,
      options: [
        { id: 'A', text: md`$(-4, 1)$`, note: md`Lies on the line with slope $+\frac{1}{2}$; on the given line, $x = -4$ gives $y = 5$.` },
        { id: 'B', text: md`$(1, 1)$`, note: md`Lies on a line with slope $-2$, the slope flipped upside down; the given line has $y = 2.5$ at $x = 1$.` },
        { id: 'C', text: md`$(4, 1)$`, note: '' },
        { id: 'D', text: md`$(3, 0)$`, note: md`Treats 3 as the $x$-intercept; the $x$-intercept is 6, and at $x = 3$ the line has $y = 1.5$.` },
        { id: 'E', text: md`$(2, 7)$`, note: md`Lies on a line with slope 2, the reciprocal without the sign; the given line has $y = 2$ at $x = 2$.` },
      ],
      answer: 'C',
      workingMd: md`The line is $y = -\frac{1}{2}x + 3$. At $x = 4$: $y = -2 + 3 = 1$, so $(4, 1)$ is on the line. Testing the others: $x = -4$ gives 5, $x = 1$ gives 2.5, $x = 3$ gives 1.5, and $x = 2$ gives 2, none matching.`,
      lesson: 'To test a point, substitute its x-coordinate into the equation and compare the y-value.',
    },
  ],
  takeaways: [
    'Slope is rise over run, with both differences in the same order.',
    md`Read a slope from $y = mx + b$; for $Ax + By = C$ it is $-\frac{A}{B}$.`,
    'Parallel lines share a slope; perpendicular slopes are negative reciprocals.',
    md`Intercepts: set $x = 0$ for the $y$-intercept and $y = 0$ for the $x$-intercept.`,
    'Distance is the Pythagorean theorem on the horizontal and vertical gaps.',
  ],
  practice: { examKey: 'gre', domain: 'quant-algebra', skill: 'alg-coordinate-geometry' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
