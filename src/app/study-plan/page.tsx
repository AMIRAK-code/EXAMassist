import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { UnauthorizedError, requireUser, type AuthUser } from '@/lib/auth/session';
import { getExamConfig, listHubs, requireExamConfig } from '@/lib/exams/registry';
import { practisableDomains } from '@/lib/attempts/availability';
import { buildStudyPlan, skillPerformance } from '@/lib/learning/recommend';
import {
  Alert,
  Badge,
  Breadcrumbs,
  ButtonLink,
  Card,
  Container,
  DefinitionList,
  EmptyState,
  PageHeader,
} from '@/components/ui';
import { PlanForm } from './plan-form';

/**
 * The study plan.
 *
 * It divides the time the learner says they have by the sessions that fit in
 * it, and orders the topics by their own accuracy so far. It promises nothing
 * about the outcome, and the caveats that come back from the builder are shown
 * at the top rather than buried at the bottom.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your study plan',
  description: 'A week-by-week practice schedule built from your own answer history.',
  // Private page. Authorization is the protection; this is only an indexing hint.
  robots: { index: false, follow: false },
};

const DEFAULT_WEEKLY_MINUTES = 150;

async function requireLearner(nextPath: string): Promise<AuthUser> {
  try {
    return await requireUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
    }
    throw error;
  }
}

function formatWeekStart(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function StudyPlanPage() {
  const user = await requireLearner('/study-plan');
  const db = getDb();

  const mostRecentExam = db
    .prepare(
      `SELECT exam_key AS examKey
         FROM attempts
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1`,
    )
    .get(user.id) as { examKey: string } | undefined;

  const candidateKey =
    (user.targetExamKey && getExamConfig(user.targetExamKey) ? user.targetExamKey : null) ??
    (mostRecentExam?.examKey && getExamConfig(mostRecentExam.examKey)
      ? mostRecentExam.examKey
      : null);

  const trail = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { label: 'Study plan' },
  ];

  if (!candidateKey) {
    return (
      <Container>
        <Breadcrumbs trail={trail} />
        <PageHeader
          title="Your study plan"
          lead="A plan needs an exam to plan for. Start practising one and the plan is built from what you answer."
        />
        <EmptyState
          title="No exam chosen yet"
          action={<ButtonLink href="/exams">Choose an exam</ButtonLink>}
        >
          <p>
            Pick the test you are preparing for, answer a short session, and this page will lay out
            the next few weeks using your own results.
          </p>
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

  const config = requireExamConfig(candidateKey);
  const examKey = config.examKey;
  const weeklyMinutes = user.weeklyMinutes ?? DEFAULT_WEEKLY_MINUTES;

  const performance = skillPerformance(db, user.id, examKey);

  const attemptedDomains = new Set(
    (
      db
        .prepare(
          `SELECT DISTINCT qv.domain_slug AS domainSlug
             FROM attempt_items ai
             JOIN attempts a           ON a.id = ai.attempt_id
             JOIN question_versions qv ON qv.id = ai.question_version_id
            WHERE a.user_id = ? AND a.exam_key = ?`,
        )
        .all(user.id, examKey) as Array<{ domainSlug: string }>
    ).map((row) => row.domainSlug),
  );

  const untouchedDomains = practisableDomains(db, config)
    .filter((domain) => !attemptedDomains.has(domain.slug))
    .map((domain) => ({ slug: domain.slug, name: domain.name, count: domain.count }));

  const plan = buildStudyPlan({
    examKey,
    examName: config.name,
    targetDate: user.targetDate,
    weeklyMinutes,
    performance,
    untouchedDomains,
  });

  const totalMinutes = plan.weeks.reduce((total, week) => total + week.totalMinutes, 0);
  const usingDefaults = user.weeklyMinutes === null;

  return (
    <Container>
      <Breadcrumbs trail={trail} />

      <PageHeader
        eyebrow={config.publisher}
        title="Your study plan"
        lead={`A schedule for ${config.name}, built by dividing the time you say you have into practice sessions and ordering topics by your own accuracy so far.`}
      />

      {/* The caveats belong where they will be read. */}
      <Alert tone="caution" title="What this plan is, and is not" className="mb-8">
        <ul className="list-disc space-y-1.5 ps-5">
          {plan.caveats.map((caveat) => (
            <li key={caveat}>{caveat}</li>
          ))}
        </ul>
      </Alert>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <section aria-labelledby="weeks-heading">
            <h2 id="weeks-heading" className="mb-4 font-serif text-2xl font-semibold">
              Week by week
            </h2>

            {plan.weeks.length === 0 ? (
              <EmptyState
                title="Nothing to schedule"
                action={<ButtonLink href={`/practice/${examKey}`}>Start practising</ButtonLink>}
              >
                <p>
                  Set a weekly time budget above and the plan will fill in. Even 60 minutes a week
                  produces a schedule.
                </p>
              </EmptyState>
            ) : (
              <ol className="space-y-5">
                {plan.weeks.map((week) => (
                  <Card as="li" key={week.weekNumber}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-serif text-lg font-semibold">Week {week.weekNumber}</h3>
                      <p className="text-sm text-ink-muted">
                        from {formatWeekStart(week.startsOn)} · {week.totalMinutes} minutes
                      </p>
                    </div>

                    {week.focusSkills.length > 0 ? (
                      <div className="mt-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
                          Focus
                        </h4>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {week.focusSkills.map((skill) => (
                            <li key={skill.slug}>
                              <Badge tone="accent">
                                {skill.label} — {skill.reason}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-ink-muted">
                        Mixed practice: there is not yet enough of your own history to single out a
                        skill for this week.
                      </p>
                    )}

                    <h4 className="mt-4 text-sm font-semibold uppercase tracking-wide text-ink-subtle">
                      Sessions
                    </h4>
                    <ul className="mt-2 space-y-2">
                      {week.sessions.map((session, index) => (
                        <li
                          key={`${week.weekNumber}-${index}`}
                          className="flex flex-wrap items-center justify-between gap-2 rounded border border-line p-3"
                        >
                          <span className="min-w-0">
                            <span className="font-medium">{session.label}</span>
                            <span className="ms-2 text-sm text-ink-muted tabular-nums">
                              {session.minutes} min
                            </span>
                          </span>
                          <ButtonLink href={session.href} size="sm" variant="secondary">
                            Open this session
                          </ButtonLink>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <Card>
            <h2 className="font-serif text-lg font-semibold">Your inputs</h2>
            <p className="mt-1 text-sm text-ink-muted">
              These two numbers are the only things the plan cannot work out for itself.
            </p>
            <div className="mt-4">
              <PlanForm
                initialTargetDate={user.targetDate}
                initialWeeklyMinutes={weeklyMinutes}
                usingDefaultMinutes={usingDefaults}
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-serif text-lg font-semibold">This plan at a glance</h2>
            <div className="mt-3">
              <DefinitionList
                items={[
                  { term: 'Exam', value: config.name },
                  {
                    term: 'Target date',
                    value: plan.targetDate ? formatWeekStart(plan.targetDate) : 'Not set',
                  },
                  {
                    term: 'Weeks left',
                    value:
                      plan.weeksAvailable === null
                        ? 'Unknown until you set a date'
                        : `${plan.weeksAvailable}`,
                  },
                  { term: 'Weeks planned', value: `${plan.weeks.length}` },
                  { term: 'Time a week', value: `${plan.weeklyMinutes} minutes` },
                  { term: 'Total planned', value: `${totalMinutes} minutes` },
                ]}
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-serif text-lg font-semibold">Where the order comes from</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Skills you have answered least accurately come first, then topics you have never
              attempted. Skills with too few answers to read anything into are not used to order the
              plan — see your{' '}
              <a href="/dashboard">accuracy by skill</a> for the counts behind each one.
            </p>
          </Card>
        </aside>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href={`/practice/${examKey}`}>Practise {config.shortName}</ButtonLink>
        <ButtonLink href="/review" variant="secondary">
          Mistake notebook
        </ButtonLink>
        <ButtonLink href="/dashboard" variant="secondary">
          Back to dashboard
        </ButtonLink>
      </div>
    </Container>
  );
}
