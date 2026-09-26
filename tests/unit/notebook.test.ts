import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import { getResult, recordResponse, startAttempt, startRetry, submitAttempt } from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { NOTEBOOK_PAGE, buildNotebook, parsePage, parseView, stemPreview } from '@/lib/learning/notebook';
import { labelSummary, labelsForItems, setMistakeLabels } from '@/lib/learning/mistakes';
import { getResultsSummary, getReviewItem } from '@/lib/learning/results';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * The mistake notebook, labels and the results summary (Phase 4): due and
 * later kept apart, labels chosen only by the learner and changing nothing,
 * evidence thresholds on results, and everything scoped to the learner.
 */

const SAT = requireExamConfig('digital-sat');
const DAY = 24 * 60 * 60 * 1000;

let db: Db;
let alice: string;
let bob: string;

beforeEach(() => {
  db = createTestDb();
  alice = createUser(db);
  bob = createUser(db);
  seedQuestions(db, SAT, { perDomain: 6 });
});

function finish(userId: string, wrong: number[], blank: number[] = [], now = new Date()) {
  const { attemptId } = startAttempt(db, { userId, examKey: SAT.examKey, blueprintId: 'practice', now });
  const items = db.prepare('SELECT position FROM attempt_items WHERE attempt_id = ? ORDER BY position').all(attemptId) as Array<{ position: number }>;
  for (const { position } of items) {
    if (blank.includes(position)) continue;
    recordResponse(db, { attemptId, userId, partIndex: 0, position, response: { type: 'single_select', optionId: wrong.includes(position) ? 'b' : 'a' }, now });
  }
  submitAttempt(db, { attemptId, userId, now });
  return attemptId;
}

const itemAt = (attemptId: string, position: number) =>
  db.prepare('SELECT id, question_id AS questionId FROM attempt_items WHERE attempt_id = ? AND position = ?').get(attemptId, position) as { id: string; questionId: string };

describe('views', () => {
  it('keeps questions due now apart from those coming back later', () => {
    const t0 = new Date('2026-09-20T10:00:00.000Z');
    finish(alice, [0, 1], [2], t0);
    // A day and a half later, everything missed on the 20th is due.
    const due = buildNotebook(db, alice, 'due', new Date(t0.getTime() + 1.5 * DAY));
    expect(due.counts).toMatchObject({ due: 3, later: 0, all: 3 });
    expect(due.entries.map((e) => e.outcome).sort()).toEqual(['blank', 'incorrect', 'incorrect']);

    // The same morning, nothing is due yet and all three come back later.
    const later = buildNotebook(db, alice, 'later', new Date(t0.getTime() + 60_000));
    expect(later.counts).toMatchObject({ due: 0, later: 3 });
    expect(later.entries).toHaveLength(3);
    expect(later.nextDueAt).not.toBeNull();
    expect(buildNotebook(db, alice, 'due', new Date(t0.getTime() + 60_000)).entries).toEqual([]);
  });

  it('opens each entry on the question’s own review page, as it was answered', () => {
    const source = finish(alice, [3]);
    const [entry] = buildNotebook(db, alice, 'all').entries;
    expect(entry).toMatchObject({ attemptId: source, ordinal: 4, outcome: 'incorrect' });
    const review = getReviewItem(db, source, alice, entry.ordinal)!;
    expect(review.item.questionId).toBe(entry.questionId);
    expect(review.response).toEqual({ type: 'single_select', optionId: 'b' });
  });

  it('shows only the learner’s own mistakes and bookmarks', () => {
    finish(alice, [0, 1]);
    finish(bob, [0]);
    expect(buildNotebook(db, bob, 'all').counts.all).toBe(1);
    expect(buildNotebook(db, bob, 'all').entries.every((e) => e.attemptId !== undefined)).toBe(true);
    expect(buildNotebook(db, alice, 'all').counts.all).toBe(2);
    expect(buildNotebook(db, bob, 'bookmarked').entries).toEqual([]);
  });

  it('offers a retry of the misses in view, per exam', () => {
    finish(alice, [0, 1, 2]);
    const data = buildNotebook(db, alice, 'all');
    expect(data.retryGroups).toHaveLength(1);
    expect(data.retryGroups[0].questionIds.sort()).toEqual(data.entries.map((e) => e.questionId).sort());
  });

  it('understands the Phase 2 view name and defaults to due now', () => {
    expect(parseView('incorrect')).toBe('all');
    expect(parseView(undefined)).toBe('due');
    expect(parseView('something')).toBe('due');
  });

  it('previews a stem as plain text, without maths or Markdown', () => {
    expect(stemPreview('If $x^2 = 4$, what is **x**?')).toBe('If …, what is x?');
    expect(stemPreview('a'.repeat(300)).length).toBe(140);
  });
});

describe('pages', () => {
  // A notebook of three pages: sixteen sessions left entirely blank, on sixteen
  // different days, over a bank of 112 questions. Blank answers in one session
  // share a timestamp, so ordering ties are the normal case here.
  const t0 = new Date('2026-09-01T09:00:00.000Z');
  const later = new Date(t0.getTime() + 30 * DAY);
  const everything = Array.from({ length: 30 }, (_, index) => index);

  function bigNotebook() {
    db = createTestDb();
    alice = createUser(db);
    bob = createUser(db);
    seedQuestions(db, SAT, { perDomain: 14 });
    for (let day = 0; day < 16; day += 1) finish(alice, [], everything, new Date(t0.getTime() + day * DAY));
    const missed = db
      .prepare(
        `SELECT DISTINCT ai.question_id AS id FROM attempt_items ai JOIN attempts a ON a.id = ai.attempt_id
          WHERE a.user_id = ? AND ai.response_status = 'unanswered'`,
      )
      .all(alice) as Array<{ id: string }>;
    return missed.map((row) => row.id);
  }

  function walk(view: 'due' | 'all' | 'bookmarked', userId = alice) {
    const first = buildNotebook(db, userId, view, later, 1);
    const pages = [first];
    for (let page = 2; page <= first.pageCount; page += 1) pages.push(buildNotebook(db, userId, view, later, page));
    return { first, pages, ids: pages.flatMap((data) => data.entries.map((entry) => entry.questionId)) };
  }

  it('reaches every entry exactly once across pages, in the same order each time', () => {
    const missed = bigNotebook();
    expect(missed.length).toBeGreaterThan(2 * NOTEBOOK_PAGE);

    for (const view of ['all', 'due'] as const) {
      const { first, pages, ids } = walk(view);
      expect(first.total).toBe(missed.length);
      expect(first.pageCount).toBe(Math.ceil(missed.length / NOTEBOOK_PAGE));
      expect(ids).toHaveLength(missed.length);
      expect(new Set(ids).size).toBe(ids.length);
      expect([...ids].sort()).toEqual([...missed].sort());
      pages.forEach((data, index) => {
        expect(data.page).toBe(index + 1);
        expect(data.firstIndex).toBe(index * NOTEBOOK_PAGE + 1);
        expect(data.entries.length).toBe(Math.min(NOTEBOOK_PAGE, missed.length - index * NOTEBOOK_PAGE));
      });
      // Unchanged data, walked again: identical pages.
      expect(walk(view).ids).toEqual(ids);
    }
  });

  it('breaks ties on the question id, so the order is total', () => {
    bigNotebook();
    const all = walk('all').pages.flatMap((data) => data.entries);
    for (let index = 1; index < all.length; index += 1) {
      const [a, b] = [all[index - 1], all[index]];
      // Most recent first; within one session's blanks (the same moment), by question id.
      if (a.seenAt === b.seenAt) expect(a.questionId < b.questionId).toBe(true);
      else expect(a.seenAt! > b.seenAt!).toBe(true);
    }
    const due = walk('due').pages.flatMap((data) => data.entries);
    for (let index = 1; index < due.length; index += 1) {
      const [a, b] = [due[index - 1], due[index]];
      if (a.dueAt === b.dueAt) expect(a.questionId < b.questionId).toBe(true);
      else expect(a.dueAt! < b.dueAt!).toBe(true);
    }
  });

  it('pages bookmarks made at the same moment without repeating one', () => {
    const missed = bigNotebook();
    const insert = db.prepare('INSERT INTO bookmarks (user_id, question_id, exam_key, created_at) VALUES (?, ?, ?, ?)');
    for (const id of missed) insert.run(alice, id, SAT.examKey, t0.toISOString());
    const { first, ids } = walk('bookmarked');
    expect(first.pageCount).toBeGreaterThan(1);
    expect(ids).toEqual([...missed].sort());
  });

  it('keeps a page within range and never shows another learner’s entries', () => {
    const missed = bigNotebook();
    const last = Math.ceil(missed.length / NOTEBOOK_PAGE);
    expect(buildNotebook(db, alice, 'all', later, 99).page).toBe(last);
    expect(buildNotebook(db, alice, 'all', later, 0).page).toBe(1);
    expect(buildNotebook(db, alice, 'all', later, Number.NaN).page).toBe(1);

    const other = buildNotebook(db, bob, 'all', later, 2);
    expect(other).toMatchObject({ total: 0, page: 1, pageCount: 1, entries: [] });
    finish(bob, [0]);
    expect(walk('all', bob).ids).toHaveLength(1);
  });

  it('reads the page number from the query string', () => {
    expect(parsePage('3')).toBe(3);
    expect(parsePage(['2', '5'])).toBe(2);
    for (const bad of [undefined, '', '0', '-1', '1.5', 'two', '99999']) expect(parsePage(bad)).toBe(1);
  });
});

describe('labels', () => {
  it('are chosen only by the learner, replace earlier ones, and change no result', () => {
    const source = finish(alice, [0]);
    const item = itemAt(source, 0);
    const before = getResult(db, source, alice)?.totals;
    const queueBefore = db.prepare('SELECT * FROM review_queue WHERE user_id = ?').all(alice);

    expect(labelsForItems(db, alice, [item.id]).get(item.id)).toBeUndefined();
    expect(setMistakeLabels(db, { userId: alice, attemptItemId: item.id, labels: ['misread', 'guessed', 'nonsense'] })).toEqual(['misread', 'guessed']);
    expect(setMistakeLabels(db, { userId: alice, attemptItemId: item.id, labels: ['concept'] })).toEqual(['concept']);
    expect(labelsForItems(db, alice, [item.id]).get(item.id)).toEqual(['concept']);
    expect(labelSummary(db, alice)).toEqual([{ key: 'concept', text: 'I did not know how to do it', count: 1 }]);

    expect(getResult(db, source, alice)?.totals).toEqual(before);
    expect(db.prepare('SELECT * FROM review_queue WHERE user_id = ?').all(alice)).toEqual(queueBefore);

    setMistakeLabels(db, { userId: alice, attemptItemId: item.id, labels: [] });
    expect(labelsForItems(db, alice, [item.id]).get(item.id)).toBeUndefined();
  });

  it('can only be set on the learner’s own mistakes in a finished session', () => {
    const source = finish(alice, [0]);
    expect(() => setMistakeLabels(db, { userId: bob, attemptItemId: itemAt(source, 0).id, labels: ['misread'] })).toThrowError(
      expect.objectContaining({ status: 404 }),
    );
    expect(() => setMistakeLabels(db, { userId: alice, attemptItemId: itemAt(source, 1).id, labels: ['misread'] })).toThrowError(
      expect.objectContaining({ code: 'not-a-mistake' }),
    );
    const { attemptId: live } = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'practice' });
    expect(() => setMistakeLabels(db, { userId: alice, attemptItemId: itemAt(live, 0).id, labels: ['misread'] })).toThrowError(
      expect.objectContaining({ status: 404 }),
    );
  });
});

describe('results summary', () => {
  it('reports counts and keeps accuracy back where a topic has too few questions', () => {
    const source = finish(alice, [0, 1], [2]);
    const summary = getResultsSummary(db, source, alice)!;
    expect(summary.totals).toMatchObject({ correct: 7, incorrect: 2, omitted: 1 });
    for (const topic of summary.topics) {
      if (topic.scored < 4) {
        expect(topic.hasSignal).toBe(false);
        expect(topic.accuracy).toBeNull();
      }
    }
    expect(summary.retry.available).toHaveLength(3);
    expect(summary.isRetry).toBe(false);
  });

  it('says which questions the learner had seen in an earlier session', () => {
    finish(alice, []);
    const second = finish(alice, []);
    const summary = getResultsSummary(db, second, alice)!;
    const repeated = summary.items.filter((item) => item.seenBefore).length;
    expect(summary.seenBeforeCount).toBe(repeated);
  });

  it('marks a retry as one, with its source', () => {
    const source = finish(alice, [0]);
    const retry = startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: [itemAt(source, 0).questionId], sourceAttemptId: source });
    submitAttempt(db, { attemptId: retry.attemptId, userId: alice });
    const summary = getResultsSummary(db, retry.attemptId, alice)!;
    expect(summary).toMatchObject({ isRetry: true, retrySourceAttemptId: source, blueprintLabel: 'Retry of questions you missed' });
    expect(summary.items[0].seenBefore).toBe(true);
  });

  it('is not readable by another learner, nor for an unfinished session', () => {
    const source = finish(alice, [0]);
    expect(getResultsSummary(db, source, bob)).toBeNull();
    expect(getReviewItem(db, source, bob, 1)).toBeNull();
    const { attemptId: live } = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'practice' });
    expect(getResultsSummary(db, live, alice)).toBeNull();
    expect(getReviewItem(db, live, alice, 1)).toBeNull();
    expect(getReviewItem(db, source, alice, 99)).toBeNull();
  });
});

describe('failed-load states', () => {
  it('say results and the notebook could not be loaded, and offer a retry', async () => {
    const { createElement } = await import('react');
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { default: ResultsError } = await import('@/app/attempt/[id]/results/error');
    const { default: NotebookError } = await import('@/app/review/error');
    const results = renderToStaticMarkup(createElement(ResultsError, { error: new Error('boom'), reset: () => {} }));
    const notebook = renderToStaticMarkup(createElement(NotebookError, { error: new Error('boom'), reset: () => {} }));
    expect(results).toContain('These results could not be loaded');
    expect(notebook).toContain('Your notebook could not be loaded');
    for (const html of [results, notebook]) {
      expect(html).toContain('role="alert"');
      expect(html).toContain('Try again');
      expect(html).not.toContain('boom');
    }
  });
});
