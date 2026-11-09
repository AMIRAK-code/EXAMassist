import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { listAllCourses } from '@/lib/courses';
import { validateCourse, validateLesson, type CourseIssue } from '@/lib/courses/validate';
import type { Lesson, Unit } from '@/lib/courses/types';

/**
 * Checks course content: npx tsx scripts/check-courses.ts [unit-file ...]
 *
 * With no argument, every course (drafts included). With unit files
 * (src/lib/courses/content/<course>/<unit>.ts), the units they export, so an
 * author can check a unit before it is wired into its course. Prints every
 * issue and a lesson count; exits 1 if there is any issue.
 */
async function main(): Promise<void> {
  const files = process.argv.slice(2);
  const issues: CourseIssue[] = [];
  let lessons = 0;

  if (files.length === 0) {
    for (const course of listAllCourses()) {
      issues.push(...validateCourse(course));
      const count = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
      const checked = course.units.reduce((sum, unit) => sum + unit.lessons.filter((l) => l.review.independentCheckOn).length, 0);
      console.log(`${course.slug}: ${course.units.length} units, ${count} lessons (${checked} independently checked)`);
      lessons += count;
    }
  } else {
    for (const file of files) {
      const mod = (await import(pathToFileURL(path.resolve(file)).href)) as Record<string, unknown>;
      for (const [name, value] of Object.entries(mod)) {
        const units = isUnit(value) ? [value] : [];
        const loose = isLesson(value) ? [value] : [];
        for (const unit of units) {
          console.log(`${file} › ${name}: unit "${unit.slug}", ${unit.lessons.length} lessons`);
          for (const lesson of unit.lessons) issues.push(...validateLesson(lesson, `${unit.slug}/${lesson.slug}`));
          lessons += unit.lessons.length;
        }
        for (const lesson of loose) {
          console.log(`${file} › ${name}: lesson "${lesson.slug}"`);
          issues.push(...validateLesson(lesson, lesson.slug));
          lessons += 1;
        }
      }
    }
  }

  for (const issue of issues) console.log(`  ✗ ${issue.where}: ${issue.problem}`);
  console.log(`${lessons} lessons, ${issues.length} issue${issues.length === 1 ? '' : 's'}`);
  if (issues.length > 0) process.exitCode = 1;
}

function isUnit(value: unknown): value is Unit {
  return typeof value === 'object' && value !== null && Array.isArray((value as Unit).lessons) && typeof (value as Unit).summary === 'string';
}

function isLesson(value: unknown): value is Lesson {
  return typeof value === 'object' && value !== null && typeof (value as Lesson).teachMd === 'string';
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
