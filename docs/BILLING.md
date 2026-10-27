# Billing

Paid plans through Stripe, sold and managed on the site's own pages. Card
details are typed into Stripe's Payment Element (Stripe's iframes), styled
with the Appearance API to look like our own fields, so they never reach this
server. There is no hosted Stripe Checkout and no hosted billing portal.

> **Not tested against the live Stripe API.** The development environment
> cannot reach api.stripe.com, so every automated test uses a mocked Stripe
> client (`tests/unit/helpers/fake-stripe.ts`); webhook signatures are made and
> checked with Stripe's own SDK. Before going live, run the test-mode
> rehearsal in [Go-live checklist](#go-live-checklist) end to end.

## Plans and the feature matrix

Everything about plans lives in **one module, `src/lib/billing/plans.ts`**:
names, prices, Stripe lookup keys, product ids, which features each plan
includes, which features are free, and the access policy for each
subscription status. The pricing page, the checkout, the account page, the
entitlement checks and `scripts/stripe-setup.ts` all read from it.

| Plan | Price (VAT included) | Covers |
| --- | --- | --- |
| Free | €0 | Guides and public pages, sample questions, and the free diagnostic for every exam |
| Single exam | €19.99 / month, per exam | Everything for the one exam chosen (a learner may hold several) |
| All access | €39.00 / month | Everything for every exam, plus the AI tutor |

| Feature | Free | Single exam | All access |
| --- | --- | --- | --- |
| Exam guides, format and scoring pages (`guides`) | yes | yes | yes |
| Sample questions (`samples`) | yes | yes | yes |
| The free diagnostic for every exam (`diagnostic`) | yes (needs an account) | yes | yes |
| Topic practice and retries (`practice`) | – | its exam | every exam |
| Timed sections (`timed_section`) | – | its exam | every exam |
| Full-length simulations (`simulation`) | – | its exam | every exam |
| Study plan and readiness (`study_plan`) | – | its exam | every exam |
| AI tutor (`ai_tutor`) | – | – | every exam |

Notes on the matrix:

- **The free diagnostic** is the fixed "free test" (`chooseFreeTest` in
  `src/lib/attempts/service.ts`): the same questions for everyone, one per
  exam per account. A diagnostic with freshly drawn questions counts as
  `practice`, so the free tier cannot be used to work through the bank.
  `DIAGNOSTIC_NEEDS_ACCOUNT` (true) keeps the existing rule that guests sign
  up first; the guest's history is claimed by the existing sign-up flow.
- **Editors and administrators** bypass every gate.
- **Legacy Premium** subscribers (the earlier monthly / 3-month / yearly
  plans, lookup keys `examer_premium_*_v1`) are mapped to All access through
  `LEGACY_LOOKUP_KEYS` until they cancel. Migration 012 copies their rows.

### Changing a price or a plan

Stripe prices cannot be edited. To change a price: change `amount` in
`plans.ts`, bump the lookup key's version (`…_v1` → `…_v2`), add the old key
to `LEGACY_LOOKUP_KEYS` so existing subscribers still resolve, and run
`npm run stripe:setup` in test and live mode. Existing subscribers stay on
their old price until moved in the Stripe dashboard (with the notice the
terms promise). Changing which features a plan includes is an edit to
`features` in `plans.ts` and takes effect immediately for everyone.

### Access by subscription status (decided)

Implemented in `grantIsLive` (`src/lib/billing/entitlements.ts`), configured
by `ACCESS_POLICY` in `plans.ts`:

| Status | Access |
| --- | --- |
| `active`, `trialing` | Until the current period end, plus a 48-hour grace so a late renewal webhook does not lock a paying learner out. A row still "active" after its period is re-read from Stripe when the account or entitlement view loads with Stripe available. |
| `past_due` | **Until the current period end Stripe reports.** On a failed renewal Stripe has already advanced the period, so this keeps access while Stripe retries; when Stripe gives up (cancel or mark unpaid, per the dashboard's retry settings), access ends at once. |
| `incomplete`, `incomplete_expired`, `unpaid`, `canceled`, `paused` | None. |

A plan cancelled "at period end" keeps access until that date.

## How it fits together

```
src/lib/billing/
  plans.ts         Plans, prices, feature matrix, access policy (edit here)
  config.ts        Environment: BILLING_ENFORCED and the Stripe keys; paths
  entitlements.ts  The one access helper: decideAccess (pure), loadEntitlements, requireEntitlement
  store.ts         The local copy of customers/subscriptions; processed webhook events
  service.ts       Customers, subscription creation, cancel/resume, card update, webhooks, deletion
  stripe.ts        The `stripe` SDK client (fetch HTTP client: Node and Workers) and webhook verification
  upgrade.ts       Where a refused learner is sent (the pricing page for that exam)

src/app/pricing/                 Plans, prices and the matrix, in the site's design
src/app/checkout/                Our checkout: plan picker, exam picker, order summary, consent, Payment Element
src/app/checkout/complete/       Our confirmation page (success / processing / failed / expired)
src/app/account/ (#billing)      Current plans, renewal dates, cancel/resume, update card
src/app/api/billing/subscriptions       POST: create (default_incomplete) and return the client secret
src/app/api/billing/subscriptions/[id]  PATCH: cancel at period end / resume
src/app/api/billing/setup-intent        POST: SetupIntent for a new card
src/app/api/billing/payment-method      POST: make the confirmed card the default everywhere
src/app/api/billing/webhook             Stripe webhooks
src/components/billing/          Checkout form, subscription manager, upgrade prompt, Appearance mapping
db/migrations/012_stripe_subscriptions.sql  billing_customers, billing_subscriptions, billing_events
```

**Where access is enforced** (all through `requireEntitlement` /
`loadEntitlements`): starting a session (`startAttempt`, `startRetry`), the AI
tutor (`questionHelp`, `debrief`), creating and adjusting a study plan
(server actions), and the study plan, readiness, practice, results and
question-review pages. A refusal is a 402 `upgrade-required` (or 403
`account-required` for the diagnostic) carrying `detail.upgradeHref`, the
pricing page for that exam; every caller turns it into that link or an
`UpgradePrompt`, never an error page.

**Checkout flow.** The Payment Element is shown at once in "deferred intent"
mode (`mode: 'subscription'`, the plan's amount, `paymentMethodTypes:
['card']`). On Pay the browser runs `elements.submit()`, then the server
creates the customer (once per account, metadata `examer_user_id`) and the
subscription with `payment_behavior: 'default_incomplete'`, metadata `plan`,
`exam_key` (single exam), `source_exam` (where the learner came from) and
`withdrawal_waiver_at`, and returns the client secret of the first invoice's
PaymentIntent (`latest_invoice.confirmation_secret`) or of the
`pending_setup_intent` when nothing is due. The browser calls
`stripe.confirmPayment` / `confirmSetup` with `redirect: 'if_required'` and
`return_url` = `/checkout/complete?subscription=…`, so 3-D Secure runs in
Stripe's modal and any redirect comes back to our confirmation page. Requests
carry a per-page idempotency key, and a still-incomplete subscription for the
same plan is reused rather than duplicated. The server refuses to sell what
the learner already holds.

**Webhooks** (`handleWebhook`): the signature is verified on the raw body
with `stripe.webhooks.constructEventAsync` (5-minute tolerance); an event id
already in `billing_events` is acknowledged and skipped; subscription events
older than the stored state (`stripe_synced_at`) are ignored, so out-of-order
delivery cannot roll a subscription back; invoice events re-read their
subscription from Stripe. The event id and the change are written in one
transaction. 400 for a bad signature, 200 for processed or duplicate, 500
(Stripe retries) when the update could not be stored.

**Looks like the site.** `src/components/billing/stripe-appearance.ts` reads
our CSS tokens (`--color-accent`, `--color-surface`, `--radius-control`, …)
from the page at run time and maps them to Appearance variables and rules
mirroring `fieldClass()`: 48 px fields, 1.5 px control border, the control
radius, the 2 px accent focus ring with 2 px offset, the negative colour for
errors, our label size and weight. The interface font is served from
`/fonts/` with `Access-Control-Allow-Origin: *` (next.config.ts and
`public/_headers`) so Stripe's iframe can load it. The site has one light
theme (docs/ARCHITECTURE.md), so there is one appearance.

**Strings.** Every new page and component keeps its user-facing strings in
one `COPY` object at the top of the file; plan and feature names are in
`PLAN_COPY` in `plans.ts`.

## Setup

### 1. Keys (environment)

| Variable | Where | Notes |
| --- | --- | --- |
| `BILLING_ENFORCED` | server | `true` turns the paywall on. Default `false`: everything free, no keys needed (local dev, unit and e2e tests). |
| `STRIPE_SECRET_KEY` | server only | `sk_test_…`/`sk_live_…`, or a restricted key with write access to Customers, Subscriptions, SetupIntents and Invoices and read access to Prices. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | browser | Same mode as the secret key. Read at run time and passed to the page, not inlined at build time. |
| `STRIPE_WEBHOOK_SECRET` | server only | `whsec_…` of the webhook endpoint (or of `stripe listen` locally). |
| `STRIPE_AUTOMATIC_TAX` | server | `true` only after Stripe Tax is set up: checkout then asks for the country and Stripe computes VAT inside the inclusive price. |

With `BILLING_ENFORCED=true` and any key missing, malformed or from mixed
modes, the server refuses to start (`src/instrumentation.ts`) and every
entitlement check throws `BillingConfigError`, which is logged and answered
with 503 — never free access. With keys but `BILLING_ENFORCED=false`, test
keys allow rehearsing the checkout while everything is still free; live keys
sell nothing until the paywall is on.

On Vercel set them as environment variables; on Cloudflare Workers put the
secret key and webhook secret in Worker secrets (`npx wrangler secret put
STRIPE_SECRET_KEY`) and the rest in `vars`. Never commit keys.

### 2. Products and prices

```bash
npm run stripe:setup -- --dry-run   # report only
npm run stripe:setup                # create what is missing
```

`scripts/stripe-setup.ts` is idempotent: it creates the products
`examer_all_access` and `examer_single_exam` if missing, finds each price by
its lookup key and creates it if missing (EUR, monthly, `tax_behavior:
inclusive`), and reports — never edits — a price that no longer matches
`plans.ts`. Run it once with the test key and once with the live key.

### 3. Webhook endpoint

In the Stripe dashboard (Developers → Webhooks) add
`https://<site>/api/billing/webhook` with these events:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

### 4. Local development

```bash
# .env.local: test keys, and BILLING_ENFORCED=true to see the paywall
stripe login
stripe listen --forward-to localhost:3000/api/billing/webhook   # prints whsec_… for STRIPE_WEBHOOK_SECRET
npm run dev
```

Test cards: `4242 4242 4242 4242` (succeeds), `4000 0027 6000 3184` (3-D
Secure), `4000 0000 0000 0341` (attaches, then fails on payment; use it to
rehearse `past_due` with `stripe trigger invoice.payment_failed` or a test
clock). Without `stripe listen`, the confirmation and account pages still
read the subscription from Stripe directly, but renewals and cancellations
made in the dashboard only arrive through webhooks.

### 5. Rolling out on the existing production database

1. Deploy this code with `BILLING_ENFORCED=false` (it does not read the old
   `subscriptions` table).
2. Apply `db/postgres/012_stripe_subscriptions.sql` as the schema owner. It
   copies the Premium customers and subscriptions from migration 010 (as All
   access) and drops the old table, in one transaction.
3. Set the keys, run `npm run stripe:setup` (live), create the webhook.
4. Set `BILLING_ENFORCED=true` and redeploy.

Note: before this change Premium was switched on by `STRIPE_SECRET_KEY`
alone. It is now switched on only by `BILLING_ENFORCED=true`; a deployment
that had a key set and does not set the flag becomes free.

## Go-live checklist

- [ ] **VAT / Stripe Tax decision.** Prices are VAT-inclusive. Selling
      digital services to EU consumers means charging the buyer's country's VAT
      (OSS registration, or under the €10,000 EU threshold the home rate). Either
      set up Stripe Tax (origin address, registrations) and
      `STRIPE_AUTOMATIC_TAX=true` — margins then vary by country while the price
      stays the same — or decide with an accountant to account for VAT outside
      Stripe. Check invoices show the VAT the law requires.
- [ ] **Terms of sale** (`/about/terms#sale`) reviewed by a lawyer: seller
      identity and address, pre-contract information, the express request for
      immediate access and acknowledgement of losing the 14-day withdrawal right
      (Consumer Rights Directive art. 16(m); Italian Consumer Code art. 59), and a
      durable-medium confirmation of it after purchase (e.g. in the receipt
      email). The checkbox, the timestamp (`withdrawal_waiver_at`, also in
      Stripe metadata) and the copy are implemented; the legal sign-off is not.
- [ ] **Refund policy** decided and published: what happens on cancellation
      (today: access to period end, no pro-rata refund), on account deletion
      (today: immediate cancellation, no refund), on a disputed or duplicate
      charge, and on a technical failure. Refunds are issued from the Stripe
      dashboard.
- [ ] **Minors.** Decide whether under-18s may buy, and how.
- [ ] **Privacy notice** reviewed for Stripe's role and its fraud-prevention
      cookies (`__stripe_mid`, `__stripe_sid`), set only on pages that show card
      fields (Stripe.js is loaded lazily from `@stripe/stripe-js/pure`).
- [ ] Stripe dashboard: business details, statement descriptor, customer
      emails for successful payments and failed renewals (receipts), retry
      schedule and what happens after the last retry (Billing → Revenue
      recovery: cancel the subscription is recommended), Radar rules, 3-D Secure.
- [ ] `npm run stripe:setup` in live mode; webhook endpoint created with the
      five events; keys set; `BILLING_ENFORCED=true`; server starts.
- [ ] Rehearse in test mode: buy each plan (with and without 3-D Secure), a
      declined card, cancel and resume, update the card, a failed renewal
      (`past_due`) and recovery, cancellation by Stripe, account deletion while
      subscribed, a guest signing up from checkout, the AI tutor refused on Single
      exam, and the pricing page while signed out. Confirm webhook deliveries
      succeed in the dashboard.
