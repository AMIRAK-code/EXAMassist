import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link, getPathname } from '@/i18n/navigation';
import { languageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
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
import { loadEntitlements } from '@/lib/billing/entitlements';
import { UpgradePrompt } from '@/components/billing/upgrade-prompt';
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

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'learning.studyPlan.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: languageAlternates('/study-plan', locale),
    // Private page. Authorization is the protection; this is only an indexing hint.
    robots: { index: false, follow: false },
  };
}

type Query = { exam?: string | string[]; notice?: string | string[]; minutes?: string | string[]; date?: string | string[] };
const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function StudyPlanPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<Query> }) {
  const { locale } = await params;
  const user = await requireSignedIn('/study-plan');
  const query = await searchParams;
  const db = getDb();
  const { examKey, choices } = (await planningExam(db, user, query.exam, 'plan'));
  const t = await getTranslations('learning');
  const TRAIL = [
    { href: '/', label: t('crumbs.home') },
    { href: '/dashboard', label: t('crumbs.dashboard') },
    { label: t('crumbs.studyPlan') },
  ];

  if (!examKey) {
    return (
      <Container>
        <Breadcrumbs trail={TRAIL} />
        <PageHeader title={t('crumbs.studyPlan')} />
        <PlanningViews current="plan" examKey={null} />
        <EmptyState
          title={t('studyPlan.noExamTitle')}
          action={<ButtonLink href="/exams">{t('studyPlan.chooseExam')}</ButtonLink>}
        >
          <p>{t('studyPlan.noExamLead')}</p>
        </EmptyState>
        <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {listHubs().map((hub) => (
            <li key={hub.slug}>
              <Link href={`/exams/${hub.slug}`}>{hub.name}</Link>
            </li>
          ))}
        </ul>
      </Container>
    );
  }

  const config = requireExamConfig(examKey);
  // The study plan and readiness are part of a paid plan for this exam.
  if (!(await loadEntitlements(db, user.id)).can('study_plan', config.examKey)) {
    return (
      <Container>
        <Breadcrumbs trail={TRAIL} />
        <PageHeader eyebrow={config.publisher} title={t('crumbs.studyPlan')} />
        <PlanningViews current="plan" examKey={config.examKey} />
        <PlanningExamSwitcher choices={choices} />
        <UpgradePrompt feature="study_plan" examKey={config.examKey} examName={config.shortName} />
      </Container>
    );
  }
  let plan = (await activePlan(db, user.id, examKey));
  // The only write a visit makes: finished sessions complete what they satisfy.
  if (plan && (await recordCompletions(db, user.id, plan)) > 0) plan = (await activePlan(db, user.id, examKey));
  const dates = (await examDateFor(db, user.id, examKey));

  return (
    <Container>
      <Breadcrumbs trail={TRAIL} />
      <PageHeader eyebrow={config.publisher} title={t('crumbs.studyPlan')} />
      <PlanningViews current="plan" examKey={examKey} />
      <PlanningExamSwitcher choices={choices} />
      <PlanningNotice code={query.notice} className="mb-6" />
      {dates.examDate && dates.conflicting ? (
        <DateConflictCard examKey={examKey} examName={config.shortName} current={dates.examDate} earlier={dates.conflicting} returnTo="plan" />
      ) : null}
      {plan ? (
        <StoredPlan
          plan={plan}
          sessions={(await planSessions(db, user.id, plan.id))}
          examDate={dates.examDate}
          configKey={examKey}
          locale={locale}
        />
      ) : (
        <PlanSetup
          examKey={examKey}
          userId={user.id}
          canonicalDate={dates.examDate}
          unattached={(await unattachedPlanDate(db, user.id))}
          savedMinutes={user.weeklyMinutes}
          query={query}
          locale={locale}
        />
      )}
    </Container>
  );
}

// ---------------------------------------------------------------------------
// No plan yet: inputs, and a preview of exactly what would be saved
// ---------------------------------------------------------------------------

async function PlanSetup({
  examKey,
  userId,
  canonicalDate,
  unattached,
  savedMinutes,
  query,
  locale,
}: {
  examKey: string;
  userId: string;
  canonicalDate: string | null;
  unattached: string | null;
  savedMinutes: number | null;
  query: Query;
  locale: Locale;
}) {
  const t = await getTranslations('learning.studyPlan');
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
      ? t('setup.dateNotAfterToday')
      : askedDate === undefined && fallbackDate && fallbackDate <= today
        ? t('setup.datePassed', { date: formatDate(fallbackDate, locale) })
        : null;

  const sessions = buildSessions((await planInputs(db, userId, config, { startsOn: today, examDate, weeklyMinutes })));
  const shape = planShape(today, examDate, weeklyMinutes);
  const slots = planSlots(shape);
  const counts = { new: 0, revision: 0, review: 0 };
  for (const s of sessions) counts[s.kind === 'mixed' ? 'new' : s.kind] += 1;

  const dateHint =
    askedDate === undefined && !canonicalDate && unattached
      ? t('setup.dateHintEarlier', { exam: config.shortName })
      : t('setup.dateHint');

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <section aria-labelledby="setup-heading" className="mb-10">
          <h2 id="setup-heading" className="mb-4 font-heading text-2xl font-semibold">
            {t('setup.title')}
          </h2>
          <Card>
            <PlanInputsForm
              action={getPathname({ href: '/study-plan', locale })}
              examKey={examKey}
              examDate={examDate}
              weeklyMinutes={weeklyMinutes}
              submitLabel={t('setup.preview')}
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
            {t('setup.previewTitle')}
          </h2>
          {sessions.length === 0 ? (
            <EmptyState title={t('setup.nothingTitle')} headingLevel={3}>
              <p>{t('setup.nothingLead', { exam: config.shortName })}</p>
            </EmptyState>
          ) : (
            <>
              <Card className="mb-6">
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  <Stat label={t('stats.sessions')} value={sessions.length} />
                  <Stat label={t('stats.new')} value={counts.new} />
                  <Stat label={t('stats.revision')} value={counts.revision} />
                  <Stat label={t('stats.review')} value={counts.review} />
                </div>
                <div className="mt-5 border-t border-line pt-5">
                  <DefinitionList
                    items={[
                      {
                        term: t('terms.runs'),
                        value: t('terms.range', { from: formatDay(shape.startsOn, locale), to: formatDay(shape.endsOn, locale, true) }),
                      },
                      { term: t('terms.examDate'), value: examDate ? formatDate(examDate, locale) : t('terms.none') },
                      { term: t('terms.eachWeek'), value: t('terms.minutes', { minutes: weeklyMinutes }) },
                    ]}
                  />
                </div>
                {sessions.length < slots ? (
                  <p className="mt-5 text-sm text-ink-muted">
                    {t('setup.slotsLeftFree', { planned: sessions.length, slots, exam: config.shortName })}
                  </p>
                ) : null}
                <form action={createPlanAction} className="mt-5">
                  <input type="hidden" name="examKey" value={examKey} />
                  <input type="hidden" name="weeklyMinutes" value={weeklyMinutes} />
                  <input type="hidden" name="examDate" value={examDate ?? ''} />
                  <Button type="submit">{t('setup.save')}</Button>
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

async function StoredPlan({
  plan,
  sessions,
  examDate,
  configKey,
  locale,
}: {
  plan: PlanRow;
  sessions: PlanSessionRow[];
  examDate: string | null;
  configKey: string;
  locale: Locale;
}) {
  const t = await getTranslations('learning.studyPlan');
  const config = requireExamConfig(configKey);
  const now = new Date();
  // How many questions the session that completed each one answered: completing needs 5 (or all of
  // a shorter one), so the plan shows the count rather than implying every question was answered.
  const completedBy = sessions.filter((s) => s.status === 'completed' && s.attemptId).map((s) => s.attemptId!);
  const answeredIn = new Map(
    completedBy.length === 0
      ? []
      : (
          (await getDb()
            .prepare(
              `SELECT a.id, (SELECT COUNT(*) FROM attempt_items ai WHERE ai.attempt_id = a.id AND ai.response_status = 'answered') AS answered
                 FROM attempts a WHERE a.user_id = ? AND a.id IN (${completedBy.map(() => '?').join(',')})`,
            )
            .all(plan.userId, ...completedBy)) as Array<{ id: string; answered: number }>
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
          (await getDb()
            .prepare(`SELECT id FROM attempts WHERE user_id = ? AND status = 'in_progress' AND id IN (${linked.map(() => '?').join(',')})`)
            .all(plan.userId, ...linked)) as Array<{ id: string }>
        ).map((row) => row.id),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <section aria-labelledby="summary-heading" className="mb-8">
          <h2 id="summary-heading" className="sr-only">
            {t('stored.glance')}
          </h2>
          <Card>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <Stat label={t('stats.completed')} value={count('completed')} of={sessions.length} />
              <Stat label={t('stats.toDo')} value={count('planned')} />
              <Stat label={t('stats.missed')} value={missed} />
              <Stat label={t('stats.skipped')} value={count('skipped')} />
            </div>
            <div className="mt-5 border-t border-line pt-5">
              <DefinitionList
                items={[
                  {
                    term: t('terms.runs'),
                    value: t('terms.range', { from: formatDay(plan.startsOn, locale), to: formatDay(plan.endsOn, locale, true) }),
                  },
                  {
                    term: t('terms.builtFor'),
                    value: plan.examDate ? t('terms.examOn', { date: formatDate(plan.examDate, locale) }) : t('terms.noExamDate'),
                  },
                  { term: t('terms.eachWeek'), value: t('terms.minutes', { minutes: plan.weeklyMinutes }) },
                ]}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href={adjustHref} variant={unrecordedMissed > 0 || dateMoved ? 'primary' : 'secondary'}>
                {t('stored.adjust')}
              </ButtonLink>
            </div>
          </Card>
        </section>

        {unrecordedMissed > 0 ? (
          <Alert tone="caution" title={t('stored.missedTitle', { count: unrecordedMissed })} className="mb-8">
            <p>{t('stored.missedLead')}</p>
          </Alert>
        ) : null}
        {dateMoved ? (
          <Alert tone="info" title={t('stored.dateChangedTitle')} className="mb-8">
            <p>
              {examDate ? t('stored.dateNow', { date: formatDate(examDate, locale) }) : t('stored.dateCleared')}{' '}
              {plan.examDate ? t('stored.builtFor', { date: formatDate(plan.examDate, locale) }) : t('stored.builtForNone')}
            </p>
          </Alert>
        ) : null}

        <section aria-labelledby="weeks-heading">
          <h2 id="weeks-heading" className="mb-4 font-heading text-2xl font-semibold">
            {t('stored.weekByWeek')}
          </h2>
          <Weeks config={config} startsOn={plan.startsOn} sessions={states} withActions examKey={plan.examKey} openAttempts={openAttempts} />
        </section>

        <section aria-labelledby="end-heading" className="mt-10">
          <h2 id="end-heading" className="font-heading text-lg font-semibold">
            {t('stored.endTitle')}
          </h2>
          <p className="mt-2 text-sm text-ink-muted">{t('stored.endLead')}</p>
          <form action={endPlanAction} className="mt-3">
            <input type="hidden" name="planId" value={plan.id} />
            <input type="hidden" name="examKey" value={plan.examKey} />
            <Button type="submit" variant="danger" size="sm">
              {t('stored.end')}
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
  const t = useTranslations('learning.studyPlan.actions');
  if (session.state === 'completed' && session.attemptId) {
    return (
      <ButtonLink href={`/attempt/${session.attemptId}/results`} size="sm" variant="secondary">
        {t('seeResults')}
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
          {t('continue')}
        </ButtonLink>
      ) : (
      <form action={startPlanSessionAction}>
        <input type="hidden" name="sessionId" value={session.id} />
        <input type="hidden" name="examKey" value={examKey} />
        <Button type="submit" size="sm" variant={session.state === 'planned' ? 'primary' : 'secondary'}>
          {session.attemptId ? t('startAgain') : t('start')}
        </Button>
      </form>
      )}
      <form action={skipPlanSessionAction}>
        <input type="hidden" name="sessionId" value={session.id} />
        <input type="hidden" name="examKey" value={examKey} />
        <Button type="submit" size="sm" variant="quiet">
          {t('skip')}
        </Button>
      </form>
    </>
  );
}

function HowItWorks() {
  const t = useTranslations('learning.studyPlan.howItWorks');
  return (
    <Card>
      <h2 className="font-heading text-lg font-semibold">{t('title')}</h2>
      <p className="mt-2 text-sm text-ink-muted">{t('lead')}</p>
      <div className="mt-4">
        <StatesExplained />
      </div>
    </Card>
  );
}
