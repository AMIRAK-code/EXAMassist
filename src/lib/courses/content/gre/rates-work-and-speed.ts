import { md, type Lesson } from '../../types';

export const ratesLesson: Lesson = {
  slug: 'rates-work-and-speed',
  title: 'Rates, work and speed',
  summary: 'Use amount = rate × time for distance and work, find true average speeds, add rates for joint work, and keep units straight.',
  minutes: 22,
  objectives: [
    'Set up distance and work problems from amount = rate × time.',
    'Find an average speed from total distance and total time, never by averaging speeds.',
    'Add rates for people or machines working together, and for objects closing or opening a gap.',
    'Convert between units of time and rate without losing a factor of 60.',
  ],
  teachMd: md`
### One equation behind every rate problem

A rate is an amount per unit of time: kilometres per hour, pages per minute, tanks per hour. Every rate problem uses the same relationship:

$$\text{amount} = \text{rate} \times \text{time}$$

For travel, the amount is distance and the rate is speed: $d = rt$. For work, the amount is the job (often "1 job") and the rate is the fraction of the job done per unit of time. Rearranged, $\text{rate} = \frac{\text{amount}}{\text{time}}$ and $\text{time} = \frac{\text{amount}}{\text{rate}}$.

A small table keeps multi-part problems tidy: one row per person, vehicle or leg, with columns for rate, time and amount. Fill in what you know, and use $d = rt$ along each row.

### Average speed is total distance over total time

$$\text{average speed} = \frac{\text{total distance}}{\text{total time}}$$

It is **not** the average of the speeds, unless equal **times** are spent at each speed. Drive 120 km at 60 km/h and 120 km back at 40 km/h: the trip takes $2 + 3 = 5$ hours for 240 km, so the average speed is 48 km/h, not 50. You spend longer at the slower speed, so the average leans towards it.

When the two legs cover equal distances, there is a shortcut: the average speed is $\frac{2ab}{a + b}$ for speeds $a$ and $b$. Here $\frac{2 \cdot 60 \cdot 40}{100} = 48$. But the total-over-total method works for every case, so it is the one to rely on.

### Work: add the rates, not the times

If a machine finishes a job in 4 hours, its rate is $\frac{1}{4}$ of the job per hour. Two machines working together add their **rates**:

$$\frac{1}{4} + \frac{1}{6} = \frac{3}{12} + \frac{2}{12} = \frac{5}{12} \text{ of the job per hour}$$

so together they need $\frac{12}{5} = 2.4$ hours. Times never add or average: the combined time must be **less than** the faster worker's time alone, because the slower one still helps. That sanity check rules out many wrong choices at a glance.

In general, for times $a$ and $b$ alone, the time together is $\frac{ab}{a + b}$. If one worker undoes the work (a drain emptying a tank that a pipe fills), subtract that rate.

If you know the combined time and one worker's time, subtract rates to find the other: together 6 hours and $A$ alone 10 hours means $B$'s rate is $\frac{1}{6} - \frac{1}{10} = \frac{1}{15}$, so $B$ alone takes 15 hours.

### Gaps: relative speed

When two objects move along the same line, think about the **gap** between them.

- Moving towards each other, or apart in opposite directions, the gap changes at the **sum** of the speeds.
- Moving in the same direction, the gap changes at the **difference** of the speeds.

Then $\text{time} = \frac{\text{gap to close or open}}{\text{rate of change of the gap}}$. A cyclist at 18 km/h chasing one at 12 km/h who has a 6 km lead closes the gap at 6 km/h, so she catches up in 1 hour.

### Units

Keep every quantity in one unit system before you combine. A speed in km/h and a time in minutes must be reconciled first: 40 minutes is $\frac{40}{60} = \frac{2}{3}$ hour. To convert a rate, multiply by fractions equal to 1:

$$72 \ \frac{\text{km}}{\text{h}} \times \frac{1000 \text{ m}}{1 \text{ km}} \times \frac{1 \text{ h}}{3600 \text{ s}} = 20 \ \frac{\text{m}}{\text{s}}$$

Unwanted units cancel, which tells you whether to multiply or divide. Read the question's unit last of all: if it asks for minutes and you have hours, convert before you choose.

### Machines and people at the same rate

If identical machines work at the same rate, the work done is proportional to (number of machines) $\times$ (time). If 5 machines make 300 parts in 4 hours, one machine makes $\frac{300}{5 \cdot 4} = 15$ parts per hour, and 8 machines make $8 \cdot 15 \cdot 6 = 720$ parts in 6 hours. Find the rate of a single unit first; every variant of the question then follows.
`,
  examples: [
    {
      id: 'example-round-trip',
      title: 'Average speed of a round trip',
      problemMd: md`A driver travels 120 km at 60 km/h, then returns along the same road at 40 km/h. What is the average speed for the whole trip?`,
      steps: [
        md`Find each time: out $\frac{120}{60} = 2$ hours, back $\frac{120}{40} = 3$ hours.`,
        md`Total distance 240 km, total time 5 hours.`,
        md`Average speed $= \frac{240}{5} = 48$ km/h.`,
        md`Check with the equal-distance shortcut: $\frac{2 \cdot 60 \cdot 40}{60 + 40} = \frac{4800}{100} = 48$.`,
      ],
      answerMd: md`48 km/h. The tempting answer, 50 km/h, averages the speeds as if equal times had been spent at each.`,
    },
    {
      id: 'example-two-pipes',
      title: 'Two pipes fill a tank',
      problemMd: md`Pipe $A$ alone fills a tank in 4 hours, and pipe $B$ alone fills it in 6 hours. How long do they take together?`,
      steps: [
        md`Rates: $A$ fills $\frac{1}{4}$ of the tank per hour, $B$ fills $\frac{1}{6}$.`,
        md`Together: $\frac{1}{4} + \frac{1}{6} = \frac{5}{12}$ of the tank per hour.`,
        md`Time $= \frac{1}{5/12} = \frac{12}{5} = 2.4$ hours, which is 2 hours 24 minutes.`,
        md`Check: in 2.4 hours $A$ fills $\frac{2.4}{4} = 0.6$ and $B$ fills $\frac{2.4}{6} = 0.4$ of the tank, a total of 1.`,
      ],
      answerMd: md`2.4 hours (2 hours 24 minutes). Averaging the times to 5 hours is impossible: together they must be faster than $A$ alone.`,
    },
    {
      id: 'example-catch-up',
      title: 'Catching up',
      problemMd: md`A cyclist leaves a town riding at 12 km/h. Thirty minutes later a second cyclist leaves the same town along the same road at 18 km/h. How long after she sets off does the second cyclist catch the first?`,
      steps: [
        md`In the 30-minute head start, the first cyclist covers $12 \times \frac{1}{2} = 6$ km.`,
        md`Both ride in the same direction, so the gap closes at $18 - 12 = 6$ km/h.`,
        md`Time to close a 6 km gap: $\frac{6}{6} = 1$ hour.`,
        md`Check: in that hour the second cyclist rides 18 km; the first has ridden for 1.5 hours, $12 \times 1.5 = 18$ km. They are level.`,
      ],
      answerMd: md`One hour after the second cyclist sets off. Using the sum of the speeds, 30 km/h, would give 12 minutes, which is right only for riders heading towards each other.`,
    },
    {
      id: 'example-missing-worker',
      title: 'Finding one worker from the team',
      problemMd: md`Working together, Ana and Ben paint a fence in 6 hours. Ana alone would take 10 hours. How long would Ben take alone?`,
      steps: [
        md`Team rate: $\frac{1}{6}$ of the fence per hour. Ana's rate: $\frac{1}{10}$.`,
        md`Ben's rate is the difference: $\frac{1}{6} - \frac{1}{10} = \frac{5}{30} - \frac{3}{30} = \frac{2}{30} = \frac{1}{15}$.`,
        md`So Ben alone takes 15 hours.`,
        md`Check by adding back: $\frac{1}{10} + \frac{1}{15} = \frac{3}{30} + \frac{2}{30} = \frac{1}{6}$.`,
      ],
      answerMd: md`Ben takes 15 hours. Subtracting the times, $10 - 6 = 4$ hours, would make Ben faster than the whole team, which cannot be.`,
    },
  ],
  traps: [
    {
      title: 'Averaging the speeds',
      md: md`Equal distances at different speeds do not take equal times, so the plain average of the speeds is wrong. Always divide total distance by total time. The true average is below the plain average whenever the distances are equal and the speeds differ.`,
    },
    {
      title: 'Adding or averaging times for joint work',
      md: md`Two workers who take 4 and 6 hours do not take 5 or 10 hours together. Add the rates, $\frac{1}{4} + \frac{1}{6}$, and invert. The joint time is always less than the faster worker's time.`,
    },
    {
      title: 'Mixing minutes and hours',
      md: md`A speed in km/h times a time in minutes gives nonsense. Convert first: 45 minutes is 0.75 hour, not 0.45 hour. Then check the unit the answer asks for.`,
    },
    {
      title: 'Using the wrong relative speed',
      md: md`Towards each other or apart: add the speeds. Same direction: subtract. Sketch the two arrows before you choose.`,
    },
  ],
  check: [
    {
      id: 'check-runner-average',
      title: 'A runner slows down',
      topic: 'Rate',
      stemMd: md`A runner covers the first 6 km of a route at 12 km/h and the next 6 km at 8 km/h. What is her average speed, in kilometres per hour, for the 12 km?`,
      options: [
        { id: 'A', text: md`4.8`, note: md`This divides the distance of one leg, 6 km, by the total time; the average uses the total distance of 12 km.` },
        { id: 'B', text: md`9.6`, note: '' },
        { id: 'C', text: md`10`, note: md`This averages the two speeds; the runner spends longer at 8 km/h, so the true average is lower.` },
        { id: 'D', text: md`15`, note: md`This multiplies the 12 km by the total time of 1.25 hours instead of dividing by it.` },
        { id: 'E', text: md`20`, note: md`This adds the two speeds; speeds on consecutive legs never add.` },
      ],
      answer: 'B',
      workingMd: md`Times: $\frac{6}{12} = 0.5$ hour and $\frac{6}{8} = 0.75$ hour, so 1.25 hours in all. Average speed $= \frac{12}{1.25} = 9.6$ km/h. Check with the equal-distance formula: $\frac{2 \cdot 12 \cdot 8}{12 + 8} = \frac{192}{20} = 9.6$.`,
      lesson: 'Average speed is total distance divided by total time.',
    },
    {
      id: 'check-two-pumps',
      title: 'Two pumps together',
      topic: 'Quantitative Comparison',
      stemMd: md`Working alone at its constant rate, pump $P$ empties a tank in 3 hours. Working alone at its constant rate, pump $Q$ empties the same tank in 5 hours.

| Quantity A | Quantity B |
| --- | --- |
| The number of hours $P$ and $Q$ take to empty the tank working together | 2 |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: md`This averages the two times to 4 hours; the joint time must be less than the faster pump's 3 hours.` },
        { id: 'B', text: md`Quantity B is greater.`, note: '' },
        { id: 'C', text: md`The two quantities are equal.`, note: md`This halves the average time, 4 hours, as if two identical pumps were working; the pumps have different rates.` },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`Both rates are constant and given, so the joint time is one definite number.` },
      ],
      answer: 'B',
      workingMd: md`Rates: $\frac{1}{3}$ and $\frac{1}{5}$ of the tank per hour, together $\frac{5}{15} + \frac{3}{15} = \frac{8}{15}$. The joint time is $\frac{15}{8} = 1.875$ hours, which is less than 2. Check: in 1.875 hours $P$ empties $0.625$ of the tank and $Q$ empties $0.375$; the total is 1.`,
      lesson: 'Add the rates and invert; the joint time is shorter than the faster worker alone.',
    },
    {
      id: 'check-opposite-directions',
      title: 'Driving apart',
      topic: 'Rate',
      stemMd: md`Two cars leave the same point at the same time and drive in opposite directions along a straight road, one at 55 km/h and the other at 65 km/h. After how many minutes will they be 300 km apart?`,
      options: [
        { id: 'A', text: md`2.5`, note: md`This is the time in hours; the question asks for minutes.` },
        { id: 'B', text: md`24`, note: md`This divides the combined speed by the distance, $\frac{120}{300} = 0.4$ hour, which inverts the time formula.` },
        { id: 'C', text: md`150`, note: '' },
        { id: 'D', text: md`250`, note: md`This finds 2.5 hours but converts it as if an hour had 100 minutes.` },
        { id: 'E', text: md`1,800`, note: md`This uses the difference of the speeds, 10 km/h, which applies only to cars moving in the same direction.` },
      ],
      answer: 'C',
      workingMd: md`Moving in opposite directions, the gap grows at $55 + 65 = 120$ km/h. Time $= \frac{300}{120} = 2.5$ hours $= 2.5 \times 60 = 150$ minutes. Check: in 2.5 hours the cars cover $137.5$ km and $162.5$ km, a total of 300 km.`,
      lesson: 'Find the rate at which the gap changes, divide, and convert to the unit the question asks for.',
    },
  ],
  takeaways: [
    'Amount = rate × time, for distance and for work alike.',
    'Average speed is total distance over total time, never the average of the speeds.',
    'For joint work, add the rates and invert; the joint time is less than the fastest worker alone.',
    'Opposite directions: add speeds. Same direction: subtract them.',
    'Convert to one unit before combining, and answer in the unit asked for.',
  ],
  practice: { examKey: 'gre', domain: 'quant-arithmetic', skill: 'arith-rate' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
