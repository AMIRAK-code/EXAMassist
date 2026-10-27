import type { ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { ExamConfig } from '@/lib/assessment/types';
import { MIN_ANSWERS_TO_COUNT, SESSION_MINUTES, addDays, sessionLabel, type PlannedSession, type SessionKind, type SessionState, type StoredStatus } from '@/lib/learning/plan';
import { MINUTE_CHOICES, formatDate, formatDay } from '@/lib/learning/plan-inputs';
import { renderText } from '@/lib/learning/text';
import { resolveDateConflictAction } from '@/app/actions/planning';
import { Badge, Button, Card, cx, fieldClass } from '@/components/ui';

/**
 * The pieces of the Plan view and the adjustment preview.
 *
 * Laid out so a font swap cannot move them: short single-line labels in
 * rows, the date and state on one line, and the one longer sentence (why
 * the session was chosen) last in its card, where rewrapping moves nothing
 * inside it.
 */

export function KindBadge({ kind }: { kind: SessionKind }) {
  const t = useTranslations('learning');
  return <Badge tone={kind === 'new' || kind === 'mixed' ? 'accent' : 'neutral'}>{t(`kind.${kind}`)}</Badge>;
}

const STATE_TONE: Record<SessionState, 'neutral' | 'positive' | 'caution'> = {
  planned: 'neutral',
  completed: 'positive',
  missed: 'caution',
  skipped: 'neutral',
};

export function StateBadge({ state }: { state: SessionState }) {
  const t = useTranslations('learning.planParts.state');
  return <Badge tone={STATE_TONE[state]}>{t(state)}</Badge>;
}

export interface SessionView extends PlannedSession {
  id?: string;
  status?: StoredStatus;
  state?: SessionState;
  attemptId?: string | null;
  /** For a completed session: questions answered in the session that completed it. */
  answered?: number;
}

/** One session: its day, what it is, why, and (on the Plan view) what can be done with it. */
export function SessionCard({
  config,
  session,
  actions,
  headingLevel = 4,
}: {
  config: ExamConfig;
  session: SessionView;
  actions?: ReactNode;
  headingLevel?: 3 | 4;
}) {
  const t = useTranslations('learning');
  const locale = useLocale();
  const Heading = headingLevel === 3 ? 'h3' : 'h4';
  const faded = session.state === 'skipped' || session.state === 'missed';
  return (
    <li className={cx('rounded-card border border-line bg-surface p-4', session.state === 'completed' && 'border-positive-line')}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold tabular-nums text-ink-muted">
          <time dateTime={session.scheduledOn}>{formatDay(session.scheduledOn, locale)}</time>
        </p>
        {session.state ? <StateBadge state={session.state} /> : null}
      </div>
      <Heading className={cx('mt-1 font-heading text-lg font-semibold', faded && 'text-ink-muted')}>
        {renderText(t, sessionLabel(config, session))}
      </Heading>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <KindBadge kind={session.kind} />
        <span className="text-sm tabular-nums text-ink-muted">
          {t('planParts.size', { questions: session.questionCount, minutes: session.minutes })}
        </span>
      </div>
      {session.state === 'completed' && session.answered !== undefined ? (
        <p className="mt-2 text-sm text-ink-muted">
          {session.answered < session.questionCount
            ? t('planParts.completedOf', { answered: session.answered, planned: session.questionCount })
            : t('planParts.completed', { answered: session.answered })}
        </p>
      ) : null}
      {actions ? <div className="mt-3 flex flex-wrap items-center gap-2">{actions}</div> : null}
      <p className="mt-3 border-t border-line pt-3 text-sm text-ink-subtle">
        {t('why', { reason: renderText(t, session.reason) })}
      </p>
    </li>
  );
}

/** Sessions grouped into weeks from the plan's first day. */
export function groupByWeek<T extends { scheduledOn: string }>(startsOn: string, sessions: T[]): Array<{ week: number; from: string; to: string; sessions: T[] }> {
  const weeks = new Map<number, T[]>();
  const start = Date.parse(`${startsOn}T00:00:00Z`);
  for (const session of sessions) {
    const index = Math.max(0, Math.floor((Date.parse(`${session.scheduledOn}T00:00:00Z`) - start) / (7 * 24 * 60 * 60 * 1000)));
    weeks.set(index, [...(weeks.get(index) ?? []), session]);
  }
  return [...weeks.entries()]
    .sort(([a], [b]) => a - b)
    .map(([index, list]) => ({
      week: index + 1,
      from: addDays(startsOn, index * 7),
      to: addDays(startsOn, index * 7 + 6),
      sessions: list,
    }));
}

export function WeekHeading({ week, from, to, minutes }: { week: number; from: string; to: string; minutes: number }) {
  const t = useTranslations('learning.planParts');
  const locale = useLocale();
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <h3 className="font-heading text-xl font-semibold">{t('week', { week })}</h3>
      <p className="text-sm tabular-nums text-ink-muted">
        {t('weekRange', { from: formatDay(from, locale), to: formatDay(to, locale), minutes })}
      </p>
    </div>
  );
}

/** What each state means, in the terms the plan uses them. */
export function StatesExplained() {
  const t = useTranslations('learning.planParts.stateExplained');
  const states: SessionState[] = ['planned', 'completed', 'missed', 'skipped'];
  return (
    <dl className="space-y-3 text-sm">
      {states.map((state) => (
        <div key={state}>
          <dt>
            <StateBadge state={state} />
          </dt>
          <dd className="mt-1 text-ink-muted">{t(state, { min: MIN_ANSWERS_TO_COUNT })}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The plan's two inputs, as a GET form: submitting it shows a preview and
 * saves nothing.
 */
export function PlanInputsForm({
  action,
  examKey,
  examDate,
  weeklyMinutes,
  submitLabel,
  dateHint,
}: {
  action: string;
  examKey: string;
  examDate: string | null;
  weeklyMinutes: number;
  submitLabel: string;
  dateHint: string;
}) {
  const t = useTranslations('learning.planParts.inputs');
  const choices = (MINUTE_CHOICES as readonly number[]).includes(weeklyMinutes)
    ? [...MINUTE_CHOICES]
    : [...MINUTE_CHOICES, weeklyMinutes].sort((a, b) => a - b);
  const tomorrow = addDays(new Date().toISOString().slice(0, 10), 1);
  return (
    <form action={action} method="get" className="space-y-5">
      <input type="hidden" name="exam" value={examKey} />
      <div>
        <label htmlFor="plan-exam-date" className="mb-1.5 block text-sm font-medium">
          {t('date')} <span className="font-normal text-ink-muted">{t('optional')}</span>
        </label>
        <input
          id="plan-exam-date"
          name="date"
          type="date"
          defaultValue={examDate ?? ''}
          min={tomorrow}
          aria-describedby="plan-exam-date-hint"
          className={fieldClass('sm:max-w-64')}
        />
        <p id="plan-exam-date-hint" className="mt-1.5 text-sm text-ink-muted">
          {dateHint}
        </p>
      </div>
      <div>
        <label htmlFor="plan-weekly-minutes" className="mb-1.5 block text-sm font-medium">
          {t('weekly')}
        </label>
        <select
          id="plan-weekly-minutes"
          name="minutes"
          defaultValue={String(weeklyMinutes)}
          aria-describedby="plan-weekly-minutes-hint"
          className={fieldClass('sm:max-w-64')}
        >
          {choices.map((minutes) => (
            <option key={minutes} value={minutes}>
              {t('minutesOption', { minutes, hours: Math.round((minutes / 60) * 10) / 10 })}
            </option>
          ))}
        </select>
        <p id="plan-weekly-minutes-hint" className="mt-1.5 text-sm text-ink-muted">
          {t('weeklyHint', { minutes: SESSION_MINUTES })}
        </p>
      </div>
      <Button type="submit" variant="secondary">
        {submitLabel}
      </Button>
    </form>
  );
}

/**
 * Two exam dates for one exam, kept by migration 007 rather than choosing
 * for the learner: the one on their goal, and the one their earlier study
 * plan used.
 */
export function DateConflictCard({
  examKey,
  examName,
  current,
  earlier,
  returnTo,
}: {
  examKey: string;
  examName: string;
  current: string;
  earlier: string;
  returnTo: 'plan' | 'progress';
}) {
  const t = useTranslations('learning.planParts.dateConflict');
  const locale = useLocale();
  return (
    <Card className="mb-8 border-s-4 border-s-caution">
      <h2 className="font-heading text-lg font-semibold">{t('title', { exam: examName })}</h2>
      <p className="mt-1 text-sm text-ink-muted">{t('lead')}</p>
      <form action={resolveDateConflictAction} className="mt-4">
        <input type="hidden" name="examKey" value={examKey} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <fieldset>
          <legend className="sr-only">{t('legend')}</legend>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" name="keep" value="current" variant="secondary">
              {t('fromGoal', { date: formatDate(current, locale) })}
            </Button>
            <Button type="submit" name="keep" value="earlier" variant="secondary">
              {t('fromEarlier', { date: formatDate(earlier, locale) })}
            </Button>
          </div>
        </fieldset>
      </form>
      <p className="mt-3 text-sm text-ink-subtle">{t('untilChosen')}</p>
    </Card>
  );
}
