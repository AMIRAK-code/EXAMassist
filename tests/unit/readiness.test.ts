import { describe, expect, it } from 'vitest';
import {
  MIN_ANSWERS_FOR_SIGNAL,
  assessReadiness,
  examPaceSeconds,
  leadingCount,
  type ReadinessInput,
} from '@/lib/learning/readiness';
import { requireExamConfig } from '@/lib/exams/registry';

/**
 * The readiness assessment exists to answer "am I on track for my target?"
 * without inventing the one number that would answer it directly. These tests
 * are mostly about what it must REFUSE to say.
 */

const SAT = requireExamConfig('digital-sat');
const BOCCONI = requireExamConfig('bocconi-undergraduate');
const LSAT = requireExamConfig('lsat');
const NO_TIMES = { timesMs: [], inUntimed: 0, missing: 0 };

function domainRows(
  config: typeof SAT,
  perDomain: { correct: number; answered: number; omitted: number },
  domainCount = config.domains.length,
) {
  const map = new Map<string, { correct: number; answered: number; omitted: number }>();
  for (const domain of config.domains.slice(0, domainCount)) {
    map.set(domain.slug, { ...perDomain });
  }
  return map;
}

function input(overrides: Partial<ReadinessInput> = {}): ReadinessInput {
  return {
    config: SAT,
    performance: [],
    byDomain: domainRows(SAT, { correct: 7, answered: 10, omitted: 0 }),
    targetScore: null,
    recentSessions: [],
    timing: NO_TIMES,
    ...overrides,
  };
}

describe('published-fact helpers', () => {
  it('pulls the leading count out of a published string', () => {
    expect(leadingCount('27 administered (25 operational + 2 pretest)')).toBe(27);
    expect(leadingCount('50')).toBe(50);
    expect(leadingCount('not publicly specified')).toBeNull();
    expect(leadingCount(null)).toBeNull();
  });

  it('computes the exam pace from published counts and times', () => {
    // SAT: 98 administered questions in 134 minutes -> about 82 seconds.
    const pace = examPaceSeconds(SAT);
    expect(pace).not.toBeNull();
    expect(pace!).toBeGreaterThan(60);
    expect(pace!).toBeLessThan(110);
  });

  it('returns null when the test maker does not publish item counts', () => {
    // LSAC publishes section times but not questions per section.
    expect(examPaceSeconds(LSAT)).toBeNull();
  });
});

describe('refusing to over-claim', () => {
  it('reports insufficient evidence below the threshold, whatever the accuracy', () => {
    const result = assessReadiness(
      input({ byDomain: domainRows(SAT, { correct: 5, answered: 5, omitted: 0 }, 1) }),
    );
    expect(result.evidenceStrength).toBe('insufficient');
    expect(result.overall).toBe('insufficient');
    // 100% correct, but on five answers it must not say "strong".
    expect(result.overallStatement).toContain('too few');
  });

  it('caps the band at the evidence, not the accuracy', () => {
    // 90% accuracy on a small-but-not-tiny sample: indicative, never "strong".
    const result = assessReadiness(
      input({ byDomain: domainRows(SAT, { correct: 9, answered: 10, omitted: 0 }, 3) }),
    );
    expect(result.evidenceStrength).toBe('indicative');
    expect(result.overall).not.toBe('strong');
  });

  it('never promises a scaled score for an exam that does not publish the conversion', () => {
    const result = assessReadiness(input({ targetScore: 1400 }));
    expect(result.target).not.toBeNull();
    expect(result.target!.quantifiable).toBe(false);
    expect(result.target!.projection).toBeNull();
    expect(result.target!.explanation).toContain('cannot tell you');
    expect(result.target!.explanation).toContain('does not');
  });

  it('cites the SAT’s own statement about equal raw scores', () => {
    const result = assessReadiness(input({ targetScore: 1500 }));
    expect(result.target!.explanation).toContain('same number of questions correctly');
  });

  it('always states its limitations, including never reporting percentiles', () => {
    const result = assessReadiness(input({ targetScore: 1400 }));
    expect(result.limitations.join(' ')).toContain('percentiles');
    expect(result.limitations.join(' ')).toContain('editorial judgement');
  });

  it('records no target analysis when the learner has not set one', () => {
    expect(assessReadiness(input({ targetScore: null })).target).toBeNull();
  });
});

describe('Bocconi, the one exam whose scoring is fully published', () => {
  const bocconiInput = (accuracy: number, omissionRate = 0, target = 35): ReadinessInput => {
    const perDomain = 25;
    const omitted = Math.round(perDomain * omissionRate);
    const answered = perDomain - omitted;
    return {
      config: BOCCONI,
      performance: [],
      byDomain: domainRows(
        BOCCONI,
        { correct: Math.round(answered * accuracy), answered, omitted },
      ),
      targetScore: target,
      recentSessions: [],
    timing: NO_TIMES,
    };
  };

  it('quantifies the target, because the raw scoring rule is published', () => {
    const result = assessReadiness(bocconiInput(0.8));
    expect(result.target!.quantifiable).toBe(true);
    expect(result.target!.projection).not.toBeNull();
  });

  it('applies the published negative marking rather than counting correct answers', () => {
    const projection = assessReadiness(bocconiInput(0.6, 0)).target!.projection!;
    // 50 items, 60% correct, nothing left blank:
    // 30 correct (+30) and 20 wrong (20 x -0.2 = -4) -> 26.
    expect(projection.maxRaw).toBe(50);
    expect(projection.projectedRaw).toBeCloseTo(26, 1);
  });

  it('reproduces the break-even the published penalty actually implies', () => {
    /*
     * Under Bocconi's published rule (+1 correct, 0 blank, -0.2 wrong),
     * attempting a question is worth p - 0.2(1 - p), which is positive above
     * p = 1/6 ≈ 0.167. So the projection must show attempting as BETTER for a
     * competent candidate, and omitting as better only for a genuinely lost one.
     * Getting this backwards would give learners advice that costs them marks.
     */
    const competentAttempting = assessReadiness(bocconiInput(0.5, 0)).target!.projection!;
    const competentOmitting = assessReadiness(bocconiInput(0.5, 0.4)).target!.projection!;
    expect(competentAttempting.projectedRaw).toBeGreaterThan(competentOmitting.projectedRaw);

    const lostAttempting = assessReadiness(bocconiInput(0.1, 0)).target!.projection!;
    const lostOmitting = assessReadiness(bocconiInput(0.1, 0.6)).target!.projection!;
    expect(lostOmitting.projectedRaw).toBeGreaterThan(lostAttempting.projectedRaw);
  });

  it('measures accuracy on attempted questions, not over everything shown', () => {
    /*
     * 60% correct on what they attempt, leaving 40% blank. Of 50 items that is
     * 30 attempted: 18 correct (+18) and 12 wrong (12 x -0.2 = -2.4) = 15.6.
     *
     * Reading the same learner as "9 correct out of 25 shown" would give 36%,
     * and a projection of about 7 — less than half. Which accuracy the
     * projection uses is therefore not a detail.
     */
    const projection = assessReadiness(bocconiInput(0.6, 0.4)).target!.projection!;
    expect(projection.projectedRaw).toBeCloseTo(15.6, 1);
  });

  it('compares against the official eligibility floor, not an invented threshold', () => {
    const projection = assessReadiness(bocconiInput(0.8)).target!.projection!;
    expect(projection.officialFloor).toBe(17);
    expect(projection.meetsOfficialFloor).toBe(true);

    const weak = assessReadiness(bocconiInput(0.3)).target!.projection!;
    expect(weak.meetsOfficialFloor).toBe(false);
  });

  it('says whether the learner’s own target is met', () => {
    expect(assessReadiness(bocconiInput(0.9, 0, 35)).target!.projection!.meetsTarget).toBe(true);
    expect(assessReadiness(bocconiInput(0.4, 0, 35)).target!.projection!.meetsTarget).toBe(false);
  });

  it('states its assumptions, including that our difficulty is not calibrated', () => {
    const projection = assessReadiness(bocconiInput(0.7)).target!.projection!;
    expect(projection.assumptions.length).toBeGreaterThanOrEqual(3);
    expect(projection.assumptions.join(' ')).toContain('editorial judgement');
    expect(projection.method).toContain('published');
  });
});

describe('signals, each with its own evidence threshold', () => {
  const times = (n: number, ms: number, inUntimed = 0, missing = 0) => ({ timesMs: Array(n).fill(ms), inUntimed, missing });
  const signal = (result: ReturnType<typeof assessReadiness>, key: string) => result.signals.find((s) => s.key === key)!;

  it('shows accuracy as a count, not a percentage, below the threshold', () => {
    const accuracy = signal(assessReadiness(input({ byDomain: domainRows(SAT, { correct: 5, answered: 5, omitted: 0 }, 1) })), 'accuracy');
    expect(accuracy.band).toBe('insufficient');
    expect(accuracy.display).toBe('5 of 5 correct');
  });

  it('caps accuracy at Consistent below a usable sample, however high', () => {
    // Every topic at 7 answers, all correct: under 80 answers in total.
    const byDomain = domainRows(SAT, { correct: 7, answered: 7, omitted: 0 });
    expect(SAT.domains.length * 7).toBeLessThan(80);
    const accuracy = signal(assessReadiness(input({ byDomain })), 'accuracy');
    expect(accuracy.display).toBe('100%');
    expect(accuracy.band).toBe('consistent');
  });

  it('measures pace against the exam’s own published pace, over individual answers', () => {
    const slow = signal(assessReadiness(input({ timing: times(40, 200_000) })), 'pace');
    expect(slow.display).toContain('×');
    expect(['early', 'developing']).toContain(slow.band);
    expect(slow.basis).toContain('40 timed answers');
  });

  it('needs 25 timed answers before it reads pace at all', () => {
    const result = assessReadiness(input({ timing: times(24, 40_000) }));
    expect(signal(result, 'pace').band).toBe('insufficient');
    expect(signal(result, 'pace').display).toBe('24 timed answers');
    expect(result.paceRatio).toBeNull();
  });

  it('treats a median under five seconds as unreliable timing, never as strong pace', () => {
    const result = assessReadiness(input({ timing: times(60, 2_000) }));
    expect(signal(result, 'pace').display).toBe('Timing unreliable');
    expect(signal(result, 'pace').band).toBe('insufficient');
    expect(result.paceRatio).toBeNull();
  });

  it('says when pace comes from untimed practice, and what had no time recorded', () => {
    const pace = signal(assessReadiness(input({ timing: times(30, 60_000, 30, 4) })), 'pace');
    expect(pace.basis).toContain('All of these were answered in untimed practice');
    expect(pace.basis).toContain('4 answers had no time recorded');
    // 30 timed answers: fast enough for "Strong", capped at "Consistent".
    expect(pace.band).toBe('consistent');
  });

  it('says pace is not measurable when the exam does not publish item counts', () => {
    const result = assessReadiness({
      config: LSAT,
      performance: [],
      byDomain: domainRows(LSAT, { correct: 7, answered: 10, omitted: 0 }),
      targetScore: null,
      recentSessions: [],
      timing: times(50, 60_000),
    });
    expect(signal(result, 'pace').display).toBe('Not measurable');
    expect(signal(result, 'pace').basis).toContain('does not publish');
  });

  it('counts a topic as covered only from four answers', () => {
    const byDomain = domainRows(SAT, { correct: 8, answered: 10, omitted: 0 }, SAT.domains.length - 1);
    byDomain.set(SAT.domains[SAT.domains.length - 1].slug, { correct: 3, answered: 3, omitted: 0 });
    const coverage = signal(assessReadiness(input({ byDomain })), 'coverage');
    expect(coverage.display).toBe(`${SAT.domains.length - 1} of ${SAT.domains.length} topics`);
    expect(coverage.basis).toContain('1 more topic has fewer answers');
  });

  it('reads consistency only from three sessions of five or more answers', () => {
    const short = assessReadiness(input({ recentSessions: [0.5, 0.8, 0.55, 0.85].map((accuracy) => ({ accuracy, scored: 4 })) }));
    expect(signal(short, 'consistency').band).toBe('insufficient');
    expect(signal(short, 'consistency').display).toBe('0 of 3 sessions');

    const long = assessReadiness(input({ recentSessions: [0.5, 0.8, 0.55, 0.85].map((accuracy) => ({ accuracy, scored: 10 })) }));
    expect(['early', 'developing']).toContain(signal(long, 'consistency').band);
  });
});
