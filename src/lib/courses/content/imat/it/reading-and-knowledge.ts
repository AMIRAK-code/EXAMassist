import { md, type Lesson } from '../../../types';

export const readingShortScientificPassagesLessonIt: Lesson = {
  slug: 'reading-short-scientific-passages',
  title: 'Leggere brevi testi scientifici',
  summary: 'Leggi un breve testo scientifico cercando tesi, prove e limiti, e rispondi in base al testo, non a ciò che sai già.',
  minutes: 16,
  objectives: [
    'Individuare la tesi principale di un breve testo scientifico e le prove che la sostengono.',
    'Leggere con la forza esatta espressioni come "può", "alcuni" ed "è associato a".',
    'Rispondere alle domande "secondo il testo" in base al testo, e ricavare il significato di una parola dal contesto.',
  ],
  teachMd: md`
### Che cosa chiede questa parte della prova

La prima area dell’IMAT è "Competenze di lettura e conoscenze acquisite negli studi" (*Reading skills and knowledge acquired in studies*). Il programma vi indica la comprensione di testi in inglese insieme alle conoscenze generali, e l’intera area conta 4 dei 60 quesiti. Come tutto il resto della prova, testi e domande sono in inglese. Un quesito di lettura vale gli stessi 1,5 punti di un calcolo di chimica, e spesso richiede meno tempo: un metodo affidabile qui è un buon investimento.

Questa lezione si esercita su brevi testi scientifici, il genere di testo che uno studente di medicina legge ogni giorno: un paragrafo su un processo fisiologico, la descrizione di uno studio, la spiegazione di una tecnica. Non serve conoscere l’argomento in anticipo. Serve leggere con precisione.

### Leggere cercando tre cose

Quasi ogni breve testo scientifico è costruito con gli stessi elementi:

1. **La tesi** (*claim*): ciò che l’autore afferma essere vero. Spesso è la prima o l’ultima frase.
2. **Il sostegno** (*support*): l’osservazione, il dato o il meccanismo portato come ragione della tesi.
3. **I limiti** (*limits*): le parole che dicono fin dove arriva la tesi, per chi e a quali condizioni.

Mentre leggi, chiediti di ogni frase: è la tesi, una ragione a suo favore o un limite? Un testo smontato così si risolve in fretta, perché quasi tutte le domande riguardano uno di questi tre elementi.

### Le espressioni di cautela portano il significato

La scrittura scientifica dosa con cura la forza di un’affermazione, e le domande verificano che tu faccia altrettanto. Confronta (tra parentesi le forme inglesi che troverai alla prova):

| Il testo dice | Puoi concludere | Non puoi concludere |
| --- | --- | --- |
| A è associato a B (*is associated with*) | A e B tendono a presentarsi insieme | A causa B |
| X può ridurre Y (*may reduce*) | X a volte riduce Y | X riduce Y |
| Alcuni pazienti sono migliorati (*some*) | Almeno un paziente è migliorato | La maggior parte è migliorata |
| L’effetto è stato osservato nei topi (*in mice*) | Valeva nei topi studiati | Vale nell’uomo |
| Di solito, raramente, spesso (*usually, rarely, often*) | Una tendenza, con eccezioni | Sempre, mai |

Un’opzione sbagliata spesso copia le parole del testo ma elimina o rafforza un’espressione di cautela. "È associato a" diventa "causa"; "può" diventa "fa"; "nei topi" sparisce. Quando un’opzione suona più forte del testo, è quasi sempre sbagliata.

### Lascia fuori le tue conoscenze

I candidati a medicina sanno molta biologia, e qui può essere un danno. Quando la domanda dice "secondo il testo" (*according to the passage*) o "il testo afferma" (*the passage states*), la risposta deve essere sostenuta dal testo. Un’opzione vera nel mondo reale ma non detta né implicata dal testo è sbagliata per quella domanda. Vale anche il contrario: se il testo descrive uno studio inventato, accettane i risultati come dati, anche se ti sorprendono.

### Parole nel contesto

Una domanda può chiedere che cosa significa "più precisamente" (*most nearly means*) una parola così come è usata nel testo. Molte parole scientifiche hanno anche un significato quotidiano, e il significato quotidiano è la trappola abituale. "Conservato" in "questo gene è altamente conservato nei vertebrati" (*highly conserved*) non vuol dire messo da parte o tenuto per dopo: vuol dire che la sequenza è rimasta in gran parte invariata tra specie diverse. Per rispondere, copri la parola, leggi la frase e decidi quale parola ci metteresti tu. Poi scegli l’opzione più vicina alla tua parola, e verificala rileggendo la frase con l’opzione al suo posto.

### Un metodo per ogni domanda

1. Leggi prima la domanda, così sai se cerchi la tesi, un dettaglio, un limite o una parola.
2. Leggi il testo una volta, distinguendo tesi, sostegno e limiti.
3. Torna alla frase su cui verte la domanda e rileggila con attenzione.
4. Prima di guardare le opzioni, di’ con parole tue quale dovrebbe essere la risposta.
5. Elimina le opzioni **troppo forti** (è sparita un’espressione di cautela), **rovesciate** (causa ed effetto scambiati), **fuori tema** (forse vere, ma non nel testo) o **contraddette** dal testo.

Se restano due opzioni, la migliore è di solito quella più cauta, interamente sostenuta dal testo.

### Numeri nei testi

A volte il testo contiene un dato: una percentuale, una dose, un numero di partecipanti. Leggi esattamente a che cosa si riferisce il numero. "La pressione è scesa nel 30% dei partecipanti" dice quante persone hanno risposto, non di quanto è scesa la loro pressione. Se un’opzione riprende un numero, controlla l’unità e che cosa conta, non solo le cifre.
`,
  examples: [
    {
      id: 'example-claim-and-limits',
      title: 'Tesi, sostegno e limiti',
      problemMd: md`*Testo:* "Nei mammiferi i globuli rossi perdono il nucleo durante la maturazione. Senza nucleo, un globulo rosso maturo non può dividersi, e ha più spazio per l’emoglobina, la proteina che trasporta l’ossigeno. Questa è una delle ragioni per cui i globuli rossi devono essere continuamente sostituiti da nuove cellule prodotte nel midollo osseo."

Secondo il testo, perché i globuli rossi devono essere continuamente sostituiti?`,
      steps: [
        md`Classifica le frasi. La frase 1 è un fatto (i globuli rossi maturi dei mammiferi non hanno nucleo). La frase 2 ne dà due conseguenze: non possono dividersi e hanno più spazio per l’emoglobina. La frase 3 è la tesi su cui verte la domanda.`,
        md`"Questa è una delle ragioni" rimanda alla frase 2. La conseguenza pertinente è che i globuli rossi maturi non possono dividersi, quindi non possono moltiplicarsi da soli.`,
        md`Nota il limite: "una delle ragioni", non "l’unica ragione". La risposta non deve presentare questa come la spiegazione completa.`,
      ],
      answerMd: md`Perché i globuli rossi maturi hanno perso il nucleo e non possono dividersi, quindi devono esserne prodotti di nuovi nel midollo osseo. Una risposta sbagliata ma allettante è "perché trasportano più emoglobina": è una conseguenza detta dal testo, ma non quella collegata alla sostituzione.`,
    },
    {
      id: 'example-qualifier',
      title: 'Riconoscere una cautela rafforzata',
      problemMd: md`*Testo:* "In un gruppo di volontari che camminavano 30 minuti al giorno, la glicemia media a digiuno era più bassa dopo 12 settimane rispetto all’inizio. I ricercatori osservano che durante lo studio i volontari potrebbero aver cambiato anche la dieta."

Quale affermazione è sostenuta dal testo: (i) "La camminata quotidiana ha abbassato la glicemia a digiuno dei volontari", oppure (ii) "La glicemia media a digiuno del gruppo è scesa nelle 12 settimane, anche se un cambiamento nella dieta potrebbe aver contribuito"?`,
      steps: [
        md`Trova la tesi: la glicemia media a digiuno era più bassa dopo 12 settimane. È un’osservazione sul gruppo.`,
        md`Trova il limite: i volontari "potrebbero aver cambiato anche la dieta". Gli stessi autori lasciano aperta un’altra causa.`,
        md`L’affermazione (i) trasforma l’osservazione in una causa ("ha abbassato") ed elimina il limite. L’affermazione (ii) mantiene sia l’osservazione sia il limite.`,
      ],
      answerMd: md`L’affermazione (ii). La (i) è la trappola classica: usa le parole del testo ma avanza un nesso causale che il testo evita di proposito.`,
    },
  ],
  traps: [
    {
      title: 'L’opzione vera ma non detta',
      md: md`Un’opzione può riportare un fatto che hai studiato a scuola e che sai essere vero. Se la domanda chiede che cosa dice il testo e il testo non lo dice, l’opzione è sbagliata. Confronta ogni opzione con una frase del testo.`,
    },
    {
      title: 'La cautela eliminata',
      md: md`"Alcuni", "può", "nei topi", "è associato a" (*some, may, in mice, is associated with*) sono le parole che le opzioni sbagliate tolgono. Prima di scegliere, confronta la forza dell’opzione con quella della frase da cui proviene.`,
    },
    {
      title: 'Il significato quotidiano di una parola tecnica',
      md: md`Parole come "conservato", "affinità", "coltura" o "risoluzione" (*conserved, affinity, culture, resolution*) hanno un significato scientifico diverso da quello quotidiano. Decidi il significato dalla frase, non dalla voce di dizionario che conosci meglio.`,
    },
  ],
  check: [
    {
      id: 'check-antibiotics-colds',
      title: 'Antibiotici e raffreddore',
      topic: 'Comprensione del testo',
      stimulusMd: md`Gli antibiotici uccidono i batteri o ne impediscono la moltiplicazione, ma non hanno alcun effetto sui virus. Quando una popolazione di batteri è esposta a un antibiotico, le poche cellule che per caso portano un gene di resistenza hanno più probabilità di sopravvivere e dividersi. Nel corso di molte generazioni, la proporzione di cellule resistenti nella popolazione può aumentare. Per questo motivo, assumere antibiotici per un’infezione virale come il comune raffreddore non porta alcun beneficio al paziente e può favorire i batteri resistenti.`,
      stemMd: md`Secondo il testo, perché assumere antibiotici per il comune raffreddore è inutile?`,
      options: [
        { id: 'A', text: md`Il raffreddore è causato da un virus, su cui gli antibiotici non hanno effetto, e la terapia può favorire i batteri resistenti.`, note: '' },
        { id: 'B', text: md`Gli antibiotici fanno sviluppare ai batteri geni di resistenza.`, note: md`Il testo dice che le cellule resistenti "per caso portano" il gene; l’antibiotico le favorisce, non crea il gene. Il meccanismo è rovesciato.` },
        { id: 'C', text: md`Il raffreddore è causato da batteri già resistenti agli antibiotici.`, note: md`Il testo definisce il raffreddore un’infezione virale; l’opzione lo contraddice.` },
        { id: 'D', text: md`Gli antibiotici indeboliscono la risposta del sistema immunitario ai virus.`, note: md`Il testo non parla del sistema immunitario; l’opzione introduce idee esterne.` },
        { id: 'E', text: md`I batteri resistenti sono sempre più numerosi degli altri batteri di una popolazione.`, note: md`Il testo dice che la proporzione di cellule resistenti "può aumentare"; "sono sempre più numerosi" è molto più forte del testo.` },
      ],
      answer: 'A',
      workingMd: md`L’ultima frase dà la risposta e la sua ragione: il raffreddore è un’infezione virale, gli antibiotici non agiscono sui virus, quindi non c’è beneficio; le frasi precedenti spiegano perché la terapia "può favorire i batteri resistenti". L’opzione che unisce le due cose, con la stessa cautela del testo ("può"), è la risposta.`,
      lesson: 'Confronta il meccanismo di un’opzione con il testo: selezionare una resistenza già presente non è creare una resistenza nuova.',
    },
    {
      id: 'check-affinity',
      title: 'Una parola nel contesto',
      topic: 'Comprensione del testo',
      stimulusMd: md`L’affinità dell’emoglobina per l’ossigeno non è fissa. Nei polmoni, dove l’ossigeno abbonda, l’emoglobina lo lega facilmente. Nel muscolo in attività, dove la concentrazione di anidride carbonica è più alta e il pH è più basso, la sua affinità diminuisce e l’ossigeno viene ceduto più facilmente al tessuto che ne ha bisogno.`,
      stemMd: md`Così come è usata nel testo, la parola "affinità" significa più precisamente`,
      options: [
        { id: 'A', text: md`simpatia o attrazione`, note: md`È il senso quotidiano della parola, riferito alle persone; una proteina non ha preferenze.` },
        { id: 'B', text: md`somiglianza di struttura`, note: md`"Affinità" può indicare una somiglianza tra cose, ma il testo parla del legame con l’ossigeno, non di somiglianze.` },
        { id: 'C', text: md`quantità totale trasportata`, note: md`Il testo dice che l’affinità diminuisce nel muscolo perché l’ossigeno venga ceduto; descrive quanto saldamente l’ossigeno è trattenuto, non una quantità.` },
        { id: 'D', text: md`velocità di spostamento nel sangue`, note: md`Nulla nel testo riguarda la velocità con cui viaggia l’emoglobina.` },
        { id: 'E', text: md`tendenza a legarsi`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Sostituisci la parola con uno spazio vuoto: la ___ dell’emoglobina per l’ossigeno diminuisce, quindi l’ossigeno viene ceduto più facilmente. La parola deve descrivere quanto prontamente l’emoglobina lega e trattiene l’ossigeno; "tendenza a legarsi" funziona, e rileggendo la frase con questa espressione al suo posto il senso resta lo stesso.`,
      lesson: 'Copri la parola, decidi che cosa serve alla frase, poi abbina un’opzione alla tua parola.',
    },
    {
      id: 'check-resting-heart-rate',
      title: 'Quanto è forte l’affermazione?',
      topic: 'Comprensione del testo',
      stimulusMd: md`L’attività fisica regolare è associata a una frequenza cardiaca a riposo più bassa negli adulti. Negli atleti allenati di resistenza, il cuore spesso pompa un volume di sangue maggiore a ogni battito, così a riposo bastano meno battiti al minuto per rifornire l’organismo.`,
      stemMd: md`Quale affermazione è meglio sostenuta dal testo?`,
      options: [
        { id: 'A', text: md`Ogni adulto che fa attività fisica regolare ha una frequenza a riposo più bassa di ogni adulto che non la fa.`, note: md`Il testo dice che le due cose sono "associate": descrive una tendenza, non una regola per ogni individuo.` },
        { id: 'B', text: md`Una frequenza cardiaca a riposo bassa rende le persone più propense a iniziare a fare esercizio.`, note: md`Rovescia la direzione descritta dal testo, che va dall’attività e dall’allenamento alla frequenza cardiaca.` },
        { id: 'C', text: md`In molti atleti allenati di resistenza, un volume maggiore pompato a ogni battito consente una frequenza a riposo più bassa.`, note: '' },
        { id: 'D', text: md`L’allenamento di resistenza aumenta la frequenza cardiaca massima.`, note: md`Il testo tratta solo la frequenza a riposo; della massima non dice nulla.` },
        { id: 'E', text: md`L’attività fisica non ha alcun effetto sulla frequenza cardiaca a riposo.`, note: md`Contraddice l’associazione affermata nella prima frase del testo.` },
      ],
      answer: 'C',
      workingMd: md`La seconda frase dà il meccanismo con la sua cautela: il cuore "spesso" pompa di più a ogni battito, "così a riposo bastano meno battiti al minuto". L’opzione che mantiene "molti" (in linea con "spesso") e lo stesso meccanismo è interamente sostenuta. Le altre sono troppo forti, rovesciate, fuori tema o contraddette.`,
      lesson: 'L’opzione meglio sostenuta conserva le cautele del testo; quelle sbagliate le rafforzano, le rovesciano o divagano.',
    },
  ],
  takeaways: [
    'Scomponi ogni testo in tesi, sostegno e limiti prima di leggere le opzioni.',
    'Le opzioni sbagliate spesso copiano il testo ma tolgono o rafforzano una cautela.',
    '"Secondo il testo" significa in base al testo, anche quando sai di più.',
    'Per una parola nel contesto, coprila, scegli una parola tua, poi abbina un’opzione.',
  ],
  flashcards: [
    { front: 'I tre elementi di un breve testo scientifico', back: 'La tesi, il sostegno (dato, osservazione o meccanismo) e i limiti (chi, quando, fin dove).' },
    { front: '"A è associato a B" (*is associated with*)', back: 'A e B tendono a presentarsi insieme. Non dice che A causa B.' },
    { front: 'Un’opzione vera ma assente dal testo', back: 'È sbagliata in una domanda "secondo il testo": la risposta deve essere sostenuta dal testo.' },
    { front: 'Quattro modi in cui un’opzione sbaglia', back: 'Troppo forte (cautela eliminata), rovesciata (causa ed effetto scambiati), fuori tema, o contraddetta dal testo.' },
    { front: 'Metodo per una parola nel contesto', back: 'Copri la parola, decidi che cosa serve alla frase, scegli l’opzione più vicina e rileggi la frase con l’opzione al suo posto.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-reading-knowledge', skill: 'imat-read-comprehension' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const inferenceAndAssumptionsInTextsLessonIt: Lesson = {
  slug: 'inference-and-assumptions-in-texts',
  title: 'Inferenze e presupposti nei testi',
  summary: 'Distingui ciò che un testo afferma, ciò che ne segue necessariamente e ciò che dà per scontato, e trova il presupposto con il test della negazione.',
  minutes: 18,
  objectives: [
    'Distinguere un’affermazione, un’inferenza necessariamente vera e un’ipotesi plausibile.',
    'Trovare il presupposto non dichiarato su cui si regge un argomento, e verificarlo con il test della negazione.',
    'Usare correttamente "tutti", "solo", "la maggior parte" e "alcuni" nel trarre conclusioni.',
  ],
  teachMd: md`
### Affermato, inferito, presupposto

Le domande su un testo riguardano tre relazioni diverse, e confonderle è la fonte più comune di risposte sbagliate.

- **Affermato**: il testo lo dice, magari con altre parole.
- **Inferito** (*inferred*): il testo non lo dice, ma deve essere vero se tutto ciò che il testo dice è vero.
- **Presupposto** (*assumed*): il testo non lo dice, ma un argomento del testo ne ha bisogno per arrivare alla sua conclusione.

Un’inferenza discende *dal* testo. Un presupposto sta *sotto* un argomento, e colma il vuoto tra le prove e la conclusione.

### Il test del "deve essere vero"

Per una domanda di inferenza ("Quale delle seguenti si può inferire?", "Quale deve essere vera?", in inglese *can be inferred*, *must be true*) il criterio è severo. L’opzione giusta deve valere in ogni situazione compatibile con il testo. Una conclusione plausibile, probabile o sensata non basta.

Verifica ogni opzione cercando di immaginare una situazione in cui il testo è vero e l’opzione è falsa. Se ci riesci, l’opzione non è un’inferenza. Per esempio, "Tutti i pazienti nella lista del mattino hanno fatto un prelievo; il signor Rossi stamattina non ha fatto il prelievo" permette di inferire che il signor Rossi non era nella lista del mattino. Non permette di inferire che sia stato dimesso, o che abbia rifiutato il prelievo: potrebbe essere vero, ma il testo resta vero anche se è falso.

### Le parole che fissano la logica

Alcune parole fanno quasi tutto il lavoro nelle domande di inferenza:

| Parola | Che cosa significa | Un errore frequente |
| --- | --- | --- |
| tutti, ogni (*all, every*) | nessuna eccezione | leggerla al contrario ("tutti gli A sono B" non dà "tutti i B sono A") |
| solo (*only*) | una condizione necessaria | trattarla come sufficiente ("aperto solo quando c’è un medico" non significa "aperto ogni volta che c’è un medico") |
| la maggior parte (*most*) | più della metà | leggerla come "quasi tutti" |
| alcuni (*some*) | almeno uno | leggerla come "alcuni ma non tutti" |
| nessuno (*none*) | nessuna eccezione, in negativo | dimenticare che esclude anche il contrario ("nessun A è B" dà "nessun B è A") |

"La maggior parte" ha una conseguenza utile. Se più della metà di un gruppo ha la proprietà P e più della metà ha la proprietà Q, le due metà non possono stare una accanto all’altra senza sovrapporsi: almeno un membro le ha entrambe.

### Trovare un presupposto

Un argomento va dalle prove a una conclusione. Per trovarne il presupposto, riassumi in poche parole le prove e la conclusione e guarda il vuoto tra le due: quale idea nuova compare nella conclusione senza che le prove l’abbiano mai nominata? Il presupposto collega le due parti.

Gli argomenti dei testi scientifici passano spesso da una correlazione a una causa, o da un gruppo a un altro. I presupposti tipici sono quindi:

- che nient’altro spieghi il risultato (nessun’altra causa);
- che la causa non agisca nel verso opposto;
- che il gruppo studiato somigli al gruppo di cui parla la conclusione;
- che una misura colga davvero ciò che dichiara di misurare.

### Il test della negazione

Trovato un presupposto candidato, negalo (*negation test*), cioè enuncia il suo contrario, e metti la negazione accanto all’argomento. Se l’argomento crolla, l’affermazione era un presupposto necessario. Se l’argomento resta intatto, l’affermazione non era necessaria, per quanto ragionevole sembri.

Nega con attenzione. La negazione di "tutti gli studenti bevono caffè" è "almeno uno studente non lo beve", non "nessuno studente lo beve". La negazione di "la camminata ha causato il calo" è "la camminata non ha causato il calo".

### Opzioni sbagliate frequenti

- **Troppo forte.** Un presupposto deve essere forte solo quanto serve all’argomento. "Il caffè è l’unica causa del sonno scarso" è più forte di quanto serva a un argomento sul caffè.
- **Rafforza ma non è necessaria.** Un’opzione può rendere più probabile la conclusione senza essere richiesta. Il test della negazione separa i due casi.
- **Ripete la conclusione o le prove.** Ciò che è già scritto non è un presupposto non dichiarato.
- **Fuori tema.** Un’affermazione vera su un argomento vicino.

### Un metodo

1. Decidi quale relazione chiede la domanda: affermato, inferito o presupposto.
2. Per un’inferenza, applica a ogni opzione il test del "deve essere vero".
3. Per un presupposto, individua prove, conclusione e vuoto, poi applica il test della negazione alle opzioni che riguardano quel vuoto.
`,
  examples: [
    {
      id: 'example-only-if',
      title: 'Un’inferenza da "solo"',
      problemMd: md`*Testo:* "L’allarme del congelatore del laboratorio suona solo quando la temperatura sale sopra −70 °C. Sabato notte l’allarme non ha suonato."

Che cosa ne segue: (i) "Sabato notte la temperatura non è salita sopra −70 °C", oppure (ii) "Ogni volta che la temperatura sale sopra −70 °C, l’allarme suona"?`,
      steps: [
        md`"Solo quando" dà una condizione necessaria: se l’allarme suona, la temperatura è salita sopra −70 °C.`,
        md`L’affermazione (ii) la rovescia in "se la temperatura sale, l’allarme suona". Il testo non lo dice; un allarme potrebbe non suonare anche dopo un aumento. Quindi la (ii) non è un’inferenza.`,
        md`Neppure la (i) ne segue. Il silenzio dell’allarme è compatibile con una temperatura rimasta sotto −70 °C, ma anche con un aumento che l’allarme non ha rilevato. Il testo è vero in entrambi i casi.`,
      ],
      answerMd: md`Non ne segue nessuna delle due. "Solo quando" dice che cosa deve essere successo se l’allarme suona; non dice nulla su che cosa succede quando non suona. Scegliere la (i) è l’errore allettante, perché tratta l’allarme come un segnale garantito.`,
    },
    {
      id: 'example-assumption-sanitiser',
      title: 'Il presupposto di un argomento "prima e dopo"',
      problemMd: md`*Argomento:* "A marzo sono state installate postazioni di gel igienizzante all’ingresso di ogni reparto. Le infezioni contratte in ospedale tra marzo e giugno sono state meno numerose che negli stessi mesi dell’anno scorso. Quindi le postazioni hanno ridotto le infezioni."

Che cosa presuppone l’argomento?`,
      steps: [
        md`Prove: postazioni installate, e meno infezioni dopo rispetto a un anno prima. Conclusione: le postazioni hanno causato il calo.`,
        md`Il vuoto: la conclusione indica una causa, mentre le prove mostrano solo che due cose sono avvenute nello stesso periodo.`,
        md`Presupposto candidato: nessun altro cambiamento tra i due periodi, come un numero minore di pazienti o una nuova procedura di pulizia, spiega il calo.`,
        md`Test della negazione: "un altro cambiamento spiega il calo". Se fosse vero, le postazioni potrebbero non aver fatto nulla, e l’argomento crolla. Il candidato è quindi un vero presupposto.`,
      ],
      answerMd: md`L’argomento presuppone che nient’altro spieghi il calo delle infezioni. Una scelta allettante ma sbagliata sarebbe "il personale usava le postazioni ogni volta che entrava in un reparto": rafforzerebbe l’argomento, ma la conclusione potrebbe reggere anche se il personale le usasse quasi sempre, quindi non è necessaria.`,
    },
    {
      id: 'example-most-and-most',
      title: 'Due affermazioni con "la maggior parte"',
      problemMd: md`*Testo:* "La maggior parte dei 30 studenti del gruppo ha superato la prova di biologia. La maggior parte di loro ha superato anche la prova di chimica." Almeno uno studente deve aver superato entrambe le prove?`,
      steps: [
        md`"La maggior parte" significa più della metà. Più della metà di 30 è almeno 16, quindi almeno 16 hanno superato biologia e almeno 16 hanno superato chimica.`,
        md`Se nessuno studente le avesse superate entrambe, i due gruppi sarebbero separati e insieme conterrebbero almeno $16 + 16 = 32$ studenti. Il gruppo ne ha solo 30.`,
        md`Quindi i gruppi si sovrappongono per almeno $32 - 30 = 2$ studenti.`,
      ],
      answerMd: md`Sì: almeno due studenti hanno superato entrambe le prove. Non ne segue invece che la maggior parte di chi ha superato biologia abbia superato anche chimica; la sovrapposizione potrebbe essere di soli 2.`,
    },
  ],
  traps: [
    {
      title: 'Scegliere il probabile invece del certo',
      md: md`Le domande di inferenza premiano l’opzione che deve essere vera, non quella probabilmente vera. Se riesci a immaginare il testo vero e l’opzione falsa, scarta l’opzione, per quanto sensata sembri.`,
    },
    {
      title: 'Leggere "solo" come "ogni volta che"',
      md: md`"A accade solo se B" significa che B è necessario perché accada A. Non significa che B basti perché accada A. Riscrivi le frasi con "solo se" nella forma "se A, allora B" prima di usarle.`,
    },
    {
      title: 'Scambiare un rafforzamento per il presupposto',
      md: md`Molte opzioni rendono più forte un argomento senza essere necessarie. Nega l’opzione: se l’argomento sopravvive alla negazione, l’opzione non era un presupposto.`,
    },
  ],
  check: [
    {
      id: 'check-clinic-days',
      title: 'Quando è aperto l’ambulatorio?',
      topic: 'Inferenza',
      stimulusMd: md`L’ambulatorio apre solo nei giorni in cui sono presenti sia un medico sia un infermiere. La dottoressa Bianchi è l’unico medico dell’ambulatorio, e vi lavora solo il martedì e il giovedì. Un infermiere è presente in tutti i giorni feriali.`,
      stemMd: md`Se le affermazioni precedenti sono vere, quale delle seguenti deve essere vera?`,
      options: [
        { id: 'A', text: md`L’ambulatorio è aperto ogni martedì e ogni giovedì.`, note: md`La presenza di medico e infermiere è richiesta per aprire, non ne garantisce l’apertura; "solo nei giorni in cui" dà una condizione necessaria.` },
        { id: 'B', text: md`L’ambulatorio non è mai aperto di lunedì.`, note: '' },
        { id: 'C', text: md`Gli infermieri lavorano solo nei giorni in cui l’ambulatorio è aperto.`, note: md`Un infermiere è presente tutti i giorni feriali, compresi i lunedì, quando l’ambulatorio non può aprire; questa deve essere falsa.` },
        { id: 'D', text: md`L’ambulatorio è aperto alcuni sabati.`, note: md`La dottoressa Bianchi, unico medico, non lavora mai il sabato, quindi l’ambulatorio non può mai aprire quel giorno; questa deve essere falsa.` },
        { id: 'E', text: md`La dottoressa Bianchi è in ambulatorio tutti i giorni feriali.`, note: md`Il testo dice che vi lavora solo il martedì e il giovedì; l’opzione lo contraddice.` },
      ],
      answer: 'B',
      workingMd: md`Per aprire serve un medico. L’unico medico lavora solo il martedì e il giovedì, quindi di lunedì non c’è nessun medico e l’ambulatorio non può aprire. Questo vale in ogni situazione compatibile con il testo. Nulla garantisce invece che l’ambulatorio apra nei giorni in cui sono presenti entrambi.`,
      lesson: 'Una condizione necessaria dice quando qualcosa non può accadere, mai quando deve accadere.',
    },
    {
      id: 'check-evening-coffee',
      title: 'Caffè e sonno',
      topic: 'Presupposto',
      stimulusMd: md`Un sondaggio in un’università ha rilevato che gli studenti che bevono caffè la sera dormono in media meno ore degli studenti che non lo fanno. Quindi, se gli studenti che bevono caffè la sera smettessero di farlo, dormirebbero più a lungo.`,
      stemMd: md`L’argomento precedente si basa su quale dei seguenti presupposti?`,
      options: [
        { id: 'A', text: md`Tutti gli studenti dell’università bevono caffè la sera.`, note: md`Il sondaggio confronta studenti che bevono e non bevono caffè la sera, quindi l’argomento non può richiedere che lo bevano tutti.` },
        { id: 'B', text: md`Il caffè è la bevanda più diffusa tra gli studenti.`, note: md`La diffusione non c’entra con il fatto che smettere allunghi il sonno; negandola, l’argomento resta intatto.` },
        { id: 'C', text: md`Alcuni studenti che bevono caffè la sera dormono comunque bene.`, note: md`È compatibile con il sondaggio ma non necessaria; se fosse falsa, l’argomento resterebbe intatto o diventerebbe persino più forte.` },
        { id: 'D', text: md`Il sonno più breve è causato dal caffè serale, non da qualcosa che spinge anche a berlo, come studiare fino a tardi.`, note: '' },
        { id: 'E', text: md`Il sonno conta per il rendimento agli esami.`, note: md`È esterna all’argomento, che conclude solo che gli studenti dormirebbero di più, non che renderebbero meglio.` },
      ],
      answer: 'D',
      workingMd: md`Prove: chi beve caffè la sera dorme in media meno. Conclusione: smettere di bere caffè allungherebbe il sonno. Il vuoto va da una correlazione a una causa. Nega l’opzione chiave: "il sonno più breve è causato da qualcos’altro, come studiare fino a tardi, che spinge anche a bere caffè". Allora smettere con il caffè non cambierebbe nulla, e l’argomento crolla.`,
      lesson: 'Quando un argomento passa da "va insieme a" a "causa", presuppone che nient’altro spieghi il legame.',
    },
    {
      id: 'check-volunteers-overlap',
      title: 'Maggioranze che si sovrappongono',
      topic: 'Inferenza',
      stimulusMd: md`Più della metà dei 40 volontari di uno studio era vegetariana. Più della metà dei 40 volontari faceva esercizio fisico ogni giorno.`,
      stemMd: md`Quale delle seguenti deve essere vera?`,
      options: [
        { id: 'A', text: md`Almeno un volontario era vegetariano e faceva esercizio ogni giorno.`, note: '' },
        { id: 'B', text: md`La maggior parte dei vegetariani dello studio faceva esercizio ogni giorno.`, note: md`La sovrapposizione è garantita ma può essere di soli 2 volontari su 21 o più vegetariani, quindi "la maggior parte" non ne segue.` },
        { id: 'C', text: md`Nessun volontario era sia vegetariano sia sportivo quotidiano.`, note: md`Due gruppi di almeno 21 persone non possono stare in 40 senza sovrapporsi; questa deve essere falsa.` },
        { id: 'D', text: md`Esattamente metà di chi faceva esercizio ogni giorno era vegetariana.`, note: md`Il testo non fissa un valore esatto per la sovrapposizione; molte ripartizioni diverse sono compatibili.` },
        { id: 'E', text: md`Essere vegetariani rende le persone più propense a fare esercizio ogni giorno.`, note: md`Il testo dà dei conteggi per un solo gruppo, non una causa né una tendenza generale.` },
      ],
      answer: 'A',
      workingMd: md`Più della metà di 40 significa almeno 21. Se i due gruppi non si sovrapponessero, conterrebbero almeno $21 + 21 = 42$ persone, più dei 40 volontari. Quindi almeno $42 - 40 = 2$ volontari appartengono a entrambi i gruppi, e in particolare almeno uno.`,
      lesson: 'Due gruppi che contengono ciascuno più della metà dello stesso insieme devono avere almeno un membro in comune.',
    },
  ],
  takeaways: [
    'Un’inferenza deve essere vera in ogni situazione compatibile con il testo; "probabilmente vera" non basta.',
    '"Solo se" dà una condizione necessaria: dice quando qualcosa non può accadere.',
    'Un presupposto colma il vuoto tra prove e conclusione; verificalo con il test della negazione.',
    'Due gruppi che contengono ciascuno più della metà dello stesso insieme devono sovrapporsi.',
  ],
  flashcards: [
    { front: 'Inferenza (*inference*)', back: 'Un’affermazione che deve essere vera se tutto ciò che dice il testo è vero. Deve valere in ogni situazione compatibile con il testo.' },
    { front: 'Presupposto (*assumption*)', back: 'Un’idea non dichiarata di cui un argomento ha bisogno per passare dalle prove alla conclusione.' },
    { front: 'Il test della negazione', back: 'Enuncia il contrario di un presupposto candidato. Se l’argomento allora crolla, l’affermazione era un presupposto necessario.' },
    { front: '"A solo se B"', back: 'B è necessario per A: se accade A, vale B. Non dice che B basti perché accada A.' },
    { front: '"La maggior parte" e "alcuni"', back: '"La maggior parte" significa più della metà. "Alcuni" significa almeno uno, e non esclude tutti.' },
    { front: 'Presupposto tipico di un argomento causale', back: 'Che nient’altro spieghi il risultato, e che la causa non agisca nel verso opposto.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-reading-knowledge', skill: 'imat-read-comprehension' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const generalKnowledgeHistoryAndInstitutionsLessonIt: Lesson = {
  slug: 'general-knowledge-history-and-institutions',
  title: 'Cultura generale: storia, istituzioni e cittadinanza',
  summary: 'Prepara la parte di cultura generale dell’IMAT con metodo: poche date chiave, le istituzioni della Repubblica e dell’UE, l’eliminazione per data.',
  minutes: 20,
  objectives: [
    'Mettere in ordine gli eventi principali della storia italiana ed europea moderna con poche date di riferimento.',
    'Nominare le principali istituzioni della Repubblica italiana e dell’Unione europea e dire che cosa fa ciascuna.',
    'Eliminare le opzioni per data, per funzione e per nomi facili da confondere.',
  ],
  teachMd: md`
### Che cosa chiede il programma

La prima area dell’IMAT è "Competenze di lettura e conoscenze acquisite negli studi" (*Reading skills and knowledge acquired in studies*). Il programma vi indica storia, istituzioni e cittadinanza (*history, institutions, citizenship*) accanto alla comprensione di testi in inglese, e le nostre esercitazioni descrivono la parte di conoscenze come la cultura letteraria, storica, filosofica, sociale e istituzionale della scuola superiore. L’area conta 4 quesiti in tutto, e non è indicato un numero a parte per la cultura generale.

Questa combinazione, un programma vasto e pochi quesiti, determina il modo di studiare. Non puoi imparare tutta la storia per una manciata di punti, e non serve. La strada efficiente è avere pochi fatti di riferimento sicuri e usarli per eliminare. Questa lezione ti dà quei punti fermi per i tre ambiti nominati dal programma. Ricorda che alla prova le domande sono in inglese: per questo accanto ai nomi delle istituzioni trovi anche la forma inglese.

### Una linea del tempo di date chiave

Meglio poche date imparate bene che molte imparate male. Queste bastano a collocare in ordine gran parte degli eventi della storia italiana ed europea moderna:

| Anno | Evento |
| --- | --- |
| 1789 | Inizia la Rivoluzione francese |
| 1861 | Viene proclamato il Regno d’Italia (17 marzo) |
| 1871 | Roma diventa capitale d’Italia |
| 1914–1918 | Prima guerra mondiale (l’Italia entra nel 1915) |
| 1939–1945 | Seconda guerra mondiale |
| 1945 | Nascono le Nazioni Unite |
| 1946 | Referendum del 2 giugno: gli italiani scelgono la repubblica; le donne votano per la prima volta in una consultazione nazionale |
| 1948 | Entra in vigore la Costituzione della Repubblica italiana (1° gennaio) |
| 1949 | Nasce il Consiglio d’Europa |
| 1957 | I Trattati di Roma istituiscono la Comunità economica europea (CEE) e l’Euratom |
| 1979 | Prime elezioni dirette del Parlamento europeo |
| 1989 | Cade il Muro di Berlino |
| 1992 | Viene firmato il Trattato di Maastricht, che istituisce l’Unione europea entrando in vigore nel 1993 |
| 2002 | Entrano in circolazione le banconote e le monete in euro |
| 2009 | Entra in vigore il Trattato di Lisbona |

Con queste date in mano, molte opzioni si eliminano come **anacronismi**: un’opzione che colloca la CEE prima della Costituzione italiana, o l’euro prima di Maastricht, è sbagliata senza bisogno di altro.

### La Repubblica italiana

La Costituzione è stata approvata dall’Assemblea Costituente nel dicembre 1947 ed è entrata in vigore il 1° gennaio 1948. L’articolo 1 afferma che l’Italia è una Repubblica democratica fondata sul lavoro e che la sovranità appartiene al popolo.

- **Il Parlamento** ha due Camere con uguali poteri, la Camera dei deputati (*Chamber of Deputies*) e il Senato della Repubblica (*Senate of the Republic*).
- **Il Presidente della Repubblica** (*President of the Republic*) è il capo dello Stato. È eletto dal Parlamento in seduta comune, integrato dai delegati delle regioni, e resta in carica sette anni.
- **Il Governo** è formato dal Presidente del Consiglio dei ministri (*President of the Council of Ministers*) e dai ministri, e deve avere la fiducia di entrambe le Camere.
- **La Corte costituzionale** (*Constitutional Court*) giudica se le leggi sono conformi alla Costituzione.
- I cittadini possono anche chiedere un **referendum abrogativo** per abrogare una legge, in tutto o in parte; la richiesta deve venire da 500.000 elettori o da cinque Consigli regionali.

Non confondere il Presidente della Repubblica (capo dello Stato) con il Presidente del Consiglio dei ministri (capo del Governo).

### L’Unione europea

L’UE ha sette istituzioni. Imparale con le loro funzioni, perché le domande spesso dipendono da chi fa che cosa:

| Istituzione | Che cosa fa |
| --- | --- |
| Parlamento europeo (*European Parliament*) | Eletto direttamente dai cittadini dell’UE; adotta le leggi insieme al Consiglio dell’UE |
| Consiglio europeo (*European Council*) | I capi di Stato o di governo; definisce l’indirizzo politico generale dell’UE, ma non approva leggi |
| Consiglio dell’Unione europea (*Council of the European Union*) | I ministri degli Stati membri; adotta le leggi insieme al Parlamento |
| Commissione europea (*European Commission*) | Propone le nuove leggi e vigila sull’applicazione dei trattati |
| Corte di giustizia dell’Unione europea (*Court of Justice of the European Union*) | Garantisce che il diritto dell’UE sia interpretato e applicato allo stesso modo ovunque; ha sede a Lussemburgo |
| Banca centrale europea (*European Central Bank*) | Conduce la politica monetaria dell’area dell’euro; ha sede a Francoforte |
| Corte dei conti europea (*European Court of Auditors*) | Controlla le finanze dell’UE |

Nella procedura legislativa ordinaria la Commissione presenta la proposta, e il Parlamento e il Consiglio dell’UE la adottano.

Il **Consiglio d’Europa** (*Council of Europe*) non è affatto un’istituzione dell’UE. È un’organizzazione distinta, nata nel 1949 con sede a Strasburgo, responsabile della Convenzione europea dei diritti dell’uomo. La Corte europea dei diritti dell’uomo (*European Court of Human Rights*) appartiene a essa.

### Cittadinanza

La Costituzione stabilisce diritti e doveri. L’articolo 3 afferma che tutti i cittadini hanno pari dignità sociale e sono eguali davanti alla legge, senza distinzione di sesso, di razza, di lingua, di religione, di opinioni politiche, di condizioni personali e sociali. L’articolo 48 definisce il voto personale ed eguale, libero e segreto, e il suo esercizio un dovere civico.

Ogni cittadino di uno Stato membro è anche cittadino dell’Unione europea. La cittadinanza europea, introdotta dal Trattato di Maastricht, si aggiunge a quella nazionale e non la sostituisce. Comprende il diritto di circolare e soggiornare liberamente nell’UE, e il diritto di votare e candidarsi alle elezioni del Parlamento europeo e alle elezioni comunali nello Stato membro in cui si risiede.

### Come rispondere

1. **Data le opzioni.** Colloca ogni opzione sulla tua linea del tempo; ciò che è fuori ordine si scarta.
2. **Controlla la funzione.** Chi propone, chi decide, chi giudica? Abbina l’azione all’istituzione.
3. **Attenzione ai nomi.** Consiglio europeo, Consiglio dell’UE e Consiglio d’Europa sono tre organi diversi; Presidente della Repubblica e Presidente del Consiglio dei ministri sono due cariche diverse.
`,
  examples: [
    {
      id: 'example-anachronism',
      title: 'Eliminare per data',
      problemMd: md`Questa affermazione è vera? "Quando è entrata in vigore la Costituzione della Repubblica italiana, l’Italia era già membro della Comunità economica europea."`,
      steps: [
        md`Data il primo evento: la Costituzione è entrata in vigore il 1° gennaio 1948.`,
        md`Data il secondo: la CEE è stata istituita dai Trattati di Roma nel 1957.`,
        md`Il 1957 viene dopo il 1948, quindi quando la Costituzione è entrata in vigore la CEE non esisteva ancora.`,
      ],
      answerMd: md`Falsa. Non servono conoscenze dettagliate: due date di riferimento mostrano che l’affermazione è un anacronismo. L’errore allettante è pensare che la repubblica del dopoguerra e la Comunità europea siano nate insieme.`,
    },
    {
      id: 'example-who-proposes',
      title: 'Abbinare un’azione a un’istituzione',
      problemMd: md`Nella procedura legislativa ordinaria, un nuovo regolamento dell’UE viene proposto e poi adottato. Quale istituzione lo propone, e quali lo adottano?`,
      steps: [
        md`Il potere di proposta spetta alla Commissione europea.`,
        md`L’adozione è condivisa dalle due istituzioni che legiferano insieme: il Parlamento europeo e il Consiglio dell’Unione europea (i ministri).`,
        md`Il Consiglio europeo, formato dai capi di Stato o di governo, definisce l’indirizzo politico ma non approva leggi, quindi non fa parte della risposta.`,
      ],
      answerMd: md`La Commissione propone; il Parlamento e il Consiglio dell’UE adottano. Indicare il Consiglio europeo come legislatore è l’errore abituale, dovuto al nome simile.`,
    },
    {
      id: 'example-strasbourg-court',
      title: 'Quale corte europea?',
      problemMd: md`Un cittadino presenta un ricorso sostenendo che uno Stato ha violato la Convenzione europea dei diritti dell’uomo. A quale corte si rivolge, e a quale organizzazione appartiene?`,
      steps: [
        md`La Convenzione europea dei diritti dell’uomo appartiene al Consiglio d’Europa, un’organizzazione distinta dall’UE.`,
        md`La sua corte è la Corte europea dei diritti dell’uomo, a Strasburgo.`,
        md`La Corte di giustizia dell’UE, a Lussemburgo, si occupa del diritto dell’UE, quindi qui è la corte sbagliata.`,
      ],
      answerMd: md`La Corte europea dei diritti dell’uomo, che fa parte del Consiglio d’Europa. Scegliere la Corte di giustizia dell’UE significa confondere due organizzazioni diverse.`,
    },
  ],
  traps: [
    {
      title: 'Tre consigli dai nomi simili',
      md: md`Il Consiglio europeo (capi di Stato o di governo), il Consiglio dell’Unione europea (ministri) e il Consiglio d’Europa (un’organizzazione distinta per i diritti umani) vengono confusi di continuo. Impara una funzione per ciascuno e verifica le opzioni su quella.`,
    },
    {
      title: '1946 o 1948?',
      md: md`Il referendum che scelse la repubblica si tenne il 2 giugno 1946; la Costituzione entrò in vigore il 1° gennaio 1948. È facile cadere in un’opzione che scambia le due date o le tratta come un unico evento.`,
    },
    {
      title: 'Due presidenti',
      md: md`Il Presidente della Repubblica è il capo dello Stato, eletto dal Parlamento per sette anni. Il Presidente del Consiglio dei ministri guida il Governo, che ha bisogno della fiducia di entrambe le Camere. Leggi quale dei due nomina la domanda.`,
    },
  ],
  check: [
    {
      id: 'check-eu-initiative',
      title: 'Proporre le leggi dell’UE',
      topic: 'Istituzioni',
      stemMd: md`Nella procedura legislativa ordinaria dell’Unione europea, quale istituzione propone la nuova legislazione?`,
      options: [
        { id: 'A', text: md`Il Parlamento europeo`, note: md`Il Parlamento adotta la legislazione insieme al Consiglio dell’UE, ma la proposta viene da un’altra istituzione.` },
        { id: 'B', text: md`Il Consiglio dell’Unione europea`, note: md`Il Consiglio dell’UE adotta la legislazione insieme al Parlamento; non presenta la proposta.` },
        { id: 'C', text: md`La Commissione europea`, note: '' },
        { id: 'D', text: md`Il Consiglio europeo`, note: md`Il Consiglio europeo definisce l’indirizzo politico generale e non approva leggi; il suo nome si confonde facilmente con quello del Consiglio dell’UE.` },
        { id: 'E', text: md`La Corte di giustizia dell’Unione europea`, note: md`La Corte interpreta il diritto dell’UE e ne garantisce l’applicazione uniforme; non propone leggi.` },
      ],
      answer: 'C',
      workingMd: md`Nella procedura legislativa ordinaria la Commissione propone, e il Parlamento europeo e il Consiglio dell’Unione europea adottano. Il Consiglio europeo e la Corte non hanno alcun ruolo nella proposta delle leggi.`,
      lesson: 'Abbina l’azione all’istituzione: la Commissione propone, il Parlamento e il Consiglio dell’UE adottano.',
    },
    {
      id: 'check-between-1945-1957',
      title: 'Tra due date',
      topic: 'Storia',
      stemMd: md`Quale di questi eventi è avvenuto dopo la fine della seconda guerra mondiale e prima della firma dei Trattati di Roma?`,
      options: [
        { id: 'A', text: md`È entrata in vigore la Costituzione della Repubblica italiana.`, note: '' },
        { id: 'B', text: md`È stato proclamato il Regno d’Italia.`, note: md`Avvenne nel 1861, molto prima della seconda guerra mondiale.` },
        { id: 'C', text: md`Si sono tenute le prime elezioni dirette del Parlamento europeo.`, note: md`Si tennero nel 1979, più di vent’anni dopo i Trattati di Roma.` },
        { id: 'D', text: md`È stato firmato il Trattato di Maastricht.`, note: md`Fu firmato nel 1992, ben dopo il 1957.` },
        { id: 'E', text: md`Sono entrate in circolazione le banconote e le monete in euro.`, note: md`Avvenne nel 2002, dopo il Trattato di Maastricht, non negli anni del dopoguerra.` },
      ],
      answer: 'A',
      workingMd: md`La finestra va dal 1945 al 1957. Data ogni opzione: 1948 (la Costituzione), 1861, 1979, 1992 e 2002. Solo il 1948 cade al suo interno.`,
      lesson: 'Metti prima una data su ogni opzione; gli anacronismi si eliminano da soli.',
    },
    {
      id: 'check-president-election',
      title: 'Eleggere il capo dello Stato',
      topic: 'Istituzioni',
      stemMd: md`Come viene eletto il Presidente della Repubblica italiana?`,
      options: [
        { id: 'A', text: md`Direttamente dai cittadini, per un mandato di cinque anni`, note: md`Il Presidente non è eletto dai cittadini, e il mandato dura sette anni, non cinque.` },
        { id: 'B', text: md`Dal Parlamento in seduta comune, integrato dai delegati delle regioni, per un mandato di sette anni`, note: '' },
        { id: 'C', text: md`Dal solo Senato della Repubblica, per un mandato di sette anni`, note: md`La durata è giusta, ma votano insieme entrambe le Camere, con i delegati regionali; il Senato non elegge da solo.` },
        { id: 'D', text: md`Dalla Corte costituzionale, per un mandato di nove anni`, note: md`La Corte costituzionale giudica la conformità delle leggi alla Costituzione; non elegge il capo dello Stato.` },
        { id: 'E', text: md`Dal Consiglio dei ministri, per la durata del Governo`, note: md`Il Consiglio dei ministri è il Governo; ha bisogno della fiducia del Parlamento e non sceglie il capo dello Stato.` },
      ],
      answer: 'B',
      workingMd: md`Il Presidente della Repubblica è eletto dal Parlamento in seduta comune, con i delegati delle regioni, e resta in carica sette anni. Le altre opzioni indicano l’organo sbagliato o la durata sbagliata.`,
      lesson: 'Capo dello Stato: il Presidente della Repubblica, eletto dal Parlamento con i delegati regionali per sette anni.',
    },
  ],
  takeaways: [
    'Impara una breve linea del tempo di date chiave e usala per eliminare gli anacronismi.',
    'La Costituzione è entrata in vigore il 1° gennaio 1948, dopo il referendum del 2 giugno 1946.',
    'Leggi dell’UE: la Commissione propone, il Parlamento e il Consiglio dell’UE adottano.',
    'Il Consiglio d’Europa e la sua Corte dei diritti dell’uomo non fanno parte dell’UE.',
  ],
  flashcards: [
    { front: 'Entrata in vigore della Costituzione italiana', back: '1° gennaio 1948. Era stata approvata dall’Assemblea Costituente nel dicembre 1947.' },
    { front: 'Referendum del 2 giugno 1946', back: 'Gli italiani scelsero la repubblica invece della monarchia; le donne votarono per la prima volta in una consultazione nazionale.' },
    { front: 'Presidente della Repubblica italiana', back: 'Capo dello Stato, eletto dal Parlamento in seduta comune con i delegati delle regioni, per sette anni.' },
    { front: 'Chi propone e chi adotta le leggi dell’UE?', back: 'La Commissione europea propone; il Parlamento europeo e il Consiglio dell’UE adottano.' },
    { front: 'Consiglio europeo (*European Council*)', back: 'I capi di Stato o di governo degli Stati membri. Definisce l’indirizzo politico generale dell’UE ma non approva leggi.' },
    { front: 'Consiglio d’Europa (*Council of Europe*)', back: 'Un’organizzazione distinta dall’UE, nata nel 1949 con sede a Strasburgo; la Corte europea dei diritti dell’uomo appartiene a essa.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-reading-knowledge', skill: 'imat-read-general-knowledge' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};
