/**
 * The courses written in more than one language, and the extra languages,
 * by course slug. Every page reads this through src/i18n/alternates.ts, so it
 * stays a plain constant: importing the course catalogue there would load
 * every lesson into every page.
 *
 * It must match the catalogue: a course is listed here only when every one of
 * its published lessons is published in each language listed
 * (tests/unit/courses.test.ts checks this against courseContentLangs).
 */
export const TRANSLATED_COURSES: Readonly<Record<string, readonly string[]>> = {
  imat: ['it'],
};

/** The extra languages of a /courses/<slug> or /courses/<slug>/<lesson> path, beyond English. */
export function translatedCourseLangs(path: string): readonly string[] {
  const slug = /^\/courses\/([^/]+)/.exec(path)?.[1];
  return (slug && TRANSLATED_COURSES[slug]) || [];
}
