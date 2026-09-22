import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getGuide, listGuides } from '@/lib/content/guides';
import { getHub } from '@/lib/exams/registry';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { Markdown } from '@/components/content';
import { Breadcrumbs, ButtonLink, Card, Container } from '@/components/ui';
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

      <article>
        <header className="mb-8">
          <p className="text-sm uppercase tracking-wide text-ink-subtle">{hub?.name ?? 'General'}</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">{guide.title}</h1>

          {/*
            The direct answer, before the body: what a reader needs in one
            paragraph, and the passage most likely to be quoted if this page is
            cited elsewhere.
          */}
          <div className="mt-6 rounded-card border-s-4 border-accent bg-accent-soft p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-strong">
              In short
            </h2>
            <p className="mt-2 text-ink">{guide.answer}</p>
          </div>

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

        <Markdown source={guide.bodyMd} className="prose-academic" />

        <section aria-labelledby="sources-heading" className="mt-10">
          <h2 id="sources-heading" className="font-serif text-xl font-semibold">
            Sources
          </h2>
          <ol className="mt-3 space-y-2 text-sm">
            {guide.sources.map((source, index) => (
              <li key={source.url}>
                <span className="text-ink-subtle">[{index + 1}]</span>{' '}
                <a href={source.url} rel="noopener noreferrer" target="_blank">
                  {source.label}
                </a>{' '}
                <span className="text-ink-muted">— {source.publisher}</span>
              </li>
            ))}
          </ol>
        </section>
      </article>

      {hub ? (
        <Card className="mt-10">
          <h2 className="font-serif text-lg font-semibold">Practise this exam</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Original questions with worked explanations, free and without an account.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href={`/practice/${guide.examKeys[0]}`}>Start practising</ButtonLink>
            <ButtonLink href={`/exams/${hub.slug}`} variant="secondary">
              {hub.name} guide
            </ButtonLink>
          </div>
        </Card>
      ) : null}

      <p className="mt-8 text-sm">
        <Link href="/guides">← All guides</Link>
      </p>
    </Container>
  );
}
