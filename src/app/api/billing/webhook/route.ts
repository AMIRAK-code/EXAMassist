import { getDb } from '@/lib/db';
import { fail, ok } from '@/lib/api/http';
import { BillingError, handleWebhook } from '@/lib/billing/service';

export const dynamic = 'force-dynamic';

/**
 * Stripe's webhook deliveries (docs/BILLING.md lists the events to enable).
 *
 * Stripe sends no Origin and no session, so there is no same-origin check
 * here: every request must instead carry a valid Stripe-Signature for
 * STRIPE_WEBHOOK_SECRET over the exact raw body, which is why the body is read
 * as text and never parsed before verification.
 *
 * 400 for a signature that does not verify (Stripe does not retry those);
 * 200 for a processed or already-processed event; 500 when the update could
 * not be stored, so Stripe retries later and a brief outage loses nothing.
 */
export async function POST(request: Request) {
  const payload = await request.text();
  try {
    const result = await handleWebhook(getDb(), payload, request.headers.get('stripe-signature'));
    return ok({ received: true, duplicate: result.duplicate, handled: result.handled });
  } catch (error) {
    if (error instanceof BillingError) return fail(error.code, error.message, error.status);
    console.error('[billing] webhook failed:', error instanceof Error ? error.message : error);
    return fail('retry', 'The update could not be stored; Stripe will retry.', 500);
  }
}
