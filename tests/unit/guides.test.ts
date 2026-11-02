import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { listGuides, type Guide } from '@/lib/content/guides';
import { EXAM_HUBS } from '@/lib/exams/registry';
import { listHubContent, type HubContent } from '@/lib/exams/hub-content';
import type { SampleQuestionSet } from '@/lib/content/guides';

/**
 * The public guides and the exam hubs' editorial content: every link inside
 * them leads somewhere, and every published sample question can be marked
 * and explained.
 */

/** All Markdown a set of sample questions renders. */
function samplesMarkdown(set: SampleQuestionSet | undefined): string[] {
  const parts: string[] = [];
  for (const section of set?.sections ?? []) {
    parts.push(section.introMd);
    for (const q of section.questions) parts.push(q.stimulusMd ?? '', q.stemMd, q.workingMd, q.lesson, ...q.options.flatMap((o) => [o.text, o.note]));
  }
  parts.push(set?.afterMd ?? '');
  return parts;
}

/** All Markdown a guide renders, sample questions included. */
function markdownOf(guide: Guide): string {
  return [guide.bodyMd, ...samplesMarkdown(guide.samples)].join('\n');
}

/** All Markdown an exam hub's editorial content renders. */
function hubMarkdownOf(content: HubContent): string {
  return [
    content.leadMd,
    content.status?.bodyMd ?? '',
    content.routes?.bodyMd ?? '',
    content.detailsNote?.bodyMd ?? '',
    content.samples?.introMd ?? '',
    ...samplesMarkdown(content.samples?.set),
  ].join('\n');
}

/** Every page's Markdown, with a name for failures: guides and exam hubs. */
const PAGES = [
  ...listGuides().map((guide) => ({ name: guide.slug, markdown: markdownOf(guide), sources: guide.sources })),
  ...listHubContent().map(([slug, content]) => ({ name: `hub ${slug}`, markdown: hubMarkdownOf(content), sources: content.sources })),
];

const PUBLIC_PATHS = new Set([
  '/', '/exams', '/guides', '/pricing',
  '/about/editorial-standards', '/about/how-scoring-works', '/about/privacy', '/about/support', '/about/terms',
  ...EXAM_HUBS.flatMap((hub) => [`/exams/${hub.slug}`, `/exams/${hub.slug}/format`]),
  ...listGuides().map((guide) => `/guides/${guide.slug}`),
]);

describe('guide and exam hub links', () => {
  it('point only at pages that exist, or at secure external sources and our own mail', () => {
    for (const page of PAGES) {
      const links = [...page.markdown.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
      for (const link of links) {
        if (link.startsWith('/')) {
          const [route] = link.split('#');
          expect(PUBLIC_PATHS.has(route), `${page.name}: ${link}`).toBe(true);
        } else if (link.startsWith('mailto:')) {
          expect(link, page.name).toMatch(/^mailto:[a-z]+@uniexamer\.com$/);
        } else {
          expect(link, `${page.name}: ${link}`).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it('cite every official source they link to in their sources list', () => {
    for (const page of PAGES) {
      const sources = new Set(page.sources.map((s) => s.url));
      const official = [...page.markdown.matchAll(/\]\((https:\/\/[^)\s]*(?:unibocconi|polito|cisiaonline|testcisia)\.it[^)\s]*)\)/g)].map((m) => m[1]);
      for (const url of official) expect(sources.has(url), `${page.name}: ${url}`).toBe(true);
    }
  });

  it('point at sample anchors that exist on the exam hub they name', () => {
    const anchors = new Map(
      listHubContent().map(([slug, c]) => [
        `/exams/${slug}`,
        new Set(c.samples ? [c.samples.id, ...c.samples.set.sections.flatMap((s) => [s.id, ...s.questions.map((q) => q.id)])] : []),
      ]),
    );
    for (const page of PAGES) {
      for (const [, route, anchor] of page.markdown.matchAll(/\]\((\/exams\/[^)#\s]+)#([^)\s]+)\)/g)) {
        expect(anchors.get(route)?.has(anchor), `${page.name}: ${route}#${anchor}`).toBe(true);
      }
    }
  });
});

describe('published sample questions', () => {
  // Guides and exam hubs both publish them; every set is held to the same rules.
  const samples = [
    ...listGuides().filter((guide) => guide.samples).map((guide) => ({ slug: guide.slug, samples: guide.samples })),
    ...listHubContent().filter(([, c]) => c.samples).map(([slug, c]) => ({ slug: `hub ${slug}`, samples: c.samples!.set })),
  ];

  it('exist, so this suite checks something', () => {
    expect(samples.length).toBeGreaterThan(0);
  });

  it('each have exactly one key among their options, and explain every wrong option', () => {
    for (const guide of samples) {
      for (const q of guide.samples!.sections.flatMap((s) => s.questions)) {
        const ids = q.options.map((o) => o.id);
        expect(new Set(ids).size, q.id).toBe(ids.length);
        expect(ids, q.id).toContain(q.answer);
        expect(q.options.length, q.id).toBeGreaterThanOrEqual(3);
        for (const option of q.options) {
          if (option.id === q.answer) expect(option.note, `${q.id} key`).toBe('');
          else expect(option.note.length, `${q.id} ${option.id}`).toBeGreaterThan(20);
        }
        expect(q.workingMd.length, q.id).toBeGreaterThan(40);
        expect(q.lesson.length, q.id).toBeGreaterThan(40);
      }
    }
  });

  it('use anchors that are unique on their page', () => {
    for (const guide of samples) {
      const anchors = guide.samples!.sections.flatMap((s) => [s.id, ...s.questions.map((q) => q.id)]);
      expect(new Set(anchors).size, guide.slug).toBe(anchors.length);
    }
  });

  it('never repeat a stem from the question bank, so publishing an answer spoils no session', () => {
    const bank = fs.readdirSync(path.resolve('content/questions'), { recursive: true, encoding: 'utf8' })
      .filter((file) => file.endsWith('.json'))
      .map((file) => fs.readFileSync(path.resolve('content/questions', file), 'utf8').toLowerCase());
    for (const guide of samples) {
      for (const q of guide.samples!.sections.flatMap((s) => s.questions)) {
        // A distinctive run of words from the stem (or stimulus) must not appear in any bank file.
        const words = (q.stimulusMd ?? q.stemMd).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
        const probe = words.slice(2, 10).join(' ');
        if (words.length < 10) continue;
        expect(bank.some((file) => file.replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').includes(probe)), `${q.id}: "${probe}"`).toBe(false);
      }
    }
  }, 30_000);
});
