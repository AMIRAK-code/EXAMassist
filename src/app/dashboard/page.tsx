import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { UnauthorizedError, requireUser, type AuthUser } from '@/lib/auth/session';
import { getExamConfig, listHubs, requireExamConfig } from '@/lib/exams/registry';
import { practisableDomains } from '@/lib/attempts/availability';
import {
  MIN_ATTEMPTS_FOR_SIGNAL,
  buildRecommendations,
  skillPerformance,
} from '@/lib/learning/recommend';
import {
  Alert,
  Badge,
  Breadcrumbs,
  ButtonLink,
  Card,
  Container,
  EmptyState,
  PageHeader,
} from '@/components/ui';

/**
 * The learner's dashboard.
 *
 * Everything here is arithmetic on this learner's own answers, and every number
 * is shown with the count it was computed from. Where there are too few answers
 * to mean anything, the page says so instead of printing a percentage that
 * would be read as a measurement.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your dashboard',
  description: 'Your recent practice, accuracy by skill and what to work on next.',
  // Private page. Authorization is the protection; this is only an indexing hint.
  robots: { index: false, follow: false },
};

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

interface AttemptSummaryRow {
  id: string;
  examKey: string;
  blueprintId: string;
  mode: string;
  status: 'in_progress' | 'submitted' | 'expired' | 'abandoned';
  startedAt: string;
  submittedAt: string | null;
  rawCorrect: number | null;
  rawIncorrect: number | null;
  rawOmitted: number | null;
  accuracy: number | null;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusLabel(status: AttemptSummaryRow['status']): string {
  if (status === 'submitted') return 'Finished';
  if (status === 'expired') return 'Time ran out';
  if (status === 'in_progress') return 'In progress';
  return 'Abandoned';
}

export default async function DashboardPage() {
  const user = await requireLearner('/dashboard');
  const db = getDb();

  // The exam in focus: the learner's stated target, else the exam of their most
  // recent attempt. Both are resolved from rows owned by this user only.
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
    (mostRecentExam?.examKey && getExamConfig(mostRecentExam.examKey) ? mostRecentExam.examKey : null);

  const trail = [{ href: '/', label: 'Home' }, { label: 'Dashboard' }];

  // ---------------------------------------------------------------------
  // No exam chosen and nothing practised yet: offer a chooser, not a guess.
  // ---------------------------------------------------------------------
  if (!candidateKey) {
    return (
      <Container>
        <Breadcrumbs trail={trail} />
        <PageHeader
          title="Your dashboard"
          lead="Pick the exam you are preparing for. Your dashboard then follows the exam you practise most recently."
        />
        <ul className="grid gap-4 md:grid-cols-2">
          {listHubs().map((hub) => (
            <Card as="li" key={hub.slug}>
              <h2 className="font-serif text-xl font-semibold">{hub.name}</h2>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink-subtle">{hub.publisher}</p>
              <p className="mt-2 text-sm text-ink-muted">{hub.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {hub.configKeys.map(requireExamConfig).map((config) => (
                  <ButtonLink key={config.examKey} href={`/practice/${config.examKey}`} size="sm">
                    {hub.configKeys.length > 1 ? `Practise ${config.shortName}` : 'Start practising'}
                  </ButtonLink>
                ))}
                <ButtonLink href={`/exams/${hub.slug}`} size="sm" variant="secondary">
                  Exam guide
                </ButtonLink>
              </div>
            </Card>
          ))}
        </ul>
      </Container>
    );
  }

  const config = requireExamConfig(candidateKey);
  const examKey = config.examKey;

  const attempts = db
    .prepare(
      `SELECT
         a.id                 AS id,
         a.exam_key           AS examKey,
         a.blueprint_id       AS blueprintId,
         a.mode               AS mode,
         a.status             AS status,
         a.started_at         AS startedAt,
         a.submitted_at       AS submittedAt,
         r.raw_correct        AS rawCorrect,
         r.raw_incorrect      AS rawIncorrect,
         r.raw_omitted        AS rawOmitted,
         r.accuracy           AS accuracy
       FROM attempts a
       LEFT JOIN attempt_results r ON r.attempt_id = a.id
       WHERE a.user_id = ? AND a.exam_key = ?
       ORDER BY a.created_at DESC
       LIMIT 10`,
    )
    .all(user.id, examKey) as AttemptSummaryRow[];

  const inProgress = attempts.find((attempt) => attempt.status === 'in_progress') ?? null;
  const finished = attempts.filter((attempt) => attempt.status !== 'in_progress');

  const performance = skillPerformance(db, user.id, examKey).sort((a, b) => {
    if (a.hasSignal !== b.hasSignal) return a.hasSignal ? -1 : 1;
    return a.accuracy - b.accuracy;
  });

  const totalAnswered = performance.reduce((total, skill) => total + skill.answered, 0);
  const totalScored = performance.reduce((total, skill) => total + skill.answered + skill.omitted, 0);
  const totalCorrect = performance.reduce((total, skill) => total + skill.correct, 0);

  const dueRow = db
    .prepare(
      `SELECT COUNT(*) AS n
       FROM review_queue
       WHERE user_id = ? AND exam_key = ? AND last_result <> 'correct' AND due_at <= ?`,
    )
    .get(user.id, examKey, new Date().toISOString()) as { n: number };

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

  const recommendations = buildRecommendations({
    examKey,
    performance,
    untouchedDomains,
    dueReviewCount: dueRow.n,
    totalAnswered,
  });

  const otherExams = listHubs()
    .flatMap((hub) => hub.configKeys.map(requireExamConfig))
    .filter((other) => other.examKey !== examKey);

  return (
    <Container>
      <Breadcrumbs trail={trail} />

      <PageHeader
        eyebrow={config.publisher}
        title="Your dashboard"
        lead={`Everything below is counted from your own answers for ${config.name}. Nothing here is a score prediction or a percentile.`}
      />

      {/* Unfinished session, offered before anything else. */}
      {inProgress ? (
        <Card className="mb-8 border-s-4 border-s-accent">
          <h2 className="font-serif text-xl font-semibold">You have a session in progress</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {config.blueprints.find((b) => b.id === inProgress.blueprintId)?.label ??
              inProgress.blueprintId}{' '}
            · started {formatDate(inProgress.startedAt)}
          </p>
          <div className="mt-4">
            <ButtonLink href={`/attempt/${inProgress.id}`}>Continue this session</ButtonLink>
          </div>
        </Card>
      ) : null}

      {totalScored === 0 && finished.length === 0 ? (
        <EmptyState
          title="Nothing to summarise yet"
          action={<ButtonLink href={`/practice/${examKey}`}>Start a practice session</ButtonLink>}
        >
          <p>
            You have not finished a session for {config.shortName} yet. Once you do, this page shows
            your accuracy by skill, what you missed, and what is worth practising next — all counted
            from your own answers.
          </p>
        </EmptyState>
      ) : (
        <>
          {/* Headline counts: raw totals only. */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-ink-muted">Questions scored</p>
              <p className="font-serif text-3xl font-semibold tabular-nums">{totalScored}</p>
              <p className="mt-1 text-xs text-ink-subtle">
                across {finished.length} finished session{finished.length === 1 ? '' : 's'}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-ink-muted">Answered correctly</p>
              <p className="font-serif text-3xl font-semibold tabular-nums">
                {totalCorrect}
                <span className="text-lg font-normal text-ink-subtle"> / {totalScored}</span>
              </p>
              <p className="mt-1 text-xs text-ink-subtle">
                {totalScored > 0
                  ? `${Math.round((totalCorrect / totalScored) * 100)}% of everything you have been shown`
                  : 'No scored questions yet'}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-ink-muted">Waiting in your mistake notebook</p>
              <p className="font-serif text-3xl font-semibold tabular-nums">{dueRow.n}</p>
              <p className="mt-1 text-xs text-ink-subtle">
                questions you missed that are due to come back
              </p>
            </Card>
          </div>

          {/* Recommendations, each with the reason it was produced. */}
          <section aria-labelledby="next-heading" className="mb-10">
            <h2 id="next-heading" className="mb-4 font-serif text-2xl font-semibold">
              What to do next
            </h2>
            {recommendations.length > 0 ? (
              <ul className="space-y-4">
                {recommendations.map((recommendation) => (
                  <Card as="li" key={`${recommendation.kind}-${recommendation.title}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg font-semibold">{recommendation.title}</h3>
                        <p className="mt-1 text-sm text-ink-muted">
                          <span className="font-medium text-ink">Why: </span>
                          {recommendation.because}
                        </p>
                      </div>
                      <ButtonLink
                        href={recommendation.href}
                        size="sm"
                        variant="secondary"
                        className="shrink-0"
                      >
                        {recommendation.actionLabel}
                      </ButtonLink>
                    </div>
                  </Card>
                ))}
              </ul>
            ) : (
              <Card>
                <p className="text-sm text-ink-muted">
                  Nothing stands out in your history yet. Practising a wider range of topics will
                  give this page something to work with.
                </p>
                <div className="mt-4">
                  <ButtonLink href={`/practice/${examKey}`} size="sm">
                    Practise {config.shortName}
                  </ButtonLink>
                </div>
              </Card>
            )}
          </section>

          {/* Accuracy by skill. */}
          <section aria-labelledby="skills-heading" className="mb-10">
            <h2 id="skills-heading" className="mb-2 font-serif text-2xl font-semibold">
              Accuracy by skill
            </h2>
            <p className="mb-4 max-w-2xl text-sm text-ink-muted">
              A skill needs at least {MIN_ATTEMPTS_FOR_SIGNAL} scored questions before a percentage
              means anything. Below that we show the counts and say so, rather than printing a figure
              that would be read as a measurement.
            </p>

            {performance.length > 0 ? (
              <div className="overflow-x-auto rounded-card border border-line bg-surface">
                <table className="w-full border-collapse text-sm">
                  <caption className="px-4 pt-4 text-start text-sm text-ink-muted">
                    Your answers for {config.shortName}, grouped by the skill each question is tagged
                    to.
                  </caption>
                  <thead>
                    <tr className="border-b border-line text-start">
                      <th scope="col" className="px-4 py-3 text-start font-semibold">
                        Skill
                      </th>
                      <th scope="col" className="px-4 py-3 text-end font-semibold">
                        Scored
                      </th>
                      <th scope="col" className="px-4 py-3 text-end font-semibold">
                        Correct
                      </th>
                      <th scope="col" className="px-4 py-3 text-end font-semibold">
                        Accuracy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance.map((skill) => {
                      const scored = skill.answered + skill.omitted;
                      return (
                        <tr key={skill.skillSlug} className="border-b border-line last:border-b-0">
                          <th scope="row" className="px-4 py-3 text-start font-medium">
                            {skill.skillLabel}
                            <span className="block text-xs font-normal text-ink-subtle">
                              {skill.domainLabel}
                            </span>
                          </th>
                          <td className="px-4 py-3 text-end tabular-nums">{scored}</td>
                          <td className="px-4 py-3 text-end tabular-nums">{skill.correct}</td>
                          <td className="px-4 py-3 text-end">
                            {skill.hasSignal ? (
                              <span className="tabular-nums font-medium">
                                {Math.round(skill.accuracy * 100)}%
                              </span>
                            ) : (
                              <Badge tone="neutral">Not enough data yet</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card>
                <p className="text-sm text-ink-muted">
                  No scored answers yet, so there is nothing to break down by skill.
                </p>
              </Card>
            )}

            {untouchedDomains.length > 0 ? (
              <p className="mt-3 text-sm text-ink-muted">
                Topics you have not attempted at all:{' '}
                {untouchedDomains.map((domain) => domain.name).join(', ')}.
              </p>
            ) : null}
          </section>

          {/* Recent sessions. */}
          <section aria-labelledby="attempts-heading" className="mb-10">
            <h2 id="attempts-heading" className="mb-4 font-serif text-2xl font-semibold">
              Recent sessions
            </h2>
            {finished.length > 0 ? (
              <ul className="space-y-3">
                {finished.map((attempt) => {
                  const blueprint = config.blueprints.find((b) => b.id === attempt.blueprintId);
                  const total =
                    (attempt.rawCorrect ?? 0) + (attempt.rawIncorrect ?? 0) + (attempt.rawOmitted ?? 0);
                  return (
                    <Card as="li" key={attempt.id}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-serif text-lg font-semibold">
                            {blueprint?.label ?? attempt.blueprintId}
                          </h3>
                          <p className="mt-1 text-sm text-ink-muted">
                            {formatDate(attempt.submittedAt ?? attempt.startedAt)} ·{' '}
                            {statusLabel(attempt.status)}
                          </p>
                          <p className="mt-1 text-sm">
                            {attempt.rawCorrect === null ? (
                              <span className="text-ink-muted">No result recorded</span>
                            ) : (
                              <span className="tabular-nums">
                                {attempt.rawCorrect} correct, {attempt.rawIncorrect} wrong,{' '}
                                {attempt.rawOmitted} blank{total > 0 ? ` of ${total}` : ''}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <Badge tone={attempt.status === 'expired' ? 'caution' : 'neutral'}>
                            {statusLabel(attempt.status)}
                          </Badge>
                          {attempt.rawCorrect !== null ? (
                            <ButtonLink
                              href={`/attempt/${attempt.id}/results`}
                              size="sm"
                              variant="secondary"
                            >
                              See results
                            </ButtonLink>
                          ) : null}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </ul>
            ) : (
              <Card>
                <p className="text-sm text-ink-muted">
                  No finished sessions for {config.shortName} yet.
                </p>
              </Card>
            )}
          </section>
        </>
      )}

      <Alert tone="info" title="What this page does not do" className="mb-8">
        <p>
          It does not predict a score, place you in a percentile, or estimate your chance of
          admission. Every figure above is a count of your own answers and nothing more.
        </p>
      </Alert>

      <div className="mb-10 flex flex-wrap gap-3">
        <ButtonLink href={`/practice/${examKey}`}>Practise {config.shortName}</ButtonLink>
        <ButtonLink href="/review" variant="secondary">
          Mistake notebook
        </ButtonLink>
        <ButtonLink href="/study-plan" variant="secondary">
          Study plan
        </ButtonLink>
      </div>

      {otherExams.length > 0 ? (
        <section aria-labelledby="other-exams-heading">
          <h2 id="other-exams-heading" className="mb-2 font-serif text-lg font-semibold">
            Practising something else?
          </h2>
          <p className="mb-3 text-sm text-ink-muted">
            This dashboard follows the exam you practise most recently.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {otherExams.map((other) => (
              <li key={other.examKey}>
                <Link href={`/practice/${other.examKey}`}>{other.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Container>
  );
}
