import { md, type Lesson } from '../../types';

export const trigonometricFunctionsAndIdentitiesLesson: Lesson = {
  slug: 'trigonometric-functions-and-identities',
  title: 'Trigonometric functions, graphs and identities',
  summary: 'Extend sine, cosine and tangent to any angle on the unit circle, read their graphs and signs, and use the main identities to evaluate and solve.',
  minutes: 25,
  objectives: [
    'Find the exact sine, cosine and tangent of any angle built from 30°, 45° or 60°, with the right sign for its quadrant.',
    'Describe the graphs of sine, cosine and tangent: period, range and zeros, and the ranges of their inverse functions.',
    md`Use $\sin^2 x + \cos^2 x = 1$, the addition formulas and the double-angle formulas to evaluate expressions and solve simple equations.`,
  ],
  teachMd: md`
### From triangles to the unit circle

Right triangles only define the ratios for angles between 0° and 90°. To go further, draw the **unit circle**: centre at the origin, radius 1. Measure an angle $x$ from the positive $x$-axis, anticlockwise for positive angles. The radius at angle $x$ ends at a point $P$, and by definition

$$\cos x = \text{the } x\text{-coordinate of } P \qquad \sin x = \text{the } y\text{-coordinate of } P \qquad \tan x = \frac{\sin x}{\cos x}$$

For acute angles this agrees with the triangle definitions, because the hypotenuse is the radius, 1. Since $P$ is on a circle of radius 1, Pythagoras gives the fundamental identity:

$$\sin^2 x + \cos^2 x = 1$$

Here $\sin^2 x$ means $(\sin x)^2$. This identity turns any known sine into a cosine up to its sign, and the sign comes from the quadrant.

### Signs by quadrant

| Quadrant | Angles | sin | cos | tan |
| --- | --- | --- | --- | --- |
| I | $0$ to $\frac{\pi}{2}$ | + | + | + |
| II | $\frac{\pi}{2}$ to $\pi$ | + | − | − |
| III | $\pi$ to $\frac{3\pi}{2}$ | − | − | + |
| IV | $\frac{3\pi}{2}$ to $2\pi$ | − | + | − |

To evaluate a ratio of an angle outside the first quadrant, find its **reference angle**, the acute angle between the radius and the $x$-axis, take the value from the table of special angles, then attach the sign of the quadrant. For $\frac{5\pi}{6}$ (150°) the reference angle is $\frac{\pi}{6}$, so $\sin\frac{5\pi}{6} = \frac{1}{2}$ and $\cos\frac{5\pi}{6} = -\frac{\sqrt{3}}{2}$. Behind this sit the symmetry rules $\sin(\pi - x) = \sin x$, $\cos(\pi - x) = -\cos x$, $\sin(-x) = -\sin x$ and $\cos(-x) = \cos x$.

### The graphs, in words

- **Sine** starts at 0 when $x = 0$, rises to 1 at $\frac{\pi}{2}$, returns to 0 at $\pi$, falls to $-1$ at $\frac{3\pi}{2}$ and is back at 0 at $2\pi$: a smooth wave, repeating every $2\pi$, with values between $-1$ and $1$. It is an odd function, symmetric about the origin.
- **Cosine** is the same wave shifted left by $\frac{\pi}{2}$: it starts at its maximum 1 when $x = 0$, is 0 at $\frac{\pi}{2}$ and $-1$ at $\pi$. Period $2\pi$, range $[-1, 1]$, symmetric about the $y$-axis (even).
- **Tangent** is 0 at $x = 0$ and climbs without bound as $x$ approaches $\frac{\pi}{2}$, where it is undefined (a vertical asymptote). It repeats every $\pi$, not $2\pi$, and takes every real value.

### Inverse functions

Because sine is not one-to-one, $\arcsin$ is defined by restricting sine to $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$. So $\arcsin y$ is the one angle in that interval whose sine is $y$, for $y$ in $[-1, 1]$. Likewise $\arccos y$ lies in $[0, \pi]$, and $\arctan y$ lies strictly between $-\frac{\pi}{2}$ and $\frac{\pi}{2}$ for every real $y$. Thus $\arcsin\left(-\frac{1}{2}\right) = -\frac{\pi}{6}$, not $\frac{7\pi}{6}$, and $\arccos\left(-\frac{1}{2}\right) = \frac{2\pi}{3}$.

### Addition and double-angle formulas

$$\sin(a \pm b) = \sin a\cos b \pm \cos a\sin b \qquad \cos(a \pm b) = \cos a\cos b \mp \sin a\sin b$$

Setting $a = b = x$ gives the double-angle formulas:

$$\sin 2x = 2\sin x\cos x \qquad \cos 2x = \cos^2 x - \sin^2 x = 1 - 2\sin^2 x = 2\cos^2 x - 1$$

Choose the version of $\cos 2x$ that leaves only one function in your equation. The addition formulas also give exact values such as $\cos 75° = \cos(45° + 30°)$.

### Solving simple equations

An equation like $\sin x = \frac{1}{2}$ has infinitely many solutions: $x = \frac{\pi}{6} + 2k\pi$ and $x = \frac{5\pi}{6} + 2k\pi$ for every integer $k$. Two angles per turn share each sine (they are symmetric about the $y$-axis), and two share each cosine (symmetric about the $x$-axis). Questions usually restrict $x$ to an interval such as $[0, 2\pi)$; list the solutions in it and count carefully at the ends. Equations in $\sin^2 x$ and $\sin x$, or after a double-angle substitution, become quadratics in one function: solve for the function first, discard values outside $[-1, 1]$, then find the angles.

Simplifying also uses the identities: $\frac{1 - \cos^2 x}{\sin x\cos x} = \frac{\sin^2 x}{\sin x\cos x} = \tan x$, wherever the denominator is not zero.
`,
  examples: [
    {
      id: 'example-second-quadrant',
      title: 'A sine in the second quadrant',
      problemMd: md`Given $\sin x = \frac{3}{5}$ with $\frac{\pi}{2} < x < \pi$, find $\cos x$, $\tan x$, $\sin 2x$ and $\cos 2x$.`,
      steps: [
        md`From the identity, $\cos^2 x = 1 - \frac{9}{25} = \frac{16}{25}$, so $\cos x = \pm\frac{4}{5}$. In the second quadrant cosine is negative: $\cos x = -\frac{4}{5}$.`,
        md`$\tan x = \frac{3/5}{-4/5} = -\frac{3}{4}$, negative as the table of signs predicts.`,
        md`$\sin 2x = 2 \cdot \frac{3}{5} \cdot \left(-\frac{4}{5}\right) = -\frac{24}{25}$.`,
        md`$\cos 2x = 1 - 2 \cdot \frac{9}{25} = \frac{7}{25}$. Check with the other version: $\frac{16}{25} - \frac{9}{25} = \frac{7}{25}$.`,
        md`Final check: $\left(\frac{24}{25}\right)^2 + \left(\frac{7}{25}\right)^2 = \frac{576 + 49}{625} = 1$.`,
      ],
      answerMd: md`$\cos x = -\frac{4}{5}$, $\tan x = -\frac{3}{4}$, $\sin 2x = -\frac{24}{25}$, $\cos 2x = \frac{7}{25}$. Taking the positive root for the cosine gives $+\frac{24}{25}$ for $\sin 2x$, the tempting wrong sign.`,
    },
    {
      id: 'example-exact-values',
      title: 'Exact values without a calculator',
      problemMd: md`Find $\sin 210°$, $\tan 135°$ and $\cos 75°$ exactly.`,
      steps: [
        md`$210°$ is in the third quadrant with reference angle $30°$; sine is negative there, so $\sin 210° = -\frac{1}{2}$.`,
        md`$135°$ is in the second quadrant with reference angle $45°$; tangent is negative there, so $\tan 135° = -1$.`,
        md`$\cos 75° = \cos(45° + 30°) = \cos 45°\cos 30° - \sin 45°\sin 30° = \frac{\sqrt{2}}{2} \cdot \frac{\sqrt{3}}{2} - \frac{\sqrt{2}}{2} \cdot \frac{1}{2} = \frac{\sqrt{6} - \sqrt{2}}{4}$.`,
        md`Sense check: $\sqrt{6} \approx 2.45$ and $\sqrt{2} \approx 1.41$, so the value is about $0.26$, small and positive, as it should be for an angle close to $90°$.`,
      ],
      answerMd: md`$\sin 210° = -\frac{1}{2}$, $\tan 135° = -1$, $\cos 75° = \frac{\sqrt{6} - \sqrt{2}}{4}$. Writing $\cos 75° = \cos 45° + \cos 30°$ gives a number greater than 1, which no cosine can be.`,
    },
    {
      id: 'example-quadratic-in-sine',
      title: 'An equation that is a quadratic in disguise',
      problemMd: md`Solve $2\sin^2 x - \sin x - 1 = 0$ for $0 \le x < 2\pi$.`,
      steps: [
        md`Put $s = \sin x$: $2s^2 - s - 1 = 0$, which factors as $(2s + 1)(s - 1) = 0$. So $s = 1$ or $s = -\frac{1}{2}$, both inside $[-1, 1]$.`,
        md`$\sin x = 1$ has one solution in the interval: $x = \frac{\pi}{2}$.`,
        md`$\sin x = -\frac{1}{2}$: the reference angle is $\frac{\pi}{6}$, and sine is negative in quadrants III and IV, so $x = \pi + \frac{\pi}{6} = \frac{7\pi}{6}$ and $x = 2\pi - \frac{\pi}{6} = \frac{11\pi}{6}$.`,
        md`Check one: $\sin\frac{7\pi}{6} = -\frac{1}{2}$, and $2 \cdot \frac{1}{4} + \frac{1}{2} - 1 = 0$.`,
      ],
      answerMd: md`Three solutions: $\frac{\pi}{2}$, $\frac{7\pi}{6}$ and $\frac{11\pi}{6}$. Stopping at $\arcsin\left(-\frac{1}{2}\right) = -\frac{\pi}{6}$ gives an angle outside the interval and misses both of the real ones.`,
    },
  ],
  traps: [
    {
      title: 'Dropping the quadrant sign',
      md: md`$\sin^2 x + \cos^2 x = 1$ gives $\cos x$ only up to a sign. Decide the sign from the quadrant before going on, or every later result inherits the error.`,
    },
    {
      title: 'Treating sine as linear',
      md: md`$\sin 2x$ is not $2\sin x$, and $\sin(a + b)$ is not $\sin a + \sin b$. Check with $x = 90°$: $\sin 180° = 0$, but $2\sin 90° = 2$.`,
    },
    {
      title: 'One solution where there are two',
      md: md`$\arcsin$ and $\arccos$ return a single angle, but within one full turn a sine or cosine value strictly between $-1$ and $1$ is reached twice. List both angles, then keep those in the requested interval.`,
    },
    {
      title: 'Counting both ends of the interval',
      md: md`In $[0, 2\pi)$ the angle $2\pi$ is excluded. Counting both $0$ and $2\pi$ adds a solution that is the same point on the circle.`,
    },
  ],
  check: [
    {
      id: 'check-product-of-values',
      title: 'Two exact values',
      topic: 'Trigonometric functions',
      stemMd: md`What is the value of $\sin\frac{5\pi}{6} \cdot \cos\frac{4\pi}{3}$?`,
      options: [
        { id: 'A', text: md`$-\frac{\sqrt{3}}{4}$`, note: md`This takes $\sin\frac{5\pi}{6}$ as $\frac{\sqrt{3}}{2}$, the value for a reference angle of $\frac{\pi}{3}$; the reference angle of $\frac{5\pi}{6}$ is $\frac{\pi}{6}$.` },
        { id: 'B', text: md`$-\frac{1}{4}$`, note: '' },
        { id: 'C', text: md`$\frac{1}{4}$`, note: md`The magnitudes are right, but $\frac{4\pi}{3}$ is in the third quadrant, where cosine is negative.` },
        { id: 'D', text: md`$\frac{\sqrt{3}}{4}$`, note: md`This makes both slips: the sine of $\frac{5\pi}{6}$ is taken as $\frac{\sqrt{3}}{2}$ and the minus sign of the cosine is lost.` },
      ],
      answer: 'B',
      workingMd: md`$\frac{5\pi}{6}$ is in the second quadrant with reference angle $\frac{\pi}{6}$, and sine is positive there: $\frac{1}{2}$. $\frac{4\pi}{3}$ is in the third quadrant with reference angle $\frac{\pi}{3}$, and cosine is negative there: $-\frac{1}{2}$. The product is $-\frac{1}{4}$.`,
      lesson: 'Reference angle for the size, quadrant for the sign: do both for every angle.',
    },
    {
      id: 'check-cos-third-quadrant',
      title: 'Cosine from a tangent',
      topic: 'Trigonometric identities',
      stemMd: md`If $\tan x = \frac{3}{4}$ and $\pi < x < \frac{3\pi}{2}$, what is $\cos x$?`,
      options: [
        { id: 'A', text: md`$-\frac{4}{5}$`, note: '' },
        { id: 'B', text: md`$-\frac{3}{5}$`, note: md`This is $\sin x$: the side 3 belongs to the sine, since the tangent is sine over cosine.` },
        { id: 'C', text: md`$\frac{3}{5}$`, note: md`This uses the sine's magnitude and also gives it the wrong sign; in the third quadrant both sine and cosine are negative.` },
        { id: 'D', text: md`$\frac{4}{5}$`, note: md`The size is right, but the sign is not: cosine is negative in the third quadrant. A positive tangent there comes from two negatives.` },
      ],
      answer: 'A',
      workingMd: md`A positive tangent with sine and cosine in the ratio $3 : 4$ means $\sin x = \pm\frac{3}{5}$ and $\cos x = \pm\frac{4}{5}$, with the same sign (a 3-4-5 triangle). In the third quadrant both are negative, so $\cos x = -\frac{4}{5}$. Check: $\frac{-3/5}{-4/5} = \frac{3}{4}$, and $\frac{9}{25} + \frac{16}{25} = 1$.`,
      lesson: 'Get the sizes from a right triangle, then fix every sign from the quadrant.',
    },
    {
      id: 'check-count-solutions',
      title: 'Counting solutions',
      topic: 'Trigonometric identities',
      stemMd: md`How many solutions does $\cos 2x = \cos x$ have in the interval $0 \le x < 2\pi$?`,
      options: [
        { id: 'A', text: md`$1$`, note: md`This keeps only $\cos x = 1$, that is $x = 0$, and loses the second factor of the quadratic.` },
        { id: 'B', text: md`$2$`, note: md`This finds both values of $\cos x$ but takes one angle for each; $\cos x = -\frac{1}{2}$ is reached twice in a full turn.` },
        { id: 'C', text: md`$3$`, note: '' },
        { id: 'D', text: md`$4$`, note: md`This counts $x = 2\pi$ as well as $x = 0$; but $2\pi$ is outside the interval, and it is the same point on the circle.` },
      ],
      answer: 'C',
      workingMd: md`Use $\cos 2x = 2\cos^2 x - 1$: $2\cos^2 x - \cos x - 1 = 0$, so $(2\cos x + 1)(\cos x - 1) = 0$. $\cos x = 1$ gives $x = 0$. $\cos x = -\frac{1}{2}$ gives $x = \frac{2\pi}{3}$ and $x = \frac{4\pi}{3}$. Check $\frac{2\pi}{3}$: $\cos\frac{4\pi}{3} = -\frac{1}{2} = \cos\frac{2\pi}{3}$. Three solutions.`,
      lesson: 'Rewrite with one function, solve the quadratic in it, then count every angle in the interval for each value.',
    },
  ],
  takeaways: [
    md`$\sin^2 x + \cos^2 x = 1$ and $\tan x = \frac{\sin x}{\cos x}$.`,
    'Find the size from the reference angle and the sign from the quadrant.',
    md`Sine and cosine have period $2\pi$ and range $[-1, 1]$; tangent has period $\pi$ and is undefined at $\frac{\pi}{2} + k\pi$.`,
    md`$\sin 2x = 2\sin x\cos x$ and $\cos 2x = 1 - 2\sin^2 x = 2\cos^2 x - 1$.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-trigonometry-identities' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
