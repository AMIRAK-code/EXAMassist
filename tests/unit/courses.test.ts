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
  courseLessons,
  coursePath,
  getLesson,
  isPublished,
  lessonPath,
  listAllCourses,
  listCourses,
  practicePath,
} from '@/lib/courses';
import { internalLinks, lessonTexts, validateCourse } from '@/lib/courses/validate';
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

  it('lists the course index in every language and each course and lesson once, in English', () => {
    production();
    const urls = sitemap().map((entry) => entry.url);
    for (const locale of LOCALES) expect(urls).toContain(`${SITE}${locale === 'en' ? '' : `/${locale}`}/courses`);
    for (const course of listCourses()) {
      expect(urls).toContain(`${SITE}${coursePath(course)}`);
      for (const lesson of courseLessons(course)) {
        expect(urls).toContain(`${SITE}${lessonPath(course, lesson)}`);
        expect(urls).not.toContain(`${SITE}/it${lessonPath(course, lesson)}`);
      }
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

  it('maps every course and lesson in llms.txt', () => {
    production();
    const text = llmsTxt();
    for (const course of listCourses()) {
      expect(text).toContain(`(${SITE}${coursePath(course)})`);
      for (const lesson of courseLessons(course)) expect(text).toContain(`(${SITE}${lessonPath(course, lesson)})`);
    }
  });
});
