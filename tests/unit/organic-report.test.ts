import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import { countEvent } from '@/lib/analytics/funnel';
import { comparableWindows, formatOrganicReport, organicReport } from '@/lib/analytics/organic-report';
import { recordResponse, startAttempt, submitAttempt } from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

let db: Db;
beforeEach(async () => {
  db = await createTestDb();
});

describe('the 28-day organic report', () => {
  it('compares 28 days with the 28 before, without overlap or gap', () => {
    expect(comparableWindows('2026-11-30')).toEqual({
      current: { from: '2026-11-03', to: '2026-11-30' },
      previous: { from: '2026-10-06', to: '2026-11-02' },
    });
  });

  it('keeps clicks into practice, by source, apart from completed sessions', async () => {
    const config = requireExamConfig('tolc-e');
    await seedQuestions(db, config, { perDomain: 6 });
    const today = new Date().toISOString().slice(0, 10);
    await countEvent(db, 'landing_view', 'cisia-tolc', 'search');
    await countEvent(db, 'landing_view', 'cisia-tolc', 'search');
    await countEvent(db, 'landing_view', 'cisia-tolc', 'direct');
    await countEvent(db, 'practice_click', 'cisia-tolc', 'search');
    await countEvent(db, 'guide_view', 'bocconi-test-preparation-plan', 'search');
    await countEvent(db, 'pricing_view', 'tolc-e'); // not part of this report

    const user = await createUser(db);
    const done = await startAttempt(db, { userId: user, examKey: 'tolc-e', blueprintId: 'practice' });
    await recordResponse(db, { attemptId: done.attemptId, userId: user, partIndex: 0, position: 0, response: { type: 'single_select', optionId: 'a' } });
    await submitAttempt(db, { attemptId: done.attemptId, userId: user });
    await startAttempt(db, { userId: user, examKey: 'tolc-e', blueprintId: 'practice' });

    const window = { from: today, to: today };
    const report = await organicReport(db, window);
    const tolc = report.pages.find((p) => p.kind === 'exam' && p.slug === 'cisia-tolc')!;
    expect(tolc.views).toMatchObject({ search: 2, direct: 1 });
    expect(tolc.clicks).toMatchObject({ search: 1, direct: 0 });
    expect(report.pages.find((p) => p.slug === 'bocconi-test-preparation-plan')!.views.search).toBe(1);
    expect(report.sessions).toEqual([{ examKey: 'tolc-e', started: 2, completed: 1, completedByMode: { practice: 1 } }]);

    const empty = await organicReport(db, { from: '2020-01-01', to: '2020-01-28' });
    const text = formatOrganicReport(report, empty);
    expect(text).toContain('| /exams/cisia-tolc | 2 | +2 | 1 | +1 | 50.0% | 3 | 1 |');
    expect(text).toContain('| tolc-e | 2 | 1 | +1 | practice 1 |');
    expect(text).toContain('not attributable to search');
  });
});
