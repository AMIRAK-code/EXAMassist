import type { GuideSource, SampleQuestionSet } from '@/lib/content/guides';

/**
 * Editorial content for an exam hub page, beyond what the exam configurations
 * hold: the direct answer under the heading, where the next admissions cycle
 * stands, which test to prepare for, and worked sample questions.
 *
 * English only, like the configurations: these hubs are English-only pages
 * (src/i18n/alternates.ts). The Bocconi hub has its own landing page and is
 * not listed here.
 *
 * Every fact about a future cycle is either confirmed by the test maker's
 * own pages, with a link, or listed as not published yet. `updatedOn` is the
 * date this content last changed in substance: the sitemap and the page's
 * structured data read it, so change it only with the content.
 */

export interface HubContent {
  /** The page's heading, when the hub's name alone does not answer the search. */
  headline: string;
  /** The title in search results, before " | UniExamer". */
  metaTitle: string;
  /** The direct answer, shown under the heading. */
  leadMd: string;
  /** Where the next admissions cycle stands: what is confirmed and what is not published yet. */
  status?: { heading: string; checkedOn: string; bodyMd: string };
  /** Which test to prepare for, by applicant. */
  routes?: { heading: string; bodyMd: string };
  /** Shown above the exam details when they describe a cycle that has ended. */
  detailsNote?: { title: string; bodyMd: string };
  /** Worked examples: original, AI-assisted, kept out of the question bank. */
  samples?: { id: string; heading: string; introMd: string; set: SampleQuestionSet };
  updatedOn: string;
  sources: GuideSource[];
}

const POLITO_TEST_PAGE =
  'https://www.polito.it/en/education/applying-studying-graduating/admissions-and-enrolment/bachelor-s-degree-programmes/admission-test';
const POLITO_CALLS_PAGE =
  'https://www.polito.it/en/education/applying-studying-graduating/admissions-and-enrolment/bachelor-s-degree-programmes/calls-for-application-regulations-and-ranking-lists';
const POLITO_PRESS_NOTE =
  'https://www.polito.it/ateneo/comunicazione-e-ufficio-stampa/poliflash/test-d-ingresso-20262027-il-politecnico-sempre-piu';
const POLITO_CALL_ENGINEERING_2026_27 =
  'https://www.polito.it/sites/default/files/2025-12/Call%20for%20applications%20for%20admissions%20Engineering%20_%20LP%202026-27.pdf';
const CISIA_CENT_PAGE = 'https://www.cisiaonline.it/en/cent/all-about-CEnT/all-about-CEnT';
const CISIA_CENT_S_STRUCTURE = 'https://www.cisiaonline.it/en/cent/cent-s/structure-and-syllabus';
const CISIA_TOLC_ABOUT = 'https://www.cisiaonline.it/en/tolc/all-about-TOLC/what-is-the-TOLC';
const CISIA_REGULATION_2026 = 'https://www.cisiaonline.it/sites/default/files/Regolamenti/Regolamento-TOLC-2026.pdf';
const CISIA_CALENDAR = 'https://testcisia.it/calendario.php';
const CISIA_PRACTICE = 'https://www.cisiaonline.it/prepararsi/tolc-esercitazioni';
const CISIA_MOOC = 'https://www.cisiaonline.it/prepararsi/mooc';

const polito: HubContent = {
  headline: 'Politecnico di Torino admission test: from TIL to CISIA',
  metaTitle: 'Politecnico di Torino admission test: TIL, TOLC and CEnT-S',
  leadMd: `**Politecnico di Torino is replacing its own admission tests.** From the 2027/28 academic year PoliTo joins the CISIA consortium and admits students with CISIA tests taken in person: according to its announcement of July 2026, the TOLC for national candidates and the CEnT-S for international candidates. The TIL-I (Engineering) and TIL-A (Architecture) described further down were the admission tests for 2026/27, the last cycle that used them.

PoliTo's calls for applications for 2027/28, which will set out which test each programme requires, the thresholds and the dates, had not been published when we last checked, on 2 November 2026.`,
  status: {
    heading: '2027/28 admission: what is confirmed and what is not',
    checkedOn: '2026-11-02',
    bodyMd: `**Confirmed by PoliTo**

- From 2027/28 PoliTo joins the CISIA consortium and uses CISIA's tests for admission ([admission test page](${POLITO_TEST_PAGE})).
- Only tests taken in person count, at PoliTo or at another university: **TOLC@UNI** and **CEnT@UNI**. The at-home versions, TOLC@CASA and CEnT@CASA, are not accepted.
- PoliTo's announcement of 23 July 2026 names the **TOLC for national candidates** and the **CEnT-S for international candidates** ([news item, in Italian](${POLITO_PRESS_NOTE})).
- The 2027/28 calls are being finalised and, in PoliTo's words, "will be published soon" ([calls page](${POLITO_CALLS_PAGE})).

**Not published yet**

- Which TOLC each programme requires. CISIA's test for engineering degrees is the TOLC-I, but PoliTo has not said which TOLC applies to which programme, or what applies to Architecture.
- Minimum scores, how the ranking works and how many attempts count.
- Test dates, deadlines and how to apply.
- Whether the SAT is still accepted. For 2026/27 it was an alternative to the TIL-I ([2026/27 Engineering call, art. 12](${POLITO_CALL_ENGINEERING_2026_27})).`,
  },
  routes: {
    heading: 'What to prepare for now',
    bodyMd: `- **National candidates for Engineering.** The TOLC-I is CISIA's engineering test: 50 questions in 110 minutes (Mathematics 20, Logic 10, Sciences 10, Verbal comprehension 10), then 30 English questions. A right answer scores 1, a blank 0 and a wrong answer −0.25 in the main sections. PoliTo has not yet confirmed that its Engineering programmes will use it, so check the call when it appears. You can [try worked TOLC-I sample questions](/exams/cisia-tolc#tolc-i-samples) and practise the whole test on our [CISIA TOLC page](/exams/cisia-tolc).
- **International candidates.** The CEnT-S is CISIA's English-language test for science, engineering and economics degrees. UniExamer does not offer CEnT-S practice; CISIA's [CEnT-S page](${CISIA_CENT_S_STRUCTURE}) describes its structure.
- **The TIL itself.** Practice in the TIL-I and TIL-A formats stays available below for their maths, physics, logic and reading questions, but no 2027/28 admission uses these tests.`,
  },
  detailsNote: {
    title: 'The details below are the 2026/27 rules',
    bodyMd: `They come from PoliTo's 2026/27 calls for applications, the last cycle to use the TIL, and are kept for reference and practice. PoliTo's admission test page now describes the CISIA tests instead; the 2026/27 calls remain in its [archive of previous academic years](${POLITO_CALLS_PAGE}).`,
  },
  updatedOn: '2026-11-02',
  sources: [
    { label: 'Admission test, a.y. 2027/28: the move to CISIA tests', url: POLITO_TEST_PAGE, publisher: 'Politecnico di Torino' },
    { label: 'Calls for applications, regulations and ranking lists', url: POLITO_CALLS_PAGE, publisher: 'Politecnico di Torino' },
    { label: 'Test d’ingresso 2026/2027 (news item, 23 July 2026)', url: POLITO_PRESS_NOTE, publisher: 'Politecnico di Torino' },
    { label: 'Call for applications, Engineering, a.y. 2026/27 (PDF)', url: POLITO_CALL_ENGINEERING_2026_27, publisher: 'Politecnico di Torino' },
    { label: 'CEnT-S: structure and syllabus', url: CISIA_CENT_S_STRUCTURE, publisher: 'CISIA' },
  ],
};

const tolcSamples: SampleQuestionSet = {
  sections: [
    {
      id: 'tolc-i-samples',
      heading: 'TOLC-I sample questions',
      introMd:
        'One question from each of three TOLC-I sections. On the real test the Mathematics section gives you 50 minutes for 20 questions, and Logic and Sciences 20 minutes for 10 each: about two minutes a question, without a calculator.',
      questions: [
        {
          id: 'tolc-sample-log-maximum',
          title: 'The maximum of a sum of logarithms',
          topic: 'Mathematics: logarithms and quadratic functions',
          stemMd: 'What is the maximum value of the function $f(x) = \\log_2(x - 1) + \\log_2(5 - x)$ on its domain?',
          options: [
            { id: 'A', text: '$\\log_2 3$', note: 'This is $f(2)$, and also $f(4)$: trying whole numbers in the domain misses the highest point, at $x = 3$.' },
            { id: 'B', text: '$2$', note: '' },
            { id: 'C', text: '$3$', note: '3 is the value of $x$ where the maximum is reached, not the maximum value of $f$.' },
            { id: 'D', text: '$4$', note: '4 is the maximum of the product $(x - 1)(5 - x)$. The function is its base-2 logarithm, so its maximum is $\\log_2 4 = 2$.' },
            { id: 'E', text: '$f$ has no maximum', note: 'On its domain the product inside the logarithm is a downward parabola, which has a highest point, and $\\log_2$ is increasing, so $f$ has one too. What $f$ lacks is a minimum: it falls without limit near $x = 1$ and $x = 5$.' },
          ],
          answer: 'B',
          workingMd: `Both logarithms are defined only when $x - 1 > 0$ and $5 - x > 0$, so the domain is $1 < x < 5$. There the two logarithms combine into one:

$$f(x) = \\log_2\\big[(x - 1)(5 - x)\\big]$$

The product $(x - 1)(5 - x) = -x^2 + 6x - 5$ is a downward parabola with its vertex halfway between its roots 1 and 5, at $x = 3$, where it equals $2 \\times 2 = 4$. Because $\\log_2$ is increasing, $f$ is largest where the product is largest: $f(3) = \\log_2 4 = 2$.`,
          lesson: 'To maximise the logarithm of an expression, maximise the expression: the logarithm is increasing. Find the domain before combining logarithms.',
        },
        {
          id: 'tolc-sample-lockers',
          title: 'Four lockers in a row',
          topic: 'Logic: orderings and arrangements',
          stemMd: `Four lockers in a row are numbered 1 to 4 from left to right. Luca, Marta, Nico and Olga each have one of them.

- Marta’s locker is immediately to the right of Luca’s.
- Olga’s locker is not at either end of the row.
- Nico’s locker has a higher number than Olga’s.

Who has locker 2?`,
          options: [
            { id: 'A', text: 'Luca', note: 'Luca in 2 puts Marta in 3, and Olga, who cannot take an end locker, would need 2 or 3: both are taken.' },
            { id: 'B', text: 'Nico', note: 'Nico’s number must be higher than Olga’s, so Olga would need locker 1, which is at an end.' },
            { id: 'C', text: 'Olga', note: 'Then Nico has 3 or 4, and Luca and Marta need two adjacent lockers among the two left: 1 and 4, or 1 and 3. Neither pair is adjacent.' },
            { id: 'D', text: 'Marta', note: '' },
            { id: 'E', text: 'It cannot be determined from the information given', note: 'The three conditions leave exactly one arrangement, so the answer is determined.' },
          ],
          answer: 'D',
          workingMd:
            'Start from the most restrictive condition: Olga has locker 2 or 3. If she had 2, Nico would have 3 or 4 and the two lockers left for Luca and Marta (1 and 4, or 1 and 3) would not be next to each other, which the first condition needs. So Olga has 3, Nico, with a higher number, has 4, and Luca and Marta take 1 and 2, in that order. Locker 2 is Marta’s.',
          lesson: 'In arrangement problems, start from the condition that leaves the fewest cases and follow each case to the end: a contradiction rules it out.',
        },
        {
          id: 'tolc-sample-kinematics',
          title: 'Distance under uniform acceleration',
          topic: 'Sciences: kinematics',
          stemMd: 'A car starts from rest and accelerates uniformly, reaching a speed of 20 m/s after 8 s. How far does it travel in those 8 seconds?',
          options: [
            { id: 'A', text: '10 m', note: '10 m/s is the average speed, not a distance: multiply it by the time.' },
            { id: 'B', text: '20 m', note: '20 m/s is the final speed, not a distance. Check that the unit of your answer is the unit asked for.' },
            { id: 'C', text: '80 m', note: '' },
            { id: 'D', text: '160 m', note: 'Final speed × time, as if the car had moved at 20 m/s from the start. It began at rest.' },
            { id: 'E', text: '640 m', note: 'Puts the final speed (20) in place of the acceleration in $s = \\tfrac{1}{2}at^2$.' },
          ],
          answer: 'C',
          workingMd: `With uniform acceleration the average speed is halfway between the initial and the final speed: $\\tfrac{0 + 20}{2} = 10$ m/s. Over 8 s that is $10 \\times 8 = 80$ m.

The same with the formulas: $a = \\tfrac{20}{8} = 2.5$ m/s², and $s = \\tfrac{1}{2}at^2 = \\tfrac{1}{2} \\times 2.5 \\times 64 = 80$ m.`,
          lesson: 'Starting from rest with uniform acceleration, distance = ½ × final speed × time. It is quicker than finding the acceleration first.',
        },
      ],
    },
    {
      id: 'tolc-e-samples',
      heading: 'TOLC-E sample questions',
      introMd:
        'One question from each of two TOLC-E sections. On the real test each section has 30 minutes: 13 Logic questions, 10 Verbal comprehension and 13 Mathematics, also without a calculator.',
      questions: [
        {
          id: 'tolc-sample-ratio',
          title: 'A ratio that changes',
          topic: 'Mathematics: ratios and proportions',
          stemMd: 'In a class, the ratio of girls to boys is 3 : 2. After four girls move to another class, there are as many girls as boys. How many students were in the class at first?',
          options: [
            { id: 'A', text: '4', note: '4 is the size of one part of the ratio, not a number of students.' },
            { id: 'B', text: '8', note: '8 is the number of boys, who do not change.' },
            { id: 'C', text: '12', note: '12 is the number of girls at first, not the whole class.' },
            { id: 'D', text: '16', note: '16 is the size of the class after the four girls have left.' },
            { id: 'E', text: '20', note: '' },
          ],
          answer: 'E',
          workingMd:
            'Write the class as $3k$ girls and $2k$ boys. After four girls leave, the numbers are equal: $3k - 4 = 2k$, so $k = 4$. That is 12 girls and 8 boys, 20 students in all. Check: $12 : 8 = 3 : 2$, and $12 - 4 = 8$.',
          lesson: 'Turn a ratio into multiples of one unknown (3k and 2k), write the new condition as an equation, then reread which quantity the question asks for.',
        },
        {
          id: 'tolc-sample-necessary-condition',
          title: 'What “only” means in a rule',
          topic: 'Logic: necessary and sufficient conditions',
          stemMd: 'At a conference, this rule applies: “Only people who registered online can attend the afternoon workshop.” Which of the following statements is certainly true?',
          options: [
            { id: 'A', text: 'If Giulia attended the afternoon workshop, she registered online.', note: '' },
            { id: 'B', text: 'Everyone who registered online attended the afternoon workshop.', note: 'The rule limits who may attend; it does not oblige anyone who registered to attend.' },
            { id: 'C', text: 'If Marco did not attend the afternoon workshop, he did not register online.', note: 'Marco may have registered and simply stayed away. Not attending tells you nothing about registering.' },
            { id: 'D', text: 'If Sara registered online, she attended the afternoon workshop.', note: 'Turns the rule around: registering is needed to attend, but it is not enough to guarantee attending.' },
            { id: 'E', text: 'Some people who attended the afternoon workshop did not register online.', note: 'This contradicts the rule, so it is certainly false.' },
          ],
          answer: 'A',
          workingMd:
            '“Only people who registered can attend” makes registering a necessary condition for attending: if someone attended, they registered. Option A says exactly this about Giulia. The rule does not make registering sufficient, so options B, C and D, which all treat it as if it were, are not certain.',
          lesson: '“Only A can B” means “if B, then A”. A is necessary, not sufficient: watch for options that turn the rule around.',
        },
      ],
    },
  ],
  afterMd: `## About these examples

They were written by the UniExamer team for this page, with AI assistance, and published on 2 November 2026. They are not CISIA questions, their difficulty is not calibrated to the real test, and five questions cannot estimate a TOLC score. Every answer was re-derived step by step during editing; no human subject expert has reviewed them. They are not in our question bank, so reading the answers spoils no practice session. If you find a mistake, [tell us](/about/support).

## Official CISIA preparation

CISIA's [practice area](${CISIA_PRACTICE}) has exercises and simulations, available once you register with CISIA. Its [MOOCs](${CISIA_MOOC}) in basic mathematics, text skills, physics, chemistry and biology are open to anyone free of charge. Both are in Italian, like the TOLC itself.`,
};

const cisia: HubContent = {
  headline: 'CISIA TOLC-E, TOLC-I and TOLC-F',
  metaTitle: 'CISIA TOLC-E, TOLC-I, TOLC-F: format and sample questions',
  leadMd: `**The TOLC is the online admission test that CISIA runs for many Italian universities.** This page covers three of its types: the **TOLC-E** for economics and statistics (36 questions in 90 minutes), the **TOLC-I** for engineering (50 in 110) and the **TOLC-F** for pharmacy (50 in 72). In the main sections a right answer scores 1, a blank 0 and a wrong answer −0.25; a 30-question English section without penalty follows. There is no national pass mark: each university sets its own and decides how to use the result.

The TOLC is an Italian-language test. Since November 2025 the English TOLC-E, TOLC-I and TOLC-F have been replaced by a separate English test, the CEnT-S, which UniExamer does not cover.`,
  status: {
    heading: '2027: what is confirmed and what is not',
    checkedOn: '2026-11-02',
    bodyMd: `**Confirmed by CISIA**

- The structure and scoring on this page are those of CISIA's 2026 regulation. CISIA announces any change to the tests' structure by 31 December each year ([TOLC regulation 2026, art. 1.2, in Italian](${CISIA_REGULATION_2026})).
- You can take the same type of TOLC once every calendar month ([what is the TOLC](${CISIA_TOLC_ABOUT})). The fee for 2026 was €35.
- Since November 2025 English-taught programmes use the **CEnT-S** instead of the English TOLCs ([CEnT page](${CISIA_CENT_PAGE})).
- From 2027/28 **Politecnico di Torino** also admits with CISIA tests, taken in person only: see [what changes at PoliTo](/exams/politecnico-di-torino-til).

**Not published yet**

- The 2027 TOLC dates: CISIA's [calendar](${CISIA_CALENDAR}) listed no 2027 sessions when we checked.
- Any change to structure, scoring or fee for 2027, and the 2027 regulation.
- Each university's 2027/28 call: which TOLC it requires, its threshold and its deadlines.`,
  },
  samples: {
    id: 'samples',
    heading: 'Worked sample questions',
    introMd:
      'Five original questions in the TOLC format: five options, one correct, no calculator. Try each before opening the answer; the explanation covers every wrong option, because the reasons people choose them are what carry over to the next question.',
    set: tolcSamples,
  },
  updatedOn: '2026-11-02',
  sources: [
    { label: 'What is the TOLC: attempts, booking and fee', url: CISIA_TOLC_ABOUT, publisher: 'CISIA' },
    { label: 'Regolamento TOLC 2026 (PDF, in Italian)', url: CISIA_REGULATION_2026, publisher: 'CISIA' },
    { label: 'TOLC and CEnT test calendar', url: CISIA_CALENDAR, publisher: 'CISIA' },
    { label: 'CEnT: the English test that replaced the English TOLCs', url: CISIA_CENT_PAGE, publisher: 'CISIA' },
    { label: 'Practice area: exercises and simulations', url: CISIA_PRACTICE, publisher: 'CISIA' },
    { label: 'MOOCs for TOLC preparation', url: CISIA_MOOC, publisher: 'CISIA' },
  ],
};

const HUB_CONTENT: Readonly<Record<string, HubContent>> = {
  'politecnico-di-torino-til': polito,
  'cisia-tolc': cisia,
};

export function hubContent(slug: string): HubContent | undefined {
  return HUB_CONTENT[slug];
}

/**
 * When a hub page (and its format guide, which shows the same status) last
 * changed in substance: the verification of its exam facts or its own
 * content, whichever is later.
 */
export function hubUpdatedOn(slug: string, verifiedOn: string): string;
export function hubUpdatedOn(slug: string, verifiedOn: string | undefined): string | undefined;
export function hubUpdatedOn(slug: string, verifiedOn: string | undefined): string | undefined {
  const updated = HUB_CONTENT[slug]?.updatedOn;
  return [verifiedOn, updated].filter((d): d is string => Boolean(d)).sort().at(-1);
}

/** Every hub with content, for tests. */
export function listHubContent(): Array<[string, HubContent]> {
  return Object.entries(HUB_CONTENT);
}
