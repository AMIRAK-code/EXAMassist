import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { requireReviewAccess } from '@/lib/auth/guards';
import { EXAM_CONFIGS, getExamConfig, labelsFor } from '@/lib/exams/registry';
import { STATUS_ORDER, STATUS_TONE, countByStatus, nextForReviewer, reviewQueue, statusLabel } from '@/lib/content/review-queue';
import { humanApprovalRequired, type ApprovalStatus } from '@/lib/content/human-review';
import { Alert, Badge, Breadcrumbs, Button, ButtonLink, Card, Container, EmptyState, PageHeader, Stat, fieldClass } from '@/components/ui';
import { InlineMarkdown } from '@/components/content';
import { ReviewerConfirm } from './reviewer-confirm';

/**
 * The human review queue.
 *
 * A named, authorised person approves a question's exact current content, or
 * sends it back (src/lib/content/human-review.ts). While approval is required
 * only approved questions are served; while it is optional, everything that
 * passed the automated checks is served except what a reviewer sent back.
 * This screen lists what is waiting, most-seen first. Reviewers see the exams
 * they are authorised for; editors and administrators see everything,
 * read-only unless they are also authorised reviewers.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Human review queue',
  robots: { index: false, follow: false },
};

const ROW_LIMIT = 200;

export default async function ReviewQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string; status?: string }>;
}) {
  const { user, reviewer } = await requireReviewAccess('/admin/review');
  const query = await searchParams;
  const db = getDb();

  const isStaff = user.role === 'admin' || user.role === 'editor';
  const visibleExams = isStaff ? EXAM_CONFIGS.map((c) => c.examKey) : (reviewer?.examKeys ?? []);
  const exam = visibleExams.includes(query.exam ?? '') ? query.exam! : '';
  const status = (STATUS_ORDER as readonly string[]).includes(query.status ?? '')
    ? (query.status as ApprovalStatus)
    : 'awaiting-human-review';

  const required = humanApprovalRequired();
  const rows = await reviewQueue(db, exam ? [exam] : visibleExams);
  const counts = countByStatus(rows);
  const first =
    reviewer?.status === 'active'
      ? nextForReviewer(rows, reviewer, { email: user.email, displayName: user.displayName }, '')
      : null;
  const examQuery = exam ? `?exam=${encodeURIComponent(exam)}` : '';
  const shown = rows.filter((row) => row.status === status);
  const limited = shown.slice(0, ROW_LIMIT);

  const perExam = (exam ? [exam] : visibleExams).map((examKey) => {
    const mine = rows.filter((row) => row.examKey === examKey);
    return { examKey, name: getExamConfig(examKey)?.name ?? examKey, counts: countByStatus(mine), total: mine.length };
  });

  const trail = [{ href: '/', label: 'Home' }, { href: '/admin', label: 'Administration' }, { label: 'Human review' }];

  return (
    <Container size="wide">
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow="Internal"
        title="Human review queue"
        lead={
          required
            ? 'A question is served to a new session only after a named, authorised reviewer approves its exact current content. AI drafting, the AI blind solve and automated checks come first, but none of them counts as human approval.'
            : 'Human approval is optional for now: questions that passed the automated checks and the AI blind solve are served while they wait here. An approval is shown to learners with your name; a request for changes takes the question out of new sessions at once. None of the automated checks counts as human approval.'
        }
      />

      {reviewer ? (
        <Card className="mb-8" padding="lg">
          <h2 className="text-xl">Your reviewer authorisation</h2>
          <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[minmax(10rem,auto)_1fr]">
            <dt className="font-medium text-ink-muted">Shown publicly as</dt>
            <dd>
              {reviewer.publicName} ({reviewer.publicCredentials})
            </dd>
            <dt className="font-medium text-ink-muted">Exams</dt>
            <dd>{reviewer.examKeys.map((key) => getExamConfig(key)?.shortName ?? key).join(', ')}</dd>
            <dt className="font-medium text-ink-muted">Status</dt>
            <dd>
              {reviewer.status === 'active' ? (
                <Badge tone="positive">Active since {reviewer.confirmedAt?.slice(0, 10)}</Badge>
              ) : (
                <Badge tone="caution">Waiting for your confirmation</Badge>
              )}
            </dd>
          </dl>
          {reviewer.status === 'pending-confirmation' ? (
            <div className="mt-5">
              <ReviewerConfirm name={reviewer.publicName} credentials={reviewer.publicCredentials} />
            </div>
          ) : first ? (
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <ButtonLink href={`/admin/review/${encodeURIComponent(first.questionId)}${examQuery}`}>
                Start reviewing
              </ButtonLink>
              <p className="text-sm text-ink-muted">
                {counts['awaiting-human-review']} waiting{exam ? ` for ${getExamConfig(exam)?.shortName ?? exam}` : ''}. Questions
                learners reported or see most come first; after each decision the next one opens.
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-ink-muted">Nothing is waiting for you{exam ? ' in this exam' : ''}.</p>
          )}
        </Card>
      ) : (
        <Alert tone="info" className="mb-8" title="You can read this queue but not decide">
          <p>
            Approvals are recorded only by people an administrator has authorised as reviewers, on their own
            account.{user.role === 'admin' ? (
              <>
                {' '}
                Authorise reviewers on <Link href="/admin/reviewers">Reviewers</Link>.
              </>
            ) : null}
          </p>
        </Alert>
      )}

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="font-heading text-2xl font-semibold">
          Where the bank stands
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(['approved', 'awaiting-human-review', 'changes-requested', 'in-automated-review'] as const).map((key) => (
            <Card key={key}>
              <Stat labelAs="h3" label={statusLabel(key, required)} value={counts[key]} />
            </Card>
          ))}
        </div>
        {counts.approved === 0 ? (
          required ? (
            <Alert tone="caution" className="mt-5" title="No question is human-approved yet">
              <p>
                Until reviewers approve questions, new sessions have nothing to draw on and every practice format for
                these exams is closed. Sessions learners already started keep their questions.
              </p>
            </Alert>
          ) : (
            <Alert tone="info" className="mt-5" title="No question is human-approved yet">
              <p>
                Learners are being served questions that passed the automated checks, and the public pages say that most
                questions have not been checked by a person. Each approval is shown on that question's review page.
              </p>
            </Alert>
          )
        ) : null}

        <div role="region" aria-labelledby="summary-heading" tabIndex={0} className="mt-5 overflow-x-auto rounded-card border border-line bg-surface">
          <table className="w-full min-w-[44rem] border-collapse text-sm">
            <caption className="px-4 pt-4 text-start text-sm text-ink-muted">Current question versions by exam and approval status.</caption>
            <thead>
              <tr className="border-b border-line-strong">
                <th scope="col" className="px-4 py-3 text-start font-semibold">Exam</th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">Approved</th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">Awaiting review</th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">Changes requested</th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">In automated review</th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">Quarantined</th>
              </tr>
            </thead>
            <tbody>
              {perExam.map((row) => (
                <tr key={row.examKey} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-3 text-start font-medium">
                    <Link href={`/admin/review?exam=${encodeURIComponent(row.examKey)}&status=${status}`}>{row.name}</Link>
                  </th>
                  <td className="px-4 py-3 text-end tabular-nums">{row.counts.approved}</td>
                  <td className="px-4 py-3 text-end tabular-nums">{row.counts['awaiting-human-review']}</td>
                  <td className="px-4 py-3 text-end tabular-nums">{row.counts['changes-requested']}</td>
                  <td className="px-4 py-3 text-end tabular-nums">{row.counts['in-automated-review']}</td>
                  <td className="px-4 py-3 text-end tabular-nums">{row.counts.quarantined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="queue-heading">
        <h2 id="queue-heading" className="font-heading text-2xl font-semibold">
          Questions
        </h2>
        <form method="get" action="/admin/review" className="mt-3 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex flex-col gap-1">
            <label htmlFor="queue-exam" className="text-sm font-medium">Exam</label>
            <select id="queue-exam" name="exam" defaultValue={exam} className={fieldClass('sm:w-64')}>
              <option value="">All my exams</option>
              {visibleExams.map((key) => (
                <option key={key} value={key}>{getExamConfig(key)?.name ?? key}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="queue-status" className="text-sm font-medium">Status</label>
            <select id="queue-status" name="status" defaultValue={status} className={fieldClass('sm:w-80')}>
              {STATUS_ORDER.map((value) => (
                <option key={value} value={value}>{`${statusLabel(value, required)} (${counts[value]})`}</option>
              ))}
            </select>
          </div>
          <Button type="submit">Show</Button>
        </form>

        {limited.length === 0 ? (
          <div className="mt-6">
            <EmptyState headingLevel={3} title="Nothing in this list">
              <p>No current question version has this status for the exams shown.</p>
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {limited.map((row) => {
              const names = labelsFor(getExamConfig(row.examKey) ?? EXAM_CONFIGS[0]);
              return (
                <Card as="li" key={row.questionVersionId}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={STATUS_TONE[row.status]}>{statusLabel(row.status, required)}</Badge>
                    {row.priority.openReports > 0 ? (
                      <Badge tone="negative">
                        {row.priority.openReports} open learner report{row.priority.openReports === 1 ? '' : 's'}
                      </Badge>
                    ) : null}
                    {row.priority.publicSample ? <Badge tone="accent">Public sample</Badge> : null}
                    {row.priority.timesServed > 0 ? (
                      <Badge tone="neutral">Given to learners {row.priority.timesServed}×</Badge>
                    ) : null}
                    <Link href={`/admin/review/${encodeURIComponent(row.questionId)}${examQuery}`} className="font-mono text-sm">
                      {row.questionId}
                    </Link>
                    <span className="text-sm text-ink-muted">v{row.version}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink">
                    <InlineMarkdown source={row.stemMd.slice(0, 220)} />
                    {row.stemMd.length > 220 ? '…' : ''}
                  </p>
                  <p className="mt-2 text-xs text-ink-subtle">
                    {getExamConfig(row.examKey)?.shortName ?? row.examKey} · {names.domains[row.domainSlug] ?? row.domainSlug} ·{' '}
                    {names.skills[row.skillSlug] ?? row.skillSlug} · {row.difficulty} · {row.responseType}
                    {row.stimulusId ? ' · shares a stimulus' : ''}
                    {row.latestDecision ? ` · last decision ${row.latestDecision.reviewedOn} by ${row.latestDecision.reviewerName}` : ''}
                  </p>
                </Card>
              );
            })}
          </ul>
        )}
        {shown.length > limited.length ? (
          <p className="mt-4 text-sm text-ink-muted">
            Showing the first {limited.length} of {shown.length}. Choose one exam to narrow the list.
          </p>
        ) : null}
      </section>
    </Container>
  );
}
