import type { MetadataRoute } from 'next';
import { EXAM_HUBS, getConfigsForHub } from '@/lib/exams/registry';
import { BOCCONI_FACTS_CHECKED_ON } from '@/lib/exams/bocconi-facts';
import { BOCCONI_HUB_SLUG } from '@/lib/exams/bocconi-landing';
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
/*
 * Rendered per request, never prerendered: whether this deployment may be
 * indexed is a runtime setting (SEARCH_INDEXING_ENABLED, a Worker var), and a
 * file baked at build time would keep whatever the build machine had.
 */
export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingEnabled()) return [];

  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/exams'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/guides'), changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/premium'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/about/editorial-standards'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/about/how-scoring-works'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/about/privacy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/about/terms'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  for (const hub of EXAM_HUBS) {
    // The date the exam facts were last verified: a real date, never "now".
    const verified = getConfigsForHub(hub.slug)
      .map((config) => config.verifiedOn)
      .sort()
      .at(-1);
    const hubDate = hub.slug === BOCCONI_HUB_SLUG ? BOCCONI_FACTS_CHECKED_ON : verified;
    entries.push(
      {
        url: absoluteUrl(`/exams/${hub.slug}`),
        ...(hubDate ? { lastModified: new Date(hubDate) } : {}),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: absoluteUrl(`/exams/${hub.slug}/format`),
        ...(verified ? { lastModified: new Date(verified) } : {}),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
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
