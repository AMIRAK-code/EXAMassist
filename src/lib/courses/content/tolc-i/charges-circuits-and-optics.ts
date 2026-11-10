import { md, type Lesson } from '../../types';

export const electricityLesson: Lesson = {
  slug: "charges-circuits-and-optics",
  title: "Charges, circuits and optics",
  summary: "Compare electric forces, trace current and voltage in resistor networks, and use the normal to predict reflection and refraction by hand.",
  minutes: 20,
  objectives: [
    "Compare electrostatic forces when separation or charge changes.",
    "Find equivalent resistance and electrical power.",
    "Trace a ray across a boundary using angles to the normal.",
  ],
  teachMd: md`
### Start with two point charges

Rubbed materials can gain or lose electrons. An excess of electrons gives an object negative charge, and a deficit gives positive charge. For two stationary point charges in vacuum, the magnitude of the electrostatic force is $F=k|q_1q_2|/r^2$. Here $r$ is their separation. The sign of the charge product tells you which way to draw the forces. Like charges repel and unlike charges attract. The two forces have equal magnitudes even when the charges have different magnitudes. Each acts on a different object.

For a comparison, write the new force divided by the old force before inserting any numbers. Increasing one charge by a factor of three triples the numerator. Increasing the separation by a factor of three multiplies the denominator by nine. Doing both therefore reduces the force to one third of its initial value. The constant cancels because the medium stays the same. A quick direction check is to hold the charges fixed and picture them moving very far apart. The calculated force should tend towards zero.

The electric field at a point is the force per unit positive test charge there. A negative test charge feels a force opposite to the field. The field around a single positive charge points outwards. To combine fields from two charges, draw the arrows at the point where you want the field. Equal magnitudes there will cancel only if their directions are opposite.

### Mark the junctions in a circuit

Current measures charge flowing per unit time, and voltage measures potential difference between two points. An ohmic resistor obeys $V=IR$ at a given temperature. Label the two ends of each resistor before reducing a network. Resistors are in series (*in serie*) when they carry the same current along an unbranched path. The voltage drops then add, which gives an equivalent resistance equal to the sum. A wire drawn with a bend still connects the same points, so the physical appearance of the diagram can be misleading.

Resistors in parallel (*in parallelo*) share the same two end nodes. Each branch experiences the full voltage between those nodes. Branch currents add to the current supplied, which gives $1/R_{\rm eq}=1/R_1+1/R_2$ for two branches. An extra parallel branch gives the charge a second conducting path, so the equivalent resistance is smaller than either positive branch resistance. Two identical resistors in parallel have half the resistance of either one alone. Calculating the branch currents and adding them often takes less arithmetic than adding fractions.

Electrical power is the rate at which energy transfers. For a resistor it is $P=VI$, using the voltage across and current through that same resistor. Substituting Ohm's law gives $I^2R$ or $V^2/R$. These describe different comparisons. At fixed current a larger resistance dissipates more power. At fixed voltage a larger resistance carries less current and dissipates less power. To find energy supplied during a steady interval, multiply power in watts by time in seconds to obtain joules.

### Draw a normal at the boundary

When a light ray strikes a plane surface, draw the normal, a line perpendicular to that surface through the point of incidence. Reflection sends the ray back into the first medium at the same angle to the normal as the incident ray. If the stated angle is measured from the surface, subtract it from a right angle before using a formula. At perpendicular incidence the angle to the normal is zero, although the ray meets the surface at a right angle.

Refraction (*rifrazione*) changes the direction of an oblique ray transmitted between media with different refractive indices. Snell's law gives $n_1\sin\theta_1=n_2\sin\theta_2$. Entering the larger index makes the sine smaller, so the ray bends towards the normal. Leaving the larger index can bend it away. If the computed sine exceeds one, there is no transmitted ray in the second medium and total internal reflection occurs. For hand calculations you can often compare the sines or leave the requested result as a fraction without finding an angle numerically.
`,
  examples: [
    {
      id: "parallel",
      title: "Two heater branches",
      problemMd: "A 12 V supply drives 6 Ω and 12 Ω resistors in parallel. Find the effective resistance and the power in the 6 Ω branch.",
      steps: [
        md`Both branches have 12 V across them, so their currents are $12/6=2$ A and $12/12=1$ A.`,
        md`The supply delivers 3 A. The equivalent resistance is $12/3=4$ Ω.`,
        md`Use the current in the 6 Ω resistor to find its power, $12\times2=24$ W.`,
      ],
      answerMd: "The equivalent resistance is 4 Ω and the 6 Ω resistor dissipates 24 W. The total supply power of 36 W includes the other branch.",
    },
    {
      id: "ray",
      title: "A ray enters a slab",
      problemMd: "A ray with sine of incidence 0.6 enters a transparent slab of refractive index 1.5 from air of index 1. Find the sine of the refracted angle and describe the bend.",
      steps: [
        md`The incident product of index and sine is $1\times0.6=0.6$.`,
        md`The transmitted product must match it, so divide by 1.5 to obtain $6/15=0.4$.`,
      ],
      answerMd: "The sine is 0.4. The smaller angle places the transmitted ray closer to the normal.",
    },
  ],
  traps: [
    { title: "Using the whole circuit's current", md: "At a junction, current can split. Establish the current through the individual component before applying the power formula." },
    { title: "Measuring angles to the surface", md: "A ray skimming a surface has a large angle to the normal. Draw a perpendicular through the point of incidence and mark the angle there." },
  ],
  check: [
    {
      id: "check-charge",
      title: "Changing charge and separation",
      topic: "Electromagnetism and optics",
      stemMd: "Two point charges repel with force of magnitude F. One charge doubles and their separation doubles in the same medium. What is the new magnitude?",
      options: [
        { id: "A", text: "2F", note: "This doubles the charge but keeps the original distance." },
        { id: "B", text: "F/4", note: "This changes separation but leaves the charge unchanged." },
        { id: "C", text: "F", note: "This treats the distance dependence as inverse linear." },
        { id: "D", text: "F/2", note: "" },
        { id: "E", text: "8F", note: "This makes the force grow with the square of distance." },
      ],
      answer: "D",
      workingMd: md`The numerator doubles and the denominator increases fourfold. The ratio is $2/4=1/2$.`,
      lesson: "Apply charge and separation factors separately in Coulomb's law.",
    },
    {
      id: "check-series",
      title: "Power in a series pair",
      topic: "Electromagnetism and optics",
      stemMd: "An ideal 18 V supply connects 3 Ω and 6 Ω resistors in series. How much power does the 3 Ω resistor dissipate?",
      options: [
        { id: "A", text: "12 W", note: "" },
        { id: "B", text: "36 W", note: "This is the entire supply's power." },
        { id: "C", text: "24 W", note: "This is the power in the larger resistor." },
        { id: "D", text: "108 W", note: "This places the full supply voltage across the smaller resistor." },
        { id: "E", text: "6 W", note: "This uses the 6 V drop as if it were a power." },
      ],
      answer: "A",
      workingMd: md`Series resistance is 9 Ω, so the current through both is 2 A. The smaller resistor dissipates $2^2\times3=12$ W.`,
      lesson: "Use the same component's current and resistance to calculate its power.",
    },
    {
      id: "check-mirror",
      title: "Angles at a mirror",
      topic: "Electromagnetism and optics",
      stemMd: "A ray approaches a flat mirror at 25° to its surface. What angle does the reflected ray make with the normal?",
      options: [
        { id: "A", text: "25°", note: "This repeats the angle measured to the surface." },
        { id: "B", text: "50°", note: "This doubles the surface angle instead of measuring one ray to the normal." },
        { id: "C", text: "90°", note: "The normal itself is perpendicular to the mirror." },
        { id: "D", text: "130°", note: "This is the angle between the two outward ray arms." },
        { id: "E", text: "65°", note: "" },
      ],
      answer: "E",
      workingMd: md`The incident angle to the normal is $90^\circ-25^\circ=65^\circ$. Reflection preserves that angle.`,
      lesson: "Measure each ray's angle from the normal.",
    },
  ],
  takeaways: [
    "Double separation at fixed charges and electrostatic force falls fourfold.",
    "Series components share a current and parallel components share a voltage.",
    "A resistor's power uses the voltage and current of that resistor.",
    "Use angles to the normal on both sides of an optical boundary.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-sciences', skill: 'tolci-sci-electromagnetism-optics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
