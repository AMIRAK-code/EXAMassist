'use client';

import { useTranslations } from 'next-intl';
import type { Response } from '@/lib/assessment/types';
import type { PlayerItem } from '@/lib/attempts/view-model';

/**
 * Answer entry for every supported response type.
 *
 * All of them are native form controls: radios, checkboxes, a text input and a
 * textarea. That keeps keyboard behaviour, screen reader announcements and
 * mobile input modes correct without any custom widget code.
 */

interface Props {
  item: PlayerItem;
  disabled: boolean;
  onChange: (response: Response | null) => void;
}

/** The four fixed GRE quantitative comparison choices: answer content, as the GRE words them. */
const QC_CHOICES: Array<{ id: 'A' | 'B' | 'C' | 'D'; text: string }> = [
  { id: 'A', text: 'Quantity A is greater.' },
  { id: 'B', text: 'Quantity B is greater.' },
  { id: 'C', text: 'The two quantities are equal.' },
  { id: 'D', text: 'The relationship cannot be determined from the information given.' },
];

function ChoiceList({
  name,
  type,
  choices,
  selected,
  disabled,
  onToggle,
  legend,
  hint,
}: {
  name: string;
  type: 'radio' | 'checkbox';
  choices: Array<{ id: string; label: string; html?: string; text?: string; spoken?: string | null }>;
  selected: string[];
  disabled: boolean;
  onToggle: (id: string) => void;
  legend: string;
  hint?: string;
}) {
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="sr-only">{legend}</legend>
      {hint ? (
        <p className="mb-3 text-sm text-ink-muted" id={`${name}-hint`}>
          {hint}
        </p>
      ) : null}
      <ul className="space-y-2">
        {choices.map((choice) => {
          const id = `${name}-${choice.id}`;
          const isSelected = selected.includes(choice.id);
          return (
            <li key={choice.id}>
              <label
                htmlFor={id}
                className={`flex cursor-pointer items-start gap-3 rounded-card border p-3 transition-colors ${
                  isSelected
                    ? 'border-accent bg-accent-soft'
                    : 'border-line bg-surface hover:border-line-strong hover:bg-surface-sunken'
                } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                <input
                  id={id}
                  name={name}
                  type={type}
                  checked={isSelected}
                  onChange={() => onToggle(choice.id)}
                  disabled={disabled}
                  aria-describedby={hint ? `${name}-hint` : undefined}
                  // Maths-only choices need an explicit name: not every screen
                  // reader can build one from MathML. The letter is included
                  // because an aria-label replaces the visible label entirely.
                  aria-label={choice.spoken ? `${choice.label}. ${choice.spoken}` : undefined}
                  className="mt-1 size-4 shrink-0 accent-[#1d4e6e]"
                />
                <span className="flex min-w-0 gap-2">
                  <span className="w-5 shrink-0 font-semibold tabular-nums text-ink-muted" aria-hidden="true">
                    {choice.label}.
                  </span>
                  {choice.html ? (
                    <span className="question-text min-w-0" dangerouslySetInnerHTML={{ __html: choice.html }} />
                  ) : (
                    <span className="question-text min-w-0">{choice.text}</span>
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

export function ResponseInput({ item, disabled, onChange }: Props) {
  const t = useTranslations('player.response');
  const name = `q-${item.position}`;
  const response = item.response;

  switch (item.responseType) {
    case 'single_select': {
      const selected =
        response?.type === 'single_select' && response.optionId ? [response.optionId] : [];
      return (
        <ChoiceList
          name={name}
          type="radio"
          legend={t('selectOne')}
          choices={item.options}
          selected={selected}
          disabled={disabled}
          onToggle={(id) => onChange({ type: 'single_select', optionId: id })}
        />
      );
    }

    case 'multi_select': {
      const selected = response?.type === 'multi_select' ? response.optionIds : [];
      return (
        <ChoiceList
          name={name}
          type="checkbox"
          legend={t('selectAll')}
          hint={t('selectAllHint')}
          choices={item.options}
          selected={selected}
          disabled={disabled}
          onToggle={(id) => {
            const next = selected.includes(id)
              ? selected.filter((value) => value !== id)
              : [...selected, id];
            onChange({ type: 'multi_select', optionIds: next });
          }}
        />
      );
    }

    case 'quantitative_comparison': {
      const selected = response?.type === 'quantitative_comparison' ? [response.choice] : [];
      return (
        <ChoiceList
          name={name}
          type="radio"
          legend={t('compare')}
          choices={QC_CHOICES.map((c) => ({ id: c.id, label: c.id, text: c.text }))}
          selected={selected}
          disabled={disabled}
          onToggle={(id) =>
            onChange({ type: 'quantitative_comparison', choice: id as 'A' | 'B' | 'C' | 'D' })
          }
        />
      );
    }

    case 'data_sufficiency': {
      const selected = response?.type === 'data_sufficiency' ? [response.choice] : [];
      return (
        <ChoiceList
          name={name}
          type="radio"
          legend={t('dataSufficiency')}
          choices={item.options.map((o) => ({ id: o.label, label: o.label, html: o.html, spoken: o.spoken }))}
          selected={selected}
          disabled={disabled}
          onToggle={(id) =>
            onChange({ type: 'data_sufficiency', choice: id as 'A' | 'B' | 'C' | 'D' | 'E' })
          }
        />
      );
    }

    case 'numeric_entry': {
      const raw = response?.type === 'numeric_entry' ? response.raw : '';
      return (
        <div className="max-w-sm">
          <label htmlFor={name} className="mb-1 block text-sm font-medium">
            {t('yourAnswer')}
          </label>
          <input
            id={name}
            name={name}
            type="text"
            inputMode="text"
            autoComplete="off"
            value={raw}
            disabled={disabled}
            aria-describedby={`${name}-help`}
            onChange={(event) => onChange({ type: 'numeric_entry', raw: event.target.value })}
            className="w-full rounded border border-line-strong bg-surface px-3 py-2.5 text-base tabular-nums focus:border-accent disabled:opacity-70"
          />
          <p id={`${name}-help`} className="mt-1.5 text-sm text-ink-muted">
            {t.rich('numericHelp', {
              fraction: '3/4',
              decimal: '0.75',
              code: (chunks) => <code>{chunks}</code>,
            })}
          </p>
        </div>
      );
    }

    case 'two_part': {
      const selections = response?.type === 'two_part' ? response.selections : [];
      // Option ids are "<columnId>-<optionId>"; option ids may not contain a
      // colon, so the column is the text before the FIRST hyphen. The selection
      // carries the whole option id, which is what the answer key stores.
      const columnOf = (optionId: string) => optionId.slice(0, optionId.indexOf('-'));
      const columns = [...new Set(item.options.map((o) => columnOf(o.id)))].filter(Boolean);

      return (
        <div className="space-y-5">
          {columns.map((columnId) => {
            const columnOptions = item.options.filter((o) => columnOf(o.id) === columnId);
            const current = selections.find((s) => s.columnId === columnId);
            return (
              <ChoiceList
                key={columnId}
                name={`${name}-${columnId}`}
                type="radio"
                legend={t('twoPartLegend', { column: columnId.replace(/[-_]/g, ' ') })}
                hint={columnId.replace(/[-_]/g, ' ')}
                choices={columnOptions.map((o) => ({
                  id: o.id,
                  label: o.label,
                  html: o.html,
                  spoken: o.spoken,
                }))}
                selected={current ? [current.optionId] : []}
                disabled={disabled}
                onToggle={(optionId) => {
                  const next = selections.filter((s) => s.columnId !== columnId);
                  next.push({ columnId, optionId });
                  onChange({ type: 'two_part', selections: next });
                }}
              />
            );
          })}
        </div>
      );
    }

    case 'essay': {
      const text = response?.type === 'essay' ? response.text : '';
      return (
        <div>
          <label htmlFor={name} className="mb-1 block text-sm font-medium">
            {t('yourResponse')}
          </label>
          <textarea
            id={name}
            name={name}
            rows={14}
            value={text}
            disabled={disabled}
            aria-describedby={`${name}-help`}
            onChange={(event) => onChange({ type: 'essay', text: event.target.value })}
            className="w-full rounded border border-line-strong bg-surface px-3 py-2.5 font-sans text-base leading-relaxed focus:border-accent disabled:opacity-70"
          />
          <p id={`${name}-help`} className="mt-1.5 text-sm text-ink-muted">
            {text.trim() ? `${t('words', { count: text.trim().split(/\s+/).length })} ` : ''}
            {t('essayHelp')}
          </p>
        </div>
      );
    }

    default:
      return (
        <p role="alert" className="text-sm text-negative">
          {t('unsupported')}
        </p>
      );
  }
}
