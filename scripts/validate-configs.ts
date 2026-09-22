/**
 * Validates every exam configuration in src/lib/exams/configs/ against the
 * shared schema in src/lib/assessment/types.ts, plus cross-field rules a schema
 * cannot express.
 *
 *   npx tsx scripts/validate-configs.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { examConfigSchema, type ExamConfig } from '../src/lib/assessment/types';

const CONFIG_DIR = path.resolve('src/lib/exams/configs');

interface Problem {
  file: string;
  level: 'error' | 'warning';
  message: string;
}

const problems: Problem[] = [];
const loaded: ExamConfig[] = [];

function crossCheck(file: string, config: ExamConfig): void {
  const err = (message: string) => problems.push({ file, level: 'error', message });
  const warn = (message: string) => problems.push({ file, level: 'warning', message });

  const sectionKeys = new Set(config.sections.map((s) => s.key));
  const domainSlugs = new Set(config.domains.map((d) => d.slug));

  for (const domain of config.domains) {
    if (!sectionKeys.has(domain.sectionKey)) {
      err(`domain "${domain.slug}" references unknown section "${domain.sectionKey}"`);
    }
  }

  const skillSlugs = new Set<string>();
  for (const domain of config.domains) {
    for (const skill of domain.skills) {
      if (skillSlugs.has(skill.slug)) err(`duplicate skill slug "${skill.slug}"`);
      skillSlugs.add(skill.slug);
    }
  }

  const blueprintIds = new Set<string>();
  for (const blueprint of config.blueprints) {
    if (blueprintIds.has(blueprint.id)) err(`duplicate blueprint id "${blueprint.id}"`);
    blueprintIds.add(blueprint.id);

    for (const part of blueprint.parts) {
      if (!sectionKeys.has(part.sectionKey)) {
        err(`blueprint "${blueprint.id}" part "${part.key}" references unknown section "${part.sectionKey}"`);
      }
      for (const domain of part.selection.domains) {
        if (!domainSlugs.has(domain)) {
          err(`blueprint "${blueprint.id}" part "${part.key}" references unknown domain "${domain}"`);
        }
      }
      for (const skill of part.selection.skills) {
        if (!skillSlugs.has(skill)) {
          err(`blueprint "${blueprint.id}" part "${part.key}" references unknown skill "${skill}"`);
        }
      }
      const mix = part.selection.difficultyMix;
      if (mix && mix.easy + mix.medium + mix.hard !== part.itemCount) {
        err(
          `blueprint "${blueprint.id}" part "${part.key}": difficulty mix sums to ` +
            `${mix.easy + mix.medium + mix.hard} but itemCount is ${part.itemCount}`,
        );
      }
      if (blueprint.timing === 'per_part' && part.timeLimitSeconds === null) {
        err(`blueprint "${blueprint.id}" is per_part timed but part "${part.key}" has no time limit`);
      }
      if (blueprint.timing === 'untimed' && part.timeLimitSeconds !== null) {
        err(`blueprint "${blueprint.id}" is untimed but part "${part.key}" sets a time limit`);
      }
    }

    if (blueprint.timing === 'overall' && blueprint.overallTimeLimitSeconds === null) {
      err(`blueprint "${blueprint.id}" is overall-timed but has no overallTimeLimitSeconds`);
    }

    // Honesty gate: a blueprint may only call itself exam-accurate if the exam
    // has no unverified rules and, for simulations, full simulation is enabled.
    if (blueprint.fidelity === 'exam_accurate') {
      if (config.unverified.length > 0) {
        err(
          `blueprint "${blueprint.id}" claims exam_accurate but the exam has ` +
            `${config.unverified.length} unverified rule(s); use "approximation"`,
        );
      }
      if (blueprint.mode === 'simulation' && !config.capabilities.fullSimulation.available) {
        err(`blueprint "${blueprint.id}" claims exam_accurate but fullSimulation is unavailable`);
      }
    }

    if (blueprint.mode === 'simulation' && !config.capabilities.fullSimulation.available) {
      warn(
        `blueprint "${blueprint.id}" is a simulation while fullSimulation is unavailable; ` +
          `it will be hidden at runtime`,
      );
    }

    for (const part of blueprint.parts) {
      if (part.adaptive?.enabled && !config.capabilities.adaptiveRouting.available) {
        err(
          `blueprint "${blueprint.id}" part "${part.key}" enables adaptive routing while ` +
            `capabilities.adaptiveRouting is unavailable`,
        );
      }
    }
  }

  if (config.scoring.scaledEstimate.enabled && !config.capabilities.scaledScoreEstimate.available) {
    err('scoring.scaledEstimate is enabled but capabilities.scaledScoreEstimate is unavailable');
  }

  if (config.sources.length === 0) err('config has no sources');
  for (const source of config.sources) {
    if (!/^https?:\/\//.test(source.url)) warn(`source "${source.label}" has a non-URL reference`);
  }
}

async function main(): Promise<void> {
  /** Optional argv filter so a single config can be validated in isolation. */
  const only = process.argv[2];

  const files = fs.existsSync(CONFIG_DIR)
    ? fs
        .readdirSync(CONFIG_DIR)
        .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
        .filter((f) => (only ? f.includes(only) : true))
        .sort()
    : [];

  if (files.length === 0) {
    console.error(`No exam configs found in ${CONFIG_DIR}`);
    process.exit(1);
  }

  for (const file of files) {
    const url = pathToFileURL(path.join(CONFIG_DIR, file)).href;
    let module: Record<string, unknown>;
    try {
      module = (await import(url)) as Record<string, unknown>;
    } catch (error) {
      problems.push({ file, level: 'error', message: `failed to import: ${String(error)}` });
      continue;
    }

    const exported = Object.values(module).filter(
      (value): value is Record<string, unknown> =>
        typeof value === 'object' && value !== null && 'examKey' in value,
    );

    if (exported.length === 0) {
      problems.push({ file, level: 'error', message: 'exports no exam configuration object' });
      continue;
    }

    for (const candidate of exported) {
      const parsed = examConfigSchema.safeParse(candidate);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          problems.push({
            file,
            level: 'error',
            message: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
          });
        }
        continue;
      }
      loaded.push(parsed.data);
      crossCheck(file, parsed.data);
    }
  }

  const keys = new Set<string>();
  for (const config of loaded) {
    if (keys.has(config.examKey)) {
      problems.push({ file: config.examKey, level: 'error', message: 'duplicate examKey' });
    }
    keys.add(config.examKey);
  }

  const errors = problems.filter((p) => p.level === 'error');
  const warnings = problems.filter((p) => p.level === 'warning');

  for (const problem of problems) {
    const tag = problem.level === 'error' ? 'ERROR' : 'warn ';
    console.log(`${tag}  ${problem.file}  ${problem.message}`);
  }

  console.log(
    `\n${loaded.length} config(s) validated: ${errors.length} error(s), ${warnings.length} warning(s).`,
  );
  for (const config of loaded) {
    console.log(
      `  - ${config.examKey}@${config.version}  sections=${config.sections.length} ` +
        `domains=${config.domains.length} blueprints=${config.blueprints.length} ` +
        `unverified=${config.unverified.length}`,
    );
  }

  if (errors.length > 0) process.exit(1);

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
