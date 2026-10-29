import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { CONTENT_LANG, pageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { EXAM_HUBS, getConfigsForHub, getHub } from '@/lib/exams/registry';
import { describePolicy } from '@/lib/assessment/navigation';
import { shareImages, SITE, siteUrl } from '@/lib/site';
import { guidesForHub } from '@/lib/content/guides';
import { Callout, Alert, Breadcrumbs, ButtonLink, Card, Container } from '@/components/ui';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { OfficialNote } from '@/components/exams/official-note';

type Props = { params: Promise<{ locale: string; hub: string }> };

const DATE = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' } as const;
/** A config date in the reader's language; a value that is not a date (an unverified marker) shows as written. */
const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}/.test(value);

export function generateStaticParams() {
  return EXAM_HUBS.map((hub) => ({ hub: hub.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, hub: slug } = await params;
  const t = await getTranslations({ locale, namespace: 'exams.format' });
  const hub = getHub(slug);
  if (!hub) return { title: t('fallbackTitle') };

  const format = await getFormatter({ locale });
  const configs = getConfigsForHub(slug);
  const verifiedOn = configs[0]?.verifiedOn;
  const title = t('metaTitle', { name: hub.name });
  const description = t('metaDescription', {
    name: hub.name,
    publisher: hub.publisher,
    date: verifiedOn && isIsoDate(verifiedOn) ? format.dateTime(new Date(verifiedOn), DATE) : t('lastCheck'),
  });
  const alternates = (await pageAlternates(params, `/exams/${hub.slug}/format`));

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: 'article',
      url: alternates.canonical,
      title: `${title} | ${SITE.shortName}`,
      description,
      // The exam's own image: the format guide is about the same exam.
      images: shareImages(`exam-${hub.slug}`, title),
    },
  };
}

export default async function FormatGuidePage({ params }: Props) {
  const { locale, hub: slug } = await params;
  setRequestLocale(locale as Locale);
  const hub = getHub(slug);
  if (!hub) notFound();

  const t = await getTranslations('exams');
  const format = await getFormatter();
  const formatDate = (iso: string) => (isIsoDate(iso) ? format.dateTime(new Date(iso), DATE) : iso);

  const configs = getConfigsForHub(slug);
  const guides = guidesForHub(slug);
  const trail = [
    { href: '/', label: t('breadcrumb.home') },
    { href: '/exams', label: t('breadcrumb.exams') },
    { href: `/exams/${hub.slug}`, label: hub.name },
    { label: t('breadcrumb.format') },
  ];
  const verifiedOn = configs[0]?.verifiedOn ?? '';

  return (
    <Container size="narrow">
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), trail),
          articleSchema({
            siteUrl: siteUrl(),
            url: (await pageAlternates(params, `/exams/${hub.slug}/format`)).canonical,
            headline: t('format.metaTitle', { name: hub.name }),
            description: hub.tagline,
            datePublished: verifiedOn,
            dateModified: verifiedOn,
            publisherName: SITE.publisher,
            authorName: SITE.publisher,
          }),
        ]}
      />
      <Breadcrumbs trail={trail} />

      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
        {t('format.heading', { name: hub.name })}
      </h1>

      {/*
        The opening is kept to lines that cannot jump when the web font
        arrives. It is the date alone: "from <publisher>'s published pages"
        still took a second line on some phones (docs/REDESIGN.md §18), and
        the provenance note sits with the sources it describes. The version
        and cycle details follow each summary (§14).
      */}
      <p className="mt-2 text-sm text-ink-subtle">
        {t.rich('format.verified', {
          date: verifiedOn ? formatDate(verifiedOn) : '—',
          time: (chunks) => <time dateTime={verifiedOn}>{chunks}</time>,
        })}
      </p>
      <OfficialNote className="mt-1 text-sm text-ink-subtle" />

      {/* At the smaller size a line gained on a font swap moves the page less (§18). */}
      <Callout title={t('format.inShort')} className="mt-6" textClassName="text-sm">
        <span lang={CONTENT_LANG}>{hub.tagline}</span>
      </Callout>

      {configs.map((config) => (
        <section key={config.examKey} className="mt-10" aria-labelledby={`fmt-${config.examKey}`}>
          <h2 id={`fmt-${config.examKey}`} className="font-heading text-2xl font-semibold">
            {config.name}
          </h2>
          {/*
            Editorial prose, set in the reading serif as the guides are: it needs
            no download, so it cannot gain a line when the interface font
            arrives and push the tables below it (0.016 at 768 px, §18).
          */}
          <p lang={CONTENT_LANG} className="mt-3 font-serif text-ink">{config.summary}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="font-medium text-ink-muted">{t('format.versionDescribed')}</dt>
              <dd lang={CONTENT_LANG} className="text-ink-subtle">{config.versionLabel}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-muted">{t('format.admissionsCycle')}</dt>
              <dd lang={CONTENT_LANG} className="text-ink-subtle">{config.admissionsCycle}</dd>
            </div>
          </dl>

          {/* Structure */}
          <h3 className="mt-8 font-heading text-xl font-semibold">{t('format.sectionsHeading')}</h3>
          {/* Focusable, so the table can be scrolled sideways from the keyboard on a narrow screen. */}
          <div
            role="region"
            aria-label={t('format.sectionsRegion', { name: config.name })}
            tabIndex={0}
            className="mt-3 relative overflow-x-auto rounded-card border border-line bg-surface"
          >
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">{t('format.sectionsCaption', { name: config.name })}</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-4 py-3 text-left font-semibold">{t('table.section')}</th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold">{t('table.questions')}</th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold">{t('table.time')}</th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold">{t('table.calculator')}</th>
                </tr>
              </thead>
              <tbody>
                {config.sections.map((section) => (
                  <tr key={section.key} className="border-b border-line last:border-0 align-top">
                    <th lang={CONTENT_LANG} scope="row" className="px-4 py-3 text-left font-normal">{section.name}</th>
                    <td className="px-4 py-3">{section.officialQuestionCount ?? t('table.notPublished')}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {section.officialTimeMinutes === null
                        ? t('table.notPublished')
                        : t('table.minutes', { value: section.officialTimeMinutes })}
                    </td>
                    <td className="px-4 py-3">
                      {t(`format.calculator.${section.calculator}`)}
                      {section.calculatorNote ? (
                        <span lang={CONTENT_LANG} className="block text-xs text-ink-muted">{section.calculatorNote}</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Navigation */}
          <h3 className="mt-8 font-heading text-xl font-semibold">{t('format.navigationHeading')}</h3>
          {config.sections[0].navigation.source === 'unverified' ? (
            <Alert tone="caution" title={t('format.unverifiedNavigationTitle')} className="mt-3">
              {t('format.unverifiedNavigationBody', { publisher: config.publisher })}
            </Alert>
          ) : (
            <p className="mt-2 text-ink-muted">{t('format.navigationLead')}</p>
          )}
          <ul className="mt-3 list-disc space-y-1.5 ps-5">
            {describePolicy(config.sections[0].navigation).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          {/* Scoring */}
          <h3 className="mt-8 font-heading text-xl font-semibold">{t('format.scoringHeading')}</h3>
          <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[12rem_1fr]">
            <dt className="text-sm font-medium text-ink-muted">{t('format.correct')}</dt>
            <dd className="text-sm">{t('format.points', { points: config.scoring.pointsCorrect })}</dd>
            <dt className="text-sm font-medium text-ink-muted">{t('format.wrong')}</dt>
            <dd className="text-sm">
              {config.scoring.pointsIncorrect === 0
                ? t('format.noPenalty')
                : t('format.penalty', { points: config.scoring.pointsIncorrect })}
            </dd>
            <dt className="text-sm font-medium text-ink-muted">{t('format.blank')}</dt>
            <dd className="text-sm">{t('format.points', { points: config.scoring.pointsOmitted })}</dd>
            {config.scoring.officialScale ? (
              <>
                <dt className="text-sm font-medium text-ink-muted">{t('format.reportedScale')}</dt>
                <dd className="text-sm">
                  {t('format.scale', {
                    label: config.scoring.officialScale.label,
                    min: config.scoring.officialScale.min,
                    max: config.scoring.officialScale.max,
                  })}
                  {config.scoring.officialScale.note ? (
                    <span className="block text-ink-muted">{config.scoring.officialScale.note}</span>
                  ) : null}
                </dd>
              </>
            ) : null}
          </dl>

          {config.scoring.notes.length > 0 ? (
            <ul lang={CONTENT_LANG} className="mt-4 list-disc space-y-1.5 ps-5 text-sm text-ink-muted">
              {config.scoring.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}

          <Alert tone="info" title={t('format.scaledScoreTitle')} className="mt-5">
            <span lang={CONTENT_LANG}>
              {config.scoring.scaledEstimate.enabled
                ? config.scoring.scaledEstimate.method
                : config.scoring.scaledEstimate.reason}
            </span>
          </Alert>

          {/* Taxonomy */}
          <h3 className="mt-8 font-heading text-xl font-semibold">{t('format.testedHeading')}</h3>
          <p className="mt-2 text-ink-muted">{t('format.testedLead', { publisher: config.publisher })}</p>
          <ul lang={CONTENT_LANG} className="mt-3 space-y-3">
            {config.domains.map((domain) => (
              <li key={domain.slug}>
                <h4 className="font-medium">
                  {domain.name}
                  {domain.officialShare ? (
                    <span className="ms-2 text-sm font-normal text-ink-muted">
                      {domain.officialShare}
                    </span>
                  ) : null}
                </h4>
                {domain.description ? (
                  <p className="text-sm text-ink-muted">{domain.description}</p>
                ) : null}
                <p className="mt-1 text-sm text-ink-muted">
                  {domain.skills.map((skill) => skill.name).join(' · ')}
                </p>
              </li>
            ))}
          </ul>

          {/* Unverified */}
          {config.unverified.length > 0 ? (
            <>
              <h3 className="mt-8 font-heading text-xl font-semibold">
                {t('format.unpublishedHeading', { publisher: config.publisher })}
              </h3>
              <p className="mt-2 text-ink-muted">{t('format.unpublishedLead')}</p>
              <ul lang={CONTENT_LANG} className="mt-3 list-disc space-y-1.5 ps-5 text-sm text-ink-muted">
                {config.unverified.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </>
          ) : null}

          {/* Sources */}
          <h3 className="mt-8 font-heading text-xl font-semibold">{t('format.sourcesHeading')}</h3>
          <p className="mt-2 text-sm text-ink-muted">
            {t('format.sourcesLead', { compiler: SITE.publisher, publisher: hub.publisher })}
          </p>
          <ol className="mt-3 space-y-2 text-sm">
            {config.sources.map((source, index) => (
              <li key={`${source.url}-${index}`}>
                <span className="text-ink-subtle">[{index + 1}]</span>{' '}
                <a href={source.url} rel="noopener noreferrer" target="_blank">
                  {source.label}
                </a>{' '}
                <span className="text-ink-muted">
                  {t('format.sourceChecked', { publisher: source.publisher, date: formatDate(source.verifiedOn) })}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))}

      {guides.length > 0 ? (
        <Card className="mt-10">
          <h2 className="font-heading text-lg font-semibold">{t('format.relatedGuides')}</h2>
          <ul className="mt-3 space-y-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={`/practice/${configs[0].examKey}`}>{t('format.startPractising')}</ButtonLink>
        <ButtonLink href={`/exams/${hub.slug}`} variant="secondary">
          {t('format.backTo', { name: hub.name })}
        </ButtonLink>
      </div>
    </Container>
  );
}
