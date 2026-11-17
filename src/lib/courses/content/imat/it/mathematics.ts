import { md, type Lesson } from '../../../types';

/**
 * Matematica IMAT (italiano). Ogni lezione corrisponde a quella inglese in
 * ../mathematics.ts: stessi slug, stessi collegamenti alla pratica, stesse
 * chiavi delle domande di verifica.
 */

export const algebraEquationsAndInequalitiesLessonIt: Lesson = {
  slug: 'algebra-equations-and-inequalities',
  title: 'Algebra: equazioni e disequazioni',
  summary: 'Risolvi a mano sistemi lineari, equazioni di secondo grado e disequazioni, usa il discriminante ed evita gli errori di segno che costano punti all’IMAT.',
  minutes: 22,
  objectives: [
    'Risolvere equazioni lineari e sistemi in due incognite per sostituzione o per riduzione, e verificare il risultato.',
    'Risolvere equazioni di secondo grado scomponendo o con la formula, e usare il discriminante, la somma e il prodotto delle radici.',
    'Risolvere disequazioni lineari, di secondo grado, fratte e con valore assoluto con lo studio del segno, senza perdere né inventare soluzioni.',
  ],
  teachMd: md`
### Perché l'algebra decide le domande di matematica

L'IMAT si svolge su carta, senza calcolatrice, e ogni domanda ha cinque opzioni. Quasi tutti i problemi di matematica e di fisica finiscono con un'equazione o una disequazione da risolvere, quindi un'algebra pulita è il passaggio da cui dipende tutto il resto. L'obiettivo non è la velocità a colpi di trucchi, ma una procedura breve e affidabile che si verifica in pochi secondi.

### Equazioni lineari e sistemi

Un'equazione lineare si risolve facendo la stessa operazione su entrambi i membri finché l'incognita resta da sola. L'unica regola da tenere d'occhio: si può moltiplicare o dividere per qualsiasi numero **tranne lo zero**.

Un sistema di due equazioni in due incognite si risolve in due modi:

- **Sostituzione** (*substitution*): si ricava un'incognita da un'equazione e la si sostituisce nell'altra. Conviene quando un coefficiente vale già 1.
- **Riduzione** (*elimination*): si moltiplicano le equazioni in modo che un'incognita abbia coefficienti opposti, poi si sommano. Conviene quando nessun coefficiente vale 1.

Sostituisci sempre la coppia trovata in **entrambe** le equazioni di partenza. Una coppia che ne soddisfa una sola rivela un errore di calcolo, e quell'errore di solito è uno dei distrattori.

### Equazioni di secondo grado

Scrivi prima l'equazione nella forma $ax^2 + bx + c = 0$: la scomposizione risolve un'equazione solo se l'altro membro è zero, perché solo un prodotto nullo obbliga uno dei fattori ad annullarsi. Poi:

- prova a scomporre. Per $x^2 + bx + c$ servono due numeri con prodotto $c$ e somma $b$;
- se non ci riesci, usa la formula $x = \frac{-b \pm \sqrt{\Delta}}{2a}$ con il **discriminante** (*discriminant*) $\Delta = b^2 - 4ac$.

Il discriminante da solo dice quante radici reali ci sono: due distinte se $\Delta > 0$, una doppia se $\Delta = 0$, nessuna se $\Delta < 0$. Le domande del tipo "per quali valori di $k$…" sono di solito domande sul discriminante.

Quando le radici $x_1$ e $x_2$ sono reali, confrontando $a(x - x_1)(x - x_2)$ con $ax^2 + bx + c$ si ottiene

$$x_1 + x_2 = -\frac{b}{a}, \qquad x_1 x_2 = \frac{c}{a}.$$

Queste relazioni rispondono a domande sulle radici senza calcolarle, e servono a controllare quelle trovate: le radici di $x^2 - 5x + 6 = 0$ sono 2 e 3, che hanno somma 5 e prodotto 6.

Vale la pena conoscere anche l'identità $(x - y)^2 = (x + y)^2 - 4xy$: dà la differenza di due numeri a partire dalla loro somma e dal loro prodotto.

### Disequazioni lineari

Le disequazioni (*inequalities*) si risolvono come le equazioni, con una regola in più: **moltiplicando o dividendo entrambi i membri per un numero negativo, il verso si inverte**. Da $-3x < 12$ si ottiene $x > -4$, non $x < -4$. Una prova con un solo valore (qui $x = 0$: $0 < 12$, vero, e $0 > -4$, vero) intercetta l'errore.

### Disequazioni di secondo grado

Porta tutto a primo membro e trova le radici del trinomio. Se $a > 0$ la parabola è rivolta verso l'alto, quindi:

- il trinomio è **negativo tra** le radici;
- è **positivo all'esterno** delle radici.

Così $x^2 - 9 < 0$ dà $-3 < x < 3$, e $x^2 - 9 > 0$ dà $x < -3$ oppure $x > 3$. Scrivere "$x > \pm 3$" non ha senso: una soluzione "esterna" è sempre fatta di due parti separate. Se $\Delta < 0$ e $a > 0$, il trinomio è positivo per ogni $x$.

### Disequazioni fratte e studio del segno

In una disequazione come $\frac{x - 1}{x + 3} \ge 2$ non moltiplicare mai entrambi i membri per $x + 3$: non sai se è positivo o negativo, quindi non sai se invertire il verso. Procedi così:

1. Porta tutto a primo membro: $\frac{x - 1}{x + 3} - 2 \ge 0$.
2. Riduci a un'unica frazione e semplifica il numeratore.
3. Segna sulla retta gli zeri del numeratore e del denominatore.
4. Trova il segno in ogni intervallo provando un valore.
5. Includi gli zeri del numeratore se la disequazione è con $\ge$ o $\le$; **non** includere **mai** gli zeri del denominatore.

### Valore assoluto

$|x - a|$ è la distanza tra $x$ e $a$. Quindi, per $b > 0$:

$$|x - a| < b \iff a - b < x < a + b, \qquad |x - a| > b \iff x < a - b \text{ oppure } x > a + b.$$

"Minore di" dà un solo intervallo attorno ad $a$; "maggiore di" dà due parti esterne. Se dentro il valore assoluto c'è $2x - 3$ invece di $x - a$, scrivi prima la doppia disequazione e poi risolvila.

### Il controllo sulle opzioni

Con cinque opzioni e una penalità per la risposta sbagliata, un controllo di 10 secondi conviene. Sostituisci un valore interno alla tua soluzione e uno esterno: quello interno deve soddisfare la disequazione di partenza, quello esterno no. I distrattori nascono di solito da un unico errore, come il verso sbagliato o un estremo perso, e questo controllo li separa in fretta.
`,
  examples: [
    {
      id: 'example-linear-system',
      title: 'Un sistema per riduzione, verificato per sostituzione',
      problemMd: md`Risolvi il sistema $3x + 2y = 16$ e $x - y = 2$.`,
      steps: [
        md`I coefficienti di $y$ non coincidono: moltiplica la seconda equazione per 2 in modo che diventino opposti, $2x - 2y = 4$.`,
        md`Sommala alla prima: $3x + 2y + 2x - 2y = 16 + 4$, quindi $5x = 20$ e $x = 4$.`,
        md`Sostituisci $x = 4$ in $x - y = 2$: $y = 2$.`,
        md`Seconda strada, per sostituzione: $x = y + 2$, quindi $3(y + 2) + 2y = 16$, da cui $5y = 10$, $y = 2$ e $x = 4$. Verifica in entrambe le equazioni: $12 + 4 = 16$ e $4 - 2 = 2$.`,
      ],
      answerMd: md`$x = 4$, $y = 2$. Verificare una sola equazione non basta: una coppia che ne soddisfa una ma non l'altra nasce da un errore nel passaggio di riduzione.`,
    },
    {
      id: 'example-quadratic-inequality',
      title: 'Una disequazione di secondo grado',
      problemMd: md`Risolvi $x^2 - x - 6 < 0$.`,
      steps: [
        md`Trova le radici: due numeri con prodotto $-6$ e somma $-1$ sono $-3$ e $2$, quindi $x^2 - x - 6 = (x - 3)(x + 2)$, con radici $3$ e $-2$.`,
        md`Il coefficiente di $x^2$ è positivo: la parabola è rivolta verso l'alto ed è negativa **tra** le radici.`,
        md`Prova un valore interno e uno esterno: $x = 0$ dà $-6 < 0$, vero; $x = 4$ dà $16 - 4 - 6 = 6$, non negativo.`,
      ],
      answerMd: md`$-2 < x < 3$. La risposta sbagliata più allettante è $x < -2$ oppure $x > 3$, cioè dove il trinomio è **positivo**.`,
    },
    {
      id: 'example-rational-inequality',
      title: 'Una disequazione fratta con lo studio del segno',
      problemMd: md`Risolvi $\frac{x - 1}{x + 3} \ge 2$.`,
      steps: [
        md`Non moltiplicare per $x + 3$, di cui non conosci il segno. Sottrai 2: $\frac{x - 1 - 2(x + 3)}{x + 3} \ge 0$, cioè $\frac{-x - 7}{x + 3} \ge 0$.`,
        md`Moltiplica il numeratore per $-1$ e inverti il verso: $\frac{x + 7}{x + 3} \le 0$.`,
        md`Valori critici: il numeratore si annulla in $x = -7$, il denominatore in $x = -3$. La frazione è negativa solo tra i due.`,
        md`Estremi: $x = -7$ rende la frazione uguale a $0$, che soddisfa $\le 0$, quindi è incluso; $x = -3$ annulla il denominatore, quindi è escluso.`,
        md`Verifica nella disequazione di partenza: $x = -5$ dà $\frac{-6}{-2} = 3 \ge 2$, vero; $x = -7$ dà $\frac{-8}{-4} = 2 \ge 2$, vero; $x = 0$ dà $-\frac{1}{3}$, falso.`,
      ],
      answerMd: md`$-7 \le x < -3$. Moltiplicando per $x + 3$ si ottiene $x - 1 \ge 2x + 6$, cioè $x \le -7$: è la risposta sbagliata, perché presuppone $x + 3 > 0$, falso per ogni $x \le -7$.`,
    },
  ],
  traps: [
    {
      title: 'Dividere per un negativo senza invertire il verso',
      md: md`Da $-2x \ge 8$ la soluzione è $x \le -4$. Tenere $\ge$ dà $x \ge -4$, cioè esattamente l'insieme opposto, e sarà tra le opzioni. Dopo aver diviso per un numero negativo, inverti il verso e poi prova un valore.`,
    },
    {
      title: 'Moltiplicare per un\'espressione di segno ignoto',
      md: md`In $\frac{x - 1}{x + 3} \ge 2$, moltiplicare per $x + 3$ presuppone in silenzio $x + 3 > 0$. Porta tutto a primo membro, riduci a un'unica frazione e studia il segno. Lo stesso vale se dividi entrambi i membri di $x^2 = 5x$ per $x$: perdi la radice $x = 0$.`,
    },
    {
      title: 'Scrivere una soluzione esterna come un solo intervallo',
      md: md`$x^2 > 9$ è $x < -3$ oppure $x > 3$, due parti separate. "$x > \pm 3$" e "$-3 > x > 3$" non descrivono nulla. Immagina la parabola rivolta verso l'alto: positiva fuori dalle radici, negativa tra di esse.`,
    },
    {
      title: 'Contare una radice doppia come due radici distinte',
      md: md`"Due radici reali distinte" richiede $\Delta > 0$, in senso stretto. Se $\Delta = 0$ le due radici coincidono. Un'opzione che include i valori di confine ($\le$ o $\ge$) è costruita apposta per questo errore.`,
    },
  ],
  check: [
    {
      id: 'check-discriminant-k',
      title: 'Due radici reali distinte',
      topic: 'Algebra e funzioni',
      stemMd: md`Per quali valori di $k$ l'equazione $x^2 + kx + 9 = 0$ ha due radici reali distinte?`,
      options: [
        { id: 'A', text: md`$-6 < k < 6$`, note: md`È dove $k^2 - 36 < 0$, cioè i valori **senza** radici reali: interno ed esterno della disequazione sono stati scambiati.` },
        { id: 'B', text: md`solo $k > 6$`, note: md`Manca il ramo negativo: $k^2 > 36$ vale anche per $k < -6$, per esempio $k = -10$.` },
        { id: 'C', text: md`$k \le -6$ oppure $k \ge 6$`, note: md`Per $k = \pm 6$ il discriminante è nullo e le due radici coincidono: si ha una radice doppia, non due radici distinte.` },
        { id: 'D', text: md`$k < -6$ oppure $k > 6$`, note: '' },
        { id: 'E', text: md`$k > 36$`, note: md`Confronta $k$ con 36 invece di $k^2$: non è stata estratta la radice quadrata di entrambi i membri.` },
      ],
      answer: 'D',
      workingMd: md`Due radici reali distinte richiedono $\Delta > 0$: $\Delta = k^2 - 4 \cdot 1 \cdot 9 = k^2 - 36 > 0$, quindi $k^2 > 36$, che vale all'esterno delle radici $\pm 6$: $k < -6$ oppure $k > 6$. Verifica: $k = 10$ dà $x^2 + 10x + 9 = (x + 1)(x + 9)$, due radici; $k = 6$ dà $(x + 3)^2$, una radice doppia.`,
      lesson: 'Per "due radici reali distinte" risolvi la disequazione stretta sul discriminante, e ricorda che un quadrato maggiore di un numero dà due parti.',
    },
    {
      id: 'check-absolute-value',
      title: 'Una disequazione con valore assoluto',
      topic: 'Algebra e funzioni',
      stemMd: md`Quale insieme di valori soddisfa $|2x - 3| < 5$?`,
      options: [
        { id: 'A', text: md`$-1 < x < 4$`, note: '' },
        { id: 'B', text: md`$x < 4$`, note: md`È stato tenuto solo l'estremo superiore; $x = -5$ dà $|-13| = 13$, che non è minore di 5.` },
        { id: 'C', text: md`$-4 < x < 1$`, note: md`Questa è la soluzione di $|2x + 3| < 5$: è stato letto male il segno dentro il valore assoluto.` },
        { id: 'D', text: md`$x < -1$ oppure $x > 4$`, note: md`Questa è la soluzione di $|2x - 3| > 5$, cioè dove $2x - 3$ dista **più** di 5 da zero, non meno.` },
        { id: 'E', text: md`$\frac{3}{2} \le x < 4$`, note: md`È stato risolto solo il caso $2x - 3 \ge 0$; il caso in cui $2x - 3$ è negativo è stato tralasciato.` },
      ],
      answer: 'A',
      workingMd: md`$|2x - 3| < 5$ significa $-5 < 2x - 3 < 5$. Aggiungi 3: $-2 < 2x < 8$. Dividi per 2: $-1 < x < 4$. Verifica: $x = 0$ dà $|-3| = 3 < 5$, vero; $x = 4$ dà $|5| = 5$, non minore di 5, quindi 4 è giustamente escluso.`,
      lesson: 'Trasforma "valore assoluto minore di b" in un\'unica doppia disequazione e risolvi le tre parti insieme.',
    },
    {
      id: 'check-sum-and-product',
      title: 'La differenza da somma e prodotto',
      topic: 'Algebra e funzioni',
      stemMd: md`Due numeri hanno somma 20 e prodotto 91. Qual è la differenza positiva tra i due?`,
      options: [
        { id: 'A', text: md`$3$`, note: md`3 è la distanza di ciascun numero dalla loro media, 10; i numeri sono $10 + 3$ e $10 - 3$, quindi la loro differenza è il doppio.` },
        { id: 'B', text: md`$6$`, note: '' },
        { id: 'C', text: md`$13$`, note: md`13 è il maggiore dei due numeri, non la differenza tra di essi.` },
        { id: 'D', text: md`$\sqrt{218}$`, note: md`Usa $(x - y)^2 = (x + y)^2 - 2xy$; l'identità corretta sottrae $4xy$.` },
        { id: 'E', text: md`$36$`, note: md`36 è $(x - y)^2$; alla fine non è stata estratta la radice quadrata.` },
      ],
      answer: 'B',
      workingMd: md`Prima strada: $(x - y)^2 = (x + y)^2 - 4xy = 400 - 364 = 36$, quindi la differenza è 6. Seconda strada: i numeri sono le radici di $t^2 - 20t + 91 = 0$, che si scompone in $(t - 7)(t - 13)$, cioè 7 e 13, la cui differenza è 6.`,
      lesson: 'Somma e prodotto individuano una coppia di numeri: usa l\'equazione di secondo grado che definiscono o l\'identità del quadrato della differenza.',
    },
  ],
  takeaways: [
    'Sostituisci ogni soluzione nelle equazioni o nella disequazione di partenza prima di scegliere un\'opzione.',
    md`Il discriminante $b^2 - 4ac$ conta le radici reali: due se positivo, una se nullo, nessuna se negativo.`,
    'Moltiplicando o dividendo una disequazione per un numero negativo il verso si inverte; non moltiplicare mai per un\'espressione di segno ignoto.',
    'Una parabola rivolta verso l\'alto è negativa tra le radici e positiva all\'esterno; una soluzione esterna è fatta di due parti.',
    md`$|x - a| < b$ è un intervallo attorno ad $a$; $|x - a| > b$ sono due parti esterne.`,
  ],
  flashcards: [
    { front: 'Discriminante e numero di radici reali', back: md`Per $ax^2 + bx + c = 0$, $\Delta = b^2 - 4ac$. Due radici reali distinte se $\Delta > 0$, una radice doppia se $\Delta = 0$, nessuna se $\Delta < 0$.` },
    { front: 'Somma e prodotto delle radici di un\'equazione di secondo grado', back: md`$x_1 + x_2 = -\frac{b}{a}$ e $x_1 x_2 = \frac{c}{a}$.` },
    { front: 'Dividere una disequazione per un numero negativo', back: 'Il verso si inverte. Poi prova un valore per confermare la direzione.' },
    { front: md`Soluzione di $x^2 - 9 < 0$ e di $x^2 - 9 > 0$`, back: md`$-3 < x < 3$ (tra le radici) e $x < -3$ oppure $x > 3$ (all'esterno delle radici).` },
    { front: 'Metodo per una disequazione fratta', back: 'Porta tutto a primo membro, riduci a un\'unica frazione, segna gli zeri di numeratore e denominatore e leggi il segno in ogni intervallo. Non includere mai uno zero del denominatore.' },
    { front: md`$|x - a| < b$ con $b > 0$`, back: md`$a - b < x < a + b$: i valori la cui distanza da $a$ è minore di $b$.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-math-algebra-functions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const exponentialsLogarithmsAndFunctionsLessonIt: Lesson = {
  slug: 'exponentials-logarithms-and-functions',
  title: 'Esponenziali, logaritmi e funzioni',
  summary: 'Usa le proprietà di potenze e logaritmi, risolvi a mano equazioni esponenziali e logaritmiche, e gestisci domini, composizioni, inverse e traslazioni.',
  minutes: 24,
  objectives: [
    'Applicare le proprietà delle potenze e dei logaritmi per semplificare espressioni e stimare logaritmi da valori dati.',
    'Risolvere equazioni esponenziali riducendo alla stessa base o con una sostituzione, ed equazioni logaritmiche controllando il dominio.',
    'Trovare il dominio di una funzione, comporre funzioni, trovare l\'inversa e descrivere le trasformazioni di un grafico.',
  ],
  teachMd: md`
### Prima le potenze

I logaritmi sono facili solo quanto le potenze che li sostengono, quindi si parte dalle proprietà delle potenze. Per una base positiva $a$:

$$a^m \cdot a^n = a^{m+n}, \qquad \frac{a^m}{a^n} = a^{m-n}, \qquad (a^m)^n = a^{mn}, \qquad a^{-n} = \frac{1}{a^n}, \qquad a^{\frac{1}{n}} = \sqrt[n]{a}.$$

Qui si nascondono due trappole. $a^m + a^n$ non ha una semplificazione propria: si combinano solo prodotti e quozienti. E $(a + b)^2$ non è $a^2 + b^2$.

### Equazioni esponenziali

Senza calcolatrice, un'equazione esponenziale si risolve di solito in uno di due modi.

**Stessa base.** Scrivi i due membri come potenze della stessa base e uguaglia gli esponenti, perché $a^p = a^q$ implica $p = q$ quando $a > 0$ e $a \ne 1$. Conosci a memoria le potenze piccole: $2^{10} = 1024$, $3^5 = 243$, $4 = 2^2$, $8 = 2^3$, $9 = 3^2$, $27 = 3^3$, $25 = 5^2$, $125 = 5^3$.

**Sostituzione.** Un'equazione come $9^x - 4 \cdot 3^x + 3 = 0$ è un'equazione di secondo grado travestita: $9^x = (3^x)^2$, quindi poni $t = 3^x$. Risolvi in $t$, poi torna a $x$. Poiché $3^x > 0$ per ogni $x$, un valore negativo di $t$ non dà soluzioni e va scartato.

### Logaritmi

$\log_a b = c$ significa esattamente $a^c = b$: il logaritmo (*logarithm*) è l'esponente. È definito solo per una base $a > 0$ con $a \ne 1$ e un argomento $b > 0$. Alcuni valori seguono subito: $\log_a 1 = 0$, $\log_a a = 1$, $\log_2 32 = 5$, $\log_{10} 0{,}01 = -2$.

Le proprietà dei logaritmi sono le proprietà delle potenze lette al contrario:

$$\log_a (xy) = \log_a x + \log_a y, \qquad \log_a \frac{x}{y} = \log_a x - \log_a y, \qquad \log_a x^n = n \log_a x.$$

La formula del cambiamento di base (*change of base*) è $\log_a b = \frac{\log_c b}{\log_c a}$ per qualsiasi base valida $c$. Attenzione a ciò che **non** è una proprietà: $\log(x + y)$ non si spezza, e $\log x \cdot \log y$ non è $\log(xy)$.

Una tipica domanda senza calcolatrice fornisce $\log_{10} 2$ e $\log_{10} 3$ e chiede il logaritmo di un altro numero. Scomponi quel numero in fattori 2, 3 e 10 e somma: $\log_{10} 12 = \log_{10}(2^2 \cdot 3) = 2\log_{10} 2 + \log_{10} 3$. Un fatto collegato: $\log_{10} 5 = \log_{10} 10 - \log_{10} 2 = 1 - \log_{10} 2$.

### Le equazioni logaritmiche richiedono il controllo del dominio

Riunisci i logaritmi in un unico logaritmo, riscrivilo come potenza e risolvi. Poi **verifica ogni candidato nell'equazione di partenza**, perché riunire $\log x + \log(x - 2)$ in $\log(x(x - 2))$ allarga il dominio: il prodotto può essere positivo quando entrambi i fattori sono negativi. Un candidato che rende nullo o negativo uno degli argomenti di partenza va scartato.

### Funzioni: il dominio

Il dominio (*domain*) è l'insieme dei valori per cui la formula ha senso. Tre condizioni coprono quasi tutte le domande:

- un denominatore non può essere nullo;
- una radice di indice pari richiede un radicando non negativo (lo zero è ammesso);
- un logaritmo richiede un argomento strettamente positivo.

Quando un logaritmo sta al denominatore valgono entrambe: l'argomento deve essere positivo **e** il logaritmo non deve essere nullo, cosa che accade quando l'argomento vale 1.

### Composizione e funzione inversa

$f(g(x))$ significa: applica prima $g$, poi $f$. Lavora dall'interno verso l'esterno. In generale $f(g(x)) \ne g(f(x))$, quindi leggi l'ordine con attenzione.

La funzione inversa (*inverse function*) $f^{-1}$ annulla l'effetto di $f$: se $f(a) = b$ allora $f^{-1}(b) = a$. Per trovarla scrivi $y = f(x)$, ricava $x$ in funzione di $y$, poi rinomina le variabili. Solo una funzione iniettiva (*one-to-one*) ha un'inversa. Il grafico di $f^{-1}$ è il simmetrico di quello di $f$ rispetto alla retta $y = x$, ed è per questo che $y = \log_a x$ e $y = a^x$ si specchiano l'una nell'altra.

### Grafici e trasformazioni

Per $a > 1$, $y = a^x$ è crescente, sempre positiva, passa per $(0, 1)$ e si avvicina all'asse $x$ verso sinistra. Per $0 < a < 1$ è decrescente. $y = \log_a x$ (con $a > 1$) passa per $(1, 0)$, è definita solo per $x > 0$ e ha l'asse $y$ come asintoto.

Partendo da $y = f(x)$:

- $y = f(x - h)$ trasla il grafico di $h$ unità verso **destra** (il segno dentro sembra opposto);
- $y = f(x) + k$ lo trasla di $k$ unità verso l'**alto**;
- $y = -f(x)$ lo ribalta rispetto all'asse $x$, e $y = f(-x)$ rispetto all'asse $y$.

Quindi $y = 2^{x - 3} + 1$ è $y = 2^x$ spostata di 3 a destra e di 1 in alto: il punto $(0, 1)$ va in $(3, 2)$, e infatti $2^0 + 1 = 2$.
`,
  examples: [
    {
      id: 'example-common-base',
      title: 'Un\'equazione esponenziale con la stessa base',
      problemMd: md`Risolvi $4^{x + 1} = 8^{x - 1}$.`,
      steps: [
        md`Sia 4 sia 8 sono potenze di 2: $4^{x + 1} = (2^2)^{x + 1} = 2^{2x + 2}$ e $8^{x - 1} = (2^3)^{x - 1} = 2^{3x - 3}$.`,
        md`Potenze uguali della stessa base hanno esponenti uguali: $2x + 2 = 3x - 3$, quindi $x = 5$.`,
        md`Verifica: $4^6 = (2^2)^6 = 2^{12}$ e $8^4 = (2^3)^4 = 2^{12}$, entrambi uguali a 4096.`,
      ],
      answerMd: md`$x = 5$. Uguagliare gli esponenti prima di cambiare base ($x + 1 = x - 1$) non dà soluzioni ed è la tipica falsa partenza.`,
    },
    {
      id: 'example-log-equation',
      title: 'Un\'equazione logaritmica e il suo dominio',
      problemMd: md`Risolvi $\log_2 x + \log_2 (x - 2) = 3$.`,
      steps: [
        md`Il dominio dell'equazione di partenza richiede $x > 0$ e $x - 2 > 0$, quindi $x > 2$.`,
        md`Riunisci con la proprietà del prodotto: $\log_2 \left(x(x - 2)\right) = 3$, quindi $x(x - 2) = 2^3 = 8$.`,
        md`Risolvi $x^2 - 2x - 8 = 0$: $(x - 4)(x + 2) = 0$, quindi $x = 4$ oppure $x = -2$.`,
        md`Scarta $x = -2$: rende $\log_2 x$ non definito. Verifica $x = 4$: $\log_2 4 + \log_2 2 = 2 + 1 = 3$.`,
      ],
      answerMd: md`Solo $x = 4$. Indicare entrambe le radici dell'equazione di secondo grado è la risposta sbagliata più allettante: $-2$ soddisfa l'equazione riunita ma non quella di partenza.`,
    },
    {
      id: 'example-composition-inverse',
      title: 'Composizione e inversa',
      problemMd: md`Siano $f(x) = 2x - 3$ e $g(x) = x^2 + 1$. Trova $f(g(2))$, $g(f(2))$ e $f^{-1}(7)$.`,
      steps: [
        md`Dall'interno verso l'esterno per $f(g(2))$: $g(2) = 4 + 1 = 5$, poi $f(5) = 10 - 3 = 7$.`,
        md`Per $g(f(2))$: $f(2) = 4 - 3 = 1$, poi $g(1) = 1 + 1 = 2$. L'ordine conta.`,
        md`Per $f^{-1}(7)$: risolvi $2x - 3 = 7$, quindi $x = 5$. Oppure trova l'inversa in generale: $y = 2x - 3$ dà $x = \frac{y + 3}{2}$, quindi $f^{-1}(7) = \frac{10}{2} = 5$.`,
        md`Controllo incrociato: dal primo passaggio $f(5) = 7$, quindi $f^{-1}(7) = 5$ è coerente.`,
      ],
      answerMd: md`$f(g(2)) = 7$, $g(f(2)) = 2$ e $f^{-1}(7) = 5$. Calcolare $\frac{1}{f(7)} = \frac{1}{11}$ confonde la funzione inversa con il reciproco.`,
    },
  ],
  traps: [
    {
      title: 'Inventare proprietà dei logaritmi',
      md: md`$\log(x + y)$ non è uguale a $\log x + \log y$, e $\log x \cdot \log y$ non è $\log(xy)$. Si semplifica solo il logaritmo di un prodotto, di un quoziente o di una potenza. Quando un'opzione sembra troppo comoda, provala con i numeri: $\log_{10}(10 + 10) \approx 1{,}3$, non $2$.`,
    },
    {
      title: 'Tenere tutte le radici di un\'equazione logaritmica',
      md: md`Riunire i logaritmi può produrre candidati fuori dal dominio di partenza. Sostituisci ogni candidato negli argomenti **originali**; se uno di essi risulta nullo o negativo, il candidato va scartato.`,
    },
    {
      title: 'Traslare il grafico dalla parte sbagliata',
      md: md`$f(x - 3)$ sposta il grafico di 3 unità verso destra, non verso sinistra, perché l'ingresso deve essere più grande di 3 per dare la stessa uscita. Verifica con un punto: il punto in cui l'argomento vale zero si è spostato in $x = 3$.`,
    },
    {
      title: 'Confondere l\'inversa con il reciproco',
      md: md`$f^{-1}(x)$ è la funzione che annulla $f$; $\frac{1}{f(x)}$ è il reciproco. Quasi sempre sono diverse. Prova: $f(f^{-1}(x))$ deve restituire $x$.`,
    },
  ],
  check: [
    {
      id: 'check-log-72',
      title: 'Un logaritmo da valori dati',
      topic: 'Algebra e funzioni',
      stemMd: md`Sapendo che $\log_{10} 2 \approx 0{,}30$ e $\log_{10} 3 \approx 0{,}48$, qual è la migliore approssimazione di $\log_{10} 72$?`,
      options: [
        { id: 'A', text: md`$0{,}78$`, note: md`È $\log_{10} 2 + \log_{10} 3 = \log_{10} 6$: sono stati ignorati gli esponenti in $72 = 2^3 \cdot 3^2$.` },
        { id: 'B', text: md`$0{,}86$`, note: md`Moltiplica $3 \times 0{,}30$ per $2 \times 0{,}48$; il logaritmo di un prodotto è una somma di logaritmi, non un prodotto.` },
        { id: 'C', text: md`$1{,}56$`, note: md`È $2\log_{10} 6 = \log_{10} 36$: è stato dimenticato il fattore 2 rimanente in $72 = 36 \cdot 2$.` },
        { id: 'D', text: md`$1{,}86$`, note: '' },
        { id: 'E', text: md`$2{,}04$`, note: md`Usa $2^2 \cdot 3^3$, che vale 108, non 72: i due esponenti sono stati scambiati.` },
      ],
      answer: 'D',
      workingMd: md`$72 = 8 \cdot 9 = 2^3 \cdot 3^2$, quindi $\log_{10} 72 = 3\log_{10} 2 + 2\log_{10} 3 \approx 0{,}90 + 0{,}96 = 1{,}86$. Seconda strada: $72 = 2 \cdot 6^2$, quindi $\log_{10} 72 = \log_{10} 2 + 2\log_{10} 6 \approx 0{,}30 + 2(0{,}78) = 1{,}86$. Controllo di buon senso: 72 è compreso tra 10 e 100, quindi il suo logaritmo è compreso tra 1 e 2.`,
      lesson: 'Scomponi il numero nei fattori primi di cui conosci il logaritmo, poi somma i logaritmi usando gli esponenti come moltiplicatori.',
    },
    {
      id: 'check-domain',
      title: 'Dominio con una radice e un logaritmo',
      topic: 'Algebra e funzioni',
      stemMd: md`Qual è il dominio di $f(x) = \frac{\sqrt{4 - x}}{\ln(x - 1)}$?`,
      options: [
        { id: 'A', text: md`$1 < x \le 4$`, note: md`Dimentica che il denominatore $\ln(x - 1)$ si annulla in $x = 2$, dove la frazione non è definita.` },
        { id: 'B', text: md`$x > 1$, $x \ne 2$`, note: md`Ignora la radice quadrata, che richiede $4 - x \ge 0$: i valori maggiori di 4 non sono ammessi.` },
        { id: 'C', text: md`$1 \le x \le 4$, $x \ne 2$`, note: md`In $x = 1$ l'argomento del logaritmo è zero, e $\ln 0$ non è definito.` },
        { id: 'D', text: md`$1 < x < 4$, $x \ne 2$`, note: md`Esclude $x = 4$, ma $\sqrt{0} = 0$ è definito e $\ln 3 \ne 0$, quindi $f(4) = 0$ esiste.` },
        { id: 'E', text: md`$1 < x \le 4$, $x \ne 2$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Tre condizioni. La radice: $4 - x \ge 0$, quindi $x \le 4$. Il logaritmo: $x - 1 > 0$, quindi $x > 1$. Il denominatore: $\ln(x - 1) \ne 0$, quindi $x - 1 \ne 1$, cioè $x \ne 2$. Insieme: $1 < x \le 4$ con $x \ne 2$.`,
      lesson: 'Elenca ogni condizione separatamente (denominatore, radice di indice pari, logaritmo) e solo dopo mettile a sistema.',
    },
    {
      id: 'check-exponential-substitution',
      title: 'Un\'equazione esponenziale travestita',
      topic: 'Algebra e funzioni',
      stemMd: md`Qual è la somma di tutte le soluzioni reali di $9^x - 4 \cdot 3^x + 3 = 0$?`,
      options: [
        { id: 'A', text: md`$0$`, note: md`0 è una delle due soluzioni (o il loro prodotto), non la loro somma; è stata dimenticata la soluzione $x = 1$.` },
        { id: 'B', text: md`$1$`, note: '' },
        { id: 'C', text: md`$3$`, note: md`3 è un valore di $t = 3^x$, non di $x$: la sostituzione non è stata invertita.` },
        { id: 'D', text: md`$4$`, note: md`4 è la somma dei valori di $t = 3^x$ (1 e 3), non dei valori di $x$.` },
        { id: 'E', text: md`Non ci sono soluzioni reali`, note: md`Entrambi i valori di $t$ sono positivi, quindi danno entrambi un $x$ reale; solo un $t$ negativo andrebbe scartato.` },
      ],
      answer: 'B',
      workingMd: md`Poni $t = 3^x > 0$, così $9^x = t^2$ e l'equazione diventa $t^2 - 4t + 3 = 0$, cioè $(t - 1)(t - 3) = 0$. Allora $3^x = 1$ dà $x = 0$ e $3^x = 3$ dà $x = 1$. La somma è 1. Verifica: $x = 1$ dà $9 - 12 + 3 = 0$; $x = 0$ dà $1 - 4 + 3 = 0$.`,
      lesson: 'Quando una potenza è il quadrato di un\'altra, sostituisci, risolvi l\'equazione di secondo grado e riporta ogni radice positiva all\'incognita di partenza.',
    },
  ],
  takeaways: [
    md`$\log_a b = c$ significa $a^c = b$; l'argomento deve essere positivo.`,
    'I logaritmi trasformano i prodotti in somme, i quozienti in differenze e le potenze in moltiplicatori; le somme non si spezzano.',
    'Risolvi le equazioni esponenziali riducendo alla stessa base o sostituendo la potenza che si ripete.',
    'Verifica ogni candidato di un\'equazione logaritmica nell\'equazione di partenza.',
    md`$f(x - h) + k$ sposta il grafico di $h$ verso destra e di $k$ verso l'alto.`,
  ],
  flashcards: [
    { front: 'Definizione di logaritmo', back: md`$\log_a b = c$ significa $a^c = b$, con $a > 0$, $a \ne 1$ e $b > 0$.` },
    { front: 'Le tre proprietà dei logaritmi', back: md`$\log_a(xy) = \log_a x + \log_a y$, $\log_a \frac{x}{y} = \log_a x - \log_a y$, $\log_a x^n = n\log_a x$.` },
    { front: 'Cambiamento di base', back: md`$\log_a b = \frac{\log_c b}{\log_c a}$ per qualsiasi base valida $c$.` },
    { front: md`Risolvere un'equazione come $9^x - 4 \cdot 3^x + 3 = 0$`, back: md`Poni $t = 3^x$ (così $9^x = t^2$), risolvi l'equazione di secondo grado in $t$, scarta i $t$ negativi, poi risolvi $3^x = t$.` },
    { front: 'Tre condizioni sul dominio', back: 'Un denominatore non può essere nullo, una radice di indice pari richiede un radicando non negativo e un logaritmo richiede un argomento positivo.' },
    { front: md`Effetto di $f(x - h) + k$ su un grafico`, back: md`Il grafico di $f$ si sposta di $h$ unità verso destra e di $k$ unità verso l'alto.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-math-algebra-functions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const geometryAndTrigonometryLessonIt: Lesson = {
  slug: 'geometry-and-trigonometry',
  title: 'Geometria e trigonometria',
  summary: 'Figure piane, cerchi, rette e circonferenze nel piano cartesiano; trigonometria con valori esatti, teoremi dei seni e del coseno e circonferenza goniometrica.',
  minutes: 25,
  objectives: [
    'Usare le proprietà di triangoli, poligoni e cerchi, compresi Pitagora, la similitudine, gli archi e i settori.',
    'Trovare distanze, punti medi, coefficienti angolari, equazioni di rette e centro e raggio di una circonferenza nel piano cartesiano.',
    'Usare i valori esatti delle funzioni goniometriche, la circonferenza goniometrica, l\'identità sin² + cos² = 1 e i teoremi dei seni e del coseno.',
  ],
  teachMd: md`
### La geometria piana da avere pronta

- La somma degli angoli di un triangolo è $180^\circ$; quella di un poligono con $n$ lati è $(n - 2) \cdot 180^\circ$.
- **Teorema di Pitagora**: in un triangolo rettangolo $a^2 + b^2 = c^2$, con $c$ l'ipotenusa. Impara le terne pitagoriche più comuni, $3, 4, 5$, $5, 12, 13$, $8, 15, 17$ e i loro multipli: molte domande non richiedono alcuna radice quadrata.
- I **triangoli simili** (*similar triangles*) hanno angoli uguali e lati in proporzione. Se le lunghezze si moltiplicano per $k$, le aree si moltiplicano per $k^2$ e i volumi per $k^3$.
- Aree: triangolo $\frac{1}{2}bh$, parallelogramma $bh$, trapezio $\frac{1}{2}(a + b)h$.

### Cerchio e circonferenza

Per un cerchio di raggio $r$: circonferenza $2\pi r$, area $\pi r^2$. Un arco con angolo al centro $\theta$ è la frazione $\frac{\theta}{360^\circ}$ dell'intera circonferenza, quindi

$$\text{arco} = \frac{\theta}{360^\circ} \cdot 2\pi r, \qquad \text{settore} = \frac{\theta}{360^\circ} \cdot \pi r^2.$$

In radianti, $\pi$ rad $= 180^\circ$, e le formule diventano arco $= r\theta$ e settore circolare (*sector*) $= \frac{1}{2}r^2\theta$. Due proprietà degli angoli: un angolo alla circonferenza è metà dell'angolo al centro che insiste sullo stesso arco, e un angolo inscritto in una semicirconferenza è retto.

### Punti e rette nel piano cartesiano

Per i punti $A(x_1, y_1)$ e $B(x_2, y_2)$:

$$AB = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}, \qquad M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right), \qquad m = \frac{y_2 - y_1}{x_2 - x_1}.$$

La retta con coefficiente angolare (*gradient*, o *slope*) $m$ passante per $(x_1, y_1)$ è $y - y_1 = m(x - x_1)$. Dalla forma implicita $ax + by + c = 0$ il coefficiente angolare è $-\frac{a}{b}$. Rette parallele hanno lo stesso coefficiente angolare; rette perpendicolari hanno coefficienti angolari il cui prodotto è $-1$, quindi il coefficiente della perpendicolare è l'**antireciproco**: $\frac{2}{3}$ diventa $-\frac{3}{2}$.

### La circonferenza nel piano cartesiano

La circonferenza di centro $(p, q)$ e raggio $r$ è $(x - p)^2 + (y - q)^2 = r^2$. Quando l'equazione è data in forma sviluppata, come $x^2 + y^2 - 6x + 8y = 0$, completa il quadrato in $x$ e in $y$ per leggere centro e raggio. Una scorciatoia: in $x^2 + y^2 + Dx + Ey + F = 0$ il centro è $\left(-\frac{D}{2}, -\frac{E}{2}\right)$. Se il valore calcolato di $r^2$ è negativo, la circonferenza non esiste.

### Funzioni goniometriche e valori esatti

In un triangolo rettangolo, $\sin\theta = \frac{\text{opposto}}{\text{ipotenusa}}$, $\cos\theta = \frac{\text{adiacente}}{\text{ipotenusa}}$ e $\tan\theta = \frac{\sin\theta}{\cos\theta} = \frac{\text{opposto}}{\text{adiacente}}$. Senza calcolatrice si lavora con angoli i cui valori si ricavano da due triangoli: metà di un triangolo equilatero (lati $1, \sqrt{3}, 2$) e un triangolo rettangolo isoscele (lati $1, 1, \sqrt{2}$).

| Angolo | $\sin$ | $\cos$ | $\tan$ |
| --- | --- | --- | --- |
| $30^\circ = \frac{\pi}{6}$ | $\frac{1}{2}$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{3}}{3}$ |
| $45^\circ = \frac{\pi}{4}$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{2}}{2}$ | $1$ |
| $60^\circ = \frac{\pi}{3}$ | $\frac{\sqrt{3}}{2}$ | $\frac{1}{2}$ | $\sqrt{3}$ |

### La circonferenza goniometrica e i segni

Per qualsiasi angolo, $\cos\theta$ e $\sin\theta$ sono l'ascissa e l'ordinata del punto corrispondente sulla circonferenza goniometrica (*unit circle*) di raggio 1. Da qui seguono l'identità $\sin^2\theta + \cos^2\theta = 1$ e i segni nei quadranti: nel secondo quadrante (da $90^\circ$ a $180^\circ$) il seno è positivo e il coseno negativo, quindi la tangente è negativa; nel terzo sono entrambi negativi; nel quarto è positivo solo il coseno. Usa l'identità per ricavare una funzione dall'altra, poi stabilisci il segno dal quadrante.

Angoli associati: $\sin(180^\circ - \theta) = \sin\theta$ e $\cos(180^\circ - \theta) = -\cos\theta$. Così un'equazione come $\sin x = \frac{1}{2}$ ha due soluzioni tra $0^\circ$ e $360^\circ$: $30^\circ$ e $150^\circ$.

### Triangoli non rettangoli

Con i lati $a, b, c$ opposti agli angoli $A, B, C$:

$$\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}, \qquad c^2 = a^2 + b^2 - 2ab\cos C, \qquad \text{area} = \frac{1}{2}ab\sin C.$$

Usa il teorema del coseno (*cosine rule*, detto anche di Carnot) quando conosci due lati e l'angolo compreso, oppure tutti e tre i lati; usa il teorema dei seni (*sine rule*) quando conosci un lato e l'angolo opposto. Se $C = 90^\circ$ il teorema del coseno diventa quello di Pitagora: un utile controllo di memoria.
`,
  examples: [
    {
      id: 'example-circle-centre-radius',
      title: 'Centro e raggio completando il quadrato',
      problemMd: md`Trova centro e raggio della circonferenza $x^2 + y^2 - 6x + 8y = 0$.`,
      steps: [
        md`Raggruppa i termini in $x$ e quelli in $y$: $(x^2 - 6x) + (y^2 + 8y) = 0$.`,
        md`Completa ciascun quadrato: $x^2 - 6x = (x - 3)^2 - 9$ e $y^2 + 8y = (y + 4)^2 - 16$.`,
        md`Quindi $(x - 3)^2 + (y + 4)^2 = 25$: centro $(3, -4)$ e raggio $5$.`,
        md`Verifica con la scorciatoia: il centro è $\left(-\frac{-6}{2}, -\frac{8}{2}\right) = (3, -4)$. E poiché il termine noto è 0, l'origine sta sulla circonferenza: la sua distanza da $(3, -4)$ è $\sqrt{9 + 16} = 5$, il raggio.`,
      ],
      answerMd: md`Centro $(3, -4)$, raggio $5$. Leggere il centro come $(-3, 4)$, con i segni dei coefficienti, è l'errore più comune.`,
    },
    {
      id: 'example-perpendicular-bisector',
      title: 'L\'asse di un segmento',
      problemMd: md`Trova l'equazione dell'asse (*perpendicular bisector*) del segmento da $A(1, 2)$ a $B(5, 10)$.`,
      steps: [
        md`Punto medio: $M = \left(\frac{1 + 5}{2}, \frac{2 + 10}{2}\right) = (3, 6)$.`,
        md`Coefficiente angolare di $AB$: $\frac{10 - 2}{5 - 1} = 2$, quindi quello della perpendicolare è $-\frac{1}{2}$.`,
        md`Retta per $M$: $y - 6 = -\frac{1}{2}(x - 3)$. Moltiplica per 2: $2y - 12 = -x + 3$, quindi $x + 2y = 15$.`,
        md`Verifica con un punto della retta, per esempio $(15, 0)$: il quadrato della sua distanza da $A$ è $14^2 + 2^2 = 200$ e da $B$ è $10^2 + 10^2 = 200$. Sono uguali, come deve accadere per ogni punto dell'asse.`,
      ],
      answerMd: md`$x + 2y = 15$. Usare il coefficiente $\frac{1}{2}$ (il reciproco senza cambiare segno) dà una retta che non è perpendicolare ad $AB$.`,
    },
    {
      id: 'example-cosine-rule-area',
      title: 'Teorema del coseno e area',
      problemMd: md`Un triangolo ha due lati di 5 e 8 che formano un angolo di $60^\circ$. Trova il terzo lato e l'area.`,
      steps: [
        md`Due lati e l'angolo compreso: usa il teorema del coseno. $c^2 = 25 + 64 - 2 \cdot 5 \cdot 8 \cdot \cos 60^\circ = 89 - 80 \cdot \frac{1}{2} = 49$, quindi $c = 7$.`,
        md`Area: $\frac{1}{2} \cdot 5 \cdot 8 \cdot \sin 60^\circ = 20 \cdot \frac{\sqrt{3}}{2} = 10\sqrt{3}$.`,
        md`Seconda strada per l'area, dai tre lati 5, 8, 7 (formula di Erone): il semiperimetro è $s = 10$, e $\sqrt{s(s - 5)(s - 8)(s - 7)} = \sqrt{10 \cdot 5 \cdot 2 \cdot 3} = \sqrt{300} = 10\sqrt{3}$.`,
      ],
      answerMd: md`Il terzo lato è 7 e l'area è $10\sqrt{3}$. Dimenticare il termine $-2ab\cos C$ dà $\sqrt{89}$, come se il triangolo fosse rettangolo.`,
    },
  ],
  traps: [
    {
      title: 'Ignorare il quadrante',
      md: md`$\sin^2\theta + \cos^2\theta = 1$ dà il valore assoluto dell'altra funzione, mai il suo segno. Se $\theta$ è ottuso, coseno e tangente sono negativi. Stabilisci il quadrante prima di scegliere tra $\frac{4}{5}$ e $-\frac{4}{5}$.`,
    },
    {
      title: 'Coefficiente della perpendicolare: solo metà della regola',
      md: md`Il coefficiente angolare della perpendicolare è l'antireciproco. Cambiare solo il segno ($\frac{2}{3} \to -\frac{2}{3}$) o prendere solo il reciproco ($\frac{2}{3} \to \frac{3}{2}$) dà una retta che passa comunque per il punto giusto, ed è per questo che queste opzioni sembrano convincenti. Controlla che il prodotto dei due coefficienti sia $-1$.`,
    },
    {
      title: 'Leggere il centro con i segni sbagliati',
      md: md`In $(x - 3)^2 + (y + 4)^2 = 25$ il centro è $(3, -4)$ e il raggio è 5, non 25. Leggi il centro come i valori che annullano ciascuna parentesi.`,
    },
    {
      title: 'Confondere gradi e radianti',
      md: md`Arco $= r\theta$ e settore $= \frac{1}{2}r^2\theta$ valgono solo con $\theta$ in radianti. Con i gradi, usa la frazione $\frac{\theta}{360^\circ}$ dell'intero cerchio.`,
    },
  ],
  check: [
    {
      id: 'check-obtuse-tangent',
      title: 'La tangente di un angolo ottuso',
      topic: 'Geometria e trigonometria',
      stemMd: md`Un angolo $\theta$ soddisfa $90^\circ < \theta < 180^\circ$ e $\sin\theta = \frac{3}{5}$. Quanto vale $\tan\theta$?`,
      options: [
        { id: 'A', text: md`$-\frac{4}{3}$`, note: md`È $\frac{\cos\theta}{\sin\theta}$, il reciproco della tangente; la tangente è seno diviso coseno.` },
        { id: 'B', text: md`$-\frac{4}{5}$`, note: md`È $\cos\theta$, trovato correttamente, ma la domanda chiede la tangente.` },
        { id: 'C', text: md`$-\frac{3}{4}$`, note: '' },
        { id: 'D', text: md`$\frac{3}{4}$`, note: md`Il valore assoluto è giusto, ma nel secondo quadrante il coseno è negativo, quindi la tangente è negativa.` },
        { id: 'E', text: md`$\frac{4}{5}$`, note: md`È il valore assoluto del coseno con il quadrante ignorato, e comunque non è la tangente.` },
      ],
      answer: 'C',
      workingMd: md`$\cos^2\theta = 1 - \frac{9}{25} = \frac{16}{25}$, quindi $\cos\theta = \pm\frac{4}{5}$; nel secondo quadrante vale $-\frac{4}{5}$. Allora $\tan\theta = \frac{3/5}{-4/5} = -\frac{3}{4}$. Seconda strada: un triangolo 3-4-5 dà $\tan = \frac{3}{4}$ per l'angolo acuto $180^\circ - \theta$, e nel secondo quadrante la tangente è negativa.`,
      lesson: 'Ricava il valore assoluto di una funzione goniometrica dall\'identità o da un triangolo, poi stabilisci il segno dal quadrante.',
    },
    {
      id: 'check-perpendicular-line',
      title: 'Una retta perpendicolare per un punto',
      topic: 'Geometria e trigonometria',
      stemMd: md`Quale retta passa per $(2, 1)$ ed è perpendicolare a $2x - 3y + 6 = 0$?`,
      options: [
        { id: 'A', text: md`$2x - 3y - 1 = 0$`, note: md`Passa per $(2, 1)$ ma ha lo stesso coefficiente angolare $\frac{2}{3}$: è parallela, non perpendicolare.` },
        { id: 'B', text: md`$3x - 2y - 4 = 0$`, note: md`Il suo coefficiente $\frac{3}{2}$ è il reciproco senza cambio di segno; il prodotto dei coefficienti è 1, non $-1$.` },
        { id: 'C', text: md`$2x + 3y - 7 = 0$`, note: md`Il suo coefficiente $-\frac{2}{3}$ cambia il segno ma non è il reciproco; il prodotto dei coefficienti è $-\frac{4}{9}$.` },
        { id: 'D', text: md`$3x + 2y - 8 = 0$`, note: '' },
        { id: 'E', text: md`$3x + 2y + 8 = 0$`, note: md`Il coefficiente è giusto, ma $(2, 1)$ dà $6 + 2 + 8 = 16 \ne 0$: un errore di segno nel termine noto.` },
      ],
      answer: 'D',
      workingMd: md`La retta data ha coefficiente angolare $-\frac{2}{-3} = \frac{2}{3}$, quindi la perpendicolare ha coefficiente $-\frac{3}{2}$. Per $(2, 1)$: $y - 1 = -\frac{3}{2}(x - 2)$; moltiplica per 2: $2y - 2 = -3x + 6$, quindi $3x + 2y - 8 = 0$. Verifica: $6 + 2 - 8 = 0$, e il prodotto dei coefficienti è $\frac{2}{3} \cdot \left(-\frac{3}{2}\right) = -1$.`,
      lesson: 'Quando più rette passano per il punto dato, decide il coefficiente angolare: perpendicolare significa prodotto uguale a $-1$.',
    },
    {
      id: 'check-sector-area',
      title: 'L\'area di un settore circolare',
      topic: 'Geometria e trigonometria',
      stemMd: md`Un cerchio ha raggio 6 cm. Qual è l'area di un settore il cui angolo al centro è $120^\circ$?`,
      options: [
        { id: 'A', text: md`$4\pi \text{ cm}^2$`, note: md`$4\pi$ cm è la lunghezza dell'arco, $\frac{1}{3} \cdot 2\pi \cdot 6$, non l'area del settore.` },
        { id: 'B', text: md`$12\pi \text{ cm}^2$`, note: '' },
        { id: 'C', text: md`$24\pi \text{ cm}^2$`, note: md`Prende $\frac{120}{180}$ del cerchio invece di $\frac{120}{360}$, confondendo l'angolo giro con $\pi$ radianti.` },
        { id: 'D', text: md`$36\pi \text{ cm}^2$`, note: md`È l'area dell'intero cerchio: non è stata applicata la frazione $\frac{120}{360}$.` },
        { id: 'E', text: md`$48\pi \text{ cm}^2$`, note: md`Usa il diametro 12 come raggio: $\frac{1}{3} \cdot \pi \cdot 144$.` },
      ],
      answer: 'B',
      workingMd: md`$120^\circ$ è $\frac{1}{3}$ dell'angolo giro, quindi il settore è $\frac{1}{3} \cdot \pi \cdot 6^2 = 12\pi$ cm². In radianti: $120^\circ = \frac{2\pi}{3}$, e $\frac{1}{2} r^2 \theta = \frac{1}{2} \cdot 36 \cdot \frac{2\pi}{3} = 12\pi$ cm².`,
      lesson: 'Un settore è la frazione del cerchio data dal suo angolo su 360 gradi; controlla se la domanda chiede l\'arco o l\'area.',
    },
  ],
  takeaways: [
    'Impara le terne pitagoriche e i valori esatti per 30, 45 e 60 gradi: sostituiscono la calcolatrice.',
    'I coefficienti angolari di rette perpendicolari hanno prodotto −1: prendi l\'antireciproco.',
    'Completa il quadrato per leggere centro e raggio di una circonferenza; il centro ha i segni opposti a quelli nelle parentesi.',
    'L\'identità sin² + cos² = 1 dà il valore assoluto di una funzione; il quadrante ne dà il segno.',
    'Usa il teorema del coseno con due lati e l\'angolo compreso, il teorema dei seni con un lato e l\'angolo opposto.',
  ],
  flashcards: [
    { front: 'Lunghezza dell\'arco e area del settore con l\'angolo in gradi', back: md`Arco $= \frac{\theta}{360^\circ} \cdot 2\pi r$ e settore $= \frac{\theta}{360^\circ} \cdot \pi r^2$. In radianti: $r\theta$ e $\frac{1}{2}r^2\theta$.` },
    { front: 'Coefficiente angolare della perpendicolare a una retta di coefficiente m', back: md`$-\frac{1}{m}$, l'antireciproco: i due coefficienti hanno prodotto $-1$.` },
    { front: md`Centro di $x^2 + y^2 + Dx + Ey + F = 0$`, back: md`$\left(-\frac{D}{2}, -\frac{E}{2}\right)$; completa il quadrato per trovare il raggio.` },
    { front: md`$\sin$, $\cos$, $\tan$ di $30^\circ$, $45^\circ$ e $60^\circ$`, back: md`$30^\circ$: $\frac{1}{2}, \frac{\sqrt{3}}{2}, \frac{\sqrt{3}}{3}$. $45^\circ$: $\frac{\sqrt{2}}{2}, \frac{\sqrt{2}}{2}, 1$. $60^\circ$: $\frac{\sqrt{3}}{2}, \frac{1}{2}, \sqrt{3}$.` },
    { front: 'Segni di seno e coseno nel secondo quadrante', back: 'Seno positivo, coseno negativo, quindi tangente negativa.' },
    { front: 'Il teorema del coseno', back: md`$c^2 = a^2 + b^2 - 2ab\cos C$, con $C$ l'angolo compreso tra i lati $a$ e $b$.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-math-geometry-trig' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const probabilityAndStatisticsLessonIt: Lesson = {
  slug: 'probability-and-statistics',
  title: 'Probabilità e statistica',
  summary: 'Conta i casi, combina le probabilità con le regole di somma, prodotto ed evento contrario, e calcola a mano medie, mediane e medie ponderate.',
  minutes: 22,
  objectives: [
    'Calcolare probabilità contando casi equiprobabili, e combinarle con le regole della somma, del prodotto e dell\'evento contrario.',
    'Gestire estrazioni senza reimmissione e probabilità condizionate, usando le combinazioni quando fanno risparmiare lavoro.',
    'Calcolare e confrontare media, mediana, moda, campo di variazione e media ponderata di un insieme di dati.',
  ],
  teachMd: md`
### La probabilità come conteggio

Quando tutti i casi sono equiprobabili,

$$P(\text{evento}) = \frac{\text{numero di casi favorevoli}}{\text{numero di casi possibili}}.$$

Il lavoro sta nel contare bene entrambi. Con due dadi ci sono $6 \times 6 = 36$ esiti ordinati, e $(2, 6)$ e $(6, 2)$ sono esiti diversi. Elencare uno spazio campionario piccolo in una tabella è spesso più rapido e più sicuro di qualsiasi formula. Ogni probabilità è compresa tra 0 e 1: un risultato fuori da questo intervallo segnala un errore.

### Strumenti per contare

- **Principio moltiplicativo**: se una scelta si può fare in $m$ modi e una seconda in $n$ modi, la coppia di scelte si può fare in $mn$ modi.
- **Permutazioni**: $n$ oggetti distinti si possono ordinare in $n! = n(n - 1) \cdots 1$ modi.
- **Combinazioni**: il numero di modi di scegliere $k$ oggetti tra $n$ quando l'ordine non conta è $\binom{n}{k} = \frac{n!}{k!(n - k)!}$. Per esempio $\binom{10}{2} = \frac{10 \cdot 9}{2} = 45$.

Chiediti se l'ordine conta. Scegliere una commissione di due persone non dipende dall'ordine; scegliere un presidente e un segretario sì.

### Le tre regole

**Evento contrario.** $P(\text{non } A) = 1 - P(A)$. Le domande con "almeno uno" (*at least one*) si risolvono di solito più in fretta passando dal contrario, "nessuno": $P(\text{almeno uno}) = 1 - P(\text{nessuno})$.

**Somma.** $P(A \text{ oppure } B) = P(A) + P(B) - P(A \text{ e } B)$. La sottrazione elimina la parte comune contata due volte. Quando $A$ e $B$ non possono verificarsi insieme (eventi incompatibili, *mutually exclusive*), la parte comune è zero e le probabilità si sommano e basta.

**Prodotto.** $P(A \text{ e } B) = P(A) \cdot P(B \mid A)$, dove $P(B \mid A)$ è la probabilità di $B$ sapendo che $A$ si è verificato. Se $A$ e $B$ sono **indipendenti** (*independent*), $P(B \mid A) = P(B)$ e le probabilità si moltiplicano e basta. Due lanci di dado distinti sono indipendenti; due carte estratte senza reimmissione no.

### Senza reimmissione

Quando si estraggono oggetti uno dopo l'altro senza rimetterli (*without replacement*), a ogni estrazione diminuiscono di uno sia il totale sia il numero di oggetti del tipo appena estratto. Per due palline rosse da un'urna con 4 rosse e 6 blu: $\frac{4}{10} \cdot \frac{3}{9}$. Lo stesso risultato si ottiene con le combinazioni: $\frac{\binom{4}{2}}{\binom{10}{2}} = \frac{6}{45}$. Usare due strade è un buon controllo.

### Probabilità condizionata

$$P(A \mid B) = \frac{P(A \text{ e } B)}{P(B)}.$$

In termini di conteggio: limita l'attenzione ai casi in cui si verifica $B$, e chiediti quale frazione di essi sta anche in $A$. Con una tabella a doppia entrata o un diagramma di Venn, la probabilità condizionata (*conditional probability*) $P(A \mid B)$ è la parte comune divisa per **tutto $B$**, non per l'intera popolazione. Nota che $P(A \mid B)$ e $P(B \mid A)$ hanno lo stesso numeratore ma denominatori diversi, quindi di solito sono diverse.

### Le medie

- **Media** (*mean*): somma dei valori divisa per il loro numero. Quindi $\text{somma} = \text{media} \times \text{numero dei valori}$, che è la chiave di quasi tutte le domande in cui un valore viene aggiunto o tolto.
- **Mediana** (*median*): il valore centrale dei dati **ordinati**. Con un numero pari di valori è la media dei due centrali.
- **Moda** (*mode*): il valore più frequente. **Campo di variazione** (*range*): massimo meno minimo.

Una **media ponderata** (*weighted mean*) combina gruppi di dimensioni diverse: se $n_1$ valori hanno media $\bar{x}_1$ e $n_2$ valori hanno media $\bar{x}_2$, la media complessiva è

$$\frac{n_1\bar{x}_1 + n_2\bar{x}_2}{n_1 + n_2}.$$

È compresa tra le due medie dei gruppi, più vicina a quella del gruppo più numeroso. Fare la media delle due medie è corretto solo quando i gruppi hanno la stessa dimensione.

### Come cambiano gli indici

Aggiungere la stessa costante a ogni valore la aggiunge a media, mediana e moda, e lascia invariati il campo di variazione e la deviazione standard (*standard deviation*). Moltiplicare ogni valore per una costante moltiplica per essa media, mediana e moda, e moltiplica il campo di variazione e la deviazione standard per il suo valore assoluto (un fattore $-2$ raddoppia la dispersione). La deviazione standard misura quanto i valori sono dispersi attorno alla media: dati tutti uguali hanno deviazione standard 0. Un valore estremo sposta la media molto più della mediana, ed è per questo che la mediana descrive meglio i dati asimmetrici.

### Prima di scegliere

Controlla che una probabilità sia compresa tra 0 e 1, che una media stia tra il valore minimo e il massimo, e che una mediana venga da dati ordinati. Ognuno di questi controlli richiede pochi secondi e può eliminare un distrattore.
`,
  examples: [
    {
      id: 'example-two-dice',
      title: 'Una somma con due dadi',
      problemMd: md`Si lanciano due dadi equilibrati a sei facce. Qual è la probabilità che la somma dei punteggi sia 8?`,
      steps: [
        md`Lo spazio campionario ha $6 \times 6 = 36$ esiti ordinati equiprobabili.`,
        md`Elenca quelli favorevoli: $(2, 6), (3, 5), (4, 4), (5, 3), (6, 2)$, cioè 5 esiti.`,
        md`Seconda strada: per avere somma 8 il primo dado deve mostrare da 2 a 6 (con 1 servirebbe un 7), e ciascuno di questi cinque valori ha esattamente un compagno. Di nuovo 5.`,
      ],
      answerMd: md`$P = \frac{5}{36}$. Contare le coppie non ordinate ($\{2, 6\}, \{3, 5\}, \{4, 4\}$) e dividere per 36 dà $\frac{3}{36}$, che mescola casi favorevoli non ordinati con uno spazio campionario ordinato.`,
    },
    {
      id: 'example-same-colour',
      title: 'Due palline dello stesso colore',
      problemMd: md`Un'urna contiene 4 palline rosse e 6 blu. Se ne estraggono due senza reimmissione. Qual è la probabilità che siano dello stesso colore?`,
      steps: [
        md`"Stesso colore" significa entrambe rosse oppure entrambe blu; i due eventi sono incompatibili, quindi si sommano le probabilità.`,
        md`Entrambe rosse: $\frac{4}{10} \cdot \frac{3}{9} = \frac{12}{90}$. Entrambe blu: $\frac{6}{10} \cdot \frac{5}{9} = \frac{30}{90}$.`,
        md`Somma: $\frac{42}{90} = \frac{7}{15}$.`,
        md`Seconda strada con le combinazioni: $\frac{\binom{4}{2} + \binom{6}{2}}{\binom{10}{2}} = \frac{6 + 15}{45} = \frac{21}{45} = \frac{7}{15}$.`,
      ],
      answerMd: md`$\frac{7}{15}$. Trattare le estrazioni come se la pallina venisse rimessa nell'urna dà $\left(\frac{4}{10}\right)^2 + \left(\frac{6}{10}\right)^2 = \frac{52}{100}$, che qui è sbagliato.`,
    },
    {
      id: 'example-weighted-mean',
      title: 'Unire due gruppi',
      problemMd: md`In una classe 20 studenti hanno un voto medio di 15; in un'altra, 30 studenti hanno un voto medio di 20. Qual è il voto medio di tutti i 50 studenti?`,
      steps: [
        md`Trasforma ogni media in un totale: $20 \cdot 15 = 300$ e $30 \cdot 20 = 600$.`,
        md`Media complessiva: $\frac{300 + 600}{50} = \frac{900}{50} = 18$.`,
        md`Seconda strada: misura a partire da 15. La prima classe non aggiunge nulla; la seconda aggiunge $30 \cdot 5 = 150$ sopra 15. Distribuito su 50 studenti fa $3$, quindi la media è $15 + 3 = 18$.`,
      ],
      answerMd: md`La media è 18. Fare la media delle due medie, $\frac{15 + 20}{2} = 17{,}5$, ignora che la seconda classe è più numerosa.`,
    },
  ],
  traps: [
    {
      title: 'Sommare le probabilità per "almeno uno"',
      md: md`La probabilità di almeno un sei in tre lanci non è $3 \cdot \frac{1}{6} = \frac{1}{2}$: così si contano più volte gli esiti con due o tre sei, e con sei lanci lo stesso metodo darebbe 1, cioè la certezza. Usa $1 - P(\text{nessuno})$.`,
    },
    {
      title: 'Il denominatore sbagliato in una probabilità condizionata',
      md: md`$P(A \mid B)$ divide la parte comune per la dimensione di $B$, la condizione, non per l'intero gruppo e non per la dimensione di $A$. Leggi la frase "sapendo che" e mettila al denominatore.`,
    },
    {
      title: 'Calcolare la mediana su dati non ordinati',
      md: md`La mediana è il centro della lista **ordinata**. Con un numero pari di valori fai la media dei due centrali; sceglierne uno solo, o la coppia sbagliata, porta a un distrattore.`,
    },
    {
      title: 'Fare la media delle medie',
      md: md`La media di due medie di gruppo coincide con la media complessiva solo quando i gruppi hanno la stessa dimensione. Altrimenti trasforma ogni media in un totale, somma e dividi per il numero totale.`,
    },
  ],
  check: [
    {
      id: 'check-at-least-one-six',
      title: 'Almeno un sei',
      topic: 'Probabilità e statistica',
      stemMd: md`Si lancia tre volte un dado equilibrato a sei facce. Qual è la probabilità di ottenere almeno un sei?`,
      options: [
        { id: 'A', text: md`$\frac{1}{216}$`, note: md`È la probabilità che tutti e tre i lanci diano sei, non che almeno uno lo dia.` },
        { id: 'B', text: md`$\frac{75}{216}$`, note: md`È la probabilità di esattamente un sei, $3 \cdot \frac{1}{6} \cdot \frac{25}{36}$; esclude i casi con due e tre sei.` },
        { id: 'C', text: md`$\frac{91}{216}$`, note: '' },
        { id: 'D', text: md`$\frac{1}{2}$`, note: md`Somma tre volte $\frac{1}{6}$, contando più volte gli esiti con più di un sei.` },
        { id: 'E', text: md`$\frac{125}{216}$`, note: md`È la probabilità di **nessun** sei: l'evento contrario è stato calcolato ma non sottratto da 1.` },
      ],
      answer: 'C',
      workingMd: md`$P(\text{nessun sei}) = \left(\frac{5}{6}\right)^3 = \frac{125}{216}$, quindi $P(\text{almeno uno}) = 1 - \frac{125}{216} = \frac{91}{216}$. Seconda strada: esattamente un sei $\frac{75}{216}$, esattamente due $3 \cdot \frac{1}{36} \cdot \frac{5}{6} = \frac{15}{216}$, esattamente tre $\frac{1}{216}$; totale $\frac{91}{216}$.`,
      lesson: 'Per "almeno uno", sottrai da 1 la probabilità di "nessuno".',
    },
    {
      id: 'check-median-missing-value',
      title: 'Un valore mancante, poi la mediana',
      topic: 'Probabilità e statistica',
      stemMd: md`I sei valori $2, 4, 4, 5, 9, x$ hanno media 5. Qual è la loro mediana?`,
      options: [
        { id: 'A', text: md`$4$`, note: md`4 è la moda; la mediana di sei valori è la media del terzo e del quarto valore ordinati, 4 e 5.` },
        { id: 'B', text: md`$4{,}5$`, note: '' },
        { id: 'C', text: md`$5$`, note: md`5 è la media data nel testo, non la mediana.` },
        { id: 'D', text: md`$5{,}5$`, note: md`Fa la media del quarto e del quinto valore ordinati, 5 e 6; con sei valori la coppia centrale è il terzo e il quarto.` },
        { id: 'E', text: md`$7$`, note: md`7 è il campo di variazione, $9 - 2$, non un indice di posizione centrale.` },
      ],
      answer: 'B',
      workingMd: md`La somma deve essere $6 \cdot 5 = 30$; i valori noti sommano 24, quindi $x = 6$. Ordinati: $2, 4, 4, 5, 6, 9$. La coppia centrale è 4 e 5, quindi la mediana è $4{,}5$. Verifica della media: $\frac{30}{6} = 5$.`,
      lesson: 'Usa somma = media × numero dei valori per trovare un valore mancante, poi ordina i dati prima di prendere la mediana.',
    },
    {
      id: 'check-conditional-students',
      title: 'Sapendo che lo studente studia chimica',
      topic: 'Probabilità e statistica',
      stemMd: md`In un gruppo di 40 studenti, 25 studiano biologia, 18 studiano chimica e 8 le studiano entrambe. Uno studente scelto a caso studia chimica. Qual è la probabilità che studi anche biologia?`,
      options: [
        { id: 'A', text: md`$\frac{1}{5}$`, note: md`È $\frac{8}{40}$, la probabilità di studiare entrambe, divisa per l'intero gruppo invece che per gli studenti di chimica.` },
        { id: 'B', text: md`$\frac{8}{25}$`, note: md`È la probabilità di chimica sapendo biologia; qui la condizione è chimica, quindi si divide per 18.` },
        { id: 'C', text: md`$\frac{4}{9}$`, note: '' },
        { id: 'D', text: md`$\frac{5}{8}$`, note: md`È $\frac{25}{40}$, la probabilità di biologia per uno studente qualsiasi: l'informazione che studia chimica è stata ignorata.` },
        { id: 'E', text: md`$\frac{7}{8}$`, note: md`È $\frac{35}{40}$, la probabilità di studiare biologia oppure chimica, non una probabilità condizionata.` },
      ],
      answer: 'C',
      workingMd: md`Limitati ai 18 studenti di chimica; 8 di loro studiano biologia. $P = \frac{8}{18} = \frac{4}{9}$. Con la formula: $\frac{P(\text{entrambe})}{P(\text{chimica})} = \frac{8/40}{18/40} = \frac{8}{18} = \frac{4}{9}$.`,
      lesson: 'In una probabilità condizionata il gruppo dato come condizione va al denominatore.',
    },
  ],
  takeaways: [
    'Conta con cura i casi equiprobabili; con due dadi gli esiti ordinati sono 36.',
    'Per "almeno uno", usa 1 meno la probabilità di "nessuno".',
    'Senza reimmissione, dopo ogni estrazione diminuiscono sia il totale sia il numero di oggetti del tipo estratto.',
    md`$P(A \mid B)$ è la parte comune divisa per la dimensione di $B$.`,
    'Trasforma le medie in totali per unire gruppi o trovare un valore mancante; ordina i dati prima di cercare la mediana.',
  ],
  flashcards: [
    { front: 'Probabilità con casi equiprobabili', back: 'Casi favorevoli diviso casi possibili; il risultato è sempre compreso tra 0 e 1.' },
    { front: 'Probabilità di "almeno uno"', back: md`$1 - P(\text{nessuno})$.` },
    { front: 'Regola della somma per "A oppure B"', back: md`$P(A \text{ oppure } B) = P(A) + P(B) - P(A \text{ e } B)$; l'ultimo termine è zero per eventi incompatibili.` },
    { front: 'Probabilità condizionata', back: md`$P(A \mid B) = \frac{P(A \text{ e } B)}{P(B)}$: la parte comune come frazione di $B$.` },
    { front: 'Modi di scegliere k oggetti tra n, senza contare l\'ordine', back: md`$\binom{n}{k} = \frac{n!}{k!(n - k)!}$; per esempio $\binom{10}{2} = 45$.` },
    { front: 'Media ponderata di due gruppi', back: md`$\frac{n_1\bar{x}_1 + n_2\bar{x}_2}{n_1 + n_2}$: trasforma ogni media in un totale, somma e dividi per il numero totale.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-math-probability-statistics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};
