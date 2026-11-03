import type { SampleQuestionSet } from '@/lib/content/guides';
import type { HubContent } from './hub-content';
import {
  CISIA_CALENDAR,
  CISIA_CENT_PAGE_IT,
  CISIA_MOOC,
  CISIA_PRACTICE,
  CISIA_REGULATION_2026,
  CISIA_TOLC_ABOUT_IT,
  CISIA_TOLC_E_SYLLABUS_IT,
  CISIA_TOLC_F_SYLLABUS_IT,
  CISIA_TOLC_I_SYLLABUS_IT,
} from './official-links';

/**
 * The CISIA TOLC hub in Italian: the same facts, samples and plan as the
 * English page (src/lib/exams/hub-content.ts), written for Italian readers,
 * with links to Italian pages. The maths of every sample is the English
 * one; only the language changes. Anchors keep the English ids, so links
 * from other pages land on the same question in either language.
 *
 * The owners report that the translation has been reviewed (3 November
 * 2026), so the page carries no "awaiting review" note.
 */

const tolcSamplesIt: SampleQuestionSet = {
  sections: [
    {
      id: 'tolc-i-samples',
      heading: 'Esempi di domande del TOLC-I',
      introMd:
        'Una domanda per ciascuna di tre sezioni del TOLC-I. Nel test vero la sezione di Matematica concede 50 minuti per 20 domande, Logica e Scienze 20 minuti per 10 domande ciascuna: circa due minuti a domanda, senza calcolatrice.',
      questions: [
        {
          id: 'tolc-sample-log-maximum',
          title: 'Il massimo di una somma di logaritmi',
          topic: 'Matematica: logaritmi e funzioni di secondo grado',
          stemMd: 'Qual è il valore massimo della funzione $f(x) = \\log_2(x - 1) + \\log_2(5 - x)$ nel suo dominio?',
          options: [
            { id: 'A', text: '$\\log_2 3$', note: 'È $f(2)$, e anche $f(4)$: provando i numeri interi del dominio si manca il punto più alto, che è in $x = 3$.' },
            { id: 'B', text: '$2$', note: '' },
            { id: 'C', text: '$3$', note: '3 è il valore di $x$ in cui si raggiunge il massimo, non il valore massimo di $f$.' },
            { id: 'D', text: '$4$', note: '4 è il massimo del prodotto $(x - 1)(5 - x)$. La funzione ne è il logaritmo in base 2, quindi il suo massimo è $\\log_2 4 = 2$.' },
            { id: 'E', text: '$f$ non ha massimo', note: 'Nel dominio il prodotto dentro il logaritmo è una parabola rivolta verso il basso, che ha un punto più alto, e $\\log_2$ è crescente: quindi un massimo ce l’ha anche $f$. Ciò che manca a $f$ è un minimo: scende senza limite vicino a $x = 1$ e a $x = 5$.' },
          ],
          answer: 'B',
          workingMd: `Entrambi i logaritmi sono definiti solo se $x - 1 > 0$ e $5 - x > 0$, quindi il dominio è $1 < x < 5$. Lì i due logaritmi si possono riunire in uno solo:

$$f(x) = \\log_2\\big[(x - 1)(5 - x)\\big]$$

Il prodotto $(x - 1)(5 - x) = -x^2 + 6x - 5$ è una parabola rivolta verso il basso, con il vertice a metà tra le radici 1 e 5, cioè in $x = 3$, dove vale $2 \\times 2 = 4$. Poiché $\\log_2$ è crescente, $f$ è massima dove è massimo il prodotto: $f(3) = \\log_2 4 = 2$.`,
          lesson: 'Per rendere massimo il logaritmo di un’espressione, rendi massima l’espressione: il logaritmo è crescente. Trova il dominio prima di riunire i logaritmi.',
        },
        {
          id: 'tolc-sample-lockers',
          title: 'Quattro armadietti in fila',
          topic: 'Logica: ordinamenti e disposizioni',
          stemMd: `Quattro armadietti in fila sono numerati da 1 a 4, da sinistra a destra. Luca, Marta, Nico e Olga ne hanno uno ciascuno.

- L’armadietto di Marta è subito a destra di quello di Luca.
- L’armadietto di Olga non è a nessuna delle due estremità della fila.
- L’armadietto di Nico ha un numero più alto di quello di Olga.

Chi ha l’armadietto 2?`,
          options: [
            { id: 'A', text: 'Luca', note: 'Con Luca al 2, Marta ha il 3, e Olga, che non può stare a un’estremità, dovrebbe avere il 2 o il 3: sono entrambi occupati.' },
            { id: 'B', text: 'Nico', note: 'Il numero di Nico deve essere più alto di quello di Olga, quindi Olga dovrebbe avere l’1, che è a un’estremità.' },
            { id: 'C', text: 'Olga', note: 'Allora Nico ha il 3 o il 4, e Luca e Marta hanno bisogno di due armadietti vicini tra i due rimasti: l’1 e il 4, oppure l’1 e il 3. In nessuna delle due coppie gli armadietti sono vicini.' },
            { id: 'D', text: 'Marta', note: '' },
            { id: 'E', text: 'Non si può stabilire con le informazioni date', note: 'Le tre condizioni lasciano una sola disposizione possibile, quindi la risposta è determinata.' },
          ],
          answer: 'D',
          workingMd:
            'Parti dalla condizione più restrittiva: Olga ha il 2 o il 3. Se avesse il 2, Nico avrebbe il 3 o il 4, e i due armadietti rimasti per Luca e Marta (l’1 e il 4, oppure l’1 e il 3) non sarebbero vicini, come invece richiede la prima condizione. Quindi Olga ha il 3, Nico, che ha un numero più alto, ha il 4, e Luca e Marta prendono l’1 e il 2, in quest’ordine. L’armadietto 2 è di Marta.',
          lesson: 'Nei problemi di disposizione parti dalla condizione che lascia meno casi e segui ogni caso fino in fondo: una contraddizione lo esclude.',
        },
        {
          id: 'tolc-sample-kinematics',
          title: 'Lo spazio percorso con accelerazione costante',
          topic: 'Scienze: cinematica',
          stemMd: 'Un’automobile parte da ferma e accelera in modo uniforme, raggiungendo la velocità di 20 m/s dopo 8 s. Quanta strada percorre in questi 8 secondi?',
          options: [
            { id: 'A', text: '10 m', note: '10 m/s è la velocità media, non una distanza: va moltiplicata per il tempo.' },
            { id: 'B', text: '20 m', note: '20 m/s è la velocità finale, non una distanza. Controlla che la risposta sia nell’unità di misura richiesta.' },
            { id: 'C', text: '80 m', note: '' },
            { id: 'D', text: '160 m', note: 'Velocità finale × tempo, come se l’auto andasse a 20 m/s fin dall’inizio. Invece partiva da ferma.' },
            { id: 'E', text: '640 m', note: 'Mette la velocità finale (20) al posto dell’accelerazione in $s = \\tfrac{1}{2}at^2$.' },
          ],
          answer: 'C',
          workingMd: `Con accelerazione costante la velocità media è a metà tra la velocità iniziale e quella finale: $\\tfrac{0 + 20}{2} = 10$ m/s. In 8 s fanno $10 \\times 8 = 80$ m.

Lo stesso con le formule: $a = \\tfrac{20}{8} = 2{,}5$ m/s², e $s = \\tfrac{1}{2}at^2 = \\tfrac{1}{2} \\times 2{,}5 \\times 64 = 80$ m.`,
          lesson: 'Partendo da fermi con accelerazione costante, spazio = ½ × velocità finale × tempo. È più rapido che calcolare prima l’accelerazione.',
        },
      ],
    },
    {
      id: 'tolc-e-samples',
      heading: 'Esempi di domande del TOLC-E',
      introMd:
        'Una domanda per ciascuna sezione del TOLC-E. Nel test vero ogni sezione dura 30 minuti: 13 domande di Logica, 10 di Comprensione verbale e 13 di Matematica, anche qui senza calcolatrice.',
      questions: [
        {
          id: 'tolc-sample-ratio',
          title: 'Un rapporto che cambia',
          topic: 'Matematica: rapporti e proporzioni',
          stemMd: 'In una classe il rapporto tra ragazze e ragazzi è 3 : 2. Dopo che quattro ragazze passano a un’altra classe, le ragazze sono tante quanti i ragazzi. Quanti studenti c’erano all’inizio nella classe?',
          options: [
            { id: 'A', text: '4', note: '4 è il valore di una parte del rapporto, non un numero di studenti.' },
            { id: 'B', text: '8', note: '8 è il numero dei ragazzi, che non cambia.' },
            { id: 'C', text: '12', note: '12 è il numero iniziale delle ragazze, non dell’intera classe.' },
            { id: 'D', text: '16', note: '16 è il numero di studenti rimasti dopo che le quattro ragazze se ne sono andate.' },
            { id: 'E', text: '20', note: '' },
          ],
          answer: 'E',
          workingMd:
            'Scrivi la classe come $3k$ ragazze e $2k$ ragazzi. Dopo che quattro ragazze se ne vanno i due numeri sono uguali: $3k - 4 = 2k$, quindi $k = 4$. Sono 12 ragazze e 8 ragazzi, 20 studenti in tutto. Verifica: $12 : 8 = 3 : 2$, e $12 - 4 = 8$.',
          lesson: 'Trasforma un rapporto in multipli di un’unica incognita (3k e 2k), scrivi la nuova condizione come equazione, poi rileggi quale grandezza chiede la domanda.',
        },
        {
          id: 'tolc-sample-necessary-condition',
          title: 'Che cosa significa «solo» in una regola',
          topic: 'Logica: condizioni necessarie e sufficienti',
          stemMd: 'A un convegno vale questa regola: «Solo chi si è iscritto online può partecipare al laboratorio del pomeriggio». Quale delle seguenti affermazioni è certamente vera?',
          options: [
            { id: 'A', text: 'Se Giulia ha partecipato al laboratorio del pomeriggio, si è iscritta online.', note: '' },
            { id: 'B', text: 'Tutti quelli che si sono iscritti online hanno partecipato al laboratorio del pomeriggio.', note: 'La regola limita chi può partecipare; non obbliga a partecipare chi si è iscritto.' },
            { id: 'C', text: 'Se Marco non ha partecipato al laboratorio del pomeriggio, non si è iscritto online.', note: 'Marco potrebbe essersi iscritto e non essere andato. Non partecipare non dice nulla sull’iscrizione.' },
            { id: 'D', text: 'Se Sara si è iscritta online, ha partecipato al laboratorio del pomeriggio.', note: 'Rovescia la regola: iscriversi è necessario per partecipare, ma non basta a garantire la partecipazione.' },
            { id: 'E', text: 'Alcuni di quelli che hanno partecipato al laboratorio del pomeriggio non si erano iscritti online.', note: 'Contraddice la regola, quindi è certamente falsa.' },
          ],
          answer: 'A',
          workingMd:
            '«Solo chi si è iscritto può partecipare» fa dell’iscrizione una condizione necessaria per partecipare: se qualcuno ha partecipato, si è iscritto. L’opzione A dice esattamente questo di Giulia. La regola non rende l’iscrizione sufficiente, quindi le opzioni B, C e D, che la trattano come se lo fosse, non sono certe.',
          lesson: '«Solo A può B» significa «se B, allora A». A è necessaria, non sufficiente: attenzione alle opzioni che rovesciano la regola.',
        },
        {
          id: 'tolc-sample-library-fines',
          title: 'Che cosa sostiene un brano',
          topic: 'Comprensione verbale: inferenze da un brano',
          stimulusMd: `Per decenni le biblioteche pubbliche hanno applicato una piccola multa per ogni giorno di ritardo nella restituzione di un libro. Le multe dovevano servire a far rientrare i libri in tempo, ma diverse biblioteche comunali che le hanno abolite riferiscono un risultato che ha sorpreso il loro stesso personale: il numero di libri restituiti non è diminuito, e molti utenti che avevano smesso di frequentare la biblioteca sono tornati. I bibliotecari spiegano che le multe cambiavano di rado il comportamento degli utenti abituali, che restituivano comunque i libri in tempo, mentre per le persone con redditi bassi un debito crescente era un motivo per non farsi più vedere, spesso con il libro ancora a casa. Riscuotere le multe, inoltre, costava ad alcune biblioteche, in ore di lavoro del personale, quasi quanto le multe stesse facevano incassare.`,
          stemMd: 'Quale delle seguenti affermazioni è sostenuta dal brano?',
          options: [
            { id: 'A', text: 'Le multe per i ritardi erano la principale fonte di entrate delle biblioteche comunali.', note: 'Il brano dice solo che riscuotere le multe costava ad alcune biblioteche quasi quanto facevano incassare. Non dice nulla del loro peso sulle entrate di una biblioteca.' },
            { id: 'B', text: 'Dopo l’abolizione delle multe, gli utenti abituali hanno restituito i libri più tardi.', note: 'Il brano dice che il numero di libri restituiti non è diminuito, e che le multe cambiavano di rado il comportamento degli utenti abituali.' },
            { id: 'C', text: 'Per alcuni utenti, le multe ottenevano l’effetto contrario allo scopo per cui erano state introdotte.', note: '' },
            { id: 'D', text: 'Tutte le biblioteche che hanno abolito le multe hanno recuperato più libri.', note: 'Va oltre il brano due volte: parla di diverse biblioteche comunali, non di tutte, e dice che le restituzioni non sono diminuite, non che sono aumentate.' },
            { id: 'E', text: 'I bibliotecari si aspettavano che le restituzioni aumentassero dopo l’abolizione delle multe.', note: 'Il risultato «ha sorpreso il loro stesso personale», quindi il personale non se lo aspettava.' },
          ],
          answer: 'C',
          workingMd:
            'Le multe dovevano far rientrare i libri in tempo. Per le persone con redditi bassi, dice il brano, il debito crescente era un motivo per non farsi più vedere, «spesso con il libro ancora a casa»: per loro le multe tenevano lontani i libri invece di farli rientrare. È l’opzione C, detta in termini generali. Le altre opzioni o aggiungono qualcosa che il brano non dice (A, D) o lo contraddicono (B, E).',
          lesson: 'Un’opzione sostenuta dal brano lo riformula, spesso in termini più generali. Scarta un’opzione appena una sua parola (tutte, principale, si aspettavano) va oltre il testo.',
        },
      ],
    },
    {
      id: 'tolc-f-samples',
      heading: 'Esempi di domande del TOLC-F',
      introMd:
        'Una domanda per ciascuna delle due sezioni più lunghe del TOLC-F. Nel test vero Biologia e Chimica concedono 20 minuti ciascuna per 15 domande: meno di un minuto e mezzo a domanda, senza calcolatrice.',
      questions: [
        {
          id: 'tolc-sample-peptide-water',
          title: 'L’acqua liberata quando si forma una catena proteica',
          topic: 'Biologia: le molecole biologiche',
          stemMd: 'Una catena polipeptidica non ramificata di 10 amminoacidi si forma per reazioni di condensazione. Quante molecole d’acqua si liberano per formarla?',
          options: [
            { id: 'A', text: '0', note: 'La condensazione libera acqua. È la reazione inversa, l’idrolisi, a consumare una molecola d’acqua per rompere ciascun legame.' },
            { id: 'B', text: '5', note: 'Unisce gli amminoacidi in cinque dipeptidi, ma poi i cinque dipeptidi vanno legati tra loro, con altri quattro legami.' },
            { id: 'C', text: '9', note: '' },
            { id: 'D', text: '10', note: 'Una per amminoacido. L’acqua si libera una volta per ogni legame peptidico, e una catena aperta di 10 amminoacidi ha solo 9 legami tra vicini.' },
            { id: 'E', text: '18', note: 'Ne conta due per legame, l’–OH e l’–H, che però si staccano insieme, come un’unica molecola d’acqua.' },
          ],
          answer: 'C',
          workingMd:
            'Ogni legame peptidico unisce il gruppo carbossilico di un amminoacido al gruppo amminico del successivo, e formarlo libera una molecola d’acqua: un –OH da un amminoacido e un –H dall’altro. Una catena non ramificata di $n$ amminoacidi ha $n - 1$ legami tra vicini, quindi 10 amminoacidi richiedono 9 legami e liberano 9 molecole d’acqua.',
          lesson: 'In una catena di $n$ unità legate in fila ci sono $n - 1$ legami: conta i legami, non le unità. Vale anche per i polisaccaridi e per gli acidi nucleici.',
        },
        {
          id: 'tolc-sample-oxygen-percentage',
          title: 'Una percentuale in massa',
          topic: 'Chimica: la mole e le formule chimiche',
          stemMd: 'Quale percentuale della massa del carbonato di calcio, $\\mathrm{CaCO_3}$, è dovuta all’ossigeno? (Masse atomiche relative: Ca = 40, C = 12, O = 16.)',
          options: [
            { id: 'A', text: '12%', note: 'È la quota del carbonio: 12 grammi ogni 100.' },
            { id: 'B', text: '16%', note: 'Conta un solo atomo di ossigeno; la formula ne ha tre.' },
            { id: 'C', text: '40%', note: 'È la quota del calcio: 40 grammi ogni 100.' },
            { id: 'D', text: '48%', note: '' },
            { id: 'E', text: '60%', note: 'Tre atomi su cinque sono di ossigeno, ma la domanda riguarda la massa, e un atomo di ossigeno pesa meno di uno di calcio.' },
          ],
          answer: 'D',
          workingMd:
            'La massa molare di $\\mathrm{CaCO_3}$ è $40 + 12 + 3 \\times 16 = 100$ g/mol. L’ossigeno contribuisce con $3 \\times 16 = 48$ g ogni 100 g, cioè con il 48% della massa.',
          lesson: 'Percentuale in massa = (numero di atomi × massa atomica) ÷ massa molare. Moltiplica per l’indice, e confronta le masse, non il numero di atomi.',
        },
      ],
    },
  ],
  afterMd: `## Su questi esempi

Li ha scritti il team di UniExamer per questa pagina, con l’aiuto dell’intelligenza artificiale, e li ha pubblicati il 2 novembre 2026. Non sono domande del CISIA, la loro difficoltà non è tarata su quella del test vero e otto domande non bastano a stimare un punteggio TOLC. Ogni risposta è stata ricalcolata passo per passo durante la redazione. Non fanno parte della nostra banca di domande, quindi leggere le soluzioni non rovina nessuna esercitazione. Se trovi un errore, [scrivici](/it/about/support).

## La preparazione ufficiale del CISIA

L’[area esercitazioni](${CISIA_PRACTICE}) del CISIA offre esercizi e simulazioni, disponibili dopo la registrazione al sito del CISIA. I suoi [MOOC](${CISIA_MOOC}) di matematica di base, competenze testuali, fisica, chimica e biologia sono aperti a tutti e gratuiti.`,
};

export const cisiaIt: HubContent = {
  headline: 'TOLC-E, TOLC-I e TOLC-F del CISIA',
  metaTitle: 'TOLC-E, TOLC-I e TOLC-F: struttura, punteggio ed esempi svolti',
  metaDescription:
    'TOLC-E: 36 domande in 90 minuti; TOLC-I: 50 in 110; TOLC-F: 50 in 72. Punteggio, regole 2026, cosa si sa del 2027 ed esempi di domande svolti.',
  leadMd: `**Il TOLC è il test di ammissione online che il CISIA organizza per molte università italiane.** Questa pagina tratta tre tipi di TOLC: il **TOLC-E** per economia e statistica (36 domande in 90 minuti), il **TOLC-I** per ingegneria (50 in 110) e il **TOLC-F** per farmacia (50 in 72). Nelle sezioni principali una risposta esatta vale 1 punto, una non data 0 e una errata −0,25; segue una sezione di inglese di 30 domande, senza penalità. Non esiste una soglia nazionale: ogni ateneo fissa la propria e decide come usare il risultato.

Il TOLC si svolge in italiano. Da novembre 2025 il TOLC-E, il TOLC-I e il TOLC-F in inglese sono stati sostituiti da un test distinto, il CEnT-S, per il quale UniExamer non offre esercitazioni.`,
  status: {
    heading: '2027: cosa è confermato e cosa no',
    checkedOn: '2026-11-02',
    bodyMd: `**Confermato dal CISIA**

- La struttura e il punteggio descritti in questa pagina sono quelli del regolamento 2026. Il CISIA comunica eventuali modifiche alla struttura dei test entro il 31 dicembre di ogni anno ([Regolamento TOLC 2026, art. 1.2](${CISIA_REGULATION_2026})).
- Lo stesso tipo di TOLC si può sostenere una volta per mese solare ([che cos’è il TOLC](${CISIA_TOLC_ABOUT_IT})). Nel 2026 il contributo era di 35 €.
- Da novembre 2025 i corsi di laurea in lingua inglese usano il **CEnT-S** al posto dei TOLC in inglese ([pagina sul CEnT](${CISIA_CENT_PAGE_IT})).
- Dal 2027/28 anche il **Politecnico di Torino** ammette con i test CISIA, sostenuti solo in presenza: vedi [che cosa cambia al Politecnico](/it/exams/politecnico-di-torino-til) (pagina in inglese).

**Non ancora pubblicato**

- Le date dei TOLC 2027: il [calendario](${CISIA_CALENDAR}) del CISIA non riportava sessioni 2027 alla data della verifica.
- Eventuali modifiche a struttura, punteggio o contributo per il 2027, e il regolamento 2027.
- I bandi 2027/28 dei singoli atenei: quale TOLC richiedono, con quale soglia e con quali scadenze.`,
  },
  samples: {
    id: 'samples',
    heading: 'Esempi di domande svolti',
    introMd:
      'Otto domande originali nel formato del TOLC, dal TOLC-I, dal TOLC-E e dal TOLC-F: cinque opzioni, una sola corretta, senza calcolatrice. Prova a rispondere prima di aprire la soluzione: la spiegazione tratta ogni opzione sbagliata, perché i motivi per cui la si sceglie sono proprio ciò che serve alla domanda successiva.',
    set: tolcSamplesIt,
  },
  studyPlan: {
    id: 'study-plan',
    heading: 'Come prepararsi: un piano di sei settimane',
    bodyMd: `**Per prima cosa, leggi il bando del tuo ateneo.** Indica quale TOLC ti serve, se vale anche il TOLC@CASA sostenuto da casa, il punteggio minimo e a che cosa si applica: alcuni corsi di ingegneria guardano solo la sezione di Matematica del TOLC-I, altri un totale ponderato. È questo a decidere dove investire le ore di studio. Non esiste una soglia nazionale, e nessun punteggio di esercitazione, il nostro compreso, può dirti il risultato che otterrai al TOLC.

1. **Settimane 1–2: il sillabo, senza cronometro.** Ripassa il sillabo del tuo TOLC ([TOLC-E](${CISIA_TOLC_E_SYLLABUS_IT}), [TOLC-I](${CISIA_TOLC_I_SYLLABUS_IT}), [TOLC-F](${CISIA_TOLC_F_SYLLABUS_IT})) argomento per argomento, partendo dalla Matematica, presente in tutti i tipi. Colma le lacune con i [MOOC](${CISIA_MOOC}) gratuiti del CISIA (matematica di base, e fisica, chimica e biologia per il TOLC-I e il TOLC-F), poi esercitati per argomento, senza limiti di tempo: [TOLC-E](/it/practice/tolc-e), [TOLC-I](/it/practice/tolc-i) o [TOLC-F](/it/practice/tolc-f). Annota perché hai sbagliato ogni domanda, non solo che l’hai sbagliata.
2. **Settimane 3–4: una sezione a tempo ogni due giorni.** Affronta ogni sezione con il numero di domande e il tempo reali, senza calcolatrice, e rivedi lo stesso giorno ogni risposta sbagliata e ogni domanda lasciata in bianco. Gli [esempi svolti qui sopra](/it/exams/cisia-tolc#samples) mostrano il tipo di revisione che rende: capire perché ogni opzione sbagliata attira.
3. **Settimana 5: simulazioni complete.** Due simulazioni intere a qualche giorno di distanza, ciascuna in un’unica seduta, alla stessa ora in cui sosterrai il test. Decidi prima come regolarti con le risposte a caso: tirare a indovinare tra cinque opzioni vale in media 0 (1/5 − 4/5 × 0,25), ma appena puoi escludere un’opzione vale +0,06, quindi conviene rispondere.
4. **Settimana 6: il materiale del CISIA, poi riposo.** Usa gli esercizi e le simulazioni dell’[area esercitazioni](${CISIA_PRACTICE}) del CISIA (gratuita dopo la registrazione) per abituarti all’interfaccia vera. Prenota presto: ogni tipo di TOLC si può sostenere una volta per mese solare, quindi una soglia mancata costa un mese.

Se non hai sei settimane, mantieni l’ordine e accorcia ogni fase: prima le lacune sul sillabo, poi le sezioni a tempo, per ultima una simulazione completa.`,
  },
  updatedOn: '2026-11-02',
  sources: [
    { label: 'Che cos’è il TOLC: tentativi, prenotazione e contributo', url: CISIA_TOLC_ABOUT_IT, publisher: 'CISIA' },
    { label: 'Regolamento TOLC 2026 (PDF)', url: CISIA_REGULATION_2026, publisher: 'CISIA' },
    { label: 'Calendario dei TOLC e dei CEnT', url: CISIA_CALENDAR, publisher: 'CISIA' },
    { label: 'CEnT: il test in inglese che ha sostituito i TOLC in inglese', url: CISIA_CENT_PAGE_IT, publisher: 'CISIA' },
    { label: 'Area esercitazioni: esercizi e simulazioni', url: CISIA_PRACTICE, publisher: 'CISIA' },
    { label: 'MOOC per la preparazione ai TOLC', url: CISIA_MOOC, publisher: 'CISIA' },
    { label: 'Struttura e sillabo del TOLC-E', url: CISIA_TOLC_E_SYLLABUS_IT, publisher: 'CISIA' },
    { label: 'Struttura e sillabo del TOLC-I', url: CISIA_TOLC_I_SYLLABUS_IT, publisher: 'CISIA' },
    { label: 'Struttura e sillabo del TOLC-F', url: CISIA_TOLC_F_SYLLABUS_IT, publisher: 'CISIA' },
  ],
};
