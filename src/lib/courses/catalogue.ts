import data from './catalogue.generated.json';
import { createView, type CourseData, type LessonEntry } from './view';

/**
 * The published courses for every page the app serves: the light catalogue
 * (view.ts says why it is not the course content itself). Regenerated from
 * the content by scripts/export-courses.ts before every build.
 */
const view = createView(data as unknown as CourseData<LessonEntry>);

export const { listCourses, getCourse, getLesson, canonicalLessonPath, isCanonicalLesson } = view;
export { courseLessons, courseMinutes, coursePath, courseUpdatedOn, entryLang as lessonLang, lessonCount, lessonPath, practicePath } from './view';
export type { CourseOf, LessonEntry } from './view';
