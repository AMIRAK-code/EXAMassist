import type { Db } from '@/lib/db';
import { AttemptError } from '@/lib/attempts/service';

/**
 * Mistake labels (migration 005).
 *
 * Optional, editable, and chosen only by the learner. Nothing here reads a
 * learner's answer and guesses why they missed it: two learners choosing the
 * same wrong option can have entirely different reasons, and only they know.
 * Labels are private, change no score or result, and do not affect the review
 * schedule.
 */

export const MISTAKE_LABELS = [
  { key: 'concept', text: 'I did not know how to do it' },
  { key: 'misread', text: 'I misread the question' },
  { key: 'slip', text: 'A slip or a calculation error' },
  { key: 'rushed', text: 'I rushed or ran out of time' },
  { key: 'guessed', text: 'I guessed' },
] as const;

export type MistakeLabel = (typeof MISTAKE_LABELS)[number]['key'];

const KEYS = new Set<string>(MISTAKE_LABELS.map((label) => label.key));

export function isMistakeLabel(value: unknown): value is MistakeLabel {
  return typeof value === 'string' && KEYS.has(value);
}

export function labelText(key: MistakeLabel): string {
  return MISTAKE_LABELS.find((label) => label.key === key)!.text;
}

/**
 * Replaces the labels on one missed question in one finished session. The item
 * must be the learner's own, in a finished attempt, and a miss (wrong or
 * blank); anything else is refused. Unknown labels are ignored.
 */
export async function setMistakeLabels(
  db: Db,
  input: { userId: string; attemptItemId: string; labels: readonly unknown[]; now?: Date },
): Promise<MistakeLabel[]> {
  const item = (await db
    .prepare(
      `SELECT ai.is_correct AS isCorrect, ai.response_status AS responseStatus
         FROM attempt_items ai
         JOIN attempts a ON a.id = ai.attempt_id
        WHERE ai.id = ? AND a.user_id = ? AND a.status IN ('submitted', 'expired')`,
    )
    .get(input.attemptItemId, input.userId)) as { isCorrect: 0 | 1 | null; responseStatus: string } | undefined;
  if (!item) throw new AttemptError('not-found', 'That question is not in one of your finished sessions.', 404);
  if (!(item.isCorrect === 0 || item.responseStatus === 'unanswered')) {
    throw new AttemptError('not-a-mistake', 'Only a question you got wrong or left blank can be labelled.', 409);
  }

  const labels = [...new Set(input.labels.filter(isMistakeLabel))];
  const now = (input.now ?? new Date()).toISOString();
  const write = db.transaction(async () => {
    (await db.prepare('DELETE FROM mistake_labels WHERE attempt_item_id = ? AND user_id = ?').run(input.attemptItemId, input.userId));
    const insert = db.prepare(
      'INSERT INTO mistake_labels (attempt_item_id, user_id, label, created_at) VALUES (?, ?, ?, ?)',
    );
    for (const label of labels) (await insert.run(input.attemptItemId, input.userId, label, now));
  });
  (await write());
  return labels;
}

/** The learner's labels on the given attempt items. */
export async function labelsForItems(db: Db, userId: string, attemptItemIds: readonly string[]): Promise<Map<string, MistakeLabel[]>> {
  const result = new Map<string, MistakeLabel[]>();
  if (attemptItemIds.length === 0) return result;
  const placeholders = attemptItemIds.map(() => '?').join(',');
  const rows = (await db
    .prepare(
      `SELECT attempt_item_id AS itemId, label FROM mistake_labels
        WHERE user_id = ? AND attempt_item_id IN (${placeholders})`,
    )
    .all(userId, ...attemptItemIds)) as Array<{ itemId: string; label: string }>;
  for (const row of rows) {
    if (!isMistakeLabel(row.label)) continue;
    const list = result.get(row.itemId) ?? [];
    list.push(row.label);
    result.set(row.itemId, list);
  }
  for (const list of result.values()) list.sort((a, b) => MISTAKE_LABELS.findIndex((l) => l.key === a) - MISTAKE_LABELS.findIndex((l) => l.key === b));
  return result;
}

/** How often the learner has used each label, most used first. */
export async function labelSummary(db: Db, userId: string): Promise<Array<{ key: MistakeLabel; text: string; count: number }>> {
  const rows = (await db
    .prepare('SELECT label, COUNT(*) AS n FROM mistake_labels WHERE user_id = ? GROUP BY label')
    .all(userId)) as Array<{ label: string; n: number }>;
  return rows
    .filter((row) => isMistakeLabel(row.label))
    .map((row) => ({ key: row.label as MistakeLabel, text: labelText(row.label as MistakeLabel), count: row.n }))
    .sort((a, b) => b.count - a.count);
}
