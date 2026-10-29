# Billing

Paid plans through Stripe, sold and managed on the site's own pages. Card
details are typed into Stripe's Payment Element (Stripe's iframes), styled
with the Appearance API to look like our own fields, so they never reach this
server. There is no hosted Stripe Checkout and no hosted billing portal.

> **Payments are not switched on.** The catalogue below (decided by the owner
> on 2026-10-29) is implemented, but nothing is sold until the owner has
> verified the production tax configuration and followed
> [Release steps](#release-steps-before-anything-is-sold). Until then
> `BILLING_ENFORCED` stays unset and everything stays free.
>
> **Not tested against the live Stripe API.** The development environment
> cannot reach api.stripe.com, so every automated test uses a mocked Stripe
> client (`tests/unit/helpers/fake-stripe.ts`); webhook signatures are made and
> checked with Stripe's own SDK. Run the test-mode rehearsal in the release
> steps end to end before going live.

## Plans and the feature matrix

Everything about plans lives in **one module, `src/lib/billing/plans.ts`**:
names, prices, Stripe lookup keys, product ids, which features each plan
includes, which features are free, and the access policy for each
subscription status. The pricing page, the checkout, the account page, the
entitlement checks and `scripts/stripe-setup.ts` all read from it.

| Plan | Price (VAT included) | Billing | Covers |
| --- | --- | --- | --- |
| Free | €0 | – | Guides and public pages, sample questions, the free diagnostic for every exam, official practice-score tracking |
| Single Exam Pass | €23.99 once | Paid once; **six calendar months** from the confirmed payment; never renews | The one exam chosen at checkout |
| Plus | €7.99 / month or €59.99 / year | Renews until cancelled; the yearly price is charged in full upfront | Every exam |
| Premium | Coming soon (planned €14.99 / month or €119 / year) | **Not on sale**: shown, refused at checkout on the server | Plus and the AI tutor |

| Feature | Free | Pass | Plus | Premium (soon) |
| --- | --- | --- | --- | --- |
| Exam guides, format and scoring pages (`guides`) | yes | yes | yes | yes |
| Sample questions (`samples`) | yes | yes | yes | yes |
| The free diagnostic for every exam (`diagnostic`) | yes (needs an account) | yes | yes | yes |
| Official practice-score tracking (`official_scores`) | yes | yes | yes | yes |
| Topic practice and retries, worked explanations (`practice`) | – | its exam | every exam | every exam |
| Timed sections (`timed_section`) | – | its exam | every exam | every exam |
| Full-length simulations (`simulation`) | – | its exam | every exam | every exam |
| Study plan and progress tracking (`study_plan`) | – | its exam | every exam | every exam |
| AI tutor (`ai_tutor`) | – | – | – | every exam |

Lookup keys: `examer_pass_exam_v1` (one-time price), `examer_plus_month_v1`,
`examer_plus_year_v1`. Premium's planned keys (`examer_premium_month_v2`,
`examer_premium_year_v2`) are defined but never created by the setup script.
The annual copy ("Save 37% compared with monthly billing", "Approximately
€5/month, billed €59.99 annually") is computed from the prices
(`annualSaving()` in plans.ts), never typed in, and the full €59.99 yearly
charge is always shown beside it.

Notes on the matrix:

- **Only what can be delivered is sold.** Since fc89ad2 only questions with a
  standing human approval are served. A Single Exam Pass can be bought only
  for an exam that has at least one paid practice format open today: topic
  practice, a timed section or a full-length simulation that the engine's own
  availability check (`blueprintAvailability`, approved questions only) can
  fill. Diagnostics, the review mode and essay-only formats do not count. The
  rule is in `src/lib/billing/availability.ts`; `startCheckout` enforces it on
  the server (409 `exam-unavailable`), and the pricing and checkout pages show
  every exam with whether it can be bought and why not. Plus says how many
  exams have a format open today and links to the same table.
- **The free diagnostic** is the fixed "free test" (`chooseFreeTest` in
  `src/lib/attempts/service.ts`): the same questions for everyone, one per
  exam per account. A diagnostic with freshly drawn questions counts as
  `practice`, so the free tier cannot be used to work through the bank.
  `DIAGNOSTIC_NEEDS_ACCOUNT` (true) keeps the existing rule that guests sign
  up first; the guest's history is claimed by the existing sign-up flow.
- **Editors and administrators** bypass every gate.
- **Without `BILLING_ENFORCED`** nothing is paywalled, exactly as before.

### Earlier plans (legacy) keep what they were sold

Nobody is moved to a new plan or price silently. Subscriptions bought before
2026-10-29 keep exactly their benefits and price until they end:

| Earlier plan | Lookup key(s) | Kept |
| --- | --- | --- |
| First Premium (monthly, 3-month, yearly) | `examer_premium_monthly_v1`, `examer_premium_quarterly_v1`, `examer_premium_yearly_v1` | Every exam **and the AI tutor** (mapped to `all_access` by `LEGACY_LOOKUP_KEYS`; migration 012 copies their rows) |
| All access, €39.00 / month | `examer_all_access_monthly_eur_v1` | Every exam and the AI tutor |
| Single exam, €19.99 / month | `examer_single_exam_monthly_eur_v1` | Its one exam |

They are `status: 'legacy'` in plans.ts: honoured by the entitlement check,
renewed by Stripe at their own price, shown on the account page under their
own name ("Premium (earlier plan)", …) with a note that they keep what they
included, and refused if anyone tries to buy them again. A learner on an
earlier all-exams plan is not sold Plus on top. Learning history is never
touched by any of this.

### Changing a price or a plan

Stripe prices cannot be edited. To change a price: change `amount` in
`PRICES`, bump the lookup key's version (`…_v1` → `…_v2`), keep the old price
resolvable (move it to a `legacy` plan or `LEGACY_LOOKUP_KEYS`), and run
`npm run stripe:setup` in test and live mode. The checkout refuses a Stripe
price whose amount, currency, tax behaviour or interval differs from plans.ts
(`priceIdFor`), so a mismatch fails as "misconfigured", never as a different
charge. Existing subscribers stay on their old price until moved in the
Stripe dashboard (with the notice the terms promise). Changing which features
a plan includes is an edit to `features` in `plans.ts` and takes effect
immediately for everyone.

Selling Premium later: set `PLANS.premium.status` to `'on-sale'`, decide and
publish the AI tutor's usage limits first (the copy promises they are stated
before purchase; never "unlimited"), run the setup script, rehearse.

### Access rules (decided)

Implemented in `grantIsLive` (`src/lib/billing/entitlements.ts`), configured
by `ACCESS_POLICY` and `PASS_ACCESS_MONTHS` in `plans.ts`:

| What | Access |
| --- | --- |
| Pass, `paid` | From the moment Stripe recorded the payment (`status_transitions.paid_at`) until six calendar months later (`addCalendarMonths`: 31 August + 6 months = 28/29 February), in UTC. No grace, no renewal. Set once; a later sync never moves it. |
| Pass, `pending` / `void` / `refunded` | None. A full refund (`charge.refunded` with `refunded: true`) ends access at once; a partial refund leaves it. |
| Subscription `active`, `trialing` | Until the current period end, plus a 48-hour grace so a late renewal webhook does not lock a paying learner out. A row still "active" after its period is re-read from Stripe when the account or entitlement view loads with Stripe available. |
| Subscription `past_due` | **Until the current period end Stripe reports.** On a failed renewal Stripe has already advanced the period, so this keeps access while Stripe retries; when Stripe gives up (cancel or mark unpaid, per the dashboard's retry settings), access ends at once. |
| Subscription `incomplete`, `incomplete_expired`, `unpaid`, `canceled`, `paused` | None. |

A subscription cancelled "at period end" keeps access until that date.

## How it fits together

```
src/lib/billing/
  plans.ts         Plans, prices, feature matrix, access policy (edit here)
  config.ts        Environment: BILLING_ENFORCED and the Stripe keys; paths
  availability.ts  Which exams a pass may be sold for (an open paid practice format)
  entitlements.ts  The one access helper: decideAccess (pure), loadEntitlements, requireEntitlement
  store.ts         The local copy of customers, subscriptions and passes; processed webhook events
  service.ts       startCheckout (Plus / pass), cancel/resume, card update, webhooks, deletion
  stripe.ts        The `stripe` SDK client (fetch HTTP client: Node and Workers) and webhook verification
  upgrade.ts       Where a refused learner is sent (the pricing page for that exam)

src/app/[locale]/pricing/            Free, Single Exam Pass, Plus, Premium (coming soon), exam availability, matrix
src/app/[locale]/checkout/           Our checkout: offer picker, exam picker, order summary, consent, Payment Element
src/app/[locale]/checkout/complete/  Our confirmation page (?subscription=sub_… or ?pass=in_…), checked with Stripe by the server
src/app/[locale]/account/ (#billing) Passes with exam and expiry date; subscriptions with renewal, cancel/resume, card
src/app/api/billing/checkout            POST: start a purchase, return the client secret (the server decides what may be sold)
src/app/api/billing/subscriptions/[id]  PATCH: cancel at period end / resume
src/app/api/billing/setup-intent        POST: SetupIntent for a new card
src/app/api/billing/payment-method      POST: make the confirmed card the default everywhere
src/app/api/billing/webhook             Stripe webhooks
src/components/billing/          Checkout form, plan manager, upgrade prompt, plan summary cards, Appearance mapping
db/migrations/012_stripe_subscriptions.sql  billing_customers, billing_subscriptions, billing_events
db/migrations/016_exam_passes.sql           billing_passes
```

**Entitlements.** A learner's grants are their subscriptions
(`billing_subscriptions`: Plus and the earlier plans) and their passes
(`billing_passes`), loaded together. Each grant has a plan key; the plan's
`scope` ('all-exams' or 'one-exam' with the stored `exam_key`) and `features`
decide what it opens. `decideAccess` is the whole rule and is pure; the
`Entitlements` object answers `can(feature, exam)` for a page.

**Where access is enforced** (all through `requireEntitlement` /
`loadEntitlements`): starting a session (`startAttempt`, `startRetry`), the AI
tutor (`questionHelp`, `debrief`), creating and adjusting a study plan
(server actions), and the study plan, readiness, practice, results and
question-review pages. A refusal is a 402 `upgrade-required` (or 403
`account-required` for the diagnostic) carrying `detail.upgradeHref`, the
pricing page for that exam; every caller turns it into that link or an
`UpgradePrompt`, never an error page. For the AI tutor the prompt says it will
come with Premium and offers nothing to buy.

**Checkout flow.** The Payment Element is shown at once in "deferred intent"
mode (`mode: 'payment'` for the pass, `'subscription'` for Plus; the offer's
amount; `paymentMethodTypes: ['card']`). On Pay the browser runs
`elements.submit()`, then `POST /api/billing/checkout` with the offer. The
server (`startCheckout`) refuses Premium (409 `coming-soon`), the earlier
plans (400 `unknown-plan`), a pass for an exam without an open format (409
`exam-unavailable`) and anything the learner already holds (409
`already-subscribed`); then it creates the customer (once per account,
metadata `examer_user_id`) and:

- **Plus**: a subscription with `payment_behavior: 'default_incomplete'`,
  metadata `plan`, `price_key`, `source_exam`, `withdrawal_waiver_at`; it
  returns the first invoice's PaymentIntent secret
  (`latest_invoice.confirmation_secret`) or the `pending_setup_intent`'s.
  A still-incomplete subscription for the same price is reused.
- **Single Exam Pass**: a one-off invoice (`collection_method:
  'charge_automatically'`, **`auto_advance: false`**, so Stripe never charges
  it by itself), one invoice item for the pass price, finalised with
  `auto_advance: false`; metadata `examer_purchase: 'exam_pass'`, `plan`,
  `exam_key`, `price_lookup_key`, `examer_user_id`, `withdrawal_waiver_at`. It
  returns the invoice's `confirmation_secret`. A pending pass row is stored. A
  pass invoice still open for the same exam is reused (two tabs, a reload);
  one older than a day is voided, so a learner can never pay twice for one
  exam.

The browser calls `stripe.confirmPayment` / `confirmSetup` with
`redirect: 'if_required'` and `return_url` = `/checkout/complete?…`, so 3-D
Secure runs in Stripe's modal and any redirect comes back to our
confirmation page. That page asks Stripe on the server (subscription, or the
invoice with its payment) and shows success only on Stripe's answer. Requests
carry a per-page idempotency key.

**Webhooks** (`handleWebhook`): the signature is verified on the raw body
with `stripe.webhooks.constructEventAsync` (5-minute tolerance); an event id
already in `billing_events` is acknowledged and skipped; states older than
the stored one (`stripe_synced_at`) are ignored, so out-of-order delivery
cannot roll anything back. Subscription invoices re-read their subscription;
pass invoices (`examer_purchase: 'exam_pass'`, no subscription) re-read the
invoice with its payments, which records the PaymentIntent for refunds. A
paid pass never goes back to pending, a refunded one never reopens, and a
stored pass never changes owner whatever the metadata says. Invoices,
subscriptions and charges that are not ours (the Stripe account is shared
with VibeAssist) are acknowledged and left alone. The event id and the change
are written in one transaction. 400 for a bad signature, 200 for processed or
duplicate, 500 (Stripe retries) when the update could not be stored.

**Looks like the site.** `src/components/billing/stripe-appearance.ts` reads
our CSS tokens (`--color-accent`, `--color-surface`, `--radius-control`, …)
from the page at run time and maps them to Appearance variables and rules
mirroring `fieldClass()`. The interface font is served from `/fonts/` with
`Access-Control-Allow-Origin: *` (next.config.ts and `public/_headers`) so
Stripe's iframe can load it.

**Strings.** Page and component strings are in the `billing` message
catalogue in all five languages (`messages/<locale>/billing.json`); the
English plan and feature names are also in `PLAN_COPY` in `plans.ts` for the
Stripe product names. The terms of sale are in `about.json`
(`terms.plans.*`).

## Setup

### 1. Keys (environment)

| Variable | Where | Notes |
| --- | --- | --- |
| `BILLING_ENFORCED` | server | `true` turns the paywall on. Default `false`: everything free, no keys needed (local dev, unit and e2e tests). |
| `STRIPE_SECRET_KEY` | server only | `sk_test_…`/`sk_live_…`, or a restricted key with write access to Customers, Subscriptions, SetupIntents, **Invoices and Invoice Items** and read access to Prices. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | browser | Same mode as the secret key. Read at run time and passed to the page, not inlined at build time. |
| `STRIPE_WEBHOOK_SECRET` | server only | `whsec_…` of the webhook endpoint (or of `stripe listen` locally). |
| `STRIPE_AUTOMATIC_TAX` | server | `true` only after Stripe Tax is set up: checkout then asks for the country and Stripe computes VAT inside the inclusive price, for passes and Plus alike. |

With `BILLING_ENFORCED=true` and any key missing, malformed or from mixed
modes, the server refuses to start (`src/instrumentation.ts`) and every
entitlement check throws `BillingConfigError`, which is logged and answered
with 503 — never free access. With keys but `BILLING_ENFORCED=false`, test
keys allow rehearsing the checkout while everything is still free; live keys
sell nothing until the paywall is on.

On Cloudflare Workers put the secret key and webhook secret in Worker secrets
(`npx wrangler secret put STRIPE_SECRET_KEY`) and the rest in `vars`. Never
commit keys.

### 2. Products and prices

```bash
npm run stripe:setup -- --dry-run   # report only
npm run stripe:setup                # create what is missing
```

`scripts/stripe-setup.ts` is idempotent: it creates the products
`examer_exam_pass` and `examer_plus` if missing, finds each price on sale by
its lookup key and creates it if missing (EUR, `tax_behavior: inclusive`; the
pass as a one-time price, Plus as a monthly and a yearly recurring price),
reports — never edits — a price that no longer matches `plans.ts`, reports
whether the earlier plans' prices exist, and never creates Premium. Run it
once with the test key and once with the live key.

### 3. Webhook endpoint

In the Stripe dashboard (Developers → Webhooks) add
`https://<site>/api/billing/webhook` with these events:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`
- `invoice.voided` (new: abandoned pass invoices)
- `charge.refunded` (new: a fully refunded pass ends its access)

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
read the subscription or pass invoice from Stripe directly, but renewals,
refunds and cancellations made in the dashboard only arrive through webhooks.

## Release steps (before anything is sold)

In this order. Nothing here has been done; the code ships with payments off.

1. **Tax configuration (owner, first).** Verify the production Stripe tax
   setup before any price is created or sold: business address and origin,
   registrations (Italian VAT number; EU One-Stop Shop if selling digital
   services to consumers in other EU countries above the €10,000 threshold,
   otherwise the home rate), whether to use Stripe Tax
   (`STRIPE_AUTOMATIC_TAX=true`: Stripe computes the VAT inside the
   inclusive price per country; margins vary, the price does not) or to
   account for VAT outside Stripe with an accountant. Confirm that invoices
   and receipts show what the law requires (VAT rate and amount, seller
   identity), for one-off pass invoices as well as subscription invoices.
2. **Database.** Apply the Postgres migrations as the schema owner, in order:
   `db/postgres/012_stripe_subscriptions.sql` (if still pending in
   production: it copies the first Premium subscribers as earlier plans that
   keep the AI tutor), then 013, 014, 015 as already planned
   (docs/HUMAN-APPROVAL-ROLLOUT.md), then **`db/postgres/016_exam_passes.sql`**.
   016 only adds `billing_passes`. Apply it **before** deploying this code:
   the pricing, checkout and account pages read the table (the entitlement
   check alone fails closed without it).
3. **Deploy with `BILLING_ENFORCED` unset** (or `false`). Everything stays
   free; the pricing page shows the new plans with "Everything is free right
   now".
4. **Stripe (test mode first).** Set test keys, run `npm run stripe:setup`,
   create the webhook endpoint with the seven events above, then rehearse:
   buy a pass (with and without 3-D Secure) for an exam with an open format,
   try one for an exam without (refused), buy Plus monthly and yearly, a
   declined card, cancel and resume Plus, update the card, a failed renewal
   (`past_due`) and recovery, a full and a partial refund of a pass (full
   ends access), an abandoned pass checkout (open invoice, then a second
   checkout reuses it), account deletion while holding both, a guest
   signing up from checkout, the AI tutor refused on Plus and on a pass but
   still answered for an earlier Premium subscriber, and the pricing page
   signed out. Confirm webhook deliveries succeed in the dashboard.
5. **Stripe dashboard (live).** Business details, statement descriptor,
   customer emails for successful payments and failed renewals (receipts;
   for the pass, the invoice/receipt email is the durable-medium confirmation
   of the waiver below), retry schedule and what happens after the last retry
   (Billing → Revenue recovery: cancel the subscription is recommended), Radar
   rules, 3-D Secure. Check that "Automatically finalize and charge invoices"
   style settings do not override `auto_advance: false` on pass invoices.
6. **Live setup.** Live keys as Worker secrets, `npm run stripe:setup` with
   the live key, webhook endpoint with the seven events, server starts.
7. **Legal sign-off** (items below), then set `BILLING_ENFORCED=true` and
   redeploy. Only then is anything sold.

### Legal items still open

- [ ] **Terms of sale** (`/about/terms#sale`, updated for the new plans,
      still a draft) reviewed by a lawyer: seller identity and address,
      pre-contract information for a one-off digital-content purchase and for
      a monthly/yearly subscription.
- [ ] **EU right of withdrawal.** Checkout asks for the express request for
      immediate access and the acknowledgement of losing the 14-day
      withdrawal right (Consumer Rights Directive art. 16(m); Italian Consumer
      Code art. 59); the checkbox, the timestamp (`withdrawal_waiver_at`, also
      in Stripe metadata on the pass invoice and the subscription) and the copy
      are implemented. Confirm the wording suffices for a pass and for a
      yearly plan, and send a durable-medium confirmation after purchase (the
      Stripe receipt alone may not carry the acknowledgement).
- [ ] **Refund policy** decided and published: a pass (today: no refund once
      access starts; a full refund issued from the dashboard ends access at
      once, a partial one does not), unused months of a yearly Plus plan on
      cancellation (today: access to period end, no pro-rata refund), account
      deletion (today: subscriptions cancelled at once, any pass ends, no
      refund), disputed or duplicate charges, technical failures, and a pass
      bought for an exam whose formats later close (content can lose its
      approval). Refunds are issued from the Stripe dashboard.
- [ ] **Disputes.** `charge.dispute.created` is not handled: decide whether a
      disputed pass keeps access until the dispute is decided.
- [ ] **Minors.** Decide whether under-18s may buy, and how.
- [ ] **Privacy notice** reviewed for Stripe's role and its fraud-prevention
      cookies (`__stripe_mid`, `__stripe_sid`), set only on pages that show card
      fields (Stripe.js is loaded lazily from `@stripe/stripe-js/pure`).
- [ ] **Premium**: before it goes on sale, decide and publish the AI tutor's
      usage limits (never advertise unlimited use).
