import { defineRouting } from 'next-intl/routing';
import { DEFAULT_LOCALE, LOCALES } from './locales';

/**
 * English lives at the bare path ("/exams"); every other language is
 * prefixed ("/it/exams"). Each language is its own URL, so search engines
 * index it and a shared link keeps its language.
 *
 * The locale cookie remembers a visitor's choice for a year, so a bare link
 * opened later lands in their language. It is a functional cookie, disclosed
 * on the privacy page.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  localeCookie: { name: 'NEXT_LOCALE', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' },
  // Search engines and every first visit see English at "/" unless the
  // browser asks for one of our languages.
  localeDetection: true,
});
