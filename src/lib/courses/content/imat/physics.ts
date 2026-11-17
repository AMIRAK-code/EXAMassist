import { md, type Lesson } from '../../types';

/**
 * IMAT physics (unit "physics"): mechanics, fluids, thermodynamics, electricity
 * and magnetism, as listed in the syllabus (docs/research/imat.md). No
 * calculator: nothing in the IMAT rules allows one, so every number is chosen for working by hand, with
 * g = 10 m/s^2 throughout.
 */

export const unitsVectorsAndKinematicsLesson: Lesson = {
  slug: 'units-vectors-and-kinematics',
  title: 'Units, vectors and kinematics',
  summary: 'SI units and prefixes, adding and resolving vectors, and the constant-acceleration equations for motion and free fall, all without a calculator.',
  minutes: 20,
  objectives: [
    'Convert between SI prefixes and units, and check a formula or an answer by its units.',
    'Add perpendicular vectors and resolve a vector into components using the sines and cosines of standard angles.',
    'Choose and apply the right constant-acceleration equation, including for free fall and horizontal projectiles.',
  ],
  teachMd: md`
### Working without a calculator

Physics shares its questions with mathematics in one IMAT area, and nothing in the IMAT rules allows a calculator. You therefore need arithmetic you can do by hand: powers of ten, simple fractions and a few square roots. Throughout this course we take $g = 10\ \text{m/s}^2$ for the acceleration of free fall; use it unless a question gives another value. Units are your fastest check: an answer with the wrong units is wrong whatever its number.

### SI base units and prefixes

The SI has seven base units: the metre (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol) and candela (cd). Every other unit is built from them. A newton is $1\ \text{N} = 1\ \text{kg}\cdot\text{m/s}^2$, a joule is a newton-metre, a watt is a joule per second and a pascal is a newton per square metre.

| Prefix | Symbol | Factor |
| --- | --- | --- |
| giga | G | $10^{9}$ |
| mega | M | $10^{6}$ |
| kilo | k | $10^{3}$ |
| centi | c | $10^{-2}$ |
| milli | m | $10^{-3}$ |
| micro | μ | $10^{-6}$ |
| nano | n | $10^{-9}$ |

A prefix is squared or cubed together with its unit: $1\ \text{cm}^2 = (10^{-2}\ \text{m})^2 = 10^{-4}\ \text{m}^2$ and $1\ \text{cm}^3 = 10^{-6}\ \text{m}^3$. A litre is $1\ \text{dm}^3 = 10^{-3}\ \text{m}^3$. For speeds, $1\ \text{m/s} = 3.6\ \text{km/h}$, so divide a speed in km/h by 3.6: $72\ \text{km/h} = 20\ \text{m/s}$.

### Checking with dimensions

Both sides of a correct equation have the same units. If you half-remember that the distance covered from rest at constant acceleration is $\frac{1}{2}at^2$, check it: $\text{m/s}^2 \times \text{s}^2 = \text{m}$, a length. A formula that gave $at$ for a distance fails at once, because $\text{m/s}^2 \times \text{s} = \text{m/s}$, a speed. Units cannot catch a missing $\frac{1}{2}$, but they catch most wrong formulas, and they often rule out answer options before any arithmetic.

### Scalars and vectors

A scalar has only a size: mass, time, energy, temperature. A vector has a size and a direction: displacement, velocity, acceleration, force. Vectors add tip to tail. Two vectors along the same line add or subtract like signed numbers; two perpendicular vectors combine by Pythagoras, so 3 units and 4 units at right angles give a resultant of 5 units.

To resolve a vector of size $F$ at an angle $\theta$ to the horizontal, take its components

$$F_x = F\cos\theta, \qquad F_y = F\sin\theta.$$

These values are all you need without a calculator:

| $\theta$ | $0^\circ$ | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ |
| --- | --- | --- | --- | --- | --- |
| $\sin\theta$ | $0$ | $\frac{1}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{3}}{2}$ | $1$ |
| $\cos\theta$ | $1$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{1}{2}$ | $0$ |

With $\sqrt{2} \approx 1.41$ and $\sqrt{3} \approx 1.73$ you can estimate any result.

### Describing motion

Distance is the length of the path travelled, a scalar; displacement is the straight-line change of position, a vector. Speed is distance divided by time; velocity is displacement divided by time. A runner who completes one 400 m lap in 80 s has an average speed of 5 m/s but an average velocity of zero, because she finishes where she started. Acceleration is the rate of change of velocity, $a = \frac{\Delta v}{\Delta t}$, in $\text{m/s}^2$.

Graphs carry the same information. On a position–time graph the slope is the velocity. On a velocity–time graph the slope is the acceleration, and the area between the line and the time axis is the displacement.

### The constant-acceleration equations

When the acceleration is constant, five quantities describe the motion: the initial velocity $u$, the final velocity $v$, the acceleration $a$, the time $t$ and the displacement $s$. Each equation leaves one of them out:

| Equation | Leaves out |
| --- | --- |
| $v = u + at$ | $s$ |
| $s = ut + \frac{1}{2}at^2$ | $v$ |
| $v^2 = u^2 + 2as$ | $t$ |
| $s = \frac{u + v}{2}\,t$ | $a$ |

Write down the three quantities you know and the one you want; the equation that leaves out the fifth is the one to use. Choose a positive direction first and give every vector quantity its sign.

### Free fall and projectiles

Without air resistance, every body near the Earth's surface falls with the same acceleration $g$, whatever its mass. Dropped from rest, a body falls $\frac{1}{2}gt^2$ in a time $t$: 5 m after one second, 20 m after two, 45 m after three. Thrown straight up at speed $u$, it rises for $\frac{u}{g}$ seconds to a height of $\frac{u^2}{2g}$, then falls back.

A projectile's horizontal and vertical motions are independent. Horizontally no force acts, so the horizontal velocity stays constant; vertically the motion is free fall. The time in the air comes from the vertical motion alone, and the horizontal distance is the horizontal velocity multiplied by that time.
`,
  examples: [
    {
      id: 'example-braking-car',
      title: 'A car braking to a stop',
      problemMd: md`A car travelling at 72 km/h brakes with a constant deceleration and stops in 4.0 s. Find the deceleration and the braking distance.`,
      steps: [
        md`Convert to SI first: $72 \div 3.6 = 20$, so $u = 20\ \text{m/s}$, $v = 0$ and $t = 4.0\ \text{s}$.`,
        md`The equation without $s$ gives the acceleration: $a = \frac{v - u}{t} = \frac{0 - 20}{4} = -5\ \text{m/s}^2$. The minus sign says the acceleration opposes the motion.`,
        md`The equation without $a$ gives the distance: $s = \frac{u + v}{2}\,t = \frac{20 + 0}{2} \times 4 = 40\ \text{m}$.`,
        md`Check by a second route: $v^2 = u^2 + 2as$ gives $0 = 400 - 10s$, so $s = 40\ \text{m}$ again.`,
      ],
      answerMd: md`The deceleration is $5\ \text{m/s}^2$ and the car stops in 40 m. Leaving the speed in km/h gives $\frac{72}{2} \times 4 = 144\ \text{m}$, a distance far too large.`,
    },
    {
      id: 'example-cliff-projectile',
      title: 'A ball thrown horizontally from a cliff',
      problemMd: md`A ball is thrown horizontally at 15 m/s from the top of a cliff 20 m high. Ignoring air resistance and taking $g = 10\ \text{m/s}^2$, find the time it takes to reach the ground, how far from the foot of the cliff it lands, and its speed on landing.`,
      steps: [
        md`Vertical motion first: the ball starts with zero vertical velocity, so $20 = \frac{1}{2} \times 10 \times t^2$, giving $t^2 = 4$ and $t = 2\ \text{s}$. The 15 m/s plays no part in this.`,
        md`Horizontal motion: the velocity stays at 15 m/s, so the ball lands $15 \times 2 = 30\ \text{m}$ from the cliff.`,
        md`On landing the vertical velocity is $gt = 20\ \text{m/s}$. The two components are perpendicular, so the speed is $\sqrt{15^2 + 20^2} = \sqrt{625} = 25\ \text{m/s}$.`,
        md`Check by a second route: $v^2 = u^2 + 2gh = 225 + 400 = 625$, so $v = 25\ \text{m/s}$.`,
      ],
      answerMd: md`The ball falls for 2 s, lands 30 m from the cliff and hits the ground at 25 m/s. Adding the components as numbers, $15 + 20 = 35\ \text{m/s}$, is the tempting wrong answer: perpendicular vectors combine by Pythagoras.`,
    },
    {
      id: 'example-river-crossing',
      title: 'Swimming across a river',
      problemMd: md`A swimmer swims at 4.0 m/s relative to the water, always heading straight across a river 80 m wide. The current flows at 3.0 m/s parallel to the banks. How long does she take to cross, how far downstream does she land, and what is her speed relative to the bank?`,
      steps: [
        md`Her velocity relative to the bank has two perpendicular components: 4.0 m/s across and 3.0 m/s downstream. They act independently.`,
        md`Only the across component brings her to the far bank: $t = \frac{80}{4} = 20\ \text{s}$.`,
        md`In that time the current carries her $3 \times 20 = 60\ \text{m}$ downstream.`,
        md`Her speed relative to the bank is $\sqrt{4^2 + 3^2} = 5\ \text{m/s}$. Check: her path is $\sqrt{80^2 + 60^2} = 100\ \text{m}$ long, and $5 \times 20 = 100\ \text{m}$.`,
      ],
      answerMd: md`She crosses in 20 s, lands 60 m downstream and moves at 5.0 m/s relative to the bank. Dividing the 100 m path by 4.0 m/s gives 25 s, which wrongly mixes her speed relative to the water with a path measured relative to the bank.`,
    },
  ],
  traps: [
    {
      title: 'Leaving speeds in km/h',
      md: md`A speed in km/h put straight into an equation with $g$ or with times in seconds gives nonsense, often a number 3.6 or 12.96 times too large. Convert every quantity to SI before you start: divide km/h by 3.6.`,
    },
    {
      title: 'Converting an area or volume with the plain prefix',
      md: md`Because $1\ \text{cm} = 10^{-2}\ \text{m}$, it is tempting to write $5\ \text{cm}^2 = 5 \times 10^{-2}\ \text{m}^2$. The prefix is squared with the unit: $5\ \text{cm}^2 = 5 \times 10^{-4}\ \text{m}^2$, and $1\ \text{cm}^3 = 10^{-6}\ \text{m}^3$.`,
    },
    {
      title: 'Treating distance as displacement',
      md: md`After a round trip the displacement is zero, so the average velocity is zero even though the average speed is not. When a question says "velocity" or "displacement", ask where the body ended up relative to where it started.`,
    },
    {
      title: 'Letting the horizontal motion change the fall',
      md: md`A ball thrown horizontally does not stay up longer than one dropped from the same height, and a heavier ball does not fall faster. The fall time depends only on the height and on $g$; the horizontal speed only sets how far the ball travels in that time.`,
    },
  ],
  check: [
    {
      id: 'check-train-distance',
      title: 'Distance from rest',
      topic: 'Kinematics',
      stemMd: md`A train starts from rest and accelerates uniformly to 30 m/s in 10 s. How far does it travel in that time?`,
      options: [
        { id: 'A', text: md`3 m`, note: md`This is the acceleration, $\frac{30}{10} = 3\ \text{m/s}^2$, given as a distance.` },
        { id: 'B', text: md`150 m`, note: '' },
        { id: 'C', text: md`300 m`, note: md`Multiplies the final speed by the time, as if the train ran at 30 m/s throughout; its average speed is only 15 m/s.` },
        { id: 'D', text: md`450 m`, note: md`Uses $v^2 = 2as$ but leaves out the acceleration: $\frac{30^2}{2} = 450$. Dividing by $a = 3\ \text{m/s}^2$ as well gives the distance.` },
        { id: 'E', text: md`1500 m`, note: md`Puts 30 into $\frac{1}{2}at^2$ as the acceleration; 30 m/s is the final speed, and the acceleration is $3\ \text{m/s}^2$.` },
      ],
      answer: 'B',
      workingMd: md`The acceleration is $a = \frac{30 - 0}{10} = 3\ \text{m/s}^2$, so $s = \frac{1}{2}at^2 = \frac{1}{2} \times 3 \times 100 = 150\ \text{m}$. Second route: the average speed is $\frac{0 + 30}{2} = 15\ \text{m/s}$, and $15 \times 10 = 150\ \text{m}$.`,
      lesson: 'Under constant acceleration from rest, the average speed is half the final speed.',
    },
    {
      id: 'check-bridge-drop',
      title: 'A stone dropped from a bridge',
      topic: 'Kinematics',
      stemMd: md`A stone is dropped from rest from a bridge and hits the water 3.0 s later. Ignoring air resistance and taking $g = 10\ \text{m/s}^2$, how high is the bridge above the water?`,
      options: [
        { id: 'A', text: md`15 m`, note: md`Uses $\frac{1}{2}gt$ and forgets to square the time.` },
        { id: 'B', text: md`30 m`, note: md`This is the stone's speed at impact, $gt = 30\ \text{m/s}$, not the height.` },
        { id: 'C', text: md`44.1 m`, note: md`Uses $g = 9.8\ \text{m/s}^2$; the question fixes $g = 10\ \text{m/s}^2$, and that is the value to use.` },
        { id: 'D', text: md`45 m`, note: '' },
        { id: 'E', text: md`90 m`, note: md`Uses $gt^2$ and drops the factor $\frac{1}{2}$.` },
      ],
      answer: 'D',
      workingMd: md`From rest, $h = \frac{1}{2}gt^2 = \frac{1}{2} \times 10 \times 3^2 = 45\ \text{m}$. Second route: the final speed is $gt = 30\ \text{m/s}$, the average speed is 15 m/s, and $15 \times 3 = 45\ \text{m}$.`,
      lesson: 'A body dropped from rest falls 5 m, 20 m and 45 m after 1, 2 and 3 seconds: the distance grows with the square of the time.',
    },
    {
      id: 'check-two-balls',
      title: 'Rolled off or dropped',
      topic: 'Kinematics',
      stemMd: md`Ball P rolls off the edge of a horizontal table top at 4 m/s at the same instant as ball Q is dropped from rest from the same height. Ignoring air resistance, which statement is correct?`,
      options: [
        { id: 'A', text: md`Q lands first, because its path is shorter.`, note: md`The length of the path does not matter: both balls start with zero vertical velocity and have the same vertical acceleration, so they fall for the same time.` },
        { id: 'B', text: md`P lands first, because it is moving faster.`, note: md`Horizontal speed has no effect on the vertical motion; the fall time depends only on the height and on $g$.` },
        { id: 'C', text: md`They land at the same time.`, note: '' },
        { id: 'D', text: md`They land at the same time only if they have the same mass.`, note: md`In free fall the acceleration is $g$ whatever the mass, so mass does not affect the fall time.` },
        { id: 'E', text: md`They land at the same time and with the same speed.`, note: md`The times are equal, but P keeps its 4 m/s horizontal velocity as well, so it hits the floor faster than Q.` },
      ],
      answer: 'C',
      workingMd: md`Vertically both balls start with zero velocity and accelerate at $g$ through the same height $h$, so $h = \frac{1}{2}gt^2$ gives the same $t$ for both. P also moves sideways at 4 m/s, so its landing speed is $\sqrt{4^2 + v_y^2}$, larger than Q's $v_y$.`,
      lesson: 'Horizontal and vertical motion are independent: the fall time is set by the vertical motion alone.',
    },
  ],
  takeaways: [
    'Convert to SI before you calculate: divide km/h by 3.6, and square or cube a prefix along with its unit.',
    md`Perpendicular vectors combine by Pythagoras; a vector $F$ at angle $\theta$ has components $F\cos\theta$ and $F\sin\theta$.`,
    'Pick the constant-acceleration equation that leaves out the quantity you neither know nor want.',
    md`In free fall every body accelerates at $g$; a projectile's horizontal velocity stays constant.`,
  ],
  flashcards: [
    { front: 'The seven SI base units', back: 'Metre (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol) and candela (cd). All other units, such as the newton and the joule, are built from them.' },
    { front: 'Converting km/h to m/s', back: 'Divide by 3.6, because 1 m/s = 3.6 km/h. For example, 72 km/h = 20 m/s.' },
    { front: 'Converting an area or a volume between cm and m', back: md`Square or cube the prefix with the unit: $1\ \text{cm}^2 = 10^{-4}\ \text{m}^2$ and $1\ \text{cm}^3 = 10^{-6}\ \text{m}^3$.` },
    { front: 'The four constant-acceleration equations', back: md`$v = u + at$, $s = ut + \frac{1}{2}at^2$, $v^2 = u^2 + 2as$ and $s = \frac{u + v}{2}\,t$. Each leaves out one of $u$, $v$, $a$, $t$ and $s$.` },
    { front: 'What a velocity–time graph shows', back: 'Its slope is the acceleration, and the area between the line and the time axis is the displacement.' },
    { front: "A projectile's two motions", back: md`Horizontally, constant velocity, because no force acts; vertically, free fall with acceleration $g$. The time in the air comes from the vertical motion alone.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-mechanics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const forcesAndNewtonsLawsLesson: Lesson = {
  slug: 'forces-and-newtons-laws',
  title: "Forces and Newton's laws",
  summary: "Newton's three laws, free-body diagrams, friction, slopes, lifts and circular motion: how to turn any force problem into F = ma.",
  minutes: 22,
  objectives: [
    "State Newton's three laws and identify third-law pairs correctly.",
    'Draw a free-body diagram and apply the net force equation to blocks, slopes, pulleys and lifts.',
    'Explain circular motion with a net inward force and use the condition for balanced moments.',
  ],
  teachMd: md`
### Force and the newton

A force is a push or a pull: a vector, measured in newtons. One newton gives a mass of 1 kg an acceleration of $1\ \text{m/s}^2$. What decides how a body moves is the **net force**, the vector sum of all the forces acting on that one body. Start every problem with a free-body diagram: one body, every force on it drawn as an arrow from it, and nothing else.

### Newton's three laws

1. **First law (inertia).** If the net force on a body is zero, its velocity does not change: it stays at rest, or keeps moving in a straight line at constant speed. Constant velocity needs no net force. A parachutist falling at a steady speed has air resistance exactly equal to weight.
2. **Second law.** $F_{\text{net}} = ma$. The acceleration points in the direction of the net force, and the mass measures how hard the body is to accelerate.
3. **Third law.** If body A exerts a force on body B, then B exerts on A a force of the same size, in the opposite direction and of the same kind. The two forces act on **different** bodies, so they never cancel each other.

### Forces you will meet

- **Weight**, $W = mg$: the Earth's gravitational pull, directed towards the centre of the Earth. A 60 kg person weighs 600 N. On the Moon, where the gravitational field is about a sixth as strong, the same person weighs about 100 N but still has a mass of 60 kg.
- **Normal force**, from a surface and perpendicular to it. It is only as large as it needs to be to stop the body moving into the surface. It equals $mg$ only for a body on a horizontal surface with no other vertical forces and no vertical acceleration.
- **Tension**, in a string or rope, pulling along it. A light string over a frictionless pulley has the same tension all along.
- **Friction**, parallel to the surface, opposing sliding. Static friction adjusts itself up to a maximum of $\mu_s N$; once the body slides, kinetic friction is $\mu_k N$, usually a little smaller. $N$ is the normal force and $\mu$ the coefficient of friction.
- **Gravitation** between any two masses: $F = \frac{Gm_1m_2}{r^2}$, with $G \approx 6.7 \times 10^{-11}\ \text{N m}^2/\text{kg}^2$. Doubling the distance between centres reduces the force to a quarter.

### The inclined plane

On a slope at angle $\theta$, resolve the weight along the slope and perpendicular to it:

$$W_{\parallel} = mg\sin\theta, \qquad W_{\perp} = mg\cos\theta.$$

Perpendicular to the slope nothing accelerates, so the normal force is $N = mg\cos\theta$. Along a frictionless slope the net force is $mg\sin\theta$, so $a = g\sin\theta$ whatever the mass: $5\ \text{m/s}^2$ on a $30^\circ$ slope. With friction, subtract $\mu_k mg\cos\theta$ from the component down the slope.

### Apparent weight in a lift

Bathroom scales read the normal force they exert on you. For a person of mass $m$ in a lift with acceleration $a$, taken as positive upwards, Newton's second law gives $N - mg = ma$, so

$$N = m(g + a).$$

When the lift accelerates upwards, or slows down while moving down, the scales read more than $mg$. When it accelerates downwards, or slows down while moving up, they read less. In free fall ($a = -g$) they read zero, which is what "weightless" means. The direction of the acceleration decides, not the direction of motion.

### Circular motion

A body moving in a circle of radius $r$ at constant speed $v$ is accelerating, because the direction of its velocity keeps changing. The acceleration points towards the centre and has size $a = \frac{v^2}{r}$. It needs a net inward force

$$F = \frac{mv^2}{r},$$

supplied by real forces: tension in a string, friction on a car's tyres, gravity on a satellite. "Centripetal" names the role these forces play; it is not an extra force to add to the diagram.

### Turning effects

The moment (torque) of a force about a pivot is the force multiplied by the perpendicular distance from the pivot to the force's line of action, in N m. A rigid body in equilibrium has zero net force **and** zero net moment. On a balanced seesaw, $F_1 d_1 = F_2 d_2$: a 300 N child 2 m from the pivot balances a 600 N adult 1 m from it.

### A method for any dynamics problem

1. Choose the body, or a group of bodies that move together.
2. Draw every force acting on it.
3. Choose a positive direction, along the acceleration if you know it.
4. Write $F_{\text{net}} = ma$ along that direction, and use the perpendicular direction (where the acceleration is zero) to find unknown forces such as the normal force.
5. Check the units, and ask whether the answer is sensible: a tension between two weights, an acceleration below $g$ for a body pulled down only by gravity.
`,
  examples: [
    {
      id: 'example-friction-floor',
      title: 'Pulling a crate across a rough floor',
      problemMd: md`A 5.0 kg crate on a level floor is pulled horizontally with a force of 30 N. The coefficient of kinetic friction is 0.40. Taking $g = 10\ \text{m/s}^2$, find the crate's acceleration and its speed 3.0 s after starting from rest.`,
      steps: [
        md`Vertically there is no acceleration, so the normal force balances the weight: $N = mg = 5 \times 10 = 50\ \text{N}$.`,
        md`Kinetic friction opposes the motion: $f = \mu_k N = 0.40 \times 50 = 20\ \text{N}$.`,
        md`The net horizontal force is $30 - 20 = 10\ \text{N}$, so $a = \frac{F_{\text{net}}}{m} = \frac{10}{5} = 2.0\ \text{m/s}^2$.`,
        md`From rest, $v = u + at = 0 + 2 \times 3 = 6.0\ \text{m/s}$.`,
      ],
      answerMd: md`The crate accelerates at $2.0\ \text{m/s}^2$ and reaches 6.0 m/s after 3.0 s. Forgetting friction gives $\frac{30}{5} = 6\ \text{m/s}^2$, the tempting wrong answer.`,
    },
    {
      id: 'example-lift-scale',
      title: 'Bathroom scales in a lift',
      problemMd: md`A 60 kg person stands on bathroom scales in a lift. Taking $g = 10\ \text{m/s}^2$, what force do the scales exert on the person when the lift (a) accelerates upwards at $2.0\ \text{m/s}^2$, (b) moves upwards at constant speed, (c) moves upwards while slowing down at $2.0\ \text{m/s}^2$?`,
      steps: [
        md`Two forces act on the person: the weight, $60 \times 10 = 600\ \text{N}$ down, and the normal force $N$ up. Taking up as positive, $N - 600 = 60a$.`,
        md`(a) $a = +2$: $N = 600 + 120 = 720\ \text{N}$.`,
        md`(b) $a = 0$: $N = 600\ \text{N}$. Constant velocity means zero net force (first law).`,
        md`(c) Slowing down while moving up means the acceleration points down: $a = -2$, so $N = 600 - 120 = 480\ \text{N}$.`,
      ],
      answerMd: md`The scales push with 720 N, 600 N and 480 N. In (c), taking the acceleration as upwards because the lift is moving upwards gives 720 N, the tempting wrong answer.`,
    },
    {
      id: 'example-pulley-masses',
      title: 'Two masses over a pulley',
      problemMd: md`Masses of 3.0 kg and 2.0 kg hang at the two ends of a light string passing over a frictionless pulley. Taking $g = 10\ \text{m/s}^2$, find their acceleration and the tension in the string.`,
      steps: [
        md`Treat the two masses as one system moving together. The tension is internal and drops out; the driving force is the difference of the weights, $30 - 20 = 10\ \text{N}$, acting on a total mass of 5.0 kg. So $a = \frac{10}{5} = 2.0\ \text{m/s}^2$.`,
        md`The 2.0 kg mass accelerates upwards: $T - 20 = 2 \times 2$, so $T = 24\ \text{N}$.`,
        md`Check with the 3.0 kg mass, which accelerates downwards: $30 - T = 3 \times 2$, so $T = 24\ \text{N}$ again.`,
      ],
      answerMd: md`The masses accelerate at $2.0\ \text{m/s}^2$ and the tension is 24 N. The tension is neither 20 N nor 30 N: it lies between the two weights, as it must if one mass rises and the other falls.`,
    },
  ],
  traps: [
    {
      title: 'Pairing the weight with the normal force',
      md: md`For a book on a table, the weight and the normal force are equal and opposite, but they act on the same body and are different kinds of force: they balance because of the first law. The third-law partner of the Earth's pull on the book is the book's pull on the Earth.`,
    },
    {
      title: 'Thinking motion needs a net force',
      md: md`A body moving at constant velocity has zero net force on it. When a question says a body "moves at constant speed in a straight line", write $F_{\text{net}} = 0$ at once: the driving force equals the resistive forces.`,
    },
    {
      title: 'Assuming the normal force is always mg',
      md: md`On a slope $N = mg\cos\theta$; in an accelerating lift $N = m(g + a)$; and a push at an angle adds or removes a vertical component. Find $N$ from the forces perpendicular to the surface every time, especially before you compute friction.`,
    },
    {
      title: 'Adding a centripetal force to the diagram',
      md: md`The centripetal force is the net inward force of the real forces, not one more force. Draw only tension, weight, friction and normal forces, then set their inward resultant equal to $\frac{mv^2}{r}$.`,
    },
  ],
  check: [
    {
      id: 'check-ramp-acceleration',
      title: 'Down a smooth ramp',
      topic: 'Dynamics',
      stemMd: md`A 2.0 kg box slides down a frictionless ramp inclined at $30^\circ$ to the horizontal. Taking $g = 10\ \text{m/s}^2$, what is its acceleration along the ramp?`,
      options: [
        { id: 'A', text: md`$2.5\ \text{m/s}^2$`, note: md`Divides $g\sin 30^\circ$ by the mass as well; the mass has already cancelled out of $a = \frac{mg\sin\theta}{m}$.` },
        { id: 'B', text: md`$5\ \text{m/s}^2$`, note: '' },
        { id: 'C', text: md`$5\sqrt{3} \approx 8.7\ \text{m/s}^2$`, note: md`Uses $g\cos 30^\circ$, the component perpendicular to the ramp, which the normal force balances.` },
        { id: 'D', text: md`$10\ \text{m/s}^2$`, note: md`Uses the full free-fall acceleration and ignores the slope.` },
        { id: 'E', text: md`$20\ \text{m/s}^2$`, note: md`This is the weight, $mg = 20\ \text{N}$, a force, read as an acceleration.` },
      ],
      answer: 'B',
      workingMd: md`The component of the weight along the ramp is $mg\sin 30^\circ = 20 \times \frac{1}{2} = 10\ \text{N}$, and nothing opposes it, so $a = \frac{10}{2} = 5\ \text{m/s}^2$. Directly: $a = g\sin\theta = 10 \times \frac{1}{2} = 5\ \text{m/s}^2$.`,
      lesson: md`On a frictionless slope the acceleration is $g\sin\theta$, whatever the mass.`,
    },
    {
      id: 'check-third-law-pair',
      title: 'Finding the third-law partner',
      topic: 'Dynamics',
      stemMd: md`A book rests on a horizontal table. Which force forms a Newton's third-law pair with the Earth's gravitational pull on the book?`,
      options: [
        { id: 'A', text: md`The upward normal force of the table on the book.`, note: md`It is equal and opposite to the weight, but it acts on the same body and is a contact force; that balance comes from the first law, not the third.` },
        { id: 'B', text: md`The downward push of the book on the table.`, note: md`This is the partner of the table's normal force on the book, a contact force, not of the gravitational pull.` },
        { id: 'C', text: md`The gravitational pull of the book on the Earth.`, note: '' },
        { id: 'D', text: md`The friction force of the table on the book.`, note: md`No friction acts on a book resting on a level table with no sideways push, and friction is not a gravitational force anyway.` },
        { id: 'E', text: md`There is none, because the book is at rest.`, note: md`Third-law pairs exist whether or not anything moves: every force is one half of a pair.` },
      ],
      answer: 'C',
      workingMd: md`A third-law pair consists of two forces of the same kind, equal in size and opposite in direction, each acting on the other body of one interaction. Here the interaction is gravitational, between the Earth and the book, so the partner is the book's gravitational pull on the Earth, which acts on the Earth.`,
      lesson: 'The two forces of a third-law pair act on different bodies and are of the same kind.',
    },
    {
      id: 'check-lift-slowing',
      title: 'Scales in a lift slowing down',
      topic: 'Dynamics',
      stemMd: md`A 50 kg person stands on scales in a lift that is moving downwards and slowing down at $2.0\ \text{m/s}^2$. Taking $g = 10\ \text{m/s}^2$, what force do the scales exert on the person?`,
      options: [
        { id: 'A', text: md`50 N`, note: md`Takes the mass in kilograms as a force in newtons; the weight is $mg = 500\ \text{N}$.` },
        { id: 'B', text: md`100 N`, note: md`This is only $ma$, the net force; the scales must also support the weight.` },
        { id: 'C', text: md`400 N`, note: md`Takes the acceleration as downwards because the lift moves downwards; slowing a downward motion needs an upward acceleration.` },
        { id: 'D', text: md`500 N`, note: md`Ignores the acceleration; the scales read the weight only when the velocity is constant.` },
        { id: 'E', text: md`600 N`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Slowing down while moving down means the acceleration points upwards. Taking up as positive, $N - mg = ma$, so $N = m(g + a) = 50 \times (10 + 2) = 600\ \text{N}$.`,
      lesson: 'The direction of the acceleration, not the direction of motion, decides whether scales read more or less than the weight.',
    },
  ],
  takeaways: [
    md`Newton's second law uses the net force: $F_{\text{net}} = ma$, with the acceleration along the net force.`,
    'Zero net force means constant velocity, not necessarily rest.',
    'The forces of a third-law pair act on different bodies and are of the same kind.',
    md`On a slope the weight splits into $mg\sin\theta$ along it and $mg\cos\theta$ into it.`,
    md`Circular motion needs a net inward force of $\frac{mv^2}{r}$, supplied by real forces.`,
  ],
  flashcards: [
    { front: "Newton's first law", back: 'With zero net force, a body stays at rest or keeps moving in a straight line at constant speed.' },
    { front: "Newton's second law", back: md`$F_{\text{net}} = ma$: the acceleration is in the direction of the net force and inversely proportional to the mass.` },
    { front: "Newton's third law", back: 'If A exerts a force on B, B exerts an equal and opposite force of the same kind on A. The two forces act on different bodies.' },
    { front: 'Static and kinetic friction', back: md`Static friction adjusts itself up to $\mu_s N$; sliding friction is $\mu_k N$, where $N$ is the normal force.` },
    { front: 'Acceleration down a frictionless slope', back: md`$a = g\sin\theta$, independent of the mass; the normal force is $mg\cos\theta$.` },
    { front: 'Scale reading in an accelerating lift', back: md`$N = m(g + a)$ with $a$ positive upwards: more than $mg$ when the acceleration is upwards, less when it is downwards, zero in free fall.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-mechanics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const workEnergyAndMomentumLesson: Lesson = {
  slug: 'work-energy-and-momentum',
  title: 'Work, energy and momentum',
  summary: 'Work, kinetic and potential energy, power and momentum: when energy is conserved, when momentum is, and how to use each to solve problems fast.',
  minutes: 22,
  objectives: [
    'Calculate work, kinetic and potential energy and power, and use the work–energy theorem.',
    'Use conservation of mechanical energy, and account for the energy lost to friction.',
    'Apply impulse and conservation of momentum to collisions and explosions, and tell elastic from inelastic collisions.',
  ],
  teachMd: md`
### Work: force times displacement

A force does work when its point of application moves in the direction of the force:

$$W = Fs\cos\theta$$

where $\theta$ is the angle between the force and the displacement. Work is a scalar, measured in joules ($1\ \text{J} = 1\ \text{N m}$). Three cases matter:

- force along the motion ($\theta = 0^\circ$): $W = Fs$, positive;
- force against the motion ($\theta = 180^\circ$), like friction: $W = -Fs$, negative;
- force perpendicular to the motion ($\theta = 90^\circ$): $W = 0$. The normal force on a car on a level road, and the tension in a string whirling a ball round a circle, do no work.

On a graph of force against displacement, the work is the area under the line.

### Kinetic and potential energy

Kinetic energy is $E_k = \frac{1}{2}mv^2$. It grows with the square of the speed: double the speed and the kinetic energy is four times as large.

Gravitational potential energy near the Earth's surface is $E_p = mgh$, measured from any level you choose; only its changes matter.

A spring obeys Hooke's law, $F = kx$, where $x$ is the extension and $k$ the spring constant in N/m. Stretched by $x$, it stores elastic potential energy $\frac{1}{2}kx^2$, the area under its force–extension line.

### The work–energy theorem and conservation of energy

The net work done on a body equals its change in kinetic energy:

$$W_{\text{net}} = \Delta E_k.$$

When only gravity (and springs) do work, mechanical energy is conserved: $E_k + E_p$ stays constant. A body falling from rest through a height $h$ reaches $v = \sqrt{2gh}$, the same result as $v^2 = 2gh$ from kinematics, and the same whatever path it follows down a frictionless slope. With friction, mechanical energy is not conserved: the missing energy has become internal energy, felt as heat. Total energy is always conserved; it only changes form.

### Power and efficiency

Power is the rate of doing work or of transferring energy: $P = \frac{W}{t}$, in watts ($1\ \text{W} = 1\ \text{J/s}$). A force moving its point of application at constant velocity $v$ along its own direction delivers $P = Fv$. A kilowatt-hour is an energy: $1000\ \text{W} \times 3600\ \text{s} = 3.6 \times 10^6\ \text{J}$.

Efficiency is useful energy output divided by total energy input. For any real machine it is less than 1, or 100%.

### Momentum and impulse

Momentum is $p = mv$, a vector measured in kg m/s. In its general form, Newton's second law says that the net force equals the rate of change of momentum, so

$$F\,\Delta t = \Delta p.$$

The product $F\,\Delta t$ is the impulse. For a given change of momentum, a longer stopping time means a smaller force: airbags, crumple zones and bending your knees when you land all work this way.

### Conservation of momentum

If no external force acts on a system, or the external forces cancel, its total momentum stays constant. In a collision or an explosion the internal forces are third-law pairs: equal and opposite, acting for the same time. The momentum one body gains, the other loses. Momentum is a vector, so give velocities in one direction a plus sign and in the other a minus sign.

### Elastic and inelastic collisions

Momentum is conserved in every collision; kinetic energy is not.

| Collision | Momentum | Kinetic energy |
| --- | --- | --- |
| Elastic | conserved | conserved |
| Inelastic | conserved | partly turned into heat, sound and deformation |
| Perfectly inelastic (the bodies stick) | conserved | the largest possible loss |

In an explosion from rest the total momentum stays zero, while kinetic energy appears from chemical or elastic energy.

### Choosing the tool

If a question gives forces and distances but no times, use energy. If it gives forces and times, or describes a collision, use momentum. When bodies stick together, momentum gives the common speed; then compare the kinetic energies before and after to find what was lost.
`,
  examples: [
    {
      id: 'example-slide-energy',
      title: 'Energy on a playground slide',
      problemMd: md`A 30 kg child slides from rest down a slide whose top is 5.0 m above its bottom. Taking $g = 10\ \text{m/s}^2$: (a) how fast would the child be moving at the bottom without friction? (b) In fact the child reaches the bottom at 8.0 m/s. How much energy became heat?`,
      steps: [
        md`Without friction, $mgh = \frac{1}{2}mv^2$, so $v^2 = 2gh = 2 \times 10 \times 5 = 100$ and $v = 10\ \text{m/s}$. The mass cancels, and the shape of the slide does not matter.`,
        md`Potential energy at the top: $E_p = mgh = 30 \times 10 \times 5 = 1500\ \text{J}$.`,
        md`Kinetic energy actually reached: $E_k = \frac{1}{2} \times 30 \times 8^2 = 15 \times 64 = 960\ \text{J}$.`,
        md`The difference was done as work against friction: $1500 - 960 = 540\ \text{J}$.`,
      ],
      answerMd: md`Without friction the child would reach 10 m/s; in fact 540 J became heat. Dropping the 2 from $v^2 = 2gh$ gives $\sqrt{50} \approx 7.1\ \text{m/s}$, which is slower than the real speed with friction: a sure sign of a slip.`,
    },
    {
      id: 'example-trolleys-stick',
      title: 'Two trolleys that couple together',
      problemMd: md`A 2.0 kg trolley moving at 6.0 m/s runs into a stationary 1.0 kg trolley, and they couple together. Find their speed just afterwards and the kinetic energy lost.`,
      steps: [
        md`Momentum before: $2 \times 6 + 1 \times 0 = 12\ \text{kg m/s}$.`,
        md`Momentum after is the same: $(2 + 1)v = 12$, so $v = 4.0\ \text{m/s}$.`,
        md`Kinetic energy before: $\frac{1}{2} \times 2 \times 6^2 = 36\ \text{J}$. After: $\frac{1}{2} \times 3 \times 4^2 = 24\ \text{J}$.`,
        md`Loss: $36 - 24 = 12\ \text{J}$, a third of the original, turned into heat, sound and deformation.`,
      ],
      answerMd: md`The coupled trolleys move at 4.0 m/s, and 12 J of kinetic energy is lost. Using conservation of kinetic energy instead, $\frac{1}{2} \times 3 \times v^2 = 36$, gives $v = \sqrt{24} \approx 4.9\ \text{m/s}$: wrong, because a collision in which the bodies stick is inelastic.`,
    },
    {
      id: 'example-motor-power',
      title: 'The power of a hoist',
      problemMd: md`An electric hoist lifts a 50 kg load through 12 m at constant speed in 10 s. Taking $g = 10\ \text{m/s}^2$, find its useful power output. If it draws 800 W of electrical power, what is its efficiency?`,
      steps: [
        md`At constant speed the lifting force equals the weight: $F = mg = 500\ \text{N}$.`,
        md`Work done on the load: $W = Fs = 500 \times 12 = 6000\ \text{J}$, so $P = \frac{6000}{10} = 600\ \text{W}$.`,
        md`Check by a second route: the speed is $\frac{12}{10} = 1.2\ \text{m/s}$, and $P = Fv = 500 \times 1.2 = 600\ \text{W}$.`,
        md`Efficiency: $\frac{600}{800} = 0.75$, or 75%.`,
      ],
      answerMd: md`The useful power is 600 W and the efficiency is 75%. Using the mass instead of the weight gives 60 W, ten times too small.`,
    },
  ],
  traps: [
    {
      title: 'Treating kinetic energy as proportional to speed',
      md: md`Kinetic energy goes with $v^2$. Doubling a car's speed quadruples its kinetic energy, so at the same braking force it needs four times the stopping distance, not twice.`,
    },
    {
      title: 'Conserving kinetic energy in a collision where bodies stick',
      md: md`Only momentum is guaranteed to be conserved in a collision. When bodies stick together, the collision is perfectly inelastic: find the speed from momentum, never from kinetic energy.`,
    },
    {
      title: 'Ignoring the signs of momentum',
      md: md`A 2 kg ball at +3 m/s and a 1 kg ball at −6 m/s have a total momentum of $6 - 6 = 0$, not 12 kg m/s. Choose a positive direction and give every velocity its sign before you add.`,
    },
    {
      title: 'Counting work for a perpendicular force',
      md: md`Carrying a bag across a level floor at constant velocity, your upward force on the bag does no work on it, because the bag moves at right angles to that force. Work needs a component of the force along the displacement.`,
    },
  ],
  check: [
    {
      id: 'check-dropped-ball-speed',
      title: 'Speed after a fall',
      topic: 'Energy',
      stemMd: md`A 0.50 kg ball is dropped from rest from a height of 20 m. Ignoring air resistance and taking $g = 10\ \text{m/s}^2$, with what speed does it reach the ground?`,
      options: [
        { id: 'A', text: md`$10\sqrt{2} \approx 14\ \text{m/s}$`, note: md`Comes from $v^2 = gh$, which drops the factor 2 in $v^2 = 2gh$.` },
        { id: 'B', text: md`$20\ \text{m/s}$`, note: '' },
        { id: 'C', text: md`$20\sqrt{2} \approx 28\ \text{m/s}$`, note: md`Keeps the mass on one side only, writing $\frac{1}{2} \times 0.5 \times v^2 = gh$; the mass multiplies both energies and cancels.` },
        { id: 'D', text: md`$200\ \text{m/s}$`, note: md`Writes $v = gh$, whose units are $\text{m}^2/\text{s}^2$, not those of a speed.` },
        { id: 'E', text: md`$400\ \text{m/s}$`, note: md`This is $v^2 = 2gh = 400\ \text{m}^2/\text{s}^2$, with the square root forgotten.` },
      ],
      answer: 'B',
      workingMd: md`Energy is conserved: $mgh = \frac{1}{2}mv^2$, so $v = \sqrt{2gh} = \sqrt{400} = 20\ \text{m/s}$. Second route: the fall takes $t = \sqrt{\frac{2h}{g}} = 2\ \text{s}$, and $v = gt = 20\ \text{m/s}$.`,
      lesson: 'In energy conservation for a fall, the mass cancels: the speed depends only on the height.',
    },
    {
      id: 'check-skaters-push',
      title: 'Two skaters push apart',
      topic: 'Momentum',
      stemMd: md`Two skaters, of 60 kg and 40 kg, stand at rest on smooth ice. They push each other apart, and the 40 kg skater moves off at 3.0 m/s. What is the velocity of the 60 kg skater?`,
      options: [
        { id: 'A', text: md`0 m/s`, note: md`Assumes the skater who pushes stays still; the push acts on both, and the total momentum must stay zero.` },
        { id: 'B', text: md`2.0 m/s in the same direction as the 40 kg skater`, note: md`The size is right but not the direction: equal and opposite momenta need opposite velocities.` },
        { id: 'C', text: md`2.0 m/s in the opposite direction to the 40 kg skater`, note: '' },
        { id: 'D', text: md`3.0 m/s in the opposite direction to the 40 kg skater`, note: md`Makes the speeds equal instead of the momenta; the forces are equal, but the heavier skater gains less speed.` },
        { id: 'E', text: md`4.5 m/s in the opposite direction to the 40 kg skater`, note: md`Inverts the mass ratio, $3 \times \frac{60}{40}$; the heavier skater must move more slowly, not faster.` },
      ],
      answer: 'C',
      workingMd: md`The total momentum is zero before and after. The 40 kg skater has $40 \times 3 = 120\ \text{kg m/s}$, so the 60 kg skater has 120 kg m/s the other way: $v = \frac{120}{60} = 2.0\ \text{m/s}$, opposite. Second route: the two forces are equal and act for the same time, so the accelerations are in the ratio $40 : 60$, and the speeds in the ratio $2 : 3$.`,
      lesson: 'Parts of a system that starts at rest move off with equal and opposite momenta, so each speed is inversely proportional to its mass.',
    },
    {
      id: 'check-braking-distance',
      title: 'Braking from twice the speed',
      topic: 'Energy',
      stemMd: md`A car braking with a constant force stops in 40 m from a speed of 20 m/s. With the same braking force, what distance does it need to stop from 40 m/s?`,
      options: [
        { id: 'A', text: md`40 m`, note: md`Assumes the distance depends only on the force; the work the brakes must do equals the kinetic energy, which depends on the speed.` },
        { id: 'B', text: md`80 m`, note: md`Scales the distance in proportion to the speed; kinetic energy goes with the square of the speed.` },
        { id: 'C', text: md`160 m`, note: '' },
        { id: 'D', text: md`320 m`, note: md`Scales the distance with the cube of the speed, a factor of 8; the work–energy theorem gives the square.` },
        { id: 'E', text: md`640 m`, note: md`Uses a factor of 16, squaring the correct factor of 4 a second time.` },
      ],
      answer: 'C',
      workingMd: md`The brakes do work $Fd = \frac{1}{2}mv^2$, so with $F$ fixed, $d$ is proportional to $v^2$. Doubling the speed multiplies the distance by 4: $4 \times 40 = 160\ \text{m}$. Second route: the deceleration is fixed, and $v^2 = 2ad$ gives the same proportionality.`,
      lesson: 'At a fixed braking force, the stopping distance grows with the square of the speed.',
    },
  ],
  takeaways: [
    md`Work is $Fs\cos\theta$, and it is zero for a force perpendicular to the motion.`,
    'The net work done on a body equals its change in kinetic energy.',
    'Without friction, kinetic plus potential energy stays constant; with friction, the loss becomes heat.',
    'Momentum is conserved in every collision; kinetic energy only in elastic ones.',
    md`Power is $\frac{W}{t}$, or $Fv$ at constant velocity.`,
  ],
  flashcards: [
    { front: 'Work done by a force', back: md`$W = Fs\cos\theta$, in joules; it is zero when the force is perpendicular to the displacement.` },
    { front: 'Kinetic and gravitational potential energy', back: md`$E_k = \frac{1}{2}mv^2$ and $E_p = mgh$. Doubling the speed quadruples the kinetic energy.` },
    { front: 'Speed after falling through a height h', back: md`$v = \sqrt{2gh}$, whatever the mass and, without friction, whatever the path.` },
    { front: 'Power', back: md`Work or energy per unit time, $P = \frac{W}{t}$, in watts; at constant velocity, $P = Fv$.` },
    { front: 'Impulse', back: md`$F\,\Delta t = \Delta p$: the same change of momentum over a longer time needs a smaller force.` },
    { front: 'Elastic versus inelastic collisions', back: 'Momentum is conserved in both. Kinetic energy is conserved only in an elastic collision, and the loss is largest when the bodies stick together.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-mechanics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const fluidsPressureAndBuoyancyLesson: Lesson = {
  slug: 'fluids-pressure-and-buoyancy',
  title: 'Fluids, pressure and buoyancy',
  summary: "Density, pressure with depth, Pascal's and Archimedes' principles, and flow in pipes: the fluid physics behind floating, hydraulics and drips.",
  minutes: 20,
  objectives: [
    'Calculate pressure from force and area, and the pressure at a depth in a liquid, telling gauge from absolute pressure.',
    "Apply Pascal's principle to a hydraulic press and Archimedes' principle to floating and submerged bodies.",
    'Use the continuity equation and the qualitative result of Bernoulli for fluids flowing through pipes.',
  ],
  teachMd: md`
### Density

Density is mass per unit volume, $\rho = \frac{m}{V}$, in $\text{kg/m}^3$. Water has $\rho \approx 1000\ \text{kg/m}^3$, which is $1\ \text{g/cm}^3$, or 1 kg per litre. Keep the volume conversions at hand: $1\ \text{L} = 10^{-3}\ \text{m}^3$ and $1\ \text{cm}^3 = 10^{-6}\ \text{m}^3$.

### Pressure

Pressure is the force per unit area acting perpendicular to a surface:

$$p = \frac{F}{A}$$

in pascals ($1\ \text{Pa} = 1\ \text{N/m}^2$). The same force on a smaller area gives a larger pressure: a needle pierces skin, while snowshoes stop you sinking into snow. Atmospheric pressure at sea level is about $1.0 \times 10^5\ \text{Pa}$ (more precisely $1.013 \times 10^5\ \text{Pa}$, or 760 mmHg). In a fluid at rest, the pressure at a point acts equally in all directions.

### Pressure and depth

In a liquid of density $\rho$, the pressure increases with depth $h$:

$$p = p_0 + \rho g h$$

where $p_0$ is the pressure at the surface. The extra term is the weight of the liquid above, per unit area: a column of cross-section $A$ and height $h$ has weight $\rho A h g$, and dividing by $A$ leaves $\rho g h$. In water every 10 m of depth adds $1000 \times 10 \times 10 = 10^5\ \text{Pa}$, about one atmosphere.

Only the depth matters, not the shape or the width of the container: all points at the same depth in one connected liquid at rest are at the same pressure. That is why a liquid stands at the same level in connected vessels.

**Absolute** pressure includes $p_0$. **Gauge** pressure is the excess over atmospheric pressure, $\rho g h$ for a liquid column. Tyre gauges and blood-pressure readings give gauge pressures.

### Pascal's principle and the hydraulic press

A change of pressure applied to an enclosed liquid is passed on undiminished to every part of it. In a hydraulic press, a small force $F_1$ on a piston of area $A_1$ produces a pressure that acts on a large piston of area $A_2$:

$$\frac{F_1}{A_1} = \frac{F_2}{A_2}.$$

The force is multiplied by $\frac{A_2}{A_1}$, but energy is not created. The liquid's volume does not change, so the small piston must move $\frac{A_2}{A_1}$ times as far as the large one, and the work put in equals the work got out.

### Archimedes' principle

A body wholly or partly immersed in a fluid feels an upward buoyant force equal to the weight of the fluid it displaces:

$$F_B = \rho_{\text{fluid}}\,V_{\text{sub}}\,g.$$

The buoyant force exists because the pressure on the bottom of the body is greater than on its top. It depends on the density of the fluid and on the submerged volume, not on what the body is made of.

- If the body's average density is greater than the fluid's, it sinks. Weighed while submerged, it has an apparent weight of $mg - F_B$.
- If its average density is smaller, it floats, with the buoyant force equal to its weight. The fraction of its volume below the surface is $\frac{\rho_{\text{body}}}{\rho_{\text{fluid}}}$: ice, at about $920\ \text{kg/m}^3$, floats in fresh water with about 92% of its volume submerged.

### Fluids in motion

For an incompressible fluid flowing steadily through a pipe, the same volume passes every cross-section each second. The flow rate is

$$Q = Av, \qquad A_1 v_1 = A_2 v_2.$$

Where the pipe narrows, the fluid speeds up. For an ideal fluid (one with no viscosity), Bernoulli's equation states the conservation of energy per unit volume along the flow:

$$p + \frac{1}{2}\rho v^2 + \rho g h = \text{constant}.$$

At the same height, where the speed is higher the pressure is lower. This surprises many people: in a horizontal pipe, the narrow section has the fastest flow and the lowest pressure.

Real fluids such as blood are viscous, so a pressure difference is needed just to keep them flowing along a uniform tube. For smooth, steady flow in a narrow tube, the flow rate at a given pressure difference is proportional to the fourth power of the radius (Poiseuille's law): halving the radius of a vessel cuts the flow to one sixteenth.
`,
  examples: [
    {
      id: 'example-diver-pressure',
      title: 'Pressure on a diver',
      problemMd: md`A diver is 20 m below the surface of a freshwater lake. Taking atmospheric pressure as $1.0 \times 10^5\ \text{Pa}$, the density of water as $1000\ \text{kg/m}^3$ and $g = 10\ \text{m/s}^2$, find the gauge pressure and the absolute pressure on the diver.`,
      steps: [
        md`The gauge pressure is the pressure of the water column alone: $\rho g h = 1000 \times 10 \times 20 = 2.0 \times 10^5\ \text{Pa}$.`,
        md`The absolute pressure adds the atmosphere pressing on the surface: $1.0 \times 10^5 + 2.0 \times 10^5 = 3.0 \times 10^5\ \text{Pa}$.`,
        md`Check with the rule of thumb: each 10 m of water adds about one atmosphere, so 20 m adds two, on top of the one at the surface: about 3 atmospheres.`,
      ],
      answerMd: md`The gauge pressure is $2.0 \times 10^5\ \text{Pa}$ and the absolute pressure $3.0 \times 10^5\ \text{Pa}$. Note that doubling the depth does not double the absolute pressure: it is $2.0 \times 10^5\ \text{Pa}$ at 10 m and $3.0 \times 10^5\ \text{Pa}$ at 20 m.`,
    },
    {
      id: 'example-hydraulic-lift',
      title: 'A hydraulic car lift',
      problemMd: md`In a hydraulic lift the small piston has an area of $10\ \text{cm}^2$ and the large piston $500\ \text{cm}^2$. Taking $g = 10\ \text{m/s}^2$: (a) what force on the small piston supports a 1000 kg car on the large one? (b) How far must the small piston move to raise the car by 1.0 cm?`,
      steps: [
        md`The car's weight is $1000 \times 10 = 10\,000\ \text{N}$.`,
        md`The pressure is the same on both pistons, so the forces are in the ratio of the areas, $\frac{500}{10} = 50$. The units cancel in a ratio, so there is no need to convert to $\text{m}^2$: $F_1 = \frac{10\,000}{50} = 200\ \text{N}$.`,
        md`The volume of liquid pushed out of the small cylinder enters the large one: $10 \times d = 500 \times 1$, so $d = 50\ \text{cm}$.`,
        md`Check with energy: $200\ \text{N} \times 0.50\ \text{m} = 100\ \text{J}$ in, and $10\,000\ \text{N} \times 0.010\ \text{m} = 100\ \text{J}$ out.`,
      ],
      answerMd: md`A force of 200 N holds up the car, and the small piston must move 50 cm to lift it by 1.0 cm. The press multiplies force by 50 and divides distance by 50, so no energy is gained.`,
    },
    {
      id: 'example-floating-block',
      title: 'A floating block of wood',
      problemMd: md`A block of wood of volume 2.0 L and density $600\ \text{kg/m}^3$ floats in water. Taking $g = 10\ \text{m/s}^2$: (a) what volume of the block is under water? (b) What extra downward force would hold it completely under?`,
      steps: [
        md`In SI units the volume is $2.0 \times 10^{-3}\ \text{m}^3$, so the mass is $600 \times 2.0 \times 10^{-3} = 1.2\ \text{kg}$ and the weight 12 N.`,
        md`Floating, the buoyant force equals the weight: $1000 \times V_{\text{sub}} \times 10 = 12$, so $V_{\text{sub}} = 1.2 \times 10^{-3}\ \text{m}^3 = 1.2\ \text{L}$. That is 60% of the block, matching $\frac{600}{1000}$.`,
        md`Fully under water, the buoyant force is $1000 \times 2.0 \times 10^{-3} \times 10 = 20\ \text{N}$.`,
        md`The push must make up the difference between this and the weight: $20 - 12 = 8.0\ \text{N}$.`,
      ],
      answerMd: md`1.2 L of the block (60%) is under water, and an extra 8.0 N holds it fully under. Answering 20 N forgets that the block's own weight already provides 12 N of the downward force.`,
    },
  ],
  traps: [
    {
      title: 'Thinking the shape of the container sets the pressure',
      md: md`A tall narrow tube and a wide tank filled to the same depth with the same liquid have the same pressure at the bottom, $p_0 + \rho g h$. Volume and width do not enter; only depth does.`,
    },
    {
      title: "Using the body's density for the buoyant force",
      md: md`The buoyant force is the weight of displaced fluid, $\rho_{\text{fluid}} V_{\text{sub}} g$. A steel ball and a plastic ball of the same volume, both fully submerged in water, feel the same buoyant force; they differ only in weight.`,
    },
    {
      title: 'Mixing up gauge and absolute pressure',
      md: md`$\rho g h$ is the gauge pressure; adding atmospheric pressure gives the absolute pressure. Read which one the question asks for, and look out for an option that differs from another by exactly $1.0 \times 10^5\ \text{Pa}$.`,
    },
    {
      title: 'Expecting higher pressure where the flow is faster',
      md: md`Intuition says a fluid squeezed through a narrow section pushes harder there. For a horizontal ideal flow, Bernoulli's equation says the opposite: the faster the flow, the lower the pressure.`,
    },
  ],
  check: [
    {
      id: 'check-pipe-narrowing',
      title: 'Flow through a narrowing pipe',
      topic: 'Fluids',
      stemMd: md`Water flows at 2.0 m/s through a pipe of cross-sectional area $6.0\ \text{cm}^2$, which then narrows to $2.0\ \text{cm}^2$. Treating the water as incompressible, what is its speed in the narrow section?`,
      options: [
        { id: 'A', text: md`$\frac{2}{3}\ \text{m/s}$`, note: md`Inverts the ratio of the areas; to pass the same volume each second through a smaller section, the water must speed up, not slow down.` },
        { id: 'B', text: md`2.0 m/s`, note: md`Assumes the speed stays the same; the same volume per second through a third of the area needs three times the speed.` },
        { id: 'C', text: md`4.0 m/s`, note: md`Takes the difference of the areas, $6 - 2 = 4$, as if it were a speed; it is the ratio of the areas that sets the speed.` },
        { id: 'D', text: md`6.0 m/s`, note: '' },
        { id: 'E', text: md`18 m/s`, note: md`Squares the ratio of the areas, as if 6 and 2 were radii; the speed scales with the ratio of the areas themselves.` },
      ],
      answer: 'D',
      workingMd: md`Continuity: $A_1 v_1 = A_2 v_2$, so $6.0 \times 2.0 = 2.0 \times v_2$ and $v_2 = 6.0\ \text{m/s}$. Check in other units: $6\ \text{cm}^2 \times 200\ \text{cm/s} = 1200\ \text{cm}^3/\text{s}$, and $2\ \text{cm}^2 \times 600\ \text{cm/s} = 1200\ \text{cm}^3/\text{s}$.`,
      lesson: 'At a constant flow rate, the speed is inversely proportional to the cross-sectional area.',
    },
    {
      id: 'check-stone-in-water',
      title: 'Weighing a stone under water',
      topic: 'Fluids',
      stemMd: md`A 3.0 kg stone of volume 1.0 L hangs from a spring balance, completely submerged in water of density $1000\ \text{kg/m}^3$. Taking $g = 10\ \text{m/s}^2$, what does the balance read?`,
      options: [
        { id: 'A', text: md`2.0 N`, note: md`Subtracts the volume in litres from the mass in kilograms and forgets $g$; the forces involved are 30 N and 10 N.` },
        { id: 'B', text: md`10 N`, note: md`This is the buoyant force itself; the balance supports the weight minus the buoyant force.` },
        { id: 'C', text: md`20 N`, note: '' },
        { id: 'D', text: md`30 N`, note: md`This is the stone's weight in air; it ignores the buoyant force.` },
        { id: 'E', text: md`40 N`, note: md`Adds the buoyant force to the weight; buoyancy acts upwards and reduces the reading.` },
      ],
      answer: 'C',
      workingMd: md`The weight is $3.0 \times 10 = 30\ \text{N}$. The stone displaces $1.0 \times 10^{-3}\ \text{m}^3$ of water, so $F_B = 1000 \times 1.0 \times 10^{-3} \times 10 = 10\ \text{N}$. The balance reads $30 - 10 = 20\ \text{N}$.`,
      lesson: 'A submerged body weighs less by the weight of the fluid it displaces.',
    },
    {
      id: 'check-drip-pressure',
      title: 'Pressure from a drip bag',
      topic: 'Fluids',
      stemMd: md`A drip bag hangs so that the surface of its liquid is 80 cm above the needle. The liquid's density is $1000\ \text{kg/m}^3$ and $g = 10\ \text{m/s}^2$. Ignoring flow, what gauge pressure does the liquid column produce at the needle?`,
      options: [
        { id: 'A', text: md`8 Pa`, note: md`Uses the density as 1 (from $1\ \text{g/cm}^3$) instead of $1000\ \text{kg/m}^3$, mixing two systems of units.` },
        { id: 'B', text: md`800 Pa`, note: md`Leaves out $g$, computing $\rho h$ instead of $\rho g h$.` },
        { id: 'C', text: md`8.0 kPa`, note: '' },
        { id: 'D', text: md`108 kPa`, note: md`Adds atmospheric pressure, which gives the absolute pressure; the question asks for the gauge pressure.` },
        { id: 'E', text: md`800 kPa`, note: md`Uses the height in centimetres (80) instead of metres (0.80).` },
      ],
      answer: 'C',
      workingMd: md`$\rho g h = 1000 \times 10 \times 0.80 = 8000\ \text{Pa} = 8.0\ \text{kPa}$. Check: 10 m of water gives about $10^5\ \text{Pa}$, so 0.8 m gives $0.08 \times 10^5 = 8000\ \text{Pa}$.`,
      lesson: md`The gauge pressure of a liquid column is $\rho g h$, with every quantity in SI units.`,
    },
  ],
  takeaways: [
    md`Pressure is $\frac{F}{A}$; in a liquid at rest it rises by $\rho g h$ with depth, whatever the shape of the container.`,
    md`Every 10 m of water adds about one atmosphere, $1.0 \times 10^5\ \text{Pa}$.`,
    'A hydraulic press multiplies force by the ratio of the areas, but never multiplies energy.',
    'The buoyant force equals the weight of fluid displaced; a floating body displaces its own weight.',
    md`In steady flow $A_1v_1 = A_2v_2$, and where an ideal fluid moves faster its pressure is lower.`,
  ],
  flashcards: [
    { front: 'Density of water', back: md`About $1000\ \text{kg/m}^3$, which is $1\ \text{g/cm}^3$, or 1 kg per litre.` },
    { front: 'Pressure at a depth h in a liquid', back: md`$p = p_0 + \rho g h$; the gauge pressure is $\rho g h$. Only the depth matters, not the shape of the container.` },
    { front: "Pascal's principle", back: md`A pressure change in an enclosed liquid is transmitted to every part of it, so in a hydraulic press $\frac{F_1}{A_1} = \frac{F_2}{A_2}$.` },
    { front: "Archimedes' principle", back: md`The buoyant force equals the weight of fluid displaced: $F_B = \rho_{\text{fluid}} V_{\text{sub}} g$.` },
    { front: 'Fraction of a floating body below the surface', back: md`$\frac{\rho_{\text{body}}}{\rho_{\text{fluid}}}$; ice floats in fresh water with about 92% of its volume submerged.` },
    { front: 'Continuity and Bernoulli', back: md`$A_1 v_1 = A_2 v_2$, and for an ideal fluid $p + \frac{1}{2}\rho v^2 + \rho g h$ is constant: at the same height, faster flow means lower pressure.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-mechanics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const heatGasLawsAndThermodynamicsLesson: Lesson = {
  slug: 'heat-gas-laws-and-thermodynamics',
  title: 'Heat, gas laws and thermodynamics',
  summary: 'Temperature in kelvin, heat and latent heat, the ideal gas law, the first and second laws of thermodynamics and the efficiency of heat engines.',
  minutes: 24,
  objectives: [
    'Convert between Celsius and kelvin, and calculate heat for temperature changes, changes of state and mixtures.',
    'Apply the ideal gas law and its special cases, with temperatures in kelvin.',
    'Use the first law of thermodynamics with a clear sign convention, and the Carnot limit on the efficiency of a heat engine.',
  ],
  teachMd: md`
### Temperature and the kelvin

Temperature measures the average kinetic energy of the particles of a body. Its SI unit is the kelvin, and

$$T(\text{K}) = \theta(^\circ\text{C}) + 273$$

(more precisely 273.15). Absolute zero, 0 K, is −273 °C. One kelvin is the same size as one degree Celsius, so a **temperature difference** has the same number in both scales: a rise from 20 °C to 50 °C is a rise of 30 K. Use kelvin whenever a temperature is multiplied or divided, as in the gas laws and in efficiencies.

### Heat and specific heat capacity

Heat is energy transferred because of a difference in temperature, measured in joules. The heat needed to change the temperature of a mass $m$ by $\Delta T$ is

$$Q = mc\,\Delta T$$

where $c$ is the specific heat capacity of the material. Water's is unusually large, about $4200\ \text{J/(kg K)}$ (one calorie, about 4.2 J, warms 1 g of water by 1 °C), which is why water warms up and cools down slowly.

When bodies at different temperatures are placed together in an insulated container, they reach a common temperature (thermal equilibrium), and the heat lost by the hotter ones equals the heat gained by the colder ones.

### Changes of state

While a substance melts or boils, the heat supplied goes into separating its particles, not into raising its temperature, so the temperature stays constant until the change is complete. The heat needed is

$$Q = mL$$

where $L$ is the specific latent heat. For water, the latent heat of fusion is about $3.3 \times 10^5\ \text{J/kg}$ and the latent heat of vaporisation about $2.3 \times 10^6\ \text{J/kg}$, roughly seven times larger. Evaporating sweat cools the skin because every kilogram that evaporates takes this large amount of energy with it.

### How heat travels

Conduction passes energy through a material by collisions between particles: metals conduct well, still air poorly. Convection carries energy by the bulk movement of a fluid, as warm fluid rises and cool fluid sinks. Radiation carries energy as electromagnetic radiation and needs no medium, which is how the Sun warms the Earth.

### The ideal gas law

For an ideal gas,

$$pV = nRT$$

with $p$ in Pa, $V$ in $\text{m}^3$, $n$ in moles, $T$ in kelvin and $R \approx 8.31\ \text{J/(mol K)}$. For a fixed amount of gas, $\frac{pV}{T}$ is constant, and this contains three special laws:

| Held constant | Law | Relation |
| --- | --- | --- |
| $T$ | Boyle | $p_1V_1 = p_2V_2$ |
| $p$ | Charles | $\frac{V_1}{T_1} = \frac{V_2}{T_2}$ |
| $V$ | Gay-Lussac | $\frac{p_1}{T_1} = \frac{p_2}{T_2}$ |

One mole of an ideal gas at 0 °C and $1.013 \times 10^5\ \text{Pa}$ occupies about 22.4 L. In a ratio, any units of pressure and volume work as long as both sides use the same ones; the temperature must always be in kelvin.

### The first law of thermodynamics

Energy is conserved. For a gas, the change in internal energy equals the heat supplied to it minus the work it does:

$$\Delta U = Q - W.$$

Here $Q > 0$ when heat enters the gas, and $W > 0$ when the gas expands and does work on its surroundings. Some books write $\Delta U = Q + W$ with $W$ the work done **on** the gas; the physics is the same, so check which convention a question uses. At constant pressure the work done by the gas is $W = p\,\Delta V$; on a $p$–$V$ graph it is the area under the curve. The internal energy of an ideal gas depends only on its temperature.

| Process | Condition | Consequence |
| --- | --- | --- |
| Isothermal | $\Delta T = 0$ | $\Delta U = 0$, so $Q = W$ |
| Isochoric | $\Delta V = 0$ | $W = 0$, so $\Delta U = Q$ |
| Isobaric | $\Delta p = 0$ | $W = p\,\Delta V$ |
| Adiabatic | $Q = 0$ | $\Delta U = -W$: compression heats the gas, expansion cools it |

### The second law and heat engines

Heat flows spontaneously from hot to cold, never the other way; a refrigerator moves heat from cold to hot only because work is done on it. A heat engine takes in heat $Q_h$ from a hot reservoir, does work $W$ and gives out heat $Q_c$ to a cold reservoir, so $W = Q_h - Q_c$ and its efficiency is

$$\eta = \frac{W}{Q_h} = 1 - \frac{Q_c}{Q_h}.$$

No engine can turn all the heat it takes in into work. The best possible engine working between kelvin temperatures $T_h$ and $T_c$, a Carnot engine, reaches

$$\eta_{\max} = 1 - \frac{T_c}{T_h}.$$

Another statement of the second law uses entropy, a measure of disorder: the entropy of an isolated system never decreases.
`,
  examples: [
    {
      id: 'example-mixing-water',
      title: 'Mixing hot and cold water',
      problemMd: md`2.0 kg of water at 80 °C is mixed with 3.0 kg of water at 20 °C in an insulated container. What is the final temperature?`,
      steps: [
        md`Heat lost by the hot water equals heat gained by the cold water: $2c(80 - T) = 3c(T - 20)$. The specific heat capacity $c$ cancels.`,
        md`Expand: $160 - 2T = 3T - 60$, so $5T = 220$ and $T = 44\ ^\circ\text{C}$.`,
        md`Check by a second route: the final temperature is the mass-weighted mean, $\frac{2 \times 80 + 3 \times 20}{5} = \frac{220}{5} = 44\ ^\circ\text{C}$. In joules, the hot water loses $2 \times 4200 \times 36 = 302\,400\ \text{J}$ and the cold water gains $3 \times 4200 \times 24 = 302\,400\ \text{J}$.`,
      ],
      answerMd: md`The final temperature is 44 °C. The simple average, 50 °C, is the tempting wrong answer: it would be right only for equal masses.`,
    },
    {
      id: 'example-gas-compressed',
      title: 'Compressing and heating a gas',
      problemMd: md`A gas at $1.0 \times 10^5\ \text{Pa}$ occupies 6.0 L at 27 °C. It is compressed to 3.0 L and heated to 177 °C. What is its final pressure?`,
      steps: [
        md`Convert the temperatures to kelvin: $27 + 273 = 300\ \text{K}$ and $177 + 273 = 450\ \text{K}$.`,
        md`Use $\frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2}$: $p_2 = p_1 \times \frac{V_1}{V_2} \times \frac{T_2}{T_1} = 1.0 \times 10^5 \times 2 \times 1.5 = 3.0 \times 10^5\ \text{Pa}$. Litres can stay as litres, because only their ratio enters.`,
        md`Check: $\frac{pV}{T}$ before is $\frac{1.0 \times 10^5 \times 6}{300} = 2000$, and after $\frac{3.0 \times 10^5 \times 3}{450} = 2000$.`,
      ],
      answerMd: md`The final pressure is $3.0 \times 10^5\ \text{Pa}$. Using Celsius temperatures gives $1.0 \times 10^5 \times 2 \times \frac{177}{27} \approx 1.3 \times 10^6\ \text{Pa}$, more than four times too large.`,
    },
    {
      id: 'example-first-law',
      title: 'Heat in, work out',
      problemMd: md`A gas absorbs 500 J of heat while it expands at a constant pressure of $1.0 \times 10^5\ \text{Pa}$ from 2.0 L to 4.0 L. Find the work done by the gas and the change in its internal energy.`,
      steps: [
        md`Convert the change in volume to SI, because the work must come out in joules: $\Delta V = 2.0\ \text{L} = 2.0 \times 10^{-3}\ \text{m}^3$.`,
        md`Work done by the gas at constant pressure: $W = p\,\Delta V = 1.0 \times 10^5 \times 2.0 \times 10^{-3} = 200\ \text{J}$.`,
        md`First law: $\Delta U = Q - W = 500 - 200 = 300\ \text{J}$. The internal energy rises, so the temperature rises, as it must for a gas expanding at constant pressure ($V \propto T$).`,
      ],
      answerMd: md`The gas does 200 J of work and its internal energy rises by 300 J. Adding the work instead, $500 + 200 = 700\ \text{J}$, treats it as work done on the gas, but this gas expanded.`,
    },
  ],
  traps: [
    {
      title: 'Using Celsius in a ratio',
      md: md`Gas laws and efficiencies divide temperatures, and only kelvin is proportional to the particles' energy. Doubling the temperature from 10 °C to 20 °C does not double a gas's pressure: in kelvin it goes from 283 K to 293 K, a rise of about 3.5%.`,
    },
    {
      title: 'Mixing up the sign of the work',
      md: md`In $\Delta U = Q - W$, $W$ is the work done **by** the gas: positive when it expands. When a gas is compressed, $W$ is negative and the internal energy rises. Fix your convention before you substitute numbers.`,
    },
    {
      title: 'Expecting the temperature to rise during a change of state',
      md: md`While ice melts or water boils, heat goes in but the temperature stays fixed until the change is complete. A heating curve shows flat sections there; heat during them is $mL$, not $mc\Delta T$.`,
    },
    {
      title: 'Confusing adiabatic with isothermal',
      md: md`Adiabatic means no heat flows ($Q = 0$), so the temperature does change when work is done. Isothermal means the temperature stays fixed, so heat must flow to balance the work. A quick compression is close to adiabatic; a slow one in good thermal contact is close to isothermal.`,
    },
  ],
  check: [
    {
      id: 'check-carnot-limit',
      title: 'The best possible engine',
      topic: 'Thermodynamics',
      stemMd: md`A heat engine works between a hot reservoir at 227 °C and a cold reservoir at 27 °C. What is the greatest efficiency it could possibly have?`,
      options: [
        { id: 'A', text: md`12%`, note: md`This is the ratio of the Celsius temperatures, $\frac{27}{227} \approx 0.12$; the limit needs kelvin temperatures and the form $1 - \frac{T_c}{T_h}$.` },
        { id: 'B', text: md`40%`, note: '' },
        { id: 'C', text: md`60%`, note: md`This is $\frac{T_c}{T_h} = \frac{300}{500}$, the smallest fraction of the heat that must be given out, not the fraction turned into work.` },
        { id: 'D', text: md`67%`, note: md`Divides the temperature difference by the cold temperature, $\frac{200}{300}$, instead of by the hot one.` },
        { id: 'E', text: md`88%`, note: md`Uses Celsius temperatures in $1 - \frac{T_c}{T_h}$: $1 - \frac{27}{227} \approx 0.88$. Kelvin temperatures are needed.` },
      ],
      answer: 'B',
      workingMd: md`In kelvin, $T_h = 227 + 273 = 500\ \text{K}$ and $T_c = 27 + 273 = 300\ \text{K}$. The Carnot limit is $1 - \frac{300}{500} = 0.40$, or 40%. Second route: $\frac{T_h - T_c}{T_h} = \frac{200}{500} = 0.40$.`,
      lesson: md`The maximum efficiency of a heat engine is $1 - \frac{T_c}{T_h}$, with both temperatures in kelvin.`,
    },
    {
      id: 'check-melting-ice',
      title: 'From ice to warm water',
      topic: 'Thermodynamics',
      stemMd: md`How much heat is needed to turn 0.20 kg of ice at 0 °C into water at 10 °C? Take the latent heat of fusion of ice as $3.3 \times 10^5\ \text{J/kg}$ and the specific heat capacity of water as $4.2 \times 10^3\ \text{J/(kg K)}$.`,
      options: [
        { id: 'A', text: md`8.4 kJ`, note: md`This only warms the melted water from 0 °C to 10 °C; melting the ice needs far more.` },
        { id: 'B', text: md`57.6 kJ`, note: md`Subtracts the warming heat from the melting heat; both must be supplied, so they add.` },
        { id: 'C', text: md`66 kJ`, note: md`This only melts the ice; the water must then be warmed by 10 K as well.` },
        { id: 'D', text: md`74.4 kJ`, note: '' },
        { id: 'E', text: md`338.4 kJ`, note: md`Uses the latent heat for 1 kg rather than for 0.20 kg, leaving the mass out of $Q = mL$.` },
      ],
      answer: 'D',
      workingMd: md`Melting: $Q_1 = mL = 0.20 \times 3.3 \times 10^5 = 66\,000\ \text{J}$. Warming: $Q_2 = mc\,\Delta T = 0.20 \times 4200 \times 10 = 8400\ \text{J}$. Total: $66\,000 + 8400 = 74\,400\ \text{J} = 74.4\ \text{kJ}$.`,
      lesson: md`Add the heat for each stage: $mL$ to change state, $mc\,\Delta T$ to change temperature.`,
    },
    {
      id: 'check-adiabatic-compression',
      title: 'A quick compression',
      topic: 'Thermodynamics',
      stemMd: md`A gas in an insulated cylinder is compressed quickly, so that no heat enters or leaves it. Which statement is correct?`,
      options: [
        { id: 'A', text: md`Its temperature stays the same, because no heat enters it.`, note: md`No heat transfer makes the process adiabatic, not isothermal; the work done on the gas still changes its internal energy.` },
        { id: 'B', text: md`Its internal energy falls, because work is done in the process.`, note: md`The work is done on the gas, not by it, so it adds to the internal energy.` },
        { id: 'C', text: md`Its internal energy rises by the work done on it, and its temperature rises.`, note: '' },
        { id: 'D', text: md`Its internal energy is unchanged, because no heat is exchanged.`, note: md`With $Q = 0$ the first law gives $\Delta U = -W$, and $W$ is not zero when the volume changes.` },
        { id: 'E', text: md`It gives out heat equal to the work done on it.`, note: md`That describes a slow isothermal compression; here the cylinder is insulated, so no heat can leave.` },
      ],
      answer: 'C',
      workingMd: md`With $Q = 0$, the first law gives $\Delta U = -W$. The gas is compressed, so the work done by it is negative and $\Delta U$ is positive: it equals the work done on the gas. The internal energy of an ideal gas depends only on temperature, so the temperature rises, as in a bicycle pump that warms when used.`,
      lesson: 'In an adiabatic process, all the work done on or by the gas goes into changing its internal energy.',
    },
  ],
  takeaways: [
    'Use kelvin whenever a temperature is multiplied or divided; a temperature difference is the same number in K and in °C.',
    md`Heat to change temperature is $mc\,\Delta T$; heat to change state is $mL$, at constant temperature.`,
    md`For a fixed amount of ideal gas, $\frac{pV}{T}$ is constant.`,
    md`First law: $\Delta U = Q - W$, with $W$ the work done by the gas.`,
    md`No heat engine beats the Carnot efficiency, $1 - \frac{T_c}{T_h}$.`,
  ],
  flashcards: [
    { front: 'Celsius to kelvin', back: md`$T = \theta + 273$ (273.15 exactly); a change of 1 °C is a change of 1 K.` },
    { front: 'Heat for a change of temperature', back: md`$Q = mc\,\Delta T$; for water, $c \approx 4200\ \text{J/(kg K)}$.` },
    { front: 'Latent heat', back: md`$Q = mL$; during a change of state the temperature stays constant.` },
    { front: 'Ideal gas law', back: md`$pV = nRT$, with $T$ in kelvin and $R \approx 8.31\ \text{J/(mol K)}$; for a fixed amount of gas, $\frac{pV}{T}$ is constant.` },
    { front: 'First law of thermodynamics', back: md`$\Delta U = Q - W$: the heat supplied to the gas minus the work done by the gas.` },
    { front: 'Maximum efficiency of a heat engine', back: md`$\eta_{\max} = 1 - \frac{T_c}{T_h}$, with both temperatures in kelvin (the Carnot limit).` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-thermo-waves' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const electricChargeFieldsAndCircuitsLesson: Lesson = {
  slug: 'electric-charge-fields-and-circuits',
  title: 'Electric charge, fields and circuits',
  summary: "Charge, Coulomb's law, fields and potential, Ohm's law, series and parallel circuits and electrical power, with numbers you can work by hand.",
  minutes: 22,
  objectives: [
    "Use Coulomb's law and the definitions of field, potential difference and energy for charges.",
    "Apply Ohm's law and the resistivity formula, and reduce series and parallel networks to find currents and voltages.",
    'Calculate electrical power and energy with the form of the power formula that fits the data.',
  ],
  teachMd: md`
### Electric charge

Charge comes in two kinds, positive and negative: like charges repel and unlike charges attract. It is measured in coulombs (C) and is quantised: every charge is a whole multiple of the elementary charge $e = 1.6 \times 10^{-19}\ \text{C}$, carried by the proton (positive) and the electron (negative). Charge is conserved. Rubbing a plastic rod with a cloth moves electrons from one to the other; it does not create charge. In conductors, such as metals and ionic solutions, charges move freely; in insulators they do not.

### Coulomb's law

Two point charges $q_1$ and $q_2$ a distance $r$ apart exert forces on each other along the line joining them:

$$F = k\frac{q_1 q_2}{r^2}, \qquad k = \frac{1}{4\pi\varepsilon_0} \approx 9 \times 10^9\ \text{N m}^2/\text{C}^2.$$

Like gravitation, this is an inverse-square law: double the distance and the force falls to a quarter; double one charge and the force doubles. The two forces form a third-law pair, so they are equal in size even when the charges are not.

### Electric field and potential

The electric field at a point is the force per unit positive charge placed there, $E = \frac{F}{q}$, in N/C (equivalently V/m). A point charge $Q$ produces a field of size $E = \frac{kQ}{r^2}$, pointing away from a positive charge and towards a negative one. Field lines start on positive charges and end on negative ones, and they are closer together where the field is stronger.

The potential difference (voltage) between two points is the work done per unit charge in moving a charge between them, $V = \frac{W}{q}$, in volts (J/C). A charge $q$ moved through a potential difference $V$ gains or loses energy $qV$. An electron accelerated through 1 V gains one electronvolt: $1\ \text{eV} = 1.6 \times 10^{-19}\ \text{J}$.

Between two parallel plates a distance $d$ apart with a potential difference $V$, the field is uniform: $E = \frac{V}{d}$. Such plates form a capacitor, which stores charge $Q = CV$, where $C$ is its capacitance in farads; the energy stored is $\frac{1}{2}CV^2$.

### Current, resistance and Ohm's law

Current is the rate of flow of charge, $I = \frac{Q}{t}$, in amperes ($1\ \text{A} = 1\ \text{C/s}$). By convention, current flows from the positive terminal round the circuit to the negative one; the electrons in a metal move the other way.

The resistance of a component is $R = \frac{V}{I}$, in ohms ($\Omega$). Ohm's law says that for a metal at constant temperature $R$ is constant, so $V = IR$ and the current is proportional to the voltage. The resistance of a wire depends on its material and its shape:

$$R = \rho\frac{L}{A}$$

where $\rho$ is the resistivity of the material, $L$ the length and $A$ the cross-sectional area. Longer wires resist more; thicker wires resist less.

### Series and parallel

| | Series | Parallel |
| --- | --- | --- |
| Current | the same through each | splits; the branch currents add up to the total |
| Voltage | splits; the parts add up to the total | the same across each |
| Total resistance | $R = R_1 + R_2 + \dots$ | $\frac{1}{R} = \frac{1}{R_1} + \frac{1}{R_2} + \dots$ |

Two resistors in parallel have a combined resistance of $\frac{R_1R_2}{R_1 + R_2}$; two equal ones give half the resistance of one. A parallel combination always has less resistance than its smallest branch, because each new branch gives the current another path.

These rules come from Kirchhoff's laws. The current flowing into a junction equals the current flowing out, because charge is conserved. Round any closed loop the potential differences add up to zero, because energy is conserved.

### Electrical power and energy

The power delivered to a component is

$$P = VI = I^2R = \frac{V^2}{R}.$$

Choose the form that uses what you know. At a fixed voltage, such as the mains, a smaller resistance draws a larger current and more power. The energy transferred is $E = Pt$. Electricity bills count kilowatt-hours: $1\ \text{kWh} = 1000\ \text{W} \times 3600\ \text{s} = 3.6 \times 10^6\ \text{J}$.

### Solving circuit questions

Reduce the circuit step by step: combine each parallel group, then the series parts, to find the total resistance. Use $I = \frac{V}{R}$ for the current from the supply. Then work back outwards, finding the voltage across each part and the current in each branch. Finally check that the branch currents add up to the total and that the voltages round each loop add up to the supply voltage.
`,
  examples: [
    {
      id: 'example-coulomb-force',
      title: 'The force between two charged spheres',
      problemMd: md`Two small spheres carry charges of $+2.0\ \mu\text{C}$ and $+3.0\ \mu\text{C}$, and their centres are 30 cm apart. Taking $k = 9 \times 10^9\ \text{N m}^2/\text{C}^2$, find the force between them. What is the force if the distance is halved?`,
      steps: [
        md`Convert to SI: $q_1 = 2.0 \times 10^{-6}\ \text{C}$, $q_2 = 3.0 \times 10^{-6}\ \text{C}$, $r = 0.30\ \text{m}$.`,
        md`Substitute: $F = \frac{9 \times 10^9 \times 2.0 \times 10^{-6} \times 3.0 \times 10^{-6}}{0.30^2} = \frac{9 \times 10^9 \times 6 \times 10^{-12}}{0.09}$.`,
        md`Work the powers of ten: $9 \times 10^9 \times 6 \times 10^{-12} = 54 \times 10^{-3} = 0.054$, and $\frac{0.054}{0.09} = 0.60\ \text{N}$. Second route: $\frac{9 \times 10^9}{0.09} = 10^{11}$, and $10^{11} \times 6 \times 10^{-12} = 0.60\ \text{N}$. Both charges are positive, so the force is repulsive.`,
        md`Halving the distance multiplies the force by $2^2 = 4$: $4 \times 0.60 = 2.4\ \text{N}$.`,
      ],
      answerMd: md`The spheres repel each other with 0.60 N, and with 2.4 N at 15 cm. Doubling the force to 1.2 N when the distance is halved is the tempting wrong answer: the law is inverse-square.`,
    },
    {
      id: 'example-mixed-circuit',
      title: 'A series and parallel circuit',
      problemMd: md`A 12 V battery of negligible internal resistance is connected to a $2.0\ \Omega$ resistor in series with a parallel pair of $6.0\ \Omega$ and $3.0\ \Omega$ resistors. Find the current from the battery, the current in each resistor of the pair, and the total power.`,
      steps: [
        md`The parallel pair: $\frac{6 \times 3}{6 + 3} = 2.0\ \Omega$.`,
        md`Total resistance $2 + 2 = 4.0\ \Omega$, so the battery current is $I = \frac{12}{4} = 3.0\ \text{A}$.`,
        md`The series resistor takes $3 \times 2 = 6\ \text{V}$, leaving 6 V across the pair. Currents: $\frac{6}{6} = 1.0\ \text{A}$ and $\frac{6}{3} = 2.0\ \text{A}$, which add up to 3.0 A as they should.`,
        md`Total power: $P = VI = 12 \times 3 = 36\ \text{W}$. Check part by part: $3^2 \times 2 = 18\ \text{W}$, $\frac{6^2}{6} = 6\ \text{W}$ and $\frac{6^2}{3} = 12\ \text{W}$, total 36 W.`,
      ],
      answerMd: md`The battery supplies 3.0 A; 1.0 A flows through the $6.0\ \Omega$ resistor and 2.0 A through the $3.0\ \Omega$ one; the circuit uses 36 W. The larger current takes the branch with the smaller resistance.`,
    },
    {
      id: 'example-stretched-wire',
      title: 'Stretching a wire',
      problemMd: md`A wire has a resistance of $10\ \Omega$. It is drawn out to twice its length, its volume staying the same. What is its new resistance?`,
      steps: [
        md`The volume $LA$ is fixed, so doubling the length $L$ halves the cross-sectional area $A$.`,
        md`In $R = \rho\frac{L}{A}$, the numerator doubles and the denominator halves, so $R$ is multiplied by $2 \times 2 = 4$.`,
        md`New resistance: $4 \times 10 = 40\ \Omega$.`,
      ],
      answerMd: md`The stretched wire has a resistance of $40\ \Omega$. Answering $20\ \Omega$ allows for the extra length but forgets that the wire has also become thinner.`,
    },
  ],
  traps: [
    {
      title: 'Halving instead of quartering',
      md: md`In Coulomb's law the distance is squared. Doubling the separation divides the force by 4, and tripling it divides the force by 9. Write the factor for each quantity separately, then combine them.`,
    },
    {
      title: 'Adding resistances in parallel',
      md: md`Two $6\ \Omega$ resistors in parallel make $3\ \Omega$, not $12\ \Omega$. If your total for a parallel group is larger than its smallest branch, you have added the resistances instead of their reciprocals.`,
    },
    {
      title: 'Thinking current is used up',
      md: md`The same current flows out of a resistor as flows into it; charge is conserved. What the resistor takes is energy, which is why the potential falls across it. Every component in a single series loop carries the same current.`,
    },
    {
      title: 'Picking a power formula that hides a change',
      md: md`$P = I^2R$ suggests that more resistance means more power, while $P = \frac{V^2}{R}$ suggests the opposite. Both are right; use the one whose other quantity is fixed. For components in parallel the voltage is fixed, so the one with the smaller resistance dissipates more power.`,
    },
  ],
  check: [
    {
      id: 'check-coulomb-scaling',
      title: 'Changing charges and distance',
      topic: 'Electrostatics',
      stemMd: md`Two point charges exert a force of size $F$ on each other. Both charges are doubled and their separation is tripled. What is the new force?`,
      options: [
        { id: 'A', text: md`$\frac{2}{9}F$`, note: md`Doubles only one charge; both are doubled, which multiplies their product by 4.` },
        { id: 'B', text: md`$\frac{4}{9}F$`, note: '' },
        { id: 'C', text: md`$\frac{4}{3}F$`, note: md`Divides by the distance factor rather than its square; Coulomb's law is an inverse-square law.` },
        { id: 'D', text: md`$\frac{9}{4}F$`, note: md`Inverts the factor; increasing the separation must reduce the force.` },
        { id: 'E', text: md`$36F$`, note: md`Multiplies by the square of the distance factor instead of dividing by it.` },
      ],
      answer: 'B',
      workingMd: md`The product of the charges is multiplied by $2 \times 2 = 4$, and $r^2$ by $3^2 = 9$. So $F' = \frac{4}{9}F$.`,
      lesson: md`In an inverse-square law, multiplying the distance by $k$ divides the force by $k^2$.`,
    },
    {
      id: 'check-voltage-parallel-pair',
      title: 'Voltage across a parallel pair',
      topic: 'Circuits',
      stemMd: md`Three identical $6.0\ \Omega$ resistors are connected so that two are in parallel and this pair is in series with the third. The combination is connected to a 9.0 V supply of negligible internal resistance. What is the voltage across the parallel pair?`,
      options: [
        { id: 'A', text: md`9.0 V`, note: md`This is the whole supply voltage; it ignores the series resistor, which takes its own share.` },
        { id: 'B', text: md`6.0 V`, note: md`This is the voltage across the single series resistor, not across the pair.` },
        { id: 'C', text: md`4.5 V`, note: md`Splits the voltage equally, as if the pair had the same resistance as the single resistor; the pair has only $3.0\ \Omega$.` },
        { id: 'D', text: md`3.0 V`, note: '' },
        { id: 'E', text: md`1.5 V`, note: md`Divides the supply voltage by $6\ \Omega$, which gives a current in amperes, and reads it as a voltage.` },
      ],
      answer: 'D',
      workingMd: md`The pair has $\frac{6}{2} = 3.0\ \Omega$, so the total is $3 + 6 = 9.0\ \Omega$ and the current is $\frac{9}{9} = 1.0\ \text{A}$. Across the pair: $1.0 \times 3.0 = 3.0\ \text{V}$. Check: the series resistor takes 6.0 V, and $6 + 3 = 9\ \text{V}$. Second route: the voltage divides in proportion to resistance, $\frac{3}{3 + 6} \times 9 = 3.0\ \text{V}$.`,
      lesson: 'In series, the supply voltage divides in proportion to the resistances.',
    },
    {
      id: 'check-heater-energy',
      title: 'Energy used by a heater',
      topic: 'Circuits',
      stemMd: md`A heater draws a current of 5.0 A from a 200 V supply for 30 minutes. How much energy does it transfer?`,
      options: [
        { id: 'A', text: md`$1.0 \times 10^3\ \text{J}$`, note: md`This is the power in watts, the energy per second, not the energy transferred in 30 minutes.` },
        { id: 'B', text: md`$3.0 \times 10^4\ \text{J}$`, note: md`Uses 30 s instead of 30 minutes, which is 1800 s.` },
        { id: 'C', text: md`$7.2 \times 10^4\ \text{J}$`, note: md`Takes the power as $\frac{V}{I} = 40\ \text{W}$; that ratio is the resistance, and the power is $VI$.` },
        { id: 'D', text: md`$1.8 \times 10^6\ \text{J}$`, note: '' },
        { id: 'E', text: md`$3.6 \times 10^6\ \text{J}$`, note: md`Uses one hour instead of half an hour; that is 1 kWh, but the heater ran for 0.5 h.` },
      ],
      answer: 'D',
      workingMd: md`The power is $P = VI = 200 \times 5.0 = 1000\ \text{W}$ and the time is $30 \times 60 = 1800\ \text{s}$, so $E = 1000 \times 1800 = 1.8 \times 10^6\ \text{J}$. Second route: 1 kW for 0.5 h is 0.5 kWh, and $0.5 \times 3.6 \times 10^6 = 1.8 \times 10^6\ \text{J}$.`,
      lesson: 'Energy is power multiplied by time: time in seconds gives joules, time in hours with power in kilowatts gives kilowatt-hours.',
    },
  ],
  takeaways: [
    md`Coulomb's law is inverse-square: $F = k\frac{q_1q_2}{r^2}$, with $k \approx 9 \times 10^9\ \text{N m}^2/\text{C}^2$.`,
    md`Moving a charge $q$ through a potential difference $V$ transfers energy $qV$.`,
    'Series resistances add; a parallel combination has less resistance than its smallest branch.',
    md`Electrical power is $VI = I^2R = \frac{V^2}{R}$, and energy is power multiplied by time.`,
  ],
  flashcards: [
    { front: 'The elementary charge', back: md`$e = 1.6 \times 10^{-19}\ \text{C}$; every charge is a whole multiple of it.` },
    { front: "Coulomb's law", back: md`$F = k\frac{q_1 q_2}{r^2}$ with $k \approx 9 \times 10^9\ \text{N m}^2/\text{C}^2$; doubling the distance quarters the force.` },
    { front: 'Field between parallel plates', back: md`Uniform, with $E = \frac{V}{d}$, in V/m.` },
    { front: "Ohm's law and resistivity", back: md`$V = IR$; a wire of length $L$ and cross-section $A$ has $R = \rho\frac{L}{A}$.` },
    { front: 'Resistors in series and in parallel', back: md`Series: $R = R_1 + R_2$, with the same current through each. Parallel: $\frac{1}{R} = \frac{1}{R_1} + \frac{1}{R_2}$, with the same voltage across each.` },
    { front: 'The three forms of electrical power', back: md`$P = VI = I^2R = \frac{V^2}{R}$, in watts.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-electricity' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const magnetismAndElectromagneticInductionLesson: Lesson = {
  slug: 'magnetism-and-electromagnetic-induction',
  title: 'Magnetism and electromagnetic induction',
  summary: 'Magnetic forces on moving charges and currents, the fields that currents make, magnetic flux, Faraday and Lenz induction, generators and transformers.',
  minutes: 22,
  objectives: [
    'Calculate the magnetic force on a moving charge and on a current-carrying wire, and explain why it does no work on a charge.',
    'Describe the fields made by a straight wire and a solenoid, and calculate magnetic flux.',
    "Use Faraday's and Lenz's laws for induced emf, and the turns ratio of an ideal transformer.",
  ],
  teachMd: md`
### Magnets and magnetic fields

A magnet has a north pole and a south pole. Like poles repel and unlike poles attract, and a pole never appears on its own: cutting a bar magnet in two gives two smaller magnets, each with both poles. The field round a magnet is drawn with field lines that leave the north pole and enter the south pole outside the magnet; a compass needle lines up along them. The Earth behaves like a large magnet whose magnetic south pole lies near the geographic North Pole, which is why the north end of a compass points north.

The magnetic field $B$ is measured in tesla (T). Between the poles of a strong laboratory magnet it is of the order of 0.1 to 1 T; the Earth's field is about $5 \times 10^{-5}\ \text{T}$.

### The force on a moving charge

A charge $q$ moving with speed $v$ at an angle $\theta$ to a magnetic field $B$ feels a force

$$F = qvB\sin\theta.$$

The force is perpendicular to both the velocity and the field. It is greatest when the charge moves at right angles to the field and zero when it moves along the field. Its direction for a positive charge is given by the right-hand rule: with the fingers of a flat right hand along $B$ and the thumb along $v$, the palm pushes in the direction of $F$. For a negative charge, such as an electron, the force is in the opposite direction.

Because the force is always perpendicular to the velocity, it does no work: it changes the direction of motion but never the speed or the kinetic energy. A charge moving at right angles to a uniform field therefore travels in a circle, with the magnetic force providing the centripetal force:

$$qvB = \frac{mv^2}{r} \quad\Rightarrow\quad r = \frac{mv}{qB}.$$

### The force on a current-carrying wire

A current is moving charge, so a straight wire of length $L$ carrying a current $I$ at an angle $\theta$ to a field $B$ feels a force

$$F = BIL\sin\theta,$$

again perpendicular to both the wire and the field. This is the principle of the electric motor: the two sides of a current-carrying coil in a magnetic field are pushed in opposite directions, which turns the coil.

### Fields made by currents

Every current produces a magnetic field. Round a long straight wire the field lines are circles centred on the wire, and the field at a distance $r$ is

$$B = \frac{\mu_0 I}{2\pi r}, \qquad \mu_0 = 4\pi \times 10^{-7}\ \text{T m/A}.$$

The right-hand grip rule gives its direction: point the thumb along the current, and the curled fingers show the direction of the field lines. Inside a long solenoid with $n$ turns per metre the field is nearly uniform, $B = \mu_0 n I$, and outside it the field looks like that of a bar magnet. Two parallel wires carrying currents in the same direction attract each other; with currents in opposite directions they repel.

### Magnetic flux

The magnetic flux through a flat area $A$ in a uniform field $B$ is

$$\Phi = BA\cos\theta,$$

where $\theta$ is the angle between the field and the normal to the area (the line perpendicular to its surface). Flux is measured in webers ($1\ \text{Wb} = 1\ \text{T m}^2$). It is greatest when the field passes straight through the surface and zero when the field lies along it.

### Electromagnetic induction

A changing magnetic flux through a circuit induces an electromotive force (emf). For a coil of $N$ turns, Faraday's law gives

$$\varepsilon = -N\frac{\Delta\Phi}{\Delta t}.$$

The flux can change because the field changes, because the area changes, or because the coil turns. A steady flux, however large, induces nothing. A straight rod of length $L$ moving at speed $v$ at right angles to a field $B$ has an emf $\varepsilon = BLv$ between its ends.

The minus sign expresses **Lenz's law**: the induced current flows in the direction that opposes the change producing it. Push the north pole of a magnet into a coil and the near end of the coil becomes a north pole, repelling the magnet. You must do work to push it in, and that work becomes electrical energy: Lenz's law is conservation of energy at work.

### Generators and transformers

A coil turning in a magnetic field has a flux through it that rises and falls, so it produces an alternating emf: this is a generator. A transformer has two coils wound on a shared iron core. An alternating current in the primary coil produces a changing flux in the core, which induces an emf in the secondary coil. For an ideal transformer

$$\frac{V_s}{V_p} = \frac{N_s}{N_p}, \qquad V_p I_p = V_s I_s.$$

A step-up transformer raises the voltage and lowers the current by the same factor; it does not create power. A transformer does not work with a steady direct current, because a steady current makes a steady flux. Electricity is transmitted at high voltage so that the current, and so the $I^2R$ heating in the cables, is small.
`,
  examples: [
    {
      id: 'example-wire-force',
      title: 'Force on a wire in a field',
      problemMd: md`A straight wire 0.50 m long carries a current of 4.0 A in a uniform magnetic field of 0.20 T. Find the force on the wire when it is (a) perpendicular to the field, (b) at $30^\circ$ to the field, (c) parallel to the field.`,
      steps: [
        md`(a) $\sin 90^\circ = 1$, so $F = BIL = 0.20 \times 4.0 \times 0.50 = 0.40\ \text{N}$.`,
        md`(b) $\sin 30^\circ = \frac{1}{2}$, so $F = 0.40 \times \frac{1}{2} = 0.20\ \text{N}$.`,
        md`(c) $\sin 0^\circ = 0$, so there is no force.`,
      ],
      answerMd: md`The forces are 0.40 N, 0.20 N and zero. Using $\cos 30^\circ$ in (b) gives about 0.35 N, the tempting wrong answer: in $BIL\sin\theta$ the angle is between the wire and the field.`,
    },
    {
      id: 'example-coil-emf',
      title: 'The emf from a falling field',
      problemMd: md`A coil of 100 turns, each of area $0.020\ \text{m}^2$, lies with its plane perpendicular to a uniform magnetic field. The field falls steadily from 0.50 T to 0.10 T in 0.20 s. Find the average induced emf, and the current if the coil's circuit has a total resistance of $2.0\ \Omega$.`,
      steps: [
        md`Flux through one turn: before, $0.50 \times 0.020 = 0.010\ \text{Wb}$; after, $0.10 \times 0.020 = 0.0020\ \text{Wb}$. The change is $\Delta\Phi = 0.0080\ \text{Wb}$.`,
        md`Faraday's law: $\varepsilon = N\frac{\Delta\Phi}{\Delta t} = 100 \times \frac{0.0080}{0.20} = 4.0\ \text{V}$.`,
        md`Check by a second route: the field changes at $\frac{0.40}{0.20} = 2.0\ \text{T/s}$, so $\varepsilon = NA\frac{\Delta B}{\Delta t} = 100 \times 0.020 \times 2.0 = 4.0\ \text{V}$.`,
        md`Current: $I = \frac{4.0}{2.0} = 2.0\ \text{A}$. By Lenz's law it flows so that its own field points the same way as the original field, opposing the decrease.`,
      ],
      answerMd: md`The average emf is 4.0 V and the current 2.0 A. Using only the final field, $100 \times \frac{0.0020}{0.20} = 1.0\ \text{V}$, is the tempting wrong answer: the emf comes from the change of flux, not from the flux itself.`,
    },
    {
      id: 'example-transformer',
      title: 'Stepping down the mains',
      problemMd: md`An ideal transformer has 1200 turns on its primary coil, connected to a 240 V alternating supply, and 60 turns on its secondary coil. What is the secondary voltage? If the secondary delivers 2.0 A, what current flows in the primary?`,
      steps: [
        md`Turns ratio: $V_s = 240 \times \frac{60}{1200} = 12\ \text{V}$.`,
        md`Power out: $12 \times 2.0 = 24\ \text{W}$. An ideal transformer loses nothing, so the power in is also 24 W.`,
        md`Primary current: $I_p = \frac{24}{240} = 0.10\ \text{A}$. Check with the inverse turns ratio: $2.0 \times \frac{60}{1200} = 0.10\ \text{A}$.`,
      ],
      answerMd: md`The secondary voltage is 12 V and the primary current 0.10 A. Scaling the current by the same factor of 20 as the voltage, the wrong way round, gives 40 A in the primary, which would draw 9600 W from the mains to deliver 24 W.`,
    },
  ],
  traps: [
    {
      title: 'Expecting a magnetic force to change the speed',
      md: md`A magnetic force on a moving charge is always perpendicular to its velocity, so it does no work. It can bend the path into a circle, but the speed and kinetic energy stay the same. Any option in which a magnetic field alone speeds up a charge is wrong.`,
    },
    {
      title: 'Expecting an emf from a steady field',
      md: md`A coil sitting still in a strong but constant field has no induced emf. Induction needs a change of flux: a changing field, a changing area or a change of orientation.`,
    },
    {
      title: 'Using the wrong angle',
      md: md`In $F = BIL\sin\theta$ and $F = qvB\sin\theta$, $\theta$ is the angle between the wire (or velocity) and the field. In $\Phi = BA\cos\theta$, $\theta$ is the angle between the field and the normal to the area. A coil whose plane is perpendicular to the field has the maximum flux.`,
    },
    {
      title: 'Thinking a step-up transformer creates power',
      md: md`Raising the voltage by a factor lowers the current by the same factor, so $VI$ stays the same in an ideal transformer, and is a little smaller in a real one. A transformer also needs alternating current; with steady direct current the secondary voltage is zero.`,
    },
  ],
  check: [
    {
      id: 'check-proton-in-field',
      title: 'A proton crossing a field',
      topic: 'Magnetism',
      stemMd: md`A proton (charge $1.6 \times 10^{-19}\ \text{C}$) moves at $2.0 \times 10^6\ \text{m/s}$ at right angles to a uniform magnetic field of 0.50 T. Which statement is correct?`,
      options: [
        { id: 'A', text: md`The force on it is zero, so it continues in a straight line.`, note: md`The force is zero only for motion along the field; here the motion is perpendicular to the field, where the force is greatest.` },
        { id: 'B', text: md`The force on it is $1.6 \times 10^{-13}\ \text{N}$, and it speeds up.`, note: md`The size is right, but a force perpendicular to the velocity does no work, so the speed cannot change.` },
        { id: 'C', text: md`The force on it is $1.6 \times 10^{-13}\ \text{N}$, and its speed stays constant.`, note: '' },
        { id: 'D', text: md`The force on it is $3.2 \times 10^{-13}\ \text{N}$, and its speed stays constant.`, note: md`This is $qv$ without the field; multiplying by $B = 0.50\ \text{T}$ halves it.` },
        { id: 'E', text: md`The force on it is $6.4 \times 10^{-13}\ \text{N}$, and its speed stays constant.`, note: md`Divides $qv$ by $B$ instead of multiplying by it.` },
      ],
      answer: 'C',
      workingMd: md`$F = qvB = 1.6 \times 10^{-19} \times 2.0 \times 10^6 \times 0.50 = 1.6 \times 10^{-13}\ \text{N}$. The force is perpendicular to the velocity, so it does no work: the proton moves in a circle at constant speed.`,
      lesson: 'A magnetic force on a moving charge bends its path but never changes its speed.',
    },
    {
      id: 'check-rotating-coil',
      title: 'Turning a coil in a field',
      topic: 'Electromagnetic induction',
      stemMd: md`A 50-turn coil of area $0.040\ \text{m}^2$ lies with its plane perpendicular to a uniform 0.30 T field. In 0.10 s it is turned so that its plane is parallel to the field. What is the average emf induced?`,
      options: [
        { id: 'A', text: md`0 V`, note: md`The field does not change, but the flux through the coil does, from $BA$ to zero; a change of flux is all that Faraday's law needs.` },
        { id: 'B', text: md`0.12 V`, note: md`Leaves out the 50 turns; each turn has this emf, and the turns add up.` },
        { id: 'C', text: md`0.60 V`, note: md`This is $N\,\Delta\Phi$, the change of flux linkage, not yet divided by the 0.10 s.` },
        { id: 'D', text: md`6.0 V`, note: '' },
        { id: 'E', text: md`12 V`, note: md`Treats the flux as reversing from $+BA$ to $-BA$, which would need a half turn; this quarter turn takes it from $BA$ to zero.` },
      ],
      answer: 'D',
      workingMd: md`The flux through one turn starts at $BA = 0.30 \times 0.040 = 0.012\ \text{Wb}$ and ends at zero. So $\varepsilon = N\frac{\Delta\Phi}{\Delta t} = 50 \times \frac{0.012}{0.10} = 6.0\ \text{V}$.`,
      lesson: 'Any change of flux induces an emf, whether the field, the area or the orientation changes.',
    },
    {
      id: 'check-ideal-transformer',
      title: 'An ideal step-up transformer',
      topic: 'Electromagnetic induction',
      stemMd: md`An ideal transformer has 200 turns on its primary coil and 1000 turns on its secondary coil. The primary is connected to a 24 V alternating supply and carries 5.0 A. What are the secondary voltage and current?`,
      options: [
        { id: 'A', text: md`4.8 V and 25 A`, note: md`Inverts the turns ratio; with more turns on the secondary, the voltage goes up and the current goes down.` },
        { id: 'B', text: md`120 V and 25 A`, note: md`Scales the current up with the voltage; the output power would be 3000 W from 120 W in.` },
        { id: 'C', text: md`120 V and 5.0 A`, note: md`Keeps the current unchanged; the output power would be 600 W, five times the input.` },
        { id: 'D', text: md`120 V and 1.0 A`, note: '' },
        { id: 'E', text: md`4.8 V and 1.0 A`, note: md`The current is right, but the voltage ratio is inverted: the coil with more turns has the larger voltage.` },
      ],
      answer: 'D',
      workingMd: md`$V_s = 24 \times \frac{1000}{200} = 120\ \text{V}$. The input power is $24 \times 5.0 = 120\ \text{W}$, and an ideal transformer delivers all of it, so $I_s = \frac{120}{120} = 1.0\ \text{A}$. Check: the current falls by the same factor of 5 by which the voltage rises.`,
      lesson: md`An ideal transformer changes voltage and current by inverse factors, keeping $VI$ the same.`,
    },
  ],
  takeaways: [
    md`The magnetic force on a moving charge is $qvB\sin\theta$, perpendicular to the velocity, so it does no work.`,
    md`A wire carrying a current $I$ across a field feels a force $BIL\sin\theta$.`,
    'Currents make magnetic fields: circles round a straight wire, a nearly uniform field inside a solenoid.',
    md`An emf is induced only while the flux changes, $\varepsilon = -N\frac{\Delta\Phi}{\Delta t}$, and the induced current opposes the change.`,
    md`An ideal transformer obeys $\frac{V_s}{V_p} = \frac{N_s}{N_p}$ and keeps $VI$ constant.`,
  ],
  flashcards: [
    { front: 'Force on a moving charge in a magnetic field', back: md`$F = qvB\sin\theta$, perpendicular to both $v$ and $B$; zero for motion along the field. It does no work.` },
    { front: 'Force on a current-carrying wire', back: md`$F = BIL\sin\theta$, with $\theta$ the angle between the wire and the field.` },
    { front: 'Field of a long straight wire', back: md`$B = \frac{\mu_0 I}{2\pi r}$; the field lines are circles round the wire, in the direction given by the right-hand grip rule.` },
    { front: 'Magnetic flux', back: md`$\Phi = BA\cos\theta$, in webers, with $\theta$ the angle between the field and the normal to the area.` },
    { front: "Faraday's and Lenz's laws", back: md`$\varepsilon = -N\frac{\Delta\Phi}{\Delta t}$; the induced current flows so as to oppose the change of flux that causes it.` },
    { front: 'The ideal transformer', back: md`$\frac{V_s}{V_p} = \frac{N_s}{N_p}$ and $V_pI_p = V_sI_s$. It works only with alternating current.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-electricity' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};
