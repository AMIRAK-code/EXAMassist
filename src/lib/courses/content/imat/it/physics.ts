import { md, type Lesson } from '../../../types';

/**
 * IMAT, fisica (unità "physics"), versione italiana delle lezioni di
 * content/imat/physics.ts: stessi slug, minuti, link di pratica, numero di
 * esempi, trappole, domande e flashcard, e le stesse chiavi delle domande.
 * Nulla nelle regole dell'IMAT consente la calcolatrice: tutti i numeri si lavorano a mano, con g = 10 m/s^2.
 */

export const unitsVectorsAndKinematicsLessonIt: Lesson = {
  slug: 'units-vectors-and-kinematics',
  title: 'Unità di misura, vettori e cinematica',
  summary: 'Unità SI e prefissi, somma e scomposizione dei vettori, equazioni del moto uniformemente accelerato e caduta libera, tutto senza calcolatrice.',
  minutes: 20,
  objectives: [
    md`Passare da un prefisso SI all'altro e controllare una formula o un risultato attraverso le unità di misura.`,
    md`Sommare vettori perpendicolari e scomporre un vettore in componenti con seni e coseni degli angoli notevoli.`,
    md`Scegliere e applicare l'equazione giusta del moto uniformemente accelerato, anche per la caduta libera e il lancio orizzontale.`,
  ],
  teachMd: md`
### Lavorare senza calcolatrice

Nell'IMAT la fisica condivide con la matematica una delle aree della prova, e nulla nelle regole dell'IMAT consente la calcolatrice. Servono quindi calcoli che si possano fare a mano: potenze di dieci, frazioni semplici e qualche radice quadrata. In tutto il corso prendiamo $g = 10\ \text{m/s}^2$ come accelerazione di gravità (*acceleration of free fall*): usa questo valore, a meno che il quesito non ne indichi un altro. Le unità di misura sono il controllo più rapido: una risposta con le unità sbagliate è sbagliata, qualunque sia il numero.

### Unità fondamentali del SI e prefissi

Il Sistema Internazionale (SI) ha sette unità fondamentali (*base units*): metro (m), chilogrammo (kg), secondo (s), ampere (A), kelvin (K), mole (mol) e candela (cd). Tutte le altre derivano da queste. Un newton è $1\ \text{N} = 1\ \text{kg}\cdot\text{m/s}^2$, un joule è un newton per un metro, un watt è un joule al secondo e un pascal è un newton al metro quadrato.

| Prefisso | Simbolo | Fattore |
| --- | --- | --- |
| giga | G | $10^{9}$ |
| mega | M | $10^{6}$ |
| chilo | k | $10^{3}$ |
| centi | c | $10^{-2}$ |
| milli | m | $10^{-3}$ |
| micro | μ | $10^{-6}$ |
| nano | n | $10^{-9}$ |

Un prefisso si eleva al quadrato o al cubo insieme alla sua unità: $1\ \text{cm}^2 = (10^{-2}\ \text{m})^2 = 10^{-4}\ \text{m}^2$ e $1\ \text{cm}^3 = 10^{-6}\ \text{m}^3$. Un litro è $1\ \text{dm}^3 = 10^{-3}\ \text{m}^3$. Per le velocità vale $1\ \text{m/s} = 3{,}6\ \text{km/h}$: per passare da km/h a m/s si divide per 3,6, quindi $72\ \text{km/h} = 20\ \text{m/s}$.

### Il controllo dimensionale

I due membri di un'equazione corretta hanno le stesse unità. Se ricordi solo a metà che lo spazio percorso partendo da fermo con accelerazione costante è $\frac{1}{2}at^2$, controlla: $\text{m/s}^2 \times \text{s}^2 = \text{m}$, una lunghezza. Una formula che desse $at$ per uno spazio va scartata subito, perché $\text{m/s}^2 \times \text{s} = \text{m/s}$, una velocità. Le unità non rivelano un $\frac{1}{2}$ mancante, ma smascherano gran parte delle formule sbagliate e spesso eliminano qualche opzione prima di qualsiasi calcolo.

### Grandezze scalari e vettoriali

Una grandezza scalare (*scalar*) ha solo un valore: massa, tempo, energia, temperatura. Una grandezza vettoriale (*vector*) ha modulo, direzione e verso: spostamento, velocità, accelerazione, forza. I vettori si sommano mettendo la coda di uno sulla punta dell'altro. Due vettori sulla stessa retta si sommano o si sottraggono come numeri con segno; due vettori perpendicolari si combinano con il teorema di Pitagora, quindi 3 unità e 4 unità ad angolo retto danno una risultante di 5 unità.

Per scomporre un vettore di modulo $F$ che forma un angolo $\theta$ con l'orizzontale se ne prendono le componenti

$$F_x = F\cos\theta, \qquad F_y = F\sin\theta.$$

Senza calcolatrice bastano questi valori:

| $\theta$ | $0^\circ$ | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ |
| --- | --- | --- | --- | --- | --- |
| $\sin\theta$ | $0$ | $\frac{1}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{3}}{2}$ | $1$ |
| $\cos\theta$ | $1$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{1}{2}$ | $0$ |

Con $\sqrt{2} \approx 1{,}41$ e $\sqrt{3} \approx 1{,}73$ puoi stimare qualsiasi risultato.

### Descrivere il moto

La distanza percorsa è la lunghezza del cammino, una grandezza scalare; lo spostamento (*displacement*) è la variazione di posizione in linea retta, un vettore. La velocità scalare (*speed*) è la distanza divisa per il tempo; la velocità vettoriale (*velocity*) è lo spostamento diviso per il tempo. Un'atleta che corre un giro di pista di 400 m in 80 s ha una velocità scalare media di 5 m/s ma una velocità vettoriale media nulla, perché arriva dove era partita. L'accelerazione è la rapidità con cui cambia la velocità, $a = \frac{\Delta v}{\Delta t}$, in $\text{m/s}^2$.

I grafici contengono le stesse informazioni. In un grafico posizione–tempo la pendenza è la velocità. In un grafico velocità–tempo la pendenza è l'accelerazione, e l'area compresa tra la linea e l'asse dei tempi è lo spostamento.

### Le equazioni del moto uniformemente accelerato

Quando l'accelerazione è costante, il moto è descritto da cinque grandezze: la velocità iniziale $u$ (nei testi italiani spesso $v_0$), la velocità finale $v$, l'accelerazione $a$, il tempo $t$ e lo spostamento $s$. Ogni equazione ne lascia fuori una:

| Equazione | Non contiene |
| --- | --- |
| $v = u + at$ | $s$ |
| $s = ut + \frac{1}{2}at^2$ | $v$ |
| $v^2 = u^2 + 2as$ | $t$ |
| $s = \frac{u + v}{2}\,t$ | $a$ |

Scrivi le tre grandezze note e quella cercata: l'equazione che non contiene la quinta è quella da usare. Scegli prima un verso positivo e dai a ogni grandezza vettoriale il suo segno.

### Caduta libera e moto dei proiettili

In assenza di resistenza dell'aria, ogni corpo vicino alla superficie terrestre cade con la stessa accelerazione $g$, qualunque sia la sua massa: è la caduta libera (*free fall*). Lasciato cadere da fermo, un corpo percorre $\frac{1}{2}gt^2$ nel tempo $t$: 5 m dopo un secondo, 20 m dopo due, 45 m dopo tre. Lanciato verso l'alto con velocità $u$, sale per $\frac{u}{g}$ secondi fino a un'altezza $\frac{u^2}{2g}$, poi ricade.

I moti orizzontale e verticale di un proiettile (*projectile*) sono indipendenti. In orizzontale non agisce alcuna forza, quindi la velocità orizzontale resta costante; in verticale il moto è una caduta libera. Il tempo di volo dipende solo dal moto verticale, e la distanza orizzontale è la velocità orizzontale moltiplicata per quel tempo.
`,
  examples: [
    {
      id: 'example-braking-car',
      title: md`Un'auto che frena fino a fermarsi`,
      problemMd: md`Un'auto che viaggia a 72 km/h frena con decelerazione costante e si ferma in 4,0 s. Trova la decelerazione e lo spazio di frenata.`,
      steps: [
        md`Prima di tutto converti in unità SI: $72 : 3{,}6 = 20$, quindi $u = 20\ \text{m/s}$, $v = 0$ e $t = 4{,}0\ \text{s}$.`,
        md`L'equazione senza $s$ dà l'accelerazione: $a = \frac{v - u}{t} = \frac{0 - 20}{4} = -5\ \text{m/s}^2$. Il segno meno indica che l'accelerazione si oppone al moto.`,
        md`L'equazione senza $a$ dà lo spazio: $s = \frac{u + v}{2}\,t = \frac{20 + 0}{2} \times 4 = 40\ \text{m}$.`,
        md`Verifica per un'altra strada: $v^2 = u^2 + 2as$ dà $0 = 400 - 10s$, quindi di nuovo $s = 40\ \text{m}$.`,
      ],
      answerMd: md`La decelerazione è $5\ \text{m/s}^2$ e l'auto si ferma in 40 m. Lasciando la velocità in km/h si ottiene $\frac{72}{2} \times 4 = 144\ \text{m}$, uno spazio di gran lunga troppo grande.`,
    },
    {
      id: 'example-cliff-projectile',
      title: 'Una palla lanciata in orizzontale da una scogliera',
      problemMd: md`Una palla viene lanciata in orizzontale a 15 m/s dalla cima di una scogliera alta 20 m. Trascurando la resistenza dell'aria e con $g = 10\ \text{m/s}^2$, trova il tempo che impiega a toccare terra, a che distanza dalla base della scogliera atterra e la sua velocità all'impatto.`,
      steps: [
        md`Prima il moto verticale: la palla parte con velocità verticale nulla, quindi $20 = \frac{1}{2} \times 10 \times t^2$, da cui $t^2 = 4$ e $t = 2\ \text{s}$. I 15 m/s qui non contano.`,
        md`Moto orizzontale: la velocità resta 15 m/s, quindi la palla atterra a $15 \times 2 = 30\ \text{m}$ dalla scogliera.`,
        md`All'impatto la velocità verticale è $gt = 20\ \text{m/s}$. Le due componenti sono perpendicolari, quindi il modulo della velocità è $\sqrt{15^2 + 20^2} = \sqrt{625} = 25\ \text{m/s}$.`,
        md`Verifica per un'altra strada: $v^2 = u^2 + 2gh = 225 + 400 = 625$, quindi $v = 25\ \text{m/s}$.`,
      ],
      answerMd: md`La palla cade per 2 s, atterra a 30 m dalla scogliera e tocca terra a 25 m/s. Sommare le componenti come numeri, $15 + 20 = 35\ \text{m/s}$, è la risposta sbagliata che tenta: i vettori perpendicolari si combinano con Pitagora.`,
    },
    {
      id: 'example-river-crossing',
      title: 'Attraversare un fiume a nuoto',
      problemMd: md`Una nuotatrice nuota a 4,0 m/s rispetto all'acqua, puntando sempre dritto verso la riva opposta di un fiume largo 80 m. La corrente scorre a 3,0 m/s parallela alle rive. Quanto tempo impiega ad attraversare, quanto più a valle arriva e qual è la sua velocità rispetto alla riva?`,
      steps: [
        md`La sua velocità rispetto alla riva ha due componenti perpendicolari: 4,0 m/s verso l'altra riva e 3,0 m/s verso valle. Agiscono in modo indipendente.`,
        md`Solo la componente trasversale la porta all'altra riva: $t = \frac{80}{4} = 20\ \text{s}$.`,
        md`In quel tempo la corrente la trascina a valle di $3 \times 20 = 60\ \text{m}$.`,
        md`La sua velocità rispetto alla riva è $\sqrt{4^2 + 3^2} = 5\ \text{m/s}$. Verifica: il suo percorso è lungo $\sqrt{80^2 + 60^2} = 100\ \text{m}$, e $5 \times 20 = 100\ \text{m}$.`,
      ],
      answerMd: md`Attraversa in 20 s, arriva 60 m più a valle e si muove a 5,0 m/s rispetto alla riva. Dividere il percorso di 100 m per 4,0 m/s dà 25 s, un errore che mescola la velocità rispetto all'acqua con un percorso misurato rispetto alla riva.`,
    },
  ],
  traps: [
    {
      title: 'Lasciare le velocità in km/h',
      md: md`Una velocità in km/h inserita direttamente in un'equazione con $g$ o con tempi in secondi dà risultati assurdi, spesso 3,6 o 12,96 volte troppo grandi. Converti ogni grandezza in unità SI prima di cominciare: dividi i km/h per 3,6.`,
    },
    {
      title: md`Convertire un'area o un volume con il prefisso semplice`,
      md: md`Poiché $1\ \text{cm} = 10^{-2}\ \text{m}$, viene la tentazione di scrivere $5\ \text{cm}^2 = 5 \times 10^{-2}\ \text{m}^2$. Il prefisso va elevato al quadrato insieme all'unità: $5\ \text{cm}^2 = 5 \times 10^{-4}\ \text{m}^2$, e $1\ \text{cm}^3 = 10^{-6}\ \text{m}^3$.`,
    },
    {
      title: 'Scambiare la distanza per lo spostamento',
      md: md`Dopo un percorso di andata e ritorno lo spostamento è nullo, quindi la velocità vettoriale media è nulla anche se la velocità scalare media non lo è. Quando un quesito parla di *velocity* o di *displacement*, chiediti dove si trova il corpo alla fine rispetto al punto di partenza.`,
    },
    {
      title: 'Far dipendere la caduta dal moto orizzontale',
      md: md`Una palla lanciata in orizzontale non resta in aria più a lungo di una lasciata cadere dalla stessa altezza, e una palla più pesante non cade più in fretta. Il tempo di caduta dipende solo dall'altezza e da $g$; la velocità orizzontale stabilisce soltanto quanta strada fa la palla in quel tempo.`,
    },
  ],
  check: [
    {
      id: 'check-train-distance',
      title: 'Lo spazio percorso partendo da fermo',
      topic: 'Cinematica',
      stemMd: md`Un treno parte da fermo e accelera uniformemente fino a 30 m/s in 10 s. Quanta strada percorre in quel tempo?`,
      options: [
        { id: 'A', text: md`3 m`, note: md`È l'accelerazione, $\frac{30}{10} = 3\ \text{m/s}^2$, scambiata per una distanza.` },
        { id: 'B', text: md`150 m`, note: '' },
        { id: 'C', text: md`300 m`, note: md`Moltiplica la velocità finale per il tempo, come se il treno andasse a 30 m/s per tutto il tempo; la sua velocità media è solo 15 m/s.` },
        { id: 'D', text: md`450 m`, note: md`Usa $v^2 = 2as$ ma tralascia l'accelerazione: $\frac{30^2}{2} = 450$. Dividendo anche per $a = 3\ \text{m/s}^2$ si ottiene la distanza.` },
        { id: 'E', text: md`1500 m`, note: md`Inserisce 30 come accelerazione in $\frac{1}{2}at^2$; 30 m/s è la velocità finale, e l'accelerazione è $3\ \text{m/s}^2$.` },
      ],
      answer: 'B',
      workingMd: md`L'accelerazione è $a = \frac{30 - 0}{10} = 3\ \text{m/s}^2$, quindi $s = \frac{1}{2}at^2 = \frac{1}{2} \times 3 \times 100 = 150\ \text{m}$. Per un'altra strada: la velocità media è $\frac{0 + 30}{2} = 15\ \text{m/s}$, e $15 \times 10 = 150\ \text{m}$.`,
      lesson: md`Con accelerazione costante partendo da fermo, la velocità media è metà della velocità finale.`,
    },
    {
      id: 'check-bridge-drop',
      title: 'Un sasso lasciato cadere da un ponte',
      topic: 'Cinematica',
      stemMd: md`Un sasso viene lasciato cadere da fermo da un ponte e colpisce l'acqua 3,0 s dopo. Trascurando la resistenza dell'aria e con $g = 10\ \text{m/s}^2$, a che altezza sull'acqua si trova il ponte?`,
      options: [
        { id: 'A', text: md`15 m`, note: md`Usa $\frac{1}{2}gt$ e dimentica di elevare il tempo al quadrato.` },
        { id: 'B', text: md`30 m`, note: md`È la velocità del sasso all'impatto, $gt = 30\ \text{m/s}$, non l'altezza.` },
        { id: 'C', text: md`44,1 m`, note: md`Usa $g = 9{,}8\ \text{m/s}^2$; il quesito fissa $g = 10\ \text{m/s}^2$, ed è questo il valore da usare.` },
        { id: 'D', text: md`45 m`, note: '' },
        { id: 'E', text: md`90 m`, note: md`Usa $gt^2$ e perde il fattore $\frac{1}{2}$.` },
      ],
      answer: 'D',
      workingMd: md`Da fermo, $h = \frac{1}{2}gt^2 = \frac{1}{2} \times 10 \times 3^2 = 45\ \text{m}$. Per un'altra strada: la velocità finale è $gt = 30\ \text{m/s}$, la velocità media 15 m/s, e $15 \times 3 = 45\ \text{m}$.`,
      lesson: md`Un corpo lasciato cadere da fermo percorre 5 m, 20 m e 45 m dopo 1, 2 e 3 secondi: lo spazio cresce con il quadrato del tempo.`,
    },
    {
      id: 'check-two-balls',
      title: 'Rotolata giù o lasciata cadere',
      topic: 'Cinematica',
      stemMd: md`La pallina P rotola giù dal bordo di un tavolo orizzontale a 4 m/s nello stesso istante in cui la pallina Q viene lasciata cadere da ferma dalla stessa altezza. Trascurando la resistenza dell'aria, quale affermazione è corretta?`,
      options: [
        { id: 'A', text: md`Q tocca terra per prima, perché il suo percorso è più corto.`, note: md`La lunghezza del percorso non conta: entrambe partono con velocità verticale nulla e hanno la stessa accelerazione verticale, quindi cadono per lo stesso tempo.` },
        { id: 'B', text: md`P tocca terra per prima, perché si muove più velocemente.`, note: md`La velocità orizzontale non influisce sul moto verticale; il tempo di caduta dipende solo dall'altezza e da $g$.` },
        { id: 'C', text: md`Toccano terra nello stesso istante.`, note: '' },
        { id: 'D', text: md`Toccano terra nello stesso istante solo se hanno la stessa massa.`, note: md`In caduta libera l'accelerazione è $g$ qualunque sia la massa, quindi la massa non influisce sul tempo di caduta.` },
        { id: 'E', text: md`Toccano terra nello stesso istante e con la stessa velocità.`, note: md`I tempi sono uguali, ma P conserva anche la sua velocità orizzontale di 4 m/s, quindi arriva a terra più veloce di Q.` },
      ],
      answer: 'C',
      workingMd: md`In verticale entrambe le palline partono con velocità nulla e accelerano con $g$ per la stessa altezza $h$, quindi $h = \frac{1}{2}gt^2$ dà lo stesso $t$ per tutte e due. P si muove anche di lato a 4 m/s, quindi la sua velocità all'arrivo è $\sqrt{4^2 + v_y^2}$, maggiore della $v_y$ di Q.`,
      lesson: md`Moto orizzontale e moto verticale sono indipendenti: il tempo di caduta è fissato solo dal moto verticale.`,
    },
  ],
  takeaways: [
    md`Converti in unità SI prima di calcolare: dividi i km/h per 3,6 ed eleva al quadrato o al cubo il prefisso insieme alla sua unità.`,
    md`I vettori perpendicolari si combinano con Pitagora; un vettore $F$ ad angolo $\theta$ ha componenti $F\cos\theta$ e $F\sin\theta$.`,
    md`Scegli l'equazione del moto uniformemente accelerato che non contiene la grandezza che non conosci e non cerchi.`,
    md`In caduta libera ogni corpo accelera con $g$; la velocità orizzontale di un proiettile resta costante.`,
  ],
  flashcards: [
    { front: md`Le sette unità fondamentali del SI`, back: md`Metro (m), chilogrammo (kg), secondo (s), ampere (A), kelvin (K), mole (mol) e candela (cd). Tutte le altre unità, come il newton e il joule, derivano da queste.` },
    { front: md`Da km/h a m/s`, back: md`Si divide per 3,6, perché 1 m/s = 3,6 km/h. Per esempio, 72 km/h = 20 m/s.` },
    { front: md`Convertire un'area o un volume tra cm e m`, back: md`Il prefisso si eleva al quadrato o al cubo insieme all'unità: $1\ \text{cm}^2 = 10^{-4}\ \text{m}^2$ e $1\ \text{cm}^3 = 10^{-6}\ \text{m}^3$.` },
    { front: md`Le quattro equazioni del moto uniformemente accelerato`, back: md`$v = u + at$, $s = ut + \frac{1}{2}at^2$, $v^2 = u^2 + 2as$ e $s = \frac{u + v}{2}\,t$. Ognuna lascia fuori una tra $u$, $v$, $a$, $t$ e $s$.` },
    { front: md`Che cosa mostra un grafico velocità–tempo`, back: md`La sua pendenza è l'accelerazione, e l'area tra la linea e l'asse dei tempi è lo spostamento.` },
    { front: md`I due moti di un proiettile`, back: md`In orizzontale velocità costante, perché non agisce alcuna forza; in verticale caduta libera con accelerazione $g$. Il tempo di volo dipende solo dal moto verticale.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-mechanics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const forcesAndNewtonsLawsLessonIt: Lesson = {
  slug: 'forces-and-newtons-laws',
  title: 'Forze e leggi di Newton',
  summary: 'Le tre leggi di Newton, i diagrammi delle forze, attrito, piani inclinati, ascensori e moto circolare: ogni problema di forze ridotto a F = ma.',
  minutes: 22,
  objectives: [
    md`Enunciare le tre leggi di Newton e riconoscere correttamente le coppie del terzo principio.`,
    md`Disegnare il diagramma di corpo libero e applicare l'equazione della forza risultante a blocchi, piani inclinati, carrucole e ascensori.`,
    md`Spiegare il moto circolare con una forza risultante diretta verso il centro e usare la condizione di equilibrio dei momenti.`,
  ],
  teachMd: md`
### La forza e il newton

Una forza è una spinta o una trazione: un vettore, che si misura in newton. Un newton imprime a una massa di 1 kg un'accelerazione di $1\ \text{m/s}^2$. Il moto di un corpo dipende dalla **forza risultante** (*net force*), la somma vettoriale di tutte le forze che agiscono su quel corpo. Comincia ogni problema con il diagramma di corpo libero (*free-body diagram*): un solo corpo, ogni forza che agisce su di esso disegnata come una freccia, e nient'altro.

### I tre principi della dinamica

1. **Primo principio (inerzia).** Se la forza risultante su un corpo è nulla, la sua velocità non cambia: resta fermo, oppure continua a muoversi in linea retta a velocità costante. Una velocità costante non richiede alcuna forza risultante. Un paracadutista che scende a velocità costante subisce una resistenza dell'aria esattamente uguale al suo peso.
2. **Secondo principio.** $F_{\text{net}} = ma$. L'accelerazione ha la direzione e il verso della forza risultante, e la massa misura quanto è difficile accelerare il corpo.
3. **Terzo principio.** Se un corpo A esercita una forza sul corpo B, B esercita su A una forza di uguale intensità, verso opposto e della stessa natura. Le due forze agiscono su corpi **diversi**, quindi non si annullano mai a vicenda.

### Le forze che incontrerai

- **Peso** (*weight*), $W = mg$: l'attrazione gravitazionale della Terra, diretta verso il centro della Terra. Una persona di 60 kg pesa 600 N. Sulla Luna, dove il campo gravitazionale è circa un sesto di quello terrestre, la stessa persona pesa circa 100 N ma ha sempre una massa di 60 kg.
- **Reazione vincolare** o forza normale (*normal force*), esercitata da una superficie e perpendicolare a essa. È grande solo quanto serve per impedire al corpo di penetrare nella superficie. È uguale a $mg$ solo per un corpo su una superficie orizzontale, senza altre forze verticali e senza accelerazione verticale.
- **Tensione** (*tension*), in un filo o in una fune, diretta lungo il filo. Un filo leggero che passa su una carrucola senza attrito ha la stessa tensione in ogni punto.
- **Attrito** (*friction*), parallelo alla superficie e opposto allo strisciamento. L'attrito statico si adatta fino a un massimo di $\mu_s N$; quando il corpo scivola, l'attrito dinamico vale $\mu_k N$, di solito un po' meno. $N$ è la forza normale e $\mu$ il coefficiente di attrito.
- **Gravitazione** tra due masse qualsiasi: $F = \frac{Gm_1m_2}{r^2}$, con $G \approx 6{,}7 \times 10^{-11}\ \text{N m}^2/\text{kg}^2$. Raddoppiando la distanza tra i centri, la forza si riduce a un quarto.

### Il piano inclinato

Su un pendio inclinato di un angolo $\theta$, scomponi il peso lungo il piano e perpendicolarmente a esso:

$$W_{\parallel} = mg\sin\theta, \qquad W_{\perp} = mg\cos\theta.$$

In direzione perpendicolare al piano non c'è accelerazione, quindi la forza normale è $N = mg\cos\theta$. Lungo un piano senza attrito la forza risultante è $mg\sin\theta$, quindi $a = g\sin\theta$ qualunque sia la massa: $5\ \text{m/s}^2$ su un piano inclinato di $30^\circ$. Con l'attrito, sottrai $\mu_k mg\cos\theta$ dalla componente lungo il piano.

### Il peso apparente in ascensore

Una bilancia pesapersone indica la forza normale che esercita su di te. Per una persona di massa $m$ in un ascensore con accelerazione $a$, positiva verso l'alto, il secondo principio dà $N - mg = ma$, quindi

$$N = m(g + a).$$

Quando l'ascensore accelera verso l'alto, o rallenta mentre scende, la bilancia indica più di $mg$. Quando accelera verso il basso, o rallenta mentre sale, indica meno. In caduta libera ($a = -g$) indica zero: è questo che significa "assenza di peso". Conta il verso dell'accelerazione, non quello del moto.

### Il moto circolare

Un corpo che percorre una circonferenza di raggio $r$ con velocità di modulo costante $v$ sta accelerando, perché la direzione della sua velocità cambia continuamente. L'accelerazione è diretta verso il centro e vale $a = \frac{v^2}{r}$. Serve quindi una forza risultante diretta verso il centro

$$F = \frac{mv^2}{r},$$

fornita da forze reali: la tensione di un filo, l'attrito sugli pneumatici di un'auto, la gravità su un satellite. "Centripeta" (*centripetal*) indica il ruolo che queste forze svolgono; non è una forza in più da aggiungere al diagramma.

### Gli effetti di rotazione

Il momento di una forza (*torque*) rispetto a un perno è il prodotto della forza per la distanza perpendicolare tra il perno e la retta d'azione della forza, in N m. Un corpo rigido in equilibrio ha forza risultante nulla **e** momento risultante nullo. Su un'altalena a bilico in equilibrio vale $F_1 d_1 = F_2 d_2$: un bambino di 300 N a 2 m dal perno equilibra un adulto di 600 N a 1 m.

### Un metodo per ogni problema di dinamica

1. Scegli il corpo, o un gruppo di corpi che si muovono insieme.
2. Disegna tutte le forze che agiscono su di esso.
3. Scegli un verso positivo, nel verso dell'accelerazione se lo conosci.
4. Scrivi $F_{\text{net}} = ma$ lungo quella direzione, e usa la direzione perpendicolare (dove l'accelerazione è nulla) per trovare forze incognite come la forza normale.
5. Controlla le unità e chiediti se il risultato è sensato: una tensione compresa tra due pesi, un'accelerazione minore di $g$ per un corpo tirato verso il basso solo dalla gravità.
`,
  examples: [
    {
      id: 'example-friction-floor',
      title: 'Trascinare una cassa su un pavimento ruvido',
      problemMd: md`Una cassa di 5,0 kg su un pavimento orizzontale viene tirata orizzontalmente con una forza di 30 N. Il coefficiente di attrito dinamico è 0,40. Con $g = 10\ \text{m/s}^2$, trova l'accelerazione della cassa e la sua velocità 3,0 s dopo la partenza da ferma.`,
      steps: [
        md`In verticale non c'è accelerazione, quindi la forza normale equilibra il peso: $N = mg = 5 \times 10 = 50\ \text{N}$.`,
        md`L'attrito dinamico si oppone al moto: $f = \mu_k N = 0{,}40 \times 50 = 20\ \text{N}$.`,
        md`La forza risultante orizzontale è $30 - 20 = 10\ \text{N}$, quindi $a = \frac{F_{\text{net}}}{m} = \frac{10}{5} = 2{,}0\ \text{m/s}^2$.`,
        md`Partendo da ferma, $v = u + at = 0 + 2 \times 3 = 6{,}0\ \text{m/s}$.`,
      ],
      answerMd: md`La cassa accelera a $2{,}0\ \text{m/s}^2$ e raggiunge 6,0 m/s dopo 3,0 s. Dimenticando l'attrito si ottiene $\frac{30}{5} = 6\ \text{m/s}^2$, la risposta sbagliata che tenta.`,
    },
    {
      id: 'example-lift-scale',
      title: md`Una bilancia in ascensore`,
      problemMd: md`Una persona di 60 kg sta su una bilancia pesapersone in ascensore. Con $g = 10\ \text{m/s}^2$, quale forza esercita la bilancia sulla persona quando l'ascensore (a) accelera verso l'alto a $2{,}0\ \text{m/s}^2$, (b) sale a velocità costante, (c) sale rallentando a $2{,}0\ \text{m/s}^2$?`,
      steps: [
        md`Sulla persona agiscono due forze: il peso, $60 \times 10 = 600\ \text{N}$ verso il basso, e la forza normale $N$ verso l'alto. Con il verso positivo in alto, $N - 600 = 60a$.`,
        md`(a) $a = +2$: $N = 600 + 120 = 720\ \text{N}$.`,
        md`(b) $a = 0$: $N = 600\ \text{N}$. Velocità costante significa forza risultante nulla (primo principio).`,
        md`(c) Rallentare mentre si sale significa che l'accelerazione è rivolta verso il basso: $a = -2$, quindi $N = 600 - 120 = 480\ \text{N}$.`,
      ],
      answerMd: md`La bilancia spinge con 720 N, 600 N e 480 N. Nel caso (c), prendere l'accelerazione verso l'alto perché l'ascensore sale dà 720 N, la risposta sbagliata che tenta.`,
    },
    {
      id: 'example-pulley-masses',
      title: 'Due masse appese a una carrucola',
      problemMd: md`Due masse di 3,0 kg e 2,0 kg sono appese alle estremità di un filo leggero che passa su una carrucola senza attrito. Con $g = 10\ \text{m/s}^2$, trova la loro accelerazione e la tensione del filo.`,
      steps: [
        md`Considera le due masse come un unico sistema che si muove insieme. La tensione è una forza interna e si elimina; la forza motrice è la differenza dei pesi, $30 - 20 = 10\ \text{N}$, che agisce su una massa totale di 5,0 kg. Quindi $a = \frac{10}{5} = 2{,}0\ \text{m/s}^2$.`,
        md`La massa di 2,0 kg accelera verso l'alto: $T - 20 = 2 \times 2$, quindi $T = 24\ \text{N}$.`,
        md`Verifica con la massa di 3,0 kg, che accelera verso il basso: $30 - T = 3 \times 2$, quindi di nuovo $T = 24\ \text{N}$.`,
      ],
      answerMd: md`Le masse accelerano a $2{,}0\ \text{m/s}^2$ e la tensione è 24 N. La tensione non è né 20 N né 30 N: è compresa tra i due pesi, come deve essere se una massa sale e l'altra scende.`,
    },
  ],
  traps: [
    {
      title: 'Accoppiare il peso con la forza normale',
      md: md`Per un libro su un tavolo, il peso e la forza normale sono uguali e opposti, ma agiscono sullo stesso corpo e sono forze di natura diversa: si equilibrano per il primo principio. La forza che fa coppia, secondo il terzo principio, con l'attrazione della Terra sul libro è l'attrazione del libro sulla Terra.`,
    },
    {
      title: 'Pensare che il moto richieda una forza risultante',
      md: md`Un corpo che si muove a velocità costante ha forza risultante nulla. Quando un quesito dice che un corpo "si muove a velocità costante in linea retta", scrivi subito $F_{\text{net}} = 0$: la forza motrice è uguale alle forze resistenti.`,
    },
    {
      title: 'Dare per scontato che la forza normale sia sempre mg',
      md: md`Su un piano inclinato $N = mg\cos\theta$; in un ascensore che accelera $N = m(g + a)$; e una spinta obliqua aggiunge o toglie una componente verticale. Ricava ogni volta $N$ dalle forze perpendicolari alla superficie, soprattutto prima di calcolare l'attrito.`,
    },
    {
      title: 'Aggiungere la forza centripeta al diagramma',
      md: md`La forza centripeta è la risultante verso il centro delle forze reali, non una forza in più. Disegna solo tensione, peso, attrito e forze normali, poi poni la loro risultante verso il centro uguale a $\frac{mv^2}{r}$.`,
    },
  ],
  check: [
    {
      id: 'check-ramp-acceleration',
      title: 'Giù da una rampa liscia',
      topic: 'Dinamica',
      stemMd: md`Una scatola di 2,0 kg scivola lungo una rampa senza attrito inclinata di $30^\circ$ rispetto all'orizzontale. Con $g = 10\ \text{m/s}^2$, qual è la sua accelerazione lungo la rampa?`,
      options: [
        { id: 'A', text: md`$2{,}5\ \text{m/s}^2$`, note: md`Divide $g\sin 30^\circ$ anche per la massa; la massa si è già semplificata in $a = \frac{mg\sin\theta}{m}$.` },
        { id: 'B', text: md`$5\ \text{m/s}^2$`, note: '' },
        { id: 'C', text: md`$5\sqrt{3} \approx 8{,}7\ \text{m/s}^2$`, note: md`Usa $g\cos 30^\circ$, la componente perpendicolare alla rampa, che è equilibrata dalla forza normale.` },
        { id: 'D', text: md`$10\ \text{m/s}^2$`, note: md`Usa l'intera accelerazione di caduta libera e ignora l'inclinazione.` },
        { id: 'E', text: md`$20\ \text{m/s}^2$`, note: md`È il peso, $mg = 20\ \text{N}$, una forza, letta come un'accelerazione.` },
      ],
      answer: 'B',
      workingMd: md`La componente del peso lungo la rampa è $mg\sin 30^\circ = 20 \times \frac{1}{2} = 10\ \text{N}$, e nulla vi si oppone, quindi $a = \frac{10}{2} = 5\ \text{m/s}^2$. Direttamente: $a = g\sin\theta = 10 \times \frac{1}{2} = 5\ \text{m/s}^2$.`,
      lesson: md`Su un piano inclinato senza attrito l'accelerazione è $g\sin\theta$, qualunque sia la massa.`,
    },
    {
      id: 'check-third-law-pair',
      title: 'La forza che fa coppia per il terzo principio',
      topic: 'Dinamica',
      stemMd: md`Un libro è appoggiato su un tavolo orizzontale. Quale forza forma una coppia del terzo principio di Newton con l'attrazione gravitazionale della Terra sul libro?`,
      options: [
        { id: 'A', text: md`La forza normale del tavolo sul libro, diretta verso l'alto.`, note: md`È uguale e opposta al peso, ma agisce sullo stesso corpo ed è una forza di contatto; quell'equilibrio deriva dal primo principio, non dal terzo.` },
        { id: 'B', text: md`La spinta del libro sul tavolo, diretta verso il basso.`, note: md`Questa fa coppia con la forza normale del tavolo sul libro, una forza di contatto, non con l'attrazione gravitazionale.` },
        { id: 'C', text: md`L'attrazione gravitazionale del libro sulla Terra.`, note: '' },
        { id: 'D', text: md`La forza di attrito del tavolo sul libro.`, note: md`Su un libro fermo su un tavolo orizzontale, senza spinte laterali, non agisce alcun attrito; e comunque l'attrito non è una forza gravitazionale.` },
        { id: 'E', text: md`Nessuna, perché il libro è fermo.`, note: md`Le coppie del terzo principio esistono che qualcosa si muova o no: ogni forza è metà di una coppia.` },
      ],
      answer: 'C',
      workingMd: md`Una coppia del terzo principio è formata da due forze della stessa natura, di uguale intensità e verso opposto, ciascuna applicata all'altro corpo della stessa interazione. Qui l'interazione è gravitazionale, tra la Terra e il libro, quindi l'altra forza è l'attrazione gravitazionale del libro sulla Terra, che agisce sulla Terra.`,
      lesson: md`Le due forze di una coppia del terzo principio agiscono su corpi diversi e sono della stessa natura.`,
    },
    {
      id: 'check-lift-slowing',
      title: 'Bilancia in un ascensore che rallenta',
      topic: 'Dinamica',
      stemMd: md`Una persona di 50 kg sta su una bilancia in un ascensore che scende rallentando a $2{,}0\ \text{m/s}^2$. Con $g = 10\ \text{m/s}^2$, quale forza esercita la bilancia sulla persona?`,
      options: [
        { id: 'A', text: md`50 N`, note: md`Prende la massa in chilogrammi come una forza in newton; il peso è $mg = 500\ \text{N}$.` },
        { id: 'B', text: md`100 N`, note: md`È solo $ma$, la forza risultante; la bilancia deve anche sostenere il peso.` },
        { id: 'C', text: md`400 N`, note: md`Prende l'accelerazione verso il basso perché l'ascensore scende; per rallentare un moto verso il basso serve un'accelerazione verso l'alto.` },
        { id: 'D', text: md`500 N`, note: md`Ignora l'accelerazione; la bilancia indica il peso solo quando la velocità è costante.` },
        { id: 'E', text: md`600 N`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Rallentare mentre si scende significa che l'accelerazione è rivolta verso l'alto. Con il verso positivo in alto, $N - mg = ma$, quindi $N = m(g + a) = 50 \times (10 + 2) = 600\ \text{N}$.`,
      lesson: md`È il verso dell'accelerazione, non quello del moto, a decidere se la bilancia indica più o meno del peso.`,
    },
  ],
  takeaways: [
    md`Il secondo principio usa la forza risultante: $F_{\text{net}} = ma$, con l'accelerazione nel verso della forza risultante.`,
    md`Forza risultante nulla significa velocità costante, non necessariamente quiete.`,
    md`Le forze di una coppia del terzo principio agiscono su corpi diversi e sono della stessa natura.`,
    md`Su un piano inclinato il peso si scompone in $mg\sin\theta$ lungo il piano e $mg\cos\theta$ perpendicolare a esso.`,
    md`Il moto circolare richiede una forza risultante verso il centro pari a $\frac{mv^2}{r}$, fornita da forze reali.`,
  ],
  flashcards: [
    { front: md`Primo principio della dinamica`, back: md`Se la forza risultante è nulla, un corpo resta fermo oppure continua a muoversi in linea retta a velocità costante.` },
    { front: md`Secondo principio della dinamica`, back: md`$F_{\text{net}} = ma$: l'accelerazione ha il verso della forza risultante ed è inversamente proporzionale alla massa.` },
    { front: md`Terzo principio della dinamica`, back: md`Se A esercita una forza su B, B esercita su A una forza uguale e opposta della stessa natura. Le due forze agiscono su corpi diversi.` },
    { front: md`Attrito statico e dinamico`, back: md`L'attrito statico si adatta fino a $\mu_s N$; l'attrito durante lo strisciamento vale $\mu_k N$, dove $N$ è la forza normale.` },
    { front: md`Accelerazione lungo un piano inclinato senza attrito`, back: md`$a = g\sin\theta$, indipendente dalla massa; la forza normale è $mg\cos\theta$.` },
    { front: md`Lettura della bilancia in un ascensore che accelera`, back: md`$N = m(g + a)$ con $a$ positiva verso l'alto: più di $mg$ quando l'accelerazione è verso l'alto, meno quando è verso il basso, zero in caduta libera.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-mechanics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const workEnergyAndMomentumLessonIt: Lesson = {
  slug: 'work-energy-and-momentum',
  title: 'Lavoro, energia e quantità di moto',
  summary: 'Lavoro, energia cinetica e potenziale, potenza e quantità di moto: quando si conserva l\'energia, quando la quantità di moto, e come usarle.',
  minutes: 22,
  objectives: [
    md`Calcolare lavoro, energia cinetica e potenziale e potenza, e usare il teorema dell'energia cinetica.`,
    md`Usare la conservazione dell'energia meccanica e tenere conto dell'energia dissipata dall'attrito.`,
    md`Applicare l'impulso e la conservazione della quantità di moto a urti ed esplosioni, distinguendo gli urti elastici da quelli anelastici.`,
  ],
  teachMd: md`
### Il lavoro: forza per spostamento

Una forza compie lavoro (*work*) quando il suo punto di applicazione si sposta nella direzione della forza:

$$W = Fs\cos\theta$$

dove $\theta$ è l'angolo tra la forza e lo spostamento. Il lavoro è una grandezza scalare e si misura in joule ($1\ \text{J} = 1\ \text{N m}$). Contano tre casi:

- forza nel verso del moto ($\theta = 0^\circ$): $W = Fs$, positivo;
- forza opposta al moto ($\theta = 180^\circ$), come l'attrito: $W = -Fs$, negativo;
- forza perpendicolare al moto ($\theta = 90^\circ$): $W = 0$. La forza normale su un'auto che percorre una strada in piano, e la tensione del filo che fa ruotare una pallina lungo una circonferenza, non compiono lavoro.

In un grafico forza–spostamento, il lavoro è l'area sotto la linea.

### Energia cinetica e potenziale

L'energia cinetica (*kinetic energy*) è $E_k = \frac{1}{2}mv^2$. Cresce con il quadrato della velocità: raddoppiando la velocità, l'energia cinetica diventa quattro volte più grande.

L'energia potenziale gravitazionale (*gravitational potential energy*) vicino alla superficie terrestre è $E_p = mgh$, misurata a partire da un livello qualsiasi a tua scelta; contano solo le sue variazioni.

Una molla segue la legge di Hooke, $F = kx$, dove $x$ è l'allungamento e $k$ la costante elastica in N/m. Allungata di $x$, immagazzina un'energia potenziale elastica $\frac{1}{2}kx^2$, l'area sotto la sua retta forza–allungamento.

### Il teorema dell'energia cinetica e la conservazione dell'energia

Il lavoro totale compiuto su un corpo è uguale alla variazione della sua energia cinetica:

$$W_{\text{net}} = \Delta E_k.$$

Quando compiono lavoro solo la gravità (e le molle), l'energia meccanica si conserva: $E_k + E_p$ resta costante. Un corpo che cade da fermo per un'altezza $h$ raggiunge $v = \sqrt{2gh}$, lo stesso risultato di $v^2 = 2gh$ della cinematica, qualunque sia il percorso lungo un pendio senza attrito. Con l'attrito l'energia meccanica non si conserva: l'energia mancante è diventata energia interna, che si avverte come calore. L'energia totale si conserva sempre; cambia soltanto forma.

### Potenza e rendimento

La potenza (*power*) è la rapidità con cui si compie lavoro o si trasferisce energia: $P = \frac{W}{t}$, in watt ($1\ \text{W} = 1\ \text{J/s}$). Una forza che sposta il suo punto di applicazione a velocità costante $v$ nella propria direzione sviluppa $P = Fv$. Il chilowattora è un'energia: $1000\ \text{W} \times 3600\ \text{s} = 3{,}6 \times 10^6\ \text{J}$.

Il rendimento (*efficiency*) è l'energia utile ottenuta divisa per l'energia totale fornita. Per qualsiasi macchina reale è minore di 1, cioè del 100%.

### Quantità di moto e impulso

La quantità di moto (*momentum*) è $p = mv$, un vettore che si misura in kg m/s. Nella sua forma generale, il secondo principio dice che la forza risultante è uguale alla rapidità di variazione della quantità di moto, quindi

$$F\,\Delta t = \Delta p.$$

Il prodotto $F\,\Delta t$ è l'impulso (*impulse*). A parità di variazione della quantità di moto, un tempo di arresto più lungo significa una forza più piccola: airbag, zone a deformazione programmata e ginocchia piegate all'atterraggio funzionano tutti così.

### La conservazione della quantità di moto

Se su un sistema non agisce alcuna forza esterna, o le forze esterne si annullano, la sua quantità di moto totale resta costante. In un urto o in un'esplosione le forze interne sono coppie del terzo principio: uguali e opposte, e agiscono per lo stesso tempo. La quantità di moto che un corpo guadagna, l'altro la perde. La quantità di moto è un vettore, quindi dai il segno più alle velocità in un verso e il segno meno a quelle nell'altro.

### Urti elastici e anelastici

La quantità di moto si conserva in ogni urto; l'energia cinetica no.

| Urto | Quantità di moto | Energia cinetica |
| --- | --- | --- |
| Elastico (*elastic*) | si conserva | si conserva |
| Anelastico (*inelastic*) | si conserva | in parte diventa calore, suono e deformazione |
| Completamente anelastico (i corpi restano uniti) | si conserva | la perdita più grande possibile |

In un'esplosione da fermo la quantità di moto totale resta nulla, mentre compare energia cinetica a spese dell'energia chimica o elastica.

### Scegliere lo strumento

Se un quesito dà forze e distanze ma non tempi, usa l'energia. Se dà forze e tempi, o descrive un urto, usa la quantità di moto. Quando i corpi restano uniti, la quantità di moto dà la velocità comune; poi confronta le energie cinetiche prima e dopo per trovare quanto se n'è perso.
`,
  examples: [
    {
      id: 'example-slide-energy',
      title: 'Energia su uno scivolo',
      problemMd: md`Un bambino di 30 kg scende da fermo lungo uno scivolo la cui cima è 5,0 m più in alto della base. Con $g = 10\ \text{m/s}^2$: (a) a che velocità arriverebbe in fondo senza attrito? (b) In realtà arriva in fondo a 8,0 m/s. Quanta energia è diventata calore?`,
      steps: [
        md`Senza attrito $mgh = \frac{1}{2}mv^2$, quindi $v^2 = 2gh = 2 \times 10 \times 5 = 100$ e $v = 10\ \text{m/s}$. La massa si semplifica e la forma dello scivolo non conta.`,
        md`Energia potenziale in cima: $E_p = mgh = 30 \times 10 \times 5 = 1500\ \text{J}$.`,
        md`Energia cinetica raggiunta davvero: $E_k = \frac{1}{2} \times 30 \times 8^2 = 15 \times 64 = 960\ \text{J}$.`,
        md`La differenza è il lavoro fatto contro l'attrito: $1500 - 960 = 540\ \text{J}$.`,
      ],
      answerMd: md`Senza attrito il bambino arriverebbe a 10 m/s; in realtà 540 J sono diventati calore. Togliendo il 2 da $v^2 = 2gh$ si ottiene $\sqrt{50} \approx 7{,}1\ \text{m/s}$, meno della velocità reale con attrito: un segnale sicuro di errore.`,
    },
    {
      id: 'example-trolleys-stick',
      title: 'Due carrelli che si agganciano',
      problemMd: md`Un carrello di 2,0 kg che viaggia a 6,0 m/s urta un carrello fermo di 1,0 kg, e i due si agganciano. Trova la loro velocità subito dopo l'urto e l'energia cinetica persa.`,
      steps: [
        md`Quantità di moto prima: $2 \times 6 + 1 \times 0 = 12\ \text{kg m/s}$.`,
        md`Dopo l'urto è la stessa: $(2 + 1)v = 12$, quindi $v = 4{,}0\ \text{m/s}$.`,
        md`Energia cinetica prima: $\frac{1}{2} \times 2 \times 6^2 = 36\ \text{J}$. Dopo: $\frac{1}{2} \times 3 \times 4^2 = 24\ \text{J}$.`,
        md`Perdita: $36 - 24 = 12\ \text{J}$, un terzo di quella iniziale, trasformata in calore, suono e deformazione.`,
      ],
      answerMd: md`I carrelli agganciati si muovono a 4,0 m/s, e si perdono 12 J di energia cinetica. Usando invece la conservazione dell'energia cinetica, $\frac{1}{2} \times 3 \times v^2 = 36$, si ottiene $v = \sqrt{24} \approx 4{,}9\ \text{m/s}$: sbagliato, perché un urto in cui i corpi restano uniti è anelastico.`,
    },
    {
      id: 'example-motor-power',
      title: 'La potenza di un montacarichi',
      problemMd: md`Un montacarichi elettrico solleva un carico di 50 kg di 12 m a velocità costante in 10 s. Con $g = 10\ \text{m/s}^2$, trova la potenza utile. Se assorbe 800 W di potenza elettrica, qual è il suo rendimento?`,
      steps: [
        md`A velocità costante la forza di sollevamento è uguale al peso: $F = mg = 500\ \text{N}$.`,
        md`Lavoro compiuto sul carico: $W = Fs = 500 \times 12 = 6000\ \text{J}$, quindi $P = \frac{6000}{10} = 600\ \text{W}$.`,
        md`Verifica per un'altra strada: la velocità è $\frac{12}{10} = 1{,}2\ \text{m/s}$, e $P = Fv = 500 \times 1{,}2 = 600\ \text{W}$.`,
        md`Rendimento: $\frac{600}{800} = 0{,}75$, cioè il 75%.`,
      ],
      answerMd: md`La potenza utile è 600 W e il rendimento è del 75%. Usando la massa al posto del peso si ottiene 60 W, dieci volte troppo poco.`,
    },
  ],
  traps: [
    {
      title: md`Considerare l'energia cinetica proporzionale alla velocità`,
      md: md`L'energia cinetica va con $v^2$. Raddoppiando la velocità di un'auto, la sua energia cinetica quadruplica, quindi a parità di forza frenante serve uno spazio di frenata quattro volte maggiore, non doppio.`,
    },
    {
      title: md`Conservare l'energia cinetica in un urto in cui i corpi restano uniti`,
      md: md`In un urto l'unica grandezza che si conserva con certezza è la quantità di moto. Quando i corpi restano uniti l'urto è completamente anelastico: ricava la velocità dalla quantità di moto, mai dall'energia cinetica.`,
    },
    {
      title: 'Ignorare i segni della quantità di moto',
      md: md`Una palla di 2 kg a +3 m/s e una palla di 1 kg a −6 m/s hanno una quantità di moto totale di $6 - 6 = 0$, non di 12 kg m/s. Scegli un verso positivo e dai a ogni velocità il suo segno prima di sommare.`,
    },
    {
      title: 'Contare il lavoro di una forza perpendicolare',
      md: md`Se porti una borsa attraversando un pavimento orizzontale a velocità costante, la forza verso l'alto che eserciti sulla borsa non compie lavoro su di essa, perché la borsa si muove perpendicolarmente a quella forza. Per avere lavoro serve una componente della forza lungo lo spostamento.`,
    },
  ],
  check: [
    {
      id: 'check-dropped-ball-speed',
      title: 'La velocità dopo una caduta',
      topic: 'Energia',
      stemMd: md`Una palla di 0,50 kg viene lasciata cadere da ferma da un'altezza di 20 m. Trascurando la resistenza dell'aria e con $g = 10\ \text{m/s}^2$, con quale velocità arriva a terra?`,
      options: [
        { id: 'A', text: md`$10\sqrt{2} \approx 14\ \text{m/s}$`, note: md`Deriva da $v^2 = gh$, che perde il fattore 2 di $v^2 = 2gh$.` },
        { id: 'B', text: md`$20\ \text{m/s}$`, note: '' },
        { id: 'C', text: md`$20\sqrt{2} \approx 28\ \text{m/s}$`, note: md`Tiene la massa da una parte sola, scrivendo $\frac{1}{2} \times 0{,}5 \times v^2 = gh$; la massa moltiplica entrambe le energie e si semplifica.` },
        { id: 'D', text: md`$200\ \text{m/s}$`, note: md`Scrive $v = gh$, che ha le unità $\text{m}^2/\text{s}^2$, non quelle di una velocità.` },
        { id: 'E', text: md`$400\ \text{m/s}$`, note: md`È $v^2 = 2gh = 400\ \text{m}^2/\text{s}^2$, dimenticando la radice quadrata.` },
      ],
      answer: 'B',
      workingMd: md`L'energia si conserva: $mgh = \frac{1}{2}mv^2$, quindi $v = \sqrt{2gh} = \sqrt{400} = 20\ \text{m/s}$. Per un'altra strada: la caduta dura $t = \sqrt{\frac{2h}{g}} = 2\ \text{s}$, e $v = gt = 20\ \text{m/s}$.`,
      lesson: md`Nella conservazione dell'energia per una caduta la massa si semplifica: la velocità dipende solo dall'altezza.`,
    },
    {
      id: 'check-skaters-push',
      title: 'Due pattinatori si spingono',
      topic: 'Quantità di moto',
      stemMd: md`Due pattinatori, di 60 kg e 40 kg, sono fermi sul ghiaccio liscio. Si spingono a vicenda, e il pattinatore di 40 kg si allontana a 3,0 m/s. Qual è la velocità del pattinatore di 60 kg?`,
      options: [
        { id: 'A', text: md`0 m/s`, note: md`Presume che chi spinge resti fermo; la spinta agisce su entrambi, e la quantità di moto totale deve restare nulla.` },
        { id: 'B', text: md`2,0 m/s nello stesso verso del pattinatore di 40 kg`, note: md`Il modulo è giusto ma il verso no: quantità di moto uguali e opposte richiedono velocità opposte.` },
        { id: 'C', text: md`2,0 m/s in verso opposto al pattinatore di 40 kg`, note: '' },
        { id: 'D', text: md`3,0 m/s in verso opposto al pattinatore di 40 kg`, note: md`Rende uguali le velocità invece delle quantità di moto; le forze sono uguali, ma il pattinatore più pesante acquista meno velocità.` },
        { id: 'E', text: md`4,5 m/s in verso opposto al pattinatore di 40 kg`, note: md`Inverte il rapporto delle masse, $3 \times \frac{60}{40}$; il pattinatore più pesante deve muoversi più lentamente, non più velocemente.` },
      ],
      answer: 'C',
      workingMd: md`La quantità di moto totale è nulla prima e dopo. Il pattinatore di 40 kg ha $40 \times 3 = 120\ \text{kg m/s}$, quindi quello di 60 kg ha 120 kg m/s nel verso opposto: $v = \frac{120}{60} = 2{,}0\ \text{m/s}$, in verso opposto. Per un'altra strada: le due forze sono uguali e agiscono per lo stesso tempo, quindi le accelerazioni stanno nel rapporto $40 : 60$, e le velocità nel rapporto $2 : 3$.`,
      lesson: md`Le parti di un sistema che parte da fermo si allontanano con quantità di moto uguali e opposte, quindi ogni velocità è inversamente proporzionale alla massa.`,
    },
    {
      id: 'check-braking-distance',
      title: 'Frenare dal doppio della velocità',
      topic: 'Energia',
      stemMd: md`Un'auto che frena con una forza costante si ferma in 40 m partendo da 20 m/s. Con la stessa forza frenante, in quale distanza si ferma partendo da 40 m/s?`,
      options: [
        { id: 'A', text: md`40 m`, note: md`Presume che la distanza dipenda solo dalla forza; il lavoro che i freni devono compiere è uguale all'energia cinetica, che dipende dalla velocità.` },
        { id: 'B', text: md`80 m`, note: md`Fa crescere la distanza in proporzione alla velocità; l'energia cinetica va con il quadrato della velocità.` },
        { id: 'C', text: md`160 m`, note: '' },
        { id: 'D', text: md`320 m`, note: md`Fa crescere la distanza con il cubo della velocità, un fattore 8; il teorema dell'energia cinetica dà il quadrato.` },
        { id: 'E', text: md`640 m`, note: md`Usa un fattore 16, elevando al quadrato una seconda volta il fattore corretto 4.` },
      ],
      answer: 'C',
      workingMd: md`I freni compiono un lavoro $Fd = \frac{1}{2}mv^2$, quindi con $F$ fissa $d$ è proporzionale a $v^2$. Raddoppiando la velocità la distanza si moltiplica per 4: $4 \times 40 = 160\ \text{m}$. Per un'altra strada: la decelerazione è fissa, e $v^2 = 2ad$ dà la stessa proporzionalità.`,
      lesson: md`A parità di forza frenante, lo spazio di frenata cresce con il quadrato della velocità.`,
    },
  ],
  takeaways: [
    md`Il lavoro è $Fs\cos\theta$, ed è nullo per una forza perpendicolare al moto.`,
    md`Il lavoro totale compiuto su un corpo è uguale alla variazione della sua energia cinetica.`,
    md`Senza attrito, la somma di energia cinetica e potenziale resta costante; con l'attrito, la perdita diventa calore.`,
    md`La quantità di moto si conserva in ogni urto; l'energia cinetica solo in quelli elastici.`,
    md`La potenza è $\frac{W}{t}$, oppure $Fv$ a velocità costante.`,
  ],
  flashcards: [
    { front: md`Lavoro di una forza`, back: md`$W = Fs\cos\theta$, in joule; è nullo quando la forza è perpendicolare allo spostamento.` },
    { front: md`Energia cinetica e potenziale gravitazionale`, back: md`$E_k = \frac{1}{2}mv^2$ ed $E_p = mgh$. Raddoppiando la velocità, l'energia cinetica quadruplica.` },
    { front: md`Velocità dopo una caduta da un'altezza h`, back: md`$v = \sqrt{2gh}$, qualunque sia la massa e, senza attrito, qualunque sia il percorso.` },
    { front: md`Potenza`, back: md`Lavoro o energia per unità di tempo, $P = \frac{W}{t}$, in watt; a velocità costante $P = Fv$.` },
    { front: md`Impulso`, back: md`$F\,\Delta t = \Delta p$: la stessa variazione di quantità di moto in un tempo più lungo richiede una forza minore.` },
    { front: md`Urti elastici e anelastici`, back: md`La quantità di moto si conserva in entrambi. L'energia cinetica si conserva solo in un urto elastico, e la perdita è massima quando i corpi restano uniti.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-mechanics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const fluidsPressureAndBuoyancyLessonIt: Lesson = {
  slug: 'fluids-pressure-and-buoyancy',
  title: 'Fluidi, pressione e galleggiamento',
  summary: 'Densità, pressione e profondità, principi di Pascal e di Archimede e flusso nei condotti: la fisica dei fluidi dietro galleggiamento, idraulica e flebo.',
  minutes: 20,
  objectives: [
    md`Calcolare la pressione da forza e area e la pressione a una certa profondità in un liquido, distinguendo pressione relativa e assoluta.`,
    md`Applicare il principio di Pascal al torchio idraulico e il principio di Archimede ai corpi che galleggiano o sono immersi.`,
    md`Usare l'equazione di continuità e il risultato qualitativo di Bernoulli per i fluidi che scorrono nei condotti.`,
  ],
  teachMd: md`
### La densità

La densità (*density*) è la massa per unità di volume, $\rho = \frac{m}{V}$, in $\text{kg/m}^3$. L'acqua ha $\rho \approx 1000\ \text{kg/m}^3$, cioè $1\ \text{g/cm}^3$, ovvero 1 kg per litro. Tieni a portata di mano le conversioni di volume: $1\ \text{L} = 10^{-3}\ \text{m}^3$ e $1\ \text{cm}^3 = 10^{-6}\ \text{m}^3$.

### La pressione

La pressione (*pressure*) è la forza per unità di area che agisce perpendicolarmente a una superficie:

$$p = \frac{F}{A}$$

in pascal ($1\ \text{Pa} = 1\ \text{N/m}^2$). La stessa forza su un'area più piccola dà una pressione maggiore: un ago buca la pelle, mentre le racchette da neve impediscono di sprofondare. La pressione atmosferica al livello del mare è circa $1{,}0 \times 10^5\ \text{Pa}$ (più precisamente $1{,}013 \times 10^5\ \text{Pa}$, cioè 760 mmHg). In un fluido in quiete la pressione in un punto agisce allo stesso modo in tutte le direzioni.

### Pressione e profondità

In un liquido di densità $\rho$ la pressione aumenta con la profondità $h$ (legge di Stevino):

$$p = p_0 + \rho g h$$

dove $p_0$ è la pressione sulla superficie. Il termine in più è il peso del liquido sovrastante per unità di area: una colonna di sezione $A$ e altezza $h$ pesa $\rho A h g$, e dividendo per $A$ resta $\rho g h$. In acqua ogni 10 m di profondità aggiungono $1000 \times 10 \times 10 = 10^5\ \text{Pa}$, circa un'atmosfera.

Conta solo la profondità, non la forma o la larghezza del recipiente: tutti i punti alla stessa profondità di uno stesso liquido in quiete e collegato hanno la stessa pressione. Per questo un liquido raggiunge lo stesso livello nei vasi comunicanti.

La pressione **assoluta** comprende $p_0$. La pressione **relativa** (*gauge pressure*) è l'eccesso rispetto alla pressione atmosferica, $\rho g h$ per una colonna di liquido. I manometri per gli pneumatici e le misure della pressione del sangue danno pressioni relative.

### Il principio di Pascal e il torchio idraulico

Una variazione di pressione applicata a un liquido chiuso si trasmette invariata in ogni suo punto. In un torchio idraulico (*hydraulic press*), una piccola forza $F_1$ su un pistone di area $A_1$ produce una pressione che agisce su un grande pistone di area $A_2$:

$$\frac{F_1}{A_1} = \frac{F_2}{A_2}.$$

La forza viene moltiplicata per $\frac{A_2}{A_1}$, ma non si crea energia. Il volume del liquido non cambia, quindi il pistone piccolo deve spostarsi $\frac{A_2}{A_1}$ volte più di quello grande, e il lavoro fornito è uguale al lavoro ottenuto.

### Il principio di Archimede

Un corpo immerso del tutto o in parte in un fluido riceve una spinta verso l'alto (*buoyant force*) uguale al peso del fluido spostato:

$$F_B = \rho_{\text{fluid}}\,V_{\text{sub}}\,g.$$

La spinta esiste perché la pressione sulla parte inferiore del corpo è maggiore che su quella superiore. Dipende dalla densità del fluido e dal volume immerso, non dal materiale di cui è fatto il corpo.

- Se la densità media del corpo è maggiore di quella del fluido, il corpo affonda. Pesato mentre è immerso, ha un peso apparente $mg - F_B$.
- Se la sua densità media è minore, galleggia, con la spinta uguale al suo peso. La frazione del suo volume sotto la superficie è $\frac{\rho_{\text{body}}}{\rho_{\text{fluid}}}$: il ghiaccio, con circa $920\ \text{kg/m}^3$, galleggia in acqua dolce con circa il 92% del volume immerso.

### I fluidi in movimento

Per un fluido incomprimibile che scorre in modo stazionario in un condotto, ogni secondo passa lo stesso volume attraverso ogni sezione. La portata (*flow rate*) è

$$Q = Av, \qquad A_1 v_1 = A_2 v_2.$$

Dove il condotto si restringe, il fluido accelera. Per un fluido ideale (senza viscosità), l'equazione di Bernoulli esprime la conservazione dell'energia per unità di volume lungo il flusso:

$$p + \frac{1}{2}\rho v^2 + \rho g h = \text{costante}.$$

Alla stessa altezza, dove la velocità è maggiore la pressione è minore. Molti si sorprendono: in un condotto orizzontale la strozzatura ha il flusso più veloce e la pressione più bassa.

I fluidi reali come il sangue sono viscosi, quindi serve una differenza di pressione anche solo per mantenerli in movimento in un tubo uniforme. Per un flusso regolare e stazionario in un tubo sottile, a parità di differenza di pressione la portata è proporzionale alla quarta potenza del raggio (legge di Poiseuille): dimezzando il raggio di un vaso, la portata si riduce a un sedicesimo.
`,
  examples: [
    {
      id: 'example-diver-pressure',
      title: 'La pressione su un sub',
      problemMd: md`Un sub si trova 20 m sotto la superficie di un lago di acqua dolce. Con pressione atmosferica $1{,}0 \times 10^5\ \text{Pa}$, densità dell'acqua $1000\ \text{kg/m}^3$ e $g = 10\ \text{m/s}^2$, trova la pressione relativa e la pressione assoluta sul sub.`,
      steps: [
        md`La pressione relativa è quella della sola colonna d'acqua: $\rho g h = 1000 \times 10 \times 20 = 2{,}0 \times 10^5\ \text{Pa}$.`,
        md`La pressione assoluta aggiunge l'atmosfera che preme sulla superficie: $1{,}0 \times 10^5 + 2{,}0 \times 10^5 = 3{,}0 \times 10^5\ \text{Pa}$.`,
        md`Verifica con la regola pratica: ogni 10 m d'acqua aggiungono circa un'atmosfera, quindi 20 m ne aggiungono due, oltre a quella in superficie: circa 3 atmosfere.`,
      ],
      answerMd: md`La pressione relativa è $2{,}0 \times 10^5\ \text{Pa}$ e quella assoluta $3{,}0 \times 10^5\ \text{Pa}$. Nota che raddoppiare la profondità non raddoppia la pressione assoluta: è $2{,}0 \times 10^5\ \text{Pa}$ a 10 m e $3{,}0 \times 10^5\ \text{Pa}$ a 20 m.`,
    },
    {
      id: 'example-hydraulic-lift',
      title: 'Un ponte sollevatore idraulico',
      problemMd: md`In un sollevatore idraulico il pistone piccolo ha un'area di $10\ \text{cm}^2$ e quello grande di $500\ \text{cm}^2$. Con $g = 10\ \text{m/s}^2$: (a) quale forza sul pistone piccolo sostiene un'auto di 1000 kg su quello grande? (b) Di quanto deve spostarsi il pistone piccolo per sollevare l'auto di 1,0 cm?`,
      steps: [
        md`Il peso dell'auto è $1000 \times 10 = 10\,000\ \text{N}$.`,
        md`La pressione è la stessa sui due pistoni, quindi le forze stanno nel rapporto delle aree, $\frac{500}{10} = 50$. In un rapporto le unità si semplificano, quindi non serve convertire in $\text{m}^2$: $F_1 = \frac{10\,000}{50} = 200\ \text{N}$.`,
        md`Il volume di liquido che esce dal cilindro piccolo entra in quello grande: $10 \times d = 500 \times 1$, quindi $d = 50\ \text{cm}$.`,
        md`Verifica con l'energia: $200\ \text{N} \times 0{,}50\ \text{m} = 100\ \text{J}$ forniti, e $10\,000\ \text{N} \times 0{,}010\ \text{m} = 100\ \text{J}$ ottenuti.`,
      ],
      answerMd: md`Una forza di 200 N sostiene l'auto, e il pistone piccolo deve spostarsi di 50 cm per sollevarla di 1,0 cm. Il torchio moltiplica la forza per 50 e divide lo spostamento per 50, quindi non si guadagna energia.`,
    },
    {
      id: 'example-floating-block',
      title: 'Un blocco di legno che galleggia',
      problemMd: md`Un blocco di legno di volume 2,0 L e densità $600\ \text{kg/m}^3$ galleggia in acqua. Con $g = 10\ \text{m/s}^2$: (a) quale volume del blocco è sott'acqua? (b) Quale forza aggiuntiva verso il basso lo terrebbe completamente immerso?`,
      steps: [
        md`In unità SI il volume è $2{,}0 \times 10^{-3}\ \text{m}^3$, quindi la massa è $600 \times 2{,}0 \times 10^{-3} = 1{,}2\ \text{kg}$ e il peso 12 N.`,
        md`Mentre galleggia, la spinta è uguale al peso: $1000 \times V_{\text{sub}} \times 10 = 12$, quindi $V_{\text{sub}} = 1{,}2 \times 10^{-3}\ \text{m}^3 = 1{,}2\ \text{L}$. È il 60% del blocco, in accordo con $\frac{600}{1000}$.`,
        md`Completamente immerso, la spinta è $1000 \times 2{,}0 \times 10^{-3} \times 10 = 20\ \text{N}$.`,
        md`La spinta verso il basso deve coprire la differenza tra questa e il peso: $20 - 12 = 8{,}0\ \text{N}$.`,
      ],
      answerMd: md`Sott'acqua ci sono 1,2 L del blocco (il 60%), e servono 8,0 N in più per tenerlo completamente immerso. Rispondere 20 N dimentica che il peso del blocco fornisce già 12 N della forza verso il basso.`,
    },
  ],
  traps: [
    {
      title: 'Pensare che la forma del recipiente determini la pressione',
      md: md`Un tubo alto e stretto e una vasca larga riempiti alla stessa profondità con lo stesso liquido hanno sul fondo la stessa pressione, $p_0 + \rho g h$. Volume e larghezza non contano; conta solo la profondità.`,
    },
    {
      title: 'Usare la densità del corpo per la spinta',
      md: md`La spinta di Archimede è il peso del fluido spostato, $\rho_{\text{fluid}} V_{\text{sub}} g$. Una sfera d'acciaio e una di plastica con lo stesso volume, entrambe completamente immerse in acqua, ricevono la stessa spinta; differiscono solo per il peso.`,
    },
    {
      title: 'Confondere pressione relativa e assoluta',
      md: md`$\rho g h$ è la pressione relativa; aggiungendo la pressione atmosferica si ottiene quella assoluta. Leggi quale delle due chiede il quesito, e diffida di un'opzione che differisce da un'altra esattamente di $1{,}0 \times 10^5\ \text{Pa}$.`,
    },
    {
      title: 'Aspettarsi più pressione dove il flusso è più veloce',
      md: md`L'intuito dice che un fluido costretto in una strozzatura spinge di più lì. Per un flusso ideale orizzontale, l'equazione di Bernoulli dice il contrario: più il flusso è veloce, più la pressione è bassa.`,
    },
  ],
  check: [
    {
      id: 'check-pipe-narrowing',
      title: 'Flusso in un condotto che si restringe',
      topic: 'Fluidi',
      stemMd: md`L'acqua scorre a 2,0 m/s in un condotto di sezione $6{,}0\ \text{cm}^2$, che poi si restringe a $2{,}0\ \text{cm}^2$. Considerando l'acqua incomprimibile, qual è la sua velocità nel tratto stretto?`,
      options: [
        { id: 'A', text: md`$\frac{2}{3}\ \text{m/s}$`, note: md`Inverte il rapporto delle aree; per far passare lo stesso volume al secondo in una sezione più piccola, l'acqua deve accelerare, non rallentare.` },
        { id: 'B', text: md`2,0 m/s`, note: md`Presume che la velocità resti la stessa; lo stesso volume al secondo attraverso un terzo dell'area richiede il triplo della velocità.` },
        { id: 'C', text: md`4,0 m/s`, note: md`Prende la differenza delle aree, $6 - 2 = 4$, come se fosse una velocità; è il rapporto delle aree a fissare la velocità.` },
        { id: 'D', text: md`6,0 m/s`, note: '' },
        { id: 'E', text: md`18 m/s`, note: md`Eleva al quadrato il rapporto delle aree, come se 6 e 2 fossero raggi; la velocità segue il rapporto delle aree stesse.` },
      ],
      answer: 'D',
      workingMd: md`Continuità: $A_1 v_1 = A_2 v_2$, quindi $6{,}0 \times 2{,}0 = 2{,}0 \times v_2$ e $v_2 = 6{,}0\ \text{m/s}$. Verifica in altre unità: $6\ \text{cm}^2 \times 200\ \text{cm/s} = 1200\ \text{cm}^3/\text{s}$, e $2\ \text{cm}^2 \times 600\ \text{cm/s} = 1200\ \text{cm}^3/\text{s}$.`,
      lesson: md`A portata costante, la velocità è inversamente proporzionale all'area della sezione.`,
    },
    {
      id: 'check-stone-in-water',
      title: 'Pesare un sasso sott\'acqua',
      topic: 'Fluidi',
      stemMd: md`Un sasso di 3,0 kg e di volume 1,0 L è appeso a un dinamometro, completamente immerso in acqua di densità $1000\ \text{kg/m}^3$. Con $g = 10\ \text{m/s}^2$, che cosa indica il dinamometro?`,
      options: [
        { id: 'A', text: md`2,0 N`, note: md`Sottrae il volume in litri dalla massa in chilogrammi e dimentica $g$; le forze in gioco sono 30 N e 10 N.` },
        { id: 'B', text: md`10 N`, note: md`È la spinta stessa; il dinamometro sostiene il peso meno la spinta.` },
        { id: 'C', text: md`20 N`, note: '' },
        { id: 'D', text: md`30 N`, note: md`È il peso del sasso in aria; ignora la spinta.` },
        { id: 'E', text: md`40 N`, note: md`Somma la spinta al peso; la spinta agisce verso l'alto e riduce la lettura.` },
      ],
      answer: 'C',
      workingMd: md`Il peso è $3{,}0 \times 10 = 30\ \text{N}$. Il sasso sposta $1{,}0 \times 10^{-3}\ \text{m}^3$ d'acqua, quindi $F_B = 1000 \times 1{,}0 \times 10^{-3} \times 10 = 10\ \text{N}$. Il dinamometro indica $30 - 10 = 20\ \text{N}$.`,
      lesson: md`Un corpo immerso pesa meno, esattamente del peso del fluido che sposta.`,
    },
    {
      id: 'check-drip-pressure',
      title: 'La pressione di una flebo',
      topic: 'Fluidi',
      stemMd: md`Una sacca per flebo è appesa in modo che la superficie del liquido sia 80 cm sopra l'ago. La densità del liquido è $1000\ \text{kg/m}^3$ e $g = 10\ \text{m/s}^2$. Trascurando il flusso, quale pressione relativa produce la colonna di liquido all'ago?`,
      options: [
        { id: 'A', text: md`8 Pa`, note: md`Usa la densità come 1 (da $1\ \text{g/cm}^3$) invece di $1000\ \text{kg/m}^3$, mescolando due sistemi di unità.` },
        { id: 'B', text: md`800 Pa`, note: md`Tralascia $g$, calcolando $\rho h$ invece di $\rho g h$.` },
        { id: 'C', text: md`8,0 kPa`, note: '' },
        { id: 'D', text: md`108 kPa`, note: md`Aggiunge la pressione atmosferica, che dà la pressione assoluta; il quesito chiede quella relativa.` },
        { id: 'E', text: md`800 kPa`, note: md`Usa l'altezza in centimetri (80) invece che in metri (0,80).` },
      ],
      answer: 'C',
      workingMd: md`$\rho g h = 1000 \times 10 \times 0{,}80 = 8000\ \text{Pa} = 8{,}0\ \text{kPa}$. Verifica: 10 m d'acqua danno circa $10^5\ \text{Pa}$, quindi 0,8 m danno $0{,}08 \times 10^5 = 8000\ \text{Pa}$.`,
      lesson: md`La pressione relativa di una colonna di liquido è $\rho g h$, con tutte le grandezze in unità SI.`,
    },
  ],
  takeaways: [
    md`La pressione è $\frac{F}{A}$; in un liquido in quiete aumenta di $\rho g h$ con la profondità, qualunque sia la forma del recipiente.`,
    md`Ogni 10 m d'acqua aggiungono circa un'atmosfera, $1{,}0 \times 10^5\ \text{Pa}$.`,
    md`Un torchio idraulico moltiplica la forza per il rapporto delle aree, ma non moltiplica mai l'energia.`,
    md`La spinta di Archimede è uguale al peso del fluido spostato; un corpo che galleggia sposta il proprio peso.`,
    md`In un flusso stazionario $A_1v_1 = A_2v_2$, e dove un fluido ideale si muove più veloce la sua pressione è più bassa.`,
  ],
  flashcards: [
    { front: md`Densità dell'acqua`, back: md`Circa $1000\ \text{kg/m}^3$, cioè $1\ \text{g/cm}^3$, ovvero 1 kg per litro.` },
    { front: md`Pressione a una profondità h in un liquido`, back: md`$p = p_0 + \rho g h$; la pressione relativa è $\rho g h$. Conta solo la profondità, non la forma del recipiente.` },
    { front: md`Principio di Pascal`, back: md`Una variazione di pressione in un liquido chiuso si trasmette in ogni suo punto, quindi in un torchio idraulico $\frac{F_1}{A_1} = \frac{F_2}{A_2}$.` },
    { front: md`Principio di Archimede`, back: md`La spinta è uguale al peso del fluido spostato: $F_B = \rho_{\text{fluid}} V_{\text{sub}} g$.` },
    { front: md`Frazione immersa di un corpo che galleggia`, back: md`$\frac{\rho_{\text{body}}}{\rho_{\text{fluid}}}$; il ghiaccio galleggia in acqua dolce con circa il 92% del volume immerso.` },
    { front: md`Continuità e Bernoulli`, back: md`$A_1 v_1 = A_2 v_2$, e per un fluido ideale $p + \frac{1}{2}\rho v^2 + \rho g h$ è costante: alla stessa altezza, flusso più veloce significa pressione più bassa.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-mechanics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const heatGasLawsAndThermodynamicsLessonIt: Lesson = {
  slug: 'heat-gas-laws-and-thermodynamics',
  title: 'Calore, leggi dei gas e termodinamica',
  summary: 'Temperatura in kelvin, calore e calore latente, legge dei gas perfetti, primo e secondo principio della termodinamica e rendimento delle macchine termiche.',
  minutes: 24,
  objectives: [
    md`Passare da gradi Celsius a kelvin e calcolare il calore per variazioni di temperatura, cambiamenti di stato e mescolamenti.`,
    md`Applicare la legge dei gas perfetti e i suoi casi particolari, con le temperature in kelvin.`,
    md`Usare il primo principio della termodinamica con una convenzione dei segni chiara, e il limite di Carnot al rendimento di una macchina termica.`,
  ],
  teachMd: md`
### La temperatura e il kelvin

La temperatura misura l'energia cinetica media delle particelle di un corpo. La sua unità SI è il kelvin, e

$$T(\text{K}) = \theta(^\circ\text{C}) + 273$$

(più precisamente 273,15). Lo zero assoluto, 0 K, corrisponde a −273 °C. Un kelvin ha la stessa ampiezza di un grado Celsius, quindi una **differenza di temperatura** ha lo stesso valore nelle due scale: un aumento da 20 °C a 50 °C è un aumento di 30 K. Usa i kelvin ogni volta che una temperatura viene moltiplicata o divisa, come nelle leggi dei gas e nei rendimenti.

### Il calore e il calore specifico

Il calore (*heat*) è energia trasferita a causa di una differenza di temperatura, e si misura in joule. Il calore necessario per variare di $\Delta T$ la temperatura di una massa $m$ è

$$Q = mc\,\Delta T$$

dove $c$ è il calore specifico (*specific heat capacity*) del materiale. Quello dell'acqua è insolitamente grande, circa $4200\ \text{J/(kg K)}$ (una caloria, circa 4,2 J, scalda 1 g d'acqua di 1 °C): per questo l'acqua si scalda e si raffredda lentamente.

Quando corpi a temperature diverse vengono messi insieme in un contenitore isolato, raggiungono una temperatura comune (equilibrio termico), e il calore ceduto dai più caldi è uguale al calore assorbito dai più freddi.

### I cambiamenti di stato

Mentre una sostanza fonde o bolle, il calore fornito serve a separarne le particelle, non ad aumentarne la temperatura, quindi la temperatura resta costante finché il cambiamento non è completo. Il calore necessario è

$$Q = mL$$

dove $L$ è il calore latente (*latent heat*) specifico. Per l'acqua il calore latente di fusione è circa $3{,}3 \times 10^5\ \text{J/kg}$ e quello di vaporizzazione circa $2{,}3 \times 10^6\ \text{J/kg}$, circa sette volte maggiore. Il sudore che evapora raffredda la pelle perché ogni chilogrammo che evapora porta via questa grande quantità di energia.

### Come si propaga il calore

La conduzione trasmette energia attraverso un materiale per urti tra le particelle: i metalli conducono bene, l'aria ferma male. La convezione trasporta energia con il movimento d'insieme di un fluido, perché il fluido caldo sale e quello freddo scende. L'irraggiamento trasporta energia sotto forma di radiazione elettromagnetica e non richiede un mezzo: è così che il Sole scalda la Terra.

### La legge dei gas perfetti

Per un gas perfetto (*ideal gas*)

$$pV = nRT$$

con $p$ in Pa, $V$ in $\text{m}^3$, $n$ in moli, $T$ in kelvin e $R \approx 8{,}31\ \text{J/(mol K)}$. Per una quantità fissa di gas $\frac{pV}{T}$ è costante, e questo comprende tre leggi particolari:

| Grandezza costante | Legge | Relazione |
| --- | --- | --- |
| $T$ | Boyle | $p_1V_1 = p_2V_2$ |
| $p$ | Charles (prima legge di Gay-Lussac) | $\frac{V_1}{T_1} = \frac{V_2}{T_2}$ |
| $V$ | Gay-Lussac (seconda legge) | $\frac{p_1}{T_1} = \frac{p_2}{T_2}$ |

Una mole di gas perfetto a 0 °C e $1{,}013 \times 10^5\ \text{Pa}$ occupa circa 22,4 L. In un rapporto vanno bene unità qualsiasi per pressione e volume, purché siano le stesse nei due membri; la temperatura va sempre in kelvin.

### Il primo principio della termodinamica

L'energia si conserva. Per un gas, la variazione di energia interna è uguale al calore fornito al gas meno il lavoro che esso compie:

$$\Delta U = Q - W.$$

Qui $Q > 0$ quando il calore entra nel gas, e $W > 0$ quando il gas si espande e compie lavoro sull'ambiente. Alcuni libri scrivono $\Delta U = Q + W$, con $W$ il lavoro compiuto **sul** gas; la fisica è la stessa, quindi controlla quale convenzione usa il quesito. A pressione costante il lavoro compiuto dal gas è $W = p\,\Delta V$; in un grafico $p$–$V$ è l'area sotto la curva. L'energia interna di un gas perfetto dipende solo dalla sua temperatura.

| Trasformazione | Condizione | Conseguenza |
| --- | --- | --- |
| Isoterma | $\Delta T = 0$ | $\Delta U = 0$, quindi $Q = W$ |
| Isocora | $\Delta V = 0$ | $W = 0$, quindi $\Delta U = Q$ |
| Isobara | $\Delta p = 0$ | $W = p\,\Delta V$ |
| Adiabatica | $Q = 0$ | $\Delta U = -W$: la compressione scalda il gas, l'espansione lo raffredda |

### Il secondo principio e le macchine termiche

Il calore passa spontaneamente dal caldo al freddo, mai al contrario; un frigorifero sposta calore dal freddo al caldo solo perché su di esso si compie lavoro. Una macchina termica (*heat engine*) assorbe calore $Q_h$ da una sorgente calda, compie lavoro $W$ e cede calore $Q_c$ a una sorgente fredda, quindi $W = Q_h - Q_c$ e il suo rendimento è

$$\eta = \frac{W}{Q_h} = 1 - \frac{Q_c}{Q_h}.$$

Nessuna macchina può trasformare in lavoro tutto il calore che assorbe. La migliore macchina possibile che lavori tra le temperature assolute $T_h$ e $T_c$, la macchina di Carnot, raggiunge

$$\eta_{\max} = 1 - \frac{T_c}{T_h}.$$

Un altro enunciato del secondo principio usa l'entropia, una misura del disordine: l'entropia di un sistema isolato non diminuisce mai.
`,
  examples: [
    {
      id: 'example-mixing-water',
      title: 'Mescolare acqua calda e fredda',
      problemMd: md`2,0 kg d'acqua a 80 °C vengono mescolati con 3,0 kg d'acqua a 20 °C in un contenitore isolato. Qual è la temperatura finale?`,
      steps: [
        md`Il calore ceduto dall'acqua calda è uguale al calore assorbito da quella fredda: $2c(80 - T) = 3c(T - 20)$. Il calore specifico $c$ si semplifica.`,
        md`Sviluppa: $160 - 2T = 3T - 60$, quindi $5T = 220$ e $T = 44\ ^\circ\text{C}$.`,
        md`Verifica per un'altra strada: la temperatura finale è la media pesata con le masse, $\frac{2 \times 80 + 3 \times 20}{5} = \frac{220}{5} = 44\ ^\circ\text{C}$. In joule, l'acqua calda cede $2 \times 4200 \times 36 = 302\,400\ \text{J}$ e quella fredda assorbe $3 \times 4200 \times 24 = 302\,400\ \text{J}$.`,
      ],
      answerMd: md`La temperatura finale è 44 °C. La media semplice, 50 °C, è la risposta sbagliata che tenta: sarebbe giusta solo per masse uguali.`,
    },
    {
      id: 'example-gas-compressed',
      title: 'Comprimere e scaldare un gas',
      problemMd: md`Un gas a $1{,}0 \times 10^5\ \text{Pa}$ occupa 6,0 L a 27 °C. Viene compresso a 3,0 L e scaldato a 177 °C. Qual è la sua pressione finale?`,
      steps: [
        md`Converti le temperature in kelvin: $27 + 273 = 300\ \text{K}$ e $177 + 273 = 450\ \text{K}$.`,
        md`Usa $\frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2}$: $p_2 = p_1 \times \frac{V_1}{V_2} \times \frac{T_2}{T_1} = 1{,}0 \times 10^5 \times 2 \times 1{,}5 = 3{,}0 \times 10^5\ \text{Pa}$. I litri possono restare litri, perché entra solo il loro rapporto.`,
        md`Verifica: $\frac{pV}{T}$ prima vale $\frac{1{,}0 \times 10^5 \times 6}{300} = 2000$, e dopo $\frac{3{,}0 \times 10^5 \times 3}{450} = 2000$.`,
      ],
      answerMd: md`La pressione finale è $3{,}0 \times 10^5\ \text{Pa}$. Con le temperature in Celsius si otterrebbe $1{,}0 \times 10^5 \times 2 \times \frac{177}{27} \approx 1{,}3 \times 10^6\ \text{Pa}$, più di quattro volte troppo.`,
    },
    {
      id: 'example-first-law',
      title: 'Calore in entrata, lavoro in uscita',
      problemMd: md`Un gas assorbe 500 J di calore mentre si espande alla pressione costante di $1{,}0 \times 10^5\ \text{Pa}$ da 2,0 L a 4,0 L. Trova il lavoro compiuto dal gas e la variazione della sua energia interna.`,
      steps: [
        md`Converti la variazione di volume in unità SI, perché il lavoro deve risultare in joule: $\Delta V = 2{,}0\ \text{L} = 2{,}0 \times 10^{-3}\ \text{m}^3$.`,
        md`Lavoro compiuto dal gas a pressione costante: $W = p\,\Delta V = 1{,}0 \times 10^5 \times 2{,}0 \times 10^{-3} = 200\ \text{J}$.`,
        md`Primo principio: $\Delta U = Q - W = 500 - 200 = 300\ \text{J}$. L'energia interna aumenta, quindi la temperatura sale, come deve accadere a un gas che si espande a pressione costante ($V \propto T$).`,
      ],
      answerMd: md`Il gas compie 200 J di lavoro e la sua energia interna aumenta di 300 J. Sommare il lavoro, $500 + 200 = 700\ \text{J}$, lo tratta come lavoro compiuto sul gas, ma questo gas si è espanso.`,
    },
  ],
  traps: [
    {
      title: 'Usare i gradi Celsius in un rapporto',
      md: md`Leggi dei gas e rendimenti dividono temperature, e solo il kelvin è proporzionale all'energia delle particelle. Passare da 10 °C a 20 °C non raddoppia la pressione di un gas: in kelvin si va da 283 K a 293 K, un aumento di circa il 3,5%.`,
    },
    {
      title: 'Confondere il segno del lavoro',
      md: md`In $\Delta U = Q - W$, $W$ è il lavoro compiuto **dal** gas: positivo quando si espande. Quando un gas viene compresso, $W$ è negativo e l'energia interna aumenta. Fissa la convenzione prima di sostituire i numeri.`,
    },
    {
      title: 'Aspettarsi che la temperatura salga durante un cambiamento di stato',
      md: md`Mentre il ghiaccio fonde o l'acqua bolle, il calore entra ma la temperatura resta ferma finché il cambiamento non è completo. Una curva di riscaldamento lì mostra tratti orizzontali; il calore in quei tratti è $mL$, non $mc\,\Delta T$.`,
    },
    {
      title: 'Confondere adiabatica e isoterma',
      md: md`Adiabatica significa che non c'è scambio di calore ($Q = 0$), quindi la temperatura cambia quando si compie lavoro. Isoterma significa che la temperatura resta fissa, quindi deve fluire calore per bilanciare il lavoro. Una compressione rapida è quasi adiabatica; una lenta, in buon contatto termico, è quasi isoterma.`,
    },
  ],
  check: [
    {
      id: 'check-carnot-limit',
      title: 'La migliore macchina possibile',
      topic: 'Termodinamica',
      stemMd: md`Una macchina termica lavora tra una sorgente calda a 227 °C e una sorgente fredda a 27 °C. Qual è il massimo rendimento che potrebbe avere?`,
      options: [
        { id: 'A', text: md`12%`, note: md`È il rapporto delle temperature in Celsius, $\frac{27}{227} \approx 0{,}12$; il limite richiede temperature in kelvin e la forma $1 - \frac{T_c}{T_h}$.` },
        { id: 'B', text: md`40%`, note: '' },
        { id: 'C', text: md`60%`, note: md`È $\frac{T_c}{T_h} = \frac{300}{500}$, la frazione minima di calore che deve essere ceduta, non la frazione trasformata in lavoro.` },
        { id: 'D', text: md`67%`, note: md`Divide la differenza di temperatura per la temperatura fredda, $\frac{200}{300}$, invece che per quella calda.` },
        { id: 'E', text: md`88%`, note: md`Usa le temperature in Celsius in $1 - \frac{T_c}{T_h}$: $1 - \frac{27}{227} \approx 0{,}88$. Servono le temperature in kelvin.` },
      ],
      answer: 'B',
      workingMd: md`In kelvin, $T_h = 227 + 273 = 500\ \text{K}$ e $T_c = 27 + 273 = 300\ \text{K}$. Il limite di Carnot è $1 - \frac{300}{500} = 0{,}40$, cioè il 40%. Per un'altra strada: $\frac{T_h - T_c}{T_h} = \frac{200}{500} = 0{,}40$.`,
      lesson: md`Il rendimento massimo di una macchina termica è $1 - \frac{T_c}{T_h}$, con entrambe le temperature in kelvin.`,
    },
    {
      id: 'check-melting-ice',
      title: 'Dal ghiaccio all\'acqua tiepida',
      topic: 'Termodinamica',
      stemMd: md`Quanto calore serve per trasformare 0,20 kg di ghiaccio a 0 °C in acqua a 10 °C? Prendi il calore latente di fusione del ghiaccio pari a $3{,}3 \times 10^5\ \text{J/kg}$ e il calore specifico dell'acqua pari a $4{,}2 \times 10^3\ \text{J/(kg K)}$.`,
      options: [
        { id: 'A', text: md`8,4 kJ`, note: md`Così si scalda soltanto l'acqua fusa da 0 °C a 10 °C; per fondere il ghiaccio serve molto di più.` },
        { id: 'B', text: md`57,6 kJ`, note: md`Sottrae il calore di riscaldamento da quello di fusione; vanno forniti entrambi, quindi si sommano.` },
        { id: 'C', text: md`66 kJ`, note: md`Così si fonde soltanto il ghiaccio; poi l'acqua va anche scaldata di 10 K.` },
        { id: 'D', text: md`74,4 kJ`, note: '' },
        { id: 'E', text: md`338,4 kJ`, note: md`Usa il calore latente di 1 kg invece che di 0,20 kg, lasciando fuori la massa da $Q = mL$.` },
      ],
      answer: 'D',
      workingMd: md`Fusione: $Q_1 = mL = 0{,}20 \times 3{,}3 \times 10^5 = 66\,000\ \text{J}$. Riscaldamento: $Q_2 = mc\,\Delta T = 0{,}20 \times 4200 \times 10 = 8400\ \text{J}$. Totale: $66\,000 + 8400 = 74\,400\ \text{J} = 74{,}4\ \text{kJ}$.`,
      lesson: md`Somma il calore di ogni fase: $mL$ per cambiare stato, $mc\,\Delta T$ per cambiare temperatura.`,
    },
    {
      id: 'check-adiabatic-compression',
      title: 'Una compressione rapida',
      topic: 'Termodinamica',
      stemMd: md`Un gas in un cilindro isolato viene compresso rapidamente, in modo che non entri né esca calore. Quale affermazione è corretta?`,
      options: [
        { id: 'A', text: md`La sua temperatura resta la stessa, perché non entra calore.`, note: md`L'assenza di scambio di calore rende la trasformazione adiabatica, non isoterma; il lavoro compiuto sul gas cambia comunque la sua energia interna.` },
        { id: 'B', text: md`La sua energia interna diminuisce, perché nella trasformazione si compie lavoro.`, note: md`Il lavoro è compiuto sul gas, non dal gas, quindi si aggiunge all'energia interna.` },
        { id: 'C', text: md`La sua energia interna aumenta del lavoro compiuto su di esso, e la sua temperatura sale.`, note: '' },
        { id: 'D', text: md`La sua energia interna non cambia, perché non si scambia calore.`, note: md`Con $Q = 0$ il primo principio dà $\Delta U = -W$, e $W$ non è nullo quando il volume cambia.` },
        { id: 'E', text: md`Cede calore pari al lavoro compiuto su di esso.`, note: md`Questo descrive una compressione isoterma lenta; qui il cilindro è isolato, quindi il calore non può uscire.` },
      ],
      answer: 'C',
      workingMd: md`Con $Q = 0$ il primo principio dà $\Delta U = -W$. Il gas viene compresso, quindi il lavoro compiuto dal gas è negativo e $\Delta U$ è positivo: è uguale al lavoro compiuto sul gas. L'energia interna di un gas perfetto dipende solo dalla temperatura, quindi la temperatura sale, come in una pompa da bicicletta che si scalda quando la usi.`,
      lesson: md`In una trasformazione adiabatica tutto il lavoro compiuto sul gas o dal gas va a variarne l'energia interna.`,
    },
  ],
  takeaways: [
    md`Usa i kelvin ogni volta che una temperatura viene moltiplicata o divisa; una differenza di temperatura ha lo stesso valore in K e in °C.`,
    md`Il calore per cambiare temperatura è $mc\,\Delta T$; quello per cambiare stato è $mL$, a temperatura costante.`,
    md`Per una quantità fissa di gas perfetto, $\frac{pV}{T}$ è costante.`,
    md`Primo principio: $\Delta U = Q - W$, con $W$ il lavoro compiuto dal gas.`,
    md`Nessuna macchina termica supera il rendimento di Carnot, $1 - \frac{T_c}{T_h}$.`,
  ],
  flashcards: [
    { front: md`Da gradi Celsius a kelvin`, back: md`$T = \theta + 273$ (273,15 esattamente); una variazione di 1 °C è una variazione di 1 K.` },
    { front: md`Calore per una variazione di temperatura`, back: md`$Q = mc\,\Delta T$; per l'acqua $c \approx 4200\ \text{J/(kg K)}$.` },
    { front: md`Calore latente`, back: md`$Q = mL$; durante un cambiamento di stato la temperatura resta costante.` },
    { front: md`Legge dei gas perfetti`, back: md`$pV = nRT$, con $T$ in kelvin e $R \approx 8{,}31\ \text{J/(mol K)}$; per una quantità fissa di gas, $\frac{pV}{T}$ è costante.` },
    { front: md`Primo principio della termodinamica`, back: md`$\Delta U = Q - W$: il calore fornito al gas meno il lavoro compiuto dal gas.` },
    { front: md`Rendimento massimo di una macchina termica`, back: md`$\eta_{\max} = 1 - \frac{T_c}{T_h}$, con entrambe le temperature in kelvin (limite di Carnot).` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-thermo-waves' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const electricChargeFieldsAndCircuitsLessonIt: Lesson = {
  slug: 'electric-charge-fields-and-circuits',
  title: 'Carica elettrica, campi e circuiti',
  summary: 'Carica, legge di Coulomb, campo e potenziale, legge di Ohm, circuiti in serie e in parallelo e potenza elettrica, con numeri da calcolare a mano.',
  minutes: 22,
  objectives: [
    md`Usare la legge di Coulomb e le definizioni di campo elettrico, differenza di potenziale ed energia delle cariche.`,
    md`Applicare la legge di Ohm e la formula della resistività, e ridurre reti in serie e in parallelo per trovare correnti e tensioni.`,
    md`Calcolare potenza ed energia elettrica con la forma della formula della potenza adatta ai dati.`,
  ],
  teachMd: md`
### La carica elettrica

La carica (*charge*) è di due tipi, positiva e negativa: cariche dello stesso segno si respingono, cariche di segno opposto si attraggono. Si misura in coulomb (C) ed è quantizzata: ogni carica è un multiplo intero della carica elementare $e = 1{,}6 \times 10^{-19}\ \text{C}$, portata dal protone (positiva) e dall'elettrone (negativa). La carica si conserva. Strofinare una bacchetta di plastica con un panno sposta elettroni dall'una all'altro; non crea carica. Nei conduttori, come i metalli e le soluzioni ioniche, le cariche si muovono liberamente; negli isolanti no.

### La legge di Coulomb

Due cariche puntiformi $q_1$ e $q_2$ a distanza $r$ si esercitano forze dirette lungo la retta che le congiunge:

$$F = k\frac{q_1 q_2}{r^2}, \qquad k = \frac{1}{4\pi\varepsilon_0} \approx 9 \times 10^9\ \text{N m}^2/\text{C}^2.$$

Come la gravitazione, è una legge dell'inverso del quadrato (*inverse-square law*): raddoppiando la distanza la forza scende a un quarto; raddoppiando una carica la forza raddoppia. Le due forze formano una coppia del terzo principio, quindi hanno la stessa intensità anche quando le cariche sono diverse.

### Campo elettrico e potenziale

Il campo elettrico (*electric field*) in un punto è la forza per unità di carica positiva posta in quel punto, $E = \frac{F}{q}$, in N/C (o, in modo equivalente, V/m). Una carica puntiforme $Q$ genera un campo di intensità $E = \frac{kQ}{r^2}$, diretto in verso uscente da una carica positiva ed entrante in una negativa. Le linee di campo partono dalle cariche positive e finiscono su quelle negative, e sono più fitte dove il campo è più intenso.

La differenza di potenziale (*potential difference*, o tensione, *voltage*) tra due punti è il lavoro per unità di carica necessario per spostare una carica tra di essi, $V = \frac{W}{q}$, in volt (J/C). Una carica $q$ che attraversa una differenza di potenziale $V$ guadagna o perde un'energia $qV$. Un elettrone accelerato da 1 V guadagna un elettronvolt: $1\ \text{eV} = 1{,}6 \times 10^{-19}\ \text{J}$.

Tra due piastre parallele a distanza $d$ con differenza di potenziale $V$ il campo è uniforme: $E = \frac{V}{d}$. Due piastre di questo tipo formano un condensatore, che immagazzina una carica $Q = CV$, dove $C$ è la sua capacità in farad; l'energia immagazzinata è $\frac{1}{2}CV^2$.

### Corrente, resistenza e legge di Ohm

La corrente (*current*) è la quantità di carica che passa nell'unità di tempo, $I = \frac{Q}{t}$, in ampere ($1\ \text{A} = 1\ \text{C/s}$). Per convenzione la corrente circola nel circuito dal polo positivo al polo negativo; gli elettroni in un metallo si muovono nel verso opposto.

La resistenza (*resistance*) di un componente è $R = \frac{V}{I}$, in ohm ($\Omega$). La legge di Ohm afferma che per un metallo a temperatura costante $R$ è costante, quindi $V = IR$ e la corrente è proporzionale alla tensione. La resistenza di un filo dipende dal materiale e dalla forma:

$$R = \rho\frac{L}{A}$$

dove $\rho$ è la resistività (*resistivity*) del materiale, $L$ la lunghezza e $A$ l'area della sezione. I fili più lunghi oppongono più resistenza; quelli più spessi meno.

### Serie e parallelo

| | Serie | Parallelo |
| --- | --- | --- |
| Corrente | la stessa in ciascuno | si divide; le correnti nei rami si sommano al totale |
| Tensione | si divide; le parti si sommano al totale | la stessa ai capi di ciascuno |
| Resistenza totale | $R = R_1 + R_2 + \dots$ | $\frac{1}{R} = \frac{1}{R_1} + \frac{1}{R_2} + \dots$ |

Due resistori in parallelo hanno una resistenza equivalente $\frac{R_1R_2}{R_1 + R_2}$; due uguali danno metà della resistenza di uno. Un collegamento in parallelo ha sempre una resistenza minore del suo ramo più piccolo, perché ogni nuovo ramo offre alla corrente un'altra strada.

Queste regole derivano dalle leggi di Kirchhoff. La corrente che entra in un nodo è uguale a quella che ne esce, perché la carica si conserva. Lungo qualsiasi maglia chiusa le differenze di potenziale hanno somma zero, perché l'energia si conserva.

### Potenza ed energia elettrica

La potenza fornita a un componente è

$$P = VI = I^2R = \frac{V^2}{R}.$$

Scegli la forma che usa ciò che conosci. A tensione fissa, come quella di rete, una resistenza minore assorbe più corrente e più potenza. L'energia trasferita è $E = Pt$. Le bollette contano i chilowattora: $1\ \text{kWh} = 1000\ \text{W} \times 3600\ \text{s} = 3{,}6 \times 10^6\ \text{J}$.

### Risolvere i quesiti sui circuiti

Riduci il circuito un passo alla volta: combina ogni gruppo in parallelo, poi le parti in serie, per trovare la resistenza totale. Usa $I = \frac{V}{R}$ per la corrente erogata dal generatore. Poi torna indietro verso l'esterno, trovando la tensione ai capi di ogni parte e la corrente in ogni ramo. Infine controlla che le correnti nei rami si sommino al totale e che le tensioni lungo ogni maglia si sommino alla tensione del generatore.
`,
  examples: [
    {
      id: 'example-coulomb-force',
      title: 'La forza tra due sfere cariche',
      problemMd: md`Due piccole sfere hanno cariche di $+2{,}0\ \mu\text{C}$ e $+3{,}0\ \mu\text{C}$, e i loro centri distano 30 cm. Con $k = 9 \times 10^9\ \text{N m}^2/\text{C}^2$, trova la forza tra di esse. Quanto vale la forza se la distanza si dimezza?`,
      steps: [
        md`Converti in unità SI: $q_1 = 2{,}0 \times 10^{-6}\ \text{C}$, $q_2 = 3{,}0 \times 10^{-6}\ \text{C}$, $r = 0{,}30\ \text{m}$.`,
        md`Sostituisci: $F = \frac{9 \times 10^9 \times 2{,}0 \times 10^{-6} \times 3{,}0 \times 10^{-6}}{0{,}30^2} = \frac{9 \times 10^9 \times 6 \times 10^{-12}}{0{,}09}$.`,
        md`Lavora sulle potenze di dieci: $9 \times 10^9 \times 6 \times 10^{-12} = 54 \times 10^{-3} = 0{,}054$, e $\frac{0{,}054}{0{,}09} = 0{,}60\ \text{N}$. Per un'altra strada: $\frac{9 \times 10^9}{0{,}09} = 10^{11}$, e $10^{11} \times 6 \times 10^{-12} = 0{,}60\ \text{N}$. Entrambe le cariche sono positive, quindi la forza è repulsiva.`,
        md`Dimezzare la distanza moltiplica la forza per $2^2 = 4$: $4 \times 0{,}60 = 2{,}4\ \text{N}$.`,
      ],
      answerMd: md`Le sfere si respingono con 0,60 N, e con 2,4 N a 15 cm. Raddoppiare la forza a 1,2 N quando la distanza si dimezza è la risposta sbagliata che tenta: la legge è dell'inverso del quadrato.`,
    },
    {
      id: 'example-mixed-circuit',
      title: 'Un circuito con serie e parallelo',
      problemMd: md`Una batteria da 12 V, con resistenza interna trascurabile, è collegata a un resistore da $2{,}0\ \Omega$ in serie con una coppia in parallelo di resistori da $6{,}0\ \Omega$ e $3{,}0\ \Omega$. Trova la corrente erogata dalla batteria, la corrente in ciascun resistore della coppia e la potenza totale.`,
      steps: [
        md`La coppia in parallelo: $\frac{6 \times 3}{6 + 3} = 2{,}0\ \Omega$.`,
        md`Resistenza totale $2 + 2 = 4{,}0\ \Omega$, quindi la corrente della batteria è $I = \frac{12}{4} = 3{,}0\ \text{A}$.`,
        md`Il resistore in serie prende $3 \times 2 = 6\ \text{V}$, lasciando 6 V ai capi della coppia. Correnti: $\frac{6}{6} = 1{,}0\ \text{A}$ e $\frac{6}{3} = 2{,}0\ \text{A}$, che sommate danno 3,0 A, come devono.`,
        md`Potenza totale: $P = VI = 12 \times 3 = 36\ \text{W}$. Verifica componente per componente: $3^2 \times 2 = 18\ \text{W}$, $\frac{6^2}{6} = 6\ \text{W}$ e $\frac{6^2}{3} = 12\ \text{W}$, totale 36 W.`,
      ],
      answerMd: md`La batteria eroga 3,0 A; nel resistore da $6{,}0\ \Omega$ passano 1,0 A e in quello da $3{,}0\ \Omega$ 2,0 A; il circuito assorbe 36 W. La corrente maggiore passa nel ramo con la resistenza minore.`,
    },
    {
      id: 'example-stretched-wire',
      title: 'Stirare un filo',
      problemMd: md`Un filo ha una resistenza di $10\ \Omega$. Viene stirato fino al doppio della sua lunghezza, mantenendo lo stesso volume. Qual è la sua nuova resistenza?`,
      steps: [
        md`Il volume $LA$ è fisso, quindi raddoppiando la lunghezza $L$ l'area della sezione $A$ si dimezza.`,
        md`In $R = \rho\frac{L}{A}$ il numeratore raddoppia e il denominatore si dimezza, quindi $R$ si moltiplica per $2 \times 2 = 4$.`,
        md`Nuova resistenza: $4 \times 10 = 40\ \Omega$.`,
      ],
      answerMd: md`Il filo stirato ha una resistenza di $40\ \Omega$. Rispondere $20\ \Omega$ tiene conto della lunghezza maggiore ma dimentica che il filo è anche diventato più sottile.`,
    },
  ],
  traps: [
    {
      title: 'Dimezzare invece di dividere per quattro',
      md: md`Nella legge di Coulomb la distanza è al quadrato. Raddoppiando la distanza la forza si divide per 4, triplicandola si divide per 9. Scrivi il fattore di ogni grandezza separatamente, poi combinali.`,
    },
    {
      title: 'Sommare le resistenze in parallelo',
      md: md`Due resistori da $6\ \Omega$ in parallelo danno $3\ \Omega$, non $12\ \Omega$. Se il totale di un gruppo in parallelo ti viene maggiore del ramo più piccolo, hai sommato le resistenze invece dei loro reciproci.`,
    },
    {
      title: 'Pensare che la corrente si consumi',
      md: md`Da un resistore esce la stessa corrente che vi entra: la carica si conserva. Il resistore prende energia, ed è per questo che ai suoi capi il potenziale scende. Ogni componente di un'unica maglia in serie è percorso dalla stessa corrente.`,
    },
    {
      title: 'Scegliere una formula della potenza che nasconde una variazione',
      md: md`$P = I^2R$ fa pensare che più resistenza significhi più potenza, mentre $P = \frac{V^2}{R}$ fa pensare il contrario. Sono giuste entrambe; usa quella in cui l'altra grandezza è fissa. Per componenti in parallelo è fissa la tensione, quindi dissipa più potenza quello con la resistenza minore.`,
    },
  ],
  check: [
    {
      id: 'check-coulomb-scaling',
      title: 'Cambiano le cariche e la distanza',
      topic: 'Elettrostatica',
      stemMd: md`Due cariche puntiformi si esercitano una forza di intensità $F$. Entrambe le cariche vengono raddoppiate e la loro distanza viene triplicata. Qual è la nuova forza?`,
      options: [
        { id: 'A', text: md`$\frac{2}{9}F$`, note: md`Raddoppia una sola carica; sono raddoppiate entrambe, e questo moltiplica il loro prodotto per 4.` },
        { id: 'B', text: md`$\frac{4}{9}F$`, note: '' },
        { id: 'C', text: md`$\frac{4}{3}F$`, note: md`Divide per il fattore della distanza invece che per il suo quadrato; la legge di Coulomb è una legge dell'inverso del quadrato.` },
        { id: 'D', text: md`$\frac{9}{4}F$`, note: md`Inverte il fattore; aumentando la distanza la forza deve diminuire.` },
        { id: 'E', text: md`$36F$`, note: md`Moltiplica per il quadrato del fattore della distanza invece di dividere.` },
      ],
      answer: 'B',
      workingMd: md`Il prodotto delle cariche si moltiplica per $2 \times 2 = 4$, e $r^2$ per $3^2 = 9$. Quindi $F' = \frac{4}{9}F$.`,
      lesson: md`In una legge dell'inverso del quadrato, moltiplicare la distanza per $k$ divide la forza per $k^2$.`,
    },
    {
      id: 'check-voltage-parallel-pair',
      title: 'La tensione ai capi di una coppia in parallelo',
      topic: 'Circuiti',
      stemMd: md`Tre resistori uguali da $6{,}0\ \Omega$ sono collegati in modo che due siano in parallelo e questa coppia sia in serie con il terzo. Il tutto è collegato a un generatore da 9,0 V con resistenza interna trascurabile. Qual è la tensione ai capi della coppia in parallelo?`,
      options: [
        { id: 'A', text: md`9,0 V`, note: md`È l'intera tensione del generatore; ignora il resistore in serie, che prende la sua parte.` },
        { id: 'B', text: md`6,0 V`, note: md`È la tensione ai capi del singolo resistore in serie, non della coppia.` },
        { id: 'C', text: md`4,5 V`, note: md`Divide la tensione a metà, come se la coppia avesse la stessa resistenza del singolo resistore; la coppia ha solo $3{,}0\ \Omega$.` },
        { id: 'D', text: md`3,0 V`, note: '' },
        { id: 'E', text: md`1,5 V`, note: md`Divide la tensione del generatore per $6\ \Omega$, ottenendo una corrente in ampere, e la legge come una tensione.` },
      ],
      answer: 'D',
      workingMd: md`La coppia ha $\frac{6}{2} = 3{,}0\ \Omega$, quindi il totale è $3 + 6 = 9{,}0\ \Omega$ e la corrente è $\frac{9}{9} = 1{,}0\ \text{A}$. Ai capi della coppia: $1{,}0 \times 3{,}0 = 3{,}0\ \text{V}$. Verifica: il resistore in serie prende 6,0 V, e $6 + 3 = 9\ \text{V}$. Per un'altra strada: la tensione si divide in proporzione alle resistenze, $\frac{3}{3 + 6} \times 9 = 3{,}0\ \text{V}$.`,
      lesson: md`In serie, la tensione del generatore si divide in proporzione alle resistenze.`,
    },
    {
      id: 'check-heater-energy',
      title: "L'energia usata da una stufetta",
      topic: 'Circuiti',
      stemMd: md`Una stufetta assorbe una corrente di 5,0 A da una rete a 200 V per 30 minuti. Quanta energia trasferisce?`,
      options: [
        { id: 'A', text: md`$1{,}0 \times 10^3\ \text{J}$`, note: md`È la potenza in watt, l'energia al secondo, non l'energia trasferita in 30 minuti.` },
        { id: 'B', text: md`$3{,}0 \times 10^4\ \text{J}$`, note: md`Usa 30 s invece di 30 minuti, cioè 1800 s.` },
        { id: 'C', text: md`$7{,}2 \times 10^4\ \text{J}$`, note: md`Prende la potenza come $\frac{V}{I} = 40\ \text{W}$; quel rapporto è la resistenza, e la potenza è $VI$.` },
        { id: 'D', text: md`$1{,}8 \times 10^6\ \text{J}$`, note: '' },
        { id: 'E', text: md`$3{,}6 \times 10^6\ \text{J}$`, note: md`Usa un'ora invece di mezz'ora; questo è 1 kWh, ma la stufetta è rimasta accesa 0,5 h.` },
      ],
      answer: 'D',
      workingMd: md`La potenza è $P = VI = 200 \times 5{,}0 = 1000\ \text{W}$ e il tempo è $30 \times 60 = 1800\ \text{s}$, quindi $E = 1000 \times 1800 = 1{,}8 \times 10^6\ \text{J}$. Per un'altra strada: 1 kW per 0,5 h fa 0,5 kWh, e $0{,}5 \times 3{,}6 \times 10^6 = 1{,}8 \times 10^6\ \text{J}$.`,
      lesson: md`L'energia è la potenza per il tempo: con il tempo in secondi si ottengono joule, con il tempo in ore e la potenza in kilowatt si ottengono chilowattora.`,
    },
  ],
  takeaways: [
    md`La legge di Coulomb è dell'inverso del quadrato: $F = k\frac{q_1q_2}{r^2}$, con $k \approx 9 \times 10^9\ \text{N m}^2/\text{C}^2$.`,
    md`Spostare una carica $q$ attraverso una differenza di potenziale $V$ trasferisce un'energia $qV$.`,
    md`Le resistenze in serie si sommano; un collegamento in parallelo ha una resistenza minore del suo ramo più piccolo.`,
    md`La potenza elettrica è $VI = I^2R = \frac{V^2}{R}$, e l'energia è la potenza per il tempo.`,
  ],
  flashcards: [
    { front: md`La carica elementare`, back: md`$e = 1{,}6 \times 10^{-19}\ \text{C}$; ogni carica ne è un multiplo intero.` },
    { front: md`Legge di Coulomb`, back: md`$F = k\frac{q_1 q_2}{r^2}$ con $k \approx 9 \times 10^9\ \text{N m}^2/\text{C}^2$; raddoppiando la distanza la forza si riduce a un quarto.` },
    { front: md`Campo tra piastre parallele`, back: md`Uniforme, con $E = \frac{V}{d}$, in V/m.` },
    { front: md`Legge di Ohm e resistività`, back: md`$V = IR$; un filo di lunghezza $L$ e sezione $A$ ha $R = \rho\frac{L}{A}$.` },
    { front: md`Resistori in serie e in parallelo`, back: md`Serie: $R = R_1 + R_2$, con la stessa corrente in ciascuno. Parallelo: $\frac{1}{R} = \frac{1}{R_1} + \frac{1}{R_2}$, con la stessa tensione ai capi di ciascuno.` },
    { front: md`Le tre forme della potenza elettrica`, back: md`$P = VI = I^2R = \frac{V^2}{R}$, in watt.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-electricity' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};

export const magnetismAndElectromagneticInductionLessonIt: Lesson = {
  slug: 'magnetism-and-electromagnetic-induction',
  title: 'Magnetismo e induzione elettromagnetica',
  summary: 'Forze magnetiche su cariche in moto e correnti, campi generati dalle correnti, flusso, induzione di Faraday e Lenz, alternatori e trasformatori.',
  minutes: 22,
  objectives: [
    md`Calcolare la forza magnetica su una carica in moto e su un filo percorso da corrente, e spiegare perché non compie lavoro sulla carica.`,
    md`Descrivere i campi generati da un filo rettilineo e da un solenoide, e calcolare il flusso magnetico.`,
    md`Usare le leggi di Faraday e di Lenz per la forza elettromotrice indotta, e il rapporto spire di un trasformatore ideale.`,
  ],
  teachMd: md`
### Magneti e campi magnetici

Un magnete ha un polo nord e un polo sud. Poli dello stesso nome si respingono e poli di nome opposto si attraggono, e un polo non si trova mai da solo: tagliando in due una calamita a barra si ottengono due calamite più piccole, ciascuna con entrambi i poli. Il campo intorno a un magnete si rappresenta con linee di campo che, all'esterno del magnete, escono dal polo nord ed entrano nel polo sud; l'ago di una bussola si allinea lungo di esse. La Terra si comporta come un grande magnete il cui polo sud magnetico si trova vicino al Polo Nord geografico: per questo l'estremità nord della bussola punta verso nord.

Il campo magnetico (*magnetic field*) $B$ si misura in tesla (T). Tra i poli di un potente magnete da laboratorio è dell'ordine di 0,1–1 T; il campo terrestre è circa $5 \times 10^{-5}\ \text{T}$.

### La forza su una carica in moto

Una carica $q$ che si muove con velocità $v$ formando un angolo $\theta$ con un campo magnetico $B$ subisce una forza (la forza di Lorentz)

$$F = qvB\sin\theta.$$

La forza è perpendicolare sia alla velocità sia al campo. È massima quando la carica si muove perpendicolarmente al campo e nulla quando si muove lungo il campo. Per una carica positiva la direzione si trova con la regola della mano destra: con le dita della mano destra aperta lungo $B$ e il pollice lungo $v$, il palmo spinge nel verso di $F$. Per una carica negativa, come un elettrone, la forza ha verso opposto.

Poiché la forza è sempre perpendicolare alla velocità, non compie lavoro: cambia la direzione del moto ma mai il modulo della velocità né l'energia cinetica. Una carica che si muove perpendicolarmente a un campo uniforme percorre quindi una circonferenza, con la forza magnetica che fa da forza centripeta:

$$qvB = \frac{mv^2}{r} \quad\Rightarrow\quad r = \frac{mv}{qB}.$$

### La forza su un filo percorso da corrente

Una corrente è carica in movimento, quindi un filo rettilineo di lunghezza $L$ percorso da una corrente $I$, che forma un angolo $\theta$ con un campo $B$, subisce una forza

$$F = BIL\sin\theta,$$

anch'essa perpendicolare sia al filo sia al campo. È il principio del motore elettrico: i due lati di una spira percorsa da corrente in un campo magnetico vengono spinti in versi opposti, e la spira ruota.

### I campi generati dalle correnti

Ogni corrente genera un campo magnetico. Intorno a un filo rettilineo lungo le linee di campo sono circonferenze centrate sul filo, e il campo a distanza $r$ è (legge di Biot-Savart)

$$B = \frac{\mu_0 I}{2\pi r}, \qquad \mu_0 = 4\pi \times 10^{-7}\ \text{T m/A}.$$

La regola della mano destra avvolgente ne dà il verso: con il pollice nel verso della corrente, le dita piegate indicano il verso delle linee di campo. All'interno di un solenoide lungo con $n$ spire per metro il campo è quasi uniforme, $B = \mu_0 n I$, e all'esterno somiglia a quello di una calamita a barra. Due fili paralleli percorsi da correnti nello stesso verso si attraggono; con correnti in versi opposti si respingono.

### Il flusso magnetico

Il flusso magnetico (*magnetic flux*) attraverso una superficie piana di area $A$ in un campo uniforme $B$ è

$$\Phi = BA\cos\theta,$$

dove $\theta$ è l'angolo tra il campo e la normale alla superficie (la retta perpendicolare a essa). Il flusso si misura in weber ($1\ \text{Wb} = 1\ \text{T m}^2$). È massimo quando il campo attraversa la superficie perpendicolarmente e nullo quando il campo le è parallelo.

### L'induzione elettromagnetica

Una variazione del flusso magnetico attraverso un circuito induce una forza elettromotrice (f.e.m., *electromotive force*, *emf*). Per una bobina di $N$ spire, la legge di Faraday dà

$$\varepsilon = -N\frac{\Delta\Phi}{\Delta t}.$$

Il flusso può cambiare perché cambia il campo, perché cambia l'area o perché la bobina ruota. Un flusso costante, per quanto grande, non induce nulla. Una sbarretta di lunghezza $L$ che si muove con velocità $v$ perpendicolarmente a un campo $B$ ha ai suoi estremi una f.e.m. $\varepsilon = BLv$.

Il segno meno esprime la **legge di Lenz**: la corrente indotta circola nel verso che si oppone alla variazione che l'ha prodotta. Se avvicini il polo nord di una calamita a una bobina, l'estremità vicina della bobina diventa un polo nord e respinge la calamita. Devi compiere lavoro per spingerla dentro, e quel lavoro diventa energia elettrica: la legge di Lenz è la conservazione dell'energia all'opera.

### Alternatori e trasformatori

Una bobina che ruota in un campo magnetico è attraversata da un flusso che aumenta e diminuisce, quindi produce una f.e.m. alternata: è un alternatore (*generator*). Un trasformatore (*transformer*) ha due bobine avvolte su un nucleo di ferro comune. Una corrente alternata nel circuito primario produce nel nucleo un flusso variabile, che induce una f.e.m. nel secondario. Per un trasformatore ideale

$$\frac{V_s}{V_p} = \frac{N_s}{N_p}, \qquad V_p I_p = V_s I_s.$$

Un trasformatore elevatore alza la tensione e abbassa la corrente dello stesso fattore; non crea potenza. Un trasformatore non funziona con una corrente continua costante, perché una corrente costante produce un flusso costante. L'energia elettrica viene trasmessa ad alta tensione perché la corrente, e quindi il riscaldamento $I^2R$ nei cavi, sia piccola.
`,
  examples: [
    {
      id: 'example-wire-force',
      title: 'La forza su un filo in un campo',
      problemMd: md`Un filo rettilineo lungo 0,50 m è percorso da una corrente di 4,0 A in un campo magnetico uniforme di 0,20 T. Trova la forza sul filo quando è (a) perpendicolare al campo, (b) a $30^\circ$ rispetto al campo, (c) parallelo al campo.`,
      steps: [
        md`(a) $\sin 90^\circ = 1$, quindi $F = BIL = 0{,}20 \times 4{,}0 \times 0{,}50 = 0{,}40\ \text{N}$.`,
        md`(b) $\sin 30^\circ = \frac{1}{2}$, quindi $F = 0{,}40 \times \frac{1}{2} = 0{,}20\ \text{N}$.`,
        md`(c) $\sin 0^\circ = 0$, quindi non c'è alcuna forza.`,
      ],
      answerMd: md`Le forze sono 0,40 N, 0,20 N e zero. Usare $\cos 30^\circ$ in (b) dà circa 0,35 N, la risposta sbagliata che tenta: in $BIL\sin\theta$ l'angolo è quello tra il filo e il campo.`,
    },
    {
      id: 'example-coil-emf',
      title: 'La f.e.m. prodotta da un campo che diminuisce',
      problemMd: md`Una bobina di 100 spire, ciascuna di area $0{,}020\ \text{m}^2$, ha il piano perpendicolare a un campo magnetico uniforme. Il campo scende in modo uniforme da 0,50 T a 0,10 T in 0,20 s. Trova la f.e.m. indotta media, e la corrente se il circuito della bobina ha una resistenza totale di $2{,}0\ \Omega$.`,
      steps: [
        md`Flusso attraverso una spira: prima $0{,}50 \times 0{,}020 = 0{,}010\ \text{Wb}$, dopo $0{,}10 \times 0{,}020 = 0{,}0020\ \text{Wb}$. La variazione è $\Delta\Phi = 0{,}0080\ \text{Wb}$.`,
        md`Legge di Faraday: $\varepsilon = N\frac{\Delta\Phi}{\Delta t} = 100 \times \frac{0{,}0080}{0{,}20} = 4{,}0\ \text{V}$.`,
        md`Verifica per un'altra strada: il campo varia di $\frac{0{,}40}{0{,}20} = 2{,}0\ \text{T/s}$, quindi $\varepsilon = NA\frac{\Delta B}{\Delta t} = 100 \times 0{,}020 \times 2{,}0 = 4{,}0\ \text{V}$.`,
        md`Corrente: $I = \frac{4{,}0}{2{,}0} = 2{,}0\ \text{A}$. Per la legge di Lenz circola in modo che il suo campo abbia lo stesso verso del campo originale, opponendosi alla sua diminuzione.`,
      ],
      answerMd: md`La f.e.m. media è 4,0 V e la corrente 2,0 A. Usare solo il campo finale, $100 \times \frac{0{,}0020}{0{,}20} = 1{,}0\ \text{V}$, è la risposta sbagliata che tenta: la f.e.m. nasce dalla variazione del flusso, non dal flusso stesso.`,
    },
    {
      id: 'example-transformer',
      title: 'Abbassare la tensione di rete',
      problemMd: md`Un trasformatore ideale ha 1200 spire nel primario, collegato a una rete alternata a 240 V, e 60 spire nel secondario. Qual è la tensione del secondario? Se il secondario eroga 2,0 A, quale corrente circola nel primario?`,
      steps: [
        md`Rapporto spire: $V_s = 240 \times \frac{60}{1200} = 12\ \text{V}$.`,
        md`Potenza in uscita: $12 \times 2{,}0 = 24\ \text{W}$. Un trasformatore ideale non perde nulla, quindi anche la potenza in ingresso è 24 W.`,
        md`Corrente nel primario: $I_p = \frac{24}{240} = 0{,}10\ \text{A}$. Verifica con il rapporto spire inverso: $2{,}0 \times \frac{60}{1200} = 0{,}10\ \text{A}$.`,
      ],
      answerMd: md`La tensione del secondario è 12 V e la corrente nel primario 0,10 A. Moltiplicare la corrente per lo stesso fattore 20 della tensione, nel verso sbagliato, dà 40 A nel primario, che preleverebbero 9600 W dalla rete per fornirne 24.`,
    },
  ],
  traps: [
    {
      title: 'Aspettarsi che una forza magnetica cambi la velocità',
      md: md`La forza magnetica su una carica in moto è sempre perpendicolare alla sua velocità, quindi non compie lavoro. Può curvare la traiettoria in una circonferenza, ma il modulo della velocità e l'energia cinetica restano gli stessi. Ogni opzione in cui un campo magnetico da solo accelera una carica facendole aumentare la velocità è sbagliata.`,
    },
    {
      title: 'Aspettarsi una f.e.m. da un campo costante',
      md: md`Una bobina ferma in un campo intenso ma costante non ha alcuna f.e.m. indotta. L'induzione richiede una variazione di flusso: un campo che cambia, un'area che cambia o un cambio di orientamento.`,
    },
    {
      title: md`Usare l'angolo sbagliato`,
      md: md`In $F = BIL\sin\theta$ e $F = qvB\sin\theta$, $\theta$ è l'angolo tra il filo (o la velocità) e il campo. In $\Phi = BA\cos\theta$, $\theta$ è l'angolo tra il campo e la normale alla superficie. Una bobina con il piano perpendicolare al campo ha il flusso massimo.`,
    },
    {
      title: 'Pensare che un trasformatore elevatore crei potenza',
      md: md`Alzare la tensione di un certo fattore abbassa la corrente dello stesso fattore, quindi $VI$ resta uguale in un trasformatore ideale, ed è un po' minore in uno reale. Un trasformatore richiede inoltre corrente alternata; con una corrente continua costante la tensione del secondario è zero.`,
    },
  ],
  check: [
    {
      id: 'check-proton-in-field',
      title: 'Un protone che attraversa un campo',
      topic: 'Magnetismo',
      stemMd: md`Un protone (carica $1{,}6 \times 10^{-19}\ \text{C}$) si muove a $2{,}0 \times 10^6\ \text{m/s}$ perpendicolarmente a un campo magnetico uniforme di 0,50 T. Quale affermazione è corretta?`,
      options: [
        { id: 'A', text: md`La forza su di esso è nulla, quindi prosegue in linea retta.`, note: md`La forza è nulla solo per un moto lungo il campo; qui il moto è perpendicolare al campo, dove la forza è massima.` },
        { id: 'B', text: md`La forza su di esso è $1{,}6 \times 10^{-13}\ \text{N}$, e il protone accelera aumentando la velocità.`, note: md`L'intensità è giusta, ma una forza perpendicolare alla velocità non compie lavoro, quindi il modulo della velocità non può cambiare.` },
        { id: 'C', text: md`La forza su di esso è $1{,}6 \times 10^{-13}\ \text{N}$, e il modulo della sua velocità resta costante.`, note: '' },
        { id: 'D', text: md`La forza su di esso è $3{,}2 \times 10^{-13}\ \text{N}$, e il modulo della sua velocità resta costante.`, note: md`È $qv$ senza il campo; moltiplicando per $B = 0{,}50\ \text{T}$ si dimezza.` },
        { id: 'E', text: md`La forza su di esso è $6{,}4 \times 10^{-13}\ \text{N}$, e il modulo della sua velocità resta costante.`, note: md`Divide $qv$ per $B$ invece di moltiplicare.` },
      ],
      answer: 'C',
      workingMd: md`$F = qvB = 1{,}6 \times 10^{-19} \times 2{,}0 \times 10^6 \times 0{,}50 = 1{,}6 \times 10^{-13}\ \text{N}$. La forza è perpendicolare alla velocità, quindi non compie lavoro: il protone percorre una circonferenza a velocità di modulo costante.`,
      lesson: md`La forza magnetica su una carica in moto ne curva la traiettoria ma non ne cambia mai il modulo della velocità.`,
    },
    {
      id: 'check-rotating-coil',
      title: 'Ruotare una bobina in un campo',
      topic: 'Induzione elettromagnetica',
      stemMd: md`Una bobina di 50 spire di area $0{,}040\ \text{m}^2$ ha il piano perpendicolare a un campo uniforme di 0,30 T. In 0,10 s viene ruotata in modo che il suo piano sia parallelo al campo. Qual è la f.e.m. media indotta?`,
      options: [
        { id: 'A', text: md`0 V`, note: md`Il campo non cambia, ma il flusso attraverso la bobina sì, da $BA$ a zero; alla legge di Faraday basta una variazione di flusso.` },
        { id: 'B', text: md`0,12 V`, note: md`Tralascia le 50 spire; ogni spira ha questa f.e.m., e le spire si sommano.` },
        { id: 'C', text: md`0,60 V`, note: md`È $N\,\Delta\Phi$, la variazione del flusso concatenato, non ancora divisa per 0,10 s.` },
        { id: 'D', text: md`6,0 V`, note: '' },
        { id: 'E', text: md`12 V`, note: md`Considera il flusso che si inverte da $+BA$ a $-BA$, cosa che richiederebbe mezzo giro; questo quarto di giro lo porta da $BA$ a zero.` },
      ],
      answer: 'D',
      workingMd: md`Il flusso attraverso una spira parte da $BA = 0{,}30 \times 0{,}040 = 0{,}012\ \text{Wb}$ e arriva a zero. Quindi $\varepsilon = N\frac{\Delta\Phi}{\Delta t} = 50 \times \frac{0{,}012}{0{,}10} = 6{,}0\ \text{V}$.`,
      lesson: md`Qualsiasi variazione di flusso induce una f.e.m., che cambi il campo, l'area o l'orientamento.`,
    },
    {
      id: 'check-ideal-transformer',
      title: 'Un trasformatore elevatore ideale',
      topic: 'Induzione elettromagnetica',
      stemMd: md`Un trasformatore ideale ha 200 spire nel primario e 1000 spire nel secondario. Il primario è collegato a una tensione alternata di 24 V ed è percorso da 5,0 A. Quali sono la tensione e la corrente del secondario?`,
      options: [
        { id: 'A', text: md`4,8 V e 25 A`, note: md`Inverte il rapporto spire; con più spire nel secondario la tensione sale e la corrente scende.` },
        { id: 'B', text: md`120 V e 25 A`, note: md`Fa crescere la corrente insieme alla tensione; la potenza in uscita sarebbe 3000 W a fronte di 120 W in ingresso.` },
        { id: 'C', text: md`120 V e 5,0 A`, note: md`Lascia invariata la corrente; la potenza in uscita sarebbe 600 W, cinque volte quella in ingresso.` },
        { id: 'D', text: md`120 V e 1,0 A`, note: '' },
        { id: 'E', text: md`4,8 V e 1,0 A`, note: md`La corrente è giusta, ma il rapporto delle tensioni è invertito: la bobina con più spire ha la tensione maggiore.` },
      ],
      answer: 'D',
      workingMd: md`$V_s = 24 \times \frac{1000}{200} = 120\ \text{V}$. La potenza in ingresso è $24 \times 5{,}0 = 120\ \text{W}$, e un trasformatore ideale la fornisce tutta, quindi $I_s = \frac{120}{120} = 1{,}0\ \text{A}$. Verifica: la corrente scende dello stesso fattore 5 di cui sale la tensione.`,
      lesson: md`Un trasformatore ideale cambia tensione e corrente di fattori inversi, mantenendo uguale $VI$.`,
    },
  ],
  takeaways: [
    md`La forza magnetica su una carica in moto è $qvB\sin\theta$, perpendicolare alla velocità, quindi non compie lavoro.`,
    md`Un filo percorso da una corrente $I$ in un campo subisce una forza $BIL\sin\theta$.`,
    md`Le correnti generano campi magnetici: circonferenze intorno a un filo rettilineo, un campo quasi uniforme dentro un solenoide.`,
    md`Una f.e.m. è indotta solo mentre il flusso cambia, $\varepsilon = -N\frac{\Delta\Phi}{\Delta t}$, e la corrente indotta si oppone alla variazione.`,
    md`Un trasformatore ideale segue $\frac{V_s}{V_p} = \frac{N_s}{N_p}$ e mantiene costante $VI$.`,
  ],
  flashcards: [
    { front: md`Forza su una carica in moto in un campo magnetico`, back: md`$F = qvB\sin\theta$, perpendicolare sia a $v$ sia a $B$; nulla per un moto lungo il campo. Non compie lavoro.` },
    { front: md`Forza su un filo percorso da corrente`, back: md`$F = BIL\sin\theta$, con $\theta$ l'angolo tra il filo e il campo.` },
    { front: md`Campo di un filo rettilineo lungo`, back: md`$B = \frac{\mu_0 I}{2\pi r}$; le linee di campo sono circonferenze intorno al filo, con il verso dato dalla regola della mano destra avvolgente.` },
    { front: md`Flusso magnetico`, back: md`$\Phi = BA\cos\theta$, in weber, con $\theta$ l'angolo tra il campo e la normale alla superficie.` },
    { front: md`Leggi di Faraday e di Lenz`, back: md`$\varepsilon = -N\frac{\Delta\Phi}{\Delta t}$; la corrente indotta circola in modo da opporsi alla variazione di flusso che la produce.` },
    { front: md`Il trasformatore ideale`, back: md`$\frac{V_s}{V_p} = \frac{N_s}{N_p}$ e $V_pI_p = V_sI_s$. Funziona solo con corrente alternata.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-phys-electricity' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-17', expertReview: null },
};
