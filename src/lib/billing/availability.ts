import type { Db } from '@/lib/db';
import type { Blueprint, ExamConfig } from '@/lib/assessment/types';
import { blueprintAvailability, type BlueprintAvailability } from '@/lib/attempts/availability';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';

/**
 * Whether a Single Exam Pass can be sold for an exam: only when the exam has
 * at least one paid practice format open right now.
 *
 * "Open" is decided by the engine's own availability check
 * (src/lib/attempts/availability.ts): the format's rules are verified and the
 * pool of published questions with a standing human approval
 * (src/lib/content/human-review.ts) can fill it. Starting such a session would
 * succeed, so the pass delivers something on the day it is bought.
 *
 * A paid practice format here is topic practice, a timed section or a
 * full-length simulation. Not counted: the diagnostic (its free version is
 * free for everyone, and fresh diagnostics alone are too thin to sell a pass
 * on), the review mode, and formats made only of essays (never scored; outside
 * the coverage plan).
 *
 * Checked on the server when a pass checkout is created, and shown on the
 * pricing and checkout pages, with the reason, for every exam.
 */

export interface ExamSaleStatus {
  examKey: string;
  /** A pass may be sold for this exam now. */
  sellable: boolean;
  /** Ids of the paid practice formats that are open now. */
  openFormats: string[];
}

function isEssayOnly(config: ExamConfig, blueprint: Blueprint): boolean {
  return (
    blueprint.parts.length > 0 &&
    blueprint.parts.every((part) => {
      const section = config.sections.find((s) => s.key === part.sectionKey);
      const types = part.selection.responseTypes.length > 0 ? part.selection.responseTypes : (section?.responseTypes ?? []);
      return types.length > 0 && types.every((type) => type === 'essay');
    })
  );
}

/** Whether a format is one a pass is sold for (see above). */
export function isPaidPracticeFormat(config: ExamConfig, blueprint: Blueprint): boolean {
  return (blueprint.mode === 'practice' || blueprint.mode === 'simulation') && !isEssayOnly(config, blueprint);
}

/** The sale status from availability already computed for the exam. */
export function saleStatusFrom(config: ExamConfig, availability: readonly BlueprintAvailability[]): ExamSaleStatus {
  const openFormats = availability
    .filter((entry) => entry.available && isPaidPracticeFormat(config, entry.blueprint))
    .map((entry) => entry.blueprint.id);
  return { examKey: config.examKey, sellable: openFormats.length > 0, openFormats };
}

/** One exam's sale status, or null for an exam this site does not have. */
export async function examSaleStatus(db: Db, examKey: string): Promise<ExamSaleStatus | null> {
  const config = getExamConfig(examKey);
  if (!config) return null;
  return saleStatusFrom(config, await blueprintAvailability(db, config));
}

/** Every exam's sale status, in the registry's order. */
export async function allExamSaleStatuses(db: Db): Promise<ExamSaleStatus[]> {
  const statuses: ExamSaleStatus[] = [];
  for (const config of EXAM_CONFIGS) statuses.push(saleStatusFrom(config, await blueprintAvailability(db, config)));
  return statuses;
}
