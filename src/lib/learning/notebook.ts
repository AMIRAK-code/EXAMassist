import type { Db } from '@/lib/db';
import { getExamConfig, labelsFor } from '@/lib/exams/registry';
import { retryCandidates } from '@/lib/attempts/service';
import { MAX_RETRY_QUESTIONS } from '@/lib/attempts/retry';
import { examLabel } from './dashboard';
import { labelSummary, labelsForItems, type MistakeLabel } from './mistakes';
import type { Correction, Outcome } from './results';

/**
 * The mistake notebook, as data.
 *
 * "Due now" and "Coming back later" come from the review schedule: a missed
 * question comes back a day later, and again at growing intervals once it is
 * answered correctly. "All mistakes" is every question the learner has got
 * wrong or left blank in a finished session. Each entry is the latest missed
 * encounter, shown as it was answered; its full review is on the question's
 * own page. Everything is scoped to the learner.
 */

export const NOTEBOOK_VIEWS = [
  { key: 'due', label: 'Due now' },
  { key: 'later', label: 'Coming back later' },
  { key: 'all', label: 'All mistakes' },
  { key: 'bookmarked', label: 'Bookmarked' },
] as const;
export type NotebookView = (typeof NOTEBOOK_VIEWS)[number]['key'];
export const NOTEBOOK_PAGE = 40;

export function parseView(value: string | string[] | undefined): NotebookView {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'incorrect') return 'all'; // the Phase 2 name for the same view
  return NOTEBOOK_VIEWS.some((view) => view.key === raw) ? (raw as NotebookView) : 'due';
}

/** A page number from the query string: a positive integer, else the first page. */
export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && /^\d{1,4}$/.test(raw) && Number(raw) >= 1 ? Number(raw) : 1;
}

export interface NotebookEntry {
  questionId: string;
  examKey: string;
  examLabel: string;
  topicName: string;
  skillName: string;
  outcome: Outcome;
  missCount: number;
  dueAt: string | null;
  seenAt: string | null;
  attemptId: string;
  ordinal: number;
  attemptItemId: string;
  labels: MistakeLabel[];
  bookmarked: boolean;
  correction: Correction;
  preview: string;
}

export interface RetryGroup {
  examKey: string;
  examLabel: string;
  questionIds: string[];
  unavailable: number;
}

export interface NotebookData {
  view: NotebookView;
  counts: Record<NotebookView, number>;
  entries: NotebookEntry[];
  /** Entries in the whole view, across every page. */
  total: number;
  /** The page shown (1-based), kept within 1..pageCount. */
  page: number;
  pageCount: number;
  /** The 1-based position in the view of this page's first entry. */
  firstIndex: number;
  nextDueAt: string | null;
  retryGroups: RetryGroup[];
  labelSummary: Array<{ key: MistakeLabel; text: string; count: number }>;
}

/** A short, plain-text start of a question stem: maths and Markdown stripped. */
export function stemPreview(stemMd: string, max = 140): string {
  const text = stemMd
    .replace(/\$\$[\s\S]*?\$\$/g, '…')
    .replace(/\$[^$\n]+\$/g, '…')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

interface Located {
  questionId: string;
  itemId: string;
  missCount: number | null;
  dueAt: string | null;
}

/** The latest missed encounter of each question, as its attempt item. */
const LATEST_MISS = `(SELECT ai.id FROM attempt_items ai JOIN attempts a ON a.id = ai.attempt_id
    WHERE a.user_id = ? AND ai.question_id = %Q AND a.status IN ('submitted', 'expired')
      AND (ai.is_correct = 0 OR ai.response_status = 'unanswered')
    ORDER BY COALESCE(ai.last_answered_at, a.submitted_at, a.created_at) DESC, ai.id DESC LIMIT 1)`;
const LATEST_ANY = `(SELECT ai.id FROM attempt_items ai JOIN attempts a ON a.id = ai.attempt_id
    WHERE a.user_id = ? AND ai.question_id = %Q AND a.status IN ('submitted', 'expired')
    ORDER BY COALESCE(ai.last_answered_at, a.submitted_at, a.created_at) DESC, ai.id DESC LIMIT 1)`;

async function locate(db: Db, userId: string, view: NotebookView, nowIso: string): Promise<Located[]> {
  if (view === 'due' || view === 'later') {
    return (await db
      .prepare(
        `SELECT rq.question_id AS questionId, ${LATEST_MISS.replace('%Q', 'rq.question_id')} AS itemId,
                rq.miss_count AS missCount, rq.due_at AS dueAt
           FROM review_queue rq
          WHERE rq.user_id = ? AND rq.last_result <> 'correct' AND rq.due_at ${view === 'due' ? '<=' : '>'} ?
          ORDER BY rq.due_at ASC, rq.question_id ASC`,
      )
      .all(userId, userId, nowIso)) as Located[];
  }
  if (view === 'all') {
    return (await db
      .prepare(
        `SELECT m.questionId, ${LATEST_MISS.replace('%Q', 'm.questionId')} AS itemId,
                rq.miss_count AS missCount, rq.due_at AS dueAt
           FROM (SELECT DISTINCT ai.question_id AS questionId, MAX(COALESCE(ai.last_answered_at, a.submitted_at)) AS lastMiss
                   FROM attempt_items ai JOIN attempts a ON a.id = ai.attempt_id
                  WHERE a.user_id = ? AND a.status IN ('submitted', 'expired')
                    AND (ai.is_correct = 0 OR ai.response_status = 'unanswered')
                  GROUP BY ai.question_id) m
           LEFT JOIN review_queue rq ON rq.user_id = ? AND rq.question_id = m.questionId
          ORDER BY m.lastMiss DESC, m.questionId ASC`,
      )
      .all(userId, userId, userId)) as Located[];
  }
  return (await db
    .prepare(
      `SELECT b.question_id AS questionId, ${LATEST_ANY.replace('%Q', 'b.question_id')} AS itemId,
              rq.miss_count AS missCount, rq.due_at AS dueAt
         FROM bookmarks b
         LEFT JOIN review_queue rq ON rq.user_id = b.user_id AND rq.question_id = b.question_id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC, b.question_id ASC`,
    )
    .all(userId, userId)) as Located[];
}

async function counts(db: Db, userId: string, nowIso: string): Promise<Record<NotebookView, number>> {
  const queue = (await db
    .prepare(
      `SELECT COALESCE(SUM(CASE WHEN due_at <= ? THEN 1 ELSE 0 END), 0) AS due,
              COALESCE(SUM(CASE WHEN due_at > ? THEN 1 ELSE 0 END), 0) AS later
         FROM review_queue WHERE user_id = ? AND last_result <> 'correct'`,
    )
    .get(nowIso, nowIso, userId)) as { due: number; later: number };
  const all = (await db
    .prepare(
      `SELECT COUNT(DISTINCT ai.question_id) AS n FROM attempt_items ai JOIN attempts a ON a.id = ai.attempt_id
        WHERE a.user_id = ? AND a.status IN ('submitted', 'expired')
          AND (ai.is_correct = 0 OR ai.response_status = 'unanswered')`,
    )
    .get(userId)) as { n: number };
  const bookmarked = (await db.prepare('SELECT COUNT(*) AS n FROM bookmarks WHERE user_id = ?').get(userId)) as { n: number };
  return { due: queue.due, later: queue.later, all: all.n, bookmarked: bookmarked.n };
}

interface DetailRow {
  itemId: string;
  attemptId: string;
  examKey: string;
  questionId: string;
  isCorrect: 0 | 1 | null;
  responseStatus: string;
  seenAt: string | null;
  stemMd: string;
  domainSlug: string;
  skillSlug: string;
  answeredVersion: number;
  currentVersion: number | null;
  questionState: string | null;
  currentVersionState: string | null;
  ordinal: number;
  bookmarked: number | null;
}

async function details(db: Db, userId: string, itemIds: string[]): Promise<Map<string, DetailRow>> {
  if (itemIds.length === 0) return new Map();
  const placeholders = itemIds.map(() => '?').join(',');
  const rows = (await db
    .prepare(
      `SELECT ai.id AS itemId, ai.attempt_id AS attemptId, a.exam_key AS examKey, ai.question_id AS questionId,
              ai.is_correct AS isCorrect, ai.response_status AS responseStatus,
              COALESCE(ai.last_answered_at, a.submitted_at, a.created_at) AS seenAt,
              qv.stem_md AS stemMd, qv.domain_slug AS domainSlug, qv.skill_slug AS skillSlug,
              qv.version AS answeredVersion, q.current_version AS currentVersion, q.state AS questionState,
              (SELECT cv.state FROM question_versions cv
                WHERE cv.question_id = ai.question_id AND cv.version = q.current_version) AS currentVersionState,
              (SELECT COUNT(*) FROM attempt_items x
                WHERE x.attempt_id = ai.attempt_id
                  AND (x.part_index < ai.part_index OR (x.part_index = ai.part_index AND x.position <= ai.position))) AS ordinal,
              (SELECT 1 FROM bookmarks b WHERE b.user_id = a.user_id AND b.question_id = ai.question_id) AS bookmarked
         FROM attempt_items ai
         JOIN attempts a ON a.id = ai.attempt_id
         JOIN question_versions qv ON qv.id = ai.question_version_id
         LEFT JOIN questions q ON q.id = ai.question_id
        WHERE a.user_id = ? AND ai.id IN (${placeholders})`,
    )
    .all(userId, ...itemIds)) as DetailRow[];
  return new Map(rows.map((row) => [row.itemId, row]));
}

/**
 * One page of a view. Every view is ordered on a unique key (its date, then
 * the question id), so an unchanged notebook pages without repeating or
 * skipping an entry. A page past the end shows the last page.
 */
export async function buildNotebook(db: Db, userId: string, view: NotebookView, now = new Date(), requestedPage = 1): Promise<NotebookData> {
  const nowIso = now.toISOString();
  const located = (await locate(db, userId, view, nowIso)).filter((row) => row.itemId);
  const pageCount = Math.max(1, Math.ceil(located.length / NOTEBOOK_PAGE));
  const page = Math.min(Math.max(1, Math.floor(requestedPage) || 1), pageCount);
  const offset = (page - 1) * NOTEBOOK_PAGE;
  const visible = located.slice(offset, offset + NOTEBOOK_PAGE);
  const detailById = (await details(db, userId, visible.map((row) => row.itemId)));
  const itemLabels = (await labelsForItems(db, userId, visible.map((row) => row.itemId)));

  const entries: NotebookEntry[] = [];
  for (const row of visible) {
    const detail = detailById.get(row.itemId);
    const config = detail && getExamConfig(detail.examKey);
    if (!detail || !config) continue;
    const labels = labelsFor(config);
    const outcome: Outcome =
      detail.isCorrect === 1 ? 'correct' : detail.responseStatus === 'unanswered' ? 'blank' : detail.isCorrect === 0 ? 'incorrect' : 'not-scored';
    entries.push({
      questionId: detail.questionId,
      examKey: detail.examKey,
      examLabel: examLabel(detail.examKey),
      topicName: labels.domains[detail.domainSlug] ?? detail.domainSlug,
      skillName: labels.skills[detail.skillSlug] ?? detail.skillSlug,
      outcome,
      missCount: row.missCount ?? 0,
      dueAt: row.dueAt,
      seenAt: detail.seenAt,
      attemptId: detail.attemptId,
      ordinal: detail.ordinal,
      attemptItemId: detail.itemId,
      labels: itemLabels.get(detail.itemId) ?? [],
      bookmarked: detail.bookmarked === 1,
      correction:
        detail.questionState !== 'published' || detail.currentVersionState !== 'published'
          ? 'unavailable'
          : (detail.currentVersion ?? 0) > detail.answeredVersion
            ? 'corrected'
            : 'current',
      preview: stemPreview(detail.stemMd),
    });
  }

  // A retry per exam for the misses on this page that can be asked again.
  const retryGroups: RetryGroup[] = [];
  if (view !== 'bookmarked') {
    const byExam = new Map<string, string[]>();
    for (const entry of entries) {
      if (entry.outcome !== 'incorrect' && entry.outcome !== 'blank') continue;
      byExam.set(entry.examKey, [...(byExam.get(entry.examKey) ?? []), entry.questionId]);
    }
    for (const [examKey, questionIds] of byExam) {
      const { available, unavailable } = (await retryCandidates(db, userId, examKey, questionIds));
      if (available.length === 0 && unavailable.length === 0) continue;
      retryGroups.push({
        examKey,
        examLabel: examLabel(examKey),
        questionIds: available.slice(0, MAX_RETRY_QUESTIONS).map((item) => item.questionId),
        unavailable: unavailable.length,
      });
    }
  }

  const next = (await db
    .prepare(
      "SELECT MIN(due_at) AS nextDueAt FROM review_queue WHERE user_id = ? AND last_result <> 'correct' AND due_at > ?",
    )
    .get(userId, nowIso)) as { nextDueAt: string | null };

  return {
    view,
    counts: (await counts(db, userId, nowIso)),
    entries,
    total: located.length,
    page,
    pageCount,
    firstIndex: offset + 1,
    nextDueAt: next.nextDueAt,
    retryGroups,
    labelSummary: (await labelSummary(db, userId)),
  };
}
