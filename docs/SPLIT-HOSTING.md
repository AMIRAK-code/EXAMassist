# Split hosting: Cloudflare files and payments, Vercel for the app

Since November 2026 uniexamer.com is served by two hosts behind one address.
The Workers Free plan allows 10 ms of CPU per request, which serving a file
never needs but rendering a page often exceeds (error 1102). So Cloudflare
serves files and the small payment surface, and Vercel, which has no such
limit, renders the rest of the app.

```
browser ── uniexamer.com ── Cloudflare
   │  a saved file?      → answered by Cloudflare, no Worker runs
   └─ no → examer-router (≈1 ms of CPU, router/worker.ts)
              ├─ pricing, checkout, account, /api/billing, /api/account → examer (OpenNext Worker)
              └─ everything else → one pinned Vercel deployment
```

| Served by | What | Why |
| --- | --- | --- |
| Cloudflare files | Home, exams, exam formats, courses and lessons, guides, about pages, sitemap.xml, robots.txt, llms.txt, scripts, styles, fonts and images | Free, fast, and no Worker runs |
| `examer` Worker | `/pricing`, `/checkout`, `/checkout/complete`, `/account`, `/api/billing/*` (including the Stripe webhook), `/api/account*` | Payments stay off Vercel's Hobby plan; only this Worker holds Stripe keys |
| Vercel | Sign-in and sign-up, codes, Google, guest, practice, the free test, `/start`, attempts and results, the study plan, review, the tutor, admin, every other `/api/*` | No 10 ms limit |

The rules are in `router/routing.ts` (tested in `tests/unit/router.test.ts`).

## Why it holds together

- **One build per release.** The router forwards to one Vercel deployment's
  own address (`VERCEL_ORIGIN`), and the saved files come from that same
  deployment, so a page and its scripts and Server Actions always match.
  Pricing and payments come from the `examer` build of the same commit; a link
  between the two builds simply loads the next page in full.
- **Sessions are in the database** and the cookie has no Domain attribute, so a
  sign-in on Vercel is a sign-in on the `examer` pages too (docs/HOSTING-BACKUP-PLAN.md).
- **The visitor's address** reaches Vercel as `x-examer-client-ip`, trusted
  only with `ROUTER_SECRET` (`clientAddress`, src/lib/auth/rate-limit.ts), so
  per-IP rate limits keep working.
- **The paywall applies on Vercel without Stripe keys.** `BILLING_PAYMENTS_ELSEWHERE=true`
  keeps entitlements enforced (they are read from the database) and refuses to
  start if a Stripe key is set there (src/lib/billing/config.ts).
- **Redirects from Vercel** are pointed back at uniexamer.com by the router;
  Server Actions accept uniexamer.com as an origin (next.config.ts); the
  Vercel address itself is marked noindex.

## One-time setup

### Vercel project `exa-massist` (Production environment)

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | The Supabase transaction-pooler URL for login `examer_app` (port 6543) |
| `SESSION_SECRET` | The same value as the `examer` Worker's secret |
| `BREVO_API_KEY`, `EMAIL_FROM_ADDRESS` | The same values as the Worker's |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | The same values as the Worker's |
| `NEXT_PUBLIC_SITE_URL` | `https://uniexamer.com` |
| `SEARCH_INDEXING_ENABLED` | `true` (the sitemap the files are saved from must list the pages; the Vercel address is noindex anyway) |
| `BILLING_ENFORCED` | `true` |
| `BILLING_PAYMENTS_ELSEWHERE` | `true` |
| `ROUTER_SECRET` | A long random value, the same as the router's |

No Stripe key goes to Vercel. Under Settings → Deployment Protection, keep
protection on and create a **Protection Bypass for Automation** secret: the
router and the deploy script send it.

### Cloudflare

```
npx wrangler secret put ROUTER_SECRET -c router/wrangler.jsonc
npx wrangler secret put VERCEL_BYPASS -c router/wrangler.jsonc
```

The Redirect Rules for www.uniexamer.com and exam.assist365.app (README,
"Cloudflare Workers") must stay: files are answered for every host name before
the router's own redirect runs.

## Releasing

From a Linux or WSL checkout of `main`, with Linux Node:

1. Push to `main`. Vercel builds it (`vercel.json`). Note the deployment's own
   address, `https://exa-massist-<id>.vercel.app`, once it is Ready.
2. Try it, with no visitor sent there:
   `VERCEL_BYPASS=… npx tsx scripts/split-deploy.ts --vercel https://exa-massist-<id>.vercel.app --upload`
   and open the preview address it prints.
3. Release: the same command with `--deploy`. It builds and deploys `examer`,
   then deploys the router pointing at that Vercel deployment.

Both hosts share the database: run a migration once, before the release that
needs it.

## Rolling back

- **A bad release:** `npx wrangler rollback -c router/wrangler.jsonc` puts the
  router (and so the previous Vercel deployment and the previous files) back;
  `npx wrangler rollback` does the same for `examer`.
- **Back to one host:** `wrangler.jsonc` keeps the three routes on purpose
  (split-deploy deploys `examer` from a copy without them, `wrangler.split.json`).
  Remove the routes from `router/wrangler.jsonc`, run
  `npx wrangler deploy -c router/wrangler.jsonc` to release the domains, then
  `npm run cf:deploy` serves the whole site from `examer` as before.
