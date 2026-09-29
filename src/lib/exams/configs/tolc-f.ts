import type { ExamConfig } from '@/lib/assessment/types';
import { sectionedBlueprints, type SectionSpec } from '../sectioned-blueprints';
import {
  TOLC_NO_CALCULATOR,
  TOLC_REGULATION_2026,
  TOLC_SCORING_NOTES,
  TOLC_UNVERIFIED,
  tolcSectionNavigation,
} from '../tolc-rules';

/**
 * CISIA TOLC-F, 2026.
 *
 * The TOLC used for admission to pharmacy and pharmaceutical-science degrees,
 * among others. Structure, syllabus and scoring read first-hand on
 * 29 September 2026 from CISIA's TOLC-F structure page (table parsed directly
 * from its HTML) and the TOLC 2026 regulation; the research record is
 * docs/research/cisia-tolc.md.
 *
 * Distinctive behaviours encoded:
 *  - five consecutive, separately timed sections: Biology 15 in 20 min,
 *    Chemistry 15 in 20, Mathematics 7 in 12, Physics 7 in 12, Logic 6 in 8 -
 *    50 questions, 72 minutes;
 *  - five options, one correct; +1 / 0 / -0.25; no national pass mark;
 *  - unlike every other TOLC, its question bank is public (Regolamento 1.3).
 *    We still write only original questions.
 */

const STRUCTURE_PAGE = 'https://www.cisiaonline.it/en/tolc/tolc-f/structure-and-syllabus';
const navigation = tolcSectionNavigation(STRUCTURE_PAGE);

const SECTIONS: SectionSpec[] = [
  { key: 'biology', name: 'Biology', questions: 15, minutes: 20, domains: ['tolcf-biology'] },
  { key: 'chemistry', name: 'Chemistry', questions: 15, minutes: 20, domains: ['tolcf-chemistry'] },
  { key: 'mathematics', name: 'Mathematics', questions: 7, minutes: 12, domains: ['tolcf-mathematics'] },
  { key: 'physics', name: 'Physics', questions: 7, minutes: 12, domains: ['tolcf-physics'] },
  { key: 'logic', name: 'Logic', questions: 6, minutes: 8, domains: ['tolcf-logic'] },
];

const skill = (slug: string, name: string, description: string) => ({ slug, name, description });

const section = (spec: SectionSpec, order: number) => ({
  key: spec.key,
  name: spec.name,
  order,
  officialQuestionCount: String(spec.questions),
  officialTimeMinutes: spec.minutes,
  calculator: 'none' as const,
  calculatorNote: TOLC_NO_CALCULATOR,
  navigation,
  responseTypes: ['single_select' as const],
  notes: [`${spec.name}: ${spec.questions} questions in ${spec.minutes} minutes (CISIA structure table).`],
});

export const tolcFConfig: ExamConfig = {
  examKey: 'tolc-f',
  version: '2026.09',
  name: 'CISIA TOLC-F (Pharmacy)',
  shortName: 'TOLC-F',
  publisher: 'CISIA',
  versionLabel:
    'TOLC-F as delivered in 2026. Structure and syllabus verified from CISIA’s TOLC-F structure page; scoring, answer format and conduct rules from the Regolamento TOLC 2026.',
  admissionsCycle: 'Calendar year 2026 (CISIA announces changes to TOLC structure by 31 December each year)',
  verifiedOn: '2026-09-29',
  audience: ['undergraduate'],
  summary:
    'The TOLC-F is the CISIA online test that universities use for admission to pharmacy and pharmaceutical-science degrees, among others. It has five consecutive, separately timed sections: Biology 15 questions in 20 minutes, Chemistry 15 in 20, Mathematics 7 in 12, Physics 7 in 12 and Logic 6 in 8 - 50 questions in 72 minutes - followed by a separately scored 30-question English section. Each question has five options, one correct; a correct answer scores 1, a blank 0 and a wrong answer -0.25. There is no national pass mark: each university sets its own. It can be taken at a university (TOLC@UNI) or from home under remote proctoring (TOLC@CASA), at most once per calendar month.',

  sources: [
    { label: 'TOLC-F structure and syllabus', url: STRUCTURE_PAGE, publisher: 'CISIA', verifiedOn: '2026-09-29' },
    {
      label: 'Regolamento TOLC 2026 (answer format, scoring, public TOLC-F question bank, conduct, attempts)',
      url: TOLC_REGULATION_2026,
      publisher: 'CISIA',
      verifiedOn: '2026-09-29',
    },
  ],

  sections: SECTIONS.map((spec, index) => section(spec, index)),

  domains: [
    {
      slug: 'tolcf-biology',
      name: 'Biology',
      sectionKey: 'biology',
      description: 'The topics of CISIA’s TOLC-F Biology syllabus.',
      officialShare: '15 of 50 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolcf-bio-molecules', 'Chemistry of living things', 'Bioelements, water, and the structure and function of biological molecules and enzymes.'),
        skill('tolcf-bio-diversity', 'Biodiversity', 'Levels of organisation, domains and kingdoms, viruses.'),
        skill('tolcf-bio-cell', 'Cell biology', 'Prokaryotic and eukaryotic cells and their constituents.'),
        skill('tolcf-bio-genetics', 'Cell cycle, reproduction and heredity', 'Mitosis and meiosis, Mendelian, classical, molecular and human genetics, mutation.'),
        skill('tolcf-bio-bioenergetics', 'Bioenergetics', 'Photosynthesis, glycolysis, aerobic respiration and fermentation.'),
        skill('tolcf-bio-ecology', 'Ecology', 'Ecosystems, food chains and interactions between species.'),
        skill('tolcf-bio-anatomy-physiology', 'Human anatomy and physiology', 'The organ systems of the human body and their functions.'),
      ],
    },
    {
      slug: 'tolcf-chemistry',
      name: 'Chemistry',
      sectionKey: 'chemistry',
      description: 'The topics of CISIA’s TOLC-F Chemistry syllabus.',
      officialShare: '15 of 50 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolcf-chem-atoms-periodic', 'Atoms, the periodic table and bonding', 'Atomic structure, isotopes, periodic properties, ionic and covalent bonds, electronegativity.'),
        skill('tolcf-chem-inorganic', 'Inorganic compounds', 'Nomenclature and properties of oxides, hydroxides, acids and salts.'),
        skill('tolcf-chem-stoichiometry-redox', 'Reactions, stoichiometry and redox', 'The mole, simple stoichiometry, balancing, oxidation numbers, oxidants and reductants.'),
        skill('tolcf-chem-solutions-acids-bases', 'Solutions, acids and bases', 'Solubility, concentration, acids and bases, pH.'),
        skill('tolcf-chem-organic', 'Organic chemistry', 'Carbon bonding, formulas, isomerism, hydrocarbons and functional groups.'),
      ],
    },
    {
      slug: 'tolcf-mathematics',
      name: 'Mathematics',
      sectionKey: 'mathematics',
      description: 'The topics of CISIA’s TOLC-F Mathematics syllabus.',
      officialShare: '7 of 50 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolcf-math-numbers', 'Numbers, ratios and percentages', 'Number sets, primes, gcd and lcm, ratios, proportions, percentages, powers and roots.'),
        skill('tolcf-math-algebra', 'Algebra, equations and inequalities', 'Polynomials, factorisation, first- and second-degree, exponential and logarithmic equations and inequalities, systems.'),
        skill('tolcf-math-functions-trig', 'Functions and trigonometry', 'Domain, image, monotonicity, composition, inverses, elementary graphs; degrees, radians and basic trigonometric relations.'),
        skill('tolcf-math-geometry', 'Plane, solid and analytic geometry', 'Plane figures, Pythagoras, similarity, solids; lines, parabolas and circles in coordinates.'),
        skill('tolcf-math-probability', 'Combinatorics, probability and statistics', 'Factorials, binomial coefficients, probability of events, arithmetic mean.'),
      ],
    },
    {
      slug: 'tolcf-physics',
      name: 'Physics',
      sectionKey: 'physics',
      description: 'The topics of CISIA’s TOLC-F Physics syllabus.',
      officialShare: '7 of 50 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolcf-phys-measures', 'Measures and units', 'Quantities, dimensions, units and conversions, scientific notation, errors, proportionality.'),
        skill('tolcf-phys-mechanics', 'Kinematics, forces and energy', 'Motion, Newton’s laws, gravitation, work, energy and momentum.'),
        skill('tolcf-phys-fluids-thermo', 'Fluids and thermodynamics', 'Density, pressure, Stevin, Pascal and Archimedes; temperature, heat, gas laws and the principles of thermodynamics.'),
        skill('tolcf-phys-electricity-waves', 'Electricity, magnetism, waves and optics', 'Coulomb, circuits and Ohm’s law, magnetic fields, waves, reflection, refraction and lenses.'),
      ],
    },
    {
      slug: 'tolcf-logic',
      name: 'Logic',
      sectionKey: 'logic',
      description: 'CISIA’s TOLC-F Logic syllabus: logic and language.',
      officialShare: '6 of 50 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolcf-logic-propositions', 'Propositions and conditions', 'Logic of propositions; necessary and sufficient conditions.'),
        skill('tolcf-logic-graphs-tables', 'Graphs and tables', 'Interpreting graphic representations and tables.'),
        skill('tolcf-logic-math-reasoning', 'Reasoning with elementary mathematics', 'Short problems that turn on an elementary mathematical idea.'),
      ],
    },
  ],

  blueprints: sectionedBlueprints({
    examLabel: 'TOLC-F',
    sections: SECTIONS,
    diagnosticPerSection: 3,
    diagnosticSecondsPerItem: 150,
    responseTypes: ['single_select'],
    simulationFidelityNote:
      'Matches the published TOLC-F: five sections in the published order - Biology 15 in 20 minutes, Chemistry 15 in 20, Mathematics 7 in 12, Physics 7 in 12, Logic 6 in 8 - five options per question, +1 / 0 / -0.25, no calculator, and no return to a closed section. What differs: our questions are original, not from CISIA’s public TOLC-F bank, and their difficulty is our editorial judgement; CISIA does not describe moving between questions within a section, so we let you move back inside the open section; and the separately scored 30-question English section is not included.',
    timedFidelityNote: (s) =>
      `The published length and clock of the TOLC-F ${s.name} section, with CISIA’s scoring. Our questions are original and their difficulty is editorial; moving back within the section is allowed here, a rule CISIA does not describe.`,
    diagnosticFidelityNote:
      'A short skill check, not a predictor of a TOLC-F score. It has three questions from each section at a generous pace and lets you move back and change answers. Use it to find weak areas.',
    practiceFidelityNote:
      'A study tool, not a reproduction of the exam: untimed, free navigation, and whatever section, topic and difficulty you choose.',
  }),

  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: -0.25,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'TOLC-F absolute score, excluding English, out of 50',
      min: -12.5,
      max: 50,
      increment: 0.25,
      note: 'CISIA reports an absolute score for the five main sections: 50 questions at 1 point, with the -0.25 penalty. The minimum shown is the arithmetic floor if every question were answered wrongly; CISIA does not say whether a negative total is reported as such. The English section is reported separately on its own 0-30 scale.',
    },
    scaledEstimate: {
      enabled: false,
      reason: 'CISIA reports the absolute score itself; transformations are each university’s own and are not modelled here.',
    },
    rawProjection: {
      scoredItems: 50,
      reportFactor: 1,
      thresholds: [],
      noThresholdReason:
        'CISIA sets no pass mark for the TOLC-F. Each university may transform the score, weight the five sections and set its own minimum, often different for each programme. Check the admission notice (bando) of the programme you are applying to, and set that number as your target.',
      conditions: '50 questions in five separately timed sections, 72 minutes, no calculator or other aids',
      caveats: [
        'It covers the five main sections only. The English section is scored separately.',
        'A university that weights sections differently will turn the same answers into a different result.',
      ],
    },
    notes: [
      ...TOLC_SCORING_NOTES,
      'Unlike every other TOLC, the TOLC-F draws its questions from a public bank that candidates can consult (Regolamento TOLC 2026, 1.3). Our questions are original and are not taken from it.',
    ],
  },

  capabilities: {
    fullSimulation: {
      available: true,
      note:
        'Structure, section clocks, answer format and scoring are published by CISIA and verified. Labelled an approximation because CISIA does not describe navigation within a section, and because the separately scored English section is not included.',
    },
    adaptiveRouting: {
      available: false,
      reason: 'The TOLC is not adaptive. Tests are generated from, or selected among, forms of analogous difficulty (Regolamento TOLC 2026, 1.2).',
    },
    scaledScoreEstimate: {
      available: false,
      reason: 'There is no national scaled score. Universities transform the absolute score in their own ways.',
    },
  },

  unverified: [...TOLC_UNVERIFIED],
};
