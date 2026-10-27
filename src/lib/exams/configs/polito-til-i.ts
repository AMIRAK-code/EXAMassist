import type { ExamConfig, NavigationPolicy } from '@/lib/assessment/types';
import { sectionedBlueprints, type SectionSpec } from '../sectioned-blueprints';

/**
 * Politecnico di Torino - TIL-I (Test In Laib, Ingegneria), a.y. 2026/27.
 *
 * The admission test for PoliTo's Engineering-area bachelor's programmes.
 * Every rule below was read first-hand on 29 September 2026 from the official
 * call for applications (bando) for a.y. 2026/27 and the official admission
 * test page; the research record is docs/research/polito-til.md.
 *
 * Distinctive behaviours encoded:
 *  - four consecutive sections, each with its own clock (36, 20, 22, 12 min);
 *  - five options per question, one correct; +1 / 0 / -0.25;
 *  - the score is reported out of 100, with PUBLISHED thresholds: 30/100 to
 *    enter the ranking and 60/100 to be admitted to the first-choice programme;
 *  - no calculator.
 */

const CALL_2026_27 =
  'https://www.polito.it/sites/default/files/2025-12/Bando%20Ingegneria%20comunitari%20Extra%2026_27.pdf';
const TEST_PAGE =
  'https://www.polito.it/en/education/applying-studying-graduating/admissions-and-enrolment/bachelor-s-degree-programmes/admission-test';

/**
 * Test-day navigation. Sections are timed separately and taken in order.
 * Moving back WITHIN a section is not described in the call or on the test
 * page; we allow it and say so in `unverified` and on every blueprint.
 */
const sectionNavigation: NavigationPolicy = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: false,
  allowReturnToPreviousPart: false,
  reviewScreen: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: CALL_2026_27,
};

const NO_CALCULATOR =
  'No calculator. Art. 9 of the 2026/27 call forbids personal materials "quale: fogli, quaderni, appunti, calcolatrici"; only the blank sheets and pen or pencil handed out by the room committee may be used. A non-programmable calculator is permitted only to candidates with a certified disability or specific learning disorder (art. 6).';

const SECTIONS: SectionSpec[] = [
  { key: 'mathematics', name: 'Mathematics', questions: 16, minutes: 36, domains: ['tili-mathematics'] },
  {
    key: 'reading-logic',
    name: 'Reading comprehension and logic',
    questions: 10,
    minutes: 20,
    domains: ['tili-reading-comprehension', 'tili-logic'],
  },
  { key: 'physics', name: 'Physics', questions: 10, minutes: 22, domains: ['tili-physics'] },
  {
    key: 'technical-knowledge',
    name: 'Basic technical knowledge',
    questions: 6,
    minutes: 12,
    domains: ['tili-representation', 'tili-computer-science'],
  },
];

const skill = (slug: string, name: string, description: string) => ({ slug, name, description });

export const politoTilIConfig: ExamConfig = {
  examKey: 'polito-til-i',
  version: '2026.09',
  name: 'Politecnico di Torino TIL-I (Engineering)',
  shortName: 'TIL-I',
  publisher: 'Politecnico di Torino',
  versionLabel:
    'TIL-I for admission to the Engineering-area bachelor’s programmes, a.y. 2026/27. Structure, timing, scoring and thresholds verified from the official 2026/27 call for applications and the official admission test page.',
  admissionsCycle: 'Academic year 2026/27 (the score is valid only for enrolment in 2026/27)',
  verifiedOn: '2026-09-29',
  audience: ['undergraduate'],
  summary:
    "Politecnico di Torino's own admission test for its Engineering-area bachelor's programmes, taken in person on the university's computers. It is 42 questions in four consecutive, separately timed sections - Mathematics 16 questions in 36 minutes, Reading comprehension and logic 10 in 20, Physics 10 in 22, Basic technical knowledge 6 in 12 - 90 minutes in all. Each question has five options, one correct; a correct answer scores 1, a blank 0 and a wrong answer -0.25. The score is reported out of 100. PoliTo publishes two thresholds: 30/100 to be placed in the ranking, and 60/100 to be admitted straight to the programme of first preference. The test can be taken up to three times, once per session, and the best result counts. No calculator is allowed. The test is available in Italian and in English.",

  sources: [
    {
      label: 'Call for applications, Engineering area, a.y. 2026/27 (arts. 3, 5, 7, 8, 9: thresholds, attempts, content, scoring, conduct)',
      url: CALL_2026_27,
      publisher: 'Politecnico di Torino',
      verifiedOn: '2026-09-29',
    },
    {
      label: 'Admission test (TIL) page: TIL-I format, scoring and macro-topics',
      url: TEST_PAGE,
      publisher: 'Politecnico di Torino',
      verifiedOn: '2026-09-29',
    },
  ],

  sections: [
    {
      key: 'mathematics',
      name: 'Mathematics',
      order: 0,
      officialQuestionCount: '16',
      officialTimeMinutes: 36,
      calculator: 'none',
      calculatorNote: NO_CALCULATOR,
      navigation: sectionNavigation,
      responseTypes: ['single_select'],
      notes: [
        'Art. 7: "16 quesiti di Matematica in 36 minuti".',
        'A Mathematics score below 30% of the section maximum (below 4.8 out of 16) assigns remedial obligations (OFA) to an admitted candidate (art. 8.3). It does not affect admission.',
      ],
    },
    {
      key: 'reading-logic',
      name: 'Reading comprehension and logic',
      order: 1,
      officialQuestionCount: '10',
      officialTimeMinutes: 20,
      calculator: 'none',
      calculatorNote: NO_CALCULATOR,
      navigation: sectionNavigation,
      responseTypes: ['single_select'],
      notes: [
        'Art. 7: "10 quesiti di Comprensione del testo e logica in 20 minuti".',
        'The admission test page describes two excerpts, each followed by three questions, plus five logic questions: eleven in all, against the ten the call states. The call is the legal document, so we follow its ten and do not fix the split between reading and logic.',
        'Reading answers must be deduced exclusively from the excerpt, not from the candidate’s own knowledge.',
      ],
    },
    {
      key: 'physics',
      name: 'Physics',
      order: 2,
      officialQuestionCount: '10',
      officialTimeMinutes: 22,
      calculator: 'none',
      calculatorNote: NO_CALCULATOR,
      navigation: sectionNavigation,
      responseTypes: ['single_select'],
      notes: ['Art. 7: "10 quesiti di Fisica in 22 minuti".'],
    },
    {
      key: 'technical-knowledge',
      name: 'Basic technical knowledge',
      order: 3,
      officialQuestionCount: '6',
      officialTimeMinutes: 12,
      calculator: 'none',
      calculatorNote: NO_CALCULATOR,
      navigation: sectionNavigation,
      responseTypes: ['single_select'],
      notes: [
        'Art. 7: "6 quesiti di Conoscenze tecniche di base in 12 minuti".',
        'The admission test page: "3 questions on Representation and 3 questions on Computer Science".',
      ],
    },
  ],

  domains: [
    {
      slug: 'tili-mathematics',
      name: 'Mathematics',
      sectionKey: 'mathematics',
      description: 'The macro-topics PoliTo lists for the TIL-I Mathematics section.',
      officialShare: '16 of 42 questions',
      source: TEST_PAGE,
      skills: [
        skill('tili-math-numbers', 'Natural, integer and rational numbers', 'Natural, relative and rational numbers; simple problems solved with elementary methods.'),
        skill('tili-math-reals-radicals', 'Real numbers, powers and radicals', 'Real numbers, radicals, and calculation with exponents and radicals.'),
        skill('tili-math-statistics-probability', 'Statistics and probability', 'Basics of statistics and probability.'),
        skill('tili-math-euclidean-geometry', 'Plane and solid geometry', 'Euclidean plane geometry and basic spatial geometry; areas and volumes of elementary figures.'),
        skill('tili-math-polynomials', 'Monomials and polynomials', 'Monomial and polynomial algebra.'),
        skill('tili-math-analytic-exp-log', 'Analytic geometry, exponentials and logarithms', 'Analytic geometry; exponentials and logarithms and their properties, including change of base.'),
        skill('tili-math-trigonometry', 'Goniometry and trigonometry', 'Angles, trigonometric functions and their relationships.'),
        skill('tili-math-graphs', 'Elementary graphs and plane regions', 'Graphs of first- and second-degree polynomials, absolute value, exponential, logarithmic and trigonometric functions; subsets of the plane bounded by them.'),
        skill('tili-math-algebraic-equations', 'Algebraic equations and inequalities', 'Algebraic, irrational and absolute-value equations and inequalities.'),
        skill('tili-math-transcendental-equations', 'Exponential, logarithmic and trigonometric equations', 'Exponential, logarithmic and trigonometric equations and inequalities.'),
      ],
    },
    {
      slug: 'tili-reading-comprehension',
      name: 'Reading comprehension',
      sectionKey: 'reading-logic',
      description: 'Excerpts from scientific, popular, historical or sociological texts, each followed by questions answerable only from the excerpt.',
      officialShare: null,
      source: TEST_PAGE,
      skills: [
        skill('tili-reading-stated', 'What the excerpt states', 'Identifying information the excerpt states explicitly.'),
        skill('tili-reading-inferred', 'What the excerpt implies', 'Drawing the conclusion the excerpt supports, and rejecting ones it does not.'),
        skill('tili-reading-purpose', 'Purpose and structure', 'The aim of the excerpt, and the role of a sentence or paragraph within it.'),
      ],
    },
    {
      slug: 'tili-logic',
      name: 'Logic',
      sectionKey: 'reading-logic',
      description: 'Logic questions that need no prior knowledge, only abstract logical-deductive reasoning.',
      officialShare: null,
      source: TEST_PAGE,
      skills: [
        skill('tili-logic-orders', 'Orders and arrangements', 'Ordering and arrangement problems.'),
        skill('tili-logic-quantifiers', 'Quantifiers', 'Use of "all", "some" and "none".'),
        skill('tili-logic-deduction', 'Logical deduction', 'Deducing what must follow from given premises.'),
        skill('tili-logic-problems', 'Elementary logic problems', 'Short puzzles solved by reasoning rather than calculation.'),
        skill('tili-logic-negation', 'Negating statements', 'Forming the correct negation of a statement.'),
      ],
    },
    {
      slug: 'tili-physics',
      name: 'Physics',
      sectionKey: 'physics',
      description: 'The macro-topics PoliTo lists for the TIL-I Physics section.',
      officialShare: '10 of 42 questions',
      source: TEST_PAGE,
      skills: [
        skill('tili-phys-vectors-units', 'Vectors and units of measurement', 'Vectors and operations on them; units and conversions.'),
        skill('tili-phys-kinematics', 'Kinematics', 'Motion in one and two dimensions.'),
        skill('tili-phys-dynamics', 'Forces and dynamics', 'Forces and the dynamics of a point mass.'),
        skill('tili-phys-work-energy', 'Work and energy', 'Work, kinetic and potential energy, and their conservation.'),
        skill('tili-phys-thermal', 'Calorimetry and thermodynamics', 'Heat, specific heat, and the principles of thermodynamics.'),
        skill('tili-phys-electricity', 'Electrostatics and circuits', 'Electric charge, field and potential; direct-current circuits.'),
      ],
    },
    {
      slug: 'tili-representation',
      name: 'Representation',
      sectionKey: 'technical-knowledge',
      description: 'Relating the spatial form of objects to their two- and three-dimensional representation, and basic graphic-technical conventions.',
      officialShare: '3 of 6 questions in the section',
      source: TEST_PAGE,
      skills: [
        skill('tili-rep-projections', 'Views and projections', 'Matching an object with its views, sections and projections.'),
        skill('tili-rep-conventions', 'Graphic-technical conventions', 'Scales, symbols and the coding of technical drawings.'),
      ],
    },
    {
      slug: 'tili-computer-science',
      name: 'Computer science',
      sectionKey: 'technical-knowledge',
      description: 'Basic understanding of programs and information technology, as listed on the admission test page.',
      officialShare: '3 of 6 questions in the section',
      source: TEST_PAGE,
      skills: [
        skill('tili-cs-variables-assignment', 'Variables and assignment', 'Variables, assignment, and the difference between testing and assigning.'),
        skill('tili-cs-control-flow', 'Conditions and loops', 'If-then-else, for, while and repeat-until; tracing what a short program does.'),
        skill('tili-cs-operators', 'Arithmetic and logical operators', 'Arithmetic and logical operators, and exact integer arithmetic.'),
        skill('tili-cs-data-units', 'Bits, bytes and hardware basics', 'Bits, bytes and the transistor; the size of data.'),
      ],
    },
  ],

  blueprints: sectionedBlueprints({
    examLabel: 'TIL-I',
    sections: SECTIONS,
    diagnosticPerSection: 3,
    diagnosticSecondsPerItem: 180,
    responseTypes: ['single_select'],
    simulationFidelityNote:
      'Matches the published TIL-I: four sections in the published order with their published lengths and clocks, 90 minutes in all, five options per question, +1 / 0 / -0.25, no calculator, and no return to a closed section. What differs: our questions are original, not PoliTo items, and their difficulty is our editorial judgement; PoliTo does not describe moving between questions within a section, so we let you move back and change answers inside the open section; PoliTo does not fix how the ten reading-and-logic questions divide between the two, so ours may split differently; and the real Representation questions show drawings, while ours pose the same spatial problems through tables and text, because this site does not yet render figures.',
    timedFidelityNote: (section) =>
      `The published length and clock of the TIL-I ${section.name} section, with the published scoring. Our questions are original and their difficulty is editorial; moving back within the section is allowed here, a rule PoliTo does not describe.`,
    diagnosticFidelityNote:
      'A short skill check, not a predictor of a TIL-I score. It has three questions from each section, about three minutes per question (well over the real pace), and lets you move back and change answers. Use it to find weak areas.',
    practiceFidelityNote:
      'A study tool, not a reproduction of the exam: untimed, free navigation, and whatever section, topic and difficulty you choose.',
  }),

  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: -0.25,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'TIL-I score out of 100',
      min: -25,
      max: 100,
      increment: 0.01,
      note: 'Art. 8.2: "Il punteggio è convertito in centesimi e calcolato fino alla seconda cifra decimale." The raw score is out of 42 (42 questions at 1 point); the reported score is that raw score converted to a scale of 100. The minimum shown is the arithmetic floor if every question were answered wrongly (-10.5 of 42); PoliTo does not say whether the reported score can be negative.',
    },
    scaledEstimate: {
      enabled: false,
      reason:
        'Nothing to estimate: PoliTo reports the raw penalty-adjusted score, converted to a scale of 100 by simple proportion. There is no equating to model.',
    },
    rawProjection: {
      scoredItems: 42,
      reportFactor: 100 / 42,
      thresholds: [
        {
          value: 30,
          label: 'Ranking threshold',
          meaning:
            'The published minimum to be placed in the ranking for the Engineering-area programmes (art. 3.1.a). Below it an application is not ranked.',
          source: CALL_2026_27,
        },
        {
          value: 60,
          label: 'Guarantee threshold',
          meaning:
            'The published score that allows enrolment in the programme of first preference (art. 3.1.b).',
          source: CALL_2026_27,
        },
      ],
      noThresholdReason: null,
      conditions: '42 questions in four separately timed sections, 90 minutes, no calculator',
      caveats: [
        'It ignores the Mathematics remedial threshold (below 4.8 out of 16), which assigns extra coursework after admission but does not affect it.',
        'Up to three attempts are allowed and the best counts; the projection is for one sitting.',
      ],
    },
    notes: [
      'Official scoring, art. 8.1: "1 punto per ogni risposta corretta; 0 punti per ogni risposta non data; meno 0,25 punti per ogni risposta errata."',
      'Five options per question, one correct (art. 7.2). With five options a blind guess has an expected value of 0.2 - 0.8 x 0.25 = 0, so it neither gains nor loses on average; eliminating even one option makes guessing worth it.',
      'Thresholds, art. 3: 30/100 to enter the ranking; 60/100 to enrol in the first-preference programme. For the Industrial Manufacturing Technologies programme the ranking threshold is any score above 0.',
      'Up to three attempts, once per session; the best result counts (art. 5.4).',
      'SAT scores (at least 650 in each of Evidence-Based Reading and Writing and Math) may be submitted instead of the TIL-I; they give a place in the ranking but no guarantee threshold (arts. 3.2, 12).',
    ],
  },

  capabilities: {
    fullSimulation: {
      available: true,
      note:
        'Structure (42 questions: 16 / 10 / 10 / 6), section clocks (36 / 20 / 22 / 12 minutes), answer format (five options, one correct), scoring (+1 / 0 / -0.25, reported out of 100) and the thresholds are all published and verified from the 2026/27 call. The simulation is labelled an approximation because PoliTo does not describe navigation within a section.',
    },
    adaptiveRouting: {
      available: false,
      reason:
        'The TIL-I is not adaptive. The call says each test is drawn at random from a question bank and that all tests have equivalent difficulty (art. 7.1).',
    },
    scaledScoreEstimate: {
      available: false,
      reason:
        'There is no scaled score. The reported score is the raw penalty-adjusted score converted to 100 by proportion, which the readiness page computes directly.',
    },
  },

  unverified: [
    'Whether candidates can move back to earlier questions, or change answers, within an open section. Neither the call nor the admission test page describes it; our simulation allows it.',
    'Whether sections must be taken in the order the call lists them, and whether a section can be closed early to move on. We deliver them in the listed order with no return.',
    'How the ten Reading comprehension and logic questions divide between reading and logic: the test page describes two excerpts of three questions plus five logic questions, which is eleven, not ten.',
    'Whether the reported score can be negative, or is floored at zero.',
  ],
};
