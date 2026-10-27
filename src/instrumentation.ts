/**
 * Runs once when the server starts (Next.js instrumentation hook).
 *
 * With BILLING_ENFORCED=true and a Stripe key missing or malformed, the server
 * refuses to start rather than quietly opening every paid feature. The same
 * check runs again before every entitlement decision
 * (src/lib/billing/entitlements.ts), so a runtime that skips this hook still
 * fails loudly instead of giving access away.
 */
export async function register(): Promise<void> {
  const { assertBillingConfig } = await import('./lib/billing/config');
  try {
    assertBillingConfig();
  } catch (error) {
    console.error(`[startup] ${error instanceof Error ? error.message : String(error)}`);
    if (process.env.NEXT_RUNTIME === 'nodejs' && typeof process.exit === 'function') process.exit(1);
    throw error;
  }
}
