import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CODE_TTL_MINUTES, emailCodesMailer } from '@/lib/auth/email-codes';
import { safeNext, withNext } from '@/lib/auth/next-path';
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/password';
import { Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { ForgotPasswordForm } from './forgot-password-form';

export const dynamic = 'force-dynamic';

const TITLE = 'Reset your password';

export const metadata: Metadata = {
  title: TITLE,
  description: 'Choose a new password with a one-time code sent to the email address on your account.',
  robots: { index: false, follow: true },
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  // Not offered at all on a deployment that cannot send email.
  if (!emailCodesMailer()) notFound();

  const query = await searchParams;
  const next = safeNext(query.next);

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[{ href: '/', label: 'Home' }, { href: withNext('/sign-in', next), label: 'Sign in' }, { label: TITLE }]}
      />
      <PageHeader title={TITLE} />

      <Card>
        <h2 className="sr-only">Get a password reset code</h2>
        <ForgotPasswordForm
          next={next}
          signInHref={withNext('/sign-in', next)}
          minPasswordLength={MIN_PASSWORD_LENGTH}
          ttlMinutes={CODE_TTL_MINUTES}
        />
      </Card>

      <p className="mt-6 text-ink-muted">
        Your practice history, bookmarks and review queue are not touched. Only the password changes, and every
        device that was signed in to the account is signed out.
      </p>
    </Container>
  );
}
