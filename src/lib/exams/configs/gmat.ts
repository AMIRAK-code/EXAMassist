import type {
  Blueprint,
  Domain,
  ExamConfig,
  NavigationPolicy,
  SectionConfig,
  SourceRef,
} from '@/lib/assessment/types';

/**
 * GMAT Exam — versioned configuration.
 *
 * Every value below is taken from the verified research record at
 * content/exam-specs/_raw/gmat-focus.draft.json (verified 2026-09-18 against
 * mba.com / gmac.com and the August 2026 GMAT Exam Policies & Procedures).
 * Nothing here is inferred: rules GMAC does not publish live in `unverified`
 * and switch the dependent capability off.
 *
 * Two facts drive most of the conservative choices in this file:
 *  1. All three sections are QUESTION-LEVEL computer-adaptive, and GMAC
 *     publishes no part of the routing rule. We cannot reproduce it, so both
 *     `fullSimulation` and `adaptiveRouting` are unavailable and there is no
 *     "simulation-full" blueprint.
 *  2. No raw-to-scaled conversion is published for the 60-90 section scales or
 *     the 205-805 Total Score, so we never output a score on those scales.
 */

const VERIFIED_ON = '2026-09-18';

const STRUCTURE_URL = 'https://www.mba.com/exams/gmat-exam/about/exam-structure';
const CONTENT_URL = 'https://www.mba.com/exams/gmat-exam/about/exam-content';
const SCORE_URL = 'https://www.mba.com/exams/gmat-exam/scores/understanding-your-score';
const WHAT_TO_EXPECT_URL =
  'https://www.mba.com/exams-and-exam-prep/gmat-exam/what-to-expect-during-gmat';
const POLICIES_PDF_URL =
  'https://www.mba.com/-/media/files/mba2/the-gmat-exam/files/register/gmat-policies-and-procedures_aug-2026.pdf';

const SECTION_SECONDS = 45 * 60;

/**
 * One navigation policy for all three sections: GMAC documents the same rule
 * everywhere. Adaptive delivery is one question at a time with no free
 * backward movement; bookmarking and reviewing are unlimited; editing is
 * hard-capped at three answers per section on the Question Review & Edit
 * screen, which is reached only after every question is answered and only if
 * section time remains.
 */
const gmatSectionNavigation: NavigationPolicy = {
  allowBackWithinPart: false,
  allowForwardSkip: false,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  allowReturnToPreviousPart: false,
  reviewScreen: true,
  reviewScreenEditable: true,
  bookmarkLimitPerPart: null,
  editLimitPerPart: 3,
  enforcement: 'server',
  source: STRUCTURE_URL,
};

/** Relaxed navigation for our own practice-only blueprints (not an exam rule). */
const practiceNavigationOverride: Partial<NavigationPolicy> = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  editLimitPerPart: null,
  enforcement: 'server',
  source: 'our practice-only navigation; not a GMAT rule',
};

const sources: SourceRef[] = [
  {
    label: 'GMAT Exam structure: 64 questions, three 45-minute sections, Question Review & Edit',
    url: STRUCTURE_URL,
    publisher: 'GMAC / mba.com',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'GMAT Exam content: question types per section and calculator availability',
    url: CONTENT_URL,
    publisher: 'GMAC / mba.com',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'Understanding your score: 60-90 section scales, 205-805 Total Score, scoring factors',
    url: SCORE_URL,
    publisher: 'GMAC / mba.com',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'What to expect during the GMAT: adaptivity, section order, breaks, edit cap',
    url: WHAT_TO_EXPECT_URL,
    publisher: 'GMAC / mba.com',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'GMAT Exam Policies & Procedures, August 2026 (break rules, on-screen calculator)',
    url: POLICIES_PDF_URL,
    publisher: 'GMAC / mba.com',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'Quantitative Reasoning prep strategies: Problem Solving only',
    url: 'https://www.mba.com/exams/gmat-exam/prep-for-the-exam/prep-strategies/quantitative-reasoning',
    publisher: 'GMAC / mba.com',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'Verbal Reasoning prep strategies: Reading Comprehension and Critical Reasoning only',
    url: 'https://www.mba.com/exams/gmat-exam/prep-for-the-exam/prep-strategies/verbal-reasoning',
    publisher: 'GMAC / mba.com',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'Data Insights prep strategies: the five Data Insights question types',
    url: 'https://www.mba.com/exams/gmat-exam/prep-for-the-exam/prep-strategies/data-insights',
    publisher: 'GMAC / mba.com',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'GMAT Exam FAQs: three 45-minute sections, no essay, no grammar testing',
    url: 'https://www.mba.com/exams/gmat-exam/faqs',
    publisher: 'GMAC / mba.com',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'GMAC exam details: Sentence Correction removed, Data Sufficiency moved to Data Insights',
    url: 'https://www.gmac.com/resources/learners/how-to-apply/exams-preparation/new-gmat-exam-details',
    publisher: 'GMAC',
    verifiedOn: VERIFIED_ON,
  },
];

const sections: SectionConfig[] = [
  {
    key: 'quantitative-reasoning',
    name: 'Quantitative Reasoning',
    order: 0,
    officialQuestionCount: '21',
    officialTimeMinutes: 45,
    calculator: 'none',
    calculatorNote:
      'No calculator of any kind. mba.com states "You cannot use a calculator while working on this section." Personal and watch calculators are prohibited testing aids. Scratch work is done on a provided noteboard (test centre) or whiteboard (online).',
    navigation: gmatSectionNavigation,
    responseTypes: ['single_select'],
    notes: [
      '21 questions, all Problem Solving, each with five answer choices.',
      'Data Sufficiency is NOT in this section any more — it moved to Data Insights.',
      'Question-level computer-adaptive: the next question is selected from previous responses.',
      'The optional 10-minute break may follow this section if it is the first or second section taken.',
    ],
  },
  {
    key: 'verbal-reasoning',
    name: 'Verbal Reasoning',
    order: 1,
    officialQuestionCount: '23',
    officialTimeMinutes: 45,
    calculator: 'not_applicable',
    calculatorNote:
      'No calculator. The on-screen calculator is provided in Data Insights only.',
    navigation: gmatSectionNavigation,
    responseTypes: ['single_select'],
    notes: [
      '23 questions: Reading Comprehension and Critical Reasoning only.',
      'Sentence Correction no longer exists; GMAC states the exam does not test vocabulary or grammar.',
      'Critical Reasoning stimuli are short, usually under 100 words per the official description.',
      'Question-level computer-adaptive, the same as every other section.',
    ],
  },
  {
    key: 'data-insights',
    name: 'Data Insights',
    order: 2,
    officialQuestionCount: '20',
    officialTimeMinutes: 45,
    calculator: 'onscreen',
    calculatorNote:
      'An on-screen calculator is provided in this section only: "You can use an on-screen calculator while working on this section." GMAC does not publish the calculator\'s feature set, so ours is a basic four-function approximation, not a replica.',
    navigation: gmatSectionNavigation,
    responseTypes: ['single_select', 'multi_select', 'data_sufficiency', 'two_part'],
    notes: [
      '20 questions spanning Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation and Two-Part Analysis.',
      'This is where Data Sufficiency now lives, and where the retired Integrated Reasoning formats were absorbed.',
      'Multi-part questions award no partial credit: every part must be correct to earn credit for the question.',
      'No break follows this section; the single optional break must be taken after the first or second section.',
    ],
  },
];

const domains: Domain[] = [
  {
    slug: 'quant-problem-solving',
    name: 'Problem Solving',
    sectionKey: 'quantitative-reasoning',
    description:
      'Solving quantitative problems with arithmetic and elementary algebra. GMAC states the section "is composed of 21 Problem Solving questions" and that geometry is not tested.',
    officialShare: 'All 21 questions in the Quantitative Reasoning section',
    skills: [
      { slug: 'qps-arithmetic', name: 'Arithmetic', description: 'Arithmetic reasoning and computation without a calculator.' },
      { slug: 'qps-elementary-algebra', name: 'Elementary algebra', description: 'Expressions, equations and inequalities at elementary-algebra level.' },
      { slug: 'qps-applied-arithmetic-algebra', name: 'Applying arithmetic and algebraic knowledge to solve problems', description: 'Translating a word problem into arithmetic or algebra and solving it.' },
      { slug: 'qps-logic-analytical-reasoning', name: 'Logic and analytical reasoning applied to quantitative problems', description: 'Reasoning about structure and constraints rather than grinding computation.' },
      { slug: 'qps-approximation-estimation', name: 'Approximation and estimation', description: 'Estimating to eliminate answer choices under time pressure and without a calculator.' },
    ],
    source: CONTENT_URL,
  },
  {
    slug: 'verbal-reading-comprehension',
    name: 'Reading Comprehension',
    sectionKey: 'verbal-reasoning',
    description:
      'Understanding, analysing and applying information from written passages. Items are grouped under a shared passage.',
    officialShare: null,
    skills: [
      { slug: 'rc-main-idea', name: 'Main idea', description: 'Identifying the central point of a passage.' },
      { slug: 'rc-supporting-idea', name: 'Supporting idea', description: 'Locating and interpreting explicitly stated detail.' },
      { slug: 'rc-inference', name: 'Inference', description: 'Drawing conclusions the passage supports but does not state.' },
      { slug: 'rc-application', name: 'Application', description: 'Applying the passage\'s reasoning to a new situation.' },
      { slug: 'rc-logical-structure', name: 'Logical structure', description: 'Analysing how the passage is organised and how its parts function.' },
      { slug: 'rc-style', name: 'Style', description: 'Recognising tone, attitude and rhetorical purpose.' },
    ],
    source: CONTENT_URL,
  },
  {
    slug: 'verbal-critical-reasoning',
    name: 'Critical Reasoning',
    sectionKey: 'verbal-reasoning',
    description:
      'Evaluating short arguments, usually under 100 words, and the plans and conclusions built on them.',
    officialShare: null,
    skills: [
      { slug: 'cr-construct-argument', name: 'Construct or make an argument', description: 'Assembling premises into a supported conclusion.' },
      { slug: 'cr-evaluate-argument', name: 'Evaluate an argument', description: 'Judging what would help determine whether an argument holds.' },
      { slug: 'cr-strengthen-argument', name: 'Strengthen an argument', description: 'Identifying information that makes a conclusion more likely.' },
      { slug: 'cr-weaken-argument', name: 'Weaken an argument', description: 'Identifying information that undermines a conclusion.' },
      { slug: 'cr-identify-flaw', name: 'Identify a flaw in the reasoning', description: 'Naming the logical gap between premises and conclusion.' },
      { slug: 'cr-evaluate-plan', name: 'Formulate or evaluate a plan of action', description: 'Assessing whether a proposed course of action achieves its aim.' },
    ],
    source: CONTENT_URL,
  },
  {
    slug: 'di-data-sufficiency',
    name: 'Data Sufficiency',
    sectionKey: 'data-insights',
    description:
      'Deciding whether the given statements provide enough data to answer a question, using the fixed five-choice sufficiency answer set. Data Sufficiency sits in Data Insights, not in Quantitative Reasoning.',
    officialShare: null,
    skills: [
      { slug: 'ds-analyze-quantitative-problem', name: 'Analyze a quantitative problem', description: 'Reading the question stem for exactly what must be determined.' },
      { slug: 'ds-recognize-relevant-data', name: 'Recognize which data is relevant', description: 'Separating data that bears on the question from data that does not.' },
      { slug: 'ds-sufficiency-threshold', name: 'Determine at what point there is enough data to solve the problem', description: 'Stopping at sufficiency rather than solving for the value.' },
      { slug: 'ds-avoid-unwarranted-assumptions', name: 'Avoid unwarranted assumptions from figures not drawn to scale', description: 'Not reading unstated properties off a diagram.' },
      { slug: 'ds-unique-value-vs-range', name: 'Distinguish a unique value from a range of values', description: 'Recognising when statements narrow to one value versus many.' },
    ],
    source: CONTENT_URL,
  },
  {
    slug: 'di-multi-source-reasoning',
    name: 'Multi-Source Reasoning',
    sectionKey: 'data-insights',
    description:
      'Reasoning across two or more tabbed sources — text passages, tables and graphics — that must stay accessible while each question in the set is answered.',
    officialShare: null,
    skills: [
      { slug: 'msr-examine-multiple-sources', name: 'Examine data from multiple sources', description: 'Working across text passages, tables and graphics presented as tabs.' },
      { slug: 'msr-recognize-discrepancies', name: 'Recognize discrepancies among different sources of data', description: 'Spotting where sources disagree or fail to line up.' },
      { slug: 'msr-draw-combined-inferences', name: 'Draw inferences from combined sources', description: 'Reaching conclusions that no single source supports alone.' },
      { slug: 'msr-judge-source-relevance', name: 'Determine whether a data source is relevant', description: 'Deciding which tab actually bears on the question asked.' },
    ],
    source: CONTENT_URL,
  },
  {
    slug: 'di-table-analysis',
    name: 'Table Analysis',
    sectionKey: 'data-insights',
    description:
      'Sorting and reading a spreadsheet-like table, then judging a set of statements against a binary condition such as yes/no or true/false.',
    officialShare: null,
    skills: [
      { slug: 'ta-sort-table', name: 'Sort a table of data', description: 'Using column sorting to expose the ordering a question depends on.' },
      { slug: 'ta-analyze-spreadsheet-data', name: 'Analyze spreadsheet-like data', description: 'Reading rows, columns and derived quantities accurately.' },
      { slug: 'ta-determine-relevance', name: 'Determine what information is relevant', description: 'Ignoring the columns that do not bear on the statement.' },
      { slug: 'ta-judge-condition-met', name: 'Judge whether a stated condition has been met', description: 'Evaluating each statement as a binary yes/no or true/false judgement.' },
    ],
    source: CONTENT_URL,
  },
  {
    slug: 'di-graphics-interpretation',
    name: 'Graphics Interpretation',
    sectionKey: 'data-insights',
    description:
      'Reading a graph or chart and completing statements using drop-down menus.',
    officialShare: null,
    skills: [
      { slug: 'gi-scatter-plots', name: 'Interpret scatter plots', description: 'Reading association, clustering and outliers from a scatter plot.' },
      { slug: 'gi-xy-graphs', name: 'Interpret x/y graphs', description: 'Reading values, slopes and intercepts from a coordinate graph.' },
      { slug: 'gi-bar-charts', name: 'Interpret bar charts', description: 'Comparing categories and reading magnitudes from bars.' },
      { slug: 'gi-pie-charts', name: 'Interpret pie charts', description: 'Reading shares of a whole and converting them to quantities.' },
      { slug: 'gi-statistical-distributions', name: 'Interpret statistical curve distributions', description: 'Reading centre, spread and shape from a distribution curve.' },
      { slug: 'gi-discern-relationships', name: 'Discern relationships from a graphic', description: 'Identifying how the plotted variables move together.' },
      { slug: 'gi-graphical-inference', name: 'Make inferences from graphical data', description: 'Concluding beyond the plotted points without overreaching.' },
    ],
    source: CONTENT_URL,
  },
  {
    slug: 'di-two-part-analysis',
    name: 'Two-Part Analysis',
    sectionKey: 'data-insights',
    description:
      'Two response columns judged against one shared option list. The two tasks may be dependent or independent, and the same option may be correct in both columns.',
    officialShare: null,
    skills: [
      { slug: 'tpa-complex-problems', name: 'Solve complex quantitative, verbal or combined problems', description: 'Handling items that mix quantitative and verbal reasoning.' },
      { slug: 'tpa-evaluate-tradeoffs', name: 'Evaluate trade-offs', description: 'Weighing competing constraints to pick a pair of answers.' },
      { slug: 'tpa-simultaneous-equations', name: 'Solve simultaneous equations', description: 'Resolving two linked conditions at once.' },
      { slug: 'tpa-relationships-between-entities', name: 'Discern relationships between two entities', description: 'Mapping how two quantities or claims relate.' },
      { slug: 'tpa-dependent-independent-tasks', name: 'Handle dependent versus independent paired tasks', description: 'Recognising when the second column depends on the first.' },
    ],
    source: CONTENT_URL,
  },
];

const DIAGNOSTIC_FIDELITY_NOTE =
  'A short skill check, not a predictor of a GMAT score. It samples every content domain in a fraction of the real item count, is not adaptive, and produces no 60-90 section score and no 205-805 Total Score. Navigation is relaxed for learning: you may move back freely and change answers without limit, unlike the real exam.';

const TIMED_FIDELITY_NOTE_MATCHES =
  'What matches the real section: the published item count, the 45-minute server-enforced clock, and the real navigation rule (one question at a time, no free backward movement, unlimited bookmarking, a Question Review & Edit screen after the last answer that is available only while time remains, and a hard cap of three answer edits). What does NOT match: our items are original and editorially written, their difficulty labels are editorial rather than statistically calibrated, delivery is NOT question-level adaptive because GMAC publishes no part of its routing algorithm, there are no pretest items, and no 60-90 section score is produced.';

const blueprints: Blueprint[] = [
  {
    id: 'diagnostic',
    label: 'GMAT diagnostic',
    mode: 'diagnostic',
    description:
      'A 15-question skill check across all three GMAT sections and all eight content domains, timed generously at roughly 1.5x the real exam pace so pacing is not the constraint.',
    parts: [
      {
        key: 'diagnostic-quantitative-reasoning',
        sectionKey: 'quantitative-reasoning',
        label: 'Quantitative Reasoning check',
        timeLimitSeconds: 780,
        itemCount: 4,
        selection: {
          sectionKey: 'quantitative-reasoning',
          domains: ['quant-problem-solving'],
          skills: [],
          responseTypes: ['single_select'],
          difficultyMix: null,
          allowRepeatsWithinAttempt: false,
          avoidSeenWithinDays: 30,
        },
        navigationOverride: practiceNavigationOverride,
        breakAfterSeconds: null,
        adaptive: null,
      },
      {
        key: 'diagnostic-verbal-reasoning',
        sectionKey: 'verbal-reasoning',
        label: 'Verbal Reasoning check',
        timeLimitSeconds: 900,
        itemCount: 5,
        selection: {
          sectionKey: 'verbal-reasoning',
          domains: ['verbal-reading-comprehension', 'verbal-critical-reasoning'],
          skills: [],
          responseTypes: ['single_select'],
          difficultyMix: null,
          allowRepeatsWithinAttempt: false,
          avoidSeenWithinDays: 30,
        },
        navigationOverride: practiceNavigationOverride,
        breakAfterSeconds: null,
        adaptive: null,
      },
      {
        key: 'diagnostic-data-insights',
        sectionKey: 'data-insights',
        label: 'Data Insights check',
        timeLimitSeconds: 1200,
        itemCount: 6,
        selection: {
          sectionKey: 'data-insights',
          domains: [
            'di-data-sufficiency',
            'di-multi-source-reasoning',
            'di-table-analysis',
            'di-graphics-interpretation',
            'di-two-part-analysis',
          ],
          skills: [],
          responseTypes: [],
          difficultyMix: null,
          allowRepeatsWithinAttempt: false,
          avoidSeenWithinDays: 30,
        },
        navigationOverride: practiceNavigationOverride,
        breakAfterSeconds: null,
        adaptive: null,
      },
    ],
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_pauses',
    fidelity: 'practice_only',
    fidelityNote: DIAGNOSTIC_FIDELITY_NOTE,
  },
  {
    id: 'practice',
    label: 'Practice set',
    mode: 'practice',
    description:
      'A template for free practice: ten questions, untimed, with relaxed navigation. Section, domain, difficulty and length are all overridden by the learner at runtime; the values stored here are only the defaults.',
    parts: [
      {
        key: 'practice-set',
        sectionKey: 'quantitative-reasoning',
        label: 'Practice questions',
        timeLimitSeconds: null,
        itemCount: 10,
        selection: {
          sectionKey: 'quantitative-reasoning',
          domains: [],
          skills: [],
          responseTypes: [],
          difficultyMix: null,
          allowRepeatsWithinAttempt: false,
          avoidSeenWithinDays: 30,
        },
        navigationOverride: practiceNavigationOverride,
        breakAfterSeconds: null,
        adaptive: null,
      },
    ],
    timing: 'untimed',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_pauses',
    fidelity: 'practice_only',
    fidelityNote:
      'Free practice, not an exam experience. It is untimed, not adaptive, and lets you move back and change answers without the real exam\'s three-edit cap. It produces no GMAT score of any kind.',
  },
  {
    id: 'timed-quantitative-reasoning',
    label: 'Timed Quantitative Reasoning section',
    mode: 'practice',
    description:
      'The published Quantitative Reasoning section shape: 21 Problem Solving questions in 45 minutes, under the real GMAT navigation and Question Review & Edit rules.',
    parts: [
      {
        key: 'timed-quantitative-reasoning-part',
        sectionKey: 'quantitative-reasoning',
        label: 'Quantitative Reasoning (45 minutes)',
        timeLimitSeconds: SECTION_SECONDS,
        itemCount: 21,
        selection: {
          sectionKey: 'quantitative-reasoning',
          domains: ['quant-problem-solving'],
          skills: [],
          responseTypes: ['single_select'],
          difficultyMix: null,
          allowRepeatsWithinAttempt: false,
          avoidSeenWithinDays: 30,
        },
        navigationOverride: null,
        breakAfterSeconds: null,
        adaptive: null,
      },
    ],
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote: TIMED_FIDELITY_NOTE_MATCHES,
  },
  {
    id: 'timed-verbal-reasoning',
    label: 'Timed Verbal Reasoning section',
    mode: 'practice',
    description:
      'The published Verbal Reasoning section shape: 23 Reading Comprehension and Critical Reasoning questions in 45 minutes, under the real GMAT navigation and Question Review & Edit rules.',
    parts: [
      {
        key: 'timed-verbal-reasoning-part',
        sectionKey: 'verbal-reasoning',
        label: 'Verbal Reasoning (45 minutes)',
        timeLimitSeconds: SECTION_SECONDS,
        itemCount: 23,
        selection: {
          sectionKey: 'verbal-reasoning',
          domains: ['verbal-reading-comprehension', 'verbal-critical-reasoning'],
          skills: [],
          responseTypes: ['single_select'],
          difficultyMix: null,
          allowRepeatsWithinAttempt: false,
          avoidSeenWithinDays: 30,
        },
        navigationOverride: null,
        breakAfterSeconds: null,
        adaptive: null,
      },
    ],
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote: `${TIMED_FIDELITY_NOTE_MATCHES} GMAC also does not publish how many Reading Comprehension passages a section contains or how many questions hang off each passage, so our passage split is editorial.`,
  },
  {
    id: 'timed-data-insights',
    label: 'Timed Data Insights section',
    mode: 'practice',
    description:
      'The published Data Insights section shape: 20 questions across all five Data Insights types in 45 minutes, with the on-screen calculator available, under the real GMAT navigation and Question Review & Edit rules.',
    parts: [
      {
        key: 'timed-data-insights-part',
        sectionKey: 'data-insights',
        label: 'Data Insights (45 minutes)',
        timeLimitSeconds: SECTION_SECONDS,
        itemCount: 20,
        selection: {
          sectionKey: 'data-insights',
          domains: [
            'di-data-sufficiency',
            'di-multi-source-reasoning',
            'di-table-analysis',
            'di-graphics-interpretation',
            'di-two-part-analysis',
          ],
          skills: [],
          responseTypes: [],
          difficultyMix: null,
          allowRepeatsWithinAttempt: false,
          avoidSeenWithinDays: 30,
        },
        navigationOverride: null,
        breakAfterSeconds: null,
        adaptive: null,
      },
    ],
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote: `${TIMED_FIDELITY_NOTE_MATCHES} GMAC publishes no per-type mix for Data Insights, no Multi-Source Reasoning set size, and no Table Analysis or Graphics Interpretation item dimensions, so those are editorial; our on-screen calculator is a basic four-function approximation because the real one's feature set is not published.`,
  },
];

export const gmatConfig: ExamConfig = {
  examKey: 'gmat',
  version: '2026.09',
  name: 'GMAT Exam',
  shortName: 'GMAT',
  publisher: 'Graduate Management Admission Council (GMAC)',
  versionLabel:
    'GMAT Exam (current version, formerly branded "GMAT Exam (Focus Edition)") — 2026 administration; Policies & Procedures last updated August 12, 2026',
  admissionsCycle:
    'Graduate management admissions (MBA and business master\'s). Scores are valid for five years from the test date, so a 2026 score is usable through the 2031 application cycles. Legacy "GMAT Exam (10th Edition)" scores remain valid for five years from their appointment date but are not comparable to current scores.',
  verifiedOn: VERIFIED_ON,
  audience: ['graduate'],
  summary:
    'The GMAT Exam is 2 hours 15 minutes of testing time, 64 questions, in three equally timed 45-minute sections: Quantitative Reasoning (21), Verbal Reasoning (23) and Data Insights (20). The candidate picks the section order from six choices and gets one optional 10-minute break after the first or second section. All three sections are question-level computer-adaptive and serve one question at a time with no free backward movement; after the last answer, and only if time remains, a Question Review & Edit screen allows unlimited review and up to three answer changes. An on-screen calculator is available in Data Insights only. Sentence Correction, the AWA essay and standalone Integrated Reasoning no longer exist, and Data Sufficiency now sits in Data Insights. Section scores run 60-90 and the Total Score runs 205-805, weighted equally across the three sections.',
  sources,
  sections,
  domains,
  blueprints,
  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: 0,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'GMAT Total Score',
      min: 205,
      max: 805,
      increment: 10,
      note: 'The official reported scale, shown as a fact about the exam — we do not produce a score on it. Each of Quantitative Reasoning, Verbal Reasoning and Data Insights is reported 60-90 in 1-point increments, and the three are weighted equally in the 205-805 Total Score. The 205-805 scale is deliberately not comparable to the retired 200-800 GMAT Exam (10th Edition) scale; GMAC directs users to compare percentile rankings instead.',
    },
    scaledEstimate: {
      enabled: false,
      reason:
        'GMAC publishes no raw-to-scaled conversion for the GMAT. Section scores are described only as depending on "the number of questions answered, whether the answers are correct or incorrect, and the difficulty and other parameters of the questions answered", with no IRT parameters, no ability-estimation method and no conversion table for the 60-90 section scales or the 205-805 Total Score. Any estimate we produced would be invented, so we report raw accuracy, per-domain accuracy and pacing only.',
    },
    notes: [
      'There is no wrong-answer penalty: an incorrect answer is simply not credited.',
      'Unanswered questions do hurt — GMAC says scores "decrease significantly with each unanswered question" — but the magnitude is not published, so we model no specific penalty and instead report items left unanswered.',
      'Data Insights multi-part questions are all-or-nothing: every part must be correct to earn credit for the question.',
      'GMAC publishes percentile tables for the Total Score and each section score (2021-2026 data period, Total Score sample 509,182, mean 554.94, SD 94.24). We show these as reference content on the exam hub only and never map a practice attempt onto them.',
      'The three permitted Question Review & Edit changes are implemented as a navigation rule only. GMAC does not document how a changed answer is folded back into an already-fixed adaptive path, so we model no scoring consequence beyond replacing the stored response.',
    ],
  },
  capabilities: {
    fullSimulation: {
      available: false,
      reason:
        'The GMAT is question-level computer-adaptive in all three sections, and GMAC publishes no part of the item-selection rule, no IRT item parameters, no content-balancing or exposure constraints and no stopping rule. A fixed-form replay would misrepresent the defining behaviour of the exam. Two further published rules are also unmodellable from public information: how the three Question Review & Edit answer changes are scored against an adaptive path already fixed by the original responses, and whether the exam contains unscored pretest items. Section structure, the three 45-minute clocks, the navigation rule and the single optional 10-minute break ARE verified, which is why the per-section timed blueprints ship as labelled approximations.',
    },
    adaptiveRouting: {
      available: false,
      reason:
        'GMAT adaptivity is question-level — the engine selects each next question from all previous responses — with no modules and no between-module branching. Our routing primitive is a two-stage threshold rule between parts, which cannot express per-question routing, and GMAC publishes no algorithm to approximate. We will not present a difficulty-stepping practice engine as GMAT adaptive routing.',
    },
    scaledScoreEstimate: {
      available: false,
      reason:
        'No published raw-to-scale method exists for the 60-90 section scales or the 205-805 Total Score, and GMAC does not publish the IRT model, item parameters or ability-estimation method that produce them. We report raw accuracy, accuracy by question type, accuracy by domain and pacing instead.',
    },
  },
  unverified: [
    'The adaptive item-selection and routing algorithm. GMAC states only that the program selects the next question based on previous responses; no selection rule, stopping rule, content-balancing or exposure-control constraint is published.',
    'The IRT model, item difficulty/discrimination/guessing parameters and the calibration procedure. Third-party claims of a 3PL model are not official.',
    'The raw-to-scaled conversion for the 60-90 section scales, and the arithmetic that maps three section scores onto the 205-805, 10-point-increment Total Score beyond "weighted equally".',
    'The ability-estimation method and how it converts to a reported score.',
    'How the three permitted Question Review & Edit answer changes are incorporated into scoring, given that the adaptive path was already fixed by the original responses. Whether changing an answer and changing it back counts as one edit or two is also unspecified; we count each stored-response change.',
    'The exact magnitude of the unanswered-question penalty. GMAC says scores decrease significantly per unanswered question but publishes no quantity.',
    'How multi-part Data Insights items are weighted relative to single-part items, beyond the published all-or-nothing credit rule.',
    'Whether the exam includes unscored pretest items, and how many. GMAC publishes no statement either way.',
    'The item pool size, the section blueprint and the per-section content distribution targets.',
    'The enumerated official Content Domain and Fundamental Skills lists used in the Official Score Report. Our taxonomy is derived from the public Exam Content page, not from GMAC\'s score-report taxonomy.',
    'The number of Reading Comprehension passages per section and the number of questions per passage, and the number of questions per Multi-Source Reasoning set. We fix these editorially and disclose it.',
    'The number of Table Analysis statement rows and Graphics Interpretation drop-down blanks per item. Fixed editorially and disclosed.',
    'The exact feature set of the Data Insights on-screen calculator (memory, roots, exponents). Ours is a basic four-function approximation.',
    'Accommodation configurations such as extended-time multipliers and extra or longer breaks. GMAC references pre-approved time-based accommodations but publishes no multipliers, so we ship no accommodation presets.',
    'Whether the candidate\'s section-order choice affects scoring or item selection in any way. We assume no effect and model none.',
  ],
};
