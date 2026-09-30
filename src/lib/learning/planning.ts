import type { Db } from '@/lib/db';
import { EXAM_CONFIGS } from '@/lib/exams/registry';
import { chooseExam, examLabel, examsPractised, type ExamChoice } from './dashboard';

/**
 * Which exam the planning views show, and which others they offer: the same
 * rule as the dashboard (the address, then the learner's target exam, then
 * the one they practised most recently), offering every exam they have
 * practised, planned or set a goal for.
 */

export type PlanningView = 'plan' | 'progress';

const PATHS: Record<PlanningView, string> = { plan: '/study-plan', progress: '/study-plan/progress' };

export function planningHref(view: PlanningView, examKey: string | null): string {
  return examKey ? `${PATHS[view]}?exam=${encodeURIComponent(examKey)}` : PATHS[view];
}

export async function planningExam(
  db: Db,
  user: { id: string; targetExamKey: string | null },
  requested: string | string[] | undefined,
  view: PlanningView,
): Promise<{ examKey: string | null; unknownExam: string | null; choices: ExamChoice[] }> {
  const practised = (await examsPractised(db, user.id));
  const { examKey, unknownExam } = chooseExam(requested, user.targetExamKey, practised[0] ?? null);
  const planned = new Set(
    (
      (await db
        .prepare(
          `SELECT exam_key AS examKey FROM plans WHERE user_id = ? AND status = 'active'
           UNION SELECT exam_key FROM exam_targets WHERE user_id = ?`,
        )
        .all(user.id, user.id)) as Array<{ examKey: string }>
    ).map((row) => row.examKey),
  );
  const choices = EXAM_CONFIGS.filter(
    (config) =>
      practised.includes(config.examKey) ||
      planned.has(config.examKey) ||
      config.examKey === user.targetExamKey ||
      config.examKey === examKey,
  ).map((config) => ({
    examKey: config.examKey,
    name: config.name,
    label: examLabel(config.examKey),
    href: planningHref(view, config.examKey),
    current: config.examKey === examKey,
    target: config.examKey === user.targetExamKey,
    practised: practised.includes(config.examKey),
  }));
  return { examKey, unknownExam, choices };
}
