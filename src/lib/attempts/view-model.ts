import { renderInlineMarkdown, renderMarkdown } from '@/lib/markdown';
import type { StimulusData, StimulusViewModel } from '@/components/stimulus-view';
import type { AttemptState } from './service';
import type { NavigationPolicy, Response, ResponseType } from '@/lib/assessment/types';

/**
 * Turns server attempt state into a payload the client player can render
 * directly.
 *
 * All Markdown and maths is rendered here, on the server, so the browser never
 * needs a Markdown or KaTeX bundle and nothing unsanitised can reach the page.
 */

export interface PlayerOption {
  id: string;
  label: string;
  html: string;
}

export interface PlayerReview {
  correct: boolean | null;
  explanationHtml: string;
  distractorHtml: Record<string, string>;
  correctSummary: string;
  difficultyBasis: string;
}

export interface PlayerItem {
  position: number;
  questionId: string;
  responseType: ResponseType;
  stemHtml: string;
  instructionsHtml: string | null;
  options: PlayerOption[];
  accessibilityText: string | null;
  stimulus: StimulusViewModel | null;
  estimatedSeconds: number;
  answered: boolean;
  flagged: boolean;
  response: Response | null;
  review: PlayerReview | null;
}

export interface PlayerPart {
  partIndex: number;
  label: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'expired';
  deadlineAt: string | null;
  remainingSeconds: number | null;
  timeLimitSeconds: number | null;
  navigation: NavigationPolicy;
  navigationSummary: string[];
  routingDisclosure: string | null;
  items: PlayerItem[];
}

export interface PlayerModel {
  attemptId: string;
  examKey: string;
  examName: string;
  blueprintLabel: string;
  mode: AttemptState['mode'];
  status: AttemptState['status'];
  fidelity: AttemptState['fidelity'];
  fidelityNote: string;
  immediateFeedback: boolean;
  pauseBehaviour: AttemptState['pauseBehaviour'];
  currentPartIndex: number;
  deadlineAt: string | null;
  remainingSeconds: number | null;
  parts: PlayerPart[];
}

/** Plain-language statement of the correct answer, for the review panel. */
function describeAnswerKey(key: unknown, options: PlayerOption[]): string {
  if (typeof key !== 'object' || key === null || !('type' in key)) return '';
  const typed = key as Record<string, unknown>;
  const labelFor = (id: string) => options.find((o) => o.id === id)?.label ?? id;

  switch (typed.type) {
    case 'single_select':
      return `Option ${labelFor(String(typed.optionId))}`;
    case 'multi_select':
      return `Options ${(typed.optionIds as string[]).map(labelFor).join(' and ')}`;
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return `Option ${String(typed.choice)}`;
    case 'numeric_entry': {
      const accepted = typed.accepted as Array<Record<string, unknown>>;
      const first = accepted?.[0];
      if (!first) return '';
      if (first.kind === 'range') return `Any value from ${first.min} to ${first.max}`;
      if (first.kind === 'tolerance') return `${first.value} (± ${first.tolerance})`;
      return String(first.value);
    }
    case 'two_part':
      return (typed.selections as Array<{ columnId: string; optionId: string }>)
        .map((s) => `${s.columnId}: ${labelFor(s.optionId)}`)
        .join('; ');
    case 'essay':
      return 'Essays are not automatically scored. Compare your response with the rubric.';
    default:
      return '';
  }
}

export function toPlayerModel(state: AttemptState): PlayerModel {
  return {
    attemptId: state.id,
    examKey: state.examKey,
    examName: state.examName,
    blueprintLabel: state.blueprintLabel,
    mode: state.mode,
    status: state.status,
    fidelity: state.fidelity,
    fidelityNote: state.fidelityNote,
    immediateFeedback: state.immediateFeedback,
    pauseBehaviour: state.pauseBehaviour,
    currentPartIndex: state.currentPartIndex,
    deadlineAt: state.deadlineAt,
    remainingSeconds: state.remainingSeconds,
    parts: state.parts.map((part) => ({
      partIndex: part.partIndex,
      label: part.label,
      status: part.status,
      deadlineAt: part.deadlineAt,
      remainingSeconds: part.remainingSeconds,
      timeLimitSeconds: part.timeLimitSeconds,
      navigation: part.navigation,
      navigationSummary: part.navigationSummary,
      routingDisclosure: part.routing?.disclosure ?? null,
      items: part.items.map((item) => {
        const question = item.question;
        const options: PlayerOption[] = (question.options ?? []).map((option) => ({
          id: option.id,
          label: option.label,
          html: renderInlineMarkdown(option.textMd),
        }));

        return {
          position: item.position,
          questionId: item.questionId,
          responseType: question.responseType,
          stemHtml: renderMarkdown(question.stemMd ?? ''),
          instructionsHtml: question.instructionsMd ? renderMarkdown(question.instructionsMd) : null,
          options,
          accessibilityText: question.accessibilityText ?? null,
          stimulus: question.stimulus
            ? {
                id: question.stimulus.id,
                title: question.stimulus.title,
                bodyHtml: question.stimulus.bodyMd ? renderMarkdown(question.stimulus.bodyMd) : null,
                data: (question.stimulus.data as StimulusData | null) ?? null,
                accessibilityText: question.stimulus.accessibilityText,
              }
            : null,
          estimatedSeconds: question.estimatedSeconds ?? 60,
          answered: item.answered,
          flagged: item.flagged,
          response: item.response,
          review: item.review
            ? {
                correct: item.review.correct,
                explanationHtml: renderMarkdown(item.review.explanationMd),
                distractorHtml: Object.fromEntries(
                  Object.entries(item.review.distractorRationale).map(([id, text]) => [
                    id,
                    renderInlineMarkdown(text),
                  ]),
                ),
                correctSummary: describeAnswerKey(item.review.answerKey, options),
                difficultyBasis: item.review.difficultyBasis,
              }
            : null,
        };
      }),
    })),
  };
}
