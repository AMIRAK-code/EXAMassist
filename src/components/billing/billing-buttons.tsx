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

const SIGN_UP = `/sign-up?next=${encodeURIComponent('/premium')}`;

async function goToStripe(path: string, body: unknown): Promise<string | null> {
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
    window.location.assign(SIGN_UP);
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
}: {
  plan: PlanKey;
  label: string;
  variant?: 'primary' | 'secondary' | 'ink';
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function choose() {
    if (busy) return;
    setBusy(true);
    setError(null);
    const failure = await goToStripe('/api/billing/checkout', { plan });
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
