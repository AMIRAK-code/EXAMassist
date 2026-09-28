/**
 * The optional AI tutor: whether it is on, which model it uses, and how much
 * it may be used.
 *
 * The tutor is OFF unless an operator sets ANTHROPIC_API_KEY on the server.
 * Nothing in core practice depends on it: when it is off, the pages that
 * would offer it simply do not, and every question still carries its own
 * reviewed explanation.
 *
 * The key is read only on the server. It is never sent to the browser, never
 * logged, and never written to the database.
 */

/** Claude Haiku 4.5: fast and inexpensive, which suits short, grounded tutoring. */
export const DEFAULT_TUTOR_MODEL = 'claude-haiku-4-5';

export type TutorKind = 'hint' | 'explain' | 'debrief';

export interface TutorLimits {
  /** Model calls one signed-in learner may cause per UTC day. */
  perAccountDaily: number;
  /** Model calls one guest session may cause per UTC day. */
  perGuestDaily: number;
  /** Model calls the whole site may make per UTC day - a spending ceiling. */
  globalDaily: number;
}

export interface TutorSettings {
  enabled: boolean;
  /** Why it is off, for operators. Never shown with configuration details. */
  disabledReason: string | null;
  model: string;
  limits: TutorLimits;
  /** Per-request budget; the SDK's own default is far longer than a tutor should wait. */
  timeoutMs: number;
}

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function tutorSettings(env: Record<string, string | undefined> = process.env): TutorSettings {
  const hasKey = Boolean(env.ANTHROPIC_API_KEY && env.ANTHROPIC_API_KEY.trim() !== '');
  const switchedOff = env.TUTOR_ENABLED === 'false' || env.TUTOR_ENABLED === '0';

  return {
    enabled: hasKey && !switchedOff,
    disabledReason: switchedOff
      ? 'TUTOR_ENABLED is set to false.'
      : hasKey
        ? null
        : 'ANTHROPIC_API_KEY is not set.',
    model: env.TUTOR_MODEL?.trim() || DEFAULT_TUTOR_MODEL,
    limits: {
      perAccountDaily: positiveInt(env.TUTOR_ACCOUNT_DAILY_LIMIT, 30),
      perGuestDaily: positiveInt(env.TUTOR_GUEST_DAILY_LIMIT, 10),
      globalDaily: positiveInt(env.TUTOR_GLOBAL_DAILY_LIMIT, 500),
    },
    timeoutMs: positiveInt(env.TUTOR_TIMEOUT_MS, 25_000),
  };
}

export function tutorEnabled(): boolean {
  return tutorSettings().enabled;
}

/** Output budgets. Short on purpose: a hint that runs to a page is not a hint. */
export const MAX_OUTPUT_TOKENS: Record<TutorKind, number> = {
  hint: 350,
  explain: 1_000,
  debrief: 1_400,
};

/** The label every AI response carries in the interface. */
export const AI_LABEL =
  'AI-generated. It can be wrong. The reviewed explanation written by our editors is the authority.';
