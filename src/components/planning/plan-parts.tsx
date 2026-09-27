import type { ReactNode } from 'react';
import type { ExamConfig } from '@/lib/assessment/types';
import { addDays, sessionLabel, type PlannedSession, type SessionKind, type SessionState, type StoredStatus } from '@/lib/learning/plan';
import { MINUTE_CHOICES, formatDate, formatDay } from '@/lib/learning/plan-inputs';
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

const KIND_TEXT: Record<SessionKind, string> = {
  new: 'New questions only',
  mixed: 'New questions only',
  revision: 'Revision: may repeat questions',
  review: 'Review: repeats missed questions',
};

export function KindBadge({ kind }: { kind: SessionKind }) {
  return <Badge tone={kind === 'new' || kind === 'mixed' ? 'accent' : 'neutral'}>{KIND_TEXT[kind]}</Badge>;
}

const STATE: Record<SessionState, { label: string; tone: 'neutral' | 'positive' | 'caution' }> = {
  planned: { label: 'Planned', tone: 'neutral' },
  completed: { label: 'Completed', tone: 'positive' },
  missed: { label: 'Missed', tone: 'caution' },
  skipped: { label: 'Skipped', tone: 'neutral' },
};

export function StateBadge({ state }: { state: SessionState }) {
  return <Badge tone={STATE[state].tone}>{STATE[state].label}</Badge>;
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
  const Heading = headingLevel === 3 ? 'h3' : 'h4';
  const faded = session.state === 'skipped' || session.state === 'missed';
  return (
    <li className={cx('rounded-card border border-line bg-surface p-4', session.state === 'completed' && 'border-positive-line')}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold tabular-nums text-ink-muted">
          <time dateTime={session.scheduledOn}>{formatDay(session.scheduledOn)}</time>
        </p>
        {session.state ? <StateBadge state={session.state} /> : null}
      </div>
      <Heading className={cx('mt-1 font-heading text-lg font-semibold', faded && 'text-ink-muted')}>
        {sessionLabel(config, session)}
      </Heading>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <KindBadge kind={session.kind} />
        <span className="text-sm tabular-nums text-ink-muted">
          {session.questionCount} questions · {session.minutes} min
        </span>
      </div>
      {session.state === 'completed' && session.answered !== undefined ? (
        <p className="mt-2 text-sm text-ink-muted">
          Completed with {session.answered} question{session.answered === 1 ? '' : 's'} answered
          {session.answered < session.questionCount ? ` of the ${session.questionCount} planned` : ''}.
        </p>
      ) : null}
      {actions ? <div className="mt-3 flex flex-wrap items-center gap-2">{actions}</div> : null}
      <p className="mt-3 border-t border-line pt-3 text-sm text-ink-subtle">Why: {session.reason}</p>
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
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <h3 className="font-heading text-xl font-semibold">Week {week}</h3>
      <p className="text-sm tabular-nums text-ink-muted">
        {formatDay(from)} to {formatDay(to)} · {minutes} min
      </p>
    </div>
  );
}

/** What each state means, in the terms the plan uses them. */
export function StatesExplained() {
  const items: Array<[SessionState, string]> = [
    ['planned', 'Scheduled, and its day is not over yet.'],
    [
      'completed',
      'You finished a matching session and answered at least 5 of its questions, or all of them if fewer are planned. That is the bar for completing it, not a sign that every question was answered: each one shows how many you did. Opening a session is not enough, and a new-questions session counts only if it was started with new questions only, as Start does.',
    ],
    [
      'missed',
      'Its date has ended in every time zone: from 12:00 UTC the next day (13:00 in Italy in winter, 14:00 in summer). Where you are, that is between the midnight after its date and about a day later, never earlier. You can still do it until you adjust your plan, which records it as missed.',
    ],
    ['skipped', 'You chose to skip it. It stays in your plan as skipped.'],
  ];
  return (
    <dl className="space-y-3 text-sm">
      {items.map(([state, text]) => (
        <div key={state}>
          <dt>
            <StateBadge state={state} />
          </dt>
          <dd className="mt-1 text-ink-muted">{text}</dd>
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
  const choices = (MINUTE_CHOICES as readonly number[]).includes(weeklyMinutes)
    ? [...MINUTE_CHOICES]
    : [...MINUTE_CHOICES, weeklyMinutes].sort((a, b) => a - b);
  const tomorrow = addDays(new Date().toISOString().slice(0, 10), 1);
  return (
    <form action={action} method="get" className="space-y-5">
      <input type="hidden" name="exam" value={examKey} />
      <div>
        <label htmlFor="plan-exam-date" className="mb-1.5 block text-sm font-medium">
          Exam date <span className="font-normal text-ink-muted">(optional)</span>
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
          Time each week
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
              {minutes} minutes ({Math.round((minutes / 60) * 10) / 10} hours)
            </option>
          ))}
        </select>
        <p id="plan-weekly-minutes-hint" className="mt-1.5 text-sm text-ink-muted">
          Sessions are 25 minutes, so this sets how many you get each week.
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
  return (
    <Card className="mb-8 border-s-4 border-s-caution">
      <h2 className="font-heading text-lg font-semibold">Which is your {examName} date?</h2>
      <p className="mt-1 text-sm text-ink-muted">We found two, and kept both rather than choose for you.</p>
      <form action={resolveDateConflictAction} className="mt-4">
        <input type="hidden" name="examKey" value={examKey} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <fieldset>
          <legend className="sr-only">Choose your exam date</legend>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" name="keep" value="current" variant="secondary">
              {formatDate(current)}, from your goal
            </Button>
            <Button type="submit" name="keep" value="earlier" variant="secondary">
              {formatDate(earlier)}, from your earlier plan
            </Button>
          </div>
        </fieldset>
      </form>
      <p className="mt-3 text-sm text-ink-subtle">Until you choose, the date from your goal is used.</p>
    </Card>
  );
}
