import { md, type Lesson } from '../../types';

export const ratesWorkAndMixturesLesson: Lesson = {
  slug: 'rates-work-and-mixtures',
  title: 'Rates, work and mixtures',
  summary: 'Use one rate equation for speed, work and flow: find true average speeds, combine work rates, and solve mixtures as weighted averages.',
  minutes: 22,
  objectives: [
    'Apply amount = rate × time to travel, work and filling problems, with consistent units.',
    'Find an average speed from total distance and total time, and combine or oppose rates.',
    'Solve mixture and blend problems as weighted averages, by equation or by the balance method.',
  ],
  teachMd: md`
### One equation behind three topics

Speed, work and flow problems all rest on the same relation:
$$\text{amount} = \text{rate} \times \text{time}.$$
For travel, the amount is distance and the rate is speed. For work, the amount is the number of jobs (often 1) and the rate is jobs per hour. For pipes, the amount is tanks or litres. Once you see which is which, the problem becomes a line or two of arithmetic.

**Units first.** Rates and times must match: km/h with hours, metres per second with seconds. Twenty minutes is $\frac{1}{3}$ of an hour, not 0.2. To turn km/h into m/s, multiply by $\frac{1000}{3600} = \frac{5}{18}$: 72 km/h is $72 \times \frac{5}{18} = 20$ m/s.

### Average speed is not the average of the speeds

$$\text{average speed} = \frac{\text{total distance}}{\text{total time}}.$$
Drive 60 km at 30 km/h and another 60 km at 60 km/h. The first leg takes 2 hours and the second 1 hour, so the whole trip is 120 km in 3 hours: an average of 40 km/h, not 45. The slower leg lasts longer, so it pulls the average towards itself. Only when the two legs take **equal times** does the simple mean of the speeds give the average speed.

For two legs of equal distance at speeds $u$ and $v$, the average speed is $\frac{2uv}{u + v}$; here $\frac{2 \times 30 \times 60}{90} = 40$. It is quicker, though, to pick a convenient distance and compute times.

### Moving towards or apart

Two objects moving towards each other close the gap at the **sum** of their speeds; one chasing another closes it at the **difference**. Two trains 300 km apart, heading towards each other at 70 km/h and 80 km/h, close the gap at 150 km/h and meet after $\frac{300}{150} = 2$ hours.

### Work: add rates, never times

If Ana paints a room in 4 hours, her rate is $\frac{1}{4}$ room per hour. If Ben takes 6 hours, his rate is $\frac{1}{6}$. Working together, their **rates add**:
$$\frac{1}{4} + \frac{1}{6} = \frac{3}{12} + \frac{2}{12} = \frac{5}{12} \text{ room per hour},$$
so together they need $\frac{12}{5} = 2.4$ hours, which is 2 hours 24 minutes. Sanity check: the answer must be less than the faster worker's time alone, 4 hours, and more than half of it. A pipe that drains a tank counts as a negative rate.

The same idea gives a quick formula for two workers: together they take $\frac{ab}{a + b}$, here $\frac{4 \times 6}{10} = 2.4$ hours.

### Mixtures are weighted averages

When you mix two solutions, the amount of the ingredient you care about (salt, alcohol, money) adds up, even though concentrations do not. Mix 30 litres at 20% salt with $x$ litres at 50% salt to get a 30% mixture:
$$0.2 \times 30 + 0.5x = 0.3(30 + x) \;\Longrightarrow\; 6 + 0.5x = 9 + 0.3x \;\Longrightarrow\; x = 15.$$

The **balance method** reaches the same answer without an equation. The target, 30%, sits 10 points above the weaker solution and 20 points below the stronger one. The amounts must be in the inverse ratio of those distances: weak to strong $= 20 : 10 = 2 : 1$. With 30 litres of the weak solution, you need 15 litres of the strong one. Check: salt $6 + 7.5 = 13.5$ litres in 45 litres, which is $\frac{13.5}{45} = 30\%$.

The method works for any blend: coffee at two prices, two classes with different average marks, two investments with different returns. The mixture always lies between its ingredients, and it lies **closer to the one there is more of**.

### A routine for any rate problem

1. Write the rate of each participant in the same units.
2. Decide whether the rates add (together, towards each other) or subtract (against each other, chasing, draining).
3. Use $\text{amount} = \text{rate} \times \text{time}$ once, for the combined rate.
4. Check the answer's size: together is faster than either alone; an average lies between its parts.
`,
  examples: [
    {
      id: 'example-average-speed',
      title: 'A trip with two speeds',
      problemMd: md`A car travels 60 km at 30 km/h and then another 60 km at 60 km/h. What is its average speed for the whole trip?`,
      steps: [
        md`Find each time: $\frac{60}{30} = 2$ hours and $\frac{60}{60} = 1$ hour.`,
        md`Total distance 120 km, total time 3 hours.`,
        md`Average speed $= \frac{120}{3} = 40$ km/h.`,
        md`Check with the equal-distance formula: $\frac{2 \times 30 \times 60}{30 + 60} = \frac{3600}{90} = 40$.`,
      ],
      answerMd: md`40 km/h. The mean of the speeds, 45 km/h, is the tempting wrong answer; it would be right only if the car spent equal time at each speed.`,
    },
    {
      id: 'example-work-together',
      title: 'Two painters together',
      problemMd: md`Ana can paint a room in 4 hours and Ben can paint it in 6 hours. How long do they take working together?`,
      steps: [
        md`Rates: Ana $\frac{1}{4}$ and Ben $\frac{1}{6}$ of the room per hour.`,
        md`Together: $\frac{1}{4} + \frac{1}{6} = \frac{5}{12}$ of the room per hour.`,
        md`Time for one room: $1 \div \frac{5}{12} = \frac{12}{5} = 2.4$ hours, which is 2 hours 24 minutes.`,
        md`Check: in 2.4 hours Ana paints $\frac{2.4}{4} = 0.6$ of the room and Ben $\frac{2.4}{6} = 0.4$, which add to 1.`,
      ],
      answerMd: md`2 hours 24 minutes. Averaging the times (5 hours) or adding them (10 hours) gives an answer longer than Ana alone, which cannot be right for two people working together.`,
    },
    {
      id: 'example-salt-mixture',
      title: 'Strengthening a salt solution',
      problemMd: md`How many litres of a 50% salt solution must be added to 30 litres of a 20% salt solution to make a 30% solution?`,
      steps: [
        md`Salt is conserved: $0.2 \times 30 + 0.5x = 0.3(30 + x)$.`,
        md`Simplify: $6 + 0.5x = 9 + 0.3x$, so $0.2x = 3$ and $x = 15$.`,
        md`Balance check: 30% is 10 points from 20% and 20 points from 50%, so weak : strong $= 20 : 10 = 2 : 1$, and 30 litres of weak needs 15 litres of strong.`,
        md`Final check: $6 + 7.5 = 13.5$ litres of salt in 45 litres, and $\frac{13.5}{45} = 0.3$.`,
      ],
      answerMd: md`15 litres. Setting the ratio the wrong way round ($1 : 2$) gives 60 litres and a mixture of 40%, too strong.`,
    },
  ],
  traps: [
    {
      title: 'Averaging speeds',
      md: md`The mean of two speeds is the average speed only when equal **times** are spent at each. For equal distances, the slower leg takes longer and drags the average below the mean. Always divide total distance by total time.`,
    },
    {
      title: 'Adding times instead of rates',
      md: md`Two workers who take 4 and 6 hours alone do not take 10 hours, or 5, together. Convert each to a rate, add the rates, then invert. The combined time must be shorter than the faster worker's.`,
    },
    {
      title: 'Mixed units',
      md: md`A speed in km/h with a time in minutes gives nonsense. Convert before computing: 45 minutes is 0.75 hours, and 90 km/h is 25 m/s.`,
    },
    {
      title: 'Averaging concentrations',
      md: md`Mixing a 20% and a 50% solution gives 35% only if the amounts are equal. With unequal amounts, the result lies closer to the larger amount; weight by quantity, or use the balance method.`,
    },
  ],
  check: [
    {
      id: 'check-uphill-downhill',
      title: 'Uphill and back',
      topic: 'Quantitative reasoning: rates',
      stemMd: md`A cyclist rides 12 km uphill at 8 km/h and returns the same 12 km downhill at 24 km/h. What is the average speed for the whole ride?`,
      options: [
        { id: 'A', text: md`6 km/h`, note: md`Divides one leg's distance, 12 km, by the total time of 2 hours; the ride covers 24 km.` },
        { id: 'B', text: md`12 km/h`, note: '' },
        { id: 'C', text: md`16 km/h`, note: md`The mean of 8 and 24; the cyclist spends three times as long going up, so the average is pulled towards 8.` },
        { id: 'D', text: md`24 km/h`, note: md`24 is the downhill speed, and also the total distance in kilometres; neither is the average speed.` },
      ],
      answer: 'B',
      workingMd: md`Uphill takes $\frac{12}{8} = 1.5$ hours and downhill $\frac{12}{24} = 0.5$ hours, 2 hours in all. Average speed $= \frac{24}{2} = 12$ km/h. Check: $\frac{2 \times 8 \times 24}{8 + 24} = \frac{384}{32} = 12$.`,
      lesson: 'Average speed is total distance over total time, never the mean of the speeds unless the times are equal.',
    },
    {
      id: 'check-fill-and-drain',
      title: 'Filling while draining',
      topic: 'Quantitative reasoning: rates',
      stemMd: md`Pipe A fills an empty tank in 3 hours. Pipe B empties a full tank in 5 hours. If both pipes are opened when the tank is empty, how long does the tank take to fill?`,
      options: [
        { id: 'A', text: md`$1\frac{7}{8}$ hours`, note: md`Adds the two rates, $\frac{1}{3} + \frac{1}{5}$, as if B were also filling; B drains, so its rate is subtracted.` },
        { id: 'B', text: md`2 hours`, note: md`Subtracts the times, $5 - 3$; times do not combine like this, only rates do.` },
        { id: 'C', text: md`$7\frac{1}{2}$ hours`, note: '' },
        { id: 'D', text: md`8 hours`, note: md`Adds the two times, $3 + 5$; this has no meaning for pipes working at the same time.` },
      ],
      answer: 'C',
      workingMd: md`Net rate: $\frac{1}{3} - \frac{1}{5} = \frac{5 - 3}{15} = \frac{2}{15}$ of the tank per hour. Time to fill one tank: $\frac{15}{2} = 7\frac{1}{2}$ hours. Check: in 7.5 hours A puts in $\frac{7.5}{3} = 2.5$ tanks and B removes $\frac{7.5}{5} = 1.5$, leaving 1 tank.`,
      lesson: 'Convert each pipe or worker to a rate, add or subtract the rates, then divide the job by the net rate.',
    },
    {
      id: 'check-coffee-blend',
      title: 'Blending two coffees',
      topic: 'Quantitative reasoning: mixtures',
      stemMd: md`A roaster blends coffee costing €12 per kg with coffee costing €18 per kg to make 30 kg of a blend worth €14 per kg. How many kilograms of the €18 coffee does it use?`,
      options: [
        { id: 'A', text: md`10`, note: '' },
        { id: 'B', text: md`15`, note: md`Uses equal amounts of each; that blend would be worth €15 per kg, not €14.` },
        { id: 'C', text: md`20`, note: md`This is the amount of the €12 coffee; it comes from setting the balance ratio the wrong way round.` },
        { id: 'D', text: md`$23\frac{1}{3}$`, note: md`Divides the blend's total value, €420, by €18, as if all of it were spent on the dearer coffee.` },
      ],
      answer: 'A',
      workingMd: md`Let $d$ be kg of the €18 coffee, so $30 - d$ kg is the €12 coffee. Value: $12(30 - d) + 18d = 14 \times 30 = 420$, so $360 + 6d = 420$ and $d = 10$. Balance check: €14 is 2 from €12 and 4 from €18, so cheap : dear $= 4 : 2 = 2 : 1$, giving 20 kg and 10 kg.`,
      lesson: 'A blend lies closer to the ingredient there is more of; the amounts are in the inverse ratio of the distances to the target.',
    },
  ],
  takeaways: [
    md`Every rate problem is $\text{amount} = \text{rate} \times \text{time}$, with matching units.`,
    'Average speed is total distance divided by total time.',
    'Work and flow rates add (or subtract for draining); times never do.',
    'A mixture is a weighted average: amounts are in the inverse ratio of the distances to the target.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-algebra-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
