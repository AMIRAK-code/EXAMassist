# UniExamer paywall validation — 2026-11-02

## Delivery status

Implemented locally; not deployed and live billing not activated. No sandbox
was connected or used, following the owner's instruction. No real charge,
refund, subscription change or production database migration was performed.

The pricing, post-diagnostic prompt, locked-feature prompt, order review,
payment status pages and account billing use the existing design system.
English, Italian, Spanish, Turkish and Polish remain supported. The annual
total is prominent, savings are calculated from the catalogue, Free remains
visible, and Premium has no purchase action. Available formats come from the
existing approved-content checks. Legacy prices and benefits are unchanged.

Source review: `src/lib/site.ts`, `src/lib/billing/plans.ts` and the catalogue
in `docs/BILLING.md` agree on the brand and offers. The previous billing
documentation described inline Payment Elements and redirect-time syncing;
it has been updated for hosted Checkout Sessions and webhook-owned access.

## Verification

| Check | Result |
| --- | --- |
| Production build (`npm run build -- --webpack`) | Passed, including TypeScript and 362 generated pages. Final copy and table containment refinements were subsequently checked in the development preview. |
| Final TypeScript check | Passed. |
| Content validation | Passed. Existing question-bank coverage gaps remain visible; this is not human approval of questions. |
| Full unit run | 845 passed; one unrelated notebook rendering test timed out during concurrent compilation. Its complete 18-test file passed on rerun. |
| Final focused billing and translation run | 182 tests passed across seven files, including 15 new Checkout Sessions tests. |
| Local migrations | All 17 SQLite migrations applied successfully to the isolated preview database. Postgres migration authored and reviewed, not executed remotely. |
| Desktop pricing | Inspected in Chrome. Monthly/yearly prices and keyboard arrow navigation verified. |
| Mobile pricing | Inspected at 390 × 844. Fixed hidden table labels escaping their scroll container; document and content viewport both measured 375px after the fix. |
| Languages | Catalogue parity checked for all five languages; English and Italian pricing inspected in browser. |

Automated scenarios cover all three purchasable offers, server price mismatch,
Premium and unavailable-exam refusal, existing/legacy subscribers, concurrent
checkout reuse, a timeout after remote creation, interval changes, internal
return destinations, delayed payment, asynchronous failure, expiry, duplicate
events, full/partial refunds, subscription cancellation, renewals and access
expiry. These use provider mocks and real local SQL/SDK webhook signatures.
They are not evidence of successful live Stripe payment processing.

The return page only reads owned grants; it never grants access. A new
subscription reported active or past_due before its first payment settles is
withheld. Existing subscription access policy and learning history are preserved.

## Remaining launch work

1. Apply `db/postgres/017_checkout_sessions.sql` after the existing migrations,
   as the schema owner. It creates a backend-only table with RLS.
2. Verify the production price catalogue, credentials and endpoint delivery.
   Subscribe the endpoint to the four new Checkout Session events listed in
   `docs/BILLING.md`, in addition to the existing lifecycle events.
3. Confirm the seller's legal name, business address, public support details,
   tax setup/registrations and receipt settings. Automatic tax remains unchanged;
   the new checkout refuses to enable it without an active registration.
4. Resolve the existing legal/refund/withdrawal confirmation items in
   `docs/BILLING.md`. No new refund policy or launch date was invented.
5. Real declined/delayed payments, Stripe-hosted UI, webhook delivery and full
   authenticated checkout/account browser journeys remain unverified. No live
   payment rehearsal was substituted for the declined sandbox request.
6. Deploy and activate live billing only as a separate release step.

Accessibility checks covered native radio keyboard operation, labelled controls,
semantic comparison tables, focus styles and responsive overflow. A complete
screen-reader or automated axe audit of all authenticated states was not run.

Preview screenshots are in `output/paywall-desktop.png`,
`output/paywall-plans.png` and `output/paywall-mobile.png`. The preview uses an
empty local content database, so its unavailable-format counts are not a report
on the live question bank.
