import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { examLabel } from '@/lib/learning/dashboard';
import { freeTestPreview } from '@/lib/attempts/service';
import { billingSettings, freeTestPath } from '@/lib/billing/config';
import { getAccess } from '@/lib/billing/service';
import { Alert, Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';
import { SubmitButton } from '@/components/submit-button';
import { startFreeTestAction } from './actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your free test',
  robots: { index: false, follow: false },
};

const NOTICES: Record<string, string> = {
  'rate-limited': 'You have started a lot of sessions. Please wait a moment and try again.',
  'insufficient-content': 'There are not enough reviewed questions to build this free test yet.',
};

/**
 * The one free session: the same fixed questions for every account. Visitors
 * and guests are asked to create an account first, and a learner who has
 * taken it is shown where it went.
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
  const access = user ? await getAccess(db, user.id) : null;
  // Nothing to choose between without a paywall, or with Premium
  if (!billingSettings().enabled || access?.fullAccess) redirect(`/practice/${config.examKey}`);

  const hub = getHubForConfig(config.examKey);
  const preview = await freeTestPreview(db, config.examKey);
  const here = freeTestPath(config.examKey);
  const plans = `/premium?exam=${encodeURIComponent(config.examKey)}`;
  const first = access?.firstSession ?? null;

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[
          { href: '/', label: 'Home' },
          { href: '/exams', label: 'Exams' },
          ...(hub ? [{ href: `/exams/${hub.slug}`, label: hub.name }] : []),
          { label: 'Free test' },
        ]}
      />
      <PageHeader
        eyebrow={config.publisher}
        title={`Your free ${config.shortName} test`}
        lead={
          preview
            ? `${preview.questions} questions across ${preview.sections === 1 ? 'one section' : `${preview.sections} sections`}, ${preview.minutes ? `about ${preview.minutes} minutes` : 'untimed'}, with full results and a worked explanation for every answer.`
            : undefined
        }
      />

      {notice && NOTICES[notice] ? (
        <Alert tone="caution" className="mb-6" role="alert">
          <p>{NOTICES[notice]}</p>
        </Alert>
      ) : null}

      {!user || !access?.registered ? (
        <Card padding="lg">
          <h2 className="font-heading text-xl font-semibold">Create a free account to take it</h2>
          <p className="mt-2 text-ink-muted">
            The free test needs an account, so your results are kept. It takes an email address and a
            password. Without an account you can still try the sample question on the home page.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href={`/sign-up?next=${encodeURIComponent(here)}`}>Create a free account</ButtonLink>
            <ButtonLink href={`/sign-in?next=${encodeURIComponent(here)}`} variant="secondary">
              Sign in
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm">
            <Link href="/#top">Try a sample question</Link>
          </p>
        </Card>
      ) : first ? (
        <Card padding="lg">
          {first.status === 'in_progress' ? (
            <>
              <h2 className="font-heading text-xl font-semibold">
                {first.examKey === config.examKey ? 'Your free test is waiting' : `Your free test is on ${examLabel(first.examKey)}`}
              </h2>
              <p className="mt-2 text-ink-muted">
                Each account has one free test, and yours is still open. Carry on where you left off; the
                questions stay the same however often you come back.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href={`/attempt/${first.id}`}>Continue your free test</ButtonLink>
                <ButtonLink href={plans} variant="secondary">
                  See Premium plans
                </ButtonLink>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-heading text-xl font-semibold">
                You have taken your free test{first.examKey === config.examKey ? '' : ` (${examLabel(first.examKey)})`}
              </h2>
              <p className="mt-2 text-ink-muted">
                Each account has one free test. Its results stay in your history. Premium opens every exam
                and every practice format, with fresh questions in every session.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href={plans}>See Premium plans</ButtonLink>
                <ButtonLink href={`/attempt/${first.id}/results`} variant="secondary">
                  Your free test results
                </ButtonLink>
              </div>
            </>
          )}
        </Card>
      ) : preview ? (
        <Card padding="lg">
          <h2 className="font-heading text-xl font-semibold">{preview.blueprint.label}</h2>
          <ul className="mt-3 list-disc space-y-1.5 ps-5 text-ink-muted">
            <li>Everyone gets the same questions, and you can take it once.</li>
            <li>
              {preview.minutes
                ? `${preview.blueprint.timing === 'per_part' ? 'Each section has its own clock' : 'One clock runs for the whole test'}${preview.blueprint.pauseBehaviour === 'clock_pauses' ? '; leaving the page pauses it' : ''}.`
                : 'Untimed: take as long as you need.'}
            </li>
            <li>At the end you see your results by topic and the worked explanation for every question.</li>
          </ul>
          <form action={startFreeTestAction} className="mt-6">
            <input type="hidden" name="examKey" value={config.examKey} />
            <SubmitButton pendingLabel="Starting…">Start the free test</SubmitButton>
          </form>
        </Card>
      ) : (
        <Alert tone="caution" title="Not ready yet">
          <p>
            There are not enough reviewed {config.shortName} questions to build the free test yet. The{' '}
            {hub ? <Link href={`/exams/${hub.slug}/format`}>format and scoring guide</Link> : 'format guide'} is
            complete and useful now.
          </p>
        </Alert>
      )}

      <p className="mt-8 text-sm text-ink-muted">
        Want every format, with fresh questions each time? <Link href={plans}>See the Premium plans</Link>.
      </p>
    </Container>
  );
}
