import type { Blueprint, ExamConfig, SectionConfig } from '@/lib/assessment/types';
import { bocconiGraduateConfig } from './configs/bocconi-graduate';
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
import { tolcFConfig } from './configs/tolc-f';
import { tolcIConfig } from './configs/tolc-i';

/**
 * The exam registry.
 *
 * A *hub* is what a visitor browses. A *config* is what the assessment engine
 * runs. Bocconi has two hubs because bachelor and master's admission are
 * separate tracks with different tests: the Bachelor & Law hub carries the
 * standard and law forms of the Online Bocconi test, which are genuinely
 * different tests, and the Master hub carries the graduate form and points to
 * the GMAT and GRE, which Bocconi accepts in its place. Mixing their
 * requirements would be exactly the confusion the brief warns against.
 */

export const EXAM_CONFIGS: readonly ExamConfig[] = [
  digitalSatConfig,
  enhancedActConfig,
  lsatConfig,
  gmatConfig,
  greConfig,
  bocconiUndergraduateConfig,
  bocconiLawConfig,
  bocconiGraduateConfig,
  politoTilIConfig,
  politoTilAConfig,
  tolcEConfig,
  tolcFConfig,
  tolcIConfig,
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
export const DRAFT_EXAM_CONFIGS: readonly ExamConfig[] = [imatConfig];

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
    // The slug predates the split into two Bocconi hubs and is kept so that
    // existing links keep working.
    slug: 'bocconi-online-test',
    name: 'Bocconi Bachelor & Law admission',
    shortName: 'Bocconi Bachelor & Law',
    label: 'Bocconi Bachelor',
    variantLabels: { 'bocconi-undergraduate': 'Standard', 'bocconi-law': 'Law' },
    publisher: 'Università Bocconi',
    tagline:
      'The Online Bocconi test for Bocconi bachelor and law programmes, in its standard and law forms: 50 questions in 75 minutes, with negative marking and strictly forward-only navigation.',
    audiences: ['undergraduate', 'law'],
    configKeys: ['bocconi-undergraduate', 'bocconi-law'],
    otherRoutes: [
      {
        programme: 'Bachelor programmes (Undergraduate School)',
        audience: 'undergraduate',
        configKey: 'digital-sat',
        note: 'Bocconi also accepts the SAT. A total below 1040, or a section score below 520, is not considered; scores obtained before 2022 are not accepted. The Bachelor in Mathematical and Computing Sciences for Artificial Intelligence also requires at least 600 out of 800 in SAT Math.',
      },
      {
        programme: 'Bachelor programmes (Undergraduate School)',
        audience: 'undergraduate',
        configKey: 'enhanced-act',
        note: 'Bocconi also accepts the ACT. A composite below 19 is not considered; scores obtained before 2021 are not accepted. The Bachelor in Mathematical and Computing Sciences for Artificial Intelligence also requires at least 25 out of 36 in ACT Math.',
      },
      {
        programme: 'Law programmes (Integrated Master of Arts in Law, Bachelor in Global Law)',
        audience: 'law',
        configKey: 'lsat',
        note: 'Bocconi’s Law School also accepts the LSAT. A score below 147 out of 180 is not considered. The LSAT counts for the law programmes only.',
      },
    ],
    order: 1,
  },
  {
    slug: 'bocconi-master',
    name: 'Bocconi Master’s admission',
    shortName: 'Bocconi Master',
    label: 'Bocconi Master',
    publisher: 'Università Bocconi',
    tagline:
      'Admission to Bocconi Master of Science and MA programmes: the graduate Online Bocconi test (50 questions in 75 minutes, −0.25 for a wrong answer, 15 out of 50 to be considered), or the GMAT or GRE instead.',
    audiences: ['graduate'],
    configKeys: ['bocconi-graduate'],
    otherRoutes: [
      {
        programme: 'Master of Science and MA programmes',
        audience: 'graduate',
        configKey: 'gmat',
        note: 'Bocconi accepts the GMAT in place of its own test, in test-centre or online format. The GMAT Exam needs at least 500 out of 800 and the GMAT Focus Edition at least 485 out of 805. Scores from the current and previous editions are accepted if no more than five years old.',
      },
      {
        programme: 'Master of Science and MA programmes',
        audience: 'graduate',
        configKey: 'gre',
        note: 'Bocconi accepts the GRE General Test and the Shorter GRE in place of its own test, but not the GRE General Test at Home. Scores are accepted if no more than five years old. Bocconi sets a combined Verbal and Quantitative threshold that we could not verify, so it is not shown here; check it on Bocconi’s own page.',
      },
      {
        programme: 'PPA and GLOBE',
        audience: 'graduate',
        configKey: null,
        note: 'These two programmes require no selection test.',
      },
    ],
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
    order: 7,
  },
  {
    slug: 'politecnico-di-torino-til',
    name: 'Politecnico di Torino TIL',
    shortName: 'PoliTo TIL',
    label: 'PoliTo',
    variantLabels: { 'polito-til-i': 'Engineering (TIL-I)', 'polito-til-a': 'Architecture (TIL-A)' },
    publisher: 'Politecnico di Torino',
    tagline:
      'Politecnico di Torino’s in-person admission tests: TIL-I for Engineering, 42 questions in 90 minutes, and TIL-A for Architecture, 50 questions in 100 minutes, both with a penalty for wrong answers.',
    audiences: ['undergraduate'],
    configKeys: ['polito-til-i', 'polito-til-a'],
    order: 8,
  },
  {
    slug: 'cisia-tolc',
    name: 'CISIA TOLC',
    shortName: 'TOLC',
    label: 'TOLC',
    variantLabels: { 'tolc-e': 'Economics (TOLC-E)', 'tolc-f': 'Pharmacy (TOLC-F)', 'tolc-i': 'Engineering (TOLC-I)' },
    publisher: 'CISIA',
    tagline:
      'The online admission tests many Italian universities use: TOLC-E for economics, 36 questions in 90 minutes; TOLC-F for pharmacy, 50 questions in 72 minutes; and TOLC-I for engineering, 50 questions in 110 minutes. Each university sets its own pass mark.',
    audiences: ['undergraduate'],
    configKeys: ['tolc-e', 'tolc-f', 'tolc-i'],
    order: 9,
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
    order: 10,
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

/**
 * The name to put before "test": "Bocconi" for the Bocconi Test, so a page
 * says "your free Bocconi test" rather than "your free Bocconi Test test".
 */
export function examTestName(config: Pick<ExamConfig, 'shortName'>): string {
  return config.shortName.replace(/\s+test$/i, '');
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
