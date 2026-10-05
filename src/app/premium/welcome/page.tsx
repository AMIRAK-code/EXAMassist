import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { PLANS, isPlanKey } from '@/lib/billing/config';
import { BillingError, completeCheckout } from '@/lib/billing/service';
import { Alert, Breadcrumbs, ButtonLink, Container, PageHeader } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Welcome to Premium',
  robots: { index: false, follow: false },
};

/**
 * Where Stripe Checkout sends the learner back. The plan is pulled from Stripe
 * here rather than waited for, because the webhook may land a moment later.
 */
export default async function PremiumWelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const query = await searchParams;
  const sessionId = typeof query.session_id === 'string' ? query.session_id : '';
  const here = `/premium/welcome${sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : ''}`;
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(here)}`);
  if (!sessionId) redirect('/premium');

  let outcome: Awaited<ReturnType<typeof completeCheckout>> | null = null;
  let problem: string | null = null;
  try {
    outcome = await completeCheckout(getDb(), user.id, sessionId);
  } catch (error) {
    if (!(error instanceof BillingError)) throw error;
    problem = error.message;
  }

  const premium = outcome?.access.premium ?? false;
  const planKey = outcome?.access.subscription?.plan;
  const planLabel = isPlanKey(planKey) ? PLANS[planKey].name : null;

  return (
    <Container size="narrow">
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { href: '/premium', label: 'Premium' }, { label: 'Welcome' }]} />
      <PageHeader
        eyebrow="Premium"
        title={premium ? 'Premium is on' : 'Almost there'}
        lead={
          premium
            ? `Thank you. Your ${planLabel ? `${planLabel} ` : ''}plan is active, and every exam and practice format is open to you.`
            : undefined
        }
      />

      {premium ? (
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/exams">Choose an exam</ButtonLink>
          <ButtonLink href="/account#billing" variant="secondary">
            See your plan
          </ButtonLink>
        </div>
      ) : problem ? (
        <Alert tone="negative" title="We could not confirm this checkout">
          <p>{problem}</p>
          <p className="mt-2">
            If you were charged, Premium turns on as soon as Stripe confirms the payment; reload this page
            in a minute, or check <Link href="/account#billing">your account</Link>.
          </p>
        </Alert>
      ) : (
        <Alert tone="info" title="Your payment is still being confirmed" role="status">
          <p>
            {outcome?.paid
              ? 'Stripe has the payment and is finishing the subscription.'
              : 'Stripe has not confirmed the payment yet. Some payment methods take a little longer.'}{' '}
            Premium turns on by itself as soon as it is confirmed. <Link href={here}>Check again</Link>.
          </p>
        </Alert>
      )}
    </Container>
  );
}
