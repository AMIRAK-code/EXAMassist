import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { ForbiddenError, UnauthorizedError, requireRole } from '@/lib/auth/session';
import { getExamConfig, labelsFor } from '@/lib/exams/registry';
import {
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  ButtonLink,
  Card,
  Container,
  EmptyState,
  PageHeader,
} from '@/components/ui';
import { Markdown } from '@/components/content';
import { FlagActions } from './flag-actions';

/**
 * Content reports raised by learners.
 *
 * A report is only judgeable next to the question it is about, so the stem the
 * learner actually saw is shown with it. Resolving one records a note; it does
 * not change the question, because questions are edited in their JSON files and
 * re-seeded.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Content reports',
  robots: { index: false, follow: false },
};

const ROW_LIMIT = 200;

const STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
] as const;

const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  STATUSES.map((status) => [status.value, status.label]),
);

const STATUS_TONE: Record<string, 'neutral' | 'caution' | 'positive' | 'negative'> = {
  open: 'caution',
  accepted: 'positive',
  rejected: 'neutral',
};

const REASON_LABEL: Record<string, string> = {
  wrong_answer: 'Answer key looks wrong',
  ambiguous: 'More than one defensible answer',
  typo: 'Typo or formatting',
  explanation: 'Explanation is unclear or wrong',
  offensive: 'Inappropriate content',
  other: 'Other',
};

interface FlagListRow {
  id: string;
  questionId: string;
  questionVersionId: string | null;
  userId: string | null;
  reason: string;
  details: string | null;
  status: string;
  resolution: string | null;
  createdAt: string;
  resolvedAt: string | null;
  examKey: string | null;
  questionState: string | null;
  stemMd: string | null;
  explanationMd: string | null;
  domainSlug: string | null;
  skillSlug: string | null;
  difficulty: string | null;
  versionNumber: number | null;
  isCurrentVersion: number | null;
}

function accessScreen(error: unknown) {
  if (error instanceof UnauthorizedError) {
    return (
      <Container size="narrow">
        <PageHeader eyebrow="Internal" title="Sign in to continue" />
        <Alert tone="caution" role="alert" title="You are not signed in">
          <p>
            Content reports are limited to editorial staff. Sign in with an editor or administrator
            account to continue.
          </p>
        </Alert>
        <div className="mt-6">
          <ButtonLink href="/sign-in?next=/admin/flags">Sign in</ButtonLink>
        </div>
      </Container>
    );
  }
  if (error instanceof ForbiddenError) {
    return (
      <Container size="narrow">
        <PageHeader eyebrow="Internal" title="You do not have access" />
        <Alert tone="negative" role="alert" title="Editorial access required">
          <p>
            Your account is signed in, but it does not hold the editor or administrator role that this
            area requires. No report has been loaded.
          </p>
        </Alert>
        <div className="mt-6">
          <ButtonLink href="/" variant="secondary">
            Back to the site
          </ButtonLink>
        </div>
      </Container>
    );
  }
  throw error;
}

function timestamp(value: string | null): string {
  if (!value) return '—';
  return `${value.slice(0, 10)} ${value.slice(11, 16)} UTC`;
}

export default async function AdminFlagsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  try {
    await requireRole('admin', 'editor');
  } catch (error) {
    return accessScreen(error);
  }

  const query = await searchParams;
  const status = STATUSES.some((option) => option.value === query.status) ? query.status! : '';

  const db = getDb();

  const where = status ? 'WHERE f.status = ?' : '';
  const bindings = status ? [status] : [];

  const counts = db
    .prepare('SELECT status AS status, COUNT(*) AS n FROM content_flags GROUP BY status')
    .all() as Array<{ status: string; n: number }>;
  const countFor = (value: string) => counts.find((row) => row.status === value)?.n ?? 0;
  const totalFlags = counts.reduce((sum, row) => sum + row.n, 0);

  const total = (
    db.prepare(`SELECT COUNT(*) AS n FROM content_flags f ${where}`).get(...bindings) as { n: number }
  ).n;

  // The flag records the exact version the learner saw; fall back to the
  // question's current version when it does not, so the stem is still shown.
  const rows = db
    .prepare(
      `SELECT
         f.id                  AS id,
         f.question_id         AS questionId,
         f.question_version_id AS questionVersionId,
         f.user_id             AS userId,
         f.reason              AS reason,
         f.details             AS details,
         f.status              AS status,
         f.resolution          AS resolution,
         f.created_at          AS createdAt,
         f.resolved_at         AS resolvedAt,
         q.exam_key            AS examKey,
         q.state               AS questionState,
         COALESCE(fv.stem_md, cv.stem_md)             AS stemMd,
         COALESCE(fv.explanation_md, cv.explanation_md) AS explanationMd,
         COALESCE(fv.domain_slug, cv.domain_slug)     AS domainSlug,
         COALESCE(fv.skill_slug, cv.skill_slug)       AS skillSlug,
         COALESCE(fv.difficulty, cv.difficulty)       AS difficulty,
         COALESCE(fv.version, cv.version)             AS versionNumber,
         CASE WHEN fv.id IS NULL OR fv.version = q.current_version THEN 1 ELSE 0 END
                                                      AS isCurrentVersion
       FROM content_flags f
       LEFT JOIN questions q ON q.id = f.question_id
       LEFT JOIN question_versions fv ON fv.id = f.question_version_id
       LEFT JOIN question_versions cv
         ON cv.question_id = f.question_id AND cv.version = q.current_version
       ${where}
       ORDER BY
         CASE f.status WHEN 'open' THEN 0 ELSE 1 END,
         f.created_at DESC
       LIMIT ${ROW_LIMIT}`,
    )
    .all(...bindings) as FlagListRow[];

  const trail = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Administration' },
    { label: 'Content reports' },
  ];

  return (
    <Container>
      <Breadcrumbs trail={trail} />

      <PageHeader
        eyebrow="Internal"
        title="Content reports"
        lead="What learners have reported about specific questions, shown next to the question so it can actually be judged."
      />

      <Alert tone="info" title="Resolving a report does not change the question">
        <p>
          Accepting a report records that the complaint stands. The fix happens in the question&rsquo;s
          JSON file under <code>content/questions</code>: correct it and increment its version, or set
          it to <code>quarantined</code> with a reason, then re-seed. That keeps earlier attempts scored
          against the text they were shown.
        </p>
      </Alert>

      <section className="mt-8" aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="font-serif text-xl font-semibold">
          Filter
        </h2>
        <form method="get" action="/admin/flags" className="mt-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="filter-status"
                name="status"
                defaultValue={status}
                className="min-h-11 w-full rounded border border-line-strong bg-surface px-3 py-2 text-ink sm:w-56"
              >
                <option value="">All reports ({totalFlags})</option>
                {STATUSES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({countFor(option.value)})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit">Apply filter</Button>
              {status ? (
                <Link href="/admin/flags" className="text-sm">
                  Show all reports
                </Link>
              ) : null}
            </div>
          </div>
        </form>

        <p className="mt-4 text-sm text-ink-muted">
          {countFor('open')} open, {countFor('accepted')} accepted, {countFor('rejected')} rejected.
          {status ? ` Showing ${total} ${STATUS_LABEL[status].toLowerCase()}.` : ''}
        </p>
      </section>

      <section className="mt-10" aria-labelledby="reports-heading">
        <h2 id="reports-heading" className="font-serif text-2xl font-semibold">
          {status ? `${STATUS_LABEL[status]} reports` : 'All reports'}
        </h2>

        {rows.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title={status ? `No ${STATUS_LABEL[status].toLowerCase()} reports` : 'No reports yet'}
              action={
                status ? (
                  <ButtonLink href="/admin/flags" variant="secondary">
                    Show all reports
                  </ButtonLink>
                ) : undefined
              }
            >
              <p>
                Learners can report a question from the review screen after an attempt. Nothing has
                been reported that matches this view.
              </p>
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-5 space-y-6">
            {rows.map((row) => {
              const config = row.examKey ? getExamConfig(row.examKey) : undefined;
              const names = config ? labelsFor(config) : null;
              const open = row.status === 'open';
              return (
                <Card as="li" key={row.id} className={open ? 'border-line-strong' : undefined}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg font-semibold">
                        {REASON_LABEL[row.reason] ?? row.reason}
                      </h3>
                      <p className="mt-1 text-sm text-ink-muted">
                        Reported {timestamp(row.createdAt)}
                        {row.userId ? (
                          <> · by signed-in account {row.userId.slice(0, 8)}</>
                        ) : (
                          <> · reporter not recorded</>
                        )}
                      </p>
                    </div>
                    <Badge tone={STATUS_TONE[row.status] ?? 'neutral'}>
                      {STATUS_LABEL[row.status] ?? row.status}
                    </Badge>
                  </div>

                  {row.details ? (
                    <blockquote className="mt-4 border-s-4 border-line-strong bg-surface-sunken p-3 text-sm">
                      {row.details}
                    </blockquote>
                  ) : (
                    <p className="mt-4 text-sm text-ink-muted">
                      No further detail was written by the reporter.
                    </p>
                  )}

                  <div className="mt-5 rounded-card border border-line bg-surface-sunken p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
                      The question reported
                    </h4>
                    <p className="mt-2 text-sm text-ink-muted">
                      <code>{row.questionId}</code>
                      {row.versionNumber !== null ? ` · v${row.versionNumber}` : ''}
                      {row.examKey ? ` · ${config?.name ?? row.examKey}` : ''}
                      {row.questionState ? ` · ${row.questionState}` : ''}
                    </p>
                    {row.domainSlug || row.skillSlug ? (
                      <p className="mt-1 text-sm text-ink-muted">
                        {row.domainSlug ? (names?.domains[row.domainSlug] ?? row.domainSlug) : ''}
                        {row.domainSlug && row.skillSlug ? ' · ' : ''}
                        {row.skillSlug ? (names?.skills[row.skillSlug] ?? row.skillSlug) : ''}
                        {row.difficulty ? ` · ${row.difficulty}` : ''}
                      </p>
                    ) : null}

                    {row.stemMd ? (
                      <Markdown source={row.stemMd} className="mt-3 text-sm" />
                    ) : (
                      <p className="mt-3 text-sm text-negative">
                        The question this report points at is no longer in the bank, so its text cannot
                        be shown.
                      </p>
                    )}

                    {row.isCurrentVersion === 0 ? (
                      <p className="mt-3 text-sm text-caution">
                        This is the version the learner saw, which is not the current version. Check the
                        current version before deciding.
                      </p>
                    ) : null}

                    {row.explanationMd ? (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium">
                          Show the published explanation
                        </summary>
                        <Markdown source={row.explanationMd} className="mt-2 text-sm" />
                      </details>
                    ) : null}

                    {row.examKey ? (
                      <p className="mt-3 text-sm">
                        <Link href={`/admin/questions?exam=${encodeURIComponent(row.examKey)}`}>
                          See this exam in the question inventory
                        </Link>
                      </p>
                    ) : null}
                  </div>

                  {open ? (
                    <FlagActions flagId={row.id} />
                  ) : (
                    <div className="mt-4 border-t border-line pt-4 text-sm">
                      <p className="font-medium">
                        {STATUS_LABEL[row.status] ?? row.status} on {timestamp(row.resolvedAt)}
                      </p>
                      <p className="mt-1 text-ink-muted">
                        {row.resolution ?? 'No resolution note was recorded.'}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </ul>
        )}

        {rows.length < total ? (
          <p className="mt-6 text-sm text-ink-muted">
            Showing the first {rows.length} of {total}. Filter by status to see the rest.
          </p>
        ) : null}
      </section>
    </Container>
  );
}
