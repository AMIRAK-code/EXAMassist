import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { examTestName, getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { freeTestFor, freeTestPreview } from '@/lib/attempts/service';
import { freeTestPath, pricingPath } from '@/lib/billing/config';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { Alert, Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';
import { SubmitButton } from '@/components/submit-button';
import { startFreeTestAction } from './actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your free diagnostic',
  robots: { index: false, follow: false },
};

/** Every string on this page, for translation. */
const COPY = {
  crumbs: { home: 'Home', exams: 'Exams', here: 'Free diagnostic' },
  title: 'Your free {exam} diagnostic',
  lead: '{questions} questions across {sections}, {time}, with full results and a worked explanation for every answer.',
  oneSection: 'one section',
  sections: '{n} sections',
  aboutMinutes: 'about {n} minutes',
  untimed: 'untimed',
  notices: {
    'rate-limited': 'You have started a lot of sessions. Please wait a moment and try again.',
    'insufficient-content': 'There are not enough reviewed questions to build this diagnostic yet.',
  } as Record<string, string>,
  account: {
    title: 'Create a free account to take it',
    body: 'The diagnostic needs an account, so your results are kept. It takes an email address and a password. Without an account you can still try the sample questions.',
    signUp: 'Create a free account',
    signIn: 'Sign in',
    sample: 'Try a sample question',
  },
  waiting: {
    title: 'Your diagnostic is waiting',
    body: 'You have started it already. Carry on where you left off; the questions stay the same however often you come back.',
    action: 'Continue your diagnostic',
  },
  taken: {
    title: 'You have taken this diagnostic',
    body: 'There is one free diagnostic per exam, and its results stay in your history. A plan opens every practice format for this exam, with fresh questions in every session.',
    results: 'Your diagnostic results',
  },
  preview: {
    sameForEveryone: 'Everyone gets the same questions; there is one free diagnostic per exam.',
    perPart: 'Each section has its own clock',
    overall: 'One clock runs for the whole test',
    pauses: '; leaving the page pauses it',
    untimed: 'Untimed: take as long as you need.',
    results: 'At the end you see your results by topic and the worked explanation for every question.',
    start: 'Start the free diagnostic',
    starting: 'Starting…',
  },
  notReady: {
    title: 'Not ready yet',
    body: 'There are not enough reviewed {exam} questions to build the diagnostic yet. The format and scoring guide is complete and useful now.',
    guide: 'Read the format and scoring guide',
  },
  plans: 'See plans',
  footer: 'Want every format, with fresh questions each time?',
} as const;

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

/**
 * The free diagnostic for one exam: the same fixed questions for every
 * account, one per exam. Visitors and guests are asked to create an account
 * first (DIAGNOSTIC_NEEDS_ACCOUNT in src/lib/billing/plans.ts).
 */
export default async function FreeTestPage({
  params,
  searchParams,
}: {
  params: Promise<{ examKey: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { examKey } = await params;
  const { notice } = await searchParams;
  const config = getExamConfig(examKey);
  if (!config) notFound();

  const db = getDb();
  const user = await getCurrentUser();
  const entitlements = await loadEntitlements(db, user?.id ?? null);
  // Nothing to choose between when everything is open to this learner.
  if (entitlements.can('practice', config.examKey)) redirect(`/practice/${config.examKey}`);

  const hub = getHubForConfig(config.examKey);
  const preview = await freeTestPreview(db, config.examKey);
  const here = freeTestPath(config.examKey);
  const plans = pricingPath(config.examKey);
  const mayTake = entitlements.can('diagnostic', config.examKey);
  const taken = user && mayTake ? await freeTestFor(db, user.id, config.examKey) : null;
  const sections = preview ? (preview.sections === 1 ? COPY.oneSection : fill(COPY.sections, { n: preview.sections })) : '';

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[
          { href: '/', label: COPY.crumbs.home },
          { href: '/exams', label: COPY.crumbs.exams },
          ...(hub ? [{ href: `/exams/${hub.slug}`, label: hub.name }] : []),
          { label: COPY.crumbs.here },
        ]}
      />
      <PageHeader
        eyebrow={config.publisher}
        title={fill(COPY.title, { exam: examTestName(config) })}
        lead={
          preview
            ? fill(COPY.lead, {
                questions: preview.questions,
                sections,
                time: preview.minutes ? fill(COPY.aboutMinutes, { n: preview.minutes }) : COPY.untimed,
              })
            : undefined
        }
      />

      {notice && COPY.notices[notice] ? (
        <Alert tone="caution" className="mb-6" role="alert">
          <p>{COPY.notices[notice]}</p>
        </Alert>
      ) : null}

      {!mayTake ? (
        <Card padding="lg">
          <h2 className="font-heading text-xl font-semibold">{COPY.account.title}</h2>
          <p className="mt-2 text-ink-muted">{COPY.account.body}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href={`/sign-up?next=${encodeURIComponent(here)}`}>{COPY.account.signUp}</ButtonLink>
            <ButtonLink href={`/sign-in?next=${encodeURIComponent(here)}`} variant="secondary">
              {COPY.account.signIn}
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm">
            <Link href={hub ? `/?exam=${encodeURIComponent(hub.slug)}#top` : '/#top'}>{COPY.account.sample}</Link>
          </p>
        </Card>
      ) : taken ? (
        <Card padding="lg">
          {taken.status === 'in_progress' ? (
            <>
              <h2 className="font-heading text-xl font-semibold">{COPY.waiting.title}</h2>
              <p className="mt-2 text-ink-muted">{COPY.waiting.body}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href={`/attempt/${taken.id}`}>{COPY.waiting.action}</ButtonLink>
                <ButtonLink href={plans} variant="secondary">
                  {COPY.plans}
                </ButtonLink>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-heading text-xl font-semibold">{COPY.taken.title}</h2>
              <p className="mt-2 text-ink-muted">{COPY.taken.body}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href={plans}>{COPY.plans}</ButtonLink>
                <ButtonLink href={`/attempt/${taken.id}/results`} variant="secondary">
                  {COPY.taken.results}
                </ButtonLink>
              </div>
            </>
          )}
        </Card>
      ) : preview ? (
        <Card padding="lg">
          <h2 className="font-heading text-xl font-semibold">{preview.blueprint.label}</h2>
          <ul className="mt-3 list-disc space-y-1.5 ps-5 text-ink-muted">
            <li>{COPY.preview.sameForEveryone}</li>
            <li>
              {preview.minutes
                ? `${preview.blueprint.timing === 'per_part' ? COPY.preview.perPart : COPY.preview.overall}${preview.blueprint.pauseBehaviour === 'clock_pauses' ? COPY.preview.pauses : ''}.`
                : COPY.preview.untimed}
            </li>
            <li>{COPY.preview.results}</li>
          </ul>
          <form action={startFreeTestAction} className="mt-6">
            <input type="hidden" name="examKey" value={config.examKey} />
            <SubmitButton pendingLabel={COPY.preview.starting}>{COPY.preview.start}</SubmitButton>
          </form>
        </Card>
      ) : (
        <Alert tone="caution" title={COPY.notReady.title}>
          <p>{fill(COPY.notReady.body, { exam: config.shortName })}</p>
          {hub ? (
            <p className="mt-2">
              <Link href={`/exams/${hub.slug}/format`}>{COPY.notReady.guide}</Link>
            </p>
          ) : null}
        </Alert>
      )}

      <p className="mt-8 text-sm text-ink-muted">
        {COPY.footer} <Link href={plans}>{COPY.plans}</Link>.
      </p>
    </Container>
  );
}
