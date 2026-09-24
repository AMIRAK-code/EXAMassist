import type { Db } from '@/lib/db';
import { getPool } from '@/lib/content/repository';
import { checkBlueprintSufficiency, matchesConstraint, type PoolItem } from '@/lib/assessment/select';
import type { Blueprint, ExamConfig } from '@/lib/assessment/types';
import { getBlueprint } from '@/lib/exams/registry';
import { eligiblePool } from './eligibility';
import type { PracticeFacet } from './facets';
import { resolveParts } from './service';

/**
 * Whether each practice format can actually be offered right now.
 *
 * Two independent gates, and both must pass:
 *  1. Rules  - is the exam's behaviour verified well enough to run this format?
 *              (config.capabilities, decided from the research record)
 *  2. Content - does the reviewed question bank hold enough distinct items to
 *              fill the blueprint without repeating a question?
 *
 * A format that fails either gate is not offered, and the reason is shown
 * rather than hidden. That is what keeps a thin bank from being dressed up as
 * a full-length simulation.
 */

export interface BlueprintAvailability {
  blueprint: Blueprint;
  available: boolean;
  /** 'rules' or 'content', when unavailable. */
  blockedBy: 'rules' | 'content' | null;
  reason: string | null;
  itemsRequested: number;
  itemsAvailable: number;
  shortfall: number;
}

export function blueprintAvailability(db: Db, config: ExamConfig): BlueprintAvailability[] {
  return availabilityFromPool(getPool(db, config.examKey, null), config);
}

/**
 * Availability from an already-loaded pool. Each blueprint is judged against
 * `eligiblePool`, the same rule session creation applies, so a format is shown
 * as open exactly when starting it would succeed.
 */
export function availabilityFromPool(
  rawPool: readonly PoolItem[],
  config: ExamConfig,
  publicSampleIds?: ReadonlySet<string>,
): BlueprintAvailability[] {
  return config.blueprints.map((blueprint) => {
    const pool = eligiblePool(rawPool, blueprint, publicSampleIds);
    if (blueprint.mode === 'simulation' && !config.capabilities.fullSimulation.available) {
      return {
        blueprint,
        available: false,
        blockedBy: 'rules',
        reason: (config.capabilities.fullSimulation as { reason: string }).reason,
        itemsRequested: blueprint.parts.reduce((n, p) => n + p.itemCount, 0),
        itemsAvailable: pool.length,
        shortfall: 0,
      };
    }

    const parts = resolveParts(blueprint, {}, config);
    const check = checkBlueprintSufficiency(pool, parts);
    const requested = parts.reduce((n, p) => n + p.itemCount, 0);

    return {
      blueprint,
      available: check.sufficient,
      blockedBy: check.sufficient ? null : 'content',
      reason: check.sufficient
        ? null
        : `This format needs ${requested} reviewed questions and the bank currently holds ` +
          `${Math.max(0, requested - check.shortfall)} that fit it. It will open as the bank grows.`,
      itemsRequested: requested,
      itemsAvailable: Math.max(0, requested - check.shortfall),
      shortfall: check.shortfall,
    };
  });
}

export interface ExamCoverage {
  examKey: string;
  publishedItems: number;
  domainsCovered: number;
  domainsTotal: number;
  coveredDomainSlugs: string[];
}

/** Content coverage for an exam, shown publicly so bank size is never hidden. */
export function examCoverage(db: Db, config: ExamConfig): ExamCoverage {
  const pool = getPool(db, config.examKey, null);
  const covered = new Set(pool.map((item) => item.domainSlug));
  return {
    examKey: config.examKey,
    publishedItems: pool.length,
    domainsCovered: covered.size,
    domainsTotal: config.domains.length,
    coveredDomainSlugs: [...covered],
  };
}

/** Domains that currently have at least one reviewed question. */
export function practisableDomains(db: Db, config: ExamConfig) {
  const pool = getPool(db, config.examKey, null);
  const counts = new Map<string, number>();
  for (const item of pool) {
    counts.set(item.domainSlug, (counts.get(item.domainSlug) ?? 0) + 1);
  }
  return config.domains
    .map((domain) => ({
      slug: domain.slug,
      name: domain.name,
      sectionKey: domain.sectionKey,
      count: counts.get(domain.slug) ?? 0,
    }))
    .filter((domain) => domain.count > 0);
}

/**
 * The practice pool grouped by domain, skill and difficulty, for the setup
 * form's live counts. Built from the same eligible pool and the same base
 * constraint that `startAttempt` validates a practice request against.
 */
export function practiceFacets(db: Db, config: ExamConfig, blueprintId = 'practice'): PracticeFacet[] {
  const blueprint = getBlueprint(config, blueprintId);
  if (!blueprint) return [];
  return facetsFromPool(getPool(db, config.examKey, null), config, blueprint);
}

export function facetsFromPool(rawPool: readonly PoolItem[], config: ExamConfig, blueprint: Blueprint): PracticeFacet[] {
  const [base] = resolveParts(blueprint, {}, config);
  if (!base) return [];
  const groups = new Map<string, PracticeFacet>();
  for (const item of eligiblePool(rawPool, blueprint)) {
    if (!matchesConstraint(item, base.selection)) continue;
    const key = `${item.domainSlug}|${item.skillSlug}|${item.difficulty}`;
    const group = groups.get(key);
    if (group) group.count += 1;
    else groups.set(key, { domainSlug: item.domainSlug, skillSlug: item.skillSlug, difficulty: item.difficulty, count: 1 });
  }
  return [...groups.values()];
}
