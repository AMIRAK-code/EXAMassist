import { md, type Lesson } from '../../types';

export const solidGeometryAndScalingLesson: Lesson = {
  slug: 'solid-geometry-and-scaling',
  title: "Solid geometry and changes of scale",
  summary: "Choose a base and perpendicular height, separate exposed area from volume and recover a length scale from an area or volume ratio.",
  minutes: 20,
  objectives: [
    "Choose the dimensions needed for a volume.",
    "Count only the surfaces exposed after joining solids.",
    "Convert between length, area and volume scale factors.",
  ],
  teachMd: md`
### Imagine cutting the solid into layers

Place a rectangular box flat on the table. A layer one centimetre thick contains one cubic centimetre for every square centimetre of base. Stacking identical layers gives the volume (*volume*) as base area times height. Nothing requires the base to be a rectangle. The same argument works for a prism with a triangular end or a cylinder with a circular end. Pick two parallel ends of the same shape and measure the perpendicular separation between them.

A sloping edge can be much longer than that separation. Imagine pushing the top of a stack of cards sideways without changing the thickness of any card. The slanted stack occupies the same volume as the upright one because every horizontal layer still has the same area. If a diagram supplies a sloping length, look for a right triangle containing the perpendicular height before substituting into a formula.

A pyramid or cone tapers to a point. The formula for either is one third of the base area times the perpendicular height. The factor one third already accounts for all the shrinking cross-sections. In particular, halving the height remaining above a cut parallel to the base also halves each lateral dimension of the section there. Its area falls to one quarter. Treating the sections as if their areas decreased at a constant rate would give a different volume.

### Decide which faces are on the boundary

Surface area (*superficie*) counts the material needed for a skin. Imagine painting every accessible face of the finished object. A rectangular box has three pairs of equal faces. Multiplying the two lengths along a face measures one member of a pair. Double the sum of those three different products for a closed box. If the box is open at the top, remove just the missing face.

A cylinder's curved wall unwraps into a rectangle whose long side runs around the rim. Its dimensions are the circumference and the height. Add two circular discs for a closed cylinder or just one for a pot without a lid. For a right circular cone the curved wall uses the slant height instead. The flattened wall is a sector with arc length equal to the base circumference, giving lateral area $\pi r\ell$ when the slant height is $\ell$. This length and the vertical height play different roles.

### Scale one, two or three directions

Suppose a manufacturer makes a model with every length three times the corresponding original length. Along a straight edge three small rulers fit where one did before. Across a rectangular face there are three rows of three original rectangles. Inside a box there are three layers of nine original boxes. Accordingly a length factor $k$ gives an area factor $k^2$ and a volume factor $k^3$. Similar curved solids obey the same rules. For a sphere the formulas $4\pi r^2$ and $4\pi r^3/3$ display both powers directly.

To reverse the calculation, keep the direction of the ratio visible. A model with one eighth of the volume of a similar full-size object has half its lengths. If the question asks how much longer the original is, turn the ratio around after taking the cube root. Check whether the word “similar” is justified. Doubling just the height of a cylinder with fixed radius doubles its volume. Its curved wall doubles in area while its two ends keep their original areas.

### Check the units before comparing

Changing the unit of measurement also applies a scale factor. An edge one metre long has length one hundred centimetres. A square of side one metre contains one hundred rows of one hundred square centimetres. A cubic metre contains one hundred such layers of thickness one centimetre. Convert all lengths to one unit before multiplying them, or convert the final answer with the appropriate square or cube factor. Write the physical unit beside the number even if the options omit it.
`,
  examples: [
    {
      id: 'tapered-form',
      title: "Height inside a cone",
      problemMd: "A right circular cone has base radius 3 cm and slant height 5 cm. Find its volume.",
      steps: [
        "A vertical section through the axis gives a right triangle with legs 3 and the unknown height, and hypotenuse 5.",
        "By Pythagoras the height is 4 cm. Multiply the base area by this height and divide by three.",
      ],
      answerMd: md`The volume is $12\pi$ cubic centimetres. Using 5 as the vertical height would give $15\pi$.`,
    },
    {
      id: 'glued-blocks',
      title: "A joined surface",
      problemMd: "Two identical cubes of edge 3 cm are glued together along one full face each. What area can be painted?",
      steps: [
        "Separate cubes have twelve square faces in total.",
        "The joint hides two faces, leaving ten exposed squares of area 9 square centimetres each.",
      ],
      answerMd: "The paint covers 90 square centimetres.",
    },
  ],
  traps: [
    { title: "Counting a seam", md: "A seam can be visible around an edge while the faces meeting inside are hidden. Subtract the contact area twice when adding the surface areas of two closed solids." },
    { title: "Scaling only one dimension", md: "Check the wording for similarity before cubing a length ratio. A container made taller with its base fixed retains its original base area." },
  ],
  check: [
    {
      id: 'model-area',
      title: "Area from volume ratio",
      topic: "Plane and solid geometry",
      stemMd: "Two similar tanks have volumes in the ratio small to large of 8 to 125. What is their surface area ratio?",
      options: [
        { id: 'A', text: "2 to 5", note: "This is the ratio of corresponding lengths." },
        { id: 'B', text: "4 to 25", note: "" },
        { id: 'C', text: "8 to 125", note: "This repeats the volume ratio." },
        { id: 'D', text: "25 to 4", note: "This reverses the requested direction." },
        { id: 'E', text: "16 to 625", note: "This squares the area ratio a second time." },
      ],
      answer: 'B',
      workingMd: "Cube roots give corresponding lengths in the ratio 2 to 5. Squaring gives 4 to 25.",
      lesson: "Take the cube root before converting volume ratios to area ratios.",
    },
    {
      id: 'open-cylinder',
      title: "An open cylindrical cup",
      topic: "Plane and solid geometry",
      stemMd: "A cylinder of radius 2 cm and height 5 cm has a base and an open top. What is its total surface area in square centimetres?",
      options: [
        { id: 'A', text: md`$20\pi$`, note: "This counts only the curved wall." },
        { id: 'B', text: md`$24\pi$`, note: "" },
        { id: 'C', text: md`$28\pi$`, note: "This adds a lid as well as the base." },
        { id: 'D', text: md`$14\pi$`, note: "This uses half the circumference for the width of the curved wall." },
        { id: 'E', text: md`$4\pi$`, note: "This counts only the base of the cup." },
      ],
      answer: 'B',
      workingMd: md`The wall contributes $2\pi(2)(5)=20\pi$ and the base adds $4\pi$. Their sum is $24\pi$.`,
      lesson: "Count the circular faces specified in the problem.",
    },
    {
      id: 'pyramid-capacity',
      title: "A square pyramid",
      topic: "Plane and solid geometry",
      stemMd: "A pyramid has a square base of side 6 m and perpendicular height 4 m. What is its volume in cubic metres?",
      options: [
        { id: 'A', text: "8", note: "This uses the side length in place of the base area." },
        { id: 'B', text: "36", note: "This gives the base area alone." },
        { id: 'C', text: "48", note: "" },
        { id: 'D', text: "72", note: "This halves the enclosing prism as for a triangular cross-section." },
        { id: 'E', text: "144", note: "This gives the full prism volume." },
      ],
      answer: 'C',
      workingMd: "The base has area 36 square metres. Multiply by 4 and divide by 3 to get 48 cubic metres.",
      lesson: "Tapering to a single apex introduces the factor one third.",
    },
  ],
  takeaways: [
    "Choose a base and measure its perpendicular height.",
    "Trace the exposed boundary before adding face areas.",
    "Square a length factor for areas and cube it for volumes.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-mathematics', skill: 'tolci-math-geometry' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
