import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { pageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { CODE_TTL_MINUTES, emailCodesMailer } from '@/lib/auth/email-codes';
import { safeNext, withNext } from '@/lib/auth/next-path';
import { getCurrentUser } from '@/lib/auth/session';
import { Alert, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { VerifyEmailForm } from './verify-email-form';

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.verifyEmail' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: (await pageAlternates(params, '/verify-email')),
    robots: { index: false, follow: false },
  };
}

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ next?: string | string[]; sent?: string | string[] }>;
}) {
  // Not offered at all on a deployment that cannot send email.
  if (!emailCodesMailer()) notFound();

  const locale = (await params).locale as Locale;
  const t = await getTranslations('auth');
  const query = await searchParams;
  const next = safeNext(query.next);
  const continueHref = next ?? '/account';

  const user = await getCurrentUser();
  if (!user) return redirect({ href: withNext('/sign-in', '/account'), locale });
  if (user.isGuest || !user.email) return redirect({ href: withNext('/sign-up', next), locale });

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[
          { href: '/', label: t('breadcrumbs.home') },
          { href: '/account', label: t('breadcrumbs.account') },
          { label: t('breadcrumbs.confirmEmail') },
        ]}
      />
      <PageHeader title={t('verifyEmail.title')} />

      {user.emailVerifiedAt ? (
        <Alert tone="positive" title={t('verifyEmail.confirmedTitle')}>
          <p>
            {t.rich('verifyEmail.confirmedBody', {
              email: user.email,
              addr: (chunks) => <span className="break-all">{chunks}</span>,
              link: (chunks) => <Link href={continueHref}>{chunks}</Link>,
            })}
          </p>
        </Alert>
      ) : (
        <>
          <Card>
            <h2 className="sr-only">{t('verifyEmail.formHeading')}</h2>
            <VerifyEmailForm
              email={user.email}
              alreadySent={query.sent === '1'}
              continueHref={continueHref}
              ttlMinutes={CODE_TTL_MINUTES}
            />
          </Card>
          <p className="mt-6 text-ink-muted">{t('verifyEmail.about')}</p>
        </>
      )}
    </Container>
  );
}
