import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AttemptError } from '@/lib/attempts/service';
import { ForbiddenError, UnauthorizedError } from '@/lib/auth/session';

/**
 * Shared HTTP helpers for route handlers: one error shape, one CSRF check,
 * one place that decides what leaks to the client.
 */

export interface ApiErrorBody {
  error: { code: string; message: string; detail?: unknown };
}

export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, {
    ...init,
    headers: { 'Cache-Control': 'no-store', ...(init?.headers ?? {}) },
  });
}

export function fail(code: string, message: string, status = 400, detail?: unknown): NextResponse {
  const body: ApiErrorBody = { error: { code, message, ...(detail === undefined ? {} : { detail }) } };
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

/**
 * Maps thrown errors to responses. Unknown errors become a generic 500: we log
 * the detail server-side rather than returning it.
 */
export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof AttemptError) {
    return fail(error.code, error.message, error.status, error.detail);
  }
  if (error instanceof UnauthorizedError) {
    return fail('unauthorized', error.message, 401);
  }
  if (error instanceof ForbiddenError) {
    return fail('forbidden', error.message, 403);
  }
  if (error instanceof ZodError) {
    return fail('invalid-request', 'That request was not valid.', 400, {
      issues: error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  console.error('[api] unhandled error', error);
  return fail('server-error', 'Something went wrong on our side.', 500);
}

/**
 * CSRF defence for state-changing requests.
 *
 * Session cookies are SameSite=Lax, which already blocks cross-site POSTs from
 * forms. This adds an explicit Origin check so a same-site-but-untrusted
 * context cannot drive the API either.
 */
export function assertSameOrigin(request: Request): void {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) return;

  const origin = request.headers.get('origin');
  if (!origin) {
    // No Origin header on a same-origin fetch is possible for some clients;
    // require the custom header instead, which a cross-site form cannot set.
    if (request.headers.get('x-requested-with') !== 'examer') {
      throw new ForbiddenError('This request was blocked for security reasons.');
    }
    return;
  }

  const allowed = new Set<string>();
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      allowed.add(new URL(configured).origin);
    } catch {
      /* ignore a malformed configuration value */
    }
  }
  const host = request.headers.get('host');
  if (host) {
    allowed.add(`http://${host}`);
    allowed.add(`https://${host}`);
  }

  if (!allowed.has(origin)) {
    throw new ForbiddenError('This request was blocked for security reasons.');
  }
}

export async function readJson<T>(request: Request, schema: { parse: (v: unknown) => T }): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new AttemptError('invalid-json', 'The request body was not valid JSON.', 400);
  }
  return schema.parse(raw);
}
