'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button } from '@/components/ui';

/**
 * The only interactive part of the study plan: the two inputs the plan cannot
 * derive. Everything else on the page is rendered on the server.
 *
 * The form works as a normal form submit; the status line is announced rather
 * than signalled by colour alone.
 */

const MINUTE_CHOICES = [60, 90, 120, 150, 180, 240, 300, 420];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function maxIso(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 2);
  return date.toISOString().slice(0, 10);
}

export function PlanForm({
  initialTargetDate,
  initialWeeklyMinutes,
  usingDefaultMinutes,
}: {
  initialTargetDate: string | null;
  initialWeeklyMinutes: number;
  usingDefaultMinutes: boolean;
}) {
  const router = useRouter();
  const [targetDate, setTargetDate] = useState(initialTargetDate ?? '');
  const [weeklyMinutes, setWeeklyMinutes] = useState(initialWeeklyMinutes);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const choices = MINUTE_CHOICES.includes(weeklyMinutes)
    ? MINUTE_CHOICES
    : [...MINUTE_CHOICES, weeklyMinutes].sort((a, b) => a - b);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setStatus(null);

    const response = await fetch('/api/study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({
        targetDate: targetDate.trim() === '' ? null : targetDate,
        weeklyMinutes,
      }),
    }).catch(() => null);

    if (!response) {
      setSaving(false);
      setError('We could not reach the server. Check your connection and try again.');
      return;
    }

    const data = (await response.json().catch(() => null)) as
      | { targetDate?: string | null; weeklyMinutes?: number; error?: { message?: string } }
      | null;

    setSaving(false);

    if (!response.ok) {
      setError(data?.error?.message ?? 'Those settings could not be saved.');
      return;
    }

    if (typeof data?.weeklyMinutes === 'number') setWeeklyMinutes(data.weeklyMinutes);
    setTargetDate(data?.targetDate ?? '');
    setStatus('Saved. Your plan below has been rebuilt from these settings.');
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-5">
      {error ? (
        <Alert tone="negative" role="alert">
          {error}
        </Alert>
      ) : null}

      <div>
        <label htmlFor="plan-target-date" className="mb-1.5 block text-sm font-medium">
          Exam date (optional)
        </label>
        <input
          id="plan-target-date"
          name="targetDate"
          type="date"
          value={targetDate}
          min={todayIso()}
          max={maxIso()}
          onChange={(event) => setTargetDate(event.target.value)}
          aria-describedby="plan-target-date-help"
          className="w-full rounded border border-line-strong bg-surface px-3 py-2.5 text-base"
        />
        <p id="plan-target-date-help" className="mt-1.5 text-sm text-ink-muted">
          Used only to count the weeks you have left. Leave it empty for a rolling six-week plan.
        </p>
      </div>

      <div>
        <label htmlFor="plan-weekly-minutes" className="mb-1.5 block text-sm font-medium">
          Time you can give it each week
        </label>
        <select
          id="plan-weekly-minutes"
          name="weeklyMinutes"
          value={weeklyMinutes}
          onChange={(event) => setWeeklyMinutes(Number(event.target.value))}
          aria-describedby="plan-weekly-minutes-help"
          className="w-full rounded border border-line-strong bg-surface px-3 py-2.5 text-base"
        >
          {choices.map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} minutes ({Math.round((minutes / 60) * 10) / 10} hours)
            </option>
          ))}
        </select>
        <p id="plan-weekly-minutes-help" className="mt-1.5 text-sm text-ink-muted">
          {usingDefaultMinutes
            ? 'You have not set this yet, so the plan assumes 150 minutes a week.'
            : 'Sessions are 25 minutes each, so this decides how many sessions a week you get.'}
        </p>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save and rebuild plan'}
      </Button>

      <p role="status" aria-live="polite" className="text-sm text-ink-muted">
        {status}
      </p>
    </form>
  );
}
