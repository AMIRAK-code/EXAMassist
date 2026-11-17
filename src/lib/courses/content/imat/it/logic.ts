import { md, type Lesson } from '../../../types';

/**
 * Corso IMAT, unità "logic", in italiano: pensiero critico (argomentazioni,
 * assunzioni, rafforzare, indebolire, vizi logici) e problem solving (problemi
 * numerici, successioni e rompicapi). Versione inglese: ../logic.ts.
 */

export const argumentsConclusionsAndAssumptionsLessonIt: Lesson = {
  slug: 'arguments-conclusions-and-assumptions',
  title: 'Argomentazioni, conclusioni e assunzioni implicite',
  summary: 'Trova la conclusione principale di un breve argomento, distinguila dalle sue ragioni e individua l’assunzione implicita da cui il ragionamento dipende.',
  minutes: 20,
  objectives: [
    'Distinguere le premesse, la conclusione intermedia e la conclusione principale di un breve argomento.',
    'Individuare il salto tra le prove e la conclusione prima di leggere le opzioni.',
    'Usare il test della negazione per separare un’assunzione necessaria da un’affermazione soltanto utile o troppo forte.',
  ],
  teachMd: md`
### Che cos'è un'argomentazione

Un'argomentazione (*argument*) è un gruppo di affermazioni in cui alcune, le **premesse** (*premises*), sono offerte come ragioni a favore di un'altra, la **conclusione** (*conclusion*). Un brano può contenere anche informazioni di contesto: fatti che descrivono la situazione ma non sono offerti come ragioni di nulla. Un elenco di fatti senza un «quindi» è una descrizione, non un'argomentazione.

L'area di ragionamento logico dell'IMAT conta 5 delle 60 domande. Le domande di pensiero critico (*critical thinking*) del tipo che si esercita qui propongono un breve brano e chiedono che cosa conclude, che cosa dà per scontato o quanto bene le sue ragioni lo sostengono. Tutti questi compiti partono dalla stessa abilità: capire quale affermazione è il punto d'arrivo e quali sono il sostegno.

### Trovare la conclusione

Le parole indicatrici aiutano. Nei brani in inglese, come quelli dell'esame, «therefore», «so», «thus», «hence», «it follows that» e «which shows that» precedono di solito una conclusione; «because», «since», «given that» e «as» precedono di solito una premessa. Le conclusioni sono spesso raccomandazioni («l'ospedale dovrebbe…»), previsioni («i casi diminuiranno») o affermazioni generali («l'esercizio fisico abbassa la pressione»).

Gli indicatori possono mancare: usa allora il **test del «quindi»** (*therefore test*). Prendi due affermazioni, uniscile con «quindi» in entrambi gli ordini e tieni l'ordine che suona come un ragionamento. «Il personale si lava le mani più spesso, quindi le infezioni trasmesse per contatto dovrebbero diminuire» ha senso; «le infezioni dovrebbero diminuire, quindi il personale si lava le mani più spesso» no. L'affermazione che segue il «quindi» che funziona è la conclusione di quel passaggio.

### Conclusione principale e conclusione intermedia

I brani più lunghi concatenano il ragionamento: una premessa sostiene un'affermazione, e questa a sua volta sostiene il punto finale.

| Ruolo | È sostenuta da un'altra affermazione? | Sostiene un'altra affermazione? |
| --- | --- | --- |
| Premessa | No | Sì |
| Conclusione intermedia | Sì | Sì |
| Conclusione principale | Sì | No |

La conclusione principale (*main conclusion*) è l'unica affermazione che non sostiene nient'altro: è ciò che l'autore vuole farti accettare alla fine. Quando la domanda chiede la conclusione principale, la conclusione intermedia (*intermediate conclusion*) è la risposta sbagliata più attraente, perché anch'essa è argomentata e sta spesso accanto a un «poiché» o a un «quindi».

### Le assunzioni: la premessa non detta

Un'**assunzione implicita** (*assumption*) è un'affermazione di cui l'argomento ha bisogno ma che non dichiara. Colma il salto tra ciò che le premesse stabiliscono e ciò che la conclusione afferma. Per trovare il salto, confronta le parole della conclusione con quelle delle premesse: un'idea che compare nella conclusione ma in nessuna delle prove segna il punto in cui qualcosa è stato dato per scontato.

I salti hanno poche forme ricorrenti.

- **Da un legame a una causa.** Due cose vanno insieme, e si afferma che una causa l'altra. L'argomento assume che il legame non vada nel verso opposto e che nessun terzo fattore spieghi entrambe.
- **Da alcuni a tutti.** Un risultato ottenuto su un campione viene esteso a un'intera popolazione. L'argomento assume che il campione sia tipico negli aspetti che contano.
- **Dal passato al futuro.** Ciò che è successo ci si aspetta che succeda di nuovo. L'argomento assume che le condizioni non siano cambiate.
- **Da un termine a un altro.** Le prove riguardano una cosa («meno ricoveri») e la conclusione un'altra («salute migliore»). L'argomento assume che le due vadano insieme.

### Il test della negazione

Per verificare se un'affermazione è un'assunzione, scrivine il contrario e chiediti se l'argomento regge ancora. Se l'affermazione negata fa crollare l'argomento, l'argomento aveva bisogno dell'originale: è un'assunzione. Se l'argomento sopravvive alla negazione, l'affermazione era al massimo utile.

Il test smaschera anche le opzioni **troppo forti**. Parole come «tutti», «ogni», «sempre», «solo» e «il migliore» rendono un'affermazione facile da negare senza danni: la negazione di «ogni cliente della mensa sta cercando di dimagrire» è «non tutti i clienti lo stanno facendo», e un argomento secondo cui alcuni clienti sceglieranno diversamente lo regge senza problemi. Un'assunzione è di solito l'affermazione più debole che basta a colmare il salto.

### Un metodo sotto pressione

1. Leggi prima la domanda, così sai se cerchi una conclusione o un'assunzione.
2. Trova la conclusione principale con le parole indicatrici e il test del «quindi».
3. Formula il salto con parole tue prima di leggere le opzioni.
4. Scarta le opzioni che ripetono una premessa, riformulano la conclusione, introducono fatti che l'argomento non usa o pretendono molto più di quanto serva.
5. Applica il test della negazione alle una o due opzioni rimaste.

Una risposta esatta vale 1,5 punti, una errata ne toglie 0,4 e una lasciata in bianco vale 0: per questo l'eliminazione conta, perché ogni opzione che escludi con una ragione rende più informata la scelta finale.
`,
  examples: [
    {
      id: 'example-hand-gel-stations',
      title: 'Conclusione principale o intermedia?',
      problemMd: md`Individua la conclusione principale di questo argomento.

> Un ospedale ha collocato dispenser di gel per le mani all'ingresso di ogni reparto, disposti in modo che nessuno possa entrare senza passarci accanto. Poiché ora il personale si lava le mani più spesso, le infezioni trasmesse per contatto dovrebbero diventare meno frequenti nei reparti. L'ospedale dovrebbe quindi installare gli stessi dispenser nei suoi ambulatori.`,
      steps: [
        md`Elenca le affermazioni: i dispenser sono all'ingresso di ogni reparto; il personale si lava le mani più spesso; le infezioni trasmesse per contatto dovrebbero diminuire; l'ospedale dovrebbe installare i dispenser negli ambulatori.`,
        md`Segna gli indicatori. «Poiché» presenta il lavaggio delle mani come ragione dell'affermazione sulle infezioni; «quindi» presenta la raccomandazione come la conclusione tratta da ciò che precede.`,
        md`Applica il test del «quindi» alle ultime due affermazioni: «le infezioni dovrebbero diminuire, quindi l'ospedale dovrebbe installare i dispenser negli ambulatori» suona come un ragionamento, l'ordine inverso no.`,
        md`L'affermazione sulle infezioni è sostenuta (dal lavaggio più frequente) e sostiene a sua volta qualcosa (la raccomandazione): è una conclusione intermedia. La raccomandazione non sostiene nient'altro, quindi è la conclusione principale.`,
      ],
      answerMd: md`La conclusione principale è che l'ospedale dovrebbe installare gli stessi dispenser nei suoi ambulatori. La risposta sbagliata più attraente è «le infezioni trasmesse per contatto dovrebbero diventare meno frequenti», che è argomentata ma è solo un passaggio intermedio.`,
    },
    {
      id: 'example-stairs-blood-pressure',
      title: 'L’assunzione dietro un’affermazione causale',
      problemMd: md`> In un'indagine su 2000 impiegati, chi di solito prendeva le scale aveva in media una pressione arteriosa più bassa di chi di solito prendeva l'ascensore. Prendere le scale, quindi, abbassa la pressione.

Da quale di queste affermazioni dipende l'argomento? (i) Avere la pressione più bassa non ha reso di per sé le persone più propense a scegliere le scale. (ii) Tutti quelli che prendono le scale hanno una pressione normale.`,
      steps: [
        md`Trova la conclusione e le prove. La conclusione è causale: prendere le scale **abbassa** la pressione. Le prove sono soltanto un'associazione tra l'uso delle scale e una pressione media più bassa.`,
        md`Dai un nome al salto: dal legame alla causa. L'argomento ha bisogno che il legame non vada nel verso opposto e che non sia prodotto da un terzo fattore.`,
        md`Nega (i): «avere la pressione più bassa ha reso le persone più propense a scegliere le scale». Allora il risultato dell'indagine potrebbe esserci senza che le scale facciano nulla, e la conclusione perde il suo sostegno. Quindi (i) è necessaria.`,
        md`Nega (ii): «non tutti quelli che prendono le scale hanno una pressione normale». Le prove riguardano medie, quindi l'argomento sopravvive senza difficoltà. (ii) è molto più forte di ciò che serve all'argomento.`,
      ],
      answerMd: md`L'argomento assume (i). L'affermazione (ii) è attraente perché sembra sostenere la conclusione, ma è un'affermazione generale su cui l'argomento non si appoggia mai.`,
    },
    {
      id: 'example-reading-programme',
      title: 'Solo ciò che serve alla conclusione',
      problemMd: md`> Un nuovo programma di lettura è stato sperimentato in cinque scuole primarie, e i punteggi degli alunni nei test di lettura sono saliti in tutte e cinque. Se la regione introdurrà il programma in tutte le sue scuole primarie, i punteggi nei test di lettura saliranno in tutta la regione.

Quale di queste affermazioni assume l'argomento? (i) Le cinque scuole non erano insolite in modi che hanno fatto funzionare il programma proprio lì. (ii) I punteggi nei test di lettura misurano con precisione quanto bene leggono gli alunni.`,
      steps: [
        md`La conclusione prevede punteggi più alti in tutta la regione; le prove sono un aumento in cinque scuole. L'idea nuova nella conclusione è «tutte le scuole della regione», quindi il salto va da alcuni a tutti.`,
        md`Nega (i): le cinque scuole erano insolite in modi che hanno fatto funzionare il programma proprio lì. Allora non se ne ricava nulla sulle altre scuole, e la previsione crolla. Quindi (i) è un'assunzione.`,
        md`Nega (ii): i punteggi non misurano con precisione la lettura. La conclusione riguarda i **punteggi**, non la capacità di leggere, quindi segue ancora dalle prove. (ii) non è necessaria.`,
      ],
      answerMd: md`L'argomento assume (i). L'affermazione (ii) conterebbe solo se la conclusione sostenesse che gli alunni leggono meglio: sceglierla significa leggere nella conclusione più di quanto dica.`,
    },
  ],
  traps: [
    {
      title: 'Scegliere la conclusione intermedia',
      md: md`In un argomento a catena la conclusione intermedia è argomentata, sta spesso accanto a «quindi» o «poiché» e suona come una conclusione. Controlla se sostiene a sua volta un'altra affermazione: se lo fa, non è la conclusione principale. La conclusione principale è la fine della catena.`,
    },
    {
      title: 'Scegliere un’assunzione troppo forte',
      md: md`Le opzioni con «tutti», «sempre», «solo» o «il migliore» attirano perché renderebbero certa la conclusione. Un'assunzione non deve rendere certa la conclusione: deve essere qualcosa di cui l'argomento non può fare a meno. Nega l'opzione: se l'argomento sopravvive, non era assunta.`,
    },
    {
      title: 'Rispondere con conoscenze esterne',
      md: md`Un'opzione può essere vera, sensata e corretta dal punto di vista medico e non essere comunque un'assunzione di questo argomento. Giudica ogni opzione solo in base a se il ragionamento di questo brano ne ha bisogno. Ciò che sai dell'argomento da altre fonti non conta.`,
    },
    {
      title: 'Scambiare una premessa per un’assunzione',
      md: md`Un'assunzione non è dichiarata. Un'opzione che ripete qualcosa che il brano già dice è una premessa, non un'assunzione, per quanto centrale sia. Se puoi sottolinearla nel brano, non è la risposta a una domanda sulle assunzioni.`,
    },
  ],
  check: [
    {
      id: 'check-blood-pressure-tablets',
      title: 'L’argomento del farmacista',
      topic: 'Pensiero critico: conclusione principale',
      stimulusMd: md`Molti pazienti smettono di prendere le compresse per la pressione appena si sentono bene. Eppure la pressione alta raramente dà sintomi, quindi sentirsi bene non dice nulla al paziente sul fatto che le compresse servano ancora. I farmacisti che consegnano queste compresse dovrebbero quindi ricordare a ogni paziente che la terapia va proseguita anche in assenza di sintomi.`,
      stemMd: md`Quale delle seguenti esprime meglio la conclusione principale dell'argomento?`,
      options: [
        { id: 'A', text: md`Molti pazienti smettono di prendere le compresse per la pressione appena si sentono bene.`, note: md`È il contesto che introduce il problema: nulla nel brano lo argomenta, e non è ciò che il brano vuole farti accettare alla fine.` },
        { id: 'B', text: md`La pressione alta raramente dà sintomi.`, note: md`È una premessa: viene data come ragione («quindi…») e non è sostenuta da nient'altro nel brano.` },
        { id: 'C', text: md`Sentirsi bene non dice nulla al paziente sul fatto che le compresse servano ancora.`, note: md`È una conclusione intermedia: è sostenuta dalla premessa sui sintomi, ma a sua volta sostiene la raccomandazione ai farmacisti.` },
        { id: 'D', text: md`I farmacisti dovrebbero ricordare a chi ritira le compresse per la pressione che la terapia va proseguita anche senza sintomi.`, note: '' },
        { id: 'E', text: md`I pazienti che sospendono le compresse svilupperanno una pressione pericolosamente alta.`, note: md`Il brano non lo dice mai. È un'affermazione più forte sulle conseguenze, che l'argomento non dichiara e di cui non ha bisogno.` },
      ],
      answer: 'D',
      workingMd: md`La catena è: la pressione alta raramente dà sintomi, quindi sentirsi bene non dice nulla sulla necessità della terapia, quindi i farmacisti dovrebbero ricordare ai pazienti di proseguirla. L'affermazione sul sentirsi bene è sostenuta e sostiene a sua volta la raccomandazione: è intermedia. La raccomandazione ai farmacisti non sostiene nient'altro: è la conclusione principale.`,
      lesson: 'La conclusione principale è l’affermazione che non sostiene nient’altro; un’affermazione argomentata e poi riutilizzata è intermedia.',
    },
    {
      id: 'check-helmet-law',
      title: 'La legge sul casco',
      topic: 'Pensiero critico: assunzione',
      stimulusMd: md`Nell'anno successivo all'introduzione dell'obbligo del casco per i ciclisti in una città, il numero di ciclisti curati nell'ospedale cittadino per traumi cranici è sceso di un terzo. La legge ha quindi ridotto i traumi cranici tra i ciclisti della città.`,
      stemMd: md`Quale delle seguenti è un'assunzione da cui dipende l'argomento?`,
      options: [
        { id: 'A', text: md`Il casco previene ogni trauma cranico in un incidente in bicicletta.`, note: md`Troppo forte. All'argomento basta che il casco prevenga alcuni traumi, non tutti; negandola («il casco non previene ogni trauma cranico») l'argomento resta in piedi.` },
        { id: 'B', text: md`Il numero di persone che vanno in bicicletta in città non è calato bruscamente nell'anno successivo all'introduzione della legge.`, note: '' },
        { id: 'C', text: md`La maggior parte dei ciclisti della città portava già il casco prima della legge.`, note: md`L'argomento non ne ha bisogno; anzi, la legge poteva avere effetto solo se molti ciclisti prima non portavano il casco. Negarla non danneggia l'argomento.` },
        { id: 'D', text: md`I traumi cranici sono le lesioni più frequenti tra i ciclisti.`, note: md`Quanto siano frequenti i traumi cranici rispetto ad altre lesioni non c'entra con il fatto che la legge li abbia ridotti.` },
        { id: 'E', text: md`Altre città dovrebbero introdurre una legge simile.`, note: md`È un'ulteriore conclusione che qualcuno potrebbe trarre, non qualcosa su cui l'argomento si regge.` },
      ],
      answer: 'B',
      workingMd: md`Le prove sono un calo del numero di ciclisti curati per traumi cranici; la conclusione è che la legge abbia causato meno traumi. Se dopo la legge molte meno persone fossero andate in bicicletta, i traumi potrebbero essere calati soltanto per questo. Nega l'affermazione sul numero di ciclisti: «il numero di persone in bicicletta è calato bruscamente». Il calo dei traumi si spiega allora senza il casco e l'argomento crolla, quindi ne dipende.`,
      lesson: 'Quando un conteggio scende, chiediti se è sceso anche il numero di persone esposte; un argomento basato su un conteggio assume di no.',
    },
    {
      id: 'check-calorie-menu',
      title: 'Le calorie nel menù',
      topic: 'Pensiero critico: assunzione',
      stimulusMd: md`Dal mese prossimo il menù della mensa dell'ospedale indicherà le calorie di ogni piatto. Chi mangia in mensa sceglierà quindi pasti meno calorici di quelli che sceglie ora.`,
      stemMd: md`Quale delle seguenti è un'assunzione da cui dipende l'argomento?`,
      options: [
        { id: 'A', text: md`Ogni cliente della mensa sta cercando di dimagrire.`, note: md`Troppo forte. All'argomento basta che alcuni clienti cambino scelta; negandola («non tutti i clienti stanno cercando di dimagrire») l'argomento resta intatto.` },
        { id: 'B', text: md`I pasti meno calorici sono più sani di quelli più calorici.`, note: md`La conclusione riguarda che cosa sceglieranno i clienti, non la salute: l'argomento non ne ha bisogno, che sia vera o no.` },
        { id: 'C', text: md`Almeno alcuni clienti noteranno le calorie indicate e ne terranno conto nella scelta.`, note: '' },
        { id: 'D', text: md`In passato i piatti della mensa erano più calorici di adesso.`, note: md`Non si dice che i piatti cambino: l'argomento riguarda l'effetto di mostrarne le calorie, quindi il loro contenuto passato è irrilevante.` },
        { id: 'E', text: md`Nelle altre mense che indicano le calorie, i clienti non hanno cambiato le loro scelte.`, note: md`Questa indebolirebbe l'argomento. Un'assunzione è qualcosa che deve essere vero perché l'argomento regga, non una prova contro di esso.` },
      ],
      answer: 'C',
      workingMd: md`Il salto è tra mostrare le calorie e il fatto che i clienti scelgano diversamente. Nega l'affermazione sul notare le calorie: «nessun cliente noterà le calorie e ne terrà conto nella scelta». Allora mostrarle non cambia nulla e la conclusione cade, quindi l'argomento ne dipende. Le affermazioni su ogni cliente a dieta e sulla salute vanno oltre ciò che dice la conclusione.`,
      lesson: 'Un’assunzione è di solito l’affermazione più debole che colma il salto; verificala negandola.',
    },
  ],
  takeaways: [
    'La conclusione principale non sostiene nient’altro; una conclusione intermedia è argomentata e poi riutilizzata.',
    'Usa le parole indicatrici e il test del «quindi» per capire quale affermazione è il punto d’arrivo.',
    'Un’assunzione è non dichiarata e necessaria: colma il salto tra le prove e la conclusione.',
    'Nega l’assunzione candidata: se l’argomento crolla era assunta, se sopravvive no.',
  ],
  flashcards: [
    { front: 'Premessa (*premise*)', back: 'Un’affermazione offerta come ragione a favore di un’altra. È dichiarata nel brano e non è a sua volta argomentata.' },
    { front: 'Conclusione intermedia (*intermediate conclusion*)', back: 'Un’affermazione sostenuta da una premessa che a sua volta sostiene la conclusione principale. È la risposta sbagliata più attraente quando si chiede la conclusione principale.' },
    { front: 'Il test del «quindi» (*therefore test*)', back: 'Unisci due affermazioni con «quindi» in entrambi gli ordini. L’ordine che suona come un ragionamento mostra quale affermazione è la conclusione di quel passaggio.' },
    { front: 'Assunzione implicita (*assumption*)', back: 'Un’affermazione non dichiarata di cui l’argomento ha bisogno: senza di essa le prove non sostengono più la conclusione.' },
    { front: 'Il test della negazione', back: 'Scrivi il contrario dell’assunzione candidata. Se l’argomento crolla, l’affermazione era assunta; se sopravvive, no.' },
    { front: 'Quattro salti frequenti', back: 'Da un legame a una causa, da alcuni a tutti, dal passato al futuro e da un termine a un altro.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic', skill: 'imat-logic-critical' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const strengtheningWeakeningAndFlawsLessonIt: Lesson = {
  slug: 'strengthening-weakening-and-flaws',
  title: 'Rafforzare, indebolire e vizi logici degli argomenti',
  summary: 'Valuta quale fatto nuovo rafforza o indebolisce di più un argomento e riconosci il vizio logico di chi passa da un legame a una causa o inverte una regola.',
  minutes: 22,
  objectives: [
    'Rafforzare o indebolire un argomento agendo sul salto tra le sue prove e la sua conclusione.',
    'Riconoscere le spiegazioni alternative di un’affermazione causale: causa inversa, terzo fattore e confronto distorto.',
    'Dare un nome ai vizi logici più comuni, tra cui l’inversione di un condizionale e la condizione necessaria presa per sufficiente.',
  ],
  teachMd: md`
### Parti dal salto

Le domande in cui si chiede di rafforzare (*strengthen*), indebolire (*weaken*) o trovare il vizio logico (*flaw*) si basano sulla lezione precedente. Prima di leggere le opzioni, trova la conclusione, trova le prove e di' in poche parole che cosa l'argomento dà per scontato per passare dalle une all'altra. È lì, in quel salto, che agisce ogni risposta corretta.

- Un'opzione **rafforza** l'argomento se riduce il salto: esclude una spiegazione rivale o conferma qualcosa che l'argomento assumeva.
- Un'opzione **indebolisce** l'argomento se allarga il salto: offre una spiegazione rivale delle prove o mostra che un'assunzione è falsa.
- Un **vizio logico** è il salto stesso descritto in termini generali: il tipo di errore che il ragionamento commette.

Due regole del gioco. Primo, accetta ogni opzione come vera: la domanda è che cosa farebbe all'argomento, non se ci credi. Secondo, la domanda chiede l'opzione che fa **di più**: un effetto piccolo perde contro uno grande, e un'opzione che parla solo dello stesso tema non fa nulla.

### Indebolire un'affermazione causale

Molti degli argomenti che incontrerai terminano con l'affermazione che qualcosa causa qualcos'altro: un farmaco previene il raffreddore, una tassa riduce i consumi, un giardino accelera la guarigione. Le prove di solito mostrano che due cose vanno insieme, o che un cambiamento è stato seguito da un altro. Ci sono tre modi classici di spiegare le prove senza la causa dichiarata.

| Spiegazione rivale | Che cosa dice | Esempio |
| --- | --- | --- |
| Causa inversa | È l'effetto a produrre la presunta causa | Le persone più sane riescono a fare più esercizio, non solo il contrario |
| Terzo fattore | Qualcos'altro produce entrambe | Il benessere economico può portare sia a frequentare la palestra sia a una salute migliore |
| È cambiato qualcos'altro | Un altro cambiamento contemporaneo spiega il risultato | Le degenze di un reparto si accorciano quando inizia anche ad accogliere casi più semplici |

Un buon indebolimento indica una di queste spiegazioni e la rende compatibile con i fatti del brano. Un buon rafforzamento ne esclude una, per esempio mostrando che i gruppi confrontati erano simili in tutto il resto.

### Confronti e prove eque

Molti argomenti medici e scientifici confrontano due gruppi. Il confronto sostiene una conclusione causale solo se i gruppi differiscono per il fattore studiato e per nient'altro che conti. Per questo l'**assegnazione casuale** (*random assignment*: è il caso a decidere chi riceve quale trattamento) e il **cieco** (*blinding*: i partecipanti non sanno quale trattamento ricevono) rafforzano tanto uno studio: l'assegnazione casuale elimina le differenze sistematiche tra i gruppi, il cieco impedisce che le aspettative influenzino ciò che viene riferito. Un'opzione che rivela che un gruppo era in partenza più sano, più giovane o più motivato indebolisce l'argomento per lo stesso motivo.

### Vizi logici da riconoscere

| Vizio | Che cosa fa l'argomento |
| --- | --- |
| Legame preso per causa | Conclude che una cosa ne causa un'altra solo perché si presentano insieme |
| Campione non rappresentativo | Generalizza da un gruppo che non è tipico dell'insieme |
| Inversione di un condizionale | Da «tutti gli A sono B» conclude «tutti i B sono A» |
| Necessario preso per sufficiente | Tratta una condizione richiesta come se garantisse il risultato |
| Ragionamento circolare | Usa la conclusione, riformulata, come una delle premesse |
| Attacco alla persona | Respinge una tesi per chi l'ha sostenuta, non per le prove |
| Falsa alternativa | Presenta due opzioni come le uniche quando ce ne sono altre |
| Numeri e tassi confusi | Confronta totali quando i gruppi hanno dimensioni diverse, o il contrario |

L'inversione di un condizionale e lo scambio tra necessario e sufficiente sono parenti stretti. «Ogni infermiere del reparto ha un attestato di primo soccorso» non significa che chiunque abbia l'attestato sia un infermiere del reparto. «L'attestato è richiesto per il corso» non significa che averlo basti per essere ammessi. In entrambi i casi l'argomento legge una regola a senso unico come se valesse nei due sensi.

### Come leggere le opzioni

1. Trova la conclusione e dai un nome al salto prima di guardare le opzioni.
2. Per indebolire, cerca la spiegazione rivale; per rafforzare, cerca ciò che la esclude.
3. Controlla il verso: un'opzione può essere pertinente e spingere comunque nella direzione sbagliata. Un aumento delle vendite di acqua in bottiglia dopo una tassa sulle bibite è coerente con la conclusione che si bevono meno bibite; non la indebolisce.
4. Controlla l'ambito: un'opzione su altre città, altre malattie o sul costo di qualcosa di solito lascia intatto questo argomento.
5. Per un vizio logico, abbina la descrizione generale al passaggio specifico del brano. Un'opzione che descrive un errore che il brano non commette è sbagliata, per quanto familiare suoni.
`,
  examples: [
    {
      id: 'example-garden-ward',
      title: 'Indebolire: il giardino accanto al reparto',
      problemMd: md`> Dopo l'apertura di un giardino accanto al reparto A, la degenza media dei suoi pazienti è scesa da nove a sette giorni. Il giardino deve aver aiutato i pazienti a guarire più in fretta.

Quale di queste, se vera, indebolisce di più l'argomento? (i) I pazienti del reparto A hanno detto di apprezzare il giardino. (ii) Nello stesso mese in cui è stato aperto il giardino, il reparto A ha cominciato ad accogliere soprattutto pazienti operati per interventi minori.`,
      steps: [
        md`Conclusione: il giardino ha causato una guarigione più rapida. Prove: degenze medie più brevi dopo l'apertura. Salto: non è cambiato nient'altro che potesse accorciare le degenze.`,
        md`L'opzione (ii) indica qualcos'altro cambiato nello stesso momento: i pazienti del reparto sono diventati casi più semplici, che ci si aspetta restino ricoverati meno a lungo in ogni caso. Questo spiega le prove senza il giardino.`,
        md`L'opzione (i) è in tema e si accorda perfino con la conclusione, ma apprezzare un giardino non dice nulla sul fatto che abbia accorciato le degenze. Non indebolisce l'argomento.`,
      ],
      answerMd: md`L'affermazione (ii) indebolisce di più l'argomento, perché offre una spiegazione rivale delle degenze più brevi. La (i) è attraente perché parla del giardino, ma non tocca il salto.`,
    },
    {
      id: 'example-strengthen-garden',
      title: 'Rafforzare lo stesso argomento',
      problemMd: md`Riprendi l'argomento del giardino, senza l'opzione (ii). Quale lo rafforzerebbe di più? (i) Nello stesso periodo il reparto B, che non ha un giardino e accoglie gli stessi tipi di pazienti del reparto A, non ha registrato alcuna variazione nella degenza media. (ii) La costruzione del giardino è stata costosa.`,
      steps: [
        md`Per rafforzare un'affermazione causale bisogna escludere le spiegazioni rivali. La principale è che qualcosa abbia agito sull'intero ospedale (una nuova politica di dimissione, una stagione più mite) accorciando le degenze ovunque.`,
        md`L'opzione (i) fornisce un confronto: un reparto simile senza giardino non è cambiato. Questo rende molto meno probabile una causa che riguardi tutto l'ospedale e indica qualcosa di specifico del reparto A.`,
        md`L'opzione (ii) riguarda il costo. Non ha nulla a che fare con il fatto che il giardino abbia accorciato le degenze.`,
      ],
      answerMd: md`L'affermazione (i) rafforza l'argomento escludendo una spiegazione valida per tutto l'ospedale. Non dimostra che il giardino abbia causato il cambiamento, ma a un rafforzamento basta rendere la conclusione più probabile.`,
    },
    {
      id: 'example-certificate-flaw',
      title: 'Dare un nome al vizio logico',
      problemMd: md`> Per essere ammesso al corso di formazione avanzata, un infermiere deve avere un attestato di primo soccorso. Luca ha un attestato di primo soccorso, quindi sarà ammesso al corso.

Qual è il vizio di questo ragionamento?`,
      steps: [
        md`Scrivi la regola del brano come affermazione a senso unico: ammesso al corso → ha l'attestato. L'attestato è una condizione **necessaria**.`,
        md`L'argomento la usa al contrario: ha l'attestato → ammesso. Così tratta l'attestato come condizione **sufficiente**, cosa che la regola non ha mai detto.`,
        md`Verifica con un controesempio: Luca potrebbe avere l'attestato ed essere comunque escluso per un altro motivo, per esempio perché i posti sono pochi. Nulla nel brano lo esclude.`,
      ],
      answerMd: md`L'argomento tratta una condizione necessaria come se fosse sufficiente. Descriverlo con «si basa su un campione non rappresentativo» o «attacca la persona» significherebbe nominare vizi che nel brano non ci sono.`,
    },
  ],
  traps: [
    {
      title: 'Pertinente ma nel verso sbagliato',
      md: md`Un'opzione può riguardare chiaramente l'argomento e tuttavia rafforzarlo quando ti si chiede di indebolirlo, o il contrario. Prima di scegliere, di' in una frase che cosa fa l'opzione al salto: lo allarga o lo riduce. Spesso le domande sono costruite in modo che l'opzione attraente abbia il tema giusto e il verso sbagliato.`,
    },
    {
      title: 'Dubitare dell’opzione invece di usarla',
      md: md`Ogni opzione va presa come vera. Scartarla perché la ritieni improbabile, o perché conosci uno studio che dice il contrario, significa rispondere a un'altra domanda. Chiediti solo che cosa farebbe l'opzione a questo argomento se fosse vera.`,
    },
    {
      title: 'Scegliere un vizio familiare che non c’è',
      md: md`Le opzioni sui vizi logici usano etichette standard, e un'etichetta che riconosci sembra giusta. Abbina ogni etichetta a un passaggio preciso del brano. Se non riesci a indicare la frase in cui l'argomento attacca una persona o usa un campione piccolo, quel vizio non è la risposta.`,
    },
  ],
  check: [
    {
      id: 'check-soft-drink-tax',
      title: 'La tassa sulle bibite',
      topic: 'Pensiero critico: indebolire',
      stimulusMd: md`Da quando una città ha introdotto una tassa sulle bibite zuccherate, le vendite di queste bevande nei negozi all'interno della città sono calate del 20%. Il consiglio comunale conclude che la tassa ha ridotto la quantità di bibite zuccherate bevute dai residenti.`,
      stemMd: md`Quale delle seguenti, se vera, indebolisce più seriamente la conclusione del consiglio comunale?`,
      options: [
        { id: 'A', text: md`Dall'introduzione della tassa, le vendite di bibite zuccherate nei negozi appena fuori dal confine comunale sono aumentate bruscamente.`, note: '' },
        { id: 'B', text: md`Il consiglio comunale si aspettava un calo delle vendite superiore al 20%.`, note: md`Ciò che il consiglio si aspettava non cambia ciò che è successo: un calo inferiore alle previsioni resta un calo, e non dice nulla su dove i residenti comprino le bibite.` },
        { id: 'C', text: md`Diverse altre città hanno introdotto tasse simili.`, note: md`Le altre città sono fuori dall'ambito dell'argomento: questo non spiega il calo in questa città né dà ragioni per dubitarne.` },
        { id: 'D', text: md`Dall'introduzione della tassa, le vendite di acqua in bottiglia nei negozi della città sono aumentate.`, note: md`È coerente con la conclusione, perché i residenti potrebbero essere passati dalle bibite all'acqua. Spinge nel verso sbagliato per un indebolimento.` },
        { id: 'E', text: md`Le bibite zuccherate contengono molto zucchero.`, note: md`È un'informazione di contesto sulle bevande. Non ha alcun peso sul fatto che i residenti ora ne bevano meno.` },
      ],
      answer: 'A',
      workingMd: md`Le prove riguardano le vendite nei negozi della città; la conclusione riguarda quanto bevono i residenti. Il salto è che i residenti potrebbero semplicemente comprare le bibite altrove. Un forte aumento delle vendite appena fuori dal confine offre proprio questa spiegazione rivale del calo del 20%, che quindi non implica che i residenti bevano meno.`,
      lesson: 'Quando le prove misurano una cosa (le vendite in un luogo) e la conclusione un’altra (il consumo), l’indebolimento migliore mostra come le due possano separarsi.',
    },
    {
      id: 'check-nasal-spray',
      title: 'La sperimentazione dello spray nasale',
      topic: 'Pensiero critico: rafforzare',
      stimulusMd: md`Durante un inverno, alcuni ricercatori hanno dato a un gruppo di volontari un nuovo spray nasale e a un secondo gruppo uno spray di acqua salata, ciascuno per una settimana. Nel mese successivo, i volontari del primo gruppo hanno riferito il 30% di raffreddori in meno rispetto a quelli del secondo. I ricercatori concludono che il nuovo spray aiuta a prevenire il raffreddore.`,
      stemMd: md`Quale delle seguenti, se vera, rafforza di più la conclusione dei ricercatori?`,
      options: [
        { id: 'A', text: md`Ad alcuni volontari del primo gruppo il sapore del nuovo spray non piaceva.`, note: md`Che il sapore non piaccia non dice nulla sul fatto che lo spray abbia prevenuto i raffreddori; non tocca il salto.` },
        { id: 'B', text: md`I raffreddori sono più frequenti in inverno che in estate.`, note: md`Entrambi i gruppi sono stati studiati nello stesso inverno: la stagione agisce allo stesso modo su tutti e due e non può spiegare la differenza.` },
        { id: 'C', text: md`Nel primo gruppo c'erano, per caso, più volontari già in ottima salute generale.`, note: md`Questo indebolisce la conclusione: una salute generale migliore è una spiegazione rivale dei raffreddori in meno.` },
        { id: 'D', text: md`I volontari sono stati assegnati ai gruppi in modo casuale, e né loro né i ricercatori sapevano quale spray avesse ricevuto ciascuno.`, note: '' },
        { id: 'E', text: md`Lo spray di acqua salata costa meno del nuovo spray.`, note: md`Il costo è irrilevante per stabilire se il nuovo spray prevenga il raffreddore.` },
      ],
      answer: 'D',
      workingMd: md`Le minacce principali alla conclusione sono che i gruppi differissero in qualche altro modo e che i volontari consapevoli di avere il nuovo spray riferissero meno raffreddori perché se lo aspettavano. L'assegnazione casuale elimina le differenze sistematiche tra i gruppi e il cieco elimina l'effetto delle aspettative su ciò che viene riferito. Escludere entrambe le spiegazioni rivali rende lo spray la causa più probabile.`,
      lesson: 'Un confronto equo rafforza un’affermazione causale: assegnazione casuale e cieco escludono le spiegazioni rivali più comuni.',
    },
    {
      id: 'check-rash-painkiller',
      title: 'L’eruzione cutanea e l’antidolorifico',
      topic: 'Pensiero critico: vizio logico',
      stimulusMd: md`Una verifica interna di un ospedale ha rilevato che tutti i pazienti che hanno sviluppato una certa eruzione cutanea stavano prendendo un nuovo antidolorifico. Un farmacista conclude che tutti i pazienti che prendono il nuovo antidolorifico svilupperanno l'eruzione.`,
      stemMd: md`Quale delle seguenti descrive meglio il vizio nel ragionamento del farmacista?`,
      options: [
        { id: 'A', text: md`Respinge una tesi per chi l'ha sostenuta anziché per le prove.`, note: md`Nessuna tesi viene respinta e nessuno viene criticato: nel brano non c'è alcun attacco alla persona.` },
        { id: 'B', text: md`Usa la propria conclusione, con altre parole, come una delle premesse.`, note: md`La premessa riguarda i pazienti con l'eruzione e la conclusione quelli che prendono il farmaco: sono affermazioni diverse, quindi il ragionamento non è circolare.` },
        { id: 'C', text: md`Dal fatto che tutti i pazienti con l'eruzione prendevano l'antidolorifico, conclude che tutti i pazienti che lo prendono svilupperanno l'eruzione.`, note: '' },
        { id: 'D', text: md`Presenta solo due possibilità quando ce ne sono altre.`, note: md`Il brano non propone mai una scelta tra due opzioni, quindi non c'è alcuna falsa alternativa da criticare.` },
        { id: 'E', text: md`Confronta totali di gruppi di dimensioni molto diverse.`, note: md`Il brano non riporta né numeri né dimensioni dei gruppi, quindi non può confrontare totali in modo scorretto.` },
      ],
      answer: 'C',
      workingMd: md`La verifica stabilisce «eruzione → prendeva l'antidolorifico». Il farmacista conclude «prende l'antidolorifico → eruzione», la stessa regola letta al contrario. Molti pazienti potrebbero prendere l'antidolorifico senza alcuna eruzione; la verifica, che ha guardato solo i pazienti con l'eruzione, non può dirlo. Nessuno degli altri vizi indicati compare nel brano.`,
      lesson: '«Tutti gli A sono B» non dà «tutti i B sono A»: controlla in che verso va una regola prima di usarla.',
    },
  ],
  takeaways: [
    'Trova prima il salto: un rafforzamento lo riduce, un indebolimento lo allarga, un vizio logico lo descrive.',
    'Prendi ogni opzione come vera e chiediti che cosa fa a questo argomento, in quale verso e quanto.',
    'Le affermazioni causali si indeboliscono con la causa inversa, un terzo fattore o un altro cambiamento contemporaneo.',
    'Assegnazione casuale e cieco rafforzano un confronto; una differenza tra i gruppi lo indebolisce.',
    'Invertire una regola a senso unico e prendere una condizione necessaria per sufficiente sono due vizi logici comuni.',
  ],
  flashcards: [
    { front: 'Rafforzamento (*strengthener*)', back: 'Un fatto che riduce il salto tra prove e conclusione, di solito escludendo una spiegazione rivale o confermando un’assunzione.' },
    { front: 'Indebolimento (*weakener*)', back: 'Un fatto che allarga il salto, di solito offrendo una spiegazione rivale delle prove o mostrando che un’assunzione è falsa.' },
    { front: 'Tre spiegazioni rivali di un’affermazione causale', back: 'La causa inversa, un terzo fattore che produce entrambe le cose e un altro cambiamento avvenuto nello stesso momento.' },
    { front: 'Perché assegnazione casuale e cieco rafforzano uno studio', back: 'L’assegnazione casuale elimina le differenze sistematiche tra i gruppi; il cieco impedisce che le aspettative influenzino ciò che viene riferito.' },
    { front: 'Inversione di un condizionale', back: 'Concludere «tutti i B sono A» da «tutti gli A sono B». La regola vale in un solo verso.' },
    { front: 'Necessario preso per sufficiente', back: 'Trattare una condizione richiesta, come un attestato per un corso, come se garantisse il risultato.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic', skill: 'imat-logic-critical' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const numericalProblemSolvingLessonIt: Lesson = {
  slug: 'numerical-problem-solving',
  title: 'Problemi numerici senza calcolatrice',
  summary: 'Imposta problemi su dosi, velocità, proporzioni e gruppi sovrapposti e risolvili a mano con frazioni, numeri comodi e verifiche rapide.',
  minutes: 22,
  objectives: [
    'Trasformare un problema a parole in una breve catena di grandezze con le loro unità di misura.',
    'Risolvere a mano problemi di velocità, proporzioni e gruppi sovrapposti, usando le frazioni invece di lunghi numeri decimali.',
    'Verificare un risultato per una seconda via e riconoscere la grandezza intermedia proposta da un’opzione sbagliata.',
  ],
  teachMd: md`
### Che cosa verificano questi problemi

Le domande di problem solving descrivono a parole una situazione quotidiana o scientifica e chiedono un numero. I calcoli sono semplici; la difficoltà sta nell'impostare la catena giusta di grandezze e nel non fermarsi a metà. Nulla nelle regole dell'IMAT consente l'uso della calcolatrice: preparati a lavorare a mano.

### Scrivi la catena prima di calcolare

Leggi prima la frase della domanda e annota che cosa si cerca, con la sua unità di misura: «mL per dose», «km/h», «numero di studenti». Poi elenca le grandezze date con le loro unità e cerca la catena che le collega. Le unità ti guidano: mg/kg moltiplicato per kg dà mg; mg diviso mg/mL dà mL. Se l'unità dell'ultimo passaggio non corrisponde a quella richiesta, l'impostazione è sbagliata prima ancora che lo sia un calcolo.

### Aritmetica adatta al calcolo a mano

- **Meglio le frazioni dei decimali.** $\frac{3}{5}$ di qualcosa è più comodo di $0{,}6$, e $\frac{1}{4} \times \frac{3}{5} = \frac{3}{20}$ resta esatto.
- **Semplifica prima di moltiplicare.** $\frac{36 \times 20}{3}$ è $12 \times 20 = 240$; non serve calcolare prima $720$.
- **Numeri comodi.** $15 \times 24 = 15 \times 4 \times 6 = 60 \times 6 = 360$.
- **Stima prima.** Un ordine di grandezza approssimativo ti permette di escludere opzioni dieci volte troppo grandi o fuori dall'intervallo ovvio.

### Velocità e ritmi

Un ritmo (*rate*) è una quantità per unità di tempo (o per unità di qualcos'altro). Tre schemi coprono la maggior parte dei problemi.

1. **Distanza, velocità e tempo:** $d = v \times t$. Usa le ore con i km/h; 45 minuti sono $\frac{3}{4}$ h.
2. **Velocità media:** distanza totale divisa per tempo totale. Non è la media delle velocità, perché si passa più tempo alla velocità più bassa.
3. **Lavorare insieme:** se una persona finisce un lavoro in $a$ ore e un'altra in $b$ ore, i loro ritmi sono $\frac{1}{a}$ e $\frac{1}{b}$ lavori all'ora, e i ritmi **si sommano**: insieme fanno $\frac{1}{a} + \frac{1}{b}$ lavori all'ora. I tempi non si sommano mai.

### Proporzioni e parti di un intero

Quando una domanda dà una frazione di una frazione («tre quinti dei pazienti sono adulti, e un quarto degli adulti ha più di 65 anni»), moltiplica le frazioni per ottenere la quota sul totale: $\frac{3}{5} \times \frac{1}{4} = \frac{3}{20}$. Se conosci la dimensione della parte, dividila per la sua quota per trovare il totale. Un rapporto $1 : 4$ significa 1 parte su $1 + 4 = 5$ parti, non 1 parte su 4.

### Gruppi sovrapposti

Per due gruppi che si sovrappongono,

$$\text{totale} = A + B - \text{entrambi} + \text{nessuno}$$

Sommando $A$ e $B$ si contano due volte le persone che stanno in entrambi i gruppi, che vanno quindi sottratte una volta. Una piccola tabella o un diagramma a due cerchi rende visibili le quattro regioni: solo $A$, solo $B$, entrambi, nessuno.

### Lavorare a ritroso dalle opzioni

Con cinque opzioni numeriche, a volte è più rapido provarle che risolvere. Comincia da un'opzione di valore intermedio: se dà un risultato troppo grande, la risposta è più piccola, e due o tre opzioni cadono in un colpo. Funziona meglio quando il calcolo in avanti è scomodo ma verificare un singolo numero è facile, come nei problemi del tipo «quante compresse c'erano all'inizio nella scatola?» in cui ogni giorno se ne toglie una frazione fissa.

### Contare gli intervalli

Quando un evento si ripete a intervalli fissi, il numero di eventi supera di uno il numero di intervalli tra il primo e l'ultimo. Una compressa ogni 8 ore dalle 06:00 di lunedì alle 22:00 di martedì copre 40 ore, cioè 5 intervalli e quindi 6 compresse. Disegna una breve linea del tempo ogni volta che non sei sicuro se aggiungere quell'uno.

### Verificare il risultato

Una seconda via intercetta la maggior parte degli errori. Fai scorrere il risultato in avanti nel problema: se la risposta è un totale di 240 pazienti, i $\frac{3}{20}$ di 240 danno davvero i 36 indicati? Cerca poi tra le opzioni i numeri incontrati lungo il percorso: le opzioni sbagliate sono spesso i risultati intermedi del metodo giusto (la dose giornaliera invece della singola dose, il numero di adulti invece di tutti i pazienti). Se la tua risposta è una di queste, controlla di aver finito.
`,
  examples: [
    {
      id: 'example-dose-volume',
      title: 'Il volume di una dose',
      problemMd: md`Una prescrizione di fantasia assegna a un bambino 15 mg di un farmaco per kg di massa corporea al giorno, suddivisi in 3 dosi uguali. Il bambino pesa 24 kg e il farmaco liquido contiene 120 mg ogni 5 mL. Quale volume deve avere ciascuna dose?`,
      steps: [
        md`Scrivi la catena con le unità: mg per kg al giorno × kg → mg al giorno; ÷ 3 → mg per dose; ÷ (mg per mL) → mL per dose.`,
        md`Quantità giornaliera: $15 \times 24 = 360$ mg.`,
        md`Una dose: $360 \div 3 = 120$ mg.`,
        md`Il liquido contiene 120 mg in 5 mL, quindi 120 mg corrispondono esattamente a 5 mL.`,
        md`Verifica per un'altra via: il volume giornaliero è $\frac{360}{120} \times 5 = 15$ mL, e $15 \div 3 = 5$ mL per dose.`,
      ],
      answerMd: md`Ogni dose è di 5 mL. La risposta sbagliata più attraente è 15 mL, che è il volume dell'intera giornata.`,
    },
    {
      id: 'example-two-workers',
      title: 'Lavorare insieme',
      problemMd: md`Un tecnico riesce a confezionare una scatola di kit diagnostici in 20 minuti; un secondo tecnico impiega 30 minuti per lo stesso lavoro. Lavorando insieme a questi ritmi, quanto tempo impiegano a confezionare 5 scatole?`,
      steps: [
        md`Trasforma i tempi in ritmi: $\frac{1}{20}$ e $\frac{1}{30}$ di scatola al minuto.`,
        md`I ritmi si sommano: $\frac{1}{20} + \frac{1}{30} = \frac{3}{60} + \frac{2}{60} = \frac{5}{60} = \frac{1}{12}$ di scatola al minuto.`,
        md`A una scatola ogni 12 minuti, 5 scatole richiedono $5 \times 12 = 60$ minuti.`,
        md`Verifica: in 60 minuti il primo confeziona $60 \div 20 = 3$ scatole e il secondo $60 \div 30 = 2$, cioè 5 scatole.`,
      ],
      answerMd: md`Impiegano 60 minuti. Fare la media dei tempi (25 minuti a scatola, quindi 125 minuti) o sommarli sono i metodi sbagliati più attraenti: i tempi non si sommano né si mediano, i ritmi si sommano.`,
    },
    {
      id: 'example-two-subjects',
      title: 'Gruppi sovrapposti',
      problemMd: md`Su 120 studenti, 70 studiano biologia, 50 studiano chimica e 20 non studiano nessuna delle due materie. Quanti studiano entrambe?`,
      steps: [
        md`Studenti che studiano almeno una materia: $120 - 20 = 100$.`,
        md`Sommando le due materie si ottiene $70 + 50 = 120$, cioè 20 in più di 100, perché chi studia entrambe è stato contato due volte.`,
        md`Quindi $20$ studenti studiano entrambe. Verifica con le quattro regioni: solo biologia $70 - 20 = 50$, solo chimica $50 - 20 = 30$, entrambe 20, nessuna 20, e $50 + 30 + 20 + 20 = 120$.`,
      ],
      answerMd: md`20 studenti studiano entrambe le materie. Dimenticare i 20 che non ne studiano nessuna porta a $70 + 50 - 120 = 0$, la risposta sbagliata più attraente.`,
    },
  ],
  traps: [
    {
      title: 'Fare la media delle velocità',
      md: md`Andare a 60 km/h e tornare a 40 km/h non dà una media di 50 km/h: il tratto più lento dura di più e quindi pesa di più. La velocità media è sempre distanza totale diviso tempo totale.`,
    },
    {
      title: 'Mescolare le unità di misura',
      md: md`Minuti con km/h, mL con L o mg con g producono risultati sbagliati di un fattore 60 o 1000. Converti tutto nelle unità della risposta prima di calcolare e controlla l'unità di ogni passaggio.`,
    },
    {
      title: 'Fermarsi a un risultato intermedio',
      md: md`La dose giornaliera, il numero di adulti, il tempo per una scatola: ognuno è un passaggio intermedio, e ognuno ha buone probabilità di comparire tra le opzioni. Rileggi la frase della domanda prima di scegliere.`,
    },
    {
      title: 'Leggere male un rapporto',
      md: md`Un rapporto $1 : 4$ è 1 parte su 5, non 1 parte su 4. Somma le parti del rapporto per ottenere l'intero prima di dividere.`,
    },
  ],
  check: [
    {
      id: 'check-round-trip-speed',
      title: 'Andata e ritorno',
      topic: 'Problem solving: velocità',
      stemMd: md`Un soccorritore percorre 30 km fino a un ospedale a una velocità media di 60 km/h e torna per la stessa strada a una velocità media di 40 km/h. Qual è la velocità media sull'intero percorso di andata e ritorno?`,
      options: [
        { id: 'A', text: md`24 km/h`, note: md`Divide solo la distanza di sola andata, 30 km, per il tempo totale di 1,25 ore; il percorso completo è di 60 km.` },
        { id: 'B', text: md`48 km/h`, note: '' },
        { id: 'C', text: md`50 km/h`, note: md`È la media delle due velocità. Si passa più tempo a 40 km/h, quindi la velocità media è inferiore a 50.` },
        { id: 'D', text: md`75 km/h`, note: md`75 è il tempo totale in minuti, non una velocità.` },
        { id: 'E', text: md`96 km/h`, note: md`Usa 120 km come distanza, contando due volte il percorso di andata e ritorno.` },
      ],
      answer: 'B',
      workingMd: md`Tempo all'andata: $\frac{30}{60} = 0{,}5$ h. Tempo al ritorno: $\frac{30}{40} = 0{,}75$ h. In totale 60 km in $1{,}25$ h, quindi la velocità media è $\frac{60}{1{,}25} = 48$ km/h. Seconda via: per distanze uguali la velocità media è $\frac{2 \times 60 \times 40}{60 + 40} = \frac{4800}{100} = 48$ km/h.`,
      lesson: 'La velocità media è la distanza totale diviso il tempo totale, mai la media delle velocità.',
    },
    {
      id: 'check-clinic-patients',
      title: 'Pazienti con più di 65 anni',
      topic: 'Problem solving: proporzioni',
      stemMd: md`In un ambulatorio, $\frac{3}{5}$ dei pazienti iscritti sono adulti e gli altri sono bambini. Un quarto degli adulti ha più di 65 anni. Se 36 pazienti iscritti hanno più di 65 anni, quanti sono in tutto i pazienti iscritti all'ambulatorio?`,
      options: [
        { id: 'A', text: md`60`, note: md`Divide 36 per $\frac{3}{5}$ e salta il passaggio del quarto di adulti con più di 65 anni.` },
        { id: 'B', text: md`96`, note: md`È il numero di bambini, $\frac{2}{5}$ di 240, non il totale.` },
        { id: 'C', text: md`144`, note: md`È il numero di adulti ($36 \times 4$); la domanda chiede tutti i pazienti iscritti.` },
        { id: 'D', text: md`240`, note: '' },
        { id: 'E', text: md`360`, note: md`Divide i 144 adulti per $\frac{2}{5}$, la quota dei bambini, invece che per $\frac{3}{5}$.` },
      ],
      answer: 'D',
      workingMd: md`Adulti: $36 \times 4 = 144$. Gli adulti sono i $\frac{3}{5}$ di tutti i pazienti, quindi il totale è $144 \times \frac{5}{3} = 240$. Verifica con la quota sul totale: gli ultrasessantacinquenni sono $\frac{3}{5} \times \frac{1}{4} = \frac{3}{20}$ dei pazienti, e $\frac{3}{20} \times 240 = 36$.`,
      lesson: 'Moltiplica le frazioni per ottenere la quota sul totale, poi dividi la parte nota per quella quota.',
    },
    {
      id: 'check-two-pumps',
      title: 'Due pompe',
      topic: 'Problem solving: ritmi di lavoro',
      stemMd: md`La pompa P, da sola, riempie una vasca in 6 ore. Le pompe P e Q insieme riempiono la stessa vasca in 4 ore. Quanto impiegherebbe la pompa Q da sola a riempire la vasca?`,
      options: [
        { id: 'A', text: md`2 ore`, note: md`Sottrae i tempi, $6 - 4$. I tempi non si sommano né si sottraggono; i ritmi sì.` },
        { id: 'B', text: md`2,4 ore`, note: md`È il tempo di due pompe da 6 e 4 ore che lavorano insieme, $\frac{6 \times 4}{6 + 4}$; ma 4 ore è già il tempo congiunto, non quello di Q da sola.` },
        { id: 'C', text: md`5 ore`, note: md`Fa la media dei due tempi dati, che qui non ha alcun significato.` },
        { id: 'D', text: md`10 ore`, note: md`Somma i due tempi dati. I tempi non si sommano; solo i ritmi.` },
        { id: 'E', text: md`12 ore`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Ritmi in vasche all'ora: insieme $\frac{1}{4}$, P da sola $\frac{1}{6}$. Il ritmo di Q è $\frac{1}{4} - \frac{1}{6} = \frac{3}{12} - \frac{2}{12} = \frac{1}{12}$, quindi Q da sola impiega 12 ore. Verifica: in 12 ore P riempie 2 vasche e Q una, cioè 3 vasche in 12 ore, una ogni 4 ore.`,
      lesson: 'Trasforma i tempi in ritmi, somma o sottrai i ritmi e torna ai tempi.',
    },
  ],
  takeaways: [
    'Scrivi la catena di grandezze con le loro unità prima di fare qualsiasi calcolo.',
    'Lavora con le frazioni e semplifica prima di moltiplicare; stima per escludere opzioni.',
    'I ritmi si sommano, i tempi no; la velocità media è distanza totale diviso tempo totale.',
    'Per due gruppi sovrapposti, totale = A + B − entrambi + nessuno.',
    'Le opzioni sbagliate sono spesso risultati intermedi: rileggi la domanda prima di scegliere.',
  ],
  flashcards: [
    { front: 'Velocità media', back: 'Distanza totale diviso tempo totale. Non è la media delle velocità, perché si passa più tempo alla velocità più bassa.' },
    { front: 'Due operai o due pompe insieme', back: md`Somma i ritmi: $\frac{1}{a} + \frac{1}{b}$ lavori all'ora. Alla fine ritrasforma il ritmo combinato in un tempo.` },
    { front: 'Formula dei gruppi sovrapposti', back: 'Totale = A + B − entrambi + nessuno. Sommando A e B la parte comune viene contata due volte.' },
    { front: 'Un rapporto 1 : 4', back: 'Una parte su 5 in totale. Somma le parti di un rapporto per ottenere l’intero prima di dividere.' },
    { front: 'Frazione di una frazione', back: md`Moltiplica per ottenere la quota sul totale: $\frac{3}{5}$ di $\frac{1}{4}$ è $\frac{3}{20}$. Dividi la parte nota per la sua quota per trovare il totale.` },
    { front: 'Verificare un risultato numerico', back: 'Fai scorrere il risultato in avanti nel problema e diffida delle opzioni che coincidono con un risultato intermedio.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic', skill: 'imat-logic-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const sequencesAndLogicalPuzzlesLessonIt: Lesson = {
  slug: 'sequences-and-logical-puzzles',
  title: 'Successioni e rompicapi logici',
  summary: 'Trova la regola di successioni di numeri e lettere, risolvi i problemi di ordinamento per casi e conta facce e cubetti nei problemi spaziali.',
  minutes: 22,
  objectives: [
    'Trovare la regola di una successione di numeri o di lettere provando differenze, rapporti e schemi alternati.',
    'Risolvere un problema di ordinamento collocando prima i dati fissi e dividendo il resto in casi.',
    'Distinguere ciò che deve essere vero da ciò che può soltanto esserlo, e contare i pezzi di un cubo verniciato.',
  ],
  teachMd: md`
### Successioni: prova le regole semplici in ordine

Una domanda sulle successioni (*sequences*) dà alcuni termini e chiede il successivo (o uno mancante). Quasi tutte le regole che incontrerai vengono da un elenco breve: prova le regole in un ordine fisso invece di fissare i numeri.

1. **Differenze.** Sottrai ogni termine dal successivo. Una differenza costante indica una progressione aritmetica. Se le differenze cambiano in modo regolare (2, 4, 6, 8), prosegui le differenze.
2. **Rapporti.** Se i termini crescono in fretta, dividi ogni termine per il precedente. Un rapporto costante indica una progressione geometrica (3, 6, 12, 24).
3. **Due successioni intrecciate.** Se le differenze si alternano (+5, −2, +5, −2), guarda separatamente i termini di posto dispari e quelli di posto pari: ciascun gruppo può essere semplice da solo.
4. **Famiglie note.** Quadrati (1, 4, 9, 16), cubi (1, 8, 27, 64), numeri primi (2, 3, 5, 7, 11), prodotti di numeri consecutivi (2, 6, 12, 20 è $1 \times 2, 2 \times 3, 3 \times 4, 4 \times 5$) e somme dei due termini precedenti (1, 1, 2, 3, 5, 8).

Trovata una regola, controlla che produca **tutti** i termini dati, non solo gli ultimi due. Poi applicala ancora una volta.

### Successioni di lettere

Trasforma le lettere nella loro posizione nell'alfabeto inglese (A = 1, B = 2, … Z = 26) e tratta il risultato come una successione di numeri. C, F, I, L è 3, 6, 9, 12, quindi la lettera successiva è la quindicesima, O. Quando una successione supera la Z, riparti a contare dalla A.

### Problemi di ordinamento

Un problema di ordinamento dà un insieme di persone o oggetti, un insieme di posizioni (orari, posti a sedere, posizioni in una fila) e alcune condizioni. Lo scopo è stabilire chi va dove, o che cosa ne segue.

- **Disegna le caselle.** Scrivi le posizioni in fila e riempi subito quelle fissate («R è alle 11:00»).
- **Usa poi la condizione più stretta.** Un blocco («S è subito dopo T») può stare in pochi posti. Elencali.
- **Dividi in casi.** Per ogni posto in cui il blocco può andare, segui le altre condizioni. Un caso che ne viola una è chiuso; ciò che sopravvive è la risposta.
- **Leggi il tipo di domanda.** «Deve essere vero» (*must be true*) significa vero in ogni caso sopravvissuto. «Può essere vero» (*could be true*) significa vero in almeno uno. «Non può essere vero» significa vero in nessuno.

Scrivere i casi richiede meno tempo di quanto sembri, ed evita l'errore più comune: rispondere in base alla prima disposizione che funziona quando anche un'altra disposizione funziona.

### Verità e coerenza

Alcuni rompicapi (*puzzles*) dicono che esattamente una tra più affermazioni è falsa, o che una persona mente sempre. Supponi a turno che ciascun candidato sia l'eccezione e controlla se tutto il resto torna. Di solito una sola ipotesi dà un quadro coerente.

### Cubi verniciati

Un cubo grande formato da $n \times n \times n$ cubetti, verniciato all'esterno e poi smontato, è un classico problema spaziale. Conta in base alla posizione.

| Posizione | Facce verniciate | Numero di cubetti |
| --- | --- | --- |
| Vertici | 3 | $8$ |
| Spigoli, esclusi i vertici | 2 | $12(n - 2)$ |
| Facce, esclusi gli spigoli | 1 | $6(n - 2)^2$ |
| Interno | 0 | $(n - 2)^3$ |

Un cubo ha 8 vertici, 12 spigoli e 6 facce. Ogni spigolo contiene $n$ cubetti, due dei quali sono vertici: da qui viene $n - 2$. I quattro conteggi devono sommare a $n^3$, il che fornisce una verifica rapida.

### Quando passare oltre

Ogni domanda dell'IMAT vale gli stessi 1,5 punti se esatta, quindi un rompicapo lungo non rende più di una breve domanda di biologia. Se un problema non si è sbloccato dopo una prima lettura attenta, segnalalo, vai avanti e torna a guardarlo con occhi nuovi: nulla nelle regole fissa l'ordine in cui rispondere.
`,
  examples: [
    {
      id: 'example-growing-differences',
      title: 'Differenze che crescono',
      problemMd: md`Trova il termine successivo: 3, 5, 9, 15, 23, …`,
      steps: [
        md`Le differenze sono $5 - 3 = 2$, $9 - 5 = 4$, $15 - 9 = 6$, $23 - 15 = 8$.`,
        md`Le differenze crescono di 2 ogni volta, quindi la differenza successiva è 10.`,
        md`Termine successivo: $23 + 10 = 33$.`,
        md`Verifica con una formula che funziona per ogni termine: $n^2 - n + 3$ dà 3, 5, 9, 15, 23 per $n$ da 1 a 5, e $36 - 6 + 3 = 33$ per $n = 6$.`,
      ],
      answerMd: md`Il termine successivo è 33. Aggiungere di nuovo 8, ottenendo 31, è la risposta sbagliata più attraente: presuppone che le differenze siano costanti.`,
    },
    {
      id: 'example-lab-tests',
      title: 'Deve essere vero o può essere vero?',
      problemMd: md`Quattro analisi di laboratorio, W, X, Y e Z, vengono eseguite una dopo l'altra nelle posizioni da 1 a 4. X viene eseguita prima di Y, ma non immediatamente prima. Z non è né la prima né l'ultima. Quale di queste affermazioni deve essere vera? (i) X è la prima. (ii) Y è la terza o la quarta.`,
      steps: [
        md`Elenca le posizioni di X e Y con almeno una posizione in mezzo: X1 Y3, X1 Y4, X2 Y4.`,
        md`X1 Y3: restano le posizioni 2 e 4; Z non può essere ultima, quindi Z2, W4. Ordine X Z Y W. Valido.`,
        md`X1 Y4: restano le posizioni 2 e 3, e Z può occupare l'una o l'altra: X Z W Y oppure X W Z Y. Entrambi validi.`,
        md`X2 Y4: restano le posizioni 1 e 3; Z non può essere prima, quindi Z3, W1. Ordine W X Z Y. Valido.`,
        md`Sopravvivono quattro disposizioni. Y è terza o quarta in tutte e quattro, quindi (ii) deve essere vera. X è prima in tre di esse ma seconda in W X Z Y, quindi (i) può soltanto essere vera.`,
      ],
      answerMd: md`Solo (ii) deve essere vera. La (i) è la risposta sbagliata più attraente: vale nelle prime disposizioni che probabilmente troverai, ma non in tutte.`,
    },
    {
      id: 'example-painted-cube',
      title: 'Un cubo 3 × 3 × 3 verniciato',
      problemMd: md`Un cubo formato da 27 cubetti, 3 per spigolo, viene verniciato su tutte le facce esterne e poi smontato. Quanti cubetti hanno esattamente due facce verniciate?`,
      steps: [
        md`I cubetti con esattamente due facce verniciate stanno su uno spigolo del cubo grande ma non in un vertice.`,
        md`Ogni spigolo ha 3 cubetti, di cui 2 sono vertici: ne resta $3 - 2 = 1$ per spigolo.`,
        md`Un cubo ha 12 spigoli, quindi i cubetti sono $12 \times 1 = 12$.`,
        md`Verifica i totali: vertici 8 (tre facce), spigoli 12 (due), centri delle facce $6 \times 1 = 6$ (una), centro 1 (nessuna), e $8 + 12 + 6 + 1 = 27$.`,
      ],
      answerMd: md`12 cubetti hanno esattamente due facce verniciate. La risposta sbagliata più attraente è 8, il numero dei cubetti ai vertici, che hanno tre facce verniciate.`,
    },
  ],
  traps: [
    {
      title: 'Adattare una regola solo agli ultimi due termini',
      md: md`Molte regole producono gli ultimi due termini di una successione; una sola li produce tutti. Prova la regola su ogni termine dato prima di fidarti.`,
    },
    {
      title: 'Fermarsi alla prima disposizione che funziona',
      md: md`In un problema di ordinamento, trovare una disposizione valida mostra che cosa può essere vero, non che cosa deve esserlo. Per una domanda del tipo «deve essere vero», controlla ogni caso, o cerca un'opzione che valga in tutti.`,
    },
    {
      title: 'Contare i vertici insieme agli spigoli',
      md: md`Nei problemi sui cubi, i cubetti ai vertici appartengono a tre spigoli contemporaneamente. Conta ogni spigolo senza i suoi due estremi e verifica che le categorie sommino al numero totale di cubetti.`,
    },
  ],
  check: [
    {
      id: 'check-alternating-sequence',
      title: 'Passi alternati',
      topic: 'Problem solving: successioni',
      stemMd: md`Qual è il termine successivo della successione 4, 9, 7, 12, 10, 15, …?`,
      options: [
        { id: 'A', text: md`12`, note: md`Sottrae 3 da 15. I passi si alternano tra +5 e −2, quindi il passo successivo è −2, non −3.` },
        { id: 'B', text: md`13`, note: '' },
        { id: 'C', text: md`17`, note: md`Aggiunge 2 a 15, leggendo il passo −2 come +2.` },
        { id: 'D', text: md`18`, note: md`Prosegue di +3 i termini di posto pari 9, 12, 15, ma il termine successivo è il settimo, di posto dispari.` },
        { id: 'E', text: md`20`, note: md`Ripete il passo +5; dopo un +5 lo schema prevede −2.` },
      ],
      answer: 'B',
      workingMd: md`Le differenze sono +5, −2, +5, −2, +5, quindi la successiva è −2: $15 - 2 = 13$. Seconda via: i termini di posto dispari 4, 7, 10 crescono di 3, quindi il settimo termine è $10 + 3 = 13$.`,
      lesson: 'Quando le differenze si alternano, separa la successione nei termini di posto dispari e in quelli di posto pari.',
    },
    {
      id: 'check-clinic-appointments',
      title: 'Cinque appuntamenti',
      topic: 'Problem solving: rompicapi logici',
      stemMd: md`Cinque pazienti, P, Q, R, S e T, hanno ciascuno un appuntamento alle 09:00, 10:00, 11:00, 12:00 e 13:00.

- L'appuntamento di R è alle 11:00.
- L'appuntamento di P è prima di quello di Q.
- L'appuntamento di S è subito dopo quello di T.
- L'appuntamento di Q non è alle 13:00.

Chi ha l'appuntamento delle 09:00?`,
      options: [
        { id: 'A', text: md`P`, note: '' },
        { id: 'B', text: md`Q`, note: md`Q deve venire dopo P, quindi non può avere il primo appuntamento della giornata.` },
        { id: 'C', text: md`R`, note: md`R è fissato alle 11:00 dalla prima condizione.` },
        { id: 'D', text: md`S`, note: md`S viene subito dopo T, quindi non può mai avere il primo appuntamento.` },
        { id: 'E', text: md`T`, note: md`Se T fosse alle 09:00, S sarebbe alle 10:00 e resterebbero le 12:00 e le 13:00 per P e Q; con P prima di Q, Q finirebbe alle 13:00, cosa non ammessa.` },
      ],
      answer: 'A',
      workingMd: md`Con R alle 11:00, la coppia T poi S deve occupare le 09:00 e le 10:00 oppure le 12:00 e le 13:00. Nel primo caso P e Q prendono le 12:00 e le 13:00 con P prima, quindi Q è alle 13:00, il che viola l'ultima condizione. Dunque T è alle 12:00 e S alle 13:00, e P e Q occupano le 09:00 e le 10:00 con P prima. L'ordine è P, Q, R, T, S, e P ha l'appuntamento delle 09:00.`,
      lesson: 'Colloca il dato fisso, elenca i pochi posti in cui può stare un blocco e chiudi ogni caso che viola una condizione.',
    },
    {
      id: 'check-five-cube',
      title: 'Un cubo 5 × 5 × 5 verniciato',
      topic: 'Problem solving: ragionamento spaziale',
      stemMd: md`Un cubo grande è formato da 125 cubetti, 5 per spigolo. Le sue facce esterne vengono verniciate e poi il cubo viene smontato. Quanti cubetti hanno esattamente due facce verniciate?`,
      options: [
        { id: 'A', text: md`8`, note: md`Sono i cubetti ai vertici, che hanno tre facce verniciate.` },
        { id: 'B', text: md`27`, note: md`È il numero di cubetti interni al cubo grande, $3^3$, senza alcuna vernice.` },
        { id: 'C', text: md`36`, note: '' },
        { id: 'D', text: md`54`, note: md`È il numero di cubetti con esattamente una faccia verniciata, $6 \times 3^2$.` },
        { id: 'E', text: md`60`, note: md`Conta tutti i 5 cubetti di ciascuno dei 12 spigoli, compresi i vertici, che hanno tre facce verniciate.` },
      ],
      answer: 'C',
      workingMd: md`I cubetti con esattamente due facce verniciate stanno su uno spigolo ma non in un vertice. Ogni spigolo ne ha $5 - 2 = 3$, e gli spigoli sono 12, quindi $12 \times 3 = 36$. Verifica i totali: $8 + 36 + 54 + 27 = 125$.`,
      lesson: 'Conta i cubetti verniciati per posizione (vertice, spigolo, faccia, interno) e verifica che i conteggi sommino al totale.',
    },
  ],
  takeaways: [
    'Prova le regole delle successioni in ordine: differenze, rapporti, successioni intrecciate, poi famiglie note.',
    'Una regola deve produrre tutti i termini dati, non solo gli ultimi due.',
    'Nei problemi di ordinamento colloca prima i dati fissi, elenca i posti per un blocco e dividi in casi.',
    '«Deve essere vero» significa vero in ogni caso sopravvissuto; «può essere vero», in almeno uno.',
    'In un cubo n × n × n verniciato i cubetti con due facce sono 12(n − 2) e i quattro conteggi sommano a n³.',
  ],
  flashcards: [
    { front: 'Ordine delle prove per una successione numerica', back: 'Differenze (e differenze delle differenze), rapporti, due successioni intrecciate, poi famiglie note come quadrati, cubi, numeri primi e somme alla Fibonacci.' },
    { front: 'Successioni di lettere', back: 'Sostituisci ogni lettera con la sua posizione nell’alfabeto inglese (A = 1, … Z = 26), risolvi con i numeri e dopo la Z riparti dalla A.' },
    { front: 'Differenze che si alternano', back: 'Separa la successione nei termini di posto dispari e in quelli di posto pari; ciascuna parte è spesso una successione semplice.' },
    { front: 'Deve essere vero o può essere vero', back: 'Deve essere vero vale in ogni disposizione che rispetta le condizioni; può essere vero vale in almeno una.' },
    { front: 'Cubo n × n × n verniciato', back: md`Tre facce: 8. Due facce: $12(n-2)$. Una faccia: $6(n-2)^2$. Nessuna: $(n-2)^3$.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic', skill: 'imat-logic-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};
