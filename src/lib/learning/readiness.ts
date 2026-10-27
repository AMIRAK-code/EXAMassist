import type { ExamConfig } from '@/lib/assessment/types';
import type { SkillPerformance } from './recommend';
import { msg, type LearnerText, type Msg } from './text';

/**
 * Readiness assessment against a learner's own target score.
 *
 * The honest problem: a learner wants to know "am I on track for 1400?", and no
 * test maker publishes the raw-to-scale conversion that would answer it. We
 * refuse to invent one. So this module does three separate things and keeps
 * them visibly separate:
 *
 *  1. Measures what IS measurable from the learner's own answers — accuracy
 *     weighted by the exam's published domain mix, pace against the exam's own
 *     published pace, coverage of its domains, and how much evidence there is.
 *  2. States a readiness BAND defined in terms of those measurements, never in
 *     terms of a predicted score.
 *  3. Where — and only where — the exam publishes its complete raw scoring
 *     rules, converts the target into what it would actually require, and
 *     projects the learner's raw score. Today that is the Online Bocconi test,
 *     whose penalty (-0.2 for the bachelor and law forms, -0.25 for the
 *     graduate form) and 50-item blueprint are both published.
 *
 * Everything else reports the target back as the learner's own stated goal and
 * says plainly why we cannot map our measurements onto it.
 *
 * Every sentence is a message in the `learning` catalogue (see text.ts), so it
 * reads the same in every language; data quoted from an exam config (its
 * caveats, thresholds, scale name) stays as published.
 */

export type Band = 'insufficient' | 'early' | 'developing' | 'consistent' | 'strong';

/** A band's name: "Not enough evidence yet", "Early", ... "Strong". */
export const bandLabel = (band: Band): Msg => msg(`readiness.band.${band}`);

/** Below this many scored answers, any percentage is noise. */
export const MIN_ANSWERS_FOR_SIGNAL = 25;
/** Below this, treat the picture as indicative rather than usable. */
export const ANSWERS_FOR_USABLE_SIGNAL = 80;

export interface ReadinessSignal {
  key: 'accuracy' | 'pace' | 'coverage' | 'volume' | 'consistency';
  label: LearnerText;
  /** Human-readable measured value, e.g. "68%" or "1.4x exam pace". */
  display: LearnerText;
  band: Band;
  /** What was actually measured, in a sentence or two. */
  basis: LearnerText;
}

export interface DomainGap {
  domainSlug: string;
  label: string;
  accuracy: number;
  answered: number;
  /** Published share of the exam, when the test maker publishes one. */
  officialShare: string | null;
  hasSignal: boolean;
}

export interface TargetAnalysis {
  /** What the learner said they are aiming for. */
  statedTarget: LearnerText;
  /** True only when the exam publishes enough to reason about the target. */
  quantifiable: boolean;
  /** Present only when quantifiable. */
  projection: {
    projectedRaw: number;
    maxRaw: number;
    targetRaw: number;
    meetsTarget: boolean;
    /** An officially published minimum, where one exists. */
    officialFloor: number | null;
    meetsOfficialFloor: boolean | null;
    method: LearnerText;
    assumptions: LearnerText[];
    /** "Projected raw score", or the reported scale's own name where raw is converted. */
    scoreLabel?: LearnerText;
    /** Every threshold the exam's owner publishes, on the reported scale. */
    thresholds?: Array<{ label: string; value: number; meaning: string; met: boolean }>;
    /** Why there is no single published threshold, where there is none. */
    noThresholdReason?: string | null;
  } | null;
  /** Always present: why we can or cannot speak to the target. */
  explanation: LearnerText;
}

export interface ReadinessAssessment {
  examKey: string;
  examName: string;
  evidenceStrength: 'insufficient' | 'indicative' | 'usable';
  answeredTotal: number;
  overall: Band;
  overallStatement: LearnerText;
  signals: ReadinessSignal[];
  gaps: DomainGap[];
  target: TargetAnalysis | null;
  limitations: LearnerText[];
  /** Median time against the exam's pace, only when it was measured reliably. */
  paceRatio: number | null;
}

// ---------------------------------------------------------------------------
// Helpers over the verified configuration
// ---------------------------------------------------------------------------

/** Pulls the leading integer out of a published count like "27 administered (25 operational)". */
export function leadingCount(value: string | null): number | null {
  if (!value) return null;
  const match = /(\d+)/.exec(value);
  return match ? Number(match[1]) : null;
}

/**
 * The exam's own published pace, in seconds per question. Returns null when the
 * test maker does not publish enough to compute it (the LSAT, for instance,
 * publishes section times but not item counts).
 */
export function examPaceSeconds(config: ExamConfig): number | null {
  let questions = 0;
  let minutes = 0;

  for (const section of config.sections) {
    // Essay sections distort a per-question pace; leave them out entirely.
    const isEssay = section.responseTypes.includes('essay');
    const count = leadingCount(section.officialQuestionCount);
    if (isEssay || count === 1) continue;

    // If ANY scored section does not publish a count or a time, we cannot state
    // a pace for this exam. Averaging over only the sections that happen to
    // publish would produce a confident-looking number that describes part of a
    // different exam. The LSAT is exactly this case.
    if (count === null || section.officialTimeMinutes === null) return null;

    questions += count;
    minutes += section.officialTimeMinutes;
  }

  if (questions === 0 || minutes === 0) return null;
  return Math.round((minutes * 60) / questions);
}

/** Published share of the exam per domain, normalised to weights summing to 1. */
function domainWeights(config: ExamConfig): Map<string, number> {
  const parsed = new Map<string, number>();
  for (const domain of config.domains) {
    const share = leadingCount(domain.officialShare);
    if (share !== null && share > 0) parsed.set(domain.slug, share);
  }
  const total = [...parsed.values()].reduce((sum, value) => sum + value, 0);
  if (parsed.size === 0 || total === 0) return new Map();
  const weights = new Map<string, number>();
  for (const [slug, share] of parsed) weights.set(slug, share / total);
  return weights;
}

function bandForAccuracy(accuracy: number): Band {
  if (accuracy >= 0.8) return 'strong';
  if (accuracy >= 0.65) return 'consistent';
  if (accuracy >= 0.5) return 'developing';
  return 'early';
}

const BAND_ORDER: Band[] = ['insufficient', 'early', 'developing', 'consistent', 'strong'];
const lowerOf = (a: Band, b: Band) =>
  BAND_ORDER[Math.min(BAND_ORDER.indexOf(a), BAND_ORDER.indexOf(b))];

// ---------------------------------------------------------------------------
// Target analysis
// ---------------------------------------------------------------------------

/**
 * Bocconi publishes its scoring in full: 50 items, +1 for a correct answer, 0
 * for a blank and a fixed penalty for a wrong one (-0.2, or -0.25 on the
 * graduate form), with an official eligibility floor (17, or 15 on the
 * graduate form). So a target there can be reasoned about with arithmetic
 * rather than guesswork.
 */
function bocconiProjection(
  config: ExamConfig,
  targetRaw: number,
  /** Accuracy on questions the learner actually ATTEMPTED, not over all shown. */
  accuracyOnAttempted: number,
  omissionRate: number,
): TargetAnalysis['projection'] {
  const items = config.sections.reduce(
    (total, section) => total + (leadingCount(section.officialQuestionCount) ?? 0),
    0,
  );
  const maxRaw = items * config.scoring.pointsCorrect;

  const attempted = items * (1 - omissionRate);
  const correct = attempted * accuracyOnAttempted;
  const wrong = attempted - correct;
  const omitted = items - attempted;

  const projectedRaw =
    correct * config.scoring.pointsCorrect +
    wrong * config.scoring.pointsIncorrect +
    omitted * config.scoring.pointsOmitted;

  // The published eligibility floor, if the config records one in its notes:
  // 17 for the bachelor and law forms, "lower than 15 out of 50" for the
  // graduate form.
  const floorNote = config.scoring.notes.find((note) => /lower than (\d+)/i.test(note));
  const floorMatch = floorNote ? /lower than (\d+)/i.exec(floorNote) : null;
  const officialFloor = floorMatch ? Number(floorMatch[1]) : null;

  // Test-day conditions, from what this config verifies. The graduate form
  // publishes neither a calculator rule nor a navigation rule, so neither is
  // assumed for it.
  const sections = config.sections;
  const minutes = sections.reduce((total, section) => total + (section.officialTimeMinutes ?? 0), 0);
  const conditions = [
    sections.every((section) => section.calculator === 'none') ? msg('readiness.projection.condition.noCalculator') : null,
    minutes > 0 ? msg('readiness.projection.condition.minutes', { minutes }) : null,
    sections.every((section) => !section.navigation.allowBackWithinPart && section.navigation.source !== 'unverified')
      ? msg('readiness.projection.condition.noGoingBack')
      : null,
  ].filter((condition): condition is Msg => condition !== null);

  return {
    projectedRaw: Math.round(projectedRaw * 10) / 10,
    maxRaw,
    targetRaw,
    meetsTarget: projectedRaw >= targetRaw,
    officialFloor,
    meetsOfficialFloor: officialFloor === null ? null : projectedRaw >= officialFloor,
    method: msg('readiness.projection.methodBocconi', {
      ...ruleValues(config, accuracyOnAttempted, omissionRate),
      items,
    }),
    assumptions: [
      msg('readiness.projection.assumeDifficulty'),
      msg('readiness.projection.assumeConditions', { conditions }),
      msg('readiness.projection.assumeBocconiPenalty', { wrong: config.scoring.pointsIncorrect }),
      msg('readiness.projection.assumeArithmetic'),
    ],
  };
}

/**
 * Any exam whose config declares its published raw scoring
 * (`scoring.rawProjection`): a fixed form, a published penalty and a published
 * conversion to the reported scale. The target and every threshold are on the
 * reported scale, because that is the number candidates are told.
 */
function publishedProjection(
  config: ExamConfig,
  targetReported: number,
  accuracyOnAttempted: number,
  omissionRate: number,
): TargetAnalysis['projection'] {
  const rule = config.scoring.rawProjection!;
  const items = rule.scoredItems;
  const attempted = items * (1 - omissionRate);
  const correct = attempted * accuracyOnAttempted;
  const wrong = attempted - correct;
  const omitted = items - attempted;
  const raw =
    correct * config.scoring.pointsCorrect +
    wrong * config.scoring.pointsIncorrect +
    omitted * config.scoring.pointsOmitted;

  const round = (n: number) => Math.round(n * 10) / 10;
  const projected = round(raw * rule.reportFactor);
  const max = round(items * config.scoring.pointsCorrect * rule.reportFactor);
  const converted = rule.reportFactor !== 1;
  const scale = config.scoring.officialScale;

  return {
    projectedRaw: projected,
    maxRaw: max,
    targetRaw: targetReported,
    meetsTarget: projected >= targetReported,
    officialFloor: null,
    meetsOfficialFloor: null,
    scoreLabel: converted && scale
      ? msg('readiness.projection.scoreLabelScale', { scale: scale.label })
      : msg('readiness.projection.scoreLabelRaw'),
    thresholds: rule.thresholds.map((threshold) => ({
      label: threshold.label,
      value: threshold.value,
      meaning: threshold.meaning,
      met: projected >= threshold.value,
    })),
    noThresholdReason: rule.noThresholdReason,
    method:
      converted && scale
        ? msg('readiness.projection.methodConverted', {
            ...ruleValues(config, accuracyOnAttempted, omissionRate),
            items,
            publisher: config.publisher,
            scale: scale.label,
          })
        : msg('readiness.projection.methodPublished', {
            ...ruleValues(config, accuracyOnAttempted, omissionRate),
            items,
            publisher: config.publisher,
          }),
    assumptions: [
      msg('readiness.projection.assumeDifficulty'),
      // The conditions and caveats are the exam config's own words, quoted as published.
      msg('readiness.projection.assumeConditions', { conditions: rule.conditions }),
      ...rule.caveats,
      msg('readiness.projection.assumeArithmetic'),
    ],
  };
}

/** The values every projection method sentence states: the learner's rates and the published points. */
function ruleValues(config: ExamConfig, accuracyOnAttempted: number, omissionRate: number) {
  return {
    accuracy: Math.round(accuracyOnAttempted * 100) / 100,
    omission: Math.round(omissionRate * 100) / 100,
    correct: config.scoring.pointsCorrect,
    blank: config.scoring.pointsOmitted,
    wrong: config.scoring.pointsIncorrect,
  };
}

/** A share as the catalogue's `{x, number, percent}` expects it, rounded to a whole percent. */
const share = (value: number) => Math.round(value * 100) / 100;

/** Pace is read from at least this many answers with a recorded time. */
export const MIN_TIMED_ANSWERS = 25;
/** A median under this is faster than a question can be read: unreliable timing, not speed. */
export const MIN_RELIABLE_MEDIAN_MS = 5_000;
/** A topic counts as covered with at least this many scored answers. */
export const COVERAGE_MIN_ANSWERS = 4;
/** A session counts towards consistency with at least this many scored answers. */
export const CONSISTENCY_MIN_SESSION_ANSWERS = 5;
/** Consistency needs at least this many such sessions. */
export const CONSISTENCY_MIN_SESSIONS = 3;

/**
 * The best band a signal can show from `count` pieces of evidence: none
 * below MIN_ANSWERS_FOR_SIGNAL, and no better than "Consistent" below
 * ANSWERS_FOR_USABLE_SIGNAL, as the overall band.
 */
export function evidenceCap(count: number): Band {
  if (count < MIN_ANSWERS_FOR_SIGNAL) return 'insufficient';
  if (count < ANSWERS_FOR_USABLE_SIGNAL) return 'consistent';
  return 'strong';
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

export interface ReadinessInput {
  config: ExamConfig;
  performance: SkillPerformance[];
  /** Domain-level rollup: slug -> { correct, answered, omitted }. */
  byDomain: Map<string, { correct: number; answered: number; omitted: number }>;
  /** The learner's goal, on the exam's own reported scale. */
  targetScore: number | null;
  /** Finished sessions, oldest first: accuracy and scored answers of each. */
  recentSessions: Array<{ accuracy: number; scored: number }>;
  /** Time on each answered question, from finished sessions (retries excluded). */
  timing: {
    /** Recorded times, in milliseconds; answers with no time are not here. */
    timesMs: number[];
    /** How many of those were answered in untimed practice. */
    inUntimed: number;
    /** Answers with no time recorded. */
    missing: number;
  };
}

export function assessReadiness(input: ReadinessInput): ReadinessAssessment {
  const { config, byDomain, targetScore } = input;

  let correct = 0;
  let answered = 0;
  let omitted = 0;
  for (const row of byDomain.values()) {
    correct += row.correct;
    answered += row.answered;
    omitted += row.omitted;
  }
  const scored = answered + omitted;
  const cap = evidenceCap(scored);

  const evidenceStrength =
    scored < MIN_ANSWERS_FOR_SIGNAL
      ? 'insufficient'
      : scored < ANSWERS_FOR_USABLE_SIGNAL
        ? 'indicative'
        : 'usable';

  // --- Accuracy, weighted by the exam's published domain mix where it exists.
  const weights = domainWeights(config);
  const rawAccuracy = scored > 0 ? correct / scored : 0;

  let weightedAccuracy = rawAccuracy;
  let accuracyBasis: Msg = msg('readiness.signal.accuracy.basisRaw', { correct, scored });

  if (weights.size > 0) {
    let weightSum = 0;
    let weighted = 0;
    for (const [slug, weight] of weights) {
      const row = byDomain.get(slug);
      const rowScored = row ? row.answered + row.omitted : 0;
      if (rowScored === 0) continue;
      weighted += (row!.correct / rowScored) * weight;
      weightSum += weight;
    }
    if (weightSum > 0) {
      weightedAccuracy = weighted / weightSum;
      accuracyBasis = msg('readiness.signal.accuracy.basisWeighted', {
        publisher: config.publisher,
        share: share(weightSum),
      });
    }
  }
  const accuracyEnough = scored >= MIN_ANSWERS_FOR_SIGNAL;
  const accuracySignal: ReadinessSignal = {
    key: 'accuracy',
    label: msg('readiness.signal.accuracy.label'),
    // Below the threshold a percentage is noise: show the count it would come from.
    display:
      scored === 0
        ? '—'
        : accuracyEnough
          ? msg('readiness.display.percent', { value: share(weightedAccuracy) })
          : msg('readiness.display.correctOf', { correct, total: scored }),
    band: accuracyEnough ? lowerOf(bandForAccuracy(weightedAccuracy), cap) : 'insufficient',
    basis: accuracyEnough
      ? cap === 'consistent'
        ? [
            accuracyBasis,
            msg('readiness.signal.accuracy.capNote', { usable: ANSWERS_FOR_USABLE_SIGNAL, band: bandLabel('consistent') }),
          ]
        : accuracyBasis
      : msg('readiness.signal.accuracy.basisTooFew', { min: MIN_ANSWERS_FOR_SIGNAL, count: scored }),
  };

  // --- Pace: the median over individual timed answers, against the exam's published pace.
  const pace = examPaceSeconds(config);
  const times = input.timing.timesMs.filter((t) => t > 0);
  const learnerMedianMs = median(times);
  const timingNotes: Msg[] = [
    input.timing.inUntimed > 0
      ? input.timing.inUntimed === times.length
        ? msg('readiness.timing.allUntimed')
        : msg('readiness.timing.someUntimed', { count: input.timing.inUntimed, total: times.length })
      : null,
    input.timing.missing > 0 ? msg('readiness.timing.missing', { count: input.timing.missing }) : null,
  ].filter((note): note is Msg => note !== null);
  let paceSignal: ReadinessSignal;
  let paceRatio: number | null = null;
  if (pace === null) {
    paceSignal = {
      key: 'pace',
      label: msg('readiness.signal.pace.label'),
      display: msg('readiness.display.notMeasurable'),
      band: 'insufficient',
      basis: msg('readiness.signal.pace.basisNoPace', { publisher: config.publisher }),
    };
  } else if (times.length < MIN_TIMED_ANSWERS) {
    paceSignal = {
      key: 'pace',
      label: msg('readiness.signal.pace.label'),
      display: msg('readiness.display.timedAnswers', { count: times.length }),
      band: 'insufficient',
      basis: [msg('readiness.signal.pace.basisTooFew', { min: MIN_TIMED_ANSWERS, count: times.length }), ...timingNotes],
    };
  } else if (learnerMedianMs < MIN_RELIABLE_MEDIAN_MS) {
    paceSignal = {
      key: 'pace',
      label: msg('readiness.signal.pace.label'),
      display: msg('readiness.display.timingUnreliable'),
      band: 'insufficient',
      basis: [msg('readiness.signal.pace.basisUnreliable', { seconds: MIN_RELIABLE_MEDIAN_MS / 1000 }), ...timingNotes],
    };
  } else {
    const ratio = learnerMedianMs / 1000 / pace;
    paceRatio = ratio;
    const band: Band = ratio <= 1.0 ? 'strong' : ratio <= 1.25 ? 'consistent' : ratio <= 1.6 ? 'developing' : 'early';
    paceSignal = {
      key: 'pace',
      label: msg('readiness.signal.pace.label'),
      display: msg('readiness.display.paceRatio', { ratio: Math.round(ratio * 100) / 100 }),
      band: lowerOf(band, evidenceCap(times.length)),
      basis: [
        msg('readiness.signal.pace.basis', { pace, count: times.length, median: Math.round(learnerMedianMs / 1000) }),
        ...timingNotes,
      ],
    };
  }

  // --- Coverage: topics with enough answers to count.
  const rowsScored = [...byDomain.values()].map((row) => row.answered + row.omitted);
  const covered = rowsScored.filter((n) => n >= COVERAGE_MIN_ANSWERS).length;
  const touchedOnly = rowsScored.filter((n) => n > 0 && n < COVERAGE_MIN_ANSWERS).length;
  const total = config.domains.length;
  const coverageBand: Band =
    covered >= total ? 'strong' : covered >= total * 0.7 ? 'consistent' : covered >= total * 0.4 ? 'developing' : 'early';
  const coverageSignal: ReadinessSignal = {
    key: 'coverage',
    label: msg('readiness.signal.coverage.label'),
    display: msg('readiness.display.topicsCovered', { covered, total }),
    band: accuracyEnough ? lowerOf(coverageBand, cap) : 'insufficient',
    basis: [
      msg('readiness.signal.coverage.basis', { min: COVERAGE_MIN_ANSWERS }),
      ...(touchedOnly > 0 ? [msg('readiness.signal.coverage.touchedOnly', { count: touchedOnly })] : []),
    ],
  };

  const signals: ReadinessSignal[] = [
    accuracySignal,
    paceSignal,
    coverageSignal,
    {
      key: 'volume',
      label: msg('readiness.signal.volume.label'),
      display: msg('readiness.display.questions', { count: scored }),
      band:
        scored >= ANSWERS_FOR_USABLE_SIGNAL
          ? 'strong'
          : scored >= MIN_ANSWERS_FOR_SIGNAL
            ? 'developing'
            : 'insufficient',
      basis: msg('readiness.signal.volume.basis', { min: MIN_ANSWERS_FOR_SIGNAL, usable: ANSWERS_FOR_USABLE_SIGNAL }),
    },
  ];

  // --- Consistency, from sessions long enough to mean something.
  const sessions = input.recentSessions.filter((s) => s.scored >= CONSISTENCY_MIN_SESSION_ANSWERS).slice(-6);
  if (sessions.length < CONSISTENCY_MIN_SESSIONS) {
    signals.push({
      key: 'consistency',
      label: msg('readiness.signal.consistency.label'),
      display: msg('readiness.display.sessionsOf', { count: sessions.length, min: CONSISTENCY_MIN_SESSIONS }),
      band: 'insufficient',
      basis: msg('readiness.signal.consistency.basisTooFew', {
        min: CONSISTENCY_MIN_SESSIONS,
        answers: CONSISTENCY_MIN_SESSION_ANSWERS,
        count: sessions.length,
      }),
    });
  } else {
    const values = sessions.map((s) => s.accuracy);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const spread = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length);
    const band: Band = spread <= 0.07 ? 'strong' : spread <= 0.12 ? 'consistent' : spread <= 0.2 ? 'developing' : 'early';
    signals.push({
      key: 'consistency',
      label: msg('readiness.signal.consistency.label'),
      display: msg('readiness.display.spread', { points: Math.round(spread * 100) }),
      band: lowerOf(band, evidenceCap(sessions.reduce((n, s) => n + s.scored, 0))),
      basis: msg('readiness.signal.consistency.basis', { count: values.length, answers: CONSISTENCY_MIN_SESSION_ANSWERS }),
    });
  }

  // --- Overall band. Never better than the evidence supports.
  const overall = lowerOf(accuracySignal.band, cap);

  const overallStatement =
    overall === 'insufficient'
      ? msg('readiness.overall.insufficient', { count: scored, min: MIN_ANSWERS_FOR_SIGNAL })
      : msg(weights.size > 0 ? 'readiness.overall.weighted' : 'readiness.overall.unweighted', {
          accuracy: share(weightedAccuracy),
        });

  // --- Every topic, worst first: never attempted, then lowest accuracy.
  const gaps: DomainGap[] = config.domains
    .map((domain) => {
      const row = byDomain.get(domain.slug);
      const rowScored = row ? row.answered + row.omitted : 0;
      return {
        domainSlug: domain.slug,
        label: domain.name,
        accuracy: rowScored > 0 ? row!.correct / rowScored : 0,
        answered: rowScored,
        officialShare: domain.officialShare,
        hasSignal: rowScored >= COVERAGE_MIN_ANSWERS,
      };
    })
    .sort((a, b) => {
      if (a.answered === 0 && b.answered > 0) return -1;
      if (b.answered === 0 && a.answered > 0) return 1;
      return a.accuracy - b.accuracy;
    });

  // --- Target.
  let target: TargetAnalysis | null = null;
  if (targetScore !== null && config.scoring.officialScale) {
    const scale = config.scoring.officialScale;
    // Scores are written as the exam's owner writes them ("1400"), not regrouped.
    const statedTarget = msg('readiness.target.stated', {
      target: String(targetScore),
      scale: scale.label,
      min: String(scale.min),
      max: String(scale.max),
    });

    // Quantifiable only where the exam publishes its complete raw scoring.
    const publishesRawScoring =
      config.scoring.pointsIncorrect !== 0 || config.examKey.startsWith('bocconi');

    if (config.scoring.rawProjection) {
      const omissionRate = scored > 0 ? omitted / scored : 0;
      const accuracyOnAttempted = answered > 0 ? correct / answered : 0;
      target = {
        statedTarget,
        quantifiable: true,
        projection: publishedProjection(config, targetScore, accuracyOnAttempted, omissionRate),
        explanation: msg('readiness.target.explanationConverted', { publisher: config.publisher }),
      };
    } else if (publishesRawScoring) {
      const omissionRate = scored > 0 ? omitted / scored : 0;
      const accuracyOnAttempted = answered > 0 ? correct / answered : 0;
      target = {
        statedTarget,
        quantifiable: true,
        projection: bocconiProjection(config, targetScore, accuracyOnAttempted, omissionRate),
        explanation: msg('readiness.target.explanationPenalty', { publisher: config.publisher }),
      };
    } else {
      target = {
        statedTarget,
        quantifiable: false,
        projection: null,
        explanation: msg(
          // College Board's own statement about equal raw scores is cited for the SAT.
          config.examKey === 'digital-sat' ? 'readiness.target.explanationNoneSat' : 'readiness.target.explanationNone',
          { target: String(targetScore), publisher: config.publisher, scale: scale.label },
        ),
      };
    }
  }

  // --- Limitations, always shown.
  const limitations: LearnerText[] = [
    msg('readiness.limitations.difficulty'),
    msg('readiness.limitations.noPercentiles'),
  ];
  if (evidenceStrength !== 'usable') {
    limitations.unshift(msg('readiness.limitations.smallSample', { count: scored }));
  }
  if (config.unverified.length > 0) {
    limitations.push(msg('readiness.limitations.unverified', { count: config.unverified.length }));
  }

  return {
    examKey: config.examKey,
    examName: config.name,
    evidenceStrength,
    answeredTotal: scored,
    overall,
    overallStatement,
    signals,
    gaps,
    target,
    limitations,
    paceRatio,
  };
}
