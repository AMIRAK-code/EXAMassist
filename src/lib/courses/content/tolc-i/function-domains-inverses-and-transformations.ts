import { md, type Lesson } from '../../types';

export const functionDomainsInversesAndTransformationsLesson: Lesson = {
  slug: 'function-domains-inverses-and-transformations',
  title: "Function domains, inverses and graph transformations",
  summary: "Track allowed inputs through a composition, decide when a function can be reversed and follow points through shifts and reflections.",
  minutes: 20,
  objectives: [
    "Determine the domain and range of an elementary function.",
    "Check whether an inverse exists on a given domain.",
    "Distinguish changes to a function's input from changes to its output.",
  ],
  teachMd: md`
### Follow a number through a rule

Think of a function (*funzione*) as a rule with a specified set of allowed inputs, its domain (*dominio*). Each allowed input produces exactly one output. Different inputs may share an output. The range (*immagine*) consists of the outputs that actually occur. For example, squaring every real number produces every nonnegative real number and never produces a negative one. Restrict the inputs to numbers between two and three, and the same formula now has outputs between four and nine, including the endpoints if the input interval includes them.

When finding a natural real domain, read an expression from the innermost operation outwards. The argument of a square root must be nonnegative. A denominator must differ from zero. These conditions combine if a square root appears below a fraction bar, since the root must exist and also have a nonzero value. Cancellation may give a shorter expression with the same values on its original domain, but the simplified formula alone can conceal an excluded input. Write restrictions beside the formula before simplifying it.

### Compose and reverse

In a composition (*composizione*) the output of the inner rule becomes the input to the outer one. For $f(g(x))$ you need permission to use $x$ in $g$ and permission to use $g(x)$ in $f$. Suppose the inner operation subtracts five and the outer operation takes a square root. You can start with seven because the intermediate value is two. Starting with four fails at the second operation. Reversing the operations puts the initial restriction on the original input instead and gives a different final result.

An inverse function (*funzione inversa*) retraces the journey from an output to its unique input. You can draw a horizontal line at the proposed output value to count the inputs that produced it. If it crosses at two points, reversing the rule on that domain would give two answers for a single input. Restricting the domain to an increasing or decreasing branch can fix the problem. For the square function restricted to nonnegative inputs the inverse takes the positive square root or zero. Restrict it to nonpositive inputs instead and the inverse takes the negative of that root. Its domain in either case is the original range.

### Move an individual point

Suppose the original graph contains the point $(a,b)$. This records $f(a)=b$. In $y=f(x-h)+k$ the inner expression must equal $a$ to recover the same old output. Solve $x-h=a$ to find the new horizontal coordinate $a+h$, then add $k$ to the output. The point moves to $(a+h,b+k)$. This argument works for an endpoint or a peak just as well as for an ordinary point. Following one recognisable point is often easier than redrawing a complete graph.

Absolute values give two different reflections depending on their position. With $y=|f(x)|$, every input stays put. A negative height becomes positive and the part already above the horizontal axis stays in place. With $y=f(|x|)$ both positive and negative inputs ask for the old output at a nonnegative coordinate. Keep the original right-hand portion and reflect it across the vertical axis. Where the right-hand input was unavailable there will be no corresponding point on either side.

### Test symmetry on the actual domain

An even function (*pari*) satisfies $f(-x)=f(x)$ and reflects into itself across the vertical axis. An odd function (*dispari*) satisfies $f(-x)=-f(x)$ and its graph survives a half-turn about the origin. Both definitions require the domain to contain opposite pairs of inputs. A square restricted to positive inputs therefore lacks the full symmetry of the ordinary square function on the real line. One mismatching pair disproves a claimed symmetry. Matching values at just one pair are a clue for a sketch, but a proof must cover every input in the domain.
`,
  examples: [
    {
      id: 'domain-chain',
      title: "Two restrictions at once",
      problemMd: md`Find the real domain of $u(x)=1/\sqrt{7-2x}$.`,
      steps: [
        md`The root exists for $7-2x\ge0$. It sits in the denominator, so equality must be excluded.`,
        md`Solve $7-2x>0$ by moving $2x$ to the right and dividing by 2.`,
      ],
      answerMd: md`The domain is $x<7/2$. The endpoint would make the denominator zero.`,
    },
    {
      id: 'reverse-branch',
      title: "Choosing an inverse branch",
      problemMd: md`Find the inverse of $f(x)=(x-1)^2$ on $x\le1$.`,
      steps: [
        md`Write $y=(x-1)^2$. Here $x-1$ is nonpositive, so $x-1=-\sqrt y$.`,
        md`Solve for $x$ and exchange the variable names. The output of the original square ranges over all nonnegative numbers.`,
      ],
      answerMd: md`The inverse is $f^{-1}(x)=1-\sqrt x$ on $x\ge0$.`,
    },
  ],
  traps: [
    { title: "Inverting an unrestricted square", md: "A positive output of the square has two possible preimages on the whole real line. Check the specified input branch before choosing a root." },
    { title: "Moving a graph by reading an inner sign directly", md: "Set the new inner expression equal to a known old input. This equation determines the new location of the point." },
  ],
  check: [
    {
      id: 'composed-value',
      title: "Order of operations",
      topic: "Analytic geometry and functions",
      stemMd: md`Let $f(t)=t^2+1$ and $g(t)=3t$. Find $g(f(2))$.`,
      options: [
        { id: 'A', text: "37", note: "This evaluates the composition in reverse order." },
        { id: 'B', text: "15", note: "" },
        { id: 'C', text: "13", note: "This triples the square before adding one." },
        { id: 'D', text: "5", note: "This stops at the intermediate output." },
        { id: 'E', text: "36", note: "This squares the tripled input and omits the added one." },
      ],
      answer: 'B',
      workingMd: md`The inner rule gives $f(2)=5$. Feeding 5 to $g$ gives 15.`,
      lesson: "Evaluate the innermost rule first.",
    },
    {
      id: 'transformed-point',
      title: "Tracking a peak",
      topic: "Analytic geometry and functions",
      stemMd: md`A function has its unique maximum at $(2,7)$. Where is the maximum of $y=f(x+4)-3$?`,
      options: [
        { id: 'A', text: "(6, 4)", note: "This shifts right for an addition inside the input." },
        { id: 'B', text: "(−2, 10)", note: "This reverses the output shift." },
        { id: 'C', text: "(6, 10)", note: "This reverses both shifts." },
        { id: 'D', text: "(−2, 4)", note: "" },
        { id: 'E', text: "(2, 4)", note: "This ignores the horizontal shift." },
      ],
      answer: 'D',
      workingMd: md`Set $x+4=2$, giving $x=-2$. The new height is $7-3=4$.`,
      lesson: "Track one marked point using the equation for its old input.",
    },
    {
      id: 'reflected-input',
      title: "Which old point supplies the height?",
      topic: "Analytic geometry and functions",
      stemMd: md`A function has $f(-3)=-2$ and $f(3)=5$. What is $f(|-3|)$?`,
      options: [
        { id: 'A', text: "−2", note: "This uses the original negative input." },
        { id: 'B', text: "2", note: "This takes the absolute value of the old negative output." },
        { id: 'C', text: "3", note: "This stops after evaluating the inner absolute value." },
        { id: 'D', text: "−5", note: "This negates the positive-input output without a rule to do so." },
        { id: 'E', text: "5", note: "" },
      ],
      answer: 'E',
      workingMd: md`The inner value is $|-3|=3$. The supplied height at 3 is 5.`,
      lesson: "An absolute value inside the brackets acts on the input.",
    },
  ],
  takeaways: [
    "A composition must permit every intermediate value.",
    "Reverse a one-to-one branch and give the inverse its domain.",
    "Track the coordinates of a known point through each operation.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-mathematics', skill: 'tolci-math-analytic-functions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
