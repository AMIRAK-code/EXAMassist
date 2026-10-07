# Bocconi facts re-verified, 7 October 2026

**Checked on:** 2026-10-07 · **First verified:** 2026-09-18 (see
`bocconi-online-test-undergraduate.md`, `bocconi-online-test-law.md`).

How this record was made: an AI research agent fetched each official Bocconi
page and PDF listed below and compared every load-bearing fact in
`src/lib/exams/configs/bocconi-*.ts` with it. PDF quotes are exact (extracted
text); web-page quotes passed through a fetch tool's extraction and are
near-verbatim. No person has re-read these sources for this record.

What changed in the code as a result:

- Both Bocconi configs: `verifiedOn` 2026-10-07, version 2026.10, the Spring
  session (8–27 April 2027, Italian applicants only) added, the Early session
  marked closed, the €60 fee per attempt recorded, and the AY 2027/28 rules
  PDF cited instead of the AY 2026/27 one. Two "unverified" items in the
  undergraduate config were resolved and removed (the 2027/28 PDF is now
  reachable; the Spring session is confirmed).
- `src/lib/exams/bocconi-facts.ts`: the sourced FAQ and facts on the Bocconi
  page, all from the table below.

---

# Bocconi Online Test: fact check against official sources (checked 2026-10-07)

URL key:
- [TEST-EN] https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test
- [TEST-IT] https://www.unibocconi.it/it/entrare-bocconi/corsi-di-laurea-triennale-e-giurisprudenza/ammissione/test-online-bocconi
- [ADM] https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions
- [SAT] https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act
- [RES] https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/results-and-enrollment
- [RULES-2728] https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf (HTTP 200, 1.2 MB; titled "BOCCONI ONLINE TEST Academic Year 2027/28 INSTRUCTIONS AND RULES OF CONDUCT")
- [RULES-2728-IT] https://www.unibocconi.it/sites/default/files/media/attachments/Istruzioni%20e%20Regole%20di%20Comportamento%2027%2028_0.pdf (HTTP 200; Italian version, linked from TEST-IT)
- [RULES-2627] https://www.unibocconi.it/sites/default/files/Istruzioni%20e%20regole_26-27%20ENG.pdf (still HTTP 200, but titled "ONLINE ADMISSION TEST AY 2026-2027"; outdated, no longer linked from TEST-EN)

The page quotes from TEST-EN, ADM, SAT and RES came through WebFetch's model extraction, so the wording is near-verbatim. The RULES-2728 quotes are exact, taken from pdftotext output.

## UNDERGRADUATE (standard) Online Bocconi Test

| # | Fact (repo) | Status | Source | Evidence |
|---|---|---|---|---|
| 1 | 50 single-answer MCQ | CONFIRMED | TEST-EN | "50 multiple-choice questions"; "single-choice multiple-choice questions" |
| 2 | 75 minutes, one block | CONFIRMED (75 min). "One block" is not stated, but there are no sections or breaks: the areas are mixed and navigation is sequential | TEST-EN | "The online Bocconi test lasts 75 minutes" |
| 3 | Areas Math 24 / Reading 11 / Numerical 6 / Critical thinking 9 | CONFIRMED | TEST-EN, TEST-IT | Mathematics 24, Reading comprehension 11, Numerical reasoning 6, Critical thinking 9 |
| 4 | Areas mixed through the test | CONFIRMED | TEST-EN | "distributed within the test in a mixed way both by difficulty level and by topic" |
| 5 | Scoring +1 / 0 / -0.2 | CONFIRMED | TEST-EN | correct "1 point", missing "0 points", wrong "-0.2 points" |
| 6 | -0.33 for 3-option critical-thinking items | CONFIRMED | TEST-EN | "'critical thinking' area that give only three possible answer options, the penalty will be - 0.33 points" |
| 7 | Below 17 (penalties incl.) not considered | CONFIRMED | TEST-EN | "total score (penalties included) lower than 17 will not be considered in the selection process" |
| 8 | AI bachelor: at least 11/24 in Mathematics | CONFIRMED | TEST-EN | "at least 11 points out of 24 in the 'Mathematics' area" |
| 9 | 3 questions per screen, Next, no going back (s.3.2) | CONFIRMED (s.3.2 is now titled "SEQUENTIAL NAVIGATION DURING THE TEST") | RULES-2728 s.3.2 | "The test presents 3 questions on each screen ... will not be able to return to previous screens." |
| 10 | Summary page before Submit (s.3.3) | CONFIRMED (s.3.3 "COMPLETING THE TEST") | RULES-2728 s.3.3 | "click the "Finish" button. A summary page will appear ... click "Submit All and Finish"" |
| 11 | No calculator | CONFIRMED | RULES-2728 s.4 rule 5 | "notebooks, notes, formula sheets, calculators or any sources/resources available online" (not permitted) |
| 12 | Remote proctored | CONFIRMED. Recorded and reviewed afterwards, not live | TEST-EN; RULES-2728 s.5.2 | "test session is audio and video recorded"; "not a "live proctoring" system" |
| 13 | Safe Exam Browser | CONFIRMED | RULES-2728 s.2.1, s.3.1 | "Launch of the lockdown browser (Safe Exam Browser)" |
| 14 | Two blank A4 sheets | CONFIRMED | RULES-2728 s.2.2 | "1 pencil/pen, 2 blank A4 sheets of paper, a beverage" |
| 15 | Italian or English | CONFIRMED | TEST-EN; RULES-2728 s.1.3 | "Test language - Italian or English" |
| 16 | Up to 4 attempts per test type per year | CONFIRMED | TEST-EN; RULES-2728 s.1.3 | "maximum of four (4) test attempts per test type per year" |
| 17 | Not same day / consecutive days | CONFIRMED | RULES-2728 s.1.3 | "Multiple attempts may not be taken on the same day or on consecutive days." (also: next purchase only 24h after previous purchase) |
| 18 | Score report within 48 hours | CONFIRMED (the total score is also shown immediately at the end) | RULES-2728 s.3.4, s.3.3 | "within the following 48 hours you will be able to access your "Test Score Report"" |
| 19 | Ranking: test 55% / GPA 45% (third-last + second-last year) | CONFIRMED | ADM | "Selection test score - 55%"; "Third-last and second-last year GPA - 45%" |
| 20 | Booking: international 13 Jul 2026 - 19 Jan 2027 | CONFIRMED | RULES-2728 s.1.1; TEST-EN | "They may book the Online Bocconi Test from 13 July 2026 to 19 January 2027." |
| 21 | Booking: Italian 13 Jul 2026 - 20 Apr 2027 | CONFIRMED | RULES-2728 s.1.1; TEST-IT | "They may book the Online Bocconi Test from 13 July 2026 to 20 April 2027." |
| 22 | Early session 2-29 Sep 2026 | CONFIRMED, NOW IN THE PAST (closed 29 Sep 2026, 3pm; results "mid November 2026" per ADM) | RULES-2728 s.1.1; ADM | "Early Session (2-29 September 2026, 3:00pm Italian time)" |
| 23 | Winter session 25 Nov 2026 - 26 Jan 2027 | CONFIRMED (results "mid March 2027" per ADM) | RULES-2728 s.1.1; ADM | "Winter Session (25 November 2026-26 January 2027, 3:00pm Italian time)" |
| 24 | "Possibly" a Spring session for Italian applicants | CHANGED: now definite, 8-27 April 2027, Italian applicants only | RULES-2728 s.1.1; TEST-IT | "Spring Session (8-27 April 2027, 3:00pm Italian time)" |
| 25 | SAT total <1040 or section <520 not considered | CONFIRMED | SAT | "total score lower than 1040 will not be considered"; "score lower than 520 in the test sections" |
| 26 | SAT AI bachelor 600 Math | CONFIRMED | SAT | "at least 600 points out of 800 in the "Math" area" |
| 27 | ACT composite <19 not considered | CONFIRMED | SAT | "composite score lower than 19" (not considered) |
| 28 | ACT AI bachelor 25 Math | CONFIRMED | SAT | "at least 25 points out of 36 in the "Math" area" |
| 29 | LSAT minimum 147 (Law) | CONFIRMED | SAT | "a test score below 147 out of 180 will not be considered" |
| 30 | Test fee | FOUND (new): EUR 60 per attempt, paid by PayPal or credit card. Separate application fee: EUR 100 per programme | TEST-EN; RULES-2728 s.1.3; ADM | "The registration fee is €60 for each test attempt."; "An application fee of €100 is required" |

Extra details found:
- SAT scores from before 2022 and ACT scores from before 2021 are not considered. SAT code 7206, ACT code 5356 (SAT page).
- If you submit several tests, the portal uses the highest: "the online admission portal will pick the highest for you" (ADM).
- The test can be taken any time 12:00am-11:59pm Italian time on the booked date. Booking opens from the second day after the current date (RULES-2728 s.1.3).
- The date or language can be changed up to 24h before the test. Withdrawal with refund within 14 days of purchase, before the test date (RULES-2728 s.6.1, s.6.3).
- Webtesting platform: https://bocconiwebtesting.giuntipsy.com (Giunti Psychometrics). Tech support only via support.giuntipsy.com.
- Equipment: a computer with admin rights, plus a smartphone or tablet running ProctorExam for the side recording. Windows 10/11 or macOS 11+, Chrome as the default browser (RULES-2728 s.2.1).
- Platform closure dates listed on TEST-EN: 1-23 Aug 2026; 25 Sep-13 Oct 2026 (ongoing as of today); 7-8 Dec 2026; 17 Dec 2026-1 Jan 2027; 22 Jan-9 Feb 2027; 28-29 Mar 2027.
- RES still shows AY 2026-27 results dates (Early 12 Nov 2025, Winter 11 Mar 2026, Spring 19 May 2026). Exact AY 2027-28 results dates are NOT published there yet; ADM gives only "mid November 2026" and "mid March 2027".

## LAW: Online Bocconi Test - Law

| # | Fact (repo) | Status | Source | Evidence |
|---|---|---|---|---|
| L1 | Separate test from standard | CONFIRMED | RULES-2728 s.1.3 | Test type: "Online Bocconi Test" / "Online Bocconi Test - Law" |
| L2 | 50 Q / 75 min | CONFIRMED | TEST-EN, TEST-IT | "50 multiple-choice questions"; 75 minutes for both versions |
| L3 | Math 5 / Reading 11 / Numerical 6 / Logic and critical thinking 18 / Verbal reasoning 10 | CONFIRMED | TEST-EN, TEST-IT | five areas with these counts |
| L4 | Same scoring and 17 floor | CONFIRMED (the scoring section applies to both tests) | TEST-EN | "lower than 17 will not be considered in the selection process" |
| L5 | Restricts applicant to Law programmes; which ones | CONFIRMED. Law test = legal-area programmes only: the integrated Master of Arts in Law, and Global Law. The standard test is valid for any programme, Law included | TEST-EN; ADM | "the second can only be used to apply for programs in the legal area"; "accepted only for programs of the Law School" |

## Official practice material and syllabus

- Syllabus: there is no separate syllabus URL. The topic lists for each area sit on TEST-EN (EN) and TEST-IT (IT), under the subject-area descriptions for both tests.
- Official free online simulation (50 Q, 75 min, no monitoring): EN https://info.unibocconi.it/forms/session.php?tipo=T&lingua=eng&key=C-00510048 (HTTP 200; it is a form/sign-in page) and IT https://info.unibocconi.it/forms/session.php?tipo=T&lingua=ita&key=C-00510048. TEST-EN: "allows students to take a timed test in an environment that replicates the structure and format of the Bocconi online test"
- TEST-EN also points to "The Faculty" app (third-party, iOS/Android) for practice questions by topic.

## Instructions and Rules of Conduct PDF

- The CURRENT one is the 27-28 URL (RULES-2728), which is the link on TEST-EN. Its Italian twin is RULES-2728-IT.
- The 26-27 URL still loads (HTTP 200) but it is the AY 2026-2027 edition. Its s.3.2/3.3 have the same rules under the old titles ("Sequential navigation during the test" / "Conclusion of the test", buttons "Finish attempt" / "Submit all and finish"). The repo should cite the 27-28 URL. In bocconi-undergraduate.ts, line 25 still points at the 26-27 PDF.
- s.3.2 (27-28) "SEQUENTIAL NAVIGATION DURING THE TEST": 3 questions per screen; "Next" moves forward, you cannot return; going through all the questions means no refund, and the attempt counts as one of the four; a "Test Navigation" panel is on every page.
- s.3.3 (27-28) "COMPLETING THE TEST": "Finish" opens a summary page of all questions, answered and omitted; then "Submit All and Finish". The test closes automatically when time runs out (answers saved), and the total score is shown immediately.

## Common applicant questions (official answers)

1. Can I use a calculator? No. Calculators, notes and formula sheets are not permitted. RULES-2728 s.4 rule 5: "notebooks, notes, formula sheets, calculators or any sources/resources available online".
2. How many times can I take it? Up to 4 attempts per test type per year, never on the same or consecutive days. TEST-EN: "For each test type, you may take up to four test attempts". RULES-2728 s.1.3.
3. If I take it several times, which score counts? The highest. ADM: "the online admission portal will pick the highest for you".
4. What score do I need? At least 17/50 (penalties included) to be considered. AI bachelor also needs 11/24 in Mathematics. No admission cut-off is published, since admission is by ranking (test 55%, GPA 45%). TEST-EN; ADM.
5. Is it in English? You choose Italian or English, whatever the programme's language. RULES-2728 s.1.3: "The language selected for the test is independent of the language of instruction".
6. Undergraduate vs Law test? The standard test is valid for every programme, Law included. The Law test is valid only for legal-area programmes (integrated MA in Law, Global Law) and has a different mix (5 Math, 18 Logic and critical thinking, 10 Verbal reasoning). TEST-EN.
7. How much does it cost? EUR 60 per attempt, plus a EUR 100 application fee per programme. TEST-EN; ADM.
8. Is there negative marking? Yes: -0.2 per wrong answer, -0.33 on 3-option critical-thinking items, 0 if left blank. TEST-EN.
9. Can I go back and change answers? No. There are 3 questions per screen, and after "Next" you cannot return. RULES-2728 s.3.2.
10. Where do I take it / is it proctored? At home, alone in a room with one closed door. It is recorded by webcam, screen share and a side smartphone (ProctorExam) in Safe Exam Browser, then reviewed later (not live). RULES-2728 s.2, s.5.2.
11. What can I have on the desk? Computer, ID, 1 pen/pencil, 2 blank A4 sheets, a drink, and your access credentials. RULES-2728 s.2.2.
12. When do I get my score? The total is shown at the end. The Test Score Report, with per-area scores, comes within 48 hours. RULES-2728 s.3.3-3.4.
13. Is there official practice? Yes: a free online simulation (50 Q, 75 min, unmonitored) and per-area topic lists on TEST-EN. Bocconi does not publish past papers or an official question bank (the page points to the third-party Faculty app).
14. Can I use SAT/ACT/LSAT instead? Yes: SAT (>=1040 total, >=520 per section), ACT (composite >=19), LSAT >=147 (Law only). SAT page.
15. Can I use extra time for SLD/disability? Yes, if you submit the request form at least 5 business days before the test. RULES-2728 s.1.4.

## Could not fetch / limits

- Every target page and PDF was reachable. The PDFs could not be read through WebFetch (binary), so they were downloaded and their text extracted locally with pdftotext.
- The online simulation link opens a form page. I did not go through it.
- No AY 2027-28 results dates are on RES yet (it still shows 2026-27).
