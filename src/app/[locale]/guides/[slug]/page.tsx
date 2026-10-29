import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { getGuide, listGuides } from '@/lib/content/guides';
import { getHub } from '@/lib/exams/registry';
import { SITE, shareImages, siteUrl } from '@/lib/site';
import { pageAlternates } from '@/i18n/alternates';
import { Markdown } from '@/components/content';
import { SampleQuestions } from '@/components/guides/sample-questions';
import { GuideClickBeacon, ViewBeacon } from '@/components/exams/view-beacon';
import { freeTestPath } from '@/lib/billing/config';
import { Breadcrumbs, ButtonLink, Callout, Card, Container, PageHeader } from '@/components/ui';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { localizePath, type Locale } from '@/i18n/locales';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return listGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) {
    const t = await getTranslations({ locale, namespace: 'guides.article' });
    return { title: t('fallbackTitle') };
  }
  const alternates = (await pageAlternates(params, `/guides/${guide.slug}`));
  return {
    title: guide.metaTitle ?? guide.title,
    description: guide.description,
    alternates,
    openGraph: {
      type: 'article',
      url: alternates.canonical,
      title: `${guide.metaTitle ?? guide.title} | ${SITE.shortName}`,
      description: guide.description,
      publishedTime: guide.publishedOn,
      modifiedTime: guide.updatedOn,
      images: shareImages(`guide-${guide.slug}`, guide.title),
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const guide = getGuide(slug);
  if (!guide) notFound();

  const t = await getTranslations('guides');
  const format = await getFormatter();
  const formatDate = (value: string) =>
    format.dateTime(new Date(`${value}T00:00:00Z`), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });

  const hub = getHub(guide.hubSlug);
  const articleUrl = (await pageAlternates(params, `/guides/${guide.slug}`)).canonical;
  const trail = [
    { href: '/', label: t('breadcrumbs.home') },
    { href: '/guides', label: t('breadcrumbs.guides') },
    { label: guide.title },
  ];
  const ldTrail = trail.map((crumb) => (crumb.href ? { ...crumb, href: localizePath(crumb.href, locale as Locale) } : crumb));

  return (
    <Container size="narrow">
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), ldTrail),
          articleSchema({
            siteUrl: siteUrl(),
            url: articleUrl,
            headline: guide.title,
            description: guide.description,
            datePublished: guide.publishedOn,
            dateModified: guide.updatedOn,
            publisherName: SITE.publisher,
            authorName: SITE.publisher,
            image: `/og/guide-${guide.slug}.png`,
          }),
        ]}
      />
      <Breadcrumbs trail={trail} />
      {/* Guides are served as static files, so the page reports its own view and its clicks into practice. */}
      <ViewBeacon subject={guide.slug} kind="guide" />
      <GuideClickBeacon subject={guide.slug}>

        {/*
          A guide is read at length, so its answer and body are set in the
          design system's reading serif (§6), like passages and questions. In
          the interface font, every paragraph above the fold reflowed when the
          font arrived: 0.04 on desktop in every lab load, and up to 0.13 in the
          worst case (docs/REDESIGN.md §18.1). The title and labels keep the
          interface face.
        */}
        <article lang="en">
          <header className="mb-8">
            <PageHeader eyebrow={hub?.name ?? t('general')} title={guide.title} />

            {/*
              The direct answer, before the body: what a reader needs in one
              paragraph, and the passage most likely to be quoted if this page is
              cited elsewhere.
            */}
            <Callout title={t('article.inShort')} className="-mt-2" textClassName="font-serif">
              {guide.answer}
            </Callout>

            <p className="mt-4 text-sm text-ink-subtle">
              {t.rich('article.published', {
                publisher: SITE.publisher,
                date: formatDate(guide.publishedOn),
                time: (chunks) => <time dateTime={guide.publishedOn}>{chunks}</time>,
              })}
              {guide.updatedOn !== guide.publishedOn ? (
                <>
                  {' · '}
                  {t.rich('article.updated', {
                    date: formatDate(guide.updatedOn),
                    time: (chunks) => <time dateTime={guide.updatedOn}>{chunks}</time>,
                  })}
                </>
              ) : null}
              {` · ${t('readingTime', { minutes: guide.readingMinutes })}`}
            </p>
          </header>

          <Markdown source={guide.bodyMd} className="prose-academic font-serif" />
        {guide.samples ? <SampleQuestions set={guide.samples} /> : null}

          <section aria-labelledby="sources-heading" className="mt-10">
            <h2 id="sources-heading" className="font-heading text-xl font-semibold">
              {t('article.sources')}
            </h2>
            <ol className="mt-3 space-y-2 text-sm">
              {guide.sources.map((source, index) => (
                <li key={source.url}>
                  <span className="text-ink-subtle">[{index + 1}]</span>{' '}
                  <a href={source.url} rel="noopener noreferrer" target="_blank">
                    {source.label}
                    <span className="sr-only"> {t('article.opensInNewTab')}</span>
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" className="ms-1 inline-block align-baseline">
                      <path d="M5 2H2.5v7.5H10V7M7 2h3v3M10 2 5.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>{' '}
                  <span className="text-ink-muted">— {source.publisher}</span>
                </li>
              ))}
            </ol>
          </section>
        </article>

        {hub ? (
          <Card className="mt-10">
            <h2 className="font-heading text-lg font-semibold">{t('article.practiseTitle')}</h2>
            <p className="mt-1 text-sm text-ink-muted">{t('article.practiseBody')}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {hub.slug === 'bocconi-online-test' ? (
                <ButtonLink href={freeTestPath(guide.examKeys[0])}>{t('article.tryFreeBocconi')}</ButtonLink>
              ) : (
                <ButtonLink href={`/practice/${guide.examKeys[0]}`}>{t('article.startPractising')}</ButtonLink>
              )}
              <ButtonLink href={`/exams/${hub.slug}`} variant="secondary">
                {hub.slug === 'bocconi-online-test'
                  ? t('article.bocconiPreparation')
                  : t('article.hubGuide', { exam: hub.name })}
              </ButtonLink>
            </div>
          </Card>
        ) : null}

        <div className="mt-8">
          <ButtonLink href="/guides" variant="secondary" size="sm">
            {t('article.allGuides')}
          </ButtonLink>
        </div>
      </GuideClickBeacon>
    </Container>
  );
}
