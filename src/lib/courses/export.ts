import { canonicalLessonPaths, lessonLang, listCourses } from './index';
import type { Course, CourseLang, Lesson } from './types';
import type { CourseData, CourseOf, LessonEntry } from './view';

/**
 * The published courses as data for the app (view.ts says why): the light
 * catalogue, with each lesson's title, summary, minutes, practice link, review
 * record and language, or the full lessons as well. Runs in Node only
 * (scripts/export-courses.ts, tests), never in the app.
 */
export function courseData(mode: 'light'): CourseData<LessonEntry>;
export function courseData(mode: 'full'): CourseData<Lesson & LessonEntry>;
export function courseData(mode: 'light' | 'full'): CourseData {
  const lesson = (source: Lesson): LessonEntry => {
    const lang = lessonLang(source);
    if (mode === 'full') return { ...source, lang };
    const { slug, title, metaTitle, summary, minutes, practice, review } = source;
    return { slug, title, ...(metaTitle ? { metaTitle } : {}), summary, minutes, practice, review, lang };
  };
  const course = (source: Course): CourseOf<LessonEntry> => {
    const { translations: _translations, units, ...rest } = source;
    return { ...rest, units: units.map((unit) => ({ ...unit, lessons: unit.lessons.map(lesson) })) };
  };
  const courses = listCourses();
  const canonical = Object.fromEntries([...canonicalLessonPaths(courses)].filter(([path, target]) => path !== target));
  return {
    courses: courses.map((source) => ({
      course: course(source),
      translations: Object.fromEntries(
        Object.entries(source.translations ?? {}).map(([lang, version]) => [lang, course(version!)]),
      ) as Partial<Record<Exclude<CourseLang, 'en'>, CourseOf<LessonEntry>>>,
    })),
    canonical,
  };
}
