import { Link } from '@/i18n/navigation';
import { PAGE_DATES } from '@/lib/content/page-dates';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { EXAM_CONFIGS, getHubForConfig } from '@/lib/exams/registry';
import { SITE, absoluteUrl, shareImages, siteUrl } from '@/lib/site';
import { Alert, Badge, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { TopicAccuracyExample } from '@/components/scoring/topic-accuracy-example';
import { MIN_ATTEMPTS_FOR_SIGNAL } from '@/lib/learning/recommend';
import { languageAlternates } from '@/i18n/alternates';
import { LOCALE_INFO, localizePath, type Locale } from '@/i18n/locales';

/**
 * How scoring works.
 *
 * The per-exam rules in the table are read from the exam registry rather than
 * retyped, so this page cannot drift away from what the engine actually applies.
 * The registry's own text (exam names, publishers, scale labels and the
 * recorded reasons) is shown as published; the page's text lives in
 * messages/<locale>/about.json under "howScoringWorks".
 */

const PATH = '/about/how-scoring-works';

/** Real dates: written on 2026-09-22; revised on 2026-09-24 to add the accuracy-by-topic illustration. */
const PUBLISHED = PAGE_DATES.howScoringWorks.published;
const UPDATED = PAGE_DATES.howScoringWorks.updated;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.howScoringWorks.meta' });
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

function formatRange(min: number, max: number): string {
  return `${min}–${max}`;
}

const WE_REPORT = ['raw', 'points', 'topic', 'pacing', 'session'] as const;

const WE_REFUSE = ['scaled', 'percentile', 'admission', 'readiness'] as const;

const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
const em = (chunks: React.ReactNode) => <em>{chunks}</em>;

export default async function HowScoringWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const format = await getFormatter();
  const longDate = (iso: string) =>
    format.dateTime(new Date(`${iso}T00:00:00Z`), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

  /** "+1", "0", "−0.2" — with a real minus sign, the locale's decimal mark, and no invented precision. */
  const formatPoints = (value: number): string => {
    if (value === 0) return format.number(0);
    const magnitude = format.number(Math.abs(value), { maximumFractionDigits: 6 });
    return value > 0 ? `+${magnitude}` : `−${magnitude}`;
  };

  const title = t('howScoringWorks.title');
  const trail = [{ href: '/', label: t('shared.home') }, { label: title }];
  const ldTrail = trail.map((crumb) => (crumb.href ? { ...crumb, href: localizePath(crumb.href, locale as Locale) } : crumb));

  const rows = EXAM_CONFIGS.map((config) => {
    const hub = getHubForConfig(config.examKey);
    return {
      key: config.examKey,
      name: config.name,
      shortName: config.shortName,
      publisher: config.publisher,
      hubSlug: hub?.slug ?? null,
      scoring: config.scoring,
      penalised: config.scoring.pointsIncorrect < 0,
    };
  });

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
              description: t('howScoringWorks.meta.description'),
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
        lead={t('howScoringWorks.lead')}
      />

      <div className="rounded-card border-s-4 border-accent bg-accent-soft p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-strong">{t('shared.inShort')}</h2>
        <p className="mt-2 text-ink">{t('howScoringWorks.inShort')}</p>
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
        <section aria-labelledby="we-report">
          <h2 id="we-report" className="font-heading text-2xl font-semibold">
            {t('howScoringWorks.report.heading')}
          </h2>
          <dl className="mt-4 space-y-4">
            {WE_REPORT.map((key) => (
              <div key={key} className="rounded-card border border-line bg-surface p-4">
                <dt className="font-medium text-ink">{t(`howScoringWorks.report.${key}.term`)}</dt>
                <dd className="mt-1 text-sm text-ink-muted">{t(`howScoringWorks.report.${key}.value`)}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-8 font-heading text-lg font-semibold">{t('howScoringWorks.report.topicHeading')}</h3>
          <div className="prose-academic">
            <p>{t('howScoringWorks.report.topicBody', { min: MIN_ATTEMPTS_FOR_SIGNAL })}</p>
          </div>
          <TopicAccuracyExample className="mt-4" />
        </section>

        <section aria-labelledby="we-refuse">
          <h2 id="we-refuse" className="font-heading text-2xl font-semibold">
            {t('howScoringWorks.refuse.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t('howScoringWorks.refuse.intro')}</p>
          </div>
          <ul className="mt-4 space-y-4">
            {WE_REFUSE.map((key) => (
              <li key={key} className="rounded-card border border-line bg-surface p-4">
                <p className="font-medium text-ink">{t(`howScoringWorks.refuse.${key}.claim`)}</p>
                <p className="mt-1 text-sm text-ink-muted">{t(`howScoringWorks.refuse.${key}.why`)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="two-cases">
          <h2 id="two-cases" className="font-heading text-2xl font-semibold">
            {t('howScoringWorks.twoCases.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t('howScoringWorks.twoCases.intro')}</p>
          </div>

          <Card className="mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-lg font-semibold">{t('howScoringWorks.twoCases.satHeading')}</h3>
              <Badge tone="neutral">{t('howScoringWorks.twoCases.satBadge')}</Badge>
            </div>
            <div className="prose-academic mt-2">
              <p>{t('howScoringWorks.twoCases.satP1')}</p>
              <p>{t('howScoringWorks.twoCases.satP2')}</p>
            </div>
          </Card>

          <Card className="mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-lg font-semibold">{t('howScoringWorks.twoCases.bocconiHeading')}</h3>
              <Badge tone="caution">{t('howScoringWorks.twoCases.bocconiBadge')}</Badge>
            </div>
            <div className="prose-academic mt-2">
              <p>{t('howScoringWorks.twoCases.bocconiP1')}</p>
              <p>{t.rich('howScoringWorks.twoCases.bocconiP2', { em })}</p>
              <p>{t('howScoringWorks.twoCases.bocconiP3')}</p>
            </div>
          </Card>
        </section>

        <section aria-labelledby="rules-table">
          <h2 id="rules-table" className="font-heading text-2xl font-semibold">
            {t('howScoringWorks.table.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t('howScoringWorks.table.intro')}</p>
          </div>

          <div
            role="region"
            aria-labelledby="rules-table"
            tabIndex={0}
            className="mt-4 relative overflow-x-auto rounded-card border border-line"
          >
            <table className="w-full min-w-[42rem] border-collapse bg-surface text-sm">
              <caption className="border-b border-line px-4 py-3 text-start text-sm text-ink-muted">
                {t('howScoringWorks.table.caption')}
              </caption>
              <thead>
                <tr className="bg-surface-sunken">
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-start font-semibold">
                    {t('howScoringWorks.table.exam')}
                  </th>
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-start font-semibold">
                    {t('howScoringWorks.table.correct')}
                  </th>
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-start font-semibold">
                    {t('howScoringWorks.table.wrong')}
                  </th>
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-start font-semibold">
                    {t('howScoringWorks.table.omitted')}
                  </th>
                  <th scope="col" className="border-b border-line px-4 py-2.5 text-start font-semibold">
                    {t('howScoringWorks.table.scale')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-line last:border-b-0">
                    <th scope="row" className="px-4 py-3 text-start font-medium">
                      {row.hubSlug ? (
                        <Link href={`/exams/${row.hubSlug}/format`}>{row.name}</Link>
                      ) : (
                        row.name
                      )}
                      <span className="block text-xs font-normal text-ink-subtle">
                        {row.publisher}
                      </span>
                    </th>
                    <td className="px-4 py-3 tabular-nums">{formatPoints(row.scoring.pointsCorrect)}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatPoints(row.scoring.pointsIncorrect)}
                      {row.penalised ? (
                        <span className="block text-xs text-ink-muted">{t('howScoringWorks.table.negativeMarking')}</span>
                      ) : (
                        <span className="block text-xs text-ink-muted">{t('howScoringWorks.table.noPenalty')}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatPoints(row.scoring.pointsOmitted)}</td>
                    <td className="px-4 py-3">
                      {row.scoring.officialScale ? (
                        <>
                          <span className="font-medium tabular-nums">
                            {formatRange(row.scoring.officialScale.min, row.scoring.officialScale.max)}
                          </span>
                          <span className="block text-xs text-ink-muted">
                            {row.scoring.officialScale.label}
                          </span>
                        </>
                      ) : (
                        <span className="text-ink-muted">{t('howScoringWorks.table.noScale')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm text-ink-muted">{t('howScoringWorks.table.exception')}</p>
        </section>

        <section aria-labelledby="no-scaled">
          <h2 id="no-scaled" className="font-heading text-2xl font-semibold">
            {t('howScoringWorks.noScaled.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t('howScoringWorks.noScaled.intro')}</p>
          </div>
          <div className="mt-4 space-y-3">
            {rows.map((row) => (
              <details key={row.key} className="rounded-card border border-line bg-surface p-4">
                <summary className="cursor-pointer font-medium text-ink">
                  {t('howScoringWorks.noScaled.summary', { exam: row.shortName })}
                </summary>
                <p className="mt-3 text-sm text-ink-muted">
                  {row.scoring.scaledEstimate.enabled
                    ? row.scoring.scaledEstimate.method
                    : row.scoring.scaledEstimate.reason}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="ours-not-theirs">
          <h2 id="ours-not-theirs" className="font-heading text-2xl font-semibold">
            {t('howScoringWorks.ours.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t('howScoringWorks.ours.intro')}</p>
            <ul>
              <li>
                {t.rich('howScoringWorks.ours.difficulty', {
                  strong,
                  link: (chunks) => <Link href="/about/editorial-standards">{chunks}</Link>,
                })}
              </li>
              <li>{t.rich('howScoringWorks.ours.routing', { strong })}</li>
              <li>{t.rich('howScoringWorks.ours.counts', { strong })}</li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="using-it">
          <h2 id="using-it" className="font-heading text-2xl font-semibold">
            {t('howScoringWorks.using.heading')}
          </h2>
          <div className="prose-academic">
            <p>{t('howScoringWorks.using.body')}</p>
          </div>
          <Alert tone="info" title={t('howScoringWorks.using.alertTitle')} className="mt-4">
            <p>{t('howScoringWorks.using.alertBody')}</p>
          </Alert>
          <p className="mt-4 text-sm">
            <Link href="/exams">{t('howScoringWorks.using.browse')}</Link>
          </p>
        </section>
      </div>
    </Container>
  );
}
