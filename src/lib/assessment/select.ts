import type { BlueprintPart, SelectionConstraint } from './types';

/**
 * Deterministic question selection.
 *
 * Selection is seeded so a given (attempt seed, part) always yields the same
 * questions in the same order. The chosen order is *also* persisted to the
 * database, so a refresh replays stored rows rather than re-running selection -
 * the seed exists so selection is reproducible and debuggable, not as the
 * mechanism for surviving a refresh.
 */

export interface PoolItem {
  questionVersionId: string;
  questionId: string;
  sectionKey: string;
  domainSlug: string;
  skillSlug: string;
  responseType: string;
  difficulty: 'easy' | 'medium' | 'hard';
  stimulusId: string | null;
  /** ISO timestamp of when this learner last saw the question, if ever. */
  lastSeenAt: string | null;
}

// ---------------------------------------------------------------------------
// Seeded randomness
// ---------------------------------------------------------------------------

/** FNV-1a, for turning an attempt seed string into a 32-bit number. */
export function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export type Rng = () => number;

/** mulberry32: small, fast, and stable across platforms and Node versions. */
export function createRng(seed: string): Rng {
  let state = hashSeed(seed);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const a = copy[i];
    const b = copy[j];
    copy[i] = b;
    copy[j] = a;
  }
  return copy;
}

// ---------------------------------------------------------------------------
// Filtering and selection
// ---------------------------------------------------------------------------

/** A selection constraint may target every section of the exam. */
export const ANY_SECTION = '*';

export function matchesConstraint(item: PoolItem, constraint: SelectionConstraint): boolean {
  if (constraint.sectionKey !== ANY_SECTION && item.sectionKey !== constraint.sectionKey) return false;
  if (constraint.domains.length > 0 && !constraint.domains.includes(item.domainSlug)) return false;
  if (constraint.skills.length > 0 && !constraint.skills.includes(item.skillSlug)) return false;
  if (constraint.responseTypes.length > 0 && !constraint.responseTypes.includes(item.responseType as never)) {
    return false;
  }
  return true;
}

/**
 * Ranks candidates so that questions the learner has not seen recently come
 * first, then rarely-seen ones, with ties broken by the seeded shuffle.
 */
function freshnessBuckets(
  candidates: PoolItem[],
  avoidSeenWithinDays: number,
  now: Date,
): { fresh: PoolItem[]; stale: PoolItem[] } {
  if (avoidSeenWithinDays <= 0) return { fresh: candidates, stale: [] };
  const cutoff = now.getTime() - avoidSeenWithinDays * 24 * 60 * 60 * 1000;
  const fresh: PoolItem[] = [];
  const stale: PoolItem[] = [];
  for (const item of candidates) {
    const seen = item.lastSeenAt ? new Date(item.lastSeenAt).getTime() : null;
    if (seen !== null && seen >= cutoff) stale.push(item);
    else fresh.push(item);
  }
  return { fresh, stale };
}

export interface SelectionResult {
  items: PoolItem[];
  /** True when the pool could not satisfy the requested count. */
  short: boolean;
  requested: number;
  /** Requested-minus-delivered, per difficulty band, when a mix was requested. */
  unmetMix: Record<string, number>;
  notes: string[];
}

/**
 * Picks `count` items for one part.
 *
 * Never returns the same question twice within an attempt (unless the
 * constraint explicitly allows it), and never returns a question already used
 * by an earlier part of the same attempt.
 */
export function selectItems(
  pool: readonly PoolItem[],
  constraint: SelectionConstraint,
  count: number,
  rng: Rng,
  options: { alreadyUsedQuestionIds?: ReadonlySet<string>; now?: Date } = {},
): SelectionResult {
  const used = new Set(options.alreadyUsedQuestionIds ?? []);
  const now = options.now ?? new Date();
  const notes: string[] = [];

  let candidates = pool.filter((item) => matchesConstraint(item, constraint));
  if (!constraint.allowRepeatsWithinAttempt) {
    candidates = candidates.filter((item) => !used.has(item.questionId));
  }

  const { fresh, stale } = freshnessBuckets(candidates, constraint.avoidSeenWithinDays, now);
  if (stale.length > 0 && fresh.length < count) {
    notes.push(
      `Reused ${Math.min(stale.length, count - fresh.length)} question(s) you have seen in the last ` +
        `${constraint.avoidSeenWithinDays} days because the reviewed pool is small.`,
    );
  }
  const ordered = [...shuffle(fresh, rng), ...shuffle(stale, rng)];

  const chosen: PoolItem[] = [];
  const unmetMix: Record<string, number> = {};
  const take = (item: PoolItem) => {
    chosen.push(item);
    used.add(item.questionId);
  };

  if (constraint.difficultyMix) {
    const wanted: Array<['easy' | 'medium' | 'hard', number]> = [
      ['easy', constraint.difficultyMix.easy],
      ['medium', constraint.difficultyMix.medium],
      ['hard', constraint.difficultyMix.hard],
    ];
    for (const [band, quota] of wanted) {
      let filled = 0;
      for (const item of ordered) {
        if (filled >= quota) break;
        if (item.difficulty !== band) continue;
        if (used.has(item.questionId)) continue;
        take(item);
        filled += 1;
      }
      if (filled < quota) unmetMix[band] = quota - filled;
    }
    // Backfill any shortfall with whatever remains, so a thin pool still yields
    // a usable session rather than nothing.
    for (const item of ordered) {
      if (chosen.length >= count) break;
      if (used.has(item.questionId)) continue;
      take(item);
    }
    if (Object.keys(unmetMix).length > 0) {
      notes.push('The requested difficulty mix could not be met exactly from the reviewed pool.');
    }
  } else {
    for (const item of ordered) {
      if (chosen.length >= count) break;
      if (used.has(item.questionId)) continue;
      take(item);
    }
  }

  return {
    items: groupByStimulus(chosen.slice(0, count), rng),
    short: chosen.length < count,
    requested: count,
    unmetMix,
    notes,
  };
}

/**
 * Keeps questions that share a passage or chart adjacent and in a stable order,
 * so a learner never reads the same passage twice in one session.
 */
export function groupByStimulus(items: readonly PoolItem[], rng: Rng): PoolItem[] {
  const groups = new Map<string, PoolItem[]>();
  const singles: PoolItem[] = [];

  for (const item of items) {
    if (item.stimulusId === null) {
      singles.push(item);
      continue;
    }
    const bucket = groups.get(item.stimulusId);
    if (bucket) bucket.push(item);
    else groups.set(item.stimulusId, [item]);
  }

  const blocks: PoolItem[][] = [...groups.values(), ...singles.map((s) => [s])];
  return shuffle(blocks, rng).flat();
}

// ---------------------------------------------------------------------------
// Content-volume gating
// ---------------------------------------------------------------------------

export interface PartSufficiency {
  partKey: string;
  requested: number;
  available: number;
  sufficient: boolean;
}

export interface BlueprintSufficiency {
  sufficient: boolean;
  parts: PartSufficiency[];
  shortfall: number;
}

/**
 * Whether the reviewed pool can fill a blueprint without repeating a question.
 *
 * This is what stops a "full-length simulation" from quietly recycling the same
 * twenty items. A blueprint that fails this check is not offered.
 */
export function checkBlueprintSufficiency(
  pool: readonly PoolItem[],
  parts: readonly BlueprintPart[],
): BlueprintSufficiency {
  const claimed = new Set<string>();
  const results: PartSufficiency[] = [];

  for (const part of parts) {
    const candidates = pool.filter(
      (item) => matchesConstraint(item, part.selection) && !claimed.has(item.questionId),
    );
    const available = candidates.length;
    const usable = Math.min(available, part.itemCount);
    for (let i = 0; i < usable; i += 1) {
      claimed.add(candidates[i].questionId);
    }
    results.push({
      partKey: part.key,
      requested: part.itemCount,
      available,
      sufficient: available >= part.itemCount,
    });
  }

  const shortfall = results.reduce((sum, r) => sum + Math.max(0, r.requested - r.available), 0);
  return { sufficient: shortfall === 0, parts: results, shortfall };
}
