import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Db } from '@/lib/db';
import type { AuthUser } from '@/lib/auth/session';
import { requireExamConfig } from '@/lib/exams/registry';
import { countPublished } from '@/lib/content/repository';
import {
  ReviewError,
  confirmReviewer,
  grantReviewer,
  recordReview,
  recordReviewSchema,
  reviewHistory,
  standingApprovalFor,
} from '@/lib/content/human-review';
import {
  applyBatch,
  batchItems,
  exportForReview,
  listBatches,
  pendingQuestions,
  previewBatch,
  withdrawBatch,
  type BatchApplyInput,
} from '@/lib/content/review-batches';
import { mapColumns, parseCsv, rawDecisionRows, readDecisionRow, toCsv, type RawDecisionRow } from '@/lib/content/review-csv';
import { createTestDb, createUser, fingerprintVersion, seedQuestions } from './helpers/test-db';

/**
 * Approvals recorded in a batch on a reviewer's behalf. The reviewer of
 * record is always the reviewer who decided, the exact version and content
 * they saw is what gets approved, nothing they did not mark approved is
 * approved, and the administrator who entered it and the file it came from
 * are on record.
 */

beforeEach(() => { process.env.HUMAN_APPROVAL_REQUIRED = 'true'; });
afterEach(() => { delete process.env.HUMAN_APPROVAL_REQUIRED; });

const SAT = requireExamConfig('digital-sat');

async function account(db: Db, role: AuthUser['role'] = 'learner'): Promise<AuthUser> {
  const id = await createUser(db, { role });
  return {
    id,
    email: `${id}@example.invalid`,
    displayName: null,
    role,
    isGuest: false,
    locale: 'en',
    targetExamKey: null,
    targetDate: null,
    weeklyMinutes: null,
    isMinor: false,
    emailVerifiedAt: null,
  };
}

async function professor(db: Db, admin: AuthUser, options: { confirm?: boolean; exams?: string[]; aliases?: string[] } = {}): Promise<AuthUser> {
  const person = await account(db);
  await grantReviewer(db, admin, {
    email: person.email!,
    publicName: 'Prof. Giulia Bianchi',
    publicCredentials: 'Professor of mathematics, Università di Torino',
    examKeys: options.exams ?? [SAT.examKey],
    authorAliases: options.aliases ?? [],
  });
  if (options.confirm ?? true) await confirmReviewer(db, person);
  return person;
}

async function codeOf(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
    return 'ok';
  } catch (error) {
    if (error instanceof ReviewError) return error.code;
    throw error;
  }
}

function raw(line: number, fields: Partial<RawDecisionRow>): RawDecisionRow {
  return { line, questionId: '', version: '', fingerprint: '', exportId: '', decision: '', reviewerEmail: '', ...fields };
}

function applyInput(reviewer: AuthUser, rows: RawDecisionRow[], overrides: Partial<BatchApplyInput> = {}): BatchApplyInput {
  return {
    reviewerUserId: reviewer.id,
    exportId: null,
    rows,
    source: 'csv',
    sourceName: 'professors-batch-3.csv',
    sourceSha256: 'a'.repeat(64),
    reviewedOn: '2026-11-20',
    reviewerCheckedAll: true,
    ...overrides,
  };
}

/** The CSV a professor returns: the export with the decision column filled in. */
function returned(exportCsv: string, decide: (questionId: string, index: number) => string): string {
  const table = parseCsv(exportCsv);
  const decisionAt = table.header.indexOf('decision');
  const idAt = table.header.indexOf('question_id');
  const rows = table.records.map((record, index) => {
    const cells = [...record.cells];
    cells[decisionAt] = decide(cells[idAt], index);
    return cells;
  });
  return toCsv([table.header, ...rows]);
}

function rowsOf(csv: string): RawDecisionRow[] {
  const table = parseCsv(csv);
  const mapped = mapColumns(table.header);
  if ('problem' in mapped) throw new Error(mapped.problem);
  return rawDecisionRows(table, mapped.columns);
}

describe('reading a returned CSV', () => {
  it('reads commas, semicolons, quotes, line breaks inside cells and a byte-order mark', () => {
    const comma = parseCsv('﻿question_id,decision,notes\r\nq-1,approved,"said ""fine""\nreally"\r\nq-2,,\r\n');
    expect(comma.header).toEqual(['question_id', 'decision', 'notes']);
    expect(comma.records.map((r) => r.cells)).toEqual([
      ['q-1', 'approved', 'said "fine"\nreally'],
      ['q-2', '', ''],
    ]);
    expect(comma.records.map((r) => r.line)).toEqual([2, 4]);

    const semicolon = parseCsv('ID;Version;Decision\nq-1;2;Sì\n');
    expect(semicolon.delimiter).toBe(';');
    const mapped = mapColumns(semicolon.header);
    expect('columns' in mapped).toBe(true);
    const [row] = rawDecisionRows(semicolon, (mapped as { columns: never }).columns);
    expect(readDecisionRow(row)).toEqual({
      row: { line: 2, questionId: 'q-1', version: 2, fingerprint: null, exportId: null, decision: 'approved', reviewerEmail: null },
    });
  });

  it('refuses a file without a question id or a decision column', () => {
    expect(mapColumns([])).toEqual({ problem: 'empty-file' });
    expect(mapColumns(['stem', 'decision'])).toEqual({ problem: 'no-question-id-column' });
    expect(mapColumns(['question_id', 'notes'])).toEqual({ problem: 'no-decision-column' });
  });

  it('never reads a value it does not understand as an approval', () => {
    const problems = [
      raw(2, { questionId: 'q-1', decision: 'probably' }),
      raw(3, { questionId: '', decision: 'approved' }),
      raw(4, { questionId: 'q 4', decision: 'approved' }),
      raw(5, { questionId: 'q-5', version: 'two', decision: 'approved' }),
      raw(6, { questionId: 'q-6', fingerprint: 'abc', decision: 'approved' }),
      raw(7, { questionId: 'q-7', reviewerEmail: 'not-an-email', decision: 'approved' }),
      raw(8, { questionId: 'q-8', exportId: 'nope', decision: 'approved' }),
    ].map((r) => readDecisionRow(r));
    expect(problems).toEqual([
      { problem: 'unknown-decision' },
      { problem: 'missing-question-id' },
      { problem: 'bad-question-id' },
      { problem: 'bad-version' },
      { problem: 'bad-fingerprint' },
      { problem: 'bad-reviewer-email' },
      { problem: 'bad-export-id' },
    ]);
    expect(readDecisionRow(raw(9, { questionId: 'q-9', decision: 'No' }))).toMatchObject({ row: { decision: 'changes' } });
    expect(readDecisionRow(raw(10, { questionId: 'q-10', decision: '  ' }))).toMatchObject({ row: { decision: 'none' } });
    // A spreadsheet's "3.0" is version 3; its text-guard apostrophe is not part of the value.
    expect(readDecisionRow(raw(11, { questionId: "'q-11", version: '3.0', decision: 'APPROVED' }))).toMatchObject({
      row: { questionId: 'q-11', version: 3, decision: 'approved' },
    });
  });

  it('writes cells a spreadsheet cannot run as formulas, and reads them back', () => {
    const csv = toCsv([['question_id', 'stem', 'decision'], ['q-1', '=HYPERLINK("x")', ''], ['q-2', '-3 + x, then "y"', 'approved']]);
    expect(csv.startsWith('﻿')).toBe(true);
    const table = parseCsv(csv);
    expect(table.records[0].cells[1]).toBe(`'=HYPERLINK("x")`);
    expect(table.records[1].cells).toEqual(['q-2', `'-3 + x, then "y"`, 'approved']);
  });
});

describe('the export sent to reviewers and the file they return', () => {
  let db: Db;
  let admin: AuthUser;
  let prof: AuthUser;
  beforeEach(async () => {
    db = await createTestDb();
    admin = await account(db, 'admin');
    prof = await professor(db, admin);
    await seedQuestions(db, SAT, { perDomain: 3, humanApproved: false });
  });

  it('exports every question awaiting review with its version and fingerprint, and records what went out', async () => {
    const pending = await pendingQuestions(db, { exam: SAT.examKey });
    const result = await exportForReview(db, admin, { exam: SAT.examKey });
    expect(result.itemCount).toBe(pending.length);
    const table = parseCsv(result.csv);
    expect(table.header.slice(0, 4)).toEqual(['export_id', 'question_id', 'version', 'fingerprint']);
    expect(table.header.slice(-3)).toEqual(['decision', 'reviewer_email', 'notes']);
    const byId = new Map(table.records.map((r) => [r.cells[1], r.cells]));
    for (const q of pending) {
      expect(byId.get(q.questionId)?.slice(0, 4)).toEqual([result.exportId, q.questionId, String(q.version), q.fingerprint]);
    }
    expect((await pendingQuestions(db, { sent: result.exportId })).length).toBe(pending.length);
    expect(await pendingQuestions(db, { sent: 'never' })).toEqual([]);
  });

  it('dry-runs the returned file, then approves exactly the rows marked approved, as the reviewer, from that file', async () => {
    const exported = await exportForReview(db, admin, { exam: SAT.examKey });
    const total = exported.itemCount;
    // The professor approves all but the first two; one is sent back, one left blank.
    const csv = returned(exported.csv, (_id, i) => (i === 0 ? 'changes' : i === 1 ? '' : 'approved'));
    const rows = rowsOf(csv);

    const plan = await previewBatch(db, admin, { reviewerUserId: prof.id, exportId: null, rows });
    expect(plan.willApprove).toBe(total - 2);
    expect(plan.counts).toMatchObject({ 'will-approve': total - 2, 'not-approved': 1, 'no-decision': 1 });
    expect(await countPublished(db, SAT.examKey)).toBe(0);

    const { batch } = await applyBatch(db, admin, applyInput(prof, rows));
    expect(batch.approvedCount).toBe(total - 2);
    expect(batch).toMatchObject({
      source: 'csv',
      sourceName: 'professors-batch-3.csv',
      reviewerUserId: prof.id,
      reviewerName: 'Prof. Giulia Bianchi',
      recordedBy: admin.id,
      reviewedOn: '2026-11-20',
      exportId: exported.exportId,
    });
    expect(await countPublished(db, SAT.examKey)).toBe(total - 2);

    const approvedId = parseCsv(exported.csv).records[2].cells[1];
    const [decision] = await reviewHistory(db, approvedId);
    expect(decision).toMatchObject({
      reviewerUserId: prof.id,
      reviewerName: 'Prof. Giulia Bianchi',
      reviewerCredentials: 'Professor of mathematics, Università di Torino',
      outcome: 'approved',
      checked: ['answer-key', 'explanation', 'wording', 'syllabus-alignment'],
      reviewedOn: '2026-11-20',
      batchId: batch.id,
      recordedBy: admin.id,
      withdrawn: false,
    });
    expect(decision.reviewerUserId).not.toBe(admin.id);
    const sentBack = parseCsv(exported.csv).records[0].cells[1];
    expect(await reviewHistory(db, sentBack)).toEqual([]);

    // Importing the same file again approves nothing new.
    const again = await previewBatch(db, admin, { reviewerUserId: prof.id, exportId: null, rows });
    expect(again.counts['already-approved']).toBe(total - 2);
    expect(again.willApprove).toBe(0);
    expect(await codeOf(applyBatch(db, admin, applyInput(prof, rows)))).toBe('nothing-to-approve');
  });

  it('refuses a row whose question changed since it was sent, even with the same version number', async () => {
    const exported = await exportForReview(db, admin, { exam: SAT.examKey });
    const [first, second] = parseCsv(exported.csv).records.map((r) => r.cells[1]);
    // Edited without a version bump: the fingerprint moves, the version does not.
    const v = (await db.prepare('SELECT id FROM question_versions WHERE question_id = ?').get(first)) as { id: string };
    await db.prepare("UPDATE question_versions SET stem_md = stem_md || ' (edited)' WHERE id = ?").run(v.id);
    await fingerprintVersion(db, v.id);

    const rows = rowsOf(returned(exported.csv, () => 'approved'));
    const plan = await previewBatch(db, admin, { reviewerUserId: prof.id, exportId: null, rows });
    expect(plan.rows.find((r) => r.questionId === first)?.outcome).toBe('changed-since-sent');
    expect(plan.rows.find((r) => r.questionId === second)?.outcome).toBe('will-approve');

    // A file with only ids and versions is still checked against what the export recorded.
    const thin = rows.map((r) => ({ ...r, fingerprint: '' }));
    const thinPlan = await previewBatch(db, admin, { reviewerUserId: prof.id, exportId: null, rows: thin });
    expect(thinPlan.rows.find((r) => r.questionId === first)?.outcome).toBe('changed-since-sent');

    // A newer version number is refused too.
    const old = rows.map((r) => (r.questionId === second ? { ...r, version: '2', fingerprint: '' } : r));
    const oldPlan = await previewBatch(db, admin, { reviewerUserId: prof.id, exportId: null, rows: old });
    expect(oldPlan.rows.find((r) => r.questionId === second)?.outcome).toBe('changed-since-sent');
  });

  it('refuses rows it cannot tie to the text the reviewer saw, duplicates once, and contradictions entirely', async () => {
    const [a, b, c, d] = (await pendingQuestions(db, { exam: SAT.examKey })).map((q) => q.questionId);
    const rows = [
      raw(2, { questionId: a, decision: 'approved' }), // no version, fingerprint or export: unverifiable
      raw(3, { questionId: b, version: '1', decision: 'approved' }),
      raw(4, { questionId: b, version: '1', decision: 'approved' }), // the same row twice
      raw(5, { questionId: c, version: '1', decision: 'approved' }),
      raw(6, { questionId: c, version: '1', decision: 'changes' }), // contradicts line 5
      raw(7, { questionId: 'no-such-question', version: '1', decision: 'approved' }),
      raw(8, { questionId: d, version: '1', decision: 'maybe' }), // malformed
      raw(9, { questionId: d, version: '1', decision: 'approved', reviewerEmail: 'someone.else@example.com' }),
    ];
    const plan = await previewBatch(db, admin, { reviewerUserId: prof.id, exportId: null, rows });
    expect(plan.rows.map((r) => [r.line, r.outcome])).toEqual([
      [2, 'unverifiable'],
      [3, 'will-approve'],
      [4, 'duplicate'],
      [5, 'conflict'],
      [6, 'conflict'],
      [7, 'not-found'],
      [8, 'unknown-decision'],
      [9, 'other-reviewer'],
    ]);
    expect(plan.willApprove).toBe(1);
  });

  it('keeps the reviewer rules: their exams only, never their own work, never over a request for changes', async () => {
    const other = await professor(db, admin, { aliases: ['author'] }); // the seeded questions' author
    const pending = await pendingQuestions(db, { exam: SAT.examKey });
    const rows = pending.map((q, i) => raw(i + 2, { questionId: q.questionId, version: String(q.version), fingerprint: q.fingerprint, decision: 'approved' }));
    const own = await previewBatch(db, admin, { reviewerUserId: other.id, exportId: null, rows });
    expect(own.counts['own-work']).toBe(pending.length);

    const gmatOnly = await professor(db, admin, { exams: ['gmat'] });
    const wrongExam = await previewBatch(db, admin, { reviewerUserId: gmatOnly.id, exportId: null, rows });
    expect(wrongExam.counts['exam-not-authorised']).toBe(pending.length);

    // Another reviewer sent the first one back: a batch does not overrule that.
    const third = await professor(db, admin);
    const v = (await db.prepare('SELECT * FROM question_versions WHERE question_id = ?').get(pending[0].questionId)) as { id: string; review_fingerprint: string };
    await recordReview(db, third, recordReviewSchema.parse({
      questionVersionId: v.id, reviewFingerprint: v.review_fingerprint, outcome: 'changes_requested', checked: [], notes: 'Option C is also defensible.',
    }));
    const plan = await previewBatch(db, admin, { reviewerUserId: prof.id, exportId: null, rows });
    expect(plan.rows.find((r) => r.questionId === pending[0].questionId)?.outcome).toBe('changes-requested');
  });

  it('never records the administrator, an unconfirmed reviewer, a future date, or a batch without every check confirmed', async () => {
    const [q] = await pendingQuestions(db, { exam: SAT.examKey });
    const rows = [raw(2, { questionId: q.questionId, version: '1', fingerprint: q.fingerprint, decision: 'approved' })];

    expect(await codeOf(previewBatch(db, admin, { reviewerUserId: admin.id, exportId: null, rows }))).toBe('reviewer-is-recorder');
    // Even an administrator who is also an authorised reviewer.
    await grantReviewer(db, admin, { email: admin.email!, publicName: 'The Owner', publicCredentials: 'Site owner and editor', examKeys: [SAT.examKey], authorAliases: [] });
    await confirmReviewer(db, admin);
    expect(await codeOf(applyBatch(db, admin, applyInput(admin, rows)))).toBe('reviewer-is-recorder');

    const unconfirmed = await professor(db, admin, { confirm: false });
    expect(await codeOf(previewBatch(db, admin, { reviewerUserId: unconfirmed.id, exportId: null, rows }))).toBe('reviewer-unconfirmed');
    const learner = await account(db);
    expect(await codeOf(previewBatch(db, admin, { reviewerUserId: learner.id, exportId: null, rows }))).toBe('not-a-reviewer');

    expect(await codeOf(applyBatch(db, admin, applyInput(prof, rows, { reviewedOn: '2999-01-01' })))).toBe('future-date');
    const { batchApplySchema } = await import('@/lib/content/review-batches');
    expect(batchApplySchema.safeParse({ ...applyInput(prof, rows), reviewerCheckedAll: false }).success).toBe(false);

    const editor = await account(db, 'editor');
    expect(await codeOf(previewBatch(db, editor, { reviewerUserId: prof.id, exportId: null, rows }))).toBe('forbidden');
    expect(await codeOf(applyBatch(db, editor, applyInput(prof, rows)))).toBe('forbidden');
    expect(await codeOf(exportForReview(db, editor, {}))).toBe('forbidden');
    expect(await countPublished(db, SAT.examKey)).toBe(0);
  });
});

describe('approving a selection, in chunks, and withdrawing a batch', () => {
  let db: Db;
  let admin: AuthUser;
  let prof: AuthUser;
  beforeEach(async () => {
    db = await createTestDb();
    admin = await account(db, 'admin');
    prof = await professor(db, admin);
  });

  it('approves a selection of hundreds across several transactions, then withdraws it as a whole', async () => {
    await seedQuestions(db, SAT, { perDomain: 60, humanApproved: false });
    const pending = await pendingQuestions(db, { exam: SAT.examKey });
    expect(pending.length).toBeGreaterThan(400); // more than two chunks of 200
    const selected = pending.slice(0, 450);
    const rows = selected.map((q, i) => raw(i + 1, { questionId: q.questionId, version: String(q.version), fingerprint: q.fingerprint, decision: 'approved' }));

    const { batch } = await applyBatch(db, admin, applyInput(prof, rows, {
      source: 'selection',
      sourceName: 'Approved list e-mailed by Prof. Bianchi on 20 November',
      sourceSha256: null,
    }));
    expect(batch.approvedCount).toBe(450);
    expect(await countPublished(db, SAT.examKey)).toBe(450);
    expect((await batchItems(db, batch.id)).length).toBe(450);
    expect((await pendingQuestions(db, { exam: SAT.examKey })).length).toBe(pending.length - 450);
    const someVersion = selected[10].questionVersionId;
    expect((await standingApprovalFor(db, someVersion))?.batchId).toBe(batch.id);

    const audit = (await db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'question_review.approved' AND actor_user_id = ?").get(admin.id)) as { n: number };
    expect(Number(audit.n)).toBe(450);

    const withdrawn = await withdrawBatch(db, admin, batch.id, 'Recorded against the wrong professor.');
    expect(withdrawn.withdrawnAt).not.toBeNull();
    expect(withdrawn.withdrawReason).toBe('Recorded against the wrong professor.');
    expect(await countPublished(db, SAT.examKey)).toBe(0);
    expect(await standingApprovalFor(db, someVersion)).toBeNull();
    // The decisions stay in the ledger, marked as withdrawn.
    const history = await reviewHistory(db, selected[10].questionId);
    expect(history).toHaveLength(1);
    expect(history[0].withdrawn).toBe(true);
    expect((await pendingQuestions(db, { exam: SAT.examKey })).length).toBe(pending.length);
    expect(await codeOf(withdrawBatch(db, admin, batch.id, 'Again, by mistake.'))).toBe('already-withdrawn');
    expect((await listBatches(db))[0].id).toBe(batch.id);

    // Recording it again afterwards, correctly, works.
    const { batch: again } = await applyBatch(db, admin, applyInput(prof, rows.slice(0, 5), { source: 'selection', sourceName: 'Re-entered after correction' }));
    expect(again.approvedCount).toBe(5);
    expect(await countPublished(db, SAT.examKey)).toBe(5);
  });

  it('skips, rather than approves, a question edited between the dry run and the write', async () => {
    await seedQuestions(db, SAT, { perDomain: 2, humanApproved: false });
    const pending = await pendingQuestions(db, { exam: SAT.examKey });
    const rows = pending.map((q, i) => raw(i + 1, { questionId: q.questionId, version: String(q.version), fingerprint: q.fingerprint, decision: 'approved' }));

    // The edit lands while the batch is being written: after its plan, before its first chunk.
    const { CHUNK_SIZE } = await import('@/lib/content/review-batches');
    expect(CHUNK_SIZE).toBeGreaterThan(rows.length);
    const realTransaction = db.transaction.bind(db);
    let calls = 0;
    const spy = vi.spyOn(db, 'transaction').mockImplementation(((fn: (...args: unknown[]) => unknown) => {
      calls += 1;
      if (calls === 2) {
        return async (...args: unknown[]) => {
          const v = (await db.prepare('SELECT id FROM question_versions WHERE question_id = ?').get(pending[0].questionId)) as { id: string };
          await db.prepare("UPDATE question_versions SET explanation_md = explanation_md || ' Edited.' WHERE id = ?").run(v.id);
          await fingerprintVersion(db, v.id);
          return realTransaction(fn)(...args);
        };
      }
      return realTransaction(fn);
    }) as typeof db.transaction);
    const result = await applyBatch(db, admin, applyInput(prof, rows));
    spy.mockRestore();
    expect(result.skippedAtWrite).toBe(1);
    expect(result.batch.approvedCount).toBe(rows.length - 1);
    expect(await reviewHistory(db, pending[0].questionId)).toEqual([]);
  });
});
