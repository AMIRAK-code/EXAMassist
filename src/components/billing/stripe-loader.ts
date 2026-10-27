'use client';

// The 'pure' entry does not inject Stripe.js on import: it loads only when a
// page actually shows card fields (checkout, or "Update card" on the account
// page), which is also the only place its fraud-prevention cookies are set.
import { loadStripe } from '@stripe/stripe-js/pure';
import type { Stripe } from '@stripe/stripe-js';

/**
 * One Stripe.js per publishable key. The key comes from the server at request
 * time (billingSettings), so it is never baked into the build.
 */
const loaded = new Map<string, Promise<Stripe | null>>();

export function stripeFor(publishableKey: string): Promise<Stripe | null> {
  let promise = loaded.get(publishableKey);
  if (!promise) {
    promise = loadStripe(publishableKey);
    loaded.set(publishableKey, promise);
  }
  return promise;
}
