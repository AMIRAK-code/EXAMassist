import { md, type Lesson } from '../../types';

export const planeGeometryTrianglesAndCirclesLesson: Lesson = {
  slug: 'plane-geometry-triangles-and-circles',
  title: 'Plane geometry with triangles and circles',
  summary: 'Match similar triangles, use projections in a right triangle, and connect chords, tangents and angles to the arc they intercept.',
  minutes: 18,
  objectives: [
    'Identify corresponding sides in similar triangles.',
    'Calculate a right triangle’s altitude and projections.',
    'Use circle angles and segment products with the correct arc or whole secant.'
  ],
  teachMd: md`### Mark relationships before lengths

In a geometry description, a word such as tangent, diameter or parallel can be worth an entire extra equation. Start by naming the points and writing down what that word guarantees. Draw a rough sketch with room to label the segments. Its appearance need not be to scale. Reserve right-angle marks for a stated perpendicular or one that follows from a theorem. A triangle with a nearly horizontal side and a nearly vertical side in your sketch may have no right angle at all.

The three interior angles of a triangle sum to a straight angle. A pair of equal angles in two triangles, together with a second equal pair, fixes the third pair and proves similarity (*similitudine*). Similar triangles have one common scale factor for corresponding side lengths. Write the vertex names in matching order before forming a ratio. In particular, the side opposite the largest angle must match the side opposite the largest angle in the other triangle. This check catches a fraction written the wrong way round in just one of the two triangles.

### Drop an altitude to the hypotenuse

In a right triangle, Pythagoras relates the squares of its legs to the square of its hypotenuse. The hypotenuse lies opposite the right angle, so locate it before inserting numbers. Now draw the perpendicular from the right angle to the hypotenuse. Each of the two smaller triangles is similar to the original because it has a right angle and shares an acute angle with the original triangle. They are therefore similar to each other as well.

Let the two pieces of the hypotenuse have lengths $p$ and $q$ and let the altitude have length $h$. Corresponding sides in the two smaller triangles give $p/h=h/q$, hence $h^2=pq$. Each original leg also satisfies a projection rule: its square equals the whole hypotenuse times the adjacent piece of the hypotenuse. Decide which piece touches the endpoint of the leg you need. The larger leg must correspond to the larger projection. These two square relations are often called Euclid's theorems (*teoremi di Euclide*) for a right triangle.

### Name the intercepted arc

A chord (*corda*) joins two points on a circle. A central angle has its vertex at the centre. An inscribed angle has its vertex on the circumference and its sides meet the circle again at the chord's endpoints. Follow the arc between those endpoints which does not contain the inscribed angle's vertex. The inscribed angle measures half the central angle sweeping that same arc. A minor arc and a major arc can share exactly the same endpoints, so endpoints alone do not tell you which central angle to use.

A diameter intercepts a semicircle, whose central angle is a straight angle. The corresponding inscribed angle is therefore a right angle anywhere on the opposite semicircle, away from the endpoints. If the chord falls short of being a diameter, an inscribed triangle need not be right-angled. A tangent (*tangente*) touches the circle at one point and is perpendicular there to the radius. This gives another reliable way to establish a right angle without trusting the sketch.

### Match the parts in a segment product

For two chords intersecting inside a circle, the product of the two pieces of one chord equals the product of the two pieces of the other. The relation follows by matching angles in two triangles formed by the intersecting chords. For a point outside the circle with a tangent and a secant, the tangent length squared equals the outside part of the secant times its *whole* length. Mark the far endpoint before adding the outside and inside pieces. Both sides of either product represent length squared. If the final question asks for a length after solving a square equation, take the positive square root and give ordinary length units.`,
  examples: [
    {
      id: 'example-1',
      title: 'Right-angle projections',
      problemMd: 'An altitude from the right angle divides the hypotenuse into lengths 4 cm and 9 cm. Find the altitude and the leg adjacent to the shorter piece.',
      steps: [
        md`The altitude satisfies $h^2=4\times9=36$, giving 6 cm.`,
        md`The whole hypotenuse measures 13 cm. The requested leg has square $13\times4=52$.`
      ],
      answerMd: md`The altitude is 6 cm and the leg is $2\sqrt{13}$ cm. Using nine for the leg would give the longer leg instead.`
    },
    {
      id: 'example-2',
      title: 'One chord, two arcs',
      problemMd: md`A chord bounds a minor arc of $112^\circ$. Find the angle it subtends at a point on that minor arc.`,
      steps: [
        'The vertex belongs to the minor arc, so the angle intercepts the other arc between the chord\'s endpoints.',
        md`The other arc measures $360^\circ-112^\circ=248^\circ$. Halve that measure.`
      ],
      answerMd: md`The inscribed angle is $124^\circ$. Halving the minor arc would answer for a vertex on the major arc.`
    }
  ],
  traps: [
    {
      title: 'Swapping the projection',
      md: 'Choose the hypotenuse piece touching the leg\'s endpoint. Multiplying by the other piece calculates the other leg\'s square.'
    },
    {
      title: 'Using only the inside secant segment',
      md: 'For tangents from an outside point the secant product uses outside and whole lengths. Add the inside piece to the outside piece to reach the far endpoint.'
    }
  ],
  check: [
    {
      id: 'check-1',
      title: 'An external tangent',
      topic: 'Plane geometry',
      stemMd: 'From a point outside a circle a secant travels 3 cm before entering and another 9 cm before leaving. How long is the tangent segment from that point?',
      options: [
        {
          id: 'A',
          text: md`$3\sqrt3$ cm`,
          note: 'This multiplies the outside part by the inside part and then takes the root.'
        },
        {
          id: 'B',
          text: '6 cm',
          note: ''
        },
        {
          id: 'C',
          text: '12 cm',
          note: 'Twelve is the whole secant length, which is longer than the tangent.'
        },
        {
          id: 'D',
          text: '36 cm',
          note: 'This is the numerical value of the tangent length squared.'
        },
        {
          id: 'E',
          text: '9 cm',
          note: 'Nine measures the portion of the secant inside the circle.'
        }
      ],
      answer: 'B',
      workingMd: md`The whole secant measures twelve centimetres. The tangent's square is $3\times12=36$ square centimetres, so it measures six centimetres.`,
      lesson: 'Use the far endpoint when measuring a whole secant.'
    },
    {
      id: 'check-2',
      title: 'Two chords',
      topic: 'Plane geometry',
      stemMd: 'Chords cross inside a circle. One is split into 2 cm and 14 cm, the other into 4 cm and an unknown length. What is the unknown length?',
      options: [
        {
          id: 'A',
          text: '4 cm',
          note: 'Equal products do not require equal parts on each chord.'
        },
        {
          id: 'B',
          text: '12 cm',
          note: 'This equates total chord lengths rather than the products of pieces.'
        },
        {
          id: 'C',
          text: '28 cm',
          note: 'This is the numerical product for the first chord, before division by four.'
        },
        {
          id: 'D',
          text: '7 cm',
          note: ''
        },
        {
          id: 'E',
          text: '8 cm',
          note: 'This halves the first chord’s length as though the crossing point bisected it.'
        }
      ],
      answer: 'D',
      workingMd: md`If the missing length in centimetres is $s$, then $4s=2\times14=28$. Dividing gives $s=7$.`,
      lesson: 'Multiply the two pieces belonging to the same chord.'
    },
    {
      id: 'check-3',
      title: 'A corresponding leg',
      topic: 'Plane geometry',
      stemMd: 'Two similar right triangles have hypotenuses of 10 mm and 25 mm. The smaller has a leg of 6 mm. How long is the corresponding leg in the larger?',
      options: [
        {
          id: 'A',
          text: '15 mm',
          note: ''
        },
        {
          id: 'B',
          text: '21 mm',
          note: 'This adds the hypotenuse difference to the leg instead of using a scale factor.'
        },
        {
          id: 'C',
          text: md`$12/5$ mm`,
          note: 'This uses the reciprocal scale factor and shrinks the smaller leg.'
        },
        {
          id: 'D',
          text: '20 mm',
          note: 'This is the larger triangle’s other leg, corresponding to the smaller leg of eight.'
        },
        {
          id: 'E',
          text: '25 mm',
          note: 'This reports the supplied larger hypotenuse rather than its corresponding leg.'
        }
      ],
      answer: 'A',
      workingMd: md`The scale from smaller to larger is $25/10=5/2$. Multiply six by five halves to obtain fifteen millimetres.`,
      lesson: 'Use one orientation for every ratio of corresponding lengths.'
    }
  ],
  takeaways: [
    'Write corresponding vertices in the same order.',
    'A leg squared equals the hypotenuse times its adjacent projection.',
    'An inscribed angle intercepts the arc away from its vertex.',
    'An exterior secant product uses the outside segment and the whole secant.'
  ],
  practice: {
    examKey: 'tolc-i',
    domain: 'tolci-mathematics',
    skill: 'tolci-math-geometry'
  },
  review: {
    aiAssisted: true,
    independentCheckOn: '2026-11-10',
    expertReview: null
  }
};
