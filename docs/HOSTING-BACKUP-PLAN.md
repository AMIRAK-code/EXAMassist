# Hosting backup plan: Cloudflare first, Vercel as backup

Written 1 October 2026. Nothing here is switched on. It records what to do if
the Cloudflare deployment runs into its limits or fails, and what to set up
before relying on Vercel as a second host.

## Current setup

| | Cloudflare (primary) | Vercel (secondary) |
| --- | --- | --- |
| Address | https://exam.assist365.app | https://exa-massist.vercel.app |
| Account | Worker `examer` in M.a.moein1380@gmail.com's Cloudflare account (holds the assist365.app zone) | Project `exa-massist` in amirhosseinakbari-7788s-projects |
| Deploys | `npm run cf:deploy` from a clean checkout (README, "Cloudflare Workers") | Every push to `main` (`vercel.json`) |
| Plan | Workers Free | Hobby |
| Database | Supabase via Hyperdrive `examer-db` (session pooler, port 5432) | Supabase via `DATABASE_URL` (transaction pooler, port 6543), **if** it has been set there; check |

Both talk to the same Supabase project, "Examer" (lhnvuikmyjvizrekqbtq, schema
`examer`, login `examer_app`, pooler host aws-1-eu-central-1.pooler.supabase.com).
Until 5 October 2026 the database lived in a project shared with VibeAssist
(thwxxgibcbxkfodzoedb); its `examer` schema is a leftover copy, not in use.
A Vercel `DATABASE_URL` set before that date still points at the old copy.

## Why two hosts can share users

- **Sessions are in the database.** The `examer_session` cookie holds a random
  token; Postgres stores only its SHA-256. Any host connected to the database
  recognises a signed-in user. No signing key is involved.
- **The cookie has no Domain attribute,** so it belongs to whatever address the
  browser sees. As long as the browser only ever sees exam.assist365.app, the
  cookie follows the user whichever host answers.
- **Rate limits are rows in the database,** so both hosts count against the
  same buckets.
- **`SESSION_SECRET` must be identical on both hosts.** It keys the email-code
  HMAC, so a code requested on one host can only be checked on the other if
  they share it.
- **Sign-in, sign-up and password reset are plain JSON endpoints**
  (`/api/auth/*`), so they can be routed on their own. Pages and Server Actions
  (`src/app/actions/`) cannot: each build has its own script files and action
  IDs, so one user's page and its scripts must come from the same build.

## When to act

| Symptom | Meaning | First response |
| --- | --- | --- |
| Error **1102** on sign-in, sign-up or reset | Worker went over the Free plan's 10 ms CPU (one scrypt check is ~50 ms) | Upgrade to Workers Paid |
| Error **1027** | Free plan's 100,000 Worker requests per day used up | Upgrade to Workers Paid |
| Site broken after a deploy | Bad release | `npx wrangler rollback` (pick the previous version) |
| Cloudflare itself down, or Paid is not an option | | Plan A below |

**Workers Paid** ($5 a month, Workers & Pages → Plans in Moein's account) lifts
CPU to 30 s per request and removes the daily cap. It needs no code change and
is the answer to the first two rows. A single sign-in on Free worked on
1 October 2026, so the CPU limit is not enforced on every request, but it can
be under load.

## Plan A: fail over to Vercel (recommended backup)

A small router Worker takes over the custom domain and calls `examer`. If
`examer` crashes or goes over its limits, the router serves the page from
Vercel instead. A Worker that goes over its CPU limit cannot catch its own
error, which is why the router has to be a separate Worker.

```
browser ── exam.assist365.app ── examer-router ──(service binding)── examer
                                        │
                                        └── on failure ── exa-massist.vercel.app
```

Rules:

- **Retry only GET and HEAD.** A POST (saving an answer, signing up) is never
  sent twice; it gets a 503 if `examer` fails. During a failover the site is
  readable, and users can carry on once `examer` is back.
- **Also retry `/_next/static/*` 404s on Vercel.** A page rendered by Vercel
  asks for Vercel's script files, which `examer` does not have.
- **On Free, every page counts twice** against the 100,000 daily requests
  (router + `examer`).

Router sketch (untested; `wrangler.jsonc` with a service binding `EXAMER` to
`examer`, the custom domain moved from `examer` to the router, and the var
`FALLBACK_ORIGIN = "https://exa-massist.vercel.app"`):

```ts
interface Env { EXAMER: Fetcher; FALLBACK_ORIGIN: string }

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const retryable = request.method === 'GET' || request.method === 'HEAD';
    try {
      const response = await env.EXAMER.fetch(request);
      const missingAsset = response.status === 404 && url.pathname.startsWith('/_next/static/');
      if (!retryable || (response.status < 500 && !missingAsset)) return response;
    } catch {
      if (!retryable) return new Response('Service unavailable, try again shortly.', { status: 503 });
    }
    const headers = new Headers(request.headers);
    headers.set('x-forwarded-for', request.headers.get('cf-connecting-ip') ?? '');
    return fetch(new URL(url.pathname + url.search, env.FALLBACK_ORIGIN), {
      method: request.method,
      headers,
      redirect: 'manual', // pass the app's own redirects through unchanged
    });
  },
};
```

Vercel must have, before this is useful:

1. `DATABASE_URL` (the transaction-pooler URL), `SESSION_SECRET` (same value as
   the Worker secret), `NEXT_PUBLIC_SITE_URL=https://exam.assist365.app`,
   `SEARCH_INDEXING_ENABLED=false`, all for Production.
2. A deployment built from the same commit as Cloudflare.
3. Deployment Protection off for the production address, or the router gets
   Vercel's login page.

Amir has to do these in his Vercel account, or invite your Vercel account.

## Plan B: send the password endpoints to Vercel

Only if CPU is the problem and Workers Paid is not an option. The same router
sends the three endpoints that run scrypt to Vercel and everything else to
`examer`:

- `POST /api/auth/sign-in` (verifies a password)
- `POST /api/auth/sign-up` (hashes a password)
- `POST /api/auth/reset-password` (hashes the new password)

The page stays on Cloudflare; only its form submission goes to Vercel. Vercel's
`Set-Cookie` passes through the router, so the browser gets the session for
exam.assist365.app. Everything from Plan A's Vercel list applies, plus two
more points:

- **`NEXT_PUBLIC_SITE_URL` on Vercel is required here,** not optional. The
  cross-site check (`assertSameOrigin`) compares the browser's Origin
  (exam.assist365.app) against it, because the Host Vercel sees is
  exa-massist.vercel.app.
- **Rate limits need the real visitor address, and this needs a code change
  first.** These endpoints are rate-limited per IP. Vercel appends the router's
  Cloudflare address to `X-Forwarded-For`, so without a change every visitor
  shares one bucket. Setting `TRUSTED_PROXY_HOPS=2` would read the router's
  entry instead, but then anyone calling exa-massist.vercel.app directly could
  forge it. The safe version is for the router to send the address with a shared
  secret header (say `x-examer-client-ip` plus `x-examer-proxy-secret`), and for
  `clientAddress` in `src/lib/auth/rate-limit.ts` to trust that address only
  when the secret matches.

Release discipline for Plan B: both hosts on the same commit at all times, and
each database migration run once, since they share the database.

## Why not AWS as the traffic manager

- **Route 53 cannot route by path.** It splits by hostname or weight, so it
  cannot send password traffic one way and page views another.
- **A weighted split on one hostname breaks pages.** A user's requests would
  land on both builds at random, so pages would load script files and Server
  Actions that only exist on the other host.
- **It removes Cloudflare from the subdomain.** Delegating exam.assist365.app
  to Route 53 ends the Workers custom domain, and two hosts needing a
  certificate for one name interfere with each other (Vercel's HTTP check would
  reach Cloudflare part of the time).
- **CloudFront could route by path, but adds a third provider** in front of
  Cloudflare, with its own cost and certificates, for nothing Cloudflare cannot
  already do in a router Worker.

## Undoing either plan

Move the custom domain back to `examer` (restore its `routes` entry in
`wrangler.jsonc`, `npm run cf:deploy`) and delete the router Worker. Nothing in
the database changes in either plan, so there is nothing to migrate back.
