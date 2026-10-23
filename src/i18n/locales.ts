/**
 * Interface languages. English is the default and lives at the bare path
 * ("/exams"); every other language is prefixed ("/it/exams").
 *
 * Exam CONTENT is a separate matter: questions are in English, and only exams
 * whose config lists Italian in `contentLocales` (the TOLC-E and the IMAT) are
 * also offered in Italian. Translating the interface never translates a
 * question.
 */
export const LOCALES = ['en', 'it', 'tr', 'es', 'pl'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export interface LocaleInfo {
  code: Locale;
  /** The language's name in itself, as the switcher shows it. */
  nativeName: string;
  /** The language's name in English, for screen-reader hints and docs. */
  englishName: string;
  /** BCP 47 tag for <html lang> and hreflang. */
  htmlLang: string;
  /** Open Graph locale. */
  ogLocale: string;
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  en: { code: 'en', nativeName: 'English', englishName: 'English', htmlLang: 'en', ogLocale: 'en_GB' },
  it: { code: 'it', nativeName: 'Italiano', englishName: 'Italian', htmlLang: 'it', ogLocale: 'it_IT' },
  tr: { code: 'tr', nativeName: 'Türkçe', englishName: 'Turkish', htmlLang: 'tr', ogLocale: 'tr_TR' },
  es: { code: 'es', nativeName: 'Español', englishName: 'Spanish', htmlLang: 'es', ogLocale: 'es_ES' },
  pl: { code: 'pl', nativeName: 'Polski', englishName: 'Polish', htmlLang: 'pl', ogLocale: 'pl_PL' },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** "/it/exams" -> { locale: "it", path: "/exams" }; "/exams" -> { locale: "en", path: "/exams" }. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split('/');
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    return { locale: first, path: `/${rest.join('/')}` || '/' };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || '/' };
}

/** The same page in another language. */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}
