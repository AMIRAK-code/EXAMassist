import { EXAM_HUBS, getHub } from '@/lib/exams/registry';
import { listGuides } from '@/lib/content/guides';

/**
 * What each share image says. scripts/og-images.ts draws one 1200 × 630 card
 * per entry into public/og/<key>.png, and pages point at them through
 * shareImages() in src/lib/site.ts.
 *
 * Every card carries the independence notice in short: an image shared on its
 * own must not read as the test maker's.
 */
export interface ShareCard {
  key: string;
  eyebrow: string;
  title: string;
  footnote: string;
}

export function shareCards(): ShareCard[] {
  const hubs = [...EXAM_HUBS].sort((a, b) => a.order - b.order);
  return [
    {
      key: 'site',
      eyebrow: hubs.map((hub) => hub.label).join(' · '),
      title: 'Admission test preparation, verified against official sources',
      footnote: 'Independent of every test maker',
    },
    ...hubs.map((hub) => ({
      key: `exam-${hub.slug}`,
      eyebrow: hub.slug === 'bocconi-online-test' ? 'Practice questions · free test · official rules' : 'Format · timing · scoring · practice',
      title: hub.slug === 'bocconi-online-test' ? `${hub.name} preparation` : `${hub.name}: format, timing and scoring`,
      footnote: `Independent · not affiliated with ${hub.publisher}`,
    })),
    ...listGuides().map((guide) => {
      const hub = getHub(guide.hubSlug);
      return {
        key: `guide-${guide.slug}`,
        eyebrow: hub ? `Guide · ${hub.name}` : 'Guide',
        title: guide.title,
        footnote: hub ? `Independent · not affiliated with ${hub.publisher}` : 'Independent of every test maker',
      };
    }),
  ];
}
