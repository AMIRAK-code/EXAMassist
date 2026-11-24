import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Db } from '@/lib/db';
import { requireExamConfig } from '@/lib/exams/registry';
import { createSession, type AuthUser } from '@/lib/auth/session';
import { confirmReviewer, grantReviewer } from '@/lib/content/human-review';
import { pendingQuestions } from '@/lib/content/review-batches';
import { RATE_LIMITS } from '@/lib/auth/rate-limit';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * The batch-review routes as a browser reaches them: the real session lookup,
 * the real same-origin check, the real rate limit, against a test database.
 * Only the cookie jar and the database handle are supplied by the test.
 */

const state: { db: Db | null; token: string | undefined } = { db: null, token: undefined };

vi.mock('@/lib/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/db')>();
  return { ...actual, getDb: () => state.db! };
});
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: (name: string) => (name === 'examer_session' && state.token ? { value: state.token } : undefined) }),
  headers: async () => new Headers(),
}));

const { POST: applyRoute } = await import('@/app/api/admin/review-batches/route');
const { POST: previewRoute } = await import('@/app/api/admin/review-batches/preview/route');
const { POST: exportRoute } = await import('@/app/api/admin/review-batches/export/route');
const { POST: withdrawRoute } = await import('@/app/api/admin/review-batches/[batchId]/withdraw/route');

const SAT = requireExamConfig('digital-sat');
const ORIGIN = 'http://localhost:3000';

function request(path: string, body: unknown, headers: Record<string, string> = { origin: ORIGIN }): Request {
  return new Request(`${ORIGIN}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', host: 'localhost:3000', ...headers },
    body: JSON.stringify(body),
  });
}

async function signIn(db: Db, role: AuthUser['role']): Promise<AuthUser> {
  const id = await createUser(db, { role });
  state.token = (await createSession(db, id)).token;
  return { id, email: `${id}@example.invalid`, displayName: null, role, isGuest: false, locale: 'en', targetExamKey: null, targetDate: null, weeklyMinutes: null, isMinor: false, emailVerifiedAt: null };
}

describe('batch review routes', () => {
  let db: Db;
  let reviewerId: string;
  let rows: Array<Record<string, unknown>>;

  beforeEach(async () => {
    db = await createTestDb();
    state.db = db;
    await seedQuestions(db, SAT, { perDomain: 1, humanApproved: false });
    const owner = await signIn(db, 'admin');
    const profId = await createUser(db);
    await grantReviewer(db, owner, {
      email: `${profId}@example.invalid`,
      publicName: 'Prof. Marco Neri',
      publicCredentials: 'Lecturer in mathematics, Politecnico di Torino',
      examKeys: [SAT.examKey],
      authorAliases: [],
    });
    await confirmReviewer(db, { ...owner, id: profId, role: 'learner' });
    reviewerId = profId;
    rows = (await pendingQuestions(db)).map((q, i) => ({
      line: i + 2, questionId: q.questionId, version: String(q.version), fingerprint: q.fingerprint, decision: 'approved',
    }));
    state.token = undefined;
  });
  afterEach(() => { state.db = null; state.token = undefined; });

  const body = () => ({
    reviewerUserId: reviewerId, rows, source: 'csv', sourceName: 'batch.csv', sourceSha256: null, reviewedOn: '2026-11-20', reviewerCheckedAll: true,
  });

  it('refuses anyone signed out, and every signed-in role but administrator', async () => {
    expect((await previewRoute(request('/api/admin/review-batches/preview', body()))).status).toBe(401);
    for (const role of ['learner', 'editor'] as const) {
      await signIn(db, role);
      expect((await previewRoute(request('/api/admin/review-batches/preview', body()))).status).toBe(403);
      expect((await applyRoute(request('/api/admin/review-batches', body()))).status).toBe(403);
      expect((await exportRoute(request('/api/admin/review-batches/export', {}))).status).toBe(403);
      const withdraw = await withdrawRoute(request('/api/admin/review-batches/x/withdraw', { reason: 'A long enough reason.' }), { params: Promise.resolve({ batchId: 'x' }) });
      expect(withdraw.status).toBe(403);
    }
    const reviews = (await db.prepare('SELECT COUNT(*) AS n FROM question_reviews').get()) as { n: number };
    expect(Number(reviews.n)).toBe(0);
  });

  it('refuses a cross-site request even from a signed-in administrator', async () => {
    await signIn(db, 'admin');
    expect((await applyRoute(request('/api/admin/review-batches', body(), { origin: 'https://evil.example' }))).status).toBe(403);
    expect((await applyRoute(request('/api/admin/review-batches', body(), {}))).status).toBe(403);
    // A same-origin fetch without an Origin header passes with the custom header.
    expect((await previewRoute(request('/api/admin/review-batches/preview', body(), { 'x-requested-with': 'examer' }))).status).toBe(200);
  });

  it('exports, dry-runs, records and withdraws for an administrator', async () => {
    await signIn(db, 'admin');
    const exported = await exportRoute(request('/api/admin/review-batches/export', {}));
    expect(exported.status).toBe(200);
    expect(exported.headers.get('content-type')).toContain('text/csv');
    expect(Number(exported.headers.get('x-export-count'))).toBe(rows.length);

    const preview = await previewRoute(request('/api/admin/review-batches/preview', body()));
    expect(((await preview.json()) as { plan: { willApprove: number } }).plan.willApprove).toBe(rows.length);

    const applied = await applyRoute(request('/api/admin/review-batches', body()));
    expect(applied.status).toBe(200);
    const { batch } = (await applied.json()) as { batch: { id: string; approvedCount: number } };
    expect(batch.approvedCount).toBe(rows.length);

    const withdrawn = await withdrawRoute(
      request(`/api/admin/review-batches/${batch.id}/withdraw`, { reason: 'Entered for the wrong reviewer.' }),
      { params: Promise.resolve({ batchId: batch.id }) },
    );
    expect(withdrawn.status).toBe(200);

    // A missing confirmation of the four checks is refused before anything is read.
    const unchecked = await applyRoute(request('/api/admin/review-batches', { ...body(), reviewerCheckedAll: false }));
    expect(unchecked.status).toBe(400);
  });

  it('rate-limits each administrator', async () => {
    await signIn(db, 'admin');
    const max = RATE_LIMITS.adminReviewBatch.max;
    for (let i = 0; i < max; i += 1) {
      expect((await previewRoute(request('/api/admin/review-batches/preview', body()))).status).toBe(200);
    }
    const limited = await previewRoute(request('/api/admin/review-batches/preview', body()));
    expect(limited.status).toBe(429);
    expect(((await limited.json()) as { error: { code: string } }).error.code).toBe('rate-limited');
  });
});
