import type { Blueprint, ExamConfig, SectionConfig } from '@/lib/assessment/types';
import { bocconiLawConfig } from './configs/bocconi-law';
import { bocconiUndergraduateConfig } from './configs/bocconi-undergraduate';
import { digitalSatConfig } from './configs/digital-sat';
import { enhancedActConfig } from './configs/enhanced-act';
import { gmatConfig } from './configs/gmat';
import { greConfig } from './configs/gre';
import { lsatConfig } from './configs/lsat';
import { politoTilAConfig } from './configs/polito-til-a';
import { politoTilIConfig } from './configs/polito-til-i';
import { tolcEConfig } from './configs/tolc-e';
import { imatConfig } from './configs/imat';

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

/**
 * Configs that are written but not yet verified first-hand against their
 * official sources. Content validation knows them, so questions can be
 * authored and blind-reviewed against their taxonomy, but nothing else does:
 * they are never seeded, listed, practised or shown. A config moves to
 * `EXAM_CONFIGS` only once every fact in it has a research record under
 * docs/research/ and its `unverified` list holds only what the official
 * sources genuinely leave open.
 */
export const DRAFT_EXAM_CONFIGS: readonly ExamConfig[] = [tolcEConfig, politoTilIConfig, politoTilAConfig, imatConfig];

export type Audience = 'undergraduate' | 'law' | 'graduate';

/** An admission route a hub points to that another hub's config serves. */
export interface HubRoute {
  /** The programme or programme family, as the institution names it. */
  programme: string;
  audience: Audience;
  /** The config that serves this route, or null where no test applies. */
  configKey: string | null;
  note: string;
}

export interface ExamHub {
  slug: string;
  name: string;
  shortName: string;
  /** The shortest unambiguous name, for selectors and chips: "Bocconi", "SAT". */
  label: string;
  /**
   * How to tell this hub's tests apart when it has more than one. Display only:
   * config names are part of the versioned config and are not edited for copy.
   */
  variantLabels?: Record<string, string>;
  publisher: string;
  /** One sentence, used on cards and as the meta description seed. */
  tagline: string;
  audiences: Audience[];
  /** Config keys served by this hub, in display order. */
  configKeys: string[];
  /** Routes into the same institution that another hub's config serves. */
  otherRoutes?: HubRoute[];
  order: number;
}

export const EXAM_HUBS: readonly ExamHub[] = [
  {
    slug: 'bocconi-online-test',
    name: 'Bocconi Online Test',
    shortName: 'Bocconi Test',
    label: 'Bocconi',
    variantLabels: { 'bocconi-undergraduate': 'Undergraduate', 'bocconi-law': 'Law' },
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
    label: 'SAT',
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
    label: 'ACT',
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
    label: 'LSAT',
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
    label: 'GMAT',
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
    label: 'GRE',
    publisher: 'ETS',
    tagline:
      'The shorter GRE General Test: one Analytical Writing task plus two Verbal and two Quantitative sections, about 1 hour 58 minutes.',
    audiences: ['graduate'],
    configKeys: ['gre'],
    order: 6,
  },
];

/**
 * Hubs waiting on draft configs. Not listed, not routed, not in the sitemap:
 * kept here so the institution's routes are written down in one place.
 */
export const DRAFT_EXAM_HUBS: readonly ExamHub[] = [
  {
    slug: 'saa-turin',
    name: 'SAA School of Management, University of Turin',
    shortName: 'SAA Turin',
    label: 'SAA',
    publisher: 'Università degli Studi di Torino',
    tagline:
      'Admission to the University of Turin’s SAA School of Management: the TOLC-E for the Italian-taught business bachelor’s programmes, the SAT for the English-taught Business & Management, and SAA’s own selection for its MBA programmes.',
    audiences: ['undergraduate', 'graduate'],
    configKeys: ['tolc-e'],
    otherRoutes: [
      {
        programme: 'Business & Management (English-taught bachelor’s)',
        audience: 'undergraduate',
        configKey: 'digital-sat',
        note: 'Reported to admit through the SAT rather than the TOLC-E for 2026/27, ranked on the latest SAT result. Unverified: to be confirmed against the University of Turin’s 2026/27 call.',
      },
      {
        programme: 'SAA MBA programmes',
        audience: 'graduate',
        configKey: null,
        note: 'SAA appears to run its own selection for its MBA programmes. Whether it asks for or accepts a GMAT or GRE score is unverified; until SAA’s own pages are read, no test is linked here.',
      },
    ],
    order: 7,
  },
];

const configByKey = new Map(EXAM_CONFIGS.map((c) => [c.examKey, c]));
const draftConfigByKey = new Map(DRAFT_EXAM_CONFIGS.map((c) => [c.examKey, c]));
const hubBySlug = new Map(EXAM_HUBS.map((h) => [h.slug, h]));
const hubByConfigKey = new Map<string, ExamHub>();
for (const hub of EXAM_HUBS) {
  for (const key of hub.configKeys) hubByConfigKey.set(key, hub);
}

export function getExamConfig(examKey: string): ExamConfig | undefined {
  return configByKey.get(examKey);
}

/** A draft config, for content validation only. Never use this to serve learners. */
export function getDraftExamConfig(examKey: string): ExamConfig | undefined {
  return draftConfigByKey.get(examKey);
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
