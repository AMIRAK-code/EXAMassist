import { describe, expect, it } from 'vitest';
import { SAMPLE_LESSONS, sampleLesson } from '@/lib/content/sample-lessons';
import { listGuides, type SampleQuestionSet } from '@/lib/content/guides';
import { listHubContent, listHubTranslations } from '@/lib/exams/hub-content';
import { getLesson, isCanonicalLesson, isPublished } from '@/lib/courses';
import { coursesForHub } from '@/lib/courses/catalogue';
import { courseHref } from '@/lib/courses/languages';

/**
 * Worked samples link to the lesson that teaches their method
 * (src/lib/content/sample-lessons.ts), and exam hubs list their courses'
 * lessons (src/components/courses/course-card.tsx): the links that let
 * search engines reach the lessons from the hubs and guides they index.
 */

function sampleIds(set: SampleQuestionSet | undefined): string[] {
  return (set?.sections ?? []).flatMap((section) => section.questions.map((q) => q.id));
}

/** Every page with samples whose exam has a course: [where, hub, sample ids]. */
const SAMPLE_PAGES: Array<[string, string, string[]]> = [
  ...listHubContent().map(([slug, content]): [string, string, string[]] => [`hub ${slug}`, slug, sampleIds(content.samples?.set)]),
  ...listHubTranslations().map(([slug, locale, content]): [string, string, string[]] => [`hub ${slug} (${locale})`, slug, sampleIds(content.samples?.set)]),
  ...listGuides().map((guide): [string, string, string[]] => [`guide ${guide.slug}`, guide.hubSlug, sampleIds(guide.samples)]),
].filter(([, hub, ids]) => ids.length > 0 && coursesForHub(hub).length > 0);

describe('sample question lessons', () => {
  it('names a published, canonical lesson with its exact title', () => {
    for (const [id, entry] of Object.entries(SAMPLE_LESSONS)) {
      const found = getLesson(entry.course, entry.lesson);
      expect(found, `${id}: ${entry.course}/${entry.lesson} is not a published lesson`).toBeDefined();
      expect(isPublished(found!.lesson)).toBe(true);
      expect(isCanonicalLesson(entry.course, found!.lesson), `${id}: link the canonical copy of ${entry.lesson}`).toBe(true);
      expect(entry.title, id).toBe(found!.lesson.title);
      expect(sampleLesson(id)?.path).toBe(`/courses/${entry.course}/${entry.lesson}`);
    }
  });

  it('links a lesson from every sample on a page whose exam has a course', () => {
    expect(SAMPLE_PAGES.length).toBeGreaterThanOrEqual(4);
    for (const [where, hub, ids] of SAMPLE_PAGES) {
      const courses = coursesForHub(hub).map((course) => course.slug);
      for (const id of ids) {
        const entry = SAMPLE_LESSONS[id];
        expect(entry, `${where}: sample ${id} has no lesson in src/lib/content/sample-lessons.ts`).toBeDefined();
        expect(courses, `${where}: ${id} links a lesson outside the exam's courses`).toContain(entry.course);
      }
    }
  });

  it('has no entry for a sample that no longer exists', () => {
    const used = new Set(SAMPLE_PAGES.flatMap(([, , ids]) => ids));
    expect(Object.keys(SAMPLE_LESSONS).filter((id) => !used.has(id))).toEqual([]);
  });
});

describe('courses on an exam hub', () => {
  it('lists every course for the hub, not only the first', () => {
    expect(coursesForHub('cisia-tolc').map((course) => course.slug)).toEqual(['tolc-i', 'tolc-e', 'tolc-f']);
    expect(coursesForHub('gre').map((course) => course.slug)).toEqual(['gre']);
    expect(coursesForHub('lsat')).toEqual([]);
  });

  it('uses a course’s translation on its language’s hub, and links English-only courses in English', () => {
    const [imatIt] = coursesForHub('imat', 'it');
    expect(imatIt.lang).toBe('it');
    expect(courseHref('it', 'imat', 'how-the-imat-works')).toBe('/it/courses/imat/how-the-imat-works');
    // No /it/courses/tolc-i/... link: that address redirects to the English page (next.config.ts).
    expect(coursesForHub('cisia-tolc', 'it').every((course) => (course.lang ?? 'en') === 'en')).toBe(true);
    expect(courseHref('it', 'tolc-i', 'how-the-tolc-i-works')).toBe('/courses/tolc-i/how-the-tolc-i-works');
  });
});
