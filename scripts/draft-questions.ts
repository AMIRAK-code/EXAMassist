import { loadEnvConfig } from '@next/env';
import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import type { z } from 'zod';
import { loadContent, QUESTIONS_DIR } from '../src/lib/content/loader';
import {
  DRAFTABLE_RESPONSE_TYPES,
  DraftingError,
  MAX_ITEMS_PER_REQUEST,
  buildDraftPrompt,
  choiceDraftSchema,
  draftContext,
  draftQuestions,
  draftingRules,
  numericDraftSchema,
  solveSchema,
  type DraftDifficulty,
  type DraftModel,
  type DraftRequest,
  type DraftableResponseType,
  type Prompt,
} from '../src/lib/content/drafting';
import { getDraftExamConfig, getExamConfig } from '../src/lib/exams/registry';

/**
 * Drafts new questions with Claude into the review queue (src/lib/content/drafting.ts).
 *
 *   npm run content:draft -- --exam=<examKey> --domain=<domainSlug> [--skill=<skillSlug>]
 *     [--count=3] [--difficulty=mixed|easy|medium|hard] [--response=single_select|numeric_entry]
 *     [--options=<n>] [--stimulus=<stimulusId>] [--no-precheck] [--dry-run]
 *
 * --dry-run prints the rules read from the config and the request the model
 * would get, without calling it. Otherwise each kept draft is written to
 * content/questions/<examKey>/<id>.json as "in_review"; nothing is published.
 * Needs ANTHROPIC_API_KEY (or an `ant auth login` profile). Every run costs
 * money: roughly a few cents per question with the blind solve.
 */

loadEnvConfig(process.cwd(), true);

const MODEL = 'claude-opus-5-5';
// Claude Opus 5.5 list prices per million tokens, for the cost estimate only.
const PRICE = { input: 4, output: 20 };

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length);
}

function usage(message: string): never {
  console.error(`${message}

Usage: npm run content:draft -- --exam=<examKey> --domain=<domainSlug> [--skill=<skillSlug>]
         [--count=3] [--difficulty=mixed|easy|medium|hard] [--response=single_select|numeric_entry]
         [--options=<n>] [--stimulus=<stimulusId>] [--no-precheck] [--dry-run]`);
  process.exit(1);
}

/** The model behind DraftModel: structured output, adaptive thinking, the server-side refusal fallback. */
class ClaudeDraftModel implements DraftModel {
  readonly name = MODEL;
  readonly usage = { input: 0, output: 0 };
  private readonly client = new Anthropic({ maxRetries: 2 });

  private async ask<T>(prompt: Prompt, schema: z.ZodType<T>, label: string): Promise<T> {
    const response = await this.client.beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      // If the model declines, the server retries the same request on a fallback model.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high', format: betaZodOutputFormat(schema) },
      system: prompt.system,
      messages: [{ role: 'user', content: prompt.user }],
    });
    this.usage.input += response.usage.input_tokens;
    this.usage.output += response.usage.output_tokens;
    if (response.stop_reason === 'refusal') {
      throw new Error(`${label}: the model declined (${response.stop_details?.category ?? 'no category given'}).`);
    }
    if (response.stop_reason === 'max_tokens') {
      throw new Error(`${label}: the answer was cut off at max_tokens. Ask for fewer questions.`);
    }
    if (!response.parsed_output) throw new Error(`${label}: the answer did not match the expected shape.`);
    return response.parsed_output;
  }

  async draft(prompt: Prompt, responseType: DraftableResponseType) {
    if (responseType === 'numeric_entry') return (await this.ask(prompt, numericDraftSchema, 'Drafting')).items;
    return (await this.ask(prompt, choiceDraftSchema, 'Drafting')).items;
  }

  async solve(prompt: Prompt) {
    return (await this.ask(prompt, solveSchema, 'Blind solve')).solutions;
  }
}

async function main(): Promise<void> {
  const examKey = arg('exam') ?? usage('--exam is required.');
  const domainSlug = arg('domain') ?? usage('--domain is required.');
  const config = getExamConfig(examKey) ?? getDraftExamConfig(examKey);
  if (!config) usage(`Unknown exam "${examKey}".`);

  const responseType = (arg('response') ?? 'single_select') as DraftableResponseType;
  if (!DRAFTABLE_RESPONSE_TYPES.includes(responseType)) {
    usage(`--response must be one of ${DRAFTABLE_RESPONSE_TYPES.join(', ')}; other formats are not drafted yet.`);
  }
  const difficulty = (arg('difficulty') ?? 'mixed') as DraftDifficulty;
  if (!['easy', 'medium', 'hard', 'mixed'].includes(difficulty)) usage('--difficulty must be easy, medium, hard or mixed.');

  const { questions, stimuli } = loadContent();
  const bank = questions.map((entry) => entry.question);
  const stimulusId = arg('stimulus');
  const stimulus = stimulusId ? stimuli.find((s) => s.stimulus.id === stimulusId)?.stimulus : undefined;
  if (stimulusId && !stimulus) usage(`No stimulus "${stimulusId}" in content/stimuli.`);

  const request: DraftRequest = {
    examKey,
    domainSlug,
    skillSlug: arg('skill'),
    responseType,
    optionCount: arg('options') ? Number(arg('options')) : undefined,
    difficulty,
    count: Number(arg('count') ?? 3),
    stimulus,
  };

  const rules = draftingRules(config, request);
  console.log(`${rules.examName} · ${rules.section.name} · ${rules.domain.name}`);
  console.log(
    `  ${rules.responseType}${rules.optionCount ? `, ${rules.optionCount} options` : ''}; scoring +${rules.scoring.correct} / ${rules.scoring.omitted} / ${rules.scoring.incorrect}`,
  );
  console.log(`  ${rules.optionCountSource}`);

  if (process.argv.includes('--dry-run')) {
    const prompt = buildDraftPrompt(rules, request, Math.min(request.count, MAX_ITEMS_PER_REQUEST), draftContext(bank, rules, stimulus));
    console.log(`\n--- system ---\n${prompt.system}\n\n--- user ---\n${prompt.user}\n\n(dry run: no model call, nothing written)`);
    return;
  }

  const model = new ClaudeDraftModel();
  const outcome = await draftQuestions(config, request, {
    model,
    bank,
    stimulusIds: new Set(stimuli.map((s) => s.stimulus.id)),
    today: new Date().toISOString().slice(0, 10),
    precheck: !process.argv.includes('--no-precheck'),
  });

  const dir = path.join(QUESTIONS_DIR, examKey);
  fs.mkdirSync(dir, { recursive: true });
  for (const question of outcome.accepted) {
    const file = path.join(dir, `${question.id}.json`);
    if (fs.existsSync(file)) throw new Error(`${file} already exists; nothing overwritten.`);
    fs.writeFileSync(file, `${JSON.stringify(question, null, 2)}\n`);
  }

  console.log(`\nWritten as in_review (${outcome.accepted.length}):`);
  for (const q of outcome.accepted) console.log(`  ${q.id}  ${q.skillSlug}  ${q.difficulty}`);
  if (outcome.rejected.length > 0) {
    console.log(`\nDiscarded (${outcome.rejected.length}):`);
    for (const r of outcome.rejected) console.log(`  ${r.id}: ${r.reasons.join('; ')}`);
  }
  const cost = (model.usage.input * PRICE.input + model.usage.output * PRICE.output) / 1_000_000;
  console.log(`\nTokens: ${model.usage.input} in, ${model.usage.output} out (about $${cost.toFixed(2)} at Claude Opus 5.5 prices).`);

  if (outcome.accepted.length > 0) {
    const ids = outcome.accepted.map((q) => q.id).join(',');
    console.log(`
Nothing is published. Next:
  npx tsx scripts/validate-content.ts ${examKey}
  npx tsx scripts/normalise-option-order.ts --ids=${ids}
  npx tsx scripts/export-review-batch.ts <output-dir>    (for the blind solve)
  npx tsx scripts/apply-review.ts <verdicts.json>        (publishes only items the blind solve confirms)`);
  }
}

main().catch((error: unknown) => {
  if (error instanceof DraftingError) console.error(error.message);
  else if (error instanceof Anthropic.AuthenticationError) console.error('No valid Anthropic credentials: set ANTHROPIC_API_KEY or run `ant auth login`.');
  else if (error instanceof Anthropic.RateLimitError) console.error('Rate limited by the Anthropic API; try again shortly.');
  else if (error instanceof Anthropic.APIError) console.error(`Anthropic API error ${error.status}: ${error.message}`);
  else console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
