import { bocconiCourse } from './content/bocconi';
import { bocconiMasterCourse } from './content/bocconi-master';
import { gmatCourse } from './content/gmat';
import { greCourse } from './content/gre';
import { tolcICourse } from './content/tolc-i';
import { tolcECourse } from './content/tolc-e';
import { tolcFCourse } from './content/tolc-f';
import { imatCourse } from './content/imat';
import type { Course, CourseLang, CourseSlug, Lesson, Unit } from './types';
import { courseLessons, lessonPath } from './view';

export type { Course, CourseLang, CourseSlug, Lesson, Unit } from './types';
export { courseLessons, courseMinutes, coursePath, courseUpdatedOn, lessonCount, lessonPath, practicePath } from './view';

/*
 * The whole course catalogue, content included, for Node only: validation,
 * tests and scripts/export-courses.ts. The app reads the exported data
 * instead (catalogue.ts, lesson-data.ts; view.ts says why).
 */

/**
 * Every course, in the order the course index lists them. A lesson is
 * published only once its independent check is recorded (types.ts); the
 * pages, the sitemap and llms.txt read only what these functions return.
 */
const ALL_COURSES: readonly Course[] = [greCourse, gmatCourse, bocconiCourse, bocconiMasterCourse, tolcICourse, tolcECourse, tolcFCourse, imatCourse];

export function isPublished(lesson: Lesson): boolean {
  return lesson.review.independentCheckOn !== null;
}

/** A course with only its published lessons, and only the units that have any. */
function published(course: Course): Course {
  const units = course.units
    .map((unit) => ({ ...unit, lessons: unit.lessons.filter(isPublished) }))
    .filter((unit) => unit.lessons.length > 0);
  return { ...course, units };
}

/** The language each published lesson object is written in (a localized course mixes them while a translation is in progress). */
const LESSON_LANG = new WeakMap<Lesson, CourseLang>();

/**
 * A published course in a translation's language: the translation's own
 * text for the course and each unit, and for each published lesson its
 * translation when that is published too, otherwise the original lesson.
 * Undefined when nothing of the translation is published yet.
 */
function localized(original: Course, translation: Course): Course | undefined {
  const lang = translation.lang ?? 'en';
  const translatedUnits = new Map(translation.units.map((unit) => [unit.slug, unit]));
  let translatedLessons = 0;
  const units = original.units.map((unit) => {
    const own = translatedUnits.get(unit.slug);
    const lessons = unit.lessons.map((lesson) => {
      const translated = own?.lessons.find((other) => other.slug === lesson.slug);
      if (!translated || !isPublished(translated)) return lesson;
      LESSON_LANG.set(translated, lang);
      translatedLessons += 1;
      return translated;
    });
    return { ...unit, title: own?.title ?? unit.title, summary: own?.summary ?? unit.summary, lessons };
  });
  if (translatedLessons === 0) return undefined;
  const { translations: _none, ...rest } = translation;
  return { ...rest, units };
}

function publishCourse(course: Course): Course {
  const original = published(course);
  for (const lesson of courseLessons(original)) LESSON_LANG.set(lesson, course.lang ?? 'en');
  const translations: Course['translations'] = {};
  for (const [lang, translation] of Object.entries(course.translations ?? {}) as Array<[Exclude<CourseLang, 'en'>, Course]>) {
    const version = localized(original, translation);
    if (version) translations[lang] = version;
  }
  return { ...original, translations };
}

const COURSES: readonly Course[] = ALL_COURSES.map(publishCourse).filter((course) => course.units.length > 0);

/** Every course with its drafts, for validation only. */
export function listAllCourses(): readonly Course[] {
  return ALL_COURSES;
}

/**
 * Every published course, in `locale`'s version where the course is written
 * in that language, otherwise in its own language.
 */
export function listCourses(locale?: string): readonly Course[] {
  return locale ? COURSES.map((course) => inLocale(course, locale)) : COURSES;
}

function inLocale(course: Course, locale: string): Course {
  return course.translations?.[locale as Exclude<CourseLang, 'en'>] ?? course;
}

export function getCourse(slug: string, locale?: string): Course | undefined {
  const course = COURSES.find((c) => c.slug === slug);
  return course && locale ? inLocale(course, locale) : course;
}

/** The language a published lesson is written in. */
export function lessonLang(lesson: Lesson): CourseLang {
  return LESSON_LANG.get(lesson) ?? 'en';
}

/**
 * The languages a course page or lesson page exists in (src/i18n/alternates.ts):
 * the course's own language and each published translation of it. Undefined
 * for a path that is not a published course or lesson.
 */
export function courseContentLangs(path: string): CourseLang[] | undefined {
  const match = /^\/courses\/([^/]+)(?:\/([^/]+))?$/.exec(path);
  const course = match ? COURSES.find((c) => c.slug === match[1]) : undefined;
  if (!match || !course) return undefined;
  const langs: CourseLang[] = [course.lang ?? 'en'];
  for (const [lang, version] of Object.entries(course.translations ?? {}) as Array<[CourseLang, Course]>) {
    const lesson = match[2] ? courseLessons(version).find((l) => l.slug === match[2]) : undefined;
    if (!match[2] || (lesson && lessonLang(lesson) === lang)) langs.push(lang);
  }
  return langs;
}

export interface LessonInCourse {
  course: Course;
  unit: Unit;
  lesson: Lesson;
  /** 1-based position in the whole course. */
  number: number;
  previous: Lesson | null;
  next: Lesson | null;
}

export function getLesson(courseSlug: string, lessonSlug: string, locale?: string): LessonInCourse | undefined {
  const course = getCourse(courseSlug, locale);
  if (!course) return undefined;
  const all = courseLessons(course);
  const index = all.findIndex((lesson) => lesson.slug === lessonSlug);
  if (index < 0) return undefined;
  const unit = course.units.find((u) => u.lessons.includes(all[index]))!;
  return { course, unit, lesson: all[index], number: index + 1, previous: all[index - 1] ?? null, next: all[index + 1] ?? null };
}

/** What a course adds to a lesson it shares: its own practice link and its own review record. */
const COURSE_OWN_FIELDS: ReadonlySet<string> = new Set<keyof Lesson>(['practice', 'review']);

/** Deep equality for plain data, quick when the two share objects, as an adapted lesson does with its source. */
function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => Object.hasOwn(b, key) && sameValue((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
}

/** Whether two lessons teach the same thing word for word: every field except the course's own. */
function sameTeaching(a: Lesson, b: Lesson): boolean {
  const teaching = (lesson: Lesson) => Object.fromEntries(Object.entries(lesson).filter(([key]) => !COURSE_OWN_FIELDS.has(key)));
  return sameValue(teaching(a), teaching(b));
}

/**
 * The canonical path of every lesson in `courses`, keyed by its own path.
 * TOLC-E and TOLC-F reuse TOLC-I's shared lessons unchanged (only the
 * practice link and review record differ: content/tolc-e/adapt.ts,
 * content/tolc-f/shared.ts), so the same article is at two or three
 * addresses. Each copy stays in its own course for readers, but names the
 * first course's copy (in `courses` order) as canonical, and only that copy
 * goes in the sitemap. Lessons that merely share a slug (GRE and GMAT
 * "probability") teach different things and keep their own canonical, and a
 * copy rewritten for its own course gets its own canonical by itself.
 */
export function canonicalLessonPaths(courses: readonly Course[]): Map<string, string> {
  const canonical = new Map<string, string>();
  const seen = new Map<string, Array<{ lesson: Lesson; path: string }>>();
  for (const course of courses) {
    for (const lesson of courseLessons(course)) {
      const path = lessonPath(course, lesson);
      const earlier = seen.get(lesson.slug) ?? [];
      canonical.set(path, earlier.find((other) => sameTeaching(other.lesson, lesson))?.path ?? path);
      seen.set(lesson.slug, [...earlier, { lesson, path }]);
    }
  }
  return canonical;
}

let publishedCanonicalPaths: Map<string, string> | undefined;

/**
 * The path that names where a published lesson's text lives in search: its
 * own path, or the path of the identical lesson in an earlier course. Only
 * published lessons count, so a copy in a later course stands in while the
 * first course's copy is a draft.
 */
export function canonicalLessonPath(course: Pick<Course, 'slug'> | CourseSlug, lesson: Pick<Lesson, 'slug'>): string {
  publishedCanonicalPaths ??= canonicalLessonPaths(COURSES);
  const path = lessonPath(course, lesson);
  return publishedCanonicalPaths.get(path) ?? path;
}

/** Whether a lesson is its text's canonical page, so belongs in the sitemap. */
export function isCanonicalLesson(course: Pick<Course, 'slug'> | CourseSlug, lesson: Pick<Lesson, 'slug'>): boolean {
  return canonicalLessonPath(course, lesson) === lessonPath(course, lesson);
}
