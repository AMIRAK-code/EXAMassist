import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { UnauthorizedError, requireUser, type AuthUser } from '@/lib/auth/session';
import {
  NOTEBOOK_PAGE,
  NOTEBOOK_VIEWS,
  buildNotebook,
  parsePage,
  parseView,
  type NotebookData,
  type NotebookEntry,
  type NotebookView,
} from '@/lib/learning/notebook';
import { labelText } from '@/lib/learning/mistakes';
import { startRetryAction, toggleBookmarkAction } from '@/app/actions/learning';
import { LearningNotice } from '@/components/learning-notice';
import { OutcomeBadge } from '@/components/results/results-sections';
import { SubmitButton } from '@/components/submit-button';
import { Badge, Breadcrumbs, ButtonLink, Card, Container, EmptyState, PageHeader, cx } from '@/components/ui';

/**
 * The mistake notebook.
 *
 * Due now and coming back later come from the review schedule; all mistakes
 * and bookmarks are the rest. Each entry is the latest missed encounter of a
 * question, from the learner's own finished sessions, and opens on the
 * question's review page. Nothing is inferred and nothing is scored again.
 */

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}): Promise<Metadata> {
  const page = parsePage((await searchParams).page);
  return {
    title: page > 1 ? `Mistake notebook, page ${page}` : 'Mistake notebook',
    description: 'Questions you got wrong or left blank: what is due to revisit now, what comes back later, and why.',
    // Private page. Authorization is the protection; this is only an indexing hint.
    robots: { index: false, follow: false },
  };
}

async function requireLearner(nextPath: string): Promise<AuthUser> {
  try {
    return await requireUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
    throw error;
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return 'date not recorded';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'date not recorded';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const DESCRIPTIONS: Record<NotebookView, string> = {
  due: 'Missed questions whose time to come back has arrived, oldest first.',
  later: 'Missed questions scheduled to come back, soonest first. A miss returns the day after; you can revisit one early.',
  all: 'Every question you have got wrong or left blank in a finished session, most recent first.',
  bookmarked: 'Questions you bookmarked, whether you got them right or not.',
};

/** A notebook view's page; the first page has no page parameter. */
function pageHref(view: NotebookView, page: number): string {
  return `/review?filter=${view}${page > 1 ? `&page=${page}` : ''}`;
}

function schedule(entry: NotebookEntry, now: number): string | null {
  if (!entry.dueAt) return null;
  return new Date(entry.dueAt).getTime() <= now ? 'Due now' : `Back on ${formatDate(entry.dueAt)}`;
}

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[]; page?: string | string[]; notice?: string | string[] }>;
}) {
  const user = await requireLearner('/review');
  const query = await searchParams;
  const view = parseView(query.filter);
  const requested = parsePage(query.page);
  const data = buildNotebook(getDb(), user.id, view, new Date(), requested);
  // A page past the end (the view has shrunk since the link was made) opens the last one.
  if (requested !== data.page) {
    const notice = typeof query.notice === 'string' ? `&notice=${encodeURIComponent(query.notice)}` : '';
    redirect(`${pageHref(view, data.page)}${notice}`);
  }
  const here = pageHref(view, data.page);
  const now = Date.now();
  const trail = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { label: 'Mistake notebook' },
  ];

  return (
    <Container>
      <Breadcrumbs trail={trail} />
      <PageHeader
        title="Mistake notebook"
        lead="A missed question comes back the day after, and again at growing intervals once you answer it correctly."
      />

      <LearningNotice code={query.notice} className="mb-6" />

      <nav aria-label="Notebook views" className="mb-3">
        <ul className="flex flex-wrap gap-2">
          {NOTEBOOK_VIEWS.map((option) => {
            const active = option.key === view;
            return (
              <li key={option.key}>
                <Link
                  href={`/review?filter=${option.key}`}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] px-4 text-sm font-semibold no-underline',
                    active ? 'border-ink bg-ink text-ink-inverse hover:text-ink-inverse' : 'border-line-strong bg-surface text-ink hover:border-ink hover:text-ink',
                  )}
                >
                  {option.label}
                  <span className={cx('tabular-nums font-normal', active ? 'text-ink-inverse-muted' : 'text-ink-subtle')}>
                    {data.counts[option.key]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <p className="mb-8 max-w-2xl text-sm text-ink-muted">{DESCRIPTIONS[view]}</p>

      {data.entries.length === 0 ? (
        <EmptyView view={view} counts={data.counts} nextDueAt={data.nextDueAt} />
      ) : (
        <>
          {data.retryGroups.length > 0 ? (
            <Card className="mb-8">
              <h2 className="font-heading text-lg font-semibold">Answer them again</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {data.pageCount > 1 ? 'A retry asks the questions on this page again in a separate session.' : 'A retry asks these same questions in a separate session.'} It never changes your earlier results and is
                not counted in your accuracy by topic; answering a question correctly moves it further out in the schedule.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {data.retryGroups.map((group) =>
                  group.questionIds.length > 0 ? (
                    <form key={group.examKey} action={startRetryAction}>
                      <input type="hidden" name="examKey" value={group.examKey} />
                      <input type="hidden" name="questionIds" value={group.questionIds.join(',')} />
                      <input type="hidden" name="returnTo" value={here} />
                      <SubmitButton pendingLabel="Starting the retry…">
                        {`Retry ${group.questionIds.length} ${data.retryGroups.length > 1 ? `${group.examLabel} ` : ''}question${group.questionIds.length === 1 ? '' : 's'}`}
                      </SubmitButton>
                    </form>
                  ) : null,
                )}
              </div>
              {data.retryGroups.some((group) => group.unavailable > 0) ? (
                <p className="mt-3 text-sm text-ink-muted">
                  {`${data.retryGroups.reduce((n, group) => n + group.unavailable, 0)} of these ${data.retryGroups.reduce((n, group) => n + group.unavailable, 0) === 1 ? 'is' : 'are'} being revised and not offered again for now.`}
                </p>
              ) : null}
            </Card>
          ) : null}

          {data.labelSummary.length > 0 ? (
            <p className="mb-6 text-sm text-ink-muted">
              {`Your labels so far: ${data.labelSummary.map((label) => `${label.text} (${label.count})`).join(' · ')}`}
            </p>
          ) : null}

          <ol className="space-y-3">
            {data.entries.map((entry) => {
              const when = schedule(entry, now);
              const notes = [
                entry.missCount > 1 ? `missed ${entry.missCount} times` : null,
                `last seen ${formatDate(entry.seenAt)}`,
                entry.correction === 'corrected' ? 'corrected since' : null,
                entry.correction === 'unavailable' ? 'being revised' : null,
              ].filter(Boolean);
              return (
                <Card as="li" key={entry.attemptItemId} padding="sm" className="sm:flex sm:items-start sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <OutcomeBadge outcome={entry.outcome} />
                      <Badge tone="neutral">{entry.examLabel}</Badge>
                      {when ? <Badge tone={when === 'Due now' ? 'caution' : 'neutral'}>{when}</Badge> : null}
                      {entry.bookmarked ? <Badge tone="accent">Bookmarked</Badge> : null}
                    </div>
                    <h2 className="mt-2 font-medium">{`${entry.topicName} · ${entry.skillName}`}</h2>
                    {entry.preview ? <p className="mt-1 text-sm text-ink-muted">{entry.preview}</p> : null}
                    <p className="mt-1 text-xs text-ink-subtle">{notes.join(' · ')}</p>
                    {entry.labels.length > 0 ? (
                      <p className="mt-2 text-sm">{`Your label${entry.labels.length === 1 ? '' : 's'}: ${entry.labels.map(labelText).join(', ')}`}</p>
                    ) : null}
                  </div>
                  <div className="mt-3 flex shrink-0 flex-wrap items-center gap-3 sm:mt-0 sm:flex-col sm:items-end">
                    <ButtonLink href={`/attempt/${entry.attemptId}/results/${entry.ordinal}`} size="sm" variant="secondary">
                      Review answer and explanation
                    </ButtonLink>
                    <form action={toggleBookmarkAction}>
                      <input type="hidden" name="questionId" value={entry.questionId} />
                      <input type="hidden" name="returnTo" value={here} />
                      <SubmitButton size="sm" variant="quiet">
                        {entry.bookmarked ? 'Remove bookmark' : 'Bookmark'}
                      </SubmitButton>
                    </form>
                  </div>
                </Card>
              );
            })}
          </ol>
          {data.pageCount > 1 ? <Pagination data={data} /> : null}
        </>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/dashboard" variant="secondary">
          Back to dashboard
        </ButtonLink>
        <ButtonLink href="/study-plan" variant="secondary">
          Study plan
        </ButtonLink>
      </div>
    </Container>
  );
}

function EmptyView({
  view,
  counts,
  nextDueAt,
}: {
  view: NotebookView;
  counts: Record<NotebookView, number>;
  nextDueAt: string | null;
}) {
  if (view === 'due') {
    return (
      <EmptyState
        title="Nothing is due right now"
        action={
          counts.later > 0 ? (
            <ButtonLink href="/review?filter=later">See what comes back later</ButtonLink>
          ) : (
            <ButtonLink href="/dashboard">Back to dashboard</ButtonLink>
          )
        }
      >
        <p>
          {counts.later > 0
            ? `${counts.later} missed question${counts.later === 1 ? ' comes' : 's come'} back later${nextDueAt ? `, the next on ${formatDate(nextDueAt)}` : ''}.`
            : 'When you miss a question in a finished session, it comes back here the day after.'}
        </p>
      </EmptyState>
    );
  }
  const copy: Record<Exclude<NotebookView, 'due'>, { title: string; body: string }> = {
    later: { title: 'Nothing is scheduled', body: 'Questions you miss are scheduled to come back here.' },
    all: { title: 'No mistakes yet', body: 'Questions you get wrong or leave blank in a finished session appear here, with the answer and the full explanation.' },
    bookmarked: { title: 'No bookmarks yet', body: 'Bookmark a question from its review page and it is kept here, whether you answered it correctly or not.' },
  };
  return (
    <EmptyState title={copy[view].title} action={<ButtonLink href="/dashboard">Back to dashboard</ButtonLink>}>
      <p>{copy[view].body}</p>
    </EmptyState>
  );
}

/** Previous, every page by number, and next; each a plain link that keeps the view. */
function Pagination({ data }: { data: NotebookData }) {
  const last = Math.min(data.firstIndex + NOTEBOOK_PAGE - 1, data.total);
  const pages = Array.from({ length: data.pageCount }, (_, index) => index + 1);
  const control =
    'inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border-[1.5px] px-3 text-sm font-semibold no-underline';
  const idle = 'border-line-strong bg-surface text-ink hover:border-ink hover:text-ink';
  return (
    <nav aria-label="Notebook pages" className="mt-8 border-t border-line pt-6">
      <p className="mb-3 text-sm text-ink-muted">{`Showing ${data.firstIndex}–${last} of ${data.total}`}</p>
      <ul className="flex flex-wrap items-center gap-2">
        {data.page > 1 ? (
          <li>
            <Link href={pageHref(data.view, data.page - 1)} rel="prev" className={cx(control, idle)}>
              Previous<span className="sr-only"> page</span>
            </Link>
          </li>
        ) : null}
        {pages.map((page) => {
          const current = page === data.page;
          return (
            <li key={page}>
              <Link
                href={pageHref(data.view, page)}
                aria-current={current ? 'page' : undefined}
                className={cx(control, current ? 'border-ink bg-ink text-ink-inverse hover:text-ink-inverse' : idle)}
              >
                <span className="sr-only">Page </span>
                {page}
              </Link>
            </li>
          );
        })}
        {data.page < data.pageCount ? (
          <li>
            <Link href={pageHref(data.view, data.page + 1)} rel="next" className={cx(control, idle)}>
              Next<span className="sr-only"> page</span>
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
