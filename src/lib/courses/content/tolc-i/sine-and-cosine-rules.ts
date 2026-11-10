import { md, type Lesson } from '../../types';

export const sineAndCosineRulesLesson: Lesson = {
  slug: 'sine-and-cosine-rules',
  title: "The sine and cosine rules for triangles",
  summary: "Match sides to opposite angles, choose a triangle rule from the known measurements and find an area without calculating a height.",
  minutes: 20,
  objectives: [
    "Choose a sine or cosine rule from the given measurements.",
    "Recognise when an angle has two possible values.",
    "Find area from two sides and the angle between them.",
  ],
  teachMd: md`
### Label opposite pairs before calculating

Draw a rough triangle and place a capital letter at each corner. Give the side opposite each corner the corresponding lower-case letter. A side can meet two angles, but it belongs to just one opposite pair. The longest side faces the largest angle. This gives a check on a numerical answer even if your sketch differs greatly from the triangle's true shape. A sketch with an acute-looking corner can still represent an obtuse angle when the problem gives no restriction on that corner.

The sine rule (*teorema dei seni*) relates opposite pairs. Its form $a/\sin A=b/\sin B=c/\sin C$ means that any two of the ratios are equal. One way to see why is to draw the altitude from the third vertex down to the line joining the first two vertices. The altitude is both $b\sin A$ and $a\sin B$. Equating the heights and rearranging gives the first pair of ratios. The same argument on another base supplies the third.

### Read the available measurements

If two angles and any side are given, subtract the angles from a straight angle to find the third. You now know which angle faces the supplied side, so its ratio sets the scale for every remaining side. Keep radicals and fractions in exact form until the end. In particular, if one angle is twice another their sines do not generally stand in a two-to-one ratio. It is the sines themselves that determine the side ratio.

If two sides and an angle opposite one of them are given, the sine rule first gives the sine of another angle. A positive sine below one may correspond to an acute or an obtuse angle. These two candidates are supplementary. Add each to the already known angle and keep only those that leave a positive third angle. Sometimes both triangles fit. A computed sine exceeding one means there is no triangle with the stated measurements. A sine equal to one forces a right angle and leaves no second candidate.

### Work from an included angle or three sides

The cosine rule (*teorema di Carnot*) uses two sides and the angle between them to find the opposite side. Written $c^2=a^2+b^2-2ab\cos C$, it reduces to Pythagoras when the included angle is right. When that angle is acute the cosine is positive, making the opposite side shorter than the hypotenuse of a right triangle with those same two adjacent sides. An obtuse angle has negative cosine, so subtracting the correction increases the result. Remember to take the positive square root when a length is requested.

If all three sides are known, rearrange the same formula for the cosine of the angle you need. The square of the opposite side is the term to subtract from the sum of the other two squares. Choosing the longest side first lets you classify the whole triangle. A negative cosine for the largest angle makes the triangle obtuse, zero makes it right and a positive cosine makes every angle acute. The three given lengths must still satisfy the triangle inequality before any angle calculation makes sense.

### Use the included angle for area

Area is half the base times the perpendicular height. If the base has length $a$ and the adjoining side length $b$ makes angle $C$ with it, the perpendicular height is $b\sin C$. The resulting area is $ab\sin C/2$. For an obtuse included angle the foot of the perpendicular falls outside the segment, but its height remains positive. Supplementary angles give the same sine, so changing the included angle to its supplement leaves the area unchanged for the same adjacent sides. The opposite side generally changes. This difference explains how two triangles can enclose equal areas while having different perimeters.
`,
  examples: [
    {
      id: 'bridge-bars',
      title: "An obtuse joint",
      problemMd: md`Two rods of lengths 3 m and 5 m meet at $120^\circ$. How far apart are their free ends?`,
      steps: [
        md`The required segment faces the included angle. Use the cosine rule with $\cos120^\circ=-1/2$.`,
        md`The squared distance is $9+25-2(3)(5)(-1/2)=49$.`,
      ],
      answerMd: "The ends are 7 m apart. Substituting a positive cosine would incorrectly shorten the span.",
    },
    {
      id: 'two-possible',
      title: "Matching a sine twice",
      problemMd: md`In a triangle $A=30^\circ$, $a=4$ and $b=4\sqrt3$. Which values of $B$ are possible?`,
      steps: [
        md`The sine rule gives $\sin B=b\sin A/a=\sqrt3/2$.`,
        md`The candidates are $60^\circ$ and $120^\circ$. With $A=30^\circ$ the remaining angle is respectively $90^\circ$ or $30^\circ$.`,
      ],
      answerMd: md`Both $60^\circ$ and $120^\circ$ are possible. Both leave a positive third angle.`,
    },
  ],
  traps: [
    { title: "Pairing neighbours in the sine rule", md: "A side's letter belongs to the corner across from it. Mark each opposite pair on the sketch before writing ratios." },
    { title: "Measuring area with the wrong angle", md: "The angle in the two-side area formula must lie between the two lengths you multiply. Relabel the triangle or find another side if necessary." },
  ],
  check: [
    {
      id: 'enclosed-area',
      title: "Area at a joint",
      topic: "Trigonometry",
      stemMd: md`Two sides of a triangle have lengths 8 and 5, with included angle $150^\circ$. What is the area?`,
      options: [
        { id: 'A', text: "20", note: "This omits the sine while still halving the rectangle." },
        { id: 'B', text: "40", note: "This multiplies just the two lengths." },
        { id: 'C', text: "10", note: "" },
        { id: 'D', text: md`$10\sqrt3$`, note: "This uses the magnitude of the cosine instead of the sine." },
        { id: 'E', text: "5", note: "This halves the area a second time." },
      ],
      answer: 'C',
      workingMd: md`The sine of $150^\circ$ equals $1/2$. The area is $(8)(5)(1/2)/2=10$.`,
      lesson: "Use half the product of two sides and the sine of their included angle.",
    },
    {
      id: 'unknown-side',
      title: "Side opposite sixty degrees",
      topic: "Trigonometry",
      stemMd: md`A triangle has side 6 opposite $30^\circ$. How long is the side opposite $60^\circ$?`,
      options: [
        { id: 'A', text: md`$3\sqrt3$`, note: "This multiplies by the sine of sixty degrees without dividing by the known sine." },
        { id: 'B', text: md`$6\sqrt3$`, note: "" },
        { id: 'C', text: "12", note: "This doubles the side because the angle doubled." },
        { id: 'D', text: md`$2\sqrt3$`, note: "This reverses the sine ratio." },
        { id: 'E', text: "6", note: "Equal sides would require equal opposite angles." },
      ],
      answer: 'B',
      workingMd: md`The scale is $6/\sin30^\circ=12$. Multiplying by $\sin60^\circ=\sqrt3/2$ gives $6\sqrt3$.`,
      lesson: "Fix the scale with a complete opposite pair.",
    },
    {
      id: 'angle-type',
      title: "Largest angle",
      topic: "Trigonometry",
      stemMd: "A triangle has sides 4, 6 and 8. What is the cosine of its largest angle?",
      options: [
        { id: 'A', text: md`$1/4$`, note: "This takes the magnitude and loses the obtuse angle's sign." },
        { id: 'B', text: md`$-1/2$`, note: "This omits the factor two in the denominator." },
        { id: 'C', text: md`$3/4$`, note: "This divides two side lengths as if the triangle were right." },
        { id: 'D', text: md`$-1/4$`, note: "" },
        { id: 'E', text: md`$0$`, note: "This would require the two smaller squares to sum to the largest square." },
      ],
      answer: 'D',
      workingMd: md`The angle faces side 8. Its cosine is $(16+36-64)/(2\cdot4\cdot6)=-12/48=-1/4$.`,
      lesson: "Subtract the square of the side opposite the required angle.",
    },
  ],
  takeaways: [
    "Label each angle with its opposite side.",
    "Use the cosine rule for two sides and their included angle.",
    "Check both supplementary candidates when recovering an angle from its sine.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-mathematics', skill: 'tolci-math-trigonometry' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
