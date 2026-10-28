'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Alert, Button, Card, fieldClass } from '@/components/ui';

/**
 * Setting a goal.
 *
 * The score is entered on the exam's own published scale, and stored exactly as
 * typed. We never convert it, and the copy never implies we can predict it.
 * The date is the one exam date for this exam: the study plan uses it too.
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
  const t = useTranslations('learning.targetForm');
  const router = useRouter();
  const [score, setScore] = useState(currentScore === null ? '' : String(currentScore));
  const [date, setDate] = useState(currentDate ?? '');
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState<{ code: string | null; field: 'score' | 'date' | null; score: string } | null>(null);

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
      const code = data?.error?.code as string | undefined;
      setError({
        code: code ?? null,
        field: code === 'target-out-of-range' ? 'score' : code === 'invalid-date' ? 'date' : null,
        score: score.trim(),
      });
      return;
    }

    setState('saved');
    router.refresh();
  }

  const errorId = `target-error-${examKey}`;
  // The service's error codes, in the reader's language; anything else is a general failure.
  const errorText = (problem: NonNullable<typeof error>) =>
    problem.code === 'target-out-of-range' && scale
      ? t('errors.outOfRange', { min: String(scale.min), max: String(scale.max), score: problem.score })
      : problem.code === 'invalid-date'
        ? t('errors.invalidDate')
        : t('errors.notSaved');
  const describedBy = (hint: string, field: 'score' | 'date') =>
    error && (error.field === field || error.field === null) ? `${errorId} ${hint}` : hint;

  return (
    <Card padding="lg">
      <h2 className="text-xl">{t('title')}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{t('lead')}</p>

      <form onSubmit={save} className="mt-5 space-y-5">
        {error ? (
          <Alert tone="negative" role="alert" title={t('errors.title')}>
            <p id={errorId}>{errorText(error)}</p>
          </Alert>
        ) : null}

        <div>
          <label htmlFor="target-score" className="mb-1.5 block text-sm font-medium">
            {t('score')}
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
            aria-describedby={describedBy('target-score-hint', 'score')}
            aria-invalid={error?.field === 'score' || undefined}
            className={fieldClass('max-w-48 tabular-nums')}
          />
          <p id="target-score-hint" className="mt-1.5 text-sm text-ink-muted">
            {scale
              ? t('scoreHintScale', { min: String(scale.min), max: String(scale.max) })
              : t('scoreHint')}
          </p>
        </div>

        <div>
          <label htmlFor="target-date" className="mb-1.5 block text-sm font-medium">
            {t('date')} <span className="font-normal text-ink-muted">{t('optional')}</span>
          </label>
          <input
            id="target-date"
            name="targetDate"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-describedby={describedBy('target-date-hint', 'date')}
            aria-invalid={error?.field === 'date' || undefined}
            className={fieldClass('max-w-56')}
          />
          <p id="target-date-hint" className="mt-1.5 text-sm text-ink-muted">
            {t('dateHint')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={state === 'saving'}>
            {t('save')}
          </Button>
          <span aria-live="polite" className="text-sm text-ink-muted">
            {state === 'saved' ? t('saved') : ''}
          </span>
        </div>
      </form>
    </Card>
  );
}
