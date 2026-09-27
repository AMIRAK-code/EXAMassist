import Link from 'next/link';
import type { ExamChoice } from '@/lib/learning/dashboard';
import { planningHref, type PlanningView } from '@/lib/learning/planning';
import { Alert, cx } from '@/components/ui';

/**
 * The two views of the study plan: what to do (Plan) and what the evidence
 * says (Progress & readiness). Plain links, so they work without JavaScript;
 * the current one is marked for assistive technology as well as by fill.
 */

const VIEWS: Array<{ key: PlanningView; label: string }> = [
  { key: 'plan', label: 'Plan' },
  { key: 'progress', label: 'Progress & readiness' },
];

const PILL = 'inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] px-4 text-sm font-semibold no-underline';
const PILL_ON = 'border-ink bg-ink text-ink-inverse hover:text-ink-inverse';
const PILL_OFF = 'border-line-strong bg-surface text-ink hover:border-ink hover:text-ink';

export function PlanningViews({ current, examKey }: { current: PlanningView; examKey: string | null }) {
  return (
    <nav aria-label="Study plan views" className="mb-6">
      <ul className="flex flex-wrap gap-2">
        {VIEWS.map((view) => {
          const active = view.key === current;
          return (
            <li key={view.key}>
              <Link
                href={planningHref(view.key, examKey)}
                aria-current={active ? 'page' : undefined}
                className={cx(PILL, active ? PILL_ON : PILL_OFF)}
              >
                {view.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** The exams a learner has practised, planned or set a goal for, as plain links. */
export function PlanningExamSwitcher({ choices }: { choices: ExamChoice[] }) {
  if (choices.length < 2) return null;
  return (
    <nav aria-label="Exams in your study plan" className="mb-8">
      <ul className="flex flex-wrap gap-2">
        {choices.map((choice) => (
          <li key={choice.examKey}>
            <Link
              href={choice.href}
              aria-current={choice.current ? 'page' : undefined}
              className={cx(
                'inline-flex min-h-10 items-center rounded-full border px-3.5 text-sm no-underline',
                choice.current
                  ? 'border-accent bg-accent-soft font-semibold text-accent-ink hover:text-accent-ink'
                  : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink',
              )}
            >
              {choice.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Outcomes of the planning forms, shown after their redirect. */
const NOTICES: Record<string, { tone: 'positive' | 'caution' | 'info'; text: string }> = {
  'plan-created': { tone: 'positive', text: 'Your plan is saved. It changes only when you adjust it.' },
  'plan-adjusted': { tone: 'positive', text: 'Your remaining plan is adjusted. Completed, skipped and missed sessions are kept as they were.' },
  'plan-ended': { tone: 'info', text: 'That plan has ended. Its sessions are kept in your data export.' },
  'plan-exists': { tone: 'info', text: 'You already have a plan for this exam, shown below.' },
  'plan-changed': {
    tone: 'caution',
    text: 'Your plan or your practice changed since this preview was made, so nothing was applied. Here is the preview as it is now.',
  },
  'no-plan': { tone: 'caution', text: 'That plan is no longer active.' },
  'nothing-to-plan': { tone: 'caution', text: 'There are no reviewed questions to plan for this exam yet.' },
  'invalid-plan-input': {
    tone: 'caution',
    text: 'Nothing was saved: choose a weekly time from the list, and an exam date after today (or none).',
  },
  'session-skipped': { tone: 'info', text: 'Session skipped. It stays in your plan as skipped.' },
  'session-closed': { tone: 'caution', text: 'That session is already completed, skipped or recorded as missed.' },
  'not-enough-new': {
    tone: 'caution',
    text: 'Too few questions you have not seen are left for that session. Adjust your plan to turn it into revision, or skip it.',
  },
  'insufficient-content': { tone: 'caution', text: 'Not enough reviewed questions are available for that session right now.' },
  'nothing-to-review': {
    tone: 'caution',
    text: 'There are no missed questions to ask again right now: you have answered them correctly since, or they are being revised.',
  },
  'rate-limited': { tone: 'caution', text: 'Too many sessions were started in a short time. Try again in a few minutes.' },
  'date-chosen': { tone: 'positive', text: 'Exam date saved. That is now the one date for this exam.' },
};

export function PlanningNotice({ code, className }: { code: string | string[] | undefined; className?: string }) {
  const key = Array.isArray(code) ? code[0] : code;
  const notice = key ? NOTICES[key] : undefined;
  if (!notice) return null;
  return (
    <Alert tone={notice.tone} role="status" className={className}>
      <p>{notice.text}</p>
    </Alert>
  );
}
