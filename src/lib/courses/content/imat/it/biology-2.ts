import { md, type Lesson } from '../../../types';

/**
 * Biologia IMAT, seconda parte: genetica, biotecnologie, evoluzione,
 * fisiologia umana e riproduzione. Versione italiana di ../biology-2.ts.
 */

export const mendelianGeneticsAndPedigreesLessonIt: Lesson = {
  slug: 'mendelian-genetics-and-pedigrees',
  title: 'Genetica mendeliana, incroci e alberi genealogici',
  summary: 'Prevedere la progenie di incroci a uno e due geni, gestire codominanza ed eredità legata al sesso, leggere un albero genealogico.',
  minutes: 25,
  objectives: [
    md`Usare le leggi di Mendel, il quadrato di Punnett e la regola del prodotto per prevedere i rapporti genotipici e fenotipici.`,
    md`Trattare dominanza incompleta, codominanza, allelia multipla e geni legati all'X.`,
    md`Leggere un albero genealogico, escludere i modi di trasmissione e calcolare probabilità che tengano conto di ciò che l'albero già dice.`,
  ],
  teachMd: md`
### Il lessico di base

Un **gene** è un tratto di DNA in una posizione fissa (il suo **locus**) su un cromosoma. Le diverse versioni di un gene sono gli **alleli** (*alleles*). Le cellule somatiche sono diploidi, quindi ogni persona possiede due alleli di ciascun gene autosomico, uno ereditato da ciascun genitore. La coppia di alleli è il **genotipo**; il carattere osservabile è il **fenotipo**. Due alleli uguali rendono l'individuo **omozigote** (AA o aa); due alleli diversi lo rendono **eterozigote** (Aa). Un allele **dominante** manifesta il proprio effetto anche nell'eterozigote; un allele **recessivo** si manifesta solo se manca l'allele dominante. Per convenzione l'allele dominante si indica con la lettera maiuscola e il recessivo con la stessa lettera minuscola.

### Le due leggi di Mendel

**Segregazione** (*law of segregation*). I due alleli di un gene si separano quando si formano i gameti, perciò ogni gamete ne porta uno solo. Un genitore Aa produce gameti A e gameti a in numero uguale. La base fisica è la meiosi I, in cui i cromosomi omologhi migrano ai poli opposti.

**Assortimento indipendente** (*independent assortment*). Gli alleli di geni diversi entrano nei gameti indipendentemente gli uni dagli altri: un genitore AaBb produce gameti AB, Ab, aB e ab in proporzioni uguali. Il motivo è che ogni coppia di omologhi si dispone in metafase I con un orientamento casuale. La legge vale per geni su cromosomi diversi. Geni vicini sullo stesso cromosoma sono **associati** (*linked*): tendono a passare insieme e solo il crossing-over (*crossing over*) li separa.

### Quadrato di Punnett e regola del prodotto

L'incrocio tra due eterozigoti, Aa × Aa, dà:

| | A | a |
| --- | --- | --- |
| **A** | AA | Aa |
| **a** | Aa | aa |

Cioè 1 AA : 2 Aa : 1 aa, quindi 3 fenotipi dominanti per 1 recessivo. Con due o più geni che assortiscono in modo indipendente non serve disegnare un quadrato da 16 caselle: si risolve un gene alla volta e si **moltiplicano** le probabilità. In AaBb × AaBb la probabilità di mostrare entrambi i caratteri dominanti è $\frac{3}{4} \times \frac{3}{4} = \frac{9}{16}$, da cui il rapporto 9 : 3 : 3 : 1. Le probabilità si **sommano** solo quando un risultato può ottenersi in più modi che si escludono a vicenda.

Il **testcross** (*test cross*) serve a scoprire il genotipo di un individuo con fenotipo dominante: lo si incrocia con un omozigote recessivo. Se anche un solo figlio mostra il carattere recessivo, il genitore in esame è eterozigote, e il rapporto atteso è 1 : 1.

### Quando la dominanza non è semplice

- **Dominanza incompleta** (*incomplete dominance*): l'eterozigote è intermedio. Bocche di leone rosse × bianche danno figli rosa, e rosa × rosa dà rosse, rosa e bianche nel rapporto 1 : 2 : 1, per cui rapporto fenotipico e genotipico coincidono.
- **Codominanza** (*codominance*): nell'eterozigote entrambi gli alleli si esprimono pienamente.
- **Allelia multipla** (*multiple alleles*): nella popolazione il gene ha più di due alleli, anche se ogni persona ne porta comunque due.

I gruppi sanguigni AB0 mostrano insieme gli ultimi due casi. Gli alleli $I^A$ e $I^B$ sono codominanti, ed entrambi dominano su $i$.

| Genotipo | Gruppo sanguigno |
| --- | --- |
| $I^AI^A$ o $I^Ai$ | A |
| $I^BI^B$ o $I^Bi$ | B |
| $I^AI^B$ | AB |
| $ii$ | 0 |

### Geni legati al sesso

Le femmine sono XX e i maschi XY. Un gene sul cromosoma X è presente in due copie nella femmina ma in una sola nel maschio, quindi nel maschio basta un singolo allele recessivo legato all'X per manifestarsi. Per questo le malattie recessive legate all'X, come l'emofilia A e il daltonismo rosso-verde, sono molto più frequenti nei maschi. Il padre trasmette il suo X a tutte le figlie e il suo Y a tutti i figli maschi: un allele legato all'X non passa mai da padre a figlio maschio, e tutte le figlie di un padre affetto ricevono il suo allele.

### Leggere un albero genealogico

I quadrati sono maschi, i cerchi femmine, i simboli pieni individui affetti; una linea orizzontale unisce i genitori e una verticale porta ai figli. Si mette alla prova ogni modo di trasmissione, supponendo che il carattere compaia in tutti coloro che hanno il genotipo che lo determina e che non intervengano nuove mutazioni:

| Che cosa si osserva | Che cosa se ne deduce |
| --- | --- |
| Due genitori sani con un figlio affetto | Il carattere è recessivo; entrambi i genitori sono portatori (o, se legato all'X, la madre) |
| Ogni figlio affetto ha un genitore affetto; il carattere compare in ogni generazione | È probabile una trasmissione dominante |
| Una figlia affetta con il padre sano | Non è recessivo legato all'X |
| Un padre affetto con una figlia sana | Non è dominante legato all'X |
| Un padre affetto con un figlio maschio affetto, nato da una madre sana e non portatrice | Non è legato all'X |

### La probabilità quando si sa già qualcosa

Spesso l'albero rivela il fenotipo di una persona, e questo esclude alcuni genotipi. Vanno eliminati prima di fare il calcolo. Il caso più comune: due portatori, Aa × Aa, hanno un figlio sano. Tra gli esiti AA, Aa, Aa, aa, l'esito aa è escluso, quindi il figlio sano è portatore con probabilità $\frac{2}{3}$, non $\frac{1}{2}$. Inoltre ogni figlio è un evento a sé: un rischio di 1 su 4 non significa che un figlio ogni quattro sarà affetto.
`,
  examples: [
    {
      id: 'example-two-gene-cross',
      title: 'Un incrocio con due geni indipendenti',
      problemMd: md`In una pianta, il fusto alto (T) domina sul basso (t) e il fiore viola (P) domina sul bianco (p). I due geni sono su cromosomi diversi. Una pianta TtPp viene incrociata con una pianta Ttpp. Quale frazione della progenie ci si aspetta alta e con fiori bianchi?`,
      steps: [
        md`Si scompone l'incrocio in un incrocio per gene, come permette l'assortimento indipendente: Tt × Tt per l'altezza e Pp × pp per il colore.`,
        md`Altezza: Tt × Tt dà 1 TT : 2 Tt : 1 tt, quindi la probabilità di una pianta alta è $\frac{3}{4}$.`,
        md`Colore: Pp × pp dà 1 Pp : 1 pp, quindi la probabilità di fiori bianchi (pp) è $\frac{1}{2}$.`,
        md`Devono verificarsi entrambi gli eventi, quindi si moltiplica: $\frac{3}{4} \times \frac{1}{2} = \frac{3}{8}$.`,
        md`Verifica contando: le combinazioni ugualmente probabili sono $4 \times 2 = 8$ (quattro per l'altezza, due per il colore); le alte sono TT, Tt, Tt, e ciascuna si combina una volta con pp, quindi 3 su 8 sono alte e bianche.`,
      ],
      answerMd: md`$\frac{3}{8}$ della progenie. La risposta sbagliata più tentante è $\frac{3}{16}$, una classe del rapporto 9 : 3 : 3 : 1, che appartiene all'incrocio TtPp × TtPp e non a questo.`,
    },
    {
      id: 'example-carrier-sibling',
      title: 'Un fratello sano in un albero recessivo',
      problemMd: md`Una malattia è autosomica recessiva. Due genitori sani hanno una figlia affetta e un figlio sano. Il figlio ha un bambino con una donna di cui si sa che è portatrice. Qual è la probabilità che il bambino sia affetto?`,
      steps: [
        md`La figlia affetta è aa, quindi ciascun genitore le ha trasmesso un allele a. Entrambi i genitori sono sani, quindi entrambi sono Aa.`,
        md`Aa × Aa dà AA, Aa, Aa e aa, ciascuno con probabilità $\frac{1}{4}$.`,
        md`Il figlio è sano, quindi per lui aa è escluso. Dei tre esiti rimasti, ugualmente probabili, due sono Aa: è portatore con probabilità $\frac{2}{3}$.`,
        md`Il bambino può essere affetto solo se il padre è Aa ed entrambi i genitori trasmettono a: $\frac{2}{3} \times \frac{1}{4} = \frac{1}{6}$.`,
        md`Verifica facendo la media sui tre genotipi ugualmente probabili del padre: AA non dà alcun rischio, ogni Aa dà un rischio di $\frac{1}{4}$, quindi il rischio è $\frac{0 + \frac{1}{4} + \frac{1}{4}}{3} = \frac{1}{6}$.`,
      ],
      answerMd: md`La probabilità è $\frac{1}{6}$. Le risposte $\frac{1}{4}$ (dare per certo che il padre sia portatore) e $\frac{1}{8}$ (attribuirgli una probabilità di essere portatore pari a $\frac{1}{2}$) ignorano entrambe ciò che il suo fenotipo rivela.`,
    },
    {
      id: 'example-x-linked',
      title: 'Una malattia recessiva legata all\'X',
      problemMd: md`L'emofilia A è recessiva legata all'X. Una donna portatrice ($X^HX^h$) e un uomo sano ($X^HY$) desiderano un figlio. Qual è la probabilità che nasca un maschio emofilico? E, se nasce un maschio, qual è la probabilità che sia emofilico?`,
      steps: [
        md`Si elencano i gameti: la madre dà $X^H$ o $X^h$, ciascuno con probabilità $\frac{1}{2}$; il padre dà $X^H$ o $Y$, ciascuno con probabilità $\frac{1}{2}$.`,
        md`I quattro figli ugualmente probabili sono $X^HX^H$, $X^HX^h$ (femmine) e $X^HY$, $X^hY$ (maschi). Solo $X^hY$ è emofilico, quindi un maschio emofilico ha probabilità $\frac{1}{4}$.`,
        md`Seconda strada: il figlio è maschio con probabilità $\frac{1}{2}$, e un maschio riceve l'$X^h$ della madre con probabilità $\frac{1}{2}$, quindi $\frac{1}{2} \times \frac{1}{2} = \frac{1}{4}$.`,
        md`Se si sa già che è un maschio, restano solo i due figli maschi, e uno dei due è affetto: la probabilità è $\frac{1}{2}$.`,
      ],
      answerMd: md`$\frac{1}{4}$ che nasca un maschio affetto; $\frac{1}{2}$ che un figlio maschio sia affetto. Nessuna figlia è affetta, ma ogni figlia ha probabilità $\frac{1}{2}$ di essere portatrice. L'errore tipico è confondere le due domande.`,
    },
  ],
  traps: [
    {
      title: md`Dare a un fratello sano una probabilità di un mezzo di essere portatore`,
      md: md`Se entrambi i genitori sono portatori, un figlio di cui si sa che è sano non può essere aa. La probabilità che sia portatore è $\frac{2}{3}$, non $\frac{1}{2}$. Prima di dividere, cancellare sempre i genotipi esclusi dal fenotipo.`,
    },
    {
      title: md`Rispondere a un'altra domanda di probabilità`,
      md: md`"La probabilità che nasca un maschio affetto" e "la probabilità che un figlio maschio sia affetto" differiscono di un fattore 2 in un incrocio legato all'X. La prima riguarda tutti i figli, la seconda solo i maschi. Sottolineare di chi parla la domanda prima di costruire il quadrato.`,
    },
    {
      title: md`Disegnare un quadrato da 16 caselle per ogni incrocio a due geni`,
      md: md`I quadrati grandi favoriscono gli errori di conteggio e si adattano male a incroci come AaBb × aaBb. Se i geni assortiscono in modo indipendente, si tratta ogni gene come un incrocio a sé e si moltiplicano i risultati.`,
    },
    {
      title: md`Leggere "dominante" come "frequente"`,
      md: md`La dominanza descrive il comportamento degli alleli nell'eterozigote, non la frequenza di un allele. Un allele dominante può essere raro in una popolazione e uno recessivo molto comune.`,
    },
  ],
  check: [
    {
      id: 'check-abo-cross',
      title: 'Gruppi sanguigni da due genitori',
      topic: 'Genetica',
      stemMd: md`Una donna di gruppo A, il cui padre era di gruppo 0, ha un figlio con un uomo di gruppo B la cui madre era di gruppo 0. Qual è la probabilità che il figlio sia di gruppo 0?`,
      options: [
        { id: 'A', text: md`$0$`, note: md`Presuppone che un figlio di gruppo 0 richieda un genitore di gruppo 0. Entrambi i genitori portano un allele $i$ nascosto, ricevuto dal proprio genitore di gruppo 0.` },
        { id: 'B', text: md`$\frac{1}{8}$`, note: md`Moltiplica per un terzo fattore un mezzo che l'incrocio non contiene: servono solo due eventi, uno per genitore.` },
        { id: 'C', text: md`$\frac{1}{4}$`, note: '' },
        { id: 'D', text: md`$\frac{1}{2}$`, note: md`È la probabilità che un genitore trasmetta $i$, non che lo trasmettano entrambi.` },
        { id: 'E', text: md`$\frac{3}{4}$`, note: md`È la probabilità che il figlio **non** sia di gruppo 0: i gruppi A, B e AB insieme.` },
      ],
      answer: 'C',
      workingMd: md`Ciascun genitore ha ricevuto $i$ da un genitore di gruppo 0, quindi la donna è $I^Ai$ e l'uomo è $I^Bi$. Un figlio di gruppo 0 deve ricevere $i$ da entrambi: $\frac{1}{2} \times \frac{1}{2} = \frac{1}{4}$. Il quadrato completo lo conferma: $I^AI^B$, $I^Ai$, $I^Bi$ e $ii$ sono ugualmente probabili, quindi ciascuno dei quattro gruppi ha probabilità $\frac{1}{4}$.`,
      lesson: md`Usare i parenti citati nella domanda per fissare il genotipo di ciascun genitore prima di incrociarli.`,
    },
    {
      id: 'check-pedigree-mode',
      title: 'Una figlia affetta di genitori sani',
      topic: 'Genetica',
      stemMd: md`In un albero genealogico, due genitori sani hanno una figlia affetta. Supponendo che il carattere compaia in tutti coloro che hanno il genotipo che lo determina e che non sia intervenuta una nuova mutazione, quale modo di trasmissione è compatibile con questa famiglia?`,
      options: [
        { id: 'A', text: md`Autosomico recessivo`, note: '' },
        { id: 'B', text: md`Autosomico dominante`, note: md`Un figlio affetto da un carattere dominante deve aver ricevuto l'allele da un genitore, che sarebbe quindi affetto a sua volta.` },
        { id: 'C', text: md`Recessivo legato all'X`, note: md`Una figlia affetta dovrebbe avere l'allele anche sull'unico X del padre, che sarebbe quindi affetto.` },
        { id: 'D', text: md`Dominante legato all'X`, note: md`Un allele dominante deve provenire da un genitore che mostra il carattere, e nessuno dei due lo mostra.` },
        { id: 'E', text: md`Legato all'Y`, note: md`Una figlia non ha il cromosoma Y, quindi un carattere legato all'Y non può comparire in lei.` },
      ],
      answer: 'A',
      workingMd: md`Entrambi i genitori sono sani eppure la figlia è affetta, quindi l'allele era nascosto in entrambi: il carattere è recessivo. Non può essere recessivo legato all'X, perché l'allele sull'X paterno della figlia renderebbe affetto il padre. I modi dominanti richiedono un genitore affetto e i caratteri legati all'Y non compaiono mai nelle femmine. Resta solo la trasmissione autosomica recessiva, con entrambi i genitori portatori.`,
      lesson: md`Una figlia affetta con il padre sano esclude subito la trasmissione recessiva legata all'X.`,
    },
    {
      id: 'check-test-cross',
      title: 'Un testcross con due geni',
      topic: 'Genetica',
      stemMd: md`Una pianta eterozigote per due geni su cromosomi diversi (AaBb) viene incrociata con una pianta omozigote recessiva per entrambi (aabb). Su 400 figli, quanti ci si aspetta che mostrino entrambi i caratteri recessivi?`,
      options: [
        { id: 'A', text: md`25`, note: md`Usa $\frac{1}{16}$, la quota di aabb nell'incrocio AaBb × AaBb, non in un testcross.` },
        { id: 'B', text: md`50`, note: md`Usa $\frac{1}{8}$, come se uno dei due geni desse la forma recessiva con probabilità $\frac{1}{4}$; in un testcross ogni gene la dà con probabilità $\frac{1}{2}$.` },
        { id: 'C', text: md`75`, note: md`Usa $\frac{3}{16}$, una classe del rapporto 9 : 3 : 3 : 1 dell'incrocio tra due doppi eterozigoti.` },
        { id: 'D', text: md`100`, note: '' },
        { id: 'E', text: md`225`, note: md`Usa $\frac{9}{16}$, la quota che mostra entrambi i caratteri **dominanti** quando si incrociano due doppi eterozigoti.` },
      ],
      answer: 'D',
      workingMd: md`Il genitore AaBb produce gameti AB, Ab, aB e ab in numero uguale; il genitore aabb produce solo ab. I figli sono AaBb, Aabb, aaBb e aabb, ciascuno con probabilità $\frac{1}{4}$. Gene per gene: aa ha probabilità $\frac{1}{2}$ e bb ha probabilità $\frac{1}{2}$, quindi aabb ha $\frac{1}{4}$. Attesi: $\frac{1}{4} \times 400 = 100$.`,
      lesson: md`Un testcross a due geni dà quattro classi nel rapporto 1 : 1 : 1 : 1 quando i geni assortiscono in modo indipendente.`,
    },
  ],
  takeaways: [
    md`La segregazione mette in ogni gamete un solo allele per gene; l'assortimento indipendente rimescola i geni posti su cromosomi diversi.`,
    md`Con geni indipendenti si risolve ogni gene separatamente e si moltiplicano le probabilità.`,
    md`Genitori sani con un figlio affetto indicano un carattere recessivo; una figlia affetta con il padre sano esclude il recessivo legato all'X.`,
    md`Un figlio sano di due portatori è portatore con probabilità $\frac{2}{3}$.`,
  ],
  flashcards: [
    { front: md`Legge della segregazione`, back: md`I due alleli di un gene si separano quando si formano i gameti, quindi ogni gamete ne porta uno. La base fisica è la separazione dei cromosomi omologhi nella meiosi I.` },
    { front: md`Legge dell'assortimento indipendente`, back: md`Gli alleli di geni diversi entrano nei gameti in modo indipendente, quindi AaBb produce AB, Ab, aB e ab in parti uguali. Vale per geni su cromosomi diversi, non per geni strettamente associati.` },
    { front: md`Testcross`, back: md`Si incrocia un individuo con il carattere dominante con un omozigote recessivo. Se compare anche un solo figlio recessivo, il genitore in esame è eterozigote; il rapporto atteso è allora 1 : 1.` },
    { front: md`Codominanza e dominanza incompleta`, back: md`Nella codominanza entrambi gli alleli si esprimono pienamente nell'eterozigote (gruppo AB). Nella dominanza incompleta l'eterozigote è intermedio (rosa da rosso e bianco).` },
    { front: md`Probabilità che un figlio sano di due portatori sia portatore`, back: md`$\frac{2}{3}$: tra gli esiti AA, Aa, Aa e aa, il fenotipo esclude aa, e due dei tre esiti restanti sono portatori.` },
    { front: md`Indizi che escludono il recessivo legato all'X`, back: md`Una figlia affetta con il padre sano, oppure un figlio maschio affetto la cui madre non è né affetta né portatrice.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-genetics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const biotechnologyAndGeneticEngineeringLessonIt: Lesson = {
  slug: 'biotechnology-and-genetic-engineering',
  title: 'Biotecnologie e ingegneria genetica',
  summary: 'Come si taglia, si unisce, si copia, si separa e si introduce il DNA nelle cellule, e come prevedere l\'esito di digestioni, PCR e selezioni.',
  minutes: 22,
  objectives: [
    md`Spiegare come si usano enzimi di restrizione, ligasi, plasmidi e trascrittasi inversa per ottenere DNA ricombinante.`,
    md`Prevedere numero e ordine dei frammenti di una digestione e di un'elettroforesi su gel, e il numero di copie prodotte da una PCR.`,
    md`Descrivere le applicazioni principali: organismi transgenici, profilo del DNA, terapia genica, CRISPR-Cas9 e clonazione.`,
  ],
  teachMd: md`
### Gli strumenti

Il **DNA ricombinante** (*recombinant DNA*) è DNA ottenuto unendo frammenti di origine diversa, per esempio un gene umano inserito in un plasmide batterico. Per costruirlo servono strumenti per tagliare il DNA in punti scelti, per unire i frammenti, per portarli in una cellula, per copiare il DNA e per separare e riconoscere i frammenti.

### Tagliare e unire

Gli **enzimi di restrizione** (*restriction enzymes*, endonucleasi di restrizione) provengono dai batteri, dove tagliano il DNA dei virus che li infettano. Ciascuno riconosce una breve sequenza specifica, spesso **palindromica**: i due filamenti hanno la stessa sequenza quando ciascuno viene letto in direzione 5'→3', come GAATTC, il cui filamento complementare si legge anch'esso GAATTC in quella direzione. Molti enzimi tagliano i due filamenti in punti sfalsati e lasciano **estremità coesive** (*sticky ends*), brevi tratti a singolo filamento; altri tagliano dritto e lasciano estremità piatte (*blunt ends*).

Se un gene e un vettore vengono tagliati con lo **stesso** enzima, le loro estremità coesive sono complementari e si appaiano con legami a idrogeno. La **DNA ligasi** salda poi lo scheletro zucchero-fosfato formando legami fosfodiesterici.

Contare i frammenti è una domanda classica. Tagliare una molecola **lineare** in $n$ siti dà $n + 1$ frammenti; tagliare una molecola **circolare**, come un plasmide, in $n$ siti dà $n$ frammenti.

### Vettori e trasformazione

Un **plasmide** è un piccolo cerchio di DNA che si replica nel batterio indipendentemente dal cromosoma. Un plasmide usato come vettore ha un'origine di replicazione, un sito di restrizione in cui inserire il gene e almeno un **gene marcatore**, spesso di resistenza a un antibiotico. I batteri acquisiscono i plasmidi per **trasformazione** (*transformation*), favorita in laboratorio da ioni calcio con uno shock termico o da un impulso elettrico. Solo una piccola parte delle cellule acquisisce un plasmide, e alcuni plasmidi si richiudono senza l'inserto, quindi seguono due selezioni: un antibiotico elimina le cellule senza plasmide, e un secondo marcatore, interrotto dall'inserimento del gene, individua i plasmidi ricombinanti. Anche i virus si usano come vettori, soprattutto per portare geni nelle cellule umane.

### Far esprimere un gene umano ai batteri

I geni umani contengono **introni**, e i batteri non sono in grado di rimuoverli. Si parte quindi dall'mRNA maturo delle cellule che producono la proteina, per esempio le cellule beta del pancreas per l'insulina. La **trascrittasi inversa** (*reverse transcriptase*), un enzima dei retrovirus, copia l'mRNA in **DNA complementare** (cDNA), privo di introni. Il cDNA viene posto a valle di un promotore batterico perché il batterio lo trascriva. L'insulina umana per le persone con diabete si produce così, con microrganismi geneticamente modificati.

### Copiare il DNA: la reazione a catena della polimerasi

La PCR (*polymerase chain reaction*) copia molte volte un tratto scelto di DNA. Servono il DNA stampo, due **primer** (brevi filamenti singoli che si appaiano alle due estremità del bersaglio), nucleotidi liberi e una DNA polimerasi termostabile, come la *Taq* polimerasi del batterio delle sorgenti calde *Thermus aquaticus*. Ogni ciclo ha tre fasi:

| Fase | Temperatura tipica | Che cosa accade |
| --- | --- | --- |
| Denaturazione | circa 95 °C | I legami a idrogeno si rompono e i filamenti si separano |
| Appaiamento (*annealing*) | circa 50–65 °C | I primer si legano alle sequenze complementari |
| Estensione | circa 72 °C | La polimerasi aggiunge nucleotidi all'estremità 3' di ogni primer |

Idealmente ogni ciclo raddoppia la quantità di DNA bersaglio, quindi $N$ molecole diventano $N \times 2^n$ dopo $n$ cicli. In pratica l'efficienza cala negli ultimi cicli, quando i reagenti si esauriscono.

### Separare il DNA: l'elettroforesi su gel

Il DNA è carico negativamente per i suoi gruppi fosfato, quindi in un campo elettrico migra verso l'**elettrodo positivo** (l'anodo). Tutti i frammenti hanno circa la stessa carica per unità di lunghezza, perciò la carica da sola non li separa: li separa il gel, che agisce come una rete e rallenta i frammenti lunghi più di quelli corti. **I frammenti corti arrivano più lontano** dai pozzetti. Un marcatore di peso molecolare (*ladder*), con frammenti di lunghezza nota corsi in una corsia accanto, permette di leggerne le dimensioni.

### A che cosa servono questi strumenti

- **Profilo del DNA** (*DNA profiling*). Regioni che variano da persona a persona, come le brevi sequenze ripetute in tandem (STR, ripetute un numero diverso di volte in persone diverse), vengono amplificate con la PCR e separate per dimensione. Ogni banda del profilo di un figlio deve provenire dalla madre o dal padre: è il principio del test di paternità.
- **Organismi transgenici.** Piante resistenti ai parassiti, batteri e lieviti che producono proteine umane.
- **Terapia genica.** Una copia funzionante di un gene viene portata nelle cellule del paziente, spesso con un vettore virale. Le modifiche alle cellule somatiche non si ereditano.
- **CRISPR-Cas9.** Un RNA guida complementare alla sequenza bersaglio conduce la nucleasi Cas9 fino a essa, e Cas9 taglia lì entrambi i filamenti. La riparazione del taglio da parte della cellula può spegnere il gene o inserire una nuova sequenza.
- **Clonazione.** Nel trasferimento nucleare da cellula somatica, il nucleo di una cellula del corpo viene inserito in una cellula uovo privata del proprio nucleo; la pecora Dolly è nata così. Le cellule staminali embrionali sono pluripotenti; la maggior parte delle staminali adulte può dare origine solo a pochi tipi cellulari.
`,
  examples: [
    {
      id: 'example-digest-fragments',
      title: 'Lineare o circolare?',
      problemMd: md`Una molecola di 6000 paia di basi (bp) ha due siti per un enzima di restrizione, alle posizioni 500 e 2000. Quanti frammenti, e di che lunghezza, dà una digestione completa (a) se la molecola è lineare, (b) se è un plasmide circolare? Quale frammento arriva più lontano nel gel?`,
      steps: [
        md`Lineare: due tagli danno tre pezzi. Le lunghezze sono $500$, $2000 - 500 = 1500$ e $6000 - 2000 = 4000$ bp, che sommate restituiscono 6000.`,
        md`Circolare: due tagli danno solo due pezzi, perché un cerchio non ha estremità libere. Uno va da 500 a 2000, cioè 1500 bp; l'altro va da 2000, passando per la fine, fino a 500: $4000 + 500 = 4500$ bp. Verifica: $1500 + 4500 = 6000$.`,
        md`Nel gel i frammenti si separano per lunghezza, e il più corto si allontana di più dal pozzetto, verso l'elettrodo positivo.`,
      ],
      answerMd: md`Lineare: tre frammenti, di 500, 1500 e 4000 bp. Circolare: due frammenti, di 1500 e 4500 bp. La banda più lontana è quella da 500 bp nella digestione lineare e quella da 1500 bp in quella circolare. L'errore abituale è contare tre frammenti anche per il plasmide.`,
    },
    {
      id: 'example-pcr-copies',
      title: 'Copie dopo pochi cicli di PCR',
      problemMd: md`Una PCR parte da 10 copie a doppio filamento di una sequenza bersaglio. Supponendo che ogni ciclo raddoppi il bersaglio, quante copie ci sono dopo 5 cicli?`,
      steps: [
        md`Ogni ciclo raddoppia il numero, quindi dopo $n$ cicli il numero è $10 \times 2^n$.`,
        md`Con $n = 5$: $2^5 = 32$, quindi $10 \times 32 = 320$.`,
        md`Verifica raddoppiando ciclo per ciclo: 20, 40, 80, 160, 320.`,
      ],
      answerMd: md`320 copie. Moltiplicare invece di raddoppiare, $10 \times 5 \times 2 = 100$, tratta la crescita come lineare ed è la risposta sbagliata più tentante.`,
    },
    {
      id: 'example-plasmid-selection',
      title: 'Trovare i batteri con il plasmide ricombinante',
      problemMd: md`Un plasmide porta i geni di resistenza all'ampicillina e alla tetraciclina. Un gene umano viene inserito in un sito di restrizione all'interno del gene di resistenza alla tetraciclina, e i plasmidi vengono messi a contatto con batteri sensibili a entrambi gli antibiotici. Quali colonie portano il plasmide ricombinante?`,
      steps: [
        md`Si elencano le cellule possibili: cellule senza plasmide, cellule con un plasmide richiuso senza inserto e cellule con il plasmide ricombinante.`,
        md`Si piastrano su ampicillina. Ogni plasmide porta un gene di resistenza all'ampicillina intatto, quindi crescono le cellule con l'uno o l'altro tipo di plasmide; quelle senza plasmide muoiono.`,
        md`Si trasferiscono le colonie, nelle stesse posizioni, su una piastra con tetraciclina (replica plating). L'inserto ha interrotto il gene di resistenza alla tetraciclina, quindi le cellule ricombinanti lì non crescono, mentre quelle con il plasmide vuoto sì.`,
        md`Si confrontano le piastre: le colonie cercate sono quelle presenti sulla piastra con ampicillina e assenti su quella con tetraciclina.`,
      ],
      answerMd: md`Le colonie che crescono su ampicillina ma non su tetraciclina portano il plasmide ricombinante. Scegliere le colonie che crescono su entrambe significa prendere i plasmidi vuoti, il cui gene di resistenza alla tetraciclina è ancora intatto.`,
    },
  ],
  traps: [
    {
      title: md`Mandare il DNA verso l'elettrodo negativo`,
      md: md`Il DNA porta gruppi fosfato negativi, quindi migra verso l'elettrodo positivo. E sono i frammenti corti, non quelli lunghi, ad arrivare più lontano dal pozzetto.`,
    },
    {
      title: md`Contare i frammenti di un plasmide come se il DNA fosse lineare`,
      md: md`$n$ tagli danno $n + 1$ frammenti solo in una molecola lineare. Un cerchio tagliato $n$ volte dà $n$ frammenti. Controllare che le lunghezze dei frammenti sommino all'intera molecola.`,
    },
    {
      title: md`Inserire nei batteri un gene umano genomico`,
      md: md`I batteri non sanno rimuovere gli introni, quindi un gene copiato direttamente dai cromosomi umani dà una proteina sbagliata o nessuna. Si usa invece il cDNA ottenuto dall'mRNA maturo con la trascrittasi inversa.`,
    },
    {
      title: md`Trattare la crescita della PCR come lineare`,
      md: md`Dopo $n$ cicli il bersaglio è moltiplicato per $2^n$, non per $2n$. Dieci cicli lo moltiplicano per 1024, non per 20.`,
    },
  ],
  check: [
    {
      id: 'check-gel-direction',
      title: 'Dove vanno i frammenti',
      topic: 'Biotecnologie',
      stemMd: md`Una digestione dà frammenti di 4000, 1500 e 300 bp, che vengono caricati in un pozzetto e separati con un'elettroforesi su gel. Quale frammento finisce più lontano dal pozzetto, e verso quale elettrodo migrano?`,
      options: [
        { id: 'A', text: md`Il frammento da 4000 bp, verso l'elettrodo positivo`, note: md`La direzione è giusta, ma il gel rallenta di più i frammenti lunghi, quindi il più lungo percorre la distanza minore.` },
        { id: 'B', text: md`Il frammento da 300 bp, verso l'elettrodo positivo`, note: '' },
        { id: 'C', text: md`Il frammento da 300 bp, verso l'elettrodo negativo`, note: md`L'ordine è giusto, ma il DNA è carico negativamente per i gruppi fosfato e quindi migra verso l'elettrodo positivo.` },
        { id: 'D', text: md`Il frammento da 4000 bp, verso l'elettrodo negativo`, note: md`Entrambe le parti sono invertite: il DNA migra verso l'elettrodo positivo e i frammenti corti vanno più lontano.` },
        { id: 'E', text: md`Tutti e tre percorrono la stessa distanza, perché hanno la stessa carica per unità di lunghezza`, note: md`La carica uguale per unità di lunghezza spiega perché il campo da solo non li separa; li separa per lunghezza la rete del gel.` },
      ],
      answer: 'B',
      workingMd: md`I gruppi fosfato rendono il DNA negativo, quindi migra verso l'elettrodo positivo. Tutti i frammenti hanno circa la stessa carica per unità di lunghezza, quindi la separazione la fa il gel, che rallenta di più i frammenti lunghi. Il frammento da 300 bp arriva più lontano.`,
      lesson: md`Nell'elettroforesi su gel il DNA corre verso l'elettrodo positivo e il frammento più corto arriva più lontano.`,
    },
    {
      id: 'check-pcr-cycles',
      title: 'Dieci cicli di PCR',
      topic: 'Biotecnologie',
      stemMd: md`Una PCR parte da una sola molecola di DNA a doppio filamento che contiene la sequenza bersaglio. Supponendo che ogni ciclo raddoppi perfettamente il bersaglio, quante copie a doppio filamento del bersaglio ci sono dopo 10 cicli?`,
      options: [
        { id: 'A', text: md`20`, note: md`È $2 \times 10$: aggiunge due copie a ogni ciclo invece di raddoppiare.` },
        { id: 'B', text: md`100`, note: md`È $10^2$, cioè eleva al quadrato il numero di cicli invece di elevare 2 a quella potenza.` },
        { id: 'C', text: md`512`, note: md`È $2^9$: un ciclo in meno, come se il primo ciclo non raddoppiasse la molecola di partenza.` },
        { id: 'D', text: md`1024`, note: '' },
        { id: 'E', text: md`2048`, note: md`Conta i filamenti singoli: 1024 copie a doppio filamento contengono 2048 filamenti.` },
      ],
      answer: 'D',
      workingMd: md`Una molecola raddoppia dieci volte: $1 \times 2^{10} = 1024$. Verifica dimezzando all'indietro: 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1 sono dieci dimezzamenti.`,
      lesson: md`La PCR è esponenziale: $N$ copie diventano $N \times 2^n$ dopo $n$ cicli ideali.`,
    },
    {
      id: 'check-cdna-reason',
      title: 'Perché usare il cDNA?',
      topic: 'Biotecnologie',
      stemMd: md`Per far produrre una proteina umana ai batteri, si inserisce il cDNA ottenuto dall'mRNA della proteina invece del gene così come si trova sul cromosoma umano. Perché?`,
      options: [
        { id: 'A', text: md`I batteri non hanno ribosomi, quindi serve loro una copia di DNA dell'mRNA`, note: md`I batteri hanno ribosomi (70S) e traducono di continuo il proprio mRNA.` },
        { id: 'B', text: md`Il DNA cromosomico umano non può essere tagliato dagli enzimi di restrizione`, note: md`Gli enzimi di restrizione tagliano qualunque DNA contenga la loro sequenza di riconoscimento, compreso quello umano.` },
        { id: 'C', text: md`Il codice genetico dei batteri è diverso da quello umano`, note: md`Il codice genetico è quasi universale, ed è proprio per questo che un batterio può produrre una proteina umana.` },
        { id: 'D', text: md`Il cDNA è RNA a singolo filamento, che i batteri traducono direttamente`, note: md`Il cDNA è DNA, non RNA: lo produce la trascrittasi inversa e per il clonaggio viene reso a doppio filamento.` },
        { id: 'E', text: md`I batteri non sanno rimuovere gli introni, e il cDNA ottenuto dall'mRNA maturo non ne ha`, note: '' },
      ],
      answer: 'E',
      workingMd: md`I geni umani sono interrotti da introni, che nel nucleo vengono rimossi dal trascritto primario con lo splicing. I batteri non hanno l'apparato di splicing, quindi tradurrebbero gli introni come se fossero sequenza codificante. L'mRNA maturo ha già perso gli introni, perciò il cDNA che la trascrittasi inversa ne ricava codifica la proteina senza interruzioni.`,
      lesson: md`I geni eucariotici si inseriscono nei batteri come cDNA perché i batteri non eseguono lo splicing.`,
    },
  ],
  takeaways: [
    md`Gene e vettore si tagliano con lo stesso enzima di restrizione, così le estremità coesive combaciano; la ligasi salda lo scheletro.`,
    md`Una molecola lineare tagliata in $n$ siti dà $n + 1$ frammenti, una circolare $n$.`,
    md`La PCR raddoppia il bersaglio a ogni ciclo: $N \times 2^n$ dopo $n$ cicli.`,
    md`Nel gel il DNA migra verso l'elettrodo positivo e i frammenti corti vanno più lontano.`,
    md`I batteri non eseguono lo splicing, quindi i geni umani si inseriscono come cDNA ottenuto con la trascrittasi inversa.`,
  ],
  flashcards: [
    { front: md`Enzima di restrizione`, back: md`Un enzima batterico che taglia il DNA in una sequenza di riconoscimento specifica, spesso palindromica. Molti lasciano estremità coesive, brevi tratti a singolo filamento.` },
    { front: md`DNA ligasi`, back: md`L'enzima che unisce i frammenti di DNA formando legami fosfodiesterici nello scheletro zucchero-fosfato.` },
    { front: md`Le tre fasi di un ciclo di PCR`, back: md`Denaturazione a circa 95 °C, appaiamento dei primer a circa 50–65 °C, estensione da parte di una polimerasi termostabile a circa 72 °C.` },
    { front: md`Direzione e ordine nell'elettroforesi su gel`, back: md`Il DNA migra verso l'elettrodo positivo per i suoi gruppi fosfato; i frammenti corti attraversano il gel più lontano.` },
    { front: md`Trascrittasi inversa`, back: md`Un enzima dei retrovirus che produce DNA complementare (cDNA) a partire dall'mRNA. Il cDNA non ha introni, quindi i batteri possono esprimerlo.` },
    { front: md`CRISPR-Cas9`, back: md`Un RNA guida conduce la nucleasi Cas9 a una sequenza di DNA corrispondente, dove taglia entrambi i filamenti; la riparazione del taglio può disattivare un gene o inserire una nuova sequenza.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-genetics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const mutationsEvolutionAndClassificationLessonIt: Lesson = {
  slug: 'mutations-evolution-and-classification',
  title: 'Mutazioni, evoluzione e classificazione',
  summary: 'Classificare le mutazioni per effetto, spiegare selezione e deriva, usare Hardy-Weinberg e collocare gli organismi nella gerarchia tassonomica.',
  minutes: 24,
  objectives: [
    md`Classificare mutazioni geniche, cromosomiche e genomiche e prevederne l'effetto su una proteina o su un cariotipo.`,
    md`Spiegare selezione naturale, deriva genetica e speciazione, e usare le equazioni di Hardy-Weinberg.`,
    md`Ordinare le categorie tassonomiche e scrivere correttamente il nome di una specie.`,
  ],
  teachMd: md`
### Le mutazioni geniche

Una **mutazione** è una modifica permanente della sequenza del DNA. Nasce da errori di copiatura durante la replicazione o dall'azione di **agenti mutageni**: radiazioni ionizzanti, luce ultravioletta e alcune sostanze chimiche. Solo le mutazioni della linea germinale (le cellule che producono i gameti) passano alla prole; una mutazione **somatica** riguarda l'individuo e le cellule derivate da quella mutata.

Una **mutazione puntiforme** (*point mutation*) cambia un solo nucleotide. Poiché il codice genetico si legge a triplette ed è **degenerato** (la maggior parte degli amminoacidi ha più di un codone), una sostituzione può avere tre effetti:

| Tipo | Che cosa cambia | Effetto tipico |
| --- | --- | --- |
| Silente (*silent*) | Il nuovo codone codifica lo stesso amminoacido | Nessuno sulla proteina |
| Di senso (*missense*) | Il nuovo codone codifica un amminoacido diverso | Da nessuno a grave, come nell'anemia falciforme |
| Non senso (*nonsense*) | Il nuovo codone è un codone di stop | Proteina accorciata, di solito non funzionante |

**Inserzioni e delezioni** di uno o due nucleotidi provocano lo **slittamento del modulo di lettura** (*frameshift*): ogni codone dopo la modifica viene letto in una nuova cornice, quindi la sequenza di amminoacidi da quel punto in poi cambia e di solito compare presto un codone di stop. Aggiungere o togliere esattamente tre nucleotidi mantiene la cornice: si aggiunge o si toglie un amminoacido (e, se la modifica cade a cavallo di due codoni, può cambiarne anche uno vicino).

### Mutazioni cromosomiche e genomiche

Modifiche più ampie alterano la struttura dei cromosomi: **delezione** (un segmento perso), **duplicazione** (un segmento ripetuto), **inversione** (un segmento capovolto) e **traslocazione** (un segmento spostato su un cromosoma non omologo). Le variazioni del **numero** di cromosomi derivano di solito dalla **non disgiunzione** (*nondisjunction*), la mancata separazione dei cromosomi omologhi (nella meiosi I) o dei cromatidi fratelli (nella meiosi II). Un gamete con un cromosoma in più o in meno dà allora uno zigote con **aneuploidia**: trisomia 21 (sindrome di Down, 47 cromosomi), sindrome di Klinefelter (47,XXY) o sindrome di Turner (45,X). Avere interi assetti cromosomici in più è **poliploidia**, frequente nelle piante.

### La selezione naturale

Il ragionamento di Darwin poggia su osservazioni verificabili una per una:

1. Gli organismi producono più figli di quanti possano sopravvivere.
2. Gli individui di una specie variano, e gran parte della variabilità è ereditaria.
3. Gli individui con caratteri ereditari adatti all'ambiente sopravvivono e si riproducono di più.
4. Perciò quei caratteri diventano più frequenti nella generazione successiva.

La selezione agisce sugli individui, ma a evolvere sono le **popolazioni**, attraverso il cambiamento delle frequenze alleliche nel corso delle generazioni. Un carattere acquisito durante la vita, come un muscolo sviluppato con l'allenamento, non si eredita. La nuova variabilità nasce dalle mutazioni; la meiosi (crossing-over e assortimento indipendente) e la fecondazione casuale la rimescolano. La selezione può essere **direzionale** (favorito un estremo), **stabilizzante** (favorita la media, come per il peso alla nascita nell'uomo) o **divergente** (*disruptive*, favoriti entrambi gli estremi).

### Altre cause dell'evoluzione

- **Deriva genetica** (*genetic drift*): variazioni casuali delle frequenze alleliche, più forti nelle popolazioni piccole. Il **collo di bottiglia** (*bottleneck*: la popolazione si riduce drasticamente) e l'**effetto del fondatore** (*founder effect*: pochi individui fondano una nuova popolazione) ne sono casi particolari.
- **Flusso genico** (*gene flow*): le migrazioni portano alleli da una popolazione all'altra e le rendono più simili.
- **Mutazione**: introduce lentamente nuovi alleli.

### Hardy-Weinberg

Per un gene con due alleli di frequenze $p$ (dominante) e $q$ (recessivo):

$$p + q = 1 \qquad p^2 + 2pq + q^2 = 1$$

$p^2$, $2pq$ e $q^2$ sono le frequenze di AA, Aa e aa. Le frequenze restano costanti da una generazione all'altra solo se la popolazione è molto grande, gli accoppiamenti sono casuali e non ci sono mutazioni, migrazioni né selezione. Di solito si parte da $q^2$, la frequenza delle persone che mostrano il carattere recessivo, perché è l'unico genotipo riconoscibile a vista.

### Specie e speciazione

Secondo il concetto biologico di specie, una **specie** è un insieme di popolazioni i cui membri possono incrociarsi e generare prole **fertile**. Dall'incrocio tra un asino e una cavalla nasce il mulo, che è sterile, quindi cavallo e asino sono specie distinte. Nuove specie si formano quando il flusso genico tra popolazioni si interrompe: la speciazione **allopatrica** segue una barriera geografica; quella **simpatrica** avviene nello stesso luogo, per esempio per poliploidia nelle piante.

Le prove dell'evoluzione comprendono i fossili, le **strutture omologhe** (la stessa struttura di base adattata a usi diversi, come gli arti anteriori di uomo, balena e pipistrello, segno di un antenato comune), le strutture vestigiali e i confronti tra sequenze di DNA e di proteine. Le **strutture analoghe**, come le ali di insetti e uccelli, svolgono la stessa funzione ma si sono evolute separatamente, quindi non indicano una stretta parentela.

### La classificazione

Gli esseri viventi sono raggruppati in categorie annidate, dalla più ampia alla più ristretta: **dominio, regno, phylum, classe, ordine, famiglia, genere, specie**. I domini sono tre: **Bacteria**, **Archaea** ed **Eukarya**. Organismi che condividono una categoria condividono anche tutte quelle superiori. Ogni specie ha un nome in due parti (nomenclatura binomia), introdotto da Linneo: il genere con l'iniziale maiuscola, poi l'epiteto specifico in minuscolo, entrambi in corsivo, come in *Homo sapiens*.
`,
  examples: [
    {
      id: 'example-mutation-types',
      title: 'Tre modifiche a uno stesso gene',
      problemMd: md`La parte codificante di un mRNA inizia con AUG UUU UGG GGC..., dove AUG è il codone d'inizio (AUG codifica la metionina, UUU e UUC la fenilalanina, UGG il triptofano; UGA è un codone di stop). Classificare ogni modifica: (a) UUU diventa UUC; (b) UGG diventa UGA; (c) viene eliminata la U all'inizio del terzo codone.`,
      steps: [
        md`(a) UUC codifica ancora la fenilalanina, quindi la proteina non cambia: mutazione **silente**, possibile perché il codice è degenerato.`,
        md`(b) UGA è un codone di stop, quindi la traduzione si ferma dopo la fenilalanina: mutazione **non senso**, che dà una proteina di due amminoacidi invece che completa.`,
        md`(c) Togliere una base sposta la cornice di lettura. La sequenza diventa AUG UUU GGG GC..., quindi dal terzo codone in poi ogni codone viene letto nella nuova cornice: **slittamento del modulo di lettura**.`,
        md`Verifica di (c) contando: una base eliminata non è un multiplo di tre, quindi la cornice non si ristabilisce e tutti i codoni a valle vengono letti nella cornice spostata.`,
      ],
      answerMd: md`(a) silente, (b) non senso, (c) slittamento del modulo di lettura. L'errore comune è chiamare la (b) mutazione di senso: una mutazione di senso sostituisce un amminoacido, mentre un codone di stop tronca la proteina.`,
    },
    {
      id: 'example-hardy-weinberg',
      title: 'Quanto sono frequenti i portatori?',
      problemMd: md`Una malattia autosomica recessiva colpisce 1 persona su 2500 in una popolazione in equilibrio di Hardy-Weinberg. Quale frazione della popolazione è portatrice?`,
      steps: [
        md`Le persone affette sono aa, quindi $q^2 = \frac{1}{2500}$.`,
        md`Si estrae la radice: $q = \frac{1}{50} = 0{,}02$. Allora $p = 1 - q = 0{,}98$.`,
        md`I portatori sono Aa, con frequenza $2pq = 2 \times 0{,}98 \times 0{,}02 = 0{,}0392$.`,
        md`Verifica con un'approssimazione: se $q$ è piccolo, $p \approx 1$, quindi $2pq \approx 2q = 0{,}04$, in accordo. Si tratta di circa 1 persona su 25.`,
      ],
      answerMd: md`Circa il $3{,}9\%$ delle persone, all'incirca 1 su 25, è portatore: molto più dell'1 su 2500 che è affetto. Rispondere $q = 0{,}02$ dà la frequenza dell'allele, non quella dei portatori.`,
    },
    {
      id: 'example-nondisjunction',
      title: 'Non disgiunzione nella meiosi I',
      problemMd: md`Durante la meiosi I in una donna, le due copie del cromosoma 21 non si separano. Quanti cromosomi possono avere i gameti prodotti da questa divisione, e quanti ne ha lo zigote se uno di essi viene fecondato da uno spermatozoo normale?`,
      steps: [
        md`Normalmente ogni gamete riceve un cromosoma 21 e 23 cromosomi in tutto.`,
        md`Se entrambi gli omologhi vanno allo stesso polo nella meiosi I, una cellula figlia ha due cromosomi 21 e l'altra nessuno. La meiosi II separa poi normalmente i cromatidi.`,
        md`Quindi i gameti hanno 24 cromosomi (due 21) oppure 22 (nessun 21). Nessuno è normale.`,
        md`Si aggiungono i 23 cromosomi di uno spermatozoo normale: $24 + 23 = 47$ (trisomia 21) oppure $22 + 23 = 45$ (monosomia 21).`,
      ],
      answerMd: md`Gameti con 24 o 22 cromosomi; zigoti con 47 (trisomia 21, sindrome di Down) o 45. Una non disgiunzione nella meiosi II, invece, lascerebbe normali metà dei prodotti della meiosi.`,
    },
  ],
  traps: [
    {
      title: md`Considerare dannosa ogni mutazione`,
      md: md`Molte mutazioni sono silenti o neutre, e alcune sono vantaggiose: è su queste differenze che agisce la selezione. Una mutazione si giudica dal suo effetto sulla proteina, non dalla parola "mutazione".`,
    },
    {
      title: md`Pensare che evolvano gli individui`,
      md: md`Un animale che si allunga o si allena non trasmette il cambiamento. L'evoluzione è il cambiamento delle frequenze alleliche di una popolazione nel corso delle generazioni; la selezione si limita a vagliare la variabilità già ereditaria.`,
    },
    {
      title: md`Usare q quando la domanda chiede i portatori`,
      md: md`Da $q^2$ si ricava $q$, la frequenza dell'allele. I portatori sono $2pq$. Annotare quale tra $p$, $q$, $p^2$, $2pq$ e $q^2$ chiede la domanda prima di calcolare.`,
    },
    {
      title: md`Prendere le strutture analoghe come prova di parentela`,
      md: md`Le ali di uccelli e insetti svolgono la stessa funzione ma sono costruite in modo diverso: è evoluzione convergente. Sono le strutture omologhe, costruite sullo stesso schema, a provare un antenato comune.`,
    },
  ],
  check: [
    {
      id: 'check-frameshift',
      title: 'Quale mutazione cambia di più?',
      topic: 'Mutazioni ed evoluzione',
      stemMd: md`Quale mutazione nella sequenza codificante di un gene ha più probabilità di cambiare l'identità della maggior parte degli amminoacidi codificati dopo il punto della mutazione?`,
      options: [
        { id: 'A', text: md`Una sostituzione nella terza base di un codone che dà un codone per lo stesso amminoacido`, note: md`È una mutazione silente: l'amminoacido resta lo stesso e a valle non cambia nulla.` },
        { id: 'B', text: md`La delezione di un solo nucleotide vicino all'inizio della sequenza codificante`, note: '' },
        { id: 'C', text: md`La delezione di tre nucleotidi consecutivi che formano un codone`, note: md`Togliere tre basi mantiene la cornice di lettura: si perde un amminoacido e il resto non cambia.` },
        { id: 'D', text: md`Una sostituzione che trasforma un codone in un codone di stop`, note: md`Una mutazione non senso ferma la traduzione, quindi gli amminoacidi a valle mancano, non vengono sostituiti da altri.` },
        { id: 'E', text: md`Una sostituzione che trasforma un codone in un codone per un amminoacido diverso`, note: md`Una mutazione di senso cambia un solo amminoacido; la cornice di lettura resta intatta.` },
      ],
      answer: 'B',
      workingMd: md`Un singolo nucleotide eliminato sposta la cornice di lettura, quindi ogni codone successivo viene letto in modo diverso e gli amminoacidi da lì in poi cambiano (finché, di solito, non compare presto un codone di stop). Le mutazioni silenti, di senso e quelle che mantengono la cornice toccano al massimo un amminoacido, e una mutazione non senso elimina gli amminoacidi a valle invece di cambiarli.`,
      lesson: md`Solo lo slittamento del modulo di lettura altera tutti i codoni dopo la mutazione; le modifiche che mantengono la cornice restano locali.`,
    },
    {
      id: 'check-hardy-weinberg',
      title: 'Eterozigoti a partire dalla frequenza di un fenotipo',
      topic: 'Mutazioni ed evoluzione',
      stemMd: md`In una popolazione in equilibrio di Hardy-Weinberg, il 16% degli individui mostra un fenotipo recessivo. Qual è la frequenza degli eterozigoti?`,
      options: [
        { id: 'A', text: md`0,16`, note: md`È $q^2$, la frequenza degli omozigoti recessivi, già data nel testo.` },
        { id: 'B', text: md`0,24`, note: md`È $pq = 0{,}6 \times 0{,}4$; la frequenza degli eterozigoti è il doppio.` },
        { id: 'C', text: md`0,36`, note: md`È $p^2$, la frequenza degli omozigoti dominanti.` },
        { id: 'D', text: md`0,40`, note: md`È $q$, la frequenza dell'allele recessivo, non quella di un genotipo.` },
        { id: 'E', text: md`0,48`, note: '' },
      ],
      answer: 'E',
      workingMd: md`$q^2 = 0{,}16$, quindi $q = 0{,}4$ e $p = 0{,}6$. Eterozigoti: $2pq = 2 \times 0{,}6 \times 0{,}4 = 0{,}48$. Verifica che i genotipi sommino a 1: $0{,}36 + 0{,}48 + 0{,}16 = 1$.`,
      lesson: md`Si parte da $q^2$, si estrae la radice e si ricavano $p$, $p^2$ e $2pq$; poi si controlla che sommino a 1.`,
    },
    {
      id: 'check-taxonomy',
      title: 'Stesso ordine, famiglie diverse',
      topic: 'Mutazioni ed evoluzione',
      stemMd: md`Due specie animali appartengono allo stesso ordine ma a famiglie diverse. Quale affermazione è necessariamente vera?`,
      options: [
        { id: 'A', text: md`Appartengono alla stessa classe.`, note: '' },
        { id: 'B', text: md`Appartengono allo stesso genere.`, note: md`Un genere è compreso in una famiglia, quindi specie di famiglie diverse non possono condividere il genere.` },
        { id: 'C', text: md`Appartengono a phyla diversi.`, note: md`Condividere l'ordine significa condividere tutte le categorie superiori, phylum compreso.` },
        { id: 'D', text: md`Appartengono a classi diverse.`, note: md`La classe sta sopra l'ordine, quindi specie dello stesso ordine sono nella stessa classe.` },
        { id: 'E', text: md`Appartengono a regni diversi.`, note: md`Il regno sta sopra l'ordine; entrambe le specie sono nello stesso regno, qui quello degli animali.` },
      ],
      answer: 'A',
      workingMd: md`Le categorie vanno da dominio, regno, phylum, classe, ordine, famiglia, genere a specie, ciascuna compresa nella precedente. Due specie dello stesso ordine condividono quindi classe, phylum, regno e dominio. Essendo in famiglie diverse, sono anche in generi diversi.`,
      lesson: md`Organismi che condividono una categoria condividono tutte quelle superiori, e differiscono in tutte quelle inferiori al punto in cui si separano.`,
    },
  ],
  takeaways: [
    md`Le sostituzioni possono essere silenti, di senso o non senso; inserzioni e delezioni non multiple di tre provocano lo slittamento del modulo di lettura.`,
    md`La non disgiunzione dà gameti con un cromosoma in più o in meno, e quindi trisomie e monosomie.`,
    md`La selezione agisce sulla variabilità ereditaria degli individui; evolvono le popolazioni, per selezione, deriva, flusso genico e mutazione.`,
    md`Hardy-Weinberg: si parte da $q^2$, il fenotipo recessivo, e i portatori sono $2pq$.`,
    md`Dominio, regno, phylum, classe, ordine, famiglia, genere, specie; i nomi si scrivono Genere specie.`,
  ],
  flashcards: [
    { front: md`Mutazioni silenti, di senso e non senso`, back: md`Silente: il nuovo codone codifica lo stesso amminoacido. Di senso: un amminoacido diverso. Non senso: un codone di stop, quindi la proteina è troncata.` },
    { front: md`Slittamento del modulo di lettura`, back: md`L'inserzione o la delezione di un numero di nucleotidi non multiplo di tre; ogni codone successivo viene letto in una nuova cornice.` },
    { front: md`Non disgiunzione`, back: md`La mancata separazione dei cromosomi omologhi (meiosi I) o dei cromatidi fratelli (meiosi II), che dà gameti con un cromosoma in più o in meno.` },
    { front: md`Equazioni e condizioni di Hardy-Weinberg`, back: md`$p + q = 1$ e $p^2 + 2pq + q^2 = 1$. Valgono in una popolazione molto grande, con accoppiamenti casuali e senza mutazioni, migrazioni né selezione.` },
    { front: md`Deriva genetica`, back: md`Variazione casuale delle frequenze alleliche, più forte nelle popolazioni piccole; il collo di bottiglia e l'effetto del fondatore ne sono esempi.` },
    { front: md`Le categorie tassonomiche in ordine`, back: md`Dominio, regno, phylum, classe, ordine, famiglia, genere, specie, dalla più ampia alla più ristretta.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-evolution-ecology' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const tissuesCirculationAndRespirationLessonIt: Lesson = {
  slug: 'tissues-circulation-and-respiration',
  title: 'Tessuti, circolazione e respirazione',
  summary: 'I quattro tipi di tessuto, il percorso del sangue nel cuore e nei due circuiti, la ventilazione, gli scambi gassosi e il trasporto di O₂ e CO₂.',
  minutes: 24,
  objectives: [
    md`Nominare i quattro tipi fondamentali di tessuto e riconoscerne i sottotipi principali.`,
    md`Seguire il percorso del sangue attraverso cuore, valvole e vasi, e calcolare la gittata cardiaca.`,
    md`Spiegare la ventilazione, gli scambi gassosi negli alveoli e il trasporto di ossigeno e anidride carbonica.`,
  ],
  teachMd: md`
### I quattro tipi di tessuto

Un **tessuto** è un insieme di cellule simili, con il materiale che le circonda, che svolge una funzione. Ogni organo è costruito con quattro tipi di tessuto.

| Tessuto | Caratteristiche | Esempi |
| --- | --- | --- |
| Epiteliale (*epithelial*) | Lamine di cellule strettamente unite su una membrana basale; privo di vasi propri; pavimentoso, cubico o cilindrico, semplice (uno strato) o pluristratificato | Rivestimento degli alveoli (pavimentoso semplice), epidermide (pavimentoso pluristratificato), mucosa intestinale (cilindrico semplice) |
| Connettivo (*connective*) | Cellule sparse in una matrice extracellulare di fibre e sostanza fondamentale | Connettivo lasso e denso, tessuto adiposo, cartilagine, osso, sangue |
| Muscolare (*muscle*) | Cellule che si contraggono | Scheletrico (striato, volontario, plurinucleato), cardiaco (striato, involontario, con dischi intercalari), liscio (non striato, involontario, nelle pareti di vasi e intestino) |
| Nervoso (*nervous*) | Neuroni, che conducono gli impulsi, e cellule gliali, che li sostengono | Encefalo, midollo spinale, nervi |

### Il cuore e la doppia circolazione

L'uomo ha una **doppia circolazione** (*double circulation*): in un giro completo il sangue passa due volte per il cuore. La **piccola circolazione** (polmonare) porta il sangue ai polmoni e ritorno; la **grande circolazione** (sistemica) lo porta al resto del corpo e ritorno. Il percorso nel cuore è:

vene cave → atrio destro → valvola tricuspide → ventricolo destro → valvola polmonare → arteria polmonare → polmoni → vene polmonari → atrio sinistro → valvola bicuspide (mitrale) → ventricolo sinistro → valvola aortica → aorta → corpo

Le **valvole atrioventricolari** (tricuspide e bicuspide) impediscono il reflusso negli atri quando i ventricoli si contraggono; le **valvole semilunari** (polmonare e aortica) impediscono il reflusso nei ventricoli quando questi si rilasciano. Il ventricolo sinistro ha una parete molto più spessa del destro, perché spinge il sangue in tutto il corpo contro una resistenza maggiore; i due ventricoli pompano però lo stesso volume a ogni battito.

Le arterie si definiscono per direzione, non per contenuto di ossigeno: portano il sangue **lontano dal** cuore, mentre le vene lo riportano **al** cuore. Perciò l'arteria polmonare trasporta sangue deossigenato e le vene polmonari sangue ossigenato.

Il battito nasce nel cuore stesso. Il **nodo senoatriale** (*sinoatrial node*), nella parete dell'atrio destro, è il segnapassi. Il suo impulso si diffonde ai due atri, che si contraggono; il **nodo atrioventricolare** lo ritarda brevemente, così gli atri finiscono di svuotarsi, poi lo trasmette al **fascio di His** e alle **fibre di Purkinje**, e i ventricoli si contraggono dall'apice verso l'alto. Il sistema nervoso autonomo modifica la frequenza: i nervi simpatici e l'adrenalina la aumentano, il nervo vago la riduce.

$$\text{gittata cardiaca} = \text{frequenza cardiaca} \times \text{gittata sistolica}$$

### Vasi e sangue

Le **arterie** hanno pareti spesse con tessuto elastico e muscolatura liscia, per sopportare e smorzare la pressione elevata. I **capillari** hanno una parete spessa una sola cellula (endotelio), ed è lì che avvengono gli scambi con i tessuti. Le **vene** hanno pareti più sottili, lume più ampio, pressione bassa e **valvole** che impediscono il reflusso; la compressione dei muscoli scheletrici aiuta il ritorno del sangue al cuore.

Il sangue è costituito per circa il 55% da plasma (acqua che trasporta glucosio, ioni, proteine, ormoni, urea e CO₂) e per circa il 45% da elementi figurati. I **globuli rossi** nei mammiferi sono privi di nucleo e pieni di **emoglobina**; i **globuli bianchi** difendono l'organismo; le **piastrine** sono frammenti cellulari che avviano la coagulazione.

### La ventilazione

L'aria passa per naso, faringe, laringe, trachea, bronchi e bronchioli fino agli **alveoli**. Anelli di cartilagine tengono aperta la trachea.

L'**inspirazione** è attiva. Il **diaframma si contrae e si appiattisce**, e i muscoli intercostali esterni si contraggono sollevando le coste in alto e in fuori. Il volume del torace aumenta, quindi la pressione nei polmoni scende sotto quella atmosferica, e l'aria entra. L'**espirazione a riposo** è passiva: i muscoli si rilasciano, il ritorno elastico riduce il volume, la pressione sale sopra quella atmosferica e l'aria esce. Nell'espirazione forzata si contraggono anche gli intercostali interni e i muscoli addominali.

### Scambi gassosi e trasporto

Ossigeno e CO₂ attraversano la parete alveolare per **diffusione**, secondo i loro gradienti di concentrazione (di pressione parziale). Lo scambio è rapido perché la superficie è enorme, la barriera è formata da due cellule sottili (parete alveolare e parete capillare), e ventilazione e flusso sanguigno mantengono ripidi i gradienti. Un **tensioattivo** (*surfactant*) riduce la tensione superficiale e impedisce agli alveoli di collassare.

- L'**ossigeno** viaggia quasi tutto legato all'emoglobina, ogni molecola della quale può trasportare quattro O₂.
- L'**anidride carbonica** viaggia soprattutto come **ione idrogenocarbonato** (bicarbonato, HCO₃⁻) nel plasma, prodotto nei globuli rossi dall'enzima **anidrasi carbonica**: CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻. Quote minori viaggiano disciolte o legate all'emoglobina.

L'**effetto Bohr** (*Bohr effect*): più CO₂ e più H⁺ (pH più basso) riducono l'affinità dell'emoglobina per l'ossigeno e spostano la curva di dissociazione verso destra; una temperatura più alta ha lo stesso effetto. I tessuti attivi, che creano queste condizioni, ricevono quindi più ossigeno. La frequenza respiratoria è regolata dal bulbo (midollo allungato), che risponde soprattutto all'aumento della CO₂ nel sangue, rilevato attraverso la diminuzione del pH.
`,
  examples: [
    {
      id: 'example-cardiac-output',
      title: 'Gittata cardiaca a riposo e sotto sforzo',
      problemMd: md`A riposo una persona ha una frequenza cardiaca di 70 battiti al minuto e una gittata sistolica di 70 mL. Durante un esercizio intenso la frequenza è di 150 battiti al minuto e la gittata sistolica di 110 mL. Calcolare la gittata cardiaca nei due casi e di quanto, all'incirca, aumenta.`,
      steps: [
        md`La gittata cardiaca è frequenza per gittata sistolica. A riposo: $70 \times 70 = 4900$ mL al minuto, cioè 4,9 L al minuto.`,
        md`Sotto sforzo: $150 \times 110 = 16\,500$ mL al minuto, cioè 16,5 L al minuto.`,
        md`Rapporto: $\frac{16{,}5}{4{,}9} \approx 3{,}4$.`,
        md`Verifica del rapporto per altra via, fattore per fattore: la frequenza aumenta di $\frac{150}{70} \approx 2{,}14$ e la gittata sistolica di $\frac{110}{70} \approx 1{,}57$; $2{,}14 \times 1{,}57 \approx 3{,}4$.`,
      ],
      answerMd: md`4,9 L al minuto a riposo e 16,5 L al minuto sotto sforzo, circa 3,4 volte tanto. Sommare i due aumenti invece di moltiplicarli sottostima la crescita.`,
    },
    {
      id: 'example-blood-path',
      title: 'Da una vena della gamba di nuovo alla gamba',
      problemMd: md`Un globulo rosso si trova in una vena della gamba sinistra. Elencare in ordine le cavità e le valvole cardiache che attraversa prima di raggiungere di nuovo i capillari della gamba sinistra, e dire quante valvole cardiache supera.`,
      steps: [
        md`Le vene della gamba confluiscono nella vena cava inferiore, che sbocca nell'atrio destro.`,
        md`Atrio destro → valvola tricuspide → ventricolo destro → valvola polmonare → arteria polmonare → capillari polmonari, dove la cellula si carica di ossigeno.`,
        md`Vene polmonari → atrio sinistro → valvola bicuspide (mitrale) → ventricolo sinistro → valvola aortica → aorta → arterie della gamba → capillari della gamba.`,
        md`Si contano le valvole: tricuspide, polmonare, bicuspide, aortica. Con la doppia circolazione ogni cellula le attraversa tutte e quattro.`,
      ],
      answerMd: md`Atrio destro, ventricolo destro, (polmoni), atrio sinistro, ventricolo sinistro; quattro valvole. L'errore da evitare è passare direttamente dal cuore destro all'aorta saltando i polmoni: nel cuore adulto le due metà sono separate.`,
    },
    {
      id: 'example-bohr-effect',
      title: 'Che cosa fa all\'emoglobina un muscolo sotto sforzo',
      problemMd: md`Durante l'esercizio un muscolo della gamba produce più CO₂ e più calore, e il pH del suo liquido interstiziale si abbassa. Prevedere l'effetto sull'ossigeno che il muscolo riceve dall'emoglobina e sulla frequenza respiratoria.`,
      steps: [
        md`Nei globuli rossi l'anidrasi carbonica trasforma la CO₂ in eccesso in H₂CO₃, che libera H⁺ e HCO₃⁻; gli H⁺ abbassano il pH.`,
        md`H⁺, CO₂ e temperatura più alta riducono l'affinità dell'emoglobina per l'ossigeno: la curva di dissociazione si sposta a destra (effetto Bohr, per la parte dovuta a CO₂ e H⁺).`,
        md`Alla pressione parziale di ossigeno presente nel muscolo l'emoglobina è quindi meno saturata di quanto sarebbe altrimenti, e cede lì più ossigeno.`,
        md`L'aumento della CO₂ nel sangue e il calo del pH vengono rilevati dai chemocettori; il bulbo aumenta frequenza e profondità del respiro, che elimina CO₂ e porta più O₂.`,
      ],
      answerMd: md`Il muscolo riceve più ossigeno, perché l'emoglobina cede O₂ più facilmente in un tessuto caldo, acido e ricco di CO₂, e il respiro diventa più rapido e profondo. Prevedere che un pH basso faccia trattenere l'ossigeno all'emoglobina significa capovolgere l'effetto Bohr.`,
    },
  ],
  traps: [
    {
      title: md`Definire le arterie in base all'ossigeno`,
      md: md`Le arterie portano il sangue lontano dal cuore e le vene verso il cuore, qualunque sia il contenuto di ossigeno. L'arteria polmonare trasporta sangue deossigenato e le vene polmonari sangue ossigenato; i vasi ombelicali del feto sono un'altra eccezione all'idea che "le arterie sono rosse".`,
    },
    {
      title: md`Leggere destra e sinistra sulla pagina`,
      md: md`Gli schemi del cuore sono disegnati come se si guardasse la persona di fronte, quindi il lato sinistro del cuore è a destra della pagina. Per orientarsi si cercano il ventricolo dalla parete spessa e l'aorta.`,
    },
    {
      title: md`Capovolgere il diaframma`,
      md: md`Quando il diaframma si contrae si appiattisce e si abbassa, allargando il torace: è l'inspirazione. Un diaframma a cupola è un diaframma rilasciato. L'aria si muove sempre dalla pressione più alta a quella più bassa.`,
    },
    {
      title: md`Mettere quasi tutta la CO₂ sull'emoglobina`,
      md: md`La maggior parte dell'anidride carbonica viaggia nel plasma come ione idrogenocarbonato, prodotto nei globuli rossi dall'anidrasi carbonica. Solo una minoranza è legata all'emoglobina.`,
    },
  ],
  check: [
    {
      id: 'check-vessel-deoxygenated',
      title: 'Sangue deossigenato in uscita dal cuore',
      topic: 'Anatomia e fisiologia',
      stemMd: md`In un adulto sano, quale vaso porta sangue deossigenato lontano dal cuore?`,
      options: [
        { id: 'A', text: md`L'aorta`, note: md`L'aorta esce dal ventricolo sinistro e porta sangue ossigenato al corpo.` },
        { id: 'B', text: md`La vena polmonare`, note: md`Le vene polmonari portano sangue ossigenato dai polmoni **al** cuore.` },
        { id: 'C', text: md`L'arteria polmonare`, note: '' },
        { id: 'D', text: md`La vena cava inferiore`, note: md`Trasporta sangue deossigenato, ma verso il cuore, non lontano da esso.` },
        { id: 'E', text: md`Un'arteria coronaria`, note: md`Le arterie coronarie nascono dall'aorta e portano sangue ossigenato al muscolo cardiaco.` },
      ],
      answer: 'C',
      workingMd: md`Il sangue che esce dal cuore viaggia nelle arterie. Delle due grandi arterie, l'aorta porta sangue ossigenato dal ventricolo sinistro, mentre l'arteria polmonare porta sangue deossigenato dal ventricolo destro ai polmoni.`,
      lesson: md`I vasi si nominano in base alla direzione; l'arteria polmonare è l'arteria che trasporta sangue deossigenato.`,
    },
    {
      id: 'check-inspiration',
      title: 'Inspirare',
      topic: 'Anatomia e fisiologia',
      stemMd: md`Quale sequenza descrive l'inspirazione a riposo?`,
      options: [
        { id: 'A', text: md`Il diaframma si contrae e si appiattisce, il volume del torace aumenta e la pressione nei polmoni scende sotto quella atmosferica`, note: '' },
        { id: 'B', text: md`Il diaframma si rilascia e sale a cupola, il volume del torace aumenta e l'aria viene richiamata`, note: md`Un diaframma che si rilascia sale a cupola e **riduce** il volume del torace: è l'espirazione.` },
        { id: 'C', text: md`Il diaframma si contrae, il volume del torace aumenta e la pressione nei polmoni sale sopra quella atmosferica`, note: md`Un volume maggiore abbassa la pressione; l'aria entra perché la pressione polmonare scende sotto quella atmosferica, non sopra.` },
        { id: 'D', text: md`La muscolatura liscia dei bronchioli si contrae e pompa l'aria negli alveoli`, note: md`I bronchioli non pompano aria; la contrazione della loro muscolatura liscia li restringe e rende più difficile respirare.` },
        { id: 'E', text: md`Gli intercostali interni si contraggono e tirano le coste in basso e in dentro, allargando il torace`, note: md`Tirare le coste in basso e in dentro restringe il torace; gli intercostali interni agiscono nell'espirazione forzata.` },
      ],
      answer: 'A',
      workingMd: md`Nell'inspirazione il diaframma si contrae e si appiattisce e gli intercostali esterni sollevano le coste. Il torace si allarga, la pressione nei polmoni scende sotto quella atmosferica e l'aria entra seguendo il gradiente di pressione.`,
      lesson: md`Volume su, pressione giù, aria dentro: i muscoli cambiano il volume e la pressione segue.`,
    },
    {
      id: 'check-stroke-volume',
      title: 'Calcolare la gittata sistolica',
      topic: 'Anatomia e fisiologia',
      stemMd: md`Una persona ha una gittata cardiaca di 5,6 L al minuto e una frequenza cardiaca di 80 battiti al minuto. Qual è la gittata sistolica?`,
      options: [
        { id: 'A', text: md`0,07 mL`, note: md`$\frac{5{,}6}{80} = 0{,}07$ è in litri; l'unità non è stata convertita in millilitri.` },
        { id: 'B', text: md`7 mL`, note: md`Un errore di virgola: 0,07 L sono 70 mL, non 7 mL.` },
        { id: 'C', text: md`14,3 mL`, note: md`Divide la frequenza per la gittata cardiaca, $\frac{80}{5{,}6}$: il rapporto è capovolto.` },
        { id: 'D', text: md`70 mL`, note: '' },
        { id: 'E', text: md`448 mL`, note: md`Moltiplica la gittata cardiaca per la frequenza, $5{,}6 \times 80$, invece di dividere.` },
      ],
      answer: 'D',
      workingMd: md`La gittata sistolica è la gittata cardiaca divisa per la frequenza: $\frac{5{,}6\ \text{L}}{80} = 0{,}07$ L $= 70$ mL. Verifica: $80 \times 70$ mL $= 5600$ mL $= 5{,}6$ L al minuto.`,
      lesson: md`Si ricava la formula gittata cardiaca = frequenza × gittata sistolica e si convertono i litri in millilitri alla fine.`,
    },
  ],
  takeaways: [
    md`Quattro tipi di tessuto: epiteliale, connettivo, muscolare e nervoso.`,
    md`Il cuore destro manda il sangue ai polmoni, il sinistro al corpo; quattro valvole mantengono il flusso a senso unico.`,
    md`Gittata cardiaca = frequenza cardiaca × gittata sistolica.`,
    md`L'inspirazione è attiva: il diaframma si contrae e si appiattisce, il torace si allarga, la pressione scende e l'aria entra.`,
    md`L'ossigeno viaggia sull'emoglobina, la CO₂ soprattutto come idrogenocarbonato; più CO₂, acidità e calore fanno cedere ossigeno all'emoglobina.`,
  ],
  flashcards: [
    { front: md`I quattro tipi fondamentali di tessuto`, back: md`Epiteliale, connettivo, muscolare e nervoso.` },
    { front: md`I tre tipi di tessuto muscolare`, back: md`Scheletrico: striato, volontario, plurinucleato. Cardiaco: striato, involontario, con dischi intercalari. Liscio: non striato, involontario.` },
    { front: md`Percorso del sangue dalle vene cave all'aorta`, back: md`Atrio destro, valvola tricuspide, ventricolo destro, valvola polmonare, arteria polmonare, polmoni, vene polmonari, atrio sinistro, valvola bicuspide, ventricolo sinistro, valvola aortica, aorta.` },
    { front: md`Segnapassi e sistema di conduzione del cuore`, back: md`Il nodo senoatriale avvia ogni battito; il nodo atrioventricolare lo ritarda, poi il fascio di His e le fibre di Purkinje lo portano nei ventricoli.` },
    { front: md`Come viaggia nel sangue la maggior parte della CO₂`, back: md`Come ioni idrogenocarbonato nel plasma, prodotti nei globuli rossi dall'anidrasi carbonica a partire da CO₂ e acqua.` },
    { front: md`Effetto Bohr`, back: md`Più CO₂ e H⁺ riducono l'affinità dell'emoglobina per l'ossigeno e spostano la curva di dissociazione a destra, così i tessuti attivi ricevono più ossigeno.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-anatomy-physiology' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const nervousEndocrineAndImmuneSystemsLessonIt: Lesson = {
  slug: 'nervous-endocrine-and-immune-systems',
  title: 'Sistema nervoso, endocrino e immunitario',
  summary: 'Come funzionano impulso nervoso e sinapsi, come ormoni e feedback negativo regolano il corpo, come lo difendono immunità innata e adattativa.',
  minutes: 25,
  objectives: [
    md`Spiegare il potenziale di riposo, il potenziale d'azione e la trasmissione sinaptica.`,
    md`Descrivere come agiscono gli ormoni e come il feedback negativo regola la glicemia e gli ormoni tiroidei.`,
    md`Distinguere l'immunità innata da quella adattativa, i linfociti B dai T e l'immunità attiva da quella passiva.`,
  ],
  teachMd: md`
### L'organizzazione del sistema nervoso

Il **sistema nervoso centrale** (SNC) comprende encefalo e midollo spinale; il **sistema nervoso periferico** è formato dai nervi che lo collegano al resto del corpo. I nervi periferici contengono fibre sensitive (afferenti), dirette al SNC, e fibre motorie (efferenti), che ne escono. La parte motoria ha una componente **somatica**, che controlla i muscoli scheletrici, e una **autonoma**, che controlla muscolatura liscia, muscolo cardiaco e ghiandole.

| | Simpatico ("attacco o fuga") | Parasimpatico ("riposo e digestione") |
| --- | --- | --- |
| Frequenza cardiaca | Aumenta | Diminuisce |
| Pupille | Si dilatano | Si restringono |
| Bronchioli | Si dilatano | Si restringono |
| Digestione | Rallentata | Favorita |

### Il neurone e il potenziale d'azione

Un neurone riceve segnali sui **dendriti** e sul corpo cellulare e li invia lungo l'**assone**. Molti assoni sono avvolti dalla **mielina**, prodotta dalle cellule di Schwann nel sistema periferico e dagli oligodendrociti nel SNC. Le interruzioni della mielina, i **nodi di Ranvier**, permettono all'impulso di saltare da un nodo all'altro (**conduzione saltatoria**, *saltatory conduction*), molto più rapida.

A riposo l'interno della membrana si trova a circa −70 mV rispetto all'esterno. La **pompa sodio-potassio** usa ATP per portare fuori 3 Na⁺ ogni 2 K⁺ portati dentro, e la membrana lascia uscire K⁺ più di quanto lasci entrare Na⁺, il che rende negativo l'interno.

Quando uno stimolo porta la membrana alla **soglia** (*threshold*), si aprono i canali del Na⁺ voltaggio-dipendenti, il Na⁺ entra rapidamente e l'interno diventa positivo (**depolarizzazione**, fino a circa +30/+40 mV). Poi i canali del Na⁺ si chiudono e si aprono quelli del K⁺ voltaggio-dipendenti: il K⁺ esce e il potenziale torna indietro (**ripolarizzazione**), scendendo per un attimo sotto il valore di riposo (**iperpolarizzazione**). Durante il **periodo refrattario** quel tratto di membrana non può scaricare di nuovo, quindi l'impulso procede in una sola direzione.

Il potenziale d'azione segue la legge del **tutto o nulla** (*all-or-none*): raggiunta la soglia, la sua ampiezza è fissa. Uno stimolo più forte produce impulsi a **frequenza maggiore**, non impulsi più grandi.

### Le sinapsi

Quando l'impulso raggiunge il terminale dell'assone, si aprono **canali del Ca²⁺** voltaggio-dipendenti e il Ca²⁺ entra. Questo innesca l'esocitosi di vescicole di **neurotrasmettitore**, per esempio l'acetilcolina, nella fessura sinaptica. Il trasmettitore diffonde, si lega ai recettori della membrana postsinaptica e apre i canali ionici. Poi viene rimosso da un enzima (l'**acetilcolinesterasi** demolisce l'acetilcolina) o ricaptato dalla cellula presinaptica. La sinapsi trasmette in una sola direzione, perché solo il lato presinaptico libera il trasmettitore e solo quello postsinaptico ha i recettori.

Un **arco riflesso** (recettore → neurone sensitivo → interneurone nel midollo spinale → motoneurone → effettore) dà una risposta rapida che non aspetta l'encefalo.

### Gli ormoni

Le ghiandole endocrine liberano **ormoni** nel sangue, che li porta a tutte le cellule; rispondono solo le cellule dotate del **recettore** adatto. Gli ormoni peptidici come l'insulina non attraversano la membrana: si legano a recettori di superficie e agiscono tramite secondi messaggeri. Gli ormoni steroidei come cortisolo, estrogeni e testosterone sono liposolubili, attraversano la membrana e si legano a recettori interni, modificando l'espressione genica.

L'**ipotalamo** collega i due sistemi. Controlla l'adenoipofisi (ipofisi anteriore) con ormoni di rilascio, e produce ADH e ossitocina, che scendono lungo gli assoni fino alla **neuroipofisi** (ipofisi posteriore, *posterior pituitary*) e lì vengono liberati.

La maggior parte dei livelli ormonali è mantenuta costante dal **feedback negativo** (*negative feedback*): una variazione innesca una risposta che la annulla.

- **Glicemia.** Quando il glucosio sale, le cellule beta delle isole pancreatiche liberano **insulina**, che fa assorbire glucosio a fegato e muscoli e lo fa immagazzinare come glicogeno. Quando il glucosio scende, le cellule alfa liberano **glucagone**, che fa demolire il glicogeno al fegato e liberare glucosio.
- **Tiroide.** L'ipotalamo libera TRH, che fa liberare TSH all'adenoipofisi, che fa liberare T₃ e T₄ alla tiroide. T₃ e T₄ inibiscono la liberazione di TRH e TSH.
- L'**adrenalina** della midollare del surrene prepara il corpo all'azione, come il sistema simpatico.

### Immunità innata e adattativa

Le difese **innate** agiscono subito e sono le stesse per ogni patogeno: cute e mucose, acido gastrico, lisozima, fagociti (neutrofili e macrofagi), cellule natural killer, proteine del complemento e infiammazione.

L'immunità **adattativa** è specifica, più lenta la prima volta, e ha **memoria**. Si basa sui linfociti, ciascuno con recettori per un solo antigene.

- I **linfociti B**, una volta attivati (di solito con l'aiuto dei linfociti T helper), si dividono in **plasmacellule**, che secernono **anticorpi**, e linfociti B della memoria. Un anticorpo è una proteina a forma di Y formata da due catene pesanti e due leggere; le sue due estremità variabili legano l'antigene.
- I **linfociti T helper** (CD4) coordinano la risposta liberando citochine. I **linfociti T citotossici** (CD8) uccidono le cellule infette che espongono antigeni estranei sulle molecole MHC di classe I.

La **risposta primaria** a un antigene nuovo impiega giorni a raggiungere il picco. Le cellule della memoria rendono la **risposta secondaria** allo stesso antigene più rapida, più intensa e più duratura. Un **vaccino** induce un'immunità **attiva** con memoria senza causare la malattia. Gli anticorpi iniettati, o quelli passati dalla madre al figlio attraverso la placenta o il latte, danno un'immunità **passiva**: immediata ma temporanea, senza cellule della memoria.
`,
  examples: [
    {
      id: 'example-cholinesterase-inhibitor',
      title: 'Bloccare l\'acetilcolinesterasi',
      problemMd: md`Un farmaco inibisce l'acetilcolinesterasi nelle sinapsi tra motoneuroni e muscolo scheletrico. Prevedere l'effetto sul muscolo dopo un singolo impulso nervoso.`,
      steps: [
        md`L'impulso apre i canali del Ca²⁺ nel terminale e l'acetilcolina viene liberata nella fessura come al solito. Il farmaco non cambia questo passaggio.`,
        md`L'acetilcolina si lega ai suoi recettori e depolarizza la membrana muscolare, come al solito.`,
        md`Normalmente l'acetilcolinesterasi demolisce l'acetilcolina in pochi millisecondi e chiude il segnale. Con l'enzima bloccato, l'acetilcolina resta nella fessura.`,
        md`I recettori vengono quindi stimolati ripetutamente: la membrana muscolare resta depolarizzata più a lungo e la risposta del muscolo si prolunga.`,
      ],
      answerMd: md`La trasmissione si prolunga: l'acetilcolina si accumula e continua a stimolare il muscolo. Prevedere che il muscolo non possa contrarsi affatto sarebbe giusto per un farmaco che blocca i recettori dell'acetilcolina, che è un meccanismo diverso.`,
    },
    {
      id: 'example-iodine-deficiency',
      title: 'Carenza di iodio e circuito tiroideo',
      problemMd: md`La tiroide ha bisogno di iodio per produrre T₃ e T₄. Prevedere i livelli ematici di T₄ e TSH in una persona con una dieta povera di iodio, e spiegare perché la tiroide può ingrossarsi.`,
      steps: [
        md`Senza iodio la tiroide produce poco T₃ e T₄, quindi il T₄ nel sangue è basso.`,
        md`Normalmente T₃ e T₄ inibiscono ipotalamo e adenoipofisi. Se ce n'è poco, il feedback negativo si indebolisce.`,
        md`L'adenoipofisi libera quindi più TSH, che nel sangue risulta alto.`,
        md`Il TSH stimola sia la secrezione sia la crescita della tiroide, che si ingrossa (gozzo) pur continuando a non produrre abbastanza ormone.`,
      ],
      answerMd: md`T₄ basso, TSH alto e possibile gozzo. Prevedere anche il TSH basso significa dimenticare che il circuito è negativo: meno prodotto vuol dire meno inibizione e più ormone stimolante.`,
    },
    {
      id: 'example-secondary-response',
      title: 'Leggere dati sugli anticorpi',
      problemMd: md`Un volontario riceve un vaccino il giorno 0 e lo stesso vaccino di nuovo il giorno 60. I livelli di anticorpi (unità arbitrarie) sono: giorno 7, 5; giorno 14, 40; giorno 30, 15; giorno 67, 400; giorno 74, 600. Spiegare l'andamento.`,
      steps: [
        md`Dopo la prima dose gli anticorpi compaiono lentamente, raggiungono un picco modesto (40 unità intorno al giorno 14) e poi calano: è la risposta primaria, mentre i linfociti B specifici per l'antigene vengono selezionati e si moltiplicano.`,
        md`Quella prima risposta ha anche lasciato linfociti B e T della memoria.`,
        md`Sette giorni dopo la seconda dose il livello è già di 400 unità, dieci volte il primo picco, e sta ancora salendo: le cellule della memoria rispondono più in fretta e in numero maggiore.`,
        md`Verifica del confronto allo stesso intervallo: 7 giorni dopo ciascuna dose i livelli sono 5 e 400, ottanta volte di più la seconda volta.`,
      ],
      answerMd: md`La seconda esposizione scatena una risposta secondaria, più rapida e intensa perché la prima ha prodotto cellule della memoria. Per questo molti vaccini si somministrano in più dosi. Attribuire l'aumento ad anticorpi rimasti dalla prima dose non regge: al giorno 30 erano scesi a 15 unità.`,
    },
  ],
  traps: [
    {
      title: md`Credere che uno stimolo più forte dia un impulso più grande`,
      md: md`Il potenziale d'azione è tutto o nulla. L'intensità dello stimolo è codificata dalla frequenza degli impulsi e dal numero di neuroni che scaricano, mai dall'ampiezza del singolo impulso.`,
    },
    {
      title: md`Dire che la neuroipofisi produce l'ADH`,
      md: md`ADH e ossitocina sono prodotti da neuroni dell'ipotalamo e soltanto immagazzinati e liberati dalla neuroipofisi. L'adenoipofisi produce invece ormoni propri, come TSH, FSH e LH.`,
    },
    {
      title: md`Confondere glucagone e glicogeno`,
      md: md`Il glucagone è un ormone che alza la glicemia; il glicogeno è il polisaccaride di riserva che il glucagone fa demolire al fegato. È l'insulina, non il glucagone, a promuovere la sintesi di glicogeno.`,
    },
    {
      title: md`Aspettarsi memoria dall'immunità passiva`,
      md: md`Gli anticorpi iniettati o materni proteggono subito ma vengono demoliti in settimane o mesi, e non si formano cellule della memoria. Solo l'immunità attiva, da infezione o vaccinazione, lascia memoria.`,
    },
  ],
  check: [
    {
      id: 'check-sodium-channels',
      title: 'Alla soglia',
      topic: 'Anatomia e fisiologia',
      stemMd: md`Che cosa succede subito dopo l'apertura dei canali del sodio voltaggio-dipendenti nella membrana di un assone alla soglia?`,
      options: [
        { id: 'A', text: md`Il K⁺ esce dall'assone e la membrana si ripolarizza`, note: md`È la fase successiva, quando si aprono i canali del K⁺ e quelli del Na⁺ si sono chiusi.` },
        { id: 'B', text: md`Il Na⁺ entra nell'assone e la membrana si depolarizza`, note: '' },
        { id: 'C', text: md`La pompa sodio-potassio porta fuori Na⁺ usando ATP e la membrana si iperpolarizza`, note: md`La pompa lavora di continuo per mantenere i gradienti; non produce la rapida fase ascendente.` },
        { id: 'D', text: md`Il Na⁺ esce dall'assone e l'interno diventa più negativo`, note: md`Il Na⁺ è più concentrato all'esterno, quindi attraverso i canali aperti entra e rende positivo l'interno.` },
        { id: 'E', text: md`Entra Ca²⁺ e provoca la liberazione di vescicole di neurotrasmettitore`, note: md`L'ingresso di Ca²⁺ innesca la liberazione nel terminale dell'assone, non lungo l'assone alla soglia.` },
      ],
      answer: 'B',
      workingMd: md`Il Na⁺ è molto più concentrato fuori dalla cellula e l'interno è negativo, quindi quando si aprono i canali del Na⁺ voltaggio-dipendenti il Na⁺ entra rapidamente e il potenziale di membrana diventa positivo: depolarizzazione. Segue la ripolarizzazione per uscita di K⁺.`,
      lesson: md`Na⁺ che entra dà la fase ascendente; K⁺ che esce dà la fase discendente.`,
    },
    {
      id: 'check-passive-immunity',
      title: 'Anticorpi per iniezione',
      topic: 'Anatomia e fisiologia',
      stemMd: md`Una persona morsa da un serpente velenoso riceve un'iniezione di anticorpi già pronti contro il veleno. Quale affermazione su questa protezione è corretta?`,
      options: [
        { id: 'A', text: md`È immunità attiva, perché gli anticorpi attaccano il veleno`, note: md`L'immunità è attiva solo quando gli anticorpi li produce il sistema immunitario della persona; qui vengono dall'esterno.` },
        { id: 'B', text: md`Impiega una o due settimane per agire, come una risposta immunitaria primaria`, note: md`Gli anticorpi già pronti agiscono non appena sono nel sangue; non c'è nessuna risposta da costruire.` },
        { id: 'C', text: md`Produce cellule della memoria che proteggono da un morso successivo`, note: md`Le cellule della memoria nascono solo dai linfociti della persona che rispondono all'antigene; gli anticorpi iniettati non ne producono.` },
        { id: 'D', text: md`Agisce stimolando i linfociti B della persona a dividersi in plasmacellule`, note: md`È così che funziona un vaccino. Gli anticorpi iniettati legano direttamente il veleno.` },
        { id: 'E', text: md`Agisce subito ma dura poco, perché non si formano cellule della memoria`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Gli anticorpi già pronti danno immunità passiva. Neutralizzano subito il veleno, ma vengono demoliti a poco a poco e i linfociti della persona non sono stati attivati, quindi non si formano cellule della memoria e la protezione è temporanea.`,
      lesson: md`L'immunità passiva è rapida e temporanea; quella attiva è più lenta la prima volta e lascia memoria.`,
    },
    {
      id: 'check-thyroid-feedback',
      title: 'Una tiroide che non risponde',
      topic: 'Anatomia e fisiologia',
      stemMd: md`La tiroide di una persona è danneggiata e produce pochissimo T₃ e T₄, mentre ipotalamo e ipofisi funzionano normalmente. Quale quadro di livelli ematici ci si aspetta?`,
      options: [
        { id: 'A', text: md`TSH basso, T₄ basso`, note: md`Sarebbe il quadro di un'ipofisi insufficiente. Qui l'ipofisi è normale e, libera dal feedback, produce più TSH.` },
        { id: 'B', text: md`TSH alto, T₄ alto`, note: md`Un TSH alto non può alzare il T₄ se la ghiandola stessa è danneggiata.` },
        { id: 'C', text: md`TSH alto, T₄ basso`, note: '' },
        { id: 'D', text: md`TSH basso, T₄ alto`, note: md`È il quadro di una tiroide iperattiva, il cui eccesso di T₄ sopprime il TSH.` },
        { id: 'E', text: md`TSH normale, T₄ basso`, note: md`Il TSH resterebbe normale solo se non esistesse il feedback; il T₄ basso toglie l'inibizione e il TSH sale.` },
      ],
      answer: 'C',
      workingMd: md`La ghiandola danneggiata produce poco ormone, quindi il T₄ è basso. Livelli bassi di T₃ e T₄ indeboliscono il feedback negativo su ipotalamo e adenoipofisi, e la secrezione di TRH e TSH aumenta. Il risultato è TSH alto con T₄ basso.`,
      lesson: md`In un circuito a feedback negativo si individua prima l'organo guasto; gli organi sani a monte si muovono nella direzione che correggerebbe il guasto.`,
    },
  ],
  takeaways: [
    md`Il potenziale di riposo è di circa −70 mV; il Na⁺ che entra depolarizza, il K⁺ che esce ripolarizza; gli impulsi sono tutto o nulla.`,
    md`Nella sinapsi l'ingresso di Ca²⁺ libera il trasmettitore, che si lega ai recettori postsinaptici e poi viene rimosso.`,
    md`L'insulina abbassa la glicemia e il glucagone la alza; T₃ e T₄ inibiscono TRH e TSH per feedback negativo.`,
    md`I linfociti B diventano plasmacellule che secernono anticorpi; i T helper coordinano e i T citotossici uccidono le cellule infette.`,
    md`L'immunità attiva lascia cellule della memoria; quella passiva è immediata ma temporanea.`,
  ],
  flashcards: [
    { front: md`Potenziale di riposo e che cosa lo mantiene`, back: md`Circa −70 mV all'interno. La pompa Na⁺/K⁺ porta fuori 3 Na⁺ e dentro 2 K⁺ usando ATP, e la membrana lascia uscire più K⁺ di quanto Na⁺ lasci entrare.` },
    { front: md`Legge del tutto o nulla`, back: md`Raggiunta la soglia, il potenziale d'azione ha ampiezza fissa. Stimoli più forti aumentano la frequenza degli impulsi, non la loro ampiezza.` },
    { front: md`Che cosa avvia la liberazione del trasmettitore in una sinapsi`, back: md`Il Ca²⁺ che entra nel terminale dell'assone attraverso canali voltaggio-dipendenti innesca l'esocitosi delle vescicole di neurotrasmettitore.` },
    { front: md`Dove si produce e dove si libera l'ADH`, back: md`Si produce in neuroni dell'ipotalamo; si immagazzina e si libera nella neuroipofisi.` },
    { front: md`Insulina e glucagone`, back: md`L'insulina, delle cellule beta, abbassa la glicemia e promuove la sintesi di glicogeno. Il glucagone, delle cellule alfa, la alza facendo demolire il glicogeno al fegato.` },
    { front: md`Immunità attiva e passiva`, back: md`Attiva: l'organismo produce i propri anticorpi e cellule della memoria, dopo infezione o vaccinazione. Passiva: si ricevono anticorpi già pronti; immediata, temporanea, senza memoria.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-anatomy-physiology' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const digestiveAndExcretorySystemsLessonIt: Lesson = {
  slug: 'digestive-and-excretory-systems',
  title: 'Apparato digerente ed escretore',
  summary: 'Seguire il cibo nella digestione e nell\'assorbimento e il filtrato nel nefrone, e prevedere che cosa cambia se mancano un enzima, la bile o l\'ADH.',
  minutes: 23,
  objectives: [
    md`Associare ogni enzima digestivo a origine, sede, substrato e prodotti, e spiegare il ruolo della bile e dei villi.`,
    md`Descrivere ultrafiltrazione, riassorbimento selettivo e controllo dell'acqua da parte dell'ADH nel nefrone.`,
    md`Interpretare dati su plasma, filtrato e urina, e prevedere gli effetti di ormoni e farmaci sull'urina.`,
  ],
  teachMd: md`
### Il tubo digerente

Il cibo attraversa bocca, faringe, esofago, stomaco, intestino tenue (duodeno, digiuno, ileo), intestino crasso (colon) e retto. La digestione è **meccanica** (masticazione, rimescolamento nello stomaco) e **chimica** (idrolisi enzimatica delle grandi molecole in unità abbastanza piccole da essere assorbite). Il cibo avanza per **peristalsi**, onde di contrazione della muscolatura liscia della parete.

| Enzima | Prodotto da | Agisce in | Substrato → prodotti |
| --- | --- | --- | --- |
| Amilasi salivare | Ghiandole salivari | Bocca (pH quasi neutro) | Amido → maltosio |
| Pepsina | Stomaco (come pepsinogeno) | Stomaco (pH circa 2) | Proteine → polipeptidi |
| Amilasi pancreatica | Pancreas | Intestino tenue | Amido → maltosio |
| Tripsina | Pancreas (come tripsinogeno) | Intestino tenue | Proteine e polipeptidi → peptidi più corti |
| Lipasi | Pancreas | Intestino tenue | Trigliceridi → acidi grassi + monogliceridi |
| Maltasi, saccarasi, lattasi, peptidasi | Cellule della mucosa intestinale | Intestino tenue (sui microvilli) | Disaccaridi → monosaccaridi; peptidi → amminoacidi |

Gli enzimi che digeriscono le proteine sono prodotti come **precursori inattivi** (zimogeni), così non digeriscono le cellule che li producono. L'acido cloridrico dello stomaco trasforma il pepsinogeno in pepsina; nel duodeno l'enterochinasi (enteropeptidasi) della mucosa trasforma il tripsinogeno in tripsina. L'acido gastrico uccide anche la maggior parte dei microbi presenti nel cibo.

### Bile e pancreas

La **bile** è prodotta dal fegato, immagazzinata nella cistifellea e versata nel duodeno. **Non contiene enzimi**. I suoi sali biliari **emulsionano** i grassi, frammentando le gocce grandi in gocce piccole, il che offre alla lipasi una superficie molto più ampia. Bile e succo pancreatico sono inoltre ricchi di **idrogenocarbonato**, che neutralizza l'acido proveniente dallo stomaco, così gli enzimi pancreatici e intestinali possono lavorare al loro optimum leggermente alcalino.

Ormoni prodotti dal tubo digerente coordinano il processo: la **gastrina** stimola la secrezione acida dello stomaco; la **secretina** (liberata quando l'acido entra nel duodeno) stimola la secrezione di idrogenocarbonato; la **colecistochinina** (CCK, liberata all'arrivo di grassi e proteine) stimola la secrezione di enzimi pancreatici e la contrazione della cistifellea.

### L'assorbimento

L'intestino tenue ha una superficie enorme: è lungo e ripiegato, la sua mucosa porta i **villi** e le sue cellule epiteliali i **microvilli**. Ogni villo contiene una rete di capillari e un vaso linfatico, il **chilifero** (*lacteal*).

- **Monosaccaridi e amminoacidi** vengono assorbiti per diffusione facilitata e trasporto attivo (spesso cotrasporto con Na⁺) nei capillari, che confluiscono nella **vena porta epatica** diretta al fegato.
- **Acidi grassi e monogliceridi** entrano nelle cellule epiteliali, vengono ricomposti in trigliceridi, impacchettati nei **chilomicroni** e passano nei **chiliferi**: raggiungono il sangue attraverso la linfa e in un primo tempo non passano dal fegato.

L'intestino crasso assorbe gran parte dell'acqua e dei sali rimasti. I suoi batteri fermentano il materiale non digerito e producono alcune vitamine, come la vitamina K.

### Il fegato e le scorie azotate

Gli amminoacidi in eccesso non possono essere immagazzinati. Il fegato ne rimuove il gruppo amminico (**deaminazione**), producendo ammoniaca, tossica, che viene subito trasformata nella molto meno tossica **urea** nel ciclo dell'urea (ciclo dell'ornitina). I reni poi la eliminano. L'escrezione è l'eliminazione delle scorie prodotte dal metabolismo; l'emissione delle feci, formate soprattutto da cibo non digerito, non è escrezione.

### Il rene e il nefrone

Ogni rene contiene circa un milione di **nefroni**. L'urina lascia ogni rene attraverso un **uretere**, si raccoglie nella **vescica** ed esce dal corpo attraverso l'**uretra**. In ogni nefrone:

1. **Ultrafiltrazione** nel **glomerulo**. L'arteriola afferente è più larga di quella efferente, quindi la pressione nel glomerulo è alta. Acqua e piccoli soluti (glucosio, amminoacidi, ioni, urea) vengono spinti nella **capsula di Bowman**; cellule del sangue e quasi tutte le proteine sono troppo grandi e restano nel sangue. La filtrazione avviene per dimensione, non per utilità.
2. **Riassorbimento selettivo** nel **tubulo contorto prossimale**. Tutto il glucosio e gli amminoacidi, e gran parte del Na⁺ e dell'acqua, tornano nel sangue. Il glucosio è riassorbito da trasportatori (cotrasporto con Na⁺), che hanno una velocità massima.
3. **L'ansa di Henle** crea una midollare sempre più salata. Il ramo discendente è permeabile all'acqua; il ramo ascendente è impermeabile all'acqua e pompa fuori Na⁺ e Cl⁻.
4. **Tubulo distale e dotto collettore** rifiniscono l'urina. L'**aldosterone** della corticale del surrene aumenta il riassorbimento di Na⁺. L'**ADH** rende il dotto collettore più permeabile all'acqua inserendo **acquaporine**, così più acqua passa nella midollare salata e l'urina è meno abbondante e più concentrata.

L'ADH è regolato da feedback negativo: quando il sangue diventa troppo concentrato (dopo aver sudato molto o bevuto poco), gli osmocettori dell'ipotalamo fanno liberare più ADH; quando il sangue è diluito, l'ADH cala e si produce molta urina diluita. L'alcol inibisce la liberazione di ADH, ed è per questo che aumenta la diuresi.
`,
  examples: [
    {
      id: 'example-blocked-bile-duct',
      title: 'Un dotto biliare ostruito',
      problemMd: md`Un calcolo ostruisce il dotto che porta la bile nel duodeno, mentre il succo pancreatico continua a fluire. Prevedere l'effetto sulla digestione di grassi e proteine e sulle feci.`,
      steps: [
        md`La bile non contiene enzimi, ma i suoi sali emulsionano i grassi. Senza bile i grassi restano in gocce grandi, con poca superficie.`,
        md`La lipasi pancreatica arriva comunque nel duodeno, ma agisce solo sulla superficie delle gocce, quindi la digestione dei grassi è lenta e incompleta.`,
        md`I grassi non digeriti non possono essere assorbiti, quindi restano nell'intestino e le feci diventano grasse e chiare (mancano anche i pigmenti biliari, che colorano le feci).`,
        md`La digestione delle proteine dipende da pepsina e proteasi pancreatiche e intestinali, nessuna delle quali ha bisogno della bile; continua, anche se l'acido gastrico viene neutralizzato peggio senza l'idrogenocarbonato della bile.`,
      ],
      answerMd: md`Digestione e assorbimento dei grassi calano nettamente, con feci grasse e chiare; la digestione delle proteine prosegue. Concludere che la digestione dei grassi si arresti del tutto è eccessivo: la lipasi è ancora presente, si riduce solo il suo accesso ai grassi.`,
    },
    {
      id: 'example-nephron-data',
      title: 'Leggere plasma, filtrato e urina',
      problemMd: md`Concentrazioni in g per 100 mL: proteine, plasma 7,5, filtrato 0, urina 0; glucosio, plasma 0,1, filtrato 0,1, urina 0; urea, plasma 0,03, filtrato 0,03, urina 2,0. Spiegare ogni riga.`,
      steps: [
        md`Proteine: assenti nel filtrato, quindi non superano il filtro glomerulare; sono troppo grandi.`,
        md`Glucosio: stessa concentrazione nel filtrato e nel plasma, quindi è filtrato liberamente; assente nell'urina, quindi viene riassorbito tutto, nel tubulo prossimale.`,
        md`Urea: filtrata liberamente (0,03 in entrambi), poi concentrata nell'urina di un fattore $\frac{2{,}0}{0{,}03} \approx 67$.`,
        md`L'urea non viene pompata nell'urina in queste proporzioni: l'aumento di concentrazione riflette soprattutto l'acqua riassorbita lungo il nefrone, che lascia l'urea in un volume molto più piccolo.`,
      ],
      answerMd: md`Le proteine non vengono filtrate; il glucosio è filtrato e riassorbito del tutto; l'urea è filtrata e concentrata circa 67 volte, soprattutto perché gran parte dell'acqua filtrata viene riassorbita. Concludere che il glucosio non è filtrato perché manca nell'urina significa ignorare la colonna del filtrato.`,
    },
    {
      id: 'example-adh-dehydration',
      title: 'Una lunga camminata senza acqua',
      problemMd: md`Dopo ore di cammino al caldo senza bere, il sangue di una persona diventa più concentrato. Prevedere la variazione dell'ADH, dei dotti collettori e dell'urina.`,
      steps: [
        md`Gli osmocettori dell'ipotalamo rilevano l'aumento di concentrazione del sangue.`,
        md`La neuroipofisi libera più ADH nel sangue.`,
        md`L'ADH fa inserire acquaporine nelle membrane delle cellule del dotto collettore, che diventa più permeabile all'acqua.`,
        md`Più acqua passa per osmosi dal dotto alla midollare salata e torna nel sangue, quindi si produce poca urina concentrata e la concentrazione del sangue torna a scendere: feedback negativo.`,
      ],
      answerMd: md`L'ADH aumenta, i dotti collettori diventano più permeabili all'acqua e l'urina diventa scarsa e concentrata. L'errore comune è dire che l'ADH agisce sul glomerulo facendo filtrare meno: agisce sui dotti collettori.`,
    },
  ],
  traps: [
    {
      title: md`Attribuire un enzima alla bile`,
      md: md`La bile emulsiona i grassi e neutralizza l'acido; da sola non digerisce nulla. L'enzima che digerisce i grassi è la lipasi pancreatica.`,
    },
    {
      title: md`Mandare i grassi nella vena porta epatica`,
      md: md`Zuccheri e amminoacidi passano nei capillari dei villi e da lì al fegato. I grassi passano come chilomicroni nei chiliferi, che fanno parte del sistema linfatico.`,
    },
    {
      title: md`Dire che l'urea si forma nel rene`,
      md: md`L'urea si forma nel fegato, con la deaminazione e il ciclo dell'urea. Il rene si limita a filtrarla dal sangue e a eliminarla.`,
    },
    {
      title: md`Scambiare uretere e uretra`,
      md: md`Due ureteri portano l'urina dai reni alla vescica; una sola uretra la porta fuori dal corpo. L'ordine è rene, uretere, vescica, uretra.`,
    },
  ],
  check: [
    {
      id: 'check-pepsinogen',
      title: 'Un enzima attivato dall\'acido',
      topic: 'Anatomia e fisiologia',
      stemMd: md`Quale enzima viene secreto in forma inattiva e attivato dall'acido cloridrico nello stomaco?`,
      options: [
        { id: 'A', text: md`Tripsina`, note: md`Anche la tripsina è secreta inattiva, come tripsinogeno, ma viene attivata nell'intestino tenue dall'enterochinasi, non dall'acido.` },
        { id: 'B', text: md`Amilasi salivare`, note: md`L'amilasi salivare è secreta già attiva e lavora a pH quasi neutro; l'acido gastrico la blocca.` },
        { id: 'C', text: md`Lipasi pancreatica`, note: md`La lipasi è un enzima pancreatico che agisce nell'intestino tenue, dove l'acido è stato neutralizzato.` },
        { id: 'D', text: md`Pepsina`, note: '' },
        { id: 'E', text: md`Maltasi`, note: md`La maltasi è legata ai microvilli dell'intestino tenue e non è prodotta come precursore attivato dall'acido.` },
      ],
      answer: 'D',
      workingMd: md`Le cellule principali dello stomaco secernono pepsinogeno. L'acido cloridrico delle cellule parietali lo converte in pepsina attiva, che lavora meglio al pH basso dello stomaco e avvia la digestione delle proteine.`,
      lesson: md`Le proteasi nascono inattive; la pepsina è attivata dall'acido, la tripsina dall'enterochinasi.`,
    },
    {
      id: 'check-glucose-urine',
      title: 'Glucosio nell\'urina',
      topic: 'Anatomia e fisiologia',
      stemMd: md`Nel diabete mellito non trattato compare glucosio nell'urina. Qual è la spiegazione migliore?`,
      options: [
        { id: 'A', text: md`Viene filtrato così tanto glucosio da superare la velocità massima con cui i trasportatori del tubulo prossimale possono riassorbirlo`, note: '' },
        { id: 'B', text: md`Normalmente il glucosio è troppo grande per essere filtrato, ma la pressione alta lo spinge attraverso il glomerulo`, note: md`Il glucosio è piccolo e viene filtrato liberamente in tutti; normalmente viene poi riassorbito del tutto.` },
        { id: 'C', text: md`Senza insulina il glomerulo non riesce più a trattenere il glucosio nel sangue`, note: md`Il glomerulo non trattiene mai il glucosio, e la filtrazione non dipende dall'insulina.` },
        { id: 'D', text: md`L'ansa di Henle secerne glucosio nel filtrato quando la glicemia è alta`, note: md`L'ansa di Henle gestisce acqua e sali; non secerne glucosio.` },
        { id: 'E', text: md`L'ADH impedisce al dotto collettore di riassorbire il glucosio`, note: md`L'ADH regola la permeabilità all'acqua del dotto collettore; il glucosio viene riassorbito prima, nel tubulo prossimale.` },
      ],
      answer: 'A',
      workingMd: md`Il glucosio è filtrato liberamente, quindi la quantità che entra nel tubulo cresce con la glicemia. Il riassorbimento nel tubulo prossimale dipende da proteine trasportatrici, che hanno una velocità massima. Quando il carico filtrato supera quel massimo, l'eccesso non può essere riassorbito e resta nell'urina.`,
      lesson: md`La filtrazione non è selettiva; ciò che finisce nell'urina dipende da quanto il riassorbimento riesce a recuperare.`,
    },
    {
      id: 'check-adh-blocker',
      title: 'Bloccare i recettori dell\'ADH',
      topic: 'Anatomia e fisiologia',
      stemMd: md`Un farmaco blocca i recettori dell'ADH sulle cellule dei dotti collettori. Qual è l'effetto più probabile sull'urina?`,
      options: [
        { id: 'A', text: md`Poca urina concentrata`, note: md`È l'effetto di una **maggiore** azione dell'ADH; bloccarne i recettori fa l'opposto.` },
        { id: 'B', text: md`Molta urina diluita`, note: '' },
        { id: 'C', text: md`Compare glucosio nell'urina`, note: md`L'ADH non controlla il riassorbimento del glucosio, che avviene nel tubulo prossimale.` },
        { id: 'D', text: md`Compaiono proteine nell'urina`, note: md`Proteine nell'urina indicano un filtro glomerulare danneggiato, su cui l'ADH non agisce.` },
        { id: 'E', text: md`Nessun cambiamento, perché l'ADH agisce sul glomerulo`, note: md`L'ADH agisce sui dotti collettori (e sui tubuli distali), non sulla filtrazione glomerulare.` },
      ],
      answer: 'B',
      workingMd: md`Senza il segnale dell'ADH, nelle membrane del dotto collettore vengono inserite poche acquaporine. I dotti restano poco permeabili all'acqua, quindi se ne riassorbe poca nella midollare e si produce molta urina diluita.`,
      lesson: md`Più effetto dell'ADH significa urina scarsa e concentrata; meno effetto significa urina abbondante e diluita.`,
    },
  ],
  takeaways: [
    md`Ogni enzima ha un'origine, una sede e un substrato: amilasi per l'amido, pepsina e tripsina per le proteine, lipasi per i grassi.`,
    md`La bile non ha enzimi: emulsiona i grassi e aiuta a neutralizzare l'acido gastrico.`,
    md`Zuccheri e amminoacidi vanno nella vena porta epatica; i grassi vanno nei chiliferi come chilomicroni.`,
    md`Il nefrone filtra per dimensione, riassorbe tutto il glucosio e gran parte dell'acqua nel tubulo prossimale e regola l'acqua con l'ADH nel dotto collettore.`,
  ],
  flashcards: [
    { front: md`Pepsina`, back: md`Una proteasi gastrica secreta come pepsinogeno e attivata dall'acido cloridrico; lavora meglio a pH circa 2 e trasforma le proteine in polipeptidi.` },
    { front: md`Che cosa fa la bile`, back: md`Emulsiona i grassi, aumentando la superficie su cui agisce la lipasi, e aiuta a neutralizzare l'acido gastrico. Non contiene enzimi.` },
    { front: md`Dove si assorbono i grassi digeriti`, back: md`Vengono ricomposti in trigliceridi nelle cellule epiteliali, impacchettati in chilomicroni e passati nei chiliferi dei villi.` },
    { front: md`Ultrafiltrazione`, back: md`La pressione alta nel glomerulo spinge acqua e piccoli soluti nella capsula di Bowman; cellule e quasi tutte le proteine restano nel sangue.` },
    { front: md`Dove si riassorbe il glucosio`, back: md`Nel tubulo contorto prossimale, tramite trasportatori (cotrasporto con Na⁺) che hanno una velocità massima; normalmente viene recuperato tutto.` },
    { front: md`Azione dell'ADH sul rene`, back: md`Fa inserire acquaporine nel dotto collettore, così si riassorbe più acqua e si produce un volume minore di urina più concentrata.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-anatomy-physiology' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const humanReproductionAndDevelopmentLessonIt: Lesson = {
  slug: 'human-reproduction-and-development',
  title: 'Riproduzione e sviluppo umano',
  summary: 'Gametogenesi, ormoni del ciclo mestruale, fecondazione, impianto e primo sviluppo, con i circuiti di feedback che li collegano.',
  minutes: 24,
  objectives: [
    md`Confrontare spermatogenesi e oogenesi, compresa la fase della meiosi in cui si trova ogni cellula e il numero di gameti prodotti.`,
    md`Spiegare il controllo ormonale del ciclo mestruale e dell'inizio della gravidanza, con feedback negativo e positivo.`,
    md`Descrivere fecondazione, impianto, foglietti embrionali e ruolo della placenta.`,
  ],
  teachMd: md`
### L'apparato riproduttore maschile

I **testicoli** si trovano nello scroto, a una temperatura un po' inferiore a quella corporea, necessaria alla produzione degli spermatozoi. Gli spermatozoi si formano nei **tubuli seminiferi**, dove le **cellule del Sertoli** nutrono e sostengono le cellule in sviluppo. Tra i tubuli, le **cellule di Leydig** (interstiziali) secernono **testosterone**. Gli spermatozoi maturano nell'**epididimo** e percorrono il **dotto deferente** fino all'uretra; **vescichette seminali**, **prostata** e ghiandole bulbouretrali aggiungono il liquido che forma lo sperma.

Il controllo parte dall'ipotalamo: il **GnRH** fa liberare all'adenoipofisi l'**FSH**, che agisce sulle cellule del Sertoli sostenendo la produzione di spermatozoi, e l'**LH**, che fa secernere testosterone alle cellule di Leydig. Il testosterone (e l'inibina delle cellule del Sertoli) esercita un feedback negativo su ipotalamo e ipofisi.

### La formazione dei gameti

| | Spermatogenesi | Oogenesi |
| --- | --- | --- |
| Quando | Di continuo dalla pubertà | Inizia prima della nascita; dalla pubertà alla menopausa di solito una cellula la completa a ogni ciclo |
| Da una cellula primaria (46 cromosomi) | 4 spermatozoi | 1 cellula uovo e 2 o 3 globuli polari |
| Divisioni | Meiosi I e II si susseguono senza pause | Arresto in profase I fino alla pubertà; nuovo arresto in metafase II |

Nell'oogenesi gli ovociti primari sono già presenti alla nascita, fermi in **profase I**. A ogni ciclo uno di essi, di solito, completa la meiosi I poco prima dell'ovulazione, dando un grande **ovocita secondario** (*secondary oocyte*) e un piccolo primo globulo polare. La cellula liberata all'ovulazione è questo ovocita secondario, fermo in **metafase II**. Completa la meiosi II **solo se vi entra uno spermatozoo**, producendo la cellula uovo e un secondo globulo polare. Le divisioni diseguali concentrano quasi tutto il citoplasma in una sola cellula, che deve nutrire il primo embrione.

### L'apparato femminile e il ciclo mestruale

Le **ovaie** contengono i follicoli; le **tube uterine** (di Falloppio) portano l'ovocita verso l'**utero**, il cui rivestimento interno è l'**endometrio**; la **cervice** si apre nella vagina. Un ciclo tipico dura circa 28 giorni, contati dal primo giorno della mestruazione, anche se la durata varia da donna a donna e da ciclo a ciclo.

1. **Mestruazione** (circa giorni 1–5): l'endometrio si sfalda.
2. **Fase follicolare**: l'**FSH** stimola la crescita dei follicoli; i follicoli in crescita secernono **estrogeni**, che ricostruiscono l'endometrio. All'inizio gli estrogeni in aumento inibiscono FSH e LH.
3. **Ovulazione** (circa il giorno 14 in un ciclo di 28 giorni): quando gli estrogeni restano alti, il loro feedback diventa **positivo**, e un picco di **LH** (*LH surge*, con un po' di FSH) provoca la liberazione dell'ovocita secondario.
4. **Fase luteinica**: il follicolo vuoto diventa il **corpo luteo**, che secerne **progesterone** ed estrogeni. Il progesterone mantiene l'endometrio spesso e pronto all'impianto e, insieme agli estrogeni, inibisce FSH e LH, così nessun nuovo follicolo matura.
5. Se nessun embrione si impianta, il corpo luteo degenera dopo circa 14 giorni, il progesterone cala e l'endometrio si sfalda. L'FSH, liberato dall'inibizione, avvia un nuovo ciclo.

La fase luteinica è abbastanza costante, circa 14 giorni, quindi nei cicli più lunghi o più corti a variare è la fase follicolare.

### La fecondazione e i primi giorni

La fecondazione avviene di solito nella **tuba uterina**. Gli enzimi liberati dall'**acrosoma** dello spermatozoo lo aiutano ad attraversare gli strati che circondano l'ovocita. Quando uno spermatozoo si fonde con l'ovocita, la **reazione corticale** modifica la zona pellucida in modo che nessun altro spermatozoo possa entrare, impedendo la polispermia. L'ovocita completa la meiosi II e i due nuclei aploidi si uniscono in uno **zigote** diploide.

Lo zigote si divide per mitosi mentre scende lungo la tuba (**segmentazione**: le cellule si dividono senza crescere), formando una sfera piena, la **morula**, e poi una **blastocisti** cava. La sua **massa cellulare interna** formerà l'embrione; lo strato esterno, il **trofoblasto**, formerà la parte embrionale della placenta. La blastocisti si **impianta** nell'endometrio circa una settimana dopo la fecondazione.

Il trofoblasto secerne **hCG** (gonadotropina corionica umana), che mantiene in vita il corpo luteo e la sua secrezione di progesterone, così l'endometrio non si sfalda. I test di gravidanza rilevano l'hCG nelle urine. In seguito è la placenta stessa a produrre abbastanza progesterone.

### Foglietti embrionali e placenta

Durante la **gastrulazione** l'embrione forma tre foglietti embrionali (*germ layers*):

| Foglietto | Origina, tra l'altro |
| --- | --- |
| Ectoderma | Epidermide, sistema nervoso |
| Mesoderma | Muscoli, ossa, sangue e cuore, reni |
| Endoderma | Rivestimento di intestino e vie respiratorie, fegato, pancreas |

La **placenta** permette lo scambio di sostanze tra madre e feto senza che il loro sangue si mescoli: ossigeno, glucosio, amminoacidi e alcuni anticorpi (IgG) passano al feto; CO₂ e urea passano alla madre. Le **arterie ombelicali** portano sangue deossigenato dal feto alla placenta, e la **vena ombelicale** riporta sangue ossigenato al feto.

### Parto e gemelli

Al parto la distensione della cervice provoca la liberazione di **ossitocina**, che rafforza le contrazioni dell'utero, che distendono ulteriormente la cervice: un circuito a **feedback positivo** che si chiude con la nascita. La **prolattina** stimola la produzione di latte; l'ossitocina ne provoca l'emissione. I **gemelli identici** (monozigotici) derivano da un solo zigote che si divide e hanno gli stessi geni; i **gemelli non identici** (dizigotici) derivano da due ovociti fecondati da due spermatozoi.
`,
  examples: [
    {
      id: 'example-gamete-count',
      title: 'Contare gameti e cromosomi',
      problemMd: md`100 spermatociti primari e 100 ovociti primari completano la gametogenesi (ogni ovocita viene fecondato, così la meiosi II si conclude). Quanti spermatozoi e quante cellule uovo si ottengono? Quanti cromosomi ha uno spermatocita secondario, e quanti cromatidi?`,
      steps: [
        md`Ogni spermatocita primario compie meiosi I e II e dà 4 spermatozoi: $100 \times 4 = 400$ spermatozoi.`,
        md`Ogni ovocita primario dà una sola cellula uovo, perché entrambe le divisioni sono diseguali e le cellule piccole sono globuli polari: 100 cellule uovo.`,
        md`Uno spermatocita primario ha 46 cromosomi, ciascuno di due cromatidi. La meiosi I separa le coppie di omologhi, quindi ogni spermatocita secondario ha 23 cromosomi.`,
        md`I cromatidi fratelli non si sono ancora separati (lo faranno nella meiosi II), quindi quei 23 cromosomi hanno ancora due cromatidi ciascuno: 46 cromatidi.`,
      ],
      answerMd: md`400 spermatozoi e 100 cellule uovo; uno spermatocita secondario ha 23 cromosomi e 46 cromatidi. Attribuirgli 46 cromosomi significa confondere cromatidi e cromosomi: il dimezzamento del numero di cromosomi avviene nella meiosi I.`,
    },
    {
      id: 'example-ovulation-day',
      title: 'L\'ovulazione in un ciclo più lungo',
      problemMd: md`I cicli di una donna durano regolarmente 32 giorni. Supponendo una fase luteinica di 14 giorni, in quale giorno del ciclo ovula, all'incirca, e quale picco ormonale lo provoca?`,
      steps: [
        md`La fase luteinica va dall'ovulazione alla mestruazione successiva e dura circa 14 giorni, qualunque sia la durata del ciclo.`,
        md`Quindi l'ovulazione cade circa 14 giorni prima dell'inizio del ciclo successivo: $32 - 14 = 18$.`,
        md`Verifica con il ciclo standard: $28 - 14 = 14$, in accordo con l'ovulazione intorno al giorno 14. I 4 giorni in più del ciclo lungo appartengono alla fase follicolare.`,
        md`L'ovulazione è provocata dal picco di LH, dovuto al feedback positivo degli estrogeni alti sull'ipofisi.`,
      ],
      answerMd: md`Intorno al giorno 18, per effetto del picco di LH. Rispondere giorno 14 presuppone che ogni ciclo duri 28 giorni; rispondere giorno 16 divide il ciclo a metà, ma le due fasi non sono uguali.`,
    },
    {
      id: 'example-combined-pill',
      title: 'Come una pillola combinata impedisce l\'ovulazione',
      problemMd: md`Una pillola contraccettiva contiene estrogeni e progesterone di sintesi, assunti ogni giorno. Prevedere l'effetto su FSH, LH e ovulazione.`,
      steps: [
        md`La pillola mantiene estrogeni e progesterone costantemente a livelli simili a quelli della fase luteinica.`,
        md`Nella fase luteinica questi ormoni inibiscono ipotalamo e ipofisi per feedback negativo, quindi FSH e LH restano bassi.`,
        md`Con poco FSH nessun follicolo matura; senza l'aumento di estrogeni di un follicolo in maturazione non c'è il passaggio al feedback positivo né il picco di LH.`,
        md`Senza il picco di LH, nessun ovocita viene liberato.`,
      ],
      answerMd: md`FSH e LH restano bassi e l'ovulazione non avviene. L'errore tentante è pensare che gli estrogeni in più provochino un picco di LH: il picco richiede l'aumento di estrogeni tipico di un follicolo in maturazione, e il progesterone, che mantiene il feedback negativo, è sempre presente.`,
    },
  ],
  traps: [
    {
      title: md`Dire che all'ovulazione viene liberata una cellula uovo matura`,
      md: md`Dall'ovaio esce un ovocita secondario fermo in metafase II. La meiosi II si completa solo dopo che uno spermatozoo vi è entrato.`,
    },
    {
      title: md`Attribuire al progesterone il picco di LH`,
      md: md`Il picco di LH è causato dagli estrogeni alti che passano al feedback positivo. Il progesterone, prodotto dal corpo luteo dopo l'ovulazione, inibisce soprattutto FSH e LH.`,
    },
    {
      title: md`Scambiare cellule di Leydig e del Sertoli`,
      md: md`Le cellule di Leydig, tra i tubuli, rispondono all'LH e producono testosterone. Le cellule del Sertoli, nei tubuli, rispondono all'FSH e sostengono lo sviluppo degli spermatozoi.`,
    },
    {
      title: md`Dire che le arterie ombelicali sono ossigenate`,
      md: md`Le arterie portano il sangue lontano dal cuore, qui quello del feto: le arterie ombelicali portano sangue deossigenato alla placenta, e la vena ombelicale riporta sangue ossigenato.`,
    },
  ],
  check: [
    {
      id: 'check-corpus-luteum',
      title: 'Mantenere in vita il corpo luteo',
      topic: 'Riproduzione ed ereditarietà',
      stemMd: md`Nelle prime settimane di gravidanza, quale ormone mantiene la secrezione di progesterone da parte del corpo luteo, così che l'endometrio non si sfaldi?`,
      options: [
        { id: 'A', text: md`FSH`, note: md`L'FSH stimola la crescita dei follicoli prima dell'ovulazione; in gravidanza resta basso.` },
        { id: 'B', text: md`LH`, note: md`Il picco di LH forma il corpo luteo, ma poi l'LH è tenuto basso dal feedback negativo e non può mantenerlo.` },
        { id: 'C', text: md`Ossitocina`, note: md`L'ossitocina agisce al parto e nell'emissione del latte, non sul corpo luteo.` },
        { id: 'D', text: md`Prolattina`, note: md`La prolattina stimola la produzione di latte; non mantiene il corpo luteo.` },
        { id: 'E', text: md`hCG`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Senza gravidanza il corpo luteo degenera dopo circa 14 giorni. Quando un embrione si impianta, il suo trofoblasto secerne hCG, che mantiene il corpo luteo in vita e attivo nella produzione di progesterone finché la placenta non ne produce abbastanza da sola. I test di gravidanza rilevano proprio l'hCG.`,
      lesson: md`L'hCG, prodotto dall'embrione, è il segnale che salva il corpo luteo.`,
    },
    {
      id: 'check-germ-layer',
      title: 'Da dove viene il sistema nervoso',
      topic: 'Riproduzione ed ereditarietà',
      stemMd: md`Da quale foglietto embrionale si sviluppa il sistema nervoso?`,
      options: [
        { id: 'A', text: md`Ectoderma`, note: '' },
        { id: 'B', text: md`Mesoderma`, note: md`Il mesoderma dà muscoli, ossa, sangue, cuore e reni, non il sistema nervoso.` },
        { id: 'C', text: md`Endoderma`, note: md`L'endoderma dà il rivestimento di intestino e vie respiratorie e organi come fegato e pancreas.` },
        { id: 'D', text: md`Trofoblasto`, note: md`Il trofoblasto non è un foglietto embrionale; forma la parte embrionale della placenta.` },
        { id: 'E', text: md`Massa cellulare interna, prima della gastrulazione`, note: md`La massa cellulare interna dà origine all'intero embrione; il sistema nervoso deriva da uno dei foglietti che essa forma in seguito.` },
      ],
      answer: 'A',
      workingMd: md`La gastrulazione forma ectoderma, mesoderma ed endoderma. L'ectoderma dà l'epidermide e, ripiegandosi nel tubo neurale, encefalo e midollo spinale.`,
      lesson: md`Ectoderma: pelle e nervi; mesoderma: muscoli, ossa, sangue; endoderma: rivestimenti di intestino e vie aeree.`,
    },
    {
      id: 'check-meiosis-ii',
      title: 'Quando finisce la meiosi II',
      topic: 'Riproduzione ed ereditarietà',
      stemMd: md`In una donna, quando si completa la meiosi II di un ovocita?`,
      options: [
        { id: 'A', text: md`Prima della sua nascita, quando si formano gli ovociti primari`, note: md`Prima della nascita gli ovociti primari si fermano in profase I; non hanno ancora completato nemmeno la meiosi I.` },
        { id: 'B', text: md`Alla pubertà, quando iniziano i cicli mestruali`, note: md`La pubertà avvia i cicli in cui si completa la meiosi I, un ovocita alla volta; la meiosi II deve ancora aspettare.` },
        { id: 'C', text: md`Dopo che uno spermatozoo è entrato nell'ovocita secondario`, note: '' },
        { id: 'D', text: md`All'ovulazione, quando l'ovocita lascia il follicolo`, note: md`All'ovulazione l'ovocita secondario è fermo in metafase II; viene liberato prima che la meiosi II si concluda.` },
        { id: 'E', text: md`All'impianto, circa una settimana dopo la fecondazione`, note: md`All'impianto l'embrione è una blastocisti di molte cellule, ben dopo la fine della meiosi.` },
      ],
      answer: 'C',
      workingMd: md`Gli ovociti primari si fermano in profase I prima della nascita. Dalla pubertà, a ogni ciclo un ovocita completa la meiosi I poco prima dell'ovulazione e viene liberato come ovocita secondario fermo in metafase II. La meiosi II si conclude solo quando entra uno spermatozoo, dando la cellula uovo e il secondo globulo polare.`,
      lesson: md`L'oogenesi si ferma due volte: in profase I finché un ciclo non seleziona la cellula, e in metafase II fino alla fecondazione.`,
    },
  ],
  takeaways: [
    md`Uno spermatocita primario dà quattro spermatozoi; un ovocita primario dà una cellula uovo e alcuni globuli polari.`,
    md`All'ovulazione viene liberato un ovocita secondario in metafase II; la meiosi II si conclude con la fecondazione.`,
    md`Gli estrogeni alti passano al feedback positivo e provocano il picco di LH; il progesterone del corpo luteo mantiene l'endometrio.`,
    md`L'hCG dell'embrione mantiene in vita il corpo luteo all'inizio della gravidanza ed è ciò che rilevano i test di gravidanza.`,
    md`L'ectoderma forma pelle e nervi, il mesoderma muscoli, ossa e sangue, l'endoderma il rivestimento dell'intestino.`,
  ],
  flashcards: [
    { front: md`Cellule di Leydig e del Sertoli`, back: md`Le cellule di Leydig rispondono all'LH e secernono testosterone. Le cellule del Sertoli, nei tubuli seminiferi, rispondono all'FSH e sostengono gli spermatozoi in sviluppo.` },
    { front: md`I due arresti dell'oogenesi`, back: md`Gli ovociti primari si fermano in profase I da prima della nascita; l'ovocita secondario liberato all'ovulazione si ferma in metafase II finché non entra uno spermatozoo.` },
    { front: md`Che cosa provoca l'ovulazione`, back: md`Un picco di LH, che si verifica quando gli estrogeni alti del follicolo in maturazione passano a un feedback positivo sull'ipofisi.` },
    { front: md`Ruolo del corpo luteo`, back: md`Secerne progesterone ed estrogeni, che mantengono l'endometrio pronto all'impianto e inibiscono FSH e LH.` },
    { front: md`hCG`, back: md`La gonadotropina corionica umana, prodotta dal trofoblasto dell'embrione; mantiene il corpo luteo attivo nella secrezione di progesterone ed è rilevata dai test di gravidanza.` },
    { front: md`I tre foglietti embrionali`, back: md`Ectoderma: epidermide e sistema nervoso. Mesoderma: muscoli, ossa, sangue, cuore, reni. Endoderma: rivestimento di intestino e vie aeree, fegato, pancreas.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-biology', skill: 'imat-bio-reproduction' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};
