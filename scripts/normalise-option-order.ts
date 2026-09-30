import fs from 'node:fs';
import path from 'node:path';
import { loadContent } from '../src/lib/content/loader';
import { citedOptionLetters } from '../src/lib/content/question-schema';
import { createRng, shuffle } from '../src/lib/assessment/select';

/**
 * Removes answer-position bias from the question bank.
 *
 * Independent review found that correct answers clustered on the first option
 * (on one exam, every mathematics item keyed to "A"), which makes a set
 * guessable without reading it. This rewrites option order so position carries
 * no information:
 *
 *  - Numeric choice sets are sorted ASCENDING, which is what the real exams do
 *    and which makes the correct position a consequence of the maths.
 *  - Other choice sets are shuffled with a seed derived from the question id,
 *    so the result is deterministic and reproducible.
 *  - Fixed choice sets are left alone: quantitative comparison and data
 *    sufficiency options have exam-defined meanings attached to their letters.
 *  - Two-part items are reordered within each column, never across columns: a
 *    numeric column is sorted ascending, and a text-completion blank (whose
 *    word order means nothing) is shuffled. Other text columns, such as a
 *    ladder of "a decrease of 10 percent ... an increase of 30 percent", keep
 *    their authored order. Review found the key first in 20 of 31 blanks.
 *
 * Option ids and labels are renumbered by position, and the answer key,
 * distractor notes and independent-solve record are remapped with them, so
 * every cross-reference in the file stays correct.
 *
 * Only draft and in-review items are touched: published order is immutable.
 *
 *   npx tsx scripts/normalise-option-order.ts [--dry-run] [--exam=<examKey>[,...]] [--ids=<questionId>[,...]]
 *
 * --exam limits the run to the named exams, so a batch that is ready for
 * review can be normalised while authors are still writing other exams.
 */

const dryRun = process.argv.includes('--dry-run');
const listArg = (flag: string): Set<string> | null => {
  const arg = process.argv.find((a) => a.startsWith(`${flag}=`));
  return arg ? new Set(arg.slice(flag.length + 1).split(',').filter(Boolean)) : null;
};
const examFilter = listArg('--exam');
// --ids re-normalises named items only, e.g. after fixing the rules for one
// kind of choice set, without reshuffling items whose wording changed since.
const idFilter = listArg('--ids');
const SHUFFLEABLE = new Set(['single_select', 'multi_select']);
const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
/** Two-part domains whose columns are free-standing word choices. */
const SHUFFLE_TWO_PART_DOMAINS = new Set(['verbal-text-completion']);

type Option = { id: string; label: string; textMd: string };

/**
 * New order for a two-part item's options, column by column, or null when no
 * column changes. Column blocks keep their positions; ids stay "<column>-<letter>".
 */
function twoPartOrder(questionId: string, domainSlug: string, options: readonly Option[]): { options: Option[]; remap: Map<string, string> } | null {
  const columns: string[] = [];
  const byColumn = new Map<string, Option[]>();
  for (const option of options) {
    const column = option.id.slice(0, option.id.lastIndexOf('-'));
    if (!byColumn.has(column)) {
      byColumn.set(column, []);
      columns.push(column);
    }
    byColumn.get(column)!.push(option);
  }

  const remap = new Map<string, string>();
  const next: Option[] = [];
  let changed = false;
  for (const column of columns) {
    const current = byColumn.get(column)!;
    const numeric = current.every((option) => numericValue(option.textMd) !== null);
    let ordered: Option[];
    if (numeric) {
      ordered = [...current].sort((a, b) => (numericValue(a.textMd) ?? 0) - (numericValue(b.textMd) ?? 0));
    } else if (SHUFFLE_TWO_PART_DOMAINS.has(domainSlug)) {
      const canonical = [...current].sort((a, b) => a.textMd.localeCompare(b.textMd, 'en'));
      ordered = shuffle(canonical, createRng(`option-order:${questionId}:${column}`));
    } else {
      ordered = current;
    }
    ordered.forEach((option, index) => {
      const newId = `${column}-${LABELS[index].toLowerCase()}`;
      if (newId !== option.id) changed = true;
      remap.set(option.id, newId);
      next.push({ id: newId, label: LABELS[index], textMd: option.textMd });
    });
  }
  return changed ? { options: next, remap } : null;
}

/** Reads an option as a number, ignoring KaTeX delimiters and formatting. */
function numericValue(textMd: string): number | null {
  const withFractions = textMd
    .replace(/\$+/g, '')
    // \frac{9}{2} must read as 9/2, not as 92 once braces are stripped.
    .replace(/\\[dt]?frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '$1/$2');
  // Any other command (\sqrt, \pi, \times) carries value the stripping below
  // would destroy: 2\sqrt{3} would read as 23. Such a choice is not a plain number.
  if (/\\(?!text\b|mathrm\b)[a-zA-Z]+/.test(withFractions)) return null;
  const cleaned = withFractions
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}]/g, '')
    .replace(/[,\s]/g, '')
    .trim();
  if (cleaned === '') return null;

  const fraction = /^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(cleaned);
  if (fraction) {
    const denominator = Number(fraction[2]);
    if (denominator !== 0) return Number(fraction[1]) / denominator;
  }
  if (!/^-?\d*\.?\d+%?$/.test(cleaned)) return null;
  return Number(cleaned.replace('%', ''));
}

function main(): void {
  const { questions } = loadContent();
  let reordered = 0;
  let sorted = 0;
  let skipped = 0;
  const namesLetters: string[] = [];

  for (const entry of questions) {
    const question = entry.question;
    if (examFilter && !examFilter.has(question.examKey)) continue;
    if (idFilter && !idFilter.has(question.id)) continue;

    // Published content is immutable. Re-ordering a published item would change
    // what a learner was shown and would make this script non-idempotent, so
    // ordering is fixed while an item is still in review, before anyone sees
    // it. Run this BEFORE the blind review, not after.
    if (question.state !== 'draft' && question.state !== 'in_review') {
      skipped += 1;
      continue;
    }

    const isTwoPart = question.responseType === 'two_part';
    if ((!SHUFFLEABLE.has(question.responseType) && !isTwoPart) || question.options.length < 2) {
      skipped += 1;
      continue;
    }

    // Letters written in prose are not remapped, and a stale "Choice B." sends
    // a learner to the wrong option. This happened to 104 published items, so
    // an item whose explanation or distractor notes name option letters is
    // left in its order and reported, to be reordered and re-lettered by hand.
    // The screen-reader description counts too: it often lists the choices,
    // and a stale list misleads exactly the learners who cannot check it
    // against the screen. Detection is shared with validateQuestion, so the
    // validator and this script agree on what a letter reference is.
    const prose = [
      question.explanationMd,
      question.accessibilityText ?? '',
      ...Object.values(question.distractorRationale),
    ]
      .join('\n')
      .replace(/\$\$[\s\S]*?\$\$/g, ' ')
      .replace(/\$[^$\n]*\$/g, ' ');
    if (citedOptionLetters(prose).length > 0) {
      namesLetters.push(question.id);
      continue;
    }

    let allNumeric = false;
    let remap = new Map<string, string>();
    let newOptions: Option[];

    if (isTwoPart) {
      const result = twoPartOrder(question.id, question.domainSlug, question.options);
      if (!result) {
        skipped += 1;
        continue;
      }
      ({ options: newOptions, remap } = result);
    } else {
      const values = question.options.map((option) => numericValue(option.textMd));
      allNumeric = values.every((value) => value !== null);

      // Canonicalise before shuffling, so the shuffle's input never depends on a
      // previous run. Without this, re-running the script re-randomises the same
      // item every time, because a shuffled list is a different input.
      const canonical = [...question.options].sort((a, b) => a.textMd.localeCompare(b.textMd, 'en'));

      const ordered = allNumeric
        ? [...question.options].sort(
            (a, b) => (numericValue(a.textMd) ?? 0) - (numericValue(b.textMd) ?? 0),
          )
        : shuffle(canonical, createRng(`option-order:${question.id}`));

      const unchanged = ordered.every((option, index) => option.id === question.options[index]?.id);
      if (unchanged) {
        skipped += 1;
        continue;
      }

      // Renumber ids and labels by position, and remember the mapping.
      newOptions = ordered.map((option, index) => {
        const newId = LABELS[index].toLowerCase();
        remap.set(option.id, newId);
        return { id: newId, label: LABELS[index], textMd: option.textMd };
      });
    }

    const updated = structuredClone(question) as Record<string, unknown>;
    updated.options = newOptions;

    const key = structuredClone(question.answerKey) as Record<string, unknown>;
    if (key.type === 'single_select') {
      key.optionId = remap.get(String(key.optionId)) ?? key.optionId;
    } else if (key.type === 'multi_select') {
      key.optionIds = (key.optionIds as string[]).map((id) => remap.get(id) ?? id);
    } else if (key.type === 'two_part') {
      key.selections = (key.selections as Array<{ columnId: string; optionId: string }>).map((selection) => ({
        ...selection,
        optionId: remap.get(selection.optionId) ?? selection.optionId,
      }));
    }
    updated.answerKey = key;

    updated.distractorRationale = Object.fromEntries(
      Object.entries(question.distractorRationale).map(([id, text]) => [remap.get(id) ?? id, text]),
    );

    // Keep the audit trail consistent with the file it describes.
    const review = updated.review as Record<string, unknown>;
    const solve = review.independentSolve as Record<string, unknown> | null;
    if (solve && typeof solve.solvedAnswer === 'string') {
      // Two-part answers may be written "column:option"; remap the option part.
      const remapped = solve.solvedAnswer
        .split(',')
        .map((raw) => {
          const part = raw.trim();
          const colon = part.lastIndexOf(':');
          if (colon === -1) return remap.get(part) ?? part;
          const optionId = part.slice(colon + 1);
          return `${part.slice(0, colon + 1)}${remap.get(optionId) ?? optionId}`;
        })
        .join(',');
      solve.solvedAnswer = remapped;
    }
    review.notes =
      `${String(review.notes ?? '')} Options were reordered after review to remove answer-position bias; ` +
      `ids and labels were remapped with the key.`.trim();

    if (!dryRun) {
      fs.writeFileSync(path.resolve(entry.file), `${JSON.stringify(updated, null, 2)}\n`);
    }
    if (allNumeric) sorted += 1;
    else reordered += 1;
  }

  console.log(`${dryRun ? '[dry run] ' : ''}Option order normalised.`);
  console.log(`  numeric sets sorted ascending: ${sorted}`);
  console.log(`  other sets shuffled:           ${reordered}`);
  console.log(`  unchanged or not applicable:   ${skipped}`);
  if (namesLetters.length > 0) {
    console.log(`  left alone, prose names option letters: ${namesLetters.length}`);
    for (const id of namesLetters) console.log(`    ${id}`);
  }
}

main();
