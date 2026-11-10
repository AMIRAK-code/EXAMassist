import { md, type Lesson } from '../../types';

export const lesson: Lesson = {
  slug: "quantifiers-negation-and-venn-diagrams",
  title: "Quantifiers, negation and Venn diagrams",
  summary: "Track what all, some and none commit you to, negate claims exactly and test syllogisms by placing individual objects in sets.",
  minutes: 18,
  objectives: [
    "Negate universal and existential statements.",
    "Distinguish an empty region from an occupied one.",
    "Test a syllogism by tracking the same witness. "
  ],
  teachMd: md`
### Ask how many objects the words commit you to

A quantifier (*quantificatore*) tells you how widely a claim extends. “Some copper plates are scratched” commits you to at least one plate that is both copper and scratched. There might be just one such plate, or all the copper plates might be scratched. In formal reasoning the word “some” includes both possibilities. Place a small cross in the overlap of the two sets. Think of it as a witness you could point to if someone asked you to justify the statement.

“Every copper plate is scratched” places a restriction on where a copper plate can go. Shade the region for copper plates outside the scratched set, since a copper plate there would violate the sentence. Shading a region as empty is different from placing a cross in another region. The rule still holds if the tray contains no copper plates at all. To conclude that some scratched plate exists, you would need another statement giving you an actual copper plate or some other scratched object.

### Negate exactly as much as necessary

Imagine someone saying “Every page has a number.” What observation would make you ask them to retract that claim? One page without a number suffices. Asking for every page to lack a number would set an unnecessarily strong condition for a refutation. Now start with “Some page has a number.” Here one unnumbered page settles nothing. To contradict the claim you must establish that no page has a number. Thinking in terms of a witness helps you choose the right size of change.

Take extra care when a sentence already contains a negative. “No sample is both wet and warm” forbids a particular overlap. Its negation puts at least one sample in that overlap. A warm dry sample is irrelevant, as is a wet cold one. For a compound condition, read the whole description after the quantifier before negating. “All parcels are light and sealed” can fail through a heavy sealed parcel or a light unsealed one. The same parcel need only fail one of the two requirements.

### Follow one witness across the premises

A syllogism links statements about classes of objects. From “Some bowls are painted” and “Every painted object is fragile”, take the painted bowl promised by the first sentence. The second sentence applies to that very bowl. You have found a fragile bowl. Reverse the second premise to “Every fragile object is painted” and the deduction breaks. The painted bowl could be sturdy. In a sketch, put the boundary of the fragile set inside the painted set in this second version. Leave the witness free to sit anywhere the original information permits.

Two statements beginning with “some” may supply different witnesses. Suppose some shelves carry boxes and some shelves carry jars. Sketch one shelf holding a box and a different shelf holding a jar. This arrangement respects both premises without requiring a mixed shelf. A shared word in two sentences gives you a shared class, but membership of a class rarely identifies a particular individual. Use distinct marks for the two witnesses until a premise forces them to coincide.

### Make a tiny countermodel

When an answer seems inevitable, describe the smallest collection of objects that could prove it wrong. Give each object a name and list its properties in a row. Read each premise against every row. For an “all” statement, inspect all rows with the starting property. For “some”, locate just one suitable row. For “none”, check that no row has both forbidden properties. Finally read the proposed conclusion against your table. If it is false there, the deduction fails. If you cannot build a countermodel, return to the premises and explain exactly which witness or empty region forces your conclusion.
`,
  examples: [
    {
      id: "example-1",
      title: "An empty overlap",
      problemMd: "No glazed tile is porous. Some blue tile is glazed. What can you say about a blue tile?",
      steps: [
        "Take the blue glazed tile guaranteed by the second premise.",
        "It lies in the glazed set, so it must lie outside the porous set."
      ],
      answerMd: "At least one blue tile is non-porous. Other blue tiles remain unrestricted."
    },
    {
      id: "example-2",
      title: "Two containers",
      problemMd: "Some containers hold seeds and some hold sand. Does one necessarily hold both?",
      steps: [
        "Place just seeds in container One and just sand in container Two.",
        "Both existential statements have witnesses in this arrangement."
      ],
      answerMd: "No. A collection with two separate witnesses disproves the proposed guarantee."
    }
  ],
  traps: [
    {
      title: "Turning some into only some",
      md: "An existential statement promises a witness. It puts no upper bound on the number of witnesses."
    },
    {
      title: "Drawing circles too tightly",
      md: "An empty region follows from a premise. Overlapping outlines on your drawing do not supply an object in the overlap."
    }
  ],
  check: [
    {
      id: "check-1",
      title: "Negate a rule",
      topic: "Logic",
      stemMd: "What is the exact negation of “Every panel has a label”?",
      options: [
        {
          id: "A",
          text: "Every panel lacks a label.",
          note: "One missing label already defeats the claim."
        },
        {
          id: "B",
          text: "Some panel lacks a label.",
          note: ""
        },
        {
          id: "C",
          text: "Some panel has a label.",
          note: "This can hold alongside the original claim."
        },
        {
          id: "D",
          text: "There are no panels.",
          note: "An empty set supplies no counterexample."
        },
        {
          id: "E",
          text: "Exactly one panel lacks a label.",
          note: "More than one missing label also contradicts the claim."
        }
      ],
      answer: "B",
      workingMd: "A counterexample is a panel without a label. Any positive number of such panels suffices.",
      lesson: "Negating every introduces at least one exception."
    },
    {
      id: "check-2",
      title: "Trace a witness",
      topic: "Logic",
      stemMd: "Some folders are green. No green object is disposable. What must follow?",
      options: [
        {
          id: "A",
          text: "All folders are green.",
          note: "Only one green folder is guaranteed."
        },
        {
          id: "B",
          text: "Some disposable object is a folder.",
          note: "The premises supply no disposable object."
        },
        {
          id: "C",
          text: "No folder is disposable.",
          note: "Folders of other colours could be disposable."
        },
        {
          id: "D",
          text: "Some folder is non-disposable.",
          note: ""
        },
        {
          id: "E",
          text: "Every green object is a folder.",
          note: "The green class may contain many other objects."
        }
      ],
      answer: "D",
      workingMd: "Select a green folder. The exclusion applies to it, so this particular folder is non-disposable.",
      lesson: "Carry the same witness through an exclusion."
    },
    {
      id: "check-3",
      title: "Existence and empty sets",
      topic: "Logic",
      stemMd: "Every glider in a shed has a tag. The shed contains no tagged objects. Which conclusion is forced?",
      options: [
        {
          id: "A",
          text: "The shed is empty.",
          note: "Objects other than gliders could occupy the shed."
        },
        {
          id: "B",
          text: "At least one glider lacks a tag.",
          note: "Such a glider would violate the universal rule."
        },
        {
          id: "C",
          text: "Every object in the shed is a glider.",
          note: "An untagged tool would be allowed in the shed."
        },
        {
          id: "D",
          text: "Some tag is outside the shed.",
          note: "No premise guarantees that a tag exists anywhere."
        },
        {
          id: "E",
          text: "There are no gliders in the shed.",
          note: ""
        }
      ],
      answer: "E",
      workingMd: "Any glider in the shed would supply a tagged object there. This contradicts the second premise.",
      lesson: "A universal restriction can rule out the entire starting class."
    }
  ],
  takeaways: [
    "Use a witness for some and shade impossible regions for all or none.",
    "A single exception refutes a universal statement.",
    "Different existential premises can have different witnesses."
  ],
  practice: {
    examKey: "tolc-i",
    domain: "tolci-logic",
    skill: "tolci-logic-deduction"
  },
  review: {
    aiAssisted: true,
    independentCheckOn: '2026-11-10',
    expertReview: null
  }
};
