import type {
  ExamConfig,
  NavigationPolicy,
  SelectionConstraint,
} from '@/lib/assessment/types';

/**
 * LSAT, post-August-2024 format (no Analytical Reasoning), 2026-2027 cycle.
 *
 * Every fact below comes from the verified research record at
 * content/exam-specs/_raw/lsat.draft.json (verified 2026-09-18). Anything LSAC
 * does not publish is recorded in `unverified` and the dependent capability is
 * switched off.
 *
 * Analytical Reasoning ("logic games") was sunset after the June 2024
 * administration and replaced by a second Logical Reasoning section. There is
 * deliberately no Analytical Reasoning section and no Analytical Reasoning
 * domain in this configuration.
 */

const CANDIDATE_AGREEMENT =
  'https://www.lsac.org/about/lsac-policies/lsac-candidate-agreement/2026-2027';
const WRITING_SPEC =
  'https://www.lsac.org/lsat/register-lsat/accommodations/specifications-lsat-and-lsat-argumentative-writing';

/**
 * Shared policy for all four multiple-choice sections. LSAC: free movement
 * among that section's questions for its full 35 minutes, flagging and answer
 * elimination available; "During the time allotted for each section of the
 * Test, you may work only on that section," and a section cannot be re-entered
 * once its time has expired.
 *
 * reviewScreen is false because it is NOT verified that the LawHub UI presents
 * an end-of-section review screen before a section locks (see `unverified`);
 * false is the conservative choice.
 */
const MULTIPLE_CHOICE_NAVIGATION: NavigationPolicy = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  allowReturnToPreviousPart: false,
  reviewScreen: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: CANDIDATE_AGREEMENT,
};

const WRITING_NAVIGATION: NavigationPolicy = {
  allowBackWithinPart: true,
  allowForwardSkip: false,
  allowChangeAnswer: true,
  allowFlagForReview: false,
  allowReturnToPreviousPart: false,
  reviewScreen: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: WRITING_SPEC,
};

const NO_CALCULATOR_NOTE =
  'No calculator on any part of the LSAT; no section requires computation. LSAC lists calculators among the electronic devices that must be removed from the testing area. Scratch paper is provided for the multiple-choice portion only.';

/** Selection defaults so every constraint spells out all fields explicitly. */
function selection(overrides: Partial<SelectionConstraint> & { sectionKey: string }): SelectionConstraint {
  return {
    domains: [],
    skills: [],
    responseTypes: [],
    difficultyMix: null,
    allowRepeatsWithinAttempt: false,
    avoidSeenWithinDays: 30,
    ...overrides,
  };
}

export const lsatConfig: ExamConfig = {
  examKey: 'lsat',
  version: '2026.09',
  name: 'Law School Admission Test (LSAT)',
  shortName: 'LSAT',
  publisher: 'Law School Admission Council (LSAC)',
  versionLabel:
    'LSAT, post-August-2024 format (no Analytical Reasoning), 2026-2027 testing cycle',
  admissionsCycle:
    '2026-2027 LSAT testing cycle (August 2026 through June 2027 administrations), feeding fall 2027 JD admission',
  verifiedOn: '2026-09-18',
  audience: ['law'],
  summary:
    'The current LSAT multiple-choice test is four separately timed 35-minute sections: two scored Logical Reasoning sections, one scored Reading Comprehension section, and one unscored variable (pretest) section that may be either question type and may appear at any position. Analytical Reasoning ("logic games") was sunset after the June 2024 administration and replaced by the second Logical Reasoning section. A mandatory 10-minute intermission falls after the second section. Scores are reported on a 120-180 scale; the raw score is simply the number of correct answers across the three scored sections, with no deduction for wrong answers and all items weighted equally. LSAT Argumentative Writing is a separate, unscored, remotely proctored 50-minute session (15 minutes of prewriting analysis plus 35 minutes of writing) that must be completed and approved before a score is released. LSAC does not publish how many questions a section contains, so the item counts in our blueprints are our own practice choices, not the exam’s rules.',

  sources: [
    {
      label: 'Specifications for the LSAT and LSAT Argumentative Writing',
      url: 'https://www.lsac.org/lsat/register-lsat/accommodations/specifications-lsat-and-lsat-argumentative-writing',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'LSAC Candidate Agreement, 2026-2027',
      url: 'https://www.lsac.org/about/lsac-policies/lsac-candidate-agreement/2026-2027',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'LSAT test format',
      url: 'https://www.lsac.org/lsat/taking-lsat/test-format',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'What to expect starting with the August 2024 LSAT',
      url: 'https://www.lsac.org/blog/what-to-expect-starting-with-august-2024-lsat',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Logical Reasoning question type',
      url: 'https://www.lsac.org/lsat/taking-lsat/test-format/logical-reasoning',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Reading Comprehension question type',
      url: 'https://www.lsac.org/lsat/prepare/types-lsat-questions/reading-comprehension',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'About the 10-minute intermission',
      url: 'https://www.lsac.org/lsat/taking-lsat/about-10-minute-intermission',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Full new testing UI for the 2026-27 testing cycle now available',
      url: 'https://www.lsac.org/blog/full-new-testing-ui-2026-27-testing-cycle-now-available',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'LSAT scoring',
      url: 'https://www.lsac.org/lsat/lsat-scoring',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'LSAT score bands',
      url: 'https://www.lsac.org/lsat/lsat-scoring/lsat-score-bands',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Keeping Data (LSAC podcast, May 2025) — equating and raw-to-scale conversion',
      url: 'https://www.lsac.org/podcast/keeping-data-may-2025',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'About LSAT Argumentative Writing',
      url: 'https://www.lsac.org/lsat/about/lsat-argumentative-writing',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Frequently asked questions about LSAT Argumentative Writing',
      url: 'https://www.lsac.org/lsat/frequently-asked-questions-about-lsat/frequently-asked-questions-about-lsat-argumentative',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'LSAT dos and don’ts (test-day materials)',
      url: 'https://www.lsac.org/lsat/taking-lsat/lsat-dos-and-donts',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Registration open for the 2026-2027 LSAT testing cycle, plus an update on the return to in-person testing',
      url: 'https://www.lsac.org/blog/registration-open-2026-2027-lsat-testing-cycle-plus-update-return-person-testing',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'LSAT reliability and validity',
      url: 'https://www.lsac.org/data-research/research/lsat-reliability-validity',
      publisher: 'LSAC',
      verifiedOn: '2026-09-18',
    },
  ],

  sections: [
    {
      key: 'lr1',
      name: 'Logical Reasoning 1 (scored)',
      order: 0,
      officialQuestionCount: null,
      officialTimeMinutes: 35,
      calculator: 'none',
      calculatorNote: NO_CALCULATOR_NOTE,
      navigation: MULTIPLE_CHOICE_NAVIGATION,
      responseTypes: ['single_select'],
      notes: [
        'Each item is a short stimulus (an argument or a set of facts), one question stem and five answer choices, exactly one of which is correct.',
        'LSAC does not publish how many questions a Logical Reasoning section contains, so officialQuestionCount is null.',
        'The 2026-27 LawHub UI shows a question bar listing every question in the section, flagging, answer-choice elimination, highlighting and underlining, and a per-question-set Reset Response control.',
      ],
    },
    {
      key: 'lr2',
      // Same content domains as lr1; questions are tagged there.
      poolSectionKey: 'lr1',
      name: 'Logical Reasoning 2 (scored)',
      order: 1,
      officialQuestionCount: null,
      officialTimeMinutes: 35,
      calculator: 'none',
      calculatorNote: NO_CALCULATOR_NOTE,
      navigation: MULTIPLE_CHOICE_NAVIGATION,
      responseTypes: ['single_select'],
      notes: [
        'This section replaced Analytical Reasoning ("logic games"), which was sunset after the June 2024 administration.',
        'A single mandatory 10-minute intermission is given after the second section; LSAC requires test takers with the standard intermission to take the full 10 minutes.',
        'LSAC does not publish how many questions a Logical Reasoning section contains, so officialQuestionCount is null.',
      ],
    },
    {
      key: 'rc',
      name: 'Reading Comprehension (scored)',
      order: 2,
      officialQuestionCount:
        'four sets, each five to eight questions (implies 20-32 items); the exact count per form is not published',
      officialTimeMinutes: 35,
      calculator: 'none',
      calculatorNote: NO_CALCULATOR_NOTE,
      navigation: MULTIPLE_CHOICE_NAVIGATION,
      responseTypes: ['single_select'],
      notes: [
        'Four reading sets per section. Each set is either a single passage or two related shorter passages (comparative reading); a section has three or four single-passage sets and either one comparative set or none.',
        'The 2026-27 question bar marks which question numbers belong to each passage set; questions in a set stay contiguous.',
      ],
    },
    {
      key: 'variable',
      name: 'Unscored variable (pretest) section',
      order: 3,
      officialQuestionCount: null,
      officialTimeMinutes: 35,
      calculator: 'none',
      calculatorNote: NO_CALCULATOR_NOTE,
      navigation: MULTIPLE_CHOICE_NAVIGATION,
      responseTypes: ['single_select'],
      notes: [
        'LSAC: the unscored section can be either Logical Reasoning or Reading Comprehension and can occur at any point in the test. It is indistinguishable from a scored section to the test taker.',
        'It exists to pretest items for future forms and contributes nothing to the score. It does not route or adapt the test taker.',
        'No blueprint here targets this section on its own: which question type it carries on a given form is not published, so practising it is simply practising Logical Reasoning or Reading Comprehension.',
      ],
    },
    {
      key: 'writing',
      name: 'LSAT Argumentative Writing (separate, unscored)',
      order: 4,
      officialQuestionCount: '1 essay prompt (a debatable issue with three or four perspectives)',
      officialTimeMinutes: 50,
      calculator: 'not_applicable',
      calculatorNote:
        'Not applicable. Physical scratch paper is NOT permitted for LSAT Argumentative Writing (unlike the multiple-choice portion); a digital notetaking area is provided instead.',
      navigation: WRITING_NAVIGATION,
      responseTypes: ['essay'],
      notes: [
        'Not one of the four 35-minute test-day sections. It is a separate, remotely proctored session taken on a different day, available from eight days before the test taker’s LSAT administration.',
        'Two distinct timed phases: 15 minutes of prewriting analysis, then 35 minutes of essay writing.',
        'Unscored. It contributes nothing to the 120-180 score, but an approved writing sample must be on file before a test taker can see or release their LSAT score.',
      ],
    },
  ],

  domains: [
    {
      slug: 'logical-reasoning',
      name: 'Logical Reasoning',
      sectionKey: 'lr1',
      description:
        'Analysing, critically evaluating and completing arguments presented in short passages of ordinary language. Applies equally to both scored Logical Reasoning sections and to a Logical Reasoning variable section.',
      officialShare: null,
      skills: [
        {
          slug: 'lr-argument-parts',
          name: 'Recognizing the parts of an argument and their relationships',
          description: '',
        },
        {
          slug: 'lr-reasoning-patterns',
          name: 'Recognizing similarities and differences between patterns of reasoning',
          description: '',
        },
        {
          slug: 'lr-drawing-conclusions',
          name: 'Drawing well-supported conclusions',
          description: '',
        },
        { slug: 'lr-reasoning-by-analogy', name: 'Reasoning by analogy', description: '' },
        {
          slug: 'lr-points-of-disagreement',
          name: 'Recognizing misunderstandings or points of disagreement',
          description: '',
        },
        {
          slug: 'lr-additional-evidence',
          name: 'Determining how additional evidence affects an argument',
          description: '',
        },
        {
          slug: 'lr-assumptions',
          name: 'Detecting assumptions made by particular arguments',
          description: '',
        },
        {
          slug: 'lr-principles-and-rules',
          name: 'Identifying and applying principles or rules',
          description: '',
        },
        { slug: 'lr-argument-flaws', name: 'Identifying flaws in arguments', description: '' },
        { slug: 'lr-explanations', name: 'Identifying explanations', description: '' },
      ],
      source: 'https://www.lsac.org/lsat/taking-lsat/test-format/logical-reasoning',
    },
    {
      slug: 'reading-comprehension',
      name: 'Reading Comprehension',
      sectionKey: 'rc',
      description:
        'Reading long and complex passages with insight and accuracy, and answering questions about a single reading selection.',
      officialShare: null,
      skills: [
        { slug: 'rc-main-idea', name: 'The main idea or primary purpose', description: '' },
        {
          slug: 'rc-explicit-information',
          name: 'Information that is explicitly stated',
          description: '',
        },
        {
          slug: 'rc-inferences',
          name: 'Information or ideas that can be inferred',
          description: '',
        },
        {
          slug: 'rc-words-in-context',
          name: 'The meaning or purpose of words or phrases as used in context',
          description: '',
        },
        { slug: 'rc-organization', name: 'The organization or structure', description: '' },
        {
          slug: 'rc-application',
          name: 'The application of information in the selection to a new context',
          description: '',
        },
        {
          slug: 'rc-principles',
          name: 'Principles that function in the selection',
          description: '',
        },
        {
          slug: 'rc-analogies',
          name: 'Analogies to claims or arguments in the selection',
          description: '',
        },
        {
          slug: 'rc-authors-attitude',
          name: 'An author’s attitude as revealed in the tone of a passage or the language used',
          description: '',
        },
        {
          slug: 'rc-impact-of-new-information',
          name: 'The impact of new information on claims or arguments in the selection',
          description: '',
        },
      ],
      source: 'https://www.lsac.org/lsat/prepare/types-lsat-questions/reading-comprehension',
    },
    {
      slug: 'comparative-reading',
      name: 'Comparative Reading',
      sectionKey: 'rc',
      description:
        'The Reading Comprehension set built on two related shorter passages. Questions concern the relationship between the two passages. A section contains either one comparative set or none.',
      officialShare: null,
      skills: [
        {
          slug: 'cr-passage-relationships',
          name: 'Relationships between two related shorter passages',
          description: '',
        },
        {
          slug: 'cr-generalization-instance',
          name: 'Generalization / instance relationships between passages',
          description: '',
        },
        {
          slug: 'cr-principle-application',
          name: 'Principle / application relationships between passages',
          description: '',
        },
        {
          slug: 'cr-point-counterpoint',
          name: 'Point / counterpoint relationships between passages',
          description: '',
        },
      ],
      source: 'https://www.lsac.org/lsat/prepare/types-lsat-questions/reading-comprehension',
    },
    {
      slug: 'argumentative-writing',
      name: 'Argumentative Writing',
      sectionKey: 'writing',
      description:
        'The separate, unscored LSAT Argumentative Writing sample: a debatable issue presented with three or four perspectives, on which the candidate takes and supports a position.',
      officialShare: null,
      skills: [
        {
          slug: 'aw-analyze-perspectives',
          name: 'Analyzing a debatable issue presented with three or four perspectives',
          description: '',
        },
        {
          slug: 'aw-take-position',
          name: 'Taking a position within an ongoing conversation',
          description: '',
        },
        {
          slug: 'aw-construct-argument',
          name: 'Constructing and supporting an argument in essay form',
          description: '',
        },
      ],
      source: 'https://www.lsac.org/lsat/about/lsat-argumentative-writing',
    },
  ],

  blueprints: [
    {
      id: 'diagnostic',
      label: 'LSAT diagnostic skill check',
      mode: 'diagnostic',
      description:
        'A short, untimed skill check across every multiple-choice domain of the current LSAT: Logical Reasoning, Reading Comprehension and Comparative Reading. Use it to find where to start, not to predict a score.',
      parts: [
        {
          key: 'diag-logical-reasoning',
          sectionKey: 'lr1',
          label: 'Logical Reasoning',
          timeLimitSeconds: null,
          itemCount: 6,
          selection: selection({
            sectionKey: 'lr1',
            domains: ['logical-reasoning'],
            responseTypes: ['single_select'],
          }),
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diag-reading-comprehension',
          sectionKey: 'rc',
          label: 'Reading Comprehension',
          timeLimitSeconds: null,
          itemCount: 6,
          selection: selection({
            sectionKey: 'rc',
            domains: ['reading-comprehension'],
            responseTypes: ['single_select'],
          }),
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diag-comparative-reading',
          sectionKey: 'rc',
          label: 'Comparative Reading',
          timeLimitSeconds: null,
          itemCount: 3,
          selection: selection({
            sectionKey: 'rc',
            domains: ['comparative-reading'],
            responseTypes: ['single_select'],
          }),
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
      timing: 'untimed',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'not_applicable',
      fidelity: 'practice_only',
      fidelityNote:
        'A short skill check, not a predictor of an LSAT score. It is 15 questions against our own item bank and produces no 120-180 estimate. It is untimed because LSAC publishes a 35-minute limit per section but not the number of questions in a section, so no official per-question pace exists to scale from. The separate, unscored LSAT Argumentative Writing component is deliberately left out of the diagnostic; practise it with the "timed-writing" blueprint.',
    },
    {
      id: 'practice',
      label: 'Custom practice set',
      mode: 'practice',
      description:
        'A template for open practice: ten questions drawn from anywhere in the LSAT multiple-choice test, untimed. Domain, difficulty and length are chosen by the learner at run time, so the stored section key and empty domain list are only permissive defaults.',
      parts: [
        {
          key: 'practice-set',
          sectionKey: 'lr1',
          label: 'Practice set',
          timeLimitSeconds: null,
          itemCount: 10,
          selection: selection({
            sectionKey: 'lr1',
            domains: [],
            responseTypes: ['single_select'],
          }),
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
      timing: 'untimed',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'not_applicable',
      fidelity: 'practice_only',
      fidelityNote:
        'Practice only. This is a configurable drill, not a section of the LSAT: it has no time limit, no fixed length and no section structure. Our items are originally authored against LSAC’s published question-type taxonomy; they are not LSAT questions and their difficulty labels are editorial, not calibrated.',
    },
    {
      id: 'timed-lr1',
      label: 'Timed section: Logical Reasoning 1',
      mode: 'practice',
      description:
        'One 35-minute Logical Reasoning section under the real LSAT navigation rules: free movement among the section’s questions for the full 35 minutes, flagging allowed, no way back once the clock runs out.',
      parts: [
        {
          key: 'timed-lr1-section',
          sectionKey: 'lr1',
          label: 'Logical Reasoning 1',
          timeLimitSeconds: 2100,
          itemCount: 24,
          selection: selection({
            sectionKey: 'lr1',
            domains: ['logical-reasoning'],
            responseTypes: ['single_select'],
          }),
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real exam: the 35-minute limit, the one-stimulus/five-choice item format, free movement and flagging within the section, and the hard lock at time expiry, all enforced server-side. What does not: LSAC does not publish how many questions a Logical Reasoning section contains, so the 24 items here are OUR practice choice, not the exam’s rule (widely circulated figures of 25-26 could not be confirmed on any official LSAC page). Our items are originally authored, there are no pretest items, and difficulty labels are editorial rather than statistically calibrated. It is also unverified whether the real UI shows a time warning or an end-of-section review screen, so we show neither.',
    },
    {
      id: 'timed-lr2',
      label: 'Timed section: Logical Reasoning 2',
      mode: 'practice',
      description:
        'A second 35-minute Logical Reasoning section, the one that replaced Analytical Reasoning from the August 2024 LSAT onward. Same rules and same format as the first Logical Reasoning section.',
      parts: [
        {
          key: 'timed-lr2-section',
          sectionKey: 'lr2',
          label: 'Logical Reasoning 2',
          timeLimitSeconds: 2100,
          itemCount: 24,
          selection: selection({
            sectionKey: 'lr2',
            domains: ['logical-reasoning'],
            responseTypes: ['single_select'],
          }),
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real exam: the 35-minute limit, the item format, free within-section movement and flagging, and the hard lock at expiry, enforced server-side. What does not: the 24-item length is OUR practice choice because LSAC publishes no per-section question count; the real intermission that follows section 2 on test day is not part of this single-section drill; our items are originally authored with editorial difficulty labels and include no pretest items. LSAC publishes no content-blueprint proportions, so the mix of Logical Reasoning question types here is ours.',
    },
    {
      id: 'timed-rc',
      label: 'Timed section: Reading Comprehension',
      mode: 'practice',
      description:
        'One 35-minute Reading Comprehension section built as four passage sets, including up to one comparative reading set of two related shorter passages, under the real LSAT navigation rules.',
      parts: [
        {
          key: 'timed-rc-section',
          sectionKey: 'rc',
          label: 'Reading Comprehension',
          timeLimitSeconds: 2100,
          itemCount: 27,
          selection: selection({
            sectionKey: 'rc',
            domains: ['reading-comprehension', 'comparative-reading'],
            responseTypes: ['single_select'],
          }),
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real exam: the 35-minute limit, four passage sets of five to eight questions each with at most one comparative reading set, contiguous question grouping per passage, free within-section movement and flagging, and the hard lock at expiry, enforced server-side. What does not: LSAC publishes the range (four sets of five to eight questions, so 20-32 items) but not the exact count for any form, so the 27 items here sit inside the published range but remain OUR choice. Our passages and questions are originally authored, contain no pretest items, and carry editorial rather than calibrated difficulty.',
    },
    {
      id: 'timed-writing',
      label: 'Timed: LSAT Argumentative Writing',
      mode: 'practice',
      description:
        'A 35-minute argumentative essay against a debatable issue with three or four perspectives, mirroring the writing phase of LSAT Argumentative Writing. Never scored — the essay is returned for self-assessment against a rubric.',
      parts: [
        {
          key: 'timed-writing-essay',
          sectionKey: 'writing',
          label: 'Argumentative essay',
          timeLimitSeconds: 2100,
          itemCount: 1,
          selection: selection({
            sectionKey: 'writing',
            domains: ['argumentative-writing'],
            responseTypes: ['essay'],
          }),
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real component: the 35-minute writing clock, the prompt shape (a debatable issue with three or four perspectives), the fact that nothing here is scored, and the absence of scratch-paper affordances, which LSAC also prohibits for this component. What does not: the real session is 50 minutes in two phases — 15 minutes of prewriting analysis before the 35 minutes of writing — and we run only the writing phase as a single timed part. The real component is delivered on a separate day under remote proctoring and gates score release; ours does not. Our prompts are originally authored.',
    },
  ],

  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: 0,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'LSAT scaled score',
      min: 120,
      max: 180,
      increment: 1,
      note: 'LSAC reports the LSAT on a 120-180 scale in whole-point increments, 120 lowest and 180 highest, accompanied by a score band derived from the standard error of measurement and a percentile rank covering the previous three testing years. This is recorded as a fact about the exam. We do not produce a score on this scale.',
    },
    scaledEstimate: {
      enabled: false,
      reason:
        'LSAC converts the raw score to the 120-180 scale with a form-specific conversion produced by equating after the administration, and does not publish a raw-to-scale table for any live form (for undisclosed forms, never). LSAC’s own example shows the cutoff moving between forms: 56 correct for a 160 on a slightly harder form, 57 on a slightly easier one. With no published raw-to-scale method — and no published count of scored items, so no known maximum raw score — any 120-180 number we produced would be invented.',
    },
    notes: [
      'Raw score is the number of questions answered correctly across the three scored sections. LSAC: "There is no deduction for incorrect answers."',
      'An omitted answer scores identically to a wrong answer, so guessing is never disadvantageous. Never leave a question blank.',
      'All test questions are weighted exactly the same, regardless of type or difficulty.',
      'The unscored variable section contributes nothing to the score, and LSAC does not disclose which administered section it was.',
      'LSAT Argumentative Writing carries no score, but an approved sample must be on file before a test taker can see or release their LSAT score.',
      'We display no score band, no standard-error figure and no percentile: LSAC’s current score-bands page states no fixed band width, and percentile tables are published on a three-year lag.',
    ],
  },

  capabilities: {
    fullSimulation: {
      available: false,
      reason:
        'The timing and navigation are fully verified (four separately timed 35-minute sections, a mandatory 10-minute intermission after section 2, no movement between sections), but the section structure is not: LSAC does not publish how many questions a Logical Reasoning section contains, the total number of scored questions, or which of the four administered sections is the unscored variable section on a given form. It is also unverified whether a section ends with a review screen or a time warning. A full-length run would have to invent the item counts and the end-of-section behaviour, so no "simulation-full" blueprint is shipped.',
    },
    adaptiveRouting: {
      available: false,
      reason:
        'The LSAT is not adaptive at any level. It is a fixed linear form: all four sections are pre-assembled, every test taker on a form sees the same items in the same order, and there is no module routing, item-level branching or difficulty adjustment. The unscored variable section pretests items for future forms; it does not route the test taker. Offering adaptive routing here would misrepresent the exam.',
    },
    scaledScoreEstimate: {
      available: false,
      reason:
        'No published raw-to-scale method exists. LSAC equates each form after administration, does not publish the conversion, and does not publish the number of scored items, so neither the mapping nor the maximum raw score is known. We report raw performance by domain instead of a 120-180 estimate.',
    },
  },

  unverified: [
    'The number of questions in each Logical Reasoning section. LSAC publishes no figure; the 24 items per Logical Reasoning blueprint part are our practice choice, not the exam’s rule. Widely circulated figures of 25-26 could not be confirmed on an official LSAC page.',
    'The total number of questions on a post-August-2024 form and the number of scored items, and therefore the maximum raw score.',
    'The exact number of Reading Comprehension questions on a form. LSAC publishes only that the section has four sets of five to eight questions each (20-32 items); our 27-item Reading Comprehension blueprint sits inside that range but the count is ours.',
    'The content-blueprint proportions: how many of each Logical Reasoning question type, or each Reading Comprehension question type, appear in a section.',
    'Whether the testing UI shows a time warning (for example a five-minute warning) before a section ends, and in what form.',
    'Whether an end-of-section review screen is presented before a section locks, or whether sections simply auto-advance at time expiry. Our section navigation policies set reviewScreen to false as the conservative option.',
    'Whether the on-screen timer can be hidden or collapsed by the test taker.',
    'Whether unanswered questions are visually distinguished in the 2026-27 question bar.',
    'Whether the unscored variable section’s position is randomised per test taker or fixed per form, and which section it was on any given form.',
    'The raw-to-scaled conversion for any form, the per-form standard error of measurement, and the resulting score-band width. Do not display a fixed band such as "+/- 3 points"; LSAC’s current page states no number.',
    'Percentile conversion tables for the 2026-27 testing year: LSAC publishes three-year percentile tables on a lag.',
    'Accommodated timing multipliers (for example 50% or 100% extra time) and accommodated break structures. LSAC documents the request process, not a published table of multipliers.',
    'The verbatim LSAC wording prohibiting calculators. The dos-and-don’ts page lists calculators among devices that must be removed from the testing area, but no exact sentence was captured. The substantive fact — no calculator on the LSAT — is not in doubt, since no section requires computation.',
    'The delivery modality wording for 2026-27 is inconsistent across LSAC pages: the LSAT FAQ still describes a free choice between remote proctoring and a test centre, while LSAC’s announcements require in-person testing from the August 2026 LSAT with limited documented exceptions. Treat in-centre as the default and re-verify the FAQ each cycle.',
  ],
};
