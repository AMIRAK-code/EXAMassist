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
  nextActions: Array<{ label: string; href: string; why: string }>;
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

export interface ReadinessInput {
  config: ExamConfig;
  performance: SkillPerformance[];
  /** Domain-level rollup: slug -> { correct, answered, omitted }. */
  byDomain: Map<string, { correct: number; answered: number; omitted: number; medianTimeMs: number }>;
  /** The learner's goal, on the exam's own reported scale. */
  targetScore: number | null;
  /** Sessions completed, used only to judge consistency. */
  recentAccuracies: number[];
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

  // --- Pace against the exam's own published pace.
  const pace = examPaceSeconds(config);
  const medianTimes = [...byDomain.values()].map((r) => r.medianTimeMs).filter((t) => t > 0).sort((a, b) => a - b);
  const learnerMedianMs = medianTimes.length > 0 ? medianTimes[Math.floor(medianTimes.length / 2)] : 0;
  const paceRatio = pace && learnerMedianMs > 0 ? learnerMedianMs / 1000 / pace : null;

  const signals: ReadinessSignal[] = [
    {
      key: 'accuracy',
      label: 'Accuracy',
      display: scored > 0 ? `${Math.round(weightedAccuracy * 100)}%` : '—',
      band: scored === 0 ? 'insufficient' : bandForAccuracy(weightedAccuracy),
      basis: accuracyBasis,
    },
    {
      key: 'pace',
      label: 'Pace',
      display:
        paceRatio === null
          ? 'Not measurable'
          : `${paceRatio.toFixed(2)}× the exam's pace`,
      band:
        paceRatio === null
          ? 'insufficient'
          : paceRatio <= 1.0
            ? 'strong'
            : paceRatio <= 1.25
              ? 'consistent'
              : paceRatio <= 1.6
                ? 'developing'
                : 'early',
      basis:
        pace === null
          ? `${config.publisher} does not publish enough for a per-question pace on this exam, so we cannot compare.`
          : `The exam allows about ${pace} seconds a question. Your median is ${Math.round(learnerMedianMs / 1000)} seconds.`,
    },
    {
      key: 'coverage',
      label: 'Topic coverage',
      display: `${byDomain.size} of ${config.domains.length} topics`,
      band:
        byDomain.size === 0
          ? 'insufficient'
          : byDomain.size >= config.domains.length
            ? 'strong'
            : byDomain.size >= config.domains.length * 0.7
              ? 'consistent'
              : byDomain.size >= config.domains.length * 0.4
                ? 'developing'
                : 'early',
      basis: 'How many of the exam’s own content domains you have answered at least one question in.',
    },
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

  if (input.recentAccuracies.length >= 3) {
    const values = input.recentAccuracies.slice(-6);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const spread = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length);
    signals.push({
      key: 'consistency',
      label: 'Consistency',
      display: `±${Math.round(spread * 100)} points between sessions`,
      band: spread <= 0.07 ? 'strong' : spread <= 0.12 ? 'consistent' : spread <= 0.2 ? 'developing' : 'early',
      basis: `How much your accuracy moves between your last ${values.length} sessions. A wide spread usually means the topic mix is driving the result, not your level.`,
    });
  }

  // --- Overall band. Never better than the evidence supports.
  const accuracyBand = signals[0].band;
  const evidenceCap: Band =
    evidenceStrength === 'insufficient'
      ? 'insufficient'
      : evidenceStrength === 'indicative'
        ? 'consistent'
        : 'strong';
  const overall = lowerOf(accuracyBand, evidenceCap);

  const overallStatement =
    overall === 'insufficient'
      ? `You have answered ${scored} question${scored === 1 ? '' : 's'} for this exam. That is too few to say anything about readiness — answer at least ${MIN_ANSWERS_FOR_SIGNAL} and this becomes meaningful.`
      : `Across the topics you have practised, you are answering ${Math.round(weightedAccuracy * 100)}% correctly${
          weights.size > 0 ? ", weighted the way the exam itself weights its topics" : ''
        }. This describes your work on our questions, not a predicted exam score.`;

  // --- Gaps, worst first, only where there is enough evidence to mean anything.
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
        hasSignal: rowScored >= 4,
      };
    })
    .sort((a, b) => {
      if (a.answered === 0 && b.answered > 0) return -1;
      if (b.answered === 0 && a.answered > 0) return 1;
      return a.accuracy - b.accuracy;
    })
    .slice(0, 5);

  // --- Target.
  let target: TargetAnalysis | null = null;
  if (targetScore !== null && config.scoring.officialScale) {
    const scale = config.scoring.officialScale;
    const statedTarget = `${targetScore} on the ${scale.label} scale (${scale.min}–${scale.max})`;

    // Quantifiable only where the exam publishes its complete raw scoring.
    const publishesRawScoring =
      config.scoring.pointsIncorrect !== 0 || config.examKey.startsWith('bocconi');

    if (publishesRawScoring) {
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

  // --- Next actions, driven by the weakest signal.
  const nextActions: Array<{ label: string; href: string; why: string }> = [];
  const untouched = gaps.find((gap) => gap.answered === 0);
  if (untouched) {
    nextActions.push({
      label: `Practise ${untouched.label}`,
      href: `/practice/${config.examKey}?domain=${encodeURIComponent(untouched.domainSlug)}`,
      why: 'You have not answered anything in this topic, so it is a blind spot in everything above.',
    });
  }
  const weakest = gaps.find((gap) => gap.hasSignal && gap.accuracy < 0.6);
  if (weakest) {
    nextActions.push({
      label: `Drill ${weakest.label}`,
      href: `/practice/${config.examKey}?domain=${encodeURIComponent(weakest.domainSlug)}`,
      why: `Your weakest topic with enough answers to be worth acting on: ${Math.round(weakest.accuracy * 100)}% of ${weakest.answered}.`,
    });
  }
  if (paceRatio !== null && paceRatio > 1.25) {
    nextActions.push({
      label: 'Practise against the clock',
      href: `/practice/${config.examKey}`,
      why: `You are working at ${paceRatio.toFixed(2)}× the exam's pace. Accuracy that does not survive the clock will not survive test day.`,
    });
  }
  if (evidenceStrength === 'insufficient') {
    nextActions.unshift({
      label: 'Answer more questions',
      href: `/practice/${config.examKey}`,
      why: `Another ${Math.max(0, MIN_ANSWERS_FOR_SIGNAL - scored)} answers and this assessment starts to mean something.`,
    });
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
    nextActions,
  };
}
