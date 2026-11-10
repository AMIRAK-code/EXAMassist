import { md, type Lesson } from '../../types';

export const weightedMeansAndProbabilityLesson: Lesson = {
  slug: 'weighted-means-and-probability',
  title: "Weighted means, medians and probability",
  summary: "Combine group means using group sizes, find a median from frequencies and distinguish overlapping, independent and mutually exclusive events.",
  minutes: 20,
  objectives: [
    "Recover totals from group sizes and means.",
    "Locate the median in a frequency table.",
    "Calculate the chance of at least one of two events.",
  ],
  teachMd: md`
### Give each observation one vote

Ten students have a mean score of 28. Another thirty students have a mean of 20. Before doing any arithmetic, mark 20 and 28 on a number line. Which end should the combined mean lie nearer? Three quarters of the people come from the second group. Giving the two group means an equal say would make one person in the small group count as much as three people in the large group.

A weighted mean (*media ponderata*) keeps track of how many observations each number represents. Multiply each mean by its group size to recover the sum of that group's scores. Combining the groups combines those sums. Divide the resulting total by the number of people who contributed to it. You can do this even when nobody's individual score is known. The information lost in taking a mean does matter for some questions, but the total survives as long as you know the count.

Here there is also a short mental route. Give everyone 20 points provisionally. The ten students in the first group contribute an extra eight points each on average. Sharing their eighty extra points across forty people adds two points per person. The combined mean is 22, one quarter of the way from 20 to 28. This difference method is especially convenient when all the numbers in a table share a large common starting value.

### Locate the middle observation

The median (*mediana*) uses position. Order the observations from smallest to largest. In a list of nine entries, four lie on either side of the fifth position, so read the fifth entry. For ten entries the centre lies halfway between positions five and six. Average the **values** at those positions. If they coincide, their average is that same value.

A frequency table stores a sorted list in compressed form. Suppose two seedlings have three leaves, four have five leaves and three have eight leaves. The first two positions carry the value three. Positions three through six carry five, and the remaining three carry eight. Position five therefore gives a median of five leaves. The group means in the student problem tell us too little to reconstruct this sort of ranking. Different lists of individual marks can give exactly the same total.

### Count outcomes once

For a finite experiment with equally likely outcomes, divide the number that satisfy the event by the number possible. On a fair six-sided die the event “two or odd” includes four faces. The face showing two cannot also show an odd number, so the two lists can be added directly. Events which cannot occur together are called mutually exclusive (*incompatibili*).

Change the first event to “prime”. The primes on this die are two, three and five. Two of them are also odd. Adding the sizes of the prime and odd lists would count three twice and five twice. Remove one copy of each repeated outcome. In symbols the inclusive “or” has probability $P(A\cup B)=P(A)+P(B)-P(A\cap B)$. This identity also holds when outcomes have unequal chances. In that case use their probabilities rather than counting them as though each had the same weight.

### Decide where a product belongs

Events are independent (*indipendenti*) when knowing that one occurred leaves the probability of the other unchanged. For independent events the chance of both is the product of their separate probabilities. For instance, spin a fair two-colour spinner and independently roll the die. Each spinner result can occur alongside every die result. The chance of red and an odd number is half of one half.

To find the chance of at least one success, you can count the single case in which both events fail and subtract its probability from one. With independent trials you may multiply their failure probabilities. With dependent events you need the chance of the second failure given the first, or an explicit list of possible outcomes. As a final check, a union must be at least as probable as either event alone.
`,
  examples: [
    {
      id: 'two-pay-bands',
      title: "Pooling two pay bands",
      problemMd: "Twenty people each earn €2,000 a month and five each earn €3,000. Find the average monthly pay across all twenty-five.",
      steps: [
        "Recover the two monthly totals, €40,000 and €15,000.",
        "Share €55,000 among 25 people, or start at €2,000 and add one fifth of the €1,000 difference.",
      ],
      answerMd: "The average is €2,200. Averaging the two pay levels directly would give €2,500.",
    },
    {
      id: 'die-faces',
      title: "Changing one event on a die",
      problemMd: "On a fair six-sided die, compare the probability of rolling two or odd with the probability of rolling prime or odd.",
      steps: [
        "The odd faces are 1, 3 and 5. Adding the distinct face 2 gives four favourable outcomes.",
        "The primes are 2, 3 and 5. Adding their count to the odd count gives six entries, including duplicate entries for 3 and 5.",
        "Remove both duplicate entries to leave four distinct faces again.",
      ],
      answerMd: md`Both probabilities equal $4/6=2/3$, although only the first pair of events is mutually exclusive.`,
    },
  ],
  traps: [
    { title: "Weighting the labels", md: "Counting each row once makes a row of thirty people contribute the same as a row of ten. Write the number of observations beside every mean." },
    { title: "Assuming independence from overlap", md: "An overlap shows that events can happen together. Compare its actual probability with the product before claiming independence." },
  ],
  check: [
    {
      id: 'pooled-length',
      title: "Mean length",
      topic: "Probability and statistics",
      stemMd: "Four cords average 12 cm in length and twelve others average 20 cm. What is the mean length across all sixteen?",
      options: [
        { id: 'A', text: "14 cm", note: "This assigns the larger weight to the shorter group." },
        { id: 'B', text: "16 cm", note: "This gives each group equal weight." },
        { id: 'C', text: "18 cm", note: "" },
        { id: 'D', text: "20 cm", note: "This counts only the group with twelve cords." },
        { id: 'E', text: "32 cm", note: "This adds the two means without accounting for group sizes." },
      ],
      answer: 'C',
      workingMd: "The cords total 48 + 240 = 288 cm. Dividing by 16 gives 18 cm.",
      lesson: "Weight a group mean by the number of observations behind it.",
    },
    {
      id: 'median-jars',
      title: "Middle jar values",
      topic: "Probability and statistics",
      stemMd: "Ten jars contain buttons. Four hold 2 each, one holds 6 and five hold 8 each. What is the median number?",
      options: [
        { id: 'A', text: "5", note: "This averages the two extreme values." },
        { id: 'B', text: "5.4", note: "This divides the total number of buttons by ten to find the mean." },
        { id: 'C', text: "6", note: "This reads only the fifth jar." },
        { id: 'D', text: "7", note: "" },
        { id: 'E', text: "8", note: "This reads only the sixth jar." },
      ],
      answer: 'D',
      workingMd: "The fifth jar holds 6 and the sixth holds 8. Their average is 7.",
      lesson: "For an even count, locate both central observations.",
    },
    {
      id: 'signal-lamps',
      title: "At least one light",
      topic: "Probability and statistics",
      stemMd: md`Two independent lamps flash on a trial with probabilities $1/2$ and $2/5$. What is the probability that at least one flashes?`,
      options: [
        { id: 'A', text: md`$1/5$`, note: "This is the probability of both flashes." },
        { id: 'B', text: md`$3/10$`, note: "This is the probability of neither flash." },
        { id: 'C', text: md`$1/2$`, note: "This counts only trials with the first lamp flashing." },
        { id: 'D', text: md`$7/10$`, note: "" },
        { id: 'E', text: md`$9/10$`, note: "This adds the probabilities without removing their overlap." },
      ],
      answer: 'D',
      workingMd: md`The overlap is $(1/2)(2/5)=1/5$. The union is $1/2+2/5-1/5=7/10$.`,
      lesson: "Subtract the overlap once when counting an inclusive union.",
    },
  ],
  takeaways: [
    "Recover a group total by multiplying its mean by its count.",
    "Read the median from positions in sorted order.",
    "Independence gives a product for the overlap.",
    "Mutually exclusive events have zero overlap.",
  ],
  practice: { examKey: 'tolc-i', domain: 'tolci-mathematics', skill: 'tolci-math-probability' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
