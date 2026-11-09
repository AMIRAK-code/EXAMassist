import { md, type Lesson } from '../../types';

export const linesAndAnglesLesson: Lesson = {
  slug: 'lines-and-angles',
  title: 'Lines and angles: vertical angles, parallels and transversals',
  summary: 'Find unknown angles from straight lines, crossing lines and parallels cut by a transversal, and read a figure for what it states, not what it looks like.',
  minutes: 18,
  objectives: [
    'Use straight-line, vertical-angle and full-turn sums to find unknown angles.',
    'Decide whether two angles formed by parallel lines and a transversal are equal or supplementary.',
    'Use the triangle angle sum and the exterior-angle rule inside a larger figure.',
    'Separate what a figure states from what it only appears to show.',
  ],
  teachMd: md`
### The angles that come for free

Angles on the GRE are measured in degrees. A full turn is $360^\circ$, a straight line is $180^\circ$ and a right angle is $90^\circ$. Two angles that together make a straight line are **supplementary** (they add to $180^\circ$); two that together make a right angle are **complementary** (they add to $90^\circ$). Almost every angle question is solved by spotting one of these sums, never by measuring.

When two lines cross they form four angles. The two angles opposite each other are **vertical angles**, and they are always equal. The reason is short: neighbours $a$ and $b$ lie along one line, so $a + b = 180^\circ$; neighbours $b$ and $c$ lie along the other, so $b + c = 180^\circ$; subtract and $a = c$. So if one of the four angles is $70^\circ$, going round the point they are $70^\circ$, $110^\circ$, $70^\circ$, $110^\circ$.

The same idea scales up. When three lines pass through one point they form six angles, and opposite angles are again equal, so the six come as $a, b, c, a, b, c$ and $a + b + c = 180^\circ$.

### Parallel lines cut by a transversal

Picture two horizontal parallel lines, with a third line, the **transversal**, slanting across both. Because the parallels point the same way, the transversal crosses each of them at the same tilt. The four angles at the upper crossing are exact copies of the four at the lower crossing.

That gives the one fact worth remembering: unless the transversal is perpendicular to the parallels, all eight angles come in only **two sizes**, an acute angle $x^\circ$ and an obtuse angle $(180 - x)^\circ$.

| Pair of angles | Where they sit | Relationship |
| --- | --- | --- |
| Corresponding | same position at each crossing (both above and to the right, say) | equal |
| Alternate interior | between the parallels, on opposite sides of the transversal | equal |
| Alternate exterior | outside the parallels, on opposite sides of the transversal | equal |
| Same-side interior | between the parallels, on the same side of the transversal | supplementary |

You do not need the names to answer questions. You need the shortcut: **two angles that are both acute, or both obtuse, are equal; one acute and one obtuse add to $180^\circ$.** The rule also runs backwards: if a pair of corresponding angles is equal, the two lines are parallel. A line perpendicular to one of two parallel lines is perpendicular to the other as well.

### Triangles enter early

The angles of any triangle add to $180^\circ$. Parallel lines explain why: through one vertex draw the line parallel to the opposite side. The two angles at the ends of that side reappear at the vertex as alternate interior angles, and together with the triangle's third angle they fill a straight line.

An **exterior angle** is formed by extending one side of a triangle past a vertex. It equals the sum of the two interior angles that are not next to it (the remote interior angles). If a triangle has angles of $50^\circ$ and $60^\circ$, the exterior angle at the third vertex is $110^\circ$; check it with the long route, since the third interior angle is $70^\circ$ and $180 - 70 = 110$.

### Reading a figure

In these lessons every figure is described in words: which points lie on which lines, what is parallel, and which lengths and angles are given. Read any figure the same way. A figure reliably shows position (which point lies on which line, which region is inside which), but its appearance proves no size. Two lines that look parallel are parallel only if the question says so or gives angles that force it. An angle that looks like a right angle is $90^\circ$ only if that is stated or marked.

A note that a figure is **not drawn to scale** is a warning that the drawing may suggest a relationship the given facts do not support. Before you trust the look of a figure, ask whether a second figure that matches every stated fact could look different. In a quantitative comparison, if two such figures reverse the comparison, the relationship cannot be determined.

### Chains of small facts

The GRE does not ask you to write proofs, but the reasoning behind proofs is exactly how unknown angles are found: start from a given angle, take one step (vertical, supplementary, parallel or triangle sum), write the new angle into the figure, and repeat. Writing each angle down as soon as you know it keeps a four-step chain from turning into guesswork.
`,
  examples: [
    {
      id: 'example-alternate-exterior',
      title: 'Two expressions on parallel lines',
      problemMd: md`Lines $\ell$ and $m$ are parallel and horizontal, with $\ell$ above $m$. A transversal $t$ slants across both. At the crossing with $\ell$, the angle above $\ell$ and to the right of $t$ measures $(3x + 10)^\circ$. At the crossing with $m$, the angle below $m$ and to the left of $t$ measures $(5x - 30)^\circ$. Find $x$ and the size of each angle.`,
      steps: [
        md`Move the second angle to the upper crossing. Below $m$ and left of $t$ is vertical to the angle above $m$ and right of $t$, and that angle corresponds to the angle above $\ell$ and right of $t$. So the two given angles are equal (they are alternate exterior angles).`,
        md`Set them equal: $3x + 10 = 5x - 30$, so $2x = 40$ and $x = 20$.`,
        md`Each angle is $3(20) + 10 = 70^\circ$; check with the other expression, $5(20) - 30 = 70^\circ$.`,
        md`Sanity check with the shortcut: both angles are acute, so equal is the right relationship.`,
      ],
      answerMd: md`$x = 20$ and both angles measure $70^\circ$. Treating them as supplementary, $3x + 10 + 5x - 30 = 180$, gives the tempting wrong value $x = 25$, which would make the angles $85^\circ$ and $95^\circ$, one acute and one obtuse, contradicting the positions.`,
    },
    {
      id: 'example-exterior-angle',
      title: 'An exterior angle of a triangle',
      problemMd: md`In triangle $PQR$, angle $P$ measures $48^\circ$ and angle $Q$ measures $67^\circ$. Side $QR$ is extended beyond $R$ to a point $S$. What is the measure of angle $PRS$?`,
      steps: [
        md`Angle $PRS$ is the exterior angle at $R$. Its remote interior angles are the angles at $P$ and $Q$.`,
        md`Exterior-angle rule: $\angle PRS = 48^\circ + 67^\circ = 115^\circ$.`,
        md`Check by the long route: angle $PRQ$ is $180 - 48 - 67 = 65^\circ$, and $PRS$ lies on a straight line with it, so $PRS = 180 - 65 = 115^\circ$.`,
      ],
      answerMd: md`Angle $PRS$ measures $115^\circ$. The tempting slip is to stop at the interior angle, $65^\circ$.`,
    },
    {
      id: 'example-three-lines',
      title: 'Three lines through one point',
      problemMd: md`Three straight lines pass through point $O$, forming six angles. Going clockwise from the top, the first two angles measure $40^\circ$ and $75^\circ$. What is the measure of the third angle, and of the largest of the six?`,
      steps: [
        md`Opposite angles are vertical angles, so the six angles in order are $a, b, c, a, b, c$, with $a = 40$ and $b = 75$.`,
        md`The six angles fill a full turn: $2(a + b + c) = 360$, so $a + b + c = 180$ and $c = 180 - 40 - 75 = 65^\circ$.`,
        md`The angles are $40^\circ, 75^\circ, 65^\circ, 40^\circ, 75^\circ, 65^\circ$, which add to $360^\circ$ as they must.`,
      ],
      answerMd: md`The third angle is $65^\circ$ and the largest is $75^\circ$. Subtracting from $360$ instead of $180$ ($360 - 115 = 245$) is the slip: three consecutive angles only make half a turn.`,
    },
  ],
  traps: [
    {
      title: 'Assuming lines are parallel because they look it',
      md: md`The equal-or-supplementary rules hold only for lines stated to be parallel. If the question gives no such statement and no angle pair that forces it, two nearly parallel lines are just two lines, and none of the eight angles can be copied across.`,
    },
    {
      title: 'Equal when the angles should be supplementary',
      md: md`Setting two expressions equal is automatic, and it is wrong half the time. Before writing the equation, decide whether the two angles are of the same kind (both acute or both obtuse, so equal) or of different kinds (so they add to $180^\circ$). If your solution makes one angle acute and the other obtuse while you set them equal, the equation was wrong.`,
    },
    {
      title: 'Trusting the drawing',
      md: md`A triangle that looks isosceles, an angle that looks right, a point that looks like a midpoint: none of these is information. When a figure is not drawn to scale, the drawing may have been made to suggest exactly the relationship you are tempted to assume. Use only stated facts and what follows from them.`,
    },
    {
      title: 'Half a turn or a full turn',
      md: md`Angles around a point add to $360^\circ$; angles along one side of a straight line add to $180^\circ$. With three or more lines through a point, three consecutive angles cover only half the turn.`,
    },
  ],
  check: [
    {
      id: 'check-same-side-interior',
      title: 'Same side, between the parallels',
      topic: 'Parallel and perpendicular lines',
      stemMd: md`Lines $j$ and $k$ are parallel and horizontal, with $j$ above $k$. A transversal $t$ crosses both. The angle below $j$ and to the right of $t$ measures $2y^\circ$. The angle above $k$ and to the right of $t$ measures $(y + 36)^\circ$. What is the value of $y$?`,
      options: [
        { id: 'A', text: md`$18$`, note: md`Sets the two angles to add to $90^\circ$ instead of $180^\circ$: $3y + 36 = 90$.` },
        { id: 'B', text: md`$36$`, note: md`Sets the two angles equal. They lie between the parallels on the same side of the transversal, so they are supplementary, not equal.` },
        { id: 'C', text: md`$48$`, note: '' },
        { id: 'D', text: md`$84$`, note: md`This is the measure of the angle $(y + 36)^\circ$, not the value of $y$.` },
        { id: 'E', text: md`$96$`, note: md`This is the measure of the angle $2y^\circ$, not the value of $y$.` },
      ],
      answer: 'C',
      workingMd: md`Both angles lie between $j$ and $k$ on the right of $t$: same-side interior angles, which are supplementary. So $2y + (y + 36) = 180$, giving $3y = 144$ and $y = 48$. Check: the angles are $96^\circ$ and $84^\circ$, one obtuse and one acute, adding to $180^\circ$.`,
      lesson: 'Decide equal or supplementary from the positions before you write the equation.',
    },
    {
      id: 'check-exterior-not-to-scale',
      title: 'An exterior angle and a misleading sketch',
      topic: 'Quantitative Comparison',
      stemMd: md`In triangle $ABC$, side $BC$ is extended beyond $C$ to point $D$, and angle $ACD$ measures $130^\circ$. The figure, which is not drawn to scale, shows angles $A$ and $B$ looking about the same size.

**Quantity A:** the measure of angle $A$, in degrees

**Quantity B:** $65$`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: md`True for some triangles (angle $A = 80^\circ$, angle $B = 50^\circ$), but not for all that fit the facts.` },
        { id: 'B', text: 'Quantity B is greater.', note: md`True for some triangles (angle $A = 50^\circ$, angle $B = 80^\circ$), but not for all that fit the facts.` },
        { id: 'C', text: 'The two quantities are equal.', note: md`Assumes angles $A$ and $B$ are equal because the sketch shows them alike. Nothing stated makes the triangle isosceles.` },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: '' },
      ],
      answer: 'D',
      workingMd: md`By the exterior-angle rule, $A + B = 130^\circ$. Nothing else is given, so $A$ can be any value between $0^\circ$ and $130^\circ$. With $A = 80^\circ$ Quantity A is greater; with $A = 50^\circ$ Quantity B is greater. Two valid figures give opposite results, so the relationship cannot be determined.`,
      lesson: 'In a comparison with a figure not drawn to scale, look for two figures that fit every stated fact but reverse the result.',
    },
    {
      id: 'check-six-angles',
      title: 'Six angles around a point',
      topic: 'Angle measurement in degrees',
      stemMd: md`Three straight lines pass through one point, forming six angles. Going round the point, three consecutive angles measure $x^\circ$, $2x^\circ$ and $3x^\circ$. What is the measure of the largest of the six angles?`,
      options: [
        { id: 'A', text: md`$30^\circ$`, note: md`This is $x$, the smallest angle, not the largest.` },
        { id: 'B', text: md`$60^\circ$`, note: md`This is $2x$; the largest angle is $3x$.` },
        { id: 'C', text: md`$90^\circ$`, note: '' },
        { id: 'D', text: md`$150^\circ$`, note: md`This is two neighbouring angles together, $2x + 3x$, not a single one of the six.` },
        { id: 'E', text: md`$180^\circ$`, note: md`Comes from setting $x + 2x + 3x = 360$. Three consecutive angles fill only half a turn, because the other three are their vertical angles.` },
      ],
      answer: 'C',
      workingMd: md`The six angles are $x, 2x, 3x$ followed by their vertical angles $x, 2x, 3x$. So $2(x + 2x + 3x) = 360$, giving $6x = 180$ and $x = 30$. The largest angle is $3x = 90^\circ$.`,
      lesson: 'With several lines through one point, pair each angle with its vertical angle before you add.',
    },
  ],
  takeaways: [
    md`Straight line $180^\circ$, full turn $360^\circ$, vertical angles equal.`,
    'With parallel lines and a transversal, same-kind angles are equal and an acute-obtuse pair is supplementary.',
    md`Triangle angles add to $180^\circ$; an exterior angle equals the two remote interior angles together.`,
    'A figure shows position, not size: use only stated facts.',
  ],
  practice: { examKey: 'gre', domain: 'quant-geometry', skill: 'geom-parallel-perpendicular-lines' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
