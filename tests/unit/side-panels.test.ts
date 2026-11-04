import { describe, expect, it } from 'vitest';
import { listGuides } from '@/lib/content/guides';
import { browseTree } from '@/lib/content/browse';
import { listHubs } from '@/lib/exams/registry';
import { hubForPath, showsPanels } from '@/components/site/panel-paths';

/**
 * The site's side panels: the browse list comes from the registry and the
 * guides list, never a copy of them, and the panels stay off the pages where
 * they would distract or crowd (the test itself, landing pages, sign-in).
 */

describe('the browse panel', () => {
  const tree = browseTree();

  it('lists every hub in registry order, each with its pages and practice for every test it serves', () => {
    expect(tree.hubs.map((hub) => hub.slug)).toEqual(listHubs().map((hub) => hub.slug));
    for (const hub of listHubs()) {
      const entry = tree.hubs.find((h) => h.slug === hub.slug)!;
      expect(entry.links.map((link) => link.href)).toEqual([
        `/exams/${hub.slug}`,
        `/exams/${hub.slug}/format`,
        ...hub.configKeys.map((key) => `/practice/${key}`),
      ]);
    }
  });

  it('names the test on a practice link only where a hub serves more than one', () => {
    const bocconi = tree.hubs.find((hub) => hub.slug === 'bocconi-online-test')!;
    expect(bocconi.links.filter((link) => link.kind === 'practice').map((link) => link.variant)).toEqual(['Standard', 'Law']);
    const single = tree.hubs.find((hub) => hub.configKeys.length === 1)!;
    expect(single.links.find((link) => link.kind === 'practice')!.variant).toBeNull();
  });

  it('lists every guide, newest first as the guides page does, with its hub', () => {
    expect(tree.guides.map((guide) => guide.href)).toEqual(listGuides().map((guide) => `/guides/${guide.slug}`));
    expect(tree.guides.every((guide) => guide.hubLabel !== null)).toBe(true);
  });

  it('opens the group of the hub the page belongs to', () => {
    expect(hubForPath('/exams/gmat', tree)).toBe('gmat');
    expect(hubForPath('/exams/bocconi-online-test/format', tree)).toBe('bocconi-online-test');
    expect(hubForPath('/practice/bocconi-law', tree)).toBe('bocconi-online-test');
    expect(hubForPath('/practice/%E0%A4%A', tree)).toBeNull();
    expect(hubForPath('/exams', tree)).toBeNull();
    expect(hubForPath('/exams/not-a-hub', tree)).toBeNull();
    expect(hubForPath('/guides/x', tree)).toBeNull();
  });
});

describe('where the panels appear', () => {
  it('appear on exam, guide, learner and results pages', () => {
    for (const path of [
      '/exams',
      '/exams/gmat',
      '/exams/gmat/format',
      '/practice/gmat',
      '/guides',
      '/guides/some-guide',
      '/dashboard',
      '/review',
      '/study-plan',
      '/study-plan/progress',
      '/attempt/abc/results',
      '/attempt/abc/results/3',
      '/about/how-scoring-works',
      '/account',
    ]) {
      expect(showsPanels(path), path).toBe(true);
    }
  });

  it('stay off the test itself, the landing pages, sign-in and checkout, and the staff area', () => {
    for (const path of [
      '/',
      '/pricing',
      '/attempt/abc',
      '/attempt/abc/',
      '/free-test/gmat',
      '/start/gmat',
      '/checkout',
      '/checkout/complete',
      '/sign-in',
      '/sign-up',
      '/forgot-password',
      '/verify-email',
      '/admin',
      '/admin/users',
    ]) {
      expect(showsPanels(path), path).toBe(false);
    }
  });
});
