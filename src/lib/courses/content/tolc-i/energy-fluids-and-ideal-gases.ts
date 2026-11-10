import { md, type Lesson } from '../../types';

export const energyLesson: Lesson = {
  slug: "energy-fluids-and-ideal-gases",
  title: "Energy, fluids and ideal gases",
  summary: "Track energy transfers, compare pressures at depth, calculate buoyancy and use absolute temperature to predict changes in an ideal gas.",
  minutes: 20,
  objectives: [
    "Relate net work to a change of kinetic energy.",
    "Distinguish hydrostatic pressure from buoyant force.",
    "Compare two states of a fixed amount of ideal gas.",
  ],
  teachMd: md`
### Follow the energy transfer

When you pull a crate across a floor, the force transfers energy if the point where it acts moves. For a constant force on an object moving along a straight path, work (*lavoro*) is the force component along the displacement multiplied by the displacement. The unit is the joule, one newton metre. A pull in the direction of travel does positive work. Sliding friction on a crate moving across a stationary floor does negative work. The normal force does zero work during horizontal motion because it acts perpendicular to the displacement.

The sum of the work done by all forces on a particle equals the change in its kinetic energy, $K=mv^2/2$. Doubling the speed of the same mass quadruples its kinetic energy. A useful hand method is to calculate the two kinetic energies separately and subtract the starting value from the final value. If a problem asks for work done by the pulling force alone, decide which other forces contributed before using the energy change as your answer.

Near Earth's surface a vertical rise of height $h$ increases gravitational potential energy by $mgh$. Measure the height vertically even when the route is a long ramp. You can include gravity through its work or through a potential-energy change. Counting it both ways doubles its contribution. When friction removes mechanical energy, the missing mechanical energy can appear as thermal energy in the surfaces. Power describes how quickly energy transfers. The same lift completed in half the time requires twice the average power.

### Pressure at a point and lift on an object

Pressure is force per unit area. In a stationary liquid of uniform density $\rho$, descending a vertical distance $h$ increases pressure by $\rho gh$. Picture a slender column of liquid above a sensor. Doubling the column's area doubles both the weight and the area supporting it, so the pressure increase stays the same. The shape of the surrounding vessel drops out of the calculation. To obtain absolute pressure, add the pressure at the surface. A gauge referenced to the surrounding atmosphere reads the increase alone in an open tank.

The pressure on an immersed body acts inward on every face. For a rectangular block with horizontal top and bottom, the pressure on the bottom exceeds that on the top. Multiplying the difference by the face area gives the weight of the fluid the block displaces. Archimedes' principle gives this upward buoyant force (*spinta di Archimede*) for any shape. Use the density of the fluid and the volume actually submerged. A freely floating object at rest displaces fluid of weight equal to its own. A completely submerged object held by a string may have an extra force in its balance.

### Temperature in a gas law

For an ideal gas in equilibrium, pressure, volume, amount of gas and absolute temperature obey $pV=nRT$. Keep the same sealed sample and the amount stays fixed. Divide the state equation for one state by that for another. The gas constant and amount cancel, leaving $p_1V_1/T_1=p_2V_2/T_2$. A rigid vessel keeps volume fixed. A freely moving piston subject to a fixed external pressure can instead allow a change in volume at the same equilibrium pressure.

Use kelvin and absolute pressure when taking ratios. A rise from 20 to 40 degrees Celsius is a rise from about 293 to 313 kelvin. The absolute temperature increases modestly even though the Celsius reading doubles. When only the temperature difference enters a heat calculation, one kelvin of change equals one Celsius degree of change. For a body remaining in the same phase with constant specific heat capacity $c$, energy supplied as heat is $mc\Delta T$ if other energy exchanges are negligible. Equal heating of two samples need not produce equal temperature rises. The larger heat capacity spreads the same energy over a smaller temperature change.
`,
  examples: [
    {
      id: "hoist",
      title: "Lifting a crate",
      problemMd: md`A hoist raises a 6 kg crate vertically through 3 m at constant speed in 4 s. With $g=10$ m/s², find the work of the hoist and its average output power.`,
      steps: [
        "The speed is constant, so the upward tension balances the 60 N weight.",
        md`The tension and displacement point together, giving work $60\times3=180$ J.`,
        md`Divide by the time to obtain $180/4=45$ watts.`,
      ],
      answerMd: "The hoist supplies 180 J at 45 W on average. Zero net work includes gravity's opposing work.",
    },
    {
      id: "tank",
      title: "A submerged float",
      problemMd: md`A rigid float displaces 0.003 m³ of water of density 1,000 kg/m³. Its mass is 2 kg. Find the downward force needed to hold it stationary when fully immersed. Use $g=10$ m/s².`,
      steps: [
        md`The displaced water has mass $1000\times0.003=3$ kg, so buoyancy is 30 N.`,
        md`The float already weighs 20 N. Balance vertical forces by adding a downward force of $30-20$ N.`,
      ],
      answerMd: "A 10 N downward force holds it in place.",
    },
  ],
  traps: [
    { title: "Using the incline length", md: "The distance along a ramp enters work by a parallel pull. For gravitational potential energy, use the vertical rise." },
    { title: "Confusing displaced and total volumes", md: "Only the underwater part of a floating object displaces water. Draw the waterline before choosing the volume." },
    { title: "Taking Celsius ratios", md: "Celsius has an arbitrary zero. Convert both temperatures to kelvin before using the gas-law ratio." },
  ],
  check: [
    {
      id: "check-brake",
      title: "Energy lost while slowing",
      topic: "Mechanics and thermodynamics",
      stemMd: "A 2 kg cart slows from 5 m/s to 3 m/s. What is the total work done on it?",
      options: [
        { id: "A", text: "16 J", note: "This reports the magnitude of the decrease with the sign reversed." },
        { id: "B", text: "−4 J", note: "This squares the change of speed instead of subtracting the squared speeds, then assigns a minus sign." },
        { id: "C", text: "−16 J", note: "" },
        { id: "D", text: "−2 J", note: "This uses just the change in speed as the work." },
        { id: "E", text: "9 J", note: "This is the final kinetic energy alone." },
      ],
      answer: "C",
      workingMd: md`The initial kinetic energy is $2(25)/2=25$ J and the final value is $2(9)/2=9$ J. The total work is $9-25=-16$ J.`,
      lesson: "Net work is final kinetic energy minus initial kinetic energy.",
    },
    {
      id: "check-depth",
      title: "A pressure sensor",
      topic: "Mechanics and thermodynamics",
      stemMd: md`A tank is open to air at 100 kPa. In oil of density 800 kg/m³, what is the absolute pressure 2 m below the surface? Use $g=10$ m/s².`,
      options: [
        { id: "A", text: "16 kPa", note: "This is the pressure increase relative to the surface." },
        { id: "B", text: "116 kPa", note: "" },
        { id: "C", text: "84 kPa", note: "This subtracts the increase on descending." },
        { id: "D", text: "100 kPa", note: "This keeps the surface pressure at every depth." },
        { id: "E", text: "108 kPa", note: "This includes only one metre of oil." },
      ],
      answer: "B",
      workingMd: md`The extra pressure is $800\times10\times2=16000$ Pa or 16 kPa. Add it to the surface pressure to obtain 116 kPa.`,
      lesson: "Add surface pressure when a question asks for absolute pressure.",
    },
    {
      id: "check-piston",
      title: "Heating under a piston",
      topic: "Mechanics and thermodynamics",
      stemMd: "A sealed ideal gas at constant pressure occupies 4 litres at 300 K. What volume does it occupy at 450 K?",
      options: [
        { id: "A", text: "2⅔ litres", note: "This uses the inverse temperature ratio although the gas expands." },
        { id: "B", text: "4 litres", note: "Holding pressure fixed permits volume to change." },
        { id: "C", text: "2 litres", note: "This is the increase in volume alone." },
        { id: "D", text: "6 litres", note: "" },
        { id: "E", text: "8 litres", note: "This treats a 50% rise as a doubling." },
      ],
      answer: "D",
      workingMd: md`At fixed pressure and amount, volume varies in proportion to absolute temperature. Multiply 4 litres by $450/300=3/2$ to get 6 litres.`,
      lesson: "Identify the fixed quantities before simplifying the gas law.",
    },
  ],
  takeaways: [
    "Add work from all forces to find the kinetic-energy change.",
    "Extra pressure at depth depends on fluid density and vertical depth.",
    "Buoyancy equals the displaced fluid's weight.",
    "Use absolute pressure and kelvin in gas-law ratios.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-sciences', skill: 'tolci-sci-thermo' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
