import { Link } from '@/i18n/navigation';
import { PAGE_DATES } from '@/lib/content/page-dates';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { absoluteUrl, shareImages, SITE, siteUrl } from '@/lib/site';
import { Badge, Breadcrumbs, Card, Container, DefinitionList, PageHeader } from '@/components/ui';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { pageAlternates } from '@/i18n/alternates';
import { LOCALE_INFO, localizePath, type Locale } from '@/i18n/locales';

/**
 * Editorial standards.
 *
 * Everything on this page describes a control that actually exists in this
 * repository: the question contract and its validator, the blinded review
 * export, the mechanical verdict script, and the dated research records.
 * Nothing here describes an aspiration. The text lives in
 * messages/<locale>/about.json under "editorialStandards".
 */

const PATH = '/about/editorial-standards';

/**
 * Real dates: written on 2026-09-22; revised on 2026-09-24 to state plainly
 * which checks are done by a model and that no per-question human review is
 * recorded, and again that day to record the option-letter correction.
 */
const PUBLISHED = PAGE_DATES.editorialStandards.published;
const UPDATED = PAGE_DATES.editorialStandards.updated;
/** The day every current exam research record was verified. */
const RECORDS_VERIFIED = '2026-09-18';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.editorialStandards.meta' });
  const alternates = (await pageAlternates(params, PATH));
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

/** The question states as the code names them; the descriptions are under states.<key>. */
const STATES: Array<{ term: string; key: string }> = [
  { term: 'draft', key: 'draft' },
  { term: 'in_review', key: 'inReview' },
  { term: 'published', key: 'published' },
  { term: 'quarantined', key: 'quarantined' },
  { term: 'retired', key: 'retired' },
];

const AUTOMATIC_CHECKS = [
  'duplicates',
  'keyExists',
  'numeric',
  'distractors',
  'explanationLength',
  'explanationNamesOption',
  'references',
  'reviewer',
  'solveRecord',
  'difficulty',
] as const;

/** Who does each step today, as the question records show it. */
const ROLES = ['drafting', 'checks', 'blindSolve', 'comparison', 'humanReview', 'reports'] as const;

const REFUSALS = ['reproduce', 'scaled', 'target', 'ours', 'dates', 'affiliation'] as const;

const em = (chunks: React.ReactNode) => <em>{chunks}</em>;
const code = (chunks: React.ReactNode) => <code>{chunks}</code>;

export default async function EditorialStandardsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const format = await getFormatter();
  const longDate = (iso: string) =>
    format.dateTime(new Date(`${iso}T00:00:00Z`), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

  const title = t('editorialStandards.title');
  const trail = [{ href: '/', label: t('shared.home') }, { label: title }];
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
              description: t('editorialStandards.meta.description'),
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

      <PageHeader
        eyebrow={t('shared.eyebrow', { name: SITE.name })}
        title={title}
        lead={t('editorialStandards.lead')}
      />

      <div className="rounded-card border-s-4 border-accent bg-accent-soft p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-strong">{t('shared.inShort')}</h2>
        <p className="mt-2 text-ink">{t('editorialStandards.inShort', { name: SITE.name })}</p>
      </div>

      <p className="mt-4 text-sm text-ink-subtle">
        {t.rich('shared.byline', {
          publisher: SITE.publisher,
          publishedDate: longDate(PUBLISHED),
          updatedDate: longDate(UPDATED),
          published: (chunks) => <time dateTime={PUBLISHED}>{chunks}</time>,
          updated: (chunks) => <time dateTime={UPDATED}>{chunks}</time>,
        })}
      </p>

      <div className="mt-10 space-y-12">
        <section aria-labelledby="original">
          <h2 id="original" className="font-heading text-2xl font-semibold">
            {t('editorialStandards.original.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t.rich('editorialStandards.original.p1', { code })}</p>
            <p>{t.rich('editorialStandards.original.p2', { code })}</p>
          </div>
        </section>

        <section aria-labelledby="states">
          <h2 id="states" className="font-heading text-2xl font-semibold">
            {t('editorialStandards.states.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t('editorialStandards.states.intro')}</p>
          </div>
          <Card className="mt-4">
            <DefinitionList
              items={STATES.map((state) => ({
                term: state.term,
                value: t(`editorialStandards.states.${state.key}`),
              }))}
            />
          </Card>
        </section>

        <section aria-labelledby="automatic">
          <h2 id="automatic" className="font-heading text-2xl font-semibold">
            {t('editorialStandards.automatic.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t.rich('editorialStandards.automatic.intro', { em })}</p>
            <ul>
              {AUTOMATIC_CHECKS.map((key) => (
                <li key={key}>{t(`editorialStandards.automatic.checks.${key}`)}</li>
              ))}
            </ul>
            <p>{t('editorialStandards.automatic.outro')}</p>
          </div>
        </section>

        <section aria-labelledby="blind-solve">
          <h2 id="blind-solve" className="font-heading text-2xl font-semibold">
            {t('editorialStandards.blindSolve.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t('editorialStandards.blindSolve.intro')}</p>

            <h3>{t('editorialStandards.blindSolve.strippedHeading')}</h3>
            <p>{t('editorialStandards.blindSolve.stripped')}</p>

            <h3>{t('editorialStandards.blindSolve.scratchHeading')}</h3>
            <p>{t('editorialStandards.blindSolve.scratch')}</p>

            <h3>{t('editorialStandards.blindSolve.mechanicalHeading')}</h3>
            <p>{t('editorialStandards.blindSolve.mechanical')}</p>

            <h3>{t('editorialStandards.blindSolve.quarantineHeading')}</h3>
            <p>{t.rich('editorialStandards.blindSolve.quarantine', { em, code })}</p>
          </div>
        </section>

        <section aria-labelledby="roles">
          <h2 id="roles" className="font-heading text-2xl font-semibold">
            {t('editorialStandards.roles.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t('editorialStandards.roles.intro')}</p>
          </div>
          <Card className="mt-4">
            <DefinitionList
              items={ROLES.map((key) => ({
                term: t(`editorialStandards.roles.${key}.term`),
                value: t(`editorialStandards.roles.${key}.value`),
              }))}
            />
          </Card>
        </section>

        <section aria-labelledby="limits">
          <h2 id="limits" className="font-heading text-2xl font-semibold">
            {t('editorialStandards.limits.heading')}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="caution">{t('editorialStandards.limits.badgeEditorial')}</Badge>
            <Badge tone="caution">{t('editorialStandards.limits.badgeNotCalibrated')}</Badge>
            <Badge tone="caution">{t('editorialStandards.limits.badgeNoPrediction')}</Badge>
          </div>
          <div className="prose-academic">
            <p>{t('editorialStandards.limits.p1')}</p>
            <p>
              {t.rich('editorialStandards.limits.p2', {
                link: (chunks) => <Link href="/about/how-scoring-works">{chunks}</Link>,
              })}
            </p>
          </div>
        </section>

        <section aria-labelledby="exam-facts">
          <h2 id="exam-facts" className="font-heading text-2xl font-semibold">
            {t('editorialStandards.examFacts.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t.rich('editorialStandards.examFacts.p1', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
            <p>{t('editorialStandards.examFacts.p2')}</p>
            <p>{t.rich('editorialStandards.examFacts.p3', { em })}</p>
            <p>
              {t.rich('editorialStandards.examFacts.p4', {
                date: longDate(RECORDS_VERIFIED),
                time: (chunks) => <time dateTime={RECORDS_VERIFIED}>{chunks}</time>,
              })}
            </p>
          </div>
        </section>

        <section aria-labelledby="corrections">
          <h2 id="corrections" className="font-heading text-2xl font-semibold">
            {t('editorialStandards.corrections.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t('editorialStandards.corrections.p1')}</p>
            <p>{t('editorialStandards.corrections.p2')}</p>
          </div>
          <Card className="mt-4">
            <h3 className="font-heading text-lg font-semibold">{t('editorialStandards.corrections.cardTitle')}</h3>
            <p className="mt-1 text-sm text-ink-muted">{t('editorialStandards.corrections.cardBody')}</p>
            <p className="mt-3 text-sm">
              <Link href="/report-question">{t('editorialStandards.corrections.cardLink')}</Link>
            </p>
          </Card>
        </section>

        <section aria-labelledby="never">
          <h2 id="never" className="font-heading text-2xl font-semibold">
            {t('editorialStandards.refusals.heading')}
          </h2>
          <div className="prose-academic">
            <ul>
              {REFUSALS.map((key) => (
                <li key={key}>{t(`editorialStandards.refusals.${key}`)}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </Container>
  );
}
