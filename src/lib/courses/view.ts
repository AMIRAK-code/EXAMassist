import type { Course, CourseLang, CourseSlug, Lesson, Unit } from './types';

/*
 * The published courses as data, and the functions the pages read them with.
 *
 * The course text (src/lib/courses/content) is several megabytes. Imported
 * into a page the Worker serves, it went into the Worker's code, and on the
 * Workers Free plan every page the Worker rendered then went over the 10 ms
 * CPU limit (error 1102, 2026-11-17). So the app never imports the content:
 * scripts/export-courses.ts turns it into data, once a light catalogue
 * (catalogue.generated.json: courses, units and each lesson's title, summary
 * and dates, read by the sitemap, llms.txt, the exam hubs and the course
 * pages), once the full lessons (.course-data/lessons.json, read only while
 * the lesson pages are prerendered at build time: lesson-data.ts). Both have
 * the shape below, built by the same code (export.ts) from the published
 * courses in index.ts.
 */

/** What every lesson entry carries, in the light catalogue and the full data alike. */
export interface LessonEntry extends Pick<Lesson, 'slug' | 'title' | 'metaTitle' | 'summary' | 'minutes' | 'practice' | 'review'> {
  /** The language this lesson's text is written in. */
  lang: CourseLang;
}

export type UnitOf<L> = Omit<Unit, 'lessons'> & { lessons: L[] };
export type CourseOf<L> = Omit<Course, 'units' | 'translations'> & { units: Array<UnitOf<L>> };

export interface CourseData<L extends LessonEntry = LessonEntry> {
  /** Each published course in its own language, then its published translations by language. */
  courses: Array<{ course: CourseOf<L>; translations: Partial<Record<Exclude<CourseLang, 'en'>, CourseOf<L>>> }>;
  /** A lesson path whose text lives at another path (a shared lesson), mapped to that path. */
  canonical: Record<string, string>;
}

export function courseLessons<L>(course: { units: Array<{ lessons: L[] }> }): L[] {
  return course.units.flatMap((unit) => unit.lessons);
}

export function lessonCount(course: { units: Array<{ lessons: unknown[] }> }): number {
  return courseLessons(course).length;
}

export function courseMinutes(course: { units: Array<{ lessons: Array<{ minutes: number }> }> }): number {
  return courseLessons(course).reduce((sum, lesson) => sum + lesson.minutes, 0);
}

export function coursePath(course: Pick<Course, 'slug'> | CourseSlug): string {
  return `/courses/${typeof course === 'string' ? course : course.slug}`;
}

export function lessonPath(course: Pick<Course, 'slug'> | CourseSlug, lesson: Pick<Lesson, 'slug'>): string {
  return `${coursePath(course)}/${lesson.slug}`;
}

/** The app's topic practice for a lesson (paid; the page says so). */
export function practicePath({ practice }: { practice: NonNullable<Lesson['practice']> }): string {
  const { examKey, domain, skill } = practice;
  const query = new URLSearchParams({ domain, ...(skill ? { skill } : {}) });
  return `/practice/${examKey}?${query.toString()}`;
}

/** The latest date anything in a course changed: its own date or a lesson's check. */
export function courseUpdatedOn(course: { updatedOn: string; units: Array<{ lessons: Array<Pick<Lesson, 'review'>> }> }): string {
  return [course.updatedOn, ...courseLessons(course).map((lesson) => lesson.review.independentCheckOn ?? '')].sort().at(-1)!;
}

export interface LessonInCourseOf<L> {
  course: CourseOf<L>;
  unit: UnitOf<L>;
  lesson: L;
  /** 1-based position in the whole course. */
  number: number;
  previous: L | null;
  next: L | null;
}

/** The reading functions over one set of course data. */
export function createView<L extends LessonEntry>(data: CourseData<L>) {
  const inLocale = (entry: CourseData<L>['courses'][number], locale?: string): CourseOf<L> =>
    (locale && entry.translations[locale as Exclude<CourseLang, 'en'>]) || entry.course;

  /** Every published course, in `locale`'s version where the course is written in it, otherwise its own. */
  function listCourses(locale?: string): Array<CourseOf<L>> {
    return data.courses.map((entry) => inLocale(entry, locale));
  }

  function getCourse(slug: string, locale?: string): CourseOf<L> | undefined {
    const entry = data.courses.find((e) => e.course.slug === slug);
    return entry && inLocale(entry, locale);
  }

  function getLesson(courseSlug: string, lessonSlug: string, locale?: string): LessonInCourseOf<L> | undefined {
    const course = getCourse(courseSlug, locale);
    if (!course) return undefined;
    const all = courseLessons(course);
    const index = all.findIndex((lesson) => lesson.slug === lessonSlug);
    if (index < 0) return undefined;
    const unit = course.units.find((u) => u.lessons.includes(all[index]))!;
    return { course, unit, lesson: all[index], number: index + 1, previous: all[index - 1] ?? null, next: all[index + 1] ?? null };
  }

  /** Where a lesson's text lives in search: its own path, or an identical lesson's in an earlier course (index.ts). */
  function canonicalLessonPath(course: Pick<Course, 'slug'> | CourseSlug, lesson: Pick<Lesson, 'slug'>): string {
    const path = lessonPath(course, lesson);
    return data.canonical[path] ?? path;
  }

  /** Whether a lesson is its text's canonical page, so belongs in the sitemap. */
  function isCanonicalLesson(course: Pick<Course, 'slug'> | CourseSlug, lesson: Pick<Lesson, 'slug'>): boolean {
    return canonicalLessonPath(course, lesson) === lessonPath(course, lesson);
  }

  return { listCourses, getCourse, getLesson, canonicalLessonPath, isCanonicalLesson };
}

/** The language a lesson entry is written in. */
export function entryLang(lesson: Pick<LessonEntry, 'lang'>): CourseLang {
  return lesson.lang;
}
