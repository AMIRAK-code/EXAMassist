import type { AnswerKey, Response } from '@/lib/assessment/types';

/**
 * Plain statements of a learner's answer and of the key, for review pages.
 * Nothing here judges an answer: that was done, once, when the session was
 * finalised.
 */

type Option = { id: string; label: string };

export function describeResponse(response: Response | null, options: Option[]): string {
  if (!response) return 'Left blank';
  const labelFor = (id: string) => options.find((option) => option.id === id)?.label ?? id;
  switch (response.type) {
    case 'single_select':
      return `Option ${labelFor(response.optionId)}`;
    case 'multi_select':
      return response.optionIds.length > 0 ? `Options ${response.optionIds.map(labelFor).join(', ')}` : 'Left blank';
    case 'numeric_entry':
      return response.raw.trim().length > 0 ? response.raw : 'Left blank';
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return `Option ${response.choice}`;
    case 'two_part':
      return response.selections.length > 0
        ? response.selections.map((s) => `${s.columnId}: ${labelFor(s.optionId)}`).join('; ')
        : 'Left blank';
    case 'essay':
      return response.text.trim().length > 0 ? 'You wrote a response; it is kept with this session.' : 'Left blank';
  }
}

export function describeAnswerKey(key: AnswerKey, options: Option[]): string {
  const labelFor = (id: string) => options.find((option) => option.id === id)?.label ?? id;
  switch (key.type) {
    case 'single_select':
      return `Option ${labelFor(key.optionId)}`;
    case 'multi_select':
      return `Options ${key.optionIds.map(labelFor).join(' and ')}`;
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return `Option ${key.choice}`;
    case 'numeric_entry': {
      const first = key.accepted[0];
      if (!first) return '—';
      if (first.kind === 'range') return `Any value from ${first.min} to ${first.max}`;
      if (first.kind === 'tolerance') return `${first.value} (± ${first.tolerance})`;
      return String(first.value);
    }
    case 'two_part':
      return key.selections.map((s) => `${s.columnId}: ${labelFor(s.optionId)}`).join('; ');
    case 'essay':
      return 'Essays are not scored automatically. Check what you wrote against the self-assessment guide in the explanation.';
  }
}

export function keyOptionIds(key: AnswerKey): string[] {
  if (key.type === 'single_select') return [key.optionId];
  if (key.type === 'multi_select') return key.optionIds;
  if (key.type === 'two_part') return key.selections.map((selection) => selection.optionId);
  return [];
}

export function chosenOptionIds(response: Response | null): string[] {
  if (!response) return [];
  if (response.type === 'single_select') return [response.optionId];
  if (response.type === 'multi_select') return response.optionIds;
  if (response.type === 'two_part') return response.selections.map((selection) => selection.optionId);
  return [];
}
