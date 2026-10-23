import type { ExamConfig } from '@/lib/assessment/types';
import { sectionedBlueprints, type SectionSpec } from './_sectioned';
import {
  TOLC_NO_CALCULATOR,
  TOLC_REGULATION_2026,
  TOLC_RULES_PAGE,
  TOLC_SCORING_NOTES,
  TOLC_UNVERIFIED,
  tolcSectionNavigation,
} from './_tolc';

/**
 * CISIA TOLC-E - the TOLC for Economics, Business and Statistics.
 *
 * Added for the University of Turin's SAA School of Management, whose
 * Italian-taught business bachelor's programmes (for example Economia
 * aziendale) admit through the TOLC-E. It is also accepted by many other
 * Italian universities.
 *
 * DRAFT. Nothing in this file has been verified first-hand: cisiaonline.it
 * and unito.it were unreachable from the build environment, so the structure,
 * timing, scoring and syllabus below are drafted from CISIA's published
 * format as the author understood it. The config is therefore registered in
 * `DRAFT_EXAM_CONFIGS`, which the product never serves, and every structural
 * fact is listed in `unverified`. It moves to `EXAM_CONFIGS` only after each
 * fact is re-read against the sources and recorded in docs/research/tolc-e.md.
 *
 * Distinctive behaviours encoded:
 *  - three consecutive sections, 30 minutes each, no return to a closed one;
 *  - five options per question, one correct; +1 / 0 / -0.25;
 *  - no national pass mark: each university sets its own use of the score;
 *  - a separate English section, scored without penalty, not modelled here.
 */

const STRUCTURE_PAGE = 'https://www.cisiaonline.it/en/tolc-e/structure-and-syllabus';
const UNITO_ADMISSIONS =
  'https://www.unito.it/didattica/iscrizioni/corsi-di-laurea-triennali-ad-accesso-programmato/iscrizione-ai-corsi-di-0';
const UNVERIFIED_ON = 'not yet verified';

const SECTIONS: SectionSpec[] = [
  { key: 'logic', name: 'Logic', questions: 13, minutes: 30, domains: ['tolce-logic'] },
  { key: 'verbal-comprehension', name: 'Verbal comprehension', questions: 10, minutes: 30, domains: ['tolce-verbal'] },
  { key: 'mathematics', name: 'Mathematics', questions: 13, minutes: 30, domains: ['tolce-mathematics'] },
];

const skill = (slug: string, name: string, description: string) => ({ slug, name, description });

const sectionConfig = (spec: SectionSpec, order: number, notes: string[]) => ({
  key: spec.key,
  name: spec.name,
  order,
  officialQuestionCount: String(spec.questions),
  officialTimeMinutes: spec.minutes,
  calculator: 'none' as const,
  calculatorNote: TOLC_NO_CALCULATOR,
  navigation: tolcSectionNavigation(STRUCTURE_PAGE),
  responseTypes: ['single_select' as const],
  notes,
});

export const tolcEConfig: ExamConfig = {
  examKey: 'tolc-e',
  version: '2026.10-draft',
  name: 'CISIA TOLC-E (Economics and Business)',
  shortName: 'TOLC-E',
  publisher: 'CISIA',
  versionLabel:
    'TOLC-E as used for admission to Italian-taught economics and business bachelor’s programmes, including those of the University of Turin’s SAA School of Management, a.y. 2026/27. DRAFT: structure, timing and scoring not yet verified against CISIA’s published rules.',
  admissionsCycle: 'Academic year 2026/27 (draft; to be confirmed against the TOLC 2026 regulation)',
  verifiedOn: UNVERIFIED_ON,
  audience: ['undergraduate'],
  summary:
    'CISIA’s online test for economics, business and statistics degrees, taken at a university (TOLC@UNI) or from home under remote supervision (TOLC@CASA). It is 36 questions in three consecutive, separately timed sections: Logic 13 questions in 30 minutes, Verbal comprehension 10 in 30, Mathematics 13 in 30. Each question has five options, one correct; a correct answer scores 1, a blank 0 and a wrong answer -0.25. A 30-question English section follows and is scored separately. CISIA sets no pass mark: each university decides how it uses the score. Draft summary, not yet verified against CISIA’s published rules.',

  sources: [
    { label: 'TOLC 2026 regulation (Regolamento TOLC 2026)', url: TOLC_REGULATION_2026, publisher: 'CISIA', verifiedOn: UNVERIFIED_ON },
    { label: 'TOLC rules page', url: TOLC_RULES_PAGE, publisher: 'CISIA', verifiedOn: UNVERIFIED_ON },
    { label: 'TOLC-E structure and syllabus', url: STRUCTURE_PAGE, publisher: 'CISIA', verifiedOn: UNVERIFIED_ON },
    {
      label: 'University of Turin: bachelor’s programmes admitting through the SAT or a TOLC, a.y. 2026/27',
      url: UNITO_ADMISSIONS,
      publisher: 'Università degli Studi di Torino',
      verifiedOn: UNVERIFIED_ON,
    },
  ],

  sections: [
    sectionConfig(SECTIONS[0], 0, ['Sequences, deductions and short reasoning problems that need no prior knowledge.']),
    sectionConfig(SECTIONS[1], 1, ['Short texts, each followed by questions answered only from what the text says or implies.']),
    sectionConfig(SECTIONS[2], 2, ['School mathematics: sets, arithmetic and algebra, geometry, functions and graphs, probability and statistics.']),
  ],

  domains: [
    {
      slug: 'tolce-logic',
      name: 'Logic',
      sectionKey: 'logic',
      description: 'Reasoning from given information: completing sequences, drawing valid conclusions and solving short problems.',
      officialShare: '13 of 36 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolce-logic-sequences', 'Sequences', 'Finding the rule behind a sequence of numbers, letters or words and continuing it.'),
        skill('tolce-logic-deduction', 'Deduction', 'What must follow from premises, including statements with "all", "some" and "none", and their negations.'),
        skill('tolce-logic-arrangements', 'Orders and arrangements', 'Placing people or objects in an order that satisfies every condition.'),
        skill('tolce-logic-problems', 'Reasoning problems', 'Short word problems solved by reasoning rather than formal calculation.'),
      ],
    },
    {
      slug: 'tolce-verbal',
      name: 'Verbal comprehension',
      sectionKey: 'verbal-comprehension',
      description: 'Understanding short texts on economic, social and general topics, answering only from the text.',
      officialShare: '10 of 36 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolce-verbal-stated', 'What the text states', 'Locating information the text gives explicitly.'),
        skill('tolce-verbal-inferred', 'What the text implies', 'The conclusion the text supports, and rejecting ones it does not.'),
        skill('tolce-verbal-purpose', 'Purpose and structure', 'The aim of the text and the role of a sentence or paragraph in it.'),
        skill('tolce-verbal-vocabulary', 'Meaning in context', 'What a word or phrase means as the text uses it.'),
      ],
    },
    {
      slug: 'tolce-mathematics',
      name: 'Mathematics',
      sectionKey: 'mathematics',
      description: 'The school mathematics the TOLC-E syllabus lists.',
      officialShare: '13 of 36 questions',
      source: STRUCTURE_PAGE,
      skills: [
        skill('tolce-math-sets-logic', 'Sets and elementary logic', 'Sets, their operations, and logical connectives.'),
        skill('tolce-math-arithmetic-algebra', 'Arithmetic and algebra', 'Fractions, percentages, powers and radicals; polynomials; equations, inequalities and systems.'),
        skill('tolce-math-geometry', 'Geometry', 'Plane figures, lengths, areas and volumes; points and lines in the Cartesian plane.'),
        skill('tolce-math-functions', 'Functions and graphs', 'Linear, quadratic, exponential and logarithmic functions and reading their graphs.'),
        skill('tolce-math-probability-statistics', 'Probability and statistics', 'Elementary probability, averages and reading data.'),
      ],
    },
  ],

  blueprints: sectionedBlueprints({
    examLabel: 'TOLC-E',
    sections: SECTIONS,
    diagnosticPerSection: 3,
    diagnosticSecondsPerItem: 180,
    responseTypes: ['single_select'],
    simulationFidelityNote:
      'Follows the TOLC-E format as drafted: three sections of 30 minutes in order, 36 questions, five options per question, +1 / 0 / -0.25, no calculator, and no return to a closed section. Not yet verified against CISIA’s published rules. Our questions are original, not CISIA items, and their difficulty is our editorial judgement; moving back within the open section is allowed here, a rule CISIA does not describe; the separate English section is not included.',
    timedFidelityNote: (section) =>
      `The drafted length and clock of the TOLC-E ${section.name} section, with the TOLC scoring. Our questions are original and their difficulty is editorial; moving back within the section is allowed here.`,
    diagnosticFidelityNote:
      'A short skill check, not a predictor of a TOLC-E score. Three questions from each section, about three minutes per question, with free movement and changes allowed. Use it to find weak areas.',
    practiceFidelityNote:
      'A study tool, not a reproduction of the exam: untimed, free navigation, and whatever section, topic and difficulty you choose.',
  }),

  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: -0.25,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'TOLC-E score (main sections)',
      min: -9,
      max: 36,
      increment: 0.25,
      note: 'The absolute score CISIA reports for the 36 scored questions. The minimum shown is the arithmetic floor if every question were answered wrongly; whether CISIA reports a negative score as such is unverified.',
    },
    scaledEstimate: {
      enabled: false,
      reason: 'Nothing to estimate: CISIA reports the raw penalty-adjusted score, and each university applies its own rules to it.',
    },
    rawProjection: {
      scoredItems: 36,
      reportFactor: 1,
      thresholds: [],
      noThresholdReason:
        'CISIA publishes no pass mark for the TOLC-E. Each university decides how it uses the score: some rank applicants for a limited number of places, some set a minimum, and some assign extra coursework below a set score. The number that matters is in the admission notice (bando) of the programme you apply to, such as the University of Turin’s call for its SAA programmes.',
      conditions: '36 questions in three sections of 30 minutes, 90 minutes, no calculator',
      caveats: ['It covers the three main sections only; the separately scored English section is not included.'],
    },
    notes: TOLC_SCORING_NOTES,
  },

  capabilities: {
    fullSimulation: {
      available: false,
      reason:
        'The TOLC-E structure has not yet been verified against CISIA’s published rules. A simulation opens once it is.',
    },
    adaptiveRouting: {
      available: false,
      reason: 'The TOLC-E is not adaptive: every candidate answers a fixed number of questions per section.',
    },
    scaledScoreEstimate: {
      available: false,
      reason: 'There is no scaled score. CISIA reports the raw penalty-adjusted score.',
    },
  },

  unverified: [
    'Every structural fact in this config: question counts (13 / 10 / 13), section times (30 minutes each), five options per question, the order of the sections, and the English section (30 questions, 15 minutes, no penalty).',
    'The scoring rule (+1 / 0 / -0.25) as it applies to the TOLC-E, against the TOLC 2026 regulation.',
    'The topic list for each section, against the official TOLC-E syllabus.',
    'Which University of Turin and SAA programmes require the TOLC-E for 2026/27, and how each uses the score.',
    ...TOLC_UNVERIFIED,
  ],
  contentLocales: ['en', 'it'],
};
