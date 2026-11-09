import { CONTACT, SOCIAL_LINKS } from '@/lib/site';
import { LOCALES, LOCALE_INFO } from '@/i18n/locales';

/** Every language the site is offered in, as BCP 47 tags. */
const SITE_LANGUAGES = LOCALES.map((code) => LOCALE_INFO[code].htmlLang);

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

export function organizationSchema(siteUrl: string, name: string, description: string, alternateNames: readonly string[] = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name,
    ...(alternateNames.length > 0 ? { alternateName: [...alternateNames] } : {}),
    url: `${siteUrl}/`,
    // Raster and square, as Google asks of an organisation logo (at least 112 x 112).
    logo: `${siteUrl}/brand/uniexamer-symbol.png`,
    description,
    // An explicit, honest statement of independence.
    disambiguatingDescription:
      'An independent exam preparation resource, not affiliated with or endorsed by any test maker.',
    sameAs: SOCIAL_LINKS.map((link) => link.href),
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer support', email: CONTACT.support, availableLanguage: SITE_LANGUAGES },
      { '@type': 'ContactPoint', contactType: 'general enquiries', email: CONTACT.info },
    ],
  };
}

/**
 * On the home page, this is what Google reads for the site name shown in
 * results; `alternateName` is its fallback if it cannot use `name`.
 */
export function webSiteSchema(siteUrl: string, name: string, alternateNames: readonly string[] = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name,
    ...(alternateNames.length > 0 ? { alternateName: [...alternateNames] } : {}),
    url: `${siteUrl}/`,
    publisher: { '@id': `${siteUrl}#organization` },
    inLanguage: SITE_LANGUAGES,
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
  /** The page's language, as a BCP 47 tag. */
  inLanguage?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': options.url,
    url: options.url,
    name: options.name,
    description: options.description,
    inLanguage: options.inLanguage ?? 'en',
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
  /** The share image's path or URL (src/lib/site.ts shareImages). */
  image?: string;
  /** The article's language, as a BCP 47 tag; guides and exam details are English. */
  inLanguage?: string;
}) {
  const image = options.image ? (options.image.startsWith('/') ? `${options.siteUrl}${options.image}` : options.image) : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    url: options.url,
    ...(image ? { image: [image] } : {}),
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    inLanguage: options.inLanguage ?? 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': options.url },
    // The site's own team writes everything; no person is named because no record names one.
    author: { '@type': 'Organization', '@id': `${options.siteUrl}#organization`, name: options.authorName, url: `${options.siteUrl}/` },
    publisher: { '@id': `${options.siteUrl}#organization` },
    isPartOf: { '@id': `${options.siteUrl}#website` },
  };
}

/**
 * A free online course, as its course page shows it: what it teaches, who
 * provides it, that it costs nothing, and its lessons in order. The course
 * runs whenever the learner wants (no dates), online, and every lesson's
 * reading time is shown on the page, so the workload is their sum.
 */
export function courseSchema(options: {
  siteUrl: string;
  url: string;
  name: string;
  description: string;
  /** The exam the course prepares for, as its maker names it. */
  about: string;
  dateModified: string;
  /** Total reading and check time in minutes. */
  minutes: number;
  syllabus: Array<{ name: string; description: string }>;
  lessons: Array<{ name: string; url: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': options.url,
    name: options.name,
    description: options.description,
    url: options.url,
    inLanguage: 'en',
    dateModified: options.dateModified,
    about: { '@type': 'Thing', name: options.about },
    provider: { '@type': 'Organization', '@id': `${options.siteUrl}#organization`, name: 'UniExamer', sameAs: `${options.siteUrl}/` },
    publisher: { '@id': `${options.siteUrl}#organization` },
    isAccessibleForFree: true,
    offers: [{ '@type': 'Offer', category: 'Free', price: 0, priceCurrency: 'EUR' }],
    hasCourseInstance: [{ '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: `PT${options.minutes}M` }],
    syllabusSections: options.syllabus.map((section) => ({ '@type': 'Syllabus', name: section.name, description: section.description })),
    hasPart: options.lessons.map((lesson, index) => ({ '@type': 'LearningResource', position: index + 1, name: lesson.name, url: lesson.url })),
  };
}

/** One lesson of a course: a free learning resource that is part of it. */
export function lessonSchema(options: {
  siteUrl: string;
  url: string;
  name: string;
  description: string;
  courseUrl: string;
  courseName: string;
  /** The exam topic it teaches. */
  teaches: string[];
  minutes: number;
  datePublished: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': options.url,
    name: options.name,
    description: options.description,
    url: options.url,
    inLanguage: 'en',
    learningResourceType: 'Lesson',
    educationalUse: 'Self-study',
    teaches: options.teaches,
    timeRequired: `PT${options.minutes}M`,
    isAccessibleForFree: true,
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    isPartOf: { '@type': 'Course', '@id': options.courseUrl, name: options.courseName },
    author: { '@type': 'Organization', '@id': `${options.siteUrl}#organization`, name: 'UniExamer' },
    publisher: { '@id': `${options.siteUrl}#organization` },
  };
}
