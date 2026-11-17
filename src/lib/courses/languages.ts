/**
 * The languages course and lesson pages exist in. Every course is in English;
 * a course with a full translation (the IMAT course in Italian) is in that
 * language too. Nothing else: Spanish, Polish and Turkish, and Italian for the
 * other courses, are interface languages for navigating the site, and their
 * course addresses redirect to the English page (next.config.ts). Only the
 * course index (/courses) is in every language.
 *
 * Every page reads this through src/i18n/alternates.ts, and the language
 * script on saved pages through src/lib/seo/static-pages.ts, so it stays a
 * plain constant with no imports: importing the course catalogue there would
 * load every lesson into every page. tests/unit/courses.test.ts checks it
 * against the catalogue (courseContentLangs).
 */
export const TRANSLATED_COURSES: Readonly<Record<string, readonly string[]>> = {
  imat: ['it'],
};

/** The course slug of a /courses/<slug>(/<lesson>) path, without a language prefix; null for anything else, the index included. */
export function courseSlugOf(path: string): string | null {
  return /^\/courses\/([^/]+)/.exec(path)?.[1] ?? null;
}

/** The extra languages of a /courses/<slug> or /courses/<slug>/<lesson> path, beyond English. */
export function translatedCourseLangs(path: string): readonly string[] {
  const slug = courseSlugOf(path);
  return (slug && TRANSLATED_COURSES[slug]) || [];
}

/** Every language a course's pages exist in: English, then its translations. */
export function courseLangs(slug: string): readonly string[] {
  return ['en', ...(TRANSLATED_COURSES[slug] ?? [])];
}

/** The language to show a course in for a visitor browsing in `locale`: that language when the course has it, else English. */
export function courseLangFor(slug: string, locale: string): string {
  return courseLangs(slug).includes(locale) ? locale : 'en';
}

/** The address of a course page or lesson in the language a visitor browsing in `locale` gets (English needs no prefix). */
export function courseHref(locale: string, slug: string, lesson?: string): string {
  const lang = courseLangFor(slug, locale);
  const path = `/courses/${slug}${lesson ? `/${lesson}` : ''}`;
  return lang === 'en' ? path : `/${lang}${path}`;
}
