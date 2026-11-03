import type { HubContent } from './hub-content';
import {
  IMAT_REFORM_EXCLUSION,
  MUR_IMAT_ANNEXES_2026,
  MUR_IMAT_DECREE_2026,
  MUR_IMAT_PLACES_2026,
  MUR_IMAT_PLACES_UPDATE_2026,
  MUR_IMAT_SYLLABUS_2026,
  UNIVERSITALY,
} from './official-links';

/**
 * The IMAT hub in Italian: the same facts and plan as the English page
 * (src/lib/exams/hub-content-imat.ts), written for Italian readers, with the
 * decree's own Italian terms. Practice links keep the same addresses under
 * /it, so they open the same practice page in Italian.
 *
 * Written on 3 November 2026 with AI assistance. No fluent human reviewer has
 * read it yet, so the page carries the "awaiting review" note; remove the
 * note only when one has.
 */

export const imatIt: HubContent = {
  headline: 'IMAT: il test di ammissione a Medicina in inglese',
  metaTitle: 'IMAT 2026/27: struttura, punteggio, posti ed esercitazioni',
  metaDescription:
    'IMAT: 60 domande in 100 minuti, +1,5 / −0,4, 20 punti per entrare in graduatoria. Le regole 2026/27 del decreto MUR, cosa si sa del 2027/28 ed esercitazioni.',
  translationNote: {
    title: 'Traduzione in attesa di revisione',
    bodyMd:
      'Abbiamo scritto questa pagina in italiano partendo da quella inglese, con l’aiuto dell’intelligenza artificiale, e l’abbiamo confrontata con il decreto ministeriale, ma **nessun revisore madrelingua l’ha ancora riletta**. Se trovi un errore di lingua o di contenuto, [scrivici](/it/about/support). In caso di dubbio fanno fede il decreto del MUR e il bando del tuo ateneo.',
  },
  leadMd: `**L’IMAT è il test di ammissione ai corsi di laurea in lingua inglese in Medicina e chirurgia, Odontoiatria e protesi dentaria e Medicina veterinaria delle università italiane.** È un’unica prova su carta di 60 quesiti a cinque opzioni in 100 minuti, in inglese, stabilita dal Ministero dell’Università e della Ricerca (MUR) e gestita dal CINECA: 4 quesiti di competenze di lettura e conoscenze acquisite negli studi, 5 di ragionamento logico e problemi, 23 di biologia, 15 di chimica e 13 di fisica e matematica. Una risposta esatta vale 1,5 punti, una errata −0,4 e una non data 0, su un massimo di 90. I candidati comunitari, e quelli non comunitari residenti in Italia, devono ottenere almeno 20 punti per entrare in graduatoria; i posti si assegnano poi secondo la graduatoria nazionale.

La riforma del 2025, che ha sostituito il test d’ingresso con il *semestre filtro*, riguarda solo i corsi in lingua italiana. L’IMAT 2026/27 si è svolto il 29 settembre 2026; le regole per il 2027/28 non erano ancora state pubblicate al nostro ultimo controllo, il 3 novembre 2026.`,
  status: {
    heading: 'Ammissione 2027/28: cosa è confermato e cosa no',
    checkedOn: '2026-11-03',
    bodyMd: `**Confermato dal Ministero**

- I corsi in lingua inglese restano fuori dalla riforma del 2025: il decreto che ha introdotto il *semestre filtro* stabilisce che le sue disposizioni non si applicano ai corsi di studio erogati in lingua inglese ([D.Lgs. 71/2025, art. 8](${IMAT_REFORM_EXCLUSION})).
- Per il 2026/27 l’ammissione è avvenuta con l’IMAT secondo il [D.M. 1005 del 6 agosto 2026](${MUR_IMAT_DECREE_2026}), con struttura, punteggio e [programma](${MUR_IMAT_SYLLABUS_2026}) identici a quelli del 2025/26.
- Novità del 2026/27: all’iscrizione ogni candidato ha scelto Medicina e chirurgia con Odontoiatria **oppure** Medicina veterinaria, senza poter cambiare dopo la chiusura delle iscrizioni. Le graduatorie nazionali erano due, una per ciascuna scelta.
- La prova si è svolta il 29 settembre 2026 alle 13:30 (ora italiana), dopo le iscrizioni su [Universitaly](${UNIVERSITALY}) dal 26 agosto al 9 settembre.

**Non ancora pubblicato**

- Il decreto per il 2027/28: data, periodo di iscrizione, posti ed eventuali modifiche a struttura, punteggio o soglia di 20 punti. I decreti del 2025 e del 2026 sono stati firmati entrambi all’inizio di agosto, circa sette settimane prima della prova.
- Il contributo di iscrizione, che viene comunicato su Universitaly all’apertura delle iscrizioni.`,
  },
  routes: {
    heading: 'Quali corsi e quali atenei ammettono con l’IMAT',
    bodyMd: `Un’unica prova vale per tutti e tre i corsi ed è identica in tutte le sedi. Per il 2026/27 la [tabella dei posti](${MUR_IMAT_PLACES_2026}) del Ministero elencava:

- **Medicina e chirurgia:** 28 voci, a Bari, Bologna, Cagliari, Campania Vanvitelli (Napoli), Catania, Cattolica (Roma e Bolzano), Firenze, Humanitas (Pieve Emanuele, due voci), Messina, Milano, Milano-Bicocca (Bergamo), Napoli Federico II, Neuromed (Pozzilli), Padova (Padova MedTech e Venezia), Parma (Piacenza), Pavia, Politecnica delle Marche (Ancona), Roma La Sapienza, Roma Tor Vergata (Roma e Tirana), Torino (Orbassano), UniCamillus (Roma), San Raffaele (Milano) e Campus Bio-Medico (Roma, due corsi). In tutto 2.430 posti per i candidati comunitari e non comunitari residenti in Italia e 1.362 per i non comunitari residenti all’estero; il [D.M. 1472 del 30 ottobre 2026](${MUR_IMAT_PLACES_UPDATE_2026}) ne ha aggiunti 5 a Firenze, che secondo il nostro conteggio portano il totale a 1.367.
- **Odontoiatria e protesi dentaria:** Roma La Sapienza e Siena, 49 posti più 11 per i non comunitari residenti all’estero.
- **Medicina veterinaria:** Bologna (Ozzano dell’Emilia) e Napoli Federico II, 63 posti più 7.

Alcuni corsi erano ancora in fase di accreditamento, e i loro posti dipendevano dall’esito. Ai non comunitari residenti all’estero basta un punteggio superiore a 0, anziché 20, e concorrono solo per i posti dell’ateneo in cui hanno presentato la preiscrizione. Ogni ateneo pubblica il proprio bando prima della prova: leggi quello del tuo corso.`,
  },
  detailsNote: {
    title: 'Queste sono le regole del 2026/27',
    bodyMd: `I dettagli qui sotto vengono dal [D.M. 1005 del 6 agosto 2026](${MUR_IMAT_DECREE_2026}) e dai [suoi allegati](${MUR_IMAT_ANNEXES_2026}), per la prova del 29 settembre 2026. Finché non esce il decreto per il 2027/28 sono la guida migliore alla prossima prova, ma non una garanzia.`,
  },
  studyPlan: {
    id: 'study-plan',
    heading: 'Come prepararsi: un piano di otto settimane',
    bodyMd: `**Biologia e chimica valgono 38 quesiti su 60**, quindi è lì che va la maggior parte del tempo. La prova è in inglese: se hai studiato le scienze in italiano, impara i termini inglesi man mano. Le nostre domande di esercitazione si possono leggere anche in italiano mentre studi, ma la simulazione completa è sempre in inglese, come la prova vera. Nessun punteggio di esercitazione, nemmeno il nostro, può dirti il tuo risultato all’IMAT o la tua posizione in graduatoria.

1. **Settimane 1–3: biologia e chimica, senza limiti di tempo.** Segui il [programma](${MUR_IMAT_SYLLABUS_2026}) argomento per argomento ed esercitati man mano: [biologia](/it/practice/imat?domain=imat-biology) e [chimica](/it/practice/imat?domain=imat-chemistry). Annota perché hai sbagliato ogni domanda, non solo che l’hai sbagliata.
2. **Settimane 4–5: fisica, matematica e ragionamento.** Esercitati su [fisica e matematica](/it/practice/imat?domain=imat-physics-maths), [ragionamento logico](/it/practice/imat?domain=imat-logic) e [lettura e conoscenze generali](/it/practice/imat?domain=imat-reading-knowledge). Fai ogni calcolo a mano: la calcolatrice non è ammessa.
3. **Settimane 6–7: serie miste a tempo.** Il ritmo della prova è di 100 minuti per 60 quesiti, cioè circa 1 minuto e 40 secondi a quesito. Decidi ora come comportarti con le risposte incerte: tirare a indovinare tra cinque opzioni vale in media −0,02 punti, ma appena ne escludi una il tentativo vale +0,075, quindi rispondi ogni volta che riesci a scartare qualcosa.
4. **Settimana 8: simulazioni complete.** Due simulazioni da 60 quesiti in 100 minuti, ciascuna in un’unica seduta, a qualche giorno di distanza, con la stessa revisione dopo. I nostri [esempi svolti dell’IMAT](/guides/imat-sample-questions) (in inglese) mostrano come fare una buona revisione.

Se hai meno tempo, mantieni l’ordine e accorcia ogni fase: prima le materie più pesanti, poi il tempo, per ultima una simulazione completa.`,
  },
  updatedOn: '2026-11-03',
  sources: [
    { label: 'D.M. 1005 del 6 agosto 2026: IMAT 2026/27', url: MUR_IMAT_DECREE_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'D.M. 1005/2026, Allegati 1–3: svolgimento della prova, iscrizioni e graduatorie', url: MUR_IMAT_ANNEXES_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'D.M. 1005/2026, Allegato A: programma', url: MUR_IMAT_SYLLABUS_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'D.M. 1005/2026, Tabella B: posti', url: MUR_IMAT_PLACES_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'D.M. 1472 del 30 ottobre 2026: cinque posti in più a Firenze', url: MUR_IMAT_PLACES_UPDATE_2026, publisher: 'Ministero dell’Università e della Ricerca' },
    { label: 'D.Lgs. 71/2025, art. 8: la riforma non si applica ai corsi in lingua inglese', url: IMAT_REFORM_EXCLUSION, publisher: 'Normattiva' },
    { label: 'Universitaly: iscrizioni, punteggi e graduatorie', url: UNIVERSITALY, publisher: 'Ministero dell’Università e della Ricerca' },
  ],
};
