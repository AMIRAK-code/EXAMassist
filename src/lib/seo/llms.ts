import { EXAM_HUBS, getConfigsForHub } from '@/lib/exams/registry';
import { listGuides } from '@/lib/content/guides';
import { INDEPENDENCE_NOTICE, SITE, absoluteUrl } from '@/lib/site';

/**
 * /llms.txt (https://llmstxt.org): a plain Markdown map of the public pages
 * for AI tools and agents that look for one.
 *
 * Google says it uses no such file and that one neither helps nor harms
 * (docs/research/seo-and-crawler-policy.md, checklist item 19); some other
 * tools do read it. Nothing on the site may claim it earns AI citations. It is
 * built from the same registry and guides as the sitemap, so it cannot list a
 * page the sitemap does not, or drift from the pages' own titles.
 */
export function llmsTxt(): string {
  const hubs = [...EXAM_HUBS].sort((a, b) => a.order - b.order);
  const link = (label: string, path: string, note: string) => `- [${label}](${absoluteUrl(path)}): ${note}`;

  return [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description} Also known as ${SITE.alternateNames.slice(0, -1).join(', ')} and ${SITE.alternateNames.at(-1)}.`,
    '',
    INDEPENDENCE_NOTICE,
    '',
    'Each exam page and format guide says when its facts were last checked against the test maker. Registration, dates and fees change: confirm them with the test maker.',
    '',
    '## Exams',
    '',
    ...hubs.map((hub) => link(hub.name, `/exams/${hub.slug}`, hub.tagline)),
    '',
    '## Format and scoring guides',
    '',
    ...hubs.map((hub) => {
      const verifiedOn = getConfigsForHub(hub.slug)[0]?.verifiedOn;
      const checked = verifiedOn ? `, verified against ${hub.publisher} on ${verifiedOn}` : '';
      return link(
        `${hub.name} format and scoring guide`,
        `/exams/${hub.slug}/format`,
        `sections, question counts, timing, navigation rules, calculator policy and scoring${checked}.`,
      );
    }),
    '',
    '## Guides',
    '',
    ...listGuides().map((guide) => link(guide.title, `/guides/${guide.slug}`, guide.description)),
    '',
    `## About ${SITE.name}`,
    '',
    link('Editorial standards', '/about/editorial-standards', 'how the practice questions are written, independently solved and checked before publication.'),
    link('How scoring works', '/about/how-scoring-works', 'what a practice score means, and what it cannot tell you about an official score.'),
    link('Support', '/about/support', 'how to reach the team: support mail is answered by a person within 48 hours, not by an AI agent.'),
    '',
    '## Optional',
    '',
    link('Pricing', '/pricing', 'plans and prices.'),
    link('Privacy', '/about/privacy', 'what is collected and why.'),
    link('Terms', '/about/terms', 'terms of use.'),
    '',
  ].join('\n');
}
