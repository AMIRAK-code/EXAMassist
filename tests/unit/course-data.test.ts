import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import * as full from '@/lib/courses';
import * as catalogue from '@/lib/courses/catalogue';
import { courseData } from '@/lib/courses/export';
import { createView } from '@/lib/courses/view';

/**
 * The app reads exported course data, never the content itself
 * (src/lib/courses/view.ts says why): the committed light catalogue, and the
 * full lessons written at build time. Both must say what the content says.
 */
describe('the exported course data', () => {
  it('has a committed catalogue that matches the content: run npx tsx scripts/export-courses.ts after editing a course', () => {
    const committed = fs.readFileSync(path.join('src', 'lib', 'courses', 'catalogue.generated.json'), 'utf8');
    expect(committed).toBe(`${JSON.stringify(courseData('light'), null, 1)}\n`);
  });

  it('lists the same courses, lessons, languages and canonical addresses as the content', () => {
    for (const locale of [undefined, 'en', 'it', 'es']) {
      const fromContent = full.listCourses(locale);
      const fromCatalogue = catalogue.listCourses(locale);
      expect(fromCatalogue.map((c) => `${c.slug}:${c.title}`)).toEqual(fromContent.map((c) => `${c.slug}:${c.title}`));
      fromContent.forEach((course, i) => {
        const lessons = full.courseLessons(course);
        const entries = catalogue.courseLessons(fromCatalogue[i]);
        expect(entries.map((l) => `${l.slug}|${l.title}|${l.summary}|${l.minutes}|${l.review.independentCheckOn}|${catalogue.lessonLang(l)}`)).toEqual(
          lessons.map((l) => `${l.slug}|${l.title}|${l.summary}|${l.minutes}|${l.review.independentCheckOn}|${full.lessonLang(l)}`),
        );
        for (const lesson of lessons) {
          expect(catalogue.canonicalLessonPath(course, lesson)).toBe(full.canonicalLessonPath(course, lesson));
        }
      });
    }
  });

  it('keeps the lesson text out of the catalogue, and carries all of it in the full data', () => {
    const light = JSON.stringify(courseData('light'));
    expect(light).not.toContain('"teachMd"');
    expect(light).not.toContain('"flashcards"');
    const view = createView(courseData('full'));
    const found = view.getLesson('imat', 'biological-molecules', 'it');
    const original = full.getLesson('imat', 'biological-molecules', 'it');
    expect(found?.lesson.teachMd).toBe(original?.lesson.teachMd);
    expect(found?.lesson.check).toEqual(original?.lesson.check);
    expect(found?.lesson.lang).toBe('it');
    expect(found?.number).toBe(original?.number);
  });

  it('never lets an app page import the course content', () => {
    const appFiles = fs
      .readdirSync('src', { recursive: true, encoding: 'utf8' })
      .filter((file) => /\.(ts|tsx)$/.test(file) && !file.startsWith(path.join('lib', 'courses')));
    for (const file of appFiles) {
      const source = fs.readFileSync(path.join('src', file), 'utf8');
      expect(source, file).not.toMatch(/from '@\/lib\/courses'|from '@\/lib\/courses\/(index|export|content\/)/);
    }
  });
});
