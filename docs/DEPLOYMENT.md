# Deployment

How the production site is hosted and deployed. Account names, project
references and credentials are kept out of this repository; the owners hold
them privately.

## Supabase PostgreSQL on Vercel

The server uses Supabase PostgreSQL when DATABASE_URL is set. Local development
and tests can still use SQLite when DATABASE_URL is absent. Vercel requires
DATABASE_URL and refuses to fall back to an ephemeral SQLite file.

The application retains its existing accounts and session authentication. Its
26 tables live in the private examer schema; the restricted examer_app login
can read and write that schema only. Browser publishable keys cannot access it.
Connections use the transaction pooler and verified TLS with the bundled public
Supabase root certificate. No service-role key is required.

The app has its own Supabase project, separate from any other app. To set up a fresh project, run db/postgres/schema.sql and then
db/postgres/app-role.sql as the schema owner; the app connects as
examer_app.<project-ref> through that project's pooler host, which is shown in
the dashboard's Connect dialog.

Configure DATABASE_URL and the other values in .env.example through Vercel
environment variables before deploying the updated source. Keep credentials and
project-specific migration notes in private local files, never in Git.

Run npm run db:check for a PostgreSQL application smoke test that rolls back its
test records. npm run supabase:check independently checks the public API URL/key.

## Cloudflare Workers (uniexamer.com)

The site also runs as the Worker `examer` in the Cloudflare account that holds
the uniexamer.com zone, built with OpenNext (`wrangler.jsonc`,
`open-next.config.ts`). The custom domains give it its DNS records and
certificates. Until 27 October 2026 the site was at exam.assist365.app; that
host and www.uniexamer.com stay attached only to redirect (301) to the same
path on uniexamer.com (`next.config.ts`). A Worker cannot keep a connection pool between requests, so the
database goes through the Hyperdrive config `examer-db`: the same examer_app
login against the Supabase session pooler (port 5432), TLS verify-full with the
Supabase root certificate, and query caching off. Each request opens a small
pool against Hyperdrive.

Public settings are the `vars` in `wrangler.jsonc`; `SESSION_SECRET` is a
Worker secret (`npx wrangler secret put SESSION_SECRET`). OpenNext copies
`.env` and `.env.local` into the Worker bundle, so `npm run cf:deploy` refuses
to run next to them. Deploy from a clean checkout after `npx wrangler login`:

    git worktree add ../examer-cf HEAD
    cd ../examer-cf && npm ci --ignore-scripts && npm run cf:deploy

On the Workers Free plan a request may use 10 ms of CPU. One scrypt password
check takes about 50 ms on a desktop CPU, so sign-in, sign-up and password
reset can fail there (error 1102) until the account is on Workers Paid.

Rendering any page costs more than 10 ms too (a median of 28 ms, and 381 ms
for the home page, measured in Workers Observability on 2026-10-27). So
`cf:deploy` uploads twice. The first upload is a new version that receives no
traffic (`wrangler versions upload`); the script fetches every public page, in
every language, from that version's preview URL
(`<version>-examer.<subdomain>.workers.dev`, enabled by `preview_urls` in
`wrangler.jsonc`) and saves it into `.open-next/assets`. Only the second
upload is deployed, so visitors move straight to a version that serves those
files without running the Worker at all (`scripts/snapshot-pages.ts`,
`src/lib/seo/static-pages.ts`). Until 29 October 2026 the first upload was
deployed at once, and visitors got error 1102 for as long as the snapshot ran. `/pricing` and
everything behind sign-in stay dynamic. Saved pages never pass through
`src/proxy.ts`, so a small inline script makes the same language choice on
them (cookie, then browser languages). The saved pages change only when you
deploy, so deploy again after publishing questions straight to the database.

Fetching about 150 pages in a row keeps the Worker over the Free plan's CPU
limit for minutes at a time (pages answer 503), so the snapshot pauses between
pages and retries each one for about nine minutes. A full snapshot takes 5 to
15 minutes, and only the deploy waits for it. If it still gives up, nothing is
deployed and visitors stay on the current version; run `npm run cf:snapshot` in
the same folder to carry on with the same build and its preview URL. It keeps the
pages already saved, then deploys.

Static files are answered for any hostname before the Worker's own redirects
run, so the snapshot step needs two Single Redirects in Cloudflare (Rules →
Redirect Rules): `www.uniexamer.com/*` to `https://uniexamer.com/${1}` in the
uniexamer.com zone, and hostname `exam.assist365.app` to
`concat("https://uniexamer.com", http.request.uri.path)` in the assist365.app
zone, both 301 and keeping the query string. Without them `cf:deploy` stops
before deploying.
