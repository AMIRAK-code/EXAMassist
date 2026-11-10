import { md, type Lesson } from '../../types';

export const solutionsLesson: Lesson = {
  slug: "solutions-equilibrium-and-ph",
  title: "Solutions, equilibrium and pH",
  summary: "Calculate molarity after dilution, predict how a disturbed equilibrium responds, and read hydrogen-ion concentrations from a logarithmic pH scale.",
  minutes: 20,
  objectives: [
    "Calculate concentration using the final solution volume.",
    "Predict the response of an equilibrium mixture to a change in conditions.",
    "Translate powers of ten between hydrogen-ion concentration and pH.",
  ],
  teachMd: md`
### Count the solute in a measured volume

A solution contains a solute distributed through a solvent. Molar concentration, often called molarity (*molarità*), counts the moles of solute per litre of solution. If a flask holds $n$ moles dissolved in a final volume $V$ in litres, the concentration is $c=n/V$. A concentration of 0.2 mol per litre means a representative half litre contains 0.1 mol. It says how closely the particles are distributed. The total amount also depends on how much solution you have.

Keep the volume of the solution distinct from the volume of solvent poured in. When preparing a solution to a mark on a flask, dissolve the solute first and add solvent until the bottom of the meniscus lies at the mark. The mark specifies the final volume. A problem that gives mass rather than moles requires a separate conversion. Divide the mass in grams by the solute's molar mass in grams per mole and then divide the amount by the final volume in litres.

### Decide what survives a dilution

Adding pure solvent to a measured portion of solution leaves the amount of dissolved solute unchanged, provided none reacts or is lost. Before and after dilution (*diluizione*), that amount is concentration times volume. Thus $c_1V_1=c_2V_2$. Use the volume of the portion actually transferred for the first volume. If you take a pipette full from a large bottle, only the solute in the pipette enters the new flask. The stock bottle's total contents do not enter the equation.

For a ratio of volumes, the units can cancel when both are expressed alike. To calculate an amount in moles directly from molarity, use litres. Predict the direction before calculating. Expanding a sample from 20 mL to 100 mL spreads the same particles through five times the volume and divides their concentration by five. Mixing two solutions that both contain solute needs an extra step. Add the moles supplied by each portion before dividing by the final volume, provided no reaction consumes the solute.

### Predict the response of a reversible reaction

In a closed mixture at dynamic equilibrium (*equilibrio dinamico*), forward and reverse reactions continue at equal rates. Concentrations stay constant over time although individual particles still react. The concentrations of reactants and products need not be equal. Add a reactant while keeping temperature and volume fixed and the immediate composition changes. In a simple reversible reaction the mixture then consumes some of the added reactant and forms more product until the rates again match. It need not consume all of the added material.

For a gas mixture, decreasing volume at fixed temperature raises the partial pressures. The equilibrium shifts towards the side with fewer gas molecules when the two sides have different gaseous coefficient totals. Count only gaseous species for this comparison. A catalyst instead speeds the routes in both directions. An equilibrium mixture with a catalyst has the same equilibrium composition at the same temperature, although a disturbed mixture can settle more quickly.

### Read a logarithmic scale

For dilute aqueous solutions in elementary calculations, write $\mathrm{pH}=-\log_{10}[\mathrm{H}^+]$, using the numerical concentration in moles per litre. If the concentration is an exact power of ten, the exponent changes sign. A fall from $10^{-2}$ to $10^{-3}$ mol per litre therefore raises pH from 2 to 3. Each unit corresponds to a factor of ten. A difference of two pH units gives a hundredfold concentration ratio even though the written numbers differ by only two.

A strong monoprotic acid supplies approximately one hydrogen ion per acid molecule in dilute water when the acid's contribution dominates that of water. Under those conditions, a tenfold dilution decreases the hydrogen-ion concentration tenfold. A weak acid dissociates only partially, and dilution changes the degree of dissociation. Applying the strong-acid shortcut to a weak acid can therefore give an incorrect pH. When a question supplies the hydrogen-ion concentration itself, use that number directly.
`,
  examples: [
    {
      id: "pipette",
      title: "Diluting an aliquot",
      problemMd: "A pipette transfers 25 mL of 0.40 mol/L salt solution to a flask. Pure water brings the total volume to 200 mL. Find the final concentration.",
      steps: [
        md`The transferred portion holds $0.025\times0.40=0.010$ mol of solute.`,
        "Divide by 0.200 L to obtain 0.050 mol/L. Equivalently the volume grew eightfold, so the concentration fell eightfold.",
      ],
      answerMd: "The concentration is 0.050 mol/L. The 200 mL is already the final volume.",
    },
    {
      id: "gas",
      title: "Compressing an equilibrium mixture",
      problemMd: md`A sealed piston contains an equilibrium mixture for $2\mathrm{NO_2}(g)\rightleftharpoons\mathrm{N_2O_4}(g)$. Compress it at fixed temperature. Which reaction is favoured as it settles?`,
      steps: [
        "Count the gaseous coefficients. Two gas molecules on the left correspond to one on the right.",
        "Compression raises all partial pressures immediately. Forming more dimer then reduces the total gas amount relative to that immediately compressed state.",
      ],
      answerMd: "The forward reaction is favoured, producing more dinitrogen tetroxide. Both reactions still occur at the new equilibrium.",
    },
  ],
  traps: [
    { title: "Using added water as the denominator", md: "The final concentration uses the entire final solution volume. Check whether the wording says diluted to a volume or by adding a volume." },
    { title: "Equating rates with amounts", md: "Constant concentrations indicate balanced rates in a closed equilibrium mixture. They give no reason for equal amounts on both sides." },
  ],
  check: [
    {
      id: "check-salt",
      title: "Mass to concentration",
      topic: "Chemistry",
      stemMd: "A solute has molar mass 80 g/mol. Dissolving 4 g gives 250 mL of solution. What is its molarity?",
      options: [
        { id: "A", text: "0.05 mol/L", note: "This is the numerical amount in moles before dividing by volume." },
        { id: "B", text: "0.0125 mol/L", note: "This multiplies the amount by the volume in litres." },
        { id: "C", text: "16 mol/L", note: "This divides grams by litres, producing a mass concentration." },
        { id: "D", text: "0.0002 mol/L", note: "This divides by millilitres without converting to litres." },
        { id: "E", text: "0.20 mol/L", note: "" },
      ],
      answer: "E",
      workingMd: md`The amount is $4/80=0.05$ mol and the volume is a quarter of a litre. Division by a quarter multiplies by four, giving 0.20 mol/L.`,
      lesson: "Convert mass to moles and volume to litres before dividing.",
    },
    {
      id: "check-catalyst",
      title: "Adding a catalyst",
      topic: "Chemistry",
      stemMd: "A closed mixture is already at dynamic equilibrium. At fixed temperature and volume, a catalyst is added with negligible change in composition. What follows?",
      options: [
        { id: "A", text: "Only the forward reaction speeds up.", note: "A catalyst also provides the reverse reaction with a faster route." },
        { id: "B", text: "The equilibrium shifts towards reactants.", note: "A faster reverse route does not selectively favour reactants." },
        { id: "C", text: "Both rates rise equally and concentrations remain at equilibrium.", note: "" },
        { id: "D", text: "Both rates fall to zero.", note: "Particles continue reacting in a dynamic equilibrium." },
        { id: "E", text: "Reactant and product concentrations become equal.", note: "Equilibrium constrains opposing rates, not equality of concentrations." },
      ],
      answer: "C",
      workingMd: "A catalyst provides a faster path in each direction without changing the equilibrium constant. At the original equilibrium composition the increased rates still balance.",
      lesson: "A catalyst changes how fast equilibrium can be reached.",
    },
    {
      id: "check-acidity",
      title: "Comparing two solutions",
      topic: "Chemistry",
      stemMd: "One dilute solution has pH 3 and another has pH 5. How does the first hydrogen-ion concentration compare with the second?",
      options: [
        { id: "A", text: "Two times as large", note: "The numerical pH difference is not a concentration multiplier." },
        { id: "B", text: "One hundred times as large", note: "" },
        { id: "C", text: "Ten times as large", note: "A tenfold ratio accounts for only one pH unit." },
        { id: "D", text: "One hundredth as large", note: "This reverses the effect of lowering pH." },
        { id: "E", text: "One fifth as large", note: "Dividing by a pH reading cannot undo a logarithm." },
      ],
      answer: "B",
      workingMd: md`The ratio is $10^{-3}/10^{-5}=10^2=100$. The lower pH belongs to the more concentrated hydrogen ions.`,
      lesson: "Each step down by one pH unit multiplies hydrogen-ion concentration by ten.",
    },
  ],
  takeaways: [
    "Concentration is amount of solute divided by final solution volume.",
    "Plain dilution conserves solute moles.",
    "At dynamic equilibrium the forward and reverse rates match.",
    "Use powers of ten to compare hydrogen-ion concentrations.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-sciences', skill: 'tolci-sci-chemistry' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
