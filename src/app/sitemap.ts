import type { MetadataRoute } from 'next';
import { EXAM_HUBS, getConfigsForHub } from '@/lib/exams/registry';
import { BOCCONI_FACTS_CHECKED_ON } from '@/lib/exams/bocconi-facts';
import { BOCCONI_HUB_SLUG } from '@/lib/exams/bocconi-landing';
import { absoluteUrl, indexingEnabled } from '@/lib/site';
import { listGuides } from '@/lib/content/guides';
import { PAGE_DATES } from '@/lib/content/page-dates';

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

  const hubs = EXAM_HUBS.map((hub) => {
    // The date the exam facts were last verified: a real date, never "now".
    const verified = latest(getConfigsForHub(hub.slug).map((config) => config.verifiedOn));
    const hubDate = hub.slug === BOCCONI_HUB_SLUG ? latest([BOCCONI_FACTS_CHECKED_ON, verified]) : verified;
    return { hub, verified, hubDate };
  });
  const guides = listGuides();

  // A listing page changes when what it lists changes.
  const examsDate = latest(hubs.map((h) => h.hubDate));
  const guidesDate = latest(guides.map((g) => g.updatedOn));
  const homeDate = latest([PAGE_DATES.home.updated, examsDate, guidesDate]);

  const entries: MetadataRoute.Sitemap = [
    page('/', homeDate, 'weekly', 1),
    page('/exams', examsDate, 'weekly', 0.9),
    page('/guides', guidesDate, 'weekly', 0.7),
    page('/premium', PAGE_DATES.premium.updated, 'monthly', 0.6),
    page('/about/editorial-standards', PAGE_DATES.editorialStandards.updated, 'monthly', 0.5),
    page('/about/how-scoring-works', PAGE_DATES.howScoringWorks.updated, 'monthly', 0.5),
    page('/about/privacy', PAGE_DATES.privacy.updated, 'yearly', 0.3),
    page('/about/terms', PAGE_DATES.terms.updated, 'yearly', 0.3),
  ];

  for (const { hub, verified, hubDate } of hubs) {
    entries.push(page(`/exams/${hub.slug}`, hubDate, 'monthly', 0.9), page(`/exams/${hub.slug}/format`, verified, 'monthly', 0.8));
  }

  for (const guide of guides) {
    entries.push(page(`/guides/${guide.slug}`, guide.updatedOn, 'monthly', 0.7));
  }

  return entries;
}

type Entry = MetadataRoute.Sitemap[number];

function page(path: string, date: string | undefined, changeFrequency: Entry['changeFrequency'], priority: number): Entry {
  return {
    url: absoluteUrl(path),
    ...(date ? { lastModified: new Date(`${date}T00:00:00Z`) } : {}),
    changeFrequency,
    priority,
  };
}

/** The latest of some YYYY-MM-DD dates, or undefined when there are none. */
function latest(dates: Array<string | undefined>): string | undefined {
  return dates.filter((d): d is string => Boolean(d)).sort().at(-1);
}
