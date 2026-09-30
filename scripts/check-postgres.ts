import { loadEnvConfig } from '@next/env';
import assert from 'node:assert/strict';
import { getDb, closeDb } from '../src/lib/db';
import { createGuestUser, createSession, resolveSession, destroySession, toAuthUser } from '../src/lib/auth/session';
import { checkRateLimit } from '../src/lib/auth/rate-limit';
import { getCoverage, getPool } from '../src/lib/content/repository';
import { getAttemptState, startAttempt, recordResponse, submitAttempt, visitPosition, getResult } from '../src/lib/attempts/service';
import { buildDashboard } from '../src/lib/learning/dashboard';
import { buildNotebook } from '../src/lib/learning/notebook';
import { buildReadiness } from '../src/lib/learning/queries';
import { getResultsSummary, getReviewItem } from '../src/lib/learning/results';
import { createPlan, planSessions, skipSession, endPlan } from '../src/lib/learning/plan';
import { requireExamConfig } from '../src/lib/exams/registry';

loadEnvConfig(process.cwd(), true);
async function main() {
  const db = getDb();
  assert.equal(db.dialect, 'postgres', 'This check must use PostgreSQL.');
  const rollback = new Error('ROLLBACK_SMOKE_TEST');
  let testUser = '';
  try {
    await db.transaction(async () => {
      console.log('Checking sessions and rate limits');
      const user = await createGuestUser(db); testUser = user.id;
      const session = await createSession(db, user.id, true);
      assert.equal((await resolveSession(db, session.token))?.id, user.id);
      assert.equal((await checkRateLimit(db, 'signIn', user.id)).remaining, 9);
      assert.equal((await checkRateLimit(db, 'signIn', user.id)).remaining, 8);
      console.log('Checking content and practice lifecycle');
      assert.ok((await getCoverage(db)).length > 0);
      const config = requireExamConfig('digital-sat');
      assert.ok((await getPool(db, config.examKey, user.id)).length > 0);
      const { attemptId } = await startAttempt(db, { userId: user.id, examKey: config.examKey, blueprintId: 'practice' });
      const state = await getAttemptState(db, attemptId, user.id);
      assert.ok(state.parts[0].items.length > 0);
      const item = state.parts[0].items.find(i => i.question.responseType === 'single_select' && i.question.options.length > 0);
      assert.ok(item, 'Practice fixture needs a multiple-choice question');
      const response = { type: 'single_select' as const, optionId: item.question.options[0].id };
      await recordResponse(db, { attemptId, userId: user.id, partIndex: 0, position: item.position, response, clock: Date.now() });
      await visitPosition(db, { attemptId, userId: user.id, partIndex: 0, position: item.position, clock: Date.now() });
      await submitAttempt(db, { attemptId, userId: user.id });
      assert.ok(await getResult(db, attemptId, user.id));
      assert.ok(await getResultsSummary(db, attemptId, user.id));
      assert.ok(await getReviewItem(db, attemptId, user.id, 1));
      console.log('Checking dashboard, notebook, readiness and plans');
      await buildDashboard(db, toAuthUser(user), config.examKey);
      for (const view of ['due', 'later', 'all', 'bookmarked'] as const) await buildNotebook(db, user.id, view);
      await buildReadiness(db, user.id, config, null);
      const plan = await createPlan(db, { userId: user.id, examKey: config.examKey, weeklyMinutes: 120, examDate: null });
      const sessions = await planSessions(db, user.id, plan.id);
      assert.ok(sessions.length > 0);
      await skipSession(db, user.id, sessions[0].id);
      await endPlan(db, user.id, plan.id);
      await destroySession(db, session.token);
      assert.equal(await resolveSession(db, session.token), null);
      throw rollback;
    })();
  } catch (error) { if (error !== rollback) throw error; }
  assert.equal(await db.prepare('SELECT id FROM users WHERE id = ?').get(testUser), undefined);
  console.log('PostgreSQL application smoke test passed; test records rolled back.');
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; }).finally(closeDb);
