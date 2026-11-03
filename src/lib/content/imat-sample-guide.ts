import type { Guide } from './guides';

/**
 * IMAT sample questions: five original, worked questions, one per area of
 * the test, with the 2026/27 rules read first-hand from the MUR decree
 * (D.M. 6 agosto 2026, n. 1005, art. 2 and 3) on 3 November 2026.
 *
 * The IMAT hub (/exams/imat) and practice opened on 3 November 2026, when the
 * configuration was verified against the same decree (docs/research/imat.md).
 * These questions are kept out of the question bank, like every published
 * sample, so reading them spoils no practice session.
 */

const MUR_DECREE_2026 = 'https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-1005-del-06-08-2026';
const MUR_CORRECTION_2026 = 'https://www.mur.gov.it/sites/default/files/2026-08/Avviso%20del%2026-8-2026.pdf';
const UNIVERSITALY = 'https://www.universitaly.it/';

export const imatSampleGuide: Guide = {
  slug: 'imat-sample-questions',
  metaTitle: 'IMAT sample questions with worked answers',
  title: 'IMAT sample questions: one per subject, with worked answers',
  answer:
    'The IMAT is the admission test for the English-taught degrees in Medicine and Surgery, Dentistry and Veterinary Medicine at Italian public universities: 60 questions with five options in 100 minutes, scored +1.5 for a right answer, −0.4 for a wrong one and 0 for a blank. Below are five original practice questions, one from each area, each with the working and the reason every wrong option is wrong. The 2026/27 test was held on 29 September 2026; the rules for 2027/28 have not been published yet.',
  description:
    'Five original IMAT-style questions, one per area, with worked answers, and the 2026/27 rules from the MUR decree: 60 questions, 100 minutes, +1.5 / −0.4.',
  examKeys: ['imat'],
  hubSlug: 'imat',
  publishedOn: '2026-11-03',
  updatedOn: '2026-11-03',
  readingMinutes: 9,
  sources: [
    { label: 'D.M. 6 agosto 2026, n. 1005: IMAT 2026/27, structure, scoring, threshold and places', url: MUR_DECREE_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'Avviso di rettifica, 26 August 2026 (adds Florence as a test venue)', url: MUR_CORRECTION_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'Universitaly: registration, scores and rankings', url: UNIVERSITALY, publisher: 'Ministero dell’Università e della Ricerca' },
  ],
  bodyMd: `## The IMAT in 2026/27

These are the rules of the ministerial decree for 2026/27 ([D.M. 1005 of 6 August 2026](${MUR_DECREE_2026})). The 2027/28 decree is usually published in the summer; until it is, treat them as the latest rules, not next year's.

- **60 questions, five options each, one correct, in 100 minutes** (art. 2): 4 on reading skills and knowledge acquired in studies, 5 on logical reasoning and problems, 23 on biology, 15 on chemistry and 13 on physics and mathematics.
- **Scoring** (art. 3.4): +1.5 for a right answer, −0.4 for a wrong one, 0 for a blank; 90 points at most.
- **Threshold** (art. 3.2–3.3): EU candidates and non-EU candidates resident in Italy need at least 20 points to be ranked. Non-EU candidates resident abroad need a score above 0, on their own reserved places.
- **One test for all three degrees** (art. 2.1), the same in every venue, on paper and in English. In 2026 it was held on 29 September, with registration on [Universitaly](${UNIVERSITALY}); at registration each candidate chose Medicine and Dentistry or Veterinary Medicine, which have separate national rankings.
- The 2025 reform that replaced the entrance test with a "semestre filtro" concerns the Italian-taught degrees; the English-taught ones still admit by the IMAT.

## Guessing, with these numbers

With five options, a blind guess is worth $\\tfrac15 \\times 1.5 - \\tfrac45 \\times 0.4 = 0.30 - 0.32 = -0.02$ points on average: slightly worse than a blank. Once you can rule out one option it is worth $\\tfrac14 \\times 1.5 - \\tfrac34 \\times 0.4 = +0.075$, and more with each option you remove. So leave a question blank only when you cannot eliminate anything.

## What UniExamer offers for the IMAT

These worked examples are free to read. The [IMAT page](/exams/imat) has the full 2026/27 rules, the places by university and a study plan, and IMAT practice: sets by subject and topic, a diagnostic and a 60-question simulation in 100 minutes. Practice questions can also be shown in Italian while you study; the simulation is always in English, like the real test. Nothing here predicts an IMAT score. The questions are original, not past IMAT questions.`,
  samples: {
    sections: [
      {
        id: 'reading-skills',
        heading: 'Reading skills and knowledge acquired in studies',
        introMd: 'Four of the 60 questions. Read for what the passage supports, not for what you already believe about the topic.',
        questions: [
          {
            id: 'imat-sample-microplastics',
            title: 'What a passage supports about a rising figure',
            topic: 'Reading skills: inference from a passage',
            stimulusMd:
              'Studies that report microplastics in bottled water have found far higher counts than earlier studies, but much of the difference comes from the methods used. Older studies counted only particles larger than a twentieth of a millimetre, because smaller ones could not be identified reliably; newer techniques detect particles a thousand times smaller, and most of the particles they find are in that smaller range. Comparing the two sets of figures as if they measured the same thing therefore exaggerates how much contamination has increased. Whether particles of that size harm human health is not yet known.',
            stemMd: 'Which of the following is supported by the passage?',
            options: [
              { id: 'A', text: 'Bottled water contains more microplastics today than when the first studies were made.', note: 'The passage says the counts differ largely because of the methods; it does not establish that contamination itself has risen.' },
              { id: 'B', text: 'Part of the rise in reported microplastic counts reflects the ability to detect smaller particles.', note: '' },
              { id: 'C', text: 'The smallest particles found are known to be harmless.', note: 'The passage says the opposite of “known”: their effect on health is not yet known.' },
              { id: 'D', text: 'Older studies counted particles that were not plastic.', note: 'Nothing is said about misidentified particles; older studies simply could not identify the smallest ones.' },
              { id: 'E', text: 'Newer techniques cannot detect particles larger than a twentieth of a millimetre.', note: 'The passage says newer techniques reach much smaller particles, not that they miss larger ones.' },
            ],
            answer: 'B',
            workingMd:
              'The passage says much of the difference between older and newer counts “comes from the methods used”, because newer techniques detect far smaller particles, where most of the particles are. That is option B. A goes further than the passage, which says comparing the figures “exaggerates” the increase without saying whether there was one. C contradicts the last sentence; D and E state things the passage never mentions.',
            lesson: 'Choose the option the text makes true, not the one that sounds most plausible. Words like “known”, “today” and “cannot” are where options overreach.',
          },
        ],
      },
      {
        id: 'logical-reasoning',
        heading: 'Logical reasoning and problems',
        introMd: 'Five questions. Many are short puzzles where the trap is the starting point of a count.',
        questions: [
          {
            id: 'imat-sample-weekday',
            title: 'Counting days from the right starting point',
            topic: 'Logical reasoning: sequences and counting',
            stemMd: 'If the day after tomorrow is a Saturday, what day of the week was it three days before yesterday?',
            options: [
              { id: 'A', text: 'Saturday', note: 'Treats “the day after tomorrow” as three days ahead: today would be Wednesday, yesterday Tuesday, and three days before that Saturday.' },
              { id: 'B', text: 'Sunday', note: '' },
              { id: 'C', text: 'Monday', note: 'Counts three days back from today, Thursday, instead of from yesterday.' },
              { id: 'D', text: 'Wednesday', note: 'Wednesday is yesterday, the day to count back from, not the answer.' },
              { id: 'E', text: 'Thursday', note: 'Thursday is today, where the count starts, not where it ends.' },
            ],
            answer: 'B',
            workingMd:
              'The day after tomorrow is two days ahead, so today is Saturday minus two days: Thursday. Yesterday was Wednesday, and three days before Wednesday is Sunday.',
            lesson: 'Fix “today” first, then move one step at a time and write each day down; most errors in these questions are off by one.',
          },
        ],
      },
      {
        id: 'biology',
        heading: 'Biology',
        introMd: 'The largest area: 23 questions, about 38% of the test.',
        questions: [
          {
            id: 'imat-sample-mitosis-anaphase',
            title: 'When sister chromatids separate',
            topic: 'Biology: cell division',
            stemMd: 'During which stage of mitosis do sister chromatids separate and move towards opposite poles of the cell?',
            options: [
              { id: 'A', text: 'Prophase', note: 'In prophase the chromosomes condense and the spindle begins to form; the chromatids are still joined.' },
              { id: 'B', text: 'Metaphase', note: 'In metaphase the chromosomes line up at the equator of the cell, still as pairs of joined chromatids.' },
              { id: 'C', text: 'Anaphase', note: '' },
              { id: 'D', text: 'Telophase', note: 'By telophase the separated chromatids have already reached the poles, and nuclear envelopes re-form around them.' },
              { id: 'E', text: 'Cytokinesis', note: 'Cytokinesis divides the cytoplasm after the nuclei have separated; it is not a stage of mitosis in which chromatids move.' },
            ],
            answer: 'C',
            workingMd:
              'In anaphase the cohesin holding each pair of sister chromatids together is cut, and the spindle fibres pull the chromatids, now separate chromosomes, to opposite poles. The order is prophase, metaphase, anaphase, telophase, followed by cytokinesis.',
            lesson: 'Tie each stage to one event: condense (prophase), line up (metaphase), pull apart (anaphase), re-form nuclei (telophase).',
          },
        ],
      },
      {
        id: 'chemistry',
        heading: 'Chemistry',
        introMd: 'Fifteen questions, without a calculator: the numbers are chosen to work by hand.',
        questions: [
          {
            id: 'imat-sample-water-molecules',
            title: 'From grams to molecules',
            topic: 'Chemistry: the mole',
            stemMd: 'How many molecules are there in 9 g of water, $\\mathrm{H_2O}$? (Relative atomic masses: H = 1, O = 16; Avogadro constant $6.02 \\times 10^{23}\\ \\mathrm{mol^{-1}}$.)',
            options: [
              { id: 'A', text: '$3.01 \\times 10^{22}$', note: 'The right digits with the power of ten one too low: $0.5 \\times 6.02 \\times 10^{23}$ is $3.01 \\times 10^{23}$.' },
              { id: 'B', text: '$3.01 \\times 10^{23}$', note: '' },
              { id: 'C', text: '$6.02 \\times 10^{23}$', note: 'One mole of molecules. 9 g of water is half a mole.' },
              { id: 'D', text: '$5.42 \\times 10^{24}$', note: 'Multiplies the mass in grams by the Avogadro constant, as if 9 g were 9 moles.' },
              { id: 'E', text: '$1.08 \\times 10^{25}$', note: 'Multiplies the molar mass, 18, by the Avogadro constant: that is neither the mass given nor the number of moles.' },
            ],
            answer: 'B',
            workingMd:
              'The molar mass of water is $2 \\times 1 + 16 = 18$ g/mol, so 9 g is $9 / 18 = 0.5$ mol. The number of molecules is $0.5 \\times 6.02 \\times 10^{23} = 3.01 \\times 10^{23}$.',
            lesson: 'Grams to moles first (divide by the molar mass), then moles to particles (multiply by the Avogadro constant). Check the power of ten last.',
          },
        ],
      },
      {
        id: 'physics-and-mathematics',
        heading: 'Physics and mathematics',
        introMd: 'Thirteen questions. Many go wrong on units, not on the physics.',
        questions: [
          {
            id: 'imat-sample-hair-dryer',
            title: 'Energy from power and time',
            topic: 'Physics: energy and power',
            stemMd: 'A hair dryer with a power of 1.5 kW is used for 4 minutes. How much electrical energy does it use?',
            options: [
              { id: 'A', text: '6 J', note: 'Multiplies 1.5 by 4 without converting either unit.' },
              { id: 'B', text: '6 kJ', note: 'Converts the power to 1500 W but leaves the time in minutes: $1500 \\times 4$.' },
              { id: 'C', text: '90 kJ', note: 'Uses one minute (60 s) instead of four: $1500 \\times 60$.' },
              { id: 'D', text: '360 kJ', note: '' },
              { id: 'E', text: '5.4 MJ', note: 'Uses the 3600 seconds of an hour instead of the 240 seconds of four minutes.' },
            ],
            answer: 'D',
            workingMd:
              'Energy = power × time, in watts and seconds: $E = 1500\\ \\mathrm{W} \\times 240\\ \\mathrm{s} = 360\\,000\\ \\mathrm{J} = 360\\ \\mathrm{kJ}$. (The same in kilowatt-hours: $1.5 \\times \\tfrac{4}{60} = 0.1$ kWh, and 1 kWh is 3.6 MJ.)',
            lesson: 'Convert to SI units before multiplying: kilowatts to watts, minutes to seconds.',
          },
        ],
      },
    ],
    afterMd: `## About these examples

Written by the UniExamer team for this page with AI assistance, and published on 3 November 2026. They are not IMAT questions, their difficulty is not calibrated to the real test, and five questions cannot estimate a score. They are not part of any practice session, so reading the answers spoils nothing. If you find a mistake, [tell us](/about/support).

For the official rules, places and dates, read the ministry's decree for your year and the [Universitaly](${UNIVERSITALY}) portal, where registration opens.`,
  },
};
