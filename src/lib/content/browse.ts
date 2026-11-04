import { listHubs } from '@/lib/exams/registry';
import { listGuides } from './guides';

/**
 * The site's "browse everything" panel, as data: every exam hub with its
 * pages and practice, then every guide. Built from the registry and the
 * guides list, so a new hub or guide appears without touching the panel.
 * The same for every visitor, so it is fit for the static snapshots
 * (src/lib/seo/static-pages.ts); only the "current page" mark is decided in
 * the browser.
 */

export type BrowseLinkKind = 'overview' | 'format' | 'practice';

export interface BrowseLink {
  kind: BrowseLinkKind;
  href: string;
  /** For practice in a hub with two tests: which one ("Standard", "Law"). */
  variant: string | null;
}

export interface BrowseHub {
  slug: string;
  name: string;
  /** The tests the hub serves, to find the hub of a practice page. */
  configKeys: string[];
  links: BrowseLink[];
}

export interface BrowseGuide {
  slug: string;
  title: string;
  href: string;
  /** The hub the guide belongs to, shown as its context. */
  hubLabel: string | null;
}

export interface BrowseTree {
  hubs: BrowseHub[];
  guides: BrowseGuide[];
}

export function browseTree(): BrowseTree {
  const hubs = listHubs().map((hub) => ({
    slug: hub.slug,
    name: hub.shortName,
    configKeys: [...hub.configKeys],
    links: [
      { kind: 'overview' as const, href: `/exams/${hub.slug}`, variant: null },
      { kind: 'format' as const, href: `/exams/${hub.slug}/format`, variant: null },
      ...hub.configKeys.map((configKey) => ({
        kind: 'practice' as const,
        href: `/practice/${configKey}`,
        variant: hub.configKeys.length > 1 ? (hub.variantLabels?.[configKey] ?? null) : null,
      })),
    ],
  }));
  const guides = listGuides().map((guide) => ({
    slug: guide.slug,
    title: guide.title,
    href: `/guides/${guide.slug}`,
    hubLabel: listHubs().find((hub) => hub.slug === guide.hubSlug)?.label ?? null,
  }));
  return { hubs, guides };
}
