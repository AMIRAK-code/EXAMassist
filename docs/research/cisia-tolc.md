# CISIA TOLC-E, TOLC-F and TOLC-I — verified specification

**Version covered:** TOLC as delivered in 2026 (CISIA announces structural changes by 31 December each year)  
**Verified on:** 2026-09-29, first-hand: the structure tables were parsed directly from the HTML of CISIA's pages, and the regulation PDF was downloaded and its text extracted; no summary was relied on  
**Delivery:** TOLC@UNI (a university computer room) or TOLC@CASA (from home, in a proctored virtual room); each university states which it accepts [3, 1.4, 1.6].

## Sources

1. TOLC-E structure and syllabus — <https://www.cisiaonline.it/en/tolc/tolc-e/structure-and-syllabus>
2. TOLC-F structure and syllabus — <https://www.cisiaonline.it/en/tolc/tolc-f/structure-and-syllabus>
4. TOLC-I structure and syllabus — <https://www.cisiaonline.it/en/tolc/tolc-i/structure-and-syllabus> (checked through search results on 2026-10-11; see below)
3. Regolamento TOLC 2026 — <https://www.cisiaonline.it/sites/default/files/Regolamenti/Regolamento-TOLC-2026.pdf>

## Rules common to both — [3]

- **Answer format (1.2):** "I quesiti proposti all'interno dei TOLC sono a risposta multipla e presentano 5 possibili opzioni, di cui una sola è corretta."
- **Scoring (1.5):** 1 point correct, 0 unanswered, −0.25 wrong. The English section has no penalty (1 correct, 0 otherwise) and is scored separately.
- **No national pass mark (1.5):** "ogni sede aderente può trasformare il risultato del TOLC, mediante un proprio sistema di valutazione interno ed eventuali coefficienti per pesare i punteggi delle singole sezioni, e indicare una propria soglia minima di superamento."
- **Attempts (2):** each type of TOLC "non più di una volta al mese", in any mode and at any university.
- **Validity (1.6):** accepted by every university using the same TOLC in the same mode, at least for the year in which it was taken.
- **Conduct (4.1.5):** "Durante lo svolgimento del TOLC non può essere utilizzato alcuno strumento di calcolo o didattico o di supporto" — only a pen and the sheets handed out. Each section has a maximum duration; it may be closed early, forfeiting the rest of its time. At most a 10-minute pause, only between sections, only if the committee grants one.
- **Sections (1, 2):** "once the time is up, you must proceed to the next section … you will not be able to go back to the previous section."
- **Question banks (1.3):** the CISIA database is reserved and not public — "Solo per i TOLC-F i quesiti provengono da una banca dati pubblica ed accessibile da parte degli utenti." Our questions are original and are not drawn from it.

## TOLC-E — [1]

| # | Section | Questions | Minutes |
| --- | --- | --- | --- |
| 1 | Logic | 13 | 30 |
| 2 | Verbal comprehension | 10 | 30 |
| 3 | Mathematics | 13 | 30 |
| | **Total** | **36** | **90** |
| | English (separately scored) | 30 | 15 |
| | **Total including English** | **66** | **105** |

- **Logic and Verbal comprehension:** "seek to test in particular the candidate's aptitude rather than the skills acquired in secondary school. Therefore, they do not require any specific preparation." No topic list is published; the site's skill lists for these sections are editorial and say so.
- **Mathematics:** properties and operations on numbers; percentages; absolute value; powers, roots, exponentials and logarithms; polynomials; fractional rational expressions; first- and second-degree equations and inequalities and reducible ones; simple linear systems; fractional, rational, irrational, logarithmic and exponential equations and inequalities; symbolic mathematics; analytic geometry (lines, parabola, circumference, hyperbola, ellipse); plane and solid geometry; elementary functions, graphs and domains.
- **English:** score bands mapped to recommended courses (≤6 A1; 7–16 A2; 17–23 B1; 24–30 B1 exam without a course).

## TOLC-F — [2]

| # | Section | Questions | Minutes |
| --- | --- | --- | --- |
| 1 | Biology | 15 | 20 |
| 2 | Chemistry | 15 | 20 |
| 3 | Mathematics | 7 | 12 |
| 4 | Physics | 7 | 12 |
| 5 | Logic | 6 | 8 |
| | **Total** | **50** | **72** |
| | English (separately scored) | 30 | 15 |
| | **Total including English** | **80** | **87** |

Syllabus headings [2]:

- **Biology:** chemical composition of living organisms; biodiversity; cell biology; cell cycle, reproduction, heredity; bioenergetics; ecology; human anatomy; physiology.
- **Chemistry:** atomic structure and the periodic system; inorganic chemistry and compounds; reactions, stoichiometry, oxidation-reduction; solutions, acids and bases; organic chemistry.
- **Mathematics:** numerical sets; algebraic expressions; equations and inequalities; trigonometry; functions; plane, solid and analytic geometry; combinatorics, probability and statistics.
- **Physics:** measures; kinematics and dynamics; forces; fluid mechanics; thermology and thermodynamics; electrostatics, currents and magnetism; waves and geometric optics.
- **Logic:** logic of propositions; necessary and sufficient conditions; interpreting graphic representations and tables; elementary mathematical concepts.

## TOLC-I — [4]

**How this was checked:** on 2026-10-11 cisiaonline.it could not be reached from the build environment, so the page was not parsed first-hand. The table below is what search results quoting CISIA's TOLC-I pages state; they agree with one another. Treat it as provisional until the page is re-read directly (DISCREPANCY-REGISTER, CISIA-03).

| # | Section | Questions | Minutes |
| --- | --- | --- | --- |
| 1 | Mathematics | 20 | 50 |
| 2 | Logic | 10 | 20 |
| 3 | Sciences | 10 | 20 |
| 4 | Verbal comprehension | 10 | 20 |
| | **Total** | **50** | **110** |
| | English (separately scored) | 30 | 15 |
| | **Total including English** | **80** | **125** |

- **Logic and Verbal comprehension:** described by CISIA as testing aptitude rather than secondary-school knowledge. No topic list; the site's skills are editorial.
- **Mathematics (syllabus headings as reported):** arithmetic and algebra; geometry; analytic geometry and numerical functions; trigonometry; probability and statistics.
- **Sciences (syllabus headings as reported):** mechanics; thermodynamics; electromagnetism and optics; structure of matter, chemical symbols, stoichiometry, solutions, redox and elementary organic chemistry.
- The same regulation [3] applies: five options, +1 / 0 / −0.25, no calculator, no return to a closed section, no national pass mark. Thresholds often quoted for engineering (for example a minimum number of Mathematics points for OFA) are set by each university.

## Not published (unverified)

- Movement between questions, or changing answers, within an open section.
- Whether a negative absolute score is reported as such.

## What the build does with this

- Three (TOLC-E), five (TOLC-F) and four (TOLC-I) consecutive sections with their own clocks and no return to a closed section; within-section movement allowed and disclosed. Full simulations labelled **approximation**.
- The separately scored English section is **not modelled**, and every fidelity note says so.
- Readiness projects the absolute score on the published form and states that **each university sets its own threshold**, pointing the learner to their programme's bando.
