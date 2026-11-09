import { siteUrl } from '@/lib/site';
import { translatedHubLocales } from '@/lib/exams/hub-content';
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
 * The languages a page's main content exists in. Every guide and every format
 * guide exist only in English. An exam hub exists in every language when it
 * is in TRANSLATED_HUBS; otherwise in English plus the languages its
 * editorial content and exam details are translated into in full
 * (HUB_TRANSLATIONS in src/lib/exams/hub-content.ts). Course and lesson pages
 * (src/lib/courses) are written in English only, like the guides. Every other
 * page, the course and guide listings included, is translated in full.
 *
 * A page is still served in each interface language (navigation and labels
 * translated), but a version in a language its content does not exist in is
 * the English article in a different frame, not a translation. So that
 * version names the English page as canonical, only the real language
 * versions and x-default are offered as alternates, and only those are in the
 * sitemap. Add a language only when the page's whole body is translated.
 */
export function contentLocales(path: string): readonly Locale[] {
  if (path.startsWith('/guides/') || path.startsWith('/courses/')) return [DEFAULT_LOCALE];
  const exam = /^\/exams\/([^/]+)(\/format)?$/.exec(path);
  if (!exam) return LOCALES;
  if (exam[2]) return [DEFAULT_LOCALE];
  if (TRANSLATED_HUBS.has(exam[1])) return LOCALES;
  return [DEFAULT_LOCALE, ...translatedHubLocales(exam[1]).filter(isLocale)];
}

/** Whether a page's main content exists only in English (see contentLocales). */
export function isEnglishOnlyPath(path: string): boolean {
  return contentLocales(path).length === 1;
}

/** Whether `locale`'s version of a page is a real translation, not English content in a translated frame. */
export function isTranslatedFor(path: string, locale: Locale): boolean {
  return contentLocales(path).includes(locale);
}

/**
 * Canonical URL and hreflang alternates for one page, for Next's metadata
 * `alternates`. `path` is the page's English path ("/exams/gmat"). Every
 * language version the content exists in points at all the others, plus
 * x-default (English); any other language version names English as canonical.
 */
export function languageAlternates(path: string, locale: Locale) {
  const base = siteUrl().replace(/\/$/, '');
  const locales = contentLocales(path);
  const languages: Record<string, string> = {};
  for (const code of locales) languages[LOCALE_INFO[code].htmlLang] = `${base}${localizePath(path, code)}`;
  languages['x-default'] = `${base}${localizePath(path, DEFAULT_LOCALE)}`;
  const own = locales.includes(locale) ? locale : DEFAULT_LOCALE;
  return { canonical: `${base}${localizePath(path, own)}`, languages };
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
