import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { emailCodesMailer } from '@/lib/auth/email-codes';
import { safeNext } from '@/lib/auth/next-path';
import { examTestName, getExamConfig } from '@/lib/exams/registry';
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/password';
import { Alert, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { SignUpForm } from './sign-up-form';

export const dynamic = 'force-dynamic';

const TITLE = 'Create an account';
const DESCRIPTION =
  'Create a free account to keep your practice history, bookmarks and review queue. An email address and a password are all we ask for.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const query = await searchParams;
  const next = safeNext(query.next);
  const user = await getCurrentUser();

  if (user && !user.isGuest) redirect(next ?? '/account');

  // A guest keeps everything they have already done, so say how much that is.
  // Scoped to the acting session's own user id - never to an id from the URL.
  let guestAttempts = 0;
  if (user?.isGuest) {
    const row = (await getDb()
      .prepare('SELECT COUNT(*) AS n FROM attempts WHERE user_id = ?')
      .get(user.id)) as { n: number } | undefined;
    guestAttempts = row?.n ?? 0;
  }

  const signInHref = next ? `/sign-in?next=${encodeURIComponent(next)}` : '/sign-in';
  const destination = describeNext(next);

  return (
    <Container size="narrow">
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'Create an account' }]} />

      {/* No lead above the form: see the sign-in page. It is said below the form instead. */}
      <PageHeader title={TITLE} />

      {destination ? (
        <p className="-mt-4 mb-6 font-semibold" role="note">
          {destination}
        </p>
      ) : null}

      {user?.isGuest ? (
        <Alert tone="positive" title="Your practice so far will be kept" className="mb-6">
          <p>
            {guestAttempts === 0
              ? 'You are practising as a guest. Creating an account here upgrades that same guest session, so anything you do now stays with you.'
              : `You are practising as a guest and have started ${guestAttempts} practice ${
                  guestAttempts === 1 ? 'session' : 'sessions'
                }. Creating an account here upgrades that same session, so your history, bookmarks and review queue all carry over.`}
          </p>
        </Alert>
      ) : (
        <Alert tone="info" title="Already practised as a guest?" className="mb-6">
          <p>
            Create the account in the same browser you practised in and your guest history, bookmarks
            and review queue carry straight over to it.
          </p>
        </Alert>
      )}

      <Card>
        <h2 className="sr-only">Account details</h2>
        <SignUpForm next={next} minPasswordLength={MIN_PASSWORD_LENGTH} emailCodes={emailCodesMailer() !== null} />
      </Card>

      <p className="mt-6 text-ink-muted">
        An email address and a password. No payment details, no phone number, and nothing shared with the
        test makers — we are independent of all of them.
      </p>

      <p className="mt-4 text-sm text-ink-muted">
        Already have an account? <Link href={signInHref}>Sign in</Link>.
      </p>

      <p className="mt-3 text-sm text-ink-subtle">
        By creating an account you agree to our <Link href="/about/terms">terms</Link>. Our{' '}
        <Link href="/about/privacy">privacy notice</Link> explains what we store, and you can export
        or delete everything from your account page at any time.
      </p>
    </Container>
  );
}

/**
 * Where the visitor goes once the account exists, when they came from an
 * exam's free test or plans, so the exam they chose stays in view.
 */
function describeNext(next: string | null): string | null {
  if (!next) return null;
  const [path, search = ''] = next.split('?');
  const freeTest = /^\/free-test\/([a-z0-9-]+)$/.exec(path);
  if (freeTest) {
    const config = getExamConfig(freeTest[1]);
    return config ? `Next: your free ${examTestName(config)} test.` : null;
  }
  if (path === '/premium') {
    const config = getExamConfig(new URLSearchParams(search).get('exam') ?? '');
    return config ? `Next: the Premium plans for your ${examTestName(config)} preparation.` : null;
  }
  return null;
}
