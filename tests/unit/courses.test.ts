import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { llmsTxt } from '@/lib/seo/llms';
import { listGuides } from '@/lib/content/guides';
import { EXAM_HUBS, getExamConfig } from '@/lib/exams/registry';
import { FREE_FEATURES } from '@/lib/billing/plans';
import { pageAlternates } from '@/i18n/alternates';
import { LOCALES } from '@/i18n/locales';
import {
  canonicalLessonPath,
  canonicalLessonPaths,
  courseLessons,
  coursePath,
  getCourse,
  getLesson,
  isCanonicalLesson,
  isPublished,
  lessonPath,
  listAllCourses,
  listCourses,
  practicePath,
  type Course,
  type Lesson,
} from '@/lib/courses';
import { internalLinks, lessonTexts, validateCourse, validateLesson } from '@/lib/courses/validate';
import { TITLE_BUDGET, pageTitle, renderedTitle } from '@/lib/seo/title';
import { renderInlineMarkdown } from '@/lib/markdown';

const SITE = 'https://uniexamer.com';
const saved = { ...process.env };
afterEach(() => {
  process.env = { ...saved };
});

describe('course content', () => {
  it.each(listAllCourses().map((course) => [course.slug, course] as const))('%s passes every content check, drafts included', (_slug, course) => {
    const issues = validateCourse(course);
    expect(issues.map((issue) => `${issue.where}: ${issue.problem}`)).toEqual([]);
  });

  it('lists the seven courses, each with dozens of published lessons', () => {
    expect(listCourses().map((course) => course.slug)).toEqual(['gre', 'gmat', 'bocconi', 'bocconi-master', 'tolc-i', 'tolc-e', 'tolc-f']);
    for (const course of listCourses()) expect(courseLessons(course).length, course.slug).toBeGreaterThanOrEqual(24);
  });

  it('publishes only lessons whose independent check is recorded, and never claims an expert review', () => {
    for (const course of listAllCourses()) {
      for (const lesson of course.units.flatMap((unit) => unit.lessons)) {
        expect(lesson.review.expertReview, lesson.slug).toBeNull();
        expect(lesson.review.aiAssisted, lesson.slug).toBe(true);
        expect(getLesson(course.slug, lesson.slug) !== undefined, lesson.slug).toBe(isPublished(lesson));
      }
    }
  });

  it('covers every content area of each exam it prepares for', () => {
    // Analytical Writing, the three Verbal and four Quant areas; the three GMAT sections' domains; Bocconi's four areas.
    for (const course of listCourses()) {
      const practised = new Set(courseLessons(course).map((lesson) => `${lesson.practice.examKey}/${lesson.practice.domain}`));
      for (const examKey of course.examKeys) {
        for (const domain of getExamConfig(examKey)!.domains) expect(practised, `${course.slug}: ${domain.slug}`).toContain(`${examKey}/${domain.slug}`);
      }
    }
  });

  it('labels mind-map branches only for units the course has', () => {
    for (const course of listAllCourses()) {
      if (!course.mindMap) continue;
      const units = course.units.map((unit) => unit.slug);
      for (const slug of Object.keys(course.mindMap.branchNotes ?? {})) expect(units, `${course.slug}: ${slug}`).toContain(slug);
      expect(course.mindMap.centre.length, course.slug).toBeLessThanOrEqual(22);
      expect(course.mindMap.centreNote.length, course.slug).toBeLessThanOrEqual(30);
    }
  });

  it('links only to pages that exist', () => {
    const known = new Set<string>([
      '/', '/exams', '/guides', '/courses', '/pricing',
      '/about/editorial-standards', '/about/how-scoring-works', '/about/support', '/about/privacy', '/about/terms',
      ...EXAM_HUBS.flatMap((hub) => [`/exams/${hub.slug}`, `/exams/${hub.slug}/format`]),
      ...listGuides().map((guide) => `/guides/${guide.slug}`),
      ...listCourses().flatMap((course) => [coursePath(course), ...courseLessons(course).map((lesson) => lessonPath(course, lesson))]),
    ]);
    for (const course of listCourses()) {
      for (const link of internalLinks(course.introMd)) expect(known, `${course.slug} intro -> ${link}`).toContain(link);
      for (const lesson of courseLessons(course)) {
        for (const [where, text] of lessonTexts(lesson)) {
          for (const link of internalLinks(text)) expect(known, `${lesson.slug} ${where} -> ${link}`).toContain(link);
        }
      }
    }
  });

  it('sends every lesson to topic practice on a skill the exam really has', () => {
    for (const course of listCourses()) {
      for (const lesson of courseLessons(course)) {
        const url = new URL(practicePath(lesson), SITE);
        const config = getExamConfig(url.pathname.split('/')[2])!;
        const domain = config.domains.find((d) => d.slug === url.searchParams.get('domain'));
        expect(domain, lesson.slug).toBeDefined();
        const skill = url.searchParams.get('skill');
        if (skill) expect(domain!.skills.map((s) => s.slug), lesson.slug).toContain(skill);
      }
    }
  });

  it('typesets maths in objectives and titles without turning their other text into formatting', () => {
    // These short fields go through InlineMarkdown on the lesson page, so a formula
    // in them is typeset; everything outside the formulas must come out as written.
    const decode = (html: string) =>
      html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&');
    for (const course of listAllCourses()) {
      for (const lesson of course.units.flatMap((unit) => unit.lessons)) {
        const fields = [
          ...lesson.objectives,
          ...lesson.examples.map((example) => example.title),
          ...lesson.traps.map((trap) => trap.title),
          ...lesson.check.map((question) => question.title),
        ];
        for (const field of fields) {
          const words = field.replace(/\$[^$\n]+?\$/g, 'MATH');
          expect(decode(renderInlineMarkdown(words)), `${course.slug}/${lesson.slug}: ${field}`).toBe(words);
          if (field.includes('$')) expect(renderInlineMarkdown(field), `${course.slug}/${lesson.slug}: ${field}`).toContain('class="katex"');
        }
      }
    }
  });
});

describe('what is free', () => {
  it('keeps the courses inside the free `guides` feature, and their pages ungated', () => {
    expect(FREE_FEATURES).toContain('guides');
    const pages = ['page.tsx', '[course]/page.tsx', '[course]/[lesson]/page.tsx'].map((file) =>
      fs.readFileSync(path.join('src', 'app', '[locale]', 'courses', file), 'utf8'),
    );
    for (const source of pages) {
      // Saved as static files after a deploy: nothing may depend on the visitor.
      expect(source).not.toMatch(/loadEntitlements|getCurrentUser|cookies\(|headers\(/);
    }
  });

  it('renders every course page at build time, never on the Worker', () => {
    // Rendering a lesson per request exceeds the Workers Free plan's CPU limit
    // (error 1102), so each page is prerendered in every language.
    for (const file of ['page.tsx', '[course]/page.tsx', '[course]/[lesson]/page.tsx']) {
      const source = fs.readFileSync(path.join('src', 'app', '[locale]', 'courses', file), 'utf8');
      expect(source, file).toMatch(/^export const dynamic = 'force-static';$/m);
    }
  });
});

describe('course pages in search', () => {
  function production() {
    process.env.NEXT_PUBLIC_SITE_URL = SITE;
    process.env.SEARCH_INDEXING_ENABLED = 'true';
  }

  it('lists the course index in every language, each course, and each lesson text once, in English', () => {
    production();
    const urls = sitemap().map((entry) => entry.url);
    for (const locale of LOCALES) expect(urls).toContain(`${SITE}${locale === 'en' ? '' : `/${locale}`}/courses`);
    expect(new Set(urls).size, 'no URL twice').toBe(urls.length);
    for (const course of listCourses()) {
      expect(urls).toContain(`${SITE}${coursePath(course)}`);
      for (const lesson of courseLessons(course)) {
        const own = `${SITE}${lessonPath(course, lesson)}`;
        if (isCanonicalLesson(course, lesson)) expect(urls).toContain(own);
        else expect(urls, `${own} is a copy`).not.toContain(own);
        expect(urls).toContain(`${SITE}${canonicalLessonPath(course, lesson)}`);
        expect(urls).not.toContain(`${SITE}/it${lessonPath(course, lesson)}`);
      }
    }
  });

  it('gives each copy of a TOLC-I lesson in TOLC-E and TOLC-F the TOLC-I page as canonical', async () => {
    production();
    const original = '/courses/tolc-i/real-numbers-powers-and-radicals';
    for (const slug of ['tolc-e', 'tolc-f']) {
      const copy = getLesson(slug, 'real-numbers-powers-and-radicals');
      expect(copy, slug).toBeDefined();
      expect(canonicalLessonPath(copy!.course, copy!.lesson)).toBe(original);
      for (const locale of LOCALES) {
        const { canonical, languages } = await pageAlternates(Promise.resolve({ locale }), canonicalLessonPath(copy!.course, copy!.lesson));
        expect(canonical).toBe(`${SITE}${original}`);
        expect(languages).toEqual({ en: `${SITE}${original}`, 'x-default': `${SITE}${original}` });
      }
    }
    const tolcI = getLesson('tolc-i', 'real-numbers-powers-and-radicals')!;
    expect(isCanonicalLesson(tolcI.course, tolcI.lesson)).toBe(true);
  });

  it('keeps lessons with their own text canonical, even where a slug repeats in another course', () => {
    for (const [course, lesson] of [
      ['gre', 'probability'],
      ['gmat', 'probability'],
      ['tolc-e', 'arguments-assumptions-and-evidence'],
      ['bocconi', 'exponential-and-logarithmic-equations'],
    ]) {
      const found = getLesson(course, lesson);
      expect(found, `${course}/${lesson}`).toBeDefined();
      expect(isCanonicalLesson(found!.course, found!.lesson), `${course}/${lesson}`).toBe(true);
    }
  });

  it('names as canonical only an identical, published lesson in an earlier course, which is canonical itself', () => {
    const courses = listCourses();
    const teaching = ({ practice: _practice, review: _review, ...rest }: Lesson) => JSON.stringify(rest);
    const byPath = new Map(courses.flatMap((course) => courseLessons(course).map((lesson) => [lessonPath(course, lesson), { course, lesson }] as const)));
    const firstForText = new Map<string, string>();
    for (const course of courses) {
      for (const lesson of courseLessons(course)) {
        const own = lessonPath(course, lesson);
        const target = canonicalLessonPath(course, lesson);
        const found = byPath.get(target);
        expect(found, `${own} -> ${target}`).toBeDefined();
        expect(teaching(found!.lesson), `${own} -> ${target}`).toBe(teaching(lesson));
        expect(isCanonicalLesson(found!.course, found!.lesson), `${target} is canonical`).toBe(true);
        expect(courses.indexOf(found!.course), `${target} comes first`).toBeLessThanOrEqual(courses.indexOf(course));
        // Every identical lesson shares one canonical: the first one met.
        firstForText.set(teaching(lesson), firstForText.get(teaching(lesson)) ?? own);
        expect(target, own).toBe(firstForText.get(teaching(lesson)));
      }
    }
  });

  it('decides canonicals by the text, whatever the course list', () => {
    const source = courseLessons(getCourse('tolc-i')!).find((lesson) => lesson.slug === 'real-numbers-powers-and-radicals')!;
    const course = (slug: string, lessons: Lesson[]) => ({ slug, units: [{ slug: 'unit', title: 'Unit', summary: '', lessons }] }) as unknown as Course;
    const forCourse = (lesson: Lesson, examKey: string): Lesson => ({ ...lesson, practice: { ...lesson.practice, examKey } });
    const at = (slug: string) => `/courses/${slug}/real-numbers-powers-and-radicals`;

    // While the first course's copy is a draft, the next course's copy stands in.
    const withoutFirst = canonicalLessonPaths([course('tolc-e', [forCourse(source, 'tolc-e')]), course('tolc-f', [forCourse(source, 'tolc-f')])]);
    expect(withoutFirst.get(at('tolc-e'))).toBe(at('tolc-e'));
    expect(withoutFirst.get(at('tolc-f'))).toBe(at('tolc-e'));

    // Equal text counts, not shared objects; a rewritten copy is its own page.
    const paths = canonicalLessonPaths([
      course('tolc-i', [source]),
      course('tolc-e', [structuredClone(forCourse(source, 'tolc-e'))]),
      course('tolc-f', [{ ...forCourse(source, 'tolc-f'), teachMd: `${source.teachMd}\n\nOne more paragraph for TOLC-F.` }]),
    ]);
    expect(paths.get(at('tolc-e'))).toBe(at('tolc-i'));
    expect(paths.get(at('tolc-f'))).toBe(at('tolc-f'));
  });

  it('gives a copied lesson page the canonical of the lesson it copies', () => {
    const source = fs.readFileSync(path.join('src', 'app', '[locale]', 'courses', '[course]', '[lesson]', 'page.tsx'), 'utf8');
    const metadata = source.slice(source.indexOf('export async function generateMetadata'), source.indexOf('function topicName'));
    expect(metadata).toContain('pageAlternates(params, canonicalLessonPath(course, lesson))');
  });

  it('titles every lesson page within the budget, naming the course where it fits', () => {
    for (const course of listCourses()) {
      for (const lesson of courseLessons(course)) {
        const where = lessonPath(course, lesson);
        const name = lesson.metaTitle ?? lesson.title;
        const rendered = renderedTitle(pageTitle(name, course.shortTitle));
        expect(rendered.startsWith(name), where).toBe(true);
        expect(rendered.length, `${where}: ${rendered}`).toBeLessThanOrEqual(TITLE_BUDGET);
        if (`${name} | ${course.shortTitle}`.length <= TITLE_BUDGET) expect(rendered, where).toContain(` | ${course.shortTitle}`);
      }
    }
  });

  it('asks for a short search title only where a lesson title runs past the budget', () => {
    const lesson = courseLessons(getCourse('gre')!)[0];
    const long = 'A lesson title that runs well past what Google shows in a search result';
    expect(long.length).toBeGreaterThan(TITLE_BUDGET);
    const problems = (changes: Partial<Lesson>) => validateLesson({ ...lesson, ...changes }, 'test').map((issue) => issue.problem);
    expect(problems({ title: long }).some((problem) => problem.includes('metaTitle'))).toBe(true);
    expect(problems({ title: long, metaTitle: 'A short title for search' }).some((problem) => problem.includes('metaTitle'))).toBe(false);
    expect(problems({ title: long, metaTitle: long }).some((problem) => problem.includes('metaTitle'))).toBe(true);
    expect(problems({ metaTitle: undefined }).some((problem) => problem.includes('metaTitle'))).toBe(false);
  });

  it('titles each course page within the budget', () => {
    for (const course of listCourses()) {
      expect(renderedTitle(pageTitle(course.metaTitle)).length, course.slug).toBeLessThanOrEqual(TITLE_BUDGET);
    }
  });

  it('gives lesson pages an English canonical in every interface language', async () => {
    production();
    const [course] = listCourses();
    const lesson = courseLessons(course)[0];
    for (const locale of LOCALES) {
      const { canonical, languages } = await pageAlternates(Promise.resolve({ locale }), lessonPath(course, lesson));
      expect(canonical).toBe(`${SITE}${lessonPath(course, lesson)}`);
      expect(Object.keys(languages).sort()).toEqual(['en', 'x-default']);
    }
  });

  it('maps every course and lesson in llms.txt, each lesson at its canonical address', () => {
    production();
    const text = llmsTxt();
    for (const course of listCourses()) {
      expect(text).toContain(`(${SITE}${coursePath(course)})`);
      for (const lesson of courseLessons(course)) {
        expect(text).toContain(`(${SITE}${canonicalLessonPath(course, lesson)})`);
        if (!isCanonicalLesson(course, lesson)) expect(text).not.toContain(`(${SITE}${lessonPath(course, lesson)})`);
      }
    }
  });
});
