'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import type { PlanKey } from '@/lib/billing/config';

/**
 * The two buttons that leave for Stripe: Checkout for a new plan, and the
 * billing portal for an existing one. Neither sends an account id; the server
 * acts on whoever the session cookie resolves to.
 */

interface ApiBody {
  url?: string;
  error?: { code?: string; message?: string };
}

/** Back to the plans after signing up, for the same exam when there is one. */
function signUpPath(exam?: string): string {
  const plans = exam ? `/premium?exam=${encodeURIComponent(exam)}` : '/premium';
  return `/sign-up?next=${encodeURIComponent(plans)}`;
}

async function goToStripe(path: string, body: unknown, exam?: string): Promise<string | null> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
    body: JSON.stringify(body ?? {}),
  }).catch(() => null);
  if (!response) return 'We could not reach the server. Check your connection and try again.';

  const data: ApiBody | null = await response.json().catch(() => null);
  if (response.ok && data?.url) {
    window.location.assign(data.url);
    return null;
  }
  const code = data?.error?.code;
  if (code === 'unauthorized' || code === 'account-required') {
    window.location.assign(signUpPath(exam));
    return null;
  }
  if (code === 'already-premium') {
    window.location.assign('/account#billing');
    return null;
  }
  return data?.error?.message ?? 'That could not be started right now. Nothing was charged.';
}

export function ChoosePlanButton({
  plan,
  label,
  variant = 'primary',
  exam,
}: {
  plan: PlanKey;
  label: string;
  variant?: 'primary' | 'secondary' | 'ink';
  /** The exam the learner is preparing for, kept through sign-up, checkout and the return. */
  exam?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function choose() {
    if (busy) return;
    setBusy(true);
    setError(null);
    const failure = await goToStripe('/api/billing/checkout', exam ? { plan, exam } : { plan }, exam);
    // On success the page is already leaving for Stripe; keep the button busy.
    if (failure) {
      setBusy(false);
      setError(failure);
    }
  }

  return (
    <div>
      <Button variant={variant} full loading={busy} onClick={() => void choose()}>
        {busy ? 'Opening secure checkout…' : label}
      </Button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-negative">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ManageBillingButton({ label = 'Manage billing' }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    if (busy) return;
    setBusy(true);
    setError(null);
    const failure = await goToStripe('/api/billing/portal', {});
    if (failure) {
      setBusy(false);
      setError(failure);
    }
  }

  return (
    <div>
      <Button variant="secondary" loading={busy} onClick={() => void open()}>
        {busy ? 'Opening…' : label}
      </Button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-negative">
          {error}
        </p>
      ) : null}
    </div>
  );
}
