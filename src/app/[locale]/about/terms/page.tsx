import { Link } from '@/i18n/navigation';
import { PAGE_DATES } from '@/lib/content/page-dates';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { shareImages, SITE, siteUrl } from '@/lib/site';
import { Alert, Breadcrumbs, Card, Container } from '@/components/ui';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { languageAlternates } from '@/i18n/alternates';
import { localizePath, type Locale } from '@/i18n/locales';

const PATH = '/about/terms';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.terms.meta' });
  const alternates = languageAlternates(PATH, locale as Locale);
  return {
    title: t('title'),
    description: t('description'),
    alternates,
    openGraph: {
      images: shareImages('site', t('title')),
      url: alternates.canonical,
      title: `${t('title')} | ${SITE.shortName}`,
      description: t('description'),
    },
  };
}

const LAST_REVIEWED = PAGE_DATES.terms.updated;

const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

const OPEN_QUESTIONS = [
  'entity',
  'liability',
  'minors',
  'consumer',
  'vat',
  'trademark',
  'describing',
  'training',
  'accessibility',
] as const;

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tc = await getTranslations('common.site');
  const format = await getFormatter();
  const trail = [{ href: '/', label: t('shared.home') }, { label: t('terms.breadcrumb') }];
  const ldTrail = trail.map((crumb) => (crumb.href ? { ...crumb, href: localizePath(crumb.href, locale as Locale) } : crumb));

  return (
    <Container size="narrow">
      <JsonLd data={breadcrumbSchema(siteUrl(), ldTrail)} />
      <Breadcrumbs trail={trail} />

      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">{t('terms.title')}</h1>

      <Alert tone="caution" title={t('terms.draftTitle')} className="mt-6">
        <p>{t('terms.draftBody')}</p>
      </Alert>

      <p className="mt-4 text-sm text-ink-subtle">
        {t.rich('terms.drafted', {
          date: format.dateTime(new Date(`${LAST_REVIEWED}T00:00:00Z`), {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          }),
          time: (chunks) => <time dateTime={LAST_REVIEWED}>{chunks}</time>,
        })}
      </p>
      <p className="mt-2 text-sm text-ink-subtle">{t('terms.languageVersions')}</p>

      <div className="prose-academic mt-8">
        <h2>{t('terms.service.heading')}</h2>
        <p>{t('terms.service.p1', { name: SITE.name })}</p>
        <p>{t('terms.service.p2')}</p>

        <h2 id="sale">{t('terms.plans.heading')}</h2>
        <ul>
          <li>
            {t.rich('terms.plans.plans', {
              strong,
              link: (chunks) => <Link href="/pricing">{chunks}</Link>,
            })}
          </li>
          <li>{t('terms.plans.payment')}</li>
          <li>
            {t.rich('terms.plans.renewal', {
              link: (chunks) => <Link href="/account#billing">{chunks}</Link>,
            })}
          </li>
          <li>{t('terms.plans.start')}</li>
          <li>{t('terms.plans.failed')}</li>
          <li>{t('terms.plans.priceChange')}</li>
          <li>{t('terms.plans.deletion')}</li>
        </ul>

        <h2>{t('terms.independence.heading')}</h2>
        <p>{tc('independenceNotice')}</p>
        <p>{t('terms.independence.descriptive')}</p>

        <h2>{t('terms.noPromise.heading')}</h2>
        <ul>
          <li>{t('terms.noPromise.score')}</li>
          <li>{t('terms.noPromise.fidelity')}</li>
          <li>{t('terms.noPromise.current')}</li>
          <li>{t('terms.noPromise.service')}</li>
        </ul>

        <h2>{t('terms.conduct.heading')}</h2>
        <ul>
          <li>{t('terms.conduct.noAccount')}</li>
          <li>{t('terms.conduct.password')}</li>
          <li>{t('terms.conduct.abuse')}</li>
          <li>
            {t.rich('terms.conduct.delete', {
              link: (chunks) => <Link href="/account">{chunks}</Link>,
            })}
          </li>
        </ul>

        <h2>{t('terms.content.heading')}</h2>
        <p>{t('terms.content.body')}</p>

        <h2>{t('terms.reporting.heading')}</h2>
        <p>
          {t.rich('terms.reporting.body', {
            link: (chunks) => <Link href="/report-question">{chunks}</Link>,
          })}
        </p>

        <h2>{t('terms.changes.heading')}</h2>
        <p>{t('terms.changes.body')}</p>
      </div>

      <Card className="mt-10 border-s-4 border-s-caution">
        <h2 className="font-heading text-xl font-semibold">{t('terms.openQuestions.heading')}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t('terms.openQuestions.intro')}</p>
        <ol className="mt-4 list-decimal space-y-2 ps-5 text-sm">
          {OPEN_QUESTIONS.map((key) => (
            <li key={key}>
              {t.rich(`terms.openQuestions.${key}`, {
                strong,
                code: (chunks) => <code>{chunks}</code>,
              })}
            </li>
          ))}
        </ol>
      </Card>

      <p className="mt-8 text-sm">
        <Link href="/about/privacy">{t('terms.privacyLink')}</Link>
      </p>
    </Container>
  );
}
