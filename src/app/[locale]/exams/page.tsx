import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { pageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getDb } from '@/lib/db';
import { listHubs, requireExamConfig } from '@/lib/exams/registry';
import { examCoverage } from '@/lib/attempts/availability';
import { buildHomeData } from '@/lib/home/home-data';
import { FormatAvailabilityTable } from '@/components/exams/format-availability';
import { shareImages, SITE, siteUrl } from '@/lib/site';
import { Badge, Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'exams.index' });
  const title = t('title');
  const description = t('metaDescription');
  const alternates = (await pageAlternates(params, '/exams'));
  return {
    title,
    description,
    alternates,
    openGraph: { url: alternates.canonical, title: `${title} | ${SITE.shortName}`, description, images: shareImages('site', title) },
  };
}

const AUDIENCES = ['undergraduate', 'law', 'graduate'] as const;

export default async function ExamsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('exams');
  const format = await getFormatter();
  const db = getDb();
  const trail = [{ href: '/', label: t('breadcrumb.home') }, { label: t('breadcrumb.exams') }];

  const groups = AUDIENCES.map((audience) => ({
    audience,
    label: t(`index.groups.${audience}.label`),
    blurb: t(`index.groups.${audience}.blurb`),
  }));

  const { matrix, asOf } = (await buildHomeData(db));

  const hubs = (await Promise.all(listHubs().map(async (hub) => {
    const configs = hub.configKeys.map(requireExamConfig);
    const coverage = (await Promise.all(configs.map(async (config) => (await examCoverage(db, config)))));
    return {
      hub,
      configs,
      items: coverage.reduce((total, c) => total + c.publishedItems, 0),
      domainsCovered: coverage.reduce((total, c) => total + c.domainsCovered, 0),
      domainsTotal: coverage.reduce((total, c) => total + c.domainsTotal, 0),
    };
  })));

  return (
    <Container>
      <JsonLd data={breadcrumbSchema(siteUrl(), trail)} />
      <Breadcrumbs trail={trail} />

      {/*
        What the guides record is said after the exams: as a lead it gained a
        line when the interface font arrived and pushed the first exams down
        (docs/REDESIGN.md §18).
      */}
      <PageHeader title={t('index.title')} />

      {groups.map((group) => {
        const groupHubs = hubs.filter((entry) => entry.hub.audiences.includes(group.audience));
        if (groupHubs.length === 0) return null;

        return (
          <section key={group.audience} className="mb-12" aria-labelledby={`group-${group.audience}`}>
            <h2 id={`group-${group.audience}`} className="font-heading text-2xl font-semibold">
              {group.label}
            </h2>
            <p className="mt-1 max-w-2xl text-ink-muted">{group.blurb}</p>

            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {groupHubs.map(({ hub, configs, items, domainsCovered, domainsTotal }) => (
                <Card as="li" key={hub.slug} className="flex flex-col">
                  {/* The audience badges wrap under the title rather than squeeze it on a phone. */}
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                    <h3 className="min-w-0 font-heading text-xl font-semibold">
                      <Link href={`/exams/${hub.slug}`} className="no-underline hover:underline">
                        {hub.name}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {hub.audiences.map((audience) => (
                        <Badge key={audience} tone="neutral">
                          {t(`audience.${audience}`)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="eyebrow mt-1">{hub.publisher}</p>
                  <p className="mt-3 flex-1 text-sm text-ink-muted">{hub.tagline}</p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
                    <div>
                      <dt className="text-ink-muted">{t('index.reviewedQuestions')}</dt>
                      <dd className="font-medium tabular-nums">{format.number(items)}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-muted">{t('index.topicsCovered')}</dt>
                      <dd className="font-medium tabular-nums">
                        {t('index.topicsValue', { covered: domainsCovered, total: domainsTotal })}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <ButtonLink href={`/exams/${hub.slug}`} size="sm">
                      {hub.slug === 'bocconi-online-test' ? t('index.bocconiButton') : t('index.examGuide')}
                    </ButtonLink>
                    {configs.map((config) => (
                      <ButtonLink
                        key={config.examKey}
                        href={`/practice/${config.examKey}`}
                        size="sm"
                        variant="secondary"
                      >
                        {configs.length > 1 ? t('index.practiseVariant', { name: config.shortName }) : t('index.practise')}
                      </ButtonLink>
                    ))}
                  </div>

                  {configs.some((c) => !c.capabilities.fullSimulation.available) ? (
                    <p className="mt-3 text-xs text-ink-subtle">{t('index.noSimulation')}</p>
                  ) : null}
                </Card>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="mb-12 max-w-2xl text-ink-muted">{t('index.guidesNote')}</p>

      <section id="formats" aria-labelledby="formats-heading" className="mb-12">
        <h2 id="formats-heading" className="font-heading text-2xl font-semibold">
          {t('index.formatsHeading')}
        </h2>
        <p className="mt-1 max-w-2xl text-ink-muted">{t('index.formatsLead')}</p>
        <FormatAvailabilityTable matrix={matrix} asOf={asOf} />
      </section>
    </Container>
  );
}
