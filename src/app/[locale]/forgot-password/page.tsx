import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { pageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { CODE_TTL_MINUTES, emailCodesMailer } from '@/lib/auth/email-codes';
import { safeNext, withNext } from '@/lib/auth/next-path';
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/password';
import { Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { ForgotPasswordForm } from './forgot-password-form';

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.forgotPassword' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: (await pageAlternates(params, '/forgot-password')),
    robots: { index: false, follow: true },
  };
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  // Not offered at all on a deployment that cannot send email.
  if (!emailCodesMailer()) notFound();

  const t = await getTranslations('auth');
  const query = await searchParams;
  const next = safeNext(query.next);

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[
          { href: '/', label: t('breadcrumbs.home') },
          { href: withNext('/sign-in', next), label: t('breadcrumbs.signIn') },
          { label: t('forgotPassword.title') },
        ]}
      />
      <PageHeader title={t('forgotPassword.title')} />

      <Card>
        <h2 className="sr-only">{t('forgotPassword.formHeading')}</h2>
        <ForgotPasswordForm
          next={next}
          signInHref={withNext('/sign-in', next)}
          minPasswordLength={MIN_PASSWORD_LENGTH}
          ttlMinutes={CODE_TTL_MINUTES}
        />
      </Card>

      <p className="mt-6 text-ink-muted">{t('forgotPassword.about')}</p>
    </Container>
  );
}
