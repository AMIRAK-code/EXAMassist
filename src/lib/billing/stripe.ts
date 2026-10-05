import { createHmac, timingSafeEqual } from 'node:crypto';
import type { BillingSettings } from './config';

/**
 * The small part of the Stripe API that Premium uses, over plain HTTPS: no SDK,
 * so it runs the same in Node and on Cloudflare Workers.
 */

export class StripeError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'StripeError';
  }
}

type FormValue = string | number | boolean | null | undefined | FormValue[] | { [key: string]: FormValue };

/** Stripe takes nested parameters as form fields: line_items[0][price]=… */
export function encodeForm(params: Record<string, FormValue>): URLSearchParams {
  const form = new URLSearchParams();
  const add = (key: string, value: FormValue) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) value.forEach((item, index) => add(`${key}[${index}]`, item));
    else if (typeof value === 'object') for (const [name, item] of Object.entries(value)) add(`${key}[${name}]`, item);
    else form.append(key, String(value));
  };
  for (const [key, value] of Object.entries(params)) add(key, value);
  return form;
}

export type StripeRequest = (
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  params?: Record<string, FormValue>,
  options?: { idempotencyKey?: string },
  // Stripe's own objects, read field by field where they are used
) => Promise<any>;

/** A Stripe caller for this deployment's key. Tests pass their own StripeRequest instead. */
export function stripeClient(settings: BillingSettings): StripeRequest {
  return async (method, path, params = {}, options = {}) => {
    if (!settings.secretKey) throw new StripeError(503, 'Stripe is not configured.', 'not_configured');
    const url = new URL(`${settings.apiBase}/v1/${path}`);
    const form = encodeForm(params);
    const headers: Record<string, string> = { Authorization: `Bearer ${settings.secretKey}` };
    if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;
    const init: RequestInit = { method, headers, signal: AbortSignal.timeout(settings.timeoutMs) };
    if (method === 'POST') {
      init.body = form;
      (init.headers as Record<string, string>)['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      form.forEach((value, name) => url.searchParams.append(name, value));
    }

    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (error) {
      throw new StripeError(503, `Stripe could not be reached: ${error instanceof Error ? error.message : String(error)}`, 'network');
    }
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new StripeError(response.status, body?.error?.message ?? `Stripe returned ${response.status}`, body?.error?.code);
    }
    return body;
  };
}

/**
 * Checks a Stripe-Signature header (t=…,v1=…) against the raw request body.
 * Anything older than the tolerance is refused, so a captured request cannot
 * be replayed later.
 */
export function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string | null,
  { toleranceSeconds = 300, now = Math.floor(Date.now() / 1000) } = {},
): boolean {
  if (!header || !secret) return false;
  const parts = header.split(',').map((part) => {
    const at = part.indexOf('=');
    return [part.slice(0, at).trim(), part.slice(at + 1).trim()] as const;
  });
  const timestamp = Number(parts.find(([key]) => key === 't')?.[1]);
  const signatures = parts.filter(([key]) => key === 'v1').map(([, value]) => value);
  if (!Number.isFinite(timestamp) || signatures.length === 0) return false;
  if (Math.abs(now - timestamp) > toleranceSeconds) return false;

  const expected = Buffer.from(createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex'));
  return signatures.some((signature) => {
    const given = Buffer.from(signature);
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

/** Builds a valid header for a payload: used by the tests and by local webhook checks. */
export function signStripePayload(payload: string, secret: string, timestamp = Math.floor(Date.now() / 1000)): string {
  return `t=${timestamp},v1=${createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex')}`;
}
