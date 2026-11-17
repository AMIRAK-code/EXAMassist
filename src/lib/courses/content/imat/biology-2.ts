import { md, type Lesson } from '../../types';

/**
 * IMAT biology, part 2: genetics, biotechnology, evolution, human physiology
 * and reproduction. The Italian version is ./it/biology-2.ts.
 */

export const mendelianGeneticsAndPedigreesLesson: Lesson = {
  slug: 'mendelian-genetics-and-pedigrees',
  title: 'Mendelian genetics, crosses and pedigrees',
  summary: 'Predict the offspring of one- and two-gene crosses, handle codominance and sex linkage, and read a pedigree to find how a trait is inherited.',
  minutes: 25,
  objectives: [
    md`Use Mendel's laws, Punnett squares and the product rule to predict genotype and phenotype ratios.`,
    md`Handle incomplete dominance, codominance, multiple alleles and X-linked genes.`,
    md`Read a pedigree, exclude modes of inheritance, and compute probabilities that use what the pedigree already tells you.`,
  ],
  teachMd: md`
### The words you need

A **gene** is a stretch of DNA at a fixed position (its **locus**) on a chromosome. The different versions of a gene are **alleles**. Body cells are diploid, so a person carries two alleles of every gene on the autosomes, one inherited from each parent. The pair of alleles is the **genotype**; the trait you can observe is the **phenotype**. Two identical alleles make a person **homozygous** (AA or aa); two different ones make them **heterozygous** (Aa). A **dominant** allele shows its effect in the heterozygote; a **recessive** allele shows only when no dominant allele is present. By convention the dominant allele takes the capital letter and the recessive allele the same letter in lower case.

### Mendel's two laws

**Segregation.** The two alleles of a gene separate when gametes form, so each gamete carries just one of them. An Aa parent makes A gametes and a gametes in equal numbers. The physical reason is meiosis I, where homologous chromosomes go to opposite poles.

**Independent assortment.** Alleles of different genes go into gametes independently of one another, so an AaBb parent makes AB, Ab, aB and ab gametes in equal proportions. The reason is that each homologous pair lines up at metaphase I in a random orientation. The law holds for genes on different chromosomes. Genes close together on the same chromosome are **linked**: they tend to travel together, and only crossing over separates them.

### Punnett squares and the product rule

A cross between two heterozygotes, Aa × Aa, gives:

| | A | a |
| --- | --- | --- |
| **A** | AA | Aa |
| **a** | Aa | aa |

That is 1 AA : 2 Aa : 1 aa, so 3 dominant phenotypes to 1 recessive. For two or more genes that assort independently, do not draw a 16-box square. Work out each gene on its own and **multiply** the probabilities. In AaBb × AaBb, the chance of showing both dominant traits is $\frac{3}{4} \times \frac{3}{4} = \frac{9}{16}$, which is where the 9 : 3 : 3 : 1 ratio comes from. **Add** probabilities only when one outcome can arise in several mutually exclusive ways.

A **test cross** finds the genotype of an individual with the dominant phenotype: cross it with a homozygous recessive. If any offspring show the recessive trait, the tested parent must be heterozygous, and the expected ratio is 1 : 1.

### When dominance is not simple

- **Incomplete dominance:** the heterozygote is intermediate. Red-flowered × white-flowered snapdragons give pink offspring, and pink × pink gives red, pink and white in the ratio 1 : 2 : 1, so phenotype and genotype ratios coincide.
- **Codominance:** both alleles are fully expressed in the heterozygote.
- **Multiple alleles:** a gene has more than two alleles in the population, although each person still carries only two.

The ABO blood groups show the last two at once. The alleles $I^A$ and $I^B$ are codominant, and both are dominant over $i$.

| Genotype | Blood group |
| --- | --- |
| $I^AI^A$ or $I^Ai$ | A |
| $I^BI^B$ or $I^Bi$ | B |
| $I^AI^B$ | AB |
| $ii$ | O |

### Sex-linked genes

Females are XX and males XY. A gene on the X chromosome has two copies in a female but only one in a male, so a single recessive X-linked allele shows its effect in a male. That is why X-linked recessive conditions, such as haemophilia A and red–green colour blindness, are much more common in males. A father gives his X to every daughter and his Y to every son, so an X-linked allele never passes from father to son, and an affected father's daughters all receive his allele.

### Reading a pedigree

Squares are males, circles females, shaded symbols affected individuals; a horizontal line joins parents and a vertical line leads to their children. Test each mode of inheritance against the chart, assuming the trait appears in everyone with the genotype for it and that no new mutation occurs:

| What you see | What it tells you |
| --- | --- |
| Two unaffected parents with an affected child | The trait is recessive; both parents are carriers (or, if X-linked, the mother is) |
| Every affected child has an affected parent; the trait appears in each generation | Dominant inheritance is likely |
| An affected daughter whose father is unaffected | Not X-linked recessive |
| An affected father with an unaffected daughter | Not X-linked dominant |
| An affected father with an affected son by an unaffected mother who is not a carrier | Not X-linked |

### Probability when you already know something

A pedigree often tells you a person's phenotype, and that rules out some genotypes. Remove the impossible ones before you compute. The commonest case: two carriers, Aa × Aa, have an unaffected child. Among the outcomes AA, Aa, Aa, aa, the aa outcome is excluded, so the unaffected child is a carrier with probability $\frac{2}{3}$, not $\frac{1}{2}$. Remember too that every child is a separate event: a 1-in-4 risk does not mean that one child in every four will be affected.
`,
  examples: [
    {
      id: 'example-two-gene-cross',
      title: 'A cross with two independent genes',
      problemMd: md`In a plant, tall (T) is dominant to short (t) and purple flowers (P) are dominant to white (p). The genes are on different chromosomes. A TtPp plant is crossed with a Ttpp plant. What fraction of the offspring is expected to be tall with white flowers?`,
      steps: [
        md`Split the cross into one cross per gene, which independent assortment allows: Tt × Tt for height and Pp × pp for colour.`,
        md`Height: Tt × Tt gives 1 TT : 2 Tt : 1 tt, so the chance of a tall plant is $\frac{3}{4}$.`,
        md`Colour: Pp × pp gives 1 Pp : 1 pp, so the chance of white flowers (pp) is $\frac{1}{2}$.`,
        md`Both must happen, so multiply: $\frac{3}{4} \times \frac{1}{2} = \frac{3}{8}$.`,
        md`Check by counting: there are $4 \times 2 = 8$ equally likely combinations (four for height, two for colour); the tall ones are TT, Tt, Tt, and each pairs with pp once, so 3 of the 8 are tall and white.`,
      ],
      answerMd: md`$\frac{3}{8}$ of the offspring. The tempting wrong answer is $\frac{3}{16}$, a class of the 9 : 3 : 3 : 1 ratio, which belongs to TtPp × TtPp, not to this cross.`,
    },
    {
      id: 'example-carrier-sibling',
      title: 'An unaffected brother in a recessive pedigree',
      problemMd: md`A condition is autosomal recessive. Two unaffected parents have an affected daughter and an unaffected son. The son has a child with a woman who is known to be a carrier. What is the probability that this child is affected?`,
      steps: [
        md`The affected daughter is aa, so each parent gave her an a allele. Both parents are unaffected, so both are Aa.`,
        md`Aa × Aa gives AA, Aa, Aa and aa, each with probability $\frac{1}{4}$.`,
        md`The son is unaffected, so aa is ruled out for him. Of the three remaining equally likely outcomes, two are Aa: he is a carrier with probability $\frac{2}{3}$.`,
        md`The child can be affected only if the son is Aa and both parents then pass on a: $\frac{2}{3} \times \frac{1}{4} = \frac{1}{6}$.`,
        md`Check by averaging over the son's three equally likely genotypes: AA gives the child no risk, and each Aa gives a risk of $\frac{1}{4}$, so the risk is $\frac{0 + \frac{1}{4} + \frac{1}{4}}{3} = \frac{1}{6}$.`,
      ],
      answerMd: md`The probability is $\frac{1}{6}$. Answers of $\frac{1}{4}$ (assuming the son is surely a carrier) and $\frac{1}{8}$ (giving him a carrier probability of $\frac{1}{2}$) both ignore what his phenotype tells you.`,
    },
    {
      id: 'example-x-linked',
      title: 'An X-linked recessive condition',
      problemMd: md`Haemophilia A is X-linked recessive. A woman who is a carrier ($X^HX^h$) and an unaffected man ($X^HY$) plan a child. What is the probability that the child is a boy with haemophilia? And if the child is a boy, what is the probability that he has haemophilia?`,
      steps: [
        md`List the gametes: the mother gives $X^H$ or $X^h$, each with probability $\frac{1}{2}$; the father gives $X^H$ or $Y$, each with probability $\frac{1}{2}$.`,
        md`The four equally likely children are $X^HX^H$, $X^HX^h$ (daughters) and $X^HY$, $X^hY$ (sons). Only $X^hY$ has haemophilia, so a boy with haemophilia has probability $\frac{1}{4}$.`,
        md`Second route: the child is a boy with probability $\frac{1}{2}$, and a boy receives his mother's $X^h$ with probability $\frac{1}{2}$, so $\frac{1}{2} \times \frac{1}{2} = \frac{1}{4}$.`,
        md`If you already know the child is a boy, only the two sons remain, and one of them is affected: the probability is $\frac{1}{2}$.`,
      ],
      answerMd: md`$\frac{1}{4}$ that the child is an affected boy; $\frac{1}{2}$ that a son is affected. No daughter is affected, but each daughter has a $\frac{1}{2}$ chance of being a carrier. Mixing up the two questions is the usual slip.`,
    },
  ],
  traps: [
    {
      title: md`Giving an unaffected sibling a carrier chance of one half`,
      md: md`When both parents are carriers, a child who is known to be unaffected cannot be aa. The probability that this child is a carrier is $\frac{2}{3}$, not $\frac{1}{2}$. Always strike out the genotypes the phenotype rules out before you divide.`,
    },
    {
      title: md`Answering a different probability question`,
      md: md`"The probability that a child is an affected boy" and "the probability that a son is affected" differ by a factor of 2 in an X-linked cross. The first counts all children; the second counts only sons. Underline who the question is about before you build the square.`,
    },
    {
      title: md`Drawing a 16-box square for every two-gene cross`,
      md: md`Big squares invite counting errors, and they do not fit crosses like AaBb × aaBb at all neatly. If the genes assort independently, treat each gene as its own cross and multiply the results.`,
    },
    {
      title: md`Reading "dominant" as "common"`,
      md: md`Dominance describes how alleles behave in a heterozygote, not how frequent an allele is. A dominant allele can be rare in a population and a recessive one can be very common.`,
    },
  ],
  check: [
    {
      id: 'check-abo-cross',
      title: 'Blood groups from two parents',
      topic: 'Genetics',
      stemMd: md`A woman with blood group A whose father had group O has a child with a man of group B whose mother had group O. What is the probability that their child has blood group O?`,
      options: [
        { id: 'A', text: md`$0$`, note: md`This assumes a group O child needs a group O parent. Both parents carry a hidden $i$ allele from their own group O parent.` },
        { id: 'B', text: md`$\frac{1}{8}$`, note: md`This multiplies in a third factor of one half that the cross does not contain; only two events, one from each parent, are needed.` },
        { id: 'C', text: md`$\frac{1}{4}$`, note: '' },
        { id: 'D', text: md`$\frac{1}{2}$`, note: md`This is the chance that one parent passes on $i$, not the chance that both do.` },
        { id: 'E', text: md`$\frac{3}{4}$`, note: md`This is the probability that the child is **not** group O: the three groups A, B and AB together.` },
      ],
      answer: 'C',
      workingMd: md`Each parent received $i$ from a group O parent, so the woman is $I^Ai$ and the man is $I^Bi$. A group O child needs $i$ from each: $\frac{1}{2} \times \frac{1}{2} = \frac{1}{4}$. The full square confirms it: $I^AI^B$, $I^Ai$, $I^Bi$ and $ii$ are equally likely, so the four blood groups each have probability $\frac{1}{4}$.`,
      lesson: 'Use the relatives in the question to fix each parent\'s genotype before you cross them.',
    },
    {
      id: 'check-pedigree-mode',
      title: 'An affected daughter of unaffected parents',
      topic: 'Genetics',
      stemMd: md`In a pedigree, two unaffected parents have an affected daughter. Assuming the trait appears in everyone with the genotype for it and no new mutation has occurred, which mode of inheritance is consistent with this family?`,
      options: [
        { id: 'A', text: md`Autosomal recessive`, note: '' },
        { id: 'B', text: md`Autosomal dominant`, note: md`An affected child of a dominant trait must have received the allele from a parent, who would then be affected too.` },
        { id: 'C', text: md`X-linked recessive`, note: md`An affected daughter would need an affected allele on her father's only X, so her father would be affected.` },
        { id: 'D', text: md`X-linked dominant`, note: md`A dominant allele must have come from a parent who shows the trait, and neither parent does.` },
        { id: 'E', text: md`Y-linked`, note: md`A daughter has no Y chromosome, so a Y-linked trait cannot appear in her.` },
      ],
      answer: 'A',
      workingMd: md`Both parents are unaffected yet the daughter is affected, so the allele was hidden in both parents: the trait is recessive. It cannot be X-linked recessive, because the daughter's affected allele on her paternal X would make her father affected. Dominant modes need an affected parent, and Y-linked traits never appear in females. Only autosomal recessive inheritance fits, with both parents as carriers.`,
      lesson: 'An affected daughter of an unaffected father rules out X-linked recessive inheritance at once.',
    },
    {
      id: 'check-test-cross',
      title: 'A test cross with two genes',
      topic: 'Genetics',
      stemMd: md`A plant heterozygous for two genes on different chromosomes (AaBb) is crossed with a plant homozygous recessive for both (aabb). Of 400 offspring, how many are expected to show both recessive traits?`,
      options: [
        { id: 'A', text: md`25`, note: md`This uses $\frac{1}{16}$, the share of aabb in AaBb × AaBb, not in a test cross.` },
        { id: 'B', text: md`50`, note: md`This uses $\frac{1}{8}$, as if one of the two genes gave the recessive form with probability $\frac{1}{4}$; in a test cross each gene gives it with probability $\frac{1}{2}$.` },
        { id: 'C', text: md`75`, note: md`This uses $\frac{3}{16}$, a class of the 9 : 3 : 3 : 1 ratio of a cross between two double heterozygotes.` },
        { id: 'D', text: md`100`, note: '' },
        { id: 'E', text: md`225`, note: md`This uses $\frac{9}{16}$, the share showing both **dominant** traits when two double heterozygotes are crossed.` },
      ],
      answer: 'D',
      workingMd: md`The AaBb parent makes AB, Ab, aB and ab gametes in equal numbers; the aabb parent makes only ab. Offspring are AaBb, Aabb, aaBb and aabb, each $\frac{1}{4}$. Gene by gene: aa has probability $\frac{1}{2}$ and bb has probability $\frac{1}{2}$, so aabb has $\frac{1}{4}$. Expected: $\frac{1}{4} \times 400 = 100$.`,
      lesson: 'A two-gene test cross gives four classes in the ratio 1 : 1 : 1 : 1 when the genes assort independently.',
    },
  ],
  takeaways: [
    'Segregation puts one allele of each gene into each gamete; independent assortment shuffles genes on different chromosomes.',
    'For independent genes, solve each gene separately and multiply the probabilities.',
    'Unaffected parents with an affected child mean a recessive trait; an affected daughter of an unaffected father rules out X-linked recessive.',
    md`An unaffected child of two carriers is a carrier with probability $\frac{2}{3}$.`,
  ],
  flashcards: [
    { front: 'Law of segregation', back: 'The two alleles of a gene separate when gametes form, so each gamete carries one allele. Its physical basis is the separation of homologous chromosomes in meiosis I.' },
    { front: 'Law of independent assortment', back: 'Alleles of different genes enter gametes independently, so AaBb makes AB, Ab, aB and ab equally. It holds for genes on different chromosomes, not for closely linked genes.' },
    { front: 'Test cross', back: 'Cross an individual showing the dominant trait with a homozygous recessive. Any recessive offspring prove the tested parent is heterozygous; the expected ratio is then 1 : 1.' },
    { front: 'Codominance versus incomplete dominance', back: 'In codominance both alleles are fully expressed in the heterozygote (blood group AB). In incomplete dominance the heterozygote is intermediate (pink from red and white).' },
    { front: 'Carrier chance of an unaffected child of two carriers', back: md`$\frac{2}{3}$: of the outcomes AA, Aa, Aa and aa, the aa outcome is excluded by the phenotype, and two of the remaining three are carriers.` },
    { front: 'Pedigree signs that rule out X-linked recessive', back: 'An affected daughter whose father is unaffected, or an affected son whose mother is neither affected nor a carrier.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-genetics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const biotechnologyAndGeneticEngineeringLesson: Lesson = {
  slug: 'biotechnology-and-genetic-engineering',
  title: 'Biotechnology and genetic engineering',
  summary: 'Follow how DNA is cut, joined, copied, separated and put into cells, and predict the result of a digest, a PCR run or a plasmid selection.',
  minutes: 22,
  objectives: [
    'Explain how restriction enzymes, ligase, plasmids and reverse transcriptase are used to make recombinant DNA.',
    'Predict the number and order of fragments from a restriction digest and gel electrophoresis, and the number of copies from PCR.',
    'Describe the main applications: transgenic organisms, DNA profiling, gene therapy, CRISPR-Cas9 and cloning.',
  ],
  teachMd: md`
### The toolkit

**Recombinant DNA** is DNA joined together from different sources, such as a human gene inside a bacterial plasmid. Making it needs tools to cut DNA at chosen places, to join pieces, to carry them into a cell, to copy DNA, and to separate and identify the pieces.

### Cutting and joining

**Restriction enzymes** (restriction endonucleases) come from bacteria, where they cut the DNA of invading viruses. Each one recognises a specific short sequence, often a **palindrome**: both strands carry the same sequence when each is read 5' to 3', as GAATTC does, since its complementary strand also reads GAATTC in that direction. Many enzymes cut the two strands at staggered points and leave **sticky ends**, short single-stranded overhangs; others cut straight across and leave blunt ends.

If a gene and a vector are cut with the **same** enzyme, their sticky ends are complementary and pair by hydrogen bonds. **DNA ligase** then seals the sugar–phosphate backbone by forming phosphodiester bonds.

Counting fragments is a favourite question. Cutting a **linear** molecule at $n$ sites gives $n + 1$ fragments; cutting a **circular** one, such as a plasmid, at $n$ sites gives $n$ fragments.

### Vectors and transformation

A **plasmid** is a small circle of DNA that replicates in a bacterium independently of its chromosome. A plasmid used as a vector has an origin of replication, a restriction site where the gene is inserted, and at least one **marker gene**, often for antibiotic resistance. Bacteria take up plasmids by **transformation**, helped in the laboratory by calcium ions with a heat shock or by an electric pulse. Only a small fraction of cells take up a plasmid, and some plasmids close up again without the insert, so two rounds of selection follow: an antibiotic kills cells with no plasmid, and a second marker, disrupted when the gene is inserted into it, picks out the recombinant plasmids. Viruses are used as vectors too, especially to deliver genes into human cells.

### Expressing a human gene in bacteria

Human genes contain **introns**, and bacteria cannot splice them out. So the starting material is the mature mRNA of cells that make the protein, for example the beta cells of the pancreas for insulin. **Reverse transcriptase**, an enzyme from retroviruses, copies the mRNA into **complementary DNA (cDNA)**, which has no introns. The cDNA is placed after a bacterial promoter so the bacterium transcribes it. Human insulin for people with diabetes is produced in this way by genetically modified microorganisms.

### Copying DNA: the polymerase chain reaction

PCR copies a chosen stretch of DNA many times. It needs the template DNA, two **primers** (short single strands that pair with the two ends of the target), free nucleotides, and a heat-stable DNA polymerase such as *Taq* polymerase from the hot-spring bacterium *Thermus aquaticus*. Each cycle has three steps:

| Step | Typical temperature | What happens |
| --- | --- | --- |
| Denaturation | about 95 °C | Hydrogen bonds break and the strands separate |
| Annealing | about 50–65 °C | Primers bind to their complementary sequences |
| Extension | about 72 °C | The polymerase adds nucleotides to the 3' end of each primer |

Each cycle ideally doubles the amount of target DNA, so $N$ molecules become $N \times 2^n$ after $n$ cycles. In practice the efficiency falls in late cycles as reagents run low.

### Separating DNA: gel electrophoresis

DNA is negatively charged because of its phosphate groups, so in an electric field it moves towards the **positive electrode** (the anode). Every piece has about the same charge per unit length, so charge alone does not separate them; the gel does, acting as a mesh that slows long fragments more than short ones. **Short fragments travel furthest** from the wells. A ladder of fragments of known length, run in a lane alongside, lets you read off sizes.

### What the tools are used for

- **DNA profiling.** Regions that vary between people, such as short tandem repeats (sequences repeated a different number of times in different people), are amplified by PCR and separated by size. Every band in a child's profile must come from the mother or the father, which is the basis of paternity testing.
- **Transgenic organisms.** Crops with pest resistance, bacteria and yeasts that make human proteins.
- **Gene therapy.** A working copy of a gene is delivered into a patient's cells, often by a viral vector. Changes made to body (somatic) cells are not inherited.
- **CRISPR-Cas9.** A guide RNA complementary to the target sequence leads the Cas9 nuclease to it, and Cas9 cuts both strands there. The cell's repair of the cut can switch the gene off or insert a new sequence.
- **Cloning.** In somatic cell nuclear transfer, the nucleus of a body cell is put into an egg cell whose own nucleus has been removed; Dolly the sheep was made this way. Embryonic stem cells are pluripotent; most adult stem cells can give rise to only a few cell types.
`,
  examples: [
    {
      id: 'example-digest-fragments',
      title: 'Linear or circular?',
      problemMd: md`A molecule of 6,000 base pairs (bp) has two sites for a restriction enzyme, at positions 500 and 2,000. How many fragments, and of what sizes, does a complete digest give (a) if the molecule is linear, (b) if it is a circular plasmid? Which fragment travels furthest on a gel?`,
      steps: [
        md`Linear: two cuts make three pieces. Their lengths are $500$, $2000 - 500 = 1500$ and $6000 - 2000 = 4000$ bp, which add back to 6,000.`,
        md`Circular: two cuts make only two pieces, because a circle has no free ends. One runs from 500 to 2,000, which is 1,500 bp; the other runs from 2,000 round through the end and back to 500: $4000 + 500 = 4500$ bp. Check: $1500 + 4500 = 6000$.`,
        md`On a gel, fragments separate by length and the shortest moves furthest from the well, towards the positive electrode.`,
      ],
      answerMd: md`Linear: three fragments, 500, 1,500 and 4,000 bp. Circular: two fragments, 1,500 and 4,500 bp. The furthest-travelling band is the 500 bp fragment in the linear digest and the 1,500 bp fragment in the circular one. Counting three fragments for the plasmid is the usual error.`,
    },
    {
      id: 'example-pcr-copies',
      title: 'Copies after a few PCR cycles',
      problemMd: md`A PCR starts with 10 double-stranded copies of a target sequence. Assuming every cycle doubles the target, how many copies are there after 5 cycles?`,
      steps: [
        md`Each cycle doubles the number, so after $n$ cycles the number is $10 \times 2^n$.`,
        md`With $n = 5$: $2^5 = 32$, so $10 \times 32 = 320$.`,
        md`Check by doubling cycle by cycle: 20, 40, 80, 160, 320.`,
      ],
      answerMd: md`320 copies. Multiplying instead of doubling, $10 \times 5 \times 2 = 100$, treats the growth as linear and is the tempting wrong answer.`,
    },
    {
      id: 'example-plasmid-selection',
      title: 'Finding the bacteria with the recombinant plasmid',
      problemMd: md`A plasmid carries genes for resistance to ampicillin and to tetracycline. A human gene is inserted into a restriction site inside the tetracycline-resistance gene, and the plasmids are mixed with bacteria that are sensitive to both antibiotics. Which colonies carry the recombinant plasmid?`,
      steps: [
        md`List the cells that can result: cells with no plasmid, cells with a plasmid that closed without the insert, and cells with the recombinant plasmid.`,
        md`Plate them on ampicillin. Every plasmid carries an intact ampicillin-resistance gene, so cells with either kind of plasmid grow; cells with no plasmid die.`,
        md`Copy the colonies, in the same positions, onto a plate with tetracycline (replica plating). The insert has split the tetracycline-resistance gene, so recombinant cells cannot grow there, while cells with the empty plasmid can.`,
        md`Compare the plates: the colonies wanted are those present on the ampicillin plate and missing from the tetracycline plate.`,
      ],
      answerMd: md`Colonies that grow on ampicillin but not on tetracycline carry the recombinant plasmid. Choosing the colonies that grow on both picks the empty plasmids, because their tetracycline-resistance gene is still intact.`,
    },
  ],
  traps: [
    {
      title: md`Sending DNA to the negative electrode`,
      md: md`DNA carries negative phosphate groups, so it moves towards the positive electrode. And it is the short fragments, not the long ones, that end up furthest from the well.`,
    },
    {
      title: md`Counting plasmid fragments as if the DNA were linear`,
      md: md`$n$ cuts give $n + 1$ fragments only in a linear molecule. A circle cut $n$ times gives $n$ fragments. Check that the fragment lengths add up to the whole molecule.`,
    },
    {
      title: md`Putting a genomic human gene into bacteria`,
      md: md`Bacteria cannot remove introns, so a gene copied straight from human chromosomes gives the wrong protein or none. The cDNA made from mature mRNA by reverse transcriptase is used instead.`,
    },
    {
      title: md`Treating PCR growth as linear`,
      md: md`After $n$ cycles the target is multiplied by $2^n$, not by $2n$. Ten cycles multiply it by 1,024, not by 20.`,
    },
  ],
  check: [
    {
      id: 'check-gel-direction',
      title: 'Where the fragments go',
      topic: 'Biotechnology',
      stemMd: md`A digest gives fragments of 4,000, 1,500 and 300 bp, which are loaded into a well and separated by gel electrophoresis. Which fragment ends up furthest from the well, and towards which electrode do they move?`,
      options: [
        { id: 'A', text: md`The 4,000 bp fragment, towards the positive electrode`, note: md`The direction is right, but the gel slows long fragments most, so the longest one travels the shortest distance.` },
        { id: 'B', text: md`The 300 bp fragment, towards the positive electrode`, note: '' },
        { id: 'C', text: md`The 300 bp fragment, towards the negative electrode`, note: md`The order is right, but DNA is negatively charged by its phosphate groups and so moves towards the positive electrode.` },
        { id: 'D', text: md`The 4,000 bp fragment, towards the negative electrode`, note: md`Both parts are reversed: DNA moves to the positive electrode, and short fragments move furthest.` },
        { id: 'E', text: md`All three travel the same distance, because their charge per unit length is the same`, note: md`Equal charge per unit length is why the field alone cannot separate them; the gel's mesh separates them by length.` },
      ],
      answer: 'B',
      workingMd: md`Phosphate groups make DNA negative, so it migrates towards the positive electrode. All fragments have about the same charge per unit length, so the separation comes from the gel, which slows longer fragments more. The 300 bp fragment travels furthest.`,
      lesson: 'In gel electrophoresis DNA runs to the positive electrode, and the shortest fragment runs furthest.',
    },
    {
      id: 'check-pcr-cycles',
      title: 'Ten PCR cycles',
      topic: 'Biotechnology',
      stemMd: md`A PCR starts with a single double-stranded DNA molecule containing the target sequence. Assuming each cycle doubles the target perfectly, how many double-stranded copies of the target are there after 10 cycles?`,
      options: [
        { id: 'A', text: md`20`, note: md`This is $2 \times 10$: it adds two copies' worth per cycle instead of doubling.` },
        { id: 'B', text: md`100`, note: md`This is $10^2$, which squares the number of cycles instead of raising 2 to that power.` },
        { id: 'C', text: md`512`, note: md`This is $2^9$: one cycle short, as if the first cycle did not double the starting molecule.` },
        { id: 'D', text: md`1,024`, note: '' },
        { id: 'E', text: md`2,048`, note: md`This counts single strands: 1,024 double-stranded copies contain 2,048 strands.` },
      ],
      answer: 'D',
      workingMd: md`One molecule doubles ten times: $1 \times 2^{10} = 1024$. Check by halving back: 1,024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1 is ten halvings.`,
      lesson: md`PCR is exponential: $N$ copies become $N \times 2^n$ after $n$ ideal cycles.`,
    },
    {
      id: 'check-cdna-reason',
      title: 'Why use cDNA?',
      topic: 'Biotechnology',
      stemMd: md`To make a human protein in bacteria, scientists insert cDNA made from the protein's mRNA rather than the gene as it is found on the human chromosome. Why?`,
      options: [
        { id: 'A', text: md`Bacteria have no ribosomes, so they need a DNA copy of the mRNA`, note: md`Bacteria do have ribosomes (70S ones); they translate their own mRNA all the time.` },
        { id: 'B', text: md`Chromosomal human DNA cannot be cut by restriction enzymes`, note: md`Restriction enzymes cut any DNA that contains their recognition sequence, human DNA included.` },
        { id: 'C', text: md`The genetic code used by bacteria is different from the human one`, note: md`The genetic code is almost universal, which is why a bacterium can make a human protein at all.` },
        { id: 'D', text: md`cDNA is single-stranded RNA, which bacteria can translate directly`, note: md`cDNA is DNA, not RNA; it is made by reverse transcriptase and then made double-stranded for cloning.` },
        { id: 'E', text: md`Bacteria cannot remove introns, and cDNA made from mature mRNA has none`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Human genes are split by introns, which are removed from the primary transcript by splicing in the nucleus. Bacteria have no splicing machinery, so they would translate the introns as if they were coding sequence. Mature mRNA has already lost its introns, so the cDNA that reverse transcriptase copies from it encodes the protein without interruption.`,
      lesson: 'Eukaryotic genes go into bacteria as cDNA because bacteria cannot splice.',
    },
  ],
  takeaways: [
    'Cut the gene and the vector with the same restriction enzyme so that the sticky ends match; ligase seals the backbone.',
    md`A linear molecule cut at $n$ sites gives $n + 1$ fragments, a circular one $n$.`,
    md`PCR doubles the target each cycle: $N \times 2^n$ after $n$ cycles.`,
    'In a gel, DNA moves to the positive electrode and short fragments travel furthest.',
    'Bacteria cannot splice, so human genes are inserted as cDNA made by reverse transcriptase.',
  ],
  flashcards: [
    { front: 'Restriction enzyme', back: 'A bacterial enzyme that cuts DNA at a specific recognition sequence, often a palindrome. Many leave sticky ends, short single-stranded overhangs.' },
    { front: 'DNA ligase', back: 'The enzyme that joins DNA fragments by forming phosphodiester bonds in the sugar–phosphate backbone.' },
    { front: 'The three steps of a PCR cycle', back: 'Denaturation at about 95 °C, annealing of primers at about 50–65 °C, extension by a heat-stable polymerase at about 72 °C.' },
    { front: 'Direction and order in gel electrophoresis', back: 'DNA moves to the positive electrode because of its phosphate groups; short fragments travel furthest through the gel.' },
    { front: 'Reverse transcriptase', back: 'A retroviral enzyme that makes complementary DNA (cDNA) from mRNA. cDNA lacks introns, so bacteria can express it.' },
    { front: 'CRISPR-Cas9', back: 'A guide RNA leads the Cas9 nuclease to a matching DNA sequence, where it cuts both strands; the repair of the cut can disable a gene or insert a new sequence.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-genetics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const mutationsEvolutionAndClassificationLesson: Lesson = {
  slug: 'mutations-evolution-and-classification',
  title: 'Mutations, evolution and classification',
  summary: 'Classify mutations by their effect, explain how selection and drift change populations, use Hardy–Weinberg, and place organisms in the taxonomic hierarchy.',
  minutes: 24,
  objectives: [
    'Classify gene, chromosome and genome mutations and predict their effect on a protein or a karyotype.',
    'Explain natural selection, genetic drift and speciation, and use the Hardy–Weinberg equations.',
    'Order the taxonomic ranks and write a species name correctly.',
  ],
  teachMd: md`
### Gene mutations

A **mutation** is a permanent change in the DNA sequence. Mutations arise from copying errors during replication or from **mutagens**: ionising radiation, ultraviolet light and some chemicals. Only mutations in the germ line (the cells that make gametes) pass to offspring; a **somatic** mutation affects the individual and the cells descended from the mutated one.

A **point mutation** changes one nucleotide. Because the genetic code is read in triplets and is **degenerate** (most amino acids have more than one codon), a substitution can have three effects:

| Type | What changes | Typical effect |
| --- | --- | --- |
| Silent | The new codon codes for the same amino acid | None on the protein |
| Missense | The new codon codes for a different amino acid | Anything from none to severe, as in sickle-cell anaemia |
| Nonsense | The new codon is a stop codon | A shortened protein, usually non-functional |

**Insertions and deletions** of one or two nucleotides cause a **frameshift**: every codon after the change is read in a new frame, so the amino acid sequence from that point on is altered and a stop codon usually turns up early. Adding or removing exactly three nucleotides keeps the frame: it adds or removes one amino acid (and, if the change spans two codons, may also alter a neighbouring one).

### Chromosome and genome mutations

Larger changes affect the structure of chromosomes: **deletion** (a segment lost), **duplication** (a segment repeated), **inversion** (a segment reversed) and **translocation** (a segment moved to a non-homologous chromosome). Changes in the **number** of chromosomes usually come from **nondisjunction**, the failure of homologous chromosomes (in meiosis I) or sister chromatids (in meiosis II) to separate. A gamete with an extra or a missing chromosome then gives a zygote with **aneuploidy**: trisomy 21 (Down syndrome, 47 chromosomes), Klinefelter syndrome (47,XXY) or Turner syndrome (45,X). Having whole extra sets of chromosomes is **polyploidy**, common in plants.

### Natural selection

Darwin's argument rests on observations that can each be checked:

1. Organisms produce more offspring than can survive.
2. Individuals of a species vary, and much of the variation is heritable.
3. Individuals whose heritable traits suit the environment survive and reproduce more.
4. So those traits become more common in the next generation.

Selection acts on individuals, but it is **populations** that evolve, as allele frequencies change over generations. A trait acquired during a lifetime, such as a muscle built by training, is not inherited. New variation comes from mutation; meiosis (crossing over and independent assortment) and random fertilisation reshuffle it. Selection can be **directional** (one extreme favoured), **stabilising** (the average favoured, as in human birth weight) or **disruptive** (both extremes favoured).

### Other causes of evolution

- **Genetic drift:** random changes in allele frequency, strongest in small populations. A **bottleneck** (a population shrinks sharply) and the **founder effect** (a few individuals start a new population) are special cases.
- **Gene flow:** migration carries alleles between populations and makes them more alike.
- **Mutation** adds new alleles, slowly.

### Hardy–Weinberg

For a gene with two alleles at frequencies $p$ (dominant) and $q$ (recessive):

$$p + q = 1 \qquad p^2 + 2pq + q^2 = 1$$

$p^2$, $2pq$ and $q^2$ are the frequencies of AA, Aa and aa. The frequencies stay constant from one generation to the next only if the population is very large, mating is random, and there is no mutation, migration or selection. The usual move is to start from $q^2$, the frequency of people showing the recessive trait, because that is the only genotype you can see.

### Species and speciation

In the biological species concept, a **species** is a group of populations whose members can interbreed and produce **fertile** offspring. A male donkey and a female horse produce a mule, which is sterile, so horses and donkeys are separate species. New species form when gene flow between populations stops: **allopatric** speciation follows a geographical barrier; **sympatric** speciation happens in the same place, for example by polyploidy in plants.

Evidence for evolution includes fossils, **homologous structures** (the same basic structure adapted to different uses, like the forelimbs of humans, whales and bats, showing common ancestry), vestigial structures, and comparisons of DNA and protein sequences. **Analogous structures**, like the wings of insects and birds, do the same job but evolved separately, so they are not evidence of close kinship.

### Classification

Living things are grouped in nested ranks, from the most inclusive to the least: **domain, kingdom, phylum, class, order, family, genus, species**. There are three domains: **Bacteria**, **Archaea** and **Eukarya**. Organisms that share a rank share every rank above it. Each species has a two-part (binomial) name, introduced by Linnaeus: the genus with a capital letter, then the specific name in lower case, both in italics, as in *Homo sapiens*.
`,
  examples: [
    {
      id: 'example-mutation-types',
      title: 'Three changes to one gene',
      problemMd: md`The coding part of an mRNA begins AUG UUU UGG GGC..., where AUG is the start codon (AUG codes for methionine, UUU and UUC for phenylalanine, UGG for tryptophan; UGA is a stop codon). Classify each change: (a) UUU becomes UUC; (b) UGG becomes UGA; (c) the U at the start of the third codon is deleted.`,
      steps: [
        md`(a) UUC still codes for phenylalanine, so the protein is unchanged: a **silent** mutation, possible because the code is degenerate.`,
        md`(b) UGA is a stop codon, so translation ends after phenylalanine: a **nonsense** mutation giving a protein two amino acids long instead of the full length.`,
        md`(c) Removing one base shifts the reading frame. The sequence now reads AUG UUU GGG GC..., so from the third codon onwards every codon is read in the new frame: a **frameshift**.`,
        md`Check (c) by counting: one deleted base is not a multiple of three, so the frame is not restored, and all the downstream codons are read in the shifted frame.`,
      ],
      answerMd: md`(a) silent, (b) nonsense, (c) frameshift. Calling (b) a missense mutation is the common slip: a missense mutation swaps one amino acid, whereas a stop codon cuts the protein short.`,
    },
    {
      id: 'example-hardy-weinberg',
      title: 'How common are carriers?',
      problemMd: md`An autosomal recessive condition affects 1 person in 2,500 in a population in Hardy–Weinberg equilibrium. What fraction of the population are carriers?`,
      steps: [
        md`Affected people are aa, so $q^2 = \frac{1}{2500}$.`,
        md`Take the square root: $q = \frac{1}{50} = 0.02$. Then $p = 1 - q = 0.98$.`,
        md`Carriers are Aa, with frequency $2pq = 2 \times 0.98 \times 0.02 = 0.0392$.`,
        md`Check with an approximation: when $q$ is small, $p \approx 1$, so $2pq \approx 2q = 0.04$, which agrees. That is about 1 person in 25.`,
      ],
      answerMd: md`About $3.9\%$ of people, roughly 1 in 25, are carriers, far more than the 1 in 2,500 who are affected. Answering $q = 0.02$ gives the frequency of the allele, not of carriers.`,
    },
    {
      id: 'example-nondisjunction',
      title: 'Nondisjunction in meiosis I',
      problemMd: md`During meiosis I in a woman, the two copies of chromosome 21 fail to separate. What chromosome numbers can the gametes from this division have, and what numbers result if one of them is fertilised by a normal sperm?`,
      steps: [
        md`Normally each gamete gets one chromosome 21 and 23 chromosomes in all.`,
        md`If both homologues go to the same pole in meiosis I, one secondary cell has two chromosome 21s and the other has none. Meiosis II then separates chromatids normally.`,
        md`So the gametes have 24 chromosomes (two 21s) or 22 (no 21). None is normal.`,
        md`Add the 23 chromosomes of a normal sperm: $24 + 23 = 47$ (trisomy 21) or $22 + 23 = 45$ (monosomy 21).`,
      ],
      answerMd: md`Gametes with 24 or 22 chromosomes; zygotes with 47 (trisomy 21, Down syndrome) or 45. Nondisjunction in meiosis II instead would leave half the products of meiosis normal.`,
    },
  ],
  traps: [
    {
      title: md`Calling every mutation harmful`,
      md: md`Many mutations are silent or neutral, and a few are beneficial; that is what selection acts on. Judge a mutation by its effect on the protein, not by the word "mutation".`,
    },
    {
      title: md`Thinking individuals evolve`,
      md: md`An animal that stretches or trains does not pass the change on. Evolution is a change in the allele frequencies of a population across generations; selection only sorts the variation that is already heritable.`,
    },
    {
      title: md`Using q when the question asks for carriers`,
      md: md`From $q^2$ you get $q$, the allele frequency. Carriers are $2pq$. Write down which of $p$, $q$, $p^2$, $2pq$ and $q^2$ the question wants before you calculate.`,
    },
    {
      title: md`Taking analogous structures as evidence of kinship`,
      md: md`Wings of birds and insects do the same job but are built differently: that is convergent evolution. Homologous structures, built on the same plan, are the evidence of common ancestry.`,
    },
  ],
  check: [
    {
      id: 'check-frameshift',
      title: 'Which mutation changes the most?',
      topic: 'Mutations and evolution',
      stemMd: md`Which mutation in the coding sequence of a gene is most likely to change the identity of most of the amino acids encoded after the mutation site?`,
      options: [
        { id: 'A', text: md`A substitution in the third base of a codon that gives a codon for the same amino acid`, note: md`This is a silent mutation: the amino acid stays the same, and nothing downstream changes.` },
        { id: 'B', text: md`The deletion of a single nucleotide near the start of the coding sequence`, note: '' },
        { id: 'C', text: md`The deletion of three consecutive nucleotides that form one codon`, note: md`Removing three bases keeps the reading frame: one amino acid is lost and the rest are unchanged.` },
        { id: 'D', text: md`A substitution that turns a codon into a stop codon`, note: md`A nonsense mutation stops translation, so the downstream amino acids are missing, not changed into others.` },
        { id: 'E', text: md`A substitution that turns one codon into a codon for a different amino acid`, note: md`A missense mutation changes one amino acid only; the reading frame is untouched.` },
      ],
      answer: 'B',
      workingMd: md`A single deleted nucleotide shifts the reading frame, so every codon after it is read differently and the amino acids from there on change (until an early stop codon is usually met). Silent, missense and in-frame changes affect at most one amino acid, and a nonsense mutation removes the downstream amino acids rather than changing them.`,
      lesson: 'Only a frameshift alters every codon after the mutation; in-frame changes stay local.',
    },
    {
      id: 'check-hardy-weinberg',
      title: 'Heterozygotes from a phenotype frequency',
      topic: 'Mutations and evolution',
      stemMd: md`In a population in Hardy–Weinberg equilibrium, 16% of individuals show a recessive phenotype. What is the frequency of heterozygotes?`,
      options: [
        { id: 'A', text: md`0.16`, note: md`This is $q^2$, the frequency of the recessive homozygotes already given.` },
        { id: 'B', text: md`0.24`, note: md`This is $pq = 0.6 \times 0.4$; the heterozygote frequency is twice that.` },
        { id: 'C', text: md`0.36`, note: md`This is $p^2$, the frequency of the dominant homozygotes.` },
        { id: 'D', text: md`0.40`, note: md`This is $q$, the frequency of the recessive allele, not of a genotype.` },
        { id: 'E', text: md`0.48`, note: '' },
      ],
      answer: 'E',
      workingMd: md`$q^2 = 0.16$, so $q = 0.4$ and $p = 0.6$. Heterozygotes: $2pq = 2 \times 0.6 \times 0.4 = 0.48$. Check that the genotypes add to 1: $0.36 + 0.48 + 0.16 = 1$.`,
      lesson: md`Start from $q^2$, take the root, then build $p$, $p^2$ and $2pq$; check that they add to 1.`,
    },
    {
      id: 'check-taxonomy',
      title: 'Same order, different families',
      topic: 'Mutations and evolution',
      stemMd: md`Two animal species belong to the same order but to different families. Which statement must be true?`,
      options: [
        { id: 'A', text: md`They belong to the same class.`, note: '' },
        { id: 'B', text: md`They belong to the same genus.`, note: md`A genus sits inside a family, so species in different families cannot share a genus.` },
        { id: 'C', text: md`They belong to different phyla.`, note: md`Sharing an order means sharing every rank above it, phylum included.` },
        { id: 'D', text: md`They belong to different classes.`, note: md`The class is above the order, so species in one order are in one class.` },
        { id: 'E', text: md`They belong to different kingdoms.`, note: md`Kingdom is above order; both species are in the same kingdom, here the animals.` },
      ],
      answer: 'A',
      workingMd: md`The ranks run domain, kingdom, phylum, class, order, family, genus, species, each nested inside the one before it. Two species in the same order therefore share its class, phylum, kingdom and domain. Being in different families, they must also be in different genera.`,
      lesson: 'Organisms that share a rank share every rank above it, and differ at every rank below the one where they split.',
    },
  ],
  takeaways: [
    'Substitutions can be silent, missense or nonsense; insertions or deletions that are not multiples of three cause frameshifts.',
    'Nondisjunction gives gametes with an extra or missing chromosome, and so trisomies and monosomies.',
    'Selection acts on heritable variation in individuals; populations evolve, through selection, drift, gene flow and mutation.',
    md`Hardy–Weinberg: start from $q^2$, the recessive phenotype, and carriers are $2pq$.`,
    'Domain, kingdom, phylum, class, order, family, genus, species; names are written as Genus species.',
  ],
  flashcards: [
    { front: 'Silent, missense and nonsense mutations', back: 'Silent: the new codon codes for the same amino acid. Missense: a different amino acid. Nonsense: a stop codon, so the protein is cut short.' },
    { front: 'Frameshift', back: 'The insertion or deletion of a number of nucleotides that is not a multiple of three; every codon after it is read in a new frame.' },
    { front: 'Nondisjunction', back: 'The failure of homologous chromosomes (meiosis I) or sister chromatids (meiosis II) to separate, giving gametes with one chromosome too many or too few.' },
    { front: 'Hardy–Weinberg equations and conditions', back: md`$p + q = 1$ and $p^2 + 2pq + q^2 = 1$. They hold in a very large, randomly mating population with no mutation, migration or selection.` },
    { front: 'Genetic drift', back: 'Random change in allele frequencies, strongest in small populations; bottlenecks and the founder effect are examples.' },
    { front: 'The taxonomic ranks in order', back: 'Domain, kingdom, phylum, class, order, family, genus, species, from the most inclusive to the least.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-evolution-ecology' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const tissuesCirculationAndRespirationLesson: Lesson = {
  slug: 'tissues-circulation-and-respiration',
  title: 'Tissues, circulation and respiration',
  summary: 'Know the four tissue types, trace blood through the heart and both circuits, and explain ventilation, gas exchange and how blood carries oxygen and CO₂.',
  minutes: 24,
  objectives: [
    'Name the four basic tissue types and recognise their main subtypes.',
    'Trace the path of blood through the heart, valves and vessels, and calculate cardiac output.',
    'Explain ventilation, gas exchange in the alveoli and the transport of oxygen and carbon dioxide.',
  ],
  teachMd: md`
### The four tissue types

A **tissue** is a group of similar cells, with the material between them, doing one job. Every organ is built from four types.

| Tissue | Features | Examples |
| --- | --- | --- |
| Epithelial | Sheets of tightly joined cells on a basement membrane; no blood vessels of its own; classed as squamous, cuboidal or columnar, simple (one layer) or stratified (several) | Lining of the alveoli (simple squamous), epidermis (stratified squamous), gut lining (simple columnar) |
| Connective | Cells scattered in an extracellular matrix of fibres and ground substance | Loose and dense connective tissue, adipose tissue, cartilage, bone, blood |
| Muscle | Cells that contract | Skeletal (striated, voluntary, multinucleate), cardiac (striated, involuntary, joined by intercalated discs), smooth (not striated, involuntary, in vessel and gut walls) |
| Nervous | Neurons, which carry impulses, and glial cells, which support them | Brain, spinal cord, nerves |

### The heart and the double circulation

Humans have a **double circulation**: blood passes through the heart twice on each full circuit. The **pulmonary circulation** takes blood to the lungs and back; the **systemic circulation** takes it to the rest of the body and back. The path through the heart is:

venae cavae → right atrium → tricuspid valve → right ventricle → pulmonary valve → pulmonary artery → lungs → pulmonary veins → left atrium → bicuspid (mitral) valve → left ventricle → aortic valve → aorta → body

The **atrioventricular valves** (tricuspid and bicuspid) stop backflow into the atria when the ventricles contract; the **semilunar valves** (pulmonary and aortic) stop backflow into the ventricles when they relax. The left ventricle has a much thicker wall than the right, because it pumps blood round the whole body against a higher resistance; both ventricles pump the same volume per beat.

Arteries are defined by direction, not by oxygen: they carry blood **away from** the heart, and veins carry it **towards** it. So the pulmonary artery carries deoxygenated blood and the pulmonary veins carry oxygenated blood.

The heartbeat starts in the heart itself. The **sinoatrial (SA) node** in the wall of the right atrium is the pacemaker. Its impulse spreads over both atria, which contract; the **atrioventricular (AV) node** delays it briefly, so the atria finish emptying, then passes it down the **bundle of His** and the **Purkinje fibres**, so the ventricles contract from the apex upwards. The autonomic nervous system changes the rate: sympathetic nerves and adrenaline speed it up, the vagus nerve slows it.

$$\text{cardiac output} = \text{heart rate} \times \text{stroke volume}$$

### Vessels and blood

**Arteries** have thick walls with elastic tissue and smooth muscle to withstand and smooth out high pressure. **Capillaries** have walls one cell thick (endothelium), which is where exchange with the tissues happens. **Veins** have thinner walls, a wider lumen, low pressure, and **valves** that stop backflow; the squeezing of skeletal muscles helps return blood to the heart.

Blood is about 55% plasma (water carrying glucose, ions, proteins, hormones, urea and CO₂) and about 45% cells. **Red blood cells** have no nucleus in mammals and are packed with **haemoglobin**; **white blood cells** defend the body; **platelets** are cell fragments that start clotting.

### Ventilation

Air passes through the nose, pharynx, larynx, trachea, bronchi and bronchioles to the **alveoli**. Rings of cartilage hold the trachea open.

**Inspiration** is active. The **diaphragm contracts and flattens**, and the external intercostal muscles contract and lift the ribs up and out. The volume of the thorax rises, so the pressure in the lungs falls below atmospheric pressure, and air flows in. **Quiet expiration** is passive: the muscles relax, elastic recoil reduces the volume, the pressure rises above atmospheric, and air flows out. In forced expiration the internal intercostals and abdominal muscles also contract.

### Gas exchange and transport

Oxygen and CO₂ cross the alveolar wall by **diffusion**, down their concentration (partial pressure) gradients. Exchange is fast because the surface is huge, the barrier is two thin cells (alveolar wall and capillary wall), and ventilation and blood flow keep the gradients steep. A **surfactant** lowers surface tension so that alveoli do not collapse.

- **Oxygen** is carried almost entirely bound to haemoglobin, each molecule of which can carry four O₂.
- **Carbon dioxide** is carried mostly as **hydrogencarbonate ions** (HCO₃⁻) in the plasma, made inside red blood cells by the enzyme **carbonic anhydrase**: CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻. Smaller shares travel dissolved and bound to haemoglobin.

The **Bohr effect**: more CO₂ and more H⁺ (lower pH) lower haemoglobin's affinity for oxygen, shifting the dissociation curve to the right; a higher temperature has the same effect. Active tissues, which make these conditions, therefore receive more oxygen. The breathing rate is set by the medulla oblongata, which responds above all to a rise in CO₂ in the blood, detected through the fall in pH.
`,
  examples: [
    {
      id: 'example-cardiac-output',
      title: 'Cardiac output at rest and in exercise',
      problemMd: md`At rest, a person's heart rate is 70 beats per minute and the stroke volume is 70 mL. During hard exercise the heart rate is 150 beats per minute and the stroke volume is 110 mL. Find the cardiac output in each case, and by roughly what factor it rises.`,
      steps: [
        md`Cardiac output is heart rate times stroke volume. At rest: $70 \times 70 = 4900$ mL per minute, which is 4.9 L per minute.`,
        md`In exercise: $150 \times 110 = 16\,500$ mL per minute, which is 16.5 L per minute.`,
        md`Ratio: $\frac{16.5}{4.9} \approx 3.4$.`,
        md`Check the ratio a second way, factor by factor: the rate rises by $\frac{150}{70} \approx 2.14$ and the stroke volume by $\frac{110}{70} \approx 1.57$; $2.14 \times 1.57 \approx 3.4$.`,
      ],
      answerMd: md`4.9 L per minute at rest and 16.5 L per minute in exercise, about 3.4 times as much. Adding the two increases instead of multiplying underestimates the rise.`,
    },
    {
      id: 'example-blood-path',
      title: 'From a leg vein back to the leg',
      problemMd: md`A red blood cell is in a vein of the left leg. List, in order, the heart chambers and valves it passes before it reaches the capillaries of the left leg again, and say how many heart valves it crosses.`,
      steps: [
        md`Leg veins drain into the inferior vena cava, which enters the right atrium.`,
        md`Right atrium → tricuspid valve → right ventricle → pulmonary valve → pulmonary artery → capillaries of the lungs, where the cell picks up oxygen.`,
        md`Pulmonary veins → left atrium → bicuspid (mitral) valve → left ventricle → aortic valve → aorta → arteries of the leg → leg capillaries.`,
        md`Count the valves: tricuspid, pulmonary, bicuspid, aortic. The double circulation means every cell passes all four.`,
      ],
      answerMd: md`Right atrium, right ventricle, (lungs), left atrium, left ventricle; four valves. Going straight from the right side of the heart to the aorta, missing the lungs, is the error to avoid: in the adult heart the two sides are separate.`,
    },
    {
      id: 'example-bohr-effect',
      title: 'What exercising muscle does to haemoglobin',
      problemMd: md`During exercise a leg muscle produces more CO₂ and heat, and the pH of its tissue fluid falls. Predict the effect on the oxygen the muscle receives from haemoglobin, and on the breathing rate.`,
      steps: [
        md`In red blood cells, carbonic anhydrase turns the extra CO₂ into H₂CO₃, which gives H⁺ and HCO₃⁻; the H⁺ lowers the pH.`,
        md`H⁺, CO₂ and a higher temperature all lower haemoglobin's affinity for oxygen: the dissociation curve shifts to the right (the Bohr effect, for the CO₂ and H⁺ part).`,
        md`At the partial pressure of oxygen in the muscle, haemoglobin is therefore less saturated than it would otherwise be, so it unloads more oxygen there.`,
        md`The rise in blood CO₂ and fall in pH are detected by chemoreceptors; the medulla raises the rate and depth of breathing, which removes CO₂ and brings in more O₂.`,
      ],
      answerMd: md`The muscle receives more oxygen, because haemoglobin releases O₂ more readily in warm, acidic, CO₂-rich tissue, and breathing becomes faster and deeper. Predicting that low pH makes haemoglobin hold oxygen more tightly gets the Bohr effect backwards.`,
    },
  ],
  traps: [
    {
      title: md`Defining arteries by oxygen`,
      md: md`Arteries carry blood away from the heart, veins towards it, whatever their oxygen content. The pulmonary artery carries deoxygenated blood and the pulmonary veins oxygenated blood; the umbilical vessels in a fetus are another exception to "arteries are red".`,
    },
    {
      title: md`Reading left and right off the page`,
      md: md`Heart diagrams are drawn as if you face the person, so the heart's left side is on the right of the page. Find the thick-walled ventricle and the aorta to orient yourself.`,
    },
    {
      title: md`Getting the diaphragm backwards`,
      md: md`When the diaphragm contracts it flattens and moves down, enlarging the thorax: that is inspiration. A domed diaphragm is a relaxed one. Air always moves from higher to lower pressure.`,
    },
    {
      title: md`Putting most CO₂ on haemoglobin`,
      md: md`Most carbon dioxide travels in the plasma as hydrogencarbonate ions, made in red blood cells by carbonic anhydrase. Only a minority is bound to haemoglobin.`,
    },
  ],
  check: [
    {
      id: 'check-vessel-deoxygenated',
      title: 'Deoxygenated blood leaving the heart',
      topic: 'Anatomy and physiology',
      stemMd: md`Which vessel carries deoxygenated blood away from the heart in a healthy adult?`,
      options: [
        { id: 'A', text: md`The aorta`, note: md`The aorta leaves the left ventricle carrying oxygenated blood to the body.` },
        { id: 'B', text: md`The pulmonary vein`, note: md`The pulmonary veins carry oxygenated blood from the lungs **to** the heart.` },
        { id: 'C', text: md`The pulmonary artery`, note: '' },
        { id: 'D', text: md`The inferior vena cava`, note: md`It carries deoxygenated blood, but towards the heart, not away from it.` },
        { id: 'E', text: md`A coronary artery`, note: md`The coronary arteries branch from the aorta and carry oxygenated blood to the heart muscle.` },
      ],
      answer: 'C',
      workingMd: md`Blood leaving the heart travels in arteries. Of the two great arteries, the aorta carries oxygenated blood from the left ventricle, and the pulmonary artery carries deoxygenated blood from the right ventricle to the lungs.`,
      lesson: 'Vessels are named by direction; the pulmonary artery is the artery that carries deoxygenated blood.',
    },
    {
      id: 'check-inspiration',
      title: 'Breathing in',
      topic: 'Anatomy and physiology',
      stemMd: md`Which sequence describes quiet inspiration?`,
      options: [
        { id: 'A', text: md`The diaphragm contracts and flattens, the volume of the thorax increases, and the pressure in the lungs falls below atmospheric pressure`, note: '' },
        { id: 'B', text: md`The diaphragm relaxes and domes upwards, the volume of the thorax increases, and air is drawn in`, note: md`A relaxing diaphragm domes upwards and **reduces** the volume of the thorax; that is expiration.` },
        { id: 'C', text: md`The diaphragm contracts, the volume of the thorax increases, and the pressure in the lungs rises above atmospheric pressure`, note: md`A larger volume lowers the pressure; air flows in because the lung pressure falls below atmospheric, not above it.` },
        { id: 'D', text: md`The smooth muscle of the bronchioles contracts and pumps air into the alveoli`, note: md`Bronchioles do not pump air; contraction of their smooth muscle narrows them and makes breathing harder.` },
        { id: 'E', text: md`The internal intercostal muscles contract and pull the ribs down and in, enlarging the thorax`, note: md`Pulling the ribs down and in shrinks the thorax; the internal intercostals act in forced expiration.` },
      ],
      answer: 'A',
      workingMd: md`In inspiration the diaphragm contracts and flattens and the external intercostals raise the ribs. The thorax enlarges, the pressure inside the lungs drops below atmospheric pressure, and air flows in down the pressure gradient.`,
      lesson: 'Volume up, pressure down, air in: the muscles change the volume and the pressure follows.',
    },
    {
      id: 'check-stroke-volume',
      title: 'Finding the stroke volume',
      topic: 'Anatomy and physiology',
      stemMd: md`A person's cardiac output is 5.6 L per minute and the heart rate is 80 beats per minute. What is the stroke volume?`,
      options: [
        { id: 'A', text: md`0.07 mL`, note: md`$\frac{5.6}{80} = 0.07$ is in litres; the unit was not converted to millilitres.` },
        { id: 'B', text: md`7 mL`, note: md`A decimal slip: 0.07 L is 70 mL, not 7 mL.` },
        { id: 'C', text: md`14.3 mL`, note: md`This divides the heart rate by the cardiac output, $\frac{80}{5.6}$, the ratio upside down.` },
        { id: 'D', text: md`70 mL`, note: '' },
        { id: 'E', text: md`448 mL`, note: md`This multiplies cardiac output by heart rate, $5.6 \times 80$, instead of dividing.` },
      ],
      answer: 'D',
      workingMd: md`Stroke volume is cardiac output divided by heart rate: $\frac{5.6\ \text{L}}{80} = 0.07$ L $= 70$ mL. Check: $80 \times 70$ mL $= 5600$ mL $= 5.6$ L per minute.`,
      lesson: 'Rearrange cardiac output = heart rate × stroke volume, and convert litres to millilitres at the end.',
    },
  ],
  takeaways: [
    'Four tissue types: epithelial, connective, muscle and nervous.',
    'Right heart to the lungs, left heart to the body; four valves keep the flow one way.',
    'Cardiac output = heart rate × stroke volume.',
    'Inspiration is active: the diaphragm contracts and flattens, the thorax enlarges, the pressure falls and air flows in.',
    'Oxygen travels on haemoglobin; most CO₂ travels as hydrogencarbonate; more CO₂, acid and heat make haemoglobin release oxygen.',
  ],
  flashcards: [
    { front: 'The four basic tissue types', back: 'Epithelial, connective, muscle and nervous tissue.' },
    { front: 'The three kinds of muscle tissue', back: 'Skeletal: striated, voluntary, multinucleate. Cardiac: striated, involuntary, with intercalated discs. Smooth: not striated, involuntary.' },
    { front: 'Path of blood from the venae cavae to the aorta', back: 'Right atrium, tricuspid valve, right ventricle, pulmonary valve, pulmonary artery, lungs, pulmonary veins, left atrium, bicuspid valve, left ventricle, aortic valve, aorta.' },
    { front: 'Pacemaker and conduction system of the heart', back: 'The sinoatrial node starts each beat; the atrioventricular node delays it, then the bundle of His and Purkinje fibres carry it through the ventricles.' },
    { front: 'How most CO₂ is carried in blood', back: 'As hydrogencarbonate ions in the plasma, formed in red blood cells by carbonic anhydrase from CO₂ and water.' },
    { front: 'Bohr effect', back: 'More CO₂ and H⁺ lower haemoglobin\'s affinity for oxygen, shifting the dissociation curve to the right, so active tissues receive more oxygen.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-anatomy-physiology' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const nervousEndocrineAndImmuneSystemsLesson: Lesson = {
  slug: 'nervous-endocrine-and-immune-systems',
  title: 'Nervous, endocrine and immune systems',
  summary: 'How nerve impulses and synapses work, how hormones and negative feedback control the body, and how innate and adaptive immunity defend it.',
  minutes: 25,
  objectives: [
    'Explain the resting potential, the action potential and transmission at a synapse.',
    'Describe how hormones act and how negative feedback controls blood glucose and thyroid hormone.',
    'Distinguish innate from adaptive immunity, B cells from T cells, and active from passive immunity.',
  ],
  teachMd: md`
### How the nervous system is organised

The **central nervous system** (CNS) is the brain and spinal cord; the **peripheral nervous system** is the nerves that connect it to the body. Peripheral nerves carry sensory (afferent) fibres into the CNS and motor (efferent) fibres out of it. The motor side has a **somatic** part, controlling skeletal muscle, and an **autonomic** part, controlling smooth muscle, cardiac muscle and glands.

| | Sympathetic ("fight or flight") | Parasympathetic ("rest and digest") |
| --- | --- | --- |
| Heart rate | Rises | Falls |
| Pupils | Dilate | Constrict |
| Bronchioles | Dilate | Constrict |
| Digestion | Slowed | Promoted |

### The neuron and the action potential

A neuron receives signals on its **dendrites** and cell body and sends them along its **axon**. Many axons are wrapped in **myelin**, made by Schwann cells in the peripheral nervous system and by oligodendrocytes in the CNS. The gaps in the myelin, the **nodes of Ranvier**, let the impulse jump from node to node (**saltatory conduction**), which is much faster.

At rest the inside of the membrane is about −70 mV relative to the outside. The **sodium–potassium pump** uses ATP to move 3 Na⁺ out for every 2 K⁺ in, and the membrane leaks K⁺ outwards more than it leaks Na⁺ inwards, which leaves the inside negative.

When a stimulus brings the membrane to **threshold**, voltage-gated Na⁺ channels open, Na⁺ rushes in and the inside becomes positive (**depolarisation**, to about +30 to +40 mV). The Na⁺ channels then close and voltage-gated K⁺ channels open, K⁺ flows out and the potential falls back (**repolarisation**), briefly overshooting below the resting value (**hyperpolarisation**). During the **refractory period** the patch of membrane cannot fire again, so the impulse travels one way only.

The action potential is **all-or-none**: once threshold is reached, its size is fixed. A stronger stimulus produces impulses at a **higher frequency**, not bigger ones.

### Synapses

When the impulse reaches the axon terminal, voltage-gated **Ca²⁺ channels** open and Ca²⁺ enters. It triggers the exocytosis of vesicles of **neurotransmitter**, for example acetylcholine, into the synaptic cleft. The transmitter diffuses across and binds receptors on the postsynaptic membrane, opening ion channels there. It is then removed, by an enzyme (**acetylcholinesterase** breaks down acetylcholine) or by reuptake into the presynaptic cell. Synapses pass signals one way, because only the presynaptic side releases transmitter and only the postsynaptic side has receptors.

A **reflex arc** (receptor → sensory neuron → relay neuron in the spinal cord → motor neuron → effector) gives a fast response that does not wait for the brain.

### Hormones

Endocrine glands release **hormones** into the blood, which reach every cell; only cells with the matching **receptor** respond. Peptide hormones such as insulin cannot cross the membrane: they bind surface receptors and act through second messengers. Steroid hormones such as cortisol, oestrogen and testosterone are lipid-soluble, cross the membrane and bind receptors inside the cell, changing gene expression.

The **hypothalamus** links the two systems. It controls the anterior pituitary through releasing hormones, and it makes ADH and oxytocin, which travel down axons to the **posterior pituitary** and are released there.

Most hormone levels are held steady by **negative feedback**: a change triggers a response that reverses it.

- **Blood glucose.** When glucose rises, beta cells of the pancreatic islets release **insulin**, which makes liver and muscle cells take up glucose and store it as glycogen. When glucose falls, alpha cells release **glucagon**, which makes the liver break glycogen down and release glucose.
- **Thyroid.** The hypothalamus releases TRH, which makes the anterior pituitary release TSH, which makes the thyroid release T₃ and T₄. T₃ and T₄ inhibit the release of TRH and TSH.
- **Adrenaline** from the adrenal medulla prepares the body for action, like the sympathetic system.

### Innate and adaptive immunity

**Innate** defences act at once and are the same for every pathogen: skin and mucous membranes, stomach acid, lysozyme, phagocytes (neutrophils and macrophages), natural killer cells, complement proteins and inflammation.

**Adaptive** immunity is specific and slower the first time, and it has **memory**. It relies on lymphocytes, each carrying receptors for one antigen.

- **B cells**, when activated (usually with help from T helper cells), divide into **plasma cells**, which secrete **antibodies**, and memory B cells. An antibody is a Y-shaped protein of two heavy and two light chains; its two variable tips bind the antigen.
- **T helper cells** (CD4) coordinate the response by releasing cytokines. **Cytotoxic T cells** (CD8) kill infected cells that display foreign antigen on MHC class I molecules.

The **primary response** to a new antigen takes days to peak. Memory cells make the **secondary response** to the same antigen faster, larger and longer-lasting. A **vaccine** induces **active** immunity with memory without causing the disease. Injected antibodies, or antibodies passed from mother to baby across the placenta or in breast milk, give **passive** immunity: immediate but temporary, with no memory cells.
`,
  examples: [
    {
      id: 'example-cholinesterase-inhibitor',
      title: 'Blocking acetylcholinesterase',
      problemMd: md`A drug inhibits acetylcholinesterase at the synapses between motor neurons and skeletal muscle. Predict the effect on the muscle after a single nerve impulse.`,
      steps: [
        md`The impulse opens Ca²⁺ channels in the terminal, and acetylcholine is released into the cleft as usual. The drug does not change this step.`,
        md`Acetylcholine binds its receptors and depolarises the muscle membrane, as usual.`,
        md`Normally acetylcholinesterase breaks acetylcholine down within milliseconds, ending the signal. With the enzyme blocked, acetylcholine stays in the cleft.`,
        md`So the receptors are stimulated again and again: the muscle membrane is depolarised for longer, and the muscle response is prolonged.`,
      ],
      answerMd: md`Transmission is prolonged: acetylcholine accumulates and keeps stimulating the muscle. Predicting that the muscle cannot contract at all would fit a drug that blocks the acetylcholine receptors, which is a different mechanism.`,
    },
    {
      id: 'example-iodine-deficiency',
      title: 'Iodine deficiency and the thyroid loop',
      problemMd: md`The thyroid needs iodine to make T₃ and T₄. Predict the blood levels of T₄ and TSH in a person whose diet lacks iodine, and explain why the thyroid gland may enlarge.`,
      steps: [
        md`Without iodine, the thyroid makes little T₃ and T₄, so T₄ in the blood is low.`,
        md`T₃ and T₄ normally inhibit the hypothalamus and the anterior pituitary. With little of them present, that negative feedback weakens.`,
        md`The pituitary therefore releases more TSH, so TSH in the blood is high.`,
        md`TSH stimulates the growth of the thyroid as well as its secretion, so the gland enlarges (a goitre) while still failing to make enough hormone.`,
      ],
      answerMd: md`T₄ low, TSH high, and a possible goitre. Predicting low TSH as well forgets that the loop is negative: less product means less inhibition and more stimulating hormone.`,
    },
    {
      id: 'example-secondary-response',
      title: 'Reading antibody data',
      problemMd: md`A volunteer receives a vaccine on day 0 and the same vaccine again on day 60. Antibody levels (arbitrary units) are: day 7, 5; day 14, 40; day 30, 15; day 67, 400; day 74, 600. Explain the pattern.`,
      steps: [
        md`After the first dose, antibodies appear slowly and peak at a modest level (40 units around day 14), then fall: the primary response, while B cells specific to the antigen are selected and divide.`,
        md`That first response also left memory B and T cells.`,
        md`Seven days after the second dose the level is already 400 units, ten times the first peak, and still rising: memory cells respond faster and in larger numbers.`,
        md`Check the comparison at the same interval: 7 days after each dose the levels are 5 and 400, eighty times higher the second time.`,
      ],
      answerMd: md`The second exposure triggers a secondary response, faster and larger because memory cells were made in the first. This is why many vaccines are given in more than one dose. Attributing the rise to antibodies left over from the first dose does not fit: they had fallen to 15 units by day 30.`,
    },
  ],
  traps: [
    {
      title: md`Thinking a stronger stimulus makes a bigger impulse`,
      md: md`The action potential is all-or-none. Stimulus strength is coded by how often impulses fire and how many neurons fire, never by the size of each impulse.`,
    },
    {
      title: md`Saying the posterior pituitary makes ADH`,
      md: md`ADH and oxytocin are made by neurons of the hypothalamus and only stored in, and released from, the posterior pituitary. The anterior pituitary makes its own hormones, such as TSH, FSH and LH.`,
    },
    {
      title: md`Mixing up glucagon and glycogen`,
      md: md`Glucagon is a hormone that raises blood glucose; glycogen is the storage polysaccharide it causes the liver to break down. Insulin, not glucagon, drives glycogen synthesis.`,
    },
    {
      title: md`Expecting memory from passive immunity`,
      md: md`Injected or maternal antibodies protect at once but are broken down within weeks or months, and no memory cells are made. Only active immunity, from infection or vaccination, leaves memory.`,
    },
  ],
  check: [
    {
      id: 'check-sodium-channels',
      title: 'At threshold',
      topic: 'Anatomy and physiology',
      stemMd: md`What happens immediately after voltage-gated sodium channels open in the membrane of an axon at threshold?`,
      options: [
        { id: 'A', text: md`K⁺ flows out of the axon and the membrane repolarises`, note: md`This is the next phase, when the K⁺ channels open and the Na⁺ channels have closed.` },
        { id: 'B', text: md`Na⁺ flows into the axon and the membrane depolarises`, note: '' },
        { id: 'C', text: md`The sodium–potassium pump moves Na⁺ out using ATP and the membrane hyperpolarises`, note: md`The pump works all the time to keep the gradients; it does not produce the rapid rising phase.` },
        { id: 'D', text: md`Na⁺ flows out of the axon and the inside becomes more negative`, note: md`Na⁺ is more concentrated outside, so through open channels it flows in, making the inside positive.` },
        { id: 'E', text: md`Ca²⁺ enters and causes vesicles of neurotransmitter to be released`, note: md`Ca²⁺ entry triggers release at the axon terminal, not along the axon at threshold.` },
      ],
      answer: 'B',
      workingMd: md`Na⁺ is far more concentrated outside the cell, and the inside is negative, so when voltage-gated Na⁺ channels open, Na⁺ rushes in and the membrane potential swings positive: depolarisation. Repolarisation by K⁺ outflow follows.`,
      lesson: 'Na⁺ in makes the rising phase; K⁺ out makes the falling phase.',
    },
    {
      id: 'check-passive-immunity',
      title: 'Antibodies by injection',
      topic: 'Anatomy and physiology',
      stemMd: md`A person bitten by a venomous snake is given an injection of ready-made antibodies against the venom. Which statement about this protection is correct?`,
      options: [
        { id: 'A', text: md`It is active immunity, because the antibodies attack the venom`, note: md`Immunity is active only when the person's own immune system makes the antibodies; here they come from outside.` },
        { id: 'B', text: md`It takes one to two weeks to work, like a primary immune response`, note: md`Ready-made antibodies act as soon as they are in the blood; no response has to build up.` },
        { id: 'C', text: md`It produces memory cells that protect against a later bite`, note: md`Memory cells come only from the person's own lymphocytes responding to the antigen; injected antibodies make none.` },
        { id: 'D', text: md`It works by stimulating the person's B cells to divide into plasma cells`, note: md`That is how a vaccine works. Injected antibodies bind the venom directly.` },
        { id: 'E', text: md`It acts immediately but lasts only a short time, because no memory cells are made`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Ready-made antibodies give passive immunity. They neutralise the venom straight away, but they are gradually broken down and the person's own lymphocytes have not been activated, so no memory cells form and the protection is temporary.`,
      lesson: 'Passive immunity is fast and temporary; active immunity is slower the first time and leaves memory.',
    },
    {
      id: 'check-thyroid-feedback',
      title: 'A thyroid that cannot respond',
      topic: 'Anatomy and physiology',
      stemMd: md`A person's thyroid gland is damaged and makes very little T₃ and T₄, while the hypothalamus and pituitary work normally. Which pattern of blood levels is expected?`,
      options: [
        { id: 'A', text: md`TSH low, T₄ low`, note: md`This would fit a failing pituitary. Here the pituitary is normal and, released from feedback, makes more TSH.` },
        { id: 'B', text: md`TSH high, T₄ high`, note: md`High TSH cannot raise T₄ when the gland itself is damaged.` },
        { id: 'C', text: md`TSH high, T₄ low`, note: '' },
        { id: 'D', text: md`TSH low, T₄ high`, note: md`This is the pattern of an overactive thyroid, whose excess T₄ suppresses TSH.` },
        { id: 'E', text: md`TSH normal, T₄ low`, note: md`TSH would stay normal only if feedback did not exist; low T₄ removes inhibition and TSH rises.` },
      ],
      answer: 'C',
      workingMd: md`The damaged gland makes little hormone, so T₄ is low. Low T₃ and T₄ weaken the negative feedback on the hypothalamus and anterior pituitary, so TRH and TSH secretion rise. The result is high TSH with low T₄.`,
      lesson: 'In a negative feedback loop, find the faulty organ first; the healthy organs upstream move in the direction that would correct the fault.',
    },
  ],
  takeaways: [
    'The resting potential is about −70 mV; Na⁺ in depolarises, K⁺ out repolarises; impulses are all-or-none.',
    'At a synapse, Ca²⁺ entry releases transmitter, which binds postsynaptic receptors and is then removed.',
    'Insulin lowers blood glucose and glucagon raises it; T₃ and T₄ inhibit TRH and TSH by negative feedback.',
    'B cells become plasma cells that secrete antibodies; T helper cells coordinate and cytotoxic T cells kill infected cells.',
    'Active immunity leaves memory cells; passive immunity is immediate but temporary.',
  ],
  flashcards: [
    { front: 'Resting potential and what keeps it', back: 'About −70 mV inside. The Na⁺/K⁺ pump moves 3 Na⁺ out and 2 K⁺ in using ATP, and the membrane leaks more K⁺ out than Na⁺ in.' },
    { front: 'All-or-none law', back: 'Once threshold is reached, an action potential has a fixed size. Stronger stimuli raise the frequency of impulses, not their size.' },
    { front: 'What starts transmitter release at a synapse', back: 'Ca²⁺ entering the axon terminal through voltage-gated channels triggers the exocytosis of neurotransmitter vesicles.' },
    { front: 'Where ADH is made and released', back: 'Made by neurons in the hypothalamus; stored in and released from the posterior pituitary.' },
    { front: 'Insulin and glucagon', back: 'Insulin, from beta cells, lowers blood glucose and promotes glycogen synthesis. Glucagon, from alpha cells, raises it by making the liver break down glycogen.' },
    { front: 'Active versus passive immunity', back: 'Active: the body makes its own antibodies and memory cells, after infection or vaccination. Passive: ready-made antibodies are received; immediate, temporary, no memory.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-anatomy-physiology' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const digestiveAndExcretorySystemsLesson: Lesson = {
  slug: 'digestive-and-excretory-systems',
  title: 'Digestive and excretory systems',
  summary: 'Follow food through digestion and absorption, and filtrate through the nephron, and predict what changes when an enzyme, bile or ADH is missing.',
  minutes: 23,
  objectives: [
    'Match each digestive enzyme to its source, site, substrate and products, and explain the roles of bile and the villi.',
    'Describe ultrafiltration, selective reabsorption and the control of water by ADH in the nephron.',
    'Interpret data on plasma, filtrate and urine, and predict the effects of hormones and drugs on urine.',
  ],
  teachMd: md`
### The digestive tract

Food passes through the mouth, pharynx, oesophagus, stomach, small intestine (duodenum, jejunum, ileum), large intestine (colon) and rectum. Digestion is **mechanical** (chewing, the churning of the stomach) and **chemical** (hydrolysis by enzymes of large molecules into units small enough to absorb). Food is pushed along by **peristalsis**, waves of contraction of the smooth muscle in the gut wall.

| Enzyme | Made by | Works in | Substrate → products |
| --- | --- | --- | --- |
| Salivary amylase | Salivary glands | Mouth (near-neutral pH) | Starch → maltose |
| Pepsin | Stomach (as pepsinogen) | Stomach (pH about 2) | Proteins → polypeptides |
| Pancreatic amylase | Pancreas | Small intestine | Starch → maltose |
| Trypsin | Pancreas (as trypsinogen) | Small intestine | Proteins and polypeptides → shorter peptides |
| Lipase | Pancreas | Small intestine | Triglycerides → fatty acids + monoglycerides |
| Maltase, sucrase, lactase, peptidases | Cells of the intestinal lining | Small intestine (on the microvilli) | Disaccharides → monosaccharides; peptides → amino acids |

Protein-digesting enzymes are made as **inactive precursors**, so they do not digest the cells that make them. Hydrochloric acid in the stomach turns pepsinogen into pepsin; in the duodenum, enterokinase (enteropeptidase) from the intestinal lining turns trypsinogen into trypsin. Stomach acid also kills most microbes in food.

### Bile and the pancreas

**Bile** is made in the liver, stored in the gallbladder, and released into the duodenum. It contains **no enzymes**. Its bile salts **emulsify** fats, breaking large droplets into small ones, which gives lipase a much larger surface to work on. Bile and pancreatic juice are also rich in **hydrogencarbonate**, which neutralises the acid arriving from the stomach so that pancreatic and intestinal enzymes can work at their slightly alkaline optimum.

Hormones from the gut coordinate this: **gastrin** stimulates acid secretion in the stomach; **secretin** (released when acid enters the duodenum) stimulates hydrogencarbonate secretion; **cholecystokinin** (CCK, released when fats and proteins enter) stimulates enzyme secretion by the pancreas and contraction of the gallbladder.

### Absorption

The small intestine has a vast surface: it is long and folded, its lining carries **villi**, and its epithelial cells carry **microvilli**. Each villus contains a network of capillaries and a lymph vessel, the **lacteal**.

- **Monosaccharides and amino acids** are absorbed by facilitated diffusion and active transport (often co-transport with Na⁺) into the capillaries, which drain into the **hepatic portal vein** to the liver.
- **Fatty acids and monoglycerides** enter the epithelial cells, are rebuilt into triglycerides, are packed into **chylomicrons**, and pass into the **lacteals**, so they reach the blood through the lymph and bypass the liver at first.

The large intestine absorbs most of the remaining water and salts. Its bacteria ferment undigested material and make some vitamins, such as vitamin K.

### The liver and nitrogen waste

Excess amino acids cannot be stored. The liver removes their amino group (**deamination**), producing ammonia, which is toxic and is turned at once into the far less toxic **urea** in the urea (ornithine) cycle. The kidneys then excrete the urea. Excretion is the removal of waste made by metabolism; the egestion of faeces, which is mostly undigested food, is not excretion.

### The kidney and the nephron

Each kidney contains about a million **nephrons**. Urine leaves each kidney by a **ureter**, is stored in the **bladder**, and leaves the body through the **urethra**. In each nephron:

1. **Ultrafiltration** in the **glomerulus**. The afferent arteriole is wider than the efferent one, so blood pressure in the glomerulus is high. Water and small solutes (glucose, amino acids, ions, urea) are forced into **Bowman's capsule**; blood cells and most proteins are too large and stay in the blood. Filtration is by size, not by usefulness.
2. **Selective reabsorption** in the **proximal convoluted tubule**. All the glucose and amino acids, and most of the Na⁺ and water, return to the blood. Glucose is reabsorbed by carriers (co-transport with Na⁺), which have a maximum rate.
3. **The loop of Henle** creates an increasingly salty medulla. The descending limb is permeable to water; the ascending limb is impermeable to water and pumps Na⁺ and Cl⁻ out.
4. **The distal tubule and collecting duct** fine-tune the urine. **Aldosterone** from the adrenal cortex increases Na⁺ reabsorption. **ADH** makes the collecting duct more permeable to water by inserting **aquaporins**, so more water leaves into the salty medulla and the urine is smaller in volume and more concentrated.

ADH is under negative feedback: when the blood becomes too concentrated (after sweating or too little drinking), osmoreceptors in the hypothalamus trigger more ADH release; when the blood is dilute, ADH falls and a large volume of dilute urine is made. Alcohol inhibits ADH release, which is why it increases urine output.
`,
  examples: [
    {
      id: 'example-blocked-bile-duct',
      title: 'A blocked bile duct',
      problemMd: md`A gallstone blocks the duct that carries bile into the duodenum, while pancreatic juice still flows. Predict the effect on the digestion of fats and of proteins, and on the faeces.`,
      steps: [
        md`Bile contains no enzymes, but its salts emulsify fats. Without bile, fat stays in large droplets with a small surface area.`,
        md`Pancreatic lipase still reaches the duodenum, but it works only on the surface of the droplets, so fat digestion is slow and incomplete.`,
        md`Fats that are not digested cannot be absorbed, so they stay in the gut and the faeces become fatty and pale (bile pigments, which colour faeces, are also missing).`,
        md`Protein digestion depends on pepsin and the pancreatic and intestinal proteases, none of which need bile; it continues, though the acid from the stomach is less well neutralised without bile's hydrogencarbonate.`,
      ],
      answerMd: md`Fat digestion and absorption fall sharply, giving fatty, pale faeces; protein digestion carries on. Concluding that fat digestion stops completely overstates it: lipase is still present, only its access to the fat is reduced.`,
    },
    {
      id: 'example-nephron-data',
      title: 'Reading plasma, filtrate and urine',
      problemMd: md`Concentrations, in g per 100 mL: protein, plasma 7.5, filtrate 0, urine 0; glucose, plasma 0.1, filtrate 0.1, urine 0; urea, plasma 0.03, filtrate 0.03, urine 2.0. Explain each row.`,
      steps: [
        md`Protein: none in the filtrate, so proteins do not pass the glomerular filter; they are too large.`,
        md`Glucose: the same concentration in filtrate as in plasma, so it is freely filtered; none in urine, so all of it is reabsorbed, in the proximal tubule.`,
        md`Urea: freely filtered (0.03 in both), then concentrated in the urine by a factor of $\frac{2.0}{0.03} \approx 67$.`,
        md`Urea is not pumped into the urine on this scale: the rise in concentration mainly reflects water reabsorbed along the nephron, which leaves the urea in a much smaller volume.`,
      ],
      answerMd: md`Proteins are not filtered; glucose is filtered and fully reabsorbed; urea is filtered and concentrated about 67-fold, mainly because most of the filtered water is reabsorbed. Concluding that glucose is not filtered because it is absent from urine ignores the filtrate column.`,
    },
    {
      id: 'example-adh-dehydration',
      title: 'A long walk without water',
      problemMd: md`After hours of walking in the heat without drinking, a person's blood becomes more concentrated. Predict the change in ADH, in the collecting ducts and in the urine.`,
      steps: [
        md`Osmoreceptors in the hypothalamus detect the rise in blood concentration.`,
        md`More ADH is released from the posterior pituitary into the blood.`,
        md`ADH causes aquaporins to be inserted into the membranes of the collecting duct cells, making the duct more permeable to water.`,
        md`More water moves by osmosis from the duct into the salty medulla and back into the blood, so a small volume of concentrated urine is produced, and the blood concentration falls back: negative feedback.`,
      ],
      answerMd: md`ADH rises, the collecting ducts become more permeable to water, and the urine becomes scanty and concentrated. Saying ADH acts on the glomerulus to filter less is the common error: it acts on the collecting ducts.`,
    },
  ],
  traps: [
    {
      title: md`Giving bile an enzyme`,
      md: md`Bile emulsifies fats and neutralises acid; it digests nothing itself. The fat-digesting enzyme is pancreatic lipase.`,
    },
    {
      title: md`Sending fats into the hepatic portal vein`,
      md: md`Sugars and amino acids go into the capillaries of the villi and on to the liver. Fats go as chylomicrons into the lacteals, part of the lymphatic system.`,
    },
    {
      title: md`Saying the kidney makes urea`,
      md: md`Urea is made in the liver by deamination and the urea cycle. The kidney only filters it out of the blood and excretes it.`,
    },
    {
      title: md`Swapping ureter and urethra`,
      md: md`Two ureters carry urine from the kidneys to the bladder; one urethra carries it out of the body. The order is kidney, ureter, bladder, urethra.`,
    },
  ],
  check: [
    {
      id: 'check-pepsinogen',
      title: 'An enzyme activated by acid',
      topic: 'Anatomy and physiology',
      stemMd: md`Which enzyme is secreted in an inactive form and activated by hydrochloric acid in the stomach?`,
      options: [
        { id: 'A', text: md`Trypsin`, note: md`Trypsin is also secreted inactive, as trypsinogen, but it is activated in the small intestine by enterokinase, not by acid.` },
        { id: 'B', text: md`Salivary amylase`, note: md`Salivary amylase is secreted active and works at near-neutral pH; stomach acid stops it.` },
        { id: 'C', text: md`Pancreatic lipase`, note: md`Lipase is a pancreatic enzyme acting in the small intestine, where acid has been neutralised.` },
        { id: 'D', text: md`Pepsin`, note: '' },
        { id: 'E', text: md`Maltase`, note: md`Maltase is attached to the microvilli of the small intestine and is not made as an acid-activated precursor.` },
      ],
      answer: 'D',
      workingMd: md`Chief cells of the stomach secrete pepsinogen. Hydrochloric acid from the parietal cells converts it into active pepsin, which works best at the low pH of the stomach and begins protein digestion.`,
      lesson: 'Proteases are made inactive; pepsin is switched on by acid, trypsin by enterokinase.',
    },
    {
      id: 'check-glucose-urine',
      title: 'Glucose in the urine',
      topic: 'Anatomy and physiology',
      stemMd: md`In untreated diabetes mellitus, glucose appears in the urine. What is the best explanation?`,
      options: [
        { id: 'A', text: md`So much glucose is filtered that it exceeds the maximum rate at which the proximal tubule carriers can reabsorb it`, note: '' },
        { id: 'B', text: md`Glucose is normally too large to be filtered, but high blood pressure forces it through the glomerulus`, note: md`Glucose is small and is filtered freely in everyone; normally it is all reabsorbed afterwards.` },
        { id: 'C', text: md`Without insulin, the glomerulus can no longer hold glucose back in the blood`, note: md`The glomerulus never holds glucose back, and filtration does not depend on insulin.` },
        { id: 'D', text: md`The loop of Henle secretes glucose into the filtrate when blood glucose is high`, note: md`The loop of Henle handles water and salts; it does not secrete glucose.` },
        { id: 'E', text: md`ADH stops the collecting duct reabsorbing glucose`, note: md`ADH controls water permeability of the collecting duct; glucose is reabsorbed earlier, in the proximal tubule.` },
      ],
      answer: 'A',
      workingMd: md`Glucose is freely filtered, so the amount entering the tubule rises with blood glucose. Reabsorption in the proximal tubule depends on carrier proteins, which have a maximum rate. When the filtered load exceeds that maximum, the excess cannot be reabsorbed and stays in the urine.`,
      lesson: 'Filtration is unselective; what ends up in urine depends on what reabsorption can recover.',
    },
    {
      id: 'check-adh-blocker',
      title: 'Blocking ADH receptors',
      topic: 'Anatomy and physiology',
      stemMd: md`A drug blocks the ADH receptors on the cells of the collecting ducts. What is the most likely effect on the urine?`,
      options: [
        { id: 'A', text: md`A small volume of concentrated urine`, note: md`That is the effect of **more** ADH action; blocking the receptors does the opposite.` },
        { id: 'B', text: md`A large volume of dilute urine`, note: '' },
        { id: 'C', text: md`Glucose appears in the urine`, note: md`ADH does not control glucose reabsorption, which happens in the proximal tubule.` },
        { id: 'D', text: md`Protein appears in the urine`, note: md`Protein in urine points to a damaged glomerular filter, which ADH does not affect.` },
        { id: 'E', text: md`No change, because ADH acts on the glomerulus`, note: md`ADH acts on the collecting ducts (and distal tubules), not on filtration in the glomerulus.` },
      ],
      answer: 'B',
      workingMd: md`Without ADH signalling, few aquaporins are inserted into the collecting duct membranes. The ducts stay poorly permeable to water, so little water is reabsorbed into the medulla and a large volume of dilute urine is produced.`,
      lesson: 'More ADH effect means less, more concentrated urine; less ADH effect means more, more dilute urine.',
    },
  ],
  takeaways: [
    'Each enzyme has a source, a site and a substrate: amylase for starch, pepsin and trypsin for proteins, lipase for fats.',
    'Bile has no enzymes: it emulsifies fats and helps neutralise stomach acid.',
    'Sugars and amino acids go to the hepatic portal vein; fats go to the lacteals as chylomicrons.',
    'The nephron filters by size, reabsorbs all glucose and most water in the proximal tubule, and fine-tunes water with ADH in the collecting duct.',
  ],
  flashcards: [
    { front: 'Pepsin', back: 'A stomach protease secreted as pepsinogen and activated by hydrochloric acid; it works best at about pH 2 and turns proteins into polypeptides.' },
    { front: 'What bile does', back: 'It emulsifies fats, raising the surface area for lipase, and helps neutralise stomach acid. It contains no enzymes.' },
    { front: 'Where digested fats are absorbed', back: 'They are rebuilt into triglycerides in the epithelial cells, packed into chylomicrons and passed into the lacteals of the villi.' },
    { front: 'Ultrafiltration', back: 'High pressure in the glomerulus forces water and small solutes into Bowman\'s capsule; cells and most proteins stay in the blood.' },
    { front: 'Where glucose is reabsorbed', back: 'In the proximal convoluted tubule, by carriers (co-transport with Na⁺) that have a maximum rate; normally all of it is recovered.' },
    { front: 'Action of ADH on the kidney', back: 'It inserts aquaporins into the collecting duct, so more water is reabsorbed and a smaller volume of more concentrated urine is made.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-anatomy-physiology' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const humanReproductionAndDevelopmentLesson: Lesson = {
  slug: 'human-reproduction-and-development',
  title: 'Human reproduction and development',
  summary: 'Gametogenesis, the hormones of the menstrual cycle, fertilisation, implantation and early development, with the feedback loops that tie them together.',
  minutes: 24,
  objectives: [
    'Compare spermatogenesis and oogenesis, including where each cell is in meiosis and how many gametes result.',
    'Explain the hormonal control of the menstrual cycle and of early pregnancy, using negative and positive feedback.',
    'Describe fertilisation, implantation, the germ layers and the role of the placenta.',
  ],
  teachMd: md`
### The male reproductive system

The **testes** sit in the scrotum, a little cooler than the body core, which sperm production needs. Sperm are made in the **seminiferous tubules**, where **Sertoli cells** nourish and support the developing cells. Between the tubules, **Leydig (interstitial) cells** secrete **testosterone**. Sperm mature in the **epididymis** and travel through the **vas deferens** to the urethra; the **seminal vesicles**, **prostate** and bulbourethral glands add fluid to make semen.

Control runs from the hypothalamus: **GnRH** makes the anterior pituitary release **FSH**, which acts on the Sertoli cells to support sperm production, and **LH**, which makes the Leydig cells secrete testosterone. Testosterone (and inhibin from the Sertoli cells) feeds back negatively on the hypothalamus and pituitary.

### Making gametes

| | Spermatogenesis | Oogenesis |
| --- | --- | --- |
| When | Continuously from puberty | Begins before birth; one cell usually completes each cycle from puberty to menopause |
| From one primary cell (46 chromosomes) | 4 sperm | 1 egg and 2 or 3 polar bodies |
| Divisions | Meiosis I and II run straight through | Arrested in prophase I until puberty; arrested again in metaphase II |

In oogenesis, primary oocytes are already present at birth, stopped in **prophase I**. Each cycle, one usually finishes meiosis I just before ovulation, giving a large **secondary oocyte** and a small first polar body. The cell released at ovulation is this secondary oocyte, stopped in **metaphase II**. It completes meiosis II **only if a sperm enters it**, producing the ovum and a second polar body. The unequal divisions keep almost all the cytoplasm in one cell, which must feed the early embryo.

### The female system and the menstrual cycle

The **ovaries** hold the follicles; the **oviducts** (fallopian tubes) carry the oocyte towards the **uterus**, whose lining is the **endometrium**; the **cervix** opens into the vagina. A typical cycle lasts about 28 days, counted from the first day of menstruation, though length varies between women and between cycles.

1. **Menstruation** (about days 1–5): the endometrium is shed.
2. **Follicular phase**: **FSH** stimulates follicles to grow; the growing follicles secrete **oestrogen**, which rebuilds the endometrium. Rising oestrogen at first inhibits FSH and LH.
3. **Ovulation** (about day 14 in a 28-day cycle): when oestrogen stays high, its feedback becomes **positive**, and a surge of **LH** (with some FSH) triggers the release of the secondary oocyte.
4. **Luteal phase**: the empty follicle becomes the **corpus luteum**, which secretes **progesterone** and oestrogen. Progesterone keeps the endometrium thick and ready for implantation, and with oestrogen it inhibits FSH and LH, so no new follicle matures.
5. If no embryo implants, the corpus luteum degenerates after about 14 days, progesterone falls, and the endometrium is shed. FSH is released from inhibition and a new cycle begins.

The luteal phase is fairly constant at about 14 days, so in longer or shorter cycles it is the follicular phase that varies.

### Fertilisation and the first days

Fertilisation usually happens in the **oviduct**. Enzymes released from the sperm's **acrosome** help it through the layers around the oocyte. When one sperm fuses with the oocyte, the **cortical reaction** changes the zona pellucida so that no other sperm can enter, preventing polyspermy. The oocyte completes meiosis II, and the two haploid nuclei combine into a diploid **zygote**.

The zygote divides by mitosis as it travels down the oviduct (**cleavage**: the cells divide without growing), forming a solid ball, the **morula**, and then a hollow **blastocyst**. Its **inner cell mass** will form the embryo; its outer layer, the **trophoblast**, will form the embryo's part of the placenta. The blastocyst **implants** in the endometrium about a week after fertilisation.

The trophoblast secretes **hCG** (human chorionic gonadotrophin), which keeps the corpus luteum alive and secreting progesterone, so the endometrium is not shed. Pregnancy tests detect hCG in urine. Later the placenta itself makes enough progesterone.

### Germ layers and the placenta

During **gastrulation** the embryo forms three germ layers:

| Layer | Gives rise to, among others |
| --- | --- |
| Ectoderm | Epidermis, nervous system |
| Mesoderm | Muscle, bone, blood and heart, kidneys |
| Endoderm | Lining of the gut and airways, liver, pancreas |

The **placenta** lets substances pass between mother and fetus without their blood mixing: oxygen, glucose, amino acids and some antibodies (IgG) cross to the fetus; CO₂ and urea cross to the mother. The **umbilical arteries** carry deoxygenated blood from the fetus to the placenta, and the **umbilical vein** carries oxygenated blood back to the fetus.

### Birth and twins

At birth, stretching of the cervix triggers the release of **oxytocin**, which strengthens contractions of the uterus, which stretch the cervix further: a **positive feedback** loop that ends with delivery. **Prolactin** stimulates milk production; oxytocin causes milk ejection. **Identical (monozygotic) twins** come from one zygote that splits and share the same genes; **non-identical (dizygotic) twins** come from two oocytes fertilised by two sperm.
`,
  examples: [
    {
      id: 'example-gamete-count',
      title: 'Counting gametes and chromosomes',
      problemMd: md`100 primary spermatocytes and 100 primary oocytes complete gametogenesis (each oocyte being fertilised, so that meiosis II finishes). How many sperm and how many eggs result? How many chromosomes does a secondary spermatocyte have, and how many chromatids?`,
      steps: [
        md`Each primary spermatocyte undergoes meiosis I and II and gives 4 sperm: $100 \times 4 = 400$ sperm.`,
        md`Each primary oocyte gives only one egg, because both divisions are unequal and the small cells are polar bodies: 100 eggs.`,
        md`A primary spermatocyte has 46 chromosomes, each of two chromatids. Meiosis I separates homologous pairs, so each secondary spermatocyte has 23 chromosomes.`,
        md`The sister chromatids have not yet separated (that happens in meiosis II), so those 23 chromosomes still have two chromatids each: 46 chromatids.`,
      ],
      answerMd: md`400 sperm and 100 eggs; a secondary spermatocyte has 23 chromosomes and 46 chromatids. Giving it 46 chromosomes confuses chromatids with chromosomes; the halving of the chromosome number happens in meiosis I.`,
    },
    {
      id: 'example-ovulation-day',
      title: 'Ovulation in a longer cycle',
      problemMd: md`A woman's cycles regularly last 32 days. Assuming a luteal phase of 14 days, on about which day of the cycle does she ovulate, and which hormone peak triggers it?`,
      steps: [
        md`The luteal phase runs from ovulation to the next menstruation and lasts about 14 days whatever the cycle length.`,
        md`So ovulation falls about 14 days before the next cycle begins: $32 - 14 = 18$.`,
        md`Check with the standard cycle: $28 - 14 = 14$, which matches ovulation on about day 14. The extra 4 days of the longer cycle are in the follicular phase.`,
        md`Ovulation is triggered by the LH surge, caused by the positive feedback of high oestrogen on the pituitary.`,
      ],
      answerMd: md`About day 18, triggered by the LH surge. Answering day 14 assumes every cycle is 28 days long; answering day 16 splits the cycle in half, but the two phases are not equal.`,
    },
    {
      id: 'example-combined-pill',
      title: 'How a combined pill prevents ovulation',
      problemMd: md`A contraceptive pill contains synthetic oestrogen and progesterone, taken daily. Predict the effect on FSH, on LH and on ovulation.`,
      steps: [
        md`The pill keeps oestrogen and progesterone steadily at levels like those of the luteal phase.`,
        md`In the luteal phase these hormones inhibit the hypothalamus and pituitary by negative feedback, so FSH and LH stay low.`,
        md`With little FSH, no follicle matures; without the rising oestrogen of a maturing follicle, there is no switch to positive feedback and no LH surge.`,
        md`Without the LH surge, no oocyte is released.`,
      ],
      answerMd: md`FSH and LH stay low and ovulation does not happen. The tempting error is to think extra oestrogen causes an LH surge: the surge needs the rising oestrogen pattern of a maturing follicle, and progesterone, which keeps negative feedback in place, is present the whole time.`,
    },
  ],
  traps: [
    {
      title: md`Saying a mature egg is released at ovulation`,
      md: md`What leaves the ovary is a secondary oocyte arrested in metaphase II. Meiosis II is completed only after a sperm enters it.`,
    },
    {
      title: md`Blaming progesterone for the LH surge`,
      md: md`The LH surge is caused by high oestrogen switching to positive feedback. Progesterone, made by the corpus luteum after ovulation, mainly inhibits FSH and LH.`,
    },
    {
      title: md`Swapping Leydig and Sertoli cells`,
      md: md`Leydig cells, between the tubules, respond to LH and make testosterone. Sertoli cells, in the tubules, respond to FSH and support sperm development.`,
    },
    {
      title: md`Calling the umbilical arteries oxygenated`,
      md: md`Arteries carry blood away from the heart, here the fetal heart: the umbilical arteries take deoxygenated blood to the placenta, and the umbilical vein brings oxygenated blood back.`,
    },
  ],
  check: [
    {
      id: 'check-corpus-luteum',
      title: 'Keeping the corpus luteum alive',
      topic: 'Reproduction and heredity',
      stemMd: md`In the first weeks of pregnancy, which hormone keeps the corpus luteum secreting progesterone, so that the endometrium is not shed?`,
      options: [
        { id: 'A', text: md`FSH`, note: md`FSH stimulates the growth of follicles before ovulation; it is held low in pregnancy.` },
        { id: 'B', text: md`LH`, note: md`The LH surge forms the corpus luteum, but LH is then held low by negative feedback and cannot sustain it.` },
        { id: 'C', text: md`Oxytocin`, note: md`Oxytocin acts at birth and in milk ejection, not on the corpus luteum.` },
        { id: 'D', text: md`Prolactin`, note: md`Prolactin stimulates milk production; it does not maintain the corpus luteum.` },
        { id: 'E', text: md`hCG`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Without pregnancy the corpus luteum degenerates after about 14 days. When an embryo implants, its trophoblast secretes hCG, which keeps the corpus luteum alive and making progesterone until the placenta can make enough itself. Pregnancy tests detect this hCG.`,
      lesson: 'hCG, made by the embryo, is the signal that rescues the corpus luteum.',
    },
    {
      id: 'check-germ-layer',
      title: 'Where the nervous system comes from',
      topic: 'Reproduction and heredity',
      stemMd: md`From which germ layer does the nervous system develop?`,
      options: [
        { id: 'A', text: md`Ectoderm`, note: '' },
        { id: 'B', text: md`Mesoderm`, note: md`Mesoderm gives muscle, bone, blood, the heart and the kidneys, not the nervous system.` },
        { id: 'C', text: md`Endoderm`, note: md`Endoderm gives the lining of the gut and airways and organs such as the liver and pancreas.` },
        { id: 'D', text: md`Trophoblast`, note: md`The trophoblast is not a germ layer; it forms the embryo's part of the placenta.` },
        { id: 'E', text: md`Inner cell mass, before gastrulation`, note: md`The inner cell mass gives rise to the whole embryo; the nervous system comes from one of the layers it later forms.` },
      ],
      answer: 'A',
      workingMd: md`Gastrulation forms ectoderm, mesoderm and endoderm. The ectoderm gives the epidermis and, by folding into the neural tube, the brain and spinal cord.`,
      lesson: 'Ectoderm: skin and nerves; mesoderm: muscle, bone, blood; endoderm: gut and airway linings.',
    },
    {
      id: 'check-meiosis-ii',
      title: 'When meiosis II ends',
      topic: 'Reproduction and heredity',
      stemMd: md`In a woman, when is meiosis II of an oocyte completed?`,
      options: [
        { id: 'A', text: md`Before her birth, when the primary oocytes form`, note: md`Before birth the primary oocytes stop in prophase I; they have not yet even finished meiosis I.` },
        { id: 'B', text: md`At puberty, when the menstrual cycles begin`, note: md`Puberty starts the cycles in which meiosis I is completed, one oocyte at a time; meiosis II still waits.` },
        { id: 'C', text: md`After a sperm enters the secondary oocyte`, note: '' },
        { id: 'D', text: md`At ovulation, when the oocyte leaves the follicle`, note: md`At ovulation the secondary oocyte is stopped in metaphase II; it is released before meiosis II finishes.` },
        { id: 'E', text: md`At implantation, about a week after fertilisation`, note: md`By implantation the embryo is a blastocyst of many cells, long after meiosis has ended.` },
      ],
      answer: 'C',
      workingMd: md`Primary oocytes stop in prophase I before birth. From puberty, one oocyte each cycle finishes meiosis I just before ovulation and is released as a secondary oocyte stopped in metaphase II. Meiosis II finishes only when a sperm enters, giving the ovum and the second polar body.`,
      lesson: 'Oogenesis pauses twice: in prophase I until a cycle selects the cell, and in metaphase II until fertilisation.',
    },
  ],
  takeaways: [
    'One primary spermatocyte gives four sperm; one primary oocyte gives one egg and polar bodies.',
    'The cell released at ovulation is a secondary oocyte in metaphase II; meiosis II ends at fertilisation.',
    'High oestrogen switches to positive feedback and causes the LH surge; progesterone from the corpus luteum maintains the endometrium.',
    'hCG from the embryo keeps the corpus luteum alive in early pregnancy and is what pregnancy tests detect.',
    'Ectoderm makes skin and nerves, mesoderm muscle, bone and blood, endoderm the gut lining.',
  ],
  flashcards: [
    { front: 'Leydig and Sertoli cells', back: 'Leydig cells respond to LH and secrete testosterone. Sertoli cells, in the seminiferous tubules, respond to FSH and support developing sperm.' },
    { front: 'The two arrests of oogenesis', back: 'Primary oocytes stop in prophase I from before birth; the secondary oocyte released at ovulation stops in metaphase II until a sperm enters.' },
    { front: 'What triggers ovulation', back: 'A surge of LH, caused when high oestrogen from the maturing follicle switches to positive feedback on the pituitary.' },
    { front: 'Role of the corpus luteum', back: 'It secretes progesterone and oestrogen, which keep the endometrium ready for implantation and inhibit FSH and LH.' },
    { front: 'hCG', back: 'Human chorionic gonadotrophin, made by the trophoblast of the embryo; it keeps the corpus luteum secreting progesterone and is detected by pregnancy tests.' },
    { front: 'The three germ layers', back: 'Ectoderm: epidermis and nervous system. Mesoderm: muscle, bone, blood, heart, kidneys. Endoderm: lining of gut and airways, liver, pancreas.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-reproduction' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};
