import { md, type Lesson } from '../../types';
import { check, example } from './shared';

export const countingLesson: Lesson = {
  slug: 'factorials-combinations-and-probability', title: 'Factorials, combinations and probability',
  summary: 'Decide whether order and replacement matter, count arrangements and selections, and turn equally likely outcomes into probabilities.',
  minutes: 19, objectives: ['Apply the product rule and factorial notation.', 'Distinguish ordered arrangements from unordered selections.', 'Use counted outcomes to calculate a probability.'],
  teachMd: md`
### Define one outcome before counting

A counting problem begins with a description of a single outcome. A list of prize winners in first, second and third place is ordered: swapping first and third produces a different result. A committee of three people is normally unordered: listing the same members in another order does not create a new committee. Write one concrete outcome and swap two entries. If the result changes the object the problem asks for, order matters. This test prevents applying a remembered formula to the wrong situation.

Also decide whether an item can be reused. A code made from digits may allow repetition, while choosing distinct people for roles normally does not. Replacement and order are separate questions. A process can be ordered with or without replacement. Avoid assuming that the number of choices decreases at each stage simply because several stages occur. It decreases only when an earlier choice removes possibilities or another stated restriction changes the available set.

### Multiply successive choices

The product rule counts a process with successive stages by multiplying the number of choices available at each stage. Three shirt choices and two trouser choices give six outfits when every shirt can be paired with every pair of trousers. If a restriction removes one specific pairing, count the allowed combinations directly or subtract that forbidden pairing from the unrestricted six. Multiplication is justified by the stage structure, not by the mere presence of two numbers in a question.

For distinct objects arranged without replacement, the choices decrease. Arranging all n distinct objects gives n factorial, written n!, equal to the product of the integers from n down to one. By convention, zero factorial equals one. There is one empty arrangement when no objects need to be placed, which also keeps the usual counting formulas consistent. A factorial is a compact notation for a product, not a rule to multiply the number by itself repeatedly.

Choosing r distinct objects from n for ordered roles gives n! divided by (n−r)!. It represents the product of the r decreasing choice counts. For example, two different roles filled from five candidates give five times four outcomes. The unused three candidates have no internal ordering in the outcome, so there is no reason to keep multiplying by three, two and one after both roles have been assigned.

### Remove the order that the question does not distinguish

For an unordered selection of r objects, each selected group has been counted r! times by the ordered calculation. Divide by r! to remove those repeats. The resulting binomial coefficient is written $\binom{n}{r}=n!/[r!(n-r)!]$. A selection of two from five therefore gives twenty ordered pairs divided by two, or ten distinct pairs. The division is justified because each pair appears exactly twice in the ordered list.

Choosing r objects to include is equivalent to choosing n−r objects to leave out, so the two binomial coefficients are equal. This gives a useful check. Selecting four committee members from six should give the same count as selecting the two people excluded. For small values, listing the excluded pairs may be easier than expanding factorials. Cancel factors before multiplying so the arithmetic stays manageable on paper.

### Convert counts into a probability only when justified

For equally likely outcomes, probability is the number of favourable outcomes divided by the total number. Use the same definition of outcome in both counts. If the denominator counts ordered draws but the numerator counts unordered groups, the ratio is inconsistent. You can use either representation when it is valid, but the ordering convention must match. With non-uniform outcomes, counting alone is insufficient; probabilities must reflect the different chances.

For sampling without replacement, successive event probabilities change. The chance of drawing two red objects can be calculated by multiplying the initial red fraction by the red fraction remaining after a red draw. Alternatively, count red pairs and divide by all pairs. Agreement between these methods is a strong check on both the arithmetic and the outcome model. Finally ensure that the probability lies between zero and one and that every counted favourable outcome is also included in the denominator.
`,
  examples: [example('roles', 'Assigning two roles', 'Five people can fill a chair role and a secretary role. Nobody can hold both. How many assignments are possible?', ['There are five choices for chair.', 'Once the chair is chosen, four different people remain for secretary.'], 'There are 5 × 4 = 20 assignments; exchanging roles changes an outcome.'), example('red', 'Counting and multiplying probabilities', 'A bag has three red and two blue counters. Two are selected uniformly without replacement. Find the probability that both are red.', ['There are ten unordered pairs in total and three pairs containing only red counters.', 'Alternatively, multiply 3/5 by 2/4 to obtain 6/20.'], 'The probability is 3/10 by either method.')],
  traps: [{ title: 'Dividing by a factorial when roles differ', md: 'A chair and a secretary are distinct roles. Swapping them changes the outcome, so do not divide those assignments by two.' }, { title: 'Keeping the original denominator after a draw', md: 'Without replacement, both the total supply and the relevant colour supply can change. Write the second fraction from the remaining bag.' }],
  check: [
    check('check-factorial', 'Combinatorics', 'How many orders can arrange four distinct books on a shelf?', [['4', 'This counts a choice for just one position.'], ['16', 'This multiplies four choices by four, filling only two positions and allowing a book to be reused.'], ['24', ''], ['12', 'This divides by two although reverse orders remain distinct.'], ['6', 'This counts unordered pairs rather than complete arrangements.']], 'C', 'There are four choices for the first position, then three, two and one. Their product is 24.', 'For a complete arrangement of distinct objects, multiply decreasing position counts.'),
    check('check-committee', 'Binomial coefficients', 'How many unordered groups of three can be selected from six distinct people?', [['120', 'This counts ordered selections and repeats each group six times.'], ['20', ''], ['18', 'Multiplying six by three does not account for a complete selection process.'], ['6', 'This counts individual people rather than three-person groups.'], ['15', 'This is the number of two-person groups from six, not three-person groups.']], 'B', 'The ordered count is 6 × 5 × 4 = 120. Divide by 3! = 6 to obtain twenty groups.', 'Divide out exactly the orders the final object does not distinguish.'),
    check('check-probability', 'Probability without replacement', 'A bag has four green and two yellow counters. Two are drawn uniformly without replacement. What is the probability both are green?', [['4/9', 'This repeats the first-draw probability as though the counter were replaced.'], ['2/3', 'This gives the probability of only the first green draw.'], ['1/3', 'This uses the first-draw yellow probability, two out of six, instead of the two-green event.'], ['2/5', ''], ['1/5', 'This halves the correct probability without a corresponding outcome restriction.']], 'D', 'The first green probability is 4/6 and the second, given green first, is 3/5. Their product is 12/30 = 2/5.', 'Update the sample after each draw without replacement.'),
  ], takeaways: ['Define whether outcomes are ordered and whether reuse is allowed.', 'Factorials count complete arrangements of distinct objects.', 'Binomial coefficients count unordered selections.', 'Probability counts require equally likely and consistently defined outcomes.'],
  practice: { examKey: 'tolc-f', domain: 'tolcf-mathematics', skill: 'tolcf-math-probability' }, review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
