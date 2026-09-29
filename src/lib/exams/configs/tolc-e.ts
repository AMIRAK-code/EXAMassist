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
 * CISIA TOLC-E, 2026.
 *
 * The TOLC used by many Italian universities for admission to economics,
 * business and statistics degrees. Structure and scoring read first-hand on
 * 29 September 2026 from CISIA's TOLC-E structure page (the table parsed
 * directly from its HTML) and the TOLC 2026 regulation; the research record is
 * docs/research/cisia-tolc.md.
 *
 * Distinctive behaviours encoded:
 *  - three consecutive sections, thirty minutes each: Logic 13, Verbal
 *    comprehension 10, Mathematics 13 - 36 questions, 90 minutes;
 *  - five options, one correct; +1 / 0 / -0.25;
 *  - NO national pass mark: each university sets its own;
 *  - the separately scored, unpenalised 30-question English section is not modelled.
 */

const STRUCTURE_PAGE = 'https://www.cisiaonline.it/en/tolc/tolc-e/structure-and-syllabus';
const navigation = tolcSectionNavigation(STRUCTURE_PAGE);

const SECTIONS: SectionSpec[] = [
  { key: 'logic', name: 'Logic', questions: 13, minutes: 30, domains: ['tolce-logic'] },
  { key: 'verbal-comprehension', name: 'Verbal comprehension', questions: 10, minutes: 30, domains: ['tolce-verbal'] },
  { key: 'mathematics', name: 'Mathematics', questions: 13, minutes: 30, domains: ['tolce-mathematics'] },
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
  'CISIA: "The Logic and Verbal comprehension questions seek to test in particular the candidate’s aptitude rather than the skills acquired in secondary school. Therefore, they do not require any specific preparation." CISIA publishes no topic list for this section, so the skills below are our editorial taxonomy for organising practice, not an official breakdown.';

export const tolcEConfig: ExamConfig = {
  examKey: 'tolc-e',
  version: '2026.09',
  name: 'CISIA TOLC-E (Economics)',
  shortName: 'TOLC-E',
  publisher: 'CISIA',
  versionLabel:
    'TOLC-E as delivered in 2026. Structure verified from CISIA’s TOLC-E structure page; scoring, answer format and conduct rules from the Regolamento TOLC 2026.',
  admissionsCycle: 'Calendar year 2026 (CISIA announces changes to TOLC structure by 31 December each year)',
  verifiedOn: '2026-09-29',
  audience: ['undergraduate'],
  summary:
    'The TOLC-E is the CISIA online test that many Italian universities use for admission to economics, business and statistics degrees. It has three consecutive sections, each with its own 30-minute clock: Logic 13 questions, Verbal comprehension 10, Mathematics 13 - 36 questions in 90 minutes - followed by a separately scored 30-question English section. Each question has five options, one correct; a correct answer scores 1, a blank 0 and a wrong answer -0.25. There is no national pass mark: each university decides how to use the result and sets its own minimum. It can be taken at a university (TOLC@UNI) or from home under remote proctoring (TOLC@CASA), at most once per calendar month.',

  sources: [
    { label: 'TOLC-E structure and syllabus', url: STRUCTURE_PAGE, publisher: 'CISIA', verifiedOn: '2026-09-29' },
    {
      label: 'Regolamento TOLC 2026 (answer format, scoring, conduct, attempts, validity)',
      url: TOLC_REGULATION_2026,
      publisher: 'CISIA',
      verifiedOn: '2026-09-29',
    },
  ],

  sections: [
    section(SECTIONS[0], 0, ['Logic: 13 questions in 30 minutes (CISIA structure table).', APTITUDE]),
    section(SECTIONS[1], 1, ['Verbal comprehension: 10 questions in 30 minutes (CISIA structure table).', APTITUDE]),
    section(SECTIONS[2], 2, ['Mathematics: 13 questions in 30 minutes (CISIA structure table).']),
  ],

  domains: [
    {
      slug: 'tolce-logic',
      name: 'Logic',
      sectionKey: 'logic',
      description: 'Reasoning aptitude. CISIA publishes no topic list for this section; the skills are our editorial grouping.',
      officialShare: '13 of 36 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolce-logic-deduction', 'Deduction', 'What must follow from given statements, including conditions and quantifiers.'),
        skill('tolce-logic-sequences', 'Sequences and patterns', 'Numeric, letter and figure sequences.'),
        skill('tolce-logic-problems', 'Logic problems', 'Arrangements and short puzzles solved by reasoning.'),
        skill('tolce-logic-arguments', 'Arguments', 'Assumptions, conclusions and what strengthens or weakens a claim.'),
      ],
    },
    {
      slug: 'tolce-verbal',
      name: 'Verbal comprehension',
      sectionKey: 'verbal-comprehension',
      description: 'Reading aptitude. CISIA publishes no topic list for this section; the skills are our editorial grouping.',
      officialShare: '10 of 36 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolce-verbal-stated', 'What the text states', 'Information stated in a passage.'),
        skill('tolce-verbal-inferred', 'What the text implies', 'The conclusion a passage supports.'),
        skill('tolce-verbal-meaning', 'Meaning in context', 'The meaning of a word or phrase as used in the passage.'),
        skill('tolce-verbal-purpose', 'Purpose and structure', 'The aim of a passage and the role of its parts.'),
      ],
    },
    {
      slug: 'tolce-mathematics',
      name: 'Mathematics',
      sectionKey: 'mathematics',
      description: 'The topics of CISIA’s TOLC-E Mathematics syllabus.',
      officialShare: '13 of 36 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolce-math-numbers', 'Numbers and percentages', 'Properties of and operations on integers, rationals and reals; percentages; absolute value.'),
        skill('tolce-math-powers-exp-log', 'Powers, roots, exponentials and logarithms', 'Powers and roots and their properties; exponentials and logarithms and their properties.'),
        skill('tolce-math-polynomials', 'Polynomials and rational expressions', 'Operations, factorisation, division with remainder, identities; fractional rational expressions.'),
        skill('tolce-math-equations', 'Equations, inequalities and systems', 'First- and second-degree equations and inequalities; fractional, irrational, exponential and logarithmic ones; simple linear systems.'),
        skill('tolce-math-analytic-geometry', 'Analytic geometry', 'Cartesian coordinates, lines and the elementary conics; elementary analytic geometry problems.'),
        skill('tolce-math-geometry', 'Plane and solid geometry', 'Segments, polygons, circles, perimeters and areas; significant solids, surfaces and volumes.'),
        skill('tolce-math-functions', 'Elementary functions', 'Graphs and domains of elementary functions; symbolic mathematics.'),
      ],
    },
  ],

  blueprints: sectionedBlueprints({
    examLabel: 'TOLC-E',
    sections: SECTIONS,
    diagnosticPerSection: 4,
    diagnosticSecondsPerItem: 200,
    responseTypes: ['single_select'],
    simulationFidelityNote:
      'Matches the published TOLC-E: three sections in the published order - Logic 13, Verbal comprehension 10, Mathematics 13 - each with its own 30-minute clock, five options per question, +1 / 0 / -0.25, no calculator, and no return to a closed section. What differs: our questions are original, not from CISIA’s reserved database, and their difficulty is our editorial judgement; CISIA does not describe moving between questions within a section, so we let you move back inside the open section; and the separately scored 30-question English section that follows the real test is not included.',
    timedFidelityNote: (s) =>
      `The published length and clock of the TOLC-E ${s.name} section, with CISIA’s scoring. Our questions are original and their difficulty is editorial; moving back within the section is allowed here, a rule CISIA does not describe.`,
    diagnosticFidelityNote:
      'A short skill check, not a predictor of a TOLC-E score. It has four questions from each section at a generous pace and lets you move back and change answers. Use it to find weak areas.',
    practiceFidelityNote:
      'A study tool, not a reproduction of the exam: untimed, free navigation, and whatever section, topic and difficulty you choose.',
  }),

  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: -0.25,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'TOLC-E absolute score, excluding English, out of 36',
      min: -9,
      max: 36,
      increment: 0.25,
      note: 'CISIA reports an absolute score ("punteggio assoluto") for the three main sections: 36 questions at 1 point, with the -0.25 penalty. The minimum shown is the arithmetic floor if every question were answered wrongly; CISIA does not say whether a negative total is reported as such. The English section is reported separately on its own 0-30 scale.',
    },
    scaledEstimate: {
      enabled: false,
      reason:
        'CISIA reports the absolute score itself; any transformation is done by each university with its own system, which is not national and not modelled here.',
    },
    rawProjection: {
      scoredItems: 36,
      reportFactor: 1,
      thresholds: [],
      noThresholdReason:
        'CISIA sets no pass mark for the TOLC-E. Each university may transform the score, weight the three sections and set its own minimum, and the minimum often differs between programmes at the same university. Check the admission notice (bando) of the programme you are applying to, and set that number as your target.',
      conditions: '36 questions in three separately timed sections of 30 minutes, no calculator or other aids',
      caveats: [
        'It covers the three main sections only. The English section is scored separately and some universities use it too.',
        'A university that weights sections differently will turn the same answers into a different result.',
      ],
    },
    notes: [...TOLC_SCORING_NOTES],
  },

  capabilities: {
    fullSimulation: {
      available: true,
      note:
        'Structure, section clocks, answer format and scoring are published by CISIA and verified. Labelled an approximation because CISIA does not describe navigation within a section, and because the separately scored English section is not included.',
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

  unverified: [...TOLC_UNVERIFIED],
};
