import Link from 'next/link';
import type { Metadata } from 'next';
import { listGuides } from '@/lib/content/guides';
import { getHub } from '@/lib/exams/registry';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';

const TITLE = 'Guides and worked explanations';
const DESCRIPTION =
  'Plain explanations of how these admission exams actually work: scoring rules, format changes and strategy, each one sourced to the test maker.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/guides') },
  openGraph: {
    url: absoluteUrl('/guides'),
    title: `${TITLE} | ${SITE.shortName}`,
    description: DESCRIPTION,
  },
};

export default function GuidesPage() {
  const guides = listGuides();
  const trail = [{ href: '/', label: 'Home' }, { label: 'Guides' }];

  return (
    <Container>
      <JsonLd data={breadcrumbSchema(siteUrl(), trail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader title={TITLE} lead={DESCRIPTION} />

      <ul className="space-y-4">
        {guides.map((guide) => {
          const hub = getHub(guide.hubSlug);
          return (
            <Card as="li" key={guide.slug}>
              <p className="text-xs uppercase tracking-wide text-ink-subtle">
                {hub?.name ?? 'General'} · {guide.readingMinutes} min read
              </p>
              <h2 className="mt-1 font-heading text-xl font-semibold">
                <Link href={`/guides/${guide.slug}`} className="no-underline hover:underline">
                  {guide.title}
                </Link>
              </h2>
              <p className="mt-2 text-ink-muted">{guide.answer}</p>
              <p className="mt-3 text-xs text-ink-subtle">
                Updated{' '}
                <time dateTime={guide.updatedOn}>
                  {new Date(guide.updatedOn).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </p>
            </Card>
          );
        })}
      </ul>
    </Container>
  );
}
