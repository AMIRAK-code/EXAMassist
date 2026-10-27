import { Link } from '@/i18n/navigation';
import { PAGE_DATES } from '@/lib/content/page-dates';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { absoluteUrl, shareImages, SITE, siteUrl } from '@/lib/site';
import { Alert, Breadcrumbs, Card, Container, DefinitionList, PageHeader } from '@/components/ui';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { languageAlternates } from '@/i18n/alternates';
import { LOCALE_INFO, localizePath, type Locale } from '@/i18n/locales';

/**
 * Privacy notice — DRAFT.
 *
 * This describes what the application genuinely does today, written so that a
 * lawyer can check it against the code rather than against a template. Every
 * point we cannot settle ourselves is listed at the bottom instead of being
 * papered over with boilerplate. The text lives in messages/<locale>/about.json
 * under "privacy"; the English version prevails, and the page says so.
 */

const PATH = '/about/privacy';

/** Real dates: this draft was written on 2026-09-22, revised on 2026-10-05 for Premium, on 2026-10-07 for the daily totals and on 2026-10-27 for the on-site checkout and the language cookie. */
const PUBLISHED = PAGE_DATES.privacy.published;
const UPDATED = PAGE_DATES.privacy.updated;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.privacy.meta' });
  const alternates = languageAlternates(PATH, locale as Locale);
  return {
    title: t('title'),
    description: t('description'),
    alternates,
    openGraph: {
      images: shareImages('site', t('title')),
      type: 'article',
      url: alternates.canonical,
      title: `${t('title')} | ${SITE.shortName}`,
      description: t('description'),
      publishedTime: PUBLISHED,
      modifiedTime: UPDATED,
    },
  };
}

/** Each entry of "What we hold", in order; the text is under privacy.hold.<key>. */
const WHAT_WE_HOLD = [
  'session',
  'language',
  'guest',
  'credentials',
  'codes',
  'profile',
  'history',
  'reports',
  'tutor',
  'billing',
  'rateLimits',
  'totals',
] as const;

const WHAT_WE_DO_NOT = ['advertising', 'analytics', 'cards', 'cookies', 'selling', 'ai', 'marketing'] as const;

const WHY = ['signedIn', 'language', 'history', 'fix', 'tutor', 'codes', 'abuse'] as const;

const SECURITY = ['passwords', 'sessions', 'codes', 'scoping', 'origin', 'rateLimitKeys'] as const;

const CONTROLS = ['export', 'delete', 'signOut', 'guest', 'language'] as const;

const OPEN_QUESTIONS = [
  'controller',
  'lawfulBasis',
  'retention',
  'deletion',
  'minors',
  'hosting',
  'tutor',
  'payments',
  'cookies',
  'rights',
  'breach',
  'trademark',
] as const;

const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const format = await getFormatter();
  const title = t('privacy.meta.title');
  const publishedLabel = format.dateTime(new Date(`${PUBLISHED}T00:00:00Z`), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const trail = [{ href: '/', label: t('shared.home') }, { label: t('privacy.breadcrumb') }];
  const ldTrail = trail.map((crumb) => (crumb.href ? { ...crumb, href: localizePath(crumb.href, locale as Locale) } : crumb));

  return (
    <Container size="narrow">
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), ldTrail),
          {
            ...articleSchema({
              siteUrl: siteUrl(),
              url: absoluteUrl(localizePath(PATH, locale as Locale)),
              headline: title,
              description: t('privacy.meta.description'),
              datePublished: PUBLISHED,
              dateModified: UPDATED,
              publisherName: SITE.publisher,
              authorName: SITE.publisher,
            }),
            inLanguage: LOCALE_INFO[locale as Locale]?.htmlLang ?? 'en',
          },
        ]}
      />
      <Breadcrumbs trail={trail} />

      <Alert tone="caution" title={t('privacy.draftTitle')}>
        <p>
          {t.rich('privacy.draftBody', {
            name: SITE.name,
            link: (chunks) => <a href="#open-questions">{chunks}</a>,
          })}
        </p>
      </Alert>
      <p className="mt-3 text-sm text-ink-subtle">{t('privacy.languageVersions')}</p>

      <div className="mt-8">
        <PageHeader
          eyebrow={t('shared.eyebrow', { name: SITE.name })}
          title={t('privacy.title')}
          lead={t('privacy.lead')}
        />
      </div>

      <div className="rounded-card border-s-4 border-accent bg-accent-soft p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-strong">{t('shared.inShort')}</h2>
        <p className="mt-2 text-ink">
          {t.rich('privacy.inShort', {
            name: SITE.name,
            link: (chunks) => <Link href="/account">{chunks}</Link>,
          })}
        </p>
      </div>

      <p className="mt-4 text-sm text-ink-subtle">
        {t.rich('privacy.drafted', {
          publisher: SITE.publisher,
          date: publishedLabel,
          time: (chunks) => <time dateTime={PUBLISHED}>{chunks}</time>,
        })}
      </p>

      <div className="mt-10 space-y-12">
        <section aria-labelledby="what-we-hold">
          <h2 id="what-we-hold" className="font-heading text-2xl font-semibold">
            {t('privacy.hold.heading')}
          </h2>
          <Card className="mt-4">
            <DefinitionList
              items={WHAT_WE_HOLD.map((key) => ({
                term: t(`privacy.hold.${key}.term`),
                value: t(`privacy.hold.${key}.value`),
              }))}
            />
          </Card>
        </section>

        <section aria-labelledby="what-we-dont">
          <h2 id="what-we-dont" className="font-heading text-2xl font-semibold">
            {t('privacy.doNot.heading')}
          </h2>
          <div className="prose-academic">
            <ul>
              {WHAT_WE_DO_NOT.map((key) => (
                <li key={key}>{t(`privacy.doNot.${key}`)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="why">
          <h2 id="why" className="font-heading text-2xl font-semibold">
            {t('privacy.why.heading')}
          </h2>
          <div className="prose-academic">
            <ul>
              {WHY.map((key) => (
                <li key={key}>{t.rich(`privacy.why.${key}`, { strong })}</li>
              ))}
            </ul>
            <p>{t('privacy.why.noProfiling')}</p>
          </div>
        </section>

        <section aria-labelledby="security">
          <h2 id="security" className="font-heading text-2xl font-semibold">
            {t('privacy.security.heading')}
          </h2>
          <div className="prose-academic">
            <ul>
              {SECURITY.map((key) => (
                <li key={key}>{t(`privacy.security.${key}`)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="your-controls">
          <h2 id="your-controls" className="font-heading text-2xl font-semibold">
            {t('privacy.controls.heading')}
          </h2>
          <div className="prose-academic">
            <ul>
              {CONTROLS.map((key) => (
                <li key={key}>{t.rich(`privacy.controls.${key}`, { strong })}</li>
              ))}
            </ul>
          </div>
          <p className="mt-2 text-sm">
            <Link href="/account">{t('privacy.controls.accountLink')}</Link>
          </p>
        </section>

        <section aria-labelledby="open-questions">
          <h2 id="open-questions" className="font-heading text-2xl font-semibold">
            {t('privacy.openQuestions.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t('privacy.openQuestions.intro')}</p>
            <ol>
              {OPEN_QUESTIONS.map((key) => (
                <li key={key}>{t(`privacy.openQuestions.${key}`)}</li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </Container>
  );
}
