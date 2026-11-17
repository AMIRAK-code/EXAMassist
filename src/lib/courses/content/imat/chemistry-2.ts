import { md, type Lesson } from '../../types';

/**
 * IMAT chemistry, second half: solutions, kinetics and equilibrium, acids and
 * bases, redox, and organic chemistry. Collected into the chemistry unit in
 * content/imat/units.ts.
 */

export const solutionsAndConcentrationLesson: Lesson = {
  slug: 'solutions-and-concentration',
  title: 'Solutions, concentration and colligative properties',
  summary: 'Work with molarity, dilution and molality, and predict boiling points, freezing points and osmosis by counting dissolved particles.',
  minutes: 20,
  objectives: [
    'Calculate molarity from a mass and a volume, and the new concentration after a dilution.',
    'Tell molarity from molality and say when the difference matters.',
    'Rank solutions by boiling point, freezing point or osmotic pressure by counting dissolved particles.',
    'Predict which way water moves across a membrane and what happens to a cell placed in a solution.',
  ],
  teachMd: md`
### What a solution is

A solution is a homogeneous mixture: a **solute** dissolved in a **solvent**. In living things the solvent is water, so the solutions met in biology and medicine are aqueous. Concentration says how much solute is present in a given amount of solution or solvent, and there are several ways to express it. Each answers a slightly different question, so read which one a problem uses.

### Molarity: moles per litre of solution

$$c = \frac{n}{V}$$

Molarity $c$ is the amount of solute $n$ in moles divided by the volume of **solution** $V$ in litres, in mol/L (often written M). If the mass is given, convert it first with $n = \frac{m}{M}$. For example, $5.85\ \text{g}$ of $\mathrm{NaCl}$ ($M = 58.5\ \text{g/mol}$) is $0.100\ \text{mol}$; dissolved and made up to $500\ \text{mL}$, it gives $\frac{0.100}{0.500} = 0.200\ \text{mol/L}$.

Two other measures are common. Mass concentration is grams per litre. A percent by mass per volume (w/v) is grams per $100\ \text{mL}$: a $0.9\%$ w/v saline holds $0.9\ \text{g}$ of $\mathrm{NaCl}$ in every $100\ \text{mL}$, which is $9\ \text{g/L}$.

### Dilution keeps the moles

Adding solvent changes the volume but not the amount of solute. The moles before equal the moles after:

$$c_1 V_1 = c_2 V_2$$

Any volume unit works as long as both sides use the same one. When two solutions of the same solute are mixed, add the moles and add the volumes (dilute aqueous volumes are treated as additive), then divide.

### Molality: moles per kilogram of solvent

$$b = \frac{n_{\text{solute}}}{m_{\text{solvent}}}$$

Molality $b$ is in mol/kg, and the mass is that of the **solvent** alone. Dissolving $0.50\ \text{mol}$ of a solute in $2.0\ \text{kg}$ of water gives $0.25\ \text{mol/kg}$. Because masses do not change with temperature, molality does not either; molarity changes slightly, since a liquid expands when warmed. For dilute aqueous solutions, one litre of solution contains close to one kilogram of water, so the two measures are almost equal.

### Colligative properties count particles

Four properties of a solution depend on **how many** solute particles are dissolved, not on what they are: the lowering of the vapour pressure, the rise of the boiling point, the fall of the freezing point and the osmotic pressure. Dissolved particles reduce the tendency of solvent molecules to escape into the vapour, so the solution must be heated further before it boils, and they disturb the ordering of the solvent into a solid, so it must be cooled further before it freezes.

What counts is the particle concentration. An ionic solute splits into ions, and the **van 't Hoff factor** $i$ is the number of particles per formula unit:

| Solute | Particles in water | $i$ (ideal) |
| --- | --- | --- |
| glucose, urea, sucrose | molecules stay whole | 1 |
| $\mathrm{NaCl}$, $\mathrm{KNO_3}$ | 2 ions | 2 |
| $\mathrm{CaCl_2}$, $\mathrm{Na_2SO_4}$ | 3 ions | 3 |

Measured factors are a little lower in concentrated solutions, where ions pair up, but questions use the ideal count. The changes in temperature are

$$\Delta T_b = i\,K_b\,b \qquad \Delta T_f = i\,K_f\,b$$

where for water $K_b = 0.51\ \text{K kg/mol}$ and $K_f = 1.86\ \text{K kg/mol}$. Often you need no constants at all: to rank solutions, compare $i \times b$.

### Osmosis and osmotic pressure

A semipermeable membrane lets water through but not the solute. Water then moves by **osmosis** from the side with the lower particle concentration to the side with the higher one. The osmotic pressure is the pressure needed to stop that flow:

$$\Pi = i\,c\,R\,T$$

with $c$ in mol/L, $R = 0.0821\ \text{L atm/(mol K)}$ and $T$ in kelvin. The product $i \times c$ is the **osmolarity**, the concentration of particles.

Cells show what this means. A solution with the same particle concentration as the cytoplasm is **isotonic**, and the cell keeps its volume; $0.9\%$ w/v saline is isotonic with blood. In a **hypotonic** solution (fewer particles outside), water enters and a red blood cell swells and may burst (haemolysis). In a **hypertonic** solution (more particles outside), water leaves and the cell shrinks (crenation).

### Keeping the arithmetic simple

Nothing in the IMAT rules allows a calculator, so choose units that keep numbers small. Millimoles per millilitre equal moles per litre, so $25\ \text{mL}$ of a $0.40\ \text{mol/L}$ solution holds $10\ \text{mmol}$ without any conversion. Round $R \times T$ at body or room temperature to a convenient value and estimate before you compute.
`,
  examples: [
    {
      id: 'example-make-and-dilute',
      title: 'Making a solution, then diluting it',
      problemMd: md`$4.0\ \text{g}$ of $\mathrm{NaOH}$ ($M = 40\ \text{g/mol}$) is dissolved in water and made up to $250\ \text{mL}$. Then $25.0\ \text{mL}$ of this solution is diluted with water to $100\ \text{mL}$. What is the concentration of the diluted solution?`,
      steps: [
        md`Convert the mass to moles: $n = \frac{4.0}{40} = 0.10\ \text{mol}$.`,
        md`Divide by the volume in litres: $c_1 = \frac{0.10}{0.250} = 0.40\ \text{mol/L}$.`,
        md`Dilution keeps the moles, so $c_2 = \frac{c_1 V_1}{V_2} = \frac{0.40 \times 25.0}{100} = 0.10\ \text{mol/L}$.`,
        md`Check by moles: $25.0\ \text{mL}$ of $0.40\ \text{mol/L}$ holds $10\ \text{mmol}$; $10\ \text{mmol}$ in $100\ \text{mL}$ is $0.10\ \text{mmol/mL} = 0.10\ \text{mol/L}$.`,
      ],
      answerMd: md`The diluted solution is $0.10\ \text{mol/L}$. Dividing $0.10\ \text{mol}$ by $250$ instead of $0.250$ gives $0.0004\ \text{mol/L}$, a thousand times too small: the volume must be in litres.`,
    },
    {
      id: 'example-lowest-freezing-point',
      title: 'Which solution freezes lowest?',
      problemMd: md`Three aqueous solutions are prepared: glucose at $0.20\ \text{mol/kg}$, $\mathrm{NaCl}$ at $0.15\ \text{mol/kg}$ and $\mathrm{CaCl_2}$ at $0.08\ \text{mol/kg}$. Which has the lowest freezing point, and roughly what is it? ($K_f = 1.86\ \text{K kg/mol}$ for water.)`,
      steps: [
        md`The freezing point falls in proportion to the molality of **particles**, $i \times b$, so find it for each.`,
        md`Glucose: $1 \times 0.20 = 0.20$. Sodium chloride: $2 \times 0.15 = 0.30$. Calcium chloride: $3 \times 0.08 = 0.24\ \text{mol/kg}$ of particles.`,
        md`The largest particle molality, $0.30\ \text{mol/kg}$, gives the largest depression: $\Delta T_f = 1.86 \times 0.30 = 0.558 \approx 0.56\ \text{K}$.`,
        md`Pure water freezes at $0\ ^\circ\text{C}$, so this solution freezes at about $-0.56\ ^\circ\text{C}$.`,
      ],
      answerMd: md`The $\mathrm{NaCl}$ solution freezes lowest, at about $-0.56\ ^\circ\text{C}$. Glucose is tempting because its molality, $0.20$, is the largest number given, but it does not dissociate; calcium chloride makes the most ions per unit but is the least concentrated.`,
    },
    {
      id: 'example-osmosis-direction',
      title: 'Which way does the water move?',
      problemMd: md`A membrane permeable only to water separates $0.10\ \text{mol/L}$ glucose (side 1) from $0.10\ \text{mol/L}$ $\mathrm{NaCl}$ (side 2) at $300\ \text{K}$. Which way does water flow, and what is the difference in osmotic pressure between the two sides? Take $R = 0.082\ \text{L atm/(mol K)}$.`,
      steps: [
        md`Compare particle concentrations, not solute concentrations: side 1 has $0.10\ \text{mol/L}$ of particles, side 2 has $2 \times 0.10 = 0.20\ \text{mol/L}$.`,
        md`Water moves towards the higher particle concentration, so it flows from side 1 (glucose) to side 2 (salt).`,
        md`The pressure difference comes from the difference in particle concentration, $0.10\ \text{mol/L}$: $\Delta\Pi = 0.10 \times 0.082 \times 300$.`,
        md`Compute in an easy order: $0.082 \times 300 = 24.6$, and $0.10 \times 24.6 = 2.46 \approx 2.5\ \text{atm}$.`,
      ],
      answerMd: md`Water flows from the glucose side into the salt side, and the osmotic pressures differ by about $2.5\ \text{atm}$. Answering "no flow, both are $0.10\ \text{mol/L}$" is the trap: osmosis counts particles, and $\mathrm{NaCl}$ gives two per formula unit.`,
    },
  ],
  traps: [
    {
      title: 'Using the solvent volume for molarity',
      md: md`Molarity divides by the volume of the finished **solution**. "Dissolved in $250\ \text{mL}$ of water" and "made up to $250\ \text{mL}$" are not the same in principle; molality, by contrast, uses the mass of solvent only. Check which quantity the formula needs before you divide.`,
    },
    {
      title: 'Forgetting that ionic solutes dissociate',
      md: md`A colligative property counts particles. $0.1\ \text{mol/L}$ $\mathrm{CaCl_2}$ has three times the effect of $0.1\ \text{mol/L}$ glucose. Multiply by $i$ before comparing; ignoring it is the usual reason for picking a glucose or urea option.`,
    },
    {
      title: 'Answering the volume of water instead of the volume of stock',
      md: md`A dilution question may ask how much concentrated solution to take, or how much water to add. $c_1 V_1 = c_2 V_2$ gives the volume of stock; the water added is the final volume minus that. Reread the question before choosing.`,
    },
    {
      title: 'Sending water the wrong way',
      md: md`Water moves towards the side with **more** dissolved particles, as if to dilute it. A cell in a hypertonic solution loses water and shrinks; in a hypotonic one it gains water and swells. Saying "water moves to where there is more water" is correct but easily turned round, so reason from the particles.`,
    },
  ],
  check: [
    {
      id: 'check-stock-volume',
      title: 'Volume of stock for a dilution',
      topic: 'Solutions and concentration',
      stemMd: md`A technician needs $500\ \text{mL}$ of $0.30\ \text{mol/L}$ hydrochloric acid and has a stock solution of $2.0\ \text{mol/L}$. What volume of stock solution must be diluted?`,
      options: [
        { id: 'A', text: md`$75\ \text{mL}$`, note: '' },
        { id: 'B', text: md`$150\ \text{mL}$`, note: md`This is $0.30 \times 500$, the amount of acid in millimoles; it still has to be divided by the stock concentration, $2.0$.` },
        { id: 'C', text: md`$425\ \text{mL}$`, note: md`This is the volume of water to add, $500 - 75$, not the volume of stock asked for.` },
        { id: 'D', text: md`$575\ \text{mL}$`, note: md`This adds the stock to $500\ \text{mL}$ of water; but $500\ \text{mL}$ is the final volume of the diluted solution, not the water.` },
        { id: 'E', text: md`About $3.3\ \text{L}$`, note: md`The ratio is inverted ($2.0 \times 500 / 0.30$): a diluted solution needs less stock than its final volume, never more.` },
      ],
      answer: 'A',
      workingMd: md`Moles needed: $0.30 \times 0.500 = 0.15\ \text{mol}$. Volume of stock holding them: $\frac{0.15}{2.0} = 0.075\ \text{L} = 75\ \text{mL}$. The same from $c_1 V_1 = c_2 V_2$: $V_1 = \frac{0.30 \times 500}{2.0} = 75\ \text{mL}$, made up to $500\ \text{mL}$ with water.`,
      lesson: 'In a dilution the moles of solute are fixed; find them from the target, then the stock volume that contains them.',
    },
    {
      id: 'check-highest-boiling-point',
      title: 'Highest boiling point',
      topic: 'Colligative properties',
      stemMd: md`Which of these aqueous solutions has the highest boiling point?`,
      options: [
        { id: 'A', text: md`$0.10\ \text{mol/kg}$ glucose`, note: md`Glucose does not dissociate, so this gives only $0.10\ \text{mol/kg}$ of particles, the fewest of all.` },
        { id: 'B', text: md`$0.10\ \text{mol/kg}$ $\mathrm{KCl}$`, note: md`$\mathrm{KCl}$ gives two ions, $0.20\ \text{mol/kg}$ of particles, which is less than $0.24$.` },
        { id: 'C', text: md`$0.08\ \text{mol/kg}$ $\mathrm{MgCl_2}$`, note: '' },
        { id: 'D', text: md`$0.20\ \text{mol/kg}$ sucrose`, note: md`The largest molality listed, but sucrose stays as whole molecules: $0.20\ \text{mol/kg}$ of particles, less than $0.24$.` },
        { id: 'E', text: md`$0.12\ \text{mol/kg}$ urea`, note: md`Urea is a non-electrolyte, so its particle molality is just $0.12\ \text{mol/kg}$.` },
      ],
      answer: 'C',
      workingMd: md`Boiling-point elevation is proportional to $i \times b$. Glucose $0.10$; potassium chloride $2 \times 0.10 = 0.20$; magnesium chloride $3 \times 0.08 = 0.24$; sucrose $0.20$; urea $0.12$. The largest particle molality, $0.24\ \text{mol/kg}$ from magnesium chloride, raises the boiling point most.`,
      lesson: 'Rank colligative effects by particle concentration: multiply each molality by the number of particles per formula unit.',
    },
    {
      id: 'check-red-cells-saline',
      title: 'Red blood cells in salt solution',
      topic: 'Solutions and osmosis',
      stemMd: md`Red blood cells are isotonic with $0.15\ \text{mol/L}$ $\mathrm{NaCl}$. What happens when they are placed in $0.30\ \text{mol/L}$ $\mathrm{NaCl}$?`,
      options: [
        { id: 'A', text: md`They swell and may burst, because water enters them.`, note: md`This happens in a hypotonic solution; $0.30\ \text{mol/L}$ $\mathrm{NaCl}$ has more particles than the cells, so it is hypertonic.` },
        { id: 'B', text: md`They shrink, because water leaves them by osmosis.`, note: '' },
        { id: 'C', text: md`Nothing, because the solution is isotonic with the cells.`, note: md`Isotonic is $0.15\ \text{mol/L}$ $\mathrm{NaCl}$; this solution has twice that particle concentration.` },
        { id: 'D', text: md`They shrink, because sodium and chloride ions flow into them.`, note: md`The outcome is right but the cause is wrong: in osmosis water moves, out of the cells and towards the more concentrated outside.` },
        { id: 'E', text: md`They swell, because salt diffuses in and draws water after it.`, note: md`Treats the membrane as open to the salt; with the solute held back, water leaves the cells and they shrink.` },
      ],
      answer: 'B',
      workingMd: md`$0.30\ \text{mol/L}$ $\mathrm{NaCl}$ holds $0.60\ \text{mol/L}$ of ions, twice the particle concentration of the isotonic $0.15\ \text{mol/L}$ (which holds $0.30$). Outside is hypertonic, so water moves out of the cells by osmosis and they shrink (crenation).`,
      lesson: 'Compare particle concentrations inside and outside: water always moves towards the side with more particles.',
    },
  ],
  takeaways: [
    md`Molarity is $c = \frac{n}{V}$ with $V$ the volume of solution in litres; molality is moles per kilogram of solvent.`,
    md`Dilution keeps the moles: $c_1 V_1 = c_2 V_2$.`,
    'Colligative properties depend on the number of dissolved particles: multiply the concentration by the van \'t Hoff factor before comparing.',
    'Water moves by osmosis towards the higher particle concentration; cells swell in hypotonic and shrink in hypertonic solutions.',
  ],
  flashcards: [
    { front: 'Molarity', back: md`Moles of solute per litre of solution: $c = \frac{n}{V}$, in mol/L.` },
    { front: 'Dilution rule', back: md`$c_1 V_1 = c_2 V_2$: adding solvent changes the volume but not the moles of solute.` },
    { front: 'Molality', back: 'Moles of solute per kilogram of solvent. It does not change with temperature, because masses do not.' },
    { front: "van 't Hoff factor", back: md`The number of particles one formula unit gives in solution: glucose 1, $\mathrm{NaCl}$ 2, $\mathrm{CaCl_2}$ 3.` },
    { front: 'Direction of osmosis', back: 'Water crosses a semipermeable membrane from the side with fewer dissolved particles to the side with more.' },
    { front: 'Red blood cell in a hypotonic solution', back: 'Water enters the cell, which swells and may burst (haemolysis). In a hypertonic solution it shrinks (crenation).' },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-stoichiometry' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const kineticsAndChemicalEquilibriumLesson: Lesson = {
  slug: 'kinetics-and-chemical-equilibrium',
  title: 'Reaction rates and chemical equilibrium',
  summary: 'Explain what speeds a reaction up, read rate laws from data, write equilibrium constants and predict shifts with Le Chatelier\'s principle.',
  minutes: 22,
  objectives: [
    'Explain the effect of concentration, temperature, surface area and catalysts with collision theory.',
    'Find reaction orders from experimental data and use a rate law to predict a new rate.',
    'Write an equilibrium constant, compare it with the reaction quotient and predict the direction of change.',
    'Predict how changes in concentration, pressure, temperature and catalysts affect an equilibrium and its constant.',
  ],
  teachMd: md`
### Rate: how fast concentrations change

The rate of a reaction is the change in concentration of a reactant or product per unit time, usually in mol/(L s). It is highest at the start and falls as reactants are used up. Kinetics asks **how fast** a reaction goes; equilibrium, later in this lesson, asks **how far**. Keep the two questions apart: a reaction can lie far towards products and still be very slow.

### Collision theory and activation energy

Reacting particles must collide, with enough energy and in a suitable orientation. The minimum energy is the **activation energy** $E_a$, the height of the barrier between reactants and products on an energy profile. Each factor that changes a rate does so through these collisions:

| Change | Why the rate rises |
| --- | --- |
| higher concentration (or gas pressure) | more collisions per second |
| larger surface area of a solid | more particles exposed to collisions |
| higher temperature | a much larger fraction of collisions has at least $E_a$; collisions also become more frequent, a smaller effect |
| catalyst | an alternative pathway with a lower $E_a$ |

A catalyst is not used up. On the energy profile it lowers the peak but leaves the energies of reactants and products, and so $\Delta H$, unchanged. Because it lowers the barrier for the reverse reaction by the same amount, it speeds up both directions by the same factor. Enzymes are biological catalysts.

### Rate laws come from experiment

For a reaction between $\mathrm{A}$ and $\mathrm{B}$ the rate law has the form

$$\text{rate} = k\,[\mathrm{A}]^m\,[\mathrm{B}]^n$$

The exponents $m$ and $n$ are the **orders** with respect to each reactant, and they are found by experiment. In general they are not the coefficients of the balanced equation; they match them only for a single elementary step. To read an order from data, compare two experiments in which only one concentration changes:

- rate unchanged when the concentration doubles: zero order;
- rate doubles: first order;
- rate quadruples: second order.

The rate constant $k$ does not depend on concentration; it changes with temperature and with a catalyst.

### Dynamic equilibrium

In a closed system a reversible reaction slows in the forward direction as reactants are used up, while the reverse reaction speeds up as products build up. When the two rates become equal, the concentrations stop changing. This is **dynamic equilibrium**: both reactions continue, and the concentrations are constant, not equal.

### The equilibrium constant

For $a\mathrm{A} + b\mathrm{B} \rightleftharpoons c\mathrm{C} + d\mathrm{D}$,

$$K_c = \frac{[\mathrm{C}]^c\,[\mathrm{D}]^d}{[\mathrm{A}]^a\,[\mathrm{B}]^b}$$

with equilibrium concentrations, products on top and each raised to its coefficient. Pure solids and pure liquids, including water as the solvent, are left out. A large $K$ means the mixture at equilibrium is mostly products; a small $K$ means mostly reactants. The constant for the reverse reaction is $\frac{1}{K}$. **Only temperature changes $K$.**

The **reaction quotient** $Q$ has the same expression but uses the concentrations at any moment. Comparing it with $K$ tells you which way a mixture will move:

- $Q < K$: too few products, the reaction proceeds forward;
- $Q > K$: too many products, it proceeds in reverse;
- $Q = K$: the mixture is at equilibrium.

### Le Chatelier's principle

When an equilibrium is disturbed, the position shifts in the direction that partly undoes the disturbance.

| Disturbance | Shift | Does $K$ change? |
| --- | --- | --- |
| add a reactant or remove a product | forward | no |
| compress a gas mixture (raise pressure) | towards fewer moles of gas | no |
| raise the temperature | in the endothermic direction | yes |
| add a catalyst | none; equilibrium is reached sooner | no |

If both sides have the same number of moles of gas, pressure has no effect on the position. For temperature, treat heat as a reactant of the endothermic direction: if the forward reaction is exothermic, heating shifts it backwards and $K$ falls; cooling raises $K$.

### Fast is not the same as far

An industrial or biological process often needs both a good rate and a good yield, and the two can pull against each other. For an exothermic reaction a low temperature gives a larger $K$, but the reaction then runs slowly; a catalyst lets it run at a useful speed without spoiling the yield. When a question mixes the two ideas, sort each statement into "how fast" (rate, $E_a$, catalyst, $k$) or "how far" ($K$, position, yield) before judging it.
`,
  examples: [
    {
      id: 'example-rate-law-from-data',
      title: 'Reading a rate law from three experiments',
      problemMd: md`For the reaction of $\mathrm{A}$ with $\mathrm{B}$ at a fixed temperature:

| Experiment | $[\mathrm{A}]$ (mol/L) | $[\mathrm{B}]$ (mol/L) | Initial rate (mol/(L s)) |
| --- | --- | --- | --- |
| 1 | $0.10$ | $0.10$ | $2.0 \times 10^{-3}$ |
| 2 | $0.20$ | $0.10$ | $4.0 \times 10^{-3}$ |
| 3 | $0.10$ | $0.20$ | $8.0 \times 10^{-3}$ |

Find the rate law, the rate constant, and the rate when both concentrations are $0.20\ \text{mol/L}$.`,
      steps: [
        md`Experiments 1 and 2: only $[\mathrm{A}]$ doubles, and the rate doubles. The reaction is first order in $\mathrm{A}$.`,
        md`Experiments 1 and 3: only $[\mathrm{B}]$ doubles, and the rate goes up four times. It is second order in $\mathrm{B}$, so $\text{rate} = k[\mathrm{A}][\mathrm{B}]^2$.`,
        md`From experiment 1: $2.0 \times 10^{-3} = k \times 0.10 \times 0.010 = k \times 1.0 \times 10^{-3}$, so $k = 2.0\ \text{L}^2\,\text{mol}^{-2}\,\text{s}^{-1}$.`,
        md`With both at $0.20$: compared with experiment 1, $[\mathrm{A}]$ doubles ($\times 2$) and $[\mathrm{B}]$ doubles ($\times 4$), so the rate is $8 \times 2.0 \times 10^{-3} = 1.6 \times 10^{-2}\ \text{mol/(L s)}$. Check: $2.0 \times 0.20 \times 0.040 = 0.016$.`,
      ],
      answerMd: md`$\text{rate} = k[\mathrm{A}][\mathrm{B}]^2$ with $k = 2.0\ \text{L}^2\,\text{mol}^{-2}\,\text{s}^{-1}$; the new rate is $1.6 \times 10^{-2}\ \text{mol/(L s)}$. Taking the orders from equation coefficients instead of from the data is the usual error.`,
    },
    {
      id: 'example-k-and-q',
      title: 'Calculating K, then predicting the direction',
      problemMd: md`For $\mathrm{H_2(g) + I_2(g) \rightleftharpoons 2HI(g)}$ at a certain temperature, an equilibrium mixture contains $[\mathrm{H_2}] = 0.10$, $[\mathrm{I_2}] = 0.20$ and $[\mathrm{HI}] = 0.40\ \text{mol/L}$. Find $K_c$. Then, at the same temperature, a mixture has all three concentrations equal to $0.20\ \text{mol/L}$. Which way does it react?`,
      steps: [
        md`Write the expression with the coefficient 2 as a power: $K_c = \frac{[\mathrm{HI}]^2}{[\mathrm{H_2}][\mathrm{I_2}]}$.`,
        md`Substitute: $K_c = \frac{0.40^2}{0.10 \times 0.20} = \frac{0.16}{0.020} = 8.0$.`,
        md`For the second mixture, $Q = \frac{0.20^2}{0.20 \times 0.20} = 1.0$.`,
        md`$Q = 1.0$ is smaller than $K = 8.0$: there are too few products, so the reaction proceeds forward, forming more $\mathrm{HI}$.`,
      ],
      answerMd: md`$K_c = 8.0$, and the second mixture reacts forward until $Q$ reaches $8.0$. Forgetting the square gives $\frac{0.40}{0.020} = 20$, a wrong constant.`,
    },
    {
      id: 'example-le-chatelier-sulfur-trioxide',
      title: 'Four changes to one equilibrium',
      problemMd: md`In $\mathrm{2SO_2(g) + O_2(g) \rightleftharpoons 2SO_3(g)}$ the forward reaction is exothermic. Predict the effect on the amount of $\mathrm{SO_3}$ at equilibrium of: raising the pressure; raising the temperature; adding a catalyst; removing $\mathrm{SO_3}$ as it forms.`,
      steps: [
        md`Pressure: the left has $3$ moles of gas, the right $2$. Compressing favours fewer moles, so the position shifts right and more $\mathrm{SO_3}$ forms. $K$ is unchanged.`,
        md`Temperature: the reverse reaction is endothermic, so heating shifts the position left; less $\mathrm{SO_3}$, and $K$ decreases.`,
        md`Catalyst: both directions speed up by the same factor, so equilibrium is reached sooner but its composition does not change.`,
        md`Removing a product makes $Q < K$, so the reaction runs forward to replace it; more $\mathrm{SO_3}$ is made overall.`,
      ],
      answerMd: md`More $\mathrm{SO_3}$ with higher pressure or with removal of product; less with higher temperature; no change with a catalyst. "A catalyst increases the yield" is the tempting wrong statement.`,
    },
  ],
  traps: [
    {
      title: 'Taking orders from the balanced equation',
      md: md`The coefficients in $\mathrm{2A + B \rightarrow C}$ do not tell you that the rate law is $k[\mathrm{A}]^2[\mathrm{B}]$. Orders come from data. Use coefficients as exponents only in an equilibrium constant, or when a question says the reaction is a single elementary step.`,
    },
    {
      title: 'Believing a catalyst shifts an equilibrium',
      md: md`A catalyst changes how fast equilibrium is reached, not where it lies. It does not change $K$, $\Delta H$ or the yield at equilibrium. Options that promise "more product" from a catalyst are wrong.`,
    },
    {
      title: 'Thinking concentration or pressure changes K',
      md: md`Adding a reactant or compressing a gas shifts the **position**, and the concentrations rearrange until $Q$ equals the **same** $K$. Only a change of temperature gives a new value of $K$.`,
    },
    {
      title: 'Confusing equal rates with equal concentrations',
      md: md`At equilibrium the forward and reverse **rates** are equal. The concentrations are constant, but they are usually very different from one another; $K$ says by how much.`,
    },
  ],
  check: [
    {
      id: 'check-rate-change-factor',
      title: 'Changing two concentrations at once',
      topic: 'Reaction kinetics',
      stemMd: md`A reaction has the rate law $\text{rate} = k[\mathrm{X}]^2[\mathrm{Y}]$. At constant temperature, $[\mathrm{X}]$ is halved and $[\mathrm{Y}]$ is doubled. By what factor does the rate change?`,
      options: [
        { id: 'A', text: md`$\frac{1}{4}$`, note: md`Accounts for halving $[\mathrm{X}]$ but forgets that doubling $[\mathrm{Y}]$ doubles the rate.` },
        { id: 'B', text: md`$\frac{1}{2}$`, note: '' },
        { id: 'C', text: md`$1$ (no change)`, note: md`Treats both reactants as first order, so the halving and the doubling cancel; $\mathrm{X}$ is second order.` },
        { id: 'D', text: md`$2$`, note: md`Swaps the orders: $\frac{1}{2}$ for $\mathrm{X}$ and $2^2$ for $\mathrm{Y}$.` },
        { id: 'E', text: md`$8$`, note: md`Treats $[\mathrm{X}]$ as doubled rather than halved: $2^2 \times 2$.` },
      ],
      answer: 'B',
      workingMd: md`The new rate is $k\left(\frac{1}{2}[\mathrm{X}]\right)^2(2[\mathrm{Y}]) = \frac{1}{4} \times 2 \times k[\mathrm{X}]^2[\mathrm{Y}]$, so the rate is multiplied by $\frac{1}{2}$.`,
      lesson: 'Raise each concentration factor to its own order, then multiply the factors together.',
    },
    {
      id: 'check-what-changes-k',
      title: 'What changes the equilibrium constant?',
      topic: 'Chemical equilibrium',
      stemMd: md`For $\mathrm{N_2(g) + 3H_2(g) \rightleftharpoons 2NH_3(g)}$ the forward reaction is exothermic. Which change increases the value of $K_c$?`,
      options: [
        { id: 'A', text: md`Increasing the pressure by compressing the mixture`, note: md`This shifts the position towards $\mathrm{NH_3}$ (fewer moles of gas), but $K$ itself does not change with pressure.` },
        { id: 'B', text: md`Adding an iron catalyst`, note: md`A catalyst speeds up both directions equally; it changes neither the position nor $K$.` },
        { id: 'C', text: md`Lowering the temperature`, note: '' },
        { id: 'D', text: md`Adding more $\mathrm{N_2}$`, note: md`This shifts the position forward, but the concentrations rearrange to fit the same $K$.` },
        { id: 'E', text: md`Removing $\mathrm{NH_3}$ as it forms`, note: md`Removing a product drives the reaction forward without changing $K$; only temperature does that.` },
      ],
      answer: 'C',
      workingMd: md`Only temperature changes $K$. The forward reaction releases heat, so cooling favours it: the position moves towards $\mathrm{NH_3}$ and $K_c$ increases. The other changes move the position or the speed but leave $K_c$ as it was.`,
      lesson: 'Concentration and pressure move the position of equilibrium; only temperature moves the constant.',
    },
    {
      id: 'check-catalyst-effect',
      title: 'What a catalyst does',
      topic: 'Reaction kinetics',
      stemMd: md`A catalyst is added to a reversible reaction that has already reached equilibrium. Which statement is correct?`,
      options: [
        { id: 'A', text: md`The amount of product at equilibrium increases.`, note: md`A catalyst does not shift the position of equilibrium, so the yield is unchanged.` },
        { id: 'B', text: md`It lowers the activation energy of the forward reaction only.`, note: md`The catalysed pathway is shared by both directions, so the reverse barrier falls by the same amount.` },
        { id: 'C', text: md`The enthalpy change of the reaction becomes more negative.`, note: md`$\Delta H$ depends only on the energies of reactants and products, which a catalyst does not change.` },
        { id: 'D', text: md`The forward and reverse reactions speed up by the same factor.`, note: '' },
        { id: 'E', text: md`The equilibrium constant increases.`, note: md`$K$ changes only with temperature; a catalyst leaves it unchanged.` },
      ],
      answer: 'D',
      workingMd: md`A catalyst offers a pathway with a lower activation energy, and the barrier falls by the same amount in both directions, so both rates rise by the same factor. Since they stay equal, the system stays at equilibrium with the same composition, the same $K$ and the same $\Delta H$.`,
      lesson: 'A catalyst changes only how fast equilibrium is reached, never where it lies.',
    },
  ],
  takeaways: [
    'Rates rise with concentration, surface area, temperature and catalysts, because collisions with at least the activation energy become more frequent.',
    'Reaction orders come from experimental data, not from the coefficients of the balanced equation.',
    md`$K_c$ is products over reactants, each to the power of its coefficient; compare $Q$ with $K$ to find the direction of change.`,
    'Le Chatelier: concentration and pressure shift the position; only temperature changes K; a catalyst changes neither.',
  ],
  flashcards: [
    { front: 'Activation energy', back: 'The minimum energy a collision must have for the particles to react: the height of the barrier on an energy profile.' },
    { front: 'What a catalyst changes', back: md`It provides a pathway with a lower $E_a$ and speeds up both directions by the same factor. It does not change $\Delta H$, $K$ or the yield at equilibrium.` },
    { front: 'Reading an order from data', back: 'Double one concentration only: rate unchanged means zero order, doubled means first order, quadrupled means second order.' },
    { front: md`Writing $K_c$`, back:'Equilibrium concentrations of products over reactants, each raised to its coefficient; leave out pure solids and liquids.' },
    { front: 'Q compared with K', back: md`$Q < K$: the reaction goes forward. $Q > K$: it goes in reverse. $Q = K$: it is at equilibrium.` },
    { front: 'The only change that alters K', back: 'Temperature. Heating favours the endothermic direction; if the forward reaction is exothermic, K falls.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-reactions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const acidsBasesAndPhLesson: Lesson = {
  slug: 'acids-bases-and-ph',
  title: 'Acids, bases, pH and buffers',
  summary: 'Identify acids, bases and conjugate pairs, find pH from powers of ten without a calculator, predict the pH of salts and explain how buffers work.',
  minutes: 22,
  objectives: [
    'Identify Brønsted–Lowry acids, bases and conjugate pairs, and tell strong from weak.',
    'Calculate pH and pOH from concentrations written as powers of ten, including after neutralisation and dilution.',
    'Predict whether a salt solution is acidic, neutral or basic.',
    'Explain how a buffer resists changes in pH and find its pH from the acid-to-base ratio.',
  ],
  teachMd: md`
### Acids and bases as proton transfer

In the Brønsted–Lowry model an **acid** donates a proton ($\mathrm{H^+}$) and a **base** accepts one. In water a free proton does not exist; it attaches to a water molecule as $\mathrm{H_3O^+}$, often written $\mathrm{H^+}$ for short.

$$\mathrm{HCl + H_2O \rightarrow H_3O^+ + Cl^-} \qquad \mathrm{NH_3 + H_2O \rightleftharpoons NH_4^+ + OH^-}$$

When an acid loses a proton it becomes its **conjugate base**; when a base gains one it becomes its **conjugate acid**. A conjugate pair differs by exactly one $\mathrm{H^+}$: $\mathrm{CH_3COOH / CH_3COO^-}$, $\mathrm{NH_4^+ / NH_3}$, $\mathrm{H_2O / OH^-}$. Water acts as a base towards $\mathrm{HCl}$ and as an acid towards $\mathrm{NH_3}$, so it is **amphoteric**. The stronger an acid, the weaker its conjugate base. (In the wider Lewis model an acid accepts an electron pair and a base donates one.)

### Strong and weak

A **strong** acid ionises completely in water: $\mathrm{HCl}$, $\mathrm{HBr}$, $\mathrm{HI}$, $\mathrm{HNO_3}$, $\mathrm{HClO_4}$, and $\mathrm{H_2SO_4}$ for its first proton. Strong bases are the hydroxides of group 1 and the soluble hydroxides of group 2, such as $\mathrm{Ba(OH)_2}$. A **weak** acid ionises only partly and sets up an equilibrium; carboxylic acids and carbonic acid are examples, as ammonia and amines are of weak bases. Its strength is measured by the acid dissociation constant

$$K_a = \frac{[\mathrm{H_3O^+}][\mathrm{A^-}]}{[\mathrm{HA}]} \qquad \mathrm{p}K_a = -\log K_a$$

A larger $K_a$, or a smaller $\mathrm{p}K_a$, means a stronger acid. "Strong" describes the extent of ionisation, not the concentration: a dilute solution of a strong acid is still a strong acid.

### Water and the pH scale

Water ionises very slightly, and at $25\ ^\circ\text{C}$

$$K_w = [\mathrm{H_3O^+}][\mathrm{OH^-}] = 1.0 \times 10^{-14}$$

$$\mathrm{pH} = -\log[\mathrm{H_3O^+}] \qquad \mathrm{pOH} = -\log[\mathrm{OH^-}] \qquad \mathrm{pH} + \mathrm{pOH} = 14$$

Neutral water has $[\mathrm{H_3O^+}] = [\mathrm{OH^-}] = 10^{-7}\ \text{mol/L}$, so pH 7 at $25\ ^\circ\text{C}$. Each pH unit is a factor of ten in $[\mathrm{H_3O^+}]$: a solution at pH 3 is a hundred times more acidic than one at pH 5.

### pH from powers of ten

With no calculator, write every concentration as a power of ten.

- $0.01\ \text{mol/L}$ $\mathrm{HCl}$: $[\mathrm{H^+}] = 10^{-2}$, so pH 2.
- $0.001\ \text{mol/L}$ $\mathrm{NaOH}$: $[\mathrm{OH^-}] = 10^{-3}$, pOH 3, so pH 11.
- $0.005\ \text{mol/L}$ $\mathrm{Ba(OH)_2}$: two $\mathrm{OH^-}$ per formula unit give $0.010 = 10^{-2}$, pOH 2, pH 12.

When the number in front is not 1, the pH lies between two integers. Since $\log 2 \approx 0.30$, $\log 3 \approx 0.48$ and $\log 5 \approx 0.70$, a concentration of $2 \times 10^{-3}$ gives $\mathrm{pH} = 3 - 0.30 = 2.7$. For a weak acid that ionises only slightly,

$$[\mathrm{H^+}] \approx \sqrt{K_a\,c}$$

Diluting a strong acid tenfold raises its pH by one unit, but dilution can never carry an acid past pH 7: near neutrality the ions from water itself take over.

### Neutralisation and the pH of salts

An acid and a base react to give a salt and water; the net ionic reaction for a strong acid with a strong base is $\mathrm{H^+ + OH^- \rightarrow H_2O}$. At the **equivalence point** the moles of $\mathrm{H^+}$ supplied equal the moles of $\mathrm{OH^-}$. When unequal amounts are mixed, find the excess in moles, then divide by the **total** volume.

The salt left over is not always neutral:

| Salt made from | Example | Solution |
| --- | --- | --- |
| strong acid + strong base | $\mathrm{NaCl}$, $\mathrm{KNO_3}$ | neutral, pH 7 |
| weak acid + strong base | $\mathrm{CH_3COONa}$ | basic: $\mathrm{CH_3COO^-}$ takes $\mathrm{H^+}$ from water |
| strong acid + weak base | $\mathrm{NH_4Cl}$ | acidic: $\mathrm{NH_4^+}$ gives $\mathrm{H^+}$ to water |

### Buffers

A **buffer** contains a weak acid and its conjugate base in comparable amounts, for example ethanoic acid with sodium ethanoate. Added $\mathrm{H^+}$ is taken up by the base ($\mathrm{A^- + H^+ \rightarrow HA}$); added $\mathrm{OH^-}$ is taken up by the acid ($\mathrm{HA + OH^- \rightarrow A^- + H_2O}$). The ratio of the two changes only a little, so the pH barely moves. Its pH is given by the Henderson–Hasselbalch equation:

$$\mathrm{pH} = \mathrm{p}K_a + \log\frac{[\mathrm{A^-}]}{[\mathrm{HA}]}$$

With equal amounts of acid and base, $\mathrm{pH} = \mathrm{p}K_a$; a tenfold excess of base gives $\mathrm{p}K_a + 1$, and a tenfold excess of acid gives $\mathrm{p}K_a - 1$. A buffer works best within about one unit of its $\mathrm{p}K_a$. In blood, carbonic acid and hydrogencarbonate form the main buffer that holds the pH close to 7.4.
`,
  examples: [
    {
      id: 'example-partial-neutralisation',
      title: 'pH after mixing an acid and a base',
      problemMd: md`$50.0\ \text{mL}$ of $0.10\ \text{mol/L}$ $\mathrm{HCl}$ is mixed with $50.0\ \text{mL}$ of $0.080\ \text{mol/L}$ $\mathrm{NaOH}$. What is the pH of the mixture?`,
      steps: [
        md`Work in millimoles: $\mathrm{H^+}$ is $50.0 \times 0.10 = 5.0\ \text{mmol}$ and $\mathrm{OH^-}$ is $50.0 \times 0.080 = 4.0\ \text{mmol}$.`,
        md`They neutralise one to one, leaving $5.0 - 4.0 = 1.0\ \text{mmol}$ of $\mathrm{H^+}$ in excess.`,
        md`Divide by the total volume, $100\ \text{mL}$: $[\mathrm{H^+}] = \frac{1.0}{100} = 0.010\ \text{mol/L} = 10^{-2}\ \text{mol/L}$.`,
        md`$\mathrm{pH} = -\log 10^{-2} = 2$.`,
      ],
      answerMd: md`The pH is 2. Dividing the excess by $50\ \text{mL}$ instead of the total $100\ \text{mL}$ gives $0.020\ \text{mol/L}$ and a pH of about 1.7, which is the usual slip.`,
    },
    {
      id: 'example-weak-acid-ph',
      title: 'pH of a weak acid',
      problemMd: md`A weak acid $\mathrm{HA}$ has $K_a = 1.0 \times 10^{-6}$. What is the pH of a $0.010\ \text{mol/L}$ solution?`,
      steps: [
        md`The acid ionises only slightly, so use $[\mathrm{H^+}] \approx \sqrt{K_a\,c}$.`,
        md`$K_a\,c = 1.0 \times 10^{-6} \times 1.0 \times 10^{-2} = 1.0 \times 10^{-8}$, and its square root is $1.0 \times 10^{-4}\ \text{mol/L}$.`,
        md`$\mathrm{pH} = 4$.`,
        md`Check the approximation: $10^{-4}$ is $1\%$ of $10^{-2}$, so very little of the acid has ionised, as the formula assumes.`,
      ],
      answerMd: md`The pH is 4. Treating the acid as strong gives $[\mathrm{H^+}] = 10^{-2}$ and pH 2, which ignores the small $K_a$.`,
    },
    {
      id: 'example-buffer-add-acid',
      title: 'A buffer meets a strong acid',
      problemMd: md`One litre of buffer contains $0.10\ \text{mol}$ of ethanoic acid and $0.10\ \text{mol}$ of sodium ethanoate ($\mathrm{p}K_a = 4.76$). What is its pH, and roughly what is the pH after $0.010\ \text{mol}$ of $\mathrm{HCl}$ is added? Compare with adding the same $\mathrm{HCl}$ to one litre of pure water.`,
      steps: [
        md`Equal amounts of acid and base: $\mathrm{pH} = \mathrm{p}K_a + \log 1 = 4.76$.`,
        md`The added $\mathrm{H^+}$ reacts with ethanoate: the base falls to $0.09\ \text{mol}$ and the acid rises to $0.11\ \text{mol}$.`,
        md`$\mathrm{pH} = 4.76 + \log\frac{0.09}{0.11}$. The ratio is about $0.82$, just under 1, so its logarithm is a small negative number, about $-0.09$: the pH is about $4.67$, close to $4.7$.`,
        md`In pure water the same acid gives $[\mathrm{H^+}] = 0.010 = 10^{-2}\ \text{mol/L}$, so the pH would drop from 7 to 2.`,
      ],
      answerMd: md`The buffer starts at pH 4.76 and falls only to about 4.7, while pure water would fall from 7 to 2. Answering "about 2" applies the strong-acid calculation and ignores the ethanoate that consumes the added $\mathrm{H^+}$.`,
    },
  ],
  traps: [
    {
      title: 'Reading pH as if it were a concentration',
      md: md`pH is a logarithm with a minus sign. A lower pH means **more** $\mathrm{H^+}$, and one unit is a factor of ten. Diluting an acid tenfold raises its pH by one; it does not divide the pH by ten.`,
    },
    {
      title: 'Answering with pOH',
      md: md`For a base you usually find $[\mathrm{OH^-}]$ first, which gives the pOH. Finish with $\mathrm{pH} = 14 - \mathrm{pOH}$. A base whose answer comes out below 7 is a sign that this step was skipped.`,
    },
    {
      title: 'Counting hydroxides or protons per formula unit wrongly',
      md: md`$0.01\ \text{mol/L}$ $\mathrm{Ba(OH)_2}$ gives $0.02\ \text{mol/L}$ of $\mathrm{OH^-}$, not $0.01$. Check the formula before turning the concentration into a power of ten.`,
    },
    {
      title: 'Assuming every salt is neutral',
      md: md`A salt is neutral only when both its parent acid and parent base are strong. Sodium ethanoate is basic and ammonium chloride is acidic; ask which parent was weak.`,
    },
  ],
  check: [
    {
      id: 'check-dilute-strong-acid',
      title: 'Diluting a strong acid',
      topic: 'pH',
      stemMd: md`$100\ \text{mL}$ of hydrochloric acid at pH 2 is diluted with water to a total volume of $1.0\ \text{L}$. What is the pH of the diluted solution?`,
      options: [
        { id: 'A', text: md`1`, note: md`Dilution lowers $[\mathrm{H^+}]$, which raises the pH; it cannot make the solution more acidic.` },
        { id: 'B', text: md`2`, note: md`Treats pH as unchanged by dilution, but $[\mathrm{H^+}]$ has fallen tenfold.` },
        { id: 'C', text: md`3`, note: '' },
        { id: 'D', text: md`7`, note: md`One tenfold dilution moves the pH by one unit; it would take far more water to approach neutrality, and an acid never passes pH 7.` },
        { id: 'E', text: md`11`, note: md`This is the pOH of the diluted solution, not its pH.` },
      ],
      answer: 'C',
      workingMd: md`At pH 2, $[\mathrm{H^+}] = 10^{-2}\ \text{mol/L}$. The volume grows from $0.1$ to $1.0\ \text{L}$, ten times, so $[\mathrm{H^+}] = 10^{-3}\ \text{mol/L}$ and the pH is 3.`,
      lesson: 'Each tenfold dilution of a strong acid raises its pH by one unit.',
    },
    {
      id: 'check-basic-salt',
      title: 'Which salt solution is basic?',
      topic: 'Acids and bases',
      stemMd: md`Which of these $0.1\ \text{mol/L}$ aqueous solutions has a pH greater than 7 at $25\ ^\circ\text{C}$?`,
      options: [
        { id: 'A', text: md`$\mathrm{NH_4Cl}$`, note: md`The ammonium ion is a weak acid (the conjugate acid of ammonia), so this solution is acidic.` },
        { id: 'B', text: md`$\mathrm{CH_3COONa}$`, note: '' },
        { id: 'C', text: md`$\mathrm{NaCl}$`, note: md`Both parents, $\mathrm{HCl}$ and $\mathrm{NaOH}$, are strong, so the solution is neutral.` },
        { id: 'D', text: md`$\mathrm{KNO_3}$`, note: md`A salt of a strong acid and a strong base; neither ion reacts with water, so the pH is 7.` },
        { id: 'E', text: md`$\mathrm{HNO_3}$`, note: md`A strong acid, with a pH of about 1 at this concentration.` },
      ],
      answer: 'B',
      workingMd: md`Sodium ethanoate is the salt of a weak acid and a strong base. The ethanoate ion is a base: $\mathrm{CH_3COO^- + H_2O \rightleftharpoons CH_3COOH + OH^-}$, which makes the solution basic.`,
      lesson: 'A salt is basic when its anion is the conjugate base of a weak acid.',
    },
    {
      id: 'check-buffer-ratio',
      title: 'pH of a buffer',
      topic: 'Buffers',
      stemMd: md`A buffer contains a weak acid $\mathrm{HA}$ at $0.010\ \text{mol/L}$ ($K_a = 1.0 \times 10^{-5}$) and its salt $\mathrm{NaA}$ at $0.10\ \text{mol/L}$. What is its pH?`,
      options: [
        { id: 'A', text: md`3.5`, note: md`This is the pH of the weak acid alone: $[\mathrm{H^+}] = \sqrt{10^{-5} \times 10^{-2}} \approx 3.2 \times 10^{-4}\ \text{mol/L}$, pH about 3.5; it ignores the salt.` },
        { id: 'B', text: md`4`, note: md`The ratio has been inverted: $\log\frac{0.010}{0.10} = -1$ would apply if the acid were in excess.` },
        { id: 'C', text: md`5`, note: md`This is the $\mathrm{p}K_a$, the pH only when acid and base are equal; here the base is ten times the acid.` },
        { id: 'D', text: md`6`, note: '' },
        { id: 'E', text: md`8`, note: md`Subtracts the correct pH from 14, as if the equation gave the pOH; it gives the pH directly.` },
      ],
      answer: 'D',
      workingMd: md`$\mathrm{p}K_a = -\log(1.0 \times 10^{-5}) = 5$. The ratio $\frac{[\mathrm{A^-}]}{[\mathrm{HA}]} = \frac{0.10}{0.010} = 10$, and $\log 10 = 1$, so $\mathrm{pH} = 5 + 1 = 6$.`,
      lesson: 'In a buffer, more base than acid puts the pH above the pKa, by one unit for each factor of ten.',
    },
  ],
  takeaways: [
    'An acid donates a proton and a base accepts one; a conjugate pair differs by one proton.',
    md`$\mathrm{pH} = -\log[\mathrm{H_3O^+}]$ and $\mathrm{pH} + \mathrm{pOH} = 14$ at $25\ ^\circ\text{C}$; each unit is a factor of ten.`,
    'Salts of a weak acid and a strong base are basic; salts of a strong acid and a weak base are acidic.',
    md`A buffer is a weak acid with its conjugate base; $\mathrm{pH} = \mathrm{p}K_a + \log\frac{[\mathrm{A^-}]}{[\mathrm{HA}]}$.`,
  ],
  flashcards: [
    { front: 'Brønsted–Lowry acid and base', back: 'An acid donates a proton (H⁺); a base accepts one. A conjugate pair differs by exactly one proton.' },
    { front: 'Ionic product of water at 25 °C', back: md`$K_w = [\mathrm{H_3O^+}][\mathrm{OH^-}] = 1.0 \times 10^{-14}$, so $\mathrm{pH} + \mathrm{pOH} = 14$.` },
    { front: 'pH of a 0.001 mol/L strong base', back: md`$[\mathrm{OH^-}] = 10^{-3}$, so pOH is 3 and pH is $14 - 3 = 11$.` },
    { front: 'pH of a weak acid', back: md`$[\mathrm{H^+}] \approx \sqrt{K_a\,c}$, valid when only a small fraction of the acid ionises.` },
    { front: 'Sodium ethanoate solution: acidic, neutral or basic?', back: 'Basic: the ethanoate ion is the conjugate base of a weak acid and takes protons from water.' },
    { front: 'Henderson–Hasselbalch equation', back: md`$\mathrm{pH} = \mathrm{p}K_a + \log\frac{[\mathrm{A^-}]}{[\mathrm{HA}]}$; with equal acid and base, $\mathrm{pH} = \mathrm{p}K_a$.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-reactions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const redoxReactionsLesson: Lesson = {
  slug: 'redox-reactions',
  title: 'Redox reactions and oxidation numbers',
  summary: 'Assign oxidation numbers, spot what is oxidised and reduced, balance redox equations with half-reactions and read standard electrode potentials.',
  minutes: 22,
  objectives: [
    'Assign oxidation numbers to atoms in molecules and ions.',
    'Identify the species oxidised and reduced, and the oxidising and reducing agents.',
    'Balance a redox equation in acid solution using half-reactions.',
    'Use standard electrode potentials to find the cell voltage and the direction of a reaction.',
  ],
  teachMd: md`
### Oxidation and reduction are electron transfer

**Oxidation** is the loss of electrons; **reduction** is the gain of electrons. A common memory aid is "OIL RIG": oxidation is loss, reduction is gain. The two always happen together, because the electrons lost by one species are gained by another, so the reactions are called **redox** reactions.

$$\mathrm{Zn + Cu^{2+} \rightarrow Zn^{2+} + Cu}$$

Zinc loses two electrons and is oxidised; the copper(II) ion gains them and is reduced. The species that causes the oxidation, by taking electrons, is the **oxidising agent**, and it is itself reduced. The species that gives electrons away is the **reducing agent**, and it is itself oxidised. Here $\mathrm{Cu^{2+}}$ is the oxidising agent and $\mathrm{Zn}$ the reducing agent. Mixing up "is oxidised" and "is the oxidising agent" is the most common error in this topic.

### Oxidation numbers

When electrons are shared rather than fully transferred, oxidation numbers keep the account. Apply these rules in order:

1. An atom in an element has oxidation number 0 ($\mathrm{O_2}$, $\mathrm{Fe}$, $\mathrm{Cl_2}$).
2. A monatomic ion has its charge ($\mathrm{Na^+}$ is $+1$, $\mathrm{S^{2-}}$ is $-2$).
3. Fluorine is always $-1$. Oxygen is $-2$, except in peroxides such as $\mathrm{H_2O_2}$ ($-1$) and with fluorine.
4. Hydrogen is $+1$, except in metal hydrides such as $\mathrm{NaH}$ ($-1$). Group 1 metals are $+1$, group 2 metals $+2$.
5. The oxidation numbers add up to the overall charge: 0 for a neutral compound, the ion's charge for an ion.

For example, in $\mathrm{KMnO_4}$: $+1 + x + 4(-2) = 0$, so manganese is $+7$. In $\mathrm{SO_4^{2-}}$: $x + 4(-2) = -2$, so sulfur is $+6$. In $\mathrm{NH_3}$ nitrogen is $-3$; in $\mathrm{HNO_3}$ it is $+5$. An **increase** in oxidation number is oxidation; a **decrease** is reduction.

Sometimes one element does both. In $\mathrm{Cl_2 + 2NaOH \rightarrow NaCl + NaClO + H_2O}$ chlorine goes from 0 to $-1$ in $\mathrm{NaCl}$ and to $+1$ in $\mathrm{NaClO}$: this is **disproportionation**.

### Balancing with half-reactions

A redox equation must balance both atoms and charge. In acid solution:

1. Split the reaction into an oxidation half and a reduction half.
2. Balance the atoms other than O and H.
3. Balance O with $\mathrm{H_2O}$, then H with $\mathrm{H^+}$.
4. Balance charge with electrons.
5. Multiply the halves so that the electrons lost equal the electrons gained, then add them and cancel.

The number of electrons in each half equals the change in oxidation number times the number of atoms that change, which gives a quick check.

### Electrochemical cells

In a **galvanic** (voltaic) cell a spontaneous redox reaction is split between two electrodes, so the electrons travel through a wire and do work. Oxidation happens at the **anode** and reduction at the **cathode** ("an ox, red cat"). In a galvanic cell the anode is the negative electrode. A salt bridge lets ions move to keep both solutions neutral.

Each half-reaction has a **standard reduction potential** $E^\circ$, measured against the hydrogen electrode, which is set at $0\ \text{V}$. The more positive $E^\circ$, the more strongly that species tends to be reduced, so the stronger an oxidising agent it is.

| Half-reaction | $E^\circ$ (V) |
| --- | --- |
| $\mathrm{Ag^+ + e^- \rightarrow Ag}$ | $+0.80$ |
| $\mathrm{Cu^{2+} + 2e^- \rightarrow Cu}$ | $+0.34$ |
| $\mathrm{2H^+ + 2e^- \rightarrow H_2}$ | $0.00$ |
| $\mathrm{Zn^{2+} + 2e^- \rightarrow Zn}$ | $-0.76$ |

$$E^\circ_{\text{cell}} = E^\circ_{\text{cathode}} - E^\circ_{\text{anode}}$$

The half with the higher $E^\circ$ is reduced (cathode); the other runs in reverse as an oxidation (anode). A positive $E^\circ_{\text{cell}}$ means the reaction is spontaneous as written. For zinc and copper, $0.34 - (-0.76) = 1.10\ \text{V}$. Because $E^\circ$ is a property of each half-reaction, not of the amount reacting, it is **not** multiplied when a half-equation is multiplied to balance electrons. The same table explains displacement: a metal with a more negative $E^\circ$ displaces the ions of a metal with a more positive one, so zinc dropped into copper sulfate solution becomes coated with copper.

In an **electrolytic** cell an external power supply drives a non-spontaneous reaction, as in electroplating or the electrolysis of water. Oxidation is still at the anode and reduction at the cathode, but here the anode is the positive electrode.
`,
  examples: [
    {
      id: 'example-copper-nitric-acid',
      title: 'Who is oxidised, who is reduced?',
      problemMd: md`In $\mathrm{Cu + 4HNO_3 \rightarrow Cu(NO_3)_2 + 2NO_2 + 2H_2O}$, which element is oxidised, which is reduced, and what are the oxidising and reducing agents?`,
      steps: [
        md`Copper: 0 in the metal, $+2$ in $\mathrm{Cu(NO_3)_2}$. Its oxidation number rises, so copper is oxidised.`,
        md`Nitrogen in $\mathrm{HNO_3}$: $+1 + x + 3(-2) = 0$, so $x = +5$. In $\mathrm{NO_2}$: $x + 2(-2) = 0$, so $+4$. In the nitrate of the product it stays $+5$.`,
        md`So only the nitrogen that ends up in $\mathrm{NO_2}$ is reduced, from $+5$ to $+4$. Hydrogen ($+1$) and oxygen ($-2$) do not change.`,
        md`Check the electrons: one copper loses 2; two nitrogen atoms each gain 1, so 2 are gained. They match.`,
      ],
      answerMd: md`Copper is oxidised (it is the reducing agent); nitrogen is reduced from $+5$ to $+4$, so nitric acid is the oxidising agent. Calling copper "the oxidising agent" because it is oxidised is the tempting slip; and note that half of the nitric acid only supplies nitrate ions without being reduced.`,
    },
    {
      id: 'example-balance-permanganate',
      title: 'Balancing permanganate with iron(II)',
      problemMd: md`Balance the reaction of $\mathrm{MnO_4^-}$ with $\mathrm{Fe^{2+}}$ in acid solution, which gives $\mathrm{Mn^{2+}}$ and $\mathrm{Fe^{3+}}$.`,
      steps: [
        md`Oxidation half: $\mathrm{Fe^{2+} \rightarrow Fe^{3+} + e^-}$.`,
        md`Reduction half: balance O with water, $\mathrm{MnO_4^- \rightarrow Mn^{2+} + 4H_2O}$; then H with protons, $\mathrm{MnO_4^- + 8H^+ \rightarrow Mn^{2+} + 4H_2O}$.`,
        md`Balance charge: the left is $-1 + 8 = +7$, the right $+2$, so add 5 electrons on the left: $\mathrm{MnO_4^- + 8H^+ + 5e^- \rightarrow Mn^{2+} + 4H_2O}$. This matches the change of manganese from $+7$ to $+2$.`,
        md`Multiply the iron half by 5 and add: $\mathrm{MnO_4^- + 5Fe^{2+} + 8H^+ \rightarrow Mn^{2+} + 5Fe^{3+} + 4H_2O}$.`,
        md`Check charge: left $-1 + 10 + 8 = +17$; right $+2 + 15 = +17$. Atoms balance too.`,
      ],
      answerMd: md`$\mathrm{MnO_4^- + 5Fe^{2+} + 8H^+ \rightarrow Mn^{2+} + 5Fe^{3+} + 4H_2O}$: one permanganate oxidises five iron(II) ions. Writing a one-to-one ratio balances the atoms of Mn and Fe but not the electrons.`,
    },
    {
      id: 'example-zinc-silver-cell',
      title: 'Voltage of a zinc–silver cell',
      problemMd: md`A galvanic cell is made from a zinc electrode in $\mathrm{Zn^{2+}}$ solution and a silver electrode in $\mathrm{Ag^+}$ solution. Using $E^\circ(\mathrm{Ag^+/Ag}) = +0.80\ \text{V}$ and $E^\circ(\mathrm{Zn^{2+}/Zn}) = -0.76\ \text{V}$, find the anode, the cathode, the overall reaction and $E^\circ_{\text{cell}}$.`,
      steps: [
        md`Silver has the higher $E^\circ$, so $\mathrm{Ag^+}$ is reduced: the silver electrode is the cathode.`,
        md`Zinc is oxidised, $\mathrm{Zn \rightarrow Zn^{2+} + 2e^-}$: the zinc electrode is the anode.`,
        md`Balance electrons by doubling the silver half: $\mathrm{Zn + 2Ag^+ \rightarrow Zn^{2+} + 2Ag}$.`,
        md`$E^\circ_{\text{cell}} = 0.80 - (-0.76) = 1.56\ \text{V}$. The silver potential is not doubled, because $E^\circ$ does not depend on the amount.`,
      ],
      answerMd: md`Anode zinc, cathode silver, $\mathrm{Zn + 2Ag^+ \rightarrow Zn^{2+} + 2Ag}$, $E^\circ_{\text{cell}} = 1.56\ \text{V}$. Doubling the silver value gives $2.36\ \text{V}$, and adding the potentials as written gives $0.04\ \text{V}$; both are wrong.`,
    },
  ],
  traps: [
    {
      title: 'Confusing "oxidised" with "oxidising agent"',
      md: md`The oxidising agent is the species that is **reduced**: it takes electrons and so oxidises something else. Before choosing, write which species loses electrons and which gains them, then name the agents.`,
    },
    {
      title: 'Forgetting how many atoms change',
      md: md`In $\mathrm{Cr_2O_7^{2-}}$ each chromium goes from $+6$ to $+3$, but there are two of them, so one dichromate gains 6 electrons, not 3. Multiply the change per atom by the number of atoms.`,
    },
    {
      title: 'Multiplying electrode potentials',
      md: md`When you double a half-equation to balance electrons, its $E^\circ$ stays the same. Only the subtraction cathode minus anode is needed.`,
    },
    {
      title: 'Applying oxygen = −2 everywhere',
      md: md`In hydrogen peroxide oxygen is $-1$, and in metal hydrides hydrogen is $-1$. Check for these exceptions before solving for the unknown atom.`,
    },
  ],
  check: [
    {
      id: 'check-nitrogen-plus-three',
      title: 'Nitrogen at +3',
      topic: 'Oxidation numbers',
      stemMd: md`In which species does nitrogen have the oxidation number $+3$?`,
      options: [
        { id: 'A', text: md`$\mathrm{NH_4^+}$`, note: md`$x + 4(+1) = +1$ gives $x = -3$: the sign is the opposite.` },
        { id: 'B', text: md`$\mathrm{N_2O}$`, note: md`$2x + (-2) = 0$ gives $x = +1$; there are two nitrogen atoms sharing the $+2$.` },
        { id: 'C', text: md`$\mathrm{NO_2^-}$`, note: '' },
        { id: 'D', text: md`$\mathrm{NO_2}$`, note: md`A neutral molecule: $x + 2(-2) = 0$ gives $+4$. Its formula looks like the nitrite ion but it carries no charge.` },
        { id: 'E', text: md`$\mathrm{NO_3^-}$`, note: md`$x + 3(-2) = -1$ gives $+5$, the nitrogen of nitrate and nitric acid.` },
      ],
      answer: 'C',
      workingMd: md`For the nitrite ion, $x + 2(-2) = -1$, so $x = +3$. The others give $-3$ ($\mathrm{NH_4^+}$), $+1$ ($\mathrm{N_2O}$), $+4$ ($\mathrm{NO_2}$) and $+5$ ($\mathrm{NO_3^-}$).`,
      lesson: 'Set the sum of oxidation numbers equal to the overall charge, and watch whether the species is an ion.',
    },
    {
      id: 'check-thermite-oxidising-agent',
      title: 'Finding the oxidising agent',
      topic: 'Redox reactions',
      stemMd: md`In the reaction $\mathrm{2Al + Fe_2O_3 \rightarrow Al_2O_3 + 2Fe}$, which substance is the oxidising agent?`,
      options: [
        { id: 'A', text: md`$\mathrm{Al}$`, note: md`Aluminium goes from 0 to $+3$: it is oxidised, which makes it the reducing agent.` },
        { id: 'B', text: md`$\mathrm{Fe_2O_3}$`, note: '' },
        { id: 'C', text: md`$\mathrm{Al_2O_3}$`, note: md`A product: the agents are among the reactants, the species that give or take electrons.` },
        { id: 'D', text: md`$\mathrm{Fe}$`, note: md`Iron metal is what the reduction produces, not the agent that causes the oxidation.` },
        { id: 'E', text: md`Oxygen`, note: md`Oxygen is $-2$ in both oxides, so it is neither oxidised nor reduced here.` },
      ],
      answer: 'B',
      workingMd: md`Iron goes from $+3$ in $\mathrm{Fe_2O_3}$ to 0 in the metal, so it is reduced; the compound containing it, iron(III) oxide, takes electrons from aluminium and is the oxidising agent. Aluminium (0 to $+3$) is the reducing agent.`,
      lesson: 'The oxidising agent is the reactant whose oxidation number goes down.',
    },
    {
      id: 'check-dichromate-iron-ratio',
      title: 'Dichromate and iron(II)',
      topic: 'Balancing redox equations',
      stemMd: md`In acid solution, $\mathrm{Cr_2O_7^{2-}}$ oxidises $\mathrm{Fe^{2+}}$ to $\mathrm{Fe^{3+}}$ and is reduced to $\mathrm{Cr^{3+}}$. In the balanced equation, how many $\mathrm{Fe^{2+}}$ ions react with one $\mathrm{Cr_2O_7^{2-}}$ ion?`,
      options: [
        { id: 'A', text: md`1`, note: md`Assumes a one-to-one ratio without balancing electrons; one dichromate gains six electrons and each iron gives one.` },
        { id: 'B', text: md`2`, note: md`Matches the two chromium atoms but not the electrons: each chromium gains three.` },
        { id: 'C', text: md`3`, note: md`Three is the change for one chromium atom; the dichromate ion contains two.` },
        { id: 'D', text: md`6`, note: '' },
        { id: 'E', text: md`14`, note: md`Fourteen is the number of $\mathrm{H^+}$ in the balanced equation, not of $\mathrm{Fe^{2+}}$.` },
      ],
      answer: 'D',
      workingMd: md`Chromium goes from $+6$ to $+3$, a gain of 3 electrons per atom, and there are two atoms: 6 electrons per dichromate. Each $\mathrm{Fe^{2+}}$ loses 1, so six are needed: $\mathrm{Cr_2O_7^{2-} + 14H^+ + 6Fe^{2+} \rightarrow 2Cr^{3+} + 6Fe^{3+} + 7H_2O}$. Charge check: $-2 + 14 + 12 = +24$ on the left, $6 + 18 = +24$ on the right.`,
      lesson: 'Balance electrons first: change per atom times atoms per ion, matched against the electrons the other half supplies.',
    },
  ],
  takeaways: [
    'Oxidation is loss of electrons (oxidation number rises); reduction is gain (oxidation number falls).',
    'The oxidising agent is reduced and the reducing agent is oxidised.',
    md`Balance redox equations in acid with half-reactions: atoms, then O with $\mathrm{H_2O}$, H with $\mathrm{H^+}$, charge with electrons.`,
    md`$E^\circ_{\text{cell}} = E^\circ_{\text{cathode}} - E^\circ_{\text{anode}}$; positive means spontaneous, and potentials are never multiplied.`,
  ],
  flashcards: [
    { front: 'OIL RIG', back: 'Oxidation is loss of electrons, reduction is gain of electrons. The two always happen together.' },
    { front: 'Oxidising agent', back: 'The species that takes electrons from another. It is itself reduced: its oxidation number goes down.' },
    { front: 'Sum of oxidation numbers', back: 'Zero in a neutral compound; equal to the charge in an ion. Use it to find the one unknown atom.' },
    { front: 'Balancing a half-reaction in acid', back: md`Balance the main atoms, then O with $\mathrm{H_2O}$, then H with $\mathrm{H^+}$, then charge with electrons.` },
    { front: 'Anode and cathode', back: 'Oxidation always happens at the anode, reduction at the cathode. In a galvanic cell the anode is negative; in electrolysis it is positive.' },
    { front: 'Standard cell potential', back: md`$E^\circ_{\text{cell}} = E^\circ_{\text{cathode}} - E^\circ_{\text{anode}}$; the half with the higher $E^\circ$ is reduced. A positive value means spontaneous.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-reactions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const organicCompoundsAndFunctionalGroupsLesson: Lesson = {
  slug: 'organic-compounds-and-functional-groups',
  title: 'Organic compounds and functional groups',
  summary: 'Recognise hydrocarbon families and functional groups, name simple organic compounds, and explain their boiling points, solubility and acidity.',
  minutes: 20,
  objectives: [
    'Recognise alkanes, alkenes, alkynes and arenes from structures and general formulas.',
    'Identify the common functional groups and name simple compounds that contain them.',
    'Explain differences in boiling point, solubility and acid–base behaviour from the functional groups present.',
  ],
  teachMd: md`
### Why carbon builds so many compounds

Carbon has four valence electrons and forms four covalent bonds. It bonds strongly to other carbon atoms, so it builds chains, branches and rings, with single, double or triple bonds. The geometry follows the bonding: a carbon with four single bonds is tetrahedral (about $109.5^\circ$, $sp^3$); one with a double bond is trigonal planar ($120^\circ$, $sp^2$); one with a triple bond is linear ($180^\circ$, $sp$).

### Hydrocarbon families

Hydrocarbons contain only carbon and hydrogen.

| Family | Bonding | General formula | Example |
| --- | --- | --- | --- |
| alkanes | single bonds only (saturated) | $\mathrm{C_nH_{2n+2}}$ | propane, $\mathrm{C_3H_8}$ |
| alkenes | one $\mathrm{C{=}C}$ | $\mathrm{C_nH_{2n}}$ | propene, $\mathrm{C_3H_6}$ |
| alkynes | one $\mathrm{C{\equiv}C}$ | $\mathrm{C_nH_{2n-2}}$ | propyne, $\mathrm{C_3H_4}$ |
| cycloalkanes | a ring of single bonds | $\mathrm{C_nH_{2n}}$ | cyclohexane, $\mathrm{C_6H_{12}}$ |
| arenes | a benzene ring | — | benzene, $\mathrm{C_6H_6}$ |

Alkenes, alkynes and arenes are **unsaturated**. Note that an alkene and a cycloalkane share a general formula, so a formula alone cannot always tell them apart. In benzene the six electrons of the three double bonds are **delocalised** around the ring, which makes it unusually stable. Each family is a **homologous series**: its members differ by $\mathrm{CH_2}$, share a general formula and similar chemistry, and their physical properties change gradually with chain length.

The chain length is named by a stem: meth- (1), eth- (2), prop- (3), but- (4), pent- (5), hex- (6), hept- (7), oct- (8).

### Functional groups

A functional group is the atom or group of atoms that gives a compound its typical reactions. $\mathrm{R}$ stands for the rest of the molecule.

| Group | Structure | Name ending | Example |
| --- | --- | --- | --- |
| haloalkane | $\mathrm{R{-}X}$ (X = F, Cl, Br, I) | prefix chloro-, bromo- | chloroethane, $\mathrm{CH_3CH_2Cl}$ |
| alcohol | $\mathrm{R{-}OH}$ | -ol | ethanol, $\mathrm{CH_3CH_2OH}$ |
| ether | $\mathrm{R{-}O{-}R'}$ | ether, or alkoxy- | methoxymethane, $\mathrm{CH_3OCH_3}$ |
| aldehyde | $\mathrm{R{-}CHO}$, at a chain end | -al | ethanal, $\mathrm{CH_3CHO}$ |
| ketone | $\mathrm{R{-}CO{-}R'}$, inside a chain | -one | propanone, $\mathrm{CH_3COCH_3}$ |
| carboxylic acid | $\mathrm{R{-}COOH}$ | -oic acid | ethanoic acid, $\mathrm{CH_3COOH}$ |
| ester | $\mathrm{R{-}COO{-}R'}$ | alkyl -oate | methyl ethanoate, $\mathrm{CH_3COOCH_3}$ |
| amine | $\mathrm{R{-}NH_2}$ | -amine | methylamine, $\mathrm{CH_3NH_2}$ |
| amide | $\mathrm{R{-}CONH_2}$ | -amide | ethanamide, $\mathrm{CH_3CONH_2}$ |

Five of these contain the **carbonyl** group, $\mathrm{C{=}O}$. Tell them apart by what is attached to the carbonyl carbon: H (aldehyde), two carbons (ketone), $\mathrm{OH}$ (acid), $\mathrm{O{-}R}$ (ester) or $\mathrm{N}$ (amide).

Alcohols are **primary**, **secondary** or **tertiary** according to how many carbon atoms are bonded to the carbon that carries the $\mathrm{OH}$: one, two or three. Ethanol is primary, propan-2-ol secondary, 2-methylpropan-2-ol tertiary. The class decides how an alcohol is oxidised, which the next lesson uses.

### Naming in four steps

1. Find the longest carbon chain that contains the main functional group; it gives the stem.
2. Add the ending for the main group (-ene, -ol, -one, -oic acid, and so on).
3. Number the chain from the end that gives the main group, or the double bond, the lowest number.
4. Name branches and other groups as prefixes with their numbers, in alphabetical order.

So $\mathrm{CH_3CH_2CH(CH_3)CH_2CH_3}$ is 3-methylpentane, $\mathrm{CH_3CH{=}CHCH_3}$ is but-2-ene, $\mathrm{CH_3COCH_2CH_3}$ is butan-2-one and $\mathrm{(CH_3)_2CHCH_2OH}$ is 2-methylpropan-1-ol.

### Properties follow from the forces between molecules

Alkanes are non-polar and attract each other only by London (dispersion) forces. Their boiling points rise with chain length, and branching lowers them, because branched molecules touch over a smaller area. The polar $\mathrm{C{=}O}$ of aldehydes and ketones adds dipole–dipole attractions. Alcohols form hydrogen bonds through their $\mathrm{O{-}H}$, and carboxylic acids form even stronger ones, often in pairs. For molecules of similar mass the boiling points therefore rise in the order alkane, aldehyde or ketone, alcohol, carboxylic acid. Small alcohols, acids and amines dissolve in water because they hydrogen-bond with it; as the hydrocarbon chain grows, solubility falls.

### Acids and bases among organic compounds

Carboxylic acids are weak acids: they turn into carboxylate ions with sodium hydroxide and release carbon dioxide from carbonates. Alcohols are essentially neutral in water. Amines, like ammonia, are weak bases, because the lone pair on nitrogen accepts a proton. Amino acids carry both groups, which is why they behave as both acids and bases.

### Functional groups in biological molecules

The same groups build the molecules of life. Sugars carry several $\mathrm{OH}$ groups and an aldehyde (glucose) or a ketone (fructose). Fats are esters of glycerol with fatty acids. Proteins are chains of amino acids joined by amide bonds, called peptide bonds.
`,
  examples: [
    {
      id: 'example-lactic-acid-groups',
      title: 'Functional groups in lactic acid',
      problemMd: md`Lactic acid has the structure $\mathrm{CH_3CH(OH)COOH}$. Identify its functional groups, classify the alcohol, give the molecular formula and the systematic name.`,
      steps: [
        md`The $\mathrm{COOH}$ at the end is a carboxylic acid group. The $\mathrm{OH}$ on the middle carbon is an alcohol group.`,
        md`The carbon carrying the $\mathrm{OH}$ is bonded to two other carbons (the $\mathrm{CH_3}$ and the $\mathrm{COOH}$ carbon), so it is a secondary alcohol.`,
        md`Count atoms: C $1 + 1 + 1 = 3$; H $3 + 1 + 1 + 1 = 6$; O $1 + 2 = 3$. The formula is $\mathrm{C_3H_6O_3}$.`,
        md`The acid is the main group and sets the ending: propanoic acid, numbered from the acid carbon. The $\mathrm{OH}$ on carbon 2 becomes the prefix hydroxy-: 2-hydroxypropanoic acid.`,
      ],
      answerMd: md`A carboxylic acid and a secondary alcohol; $\mathrm{C_3H_6O_3}$; 2-hydroxypropanoic acid. Calling it a ketone or an aldehyde because of the $\mathrm{C{=}O}$ is the trap: the carbonyl carbon carries an $\mathrm{OH}$, so it is an acid.`,
    },
    {
      id: 'example-naming-three',
      title: 'Naming three compounds',
      problemMd: md`Name: (a) $\mathrm{CH_3CH(CH_3)CH_2CH_2CH_3}$; (b) $\mathrm{CH_3CH_2CH_2CHO}$; (c) $\mathrm{CH_3CH_2COOCH_3}$.`,
      steps: [
        md`(a) The longest chain has five carbons (pentane). Numbering from the left puts the methyl on carbon 2; from the right it would be carbon 4. Lowest number: 2-methylpentane.`,
        md`(b) Four carbons ending in $\mathrm{CHO}$: an aldehyde. The aldehyde carbon is always carbon 1, so no number is needed: butanal.`,
        md`(c) $\mathrm{COO}$ between two carbon groups is an ester. The part from the acid, $\mathrm{CH_3CH_2CO{-}}$, has three carbons (propanoate); the group on the oxygen, $\mathrm{CH_3}$, is methyl: methyl propanoate.`,
      ],
      answerMd: md`(a) 2-methylpentane, (b) butanal, (c) methyl propanoate. "4-methylpentane" numbers from the wrong end, and "propyl methanoate" reverses the two halves of the ester.`,
    },
    {
      id: 'example-boiling-point-order',
      title: 'Ranking boiling points',
      problemMd: md`Put these compounds of similar molar mass in order of increasing boiling point: propan-1-ol ($M = 60$), butane ($58$), ethanoic acid ($60$), propanal ($58$).`,
      steps: [
        md`With similar masses, London forces are similar, so the functional groups decide.`,
        md`Butane is non-polar: London forces only, the lowest boiling point.`,
        md`Propanal has a polar $\mathrm{C{=}O}$ (dipole–dipole) but no $\mathrm{O{-}H}$, so it cannot hydrogen-bond with itself.`,
        md`Propan-1-ol hydrogen-bonds through its $\mathrm{O{-}H}$; ethanoic acid hydrogen-bonds more strongly, through both its $\mathrm{O{-}H}$ and its $\mathrm{C{=}O}$, often in pairs.`,
      ],
      answerMd: md`Butane < propanal < propan-1-ol < ethanoic acid. Ranking by molar mass alone would put butane and propanal together and miss the hydrogen bonding that sets the order.`,
    },
  ],
  traps: [
    {
      title: 'Mistaking any C=O for a ketone',
      md: md`Aldehydes, ketones, acids, esters and amides all contain $\mathrm{C{=}O}$. Look at the neighbours of the carbonyl carbon: only two carbon neighbours make a ketone.`,
    },
    {
      title: 'Numbering from the wrong end',
      md: md`Number so that the main group, or the double bond, gets the lowest possible number. Butan-3-ol does not exist as a name: it is butan-2-ol counted from the other end.`,
    },
    {
      title: 'Taking a branch as part of the longest chain, or not',
      md: md`Written formulas hide the shape. In $\mathrm{CH_3CH(CH_2CH_3)CH_3}$ the longest chain runs through the ethyl branch and has four carbons: the compound is 2-methylbutane, not 2-ethylpropane. Trace every path before choosing the stem.`,
    },
    {
      title: 'Reversing the halves of an ester',
      md: md`In an ester name the alkyl group on the oxygen comes first and the acid part, ending in -oate, second. $\mathrm{CH_3COOCH_2CH_3}$ is ethyl ethanoate; $\mathrm{HCOOCH_2CH_3}$ is ethyl methanoate.`,
    },
  ],
  check: [
    {
      id: 'check-which-is-ketone',
      title: 'Spotting a ketone',
      topic: 'Organic chemistry',
      stemMd: md`Which of these compounds is a ketone?`,
      options: [
        { id: 'A', text: md`$\mathrm{CH_3CH_2CHO}$`, note: md`The carbonyl is at the end of the chain with a hydrogen on it: an aldehyde, propanal.` },
        { id: 'B', text: md`$\mathrm{CH_3COCH_3}$`, note: '' },
        { id: 'C', text: md`$\mathrm{CH_3COOCH_3}$`, note: md`The carbonyl carbon is also bonded to an oxygen carrying a methyl group: an ester, methyl ethanoate.` },
        { id: 'D', text: md`$\mathrm{CH_3CH_2OCH_3}$`, note: md`There is no $\mathrm{C{=}O}$ here; an oxygen between two carbon groups is an ether.` },
        { id: 'E', text: md`$\mathrm{CH_3CONH_2}$`, note: md`The carbonyl carbon is bonded to nitrogen: an amide, ethanamide.` },
      ],
      answer: 'B',
      workingMd: md`A ketone has a carbonyl carbon bonded to two other carbons. In propanone, $\mathrm{CH_3COCH_3}$, the $\mathrm{C{=}O}$ carbon sits between two methyl groups. Each of the others has H, $\mathrm{O{-}R}$ or N on the carbonyl, or no carbonyl at all.`,
      lesson: 'Classify a carbonyl compound by the atoms bonded to the carbonyl carbon.',
    },
    {
      id: 'check-alkane-formula',
      title: 'Which formula is an alkane?',
      topic: 'Hydrocarbons',
      stemMd: md`Which molecular formula belongs to an open-chain (non-cyclic) alkane?`,
      options: [
        { id: 'A', text: md`$\mathrm{C_6H_6}$`, note: md`This is benzene, an arene, far from the $\mathrm{C_nH_{2n+2}}$ of an alkane.` },
        { id: 'B', text: md`$\mathrm{C_6H_{10}}$`, note: md`$\mathrm{C_nH_{2n-2}}$ fits an alkyne, a diene or a cycloalkene, not an alkane.` },
        { id: 'C', text: md`$\mathrm{C_6H_{12}}$`, note: md`$\mathrm{C_nH_{2n}}$ fits an alkene or a cycloalkane such as cyclohexane, not an open-chain alkane.` },
        { id: 'D', text: md`$\mathrm{C_6H_{13}}$`, note: md`A stable neutral hydrocarbon always has an even number of hydrogen atoms; this is a fragment (a hexyl group), not a molecule.` },
        { id: 'E', text: md`$\mathrm{C_6H_{14}}$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Open-chain alkanes follow $\mathrm{C_nH_{2n+2}}$. With $n = 6$, that is $2 \times 6 + 2 = 14$ hydrogens: $\mathrm{C_6H_{14}}$, hexane or one of its branched isomers.`,
      lesson: 'Check a hydrocarbon formula against CnH2n+2, CnH2n and CnH2n−2 to find its possible families.',
    },
    {
      id: 'check-name-secondary-alcohol',
      title: 'Naming an alcohol',
      topic: 'Organic nomenclature',
      stemMd: md`What is the systematic name of $\mathrm{CH_3CH(OH)CH_2CH_3}$?`,
      options: [
        { id: 'A', text: md`butan-1-ol`, note: md`In butan-1-ol the $\mathrm{OH}$ is on an end carbon; here it is on the second carbon of the chain.` },
        { id: 'B', text: md`butan-3-ol`, note: md`Numbers the chain from the wrong end; counting from the other end gives the lower number, 2.` },
        { id: 'C', text: md`butan-2-ol`, note: '' },
        { id: 'D', text: md`butanal`, note: md`Butanal is an aldehyde, $\mathrm{CH_3CH_2CH_2CHO}$; this compound has an $\mathrm{OH}$, not a $\mathrm{C{=}O}$.` },
        { id: 'E', text: md`2-methylpropan-1-ol`, note: md`That is an isomer with a branched chain; this compound has an unbranched four-carbon chain.` },
      ],
      answer: 'C',
      workingMd: md`The chain has four carbons in a row (butane) and an $\mathrm{OH}$ group (ending -ol). Numbering from the left puts the $\mathrm{OH}$ on carbon 2, from the right on carbon 3; the lower number wins: butan-2-ol.`,
      lesson: 'Number the chain so that the main functional group gets the lowest possible number.',
    },
  ],
  takeaways: [
    md`Alkanes are $\mathrm{C_nH_{2n+2}}$, alkenes and cycloalkanes $\mathrm{C_nH_{2n}}$, alkynes $\mathrm{C_nH_{2n-2}}$.`,
    'Identify a carbonyl compound by what is bonded to the carbonyl carbon: H, two carbons, OH, OR or N.',
    'Name from the longest chain containing the main group, numbered to give that group the lowest number.',
    'Hydrogen bonding explains why acids boil above alcohols, which boil above aldehydes, ketones and alkanes of similar mass.',
  ],
  flashcards: [
    { front: 'General formulas of hydrocarbons', back: md`Alkanes $\mathrm{C_nH_{2n+2}}$; alkenes and cycloalkanes $\mathrm{C_nH_{2n}}$; alkynes $\mathrm{C_nH_{2n-2}}$.` },
    { front: 'Aldehyde or ketone?', back: 'An aldehyde has the C=O at the end of the chain, with an H on the carbonyl carbon (-al); a ketone has it between two carbons (-one).' },
    { front: 'Ester name', back: md`Alkyl group on the oxygen first, then the acid part ending in -oate: $\mathrm{CH_3COOCH_3}$ is methyl ethanoate.` },
    { front: 'Primary, secondary, tertiary alcohol', back: 'The carbon carrying the OH is bonded to one, two or three other carbon atoms.' },
    { front: 'Boiling point order at similar mass', back: 'Alkane < aldehyde or ketone < alcohol < carboxylic acid, because of dipoles and then hydrogen bonding.' },
    { front: 'Peptide bond', back: 'The amide bond that joins amino acids in a protein.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-organic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const isomerismAndOrganicReactionsLesson: Lesson = {
  slug: 'isomerism-and-organic-reactions',
  title: 'Isomerism and organic reactions',
  summary: 'Tell structural isomers from geometric and optical ones, find chiral centres, and predict the products of addition, substitution, oxidation and esterification.',
  minutes: 22,
  objectives: [
    'Distinguish chain, position and functional-group isomers, and count simple structural isomers.',
    'Decide whether a molecule shows cis–trans isomerism or has a chiral centre.',
    'Predict the products of the main reactions of alkanes, alkenes, alcohols and carboxylic acids.',
  ],
  teachMd: md`
### Isomers: same formula, different structure

**Isomers** have the same molecular formula but different arrangements of their atoms, so they are different compounds with different properties. There are two broad kinds. In **structural isomers** the atoms are joined in a different order. In **stereoisomers** the atoms are joined in the same order but arranged differently in space.

### Structural isomers

- **Chain isomers** differ in the carbon skeleton. $\mathrm{C_4H_{10}}$ has two: butane and 2-methylpropane. $\mathrm{C_5H_{12}}$ has three: pentane, 2-methylbutane and 2,2-dimethylpropane.
- **Position isomers** have the same group in a different place: propan-1-ol and propan-2-ol; but-1-ene and but-2-ene.
- **Functional-group isomers** have different groups altogether: ethanol and methoxymethane ($\mathrm{C_2H_6O}$); propanal and propanone ($\mathrm{C_3H_6O}$); propanoic acid and methyl ethanoate ($\mathrm{C_3H_6O_2}$).

When you count isomers, name each structure you draw. Two drawings with the same name are the same molecule: a "3-methylbutane" is 2-methylbutane numbered from the other end, and bending a chain on paper does not make a new compound.

### Cis–trans (geometric) isomers

There is no free rotation about a $\mathrm{C{=}C}$ double bond. If **each** carbon of the double bond carries two different groups, the groups can be arranged in two ways: on the same side (**cis**) or on opposite sides (**trans**). But-2-ene, $\mathrm{CH_3CH{=}CHCH_3}$, has cis and trans forms. But-1-ene, $\mathrm{CH_2{=}CHCH_2CH_3}$, does not, because one carbon of the double bond carries two hydrogens; nor does 2-methylpropene, whose other carbon carries two methyl groups. Cis and trans isomers have different physical properties, such as boiling and melting points. (The more general E/Z system applies the same idea when three or four different groups make "cis" and "trans" ambiguous.)

### Optical isomers and chirality

A carbon atom bonded to **four different groups** is a **chiral centre**. Its four groups can be arranged in two ways that are mirror images of each other and cannot be superimposed, like a left and a right hand. The two forms are **enantiomers**. They have identical melting points, boiling points and solubility, but they rotate plane-polarised light by the same angle in opposite directions. A 50:50 mixture of the two, a **racemic mixture**, shows no rotation.

Enantiomers also behave differently towards other chiral molecules, such as enzymes and receptors, which are themselves chiral. That is why the two enantiomers of a drug can have different effects. Almost all amino acids are chiral (glycine, with two hydrogens on its central carbon, is the exception), and proteins are built from the L forms.

To spot a chiral centre quickly, skip any carbon that carries two identical groups: a $\mathrm{CH_3}$, a $\mathrm{CH_2}$ in a chain, or a carbon in a double bond cannot be one.

### Reactions of hydrocarbons

**Alkanes** are fairly unreactive. They burn (complete combustion gives $\mathrm{CO_2}$ and $\mathrm{H_2O}$; with too little oxygen, carbon monoxide forms) and react with halogens in ultraviolet light by **substitution**, a radical reaction: $\mathrm{CH_4 + Cl_2 \rightarrow CH_3Cl + HCl}$.

**Alkenes** react by **addition** across the double bond, which becomes single:

| Reagent | Product | Note |
| --- | --- | --- |
| $\mathrm{H_2}$, nickel or platinum catalyst | alkane | hydrogenation |
| $\mathrm{Br_2}$ | dibromoalkane | bromine water turns from orange to colourless: the test for $\mathrm{C{=}C}$ |
| $\mathrm{HBr}$ | bromoalkane | H goes to the carbon that already has more H |
| $\mathrm{H_2O}$, acid catalyst | alcohol | hydration |

The rule in the third row (Markovnikov's rule) means that propene and $\mathrm{HBr}$ give mainly 2-bromopropane. Alkenes also join in long chains by **addition polymerisation**: ethene gives poly(ethene).

**Benzene**, despite its formula, does not decolourise bromine water. Its delocalised ring is so stable that it reacts by **substitution**, keeping the ring, rather than by addition.

### Reactions of alcohols and carboxylic acids

Acidified potassium dichromate oxidises alcohols and turns from orange to green as $\mathrm{Cr^{3+}}$ forms. What happens depends on the class of alcohol:

- primary: to an aldehyde, then on to a carboxylic acid;
- secondary: to a ketone, which goes no further;
- tertiary: no oxidation.

The reason is that oxidation removes a hydrogen from the carbon carrying the $\mathrm{OH}$, and a tertiary alcohol has none there. Heated with concentrated sulfuric acid, alcohols lose water (**elimination**, or dehydration) to give alkenes.

A carboxylic acid and an alcohol, warmed with an acid catalyst, give an **ester** and water. This is a **condensation**, and it is reversible:

$$\mathrm{CH_3COOH + CH_3CH_2OH \rightleftharpoons CH_3COOCH_2CH_3 + H_2O}$$

The reverse, splitting by water, is **hydrolysis**; with sodium hydroxide it goes to completion and gives the carboxylate salt and the alcohol, which is how soaps are made from fats (saponification). An acid and an amine condense in the same way to give an amide; this is the peptide bond of proteins.
`,
  examples: [
    {
      id: 'example-cis-trans-c4h8',
      title: 'Which alkene has cis and trans forms?',
      problemMd: md`Three alkenes have the formula $\mathrm{C_4H_8}$: but-1-ene, but-2-ene and 2-methylpropene. Which of them shows cis–trans isomerism?`,
      steps: [
        md`Check each carbon of the double bond: both must carry two different groups.`,
        md`But-1-ene, $\mathrm{CH_2{=}CHCH_2CH_3}$: carbon 1 carries two hydrogens. No cis–trans isomers.`,
        md`But-2-ene, $\mathrm{CH_3CH{=}CHCH_3}$: each carbon carries one H and one $\mathrm{CH_3}$. Cis (both methyls on one side) and trans (opposite sides) exist.`,
        md`2-methylpropene, $\mathrm{(CH_3)_2C{=}CH_2}$: one carbon carries two methyls, the other two hydrogens. No cis–trans isomers.`,
      ],
      answerMd: md`Only but-2-ene. The three compounds are structural isomers of each other, so counting all $\mathrm{C_4H_8}$ alkenes gives four: but-1-ene, cis-but-2-ene, trans-but-2-ene and 2-methylpropene. Assuming every alkene has cis and trans forms is the tempting error.`,
    },
    {
      id: 'example-find-chiral-centres',
      title: 'Finding chiral centres',
      problemMd: md`Which of these has a chiral centre: 2-chlorobutane $\mathrm{CH_3CHClCH_2CH_3}$, 2-chloropropane $\mathrm{CH_3CHClCH_3}$, and lactic acid $\mathrm{CH_3CH(OH)COOH}$?`,
      steps: [
        md`2-chlorobutane: carbon 2 carries H, Cl, $\mathrm{CH_3}$ and $\mathrm{CH_2CH_3}$. Four different groups, so it is a chiral centre.`,
        md`2-chloropropane: carbon 2 carries H, Cl and two $\mathrm{CH_3}$ groups. Two are the same, so it is not chiral.`,
        md`Lactic acid: the middle carbon carries H, $\mathrm{OH}$, $\mathrm{CH_3}$ and $\mathrm{COOH}$. Four different groups: chiral.`,
      ],
      answerMd: md`2-chlorobutane and lactic acid each have one chiral centre and exist as a pair of enantiomers; 2-chloropropane has none. Counting a carbon as chiral just because it carries a halogen or an $\mathrm{OH}$ is the trap: all four groups must differ.`,
    },
    {
      id: 'example-oxidise-then-esterify',
      title: 'From alcohol to acid to ester',
      problemMd: md`Propan-1-ol is heated under reflux with excess acidified potassium dichromate. The organic product is then warmed with methanol and a little concentrated sulfuric acid. Name the two organic products. What would propan-2-ol and 2-methylpropan-2-ol give with the dichromate?`,
      steps: [
        md`Propan-1-ol is primary. With excess oxidising agent and reflux it goes past the aldehyde, propanal, to the carboxylic acid: propanoic acid, $\mathrm{CH_3CH_2COOH}$.`,
        md`Propanoic acid and methanol condense to an ester and water: $\mathrm{CH_3CH_2COOH + CH_3OH \rightleftharpoons CH_3CH_2COOCH_3 + H_2O}$.`,
        md`Name the ester: methyl from the alcohol, propanoate from the acid, so methyl propanoate, $\mathrm{C_4H_8O_2}$ (C $2 + 1 + 1 = 4$, H $5 + 3 = 8$).`,
        md`Propan-2-ol is secondary and gives propanone. 2-methylpropan-2-ol is tertiary: no oxidation, and the dichromate stays orange.`,
      ],
      answerMd: md`Propanoic acid, then methyl propanoate. Propan-2-ol gives propanone; the tertiary alcohol does not react. "Propyl methanoate" is the tempting wrong name: it swaps which part came from the acid.`,
    },
  ],
  traps: [
    {
      title: 'Counting the same molecule twice',
      md: md`When drawing isomers, a chain bent on the page or numbered from the other end is the same compound. Give every structure its proper name; duplicates then show up at once.`,
    },
    {
      title: 'Assuming every alkene has cis and trans forms',
      md: md`Both carbons of the double bond must carry two different groups. A $\mathrm{{=}CH_2}$ end, or a carbon with two identical groups, rules it out.`,
    },
    {
      title: 'Oxidising a ketone or a tertiary alcohol',
      md: md`A secondary alcohol stops at the ketone; a tertiary alcohol does not react. Only primary alcohols go on through the aldehyde to the carboxylic acid.`,
    },
    {
      title: 'Expecting benzene to add bromine',
      md: md`Benzene is unsaturated on paper, but its delocalised ring makes it substitute rather than add. It does not decolourise bromine water the way an alkene does.`,
    },
  ],
  check: [
    {
      id: 'check-pentane-isomers',
      title: 'Isomers of C5H12',
      topic: 'Isomerism',
      stemMd: md`How many structural isomers have the molecular formula $\mathrm{C_5H_{12}}$?`,
      options: [
        { id: 'A', text: md`1`, note: md`Counts only the straight chain, pentane; branched chains with the same formula are isomers too.` },
        { id: 'B', text: md`2`, note: md`Misses 2,2-dimethylpropane, in which a central carbon carries four methyl groups.` },
        { id: 'C', text: md`3`, note: '' },
        { id: 'D', text: md`4`, note: md`Counts "3-methylbutane" as new; it is 2-methylbutane numbered from the other end.` },
        { id: 'E', text: md`5`, note: md`Adds rings such as cyclopentane, but rings have the formula $\mathrm{C_5H_{10}}$, not $\mathrm{C_5H_{12}}$.` },
      ],
      answer: 'C',
      workingMd: md`Five carbons in a row: pentane. Four in a row with a methyl branch: 2-methylbutane (the branch can only go on carbon 2, since on carbon 1 it extends the chain). Three in a row with two methyls on the middle carbon: 2,2-dimethylpropane. That makes three.`,
      lesson: 'Shorten the main chain one carbon at a time and place branches without repeating a structure.',
    },
    {
      id: 'check-which-is-chiral',
      title: 'Which molecule is chiral?',
      topic: 'Optical isomerism',
      stemMd: md`Which of these molecules contains a chiral centre?`,
      options: [
        { id: 'A', text: md`propan-2-ol, $\mathrm{CH_3CH(OH)CH_3}$`, note: md`The carbon carrying the $\mathrm{OH}$ also carries two identical $\mathrm{CH_3}$ groups.` },
        { id: 'B', text: md`1-bromobutane, $\mathrm{CH_2BrCH_2CH_2CH_3}$`, note: md`Every carbon carries at least two hydrogens, so none has four different groups.` },
        { id: 'C', text: md`dichloromethane, $\mathrm{CH_2Cl_2}$`, note: md`The single carbon carries two H and two Cl: only two kinds of group.` },
        { id: 'D', text: md`glycine, $\mathrm{H_2NCH_2COOH}$`, note: md`Its central carbon carries two hydrogens; glycine is the amino acid that is not chiral.` },
        { id: 'E', text: md`2-bromobutane, $\mathrm{CH_3CHBrCH_2CH_3}$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`In 2-bromobutane, carbon 2 carries H, Br, $\mathrm{CH_3}$ and $\mathrm{CH_2CH_3}$: four different groups, so it is a chiral centre and the molecule has two enantiomers. Each of the others has a duplicated group on every carbon.`,
      lesson: 'A chiral centre needs four different groups; any duplicate, even two hydrogens, rules it out.',
    },
    {
      id: 'check-oxidise-propan-2-ol',
      title: 'Oxidising a secondary alcohol',
      topic: 'Organic reactions',
      stemMd: md`Propan-2-ol is heated with excess acidified potassium dichromate. What is the organic product?`,
      options: [
        { id: 'A', text: md`propanone`, note: '' },
        { id: 'B', text: md`propanal`, note: md`An aldehyde comes from a primary alcohol, propan-1-ol; here the $\mathrm{OH}$ is on the middle carbon.` },
        { id: 'C', text: md`propanoic acid`, note: md`Only primary alcohols go on to carboxylic acids; a ketone is not oxidised further, even with excess dichromate.` },
        { id: 'D', text: md`propene`, note: md`An alkene comes from dehydration with hot concentrated sulfuric acid, not from oxidation.` },
        { id: 'E', text: md`No reaction takes place`, note: md`That is true of tertiary alcohols; a secondary alcohol still has a hydrogen on the carbon carrying the $\mathrm{OH}$.` },
      ],
      answer: 'A',
      workingMd: md`Propan-2-ol is a secondary alcohol: its $\mathrm{OH}$ carbon is bonded to two carbons and one hydrogen. Oxidation removes that hydrogen and the hydrogen of the $\mathrm{OH}$, giving the ketone propanone, $\mathrm{CH_3COCH_3}$, which resists further oxidation.`,
      lesson: 'Classify the alcohol first: primary to aldehyde then acid, secondary to ketone, tertiary no reaction.',
    },
  ],
  takeaways: [
    'Structural isomers differ in how atoms are joined; stereoisomers differ only in their arrangement in space.',
    'Cis–trans isomerism needs a C=C with two different groups on each carbon; a chiral centre needs a carbon with four different groups.',
    'Alkenes add, benzene and alkanes substitute; bromine water is decolourised by alkenes only.',
    'Primary alcohols oxidise to aldehydes then acids, secondary to ketones, tertiary not at all; acid plus alcohol gives an ester and water.',
  ],
  flashcards: [
    { front: 'Structural isomers versus stereoisomers', back: 'Structural isomers join their atoms in a different order. Stereoisomers join them in the same order but arrange them differently in space.' },
    { front: 'Condition for cis–trans isomerism', back: 'A C=C double bond where each of the two carbons carries two different groups.' },
    { front: 'Chiral centre', back: 'A carbon atom bonded to four different groups. It gives two enantiomers, non-superimposable mirror images.' },
    { front: 'How enantiomers differ', back: 'They rotate plane-polarised light in opposite directions and interact differently with other chiral molecules such as enzymes; other physical properties are identical.' },
    { front: 'Test for a C=C double bond', back: 'Bromine water turns from orange to colourless as bromine adds across the double bond.' },
    { front: 'Oxidation of alcohols with acidified dichromate', back: 'Primary: aldehyde, then carboxylic acid. Secondary: ketone. Tertiary: no reaction. The dichromate turns from orange to green when it reacts.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-organic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};
