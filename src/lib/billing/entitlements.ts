import type { Db } from '@/lib/db';
import { assertBillingConfig, pricingPath, type BillingSettings } from './config';
import {
  ACCESS_POLICY,
  DIAGNOSTIC_NEEDS_ACCOUNT,
  PLANS,
  isFreeFeature,
  suggestedPlanFor,
  type Feature,
  type PlanKey,
} from './plans';
import { listPasses, listSubscriptions, storeSubscription, type PassRow, type SubscriptionRow } from './store';
import type { StripeApi } from './stripe';

/**
 * Who may use what: the one helper server code asks before it starts a paid
 * session, opens the study plan or calls the AI tutor.
 *
 * The decision is made from the local copy of the learner's subscriptions and
 * passes, so it costs two queries and never waits on Stripe. `decideAccess`
 * is pure and holds every rule; `loadEntitlements` gathers its inputs.
 *
 *   billing not enforced  -> everything is open (as before billing existed)
 *   editor or admin       -> everything is open
 *   free feature          -> open (the diagnostic needs an account; see plans.ts)
 *   otherwise             -> a live grant whose plan includes the feature and
 *                            covers the exam:
 *                              Single Exam Pass  its one exam, from the confirmed
 *                                                payment to the end of its term
 *                              Plus              every exam, while subscribed
 *                              earlier plans     exactly what they were sold with
 *                                                (the first Premium and All access
 *                                                keep the AI tutor) until they end
 */

export interface Grant {
  /** A renewing subscription, or a Single Exam Pass paid once. */
  kind: 'subscription' | 'pass';
  /** The Stripe subscription id, or the pass's invoice id. */
  id: string;
  plan: PlanKey;
  /** The exam a one-exam plan covers; null for an all-exams plan. */
  examKey: string | null;
  /** Stripe's subscription status, or the pass status (pending, paid, void, refunded). */
  status: string;
  /** End of the paid period (subscription) or of the access term (pass). */
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  /** The Stripe price it was bought at. */
  lookupKey: string | null;
}

export interface Subject {
  role: 'learner' | 'editor' | 'admin';
  isGuest: boolean;
  grants: Grant[];
}

export type DecisionReason =
  | 'billing-off'
  | 'staff'
  | 'free'
  | 'subscription'
  | 'pass'
  | 'account-required'
  | 'upgrade-required';

export interface Decision {
  allowed: boolean;
  reason: DecisionReason;
  /** The subscription or pass that grants it, when one does. */
  grant?: Grant;
  /** Where to send a learner who is refused: the pricing page for this exam. */
  upgradeHref?: string;
  /** The plan on sale that would open it, if any does. */
  suggestedPlan?: PlanKey | null;
}

/** Whether a grant gives access now (ACCESS_POLICY in plans.ts for subscriptions; the paid term for a pass). */
export function grantIsLive(grant: Pick<Grant, 'status' | 'currentPeriodEnd'> & { kind?: Grant['kind'] }, now = new Date()): boolean {
  const end = grant.currentPeriodEnd ? new Date(grant.currentPeriodEnd).getTime() : null;
  if (grant.kind === 'pass') {
    // Paid once, for a fixed term: no renewal, so no grace and no open end.
    return grant.status === 'paid' && end !== null && now.getTime() < end;
  }
  if (ACCESS_POLICY.grantingStatuses.includes(grant.status)) {
    return end === null || now.getTime() < end + ACCESS_POLICY.renewalGraceHours * 3_600_000;
  }
  if (grant.status === 'past_due' && ACCESS_POLICY.pastDueKeepsAccessUntilPeriodEnd) {
    return end !== null && now.getTime() < end;
  }
  return false;
}

export function grantCovers(grant: Grant, feature: Feature, examKey: string | null): boolean {
  const plan = PLANS[grant.plan];
  if (!plan || !plan.features.includes(feature)) return false;
  if (plan.scope === 'all-exams') return true;
  return grant.examKey !== null && grant.examKey === examKey;
}

/**
 * The whole rule. `examKey` is the exam the feature is used for; a feature
 * that is not about one exam passes null, and only an all-exams plan covers it.
 */
export function decideAccess(input: {
  enforced: boolean;
  subject: Subject | null;
  feature: Feature;
  examKey: string | null;
  now?: Date;
}): Decision {
  const { enforced, subject, feature, examKey } = input;
  if (!enforced) return { allowed: true, reason: 'billing-off' };
  if (subject && (subject.role === 'admin' || subject.role === 'editor')) return { allowed: true, reason: 'staff' };

  const upgrade = { upgradeHref: pricingPath(examKey, feature), suggestedPlan: suggestedPlanFor(feature, examKey) };
  if (isFreeFeature(feature)) {
    if (feature === 'diagnostic' && DIAGNOSTIC_NEEDS_ACCOUNT && (!subject || subject.isGuest)) {
      return { allowed: false, reason: 'account-required', ...upgrade };
    }
    return { allowed: true, reason: 'free' };
  }
  if (!subject) return { allowed: false, reason: 'account-required', ...upgrade };

  const now = input.now ?? new Date();
  const grant = subject.grants.find((g) => grantIsLive(g, now) && grantCovers(g, feature, examKey));
  if (grant) return { allowed: true, reason: grant.kind === 'pass' ? 'pass' : 'subscription', grant };
  return { allowed: false, reason: 'upgrade-required', ...upgrade };
}

export function toGrant(row: SubscriptionRow): Grant {
  return {
    kind: 'subscription',
    id: row.stripe_subscription_id,
    plan: row.plan,
    examKey: row.exam_key,
    status: row.status,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: Number(row.cancel_at_period_end) === 1,
    lookupKey: row.price_lookup_key,
  };
}

export function passToGrant(row: PassRow): Grant {
  return {
    kind: 'pass',
    id: row.stripe_invoice_id,
    plan: row.plan,
    examKey: row.exam_key,
    status: row.status,
    currentPeriodEnd: row.access_ends_at,
    cancelAtPeriodEnd: false,
    lookupKey: row.price_lookup_key,
  };
}

/** A learner's access, loaded once per request and asked as often as needed. */
export class Entitlements {
  constructor(
    readonly enforced: boolean,
    readonly subject: Subject | null,
    readonly now: Date = new Date(),
  ) {}

  decide(feature: Feature, examKey: string | null = null): Decision {
    return decideAccess({ enforced: this.enforced, subject: this.subject, feature, examKey, now: this.now });
  }

  can(feature: Feature, examKey: string | null = null): boolean {
    return this.decide(feature, examKey).allowed;
  }

  /** Subscriptions and passes that give access right now. */
  get liveGrants(): Grant[] {
    return (this.subject?.grants ?? []).filter((g) => grantIsLive(g, this.now));
  }

  /** A live plan covers every exam (Plus, or an earlier all-exams plan). */
  get hasAllAccess(): boolean {
    return this.liveGrants.some((g) => PLANS[g.plan]?.scope === 'all-exams');
  }

  /** Exams covered by a live one-exam grant: a Single Exam Pass or an earlier single-exam subscription. */
  get singleExamKeys(): string[] {
    return [...new Set(this.liveGrants.filter((g) => PLANS[g.plan]?.scope === 'one-exam' && g.examKey).map((g) => g.examKey!))];
  }

  /** Live Single Exam Passes. */
  get livePasses(): Grant[] {
    return this.liveGrants.filter((g) => g.kind === 'pass');
  }

  get isStaff(): boolean {
    return this.subject?.role === 'admin' || this.subject?.role === 'editor';
  }
}

export class EntitlementError extends Error {
  readonly status: number;
  constructor(
    readonly code: 'upgrade-required' | 'account-required',
    message: string,
    readonly detail: { feature: Feature; examKey: string | null; upgradeHref: string; suggestedPlan: PlanKey | null },
  ) {
    super(message);
    this.name = 'EntitlementError';
    this.status = code === 'account-required' ? 403 : 402;
  }

  /** The `billing.errors.*` key of this message, for a page that shows it in the learner's language. */
  get messageKey(): string {
    return this.code === 'account-required' ? 'entitlement.accountRequired' : `entitlement.upgradeRequired.${this.detail.feature}`;
  }
}

/**
 * Learner-facing reasons for a refusal, in English. The same sentences are in
 * the `billing` message catalogue under `errors.entitlement.*`
 * (EntitlementError.messageKey names the one that applies).
 */
export const ENTITLEMENT_COPY = {
  accountRequired: 'Create a free account to take the free diagnostic. Your guest practice comes with you.',
  upgradeRequired: {
    practice: 'Practice sessions for this exam need a Single Exam Pass or Plus. The diagnostic stays free.',
    timed_section: 'Timed sections for this exam need a Single Exam Pass or Plus. The diagnostic stays free.',
    simulation: 'Full-length simulations need a Single Exam Pass or Plus. The diagnostic stays free.',
    study_plan: 'The study plan and progress tracking for this exam need a Single Exam Pass or Plus.',
    ai_tutor: 'The AI tutor will be part of Premium, which is coming soon and cannot be bought yet.',
    diagnostic: 'The diagnostic is free.',
    official_scores: 'Tracking your official practice scores is free.',
    guides: 'Guides are free.',
    samples: 'Sample questions are free.',
  } satisfies Record<Feature, string>,
} as const;

export interface EntitlementDeps {
  settings?: BillingSettings;
  env?: Record<string, string | undefined>;
  now?: Date;
  /**
   * When given, a subscription the copy still shows as live after its paid
   * period ended is re-read from Stripe first, so a missed renewal webhook
   * cannot lock a paying learner out. Errors are logged, never thrown.
   */
  stripe?: StripeApi | null;
}

/**
 * Loads what this user may do. Throws BillingConfigError when billing is
 * enforced without its keys: refusing loudly beats opening everything.
 */
export async function loadEntitlements(db: Db, userId: string | null, deps: EntitlementDeps = {}): Promise<Entitlements> {
  const settings = deps.settings ?? assertBillingConfig(deps.env);
  const now = deps.now ?? new Date();
  if (!settings.enforced) return new Entitlements(false, null, now);
  if (!userId) return new Entitlements(true, null, now);

  const user = (await db.prepare('SELECT role, is_guest FROM users WHERE id = ? AND deleted_at IS NULL').get(userId)) as
    | { role: Subject['role']; is_guest: number | string }
    | undefined;
  if (!user) return new Entitlements(true, null, now);

  let rows = await listSubscriptions(db, userId);
  if (deps.stripe) rows = await refreshStale(db, userId, rows, deps.stripe, now);
  // A database still awaiting migration 016 has no passes table, and nobody can
  // have bought a pass there: fail closed (no pass access), never open.
  const passes = await listPasses(db, userId).catch((error: unknown) => {
    console.error('[billing] could not read passes:', error instanceof Error ? error.message : error);
    return [] as PassRow[];
  });
  const grants = [...rows.map(toGrant), ...passes.map(passToGrant)];
  return new Entitlements(true, { role: user.role, isGuest: Number(user.is_guest) === 1, grants }, now);
}

/** Rows that still claim access although their period has ended are re-read from Stripe. */
async function refreshStale(db: Db, userId: string, rows: SubscriptionRow[], stripe: StripeApi, now: Date): Promise<SubscriptionRow[]> {
  const stale = rows.filter(
    (row) =>
      (ACCESS_POLICY.grantingStatuses.includes(row.status) || row.status === 'past_due') &&
      row.current_period_end !== null &&
      new Date(row.current_period_end).getTime() < now.getTime(),
  );
  if (stale.length === 0) return rows;
  for (const row of stale) {
    try {
      const fresh = await stripe.subscriptions.retrieve(row.stripe_subscription_id);
      await storeSubscription(db, userId, fresh, { syncedAt: Math.floor(now.getTime() / 1000), now });
    } catch (error) {
      console.error('[billing] could not refresh a stale subscription:', error instanceof Error ? error.message : error);
    }
  }
  return listSubscriptions(db, userId);
}

/** Throws EntitlementError unless this user may use the feature for the exam. */
export async function requireEntitlement(
  db: Db,
  userId: string | null,
  feature: Feature,
  examKey: string | null,
  deps: EntitlementDeps = {},
): Promise<Decision> {
  const decision = (await loadEntitlements(db, userId, deps)).decide(feature, examKey);
  if (decision.allowed) return decision;
  throw entitlementError(decision, feature, examKey);
}

export function entitlementError(decision: Decision, feature: Feature, examKey: string | null): EntitlementError {
  const detail = {
    feature,
    examKey,
    upgradeHref: decision.upgradeHref ?? pricingPath(examKey),
    suggestedPlan: decision.suggestedPlan ?? null,
  };
  return decision.reason === 'account-required'
    ? new EntitlementError('account-required', ENTITLEMENT_COPY.accountRequired, detail)
    : new EntitlementError('upgrade-required', ENTITLEMENT_COPY.upgradeRequired[feature], detail);
}
