import { md, type Lesson } from '../../types';

export const mechanicsLesson: Lesson = {
  slug: "vectors-motion-and-inclined-planes",
  title: "Vectors, motion and inclined planes",
  summary: "Read motion graphs and resolve forces along a slope to find a moving object's acceleration, including the effects of tension and friction.",
  minutes: 20,
  objectives: [
    "Read displacement and acceleration from motion graphs.",
    "Resolve weight along a tilted surface.",
    "Use signed forces to predict a change of velocity.",
  ],
  teachMd: md`
### Choose a positive direction

Suppose a trolley moves east, slows down, then rolls west. A watch and a metre scale give you everything you need to describe this motion, provided you say which way counts as positive. Choose east. Position is the coordinate you read from the scale. Displacement (*spostamento*) is final position minus initial position. A trolley can travel a considerable distance and still have zero displacement if it ends where it started. Distance adds the lengths of all the pieces of its journey.

Velocity tells you how quickly position changes and in which direction. Average velocity is displacement divided by elapsed time. Speed is the magnitude of velocity at an instant, and average speed is total distance divided by elapsed time. To see why the distinction matters, imagine walking three metres east and one metre west in four seconds. Your average velocity is half a metre per second east. Your average speed is one metre per second, since your feet have covered four metres.

### Read the axes before the line

On a position–time graph, choose two points on a straight segment and divide the change in position by the change in time. The slope gives velocity. A horizontal segment describes a stationary object, even if it lies far above the horizontal axis. A straight segment sloping down describes constant negative velocity. On a curve, a tangent gives instantaneous velocity. Two points separated by a long time give only an average over that interval.

On a velocity–time graph a horizontal segment describes constant velocity. The slope now gives acceleration (*accelerazione*), while the signed area between the line and the time axis gives displacement. Split straight-edged regions into rectangles and triangles. Areas below the axis count negatively towards displacement and positively towards distance. If a line crosses the axis, split it there before adding distances. The object can have zero velocity at the crossing while the sloping line still gives a non-zero acceleration.

### Draw the forces acting on one body

Newton's second law connects the forces on a body with its acceleration. Draw the body alone and label each external interaction. Earth pulls it down through its weight, with magnitude $mg$. A smooth surface pushes perpendicular to itself. A taut string pulls along its own length. A rough surface can exert a frictional force along the surface. Kinetic friction opposes sliding relative to the surface. The reaction force that the body exerts on a support acts on the support, so leave it off the diagram of the body.

Choose axes to match the allowed motion. For a block on an inclined plane (*piano inclinato*), take one axis down the slope and the other perpendicular to it. If the slope makes an angle $\theta$ with the horizontal, the downhill component of weight is $mg\sin\theta$. The component pressing into the plane is $mg\cos\theta$. Picture gradually lowering the ramp. On the level the downhill component vanishes, and the perpendicular component equals the whole weight. This thought experiment recovers the correct choice of sine and cosine.

### Turn the force diagram into a prediction

Add the signed components along the slope. For a sliding block moving downhill with a string pulling uphill, tension and kinetic friction both enter with a minus sign when downhill is positive. Divide the net force by mass to find acceleration. The perpendicular acceleration is zero while the block follows a straight ramp. The normal reaction then balances the forces pressing into the surface. A string at an angle to the ramp would affect this balance as well as the downhill sum.

Check the signs against the motion before stating the result. A negative acceleration means the velocity changes towards the negative direction each second. A block travelling uphill with downhill acceleration slows during its climb and may reverse later. At an instant of rest the forces still determine what happens next. If friction is present, decide whether static friction can hold the block before applying a sliding-friction model. Finish with units. Dividing a force in newtons by kilograms must give metres per second squared.
`,
  examples: [
    {
      id: "return",
      title: "A trolley returns",
      problemMd: "A trolley's velocity falls linearly from 4 m/s to −2 m/s in 6 s. Find displacement and distance.",
      steps: [
        md`The slope is $(-2-4)/6=-1$ metre per second squared, so velocity reaches zero after 4 s.`,
        md`The forward triangle has area $4\times4/2=8$ m. The backward triangle has magnitude $2\times2/2=2$ m.`,
        "Subtract the backward area for displacement and add its magnitude for distance.",
      ],
      answerMd: "Displacement is 6 m in the positive direction and distance is 10 m.",
    },
    {
      id: "sled",
      title: "A sled on a ramp",
      problemMd: md`A 4 kg sled slides down a ramp with sine of inclination 0.5. A rope pulls uphill with 6 N, and sliding friction is 2 N. Use $g=10$ m/s². Find its acceleration.`,
      steps: [
        md`Resolve weight downhill as $4\times10\times0.5=20$ N.`,
        md`Both other forces point uphill, giving $20-6-2=12$ N downhill.`,
        "Divide by 4 kg to change from net force to acceleration.",
      ],
      answerMd: "The acceleration is 3 m/s² downhill. The 5 m/s² result would omit the rope and friction.",
    },
  ],
  traps: [
    { title: "Height of the line", md: "On a velocity graph the height gives velocity. Use the change in height divided by elapsed time for acceleration." },
    { title: "Counting weight twice", md: "The two components replace the weight arrow in the equations. Adding its full magnitude as well counts the same interaction again." },
  ],
  check: [
    {
      id: "check-slope",
      title: "Position and time",
      topic: "Mechanics",
      stemMd: "A runner's position changes linearly from 9 m at 2 s to 3 m at 5 s. What is the signed velocity?",
      options: [
        { id: "A", text: "−2 m/s", note: "" },
        { id: "B", text: "2 m/s", note: "This uses distance and discards the decreasing coordinate." },
        { id: "C", text: "−6 m/s", note: "This takes the displacement without dividing by elapsed time." },
        { id: "D", text: "−1.2 m/s", note: "This divides the displacement by the final clock reading." },
        { id: "E", text: "0.6 m/s", note: "This divides the last position by the last clock reading." },
      ],
      answer: "A",
      workingMd: md`The displacement is $3-9=-6$ m in $5-2=3$ s, giving −2 m/s.`,
      lesson: "Use changes in both axes to measure a slope.",
    },
    {
      id: "check-normal",
      title: "A support force",
      topic: "Mechanics",
      stemMd: md`A 5 kg block rests on a rough incline. The sine and cosine of the angle are 0.6 and 0.8. Only gravity and contact forces act. With $g=10$ m/s², what is the magnitude of the normal force?`,
      options: [
        { id: "A", text: "50 N", note: "This uses the whole weight even though the surface is tilted." },
        { id: "B", text: "30 N", note: "This uses the component along the ramp." },
        { id: "C", text: "40 N", note: "" },
        { id: "D", text: "10 N", note: "This subtracts the perpendicular component from the whole weight." },
        { id: "E", text: "0 N", note: "Zero perpendicular acceleration means the perpendicular forces balance." },
      ],
      answer: "C",
      workingMd: md`The inward component of weight is $5\times10\times0.8=40$ N. The normal force balances it.`,
      lesson: "Balance components perpendicular to the surface to find its normal push.",
    },
    {
      id: "check-peak",
      title: "At the top of a throw",
      topic: "Mechanics",
      stemMd: "A pebble thrown vertically upwards reaches its highest point. Neglect air resistance. At that instant which pair describes its velocity and acceleration?",
      options: [
        { id: "A", text: "Both zero", note: "The momentary stop does not switch off gravity." },
        { id: "B", text: "Upwards velocity and downwards acceleration", note: "This describes the climb just before the top." },
        { id: "C", text: "Downwards velocity and downwards acceleration", note: "This describes the fall just after the top." },
        { id: "D", text: "Zero velocity and upwards acceleration", note: "Gravity still pulls towards Earth." },
        { id: "E", text: "Zero velocity and downwards acceleration", note: "" },
      ],
      answer: "E",
      workingMd: "The vertical velocity passes through zero as the pebble reverses. Gravity is the only force and gives a downward acceleration throughout.",
      lesson: "Determine instantaneous acceleration from the forces even when velocity vanishes.",
    },
  ],
  takeaways: [
    "The slope of position against time gives velocity.",
    "Signed area under a velocity graph gives displacement.",
    "Resolve each interaction once and divide the signed force sum by mass.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-sciences', skill: 'tolci-sci-mechanics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
