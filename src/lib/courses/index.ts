import { bocconiCourse } from './content/bocconi';
import { gmatCourse } from './content/gmat';
import { greCourse } from './content/gre';
import type { Course, CourseSlug, Lesson, Unit } from './types';

export type { Course, CourseSlug, Lesson, Unit } from './types';

/**
 * Every course, in the order the course index lists them. A lesson is
 * published only once its independent check is recorded (types.ts); the
 * pages, the sitemap and llms.txt read only what these functions return.
 */
const ALL_COURSES: readonly Course[] = [greCourse, gmatCourse, bocconiCourse];

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
