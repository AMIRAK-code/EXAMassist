import { describe, expect, it } from 'vitest';
import { examConfigSchema } from '@/lib/assessment/types';
import { assessReadiness, type ReadinessInput } from '@/lib/learning/readiness';
import { english, englishList } from './helpers/intl';
import {
  DRAFT_EXAM_CONFIGS,
  DRAFT_EXAM_HUBS,
  EXAM_CONFIGS,
  getDraftExamConfig,
  getExamConfig,
  getHub,
  listHubs,
} from '@/lib/exams/registry';

/**
 * Draft configs exist so content can be authored before an exam's facts are
 * verified. The one thing that must never happen is a draft reaching a
 * learner: these tests hold that line.
 */

describe('draft exam configs', () => {
  it('parse against the exam config schema', () => {
    for (const config of DRAFT_EXAM_CONFIGS) {
      expect(() => examConfigSchema.parse(config), config.examKey).not.toThrow();
    }
  });

  it('are never served: absent from the live registry and its hubs', () => {
    for (const config of DRAFT_EXAM_CONFIGS) {
      expect(getExamConfig(config.examKey), config.examKey).toBeUndefined();
      expect(EXAM_CONFIGS.some((c) => c.examKey === config.examKey)).toBe(false);
      expect(getDraftExamConfig(config.examKey)).toBe(config);
    }
    for (const hub of DRAFT_EXAM_HUBS) {
      expect(getHub(hub.slug)).toBeUndefined();
      expect(listHubs().some((h) => h.slug === hub.slug)).toBe(false);
    }
  });

  it('do not claim a verification date they do not have', () => {
    for (const config of DRAFT_EXAM_CONFIGS) {
      expect(config.verifiedOn, config.examKey).toBe('not yet verified');
      for (const source of config.sources) expect(source.verifiedOn).toBe('not yet verified');
      expect(config.unverified.length).toBeGreaterThan(0);
    }
  });

  it('keep every taxonomy reference inside the config', () => {
    for (const config of DRAFT_EXAM_CONFIGS) {
      const sections = new Set(config.sections.map((s) => s.key));
      const domains = new Set(config.domains.map((d) => d.slug));
      for (const domain of config.domains) expect(sections.has(domain.sectionKey), domain.slug).toBe(true);
      for (const blueprint of config.blueprints) {
        for (const part of blueprint.parts) {
          if (part.selection.sectionKey !== '*') expect(sections.has(part.selection.sectionKey), part.key).toBe(true);
          for (const slug of part.selection.domains) expect(domains.has(slug), slug).toBe(true);
        }
      }
    }
  });

  it('give the SAA hub only routes that point at real configs or at none', () => {
    const saa = DRAFT_EXAM_HUBS.find((h) => h.slug === 'saa-turin')!;
    expect(saa.configKeys).toEqual(['tolc-e']);
    for (const route of saa.otherRoutes ?? []) {
      if (route.configKey !== null) expect(getExamConfig(route.configKey), route.programme).toBeDefined();
    }
  });
});

describe('readiness on a published raw-scoring rule', () => {
  const NO_TIMES = { timesMs: [], inUntimed: 0, missing: 0 };

  const inputFor = (examKey: string, accuracy: number, omissionRate: number, target: number): ReadinessInput => {
    const config = (getExamConfig(examKey) ?? getDraftExamConfig(examKey))!;
    const perDomain = 40;
    const omitted = Math.round(perDomain * omissionRate);
    const answered = perDomain - omitted;
    const byDomain = new Map(
      config.domains.map((d) => [d.slug, { correct: Math.round(answered * accuracy), answered, omitted }]),
    );
    return { config, performance: [], byDomain, targetScore: target, recentSessions: [], timing: NO_TIMES };
  };

  it('applies +1 / 0 / -0.25 to the 36-question TOLC-E form', () => {
    // 36 items, 75% correct, nothing blank: 27 correct, 9 wrong -> 27 - 2.25 = 24.75.
    const projection = assessReadiness(inputFor('tolc-e', 0.75, 0, 20)).target!.projection!;
    expect(projection.maxRaw).toBe(36);
    expect(projection.projectedRaw).toBeCloseTo(24.8, 1);
    expect(projection.meetsTarget).toBe(true);
    expect(english(projection.scoreLabel!)).toBe('Projected raw score');
  });

  it('says there is no national pass mark rather than inventing one', () => {
    const projection = assessReadiness(inputFor('tolc-e', 0.5, 0, 20)).target!.projection!;
    expect(projection.thresholds).toEqual([]);
    expect(projection.noThresholdReason).toContain('no pass mark');
  });

  it('converts to the reported scale and checks each published threshold', () => {
    // TIL-I: 42 items, 50% correct: 21 - 21 x 0.25 = 15.75 raw, x 100/42 = 37.5.
    const projection = assessReadiness(inputFor('polito-til-i', 0.5, 0, 60)).target!.projection!;
    expect(projection.maxRaw).toBe(100);
    expect(projection.projectedRaw).toBeCloseTo(37.5, 1);
    expect(english(projection.scoreLabel!)).toContain('out of 100');
    const met = Object.fromEntries(projection.thresholds!.map((t) => [t.value, t.met]));
    expect(met).toEqual({ 30: true, 60: false });
    expect(projection.meetsTarget).toBe(false);
  });

  it('keeps the standard caveats and adds the exam’s own', () => {
    const projection = assessReadiness(inputFor('tolc-e', 0.6, 0.2, 20)).target!.projection!;
    const text = englishList(projection.assumptions);
    expect(text).toContain('editorial judgement');
    expect(text).toContain('English section');
    expect(english(projection.method)).toContain('CISIA');
  });
});
