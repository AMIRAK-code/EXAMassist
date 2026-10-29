import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { CONTENT_LANG, languageAlternates, pageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getDb } from '@/lib/db';
import { EXAM_HUBS, getConfigsForHub, getHub } from '@/lib/exams/registry';
import { blueprintAvailability, examCoverage } from '@/lib/attempts/availability';
import { shareImages, SITE, siteUrl } from '@/lib/site';
import {
  Alert,
  Breadcrumbs,
  ButtonLink,
  Card,
  Container,
  DefinitionList,
  FidelityBadge,
  PageHeader,
  StatusBadge,
} from '@/components/ui';
import { OtherRoutes } from '@/components/exams/other-routes';
import { OfficialNote } from '@/components/exams/official-note';
import { JsonLd, articleSchema, breadcrumbSchema, webPageSchema } from '@/components/seo/json-ld';
import { headers } from 'next/headers';
import { countPageView } from '@/lib/analytics/funnel';
import { getCurrentUser } from '@/lib/auth/session';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { BOCCONI_HUB_SLUG, bocconiLandingData } from '@/lib/exams/bocconi-landing';
import { BOCCONI_FACTS_CHECKED_ON } from '@/lib/exams/bocconi-facts';
import { BocconiLanding } from '@/components/exams/bocconi-landing';
import { ViewBeacon } from '@/components/exams/view-beacon';
import { isSnapshotRequest } from '@/lib/seo/static-pages';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; hub: string }> };

export function generateStaticParams() {
  return EXAM_HUBS.map((hub) => ({ hub: hub.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, hub: slug } = await params;
  const t = await getTranslations({ locale, namespace: 'exams.hub' });
  const hub = getHub(slug);
  if (!hub) return { title: t('fallbackTitle') };
  if (hub.slug === BOCCONI_HUB_SLUG) return bocconiMetadata(locale as Locale);

  const title = t('metaTitle', { name: hub.name });
  // The tagline is the exam's own summary from its config, as published.
  const description = hub.tagline;
  const alternates = (await pageAlternates(params, `/exams/${hub.slug}`));
  return {
    title,
    description,
    alternates,
    openGraph: {
      url: alternates.canonical,
      title: `${title} | ${SITE.shortName}`,
      description,
      type: 'article',
      images: shareImages(`exam-${hub.slug}`, title),
    },
  };
}

/**
 * The Bocconi page is the site's page for Bocconi test preparation, so its
 * title and description say that, with the live question count.
 */
async function bocconiMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'exams.hub' });
  const counts = (await Promise.all(getConfigsForHub(BOCCONI_HUB_SLUG).map((c) => examCoverage(getDb(), c)))).reduce(
    (sum, c) => sum + c.publishedItems,
    0,
  );
  const title = t('bocconiMetaTitle');
  const description = t('bocconiMetaDescription', { count: counts });
  const alternates = languageAlternates(`/exams/${BOCCONI_HUB_SLUG}`, locale);
  return {
    title,
    description,
    alternates,
    openGraph: { url: alternates.canonical, title: `${title} | ${SITE.shortName}`, description, type: 'website', images: shareImages(`exam-${BOCCONI_HUB_SLUG}`, title) },
  };
}

export default async function ExamHubPage({ params }: Props) {
  const { locale, hub: slug } = await params;
  setRequestLocale(locale as Locale);
  const hub = getHub(slug);
  if (!hub) notFound();

  const t = await getTranslations('exams');
  const format = await getFormatter();
  const minutes = (value: number | null): string =>
    value === null ? t('table.notPublished') : t('table.minutes', { value });
  const url = (await pageAlternates(params, `/exams/${hub.slug}`)).canonical;

  const db = getDb();
  const configs = getConfigsForHub(slug);
  const trail = [
    { href: '/', label: t('breadcrumb.home') },
    { href: '/exams', label: t('breadcrumb.exams') },
    { label: hub.name },
  ];
  // A daily total of views, by coarse source; nothing about the visitor is kept.
  // The copy saved as a static file reports its own views from the browser.
  const requestHeaders = await headers();
  const snapshot = isSnapshotRequest(requestHeaders);
  if (!snapshot) await countPageView(db, 'landing_view', hub.slug, requestHeaders);
  const beacon = snapshot ? <ViewBeacon subject={hub.slug} /> : null;

  if (hub.slug === BOCCONI_HUB_SLUG) {
    const user = await getCurrentUser();
    const entitlements = await loadEntitlements(db, user?.id ?? null);
    const fullAccess = entitlements.can('practice', 'bocconi-undergraduate') && entitlements.can('practice', 'bocconi-law');
    const data = await bocconiLandingData(db);
    return (
      <Container>
        <JsonLd
          data={[
            breadcrumbSchema(siteUrl(), trail),
            webPageSchema({
              siteUrl: siteUrl(),
              url,
              name: t('hub.bocconiMetaTitle'),
              description: t('hub.bocconiSchemaDescription', { count: data.totalQuestions }),
              // The date the Bocconi facts on the page were last checked against Bocconi's own pages.
              dateModified: BOCCONI_FACTS_CHECKED_ON,
              about: 'Bocconi Online Test',
            }),
          ]}
        />
        <Breadcrumbs trail={trail} />
        {beacon}
        <BocconiLanding data={data} hasFullAccess={fullAccess} billingOn={entitlements.enforced} />

      </Container>
    );
  }

  const verifiedOn = configs[0]?.verifiedOn ?? '';

  return (
    <Container>
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), trail),
          articleSchema({
            siteUrl: siteUrl(),
            url,
            headline: t('hub.metaTitle', { name: hub.name }),
            description: hub.tagline,
            // Real dates only: this is the date the facts were verified.
            datePublished: verifiedOn,
            dateModified: verifiedOn,
            publisherName: SITE.publisher,
            authorName: SITE.publisher,
          }),
        ]}
      />
      <Breadcrumbs trail={trail} />
      {beacon}

      {/*
        No lead: the tagline repeated the summary below it, and gained a line
        when the interface font arrived, pushing the page down (0.0199 in the
        worst case, docs/REDESIGN.md §18). It stays the page's description, and
        the format guide's "In short".
      */}
      <PageHeader eyebrow={hub.publisher} title={hub.name} />
      <OfficialNote />

      {/* The direct answer, first: what this exam is, in one block. */}
      {(await Promise.all(configs.map(async (config) => {
        const coverage = (await examCoverage(db, config));
        const availability = (await blueprintAvailability(db, config));
        const offered = availability.filter((a) => a.available);
        const unavailable = availability.filter((a) => !a.available);

        return (
          <section
            key={config.examKey}
            aria-labelledby={`config-${config.examKey}`}
            className="mb-12"
          >
            {configs.length > 1 ? (
              <h2 id={`config-${config.examKey}`} className="mb-3 font-heading text-2xl font-semibold">
                {config.name}
              </h2>
            ) : (
              <h2 id={`config-${config.examKey}`} className="sr-only">
                {config.name}
              </h2>
            )}

            {/*
              From 768 px the summary and its details sit side by side, so the
              summary reflowing on a font swap has nothing beneath it in view.
            */}
            <Card className="mb-6 md:grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-x-6">
              <p lang={CONTENT_LANG} className="text-ink">{config.summary}</p>
              <div className="mt-4 md:mt-0">
                <DefinitionList
                  items={[
                    { term: t('hub.term.version'), value: <span lang={CONTENT_LANG}>{config.versionLabel}</span> },
                    { term: t('hub.term.cycle'), value: <span lang={CONTENT_LANG}>{config.admissionsCycle}</span> },
                    {
                      term: t('hub.term.verifiedOn'),
                      value: (
                        <time dateTime={config.verifiedOn}>
                          {/^\d{4}-\d{2}-\d{2}/.test(config.verifiedOn)
                            ? format.dateTime(new Date(config.verifiedOn), {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                timeZone: 'UTC',
                              })
                            : config.verifiedOn}
                        </time>
                      ),
                    },
                    {
                      term: t('hub.term.scoring'),
                      value: config.scoring.officialScale
                        ? t('hub.scale', {
                            label: config.scoring.officialScale.label,
                            min: config.scoring.officialScale.min,
                            max: config.scoring.officialScale.max,
                          })
                        : t('hub.scoringFallback'),
                    },
                    {
                      term: t('hub.term.wrongAnswers'),
                      value:
                        config.scoring.pointsIncorrect < 0
                          ? t('hub.penalised', {
                              points: config.scoring.pointsIncorrect,
                              omitted: config.scoring.pointsOmitted,
                            })
                          : t('hub.noPenalty'),
                    },
                  ]}
                />
              </div>
            </Card>

            {/* Structure table */}
            <h3 className="mb-3 font-heading text-xl font-semibold">{t('hub.structureHeading')}</h3>
            {/* Focusable, so the table can be scrolled sideways from the keyboard on a narrow screen. */}
            <div
              role="region"
              aria-label={t('hub.structureRegion', { name: config.name })}
              tabIndex={0}
              className="mb-6 relative overflow-x-auto rounded-card border border-line bg-surface"
            >
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">{t('hub.structureCaption', { name: config.name, publisher: config.publisher })}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {t('table.section')}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {t('table.questions')}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {t('table.time')}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {t('table.calculator')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {config.sections.map((section) => (
                    <tr key={section.key} className="border-b border-line last:border-0">
                      <th lang={CONTENT_LANG} scope="row" className="px-4 py-3 text-left font-normal">
                        {section.name}
                      </th>
                      <td className="px-4 py-3">{section.officialQuestionCount ?? t('table.notPublished')}</td>
                      <td className="px-4 py-3 tabular-nums">{minutes(section.officialTimeMinutes)}</td>
                      <td className="px-4 py-3">{t(`hub.calculator.${section.calculator}`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mb-8">
              <Link href={`/exams/${hub.slug}/format`}>{t('hub.formatGuideLink')}</Link>
            </p>

            {/* Practice */}
            <h3 className="mb-3 font-heading text-xl font-semibold">{t('hub.practiseHeading')}</h3>
            <p className="mb-4 text-ink-muted">
              {t('hub.coverage', {
                items: coverage.publishedItems,
                covered: coverage.domainsCovered,
                total: coverage.domainsTotal,
              })}{' '}
              <Link href="/about/editorial-standards">{t('hub.howChecked')}</Link>
            </p>

            {offered.length === 0 ? (
              <Alert tone="caution" title={t('hub.noFormatsTitle')}>
                {t('hub.noFormatsBody')}
              </Alert>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {offered.map((entry) => (
                  <Card as="li" key={entry.blueprint.id}>
                    <h4 lang={CONTENT_LANG} className="font-heading text-lg font-semibold">{entry.blueprint.label}</h4>
                    <p lang={CONTENT_LANG} className="mt-1 text-sm text-ink-muted">{entry.blueprint.description}</p>
                    <div className="mt-3">
                      <FidelityBadge fidelity={entry.blueprint.fidelity} />
                    </div>
                  </Card>
                ))}
              </ul>
            )}

            {offered.length > 0 && unavailable.length > 0 ? (
              <div className="mt-4 rounded-card border border-line bg-surface-sunken p-4">
                <h4 className="text-sm font-semibold">{t('hub.notOpenHeading')}</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  {unavailable.map((entry) => (
                    <li key={entry.blueprint.id} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <StatusBadge status={entry.blockedBy === 'rules' ? 'notoffered' : 'notyet'}>
                        {t(entry.blockedBy === 'rules' ? 'status.notoffered' : 'status.notyet')}
                      </StatusBadge>
                      <span className="font-medium">{entry.blueprint.label}</span>
                      <span className="text-ink-muted">
                        {entry.blockedBy === 'rules'
                          ? t('availability.rulesNotVerified')
                          : t('availability.needsMore', { shortfall: entry.shortfall })}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm">
                  <Link href={`/practice/${config.examKey}`}>{t('hub.whyOpen')}</Link>
                  {' · '}
                  <Link href="/exams#formats">{t('hub.everyFormat')}</Link>
                </p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href={`/practice/${config.examKey}`}>
                {configs.length > 1 ? t('hub.practiseVariant', { name: config.shortName }) : t('hub.startPractising')}
              </ButtonLink>
              <ButtonLink href={`/exams/${hub.slug}/format`} variant="secondary">
                {t('hub.formatGuideButton')}
              </ButtonLink>
            </div>

            {/* What is not simulated */}
            {!config.capabilities.fullSimulation.available ? (
              <Alert tone="info" title={t('hub.noSimulationTitle')} className="mt-6">
                <span lang={CONTENT_LANG}>{(config.capabilities.fullSimulation as { reason: string }).reason}</span>
              </Alert>
            ) : null}
          </section>
        );
      })))}

      {/* Routes into the same institution that another hub's test serves. */}
      <OtherRoutes routes={hub.otherRoutes ?? []} institution={hub.publisher} />
    </Container>
  );
}
