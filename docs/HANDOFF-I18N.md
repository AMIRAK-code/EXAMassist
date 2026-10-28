# Handoff: finish the site translation, then deploy

Started in a cloud session on 27 October 2026 that could not reach
Cloudflare, Stripe, the production database or the official exam sites;
items 1 and 2 were finished in a local session on 28 October 2026.

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

**Translation (items 1–2, done):**

- Every namespace has complete en/it/tr/es/pl catalogues; `tests/unit/i18n-catalogues.test.ts` now reads placeholders with the ICU parser, so words inside plural branches are no longer mistaken for arguments.
- `learning` (dashboard, study plan, adjust, progress & readiness, suggestions) is extracted and converted. Readiness, planning, suggestions and dashboard steps return message keys; tests render them in English through `english()` in `tests/unit/helpers/intl.ts`.
- The study-plan form actions redirect in the learner's language, like the learning actions.
- The shared UI kit's own words (breadcrumb label, fidelity and status badges) come from `common.ui` and `exams.status`.
- next-intl formats dates in `Europe/Rome` on server and browser alike.
- The admin pages stay in English on purpose. The guide **article bodies** (`src/lib/content/guides.ts`) are not translated yet.

**Italian questions (item 2, done):**

- A session's question language is fixed when it starts (`sessionContentLocale` in `src/lib/content/translations.ts`, stored in `attempts.content_locale`): Italian only when asked for and listed in the config's `contentLocales`. An IMAT simulation stays in English.
- The practice page offers "Questions in: English / Italiano" for exams that list Italian (`?questions=`), defaulting to the interface language. Server actions (retries, plan sessions, suggestions, the free test) ask for the interface language.
- `toPresented` / `toReviewable` overlay a question's checked translation: stem, instructions, option wording (ids and letters stay the original's), accessibility text, explanation and distractor notes, plus its passage. A question is shown in Italian only when it and its passage both have checked versions; otherwise in English. `PresentedQuestion.locale` says which.
- The player, feedback, review page, notebook previews and the tutor read that language; question text carries `lang` for screen readers.

## What is left, in order

1. ~~Finish the translation.~~ Done.
2. ~~Serve Italian questions in the player.~~ Done.
3. **Translate the guide articles**, or show a translated note that guides are in English.
4. **Native-speaker review** of the tr/es/pl/it interface text. It was machine-assisted, so have a fluent reader skim each language. Choices the translators flagged:
   - Italian: Dashboard is "Bacheca"; Progress & readiness is "Progressi e preparazione".
   - Spanish: review vs revision is "Repaso de errores" / "Repaso".
   - Turkish: "attempt" is "oturum", the same word as session.
   - Polish: the after-test debrief is "Omówienie po teście" in `player`/`billing` but "Przewodnik po teście" in `results`; align them.
5. **Merge to `main`** through a PR once green.
6. **Production database:** apply `db/postgres/012_stripe_subscriptions.sql`, then `db/postgres/013_content_translations.sql`, to the Supabase project behind Hyperdrive `examer-db`. The code on `main` expects both (the notebook reads `attempts.content_locale`), so do this with the deploy, in the order docs/BILLING.md gives.
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
