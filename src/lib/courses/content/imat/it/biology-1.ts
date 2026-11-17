import { md, type Lesson } from '../../../types';

/**
 * IMAT, biologia, parte 1: la versione italiana di ../biology-1.ts, con gli
 * stessi slug, gli stessi minuti, le stesse chiavi delle verifiche e gli
 * stessi collegamenti alla pratica.
 */

export const biologicalMoleculesLessonIt: Lesson = {
  slug: 'biological-molecules',
  title: md`Le molecole biologiche: dall'acqua agli acidi nucleici`,
  summary: md`Acqua, carboidrati, lipidi, proteine e acidi nucleici: come sono costruiti, quali legami li tengono insieme e come contare monomeri, legami e basi.`,
  minutes: 22,
  objectives: [
    md`Spiegare come la polarità dell'acqua le dia le proprietà da cui dipendono i viventi.`,
    md`Indicare i monomeri, i legami e gli esempi principali di carboidrati, lipidi, proteine e acidi nucleici.`,
    md`Contare reazioni di condensazione e di idrolisi, legami peptidici e percentuali di basi nel DNA a doppio filamento.`,
  ],
  teachMd: md`
### Perché si comincia dalla chimica

I viventi sono costituiti soprattutto da sei elementi: carbonio, idrogeno, ossigeno, azoto, fosforo e zolfo. Molecole piccole (zuccheri, amminoacidi, nucleotidi) si uniscono a formare molecole grandi (polisaccaridi, proteine, acidi nucleici). La reazione di unione è una **condensazione** (*condensation*): ogni nuovo legame tra due monomeri libera una molecola d'acqua. La reazione inversa, l'**idrolisi** (*hydrolysis*), rompe un legame e consuma una molecola d'acqua. Quasi tutti i calcoli di questo argomento poggiano su questa regola: un legame, una molecola d'acqua.

### L'acqua

La molecola d'acqua è **polare**: l'ossigeno attira verso di sé gli elettroni condivisi, per cui porta una parziale carica negativa e i due idrogeni una parziale carica positiva. Molecole vicine si attraggono con **legami a idrogeno** (*hydrogen bonds*). Da qui vengono le proprietà che la biologia sfrutta:

- scioglie ioni e molecole polari (sostanze idrofile), per cui è il mezzo del citoplasma, del sangue e della linfa; le sostanze apolari (idrofobe) non si sciolgono e tendono ad aggregarsi;
- ha un elevato calore specifico, per cui la temperatura corporea e quella dei laghi cambiano lentamente;
- ha un elevato calore di evaporazione, per cui il sudore che evapora sottrae molto calore;
- la coesione tra le molecole dà la tensione superficiale e permette alle colonne d'acqua di risalire nello xilema;
- il ghiaccio è meno denso dell'acqua liquida, per cui galleggia e isola l'acqua sottostante.

### I carboidrati

Tra gli zuccheri semplici (monosaccaridi) ci sono i pentosi ribosio e desossiribosio e gli esosi glucosio, fruttosio e galattosio, tutti $\mathrm{C_6H_{12}O_6}$. Il glucosio esiste nelle forme **alfa** e **beta**, che differiscono per la posizione dell'ossidrile sul carbonio 1. Due monosaccaridi uniti da un **legame glicosidico** (*glycosidic bond*) formano un disaccaride:

| Disaccaride | Composto da |
| --- | --- |
| maltosio | glucosio + glucosio |
| saccarosio | glucosio + fruttosio |
| lattosio | glucosio + galattosio |

I polisaccaridi sono lunghe catene di glucosio con legami e funzioni diversi:

| Polisaccaride | Legami | Funzione |
| --- | --- | --- |
| amilosio (amido) | alfa-1,4, non ramificato, avvolto a elica | riserva energetica delle piante |
| amilopectina (amido) | alfa-1,4 con ramificazioni alfa-1,6 | riserva energetica delle piante |
| glicogeno | alfa-1,4 con ramificazioni alfa-1,6 più frequenti | riserva energetica di animali (fegato, muscoli) e funghi |
| cellulosa | beta-1,4, catene diritte | parete cellulare delle piante |

Le ramificazioni danno molte estremità di catena, per cui gli enzimi liberano rapidamente glucosio dal glicogeno. Le catene di cellulosa si affiancano, unite da legami a idrogeno, in fibre robuste; l'uomo non ha enzimi capaci di idrolizzare il legame beta-1,4. La chitina, un polisaccaride modificato contenente azoto, forma la parete cellulare dei funghi e l'esoscheletro degli artropodi.

### I lipidi

I lipidi sono un gruppo eterogeneo, definito dall'insolubilità in acqua; non sono polimeri. Un **trigliceride** è una molecola di glicerolo unita a tre acidi grassi da **legami estere** (*ester bonds*), per cui la sua formazione libera tre molecole d'acqua. Gli acidi grassi saturi non hanno doppi legami carbonio-carbonio e hanno catene diritte che si impacchettano strettamente (grassi solidi a temperatura ambiente); gli insaturi hanno uno o più doppi legami che piegano la catena (oli). A parità di massa, i lipidi immagazzinano circa il doppio dell'energia dei carboidrati.

Un **fosfolipide** ha glicerolo, due acidi grassi e un gruppo contenente fosfato: una testa idrofila e due code idrofobe. In acqua i fosfolipidi formano doppi strati, la base di ogni membrana cellulare. Gli **steroidi**, come il colesterolo e gli ormoni sessuali, sono costruiti su quattro anelli di carbonio condensati.

### Le proteine

Un amminoacido ha un carbonio centrale legato a un gruppo amminico, a un gruppo carbossilico, a un atomo di idrogeno e a una catena laterale (**gruppo R**). Nelle proteine se ne usano venti tipi, che differiscono solo per il gruppo R. Un **legame peptidico** (*peptide bond*) si forma per condensazione tra il gruppo carbossilico di un amminoacido e il gruppo amminico del successivo, per cui una catena di $n$ amminoacidi ha $n - 1$ legami peptidici.

- **Struttura primaria**: la sequenza degli amminoacidi.
- **Struttura secondaria**: alfa eliche e foglietti beta, tenuti da legami a idrogeno tra gruppi dello scheletro.
- **Struttura terziaria**: il ripiegamento dell'intera catena, tenuto da interazioni tra gruppi R (legami a idrogeno, legami ionici, ponti disolfuro tra cisteine, interazioni idrofobiche).
- **Struttura quaternaria**: due o più catene insieme, come nell'emoglobina, che ne ha quattro.

Il calore o un pH estremo **denaturano** una proteina: si rompono i legami dei livelli superiori e si perdono la forma e la funzione, ma i legami peptidici, e quindi la struttura primaria, restano.

### Gli acidi nucleici

Un **nucleotide** è formato da uno zucchero pentoso, un gruppo fosfato e una base azotata. I **legami fosfodiesterici** (*phosphodiester bonds*) uniscono lo zucchero di un nucleotide al fosfato del successivo, formando uno scheletro zucchero-fosfato.

| | DNA | RNA |
| --- | --- | --- |
| zucchero | desossiribosio | ribosio |
| basi | A, T, G, C | A, U, G, C |
| filamenti | di solito due, a doppia elica | di solito uno |

Adenina e guanina sono **purine** (due anelli); citosina, timina e uracile sono **pirimidine** (un anello). Nel DNA a doppio filamento A si appaia con T e G con C, per cui la quantità di A è uguale a quella di T e la quantità di G a quella di C. Anche l'ATP, il trasportatore di energia della cellula, è un nucleotide: adenina, ribosio e tre fosfati.
`,
  examples: [
    {
      id: 'example-counting-water',
      title: md`Molecole d'acqua liberate nella sintesi di una proteina`,
      problemMd: md`Una proteina è formata da due catene polipeptidiche, una di 141 amminoacidi e una di 146. Quante molecole d'acqua sono state liberate nella formazione dei legami peptidici di questa proteina?`,
      steps: [
        md`Ogni legame peptidico nasce da una condensazione, che libera una molecola d'acqua. Bisogna quindi contare i legami peptidici.`,
        md`Una catena di $n$ amminoacidi ha $n - 1$ legami peptidici: $141 - 1 = 140$ e $146 - 1 = 145$.`,
        md`Le due catene sono polipeptidi separati, quindi si sommano i loro legami: $140 + 145 = 285$.`,
        md`Verifica per l'altra strada: $141 + 146 = 287$ amminoacidi in due catene danno $287 - 2 = 285$ legami.`,
      ],
      answerMd: md`285 molecole d'acqua. La risposta sbagliata più allettante è 286, che tratta i 287 amminoacidi come un'unica catena; ogni catena separata ha un legame in meno dei suoi amminoacidi.`,
    },
    {
      id: 'example-chargaff',
      title: md`Percentuali di basi nel DNA a doppio filamento`,
      problemMd: md`In un campione di DNA a doppio filamento il 28% delle basi è timina. Qual è la percentuale di guanina?`,
      steps: [
        md`Nel DNA a doppio filamento A si appaia con T, quindi A = T = 28%.`,
        md`A e T insieme fanno $28 + 28 = 56$%, e restano $100 - 56 = 44$% per G e C.`,
        md`G si appaia con C, quindi sono uguali: $44 \div 2 = 22$%.`,
      ],
      answerMd: md`22% di guanina. Rispondere 28% (come se tutte le basi fossero uguali) o 72% (100 meno la timina) significa ignorare la regola dell'appaiamento. La regola vale per il DNA a doppio filamento: per l'RNA o il DNA a singolo filamento non si può dedurre nulla.`,
    },
    {
      id: 'example-identify-polysaccharide',
      title: md`Riconoscere un polisaccaride dalla sua idrolisi`,
      problemMd: md`Un polisaccaride estratto da un tessuto vegetale viene idrolizzato completamente e dà solo glucosio. Le sue catene non sono ramificate e sono unite da legami glicosidici beta-1,4. L'amilasi salivare umana non lo digerisce. Di che cosa si tratta?`,
      steps: [
        md`Solo glucosio all'idrolisi: amido (amilosio, amilopectina), glicogeno e cellulosa soddisfano tutti questa condizione, che da sola non basta.`,
        md`I legami beta-1,4 escludono amido e glicogeno, costruiti con alfa-glucosio.`,
        md`Catene beta-1,4 non ramificate che gli enzimi umani non idrolizzano sono cellulosa.`,
      ],
      answerMd: md`Cellulosa. L'amilosio è la risposta sbagliata più allettante, perché anch'esso è non ramificato e fatto di glucosio, ma i suoi legami sono alfa-1,4 e l'amilasi lo digerisce.`,
    },
  ],
  traps: [
    {
      title: md`Contare un legame di troppo`,
      md: md`Una catena di $n$ monomeri ha $n - 1$ legami, e la sua costruzione ha liberato $n - 1$ molecole d'acqua. Un trigliceride non è una catena: il glicerolo forma tre legami estere separati, quindi tre molecole d'acqua. Quando una molecola ha più catene separate, si sottrae uno per catena.`,
    },
    {
      title: md`Confondere i disaccaridi e gli zuccheri degli acidi nucleici`,
      md: md`Il saccarosio è glucosio + fruttosio; il lattosio è glucosio + galattosio; il maltosio è formato da due glucosi. Il DNA contiene desossiribosio, l'RNA ribosio, e l'uracile sostituisce la timina solo nell'RNA. Imparate le due tabelle: le coppie scambiate sono le risposte sbagliate più allettanti.`,
    },
    {
      title: md`Credere che la denaturazione rompa la catena`,
      md: md`La denaturazione distrugge le strutture secondaria, terziaria e quaternaria, non i legami peptidici. Una proteina denaturata conserva la struttura primaria; solo l'idrolisi rompe i legami peptidici.`,
    },
    {
      title: md`Applicare l'appaiamento delle basi a un singolo filamento`,
      md: md`A = T e G = C valgono per il DNA a doppio filamento. In un singolo filamento, o nell'RNA, le basi possono stare in qualsiasi proporzione; un'opzione che vi applica la regola di Chargaff è sbagliata.`,
    },
  ],
  check: [
    {
      id: 'check-hydrolysis-water',
      title: md`Idrolisi di un polipeptide`,
      topic: md`Chimica dei viventi`,
      stemMd: md`Una singola catena polipeptidica di 120 amminoacidi viene idrolizzata completamente ad amminoacidi liberi. Quante molecole d'acqua vengono consumate?`,
      options: [
        { id: 'A', text: md`118`, note: md`Sottrae due invece di uno; una singola catena di $n$ unità ha $n - 1$ legami, quindi si sottrae uno solo.` },
        { id: 'B', text: md`119`, note: '' },
        { id: 'C', text: md`120`, note: md`Conta una molecola d'acqua per amminoacido, ma l'acqua si consuma per ogni legame peptidico, e i legami sono uno in meno degli amminoacidi.` },
        { id: 'D', text: md`121`, note: md`Aggiunge un legame invece di toglierlo; una catena lineare ha meno legami che unità, non di più.` },
        { id: 'E', text: md`240`, note: md`Conta due molecole d'acqua per amminoacido; per rompere ogni legame peptidico ne serve esattamente una.` },
      ],
      answer: 'B',
      workingMd: md`Una catena di 120 amminoacidi ha $120 - 1 = 119$ legami peptidici. L'idrolisi consuma una molecola d'acqua per ogni legame rotto, quindi 119 molecole d'acqua.`,
      lesson: md`Condensazione e idrolisi vanno a un legame per una molecola d'acqua: contate i legami, non i monomeri.`,
    },
    {
      id: 'check-dna-adenine',
      title: md`Dalla citosina all'adenina`,
      topic: md`Chimica dei viventi`,
      stemMd: md`Un campione di DNA a doppio filamento contiene il 18% di citosina. Qual è la percentuale di adenina tra le sue basi?`,
      options: [
        { id: 'A', text: md`18%`, note: md`Presume che l'adenina sia pari alla citosina; l'adenina si appaia con la timina, quindi è pari alla timina, non alla citosina.` },
        { id: 'B', text: md`64%`, note: md`Questa è la somma di A e T; va divisa in parti uguali tra le due.` },
        { id: 'C', text: md`82%`, note: md`È il 100% meno la citosina, e dimentica che anche la guanina vale il 18%.` },
        { id: 'D', text: md`32%`, note: '' },
        { id: 'E', text: md`36%`, note: md`Questa è la somma di G e C, la quota che non è né adenina né timina.` },
      ],
      answer: 'D',
      workingMd: md`C = G = 18%, quindi G e C insieme fanno il 36%. Resta $100 - 36 = 64$% per A e T, e poiché A = T, l'adenina è $64 \div 2 = 32$%.`,
      lesson: md`Nel DNA a doppio filamento trovate prima la base complementare, poi dividete in parti uguali ciò che resta tra l'altra coppia.`,
    },
    {
      id: 'check-polysaccharides',
      title: md`Quale affermazione è corretta?`,
      topic: md`Chimica dei viventi`,
      stemMd: md`Quale affermazione sui carboidrati è corretta?`,
      options: [
        { id: 'A', text: md`Il glicogeno ha punti di ramificazione alfa-1,6, mentre l'amilosio è una catena non ramificata.`, note: '' },
        { id: 'B', text: md`La cellulosa è un polimero di alfa-glucosio unito da legami alfa-1,4.`, note: md`La cellulosa è fatta di beta-glucosio con legami beta-1,4; le catene alfa-1,4 sono l'amilosio.` },
        { id: 'C', text: md`Il saccarosio è un polisaccaride formato da unità di glucosio e fruttosio.`, note: md`Il saccarosio è formato da glucosio e fruttosio, ma è un disaccaride: uno per tipo.` },
        { id: 'D', text: md`L'amido è il principale polisaccaride di riserva del fegato umano.`, note: md`Gli animali, uomo compreso, immagazzinano il glucosio come glicogeno; l'amido è la riserva delle piante.` },
        { id: 'E', text: md`La chitina è il principale polisaccaride strutturale della parete cellulare delle piante.`, note: md`La parete delle cellule vegetali è soprattutto cellulosa; la chitina si trova nella parete dei funghi e nell'esoscheletro degli artropodi.` },
      ],
      answer: 'A',
      workingMd: md`Il glicogeno è una catena di glucosio con legami alfa-1,4 e frequenti ramificazioni alfa-1,6; l'amilosio ha legami alfa-1,4 e non è ramificato. Tutte le altre affermazioni scambiano un tipo di legame, una classe di grandezza (disaccaride o polisaccaride) o un organismo.`,
      lesson: md`Per i polisaccaridi imparate tre cose insieme: la forma del glucosio, il tipo di legame e dove si trova la molecola.`,
    },
  ],
  takeaways: [
    md`La condensazione costruisce i polimeri e libera una molecola d'acqua per legame; l'idrolisi li scinde e ne consuma una per legame.`,
    md`L'acqua è polare e forma legami a idrogeno: per questo è un solvente, un tampone termico ed è coesa.`,
    md`Amido e glicogeno sono riserve di alfa-glucosio; la cellulosa è una struttura di beta-glucosio.`,
    md`La forma di una proteina (dalla secondaria alla quaternaria) si perde con la denaturazione; la sequenza di amminoacidi no.`,
    md`Nel DNA a doppio filamento A = T e G = C; il DNA ha desossiribosio e timina, l'RNA ribosio e uracile.`,
  ],
  flashcards: [
    { front: md`Condensazione e idrolisi`, back: md`La condensazione unisce due monomeri e libera una molecola d'acqua; l'idrolisi rompe il legame e consuma una molecola d'acqua.` },
    { front: md`Saccarosio, lattosio, maltosio`, back: md`Il saccarosio è glucosio + fruttosio, il lattosio è glucosio + galattosio, il maltosio è glucosio + glucosio.` },
    { front: md`Amido, glicogeno, cellulosa: i legami`, back: md`Amilosio alfa-1,4 non ramificato; amilopectina e glicogeno alfa-1,4 con ramificazioni alfa-1,6 (il glicogeno è più ramificato); cellulosa beta-1,4 a catene diritte.` },
    { front: md`Trigliceride`, back: md`Un glicerolo unito a tre acidi grassi da legami estere; la sua formazione libera tre molecole d'acqua.` },
    { front: md`I quattro livelli di struttura delle proteine`, back: md`Primaria: sequenza di amminoacidi. Secondaria: eliche e foglietti (legami a idrogeno dello scheletro). Terziaria: ripiegamento tridimensionale (interazioni tra gruppi R). Quaternaria: più di una catena.` },
    { front: md`Purine e pirimidine`, back: md`Purine (due anelli): adenina e guanina. Pirimidine (un anello): citosina, timina e uracile.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-molecules-cells' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const cellStructureAndOrganellesLessonIt: Lesson = {
  slug: 'cell-structure-and-organelles',
  title: md`La struttura della cellula e gli organuli`,
  summary: md`Cellule procariote ed eucariote, la funzione di ogni organulo, quali hanno due membrane e il percorso di una proteina secreta nella cellula.`,
  minutes: 20,
  objectives: [
    md`Distinguere le cellule procariote dalle eucariote e le cellule vegetali dalle animali in base alle loro strutture.`,
    md`Associare ogni organulo alla sua funzione e al numero di membrane che lo circondano.`,
    md`Seguire una proteina secreta attraverso il sistema delle endomembrane.`,
  ],
  teachMd: md`
### Due tipi di cellula

Ogni cellula ha una membrana plasmatica, il citoplasma, i ribosomi e il DNA. Ciò che distingue i due grandi tipi di cellula è dove si trova il DNA e se il citoplasma è diviso in compartimenti delimitati da membrane.

| Caratteristica | Cellula procariote (batteri, archei) | Cellula eucariote (animali, piante, funghi, protisti) |
| --- | --- | --- |
| nucleo | assente: il DNA sta nel citoplasma (nucleoide) | DNA racchiuso in un nucleo |
| DNA | un cromosoma circolare, spesso anche plasmidi | più cromosomi lineari associati a proteine istoniche |
| organuli delimitati da membrane | nessuno | mitocondri, reticolo endoplasmatico, Golgi e altri |
| ribosomi | 70S | 80S nel citoplasma, di tipo 70S in mitocondri e cloroplasti |
| dimensioni tipiche | circa 1–10 micrometri | circa 10–100 micrometri |
| parete cellulare | nella maggior parte dei batteri, di peptidoglicano | nelle piante (cellulosa) e nei funghi (chitina); assente negli animali |

La S di 70S e 80S misura la velocità con cui la particella sedimenta in una centrifuga, non la massa, per cui le subunità non si sommano in modo semplice.

### Il nucleo

Il nucleo è circondato dall'**involucro nucleare** (*nuclear envelope*), una doppia membrana attraversata dai **pori nucleari**, che fanno uscire l'mRNA e le subunità dei ribosomi ed entrare le proteine. All'interno, il DNA avvolto attorno agli istoni forma la **cromatina**. Il **nucleolo** non è un organulo dotato di membrana: è la regione in cui si produce l'RNA ribosomiale e si assemblano le subunità dei ribosomi.

### Il sistema delle endomembrane

- **Reticolo endoplasmatico rugoso (*rough ER*)**: sacche appiattite costellate di ribosomi. Le proteine prodotte qui entrano nel lume del reticolo, dove si ripiegano e possono ricevere zuccheri. Sono proteine destinate alla secrezione, alla membrana o ai lisosomi.
- **Reticolo endoplasmatico liscio (*smooth ER*)**: privo di ribosomi. Sintetizza lipidi, compresi fosfolipidi e ormoni steroidei, detossifica i farmaci (soprattutto nelle cellule del fegato) e immagazzina ioni calcio (il reticolo sarcoplasmatico del muscolo).
- **Apparato di Golgi** (*Golgi apparatus*): una pila di sacche appiattite che riceve vescicole dal reticolo, modifica le proteine (per esempio aggiungendo o rifinendo zuccheri), le smista e le invia a destinazione in nuove vescicole.
- **Lisosomi**: vescicole di enzimi idrolitici che lavorano a pH acido; digeriscono il materiale introdotto dalla cellula e gli organuli usurati. Tipici delle cellule animali.

I ribosomi liberi nel citoplasma producono proteine che restano nel citoplasma o vanno al nucleo, ai mitocondri o ai perossisomi.

### Gli organuli dell'energia

I **mitocondri** svolgono le fasi finali della respirazione aerobica. Hanno due membrane; quella interna è ripiegata in **creste** (*cristae*), che offrono spazio alla catena di trasporto degli elettroni, e racchiude la **matrice**. I **cloroplasti**, nelle piante e nelle alghe, hanno due membrane attorno a un fluido, lo **stroma**, che contiene pile di **tilacoidi**, dove la luce viene assorbita. Entrambi possiedono un proprio DNA circolare e ribosomi 70S e si dividono con un processo simile alla scissione binaria. Questi caratteri sostengono la **teoria endosimbiontica** (*endosymbiotic theory*): mitocondri e cloroplasti discendono da procarioti inglobati da un'antica cellula eucariote.

### Altre strutture

- **Perossisomi**: vescicole a membrana singola che demoliscono acidi grassi e sostanze tossiche; producono perossido di idrogeno e lo distruggono con l'enzima catalasi.
- **Vacuolo**: nelle cellule vegetali un grande vacuolo centrale pieno di succo cellulare, delimitato da una membrana (il tonoplasto), mantiene la cellula turgida e immagazzina sostanze.
- **Citoscheletro**: microfilamenti (actina), filamenti intermedi e microtubuli (tubulina) danno forma alla cellula, spostano gli organuli e, come fuso, separano i cromosomi.
- **Centrioli**: coppie di cilindri di microtubuli nel centrosoma delle cellule animali; la maggior parte delle cellule vegetali ne è priva.
- **Ciglia e flagelli** degli eucarioti sono costruiti con microtubuli; i flagelli batterici sono una struttura proteica diversa.

### Contare le membrane

| Membrane | Strutture |
| --- | --- |
| due | nucleo (involucro nucleare), mitocondrio, cloroplasto |
| una | reticolo endoplasmatico, Golgi, lisosoma, perossisoma, vacuolo, vescicole, membrana plasmatica |
| nessuna | ribosoma, nucleolo, centriolo, citoscheletro |

### Cellule vegetali e animali a confronto

Le cellule vegetali hanno una parete di cellulosa, cloroplasti (nei tessuti verdi) e un grande vacuolo centrale; di solito non hanno centrioli e accumulano amido. Le cellule animali non hanno parete né cloroplasti, possono avere piccoli vacuoli, hanno centrioli e lisosomi e accumulano glicogeno. Una cellula di radice resta una cellula vegetale anche se non ha cloroplasti, per cui l'assenza di cloroplasti da sola non dimostra che una cellula sia animale.
`,
  examples: [
    {
      id: 'example-secretory-pathway',
      title: md`Seguire un amminoacido marcato`,
      problemMd: md`Cellule pancreatiche che secernono enzimi digestivi ricevono per breve tempo un amminoacido radioattivo, poi amminoacidi non marcati. In quale ordine compare la radioattività nelle strutture della cellula?`,
      steps: [
        md`L'amminoacido viene incorporato nelle proteine sui ribosomi. Gli enzimi da secernere sono prodotti dai ribosomi del reticolo endoplasmatico rugoso, e le nuove catene entrano nel lume del reticolo.`,
        md`Dal reticolo rugoso le proteine viaggiano in vescicole fino all'apparato di Golgi, che le modifica e le smista.`,
        md`Il Golgi le racchiude in vescicole di secrezione, che si spostano verso la membrana plasmatica.`,
        md`Le vescicole si fondono con la membrana e liberano gli enzimi all'esterno della cellula per esocitosi.`,
      ],
      answerMd: md`Reticolo rugoso, poi apparato di Golgi, poi vescicole di secrezione, poi l'esterno della cellula. Mettere il Golgi per primo, o far passare la proteina per il reticolo liscio o per un lisosoma, è l'ordine sbagliato più comune.`,
    },
    {
      id: 'example-identify-cell',
      title: md`Riconoscere una cellula dalle sue caratteristiche`,
      problemMd: md`Una cellula ha un nucleo, mitocondri e una parete cellulare contenente chitina. Non ha cloroplasti. A quale gruppo appartiene più probabilmente?`,
      steps: [
        md`Nucleo e mitocondri la rendono eucariote: non è un batterio.`,
        md`La parete cellulare esclude una cellula animale.`,
        md`La parete è di chitina, non di cellulosa: le pareti di chitina sono tipiche dei funghi. Anche l'assenza di cloroplasti è coerente con un fungo, perché i funghi non fanno la fotosintesi.`,
      ],
      answerMd: md`Un fungo. "Cellula di radice" è allettante, perché anche le cellule delle radici non hanno cloroplasti, ma la parete delle piante è di cellulosa.`,
    },
    {
      id: 'example-antibiotic-ribosomes',
      title: md`Un antibiotico che colpisce i ribosomi 70S`,
      problemMd: md`Un farmaco blocca la sintesi proteica sui ribosomi 70S ma non su quelli 80S. Prevedete il suo effetto su un batterio e su una cellula umana.`,
      steps: [
        md`I batteri hanno ribosomi 70S, quindi il farmaco blocca la loro sintesi proteica.`,
        md`I ribosomi citoplasmatici di una cellula umana sono 80S, quindi la maggior parte della sintesi proteica umana continua.`,
        md`I mitocondri umani, però, contengono propri ribosomi di tipo 70S, che producono alcune proteine del mitocondrio. A dosi elevate il farmaco può colpire anche questi.`,
      ],
      answerMd: md`Blocca la sintesi proteica batterica e lascia in gran parte intatta quella citoplasmatica umana, ma può interferire con la sintesi proteica mitocondriale: un possibile effetto collaterale che l'origine endosimbiontica dei mitocondri spiega.`,
    },
  ],
  traps: [
    {
      title: md`Attribuire una membrana al nucleolo`,
      md: md`Il nucleolo è una regione all'interno del nucleo, senza una membrana propria. Anche ribosomi, centrioli e citoscheletro non hanno membrane. Il trio a doppia membrana è nucleo, mitocondrio e cloroplasto.`,
    },
    {
      title: md`Pensare che i procarioti non abbiano ribosomi o DNA`,
      md: md`I procarioti non hanno nucleo né organuli delimitati da membrane, ma hanno DNA, ribosomi (70S), una membrana plasmatica e il citoplasma. Un'opzione secondo cui i batteri non hanno ribosomi è sbagliata.`,
    },
    {
      title: md`Niente cloroplasti, quindi cellula animale`,
      md: md`Le cellule delle radici e molte altre cellule vegetali non hanno cloroplasti. Per riconoscere una cellula vegetale usate la parete, il grande vacuolo centrale e l'assenza di centrioli, e il materiale della parete per distinguere le piante dai funghi.`,
    },
  ],
  check: [
    {
      id: 'check-shared-structure',
      title: md`Comune a tutte le cellule`,
      topic: md`La cellula`,
      stemMd: md`Quale struttura si trova sia nelle cellule procariote sia in quelle eucariote?`,
      options: [
        { id: 'A', text: md`Nucleolo`, note: md`Il nucleolo si trova all'interno di un nucleo, che i procarioti non hanno.` },
        { id: 'B', text: md`Mitocondrio`, note: md`I mitocondri sono organuli delimitati da membrane, presenti solo negli eucarioti; i batteri respirano usando la membrana plasmatica.` },
        { id: 'C', text: md`Ribosoma`, note: '' },
        { id: 'D', text: md`Apparato di Golgi`, note: md`Il Golgi fa parte del sistema delle endomembrane, che hanno solo le cellule eucariote.` },
        { id: 'E', text: md`Reticolo endoplasmatico`, note: md`Il reticolo è un compartimento delimitato da membrana; i procarioti non ne hanno.` },
      ],
      answer: 'C',
      workingMd: md`Tutte le cellule producono proteine, quindi tutte hanno ribosomi: 70S nei procarioti, 80S nel citoplasma degli eucarioti. Le altre quattro strutture sono compartimenti o regioni della cellula eucariote.`,
      lesson: md`I procarioti hanno DNA, ribosomi, citoplasma e membrana plasmatica, ma non hanno nucleo né organuli delimitati da membrane.`,
    },
    {
      id: 'check-double-membrane',
      title: md`Due membrane`,
      topic: md`La cellula`,
      stemMd: md`Quale di queste strutture è delimitata da una doppia membrana?`,
      options: [
        { id: 'A', text: md`Lisosoma`, note: md`Il lisosoma è una vescicola con una sola membrana.` },
        { id: 'B', text: md`Apparato di Golgi`, note: md`Ogni sacca del Golgi (cisterna) è delimitata da una sola membrana.` },
        { id: 'C', text: md`Reticolo endoplasmatico rugoso`, note: md`Il reticolo è una rete di sacche e tubuli delimitati da una sola membrana.` },
        { id: 'D', text: md`Perossisoma`, note: md`Il perossisoma è una vescicola a membrana singola.` },
        { id: 'E', text: md`Cloroplasto`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Le strutture con due membrane sono il nucleo, i mitocondri e i cloroplasti. I tilacoidi all'interno del cloroplasto sono un terzo sistema di membrane, ma l'involucro del cloroplasto è una doppia membrana. Le altre strutture hanno una membrana ciascuna.`,
      lesson: md`Imparate il trio a doppia membrana: nucleo, mitocondrio e cloroplasto.`,
    },
    {
      id: 'check-smooth-er',
      title: md`Una cellula piena di reticolo liscio`,
      topic: md`La cellula`,
      stemMd: md`Le micrografie elettroniche mostrano che un tipo di cellula ha un reticolo endoplasmatico liscio molto esteso e poco reticolo rugoso. In quale funzione è più probabilmente specializzata?`,
      options: [
        { id: 'A', text: md`Secernere enzimi digestivi`, note: md`Gli enzimi secreti sono proteine prodotte sul reticolo rugoso; queste cellule hanno molto reticolo rugoso.` },
        { id: 'B', text: md`Sintetizzare ormoni steroidei`, note: '' },
        { id: 'C', text: md`Inglobare e digerire batteri`, note: md`Le cellule fagocitarie sono ricche di lisosomi, che digeriscono ciò che la cellula ingloba.` },
        { id: 'D', text: md`Fornire grandi quantità di ATP per la contrazione`, note: md`Una forte richiesta di ATP richiede molti mitocondri, non reticolo liscio.` },
        { id: 'E', text: md`Svolgere la fotosintesi`, note: md`La fotosintesi avviene nei cloroplasti, non nel reticolo.` },
      ],
      answer: 'B',
      workingMd: md`Il reticolo liscio sintetizza lipidi, e gli ormoni steroidei sono lipidi derivati dal colesterolo, per cui le cellule che li producono (per esempio nella corticale del surrene o nelle gonadi) hanno abbondante reticolo liscio. La secrezione di enzimi richiede reticolo rugoso, la digestione lisosomi, l'ATP mitocondri, la fotosintesi cloroplasti.`,
      lesson: md`Associate l'organulo abbondante al prodotto: proteine da esportare al reticolo rugoso, lipidi e steroidi al reticolo liscio.`,
    },
  ],
  takeaways: [
    md`I procarioti non hanno nucleo né organuli delimitati da membrane, ma hanno DNA e ribosomi 70S.`,
    md`Le proteine secrete seguono il percorso reticolo rugoso, Golgi, vescicola di secrezione, esocitosi.`,
    md`Il reticolo liscio produce lipidi e steroidi e detossifica; i lisosomi digeriscono; i perossisomi demoliscono il perossido di idrogeno.`,
    md`Nucleo, mitocondri e cloroplasti hanno due membrane; mitocondri e cloroplasti hanno anche DNA proprio e ribosomi di tipo 70S.`,
  ],
  flashcards: [
    { front: md`Ribosomi procariotici ed eucariotici`, back: md`I procarioti hanno ribosomi 70S; gli eucarioti hanno ribosomi 80S nel citoplasma e di tipo 70S in mitocondri e cloroplasti.` },
    { front: md`Nucleolo`, back: md`Una regione del nucleo, priva di membrana, dove si produce l'RNA ribosomiale e si assemblano le subunità dei ribosomi.` },
    { front: md`Reticolo rugoso e reticolo liscio`, back: md`Il reticolo rugoso ha ribosomi e produce proteine per la secrezione, le membrane e i lisosomi. Il reticolo liscio produce lipidi e steroidi, detossifica e immagazzina calcio.` },
    { front: md`Apparato di Golgi`, back: md`Riceve in vescicole le proteine dal reticolo, le modifica, le smista e le invia a destinazione in nuove vescicole.` },
    { front: md`Prove dell'endosimbiosi`, back: md`Mitocondri e cloroplasti hanno due membrane, DNA circolare proprio e ribosomi di tipo 70S, e si dividono come i batteri.` },
    { front: md`Caratteri della cellula vegetale`, back: md`Parete di cellulosa, grande vacuolo centrale, cloroplasti nei tessuti verdi e di solito nessun centriolo; la riserva è l'amido.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-molecules-cells' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const membranesAndTransportLessonIt: Lesson = {
  slug: 'membranes-and-transport',
  title: md`Le membrane e il trasporto`,
  summary: md`La membrana a mosaico fluido, diffusione, osmosi e tonicità, trasporto attivo e pompa sodio-potassio, trasporto in massa tramite vescicole.`,
  minutes: 22,
  objectives: [
    md`Descrivere il modello a mosaico fluido e dire quali sostanze attraversano da sole un doppio strato fosfolipidico.`,
    md`Prevedere la direzione del movimento dell'acqua e la sorte di cellule animali e vegetali in soluzioni di diversa tonicità.`,
    md`Distinguere trasporto passivo, attivo e in massa a partire da dati sperimentali.`,
  ],
  teachMd: md`
### Il modello a mosaico fluido

La membrana cellulare è un **doppio strato fosfolipidico** (*phospholipid bilayer*): le teste idrofile sono rivolte verso il citoplasma acquoso e verso l'ambiente esterno acquoso, le code idrofobe l'una verso l'altra al centro. Le proteine sono sparse al suo interno come le tessere di un mosaico, e sia i lipidi sia molte proteine si muovono lateralmente nello strato: per questo si parla di **mosaico fluido** (*fluid mosaic model*).

- Le **proteine integrali (transmembrana)** attraversano il doppio strato: canali, trasportatori, pompe e molti recettori.
- Le **proteine periferiche** si trovano su una sola faccia.
- Il **colesterolo**, nelle membrane animali, si inserisce tra i fosfolipidi e modera la fluidità: impedisce che la membrana diventi troppo fluida al caldo e troppo rigida al freddo.
- **Glicoproteine e glicolipidi** portano brevi catene di carboidrati sulla faccia esterna; servono al riconoscimento cellulare e come recettori.

### Che cosa attraversa da solo il doppio strato

La barriera è il nucleo idrofobo. Le piccole molecole apolari, come ossigeno, anidride carbonica e ormoni steroidei, vi si sciolgono e passano liberamente. L'acqua è abbastanza piccola da passare lentamente, e molto più in fretta attraverso proteine canale chiamate **acquaporine** (*aquaporins*). Gli ioni, qualunque sia la loro dimensione, e le molecole polari più grandi come glucosio e amminoacidi passano solo attraverso proteine. Le macromolecole passano solo in vescicole.

### Il trasporto passivo

Il trasporto passivo non richiede energia alla cellula: le sostanze si muovono **secondo** il loro gradiente di concentrazione, dalla concentrazione maggiore alla minore, finché il gradiente scompare.

- **Diffusione semplice** (*simple diffusion*): direttamente attraverso il doppio strato (ossigeno, anidride carbonica).
- **Diffusione facilitata** (*facilitated diffusion*): attraverso una proteina canale o una proteina trasportatrice (glucosio nei globuli rossi, ioni attraverso canali). Poiché i trasportatori sono in numero limitato, la velocità si stabilizza (satura) alle alte concentrazioni, a differenza della diffusione semplice.
- **Osmosi** (*osmosis*): il movimento netto di acqua attraverso una membrana selettivamente permeabile da una soluzione a minore concentrazione di soluti a una a maggiore concentrazione di soluti.

### La tonicità

La tonicità confronta la concentrazione, sui due lati, dei soluti che non possono attraversare la membrana. Conta il numero di particelle disciolte: una mole di NaCl dà circa due moli di particelle (ioni sodio e cloruro), una mole di glucosio ne dà una.

| Soluzione esterna | L'acqua si sposta | Cellula animale (globulo rosso) | Cellula vegetale |
| --- | --- | --- | --- |
| ipotonica (meno particelle di soluto) | verso l'interno | si gonfia e può scoppiare (emolisi) | si gonfia finché la parete non resiste: turgida |
| isotonica | nessun movimento netto | resta invariata | flaccida |
| ipertonica (più particelle di soluto) | verso l'esterno | si raggrinzisce (crenatura) | la membrana si stacca dalla parete: plasmolisi |

È la parete a impedire che una cellula vegetale scoppi in acqua pura. Una soluzione salina allo 0,9% circa di NaCl è vicina all'isotonia con il sangue umano, ed è per questo che si usa nelle flebo.

### Il trasporto attivo

Il trasporto attivo sposta le sostanze **contro** il loro gradiente di concentrazione e quindi richiede energia.

- Il **trasporto attivo primario** usa direttamente l'ATP. La **pompa sodio-potassio** (Na+/K+-ATPasi, *sodium-potassium pump*) porta 3 ioni sodio fuori dalla cellula e 2 ioni potassio dentro per ogni ATP idrolizzato. Mantiene alto il sodio all'esterno e alto il potassio all'interno e, poiché esce più carica positiva di quanta ne entri, contribuisce al potenziale di riposo negativo all'interno della cellula.
- Il **trasporto attivo secondario** sfrutta un gradiente creato da una pompa. Nell'intestino tenue il sodio, rientrando nella cellula secondo il proprio gradiente, trascina con sé il glucosio contro il gradiente del glucosio (un simporto). Se la pompa si ferma, il gradiente del sodio si esaurisce e anche l'assorbimento del glucosio si ferma.

Veleni come il cianuro bloccano la respirazione aerobica e quindi la produzione di ATP: per questo fermano il trasporto attivo ma non la diffusione.

### Il trasporto in massa

Particelle grandi e grandi quantità di materiale si spostano in vescicole, un processo che richiede anch'esso energia.

- L'**endocitosi** porta materiale all'interno: la **fagocitosi** ingloba particelle solide come i batteri (globuli bianchi), la **pinocitosi** introduce goccioline di liquido e l'**endocitosi mediata da recettori** introduce molecole specifiche legate a recettori, come il colesterolo trasportato dalle LDL.
- L'**esocitosi** rilascia materiale: le vescicole di secrezione si fondono con la membrana plasmatica, come quando vengono liberati enzimi digestivi, ormoni o neurotrasmettitori.

### Scegliere il meccanismo

| Indizio | Meccanismo |
| --- | --- |
| secondo gradiente, nessuna proteina necessaria, velocità proporzionale alla concentrazione | diffusione semplice |
| secondo gradiente, velocità che satura, specifica per una molecola | diffusione facilitata |
| contro gradiente, si ferma quando manca l'ATP | trasporto attivo |
| particelle grandi, la membrana le avvolge | endocitosi |
`,
  examples: [
    {
      id: 'example-red-cells-tonicity',
      title: md`Globuli rossi in tre soluzioni`,
      problemMd: md`Si supponga che il citoplasma di un globulo rosso abbia una concentrazione di soluti di circa 0,3 osmol/L e che saccarosio, sodio e cloruro non possano attraversarne la membrana. Prevedete che cosa succede a globuli rossi posti in (1) saccarosio 0,3 mol/L, (2) NaCl 0,3 mol/L, (3) acqua pura.`,
      steps: [
        md`Contate le particelle disciolte. Il saccarosio non si dissocia: 0,3 mol/L danno 0,3 osmol/L. L'NaCl si dissocia in due ioni: 0,3 mol/L danno circa 0,6 osmol/L. L'acqua pura non ne ha.`,
        md`(1) 0,3 osmol/L all'esterno come all'interno: soluzione isotonica, nessun movimento netto di acqua, le cellule mantengono la loro forma.`,
        md`(2) 0,6 osmol/L all'esterno è più concentrato dell'interno: soluzione ipertonica, l'acqua esce, le cellule si raggrinziscono.`,
        md`(3) L'acqua pura è ipotonica: l'acqua entra, le cellule si gonfiano e, senza una parete che resista, scoppiano.`,
      ],
      answerMd: md`Invariati nel saccarosio, raggrinziti nell'NaCl, scoppiati nell'acqua. L'errore allettante è considerare isotonica la soluzione di NaCl 0,3 mol/L perché il numero è lo stesso; l'NaCl dà due particelle per unità formula.`,
    },
    {
      id: 'example-inhibitor-experiment',
      title: md`Quale meccanismo di trasporto?`,
      problemMd: md`Le cellule di una radice assorbono ioni nitrato dal suolo, dove il nitrato è meno concentrato che nelle cellule. Quando le radici vengono trattate con cianuro, l'assorbimento scende quasi a zero. Quale meccanismo è coinvolto, e perché?`,
      steps: [
        md`Il nitrato passa dalla concentrazione minore (suolo) alla maggiore (cellule): contro il suo gradiente. Nessun tipo di diffusione può farlo.`,
        md`Il cianuro blocca la respirazione aerobica, per cui la disponibilità di ATP nelle cellule cala.`,
        md`L'assorbimento si ferma quando si ferma l'ATP: il processo dipende dall'energia metabolica.`,
      ],
      answerMd: md`Trasporto attivo, tramite proteine trasportatrici alimentate dall'ATP. La diffusione facilitata è la risposta sbagliata più allettante, perché anch'essa usa proteine trasportatrici; ma può spostare gli ioni solo secondo gradiente e non richiede ATP.`,
    },
    {
      id: 'example-pump-counting',
      title: md`Contare gli ioni spostati dalla pompa sodio-potassio`,
      problemMd: md`In un periodo di attività le pompe sodio-potassio di una cellula idrolizzano 500 molecole di ATP. Quanti ioni sodio e potassio vengono spostati, e qual è il movimento netto di carica positiva?`,
      steps: [
        md`Ogni ATP porta fuori 3 ioni sodio e dentro 2 ioni potassio.`,
        md`Sodio in uscita: $3 \times 500 = 1500$. Potassio in entrata: $2 \times 500 = 1000$.`,
        md`Ogni ione porta una carica positiva, quindi il movimento netto è di $1500 - 1000 = 500$ cariche positive verso l'esterno.`,
      ],
      answerMd: md`1500 ioni sodio fuori, 1000 ioni potassio dentro, un netto di 500 cariche positive verso l'esterno. Scambiare i numeri (3 potassio dentro, 2 sodio fuori) è l'errore classico.`,
    },
  ],
  traps: [
    {
      title: md`Pensare che l'acqua vada dove c'è più acqua`,
      md: md`Nell'osmosi l'acqua si sposta verso il lato con **più soluto** (minore concentrazione di acqua). Se ragionate sui soluti, la regola è "l'acqua segue il soluto". Controllate la direzione prima di scegliere.`,
    },
    {
      title: md`Ignorare la dissociazione`,
      md: md`La tonicità dipende dal numero di particelle. NaCl 0,1 mol/L dà circa 0,2 mol/L di particelle, CaCl2 0,1 mol/L circa 0,3; glucosio e saccarosio non si dissociano. Confrontate le concentrazioni di particelle, non quelle delle formule.`,
    },
    {
      title: md`Considerare attivo ogni processo mediato da proteine`,
      md: md`Canali e trasportatori sono usati sia dalla diffusione facilitata sia dal trasporto attivo. Le domande decisive sono la direzione rispetto al gradiente e se il processo richieda energia.`,
    },
  ],
  check: [
    {
      id: 'check-bilayer-permeability',
      title: md`Attraversare un doppio strato artificiale`,
      topic: md`La cellula`,
      stemMd: md`Una membrana artificiale è costituita da un doppio strato fosfolipidico puro, senza proteine. Quale sostanza la attraversa più facilmente?`,
      options: [
        { id: 'A', text: md`Ossigeno`, note: '' },
        { id: 'B', text: md`Glucosio`, note: md`Il glucosio è polare e relativamente grande; ha bisogno di proteine trasportatrici, che questa membrana non ha.` },
        { id: 'C', text: md`Ioni sodio`, note: md`Gli ioni sono carichi e circondati da acqua, quindi non possono superare il nucleo idrofobo senza un canale o un trasportatore.` },
        { id: 'D', text: md`Insulina`, note: md`L'insulina è una proteina, troppo grande e polare per diffondere attraverso un doppio strato.` },
        { id: 'E', text: md`ATP`, note: md`L'ATP è grande e porta diverse cariche negative sui fosfati; non può attraversare il nucleo idrofobo.` },
      ],
      answer: 'A',
      workingMd: md`Le piccole molecole apolari si sciolgono nel nucleo idrofobo del doppio strato e lo attraversano per diffusione. L'ossigeno è l'unica piccola molecola apolare dell'elenco; le altre sono polari, cariche o grandi.`,
      lesson: md`Senza proteine, solo le piccole molecole apolari (e l'acqua, lentamente) attraversano un doppio strato.`,
    },
    {
      id: 'check-plasmolysis',
      title: md`Una cellula vegetale in una soluzione salina concentrata`,
      topic: md`La cellula`,
      stemMd: md`Una cellula dell'epidermide di cipolla viene posta in una soluzione concentrata di cloruro di sodio. Che cosa si osserva al microscopio?`,
      options: [
        { id: 'A', text: md`La cellula scoppia perché il sale entra più in fretta di quanto esca l'acqua.`, note: md`Le cellule vegetali non scoppiano, grazie alla parete, e in una soluzione ipertonica la cellula perde acqua anziché acquistarne.` },
        { id: 'B', text: md`La cellula acquista acqua e diventa più turgida.`, note: md`L'acqua si sposta verso la soluzione più concentrata, che qui è all'esterno, quindi la cellula perde acqua.` },
        { id: 'C', text: md`Non c'è movimento netto di acqua, perché la parete cellulare è completamente permeabile.`, note: md`La parete è permeabile, ma la membrana plasmatica è selettivamente permeabile, quindi attraverso di essa l'osmosi avviene comunque.` },
        { id: 'D', text: md`La cellula perde acqua per osmosi e la membrana plasmatica si stacca dalla parete cellulare.`, note: '' },
        { id: 'E', text: md`La parete cellulare si restringe insieme al vacuolo, così la membrana resta aderente alla parete.`, note: md`La parete è rigida e cambia appena dimensione; è il protoplasto all'interno che si ritrae da essa.` },
      ],
      answer: 'D',
      workingMd: md`La soluzione esterna è ipertonica, quindi l'acqua esce per osmosi dal vacuolo e dal citoplasma. Il protoplasto si ritrae ma la parete rigida no, per cui la membrana plasmatica si separa dalla parete: plasmolisi.`,
      lesson: md`In una soluzione ipertonica una cellula vegetale va incontro a plasmolisi; in una ipotonica diventa turgida ma non scoppia.`,
    },
    {
      id: 'check-sodium-potassium-pump',
      title: md`Un ciclo della pompa`,
      topic: md`La cellula`,
      stemMd: md`Per ogni molecola di ATP idrolizzata, che cosa sposta la pompa sodio-potassio?`,
      options: [
        { id: 'A', text: md`2 ioni sodio fuori e 3 ioni potassio dentro`, note: md`I numeri sono scambiati: escono tre ioni sodio ed entrano due ioni potassio.` },
        { id: 'B', text: md`3 ioni sodio dentro e 2 ioni potassio fuori`, note: md`Le direzioni sono invertite: la pompa mantiene il sodio alto all'esterno e il potassio alto all'interno.` },
        { id: 'C', text: md`3 ioni sodio fuori e 2 ioni potassio dentro`, note: '' },
        { id: 'D', text: md`1 ione sodio fuori e 1 ione potassio dentro`, note: md`Uno scambio alla pari non sposterebbe carica netta; la pompa porta fuori più carica positiva di quanta ne porti dentro.` },
        { id: 'E', text: md`3 ioni sodio fuori e 3 ioni potassio dentro`, note: md`La pompa fa entrare due ioni potassio per ciclo, non tre.` },
      ],
      answer: 'C',
      workingMd: md`La Na+/K+-ATPasi è un trasportatore attivo primario: ogni ciclo usa un ATP per portare 3 ioni sodio fuori dalla cellula e 2 ioni potassio dentro, entrambi contro gradiente. La perdita netta di una carica positiva per ciclo contribuisce alla negatività dell'interno della cellula.`,
      lesson: md`Tre sodio fuori, due potassio dentro, un ATP: la pompa rende l'interno povero di sodio e più negativo.`,
    },
  ],
  takeaways: [
    md`La membrana è un doppio strato fosfolipidico fluido con proteine; solo le piccole molecole apolari lo attraversano da sole.`,
    md`Il trasporto passivo segue il gradiente senza ATP; il trasporto attivo va contro gradiente e richiede energia.`,
    md`L'acqua si sposta per osmosi verso il lato con più particelle di soluto; contate gli ioni dopo la dissociazione.`,
    md`Le cellule animali scoppiano in soluzioni ipotoniche e si raggrinziscono in quelle ipertoniche; le cellule vegetali diventano turgide o vanno incontro a plasmolisi.`,
    md`La pompa sodio-potassio porta 3 sodio fuori e 2 potassio dentro per ogni ATP.`,
  ],
  flashcards: [
    { front: md`Modello a mosaico fluido`, back: md`Un doppio strato fosfolipidico in cui le proteine galleggiano e si spostano lateralmente; il colesterolo modera la fluidità e le glicoproteine servono al riconoscimento.` },
    { front: md`Diffusione semplice e facilitata`, back: md`Entrambe seguono il gradiente senza ATP. La semplice attraversa direttamente il doppio strato; la facilitata usa canali o trasportatori e satura alle alte concentrazioni.` },
    { front: md`Osmosi`, back: md`Movimento netto di acqua attraverso una membrana selettivamente permeabile dalla concentrazione di soluti minore a quella maggiore.` },
    { front: md`Globulo rosso in soluzione ipotonica e ipertonica`, back: md`Ipotonica: l'acqua entra, la cellula si gonfia e può scoppiare (emolisi). Ipertonica: l'acqua esce e la cellula si raggrinzisce (crenatura).` },
    { front: md`Pompa sodio-potassio`, back: md`Trasporto attivo primario: 3 ioni sodio fuori e 2 ioni potassio dentro per ogni ATP idrolizzato.` },
    { front: md`Fagocitosi, pinocitosi, esocitosi`, back: md`La fagocitosi ingloba particelle solide, la pinocitosi introduce liquido; l'esocitosi rilascia il contenuto delle vescicole. Tutte richiedono energia.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-molecules-cells' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const enzymesAndMetabolismLessonIt: Lesson = {
  slug: 'enzymes-and-metabolism',
  title: md`Gli enzimi e il metabolismo`,
  summary: md`Come gli enzimi abbassano l'energia di attivazione, perché temperatura, pH e substrato ne cambiano la velocità, gli inibitori e la regolazione delle vie.`,
  minutes: 22,
  objectives: [
    md`Spiegare che cosa cambia un enzima in una reazione e che cosa non cambia.`,
    md`Prevedere l'effetto di temperatura, pH, concentrazione del substrato e inibitori sulla velocità di una reazione enzimatica.`,
    md`Interpretare dati di velocità per distinguere l'inibizione competitiva da quella non competitiva, e spiegare l'inibizione a feedback.`,
  ],
  teachMd: md`
### Metabolismo e ATP

Il **metabolismo** è l'insieme delle reazioni chimiche di una cellula. Le reazioni **cataboliche** scindono molecole grandi in molecole più piccole e liberano energia (la respirazione demolisce il glucosio); le reazioni **anaboliche** costruiscono molecole grandi e richiedono energia (sintesi di proteine e DNA). Le due sono collegate dall'**ATP**: l'idrolisi dell'ATP ad ADP e fosfato inorganico libera energia che alimenta i processi che ne hanno bisogno, e il catabolismo rigenera l'ATP a partire dall'ADP. Una cellula possiede solo una piccola scorta di ATP e la ricicla di continuo.

### Che cosa fa un enzima

Gli enzimi sono catalizzatori biologici, quasi tutti proteine (esistono anche alcuni RNA catalitici, i ribozimi). Ogni reazione deve superare una barriera energetica, l'**energia di attivazione** (*activation energy*). Un enzima offre un percorso con un'energia di attivazione più bassa, per cui più molecole hanno energia sufficiente per reagire e la reazione procede più in fretta alla temperatura corporea.

Un enzima **non**:

- cambia la differenza di energia complessiva tra reagenti e prodotti (la variazione di energia libera, $\Delta G$);
- sposta la posizione dell'equilibrio: accelera allo stesso modo la reazione diretta e quella inversa, per cui l'equilibrio viene semplicemente raggiunto prima;
- si consuma: viene liberato inalterato e può agire di nuovo.

I nomi degli enzimi finiscono di solito in -asi e spesso indicano il substrato: la lattasi idrolizza il lattosio, la DNA polimerasi costruisce DNA.

### Il sito attivo

Il substrato si lega a una piccola regione dell'enzima, il **sito attivo** (*active site*), la cui forma e i cui gruppi chimici gli corrispondono; si forma un **complesso enzima-substrato**, che si trasforma in enzima e prodotti:

$$\mathrm{E + S \rightleftharpoons ES \rightarrow E + P}$$

Nel modello **chiave-serratura** (*lock-and-key*) il sito attivo è rigido; nel più accurato modello dell'**adattamento indotto** (*induced fit*) il sito attivo cambia leggermente forma quando il substrato si lega, lo stringe e ne mette in tensione i legami. In entrambi i casi la corrispondenza spiega la **specificità**: un enzima agisce su un solo substrato o su un solo tipo di legame.

### Che cosa cambia la velocità

- **Temperatura.** Aumentando la temperatura cresce l'energia cinetica delle molecole e quindi la velocità, fino a un **optimum** (circa 37 °C per molti enzimi umani). Oltre, le vibrazioni rompono i legami che mantengono la struttura terziaria, il sito attivo cambia forma e l'enzima è **denaturato**: la velocità crolla e, di regola, non si recupera raffreddando. A bassa temperatura l'enzima è solo rallentato: riscaldandolo l'attività ritorna.
- **pH.** Ogni enzima ha un pH ottimale. Le variazioni di pH alterano le cariche dei gruppi R nel sito attivo e intorno a esso, per cui il legame del substrato e la forma della proteina ne risentono, e un pH estremo denatura l'enzima. La pepsina, nello stomaco, lavora meglio a pH 2 circa; l'amilasi salivare vicino a pH 7; la tripsina, nell'intestino tenue, a pH 8 circa.
- **Concentrazione del substrato.** A bassa concentrazione, più substrato significa più urti e una velocità maggiore. Al crescere della concentrazione, in ogni istante sono occupati più siti attivi, finché lo sono tutti: la velocità si stabilizza al suo massimo, $V_{max}$ (saturazione). La concentrazione di substrato che dà metà di $V_{max}$ è la costante di Michaelis, $K_m$; un $K_m$ basso significa che l'enzima lega fortemente il substrato.
- **Concentrazione dell'enzima.** Con substrato in eccesso, la velocità è proporzionale alla quantità di enzima.

### Gli inibitori

| | Competitivo | Non competitivo |
| --- | --- | --- |
| si lega | al sito attivo | a un altro sito dell'enzima |
| somiglia al substrato? | sì | non necessariamente |
| effetto di molto più substrato | supera l'inibizione | non la supera |
| $V_{max}$ | invariata | ridotta |
| $K_m$ | aumentata | invariata |

Entrambi i tipi sono di solito **reversibili**: l'inibitore si stacca di nuovo. Gli inibitori **irreversibili** si legano in modo permanente, spesso covalente; alcuni veleni del sistema nervoso agiscono così.

### I cofattori

Molti enzimi hanno bisogno di un aiutante non proteico. I **cofattori** in senso stretto sono ioni inorganici come magnesio, zinco o ferro. I **coenzimi** sono molecole organiche, spesso derivate da vitamine: NAD+ dalla niacina, FAD dalla riboflavina, coenzima A dall'acido pantotenico. Spesso trasportano elettroni o gruppi da una reazione all'altra. Un aiutante legato saldamente e in modo permanente, come il gruppo eme, è un **gruppo prostetico**. La sola parte proteica è l'apoenzima; con il suo cofattore è l'oloenzima.

### Il controllo delle vie metaboliche

Le reazioni del metabolismo si susseguono in **vie metaboliche**, ogni tappa catalizzata dal suo enzima. Le cellule le controllano in diversi modi:

- **Regolazione allosterica**: una molecola che si lega a un sito lontano dal sito attivo cambia la forma dell'enzima, attivandolo o inibendolo.
- **Inibizione a feedback** (*feedback inhibition*): il prodotto finale di una via inibisce in modo allosterico l'enzima di una tappa iniziale, di solito la prima. Quando il prodotto si accumula la via rallenta; quando viene consumato, riprende. Nulla viene sprecato per produrre ciò che la cellula ha già.
- **Precursori inattivi**: alcuni enzimi digestivi sono prodotti in forma inattiva (pepsinogeno, tripsinogeno) e attivati solo dove servono, così non digeriscono le cellule che li producono.
`,
  examples: [
    {
      id: 'example-inhibitor-data',
      title: md`Leggere i dati di un inibitore`,
      problemMd: md`La velocità di una reazione enzimatica (in unità arbitrarie) viene misurata a quattro concentrazioni di substrato, con e senza una sostanza X:

| Substrato (mmol/L) | 1 | 2 | 10 | 50 |
| --- | --- | --- | --- | --- |
| velocità senza X | 33 | 50 | 83 | 96 |
| velocità con X | 14 | 25 | 63 | 89 |

Che tipo di inibitore è X?`,
      steps: [
        md`Confrontate le due righe a bassa concentrazione di substrato: X riduce la velocità della metà o più (da 33 a 14, da 50 a 25). X è un inibitore.`,
        md`Confrontatele ad alta concentrazione: la differenza si riduce (96 contro 89) e le due righe si avvicinano allo stesso massimo.`,
        md`Un'inibizione superata da più substrato significa che X compete con il substrato per il sito attivo: $V_{max}$ è invariata, e serve più substrato per raggiungerne la metà ($K_m$ aumenta).`,
      ],
      answerMd: md`X è un inibitore competitivo. Un inibitore non competitivo ridurrebbe la velocità massima, per cui la riga "con X" si stabilizzerebbe ben al di sotto dell'altra, per quanto substrato si aggiungesse.`,
    },
    {
      id: 'example-temperature-pretreatment',
      title: md`Il caldo e il freddo non sono la stessa cosa`,
      problemMd: md`Tre campioni dello stesso enzima umano vengono tenuti per 30 minuti a 5 °C, 37 °C e 70 °C. Poi tutti e tre vengono portati a 37 °C e se ne misura l'attività. Prevedete i risultati.`,
      steps: [
        md`A 5 °C le molecole dell'enzima si muovono lentamente, ma la proteina non è danneggiata. Riportata a 37 °C, funziona normalmente.`,
        md`Il campione a 37 °C è sempre stato al suo optimum: attività normale.`,
        md`A 70 °C si rompono i legami che mantengono la struttura terziaria e il sito attivo perde la sua forma: l'enzima è denaturato. Il raffreddamento non ripristina la forma.`,
      ],
      answerMd: md`I campioni a 5 °C e a 37 °C hanno un'attività simile e normale; quello a 70 °C ne ha poca o nessuna. La previsione sbagliata è che anche il freddo denaturi l'enzima: la bassa temperatura lo rallenta in modo reversibile.`,
    },
    {
      id: 'example-feedback-inhibition',
      title: md`Prevedere l'effetto dell'inibizione a feedback`,
      problemMd: md`In una via A → B → C → D, l'enzima 1 trasforma A in B, l'enzima 2 B in C e l'enzima 3 C in D. Il prodotto D è un inibitore allosterico dell'enzima 1. Una mutazione modifica l'enzima 1 in modo che D non possa più legarsi, mentre il sito attivo continua a funzionare. Prevedete che cosa succede alla quantità di D nella cellula.`,
      steps: [
        md`Normalmente, quando D si accumula si lega all'enzima 1 e rallenta la trasformazione di A in B, per cui si produce meno D.`,
        md`Nel mutante D non può legarsi, quindi l'enzima 1 continua a trasformare A in B qualunque sia la quantità di D.`,
        md`B e C continuano a passare attraverso gli enzimi 2 e 3, per cui D continua a essere prodotto anche quando non serve.`,
      ],
      answerMd: md`D viene prodotto in eccesso e A si consuma più in fretta, perché il freno della via è scomparso. Rispondere che D diminuisce confonde la perdita del sito regolatore con la perdita del sito attivo.`,
    },
  ],
  traps: [
    {
      title: md`Dire che gli enzimi spostano l'equilibrio`,
      md: md`Un enzima accelera allo stesso modo le due direzioni di una reazione. Abbrevia il tempo per raggiungere l'equilibrio ma non cambia dove si trova, né l'energia liberata o assorbita dalla reazione.`,
    },
    {
      title: md`Trattare il freddo come il caldo`,
      md: md`Le alte temperature denaturano gli enzimi, di solito in modo definitivo; le basse temperature li rallentano soltanto. Un'opzione secondo cui il raffreddamento a 0 °C distrugge un enzima è sbagliata.`,
    },
    {
      title: md`Confondere i due tipi di inibitore`,
      md: md`La prova è: "più substrato lo supera?" Sì significa competitivo ($V_{max}$ uguale, $K_m$ più alta); no significa non competitivo ($V_{max}$ più bassa). Ricordate quale grandezza cambia ciascuno.`,
    },
  ],
  check: [
    {
      id: 'check-enzyme-statement',
      title: md`Che cosa cambia un enzima`,
      topic: md`Bioenergetica`,
      stemMd: md`Quale affermazione su una reazione catalizzata da un enzima è corretta?`,
      options: [
        { id: 'A', text: md`L'enzima aumenta l'energia di attivazione perché la reazione possa essere controllata.`, note: md`Gli enzimi abbassano l'energia di attivazione; aumentarla rallenterebbe la reazione.` },
        { id: 'B', text: md`L'enzima sposta l'equilibrio verso i prodotti.`, note: md`Un enzima accelera allo stesso modo la reazione diretta e quella inversa, per cui la posizione dell'equilibrio non cambia.` },
        { id: 'C', text: md`L'enzima si consuma mentre si formano i prodotti.`, note: md`Un catalizzatore viene liberato inalterato alla fine di ogni ciclo e può agire di nuovo.` },
        { id: 'D', text: md`Tutti gli enzimi umani lavorano meglio a pH 7.`, note: md`Il pH ottimale varia: la pepsina lavora meglio vicino a pH 2 e la tripsina vicino a pH 8.` },
        { id: 'E', text: md`L'enzima abbassa l'energia di attivazione senza cambiare la variazione di energia libera complessiva della reazione.`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Un catalizzatore offre un percorso a energia più bassa tra gli stessi reagenti e gli stessi prodotti, per cui l'energia di attivazione diminuisce mentre $\Delta G$, fissata da reagenti e prodotti, resta la stessa. Non si consuma, non sposta l'equilibrio e il pH ottimale varia da enzima a enzima.`,
      lesson: md`Gli enzimi cambiano la rapidità con cui si raggiunge l'equilibrio, mai la sua posizione né l'energia liberata dalla reazione.`,
    },
    {
      id: 'check-competitive-inhibitor',
      title: md`Riconoscere un inibitore competitivo`,
      topic: md`Bioenergetica`,
      stemMd: md`Quale caratteristica è tipica di un inibitore competitivo reversibile?`,
      options: [
        { id: 'A', text: md`Riduce la velocità massima, per quanto substrato si aggiunga.`, note: md`Una velocità massima ridotta è il segno dell'inibizione non competitiva.` },
        { id: 'B', text: md`Il suo effetto può essere superato aumentando la concentrazione del substrato.`, note: '' },
        { id: 'C', text: md`Si lega in modo permanente a un sito allosterico.`, note: md`Il legame permanente descrive un inibitore irreversibile, e il legame lontano dal sito attivo descrive l'inibizione non competitiva o allosterica.` },
        { id: 'D', text: md`Agisce denaturando l'enzima.`, note: md`La denaturazione distrugge la forma dell'enzima; un inibitore competitivo occupa semplicemente il sito attivo per un certo tempo.` },
        { id: 'E', text: md`Riduce $V_{max}$ ma lascia invariata $K_m$.`, note: md`Questo è lo schema dell'inibizione non competitiva; un inibitore competitivo lascia invariata $V_{max}$ e aumenta $K_m$.` },
      ],
      answer: 'B',
      workingMd: md`Un inibitore competitivo somiglia al substrato e compete per il sito attivo. Con molto più substrato, il substrato vince la maggior parte degli incontri, per cui si raggiunge di nuovo la velocità massima originale: $V_{max}$ invariata, $K_m$ aumentata.`,
      lesson: md`Se altro substrato annulla l'inibizione, l'inibitore compete per il sito attivo.`,
    },
    {
      id: 'check-pepsin-tubes',
      title: md`Dove la pepsina lavora più in fretta`,
      topic: md`Bioenergetica`,
      stemMd: md`Cinque provette contengono la stessa quantità di albume d'uovo e di pepsina, un enzima dello stomaco. In quale provetta la proteina viene digerita più rapidamente?`,
      options: [
        { id: 'A', text: md`pH 7, 37 °C`, note: md`La temperatura corporea è giusta, ma pH 7 è lontano dall'optimum della pepsina, che corrisponde allo stomaco acido.` },
        { id: 'B', text: md`pH 2, 0 °C`, note: md`Il pH è giusto, ma a 0 °C le molecole si muovono lentamente e la reazione è molto lenta.` },
        { id: 'C', text: md`pH 9, 37 °C`, note: md`Un pH alcalino è adatto agli enzimi intestinali, non alla pepsina, che lì perde attività.` },
        { id: 'D', text: md`pH 2, 37 °C`, note: '' },
        { id: 'E', text: md`pH 2, 80 °C`, note: md`A 80 °C un enzima umano è denaturato, per cui l'attività si perde anche al pH giusto.` },
      ],
      answer: 'D',
      workingMd: md`La pepsina lavora nello stomaco, dove il pH è circa 2, alla temperatura corporea. Solo la provetta con il suo pH ottimale e 37 °C dà una digestione rapida; il freddo la rallenta, il caldo eccessivo la denatura, e un pH neutro o alcalino è lontano dal suo optimum.`,
      lesson: md`Le condizioni ottimali di un enzima corrispondono al luogo del corpo in cui lavora.`,
    },
  ],
  takeaways: [
    md`Gli enzimi abbassano l'energia di attivazione; non cambiano $\Delta G$ né l'equilibrio e non si consumano.`,
    md`Il calore oltre l'optimum denatura gli enzimi, di solito in modo irreversibile; il freddo li rallenta soltanto.`,
    md`La velocità cresce con la concentrazione del substrato finché tutti i siti attivi sono occupati ($V_{max}$).`,
    md`L'inibizione competitiva è superata da più substrato; quella non competitiva riduce $V_{max}$.`,
    md`Nell'inibizione a feedback il prodotto finale di una via inibisce un enzima iniziale.`,
  ],
  flashcards: [
    { front: md`Che cosa fa un enzima all'energia di attivazione`, back: md`La abbassa, offrendo un percorso diverso; la variazione di energia libera e la posizione dell'equilibrio restano le stesse.` },
    { front: md`Adattamento indotto`, back: md`Il sito attivo cambia leggermente forma quando il substrato si lega, lo stringe e ne mette in tensione i legami.` },
    { front: md`Effetto delle alte e delle basse temperature`, back: md`Oltre l'optimum l'enzima si denatura e di solito resta inattivo; a bassa temperatura è rallentato ma si riprende riscaldandolo.` },
    { front: md`Inibizione competitiva e non competitiva`, back: md`Competitiva: si lega al sito attivo, superata da più substrato, $V_{max}$ invariata, $K_m$ aumentata. Non competitiva: si lega altrove, $V_{max}$ ridotta, $K_m$ invariata.` },
    { front: md`Cofattore, coenzima, gruppo prostetico`, back: md`Un cofattore è un aiutante non proteico, spesso uno ione inorganico; un coenzima è un aiutante organico, spesso derivato da una vitamina (NAD+, FAD); un gruppo prostetico è legato in modo permanente (eme).` },
    { front: md`Inibizione a feedback`, back: md`Il prodotto finale di una via inibisce un enzima iniziale, di solito in modo allosterico, così la via rallenta quando il prodotto si accumula.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-bioenergetics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const cellularRespirationAndPhotosynthesisLessonIt: Lesson = {
  slug: 'cellular-respiration-and-photosynthesis',
  title: md`La respirazione cellulare e la fotosintesi`,
  summary: md`Glicolisi, reazione ponte, ciclo di Krebs e fosforilazione ossidativa; la fermentazione; le reazioni dipendenti dalla luce e il ciclo di Calvin.`,
  minutes: 25,
  objectives: [
    md`Collocare nella cellula ogni fase della respirazione aerobica e indicare che cosa produce per molecola di glucosio.`,
    md`Spiegare perché serve l'ossigeno e che cosa ottiene la fermentazione in sua assenza.`,
    md`Descrivere le due fasi della fotosintesi e seguire la provenienza dei suoi atomi di ossigeno e di carbonio.`,
  ],
  teachMd: md`
### La respirazione in un'equazione

La respirazione aerobica ossida il glucosio ad anidride carbonica e acqua e immagazzina parte dell'energia liberata sotto forma di ATP:

$$\mathrm{C_6H_{12}O_6 + 6\,O_2 \rightarrow 6\,CO_2 + 6\,H_2O}$$

Lo fa in quattro fasi, in modo da liberare l'energia a piccoli passi. Gran parte dell'energia viene prima trasportata sotto forma di elettroni dai coenzimi **NAD** (come NADH) e **FAD** (come FADH2), che li consegnano alla fase finale.

### Le quattro fasi

| Fase | Dove (eucarioti) | Per molecola di glucosio |
| --- | --- | --- |
| glicolisi (*glycolysis*) | citoplasma | 2 piruvati, 2 ATP netti, 2 NADH |
| reazione ponte (*link reaction*, ossidazione del piruvato) | matrice mitocondriale | 2 acetil-CoA, 2 CO2, 2 NADH |
| ciclo di Krebs (*Krebs cycle*, ciclo dell'acido citrico) | matrice mitocondriale | 4 CO2, 2 ATP (o GTP), 6 NADH, 2 FADH2 |
| fosforilazione ossidativa (*oxidative phosphorylation*) | membrana mitocondriale interna | la maggior parte dell'ATP; l'ossigeno è ridotto ad acqua |

La **glicolisi** scinde il glucosio (6 atomi di carbonio) in due molecole di piruvato (3 atomi di carbonio ciascuna). Consuma 2 ATP e ne produce 4, con un guadagno netto di 2. Non richiede ossigeno.

Nella **reazione ponte** ogni piruvato entra nel mitocondrio, perde un carbonio sotto forma di anidride carbonica e si lega al coenzima A formando acetil-CoA (2 atomi di carbonio). Ogni gruppo acetile entra poi nel **ciclo di Krebs**, unendosi a una molecola a 4 atomi di carbonio per formare citrato (6 atomi di carbonio); ogni giro libera due carboni come anidride carbonica, tanti quanti ne ha portati il gruppo acetile, e rigenera l'accettore a 4 atomi di carbonio. Il ciclo compie due giri per ogni glucosio. Tutti e sei i carboni del glucosio escono come anidride carbonica: due nella reazione ponte e quattro nel ciclo di Krebs.

### La fosforilazione ossidativa

NADH e FADH2 cedono i loro elettroni alla **catena di trasporto degli elettroni** (*electron transport chain*), una serie di proteine della membrana mitocondriale interna. Mentre gli elettroni la percorrono, l'energia liberata pompa ioni idrogeno (protoni) dalla matrice allo spazio intermembrana. I protoni rifluiscono attraverso l'**ATP sintasi** (*ATP synthase*), che usa il loro movimento per produrre ATP da ADP e fosfato: questo accoppiamento è la **chemiosmosi** (*chemiosmosis*). Alla fine della catena **l'ossigeno è l'accettore finale di elettroni**: si combina con elettroni e protoni formando acqua.

Senza ossigeno la catena si ferma, il NADH non può essere riossidato, il NAD+ si esaurisce e si fermano anche il ciclo di Krebs e la reazione ponte.

La resa complessiva è di **circa 30–32 ATP per glucosio** nei testi attuali; i testi più vecchi indicano 36–38. Il valore cambia da un testo all'altro perché il numero di protoni necessari per un ATP non è un numero intero e perché trasferire nel mitocondrio gli elettroni del NADH glicolitico ha costi diversi in cellule diverse. Qualunque sia il totale, quasi tutto viene dalla fosforilazione ossidativa.

### La fermentazione

Senza ossigeno, molte cellule mantengono attiva la glicolisi cedendo gli elettroni del NADH al piruvato o a un prodotto da esso derivato, e così rigenerano NAD+:

- **Fermentazione lattica** (*lactic acid fermentation*: cellule muscolari durante uno sforzo intenso, alcuni batteri): il piruvato è ridotto a lattato.
- **Fermentazione alcolica** (*alcoholic fermentation*: lieviti, cellule vegetali a corto di ossigeno): il piruvato perde anidride carbonica e diventa etanolo.

La fermentazione in sé non produce ATP: l'unico ATP è quello netto della glicolisi, 2 per glucosio. Per questo le cellule che fermentano consumano glucosio molto più in fretta di quelle che respirano in modo aerobico.

### La fotosintesi

Nelle piante e nelle alghe la fotosintesi avviene nei **cloroplasti** e costruisce zucchero da anidride carbonica e acqua usando l'energia luminosa:

$$\mathrm{6\,CO_2 + 6\,H_2O \xrightarrow{\text{luce}} C_6H_{12}O_6 + 6\,O_2}$$

La clorofilla assorbe soprattutto la luce rossa e blu e riflette quella verde.

Le **reazioni dipendenti dalla luce** (*light-dependent reactions*) avvengono nelle **membrane dei tilacoidi**. La luce eccita elettroni della clorofilla nei fotosistemi; gli elettroni percorrono una catena di trasporto che pompa protoni nello spazio dei tilacoidi, e l'ATP sintasi produce ATP mentre i protoni rifluiscono. Alla fine gli elettroni riducono il NADP+ a **NADPH**. Gli elettroni persi dalla clorofilla sono sostituiti scindendo l'acqua (**fotolisi**, *photolysis*), che libera **ossigeno** come sottoprodotto.

Le **reazioni indipendenti dalla luce**, il **ciclo di Calvin** (*Calvin cycle*), avvengono nello **stroma**. L'enzima **RuBisCO** fissa l'anidride carbonica su uno zucchero a 5 atomi di carbonio, il ribulosio bisfosfato (RuBP); il prodotto si scinde in due molecole a 3 atomi di carbonio (glicerato 3-fosfato). ATP e NADPH delle reazioni dipendenti dalla luce le riducono a uno zucchero fosfato a 3 atomi di carbonio (trioso fosfato, detto anche G3P). Alcune di queste molecole escono dal ciclo per formare glucosio, saccarosio, amido e altre molecole; la maggior parte, con altro ATP, serve a rigenerare il RuBP. Per produrre un glucosio servono sei giri del ciclo: 6 CO2, 18 ATP e 12 NADPH.

Il ciclo di Calvin non usa direttamente la luce, ma al buio si ferma in breve tempo perché ATP e NADPH si esauriscono.

### Le due a confronto

| | Respirazione aerobica | Fotosintesi |
| --- | --- | --- |
| organulo | mitocondrio (dopo la glicolisi) | cloroplasto |
| carbonio | glucosio ossidato a CO2 | CO2 ridotta a zucchero |
| ossigeno | consumato, come accettore finale di elettroni | liberato, dall'acqua |
| trasportatore di elettroni | da NAD+ a NADH, da FAD a FADH2 | da NADP+ a NADPH |
| ATP prodotto mediante | chemiosmosi (e un po' direttamente) | chemiosmosi nei tilacoidi |

Entrambe usano una catena di trasporto degli elettroni, un gradiente di protoni e l'ATP sintasi. Le piante respirano sempre, alla luce e al buio; alla luce la loro fotosintesi di solito supera la respirazione.
`,
  examples: [
    {
      id: 'example-counting-carbon-dioxide',
      title: md`Da dove viene l'anidride carbonica`,
      problemMd: md`Una molecola di glucosio viene ossidata completamente con la respirazione aerobica. Quante molecole di CO2 vengono liberate nella glicolisi, nella reazione ponte e nel ciclo di Krebs?`,
      steps: [
        md`La glicolisi scinde il glucosio in due piruvati a 3 atomi di carbonio senza perdere carbonio: 0 CO2.`,
        md`Nella reazione ponte ogni piruvato perde un carbonio come CO2, e i piruvati sono due: 2 CO2.`,
        md`Ogni giro del ciclo di Krebs libera due carboni come CO2, tanti quanti ne porta un gruppo acetile (2 atomi di carbonio), e il ciclo compie due giri per glucosio: 4 CO2.`,
        md`Verifica: $0 + 2 + 4 = 6$, come i sei carboni del glucosio e le 6 CO2 dell'equazione complessiva.`,
      ],
      answerMd: md`0, 2 e 4: sei in tutto. Attribuire CO2 alla glicolisi, o contare il ciclo di Krebs una volta anziché due, sono gli errori più comuni.`,
    },
    {
      id: 'example-oxygen-isotope',
      title: md`Seguire l'ossigeno con un isotopo pesante`,
      problemMd: md`A un'alga si fornisce acqua i cui atomi di ossigeno sono l'isotopo pesante ossigeno-18, e CO2 normale. In un secondo esperimento le si fornisce acqua normale e CO2 marcata con ossigeno-18. In quale esperimento l'O2 liberato contiene ossigeno-18?`,
      steps: [
        md`L'O2 liberato nella fotosintesi viene dalla fotolisi dell'acqua nelle reazioni dipendenti dalla luce.`,
        md`Quindi nel primo esperimento l'O2 liberato è marcato.`,
        md`Gli atomi di ossigeno della CO2 vengono incorporati nello zucchero nel ciclo di Calvin (e in parte finiscono nell'acqua prodotta dalle reazioni); non compaiono nell'O2 liberato.`,
      ],
      answerMd: md`Solo nel primo, con l'acqua marcata. L'idea allettante è che l'O2 provenga dalla CO2, perché l'equazione complessiva ha 6 CO2 a sinistra e 6 O2 a destra.`,
    },
    {
      id: 'example-yeast-glucose',
      title: md`Il lievito con e senza ossigeno`,
      problemMd: md`Il lievito può respirare in modo aerobico o fermentare. Approssimativamente quante volte più glucosio deve consumare fermentando rispetto alla respirazione aerobica per produrre la stessa quantità di ATP? Si considerino circa 30–32 ATP per glucosio nella respirazione aerobica.`,
      steps: [
        md`La fermentazione dà solo i 2 ATP netti della glicolisi per glucosio.`,
        md`La respirazione aerobica dà circa 30–32 ATP per glucosio.`,
        md`A parità di ATP, il rapporto tra il glucosio consumato va da $\frac{30}{2} = 15$ a $\frac{32}{2} = 16$.`,
      ],
      answerMd: md`Circa 15–16 volte più glucosio. Rispondere "il doppio" confonde l'ATP della glicolisi con il totale; i prodotti della fermentazione (etanolo e CO2) contengono ancora gran parte dell'energia del glucosio.`,
    },
  ],
  traps: [
    {
      title: md`Collocare le fasi nel posto sbagliato`,
      md: md`La glicolisi è nel citoplasma; la reazione ponte e il ciclo di Krebs nella matrice; la catena di trasporto degli elettroni nella membrana mitocondriale interna. Nei cloroplasti, le reazioni dipendenti dalla luce sono nelle membrane dei tilacoidi e il ciclo di Calvin nello stroma.`,
    },
    {
      title: md`Pensare che la fermentazione produca ATP in più`,
      md: md`La trasformazione del piruvato in lattato o in etanolo non produce ATP. Il suo unico scopo è rigenerare il NAD+ perché la glicolisi, con i suoi 2 ATP netti, possa continuare.`,
    },
    {
      title: md`Considerare esatto un unico totale di ATP`,
      md: md`I testi indicano circa 30–32 ATP per glucosio, quelli più vecchi 36–38. Se tra le opzioni compaiono più totali, scegliete quello coerente con i dati della domanda, e non concludete mai che un valore di un manuale sia la resa esatta.`,
    },
    {
      title: md`Ossigeno dall'anidride carbonica`,
      md: md`L'O2 della fotosintesi viene dall'acqua, scissa nelle reazioni dipendenti dalla luce. La CO2 fornisce il carbonio (e l'ossigeno) dello zucchero.`,
    },
  ],
  check: [
    {
      id: 'check-electron-transport-location',
      title: md`Dove si trova la catena`,
      topic: md`Bioenergetica`,
      stemMd: md`In una cellula umana, dove si svolge la catena di trasporto degli elettroni della respirazione aerobica?`,
      options: [
        { id: 'A', text: md`Nel citoplasma`, note: md`Il citoplasma è la sede della glicolisi, non della catena di trasporto degli elettroni.` },
        { id: 'B', text: md`Nella matrice mitocondriale`, note: md`La matrice ospita la reazione ponte e il ciclo di Krebs; la catena si trova nella membrana che la circonda.` },
        { id: 'C', text: md`Nella membrana mitocondriale interna`, note: '' },
        { id: 'D', text: md`Nella membrana mitocondriale esterna`, note: md`La membrana esterna è liscia e permeabile; la catena e l'ATP sintasi si trovano nella membrana interna ripiegata.` },
        { id: 'E', text: md`Nelle membrane dei tilacoidi`, note: md`I tilacoidi ospitano la catena di trasporto della fotosintesi, e le cellule umane non hanno cloroplasti.` },
      ],
      answer: 'C',
      workingMd: md`Le proteine della catena di trasporto degli elettroni e l'ATP sintasi sono inserite nella membrana mitocondriale interna, ripiegata in creste. I protoni vengono pompati dalla matrice nello spazio intermembrana e rifluiscono attraverso l'ATP sintasi.`,
      lesson: md`Le creste ospitano la catena; la matrice il ciclo di Krebs; il citoplasma la glicolisi.`,
    },
    {
      id: 'check-lactate-purpose',
      title: md`Perché il muscolo produce lattato`,
      topic: md`Bioenergetica`,
      stemMd: md`Durante uno sforzo intenso, le cellule muscolari a corto di ossigeno trasformano il piruvato in lattato. Qual è il principale vantaggio di questa reazione per la cellula?`,
      options: [
        { id: 'A', text: md`Rigenera il NAD+, così la glicolisi può continuare a produrre ATP.`, note: '' },
        { id: 'B', text: md`Produce ATP in aggiunta a quello prodotto dalla glicolisi.`, note: md`La trasformazione del piruvato in lattato non produce alcun ATP.` },
        { id: 'C', text: md`Libera CO2, che stimola la respirazione polmonare.`, note: md`La fermentazione lattica non libera CO2; è la fermentazione alcolica a farlo.` },
        { id: 'D', text: md`Fornisce elettroni alla catena di trasporto degli elettroni.`, note: md`Senza ossigeno la catena è ferma; la formazione di lattato toglie elettroni al NADH invece di consegnarli alla catena.` },
        { id: 'E', text: md`Immette il lattato direttamente nel ciclo di Krebs all'interno della cellula muscolare.`, note: md`Anche il ciclo di Krebs è fermo quando la catena si blocca; il lattato viene trasportato altrove e smaltito più tardi, soprattutto quando l'ossigeno torna disponibile.` },
      ],
      answer: 'A',
      workingMd: md`La glicolisi ha bisogno di NAD+ come accettore di elettroni. Senza ossigeno il NADH non può essere riossidato dalla catena, per cui la cellula riduce il piruvato a lattato usando il NADH, che torna NAD+ e permette alla glicolisi di continuare a produrre i suoi 2 ATP netti per glucosio.`,
      lesson: md`La fermentazione conviene perché ricicla il NAD+, non perché produca ATP proprio.`,
    },
    {
      id: 'check-oxygen-source',
      title: md`Da dove viene l'ossigeno`,
      topic: md`Bioenergetica`,
      stemMd: md`Da quale fonte proviene l'ossigeno liberato da una pianta durante la fotosintesi?`,
      options: [
        { id: 'A', text: md`Dall'anidride carbonica, scissa nel ciclo di Calvin`, note: md`Gli atomi di ossigeno della CO2 finiscono nello zucchero e nell'acqua, non nell'O2 liberato.` },
        { id: 'B', text: md`Dal glucosio, demolito nel cloroplasto`, note: md`Il glucosio è un prodotto della fotosintesi, non la fonte del suo ossigeno; demolire glucosio è respirazione.` },
        { id: 'C', text: md`Dal ribulosio bisfosfato, quando la RuBisCO agisce su di esso`, note: md`La RuBisCO fissa la CO2 sul RuBP; in quella tappa non si libera O2.` },
        { id: 'D', text: md`Dal glicerato 3-fosfato, quando viene ridotto`, note: md`La riduzione del glicerato 3-fosfato consuma ATP e NADPH e non libera ossigeno.` },
        { id: 'E', text: md`Dall'acqua, scissa nelle reazioni dipendenti dalla luce`, note: '' },
      ],
      answer: 'E',
      workingMd: md`La fotolisi dell'acqua nelle reazioni dipendenti dalla luce sostituisce gli elettroni persi dalla clorofilla e libera O2. Gli esperimenti con l'isotopo ossigeno-18 mostrano che solo l'acqua marcata dà O2 marcato.`,
      lesson: md`L'ossigeno della fotosintesi viene dall'acqua; l'anidride carbonica fornisce lo zucchero.`,
    },
  ],
  takeaways: [
    md`La glicolisi (citoplasma) dà 2 ATP netti; reazione ponte e ciclo di Krebs (matrice) liberano il carbonio come CO2 e caricano NADH e FADH2.`,
    md`La fosforilazione ossidativa nella membrana interna produce la maggior parte dell'ATP, circa 30–32 per glucosio in tutto (il valore varia da un testo all'altro).`,
    md`L'ossigeno è l'accettore finale di elettroni; senza di esso la fermentazione ricicla il NAD+ e solo la glicolisi produce ATP.`,
    md`Le reazioni dipendenti dalla luce (tilacoidi) scindono l'acqua, liberano O2 e producono ATP e NADPH; il ciclo di Calvin (stroma) fissa la CO2 con la RuBisCO.`,
  ],
  flashcards: [
    { front: md`Prodotti della glicolisi per glucosio`, back: md`2 piruvati, 2 ATP netti e 2 NADH, nel citoplasma, senza ossigeno.` },
    { front: md`Prodotti del ciclo di Krebs per glucosio`, back: md`Due giri danno 4 CO2, 2 ATP (o GTP), 6 NADH e 2 FADH2, nella matrice mitocondriale.` },
    { front: md`Chemiosmosi`, back: md`La catena di trasporto degli elettroni pompa protoni attraverso una membrana; il loro riflusso attraverso l'ATP sintasi alimenta la sintesi di ATP.` },
    { front: md`ATP per glucosio nella respirazione aerobica`, back: md`Circa 30–32 nei testi attuali (36–38 in quelli più vecchi); il valore varia da un testo all'altro.` },
    { front: md`Fermentazione lattica e alcolica`, back: md`Il muscolo riduce il piruvato a lattato; il lievito lo trasforma in etanolo e CO2. Entrambe rigenerano NAD+ e non producono ATP oltre a quello della glicolisi.` },
    { front: md`Reazioni dipendenti dalla luce e ciclo di Calvin`, back: md`Membrane dei tilacoidi: acqua scissa, O2 liberato, ATP e NADPH prodotti. Stroma: la RuBisCO fissa la CO2 sul RuBP e ATP e NADPH riducono il prodotto a trioso fosfato.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-bioenergetics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const cellCycleMitosisAndMeiosisLessonIt: Lesson = {
  slug: 'cell-cycle-mitosis-and-meiosis',
  title: md`Il ciclo cellulare, la mitosi e la meiosi`,
  summary: md`L'interfase e i suoi punti di controllo, le fasi di mitosi e meiosi, e come contare cromosomi, cromatidi e DNA in ogni fase.`,
  minutes: 24,
  objectives: [
    md`Descrivere il ciclo cellulare e gli eventi di ogni fase della mitosi e della meiosi.`,
    md`Contare cromosomi, cromatidi e contenuto di DNA in una cellula in qualsiasi fase delle due divisioni.`,
    md`Spiegare come la meiosi produce variabilità genetica e come la non disgiunzione produce aneuploidie.`,
  ],
  teachMd: md`
### Cromosomi, cromatidi e ploidia

Un **cromosoma** è una molecola di DNA con le sue proteine. Prima della duplicazione è formato da un solo **cromatidio** (*chromatid*); dopo la duplicazione è formato da due **cromatidi fratelli** (*sister chromatids*) identici uniti al **centromero**, ma resta un solo cromosoma. Il modo più sicuro per contare i cromosomi è contare i centromeri.

I **cromosomi omologhi** (*homologous chromosomes*) sono una coppia, uno per genitore, che porta gli stessi geni nelle stesse posizioni (loci), anche se con alleli eventualmente diversi. Una cellula **diploide** (2n) ha due corredi di cromosomi; una cellula **aploide** (n) ne ha uno. Le cellule somatiche umane hanno 2n = 46 (22 coppie di autosomi e due cromosomi sessuali, XX o XY); i gameti umani hanno n = 23.

### Il ciclo cellulare

| Fase | Che cosa avviene |
| --- | --- |
| G1 | la cellula cresce, produce proteine e organuli, svolge la sua normale attività |
| S | il DNA viene duplicato: ogni cromosoma ha ora due cromatidi fratelli |
| G2 | ulteriore crescita; la cellula si prepara a dividersi |
| M | mitosi (divisione del nucleo) e poi citodieresi (divisione del citoplasma) |

G1, S e G2 formano insieme l'**interfase**, di gran lunga la parte più lunga del ciclo. Le cellule che smettono di dividersi, come la maggior parte dei neuroni maturi, escono dal ciclo in uno stato di riposo, **G0**. I **punti di controllo** (*checkpoints*) alla fine di G1, alla fine di G2 e in metafase (il punto di controllo del fuso) lasciano proseguire il ciclo solo se le condizioni sono giuste: DNA integro e completamente duplicato, cromosomi correttamente agganciati al fuso. Sono gestiti da proteine chiamate cicline e chinasi dipendenti da cicline. Quando i controlli falliscono, le cellule possono dividersi senza freno, ed è questa la base del cancro.

### La mitosi

- **Profase**: la cromatina si condensa e i cromosomi diventano visibili, ciascuno formato da due cromatidi fratelli. Dai centrosomi si forma il fuso di microtubuli; il nucleolo scompare e l'involucro nucleare si disgrega. Le fibre del fuso si agganciano ai **cinetocori** dei centromeri.
- **Metafase**: i cromosomi si allineano all'equatore del fuso (la piastra metafasica).
- **Anafase**: i centromeri si dividono e i cromatidi fratelli vengono tirati verso i poli opposti. Da questo momento ogni cromatidio conta come un cromosoma.
- **Telofase**: i cromosomi raggiungono i poli e si decondensano, e attorno a ciascun gruppo si forma un involucro nucleare.

Nella **citodieresi** (*cytokinesis*) una cellula animale viene strozzata in due da un anello di filamenti di actina (solco di divisione); una cellula vegetale costruisce una **piastra cellulare** con vescicole del Golgi, che diventa la nuova parete. La mitosi dà due cellule figlie geneticamente identiche alla madre e tra loro, con lo stesso numero di cromosomi. Serve alla crescita, alla riparazione dei tessuti e alla riproduzione asessuata.

### La meiosi

La meiosi comprende una sola duplicazione del DNA seguita da due divisioni, per cui dimezza il numero di cromosomi e dà quattro cellule aploidi.

- **Meiosi I** (la divisione riduzionale). Nella **profase I** i cromosomi omologhi si appaiano (sinapsi) formando **bivalenti** (tetradi, quattro cromatidi ciascuna). Cromatidi non fratelli si scambiano segmenti in corrispondenza dei **chiasmi**: è il **crossing-over** (*crossing over*). Nella **metafase I** i bivalenti si allineano all'equatore, e l'orientamento di ciascuna coppia verso i poli è casuale. Nell'**anafase I** si separano i **cromosomi omologhi**; i cromatidi fratelli restano uniti. Ogni cellula figlia ha n cromosomi, ciascuno ancora formato da due cromatidi.
- La **meiosi II** funziona come una mitosi: nell'anafase II si separano i **cromatidi fratelli**. Il risultato sono quattro cellule aploidi i cui cromosomi hanno un solo cromatidio.

La meiosi rende diverso ogni gamete in tre modi: il **crossing-over** ricombina gli alleli lungo un cromosoma; l'**assortimento indipendente** (*independent assortment*) in metafase I dà $2^n$ combinazioni possibili di cromosomi materni e paterni ($2^{23}$, circa 8,4 milioni, nell'uomo, senza contare il crossing-over); e la **fecondazione casuale** unisce uno qualsiasi di questi gameti a uno qualsiasi dell'altro genitore.

### Contare nelle varie fasi

Per una cellula umana (2n = 46), con $c$ il contenuto di DNA di un corredo aploide di cromosomi a un cromatidio:

| Fase | Cromosomi per cellula | Cromatidi per cellula | DNA |
| --- | --- | --- | --- |
| G1 | 46 | 46 | 2c |
| G2, profase o metafase della mitosi | 46 | 92 | 4c |
| anafase della mitosi (prima della citodieresi) | 92 | 92 | 4c |
| ogni cellula dopo la mitosi | 46 | 46 | 2c |
| metafase I (23 bivalenti) | 46 | 92 | 4c |
| ogni cellula dopo la meiosi I | 23 | 46 | 2c |
| ogni cellula dopo la meiosi II | 23 | 23 | c |

Il DNA raddoppia nella fase S e si dimezza a ogni divisione; il numero di cromosomi cambia solo quando i centromeri si dividono (anafase della mitosi e anafase II) o quando gli omologhi vengono ripartiti (anafase I).

### Mitosi e meiosi a confronto

| | Mitosi | Meiosi |
| --- | --- | --- |
| divisioni | una | due |
| appaiamento degli omologhi, crossing-over | no | sì, in profase I |
| cellule figlie | due, diploidi (se lo è la madre), identiche | quattro, aploidi, geneticamente diverse |
| ruolo | crescita, riparazione, riproduzione asessuata | produzione di gameti (negli animali) |

### La non disgiunzione

Se i cromosomi omologhi non si separano nell'anafase I, o i cromatidi fratelli nell'anafase II, alcuni gameti ricevono un cromosoma in più (n + 1) e altri uno in meno (n − 1). La fecondazione con un gamete normale dà allora una **trisomia** (2n + 1, come nella sindrome di Down, tre copie del cromosoma 21, 47 cromosomi) o una **monosomia** (2n − 1, come nella sindrome di Turner, 45 cromosomi con un solo X). Un numero anomalo di cromosomi si chiama **aneuploidia**. Il fenomeno è la **non disgiunzione** (*nondisjunction*).
`,
  examples: [
    {
      id: 'example-counting-2n-8',
      title: md`Contare cromosomi e cromatidi`,
      problemMd: md`Una specie ha 2n = 8. Indicate il numero di cromosomi e di cromatidi in una cellula (a) in metafase della mitosi, (b) in anafase della mitosi, (c) in metafase I della meiosi e (d) in ciascuna cellula alla fine della meiosi I.`,
      steps: [
        md`Partite da G1: 8 cromosomi, ciascuno di un cromatidio. Dopo la fase S: sempre 8 cromosomi, ora con 16 cromatidi.`,
        md`(a) La metafase della mitosi precede ogni separazione: 8 cromosomi, 16 cromatidi.`,
        md`(b) In anafase i centromeri si dividono, per cui ogni cromatidio diventa un cromosoma: 16 cromosomi, 16 cromatidi nella cellula.`,
        md`(c) Metafase I: gli 8 cromosomi sono appaiati in 4 bivalenti, ma nulla si è ancora separato: 8 cromosomi, 16 cromatidi.`,
        md`(d) L'anafase I separa gli omologhi, non i cromatidi, per cui ogni cellula figlia riceve 4 cromosomi di due cromatidi ciascuno: 4 cromosomi, 8 cromatidi.`,
      ],
      answerMd: md`(a) 8 e 16; (b) 16 e 16; (c) 8 e 16; (d) 4 e 8. L'errore tipico in (d) è 4 e 4, che è il conteggio dopo la meiosi II.`,
    },
    {
      id: 'example-dna-mass',
      title: md`Seguire la quantità di DNA`,
      problemMd: md`Il nucleo di una cellula diploide di un animale contiene 6 pg di DNA in G1. Quanto DNA c'è nel nucleo (a) della cellula in G2, (b) di una cellula in profase I della meiosi, (c) di una cellula appena dopo la meiosi I, (d) di un gamete?`,
      steps: [
        md`La fase S raddoppia il DNA: (a) in G2 ci sono $2 \times 6 = 12$ pg.`,
        md`La meiosi comincia dopo la stessa duplicazione, e in profase I nulla si è ancora diviso: (b) 12 pg.`,
        md`La meiosi I ripartisce il DNA duplicato tra due cellule: (c) $12 \div 2 = 6$ pg, con metà dei cromosomi ma ciascuno ancora di due cromatidi.`,
        md`La meiosi II lo dimezza di nuovo: (d) $6 \div 2 = 3$ pg, metà della quantità in G1, come ci si aspetta da una cellula aploide.`,
      ],
      answerMd: md`(a) 12 pg, (b) 12 pg, (c) 6 pg, (d) 3 pg. Una cellula dopo la meiosi I ha la stessa quantità di DNA di una cellula diploide in G1 ma solo metà dei suoi cromosomi; confondere numero di cromosomi e quantità di DNA è la trappola.`,
    },
    {
      id: 'example-independent-assortment',
      title: md`Contare le combinazioni di cromosomi`,
      problemMd: md`Un organismo ha 2n = 6. Trascurando il crossing-over, quanti gameti geneticamente diversi può produrre con il solo assortimento indipendente?`,
      steps: [
        md`2n = 6 significa n = 3: tre coppie di omologhi.`,
        md`In metafase I ogni coppia si allinea indipendentemente, e verso un dato polo può andare il cromosoma materno o quello paterno: 2 possibilità per coppia.`,
        md`Moltiplicate le possibilità: $2^3 = 8$.`,
      ],
      answerMd: md`8 combinazioni diverse. Le risposte sbagliate allettanti sono 6 (il numero di cromosomi) e $2^6 = 64$ (usare 2n invece di n come esponente).`,
    },
  ],
  traps: [
    {
      title: md`Contare i cromatidi come cromosomi`,
      md: md`Un cromosoma duplicato con due cromatidi è ancora un solo cromosoma. Contate i centromeri. Il numero di cromosomi raddoppia solo nell'anafase della mitosi e nell'anafase II, quando i cromatidi si separano.`,
    },
    {
      title: md`Pensare che la meiosi II dimezzi il numero di cromosomi`,
      md: md`La meiosi I è la divisione riduzionale: separa gli omologhi e dimezza il numero (da 46 a 23 nell'uomo). La meiosi II separa i cromatidi fratelli, per cui il numero resta 23 mentre il DNA si dimezza.`,
    },
    {
      title: md`Collocare il crossing-over nella fase sbagliata`,
      md: md`Il crossing-over avviene tra cromatidi non fratelli di omologhi appaiati, in profase I. Non avviene nella mitosi, dove gli omologhi non si appaiano, né nella meiosi II.`,
    },
  ],
  check: [
    {
      id: 'check-anaphase-count',
      title: md`Cromosomi in anafase`,
      topic: md`Ciclo cellulare e riproduzione`,
      stemMd: md`Quanti cromosomi sono presenti in una cellula umana durante l'anafase della mitosi, prima della citodieresi?`,
      options: [
        { id: 'A', text: md`23`, note: md`È il numero aploide di un gamete; la mitosi non dimezza il numero di cromosomi.` },
        { id: 'B', text: md`46`, note: md`È il numero in metafase, prima che i centromeri si dividano.` },
        { id: 'C', text: md`69`, note: md`69 corrisponderebbe a tre corredi aploidi (triploidia); nulla nella mitosi lo produce.` },
        { id: 'D', text: md`92`, note: '' },
        { id: 'E', text: md`184`, note: md`Raddoppia di nuovo 92, contando i cromatidi come se ogni cromosoma separato ne avesse ancora due.` },
      ],
      answer: 'D',
      workingMd: md`Dopo la fase S una cellula umana ha 46 cromosomi di due cromatidi ciascuno, cioè 92 cromatidi. In anafase i centromeri si dividono, per cui ciascuno dei 92 cromatidi diventa un cromosoma, diretto verso l'uno o l'altro polo, finché la citodieresi ne assegna 46 a ogni cellula figlia.`,
      lesson: md`Quando i centromeri si dividono, il numero di cromatidi diventa il numero di cromosomi.`,
    },
    {
      id: 'check-crossing-over-stage',
      title: md`Quando avviene il crossing-over`,
      topic: md`Ciclo cellulare e riproduzione`,
      stemMd: md`In quale fase avviene il crossing-over tra cromosomi omologhi?`,
      options: [
        { id: 'A', text: md`Profase della mitosi`, note: md`Nella mitosi i cromosomi omologhi non si appaiano, quindi non c'è crossing-over tra di loro.` },
        { id: 'B', text: md`Profase I della meiosi`, note: '' },
        { id: 'C', text: md`Anafase II della meiosi`, note: md`Nell'anafase II si separano i cromatidi fratelli; gli omologhi sono già stati separati nella meiosi I.` },
        { id: 'D', text: md`Fase S dell'interfase`, note: md`La fase S duplica il DNA; in quel momento gli omologhi non sono appaiati.` },
        { id: 'E', text: md`Metafase II della meiosi`, note: md`In metafase II si allineano cromosomi singoli; gli omologhi non sono più insieme per scambiarsi segmenti.` },
      ],
      answer: 'B',
      workingMd: md`Gli omologhi si appaiano durante la profase I formando i bivalenti, e cromatidi non fratelli si scambiano segmenti in corrispondenza dei chiasmi. Nessun'altra fase riunisce gli omologhi.`,
      lesson: md`L'appaiamento degli omologhi, e con esso il crossing-over, appartiene solo alla profase I.`,
    },
    {
      id: 'check-after-meiosis-one',
      title: md`Dopo la prima divisione`,
      topic: md`Ciclo cellulare e riproduzione`,
      stemMd: md`Una cellula con 2n = 12 va incontro alla meiosi. Quanti cromosomi e quanti cromatidi contiene ciascuna cellula alla fine della meiosi I?`,
      options: [
        { id: 'A', text: md`6 cromosomi e 6 cromatidi`, note: md`È il conteggio dopo la meiosi II, quando si sono separati anche i cromatidi fratelli.` },
        { id: 'B', text: md`12 cromosomi e 24 cromatidi`, note: md`È la cellula prima che la meiosi I si compia, dopo la duplicazione del DNA.` },
        { id: 'C', text: md`6 cromosomi e 12 cromatidi`, note: '' },
        { id: 'D', text: md`12 cromosomi e 12 cromatidi`, note: md`È una cellula figlia della mitosi, o la cellula in G1; la meiosi I dimezza il numero di cromosomi.` },
        { id: 'E', text: md`3 cromosomi e 6 cromatidi`, note: md`Dimezza il numero due volte; la meiosi I lo dimezza una volta sola, da 12 a 6.` },
      ],
      answer: 'C',
      workingMd: md`Dopo la duplicazione la cellula ha 12 cromosomi e 24 cromatidi. L'anafase I separa i cromosomi omologhi senza dividere i centromeri, per cui ogni cellula figlia riceve 6 cromosomi, ciascuno ancora di due cromatidi: 12 cromatidi.`,
      lesson: md`La meiosi I dimezza i cromosomi; la meiosi II dimezza i cromatidi per cromosoma.`,
    },
  ],
  takeaways: [
    md`L'interfase (G1, S, G2) occupa gran parte del ciclo; il DNA raddoppia nella fase S e i punti di controllo regolano l'avanzamento.`,
    md`La mitosi dà due cellule identiche con il numero di cromosomi della madre; la meiosi dà quattro cellule aploidi diverse.`,
    md`La meiosi I separa gli omologhi e dimezza il numero di cromosomi; la meiosi II separa i cromatidi fratelli.`,
    md`Crossing-over (profase I), assortimento indipendente (metafase I) e fecondazione casuale creano variabilità.`,
    md`La non disgiunzione dà gameti con un cromosoma in più o in meno, da cui trisomie o monosomie.`,
  ],
  flashcards: [
    { front: md`Cromosoma e cromatidio`, back: md`Un cromosoma è una molecola di DNA con le sue proteine; dopo la duplicazione ha due cromatidi fratelli identici uniti al centromero e conta ancora come un solo cromosoma.` },
    { front: md`Fasi del ciclo cellulare`, back: md`G1 (crescita), S (duplicazione del DNA), G2 (preparazione), M (mitosi e citodieresi); G0 è uno stato di riposo fuori dal ciclo.` },
    { front: md`Che cosa si separa nell'anafase della mitosi, nell'anafase I e nell'anafase II`, back: md`Mitosi: cromatidi fratelli. Anafase I: cromosomi omologhi. Anafase II: cromatidi fratelli.` },
    { front: md`Fonti di variabilità nella meiosi`, back: md`Crossing-over in profase I, assortimento indipendente in metafase I ($2^n$ combinazioni) e fecondazione casuale.` },
    { front: md`Numero di cromosomi nell'uomo`, back: md`Cellule somatiche 2n = 46 (22 coppie di autosomi più XX o XY); gameti n = 23.` },
    { front: md`Non disgiunzione`, back: md`Mancata separazione di omologhi o di cromatidi fratelli; i gameti ricevono n + 1 o n − 1 cromosomi, da cui trisomie (come la trisomia 21) o monosomie.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-reproduction' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const dnaReplicationAndProteinSynthesisLessonIt: Lesson = {
  slug: 'dna-replication-and-protein-synthesis',
  title: md`La duplicazione del DNA e la sintesi proteica`,
  summary: md`Duplicazione semiconservativa e i suoi enzimi, trascrizione e maturazione dell'RNA, codice genetico e traduzione, con sequenze svolte filamento per filamento.`,
  minutes: 25,
  objectives: [
    md`Spiegare la duplicazione semiconservativa, il risultato di Meselson e Stahl e il ruolo degli enzimi della duplicazione.`,
    md`Trascrivere una sequenza di DNA in mRNA e tradurla con una tabella dei codoni, senza confondere le estremità 5′ e 3′.`,
    md`Descrivere la maturazione dell'RNA, le proprietà del codice genetico e le fasi della traduzione.`,
  ],
  teachMd: md`
### La doppia elica

Il DNA è formato da due filamenti polinucleotidici avvolti l'uno attorno all'altro. Gli scheletri zucchero-fosfato stanno all'esterno e le basi si appaiano all'interno: **adenina con timina** (due legami a idrogeno) e **guanina con citosina** (tre legami a idrogeno). I filamenti sono **antiparalleli** (*antiparallel*): ciascuno ha un'estremità 5′ (con un fosfato libero) e un'estremità 3′ (con un ossidrile libero sullo zucchero), e i due corrono in direzioni opposte. Poiché l'appaiamento è complementare, la sequenza di un filamento determina quella dell'altro. Un DNA ricco di coppie G–C richiede più energia per separare i filamenti.

### La duplicazione semiconservativa

Quando il DNA si duplica, i due filamenti si separano e ciascuno fa da stampo per un nuovo filamento. Ogni molecola figlia contiene quindi **un filamento vecchio e uno nuovo**: la duplicazione è **semiconservativa** (*semi-conservative replication*).

Meselson e Stahl lo dimostrarono coltivando batteri con azoto pesante (15N) finché tutto il loro DNA era pesante, poi trasferendoli su azoto leggero (14N) e separando il DNA per densità in una centrifuga:

| Generazioni in 14N | Bande osservate |
| --- | --- |
| 0 | tutto pesante |
| 1 | tutto intermedio (ibrido) |
| 2 | metà intermedio, metà leggero |
| 3 | un quarto intermedio, tre quarti leggero |

Un'unica banda intermedia dopo una generazione escluse la duplicazione conservativa (che darebbe una banda pesante e una leggera); il risultato metà e metà dopo due generazioni escluse un modello dispersivo (che darebbe un'unica banda sempre più leggera).

### Gli enzimi della duplicazione

| Enzima o proteina | Compito |
| --- | --- |
| elicasi (*helicase*) | svolge la doppia elica alla forcella di replicazione, rompendo i legami a idrogeno tra le basi |
| proteine che legano il singolo filamento | tengono separati i filamenti aperti |
| topoisomerasi | allenta la tensione di torsione davanti alla forcella |
| primasi (*primase*) | produce un breve innesco di RNA (*primer*), perché la DNA polimerasi non può iniziare un filamento dal nulla |
| DNA polimerasi (*DNA polymerase*) | aggiunge nucleotidi all'estremità 3′ del filamento in crescita e corregge i propri errori |
| DNA ligasi (*DNA ligase*) | unisce frammenti di DNA formando legami fosfodiesterici |

La DNA polimerasi può aggiungere nucleotidi solo a un'estremità 3′, per cui il nuovo DNA cresce sempre in direzione **5′ → 3′** mentre lo stampo viene letto 3′ → 5′. A ogni forcella un filamento nuovo, il **filamento guida** (*leading strand*), è sintetizzato in modo continuo verso la forcella. L'altro, il **filamento lento** (*lagging strand*), è sintetizzato in brevi tratti, i **frammenti di Okazaki** (*Okazaki fragments*), ciascuno a partire dal proprio innesco; gli inneschi vengono poi sostituiti da DNA e i frammenti uniti dalla ligasi. Il cromosoma circolare batterico ha una sola origine di replicazione; ogni cromosoma eucariotico ne ha molte.

### La trascrizione

I geni si esprimono in due tappe: il DNA viene **trascritto** in RNA, e l'RNA messaggero viene **tradotto** in proteina. Partecipano tre tipi di RNA: l'**mRNA** porta il codice, il **tRNA** porta gli amminoacidi, l'**rRNA** forma il nucleo dei ribosomi. Rispetto al DNA, l'RNA ha ribosio, uracile al posto della timina ed è di solito a singolo filamento.

Negli eucarioti la trascrizione avviene nel nucleo. L'**RNA polimerasi** si lega a un **promotore**, svolge un breve tratto di DNA e legge un filamento, il **filamento stampo** (*template strand*), in direzione 3′ → 5′, costruendo l'mRNA 5′ → 3′ per appaiamento complementare (una A nel DNA dà una U nell'RNA). Non ha bisogno di innesco. L'altro filamento, il **filamento codificante** (*coding strand*), ha la stessa sequenza dell'mRNA, con T al posto di U.

Negli eucarioti il pre-mRNA viene poi **maturato**: si aggiungono un **cappuccio al 5′** (*5′ cap*) e una **coda di poli-A** al 3′, che proteggono l'mRNA e ne favoriscono l'esportazione e la traduzione, e lo **splicing** rimuove gli **introni** non codificanti e unisce gli **esoni**. Unendo gli esoni in combinazioni diverse (splicing alternativo), un solo gene può dare più proteine. L'mRNA dei procarioti di solito non ha introni, e la traduzione può iniziare mentre la trascrizione è ancora in corso.

### Il codice genetico

Ogni **codone** (*codon*), tre basi dell'mRNA, specifica un amminoacido. Con quattro basi i codoni sono $4^3 = 64$: 61 codificano amminoacidi e 3 sono **codoni di stop** (UAA, UAG, UGA). **AUG** codifica la metionina ed è il normale **codone di inizio** (*start codon*). Il codice è:

- **degenerato** (ridondante): la maggior parte degli amminoacidi ha più di un codone;
- **non ambiguo**: ogni codone specifica un solo amminoacido;
- **non sovrapposto** e letto in una cornice fissa a partire dal codone di inizio;
- **quasi universale**: è lo stesso in quasi tutti gli organismi, ed è per questo che i batteri possono produrre proteine umane.

### La traduzione

La traduzione avviene sui **ribosomi** nel citoplasma, liberi o sul reticolo rugoso. Ogni **tRNA** porta un amminoacido specifico, attaccato da un enzima che usa ATP, e ha un **anticodone** che si appaia con un codone in modo antiparallelo: il codone 5′-AUG-3′ si appaia con l'anticodone 3′-UAC-5′.

- **Inizio**: la subunità minore del ribosoma si lega all'mRNA e trova il codone di inizio; il tRNA iniziatore, che porta la metionina, vi si appaia; si unisce la subunità maggiore.
- **Allungamento**: il tRNA successivo si appaia al codone seguente; il ribosoma unisce la catena in crescita al suo amminoacido con un legame peptidico (una reazione catalizzata dall'rRNA); il ribosoma avanza lungo l'mRNA un codone alla volta, in direzione 5′ → 3′.
- **Terminazione**: a un codone di stop, che nessun tRNA riconosce, si lega un fattore di rilascio e il polipeptide viene liberato.

Più ribosomi possono tradurre contemporaneamente lo stesso mRNA (un **poliribosoma**).
`,
  examples: [
    {
      id: 'example-meselson-stahl',
      title: md`Prevedere le bande di densità`,
      problemMd: md`Batteri con DNA interamente pesante (15N) vengono trasferiti in un terreno che contiene solo azoto leggero (14N). Quali bande comparirebbero dopo due generazioni se la duplicazione fosse conservativa, e che cosa si osserva in realtà?`,
      steps: [
        md`La duplicazione conservativa manterrebbe intatta ogni doppia elica originale e ne produrrebbe una interamente nuova. Dopo una generazione: 1 molecola pesante e 1 leggera per ogni originale.`,
        md`Dopo due generazioni, con quel modello: la molecola pesante viene copiata di nuovo in una leggera, e quelle leggere ne danno altre leggere: 1 pesante e 3 leggere, quindi una banda pesante e una leggera.`,
        md`Con la duplicazione semiconservativa, che è quella reale, dopo una generazione ogni molecola è ibrida (un filamento pesante, uno leggero).`,
        md`Dopo due generazioni ogni ibrido dà una molecola ibrida e una leggera: metà intermedio, metà leggero.`,
      ],
      answerMd: md`Conservativa: una banda pesante (un quarto) e una leggera (tre quarti). Osservato: metà intermedio, metà leggero, senza banda pesante. Dire "tutto intermedio" descrive solo la prima generazione.`,
    },
    {
      id: 'example-transcribe-translate',
      title: md`Dal filamento stampo al peptide`,
      problemMd: md`Un filamento stampo di DNA ha la sequenza 3′-TACGGTCAAATT-5′. Scrivete l'mRNA e il peptide che codifica. (Dalla tabella dei codoni: AUG = Met, CCA = Pro, GUU = Val, UAA = stop.)`,
      steps: [
        md`L'mRNA è complementare e antiparallelo allo stampo, quindi leggete lo stampo 3′ → 5′ e scrivete l'mRNA 5′ → 3′: T dà A, A dà U, C dà G, G dà C.`,
        md`Base per base: TAC dà AUG, GGT dà CCA, CAA dà GUU, ATT dà UAA. L'mRNA è 5′-AUGCCAGUUUAA-3′.`,
        md`Leggete i codoni dall'estremità 5′, a partire da AUG: AUG, CCA, GUU, UAA.`,
        md`Traducete: Met, Pro, Val, poi stop. Il codone di stop non aggiunge alcun amminoacido.`,
      ],
      answerMd: md`mRNA 5′-AUGCCAGUUUAA-3′; peptide Met-Pro-Val. Errori frequenti sono scrivere T nell'mRNA, o tradurre quattro amminoacidi trattando UAA come un amminoacido.`,
    },
    {
      id: 'example-coding-length',
      title: md`Quanto è lunga la sequenza codificante?`,
      problemMd: md`Un polipeptide ha 300 amminoacidi. Qual è il numero minimo di nucleotidi dell'mRNA dal codone di inizio alla fine del codone di stop, e perché il gene è ancora più lungo?`,
      steps: [
        md`Ogni amminoacido richiede un codone di 3 nucleotidi: $300 \times 3 = 900$ nucleotidi, compreso il codone di inizio, che codifica la prima metionina.`,
        md`Il codone di stop non codifica amminoacidi ma fa parte della cornice di lettura: $900 + 3 = 903$ nucleotidi.`,
        md`L'mRNA maturo ha anche regioni non tradotte alle due estremità, un cappuccio e una coda di poli-A, e il gene eucariotico contiene introni che vengono rimossi con lo splicing, per cui entrambi sono più lunghi di 903 nucleotidi.`,
      ],
      answerMd: md`Almeno 903 nucleotidi. Rispondere 900 dimentica il codone di stop; rispondere 100 divide per 3 invece di moltiplicare.`,
    },
  ],
  traps: [
    {
      title: md`Scrivere l'mRNA dal filamento sbagliato`,
      md: md`L'mRNA è complementare al filamento stampo e identico al filamento codificante (con U al posto di T). Prima di scrivere qualsiasi cosa, controllate quale filamento vi dà la domanda.`,
    },
    {
      title: md`Perdere di vista le estremità 5′ e 3′`,
      md: md`Sia la DNA polimerasi sia l'RNA polimerasi costruiscono in direzione 5′ → 3′, leggendo lo stampo 3′ → 5′. Una sequenza scritta con l'orientamento sbagliato è un'altra sequenza, e una risposta sbagliata può essere proprio questa.`,
    },
    {
      title: md`Confondere degenerato con ambiguo`,
      md: md`Degenerato significa che un amminoacido può avere più codoni. Ambiguo significherebbe che un codone ha più amminoacidi, cosa che il codice non ammette.`,
    },
  ],
  check: [
    {
      id: 'check-coding-to-mrna',
      title: md`Dal filamento codificante all'mRNA`,
      topic: md`Genetica`,
      stemMd: md`Il filamento codificante di un breve tratto di DNA ha la sequenza 5′-ATGGCA-3′. Qual è la sequenza dell'mRNA trascritto da questa regione?`,
      options: [
        { id: 'A', text: md`3′-UACCGU-5′`, note: md`È complementare al filamento codificante; sarebbe l'mRNA solo se il filamento codificante fosse lo stampo.` },
        { id: 'B', text: md`5′-AUGGCA-3′`, note: '' },
        { id: 'C', text: md`5′-ATGGCA-3′`, note: md`La sequenza è giusta ma contiene timina, che l'RNA non ha; l'RNA ha uracile.` },
        { id: 'D', text: md`3′-AUGGCA-5′`, note: md`Le basi sono giuste ma le estremità sono invertite; l'mRNA ha la stessa direzione del filamento codificante.` },
        { id: 'E', text: md`5′-ACGGUA-3′`, note: md`Legge la sequenza codificante al contrario; è un'altra sequenza, non la stessa girata.` },
      ],
      answer: 'B',
      workingMd: md`Il filamento stampo è il complementare del filamento codificante, 3′-TACCGT-5′. L'RNA polimerasi costruisce l'mRNA complementare a esso, 5′ → 3′: 5′-AUGGCA-3′, cioè il filamento codificante con U al posto di T.`,
      lesson: md`L'mRNA è uguale al filamento codificante, nella stessa direzione, con uracile al posto della timina.`,
    },
    {
      id: 'check-meselson-two-generations',
      title: md`Due generazioni con azoto leggero`,
      topic: md`Genetica`,
      stemMd: md`Batteri con DNA solo pesante (15N) vengono coltivati per esattamente due generazioni in un terreno che contiene solo azoto leggero (14N). Quale risultato mostrano gli esperimenti di centrifugazione in gradiente di densità?`,
      options: [
        { id: 'A', text: md`Tutto il DNA è pesante.`, note: md`I nuovi filamenti sono costruiti con l'azoto leggero del terreno, quindi il DNA non può restare interamente pesante.` },
        { id: 'B', text: md`Tutto il DNA è intermedio.`, note: md`Questo è il risultato dopo una generazione; nella seconda, le molecole ibride danno anche molecole leggere.` },
        { id: 'C', text: md`Metà del DNA è pesante e metà leggero.`, note: md`Una banda pesante e una leggera sono ciò che darebbe la duplicazione conservativa; con quella semiconservativa non resta alcuna molecola interamente pesante.` },
        { id: 'D', text: md`Un quarto del DNA è intermedio e tre quarti sono leggeri.`, note: md`Questo è il risultato dopo tre generazioni, non due.` },
        { id: 'E', text: md`Metà del DNA è intermedio e metà leggero.`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Dopo una generazione ogni molecola è ibrida: un filamento pesante, uno leggero. Nella seconda generazione ogni ibrido si separa; il filamento pesante si appaia con un nuovo filamento leggero (intermedio) e quello leggero con un altro filamento leggero (leggero). Quindi metà intermedio, metà leggero.`,
      lesson: md`Seguite i filamenti originali: ciascuno finisce in esattamente una molecola ibrida in ogni generazione successiva.`,
    },
    {
      id: 'check-okazaki-fragments',
      title: md`Che cosa sono i frammenti di Okazaki`,
      topic: md`Genetica`,
      stemMd: md`Quale affermazione descrive correttamente i frammenti di Okazaki?`,
      options: [
        { id: 'A', text: md`Brevi tratti di DNA sintetizzati sul filamento lento e poi uniti dalla DNA ligasi`, note: '' },
        { id: 'B', text: md`Inneschi di RNA prodotti solo sul filamento guida`, note: md`Gli inneschi sono brevi tratti di RNA, non frammenti di Okazaki, e il filamento lento ne richiede molti, uno per frammento.` },
        { id: 'C', text: md`Introni rimossi dal pre-mRNA durante lo splicing`, note: md`Gli introni riguardano la maturazione dell'RNA dopo la trascrizione, non la duplicazione del DNA.` },
        { id: 'D', text: md`Tratti di mRNA tradotti contemporaneamente da più ribosomi`, note: md`Più ribosomi su un mRNA formano un poliribosoma; si tratta di traduzione, non di duplicazione.` },
        { id: 'E', text: md`Tratti della doppia elica svolti dall'elicasi davanti alla forcella`, note: md`L'elicasi svolge il DNA parentale; i frammenti di Okazaki sono DNA di nuova sintesi.` },
      ],
      answer: 'A',
      workingMd: md`La DNA polimerasi può allungare solo un'estremità 3′, per cui il filamento il cui stampo corre nel verso sbagliato per una sintesi continua viene prodotto in brevi tratti, ciascuno iniziato da un innesco di RNA. Gli inneschi vengono sostituiti da DNA e la ligasi unisce i tratti con legami fosfodiesterici.`,
      lesson: md`I frammenti di Okazaki esistono perché la DNA polimerasi lavora solo in direzione 5′ → 3′.`,
    },
  ],
  takeaways: [
    md`I filamenti del DNA sono antiparalleli e complementari: A con T (due legami a idrogeno), G con C (tre).`,
    md`La duplicazione è semiconservativa; le polimerasi costruiscono 5′ → 3′, per cui il filamento lento è sintetizzato in frammenti di Okazaki uniti dalla ligasi.`,
    md`L'mRNA è complementare al filamento stampo e uguale al filamento codificante con U al posto di T; il pre-mRNA eucariotico riceve cappuccio e coda e subisce lo splicing.`,
    md`Il codice è a triplette: 64 codoni, 61 per gli amminoacidi, 3 di stop; degenerato, non ambiguo e quasi universale.`,
    md`La traduzione procede con l'inizio su AUG, l'allungamento codone per codone e la terminazione a un codone di stop.`,
  ],
  flashcards: [
    { front: md`Duplicazione semiconservativa`, back: md`Ogni nuova molecola di DNA ha un filamento originale e uno nuovo, come mostrarono Meselson e Stahl con 15N e 14N.` },
    { front: md`Elicasi, primasi, DNA polimerasi, ligasi`, back: md`L'elicasi svolge; la primasi pone un innesco di RNA; la DNA polimerasi allunga le estremità 3′ e corregge gli errori; la ligasi unisce i frammenti.` },
    { front: md`Filamento guida e filamento lento`, back: md`Il filamento guida è sintetizzato in modo continuo; il filamento lento in frammenti di Okazaki, ciascuno con il proprio innesco, poi uniti dalla ligasi.` },
    { front: md`Filamento stampo e filamento codificante`, back: md`L'RNA polimerasi legge il filamento stampo; l'mRNA ha la stessa sequenza del filamento codificante, con U al posto di T.` },
    { front: md`Maturazione dell'mRNA eucariotico`, back: md`Si aggiungono un cappuccio al 5′ e una coda di poli-A al 3′, e gli introni vengono rimossi con lo splicing, che unisce gli esoni.` },
    { front: md`Codoni di inizio e di stop`, back: md`AUG (metionina) è il codone di inizio; UAA, UAG e UGA sono codoni di stop e non codificano amminoacidi.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-genetics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};
