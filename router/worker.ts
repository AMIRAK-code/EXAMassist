import { CANONICAL_HOST, originFor, publicLocation } from './routing';

/**
 * The router Worker in front of uniexamer.com (docs/SPLIT-HOSTING.md).
 *
 * Cloudflare answers every request that matches a static file (the public
 * pages and their scripts, saved at deploy time) before this code runs. For the
 * rest it only forwards, which takes about a millisecond of CPU: pricing and
 * payments to the `examer` Worker, everything else to the Vercel deployment
 * the static files were saved from (VERCEL_ORIGIN), so a page and its scripts
 * always come from the same build.
 */

interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

export interface Env {
  /** The OpenNext Worker that serves pricing, checkout and the account. */
  EXAMER: Fetcher;
  /** The pinned Vercel deployment, e.g. https://exa-massist-abc123.vercel.app. */
  VERCEL_ORIGIN: string;
  /** Shared with Vercel (ROUTER_SECRET there): vouches for x-examer-client-ip. */
  ROUTER_SECRET: string;
  /** Vercel's Protection Bypass for Automation secret, when deployment protection is on. */
  VERCEL_BYPASS?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // www.uniexamer.com and the old exam.assist365.app go to the one address.
    if (url.host !== CANONICAL_HOST && !url.host.endsWith('.workers.dev')) {
      return Response.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
    }

    if (originFor(url.pathname) === 'examer') return env.EXAMER.fetch(request);

    // A script or style that is not a saved file: the `examer` build's own, or Vercel's.
    if (url.pathname.startsWith('/_next/') && (request.method === 'GET' || request.method === 'HEAD')) {
      const own = await env.EXAMER.fetch(request.clone());
      if (own.status !== 404) return own;
    }

    return forwardToVercel(request, url, env);
  },
};

async function forwardToVercel(request: Request, url: URL, env: Env): Promise<Response> {
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('x-forwarded-host', url.host);
  headers.set('x-forwarded-proto', 'https');
  headers.set('x-examer-client-ip', request.headers.get('cf-connecting-ip') ?? '');
  headers.set('x-examer-router-secret', env.ROUTER_SECRET);
  if (env.VERCEL_BYPASS) headers.set('x-vercel-protection-bypass', env.VERCEL_BYPASS);

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const upstream = await fetch(new URL(`${url.pathname}${url.search}`, env.VERCEL_ORIGIN), {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    // The app's own redirects pass through, pointed back at the public address.
    redirect: 'manual',
  });

  const response = new Response(upstream.body, upstream);
  const location = response.headers.get('location');
  if (location) response.headers.set('location', publicLocation(location, env.VERCEL_ORIGIN, `https://${url.host}`));
  // Vercel marks its own address noindex (next.config.ts); through uniexamer.com that does not apply.
  response.headers.delete('x-robots-tag');
  return response;
}
