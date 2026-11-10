import { md, type Lesson } from '../../types';

export const stoichiometryLesson: Lesson = {
  slug: "atoms-bonds-and-reacting-amounts",
  title: "Atoms, bonds and reacting amounts",
  summary: "Use particle counts to identify atoms and ions, predict simple bonding patterns, and find how much product a limited supply of reactant can make.",
  minutes: 20,
  objectives: [
    "Determine proton, neutron and electron counts from atomic notation.",
    "Connect outer electrons with simple ionic and covalent structures.",
    "Use a balanced equation to find a limiting reactant and product mass.",
  ],
  teachMd: md`
### Identify what stays with an element

Read an atom's identity from its number of protons. The atomic number (*numero atomico*) counts these positive charges in the nucleus. A neutral atom has the same number of electrons outside the nucleus. The mass number counts protons and neutrons together, so subtract the atomic number to find the neutron count. In the notation $^{23}_{11}\mathrm{Na}$ the lower number identifies sodium and the upper number gives the total of 23 nucleons. This nucleus contains 11 protons and 12 neutrons.

An isotope has the same number of protons as another atom of that element but a different number of neutrons. An ion has gained or lost electrons. Removing one electron from neutral sodium gives a positive ion with ten electrons, while its nucleus remains the same. This accounting is valuable when two different ions have the same electron count. Each is still identified by the charge of its nucleus. The decimal atomic mass on a periodic table can be a weighted average over isotopes. Use the integer mass number of the specified isotope for a neutron count.

### Translate an outer shell into a formula

For simple main-group atoms, the outer-shell electrons help explain chemical behaviour. Elements in the same group often have similar outer-electron arrangements and similar bonding patterns. Sodium has one outer electron, whereas chlorine has seven. Transfer of an electron can produce a positive sodium ion and a negative chloride ion. Their electrical attraction acts throughout an ionic lattice. The written formula gives the smallest whole-number ratio of ions consistent with electrical neutrality.

Consider magnesium ions carrying two positive charges each and chloride ions carrying one negative charge each. Two chloride ions balance one magnesium ion. This gives $\mathrm{MgCl_2}$. The subscript next to chlorine describes the composition of the compound. Altering it changes the formula. Covalent bonding instead involves a shared pair of electrons between atoms. A molecule of hydrogen contains two hydrogen atoms sharing one pair. Counting atoms in one formula unit or molecule is a separate operation from counting how many such units participate in a reaction.

### Balance atoms before comparing supplies

A chemical equation records the rearrangement of atoms. Change coefficients in front of formulas to balance it. Each coefficient multiplies every atom in its formula, including any subscripts. In $2\mathrm{H_2}+\mathrm{O_2}\rightarrow2\mathrm{H_2O}$, four hydrogen atoms and two oxygen atoms appear on each side. The coefficients give the ratio of molecules. They also give the ratio of moles because each mole contains the same number of specified particles. Grams measure mass, so taking a coefficient ratio directly between masses usually gives the wrong prediction.

Convert a sample's mass to amount by dividing by molar mass in grams per mole. Build a compound's molar mass by multiplying each element's molar mass by its subscript and adding. If you have a balanced equation and the amount of each reactant, divide each available amount by its coefficient. Think of each quotient as the possible number of complete reaction batches measured in moles of batches. The smallest quotient gives the limiting reactant (*reagente limitante*). When the reaction runs to completion, that supply runs out first.

Multiply the smallest quotient by a product coefficient to obtain the amount of that product. Multiply again by its molar mass only if the question asks for grams. For an excess reactant, subtract the amount consumed from its starting amount. You can check your result by accounting for the atoms on each side or by adding the mass left over to the product mass. If this accounting includes all products and reactants in a closed system, the final mass must equal the starting mass. When comparing two candidate answers, ask whether the larger one would require more of any reactant than you actually possess.
`,
  examples: [
    {
      id: "oxide",
      title: "Writing an oxide formula",
      problemMd: "An oxide contains aluminium ions with charge +3 and oxide ions with charge −2. What is its simplest formula?",
      steps: [
        "A neutral formula unit needs equal total positive and negative charge. The smallest common multiple of 3 and 2 is 6.",
        "Two aluminium ions contribute +6 and three oxide ions contribute −6. Attach each count to its own element.",
      ],
      answerMd: md`The formula is $\mathrm{Al_2O_3}$. Reversing the counts gives a positive net charge.`,
    },
    {
      id: "iron",
      title: "Accounting for excess iron",
      problemMd: md`A mixture contains 11.2 g of iron and 4.8 g of sulphur. For $\mathrm{Fe}+\mathrm{S}\rightarrow\mathrm{FeS}$, use molar masses 56 and 32 g/mol for iron and sulphur. Find the product mass at completion.`,
      steps: [
        md`The available amounts are $11.2/56=0.20$ mol iron and $4.8/32=0.15$ mol sulphur.`,
        "The coefficients are equal. Sulphur limits production to 0.15 mol of iron sulphide.",
        md`Its molar mass is 88 g/mol, giving $0.15\times88=13.2$ g. The remaining 0.05 mol iron weighs 2.8 g.`,
      ],
      answerMd: "There are 13.2 g of product. Adding 2.8 g left over recovers the original 16 g.",
    },
  ],
  traps: [
    { title: "Changing subscripts to balance atoms", md: "A subscript belongs to the compound's identity. Put a coefficient before the whole formula when balancing an equation." },
    { title: "Comparing the raw mole counts", md: "A smaller mole count can still be in excess when fewer moles are needed per batch. Divide each count by its own coefficient." },
  ],
  check: [
    {
      id: "check-ion",
      title: "Counting electrons",
      topic: "Chemistry",
      stemMd: "A chlorine-37 ion has atomic number 17 and charge −1. How many neutrons and electrons does it contain, respectively?",
      options: [
        { id: "A", text: "20 and 16", note: "Removing an electron gives a positive ion." },
        { id: "B", text: "17 and 18", note: "The atomic number counts protons, not neutrons." },
        { id: "C", text: "20 and 18", note: "" },
        { id: "D", text: "37 and 18", note: "The mass number counts all nucleons together." },
        { id: "E", text: "20 and 17", note: "This electron count describes neutral chlorine." },
      ],
      answer: "C",
      workingMd: "Subtract 17 protons from 37 nucleons to get 20 neutrons. One extra electron makes 18 electrons.",
      lesson: "Use the mass number for neutrons and charge for electrons.",
    },
    {
      id: "check-nitride",
      title: "Neutral formula units",
      topic: "Chemistry",
      stemMd: "Calcium forms ions of charge +2 and nitride ions carry −3. Which is the simplest neutral formula?",
      options: [
        { id: "A", text: md`$\mathrm{CaN}$`, note: "One ion of each has total charge −1." },
        { id: "B", text: md`$\mathrm{Ca_2N_3}$`, note: "Two calcium and three nitride ions have total charge −5." },
        { id: "C", text: md`$\mathrm{CaN_2}$`, note: "One calcium and two nitride ions have total charge −4." },
        { id: "D", text: md`$\mathrm{Ca_3N_2}$`, note: "" },
        { id: "E", text: md`$\mathrm{Ca_6N_4}$`, note: "This balances charge but doubles the smallest whole-number ratio." },
      ],
      answer: "D",
      workingMd: "Six units of each sign cancel when three calcium ions accompany two nitride ions. Their counts share no factor larger than one.",
      lesson: "Balance total ionic charge and reduce the ratio to lowest terms.",
    },
    {
      id: "check-ammonia",
      title: "A limiting supply",
      topic: "Chemistry",
      stemMd: md`For $\mathrm{N_2}+3\mathrm{H_2}\rightarrow2\mathrm{NH_3}$, 3 mol nitrogen gas and 6 mol hydrogen gas react to completion. How many moles of ammonia form?`,
      options: [
        { id: "A", text: "6", note: "This uses all the nitrogen even though the hydrogen runs out first." },
        { id: "B", text: "4", note: "" },
        { id: "C", text: "2", note: "This gives the number of mole batches, before multiplying by the product coefficient." },
        { id: "D", text: "3", note: "This repeats the nitrogen supply without using the reaction ratio." },
        { id: "E", text: "9", note: "This adds the two starting mole amounts as if molecule counts were conserved." },
      ],
      answer: "B",
      workingMd: md`Nitrogen supplies three batches and hydrogen supplies $6/3=2$. Two batches each yield 2 mol ammonia, for a total of 4 mol.`,
      lesson: "The limiting amount divided by its coefficient sets the number of batches.",
    },
  ],
  takeaways: [
    "Protons identify the element and electrons determine ionic charge for a given nucleus.",
    "Simple ionic formulas express the smallest neutral ratio.",
    "Balance with coefficients, then compare available moles per coefficient.",
    "Convert product moles to grams using the product's own molar mass.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-sciences', skill: 'tolci-sci-chemistry' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
