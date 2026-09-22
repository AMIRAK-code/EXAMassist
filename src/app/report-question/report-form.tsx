'use client';

import { useState } from 'react';
import { Alert, Button } from '@/components/ui';

const REASONS = [
  { value: 'wrong_answer', label: 'The marked answer looks wrong' },
  { value: 'ambiguous', label: 'More than one answer seems defensible' },
  { value: 'missing_material', label: 'Something needed to answer is missing' },
  { value: 'explanation', label: 'The explanation is wrong or unclear' },
  { value: 'typo', label: 'A typo or formatting problem' },
  { value: 'other', label: 'Something else' },
] as const;

export function ReportForm({ initialQuestionId }: { initialQuestionId: string }) {
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
      setError(data?.error?.message ?? 'We could not send that report. Please try again.');
      return;
    }
    setState('sent');
  }

  if (state === 'sent') {
    return (
      <Alert tone="positive" title="Thank you — your report has been logged" role="status">
        <p>
          An editor will look at this question. If it turns out to be wrong, it is withdrawn from the
          bank rather than quietly edited, and a replacement is written.
        </p>
        <p className="mt-2">
          <button
            type="button"
            className="text-accent underline"
            onClick={() => {
              setState('idle');
              setDetails('');
            }}
          >
            Report another question
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
          Question ID
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
          Shown under each question on your results page. It is filled in for you if you followed the
          link from there.
        </p>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">What is wrong?</legend>
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
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="details" className="mb-1.5 block text-sm font-medium">
          Details <span className="font-normal text-ink-muted">(optional)</span>
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
          If you think a different answer is right, telling us which one and why is the most useful
          thing you can write here.
        </p>
      </div>

      <Button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send report'}
      </Button>
    </form>
  );
}
