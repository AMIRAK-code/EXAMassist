/**
 * When each fixed public page was published and last changed in substance.
 *
 * The pages show these dates and put them in their metadata, and the sitemap
 * sends them to search engines as lastModified, so both read them from here.
 * Change `updated` only when the content changes, never to look fresh.
 */

export interface PageDates {
  published?: string;
  updated: string;
}

export const PAGE_DATES = {
  /** The homepage's own copy; the sitemap also counts the exams and guides it lists. */
  home: { updated: '2026-10-07' },
  editorialStandards: { published: '2026-09-22', updated: '2026-09-24' },
  howScoringWorks: { published: '2026-09-22', updated: '2026-09-24' },
  privacy: { published: '2026-09-22', updated: '2026-10-27' },
  /** The terms show this as "last reviewed". */
  terms: { updated: '2026-10-29' },
  /** Why support is answered by people, and how to reach them. */
  support: { published: '2026-10-28', updated: '2026-10-28' },
  /**
   * Plans and prices: Premium from 2026-10-05, All access and Single exam on /pricing from 2026-10-27,
   * Single Exam Pass, Plus and Premium (coming soon) from 2026-10-29.
   */
  pricing: { published: '2026-10-05', updated: '2026-10-29' },
} as const satisfies Record<string, PageDates>;

/** "22 September 2026", the same in every time zone. */
export function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
