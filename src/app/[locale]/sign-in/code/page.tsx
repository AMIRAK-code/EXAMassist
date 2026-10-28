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
import { CodeSignInForm } from './code-sign-in-form';

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.codeSignIn' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: (await pageAlternates(params, '/sign-in/code')),
    robots: { index: false, follow: true },
  };
}

export default async function CodeSignInPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  // Not offered at all on a deployment that cannot send email.
  if (!emailCodesMailer()) notFound();

  const locale = (await params).locale as Locale;
  const t = await getTranslations('auth');
  const query = await searchParams;
  const next = safeNext(query.next);
  const user = await getCurrentUser();
  if (user && !user.isGuest) return redirect({ href: next ?? '/account', locale });

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[
          { href: '/', label: t('breadcrumbs.home') },
          { href: withNext('/sign-in', next), label: t('breadcrumbs.signIn') },
          { label: t('breadcrumbs.emailCode') },
        ]}
      />
      <PageHeader title={t('codeSignIn.title')} />

      {user?.isGuest ? (
        <Alert tone="caution" title={t('guest.title')} className="mb-6">
          <p>
            {t.rich('codeSignIn.guestBody', {
              link: (chunks) => <Link href={withNext('/sign-up', next)}>{chunks}</Link>,
            })}
          </p>
        </Alert>
      ) : null}

      <Card>
        <h2 className="sr-only">{t('codeSignIn.formHeading')}</h2>
        <CodeSignInForm next={next} passwordHref={withNext('/sign-in', next)} ttlMinutes={CODE_TTL_MINUTES} />
      </Card>

      <p className="mt-6 text-ink-muted">{t('codeSignIn.about', { minutes: CODE_TTL_MINUTES })}</p>
    </Container>
  );
}
