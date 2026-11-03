# Sign in with Google: setup

"Continue with Google" appears on the sign-in and sign-up pages only when the
deployment has both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Without them
the button is hidden and nothing else changes, the same way the email-code
features stay hidden until Brevo is configured.

How it works is described at the top of `src/lib/auth/google.ts`: OpenID
Connect with the authorization code flow and PKCE, `state` checked against a
cookie and spent once in the database, the ID token's signature, `iss`, `aud`,
`exp`, `iat`, nonce and `email_verified` all checked, and accounts tied to
Google's permanent `sub` (migration 018) rather than to an email address.

## 1. Google Cloud console

Use a Google Cloud project that the UniExamer team owns. In
[Google Auth Platform](https://console.cloud.google.com/auth/overview) (older
consoles call this part "APIs & Services -> OAuth consent screen"):

1. **Branding** (the consent screen)
   - App name: `UniExamer`
   - User support email: `support@uniexamer.com`
   - App home page: `https://uniexamer.com`
   - Privacy policy: `https://uniexamer.com/about/privacy`
   - Terms of service: `https://uniexamer.com/about/terms`
   - Authorised domains: `uniexamer.com`
   - Developer contact: a team address you read.
2. **Audience**: user type **External**. While the app is in *Testing*, only
   the test users listed here can sign in; press **Publish app** when it should
   work for everyone. With only the three scopes below, Google does not need a
   security review, though it may ask to verify the brand (name and logo).
3. **Data Access** (scopes): add exactly these, and nothing else:
   - `openid`
   - `.../auth/userinfo.email` (`email`)
   - `.../auth/userinfo.profile` (`profile`)
4. **Clients -> Create client**
   - Application type: **Web application**
   - Name: `UniExamer web`
   - Authorised JavaScript origins: not needed (the browser never calls
     Google's APIs itself); leave empty.
   - Authorised redirect URIs, exactly:
     - `https://uniexamer.com/api/auth/google/callback`
     - `http://localhost:3000/api/auth/google/callback`

   Only the canonical host is needed: a sign-in started on
   `www.uniexamer.com` or `exam.assist365.app` first moves to
   `NEXT_PUBLIC_SITE_URL`, so the redirect URI is always built from it. If you
   prefer to keep local development on a separate client, create a second one
   with only the localhost URI.
5. Copy the **Client ID** and **Client secret** from the dialog. Keep the
   secret out of chat, email, Git and screenshots.

## 2. Production (Cloudflare Worker)

In this order:

1. **Apply the migration** to the Supabase database, as the schema owner, in
   the Supabase SQL editor: run `db/postgres/018_google_sign_in.sql` once. It
   creates `oauth_identities` and `oauth_requests` with the same grants and
   row-level-security policy as every other table, and records itself in
   `_migrations`. (Do not run it on a database bootstrapped from
   `db/postgres/schema.sql` after this change; that already has it.)
2. **Deploy** the code as usual: `npm run cf:deploy` from WSL or Linux.
3. **Set the two secrets** from the repository root, pasting each value when
   asked (nothing is echoed or saved to a file):

   ```bash
   npx wrangler secret put GOOGLE_CLIENT_ID
   npx wrangler secret put GOOGLE_CLIENT_SECRET
   ```

   `wrangler secret put` takes effect on the live Worker straight away, which
   is why the migration comes first. `NEXT_PUBLIC_SITE_URL` is already
   `https://uniexamer.com` in `wrangler.jsonc`, which makes the redirect URI
   `https://uniexamer.com/api/auth/google/callback`.
4. Open `https://uniexamer.com/sign-in` in a private window: the button is
   there; sign in with a Google account and check you land on your account.

To switch it off again: `npx wrangler secret delete GOOGLE_CLIENT_SECRET`. The
button disappears; accounts created with Google keep working through email
codes and password reset.

## 3. Local development

Put the values in `.env.local` (never `.env.example`):

```
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run `npm run db:migrate` once so the local SQLite database has migration 018,
then `npm run dev` and open http://localhost:3000/sign-in. The dev server must
answer on the same origin as `NEXT_PUBLIC_SITE_URL`, or the start route moves
the sign-in there and the state cookie will not match.

## 4. What the learner sees and what we keep

- Scopes `openid email profile`. Google sends the account id (`sub`), email
  address, whether Google has confirmed it, name and picture address.
- We keep `sub` and the email address in `oauth_identities`, set the account's
  address to the Google address (new accounts) and mark it confirmed, and use
  the first name as a new account's display name. The full name and picture are
  not stored. The account export includes the link.
- An unconfirmed Google address is refused.
- An existing account with the same address is linked and signed in. If that
  account's address had never been confirmed, its password is removed and its
  sessions ended, because whoever set the password never proved they own the
  inbox (the owner can set one with a reset code).
- A guest who continues with Google as a new account keeps their practice, as
  with the email sign-up.
- A Google account already linked to one account cannot be linked to another;
  an account already linked to one Google account refuses a second.

The privacy notice (`messages/*/about.json`, `privacy.hold.google` and the
lines beside it) describes all of this to learners.
