import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getGuide, listGuides } from '@/lib/content/guides';
import { getHub } from '@/lib/exams/registry';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { Markdown } from '@/components/content';
import { freeTestPath } from '@/lib/billing/config';
import { Breadcrumbs, ButtonLink, Callout, Card, Container, PageHeader } from '@/components/ui';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';

export function generateStaticParams() {
  return listGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: 'Guide' };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: absoluteUrl(`/guides/${guide.slug}`) },
    openGraph: {
      type: 'article',
      url: absoluteUrl(`/guides/${guide.slug}`),
      title: `${guide.title} | ${SITE.shortName}`,
      description: guide.description,
      publishedTime: guide.publishedOn,
      modifiedTime: guide.updatedOn,
    },
  };
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const hub = getHub(guide.hubSlug);
  const trail = [
    { href: '/', label: 'Home' },
    { href: '/guides', label: 'Guides' },
    { label: guide.title },
  ];

  return (
    <Container size="narrow">
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), trail),
          articleSchema({
            siteUrl: siteUrl(),
            url: absoluteUrl(`/guides/${guide.slug}`),
            headline: guide.title,
            description: guide.description,
            datePublished: guide.publishedOn,
            dateModified: guide.updatedOn,
            publisherName: SITE.publisher,
            authorName: SITE.publisher,
          }),
        ]}
      />
      <Breadcrumbs trail={trail} />

      {/*
        A guide is read at length, so its answer and body are set in the
        design system's reading serif (§6), like passages and questions. In
        the interface font, every paragraph above the fold reflowed when the
        font arrived: 0.04 on desktop in every lab load, and up to 0.13 in the
        worst case (docs/REDESIGN.md §18.1). The title and labels keep the
        interface face.
      */}
      <article>
        <header className="mb-8">
          <PageHeader eyebrow={hub?.name ?? 'General'} title={guide.title} />

          {/*
            The direct answer, before the body: what a reader needs in one
            paragraph, and the passage most likely to be quoted if this page is
            cited elsewhere.
          */}
          <Callout title="In short" className="-mt-2" textClassName="font-serif">
            {guide.answer}
          </Callout>

          <p className="mt-4 text-sm text-ink-subtle">
            By {SITE.publisher} · Published{' '}
            <time dateTime={guide.publishedOn}>{formatDate(guide.publishedOn)}</time>
            {guide.updatedOn !== guide.publishedOn ? (
              <>
                {' · Updated '}
                <time dateTime={guide.updatedOn}>{formatDate(guide.updatedOn)}</time>
              </>
            ) : null}
            {` · ${guide.readingMinutes} min read`}
          </p>
        </header>

        <Markdown source={guide.bodyMd} className="prose-academic font-serif" />

        <section aria-labelledby="sources-heading" className="mt-10">
          <h2 id="sources-heading" className="font-heading text-xl font-semibold">
            Sources
          </h2>
          <ol className="mt-3 space-y-2 text-sm">
            {guide.sources.map((source, index) => (
              <li key={source.url}>
                <span className="text-ink-subtle">[{index + 1}]</span>{' '}
                <a href={source.url} rel="noopener noreferrer" target="_blank">
                  {source.label}
                  <span className="sr-only"> (opens in a new tab)</span>
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
          <h2 className="font-heading text-lg font-semibold">Practise this exam</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Original questions with worked explanations. A free account gets one free test.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {hub.slug === 'bocconi-online-test' ? (
              <ButtonLink href={freeTestPath(guide.examKeys[0])}>Try a free Bocconi test</ButtonLink>
            ) : (
              <ButtonLink href={`/practice/${guide.examKeys[0]}`}>Start practising</ButtonLink>
            )}
            <ButtonLink href={`/exams/${hub.slug}`} variant="secondary">
              {hub.slug === 'bocconi-online-test' ? 'Bocconi test preparation' : `${hub.name} guide`}
            </ButtonLink>
          </div>
        </Card>
      ) : null}

      <div className="mt-8">
        <ButtonLink href="/guides" variant="secondary" size="sm">
          All guides
        </ButtonLink>
      </div>
    </Container>
  );
}
