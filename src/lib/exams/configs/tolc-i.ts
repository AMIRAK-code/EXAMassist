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
 * CISIA TOLC-I, 2026.
 *
 * The TOLC used by most Italian universities for admission to engineering
 * degrees. Structure and syllabus headings checked on 11 October 2026 against
 * CISIA's TOLC-I structure page as returned by web search; the CISIA domain
 * could not be reached directly from the build environment that day, so the
 * page was NOT parsed first-hand as the TOLC-E and TOLC-F pages were. The
 * section counts and clocks below agree across every CISIA page returned and
 * with CISIA's TOLC rules; the research record is docs/research/cisia-tolc.md.
 *
 * Distinctive behaviours encoded:
 *  - four consecutive, separately timed sections: Mathematics 20 in 50 min,
 *    Logic 10 in 20, Sciences 10 in 20, Verbal comprehension 10 in 20 -
 *    50 questions, 110 minutes;
 *  - five options, one correct; +1 / 0 / -0.25; no national pass mark;
 *  - the separately scored, unpenalised 30-question English section is not modelled.
 */

const STRUCTURE_PAGE = 'https://www.cisiaonline.it/en/tolc/tolc-i/structure-and-syllabus';
const navigation = tolcSectionNavigation(STRUCTURE_PAGE);

const SECTIONS: SectionSpec[] = [
  { key: 'mathematics', name: 'Mathematics', questions: 20, minutes: 50, domains: ['tolci-mathematics'] },
  { key: 'logic', name: 'Logic', questions: 10, minutes: 20, domains: ['tolci-logic'] },
  { key: 'sciences', name: 'Sciences', questions: 10, minutes: 20, domains: ['tolci-sciences'] },
  { key: 'verbal-comprehension', name: 'Verbal comprehension', questions: 10, minutes: 20, domains: ['tolci-verbal'] },
];

const skill = (slug: string, name: string, description: string) => ({ slug, name, description });

const section = (spec: SectionSpec, order: number, notes: string[]) => ({
  key: spec.key,
  name: spec.name,
  order,
  officialQuestionCount: String(spec.questions),
  officialTimeMinutes: spec.minutes,
  calculator: 'none' as const,
  calculatorNote: TOLC_NO_CALCULATOR,
  navigation,
  responseTypes: ['single_select' as const],
  notes,
});

const APTITUDE =
  'CISIA describes the Logic and Verbal comprehension questions as testing aptitude rather than the skills acquired in secondary school, needing no specific preparation. It publishes no topic list for this section, so the skills below are our editorial taxonomy for organising practice, not an official breakdown.';

const SYLLABUS_CAVEAT =
  'Skill headings follow the syllabus topics CISIA lists for this section, as checked through search on 11 October 2026 rather than read first-hand; the grouping into skills is ours.';

export const tolcIConfig: ExamConfig = {
  examKey: 'tolc-i',
  version: '2026.10',
  name: 'CISIA TOLC-I (Engineering)',
  shortName: 'TOLC-I',
  publisher: 'CISIA',
  versionLabel:
    'TOLC-I as delivered in 2026. Structure checked against CISIA’s TOLC-I structure page through search results (not parsed first-hand); scoring, answer format and conduct rules from the Regolamento TOLC 2026.',
  admissionsCycle: 'Calendar year 2026 (CISIA announces changes to TOLC structure by 31 December each year)',
  verifiedOn: '2026-10-11',
  audience: ['undergraduate'],
  summary:
    'The TOLC-I is the CISIA online test that most Italian universities use for admission to engineering degrees. It has four consecutive, separately timed sections: Mathematics 20 questions in 50 minutes, Logic 10 in 20, Sciences 10 in 20 and Verbal comprehension 10 in 20 - 50 questions in 110 minutes - followed by a separately scored 30-question English section. Each question has five options, one correct; a correct answer scores 1, a blank 0 and a wrong answer -0.25. There is no national pass mark: each university sets its own, often on the Mathematics section alone or on a weighted total. It can be taken at a university (TOLC@UNI) or from home under remote proctoring (TOLC@CASA), at most once per calendar month.',

  sources: [
    {
      label: 'TOLC-I structure and syllabus (checked through search results; the page could not be fetched directly)',
      url: STRUCTURE_PAGE,
      publisher: 'CISIA',
      verifiedOn: '2026-10-11',
    },
    {
      label: 'Regolamento TOLC 2026 (answer format, scoring, conduct, attempts, validity)',
      url: TOLC_REGULATION_2026,
      publisher: 'CISIA',
      verifiedOn: '2026-09-29',
    },
  ],

  sections: [
    section(SECTIONS[0], 0, ['Mathematics: 20 questions in 50 minutes (CISIA structure table).', SYLLABUS_CAVEAT]),
    section(SECTIONS[1], 1, ['Logic: 10 questions in 20 minutes (CISIA structure table).', APTITUDE]),
    section(SECTIONS[2], 2, ['Sciences: 10 questions in 20 minutes (CISIA structure table).', SYLLABUS_CAVEAT]),
    section(SECTIONS[3], 3, ['Verbal comprehension: 10 questions in 20 minutes (CISIA structure table).', APTITUDE]),
  ],

  domains: [
    {
      slug: 'tolci-mathematics',
      name: 'Mathematics',
      sectionKey: 'mathematics',
      description: 'The topics of CISIA’s TOLC-I Mathematics syllabus.',
      officialShare: '20 of 50 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolci-math-arithmetic-algebra', 'Arithmetic and algebra', 'Number properties and operations, powers and roots, logarithms and exponentials, polynomials and algebraic fractions.'),
        skill('tolci-math-equations', 'Equations, inequalities and systems', 'First- and second-degree, rational, irrational, exponential and logarithmic equations and inequalities; linear systems.'),
        skill('tolci-math-geometry', 'Plane and solid geometry', 'Segments, angles, polygons, circles, similarity, Pythagoras, areas and volumes, loci.'),
        skill('tolci-math-analytic-functions', 'Analytic geometry and functions', 'Lines, parabolas, circles and other conics in coordinates; domains, graphs and properties of elementary functions.'),
        skill('tolci-math-trigonometry', 'Trigonometry', 'Degrees and radians, sine, cosine and tangent, fundamental identities, trigonometric equations, triangles.'),
        skill('tolci-math-probability', 'Probability and statistics', 'Counting, the probability of simple and compound events, means.'),
      ],
    },
    {
      slug: 'tolci-logic',
      name: 'Logic',
      sectionKey: 'logic',
      description: 'Reasoning aptitude. CISIA publishes no topic list for this section; the skills are our editorial grouping.',
      officialShare: '10 of 50 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolci-logic-deduction', 'Deduction and conditions', 'What must follow from given statements, necessary and sufficient conditions, negation and quantifiers.'),
        skill('tolci-logic-sequences', 'Sequences and patterns', 'Numeric, letter and figure sequences.'),
        skill('tolci-logic-problems', 'Logic problems', 'Arrangements, schedules and short puzzles solved by reasoning.'),
      ],
    },
    {
      slug: 'tolci-sciences',
      name: 'Sciences',
      sectionKey: 'sciences',
      description: 'The physics and chemistry topics of CISIA’s TOLC-I Sciences syllabus.',
      officialShare: '10 of 50 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolci-sci-mechanics', 'Mechanics', 'Scalar and vector quantities, units, kinematics, Newton’s laws, work, energy, power, momentum, elementary fluid mechanics.'),
        skill('tolci-sci-thermo', 'Thermodynamics', 'Temperature, heat, specific heat, thermal expansion, the ideal gas law and elementary principles of thermodynamics.'),
        skill('tolci-sci-electromagnetism-optics', 'Electromagnetism and optics', 'Charges, fields, circuits and Ohm’s law, magnetism; reflection, refraction and lenses.'),
        skill('tolci-sci-chemistry', 'Chemistry', 'Structure of matter, the periodic table, bonds, chemical symbols, the mole and stoichiometry, solutions, acids and bases, redox, elementary organic chemistry.'),
      ],
    },
    {
      slug: 'tolci-verbal',
      name: 'Verbal comprehension',
      sectionKey: 'verbal-comprehension',
      description: 'Reading aptitude. CISIA publishes no topic list for this section; the skills are our editorial grouping.',
      officialShare: '10 of 50 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolci-verbal-stated', 'What the text states', 'Information stated in a passage.'),
        skill('tolci-verbal-inferred', 'What the text implies', 'The conclusion a passage supports.'),
        skill('tolci-verbal-meaning', 'Meaning in context', 'The meaning of a word or phrase as used in the passage.'),
        skill('tolci-verbal-purpose', 'Purpose and structure', 'The aim of a passage and the role of its parts.'),
      ],
    },
  ],

  blueprints: sectionedBlueprints({
    examLabel: 'TOLC-I',
    sections: SECTIONS,
    diagnosticPerSection: 3,
    diagnosticSecondsPerItem: 200,
    responseTypes: ['single_select'],
    simulationFidelityNote:
      'Matches the TOLC-I structure CISIA publishes: four sections in order - Mathematics 20 in 50 minutes, Logic 10 in 20, Sciences 10 in 20, Verbal comprehension 10 in 20 - five options per question, +1 / 0 / -0.25, no calculator, and no return to a closed section. What differs: our questions are original, not from CISIA’s reserved database, and their difficulty is our editorial judgement; CISIA does not describe moving between questions within a section, so we let you move back inside the open section; and the separately scored 30-question English section is not included.',
    timedFidelityNote: (s) =>
      `The published length and clock of the TOLC-I ${s.name} section, with CISIA’s scoring. Our questions are original and their difficulty is editorial; moving back within the section is allowed here, a rule CISIA does not describe.`,
    diagnosticFidelityNote:
      'A short skill check, not a predictor of a TOLC-I score. It has three questions from each section at a generous pace and lets you move back and change answers. Use it to find weak areas.',
    practiceFidelityNote:
      'A study tool, not a reproduction of the exam: untimed, free navigation, and whatever section, topic and difficulty you choose.',
  }),

  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: -0.25,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'TOLC-I absolute score, excluding English, out of 50',
      min: -12.5,
      max: 50,
      increment: 0.25,
      note: 'CISIA reports an absolute score for the four main sections: 50 questions at 1 point, with the -0.25 penalty. The minimum shown is the arithmetic floor if every question were answered wrongly; CISIA does not say whether a negative total is reported as such. The English section is reported separately on its own 0-30 scale.',
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
        'CISIA sets no pass mark for the TOLC-I. Each university may transform the score, weight the four sections and set its own minimum; many look at the Mathematics section on its own to assign additional learning requirements (OFA). Check the admission notice (bando) of the programme you are applying to, and set that number as your target.',
      conditions: '50 questions in four separately timed sections, 110 minutes, no calculator or other aids',
      caveats: [
        'It covers the four main sections only. The English section is scored separately.',
        'A university that weights sections differently, or reads the Mathematics section alone, will turn the same answers into a different result.',
      ],
    },
    notes: [...TOLC_SCORING_NOTES],
  },

  capabilities: {
    fullSimulation: {
      available: true,
      note:
        'Section counts, clocks, answer format and scoring are published by CISIA. Labelled an approximation because the structure page was checked through search rather than read first-hand, because CISIA does not describe navigation within a section, and because the separately scored English section is not included.',
    },
    adaptiveRouting: {
      available: false,
      reason:
        'The TOLC is not adaptive. Tests are generated from, or selected among, forms of analogous difficulty from the CISIA database (Regolamento TOLC 2026, 1.2).',
    },
    scaledScoreEstimate: {
      available: false,
      reason: 'There is no national scaled score. Universities transform the absolute score in their own ways.',
    },
  },

  unverified: [
    ...TOLC_UNVERIFIED,
    'The TOLC-I structure page itself was not read first-hand: cisiaonline.it could not be reached from the build environment on 11 October 2026, and the section counts and clocks were confirmed through search results quoting CISIA’s pages. Re-read the page before relying on the syllabus detail.',
  ],
};
