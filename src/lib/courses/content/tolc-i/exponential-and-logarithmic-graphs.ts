import { md, type Lesson } from '../../types';

export const exponentialAndLogarithmicGraphsLesson: Lesson = {
  slug: 'exponential-and-logarithmic-graphs',
  title: "Exponential and logarithmic graphs",
  summary: "Sketch inverse graphs from exact points, use logarithm laws with their domains and compare logarithms in increasing or decreasing bases.",
  minutes: 20,
  objectives: [
    "Sketch an exponential and its inverse from exact points.",
    "Combine logarithms and change base.",
    "Use the base to compare logarithmic values.",
  ],
  teachMd: md`
### Build a graph by multiplying

Start with a single unit and double it at each whole step. After one step you have two, after two steps four and after three steps eight. Walking a step backwards requires division by two. This gives one half at negative one and one quarter at negative two. These coordinates belong to the exponential function (*funzione esponenziale*) $y=2^x$. At half a step the factor must square to two when you take the same half step again, which explains the appearance of a square root for a fractional exponent.

With any positive base $a$ other than one, the graph passes through $(0,1)$ and $(1,a)$. A positive base makes all real powers positive. When the base exceeds one each unit step multiplies the height by something greater than one, and the curve increases. For a base between zero and one the same step multiplies the height by a proper fraction. The curve then decreases. In the direction in which the heights shrink they approach zero without reaching it at any finite input. The horizontal axis is an asymptote.

### Reverse the question

A logarithm (*logaritmo*) asks for the exponent. The statement $\log_a b=c$ says precisely that $a^c=b$. It requires a positive argument and a positive base different from one. Base one would always give one as its output, so there would be no unique exponent to recover. The value of a logarithm can be negative because a negative exponent still gives a positive power. Separating the sign of the argument from the sign of the answer prevents a common domain error.

Interchanging a point's two coordinates reflects it in the line $y=x$. Every exact point on an exponential graph gives a point on the corresponding logarithmic graph this way. The point $(0,1)$ becomes $(1,0)$, and the horizontal asymptote becomes the vertical line $x=0$. The domain of a logarithm is the positive real numbers while its range includes all real values. Reflection preserves the increasing or decreasing character. With a base of one half the smaller of two positive arguments therefore has the larger logarithm.

### Translate powers into logarithm laws

Take two positive numbers $u$ and $v$ and write them as powers of the same base. Multiplying the numbers adds their exponents. Consequently $\log_a(uv)=\log_a u+\log_a v$. Dividing subtracts the exponents, and raising a positive argument to a power multiplies its logarithm by that power. Each rule follows an operation on powers. Addition of arguments has no matching product rule. Testing a proposed identity with two inputs equal to one often exposes this error immediately.

Keep the original domain when combining expressions. Two separate logarithms in a sum each require a positive argument. Their product can also be positive when both factors are negative, so a combined logarithm considered on its own may allow more inputs than the original sum. When expanding a logarithm of a square, the correct real expression for a nonzero input is $\log_a(x^2)=2\log_a|x|$. The absolute value allows both signs that the square already permitted.

### Compare without estimating decimals

Try bracketing an argument by adjacent integer powers. Since nine is between eight and sixteen, its base-two logarithm lies strictly between three and four. For a decreasing exponential, put the corresponding exponents in reverse order when reading the interval. If two logarithms have different bases, the change-of-base formula $\log_a b=\log_c b/\log_c a$ can express them through one familiar base. To justify it, write $a^x=b$ and take the base-$c$ logarithm of both sides. The unknown exponent multiplies the logarithm of $a$, so division isolates it. A useful choice for the new base makes at least one of those two logarithms an integer.
`,
  examples: [
    {
      id: 'inverse-coordinate',
      title: "Reflecting an exact point",
      problemMd: md`Find the point of $y=\log_{1/3}x$ with height $-2$.`,
      steps: [
        md`Undo the logarithm to get $x=(1/3)^{-2}=9$.`,
        md`On the exponential graph the point is $(-2,9)$. Reflection exchanges the input and output.`,
      ],
      answerMd: md`The logarithmic point is $(9,-2)$.`,
    },
    {
      id: 'common-base',
      title: "A quotient of logarithms",
      problemMd: md`Evaluate $\dfrac{\log_2 27}{\log_2 9}$ exactly.`,
      steps: [
        md`By change of base the quotient equals $\log_9 27$.`,
        md`Write $9=3^2$ and $27=3^3$. The required exponent satisfies $2x=3$.`,
      ],
      answerMd: md`The quotient is $3/2$. Subtracting the two logarithms would describe a different operation.`,
    },
  ],
  traps: [
    { title: "Splitting a sum of arguments", md: "Check the operation inside the logarithm. Products split into sums, while a sum of two arguments generally must stay together." },
    { title: "Assuming all logarithms increase", md: "Place the points (1, 0) and (base, 1) first. For a base less than one the graph falls as you move right." },
  ],
  check: [
    {
      id: 'log-bracket',
      title: "Between which integers?",
      topic: "Analytic geometry and functions",
      stemMd: md`Between which consecutive integers does $\log_{1/2}12$ lie?`,
      options: [
        { id: 'A', text: "3 and 4", note: "These bound the logarithm with base 2." },
        { id: 'B', text: "−4 and −3", note: "" },
        { id: 'C', text: "−3 and −2", note: "The corresponding powers run from 8 down to 4." },
        { id: 'D', text: "−2 and −1", note: "The corresponding powers run from 4 down to 2." },
        { id: 'E', text: "4 and 5", note: "These positive powers of one half are both below one." },
      ],
      answer: 'B',
      workingMd: md`The powers at $-4$ and $-3$ are 16 and 8. The graph is decreasing, so the exponent for 12 lies between them.`,
      lesson: "Locate the neighbouring powers before ordering the exponents.",
    },
    {
      id: 'log-product',
      title: "Combining factors",
      topic: "Analytic geometry and functions",
      stemMd: md`For $x>0$, which expression equals $2\log_3 x-\log_3 4$?`,
      options: [
        { id: 'A', text: md`$\log_3(2x/4)$`, note: "This makes the coefficient an argument multiplier." },
        { id: 'B', text: md`$\log_3(x^2-4)$`, note: "This subtracts arguments instead of dividing them." },
        { id: 'C', text: md`$\log_3(4x^2)$`, note: "This combines a difference as a product." },
        { id: 'D', text: md`$\log_3(x^2/4)$`, note: "" },
        { id: 'E', text: md`$\log_3(4/x^2)$`, note: "This reverses the quotient." },
      ],
      answer: 'D',
      workingMd: md`The coefficient gives $\log_3(x^2)$ and subtraction divides its argument by 4.`,
      lesson: "Move the coefficient into an exponent before combining the terms.",
    },
    {
      id: 'shifted-asymptote',
      title: "A translated logarithm",
      topic: "Analytic geometry and functions",
      stemMd: md`What is the vertical asymptote of $y=\log_2(x-5)+2$?`,
      options: [
        { id: 'A', text: md`$x=-5$`, note: "This moves the old asymptote in the opposite direction." },
        { id: 'B', text: md`$y=2$`, note: "This treats the vertical shift as a horizontal asymptote." },
        { id: 'C', text: md`$x=2$`, note: "This uses the output shift as the input boundary." },
        { id: 'D', text: md`$x=0$`, note: "This leaves the old asymptote in place." },
        { id: 'E', text: md`$x=5$`, note: "" },
      ],
      answer: 'E',
      workingMd: md`The argument approaches zero from above as $x$ approaches 5 from the right. The added 2 changes only the height.`,
      lesson: "Locate the input at which the logarithm's argument approaches zero.",
    },
  ],
  takeaways: [
    "A logarithm asks for an exponent, so its input must be positive.",
    "Reflect an exponential graph by exchanging the two coordinates.",
    "The base determines whether the graph rises or falls.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-mathematics', skill: 'tolci-math-analytic-functions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
