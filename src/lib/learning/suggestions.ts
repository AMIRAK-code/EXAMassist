import type { ExamConfig } from '@/lib/assessment/types';
import { eligibleCount, type PracticeFacet } from '@/lib/attempts/facets';
import { MIN_ANSWERS_FOR_SIGNAL, type ReadinessAssessment } from './readiness';
import { WEAK_ACCURACY } from './recommend';

/**
 * Suggestions beside the readiness evidence, kept apart from it: the
 * evidence says what was measured, these say what might help, and each
 * states why.
 *
 * Every suggestion is built from reviewed questions that are available now,
 * and says which kind of practice it is:
 * - new: only questions this learner has never been shown (enforced when
 *   the session is built);
 * - revision: questions they may have seen before, said plainly;
 * - review: the questions they missed, asked again on purpose;
 * - timed: a timed format, when one is open.
 * A suggestion with nothing available to practise is not made.
 */

export type SuggestionKind = 'new' | 'revision' | 'review' | 'timed';

export type SuggestionStart =
  | { type: 'practice'; domainSlug: string | null; unseenOnly: boolean; length: number }
  | { type: 'review'; length: number }
  | { type: 'link'; href: string; label: string };

export interface Suggestion {
  key: string;
  title: string;
  why: string;
  kind: SuggestionKind;
  start: SuggestionStart;
}

export interface SuggestionInput {
  config: ExamConfig;
  assessment: ReadinessAssessment;
  /** Reviewed practice questions, grouped for counting. */
  allFacets: PracticeFacet[];
  /** The same, only questions this learner has never been shown. */
  unseenFacets: PracticeFacet[];
  /** Missed questions that can be asked again. */
  retryable: number;
  /** An open timed format, if any. */
  timedFormat: { label: string } | null;
}

const SESSION = 10;
/** Fewer unseen questions than this in a topic, and topic practice becomes revision. */
const NEW_AT_LEAST = 5;

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Topic practice as new questions while enough are unseen, otherwise as revision. */
function topicPractice(input: SuggestionInput, domainSlug: string | null) {
  const filters = { domain: domainSlug };
  const unseen = eligibleCount(input.unseenFacets, filters);
  const all = eligibleCount(input.allFacets, filters);
  if (unseen >= NEW_AT_LEAST || (unseen > 0 && unseen === all)) {
    return { kind: 'new' as const, start: { type: 'practice' as const, domainSlug, unseenOnly: true, length: Math.min(SESSION, unseen) }, unseen, all };
  }
  if (all === 0) return null;
  return { kind: 'revision' as const, start: { type: 'practice' as const, domainSlug, unseenOnly: false, length: Math.min(SESSION, all) }, unseen, all };
}

const repeatNote = (unseen: number, all: number) =>
  unseen === 0
    ? ` You have been shown all ${all} reviewed questions here, so this repeats them.`
    : ` Only ${unseen} of the ${all} reviewed questions here are new to you, so this repeats some.`;

export function buildSuggestions(input: SuggestionInput): Suggestion[] {
  const { assessment, config } = input;
  const suggestions: Suggestion[] = [];
  const domainName = (slug: string) => config.domains.find((d) => d.slug === slug)?.name ?? slug;

  if (assessment.evidenceStrength === 'insufficient') {
    const practice = topicPractice(input, null);
    if (practice) {
      suggestions.push({
        key: 'more',
        title: practice.kind === 'new' ? 'Answer more questions, new ones' : 'Answer more questions',
        why:
          `Another ${Math.max(0, MIN_ANSWERS_FOR_SIGNAL - assessment.answeredTotal)} answers and the measurements above start to mean something.` +
          (practice.kind === 'revision' ? repeatNote(practice.unseen, practice.all) : ''),
        kind: practice.kind,
        start: practice.start,
      });
    }
  }

  if (input.retryable > 0) {
    suggestions.push({
      key: 'review',
      title: `Revisit ${plural(input.retryable, 'question')} you missed`,
      why: 'Questions you got wrong or left blank, asked again on purpose. A retry does not count towards the measurements above.',
      kind: 'review',
      start: { type: 'review', length: Math.min(SESSION, input.retryable) },
    });
  }

  const untouched = assessment.gaps.find((gap) => gap.answered === 0);
  if (untouched) {
    const practice = topicPractice(input, untouched.domainSlug);
    if (practice) {
      suggestions.push({
        key: `untouched-${untouched.domainSlug}`,
        title: `Practise ${untouched.label}`,
        why: 'You have not answered anything in this topic, so it is a blind spot in everything above.' + (practice.kind === 'revision' ? repeatNote(practice.unseen, practice.all) : ''),
        kind: practice.kind,
        start: practice.start,
      });
    }
  }

  const weakest = assessment.gaps.find((gap) => gap.hasSignal && gap.accuracy < WEAK_ACCURACY);
  if (weakest) {
    const practice = topicPractice(input, weakest.domainSlug);
    if (practice) {
      suggestions.push({
        key: `weak-${weakest.domainSlug}`,
        title: `Work on ${domainName(weakest.domainSlug)}`,
        why:
          `Your weakest topic with enough answers to act on: ${Math.round(weakest.accuracy * 100)}% of ${weakest.answered}.` +
          (practice.kind === 'revision' ? repeatNote(practice.unseen, practice.all) : ''),
        kind: practice.kind,
        start: practice.start,
      });
    }
  }

  if (assessment.paceRatio !== null && assessment.paceRatio > 1.25 && input.timedFormat) {
    suggestions.push({
      key: 'timed',
      title: 'Practise against the clock',
      why: `Your median time is ${assessment.paceRatio.toFixed(2)}× the exam's pace. ${input.timedFormat.label} runs to a clock.`,
      kind: 'timed',
      start: { type: 'link', href: `/practice/${config.examKey}`, label: 'Choose a timed format' },
    });
  }

  return suggestions;
}
