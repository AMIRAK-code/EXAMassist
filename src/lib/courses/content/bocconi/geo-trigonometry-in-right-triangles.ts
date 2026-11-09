import { md, type Lesson } from '../../types';

export const trigonometryInRightTrianglesLesson: Lesson = {
  slug: 'trigonometry-in-right-triangles',
  title: 'Trigonometry in right triangles',
  summary: 'Use sine, cosine and tangent to find sides and angles of right triangles, with the exact values for 30, 45 and 60 degrees that a no-calculator test needs.',
  minutes: 20,
  objectives: [
    'Define sine, cosine and tangent of an acute angle as ratios of sides, and pick the right one for a given pair of sides.',
    'Recall the exact values for 30°, 45° and 60°, and convert between degrees and radians.',
    'Solve a right triangle: find the missing sides from one side and one angle, or an angle from two sides.',
  ],
  teachMd: md`
### Three ratios that depend only on the angle

Take a right triangle and one of its acute angles, $\alpha$. Name the sides relative to that angle: the **hypotenuse** is opposite the right angle and is the longest side; the **opposite** leg faces $\alpha$; the **adjacent** leg touches $\alpha$ and is not the hypotenuse. Then

$$\sin\alpha = \frac{\text{opposite}}{\text{hypotenuse}} \qquad \cos\alpha = \frac{\text{adjacent}}{\text{hypotenuse}} \qquad \tan\alpha = \frac{\text{opposite}}{\text{adjacent}}$$

These ratios depend only on the angle, not on the size of the triangle: any two right triangles with the same acute angle are similar, so their sides are in the same proportions. That is why a single number, $\sin 30° = \frac{1}{2}$, holds for every right triangle with a 30° angle.

Two consequences follow at once. Because the hypotenuse is the longest side, the sine and cosine of an acute angle lie strictly between 0 and 1, while the tangent can be any positive number. And $\tan\alpha = \frac{\sin\alpha}{\cos\alpha}$, since dividing the two ratios cancels the hypotenuse.

### Changing the point of view

The two acute angles of a right triangle add up to 90°. The leg opposite one is adjacent to the other, so

$$\sin(90° - \alpha) = \cos\alpha \qquad \cos(90° - \alpha) = \sin\alpha$$

When a question gives the "other" angle, either switch to it or switch the ratio; both work. The label "opposite" or "adjacent" always belongs to a particular angle, so name the angle first.

### The exact values to know

The test does not allow a calculator, so questions use angles whose ratios are exact. They come from two triangles. Half a square, cut along its diagonal, is a 45°-45°-90° triangle with sides $1, 1, \sqrt{2}$. Half an equilateral triangle of side 2, cut along a height, is a 30°-60°-90° triangle with sides $1, \sqrt{3}, 2$: the short leg faces 30°, the long leg faces 60°.

| Angle | Radians | sin | cos | tan |
| --- | --- | --- | --- | --- |
| $30°$ | $\frac{\pi}{6}$ | $\frac{1}{2}$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{3}}{3}$ |
| $45°$ | $\frac{\pi}{4}$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{2}}{2}$ | $1$ |
| $60°$ | $\frac{\pi}{3}$ | $\frac{\sqrt{3}}{2}$ | $\frac{1}{2}$ | $\sqrt{3}$ |

If you forget a value, sketch the small triangle and read the ratio from it. A useful pattern: sine grows from 30° to 60° while cosine shrinks, and $\sin 30° = \cos 60°$, $\sin 60° = \cos 30°$, as the rule for complementary angles says.

### Degrees and radians

A full turn is $360°$ or $2\pi$ radians, so $180° = \pi$. To convert degrees to radians multiply by $\frac{\pi}{180}$; to go back multiply by $\frac{180}{\pi}$. So $120° = \frac{2\pi}{3}$ and $\frac{5\pi}{4} = 225°$. Answer options may mix the two units; convert before comparing.

### Solving a right triangle

"Solving" means finding every side and angle from what is given. Two situations cover almost everything:

- **One side and one acute angle.** Pick the ratio that links the known side with the side you want. If the hypotenuse $c$ is known, the leg opposite $\alpha$ is $c\sin\alpha$ and the adjacent leg is $c\cos\alpha$. If a leg is known, use the tangent between the two legs, or divide by the sine or cosine to get the hypotenuse.
- **Two sides.** Find the third with the Pythagorean theorem, and the angle from the ratio of the two sides you know. With a special ratio such as $\frac{1}{2}$ or $\sqrt{3}$, the angle is read from the table; this is what the inverse functions $\arcsin$, $\arccos$ and $\arctan$ do, so $\arctan\sqrt{3} = 60°$.

### Where these triangles hide

Many questions do not say "right triangle". An angle of elevation or depression, the slope of a ramp, a ladder against a wall, a shadow on flat ground: each forms a right angle with the horizontal. In coordinate geometry, a line of slope $m$ makes an angle $\theta$ with the $x$-axis where $\tan\theta = m$: the slope is rise over run, opposite over adjacent. A line of slope $\sqrt{3}$ rises at 60°. The area of any triangle with two sides $a$, $b$ and the angle $\gamma$ between them is $\frac{1}{2}ab\sin\gamma$, because $b\sin\gamma$ is the height on side $a$.
`,
  examples: [
    {
      id: 'example-hypotenuse-and-angle',
      title: 'Hypotenuse and one angle',
      problemMd: md`A right triangle has hypotenuse 10 and an acute angle of $30°$. Find its legs and its area.`,
      steps: [
        md`The leg opposite $30°$ is $10\sin 30° = 10 \cdot \frac{1}{2} = 5$.`,
        md`The leg adjacent to $30°$ is $10\cos 30° = 10 \cdot \frac{\sqrt{3}}{2} = 5\sqrt{3}$.`,
        md`Check with Pythagoras: $25 + 75 = 100 = 10^2$.`,
        md`Area: half the product of the legs, $\frac{1}{2} \cdot 5 \cdot 5\sqrt{3} = \frac{25\sqrt{3}}{2}$.`,
      ],
      answerMd: md`Legs $5$ and $5\sqrt{3}$, area $\frac{25\sqrt{3}}{2}$. Swapping sine and cosine puts the longer leg opposite the smaller angle, which is impossible: the shortest side always faces the smallest angle.`,
    },
    {
      id: 'example-from-a-sine',
      title: 'All three ratios from one',
      problemMd: md`In a right triangle with hypotenuse 26, the acute angle $\alpha$ has $\sin\alpha = \frac{5}{13}$. Find $\cos\alpha$, $\tan\alpha$, the legs and the area.`,
      steps: [
        md`Sketch a triangle with opposite side 5 and hypotenuse 13. The adjacent side is $\sqrt{169 - 25} = 12$.`,
        md`So $\cos\alpha = \frac{12}{13}$ and $\tan\alpha = \frac{5}{12}$.`,
        md`Scale to the real hypotenuse 26 (a factor of 2): the legs are $26 \cdot \frac{5}{13} = 10$ and $26 \cdot \frac{12}{13} = 24$.`,
        md`Check: $100 + 576 = 676 = 26^2$. Area: $\frac{1}{2} \cdot 10 \cdot 24 = 120$.`,
      ],
      answerMd: md`$\cos\alpha = \frac{12}{13}$, $\tan\alpha = \frac{5}{12}$, legs 10 and 24, area 120.`,
    },
    {
      id: 'example-shadow',
      title: 'A shadow at two times of day',
      problemMd: md`A vertical pole on level ground casts a shadow 9 m long when the sun is $30°$ above the horizon. How tall is the pole, and how long is its shadow when the sun is $60°$ above the horizon?`,
      steps: [
        md`The pole, the shadow and the sun's ray form a right triangle with the right angle at the foot of the pole. The angle of $30°$ is at the tip of the shadow; the pole is opposite it and the shadow adjacent.`,
        md`Height: $9\tan 30° = 9 \cdot \frac{\sqrt{3}}{3} = 3\sqrt{3}$ m.`,
        md`At $60°$: shadow $= \frac{\text{height}}{\tan 60°} = \frac{3\sqrt{3}}{\sqrt{3}} = 3$ m.`,
        md`Sense check: a higher sun gives a shorter shadow, and $3 < 9$.`,
      ],
      answerMd: md`The pole is $3\sqrt{3}$ m tall (about 5.2 m), and its shadow at $60°$ is 3 m. Using $\tan 60°$ for the first step gives $9\sqrt{3}$ m, a pole taller than its own long shadow at a low sun, which cannot be.`,
    },
  ],
  traps: [
    {
      title: 'Opposite and adjacent to which angle?',
      md: md`The same leg is opposite one acute angle and adjacent to the other. Before choosing a ratio, put a finger on the angle the question names; in triangle $ABC$ with the right angle at $C$, side $BC$ is opposite $A$ and adjacent to $B$.`,
    },
    {
      title: 'Mixing up the 30° and 60° values',
      md: md`$\sin 30° = \frac{1}{2}$ but $\sin 60° = \frac{\sqrt{3}}{2}$. The short leg of a 30°-60°-90° triangle faces the 30° angle. If unsure, sketch half an equilateral triangle.`,
    },
    {
      title: 'Multiplying when you should divide',
      md: md`If the known side is a leg and you want the hypotenuse, divide: hypotenuse $= \frac{\text{opposite}}{\sin\alpha}$. Multiplying by $\sin\alpha$ gives something shorter than the leg, which cannot be the hypotenuse.`,
    },
    {
      title: 'Degrees and radians in the same question',
      md: md`The sine of 30 radians is not $\frac{1}{2}$; only $\sin 30° = \frac{1}{2}$. When options are in radians, convert the angle ($30° = \frac{\pi}{6}$) before matching.`,
    },
  ],
  check: [
    {
      id: 'check-adjacent-side',
      title: 'The side next to the angle',
      topic: 'Trigonometry',
      stemMd: md`In triangle $ABC$ the right angle is at $C$, the hypotenuse $AB$ is 12, and the angle at $A$ is $60°$. What is the length of $AC$?`,
      options: [
        { id: 'A', text: md`$6$`, note: '' },
        { id: 'B', text: md`$6\sqrt{2}$`, note: md`This uses $\frac{\sqrt{2}}{2}$, the value for $45°$, not for $60°$.` },
        { id: 'C', text: md`$6\sqrt{3}$`, note: md`This is $12\sin 60°$, the side $BC$ opposite $A$. Side $AC$ touches the angle at $A$, so it is the adjacent side.` },
        { id: 'D', text: md`$24$`, note: md`This divides 12 by $\cos 60°$, as if $AB$ were the adjacent leg; but $AB$ is the hypotenuse, and no leg can be longer than it.` },
      ],
      answer: 'A',
      workingMd: md`$AC$ is adjacent to the angle at $A$ and $AB$ is the hypotenuse, so $AC = 12\cos 60° = 12 \cdot \frac{1}{2} = 6$. Check: $BC = 12\sin 60° = 6\sqrt{3}$, and $36 + 108 = 144 = 12^2$.`,
      lesson: 'Name the angle first, then label the sides as opposite or adjacent to it before choosing sine or cosine.',
    },
    {
      id: 'check-tan-from-cos',
      title: 'Tangent from a cosine',
      topic: 'Trigonometry',
      stemMd: md`The acute angle $\alpha$ has $\cos\alpha = \frac{8}{17}$. What is $\tan\alpha$?`,
      options: [
        { id: 'A', text: md`$\frac{8}{15}$`, note: md`This is adjacent over opposite, the tangent turned upside down.` },
        { id: 'B', text: md`$\frac{15}{17}$`, note: md`This is $\sin\alpha$, opposite over hypotenuse; the tangent divides the opposite side by the adjacent one.` },
        { id: 'C', text: md`$\frac{15}{8}$`, note: '' },
        { id: 'D', text: md`$\frac{17}{8}$`, note: md`This is hypotenuse over adjacent, $\frac{1}{\cos\alpha}$, not the tangent.` },
      ],
      answer: 'C',
      workingMd: md`Sketch a right triangle with adjacent side 8 and hypotenuse 17. The opposite side is $\sqrt{289 - 64} = \sqrt{225} = 15$. So $\tan\alpha = \frac{15}{8}$. Check: $\sin\alpha = \frac{15}{17}$ and $\frac{\sin\alpha}{\cos\alpha} = \frac{15}{17} \cdot \frac{17}{8} = \frac{15}{8}$.`,
      lesson: 'From one ratio, sketch the triangle, find the third side with Pythagoras, and read the other ratios off it.',
    },
    {
      id: 'check-ramp-horizontal',
      title: 'How far across?',
      topic: 'Trigonometry',
      stemMd: md`A straight path climbs a hill at a constant angle of $30°$ to the horizontal. After walking 80 m along the path, how far has a walker moved horizontally?`,
      options: [
        { id: 'A', text: md`$40$ m`, note: md`This is $80\sin 30°$, the height gained, which is the side opposite the $30°$ angle.` },
        { id: 'B', text: md`$40\sqrt{3}$ m`, note: '' },
        { id: 'C', text: md`$80$ m`, note: md`This ignores the slope: the path is the hypotenuse, so the horizontal distance must be shorter than 80 m.` },
        { id: 'D', text: md`$\frac{160\sqrt{3}}{3}$ m`, note: md`This is $\frac{80}{\cos 30°}$, dividing instead of multiplying; it treats the 80 m as the horizontal leg and returns a hypotenuse.` },
      ],
      answer: 'B',
      workingMd: md`The 80 m path is the hypotenuse; the horizontal distance is adjacent to the $30°$ angle. So it is $80\cos 30° = 80 \cdot \frac{\sqrt{3}}{2} = 40\sqrt{3}$ m, about 69 m. Check: the height is $40$ m, and $40^2 + (40\sqrt{3})^2 = 1600 + 4800 = 6400 = 80^2$.`,
      lesson: 'Along a slope the path is the hypotenuse: horizontal distance uses the cosine, height gained uses the sine.',
    },
  ],
  takeaways: [
    md`$\sin\alpha = \frac{\text{opp}}{\text{hyp}}$, $\cos\alpha = \frac{\text{adj}}{\text{hyp}}$, $\tan\alpha = \frac{\text{opp}}{\text{adj}}$, all measured from the named angle.`,
    md`Exact values come from two triangles: $1, 1, \sqrt{2}$ for $45°$ and $1, \sqrt{3}, 2$ for $30°$ and $60°$.`,
    md`$180° = \pi$ radians.`,
    'From one side and one angle, multiply the hypotenuse by sine or cosine to get a leg; divide a leg by them to get the hypotenuse.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-trigonometry-right-triangles' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
