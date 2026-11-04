import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import type { QuestionVersionRow, StimulusRow } from '@/lib/db/rows';
import type { AuthUser } from '@/lib/auth/session';
import { requireExamConfig } from '@/lib/exams/registry';
import { loadContent } from '@/lib/content/loader';
import { getExamConfig } from '@/lib/exams/registry';
import { countPublished, getCandidates, getPool, getPublishedVersion } from '@/lib/content/repository';
import {
  ReviewError,
  confirmReviewer,
  contentFromQuestion,
  contentFromRows,
  grantReviewer,
  humanApprovedCount,
  recordReview,
  recordReviewSchema,
  reviewFingerprint,
  reviewHistory,
  revokeReviewer,
  standingApproval,
  standingApprovalFor,
  verifiedFingerprint,
  type RecordReviewInput,
} from '@/lib/content/human-review';
import { planSeed, stimulusColumns, stimulusFileFor, versionColumns } from '@/lib/content/seed-plan';
import { getAttemptState, startAttempt } from '@/lib/attempts/service';
import { blueprintAvailability } from '@/lib/attempts/availability';
import { approveForTest, createTestDb, createUser, fingerprintVersion, seedQuestions } from './helpers/test-db';
import { byReviewPriority, nextForReviewer, reviewQueue, statusLabel, type QueueRow } from '@/lib/content/review-queue';

// Written for the rule while human approval is required (HUMAN_APPROVAL_REQUIRED=true);
// the default, where it is not, has its own test in human-review.test.ts.
beforeEach(() => { process.env.HUMAN_APPROVAL_REQUIRED = 'true'; });
afterEach(() => { delete process.env.HUMAN_APPROVAL_REQUIRED; });


/**
 * Mandatory human approval. A published question reaches a new session only
 * with a standing approval, by an authorised reviewer who is not its author,
 * of its exact current content. Nothing here may touch an attempt already made.
 */

const SAT = requireExamConfig('digital-sat');
const ALL_CHECKS = ['answer-key', 'explanation', 'wording', 'syllabus-alignment'] as const;

async function account(db: Db, role: AuthUser['role'] = 'learner', displayName: string | null = null): Promise<AuthUser> {
  const id = await createUser(db, { role });
  if (displayName) await db.prepare('UPDATE users SET display_name = ? WHERE id = ?').run(displayName, id);
  return {
    id,
    email: `${id}@example.invalid`,
    displayName,
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

async function currentVersion(db: Db, questionId: string): Promise<QuestionVersionRow> {
  return (await db
    .prepare('SELECT qv.* FROM question_versions qv JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version WHERE q.id = ?')
    .get(questionId)) as QuestionVersionRow;
}

async function activeReviewer(db: Db, admin: AuthUser, options: { exams?: string[]; aliases?: string[]; name?: string } = {}): Promise<AuthUser> {
  const reviewer = await account(db);
  await grantReviewer(db, admin, {
    email: reviewer.email!,
    publicName: options.name ?? 'Maria Rossi',
    publicCredentials: 'Mathematics teacher, liceo scientifico, 12 years',
    examKeys: options.exams ?? [SAT.examKey],
    authorAliases: options.aliases ?? [],
  });
  await confirmReviewer(db, reviewer);
  return reviewer;
}

function approval(row: QuestionVersionRow, overrides: Partial<RecordReviewInput> = {}): RecordReviewInput {
  return recordReviewSchema.parse({
    questionVersionId: row.id,
    reviewFingerprint: row.review_fingerprint,
    outcome: 'approved',
    checked: [...ALL_CHECKS],
    notes: '',
    ...overrides,
  });
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

describe('the content fingerprint', () => {
  it('is the same computed from a content file and from the row the seeder stores for it, for the whole bank', async () => {
    const db = await createTestDb();
    const { questions, stimuli } = loadContent();
    const files = stimuli.map((s) => s.stimulus);
    for (const stimulus of files) {
      const columns = stimulusColumns(stimulus);
      await db
        .prepare(
          `INSERT INTO stimuli (id, version, exam_key, kind, title, body_md, data_json, accessibility_text, provenance, rights_status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'now')`,
        )
        .run(...Object.values(columns));
    }
    let compared = 0;
    for (const { question } of questions) {
      if (!getExamConfig(question.examKey)) continue;
      const fromFile = reviewFingerprint(contentFromQuestion(question, stimulusFileFor(question, files)));
      const id = randomUUID();
      await db.prepare("INSERT INTO questions (id, exam_key, current_version, state, created_at, updated_at) VALUES (?, ?, ?, ?, 'now', 'now')").run(
        question.id,
        question.examKey,
        question.version,
        question.state,
      );
      await db
        .prepare(
          `INSERT INTO question_versions (id, question_id, version, exam_key, section_key, domain_slug, skill_slug, subskill_slug,
             response_type, difficulty, difficulty_basis, stem_md, instructions_md, options_json, correct_json, explanation_md,
             distractor_rationale_json, estimated_seconds, stimulus_id, stimulus_version, accessibility_text, provenance,
             rights_status, author, reviewer, reviewed_at, review_notes, state, content_hash, review_fingerprint, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'now')`,
        )
        .run(id, question.id, question.version, ...Object.values(versionColumns(question, 'hash', fromFile)));
      const row = (await db.prepare('SELECT * FROM question_versions WHERE id = ?').get(id)) as QuestionVersionRow;
      expect((await verifiedFingerprint(db, row)).matches, question.id).toBe(true);
      compared += 1;
    }
    expect(compared).toBeGreaterThan(900);
  }, 60_000); // reads and round-trips the whole bank

  it('changes with anything a learner sees or is scored against, and with nothing else', () => {
    const { questions, stimuli } = loadContent();
    const files = stimuli.map((s) => s.stimulus);
    const withStimulus = questions.find((q) => q.question.stimulusRef && getExamConfig(q.question.examKey))!.question;
    const stimulus = stimulusFileFor(withStimulus, files)!;
    const base = reviewFingerprint(contentFromQuestion(withStimulus, stimulus));
    const fp = (q: typeof withStimulus, s = stimulus) => reviewFingerprint(contentFromQuestion(q, s));

    // Learner-facing: every one of these voids an approval.
    expect(fp({ ...withStimulus, stemMd: `${withStimulus.stemMd} ` })).not.toBe(base);
    expect(fp({ ...withStimulus, explanationMd: `${withStimulus.explanationMd}.` })).not.toBe(base);
    expect(fp({ ...withStimulus, options: withStimulus.options.map((o, i) => (i === 0 ? { ...o, textMd: `${o.textMd}!` } : o)) })).not.toBe(base);
    expect(fp({ ...withStimulus, answerKey: { type: 'single_select', optionId: 'zz' } })).not.toBe(base);
    expect(fp({ ...withStimulus, skillSlug: 'another-skill' })).not.toBe(base);
    expect(fp({ ...withStimulus, difficulty: withStimulus.difficulty === 'hard' ? 'easy' : 'hard' })).not.toBe(base);
    expect(fp(withStimulus, { ...stimulus, bodyMd: `${stimulus.bodyMd ?? ''} edited` })).not.toBe(base);

    // Not learner-facing: the version number, the state, the AI review record, tags and translations.
    expect(fp({ ...withStimulus, version: withStimulus.version + 1 })).toBe(base);
    expect(fp({ ...withStimulus, state: 'in_review' })).toBe(base);
    expect(fp({ ...withStimulus, review: { ...withStimulus.review, notes: 'different notes' } })).toBe(base);
    expect(fp({ ...withStimulus, tags: ['new-tag'] })).toBe(base);
    expect(fp({ ...withStimulus, translations: {} })).toBe(base);
  }, 30_000);
});

describe('while human approval is not required (the default)', () => {
  it('serves published questions without one, and still records and shows an approval', async () => {
    delete process.env.HUMAN_APPROVAL_REQUIRED;
    const db = await createTestDb();
    const admin = await account(db, 'admin');
    await seedQuestions(db, SAT, { perDomain: 6, humanApproved: false });
    const pool = await getPool(db, SAT.examKey, null);
    expect(pool.length).toBeGreaterThan(0);
    expect(await countPublished(db, SAT.examKey)).toBe(pool.length);
    expect((await blueprintAvailability(db, SAT)).some((format) => format.available)).toBe(true);
    expect(await humanApprovedCount(db, [SAT.examKey])).toBe(0);

    const reviewer = await activeReviewer(db, admin);
    const row = await currentVersion(db, pool[0].questionId);
    const record = await recordReview(db, reviewer, approval(row), new Date('2026-10-30T10:00:00Z'));
    expect((await standingApprovalFor(db, row.id))?.id).toBe(record.id);
    expect(await humanApprovedCount(db, [SAT.examKey])).toBe(1);
  });
});

describe('a request for changes while human approval is not required', () => {
  it('takes the question out of new sessions until someone approves that content', async () => {
    delete process.env.HUMAN_APPROVAL_REQUIRED;
    const db = await createTestDb();
    const admin = await account(db, 'admin');
    await seedQuestions(db, SAT, { perDomain: 6, humanApproved: false });
    const before = await getPool(db, SAT.examKey, null);
    const target = before[0].questionId;
    const row = await currentVersion(db, target);

    const first = await activeReviewer(db, admin, { name: 'Maria Rossi' });
    await recordReview(db, first, approval(row, { outcome: 'changes_requested', checked: [], notes: 'The key should be C, not B.' }), new Date('2026-11-04T09:00:00Z'));

    const after = await getPool(db, SAT.examKey, null);
    expect(after.map((item) => item.questionId)).not.toContain(target);
    expect(after.length).toBe(before.length - 1);
    expect(await countPublished(db, SAT.examKey)).toBe(after.length);
    expect(await getPublishedVersion(db, target)).toBeUndefined();
    const candidate = (await getCandidates(db, SAT.examKey)).find((item) => item.questionId === target)!;
    expect(candidate.changesRequested).toBe(true);
    expect(candidate.humanApproved).toBe(false);

    // A second reviewer who disagrees approves the same content: the latest decision counts.
    const second = await activeReviewer(db, admin, { name: 'Luca Bianchi' });
    await recordReview(db, second, approval(row), new Date('2026-11-04T10:00:00Z'));
    expect((await getPool(db, SAT.examKey, null)).map((item) => item.questionId)).toContain(target);
    expect((await getCandidates(db, SAT.examKey)).find((item) => item.questionId === target)!.changesRequested).toBe(false);
  });

  it('labels a question awaiting review as served only while approval is optional', () => {
    expect(statusLabel('awaiting-human-review', false)).toMatch(/served meanwhile/);
    expect(statusLabel('awaiting-human-review', true)).toMatch(/not served/);
    expect(statusLabel('changes-requested', false)).toMatch(/not served/);
  });
});

describe('the order of the review queue', () => {
  function row(questionId: string, priority: Partial<QueueRow['priority']>, extra: Partial<QueueRow> = {}): QueueRow {
    return {
      questionId,
      questionVersionId: `${questionId}-v1`,
      examKey: SAT.examKey,
      status: 'awaiting-human-review',
      author: 'digital-sat-author',
      provenance: '{"authoredBy":"digital-sat-author"}',
      priority: { publicSample: false, openReports: 0, timesServed: 0, ...priority },
      ...extra,
    } as QueueRow;
  }

  it('puts learner reports first, then public samples, then what learners see most', () => {
    const rows = [
      row('q-plain', {}),
      row('q-served-3', { timesServed: 3 }),
      row('q-sample', { publicSample: true }),
      row('q-reported', { openReports: 1 }),
      row('q-served-9', { timesServed: 9 }),
    ].sort(byReviewPriority);
    expect(rows.map((r) => r.questionId)).toEqual(['q-reported', 'q-sample', 'q-served-9', 'q-served-3', 'q-plain']);
  });

  it('offers the next question a reviewer may decide on, never their own work or another exam', () => {
    const reviewer = { userId: 'u1', publicName: 'Maria Rossi', authorAliases: ['wave-author'], examKeys: [SAT.examKey] };
    const account = { email: 'maria@example.invalid', displayName: null };
    const rows = [
      row('q-current', { openReports: 2 }),
      row('q-approved', { openReports: 1 }, { status: 'approved' }),
      row('q-mine', { publicSample: true }, { author: 'wave-author', provenance: '{}' }),
      row('q-other-exam', { timesServed: 5 }, { examKey: 'gre' }),
      row('q-next', { timesServed: 1 }),
    ];
    expect(nextForReviewer(rows, reviewer, account, 'q-current')?.questionId).toBe('q-next');
    expect(nextForReviewer(rows.slice(0, 4), reviewer, account, 'q-current')).toBeNull();
  });

  it('counts open learner reports and marks the public samples', async () => {
    const db = await createTestDb();
    await seedQuestions(db, SAT, { perDomain: 6, humanApproved: false });
    const target = (await getCandidates(db, SAT.examKey))[3].questionId;
    for (const status of ['open', 'open', 'rejected']) {
      await db
        .prepare('INSERT INTO content_flags (id, question_id, reason, status, created_at) VALUES (?, ?, ?, ?, ?)')
        .run(randomUUID(), target, 'wrong-answer', status, '2026-11-04T08:00:00Z');
    }
    const queue = await reviewQueue(db, [SAT.examKey]);
    expect(queue[0].questionId).toBe(target);
    expect(queue[0].priority.openReports).toBe(2);
    expect(queue.slice(1).every((r) => r.priority.openReports === 0)).toBe(true);
  });
});

describe('publication requires a standing human approval', () => {
  let db: Db;
  let admin: AuthUser;
  beforeEach(async () => {
    db = await createTestDb();
    admin = await account(db, 'admin');
    await seedQuestions(db, SAT, { perDomain: 6, humanApproved: false });
  });

  it('serves no published question, in any format, until a reviewer approves it', async () => {
    expect(await getPool(db, SAT.examKey, null)).toEqual([]);
    expect(await countPublished(db, SAT.examKey)).toBe(0);
    const anyId = (await getCandidates(db, SAT.examKey))[0].questionId;
    expect(await getPublishedVersion(db, anyId)).toBeUndefined();
    expect((await blueprintAvailability(db, SAT)).every((format) => !format.available)).toBe(true);
    const learner = await account(db);
    await expect(startAttempt(db, { userId: learner.id, examKey: SAT.examKey, blueprintId: 'practice' })).rejects.toThrow();
  });

  it('serves a question once an authorised reviewer approves it, and stops when a later review asks for changes', async () => {
    const reviewer = await activeReviewer(db, admin);
    const [first] = await getCandidates(db, SAT.examKey);
    const row = await currentVersion(db, first.questionId);

    const record = await recordReview(db, reviewer, approval(row), new Date('2026-10-28T10:00:00Z'));
    expect(record.reviewerName).toBe('Maria Rossi');
    expect((await getPool(db, SAT.examKey, null)).map((i) => i.questionId)).toEqual([first.questionId]);
    expect((await getPublishedVersion(db, first.questionId))?.id).toBe(row.id);
    expect((await standingApprovalFor(db, row.id))?.id).toBe(record.id);
    expect(await humanApprovedCount(db, [SAT.examKey])).toBe(1);

    const second = await activeReviewer(db, admin, { name: 'Luca Bianchi' });
    await recordReview(db, second, approval(row, { outcome: 'changes_requested', checked: ['answer-key'], notes: 'Two choices are defensible.' }), new Date('2026-10-28T11:00:00Z'));
    expect(await getPool(db, SAT.examKey, null)).toEqual([]);
    expect(await standingApprovalFor(db, row.id)).toBeNull();
    expect((await reviewHistory(db, first.questionId)).map((r) => r.outcome)).toEqual(['changes_requested', 'approved']);
  });

  it('drops the approval when the content changes, even without a new version number', async () => {
    const reviewer = await activeReviewer(db, admin);
    const [first] = await getCandidates(db, SAT.examKey);
    const row = await currentVersion(db, first.questionId);
    await recordReview(db, reviewer, approval(row));
    expect(await getPool(db, SAT.examKey, null)).toHaveLength(1);

    // What a re-seed of an edited file does to an unattempted version: new text, new fingerprint.
    await db.prepare('UPDATE question_versions SET stem_md = ? WHERE id = ?').run('A reworded stem.', row.id);
    await fingerprintVersion(db, row.id);
    expect(await getPool(db, SAT.examKey, null)).toEqual([]);
    expect(await standingApprovalFor(db, row.id)).toBeNull();
    expect((await reviewHistory(db, first.questionId))[0].reviewFingerprint).not.toBe((await currentVersion(db, first.questionId)).review_fingerprint);
  });

  it('refuses to approve content changed outside the workflow, or text other than what the page showed', async () => {
    const reviewer = await activeReviewer(db, admin);
    const [first, second] = await getCandidates(db, SAT.examKey);
    const row = await currentVersion(db, first.questionId);
    await db.prepare('UPDATE question_versions SET explanation_md = ? WHERE id = ?').run('Edited directly in the database, long enough.', row.id);
    expect(await codeOf(recordReview(db, reviewer, approval(row)))).toBe('content-integrity');

    const other = await currentVersion(db, second.questionId);
    expect(await codeOf(recordReview(db, reviewer, approval(other, { reviewFingerprint: 'a'.repeat(64) })))).toBe('content-changed');
  });
});

describe('who may approve, checked on the server', () => {
  let db: Db;
  let admin: AuthUser;
  let row: QuestionVersionRow;
  beforeEach(async () => {
    db = await createTestDb();
    admin = await account(db, 'admin');
    await seedQuestions(db, SAT, { perDomain: 2, humanApproved: false });
    row = await currentVersion(db, (await getCandidates(db, SAT.examKey))[0].questionId);
  });

  it('rejects anyone who is not an active reviewer, including staff', async () => {
    const learner = await account(db);
    expect(await codeOf(recordReview(db, learner, approval(row)))).toBe('not-a-reviewer');
    expect(await codeOf(recordReview(db, admin, approval(row)))).toBe('not-a-reviewer');

    const pending = await account(db);
    await grantReviewer(db, admin, {
      email: pending.email!,
      publicName: 'Anna Verdi',
      publicCredentials: 'Physics teacher, 8 years',
      examKeys: [SAT.examKey],
      authorAliases: [],
    });
    expect(await codeOf(recordReview(db, pending, approval(row)))).toBe('reviewer-unconfirmed');

    const withdrawn = await activeReviewer(db, admin);
    await revokeReviewer(db, admin, withdrawn.id, 'No longer reviewing for us.');
    expect(await codeOf(recordReview(db, withdrawn, approval(row)))).toBe('not-a-reviewer');
    expect(await getPool(db, SAT.examKey, null)).toEqual([]);
  });

  it('rejects a reviewer outside the exams they are authorised for', async () => {
    const reviewer = await activeReviewer(db, admin, { exams: ['gmat'] });
    expect(await codeOf(recordReview(db, reviewer, approval(row)))).toBe('exam-not-authorised');
  });

  it('rejects self-approval under any name the reviewer writes as', async () => {
    // The synthetic bank records its author as "author".
    const byAlias = await activeReviewer(db, admin, { aliases: ['Author'] });
    expect(await codeOf(recordReview(db, byAlias, approval(row)))).toBe('own-work');

    const byName = await activeReviewer(db, admin, { name: 'author' });
    expect(await codeOf(recordReview(db, byName, approval(row)))).toBe('own-work');
  });

  it('lets only administrators authorise reviewers, and requires every check for an approval', async () => {
    const editor = await account(db, 'editor');
    await expect(
      grantReviewer(db, editor, { email: editor.email!, publicName: 'Ed Itor', publicCredentials: 'Editor, ten years', examKeys: [SAT.examKey], authorAliases: [] }),
    ).rejects.toMatchObject({ code: 'forbidden' });
    expect(
      recordReviewSchema.safeParse({ questionVersionId: row.id, reviewFingerprint: row.review_fingerprint, outcome: 'approved', checked: ['answer-key'] }).success,
    ).toBe(false);
    expect(
      recordReviewSchema.safeParse({ questionVersionId: row.id, reviewFingerprint: row.review_fingerprint, outcome: 'changes_requested', checked: [], notes: 'no' }).success,
    ).toBe(false);
  });

  it('refuses an old version once a newer one is current', async () => {
    const reviewer = await activeReviewer(db, admin);
    await db.prepare('UPDATE questions SET current_version = current_version + 1 WHERE id = ?').run(row.question_id);
    expect(await codeOf(recordReview(db, reviewer, approval(row)))).toBe('not-current-version');
  });
});

describe('historical attempts', () => {
  it('keep the question versions they pinned when approvals change or content is revised', async () => {
    const db = await createTestDb();
    await seedQuestions(db, SAT, { perDomain: 6 });
    const learner = await account(db);
    const { attemptId } = await startAttempt(db, { userId: learner.id, examKey: SAT.examKey, blueprintId: 'practice' });
    const before = (await getAttemptState(db, attemptId, learner.id)).parts.flatMap((p) => p.items.map((i) => i.questionVersionId));

    // Every approval is withdrawn by a later request for changes.
    for (const item of await getCandidates(db, SAT.examKey)) await approveForTest(db, item.questionVersionId, { outcome: 'changes_requested', at: new Date(Date.now() + 1000).toISOString() });
    expect(await getPool(db, SAT.examKey, null)).toEqual([]);

    const after = (await getAttemptState(db, attemptId, learner.id)).parts.flatMap((p) => p.items.map((i) => i.questionVersionId));
    expect(after).toEqual(before);
  });

  it('cannot be rewritten by the seeder: a changed file for an attempted version is refused', () => {
    const { questions, stimuli } = loadContent();
    const question = questions.find((q) => getExamConfig(q.question.examKey) && !q.question.stimulusRef)!.question;
    const files = stimuli.map((s) => s.stimulus);
    const columns = versionColumns(question, 'hash', 'fp');
    const row = { id: 'version-1', question_id: question.id, version: question.version, created_at: 'now', ...columns } as unknown as QuestionVersionRow;
    const existing = new Map([[`${question.id}@${question.version}`, { row, stimulus: null as StimulusRow | null }]]);
    const edited = { ...question, stemMd: `${question.stemMd} (edited)` };

    const attempted = planSeed([edited], files, existing, new Set(['version-1']));
    expect(attempted.conflicts.map((c) => c.questionId)).toEqual([question.id]);

    const unattempted = planSeed([edited], files, existing, new Set());
    expect(unattempted.conflicts).toEqual([]);
    expect(unattempted.questions[0].contentChanged).toBe(true);

    expect(planSeed([question], files, existing, new Set(['version-1'])).conflicts).toEqual([]);
  }, 30_000);
});

describe('the decision rule in code', () => {
  it('matches the SQL: the latest request for changes on the same content withdraws an approval', () => {
    const d = (outcome: 'approved' | 'changes_requested', createdAt: string, fp = 'f1') => ({ questionVersionId: 'v', reviewFingerprint: fp, outcome, createdAt });
    expect(standingApproval([d('approved', '1')], 'v', 'f1')).not.toBeNull();
    expect(standingApproval([d('approved', '1'), d('changes_requested', '2')], 'v', 'f1')).toBeNull();
    expect(standingApproval([d('approved', '1'), d('changes_requested', '2'), d('approved', '3')], 'v', 'f1')).not.toBeNull();
    expect(standingApproval([d('approved', '1', 'old')], 'v', 'f1')).toBeNull();
    expect(standingApproval([d('approved', '1')], 'v', null)).toBeNull();
  });
});
