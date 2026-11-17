import { md, type Course } from '../../../types';
import { imatUnitsIt } from './units';

/**
 * Il corso IMAT in italiano: la versione italiana di ../index.ts, con gli
 * stessi slug, gli stessi minuti e gli stessi collegamenti all'esercitazione.
 * Le fonti sono quelle del corso inglese (atti ufficiali in italiano).
 */
export const imatCourseIt: Course = {
  slug: 'imat',
  title: 'Corso per il test IMAT di Medicina',
  shortTitle: 'Corso IMAT',
  metaTitle: 'Corso IMAT gratuito e interattivo, in italiano',
  description: 'Prepara ogni area dell’IMAT, da biologia e chimica a fisica, matematica e logica, con esempi svolti, verifiche con correzione immediata e flashcard.',
  examKeys: ['imat'],
  hubSlug: 'imat',
  examPublisher: 'MUR e CINECA',
  lang: 'it',
  interactive: true,
  introMd: md`
L’IMAT è il test di ammissione ai corsi di laurea in lingua inglese in Medicina e Chirurgia, Odontoiatria e Medicina Veterinaria delle università italiane. Per il 2026/27 è stato un’unica prova su carta di 60 domande in 100 minuti, in inglese: competenze di lettura e conoscenze acquisite negli studi 4, ragionamento logico e problemi 5, biologia 23, chimica 15, fisica e matematica 13. Ogni domanda ha cinque opzioni e una sola risposta corretta. Una risposta esatta vale 1,5 punti, una omessa 0 e una errata −0,4, per un massimo di 90. I candidati UE, e i candidati non UE residenti in Italia, devono ottenere almeno 20 punti per entrare nella graduatoria nazionale; l’ammissione dipende poi dalla posizione in graduatoria rispetto ai posti di ciascuna università. Non è ammessa la calcolatrice. Le regole per il 2027/28 non erano ancora state pubblicate quando è stato scritto questo corso: controlla il nuovo decreto quando uscirà.

Il corso segue il programma ufficiale area per area, con più lezioni dove ci sono più domande. Ogni lezione è interattiva: prova ogni esempio svolto prima di scoprire il passaggio successivo, rispondi alle domande di verifica per sapere subito se hai ragione e perché ogni opzione sbagliata è sbagliata, poi fissa i concetti con il mazzo di flashcard. Segna una lezione come completata e la pagina del corso terrà traccia dei tuoi progressi in questo browser.

Il test si svolge solo in inglese: per questo le lezioni in italiano riportano accanto ai termini italiani quelli inglesi che troverai nella prova. Ogni lezione esiste anche in inglese. Tutti gli esempi e le domande sono originali e scritti per questo corso.
`,
  publishedOn: '2026-11-16',
  updatedOn: '2026-11-16',
  sources: [
    {
      label: 'D.M. 6 agosto 2026, n. 1005: IMAT 2026/27 (struttura, data, punteggio, soglia, graduatorie)',
      publisher: 'Ministero dell’Università e della Ricerca',
      url: 'https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-1005-del-06-08-2026',
    },
    {
      label: 'D.M. 1005/2026, Allegati 1–3: svolgimento della prova, iscrizione e graduatorie',
      publisher: 'Ministero dell’Università e della Ricerca',
      url: 'https://www.mur.gov.it/sites/default/files/2026-08/Decreto%20Ministeriale%20n.%201005%20Allegati%201_2_3.pdf',
    },
    {
      label: 'D.M. 1005/2026, Allegato A: programmi',
      publisher: 'Ministero dell’Università e della Ricerca',
      url: 'https://www.mur.gov.it/sites/default/files/2026-08/Decreto%20Ministeriale%20n.%201005%20Allegato%20A.pdf',
    },
    { label: 'Universitaly: iscrizione, punteggi e graduatorie', publisher: 'Ministero dell’Università e della Ricerca', url: 'https://www.universitaly.it/' },
  ],
  units: imatUnitsIt,
  mindMap: {
    centre: 'IMAT',
    centreNote: '60 domande · 100 minuti',
    branchNotes: {
      'getting-started': 'Struttura, punteggio e tempi',
      'reading-and-knowledge': '4 domande',
      logic: '5 domande',
      biology: '23 domande',
      chemistry: '15 domande',
      physics: 'Parte delle 13 domande di fisica e matematica',
      mathematics: 'Parte delle 13 domande di fisica e matematica',
    },
  },
};
