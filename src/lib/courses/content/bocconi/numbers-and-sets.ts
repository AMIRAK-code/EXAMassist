import { md, type Lesson, type Unit } from '../../types';

const setsLesson: Lesson = {
  slug: 'sets-and-venn-diagrams',
  title: 'Sets, Venn diagrams and counting overlaps',
  summary: 'Use set notation for union, intersection, complement and Cartesian product, and count overlapping groups in two and three sets without double counting.',
  minutes: 22,
  objectives: [
    'Read and apply inclusion, union, intersection, difference, complement and Cartesian product.',
    'Count the elements of a union of two or three sets with inclusion and exclusion.',
    'Fill a Venn diagram from the inside out to answer "only", "exactly" and "neither" questions.',
  ],
  teachMd: md`
### The notation

A set is a collection of distinct objects, its **elements**. $x \in A$ means $x$ belongs to $A$; $\lvert A \rvert$ (or $n(A)$) is the number of elements of a finite set. The **universe** $U$ is the set of everything under discussion.

| Symbol | Meaning | With $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5\}$, $U = \{1, \dots, 6\}$ |
| --- | --- | --- |
| $A \subseteq B$ | every element of $A$ is in $B$ | false: $1 \in A$ but $1 \notin B$ |
| $A \cup B$ | in $A$ or $B$ (or both) | $\{1, 2, 3, 4, 5\}$ |
| $A \cap B$ | in both $A$ and $B$ | $\{3, 4\}$ |
| $A \setminus B$ | in $A$ but not in $B$ | $\{1, 2\}$ |
| $\overline{A}$ (also $A^c$) | in $U$ but not in $A$ | $\{5, 6\}$ |
| $A \times B$ | all ordered pairs $(a, b)$ with $a \in A$, $b \in B$ | 12 pairs, from $(1, 3)$ to $(4, 5)$ |

The empty set $\varnothing$ has no elements and is a subset of every set. Every set is a subset of itself. A set with $n$ elements has $2^n$ subsets, because each element is either in or out of a subset, independently; the count includes $\varnothing$ and the set itself.

The **Cartesian product** has $\lvert A \times B \rvert = \lvert A \rvert \cdot \lvert B \rvert$ elements, and order matters: $(1, 3) \in A \times B$, while $(3, 1)$ belongs to $B \times A$.

The complement depends on the universe. "Not English" among 120 students is a different set from "not English" among all the students in a school. Name $U$ before taking any complement.

### Two useful laws

**De Morgan's laws** say that the complement of a union is the intersection of the complements, and the other way round:

$$\overline{A \cup B} = \overline{A} \cap \overline{B}, \qquad \overline{A \cap B} = \overline{A} \cup \overline{B}.$$

In words: "not (A or B)" is "neither A nor B"; "not (A and B)" is "not A, or not B". These let you count a "neither" group as $\lvert U \rvert - \lvert A \cup B \rvert$.

Also, $A \setminus B = A \cap \overline{B}$, and $A$ splits into two disjoint pieces: $A = (A \setminus B) \cup (A \cap B)$. That split is the idea behind every Venn diagram count.

### Intervals are sets too

Sets of real numbers are often intervals, and the same operations apply. With $A = [-2, 3)$ and $B = (1, 5]$: $A \cap B = (1, 3)$, $A \cup B = [-2, 5]$, $A \setminus B = [-2, 1]$. Draw both on one number line and read off the result, paying attention to which endpoints are included.

### Counting a union: inclusion and exclusion

Adding $\lvert A \rvert$ and $\lvert B \rvert$ counts the elements of $A \cap B$ twice, so subtract them once:

$$\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert.$$

For three sets, the pairwise overlaps are subtracted, but that removes the triple overlap once too often, so it is added back:

$$\lvert A \cup B \cup C \rvert = \lvert A \rvert + \lvert B \rvert + \lvert C \rvert - \lvert A \cap B \rvert - \lvert A \cap C \rvert - \lvert B \cap C \rvert + \lvert A \cap B \cap C \rvert.$$

### Filling a Venn diagram from the inside out

When a question asks for "only A", "exactly two" or "neither", draw the diagram and fill it from the innermost region outwards. With two sets there are four regions: only $A$, only $B$, both, and neither. With three sets there are eight: the centre (all three), three "exactly two" regions, three "only one" regions, and the outside.

1. Write the triple overlap in the centre.
2. For each pair, subtract the centre from the pair's total to get "these two only".
3. For each set, subtract its three inner regions from its total to get "this one only".
4. Subtract everything inside the circles from $\lvert U \rvert$ to get "neither".

Then add all eight regions; they must give $\lvert U \rvert$. That final sum is a built-in check.

### Reading the wording

"Studies French" includes those who also study German; "studies only French" does not. "At least one" is the union; "exactly one" excludes every overlap; "at most one" includes "neither". Most wrong answers in set questions come from reading one of these as another.
`,
  examples: [
    {
      id: 'example-two-languages',
      title: 'Two overlapping groups',
      problemMd: md`Of 120 students, 70 study English, 50 study Spanish and 25 study both. How many study neither language, and how many study only English?`,
      steps: [
        md`At least one language: $\lvert E \cup S \rvert = 70 + 50 - 25 = 95$.`,
        md`Neither: $120 - 95 = 25$.`,
        md`Only English: $70 - 25 = 45$. Only Spanish: $50 - 25 = 25$.`,
        md`Check the four regions add up: $45 + 25 + 25 + 25 = 120$.`,
      ],
      answerMd: md`25 study neither and 45 study only English. Forgetting the overlap gives $120 - 120 = 0$ for "neither", which is the classic double count.`,
    },
    {
      id: 'example-three-products',
      title: 'Three overlapping groups',
      problemMd: md`A shop surveyed 100 customers. 45 bought product $A$, 40 bought $B$ and 30 bought $C$; 15 bought $A$ and $B$, 10 bought $A$ and $C$, 8 bought $B$ and $C$, and 5 bought all three. How many bought none, and how many bought exactly one product?`,
      steps: [
        md`Union by inclusion and exclusion: $45 + 40 + 30 - 15 - 10 - 8 + 5 = 87$. So $100 - 87 = 13$ bought none.`,
        md`Fill from the centre: all three is 5. Exactly $A$ and $B$: $15 - 5 = 10$; exactly $A$ and $C$: $10 - 5 = 5$; exactly $B$ and $C$: $8 - 5 = 3$.`,
        md`Only $A$: $45 - 10 - 5 - 5 = 25$. Only $B$: $40 - 10 - 3 - 5 = 22$. Only $C$: $30 - 5 - 3 - 5 = 17$. Exactly one: $25 + 22 + 17 = 64$.`,
        md`Check: $64 + (10 + 5 + 3) + 5 + 13 = 64 + 18 + 5 + 13 = 100$.`,
      ],
      answerMd: md`13 bought none and 64 bought exactly one. Subtracting the pairwise totals without adding the centre back gives "only $A$" as $45 - 15 - 10 = 20$, which removes the 5 triple buyers twice.`,
    },
    {
      id: 'example-set-operations',
      title: 'Operations on a small universe',
      problemMd: md`Let $U = \{1, 2, \dots, 10\}$, $A$ the even numbers in $U$ and $B$ the multiples of 3 in $U$. Find $A \cap B$, $\overline{A \cup B}$, $A \setminus B$ and $\lvert A \times B \rvert$.`,
      steps: [
        md`List the sets: $A = \{2, 4, 6, 8, 10\}$ and $B = \{3, 6, 9\}$. So $A \cap B = \{6\}$.`,
        md`$A \cup B = \{2, 3, 4, 6, 8, 9, 10\}$, so its complement in $U$ is $\{1, 5, 7\}$.`,
        md`Check with De Morgan: $\overline{A} = \{1, 3, 5, 7, 9\}$ and $\overline{B} = \{1, 2, 4, 5, 7, 8, 10\}$; their intersection is $\{1, 5, 7\}$, the same.`,
        md`$A \setminus B = \{2, 4, 8, 10\}$, and $\lvert A \times B \rvert = 5 \cdot 3 = 15$.`,
      ],
      answerMd: md`$A \cap B = \{6\}$, $\overline{A \cup B} = \{1, 5, 7\}$, $A \setminus B = \{2, 4, 8, 10\}$, $\lvert A \times B \rvert = 15$. Answering 8 for the product, $5 + 3$, confuses pairs with a list of elements.`,
    },
  ],
  traps: [
    {
      title: 'Double counting the overlap',
      md: md`$\lvert A \rvert + \lvert B \rvert$ counts the members of both sets twice. Whenever groups can overlap, subtract the intersection, or fill a diagram region by region.`,
    },
    {
      title: 'Forgetting to add back the triple overlap',
      md: md`With three sets, each pairwise total already contains the people in all three. Subtracting all three pairwise totals removes them three times after they were added three times, so add the triple overlap back once. In a diagram, always start from the centre.`,
    },
    {
      title: 'Reading "A" as "only A"',
      md: md`"40 bought $B$" includes everyone who also bought something else. If a question asks how many bought only $B$, you must subtract the overlaps; if it asks how many bought $B$, you must not.`,
    },
    {
      title: 'Adding instead of multiplying for a Cartesian product',
      md: md`$A \times B$ is a set of pairs, so it has $\lvert A \rvert \cdot \lvert B \rvert$ elements, not $\lvert A \rvert + \lvert B \rvert$. Its subsets number $2^{\lvert A \rvert \cdot \lvert B \rvert}$.`,
    },
  ],
  check: [
    {
      id: 'check-two-sports',
      title: 'Players of both sports',
      topic: 'Sets',
      stemMd: md`In a class of 40 students, 22 play football, 17 play tennis and 6 play neither sport. How many play both?`,
      options: [
        { id: 'A', text: md`$1$`, note: md`This computes $40 - 22 - 17 = 1$, which ignores the 6 students who play neither sport. The overlap is the sum of the two groups minus the union: $39 - 34$.` },
        { id: 'B', text: md`$5$`, note: '' },
        { id: 'C', text: md`$6$`, note: md`This confuses the students who play neither sport with those who play both.` },
        { id: 'D', text: md`$17$`, note: md`This assumes every tennis player also plays football. That is the largest the overlap could be, not what the numbers give.` },
      ],
      answer: 'B',
      workingMd: md`Students who play at least one sport: $40 - 6 = 34$. By inclusion and exclusion, $34 = 22 + 17 - \text{both}$, so both $= 39 - 34 = 5$. Check: only football 17, only tennis 12, both 5, neither 6, total 40.`,
      lesson: 'Find the union first from the total and the "neither" group, then the overlap is the sum of the sets minus the union.',
    },
    {
      id: 'check-three-papers-exactly-one',
      title: 'Exactly one of three',
      topic: 'Sets',
      stemMd: md`Of 60 people, 25 read paper $X$, 20 read $Y$ and 18 read $Z$. 7 read $X$ and $Y$, 6 read $X$ and $Z$, 5 read $Y$ and $Z$, and 2 read all three. How many read exactly one paper?`,
      options: [
        { id: 'A', text: md`$13$`, note: md`This is the number who read no paper, $60 - 47$.` },
        { id: 'B', text: md`$27$`, note: md`This finds each "only" region by subtracting the two pairwise totals without adding back the 2 who read all three, so they are removed twice from each paper.` },
        { id: 'C', text: md`$33$`, note: '' },
        { id: 'D', text: md`$47$`, note: md`This is the number who read at least one paper, which also counts those who read two or three.` },
      ],
      answer: 'C',
      workingMd: md`Centre: 2. Exactly two: $7 - 2 = 5$, $6 - 2 = 4$, $5 - 2 = 3$. Only $X$: $25 - 5 - 4 - 2 = 14$; only $Y$: $20 - 5 - 3 - 2 = 10$; only $Z$: $18 - 4 - 3 - 2 = 9$. Exactly one: $14 + 10 + 9 = 33$. Check: the union is $25 + 20 + 18 - 7 - 6 - 5 + 2 = 47$, and $33 + 12 + 2 = 47$.`,
      lesson: 'For "exactly" questions with three sets, fill the diagram from the centre outwards and check that the regions add up to the union.',
    },
    {
      id: 'check-subsets-of-product',
      title: 'Subsets of a Cartesian product',
      topic: 'Sets',
      stemMd: md`Let $A = \{1, 2, 3\}$ and $B = \{a, b\}$. How many subsets does $A \times B$ have?`,
      options: [
        { id: 'A', text: md`$5$`, note: md`This adds $\lvert A \rvert + \lvert B \rvert$ and then stops: it is neither the size of the product nor a count of subsets.` },
        { id: 'B', text: md`$6$`, note: md`This is the number of elements of $A \times B$, not the number of its subsets.` },
        { id: 'C', text: md`$32$`, note: md`This is $2^5$, built on the wrong size $\lvert A \rvert + \lvert B \rvert = 5$ for the product.` },
        { id: 'D', text: md`$64$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`$A \times B$ has $3 \cdot 2 = 6$ ordered pairs. A set with 6 elements has $2^6 = 64$ subsets, counting the empty set and the whole set.`,
      lesson: md`$\lvert A \times B \rvert = \lvert A \rvert \cdot \lvert B \rvert$, and a set of $n$ elements has $2^n$ subsets.`,
    },
  ],
  takeaways: [
    md`$\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert$; for three sets, subtract the pairs and add back the triple.`,
    'Fill Venn diagrams from the centre outwards, and check that the regions add up to the whole.',
    md`The complement depends on the universe; "neither" is $\lvert U \rvert - \lvert A \cup B \rvert$.`,
    md`$\lvert A \times B \rvert = \lvert A \rvert \cdot \lvert B \rvert$, and a set of $n$ elements has $2^n$ subsets.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-sets' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const orderingLesson: Lesson = {
  slug: 'ordering-real-numbers',
  title: 'Order properties of the real numbers',
  summary: 'Know which operations keep an inequality and which reverse it, and compare fractions, roots and powers by hand without testing a single convenient number.',
  minutes: 20,
  objectives: [
    'State which operations preserve an inequality and which reverse it, and when squaring or taking reciprocals is safe.',
    md`Order $x$, $x^2$, $\sqrt{x}$ and $\frac{1}{x}$ for $x$ in different ranges.`,
    'Compare fractions, roots and sums of roots without a calculator.',
  ],
  teachMd: md`
### The rules that keep or flip an inequality

For real numbers with $a < b$:

| Operation | Result | Condition |
| --- | --- | --- |
| add or subtract any $c$ | $a + c < b + c$ | always |
| multiply or divide by $c$ | $ac < bc$ | $c > 0$ |
| multiply or divide by $c$ | $ac > bc$ (reversed) | $c < 0$ |
| take reciprocals | $\frac{1}{a} > \frac{1}{b}$ (reversed) | $a$ and $b$ have the **same** sign |
| square | $a^2 < b^2$ | $0 \leq a < b$ |
| take an odd power or odd root | $a^3 < b^3$, $\sqrt[3]{a} < \sqrt[3]{b}$ | always |

Odd powers and odd roots are increasing on all reals, so they always preserve order. Even powers preserve order only between non-negative numbers: $-3 < 2$ but $9 > 4$. Reciprocals reverse order within one sign, but if $a < 0 < b$ then $\frac{1}{a} < 0 < \frac{1}{b}$ and the order stays as it was.

Two inequalities in the same direction can be **added**: from $a < b$ and $c < d$, $a + c < b + d$. They cannot in general be subtracted or divided, and they can be multiplied only when every term is positive.

### Powers and roots of numbers between 0 and 1

For $x > 1$, raising to a higher power makes the number larger: $\sqrt{x} < x < x^2 < x^3$. For $0 < x < 1$ the order turns round, because multiplying by a number less than 1 makes things smaller:

$$0 < x^3 < x^2 < x < \sqrt{x} < 1 < \frac{1}{x}.$$

Test with $x = \frac{1}{4}$: $x^2 = \frac{1}{16}$, $\sqrt{x} = \frac{1}{2}$, $\frac{1}{x} = 4$. For $-1 < x < 0$ the signs matter too: odd powers stay negative, even powers become positive, and $\frac{1}{x} < -1$.

### Comparing fractions

To compare $\frac{a}{b}$ and $\frac{c}{d}$ with positive denominators, cross-multiply: $\frac{a}{b} < \frac{c}{d}$ exactly when $ad < bc$. This is just multiplying both sides by the positive number $bd$. If a denominator could be negative, cross-multiplying may need a reversal, so check signs first.

Other quick comparisons: compare each fraction with a benchmark such as $\frac{1}{2}$ or 1, or compare how far each falls short of 1. For instance $\frac{12}{13}$ is $\frac{1}{13}$ below 1 and $\frac{14}{15}$ is $\frac{1}{15}$ below 1, so $\frac{14}{15}$ is larger.

### Comparing roots

Two positive numbers compare in the same way as their squares, cubes or any positive power. So to compare roots, raise both to a power that clears every root:

- $\sqrt[3]{3}$ against $\sqrt{2}$: raise to the 6th power, giving $9$ against $8$, so $\sqrt[3]{3} > \sqrt{2}$.
- $\sqrt{2} + \sqrt{3}$ against $\sqrt{10}$: both are positive; square them. $(\sqrt{2} + \sqrt{3})^2 = 5 + 2\sqrt{6}$ and $(\sqrt{10})^2 = 10$, so compare $2\sqrt{6}$ with $5$. Square again: $24 < 25$. Hence $\sqrt{2} + \sqrt{3} < \sqrt{10}$.

Squaring is safe here only because both sides are positive. Before squaring, always confirm the sign of each side.

### "Must be true" questions

A typical question gives an inequality between letters and asks which statement must follow. A statement that **must** be true has to hold for every allowed value, including negatives, zero (if allowed) and fractions. The fastest test is to look for a counterexample: try a negative number, a number between 0 and 1, and numbers of opposite signs. One failure removes an option; the survivor should then be justified by a rule from the table, not by the examples.

### Intervals

Solution sets are written as intervals: $(a, b)$ excludes both ends, $[a, b]$ includes them, and $\infty$ always takes a round bracket. Between any two different real numbers there is another (their average), so an open interval like $(0, 1)$ has no smallest or largest element.
`,
  examples: [
    {
      id: 'example-order-between-0-1',
      title: 'Ordering powers of a fraction',
      problemMd: md`If $0 < x < 1$, put $x$, $x^2$, $\sqrt{x}$ and $\frac{1}{x}$ in increasing order.`,
      steps: [
        md`Multiplying by $x < 1$ makes a positive number smaller, so $x^2 = x \cdot x < x$.`,
        md`$\sqrt{x}$ is the number whose square is $x$; since squaring makes numbers in $(0, 1)$ smaller, $\sqrt{x}$ must be larger than $x$, but still less than 1.`,
        md`$\frac{1}{x} > 1$ because $x < 1$, so it is the largest.`,
        md`Check with $x = \frac{1}{4}$: $\frac{1}{16} < \frac{1}{4} < \frac{1}{2} < 4$.`,
      ],
      answerMd: md`$x^2 < x < \sqrt{x} < \frac{1}{x}$. Assuming squares are always larger, $x < x^2$, is the habit from numbers greater than 1 that this question targets.`,
    },
    {
      id: 'example-compare-fractions',
      title: 'Two close fractions',
      problemMd: md`Which is larger, $\frac{7}{9}$ or $\frac{11}{14}$?`,
      steps: [
        md`The denominators are positive, so cross-multiply: compare $7 \cdot 14 = 98$ with $11 \cdot 9 = 99$.`,
        md`Since $98 < 99$, $\frac{7}{9} < \frac{11}{14}$.`,
        md`Second route: $\frac{7}{9}$ is $\frac{2}{9}$ below 1 and $\frac{11}{14}$ is $\frac{3}{14}$ below 1. Compare $\frac{2}{9}$ with $\frac{3}{14}$: $28 > 27$, so $\frac{7}{9}$ falls further short of 1 and is the smaller.`,
      ],
      answerMd: md`$\frac{11}{14}$ is larger, by $\frac{1}{126}$. Comparing numerators or denominators alone does not settle it, since both are larger in $\frac{11}{14}$.`,
    },
    {
      id: 'example-negative-pair',
      title: 'What follows from $a < b < 0$?',
      problemMd: md`If $a < b < 0$, decide whether each is true: $a^2 > b^2$; $\frac{1}{a} > \frac{1}{b}$; $ab > 0$; $\frac{a}{b} > 1$.`,
      steps: [
        md`Both numbers are negative and $a$ is further from 0, so $\lvert a \rvert > \lvert b \rvert$ and $a^2 > b^2$. True.`,
        md`Same sign, so reciprocals reverse the order: $\frac{1}{a} > \frac{1}{b}$. True. With $a = -3$, $b = -2$: $-\frac{1}{3} > -\frac{1}{2}$.`,
        md`A product of two negatives is positive: $ab > 0$. True.`,
        md`Divide $a < b$ by the negative number $b$, reversing the sign: $\frac{a}{b} > 1$. True; with the same numbers, $\frac{-3}{-2} = 1.5$.`,
      ],
      answerMd: md`All four are true. The usual slip is to keep the direction when dividing by $b$ and conclude $\frac{a}{b} < 1$.`,
    },
  ],
  traps: [
    {
      title: 'Multiplying by a negative without reversing',
      md: md`From $-2x < 6$, dividing by $-2$ gives $x > -3$, not $x < -3$. The same applies when you multiply by a letter whose sign you do not know: then you cannot multiply at all until you split into cases.`,
    },
    {
      title: 'Squaring an inequality with negative numbers',
      md: md`$-5 < 3$ does not give $25 < 9$. Square only when both sides are non-negative; otherwise compare absolute values.`,
    },
    {
      title: 'Flipping reciprocals across zero',
      md: md`$-2 < 3$ gives $-\frac{1}{2} < \frac{1}{3}$: no reversal, because the two numbers have opposite signs. Reciprocals reverse the order only within one sign.`,
    },
    {
      title: 'Proving "must be true" with one friendly number',
      md: md`Checking $a = 1$, $b = 2$ shows a statement can be true, not that it must be. Try a negative value and a fraction before accepting an option.`,
    },
  ],
  check: [
    {
      id: 'check-order-negative-fraction',
      title: 'Ordering when $x$ is between $-1$ and $0$',
      topic: 'Numbers',
      stemMd: md`If $-1 < x < 0$, which ordering is correct?`,
      options: [
        { id: 'A', text: md`$x^3 < x < x^2 < \frac{1}{x}$`, note: md`This uses the habits of positive numbers: for negative $x$, $\frac{1}{x}$ is negative and $x^3$ is closer to 0 than $x$.` },
        { id: 'B', text: md`$\frac{1}{x} < x^3 < x < x^2$`, note: md`Cubing a number between $-1$ and $0$ moves it towards 0, so $x^3 > x$, not $x^3 < x$.` },
        { id: 'C', text: md`$\frac{1}{x} < x < x^3 < x^2$`, note: '' },
        { id: 'D', text: md`$x < \frac{1}{x} < x^3 < x^2$`, note: md`The reciprocal of a number between $-1$ and $0$ is less than $-1$, so $\frac{1}{x} < x$.` },
      ],
      answer: 'C',
      workingMd: md`Take $x = -\frac{1}{2}$: $\frac{1}{x} = -2$, $x = -\frac{1}{2}$, $x^3 = -\frac{1}{8}$, $x^2 = \frac{1}{4}$. In general, $\lvert x^3 \rvert < \lvert x \rvert < 1 < \lvert \frac{1}{x} \rvert$ with all three negative, and $x^2 > 0$. So $\frac{1}{x} < x < x^3 < x^2$.`,
      lesson: 'For negative numbers, order by distance from zero and then reverse: the one furthest from zero is the smallest.',
    },
    {
      id: 'check-must-be-true',
      title: 'Which statement must hold?',
      topic: 'Numbers',
      stemMd: md`If $a$ and $b$ are real numbers with $a < b$, which statement must be true?`,
      options: [
        { id: 'A', text: md`$a^2 < b^2$`, note: md`Fails for $a = -3$, $b = 1$: $9 > 1$. Squaring keeps the order only for non-negative numbers.` },
        { id: 'B', text: md`$-3a > -3b$`, note: '' },
        { id: 'C', text: md`$\frac{1}{a} > \frac{1}{b}$`, note: md`Fails for $a = -1$, $b = 2$: $-1 < \frac{1}{2}$. Reciprocals reverse the order only when both numbers have the same sign, and they do not exist at 0.` },
        { id: 'D', text: md`$\frac{a}{b} < 1$`, note: md`Fails for $a = -4$, $b = -2$: $\frac{a}{b} = 2$. Dividing by a negative $b$ reverses the inequality, and $b$ could also be 0.` },
      ],
      answer: 'B',
      workingMd: md`Multiplying $a < b$ by the negative number $-3$ reverses the sign: $-3a > -3b$. This holds for every pair with $a < b$. Each other statement has a counterexample.`,
      lesson: 'A statement that must be true survives negative values, fractions and mixed signs; multiplying by a known negative constant always reverses the order.',
    },
    {
      id: 'check-compare-root-sums',
      title: 'Ordering sums of roots',
      topic: 'Numbers',
      stemMd: md`Which ordering of $\sqrt{5} + \sqrt{3}$, $\sqrt{7} + 1$ and $4$ is correct?`,
      options: [
        { id: 'A', text: md`$\sqrt{7} + 1 < \sqrt{5} + \sqrt{3} < 4$`, note: '' },
        { id: 'B', text: md`$\sqrt{5} + \sqrt{3} < \sqrt{7} + 1 < 4$`, note: md`Both sums square to 8 plus a term: $2\sqrt{15}$ against $2\sqrt{7}$. Since $15 > 7$, $\sqrt{5} + \sqrt{3}$ is the larger.` },
        { id: 'C', text: md`$\sqrt{7} + 1 < 4 < \sqrt{5} + \sqrt{3}$`, note: md`Rough estimates such as $\sqrt{5} \approx 2.3$ and $\sqrt{3} \approx 1.8$ overshoot. Squaring shows $8 + 2\sqrt{15} < 16$, because $60 < 64$.` },
        { id: 'D', text: md`$4 < \sqrt{7} + 1 < \sqrt{5} + \sqrt{3}$`, note: md`$\sqrt{7} < 3$, so $\sqrt{7} + 1 < 4$.` },
      ],
      answer: 'A',
      workingMd: md`All three are positive, so compare squares. $(\sqrt{5} + \sqrt{3})^2 = 8 + 2\sqrt{15}$, $(\sqrt{7} + 1)^2 = 8 + 2\sqrt{7}$, $4^2 = 16 = 8 + 8$. Now $2\sqrt{7} < 2\sqrt{15}$, and $2\sqrt{15} < 8$ because $60 < 64$. So $\sqrt{7} + 1 < \sqrt{5} + \sqrt{3} < 4$.`,
      lesson: 'To compare positive expressions with roots, square them, cancel the common part, and square again if needed.',
    },
  ],
  takeaways: [
    'Multiplying or dividing by a negative reverses an inequality; adding never does.',
    'Squares keep the order only for non-negative numbers; reciprocals reverse it only within one sign.',
    md`For $0 < x < 1$: $x^2 < x < \sqrt{x} < 1 < \frac{1}{x}$.`,
    'Compare positive roots by raising both sides to a power that clears the roots.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-numbers-ordering' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const percentUnitsLesson: Lesson = {
  slug: 'percentages-and-unit-conversion',
  title: 'Percentages and unit conversions',
  summary: 'Handle percentages as multipliers, reverse a tax or discount, tell percentage points from percent, and convert lengths, areas, volumes and speeds by hand.',
  minutes: 22,
  objectives: [
    'Apply, chain and reverse percentage changes with multipliers.',
    'Distinguish a change in percentage points from a percent change.',
    'Convert between units of length, area, volume, time and speed, including squared and cubed units.',
  ],
  teachMd: md`
### Percentages as multipliers

$p\%$ of a quantity is $\frac{p}{100}$ times it. A change by a percentage is a multiplication:

| Change | Multiplier |
| --- | --- |
| increase by 22% | $1.22$ |
| increase by 5% | $1.05$ |
| decrease by 30% | $0.70$ |
| decrease by 2.5% | $0.975$ |

This one idea handles three common tasks:

- **New value:** multiply. A €80 item with 22% tax costs $80 \times 1.22 = 97.60$ euros.
- **Several changes in a row:** multiply the multipliers. Up 20% then down 25% is $1.2 \times 0.75 = 0.9$, a 10% fall overall. Percentages do not add.
- **Original value:** divide. If a price after a 22% tax is €61, the price before tax is $\frac{61}{1.22} = 50$ euros.

Without a calculator, convert awkward multipliers into fractions: $1.25 = \frac{5}{4}$, $0.75 = \frac{3}{4}$, $1.2 = \frac{6}{5}$, $0.8 = \frac{4}{5}$, $1.125 = \frac{9}{8}$. Dividing by $1.25$ is multiplying by $\frac{4}{5}$.

### Percent change and its base

$$\text{percent change} = \frac{\text{new} - \text{old}}{\text{old}} \times 100\%.$$

The base is always the starting value. A rise from 50 to 60 is $+20\%$; the fall from 60 back to 50 is about $-16.7\%$. "$A$ is 25% more than $B$" means $A = 1.25B$, and then $B = 0.8A$, which is 20% less than $A$.

### Percentage points

When the quantity itself is a percentage, such as an interest rate, a tax rate or a share of votes, two different changes can be asked for. A rate that moves from 8% to 10% has risen by **2 percentage points** (a subtraction) and by **25%** (a percent change, $\frac{2}{8}$). Read which one the question wants; both numbers will be among the options.

### Unit conversion: multiply by one

A conversion factor is a fraction equal to 1, such as $\frac{1000 \text{ m}}{1 \text{ km}}$ or $\frac{1 \text{ h}}{60 \text{ min}}$. Multiply by factors arranged so that the unknown units cancel and the wanted ones remain:

$$72 \ \frac{\text{km}}{\text{h}} \times \frac{1000 \text{ m}}{1 \text{ km}} \times \frac{1 \text{ h}}{3600 \text{ s}} = 20 \ \frac{\text{m}}{\text{s}}.$$

So km/h to m/s is division by 3.6, and m/s to km/h is multiplication by 3.6. Before you trust a result, ask whether it should be bigger or smaller: a quantity in a smaller unit needs a bigger number.

### Squares and cubes of units

An area unit is a length unit squared, so its factor is squared too; a volume unit is cubed:

| Relation | Length | Area | Volume |
| --- | --- | --- | --- |
| m and cm | $1 \text{ m} = 100 \text{ cm}$ | $1 \text{ m}^2 = 10\,000 \text{ cm}^2$ | $1 \text{ m}^3 = 1\,000\,000 \text{ cm}^3$ |
| km and m | $1 \text{ km} = 1000 \text{ m}$ | $1 \text{ km}^2 = 1\,000\,000 \text{ m}^2$ | |

Two named units are worth knowing: $1$ litre $= 1 \text{ dm}^3 = 1000 \text{ cm}^3$, so $1 \text{ m}^3 = 1000$ litres; and $1$ hectare $= 10\,000 \text{ m}^2$, the area of a square 100 m on each side.

The safest method for areas and volumes is to convert each **length** first, then multiply. A 2.5 m by 1.2 m floor is 250 cm by 120 cm, which is $30\,000 \text{ cm}^2$, the same as $3 \text{ m}^2 \times 10\,000$.

### Time

Time is not decimal. $1.25$ hours is 1 hour and $0.25 \times 60 = 15$ minutes, not 1 hour 25 minutes. Convert the decimal part by multiplying by 60, and convert minutes to hours by dividing by 60: 45 minutes is $0.75$ h.

### A habit that saves marks

Write the units next to every number in your working. A result in "km times hours" when you wanted km/h shows at once that something was multiplied instead of divided.
`,
  examples: [
    {
      id: 'example-up-then-down',
      title: 'Two changes in a row',
      problemMd: md`A price rises by 20%, then the new price falls by 25%. What is the overall percentage change? Check it on a price of €80.`,
      steps: [
        md`Multipliers: up 20% is $1.2$, down 25% is $0.75$.`,
        md`Combined: $1.2 \times 0.75 = \frac{6}{5} \times \frac{3}{4} = \frac{18}{20} = 0.9$, a 10% decrease.`,
        md`Check: $80 \times 1.2 = 96$, then $96 \times 0.75 = 72$, and $\frac{72 - 80}{80} = -10\%$.`,
      ],
      answerMd: md`An overall decrease of 10%. Adding the percentages, $+20 - 25 = -5$, gives the tempting wrong answer of a 5% decrease.`,
    },
    {
      id: 'example-remove-tax',
      title: 'Removing a tax from a total',
      problemMd: md`A bill of €61 includes 22% tax on the pre-tax amount. What was the pre-tax amount, and how much was the tax?`,
      steps: [
        md`Pre-tax amount $\times 1.22 = 61$, so pre-tax amount $= \frac{61}{1.22}$.`,
        md`Clear the decimal: $\frac{6100}{122} = 50$, since $122 \times 50 = 6100$.`,
        md`The tax is $61 - 50 = 11$ euros, which is 22% of 50, as it should be.`,
      ],
      answerMd: md`€50 before tax and €11 of tax. Taking 22% of €61, which is €13.42, and subtracting it gives €47.58, the wrong answer: the 22% was calculated on the pre-tax amount, not on the total.`,
    },
    {
      id: 'example-speed-time',
      title: 'Speed in two units',
      problemMd: md`A cyclist rides at 18 km/h. How many metres does she cover per second, and how long does a 1.5 km stretch take, in minutes and seconds?`,
      steps: [
        md`$18 \text{ km/h} = \frac{18\,000 \text{ m}}{3600 \text{ s}} = 5 \text{ m/s}$; equivalently $18 \div 3.6 = 5$.`,
        md`Time for 1.5 km: $\frac{1500 \text{ m}}{5 \text{ m/s}} = 300$ s.`,
        md`$300 \text{ s} = 5$ minutes exactly. Check in hours: $\frac{1.5}{18} = \frac{1}{12}$ h, and $\frac{60}{12} = 5$ minutes.`,
      ],
      answerMd: md`5 m/s, and 5 minutes for 1.5 km. Multiplying by 3.6 instead of dividing gives 64.8 m/s, an impossible speed for a bicycle.`,
    },
    {
      id: 'example-tiles',
      title: 'Tiles on a floor',
      problemMd: md`A floor measures 2.5 m by 1.2 m. How many rectangular tiles of 20 cm by 25 cm are needed to cover it exactly, if the 25 cm side runs along the 2.5 m side?`,
      steps: [
        md`Convert lengths first: the floor is 250 cm by 120 cm.`,
        md`Along 250 cm: $\frac{250}{25} = 10$ tiles. Along 120 cm: $\frac{120}{20} = 6$ tiles. So $10 \times 6 = 60$ tiles, with nothing cut.`,
        md`Check by area: floor $250 \times 120 = 30\,000 \text{ cm}^2$, tile $20 \times 25 = 500 \text{ cm}^2$, and $\frac{30\,000}{500} = 60$.`,
      ],
      answerMd: md`60 tiles. Converting the floor's $3 \text{ m}^2$ with the length factor, as $300 \text{ cm}^2$, would suggest less than one tile.`,
    },
  ],
  traps: [
    {
      title: 'Adding successive percentages',
      md: md`Up 10% then up 10% is $1.1^2 = 1.21$, a 21% rise. Each change acts on the result of the previous one, so multiply the multipliers.`,
    },
    {
      title: 'Reversing with the same percentage',
      md: md`To remove a 25% increase, divide by 1.25, which is a 20% decrease. Subtracting 25% of the new value overshoots.`,
    },
    {
      title: 'Percentage points against percent',
      md: md`A rate going from 4% to 5% has risen by 1 percentage point and by 25%. Decide which the question means before calculating.`,
    },
    {
      title: 'Converting areas with a length factor',
      md: md`$1 \text{ m}^2$ is $10\,000 \text{ cm}^2$, not $100 \text{ cm}^2$, and $1 \text{ m}^3$ is 1000 litres. Convert each length before you multiply.`,
    },
    {
      title: 'Reading decimal hours as minutes',
      md: md`$2.4$ h is 2 h 24 min, not 2 h 40 min. Multiply the decimal part by 60.`,
    },
  ],
  check: [
    {
      id: 'check-raise-then-cut',
      title: 'A rise and a cut',
      topic: 'Numbers',
      stemMd: md`An item priced at €150 is marked up by 40%, and the new price is then reduced by 25%. What is the final price?`,
      options: [
        { id: 'A', text: md`€112.50`, note: md`This applies only the 25% reduction to the original €150 and skips the mark-up.` },
        { id: 'B', text: md`€157.50`, note: '' },
        { id: 'C', text: md`€172.50`, note: md`This adds the percentages, $+40 - 25 = +15$, and applies 15% to €150. The 25% cut is taken of the higher price, so the changes do not combine by addition.` },
        { id: 'D', text: md`€210.00`, note: md`This is the price after the mark-up only.` },
      ],
      answer: 'B',
      workingMd: md`Combined multiplier: $1.4 \times 0.75 = \frac{7}{5} \times \frac{3}{4} = \frac{21}{20} = 1.05$. Final price: $150 \times 1.05 = 157.50$, so €157.50. Step by step: $150 \times 1.4 = 210$, and $210 \times 0.75 = 157.5$.`,
      lesson: 'Chain percentage changes by multiplying their multipliers.',
    },
    {
      id: 'check-rate-rise',
      title: 'A rate that rose',
      topic: 'Numbers',
      stemMd: md`A country's unemployment rate rose from 8% to 10%. Which statement is correct?`,
      options: [
        { id: 'A', text: md`It rose by 2%.`, note: md`The rise is 2 percentage points. As a percent change of the rate it is 25%, not 2%.` },
        { id: 'B', text: md`It rose by 2 percentage points, which is 20%.`, note: md`20% is $\frac{2}{10}$, which measures the change from the new value. A percent change is measured from the old value, 8.` },
        { id: 'C', text: md`It rose by 2 percentage points, which is 25%.`, note: '' },
        { id: 'D', text: md`It rose by 25 percentage points.`, note: md`25 is the percent change of the rate. Calling it percentage points mixes the two measures; the difference is 2 points.` },
      ],
      answer: 'C',
      workingMd: md`The difference between the rates is $10 - 8 = 2$ percentage points. The percent change is $\frac{10 - 8}{8} = \frac{1}{4} = 25\%$.`,
      lesson: 'For a change in a rate, percentage points are the difference; percent is that difference divided by the starting rate.',
    },
    {
      id: 'check-field-hectares',
      title: 'A field in hectares',
      topic: 'Numbers',
      stemMd: md`A rectangular field measures 0.3 km by 250 m. What is its area in hectares? (1 hectare $= 10\,000 \text{ m}^2$.)`,
      options: [
        { id: 'A', text: md`$0.75$`, note: md`This takes 0.3 km as 30 m. One kilometre is 1000 m, so 0.3 km is 300 m.` },
        { id: 'B', text: md`$7.5$`, note: '' },
        { id: 'C', text: md`$75$`, note: md`This divides by 1000 instead of 10 000, as if a hectare were $1000 \text{ m}^2$.` },
        { id: 'D', text: md`$750$`, note: md`This divides by 100, treating a hectare as $100 \text{ m}^2$, the side of the square instead of its area.` },
      ],
      answer: 'B',
      workingMd: md`Convert lengths first: $0.3 \text{ km} = 300 \text{ m}$. Area: $300 \times 250 = 75\,000 \text{ m}^2$. In hectares: $\frac{75\,000}{10\,000} = 7.5$.`,
      lesson: 'Convert every length to one unit before multiplying, then convert the area with the area factor.',
    },
  ],
  takeaways: [
    md`A change of $p\%$ is a multiplier, $1 \pm \frac{p}{100}$; chain changes by multiplying, reverse them by dividing.`,
    'Percent change is measured from the starting value; percentage points are a plain difference of rates.',
    md`Area factors are squared and volume factors cubed: $1 \text{ m}^2 = 10\,000 \text{ cm}^2$, $1 \text{ m}^3 = 1000$ litres.`,
    'km/h to m/s: divide by 3.6. Decimal hours: multiply the decimal part by 60 for minutes.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-numbers-percentages' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const numbersAndSetsUnit: Unit = {
  slug: 'numbers-and-sets',
  title: 'Numbers and sets',
  summary:
    'Sets and numbers are both topics on the mathematics syllabus of the Online Bocconi Test. This unit covers set operations, Venn diagrams and counting overlaps; the order properties of the real numbers; and percentages and unit conversions, all worked by hand.',
  lessons: [setsLesson, orderingLesson, percentUnitsLesson],
};
