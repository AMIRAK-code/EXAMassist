import Link from 'next/link';
import { Alert } from '@/components/ui';
import type { Access } from '@/lib/billing/service';

/**
 * Says where the learner stands before they start: the free session still to
 * use, or used. Shown only where Premium is on sale and the learner has none.
 */
export function PremiumNotice({ access, paywall, className }: { access: Access | null; paywall: boolean; className?: string }) {
  if (!paywall || access?.premium || access?.staff) return null;

  if (!access || access.freeSessionsLeft > 0) {
    return (
      <Alert tone="info" title="Your free session" className={className}>
        <p>
          You can run one session, on this exam or any other, with its full results and explanations.
          After that, <Link href="/premium">Premium</Link> opens every exam and every format.
        </p>
      </Alert>
    );
  }

  return (
    <Alert tone="caution" title="You have used your free session" className={className}>
      <p>
        Its results stay in your history. To start another session, on any exam,{' '}
        <Link href="/premium">choose a Premium plan</Link>.
      </p>
    </Alert>
  );
}
