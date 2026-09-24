import type { Db } from '@/lib/db';
import { renderInlineMarkdown, renderMarkdown } from '@/lib/markdown';
import { getHub, labelsFor, requireExamConfig } from '@/lib/exams/registry';
import type { StimulusData, StimulusViewModel } from '@/components/stimulus-view';
import { getPublishedVersion, toReviewable } from './repository';
import type { PublicSample } from './public-samples';

/**
 * A public sample question, rendered for display outside any attempt.
 *
 * It carries its answer key and explanation because it is public by design
 * (see public-samples.ts). It is never written to, or read from, an attempt,
 * and checking an answer against it records nothing.
 */
export interface SampleView {
  hubSlug: string;
  examKey: string;
  questionId: string;
  examShortName: string;
  topicLabel: string;
  difficulty: 'easy' | 'medium' | 'hard';
  stemHtml: string;
  instructionsHtml: string | null;
  stimulus: StimulusViewModel | null;
  options: Array<{ id: string; label: string; html: string; rationaleHtml: string | null }>;
  correctOptionId: string;
  explanationHtml: string;
}

/**
 * Returns null when the sample is not currently published or is not a
 * single-choice question, so callers show an honest empty state instead.
 */
export function loadSampleView(db: Db, sample: PublicSample): SampleView | null {
  const row = getPublishedVersion(db, sample.questionId);
  if (!row) return null;
  const question = toReviewable(db, row);
  if (question.answerKey.type !== 'single_select') return null;

  const config = requireExamConfig(sample.examKey);
  const labels = labelsFor(config);
  const skill = labels.skills[question.skillSlug];
  const domain = labels.domains[question.domainSlug] ?? question.domainSlug;
  const hub = getHub(sample.hubSlug);

  return {
    hubSlug: sample.hubSlug,
    examKey: sample.examKey,
    questionId: sample.questionId,
    examShortName: hub?.shortName ?? config.shortName,
    // Skill names run long ("Selecting words or short phrases…"); fall back to the domain.
    topicLabel: skill && skill.length <= 32 ? skill : domain,
    difficulty: question.difficulty,
    stemHtml: renderMarkdown(question.stemMd),
    instructionsHtml: question.instructionsMd ? renderMarkdown(question.instructionsMd) : null,
    stimulus: question.stimulus
      ? {
          id: question.stimulus.id,
          title: question.stimulus.title,
          bodyHtml: question.stimulus.bodyMd ? renderMarkdown(question.stimulus.bodyMd) : null,
          data: (question.stimulus.data as StimulusData | null) ?? null,
          accessibilityText: question.stimulus.accessibilityText,
        }
      : null,
    options: question.options.map((option) => ({
      id: option.id,
      label: option.label,
      html: renderInlineMarkdown(option.textMd),
      rationaleHtml: question.distractorRationale[option.id]
        ? renderMarkdown(question.distractorRationale[option.id])
        : null,
    })),
    correctOptionId: question.answerKey.optionId,
    explanationHtml: renderMarkdown(question.explanationMd),
  };
}
