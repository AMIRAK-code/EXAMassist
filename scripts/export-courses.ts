import fs from 'node:fs';
import path from 'node:path';
import { courseData } from '../src/lib/courses/export';

/**
 * Writes the course data the app reads (src/lib/courses/view.ts says why):
 *
 * - src/lib/courses/catalogue.generated.json, the light catalogue, committed
 *   and checked against the content by tests/unit/course-data.test.ts;
 * - .course-data/lessons.json, the full lessons, read only while the lesson
 *   pages are prerendered (src/lib/courses/lesson-data.ts). Not committed.
 *
 * Runs before every build and dev server (package.json). npx tsx scripts/export-courses.ts
 */
const root = process.cwd();
const catalogue = path.join(root, 'src', 'lib', 'courses', 'catalogue.generated.json');
const lessons = path.join(root, '.course-data', 'lessons.json');

const light = `${JSON.stringify(courseData('light'), null, 1)}\n`;
// Left alone when only its line endings differ (a Windows checkout), so the build never dirties the tree.
if (!fs.existsSync(catalogue) || fs.readFileSync(catalogue, 'utf8').replace(/\r\n/g, '\n') !== light) fs.writeFileSync(catalogue, light);
fs.mkdirSync(path.dirname(lessons), { recursive: true });
fs.writeFileSync(lessons, JSON.stringify(courseData('full')));
console.log(`Course data: ${path.relative(root, catalogue)} (${light.length} bytes), ${path.relative(root, lessons)} (${fs.statSync(lessons).size} bytes).`);
