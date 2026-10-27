import { siteUrl } from '@/lib/site';
import { DEFAULT_LOCALE, LOCALES, LOCALE_INFO, isLocale, localizePath, type Locale } from './locales';

/**
 * Canonical URL and hreflang alternates for one page, for Next's metadata
 * `alternates`. `path` is the page's English path ("/exams/gmat"). Every
 * language version points at all the others, plus x-default (English).
 */
export function languageAlternates(path: string, locale: Locale) {
  const base = siteUrl().replace(/\/$/, '');
  const languages: Record<string, string> = {};
  for (const code of LOCALES) languages[LOCALE_INFO[code].htmlLang] = `${base}${localizePath(path, code)}`;
  languages['x-default'] = `${base}${localizePath(path, 'en')}`;
  return { canonical: `${base}${localizePath(path, locale)}`, languages };
}

/**
 * The same, for a page's generateMetadata, from the route's `locale` param.
 * A page that sets its own `alternates` replaces the layout's, so every page
 * with a canonical uses this: each language version is then its own
 * canonical, and lists the others. Use `.canonical` for the page's og:url.
 */
export async function pageAlternates(params: Promise<{ locale: string }>, path: string) {
  const { locale } = await params;
  return languageAlternates(path, isLocale(locale) ? locale : DEFAULT_LOCALE);
}
