import { describe, expect, it } from 'vitest';
import { assessReadiness, examPaceSeconds, leadingCount, type ReadinessInput } from '@/lib/learning/readiness';
import { getHubForConfig, requireExamConfig } from '@/lib/exams/registry';
import type { ExamConfig } from '@/lib/assessment/types';

/**
 * The Politecnico di Torino TIL and CISIA TOLC configurations.
 *
 * Every number checked here was read from the official documents on
 * 29 September 2026 (docs/research/polito-til.md, docs/research/cisia-tolc.md).
 * The tests pin those numbers, so a later edit that drifts from them fails
 * here rather than on a learner's screen.
 */

const PUBLISHED: Record<string, { sections: Array<[string, number, number]>; total: number; minutes: number }> = {
  'polito-til-i': {
    sections: [
      ['mathematics', 16, 36],
      ['reading-logic', 10, 20],
      ['physics', 10, 22],
      ['technical-knowledge', 6, 12],
    ],
    total: 42,
    minutes: 90,
  },
  'polito-til-a': {
    sections: [
      ['reading-comprehension', 10, 20],
      ['general-knowledge', 10, 20],
      ['logical-reasoning', 10, 20],
      ['drawing-representation', 10, 20],
      ['mathematics-physics', 10, 20],
    ],
    total: 50,
    minutes: 100,
  },
  'tolc-e': {
    sections: [
      ['logic', 13, 30],
      ['verbal-comprehension', 10, 30],
      ['mathematics', 13, 30],
    ],
    total: 36,
    minutes: 90,
  },
  'tolc-f': {
    sections: [
      ['biology', 15, 20],
      ['chemistry', 15, 20],
      ['mathematics', 7, 12],
      ['physics', 7, 12],
      ['logic', 6, 8],
    ],
    total: 50,
    minutes: 72,
  },
};

describe.each(Object.entries(PUBLISHED))('%s configuration', (examKey, published) => {
  const config = requireExamConfig(examKey);

  it('has the published sections, in order, with their counts and times', () => {
    expect(config.sections.map((s) => [s.key, leadingCount(s.officialQuestionCount), s.officialTimeMinutes])).toEqual(
      published.sections,
    );
  });

  it('scores +1 / 0 / -0.25, with no calculator anywhere', () => {
    expect([config.scoring.pointsCorrect, config.scoring.pointsOmitted, config.scoring.pointsIncorrect]).toEqual([1, 0, -0.25]);
    expect(config.sections.every((s) => s.calculator === 'none')).toBe(true);
  });

  it('builds a full simulation that is the whole published test, section by section', () => {
    const simulation = config.blueprints.find((b) => b.id === 'simulation-full')!;
    expect(simulation.parts.map((p) => [p.sectionKey, p.itemCount, p.timeLimitSeconds])).toEqual(
      published.sections.map(([key, questions, minutes]) => [key, questions, minutes * 60]),
    );
    expect(simulation.parts.reduce((n, p) => n + p.itemCount, 0)).toBe(published.total);
    expect(simulation.parts.reduce((n, p) => n + (p.timeLimitSeconds ?? 0), 0)).toBe(published.minutes * 60);
    expect(simulation.fidelity).toBe('approximation');
    expect(simulation.pauseBehaviour).toBe('clock_runs');
  });

  it('offers one timed form per section at its published length and time', () => {
    for (const [key, questions, minutes] of published.sections) {
      const timed = config.blueprints.find((b) => b.id === `timed-${key}`)!;
      expect(timed, key).toBeDefined();
      expect(timed.parts).toHaveLength(1);
      expect(timed.parts[0].itemCount).toBe(questions);
      expect(timed.parts[0].timeLimitSeconds).toBe(minutes * 60);
    }
  });

  it('never lets a closed section be reopened, and says within-section movement is unverified', () => {
    expect(config.sections.every((s) => s.navigation.allowReturnToPreviousPart === false)).toBe(true);
    expect(config.unverified.some((u) => /within an open section/i.test(u))).toBe(true);
  });

  it('draws every blueprint only from its own domains', () => {
    const domainsBySection = new Map(config.sections.map((s) => [s.key, new Set(config.domains.filter((d) => d.sectionKey === s.key).map((d) => d.slug))]));
    for (const blueprint of config.blueprints) {
      for (const part of blueprint.parts) {
        if (part.selection.sectionKey === '*') continue;
        const allowed = domainsBySection.get(part.selection.sectionKey)!;
        for (const domain of part.selection.domains) expect(allowed.has(domain), `${blueprint.id}: ${domain}`).toBe(true);
      }
    }
  });

  it('declares its published raw scoring for the readiness projection', () => {
    expect(config.scoring.rawProjection?.scoredItems).toBe(published.total);
  });

  it('has a pace, because every section publishes a count and a time', () => {
    expect(examPaceSeconds(config)).toBeCloseTo((published.minutes * 60) / published.total, 0);
  });

  it('belongs to a hub for undergraduate admissions', () => {
    const hub = getHubForConfig(examKey)!;
    expect(hub).toBeDefined();
    expect(hub.audiences).toEqual(['undergraduate']);
    expect(config.audience).toEqual(['undergraduate']);
  });
});

// ---------------------------------------------------------------------------
// Readiness against a target
// ---------------------------------------------------------------------------

const NO_TIMES = { timesMs: [], inUntimed: 0, missing: 0 };

/** Every domain answered at `accuracy`, 25 answers each, with `omissionRate` left blank. */
function readinessFor(config: ExamConfig, accuracy: number, target: number, omissionRate = 0): ReadinessInput {
  const perDomain = 25;
  const omitted = Math.round(perDomain * omissionRate);
  const answered = perDomain - omitted;
  const byDomain = new Map(
    config.domains.map((d) => [d.slug, { correct: Math.round(answered * accuracy), answered, omitted }]),
  );
  return { config, performance: [], byDomain, targetScore: target, recentSessions: [], timing: NO_TIMES };
}

describe('readiness for the TIL-I, which publishes its thresholds', () => {
  const TIL_I = requireExamConfig('polito-til-i');

  it('works on the reported scale out of 100 and compares with both published thresholds', () => {
    // 80% on attempted, none blank: raw = 42 x (0.8 - 0.2 x 0.25) = 31.5 of 42, which is 75 of 100.
    const projection = assessReadiness(readinessFor(TIL_I, 0.8, 65)).target!.projection!;
    expect(projection.projectedRaw).toBe(75);
    expect(projection.maxRaw).toBe(100);
    expect(projection.meetsTarget).toBe(true);
    expect(projection.scoreLabel).toBe('Projected score (TIL-I score out of 100)');
    expect(projection.thresholds).toEqual([
      expect.objectContaining({ label: 'Ranking threshold', value: 30, met: true }),
      expect.objectContaining({ label: 'Guarantee threshold', value: 60, met: true }),
    ]);
  });

  it('says plainly when the projection falls below the ranking threshold', () => {
    // 40%: raw = 42 x (0.4 - 0.6 x 0.25) = 10.5 of 42, which is 25 of 100.
    const projection = assessReadiness(readinessFor(TIL_I, 0.4, 60)).target!.projection!;
    expect(projection.projectedRaw).toBe(25);
    expect(projection.thresholds!.map((t) => t.met)).toEqual([false, false]);
  });

  it('names PoliTo, the TIL-I conditions and its own caveats, not Bocconi’s', () => {
    const projection = assessReadiness(readinessFor(TIL_I, 0.7, 60)).target!.projection!;
    expect(projection.method).toContain('Politecnico di Torino');
    expect(projection.method).not.toContain('Bocconi');
    expect(projection.assumptions.join(' ')).toContain('90 minutes');
    expect(projection.assumptions.join(' ')).not.toMatch(/75 minutes|critical-thinking/);
  });
});

describe('readiness for exams with no single pass mark', () => {
  it.each([
    ['tolc-e', 36, /each university/i],
    ['tolc-f', 50, /each university/i],
    ['polito-til-a', 50, /ranked by score/i],
  ])('%s quantifies the score but says why there is no pass mark', (examKey, max, reason) => {
    const projection = assessReadiness(readinessFor(requireExamConfig(examKey), 0.7, max / 2)).target!.projection!;
    expect(projection.maxRaw).toBe(max);
    expect(projection.thresholds).toEqual([]);
    expect(projection.noThresholdReason).toMatch(reason);
    expect(projection.scoreLabel).toBe('Projected raw score');
  });
});
