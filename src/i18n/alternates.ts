import { siteUrl } from '@/lib/site';
import { LOCALES, LOCALE_INFO, localizePath, type Locale } from './locales';

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
