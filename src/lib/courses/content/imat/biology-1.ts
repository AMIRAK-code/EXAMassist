import { md, type Lesson } from '../../types';

/**
 * IMAT biology, part 1: molecules, cells, membranes, enzymes, respiration and
 * photosynthesis, cell division, and DNA to protein. The Italian versions are
 * in ./it/biology-1.ts, with the same slugs, check keys and practice links.
 */

export const biologicalMoleculesLesson: Lesson = {
  slug: 'biological-molecules',
  title: 'Biological molecules: from water to nucleic acids',
  summary: 'Water, carbohydrates, lipids, proteins and nucleic acids: how each is built, which bonds hold it together and how to count monomers, bonds and bases.',
  minutes: 22,
  objectives: [
    'Explain how the polarity of water gives it the properties living things depend on.',
    'Name the monomers, the linking bonds and the main examples of carbohydrates, lipids, proteins and nucleic acids.',
    'Count condensation and hydrolysis reactions, peptide bonds and base percentages in double-stranded DNA.',
  ],
  teachMd: md`
### Why the chemistry comes first

Living things are built mostly from six elements: carbon, hydrogen, oxygen, nitrogen, phosphorus and sulfur. Small molecules (sugars, amino acids, nucleotides) are joined into large ones (polysaccharides, proteins, nucleic acids). The joining reaction is a **condensation**: every new bond between two monomers releases one molecule of water. The reverse, **hydrolysis**, breaks a bond and uses one molecule of water. Almost every counting question in this topic rests on that one-bond, one-water rule.

### Water

A water molecule is **polar**: the oxygen atom pulls the shared electrons towards itself, so it carries a partial negative charge and the two hydrogens a partial positive charge. Neighbouring molecules attract each other through **hydrogen bonds**. That explains the properties biology uses:

- it dissolves ions and polar molecules (hydrophilic substances), so it is the medium of cytoplasm, blood and sap; non-polar substances (hydrophobic) do not dissolve and cluster together;
- it has a high specific heat capacity, so body temperature and the temperature of lakes change slowly;
- it has a high heat of vaporisation, so evaporating sweat removes a lot of heat;
- cohesion between molecules gives surface tension and lets columns of water be pulled up the xylem;
- ice is less dense than liquid water, so it floats and insulates the water beneath it.

### Carbohydrates

Simple sugars (monosaccharides) include the pentoses ribose and deoxyribose and the hexoses glucose, fructose and galactose, all $\mathrm{C_6H_{12}O_6}$. Glucose exists as **alpha** and **beta** forms, which differ in the position of the hydroxyl group on carbon 1. Two monosaccharides joined by a **glycosidic bond** make a disaccharide:

| Disaccharide | Made from |
| --- | --- |
| maltose | glucose + glucose |
| sucrose | glucose + fructose |
| lactose | glucose + galactose |

Polysaccharides are long chains of glucose with different linkages and jobs:

| Polysaccharide | Linkages | Role |
| --- | --- | --- |
| amylose (starch) | alpha-1,4, unbranched, coiled | energy store in plants |
| amylopectin (starch) | alpha-1,4 with alpha-1,6 branches | energy store in plants |
| glycogen | alpha-1,4 with more frequent alpha-1,6 branches | energy store in animals (liver, muscle) and fungi |
| cellulose | beta-1,4, straight chains | plant cell walls |

Branching gives many chain ends, so enzymes can release glucose from glycogen quickly. Cellulose chains lie side by side, hydrogen-bonded into strong fibres; humans have no enzyme that hydrolyses the beta-1,4 link. Chitin, a modified polysaccharide containing nitrogen, forms fungal cell walls and the exoskeleton of arthropods.

### Lipids

Lipids are a mixed group defined by being insoluble in water; they are not polymers. A **triglyceride** is one glycerol joined to three fatty acids by **ester bonds**, so forming one releases three molecules of water. Saturated fatty acids have no carbon-carbon double bonds and straight chains that pack tightly (fats solid at room temperature); unsaturated fatty acids have one or more double bonds that kink the chain (oils). Gram for gram, lipids store roughly twice as much energy as carbohydrates.

A **phospholipid** has glycerol, two fatty acids and a phosphate-containing group: a hydrophilic head and two hydrophobic tails. In water, phospholipids form bilayers, the basis of every cell membrane. **Steroids**, such as cholesterol and the sex hormones, are built on four fused carbon rings.

### Proteins

An amino acid has a central carbon bonded to an amino group, a carboxyl group, a hydrogen atom and a side chain (**R group**). Twenty kinds are used in proteins; only the R group differs. A **peptide bond** forms by condensation between the carboxyl group of one amino acid and the amino group of the next, so a chain of $n$ amino acids has $n - 1$ peptide bonds.

- **Primary structure**: the sequence of amino acids.
- **Secondary structure**: alpha helices and beta pleated sheets, held by hydrogen bonds between backbone groups.
- **Tertiary structure**: the folding of the whole chain, held by interactions between R groups (hydrogen bonds, ionic bonds, disulfide bridges between cysteines, hydrophobic interactions).
- **Quaternary structure**: two or more chains together, as in haemoglobin with four.

Heat or extreme pH **denatures** a protein: the bonds of the higher levels break, the shape and the function are lost, but the peptide bonds, and so the primary structure, survive.

### Nucleic acids

A **nucleotide** is a pentose sugar, a phosphate group and a nitrogenous base. **Phosphodiester bonds** link the sugar of one nucleotide to the phosphate of the next, giving a sugar-phosphate backbone.

| | DNA | RNA |
| --- | --- | --- |
| sugar | deoxyribose | ribose |
| bases | A, T, G, C | A, U, G, C |
| strands | usually two, a double helix | usually one |

Adenine and guanine are **purines** (two rings); cytosine, thymine and uracil are **pyrimidines** (one ring). In double-stranded DNA, A pairs with T and G with C, so the amount of A equals that of T and the amount of G equals that of C. ATP, the cell's energy carrier, is itself a nucleotide: adenine, ribose and three phosphates.
`,
  examples: [
    {
      id: 'example-counting-water',
      title: 'Water molecules released in building a protein',
      problemMd: md`A protein consists of two polypeptide chains, one of 141 amino acids and one of 146 amino acids. How many molecules of water were released when the peptide bonds of this protein were formed?`,
      steps: [
        md`Each peptide bond comes from one condensation, which releases one molecule of water. So count peptide bonds.`,
        md`A chain of $n$ amino acids has $n - 1$ peptide bonds: $141 - 1 = 140$ and $146 - 1 = 145$.`,
        md`The two chains are separate polypeptides, so add their bonds: $140 + 145 = 285$.`,
        md`Check by the other route: $141 + 146 = 287$ amino acids in two chains means $287 - 2 = 285$ bonds.`,
      ],
      answerMd: md`285 molecules of water. The tempting wrong answer is 286, from treating the 287 amino acids as one chain; each separate chain has one bond fewer than its amino acids.`,
    },
    {
      id: 'example-chargaff',
      title: 'Base percentages in double-stranded DNA',
      problemMd: md`In a sample of double-stranded DNA, 28% of the bases are thymine. What percentage are guanine?`,
      steps: [
        md`In double-stranded DNA, A pairs with T, so A = T = 28%.`,
        md`A and T together are $28 + 28 = 56$%, which leaves $100 - 56 = 44$% for G and C.`,
        md`G pairs with C, so they are equal: $44 \div 2 = 22$%.`,
      ],
      answerMd: md`22% guanine. Answering 28% (as if every base were equal) or 72% (100 minus thymine) skips the pairing rule. The rule needs double-stranded DNA: for single-stranded RNA or DNA nothing can be deduced.`,
    },
    {
      id: 'example-identify-polysaccharide',
      title: 'Identifying a polysaccharide from its hydrolysis',
      problemMd: md`A polysaccharide extracted from a plant tissue is hydrolysed completely and yields only glucose. Its chains are unbranched and joined by beta-1,4 glycosidic bonds. Human salivary amylase does not digest it. What is it?`,
      steps: [
        md`Only glucose on hydrolysis: starch (amylose, amylopectin), glycogen and cellulose all qualify, so this alone does not decide.`,
        md`Beta-1,4 links rule out starch and glycogen, which are built from alpha-glucose.`,
        md`Unbranched beta-1,4 chains that human enzymes cannot hydrolyse are cellulose.`,
      ],
      answerMd: md`Cellulose. Amylose is the tempting wrong answer, because it is also unbranched and made of glucose, but its links are alpha-1,4 and amylase digests it.`,
    },
  ],
  traps: [
    {
      title: 'Counting one bond too many',
      md: md`A chain of $n$ monomers has $n - 1$ bonds, and building it released $n - 1$ water molecules. A triglyceride is not a chain: glycerol makes three separate ester bonds, so three waters. When a molecule has several separate chains, subtract one per chain.`,
    },
    {
      title: 'Mixing up the disaccharides and the sugars of nucleic acids',
      md: md`Sucrose is glucose + fructose; lactose is glucose + galactose; maltose is two glucoses. DNA contains deoxyribose, RNA ribose, and uracil replaces thymine only in RNA. Learn the two tables; swapped pairs make the most tempting wrong answers.`,
    },
    {
      title: 'Thinking denaturation breaks the chain',
      md: md`Denaturation destroys the secondary, tertiary and quaternary structure, not the peptide bonds. A denatured protein keeps its primary structure; only hydrolysis breaks peptide bonds.`,
    },
    {
      title: 'Applying base pairing to a single strand',
      md: md`A = T and G = C hold for double-stranded DNA. In one strand, or in RNA, the bases can be in any proportion; an option that applies Chargaff's rule there is wrong.`,
    },
  ],
  check: [
    {
      id: 'check-hydrolysis-water',
      title: 'Hydrolysing a polypeptide',
      topic: 'Chemistry of living things',
      stemMd: md`A single polypeptide chain of 120 amino acids is hydrolysed completely into free amino acids. How many molecules of water are used?`,
      options: [
        { id: 'A', text: md`118`, note: md`Subtracts two instead of one; a single chain of $n$ units has $n - 1$ links, so only one is subtracted.` },
        { id: 'B', text: md`119`, note: '' },
        { id: 'C', text: md`120`, note: md`Counts one water per amino acid, but water is used per peptide bond, and there is one bond fewer than amino acids.` },
        { id: 'D', text: md`121`, note: md`Adds a bond instead of subtracting one; a linear chain has fewer bonds than units, not more.` },
        { id: 'E', text: md`240`, note: md`Counts two water molecules per amino acid; each peptide bond takes exactly one water to break.` },
      ],
      answer: 'B',
      workingMd: md`A chain of 120 amino acids has $120 - 1 = 119$ peptide bonds. Hydrolysis uses one molecule of water per bond broken, so 119 molecules of water.`,
      lesson: 'Condensation and hydrolysis go one bond, one water: count the bonds, not the monomers.',
    },
    {
      id: 'check-dna-adenine',
      title: 'From cytosine to adenine',
      topic: 'Chemistry of living things',
      stemMd: md`A sample of double-stranded DNA contains 18% cytosine. What percentage of its bases are adenine?`,
      options: [
        { id: 'A', text: md`18%`, note: md`Assumes adenine equals cytosine; adenine pairs with thymine, so it equals thymine, not cytosine.` },
        { id: 'B', text: md`64%`, note: md`This is A and T together; it has to be split equally between the two.` },
        { id: 'C', text: md`82%`, note: md`This is 100% minus cytosine, which forgets that guanine also makes up 18%.` },
        { id: 'D', text: md`32%`, note: '' },
        { id: 'E', text: md`36%`, note: md`This is G and C together, the share that is not adenine or thymine.` },
      ],
      answer: 'D',
      workingMd: md`C = G = 18%, so G and C together are 36%. That leaves $100 - 36 = 64$% for A and T, and since A = T, adenine is $64 \div 2 = 32$%.`,
      lesson: 'In double-stranded DNA, find the partner first, then split what remains equally between the other pair.',
    },
    {
      id: 'check-polysaccharides',
      title: 'Which statement is correct?',
      topic: 'Chemistry of living things',
      stemMd: md`Which statement about carbohydrates is correct?`,
      options: [
        { id: 'A', text: md`Glycogen has alpha-1,6 branch points, whereas amylose is an unbranched chain.`, note: '' },
        { id: 'B', text: md`Cellulose is a polymer of alpha-glucose joined by alpha-1,4 bonds.`, note: md`Cellulose is made of beta-glucose with beta-1,4 bonds; alpha-1,4 chains are amylose.` },
        { id: 'C', text: md`Sucrose is a polysaccharide made of glucose and fructose units.`, note: md`Sucrose is made of glucose and fructose, but it is a disaccharide: one of each.` },
        { id: 'D', text: md`Starch is the main storage polysaccharide in the human liver.`, note: md`Animals, including humans, store glucose as glycogen; starch is the plant store.` },
        { id: 'E', text: md`Chitin is the main structural polysaccharide of plant cell walls.`, note: md`Plant cell walls are mainly cellulose; chitin is in fungal cell walls and arthropod exoskeletons.` },
      ],
      answer: 'A',
      workingMd: md`Glycogen is a chain of alpha-1,4 linked glucose with frequent alpha-1,6 branches; amylose is alpha-1,4 linked and unbranched. Every other statement swaps a linkage, a size class (disaccharide or polysaccharide) or an organism.`,
      lesson: 'For polysaccharides, learn three things together: the form of glucose, the linkage and where the molecule is found.',
    },
  ],
  takeaways: [
    'Condensation builds polymers and releases one water per bond; hydrolysis breaks them and uses one water per bond.',
    'Water is polar and hydrogen-bonded, which makes it a solvent, a temperature buffer and cohesive.',
    'Starch and glycogen are alpha-glucose stores; cellulose is beta-glucose structure.',
    'Protein shape (secondary to quaternary) is lost on denaturation; the amino acid sequence is not.',
    'In double-stranded DNA, A = T and G = C; DNA has deoxyribose and thymine, RNA ribose and uracil.',
  ],
  flashcards: [
    { front: md`Condensation vs hydrolysis`, back: md`Condensation joins two monomers and releases one water molecule; hydrolysis breaks the bond and uses one water molecule.` },
    { front: md`Sucrose, lactose, maltose`, back: md`Sucrose is glucose + fructose, lactose is glucose + galactose, maltose is glucose + glucose.` },
    { front: md`Starch, glycogen, cellulose: the linkages`, back: md`Amylose alpha-1,4 unbranched; amylopectin and glycogen alpha-1,4 with alpha-1,6 branches (glycogen more branched); cellulose beta-1,4 straight chains.` },
    { front: md`Triglyceride`, back: md`One glycerol joined to three fatty acids by ester bonds; forming it releases three molecules of water.` },
    { front: md`Four levels of protein structure`, back: md`Primary: amino acid sequence. Secondary: helices and sheets (backbone hydrogen bonds). Tertiary: 3D fold (R-group interactions). Quaternary: more than one chain.` },
    { front: md`Purines and pyrimidines`, back: md`Purines (two rings): adenine and guanine. Pyrimidines (one ring): cytosine, thymine and uracil.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-molecules-cells' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const cellStructureAndOrganellesLesson: Lesson = {
  slug: 'cell-structure-and-organelles',
  title: 'Cell structure and organelles',
  summary: 'Prokaryotic and eukaryotic cells, what each organelle does, which have two membranes, and how a secreted protein travels through the cell.',
  minutes: 20,
  objectives: [
    'Tell prokaryotic from eukaryotic cells and plant from animal cells by their structures.',
    'Match each organelle to its function and to the number of membranes around it.',
    'Trace a secreted protein through the endomembrane system.',
  ],
  teachMd: md`
### Two kinds of cell

Every cell has a plasma membrane, cytoplasm, ribosomes and DNA. What separates the two great kinds of cell is where the DNA sits and whether the cytoplasm is divided into membrane-bound compartments.

| Feature | Prokaryotic cell (bacteria, archaea) | Eukaryotic cell (animals, plants, fungi, protists) |
| --- | --- | --- |
| nucleus | none: DNA lies in the cytoplasm (nucleoid) | DNA enclosed in a nucleus |
| DNA | one circular chromosome, often plasmids too | several linear chromosomes with histone proteins |
| membrane-bound organelles | none | mitochondria, ER, Golgi and others |
| ribosomes | 70S | 80S in the cytoplasm, 70S-type in mitochondria and chloroplasts |
| typical size | about 1–10 micrometres | about 10–100 micrometres |
| cell wall | in most bacteria, made of peptidoglycan | in plants (cellulose) and fungi (chitin); none in animals |

The S in 70S and 80S is a measure of how fast the particle sediments in a centrifuge, not a mass, so the subunits do not add up simply.

### The nucleus

The nucleus is surrounded by the **nuclear envelope**, a double membrane crossed by **nuclear pores** that let mRNA and ribosome subunits out and proteins in. Inside, DNA wound round histones forms **chromatin**. The **nucleolus** is not an organelle with a membrane: it is the region where ribosomal RNA is made and ribosome subunits are assembled.

### The endomembrane system

- **Rough endoplasmic reticulum (rough ER)**: flattened sacs studded with ribosomes. Proteins made here enter the ER lumen, where they fold and may have sugars added. They are proteins for secretion, for the membrane or for lysosomes.
- **Smooth ER**: no ribosomes. It makes lipids, including phospholipids and steroid hormones, detoxifies drugs (especially in liver cells) and stores calcium ions (the sarcoplasmic reticulum of muscle).
- **Golgi apparatus**: a stack of flattened sacs that receives vesicles from the ER, modifies proteins (for example by adding or trimming sugars), sorts them and sends them on in new vesicles.
- **Lysosomes**: vesicles of hydrolytic enzymes working at acid pH; they digest material taken in by the cell and worn-out organelles. Typical of animal cells.

Free ribosomes in the cytoplasm make proteins that stay in the cytoplasm or go to the nucleus, mitochondria or peroxisomes.

### Energy organelles

**Mitochondria** carry out the later stages of aerobic respiration. They have two membranes; the inner one is folded into **cristae**, which give space for the electron transport chain, and it encloses the **matrix**. **Chloroplasts**, in plants and algae, have two membranes around a fluid **stroma** containing stacks of **thylakoids**, where light is absorbed. Both contain their own circular DNA and 70S ribosomes and divide by a process like binary fission. These features support the **endosymbiotic theory**: mitochondria and chloroplasts descend from prokaryotes taken in by an ancestral eukaryotic cell.

### Other structures

- **Peroxisomes**: single-membrane vesicles that break down fatty acids and toxic substances; they produce hydrogen peroxide and destroy it with the enzyme catalase.
- **Vacuole**: in plant cells a large central vacuole full of cell sap, bounded by a membrane (the tonoplast), keeps the cell turgid and stores substances.
- **Cytoskeleton**: microfilaments (actin), intermediate filaments and microtubules (tubulin) give shape, move organelles and, as the spindle, separate chromosomes.
- **Centrioles**: pairs of microtubule cylinders in the centrosome of animal cells; most plant cells lack them.
- **Cilia and flagella** of eukaryotes are built from microtubules; bacterial flagella are a different, protein structure.

### Counting membranes

| Membranes | Structures |
| --- | --- |
| two | nucleus (nuclear envelope), mitochondrion, chloroplast |
| one | ER, Golgi, lysosome, peroxisome, vacuole, vesicles, plasma membrane |
| none | ribosome, nucleolus, centriole, cytoskeleton |

### Plant and animal cells side by side

Plant cells have a cellulose cell wall, chloroplasts (in green tissues) and a large central vacuole; they usually lack centrioles and store starch. Animal cells have no wall or chloroplasts, may have small vacuoles, have centrioles and lysosomes, and store glycogen. A root cell is still a plant cell, even though it has no chloroplasts, so the absence of chloroplasts alone does not prove a cell is from an animal.
`,
  examples: [
    {
      id: 'example-secretory-pathway',
      title: 'Following a labelled amino acid',
      problemMd: md`Pancreatic cells that secrete digestive enzymes are given a short pulse of a radioactive amino acid, then unlabelled amino acids. In what order does the radioactivity appear in the cell's structures?`,
      steps: [
        md`The amino acid is built into proteins at ribosomes. Enzymes for secretion are made by ribosomes on the rough ER, and the new chains enter the ER lumen.`,
        md`From the rough ER the proteins travel in vesicles to the Golgi apparatus, which modifies and sorts them.`,
        md`The Golgi packs them into secretory vesicles, which move to the plasma membrane.`,
        md`The vesicles fuse with the membrane and release the enzymes outside the cell by exocytosis.`,
      ],
      answerMd: md`Rough ER, then Golgi apparatus, then secretory vesicles, then outside the cell. Putting the Golgi first, or sending the protein through the smooth ER or a lysosome, is the usual wrong order.`,
    },
    {
      id: 'example-identify-cell',
      title: 'Identifying a cell from its features',
      problemMd: md`A cell has a nucleus, mitochondria and a cell wall containing chitin. It has no chloroplasts. To which group does it most likely belong?`,
      steps: [
        md`A nucleus and mitochondria make it eukaryotic, so it is not a bacterium.`,
        md`A cell wall rules out an animal cell.`,
        md`The wall is chitin, not cellulose: chitin walls are typical of fungi. The missing chloroplasts fit a fungus too, since fungi do not photosynthesise.`,
      ],
      answerMd: md`A fungus. "Plant root cell" is tempting, because root cells also lack chloroplasts, but plant walls are made of cellulose.`,
    },
    {
      id: 'example-antibiotic-ribosomes',
      title: 'An antibiotic that targets 70S ribosomes',
      problemMd: md`A drug blocks protein synthesis on 70S ribosomes but not on 80S ribosomes. Predict its effect on a bacterium and on a human cell.`,
      steps: [
        md`Bacteria have 70S ribosomes, so the drug stops their protein synthesis.`,
        md`The cytoplasmic ribosomes of a human cell are 80S, so most human protein synthesis continues.`,
        md`Human mitochondria, however, contain their own 70S-type ribosomes, which make a few proteins of the mitochondrion. At high doses the drug may affect them.`,
      ],
      answerMd: md`It stops bacterial protein synthesis and leaves cytoplasmic human protein synthesis largely untouched, but it may affect mitochondrial protein synthesis, a possible side effect that the endosymbiotic origin of mitochondria explains.`,
    },
  ],
  traps: [
    {
      title: 'Calling the nucleolus an organelle with a membrane',
      md: md`The nucleolus is a region inside the nucleus, with no membrane of its own. Ribosomes, centrioles and the cytoskeleton have no membranes either. The double-membrane trio is nucleus, mitochondrion and chloroplast.`,
    },
    {
      title: 'Assuming prokaryotes have no ribosomes or no DNA',
      md: md`Prokaryotes lack a nucleus and membrane-bound organelles, but they have DNA, ribosomes (70S), a plasma membrane and cytoplasm. An option saying bacteria lack ribosomes is wrong.`,
    },
    {
      title: 'No chloroplasts means animal',
      md: md`Root cells and many other plant cells have no chloroplasts. Use the cell wall, the large central vacuole and the absence of centrioles to recognise a plant cell, and the wall's material to tell plants from fungi.`,
    },
  ],
  check: [
    {
      id: 'check-shared-structure',
      title: 'Common to all cells',
      topic: 'The cell',
      stemMd: md`Which structure is found in both prokaryotic and eukaryotic cells?`,
      options: [
        { id: 'A', text: md`Nucleolus`, note: md`The nucleolus lies inside a nucleus, which prokaryotes do not have.` },
        { id: 'B', text: md`Mitochondrion`, note: md`Mitochondria are membrane-bound organelles, found only in eukaryotes; bacteria respire using their plasma membrane.` },
        { id: 'C', text: md`Ribosome`, note: '' },
        { id: 'D', text: md`Golgi apparatus`, note: md`The Golgi is part of the endomembrane system, which only eukaryotic cells have.` },
        { id: 'E', text: md`Endoplasmic reticulum`, note: md`The ER is a membrane-bound compartment; prokaryotes have none.` },
      ],
      answer: 'C',
      workingMd: md`All cells make proteins, so all have ribosomes: 70S in prokaryotes, 80S in the cytoplasm of eukaryotes. The other four are all compartments or regions of the eukaryotic cell.`,
      lesson: 'Prokaryotes have DNA, ribosomes, cytoplasm and a plasma membrane, but no nucleus and no membrane-bound organelles.',
    },
    {
      id: 'check-double-membrane',
      title: 'Two membranes',
      topic: 'The cell',
      stemMd: md`Which of these is bounded by a double membrane?`,
      options: [
        { id: 'A', text: md`Lysosome`, note: md`A lysosome is a vesicle with a single membrane.` },
        { id: 'B', text: md`Golgi apparatus`, note: md`Each Golgi sac (cisterna) is bounded by a single membrane.` },
        { id: 'C', text: md`Rough endoplasmic reticulum`, note: md`The ER is a network of sacs and tubes bounded by a single membrane.` },
        { id: 'D', text: md`Peroxisome`, note: md`A peroxisome is a single-membrane vesicle.` },
        { id: 'E', text: md`Chloroplast`, note: '' },
      ],
      answer: 'E',
      workingMd: md`The structures with two membranes are the nucleus, mitochondria and chloroplasts. The thylakoids inside a chloroplast are a third membrane system, but the chloroplast envelope itself is a double membrane. The others have one membrane each.`,
      lesson: 'Learn the double-membrane trio: nucleus, mitochondrion and chloroplast.',
    },
    {
      id: 'check-smooth-er',
      title: 'A cell full of smooth ER',
      topic: 'The cell',
      stemMd: md`Electron micrographs show that a cell type has a very extensive smooth endoplasmic reticulum and little rough ER. Which job is this cell most likely specialised for?`,
      options: [
        { id: 'A', text: md`Secreting digestive enzymes`, note: md`Secreted enzymes are proteins made on the rough ER; such cells have extensive rough ER.` },
        { id: 'B', text: md`Synthesising steroid hormones`, note: '' },
        { id: 'C', text: md`Engulfing and digesting bacteria`, note: md`Phagocytic cells are rich in lysosomes, which digest what the cell takes in.` },
        { id: 'D', text: md`Releasing large amounts of ATP for contraction`, note: md`Heavy ATP demand calls for many mitochondria, not smooth ER.` },
        { id: 'E', text: md`Carrying out photosynthesis`, note: md`Photosynthesis takes place in chloroplasts, not in the ER.` },
      ],
      answer: 'B',
      workingMd: md`The smooth ER makes lipids, and steroid hormones are lipids built from cholesterol, so cells that make them (for example in the adrenal cortex or the gonads) have abundant smooth ER. Enzyme secretion needs rough ER, digestion needs lysosomes, ATP needs mitochondria, photosynthesis needs chloroplasts.`,
      lesson: 'Match the abundant organelle to the product: proteins for export to rough ER, lipids and steroids to smooth ER.',
    },
  ],
  takeaways: [
    'Prokaryotes have no nucleus and no membrane-bound organelles, but they do have DNA and 70S ribosomes.',
    'Secreted proteins go rough ER, Golgi, secretory vesicle, exocytosis.',
    'Smooth ER makes lipids and steroids and detoxifies; lysosomes digest; peroxisomes break down hydrogen peroxide.',
    'Nucleus, mitochondria and chloroplasts have two membranes; mitochondria and chloroplasts also have their own DNA and 70S-type ribosomes.',
  ],
  flashcards: [
    { front: md`Prokaryotic vs eukaryotic ribosomes`, back: md`Prokaryotes have 70S ribosomes; eukaryotes have 80S in the cytoplasm and 70S-type in mitochondria and chloroplasts.` },
    { front: md`Nucleolus`, back: md`A region of the nucleus, without a membrane, where ribosomal RNA is made and ribosome subunits are assembled.` },
    { front: md`Rough ER vs smooth ER`, back: md`Rough ER has ribosomes and makes proteins for secretion, membranes and lysosomes. Smooth ER makes lipids and steroids, detoxifies and stores calcium.` },
    { front: md`Golgi apparatus`, back: md`Receives proteins from the ER in vesicles, modifies and sorts them, and sends them on in new vesicles.` },
    { front: md`Evidence for endosymbiosis`, back: md`Mitochondria and chloroplasts have two membranes, their own circular DNA and 70S-type ribosomes, and divide like bacteria.` },
    { front: md`Plant cell features`, back: md`A cellulose cell wall, a large central vacuole, chloroplasts in green tissues, and usually no centrioles; starch is the store.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-molecules-cells' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const membranesAndTransportLesson: Lesson = {
  slug: 'membranes-and-transport',
  title: 'Membranes and transport',
  summary: 'The fluid mosaic membrane, diffusion, osmosis and tonicity, active transport and the sodium-potassium pump, and bulk transport by vesicles.',
  minutes: 22,
  objectives: [
    'Describe the fluid mosaic model and say which substances cross a phospholipid bilayer unaided.',
    'Predict the direction of water movement and the fate of animal and plant cells in solutions of different tonicity.',
    'Tell passive, active and bulk transport apart from experimental evidence.',
  ],
  teachMd: md`
### The fluid mosaic model

A cell membrane is a **phospholipid bilayer**: the hydrophilic heads face the watery cytoplasm and the watery outside, and the hydrophobic tails face each other in the middle. Proteins are scattered through it like the pieces of a mosaic, and both lipids and many proteins move sideways within the layer, which is why it is called fluid.

- **Integral (transmembrane) proteins** span the bilayer: channels, carriers, pumps and many receptors.
- **Peripheral proteins** sit on one surface.
- **Cholesterol**, in animal membranes, sits between phospholipids and moderates fluidity: it stops the membrane becoming too fluid when warm and too rigid when cold.
- **Glycoproteins and glycolipids** carry short carbohydrate chains on the outer surface; they act in cell recognition and as receptors.

### What crosses the bilayer unaided

The hydrophobic core is the barrier. Small non-polar molecules, such as oxygen, carbon dioxide and steroid hormones, dissolve in it and cross freely. Water is small enough to cross slowly, and much faster through channel proteins called **aquaporins**. Ions, whatever their size, and larger polar molecules such as glucose and amino acids, cross only through proteins. Macromolecules cross only in vesicles.

### Passive transport

Passive transport needs no energy from the cell: substances move **down** their concentration gradient, from higher to lower concentration, until it disappears.

- **Simple diffusion**: directly through the bilayer (oxygen, carbon dioxide).
- **Facilitated diffusion**: through a channel protein or a carrier protein (glucose into red blood cells, ions through channels). Because the number of carriers is limited, the rate levels off (saturates) at high concentrations, unlike simple diffusion.
- **Osmosis**: the net movement of water through a selectively permeable membrane from a solution of lower solute concentration to one of higher solute concentration.

### Tonicity

Tonicity compares the concentration of solutes that cannot cross the membrane on the two sides. What matters is the number of dissolved particles: one mole of NaCl gives about two moles of particles (sodium and chloride ions), one mole of glucose gives one.

| Outside solution | Water moves | Animal cell (red blood cell) | Plant cell |
| --- | --- | --- | --- |
| hypotonic (fewer solute particles) | into the cell | swells and may burst (haemolysis) | swells until the wall resists: turgid |
| isotonic | no net movement | stays the same | flaccid |
| hypertonic (more solute particles) | out of the cell | shrinks and crenates | membrane pulls away from the wall: plasmolysed |

The plant cell wall is why a plant cell does not burst in pure water. A saline solution of about 0.9% NaCl is close to isotonic with human blood, which is why it is used for drips.

### Active transport

Active transport moves substances **against** their concentration gradient and so needs energy.

- **Primary active transport** uses ATP directly. The **sodium-potassium pump** (Na+/K+-ATPase) moves 3 sodium ions out of the cell and 2 potassium ions in for each ATP hydrolysed. It keeps sodium high outside and potassium high inside, and, because more positive charge leaves than enters, it contributes to the negative resting potential inside the cell.
- **Secondary active transport** uses a gradient set up by a pump. In the small intestine, sodium flowing back into the cell down its gradient carries glucose with it, against the glucose gradient (a symport). If the pump stops, the sodium gradient runs down and glucose uptake stops too.

Poisons such as cyanide stop aerobic respiration and therefore ATP supply, which is why they stop active transport but not diffusion.

### Bulk transport

Large particles and large amounts of material move in vesicles, a process that also needs energy.

- **Endocytosis** brings material in: **phagocytosis** engulfs solid particles such as bacteria (white blood cells), **pinocytosis** takes in droplets of fluid, and **receptor-mediated endocytosis** takes in specific molecules bound to receptors, such as cholesterol carried in LDL particles.
- **Exocytosis** releases material: secretory vesicles fuse with the plasma membrane, as when digestive enzymes, hormones or neurotransmitters are released.

### Choosing the mechanism

| Evidence | Mechanism |
| --- | --- |
| down the gradient, no protein needed, rate proportional to concentration | simple diffusion |
| down the gradient, rate saturates, specific to one molecule | facilitated diffusion |
| against the gradient, stops when ATP supply stops | active transport |
| large particles, membrane folds round them | endocytosis |
`,
  examples: [
    {
      id: 'example-red-cells-tonicity',
      title: 'Red blood cells in three solutions',
      problemMd: md`Assume the cytoplasm of a red blood cell has a solute concentration of about 0.3 osmol/L, and that sucrose, sodium and chloride cannot cross its membrane. Predict what happens to red blood cells placed in (1) 0.3 mol/L sucrose, (2) 0.3 mol/L NaCl, (3) pure water.`,
      steps: [
        md`Count dissolved particles. Sucrose does not dissociate: 0.3 mol/L gives 0.3 osmol/L. NaCl dissociates into two ions: 0.3 mol/L gives about 0.6 osmol/L. Pure water has none.`,
        md`(1) 0.3 osmol/L outside equals the inside: isotonic, no net movement of water, the cells keep their shape.`,
        md`(2) 0.6 osmol/L outside is more concentrated than the inside: hypertonic, water leaves, the cells shrink and crenate.`,
        md`(3) Pure water is hypotonic: water enters, the cells swell and, with no wall to resist, burst.`,
      ],
      answerMd: md`Unchanged in sucrose, shrunken in NaCl, burst in water. The tempting slip is to treat 0.3 mol/L NaCl as isotonic because the number is the same; NaCl gives two particles per formula unit.`,
    },
    {
      id: 'example-inhibitor-experiment',
      title: 'Which transport mechanism?',
      problemMd: md`Root cells take up nitrate ions from the soil, where nitrate is less concentrated than in the cells. When the roots are treated with cyanide, uptake falls almost to zero. What mechanism is involved, and why?`,
      steps: [
        md`Nitrate moves from lower concentration (soil) to higher concentration (cells): against its gradient. Diffusion of any kind cannot do that.`,
        md`Cyanide blocks aerobic respiration, so the cells' ATP supply falls.`,
        md`Uptake stops when ATP stops: the process depends on metabolic energy.`,
      ],
      answerMd: md`Active transport, through carrier proteins powered by ATP. Facilitated diffusion is the tempting wrong answer, because it also uses carrier proteins; it can only move ions down their gradient and does not need ATP.`,
    },
    {
      id: 'example-pump-counting',
      title: 'Counting ions moved by the sodium-potassium pump',
      problemMd: md`During a period of activity, the sodium-potassium pumps of a cell hydrolyse 500 molecules of ATP. How many sodium and potassium ions are moved, and what is the net movement of positive charge?`,
      steps: [
        md`Each ATP moves 3 sodium ions out and 2 potassium ions in.`,
        md`Sodium out: $3 \times 500 = 1500$. Potassium in: $2 \times 500 = 1000$.`,
        md`Each ion carries one positive charge, so the net movement is $1500 - 1000 = 500$ positive charges out of the cell.`,
      ],
      answerMd: md`1500 sodium ions out, 1000 potassium ions in, a net 500 positive charges out. Swapping the numbers (3 potassium in, 2 sodium out) is the classic error.`,
    },
  ],
  traps: [
    {
      title: 'Thinking water moves towards more water',
      md: md`In osmosis water moves towards the side with **more solute** (lower water concentration). If you think in terms of solutes, the answer is "water follows the solute". Check your direction before you choose.`,
    },
    {
      title: 'Ignoring dissociation',
      md: md`Tonicity depends on the number of particles. 0.1 mol/L NaCl gives about 0.2 mol/L of particles, 0.1 mol/L CaCl2 about 0.3; glucose and sucrose do not dissociate. Compare particle concentrations, not formula concentrations.`,
    },
    {
      title: 'Treating every protein-mediated process as active',
      md: md`Channels and carriers are used by both facilitated diffusion and active transport. The deciding questions are the direction relative to the gradient and whether the process needs energy.`,
    },
  ],
  check: [
    {
      id: 'check-bilayer-permeability',
      title: 'Crossing an artificial bilayer',
      topic: 'The cell',
      stemMd: md`An artificial membrane is made of a pure phospholipid bilayer, with no proteins. Which substance crosses it most readily?`,
      options: [
        { id: 'A', text: md`Oxygen`, note: '' },
        { id: 'B', text: md`Glucose`, note: md`Glucose is polar and relatively large; it needs carrier proteins, which this membrane lacks.` },
        { id: 'C', text: md`Sodium ions`, note: md`Ions are charged and surrounded by water, so they cannot pass the hydrophobic core without a channel or carrier.` },
        { id: 'D', text: md`Insulin`, note: md`Insulin is a protein, far too large and polar to diffuse through a bilayer.` },
        { id: 'E', text: md`ATP`, note: md`ATP is large and carries several negative charges on its phosphates; it cannot cross the hydrophobic core.` },
      ],
      answer: 'A',
      workingMd: md`Small non-polar molecules dissolve in the hydrophobic core of the bilayer and diffuse straight through. Oxygen is the only small non-polar molecule listed; the others are polar, charged or large.`,
      lesson: 'Without proteins, only small non-polar molecules (and water, slowly) cross a bilayer.',
    },
    {
      id: 'check-plasmolysis',
      title: 'A plant cell in strong salt solution',
      topic: 'The cell',
      stemMd: md`An onion epidermis cell is placed in a concentrated sodium chloride solution. What is observed under the microscope?`,
      options: [
        { id: 'A', text: md`The cell bursts because salt enters faster than water leaves.`, note: md`Plant cells do not burst, thanks to the wall, and in a hypertonic solution the cell loses water rather than gaining it.` },
        { id: 'B', text: md`The cell gains water and becomes more turgid.`, note: md`Water moves towards the more concentrated solution, which here is outside the cell, so the cell loses water.` },
        { id: 'C', text: md`There is no net movement of water, because the cell wall is fully permeable.`, note: md`The wall is permeable, but the plasma membrane is selectively permeable, so osmosis still occurs across it.` },
        { id: 'D', text: md`The cell loses water by osmosis and the plasma membrane pulls away from the cell wall.`, note: '' },
        { id: 'E', text: md`The cell wall shrinks with the vacuole, so the membrane stays pressed against the wall.`, note: md`The wall is rigid and barely changes size; it is the protoplast inside that shrinks away from it.` },
      ],
      answer: 'D',
      workingMd: md`The solution outside is hypertonic, so water leaves the vacuole and cytoplasm by osmosis. The protoplast shrinks but the rigid wall does not, so the plasma membrane separates from the wall: plasmolysis.`,
      lesson: 'In a hypertonic solution a plant cell plasmolyses; in a hypotonic one it becomes turgid but does not burst.',
    },
    {
      id: 'check-sodium-potassium-pump',
      title: 'One cycle of the pump',
      topic: 'The cell',
      stemMd: md`For each molecule of ATP hydrolysed, what does the sodium-potassium pump move?`,
      options: [
        { id: 'A', text: md`2 sodium ions out and 3 potassium ions in`, note: md`The numbers are swapped: three sodium leave and two potassium enter.` },
        { id: 'B', text: md`3 sodium ions in and 2 potassium ions out`, note: md`The directions are reversed: the pump keeps sodium high outside and potassium high inside.` },
        { id: 'C', text: md`3 sodium ions out and 2 potassium ions in`, note: '' },
        { id: 'D', text: md`1 sodium ion out and 1 potassium ion in`, note: md`An equal exchange would move no net charge; the pump moves more positive charge out than in.` },
        { id: 'E', text: md`3 sodium ions out and 3 potassium ions in`, note: md`The pump takes in two potassium ions per cycle, not three.` },
      ],
      answer: 'C',
      workingMd: md`The Na+/K+-ATPase is a primary active transporter: each cycle uses one ATP to move 3 sodium ions out of the cell and 2 potassium ions in, both against their gradients. The net loss of one positive charge per cycle contributes to the negative inside of the cell.`,
      lesson: 'Three sodium out, two potassium in, one ATP: the pump makes the inside lower in sodium and more negative.',
    },
  ],
  takeaways: [
    'The membrane is a fluid phospholipid bilayer with proteins; only small non-polar molecules cross it unaided.',
    'Passive transport goes down a gradient without ATP; active transport goes against it and needs energy.',
    'Water moves by osmosis towards the side with more solute particles; count ions after dissociation.',
    'Animal cells burst in hypotonic and shrink in hypertonic solutions; plant cells become turgid or plasmolysed.',
    'The sodium-potassium pump moves 3 sodium out and 2 potassium in per ATP.',
  ],
  flashcards: [
    { front: md`Fluid mosaic model`, back: md`A phospholipid bilayer in which proteins float and move sideways; cholesterol moderates fluidity and glycoproteins act in recognition.` },
    { front: md`Simple vs facilitated diffusion`, back: md`Both go down the gradient without ATP. Simple diffusion crosses the bilayer directly; facilitated diffusion uses channels or carriers and saturates at high concentration.` },
    { front: md`Osmosis`, back: md`Net movement of water across a selectively permeable membrane from lower to higher solute concentration.` },
    { front: md`Red blood cell in hypotonic vs hypertonic solution`, back: md`Hypotonic: water enters, the cell swells and may burst (haemolysis). Hypertonic: water leaves and the cell shrinks (crenation).` },
    { front: md`Sodium-potassium pump`, back: md`Primary active transport: 3 sodium ions out and 2 potassium ions in for each ATP hydrolysed.` },
    { front: md`Phagocytosis, pinocytosis, exocytosis`, back: md`Phagocytosis engulfs solid particles, pinocytosis takes in fluid; exocytosis releases vesicle contents. All need energy.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-molecules-cells' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const enzymesAndMetabolismLesson: Lesson = {
  slug: 'enzymes-and-metabolism',
  title: 'Enzymes and metabolism',
  summary: 'How enzymes lower activation energy, why temperature, pH and substrate change their rate, how inhibitors differ, and how pathways are controlled.',
  minutes: 22,
  objectives: [
    'Explain what an enzyme changes in a reaction and what it does not.',
    'Predict the effect of temperature, pH, substrate concentration and inhibitors on the rate of an enzyme reaction.',
    'Interpret rate data to tell competitive from non-competitive inhibition, and explain feedback inhibition.',
  ],
  teachMd: md`
### Metabolism and ATP

**Metabolism** is the sum of the chemical reactions in a cell. **Catabolic** reactions break large molecules into smaller ones and release energy (respiration breaks down glucose); **anabolic** reactions build large molecules and need energy (protein and DNA synthesis). The two are linked by **ATP**: hydrolysing ATP to ADP and inorganic phosphate releases energy that drives energy-requiring processes, and catabolism regenerates ATP from ADP. A cell holds only a small stock of ATP and recycles it constantly.

### What an enzyme does

Enzymes are biological catalysts, almost all of them proteins (a few catalytic RNAs, ribozymes, also exist). Every reaction must pass an energy barrier, the **activation energy**. An enzyme provides a route with a lower activation energy, so more molecules have enough energy to react and the reaction goes faster at body temperature.

An enzyme does **not**:

- change the overall energy difference between reactants and products (the free energy change, $\Delta G$);
- change the position of equilibrium: it speeds the forward and reverse reactions alike, so equilibrium is simply reached sooner;
- get used up: it is released unchanged and can act again.

Enzyme names usually end in -ase and often name the substrate: lactase hydrolyses lactose, DNA polymerase builds DNA.

### The active site

The substrate binds to a small region of the enzyme, the **active site**, whose shape and chemical groups match it; the result is an **enzyme-substrate complex**, which turns into enzyme and products:

$$\mathrm{E + S \rightleftharpoons ES \rightarrow E + P}$$

In the **lock-and-key** model the active site is a rigid fit; in the more accurate **induced-fit** model the active site changes shape slightly as the substrate binds, gripping it and straining its bonds. Either way, the fit explains **specificity**: an enzyme acts on one substrate or one type of bond.

### What changes the rate

- **Temperature.** Raising the temperature increases the kinetic energy of the molecules and so the rate, up to an **optimum** (about 37 °C for many human enzymes). Above it, the vibrations break the bonds holding the tertiary structure, the active site changes shape and the enzyme is **denatured**; the rate falls steeply and, typically, does not recover on cooling. At low temperature the enzyme is merely slow: warming it restores activity.
- **pH.** Each enzyme has an optimum pH. Changes of pH alter the charges on R groups in and around the active site, so substrate binding and the protein's shape suffer, and extreme pH denatures the enzyme. Pepsin, in the stomach, works best at about pH 2; salivary amylase near pH 7; trypsin, in the small intestine, at about pH 8.
- **Substrate concentration.** At low concentration, more substrate means more collisions and a faster rate. As concentration rises, more active sites are occupied at any moment, until all are busy: the rate levels off at its maximum, $V_{max}$ (saturation). The substrate concentration that gives half of $V_{max}$ is the Michaelis constant, $K_m$; a low $K_m$ means the enzyme binds its substrate tightly.
- **Enzyme concentration.** With substrate in excess, the rate is proportional to the amount of enzyme.

### Inhibitors

| | Competitive | Non-competitive |
| --- | --- | --- |
| binds to | the active site | another site on the enzyme |
| resembles the substrate? | yes | not necessarily |
| effect of adding much more substrate | overcomes the inhibition | does not overcome it |
| $V_{max}$ | unchanged | lowered |
| $K_m$ | raised | unchanged |

Both types above are usually **reversible**: the inhibitor comes off again. **Irreversible** inhibitors bind permanently, often covalently; some nerve poisons work this way.

### Cofactors

Many enzymes need a non-protein helper. **Cofactors** in the narrow sense are inorganic ions such as magnesium, zinc or iron. **Coenzymes** are organic molecules, often made from vitamins: NAD+ from niacin, FAD from riboflavin, coenzyme A from pantothenic acid. They often carry electrons or groups from one reaction to another. A helper bound tightly and permanently, such as the haem group, is a **prosthetic group**. The protein alone is the apoenzyme; with its cofactor it is the holoenzyme.

### Controlling pathways

Metabolic reactions run in **pathways**, each step catalysed by its own enzyme. Cells control them in several ways:

- **Allosteric regulation**: a molecule binding to a site away from the active site changes the enzyme's shape, activating or inhibiting it.
- **Feedback inhibition**: the end product of a pathway allosterically inhibits the enzyme of an early step, usually the first. When the product accumulates, the pathway slows; when it is used up, the pathway speeds up again. Nothing is wasted making a product the cell already has.
- **Inactive precursors**: some digestive enzymes are made as inactive forms (pepsinogen, trypsinogen) and activated only where they are needed, so they do not digest the cells that make them.
`,
  examples: [
    {
      id: 'example-inhibitor-data',
      title: 'Reading inhibitor data',
      problemMd: md`The rate of an enzyme reaction (in arbitrary units) is measured at four substrate concentrations, with and without a substance X:

| Substrate (mmol/L) | 1 | 2 | 10 | 50 |
| --- | --- | --- | --- | --- |
| rate without X | 33 | 50 | 83 | 96 |
| rate with X | 14 | 25 | 63 | 89 |

What kind of inhibitor is X?`,
      steps: [
        md`Compare the two rows at low substrate: X cuts the rate by half or more (33 to 14, 50 to 25). X is an inhibitor.`,
        md`Compare them at high substrate: the gap shrinks (96 against 89) and the two rows approach the same maximum.`,
        md`Inhibition that is overcome by more substrate means X competes with the substrate for the active site: $V_{max}$ is unchanged, and more substrate is needed to reach half of it ($K_m$ is raised).`,
      ],
      answerMd: md`X is a competitive inhibitor. A non-competitive inhibitor would lower the maximum rate, so the "with X" row would level off well below the other however much substrate was added.`,
    },
    {
      id: 'example-temperature-pretreatment',
      title: 'Heat and cold are not the same',
      problemMd: md`Three samples of the same human enzyme are kept for 30 minutes at 5 °C, 37 °C and 70 °C. All three are then brought to 37 °C and their activity measured. Predict the results.`,
      steps: [
        md`At 5 °C the enzyme molecules move slowly, but the protein is not damaged. Back at 37 °C it works normally.`,
        md`The 37 °C sample was always at its optimum: normal activity.`,
        md`At 70 °C the bonds that maintain the tertiary structure break and the active site loses its shape: the enzyme is denatured. Cooling does not restore the shape.`,
      ],
      answerMd: md`The 5 °C and 37 °C samples have similar, normal activity; the 70 °C sample has little or none. The wrong prediction is that cold also denatures the enzyme: low temperature slows it reversibly.`,
    },
    {
      id: 'example-feedback-inhibition',
      title: 'Predicting the effect of feedback inhibition',
      problemMd: md`In a pathway A → B → C → D, enzyme 1 converts A to B, enzyme 2 converts B to C and enzyme 3 converts C to D. Product D is an allosteric inhibitor of enzyme 1. A mutation changes enzyme 1 so that D can no longer bind to it, while its active site still works. Predict what happens to the amount of D in the cell.`,
      steps: [
        md`Normally, as D accumulates it binds enzyme 1 and slows the conversion of A to B, so less D is made.`,
        md`In the mutant, D cannot bind, so enzyme 1 keeps converting A to B whatever the amount of D.`,
        md`B and C keep flowing through enzymes 2 and 3, so D keeps being made even when it is not needed.`,
      ],
      answerMd: md`D is overproduced and A is used up faster, because the brake on the pathway has gone. Answering that D falls confuses losing the regulatory site with losing the active site.`,
    },
  ],
  traps: [
    {
      title: 'Saying enzymes shift the equilibrium',
      md: md`An enzyme speeds both directions of a reaction equally. It shortens the time to reach equilibrium but does not change where the equilibrium lies, nor the energy released or absorbed by the reaction.`,
    },
    {
      title: 'Treating cold like heat',
      md: md`High temperature denatures enzymes, usually for good; low temperature only slows them. An option claiming that cooling to 0 °C destroys an enzyme is wrong.`,
    },
    {
      title: 'Confusing the two kinds of inhibitor',
      md: md`The test is "does more substrate overcome it?" Yes means competitive (same $V_{max}$, higher $K_m$); no means non-competitive (lower $V_{max}$). Remember which quantity each one changes.`,
    },
  ],
  check: [
    {
      id: 'check-enzyme-statement',
      title: 'What an enzyme changes',
      topic: 'Bioenergetics',
      stemMd: md`Which statement about an enzyme-catalysed reaction is correct?`,
      options: [
        { id: 'A', text: md`The enzyme raises the activation energy so that the reaction can be controlled.`, note: md`Enzymes lower the activation energy; raising it would slow the reaction.` },
        { id: 'B', text: md`The enzyme shifts the equilibrium towards the products.`, note: md`An enzyme speeds the forward and reverse reactions alike, so the position of equilibrium does not change.` },
        { id: 'C', text: md`The enzyme is used up as the products form.`, note: md`A catalyst is released unchanged at the end of each cycle and can act again.` },
        { id: 'D', text: md`Every human enzyme works best at pH 7.`, note: md`Optimum pH varies: pepsin works best near pH 2 and trypsin near pH 8.` },
        { id: 'E', text: md`The enzyme lowers the activation energy without changing the overall free energy change of the reaction.`, note: '' },
      ],
      answer: 'E',
      workingMd: md`A catalyst offers a lower-energy route between the same reactants and products, so the activation energy falls while $\Delta G$, set by the reactants and products, stays the same. It is not consumed, does not move the equilibrium, and optimum pH differs from enzyme to enzyme.`,
      lesson: 'Enzymes change how fast equilibrium is reached, never where it lies or how much energy the reaction releases.',
    },
    {
      id: 'check-competitive-inhibitor',
      title: 'Recognising a competitive inhibitor',
      topic: 'Bioenergetics',
      stemMd: md`Which feature is characteristic of a reversible competitive inhibitor?`,
      options: [
        { id: 'A', text: md`It lowers the maximum rate, however much substrate is added.`, note: md`A lowered maximum rate is the mark of non-competitive inhibition.` },
        { id: 'B', text: md`Its effect can be overcome by raising the substrate concentration.`, note: '' },
        { id: 'C', text: md`It binds permanently to an allosteric site.`, note: md`Permanent binding describes an irreversible inhibitor, and binding away from the active site describes non-competitive or allosteric inhibition.` },
        { id: 'D', text: md`It works by denaturing the enzyme.`, note: md`Denaturation destroys the enzyme's shape; a competitive inhibitor simply occupies the active site for a time.` },
        { id: 'E', text: md`It reduces $V_{max}$ but leaves $K_m$ unchanged.`, note: md`This is the pattern of non-competitive inhibition; a competitive inhibitor leaves $V_{max}$ unchanged and raises $K_m$.` },
      ],
      answer: 'B',
      workingMd: md`A competitive inhibitor resembles the substrate and competes for the active site. With much more substrate, the substrate wins most encounters, so the original maximum rate is reached again: $V_{max}$ unchanged, $K_m$ raised.`,
      lesson: 'If extra substrate cancels the inhibition, the inhibitor is competing for the active site.',
    },
    {
      id: 'check-pepsin-tubes',
      title: 'Where pepsin works fastest',
      topic: 'Bioenergetics',
      stemMd: md`Five tubes contain the same amount of egg-white protein and of pepsin, a stomach enzyme. In which tube will the protein be digested fastest?`,
      options: [
        { id: 'A', text: md`pH 7, 37 °C`, note: md`Body temperature is right, but pH 7 is far from pepsin's optimum, which matches the acid stomach.` },
        { id: 'B', text: md`pH 2, 0 °C`, note: md`The pH is right, but at 0 °C molecules move slowly and the reaction is very slow.` },
        { id: 'C', text: md`pH 9, 37 °C`, note: md`An alkaline pH suits intestinal enzymes, not pepsin, which loses activity there.` },
        { id: 'D', text: md`pH 2, 37 °C`, note: '' },
        { id: 'E', text: md`pH 2, 80 °C`, note: md`At 80 °C a human enzyme is denatured, so activity is lost even at the right pH.` },
      ],
      answer: 'D',
      workingMd: md`Pepsin works in the stomach, where the pH is about 2, at body temperature. Only the tube with both its optimum pH and 37 °C gives fast digestion; too cold slows it, too hot denatures it, and neutral or alkaline pH is far from its optimum.`,
      lesson: "An enzyme's optimum conditions match where it works in the body.",
    },
  ],
  takeaways: [
    'Enzymes lower activation energy; they do not change $\\Delta G$ or the equilibrium, and they are not consumed.',
    'Heat above the optimum denatures enzymes, usually irreversibly; cold only slows them.',
    'Rate rises with substrate concentration until all active sites are busy ($V_{max}$).',
    'Competitive inhibition is overcome by more substrate; non-competitive inhibition lowers $V_{max}$.',
    'In feedback inhibition, a pathway\'s end product inhibits an early enzyme.',
  ],
  flashcards: [
    { front: md`What an enzyme does to activation energy`, back: md`It lowers it, by offering a different route; the free energy change and the equilibrium position stay the same.` },
    { front: md`Induced fit`, back: md`The active site changes shape slightly as the substrate binds, gripping it and straining its bonds.` },
    { front: md`Effect of high and low temperature`, back: md`Above the optimum the enzyme is denatured and usually stays inactive; at low temperature it is slowed but recovers on warming.` },
    { front: md`Competitive vs non-competitive inhibition`, back: md`Competitive: binds the active site, overcome by more substrate, $V_{max}$ unchanged, $K_m$ raised. Non-competitive: binds elsewhere, $V_{max}$ lowered, $K_m$ unchanged.` },
    { front: md`Cofactor, coenzyme, prosthetic group`, back: md`A cofactor is a non-protein helper, often an inorganic ion; a coenzyme is an organic one, often from a vitamin (NAD+, FAD); a prosthetic group is bound permanently (haem).` },
    { front: md`Feedback inhibition`, back: md`The end product of a pathway inhibits an early enzyme, usually allosterically, so the pathway slows when the product accumulates.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-bioenergetics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const cellularRespirationAndPhotosynthesisLesson: Lesson = {
  slug: 'cellular-respiration-and-photosynthesis',
  title: 'Cellular respiration and photosynthesis',
  summary: 'Glycolysis, the link reaction, the Krebs cycle and oxidative phosphorylation; fermentation; the light-dependent reactions and the Calvin cycle.',
  minutes: 25,
  objectives: [
    'Place each stage of aerobic respiration in the cell and state what it produces per glucose.',
    'Explain why oxygen is needed and what fermentation achieves without it.',
    'Describe the two stages of photosynthesis and trace where its oxygen and carbon atoms come from.',
  ],
  teachMd: md`
### Respiration in one equation

Aerobic respiration oxidises glucose to carbon dioxide and water and stores part of the energy released as ATP:

$$\mathrm{C_6H_{12}O_6 + 6\,O_2 \rightarrow 6\,CO_2 + 6\,H_2O}$$

It does this in four stages, so that energy is released in small steps. Most of the energy is first carried as electrons on the coenzymes **NAD** (as NADH) and **FAD** (as FADH2), which deliver them to the final stage.

### The four stages

| Stage | Where (eukaryotes) | Per molecule of glucose |
| --- | --- | --- |
| glycolysis | cytoplasm | 2 pyruvate, net 2 ATP, 2 NADH |
| link reaction (pyruvate oxidation) | mitochondrial matrix | 2 acetyl-CoA, 2 CO2, 2 NADH |
| Krebs cycle (citric acid cycle) | mitochondrial matrix | 4 CO2, 2 ATP (or GTP), 6 NADH, 2 FADH2 |
| oxidative phosphorylation | inner mitochondrial membrane | most of the ATP; oxygen reduced to water |

**Glycolysis** splits glucose (6 carbons) into two pyruvate molecules (3 carbons each). It uses 2 ATP and makes 4, a net gain of 2. It needs no oxygen.

In the **link reaction**, each pyruvate enters the mitochondrion, loses one carbon as carbon dioxide and is joined to coenzyme A as acetyl-CoA (2 carbons). Each acetyl group then enters the **Krebs cycle**, joining a 4-carbon molecule to form citrate (6 carbons); each turn releases two carbons as carbon dioxide, as many as the acetyl group brought in, and regenerates the 4-carbon acceptor. The cycle turns twice per glucose. All six carbons of glucose leave as carbon dioxide: two in the link reaction and four in the Krebs cycle.

### Oxidative phosphorylation

NADH and FADH2 hand their electrons to the **electron transport chain**, a series of proteins in the inner mitochondrial membrane. As electrons pass along it, the energy released pumps hydrogen ions (protons) from the matrix into the intermembrane space. The protons flow back through **ATP synthase**, which uses their movement to make ATP from ADP and phosphate: this coupling is **chemiosmosis**. At the end of the chain, **oxygen is the final electron acceptor**: it combines with electrons and protons to form water.

Without oxygen the chain stops, NADH cannot be reoxidised, NAD+ runs out and the Krebs cycle and link reaction stop too.

The total yield is **about 30–32 ATP per glucose** in current textbooks; older books give 36–38. The figure varies by textbook because the number of protons needed per ATP is not a whole number and because moving the electrons of glycolytic NADH into the mitochondrion costs different amounts in different cells. Whatever the total, almost all of it comes from oxidative phosphorylation.

### Fermentation

Without oxygen, many cells keep glycolysis running by passing the electrons of NADH to pyruvate or to a product made from it, which regenerates NAD+:

- **Lactic acid fermentation** (muscle cells during intense exercise, some bacteria): pyruvate is reduced to lactate.
- **Alcoholic fermentation** (yeast, plant cells short of oxygen): pyruvate loses carbon dioxide and becomes ethanol.

Fermentation itself makes no ATP: the only ATP is the net 2 from glycolysis. That is why cells that ferment use glucose far faster than cells that respire aerobically.

### Photosynthesis

In plants and algae, photosynthesis takes place in **chloroplasts** and builds sugar from carbon dioxide and water using light energy:

$$\mathrm{6\,CO_2 + 6\,H_2O \xrightarrow{\text{light}} C_6H_{12}O_6 + 6\,O_2}$$

Chlorophyll absorbs mainly red and blue light and reflects green.

The **light-dependent reactions** take place in the **thylakoid membranes**. Light excites electrons in chlorophyll in the photosystems; the electrons pass along an electron transport chain that pumps protons into the thylakoid space, and ATP synthase makes ATP as they flow back. The electrons finally reduce NADP+ to **NADPH**. The electrons lost by chlorophyll are replaced by splitting water (**photolysis**), which releases **oxygen** as a by-product.

The **light-independent reactions**, the **Calvin cycle**, take place in the **stroma**. The enzyme **RuBisCO** fixes carbon dioxide to a 5-carbon sugar, ribulose bisphosphate (RuBP); the product splits into two 3-carbon molecules (glycerate 3-phosphate). ATP and NADPH from the light-dependent reactions reduce these to a 3-carbon sugar phosphate (triose phosphate, also called G3P). A few of these leave the cycle to make glucose, sucrose, starch and other molecules; most are used, with more ATP, to regenerate RuBP. Making one glucose takes six turns of the cycle: 6 CO2, 18 ATP and 12 NADPH.

The Calvin cycle needs no light directly, but it stops in the dark within a short time because ATP and NADPH run out.

### Comparing the two

| | Aerobic respiration | Photosynthesis |
| --- | --- | --- |
| organelle | mitochondrion (after glycolysis) | chloroplast |
| carbon | glucose oxidised to CO2 | CO2 reduced to sugar |
| oxygen | used, as the final electron acceptor | released, from water |
| electron carrier | NAD+ to NADH, FAD to FADH2 | NADP+ to NADPH |
| ATP made by | chemiosmosis (and a little directly) | chemiosmosis in the thylakoids |

Both use an electron transport chain, a proton gradient and ATP synthase. Plants respire all the time, in light and in darkness; in the light their photosynthesis usually outpaces respiration.
`,
  examples: [
    {
      id: 'example-counting-carbon-dioxide',
      title: 'Where the carbon dioxide comes from',
      problemMd: md`One molecule of glucose is completely oxidised by aerobic respiration. How many molecules of CO2 are released in glycolysis, in the link reaction and in the Krebs cycle?`,
      steps: [
        md`Glycolysis splits glucose into two 3-carbon pyruvates without losing any carbon: 0 CO2.`,
        md`In the link reaction each pyruvate loses one carbon as CO2, and there are two pyruvates: 2 CO2.`,
        md`Each turn of the Krebs cycle releases two carbons as CO2, as many as one acetyl group (2 carbons) brings in, and the cycle turns twice per glucose: 4 CO2.`,
        md`Check: $0 + 2 + 4 = 6$, matching the six carbons of glucose and the 6 CO2 of the overall equation.`,
      ],
      answerMd: md`0, 2 and 4: six in all. Giving CO2 to glycolysis, or counting the Krebs cycle once instead of twice, are the usual slips.`,
    },
    {
      id: 'example-oxygen-isotope',
      title: 'Tracing oxygen with a heavy isotope',
      problemMd: md`An alga is given water whose oxygen atoms are the heavy isotope oxygen-18, and normal CO2. In a second experiment it is given normal water and CO2 labelled with oxygen-18. In which experiment does the O2 released contain oxygen-18?`,
      steps: [
        md`The O2 released in photosynthesis comes from the photolysis of water in the light-dependent reactions.`,
        md`So in the first experiment the released O2 is labelled.`,
        md`The oxygen atoms of CO2 are built into the sugar in the Calvin cycle (and some end up in water formed by the reactions); they do not appear in the released O2.`,
      ],
      answerMd: md`Only in the first experiment, with labelled water. The tempting assumption is that the O2 comes from CO2, because the overall equation has 6 CO2 on the left and 6 O2 on the right.`,
    },
    {
      id: 'example-yeast-glucose',
      title: 'Yeast with and without oxygen',
      problemMd: md`Yeast can respire aerobically or ferment. Roughly how many times more glucose must yeast use when fermenting than when respiring aerobically to make the same amount of ATP? Take about 30–32 ATP per glucose for aerobic respiration.`,
      steps: [
        md`Fermentation yields only the net 2 ATP of glycolysis per glucose.`,
        md`Aerobic respiration yields about 30–32 ATP per glucose.`,
        md`For the same ATP, the ratio of glucose used is $\frac{30}{2} = 15$ to $\frac{32}{2} = 16$.`,
      ],
      answerMd: md`About 15 to 16 times more glucose. Answering "twice as much" confuses the ATP of glycolysis with the total; the products of fermentation (ethanol and CO2) still hold much of the energy of glucose.`,
    },
  ],
  traps: [
    {
      title: 'Putting the stages in the wrong place',
      md: md`Glycolysis is in the cytoplasm; the link reaction and the Krebs cycle are in the matrix; the electron transport chain is on the inner mitochondrial membrane. In chloroplasts, the light-dependent reactions are on the thylakoid membranes and the Calvin cycle is in the stroma.`,
    },
    {
      title: 'Thinking fermentation makes extra ATP',
      md: md`Converting pyruvate to lactate or ethanol makes no ATP. Its only purpose is to regenerate NAD+ so that glycolysis, with its net 2 ATP, can continue.`,
    },
    {
      title: 'Quoting one ATP total as exact',
      md: md`Textbooks give about 30–32 ATP per glucose, older ones 36–38. If several totals appear among the options, choose the one consistent with the question's own data, and never conclude that one textbook figure is "the" exact yield.`,
    },
    {
      title: 'Oxygen from carbon dioxide',
      md: md`The O2 of photosynthesis comes from water, split in the light-dependent reactions. The CO2 provides the carbon (and oxygen) of the sugar.`,
    },
  ],
  check: [
    {
      id: 'check-electron-transport-location',
      title: 'Where the chain is',
      topic: 'Bioenergetics',
      stemMd: md`In a human cell, where does the electron transport chain of aerobic respiration take place?`,
      options: [
        { id: 'A', text: md`In the cytoplasm`, note: md`The cytoplasm is the site of glycolysis, not of the electron transport chain.` },
        { id: 'B', text: md`In the mitochondrial matrix`, note: md`The matrix holds the link reaction and the Krebs cycle; the chain is in the membrane around it.` },
        { id: 'C', text: md`In the inner mitochondrial membrane`, note: '' },
        { id: 'D', text: md`In the outer mitochondrial membrane`, note: md`The outer membrane is smooth and permeable; the chain and ATP synthase sit in the folded inner membrane.` },
        { id: 'E', text: md`In the thylakoid membranes`, note: md`Thylakoids carry the electron transport chain of photosynthesis, and human cells have no chloroplasts.` },
      ],
      answer: 'C',
      workingMd: md`The proteins of the electron transport chain and ATP synthase are embedded in the inner mitochondrial membrane, folded into cristae. Protons are pumped from the matrix into the intermembrane space and flow back through ATP synthase.`,
      lesson: 'Cristae carry the chain; the matrix holds the Krebs cycle; the cytoplasm holds glycolysis.',
    },
    {
      id: 'check-lactate-purpose',
      title: 'Why muscle makes lactate',
      topic: 'Bioenergetics',
      stemMd: md`During intense exercise, muscle cells short of oxygen convert pyruvate to lactate. What is the main benefit to the cell of this reaction?`,
      options: [
        { id: 'A', text: md`It regenerates NAD+, so that glycolysis can continue to make ATP.`, note: '' },
        { id: 'B', text: md`It produces extra ATP in addition to that made by glycolysis.`, note: md`The conversion of pyruvate to lactate makes no ATP at all.` },
        { id: 'C', text: md`It releases CO2, which stimulates breathing.`, note: md`Lactic acid fermentation releases no CO2; it is alcoholic fermentation that does.` },
        { id: 'D', text: md`It supplies electrons to the electron transport chain.`, note: md`The chain stops without oxygen; lactate formation takes electrons away from NADH rather than delivering them to the chain.` },
        { id: 'E', text: md`It feeds lactate straight into the Krebs cycle inside the muscle cell.`, note: md`The Krebs cycle is also halted when the chain stops; lactate is carried away and dealt with later, mainly once oxygen is available again.` },
      ],
      answer: 'A',
      workingMd: md`Glycolysis needs NAD+ to accept electrons. Without oxygen, NADH cannot be reoxidised by the chain, so the cell reduces pyruvate to lactate using NADH, which returns NAD+ and lets glycolysis go on producing its net 2 ATP per glucose.`,
      lesson: 'Fermentation pays off by recycling NAD+, not by making ATP of its own.',
    },
    {
      id: 'check-oxygen-source',
      title: 'Where the oxygen comes from',
      topic: 'Bioenergetics',
      stemMd: md`The oxygen released by a plant during photosynthesis comes from which source?`,
      options: [
        { id: 'A', text: md`Carbon dioxide, split in the Calvin cycle`, note: md`The oxygen atoms of CO2 end up in sugar and water, not in the released O2.` },
        { id: 'B', text: md`Glucose, broken down in the chloroplast`, note: md`Glucose is a product of photosynthesis, not the source of its oxygen; breaking down glucose is respiration.` },
        { id: 'C', text: md`Ribulose bisphosphate, when RuBisCO acts on it`, note: md`RuBisCO fixes CO2 onto RuBP; no O2 is released in that step.` },
        { id: 'D', text: md`Glycerate 3-phosphate, when it is reduced`, note: md`The reduction of glycerate 3-phosphate uses ATP and NADPH and releases no oxygen.` },
        { id: 'E', text: md`Water, split in the light-dependent reactions`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Photolysis of water in the light-dependent reactions replaces the electrons lost by chlorophyll and releases O2. Isotope experiments with oxygen-18 show that only labelled water gives labelled O2.`,
      lesson: 'Photosynthetic oxygen comes from water; the carbon dioxide supplies the sugar.',
    },
  ],
  takeaways: [
    'Glycolysis (cytoplasm) gives net 2 ATP; the link reaction and Krebs cycle (matrix) release the carbon as CO2 and load NADH and FADH2.',
    'Oxidative phosphorylation on the inner membrane makes most of the ATP, about 30–32 per glucose in all (the figure varies by textbook).',
    'Oxygen is the final electron acceptor; without it, fermentation recycles NAD+ and only glycolysis makes ATP.',
    'Light-dependent reactions (thylakoids) split water, release O2 and make ATP and NADPH; the Calvin cycle (stroma) fixes CO2 with RuBisCO.',
  ],
  flashcards: [
    { front: md`Products of glycolysis per glucose`, back: md`2 pyruvate, a net 2 ATP and 2 NADH, in the cytoplasm, without oxygen.` },
    { front: md`Products of the Krebs cycle per glucose`, back: md`Two turns give 4 CO2, 2 ATP (or GTP), 6 NADH and 2 FADH2, in the mitochondrial matrix.` },
    { front: md`Chemiosmosis`, back: md`The electron transport chain pumps protons across a membrane; their flow back through ATP synthase drives ATP synthesis.` },
    { front: md`ATP per glucose in aerobic respiration`, back: md`About 30–32 in current textbooks (36–38 in older ones); the figure varies by textbook.` },
    { front: md`Lactic acid vs alcoholic fermentation`, back: md`Muscle reduces pyruvate to lactate; yeast turns it into ethanol and CO2. Both regenerate NAD+ and make no ATP beyond glycolysis.` },
    { front: md`Light-dependent reactions vs Calvin cycle`, back: md`Thylakoid membranes: water split, O2 released, ATP and NADPH made. Stroma: RuBisCO fixes CO2 to RuBP and ATP and NADPH reduce the product to triose phosphate.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-bioenergetics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const cellCycleMitosisAndMeiosisLesson: Lesson = {
  slug: 'cell-cycle-mitosis-and-meiosis',
  title: 'The cell cycle, mitosis and meiosis',
  summary: 'Interphase and its checkpoints, the stages of mitosis and meiosis, and how to count chromosomes, chromatids and DNA at every stage.',
  minutes: 24,
  objectives: [
    'Describe the cell cycle and the events of each stage of mitosis and meiosis.',
    'Count chromosomes, chromatids and DNA content in a cell at any stage of either division.',
    'Explain how meiosis produces genetic variation and how nondisjunction produces aneuploidy.',
  ],
  teachMd: md`
### Chromosomes, chromatids and ploidy

A **chromosome** is one DNA molecule with its proteins. Before replication it consists of a single **chromatid**; after replication it consists of two identical **sister chromatids** joined at the **centromere**, but it is still one chromosome. The safest way to count chromosomes is to count centromeres.

**Homologous chromosomes** are a pair, one from each parent, carrying the same genes at the same positions (loci), though possibly different alleles. A **diploid** cell (2n) has two sets of chromosomes; a **haploid** cell (n) has one. Human body cells have 2n = 46 (22 pairs of autosomes and two sex chromosomes, XX or XY); human gametes have n = 23.

### The cell cycle

| Phase | What happens |
| --- | --- |
| G1 | the cell grows, makes proteins and organelles, carries out its normal work |
| S | DNA is replicated: each chromosome now has two sister chromatids |
| G2 | further growth; the cell prepares to divide |
| M | mitosis (division of the nucleus) and then cytokinesis (division of the cytoplasm) |

G1, S and G2 together make up **interphase**, by far the longest part of the cycle. Cells that stop dividing, such as most mature neurons, leave the cycle into a resting state, **G0**. **Checkpoints** at the end of G1, at the end of G2 and in metaphase (the spindle checkpoint) let the cycle go on only if conditions are right: DNA intact and fully replicated, chromosomes correctly attached to the spindle. They are run by proteins called cyclins and cyclin-dependent kinases. When the controls fail, cells can divide without restraint, which is the basis of cancer.

### Mitosis

- **Prophase**: chromatin condenses and chromosomes become visible, each as two sister chromatids. The spindle of microtubules forms from the centrosomes; the nucleolus disappears and the nuclear envelope breaks down. Spindle fibres attach to the **kinetochores** at the centromeres.
- **Metaphase**: the chromosomes line up at the equator of the spindle (the metaphase plate).
- **Anaphase**: the centromeres split and the sister chromatids are pulled to opposite poles. From this moment each chromatid counts as a chromosome.
- **Telophase**: the chromosomes reach the poles and decondense, and a nuclear envelope forms around each set.

In **cytokinesis**, an animal cell is pinched in two by a ring of actin filaments (a cleavage furrow); a plant cell builds a **cell plate** from Golgi vesicles, which becomes the new cell wall. Mitosis gives two daughter cells genetically identical to the parent and to each other, with the same chromosome number. It serves growth, repair and asexual reproduction.

### Meiosis

Meiosis has one round of DNA replication followed by two divisions, so it halves the chromosome number and gives four haploid cells.

- **Meiosis I** (the reduction division). In **prophase I**, homologous chromosomes pair up (synapsis), forming **bivalents** (tetrads, four chromatids each). Non-sister chromatids exchange segments at **chiasmata**: **crossing over**. In **metaphase I**, the bivalents line up at the equator, and the way each pair faces the poles is random. In **anaphase I**, the **homologous chromosomes** separate; sister chromatids stay together. Each daughter cell has n chromosomes, each still of two chromatids.
- **Meiosis II** works like mitosis: in anaphase II the **sister chromatids** separate. The result is four haploid cells whose chromosomes have one chromatid each.

Meiosis makes every gamete different in three ways: **crossing over** recombines alleles along a chromosome; **independent assortment** in metaphase I gives $2^n$ possible combinations of maternal and paternal chromosomes ($2^{23}$, about 8.4 million, in humans, before crossing over); and **random fertilisation** joins any of these gametes to any of the other parent's.

### Counting through the stages

For a human cell (2n = 46), with $c$ the DNA content of one haploid set of single-chromatid chromosomes:

| Stage | Chromosomes per cell | Chromatids per cell | DNA |
| --- | --- | --- | --- |
| G1 | 46 | 46 | 2c |
| G2, prophase or metaphase of mitosis | 46 | 92 | 4c |
| anaphase of mitosis (before cytokinesis) | 92 | 92 | 4c |
| each cell after mitosis | 46 | 46 | 2c |
| metaphase I (23 bivalents) | 46 | 92 | 4c |
| each cell after meiosis I | 23 | 46 | 2c |
| each cell after meiosis II | 23 | 23 | c |

The DNA doubles in S phase and halves at each division; the chromosome number changes only when centromeres split (anaphase of mitosis and anaphase II) or when homologues are shared out (anaphase I).

### Mitosis and meiosis compared

| | Mitosis | Meiosis |
| --- | --- | --- |
| divisions | one | two |
| pairing of homologues, crossing over | no | yes, in prophase I |
| daughter cells | two, diploid (if the parent is), identical | four, haploid, genetically different |
| role | growth, repair, asexual reproduction | making gametes (in animals) |

### Nondisjunction

If homologous chromosomes fail to separate in anaphase I, or sister chromatids in anaphase II, some gametes receive an extra chromosome (n + 1) and others lack one (n − 1). Fertilisation by a normal gamete then gives a **trisomy** (2n + 1, as in Down syndrome, three copies of chromosome 21, 47 chromosomes) or a **monosomy** (2n − 1, as in Turner syndrome, 45 chromosomes with a single X). An abnormal number of chromosomes is called **aneuploidy**.
`,
  examples: [
    {
      id: 'example-counting-2n-8',
      title: 'Counting chromosomes and chromatids',
      problemMd: md`A species has 2n = 8. Give the number of chromosomes and chromatids in one cell (a) in metaphase of mitosis, (b) in anaphase of mitosis, (c) in metaphase I of meiosis and (d) in each cell at the end of meiosis I.`,
      steps: [
        md`Start from G1: 8 chromosomes, each one chromatid. After S phase: still 8 chromosomes, now 16 chromatids.`,
        md`(a) Metaphase of mitosis comes before anything separates: 8 chromosomes, 16 chromatids.`,
        md`(b) In anaphase the centromeres split, so each chromatid becomes a chromosome: 16 chromosomes, 16 chromatids in the cell.`,
        md`(c) Metaphase I: the 8 chromosomes are paired in 4 bivalents, but nothing has separated yet: 8 chromosomes, 16 chromatids.`,
        md`(d) Anaphase I separates homologues, not chromatids, so each daughter cell gets 4 chromosomes of two chromatids each: 4 chromosomes, 8 chromatids.`,
      ],
      answerMd: md`(a) 8 and 16; (b) 16 and 16; (c) 8 and 16; (d) 4 and 8. The common error in (d) is 4 and 4, which is the count after meiosis II.`,
    },
    {
      id: 'example-dna-mass',
      title: 'Following the DNA mass',
      problemMd: md`The nucleus of a diploid cell of an animal contains 6 pg of DNA in G1. How much DNA is in the nucleus of (a) the cell in G2, (b) a cell in prophase I of meiosis, (c) a cell just after meiosis I, (d) a gamete?`,
      steps: [
        md`S phase doubles the DNA: (a) G2 has $2 \times 6 = 12$ pg.`,
        md`Meiosis starts after the same replication, and nothing has divided yet in prophase I: (b) 12 pg.`,
        md`Meiosis I shares the replicated DNA between two cells: (c) $12 \div 2 = 6$ pg, with half the chromosomes but each still of two chromatids.`,
        md`Meiosis II halves it again: (d) $6 \div 2 = 3$ pg, half the G1 amount, as expected for a haploid cell.`,
      ],
      answerMd: md`(a) 12 pg, (b) 12 pg, (c) 6 pg, (d) 3 pg. A cell after meiosis I has the same DNA mass as a G1 diploid cell but only half its chromosomes; mixing up chromosome number and DNA mass is the trap.`,
    },
    {
      id: 'example-independent-assortment',
      title: 'Counting chromosome combinations',
      problemMd: md`An organism has 2n = 6. Ignoring crossing over, how many genetically different gametes can it make by independent assortment alone?`,
      steps: [
        md`2n = 6 means n = 3: three pairs of homologues.`,
        md`In metaphase I each pair lines up independently, and either the maternal or the paternal chromosome can go to a given pole: 2 choices per pair.`,
        md`Multiply the choices: $2^3 = 8$.`,
      ],
      answerMd: md`8 different combinations. The tempting wrong answers are 6 (counting chromosomes) and $2^6 = 64$ (using 2n instead of n in the exponent).`,
    },
  ],
  traps: [
    {
      title: 'Counting chromatids as chromosomes',
      md: md`A replicated chromosome with two chromatids is still one chromosome. Count centromeres. The chromosome number doubles only in anaphase of mitosis and anaphase II, when the chromatids separate.`,
    },
    {
      title: 'Thinking meiosis II halves the chromosome number',
      md: md`Meiosis I is the reduction division: it separates homologues and halves the number (46 to 23 in humans). Meiosis II separates sister chromatids, so the number stays 23 while the DNA halves.`,
    },
    {
      title: 'Placing crossing over in the wrong stage',
      md: md`Crossing over happens between non-sister chromatids of paired homologues in prophase I. It does not happen in mitosis, where homologues do not pair, nor in meiosis II.`,
    },
  ],
  check: [
    {
      id: 'check-anaphase-count',
      title: 'Chromosomes in anaphase',
      topic: 'Cell cycle and reproduction',
      stemMd: md`How many chromosomes are present in a human cell during anaphase of mitosis, before cytokinesis?`,
      options: [
        { id: 'A', text: md`23`, note: md`This is the haploid number of a gamete; mitosis does not halve the chromosome number.` },
        { id: 'B', text: md`46`, note: md`This is the number in metaphase, before the centromeres split.` },
        { id: 'C', text: md`69`, note: md`69 would be three haploid sets (triploidy); nothing in mitosis produces it.` },
        { id: 'D', text: md`92`, note: '' },
        { id: 'E', text: md`184`, note: md`This doubles 92 again, counting chromatids as if each separated chromosome still had two.` },
      ],
      answer: 'D',
      workingMd: md`After S phase a human cell has 46 chromosomes of two chromatids each, 92 chromatids. In anaphase the centromeres split, so each of the 92 chromatids is now a chromosome, moving to one pole or the other, until cytokinesis gives each daughter cell 46.`,
      lesson: 'When the centromeres split, the chromatid count becomes the chromosome count.',
    },
    {
      id: 'check-crossing-over-stage',
      title: 'When crossing over happens',
      topic: 'Cell cycle and reproduction',
      stemMd: md`At which stage does crossing over between homologous chromosomes take place?`,
      options: [
        { id: 'A', text: md`Prophase of mitosis`, note: md`Homologous chromosomes do not pair in mitosis, so there is no crossing over between them.` },
        { id: 'B', text: md`Prophase I of meiosis`, note: '' },
        { id: 'C', text: md`Anaphase II of meiosis`, note: md`In anaphase II sister chromatids separate; homologues were already parted in meiosis I.` },
        { id: 'D', text: md`S phase of interphase`, note: md`S phase replicates DNA; the homologues are not paired then.` },
        { id: 'E', text: md`Metaphase II of meiosis`, note: md`In metaphase II single chromosomes line up; homologues are no longer together to exchange segments.` },
      ],
      answer: 'B',
      workingMd: md`Homologues pair during prophase I, forming bivalents, and non-sister chromatids exchange segments at chiasmata. No other stage brings homologues together.`,
      lesson: 'Pairing of homologues, and with it crossing over, belongs to prophase I only.',
    },
    {
      id: 'check-after-meiosis-one',
      title: 'After the first division',
      topic: 'Cell cycle and reproduction',
      stemMd: md`A cell with 2n = 12 undergoes meiosis. How many chromosomes and chromatids does each cell contain at the end of meiosis I?`,
      options: [
        { id: 'A', text: md`6 chromosomes and 6 chromatids`, note: md`This is the count after meiosis II, when the sister chromatids have also separated.` },
        { id: 'B', text: md`12 chromosomes and 24 chromatids`, note: md`This is the cell before meiosis I divides, after DNA replication.` },
        { id: 'C', text: md`6 chromosomes and 12 chromatids`, note: '' },
        { id: 'D', text: md`12 chromosomes and 12 chromatids`, note: md`This is a daughter cell of mitosis, or the cell in G1; meiosis I halves the chromosome number.` },
        { id: 'E', text: md`3 chromosomes and 6 chromatids`, note: md`This halves the number twice; meiosis I halves it only once, from 12 to 6.` },
      ],
      answer: 'C',
      workingMd: md`After replication the cell has 12 chromosomes and 24 chromatids. Anaphase I separates homologous chromosomes without splitting centromeres, so each daughter cell receives 6 chromosomes, each still made of two chromatids: 12 chromatids.`,
      lesson: 'Meiosis I halves the chromosomes; meiosis II halves the chromatids per chromosome.',
    },
  ],
  takeaways: [
    'Interphase (G1, S, G2) is most of the cycle; DNA doubles in S phase, and checkpoints control progress.',
    'Mitosis gives two identical cells with the parent chromosome number; meiosis gives four different haploid cells.',
    'Meiosis I separates homologues and halves the chromosome number; meiosis II separates sister chromatids.',
    'Crossing over (prophase I), independent assortment (metaphase I) and random fertilisation create variation.',
    'Nondisjunction gives gametes with an extra or missing chromosome, leading to trisomy or monosomy.',
  ],
  flashcards: [
    { front: md`Chromosome vs chromatid`, back: md`A chromosome is one DNA molecule with its proteins; after replication it has two identical sister chromatids joined at the centromere and still counts as one chromosome.` },
    { front: md`Phases of the cell cycle`, back: md`G1 (growth), S (DNA replication), G2 (preparation), M (mitosis and cytokinesis); G0 is a resting state outside the cycle.` },
    { front: md`What separates in anaphase of mitosis, anaphase I, anaphase II`, back: md`Mitosis: sister chromatids. Anaphase I: homologous chromosomes. Anaphase II: sister chromatids.` },
    { front: md`Sources of variation in meiosis`, back: md`Crossing over in prophase I, independent assortment in metaphase I ($2^n$ combinations), and random fertilisation.` },
    { front: md`Human chromosome numbers`, back: md`Body cells 2n = 46 (22 pairs of autosomes plus XX or XY); gametes n = 23.` },
    { front: md`Nondisjunction`, back: md`Failure of homologues or sister chromatids to separate; gametes get n + 1 or n − 1 chromosomes, giving trisomy (such as trisomy 21) or monosomy.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-reproduction' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const dnaReplicationAndProteinSynthesisLesson: Lesson = {
  slug: 'dna-replication-and-protein-synthesis',
  title: 'DNA replication and protein synthesis',
  summary: 'Semi-conservative replication and its enzymes, transcription and RNA processing, the genetic code and translation, with sequences worked strand by strand.',
  minutes: 25,
  objectives: [
    'Explain semi-conservative replication, the Meselson–Stahl result and the roles of the replication enzymes.',
    'Transcribe a DNA sequence into mRNA and translate it with a codon table, keeping the 5′ and 3′ ends straight.',
    'Describe RNA processing, the properties of the genetic code and the stages of translation.',
  ],
  teachMd: md`
### The double helix

DNA is two polynucleotide strands wound round each other. The sugar-phosphate backbones are on the outside and the bases pair inside: **adenine with thymine** (two hydrogen bonds) and **guanine with cytosine** (three hydrogen bonds). The strands are **antiparallel**: each has a 5′ end (with a free phosphate) and a 3′ end (with a free hydroxyl group on the sugar), and the two run in opposite directions. Because the pairing is complementary, the sequence of one strand fixes the sequence of the other. DNA rich in G–C pairs needs more energy to separate its strands.

### Semi-conservative replication

When DNA replicates, the two strands separate and each serves as a template for a new strand. Each daughter molecule therefore contains **one old strand and one new strand**: replication is **semi-conservative**.

Meselson and Stahl showed this by growing bacteria on heavy nitrogen (15N) until all their DNA was heavy, then moving them to light nitrogen (14N) and separating DNA by density in a centrifuge:

| Generations in 14N | Bands seen |
| --- | --- |
| 0 | all heavy |
| 1 | all intermediate (hybrid) |
| 2 | half intermediate, half light |
| 3 | one quarter intermediate, three quarters light |

One intermediate band after one generation ruled out conservative replication (which would give a heavy and a light band); the half-and-half result after two generations ruled out a dispersive model (which would give a single band getting lighter).

### The replication enzymes

| Enzyme or protein | Job |
| --- | --- |
| helicase | unwinds the double helix at the replication fork, breaking the hydrogen bonds between bases |
| single-strand binding proteins | keep the separated strands apart |
| topoisomerase | relieves the twisting strain ahead of the fork |
| primase | makes a short RNA primer, because DNA polymerase cannot start a strand from nothing |
| DNA polymerase | adds nucleotides to the 3′ end of the growing strand and proofreads its work |
| DNA ligase | joins DNA fragments by forming phosphodiester bonds |

DNA polymerase can only add to a 3′ end, so new DNA always grows in the **5′ to 3′** direction while the template is read 3′ to 5′. At each fork one new strand, the **leading strand**, is made continuously towards the fork. The other, the **lagging strand**, is made in short pieces, **Okazaki fragments**, each starting from its own primer; the primers are later replaced with DNA and the fragments joined by ligase. A bacterial circular chromosome has one origin of replication; each eukaryotic chromosome has many.

### Transcription

Genes are expressed in two steps: DNA is **transcribed** into RNA, and messenger RNA is **translated** into protein. Three kinds of RNA take part: **mRNA** carries the code, **tRNA** brings amino acids, **rRNA** forms the core of ribosomes. Compared with DNA, RNA has ribose, uracil in place of thymine, and is usually single-stranded.

In eukaryotes transcription takes place in the nucleus. **RNA polymerase** binds to a **promoter**, unwinds a short stretch of DNA and reads one strand, the **template strand**, 3′ to 5′, building mRNA 5′ to 3′ by complementary pairing (A in DNA gives U in RNA). It needs no primer. The other DNA strand, the **coding strand**, has the same sequence as the mRNA, with T in place of U.

Eukaryotic pre-mRNA is then **processed**: a **5′ cap** and a **poly-A tail** at the 3′ end are added, protecting the mRNA and helping its export and translation, and **splicing** removes the non-coding **introns** and joins the **exons**. By joining exons in different combinations (alternative splicing), one gene can give several proteins. Prokaryotic mRNA usually has no introns, and translation can begin while it is still being transcribed.

### The genetic code

Each **codon**, three bases of mRNA, specifies one amino acid. With four bases there are $4^3 = 64$ codons: 61 code for amino acids and 3 are **stop codons** (UAA, UAG, UGA). **AUG** codes for methionine and is the usual **start codon**. The code is:

- **degenerate** (redundant): most amino acids have more than one codon;
- **unambiguous**: each codon specifies only one amino acid;
- **non-overlapping** and read in a fixed frame from the start codon;
- **nearly universal**: the same in almost all organisms, which is why bacteria can make human proteins.

### Translation

Translation happens on **ribosomes** in the cytoplasm, free or on the rough ER. Each **tRNA** carries a specific amino acid, attached by an enzyme that uses ATP, and has an **anticodon** that pairs with a codon, antiparallel: the codon 5′-AUG-3′ pairs with the anticodon 3′-UAC-5′.

- **Initiation**: the small ribosomal subunit binds the mRNA and finds the start codon; the initiator tRNA carrying methionine pairs with it; the large subunit joins.
- **Elongation**: the next tRNA pairs with the following codon; the ribosome joins the growing chain to its amino acid by a peptide bond (a reaction catalysed by the rRNA); the ribosome moves along the mRNA one codon at a time, 5′ to 3′.
- **Termination**: at a stop codon, which no tRNA recognises, a release factor binds and the polypeptide is freed.

Several ribosomes can translate one mRNA at once (a **polysome**).
`,
  examples: [
    {
      id: 'example-meselson-stahl',
      title: 'Predicting density bands',
      problemMd: md`Bacteria whose DNA is entirely heavy (15N) are moved to a medium with only light nitrogen (14N). What bands would appear after two generations if replication were conservative, and what is actually seen?`,
      steps: [
        md`Conservative replication would keep each original double helix intact and make an entirely new one. After one generation: 1 heavy and 1 light molecule per original.`,
        md`After two generations under that model: the heavy molecule is copied again into a light one, and the light ones give more light ones: 1 heavy and 3 light, so a heavy band and a light band.`,
        md`Semi-conservative replication, which is what happens: after one generation every molecule is hybrid (one heavy, one light strand).`,
        md`After two generations each hybrid gives one hybrid and one light molecule: half intermediate, half light.`,
      ],
      answerMd: md`Conservative: a heavy band (one quarter) and a light band (three quarters). Observed: half intermediate, half light, with no heavy band. Saying "all intermediate" describes only the first generation.`,
    },
    {
      id: 'example-transcribe-translate',
      title: 'From template strand to peptide',
      problemMd: md`A DNA template strand reads 3′-TACGGTCAAATT-5′. Write the mRNA and the peptide it codes for. (Codon table entries: AUG = Met, CCA = Pro, GUU = Val, UAA = stop.)`,
      steps: [
        md`The mRNA is complementary and antiparallel to the template, so read the template 3′ to 5′ and write the mRNA 5′ to 3′: T gives A, A gives U, C gives G, G gives C.`,
        md`Base by base: TAC gives AUG, GGT gives CCA, CAA gives GUU, ATT gives UAA. The mRNA is 5′-AUGCCAGUUUAA-3′.`,
        md`Read codons from the 5′ end, starting at AUG: AUG, CCA, GUU, UAA.`,
        md`Translate: Met, Pro, Val, then stop. The stop codon adds no amino acid.`,
      ],
      answerMd: md`mRNA 5′-AUGCCAGUUUAA-3′; peptide Met-Pro-Val. A frequent error is to write T in the mRNA, or to translate four amino acids by treating UAA as an amino acid.`,
    },
    {
      id: 'example-coding-length',
      title: 'How long is the coding sequence?',
      problemMd: md`A polypeptide has 300 amino acids. What is the minimum number of mRNA nucleotides from the start codon to the end of the stop codon, and why is the gene longer still?`,
      steps: [
        md`Each amino acid needs one codon of 3 nucleotides: $300 \times 3 = 900$ nucleotides, including the start codon, which codes for the first methionine.`,
        md`The stop codon codes for no amino acid but is part of the reading frame: $900 + 3 = 903$ nucleotides.`,
        md`The mature mRNA also has untranslated regions at both ends, a cap and a poly-A tail, and the eukaryotic gene contains introns that are removed by splicing, so both are longer than 903 nucleotides.`,
      ],
      answerMd: md`903 nucleotides at the minimum. Answering 900 forgets the stop codon; answering 100 divides instead of multiplying by 3.`,
    },
  ],
  traps: [
    {
      title: 'Writing the mRNA from the wrong strand',
      md: md`The mRNA is complementary to the template strand and identical to the coding strand (with U for T). Before writing anything, check which strand the question gives you.`,
    },
    {
      title: 'Losing the 5′ and 3′ ends',
      md: md`Both DNA polymerase and RNA polymerase build in the 5′ to 3′ direction, reading their template 3′ to 5′. A sequence written in the wrong orientation is a different sequence, and a wrong answer can be exactly that.`,
    },
    {
      title: 'Confusing degenerate with ambiguous',
      md: md`Degenerate means one amino acid can have several codons. Ambiguous would mean one codon had several amino acids, which the code does not allow.`,
    },
  ],
  check: [
    {
      id: 'check-coding-to-mrna',
      title: 'From the coding strand to mRNA',
      topic: 'Genetics',
      stemMd: md`The coding strand of a short stretch of DNA reads 5′-ATGGCA-3′. What is the sequence of the mRNA transcribed from this region?`,
      options: [
        { id: 'A', text: md`3′-UACCGU-5′`, note: md`This is complementary to the coding strand; it would be the mRNA only if the coding strand were the template.` },
        { id: 'B', text: md`5′-AUGGCA-3′`, note: '' },
        { id: 'C', text: md`5′-ATGGCA-3′`, note: md`The sequence is right but it contains thymine, which RNA does not have; RNA has uracil.` },
        { id: 'D', text: md`3′-AUGGCA-5′`, note: md`The bases are right but the ends are reversed; the mRNA runs in the same direction as the coding strand.` },
        { id: 'E', text: md`5′-ACGGUA-3′`, note: md`This reads the coding sequence backwards; it is a different sequence, not the same one turned round.` },
      ],
      answer: 'B',
      workingMd: md`The template strand is the complement of the coding strand, 3′-TACCGT-5′. RNA polymerase builds mRNA complementary to it, 5′ to 3′: 5′-AUGGCA-3′, the coding strand with U in place of T.`,
      lesson: 'mRNA equals the coding strand, same direction, with uracil for thymine.',
    },
    {
      id: 'check-meselson-two-generations',
      title: 'Two generations in light nitrogen',
      topic: 'Genetics',
      stemMd: md`Bacteria with only heavy (15N) DNA are grown for exactly two generations in a medium containing only light nitrogen (14N). Which result do density-gradient centrifugation experiments show?`,
      options: [
        { id: 'A', text: md`All the DNA is heavy.`, note: md`New strands are made from the light nitrogen of the medium, so the DNA cannot stay entirely heavy.` },
        { id: 'B', text: md`All the DNA is intermediate.`, note: md`This is the result after one generation; in the second, hybrid molecules give light ones too.` },
        { id: 'C', text: md`Half the DNA is heavy and half is light.`, note: md`Heavy and light bands together are what conservative replication would give; no fully heavy molecules remain in semi-conservative replication.` },
        { id: 'D', text: md`One quarter of the DNA is intermediate and three quarters is light.`, note: md`This is the result after three generations, not two.` },
        { id: 'E', text: md`Half the DNA is intermediate and half is light.`, note: '' },
      ],
      answer: 'E',
      workingMd: md`After one generation every molecule is hybrid: one heavy strand, one light. In the second generation each hybrid separates; the heavy strand pairs with a new light strand (intermediate) and the light strand with another light strand (light). So half intermediate, half light.`,
      lesson: 'Follow the original strands: each one ends up in exactly one hybrid molecule in every later generation.',
    },
    {
      id: 'check-okazaki-fragments',
      title: 'What Okazaki fragments are',
      topic: 'Genetics',
      stemMd: md`Which statement correctly describes Okazaki fragments?`,
      options: [
        { id: 'A', text: md`Short stretches of DNA made on the lagging strand and later joined by DNA ligase`, note: '' },
        { id: 'B', text: md`RNA primers made only on the leading strand`, note: md`Primers are short RNA pieces, not Okazaki fragments, and the lagging strand needs many of them, one per fragment.` },
        { id: 'C', text: md`Introns removed from pre-mRNA during splicing`, note: md`Introns belong to RNA processing after transcription, not to DNA replication.` },
        { id: 'D', text: md`Pieces of mRNA translated at the same time by several ribosomes`, note: md`Several ribosomes on one mRNA form a polysome; that is translation, not replication.` },
        { id: 'E', text: md`Sections of the double helix unwound by helicase ahead of the fork`, note: md`Helicase unwinds the parent DNA; Okazaki fragments are newly made DNA.` },
      ],
      answer: 'A',
      workingMd: md`DNA polymerase can only extend a 3′ end, so the strand whose template runs the wrong way for continuous synthesis is made in short pieces, each started from an RNA primer. The primers are replaced with DNA and ligase joins the pieces with phosphodiester bonds.`,
      lesson: 'Okazaki fragments exist because DNA polymerase works only 5′ to 3′.',
    },
  ],
  takeaways: [
    'DNA strands are antiparallel and complementary: A with T (two hydrogen bonds), G with C (three).',
    'Replication is semi-conservative; polymerases build 5′ to 3′, so the lagging strand is made as Okazaki fragments joined by ligase.',
    'mRNA is complementary to the template strand and matches the coding strand with U for T; eukaryotic pre-mRNA is capped, tailed and spliced.',
    'The code is a triplet code: 64 codons, 61 for amino acids, 3 stops; degenerate, unambiguous and nearly universal.',
    'Translation runs initiation at AUG, elongation codon by codon, termination at a stop codon.',
  ],
  flashcards: [
    { front: md`Semi-conservative replication`, back: md`Each new DNA molecule has one original strand and one new strand, as shown by Meselson and Stahl with 15N and 14N.` },
    { front: md`Helicase, primase, DNA polymerase, ligase`, back: md`Helicase unwinds; primase lays an RNA primer; DNA polymerase extends 3′ ends and proofreads; ligase joins fragments.` },
    { front: md`Leading vs lagging strand`, back: md`The leading strand is made continuously; the lagging strand is made in Okazaki fragments, each from its own primer, later joined by ligase.` },
    { front: md`Template vs coding strand`, back: md`RNA polymerase reads the template strand; the mRNA has the same sequence as the coding strand, with U in place of T.` },
    { front: md`Eukaryotic mRNA processing`, back: md`A 5′ cap and a 3′ poly-A tail are added and introns are spliced out, joining the exons.` },
    { front: md`Start and stop codons`, back: md`AUG (methionine) is the start codon; UAA, UAG and UGA are stop codons and code for no amino acid.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-genetics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};
