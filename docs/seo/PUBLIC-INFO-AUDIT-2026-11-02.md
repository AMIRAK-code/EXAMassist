# Public information: contradictions and fixes, 2 November 2026

Read-only audit of the live site (all five languages), its metadata, structured data and `llms.txt`, search-engine copies (Bing, DuckDuckGo; Google's own results could not be read without signing in) and external profiles. Nothing was signed into, posted or submitted. Raw evidence is in the session notes; the essentials are quoted here.

**What production actually does today.** Payments are switched on: the live pricing page in all five languages shows the paid plans (Single Exam Pass €23.99 once; Plus €7.99 a month or €59.99 a year; Premium announced at €14.99 / €119.00, not purchasable) and does not show the "Everything is free right now" notice, which the page renders only when payments are off (`src/app/[locale]/pricing/page.tsx`). Free today: guides, worked sample questions, the diagnostic for exams that have one open (with an account), and official-score tracking. The question bank shows 963 published questions across 13 live exam configurations.

## 1. Classified findings

| # | Where | What it says | Class | Status |
| --- | --- | --- | --- | --- |
| 1 | `/pricing` (meta, lead, free tier), home lede, terms, account page, all five languages | "a diagnostic for every exam" | **Current error on the site**: the GRE diagnostic is "Not yet" (16 of 17 questions) | **Fixed in this branch**: "for every exam that has one open", in every language |
| 2 | Every page's inline interface messages (`common.language.contentNote`, shipped to the browser on every page) | "TOLC and IMAT questions are also available in Italian" | **Current error on the site** (in the page payload, not visible text). There are no IMAT practice questions | **Fixed**: IMAT removed in all five languages. Since 3 November the site has a free IMAT sample-questions guide (five worked questions, no practice), which says so |
| 3 | `/llms.txt` | Support "answered by a person within 48 hours" | **Current error**: `/about/support` and the footer promise one business day | **Fixed**: llms.txt now reads the same constant as the support page |
| 4 | Home page, under the exam selector | "Free to start, no account needed. As a guest, this browser keeps your practice for 7 days" | **Current error while payments are on**: a guest can try the sample question, but practice needs a plan and the diagnostic an account | **Fixed**: "Try the sample question without an account. A free account keeps your results and lets you take the free diagnostic." (all languages) |
| 5 | Home `<h1>` | "Big ambitions. A clearer next step." | Not an error, but it did not say what the product is | **Changed**: "University admission test practice, with worked explanations."; the slogan stays below it (all languages) |
| 6 | `/pricing` | Sells TIL-I and TIL-A passes; the TIL page says 2026/27 was the last TIL cycle | Inconsistent framing, not false (2026/27 applicants still exist) | **Owner decision**, not changed. Suggested pricing-row note: "For the 2026/27 cycle, the last that uses the TIL. 2027/28 applicants: see the TOLC." |
| 7 | Bing and DuckDuckGo snippet for `/pricing` | "All access for €39.00 a month, or a single exam for €19.99 a month… cancel any time" | **Stale search-engine copy**: old plan names and prices | Needs a recrawl (section 3) |
| 8 | Bing title for `/it` and `/es` | "…verificata sulle fonti", "…verificada con…" | **Stale search-engine copy** of titles changed on 29 October | Needs a recrawl |
| 9 | The "everything is free" description | "Everything is free right now" | **Not on the live site and not in any snippet found.** It is the pricing page's notice for a deployment with payments off; any copy elsewhere is a stale cache from before payments were switched on. The Hashnode article says the same thing in its own words (row 11) | **Skipped at the owners' request (3 November 2026)** |
| 10 | Trustpilot company profile (claimed, October 2026) | Lists "IMAT"; "replicates exact test-day conditions"; summary mentions adaptive mock exams | **External profile, current error**: no IMAT practice (only free samples since 3 November), simulations are labelled approximations, only the SAT simulation is adaptive, no scaled scores | Owners edit in Trustpilot Business; copy in section 2 |
| 11 | Hashnode article "How we built UniExamer" (about 28 October) | "payments aren't switched on yet, so every exam… is open to everyone"; "1,000+" questions; "two independent blind solves"; plan names "Single exam" and "All access" | **External, now wrong** | Owners edit; copy in section 2 |
| 12 | Instagram bio | Omits LSAT and PoliTo TIL; "Practice with explanation" | External, incomplete | Copy in section 2 |
| 13 | GitHub repository `AMIRAK-code/EXAMassist` | Homepage `exa-massist.vercel.app` (answers 500); description "coming soon"; a project directory (nomorevibe.com) copied both and shows README infrastructure text in its snippet | External, wrong address | Owners: set homepage and description; decide whether the README should describe the hosting setup publicly |
| 14 | LinkedIn company page | Consistent with the site | — | Optional: update the tagline to the new heading |

Not found anywhere live: "free forever", "everything is free", IMAT, CEnT-S practice or Politecnico di Milano coverage on uniexamer.com's visible pages. Product Hunt and Crunchbase refused automated access; X, YouTube and Facebook pages were not found; Reddit could not be loaded.

## 2. Replacement copy for profiles we cannot edit from here

Each says only what the site does today. Paste as is, or shorten; do not add claims.

**Trustpilot, "About" (company description)**

> UniExamer is an independent practice site for university admission tests: the Bocconi Online Test (Bachelor's, Law and master's), the CISIA TOLC-E, TOLC-I and TOLC-F, Politecnico di Torino's TIL for the 2026/27 cycle, the Digital SAT, the Enhanced ACT, the LSAT, the GMAT and the GRE, plus free worked IMAT sample questions (no IMAT practice sessions). Every question is original and AI-assisted, with a worked explanation of the right answer and of why each wrong option is wrong. Timed sections follow each test's published structure; full simulations are offered where the published rules allow it, and are labelled as approximations. Guides, worked sample questions and a free diagnostic (for each exam that has one open) are free; practice sessions, timed sections and simulations need a Single Exam Pass or Plus. UniExamer is not affiliated with Bocconi, CISIA, Politecnico di Torino, College Board, ACT, LSAC, GMAC or ETS. Support: support@uniexamer.com, answered by a person within one business day.

**Hashnode article, three replacements**

1. Replace "At the time of writing (October 2026), payments aren't switched on yet, so every exam and practice format is open to everyone." with:
   > Update, 2 November 2026: payments are now switched on. Guides, worked sample questions and the free diagnostic (for each exam that has one open) stay free; practice sessions, timed sections and full simulations need a Single Exam Pass or Plus.
2. Replace "more than 1,000 original practice questions" and "1,000+ reviewed questions" with:
   > more than 950 original practice questions (963 on 2 November 2026)
3. Replace "two independent solvers checked each one" and "published only after two independent blind solves agree" with:
   > Before publication, a separate AI reviewer solves each question blind, without seeing the key, and a question is held back when it disagrees. No question has yet been reviewed by a human subject expert; we will say so on the site when that changes.

   And rename "Single exam" / "All access" to "Single Exam Pass" / "Plus".

**Instagram bio (under 150 characters)**

> Admission test practice with worked explanations: Bocconi, TOLC, SAT, ACT, LSAT, GMAT, GRE, PoliTo TIL. Independent, not affiliated.

**GitHub repository**

- Description: `UniExamer: university admission test practice with worked explanations. https://uniexamer.com`
- Website: `https://uniexamer.com`

**nomorevibe.com listing**: ask the directory (or claim the listing) to change the address to `https://uniexamer.com`; its other text follows from the GitHub fields above.

**LinkedIn tagline (optional)**

> University admission test practice, with worked explanations: Bocconi, TOLC, SAT, ACT, LSAT, GMAT, GRE and PoliTo TIL.

## 3. Getting stale search copies refreshed (after the deploy)

1. Google Search Console → URL Inspection → "Request indexing" for `/`, `/pricing`, `/it`, `/es`, `/exams/cisia-tolc`, `/it/exams/cisia-tolc`. Owner only (needs the Google account).
2. Bing: `npm run seo:indexnow` (IndexNow, which Bing reads) from the deploy machine, or Bing Webmaster Tools → URL Submission for the same URLs.
3. Re-read the snippets about a week later (`site:uniexamer.com pricing` on Bing) and record the result in MEASUREMENT-PLAN.md. A snippet can lag for weeks; do not change the page again because of it.
