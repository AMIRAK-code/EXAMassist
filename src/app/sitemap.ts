import type { MetadataRoute } from 'next';
import { EXAM_HUBS } from '@/lib/exams/registry';
import { absoluteUrl, indexingEnabled } from '@/lib/site';
import { listGuides } from '@/lib/content/guides';

/**
 * XML sitemap.
 *
 * Contains only pages that are genuinely public, indexable and useful. A
 * sitemap does not cause indexing, and listing private or thin pages here
 * would be both useless and misleading.
 *
 * lastModified uses the real verification or publication date of the content.
 * Inventing a fresh date to look current is exactly the freshness abuse we
 * refuse to do.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingEnabled()) return [];

  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/exams'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/guides'), changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/about/editorial-standards'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/about/how-scoring-works'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/about/privacy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/about/terms'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  for (const hub of EXAM_HUBS) {
    entries.push(
      { url: absoluteUrl(`/exams/${hub.slug}`), changeFrequency: 'monthly', priority: 0.9 },
      { url: absoluteUrl(`/exams/${hub.slug}/format`), changeFrequency: 'monthly', priority: 0.8 },
    );
  }

  for (const guide of listGuides()) {
    entries.push({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: new Date(guide.updatedOn),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
