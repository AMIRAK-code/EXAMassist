/**
 * Structured data.
 *
 * Only types that match content actually visible on the page are emitted.
 * Structured data that describes something a visitor cannot see is a
 * misrepresentation, and search providers treat it as one.
 *
 * Note on what we deliberately do NOT emit: FAQPage (its rich result was
 * withdrawn), and practice-problem markup (deprecated). See
 * docs/research/seo-and-crawler-policy.md.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own data, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function organizationSchema(siteUrl: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name,
    url: siteUrl,
    logo: `${siteUrl}/brand/examer-symbol.svg`,
    description,
    // An explicit, honest statement of independence.
    disambiguatingDescription:
      'An independent exam preparation resource, not affiliated with or endorsed by any test maker.',
  };
}

export function webSiteSchema(siteUrl: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name,
    url: siteUrl,
    publisher: { '@id': `${siteUrl}#organization` },
    inLanguage: 'en',
  };
}

/**
 * A plain WebPage description for a page that is neither an article nor a
 * product listing. It earns no rich result; it states what the page is about
 * and who publishes it, matching what the page says in its own text.
 */
export function webPageSchema(options: {
  siteUrl: string;
  url: string;
  name: string;
  description: string;
  dateModified: string;
  about: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': options.url,
    url: options.url,
    name: options.name,
    description: options.description,
    inLanguage: 'en',
    dateModified: options.dateModified,
    about: { '@type': 'Thing', name: options.about },
    isPartOf: { '@id': `${options.siteUrl}#website` },
    publisher: { '@id': `${options.siteUrl}#organization` },
  };
}

export function breadcrumbSchema(siteUrl: string, trail: Array<{ href?: string; label: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${siteUrl}${crumb.href}` } : {}),
    })),
  };
}

/**
 * Article metadata for an editorial guide. Dates must be real: a fabricated
 * "updated" date is exactly the freshness signal abuse we refuse to do.
 */
export function articleSchema(options: {
  siteUrl: string;
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  publisherName: string;
  authorName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': options.url },
    author: { '@type': 'Organization', name: options.authorName },
    publisher: { '@id': `${options.siteUrl}#organization` },
  };
}
