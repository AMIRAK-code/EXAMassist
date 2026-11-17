import { md, type Lesson } from '../../../types';

/**
 * IMAT, chimica, seconda parte (versione italiana di content/imat/chemistry-2.ts):
 * soluzioni, cinetica ed equilibrio, acidi e basi, redox e chimica organica.
 */

export const solutionsAndConcentrationLessonIt: Lesson = {
  slug: 'solutions-and-concentration',
  title: 'Soluzioni, concentrazione e proprietà colligative',
  summary: md`Molarità, diluizioni e molalità; prevedere punto di ebollizione, punto di congelamento e osmosi contando le particelle disciolte.`,
  minutes: 20,
  objectives: [
    md`Calcolare la molarità da una massa e un volume, e la nuova concentrazione dopo una diluizione.`,
    md`Distinguere molarità e molalità e capire quando la differenza conta.`,
    md`Ordinare soluzioni per punto di ebollizione, punto di congelamento o pressione osmotica contando le particelle disciolte.`,
    md`Prevedere in che verso si sposta l'acqua attraverso una membrana e che cosa succede a una cellula immersa in una soluzione.`,
  ],
  teachMd: md`
### Che cos'è una soluzione

Una soluzione è una miscela omogenea: un **soluto** disciolto in un **solvente**. Negli organismi viventi il solvente è l'acqua, quindi le soluzioni che si incontrano in biologia e in medicina sono acquose. La concentrazione indica quanto soluto è presente in una certa quantità di soluzione o di solvente, e si può esprimere in diversi modi. Ognuno risponde a una domanda leggermente diversa: leggete con attenzione quale usa il problema.

### Molarità: moli per litro di soluzione

$$c = \frac{n}{V}$$

La molarità (*molarity*) $c$ è la quantità di soluto $n$ in moli divisa per il volume della **soluzione** $V$ in litri; si misura in mol/L (spesso scritto M). Se è data la massa, convertitela prima con $n = \frac{m}{M}$. Per esempio, $5{,}85\ \text{g}$ di $\mathrm{NaCl}$ ($M = 58{,}5\ \text{g/mol}$) corrispondono a $0{,}100\ \text{mol}$; sciolti e portati a $500\ \text{mL}$, danno $\frac{0{,}100}{0{,}500} = 0{,}200\ \text{mol/L}$.

Altre due misure sono comuni. La concentrazione in massa si esprime in grammi per litro. La percentuale massa/volume (m/V) indica i grammi in $100\ \text{mL}$: una soluzione fisiologica allo $0{,}9\%$ m/V contiene $0{,}9\ \text{g}$ di $\mathrm{NaCl}$ ogni $100\ \text{mL}$, cioè $9\ \text{g/L}$.

### La diluizione conserva le moli

Aggiungendo solvente cambia il volume ma non la quantità di soluto. Le moli prima sono uguali alle moli dopo:

$$c_1 V_1 = c_2 V_2$$

Si può usare qualsiasi unità di volume, purché sia la stessa nei due membri. Quando si mescolano due soluzioni dello stesso soluto, si sommano le moli e si sommano i volumi (per soluzioni acquose diluite i volumi si considerano additivi), poi si divide.

### Molalità: moli per chilogrammo di solvente

$$b = \frac{n_{\text{soluto}}}{m_{\text{solvente}}}$$

La molalità (*molality*) $b$ si misura in mol/kg, e la massa è quella del solo **solvente**. Sciogliendo $0{,}50\ \text{mol}$ di soluto in $2{,}0\ \text{kg}$ d'acqua si ottiene $0{,}25\ \text{mol/kg}$. Poiché le masse non cambiano con la temperatura, nemmeno la molalità cambia; la molarità invece varia un poco, perché un liquido si dilata quando si scalda. Nelle soluzioni acquose diluite un litro di soluzione contiene quasi esattamente un chilogrammo d'acqua, quindi le due misure sono quasi uguali.

### Le proprietà colligative contano le particelle

Quattro proprietà di una soluzione dipendono da **quante** particelle di soluto sono disciolte, non da quali siano: l'abbassamento della tensione di vapore, l'innalzamento del punto di ebollizione, l'abbassamento del punto di congelamento e la pressione osmotica. Sono le proprietà colligative (*colligative properties*). Le particelle disciolte riducono la tendenza delle molecole di solvente a passare nel vapore, quindi la soluzione va scaldata di più prima di bollire; inoltre ostacolano l'ordinamento del solvente in un solido, quindi va raffreddata di più prima di congelare.

Conta la concentrazione delle particelle. Un soluto ionico si scinde in ioni, e il **fattore di van 't Hoff** $i$ è il numero di particelle per unità formula:

| Soluto | Particelle in acqua | $i$ (ideale) |
| --- | --- | --- |
| glucosio, urea, saccarosio | le molecole restano intere | 1 |
| $\mathrm{NaCl}$, $\mathrm{KNO_3}$ | 2 ioni | 2 |
| $\mathrm{CaCl_2}$, $\mathrm{Na_2SO_4}$ | 3 ioni | 3 |

I fattori misurati sono un po' più bassi nelle soluzioni concentrate, dove gli ioni si appaiano, ma negli esercizi si usa il conteggio ideale. Le variazioni di temperatura sono

$$\Delta T_b = i\,K_b\,b \qquad \Delta T_f = i\,K_f\,b$$

dove per l'acqua la costante ebullioscopica è $K_b = 0{,}51\ \text{K kg/mol}$ e quella crioscopica $K_f = 1{,}86\ \text{K kg/mol}$. Spesso le costanti non servono affatto: per ordinare delle soluzioni basta confrontare $i \times b$.

### Osmosi e pressione osmotica

Una membrana semipermeabile lascia passare l'acqua ma non il soluto. L'acqua si sposta allora per **osmosi** dal lato con la concentrazione di particelle più bassa a quello con la concentrazione più alta. La pressione osmotica (*osmotic pressure*) è la pressione necessaria per fermare questo flusso:

$$\Pi = i\,c\,R\,T$$

con $c$ in mol/L, $R = 0{,}0821\ \text{L atm/(mol K)}$ e $T$ in kelvin. Il prodotto $i \times c$ è l'**osmolarità**, la concentrazione delle particelle.

Le cellule mostrano che cosa significa. Una soluzione con la stessa concentrazione di particelle del citoplasma è **isotonica**, e la cellula mantiene il suo volume; la fisiologica allo $0{,}9\%$ m/V è isotonica con il sangue. In una soluzione **ipotonica** (meno particelle all'esterno) l'acqua entra e un globulo rosso si gonfia e può scoppiare (emolisi, *haemolysis*). In una soluzione **ipertonica** (più particelle all'esterno) l'acqua esce e la cellula raggrinzisce (crenazione, *crenation*).

### Tenere semplici i conti

Nessuna norma dell'IMAT consente la calcolatrice, quindi scegliete unità che tengano i numeri piccoli. Le millimoli per millilitro equivalgono alle moli per litro: $25\ \text{mL}$ di una soluzione $0{,}40\ \text{mol/L}$ contengono $10\ \text{mmol}$ senza alcuna conversione. Arrotondate $R \times T$ a temperatura ambiente o corporea a un valore comodo e stimate prima di calcolare.
`,
  examples: [
    {
      id: 'example-make-and-dilute',
      title: 'Preparare una soluzione e poi diluirla',
      problemMd: md`$4{,}0\ \text{g}$ di $\mathrm{NaOH}$ ($M = 40\ \text{g/mol}$) vengono sciolti in acqua e portati a $250\ \text{mL}$. Poi $25{,}0\ \text{mL}$ di questa soluzione vengono diluiti con acqua fino a $100\ \text{mL}$. Qual è la concentrazione della soluzione diluita?`,
      steps: [
        md`Convertite la massa in moli: $n = \frac{4{,}0}{40} = 0{,}10\ \text{mol}$.`,
        md`Dividete per il volume in litri: $c_1 = \frac{0{,}10}{0{,}250} = 0{,}40\ \text{mol/L}$.`,
        md`La diluizione conserva le moli, quindi $c_2 = \frac{c_1 V_1}{V_2} = \frac{0{,}40 \times 25{,}0}{100} = 0{,}10\ \text{mol/L}$.`,
        md`Verifica con le moli: $25{,}0\ \text{mL}$ di soluzione $0{,}40\ \text{mol/L}$ contengono $10\ \text{mmol}$; $10\ \text{mmol}$ in $100\ \text{mL}$ fanno $0{,}10\ \text{mmol/mL} = 0{,}10\ \text{mol/L}$.`,
      ],
      answerMd: md`La soluzione diluita è $0{,}10\ \text{mol/L}$. Dividere $0{,}10\ \text{mol}$ per $250$ invece che per $0{,}250$ dà $0{,}0004\ \text{mol/L}$, mille volte troppo poco: il volume va espresso in litri.`,
    },
    {
      id: 'example-lowest-freezing-point',
      title: 'Quale soluzione congela più in basso?',
      problemMd: md`Si preparano tre soluzioni acquose: glucosio $0{,}20\ \text{mol/kg}$, $\mathrm{NaCl}$ $0{,}15\ \text{mol/kg}$ e $\mathrm{CaCl_2}$ $0{,}08\ \text{mol/kg}$. Quale ha il punto di congelamento più basso, e circa quanto vale? ($K_f = 1{,}86\ \text{K kg/mol}$ per l'acqua.)`,
      steps: [
        md`Il punto di congelamento si abbassa in proporzione alla molalità delle **particelle**, $i \times b$: calcolatela per ciascuna.`,
        md`Glucosio: $1 \times 0{,}20 = 0{,}20$. Cloruro di sodio: $2 \times 0{,}15 = 0{,}30$. Cloruro di calcio: $3 \times 0{,}08 = 0{,}24\ \text{mol/kg}$ di particelle.`,
        md`La molalità di particelle più alta, $0{,}30\ \text{mol/kg}$, dà l'abbassamento maggiore: $\Delta T_f = 1{,}86 \times 0{,}30 = 0{,}558 \approx 0{,}56\ \text{K}$.`,
        md`L'acqua pura congela a $0\ ^\circ\text{C}$, quindi questa soluzione congela a circa $-0{,}56\ ^\circ\text{C}$.`,
      ],
      answerMd: md`La soluzione di $\mathrm{NaCl}$ congela più in basso, a circa $-0{,}56\ ^\circ\text{C}$. Il glucosio è la scelta tentatrice perché la sua molalità, $0{,}20$, è il numero più grande dato, ma non si dissocia; il cloruro di calcio forma più ioni per unità formula ma è il meno concentrato.`,
    },
    {
      id: 'example-osmosis-direction',
      title: 'In che verso si sposta l\'acqua?',
      problemMd: md`Una membrana permeabile solo all'acqua separa glucosio $0{,}10\ \text{mol/L}$ (lato 1) da $\mathrm{NaCl}$ $0{,}10\ \text{mol/L}$ (lato 2) a $300\ \text{K}$. In che verso scorre l'acqua, e qual è la differenza di pressione osmotica fra i due lati? Usate $R = 0{,}082\ \text{L atm/(mol K)}$.`,
      steps: [
        md`Confrontate le concentrazioni di particelle, non di soluto: il lato 1 ha $0{,}10\ \text{mol/L}$ di particelle, il lato 2 ne ha $2 \times 0{,}10 = 0{,}20\ \text{mol/L}$.`,
        md`L'acqua si sposta verso la concentrazione di particelle più alta, quindi passa dal lato 1 (glucosio) al lato 2 (sale).`,
        md`La differenza di pressione nasce dalla differenza di concentrazione di particelle, $0{,}10\ \text{mol/L}$: $\Delta\Pi = 0{,}10 \times 0{,}082 \times 300$.`,
        md`Calcolate in un ordine comodo: $0{,}082 \times 300 = 24{,}6$, e $0{,}10 \times 24{,}6 = 2{,}46 \approx 2{,}5\ \text{atm}$.`,
      ],
      answerMd: md`L'acqua passa dal lato del glucosio a quello del sale, e le pressioni osmotiche differiscono di circa $2{,}5\ \text{atm}$. Rispondere «nessun flusso, sono entrambe $0{,}10\ \text{mol/L}$» è la trappola: l'osmosi conta le particelle, e $\mathrm{NaCl}$ ne dà due per unità formula.`,
    },
  ],
  traps: [
    {
      title: 'Usare il volume del solvente per la molarità',
      md: md`La molarità divide per il volume della **soluzione** finita. «Sciolto in $250\ \text{mL}$ d'acqua» e «portato a $250\ \text{mL}$» in linea di principio non coincidono; la molalità, invece, usa solo la massa del solvente. Controllate quale grandezza richiede la formula prima di dividere.`,
    },
    {
      title: 'Dimenticare che i soluti ionici si dissociano',
      md: md`Una proprietà colligativa conta le particelle. $\mathrm{CaCl_2}$ $0{,}1\ \text{mol/L}$ ha un effetto tre volte maggiore del glucosio $0{,}1\ \text{mol/L}$. Moltiplicate per $i$ prima di confrontare; dimenticarlo è il motivo abituale per cui si sceglie l'opzione con glucosio o urea.`,
    },
    {
      title: 'Dare il volume d\'acqua invece del volume di soluzione madre',
      md: md`Un esercizio sulle diluizioni può chiedere quanta soluzione concentrata prelevare oppure quanta acqua aggiungere. $c_1 V_1 = c_2 V_2$ dà il volume di soluzione madre; l'acqua aggiunta è il volume finale meno quello. Rileggete la domanda prima di scegliere.`,
    },
    {
      title: 'Mandare l\'acqua nel verso sbagliato',
      md: md`L'acqua si sposta verso il lato con **più** particelle disciolte, come per diluirlo. Una cellula in soluzione ipertonica perde acqua e raggrinzisce; in una ipotonica acquista acqua e si gonfia. Dire «l'acqua va dove c'è più acqua» è corretto ma facile da rovesciare: ragionate sulle particelle.`,
    },
  ],
  check: [
    {
      id: 'check-stock-volume',
      title: 'Volume di soluzione madre per una diluizione',
      topic: 'Soluzioni e concentrazione',
      stemMd: md`Un tecnico deve preparare $500\ \text{mL}$ di acido cloridrico $0{,}30\ \text{mol/L}$ e dispone di una soluzione madre $2{,}0\ \text{mol/L}$. Quale volume di soluzione madre deve diluire?`,
      options: [
        { id: 'A', text: md`$75\ \text{mL}$`, note: '' },
        { id: 'B', text: md`$150\ \text{mL}$`, note: md`È $0{,}30 \times 500$, la quantità di acido in millimoli; va ancora divisa per la concentrazione della soluzione madre, $2{,}0$.` },
        { id: 'C', text: md`$425\ \text{mL}$`, note: md`È il volume d'acqua da aggiungere, $500 - 75$, non il volume di soluzione madre richiesto.` },
        { id: 'D', text: md`$575\ \text{mL}$`, note: md`Aggiunge la soluzione madre a $500\ \text{mL}$ d'acqua; ma $500\ \text{mL}$ è il volume finale della soluzione diluita, non l'acqua.` },
        { id: 'E', text: md`Circa $3{,}3\ \text{L}$`, note: md`Il rapporto è capovolto ($2{,}0 \times 500 / 0{,}30$): una soluzione diluita richiede meno soluzione madre del suo volume finale, mai di più.` },
      ],
      answer: 'A',
      workingMd: md`Moli necessarie: $0{,}30 \times 0{,}500 = 0{,}15\ \text{mol}$. Volume di soluzione madre che le contiene: $\frac{0{,}15}{2{,}0} = 0{,}075\ \text{L} = 75\ \text{mL}$. Lo stesso con $c_1 V_1 = c_2 V_2$: $V_1 = \frac{0{,}30 \times 500}{2{,}0} = 75\ \text{mL}$, da portare a $500\ \text{mL}$ con acqua.`,
      lesson: md`In una diluizione le moli di soluto sono fisse: ricavatele dalla soluzione da preparare, poi trovate il volume di soluzione madre che le contiene.`,
    },
    {
      id: 'check-highest-boiling-point',
      title: 'Il punto di ebollizione più alto',
      topic: 'Proprietà colligative',
      stemMd: md`Quale di queste soluzioni acquose ha il punto di ebollizione più alto?`,
      options: [
        { id: 'A', text: md`glucosio $0{,}10\ \text{mol/kg}$`, note: md`Il glucosio non si dissocia, quindi dà solo $0{,}10\ \text{mol/kg}$ di particelle, il valore più basso.` },
        { id: 'B', text: md`$\mathrm{KCl}$ $0{,}10\ \text{mol/kg}$`, note: md`$\mathrm{KCl}$ dà due ioni, $0{,}20\ \text{mol/kg}$ di particelle, meno di $0{,}24$.` },
        { id: 'C', text: md`$\mathrm{MgCl_2}$ $0{,}08\ \text{mol/kg}$`, note: '' },
        { id: 'D', text: md`saccarosio $0{,}20\ \text{mol/kg}$`, note: md`È la molalità più alta dell'elenco, ma il saccarosio resta in molecole intere: $0{,}20\ \text{mol/kg}$ di particelle, meno di $0{,}24$.` },
        { id: 'E', text: md`urea $0{,}12\ \text{mol/kg}$`, note: md`L'urea non è un elettrolita, quindi la sua molalità di particelle è solo $0{,}12\ \text{mol/kg}$.` },
      ],
      answer: 'C',
      workingMd: md`L'innalzamento ebullioscopico è proporzionale a $i \times b$. Glucosio $0{,}10$; cloruro di potassio $2 \times 0{,}10 = 0{,}20$; cloruro di magnesio $3 \times 0{,}08 = 0{,}24$; saccarosio $0{,}20$; urea $0{,}12$. La molalità di particelle più alta, $0{,}24\ \text{mol/kg}$ del cloruro di magnesio, innalza di più il punto di ebollizione.`,
      lesson: md`Ordinate gli effetti colligativi per concentrazione di particelle: moltiplicate ogni molalità per il numero di particelle per unità formula.`,
    },
    {
      id: 'check-red-cells-saline',
      title: 'Globuli rossi in soluzione salina',
      topic: 'Soluzioni e osmosi',
      stemMd: md`I globuli rossi sono isotonici con $\mathrm{NaCl}$ $0{,}15\ \text{mol/L}$. Che cosa succede se vengono posti in $\mathrm{NaCl}$ $0{,}30\ \text{mol/L}$?`,
      options: [
        { id: 'A', text: md`Si gonfiano e possono scoppiare, perché l'acqua entra.`, note: md`Questo succede in una soluzione ipotonica; $\mathrm{NaCl}$ $0{,}30\ \text{mol/L}$ ha più particelle delle cellule, quindi è ipertonica.` },
        { id: 'B', text: md`Raggrinziscono, perché l'acqua esce per osmosi.`, note: '' },
        { id: 'C', text: md`Nulla, perché la soluzione è isotonica con le cellule.`, note: md`Isotonica è $\mathrm{NaCl}$ $0{,}15\ \text{mol/L}$; questa soluzione ha il doppio della concentrazione di particelle.` },
        { id: 'D', text: md`Raggrinziscono, perché gli ioni sodio e cloruro entrano nelle cellule.`, note: md`L'esito è giusto ma la causa è sbagliata: nell'osmosi si sposta l'acqua, che esce dalle cellule verso l'esterno più concentrato.` },
        { id: 'E', text: md`Si gonfiano, perché il sale entra per diffusione e richiama acqua.`, note: md`Tratta la membrana come permeabile al sale; con il soluto trattenuto, l'acqua esce dalle cellule e queste raggrinziscono.` },
      ],
      answer: 'B',
      workingMd: md`$\mathrm{NaCl}$ $0{,}30\ \text{mol/L}$ contiene $0{,}60\ \text{mol/L}$ di ioni, il doppio della concentrazione di particelle della soluzione isotonica $0{,}15\ \text{mol/L}$ (che ne contiene $0{,}30$). L'esterno è ipertonico, quindi l'acqua esce dalle cellule per osmosi e queste raggrinziscono (crenazione).`,
      lesson: md`Confrontate le concentrazioni di particelle dentro e fuori: l'acqua si sposta sempre verso il lato con più particelle.`,
    },
  ],
  takeaways: [
    md`La molarità è $c = \frac{n}{V}$, con $V$ il volume della soluzione in litri; la molalità è in moli per chilogrammo di solvente.`,
    md`La diluizione conserva le moli: $c_1 V_1 = c_2 V_2$.`,
    md`Le proprietà colligative dipendono dal numero di particelle disciolte: moltiplicate la concentrazione per il fattore di van 't Hoff prima di confrontare.`,
    md`Per osmosi l'acqua va verso la concentrazione di particelle più alta; le cellule si gonfiano in soluzione ipotonica e raggrinziscono in soluzione ipertonica.`,
  ],
  flashcards: [
    { front: 'Molarità', back: md`Moli di soluto per litro di soluzione: $c = \frac{n}{V}$, in mol/L.` },
    { front: 'Regola della diluizione', back: md`$c_1 V_1 = c_2 V_2$: aggiungere solvente cambia il volume ma non le moli di soluto.` },
    { front: 'Molalità', back: md`Moli di soluto per chilogrammo di solvente. Non cambia con la temperatura, perché le masse non cambiano.` },
    { front: md`Fattore di van 't Hoff`, back: md`Il numero di particelle che un'unità formula dà in soluzione: glucosio 1, $\mathrm{NaCl}$ 2, $\mathrm{CaCl_2}$ 3.` },
    { front: md`Verso dell'osmosi`, back: md`L'acqua attraversa una membrana semipermeabile dal lato con meno particelle disciolte a quello con più particelle.` },
    { front: 'Globulo rosso in soluzione ipotonica', back: md`L'acqua entra nella cellula, che si gonfia e può scoppiare (emolisi). In soluzione ipertonica raggrinzisce (crenazione).` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-stoichiometry' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const kineticsAndChemicalEquilibriumLessonIt: Lesson = {
  slug: 'kinetics-and-chemical-equilibrium',
  title: 'Velocità di reazione ed equilibrio chimico',
  summary: md`Che cosa accelera una reazione, la legge cinetica ricavata dai dati, la costante di equilibrio e gli spostamenti secondo Le Châtelier.`,
  minutes: 22,
  objectives: [
    md`Spiegare con la teoria degli urti l'effetto di concentrazione, temperatura, superficie e catalizzatori.`,
    md`Ricavare gli ordini di reazione da dati sperimentali e usare la legge cinetica per prevedere una nuova velocità.`,
    md`Scrivere una costante di equilibrio, confrontarla con il quoziente di reazione e prevedere il verso della trasformazione.`,
    md`Prevedere come cambiamenti di concentrazione, pressione, temperatura e catalizzatori agiscono su un equilibrio e sulla sua costante.`,
  ],
  teachMd: md`
### Velocità: quanto in fretta cambiano le concentrazioni

La velocità di una reazione (*reaction rate*) è la variazione di concentrazione di un reagente o di un prodotto nell'unità di tempo, di solito in mol/(L s). È massima all'inizio e diminuisce man mano che i reagenti si consumano. La cinetica chiede **quanto in fretta** procede una reazione; l'equilibrio, più avanti, chiede **fin dove** arriva. Tenete separate le due domande: una reazione può essere molto spostata verso i prodotti ed essere comunque lentissima.

### Teoria degli urti ed energia di attivazione

Le particelle che reagiscono devono urtarsi con energia sufficiente e con un orientamento adatto. L'energia minima è l'**energia di attivazione** (*activation energy*) $E_a$, l'altezza della barriera fra reagenti e prodotti in un profilo energetico. Ogni fattore che modifica la velocità agisce attraverso questi urti:

| Variazione | Perché la velocità aumenta |
| --- | --- |
| concentrazione (o pressione di un gas) più alta | più urti al secondo |
| maggiore superficie di un solido | più particelle esposte agli urti |
| temperatura più alta | una frazione molto maggiore di urti ha almeno $E_a$; gli urti diventano anche più frequenti, un effetto minore |
| catalizzatore | un percorso alternativo con $E_a$ più bassa |

Un catalizzatore (*catalyst*) non si consuma. Nel profilo energetico abbassa il picco, ma lascia invariate le energie di reagenti e prodotti, e quindi anche $\Delta H$. Poiché abbassa della stessa quantità anche la barriera della reazione inversa, accelera entrambi i versi dello stesso fattore. Gli enzimi sono catalizzatori biologici.

### Le leggi cinetiche vengono dall'esperimento

Per una reazione fra $\mathrm{A}$ e $\mathrm{B}$ la legge cinetica (*rate law*) ha la forma

$$\text{velocità} = k\,[\mathrm{A}]^m\,[\mathrm{B}]^n$$

Gli esponenti $m$ e $n$ sono gli **ordini** rispetto a ciascun reagente e si determinano sperimentalmente. In generale non coincidono con i coefficienti dell'equazione bilanciata; coincidono solo per un singolo stadio elementare. Per leggere un ordine dai dati, confrontate due esperimenti in cui cambia una sola concentrazione:

- la velocità non cambia quando la concentrazione raddoppia: ordine zero;
- la velocità raddoppia: primo ordine;
- la velocità quadruplica: secondo ordine.

La costante cinetica $k$ non dipende dalla concentrazione; cambia con la temperatura e con un catalizzatore.

### Equilibrio dinamico

In un sistema chiuso una reazione reversibile rallenta nel verso diretto man mano che i reagenti si consumano, mentre la reazione inversa accelera man mano che si accumulano i prodotti. Quando le due velocità diventano uguali, le concentrazioni smettono di cambiare. È l'**equilibrio dinamico** (*dynamic equilibrium*): entrambe le reazioni continuano, e le concentrazioni sono costanti, non uguali.

### La costante di equilibrio

Per $a\mathrm{A} + b\mathrm{B} \rightleftharpoons c\mathrm{C} + d\mathrm{D}$,

$$K_c = \frac{[\mathrm{C}]^c\,[\mathrm{D}]^d}{[\mathrm{A}]^a\,[\mathrm{B}]^b}$$

con le concentrazioni all'equilibrio, i prodotti al numeratore e ciascuna elevata al proprio coefficiente. I solidi puri e i liquidi puri, compresa l'acqua come solvente, si omettono. Una $K$ grande significa che all'equilibrio la miscela è composta soprattutto da prodotti; una $K$ piccola, soprattutto da reagenti. La costante della reazione inversa è $\frac{1}{K}$. **Solo la temperatura cambia $K$.**

Il **quoziente di reazione** (*reaction quotient*) $Q$ ha la stessa espressione ma usa le concentrazioni in un istante qualsiasi. Confrontarlo con $K$ dice in che verso evolverà la miscela:

- $Q < K$: troppo pochi prodotti, la reazione procede nel verso diretto;
- $Q > K$: troppi prodotti, procede nel verso inverso;
- $Q = K$: la miscela è all'equilibrio.

### Il principio di Le Châtelier

Quando un equilibrio viene perturbato, la sua posizione si sposta nel verso che annulla in parte la perturbazione.

| Perturbazione | Spostamento | $K$ cambia? |
| --- | --- | --- |
| aggiungere un reagente o togliere un prodotto | verso destra | no |
| comprimere una miscela di gas (aumentare la pressione) | verso meno moli di gas | no |
| aumentare la temperatura | nel verso endotermico | sì |
| aggiungere un catalizzatore | nessuno; l'equilibrio si raggiunge prima | no |

Se i due membri hanno lo stesso numero di moli di gas, la pressione non sposta l'equilibrio. Per la temperatura, trattate il calore come un reagente del verso endotermico: se la reazione diretta è esotermica, riscaldando l'equilibrio si sposta a sinistra e $K$ diminuisce; raffreddando, $K$ aumenta.

### Veloce non significa completo

Un processo industriale o biologico ha spesso bisogno sia di una buona velocità sia di una buona resa, e le due possono essere in conflitto. Per una reazione esotermica una temperatura bassa dà una $K$ più grande, ma la reazione procede lentamente; un catalizzatore le permette di andare a una velocità utile senza ridurre la resa. Quando una domanda mescola le due idee, classificate ogni affermazione come «quanto in fretta» (velocità, $E_a$, catalizzatore, $k$) o «fin dove» ($K$, posizione, resa) prima di giudicarla.
`,
  examples: [
    {
      id: 'example-rate-law-from-data',
      title: 'Ricavare una legge cinetica da tre esperimenti',
      problemMd: md`Per la reazione di $\mathrm{A}$ con $\mathrm{B}$ a temperatura costante:

| Esperimento | $[\mathrm{A}]$ (mol/L) | $[\mathrm{B}]$ (mol/L) | Velocità iniziale (mol/(L s)) |
| --- | --- | --- | --- |
| 1 | $0{,}10$ | $0{,}10$ | $2{,}0 \times 10^{-3}$ |
| 2 | $0{,}20$ | $0{,}10$ | $4{,}0 \times 10^{-3}$ |
| 3 | $0{,}10$ | $0{,}20$ | $8{,}0 \times 10^{-3}$ |

Trovate la legge cinetica, la costante cinetica e la velocità quando entrambe le concentrazioni valgono $0{,}20\ \text{mol/L}$.`,
      steps: [
        md`Esperimenti 1 e 2: raddoppia solo $[\mathrm{A}]$, e la velocità raddoppia. La reazione è del primo ordine rispetto ad $\mathrm{A}$.`,
        md`Esperimenti 1 e 3: raddoppia solo $[\mathrm{B}]$, e la velocità diventa quattro volte più grande. È del secondo ordine rispetto a $\mathrm{B}$, quindi $\text{velocità} = k[\mathrm{A}][\mathrm{B}]^2$.`,
        md`Dall'esperimento 1: $2{,}0 \times 10^{-3} = k \times 0{,}10 \times 0{,}010 = k \times 1{,}0 \times 10^{-3}$, quindi $k = 2{,}0\ \text{L}^2\,\text{mol}^{-2}\,\text{s}^{-1}$.`,
        md`Con entrambe a $0{,}20$: rispetto all'esperimento 1, $[\mathrm{A}]$ raddoppia ($\times 2$) e $[\mathrm{B}]$ raddoppia ($\times 4$), quindi la velocità è $8 \times 2{,}0 \times 10^{-3} = 1{,}6 \times 10^{-2}\ \text{mol/(L s)}$. Verifica: $2{,}0 \times 0{,}20 \times 0{,}040 = 0{,}016$.`,
      ],
      answerMd: md`$\text{velocità} = k[\mathrm{A}][\mathrm{B}]^2$ con $k = 2{,}0\ \text{L}^2\,\text{mol}^{-2}\,\text{s}^{-1}$; la nuova velocità è $1{,}6 \times 10^{-2}\ \text{mol/(L s)}$. Prendere gli ordini dai coefficienti dell'equazione invece che dai dati è l'errore più comune.`,
    },
    {
      id: 'example-k-and-q',
      title: 'Calcolare K e prevedere il verso',
      problemMd: md`Per $\mathrm{H_2(g) + I_2(g) \rightleftharpoons 2HI(g)}$ a una certa temperatura, una miscela all'equilibrio contiene $[\mathrm{H_2}] = 0{,}10$, $[\mathrm{I_2}] = 0{,}20$ e $[\mathrm{HI}] = 0{,}40\ \text{mol/L}$. Trovate $K_c$. Poi, alla stessa temperatura, una miscela ha tutte e tre le concentrazioni pari a $0{,}20\ \text{mol/L}$. In che verso reagisce?`,
      steps: [
        md`Scrivete l'espressione con il coefficiente 2 come esponente: $K_c = \frac{[\mathrm{HI}]^2}{[\mathrm{H_2}][\mathrm{I_2}]}$.`,
        md`Sostituite: $K_c = \frac{0{,}40^2}{0{,}10 \times 0{,}20} = \frac{0{,}16}{0{,}020} = 8{,}0$.`,
        md`Per la seconda miscela, $Q = \frac{0{,}20^2}{0{,}20 \times 0{,}20} = 1{,}0$.`,
        md`$Q = 1{,}0$ è minore di $K = 8{,}0$: ci sono troppo pochi prodotti, quindi la reazione procede nel verso diretto e forma altro $\mathrm{HI}$.`,
      ],
      answerMd: md`$K_c = 8{,}0$, e la seconda miscela reagisce nel verso diretto finché $Q$ non arriva a $8{,}0$. Dimenticare il quadrato dà $\frac{0{,}40}{0{,}020} = 20$, una costante sbagliata.`,
    },
    {
      id: 'example-le-chatelier-sulfur-trioxide',
      title: 'Quattro perturbazioni di uno stesso equilibrio',
      problemMd: md`In $\mathrm{2SO_2(g) + O_2(g) \rightleftharpoons 2SO_3(g)}$ la reazione diretta è esotermica. Prevedete l'effetto sulla quantità di $\mathrm{SO_3}$ all'equilibrio di: aumentare la pressione; aumentare la temperatura; aggiungere un catalizzatore; togliere $\mathrm{SO_3}$ man mano che si forma.`,
      steps: [
        md`Pressione: a sinistra ci sono $3$ moli di gas, a destra $2$. La compressione favorisce il lato con meno moli, quindi l'equilibrio si sposta a destra e si forma più $\mathrm{SO_3}$. $K$ non cambia.`,
        md`Temperatura: la reazione inversa è endotermica, quindi riscaldando l'equilibrio si sposta a sinistra; meno $\mathrm{SO_3}$, e $K$ diminuisce.`,
        md`Catalizzatore: entrambi i versi accelerano dello stesso fattore, quindi l'equilibrio si raggiunge prima ma la sua composizione non cambia.`,
        md`Togliere un prodotto rende $Q < K$, quindi la reazione procede nel verso diretto per rimpiazzarlo; nel complesso si produce più $\mathrm{SO_3}$.`,
      ],
      answerMd: md`Più $\mathrm{SO_3}$ con una pressione più alta o togliendo il prodotto; meno con una temperatura più alta; nessun cambiamento con un catalizzatore. «Un catalizzatore aumenta la resa» è l'affermazione sbagliata più tentatrice.`,
    },
  ],
  traps: [
    {
      title: 'Prendere gli ordini dall\'equazione bilanciata',
      md: md`I coefficienti di $\mathrm{2A + B \rightarrow C}$ non dicono che la legge cinetica sia $k[\mathrm{A}]^2[\mathrm{B}]$. Gli ordini vengono dai dati. Usate i coefficienti come esponenti solo in una costante di equilibrio, o quando il testo dice che la reazione è un singolo stadio elementare.`,
    },
    {
      title: 'Credere che un catalizzatore sposti l\'equilibrio',
      md: md`Un catalizzatore cambia la velocità con cui si raggiunge l'equilibrio, non la sua posizione. Non cambia $K$, $\Delta H$ né la resa all'equilibrio. Le opzioni che promettono «più prodotto» grazie a un catalizzatore sono sbagliate.`,
    },
    {
      title: 'Pensare che concentrazione o pressione cambino K',
      md: md`Aggiungere un reagente o comprimere un gas sposta la **posizione**, e le concentrazioni si riassestano finché $Q$ non uguaglia la **stessa** $K$. Solo un cambiamento di temperatura dà un nuovo valore di $K$.`,
    },
    {
      title: 'Confondere velocità uguali con concentrazioni uguali',
      md: md`All'equilibrio sono uguali le **velocità** diretta e inversa. Le concentrazioni sono costanti, ma di solito molto diverse fra loro; $K$ dice di quanto.`,
    },
  ],
  check: [
    {
      id: 'check-rate-change-factor',
      title: 'Cambiare due concentrazioni insieme',
      topic: 'Cinetica chimica',
      stemMd: md`Una reazione ha legge cinetica $\text{velocità} = k[\mathrm{X}]^2[\mathrm{Y}]$. A temperatura costante, $[\mathrm{X}]$ viene dimezzata e $[\mathrm{Y}]$ raddoppiata. Di quale fattore cambia la velocità?`,
      options: [
        { id: 'A', text: md`$\frac{1}{4}$`, note: md`Tiene conto del dimezzamento di $[\mathrm{X}]$ ma dimentica che raddoppiare $[\mathrm{Y}]$ raddoppia la velocità.` },
        { id: 'B', text: md`$\frac{1}{2}$`, note: '' },
        { id: 'C', text: md`$1$ (nessun cambiamento)`, note: md`Tratta entrambi i reagenti come di primo ordine, così dimezzamento e raddoppio si annullano; $\mathrm{X}$ è di secondo ordine.` },
        { id: 'D', text: md`$2$`, note: md`Scambia gli ordini: $\frac{1}{2}$ per $\mathrm{X}$ e $2^2$ per $\mathrm{Y}$.` },
        { id: 'E', text: md`$8$`, note: md`Tratta $[\mathrm{X}]$ come raddoppiata invece che dimezzata: $2^2 \times 2$.` },
      ],
      answer: 'B',
      workingMd: md`La nuova velocità è $k\left(\frac{1}{2}[\mathrm{X}]\right)^2(2[\mathrm{Y}]) = \frac{1}{4} \times 2 \times k[\mathrm{X}]^2[\mathrm{Y}]$, quindi la velocità viene moltiplicata per $\frac{1}{2}$.`,
      lesson: md`Elevate il fattore di ogni concentrazione al proprio ordine, poi moltiplicate i fattori fra loro.`,
    },
    {
      id: 'check-what-changes-k',
      title: 'Che cosa cambia la costante di equilibrio?',
      topic: 'Equilibrio chimico',
      stemMd: md`Per $\mathrm{N_2(g) + 3H_2(g) \rightleftharpoons 2NH_3(g)}$ la reazione diretta è esotermica. Quale cambiamento aumenta il valore di $K_c$?`,
      options: [
        { id: 'A', text: md`Aumentare la pressione comprimendo la miscela`, note: md`Sposta la posizione verso $\mathrm{NH_3}$ (meno moli di gas), ma $K$ non cambia con la pressione.` },
        { id: 'B', text: md`Aggiungere un catalizzatore a base di ferro`, note: md`Un catalizzatore accelera allo stesso modo i due versi; non cambia né la posizione né $K$.` },
        { id: 'C', text: md`Abbassare la temperatura`, note: '' },
        { id: 'D', text: md`Aggiungere altro $\mathrm{N_2}$`, note: md`Sposta la posizione verso destra, ma le concentrazioni si riassestano sulla stessa $K$.` },
        { id: 'E', text: md`Togliere $\mathrm{NH_3}$ man mano che si forma`, note: md`Togliere un prodotto fa procedere la reazione verso destra senza cambiare $K$; solo la temperatura la cambia.` },
      ],
      answer: 'C',
      workingMd: md`Solo la temperatura cambia $K$. La reazione diretta libera calore, quindi il raffreddamento la favorisce: la posizione si sposta verso $\mathrm{NH_3}$ e $K_c$ aumenta. Gli altri cambiamenti spostano la posizione o modificano la velocità, ma lasciano $K_c$ invariata.`,
      lesson: md`Concentrazione e pressione spostano la posizione dell'equilibrio; solo la temperatura cambia la costante.`,
    },
    {
      id: 'check-catalyst-effect',
      title: 'Che cosa fa un catalizzatore',
      topic: 'Cinetica chimica',
      stemMd: md`Si aggiunge un catalizzatore a una reazione reversibile che ha già raggiunto l'equilibrio. Quale affermazione è corretta?`,
      options: [
        { id: 'A', text: md`La quantità di prodotto all'equilibrio aumenta.`, note: md`Un catalizzatore non sposta la posizione dell'equilibrio, quindi la resa non cambia.` },
        { id: 'B', text: md`Abbassa l'energia di attivazione della sola reazione diretta.`, note: md`Il percorso catalizzato è comune ai due versi, quindi anche la barriera inversa si abbassa della stessa quantità.` },
        { id: 'C', text: md`La variazione di entalpia della reazione diventa più negativa.`, note: md`$\Delta H$ dipende solo dalle energie di reagenti e prodotti, che un catalizzatore non modifica.` },
        { id: 'D', text: md`Le reazioni diretta e inversa accelerano dello stesso fattore.`, note: '' },
        { id: 'E', text: md`La costante di equilibrio aumenta.`, note: md`$K$ cambia solo con la temperatura; un catalizzatore la lascia invariata.` },
      ],
      answer: 'D',
      workingMd: md`Un catalizzatore offre un percorso con energia di attivazione più bassa, e la barriera si abbassa della stessa quantità nei due versi, quindi entrambe le velocità aumentano dello stesso fattore. Poiché restano uguali, il sistema resta all'equilibrio con la stessa composizione, la stessa $K$ e lo stesso $\Delta H$.`,
      lesson: md`Un catalizzatore cambia solo quanto in fretta si raggiunge l'equilibrio, mai dove si trova.`,
    },
  ],
  takeaways: [
    md`La velocità aumenta con concentrazione, superficie, temperatura e catalizzatori, perché diventano più frequenti gli urti con almeno l'energia di attivazione.`,
    md`Gli ordini di reazione vengono dai dati sperimentali, non dai coefficienti dell'equazione bilanciata.`,
    md`$K_c$ è prodotti su reagenti, ciascuno elevato al proprio coefficiente; confrontate $Q$ con $K$ per trovare il verso della trasformazione.`,
    md`Le Châtelier: concentrazione e pressione spostano la posizione; solo la temperatura cambia K; un catalizzatore non cambia né l'una né l'altra.`,
  ],
  flashcards: [
    { front: 'Energia di attivazione', back: md`L'energia minima che un urto deve avere perché le particelle reagiscano: l'altezza della barriera nel profilo energetico.` },
    { front: 'Che cosa cambia un catalizzatore', back: md`Offre un percorso con $E_a$ più bassa e accelera i due versi dello stesso fattore. Non cambia $\Delta H$, $K$ né la resa all'equilibrio.` },
    { front: 'Leggere un ordine dai dati', back: md`Raddoppiate una sola concentrazione: velocità invariata significa ordine zero, doppia primo ordine, quadrupla secondo ordine.` },
    { front: md`Scrivere $K_c$`, back: md`Concentrazioni all'equilibrio dei prodotti su quelle dei reagenti, ciascuna elevata al proprio coefficiente; si omettono solidi e liquidi puri.` },
    { front: 'Q confrontato con K', back: md`$Q < K$: la reazione procede nel verso diretto. $Q > K$: procede nel verso inverso. $Q = K$: è all'equilibrio.` },
    { front: md`L'unico cambiamento che modifica K`, back: md`La temperatura. Il riscaldamento favorisce il verso endotermico; se la reazione diretta è esotermica, K diminuisce.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-reactions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const acidsBasesAndPhLessonIt: Lesson = {
  slug: 'acids-bases-and-ph',
  title: 'Acidi, basi, pH e soluzioni tampone',
  summary: md`Riconoscere acidi, basi e coppie coniugate, calcolare il pH con le potenze di dieci senza calcolatrice, prevedere il pH dei sali e capire i tamponi.`,
  minutes: 22,
  objectives: [
    md`Riconoscere acidi e basi di Brønsted–Lowry e le coppie coniugate, e distinguere i forti dai deboli.`,
    md`Calcolare pH e pOH da concentrazioni scritte come potenze di dieci, anche dopo una neutralizzazione o una diluizione.`,
    md`Prevedere se la soluzione di un sale è acida, neutra o basica.`,
    md`Spiegare come un tampone resiste alle variazioni di pH e calcolarne il pH dal rapporto fra acido e base.`,
  ],
  teachMd: md`
### Acidi e basi come trasferimento di protoni

Nel modello di Brønsted–Lowry un **acido** cede un protone ($\mathrm{H^+}$) e una **base** lo accetta. In acqua un protone libero non esiste: si lega a una molecola d'acqua formando $\mathrm{H_3O^+}$, spesso scritto $\mathrm{H^+}$ per brevità.

$$\mathrm{HCl + H_2O \rightarrow H_3O^+ + Cl^-} \qquad \mathrm{NH_3 + H_2O \rightleftharpoons NH_4^+ + OH^-}$$

Quando un acido perde un protone diventa la sua **base coniugata** (*conjugate base*); quando una base acquista un protone diventa il suo **acido coniugato**. Una coppia coniugata differisce esattamente di un $\mathrm{H^+}$: $\mathrm{CH_3COOH / CH_3COO^-}$, $\mathrm{NH_4^+ / NH_3}$, $\mathrm{H_2O / OH^-}$. L'acqua si comporta da base verso $\mathrm{HCl}$ e da acido verso $\mathrm{NH_3}$: è **anfotera** (*amphoteric*). Più un acido è forte, più la sua base coniugata è debole. (Nel modello più generale di Lewis un acido accetta una coppia di elettroni e una base la dona.)

### Forti e deboli

Un acido **forte** si ionizza completamente in acqua: $\mathrm{HCl}$, $\mathrm{HBr}$, $\mathrm{HI}$, $\mathrm{HNO_3}$, $\mathrm{HClO_4}$, e $\mathrm{H_2SO_4}$ per il primo protone. Le basi forti sono gli idrossidi del gruppo 1 e gli idrossidi solubili del gruppo 2, come $\mathrm{Ba(OH)_2}$. Un acido **debole** si ionizza solo in parte e stabilisce un equilibrio; ne sono esempi gli acidi carbossilici e l'acido carbonico, così come l'ammoniaca e le ammine lo sono delle basi deboli. La sua forza si misura con la costante di dissociazione acida

$$K_a = \frac{[\mathrm{H_3O^+}][\mathrm{A^-}]}{[\mathrm{HA}]} \qquad \mathrm{p}K_a = -\log K_a$$

Una $K_a$ più grande, cioè un $\mathrm{p}K_a$ più piccolo, indica un acido più forte. «Forte» descrive il grado di ionizzazione, non la concentrazione: una soluzione diluita di un acido forte resta un acido forte.

### L'acqua e la scala del pH

L'acqua si ionizza pochissimo, e a $25\ ^\circ\text{C}$

$$K_w = [\mathrm{H_3O^+}][\mathrm{OH^-}] = 1{,}0 \times 10^{-14}$$

$$\mathrm{pH} = -\log[\mathrm{H_3O^+}] \qquad \mathrm{pOH} = -\log[\mathrm{OH^-}] \qquad \mathrm{pH} + \mathrm{pOH} = 14$$

Nell'acqua neutra $[\mathrm{H_3O^+}] = [\mathrm{OH^-}] = 10^{-7}\ \text{mol/L}$, quindi il pH è 7 a $25\ ^\circ\text{C}$. Ogni unità di pH corrisponde a un fattore dieci in $[\mathrm{H_3O^+}]$: una soluzione a pH 3 è cento volte più acida di una a pH 5.

### Il pH con le potenze di dieci

Senza calcolatrice, scrivete ogni concentrazione come potenza di dieci.

- $\mathrm{HCl}$ $0{,}01\ \text{mol/L}$: $[\mathrm{H^+}] = 10^{-2}$, quindi pH 2.
- $\mathrm{NaOH}$ $0{,}001\ \text{mol/L}$: $[\mathrm{OH^-}] = 10^{-3}$, pOH 3, quindi pH 11.
- $\mathrm{Ba(OH)_2}$ $0{,}005\ \text{mol/L}$: due $\mathrm{OH^-}$ per unità formula danno $0{,}010 = 10^{-2}$, pOH 2, pH 12.

Quando il numero davanti alla potenza non è 1, il pH cade fra due interi. Poiché $\log 2 \approx 0{,}30$, $\log 3 \approx 0{,}48$ e $\log 5 \approx 0{,}70$, una concentrazione di $2 \times 10^{-3}$ dà $\mathrm{pH} = 3 - 0{,}30 = 2{,}7$. Per un acido debole che si ionizza poco,

$$[\mathrm{H^+}] \approx \sqrt{K_a\,c}$$

Diluire dieci volte un acido forte ne alza il pH di un'unità, ma nessuna diluizione porta un acido oltre pH 7: vicino alla neutralità prevalgono gli ioni dell'acqua stessa.

### Neutralizzazione e pH dei sali

Un acido e una base reagiscono formando un sale e acqua; per un acido forte con una base forte la reazione ionica netta è $\mathrm{H^+ + OH^- \rightarrow H_2O}$. Al **punto di equivalenza** (*equivalence point*) le moli di $\mathrm{H^+}$ fornite sono uguali alle moli di $\mathrm{OH^-}$. Quando si mescolano quantità diverse, trovate l'eccesso in moli e dividetelo per il volume **totale**.

Il sale che resta non è sempre neutro:

| Sale formato da | Esempio | Soluzione |
| --- | --- | --- |
| acido forte + base forte | $\mathrm{NaCl}$, $\mathrm{KNO_3}$ | neutra, pH 7 |
| acido debole + base forte | $\mathrm{CH_3COONa}$ | basica: $\mathrm{CH_3COO^-}$ prende $\mathrm{H^+}$ dall'acqua |
| acido forte + base debole | $\mathrm{NH_4Cl}$ | acida: $\mathrm{NH_4^+}$ cede $\mathrm{H^+}$ all'acqua |

### Le soluzioni tampone

Una **soluzione tampone** (*buffer*) contiene un acido debole e la sua base coniugata in quantità confrontabili, per esempio acido etanoico (acetico) con etanoato di sodio. L'$\mathrm{H^+}$ aggiunto viene catturato dalla base ($\mathrm{A^- + H^+ \rightarrow HA}$); l'$\mathrm{OH^-}$ aggiunto viene neutralizzato dall'acido ($\mathrm{HA + OH^- \rightarrow A^- + H_2O}$). Il rapporto fra i due cambia di poco, quindi il pH quasi non si sposta. Il suo pH è dato dall'equazione di Henderson–Hasselbalch:

$$\mathrm{pH} = \mathrm{p}K_a + \log\frac{[\mathrm{A^-}]}{[\mathrm{HA}]}$$

Con quantità uguali di acido e base, $\mathrm{pH} = \mathrm{p}K_a$; un eccesso di base di dieci volte dà $\mathrm{p}K_a + 1$, un eccesso di acido di dieci volte dà $\mathrm{p}K_a - 1$. Un tampone funziona meglio entro circa un'unità dal suo $\mathrm{p}K_a$. Nel sangue l'acido carbonico e lo ione idrogenocarbonato (bicarbonato) formano il tampone principale, che mantiene il pH vicino a 7,4.
`,
  examples: [
    {
      id: 'example-partial-neutralisation',
      title: 'Il pH dopo aver mescolato un acido e una base',
      problemMd: md`Si mescolano $50{,}0\ \text{mL}$ di $\mathrm{HCl}$ $0{,}10\ \text{mol/L}$ con $50{,}0\ \text{mL}$ di $\mathrm{NaOH}$ $0{,}080\ \text{mol/L}$. Qual è il pH della miscela?`,
      steps: [
        md`Lavorate in millimoli: $\mathrm{H^+}$ è $50{,}0 \times 0{,}10 = 5{,}0\ \text{mmol}$ e $\mathrm{OH^-}$ è $50{,}0 \times 0{,}080 = 4{,}0\ \text{mmol}$.`,
        md`Si neutralizzano uno a uno, lasciando in eccesso $5{,}0 - 4{,}0 = 1{,}0\ \text{mmol}$ di $\mathrm{H^+}$.`,
        md`Dividete per il volume totale, $100\ \text{mL}$: $[\mathrm{H^+}] = \frac{1{,}0}{100} = 0{,}010\ \text{mol/L} = 10^{-2}\ \text{mol/L}$.`,
        md`$\mathrm{pH} = -\log 10^{-2} = 2$.`,
      ],
      answerMd: md`Il pH è 2. Dividere l'eccesso per $50\ \text{mL}$ invece che per i $100\ \text{mL}$ totali dà $0{,}020\ \text{mol/L}$ e un pH di circa 1,7: è la svista più comune.`,
    },
    {
      id: 'example-weak-acid-ph',
      title: 'Il pH di un acido debole',
      problemMd: md`Un acido debole $\mathrm{HA}$ ha $K_a = 1{,}0 \times 10^{-6}$. Qual è il pH di una sua soluzione $0{,}010\ \text{mol/L}$?`,
      steps: [
        md`L'acido si ionizza poco, quindi usate $[\mathrm{H^+}] \approx \sqrt{K_a\,c}$.`,
        md`$K_a\,c = 1{,}0 \times 10^{-6} \times 1{,}0 \times 10^{-2} = 1{,}0 \times 10^{-8}$, la cui radice quadrata è $1{,}0 \times 10^{-4}\ \text{mol/L}$.`,
        md`$\mathrm{pH} = 4$.`,
        md`Verificate l'approssimazione: $10^{-4}$ è l'$1\%$ di $10^{-2}$, quindi si è ionizzato pochissimo acido, come la formula presuppone.`,
      ],
      answerMd: md`Il pH è 4. Trattare l'acido come forte dà $[\mathrm{H^+}] = 10^{-2}$ e pH 2, ignorando la piccola $K_a$.`,
    },
    {
      id: 'example-buffer-add-acid',
      title: 'Un tampone incontra un acido forte',
      problemMd: md`Un litro di tampone contiene $0{,}10\ \text{mol}$ di acido etanoico e $0{,}10\ \text{mol}$ di etanoato di sodio ($\mathrm{p}K_a = 4{,}76$). Qual è il suo pH, e circa quanto vale dopo l'aggiunta di $0{,}010\ \text{mol}$ di $\mathrm{HCl}$? Confrontate con l'aggiunta dello stesso $\mathrm{HCl}$ a un litro di acqua pura.`,
      steps: [
        md`Quantità uguali di acido e base: $\mathrm{pH} = \mathrm{p}K_a + \log 1 = 4{,}76$.`,
        md`L'$\mathrm{H^+}$ aggiunto reagisce con l'etanoato: la base scende a $0{,}09\ \text{mol}$ e l'acido sale a $0{,}11\ \text{mol}$.`,
        md`$\mathrm{pH} = 4{,}76 + \log\frac{0{,}09}{0{,}11}$. Il rapporto vale circa $0{,}82$, appena sotto 1, quindi il suo logaritmo è un piccolo numero negativo, circa $-0{,}09$: il pH è circa $4{,}67$, vicino a $4{,}7$.`,
        md`In acqua pura lo stesso acido dà $[\mathrm{H^+}] = 0{,}010 = 10^{-2}\ \text{mol/L}$, quindi il pH scenderebbe da 7 a 2.`,
      ],
      answerMd: md`Il tampone parte da pH 4,76 e scende solo a circa 4,7, mentre l'acqua pura scenderebbe da 7 a 2. Rispondere «circa 2» applica il calcolo dell'acido forte e ignora l'etanoato che consuma l'$\mathrm{H^+}$ aggiunto.`,
    },
  ],
  traps: [
    {
      title: 'Leggere il pH come se fosse una concentrazione',
      md: md`Il pH è un logaritmo con il segno meno. Un pH più basso significa **più** $\mathrm{H^+}$, e un'unità corrisponde a un fattore dieci. Diluire dieci volte un acido ne alza il pH di uno; non divide il pH per dieci.`,
    },
    {
      title: 'Rispondere con il pOH',
      md: md`Per una base di solito si trova prima $[\mathrm{OH^-}]$, che dà il pOH. Concludete con $\mathrm{pH} = 14 - \mathrm{pOH}$. Una base con un risultato inferiore a 7 segnala che questo passaggio è stato saltato.`,
    },
    {
      title: 'Contare male ossidrili o protoni per unità formula',
      md: md`$\mathrm{Ba(OH)_2}$ $0{,}01\ \text{mol/L}$ dà $0{,}02\ \text{mol/L}$ di $\mathrm{OH^-}$, non $0{,}01$. Controllate la formula prima di trasformare la concentrazione in una potenza di dieci.`,
    },
    {
      title: 'Credere che ogni sale sia neutro',
      md: md`Un sale è neutro solo quando sia l'acido sia la base da cui deriva sono forti. L'etanoato di sodio è basico e il cloruro di ammonio è acido: chiedetevi quale dei due genitori era debole.`,
    },
  ],
  check: [
    {
      id: 'check-dilute-strong-acid',
      title: 'Diluire un acido forte',
      topic: 'pH',
      stemMd: md`$100\ \text{mL}$ di acido cloridrico a pH 2 vengono diluiti con acqua fino a un volume totale di $1{,}0\ \text{L}$. Qual è il pH della soluzione diluita?`,
      options: [
        { id: 'A', text: md`1`, note: md`La diluizione abbassa $[\mathrm{H^+}]$, quindi alza il pH; non può rendere la soluzione più acida.` },
        { id: 'B', text: md`2`, note: md`Tratta il pH come se la diluizione non lo cambiasse, ma $[\mathrm{H^+}]$ è diminuita di dieci volte.` },
        { id: 'C', text: md`3`, note: '' },
        { id: 'D', text: md`7`, note: md`Una diluizione di dieci volte sposta il pH di un'unità; servirebbe molta più acqua per avvicinarsi alla neutralità, e un acido non supera mai pH 7.` },
        { id: 'E', text: md`11`, note: md`È il pOH della soluzione diluita, non il suo pH.` },
      ],
      answer: 'C',
      workingMd: md`A pH 2, $[\mathrm{H^+}] = 10^{-2}\ \text{mol/L}$. Il volume passa da $0{,}1$ a $1{,}0\ \text{L}$, dieci volte tanto, quindi $[\mathrm{H^+}] = 10^{-3}\ \text{mol/L}$ e il pH è 3.`,
      lesson: md`Ogni diluizione di dieci volte di un acido forte ne alza il pH di un'unità.`,
    },
    {
      id: 'check-basic-salt',
      title: 'Quale sale dà una soluzione basica?',
      topic: 'Acidi e basi',
      stemMd: md`Quale di queste soluzioni acquose $0{,}1\ \text{mol/L}$ ha pH maggiore di 7 a $25\ ^\circ\text{C}$?`,
      options: [
        { id: 'A', text: md`$\mathrm{NH_4Cl}$`, note: md`Lo ione ammonio è un acido debole (l'acido coniugato dell'ammoniaca), quindi la soluzione è acida.` },
        { id: 'B', text: md`$\mathrm{CH_3COONa}$`, note: '' },
        { id: 'C', text: md`$\mathrm{NaCl}$`, note: md`Entrambi i genitori, $\mathrm{HCl}$ e $\mathrm{NaOH}$, sono forti, quindi la soluzione è neutra.` },
        { id: 'D', text: md`$\mathrm{KNO_3}$`, note: md`Sale di un acido forte e di una base forte; nessuno dei due ioni reagisce con l'acqua, quindi il pH è 7.` },
        { id: 'E', text: md`$\mathrm{HNO_3}$`, note: md`È un acido forte, con pH circa 1 a questa concentrazione.` },
      ],
      answer: 'B',
      workingMd: md`L'etanoato di sodio è il sale di un acido debole e di una base forte. Lo ione etanoato è una base: $\mathrm{CH_3COO^- + H_2O \rightleftharpoons CH_3COOH + OH^-}$, e questo rende la soluzione basica.`,
      lesson: md`Un sale è basico quando il suo anione è la base coniugata di un acido debole.`,
    },
    {
      id: 'check-buffer-ratio',
      title: 'Il pH di un tampone',
      topic: 'Soluzioni tampone',
      stemMd: md`Un tampone contiene un acido debole $\mathrm{HA}$ a $0{,}010\ \text{mol/L}$ ($K_a = 1{,}0 \times 10^{-5}$) e il suo sale $\mathrm{NaA}$ a $0{,}10\ \text{mol/L}$. Qual è il suo pH?`,
      options: [
        { id: 'A', text: md`3,5`, note: md`È il pH del solo acido debole: $[\mathrm{H^+}] = \sqrt{10^{-5} \times 10^{-2}} \approx 3{,}2 \times 10^{-4}\ \text{mol/L}$, pH circa 3,5; ignora il sale.` },
        { id: 'B', text: md`4`, note: md`Il rapporto è stato capovolto: $\log\frac{0{,}010}{0{,}10} = -1$ varrebbe se fosse l'acido a essere in eccesso.` },
        { id: 'C', text: md`5`, note: md`È il $\mathrm{p}K_a$, cioè il pH solo quando acido e base sono uguali; qui la base è dieci volte l'acido.` },
        { id: 'D', text: md`6`, note: '' },
        { id: 'E', text: md`8`, note: md`Sottrae da 14 il pH corretto, come se l'equazione desse il pOH; invece dà direttamente il pH.` },
      ],
      answer: 'D',
      workingMd: md`$\mathrm{p}K_a = -\log(1{,}0 \times 10^{-5}) = 5$. Il rapporto $\frac{[\mathrm{A^-}]}{[\mathrm{HA}]} = \frac{0{,}10}{0{,}010} = 10$, e $\log 10 = 1$, quindi $\mathrm{pH} = 5 + 1 = 6$.`,
      lesson: md`In un tampone, più base che acido porta il pH sopra il pKa, di un'unità per ogni fattore dieci.`,
    },
  ],
  takeaways: [
    md`Un acido cede un protone e una base lo accetta; una coppia coniugata differisce di un protone.`,
    md`$\mathrm{pH} = -\log[\mathrm{H_3O^+}]$ e $\mathrm{pH} + \mathrm{pOH} = 14$ a $25\ ^\circ\text{C}$; ogni unità è un fattore dieci.`,
    md`I sali di un acido debole e di una base forte sono basici; i sali di un acido forte e di una base debole sono acidi.`,
    md`Un tampone è un acido debole con la sua base coniugata; $\mathrm{pH} = \mathrm{p}K_a + \log\frac{[\mathrm{A^-}]}{[\mathrm{HA}]}$.`,
  ],
  flashcards: [
    { front: 'Acido e base di Brønsted–Lowry', back: md`Un acido cede un protone (H⁺); una base lo accetta. Una coppia coniugata differisce esattamente di un protone.` },
    { front: md`Prodotto ionico dell'acqua a 25 °C`, back: md`$K_w = [\mathrm{H_3O^+}][\mathrm{OH^-}] = 1{,}0 \times 10^{-14}$, quindi $\mathrm{pH} + \mathrm{pOH} = 14$.` },
    { front: 'pH di una base forte 0,001 mol/L', back: md`$[\mathrm{OH^-}] = 10^{-3}$, quindi il pOH è 3 e il pH è $14 - 3 = 11$.` },
    { front: 'pH di un acido debole', back: md`$[\mathrm{H^+}] \approx \sqrt{K_a\,c}$, valida quando si ionizza solo una piccola frazione dell'acido.` },
    { front: 'Soluzione di etanoato di sodio: acida, neutra o basica?', back: md`Basica: lo ione etanoato è la base coniugata di un acido debole e prende protoni dall'acqua.` },
    { front: 'Equazione di Henderson–Hasselbalch', back: md`$\mathrm{pH} = \mathrm{p}K_a + \log\frac{[\mathrm{A^-}]}{[\mathrm{HA}]}$; con acido e base in quantità uguali, $\mathrm{pH} = \mathrm{p}K_a$.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-reactions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const redoxReactionsLessonIt: Lesson = {
  slug: 'redox-reactions',
  title: 'Reazioni redox e numeri di ossidazione',
  summary: md`Assegnare i numeri di ossidazione, riconoscere chi si ossida e chi si riduce, bilanciare le redox con le semireazioni e usare i potenziali standard.`,
  minutes: 22,
  objectives: [
    md`Assegnare i numeri di ossidazione agli atomi di molecole e ioni.`,
    md`Riconoscere la specie che si ossida e quella che si riduce, l'ossidante e il riducente.`,
    md`Bilanciare un'equazione redox in ambiente acido con il metodo delle semireazioni.`,
    md`Usare i potenziali standard di elettrodo per trovare la forza elettromotrice di una pila e il verso di una reazione.`,
  ],
  teachMd: md`
### Ossidazione e riduzione sono trasferimenti di elettroni

L'**ossidazione** (*oxidation*) è la perdita di elettroni; la **riduzione** (*reduction*) è l'acquisto di elettroni. In inglese si ricorda con «OIL RIG» (*oxidation is loss, reduction is gain*). Le due avvengono sempre insieme, perché gli elettroni persi da una specie vengono acquistati da un'altra: per questo si parla di reazioni **redox**.

$$\mathrm{Zn + Cu^{2+} \rightarrow Zn^{2+} + Cu}$$

Lo zinco perde due elettroni e si ossida; lo ione rame(II) li acquista e si riduce. La specie che provoca l'ossidazione, prendendo elettroni, è l'**ossidante** (*oxidising agent*), e intanto si riduce. La specie che cede elettroni è il **riducente** (*reducing agent*), e intanto si ossida. Qui $\mathrm{Cu^{2+}}$ è l'ossidante e $\mathrm{Zn}$ il riducente. Confondere «si ossida» con «è l'ossidante» è l'errore più frequente di tutto l'argomento.

### I numeri di ossidazione

Quando gli elettroni sono condivisi anziché trasferiti del tutto, i numeri di ossidazione (*oxidation numbers*) tengono la contabilità. Applicate queste regole nell'ordine:

1. Un atomo allo stato elementare ha numero di ossidazione 0 ($\mathrm{O_2}$, $\mathrm{Fe}$, $\mathrm{Cl_2}$).
2. Uno ione monoatomico ha la sua carica ($\mathrm{Na^+}$ è $+1$, $\mathrm{S^{2-}}$ è $-2$).
3. Il fluoro è sempre $-1$. L'ossigeno è $-2$, tranne nei perossidi come $\mathrm{H_2O_2}$ ($-1$) e con il fluoro.
4. L'idrogeno è $+1$, tranne negli idruri metallici come $\mathrm{NaH}$ ($-1$). I metalli del gruppo 1 sono $+1$, quelli del gruppo 2 $+2$.
5. La somma dei numeri di ossidazione è uguale alla carica complessiva: 0 per un composto neutro, la carica dello ione per uno ione.

Per esempio, in $\mathrm{KMnO_4}$: $+1 + x + 4(-2) = 0$, quindi il manganese è $+7$. In $\mathrm{SO_4^{2-}}$: $x + 4(-2) = -2$, quindi lo zolfo è $+6$. In $\mathrm{NH_3}$ l'azoto è $-3$; in $\mathrm{HNO_3}$ è $+5$. Un **aumento** del numero di ossidazione è un'ossidazione; una **diminuzione** è una riduzione.

A volte lo stesso elemento fa entrambe le cose. In $\mathrm{Cl_2 + 2NaOH \rightarrow NaCl + NaClO + H_2O}$ il cloro passa da 0 a $-1$ in $\mathrm{NaCl}$ e a $+1$ in $\mathrm{NaClO}$: è una **dismutazione** o disproporzione (*disproportionation*).

### Bilanciare con le semireazioni

Un'equazione redox deve bilanciare sia gli atomi sia la carica. In ambiente acido:

1. Dividete la reazione in una semireazione di ossidazione e una di riduzione.
2. Bilanciate gli atomi diversi da O e H.
3. Bilanciate O con $\mathrm{H_2O}$, poi H con $\mathrm{H^+}$.
4. Bilanciate la carica con gli elettroni.
5. Moltiplicate le semireazioni in modo che gli elettroni persi siano uguali a quelli acquistati, poi sommatele e semplificate.

Il numero di elettroni di ogni semireazione è uguale alla variazione del numero di ossidazione moltiplicata per il numero di atomi che cambiano: è un controllo rapido.

### Le celle elettrochimiche

In una **cella galvanica** (pila, *galvanic cell*) una reazione redox spontanea viene divisa fra due elettrodi, così gli elettroni passano in un filo e compiono lavoro. L'ossidazione avviene all'**anodo** e la riduzione al **catodo** (in inglese «an ox, red cat»). In una pila l'anodo è l'elettrodo negativo. Un ponte salino permette agli ioni di spostarsi, mantenendo neutre le due soluzioni.

Ogni semireazione ha un **potenziale standard di riduzione** $E^\circ$, misurato rispetto all'elettrodo a idrogeno, a cui si assegna $0\ \text{V}$. Più $E^\circ$ è positivo, più la specie tende a ridursi, quindi più è forte come ossidante.

| Semireazione | $E^\circ$ (V) |
| --- | --- |
| $\mathrm{Ag^+ + e^- \rightarrow Ag}$ | $+0{,}80$ |
| $\mathrm{Cu^{2+} + 2e^- \rightarrow Cu}$ | $+0{,}34$ |
| $\mathrm{2H^+ + 2e^- \rightarrow H_2}$ | $0{,}00$ |
| $\mathrm{Zn^{2+} + 2e^- \rightarrow Zn}$ | $-0{,}76$ |

$$E^\circ_{\text{cella}} = E^\circ_{\text{catodo}} - E^\circ_{\text{anodo}}$$

La semireazione con $E^\circ$ più alto si riduce (catodo); l'altra procede al contrario, come ossidazione (anodo). Un $E^\circ_{\text{cella}}$ positivo significa che la reazione, così scritta, è spontanea. Per zinco e rame, $0{,}34 - (-0{,}76) = 1{,}10\ \text{V}$. Poiché $E^\circ$ è una proprietà di ogni semireazione e non della quantità che reagisce, **non** si moltiplica quando si moltiplica una semireazione per bilanciare gli elettroni. La stessa tabella spiega gli spostamenti: un metallo con $E^\circ$ più negativo sposta gli ioni di un metallo con $E^\circ$ più positivo, quindi lo zinco immerso in una soluzione di solfato di rame si ricopre di rame.

In una **cella elettrolitica** un generatore esterno forza una reazione non spontanea, come nella galvanostegia o nell'elettrolisi dell'acqua. L'ossidazione resta all'anodo e la riduzione al catodo, ma qui l'anodo è l'elettrodo positivo.
`,
  examples: [
    {
      id: 'example-copper-nitric-acid',
      title: 'Chi si ossida e chi si riduce?',
      problemMd: md`In $\mathrm{Cu + 4HNO_3 \rightarrow Cu(NO_3)_2 + 2NO_2 + 2H_2O}$, quale elemento si ossida, quale si riduce, e quali sono l'ossidante e il riducente?`,
      steps: [
        md`Rame: 0 nel metallo, $+2$ in $\mathrm{Cu(NO_3)_2}$. Il suo numero di ossidazione aumenta, quindi il rame si ossida.`,
        md`Azoto in $\mathrm{HNO_3}$: $+1 + x + 3(-2) = 0$, quindi $x = +5$. In $\mathrm{NO_2}$: $x + 2(-2) = 0$, quindi $+4$. Nel nitrato del prodotto resta $+5$.`,
        md`Quindi si riduce solo l'azoto che finisce in $\mathrm{NO_2}$, da $+5$ a $+4$. Idrogeno ($+1$) e ossigeno ($-2$) non cambiano.`,
        md`Controllate gli elettroni: un rame ne perde 2; due atomi di azoto ne acquistano 1 ciascuno, quindi se ne acquistano 2. Tornano.`,
      ],
      answerMd: md`Il rame si ossida (è il riducente); l'azoto si riduce da $+5$ a $+4$, quindi l'acido nitrico è l'ossidante. Chiamare il rame «ossidante» perché si ossida è la svista tentatrice; e notate che metà dell'acido nitrico fornisce solo ioni nitrato, senza ridursi.`,
    },
    {
      id: 'example-balance-permanganate',
      title: 'Bilanciare permanganato e ferro(II)',
      problemMd: md`Bilanciate la reazione di $\mathrm{MnO_4^-}$ con $\mathrm{Fe^{2+}}$ in ambiente acido, che dà $\mathrm{Mn^{2+}}$ e $\mathrm{Fe^{3+}}$.`,
      steps: [
        md`Semireazione di ossidazione: $\mathrm{Fe^{2+} \rightarrow Fe^{3+} + e^-}$.`,
        md`Semireazione di riduzione: bilanciate O con l'acqua, $\mathrm{MnO_4^- \rightarrow Mn^{2+} + 4H_2O}$; poi H con i protoni, $\mathrm{MnO_4^- + 8H^+ \rightarrow Mn^{2+} + 4H_2O}$.`,
        md`Bilanciate la carica: a sinistra $-1 + 8 = +7$, a destra $+2$, quindi aggiungete 5 elettroni a sinistra: $\mathrm{MnO_4^- + 8H^+ + 5e^- \rightarrow Mn^{2+} + 4H_2O}$. Corrisponde al passaggio del manganese da $+7$ a $+2$.`,
        md`Moltiplicate per 5 la semireazione del ferro e sommate: $\mathrm{MnO_4^- + 5Fe^{2+} + 8H^+ \rightarrow Mn^{2+} + 5Fe^{3+} + 4H_2O}$.`,
        md`Controllo della carica: a sinistra $-1 + 10 + 8 = +17$; a destra $+2 + 15 = +17$. Anche gli atomi tornano.`,
      ],
      answerMd: md`$\mathrm{MnO_4^- + 5Fe^{2+} + 8H^+ \rightarrow Mn^{2+} + 5Fe^{3+} + 4H_2O}$: un permanganato ossida cinque ioni ferro(II). Un rapporto uno a uno bilancia gli atomi di Mn e Fe ma non gli elettroni.`,
    },
    {
      id: 'example-zinc-silver-cell',
      title: 'La forza elettromotrice di una pila zinco–argento',
      problemMd: md`Una pila è formata da un elettrodo di zinco in una soluzione di $\mathrm{Zn^{2+}}$ e da un elettrodo d'argento in una soluzione di $\mathrm{Ag^+}$. Usando $E^\circ(\mathrm{Ag^+/Ag}) = +0{,}80\ \text{V}$ ed $E^\circ(\mathrm{Zn^{2+}/Zn}) = -0{,}76\ \text{V}$, trovate anodo, catodo, reazione complessiva ed $E^\circ_{\text{cella}}$.`,
      steps: [
        md`L'argento ha l'$E^\circ$ più alto, quindi $\mathrm{Ag^+}$ si riduce: l'elettrodo d'argento è il catodo.`,
        md`Lo zinco si ossida, $\mathrm{Zn \rightarrow Zn^{2+} + 2e^-}$: l'elettrodo di zinco è l'anodo.`,
        md`Bilanciate gli elettroni raddoppiando la semireazione dell'argento: $\mathrm{Zn + 2Ag^+ \rightarrow Zn^{2+} + 2Ag}$.`,
        md`$E^\circ_{\text{cella}} = 0{,}80 - (-0{,}76) = 1{,}56\ \text{V}$. Il potenziale dell'argento non si raddoppia, perché $E^\circ$ non dipende dalla quantità.`,
      ],
      answerMd: md`Anodo di zinco, catodo d'argento, $\mathrm{Zn + 2Ag^+ \rightarrow Zn^{2+} + 2Ag}$, $E^\circ_{\text{cella}} = 1{,}56\ \text{V}$. Raddoppiare il valore dell'argento dà $2{,}36\ \text{V}$, e sommare i potenziali così come sono scritti dà $0{,}04\ \text{V}$: entrambi sbagliati.`,
    },
  ],
  traps: [
    {
      title: 'Confondere «si ossida» con «ossidante»',
      md: md`L'ossidante è la specie che si **riduce**: prende elettroni e così ossida qualcos'altro. Prima di scegliere, scrivete quale specie perde elettroni e quale li acquista, poi date il nome agli agenti.`,
    },
    {
      title: 'Dimenticare quanti atomi cambiano',
      md: md`In $\mathrm{Cr_2O_7^{2-}}$ ogni cromo passa da $+6$ a $+3$, ma gli atomi sono due, quindi un dicromato acquista 6 elettroni, non 3. Moltiplicate la variazione per atomo per il numero di atomi.`,
    },
    {
      title: 'Moltiplicare i potenziali di elettrodo',
      md: md`Quando raddoppiate una semireazione per bilanciare gli elettroni, il suo $E^\circ$ resta lo stesso. Serve solo la sottrazione catodo meno anodo.`,
    },
    {
      title: 'Applicare ossigeno = −2 dappertutto',
      md: md`Nel perossido di idrogeno l'ossigeno è $-1$, e negli idruri metallici l'idrogeno è $-1$. Cercate queste eccezioni prima di ricavare l'atomo incognito.`,
    },
  ],
  check: [
    {
      id: 'check-nitrogen-plus-three',
      title: 'Azoto a +3',
      topic: 'Numeri di ossidazione',
      stemMd: md`In quale specie l'azoto ha numero di ossidazione $+3$?`,
      options: [
        { id: 'A', text: md`$\mathrm{NH_4^+}$`, note: md`$x + 4(+1) = +1$ dà $x = -3$: il segno è opposto.` },
        { id: 'B', text: md`$\mathrm{N_2O}$`, note: md`$2x + (-2) = 0$ dà $x = +1$; i due atomi di azoto si dividono il $+2$.` },
        { id: 'C', text: md`$\mathrm{NO_2^-}$`, note: '' },
        { id: 'D', text: md`$\mathrm{NO_2}$`, note: md`È una molecola neutra: $x + 2(-2) = 0$ dà $+4$. La formula somiglia a quella dello ione nitrito, ma non ha carica.` },
        { id: 'E', text: md`$\mathrm{NO_3^-}$`, note: md`$x + 3(-2) = -1$ dà $+5$, l'azoto del nitrato e dell'acido nitrico.` },
      ],
      answer: 'C',
      workingMd: md`Per lo ione nitrito, $x + 2(-2) = -1$, quindi $x = +3$. Le altre danno $-3$ ($\mathrm{NH_4^+}$), $+1$ ($\mathrm{N_2O}$), $+4$ ($\mathrm{NO_2}$) e $+5$ ($\mathrm{NO_3^-}$).`,
      lesson: md`Ponete la somma dei numeri di ossidazione uguale alla carica complessiva, e controllate se la specie è uno ione.`,
    },
    {
      id: 'check-thermite-oxidising-agent',
      title: 'Trovare l\'ossidante',
      topic: 'Reazioni redox',
      stemMd: md`Nella reazione $\mathrm{2Al + Fe_2O_3 \rightarrow Al_2O_3 + 2Fe}$, quale sostanza è l'ossidante?`,
      options: [
        { id: 'A', text: md`$\mathrm{Al}$`, note: md`L'alluminio passa da 0 a $+3$: si ossida, quindi è il riducente.` },
        { id: 'B', text: md`$\mathrm{Fe_2O_3}$`, note: '' },
        { id: 'C', text: md`$\mathrm{Al_2O_3}$`, note: md`È un prodotto: gli agenti sono fra i reagenti, le specie che cedono o prendono elettroni.` },
        { id: 'D', text: md`$\mathrm{Fe}$`, note: md`Il ferro metallico è ciò che la riduzione produce, non l'agente che provoca l'ossidazione.` },
        { id: 'E', text: md`L'ossigeno`, note: md`L'ossigeno è $-2$ in entrambi gli ossidi, quindi qui non si ossida né si riduce.` },
      ],
      answer: 'B',
      workingMd: md`Il ferro passa da $+3$ in $\mathrm{Fe_2O_3}$ a 0 nel metallo, quindi si riduce; il composto che lo contiene, l'ossido di ferro(III), prende elettroni dall'alluminio ed è l'ossidante. L'alluminio (da 0 a $+3$) è il riducente.`,
      lesson: md`L'ossidante è il reagente il cui numero di ossidazione diminuisce.`,
    },
    {
      id: 'check-dichromate-iron-ratio',
      title: 'Dicromato e ferro(II)',
      topic: 'Bilanciamento delle redox',
      stemMd: md`In ambiente acido, $\mathrm{Cr_2O_7^{2-}}$ ossida $\mathrm{Fe^{2+}}$ a $\mathrm{Fe^{3+}}$ e si riduce a $\mathrm{Cr^{3+}}$. Nell'equazione bilanciata, quanti ioni $\mathrm{Fe^{2+}}$ reagiscono con un solo ione $\mathrm{Cr_2O_7^{2-}}$?`,
      options: [
        { id: 'A', text: md`1`, note: md`Presuppone un rapporto uno a uno senza bilanciare gli elettroni; un dicromato acquista sei elettroni e ogni ferro ne cede uno.` },
        { id: 'B', text: md`2`, note: md`Corrisponde ai due atomi di cromo ma non agli elettroni: ogni cromo ne acquista tre.` },
        { id: 'C', text: md`3`, note: md`Tre è la variazione di un solo atomo di cromo; lo ione dicromato ne contiene due.` },
        { id: 'D', text: md`6`, note: '' },
        { id: 'E', text: md`14`, note: md`Quattordici è il numero di $\mathrm{H^+}$ nell'equazione bilanciata, non di $\mathrm{Fe^{2+}}$.` },
      ],
      answer: 'D',
      workingMd: md`Il cromo passa da $+6$ a $+3$, acquistando 3 elettroni per atomo, e gli atomi sono due: 6 elettroni per dicromato. Ogni $\mathrm{Fe^{2+}}$ ne perde 1, quindi ne servono sei: $\mathrm{Cr_2O_7^{2-} + 14H^+ + 6Fe^{2+} \rightarrow 2Cr^{3+} + 6Fe^{3+} + 7H_2O}$. Controllo della carica: $-2 + 14 + 12 = +24$ a sinistra, $6 + 18 = +24$ a destra.`,
      lesson: md`Bilanciate prima gli elettroni: variazione per atomo per atomi nello ione, da uguagliare agli elettroni forniti dall'altra semireazione.`,
    },
  ],
  takeaways: [
    md`L'ossidazione è perdita di elettroni (il numero di ossidazione aumenta); la riduzione è acquisto (il numero di ossidazione diminuisce).`,
    md`L'ossidante si riduce e il riducente si ossida.`,
    md`Le redox in ambiente acido si bilanciano con le semireazioni: atomi, poi O con $\mathrm{H_2O}$, H con $\mathrm{H^+}$, carica con elettroni.`,
    md`$E^\circ_{\text{cella}} = E^\circ_{\text{catodo}} - E^\circ_{\text{anodo}}$; positivo significa spontaneo, e i potenziali non si moltiplicano mai.`,
  ],
  flashcards: [
    { front: 'OIL RIG', back: md`*Oxidation is loss, reduction is gain*: l'ossidazione è perdita di elettroni, la riduzione è acquisto. Le due avvengono sempre insieme.` },
    { front: 'Ossidante', back: md`La specie che prende elettroni da un'altra. Intanto si riduce: il suo numero di ossidazione diminuisce.` },
    { front: 'Somma dei numeri di ossidazione', back: md`Zero in un composto neutro; uguale alla carica in uno ione. Serve a ricavare l'unico atomo incognito.` },
    { front: 'Bilanciare una semireazione in ambiente acido', back: md`Bilanciate gli atomi principali, poi O con $\mathrm{H_2O}$, poi H con $\mathrm{H^+}$, poi la carica con gli elettroni.` },
    { front: 'Anodo e catodo', back: md`L'ossidazione avviene sempre all'anodo, la riduzione al catodo. In una pila l'anodo è negativo; nell'elettrolisi è positivo.` },
    { front: 'Potenziale standard di una pila', back: md`$E^\circ_{\text{cella}} = E^\circ_{\text{catodo}} - E^\circ_{\text{anodo}}$; si riduce la semireazione con $E^\circ$ più alto. Un valore positivo significa spontaneo.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-reactions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const organicCompoundsAndFunctionalGroupsLessonIt: Lesson = {
  slug: 'organic-compounds-and-functional-groups',
  title: 'Composti organici e gruppi funzionali',
  summary: md`Riconoscere le famiglie di idrocarburi e i gruppi funzionali, dare il nome ai composti semplici e spiegarne ebollizione, solubilità e acidità.`,
  minutes: 20,
  objectives: [
    md`Riconoscere alcani, alcheni, alchini e areni dalla struttura e dalla formula generale.`,
    md`Individuare i gruppi funzionali più comuni e dare il nome ai composti semplici che li contengono.`,
    md`Spiegare le differenze di punto di ebollizione, solubilità e comportamento acido–base a partire dai gruppi funzionali presenti.`,
  ],
  teachMd: md`
### Perché il carbonio forma così tanti composti

Il carbonio ha quattro elettroni di valenza e forma quattro legami covalenti. Si lega saldamente ad altri atomi di carbonio, quindi costruisce catene, ramificazioni e anelli, con legami semplici, doppi o tripli. La geometria segue i legami: un carbonio con quattro legami semplici è tetraedrico (circa $109{,}5^\circ$, $sp^3$); uno con un doppio legame è trigonale planare ($120^\circ$, $sp^2$); uno con un triplo legame è lineare ($180^\circ$, $sp$).

### Le famiglie di idrocarburi

Gli idrocarburi (*hydrocarbons*) contengono solo carbonio e idrogeno.

| Famiglia | Legami | Formula generale | Esempio |
| --- | --- | --- | --- |
| alcani | solo legami semplici (saturi) | $\mathrm{C_nH_{2n+2}}$ | propano, $\mathrm{C_3H_8}$ |
| alcheni | un $\mathrm{C{=}C}$ | $\mathrm{C_nH_{2n}}$ | propene, $\mathrm{C_3H_6}$ |
| alchini | un $\mathrm{C{\equiv}C}$ | $\mathrm{C_nH_{2n-2}}$ | propino, $\mathrm{C_3H_4}$ |
| cicloalcani | un anello di legami semplici | $\mathrm{C_nH_{2n}}$ | cicloesano, $\mathrm{C_6H_{12}}$ |
| areni | un anello benzenico | — | benzene, $\mathrm{C_6H_6}$ |

Alcheni, alchini e areni sono **insaturi** (*unsaturated*). Un alchene e un cicloalcano hanno la stessa formula generale, quindi la sola formula non sempre basta a distinguerli. Nel benzene i sei elettroni dei tre doppi legami sono **delocalizzati** sull'anello, il che lo rende insolitamente stabile. Ogni famiglia è una **serie omologa** (*homologous series*): i suoi membri differiscono di un $\mathrm{CH_2}$, hanno la stessa formula generale e una chimica simile, e le loro proprietà fisiche cambiano gradualmente con la lunghezza della catena.

La lunghezza della catena si indica con una radice: met- (1), et- (2), prop- (3), but- (4), pent- (5), es- (6), ept- (7), ott- (8).

### I gruppi funzionali

Un gruppo funzionale (*functional group*) è l'atomo o il gruppo di atomi che conferisce a un composto le sue reazioni tipiche. $\mathrm{R}$ indica il resto della molecola.

| Gruppo | Struttura | Desinenza | Esempio |
| --- | --- | --- | --- |
| alogenuro alchilico | $\mathrm{R{-}X}$ (X = F, Cl, Br, I) | prefisso cloro-, bromo- | cloroetano, $\mathrm{CH_3CH_2Cl}$ |
| alcol | $\mathrm{R{-}OH}$ | -olo | etanolo, $\mathrm{CH_3CH_2OH}$ |
| etere | $\mathrm{R{-}O{-}R'}$ | etere, oppure alcossi- | metossimetano, $\mathrm{CH_3OCH_3}$ |
| aldeide | $\mathrm{R{-}CHO}$, a fine catena | -ale | etanale, $\mathrm{CH_3CHO}$ |
| chetone | $\mathrm{R{-}CO{-}R'}$, dentro la catena | -one | propanone, $\mathrm{CH_3COCH_3}$ |
| acido carbossilico | $\mathrm{R{-}COOH}$ | acido -oico | acido etanoico, $\mathrm{CH_3COOH}$ |
| estere | $\mathrm{R{-}COO{-}R'}$ | -oato di alchile | etanoato di metile, $\mathrm{CH_3COOCH_3}$ |
| ammina | $\mathrm{R{-}NH_2}$ | -ammina | metilammina, $\mathrm{CH_3NH_2}$ |
| ammide | $\mathrm{R{-}CONH_2}$ | -ammide | etanammide, $\mathrm{CH_3CONH_2}$ |

Cinque di questi contengono il gruppo **carbonile** (*carbonyl*), $\mathrm{C{=}O}$. Si distinguono da ciò che è legato al carbonio carbonilico: H (aldeide), due atomi di carbonio (chetone), $\mathrm{OH}$ (acido), $\mathrm{O{-}R}$ (estere) o $\mathrm{N}$ (ammide).

Gli alcoli sono **primari**, **secondari** o **terziari** secondo quanti atomi di carbonio sono legati al carbonio che porta l'$\mathrm{OH}$: uno, due o tre. L'etanolo è primario, il propan-2-olo secondario, il 2-metilpropan-2-olo terziario. La classe decide come un alcol si ossida, come si vedrà nella lezione successiva.

### Il nome in quattro passi

1. Trovate la catena di carbonio più lunga che contiene il gruppo funzionale principale; dà la radice.
2. Aggiungete la desinenza del gruppo principale (-ene, -olo, -one, acido -oico e così via).
3. Numerate la catena dall'estremità che dà al gruppo principale, o al doppio legame, il numero più basso.
4. Indicate ramificazioni e altri gruppi come prefissi con i loro numeri, in ordine alfabetico.

Così $\mathrm{CH_3CH_2CH(CH_3)CH_2CH_3}$ è il 3-metilpentano, $\mathrm{CH_3CH{=}CHCH_3}$ il but-2-ene, $\mathrm{CH_3COCH_2CH_3}$ il butan-2-one e $\mathrm{(CH_3)_2CHCH_2OH}$ il 2-metilpropan-1-olo.

### Le proprietà dipendono dalle forze fra le molecole

Gli alcani sono apolari e si attraggono solo con forze di London (di dispersione). I loro punti di ebollizione salgono con la lunghezza della catena, e le ramificazioni li abbassano, perché le molecole ramificate si toccano su una superficie minore. Il $\mathrm{C{=}O}$ polare di aldeidi e chetoni aggiunge attrazioni dipolo–dipolo. Gli alcoli formano legami a idrogeno attraverso l'$\mathrm{O{-}H}$, e gli acidi carbossilici ne formano di ancora più forti, spesso a coppie. A parità di massa, quindi, i punti di ebollizione crescono nell'ordine alcano, aldeide o chetone, alcol, acido carbossilico. Alcoli, acidi e ammine piccoli si sciolgono in acqua perché vi formano legami a idrogeno; man mano che la catena idrocarburica cresce, la solubilità diminuisce.

### Acidi e basi fra i composti organici

Gli acidi carbossilici sono acidi deboli: con l'idrossido di sodio diventano ioni carbossilato e dai carbonati liberano anidride carbonica. Gli alcoli in acqua sono in pratica neutri. Le ammine, come l'ammoniaca, sono basi deboli, perché il doppietto libero dell'azoto accetta un protone. Gli amminoacidi portano entrambi i gruppi, ed è per questo che si comportano sia da acidi sia da basi.

### I gruppi funzionali nelle molecole biologiche

Gli stessi gruppi costruiscono le molecole della vita. Gli zuccheri portano diversi gruppi $\mathrm{OH}$ e un'aldeide (glucosio) o un chetone (fruttosio). I grassi sono esteri del glicerolo con acidi grassi. Le proteine sono catene di amminoacidi uniti da legami ammidici, detti legami peptidici.
`,
  examples: [
    {
      id: 'example-lactic-acid-groups',
      title: `I gruppi funzionali dell'acido lattico`,
      problemMd: md`L'acido lattico ha struttura $\mathrm{CH_3CH(OH)COOH}$. Individuatene i gruppi funzionali, classificate l'alcol, scrivete la formula molecolare e il nome sistematico.`,
      steps: [
        md`Il $\mathrm{COOH}$ in fondo è un gruppo carbossilico. L'$\mathrm{OH}$ sul carbonio centrale è un gruppo alcolico.`,
        md`Il carbonio che porta l'$\mathrm{OH}$ è legato ad altri due atomi di carbonio (il $\mathrm{CH_3}$ e il carbonio del $\mathrm{COOH}$), quindi è un alcol secondario.`,
        md`Contate gli atomi: C $1 + 1 + 1 = 3$; H $3 + 1 + 1 + 1 = 6$; O $1 + 2 = 3$. La formula è $\mathrm{C_3H_6O_3}$.`,
        md`L'acido è il gruppo principale e fissa la desinenza: acido propanoico, numerato a partire dal carbonio dell'acido. L'$\mathrm{OH}$ sul carbonio 2 diventa il prefisso idrossi-: acido 2-idrossipropanoico.`,
      ],
      answerMd: md`Un acido carbossilico e un alcol secondario; $\mathrm{C_3H_6O_3}$; acido 2-idrossipropanoico. Chiamarlo chetone o aldeide per via del $\mathrm{C{=}O}$ è la trappola: il carbonio carbonilico porta un $\mathrm{OH}$, quindi è un acido.`,
    },
    {
      id: 'example-naming-three',
      title: 'Dare il nome a tre composti',
      problemMd: md`Date il nome a: (a) $\mathrm{CH_3CH(CH_3)CH_2CH_2CH_3}$; (b) $\mathrm{CH_3CH_2CH_2CHO}$; (c) $\mathrm{CH_3CH_2COOCH_3}$.`,
      steps: [
        md`(a) La catena più lunga ha cinque atomi di carbonio (pentano). Numerando da sinistra il metile è sul carbonio 2; da destra sarebbe sul 4. Vince il numero più basso: 2-metilpentano.`,
        md`(b) Quattro atomi di carbonio con un $\mathrm{CHO}$ in fondo: un'aldeide. Il carbonio aldeidico è sempre il numero 1, quindi il numero non serve: butanale.`,
        md`(c) Un $\mathrm{COO}$ fra due gruppi di carbonio è un estere. La parte che viene dall'acido, $\mathrm{CH_3CH_2CO{-}}$, ha tre atomi di carbonio (propanoato); il gruppo sull'ossigeno, $\mathrm{CH_3}$, è il metile: propanoato di metile (*methyl propanoate*).`,
      ],
      answerMd: md`(a) 2-metilpentano, (b) butanale, (c) propanoato di metile. «4-metilpentano» numera dall'estremità sbagliata, e «metanoato di propile» scambia le due metà dell'estere.`,
    },
    {
      id: 'example-boiling-point-order',
      title: 'Ordinare i punti di ebollizione',
      problemMd: md`Mettete questi composti di massa molare simile in ordine di punto di ebollizione crescente: propan-1-olo ($M = 60$), butano ($58$), acido etanoico ($60$), propanale ($58$).`,
      steps: [
        md`A parità di massa le forze di London sono simili, quindi decidono i gruppi funzionali.`,
        md`Il butano è apolare: solo forze di London, il punto di ebollizione più basso.`,
        md`Il propanale ha un $\mathrm{C{=}O}$ polare (dipolo–dipolo) ma nessun $\mathrm{O{-}H}$, quindi non forma legami a idrogeno con sé stesso.`,
        md`Il propan-1-olo forma legami a idrogeno attraverso l'$\mathrm{O{-}H}$; l'acido etanoico ne forma di più forti, attraverso sia l'$\mathrm{O{-}H}$ sia il $\mathrm{C{=}O}$, spesso a coppie.`,
      ],
      answerMd: md`Butano < propanale < propan-1-olo < acido etanoico. Ordinare solo per massa molare metterebbe insieme butano e propanale e trascurerebbe i legami a idrogeno, che decidono l'ordine.`,
    },
  ],
  traps: [
    {
      title: 'Scambiare ogni C=O per un chetone',
      md: md`Aldeidi, chetoni, acidi, esteri e ammidi contengono tutti $\mathrm{C{=}O}$. Guardate i vicini del carbonio carbonilico: solo due atomi di carbonio vicini fanno un chetone.`,
    },
    {
      title: `Numerare dall'estremità sbagliata`,
      md: md`Numerate in modo che il gruppo principale, o il doppio legame, abbia il numero più basso possibile. «Butan-3-olo» non è un nome valido: è il butan-2-olo contato dall'altra parte.`,
    },
    {
      title: 'Includere o no una ramificazione nella catena più lunga',
      md: md`Le formule scritte nascondono la forma. In $\mathrm{CH_3CH(CH_2CH_3)CH_3}$ la catena più lunga passa per la ramificazione etilica e ha quattro atomi di carbonio: il composto è il 2-metilbutano, non il 2-etilpropano. Seguite ogni percorso prima di scegliere la radice.`,
    },
    {
      title: `Scambiare le due metà di un estere`,
      md: md`In italiano il nome di un estere comincia dalla parte dell'acido, con desinenza -oato, seguita da «di» e dal gruppo alchilico legato all'ossigeno; in inglese l'ordine è rovesciato. $\mathrm{CH_3COOCH_2CH_3}$ è l'etanoato di etile (*ethyl ethanoate*); $\mathrm{HCOOCH_2CH_3}$ è il metanoato di etile (*ethyl methanoate*).`,
    },
  ],
  check: [
    {
      id: 'check-which-is-ketone',
      title: 'Riconoscere un chetone',
      topic: 'Chimica organica',
      stemMd: md`Quale di questi composti è un chetone?`,
      options: [
        { id: 'A', text: md`$\mathrm{CH_3CH_2CHO}$`, note: md`Il carbonile è a fine catena con un idrogeno legato: è un'aldeide, il propanale.` },
        { id: 'B', text: md`$\mathrm{CH_3COCH_3}$`, note: '' },
        { id: 'C', text: md`$\mathrm{CH_3COOCH_3}$`, note: md`Il carbonio carbonilico è legato anche a un ossigeno che porta un metile: è un estere, l'etanoato di metile.` },
        { id: 'D', text: md`$\mathrm{CH_3CH_2OCH_3}$`, note: md`Qui non c'è $\mathrm{C{=}O}$; un ossigeno fra due gruppi di carbonio è un etere.` },
        { id: 'E', text: md`$\mathrm{CH_3CONH_2}$`, note: md`Il carbonio carbonilico è legato all'azoto: è un'ammide, l'etanammide.` },
      ],
      answer: 'B',
      workingMd: md`Un chetone ha il carbonio carbonilico legato ad altri due atomi di carbonio. Nel propanone, $\mathrm{CH_3COCH_3}$, il carbonio del $\mathrm{C{=}O}$ sta fra due metili. Gli altri hanno H, $\mathrm{O{-}R}$ o N sul carbonile, oppure non hanno affatto un carbonile.`,
      lesson: md`Classificate un composto carbonilico in base agli atomi legati al carbonio carbonilico.`,
    },
    {
      id: 'check-alkane-formula',
      title: 'Quale formula è di un alcano?',
      topic: 'Idrocarburi',
      stemMd: md`Quale formula molecolare appartiene a un alcano a catena aperta (non ciclico)?`,
      options: [
        { id: 'A', text: md`$\mathrm{C_6H_6}$`, note: md`È il benzene, un arene, molto lontano dalla $\mathrm{C_nH_{2n+2}}$ di un alcano.` },
        { id: 'B', text: md`$\mathrm{C_6H_{10}}$`, note: md`$\mathrm{C_nH_{2n-2}}$ corrisponde a un alchino, a un diene o a un cicloalchene, non a un alcano.` },
        { id: 'C', text: md`$\mathrm{C_6H_{12}}$`, note: md`$\mathrm{C_nH_{2n}}$ corrisponde a un alchene o a un cicloalcano come il cicloesano, non a un alcano a catena aperta.` },
        { id: 'D', text: md`$\mathrm{C_6H_{13}}$`, note: md`Un idrocarburo neutro stabile ha sempre un numero pari di atomi di idrogeno; questo è un frammento (un gruppo esile), non una molecola.` },
        { id: 'E', text: md`$\mathrm{C_6H_{14}}$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Gli alcani a catena aperta seguono $\mathrm{C_nH_{2n+2}}$. Con $n = 6$ si hanno $2 \times 6 + 2 = 14$ atomi di idrogeno: $\mathrm{C_6H_{14}}$, l'esano o uno dei suoi isomeri ramificati.`,
      lesson: md`Confrontate la formula di un idrocarburo con CnH2n+2, CnH2n e CnH2n−2 per trovarne le famiglie possibili.`,
    },
    {
      id: 'check-name-secondary-alcohol',
      title: 'Il nome di un alcol',
      topic: 'Nomenclatura organica',
      stemMd: md`Qual è il nome sistematico di $\mathrm{CH_3CH(OH)CH_2CH_3}$?`,
      options: [
        { id: 'A', text: md`butan-1-olo`, note: md`Nel butan-1-olo l'$\mathrm{OH}$ è su un carbonio terminale; qui è sul secondo carbonio della catena.` },
        { id: 'B', text: md`butan-3-olo`, note: md`Numera la catena dall'estremità sbagliata; contando dall'altra parte si ottiene il numero più basso, 2.` },
        { id: 'C', text: md`butan-2-olo`, note: '' },
        { id: 'D', text: md`butanale`, note: md`Il butanale è un'aldeide, $\mathrm{CH_3CH_2CH_2CHO}$; questo composto ha un $\mathrm{OH}$, non un $\mathrm{C{=}O}$.` },
        { id: 'E', text: md`2-metilpropan-1-olo`, note: md`È un isomero a catena ramificata; questo composto ha una catena lineare di quattro atomi di carbonio.` },
      ],
      answer: 'C',
      workingMd: md`La catena ha quattro atomi di carbonio in fila (butano) e un gruppo $\mathrm{OH}$ (desinenza -olo). Numerando da sinistra l'$\mathrm{OH}$ è sul carbonio 2, da destra sul 3; vince il numero più basso: butan-2-olo.`,
      lesson: md`Numerate la catena in modo che il gruppo funzionale principale abbia il numero più basso possibile.`,
    },
  ],
  takeaways: [
    md`Gli alcani sono $\mathrm{C_nH_{2n+2}}$, alcheni e cicloalcani $\mathrm{C_nH_{2n}}$, gli alchini $\mathrm{C_nH_{2n-2}}$.`,
    md`Un composto carbonilico si riconosce da ciò che è legato al carbonio carbonilico: H, due atomi di carbonio, OH, OR o N.`,
    md`Il nome parte dalla catena più lunga che contiene il gruppo principale, numerata per dare a quel gruppo il numero più basso.`,
    md`I legami a idrogeno spiegano perché, a parità di massa, gli acidi bollono più in alto degli alcoli, e questi più di aldeidi, chetoni e alcani.`,
  ],
  flashcards: [
    { front: 'Formule generali degli idrocarburi', back: md`Alcani $\mathrm{C_nH_{2n+2}}$; alcheni e cicloalcani $\mathrm{C_nH_{2n}}$; alchini $\mathrm{C_nH_{2n-2}}$.` },
    { front: 'Aldeide o chetone?', back: md`Un'aldeide ha il C=O a fine catena, con un H sul carbonio carbonilico (-ale); un chetone lo ha fra due atomi di carbonio (-one).` },
    { front: 'Nome di un estere', back: md`Prima la parte dell'acido con desinenza -oato, poi «di» e il gruppo alchilico sull'ossigeno: $\mathrm{CH_3COOCH_3}$ è l'etanoato di metile (*methyl ethanoate*).` },
    { front: 'Alcol primario, secondario, terziario', back: md`Il carbonio che porta l'OH è legato a uno, due o tre altri atomi di carbonio.` },
    { front: 'Ordine dei punti di ebollizione a parità di massa', back: md`Alcano < aldeide o chetone < alcol < acido carbossilico, per effetto dei dipoli e poi dei legami a idrogeno.` },
    { front: 'Legame peptidico', back: md`Il legame ammidico che unisce gli amminoacidi in una proteina.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-organic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const isomerismAndOrganicReactionsLessonIt: Lesson = {
  slug: 'isomerism-and-organic-reactions',
  title: 'Isomeria e reazioni organiche',
  summary: md`Isomeri strutturali, geometrici e ottici, centri chirali, e i prodotti di addizione, sostituzione, ossidazione ed esterificazione.`,
  minutes: 22,
  objectives: [
    md`Distinguere isomeri di catena, di posizione e di gruppo funzionale, e contare semplici isomeri di struttura.`,
    md`Stabilire se una molecola presenta isomeria cis–trans o ha un centro chirale.`,
    md`Prevedere i prodotti delle principali reazioni di alcani, alcheni, alcoli e acidi carbossilici.`,
  ],
  teachMd: md`
### Isomeri: stessa formula, struttura diversa

Gli **isomeri** (*isomers*) hanno la stessa formula molecolare ma una diversa disposizione degli atomi, quindi sono composti diversi con proprietà diverse. Ce ne sono due grandi tipi. Negli **isomeri di struttura** (*structural isomers*) gli atomi sono legati in un ordine diverso. Negli **stereoisomeri** (*stereoisomers*) gli atomi sono legati nello stesso ordine ma disposti diversamente nello spazio.

### Isomeri di struttura

- Gli **isomeri di catena** differiscono nello scheletro di carbonio. $\mathrm{C_4H_{10}}$ ne ha due: butano e 2-metilpropano. $\mathrm{C_5H_{12}}$ ne ha tre: pentano, 2-metilbutano e 2,2-dimetilpropano.
- Gli **isomeri di posizione** hanno lo stesso gruppo in un punto diverso: propan-1-olo e propan-2-olo; but-1-ene e but-2-ene.
- Gli **isomeri di gruppo funzionale** hanno gruppi del tutto diversi: etanolo e metossimetano ($\mathrm{C_2H_6O}$); propanale e propanone ($\mathrm{C_3H_6O}$); acido propanoico ed etanoato di metile ($\mathrm{C_3H_6O_2}$).

Quando contate gli isomeri, date un nome a ogni struttura che disegnate. Due disegni con lo stesso nome sono la stessa molecola: un «3-metilbutano» è il 2-metilbutano numerato dall'altra parte, e piegare una catena sulla carta non crea un composto nuovo.

### Isomeri cis–trans (geometrici)

Intorno a un doppio legame $\mathrm{C{=}C}$ non c'è libera rotazione. Se **ciascun** carbonio del doppio legame porta due gruppi diversi, i gruppi si possono disporre in due modi: dallo stesso lato (**cis**) o da lati opposti (**trans**). Il but-2-ene, $\mathrm{CH_3CH{=}CHCH_3}$, ha una forma cis e una trans. Il but-1-ene, $\mathrm{CH_2{=}CHCH_2CH_3}$, no, perché un carbonio del doppio legame porta due idrogeni; e nemmeno il 2-metilpropene, il cui altro carbonio porta due metili. Gli isomeri cis e trans hanno proprietà fisiche diverse, come i punti di ebollizione e di fusione. (Il sistema più generale E/Z applica la stessa idea quando tre o quattro gruppi diversi rendono ambigui «cis» e «trans».)

### Isomeri ottici e chiralità

Un atomo di carbonio legato a **quattro gruppi diversi** è un **centro chirale** (*chiral centre*). I suoi quattro gruppi si possono disporre in due modi che sono l'uno l'immagine speculare dell'altro e non sono sovrapponibili, come una mano sinistra e una destra. Le due forme sono **enantiomeri** (*enantiomers*). Hanno punti di fusione, punti di ebollizione e solubilità identici, ma ruotano la luce polarizzata (*plane-polarised light*) dello stesso angolo in versi opposti. Una miscela 50:50 dei due, detta **miscela racemica** (*racemic mixture*), non mostra alcuna rotazione.

Gli enantiomeri si comportano diversamente anche verso altre molecole chirali, come enzimi e recettori, che sono a loro volta chirali. Per questo i due enantiomeri di un farmaco possono avere effetti diversi. Quasi tutti gli amminoacidi sono chirali (fa eccezione la glicina, con due idrogeni sul carbonio centrale), e le proteine sono costruite con le forme L.

Per trovare in fretta un centro chirale, scartate ogni carbonio che porta due gruppi identici: un $\mathrm{CH_3}$, un $\mathrm{CH_2}$ in una catena o un carbonio di un doppio legame non possono esserlo.

### Le reazioni degli idrocarburi

Gli **alcani** sono poco reattivi. Bruciano (la combustione completa dà $\mathrm{CO_2}$ e $\mathrm{H_2O}$; con poco ossigeno si forma monossido di carbonio) e reagiscono con gli alogeni alla luce ultravioletta per **sostituzione**, una reazione radicalica: $\mathrm{CH_4 + Cl_2 \rightarrow CH_3Cl + HCl}$.

Gli **alcheni** reagiscono per **addizione** al doppio legame, che diventa semplice:

| Reagente | Prodotto | Nota |
| --- | --- | --- |
| $\mathrm{H_2}$, catalizzatore di nichel o platino | alcano | idrogenazione |
| $\mathrm{Br_2}$ | dibromoalcano | l'acqua di bromo passa da arancione a incolore: il saggio per $\mathrm{C{=}C}$ |
| $\mathrm{HBr}$ | bromoalcano | H va sul carbonio che ha già più H |
| $\mathrm{H_2O}$, catalizzatore acido | alcol | idratazione |

La regola della terza riga (regola di Markovnikov) fa sì che propene e $\mathrm{HBr}$ diano soprattutto 2-bromopropano. Gli alcheni si uniscono anche in lunghe catene per **polimerizzazione per addizione**: l'etene dà il polietilene, poli(etene).

Il **benzene**, nonostante la sua formula, non decolora l'acqua di bromo. Il suo anello delocalizzato è così stabile che reagisce per **sostituzione**, conservando l'anello, anziché per addizione.

### Le reazioni di alcoli e acidi carbossilici

Il dicromato di potassio acidificato ossida gli alcoli e passa da arancione a verde man mano che si forma $\mathrm{Cr^{3+}}$. Che cosa accade dipende dalla classe dell'alcol:

- primario: ad aldeide, e poi ad acido carbossilico;
- secondario: a chetone, che non va oltre;
- terziario: nessuna ossidazione.

Il motivo è che l'ossidazione toglie un idrogeno dal carbonio che porta l'$\mathrm{OH}$, e un alcol terziario lì non ne ha. Scaldati con acido solforico concentrato, gli alcoli perdono acqua (**eliminazione**, o disidratazione) e danno alcheni.

Un acido carbossilico e un alcol, scaldati con un catalizzatore acido, danno un **estere** e acqua. È una **condensazione**, ed è reversibile:

$$\mathrm{CH_3COOH + CH_3CH_2OH \rightleftharpoons CH_3COOCH_2CH_3 + H_2O}$$

La reazione inversa, la scissione a opera dell'acqua, è l'**idrolisi**; con idrossido di sodio va a completezza e dà il sale carbossilato e l'alcol: è così che si fanno i saponi dai grassi (saponificazione). Un acido e un'ammina condensano allo stesso modo dando un'ammide; è il legame peptidico delle proteine.
`,
  examples: [
    {
      id: 'example-cis-trans-c4h8',
      title: 'Quale alchene ha forme cis e trans?',
      problemMd: md`Tre alcheni hanno formula $\mathrm{C_4H_8}$: but-1-ene, but-2-ene e 2-metilpropene. Quale di essi presenta isomeria cis–trans?`,
      steps: [
        md`Controllate ogni carbonio del doppio legame: entrambi devono portare due gruppi diversi.`,
        md`But-1-ene, $\mathrm{CH_2{=}CHCH_2CH_3}$: il carbonio 1 porta due idrogeni. Niente isomeri cis–trans.`,
        md`But-2-ene, $\mathrm{CH_3CH{=}CHCH_3}$: ogni carbonio porta un H e un $\mathrm{CH_3}$. Esistono la forma cis (i due metili dallo stesso lato) e la trans (da lati opposti).`,
        md`2-metilpropene, $\mathrm{(CH_3)_2C{=}CH_2}$: un carbonio porta due metili, l'altro due idrogeni. Niente isomeri cis–trans.`,
      ],
      answerMd: md`Solo il but-2-ene. I tre composti sono isomeri di struttura fra loro, quindi gli alcheni $\mathrm{C_4H_8}$ in tutto sono quattro: but-1-ene, cis-but-2-ene, trans-but-2-ene e 2-metilpropene. Supporre che ogni alchene abbia forme cis e trans è l'errore tentatore.`,
    },
    {
      id: 'example-find-chiral-centres',
      title: 'Trovare i centri chirali',
      problemMd: md`Quale di questi composti ha un centro chirale: 2-clorobutano $\mathrm{CH_3CHClCH_2CH_3}$, 2-cloropropano $\mathrm{CH_3CHClCH_3}$ e acido lattico $\mathrm{CH_3CH(OH)COOH}$?`,
      steps: [
        md`2-clorobutano: il carbonio 2 porta H, Cl, $\mathrm{CH_3}$ e $\mathrm{CH_2CH_3}$. Quattro gruppi diversi, quindi è un centro chirale.`,
        md`2-cloropropano: il carbonio 2 porta H, Cl e due gruppi $\mathrm{CH_3}$. Due sono uguali, quindi non è chirale.`,
        md`Acido lattico: il carbonio centrale porta H, $\mathrm{OH}$, $\mathrm{CH_3}$ e $\mathrm{COOH}$. Quattro gruppi diversi: chirale.`,
      ],
      answerMd: md`Il 2-clorobutano e l'acido lattico hanno ciascuno un centro chirale ed esistono come coppia di enantiomeri; il 2-cloropropano non ne ha. Considerare chirale un carbonio solo perché porta un alogeno o un $\mathrm{OH}$ è la trappola: tutti e quattro i gruppi devono essere diversi.`,
    },
    {
      id: 'example-oxidise-then-esterify',
      title: `Dall'alcol all'acido all'estere`,
      problemMd: md`Il propan-1-olo viene scaldato a riflusso con un eccesso di dicromato di potassio acidificato. Il prodotto organico viene poi scaldato con metanolo e un po' di acido solforico concentrato. Date il nome ai due prodotti organici. Che cosa darebbero con il dicromato il propan-2-olo e il 2-metilpropan-2-olo?`,
      steps: [
        md`Il propan-1-olo è primario. Con un eccesso di ossidante e il riflusso va oltre l'aldeide, il propanale, fino all'acido carbossilico: l'acido propanoico, $\mathrm{CH_3CH_2COOH}$.`,
        md`Acido propanoico e metanolo condensano in un estere e acqua: $\mathrm{CH_3CH_2COOH + CH_3OH \rightleftharpoons CH_3CH_2COOCH_3 + H_2O}$.`,
        md`Il nome dell'estere: propanoato dall'acido, metile dall'alcol, quindi propanoato di metile, $\mathrm{C_4H_8O_2}$ (C $2 + 1 + 1 = 4$, H $5 + 3 = 8$).`,
        md`Il propan-2-olo è secondario e dà propanone. Il 2-metilpropan-2-olo è terziario: non si ossida, e il dicromato resta arancione.`,
      ],
      answerMd: md`Acido propanoico, poi propanoato di metile. Il propan-2-olo dà propanone; l'alcol terziario non reagisce. «Metanoato di propile» è il nome sbagliato più tentatore: scambia la parte che viene dall'acido.`,
    },
  ],
  traps: [
    {
      title: 'Contare due volte la stessa molecola',
      md: md`Disegnando isomeri, una catena piegata sulla pagina o numerata dall'altra parte è lo stesso composto. Date a ogni struttura il suo nome corretto: i doppioni saltano subito all'occhio.`,
    },
    {
      title: 'Supporre che ogni alchene abbia forme cis e trans',
      md: md`Entrambi i carboni del doppio legame devono portare due gruppi diversi. Un'estremità $\mathrm{{=}CH_2}$, o un carbonio con due gruppi uguali, la esclude.`,
    },
    {
      title: 'Ossidare un chetone o un alcol terziario',
      md: md`Un alcol secondario si ferma al chetone; un alcol terziario non reagisce. Solo gli alcoli primari proseguono, attraverso l'aldeide, fino all'acido carbossilico.`,
    },
    {
      title: 'Aspettarsi che il benzene addizioni il bromo',
      md: md`Sulla carta il benzene è insaturo, ma il suo anello delocalizzato lo fa reagire per sostituzione anziché per addizione. Non decolora l'acqua di bromo come fa un alchene.`,
    },
  ],
  check: [
    {
      id: 'check-pentane-isomers',
      title: 'Gli isomeri di C5H12',
      topic: 'Isomeria',
      stemMd: md`Quanti isomeri di struttura hanno formula molecolare $\mathrm{C_5H_{12}}$?`,
      options: [
        { id: 'A', text: md`1`, note: md`Conta solo la catena lineare, il pentano; anche le catene ramificate con la stessa formula sono isomeri.` },
        { id: 'B', text: md`2`, note: md`Dimentica il 2,2-dimetilpropano, in cui un carbonio centrale porta quattro gruppi metile.` },
        { id: 'C', text: md`3`, note: '' },
        { id: 'D', text: md`4`, note: md`Conta come nuovo il «3-metilbutano», che è il 2-metilbutano numerato dall'altra parte.` },
        { id: 'E', text: md`5`, note: md`Aggiunge anelli come il ciclopentano, ma gli anelli hanno formula $\mathrm{C_5H_{10}}$, non $\mathrm{C_5H_{12}}$.` },
      ],
      answer: 'C',
      workingMd: md`Cinque atomi di carbonio in fila: pentano. Quattro in fila con una ramificazione metilica: 2-metilbutano (la ramificazione può stare solo sul carbonio 2, perché sul carbonio 1 allungherebbe la catena). Tre in fila con due metili sul carbonio centrale: 2,2-dimetilpropano. In tutto tre.`,
      lesson: md`Accorciate la catena principale di un carbonio alla volta e sistemate le ramificazioni senza ripetere una struttura.`,
    },
    {
      id: 'check-which-is-chiral',
      title: 'Quale molecola è chirale?',
      topic: 'Isomeria ottica',
      stemMd: md`Quale di queste molecole contiene un centro chirale?`,
      options: [
        { id: 'A', text: md`propan-2-olo, $\mathrm{CH_3CH(OH)CH_3}$`, note: md`Il carbonio che porta l'$\mathrm{OH}$ porta anche due gruppi $\mathrm{CH_3}$ identici.` },
        { id: 'B', text: md`1-bromobutano, $\mathrm{CH_2BrCH_2CH_2CH_3}$`, note: md`Ogni carbonio porta almeno due idrogeni, quindi nessuno ha quattro gruppi diversi.` },
        { id: 'C', text: md`diclorometano, $\mathrm{CH_2Cl_2}$`, note: md`L'unico carbonio porta due H e due Cl: solo due tipi di gruppo.` },
        { id: 'D', text: md`glicina, $\mathrm{H_2NCH_2COOH}$`, note: md`Il suo carbonio centrale porta due idrogeni; la glicina è l'amminoacido che non è chirale.` },
        { id: 'E', text: md`2-bromobutano, $\mathrm{CH_3CHBrCH_2CH_3}$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Nel 2-bromobutano il carbonio 2 porta H, Br, $\mathrm{CH_3}$ e $\mathrm{CH_2CH_3}$: quattro gruppi diversi, quindi è un centro chirale e la molecola ha due enantiomeri. Ciascuna delle altre ha un gruppo ripetuto su ogni carbonio.`,
      lesson: md`Un centro chirale richiede quattro gruppi diversi; qualsiasi doppione, anche due idrogeni, lo esclude.`,
    },
    {
      id: 'check-oxidise-propan-2-ol',
      title: 'Ossidare un alcol secondario',
      topic: 'Reazioni organiche',
      stemMd: md`Il propan-2-olo viene scaldato con un eccesso di dicromato di potassio acidificato. Qual è il prodotto organico?`,
      options: [
        { id: 'A', text: md`propanone`, note: '' },
        { id: 'B', text: md`propanale`, note: md`Un'aldeide deriva da un alcol primario, il propan-1-olo; qui l'$\mathrm{OH}$ è sul carbonio centrale.` },
        { id: 'C', text: md`acido propanoico`, note: md`Solo gli alcoli primari arrivano agli acidi carbossilici; un chetone non si ossida oltre, nemmeno con un eccesso di dicromato.` },
        { id: 'D', text: md`propene`, note: md`Un alchene si ottiene per disidratazione con acido solforico concentrato a caldo, non per ossidazione.` },
        { id: 'E', text: md`Non avviene alcuna reazione`, note: md`Questo vale per gli alcoli terziari; un alcol secondario ha ancora un idrogeno sul carbonio che porta l'$\mathrm{OH}$.` },
      ],
      answer: 'A',
      workingMd: md`Il propan-2-olo è un alcol secondario: il suo carbonio con l'$\mathrm{OH}$ è legato a due atomi di carbonio e a un idrogeno. L'ossidazione toglie quell'idrogeno e l'idrogeno dell'$\mathrm{OH}$, dando il chetone propanone, $\mathrm{CH_3COCH_3}$, che resiste a un'ulteriore ossidazione.`,
      lesson: md`Classificate prima l'alcol: primario ad aldeide e poi acido, secondario a chetone, terziario nessuna reazione.`,
    },
  ],
  takeaways: [
    md`Gli isomeri di struttura differiscono nell'ordine dei legami; gli stereoisomeri solo nella disposizione nello spazio.`,
    md`L'isomeria cis–trans richiede un C=C con due gruppi diversi su ciascun carbonio; un centro chirale richiede un carbonio con quattro gruppi diversi.`,
    md`Gli alcheni danno addizione, benzene e alcani sostituzione; l'acqua di bromo viene decolorata solo dagli alcheni.`,
    md`Gli alcoli primari si ossidano ad aldeidi e poi ad acidi, i secondari a chetoni, i terziari per nulla; acido più alcol dà estere e acqua.`,
  ],
  flashcards: [
    { front: 'Isomeri di struttura e stereoisomeri', back: md`Gli isomeri di struttura legano gli atomi in un ordine diverso. Gli stereoisomeri li legano nello stesso ordine ma li dispongono diversamente nello spazio.` },
    { front: 'Condizione per l\'isomeria cis–trans', back: md`Un doppio legame C=C in cui ciascuno dei due carboni porta due gruppi diversi.` },
    { front: 'Centro chirale', back: md`Un atomo di carbonio legato a quattro gruppi diversi. Dà due enantiomeri, immagini speculari non sovrapponibili.` },
    { front: 'In che cosa differiscono gli enantiomeri', back: md`Ruotano la luce polarizzata in versi opposti e interagiscono diversamente con altre molecole chirali come gli enzimi; le altre proprietà fisiche sono identiche.` },
    { front: 'Saggio per un doppio legame C=C', back: md`L'acqua di bromo passa da arancione a incolore perché il bromo si addiziona al doppio legame.` },
    { front: 'Ossidazione degli alcoli con dicromato acidificato', back: md`Primario: aldeide, poi acido carbossilico. Secondario: chetone. Terziario: nessuna reazione. Quando reagisce, il dicromato passa da arancione a verde.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-organic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};
