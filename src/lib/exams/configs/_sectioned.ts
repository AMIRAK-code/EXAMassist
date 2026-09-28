import type { Blueprint, BlueprintPart, NavigationPolicy, ResponseType, SelectionConstraint } from '@/lib/assessment/types';

/**
 * Blueprint builder for exams made of consecutive, separately timed sections
 * with no return to a closed section: the Politecnico di Torino TIL tests and
 * the CISIA TOLC tests.
 *
 * It produces the same four kinds of blueprint every config offers - a full
 * simulation, one timed practice form per section, a short diagnostic and an
 * untimed practice template - from the section list, so the counts and times
 * in every blueprint come from one place and cannot drift apart.
 */

export interface SectionSpec {
  key: string;
  /** Name as the test maker gives it, used in part labels. */
  name: string;
  questions: number;
  minutes: number;
  domains: string[];
}

export interface SectionedBlueprintSpec {
  /** "TIL-I", "TOLC-E": used in labels. */
  examLabel: string;
  sections: SectionSpec[];
  /** Items per section in the diagnostic. */
  diagnosticPerSection: number;
  /** Seconds per item in the diagnostic; kept generous on purpose. */
  diagnosticSecondsPerItem: number;
  responseTypes: ResponseType[];
  simulationFidelityNote: string;
  timedFidelityNote: (section: SectionSpec) => string;
  diagnosticFidelityNote: string;
  practiceFidelityNote: string;
}

/**
 * Relaxed navigation for the study formats (diagnostic, practice). These are
 * not reproductions of test-day conditions and their fidelity notes say so.
 */
export const studyNavigation: Partial<NavigationPolicy> = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  reviewScreen: true,
  enforcement: 'server',
};

function selection(sectionKey: string, domains: string[], responseTypes: ResponseType[]): SelectionConstraint {
  return {
    sectionKey,
    domains,
    skills: [],
    responseTypes,
    difficultyMix: null,
    allowRepeatsWithinAttempt: false,
    avoidSeenWithinDays: 30,
  };
}

function part(
  key: string,
  section: SectionSpec,
  label: string,
  itemCount: number,
  timeLimitSeconds: number | null,
  responseTypes: ResponseType[],
  navigationOverride: Partial<NavigationPolicy> | null,
): BlueprintPart {
  return {
    key,
    sectionKey: section.key,
    label,
    timeLimitSeconds,
    itemCount,
    selection: selection(section.key, section.domains, responseTypes),
    navigationOverride,
    breakAfterSeconds: null,
    adaptive: null,
  };
}

export function sectionedBlueprints(spec: SectionedBlueprintSpec): Blueprint[] {
  const { sections, examLabel, responseTypes } = spec;
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions, 0);
  const totalMinutes = sections.reduce((sum, s) => sum + s.minutes, 0);

  const simulation: Blueprint = {
    id: 'simulation-full',
    label: `Full simulation - ${examLabel}`,
    mode: 'simulation',
    description:
      `The complete published structure: ${totalQuestions} questions in ${sections.length} consecutive sections ` +
      `(${sections.map((s) => `${s.name} ${s.questions} in ${s.minutes} min`).join('; ')}), ` +
      `${totalMinutes} minutes in all. Each section has its own clock; when it closes, it cannot be reopened. ` +
      'The clock keeps running if you leave, as it does on the day.',
    parts: sections.map((section) =>
      part(
        `simulation-${section.key}`,
        section,
        `${section.name} (${section.questions} questions, ${section.minutes} minutes)`,
        section.questions,
        section.minutes * 60,
        responseTypes,
        null,
      ),
    ),
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote: spec.simulationFidelityNote,
  };

  const timed: Blueprint[] = sections.map((section) => ({
    id: `timed-${section.key}`,
    label: `${section.name}: timed section (${section.questions} questions, ${section.minutes} minutes)`,
    mode: 'practice',
    description: `One ${examLabel} section at its published length and time: ${section.questions} questions in ${section.minutes} minutes, with the ${examLabel} penalty for wrong answers.`,
    parts: [
      part(
        `timed-${section.key}-block`,
        section,
        `${section.name} (${section.questions} questions, ${section.minutes} minutes)`,
        section.questions,
        section.minutes * 60,
        responseTypes,
        null,
      ),
    ],
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote: spec.timedFidelityNote(section),
  }));

  const diagnosticItems = sections.length * spec.diagnosticPerSection;
  const diagnostic: Blueprint = {
    id: 'diagnostic',
    label: `${examLabel} diagnostic skill check`,
    mode: 'diagnostic',
    description:
      `A short ${diagnosticItems}-question check across every ${examLabel} section, timed generously so the ` +
      'result reflects what you know rather than how fast you work.',
    parts: sections.map((section) =>
      part(
        `diagnostic-${section.key}`,
        section,
        section.name,
        spec.diagnosticPerSection,
        spec.diagnosticPerSection * spec.diagnosticSecondsPerItem,
        responseTypes,
        studyNavigation,
      ),
    ),
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_pauses',
    fidelity: 'practice_only',
    fidelityNote: spec.diagnosticFidelityNote,
  };

  const practice: Blueprint = {
    id: 'practice',
    label: `${examLabel} practice set`,
    mode: 'practice',
    description: `An untimed 10-question set from anywhere in the ${examLabel} syllabus. Choose the section, topic, difficulty and length before you start.`,
    parts: [
      {
        key: 'practice-mixed',
        sectionKey: sections[0].key,
        label: 'Mixed practice',
        timeLimitSeconds: null,
        itemCount: 10,
        selection: { ...selection('*', [], []) },
        navigationOverride: studyNavigation,
        breakAfterSeconds: null,
        adaptive: null,
      },
    ],
    timing: 'untimed',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'not_applicable',
    fidelity: 'practice_only',
    fidelityNote: spec.practiceFidelityNote,
  };

  return [simulation, diagnostic, practice, ...timed];
}
