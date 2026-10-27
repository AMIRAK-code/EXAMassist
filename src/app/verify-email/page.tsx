import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { CODE_TTL_MINUTES, emailCodesMailer } from '@/lib/auth/email-codes';
import { safeNext, withNext } from '@/lib/auth/next-path';
import { getCurrentUser } from '@/lib/auth/session';
import { Alert, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { VerifyEmailForm } from './verify-email-form';

export const dynamic = 'force-dynamic';

const TITLE = 'Confirm your email address';

export const metadata: Metadata = {
  title: TITLE,
  description: 'Confirm the email address on your account with a one-time code.',
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; sent?: string | string[] }>;
}) {
  // Not offered at all on a deployment that cannot send email.
  if (!emailCodesMailer()) notFound();

  const query = await searchParams;
  const next = safeNext(query.next);
  const continueHref = next ?? '/account';

  const user = await getCurrentUser();
  if (!user) redirect(withNext('/sign-in', '/account'));
  if (user.isGuest || !user.email) redirect(withNext('/sign-up', next));

  return (
    <Container size="narrow">
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { href: '/account', label: 'Account' }, { label: 'Confirm email' }]} />
      <PageHeader title={TITLE} />

      {user.emailVerifiedAt ? (
        <Alert tone="positive" title="Your address is confirmed">
          <p>
            <span className="break-all">{user.email}</span> is confirmed, so password resets and sign-in codes will
            reach you. <Link href={continueHref}>Continue</Link>
          </p>
        </Alert>
      ) : (
        <>
          <Card>
            <h2 className="sr-only">Enter your confirmation code</h2>
            <VerifyEmailForm
              email={user.email}
              alreadySent={query.sent === '1'}
              continueHref={continueHref}
              ttlMinutes={CODE_TTL_MINUTES}
            />
          </Card>
          <p className="mt-6 text-ink-muted">
            Your account works whether or not you confirm it. Confirming makes sure that, if you ever forget your
            password, the reset code reaches you.
          </p>
        </>
      )}
    </Container>
  );
}
