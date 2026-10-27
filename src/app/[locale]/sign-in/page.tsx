import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { languageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getCurrentUser } from '@/lib/auth/session';
import { emailCodesMailer } from '@/lib/auth/email-codes';
import { safeNext, withNext } from '@/lib/auth/next-path';
import { Alert, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { SignInForm } from './sign-in-form';

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.signIn' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: languageAlternates('/sign-in', locale as Locale),
    // A functional page, not editorial content: there is nothing here to index.
    robots: { index: false, follow: true },
  };
}

export default async function SignInPage({
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

  // Someone with a real account is already where they wanted to be.
  if (user && !user.isGuest) return redirect({ href: next ?? '/account', locale });

  const signUpHref = withNext('/sign-up', next);
  // Code sign-in and password reset need email, which a deployment may not have.
  const emailCodes = emailCodesMailer() !== null;

  return (
    <Container size="narrow">
      <Breadcrumbs trail={[{ href: '/', label: t('breadcrumbs.home') }, { label: t('signIn.title') }]} />

      {/*
        No lead above the form: a paragraph there gained a line when the
        interface font arrived and pushed the form down (0.19 on a phone,
        docs/REDESIGN.md §18.1). What an account keeps is said below it.
      */}
      <PageHeader title={t('signIn.title')} />

      {user?.isGuest ? (
        <Alert tone="caution" title={t('guest.title')} className="mb-6">
          <p>{t.rich('signIn.guestBody', { link: (chunks) => <Link href={signUpHref}>{chunks}</Link> })}</p>
        </Alert>
      ) : null}

      <Card>
        <h2 className="sr-only">{t('signIn.formHeading')}</h2>
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
      <p className="mt-6 text-ink-muted">{t('signIn.about')}</p>
      <ul className="mt-4 space-y-2 text-sm">
        <li>
          <Link href={signUpHref}>{t('signIn.createAccount')}</Link>
        </li>
        <li>
          <Link href="/exams">{t('signIn.browseExams')}</Link>
        </li>
        <li>
          <Link href="/about/privacy">{t('signIn.privacy')}</Link>
        </li>
      </ul>
      {emailCodes ? null : <p className="mt-4 text-sm text-ink-subtle">{t('signIn.noReset')}</p>}
    </Container>
  );
}
