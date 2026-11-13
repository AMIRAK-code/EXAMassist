import { bocconiCourse } from './content/bocconi';
import { bocconiMasterCourse } from './content/bocconi-master';
import { gmatCourse } from './content/gmat';
import { greCourse } from './content/gre';
import { tolcICourse } from './content/tolc-i';
import { tolcECourse } from './content/tolc-e';
import { tolcFCourse } from './content/tolc-f';
import type { Course, CourseSlug, Lesson, Unit } from './types';

export type { Course, CourseSlug, Lesson, Unit } from './types';

/**
 * Every course, in the order the course index lists them. A lesson is
 * published only once its independent check is recorded (types.ts); the
 * pages, the sitemap and llms.txt read only what these functions return.
 */
const ALL_COURSES: readonly Course[] = [greCourse, gmatCourse, bocconiCourse, bocconiMasterCourse, tolcICourse, tolcECourse, tolcFCourse];

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

const COURSES: readonly Course[] = ALL_COURSES.map(published).filter((course) => course.units.length > 0);

/** Every course with its drafts, for validation only. */
export function listAllCourses(): readonly Course[] {
  return ALL_COURSES;
}

export function listCourses(): readonly Course[] {
  return COURSES;
}

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((course) => course.slug === slug);
}

export function courseLessons(course: Course): Lesson[] {
  return course.units.flatMap((unit) => unit.lessons);
}

export function lessonCount(course: Course): number {
  return courseLessons(course).length;
}

export function courseMinutes(course: Course): number {
  return courseLessons(course).reduce((sum, lesson) => sum + lesson.minutes, 0);
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

export function getLesson(courseSlug: string, lessonSlug: string): LessonInCourse | undefined {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  const all = courseLessons(course);
  const index = all.findIndex((lesson) => lesson.slug === lessonSlug);
  if (index < 0) return undefined;
  const unit = course.units.find((u) => u.lessons.includes(all[index]))!;
  return { course, unit, lesson: all[index], number: index + 1, previous: all[index - 1] ?? null, next: all[index + 1] ?? null };
}

export function coursePath(course: Pick<Course, 'slug'> | CourseSlug): string {
  return `/courses/${typeof course === 'string' ? course : course.slug}`;
}

export function lessonPath(course: Pick<Course, 'slug'> | CourseSlug, lesson: Pick<Lesson, 'slug'>): string {
  return `${coursePath(course)}/${lesson.slug}`;
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

/** The app's topic practice for a lesson (paid; the page says so). */
export function practicePath(lesson: Lesson): string {
  const { examKey, domain, skill } = lesson.practice;
  const query = new URLSearchParams({ domain, ...(skill ? { skill } : {}) });
  return `/practice/${examKey}?${query.toString()}`;
}

/** The latest date anything in a course changed: its own date or a lesson's check. */
export function courseUpdatedOn(course: Course): string {
  return [course.updatedOn, ...courseLessons(course).map((lesson) => lesson.review.independentCheckOn ?? '')].sort().at(-1)!;
}
