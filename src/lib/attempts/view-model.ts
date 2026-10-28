import { renderInlineMarkdown, renderMarkdown } from '@/lib/markdown';
import { spokenLabel } from '@/lib/speech';
import type { StimulusData, StimulusViewModel } from '@/components/stimulus-view';
import type { AttemptState } from './service';
import type { NavigationPolicy, Response, ResponseType } from '@/lib/assessment/types';
import { RETRY_BLUEPRINT_ID } from './retry';

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
  /** Plain speakable text when the choice contains maths; see lib/speech.ts. */
  spoken: string | null;
}

/**
 * The correct answer, as data: the player words it in the learner's
 * language (messages/<locale>/player.json, `answerKey`).
 */
export type AnswerSummary =
  | { kind: 'option'; label: string }
  | { kind: 'options'; labels: string[] }
  | { kind: 'range'; min: string; max: string }
  | { kind: 'tolerance'; value: string; tolerance: string }
  | { kind: 'value'; value: string }
  | { kind: 'pairs'; pairs: Array<{ column: string; label: string }> }
  | { kind: 'essay' };

export interface PlayerReview {
  correct: boolean | null;
  explanationHtml: string;
  distractorHtml: Record<string, string>;
  correctSummary: AnswerSummary | null;
  difficultyBasis: string;
}

export interface PlayerItem {
  position: number;
  questionId: string;
  responseType: ResponseType;
  stemHtml: string;
  /** The language of the question's own text (stem, options, passage), which may differ from the page's. */
  contentLocale: string;
  instructionsHtml: string | null;
  options: PlayerOption[];
  accessibilityText: string | null;
  stimulus: StimulusViewModel | null;
  estimatedSeconds: number;
  answered: boolean;
  flagged: boolean;
  response: Response | null;
  /** Feedback has been shown, so the server will refuse any change to the answer. */
  locked: boolean;
  /** The stored answer's clock, for sorting answers kept on the device against it. */
  responseClock: number | null;
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
  /** A retry of missed questions: its label and note are the app's own, worded by the player. */
  retry: boolean;
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
  /** Where the open section reopens, already checked against its rules. */
  resume: AttemptState['resume'];
  /** The clock of the stored resume position, for a move kept on the device. */
  resumeClock: number | null;
  /** The server's clock at render; the player anchors its navigation clock to it. */
  serverNowMs: number;
}

/** The correct answer, for the review panel. */
function describeAnswerKey(key: unknown, options: PlayerOption[]): AnswerSummary | null {
  if (typeof key !== 'object' || key === null || !('type' in key)) return null;
  const typed = key as Record<string, unknown>;
  const labelFor = (id: string) => options.find((o) => o.id === id)?.label ?? id;

  switch (typed.type) {
    case 'single_select':
      return { kind: 'option', label: labelFor(String(typed.optionId)) };
    case 'multi_select':
      return { kind: 'options', labels: (typed.optionIds as string[]).map(labelFor) };
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return { kind: 'option', label: String(typed.choice) };
    case 'numeric_entry': {
      const accepted = typed.accepted as Array<Record<string, unknown>>;
      const first = accepted?.[0];
      if (!first) return null;
      if (first.kind === 'range') return { kind: 'range', min: String(first.min), max: String(first.max) };
      if (first.kind === 'tolerance') return { kind: 'tolerance', value: String(first.value), tolerance: String(first.tolerance) };
      return { kind: 'value', value: String(first.value) };
    }
    case 'two_part':
      return {
        kind: 'pairs',
        pairs: (typed.selections as Array<{ columnId: string; optionId: string }>).map((s) => ({
          column: s.columnId,
          label: labelFor(s.optionId),
        })),
      };
    case 'essay':
      return { kind: 'essay' };
    default:
      return null;
  }
}

export function toPlayerModel(state: AttemptState): PlayerModel {
  return {
    attemptId: state.id,
    examKey: state.examKey,
    examName: state.examName,
    blueprintLabel: state.blueprintLabel,
    retry: state.blueprintId === RETRY_BLUEPRINT_ID,
    mode: state.mode,
    status: state.status,
    fidelity: state.fidelity,
    fidelityNote: state.fidelityNote,
    immediateFeedback: state.immediateFeedback,
    pauseBehaviour: state.pauseBehaviour,
    currentPartIndex: state.currentPartIndex,
    deadlineAt: state.deadlineAt,
    remainingSeconds: state.remainingSeconds,
    resume: state.resume,
    resumeClock: state.resumeClock,
    serverNowMs: state.serverNowMs,
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
          spoken: spokenLabel(option.textMd),
        }));

        return {
          position: item.position,
          questionId: item.questionId,
          responseType: question.responseType,
          stemHtml: renderMarkdown(question.stemMd ?? ''),
          contentLocale: question.locale ?? 'en',
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
          locked: item.feedbackReleased,
          responseClock: item.responseClock,
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
