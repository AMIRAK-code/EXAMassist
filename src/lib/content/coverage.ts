import type { Blueprint, BlueprintPart, ExamConfig, SelectionConstraint } from '@/lib/assessment/types';
import { checkBlueprintSufficiency, matchesConstraint, type PoolItem } from '@/lib/assessment/select';
import { eligiblePool, isMeasurementFormat } from '@/lib/attempts/eligibility';
import { resolveParts } from '@/lib/attempts/service';
import { areVariants, NEAR_DUPLICATE, TEMPLATE_VARIANT } from './drafting';
import { eligibleForNewSessions } from './human-review';

/**
 * Blueprint coverage: what the question bank can actually run, and exactly
 * what content is needed next.
 *
 * It replaces a flat "N questions per exam" target. Everything is measured
 * with the engine's own rules: `resolveParts` for what a format asks for,
 * `eligiblePool` for which questions it may use (public samples stay out of
 * measurement formats), `matchesConstraint` and `checkBlueprintSufficiency`
 * for whether it can be filled, and `eligibleForNewSessions` for which
 * questions count at all: published AND human-approved as they stand. The
 * strict approval policy and these reports therefore cannot disagree.
 *
 * Three priorities, in order:
 *   1. Content that blocks a format learners could otherwise use now.
 *   2. Enough for several complete, non-overlapping sets of each format, so a
 *      learner can take it more than once without meeting a question again.
 *      Three sets is a planning target set here, not anything a test maker
 *      requires.
 *   3. Depth for topic practice: a floor of questions per skill and per
 *      difficulty band.
 *
 * Counts are of independent items. Questions sharing a passage are one unit
 * across sets (two sets never share a passage), and near-duplicate variants of
 * one question are one unit (they would measure the same thing twice).
 *
 * Coverage never opens a format by itself: a simulation stays closed while its
 * exam's rules are unverified, whatever the bank holds, and essay formats are
 * outside this plan.
 */

export interface CoveragePlanSettings {
  /** Complete, non-overlapping sets wanted per format. A planning target, not an exam requirement. */
  targetDisjointSets: number;
  topicPractice: {
    /** Independent approved items wanted per skill. */
    minPerSkill: number;
    /** ...and per skill and difficulty band. */
    minPerSkillDifficulty: number;
  };
  /** Stem word overlap at which two items are treated as variants of one (the drafting tool's duplicate threshold). */
  nearDuplicate: number;
  /** The same, with every number masked, to catch the same template with new numbers. */
  templateVariant: number;
}

export const COVERAGE_PLAN: CoveragePlanSettings = {
  targetDisjointSets: 3,
  topicPractice: { minPerSkill: 6, minPerSkillDifficulty: 2 },
  nearDuplicate: NEAR_DUPLICATE,
  templateVariant: TEMPLATE_VARIANT,
};

/** Per-exam adjustments to the plan. Empty: every exam uses the defaults. */
export const COVERAGE_PLAN_OVERRIDES: Readonly<Record<string, Partial<Omit<CoveragePlanSettings, 'topicPractice'>>>> = {};

export function planFor(examKey: string): CoveragePlanSettings {
  return { ...COVERAGE_PLAN, ...(COVERAGE_PLAN_OVERRIDES[examKey] ?? {}) };
}

/** A current question version as the planner sees it. */
export interface CoverageItem extends PoolItem {
  state: string;
  humanApproved: boolean;
  stemMd: string;
}

export type ItemBucket = 'approved' | 'awaiting-human-review' | 'in-automated-review' | 'quarantined' | 'draft' | 'retired';

export function bucketOf(item: Pick<CoverageItem, 'state' | 'humanApproved'>): ItemBucket {
  if (eligibleForNewSessions(item.state, item.state, item.humanApproved)) return 'approved';
  if (item.state === 'published') return 'awaiting-human-review';
  if (item.state === 'in_review') return 'in-automated-review';
  return item.state as ItemBucket;
}

// ---------------------------------------------------------------------------
// Independent units
// ---------------------------------------------------------------------------

/**
 * Groups near-duplicate variants within a domain, by the drafting tool's own
 * rule (`areVariants`): most of the same words, or the same template with
 * different numbers, on the same stimulus or none. Returns the group id (the
 * alphabetically first member's question id) for every item.
 */
export function variantGroups(items: readonly CoverageItem[], plan: CoveragePlanSettings = COVERAGE_PLAN): Map<string, string> {
  const parent = new Map(items.map((item) => [item.questionId, item.questionId]));
  const find = (id: string): string => {
    let root = id;
    while (parent.get(root) !== root) root = parent.get(root)!;
    parent.set(id, root);
    return root;
  };
  const byDomain = new Map<string, CoverageItem[]>();
  for (const item of items) {
    const list = byDomain.get(item.domainSlug) ?? [];
    list.push(item);
    byDomain.set(item.domainSlug, list);
  }
  for (const list of byDomain.values()) {
    for (let i = 0; i < list.length; i += 1) {
      for (let j = i + 1; j < list.length; j += 1) {
        if (areVariants(list[i], list[j], plan)) {
          const a = find(list[i].questionId);
          const b = find(list[j].questionId);
          if (a !== b) parent.set(b < a ? a : b, b < a ? b : a);
        }
      }
    }
  }
  return new Map(items.map((item) => [item.questionId, find(item.questionId)]));
}

// ---------------------------------------------------------------------------
// Non-overlapping sets
// ---------------------------------------------------------------------------

export interface SetBuild {
  /** Sets filled completely, in order. */
  complete: number;
  /** The question ids each attempted set took, complete or not. */
  contents: string[][];
  /** Unfilled slots per part key, summed over every set attempted. */
  deficits: Map<string, number>;
  /** Unfilled slots per part key in the first set only. */
  firstSetDeficits: Map<string, number>;
}

/**
 * Builds up to `sets` complete sets of a format greedily, so that no two sets
 * share a question, a passage or a variant group. Greedy, so a lower bound on
 * what an optimal packing could do: the report never overstates.
 */
export function buildDisjointSets(
  pool: readonly CoverageItem[],
  parts: readonly BlueprintPart[],
  sets: number,
  variantOf: ReadonlyMap<string, string>,
): SetBuild {
  const order = [...pool].sort((a, b) =>
    (a.stimulusId ?? '') === (b.stimulusId ?? '') ? (a.questionId < b.questionId ? -1 : 1) : (a.stimulusId ?? '') < (b.stimulusId ?? '') ? -1 : 1,
  );
  const usedQuestions = new Set<string>();
  const claimedStimuli = new Map<string, number>();
  const claimedVariants = new Set<string>();
  const deficits = new Map<string, number>();
  const firstSetDeficits = new Map<string, number>();
  const contents: string[][] = [];
  let complete = 0;

  for (let set = 0; set < sets; set += 1) {
    let filled = true;
    const setVariants = new Set<string>();
    const taken: string[] = [];
    contents.push(taken);
    for (const part of parts) {
      const candidates = order.filter((item) => {
        if (usedQuestions.has(item.questionId)) return false;
        if (!matchesConstraint(item, part.selection)) return false;
        const owner = item.stimulusId ? claimedStimuli.get(item.stimulusId) : undefined;
        if (owner !== undefined && owner !== set) return false;
        const variant = variantOf.get(item.questionId) ?? item.questionId;
        return !claimedVariants.has(variant) && !setVariants.has(variant);
      });
      // Keep a passage's questions together: items whose passage this set already holds go first.
      candidates.sort((a, b) => Number(claimedStimuli.get(b.stimulusId ?? '') === set) - Number(claimedStimuli.get(a.stimulusId ?? '') === set));
      let filledHere = 0;
      for (const item of candidates) {
        if (filledHere >= part.itemCount) break;
        const variant = variantOf.get(item.questionId) ?? item.questionId;
        if (setVariants.has(variant)) continue;
        usedQuestions.add(item.questionId);
        setVariants.add(variant);
        if (item.stimulusId) claimedStimuli.set(item.stimulusId, set);
        taken.push(item.questionId);
        filledHere += 1;
      }
      const short = part.itemCount - filledHere;
      if (short > 0) {
        filled = false;
        deficits.set(part.key, (deficits.get(part.key) ?? 0) + short);
        if (set === 0) firstSetDeficits.set(part.key, short);
      }
    }
    for (const variant of setVariants) claimedVariants.add(variant);
    if (filled && complete === set) complete += 1;
  }
  return { complete, contents, deficits, firstSetDeficits };
}

// ---------------------------------------------------------------------------
// The report
// ---------------------------------------------------------------------------

export type FormatStatus = 'open' | 'content-short' | 'rules-blocked' | 'essay-out-of-scope';

export interface BlueprintCoverage {
  id: string;
  label: string;
  mode: Blueprint['mode'];
  measurement: boolean;
  status: FormatStatus;
  /** Why the rules keep it closed, as the exam config states it. */
  rulesReason: string | null;
  fidelityNote: string;
  itemsPerSet: number;
  /** The engine's own sufficiency check, on the approved, eligible pool. */
  shortfallNow: number;
  /** The same check if every question awaiting human review were approved. */
  shortfallIfPendingApproved: number;
  /** Complete non-overlapping sets the approved pool fills now: sessions a learner can take without a repeat. */
  disjointSetsNow: number;
  disjointSetsIfPendingApproved: number;
  targetSets: number;
  /** How long selection avoids a question this learner saw (days), per the format's constraint. */
  repeatWindowDays: number;
  /** Parts drawing mostly on passage-based items, and the distinct approved passages they can use. */
  passageParts: Array<{ partKey: string; label: string; approvedPassages: number }>;
}

export interface CoverageNeed {
  priority: 1 | 2 | 3;
  examKey: string;
  /** The pool section items are written against. */
  sectionKey: string;
  domains: string[];
  skills: string[];
  responseTypes: string[];
  difficulties: string[];
  /** Independent approved items still needed. */
  needed: number;
  /** How many of those the questions awaiting human review would supply if approved. */
  coveredByPendingReview: number;
  /** What remains to be written even if everything pending is approved. */
  toAuthor: number;
  /** Formats this helps open or deepen. */
  formats: string[];
  /** Matching items in the automated (AI) review stage, which could join the human queue. */
  inAutomatedReview: number;
  /** Set when most existing items of this constraint hang off a passage, chart or table. */
  stimulus: { questionsPerPassage: number; passagesToWrite: number } | null;
  reason: string;
}

export interface SkillDepth {
  domainSlug: string;
  skillSlug: string;
  approvedUnits: number;
  byDifficulty: Record<'easy' | 'medium' | 'hard', number>;
}

export interface ExamCoverageReport {
  examKey: string;
  examName: string;
  plan: CoveragePlanSettings;
  counts: Record<ItemBucket, number> & { total: number };
  /** Approved items after collapsing near-duplicate variants. */
  approvedIndependent: number;
  variantGroupsWithSeveralMembers: number;
  blueprints: BlueprintCoverage[];
  needs: CoverageNeed[];
  skills: SkillDepth[];
}

function isEssayPart(config: ExamConfig, part: BlueprintPart): boolean {
  const section = config.sections.find((s) => s.key === part.sectionKey);
  return part.selection.responseTypes.includes('essay') || Boolean(section?.responseTypes.every((t) => t === 'essay'));
}

function signature(sectionKey: string, selection: SelectionConstraint): string {
  return [sectionKey, selection.domains.join('|'), selection.skills.join('|'), selection.responseTypes.join('|'), (selection.difficulties ?? []).join('|')].join('::');
}

function poolSectionOf(config: ExamConfig, part: BlueprintPart): string {
  const section = config.sections.find((s) => s.key === part.sectionKey);
  return section?.poolSectionKey ?? part.sectionKey;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

export function buildCoverageReport(
  config: ExamConfig,
  items: readonly CoverageItem[],
  options: { publicSampleIds?: ReadonlySet<string>; plan?: CoveragePlanSettings } = {},
): ExamCoverageReport {
  const plan = options.plan ?? planFor(config.examKey);
  const variantOf = variantGroups(items, plan);
  const approved = items.filter((item) => bucketOf(item) === 'approved');
  const pending = items.filter((item) => bucketOf(item) === 'awaiting-human-review');
  const inAutomated = items.filter((item) => bucketOf(item) === 'in-automated-review');
  const approvedOrPending = [...approved, ...pending];

  const counts = { approved: 0, 'awaiting-human-review': 0, 'in-automated-review': 0, quarantined: 0, draft: 0, retired: 0, total: items.length };
  for (const item of items) counts[bucketOf(item)] += 1;

  const groupSizes = new Map<string, number>();
  for (const item of items) groupSizes.set(variantOf.get(item.questionId)!, (groupSizes.get(variantOf.get(item.questionId)!) ?? 0) + 1);

  // Need per constraint signature: the largest across formats (different
  // formats may reuse the same questions), split by priority.
  const needs = new Map<string, CoverageNeed>();
  const addNeed = (
    priority: 1 | 2,
    part: BlueprintPart,
    blueprint: Blueprint,
    needed: number,
    stillShort: number,
  ) => {
    if (needed <= 0) return;
    const sectionKey = poolSectionOf(config, part);
    const key = `${priority}#${signature(sectionKey, part.selection)}`;
    const existing = needs.get(key);
    if (existing) {
      if (!existing.formats.includes(blueprint.id)) existing.formats.push(blueprint.id);
      if (needed > existing.needed) {
        existing.needed = needed;
        existing.toAuthor = stillShort;
        existing.coveredByPendingReview = Math.max(0, needed - stillShort);
      }
      return;
    }
    needs.set(key, {
      priority,
      examKey: config.examKey,
      sectionKey,
      domains: part.selection.domains,
      skills: part.selection.skills,
      responseTypes: part.selection.responseTypes,
      difficulties: part.selection.difficulties ?? [],
      needed,
      coveredByPendingReview: Math.max(0, needed - stillShort),
      toAuthor: stillShort,
      formats: [blueprint.id],
      inAutomatedReview: inAutomated.filter((item) => matchesConstraint(item, part.selection)).length,
      stimulus: null,
      reason: '',
    });
  };

  const blueprints: BlueprintCoverage[] = config.blueprints.map((blueprint) => {
    const parts = resolveParts(blueprint, {}, config);
    const essay = parts.some((part) => isEssayPart(config, part));
    const rulesBlocked = blueprint.mode === 'simulation' && !config.capabilities.fullSimulation.available;
    const pool = eligiblePool(approved, blueprint, options.publicSampleIds) as CoverageItem[];
    const widerPool = eligiblePool(approvedOrPending, blueprint, options.publicSampleIds) as CoverageItem[];
    const now = checkBlueprintSufficiency(pool, parts);
    const ifPending = checkBlueprintSufficiency(widerPool, parts);
    const target = plan.targetDisjointSets;
    const sets = buildDisjointSets(pool, parts, target, variantOf);
    const setsIfPending = buildDisjointSets(widerPool, parts, target, variantOf);
    const status: FormatStatus = essay ? 'essay-out-of-scope' : rulesBlocked ? 'rules-blocked' : now.sufficient ? 'open' : 'content-short';

    if (!essay) {
      for (const part of parts) {
        const first = sets.firstSetDeficits.get(part.key) ?? 0;
        const all = sets.deficits.get(part.key) ?? 0;
        const firstPending = setsIfPending.firstSetDeficits.get(part.key) ?? 0;
        const allPending = setsIfPending.deficits.get(part.key) ?? 0;
        // Priority 1 only where content is all that keeps a format closed.
        if (!rulesBlocked) addNeed(1, part, blueprint, first, firstPending);
        addNeed(2, part, blueprint, rulesBlocked ? all : all - first, rulesBlocked ? allPending : allPending - firstPending);
      }
    }

    const passageParts = parts
      .map((part) => {
        const matching = items.filter((item) => matchesConstraint(item, part.selection));
        const withPassage = matching.filter((item) => item.stimulusId).length;
        return { part, share: matching.length ? withPassage / matching.length : 0 };
      })
      .filter(({ share }) => share >= 0.5)
      .map(({ part }) => ({
        partKey: part.key,
        label: part.label,
        approvedPassages: new Set(pool.filter((item) => item.stimulusId && matchesConstraint(item, part.selection)).map((item) => item.stimulusId)).size,
      }));

    return {
      id: blueprint.id,
      label: blueprint.label,
      mode: blueprint.mode,
      measurement: isMeasurementFormat(blueprint),
      status,
      rulesReason: rulesBlocked ? (config.capabilities.fullSimulation as { reason: string }).reason : null,
      fidelityNote: blueprint.fidelityNote,
      itemsPerSet: parts.reduce((sum, part) => sum + part.itemCount, 0),
      shortfallNow: now.shortfall,
      shortfallIfPendingApproved: ifPending.shortfall,
      disjointSetsNow: buildDisjointSets(pool, parts, 20, variantOf).complete,
      disjointSetsIfPendingApproved: buildDisjointSets(widerPool, parts, 20, variantOf).complete,
      targetSets: target,
      repeatWindowDays: parts[0]?.selection.avoidSeenWithinDays ?? 0,
      passageParts,
    };
  });

  // Priority 3: topic depth per skill, essay sections aside.
  const skills: SkillDepth[] = [];
  const unitsOf = (list: readonly CoverageItem[]) => new Set(list.map((item) => variantOf.get(item.questionId))).size;
  for (const domain of config.domains) {
    const section = config.sections.find((s) => s.key === domain.sectionKey);
    if (section?.responseTypes.every((t) => t === 'essay')) continue;
    for (const skill of domain.skills) {
      const mine = approved.filter((item) => item.domainSlug === domain.slug && item.skillSlug === skill.slug);
      const minePending = approvedOrPending.filter((item) => item.domainSlug === domain.slug && item.skillSlug === skill.slug);
      const band = (list: readonly CoverageItem[], d: string) => unitsOf(list.filter((item) => item.difficulty === d));
      const depth: SkillDepth = {
        domainSlug: domain.slug,
        skillSlug: skill.slug,
        approvedUnits: unitsOf(mine),
        byDifficulty: { easy: band(mine, 'easy'), medium: band(mine, 'medium'), hard: band(mine, 'hard') },
      };
      skills.push(depth);
      const shortBy = (list: readonly CoverageItem[]) => {
        const bands = (['easy', 'medium', 'hard'] as const).reduce(
          (sum, d) => sum + Math.max(0, plan.topicPractice.minPerSkillDifficulty - band(list, d)),
          0,
        );
        return Math.max(plan.topicPractice.minPerSkill - unitsOf(list), bands);
      };
      const needed = shortBy(mine);
      if (needed > 0) {
        const stillShort = shortBy(minePending);
        const selection = { domains: [domain.slug], skills: [skill.slug] };
        needs.set(`3#${domain.slug}::${skill.slug}`, {
          priority: 3,
          examKey: config.examKey,
          sectionKey: domain.sectionKey,
          domains: selection.domains,
          skills: selection.skills,
          responseTypes: [],
          difficulties: (['easy', 'medium', 'hard'] as const).filter((d) => depth.byDifficulty[d] < plan.topicPractice.minPerSkillDifficulty),
          needed,
          coveredByPendingReview: Math.max(0, needed - stillShort),
          toAuthor: stillShort,
          formats: ['practice'],
          inAutomatedReview: inAutomated.filter((item) => item.domainSlug === domain.slug && item.skillSlug === skill.slug).length,
          stimulus: null,
          reason: '',
        });
      }
    }
  }

  // Passage requirements and reasons, now that the counts are final.
  for (const need of needs.values()) {
    const selection: SelectionConstraint = {
      sectionKey: '*',
      domains: need.domains,
      skills: need.skills,
      responseTypes: need.responseTypes as SelectionConstraint['responseTypes'],
      difficulties: undefined,
      difficultyMix: null,
      allowRepeatsWithinAttempt: false,
      avoidSeenWithinDays: 0,
    };
    const matching = items.filter((item) => item.sectionKey === need.sectionKey && matchesConstraint(item, selection));
    const withPassage = matching.filter((item) => item.stimulusId);
    if (matching.length > 0 && withPassage.length / matching.length >= 0.5) {
      const perPassage = new Map<string, number>();
      for (const item of withPassage) perPassage.set(item.stimulusId!, (perPassage.get(item.stimulusId!) ?? 0) + 1);
      const questionsPerPassage = Math.max(1, median([...perPassage.values()]));
      need.stimulus = { questionsPerPassage, passagesToWrite: Math.ceil(need.toAuthor / questionsPerPassage) };
    }
    need.reason =
      need.priority === 1
        ? `Blocks ${need.formats.join(', ')}: the approved pool cannot fill one set.`
        : need.priority === 2
          ? `For ${plan.targetDisjointSets} non-overlapping sets of ${need.formats.join(', ')}.`
          : `Topic practice floor: ${plan.topicPractice.minPerSkill} per skill, ${plan.topicPractice.minPerSkillDifficulty} per difficulty band.`;
  }

  return {
    examKey: config.examKey,
    examName: config.name,
    plan,
    counts,
    approvedIndependent: unitsOf(approved),
    variantGroupsWithSeveralMembers: [...groupSizes.values()].filter((n) => n > 1).length,
    blueprints,
    needs: [...needs.values()].sort((a, b) => a.priority - b.priority || b.needed - a.needed),
    skills,
  };
}
