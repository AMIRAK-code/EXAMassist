import type { Blueprint, BlueprintPart, ExamConfig, NavigationPolicy } from '@/lib/assessment/types';
import { studyNavigation } from '../sectioned-blueprints';

/**
 * IMAT - International Medical Admissions Test, a.y. 2026/27.
 *
 * The national admission test for the English-taught degrees in Medicine and
 * Surgery, Dentistry and Veterinary Medicine at Italian universities, set by
 * the Ministry of University and Research (MUR) and run by CINECA. The 2025
 * reform that replaced the entrance test with a "semestre filtro" does not
 * apply to the English-taught degrees (D.Lgs. 71/2025, art. 8 c. 3).
 *
 * Verified first-hand on 3 November 2026 against D.M. 1005 of 6 August 2026,
 * its annexes and tables (docs/research/imat.md): 60 five-option questions
 * in 100 minutes, in English, on paper; +1.5 / 0 / -0.4, out of 90; 20 points
 * to be ranked. The 2026/27 test was held on 29 September 2026. Nothing has
 * been published for 2027/28.
 *
 * The real IMAT is in English only. Questions here are also offered in
 * Italian as a study aid, because many candidates study the sciences in
 * Italian; the simulation is always in English (sessionContentLocale).
 */

const MUR_DECREE_2026 = 'https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-1005-del-06-08-2026';
const MUR_ANNEXES_2026 =
  'https://www.mur.gov.it/sites/default/files/2026-08/Decreto%20Ministeriale%20n.%201005%20Allegati%201_2_3.pdf';
const MUR_SYLLABUS_2026 =
  'https://www.mur.gov.it/sites/default/files/2026-08/Decreto%20Ministeriale%20n.%201005%20Allegato%20A.pdf';
const REFORM_EXCLUSION = 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2025-05-15;71~art8';
const UNIVERSITALY = 'https://www.universitaly.it/';
const VERIFIED_ON = '2026-11-03';
const SECTION_KEY = 'imat';

/**
 * One paper booklet for the whole 100 minutes: nothing in the decree divides
 * the time or fixes an order, so candidates move freely and may correct an
 * answer once (Allegato 1). On screen, free movement and changes throughout.
 */
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
  source: MUR_ANNEXES_2026,
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
    description: `The 2026/27 IMAT structure: ${TOTAL} questions in one 100-minute block, in the published subject mix, with free movement between questions. In English, as on the day.`,
    parts: AREAS.map((area) => areaPart('simulation', area, area.questions, null)),
    timing: 'overall',
    overallTimeLimitSeconds: 100 * 60,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote:
      'Follows the 2026/27 decree (60 questions, 100 minutes, +1.5 / 0 / -0.4). The real test is on paper and its questions are written by CINECA; ours are original, on screen, and their difficulty is editorial.',
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
  version: '2026.11',
  name: 'IMAT - International Medical Admissions Test',
  shortName: 'IMAT',
  publisher: 'Ministero dell’Università e della Ricerca',
  versionLabel:
    'IMAT for admission to the English-taught degrees in Medicine and Surgery, Dentistry and Veterinary Medicine, a.y. 2026/27. Structure, scoring, threshold and syllabus verified from the ministerial decree (D.M. 1005 of 6 August 2026) and its annexes.',
  admissionsCycle: 'Academic year 2026/27 (test held on 29 September 2026; the 2027/28 decree has not been published yet)',
  verifiedOn: VERIFIED_ON,
  audience: ['undergraduate'],
  summary:
    'The national admission test for the English-taught degrees in Medicine and Surgery, Dentistry and Veterinary Medicine at Italian universities, set by the Ministry of University and Research and run by CINECA. It is one paper test of 60 questions with five options in 100 minutes, in English: Reading skills and knowledge acquired in studies 4, Logical reasoning and problems 5, Biology 23, Chemistry 15, Physics and mathematics 13. A correct answer scores 1.5, a blank 0 and a wrong answer -0.4, for a maximum of 90. EU candidates, and non-EU candidates resident in Italy, need at least 20 points to be ranked; there are two national rankings, one for Medicine and Dentistry and one for Veterinary Medicine, and admission depends on the ranking against the places at each university.',
  sources: [
    {
      label: 'D.M. 1005 of 6 August 2026: IMAT 2026/27, arts. 1-3 (format, date, scoring, threshold, rankings)',
      url: MUR_DECREE_2026,
      publisher: 'Ministero dell’Università e della Ricerca',
      verifiedOn: VERIFIED_ON,
    },
    {
      label: 'D.M. 1005/2026, Allegati 1-3: conduct of the test, registration and rankings, language certificates',
      url: MUR_ANNEXES_2026,
      publisher: 'Ministero dell’Università e della Ricerca',
      verifiedOn: VERIFIED_ON,
    },
    { label: 'D.M. 1005/2026, Allegato A: syllabus', url: MUR_SYLLABUS_2026, publisher: 'Ministero dell’Università e della Ricerca', verifiedOn: VERIFIED_ON },
    {
      label: 'D.Lgs. 71/2025, art. 8 c. 3: the 2025 reform does not apply to English-taught degrees',
      url: REFORM_EXCLUSION,
      publisher: 'Normattiva',
      verifiedOn: VERIFIED_ON,
    },
    { label: 'Universitaly: registration, scores and rankings', url: UNIVERSITALY, publisher: 'Ministero dell’Università e della Ricerca', verifiedOn: VERIFIED_ON },
  ],
  sections: [
    {
      key: SECTION_KEY,
      name: 'IMAT',
      order: 0,
      officialQuestionCount: String(TOTAL),
      officialTimeMinutes: 100,
      calculator: 'none',
      calculatorNote:
        'No calculator. The decree bans phones, tablets, smartwatches and "similar equipment", manuals and notes, and candidates write only with the pen the venue supplies (Allegato 1).',
      navigation,
      responseTypes: ['single_select'],
      notes: [
        ...AREAS.map((a) => `${a.name}: ${a.questions} questions (art. 2 c. 2).`),
        'One paper booklet and answer sheet, in English; one correction allowed per question (Allegato 1).',
      ],
    },
  ],
  domains: [
    {
      slug: 'imat-reading-knowledge',
      name: AREAS[0].name,
      sectionKey: SECTION_KEY,
      description: 'Reading comprehension and general knowledge from secondary school studies.',
      officialShare: '4 of 60 questions',
      source: MUR_SYLLABUS_2026,
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
      source: MUR_SYLLABUS_2026,
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
      source: MUR_SYLLABUS_2026,
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
      source: MUR_SYLLABUS_2026,
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
      source: MUR_SYLLABUS_2026,
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
  choiceOptions: {
    count: 5,
    basis: 'published',
    note: 'Five options, one correct (D.M. 1005/2026, art. 2 c. 2).',
  },
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
      note: 'The raw penalty-adjusted score (art. 3 c. 4): 1.5 per correct answer, -0.4 per wrong answer, 0 per blank. The minimum shown is the arithmetic floor if every answer were wrong.',
    },
    scaledEstimate: { enabled: false, reason: 'Nothing to estimate: the IMAT reports the raw penalty-adjusted score.' },
    rawProjection: {
      scoredItems: TOTAL,
      reportFactor: 1,
      thresholds: [
        {
          value: 20,
          label: '20 points',
          meaning:
            'The minimum to be placed in the national ranking, for EU candidates and non-EU candidates resident in Italy (non-EU candidates resident abroad need more than 0). It is not an admission score: places go by ranking.',
          source: MUR_DECREE_2026,
        },
      ],
      noThresholdReason: null,
      conditions: '60 questions in one 100-minute block, in English, on paper, no calculator',
      caveats: [
        'Admission depends on the ranking against each year’s places at each university, which no projection can know.',
        'Ties are settled by the subject scores, an English certificate, disability and age, in that order (art. 3 c. 6); this projection ignores them.',
      ],
    },
    notes: [
      'Scoring: +1.5 correct, 0 blank, -0.4 wrong (art. 3 c. 4). With five options a blind guess has an expected value of 1.5 x 0.2 - 0.4 x 0.8 = -0.02, slightly negative; eliminating even one option makes guessing worth it.',
      'The real test is in English only. Italian versions of our questions are a study aid.',
    ],
  },
  capabilities: {
    fullSimulation: {
      available: true,
      note: 'Structure, time, answer format and scoring are set by the 2026/27 decree and verified. Labelled an approximation because the real test is on paper, its questions are CINECA’s, and no clause describes moving through the booklet.',
    },
    adaptiveRouting: { available: false, reason: 'The IMAT is not adaptive: every candidate answers the same 60-question form.' },
    scaledScoreEstimate: { available: false, reason: 'There is no scaled score: the IMAT reports the raw penalty-adjusted score.' },
  },
  unverified: [
    'Everything about 2027/28: the decree, the date, the places and whether the format or scoring change. Not published as of 3 November 2026.',
    'Free movement through the 100 minutes: it follows from the single paper booklet, but no clause states it.',
    'The registration fee, published only on Universitaly while registration is open.',
  ],
  contentLocales: ['en', 'it'],
};
