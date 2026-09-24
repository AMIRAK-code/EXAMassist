import { describe, expect, it } from 'vitest';
import { buildStudyPlan, type SkillPerformance } from '@/lib/learning/recommend';

/**
 * The study plan's session links. An untouched topic is a domain, and must be
 * linked as one: passed as ?skill= it matched no question, so every such
 * session failed to start.
 *
 * This covers the links only. Repetition across weeks, persistence and
 * missed-session recovery are separate, unresolved limitations.
 */

const weakSkill: SkillPerformance = {
  skillSlug: 'words-in-context',
  skillLabel: 'Words in Context',
  domainSlug: 'craft-and-structure',
  domainLabel: 'Craft and Structure',
  answered: 5,
  correct: 1,
  omitted: 0,
  accuracy: 0.2,
  medianTimeMs: 40_000,
  lastSeenAt: null,
  hasSignal: true,
};

describe('study plan session links', () => {
  it('links an untouched topic as a domain', () => {
    const plan = buildStudyPlan({
      examKey: 'digital-sat',
      examName: 'SAT',
      targetDate: null,
      weeklyMinutes: 50,
      performance: [],
      untouchedDomains: [{ slug: 'expression-of-ideas', name: 'Expression of Ideas', count: 5 }],
      now: new Date('2026-09-24T09:00:00Z'),
    });

    const hrefs = plan.weeks.flatMap((week) => week.sessions.map((s) => s.href));
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.every((href) => href === '/practice/digital-sat?domain=expression-of-ideas')).toBe(true);
    expect(hrefs.some((href) => href.includes('?skill=expression-of-ideas'))).toBe(false);
  });

  it('links a weak skill as a skill', () => {
    const plan = buildStudyPlan({
      examKey: 'digital-sat',
      examName: 'SAT',
      targetDate: null,
      weeklyMinutes: 50,
      performance: [weakSkill],
      untouchedDomains: [{ slug: 'expression-of-ideas', name: 'Expression of Ideas', count: 5 }],
      now: new Date('2026-09-24T09:00:00Z'),
    });

    const hrefs = new Set(plan.weeks.flatMap((week) => week.sessions.map((s) => s.href)));
    expect(hrefs).toContain('/practice/digital-sat?skill=words-in-context');
    expect(hrefs).toContain('/practice/digital-sat?domain=expression-of-ideas');
  });
});
