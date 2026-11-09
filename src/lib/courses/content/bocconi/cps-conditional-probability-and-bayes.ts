import { md, type Lesson } from '../../types';

export const conditionalProbabilityAndBayesLesson: Lesson = {
  slug: 'conditional-probability-and-bayes',
  title: 'Conditional probability, total probability and Bayes',
  summary: 'Restrict the sample space to what you know, use trees for total probability, and turn Bayes questions into a frequency table you can trust.',
  minutes: 25,
  objectives: [
    'Compute a conditional probability from a table, a formula or a reduced sample space.',
    'Find an overall probability with the total probability theorem.',
    'Reverse a conditional probability with Bayes, and check it with a frequency table.',
  ],
  teachMd: md`
### What "given" does

$P(A \mid B)$, read "the probability of $A$ given $B$", is the probability of $A$ once you know that $B$ has happened. Knowing $B$ throws away every outcome outside $B$: the sample space shrinks to $B$, and you ask what share of it also lies in $A$.
$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \qquad P(B) > 0.$$
With counts, the same idea is simply "how many in both, out of how many in $B$". The denominator is the condition, never the whole population.

### Order matters

$P(A \mid B)$ and $P(B \mid A)$ are different numbers with the same numerator and different denominators. In a class of 30 where 10 students play chess and 4 of those also play the piano, while 8 students play the piano in all: $P(\text{piano} \mid \text{chess}) = \frac{4}{10}$, but $P(\text{chess} \mid \text{piano}) = \frac{4}{8}$. Before computing, say aloud which group you are restricted to.

### The multiplication rule and trees

Rearranging the definition gives
$$P(A \cap B) = P(B)\,P(A \mid B) = P(A)\,P(B \mid A).$$
This is what you use when an experiment happens in stages, such as drawing without replacement or choosing a supplier and then testing a part. A **tree** displays it: the first branches carry $P(B)$ and $P(\overline{B})$; the branches after them carry conditional probabilities; the probability of a path is the product along it. The branches leaving any point must add up to 1.

$A$ and $B$ are independent exactly when $P(A \mid B) = P(A)$: knowing $B$ changes nothing.

### Total probability

If the sample space is split into separate cases $B_1, B_2, \dots, B_n$ that cover everything (three factories, two machines, "has the condition" and "does not"), then
$$P(A) = P(B_1)P(A \mid B_1) + P(B_2)P(A \mid B_2) + \dots + P(B_n)P(A \mid B_n).$$
On a tree, this is "add every path that ends in $A$". It is the sum rule and the multiplication rule working together.

### Bayes' theorem

Often the question gives $P(A \mid B)$ and asks for $P(B \mid A)$: the defect rate of a machine is known, and you want the chance that a defective part came from that machine. Bayes' theorem reverses the condition:
$$P(B_k \mid A) = \frac{P(B_k)\,P(A \mid B_k)}{P(A)},$$
where the denominator $P(A)$ comes from total probability. In words: the path through $B_k$ that ends in $A$, divided by all paths that end in $A$.

### The frequency table: the safest route

Formulas with several decimals are where marks are lost without a calculator. Instead, imagine a round number of cases, such as 1000 or 10 000, chosen so that every count is a whole number, and fill in a table.

| | $A$ | not $A$ | Total |
| --- | --- | --- | --- |
| $B_1$ | | | |
| $B_2$ | | | |
| Total | | | |

Fill the row totals from $P(B_1), P(B_2)$, then each $A$ cell from the conditional rates, then the column total. Every conditional probability is now a cell divided by a total: $P(A \mid B_1)$ divides by a row total, $P(B_1 \mid A)$ divides by a column total. The same table also gives the joint and the overall rates, so one table answers every part of a multi-part question.

### Base rates matter

When one group is much larger than the other, a small error rate in the large group can produce more cases than a large rate in the small group. That is why a test that is right 90% of the time can still produce mostly false alarms when the thing it detects is rare. A table makes this visible at once; intuition usually does not.

### A routine for Bayes questions

1. Name the cases (the rows) and the observed event (the column).
2. Pick a total such as 1000 so the counts are whole.
3. Fill the rows, then the event column.
4. Divide the cell you want by the column total of the observed event.
5. Check: the probabilities of all cases given the event add up to 1.
`,
  examples: [
    {
      id: 'example-two-way-table',
      title: 'Reading conditional probabilities from a table',
      problemMd: md`A university club has 200 members: 120 study economics and 80 study law. Of the economics students, 30 play a team sport; of the law students, 40 do. A member is chosen at random. Find $P(\text{law} \mid \text{sport})$ and $P(\text{sport} \mid \text{law})$.`,
      steps: [
        md`Complete the table. Economics: 30 sport, 90 no sport. Law: 40 sport, 40 no sport. Sport total: $30 + 40 = 70$; no sport: $90 + 40 = 130$; grand total $70 + 130 = 200$.`,
        md`$P(\text{law} \mid \text{sport})$: restrict to the 70 who play sport; 40 of them study law. $\frac{40}{70} = \frac{4}{7}$.`,
        md`$P(\text{sport} \mid \text{law})$: restrict to the 80 law students; 40 play sport. $\frac{40}{80} = \frac{1}{2}$.`,
        md`Formula check: $P(\text{law} \cap \text{sport}) = \frac{40}{200}$ and $P(\text{sport}) = \frac{70}{200}$, so $\frac{40/200}{70/200} = \frac{4}{7}$.`,
      ],
      answerMd: md`$P(\text{law} \mid \text{sport}) = \frac{4}{7}$ and $P(\text{sport} \mid \text{law}) = \frac{1}{2}$. Dividing by the whole club, $\frac{40}{200} = \frac{1}{5}$, gives the joint probability, which answers neither question.`,
    },
    {
      id: 'example-three-suppliers',
      title: 'Three suppliers',
      problemMd: md`A shop buys 50% of its light bulbs from supplier A, 30% from B and 20% from C. The proportions of faulty bulbs are 2% for A, 3% for B and 5% for C. (a) What proportion of all bulbs is faulty? (b) A bulb is found to be faulty; what is the probability that it came from C?`,
      steps: [
        md`(a) Total probability: $0.5 \times 0.02 + 0.3 \times 0.03 + 0.2 \times 0.05 = 0.010 + 0.009 + 0.010 = 0.029$.`,
        md`(b) Bayes: the path through C ending in "faulty" is $0.010$, out of $0.029$ for all faulty paths. $P(C \mid \text{faulty}) = \frac{0.010}{0.029} = \frac{10}{29}$.`,
        md`Frequency check with 1000 bulbs: A supplies 500, of which 10 are faulty; B supplies 300, of which 9 are faulty; C supplies 200, of which 10 are faulty. Faulty in all: 29, so 2.9%; from C: $\frac{10}{29}$.`,
        md`Final check: $P(A \mid \text{faulty}) + P(B \mid \text{faulty}) + P(C \mid \text{faulty}) = \frac{10 + 9 + 10}{29} = 1$.`,
      ],
      answerMd: md`(a) 2.9% of bulbs are faulty; (b) $\frac{10}{29}$, about 0.34. Answering 0.2 (C's share of all bulbs) or 0.05 (C's fault rate) ignores the information that the bulb is faulty.`,
    },
    {
      id: 'example-spam-filter',
      title: 'A filter that flags emails',
      problemMd: md`Of the emails reaching an inbox, 20% are spam. A filter flags 90% of spam emails and also, wrongly, flags 5% of genuine emails. An email has been flagged. What is the probability that it is spam?`,
      steps: [
        md`Cases: spam and genuine. Observed event: flagged. Take 1000 emails.`,
        md`Spam: 200 emails, of which $0.9 \times 200 = 180$ are flagged. Genuine: 800 emails, of which $0.05 \times 800 = 40$ are flagged.`,
        md`Flagged in all: $180 + 40 = 220$. $P(\text{spam} \mid \text{flagged}) = \frac{180}{220} = \frac{9}{11}$.`,
        md`Formula check: $\frac{0.2 \times 0.9}{0.2 \times 0.9 + 0.8 \times 0.05} = \frac{0.18}{0.18 + 0.04} = \frac{0.18}{0.22} = \frac{9}{11}$.`,
      ],
      answerMd: md`$\frac{9}{11}$, about 0.82. The tempting answer 0.9 is $P(\text{flagged} \mid \text{spam})$, the reverse condition; it ignores the 40 genuine emails that are flagged too.`,
    },
  ],
  traps: [
    {
      title: 'Reversing the condition',
      md: md`"90% of spam is flagged" is $P(\text{flagged} \mid \text{spam})$. The question "how likely is a flagged email to be spam?" asks for $P(\text{spam} \mid \text{flagged})$. They share a numerator but not a denominator. Underline the word after "given" or "among": that group is the denominator.`,
    },
    {
      title: 'Dividing by the whole population',
      md: md`A conditional probability divides by the size of the condition. Dividing a cell by the grand total gives the joint probability $P(A \cap B)$, which a multiple-choice question may well include among its options.`,
    },
    {
      title: 'Ignoring the base rate',
      md: md`Comparing only the rates (2% against 6% faulty, say) and answering $\frac{6}{2 + 6}$ forgets how much each source produces. Each rate must be weighted by the size of its group, which is exactly what the frequency table does.`,
    },
    {
      title: 'Assuming independence',
      md: md`$P(A \cap B) = P(A)P(B)$ holds only for independent events. When a question gives conditional rates that differ between groups, the events are dependent, and you must multiply by the conditional probability: $P(A \cap B) = P(B)P(A \mid B)$.`,
    },
  ],
  check: [
    {
      id: 'check-remote-managers',
      title: 'Managers who work remotely',
      topic: 'Conditional probability and Bayes',
      stemMd: md`At a firm, 60% of staff work remotely at least one day a week. Among remote workers, 25% are managers; among the other staff, 10% are managers. A manager is chosen at random. What is the probability that this manager works remotely at least one day a week?`,
      options: [
        { id: 'A', text: md`$\frac{3}{20}$`, note: md`This is $0.6 \times 0.25$, the probability that a randomly chosen employee is a remote manager. It still has to be divided by the probability of being a manager.` },
        { id: 'B', text: md`$\frac{1}{4}$`, note: md`This is $P(\text{manager} \mid \text{remote})$, the reverse of the condition asked for.` },
        { id: 'C', text: md`$\frac{3}{5}$`, note: md`This is the share of remote workers among all staff; it ignores the information that the person chosen is a manager.` },
        { id: 'D', text: md`$\frac{15}{19}$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Take 1000 staff. Remote: 600, of whom 150 are managers. Others: 400, of whom 40 are managers. Managers in all: 190. $P(\text{remote} \mid \text{manager}) = \frac{150}{190} = \frac{15}{19}$. Formula check: $\frac{0.6 \times 0.25}{0.6 \times 0.25 + 0.4 \times 0.1} = \frac{0.15}{0.19}$.`,
      lesson: 'Bayes questions become easy with 1000 imagined cases: divide the cell you want by the total of the observed group.',
    },
    {
      id: 'check-sum-eight-six',
      title: 'Given a sum of 8',
      topic: 'Conditional probability and Bayes',
      stemMd: md`Two fair dice are rolled and the sum is 8. Given this, what is the probability that at least one die shows a 6?`,
      options: [
        { id: 'A', text: md`$\frac{1}{18}$`, note: md`This is $\frac{2}{36}$, the probability of "sum 8 and a 6 showing" among all 36 outcomes; the condition was not used to shrink the sample space.` },
        { id: 'B', text: md`$\frac{11}{36}$`, note: md`This is the probability of at least one 6 with no condition at all; knowing the sum is 8 changes it.` },
        { id: 'C', text: md`$\frac{1}{3}$`, note: md`Lists the unordered results {2, 6}, {3, 5}, {4, 4} as if equally likely. In ordered pairs, {2, 6} happens two ways and {4, 4} only one.` },
        { id: 'D', text: md`$\frac{2}{5}$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`The reduced sample space is the 5 ordered pairs with sum 8: $(2,6), (3,5), (4,4), (5,3), (6,2)$. Two of them contain a 6. $P = \frac{2}{5}$. Formula check: $\frac{P(\text{sum } 8 \cap \text{a } 6)}{P(\text{sum } 8)} = \frac{2/36}{5/36} = \frac{2}{5}$.`,
      lesson: 'Given an event, list only the outcomes inside it, still as equally likely ordered outcomes.',
    },
    {
      id: 'check-defective-from-machine-y',
      title: 'Which machine made it?',
      topic: 'Conditional probability and Bayes',
      stemMd: md`Machine X makes 70% of a factory's items, and 2% of its items are defective. Machine Y makes the other 30%, and 6% of its items are defective. An item picked at random is defective. What is the probability that machine Y made it?`,
      options: [
        { id: 'A', text: md`$\frac{9}{500}$`, note: md`This is $0.3 \times 0.06 = 0.018$, the probability that a random item is both from Y and defective; it is not divided by the probability of being defective.` },
        { id: 'B', text: md`$\frac{3}{10}$`, note: md`This is Y's share of all output. It ignores the fact that the item is known to be defective, which makes Y more likely.` },
        { id: 'C', text: md`$\frac{9}{16}$`, note: '' },
        { id: 'D', text: md`$\frac{3}{4}$`, note: md`This is $\frac{6}{2 + 6}$, which compares only the defect rates and ignores that X makes more than twice as many items as Y.` },
      ],
      answer: 'C',
      workingMd: md`Take 1000 items. X makes 700, of which 14 are defective; Y makes 300, of which 18 are defective. Defective in all: 32. $P(Y \mid \text{defective}) = \frac{18}{32} = \frac{9}{16}$. Formula check: $\frac{0.018}{0.014 + 0.018} = \frac{18}{32}$.`,
      lesson: 'Weight each defect rate by its machine’s share of output before comparing them.',
    },
  ],
  takeaways: [
    md`$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$: the condition is the denominator.`,
    md`$P(A \mid B)$ and $P(B \mid A)$ are different numbers; name the group you are restricted to.`,
    'Total probability adds every path that ends in the event; Bayes divides one such path by their sum.',
    'Check every Bayes answer with a table of 1000 imagined cases.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-probability-conditional-bayes' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
