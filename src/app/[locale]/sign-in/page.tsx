import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { emailCodesMailer } from '@/lib/auth/email-codes';
import { safeNext, withNext } from '@/lib/auth/next-path';
import { Alert, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { SignInForm } from './sign-in-form';

export const dynamic = 'force-dynamic';

const TITLE = 'Sign in';
const DESCRIPTION =
  'Sign in to keep your practice history, bookmarks and review queue on every device you study from.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // A functional page, not editorial content: there is nothing here to index.
  robots: { index: false, follow: true },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const query = await searchParams;
  const next = safeNext(query.next);
  const user = await getCurrentUser();

  // Someone with a real account is already where they wanted to be.
  if (user && !user.isGuest) redirect(next ?? '/account');

  const signUpHref = next ? `/sign-up?next=${encodeURIComponent(next)}` : '/sign-up';
  // Code sign-in and password reset need email, which a deployment may not have.
  const emailCodes = emailCodesMailer() !== null;

  return (
    <Container size="narrow">
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: TITLE }]} />

      {/*
        No lead above the form: a paragraph there gained a line when the
        interface font arrived and pushed the form down (0.19 on a phone,
        docs/REDESIGN.md §18.1). What an account keeps is said below it.
      */}
      <PageHeader title={TITLE} />

      {user?.isGuest ? (
        <Alert tone="caution" title="You are practising as a guest" className="mb-6">
          <p>
            Signing in to an existing account switches away from this guest session, and the practice
            you have done as a guest stays with the guest session rather than moving across.{' '}
            <Link href={signUpHref}>Create an account instead</Link> to keep it.
          </p>
        </Alert>
      ) : null}

      <Card>
        <h2 className="sr-only">Sign in with your email address</h2>
        <SignInForm
          next={next}
          forgotHref={emailCodes ? withNext('/forgot-password', next) : null}
          codeHref={emailCodes ? withNext('/sign-in/code', next) : null}
        />
      </Card>

      {/*
        Plain sentences, with each link starting its own line: links inside
        running text jumped between lines when the interface font arrived.
      */}
      <p className="mt-6 text-ink-muted">
        Your practice history, bookmarks and review queue follow your account, so you can study on one
        device and pick up on another. No account yet? Creating one takes an email address and a
        password, nothing else.
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        <li>
          <Link href={signUpHref}>Create an account</Link>
        </li>
        <li>
          <Link href="/exams">Browse the exam guides without signing in</Link>
        </li>
        <li>
          <Link href="/about/privacy">How we handle your data</Link>
        </li>
      </ul>
      {emailCodes ? null : (
        <p className="mt-4 text-sm text-ink-subtle">
          We cannot reset a password for you yet, so keep yours somewhere safe.
        </p>
      )}
    </Container>
  );
}
