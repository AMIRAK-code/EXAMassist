import type { ExamConfig, NavigationPolicy } from '@/lib/assessment/types';

/**
 * Online Bocconi test — INTERNATIONAL GRADUATE APPLICANTS variant (Master of
 * Science and MA programmes).
 *
 * Every fact below comes from the verified research record at
 * content/exam-specs/_raw/bocconi-admissions-requirements.draft.json
 * (claim `msc-graduate-bocconi-test` and its neighbours, verification date
 * 2026-09-18). That record verified, from the graduate test's own page:
 *
 *  - 50 multiple-choice questions in three areas: Verbal reasoning 24,
 *    Data insight 16, Quantitative reasoning 10;
 *  - 75 minutes;
 *  - "Right answer: 1 point", "Missing answer: 0 points",
 *    "Wrong answer: -0.25/-0.33 points";
 *  - "lower than 15 out of 50 will not be considered in the selection process";
 *  - at most three attempts per academic year.
 *
 * What it did NOT verify for this variant is deliberately not copied from the
 * bachelor test (src/lib/exams/configs/bocconi-undergraduate.ts), whose
 * navigation, calculator and delivery rules come from a rules-of-conduct PDF
 * written for the bachelor and law programmes:
 *
 *  - the navigation rule (the bachelor test's three-per-screen forward-only
 *    paging is NOT assumed here);
 *  - the number of answer options per item, and which items carry -0.33;
 *  - per-area timing or interleaving;
 *  - the calculator policy.
 *
 * Each is listed in `unverified` and every dependent feature is off: no
 * full-length simulation, no forward-only lock, no calculator claim, and the
 * engine scores every wrong answer at -0.25.
 */

const OFFICIAL_TEST_PAGE =
  'https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/online-bocconi-test-international-graduate-applicants';
const MSC_ADMISSIONS_OVERVIEW =
  'https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions';
const MSC_ADMISSIONS_PAGE =
  'https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/admissions';
const MSC_GMAT_GRE_PAGE =
  'https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/gmat-and-gre-test';

const SECTION_KEY = 'online-test';
const TOTAL_TIME_SECONDS = 75 * 60;

/**
 * NOT the exam's rule: Bocconi's graduate test page, as recorded, states no
 * navigation rule. Rather than borrow the bachelor test's forward-only paging
 * and present it as fact, practice here moves freely, and `source` says the
 * rule is unverified so the format guide labels it as our assumption.
 */
const unverifiedFreeNavigation: NavigationPolicy = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  allowReturnToPreviousPart: false,
  reviewScreen: true,
  reviewScreenEditable: true,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: 'unverified',
};

const DOMAINS = {
  verbal: 'bocconi-grad-verbal-reasoning',
  data: 'bocconi-grad-data-insight',
  quant: 'bocconi-grad-quantitative-reasoning',
} as const;

export const bocconiGraduateConfig: ExamConfig = {
  examKey: 'bocconi-graduate',
  version: '2026.10',
  name: 'Online Bocconi Test (international graduate applicants)',
  shortName: 'Bocconi Graduate Test',
  publisher: 'Bocconi University',
  versionLabel:
    'Online Bocconi test - International Graduate applicants, as published for the AY 2027-28 Master of Science and MA admissions cycle. Structure, timing, scoring, the eligibility floor and the attempt limit are verified on the official graduate test page; navigation, calculator and answer-option rules for this variant are not published there and are not assumed.',
  admissionsCycle:
    'AY 2027-28 MSc and MA admissions (four rounds for international candidates: Round I 1-29 October 2026, Round II 30 October 2026 - 26 January 2027, Round III 27 January - 11 March 2027, Round IV 12 March - 29 April 2027)',
  verifiedOn: '2026-09-18',
  audience: ['graduate'],
  summary:
    "Bocconi University's own online admission test for international applicants to its Master of Science and MA programmes, accepted as an alternative to the GMAT or GRE. It is a different test from the bachelor and law forms: 50 multiple-choice questions in three areas (Verbal reasoning 24, Data insight 16, Quantitative reasoning 10) in 75 minutes. A correct answer scores +1, a blank 0 and a wrong answer -0.25 (-0.33 on some items Bocconi does not identify), so omitting beats blind guessing. Applicants scoring lower than 15 out of 50 are not considered; Bocconi publishes no admission cut-off, and the test result is one of three compulsory elements of an MSc application, alongside undergraduate GPA and transcripts and the evaluation of the dossier and motivation. At most three attempts are allowed per academic year.",

  sources: [
    {
      label:
        'Online Bocconi test - International Graduate applicants — official test page (areas, question counts, timing, scoring, eligibility floor, attempts)',
      url: OFFICIAL_TEST_PAGE,
      publisher: 'Bocconi University',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Master of Science and MA programs — application and admissions (accepted tests: GMAT, GRE, Online Bocconi test)',
      url: MSC_ADMISSIONS_OVERVIEW,
      publisher: 'Bocconi University',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Master of Science and MA programs — admissions (three compulsory elements, selection rounds)',
      url: MSC_ADMISSIONS_PAGE,
      publisher: 'Bocconi University',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'GMAT and GRE test — accepted editions, minimums and five-year validity',
      url: MSC_GMAT_GRE_PAGE,
      publisher: 'Bocconi University',
      verifiedOn: '2026-09-18',
    },
  ],

  sections: [
    {
      key: SECTION_KEY,
      name: 'Online Bocconi test (graduate) — 75 minutes',
      order: 0,
      officialQuestionCount: '50 (Verbal reasoning 24, Data insight 16, Quantitative reasoning 10)',
      officialTimeMinutes: 75,
      calculator: 'unverified',
      calculatorNote:
        'Not published for this variant on the pages verified. The bachelor and law test forbids calculators, but that rule comes from a rules-of-conduct document written for the bachelor and law programmes, so it is not carried across. Our questions are written to be worked by hand.',
      navigation: unverifiedFreeNavigation,
      responseTypes: ['single_select'],
      notes: [
        'Bocconi publishes the three areas and their question counts, and a 75-minute duration for the whole test. It publishes no time per area, so none is invented here.',
        'NOT VERIFIED — navigation. The graduate test page does not state whether questions are shown one at a time or in screens, or whether a candidate can go back. The bachelor and law test is forward-only in screens of three, but that rule is not assumed for this test. Our practice lets you move freely; that is our choice, not the exam’s rule.',
        'NOT VERIFIED — order of areas. Whether the three areas are delivered as blocks or interleaved is not published. Our timed practice draws from all three areas without reproducing any order.',
        'Bocconi allows at most three attempts at this test per academic year (four for the bachelor and law tests).',
      ],
    },
  ],

  domains: [
    {
      slug: DOMAINS.verbal,
      name: 'Verbal reasoning',
      sectionKey: SECTION_KEY,
      description:
        'The largest area: 24 of the 50 questions. Bocconi publishes the area name and its question count only. The two skills below are our own descriptive grouping for tagging practice questions, not an official Bocconi syllabus.',
      officialShare: '24 of 50 questions',
      skills: [
        {
          slug: 'grad-verbal-passage-reasoning',
          name: 'Reasoning from a passage',
          description:
            'Our grouping, not an official Bocconi sub-skill: understanding what a passage states, implies and is arguing for.',
        },
        {
          slug: 'grad-verbal-argument-analysis',
          name: 'Analysing an argument',
          description:
            'Our grouping, not an official Bocconi sub-skill: finding the assumption, weakness or strengthening point in a short argument.',
        },
      ],
      source: OFFICIAL_TEST_PAGE,
    },
    {
      slug: DOMAINS.data,
      name: 'Data insight',
      sectionKey: SECTION_KEY,
      description:
        '16 of the 50 questions. Bocconi publishes the area name and its question count only. The two skills below are our own descriptive grouping for tagging practice questions built on tables and charts, not an official Bocconi syllabus.',
      officialShare: '16 of 50 questions',
      skills: [
        {
          slug: 'grad-data-reading-displays',
          name: 'Reading tables and charts',
          description:
            'Our grouping, not an official Bocconi sub-skill: locating and comparing the figures a table or chart shows.',
        },
        {
          slug: 'grad-data-derived-conclusions',
          name: 'Conclusions and derived figures',
          description:
            'Our grouping, not an official Bocconi sub-skill: computing shares, rates and changes from data, and judging what the data does and does not support.',
        },
      ],
      source: OFFICIAL_TEST_PAGE,
    },
    {
      slug: DOMAINS.quant,
      name: 'Quantitative reasoning',
      sectionKey: SECTION_KEY,
      description:
        '10 of the 50 questions. Bocconi publishes the area name and its question count only. The two skills below are our own descriptive grouping for tagging practice questions, not an official Bocconi syllabus.',
      officialShare: '10 of 50 questions',
      skills: [
        {
          slug: 'grad-quant-numbers-percentages',
          name: 'Numbers, ratios and percentages',
          description:
            'Our grouping, not an official Bocconi sub-skill: arithmetic, ratios, percentage change and averages in worded problems.',
        },
        {
          slug: 'grad-quant-algebra-problem-solving',
          name: 'Algebra and problem solving',
          description:
            'Our grouping, not an official Bocconi sub-skill: setting up and solving equations, and counting and probability in worded problems.',
        },
      ],
      source: OFFICIAL_TEST_PAGE,
    },
  ],

  blueprints: [
    {
      id: 'diagnostic',
      label: 'Bocconi graduate diagnostic skill check',
      mode: 'diagnostic',
      description:
        'A short 12-item check across the three areas of the graduate test, timed generously so the result reflects what you know rather than how fast you work.',
      parts: [
        {
          key: 'diagnostic-verbal',
          sectionKey: SECTION_KEY,
          label: 'Verbal reasoning',
          timeLimitSeconds: 675,
          itemCount: 5,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [DOMAINS.verbal],
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
        {
          key: 'diagnostic-data-insight',
          sectionKey: SECTION_KEY,
          label: 'Data insight',
          timeLimitSeconds: 540,
          itemCount: 4,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [DOMAINS.data],
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
        {
          key: 'diagnostic-quantitative',
          sectionKey: SECTION_KEY,
          label: 'Quantitative reasoning',
          timeLimitSeconds: 405,
          itemCount: 3,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [DOMAINS.quant],
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
      pauseBehaviour: 'clock_pauses',
      fidelity: 'practice_only',
      fidelityNote:
        'A short skill check, not a predictor of a Bocconi test score. It groups the three areas into separate timed parts at about 135 seconds per item, roughly 1.5x the real average pace of 90 seconds (75 minutes for 50 questions). Use it to find weak areas, nothing more.',
    },
    {
      id: 'practice',
      label: 'Bocconi graduate practice set',
      mode: 'practice',
      description:
        'An untimed 10-item set drawn from any of the three areas. This is a template: choose the area, difficulty and length you want before you start.',
      parts: [
        {
          key: 'practice-mixed',
          sectionKey: SECTION_KEY,
          label: 'Mixed practice',
          timeLimitSeconds: null,
          itemCount: 10,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [],
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
      timing: 'untimed',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'not_applicable',
      fidelity: 'practice_only',
      fidelityNote:
        'A study tool, not a reproduction of the exam. It is untimed and the defaults here are overridden by whatever you pick at runtime. The real graduate test is 50 questions in 75 minutes with a penalty for wrong answers.',
    },
    {
      id: 'timed-online-test',
      label: 'Full-length timed Bocconi graduate block (50 items, 75 minutes)',
      mode: 'practice',
      description:
        "The published size and time of the graduate Online Bocconi test: 50 questions under one 75-minute clock that keeps running, scored with Bocconi's -0.25 penalty for a wrong answer.",
      parts: [
        {
          key: 'timed-online-test-block',
          sectionKey: SECTION_KEY,
          label: 'Online Bocconi test (graduate) — 50 questions, 75 minutes',
          timeLimitSeconds: TOTAL_TIME_SECONDS,
          itemCount: 50,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [DOMAINS.verbal, DOMAINS.data, DOMAINS.quant],
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
      overallTimeLimitSeconds: TOTAL_TIME_SECONDS,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the published test: 50 questions, one 75-minute clock that keeps running, and +1 / 0 / -0.25 scoring reported as a penalised total out of 50, with the 15-point eligibility floor shown as a floor, not a target. What is our assumption, because Bocconi does not publish it for this test: you can move back and change answers freely (the navigation rule is not published); every wrong answer costs -0.25 (Bocconi says some items cost -0.33 but not which); the number of options per question is our editorial choice; the 24 / 16 / 10 area mix is not guaranteed, because the block draws from the whole pool; and no calculator is offered, which matches how our questions are written rather than a verified rule. Our questions are original and their difficulty labels are editorial, not calibrated.',
    },
  ],

  choiceOptions: {
    count: 4,
    basis: 'editorial',
    note: 'Bocconi publishes no option count for the graduate test; four is our choice, and some earlier items have five.',
  },
  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: -0.25,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'Online Bocconi test (graduate) total score (penalties included), out of 50',
      min: -12.5,
      max: 50,
      increment: 0.01,
      note: 'The total is out of 50: Bocconi states its floor as "15 out of 50". 50 is the maximum (50 correct at +1). The lower bound shown here is our arithmetic for 50 wrong answers at -0.25, not a figure Bocconi publishes; items carrying -0.33 would push it lower, and whether a negative total is reported is not published. The 0.01 increment reflects the two-decimal granularity the -0.33 penalty implies.',
    },
    scaledEstimate: {
      enabled: false,
      reason:
        'There is no scale to estimate: the graduate Online Bocconi test is reported as a penalised total out of 50, and Bocconi publishes no conversion, percentile table or equating between attempts. When an applicant submits more than one accepted test, Bocconi says the system considers the most competitive one, but it does not publish how a Bocconi total is compared with a GMAT or GRE score. With no published method there is nothing defensible to estimate.',
    },
    notes: [
      'Official scoring for this variant: "Right answer: 1 point", "Missing answer: 0 points", "Wrong answer: -0.25/-0.33 points".',
      'The -0.33 penalty: Bocconi gives the wrong-answer penalty as "-0.25/-0.33" without saying which items carry -0.33. We do not guess. Our engine scores every wrong answer at -0.25, so a real form could score slightly lower than ours for the same answers.',
      'ELIGIBILITY FLOOR, NOT A TARGET: an applicant with a total "lower than 15 out of 50 will not be considered in the selection process". This is an exclusion threshold, not a pass mark and not an admission predictor.',
      'Omitted answers cost nothing and wrong answers cost 0.25 (or 0.33), so leaving a question blank can beat a blind guess. Bocconi does not publish how many options each question has, so no exact break-even rule is stated here.',
      'The test result is one of three compulsory elements of an MSc application, with undergraduate GPA and transcripts and the evaluation of the dossier and motivation: "Applications will not be evaluated if any of these three elements are missing." Bocconi publishes no admission cut-off and no average admitted score.',
      'Alternatives Bocconi accepts for the same programmes: the GMAT (GMAT Exam minimum 500 out of 800; GMAT Focus Edition minimum 485 out of 805) and the GRE General Test or Shorter GRE (the GRE General Test at Home is not accepted). Scores are accepted if no more than five years old. Bocconi’s GRE threshold is not shown here because it could not be verified.',
      'At most three attempts per academic year.',
    ],
  },

  capabilities: {
    fullSimulation: {
      available: false,
      reason:
        'Bocconi publishes the graduate test’s size, areas, time and scoring, but not its navigation rule, the number of options per question, which items carry the -0.33 penalty, the order in which the areas appear, or its calculator policy. A simulation would have to invent each of those. The bachelor test publishes them for itself, but its rules are written for the bachelor and law programmes and we do not carry them across. A timed 50-question block with the published clock and scoring is offered instead, labelled as an approximation.',
    },
    adaptiveRouting: {
      available: false,
      reason:
        'Bocconi describes a fixed 50-question test with fixed area counts and makes no claim of adaptive delivery, routing or ability estimation for any Online Bocconi test variant. There is no adaptive behaviour to approximate.',
    },
    scaledScoreEstimate: {
      available: false,
      reason:
        'No scaled score exists for this test. Bocconi reports a penalised total out of 50 and publishes no conversion, no percentiles and no equating with GMAT or GRE scores.',
    },
  },

  unverified: [
    'Navigation. Whether questions appear one at a time or in screens, and whether a candidate can go back or change answers, is not published for this test. ASSUMPTION in our practice: free movement and answer changes, labelled as ours. The bachelor and law test’s forward-only screens of three are not assumed.',
    'Number of answer options per question. Not published; our option counts are an editorial choice.',
    'Which items carry the -0.33 penalty instead of -0.25. Bocconi gives "-0.25/-0.33" without naming the items. ASSUMPTION in our scoring: every wrong answer costs -0.25.',
    'Time per area, and whether the three areas are delivered as blocks or interleaved. Only the 75-minute total is published; we set no per-area time in timed practice.',
    'Calculator policy. Not published for this variant on the pages verified. Our questions are written to be solved by hand and no calculator is offered.',
    'Delivery and conduct rules (proctoring, permitted materials, breaks, auto-submission, accommodations). The documented rules are those of the bachelor and law test.',
    'The score report: whether it gives per-area subscores and counts of correct, omitted and wrong answers, as the bachelor test’s does.',
    'The theoretical minimum score, and whether a negative total is reported.',
    'Whether forms are equated across the three permitted attempts, and whether any items are unscored pretest questions. Every item in our practice is scored.',
    'How Bocconi compares a graduate Online Bocconi test total with GMAT or GRE scores when it "considers the most competitive one".',
  ],
};
