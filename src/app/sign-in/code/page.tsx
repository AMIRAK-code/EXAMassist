import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { CODE_TTL_MINUTES, emailCodesMailer } from '@/lib/auth/email-codes';
import { safeNext, withNext } from '@/lib/auth/next-path';
import { getCurrentUser } from '@/lib/auth/session';
import { Alert, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { CodeSignInForm } from './code-sign-in-form';

export const dynamic = 'force-dynamic';

const TITLE = 'Sign in with an email code';

export const metadata: Metadata = {
  title: TITLE,
  description: 'Sign in to your account with a one-time code sent to your email address, instead of your password.',
  robots: { index: false, follow: true },
};

export default async function CodeSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  // Not offered at all on a deployment that cannot send email.
  if (!emailCodesMailer()) notFound();

  const query = await searchParams;
  const next = safeNext(query.next);
  const user = await getCurrentUser();
  if (user && !user.isGuest) redirect(next ?? '/account');

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[{ href: '/', label: 'Home' }, { href: withNext('/sign-in', next), label: 'Sign in' }, { label: 'Email code' }]}
      />
      <PageHeader title={TITLE} />

      {user?.isGuest ? (
        <Alert tone="caution" title="You are practising as a guest" className="mb-6">
          <p>
            Signing in to an existing account switches away from this guest session, and the practice you
            have done as a guest stays with the guest session.{' '}
            <Link href={withNext('/sign-up', next)}>Create an account instead</Link> to keep it.
          </p>
        </Alert>
      ) : null}

      <Card>
        <h2 className="sr-only">Get a sign-in code</h2>
        <CodeSignInForm next={next} passwordHref={withNext('/sign-in', next)} ttlMinutes={CODE_TTL_MINUTES} />
      </Card>

      <p className="mt-6 text-ink-muted">
        The code works once, for {CODE_TTL_MINUTES} minutes, and only for the address it was sent to. Your password
        stays exactly as it is.
      </p>
    </Container>
  );
}
