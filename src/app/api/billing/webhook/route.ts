import { getDb } from '@/lib/db';
import { fail, ok } from '@/lib/api/http';
import { BillingError, handleWebhook } from '@/lib/billing/service';

export const dynamic = 'force-dynamic';

/**
 * Stripe's webhook deliveries. Stripe sends no Origin and no session, so there
 * is no same-origin check here: every request must instead carry a valid
 * Stripe-Signature for STRIPE_WEBHOOK_SECRET, over the exact raw body.
 *
 * A 500 makes Stripe retry later, so a brief outage does not lose an update.
 */
export async function POST(request: Request) {
  const payload = await request.text();
  try {
    const result = await handleWebhook(getDb(), payload, request.headers.get('stripe-signature'));
    return ok({ received: true, handled: result.handled });
  } catch (error) {
    if (error instanceof BillingError) return fail(error.code, error.message, error.status);
    console.error('[billing] webhook failed:', error instanceof Error ? error.message : error);
    return fail('retry', 'The update could not be stored; Stripe will retry.', 500);
  }
}
