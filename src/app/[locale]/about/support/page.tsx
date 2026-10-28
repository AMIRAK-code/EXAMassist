import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { PAGE_DATES } from '@/lib/content/page-dates';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CONTACT, shareImages, SITE, siteUrl } from '@/lib/site';
import { Breadcrumbs, Card, Container } from '@/components/ui';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { MailIcon } from '@/components/site/social-icons';
import { pageAlternates } from '@/i18n/alternates';
import { localizePath, type Locale } from '@/i18n/locales';

/**
 * Why support is answered by people, and how to reach them. The 48-hour
 * promise here and in the footer is the same one (tests/unit/copy-claims).
 */

const PATH = '/about/support';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.support.meta' });
  const alternates = await pageAlternates(params, PATH);
  const description = t('description', { name: SITE.name, email: CONTACT.support });
  return {
    title: t('title'),
    description,
    alternates,
    openGraph: {
      type: 'article',
      images: shareImages('site', t('title')),
      url: alternates.canonical,
      title: `${t('title')} | ${SITE.shortName}`,
      description,
      publishedTime: PAGE_DATES.support.published,
      modifiedTime: PAGE_DATES.support.updated,
    },
  };
}

const strong = (chunks: ReactNode) => <strong>{chunks}</strong>;
const mail = (address: string) => (chunks: ReactNode) => <a href={`mailto:${address}`}>{chunks}</a>;

export default async function SupportPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const trail = [{ href: '/', label: t('shared.home') }, { label: t('support.breadcrumb') }];
  const ldTrail = trail.map((crumb) => (crumb.href ? { ...crumb, href: localizePath(crumb.href, locale as Locale) } : crumb));

  return (
    <Container size="narrow">
      <JsonLd data={breadcrumbSchema(siteUrl(), ldTrail)} />
      <Breadcrumbs trail={trail} />

      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">{t('support.title')}</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t('support.lead', { name: SITE.name })}</p>

      <Card className="mt-8 border-s-4 border-s-accent">
        <p className="flex flex-wrap items-center gap-2 font-heading text-xl font-semibold">
          <MailIcon />
          <a href={`mailto:${CONTACT.support}`}>{CONTACT.support}</a>
        </p>
        <p className="mt-2 text-ink-muted">{t.rich('support.how.reply', { strong })}</p>
      </Card>

      <div className="prose-academic mt-10">
        <h2>{t('support.why.heading')}</h2>
        <p>{t('support.why.p1')}</p>
        <p>{t('support.why.p2')}</p>
        <p>
          {t.rich('support.why.p3', {
            link: (chunks) => <Link href="/about/editorial-standards">{chunks}</Link>,
          })}
        </p>

        <h2>{t('support.how.heading')}</h2>
        <ul>
          <li>{t.rich('support.how.write', { strong, support: mail(CONTACT.support), email: CONTACT.support })}</li>
          <li>{t.rich('support.how.reply', { strong })}</li>
          <li>{t.rich('support.how.include', { strong })}</li>
          <li>
            {t.rich('support.how.question', {
              strong,
              link: (chunks) => <Link href="/report-question">{chunks}</Link>,
            })}
          </li>
          <li>{t.rich('support.how.other', { info: mail(CONTACT.info), infoEmail: CONTACT.info })}</li>
        </ul>

        <h2>{t('support.promise.heading')}</h2>
        <p>{t('support.promise.body')}</p>
        <p>
          {t.rich('support.promise.privacy', {
            link: (chunks) => <Link href="/about/privacy">{chunks}</Link>,
          })}
        </p>
      </div>
    </Container>
  );
}
