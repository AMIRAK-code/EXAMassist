import { md, type Lesson } from '../../../types';

/**
 * Chimica IMAT, parte 1: la versione italiana di ../chemistry-1.ts, con gli
 * stessi slug, minuti, link di pratica e chiavi delle verifiche.
 */

export const atomicStructureAndElectronConfigurationLessonIt: Lesson = {
  slug: 'atomic-structure-and-electron-configuration',
  title: md`Struttura atomica e configurazione elettronica`,
  summary: md`Conta protoni, neutroni ed elettroni di qualsiasi atomo o ione e scrivi le configurazioni elettroniche, anche degli ioni dei metalli di transizione.`,
  minutes: 20,
  objectives: [
    md`Ricavare il numero di protoni, neutroni ed elettroni di un atomo o di uno ione dal simbolo, dal numero di massa e dalla carica.`,
    md`Spiegare che cosa sono gli isotopi e calcolare una massa atomica relativa dalle abbondanze isotopiche.`,
    md`Scrivere le configurazioni elettroniche dello stato fondamentale con il principio di Aufbau, il principio di Pauli e la regola di Hund, anche per gli ioni dei metalli di transizione.`,
  ],
  teachMd: md`
### Di che cosa è fatto un atomo

Un atomo ha un **nucleo** piccolissimo e denso, formato da protoni e neutroni, circondato dagli elettroni. Quasi tutta la massa sta nel nucleo; quasi tutto il volume è lo spazio occupato dagli elettroni.

| Particella | Carica relativa | Massa relativa | Dove si trova |
| --- | --- | --- | --- |
| protone | $+1$ | $1$ | nucleo |
| neutrone | $0$ | $1$ | nucleo |
| elettrone | $-1$ | circa $\frac{1}{1836}$ | attorno al nucleo |

Due numeri descrivono un nucleo. Il **numero atomico** (*atomic number*) $Z$ è il numero di protoni, e da solo stabilisce di quale elemento si tratta: ogni atomo con 17 protoni è cloro. Il **numero di massa** (*mass number*) $A$ è la somma di protoni e neutroni. Il simbolo $^{A}_{Z}\mathrm{X}$ li riporta entrambi, quindi

$$\text{neutroni} = A - Z$$

Un atomo neutro ha tanti elettroni quanti protoni. Uno ione no: un **catione** ha perso elettroni, un **anione** ne ha acquistati. Per uno ione di carica $q$ il numero di elettroni è $Z - q$. Così $\mathrm{Mg^{2+}}$ ($Z = 12$) ha $12 - 2 = 10$ elettroni e $\mathrm{S^{2-}}$ ($Z = 16$) ne ha $16 + 2 = 18$. La carica cambia solo gli elettroni: le reazioni chimiche ordinarie non toccano protoni e neutroni.

### Isotopi e massa atomica relativa

Gli **isotopi** (*isotopes*) sono atomi dello stesso elemento con un numero diverso di neutroni: stesso $Z$, diverso $A$. Poiché il comportamento chimico dipende dagli elettroni, gli isotopi reagiscono allo stesso modo; differiscono per la massa, e alcuni sono radioattivi.

La massa atomica relativa (*relative atomic mass*) riportata nella tavola periodica è una **media ponderata** delle masse degli isotopi naturali, pesata sulla loro abbondanza. Per questo il cloro ha $35{,}5$, anche se nessun singolo atomo di cloro ha quella massa: il numero di massa è un intero e riguarda un solo nucleo, la massa atomica relativa è una media su moltissimi atomi.

### Livelli, sottolivelli e orbitali

Gli elettroni occupano **orbitali**, regioni in cui è probabile trovarli. Ogni orbitale contiene al massimo due elettroni, con spin opposti (**principio di esclusione di Pauli**: in un atomo due elettroni non possono avere tutti e quattro i numeri quantici uguali).

- Il numero quantico principale $n = 1, 2, 3, \dots$ indica il **livello** (*shell*); un $n$ più alto significa più lontano dal nucleo e più energia.
- Il livello $n$ contiene $n$ **sottolivelli** (*subshells*), indicati da $l = 0, 1, \dots, n-1$ e chiamati s, p, d, f.
- Un sottolivello s ha 1 orbitale, p ne ha 3, d 5, f 7: contengono quindi 2, 6, 10 e 14 elettroni.
- Il livello $n$ ha dunque $n^2$ orbitali e al massimo $2n^2$ elettroni: 2, 8, 18, 32.

Dentro un sottolivello il numero quantico magnetico $m_l$ va da $-l$ a $+l$ (un valore per orbitale), e il numero quantico di spin $m_s$ vale $+\frac{1}{2}$ oppure $-\frac{1}{2}$.

### L'ordine di riempimento: Aufbau e regola di Hund

Nello stato fondamentale gli elettroni riempiono prima gli orbitali a energia più bassa (**principio di Aufbau**). L'ordine è

$$1s,\ 2s,\ 2p,\ 3s,\ 3p,\ 4s,\ 3d,\ 4p,\ 5s,\ 4d,\ 5p,\ 6s,\ 4f,\ 5d,\ 6p$$

Una regola per ricostruirlo: si riempie in ordine crescente di $n + l$ e, a parità, prima il sottolivello con $n$ minore. Per questo $4s$ ($n + l = 4$) si riempie prima di $3d$ ($n + l = 5$).

La **regola di Hund** (*Hund's rule*) stabilisce come si occupa un sottolivello parzialmente pieno: gli elettroni si distribuiscono sugli orbitali di uguale energia con spin paralleli prima di appaiarsi. L'azoto ($1s^2\,2s^2\,2p^3$) ha tre elettroni 2p spaiati, uno per orbitale p; l'ossigeno ($2p^4$) deve appaiarne uno, e ha due elettroni spaiati.

Le configurazioni lunghe si abbreviano con il gas nobile precedente tra parentesi quadre: il sodio è $[\mathrm{Ne}]\,3s^1$, il ferro ($Z = 26$) è $[\mathrm{Ar}]\,3d^6\,4s^2$.

### Configurazioni e tavola periodica

La tavola è costruita su queste configurazioni. Il numero del periodo è il livello più alto occupato; il blocco s (gruppi 1 e 2), il blocco p (gruppi da 13 a 18) e il blocco d (gruppi da 3 a 12) prendono il nome dal sottolivello che si sta riempiendo. Per gli elementi dei gruppi principali gli elettroni del livello esterno (di valenza) si ricavano dal gruppo: 1 e 2 per i gruppi 1 e 2, il numero del gruppo meno 10 per i gruppi da 13 a 18. Gli elementi dello stesso gruppo hanno la stessa configurazione esterna, ed è per questo che reagiscono in modo simile.

### Gli ioni dei metalli di transizione

Quando un metallo di transizione forma un catione, perde **prima gli elettroni 4s**, anche se il 4s si è riempito per primo. Una volta occupati gli orbitali 3d, gli elettroni 4s sono i più esterni e i più facili da togliere. Così il ferro(II) è $[\mathrm{Ar}]\,3d^6$ e il ferro(III) è $[\mathrm{Ar}]\,3d^5$, non $[\mathrm{Ar}]\,3d^4\,4s^2$.

### Due eccezioni da sapere

Il cromo è $[\mathrm{Ar}]\,3d^5\,4s^1$ e il rame è $[\mathrm{Ar}]\,3d^{10}\,4s^1$, non $3d^4\,4s^2$ e $3d^9\,4s^2$ come prevederebbe l'ordine di riempimento. Un sottolivello d semipieno o completo è particolarmente stabile, abbastanza da spostarvi un elettrone dal 4s.

### Senza calcolatrice

Nessuna norma dell'IMAT consente la calcolatrice, e queste domande non ne hanno bisogno. Contare le particelle è una sottrazione; una massa atomica relativa è una media ponderata, più comoda se si scrivono le abbondanze come frazioni, per esempio $\frac{3}{4}$ e $\frac{1}{4}$.
`,
  examples: [
    {
      id: 'example-iron-ion-particles',
      title: md`Contare le particelle in uno ione`,
      problemMd: md`Quanti protoni, neutroni ed elettroni ci sono in $^{56}_{26}\mathrm{Fe^{3+}}$?`,
      steps: [
        md`Il numero in basso è $Z$: 26 protoni. Per il ferro non cambia mai.`,
        md`I neutroni sono $A - Z = 56 - 26 = 30$.`,
        md`La carica $+3$ indica che sono stati persi tre elettroni: $26 - 3 = 23$ elettroni.`,
        md`Verifica: protoni meno elettroni fa $26 - 23 = +3$, la carica indicata.`,
      ],
      answerMd: md`26 protoni, 30 neutroni e 23 elettroni. L'errore tipico è aggiungere 3 elettroni (29): una carica positiva significa che elettroni sono stati tolti.`,
    },
    {
      id: 'example-iron-configuration',
      title: md`Il ferro e lo ione ferro(II)`,
      problemMd: md`Scrivi le configurazioni dello stato fondamentale di $\mathrm{Fe}$ ($Z = 26$) e di $\mathrm{Fe^{2+}}$, e indica quanti elettroni spaiati ha $\mathrm{Fe^{2+}}$.`,
      steps: [
        md`Riempi in ordine: $1s^2\,2s^2\,2p^6\,3s^2\,3p^6$ sono 18 elettroni, il nocciolo dell'argon. Poi $4s^2$ (20) e $3d^6$ (26). Quindi $\mathrm{Fe} = [\mathrm{Ar}]\,3d^6\,4s^2$.`,
        md`Per il catione togli prima i due elettroni 4s: $\mathrm{Fe^{2+}} = [\mathrm{Ar}]\,3d^6$, con 24 elettroni, come richiede $26 - 2$.`,
        md`Disponi sei elettroni nei cinque orbitali d secondo Hund: uno per orbitale (5), poi il sesto si appaia in uno di essi.`,
        md`Restano una coppia e quattro elettroni singoli.`,
      ],
      answerMd: md`$\mathrm{Fe} = [\mathrm{Ar}]\,3d^6\,4s^2$ e $\mathrm{Fe^{2+}} = [\mathrm{Ar}]\,3d^6$, con 4 elettroni spaiati. Togliendo invece elettroni 3d si ottiene l'errata $[\mathrm{Ar}]\,3d^4\,4s^2$.`,
    },
    {
      id: 'example-chlorine-mass',
      title: md`La massa atomica relativa del cloro`,
      problemMd: md`Il cloro naturale è per il 75% cloro-35 e per il 25% cloro-37. Prendendo come massa di ciascun isotopo il suo numero di massa, calcola la massa atomica relativa del cloro.`,
      steps: [
        md`Scrivi le abbondanze come frazioni: $\frac{3}{4}$ e $\frac{1}{4}$.`,
        md`Media ponderata: $\frac{3}{4} \times 35 + \frac{1}{4} \times 37 = \frac{105 + 37}{4} = \frac{142}{4}$.`,
        md`$\frac{142}{4} = 35{,}5$. Seconda strada: parti da 35 e aggiungi $\frac{1}{4}$ dei 2 punti di distanza dal cloro-37: $35 + 0{,}5 = 35{,}5$.`,
      ],
      answerMd: md`La massa atomica relativa è $35{,}5$. La media semplice di 35 e 37, cioè 36, ignora che il cloro-35 è tre volte più abbondante.`,
    },
  ],
  traps: [
    {
      title: md`Aggiungere elettroni a un catione`,
      md: md`Una carica positiva significa elettroni **persi**. $\mathrm{Na^{+}}$ ha 10 elettroni, non 12. Scrivi elettroni $= Z - q$ e sostituisci la carica con il suo segno: per $\mathrm{O^{2-}}$, $8 - (-2) = 10$.`,
    },
    {
      title: md`Togliere gli elettroni 3d prima dei 4s`,
      md: md`L'ordine di riempimento non è l'ordine di rimozione. Un metallo di transizione perde prima gli elettroni 4s, quindi $\mathrm{Cu^{2+}}$ è $[\mathrm{Ar}]\,3d^9$ e $\mathrm{Mn^{2+}}$ è $[\mathrm{Ar}]\,3d^5$. Scrivi l'atomo neutro, poi togli il 4s.`,
    },
    {
      title: md`Confondere numero di massa e massa atomica relativa`,
      md: md`Il numero di massa riguarda un solo nucleo ed è un intero. La massa atomica relativa della tavola è una media sugli isotopi e di solito non è intera. Non calcolare mai i neutroni da un valore come $35{,}5$: usa il numero di massa dell'isotopo specifico.`,
    },
    {
      title: md`Dimenticare cromo e rame`,
      md: md`L'ordine di riempimento prevede $3d^4\,4s^2$ per il cromo e $3d^9\,4s^2$ per il rame. Sono entrambe sbagliate: il cromo è $3d^5\,4s^1$ e il rame $3d^{10}\,4s^1$. Se tra le opzioni compare la versione prevista, è lì per farti sbagliare.`,
    },
  ],
  check: [
    {
      id: 'check-identify-species',
      title: md`Quale specie?`,
      topic: md`Struttura atomica`,
      stemMd: md`Una specie ha 17 protoni, 18 neutroni e 18 elettroni. Quale?`,
      options: [
        { id: 'A', text: md`$^{35}_{17}\mathrm{Cl}$`, note: md`L'atomo neutro ha 17 elettroni, uno in meno della specie descritta.` },
        { id: 'B', text: md`$^{35}_{17}\mathrm{Cl^{-}}$`, note: '' },
        { id: 'C', text: md`$^{37}_{17}\mathrm{Cl^{-}}$`, note: md`La carica è giusta, ma i neutroni sono $37 - 17 = 20$, non 18.` },
        { id: 'D', text: md`$^{35}_{17}\mathrm{Cl^{+}}$`, note: md`Uno ione positivo ha perso un elettrone: 16 elettroni. Il segno della carica è invertito.` },
        { id: 'E', text: md`$^{36}_{18}\mathrm{Ar}$`, note: md`Ha 18 neutroni e 18 elettroni, ma 18 protoni: è il numero di protoni a fissare l'elemento, e 17 protoni significa cloro.` },
      ],
      answer: 'B',
      workingMd: md`17 protoni significa cloro. Il numero di massa è $17 + 18 = 35$. Diciotto elettroni sono uno in più dei protoni, quindi la carica è $17 - 18 = -1$: lo ione cloruro $^{35}_{17}\mathrm{Cl^{-}}$.`,
      lesson: md`I protoni fissano l'elemento, protoni più neutroni danno il numero di massa, l'eccesso o il difetto di elettroni dà la carica.`,
    },
    {
      id: 'check-cobalt-ion',
      title: md`La configurazione di uno ione di transizione`,
      topic: md`Configurazione elettronica`,
      stemMd: md`Qual è la configurazione elettronica dello stato fondamentale di $\mathrm{Co^{2+}}$? (Il cobalto ha $Z = 27$.)`,
      options: [
        { id: 'A', text: md`$[\mathrm{Ar}]\,3d^5\,4s^2$`, note: md`Toglie due elettroni 3d e lascia il 4s; gli elettroni 4s si perdono per primi.` },
        { id: 'B', text: md`$[\mathrm{Ar}]\,3d^7\,4s^2$`, note: md`È l'atomo di cobalto neutro, con 27 elettroni: non è stato tolto nulla.` },
        { id: 'C', text: md`$[\mathrm{Ar}]\,3d^7$`, note: '' },
        { id: 'D', text: md`$[\mathrm{Ar}]\,3d^6\,4s^1$`, note: md`Il numero di elettroni (25) è giusto, ma un elettrone è stato tolto dal 3d; entrambi devono venire dal 4s.` },
        { id: 'E', text: md`$[\mathrm{Ar}]\,3d^8$`, note: md`Ha 26 elettroni, come se ne fosse stato tolto uno solo.` },
      ],
      answer: 'C',
      workingMd: md`Cobalto neutro: $18 + 2 + 7 = 27$ elettroni, $[\mathrm{Ar}]\,3d^7\,4s^2$. Lo ione 2+ ha 25 elettroni, ed entrambi gli elettroni tolti vengono dal 4s: $[\mathrm{Ar}]\,3d^7$.`,
      lesson: md`Per un catione di un metallo di transizione scrivi prima l'atomo neutro, poi togli gli elettroni dal 4s prima che dal 3d.`,
    },
    {
      id: 'check-shell-capacity',
      title: md`Quanti elettroni in un livello?`,
      topic: md`Struttura atomica`,
      stemMd: md`Qual è il numero massimo di elettroni che può contenere il livello con numero quantico principale $n = 3$?`,
      options: [
        { id: 'A', text: md`6`, note: md`Sei è la capienza del solo sottolivello 3p; il livello contiene anche 3s e 3d.` },
        { id: 'B', text: md`8`, note: md`Il terzo periodo ha 8 elementi perché il 3d si riempie solo dopo il 4s, ma il livello in sé può contenerne di più.` },
        { id: 'C', text: md`9`, note: md`Nove è il numero di orbitali, $n^2$; ogni orbitale contiene due elettroni.` },
        { id: 'D', text: md`18`, note: '' },
        { id: 'E', text: md`32`, note: md`32 è la capienza del livello $n = 4$, che comprende il sottolivello 4f.` },
      ],
      answer: 'D',
      workingMd: md`Il livello 3 ha i sottolivelli 3s, 3p e 3d, con $1 + 3 + 5 = 9$ orbitali. A due elettroni per orbitale fanno 18, in accordo con $2n^2 = 2 \times 9$.`,
      lesson: md`Un livello contiene $2n^2$ elettroni; la lunghezza di un periodo è un altro numero.`,
    },
  ],
  takeaways: [
    md`$Z$ = protoni e fissa l'elemento; $A - Z$ = neutroni; elettroni $= Z - q$ per uno ione di carica $q$.`,
    md`Gli isotopi differiscono solo per i neutroni; la massa atomica relativa è la loro media pesata sulle abbondanze.`,
    md`I sottolivelli s, p, d e f contengono 2, 6, 10 e 14 elettroni; il livello $n$ ne contiene $2n^2$.`,
    md`Si riempie per $n + l$ crescente (4s prima di 3d), si distribuiscono gli elettroni prima di appaiarli, e un metallo di transizione che forma un catione perde prima gli elettroni 4s.`,
    md`Il cromo è $3d^5\,4s^1$ e il rame $3d^{10}\,4s^1$.`,
  ],
  flashcards: [
    { front: md`Numero atomico e numero di massa`, back: md`Il numero atomico $Z$ è il numero di protoni e identifica l'elemento. Il numero di massa $A$ è protoni più neutroni, quindi neutroni $= A - Z$.` },
    { front: md`Isotopi`, back: md`Atomi dello stesso elemento (stesso numero di protoni) con un numero diverso di neutroni. Reagiscono allo stesso modo ma hanno massa diversa.` },
    { front: md`Capienza dei sottolivelli s, p, d e f`, back: md`Hanno 1, 3, 5 e 7 orbitali, quindi contengono 2, 6, 10 e 14 elettroni. Il livello n ne contiene 2n².` },
    { front: md`Regola di Hund`, back: md`In un sottolivello di orbitali con la stessa energia, gli elettroni occupano orbitali diversi con spin paralleli prima che un orbitale ne accolga due.` },
    { front: md`Quali elettroni perde per primi un metallo di transizione?`, back: md`Gli elettroni 4s, prima di qualsiasi elettrone 3d: $\mathrm{Fe^{3+}}$ è $[\mathrm{Ar}]\,3d^5$.` },
    { front: md`Configurazioni di cromo e rame`, back: md`Il cromo è $[\mathrm{Ar}]\,3d^5\,4s^1$ e il rame $[\mathrm{Ar}]\,3d^{10}\,4s^1$: un sottolivello d semipieno o completo è particolarmente stabile.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-atoms-periodic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const periodicTableTrendsLessonIt: Lesson = {
  slug: 'periodic-table-trends',
  title: md`Le proprietà periodiche`,
  summary: md`Prevedi raggio atomico e ionico, energia di ionizzazione ed elettronegatività dalla posizione di un elemento, e spiega le eccezioni più chieste.`,
  minutes: 18,
  objectives: [
    md`Spiegare l'andamento di raggio atomico, energia di ionizzazione ed elettronegatività lungo un periodo e lungo un gruppo con la carica nucleare e lo schermo.`,
    md`Ordinare per dimensione ioni isoelettronici.`,
    md`Leggere una serie di energie di ionizzazione successive per trovare il gruppo di un elemento, e spiegare i cali dell'energia di prima ionizzazione ai gruppi 13 e 16.`,
  ],
  teachMd: md`
### Un'unica idea dietro tutte le tendenze

La tavola periodica è ordinata per numero atomico, in **periodi** (righe) e **gruppi** (colonne). Quasi tutte le tendenze (*periodic trends*) che servono nascono da un unico equilibrio: quanto forte il nucleo attira gli elettroni esterni.

Due fattori determinano questa attrazione. La **carica nucleare** (il numero di protoni) attira gli elettroni verso l'interno. Gli elettroni interni **schermano** quelli esterni da una parte di quella carica. Ciò che un elettrone esterno sente è la **carica nucleare efficace** (*effective nuclear charge*), più o meno la carica nucleare meno lo schermo dei livelli interni.

- **Lungo un periodo**, a ogni passo si aggiungono un protone e un elettrone nello *stesso* livello. Gli elettroni dello stesso livello si schermano poco a vicenda, quindi la carica nucleare efficace cresce e gli elettroni esterni sono trattenuti più saldamente.
- **Lungo un gruppo**, scendendo, a ogni passo si aggiunge un livello intero. Gli elettroni esterni sono più lontani e più schermati, quindi trattenuti meno, anche se il nucleo ha più protoni.

Con queste due frasi in mente, le tendenze che seguono vengono da sé.

### Raggio atomico

Il raggio atomico **diminuisce lungo un periodo** (attrazione più forte, stesso livello) e **aumenta scendendo lungo un gruppo** (più livelli). Il sodio è più grande del cloro; il cesio più grande del litio. L'errore comune è pensare che più elettroni significhino un atomo più grande: lungo un periodo gli elettroni in più vanno nello stesso livello mentre l'attrazione cresce.

### Raggio ionico

Un **catione** è più piccolo del suo atomo: ha perso gli elettroni esterni, spesso un intero livello, e quelli rimasti sentono lo stesso nucleo. Un **anione** è più grande del suo atomo: gli elettroni in più si respingono nello stesso livello mentre la carica nucleare resta la stessa.

Per specie **isoelettroniche** (*isoelectronic*, con lo stesso numero di elettroni) quella con più protoni è la più piccola. Gli ioni $\mathrm{O^{2-}}$, $\mathrm{F^{-}}$, $\mathrm{Na^{+}}$ e $\mathrm{Mg^{2+}}$ hanno tutti 10 elettroni, con 8, 9, 11 e 12 protoni, quindi i loro raggi diminuiscono in quest'ordine.

### Energia di ionizzazione

L'**energia di prima ionizzazione** (*first ionisation energy*) è l'energia necessaria per togliere un elettrone a ciascun atomo di una mole di atomi allo stato gassoso:

$$\mathrm{X(g)} \rightarrow \mathrm{X^{+}(g)} + e^{-}$$

In generale **aumenta lungo un periodo** e **diminuisce scendendo lungo un gruppo**, l'opposto del raggio atomico, per lo stesso motivo. I gas nobili hanno il valore più alto del loro periodo; l'elio il più alto in assoluto.

Due cali interrompono la crescita lungo il periodo, e sono domande frequenti:

- **Dal gruppo 2 al gruppo 13** (dal berillio al boro, dal magnesio all'alluminio): l'elettrone tolto al boro sta in un orbitale 2p, a energia più alta del 2s e in parte schermato dagli elettroni 2s, quindi si toglie più facilmente.
- **Dal gruppo 15 al gruppo 16** (dall'azoto all'ossigeno, dal fosforo allo zolfo): il quarto elettrone 2p dell'ossigeno deve condividere un orbitale con un altro elettrone. La repulsione nella coppia lo rende più facile da togliere di qualsiasi elettrone del $2p^3$ semipieno dell'azoto.

### Energie di ionizzazione successive

Ogni elettrone successivo è più difficile da togliere del precedente, perché lascia uno ione sempre più positivo. L'aumento è graduale dentro un livello e fa un **salto** quando l'elettrone successivo deve venire da un livello più vicino al nucleo. Conta gli elettroni tolti prima del grande salto: è il numero di elettroni del livello esterno, e per un elemento dei gruppi principali indica il gruppo.

### Elettronegatività

L'**elettronegatività** (*electronegativity*) è la capacità di un atomo, in un legame, di attirare gli elettroni condivisi. Nella scala di Pauling il fluoro ha il valore più alto (circa 4,0), seguito dall'ossigeno (circa 3,4), con azoto e cloro vicini a 3,0. **Aumenta lungo un periodo** e **diminuisce scendendo lungo un gruppo**, quindi gli elementi meno elettronegativi sono in basso a sinistra (cesio, francio). I gas nobili di solito non si considerano, perché formano legami di rado.

L'elettronegatività non coincide con l'**affinità elettronica** (*electron affinity*), l'energia liberata quando un atomo gassoso acquista un elettrone. Le tendenze sono simili, ma l'affinità elettronica si misura su atomi isolati, mentre l'elettronegatività descrive atomi legati. È il cloro, non il fluoro, a liberare più energia quando acquista un elettrone.

### Carattere metallico

Il carattere metallico (la tendenza a cedere elettroni) **diminuisce lungo un periodo** e **aumenta scendendo lungo un gruppo**. I metalli stanno a sinistra e in basso, i non metalli a destra e in alto, con i semimetalli (boro, silicio, germanio, arsenico e altri) lungo il confine. Questo prevede anche il carattere degli ossidi: gli ossidi dei metalli, come $\mathrm{Na_2O}$, sono basici; quelli dei non metalli, come $\mathrm{SO_3}$, sono acidi.

### Un riepilogo da portare con sé

| Proprietà | Lungo un periodo (da sinistra a destra) | Scendendo lungo un gruppo |
| --- | --- | --- |
| raggio atomico | diminuisce | aumenta |
| energia di prima ionizzazione | aumenta (cala ai gruppi 13 e 16) | diminuisce |
| elettronegatività | aumenta | diminuisce |
| carattere metallico | diminuisce | aumenta |
`,
  examples: [
    {
      id: 'example-isoelectronic-ions',
      title: md`Ordinare ioni isoelettronici`,
      problemMd: md`Ordina $\mathrm{Na^{+}}$, $\mathrm{Mg^{2+}}$, $\mathrm{F^{-}}$ e $\mathrm{O^{2-}}$ dal più grande al più piccolo.`,
      steps: [
        md`Conta gli elettroni: $11 - 1$, $12 - 2$, $9 + 1$ e $8 + 2$ fanno tutti 10. Gli ioni sono isoelettronici, quindi cambia solo il numero di protoni.`,
        md`Più protoni attirano più saldamente gli stessi 10 elettroni, e lo ione è più piccolo. Protoni: O 8, F 9, Na 11, Mg 12.`,
        md`Ordina per protoni, dal minore, per avere prima il più grande: $\mathrm{O^{2-}} > \mathrm{F^{-}} > \mathrm{Na^{+}} > \mathrm{Mg^{2+}}$.`,
      ],
      answerMd: md`$\mathrm{O^{2-}} > \mathrm{F^{-}} > \mathrm{Na^{+}} > \mathrm{Mg^{2+}}$. L'errore allettante è mettere per primi gli ioni di sodio e magnesio perché gli atomi sono grandi: quegli ioni hanno perso l'intero terzo livello.`,
    },
    {
      id: 'example-successive-ie',
      title: md`Trovare il gruppo dalle energie di ionizzazione`,
      problemMd: md`Un elemento del terzo periodo ha queste prime quattro energie di ionizzazione, in kJ/mol (arrotondate): 740, 1450, 7730, 10540. In quale gruppo si trova, e di quale elemento si tratta?`,
      steps: [
        md`Guarda i rapporti tra valori vicini: $1450$ è circa il doppio di $740$, ma $7730$ è più di cinque volte $1450$. Il grande salto è tra il secondo e il terzo valore.`,
        md`Quindi due elettroni si tolgono con relativa facilità; il terzo deve venire dal secondo livello, più interno.`,
        md`Due elettroni esterni significa gruppo 2. Nel terzo periodo il gruppo 2 è il magnesio, $[\mathrm{Ne}]\,3s^2$.`,
      ],
      answerMd: md`Gruppo 2: magnesio. Guardare il valore più alto (10540) invece del salto più grande porterebbe, a torto, al quarto elettrone.`,
    },
    {
      id: 'example-ie-dips',
      title: md`Perché l'ossigeno sta sotto l'azoto`,
      problemMd: md`L'energia di prima ionizzazione dell'azoto (circa 1400 kJ/mol) è più alta di quella dell'ossigeno (circa 1310 kJ/mol), anche se l'ossigeno ha più protoni. Spiega perché.`,
      steps: [
        md`Scrivi l'occupazione dei 2p. L'azoto è $2p^3$: un elettrone per orbitale p, tutti spaiati (regola di Hund). L'ossigeno è $2p^4$: un orbitale contiene una coppia.`,
        md`I due elettroni che condividono un orbitale si respingono. Questa repulsione rende uno dei due più facile da togliere.`,
        md`L'effetto supera quello del protone in più, quindi l'ossigeno perde il primo elettrone più facilmente dell'azoto.`,
      ],
      answerMd: md`Il primo elettrone dell'ossigeno viene da un orbitale 2p doppiamente occupato, e la repulsione tra elettroni abbassa l'energia necessaria. "L'ossigeno ha più protoni, quindi il suo valore deve essere più alto" applica la tendenza senza la sua eccezione.`,
    },
  ],
  traps: [
    {
      title: md`Più elettroni, atomo più grande`,
      md: md`Lungo un periodo l'atomo acquista elettroni ma si rimpicciolisce, perché entrano nello stesso livello mentre la carica nucleare cresce. Le dimensioni aumentano solo quando si aggiunge un livello, scendendo lungo un gruppo.`,
    },
    {
      title: md`Ignorare la carica degli ioni`,
      md: md`Confrontare $\mathrm{K^{+}}$ e $\mathrm{Cl^{-}}$ in base alle dimensioni degli atomi dà la risposta sbagliata. Sono isoelettronici (18 elettroni), e il potassio ha 19 protoni contro i 17 del cloro, quindi $\mathrm{K^{+}}$ è il più piccolo. Conta prima gli elettroni, poi confronta i protoni.`,
    },
    {
      title: md`Credere che l'energia di ionizzazione cresca senza interruzioni`,
      md: md`Lungo il secondo periodo l'energia di prima ionizzazione cala al boro e all'ossigeno. Un'opzione che mette il berillio sopra il boro, o l'azoto sopra l'ossigeno, è corretta: non scartarla perché viola la tendenza generale.`,
    },
    {
      title: md`Trattare elettronegatività e affinità elettronica come la stessa cosa`,
      md: md`Il fluoro è l'elemento più elettronegativo, ma è il cloro ad avere l'affinità elettronica più esotermica. Rispondi sulla proprietà che la domanda nomina.`,
    },
  ],
  check: [
    {
      id: 'check-highest-ie',
      title: md`L'energia di prima ionizzazione più alta`,
      topic: md`Proprietà periodiche`,
      stemMd: md`Quale di questi elementi del secondo periodo ha l'energia di prima ionizzazione più alta?`,
      options: [
        { id: 'A', text: md`Litio`, note: md`Il litio ha il valore più basso dell'elenco: il suo unico elettrone 2s è lontano da un nucleo di soli 3 protoni e ben schermato.` },
        { id: 'B', text: md`Boro`, note: md`Il boro sta persino sotto il berillio, perché il suo elettrone viene da un orbitale 2p; è molto sotto l'azoto.` },
        { id: 'C', text: md`Carbonio`, note: md`Il carbonio segue la tendenza crescente, ma ha un protone in meno dell'azoto e nessuna stabilità particolare che lo compensi.` },
        { id: 'D', text: md`Azoto`, note: '' },
        { id: 'E', text: md`Ossigeno`, note: md`Applica "aumenta lungo il periodo" senza l'eccezione: l'elettrone 2p appaiato dell'ossigeno si toglie più facilmente di quelli dell'azoto.` },
      ],
      answer: 'D',
      workingMd: md`L'energia di ionizzazione cresce lungo il secondo periodo, quindi la scelta è tra azoto e ossigeno. Il $2p^4$ dell'ossigeno ha un elettrone appaiato, e la repulsione nella coppia lo rende più facile da togliere di qualsiasi elettrone del $2p^3$ semipieno dell'azoto. L'azoto ha il valore più alto.`,
      lesson: md`Lungo un periodo l'energia di prima ionizzazione cresce, tranne i cali ai gruppi 13 e 16.`,
    },
    {
      id: 'check-ion-radii',
      title: md`Ordinare i raggi ionici`,
      topic: md`Proprietà periodiche`,
      stemMd: md`Quale elenco ordina gli ioni dal raggio più grande al più piccolo?`,
      options: [
        { id: 'A', text: md`$\mathrm{Ca^{2+}} > \mathrm{K^{+}} > \mathrm{Cl^{-}} > \mathrm{S^{2-}}$`, note: md`È l'ordine esattamente opposto: più protoni per gli stessi 18 elettroni rendono uno ione più piccolo, non più grande.` },
        { id: 'B', text: md`$\mathrm{S^{2-}} > \mathrm{Cl^{-}} > \mathrm{K^{+}} > \mathrm{Ca^{2+}}$`, note: '' },
        { id: 'C', text: md`$\mathrm{K^{+}} > \mathrm{Ca^{2+}} > \mathrm{S^{2-}} > \mathrm{Cl^{-}}$`, note: md`Usa le dimensioni degli atomi (i metalli del quarto periodo sono atomi grandi) e ignora che i cationi hanno perso il quarto livello.` },
        { id: 'D', text: md`$\mathrm{Cl^{-}} > \mathrm{S^{2-}} > \mathrm{K^{+}} > \mathrm{Ca^{2+}}$`, note: md`I cationi sono giusti, ma lo zolfo, con un protone in meno del cloro, trattiene meno gli stessi 18 elettroni ed è più grande.` },
        { id: 'E', text: md`$\mathrm{S^{2-}} > \mathrm{Cl^{-}} > \mathrm{Ca^{2+}} > \mathrm{K^{+}}$`, note: md`Gli anioni sono giusti, ma il calcio ha 20 protoni contro i 19 del potassio, quindi $\mathrm{Ca^{2+}}$ è il catione più piccolo.` },
      ],
      answer: 'B',
      workingMd: md`Tutti e quattro gli ioni hanno 18 elettroni: $16 + 2$, $17 + 1$, $19 - 1$ e $20 - 2$. A parità di elettroni, più protoni significa uno ione più piccolo. Protoni: S 16, Cl 17, K 19, Ca 20, quindi i raggi diminuiscono in quest'ordine.`,
      lesson: md`Per ioni isoelettronici ordina per protoni: meno protoni, ione più grande.`,
    },
    {
      id: 'check-ie-jump',
      title: md`Quale elemento?`,
      topic: md`Proprietà periodiche`,
      stemMd: md`Un elemento del terzo periodo ha queste prime quattro energie di ionizzazione, in kJ/mol: 578, 1817, 2745, 11577. Quale elemento è?`,
      options: [
        { id: 'A', text: md`Sodio`, note: md`Il sodio ha un solo elettrone esterno, quindi il suo grande salto è tra il primo e il secondo valore.` },
        { id: 'B', text: md`Magnesio`, note: md`Il salto del magnesio arriva dopo due elettroni; qui il passaggio dal secondo al terzo valore è meno del doppio.` },
        { id: 'C', text: md`Alluminio`, note: '' },
        { id: 'D', text: md`Silicio`, note: md`Il silicio ha quattro elettroni esterni, quindi il suo quarto valore sarebbe ancora nella parte graduale; il salto arriverebbe al quinto.` },
        { id: 'E', text: md`Fosforo`, note: md`Il fosforo ha cinque elettroni esterni e nessun salto fino alla sesta energia di ionizzazione.` },
      ],
      answer: 'C',
      workingMd: md`Confronta i valori vicini: 1817 è circa 3 volte 578 e 2745 circa 1,5 volte 1817, entrambi graduali, ma 11577 è più di 4 volte 2745. Il salto arriva dopo il terzo elettrone, quindi gli elettroni esterni sono tre: gruppo 13. Nel terzo periodo è l'alluminio, $[\mathrm{Ne}]\,3s^2\,3p^1$.`,
      lesson: md`Il numero di elettroni tolti prima del salto più grande è il numero di elettroni del livello esterno.`,
    },
  ],
  takeaways: [
    md`Lungo un periodo la carica nucleare efficace cresce: gli atomi si rimpiccioliscono, energia di ionizzazione ed elettronegatività aumentano.`,
    md`Scendendo lungo un gruppo si aggiunge un livello: gli atomi crescono, energia di ionizzazione ed elettronegatività diminuiscono.`,
    md`I cationi sono più piccoli e gli anioni più grandi dei loro atomi; tra ioni isoelettronici, più protoni significa più piccolo.`,
    md`L'energia di prima ionizzazione cala ai gruppi 13 e 16; un salto nelle energie di ionizzazione successive rivela il numero di elettroni esterni.`,
  ],
  flashcards: [
    { front: md`Carica nucleare efficace`, back: md`La carica positiva netta che sente un elettrone esterno: la carica nucleare meno lo schermo degli elettroni interni. Cresce lungo un periodo.` },
    { front: md`Andamento del raggio atomico`, back: md`Diminuisce lungo un periodo (stesso livello, attrazione più forte) e aumenta scendendo lungo un gruppo (un livello in più a ogni passo).` },
    { front: md`Ioni isoelettronici: qual è il più piccolo?`, back: md`Quello con più protoni, perché attira più saldamente lo stesso numero di elettroni.` },
    { front: md`I due cali dell'energia di prima ionizzazione`, back: md`Dal gruppo 2 al 13 (l'elettrone viene da un orbitale p a energia più alta) e dal gruppo 15 al 16 (l'elettrone è appaiato e respinto dal compagno).` },
    { front: md`Leggere le energie di ionizzazione successive`, back: md`Trova il salto più grande. Il numero di elettroni tolti prima del salto è il numero di elettroni del livello esterno, che dà il gruppo di un elemento dei gruppi principali.` },
    { front: md`L'elemento più elettronegativo`, back: md`Il fluoro, circa 4,0 nella scala di Pauling. L'elettronegatività aumenta lungo un periodo e diminuisce scendendo lungo un gruppo.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-atoms-periodic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const chemicalBondingAndMolecularShapeLessonIt: Lesson = {
  slug: 'chemical-bonding-and-molecular-shape',
  title: md`Legami chimici e geometria molecolare`,
  summary: md`Distingui legame ionico, covalente e metallico, prevedi la forma delle molecole con la VSEPR e stabilisci se una molecola è polare.`,
  minutes: 22,
  objectives: [
    md`Classificare un legame come ionico, covalente polare o covalente apolare in base all'elettronegatività, e descrivere il legame metallico e il legame dativo.`,
    md`Prevedere la forma e l'angolo di legame approssimato di una piccola molecola o di uno ione con la teoria VSEPR.`,
    md`Stabilire se una molecola è polare dalla polarità dei legami e dalla forma, e contarne i legami sigma e pi greco.`,
  ],
  teachMd: md`
### Perché gli atomi si legano

Gli atomi si legano perché la disposizione legata ha energia più bassa degli atomi separati. Per gli elementi dei gruppi principali una guida utile è la **regola dell'ottetto** (*octet rule*): gli atomi tendono ad acquistare, cedere o condividere elettroni fino ad averne otto nel livello esterno (due per l'idrogeno). È una guida, non una legge, come mostrano le eccezioni più sotto.

### Il legame ionico

Quando un metallo con bassa energia di ionizzazione incontra un non metallo molto elettronegativo, gli elettroni vengono **trasferiti**. Il sodio cede un elettrone al cloro, si formano $\mathrm{Na^{+}}$ e $\mathrm{Cl^{-}}$, e gli ioni sono tenuti insieme da un'attrazione elettrostatica in tutte le direzioni. Il risultato è un **reticolo cristallino** (*lattice*), non molecole: la formula $\mathrm{NaCl}$ indica il rapporto tra gli ioni. I solidi ionici hanno punti di fusione alti, spesso si sciolgono in acqua e conducono la corrente solo fusi o in soluzione, quando gli ioni sono liberi di muoversi.

### Il legame covalente

Tra non metalli gli elettroni sono **condivisi**: una coppia condivisa è un legame semplice, due coppie un legame doppio, tre coppie un legame triplo. Se i due atomi hanno la stessa elettronegatività, come in $\mathrm{Cl_2}$, la coppia è condivisa in modo uguale e il legame è **apolare** (*non-polar*). Altrimenti la coppia si sposta verso l'atomo più elettronegativo, che porta una parziale carica negativa ($\delta^{-}$): il legame è **polare**.

La differenza di elettronegatività dà una classificazione approssimata nella scala di Pauling: sotto circa 0,4, covalente apolare; da circa 0,4 a circa 1,8, covalente polare; sopra circa 1,8, prevalentemente ionico. I confini sono convenzioni e i libri li collocano in modo leggermente diverso: il legame è un continuo.

Un legame **dativo** (*dative* o *coordinate bond*) è un legame covalente in cui entrambi gli elettroni condivisi provengono da un solo atomo. Il doppietto libero dell'ammoniaca si lega a $\mathrm{H^{+}}$ formando $\mathrm{NH_4^{+}}$. Una volta formato, il legame dativo è identico agli altri: i quattro legami N–H dello ione ammonio sono equivalenti.

### Il legame metallico

In un metallo gli atomi cedono gli elettroni esterni a un "mare" di **elettroni delocalizzati** che si muovono in un reticolo di ioni positivi. Questo spiega perché i metalli conducono elettricità e calore e perché sono malleabili: gli strati possono scorrere senza che il legame si rompa.

### Ordine, lunghezza ed energia di legame

| Legame | Coppie condivise | Sigma (σ) | Pi greco (π) |
| --- | --- | --- | --- |
| semplice | 1 | 1 | 0 |
| doppio | 2 | 1 | 1 |
| triplo | 3 | 1 | 2 |

Il primo legame tra due atomi è sempre un legame **sigma**, formato dalla sovrapposizione frontale degli orbitali. I legami in più sono legami **pi greco**, dalla sovrapposizione laterale di orbitali p. Tra gli stessi due atomi un legame triplo è più corto e più forte di un doppio, e un doppio più di un semplice.

### Le eccezioni all'ottetto

Il boro in $\mathrm{BF_3}$ ha solo sei elettroni esterni. Gli atomi centrali dal terzo periodo in poi, più grandi, possono superare gli otto (**ottetto espanso**, *expanded octet*): il fosforo in $\mathrm{PCl_5}$ ne ha dieci, lo zolfo in $\mathrm{SF_6}$ dodici.

### VSEPR: prevedere la forma

La teoria VSEPR (repulsione delle coppie elettroniche del guscio di valenza) dice che i domini elettronici attorno a un atomo centrale (legami e doppietti liberi) si respingono e si dispongono il più lontano possibile. Un legame doppio o triplo conta come **un solo** dominio.

1. Conta i domini attorno all'atomo centrale: atomi legati più doppietti liberi.
2. Il numero di domini dà la disposizione degli elettroni.
3. La **forma** si nomina dalle sole posizioni degli atomi: i doppietti liberi ci sono, ma non compaiono nel nome.

| Domini | Doppietti liberi | Forma | Angolo | Esempio |
| --- | --- | --- | --- | --- |
| 2 | 0 | lineare | 180° | $\mathrm{CO_2}$ |
| 3 | 0 | trigonale planare | 120° | $\mathrm{BF_3}$ |
| 3 | 1 | piegata | poco meno di 120° | $\mathrm{SO_2}$ |
| 4 | 0 | tetraedrica | 109,5° | $\mathrm{CH_4}$ |
| 4 | 1 | piramidale triangolare | circa 107° | $\mathrm{NH_3}$ |
| 4 | 2 | piegata | circa 104,5° | $\mathrm{H_2O}$ |
| 5 | 0 | bipiramidale triangolare | 90° e 120° | $\mathrm{PCl_5}$ |
| 6 | 0 | ottaedrica | 90° | $\mathrm{SF_6}$ |

I doppietti liberi respingono più delle coppie di legame: per questo gli angoli di ammoniaca e acqua scendono sotto 109,5°.

Il numero di domini dà anche l'**ibridazione** dell'atomo centrale: 2 domini sp, 3 domini sp², 4 domini sp³.

### La molecola è polare?

Una molecola è polare se i dipoli dei suoi legami **non si annullano**. Servono sia legami polari sia una forma che li lasci sbilanciati.

- $\mathrm{CO_2}$ ha due legami C=O polari, ma puntano in direzioni opposte su una retta e si annullano: apolare.
- $\mathrm{H_2O}$ ha due legami O–H polari a circa 104,5°: si sommano, polare.
- $\mathrm{CCl_4}$ è un tetraedro simmetrico: apolare. Sostituendo un cloro con un idrogeno, come in $\mathrm{CHCl_3}$, la simmetria si rompe: polare.

Le forme simmetriche con atomi uguali in ogni posizione (lineare, trigonale planare, tetraedrica, ottaedrica) danno molecole apolari. I doppietti liberi sull'atomo centrale rendono quasi sempre la molecola polare.
`,
  examples: [
    {
      id: 'example-ammonia-shape',
      title: md`La forma dell'ammoniaca`,
      problemMd: md`Prevedi la forma e l'angolo H–N–H approssimato di $\mathrm{NH_3}$, e stabilisci se è polare.`,
      steps: [
        md`L'azoto ha 5 elettroni esterni. Tre sono usati nei legami con l'idrogeno; gli altri due formano un doppietto libero.`,
        md`Domini: 3 legami + 1 doppietto libero = 4, quindi la disposizione degli elettroni è tetraedrica.`,
        md`Nominando la forma dai soli atomi: un azoto con tre idrogeni sotto di sé è **piramidale triangolare**. Il doppietto libero stringe l'angolo da 109,5° a circa 107°.`,
        md`I legami N–H sono polari (l'azoto è più elettronegativo) e la piramide non è simmetrica, quindi i dipoli si sommano.`,
      ],
      answerMd: md`Piramidale triangolare, circa 107°, polare. "Trigonale planare" è la risposta sbagliata che nasce dal contare solo i tre legami dimenticando il doppietto libero.`,
    },
    {
      id: 'example-co2-so2',
      title: md`Anidride carbonica e anidride solforosa a confronto`,
      problemMd: md`Sia $\mathrm{CO_2}$ sia $\mathrm{SO_2}$ hanno un atomo centrale legato a due atomi di ossigeno. Spiega perché una è lineare e apolare e l'altra piegata e polare.`,
      steps: [
        md`In $\mathrm{CO_2}$ il carbonio usa tutti e quattro gli elettroni esterni in due legami doppi e non ha doppietti liberi: 2 domini, lineare, 180°.`,
        md`I due dipoli C=O sono uguali e opposti, quindi si annullano: $\mathrm{CO_2}$ è apolare.`,
        md`In $\mathrm{SO_2}$ lo zolfo ha 6 elettroni esterni; dopo essersi legato ai due ossigeni conserva un doppietto libero. Domini: 2 atomi legati + 1 doppietto libero = 3, quindi la molecola è piegata, poco meno di 120°.`,
        md`In una molecola piegata i due dipoli S–O non puntano in direzioni opposte, quindi non si annullano: $\mathrm{SO_2}$ è polare.`,
      ],
      answerMd: md`Il doppietto libero sullo zolfo rende $\mathrm{SO_2}$ piegata e polare; il carbonio di $\mathrm{CO_2}$ non ne ha, quindi la molecola è lineare e apolare. Giudicando la polarità dai soli legami, sarebbero polari tutte e due.`,
    },
    {
      id: 'example-classify-bonds',
      title: md`Classificare i legami con l'elettronegatività`,
      problemMd: md`Con le elettronegatività di Pauling Na 0,9, H 2,2 e Cl 3,2, classifica il legame in $\mathrm{NaCl}$, $\mathrm{HCl}$ e $\mathrm{Cl_2}$.`,
      steps: [
        md`$\mathrm{NaCl}$: differenza $3{,}2 - 0{,}9 = 2{,}3$, sopra circa 1,8: prevalentemente ionico.`,
        md`$\mathrm{HCl}$: differenza $3{,}2 - 2{,}2 = 1{,}0$: covalente polare, con $\delta^{-}$ sul cloro.`,
        md`$\mathrm{Cl_2}$: differenza $0$: covalente apolare.`,
      ],
      answerMd: md`Ionico, covalente polare e covalente apolare. Dire che $\mathrm{HCl}$ è ionico perché in acqua forma ioni confonde ciò che accade in soluzione con il legame nella molecola gassosa.`,
    },
  ],
  traps: [
    {
      title: md`Legami polari, quindi molecola polare`,
      md: md`$\mathrm{CO_2}$, $\mathrm{BF_3}$ e $\mathrm{CCl_4}$ hanno tutte legami polari e sono molecole apolari, perché la simmetria annulla i dipoli. Disegna sempre la forma prima di decidere.`,
    },
    {
      title: md`Includere i doppietti liberi nel nome della forma`,
      md: md`L'acqua ha quattro domini elettronici, quindi la disposizione degli elettroni è tetraedrica, ma la sua **forma** è piegata. I doppietti liberi fissano gli angoli; non entrano nel nome della forma.`,
    },
    {
      title: md`Contare un legame doppio come due domini`,
      md: md`Nella VSEPR un legame doppio o triplo è un solo dominio. Contare i due legami doppi di $\mathrm{CO_2}$ come quattro domini porterebbe, a torto, a una disposizione tetraedrica.`,
    },
    {
      title: md`Contare ogni trattino come un legame sigma`,
      md: md`Un legame triplo è un legame sigma e due pi greco. In $\mathrm{C_2H_4}$ ci sono cinque legami sigma (quattro C–H e uno C–C) e un legame pi greco, non sei legami sigma.`,
    },
  ],
  check: [
    {
      id: 'check-polar-molecule',
      title: md`Quale molecola è polare?`,
      topic: md`Polarità delle molecole`,
      stemMd: md`Quale di queste molecole è polare?`,
      options: [
        { id: 'A', text: md`$\mathrm{CO_2}$`, note: md`I legami C=O sono polari, ma la molecola è lineare e i due dipoli si annullano.` },
        { id: 'B', text: md`$\mathrm{BF_3}$`, note: md`Il boro non ha doppietti liberi; la forma trigonale planare annulla i tre dipoli B–F.` },
        { id: 'C', text: md`$\mathrm{CCl_4}$`, note: md`Quattro dipoli C–Cl uguali ad angoli tetraedrici si annullano esattamente.` },
        { id: 'D', text: md`$\mathrm{CH_4}$`, note: md`I legami C–H sono appena polari, e il tetraedro simmetrico li annulla comunque.` },
        { id: 'E', text: md`$\mathrm{NH_3}$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Ciascuna delle altre quattro molecole ha una forma simmetrica, con atomi uguali attorno a un atomo centrale senza doppietti liberi, quindi i dipoli dei legami si annullano. Il doppietto libero dell'ammoniaca la rende piramidale triangolare; i suoi tre legami N–H polari puntano dalla stessa parte e danno un dipolo netto.`,
      lesson: md`Una molecola è polare solo se i dipoli dei legami non si annullano: controlla la forma, non solo i legami.`,
    },
    {
      id: 'check-pcl3-shape',
      title: md`La forma del tricloruro di fosforo`,
      topic: md`Geometria molecolare`,
      stemMd: md`Qual è la forma della molecola $\mathrm{PCl_3}$?`,
      options: [
        { id: 'A', text: md`Trigonale planare`, note: md`Conta i tre legami P–Cl e dimentica il doppietto libero del fosforo.` },
        { id: 'B', text: md`Piramidale triangolare`, note: '' },
        { id: 'C', text: md`A T`, note: md`La forma a T richiede cinque domini, due dei quali doppietti liberi; qui il fosforo ha quattro domini.` },
        { id: 'D', text: md`Tetraedrica`, note: md`Tetraedrica è la disposizione dei quattro domini elettronici; la forma si nomina dai soli atomi.` },
        { id: 'E', text: md`Piegata`, note: md`Una molecola piegata ha solo due atomi legati al centro; qui il fosforo ne lega tre.` },
      ],
      answer: 'B',
      workingMd: md`Il fosforo ha 5 elettroni esterni: tre formano i legami con il cloro e due un doppietto libero. Ne risultano 4 domini, disposti a tetraedro, e con una posizione occupata dal doppietto libero gli atomi formano una piramide triangolare, come nell'ammoniaca.`,
      lesson: md`Conta i doppietti liberi per trovare la disposizione, poi nomina la forma dai soli atomi.`,
    },
    {
      id: 'check-hcn-bonds',
      title: md`Legami sigma e pi greco in HCN`,
      topic: md`Legame chimico`,
      stemMd: md`L'acido cianidrico ha struttura H–C≡N. Quanti legami sigma e pi greco contiene?`,
      options: [
        { id: 'A', text: md`2 sigma e 2 pi greco`, note: '' },
        { id: 'B', text: md`1 sigma e 3 pi greco`, note: md`Tratta come pi greco tutte e tre le coppie condivise del triplo, lasciando sigma solo il legame H–C; un legame triplo contiene sempre un legame sigma.` },
        { id: 'C', text: md`3 sigma e 1 pi greco`, note: md`Un legame triplo ha un solo legame sigma; le altre due coppie condivise sono legami pi greco.` },
        { id: 'D', text: md`4 sigma e 0 pi greco`, note: md`Conta ogni trattino come un legame sigma.` },
        { id: 'E', text: md`2 sigma e 1 pi greco`, note: md`Dà al legame C≡N un solo legame pi greco, come avrebbe un legame doppio.` },
      ],
      answer: 'A',
      workingMd: md`Il legame semplice H–C è un legame sigma. Il triplo C≡N è un legame sigma e due pi greco. In totale: 2 sigma e 2 pi greco.`,
      lesson: md`Ogni legame tra due atomi contiene esattamente un legame sigma; le coppie condivise in più sono legami pi greco.`,
    },
  ],
  takeaways: [
    md`Il legame ionico trasferisce elettroni, quello covalente li condivide, quello metallico li delocalizza.`,
    md`La differenza di elettronegatività fissa la polarità del legame: grosso modo sotto 0,4 apolare, fino a circa 1,8 covalente polare, oltre prevalentemente ionico.`,
    md`VSEPR: conta atomi legati e doppietti liberi, trova la disposizione, poi nomina la forma dai soli atomi.`,
    md`Una molecola è polare solo se i dipoli dei legami non si annullano; i doppietti liberi sull'atomo centrale di solito la rendono polare.`,
    md`Un legame semplice è un legame sigma; il doppio aggiunge un pi greco, il triplo due.`,
  ],
  flashcards: [
    { front: md`Legame dativo (di coordinazione)`, back: md`Un legame covalente in cui un atomo fornisce entrambi gli elettroni, come quando il doppietto libero dell'ammoniaca si lega a $\mathrm{H^{+}}$. Una volta formato è identico agli altri legami covalenti.` },
    { front: md`Forma VSEPR con 4 domini e 1 doppietto libero`, back: md`Piramidale triangolare, con angoli di circa 107°, come in $\mathrm{NH_3}$.` },
    { front: md`Forma VSEPR con 4 domini e 2 doppietti liberi`, back: md`Piegata, con un angolo di circa 104,5°, come in $\mathrm{H_2O}$.` },
    { front: md`Perché CO₂ è apolare?`, back: md`È lineare, quindi i suoi due dipoli C=O, uguali e polari, puntano in direzioni opposte e si annullano.` },
    { front: md`Legami sigma e pi greco in un legame triplo`, back: md`Un legame sigma (sovrapposizione frontale) e due legami pi greco (sovrapposizione laterale di orbitali p).` },
    { front: md`Ibridazione dal numero di domini`, back: md`Due domini: sp. Tre domini: sp². Quattro domini: sp³.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-bonding' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const intermolecularForcesAndStatesOfMatterLessonIt: Lesson = {
  slug: 'intermolecular-forces-and-states-of-matter',
  title: md`Forze intermolecolari, stati della materia e gas`,
  summary: md`Ordina i punti di ebollizione in base alle forze intermolecolari, spiega i passaggi di stato e usa le leggi dei gas e pV = nRT senza calcolatrice.`,
  minutes: 22,
  objectives: [
    md`Riconoscere le forze intermolecolari di una sostanza (dispersione, dipolo–dipolo, legame a idrogeno) e usarle per ordinare i punti di ebollizione.`,
    md`Descrivere i quattro tipi di solido e che cosa accade a energia e temperatura durante un passaggio di stato.`,
    md`Applicare l'equazione generale dei gas e l'equazione di stato dei gas perfetti, con le temperature in kelvin.`,
  ],
  teachMd: md`
### Forze dentro e tra le molecole

Le forze **intramolecolari** sono i legami dentro una molecola. Le forze **intermolecolari** (*intermolecular forces*) sono le attrazioni, molto più deboli, tra una molecola e l'altra. Quando l'acqua bolle, i legami O–H restano intatti: le molecole vengono solo allontanate l'una dall'altra. I punti di fusione e di ebollizione delle sostanze molecolari misurano quindi le forze intermolecolari.

### Le tre forze intermolecolari

- Le **forze di dispersione di London** (*London dispersion forces*) agiscono tra tutte le molecole. Gli elettroni si muovono, quindi in ogni istante una molecola ha un piccolo dipolo temporaneo, che ne induce uno nella molecola vicina. Crescono con il numero di elettroni (grosso modo, con la massa molare) e con la superficie di contatto: una molecola lunga e lineare ha più contatto di una compatta e ramificata con la stessa formula.
- Le **forze dipolo–dipolo** agiscono tra molecole polari, le cui estremità permanenti $\delta^{+}$ e $\delta^{-}$ si attraggono.
- Il **legame a idrogeno** (*hydrogen bond*) è un'attrazione dipolo–dipolo particolarmente forte. Richiede un atomo di idrogeno legato a **N, O o F** e un doppietto libero su un atomo di N, O o F di una molecola vicina. L'atomo piccolo e molto elettronegativo lascia l'idrogeno quasi scoperto, che viene attirato con forza dal doppietto.

Per molecole piccole di dimensioni simili l'ordine abituale di intensità è dispersione < dipolo–dipolo < legame a idrogeno, e tutte e tre sono molto più deboli dei legami covalenti. Per molecole grandi la dispersione può superare le altre due: lo iodio, $\mathrm{I_2}$, è apolare eppure è solido a temperatura ambiente.

### Ordinare i punti di ebollizione

1. Confronta prima molecole di dimensioni simili e cerca il legame a idrogeno, poi la polarità.
2. Tra molecole con lo stesso tipo di forze, più elettroni significa dispersione più forte e punto di ebollizione più alto: $\mathrm{F_2} < \mathrm{Cl_2} < \mathrm{Br_2} < \mathrm{I_2}$.

Gli idruri del gruppo 16 mostrano bene l'effetto del legame a idrogeno. L'acqua bolle a 100 °C, mentre l'acido solfidrico, molecola più grande ma senza legami a idrogeno, bolle a circa −60 °C. Il legame a idrogeno spiega anche perché il ghiaccio galleggia: nel ghiaccio ogni molecola è legata con legami a idrogeno ad altre quattro in un reticolo aperto, meno denso dell'acqua liquida.

Una trappola: una molecola può contenere idrogeno e ossigeno e non formare legami a idrogeno con sé stessa. Nell'etere dimetilico, $\mathrm{CH_3OCH_3}$, ogni idrogeno è legato al carbonio. In $\mathrm{HCl}$ l'idrogeno è legato al cloro, che non è N, O o F.

### Solidi, liquidi e gas

In un **solido** le particelle vibrano attorno a posizioni fisse; in un **liquido** restano a contatto ma scorrono le une sulle altre; in un **gas** sono lontane e si muovono liberamente. I solidi sono di quattro tipi:

| Tipo | Particelle e forze | Comportamento tipico | Esempio |
| --- | --- | --- | --- |
| ionico | ioni, legami ionici | punto di fusione alto; conduce fuso o in soluzione | $\mathrm{NaCl}$ |
| molecolare | molecole, forze intermolecolari | punto di fusione basso; non conduce | ghiaccio, $\mathrm{I_2}$ |
| covalente (reticolare) | atomi, legami covalenti ovunque | punto di fusione altissimo; molto duro | diamante, $\mathrm{SiO_2}$ |
| metallico | cationi tra elettroni delocalizzati | conduce allo stato solido; malleabile | rame |

### Passaggi di stato

Durante la fusione o l'ebollizione la temperatura resta **costante** mentre si assorbe calore: l'energia serve a vincere le forze intermolecolari, non ad aumentare la velocità delle particelle. Quell'energia è il calore latente (entalpia) di fusione o di vaporizzazione.

Le molecole di un liquido sfuggono di continuo nel vapore sovrastante; la pressione che quel vapore esercita all'equilibrio è la **tensione di vapore** (*vapour pressure*), che aumenta con la temperatura. Un liquido **bolle** quando la sua tensione di vapore uguaglia la pressione esterna. Per questo in alta montagna, dove la pressione dell'aria è più bassa, l'acqua bolle sotto i 100 °C, e in una pentola a pressione sopra i 100 °C.

### I gas e l'equazione di stato

La teoria cinetica descrive un gas come particelle piccolissime in moto disordinato, senza forze tra loro se non durante gli urti. La loro energia cinetica media è proporzionale alla **temperatura assoluta**, in kelvin: $T(\mathrm{K}) = t(°\mathrm{C}) + 273$. Ogni legge dei gas richiede i kelvin.

| Legge | Costanti | Relazione |
| --- | --- | --- |
| Boyle | $n$, $T$ | $p_1V_1 = p_2V_2$ |
| Charles | $n$, $p$ | $\frac{V_1}{T_1} = \frac{V_2}{T_2}$ |
| Gay-Lussac | $n$, $V$ | $\frac{p_1}{T_1} = \frac{p_2}{T_2}$ |
| Avogadro | $p$, $T$ | $V \propto n$ |

Si combinano nell'**equazione generale dei gas** per una quantità fissa di gas e nell'**equazione di stato dei gas perfetti** (*ideal gas law*):

$$\frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2} \qquad\qquad pV = nRT$$

La costante dei gas vale $R = 8{,}314\ \mathrm{J\,mol^{-1}\,K^{-1}}$ con $p$ in pascal e $V$ in metri cubi, oppure circa $0{,}082\ \mathrm{L\,atm\,mol^{-1}\,K^{-1}}$ con $p$ in atmosfere e $V$ in litri. Scegli il valore adatto alle unità della domanda. Conversioni utili: $1\ \mathrm{L} = 10^{-3}\ \mathrm{m^3}$ e $1\ \mathrm{atm} = 101{,}3\ \mathrm{kPa}$.

A 0 °C e 1 atm una mole di qualsiasi gas perfetto occupa circa **22,4 L**, qualunque sia il gas. (Alcuni libri usano 100 kPa come pressione standard, che dà 22,7 L; usa il valore dato dalla domanda.)

In una miscela ogni gas esercita la propria **pressione parziale**, e la pressione totale è la loro somma (legge di Dalton). La pressione parziale di un gas è la sua frazione molare per la pressione totale.

I gas reali seguono meglio queste leggi a bassa pressione e alta temperatura, quando le particelle sono lontane e le forze tra loro contano meno.
`,
  examples: [
    {
      id: 'example-rank-boiling',
      title: md`Ordinare i punti di ebollizione`,
      problemMd: md`Ordina $\mathrm{CH_4}$, $\mathrm{HCl}$ e $\mathrm{H_2O}$ dal punto di ebollizione più basso al più alto.`,
      steps: [
        md`$\mathrm{CH_4}$ è apolare (un tetraedro simmetrico): solo forze di dispersione.`,
        md`$\mathrm{HCl}$ è polare, quindi ha forze dipolo–dipolo oltre alla dispersione. Il cloro non è N, O o F, quindi niente legame a idrogeno.`,
        md`$\mathrm{H_2O}$ ha idrogeni legati all'ossigeno e due doppietti liberi sull'ossigeno: legame a idrogeno, la forza più intensa delle tre.`,
        md`Ordinando per la forza più intensa presente: $\mathrm{CH_4} < \mathrm{HCl} < \mathrm{H_2O}$. I valori reali concordano: circa −161 °C, −85 °C e 100 °C.`,
      ],
      answerMd: md`$\mathrm{CH_4} < \mathrm{HCl} < \mathrm{H_2O}$. Ordinare solo per massa molare (16, 36,5 e 18) metterebbe a torto $\mathrm{HCl}$ al primo posto.`,
    },
    {
      id: 'example-combined-gas-law',
      title: md`Cambiare insieme temperatura e pressione`,
      problemMd: md`Un gas occupa 4,0 L a 27 °C e 1,0 atm. Viene scaldato a 177 °C e compresso a 2,0 atm. Qual è il nuovo volume?`,
      steps: [
        md`Converti in kelvin: $T_1 = 27 + 273 = 300\ \mathrm{K}$ e $T_2 = 177 + 273 = 450\ \mathrm{K}$.`,
        md`Ricava dall'equazione generale: $V_2 = V_1 \times \frac{p_1}{p_2} \times \frac{T_2}{T_1}$.`,
        md`Sostituisci: $V_2 = 4{,}0 \times \frac{1{,}0}{2{,}0} \times \frac{450}{300} = 4{,}0 \times 0{,}5 \times 1{,}5 = 3{,}0\ \mathrm{L}$.`,
        md`Controllo di buon senso: raddoppiare la pressione dimezza il volume (2,0 L); scaldare di un fattore 1,5 lo porta poi a 3,0 L.`,
      ],
      answerMd: md`Il nuovo volume è 3,0 L. Con le temperature in gradi Celsius si otterrebbe $4{,}0 \times 0{,}5 \times \frac{177}{27}$, circa 13 L, che è sbagliato.`,
    },
    {
      id: 'example-ideal-gas-moles',
      title: md`Le moli da pV = nRT`,
      problemMd: md`Una bombola da 10,0 L contiene ossigeno a 2,46 atm e 27 °C. Con $R = 0{,}082\ \mathrm{L\,atm\,mol^{-1}\,K^{-1}}$, trova la quantità di ossigeno in moli e la sua massa.`,
      steps: [
        md`Temperatura in kelvin: $27 + 273 = 300\ \mathrm{K}$.`,
        md`Ricava: $n = \frac{pV}{RT} = \frac{2{,}46 \times 10{,}0}{0{,}082 \times 300}$.`,
        md`Numeratore: $24{,}6$. Denominatore: $0{,}082 \times 300 = 24{,}6$. Quindi $n = 1{,}00\ \mathrm{mol}$.`,
        md`Massa: l'ossigeno gassoso è $\mathrm{O_2}$, $M = 32\ \mathrm{g/mol}$, quindi la massa è $32\ \mathrm{g}$.`,
      ],
      answerMd: md`1,00 mol, cioè 32 g, di ossigeno. Usando 16 g/mol (ossigeno atomico) si otterrebbero 16 g: l'ossigeno gassoso è biatomico.`,
    },
  ],
  traps: [
    {
      title: md`Usare i gradi Celsius in una legge dei gas`,
      md: md`Le leggi dei gas sono proporzioni nella temperatura assoluta. Passare da 20 °C a 40 °C non raddoppia nulla: in kelvin è da 293 K a 313 K, un aumento di meno del 7%. Aggiungi 273 prima di dividere.`,
    },
    {
      title: md`Pensare che l'ebollizione rompa i legami covalenti`,
      md: md`Facendo bollire l'acqua si ottiene vapore acqueo, non idrogeno e ossigeno. Si vincono solo le attrazioni tra le molecole. Un'opzione che spiega un punto di ebollizione con "la forza del legame O–H" è una trappola.`,
    },
    {
      title: md`Vedere legami a idrogeno ovunque ci siano H e O`,
      md: md`L'idrogeno deve essere legato direttamente a N, O o F. L'etere dimetilico, le aldeidi e $\mathrm{CH_3F}$ non formano legami a idrogeno con sé stessi, anche se possono riceverne dall'acqua.`,
    },
    {
      title: md`Usare 22,4 L per tutto`,
      md: md`22,4 L per mole valgono solo per un gas a 0 °C e 1 atm. Non valgono per i liquidi come l'acqua, né per i gas a temperatura ambiente (circa 24 L tra 20 e 25 °C). Quando le condizioni sono diverse, usa $pV = nRT$.`,
    },
  ],
  check: [
    {
      id: 'check-highest-bp',
      title: md`Il punto di ebollizione più alto`,
      topic: md`Forze intermolecolari`,
      stemMd: md`Queste sostanze hanno masse molari simili, tra 44 e 51 g/mol. Quale ha il punto di ebollizione più alto?`,
      options: [
        { id: 'A', text: md`Propano, $\mathrm{CH_3CH_2CH_3}$`, note: md`Il propano è apolare, con sole forze di dispersione: è quello con il punto di ebollizione più basso.` },
        { id: 'B', text: md`Etere dimetilico, $\mathrm{CH_3OCH_3}$`, note: md`Ha la stessa formula dell'etanolo, ma ogni idrogeno è legato al carbonio, quindi le sue molecole non formano legami a idrogeno tra loro.` },
        { id: 'C', text: md`Clorometano, $\mathrm{CH_3Cl}$`, note: md`Ha la massa molare più grande ed è polare, ma le forze dipolo–dipolo sono più deboli del legame a idrogeno.` },
        { id: 'D', text: md`Etanale, $\mathrm{CH_3CHO}$`, note: md`L'etanale è polare, ma i suoi idrogeni sono tutti legati al carbonio, quindi non c'è legame a idrogeno tra le sue molecole.` },
        { id: 'E', text: md`Etanolo, $\mathrm{CH_3CH_2OH}$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Con masse molari così vicine le forze di dispersione sono simili, e decide il tipo di forza. Solo l'etanolo ha un gruppo O–H, quindi solo l'etanolo forma legami a idrogeno tra le sue molecole: bolle a circa 78 °C, mentre tutti gli altri bollono sotto circa 21 °C.`,
      lesson: md`Tra molecole di dimensioni simili il legame a idrogeno batte la polarità, e la polarità batte la sola dispersione.`,
    },
    {
      id: 'check-rigid-container',
      title: md`Scaldare un recipiente chiuso`,
      topic: md`Leggi dei gas`,
      stemMd: md`Un gas in un recipiente chiuso e rigido è a 27 °C e 150 kPa. Viene scaldato a 127 °C. Qual è la nuova pressione?`,
      options: [
        { id: 'A', text: md`Circa 706 kPa`, note: md`Moltiplica per $\frac{127}{27}$, usando i gradi Celsius invece dei kelvin.` },
        { id: 'B', text: md`250 kPa`, note: md`Aggiunge 100 kPa per i 100 gradi di aumento; la pressione è proporzionale alla temperatura assoluta, non cresce dello stesso numero.` },
        { id: 'C', text: md`200 kPa`, note: '' },
        { id: 'D', text: md`150 kPa`, note: md`Un recipiente rigido mantiene costante il volume, non la pressione; scaldando il gas la pressione sale.` },
        { id: 'E', text: md`112,5 kPa`, note: md`Inverte il rapporto, moltiplicando per $\frac{300}{400}$, come se scaldando la pressione diminuisse.` },
      ],
      answer: 'C',
      workingMd: md`A volume e quantità costanti, $\frac{p_1}{T_1} = \frac{p_2}{T_2}$. In kelvin $T_1 = 300\ \mathrm{K}$ e $T_2 = 400\ \mathrm{K}$, quindi $p_2 = 150 \times \frac{400}{300} = 150 \times \frac{4}{3} = 200\ \mathrm{kPa}$.`,
      lesson: md`Converti prima in kelvin; poi, a volume costante, la pressione è proporzionale alla temperatura.`,
    },
    {
      id: 'check-hydrogen-bonding',
      title: md`Dove ci sono legami a idrogeno?`,
      topic: md`Forze intermolecolari`,
      stemMd: md`In quale sostanza pura si formano legami a idrogeno tra le molecole?`,
      options: [
        { id: 'A', text: md`$\mathrm{H_2S}$`, note: md`Lo zolfo non è abbastanza elettronegativo né abbastanza piccolo; l'acido solfidrico ha solo forze dipolo–dipolo e di dispersione.` },
        { id: 'B', text: md`$\mathrm{NH_3}$`, note: '' },
        { id: 'C', text: md`$\mathrm{CH_3F}$`, note: md`Il fluoro c'è, ma gli idrogeni sono legati al carbonio, non al fluoro.` },
        { id: 'D', text: md`$\mathrm{HCl}$`, note: md`L'idrogeno è legato al cloro, che non è N, O o F; l'attrazione è dipolo–dipolo.` },
        { id: 'E', text: md`$\mathrm{HCHO}$`, note: md`Il metanale ha un doppietto libero sull'ossigeno ma nessun idrogeno legato all'ossigeno, quindi le sue molecole non formano legami a idrogeno tra loro.` },
      ],
      answer: 'B',
      workingMd: md`Un legame a idrogeno tra molecole uguali richiede H legato direttamente a N, O o F e un doppietto libero su N, O o F. Nell'ammoniaca l'idrogeno è legato all'azoto e l'azoto ha un doppietto libero, quindi le due condizioni sono soddisfatte. In ciascuna delle altre sostanze nessun idrogeno è legato a N, O o F.`,
      lesson: md`Per il legame a idrogeno cerca un H legato direttamente a N, O o F, non soltanto la presenza di questi atomi nella molecola.`,
    },
  ],
  takeaways: [
    md`Fondere e far bollire una sostanza molecolare vince le forze intermolecolari, non i legami covalenti.`,
    md`Le forze di dispersione agiscono in ogni sostanza e crescono con il numero di elettroni; il legame a idrogeno richiede H legato a N, O o F.`,
    md`Durante un passaggio di stato la temperatura resta costante; un liquido bolle quando la sua tensione di vapore uguaglia la pressione esterna.`,
    md`Le leggi dei gas usano i kelvin: $\frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2}$ e $pV = nRT$; una mole di gas occupa circa 22,4 L a 0 °C e 1 atm.`,
  ],
  flashcards: [
    { front: md`Condizioni per un legame a idrogeno`, back: md`Un atomo di idrogeno legato direttamente a N, O o F, attratto da un doppietto libero su un atomo di N, O o F di un'altra molecola (o di un'altra parte della stessa).` },
    { front: md`Forze di dispersione di London`, back: md`Attrazioni tra dipoli temporanei. Agiscono tra tutte le molecole e crescono con il numero di elettroni e con la superficie di contatto.` },
    { front: md`Perché il ghiaccio galleggia?`, back: md`I legami a idrogeno tengono le molecole del ghiaccio in un reticolo aperto, meno denso dell'acqua liquida.` },
    { front: md`Quando bolle un liquido?`, back: md`Quando la sua tensione di vapore uguaglia la pressione esterna. Una pressione esterna più bassa, come in montagna, abbassa il punto di ebollizione.` },
    { front: md`L'equazione di stato dei gas perfetti`, back: md`$pV = nRT$, con $T$ in kelvin e $R = 8{,}314\ \mathrm{J\,mol^{-1}\,K^{-1}}$ (pascal, metri cubi) oppure circa $0{,}082\ \mathrm{L\,atm\,mol^{-1}\,K^{-1}}$.` },
    { front: md`Volume molare a 0 °C e 1 atm`, back: md`Circa 22,4 L per una mole di qualsiasi gas perfetto.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-bonding' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const inorganicNomenclatureLessonIt: Lesson = {
  slug: 'inorganic-nomenclature',
  title: md`Nomenclatura inorganica`,
  summary: md`Dai nome e formula a ossidi, anidridi, idrossidi, acidi e sali, con la nomenclatura IUPAC e tradizionale, partendo dai numeri di ossidazione.`,
  minutes: 24,
  objectives: [
    md`Assegnare i numeri di ossidazione e usarli per dare il nome ai composti binari con la notazione di Stock e con i prefissi.`,
    md`Dare il nome a ossidi, anidridi, idrossidi, idracidi e ossiacidi, e collegare un'anidride al suo acido.`,
    md`Dare il nome ai sali a partire dai loro acidi (-uro, -ito, -ato, compresi i sali acidi) e scrivere una formula corretta a partire da un nome.`,
  ],
  teachMd: md`
### Si parte dai numeri di ossidazione

Ogni regola di nomenclatura (*nomenclature*) si basa sui numeri di ossidazione (*oxidation numbers*), quindi fissali per primi:

- Un elemento da solo ha 0 ($\mathrm{O_2}$, $\mathrm{Fe}$).
- Uno ione monoatomico ha la sua carica: $\mathrm{Na^{+}}$ è $+1$, $\mathrm{S^{2-}}$ è $-2$.
- Nei composti i metalli del gruppo 1 sono $+1$ e quelli del gruppo 2 $+2$; il fluoro è sempre $-1$.
- L'ossigeno è di solito $-2$ (ma $-1$ nei perossidi, come $\mathrm{H_2O_2}$).
- L'idrogeno è $+1$ con i non metalli (ma $-1$ negli idruri metallici, come $\mathrm{NaH}$).
- In un composto neutro i numeri di ossidazione sommati danno 0; in uno ione, la sua carica.

Per esempio, in $\mathrm{H_2SO_4}$: $2(+1) + x + 4(-2) = 0$, quindi lo zolfo è $+6$.

### Due sistemi di nomenclatura

I nomi **IUPAC** usano i prefissi per il numero di atomi (mono-, di-, tri-, tetra-, penta-, esa-, epta-) oppure la **notazione di Stock**, un numero romano per il numero di ossidazione del metallo. I nomi **tradizionali** usano i suffissi: -oso per il numero di ossidazione minore e -ico per il maggiore (ferroso e ferrico per il ferro, rameoso e rameico per il rame), e chiamano **anidridi** gli ossidi dei non metalli. Bisogna saperli leggere entrambi. Poiché l'IMAT è in inglese, i nomi vi compaiono in inglese (*iron(III) chloride*, *ferric chloride*).

| Formula | IUPAC | Tradizionale |
| --- | --- | --- |
| $\mathrm{FeCl_2}$ | cloruro di ferro(II) | cloruro ferroso |
| $\mathrm{FeCl_3}$ | cloruro di ferro(III) | cloruro ferrico |
| $\mathrm{Cu_2O}$ | ossido di rame(I) | ossido rameoso |
| $\mathrm{CO_2}$ | diossido di carbonio | anidride carbonica |

### Composti binari

In un composto binario ionico, in italiano si nomina prima il non metallo con la desinenza **-uro** (tranne l'ossigeno, che dà "ossido") e poi il metallo: cloruro di sodio, ossido di magnesio, solfuro di alluminio, idruro di calcio. I metalli con una sola carica comune (gruppi 1 e 2, alluminio, zinco) non hanno bisogno del numero romano. Nei composti ionici i prefissi non sono necessari, perché le cariche fissano già la formula: $\mathrm{CaCl_2}$ si chiama di solito cloruro di calcio (il nome sistematico completo, "dicloruro di calcio", è anch'esso corretto).

I composti di due non metalli si nominano con i prefissi: $\mathrm{CO}$ monossido di carbonio, $\mathrm{SO_3}$ triossido di zolfo, $\mathrm{N_2O_5}$ pentossido di diazoto, $\mathrm{Cl_2O_7}$ eptossido di dicloro. Il prefisso "mono-" si omette sul secondo elemento nominato.

### Ossidi, anidridi e idrossidi

Gli ossidi dei metalli sono **basici** (*basic oxides*): con l'acqua danno idrossidi. Gli ossidi dei non metalli sono **acidi** (*acidic oxides*): con l'acqua danno ossiacidi, ed è per questo che la nomenclatura tradizionale li chiama **anidridi** ("acidi senza acqua").

$$\mathrm{CaO} + \mathrm{H_2O} \rightarrow \mathrm{Ca(OH)_2} \qquad \mathrm{SO_3} + \mathrm{H_2O} \rightarrow \mathrm{H_2SO_4}$$

L'atomo centrale conserva il suo numero di ossidazione quando l'anidride diventa acido: lo zolfo è $+6$ sia nell'anidride solforica $\mathrm{SO_3}$ sia in $\mathrm{H_2SO_4}$, e $+4$ sia nell'anidride solforosa $\mathrm{SO_2}$ sia in $\mathrm{H_2SO_3}$. Questo legame permette di passare da un'anidride al suo acido senza imparare a memoria le coppie.

Gli **idrossidi** contengono lo ione idrossido $\mathrm{OH^{-}}$: idrossido di sodio $\mathrm{NaOH}$, idrossido di calcio $\mathrm{Ca(OH)_2}$, idrossido di alluminio $\mathrm{Al(OH)_3}$, idrossido di ferro(III) $\mathrm{Fe(OH)_3}$ (idrossido ferrico).

### Gli acidi

Gli **idracidi** (*binary acids*) contengono idrogeno e un non metallo e, in acqua, prendono la desinenza -idrico: $\mathrm{HF}$ acido fluoridrico, $\mathrm{HCl}$ acido cloridrico (*hydrochloric acid*), $\mathrm{HBr}$ acido bromidrico, $\mathrm{H_2S}$ acido solfidrico.

Gli **ossiacidi** (*oxyacids*) contengono anche ossigeno. Il numero di ossidazione maggiore dell'atomo centrale prende -ico, il minore -oso; quando un elemento ne forma quattro, per-...-ico è il più alto e ipo-...-oso il più basso:

| Acido | Nome | Numero di ossidazione |
| --- | --- | --- |
| $\mathrm{HClO}$ | acido ipocloroso | Cl $+1$ |
| $\mathrm{HClO_2}$ | acido cloroso | Cl $+3$ |
| $\mathrm{HClO_3}$ | acido clorico | Cl $+5$ |
| $\mathrm{HClO_4}$ | acido perclorico | Cl $+7$ |
| $\mathrm{HNO_2}$ / $\mathrm{HNO_3}$ | acido nitroso / nitrico | N $+3$ / $+5$ |
| $\mathrm{H_2SO_3}$ / $\mathrm{H_2SO_4}$ | acido solforoso / solforico | S $+4$ / $+6$ |
| $\mathrm{H_2CO_3}$ | acido carbonico | C $+4$ |
| $\mathrm{H_3PO_4}$ | acido fosforico | P $+5$ |

### I sali

Un sale si ottiene sostituendo l'idrogeno di un acido con un metallo (o con lo ione ammonio, $\mathrm{NH_4^{+}}$). Il nome dell'anione deriva dall'acido:

- acido in -ico dà un sale in **-ato**: acido solforico, solfato di sodio $\mathrm{Na_2SO_4}$ (*sulfate*).
- acido in -oso dà un sale in **-ito**: acido solforoso, solfito di sodio $\mathrm{Na_2SO_3}$ (*sulfite*).
- acido in -idrico dà un sale in **-uro**: acido cloridrico, cloruro di sodio (*chloride*).
- I prefissi per- e ipo- restano: perclorato $\mathrm{ClO_4^{-}}$, ipoclorito $\mathrm{ClO^{-}}$.

Se solo una parte degli idrogeni è sostituita, il sale li conserva e lo dice: $\mathrm{NaHCO_3}$ è l'idrogenocarbonato di sodio (tradizionalmente bicarbonato di sodio), $\mathrm{NaH_2PO_4}$ il diidrogenofosfato di sodio.

### Dal nome alla formula

Scrivi ogni ione con la sua carica, poi prendi i numeri più piccoli che rendono nulla la carica totale, con le parentesi attorno a uno ione poliatomico che compare più di una volta. Solfato di alluminio: $\mathrm{Al^{3+}}$ e $\mathrm{SO_4^{2-}}$; tre solfati ($-6$) bilanciano due ioni alluminio ($+6$), quindi $\mathrm{Al_2(SO_4)_3}$. Fosfato di ammonio: tre $\mathrm{NH_4^{+}}$ bilanciano un $\mathrm{PO_4^{3-}}$, quindi $\mathrm{(NH_4)_3PO_4}$.

Gli ioni da sapere a memoria: idrossido $\mathrm{OH^{-}}$, nitrato $\mathrm{NO_3^{-}}$, nitrito $\mathrm{NO_2^{-}}$, solfato $\mathrm{SO_4^{2-}}$, solfito $\mathrm{SO_3^{2-}}$, carbonato $\mathrm{CO_3^{2-}}$, fosfato $\mathrm{PO_4^{3-}}$, ammonio $\mathrm{NH_4^{+}}$, e i quattro ossianioni del cloro visti sopra.
`,
  examples: [
    {
      id: 'example-iron-sulfate',
      title: md`Dal nome alla formula`,
      problemMd: md`Scrivi la formula del solfato di ferro(III) e indica il suo nome tradizionale.`,
      steps: [
        md`Il ferro(III) è $\mathrm{Fe^{3+}}$; il solfato è $\mathrm{SO_4^{2-}}$.`,
        md`Il minimo comune multiplo di 3 e 2 è 6: due $\mathrm{Fe^{3+}}$ danno $+6$, tre $\mathrm{SO_4^{2-}}$ danno $-6$.`,
        md`Metti il solfato tra parentesi perché ce n'è più di uno: $\mathrm{Fe_2(SO_4)_3}$.`,
        md`Il numero di ossidazione maggiore comune del ferro è $+3$, quindi il nome tradizionale usa -ico: solfato ferrico.`,
      ],
      answerMd: md`$\mathrm{Fe_2(SO_4)_3}$, solfato ferrico. Scrivere $\mathrm{Fe_3SO_4}$ significa leggere il III come numero di atomi di ferro; il numero romano è la carica.`,
    },
    {
      id: 'example-chlorite',
      title: md`Il nome di un ossiacido e del suo sale`,
      problemMd: md`Dai il nome a $\mathrm{HClO_2}$ e al suo sale di sodio $\mathrm{NaClO_2}$.`,
      steps: [
        md`Trova il numero di ossidazione del cloro: $+1 + x + 2(-2) = 0$, quindi $x = +3$.`,
        md`Gli ossiacidi del cloro vanno da $+1$ a $+7$: ipo-...-oso, -oso, -ico, per-...-ico. Quindi $+3$ è l'acido cloroso.`,
        md`Un acido in -oso dà un sale in -ito: $\mathrm{NaClO_2}$ è il clorito di sodio.`,
      ],
      answerMd: md`Acido cloroso e clorito di sodio. Lo scivolone tipico è "clorato di sodio": il clorato è $\mathrm{ClO_3^{-}}$, con il cloro a $+5$.`,
    },
    {
      id: 'example-oxide-to-acid',
      title: md`Da un'anidride a un acido e a un sale`,
      problemMd: md`Dai il nome a $\mathrm{N_2O_5}$, indica l'acido che forma con l'acqua e il nome del sale di potassio di quell'acido.`,
      steps: [
        md`Due non metalli: si usano i prefissi. $\mathrm{N_2O_5}$ è il pentossido di diazoto; in nomenclatura tradizionale, anidride nitrica.`,
        md`Numero di ossidazione dell'azoto: $2x + 5(-2) = 0$, quindi $x = +5$.`,
        md`Con l'acqua: $\mathrm{N_2O_5} + \mathrm{H_2O} \rightarrow 2\,\mathrm{HNO_3}$. L'azoto resta $+5$, il maggiore dei suoi due stati negli ossiacidi, quindi l'acido è l'acido nitrico.`,
        md`Un acido in -ico dà un sale in -ato: $\mathrm{KNO_3}$ è il nitrato di potassio.`,
      ],
      answerMd: md`Il pentossido di diazoto (anidride nitrica) dà acido nitrico, $\mathrm{HNO_3}$, il cui sale di potassio è il nitrato di potassio. L'acido nitroso richiederebbe l'azoto a $+3$, cioè $\mathrm{N_2O_3}$, l'anidride nitrosa.`,
    },
  ],
  traps: [
    {
      title: md`Leggere il numero romano come un pedice`,
      md: md`Il numero romano è il numero di ossidazione del metallo, non quanti atomi ce ne sono. L'ossido di rame(I) è $\mathrm{Cu_2O}$ e l'ossido di ferro(III) è $\mathrm{Fe_2O_3}$. Bilancia le cariche per trovare i pedici.`,
    },
    {
      title: md`Scambiare -ito e -ato`,
      md: md`-ato va con gli acidi in -ico e con il numero di ossidazione maggiore; -ito con gli acidi in -oso e con il minore. Il solfato ha un ossigeno in più del solfito, il nitrato uno in più del nitrito. Nel dubbio, calcola il numero di ossidazione.`,
    },
    {
      title: md`Credere che -ico significhi sempre +3`,
      md: md`I suffissi -oso e -ico significano "minore" e "maggiore", non numeri fissi. Ferrico è ferro(III), ma rameico è rame(II) e rameoso rame(I). Traduci il nome tradizionale nel numero di Stock di quel metallo prima di scrivere la formula.`,
    },
    {
      title: md`Scambiare un sale acido per un acido`,
      md: md`$\mathrm{NaHCO_3}$ è un sale, l'idrogenocarbonato di sodio, non un "acido carbonico di sodio". L'"idrogeno" nel nome conta gli idrogeni rimasti nell'anione.`,
    },
  ],
  check: [
    {
      id: 'check-kclo3',
      title: md`Il nome di un sale di un ossianione del cloro`,
      topic: md`Nomenclatura inorganica`,
      stemMd: md`Come si chiama $\mathrm{KClO_3}$?`,
      options: [
        { id: 'A', text: md`Perclorato di potassio`, note: md`Il perclorato è $\mathrm{ClO_4^{-}}$, con il cloro a $+7$; qui gli ossigeni sono solo tre.` },
        { id: 'B', text: md`Clorito di potassio`, note: md`Il clorito è $\mathrm{ClO_2^{-}}$, con il cloro a $+3$; questa risposta scambia -ito e -ato.` },
        { id: 'C', text: md`Ipoclorito di potassio`, note: md`L'ipoclorito è $\mathrm{ClO^{-}}$, con il cloro a $+1$.` },
        { id: 'D', text: md`Clorato di potassio`, note: '' },
        { id: 'E', text: md`Cloruro di potassio`, note: md`Il cloruro è $\mathrm{Cl^{-}}$, senza ossigeno; quel nome spetta a $\mathrm{KCl}$.` },
      ],
      answer: 'D',
      workingMd: md`Numero di ossidazione del cloro: $+1 + x + 3(-2) = 0$, quindi $x = +5$. È l'acido clorico, $\mathrm{HClO_3}$, e un acido in -ico dà un sale in -ato: clorato di potassio.`,
      lesson: md`Calcola il numero di ossidazione dell'atomo centrale, trova l'acido, poi trasforma -ico in -ato e -oso in -ito.`,
    },
    {
      id: 'check-calcium-phosphate',
      title: md`Scrivere una formula`,
      topic: md`Nomenclatura inorganica`,
      stemMd: md`Qual è la formula del fosfato di calcio?`,
      options: [
        { id: 'A', text: md`$\mathrm{Ca_3(PO_4)_2}$`, note: '' },
        { id: 'B', text: md`$\mathrm{Ca_2(PO_4)_3}$`, note: md`Scambia i pedici: due $\mathrm{Ca^{2+}}$ danno $+4$ e tre fosfati $-9$, quindi non è neutro.` },
        { id: 'C', text: md`$\mathrm{CaPO_4}$`, note: md`Un calcio ($+2$) non può bilanciare un fosfato ($-3$).` },
        { id: 'D', text: md`$\mathrm{CaHPO_4}$`, note: md`È l'idrogenofosfato di calcio, un sale che contiene ancora un idrogeno acido; il nome richiesto non ne ha.` },
        { id: 'E', text: md`$\mathrm{Ca(PO_4)_2}$`, note: md`Le cariche danno $+2$ e $-6$: la formula non è neutra.` },
      ],
      answer: 'A',
      workingMd: md`Il calcio è $\mathrm{Ca^{2+}}$ e il fosfato $\mathrm{PO_4^{3-}}$. Il minimo comune multiplo di 2 e 3 è 6: tre ioni calcio danno $+6$, due fosfati $-6$. La formula è $\mathrm{Ca_3(PO_4)_2}$.`,
      lesson: md`Bilancia a zero le cariche degli ioni con i numeri interi più piccoli, e metti tra parentesi uno ione poliatomico ripetuto.`,
    },
    {
      id: 'check-oxide-acid-pair',
      title: md`Abbinare un'anidride al suo acido`,
      topic: md`Nomenclatura inorganica`,
      stemMd: md`Quale abbinamento tra un'anidride (ossido acido) e l'acido che forma con l'acqua è corretto?`,
      options: [
        { id: 'A', text: md`$\mathrm{SO_2}$ dà acido solforico, $\mathrm{H_2SO_4}$`, note: md`Lo zolfo è $+4$ in $\mathrm{SO_2}$ e resta $+4$: l'acido è l'acido solforoso, $\mathrm{H_2SO_3}$.` },
        { id: 'B', text: md`$\mathrm{N_2O_5}$ dà acido nitrico, $\mathrm{HNO_3}$`, note: '' },
        { id: 'C', text: md`$\mathrm{CO_2}$ dà acido carbonico, $\mathrm{H_2CO_4}$`, note: md`$\mathrm{CO_2} + \mathrm{H_2O}$ dà $\mathrm{H_2CO_3}$; la formula indicata ha un ossigeno di troppo.` },
        { id: 'D', text: md`$\mathrm{Cl_2O_7}$ dà acido clorico, $\mathrm{HClO_3}$`, note: md`Il cloro è $+7$ in $\mathrm{Cl_2O_7}$, quindi l'acido è l'acido perclorico, $\mathrm{HClO_4}$.` },
        { id: 'E', text: md`$\mathrm{N_2O_3}$ dà acido nitrico, $\mathrm{HNO_3}$`, note: md`L'azoto è $+3$ in $\mathrm{N_2O_3}$, quindi l'acido è l'acido nitroso, $\mathrm{HNO_2}$.` },
      ],
      answer: 'B',
      workingMd: md`L'azoto è $+5$ in $\mathrm{N_2O_5}$ ($2x = 10$), e $\mathrm{N_2O_5} + \mathrm{H_2O} \rightarrow 2\,\mathrm{HNO_3}$ lo mantiene a $+5$: acido nitrico. In ogni altro abbinamento il numero di ossidazione dell'atomo centrale cambia tra anidride e acido, oppure la formula è sbagliata.`,
      lesson: md`Un'anidride e il suo acido hanno l'atomo centrale con lo stesso numero di ossidazione.`,
    },
  ],
  takeaways: [
    md`Assegna prima i numeri di ossidazione: ogni nome ne discende.`,
    md`Il numero romano di Stock è il numero di ossidazione del metallo; i prefissi contano gli atomi e sono necessari nei composti tra due non metalli.`,
    md`Gli ossidi dei metalli sono basici e danno idrossidi; le anidridi (ossidi dei non metalli) sono acide e danno ossiacidi con lo stesso numero di ossidazione.`,
    md`Dall'acido al sale: -ico diventa -ato, -oso diventa -ito, -idrico diventa -uro; per- e ipo- restano.`,
  ],
  flashcards: [
    { front: md`Numero di ossidazione di ossigeno e idrogeno`, back: md`L'ossigeno è di solito −2 (−1 nei perossidi). L'idrogeno è +1 con i non metalli e −1 negli idruri metallici.` },
    { front: md`Che cosa significa ferro(III)?`, back: md`Ferro con numero di ossidazione $+3$, $\mathrm{Fe^{3+}}$; tradizionalmente "ferrico". Il ferro(II) è "ferroso".` },
    { front: md`Gli ossiacidi del cloro in ordine`, back: md`$\mathrm{HClO}$ ipocloroso (+1), $\mathrm{HClO_2}$ cloroso (+3), $\mathrm{HClO_3}$ clorico (+5), $\mathrm{HClO_4}$ perclorico (+7).` },
    { front: md`Dalla desinenza dell'acido a quella del sale`, back: md`Acido in -ico → sale in -ato; acido in -oso → sale in -ito; acido in -idrico → sale in -uro.` },
    { front: md`Ossidi basici e anidridi`, back: md`Gli ossidi dei metalli sono basici e con l'acqua formano idrossidi ($\mathrm{CaO} \rightarrow \mathrm{Ca(OH)_2}$). Le anidridi, ossidi dei non metalli, sono acide e formano ossiacidi ($\mathrm{SO_3} \rightarrow \mathrm{H_2SO_4}$).` },
    { front: md`$\mathrm{NaHCO_3}$`, back: md`Idrogenocarbonato di sodio, tradizionalmente bicarbonato di sodio: un sale in cui resta uno dei due idrogeni dell'acido carbonico.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-bonding' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const molesAndStoichiometryLessonIt: Lesson = {
  slug: 'moles-and-stoichiometry',
  title: md`La mole e la stechiometria`,
  summary: md`Passa da massa a moli e a numero di particelle, usa le equazioni bilanciate per quantità che reagiscono e reagente limitante, e ricava formule minime.`,
  minutes: 22,
  objectives: [
    md`Passare tra massa, quantità in moli, numero di particelle e volume di un gas.`,
    md`Usare il rapporto molare di un'equazione bilanciata per trovare le masse che reagiscono, il reagente limitante e la resa percentuale.`,
    md`Ricavare la formula minima dalla composizione percentuale, e la formula molecolare dalla massa molare.`,
  ],
  teachMd: md`
### La mole

Gli atomi sono troppo piccoli per contarli uno per uno, quindi i chimici li contano in **moli** (*moles*). Una mole è $6{,}022 \times 10^{23}$ particelle, la **costante di Avogadro** (*Avogadro constant*) $N_A$. Il numero è scelto in modo che una mole di una sostanza abbia una massa in grammi pari alla sua massa formula relativa: una mole di atomi di carbonio è circa 12 g, una mole d'acqua ($2 \times 1 + 16 = 18$) è 18 g.

Quella massa per mole è la **massa molare** (*molar mass*) $M$, in g/mol. Tre relazioni collegano tutto:

$$n = \frac{m}{M} \qquad N = n \times N_A \qquad V = n \times V_m \ \text{(gas)}$$

dove $n$ è la quantità in moli, $m$ la massa, $N$ il numero di particelle e $V_m$ il volume molare di un gas (circa 22,4 L/mol a 0 °C e 1 atm; vedi la lezione sui gas).

Le masse molari sono somme. Con $\mathrm{H} = 1$, $\mathrm{C} = 12$, $\mathrm{N} = 14$, $\mathrm{O} = 16$, $\mathrm{S} = 32$: $\mathrm{CO_2}$ è $12 + 32 = 44$ g/mol e $\mathrm{H_2SO_4}$ è $2 + 32 + 64 = 98$ g/mol. Attenzione agli elementi che esistono come molecole: l'ossigeno gassoso è $\mathrm{O_2}$, 32 g/mol, non 16.

Una mole di molecole contiene più di una mole di atomi. Una mole di $\mathrm{H_2SO_4}$ contiene 2 mol di atomi di H, 1 mol di S e 4 mol di O. Leggi con cura se la domanda chiede molecole, atomi o ioni.

### Le equazioni bilanciate parlano in moli

Un'equazione bilanciata conserva ogni tipo di atomo, e quindi la massa. I suoi coefficienti danno il **rapporto molare** (*mole ratio*) con cui le sostanze reagiscono e si formano:

$$\mathrm{CH_4} + 2\,\mathrm{O_2} \rightarrow \mathrm{CO_2} + 2\,\mathrm{H_2O}$$

si legge "1 mol di metano reagisce con 2 mol di ossigeno e dà 1 mol di diossido di carbonio e 2 mol di acqua". **Non** dice che 1 g di metano reagisce con 2 g di ossigeno. I coefficienti riguardano quantità chimiche, mai masse.

Per bilanciare un'equazione si cambiano i coefficienti, mai i pedici (un pedice cambia la sostanza). Bilancia prima gli elementi che compaiono in un solo composto per lato e lascia per ultimi quelli presenti da soli, come $\mathrm{O_2}$.

### Il percorso per ogni problema sulle quantità che reagiscono

1. Bilancia l'equazione.
2. Trasforma i dati in **moli**.
3. Usa il **rapporto molare** per ottenere le moli di ciò che cerchi.
4. Torna alla massa, al numero di particelle o al volume.

Da massa a massa non si passa mai direttamente: si passa sempre per le moli.

### Il reagente limitante

Quando sono dati due reagenti, di solito uno finisce prima. Quel **reagente limitante** (*limiting reagent*) decide quanto prodotto si forma; l'altro è **in eccesso**, e una parte ne avanza. Per trovarlo, dividi le moli di ciascun reagente per il suo coefficiente: il risultato più piccolo indica il limitante. Confrontare le masse, o anche le moli senza i coefficienti, è l'errore classico.

### La resa percentuale

La massa calcolata dal reagente limitante è la **resa teorica**. Le reazioni reali danno meno (reazione incompleta, reazioni secondarie, perdite), quindi

$$\text{resa percentuale} = \frac{\text{resa effettiva}}{\text{resa teorica}} \times 100\%$$

### Composizione percentuale e formule

La percentuale in massa di un elemento in un composto è la sua massa totale in una mole divisa per la massa molare. L'azoto nel nitrato di ammonio, $\mathrm{NH_4NO_3}$ ($M = 80$): $\frac{2 \times 14}{80} = \frac{28}{80} = 35\%$.

Nel verso opposto si ottiene la **formula minima** (*empirical formula*), il rapporto più semplice tra numeri interi di atomi:

1. Supponi di avere 100 g, così ogni percentuale diventa una massa in grammi.
2. Dividi ogni massa per la massa molare dell'elemento per avere le moli.
3. Dividi per il numero di moli più piccolo per avere un rapporto; arrotonda a numeri interi (se un rapporto finisce in ,5, raddoppia tutto).

La **formula molecolare** (*molecular formula*) è un multiplo intero della formula minima. Dividi la massa molare per la massa della formula minima per trovare il multiplo. Il glucosio, $\mathrm{C_6H_{12}O_6}$, e il metanale, $\mathrm{CH_2O}$, hanno la stessa formula minima $\mathrm{CH_2O}$.

### A mano

Nessuna norma dell'IMAT consente la calcolatrice, quindi esercitati a mano con numeri comodi: quantità che sono frazioni semplici o multipli di una mole. Tieni le quantità come frazioni ($\frac{1}{2}$ mol, $\frac{3}{2}$ mol) e semplifica prima di moltiplicare. Se una risposta richiede una divisione lunga, controlla di essere passato alle moli nel punto giusto.
`,
  examples: [
    {
      id: 'example-methane-co2',
      title: md`Massa di prodotto dalla massa di reagente`,
      problemMd: md`Quale massa di diossido di carbonio si forma quando bruciano completamente 8 g di metano? ($\mathrm{CH_4} + 2\,\mathrm{O_2} \rightarrow \mathrm{CO_2} + 2\,\mathrm{H_2O}$)`,
      steps: [
        md`Moli di metano: $M = 12 + 4 = 16$ g/mol, quindi $n = \frac{8}{16} = 0{,}5$ mol.`,
        md`Rapporto molare $\mathrm{CH_4} : \mathrm{CO_2} = 1 : 1$, quindi si formano 0,5 mol di $\mathrm{CO_2}$.`,
        md`Massa: $M(\mathrm{CO_2}) = 44$ g/mol, quindi $0{,}5 \times 44 = 22$ g.`,
        md`Verifica con una proporzione: 16 g di metano danno 44 g di $\mathrm{CO_2}$, e 8 g sono la metà, quindi 22 g.`,
      ],
      answerMd: md`22 g di diossido di carbonio. Rispondere 8 g (supponendo che la massa si conservi tra un reagente e un prodotto) salta il passaggio attraverso le moli.`,
    },
    {
      id: 'example-limiting-hydrogen',
      title: md`Trovare il reagente limitante`,
      problemMd: md`Reagiscono 6 g di idrogeno e 32 g di ossigeno: $2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$. Quale massa d'acqua si forma, e che cosa avanza?`,
      steps: [
        md`Moli: $\mathrm{H_2}$: $\frac{6}{2} = 3$ mol; $\mathrm{O_2}$: $\frac{32}{32} = 1$ mol.`,
        md`Dividi per i coefficienti: $\mathrm{H_2}$: $\frac{3}{2} = 1{,}5$; $\mathrm{O_2}$: $\frac{1}{1} = 1$. L'ossigeno dà il numero più piccolo, quindi è il limitante.`,
        md`1 mol di $\mathrm{O_2}$ consuma 2 mol di $\mathrm{H_2}$ e forma 2 mol d'acqua: $2 \times 18 = 36$ g.`,
        md`Idrogeno che avanza: $3 - 2 = 1$ mol, cioè 2 g. Verifica delle masse: $6 + 32 = 38$ g prima, $36 + 2 = 38$ g dopo.`,
      ],
      answerMd: md`Si formano 36 g d'acqua e avanzano 2 g di idrogeno. L'errore allettante è considerare l'ossigeno in eccesso perché la sua massa (32 g) è maggiore.`,
    },
    {
      id: 'example-empirical-glucose',
      title: md`Dalle percentuali alla formula molecolare`,
      problemMd: md`Un composto contiene in massa il 40,0% di carbonio, il 6,7% di idrogeno e il 53,3% di ossigeno, e la sua massa molare è 180 g/mol. Trova la formula minima e la formula molecolare.`,
      steps: [
        md`In 100 g: 40,0 g di C, 6,7 g di H, 53,3 g di O.`,
        md`Moli: C $\frac{40{,}0}{12} \approx 3{,}33$; H $\frac{6{,}7}{1} = 6{,}7$; O $\frac{53{,}3}{16} \approx 3{,}33$.`,
        md`Dividi per il più piccolo (3,33): C 1, H circa 2, O 1. Formula minima $\mathrm{CH_2O}$, massa $12 + 2 + 16 = 30$ g/mol.`,
        md`Multiplo: $\frac{180}{30} = 6$, quindi la formula molecolare è $\mathrm{C_6H_{12}O_6}$. Verifica: $6 \times 12 + 12 \times 1 + 6 \times 16 = 72 + 12 + 96 = 180$.`,
      ],
      answerMd: md`Formula minima $\mathrm{CH_2O}$, formula molecolare $\mathrm{C_6H_{12}O_6}$. Usare direttamente il rapporto in massa 40 : 6,7 : 53,3, senza dividere per le masse molari, dà una formula priva di senso.`,
    },
  ],
  traps: [
    {
      title: md`Leggere i coefficienti come masse`,
      md: md`In $2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$, 2 g di idrogeno non reagiscono con 1 g di ossigeno. Il rapporto 2 : 1 è in moli; in grammi è 4 : 32. Passa alle moli prima di usare qualsiasi coefficiente.`,
    },
    {
      title: md`Scegliere il limitante in base alla massa o alle moli grezze`,
      md: md`Il reagente con meno massa, o con meno moli, non è necessariamente il limitante. Dividi la quantità in moli di ciascuno per il suo coefficiente e confronta quei numeri.`,
    },
    {
      title: md`Masse molari atomiche e molecolari`,
      md: md`Ossigeno, azoto, idrogeno e alogeni sono biatomici come elementi: $\mathrm{O_2}$ è 32 g/mol, $\mathrm{N_2}$ 28 g/mol, $\mathrm{Cl_2}$ 71 g/mol. Usare il valore atomico raddoppia le moli calcolate.`,
    },
    {
      title: md`Molecole o atomi?`,
      md: md`Mezza mole di $\mathrm{H_2SO_4}$ è 0,5 mol di molecole ma 2 mol di atomi di ossigeno. Prima di rispondere, sottolinea che cosa conta la domanda.`,
    },
  ],
  check: [
    {
      id: 'check-oxygen-atoms',
      title: md`Contare atomi in moli`,
      topic: md`La mole`,
      stemMd: md`Quante moli di atomi di ossigeno ci sono in 49 g di acido solforico, $\mathrm{H_2SO_4}$? ($\mathrm{H} = 1$, $\mathrm{S} = 32$, $\mathrm{O} = 16$)`,
      options: [
        { id: 'A', text: md`0,125`, note: md`Divide per 4 le 0,5 mol di molecole invece di moltiplicare; ogni molecola ha quattro atomi di ossigeno.` },
        { id: 'B', text: md`0,5`, note: md`È la quantità di molecole di acido solforico, non di atomi di ossigeno.` },
        { id: 'C', text: md`2`, note: '' },
        { id: 'D', text: md`4`, note: md`Quattro è il numero di atomi di ossigeno per molecola, o le moli in una mole intera di acido; qui c'è solo mezza mole.` },
        { id: 'E', text: md`32`, note: md`32 è la massa in grammi dell'ossigeno contenuto in 49 g di acido, non la sua quantità in moli.` },
      ],
      answer: 'C',
      workingMd: md`$M(\mathrm{H_2SO_4}) = 2 + 32 + 4 \times 16 = 98$ g/mol, quindi 49 g sono $\frac{49}{98} = 0{,}5$ mol di molecole. Ogni molecola ha 4 atomi di ossigeno: $0{,}5 \times 4 = 2$ mol di atomi di ossigeno.`,
      lesson: md`Trova prima le moli della sostanza, poi moltiplica per il numero di atomi richiesti in ogni unità formula.`,
    },
    {
      id: 'check-ammonia-limiting',
      title: md`Quanta ammoniaca?`,
      topic: md`Stechiometria`,
      stemMd: md`56 g di azoto e 6 g di idrogeno reagiscono secondo $\mathrm{N_2} + 3\,\mathrm{H_2} \rightarrow 2\,\mathrm{NH_3}$. Qual è la massa massima di ammoniaca che si può formare? ($\mathrm{H} = 1$, $\mathrm{N} = 14$)`,
      options: [
        { id: 'A', text: md`17 g`, note: md`Ricava 1 mol di ammoniaca da 3 mol di idrogeno, dimenticando che l'equazione dà 2 mol di ammoniaca ogni 3 mol di idrogeno.` },
        { id: 'B', text: md`68 g`, note: md`Considera limitante l'azoto (2 mol di $\mathrm{N_2}$, 4 mol di ammoniaca), ma 2 mol di $\mathrm{N_2}$ richiederebbero 6 mol di idrogeno, e ce ne sono solo 3.` },
        { id: 'C', text: md`62 g`, note: md`Somma le due masse, come se entrambi i reagenti si consumassero; l'azoto è in eccesso.` },
        { id: 'D', text: md`34 g`, note: '' },
        { id: 'E', text: md`51 g`, note: md`Usa un rapporto 1 : 1 tra idrogeno e ammoniaca, ottenendo 3 mol; il rapporto dell'equazione è 3 : 2.` },
      ],
      answer: 'D',
      workingMd: md`Moli: $\mathrm{N_2}$ $\frac{56}{28} = 2$; $\mathrm{H_2}$ $\frac{6}{2} = 3$. Divise per i coefficienti: $\frac{2}{1} = 2$ e $\frac{3}{3} = 1$, quindi l'idrogeno è il limitante. 3 mol di $\mathrm{H_2}$ danno $3 \times \frac{2}{3} = 2$ mol di $\mathrm{NH_3}$, e $2 \times 17 = 34$ g.`,
      lesson: md`Dividi le moli di ogni reagente per il suo coefficiente; il numero più piccolo indica il reagente limitante, che da solo fissa la resa.`,
    },
    {
      id: 'check-nitrogen-oxide',
      title: md`Una formula minima`,
      topic: md`Stechiometria`,
      stemMd: md`Un ossido di azoto contiene il 30,4% in massa di azoto. Qual è la sua formula minima? ($\mathrm{N} = 14$, $\mathrm{O} = 16$)`,
      options: [
        { id: 'A', text: md`$\mathrm{NO_2}$`, note: '' },
        { id: 'B', text: md`$\mathrm{NO}$`, note: md`$\mathrm{NO}$ è $\frac{14}{30}$, circa il 47% di azoto: troppo.` },
        { id: 'C', text: md`$\mathrm{N_2O}$`, note: md`$\mathrm{N_2O}$ è $\frac{28}{44}$, circa il 64% di azoto; inverte quale elemento è in prevalenza.` },
        { id: 'D', text: md`$\mathrm{N_2O_3}$`, note: md`$\mathrm{N_2O_3}$ è $\frac{28}{76}$, circa il 37% di azoto, troppo per il 30,4%.` },
        { id: 'E', text: md`$\mathrm{N_2O_5}$`, note: md`$\mathrm{N_2O_5}$ è $\frac{28}{108}$, circa il 26% di azoto, troppo poco.` },
      ],
      answer: 'A',
      workingMd: md`In 100 g: 30,4 g di N e 69,6 g di O. Moli: $\frac{30{,}4}{14} \approx 2{,}17$ e $\frac{69{,}6}{16} = 4{,}35$. Rapporto $\frac{4{,}35}{2{,}17} \approx 2$, quindi N : O = 1 : 2, $\mathrm{NO_2}$. Verifica: $\frac{14}{46}$ è poco più del 30%.`,
      lesson: md`Per una formula minima trasforma le masse in moli prima di fare qualsiasi rapporto; un rapido controllo della percentuale su ogni opzione conferma la risposta.`,
    },
  ],
  takeaways: [
    md`$n = \frac{m}{M}$; una mole è $6{,}022 \times 10^{23}$ particelle, e una mole di gas occupa circa 22,4 L a 0 °C e 1 atm.`,
    md`I coefficienti di un'equazione bilanciata sono rapporti molari, mai rapporti in massa: passa sempre per le moli.`,
    md`Il reagente limitante ha il valore più piccolo di moli diviso coefficiente, e da solo fissa la quantità di prodotto.`,
    md`Formula minima: supponi 100 g, passa alle moli, dividi per il valore più piccolo; la formula molecolare ne è un multiplo intero.`,
  ],
  flashcards: [
    { front: md`La costante di Avogadro`, back: md`$6{,}022 \times 10^{23}$ particelle per mole.` },
    { front: md`Massa, moli e massa molare`, back: md`$n = \frac{m}{M}$: le moli sono la massa in grammi divisa per la massa molare in g/mol.` },
    { front: md`Che cosa danno i coefficienti di un'equazione bilanciata?`, back: md`Il rapporto molare con cui le sostanze reagiscono e si formano, non un rapporto in massa.` },
    { front: md`Come si trova il reagente limitante`, back: md`Trasforma ogni reagente in moli e dividi per il suo coefficiente. Il risultato più piccolo indica il reagente limitante.` },
    { front: md`Resa percentuale`, back: md`Resa effettiva divisa per resa teorica, per 100%. La resa teorica si calcola dal reagente limitante.` },
    { front: md`Formula minima dalle percentuali`, back: md`Prendi 100 g, dividi ogni massa per la sua massa molare, dividi per il numero di moli più piccolo e arrotonda a un rapporto tra interi.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-chemistry', skill: 'imat-chem-stoichiometry' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};
