import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ExamChoice } from '@/lib/learning/dashboard';
import { planningHref, type PlanningView } from '@/lib/learning/planning';
import { Alert, cx } from '@/components/ui';

/**
 * The views of the study plan: what to do (Plan), what the evidence here says
 * (Progress & readiness), and the official practice results the learner
 * entered (Official practice scores), kept apart from what UniExamer measures.
 * Plain links, so they work without JavaScript; the current one is marked for
 * assistive technology as well as by fill.
 */

const VIEWS: PlanningView[] = ['plan', 'progress', 'scores'];

const PILL = 'inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] px-4 text-sm font-semibold no-underline';
const PILL_ON = 'border-ink bg-ink text-ink-inverse hover:text-ink-inverse';
const PILL_OFF = 'border-line-strong bg-surface text-ink hover:border-ink hover:text-ink';

export function PlanningViews({ current, examKey }: { current: PlanningView; examKey: string | null }) {
  const t = useTranslations('learning.planning');
  return (
    <nav aria-label={t('viewsLabel')} className="mb-6">
      <ul className="flex flex-wrap gap-2">
        {VIEWS.map((view) => {
          const active = view === current;
          return (
            <li key={view}>
              <Link
                href={planningHref(view, examKey)}
                aria-current={active ? 'page' : undefined}
                className={cx(PILL, active ? PILL_ON : PILL_OFF)}
              >
                {t(`views.${view}`)}
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
  const t = useTranslations('learning.planning');
  if (choices.length < 2) return null;
  return (
    <nav aria-label={t('examsLabel')} className="mb-8">
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
/** Outcomes of the planning forms, shown after their redirect: the tone, and the message under `planning.notices`. */
const NOTICES: Record<string, { tone: 'positive' | 'caution' | 'info'; message: string }> = {
  'plan-created': { tone: 'positive', message: 'planCreated' },
  'plan-adjusted': { tone: 'positive', message: 'planAdjusted' },
  'plan-ended': { tone: 'info', message: 'planEnded' },
  'plan-exists': { tone: 'info', message: 'planExists' },
  'plan-changed': { tone: 'caution', message: 'planChanged' },
  'no-plan': { tone: 'caution', message: 'noPlan' },
  'nothing-to-plan': { tone: 'caution', message: 'nothingToPlan' },
  'invalid-plan-input': { tone: 'caution', message: 'invalidPlanInput' },
  'session-skipped': { tone: 'info', message: 'sessionSkipped' },
  'session-closed': { tone: 'caution', message: 'sessionClosed' },
  'not-enough-new': { tone: 'caution', message: 'notEnoughNew' },
  'insufficient-content': { tone: 'caution', message: 'insufficientContent' },
  'nothing-to-review': { tone: 'caution', message: 'nothingToReview' },
  'rate-limited': { tone: 'caution', message: 'rateLimited' },
  'date-chosen': { tone: 'positive', message: 'dateChosen' },
};

export function PlanningNotice({ code, className }: { code: string | string[] | undefined; className?: string }) {
  const t = useTranslations('learning.planning.notices');
  const key = Array.isArray(code) ? code[0] : code;
  const notice = key && Object.hasOwn(NOTICES, key) ? NOTICES[key] : undefined;
  if (!notice) return null;
  return (
    <Alert tone={notice.tone} role="status" className={className}>
      <p>{t(notice.message)}</p>
    </Alert>
  );
}
