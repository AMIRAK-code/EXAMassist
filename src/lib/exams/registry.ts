import type { Blueprint, ExamConfig, SectionConfig } from '@/lib/assessment/types';
import { bocconiLawConfig } from './configs/bocconi-law';
import { bocconiUndergraduateConfig } from './configs/bocconi-undergraduate';
import { digitalSatConfig } from './configs/digital-sat';
import { enhancedActConfig } from './configs/enhanced-act';
import { gmatConfig } from './configs/gmat';
import { greConfig } from './configs/gre';
import { lsatConfig } from './configs/lsat';

/**
 * The exam registry.
 *
 * A *hub* is what a visitor browses (six of them, as the brief requires). A
 * *config* is what the assessment engine runs. The Bocconi hub carries two
 * configs because the undergraduate and law forms are genuinely different
 * tests, and mixing their requirements would be exactly the confusion the
 * brief warns against.
 */

export const EXAM_CONFIGS: readonly ExamConfig[] = [
  digitalSatConfig,
  enhancedActConfig,
  lsatConfig,
  gmatConfig,
  greConfig,
  bocconiUndergraduateConfig,
  bocconiLawConfig,
];

export type Audience = 'undergraduate' | 'law' | 'graduate';

export interface ExamHub {
  slug: string;
  name: string;
  shortName: string;
  publisher: string;
  /** One sentence, used on cards and as the meta description seed. */
  tagline: string;
  audiences: Audience[];
  /** Config keys served by this hub, in display order. */
  configKeys: string[];
  order: number;
}

export const EXAM_HUBS: readonly ExamHub[] = [
  {
    slug: 'bocconi-online-test',
    name: 'Bocconi Online Test',
    shortName: 'Bocconi Test',
    publisher: 'Università Bocconi',
    tagline:
      'The online admission test for Bocconi bachelor and law programmes: 50 questions in 75 minutes, with negative marking and strictly forward-only navigation.',
    audiences: ['undergraduate', 'law'],
    configKeys: ['bocconi-undergraduate', 'bocconi-law'],
    order: 1,
  },
  {
    slug: 'digital-sat',
    name: 'Digital SAT',
    shortName: 'SAT',
    publisher: 'College Board',
    tagline:
      'The two-stage adaptive digital SAT: two Reading and Writing modules and two Math modules, 2 hours 14 minutes of testing.',
    audiences: ['undergraduate'],
    configKeys: ['digital-sat'],
    order: 2,
  },
  {
    slug: 'enhanced-act',
    name: 'Enhanced ACT',
    shortName: 'ACT',
    publisher: 'ACT',
    tagline:
      'The shorter enhanced ACT: English, Mathematics and Reading as the core test, with Science and Writing optional.',
    audiences: ['undergraduate'],
    configKeys: ['enhanced-act'],
    order: 3,
  },
  {
    slug: 'lsat',
    name: 'LSAT',
    shortName: 'LSAT',
    publisher: 'LSAC',
    tagline:
      'The current LSAT: four 35-minute sections of Logical Reasoning and Reading Comprehension. Analytical Reasoning was removed in August 2024.',
    audiences: ['law'],
    configKeys: ['lsat'],
    order: 4,
  },
  {
    slug: 'gmat',
    name: 'GMAT',
    shortName: 'GMAT',
    publisher: 'GMAC',
    tagline:
      'The current GMAT, previously branded the Focus Edition: Quantitative Reasoning, Verbal Reasoning and Data Insights, 64 questions in 2 hours 15 minutes.',
    audiences: ['graduate'],
    configKeys: ['gmat'],
    order: 5,
  },
  {
    slug: 'gre',
    name: 'GRE General Test',
    shortName: 'GRE',
    publisher: 'ETS',
    tagline:
      'The shorter GRE General Test: one Analytical Writing task plus two Verbal and two Quantitative sections, about 1 hour 58 minutes.',
    audiences: ['graduate'],
    configKeys: ['gre'],
    order: 6,
  },
];

const configByKey = new Map(EXAM_CONFIGS.map((c) => [c.examKey, c]));
const hubBySlug = new Map(EXAM_HUBS.map((h) => [h.slug, h]));
const hubByConfigKey = new Map<string, ExamHub>();
for (const hub of EXAM_HUBS) {
  for (const key of hub.configKeys) hubByConfigKey.set(key, hub);
}

export function getExamConfig(examKey: string): ExamConfig | undefined {
  return configByKey.get(examKey);
}

/** Throws rather than returning undefined, for call sites that cannot continue. */
export function requireExamConfig(examKey: string): ExamConfig {
  const config = configByKey.get(examKey);
  if (!config) throw new Error(`Unknown exam configuration "${examKey}"`);
  return config;
}

export function getHub(slug: string): ExamHub | undefined {
  return hubBySlug.get(slug);
}

export function getHubForConfig(examKey: string): ExamHub | undefined {
  return hubByConfigKey.get(examKey);
}

export function getConfigsForHub(slug: string): ExamConfig[] {
  const hub = hubBySlug.get(slug);
  if (!hub) return [];
  return hub.configKeys.map((key) => requireExamConfig(key));
}

export function listHubs(): ExamHub[] {
  return [...EXAM_HUBS].sort((a, b) => a.order - b.order);
}

export function getBlueprint(config: ExamConfig, blueprintId: string): Blueprint | undefined {
  return config.blueprints.find((b) => b.id === blueprintId);
}

export function getSection(config: ExamConfig, sectionKey: string): SectionConfig | undefined {
  return config.sections.find((s) => s.key === sectionKey);
}

export function getDomain(config: ExamConfig, domainSlug: string) {
  return config.domains.find((d) => d.slug === domainSlug);
}

/** Domain and skill display names, for results breakdowns. */
export function labelsFor(config: ExamConfig): {
  domains: Record<string, string>;
  skills: Record<string, string>;
  sections: Record<string, string>;
} {
  const domains: Record<string, string> = {};
  const skills: Record<string, string> = {};
  const sections: Record<string, string> = {};
  for (const section of config.sections) sections[section.key] = section.name;
  for (const domain of config.domains) {
    domains[domain.slug] = domain.name;
    for (const skill of domain.skills) skills[skill.slug] = skill.name;
  }
  return { domains, skills, sections };
}

/** Every skill slug in an exam, used by content validation and study plans. */
export function allSkillSlugs(config: ExamConfig): string[] {
  return config.domains.flatMap((d) => d.skills.map((s) => s.slug));
}
