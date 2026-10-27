import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { languageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { emailCodesMailer } from '@/lib/auth/email-codes';
import { safeNext, withNext } from '@/lib/auth/next-path';
import { examTestName, getExamConfig } from '@/lib/exams/registry';
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/password';
import { Alert, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { SignUpForm } from './sign-up-form';

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;
type Translate = (key: string, values?: Record<string, string | number>) => string;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.signUp' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: languageAlternates('/sign-up', locale as Locale),
    robots: { index: false, follow: true },
  };
}

export default async function SignUpPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations('auth');
  const query = await searchParams;
  const next = safeNext(query.next);
  const user = await getCurrentUser();

  if (user && !user.isGuest) return redirect({ href: next ?? '/account', locale });

  // A guest keeps everything they have already done, so say how much that is.
  // Scoped to the acting session's own user id - never to an id from the URL.
  let guestAttempts = 0;
  if (user?.isGuest) {
    const row = (await getDb()
      .prepare('SELECT COUNT(*) AS n FROM attempts WHERE user_id = ?')
      .get(user.id)) as { n: number } | undefined;
    guestAttempts = row?.n ?? 0;
  }

  const signInHref = withNext('/sign-in', next);
  const destination = describeNext(next, t);

  return (
    <Container size="narrow">
      <Breadcrumbs trail={[{ href: '/', label: t('breadcrumbs.home') }, { label: t('signUp.title') }]} />

      {/* No lead above the form: see the sign-in page. It is said below the form instead. */}
      <PageHeader title={t('signUp.title')} />

      {destination ? (
        <p className="-mt-4 mb-6 font-semibold" role="note">
          {destination}
        </p>
      ) : null}

      {user?.isGuest ? (
        <Alert tone="positive" title={t('signUp.guestTitle')} className="mb-6">
          <p>
            {guestAttempts === 0 ? t('signUp.guestNone') : t('signUp.guestSome', { count: guestAttempts })}
          </p>
        </Alert>
      ) : (
        <Alert tone="info" title={t('signUp.visitorTitle')} className="mb-6">
          <p>{t('signUp.visitorBody')}</p>
        </Alert>
      )}

      <Card>
        <h2 className="sr-only">{t('signUp.formHeading')}</h2>
        <SignUpForm next={next} minPasswordLength={MIN_PASSWORD_LENGTH} emailCodes={emailCodesMailer() !== null} />
      </Card>

      <p className="mt-6 text-ink-muted">{t('signUp.about')}</p>

      <p className="mt-4 text-sm text-ink-muted">
        {t.rich('signUp.haveAccount', { link: (chunks) => <Link href={signInHref}>{chunks}</Link> })}
      </p>

      <p className="mt-3 text-sm text-ink-subtle">
        {t.rich('signUp.consent', {
          terms: (chunks) => <Link href="/about/terms">{chunks}</Link>,
          privacy: (chunks) => <Link href="/about/privacy">{chunks}</Link>,
        })}
      </p>
    </Container>
  );
}

/**
 * Where the visitor goes once the account exists, when they came from an
 * exam's free test or plans, so the exam they chose stays in view. The exam's
 * name is data from its config and stays as published.
 */
function describeNext(next: string | null, t: Translate): string | null {
  if (!next) return null;
  const [path, search = ''] = next.split('?');
  const freeTest = /^\/free-test\/([a-z0-9-]+)$/.exec(path);
  if (freeTest) {
    const config = getExamConfig(freeTest[1]);
    return config ? t('signUp.next.freeTest', { test: examTestName(config) }) : null;
  }
  if (path === '/pricing' || path === '/checkout') {
    const config = getExamConfig(new URLSearchParams(search).get('exam') ?? '');
    if (path === '/checkout') {
      return config ? t('signUp.next.checkoutFor', { test: examTestName(config) }) : t('signUp.next.checkout');
    }
    return config ? t('signUp.next.plans', { test: examTestName(config) }) : null;
  }
  return null;
}
