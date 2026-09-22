import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  questionSchema,
  stimulusSchema,
  validateQuestion,
  type ContentIssue,
  type Question,
  type Stimulus,
} from './question-schema';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';

/**
 * Loads and validates the file-based question bank.
 *
 * Content lives in JSON files rather than only in the database so it can be
 * reviewed in pull requests, diffed, and re-seeded reproducibly.
 */

export const QUESTIONS_DIR = path.resolve('content/questions');
export const STIMULI_DIR = path.resolve('content/stimuli');

export interface LoadedQuestion {
  file: string;
  question: Question;
}

export interface LoadedStimulus {
  file: string;
  stimulus: Stimulus;
}

export interface FileIssue extends ContentIssue {
  file: string;
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.json')) out.push(full);
  }
  return out.sort();
}

export function contentHash(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 32);
}

export interface LoadResult {
  questions: LoadedQuestion[];
  stimuli: LoadedStimulus[];
  issues: FileIssue[];
}

export function loadContent(): LoadResult {
  const issues: FileIssue[] = [];
  const questions: LoadedQuestion[] = [];
  const stimuli: LoadedStimulus[] = [];

  for (const file of walk(STIMULI_DIR)) {
    const rel = path.relative(process.cwd(), file);
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      issues.push({ file: rel, level: 'error', code: 'bad-json', message: String(error) });
      continue;
    }
    const parsed = stimulusSchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        issues.push({
          file: rel,
          level: 'error',
          code: 'schema',
          message: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
        });
      }
      continue;
    }
    stimuli.push({ file: rel, stimulus: parsed.data });
  }

  const stimulusIds = new Set(stimuli.map((s) => s.stimulus.id));

  for (const file of walk(QUESTIONS_DIR)) {
    const rel = path.relative(process.cwd(), file);
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      issues.push({ file: rel, level: 'error', code: 'bad-json', message: String(error) });
      continue;
    }
    const parsed = questionSchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        issues.push({
          file: rel,
          level: 'error',
          code: 'schema',
          message: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
        });
      }
      continue;
    }

    const question = parsed.data;
    questions.push({ file: rel, question });

    for (const issue of validateQuestion(question, { stimulusIds })) {
      issues.push({ ...issue, file: rel });
    }

    // The filename must match the id, so a file is easy to find from a result.
    const expected = `${question.id}.json`;
    if (path.basename(file) !== expected) {
      issues.push({
        file: rel,
        level: 'error',
        code: 'filename-mismatch',
        message: `File should be named ${expected} to match the question id.`,
      });
    }

    // Taxonomy must exist in the exam configuration.
    const config = getExamConfig(question.examKey);
    if (!config) {
      issues.push({
        file: rel,
        level: 'error',
        code: 'unknown-exam',
        message: `examKey "${question.examKey}" is not a configured exam.`,
      });
      continue;
    }
    const section = config.sections.find((s) => s.key === question.sectionKey);
    if (!section) {
      issues.push({
        file: rel,
        level: 'error',
        code: 'unknown-section',
        message: `sectionKey "${question.sectionKey}" is not in ${question.examKey}.`,
      });
    }
    const domain = config.domains.find((d) => d.slug === question.domainSlug);
    if (!domain) {
      issues.push({
        file: rel,
        level: 'error',
        code: 'unknown-domain',
        message: `domainSlug "${question.domainSlug}" is not in ${question.examKey}.`,
      });
    } else {
      if (domain.sectionKey !== question.sectionKey) {
        issues.push({
          file: rel,
          level: 'error',
          code: 'domain-section-mismatch',
          message: `domain "${domain.slug}" belongs to section "${domain.sectionKey}", not "${question.sectionKey}".`,
        });
      }
      if (!domain.skills.some((s) => s.slug === question.skillSlug)) {
        issues.push({
          file: rel,
          level: 'error',
          code: 'unknown-skill',
          message: `skillSlug "${question.skillSlug}" is not a skill of domain "${domain.slug}".`,
        });
      }
    }
    if (!section?.responseTypes.includes(question.responseType)) {
      issues.push({
        file: rel,
        level: 'warning',
        code: 'unexpected-response-type',
        message: `responseType "${question.responseType}" is not listed for section "${question.sectionKey}".`,
      });
    }

    const stimulus = question.stimulusRef
      ? stimuli.find((s) => s.stimulus.id === question.stimulusRef?.id)
      : undefined;
    if (question.stimulusRef && stimulus && stimulus.stimulus.examKey !== question.examKey) {
      issues.push({
        file: rel,
        level: 'error',
        code: 'stimulus-exam-mismatch',
        message: 'A question may not reference a stimulus from a different exam.',
      });
    }
  }

  // Duplicate ids across files.
  const seen = new Map<string, string>();
  for (const { file, question } of questions) {
    const prior = seen.get(question.id);
    if (prior) {
      issues.push({
        file,
        level: 'error',
        code: 'duplicate-id',
        message: `Question id "${question.id}" is also used by ${prior}.`,
      });
    } else {
      seen.set(question.id, file);
    }
  }

  return { questions, stimuli, issues };
}

export interface CoverageSummary {
  examKey: string;
  published: number;
  draft: number;
  inReview: number;
  quarantined: number;
  retired: number;
  domainsCovered: number;
  domainsTotal: number;
  missingDomains: string[];
}

export function summariseCoverage(questions: LoadedQuestion[]): CoverageSummary[] {
  return EXAM_CONFIGS.map((config) => {
    const mine = questions.filter((q) => q.question.examKey === config.examKey);
    const published = mine.filter((q) => q.question.state === 'published');
    const covered = new Set(published.map((q) => q.question.domainSlug));
    const allDomains = config.domains.map((d) => d.slug);
    return {
      examKey: config.examKey,
      published: published.length,
      draft: mine.filter((q) => q.question.state === 'draft').length,
      inReview: mine.filter((q) => q.question.state === 'in_review').length,
      quarantined: mine.filter((q) => q.question.state === 'quarantined').length,
      retired: mine.filter((q) => q.question.state === 'retired').length,
      domainsCovered: covered.size,
      domainsTotal: allDomains.length,
      missingDomains: allDomains.filter((d) => !covered.has(d)),
    };
  });
}
