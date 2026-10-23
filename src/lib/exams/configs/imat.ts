import type { Blueprint, BlueprintPart, ExamConfig, NavigationPolicy } from '@/lib/assessment/types';
import { studyNavigation } from './_sectioned';

/**
 * IMAT - International Medical Admissions Test, a.y. 2026/27.
 *
 * The national admission test for the English-taught degree programmes in
 * Medicine and Surgery, Dentistry and Veterinary Medicine at Italian public
 * universities, set by the Ministry of University and Research (MUR). The
 * 2025 reform that replaced the entrance test with a "filter semester" for the
 * Italian-taught programmes is reported NOT to apply to the English-taught
 * ones, which still admit by the IMAT ranking.
 *
 * DRAFT. Nothing here has been verified first-hand: mur.gov.it and
 * universitaly.it were unreachable from the build environment, and the
 * third-party guides that could be read disagree with each other (even on the
 * 2026 test date). The format below follows the IMAT as set in recent
 * ministerial decrees, as the author understood it. The config is in
 * `DRAFT_EXAM_CONFIGS` until the 2026/27 decree and its annex are read.
 *
 * The real IMAT is in English only. Questions here are also offered in
 * Italian as a study aid, because many candidates study the sciences in
 * Italian; the simulation is always in English.
 */

const MUR_ADMISSIONS = 'https://www.mur.gov.it/it/aree-tematiche/universita/accesso-ai-corsi-a-numero-programmato';
const UNIVERSITALY = 'https://www.universitaly.it/';
const UNVERIFIED_ON = 'not yet verified';
const SECTION_KEY = 'imat';

/** One block, free movement and changes throughout (as drafted; unverified). */
const navigation: NavigationPolicy = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  allowReturnToPreviousPart: true,
  reviewScreen: true,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: MUR_ADMISSIONS,
};

const AREAS = [
  { slug: 'imat-reading-knowledge', name: 'Reading skills and knowledge acquired in studies', questions: 4 },
  { slug: 'imat-logic', name: 'Logical reasoning and problems', questions: 5 },
  { slug: 'imat-biology', name: 'Biology', questions: 23 },
  { slug: 'imat-chemistry', name: 'Chemistry', questions: 15 },
  { slug: 'imat-physics-maths', name: 'Physics and mathematics', questions: 13 },
] as const;

const TOTAL = AREAS.reduce((sum, a) => sum + a.questions, 0);

const skill = (slug: string, name: string, description: string) => ({ slug, name, description });

function areaPart(prefix: string, area: (typeof AREAS)[number], itemCount: number, nav: Partial<NavigationPolicy> | null): BlueprintPart {
  return {
    key: `${prefix}-${area.slug}`,
    sectionKey: SECTION_KEY,
    label: area.name,
    timeLimitSeconds: null,
    itemCount,
    selection: {
      sectionKey: SECTION_KEY,
      domains: [area.slug],
      skills: [],
      responseTypes: ['single_select'],
      difficultyMix: null,
      allowRepeatsWithinAttempt: false,
      avoidSeenWithinDays: 30,
    },
    navigationOverride: nav,
    breakAfterSeconds: null,
    adaptive: null,
  };
}

const blueprints: Blueprint[] = [
  {
    id: 'simulation-full',
    label: 'Full simulation - IMAT',
    mode: 'simulation',
    description: `The drafted IMAT structure: ${TOTAL} questions in one 100-minute block, in the published subject mix, with free movement between questions. In English, as on the day.`,
    parts: AREAS.map((area) => areaPart('simulation', area, area.questions, null)),
    timing: 'overall',
    overallTimeLimitSeconds: 100 * 60,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote:
      'Follows the IMAT format as drafted (60 questions, 100 minutes, +1.5 / 0 / -0.4), not yet verified against the 2026/27 ministerial decree. Our questions are original and their difficulty is editorial.',
  },
  {
    id: 'diagnostic',
    label: 'IMAT diagnostic skill check',
    mode: 'diagnostic',
    description: 'A short check across every IMAT subject, timed generously, to find the subjects to work on first.',
    parts: [
      areaPart('diagnostic', AREAS[0], 2, studyNavigation),
      areaPart('diagnostic', AREAS[1], 2, studyNavigation),
      areaPart('diagnostic', AREAS[2], 4, studyNavigation),
      areaPart('diagnostic', AREAS[3], 3, studyNavigation),
      areaPart('diagnostic', AREAS[4], 3, studyNavigation),
    ],
    timing: 'overall',
    overallTimeLimitSeconds: 14 * 180,
    pauseBehaviour: 'clock_pauses',
    fidelity: 'practice_only',
    fidelityNote: 'A skill check, not a predictor of an IMAT score: 14 questions, about three minutes each, free movement.',
  },
  {
    id: 'practice',
    label: 'IMAT practice set',
    mode: 'practice',
    description: 'An untimed 10-question set. Choose the subject, topic, difficulty and length before you start.',
    parts: [
      {
        ...areaPart('practice', AREAS[2], 10, studyNavigation),
        key: 'practice-mixed',
        label: 'Mixed practice',
        selection: { ...areaPart('practice', AREAS[2], 10, null).selection, sectionKey: '*', domains: [], responseTypes: [] },
      },
    ],
    timing: 'untimed',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'not_applicable',
    fidelity: 'practice_only',
    fidelityNote: 'A study tool, not a reproduction of the exam: untimed, free navigation, any subject, and available in Italian.',
  },
];

export const imatConfig: ExamConfig = {
  examKey: 'imat',
  version: '2026.10-draft',
  name: 'IMAT - International Medical Admissions Test',
  shortName: 'IMAT',
  publisher: 'Ministero dell’Università e della Ricerca (MUR)',
  versionLabel:
    'IMAT for admission to the English-taught Medicine and Surgery, Dentistry and Veterinary Medicine programmes at Italian public universities, a.y. 2026/27. DRAFT: format and scoring not yet verified against the 2026/27 ministerial decree.',
  admissionsCycle: 'Academic year 2026/27 (draft; to be confirmed against the ministerial decree)',
  verifiedOn: UNVERIFIED_ON,
  audience: ['undergraduate'],
  summary:
    'The national entrance test for the English-taught medicine, dentistry and veterinary programmes at Italian public universities. It is 60 multiple-choice questions in 100 minutes: Reading skills and knowledge acquired in studies 4, Logical reasoning and problems 5, Biology 23, Chemistry 15, Physics and mathematics 13. A correct answer scores 1.5, a blank 0 and a wrong answer -0.4, for a maximum of 90; candidates are ranked nationally, and a minimum score is required to enter the ranking. The test is in English. Draft summary, not yet verified against the 2026/27 decree.',
  sources: [
    { label: 'MUR: admission to programmes with limited places', url: MUR_ADMISSIONS, publisher: 'MUR', verifiedOn: UNVERIFIED_ON },
    { label: 'Universitaly: registration for the IMAT', url: UNIVERSITALY, publisher: 'MUR / CINECA', verifiedOn: UNVERIFIED_ON },
  ],
  sections: [
    {
      key: SECTION_KEY,
      name: 'IMAT',
      order: 0,
      officialQuestionCount: String(TOTAL),
      officialTimeMinutes: 100,
      calculator: 'none',
      calculatorNote: 'No calculator (as drafted; unverified). Candidates are reported to be barred from bringing calculators, phones or any other aid.',
      navigation,
      responseTypes: ['single_select'],
      notes: AREAS.map((a) => `${a.name}: ${a.questions} questions (drafted, unverified).`),
    },
  ],
  domains: [
    {
      slug: 'imat-reading-knowledge',
      name: AREAS[0].name,
      sectionKey: SECTION_KEY,
      description: 'Reading comprehension and general knowledge from secondary school studies.',
      officialShare: '4 of 60 questions',
      source: MUR_ADMISSIONS,
      skills: [
        skill('imat-read-comprehension', 'Reading comprehension', 'Understanding and drawing conclusions from short texts.'),
        skill('imat-read-general-knowledge', 'Knowledge acquired in studies', 'Literary, historical, philosophical, social and institutional culture from secondary school.'),
      ],
    },
    {
      slug: 'imat-logic',
      name: AREAS[1].name,
      sectionKey: SECTION_KEY,
      description: 'Reasoning from given information, and problems solved by reasoning.',
      officialShare: '5 of 60 questions',
      source: MUR_ADMISSIONS,
      skills: [
        skill('imat-logic-critical', 'Critical thinking', 'Assumptions, conclusions, flaws and the strength of arguments.'),
        skill('imat-logic-problem-solving', 'Problem solving', 'Numerical and spatial problems solved with reasoning and simple arithmetic.'),
      ],
    },
    {
      slug: 'imat-biology',
      name: 'Biology',
      sectionKey: SECTION_KEY,
      description: 'Secondary-school biology.',
      officialShare: '23 of 60 questions',
      source: MUR_ADMISSIONS,
      skills: [
        skill('imat-bio-molecules-cells', 'Biomolecules and the cell', 'Chemistry of living things, cell structure and function, membranes and transport.'),
        skill('imat-bio-bioenergetics', 'Bioenergetics', 'Enzymes, respiration and photosynthesis.'),
        skill('imat-bio-genetics', 'Genetics and heredity', 'DNA, gene expression, Mendelian genetics and biotechnology.'),
        skill('imat-bio-reproduction', 'Cell division and reproduction', 'Mitosis, meiosis and reproduction.'),
        skill('imat-bio-anatomy-physiology', 'Human anatomy and physiology', 'Tissues, organs and systems of the human body.'),
        skill('imat-bio-evolution-ecology', 'Evolution and diversity', 'Evolution, classification and the diversity of living things.'),
      ],
    },
    {
      slug: 'imat-chemistry',
      name: 'Chemistry',
      sectionKey: SECTION_KEY,
      description: 'Secondary-school chemistry.',
      officialShare: '15 of 60 questions',
      source: MUR_ADMISSIONS,
      skills: [
        skill('imat-chem-atoms-periodic', 'Atoms and the periodic table', 'Atomic structure, electron configuration and periodic trends.'),
        skill('imat-chem-bonding', 'Bonding and molecules', 'Chemical bonds, molecular shape and intermolecular forces.'),
        skill('imat-chem-stoichiometry', 'Stoichiometry and solutions', 'The mole, equations, concentration and solutions.'),
        skill('imat-chem-reactions', 'Reactions, equilibrium, acids and bases', 'Reaction types, redox, equilibrium, pH and buffers.'),
        skill('imat-chem-organic', 'Organic chemistry', 'Functional groups, isomerism and simple organic reactions.'),
      ],
    },
    {
      slug: 'imat-physics-maths',
      name: AREAS[4].name,
      sectionKey: SECTION_KEY,
      description: 'Secondary-school physics and mathematics.',
      officialShare: '13 of 60 questions',
      source: MUR_ADMISSIONS,
      skills: [
        skill('imat-math-algebra-functions', 'Algebra and functions', 'Equations, inequalities, exponentials, logarithms and functions.'),
        skill('imat-math-geometry-trig', 'Geometry and trigonometry', 'Plane and analytic geometry, and trigonometry.'),
        skill('imat-math-probability-statistics', 'Probability and statistics', 'Elementary probability and statistics.'),
        skill('imat-phys-mechanics', 'Mechanics and fluids', 'Kinematics, dynamics, energy and fluids.'),
        skill('imat-phys-thermo-waves', 'Thermodynamics and waves', 'Heat, gas laws, waves and optics.'),
        skill('imat-phys-electricity', 'Electricity and magnetism', 'Charge, fields, circuits and magnetism.'),
      ],
    },
  ],
  blueprints,
  scoring: {
    pointsCorrect: 1.5,
    pointsIncorrect: -0.4,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'IMAT score out of 90',
      min: -24,
      max: 90,
      increment: 0.1,
      note: 'Raw penalty-adjusted score (drafted, unverified): 1.5 per correct answer, -0.4 per wrong answer, 0 per blank. The minimum shown is the arithmetic floor if every answer were wrong.',
    },
    scaledEstimate: { enabled: false, reason: 'Nothing to estimate: the IMAT reports the raw penalty-adjusted score.' },
    rawProjection: {
      scoredItems: TOTAL,
      reportFactor: 1,
      thresholds: [],
      noThresholdReason:
        'A minimum score to enter the national ranking is reported for 2026/27 but has not yet been verified against the ministerial decree, so it is not shown. Admission itself depends on the ranking against the places at each university, which changes every year.',
      conditions: '60 questions in one 100-minute block, in English, no calculator',
      caveats: ['Ties and the order of preferences are settled by rules in the decree, which this projection ignores.'],
    },
    notes: [
      'Scoring as drafted: +1.5 correct, 0 blank, -0.4 wrong. With five options a blind guess has an expected value of 1.5 x 0.2 - 0.4 x 0.8 = -0.02, slightly negative; eliminating even one option makes guessing worth it.',
      'The real test is in English only. Italian versions of our questions are a study aid.',
    ],
  },
  capabilities: {
    fullSimulation: {
      available: false,
      reason: 'The IMAT format has not yet been verified against the 2026/27 ministerial decree. A simulation opens once it is.',
    },
    adaptiveRouting: { available: false, reason: 'The IMAT is not adaptive: every candidate answers the same 60-question form.' },
    scaledScoreEstimate: { available: false, reason: 'There is no scaled score: the IMAT reports the raw penalty-adjusted score.' },
  },
  unverified: [
    'Every structural fact: 60 questions, 100 minutes, the subject mix (4 / 5 / 23 / 15 / 13), five options per question, and free movement throughout.',
    'The scoring rule (+1.5 / 0 / -0.4) and the minimum score to enter the ranking for 2026/27.',
    'That the 2025 filter-semester reform does not apply to the English-taught programmes in 2026/27.',
    'The 2026/27 test date, registration window and number of places.',
    'The syllabus for each subject, against the annex to the 2026/27 decree.',
  ],
  contentLocales: ['en', 'it'],
};
