'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button } from '@/components/ui';

/**
 * Practice setup. The learner picks a focus, a difficulty and a length; the
 * server decides whether the reviewed bank can actually satisfy the request and
 * says so plainly if it cannot.
 */

export interface DomainOption {
  slug: string;
  name: string;
  count: number;
}

export function StartPracticeForm({
  examKey,
  blueprintId,
  domains,
  maxLength,
  presetDomain,
  presetSkill,
}: {
  examKey: string;
  blueprintId: string;
  domains: DomainOption[];
  maxLength: number;
  presetDomain?: string;
  presetSkill?: string;
}) {
  const router = useRouter();
  const [domain, setDomain] = useState(presetDomain ?? '');
  const [difficulty, setDifficulty] = useState<'mixed' | 'easy' | 'medium' | 'hard'>('mixed');
  const [length, setLength] = useState(Math.min(10, maxLength));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lengthOptions = [5, 10, 15, 20, 30].filter((n) => n <= Math.max(5, maxLength));

  async function start() {
    setSubmitting(true);
    setError(null);

    // Make sure the visitor has a session; guests get one automatically so
    // practice can start without an account.
    await fetch('/api/auth/guest', {
      method: 'POST',
      headers: { 'X-Requested-With': 'examer' },
    }).catch(() => null);

    const idempotencyKey = `${examKey}-${blueprintId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const response = await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({
        examKey,
        blueprintId,
        idempotencyKey,
        overrides: {
          domains: domain ? [domain] : undefined,
          skills: presetSkill ? [presetSkill] : undefined,
          difficulty,
          length,
        },
      }),
    }).catch(() => null);

    if (!response) {
      setSubmitting(false);
      setError('We could not reach the server. Check your connection and try again.');
      return;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setSubmitting(false);
      const detail = data?.error?.detail;
      if (data?.error?.code === 'insufficient-content' && detail?.parts) {
        const short = detail.parts.find((p: { sufficient: boolean }) => !p.sufficient);
        setError(
          `There are not enough reviewed questions for that combination yet` +
            (short ? ` (${short.available} available, ${short.requested} needed).` : '.') +
            ' Try a wider topic, a mixed difficulty, or a shorter session.',
        );
        return;
      }
      setError(data?.error?.message ?? 'That session could not be started.');
      return;
    }

    router.push(`/attempt/${data.attemptId}`);
  }

  return (
    <div className="space-y-5">
      {error ? (
        <Alert tone="caution" role="alert">
          {error}
        </Alert>
      ) : null}

      <div>
        <label htmlFor="practice-domain" className="mb-1.5 block text-sm font-medium">
          Focus
        </label>
        <select
          id="practice-domain"
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          className="w-full rounded border border-line-strong bg-surface px-3 py-2.5 text-base"
        >
          <option value="">Everything ({domains.reduce((n, d) => n + d.count, 0)} questions)</option>
          {domains.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.name} ({option.count})
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-sm text-ink-muted">
          Only topics with reviewed questions are listed.
        </p>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Difficulty</legend>
        <div className="flex flex-wrap gap-2">
          {(['mixed', 'easy', 'medium', 'hard'] as const).map((value) => (
            <label
              key={value}
              className={`cursor-pointer rounded border px-3 py-2 text-sm capitalize ${
                difficulty === value
                  ? 'border-accent bg-accent-soft font-medium text-accent-strong'
                  : 'border-line bg-surface hover:bg-surface-sunken'
              }`}
            >
              <input
                type="radio"
                name="difficulty"
                value={value}
                checked={difficulty === value}
                onChange={() => setDifficulty(value)}
                className="sr-only"
              />
              {value}
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-sm text-ink-muted">
          Difficulty labels are our editorial judgement, not calibrated against test-taker data.
        </p>
      </fieldset>

      <div>
        <label htmlFor="practice-length" className="mb-1.5 block text-sm font-medium">
          Number of questions
        </label>
        <select
          id="practice-length"
          value={length}
          onChange={(event) => setLength(Number(event.target.value))}
          className="w-full max-w-40 rounded border border-line-strong bg-surface px-3 py-2.5 text-base"
        >
          {lengthOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <Button onClick={() => void start()} disabled={submitting} size="lg">
        {submitting ? 'Preparing your session…' : 'Start practising'}
      </Button>

      <p className="text-sm text-ink-muted">
        No account needed. Your progress is saved to this browser, and you can create an account
        later to keep it.
      </p>
    </div>
  );
}
