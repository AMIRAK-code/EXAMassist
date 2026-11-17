import { md, type Lesson } from '../../../types';

export const howTheImatWorksLessonIt: Lesson = {
  slug: 'how-the-imat-works',
  title: 'Come funziona l’IMAT',
  summary: 'L’IMAT in una pagina: 60 domande in 100 minuti su carta, dove stanno i 90 punti, cosa significa la soglia di 20 punti e come funzionano le graduatorie.',
  minutes: 15,
  objectives: [
    'Descrivere il formato dell’IMAT 2026/27: domande, opzioni, tempo, lingua e materiali.',
    'Calcolare quanti punti può dare ciascuna area sul massimo di 90.',
    'Spiegare la differenza tra la soglia di 20 punti, le graduatorie nazionali e l’assegnazione di un posto.',
  ],
  teachMd: md`
### Un’unica prova per tre corsi di laurea

L’IMAT è la prova di ammissione ai corsi di laurea in lingua inglese in Medicina e Chirurgia, Odontoiatria e Protesi Dentaria e Medicina Veterinaria delle università italiane. Il Ministero dell’Università e della Ricerca (MUR) ne fissa le regole ogni anno con un decreto; il CINECA scrive i quesiti, prepara la prova e calcola i punteggi. La prova è una sola per i tre corsi ed è identica in tutte le sedi, in Italia e all’estero. La riforma del 2025, che ha sostituito il test d’ingresso con il *semestre filtro*, non si applica ai corsi in lingua inglese: l’IMAT resta quindi una prova unica, svolta in un solo giorno.

Tutto ciò che leggi in questa lezione descrive la prova 2026/27, svolta il 29 settembre 2026 secondo il D.M. 1005 del 6 agosto 2026. Per il 2027/28 non è stato ancora pubblicato nulla. Gli ultimi due decreti sono stati firmati entrambi all’inizio di agosto: quando uscirà il prossimo, controlla formato, punteggio, soglia e data prima di fidarti di qualsiasi numero riportato qui.

### Sessanta domande, cinque opzioni, cento minuti

La prova ha 60 quesiti. Ognuno ha cinque opzioni, e se ne sceglie una sola. Hai 100 minuti per l’intera prova, e tutti i quesiti sono formulati in inglese, compreso il linguaggio simbolico. Le domande si dividono in cinque aree:

| Area | Quesiti | Punti massimi |
| --- | --- | --- |
| Competenze di lettura e conoscenze acquisite negli studi (*Reading skills and knowledge acquired in studies*) | 4 | 6 |
| Ragionamento logico e problemi (*Logical reasoning and problems*) | 5 | 7,5 |
| Biologia (*Biology*) | 23 | 34,5 |
| Chimica (*Chemistry*) | 15 | 22,5 |
| Fisica e matematica (*Physics and mathematics*) | 13 | 19,5 |
| **Totale** | **60** | **90** |

L’ultima colonna è semplicemente il numero di quesiti moltiplicato per 1,5, il punteggio di una risposta esatta. Leggila come un piano di studio: biologia, chimica e fisica-matematica insieme contano 51 quesiti su 60, cioè $51 \times 1{,}5 = 76{,}5$ punti su 90, l’$85\%$. Le due aree non scientifiche sono piccole, ma i loro 9 quesiti valgono comunque $9 \times 1{,}5 = 13{,}5$ punti: conviene assicurarsele, non trascurarle.

### Su carta, senza calcolatrice

La prova si svolge in presenza. Ricevi un fascicolo con i quesiti e un modulo risposte, e segni ogni risposta con una X usando la penna nera consegnata in sede. Puoi correggere una risposta una sola volta per quesito, e una domanda che decidi di lasciare in bianco va segnata come tale. Sono vietati telefoni, tablet, smartwatch e strumenti simili, manuali, appunti e qualsiasi penna o matita personale.

Le regole non nominano le calcolatrici, ma niente le consente, e si scrive solo con ciò che fornisce la sede. Preparati come se ogni calcolo andasse fatto a mano: è così che sono svolti tutti gli esempi di questo corso.

Il decreto non divide i 100 minuti tra le aree e non fissa un ordine. Con un unico fascicolo davanti puoi spostarti liberamente tra le domande. Questo discende dal formato cartaceo, non da una regola scritta, ma significa che l’ordine in cui lavori lo decidi tu.

### Come si forma il punteggio

Una risposta esatta vale $+1{,}5$, una risposta omessa $0$ e una risposta errata $-0{,}4$. Il punteggio è la somma sui 60 quesiti, quindi il massimo è $60 \times 1{,}5 = 90$. Non esiste un punteggio scalato: il numero che ricevi è questo totale grezzo, con le penalità già sottratte. La prossima lezione calcola quando la penalità rende conveniente tirare a indovinare e come distribuire i 100 minuti.

### Soglia, graduatorie e posti

Il punteggio svolge due compiti distinti.

**Decide se puoi entrare in graduatoria.** I candidati UE, e i candidati non UE residenti in Italia, devono ottenere almeno 20 punti per essere collocati in graduatoria. I candidati non UE residenti all’estero devono solo superare 0 punti, e concorrono per i posti a loro riservati nella graduatoria dell’università presso cui si sono preimmatricolati.

**Decide la tua posizione.** Le graduatorie nazionali sono due: una per Medicina e Chirurgia insieme a Odontoiatria, una per Medicina Veterinaria. Nel 2026/27 se ne sceglie una al momento dell’iscrizione, su Universitaly, e la scelta diventa irrevocabile alla chiusura delle iscrizioni. Il posto dipende da dove ti collochi nella tua graduatoria rispetto ai posti disponibili in ciascuna università: 20 punti sono un biglietto d’ingresso alla graduatoria, non una sufficienza per l’ammissione.

A parità di punteggio totale si guarda, nell’ordine: il punteggio più alto in biologia, poi in chimica, poi in fisica e matematica, poi in ragionamento logico, poi in lettura e conoscenze. Seguono una certificazione di inglese riconosciuta, poi una disabilità pari almeno al 66%, e infine la minore età.

### Che cosa copre il programma

Il programma (*syllabus*) è diviso in: competenze di lettura e conoscenze generali (comprensione di testi in inglese; storia, istituzioni e cittadinanza), ragionamento logico e problemi, biologia, chimica, matematica (algebra, funzioni, geometria e trigonometria, probabilità e statistica) e fisica (unità di misura e vettori, cinematica, dinamica, fluidi, termodinamica, elettricità e magnetismo). Le unità di questo corso seguono le stesse voci, e ogni lezione si chiude con un collegamento alle esercitazioni dell’area corrispondente.
`,
  examples: [
    {
      id: 'example-points-by-area',
      title: 'Dove stanno i 90 punti',
      problemMd: md`Un candidato pensa di dedicare gran parte dello studio alla chimica. Quale quota del punteggio massimo possono dare i quesiti di chimica, e come si confronta con la biologia?`,
      steps: [
        md`Ogni risposta esatta vale $1{,}5$ punti, quindi il massimo in chimica è $15 \times 1{,}5 = 22{,}5$ punti.`,
        md`Come quota del massimo: $\frac{22{,}5}{90} = 0{,}25$, cioè il $25\%$. Per un’altra via si ottiene lo stesso valore: la chimica è $\frac{15}{60} = \frac{1}{4}$ dei quesiti, e ogni quesito pesa allo stesso modo.`,
        md`Biologia: $23 \times 1{,}5 = 34{,}5$ punti, e $\frac{23}{60} \approx 0{,}383$, circa il $38\%$ del massimo.`,
      ],
      answerMd: md`La chimica può dare 22,5 punti, un quarto dei 90; la biologia 34,5 punti, circa il $38\%$. Poiché ogni quesito vale lo stesso, la quota di punti coincide sempre con la quota di quesiti.`,
    },
    {
      id: 'example-threshold',
      title: 'Leggere un punteggio rispetto alla soglia',
      problemMd: md`Due candidati UE terminano la prova. Il candidato P ha 20 risposte esatte, 15 errate e 25 omesse. Il candidato Q ha 16 esatte, 11 errate e 33 omesse. Possono entrare in graduatoria?`,
      steps: [
        md`Per prima cosa controlla i conteggi: $20 + 15 + 25 = 60$ e $16 + 11 + 33 = 60$.`,
        md`P: $20 \times 1{,}5 - 15 \times 0{,}4 = 30 - 6 = 24$ punti.`,
        md`Q: $16 \times 1{,}5 - 11 \times 0{,}4 = 24 - 4{,}4 = 19{,}6$ punti.`,
        md`Per i candidati UE la soglia è di almeno 20 punti. P, con 24, entra in graduatoria; Q, con 19,6, no.`,
      ],
      answerMd: md`P (24 punti) entra in graduatoria; Q (19,6 punti) no. Se Q fosse un candidato non UE residente all’estero, 19,6 basterebbe per entrare nella graduatoria della sua università, dove serve solo un punteggio superiore a 0. Entrare in graduatoria non garantisce un posto a nessuno dei due.`,
    },
    {
      id: 'example-tie-break',
      title: 'Risolvere una parità',
      problemMd: md`I candidati R e S ottengono entrambi 61 punti nella graduatoria di Medicina e Odontoiatria. In biologia R ha 18 esatte, 2 errate e 3 omesse; S ha 18 esatte, 1 errata e 4 omesse. Chi si colloca più in alto?`,
      steps: [
        md`Il primo criterio di parità è il punteggio di biologia, quindi calcolalo per entrambi. I conteggi danno 23 in tutti e due i casi, il numero di quesiti di biologia.`,
        md`R: $18 \times 1{,}5 - 2 \times 0{,}4 = 27 - 0{,}8 = 26{,}2$.`,
        md`S: $18 \times 1{,}5 - 1 \times 0{,}4 = 27 - 0{,}4 = 26{,}6$.`,
      ],
      answerMd: md`S si colloca sopra R, perché il suo punteggio di biologia è più alto (26,6 contro 26,2). Contando solo le risposte esatte sembrerebbe una parità, perché entrambi ne hanno 18; è la penalità per la risposta errata in più a separarli.`,
    },
  ],
  traps: [
    {
      title: 'Scambiare 20 punti per la sufficienza',
      md: md`La soglia di 20 punti fa solo entrare in graduatoria i candidati UE e i non UE residenti in Italia. I posti si ottengono con la posizione in graduatoria rispetto ai posti di ciascuna università. Punta al punteggio più alto che puoi raggiungere, non a 20.`,
    },
    {
      title: 'Dare per scontato che l’anno prossimo sia uguale',
      md: md`Ogni numero di questa lezione viene dal decreto 2026/27. Per il 2027/28 non è stato pubblicato nulla. Il formato 2026/27 ha ripetuto quello del 2025/26, ma l’unica abitudine sicura è leggere il nuovo decreto quando esce e controllare formato, punteggio, soglia e data.`,
    },
    {
      title: 'Esercitarsi con la calcolatrice',
      md: md`Niente nelle regole consente la calcolatrice, e si usa solo la penna della sede. Chi si esercita sempre con la calcolatrice affronta il calcolo a mano per la prima volta sotto pressione. Fai tutte le esercitazioni a mano fin dall’inizio.`,
    },
    {
      title: 'Dimenticare che la scelta della graduatoria è definitiva',
      md: md`Nel 2026/27 il candidato sceglieva Medicina e Odontoiatria oppure Medicina Veterinaria al momento dell’iscrizione, e la scelta diventava irrevocabile alla chiusura delle iscrizioni. Decidi quale graduatoria vuoi prima che le iscrizioni si chiudano.`,
    },
  ],
  check: [
    {
      id: 'check-biology-chemistry-count',
      title: 'Contare i quesiti',
      topic: 'Formato della prova',
      stemMd: md`Quanti dei 60 quesiti dell’IMAT sono di biologia e chimica insieme?`,
      options: [
        { id: 'A', text: md`15`, note: md`È il solo numero dei quesiti di chimica; mancano quelli di biologia.` },
        { id: 'B', text: md`23`, note: md`È il solo numero dei quesiti di biologia; mancano quelli di chimica.` },
        { id: 'C', text: md`28`, note: md`Somma chimica (15) e fisica e matematica (13), non biologia e chimica.` },
        { id: 'D', text: md`38`, note: '' },
        { id: 'E', text: md`51`, note: md`Sono tutte e tre le aree scientifiche, compresi i 13 quesiti di fisica e matematica.` },
      ],
      answer: 'D',
      workingMd: md`Biologia ha 23 quesiti e chimica 15, quindi insieme $23 + 15 = 38$. Per verifica, le altre tre aree ne hanno $4 + 5 + 13 = 22$, e $38 + 22 = 60$.`,
      lesson: 'Impara i numeri delle cinque aree (4, 5, 23, 15, 13): quasi ogni domanda di pianificazione parte da lì.',
    },
    {
      id: 'check-physics-maths-points',
      title: 'Punti in fisica e matematica',
      topic: 'Punteggio',
      stemMd: md`Qual è il massimo numero di punti che un candidato può ottenere dai soli quesiti di fisica e matematica?`,
      options: [
        { id: 'A', text: md`13`, note: md`È il numero di quesiti; ogni risposta esatta vale 1,5 punti, non 1.` },
        { id: 'B', text: md`15`, note: md`È il numero dei quesiti di chimica, non un totale di punti per fisica e matematica.` },
        { id: 'C', text: md`19,5`, note: '' },
        { id: 'D', text: md`20`, note: md`È la soglia per la graduatoria dei candidati UE, non il massimo di un’area.` },
        { id: 'E', text: md`22,5`, note: md`È il massimo di chimica, $15 \times 1{,}5$.` },
      ],
      answer: 'C',
      workingMd: md`Fisica e matematica ha 13 quesiti, ciascuno da $1{,}5$ punti se esatto: $13 \times 1{,}5 = 19{,}5$. Verifica: $\frac{13}{60}$ di 90 è $\frac{13 \times 90}{60} = \frac{1170}{60} = 19{,}5$.`,
      lesson: 'Il massimo di un’area è il suo numero di quesiti per 1,5, e i cinque massimi sommati danno 90.',
    },
    {
      id: 'check-threshold-meaning',
      title: 'Che cosa significano 24 punti',
      topic: 'Soglia e graduatorie',
      stemMd: md`Un candidato UE che ha scelto la graduatoria di Medicina e Odontoiatria ottiene 24 punti. Quale affermazione è corretta secondo le regole 2026/27?`,
      options: [
        { id: 'A', text: md`Il candidato ha un posto garantito, perché 24 supera la soglia.`, note: md`La soglia dà solo accesso alla graduatoria; il posto dipende dalla posizione del candidato rispetto ai posti disponibili.` },
        { id: 'B', text: md`Il candidato può essere collocato nella graduatoria nazionale che ha scelto; se ottiene un posto dipende dalla sua posizione.`, note: '' },
        { id: 'C', text: md`Il candidato non può entrare in graduatoria, perché ai candidati UE servono almeno 30 punti.`, note: md`La soglia per i candidati UE è di 20 punti, non di 30.` },
        { id: 'D', text: md`Il candidato compare sia nella graduatoria di Medicina e Odontoiatria sia in quella di Medicina Veterinaria.`, note: md`Nel 2026/27 ogni candidato sceglieva una delle due graduatorie all’iscrizione, e la scelta diventava irrevocabile.` },
        { id: 'E', text: md`Il punteggio viene prima convertito in un punteggio scalato, e la soglia si applica a quello.`, note: md`Non esiste un punteggio scalato; la soglia si applica al totale grezzo, con le penalità sottratte.` },
      ],
      answer: 'B',
      workingMd: md`Ai candidati UE servono almeno 20 punti per entrare in graduatoria, e 24 è sopra la soglia: il candidato entra quindi nella graduatoria di Medicina e Odontoiatria che ha scelto. L’ammissione dipende poi dalla sua posizione in quella graduatoria rispetto ai posti di ciascuna università, cosa che il solo punteggio non può dire.`,
      lesson: 'La soglia decide chi entra in graduatoria; la graduatoria decide chi viene ammesso.',
    },
  ],
  takeaways: [
    'IMAT 2026/27: 60 quesiti a cinque opzioni in 100 minuti, in inglese, su carta, senza calcolatrice.',
    'Le aree contano 4, 5, 23, 15 e 13 quesiti; le tre aree scientifiche valgono 76,5 dei 90 punti.',
    'Punteggio: +1,5 per l’esatta, 0 per l’omessa, −0,4 per l’errata, con un massimo di 90.',
    'Venti punti fanno entrare in graduatoria i candidati UE e i non UE residenti in Italia; il posto dipende dalla graduatoria rispetto ai posti.',
    'Per il 2027/28 non è ancora pubblicato nulla: controlla ogni numero sul nuovo decreto.',
  ],
  flashcards: [
    { front: 'Formato dell’IMAT (2026/27)', back: '60 quesiti a cinque opzioni con una sola risposta esatta, in 100 minuti, in inglese, su carta.' },
    { front: 'Quesiti per area', back: 'Lettura e conoscenze 4, ragionamento logico e problemi 5, biologia 23, chimica 15, fisica e matematica 13.' },
    { front: 'Punti per risposta', back: 'Esatta +1,5, omessa 0, errata −0,4. Il massimo è 90.' },
    { front: 'La soglia di 20 punti', back: 'I candidati UE, e i non UE residenti in Italia, devono ottenere almeno 20 punti per entrare in graduatoria. Ai non UE residenti all’estero basta un punteggio superiore a 0.' },
    { front: 'Le due graduatorie nazionali', back: 'Una per Medicina e Chirurgia con Odontoiatria, una per Medicina Veterinaria. Nel 2026/27 se ne sceglieva una all’iscrizione.' },
    { front: 'Primo criterio di parità', back: 'Il punteggio più alto in biologia, poi chimica, fisica e matematica, ragionamento logico, e lettura e conoscenze.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const scoringGuessingAndPacingLessonIt: Lesson = {
  slug: 'scoring-guessing-and-pacing',
  title: 'Punteggio, risposte a caso e gestione del tempo all’IMAT',
  metaTitle: 'Punteggio, risposte a caso e tempo all’IMAT',
  summary: 'Calcola il punteggio di un modulo IMAT, decidi quando conviene rischiare la penalità di −0,4 e dividi 100 minuti su 60 quesiti senza restare senza tempo.',
  minutes: 18,
  objectives: [
    'Calcolare un punteggio IMAT a partire dal numero di risposte esatte, errate e omesse.',
    'Calcolare il valore atteso di una risposta tirata a indovinare dopo aver escluso alcune opzioni, e decidere quando rispondere.',
    'Costruire un piano dei tempi per i 100 minuti e correggerlo durante la prova.',
  ],
  teachMd: md`
### Il punteggio in una riga

Con $c$ risposte esatte e $w$ risposte errate, il punteggio è

$$S = 1{,}5c - 0{,}4w$$

Le omesse valgono zero, quindi non compaiono. Prima di calcolare, controlla sempre che esatte, errate e omesse sommino a 60: quasi tutti gli errori di punteggio sono errori di conteggio. Un rapporto utile: una risposta errata costa $\frac{0{,}4}{1{,}5} = \frac{4}{15}$ di una esatta, quindi 15 errate costano $15 \times 0{,}4 = 6$ punti, esattamente quanto valgono 4 esatte.

### Quanto vale tirare a indovinare

Rispondere a caso è una scommessa, e il suo valore nel lungo periodo è il **valore atteso** (*expected value*): il guadagno se indovini per la probabilità di indovinare, meno la perdita se sbagli per la probabilità di sbagliare. Se scegli a caso tra $k$ opzioni che contengono ancora quella giusta,

$$E = 1{,}5 \times \frac{1}{k} - 0{,}4 \times \frac{k-1}{k}$$

| Opzioni rimaste | Probabilità di indovinare | Valore atteso |
| --- | --- | --- |
| 5 (risposta del tutto a caso) | $\frac{1}{5}$ | $0{,}3 - 0{,}32 = -0{,}02$ |
| 4 | $\frac{1}{4}$ | $0{,}375 - 0{,}3 = +0{,}075$ |
| 3 | $\frac{1}{3}$ | $0{,}5 - 0{,}267 \approx +0{,}23$ |
| 2 | $\frac{1}{2}$ | $0{,}75 - 0{,}2 = +0{,}55$ |

Una risposta del tutto a caso è appena peggiore di un’omessa: in media costa 0,02 punti. Appena riesci a escludere con sicurezza un’opzione, il valore atteso diventa positivo, e cresce in fretta con ogni opzione eliminata.

Il punto di pareggio dice la stessa cosa. Se $p$ è la tua probabilità di indovinare, rispondere conviene in media quando $1{,}5p - 0{,}4(1 - p) > 0$, cioè quando $1{,}9p > 0{,}4$, ovvero $p > \frac{4}{19} \approx 0{,}21$. Una scelta a caso tra cinque dà $p = 0{,}2$, appena sotto la linea; qualsiasi conoscenza vera ti porta sopra.

### Il valore atteso è una media, non una promessa

Su un singolo quesito o guadagni 1,5 o perdi 0,4; il valore atteso descrive ciò che accade su molte risposte date a caso. Per la strategia il messaggio è semplice: un’opzione esclusa onestamente vale qualcosa, quindi non lasciare in bianco una domanda solo perché sei incerto tra due o tre opzioni. L’esclusione però deve essere onesta. Scartare un’opzione perché "sembra sbagliata", senza un motivo, non cambia la tua vera probabilità di indovinare.

### Il budget di tempo

Cento minuti per 60 quesiti fanno in media $\frac{100}{60} = 1\frac{2}{3}$ minuti, cioè 1 minuto e 40 secondi, a quesito. Se dividi il tempo in proporzione al numero di quesiti, ogni area riceve:

| Area | Quesiti | Tempo a 1 min 40 s ciascuno |
| --- | --- | --- |
| Lettura e conoscenze | 4 | 6 min 40 s |
| Ragionamento logico e problemi | 5 | 8 min 20 s |
| Biologia | 23 | 38 min 20 s |
| Chimica | 15 | 25 min |
| Fisica e matematica | 13 | 21 min 40 s |

Il totale è esattamente 100 minuti. È un piano di partenza, non una regola: il decreto non divide il tempo, e una domanda di memoria in biologia può richiedere 30 secondi mentre un calcolo di fisica richiede tre minuti. La tabella serve a darti dei punti di controllo. Se lavori nell’ordine della tabella e dopo 40 minuti sei ancora a metà della biologia, sai di essere in ritardo.

### Due passaggi nel fascicolo

Poiché puoi muoverti liberamente nel fascicolo cartaceo, un metodo in due passaggi funziona bene:

1. **Primo passaggio.** Rispondi a ogni domanda che risolvi in fretta. Quando una domanda richiederà chiaramente molto tempo, annotane il numero e passa oltre.
2. **Secondo passaggio.** Torna alle domande segnate, le più difficili per ultime. Escludi ciò che puoi e applica la regola sulle risposte a caso vista sopra.

Tieni qualche minuto per la fine. Il modulo risposte consente una sola correzione per quesito, quindi decidi prima di segnare. Segna il modulo man mano oppure, se tieni risposte provvisorie altrove, riportale con regolarità, per esempio alla fine di ogni area, invece che tutte insieme negli ultimi minuti. Una risposta esatta che non arriva sul modulo vale zero.
`,
  examples: [
    {
      id: 'example-score-a-sheet',
      title: 'Calcolare il punteggio di un modulo',
      problemMd: md`Un candidato risponde correttamente a 38 quesiti, sbaglia 12 risposte e ne lascia 10 in bianco. Qual è il punteggio?`,
      steps: [
        md`Controlla i conteggi: $38 + 12 + 10 = 60$.`,
        md`Punti delle risposte esatte: $38 \times 1{,}5 = 57$.`,
        md`Penalità delle risposte errate: $12 \times 0{,}4 = 4{,}8$. Le omesse non aggiungono nulla.`,
        md`Punteggio: $57 - 4{,}8 = 52{,}2$. Seconda via: 12 errate costano quanto $12 \times \frac{4}{15} = 3{,}2$ esatte, e $(38 - 3{,}2) \times 1{,}5 = 34{,}8 \times 1{,}5 = 52{,}2$.`,
      ],
      answerMd: md`52,2 punti. Togliere un punto intero per ogni errata darebbe $57 - 12 = 45$, uno sbaglio frequente.`,
    },
    {
      id: 'example-guess-after-elimination',
      title: 'Rispondere o lasciare in bianco?',
      problemMd: md`In un quesito di chimica sei sicuro che due delle cinque opzioni sono sbagliate, ma non riesci a scegliere tra le altre tre. Conviene rispondere?`,
      steps: [
        md`Restano tre opzioni, una delle quali è giusta, quindi una scelta a caso tra di esse è esatta con probabilità $\frac{1}{3}$.`,
        md`Valore atteso: $1{,}5 \times \frac{1}{3} - 0{,}4 \times \frac{2}{3} = 0{,}5 - 0{,}267 \approx 0{,}23$ punti.`,
        md`Un’omessa vale esattamente 0, e $0{,}23 > 0$: in media conviene rispondere.`,
      ],
      answerMd: md`Rispondi. Scegliere a caso tra tre opzioni rimaste vale in media circa $+0{,}23$ punti, contro lo 0 dell’omessa. Considerare pericolosa ogni risposta incerta, solo perché quella del tutto a caso è leggermente negativa, significherebbe buttare via questi punti.`,
    },
    {
      id: 'example-final-minutes',
      title: 'Gli ultimi tre minuti',
      problemMd: md`A tre minuti dalla fine restano sei quesiti senza risposta. In due di essi hai ristretto la scelta a due opzioni; gli altri quattro non li hai letti. Che cosa fai?`,
      steps: [
        md`Per ciascuno dei due quesiti ristretti: $1{,}5 \times \frac{1}{2} - 0{,}4 \times \frac{1}{2} = 0{,}75 - 0{,}2 = 0{,}55$. Insieme, $2 \times 0{,}55 = 1{,}1$ punti in media.`,
        md`Per ogni quesito non letto una risposta a caso vale $-0{,}02$; i quattro insieme valgono in media $4 \times (-0{,}02) = -0{,}08$.`,
        md`Quindi segna prima sul modulo le due risposte ristrette e lascia in bianco i quattro quesiti non letti.`,
      ],
      answerMd: md`Rispondi ai due quesiti ristretti (circa $+1{,}1$ punti in media) e lascia in bianco gli altri quattro. Rispondere a caso a tutti e sei sprecherebbe il lavoro già fatto; rispondere ai quattro non letti aggiunge un valore atteso leggermente negativo.`,
    },
  ],
  traps: [
    {
      title: 'Rispondere a caso perché "tanto non costa nulla"',
      md: md`Con cinque opzioni e una penalità di $-0{,}4$, una risposta del tutto a caso ha valore atteso $-0{,}02$. In media danneggia pochissimo, ma non aiuta. Rispondi quando hai un motivo per escludere almeno un’opzione.`,
    },
    {
      title: 'Lasciare in bianco ogni domanda incerta',
      md: md`L’errore opposto. Appena un’opzione è esclusa onestamente, rispondere vale in media $+0{,}075$; con due escluse vale circa $+0{,}23$. Chi rifiuta di rispondere a tutto ciò di cui non è sicuro regala punti su tutta la prova.`,
    },
    {
      title: 'Perdere tempo su un solo quesito',
      md: md`Ogni quesito vale gli stessi 1,5 punti. Cinque minuti su un calcolo ostinato sono il tempo di tre quesiti medi. Segnalo, vai avanti e tornaci al secondo passaggio.`,
    },
    {
      title: 'Riportare le risposte all’ultimo momento',
      md: md`È ammessa una sola correzione per quesito, e una risposta che non arriva sul modulo risposte vale zero. Segna il modulo durante la prova, non di corsa alla fine, e decidi prima di segnare.`,
    },
  ],
  check: [
    {
      id: 'check-score-sheet',
      title: 'Calcola il punteggio',
      topic: 'Punteggio',
      stemMd: md`Un candidato ha 42 risposte esatte, 9 errate e 9 omesse. Qual è il punteggio?`,
      options: [
        { id: 'A', text: md`38,4`, note: md`Conta ogni risposta esatta 1 punto invece di 1,5: $42 - 3{,}6$.` },
        { id: 'B', text: md`54,0`, note: md`Toglie un punto intero per ogni risposta errata: $63 - 9$.` },
        { id: 'C', text: md`55,8`, note: md`Applica la penalità di $-0{,}4$ anche alle omesse oltre che alle errate: $63 - 0{,}4 \times 18$.` },
        { id: 'D', text: md`59,4`, note: '' },
        { id: 'E', text: md`63,0`, note: md`Ignora la penalità per le 9 risposte errate.` },
      ],
      answer: 'D',
      workingMd: md`I conteggi tornano: $42 + 9 + 9 = 60$. Punteggio: $42 \times 1{,}5 - 9 \times 0{,}4 = 63 - 3{,}6 = 59{,}4$.`,
      lesson: 'Moltiplica le esatte per 1,5, le errate per 0,4, e lascia del tutto fuori le omesse.',
    },
    {
      id: 'check-three-options-left',
      title: 'Tre opzioni rimaste',
      topic: 'Risposte a caso',
      stemMd: md`Un candidato esclude con certezza due opzioni e sceglie a caso tra le tre rimaste. Qual è il valore atteso di questa risposta, in punti?`,
      options: [
        { id: 'A', text: md`Circa $-0{,}02$`, note: md`È il valore di una risposta del tutto a caso tra cinque opzioni; le due esclusioni sono state ignorate.` },
        { id: 'B', text: md`Circa $+0{,}08$`, note: md`È il valore con quattro opzioni rimaste, dopo averne esclusa una sola.` },
        { id: 'C', text: md`Circa $+0{,}23$`, note: '' },
        { id: 'D', text: md`$+0{,}50$`, note: md`È solo $1{,}5 \times \frac{1}{3}$: manca la penalità per le due probabilità su tre di sbagliare.` },
        { id: 'E', text: md`Circa $+0{,}77$`, note: md`Somma il termine della penalità invece di sottrarlo: $0{,}5 + 0{,}267$.` },
      ],
      answer: 'C',
      workingMd: md`La probabilità di indovinare è $\frac{1}{3}$, quella di sbagliare $\frac{2}{3}$. Valore atteso: $1{,}5 \times \frac{1}{3} - 0{,}4 \times \frac{2}{3} = 0{,}5 - 0{,}267 \approx 0{,}23$ punti, meglio dello 0 di un’omessa.`,
      lesson: 'Ogni opzione esclusa onestamente aumenta il valore della risposta; anche con una sola esclusa è positivo.',
    },
    {
      id: 'check-remaining-pace',
      title: 'In ritardo sulla tabella di marcia',
      topic: 'Gestione del tempo',
      stemMd: md`Procedendo in ordine nel fascicolo, un candidato finisce il quesito 30 dopo 55 minuti. Per affrontare tutti i quesiti rimasti nel tempo che resta, quale tempo medio per quesito ha ora a disposizione?`,
      options: [
        { id: 'A', text: md`45 secondi`, note: md`Divide i 45 minuti rimasti per tutti i 60 quesiti invece che per i 30 ancora da fare.` },
        { id: 'B', text: md`1 minuto e 30 secondi`, note: '' },
        { id: 'C', text: md`1 minuto e 40 secondi`, note: md`È la media dell’intera prova, $\frac{100}{60}$ minuti; ignora il tempo già usato.` },
        { id: 'D', text: md`1 minuto e 50 secondi`, note: md`È il ritmo tenuto finora, 55 minuti per 30 quesiti, non il ritmo ancora disponibile.` },
        { id: 'E', text: md`3 minuti e 20 secondi`, note: md`Divide tutti i 100 minuti per i 30 quesiti rimasti, dimenticando i 55 minuti già spesi.` },
      ],
      answer: 'B',
      workingMd: md`Tempo rimasto: $100 - 55 = 45$ minuti. Quesiti rimasti: $60 - 30 = 30$. Media: $\frac{45}{30} = 1{,}5$ minuti, cioè 1 minuto e 30 secondi a quesito.`,
      lesson: 'A ogni punto di controllo dividi il tempo rimasto per i quesiti rimasti, e confrontalo con l’1 minuto e 40 secondi di partenza.',
    },
  ],
  takeaways: [
    'Punteggio = 1,5 × esatte − 0,4 × errate; le omesse valgono zero.',
    'Una risposta del tutto a caso tra cinque opzioni vale in media −0,02; con un’opzione esclusa onestamente vale +0,075.',
    'Il tempo medio è 1 minuto e 40 secondi a quesito; usa i tempi per area come punti di controllo, non come regole.',
    'Lavora in due passaggi e segna il modulo risposte durante la prova, decidendo prima di segnare, perché ogni quesito si corregge una sola volta.',
  ],
  flashcards: [
    { front: 'Formula del punteggio IMAT', back: 'Punteggio = 1,5 × esatte − 0,4 × errate. Le omesse valgono 0.' },
    { front: 'Valore atteso di una risposta del tutto a caso', back: 'Con cinque opzioni, 1,5 × 0,2 − 0,4 × 0,8 = −0,02 punti: appena peggio di un’omessa.' },
    { front: 'Valore atteso con un’opzione esclusa', back: 'Con quattro opzioni rimaste, 1,5 × 0,25 − 0,4 × 0,75 = +0,075 punti: in media conviene rispondere.' },
    { front: 'Probabilità di pareggio per una risposta a caso', back: 'Rispondere conviene in media quando la probabilità di indovinare supera 4/19, circa il 21%.' },
    { front: 'Tempo medio per quesito', back: '100 minuti per 60 quesiti fanno 1 minuto e 40 secondi a quesito.' },
    { front: 'Correzioni sul modulo risposte', back: 'Una sola correzione per quesito: decidi prima di segnare, e segna il modulo con regolarità durante la prova.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};
