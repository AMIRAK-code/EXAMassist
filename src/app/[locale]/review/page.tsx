import { getLocale, getTranslations } from 'next-intl/server';
import { useLocale, useTranslations } from 'next-intl';
import { Link, redirect } from '@/i18n/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { languageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
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
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'results.notebook' });
  const page = parsePage((await searchParams).page);
  return {
    title: page > 1 ? t('metaTitlePage', { page }) : t('metaTitle'),
    description: t('metaDescription'),
    // Private page. Authorization is the protection; this is only an indexing hint.
    robots: { index: false, follow: false },
    alternates: languageAlternates('/review', locale as Locale),
  };
}

async function requireLearner(nextPath: string, locale: string): Promise<AuthUser> {
  try {
    return await requireUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect({ href: `/sign-in?next=${encodeURIComponent(nextPath)}`, locale });
    throw error;
  }
}

type NotebookT = ReturnType<typeof useTranslations<'results.notebook'>>;

function formatDate(iso: string | null, locale: string, t: NotebookT): string {
  if (!iso) return t('dateNotRecorded');
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return t('dateNotRecorded');
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

/** A notebook view's page; the first page has no page parameter. */
function pageHref(view: NotebookView, page: number): string {
  return `/review?filter=${view}${page > 1 ? `&page=${page}` : ''}`;
}

function schedule(entry: NotebookEntry, now: number, locale: string, t: NotebookT): { due: boolean; text: string } | null {
  if (!entry.dueAt) return null;
  return new Date(entry.dueAt).getTime() <= now
    ? { due: true, text: t('dueNow') }
    : { due: false, text: t('backOn', { date: formatDate(entry.dueAt, locale, t) }) };
}

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[]; page?: string | string[]; notice?: string | string[] }>;
}) {
  const locale = await getLocale();
  const t = await getTranslations('results.notebook');
  const labelT = await getTranslations('results.mistakeLabels');
  const nav = await getTranslations('common.nav');
  const user = await requireLearner('/review', locale);
  const query = await searchParams;
  const view = parseView(query.filter);
  const requested = parsePage(query.page);
  const data = (await buildNotebook(getDb(), user.id, view, new Date(), requested));
  // A page past the end (the view has shrunk since the link was made) opens the last one.
  if (requested !== data.page) {
    const notice = typeof query.notice === 'string' ? `&notice=${encodeURIComponent(query.notice)}` : '';
    redirect({ href: `${pageHref(view, data.page)}${notice}`, locale });
  }
  const here = pageHref(view, data.page);
  const now = Date.now();
  const home = await getTranslations('results.breadcrumbs');
  const trail = [{ href: '/', label: home('home') }, { href: '/dashboard', label: nav('dashboard') }, { label: t('title') }];

  return (
    <Container>
      <Breadcrumbs trail={trail} />
      <PageHeader title={t('title')} lead={t('lead')} />

      <LearningNotice code={query.notice} className="mb-6" />

      <nav aria-label={t('viewsLabel')} className="mb-3">
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
                  {t(`views.${option.key}`)}
                  <span className={cx('tabular-nums font-normal', active ? 'text-ink-inverse-muted' : 'text-ink-subtle')}>
                    {data.counts[option.key]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <p className="mb-8 max-w-2xl text-sm text-ink-muted">{t(`descriptions.${view}`)}</p>

      {data.entries.length === 0 ? (
        <EmptyView view={view} counts={data.counts} nextDueAt={data.nextDueAt} />
      ) : (
        <>
          {data.retryGroups.length > 0 ? (
            <Card className="mb-8">
              <h2 className="font-heading text-lg font-semibold">{t('retryTitle')}</h2>
              <p className="mt-1 text-sm text-ink-muted">{data.pageCount > 1 ? t('retryBodyPaged') : t('retryBody')}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {data.retryGroups.map((group) =>
                  group.questionIds.length > 0 ? (
                    <form key={group.examKey} action={startRetryAction}>
                      <input type="hidden" name="examKey" value={group.examKey} />
                      <input type="hidden" name="questionIds" value={group.questionIds.join(',')} />
                      <input type="hidden" name="returnTo" value={here} />
                      <SubmitButton pendingLabel={t('retryPending')}>
                        {data.retryGroups.length > 1
                          ? t('retryButtonExam', { count: group.questionIds.length, exam: group.examLabel })
                          : t('retryButton', { count: group.questionIds.length })}
                      </SubmitButton>
                    </form>
                  ) : null,
                )}
              </div>
              {data.retryGroups.some((group) => group.unavailable > 0) ? (
                <p className="mt-3 text-sm text-ink-muted">
                  {t('retryUnavailable', { count: data.retryGroups.reduce((n, group) => n + group.unavailable, 0) })}
                </p>
              ) : null}
            </Card>
          ) : null}

          {data.labelSummary.length > 0 ? (
            <p className="mb-6 text-sm text-ink-muted">
              {t('labelSummary', {
                labels: data.labelSummary.map((label) => t('labelCount', { label: labelT(label.key), count: label.count })).join(' · '),
              })}
            </p>
          ) : null}

          <ol className="space-y-3">
            {data.entries.map((entry) => {
              const when = schedule(entry, now, locale, t);
              const notes = [
                entry.missCount > 1 ? t('missedTimes', { count: entry.missCount }) : null,
                t('lastSeen', { date: formatDate(entry.seenAt, locale, t) }),
                entry.correction === 'corrected' ? t('corrected') : null,
                entry.correction === 'unavailable' ? t('revising') : null,
              ].filter(Boolean);
              return (
                <Card as="li" key={entry.attemptItemId} padding="sm" className="sm:flex sm:items-start sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <OutcomeBadge outcome={entry.outcome} />
                      <Badge tone="neutral">{entry.examLabel}</Badge>
                      {when ? <Badge tone={when.due ? 'caution' : 'neutral'}>{when.text}</Badge> : null}
                      {entry.bookmarked ? <Badge tone="accent">{t('bookmarked')}</Badge> : null}
                    </div>
                    <h2 className="mt-2 font-medium">{t('entryHeading', { topic: entry.topicName, skill: entry.skillName })}</h2>
                    {entry.preview ? <p className="mt-1 text-sm text-ink-muted">{entry.preview}</p> : null}
                    <p className="mt-1 text-xs text-ink-subtle">{notes.join(' · ')}</p>
                    {entry.labels.length > 0 ? (
                      <p className="mt-2 text-sm">{t('yourLabels', {
                          count: entry.labels.length,
                          labels: new Intl.ListFormat(locale, { style: 'narrow', type: 'unit' }).format(
                            entry.labels.map((label) => labelT(label)),
                          ),
                        })}</p>
                    ) : null}
                  </div>
                  <div className="mt-3 flex shrink-0 flex-wrap items-center gap-3 sm:mt-0 sm:flex-col sm:items-end">
                    <ButtonLink href={`/attempt/${entry.attemptId}/results/${entry.ordinal}`} size="sm" variant="secondary">
                      {t('reviewEntry')}
                    </ButtonLink>
                    <form action={toggleBookmarkAction}>
                      <input type="hidden" name="questionId" value={entry.questionId} />
                      <input type="hidden" name="returnTo" value={here} />
                      <SubmitButton size="sm" variant="quiet">
                        {entry.bookmarked ? t('removeBookmark') : t('bookmark')}
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
          {t('backToDashboard')}
        </ButtonLink>
        <ButtonLink href="/study-plan" variant="secondary">
          {nav('studyPlan')}
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
  const t = useTranslations('results.notebook');
  const locale = useLocale();
  if (view === 'due') {
    return (
      <EmptyState
        title={t('emptyDueTitle')}
        action={
          counts.later > 0 ? (
            <ButtonLink href="/review?filter=later">{t('emptyDueLater')}</ButtonLink>
          ) : (
            <ButtonLink href="/dashboard">{t('backToDashboard')}</ButtonLink>
          )
        }
      >
        <p>
          {counts.later > 0
            ? nextDueAt
              ? t('emptyDueLaterBodyNext', { count: counts.later, date: formatDate(nextDueAt, locale, t) })
              : t('emptyDueLaterBody', { count: counts.later })
            : t('emptyDueNone')}
        </p>
      </EmptyState>
    );
  }
  const copy = {
    later: { title: t('emptyLaterTitle'), body: t('emptyLaterBody') },
    all: { title: t('emptyAllTitle'), body: t('emptyAllBody') },
    bookmarked: { title: t('emptyBookmarkedTitle'), body: t('emptyBookmarkedBody') },
  } satisfies Record<Exclude<NotebookView, 'due'>, { title: string; body: string }>;
  return (
    <EmptyState title={copy[view].title} action={<ButtonLink href="/dashboard">{t('backToDashboard')}</ButtonLink>}>
      <p>{copy[view].body}</p>
    </EmptyState>
  );
}

/** Previous, every page by number, and next; each a plain link that keeps the view. */
function Pagination({ data }: { data: NotebookData }) {
  const t = useTranslations('results.notebook');
  const sr = (chunks: ReactNode) => <span className="sr-only">{chunks}</span>;
  const last = Math.min(data.firstIndex + NOTEBOOK_PAGE - 1, data.total);
  const pages = Array.from({ length: data.pageCount }, (_, index) => index + 1);
  const control =
    'inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border-[1.5px] px-3 text-sm font-semibold no-underline';
  const idle = 'border-line-strong bg-surface text-ink hover:border-ink hover:text-ink';
  return (
    <nav aria-label={t('pagesLabel')} className="mt-8 border-t border-line pt-6">
      <p className="mb-3 text-sm text-ink-muted">{t('showing', { first: data.firstIndex, last, total: data.total })}</p>
      <ul className="flex flex-wrap items-center gap-2">
        {data.page > 1 ? (
          <li>
            <Link href={pageHref(data.view, data.page - 1)} rel="prev" className={cx(control, idle)}>
              {t.rich('previous', { sr })}
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
                {t.rich('pageNumber', { page, sr })}
              </Link>
            </li>
          );
        })}
        {data.page < data.pageCount ? (
          <li>
            <Link href={pageHref(data.view, data.page + 1)} rel="next" className={cx(control, idle)}>
              {t.rich('next', { sr })}
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
