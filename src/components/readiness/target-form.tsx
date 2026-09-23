'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, Card } from '@/components/ui';

/**
 * Setting a goal.
 *
 * The score is entered on the exam's own published scale, and stored exactly as
 * typed. We never convert it, and the copy never implies we can predict it.
 */
export function TargetForm({
  examKey,
  scale,
  currentScore,
  currentDate,
}: {
  examKey: string;
  scale: { label: string; min: number; max: number; increment: number } | null;
  currentScore: number | null;
  currentDate: string | null;
}) {
  const router = useRouter();
  const [score, setScore] = useState(currentScore === null ? '' : String(currentScore));
  const [date, setDate] = useState(currentDate ?? '');
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setState('saving');
    setError(null);

    const response = await fetch('/api/exam-targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({
        examKey,
        targetScore: score.trim() === '' ? null : Number(score),
        targetDate: date.trim() === '' ? null : date,
      }),
    }).catch(() => null);

    const data = await response?.json().catch(() => null);

    if (!response?.ok) {
      setState('idle');
      setError(data?.error?.message ?? 'That target could not be saved.');
      return;
    }

    setState('saved');
    router.refresh();
  }

  return (
    <Card padding="lg">
      <h2 className="text-xl">Your goal</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
        These two numbers are the only things this page cannot work out for itself.
      </p>

      <form onSubmit={save} className="mt-5 space-y-5">
        {error ? (
          <Alert tone="negative" role="alert">
            {error}
          </Alert>
        ) : null}

        <div>
          <label htmlFor="target-score" className="mb-1.5 block text-sm font-medium">
            Target score
            {scale ? <span className="font-normal text-ink-muted"> · {scale.label}</span> : null}
          </label>
          <input
            id="target-score"
            name="targetScore"
            type="number"
            inputMode="numeric"
            {...(scale ? { min: scale.min, max: scale.max, step: scale.increment || 1 } : {})}
            value={score}
            onChange={(event) => setScore(event.target.value)}
            aria-describedby="target-score-hint"
            className="w-full max-w-48 rounded-sm border border-line-strong bg-surface px-3 py-2.5 tabular-nums focus:border-accent"
          />
          <p id="target-score-hint" className="mt-1.5 text-sm text-ink-muted">
            {scale
              ? `On the exam's own scale, from ${scale.min} to ${scale.max}. Leave it empty if you do not have a number in mind yet.`
              : 'On the exam’s own reported scale. Leave it empty if you do not have a number in mind yet.'}
          </p>
        </div>

        <div>
          <label htmlFor="target-date" className="mb-1.5 block text-sm font-medium">
            Exam date <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="target-date"
            name="targetDate"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-describedby="target-date-hint"
            className="w-full max-w-48 rounded-sm border border-line-strong bg-surface px-3 py-2.5 focus:border-accent"
          />
          <p id="target-date-hint" className="mt-1.5 text-sm text-ink-muted">
            Used only to count the weeks you have left, on your study plan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={state === 'saving'}>
            {state === 'saving' ? 'Saving…' : 'Save goal'}
          </Button>
          <span aria-live="polite" className="text-sm text-ink-muted">
            {state === 'saved' ? 'Saved.' : ''}
          </span>
        </div>
      </form>
    </Card>
  );
}
