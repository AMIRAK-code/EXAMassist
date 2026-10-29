# Keeping public content accurate

Written 29 October 2026. Applies to the exam hubs, format guides, guides and sample questions. The rules already in the code stay the rules: exam facts live in the configurations with their source and `verifiedOn` date, guide dates change only when the substance changes (`src/lib/content/guides.ts`, `src/lib/content/page-dates.ts`), and nothing is labelled as reviewed by a human expert unless a named, qualified person reviewed it.

## Facts that expire

| Fact | Where it lives | Re-check when | Official source |
| --- | --- | --- | --- |
| Bocconi undergraduate and Law: structure, scoring, sessions, fees, attempts | `src/lib/exams/configs/bocconi-{undergraduate,law}.ts`, `src/lib/exams/bocconi-facts.ts`, sample-questions guide intro | Every 3 months, and when Bocconi publishes the 2028/29 rules (expected around July 2027) | unibocconi.it test page and the Instructions and Rules of Conduct PDF |
| Bocconi graduate test and GMAT/GRE thresholds | `bocconi-graduate.ts`, Bocconi master hub routes | Before each admission round (next: Round III, 27 January 2027) | unibocconi.it MSc/MA admissions pages |
| PoliTo TIL-I and TIL-A | `polito-til-{i,a}.ts` | **Now**: the configs describe the 2026/27 call only | polito.it admission test page and the yearly call (bando) |
| CISIA TOLC-E, -F, -I | `tolc-{e,f,i}.ts`, `src/lib/exams/tolc-rules.ts` | In January 2027: CISIA announces structural changes by 31 December | cisiaonline.it structure and syllabus pages, Regolamento TOLC |
| Digital SAT, Enhanced ACT, LSAT, GMAT, GRE | their configs | Every 6 months, and on any announced format change | the test makers' pages listed in each config |
| Support promise (one business day, five languages) | `src/lib/support.ts`, `src/lib/site.ts` | When the owners change it | owners' decision |
| Social profiles in `sameAs` | `SOCIAL_LINKS` in `src/lib/site.ts` | When a profile is renamed or closed | the profiles themselves |

When a fact changes: update the configuration and its `verifiedOn`, re-read every guide that repeats the fact (search `content/` and `src/lib/content/` for the number), update `updatedOn` only on guides whose substance changed, and add a line to the guide's "About this page" section saying what changed. Never advance a date or a year in a title without reviewing the content.

## Broken official links

`tests/unit/guides.test.ts` checks that internal links in guides resolve and that official links are cited as sources. It does not fetch external URLs. Once a quarter, open every URL in the configs' `sources` and in each guide's `sources`; when one has moved, find the new official page and re-verify the fact before changing the link. Do not replace a dead official source with a third-party page.

## Sample questions

- New sample questions are written as new items, never copied from the bank (`tests/unit/guides.test.ts` checks this), so publishing an answer spoils no scored session.
- Each question is solved independently before publishing; arithmetic, units, the passage's support for the key, uniqueness of the key and every distractor's explanation are checked.
- A translated sample set is published only after a fluent reviewer has checked the questions, the options and the explanations in that language.

## Corrections

Readers report mistakes to support@uniexamer.com (each guide's "About this page" says so) or, for bank questions, through the report form. A confirmed error in a guide is fixed in place with a dated note in "About this page"; a confirmed error in a bank question follows the editorial standards (quarantine, rewrite, new review).

## Consolidating

A guide with no impressions after 90 days and no internal links pointing to it is a candidate for merging into the closest hub or guide, with a 301 from its URL. Do not delete exam facts that the format guides rely on.

## Building authority (plan only; nothing has been sent)

Nothing below has been done, and none of it should be done without the owners' approval of each message. Do not buy links, trade reviews or post promotional content in communities that forbid it.

1. **Student associations and orientation services.** Offer Bocconi and PoliTo applicant groups, and school orientation counsellors, the sample-questions pages as free material they can link to. Ask for nothing in return.
2. **Educators.** Ask maths and logic teachers who prepare students for Italian admission tests to review a sample set. If one agrees and is qualified, name them with their agreement and say exactly what they reviewed. This is the only legitimate route to an "expert reviewed" statement.
3. **Communities.** Answer specific questions on admissions forums and subreddits with the relevant guide only where the rules allow links and the guide answers the question. One account, disclosed as UniExamer.
4. **Own profiles.** Keep the Hashnode blog, LinkedIn, Instagram and Substack profiles linking to uniexamer.com with the same name and description; they are the Organization's `sameAs`.
5. **Reviews.** A Trustpilot page for uniexamer.com exists (seen in Bing on 2026-10-29). Do not solicit, write or incentivise reviews; answer genuine ones from the company account once the owners claim the page.
