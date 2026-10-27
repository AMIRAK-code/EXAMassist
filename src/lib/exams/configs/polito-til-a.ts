import type { ExamConfig, NavigationPolicy } from '@/lib/assessment/types';
import { sectionedBlueprints, type SectionSpec } from '../sectioned-blueprints';

/**
 * Politecnico di Torino - TIL-A (Test In Laib, Architettura), a.y. 2026/27.
 *
 * The admission test for PoliTo's single-cycle degree in Architecture. Its
 * content is set nationally by Annex A of Ministerial Decree no. 706 of
 * 4 June 2026; PoliTo administers it. Every rule below was read first-hand on
 * 29 September 2026 from PoliTo's official call for applications for
 * a.y. 2026/27 and its admission test page; the research record is
 * docs/research/polito-til.md.
 *
 * Distinctive behaviours encoded:
 *  - five sections of ten questions, twenty minutes each, 100 minutes in all;
 *  - five options per question, one correct; +1 / 0 / -0.25, maximum 50;
 *  - admission by ranking against the places available: NO pass mark is
 *    published, and the readiness page says so rather than inventing one;
 *  - no calculator.
 */

const CALL_2026_27 =
  'https://www.polito.it/sites/default/files/2026-06/def_ENG_Call%20for%20applications%20Architecture%20a.y.%202026-27.pdf';
const TEST_PAGE =
  'https://www.polito.it/en/education/applying-studying-graduating/admissions-and-enrolment/bachelor-s-degree-programmes/admission-test';
const DECREE_706 = 'https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-706-del-04-06-2026';

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
  'No calculator. Art. 9 of the 2026/27 call forbids personal materials "such as sheets of paper, notebooks, notes, calculators"; only the blank sheets and pen or pencil provided by the supervision committee may be used. A non-programmable calculator is permitted only to candidates entitled to extra time (art. 5).';

const SECTIONS: SectionSpec[] = [
  { key: 'reading-comprehension', name: 'Reading comprehension', questions: 10, minutes: 20, domains: ['tila-reading-comprehension'] },
  { key: 'general-knowledge', name: 'History and general knowledge', questions: 10, minutes: 20, domains: ['tila-general-knowledge'] },
  { key: 'logical-reasoning', name: 'Logical reasoning', questions: 10, minutes: 20, domains: ['tila-logic'] },
  { key: 'drawing-representation', name: 'Drawing and representation', questions: 10, minutes: 20, domains: ['tila-drawing'] },
  { key: 'mathematics-physics', name: 'Mathematics and physics', questions: 10, minutes: 20, domains: ['tila-mathematics', 'tila-physics'] },
];

const skill = (slug: string, name: string, description: string) => ({ slug, name, description });

const sectionConfig = (spec: SectionSpec, order: number, notes: string[]) => ({
  key: spec.key,
  name: spec.name,
  order,
  officialQuestionCount: String(spec.questions),
  officialTimeMinutes: spec.minutes,
  calculator: 'none' as const,
  calculatorNote: NO_CALCULATOR,
  navigation: sectionNavigation,
  responseTypes: ['single_select' as const],
  notes,
});

export const politoTilAConfig: ExamConfig = {
  examKey: 'polito-til-a',
  version: '2026.09',
  name: 'Politecnico di Torino TIL-A (Architecture)',
  shortName: 'TIL-A',
  publisher: 'Politecnico di Torino',
  versionLabel:
    'TIL-A for admission to the single-cycle degree in Architecture, a.y. 2026/27. Structure, timing and scoring verified from the official 2026/27 call for applications and the admission test page; content set by Annex A of Ministerial Decree no. 706 of 4 June 2026.',
  admissionsCycle: 'Academic year 2026/27 (test sessions on 21 and 22 July 2026; the score is valid only for enrolment in 2026/27)',
  verifiedOn: '2026-09-29',
  audience: ['undergraduate'],
  summary:
    "The admission test for Politecnico di Torino's single-cycle degree in Architecture, taken in person. Its content is set nationally by ministerial decree and PoliTo administers it. It is 50 questions in five sections of ten, each answered in 20 minutes: Reading comprehension; History (including history of art) and general knowledge; Logical reasoning; Drawing and representation; Mathematics and physics - 100 minutes in all. Each question has five options, one correct; a correct answer scores 1, a blank 0 and a wrong answer -0.25, for a maximum of 50. Admission is by ranking on the score against the places available: PoliTo publishes no pass mark. The test can be taken in English or Italian. No calculator is allowed.",

  sources: [
    {
      label: 'Call for applications, Architecture, a.y. 2026/27 (arts. 6-9: required skills, content, scoring, conduct; ranking rules)',
      url: CALL_2026_27,
      publisher: 'Politecnico di Torino',
      verifiedOn: '2026-09-29',
    },
    {
      label: 'Admission test (TIL) page: TIL-A format, scoring and the topics of Annex A',
      url: TEST_PAGE,
      publisher: 'Politecnico di Torino',
      verifiedOn: '2026-09-29',
    },
    {
      label: 'Ministerial Decree no. 706 of 4 June 2026, Annex A: content of the national Architecture admission test',
      url: DECREE_706,
      publisher: 'Ministero dell’Università e della Ricerca',
      verifiedOn: '2026-09-29',
    },
  ],

  sections: [
    sectionConfig(SECTIONS[0], 0, [
      'Art. 7.3: "Ten (10) Reading comprehension questions"; each section is answered in 20 minutes.',
      'Texts may be scientific or narrative, by classical or contemporary authors, or current news and journal articles.',
    ]),
    sectionConfig(SECTIONS[1], 1, [
      'Art. 7.3: "Ten (10) Prior school knowledge: History (including History of Art) and General Knowledge questions".',
      'For non-EU applicants residing abroad, general-knowledge questions on international issues complete this area (admission test page).',
    ]),
    sectionConfig(SECTIONS[2], 2, ['Art. 7.3: "Ten (10) Logic reasoning questions".']),
    sectionConfig(SECTIONS[3], 3, ['Art. 7.3: "Ten (10) Drawing and Representation questions".']),
    sectionConfig(SECTIONS[4], 4, [
      'Art. 7.3: "Ten (10) Physics and Mathematics questions".',
      'A score below 30% of this section’s maximum (below 3 out of 10) assigns remedial obligations (OFA) to an admitted candidate (art. 8.2). It does not affect admission.',
    ]),
  ],

  domains: [
    {
      slug: 'tila-reading-comprehension',
      name: 'Reading comprehension',
      sectionKey: 'reading-comprehension',
      description: 'Understanding written texts of various kinds and purposes.',
      officialShare: '10 of 50 questions',
      source: TEST_PAGE,
      skills: [
        skill('tila-reading-stated', 'What the text states', 'Identifying information stated in the text.'),
        skill('tila-reading-inferred', 'What the text implies', 'Drawing the conclusion the text supports.'),
        skill('tila-reading-purpose', 'Purpose and structure', 'The aim of a text and the role of its parts.'),
      ],
    },
    {
      slug: 'tila-general-knowledge',
      name: 'History and general knowledge',
      sectionKey: 'general-knowledge',
      description:
        'Skills acquired at school and general culture: placing historical and cultural phenomena, including works of art and architecture, in space and time; national and international institutions; legal and economic issues and citizenship.',
      officialShare: '10 of 50 questions',
      source: TEST_PAGE,
      skills: [
        skill('tila-gk-history', 'History and geography', 'Placing important historical and cultural phenomena in geographical space and historical time.'),
        skill('tila-gk-art-architecture', 'Art and architecture history', 'Artistic and architectural events, works of architecture and art movements.'),
        skill('tila-gk-institutions', 'Institutions', 'The main national and international institutions.'),
        skill('tila-gk-citizenship', 'Law, economics and citizenship', 'Legal and economic issues and citizenship.'),
      ],
    },
    {
      slug: 'tila-logic',
      name: 'Logical reasoning',
      sectionKey: 'logical-reasoning',
      description: 'Reasoning consistently from premises set out in symbolic or verbal form, including abstract problems.',
      officialShare: '10 of 50 questions',
      source: TEST_PAGE,
      skills: [
        skill('tila-logic-verbal', 'Verbal reasoning', 'Deducing what follows from premises stated in words.'),
        skill('tila-logic-symbolic', 'Symbolic and abstract reasoning', 'Sequences, patterns and premises in symbolic form.'),
        skill('tila-logic-problems', 'Logic problems', 'Cases and problems that need a chain of reasoning to solve.'),
      ],
    },
    {
      slug: 'tila-drawing',
      name: 'Drawing and representation',
      sectionKey: 'drawing-representation',
      description:
        'Analysing graphs, drawings and iconic representations and their correspondence with objects; elementary notions of representation: plans, elevations, axonometric projections.',
      officialShare: '10 of 50 questions',
      source: TEST_PAGE,
      skills: [
        skill('tila-draw-orthographic', 'Plans and elevations', 'Reading and matching orthographic views of an object.'),
        skill('tila-draw-axonometric', 'Axonometric projection', 'Axonometric views and their relationship to orthographic ones.'),
        skill('tila-draw-graphs-diagrams', 'Graphs and diagrams', 'Reading graphs, diagrams and iconic representations.'),
      ],
    },
    {
      slug: 'tila-mathematics',
      name: 'Mathematics',
      sectionKey: 'mathematics-physics',
      description:
        'Number sets and arithmetic, algebraic calculation, Euclidean geometry, the fundamentals of analytic geometry, probability, statistics and trigonometry.',
      officialShare: null,
      source: TEST_PAGE,
      skills: [
        skill('tila-math-numbers', 'Numbers and arithmetic', 'Natural, relative, rational and real numbers; order of magnitude; powers, radicals and logarithms.'),
        skill('tila-math-algebra', 'Algebraic calculation', 'Manipulating algebraic expressions and solving equations.'),
        skill('tila-math-geometry', 'Euclidean geometry', 'Polygons, circles, lengths, areas and volumes; isometries and similarity.'),
        skill('tila-math-analytic-trig', 'Analytic geometry and trigonometry', 'Fundamentals of analytic geometry and of trigonometry.'),
        skill('tila-math-probability-statistics', 'Probability and statistics', 'Fundamentals of probability and statistics.'),
      ],
    },
    {
      slug: 'tila-physics',
      name: 'Physics',
      sectionKey: 'mathematics-physics',
      description:
        'Elementary mechanics and statics, the general concepts of thermodynamics, and the basics of electrostatics and electrodynamics.',
      officialShare: null,
      source: TEST_PAGE,
      skills: [
        skill('tila-phys-mechanics', 'Mechanics and statics', 'Displacement, velocity, acceleration, mass, momentum, force, weight, work and power; Newton’s laws; statics.'),
        skill('tila-phys-thermal', 'Heat and temperature', 'Temperature, heat, specific heat and thermal expansion.'),
        skill('tila-phys-electricity', 'Electrostatics and circuits', 'Coulomb’s law, field and potential, capacitors, direct current, Ohm’s law, resistors in series and parallel.'),
      ],
    },
  ],

  blueprints: sectionedBlueprints({
    examLabel: 'TIL-A',
    sections: SECTIONS,
    diagnosticPerSection: 3,
    diagnosticSecondsPerItem: 180,
    responseTypes: ['single_select'],
    simulationFidelityNote:
      'Matches the published TIL-A: five sections of ten questions, twenty minutes each, 100 minutes in all, five options per question, +1 / 0 / -0.25, no calculator, and no return to a closed section. What differs: our questions are original, not national-test items, and their difficulty is our editorial judgement; the call does not describe moving between questions within a section, so we let you move back inside the open section; the call lists the five areas without stating the order they are delivered in, so we use the listed order; and the real Drawing and representation questions show drawings, while ours pose the same spatial problems through tables and text (height maps of stacked blocks, nets laid out as grids, scales), because this site does not yet render figures.',
    timedFidelityNote: (section) =>
      `The published length and clock of the TIL-A ${section.name} section, with the published scoring. Our questions are original and their difficulty is editorial; moving back within the section is allowed here, a rule the call does not describe.`,
    diagnosticFidelityNote:
      'A short skill check, not a predictor of a TIL-A score. It has three questions from each area, about three minutes per question (well over the real two minutes), and lets you move back and change answers. Use it to find weak areas.',
    practiceFidelityNote:
      'A study tool, not a reproduction of the exam: untimed, free navigation, and whatever area, topic and difficulty you choose.',
  }),

  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: -0.25,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'TIL-A score out of 50',
      min: -12.5,
      max: 50,
      increment: 0.25,
      note: 'Art. 8.1: "The maximum test score is fifty (50) points". The call adds that the score is "converted to hundredths" but gives no formula, so we report the 50-point score it states as the maximum. The minimum shown is the arithmetic floor if every question were answered wrongly; the call does not say whether a negative score is reported as such.',
    },
    scaledEstimate: {
      enabled: false,
      reason: 'Nothing to estimate: the reported result is the raw penalty-adjusted score.',
    },
    rawProjection: {
      scoredItems: 50,
      reportFactor: 1,
      thresholds: [],
      noThresholdReason:
        'PoliTo publishes no pass mark for the TIL-A. Applicants are ranked by score and offered places in rank order until the places are filled (call, arts. 10-11), so the score you need depends on how others score in the same year, which nobody can know in advance. The one published number is the remedial threshold: below 3 out of 10 in Mathematics and physics, an admitted student is assigned extra coursework.',
      conditions: '50 questions in five sections of 20 minutes each, 100 minutes, no calculator',
      caveats: ['Applicants who answer no question at all are not ranked.'],
    },
    notes: [
      'Official scoring, art. 8.1: "1 point for each correct answer; 0 points for each unanswered question; minus 0.25 points for each incorrect answer."',
      'Five options per question, one correct (art. 7.3). A blind guess has an expected value of 0; eliminating even one option makes guessing worth it.',
      'Ranking, art. 11: applicants are ranked in descending order of TIL-A score; ties are broken by section scores in a published order, then by the younger applicant. PoliTo publishes separate ranking lists for EU and equivalent applicants and for non-EU applicants residing abroad.',
      'Applicants who answer no question are not placed in the ranking (art. 11.4).',
    ],
  },

  capabilities: {
    fullSimulation: {
      available: true,
      note:
        'Structure (five sections of ten), timing (20 minutes per section, 100 in all), answer format (five options, one correct) and scoring (+1 / 0 / -0.25, maximum 50) are published and verified from the 2026/27 call. Labelled an approximation because the call does not describe navigation within a section or the delivery order of the five areas.',
    },
    adaptiveRouting: {
      available: false,
      reason:
        'The TIL-A is not adaptive: each test is drawn at random and all tests have an equivalent level of difficulty (art. 7.1).',
    },
    scaledScoreEstimate: {
      available: false,
      reason: 'There is no scaled score: the reported result is the raw penalty-adjusted score.',
    },
  },

  unverified: [
    'Whether candidates can move back to earlier questions, or change answers, within an open section. Our simulation allows it.',
    'The order in which the five areas are delivered. The call lists them; it does not say that is the delivery order.',
    'The formula behind "the score is converted to hundredths", and whether a negative score is reported as such.',
    'The detailed national syllabus of Annex A to Ministerial Decree 706/2026 beyond the topics reproduced on PoliTo’s admission test page, whose English translation PoliTo notes "has no legal effects".',
  ],
};
