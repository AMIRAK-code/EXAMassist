import { describe, expect, it } from 'vitest';
import { examConfigSchema } from '@/lib/assessment/types';
import { scoreAttempt, scoreResponse, type ScoredItem } from '@/lib/assessment/score';
import { assessReadiness, examPaceSeconds, type ReadinessInput } from '@/lib/learning/readiness';
import {
  EXAM_HUBS,
  getConfigsForHub,
  getExamConfig,
  getHub,
  getHubForConfig,
  listHubs,
  requireExamConfig,
} from '@/lib/exams/registry';
import examsMessages from '../../messages/en/exams.json';
import { english, englishList } from './helpers/intl';

/**
 * Bocconi admission is two tracks with different tests. The bachelor and law
 * forms of the Online Bocconi test live on one hub, the graduate form on
 * another, and the graduate config must carry only what was verified for it.
 */

const GRAD = requireExamConfig('bocconi-graduate');
const UG = requireExamConfig('bocconi-undergraduate');
const NO_TIMES = { timesMs: [], inUntimed: 0, missing: 0 };

describe('the two Bocconi hubs', () => {
  it('keeps the bachelor and law forms on the original slug, renamed', () => {
    const bachelor = getHub('bocconi-online-test')!;
    expect(bachelor).toBeDefined();
    expect(bachelor.name).toMatch(/Bachelor/);
    expect(bachelor.configKeys).toEqual(['bocconi-undergraduate', 'bocconi-law']);
    expect(bachelor.audiences).toEqual(['undergraduate', 'law']);
  });

  it('serves the graduate form from its own master’s hub', () => {
    const master = getHub('bocconi-master')!;
    expect(master).toBeDefined();
    expect(master.name).toMatch(/Master/);
    expect(master.audiences).toEqual(['graduate']);
    expect(master.configKeys).toEqual(['bocconi-graduate']);
    expect(getHubForConfig('bocconi-graduate')?.slug).toBe('bocconi-master');
    expect(getConfigsForHub('bocconi-master').map((c) => c.examKey)).toEqual(['bocconi-graduate']);
  });

  it('never mixes the graduate form with a bachelor or law form on one hub', () => {
    for (const hub of listHubs()) {
      const audiences = new Set(hub.configKeys.flatMap((key) => requireExamConfig(key).audience));
      if (audiences.has('graduate')) expect([...audiences], hub.slug).toEqual(['graduate']);
    }
  });

  it('lists both hubs publicly, with distinct selector labels', () => {
    const slugs = listHubs().map((h) => h.slug);
    expect(slugs).toContain('bocconi-online-test');
    expect(slugs).toContain('bocconi-master');
    const labels = listHubs().map((h) => h.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('points every other route at a real config, or at none, and never at its own config', () => {
    for (const hub of EXAM_HUBS) {
      for (const route of hub.otherRoutes ?? []) {
        if (route.configKey === null) continue;
        expect(getExamConfig(route.configKey), `${hub.slug} -> ${route.configKey}`).toBeDefined();
        expect(getHubForConfig(route.configKey), route.configKey).toBeDefined();
        expect(hub.configKeys).not.toContain(route.configKey);
      }
    }
  });

  it('sends master’s applicants to the GMAT and GRE with the verified notes only', () => {
    const routes = getHub('bocconi-master')!.otherRoutes ?? [];
    const gmat = routes.find((r) => r.configKey === 'gmat')!;
    const gre = routes.find((r) => r.configKey === 'gre')!;
    expect(gmat.audience).toBe('graduate');
    expect(gmat.note).toContain('500 out of 800');
    expect(gmat.note).toContain('485 out of 805');
    expect(gmat.note).toContain('five years');
    expect(gre.note).toContain('at Home');
    expect(gre.note).toContain('five years');
    // The GRE threshold is unverified: no score may be stated for it.
    expect(gre.note).not.toMatch(/\b1[3-7]\d\b|\b3[0-4]\d\b/);
  });

  it('labels each route’s audience in the exams catalogue', () => {
    const audience: Record<string, string> = examsMessages.audience;
    for (const hub of EXAM_HUBS) {
      for (const route of hub.otherRoutes ?? []) {
        expect(audience[route.audience]).toBeTruthy();
      }
    }
  });
});

describe('the graduate config', () => {
  it('parses, and carries the verified structure', () => {
    expect(() => examConfigSchema.parse(GRAD)).not.toThrow();
    expect(GRAD.audience).toEqual(['graduate']);
    expect(GRAD.sections).toHaveLength(1);
    expect(GRAD.sections[0].officialTimeMinutes).toBe(75);
    expect(GRAD.sections[0].officialQuestionCount).toMatch(/^50 /);
    const shares = Object.fromEntries(GRAD.domains.map((d) => [d.name, Number.parseInt(d.officialShare!, 10)]));
    expect(shares).toEqual({ 'Verbal reasoning': 24, 'Data insight': 16, 'Quantitative reasoning': 10 });
    expect(GRAD.sources[0].url).toContain('online-bocconi-test-international-graduate-applicants');
  });

  it('does not copy the bachelor test’s unverified-for-graduate rules', () => {
    const section = GRAD.sections[0];
    // No forward-only paging presented as the exam's rule.
    expect(section.navigation.source).toBe('unverified');
    expect(section.navigation.pageSize ?? null).toBeNull();
    // No calculator rule presented as fact.
    expect(section.calculator).toBe('unverified');
    // No simulation without a verified navigation rule.
    expect(GRAD.capabilities.fullSimulation.available).toBe(false);
    expect(GRAD.blueprints.some((b) => b.mode === 'simulation')).toBe(false);
    expect(GRAD.blueprints.some((b) => b.fidelity === 'exam_accurate')).toBe(false);
    // Each gap is disclosed.
    const unverified = GRAD.unverified.join(' ');
    for (const gap of ['Navigation', 'answer options', '-0.33', 'Calculator', 'per area']) {
      expect(unverified.toLowerCase()).toContain(gap.toLowerCase());
    }
  });

  it('works at the published pace of 90 seconds a question', () => {
    expect(examPaceSeconds(GRAD)).toBe(90);
  });
});

describe('graduate scoring: +1 / 0 / -0.25', () => {
  const key = { type: 'single_select' as const, optionId: 'a' };

  it('scores a wrong answer at -0.25, not the bachelor test’s -0.2', () => {
    expect(GRAD.scoring.pointsIncorrect).toBe(-0.25);
    expect(UG.scoring.pointsIncorrect).toBe(-0.2);
    expect(scoreResponse(key, { type: 'single_select', optionId: 'b' }, GRAD.scoring)).toEqual({
      status: 'incorrect',
      points: -0.25,
      pointsPossible: 1,
    });
  });

  it('scores a blank at 0 and a correct answer at +1', () => {
    expect(scoreResponse(key, null, GRAD.scoring).points).toBe(0);
    expect(scoreResponse(key, { type: 'single_select', optionId: 'a' }, GRAD.scoring).points).toBe(1);
  });

  it('totals a mixed attempt with the penalty applied only to wrong answers', () => {
    // 30 correct, 12 wrong, 8 blank: 30 - 3 = 27.
    const outcome = (optionId: string | null) =>
      scoreResponse(key, optionId === null ? null : { type: 'single_select', optionId }, GRAD.scoring);
    const items: ScoredItem[] = [
      ...Array.from({ length: 30 }, () => outcome('a')),
      ...Array.from({ length: 12 }, () => outcome('b')),
      ...Array.from({ length: 8 }, () => outcome(null)),
    ].map((o) => ({ partIndex: 0, sectionKey: 'online-test', domainSlug: 'd', skillSlug: 's', outcome: o, timeMs: 0 }));
    const totals = scoreAttempt(items).totals;
    expect(totals.pointsEarned).toBe(27);
    expect(totals.omitted).toBe(8);
    expect(totals.incorrect).toBe(12);
  });
});

describe('graduate readiness against the published floor of 15', () => {
  const inputFor = (accuracy: number, omissionRate = 0, target = 30): ReadinessInput => {
    const perDomain = 40;
    const omitted = Math.round(perDomain * omissionRate);
    const answered = perDomain - omitted;
    return {
      config: GRAD,
      performance: [],
      byDomain: new Map(
        GRAD.domains.map((d) => [d.slug, { correct: Math.round(answered * accuracy), answered, omitted }]),
      ),
      targetScore: target,
      recentSessions: [],
      timing: NO_TIMES,
    };
  };

  it('reads the floor as 15, not the bachelor test’s 17', () => {
    const projection = assessReadiness(inputFor(0.8)).target!.projection!;
    expect(projection.officialFloor).toBe(15);
    const ug = assessReadiness({ ...inputFor(0.8), config: UG, byDomain: new Map(UG.domains.map((d) => [d.slug, { correct: 32, answered: 40, omitted: 0 }])) });
    expect(ug.target!.projection!.officialFloor).toBe(17);
  });

  it('projects with -0.25 and clears 15 where the bachelor floor would not be cleared', () => {
    // 50 items at 45%: 22.5 correct, 27.5 wrong -> 22.5 - 6.875 = 15.625.
    const projection = assessReadiness(inputFor(0.45)).target!.projection!;
    expect(projection.maxRaw).toBe(50);
    expect(projection.projectedRaw).toBeCloseTo(15.6, 1);
    expect(projection.meetsOfficialFloor).toBe(true);
    expect(projection.projectedRaw).toBeLessThan(17);
  });

  it('flags a projection under 15', () => {
    // 50 items at 40%: 20 - 30 x 0.25 = 12.5.
    const projection = assessReadiness(inputFor(0.4)).target!.projection!;
    expect(projection.projectedRaw).toBeCloseTo(12.5, 1);
    expect(projection.meetsOfficialFloor).toBe(false);
  });

  it('assumes only the conditions verified for the graduate form', () => {
    const grad = assessReadiness(inputFor(0.6)).target!.projection!;
    const gradText = englishList(grad.assumptions);
    expect(gradText).toContain('75 minutes');
    expect(gradText).not.toContain('no calculator');
    expect(gradText).not.toContain('no going back');
    expect(gradText).toContain('-0.25');
    expect(english(grad.method)).toContain('-0.25 wrong');

    const ug = assessReadiness({ ...inputFor(0.6), config: UG, byDomain: new Map(UG.domains.map((d) => [d.slug, { correct: 24, answered: 40, omitted: 0 }])) });
    const ugText = englishList(ug.target!.projection!.assumptions);
    expect(ugText).toContain('no calculator, 75 minutes, no going back');
  });
});
