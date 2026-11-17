import fs from 'node:fs';
import path from 'node:path';
import type { Lesson } from './types';
import { createView, type CourseData, type LessonEntry } from './view';

/**
 * The full lessons, for the lesson pages only. They are prerendered at build
 * time and served as files, so this runs during the build, in Node, and reads
 * what scripts/export-courses.ts wrote just before: the lesson text never
 * enters the Worker's code (view.ts says why).
 */
let view: ReturnType<typeof createView<Lesson & LessonEntry>> | undefined;

function load() {
  if (view) return view;
  const file = path.join(process.cwd(), '.course-data', 'lessons.json');
  if (!fs.existsSync(file)) throw new Error(`${file} is missing: run npx tsx scripts/export-courses.ts (npm run build and npm run dev do).`);
  view = createView(JSON.parse(fs.readFileSync(file, 'utf8')) as CourseData<Lesson & LessonEntry>);
  return view;
}

export function getFullLesson(courseSlug: string, lessonSlug: string, locale?: string) {
  return load().getLesson(courseSlug, lessonSlug, locale);
}
