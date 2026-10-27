# Handoff: finish the site translation, then deploy (27 October 2026)

Written at the end of a cloud session that could not reach Cloudflare,
Stripe, the production database or the official exam sites. Pick this up in a
session on your own computer.

## Where things stand

**On `main` (PR #1, merged):** everything up to commit `c09c32f`.

- **Bocconi split:**
  - Bachelor & Law hub.
  - Bocconi Master hub: the graduate test config, and routes to GMAT/GRE with Bocconi's published minimums.
  - 33 blind-reviewed graduate questions.
- **IMAT:** a draft config, never served until verified. 60 blind-reviewed questions, each with a checked Italian version.
- **Italian question versions:** all 79 TOLC-E, 100 TOLC-F and 80 TOLC-I questions and their passages have checked Italian versions.
  - Tooling: `scripts/export-translation-batch.ts` and `scripts/apply-translation-check.ts`.
  - Migration **013** stores only checked translations, plus each attempt's content language.
- **Payments:** branded Stripe subscriptions, All access €39/month and Single exam €19.99/month (migration **012**, docs/BILLING.md).
- **Next.js 16.4**, with a clean production `npm audit`.
- **Language routing:** `/it`, `/tr`, `/es`, `/pl` (English at the bare path), next-intl, `hreflang`, and the flag language menu.
  - Translated so far: header, footer, menus and guest notes.
  - Every other page falls back to English until its catalogue lands.

**On `feature/polito-cisia-exams-tycfvi` only (WIP commit after `c09c32f`): NOT green, do not merge yet.**

Eight agents were translating the remaining pages when the cloud session hit
its usage limit. Their partial work is committed as-is so nothing is lost.

| Namespace | en | it | tr | es | pl | State |
| --- | --- | --- | --- | --- | --- | --- |
| home | 103 | ✓ | ✓ | ✓ | ✓ | Done |
| results | 205 | ✓ | ✓ | ✓ | ✓ | Code converted; check notebook page and `src/lib/learning/notebook*` |
| billing | 222 | ✓ | ✓ | ✓ | ✓ | Code converted; check checkout complete page |
| exams | 266 | ✓ | ✓ | ✓ | – | Polish missing |
| about | 303 | ✓ | – | ✓ | – | Turkish and Polish missing |
| auth | 133 | ✓ | – | ✓ | – | Turkish and Polish missing |
| practice | 165 | ✓ | – | – | – | tr/es/pl missing |
| player | 178 | – | – | – | – | Only English extracted |
| account | 95 | – | – | – | – | Only English extracted |
| guides (page chrome) | 22 | – | – | – | – | Only English extracted |
| learning (dashboard, study plan, readiness) | 0 | – | – | – | – | Code partly converted, catalogue empty: the cause of most test failures |

The admin pages stay in English on purpose. The guide **article bodies** (`src/lib/content/guides.ts`) are not translated yet.

Verification at the WIP commit:

- `npx tsc --noEmit`: 5 errors, all in `src/app/[locale]/study-plan/adjust/page.tsx`.
- `npx vitest run`: 57 failures in 8 files.
  - `i18n-catalogues` (23): missing translations, as in the table above.
  - `readiness` (14), `new-exams` (6), `plan` (4), `suggestions` (4), `draft-configs` (3), `dashboard` (2), `bocconi-graduate` (1): readiness and planning now return message keys and parameters, but the `learning` catalogue is empty and the tests still expect English sentences.

## What is left, in order

1. **Finish the translation.** Follow `docs/I18N-BRIEF.md` for each area that isn't done. Start with `learning`: extract its English catalogue, finish converting readiness and planning, and update the tests so they render English. Then fill every missing language file. The goal is `npm run verify` and `npm run build` both green.
2. **Serve Italian questions in the player.** The stored data is ready (migration 013, `translations_json`, `attempts.content_locale`). Still to build:
   - When an attempt starts, set `content_locale = 'it'` if the interface language is Italian and the exam's config lists `'it'` in `contentLocales`. Keep IMAT simulations in English, because the real IMAT is English-only.
   - Have the player, results and review pages read `translations_json` for that locale, falling back to English for any item without a checked translation.
   - Give TOLC and IMAT practice a "Questions in: English / Italiano" choice.
3. **Translate the guide articles**, or show a translated note that guides are in English.
4. **Native-speaker review** of the tr/es/pl/it interface text. It was machine-assisted, so have a fluent reader skim each language.
5. **Merge to `main`** through a PR once green.
6. **Production database:** apply `db/postgres/012_stripe_subscriptions.sql`, then `db/postgres/013_content_translations.sql`, to the Supabase project behind Hyperdrive `examer-db`. The code on `main` already expects both, so do this with the deploy, in the order docs/BILLING.md gives.
7. **Deploy to Cloudflare:** `npx wrangler login`, then deploy from a clean checkout (README, "Cloudflare Workers"):
   ```
   git worktree add ../examer-cf origin/main
   cd ../examer-cf && npm ci --ignore-scripts && npm run cf:deploy
   ```
   `wrangler.jsonc` already routes **uniexamer.com** (canonical), **www.uniexamer.com** and **exam.assist365.app**. The last two redirect to uniexamer.com. If you also own **exam.assist365.com**, add it as another `custom_domain` route and a matching redirect in `next.config.ts`. It must be a zone in the same Cloudflare account.
8. **Stripe:** run `npm run stripe:setup`, then set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_WEBHOOK_SECRET` as Worker secrets or vars. Add the webhook endpoint `https://uniexamer.com/api/billing/webhook` and rehearse a test-mode checkout. Only then set `BILLING_ENFORCED=true`. See the go-live checklist in docs/BILLING.md.
9. **Verify the drafts** once the official sites are reachable, following docs/DRAFT-EXAMS.md:
   - IMAT: the 2026/27 MUR decree, universitaly.it.
   - SAA Turin hub: unito.it, saa.unito.it, saaexecutive.it.
10. **Content fixes found during translation:** in `tolc-i-logic-seq-square-steps-210`, the block sequence 1, 2, 6, 15, 31, 56 adds 1 at the second layer, which looks inconsistent. The answer is unaffected. Two TOLC-I rationale fixes have already landed on main.

## Prompt for the local session

> I'm continuing the EXAMassist work from a cloud session. Check out
> `feature/polito-cisia-exams-tycfvi` (it includes a WIP commit on top of
> main), read `docs/HANDOFF-I18N.md` and `docs/I18N-BRIEF.md`, and finish
> "What is left" items 1–2 first: complete every translation catalogue
> (en/it/tr/es/pl) and the page conversions, starting with `learning`, and wire
> the checked Italian question versions into attempts, the player and review,
> until `npm run verify` and `npm run build` pass. Then open a PR to `main` and
> merge it. Then do items 6–8: apply migrations 012 and 013 to the production
> Supabase database, deploy with `npm run cf:deploy` from a clean worktree of
> `main` to uniexamer.com (plus www.uniexamer.com and exam.assist365.app, and
> exam.assist365.com if that zone exists in my Cloudflare account), and set up
> Stripe in test mode before enforcing billing. Ask me before applying
> migrations to production and before turning on `BILLING_ENFORCED`.
