import { SITE } from '@/lib/site';

/**
 * About as many characters of a result's title as Google shows before cutting
 * it off (it measures in pixels, roughly 600 on desktop). On 12 November 2026,
 * 276 of the 341 indexable pages had longer titles, almost all of them lessons
 * ("<lesson> | <course title> | UniExamer", 90 characters at the median).
 */
export const TITLE_BUDGET = 60;

const SEPARATOR = ' | ';

/** What the layout's title template (`%s | UniExamer`, src/app/[locale]/layout.tsx) adds. */
const BRAND_SUFFIX = `${SEPARATOR}${SITE.shortName}`;

export type PageTitle = string | { absolute: string };

/**
 * A page's <title> for Next metadata, kept within TITLE_BUDGET as far as the
 * page's own name allows. `name` always comes first and whole, even when it
 * is longer than the budget. Then each `context` part, most useful first
 * (for a lesson, its course: "TOLC-I course"), is added while the title still
 * fits, and last the site's name, which the layout's template adds. When the
 * site's name would not fit, the title is returned as `absolute`, so the
 * template leaves it out: Google shows the site's name above every result
 * anyway (WebSite structured data), and the page's own words are what a
 * searcher reads.
 */
export function pageTitle(name: string, ...context: string[]): PageTitle {
  let title = name;
  for (const part of context) {
    const longer = `${title}${SEPARATOR}${part}`;
    if (longer.length > TITLE_BUDGET) break;
    title = longer;
  }
  return `${title}${BRAND_SUFFIX}`.length <= TITLE_BUDGET ? title : { absolute: title };
}

/** The text a browser and a search engine see for a pageTitle, the template applied. */
export function renderedTitle(title: PageTitle): string {
  return typeof title === 'string' ? `${title}${BRAND_SUFFIX}` : title.absolute;
}
