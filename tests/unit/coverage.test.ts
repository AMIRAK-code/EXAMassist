import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ExamConfig } from '@/lib/assessment/types';
import { requireExamConfig } from '@/lib/exams/registry';
import { resolveParts } from '@/lib/attempts/service';
import { getBlueprint } from '@/lib/exams/registry';
import { getCandidates, getPool } from '@/lib/content/repository';
import {
  buildCoverageReport,
  buildDisjointSets,
  bucketOf,
  variantGroups,
  type CoverageItem,
} from '@/lib/content/coverage';
import { approveForTest, createTestDb, seedQuestions } from './helpers/test-db';

// Written for the rule while human approval is required (HUMAN_APPROVAL_REQUIRED=true);
// the default, where it is not, has its own test in human-review.test.ts.
beforeEach(() => { process.env.HUMAN_APPROVAL_REQUIRED = 'true'; });
afterEach(() => { delete process.env.HUMAN_APPROVAL_REQUIRED; });


/**
 * The coverage plan measures only what new sessions may use (published AND
 * human-approved), with the engine's own selection rules, and never counts a
 * shared passage or a near-duplicate twice across sets.
 */

const TOLC = requireExamConfig('tolc-e');
const GRE = requireExamConfig('gre');

let counter = 0;

/** A letters-only tag unique to each item, so no two synthetic stems share a word or a template. */
function tag(n: number): string {
  let out = '';
  for (let x = n + 26; x > 0; x = Math.floor(x / 26)) out += String.fromCharCode(97 + (x % 26));
  return out;
}

function item(config: ExamConfig, overrides: Partial<CoverageItem> & { domainIndex?: number } = {}): CoverageItem {
  const domain = config.domains[overrides.domainIndex ?? 0];
  counter += 1;
  return {
    questionVersionId: `v${counter}`,
    questionId: `q${counter}`,
    sectionKey: domain.sectionKey,
    domainSlug: domain.slug,
    skillSlug: domain.skills[counter % domain.skills.length].slug,
    responseType: 'single_select',
    difficulty: (['easy', 'medium', 'hard'] as const)[counter % 3],
    stimulusId: null,
    lastSeenAt: null,
    state: 'published',
    humanApproved: true,
    stemMd: ['river', 'lantern', 'harbour', 'meadow', 'compass', 'orchard', 'quarry', 'beacon'].map((w) => `${tag(counter)}${w}`).join(' '),
    ...overrides,
  };
}

/** A bank that fills every TOLC-E format several times over. */
function fullBank(config: ExamConfig, perDomain: number, overrides: Partial<CoverageItem> = {}): CoverageItem[] {
  return config.domains.flatMap((_, domainIndex) => Array.from({ length: perDomain }, () => item(config, { domainIndex, ...overrides })));
}

describe('what counts', () => {
  it('sorts items into approved, awaiting human review, automated review and out of service', () => {
    expect(bucketOf({ state: 'published', humanApproved: true })).toBe('approved');
    expect(bucketOf({ state: 'published', humanApproved: false })).toBe('awaiting-human-review');
    expect(bucketOf({ state: 'in_review', humanApproved: true })).toBe('in-automated-review');
    expect(bucketOf({ state: 'quarantined', humanApproved: true })).toBe('quarantined');
  });

  it('opens nothing from published questions that no human has approved, and says what approving them would supply', () => {
    const report = buildCoverageReport(TOLC, fullBank(TOLC, 40, { humanApproved: false }));
    expect(report.counts.approved).toBe(0);
    expect(report.counts['awaiting-human-review']).toBe(120);
    expect(report.blueprints.filter((b) => b.status === 'open')).toEqual([]);
    expect(report.blueprints.every((b) => b.shortfallIfPendingApproved === 0)).toBe(true);
    const blocking = report.needs.filter((n) => n.priority === 1);
    expect(blocking.length).toBeGreaterThan(0);
    // Everything blocking is already written and only waiting for a reviewer.
    expect(blocking.every((n) => n.toAuthor === 0 && n.coveredByPendingReview === n.needed)).toBe(true);
  });

  it('uses the same eligibility as the session pool', async () => {
    const db = await createTestDb();
    await seedQuestions(db, TOLC, { perDomain: 8, humanApproved: false });
    const candidates = await getCandidates(db, TOLC.examKey);
    for (const c of candidates.slice(0, 10)) await approveForTest(db, c.questionVersionId);
    const report = buildCoverageReport(TOLC, await getCandidates(db, TOLC.examKey));
    expect(report.counts.approved).toBe((await getPool(db, TOLC.examKey, null)).length);
    expect(report.counts.approved).toBe(10);
  });

  it('keeps public samples out of measured formats only', () => {
    const bank = fullBank(TOLC, 4);
    const withoutSamples = buildCoverageReport(TOLC, bank, { publicSampleIds: new Set() });
    const withSamples = buildCoverageReport(TOLC, bank, { publicSampleIds: new Set(bank.map((i) => i.questionId)) });
    const diagnostic = (r: typeof withSamples) => r.blueprints.find((b) => b.id === 'diagnostic')!;
    const practice = (r: typeof withSamples) => r.blueprints.find((b) => b.id === 'practice')!;
    expect(diagnostic(withoutSamples).shortfallNow).toBe(0);
    expect(diagnostic(withSamples).shortfallNow).toBe(diagnostic(withSamples).itemsPerSet);
    expect(practice(withSamples).shortfallNow).toBe(0);
  });
});

describe('non-overlapping sets', () => {
  const parts = resolveParts(getBlueprint(TOLC, 'practice')!, {}, TOLC).map((p) => ({ ...p, itemCount: 2 }));

  it('never lets two sets share a passage, so a passage’s spare questions do not make another set', () => {
    const passage = [item(TOLC, { stimulusId: 'passage-1' }), item(TOLC, { stimulusId: 'passage-1' }), item(TOLC, { stimulusId: 'passage-1' })];
    const singles = [item(TOLC)];
    const pool = [...passage, ...singles];
    const build = buildDisjointSets(pool, parts, 3, variantGroups(pool));
    const stimuliOf = (ids: string[]) => new Set(ids.map((id) => pool.find((i) => i.questionId === id)!.stimulusId).filter(Boolean));
    for (let a = 0; a < build.contents.length; a += 1) {
      for (let b = a + 1; b < build.contents.length; b += 1) {
        const shared = [...stimuliOf(build.contents[a])].filter((s) => stimuliOf(build.contents[b]).has(s));
        expect(shared).toEqual([]);
      }
    }
    // Four questions, but only one complete set of two: the passage cannot be split across sets.
    expect(build.complete).toBe(1);
    expect(build.deficits.get(parts[0].key)).toBeGreaterThanOrEqual(3);
  });

  it('fills sets from whole passages when they are enough', () => {
    const pool = [
      item(TOLC, { stimulusId: 'p1' }),
      item(TOLC, { stimulusId: 'p1' }),
      item(TOLC, { stimulusId: 'p2' }),
      item(TOLC, { stimulusId: 'p2' }),
    ];
    const build = buildDisjointSets(pool, parts, 3, variantGroups(pool));
    expect(build.complete).toBe(2);
  });

  it('counts near-duplicate variants of one question once', () => {
    const a = item(TOLC, { stemMd: 'Line r has equation 2x + y = 3. Line s passes through the point P(4, 1) and is perpendicular to r. At what value of x does s cross the x-axis?' });
    const b = item(TOLC, { stemMd: 'Line r has equation 5x + y = 7. Line s passes through the point P(2, 3) and is perpendicular to r. At what value of x does s cross the x-axis?' });
    const c = item(TOLC);
    const d = item(TOLC);
    const groups = variantGroups([a, b, c, d]);
    expect(groups.get(a.questionId)).toBe(groups.get(b.questionId));
    expect(groups.get(c.questionId)).not.toBe(groups.get(d.questionId));
    // Four items, but only three independent ones: one set of two, not two.
    expect(buildDisjointSets([a, b, c, d], parts, 3, groups).complete).toBe(1);
    expect(buildCoverageReport(TOLC, [a, b, c, d]).approvedIndependent).toBe(3);
  });

  it('does not treat a stock question over different passages as a variant', () => {
    const stem = 'Which choice best states the main idea of the text?';
    const x = item(TOLC, { stimulusId: 'p1', stemMd: stem });
    const y = item(TOLC, { stimulusId: 'p2', stemMd: stem });
    const groups = variantGroups([x, y]);
    expect(groups.get(x.questionId)).not.toBe(groups.get(y.questionId));
  });

  it('reports sets now against the planning target', () => {
    const report = buildCoverageReport(TOLC, fullBank(TOLC, 40));
    const timed = report.blueprints.find((b) => b.id === 'timed-logic')!;
    expect(timed.targetSets).toBe(3);
    expect(timed.disjointSetsNow).toBeGreaterThanOrEqual(3);
    expect(report.needs.filter((n) => n.priority === 2 && n.formats.includes('timed-logic'))).toEqual([]);
  });
});

describe('what the plan leaves alone', () => {
  it('marks essay formats out of scope and never plans essay content', () => {
    const report = buildCoverageReport(GRE, fullBank(GRE, 20));
    expect(report.blueprints.find((b) => b.id === 'timed-analytical-writing')?.status).toBe('essay-out-of-scope');
    expect(report.blueprints.find((b) => b.id === 'diagnostic')?.status).toBe('essay-out-of-scope');
    expect(report.needs.some((n) => n.formats.includes('timed-analytical-writing'))).toBe(false);
    expect(report.skills.some((s) => GRE.domains.find((d) => d.slug === s.domainSlug)?.sectionKey.includes('writing'))).toBe(false);
  });

  it('never opens a simulation whose rules are unverified, however much content exists', () => {
    const blocked: ExamConfig = { ...TOLC, capabilities: { ...TOLC.capabilities, fullSimulation: { available: false, reason: 'Timing rules unverified.' } } };
    const report = buildCoverageReport(blocked, fullBank(blocked, 60));
    const simulation = report.blueprints.find((b) => b.id === 'simulation-full')!;
    expect(simulation.status).toBe('rules-blocked');
    expect(simulation.rulesReason).toBe('Timing rules unverified.');
    expect(report.needs.some((n) => n.priority === 1 && n.formats.includes('simulation-full'))).toBe(false);
  });
});
