import { createElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  OFFICIAL_SCORE_EXAMS,
  OfficialScoreError,
  buildHistory,
  createOfficialScore,
  deleteOfficialScore,
  getOfficialScore,
  listOfficialScores,
  officialScoreInputSchema,
  totalFromSections,
  scoreVersion,
  updateOfficialScore,
  validateOfficialScore,
  type OfficialScoreInput,
  type OfficialScoreRecord,
} from '@/lib/learning/official-scores';
import { getExamConfig } from '@/lib/exams/registry';
import { createTestDb, createUser } from './helpers/test-db';
import { withIntl } from './helpers/intl';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) => createElement('a', { href, ...rest }, children),
  useRouter: () => ({ refresh() {}, push() {} }),
}));

/**
 * Official practice results are the learner's own statements: checked against
 * the published scale, compared only like with like, never converted or
 * predicted, and visible to their owner only.
 */

const TODAY = new Date('2026-10-28T12:00:00Z');

function input(overrides: Partial<OfficialScoreInput> = {}): OfficialScoreInput {
  return officialScoreInputSchema.parse({
    examKey: 'digital-sat',
    scaleKey: 'digital-sat',
    providerKey: 'college-board-bluebook',
    testName: 'Practice Test 4',
    takenOn: '2026-10-20',
    overallScore: 1350,
    sectionScores: { 'reading-writing': 680, math: 670 },
    notes: '',
    ...overrides,
  });
}

function errorOf(fn: () => unknown): { code: string; field?: string } | null {
  try {
    fn();
    return null;
  } catch (error) {
    if (error instanceof OfficialScoreError) return { code: error.code, field: error.detail?.field };
    throw error;
  }
}

describe('the encoded scales', () => {
  it('cover only live exams, with a provider and a version each', () => {
    for (const exam of OFFICIAL_SCORE_EXAMS) {
      expect(getExamConfig(exam.examKey), exam.examKey).toBeDefined();
      expect(exam.providers.length).toBeGreaterThan(0);
      expect(exam.versions.length).toBeGreaterThan(0);
      for (const version of exam.versions) expect(version.sources.length).toBeGreaterThan(0);
    }
    // No verified official practice test: not offered rather than guessed.
    expect(OFFICIAL_SCORE_EXAMS.some((e) => e.examKey === 'bocconi-graduate')).toBe(false);
  });

  it('never records an essay score', () => {
    for (const exam of OFFICIAL_SCORE_EXAMS) {
      for (const version of exam.versions) {
        // SAT "Reading and Writing" is a multiple-choice section, not an essay.
        expect(version.sections.some((s) => /^(writing|analytical-writing|argumentative-writing)$|essay/i.test(s.key))).toBe(false);
      }
    }
  });
});

describe('validation against the published scale', () => {
  it('accepts a valid SAT result and checks the published sum', () => {
    expect(errorOf(() => validateOfficialScore(input(), TODAY))).toBeNull();
    expect(errorOf(() => validateOfficialScore(input({ overallScore: 1360 }), TODAY))).toEqual({ code: 'total-mismatch', field: 'overallScore' });
  });

  it('rejects values off the range or the step', () => {
    expect(errorOf(() => validateOfficialScore(input({ overallScore: 1355, sectionScores: {} }), TODAY))?.code).toBe('off-scale');
    expect(errorOf(() => validateOfficialScore(input({ overallScore: 1650, sectionScores: {} }), TODAY))?.code).toBe('off-scale');
    expect(errorOf(() => validateOfficialScore(input({ overallScore: null, sectionScores: { math: 150 } }), TODAY))).toEqual({
      code: 'off-scale',
      field: 'section:math',
    });
    const gmat = { examKey: 'gmat', scaleKey: 'gmat-focus', providerKey: 'gmac-official-practice-exam', sectionScores: {} };
    expect(errorOf(() => validateOfficialScore(input({ ...gmat, overallScore: 600 }), TODAY))?.code).toBe('off-scale');
    expect(errorOf(() => validateOfficialScore(input({ ...gmat, overallScore: 605 }), TODAY))).toBeNull();
    const bocconi = { examKey: 'bocconi-undergraduate', scaleKey: 'bocconi-online-test-standard', providerKey: 'bocconi-online-simulation', sectionScores: {} };
    expect(errorOf(() => validateOfficialScore(input({ ...bocconi, overallScore: 37.67 }), TODAY))).toBeNull();
    expect(errorOf(() => validateOfficialScore(input({ ...bocconi, overallScore: -3.4 }), TODAY))).toBeNull();
    expect(errorOf(() => validateOfficialScore(input({ ...bocconi, overallScore: 50.5 }), TODAY))?.code).toBe('off-scale');
    const tolc = { examKey: 'tolc-e', scaleKey: 'tolc-e', providerKey: 'cisia-simulation', overallScore: null };
    expect(errorOf(() => validateOfficialScore(input({ ...tolc, sectionScores: { english: 31 } }), TODAY))?.code).toBe('off-scale');
    expect(errorOf(() => validateOfficialScore(input({ ...tolc, sectionScores: { logic: 9.75 } }), TODAY))).toBeNull();
  });

  it('applies the ACT Composite rule only where it is published, rounding half up', () => {
    const enhanced = scoreVersion('act-enhanced')!;
    const legacy = scoreVersion('act-legacy')!;
    expect(totalFromSections(enhanced, { english: 25, math: 26, reading: 26 })).toBe(26);
    expect(totalFromSections(enhanced, { english: 25, math: 26, reading: 26, science: 10 })).toBe(26);
    expect(totalFromSections(legacy, { english: 25, math: 25, reading: 26, science: 26 })).toBe(26);
    expect(totalFromSections(legacy, { english: 25, math: 25, reading: 25, science: 26 })).toBe(25);
    const act = { examKey: 'enhanced-act', scaleKey: 'act-enhanced', providerKey: 'act-official-practice' };
    expect(errorOf(() => validateOfficialScore(input({ ...act, overallScore: 25, sectionScores: { english: 25, math: 26, reading: 26 } }), TODAY))?.code).toBe(
      'total-mismatch',
    );
  });

  it('never works out a total from missing sections, or where the rule is unpublished', () => {
    expect(totalFromSections(scoreVersion('digital-sat')!, { math: 700 })).toBeNull();
    expect(totalFromSections(scoreVersion('gmat-focus')!, { quantitative: 80, verbal: 80, 'data-insights': 80 })).toBeNull();
    // A section alone is a valid entry, and the overall stays blank: nothing is filled in.
    expect(errorOf(() => validateOfficialScore(input({ overallScore: null, sectionScores: { math: 700 } }), TODAY))).toBeNull();
    // An overall with only one section cannot be checked, so it is taken as entered.
    expect(errorOf(() => validateOfficialScore(input({ overallScore: 1400, sectionScores: { math: 700 } }), TODAY))).toBeNull();
  });

  it('refuses an overall score where the exam reports none, and an entry with no score', () => {
    const gre = { examKey: 'gre', scaleKey: 'gre-general', providerKey: 'ets-powerprep' };
    expect(errorOf(() => validateOfficialScore(input({ ...gre, overallScore: 320, sectionScores: {} }), TODAY))?.code).toBe('no-overall');
    expect(errorOf(() => validateOfficialScore(input({ ...gre, overallScore: null, sectionScores: { verbal: 158 } }), TODAY))).toBeNull();
    expect(errorOf(() => validateOfficialScore(input({ overallScore: null, sectionScores: {} }), TODAY))?.code).toBe('no-score');
  });

  it('checks the exam, version, provider and date', () => {
    expect(errorOf(() => validateOfficialScore(input({ examKey: 'bocconi-graduate' }), TODAY))?.code).toBe('unsupported-exam');
    expect(errorOf(() => validateOfficialScore(input({ scaleKey: 'act-enhanced' }), TODAY))?.code).toBe('unknown-scale');
    expect(errorOf(() => validateOfficialScore(input({ providerKey: 'ets-powerprep' }), TODAY))?.code).toBe('unknown-provider');
    expect(errorOf(() => validateOfficialScore(input({ takenOn: '2026-02-30' }), TODAY))?.code).toBe('invalid-date');
    expect(errorOf(() => validateOfficialScore(input({ takenOn: '2026-11-15' }), TODAY))?.code).toBe('future-date');
    expect(errorOf(() => validateOfficialScore(input({ sectionScores: { writing: 8 } }), TODAY))?.code).toBe('unknown-section');
  });
});

describe('storage belongs to its owner', () => {
  it('creates, edits and deletes a learner’s own result, and nobody else’s', async () => {
    const db = await createTestDb();
    const owner = await createUser(db);
    const other = await createUser(db);

    const created = await createOfficialScore(db, owner, input(), TODAY);
    expect((await listOfficialScores(db, owner)).map((r) => r.id)).toEqual([created.id]);
    expect(created.sectionScores).toEqual({ 'reading-writing': 680, math: 670 });

    // Another learner sees nothing and changes nothing; their attempts look like a missing record.
    expect(await listOfficialScores(db, other)).toEqual([]);
    expect(await getOfficialScore(db, other, created.id)).toBeNull();
    await expect(updateOfficialScore(db, other, created.id, input({ overallScore: 1400, sectionScores: {} }), TODAY)).rejects.toMatchObject({ code: 'not-found', status: 404 });
    await expect(deleteOfficialScore(db, other, created.id)).rejects.toMatchObject({ code: 'not-found' });
    expect((await getOfficialScore(db, owner, created.id))?.overallScore).toBe(1350);

    const edited = await updateOfficialScore(db, owner, created.id, input({ overallScore: 1400, sectionScores: { 'reading-writing': 700, math: 700 } }), TODAY);
    expect(edited.overallScore).toBe(1400);
    await expect(updateOfficialScore(db, owner, created.id, input({ overallScore: 1401 }), TODAY)).rejects.toBeInstanceOf(OfficialScoreError);

    await deleteOfficialScore(db, owner, created.id);
    expect(await listOfficialScores(db, owner)).toEqual([]);
  });

  it('goes with the account when the account is deleted', async () => {
    const db = await createTestDb();
    const owner = await createUser(db);
    await createOfficialScore(db, owner, input(), TODAY);
    await db.prepare('DELETE FROM users WHERE id = ?').run(owner);
    expect(((await db.prepare('SELECT COUNT(*) AS n FROM official_practice_scores').get()) as { n: number }).n).toBe(0);
  });
});

function record(overrides: Partial<OfficialScoreRecord>): OfficialScoreRecord {
  return {
    id: Math.random().toString(36).slice(2),
    examKey: 'enhanced-act',
    scaleKey: 'act-enhanced',
    providerKey: 'act-official-practice',
    testName: 'Practice Test 1',
    takenOn: '2026-09-01',
    overallScore: 24,
    sectionScores: {},
    notes: null,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
    ...overrides,
  };
}

describe('history', () => {
  it('compares only results on the same scale and version, and with the target only on its scale', () => {
    const history = buildHistory(
      'enhanced-act',
      [
        record({ id: 'a', takenOn: '2026-09-01', overallScore: 24, sectionScores: { math: 24 } }),
        record({ id: 'b', takenOn: '2026-09-15', scaleKey: 'act-legacy', testName: 'Old form 3', overallScore: 27 }),
        record({ id: 'c', takenOn: '2026-10-01', testName: 'Practice Test 2', overallScore: 26, sectionScores: { math: 27 } }),
      ],
      28,
    );
    const [a, b, c] = history.entries;
    expect(a.previous).toBeNull();
    expect(b.previous).toBeNull(); // the legacy result is not compared with the enhanced one before it
    expect(c.previous?.id).toBe('a'); // ...nor the next enhanced result with it
    expect(c.overallChange).toBe(2);
    expect(c.sectionChanges).toEqual([{ key: 'math', change: 3 }]);
    expect(history.latest?.id).toBe('c');
    expect(history.targetDifference).toBe(-2);
    expect(history.targetNotComparable).toBe(false);

    const legacyLatest = buildHistory('enhanced-act', [record({ scaleKey: 'act-legacy', overallScore: 30 })], 28);
    expect(legacyLatest.targetDifference).toBeNull();
    expect(legacyLatest.targetNotComparable).toBe(true);

    const gre = buildHistory('gre', [record({ examKey: 'gre', scaleKey: 'gre-general', providerKey: 'ets-powerprep', overallScore: null, sectionScores: { verbal: 160 } })], 160);
    expect(gre.targetDifference).toBeNull();
  });

  it('marks a repeat sitting of the same practice test', () => {
    const history = buildHistory(
      'enhanced-act',
      [
        record({ id: 'first', testName: 'Practice Test 1', takenOn: '2026-08-01' }),
        record({ id: 'other', testName: 'Practice Test 2', takenOn: '2026-08-15' }),
        record({ id: 'again', testName: 'practice test #1', takenOn: '2026-09-01' }),
      ],
      null,
    );
    expect(history.entries.map((e) => [e.id, e.sittingOfTest])).toEqual([
      ['first', 1],
      ['other', 1],
      ['again', 2],
    ]);
  });
});

describe('display', () => {
  it('labels every result as unverified and keeps it apart from measured performance', async () => {
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { LatestOfficialResult, OfficialScoreHistoryTables, OfficialScoresSummaryCard } = await import('@/components/official-scores/score-history');
    const history = buildHistory(
      'digital-sat',
      [
        record({ id: 'one', examKey: 'digital-sat', scaleKey: 'digital-sat', providerKey: 'college-board-bluebook', testName: 'Practice Test 4', takenOn: '2026-09-01', overallScore: 1300 }),
        record({ id: 'two', examKey: 'digital-sat', scaleKey: 'digital-sat', providerKey: 'college-board-bluebook', testName: 'Practice Test 4', takenOn: '2026-10-01', overallScore: 1380 }),
      ],
      1400,
    );
    const latest = renderToStaticMarkup(withIntl(createElement(LatestOfficialResult, { history, examName: 'SAT' })));
    expect(latest).toContain('User-entered official practice result — not independently verified.');
    expect(latest).toContain('20 below your target');
    expect(latest).toContain('sitting 2 of this practice test');

    const tables = renderToStaticMarkup(withIntl(createElement(OfficialScoreHistoryTables, { history, examKey: 'digital-sat' })));
    expect(tables).toContain('+80 since');
    expect(tables).toContain('Sitting 2 of this test');
    expect(tables).toContain('edit=one');

    const summary = renderToStaticMarkup(withIntl(createElement(OfficialScoresSummaryCard, { history, examKey: 'digital-sat', examName: 'SAT' })));
    expect(summary).toContain('not independently verified');
    expect(summary).toContain('never inside, what UniExamer measured');
  });
});
