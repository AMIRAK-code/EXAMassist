'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Alert, Button } from '@/components/ui';

/** Reason codes the API accepts, with the key of each one's label. */
const REASONS = [
  { value: 'wrong_answer', key: 'wrongAnswer' },
  { value: 'ambiguous', key: 'ambiguous' },
  { value: 'missing_material', key: 'missingMaterial' },
  { value: 'explanation', key: 'explanation' },
  { value: 'typo', key: 'typo' },
  { value: 'other', key: 'other' },
] as const;

/**
 * The API answers in English with a stable error code; the form shows the
 * message for that code in the visitor's language.
 */
const ERROR_KEYS: Record<string, 'rateLimited' | 'unknownQuestion' | 'invalid'> = {
  'rate-limited': 'rateLimited',
  'unknown-question': 'unknownQuestion',
  'invalid-request': 'invalid',
  'invalid-json': 'invalid',
};

export function ReportForm({ initialQuestionId }: { initialQuestionId: string }) {
  const t = useTranslations('about.reportQuestion.form');
  const [questionId, setQuestionId] = useState(initialQuestionId);
  const [reason, setReason] = useState<string>('wrong_answer');
  const [details, setDetails] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState('sending');
    setError(null);

    const response = await fetch('/api/content-flags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({ questionId, reason, details: details || undefined }),
    }).catch(() => null);

    const data = await response?.json().catch(() => null);

    if (!response?.ok) {
      setState('idle');
      const code: unknown = data?.error?.code;
      const key = typeof code === 'string' ? ERROR_KEYS[code] : undefined;
      setError(t(`errors.${key ?? 'generic'}`));
      return;
    }
    setState('sent');
  }

  if (state === 'sent') {
    return (
      <Alert tone="positive" title={t('sentTitle')} role="status">
        <p>{t('sentBody')}</p>
        <p className="mt-2">
          <button
            type="button"
            className="text-accent underline"
            onClick={() => {
              setState('idle');
              setDetails('');
            }}
          >
            {t('another')}
          </button>
        </p>
      </Alert>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error ? (
        <Alert tone="negative" role="alert">
          {error}
        </Alert>
      ) : null}

      <div>
        <label htmlFor="questionId" className="mb-1.5 block text-sm font-medium">
          {t('questionId')}
        </label>
        <input
          id="questionId"
          name="questionId"
          required
          value={questionId}
          onChange={(event) => setQuestionId(event.target.value)}
          aria-describedby="questionId-hint"
          className="w-full rounded border border-line-strong bg-surface px-3 py-2.5 font-mono text-sm"
        />
        <p id="questionId-hint" className="mt-1.5 text-sm text-ink-muted">
          {t('questionIdHint')}
        </p>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">{t('reasonLegend')}</legend>
        <div className="space-y-2">
          {REASONS.map((option) => (
            <label
              key={option.value}
              htmlFor={`reason-${option.value}`}
              className={`flex cursor-pointer items-start gap-3 rounded-card border p-3 ${
                reason === option.value
                  ? 'border-accent bg-accent-soft'
                  : 'border-line bg-surface hover:bg-surface-sunken'
              }`}
            >
              <input
                id={`reason-${option.value}`}
                type="radio"
                name="reason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => setReason(option.value)}
                className="mt-1 size-4 shrink-0"
              />
              <span>{t(`reasons.${option.key}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="details" className="mb-1.5 block text-sm font-medium">
          {t.rich('details', {
            muted: (chunks) => <span className="font-normal text-ink-muted">{chunks}</span>,
          })}
        </label>
        <textarea
          id="details"
          name="details"
          rows={5}
          maxLength={2000}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          aria-describedby="details-hint"
          className="w-full rounded border border-line-strong bg-surface px-3 py-2.5 text-base"
        />
        <p id="details-hint" className="mt-1.5 text-sm text-ink-muted">
          {t('detailsHint')}
        </p>
      </div>

      <Button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? t('sending') : t('submit')}
      </Button>
    </form>
  );
}
