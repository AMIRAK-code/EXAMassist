import type { ExamConfig } from '@/lib/assessment/types';
import type { SkillPerformance } from './recommend';

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
 *     projects the learner's raw score. Today that is the Bocconi test, whose
 *     +1 / 0 / -0.2 scheme and 50-item blueprint are both published.
 *
 * Everything else reports the target back as the learner's own stated goal and
 * says plainly why we cannot map our measurements onto it.
 */

export type Band = 'insufficient' | 'early' | 'developing' | 'consistent' | 'strong';

export const BAND_LABEL: Record<Band, string> = {
  insufficient: 'Not enough evidence yet',
  early: 'Early',
  developing: 'Developing',
  consistent: 'Consistent',
  strong: 'Strong',
};

/** Below this many scored answers, any percentage is noise. */
export const MIN_ANSWERS_FOR_SIGNAL = 25;
/** Below this, treat the picture as indicative rather than usable. */
export const ANSWERS_FOR_USABLE_SIGNAL = 80;

export interface ReadinessSignal {
  key: 'accuracy' | 'pace' | 'coverage' | 'volume' | 'consistency';
  label: string;
  /** Human-readable measured value, e.g. "68%" or "1.4x exam pace". */
  display: string;
  band: Band;
  /** What was actually measured, in one sentence. */
  basis: string;
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
  statedTarget: string;
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
    method: string;
    assumptions: string[];
    /** "Projected raw score", or the reported scale's own name where raw is converted. */
    scoreLabel?: string;
    /** Every threshold the exam's owner publishes, on the reported scale. */
    thresholds?: Array<{ label: string; value: number; meaning: string; met: boolean }>;
    /** Why there is no single published threshold, where there is none. */
    noThresholdReason?: string | null;
  } | null;
  /** Always present: why we can or cannot speak to the target. */
  explanation: string;
}

export interface ReadinessAssessment {
  examKey: string;
  examName: string;
  evidenceStrength: 'insufficient' | 'indicative' | 'usable';
  answeredTotal: number;
  overall: Band;
  overallStatement: string;
  signals: ReadinessSignal[];
  gaps: DomainGap[];
  target: TargetAnalysis | null;
  limitations: string[];
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
 * Bocconi is the one exam whose scoring is fully published: 50 items, +1 for a
 * correct answer, 0 for a blank and -0.2 for a wrong one, with an official
 * eligibility floor. So a target there can be reasoned about with arithmetic
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

  // The published eligibility floor, if the config records one in its notes.
  const floorNote = config.scoring.notes.find((note) => /lower than (\d+)/i.test(note));
  const floorMatch = floorNote ? /lower than (\d+)/i.exec(floorNote) : null;
  const officialFloor = floorMatch ? Number(floorMatch[1]) : null;

  return {
    projectedRaw: Math.round(projectedRaw * 10) / 10,
    maxRaw,
    targetRaw,
    meetsTarget: projectedRaw >= targetRaw,
    officialFloor,
    meetsOfficialFloor: officialFloor === null ? null : projectedRaw >= officialFloor,
    method:
      `Your accuracy on the questions you attempted (${Math.round(accuracyOnAttempted * 100)}%) and your rate of ` +
      `leaving questions blank (${Math.round(omissionRate * 100)}%) applied to the published ` +
      `${items}-question form, scored with Bocconi's published rule: ` +
      `+${config.scoring.pointsCorrect} correct, ${config.scoring.pointsOmitted} blank, ` +
      `${config.scoring.pointsIncorrect} wrong.`,
    assumptions: [
      'It assumes our questions are as hard as the real ones. Their difficulty is our editorial judgement, not calibrated against test-taker data.',
      'It assumes you answer under the same conditions: no calculator, 75 minutes, no going back.',
      'It ignores the larger penalty on three-option critical-thinking items, so a real form could score slightly lower.',
      'It is arithmetic on your own practice, not a prediction of test day.',
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
    scoreLabel: converted && scale ? `Projected score (${scale.label})` : 'Projected raw score',
    thresholds: rule.thresholds.map((threshold) => ({
      label: threshold.label,
      value: threshold.value,
      meaning: threshold.meaning,
      met: projected >= threshold.value,
    })),
    noThresholdReason: rule.noThresholdReason,
    method:
      `Your accuracy on the questions you attempted (${Math.round(accuracyOnAttempted * 100)}%) and your rate of ` +
      `leaving questions blank (${Math.round(omissionRate * 100)}%) applied to the published ` +
      `${items}-question form, scored with ${config.publisher}'s published rule: ` +
      `+${config.scoring.pointsCorrect} correct, ${config.scoring.pointsOmitted} blank, ` +
      `${config.scoring.pointsIncorrect} wrong` +
      (converted && scale ? `, then converted to the reported scale (${scale.label}) as published.` : '.'),
    assumptions: [
      'It assumes our questions are as hard as the real ones. Their difficulty is our editorial judgement, not calibrated against test-taker data.',
      `It assumes you answer under the same conditions: ${rule.conditions}.`,
      ...rule.caveats,
      'It is arithmetic on your own practice, not a prediction of test day.',
    ],
  };
}

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

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

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
  let accuracyBasis =
    `${correct} correct out of ${scored} questions shown, across every topic you have practised.`;

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
      accuracyBasis =
        `Your accuracy in each topic, weighted by ${config.publisher}'s published share of the exam ` +
        `for that topic, over the ${Math.round(weightSum * 100)}% of the exam you have practised.`;
    }
  }
  const accuracyEnough = scored >= MIN_ANSWERS_FOR_SIGNAL;
  const accuracySignal: ReadinessSignal = {
    key: 'accuracy',
    label: 'Accuracy',
    // Below the threshold a percentage is noise: show the count it would come from.
    display: scored === 0 ? '—' : accuracyEnough ? `${Math.round(weightedAccuracy * 100)}%` : `${correct} of ${scored} correct`,
    band: accuracyEnough ? lowerOf(bandForAccuracy(weightedAccuracy), cap) : 'insufficient',
    basis: accuracyEnough
      ? `${accuracyBasis}${cap === 'consistent' ? ` Under ${ANSWERS_FOR_USABLE_SIGNAL} answers this reads no better than Consistent.` : ''}`
      : `A percentage means something from ${MIN_ANSWERS_FOR_SIGNAL} answers; you have ${scored}.`,
  };

  // --- Pace: the median over individual timed answers, against the exam's published pace.
  const pace = examPaceSeconds(config);
  const times = input.timing.timesMs.filter((t) => t > 0);
  const learnerMedianMs = median(times);
  const timingNotes = [
    input.timing.inUntimed > 0
      ? `${input.timing.inUntimed === times.length ? 'All' : `${input.timing.inUntimed} of ${times.length}`} of these were answered in untimed practice, with no clock to keep to.`
      : null,
    input.timing.missing > 0 ? `${plural(input.timing.missing, 'answer')} had no time recorded and ${input.timing.missing === 1 ? 'is' : 'are'} left out.` : null,
  ]
    .filter(Boolean)
    .join(' ');
  let paceSignal: ReadinessSignal;
  let paceRatio: number | null = null;
  if (pace === null) {
    paceSignal = {
      key: 'pace',
      label: 'Pace',
      display: 'Not measurable',
      band: 'insufficient',
      basis: `${config.publisher} does not publish enough for a per-question pace on this exam, so we cannot compare.`,
    };
  } else if (times.length < MIN_TIMED_ANSWERS) {
    paceSignal = {
      key: 'pace',
      label: 'Pace',
      display: plural(times.length, 'timed answer'),
      band: 'insufficient',
      basis: `Pace is read from at least ${MIN_TIMED_ANSWERS} answers with a recorded time; you have ${times.length}.${timingNotes ? ` ${timingNotes}` : ''}`,
    };
  } else if (learnerMedianMs < MIN_RELIABLE_MEDIAN_MS) {
    paceSignal = {
      key: 'pace',
      label: 'Pace',
      display: 'Timing unreliable',
      band: 'insufficient',
      basis: `Your median time is under ${MIN_RELIABLE_MEDIAN_MS / 1000} seconds a question, faster than a question can be read, so it is treated as unreliable timing rather than as speed.${timingNotes ? ` ${timingNotes}` : ''}`,
    };
  } else {
    const ratio = learnerMedianMs / 1000 / pace;
    paceRatio = ratio;
    const band: Band = ratio <= 1.0 ? 'strong' : ratio <= 1.25 ? 'consistent' : ratio <= 1.6 ? 'developing' : 'early';
    paceSignal = {
      key: 'pace',
      label: 'Pace',
      display: `${ratio.toFixed(2)}× the exam's pace`,
      band: lowerOf(band, evidenceCap(times.length)),
      basis: `The exam allows about ${pace} seconds a question. Your median over ${times.length} timed answers is ${Math.round(learnerMedianMs / 1000)} seconds.${timingNotes ? ` ${timingNotes}` : ''}`,
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
    label: 'Topic coverage',
    display: `${covered} of ${total} topics`,
    band: accuracyEnough ? lowerOf(coverageBand, cap) : 'insufficient',
    basis:
      `Topics of the exam’s own list in which you have answered at least ${COVERAGE_MIN_ANSWERS} questions.` +
      (touchedOnly > 0 ? ` ${plural(touchedOnly, 'more topic has', 'more topics have')} fewer answers than that.` : ''),
  };

  const signals: ReadinessSignal[] = [
    accuracySignal,
    paceSignal,
    coverageSignal,
    {
      key: 'volume',
      label: 'Evidence',
      display: `${scored} questions`,
      band:
        scored >= ANSWERS_FOR_USABLE_SIGNAL
          ? 'strong'
          : scored >= MIN_ANSWERS_FOR_SIGNAL
            ? 'developing'
            : 'insufficient',
      basis: `Below ${MIN_ANSWERS_FOR_SIGNAL} answers a percentage is noise; we treat ${ANSWERS_FOR_USABLE_SIGNAL}+ as a usable sample of your own work.`,
    },
  ];

  // --- Consistency, from sessions long enough to mean something.
  const sessions = input.recentSessions.filter((s) => s.scored >= CONSISTENCY_MIN_SESSION_ANSWERS).slice(-6);
  if (sessions.length < CONSISTENCY_MIN_SESSIONS) {
    signals.push({
      key: 'consistency',
      label: 'Consistency',
      display: `${sessions.length} of ${CONSISTENCY_MIN_SESSIONS} sessions`,
      band: 'insufficient',
      basis: `Consistency compares at least ${CONSISTENCY_MIN_SESSIONS} sessions of ${CONSISTENCY_MIN_SESSION_ANSWERS} or more answers; you have ${sessions.length}.`,
    });
  } else {
    const values = sessions.map((s) => s.accuracy);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const spread = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length);
    const band: Band = spread <= 0.07 ? 'strong' : spread <= 0.12 ? 'consistent' : spread <= 0.2 ? 'developing' : 'early';
    signals.push({
      key: 'consistency',
      label: 'Consistency',
      display: `±${Math.round(spread * 100)} points between sessions`,
      band: lowerOf(band, evidenceCap(sessions.reduce((n, s) => n + s.scored, 0))),
      basis: `How much your accuracy moves between your last ${values.length} sessions of ${CONSISTENCY_MIN_SESSION_ANSWERS} or more answers. A wide spread usually means the topic mix is driving the result, not your level.`,
    });
  }

  // --- Overall band. Never better than the evidence supports.
  const overall = lowerOf(accuracySignal.band, cap);

  const overallStatement =
    overall === 'insufficient'
      ? `You have answered ${scored} question${scored === 1 ? '' : 's'} for this exam. That is too few to say anything about readiness — answer at least ${MIN_ANSWERS_FOR_SIGNAL} and this becomes meaningful.`
      : `Across the topics you have practised, you are answering ${Math.round(weightedAccuracy * 100)}% correctly${
          weights.size > 0 ? ", weighted the way the exam itself weights its topics" : ''
        }. This describes your work on our questions, not a predicted exam score.`;

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
    const statedTarget = `${targetScore} on the ${scale.label} scale (${scale.min}–${scale.max})`;

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
        explanation:
          `${config.publisher} publishes this exam's scoring in full — a fixed number of questions, each worth ` +
          `the same, a published penalty for a wrong answer and a published conversion to the reported score — ` +
          `so your target can be turned into arithmetic rather than guesswork. The projection below is your own ` +
          `practice accuracy applied to the published form.`,
      };
    } else if (publishesRawScoring) {
      const omissionRate = scored > 0 ? omitted / scored : 0;
      const accuracyOnAttempted = answered > 0 ? correct / answered : 0;
      target = {
        statedTarget,
        quantifiable: true,
        projection: bocconiProjection(config, targetScore, accuracyOnAttempted, omissionRate),
        explanation:
          `${config.publisher} publishes this exam's scoring in full — every question is worth the same, ` +
          `and the penalty for a wrong answer is published — so your target can be turned into arithmetic ` +
          `rather than guesswork. The projection below is your own practice accuracy applied to the ` +
          `published form.`,
      };
    } else {
      target = {
        statedTarget,
        quantifiable: false,
        projection: null,
        explanation:
          `We cannot tell you whether your practice equals ${targetScore}. ${config.publisher} does not ` +
          `publish how a raw score becomes a ${scale.label} score` +
          (config.examKey === 'digital-sat'
            ? ', and states that two test takers who answer the same number of questions correctly can receive different section scores'
            : '') +
          `. Anyone who gives you a number for this is estimating. What we can show you is the work itself: ` +
          `how accurate you are in each topic the exam publishes, and whether you are working at its pace.`,
      };
    }
  }

  // --- Limitations, always shown.
  const limitations = [
    'Every figure here comes from your answers to our own questions. Their difficulty is our editorial judgement, not calibrated against test-taker data.',
    'We do not report percentiles, and we do not estimate a probability of admission.',
  ];
  if (evidenceStrength !== 'usable') {
    limitations.unshift(
      `This is based on ${scored} answers, which is a small sample. Treat it as a pointer, not a measurement.`,
    );
  }
  if (config.unverified.length > 0) {
    limitations.push(
      `${config.unverified.length} rule(s) of this exam could not be verified from an official source, so some exam-accurate practice is switched off.`,
    );
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
