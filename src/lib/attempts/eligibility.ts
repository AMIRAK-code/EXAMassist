import type { PoolItem } from '@/lib/assessment/select';
import type { Blueprint } from '@/lib/assessment/types';
import { PUBLIC_SAMPLE_IDS } from '@/lib/content/public-samples';

/**
 * Which questions a format may draw from.
 *
 * This is the single rule behind both what the practice screen says is
 * available and what session creation will actually build. If they used
 * different rules, a format could be advertised as open and then fail, or be
 * hidden when it could run.
 */

/**
 * Formats whose purpose is to measure: diagnostics, simulations and anything
 * timed. A question whose key is public cannot measure anything, so the public
 * sample set is kept out of these. Untimed topic practice is study, and may
 * serve them.
 */
export function isMeasurementFormat(blueprint: Blueprint): boolean {
  return blueprint.mode === 'diagnostic' || blueprint.mode === 'simulation' || blueprint.timing !== 'untimed';
}

/** The candidate pool for one blueprint. Pure: callers query the pool once and filter per blueprint. */
export function eligiblePool(
  pool: readonly PoolItem[],
  blueprint: Blueprint,
  publicSampleIds: ReadonlySet<string> = PUBLIC_SAMPLE_IDS,
): PoolItem[] {
  if (!isMeasurementFormat(blueprint)) return [...pool];
  return pool.filter((item) => !publicSampleIds.has(item.questionId));
}
