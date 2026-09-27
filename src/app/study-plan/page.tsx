import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { requireSignedIn } from '@/lib/auth/guards';
import { listHubs, requireExamConfig } from '@/lib/exams/registry';
import {
  activePlan,
  buildSessions,
  examDateFor,
  planInputs,
  planSessions,
  planShape,
  planSlots,
  recordCompletions,
  stateOf,
  unattachedPlanDate,
  isoDay,
  type PlanRow,
  type PlanSessionRow,
  type SessionState,
} from '@/lib/learning/plan';
import { DEFAULT_WEEKLY_MINUTES, formatDate, formatDay, parsePlanDate, parseWeeklyMinutes } from '@/lib/learning/plan-inputs';
import { planningExam } from '@/lib/learning/planning';
import { createPlanAction, endPlanAction, skipPlanSessionAction, startPlanSessionAction } from '@/app/actions/planning';
import { Alert, Breadcrumbs, Button, ButtonLink, Card, Container, DefinitionList, EmptyState, PageHeader, Stat } from '@/components/ui';
import { PlanningExamSwitcher, PlanningNotice, PlanningViews } from '@/components/planning/planning-views';
import {
  DateConflictCard,
  PlanInputsForm,
  SessionCard,
  StatesExplained,
  WeekHeading,
  groupByWeek,
} from '@/components/planning/plan-parts';

/**
 * The Plan view of the study plan (docs/REDESIGN.md §18.5).
 *
 * Without a plan: the two inputs and a preview of exactly the plan they
 * would make, saved only when the learner says so. With one: the stored
 * plan by week, each session with its state and what can be done with it.
 * A visit records completions and nothing else; the schedule changes only
 * through "Adjust my remaining plan".
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your study plan',
  description: 'A dated practice plan built from your own answers and the questions available.',
  // Private page. Authorization is the protection; this is only an indexing hint.
  robots: { index: false, follow: false },
};

type Query = { exam?: string | string[]; notice?: string | string[]; minutes?: string | string[]; date?: string | string[] };
const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const TRAIL = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { label: 'Study plan' },
];

export default async function StudyPlanPage({ searchParams }: { searchParams: Promise<Query> }) {
  const user = await requireSignedIn('/study-plan');
  const query = await searchParams;
  const db = getDb();
  const { examKey, choices } = planningExam(db, user, query.exam, 'plan');

  if (!examKey) {
    return (
      <Container>
        <Breadcrumbs trail={TRAIL} />
        <PageHeader title="Study plan" />
        <PlanningViews current="plan" examKey={null} />
        <EmptyState title="No exam chosen yet" action={<ButtonLink href="/exams">Choose an exam</ButtonLink>}>
          <p>Pick the test you are preparing for, and this page will lay out the next few weeks from the questions available and your own results.</p>
        </EmptyState>
        <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {listHubs().map((hub) => (
            <li key={hub.slug}>
              <a href={`/exams/${hub.slug}`}>{hub.name}</a>
            </li>
          ))}
        </ul>
      </Container>
    );
  }

  const config = requireExamConfig(examKey);
  let plan = activePlan(db, user.id, examKey);
  // The only write a visit makes: finished sessions complete what they satisfy.
  if (plan && recordCompletions(db, user.id, plan) > 0) plan = activePlan(db, user.id, examKey);
  const dates = examDateFor(db, user.id, examKey);

  return (
    <Container>
      <Breadcrumbs trail={TRAIL} />
      <PageHeader eyebrow={config.publisher} title="Study plan" />
      <PlanningViews current="plan" examKey={examKey} />
      <PlanningExamSwitcher choices={choices} />
      <PlanningNotice code={query.notice} className="mb-6" />
      {dates.examDate && dates.conflicting ? (
        <DateConflictCard examKey={examKey} examName={config.shortName} current={dates.examDate} earlier={dates.conflicting} returnTo="plan" />
      ) : null}
      {plan ? (
        <StoredPlan plan={plan} sessions={planSessions(db, user.id, plan.id)} examDate={dates.examDate} configKey={examKey} />
      ) : (
        <PlanSetup
          examKey={examKey}
          userId={user.id}
          canonicalDate={dates.examDate}
          unattached={unattachedPlanDate(db, user.id)}
          savedMinutes={user.weeklyMinutes}
          query={query}
        />
      )}
    </Container>
  );
}

// ---------------------------------------------------------------------------
// No plan yet: inputs, and a preview of exactly what would be saved
// ---------------------------------------------------------------------------

function PlanSetup({
  examKey,
  userId,
  canonicalDate,
  unattached,
  savedMinutes,
  query,
}: {
  examKey: string;
  userId: string;
  canonicalDate: string | null;
  unattached: string | null;
  savedMinutes: number | null;
  query: Query;
}) {
  const db = getDb();
  const config = requireExamConfig(examKey);
  const today = isoDay(new Date());

  // Inputs: what the learner asked to preview, else what they have told us.
  const askedMinutes = parseWeeklyMinutes(one(query.minutes));
  const weeklyMinutes = askedMinutes ?? savedMinutes ?? DEFAULT_WEEKLY_MINUTES;
  const askedDate = one(query.date);
  const fallbackDate = canonicalDate ?? unattached;
  const parsed = parsePlanDate(askedDate !== undefined ? askedDate : fallbackDate);
  const examDate = parsed === 'invalid' ? null : parsed;
  const dateProblem =
    askedDate !== undefined && parsed === 'invalid'
      ? 'That date is not after today, so the preview uses no exam date.'
      : askedDate === undefined && fallbackDate && fallbackDate <= today
        ? `Your exam date, ${formatDate(fallbackDate)}, has passed, so the preview uses none.`
        : null;

  const sessions = buildSessions(planInputs(db, userId, config, { startsOn: today, examDate, weeklyMinutes }));
  const shape = planShape(today, examDate, weeklyMinutes);
  const slots = planSlots(shape);
  const counts = { new: 0, revision: 0, review: 0 };
  for (const s of sessions) counts[s.kind === 'mixed' ? 'new' : s.kind] += 1;

  const dateHint =
    askedDate === undefined && !canonicalDate && unattached
      ? `Filled in from your earlier study plan, which was not tied to an exam. Clear it if it is not your ${config.shortName} date.`
      : 'Your one exam date for this exam, shared with your goal. Leave it empty for a six-week plan.';

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <section aria-labelledby="setup-heading" className="mb-10">
          <h2 id="setup-heading" className="mb-4 font-heading text-2xl font-semibold">
            Make a plan
          </h2>
          <Card>
            <PlanInputsForm
              action="/study-plan"
              examKey={examKey}
              examDate={examDate}
              weeklyMinutes={weeklyMinutes}
              submitLabel="Preview with these"
              dateHint={dateHint}
            />
            {dateProblem ? (
              <Alert tone="caution" className="mt-5">
                <p>{dateProblem}</p>
              </Alert>
            ) : null}
          </Card>
        </section>

        <section aria-labelledby="preview-heading">
          <h2 id="preview-heading" className="mb-4 font-heading text-2xl font-semibold">
            The plan this would make
          </h2>
          {sessions.length === 0 ? (
            <EmptyState title="Nothing to plan yet" headingLevel={3}>
              <p>There are no reviewed questions to plan for {config.shortName} yet.</p>
            </EmptyState>
          ) : (
            <>
              <Card className="mb-6">
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  <Stat label="Sessions" value={sessions.length} />
                  <Stat label="New questions" value={counts.new} />
                  <Stat label="Revision" value={counts.revision} />
                  <Stat label="Review" value={counts.review} />
                </div>
                <div className="mt-5 border-t border-line pt-5">
                  <DefinitionList
                    items={[
                      { term: 'Runs', value: `${formatDay(shape.startsOn)} to ${formatDay(shape.endsOn, true)}` },
                      { term: 'Exam date', value: examDate ? formatDate(examDate) : 'None' },
                      { term: 'Each week', value: `${weeklyMinutes} minutes` },
                    ]}
                  />
                </div>
                {sessions.length < slots ? (
                  <p className="mt-5 text-sm text-ink-muted">
                    {sessions.length} of the {slots} sessions your time allows are planned. The rest are left free: there are not enough reviewed {config.shortName} questions to revise a topic more than once a week.
                  </p>
                ) : null}
                <form action={createPlanAction} className="mt-5">
                  <input type="hidden" name="examKey" value={examKey} />
                  <input type="hidden" name="weeklyMinutes" value={weeklyMinutes} />
                  <input type="hidden" name="examDate" value={examDate ?? ''} />
                  <Button type="submit">Save this plan</Button>
                </form>
              </Card>
              <Weeks config={config} startsOn={shape.startsOn} sessions={sessions} />
            </>
          )}
        </section>
      </div>
      <aside className="space-y-6">
        <HowItWorks />
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A stored plan
// ---------------------------------------------------------------------------

function StoredPlan({
  plan,
  sessions,
  examDate,
  configKey,
}: {
  plan: PlanRow;
  sessions: PlanSessionRow[];
  examDate: string | null;
  configKey: string;
}) {
  const config = requireExamConfig(configKey);
  const now = new Date();
  // How many questions the session that completed each one answered: completing needs 5 (or all of
  // a shorter one), so the plan shows the count rather than implying every question was answered.
  const completedBy = sessions.filter((s) => s.status === 'completed' && s.attemptId).map((s) => s.attemptId!);
  const answeredIn = new Map(
    completedBy.length === 0
      ? []
      : (
          getDb()
            .prepare(
              `SELECT a.id, (SELECT COUNT(*) FROM attempt_items ai WHERE ai.attempt_id = a.id AND ai.response_status = 'answered') AS answered
                 FROM attempts a WHERE a.user_id = ? AND a.id IN (${completedBy.map(() => '?').join(',')})`,
            )
            .all(plan.userId, ...completedBy) as Array<{ id: string; answered: number }>
        ).map((row) => [row.id, row.answered] as const),
  );
  const states = sessions.map((s) => ({
    ...s,
    state: stateOf(s, now),
    answered: s.status === 'completed' && s.attemptId ? answeredIn.get(s.attemptId) : undefined,
  }));
  const count = (state: SessionState) => states.filter((s) => s.state === state).length;
  const missed = count('missed');
  const unrecordedMissed = states.filter((s) => s.state === 'missed' && s.status === 'planned').length;
  const dateMoved = (examDate ?? null) !== (plan.examDate ?? null);
  const adjustHref = `/study-plan/adjust?exam=${encodeURIComponent(plan.examKey)}`;
  // Sessions started from the plan and not finished yet: continue them rather than start another.
  const linked = sessions.filter((s) => s.status === 'planned' && s.attemptId).map((s) => s.attemptId!);
  const openAttempts = new Set(
    linked.length === 0
      ? []
      : (
          getDb()
            .prepare(`SELECT id FROM attempts WHERE user_id = ? AND status = 'in_progress' AND id IN (${linked.map(() => '?').join(',')})`)
            .all(plan.userId, ...linked) as Array<{ id: string }>
        ).map((row) => row.id),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <section aria-labelledby="summary-heading" className="mb-8">
          <h2 id="summary-heading" className="sr-only">
            Your plan at a glance
          </h2>
          <Card>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <Stat label="Completed" value={count('completed')} of={sessions.length} />
              <Stat label="Still to do" value={count('planned')} />
              <Stat label="Missed" value={missed} />
              <Stat label="Skipped" value={count('skipped')} />
            </div>
            <div className="mt-5 border-t border-line pt-5">
              <DefinitionList
                items={[
                  { term: 'Runs', value: `${formatDay(plan.startsOn)} to ${formatDay(plan.endsOn, true)}` },
                  { term: 'Built for', value: plan.examDate ? `an exam on ${formatDate(plan.examDate)}` : 'no exam date' },
                  { term: 'Each week', value: `${plan.weeklyMinutes} minutes` },
                ]}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href={adjustHref} variant={unrecordedMissed > 0 || dateMoved ? 'primary' : 'secondary'}>
                Adjust my remaining plan
              </ButtonLink>
            </div>
          </Card>
        </section>

        {unrecordedMissed > 0 ? (
          <Alert tone="caution" title={`${unrecordedMissed} session${unrecordedMissed === 1 ? '' : 's'} missed`} className="mb-8">
            <p>You can still do them. Adjusting records them as missed, moves their topics forward and shows you every change before saving.</p>
          </Alert>
        ) : null}
        {dateMoved ? (
          <Alert tone="info" title="Your exam date has changed" className="mb-8">
            <p>
              {examDate ? `It is now ${formatDate(examDate)}` : 'It has been cleared'}; this plan was built for{' '}
              {plan.examDate ? formatDate(plan.examDate) : 'no date'}. Adjusting shows what a new schedule would change.
            </p>
          </Alert>
        ) : null}

        <section aria-labelledby="weeks-heading">
          <h2 id="weeks-heading" className="mb-4 font-heading text-2xl font-semibold">
            Week by week
          </h2>
          <Weeks config={config} startsOn={plan.startsOn} sessions={states} withActions examKey={plan.examKey} openAttempts={openAttempts} />
        </section>

        <section aria-labelledby="end-heading" className="mt-10">
          <h2 id="end-heading" className="font-heading text-lg font-semibold">
            Finished with this plan?
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Ending it keeps every session as it is, in your data export, and lets you make a new one.
          </p>
          <form action={endPlanAction} className="mt-3">
            <input type="hidden" name="planId" value={plan.id} />
            <input type="hidden" name="examKey" value={plan.examKey} />
            <Button type="submit" variant="danger" size="sm">
              End this plan
            </Button>
          </form>
        </section>
      </div>
      <aside className="space-y-6">
        <HowItWorks />
      </aside>
    </div>
  );
}

function Weeks({
  config,
  startsOn,
  sessions,
  withActions,
  examKey,
  openAttempts = new Set<string>(),
}: {
  config: ReturnType<typeof requireExamConfig>;
  startsOn: string;
  sessions: Array<Parameters<typeof SessionCard>[0]['session']>;
  withActions?: boolean;
  examKey?: string;
  openAttempts?: ReadonlySet<string>;
}) {
  return (
    <ol className="space-y-8">
      {groupByWeek(startsOn, sessions).map((week) => (
        <li key={week.week}>
          <WeekHeading week={week.week} from={week.from} to={week.to} minutes={week.sessions.reduce((n, s) => n + s.minutes, 0)} />
          <ul className="space-y-3">
            {week.sessions.map((session, index) => (
              <SessionCard
                key={session.id ?? `${session.scheduledOn}-${index}`}
                config={config}
                session={session}
                actions={withActions && examKey ? <SessionActions session={session} examKey={examKey} openAttempts={openAttempts} /> : undefined}
              />
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function SessionActions({ session, examKey, openAttempts }: { session: Parameters<typeof SessionCard>[0]['session']; examKey: string; openAttempts: ReadonlySet<string> }) {
  if (session.state === 'completed' && session.attemptId) {
    return (
      <ButtonLink href={`/attempt/${session.attemptId}/results`} size="sm" variant="secondary">
        See results
      </ButtonLink>
    );
  }
  // Only a session still stored as planned can be started or skipped: a missed one until the plan is adjusted.
  if (session.status !== 'planned' || !session.id) return null;
  const open = session.attemptId && openAttempts.has(session.attemptId) ? session.attemptId : null;
  return (
    <>
      {open ? (
        <ButtonLink href={`/attempt/${open}`} size="sm">
          Continue
        </ButtonLink>
      ) : (
      <form action={startPlanSessionAction}>
        <input type="hidden" name="sessionId" value={session.id} />
        <input type="hidden" name="examKey" value={examKey} />
        <Button type="submit" size="sm" variant={session.state === 'planned' ? 'primary' : 'secondary'}>
          {session.attemptId ? 'Start again' : 'Start'}
        </Button>
      </form>
      )}
      <form action={skipPlanSessionAction}>
        <input type="hidden" name="sessionId" value={session.id} />
        <input type="hidden" name="examKey" value={examKey} />
        <Button type="submit" size="sm" variant="quiet">
          Skip
        </Button>
      </form>
    </>
  );
}

function HowItWorks() {
  return (
    <Card>
      <h2 className="font-heading text-lg font-semibold">How the plan works</h2>
      <p className="mt-2 text-sm text-ink-muted">
        It is built from the reviewed questions available now and your own answers: weakest topics first, then ones you
        have not tried. It changes only when you adjust it.
      </p>
      <div className="mt-4">
        <StatesExplained />
      </div>
    </Card>
  );
}
