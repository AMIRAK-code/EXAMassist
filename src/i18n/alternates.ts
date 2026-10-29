import { siteUrl } from '@/lib/site';
import { DEFAULT_LOCALE, LOCALES, LOCALE_INFO, isLocale, localizePath, type Locale } from './locales';

/**
 * The language exam details and guide articles are written in, whatever the
 * interface language: the exam configurations (src/lib/exams/configs) and the
 * guides (src/lib/content/guides.ts) exist once, in English. Elements showing
 * them carry this as their lang attribute.
 */
export const CONTENT_LANG = 'en';

/** Exam hubs translated in full, body included, into every interface language. */
const TRANSLATED_HUBS = new Set(['bocconi-online-test']);

/**
 * Whether a page's main content exists only in English: every guide, every
 * format guide, and every exam hub except those in TRANSLATED_HUBS. Such a page
 * is still served in each interface language (navigation and labels
 * translated), but those versions are the same English article in a different
 * frame, not translations. So they all name the English page as canonical,
 * only en and x-default are offered as alternates, and only the English
 * address is in the sitemap. Add a path to the translated set only when its
 * whole body is translated and reviewed.
 */
export function isEnglishOnlyPath(path: string): boolean {
  if (path.startsWith('/guides/')) return true;
  const exam = /^\/exams\/([^/]+)(\/format)?$/.exec(path);
  if (!exam) return false;
  return Boolean(exam[2]) || !TRANSLATED_HUBS.has(exam[1]);
}

/**
 * Canonical URL and hreflang alternates for one page, for Next's metadata
 * `alternates`. `path` is the page's English path ("/exams/gmat"). Every
 * language version points at all the others, plus x-default (English).
 */
export function languageAlternates(path: string, locale: Locale) {
  const base = siteUrl().replace(/\/$/, '');
  if (isEnglishOnlyPath(path)) {
    const canonical = `${base}${path}`;
    return { canonical, languages: { en: canonical, 'x-default': canonical } };
  }
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
