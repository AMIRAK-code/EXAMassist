import { md, type Lesson } from '../../types';

/**
 * IMAT chemistry, part 1: atoms, the periodic table, bonding, states of
 * matter, inorganic nomenclature and the mole. The Italian version of every
 * lesson is in ./it/chemistry-1.ts, with the same slugs and check keys.
 */

export const atomicStructureAndElectronConfigurationLesson: Lesson = {
  slug: 'atomic-structure-and-electron-configuration',
  title: 'Atomic structure and electron configuration',
  summary: 'Count protons, neutrons and electrons in any atom or ion, and write ground-state electron configurations, including transition-metal ions.',
  minutes: 20,
  objectives: [
    'Find the numbers of protons, neutrons and electrons in an atom or ion from its symbol, mass number and charge.',
    'Explain isotopes and work out a relative atomic mass from isotopic abundances.',
    'Write ground-state electron configurations with the Aufbau principle, the Pauli principle and Hund\'s rule, including ions of transition metals.',
  ],
  teachMd: md`
### What an atom is made of

An atom has a tiny, dense **nucleus** of protons and neutrons, surrounded by electrons. Almost all the mass is in the nucleus; almost all the volume is the space the electrons occupy.

| Particle | Relative charge | Relative mass | Where |
| --- | --- | --- | --- |
| proton | $+1$ | $1$ | nucleus |
| neutron | $0$ | $1$ | nucleus |
| electron | $-1$ | about $\frac{1}{1836}$ | around the nucleus |

Two numbers describe a nucleus. The **atomic number** $Z$ is the number of protons, and it alone decides which element the atom is: every atom with 17 protons is chlorine. The **mass number** $A$ is the number of protons plus neutrons. The symbol $^{A}_{Z}\mathrm{X}$ carries both, so

$$\text{neutrons} = A - Z$$

A neutral atom has as many electrons as protons. An ion does not: a **cation** has lost electrons, an **anion** has gained them. For an ion of charge $q$, the number of electrons is $Z - q$. So $\mathrm{Mg^{2+}}$ ($Z = 12$) has $12 - 2 = 10$ electrons, and $\mathrm{S^{2-}}$ ($Z = 16$) has $16 + 2 = 18$. Charge changes the electrons only; protons and neutrons are untouched by ordinary chemistry.

### Isotopes and relative atomic mass

**Isotopes** are atoms of the same element with different numbers of neutrons: same $Z$, different $A$. Because chemistry is decided by electrons, isotopes react in the same way; they differ in mass, and some are radioactive.

The relative atomic mass printed in the periodic table is a **weighted mean** of the masses of the natural isotopes, weighted by how common each is. That is why chlorine is listed as $35.5$, though no single chlorine atom has that mass: a mass number is a whole number for one nucleus, a relative atomic mass is an average over many atoms.

### Shells, subshells and orbitals

Electrons sit in **orbitals**, regions where an electron is likely to be found. Each orbital holds at most two electrons, and they must have opposite spins (the **Pauli exclusion principle**: no two electrons in an atom share all four quantum numbers).

- The principal quantum number $n = 1, 2, 3, \dots$ labels the **shell**; higher $n$ means farther from the nucleus and higher energy.
- Shell $n$ contains $n$ **subshells**, labelled by $l = 0, 1, \dots, n-1$ and named s, p, d, f.
- An s subshell has 1 orbital, p has 3, d has 5, f has 7, so they hold 2, 6, 10 and 14 electrons.
- Shell $n$ therefore has $n^2$ orbitals and holds at most $2n^2$ electrons: 2, 8, 18, 32.

Within a subshell, the magnetic quantum number $m_l$ runs from $-l$ to $+l$ (one value per orbital), and the spin quantum number $m_s$ is $+\frac{1}{2}$ or $-\frac{1}{2}$.

### Filling order: the Aufbau principle and Hund's rule

In the ground state, electrons fill the lowest-energy orbitals first (the **Aufbau principle**). The order is

$$1s,\ 2s,\ 2p,\ 3s,\ 3p,\ 4s,\ 3d,\ 4p,\ 5s,\ 4d,\ 5p,\ 6s,\ 4f,\ 5d,\ 6p$$

A rule that rebuilds it: fill in order of increasing $n + l$, and when two subshells tie, the one with lower $n$ first. That is why $4s$ ($n + l = 4$) fills before $3d$ ($n + l = 5$).

**Hund's rule** decides how a partly filled subshell is occupied: electrons spread out over the orbitals of equal energy with parallel spins before any pairing starts. Nitrogen ($1s^2\,2s^2\,2p^3$) has three unpaired 2p electrons, one in each p orbital; oxygen ($2p^4$) has to pair one of them, and has two unpaired electrons.

Long configurations are shortened with the previous noble gas in brackets: sodium is $[\mathrm{Ne}]\,3s^1$, iron ($Z = 26$) is $[\mathrm{Ar}]\,3d^6\,4s^2$.

### Configurations and the periodic table

The table is built on these configurations. The period number is the highest shell that is occupied; the s-block (groups 1 and 2), p-block (groups 13 to 18) and d-block (groups 3 to 12) are named after the subshell being filled. For main-group elements the outer-shell (valence) electrons follow from the group: 1 and 2 for groups 1 and 2, the group number minus 10 for groups 13 to 18. Elements in one group share an outer configuration, which is why they react alike.

### Ions of transition metals

When a transition metal forms a cation, it loses its **4s electrons first**, even though 4s filled first. Once the 3d orbitals are occupied, the 4s electrons are the outermost and the easiest to remove. So iron(II) is $[\mathrm{Ar}]\,3d^6$ and iron(III) is $[\mathrm{Ar}]\,3d^5$, not $[\mathrm{Ar}]\,3d^4\,4s^2$.

### Two exceptions to know

Chromium is $[\mathrm{Ar}]\,3d^5\,4s^1$ and copper is $[\mathrm{Ar}]\,3d^{10}\,4s^1$, not the $3d^4\,4s^2$ and $3d^9\,4s^2$ the filling order predicts. A half-filled or completely filled d subshell is especially stable, enough to move one electron out of 4s.

### Without a calculator

Nothing in the IMAT rules allows a calculator, and these questions do not need one. Particle counts are subtractions; a relative atomic mass is a weighted mean, easiest with the abundances written as fractions such as $\frac{3}{4}$ and $\frac{1}{4}$.
`,
  examples: [
    {
      id: 'example-iron-ion-particles',
      title: 'Counting particles in an ion',
      problemMd: md`How many protons, neutrons and electrons are there in $^{56}_{26}\mathrm{Fe^{3+}}$?`,
      steps: [
        md`The lower number is $Z$: 26 protons. This never changes for iron.`,
        md`Neutrons are $A - Z = 56 - 26 = 30$.`,
        md`The charge $+3$ means three electrons have been lost: $26 - 3 = 23$ electrons.`,
        md`Check: protons minus electrons is $26 - 23 = +3$, the charge shown.`,
      ],
      answerMd: md`26 protons, 30 neutrons and 23 electrons. Adding 3 electrons instead (29) is the usual slip: a positive charge means electrons were removed.`,
    },
    {
      id: 'example-iron-configuration',
      title: 'Iron and the iron(II) ion',
      problemMd: md`Write the ground-state configurations of $\mathrm{Fe}$ ($Z = 26$) and $\mathrm{Fe^{2+}}$, and give the number of unpaired electrons in $\mathrm{Fe^{2+}}$.`,
      steps: [
        md`Fill in order: $1s^2\,2s^2\,2p^6\,3s^2\,3p^6$ is 18 electrons, the argon core. Then $4s^2$ (20) and $3d^6$ (26). So $\mathrm{Fe} = [\mathrm{Ar}]\,3d^6\,4s^2$.`,
        md`For the cation, remove the two 4s electrons first: $\mathrm{Fe^{2+}} = [\mathrm{Ar}]\,3d^6$, which has 24 electrons, as $26 - 2$ requires.`,
        md`Place six electrons in five d orbitals by Hund's rule: one in each orbital (5), then the sixth pairs up in one of them.`,
        md`That leaves one pair and four single electrons.`,
      ],
      answerMd: md`$\mathrm{Fe} = [\mathrm{Ar}]\,3d^6\,4s^2$ and $\mathrm{Fe^{2+}} = [\mathrm{Ar}]\,3d^6$, with 4 unpaired electrons. Removing 3d electrons instead gives the wrong $[\mathrm{Ar}]\,3d^4\,4s^2$.`,
    },
    {
      id: 'example-chlorine-mass',
      title: 'Relative atomic mass of chlorine',
      problemMd: md`Natural chlorine is 75% chlorine-35 and 25% chlorine-37. Taking each isotope's mass as its mass number, find the relative atomic mass of chlorine.`,
      steps: [
        md`Write the abundances as fractions: $\frac{3}{4}$ and $\frac{1}{4}$.`,
        md`Weighted mean: $\frac{3}{4} \times 35 + \frac{1}{4} \times 37 = \frac{105 + 37}{4} = \frac{142}{4}$.`,
        md`$\frac{142}{4} = 35.5$. Second route: start from 35 and add $\frac{1}{4}$ of the 2-unit gap to chlorine-37, giving $35 + 0.5 = 35.5$.`,
      ],
      answerMd: md`The relative atomic mass is $35.5$. The plain average of 35 and 37, which is 36, ignores that chlorine-35 is three times as common.`,
    },
  ],
  traps: [
    {
      title: 'Adding electrons to a cation',
      md: md`A positive charge means electrons were **lost**. $\mathrm{Na^{+}}$ has 10 electrons, not 12. Write electrons $= Z - q$ and substitute the charge with its sign: for $\mathrm{O^{2-}}$, $8 - (-2) = 10$.`,
    },
    {
      title: 'Removing 3d electrons before 4s',
      md: md`The order of filling is not the order of removal. A transition-metal atom loses its 4s electrons first, so $\mathrm{Cu^{2+}}$ is $[\mathrm{Ar}]\,3d^9$ and $\mathrm{Mn^{2+}}$ is $[\mathrm{Ar}]\,3d^5$. Write the neutral atom, then strip 4s.`,
    },
    {
      title: 'Mixing up mass number and relative atomic mass',
      md: md`The mass number belongs to one nucleus and is a whole number. The relative atomic mass in the table is an average over isotopes and is usually not a whole number. Never compute neutrons from a table value such as $35.5$; use the mass number of the specific isotope.`,
    },
    {
      title: 'Forgetting chromium and copper',
      md: md`The filling order predicts $3d^4\,4s^2$ for chromium and $3d^9\,4s^2$ for copper. Both are wrong: chromium is $3d^5\,4s^1$ and copper is $3d^{10}\,4s^1$. If an option list contains the predicted version, it is there to catch you.`,
    },
  ],
  check: [
    {
      id: 'check-identify-species',
      title: 'Which species?',
      topic: 'Atomic structure',
      stemMd: md`A species has 17 protons, 18 neutrons and 18 electrons. Which is it?`,
      options: [
        { id: 'A', text: md`$^{35}_{17}\mathrm{Cl}$`, note: md`The neutral atom has 17 electrons, one fewer than the species described.` },
        { id: 'B', text: md`$^{35}_{17}\mathrm{Cl^{-}}$`, note: '' },
        { id: 'C', text: md`$^{37}_{17}\mathrm{Cl^{-}}$`, note: md`The charge is right, but $37 - 17 = 20$ neutrons, not 18.` },
        { id: 'D', text: md`$^{35}_{17}\mathrm{Cl^{+}}$`, note: md`A positive ion has lost an electron: 16 electrons. The sign of the charge is reversed.` },
        { id: 'E', text: md`$^{36}_{18}\mathrm{Ar}$`, note: md`It has 18 neutrons and 18 electrons, but 18 protons: the proton count fixes the element, and 17 protons means chlorine.` },
      ],
      answer: 'B',
      workingMd: md`17 protons means chlorine. The mass number is $17 + 18 = 35$. Eighteen electrons is one more than the protons, so the charge is $17 - 18 = -1$: the chloride ion $^{35}_{17}\mathrm{Cl^{-}}$.`,
      lesson: 'Protons fix the element, protons plus neutrons give the mass number, and the electron surplus or deficit gives the charge.',
    },
    {
      id: 'check-cobalt-ion',
      title: 'Configuration of a transition-metal ion',
      topic: 'Electron configuration',
      stemMd: md`What is the ground-state electron configuration of $\mathrm{Co^{2+}}$? (Cobalt has $Z = 27$.)`,
      options: [
        { id: 'A', text: md`$[\mathrm{Ar}]\,3d^5\,4s^2$`, note: md`This removes two 3d electrons and keeps 4s; the 4s electrons are lost first.` },
        { id: 'B', text: md`$[\mathrm{Ar}]\,3d^7\,4s^2$`, note: md`This is the neutral cobalt atom, with 27 electrons; nothing has been removed.` },
        { id: 'C', text: md`$[\mathrm{Ar}]\,3d^7$`, note: '' },
        { id: 'D', text: md`$[\mathrm{Ar}]\,3d^6\,4s^1$`, note: md`The electron count (25) is right, but one electron was taken from 3d; both should come from 4s.` },
        { id: 'E', text: md`$[\mathrm{Ar}]\,3d^8$`, note: md`This has 26 electrons, as if only one electron had been removed.` },
      ],
      answer: 'C',
      workingMd: md`Neutral cobalt: $18 + 2 + 7 = 27$ electrons, $[\mathrm{Ar}]\,3d^7\,4s^2$. The 2+ ion has 25 electrons, and both removed electrons come from 4s: $[\mathrm{Ar}]\,3d^7$.`,
      lesson: 'For a transition-metal cation, write the neutral atom first, then take electrons from 4s before 3d.',
    },
    {
      id: 'check-shell-capacity',
      title: 'How many electrons in a shell?',
      topic: 'Atomic structure',
      stemMd: md`What is the maximum number of electrons that can occupy the shell with principal quantum number $n = 3$?`,
      options: [
        { id: 'A', text: md`6`, note: md`Six is the capacity of the 3p subshell alone; the shell also contains 3s and 3d.` },
        { id: 'B', text: md`8`, note: md`Period 3 has 8 elements because 3d fills only after 4s, but the shell itself can hold more.` },
        { id: 'C', text: md`9`, note: md`Nine is the number of orbitals, $n^2$; each orbital holds two electrons.` },
        { id: 'D', text: md`18`, note: '' },
        { id: 'E', text: md`32`, note: md`32 is the capacity of the $n = 4$ shell, which includes the 4f subshell.` },
      ],
      answer: 'D',
      workingMd: md`Shell 3 has the subshells 3s, 3p and 3d, with $1 + 3 + 5 = 9$ orbitals. At two electrons per orbital that is 18, which matches $2n^2 = 2 \times 9$.`,
      lesson: 'A shell holds $2n^2$ electrons; the length of a period is a different number.',
    },
  ],
  takeaways: [
    md`$Z$ = protons and fixes the element; $A - Z$ = neutrons; electrons $= Z - q$ for an ion of charge $q$.`,
    'Isotopes differ only in neutrons; the relative atomic mass is their abundance-weighted mean.',
    md`s, p, d and f subshells hold 2, 6, 10 and 14 electrons; shell $n$ holds $2n^2$.`,
    'Fill by increasing n + l (4s before 3d), spread electrons out before pairing, and remove 4s electrons first when a transition metal forms a cation.',
    md`Chromium is $3d^5\,4s^1$ and copper is $3d^{10}\,4s^1$.`,
  ],
  flashcards: [
    { front: 'Atomic number and mass number', back: md`The atomic number $Z$ is the number of protons and identifies the element. The mass number $A$ is protons plus neutrons, so neutrons $= A - Z$.` },
    { front: 'Isotopes', back: 'Atoms of the same element (same number of protons) with different numbers of neutrons. They react alike but differ in mass.' },
    { front: 'Capacity of s, p, d and f subshells', back: 'They have 1, 3, 5 and 7 orbitals, so they hold 2, 6, 10 and 14 electrons. A shell n holds 2n² electrons.' },
    { front: 'Hund\'s rule', back: 'In a subshell of equal-energy orbitals, electrons occupy separate orbitals with parallel spins before any orbital takes a pair.' },
    { front: 'Which electrons does a transition metal lose first?', back: md`The 4s electrons, before any 3d electrons: $\mathrm{Fe^{3+}}$ is $[\mathrm{Ar}]\,3d^5$.` },
    { front: 'Chromium and copper configurations', back: md`Chromium is $[\mathrm{Ar}]\,3d^5\,4s^1$ and copper is $[\mathrm{Ar}]\,3d^{10}\,4s^1$: a half-filled or full d subshell is especially stable.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-atoms-periodic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const periodicTableTrendsLesson: Lesson = {
  slug: 'periodic-table-trends',
  title: 'Periodic table trends',
  summary: 'Predict atomic and ionic radius, ionisation energy and electronegativity from an element\'s position, and explain the exceptions the IMAT likes to test.',
  minutes: 18,
  objectives: [
    'Explain the trends in atomic radius, ionisation energy and electronegativity across a period and down a group using nuclear charge and shielding.',
    'Order isoelectronic ions by size.',
    'Read a series of successive ionisation energies to find an element\'s group, and explain the dips in first ionisation energy at groups 13 and 16.',
  ],
  teachMd: md`
### One idea behind every trend

The periodic table is arranged by atomic number, in **periods** (rows) and **groups** (columns). Almost every trend you need comes from one balance: how strongly the nucleus pulls on the outer electrons.

Two things set that pull. The **nuclear charge** (the number of protons) pulls the electrons in. The inner electrons **shield** the outer ones from part of that charge. What an outer electron feels is the **effective nuclear charge**, roughly the nuclear charge minus the shielding by inner shells.

- **Across a period**, each step adds one proton and one electron to the *same* shell. Electrons in the same shell shield each other poorly, so the effective nuclear charge rises and the outer electrons are held more tightly.
- **Down a group**, each step adds a whole new shell. The outer electrons are farther away and better shielded, so they are held less tightly, even though the nucleus has more protons.

Keep these two sentences in mind and the trends below follow.

### Atomic radius

Atomic radius **decreases across a period** (stronger pull, same shell) and **increases down a group** (more shells). Sodium is larger than chlorine; caesium is larger than lithium. The common slip is to think more electrons must mean a bigger atom: across a period the extra electrons go into the same shell while the pull grows.

### Ionic radius

A **cation** is smaller than its atom: it has lost its outer electrons, often a whole shell, and the remaining electrons feel the same nucleus. An **anion** is larger than its atom: extra electrons repel each other in the same shell while the nuclear charge is unchanged.

For **isoelectronic** species (the same number of electrons), the one with more protons is smaller. The ions $\mathrm{O^{2-}}$, $\mathrm{F^{-}}$, $\mathrm{Na^{+}}$ and $\mathrm{Mg^{2+}}$ all have 10 electrons, with 8, 9, 11 and 12 protons, so their radii fall in that order.

### Ionisation energy

The **first ionisation energy** is the energy needed to remove one electron from each atom in a mole of gaseous atoms:

$$\mathrm{X(g)} \rightarrow \mathrm{X^{+}(g)} + e^{-}$$

It generally **increases across a period** and **decreases down a group**, the reverse of atomic radius, for the same reason. Noble gases have the highest value in each period; helium has the highest of all.

Two dips break the rise across a period, and they are favourite questions:

- **Group 2 to group 13** (beryllium to boron, magnesium to aluminium): the electron removed from boron is in a 2p orbital, higher in energy than 2s and partly shielded by the 2s electrons, so it is easier to remove.
- **Group 15 to group 16** (nitrogen to oxygen, phosphorus to sulfur): oxygen's fourth 2p electron must share an orbital with another electron. The repulsion within that pair makes it easier to remove than any electron in nitrogen's half-filled $2p^3$.

### Successive ionisation energies

Each further electron is harder to remove than the last, because it leaves an ion that is increasingly positive. The increase is gradual within one shell and **jumps** when the next electron must come from a shell closer to the nucleus. Count the electrons removed before the big jump: that is the number of outer-shell electrons, and for a main-group element it gives the group.

### Electronegativity

**Electronegativity** is the ability of an atom in a bond to attract the shared electrons. On the Pauling scale fluorine is highest (about 4.0), followed by oxygen (about 3.4), with nitrogen and chlorine near 3.0. It **increases across a period** and **decreases down a group**, so the least electronegative elements are at the bottom left (caesium, francium). Noble gases are usually left out because they rarely form bonds.

Electronegativity is not the same as **electron affinity**, the energy released when a gaseous atom gains an electron. They follow similar trends, but electron affinity is measured on isolated atoms, while electronegativity describes atoms in bonds. Chlorine, not fluorine, releases the most energy on gaining an electron.

### Metallic character

Metallic character (the tendency to lose electrons) **decreases across a period** and **increases down a group**. Metals sit on the left and below; non-metals on the right and above, with the metalloids (boron, silicon, germanium, arsenic and others) along the boundary. This also predicts oxides: metal oxides such as $\mathrm{Na_2O}$ are basic, non-metal oxides such as $\mathrm{SO_3}$ are acidic.

### A summary to carry

| Property | Across a period (left to right) | Down a group |
| --- | --- | --- |
| atomic radius | decreases | increases |
| first ionisation energy | increases (dips at groups 13 and 16) | decreases |
| electronegativity | increases | decreases |
| metallic character | decreases | increases |
`,
  examples: [
    {
      id: 'example-isoelectronic-ions',
      title: 'Ordering isoelectronic ions',
      problemMd: md`Arrange $\mathrm{Na^{+}}$, $\mathrm{Mg^{2+}}$, $\mathrm{F^{-}}$ and $\mathrm{O^{2-}}$ from largest to smallest.`,
      steps: [
        md`Count electrons: $11 - 1$, $12 - 2$, $9 + 1$ and $8 + 2$ are all 10. The ions are isoelectronic, so only the number of protons differs.`,
        md`More protons pull the same 10 electrons in more tightly, giving a smaller ion. Proton numbers: O 8, F 9, Na 11, Mg 12.`,
        md`Order by protons, fewest first, for largest first: $\mathrm{O^{2-}} > \mathrm{F^{-}} > \mathrm{Na^{+}} > \mathrm{Mg^{2+}}$.`,
      ],
      answerMd: md`$\mathrm{O^{2-}} > \mathrm{F^{-}} > \mathrm{Na^{+}} > \mathrm{Mg^{2+}}$. Placing the sodium and magnesium ions first because the atoms are large is the tempting mistake: those ions have lost their whole third shell.`,
    },
    {
      id: 'example-successive-ie',
      title: 'Finding the group from ionisation energies',
      problemMd: md`An element of period 3 has these first four ionisation energies, in kJ/mol (rounded): 740, 1450, 7730, 10540. Which group is it in, and which element is it?`,
      steps: [
        md`Look at the ratios between neighbours: $1450$ is about twice $740$, but $7730$ is more than five times $1450$. The big jump is between the second and third values.`,
        md`So two electrons come off relatively easily; the third has to come from the inner, second shell.`,
        md`Two outer electrons means group 2. In period 3, group 2 is magnesium, $[\mathrm{Ne}]\,3s^2$.`,
      ],
      answerMd: md`Group 2: magnesium. Reading the largest single value (10540) instead of the largest jump would point, wrongly, to the fourth electron.`,
    },
    {
      id: 'example-ie-dips',
      title: 'Why oxygen is below nitrogen',
      problemMd: md`The first ionisation energy of nitrogen (about 1400 kJ/mol) is higher than that of oxygen (about 1310 kJ/mol), though oxygen has more protons. Explain.`,
      steps: [
        md`Write the 2p occupancy. Nitrogen is $2p^3$: one electron in each p orbital, all unpaired (Hund's rule). Oxygen is $2p^4$: one orbital holds a pair.`,
        md`The two electrons sharing an orbital repel each other. That repulsion makes one of them easier to remove.`,
        md`This effect outweighs the extra proton, so oxygen loses its first electron more easily than nitrogen.`,
      ],
      answerMd: md`Oxygen's first electron comes from a doubly occupied 2p orbital, and electron–electron repulsion lowers the energy needed. "Oxygen has more protons, so its value must be higher" is the trend applied without its exception.`,
    },
  ],
  traps: [
    {
      title: 'More electrons, bigger atom',
      md: md`Across a period the atom gains electrons but shrinks, because they enter the same shell while the nuclear charge rises. Size grows only when a new shell is added, going down a group.`,
    },
    {
      title: 'Ignoring the charge on ions',
      md: md`Comparing $\mathrm{K^{+}}$ with $\mathrm{Cl^{-}}$ by the size of the atoms gives the wrong answer. They are isoelectronic (18 electrons), and potassium has 19 protons to chlorine's 17, so $\mathrm{K^{+}}$ is the smaller. Count electrons first, then compare protons.`,
    },
    {
      title: 'Assuming ionisation energy rises smoothly',
      md: md`Across period 2 the first ionisation energy dips at boron and at oxygen. An option that orders beryllium above boron, or nitrogen above oxygen, is correct; do not reject it for breaking the general trend.`,
    },
    {
      title: 'Treating electronegativity and electron affinity as one',
      md: md`Fluorine is the most electronegative element, but chlorine has the most exothermic electron affinity. Answer the property the question names.`,
    },
  ],
  check: [
    {
      id: 'check-highest-ie',
      title: 'Highest first ionisation energy',
      topic: 'Periodic trends',
      stemMd: md`Which of these period 2 elements has the highest first ionisation energy?`,
      options: [
        { id: 'A', text: md`Lithium`, note: md`Lithium has the lowest value in the list: its single 2s electron is far from a nucleus of only 3 protons and well shielded.` },
        { id: 'B', text: md`Boron`, note: md`Boron is lower even than beryllium, since its electron comes from a 2p orbital; it is far below nitrogen.` },
        { id: 'C', text: md`Carbon`, note: md`Carbon follows the rising trend but has one proton fewer than nitrogen and no special stability to offset it.` },
        { id: 'D', text: md`Nitrogen`, note: '' },
        { id: 'E', text: md`Oxygen`, note: md`This applies "increases across a period" without the exception: oxygen's paired 2p electron is easier to remove than nitrogen's.` },
      ],
      answer: 'D',
      workingMd: md`Ionisation energy rises across period 2, so the choice is between nitrogen and oxygen. Oxygen's $2p^4$ has one paired electron, and the repulsion within the pair makes it easier to remove than any electron of nitrogen's half-filled $2p^3$. Nitrogen is highest.`,
      lesson: 'Across a period the first ionisation energy rises, except for the dips at groups 13 and 16.',
    },
    {
      id: 'check-ion-radii',
      title: 'Ordering ionic radii',
      topic: 'Periodic trends',
      stemMd: md`Which list orders the ions from largest to smallest radius?`,
      options: [
        { id: 'A', text: md`$\mathrm{Ca^{2+}} > \mathrm{K^{+}} > \mathrm{Cl^{-}} > \mathrm{S^{2-}}$`, note: md`This is the exact reverse: more protons for the same 18 electrons make an ion smaller, not larger.` },
        { id: 'B', text: md`$\mathrm{S^{2-}} > \mathrm{Cl^{-}} > \mathrm{K^{+}} > \mathrm{Ca^{2+}}$`, note: '' },
        { id: 'C', text: md`$\mathrm{K^{+}} > \mathrm{Ca^{2+}} > \mathrm{S^{2-}} > \mathrm{Cl^{-}}$`, note: md`This uses the sizes of the atoms (period 4 metals are large atoms) and ignores that the cations have lost their fourth shell.` },
        { id: 'D', text: md`$\mathrm{Cl^{-}} > \mathrm{S^{2-}} > \mathrm{K^{+}} > \mathrm{Ca^{2+}}$`, note: md`The cations are right, but sulfur, with one proton fewer than chlorine, holds the same 18 electrons less tightly and is larger.` },
        { id: 'E', text: md`$\mathrm{S^{2-}} > \mathrm{Cl^{-}} > \mathrm{Ca^{2+}} > \mathrm{K^{+}}$`, note: md`The anions are right, but calcium has 20 protons to potassium's 19, so $\mathrm{Ca^{2+}}$ is the smaller cation.` },
      ],
      answer: 'B',
      workingMd: md`All four ions have 18 electrons: $16 + 2$, $17 + 1$, $19 - 1$ and $20 - 2$. With equal electrons, more protons means a smaller ion. Protons: S 16, Cl 17, K 19, Ca 20, so the radii fall in that order.`,
      lesson: 'For isoelectronic ions, rank by protons: the fewer protons, the larger the ion.',
    },
    {
      id: 'check-ie-jump',
      title: 'Which element?',
      topic: 'Periodic trends',
      stemMd: md`An element of period 3 has these first four ionisation energies, in kJ/mol: 578, 1817, 2745, 11577. Which element is it?`,
      options: [
        { id: 'A', text: md`Sodium`, note: md`Sodium has one outer electron, so its big jump comes between the first and second values.` },
        { id: 'B', text: md`Magnesium`, note: md`Magnesium's jump comes after two electrons; here the second-to-third step is less than double.` },
        { id: 'C', text: md`Aluminium`, note: '' },
        { id: 'D', text: md`Silicon`, note: md`Silicon has four outer electrons, so its fourth value would still be in the gradual range; the jump would come at the fifth.` },
        { id: 'E', text: md`Phosphorus`, note: md`Phosphorus has five outer electrons and no jump until the sixth ionisation energy.` },
      ],
      answer: 'C',
      workingMd: md`Compare neighbours: 1817 is about 3 times 578 and 2745 about 1.5 times 1817, both gradual, but 11577 is more than 4 times 2745. The jump is after the third electron, so there are three outer electrons: group 13. In period 3 that is aluminium, $[\mathrm{Ne}]\,3s^2\,3p^1$.`,
      lesson: 'The number of electrons removed before the largest jump is the number of outer-shell electrons.',
    },
  ],
  takeaways: [
    'Across a period the effective nuclear charge rises: atoms shrink, and ionisation energy and electronegativity rise.',
    'Down a group a new shell is added: atoms grow, and ionisation energy and electronegativity fall.',
    'Cations are smaller and anions larger than their atoms; among isoelectronic ions, more protons means smaller.',
    'First ionisation energy dips at groups 13 and 16; a jump in successive ionisation energies reveals the number of outer electrons.',
  ],
  flashcards: [
    { front: 'Effective nuclear charge', back: 'The net positive charge an outer electron feels: the nuclear charge minus the shielding by inner electrons. It rises across a period.' },
    { front: 'Atomic radius trends', back: 'Decreases across a period (same shell, stronger pull) and increases down a group (one more shell each step).' },
    { front: 'Isoelectronic ions: which is smallest?', back: 'The one with the most protons, because it pulls the same number of electrons in most tightly.' },
    { front: 'The two dips in first ionisation energy', back: 'From group 2 to 13 (the electron comes from a higher-energy p orbital) and from group 15 to 16 (the electron is paired and repelled by its partner).' },
    { front: 'Reading successive ionisation energies', back: 'Find the largest jump. The number of electrons removed before it equals the number of outer-shell electrons, which gives the group of a main-group element.' },
    { front: 'Most electronegative element', back: 'Fluorine, about 4.0 on the Pauling scale. Electronegativity rises across a period and falls down a group.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-atoms-periodic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const chemicalBondingAndMolecularShapeLesson: Lesson = {
  slug: 'chemical-bonding-and-molecular-shape',
  title: 'Chemical bonding and molecular shape',
  summary: 'Tell ionic, covalent and metallic bonds apart, predict molecular shapes with VSEPR, and decide whether a molecule is polar.',
  minutes: 22,
  objectives: [
    'Classify a bond as ionic, polar covalent or non-polar covalent from electronegativity, and describe metallic and dative bonding.',
    'Predict the shape and approximate bond angle of a small molecule or ion with VSEPR.',
    'Decide whether a molecule is polar from its bond polarities and its shape, and count its sigma and pi bonds.',
  ],
  teachMd: md`
### Why atoms bond

Atoms bond because the bonded arrangement has lower energy than the separate atoms. For main-group elements a useful guide is the **octet rule**: atoms tend to gain, lose or share electrons until they have eight in their outer shell (two for hydrogen). It is a guide, not a law, as the exceptions below show.

### Ionic bonds

When a metal with low ionisation energy meets a non-metal with high electronegativity, electrons are **transferred**. Sodium gives one electron to chlorine, forming $\mathrm{Na^{+}}$ and $\mathrm{Cl^{-}}$, and the ions are held by electrostatic attraction in all directions. The result is a **lattice**, not molecules: the formula $\mathrm{NaCl}$ gives the ratio of ions. Ionic solids have high melting points, are often soluble in water, and conduct electricity only when molten or dissolved, when the ions can move.

### Covalent bonds

Between non-metals, electrons are **shared**: a pair of shared electrons is a single bond, two pairs a double bond, three pairs a triple bond. If the two atoms have equal electronegativity, as in $\mathrm{Cl_2}$, the pair is shared equally and the bond is **non-polar**. If not, the pair sits closer to the more electronegative atom, which carries a partial negative charge ($\delta^{-}$); the bond is **polar**.

Electronegativity difference gives a rough classification on the Pauling scale: below about 0.4, non-polar covalent; from about 0.4 to about 1.8, polar covalent; above about 1.8, mainly ionic. The boundaries are conventions and textbooks place them a little differently; bonding is a continuum.

A **dative** (coordinate) bond is a covalent bond in which both shared electrons come from one atom. Ammonia's lone pair bonds to $\mathrm{H^{+}}$ to form $\mathrm{NH_4^{+}}$. Once formed, a dative bond is identical to the others: the four N–H bonds of the ammonium ion are equivalent.

### Metallic bonds

In a metal, the atoms give up their outer electrons to a "sea" of **delocalised electrons** that move through a lattice of positive ions. This explains why metals conduct electricity and heat, and why they are malleable: the layers can slide without breaking the bonding.

### Bond order, length and strength

| Bond | Shared pairs | Sigma (σ) | Pi (π) |
| --- | --- | --- | --- |
| single | 1 | 1 | 0 |
| double | 2 | 1 | 1 |
| triple | 3 | 1 | 2 |

The first bond between two atoms is always a **sigma** bond, formed by head-on overlap of orbitals. Extra bonds are **pi** bonds, from side-on overlap of p orbitals. Between the same two atoms, a triple bond is shorter and stronger than a double, and a double than a single.

### Exceptions to the octet

Boron in $\mathrm{BF_3}$ has only six outer electrons. Central atoms from period 3 onwards, which are larger, can hold more than eight (an **expanded octet**): phosphorus in $\mathrm{PCl_5}$ has ten, sulfur in $\mathrm{SF_6}$ has twelve.

### VSEPR: predicting shape

Valence-shell electron-pair repulsion (VSEPR) says that the electron domains around a central atom (bonds and lone pairs) repel each other and get as far apart as possible. A double or triple bond counts as **one** domain.

1. Count the domains around the central atom: bonded atoms plus lone pairs.
2. The number of domains gives the electron geometry.
3. The **shape** is named from the positions of the atoms only; lone pairs are there but not named.

| Domains | Lone pairs | Shape | Angle | Example |
| --- | --- | --- | --- | --- |
| 2 | 0 | linear | 180° | $\mathrm{CO_2}$ |
| 3 | 0 | trigonal planar | 120° | $\mathrm{BF_3}$ |
| 3 | 1 | bent | a little under 120° | $\mathrm{SO_2}$ |
| 4 | 0 | tetrahedral | 109.5° | $\mathrm{CH_4}$ |
| 4 | 1 | trigonal pyramidal | about 107° | $\mathrm{NH_3}$ |
| 4 | 2 | bent | about 104.5° | $\mathrm{H_2O}$ |
| 5 | 0 | trigonal bipyramidal | 90° and 120° | $\mathrm{PCl_5}$ |
| 6 | 0 | octahedral | 90° | $\mathrm{SF_6}$ |

Lone pairs repel more strongly than bonding pairs, which is why the angles in ammonia and water are squeezed below 109.5°.

The domain count also gives the **hybridisation** of the central atom: 2 domains sp, 3 domains sp², 4 domains sp³.

### Is the molecule polar?

A molecule is polar if its bond dipoles do **not cancel**. That needs both polar bonds and a shape that leaves them unbalanced.

- $\mathrm{CO_2}$ has two polar C=O bonds, but they point in opposite directions on a straight line and cancel: non-polar.
- $\mathrm{H_2O}$ has two polar O–H bonds at about 104.5°; they add up: polar.
- $\mathrm{CCl_4}$ is a symmetrical tetrahedron: non-polar. Replace one chlorine with hydrogen, as in $\mathrm{CHCl_3}$, and the symmetry is broken: polar.

Symmetrical shapes with identical atoms on every position (linear, trigonal planar, tetrahedral, octahedral) give non-polar molecules. Lone pairs on the central atom almost always make the molecule polar.
`,
  examples: [
    {
      id: 'example-ammonia-shape',
      title: 'The shape of ammonia',
      problemMd: md`Predict the shape and approximate H–N–H angle of $\mathrm{NH_3}$, and say whether it is polar.`,
      steps: [
        md`Nitrogen has 5 outer electrons. Three are used in bonds to hydrogen; the other two form a lone pair.`,
        md`Domains: 3 bonds + 1 lone pair = 4, so the electron geometry is tetrahedral.`,
        md`Naming the shape from the atoms only: nitrogen with three hydrogens below it is **trigonal pyramidal**. The lone pair squeezes the angle from 109.5° to about 107°.`,
        md`The N–H bonds are polar (nitrogen is more electronegative), and the pyramid is not symmetrical, so the dipoles add.`,
      ],
      answerMd: md`Trigonal pyramidal, about 107°, polar. "Trigonal planar" is the tempting wrong answer from counting only the three bonds and forgetting the lone pair.`,
    },
    {
      id: 'example-co2-so2',
      title: 'Carbon dioxide against sulfur dioxide',
      problemMd: md`Both $\mathrm{CO_2}$ and $\mathrm{SO_2}$ have a central atom bonded to two oxygen atoms. Explain why one is linear and non-polar and the other bent and polar.`,
      steps: [
        md`In $\mathrm{CO_2}$, carbon uses all four outer electrons in two double bonds and has no lone pair: 2 domains, linear, 180°.`,
        md`The two C=O dipoles are equal and opposite, so they cancel: $\mathrm{CO_2}$ is non-polar.`,
        md`In $\mathrm{SO_2}$, sulfur has 6 outer electrons; after bonding to both oxygens it keeps one lone pair. Domains: 2 bonded atoms + 1 lone pair = 3, so the molecule is bent, a little under 120°.`,
        md`In a bent molecule the two S–O dipoles do not point in opposite directions, so they do not cancel: $\mathrm{SO_2}$ is polar.`,
      ],
      answerMd: md`The lone pair on sulfur makes $\mathrm{SO_2}$ bent and polar; carbon in $\mathrm{CO_2}$ has none, so it is linear and non-polar. Judging polarity from the bonds alone would call both polar.`,
    },
    {
      id: 'example-classify-bonds',
      title: 'Classifying bonds by electronegativity',
      problemMd: md`Using Pauling electronegativities Na 0.9, H 2.2 and Cl 3.2, classify the bonding in $\mathrm{NaCl}$, $\mathrm{HCl}$ and $\mathrm{Cl_2}$.`,
      steps: [
        md`$\mathrm{NaCl}$: difference $3.2 - 0.9 = 2.3$, above about 1.8: mainly ionic.`,
        md`$\mathrm{HCl}$: difference $3.2 - 2.2 = 1.0$: polar covalent, with $\delta^{-}$ on chlorine.`,
        md`$\mathrm{Cl_2}$: difference $0$: non-polar covalent.`,
      ],
      answerMd: md`Ionic, polar covalent and non-polar covalent. Calling $\mathrm{HCl}$ ionic because it forms ions in water confuses what happens in solution with the bond in the gas molecule.`,
    },
  ],
  traps: [
    {
      title: 'Polar bonds, therefore a polar molecule',
      md: md`$\mathrm{CO_2}$, $\mathrm{BF_3}$ and $\mathrm{CCl_4}$ all have polar bonds and are non-polar molecules, because their symmetry cancels the dipoles. Always draw the shape before deciding.`,
    },
    {
      title: 'Naming the shape after the lone pairs too',
      md: md`Water has four electron domains, so its electron geometry is tetrahedral, but its **shape** is bent. Lone pairs set the angles; they are not part of the shape's name.`,
    },
    {
      title: 'Counting a double bond as two domains',
      md: md`In VSEPR a double or triple bond is one domain. Counting the two double bonds of $\mathrm{CO_2}$ as four domains would wrongly predict a tetrahedral arrangement.`,
    },
    {
      title: 'Counting every line as a sigma bond',
      md: md`A triple bond is one sigma and two pi bonds. In $\mathrm{C_2H_4}$ there are five sigma bonds (four C–H and one C–C) and one pi bond, not six sigma bonds.`,
    },
  ],
  check: [
    {
      id: 'check-polar-molecule',
      title: 'Which molecule is polar?',
      topic: 'Molecular polarity',
      stemMd: md`Which of these molecules is polar?`,
      options: [
        { id: 'A', text: md`$\mathrm{CO_2}$`, note: md`Its C=O bonds are polar, but the molecule is linear and the two dipoles cancel.` },
        { id: 'B', text: md`$\mathrm{BF_3}$`, note: md`Boron has no lone pair; the trigonal planar shape cancels the three B–F dipoles.` },
        { id: 'C', text: md`$\mathrm{CCl_4}$`, note: md`Four identical C–Cl dipoles at tetrahedral angles cancel exactly.` },
        { id: 'D', text: md`$\mathrm{CH_4}$`, note: md`The C–H bonds are only slightly polar, and the symmetrical tetrahedron cancels them anyway.` },
        { id: 'E', text: md`$\mathrm{NH_3}$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Each of the four other molecules has a symmetrical shape with identical atoms around a central atom that has no lone pair, so its bond dipoles cancel. Ammonia's lone pair makes it trigonal pyramidal; its three polar N–H bonds point the same way and add up to a net dipole.`,
      lesson: 'A molecule is polar only if its bond dipoles fail to cancel, so check the shape, not just the bonds.',
    },
    {
      id: 'check-pcl3-shape',
      title: 'The shape of phosphorus trichloride',
      topic: 'Molecular shape',
      stemMd: md`What is the shape of a $\mathrm{PCl_3}$ molecule?`,
      options: [
        { id: 'A', text: md`Trigonal planar`, note: md`This counts the three P–Cl bonds and forgets phosphorus's lone pair.` },
        { id: 'B', text: md`Trigonal pyramidal`, note: '' },
        { id: 'C', text: md`T-shaped`, note: md`A T shape needs five domains, two of them lone pairs; phosphorus here has four domains.` },
        { id: 'D', text: md`Tetrahedral`, note: md`Tetrahedral is the arrangement of the four electron domains; the shape is named from the atoms only.` },
        { id: 'E', text: md`Bent`, note: md`A bent molecule has only two atoms bonded to the centre; phosphorus here bonds to three.` },
      ],
      answer: 'B',
      workingMd: md`Phosphorus has 5 outer electrons: three form bonds to chlorine and two form a lone pair. That gives 4 domains, a tetrahedral arrangement, and with one position taken by the lone pair the atoms form a trigonal pyramid, like ammonia.`,
      lesson: 'Count lone pairs to find the arrangement, then name the shape from the atoms alone.',
    },
    {
      id: 'check-hcn-bonds',
      title: 'Sigma and pi bonds in HCN',
      topic: 'Chemical bonding',
      stemMd: md`Hydrogen cyanide has the structure H–C≡N. How many sigma and pi bonds does it contain?`,
      options: [
        { id: 'A', text: md`2 sigma and 2 pi`, note: '' },
        { id: 'B', text: md`1 sigma and 3 pi`, note: md`This treats all three shared pairs of the triple bond as pi, leaving only the H–C bond as sigma; a triple bond always contains one sigma bond.` },
        { id: 'C', text: md`3 sigma and 1 pi`, note: md`A triple bond has only one sigma bond; the other two shared pairs are pi bonds.` },
        { id: 'D', text: md`4 sigma and 0 pi`, note: md`This counts every line as a sigma bond.` },
        { id: 'E', text: md`2 sigma and 1 pi`, note: md`This gives the C≡N bond only one pi bond, as a double bond would have.` },
      ],
      answer: 'A',
      workingMd: md`The H–C single bond is one sigma bond. The C≡N triple bond is one sigma and two pi bonds. In total: 2 sigma and 2 pi.`,
      lesson: 'Every bond between two atoms has exactly one sigma bond; any extra shared pairs are pi bonds.',
    },
  ],
  takeaways: [
    'Ionic bonds transfer electrons, covalent bonds share them, metallic bonds delocalise them.',
    'The electronegativity difference sets bond polarity: roughly below 0.4 non-polar, up to about 1.8 polar covalent, above that mainly ionic.',
    'VSEPR: count bonded atoms plus lone pairs, find the arrangement, then name the shape from the atoms only.',
    'A molecule is polar only if its bond dipoles do not cancel; lone pairs on the central atom usually make it polar.',
    'A single bond is one sigma bond; a double adds one pi bond, a triple adds two.',
  ],
  flashcards: [
    { front: 'Dative (coordinate) bond', back: md`A covalent bond in which one atom supplies both electrons, as when ammonia's lone pair bonds to $\mathrm{H^{+}}$. Once formed it is identical to other covalent bonds.` },
    { front: 'VSEPR shape with 4 domains and 1 lone pair', back: md`Trigonal pyramidal, with angles of about 107°, as in $\mathrm{NH_3}$.` },
    { front: 'VSEPR shape with 4 domains and 2 lone pairs', back: md`Bent, with an angle of about 104.5°, as in $\mathrm{H_2O}$.` },
    { front: 'Why is CO₂ non-polar?', back: 'It is linear, so its two equal, polar C=O bond dipoles point in opposite directions and cancel.' },
    { front: 'Sigma and pi bonds in a triple bond', back: 'One sigma bond (head-on overlap) and two pi bonds (side-on overlap of p orbitals).' },
    { front: 'Hybridisation from the number of domains', back: 'Two domains: sp. Three domains: sp². Four domains: sp³.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-bonding' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const intermolecularForcesAndStatesOfMatterLesson: Lesson = {
  slug: 'intermolecular-forces-and-states-of-matter',
  title: 'Intermolecular forces, states of matter and gases',
  summary: 'Rank boiling points from intermolecular forces, explain changes of state, and use the gas laws and pV = nRT without a calculator.',
  minutes: 22,
  objectives: [
    'Identify the intermolecular forces in a substance (dispersion, dipole–dipole, hydrogen bonding) and use them to rank boiling points.',
    'Describe the four types of solid and what happens to energy and temperature during a change of state.',
    'Apply the combined gas law and the ideal gas equation, with temperatures in kelvin.',
  ],
  teachMd: md`
### Forces inside and between molecules

**Intramolecular** forces are the bonds inside a molecule. **Intermolecular** forces are the much weaker attractions between molecules. When water boils, the O–H bonds stay intact: the molecules are only pulled apart from each other. Boiling and melting points of molecular substances therefore measure intermolecular forces.

### The three intermolecular forces

- **London dispersion forces** act between all molecules. Electrons move, so at any instant a molecule has a small temporary dipole, which induces one in its neighbour. They grow with the number of electrons (roughly, with molar mass) and with surface area: a long, straight molecule has more contact than a compact, branched one of the same formula.
- **Dipole–dipole forces** act between polar molecules, whose permanent $\delta^{+}$ and $\delta^{-}$ ends attract.
- **Hydrogen bonds** are an especially strong dipole–dipole attraction. They need a hydrogen atom bonded to **N, O or F**, and a lone pair on an N, O or F atom of a neighbouring molecule. The small, very electronegative atom leaves the hydrogen almost bare, so it is drawn strongly to the lone pair.

For small molecules of similar size, the usual order of strength is dispersion < dipole–dipole < hydrogen bonding, and all three are far weaker than covalent bonds. For large molecules, dispersion can outweigh the other two: iodine, $\mathrm{I_2}$, is non-polar yet solid at room temperature.

### Ranking boiling points

1. Compare molecules of similar size first, and look for hydrogen bonding, then polarity.
2. Among molecules with the same kind of forces, more electrons means stronger dispersion and a higher boiling point: $\mathrm{F_2} < \mathrm{Cl_2} < \mathrm{Br_2} < \mathrm{I_2}$.

The hydrides of group 16 show the effect of hydrogen bonding clearly. Water boils at 100 °C, while hydrogen sulfide, a larger molecule without hydrogen bonds, boils at about −60 °C. Hydrogen bonding also explains why ice floats: in ice each molecule is hydrogen-bonded to four others in an open lattice, which is less dense than liquid water.

A trap here: a molecule can contain hydrogen and oxygen and still not hydrogen-bond with itself. In dimethyl ether, $\mathrm{CH_3OCH_3}$, every hydrogen is bonded to carbon. In $\mathrm{HCl}$, the hydrogen is bonded to chlorine, which is not N, O or F.

### Solids, liquids and gases

In a **solid** the particles vibrate about fixed positions; in a **liquid** they stay in contact but move past each other; in a **gas** they are far apart and move freely. Solids come in four types:

| Type | Particles and forces | Typical behaviour | Example |
| --- | --- | --- | --- |
| ionic | ions, ionic bonds | high melting point; conducts when molten or dissolved | $\mathrm{NaCl}$ |
| molecular | molecules, intermolecular forces | low melting point; does not conduct | ice, $\mathrm{I_2}$ |
| covalent network | atoms, covalent bonds throughout | very high melting point; very hard | diamond, $\mathrm{SiO_2}$ |
| metallic | cations in delocalised electrons | conducts as a solid; malleable | copper |

### Changes of state

During melting or boiling, the temperature stays **constant** while heat is absorbed: the energy goes into overcoming intermolecular forces, not into faster motion. That energy is the latent heat (enthalpy) of fusion or vaporisation.

A liquid's molecules constantly escape into the vapour above it; the pressure that vapour exerts at equilibrium is the **vapour pressure**, which rises with temperature. A liquid **boils** when its vapour pressure equals the external pressure. So water boils below 100 °C at high altitude, where the air pressure is lower, and above 100 °C in a pressure cooker.

### Gases and the ideal gas law

The kinetic theory pictures a gas as tiny particles in random motion, with no forces between them except during collisions. Their average kinetic energy is proportional to the **absolute temperature**, in kelvin: $T(\mathrm{K}) = t(°\mathrm{C}) + 273$. Every gas law needs kelvin.

| Law | Held constant | Relation |
| --- | --- | --- |
| Boyle | $n$, $T$ | $p_1V_1 = p_2V_2$ |
| Charles | $n$, $p$ | $\frac{V_1}{T_1} = \frac{V_2}{T_2}$ |
| Gay-Lussac | $n$, $V$ | $\frac{p_1}{T_1} = \frac{p_2}{T_2}$ |
| Avogadro | $p$, $T$ | $V \propto n$ |

They combine into the **combined gas law** for a fixed amount of gas, and into the **ideal gas equation**:

$$\frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2} \qquad\qquad pV = nRT$$

The gas constant is $R = 8.314\ \mathrm{J\,mol^{-1}\,K^{-1}}$ when $p$ is in pascals and $V$ in cubic metres, or about $0.082\ \mathrm{L\,atm\,mol^{-1}\,K^{-1}}$ when $p$ is in atmospheres and $V$ in litres. Choose the value that matches the units in the question. Useful conversions: $1\ \mathrm{L} = 10^{-3}\ \mathrm{m^3}$ and $1\ \mathrm{atm} = 101.3\ \mathrm{kPa}$.

At 0 °C and 1 atm, one mole of any ideal gas occupies about **22.4 L**, whatever the gas. (Some books use 100 kPa as standard pressure, which gives 22.7 L; use the value the question gives.)

In a mixture, each gas exerts its own **partial pressure**, and the total pressure is their sum (Dalton's law). The partial pressure of a gas is its mole fraction times the total pressure.

Real gases follow these laws best at low pressure and high temperature, where the particles are far apart and the forces between them matter least.
`,
  examples: [
    {
      id: 'example-rank-boiling',
      title: 'Ranking boiling points',
      problemMd: md`Rank $\mathrm{CH_4}$, $\mathrm{HCl}$ and $\mathrm{H_2O}$ from lowest to highest boiling point.`,
      steps: [
        md`$\mathrm{CH_4}$ is non-polar (a symmetrical tetrahedron): dispersion forces only.`,
        md`$\mathrm{HCl}$ is polar, so it has dipole–dipole forces as well as dispersion. Chlorine is not N, O or F, so there is no hydrogen bonding.`,
        md`$\mathrm{H_2O}$ has hydrogen atoms bonded to oxygen and two lone pairs on oxygen: hydrogen bonding, the strongest of the three.`,
        md`Ranking by strongest force present: $\mathrm{CH_4} < \mathrm{HCl} < \mathrm{H_2O}$. The real values agree: about −161 °C, −85 °C and 100 °C.`,
      ],
      answerMd: md`$\mathrm{CH_4} < \mathrm{HCl} < \mathrm{H_2O}$. Ranking by molar mass alone (16, 36.5 and 18) would wrongly put $\mathrm{HCl}$ highest.`,
    },
    {
      id: 'example-combined-gas-law',
      title: 'Changing temperature and pressure together',
      problemMd: md`A gas occupies 4.0 L at 27 °C and 1.0 atm. It is heated to 177 °C and compressed to 2.0 atm. What is its new volume?`,
      steps: [
        md`Convert to kelvin: $T_1 = 27 + 273 = 300\ \mathrm{K}$ and $T_2 = 177 + 273 = 450\ \mathrm{K}$.`,
        md`Rearrange the combined gas law: $V_2 = V_1 \times \frac{p_1}{p_2} \times \frac{T_2}{T_1}$.`,
        md`Substitute: $V_2 = 4.0 \times \frac{1.0}{2.0} \times \frac{450}{300} = 4.0 \times 0.5 \times 1.5 = 3.0\ \mathrm{L}$.`,
        md`Sense check: doubling the pressure halves the volume (2.0 L); heating by a factor of 1.5 then expands it to 3.0 L.`,
      ],
      answerMd: md`The new volume is 3.0 L. Using Celsius temperatures gives $4.0 \times 0.5 \times \frac{177}{27}$, about 13 L, which is wrong.`,
    },
    {
      id: 'example-ideal-gas-moles',
      title: 'Moles from pV = nRT',
      problemMd: md`A 10.0 L cylinder holds oxygen at 2.46 atm and 27 °C. Using $R = 0.082\ \mathrm{L\,atm\,mol^{-1}\,K^{-1}}$, find the amount of oxygen in moles and its mass.`,
      steps: [
        md`Temperature in kelvin: $27 + 273 = 300\ \mathrm{K}$.`,
        md`Rearrange: $n = \frac{pV}{RT} = \frac{2.46 \times 10.0}{0.082 \times 300}$.`,
        md`Numerator: $24.6$. Denominator: $0.082 \times 300 = 24.6$. So $n = 1.00\ \mathrm{mol}$.`,
        md`Mass: oxygen gas is $\mathrm{O_2}$, $M = 32\ \mathrm{g/mol}$, so the mass is $32\ \mathrm{g}$.`,
      ],
      answerMd: md`1.00 mol, or 32 g, of oxygen. Using 16 g/mol (atomic oxygen) would give 16 g: oxygen gas is diatomic.`,
    },
  ],
  traps: [
    {
      title: 'Using Celsius in a gas law',
      md: md`Gas laws are proportions in absolute temperature. Going from 20 °C to 40 °C does not double anything: in kelvin it is 293 K to 313 K, an increase of under 7%. Add 273 before you divide.`,
    },
    {
      title: 'Thinking boiling breaks covalent bonds',
      md: md`Boiling water gives water vapour, not hydrogen and oxygen. Only the attractions between molecules are overcome. An option that explains a boiling point by "the strength of the O–H bond" is a trap.`,
    },
    {
      title: 'Seeing hydrogen bonding wherever there is H and O',
      md: md`The hydrogen must be bonded directly to N, O or F. Dimethyl ether, aldehydes and $\mathrm{CH_3F}$ cannot hydrogen-bond with themselves, though they can accept hydrogen bonds from water.`,
    },
    {
      title: 'Using 22.4 L for everything',
      md: md`22.4 L per mole holds only for a gas at 0 °C and 1 atm. It does not apply to liquids such as water, or to gases at room temperature (about 24 L at 20 to 25 °C). Use $pV = nRT$ when conditions differ.`,
    },
  ],
  check: [
    {
      id: 'check-highest-bp',
      title: 'Highest boiling point',
      topic: 'Intermolecular forces',
      stemMd: md`These substances have similar molar masses, between 44 and 51 g/mol. Which has the highest boiling point?`,
      options: [
        { id: 'A', text: md`Propane, $\mathrm{CH_3CH_2CH_3}$`, note: md`Propane is non-polar, with dispersion forces only: the lowest boiling point here.` },
        { id: 'B', text: md`Dimethyl ether, $\mathrm{CH_3OCH_3}$`, note: md`It has the same formula as ethanol, but every hydrogen is bonded to carbon, so its molecules cannot hydrogen-bond to each other.` },
        { id: 'C', text: md`Chloromethane, $\mathrm{CH_3Cl}$`, note: md`It has the largest molar mass and is polar, but dipole–dipole forces are weaker than hydrogen bonds.` },
        { id: 'D', text: md`Ethanal, $\mathrm{CH_3CHO}$`, note: md`Ethanal is polar, but its hydrogens are all bonded to carbon, so it has no hydrogen bonding between its molecules.` },
        { id: 'E', text: md`Ethanol, $\mathrm{CH_3CH_2OH}$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`With molar masses this close, dispersion forces are similar, and the type of force decides. Only ethanol has an O–H group, so only ethanol forms hydrogen bonds between its molecules, and it boils at about 78 °C while all the others boil below about 21 °C.`,
      lesson: 'Among molecules of similar size, hydrogen bonding beats polarity, and polarity beats dispersion alone.',
    },
    {
      id: 'check-rigid-container',
      title: 'Heating a sealed container',
      topic: 'Gas laws',
      stemMd: md`A gas in a sealed, rigid container is at 27 °C and 150 kPa. It is heated to 127 °C. What is its new pressure?`,
      options: [
        { id: 'A', text: md`About 706 kPa`, note: md`This scales by $\frac{127}{27}$, using Celsius temperatures instead of kelvin.` },
        { id: 'B', text: md`250 kPa`, note: md`This adds 100 kPa for the 100-degree rise; pressure scales with absolute temperature, it does not rise by the same number.` },
        { id: 'C', text: md`200 kPa`, note: '' },
        { id: 'D', text: md`150 kPa`, note: md`A rigid container keeps the volume constant, not the pressure; heating the gas raises its pressure.` },
        { id: 'E', text: md`112.5 kPa`, note: md`This inverts the ratio, multiplying by $\frac{300}{400}$, as if heating lowered the pressure.` },
      ],
      answer: 'C',
      workingMd: md`At constant volume and amount, $\frac{p_1}{T_1} = \frac{p_2}{T_2}$. In kelvin, $T_1 = 300\ \mathrm{K}$ and $T_2 = 400\ \mathrm{K}$, so $p_2 = 150 \times \frac{400}{300} = 150 \times \frac{4}{3} = 200\ \mathrm{kPa}$.`,
      lesson: 'Convert to kelvin first; then pressure at constant volume is proportional to temperature.',
    },
    {
      id: 'check-hydrogen-bonding',
      title: 'Where are there hydrogen bonds?',
      topic: 'Intermolecular forces',
      stemMd: md`In which pure substance do hydrogen bonds form between the molecules?`,
      options: [
        { id: 'A', text: md`$\mathrm{H_2S}$`, note: md`Sulfur is not electronegative or small enough; hydrogen sulfide has dipole–dipole and dispersion forces only.` },
        { id: 'B', text: md`$\mathrm{NH_3}$`, note: '' },
        { id: 'C', text: md`$\mathrm{CH_3F}$`, note: md`Fluorine is present, but the hydrogens are bonded to carbon, not to fluorine.` },
        { id: 'D', text: md`$\mathrm{HCl}$`, note: md`Hydrogen is bonded to chlorine, which is not one of N, O or F; the attraction is dipole–dipole.` },
        { id: 'E', text: md`$\mathrm{HCHO}$`, note: md`Methanal has a lone pair on oxygen but no hydrogen bonded to oxygen, so its molecules cannot hydrogen-bond to each other.` },
      ],
      answer: 'B',
      workingMd: md`A hydrogen bond between identical molecules needs H bonded directly to N, O or F, and a lone pair on N, O or F. In ammonia, hydrogen is bonded to nitrogen and nitrogen has a lone pair, so both conditions hold. In each other substance, no hydrogen is bonded to N, O or F.`,
      lesson: 'For hydrogen bonding, look for H attached directly to N, O or F, not just for those atoms somewhere in the molecule.',
    },
  ],
  takeaways: [
    'Melting and boiling a molecular substance overcome intermolecular forces, not covalent bonds.',
    'Dispersion forces act in every substance and grow with the number of electrons; hydrogen bonds need H bonded to N, O or F.',
    'Temperature stays constant during a change of state; a liquid boils when its vapour pressure equals the external pressure.',
    md`Gas laws use kelvin: $\frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2}$ and $pV = nRT$; one mole of gas occupies about 22.4 L at 0 °C and 1 atm.`,
  ],
  flashcards: [
    { front: 'Conditions for a hydrogen bond', back: 'A hydrogen atom bonded directly to N, O or F, attracted to a lone pair on an N, O or F atom of another molecule (or another part of the same one).' },
    { front: 'London dispersion forces', back: 'Attractions between temporary dipoles. They act between all molecules and grow with the number of electrons and the contact surface.' },
    { front: 'Why does ice float?', back: 'Hydrogen bonds hold the molecules of ice in an open lattice, which is less dense than liquid water.' },
    { front: 'When does a liquid boil?', back: 'When its vapour pressure equals the external pressure. Lower outside pressure, as at altitude, lowers the boiling point.' },
    { front: 'The ideal gas equation', back: md`$pV = nRT$, with $T$ in kelvin and $R = 8.314\ \mathrm{J\,mol^{-1}\,K^{-1}}$ (pascals, cubic metres) or about $0.082\ \mathrm{L\,atm\,mol^{-1}\,K^{-1}}$.` },
    { front: 'Molar volume at 0 °C and 1 atm', back: 'About 22.4 L for one mole of any ideal gas.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-bonding' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const inorganicNomenclatureLesson: Lesson = {
  slug: 'inorganic-nomenclature',
  title: 'Inorganic nomenclature',
  summary: 'Name and write formulas for oxides, hydroxides, acids and salts, in IUPAC and traditional styles, starting from oxidation numbers.',
  minutes: 24,
  objectives: [
    'Assign oxidation numbers and use them to name binary compounds with Stock numbers and with prefixes.',
    'Name oxides, hydroxides, binary acids and oxyacids, and link an acidic oxide to its acid.',
    'Name salts from their acids (-ide, -ite, -ate, including hydrogen salts) and write a correct formula from a name.',
  ],
  teachMd: md`
### Start from oxidation numbers

Every naming rule rests on oxidation numbers, so fix them first:

- An element on its own is 0 ($\mathrm{O_2}$, $\mathrm{Fe}$).
- A monatomic ion has its charge: $\mathrm{Na^{+}}$ is $+1$, $\mathrm{S^{2-}}$ is $-2$.
- Group 1 metals are $+1$ and group 2 metals $+2$ in compounds; fluorine is always $-1$.
- Oxygen is usually $-2$ (but $-1$ in peroxides such as $\mathrm{H_2O_2}$).
- Hydrogen is $+1$ with non-metals (but $-1$ in metal hydrides such as $\mathrm{NaH}$).
- The oxidation numbers in a neutral compound add up to 0; in an ion, to its charge.

For example, in $\mathrm{H_2SO_4}$: $2(+1) + x + 4(-2) = 0$, so sulfur is $+6$.

### Two naming systems

**IUPAC** names use either prefixes for the number of atoms (mono-, di-, tri-, tetra-, penta-, hexa-, hepta-) or a **Stock number**, a Roman numeral for the oxidation number of a metal. **Traditional** names use suffixes: -ous for the lower and -ic for the higher oxidation number, often on the Latin root (ferrous and ferric for iron, cuprous and cupric for copper). You need to read both.

| Formula | IUPAC | Traditional |
| --- | --- | --- |
| $\mathrm{FeCl_2}$ | iron(II) chloride | ferrous chloride |
| $\mathrm{FeCl_3}$ | iron(III) chloride | ferric chloride |
| $\mathrm{Cu_2O}$ | copper(I) oxide | cuprous oxide |
| $\mathrm{CO_2}$ | carbon dioxide | carbonic anhydride |

### Binary compounds

In an ionic binary compound the metal comes first and the non-metal takes the ending **-ide**: sodium chloride, magnesium oxide, aluminium sulfide, calcium hydride. Metals with one common charge (groups 1 and 2, aluminium, zinc) need no numeral. Ionic compounds do not need prefixes, because the charges already fix the formula: $\mathrm{CaCl_2}$ is usually just calcium chloride (the fully systematic "calcium dichloride" is also correct).

Two non-metals are named with prefixes: $\mathrm{CO}$ carbon monoxide, $\mathrm{SO_3}$ sulfur trioxide, $\mathrm{N_2O_5}$ dinitrogen pentoxide, $\mathrm{Cl_2O_7}$ dichlorine heptoxide. "Mono-" is dropped on the first element.

### Oxides and hydroxides

Metal oxides are **basic**: with water they give hydroxides. Non-metal oxides are **acidic**: with water they give oxyacids, which is why older names call them anhydrides ("acid without water").

$$\mathrm{CaO} + \mathrm{H_2O} \rightarrow \mathrm{Ca(OH)_2} \qquad \mathrm{SO_3} + \mathrm{H_2O} \rightarrow \mathrm{H_2SO_4}$$

The central atom keeps its oxidation number when the oxide becomes an acid: sulfur is $+6$ in both $\mathrm{SO_3}$ and $\mathrm{H_2SO_4}$, and $+4$ in both $\mathrm{SO_2}$ and $\mathrm{H_2SO_3}$. That link lets you go from an oxide to its acid without memorising pairs.

**Hydroxides** contain the hydroxide ion $\mathrm{OH^{-}}$: sodium hydroxide $\mathrm{NaOH}$, calcium hydroxide $\mathrm{Ca(OH)_2}$, aluminium hydroxide $\mathrm{Al(OH)_3}$, iron(III) hydroxide $\mathrm{Fe(OH)_3}$ (ferric hydroxide).

### Acids

**Binary acids** (hydracids) contain hydrogen and a non-metal, and in water are named hydro-...-ic acid: $\mathrm{HF}$ hydrofluoric, $\mathrm{HCl}$ hydrochloric, $\mathrm{HBr}$ hydrobromic, $\mathrm{H_2S}$ hydrosulfuric acid.

**Oxyacids** also contain oxygen. The higher oxidation number of the central atom takes -ic, the lower -ous; when an element forms four, per-...-ic is the highest and hypo-...-ous the lowest:

| Acid | Name | Oxidation number |
| --- | --- | --- |
| $\mathrm{HClO}$ | hypochlorous acid | Cl $+1$ |
| $\mathrm{HClO_2}$ | chlorous acid | Cl $+3$ |
| $\mathrm{HClO_3}$ | chloric acid | Cl $+5$ |
| $\mathrm{HClO_4}$ | perchloric acid | Cl $+7$ |
| $\mathrm{HNO_2}$ / $\mathrm{HNO_3}$ | nitrous / nitric acid | N $+3$ / $+5$ |
| $\mathrm{H_2SO_3}$ / $\mathrm{H_2SO_4}$ | sulfurous / sulfuric acid | S $+4$ / $+6$ |
| $\mathrm{H_2CO_3}$ | carbonic acid | C $+4$ |
| $\mathrm{H_3PO_4}$ | phosphoric acid | P $+5$ |

### Salts

A salt is what you get when the hydrogen of an acid is replaced by a metal (or by ammonium, $\mathrm{NH_4^{+}}$). The anion's name comes from the acid:

- -ic acid gives an **-ate** salt: sulfuric acid, sodium sulfate $\mathrm{Na_2SO_4}$.
- -ous acid gives an **-ite** salt: sulfurous acid, sodium sulfite $\mathrm{Na_2SO_3}$.
- hydro-...-ic acid gives an **-ide** salt: hydrochloric acid, sodium chloride.
- The prefixes per- and hypo- stay: perchlorate $\mathrm{ClO_4^{-}}$, hypochlorite $\mathrm{ClO^{-}}$.

If only some of the hydrogens are replaced, the salt keeps them and says so: $\mathrm{NaHCO_3}$ is sodium hydrogencarbonate (traditionally sodium bicarbonate), $\mathrm{NaH_2PO_4}$ is sodium dihydrogenphosphate.

### From name to formula

Write each ion with its charge, then take the smallest numbers that make the total zero, with brackets around a polyatomic ion that appears more than once. Aluminium sulfate: $\mathrm{Al^{3+}}$ and $\mathrm{SO_4^{2-}}$; three sulfates ($-6$) balance two aluminiums ($+6$), giving $\mathrm{Al_2(SO_4)_3}$. Ammonium phosphate: three $\mathrm{NH_4^{+}}$ balance one $\mathrm{PO_4^{3-}}$, giving $\mathrm{(NH_4)_3PO_4}$.

The ions worth knowing by heart: hydroxide $\mathrm{OH^{-}}$, nitrate $\mathrm{NO_3^{-}}$, nitrite $\mathrm{NO_2^{-}}$, sulfate $\mathrm{SO_4^{2-}}$, sulfite $\mathrm{SO_3^{2-}}$, carbonate $\mathrm{CO_3^{2-}}$, phosphate $\mathrm{PO_4^{3-}}$, ammonium $\mathrm{NH_4^{+}}$, and the four chlorine oxyanions above.
`,
  examples: [
    {
      id: 'example-iron-sulfate',
      title: 'From a name to a formula',
      problemMd: md`Write the formula of iron(III) sulfate and give its traditional name.`,
      steps: [
        md`Iron(III) is $\mathrm{Fe^{3+}}$; sulfate is $\mathrm{SO_4^{2-}}$.`,
        md`The smallest common multiple of 3 and 2 is 6: two $\mathrm{Fe^{3+}}$ give $+6$, three $\mathrm{SO_4^{2-}}$ give $-6$.`,
        md`Put sulfate in brackets because there is more than one: $\mathrm{Fe_2(SO_4)_3}$.`,
        md`Iron's higher common oxidation number is $+3$, so the traditional name uses -ic: ferric sulfate.`,
      ],
      answerMd: md`$\mathrm{Fe_2(SO_4)_3}$, ferric sulfate. Writing $\mathrm{Fe_3SO_4}$ reads the III as a number of iron atoms; the numeral is the charge.`,
    },
    {
      id: 'example-chlorite',
      title: 'Naming an oxyacid and its salt',
      problemMd: md`Name $\mathrm{HClO_2}$ and its sodium salt $\mathrm{NaClO_2}$.`,
      steps: [
        md`Find chlorine's oxidation number: $+1 + x + 2(-2) = 0$, so $x = +3$.`,
        md`Chlorine's oxyacids run $+1$, $+3$, $+5$, $+7$: hypo-...-ous, -ous, -ic, per-...-ic. So $+3$ is chlorous acid.`,
        md`An -ous acid gives an -ite salt: $\mathrm{NaClO_2}$ is sodium chlorite.`,
      ],
      answerMd: md`Chlorous acid and sodium chlorite. "Sodium chlorate" is the tempting slip: chlorate is $\mathrm{ClO_3^{-}}$, with chlorine at $+5$.`,
    },
    {
      id: 'example-oxide-to-acid',
      title: 'From an acidic oxide to an acid and a salt',
      problemMd: md`Name $\mathrm{N_2O_5}$, give the acid it forms with water, and name that acid's potassium salt.`,
      steps: [
        md`Two non-metals: use prefixes. $\mathrm{N_2O_5}$ is dinitrogen pentoxide.`,
        md`Nitrogen's oxidation number: $2x + 5(-2) = 0$, so $x = +5$.`,
        md`With water: $\mathrm{N_2O_5} + \mathrm{H_2O} \rightarrow 2\,\mathrm{HNO_3}$. Nitrogen stays $+5$, the higher of its two oxyacid states, so the acid is nitric acid.`,
        md`An -ic acid gives an -ate salt: $\mathrm{KNO_3}$ is potassium nitrate.`,
      ],
      answerMd: md`Dinitrogen pentoxide gives nitric acid, $\mathrm{HNO_3}$, whose potassium salt is potassium nitrate. Nitrous acid would need nitrogen at $+3$, from $\mathrm{N_2O_3}$.`,
    },
  ],
  traps: [
    {
      title: 'Reading the Roman numeral as a subscript',
      md: md`The numeral is the metal's oxidation number, not how many atoms there are. Copper(I) oxide is $\mathrm{Cu_2O}$ and iron(III) oxide is $\mathrm{Fe_2O_3}$. Balance the charges to get the subscripts.`,
    },
    {
      title: 'Swapping -ite and -ate',
      md: md`-ate goes with -ic acids and the higher oxidation number; -ite with -ous acids and the lower. Sulfate has one more oxygen than sulfite, and nitrate one more than nitrite. If unsure, compute the oxidation number.`,
    },
    {
      title: 'Assuming -ic always means +3',
      md: md`The -ous and -ic suffixes mean "lower" and "higher", not fixed numbers. Ferric is iron(III), but cupric is copper(II) and cuprous is copper(I). Translate a traditional name into a Stock number for that metal before writing the formula.`,
    },
    {
      title: 'Treating a hydrogen salt as an acid',
      md: md`$\mathrm{NaHCO_3}$ is a salt, sodium hydrogencarbonate, not "sodium carbonic acid". The "hydrogen" in the name counts the hydrogens left in the anion.`,
    },
  ],
  check: [
    {
      id: 'check-kclo3',
      title: 'Naming a chlorine oxyanion salt',
      topic: 'Inorganic nomenclature',
      stemMd: md`What is the name of $\mathrm{KClO_3}$?`,
      options: [
        { id: 'A', text: md`Potassium perchlorate`, note: md`Perchlorate is $\mathrm{ClO_4^{-}}$, with chlorine at $+7$; here there are only three oxygens.` },
        { id: 'B', text: md`Potassium chlorite`, note: md`Chlorite is $\mathrm{ClO_2^{-}}$, with chlorine at $+3$; this swaps -ite and -ate.` },
        { id: 'C', text: md`Potassium hypochlorite`, note: md`Hypochlorite is $\mathrm{ClO^{-}}$, with chlorine at $+1$.` },
        { id: 'D', text: md`Potassium chlorate`, note: '' },
        { id: 'E', text: md`Potassium chloride`, note: md`Chloride is $\mathrm{Cl^{-}}$ with no oxygen; that name is for $\mathrm{KCl}$.` },
      ],
      answer: 'D',
      workingMd: md`Chlorine's oxidation number: $+1 + x + 3(-2) = 0$, so $x = +5$. That is chloric acid, $\mathrm{HClO_3}$, and an -ic acid gives an -ate salt: potassium chlorate.`,
      lesson: 'Compute the central atom\'s oxidation number, find the acid, then turn -ic into -ate and -ous into -ite.',
    },
    {
      id: 'check-calcium-phosphate',
      title: 'Writing a formula',
      topic: 'Inorganic nomenclature',
      stemMd: md`What is the formula of calcium phosphate?`,
      options: [
        { id: 'A', text: md`$\mathrm{Ca_3(PO_4)_2}$`, note: '' },
        { id: 'B', text: md`$\mathrm{Ca_2(PO_4)_3}$`, note: md`This swaps the subscripts: two $\mathrm{Ca^{2+}}$ give $+4$ and three phosphates $-9$, so it is not neutral.` },
        { id: 'C', text: md`$\mathrm{CaPO_4}$`, note: md`One calcium ($+2$) cannot balance one phosphate ($-3$).` },
        { id: 'D', text: md`$\mathrm{CaHPO_4}$`, note: md`This is calcium hydrogenphosphate, a salt that still contains one acidic hydrogen; the name asked for has none.` },
        { id: 'E', text: md`$\mathrm{Ca(PO_4)_2}$`, note: md`The charges total $+2$ and $-6$; the formula is not neutral.` },
      ],
      answer: 'A',
      workingMd: md`Calcium is $\mathrm{Ca^{2+}}$ and phosphate $\mathrm{PO_4^{3-}}$. The smallest common multiple of 2 and 3 is 6: three calcium ions give $+6$, two phosphates give $-6$. The formula is $\mathrm{Ca_3(PO_4)_2}$.`,
      lesson: 'Balance the ion charges to zero with the smallest whole numbers, and bracket a repeated polyatomic ion.',
    },
    {
      id: 'check-oxide-acid-pair',
      title: 'Matching an oxide to its acid',
      topic: 'Inorganic nomenclature',
      stemMd: md`Which pairing of an acidic oxide with the acid it forms with water is correct?`,
      options: [
        { id: 'A', text: md`$\mathrm{SO_2}$ gives sulfuric acid, $\mathrm{H_2SO_4}$`, note: md`Sulfur is $+4$ in $\mathrm{SO_2}$ and stays $+4$: the acid is sulfurous acid, $\mathrm{H_2SO_3}$.` },
        { id: 'B', text: md`$\mathrm{N_2O_5}$ gives nitric acid, $\mathrm{HNO_3}$`, note: '' },
        { id: 'C', text: md`$\mathrm{CO_2}$ gives carbonic acid, $\mathrm{H_2CO_4}$`, note: md`$\mathrm{CO_2} + \mathrm{H_2O}$ gives $\mathrm{H_2CO_3}$; the formula shown has one oxygen too many.` },
        { id: 'D', text: md`$\mathrm{Cl_2O_7}$ gives chloric acid, $\mathrm{HClO_3}$`, note: md`Chlorine is $+7$ in $\mathrm{Cl_2O_7}$, so the acid is perchloric acid, $\mathrm{HClO_4}$.` },
        { id: 'E', text: md`$\mathrm{N_2O_3}$ gives nitric acid, $\mathrm{HNO_3}$`, note: md`Nitrogen is $+3$ in $\mathrm{N_2O_3}$, so the acid is nitrous acid, $\mathrm{HNO_2}$.` },
      ],
      answer: 'B',
      workingMd: md`Nitrogen is $+5$ in $\mathrm{N_2O_5}$ ($2x = 10$), and $\mathrm{N_2O_5} + \mathrm{H_2O} \rightarrow 2\,\mathrm{HNO_3}$ keeps it at $+5$: nitric acid. In every other pairing the oxidation number of the central atom changes between oxide and acid, or the formula is wrong.`,
      lesson: 'An acidic oxide and its acid have the central atom at the same oxidation number.',
    },
  ],
  takeaways: [
    'Assign oxidation numbers first; every name follows from them.',
    'Stock numerals give the metal\'s oxidation number; prefixes count atoms and are needed for compounds of two non-metals.',
    'Metal oxides are basic and give hydroxides; non-metal oxides are acidic and give oxyacids with the same oxidation number.',
    'Acid to salt: -ic becomes -ate, -ous becomes -ite, hydro-...-ic becomes -ide; per- and hypo- stay.',
  ],
  flashcards: [
    { front: 'Oxidation number of oxygen and hydrogen', back: 'Oxygen is usually −2 (−1 in peroxides). Hydrogen is +1 with non-metals and −1 in metal hydrides.' },
    { front: 'What does iron(III) mean?', back: md`Iron with oxidation number $+3$, $\mathrm{Fe^{3+}}$; traditionally "ferric". Iron(II) is "ferrous".` },
    { front: 'Chlorine oxyacids in order', back: md`$\mathrm{HClO}$ hypochlorous (+1), $\mathrm{HClO_2}$ chlorous (+3), $\mathrm{HClO_3}$ chloric (+5), $\mathrm{HClO_4}$ perchloric (+7).` },
    { front: 'Acid ending to salt ending', back: '-ic acid → -ate salt; -ous acid → -ite salt; hydro-...-ic acid → -ide salt.' },
    { front: 'Basic and acidic oxides', back: md`Metal oxides are basic and form hydroxides with water ($\mathrm{CaO} \rightarrow \mathrm{Ca(OH)_2}$). Non-metal oxides are acidic and form oxyacids ($\mathrm{SO_3} \rightarrow \mathrm{H_2SO_4}$).` },
    { front: md`$\mathrm{NaHCO_3}$`, back: 'Sodium hydrogencarbonate, traditionally sodium bicarbonate: a salt in which one of carbonic acid\'s two hydrogens remains.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-bonding' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const molesAndStoichiometryLesson: Lesson = {
  slug: 'moles-and-stoichiometry',
  title: 'Moles and stoichiometry',
  summary: 'Convert between mass, moles and particles, use balanced equations to find reacting amounts and limiting reagents, and work out empirical formulas.',
  minutes: 22,
  objectives: [
    'Convert between mass, amount in moles, number of particles and gas volume.',
    'Use the mole ratio of a balanced equation to find reacting masses, the limiting reagent and the percentage yield.',
    'Find an empirical formula from percentage composition, and a molecular formula from the molar mass.',
  ],
  teachMd: md`
### The mole

Atoms are far too small to count one by one, so chemists count them in **moles**. One mole is $6.022 \times 10^{23}$ particles, the **Avogadro constant** $N_A$. The number is chosen so that one mole of a substance has a mass in grams equal to its relative formula mass: one mole of carbon atoms is about 12 g, one mole of water ($2 \times 1 + 16 = 18$) is 18 g.

That mass per mole is the **molar mass** $M$, in g/mol. Three relations connect everything:

$$n = \frac{m}{M} \qquad N = n \times N_A \qquad V = n \times V_m \ \text{(gases)}$$

where $n$ is the amount in moles, $m$ the mass, $N$ the number of particles and $V_m$ the molar volume of a gas (about 22.4 L/mol at 0 °C and 1 atm; see the lesson on gases).

Molar masses are sums. With $\mathrm{H} = 1$, $\mathrm{C} = 12$, $\mathrm{N} = 14$, $\mathrm{O} = 16$, $\mathrm{S} = 32$: $\mathrm{CO_2}$ is $12 + 32 = 44$ g/mol and $\mathrm{H_2SO_4}$ is $2 + 32 + 64 = 98$ g/mol. Watch elements that exist as molecules: oxygen gas is $\mathrm{O_2}$, 32 g/mol, not 16.

A mole of molecules contains more than a mole of atoms. One mole of $\mathrm{H_2SO_4}$ contains 2 mol of H atoms, 1 mol of S and 4 mol of O. Read carefully whether a question asks about molecules, atoms or ions.

### Balanced equations speak in moles

A balanced equation conserves every kind of atom, and so conserves mass. Its coefficients give the **mole ratio** in which substances react and form:

$$\mathrm{CH_4} + 2\,\mathrm{O_2} \rightarrow \mathrm{CO_2} + 2\,\mathrm{H_2O}$$

reads "1 mol of methane reacts with 2 mol of oxygen to give 1 mol of carbon dioxide and 2 mol of water". It does **not** say that 1 g of methane reacts with 2 g of oxygen. Coefficients are about amounts, never masses.

To balance an equation, change coefficients, never subscripts (a subscript changes the substance). Balance elements that appear in one compound on each side first, and leave elements that appear on their own, such as $\mathrm{O_2}$, until last.

### The route for any reacting-amount problem

1. Balance the equation.
2. Convert what you are given into **moles**.
3. Use the **mole ratio** to get moles of what you want.
4. Convert back to mass, particles or volume.

Mass to mass never goes direct; it always passes through moles.

### Limiting reagent

When two reactants are given, one usually runs out first. That **limiting reagent** decides how much product forms; the other is in **excess**, and some of it is left over. To find it, divide the moles of each reactant by its coefficient: the smaller result is the limiting one. Comparing masses, or even raw moles, without the coefficients is the classic error.

### Percentage yield

The mass calculated from the limiting reagent is the **theoretical yield**. Real reactions give less (incomplete reaction, side reactions, losses), so

$$\text{percentage yield} = \frac{\text{actual yield}}{\text{theoretical yield}} \times 100\%$$

### Percentage composition and formulas

The mass percentage of an element in a compound is its total mass in one mole divided by the molar mass. Nitrogen in ammonium nitrate, $\mathrm{NH_4NO_3}$ ($M = 80$): $\frac{2 \times 14}{80} = \frac{28}{80} = 35\%$.

Going the other way gives the **empirical formula**, the simplest whole-number ratio of atoms:

1. Assume 100 g, so each percentage becomes a mass in grams.
2. Divide each mass by the element's molar mass to get moles.
3. Divide by the smallest number of moles to get a ratio; round to whole numbers (if a ratio ends in .5, double everything).

The **molecular formula** is a whole-number multiple of the empirical formula. Divide the molar mass by the empirical formula mass to find the multiple. Glucose, $\mathrm{C_6H_{12}O_6}$, and methanal, $\mathrm{CH_2O}$, share the empirical formula $\mathrm{CH_2O}$.

### Doing it by hand

Nothing in the IMAT rules allows a calculator, so practise by hand with friendly numbers: quantities that are simple fractions or multiples of a mole. Keep amounts as fractions ($\frac{1}{2}$ mol, $\frac{3}{2}$ mol) and simplify before multiplying. If an answer needs long division, check whether you have converted to moles at the right point.
`,
  examples: [
    {
      id: 'example-methane-co2',
      title: 'Mass of product from mass of reactant',
      problemMd: md`What mass of carbon dioxide forms when 8 g of methane burns completely? ($\mathrm{CH_4} + 2\,\mathrm{O_2} \rightarrow \mathrm{CO_2} + 2\,\mathrm{H_2O}$)`,
      steps: [
        md`Moles of methane: $M = 12 + 4 = 16$ g/mol, so $n = \frac{8}{16} = 0.5$ mol.`,
        md`Mole ratio $\mathrm{CH_4} : \mathrm{CO_2} = 1 : 1$, so 0.5 mol of $\mathrm{CO_2}$ forms.`,
        md`Mass: $M(\mathrm{CO_2}) = 44$ g/mol, so $0.5 \times 44 = 22$ g.`,
        md`Check by proportion: 16 g of methane gives 44 g of $\mathrm{CO_2}$, and 8 g is half of that, so 22 g.`,
      ],
      answerMd: md`22 g of carbon dioxide. Answering 8 g (assuming mass is conserved between one reactant and one product) skips the conversion through moles.`,
    },
    {
      id: 'example-limiting-hydrogen',
      title: 'Finding the limiting reagent',
      problemMd: md`6 g of hydrogen and 32 g of oxygen react: $2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$. What mass of water forms, and what is left over?`,
      steps: [
        md`Moles: $\mathrm{H_2}$: $\frac{6}{2} = 3$ mol; $\mathrm{O_2}$: $\frac{32}{32} = 1$ mol.`,
        md`Divide by coefficients: $\mathrm{H_2}$: $\frac{3}{2} = 1.5$; $\mathrm{O_2}$: $\frac{1}{1} = 1$. Oxygen gives the smaller number, so it is limiting.`,
        md`1 mol of $\mathrm{O_2}$ uses 2 mol of $\mathrm{H_2}$ and forms 2 mol of water: $2 \times 18 = 36$ g.`,
        md`Hydrogen left: $3 - 2 = 1$ mol, which is 2 g. Mass check: $6 + 32 = 38$ g before, $36 + 2 = 38$ g after.`,
      ],
      answerMd: md`36 g of water form and 2 g of hydrogen are left over. Choosing oxygen as the excess reagent because its mass (32 g) is larger is the tempting mistake.`,
    },
    {
      id: 'example-empirical-glucose',
      title: 'From percentages to a molecular formula',
      problemMd: md`A compound contains 40.0% carbon, 6.7% hydrogen and 53.3% oxygen by mass, and its molar mass is 180 g/mol. Find its empirical and molecular formulas.`,
      steps: [
        md`In 100 g: 40.0 g C, 6.7 g H, 53.3 g O.`,
        md`Moles: C $\frac{40.0}{12} \approx 3.33$; H $\frac{6.7}{1} = 6.7$; O $\frac{53.3}{16} \approx 3.33$.`,
        md`Divide by the smallest (3.33): C 1, H about 2, O 1. Empirical formula $\mathrm{CH_2O}$, mass $12 + 2 + 16 = 30$ g/mol.`,
        md`Multiple: $\frac{180}{30} = 6$, so the molecular formula is $\mathrm{C_6H_{12}O_6}$. Check: $6 \times 12 + 12 \times 1 + 6 \times 16 = 72 + 12 + 96 = 180$.`,
      ],
      answerMd: md`Empirical formula $\mathrm{CH_2O}$, molecular formula $\mathrm{C_6H_{12}O_6}$. Using the mass ratio 40 : 6.7 : 53.3 directly, without dividing by molar masses, gives a meaningless formula.`,
    },
  ],
  traps: [
    {
      title: 'Reading coefficients as masses',
      md: md`In $2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$, 2 g of hydrogen does not react with 1 g of oxygen. The ratio 2 : 1 is in moles; in grams it is 4 : 32. Convert to moles before you use any coefficient.`,
    },
    {
      title: 'Picking the limiting reagent by mass or raw moles',
      md: md`The reactant with less mass, or fewer moles, is not necessarily limiting. Divide each amount in moles by its coefficient and compare those numbers.`,
    },
    {
      title: 'Atomic and molecular molar masses',
      md: md`Oxygen, nitrogen, hydrogen and the halogens are diatomic as elements: $\mathrm{O_2}$ is 32 g/mol, $\mathrm{N_2}$ 28 g/mol, $\mathrm{Cl_2}$ 71 g/mol. Using the atomic value doubles the number of moles you calculate.`,
    },
    {
      title: 'Molecules or atoms?',
      md: md`Half a mole of $\mathrm{H_2SO_4}$ is 0.5 mol of molecules but 2 mol of oxygen atoms. Before answering, underline what the question counts.`,
    },
  ],
  check: [
    {
      id: 'check-oxygen-atoms',
      title: 'Counting atoms in moles',
      topic: 'The mole',
      stemMd: md`How many moles of oxygen atoms are there in 49 g of sulfuric acid, $\mathrm{H_2SO_4}$? ($\mathrm{H} = 1$, $\mathrm{S} = 32$, $\mathrm{O} = 16$)`,
      options: [
        { id: 'A', text: md`0.125`, note: md`This divides the 0.5 mol of molecules by 4 instead of multiplying; each molecule has four oxygen atoms.` },
        { id: 'B', text: md`0.5`, note: md`This is the amount of sulfuric acid molecules, not of oxygen atoms.` },
        { id: 'C', text: md`2`, note: '' },
        { id: 'D', text: md`4`, note: md`Four is the number of oxygen atoms per molecule, or the moles in a whole mole of acid; here there is only half a mole.` },
        { id: 'E', text: md`32`, note: md`32 is the mass in grams of the oxygen in 49 g of the acid, not its amount in moles.` },
      ],
      answer: 'C',
      workingMd: md`$M(\mathrm{H_2SO_4}) = 2 + 32 + 4 \times 16 = 98$ g/mol, so 49 g is $\frac{49}{98} = 0.5$ mol of molecules. Each molecule has 4 oxygen atoms: $0.5 \times 4 = 2$ mol of oxygen atoms.`,
      lesson: 'Find the moles of the substance first, then multiply by the number of the atoms asked for in each formula unit.',
    },
    {
      id: 'check-ammonia-limiting',
      title: 'How much ammonia?',
      topic: 'Stoichiometry',
      stemMd: md`56 g of nitrogen and 6 g of hydrogen react according to $\mathrm{N_2} + 3\,\mathrm{H_2} \rightarrow 2\,\mathrm{NH_3}$. What is the greatest mass of ammonia that can form? ($\mathrm{H} = 1$, $\mathrm{N} = 14$)`,
      options: [
        { id: 'A', text: md`17 g`, note: md`This finds 1 mol of ammonia from 3 mol of hydrogen, forgetting that the equation gives 2 mol of ammonia per 3 mol of hydrogen.` },
        { id: 'B', text: md`68 g`, note: md`This treats nitrogen as limiting (2 mol of $\mathrm{N_2}$ to 4 mol of ammonia), but 2 mol of $\mathrm{N_2}$ would need 6 mol of hydrogen, and there are only 3.` },
        { id: 'C', text: md`62 g`, note: md`This adds the two masses, as if both reactants were used up; nitrogen is in excess.` },
        { id: 'D', text: md`34 g`, note: '' },
        { id: 'E', text: md`51 g`, note: md`This uses a 1 : 1 ratio between hydrogen and ammonia, giving 3 mol; the equation's ratio is 3 : 2.` },
      ],
      answer: 'D',
      workingMd: md`Moles: $\mathrm{N_2}$ $\frac{56}{28} = 2$; $\mathrm{H_2}$ $\frac{6}{2} = 3$. Divided by the coefficients: $\frac{2}{1} = 2$ and $\frac{3}{3} = 1$, so hydrogen is limiting. 3 mol of $\mathrm{H_2}$ gives $3 \times \frac{2}{3} = 2$ mol of $\mathrm{NH_3}$, and $2 \times 17 = 34$ g.`,
      lesson: 'Divide each reactant\'s moles by its coefficient; the smaller number marks the limiting reagent, and it alone sets the yield.',
    },
    {
      id: 'check-nitrogen-oxide',
      title: 'An empirical formula',
      topic: 'Stoichiometry',
      stemMd: md`An oxide of nitrogen contains 30.4% nitrogen by mass. What is its empirical formula? ($\mathrm{N} = 14$, $\mathrm{O} = 16$)`,
      options: [
        { id: 'A', text: md`$\mathrm{NO_2}$`, note: '' },
        { id: 'B', text: md`$\mathrm{NO}$`, note: md`$\mathrm{NO}$ is $\frac{14}{30}$, about 47% nitrogen: far too much.` },
        { id: 'C', text: md`$\mathrm{N_2O}$`, note: md`$\mathrm{N_2O}$ is $\frac{28}{44}$, about 64% nitrogen; this reverses which element is in excess.` },
        { id: 'D', text: md`$\mathrm{N_2O_3}$`, note: md`$\mathrm{N_2O_3}$ is $\frac{28}{76}$, about 37% nitrogen, too much for 30.4%.` },
        { id: 'E', text: md`$\mathrm{N_2O_5}$`, note: md`$\mathrm{N_2O_5}$ is $\frac{28}{108}$, about 26% nitrogen, too little.` },
      ],
      answer: 'A',
      workingMd: md`In 100 g: 30.4 g N and 69.6 g O. Moles: $\frac{30.4}{14} \approx 2.17$ and $\frac{69.6}{16} = 4.35$. Ratio $\frac{4.35}{2.17} \approx 2$, so N : O = 1 : 2, $\mathrm{NO_2}$. Check: $\frac{14}{46}$ is just over 30%.`,
      lesson: 'For an empirical formula, convert masses to moles before taking any ratio; a quick percentage check on each option confirms the answer.',
    },
  ],
  takeaways: [
    md`$n = \frac{m}{M}$; one mole is $6.022 \times 10^{23}$ particles, and a mole of gas occupies about 22.4 L at 0 °C and 1 atm.`,
    'Coefficients in a balanced equation are mole ratios, never mass ratios: always go through moles.',
    'The limiting reagent has the smallest value of moles divided by coefficient, and it alone sets the amount of product.',
    'Empirical formula: assume 100 g, convert to moles, divide by the smallest; the molecular formula is a whole-number multiple of it.',
  ],
  flashcards: [
    { front: 'The Avogadro constant', back: md`$6.022 \times 10^{23}$ particles per mole.` },
    { front: 'Mass, moles and molar mass', back: md`$n = \frac{m}{M}$: moles equal mass in grams divided by molar mass in g/mol.` },
    { front: 'What do the coefficients of a balanced equation give?', back: 'The mole ratio in which substances react and form, not a mass ratio.' },
    { front: 'How to find the limiting reagent', back: 'Convert each reactant to moles and divide by its coefficient. The smallest result is the limiting reagent.' },
    { front: 'Percentage yield', back: 'Actual yield divided by theoretical yield, times 100%. The theoretical yield is calculated from the limiting reagent.' },
    { front: 'Empirical formula from percentages', back: 'Take 100 g, divide each mass by its molar mass, divide by the smallest number of moles, and round to a whole-number ratio.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-stoichiometry' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};
