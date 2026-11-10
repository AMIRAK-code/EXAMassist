import { md, type Lesson } from '../../types';

export const linearEquationsLesson: Lesson = {
  slug: 'linear-equations-and-modelling',
  title: 'Linear equations and modelling',
  summary: 'Translate quantities into linear equations, preserve equality through each step, and interpret unique, absent or unlimited solutions.',
  minutes: 19,
  objectives: ['Solve linear equations while preserving equality.', 'Translate a cost or quantity relationship into a model.', 'Distinguish a unique solution from a contradiction or identity.'],
  teachMd: md`
### Give the unknown a meaning

An equation states that two expressions have the same value. Before moving symbols, decide what the unknown measures. If $x$ counts tickets, it is a non-negative whole number; if $x$ measures a distance, it may be any non-negative real number in the stated units. The algebra alone does not know that meaning. A solution can satisfy the equation while failing the situation. Write the definition beside your first equation so you can check it again at the end.

A linear expression contains the unknown only to the first power, multiplied by a constant and combined through addition or subtraction. A fixed charge plus an amount per item is a useful example: $C=7+3x$ means 7 units of money regardless of quantity and 3 more for every item. Reversing these roles produces a different model. Read a verbal statement one relationship at a time. “Five less than twice the quantity” gives $2x-5$, while “twice the quantity reduced by five” can be ambiguous unless the wording makes the grouping clear.

### Preserve the balance

To solve $3x+7=22$, subtract 7 from both sides, obtaining $3x=15$, then divide both sides by 3. Each operation preserves precisely the same set of solutions because it is reversible. Instead of imagining that a term jumps across the equality sign and changes sign, name the operation applied to both sides. That habit works equally well when terms occur on both sides, and it helps you avoid changing only half an equation.

Brackets describe a multiplication that applies to every term inside. Expanding $4(x-2)$ gives $4x-8$. The subtraction is part of the expression being multiplied. With a negative multiplier, expand slowly: $-2(3-x)=-6+2x$. You can test the expansion by substituting a small value such as $x=1$ into both forms. Matching at one value is a useful error check, although it does not prove two arbitrary expressions identical. The distributive law is the justification.

### Clear fractions without losing terms

Fractions often make a linear equation look more complicated than it is. In $x/3+2=x/6+5$, multiplying every term by 6 gives $2x+12=x+30$. It is essential to multiply the standalone constants too. You are multiplying the complete left and right expressions, not merely removing the visible denominators. Once the fractions are gone, collect the unknown terms on one side and the constants on the other.

When denominators contain only non-zero numbers, this multiplication does not restrict the unknown. When a denominator contains $x$, the problem is a rational equation and excluded values must be recorded first. Do not transfer the simple linear method without that extra step. Also distinguish an exact fractional answer from a rounded decimal. If a length is $17/6$, keep that fraction through any later calculation. Rounding it early can change a comparison or hide whether a proposed answer satisfies the original equation.

### Recognise what cancellation tells you

Not every linear-looking equation has one answer. In $2(x+3)=2x+6$, expansion leaves $6=6$. Every allowed value of $x$ works, because both sides describe the same expression. This is an identity. In $2(x+3)=2x+7$, expansion leaves $6=7$. No value works, because the difference between the two sides stays one regardless of $x$. This is a contradiction. The disappearance of the unknown is therefore meaningful evidence, not a reason to divide by zero or choose zero as the answer.

More generally, collect an equation into $ax=b$. If $a$ is non-zero, division gives the unique solution $x=b/a$. If both $a$ and $b$ are zero, every allowed value satisfies it. If $a=0$ and $b$ is non-zero, no solution exists. This classification also explains why a parameter problem needs cases: dividing by an expression that might be zero would silently discard the cases that need special treatment.

### Return to the situation

After solving a word problem, substitute into the original relationship and check units, sign and admissible values. A printing model may produce $x=12.5$ for the quantity where two costs coincide. That is a valid intersection of the cost lines, but if only whole batches can be ordered, no order of exactly that size exists. For a question about when one plan becomes cheaper, compare the allowed whole numbers on either side of the intersection. The equation locates the boundary; the wording determines what to do with it.

Finally, use a simple estimate to challenge your result. If a total charge is 40 and the fixed fee is already 10, a rate of 5 per item cannot yield 20 items. The remaining 30 supports about six. Such a check takes little time and tests the model as well as the arithmetic. Correct symbolic manipulation cannot repair an equation built from the wrong quantities.
`,
  examples: [
    { id: 'fractions', title: 'Clear both denominators', problemMd: md`Solve $\frac{x}{4}+3=\frac{x}{6}+5$.`, steps: [md`Multiply every term by 12: $3x+36=2x+60$.`, md`Subtract $2x+36$ from both sides: $x=24$.`, md`Check: $24/4+3=9$ and $24/6+5=9$.`], answerMd: '$x=24$. Multiplying only the fractional terms would give a different, non-equivalent equation.' },
    { id: 'costs', title: 'A meeting point of costs', problemMd: 'Delivery plan P costs 9 plus 2 per parcel; plan Q costs 3 plus 3 per parcel. For how many parcels do they cost the same?', steps: ['Let $x$ be the whole number of parcels. Equal costs mean $9+2x=3+3x$.', 'Subtract $2x+3$ to obtain $x=6$.', 'At six parcels, each plan costs 21 in the same money units.'], answerMd: 'They cost the same for 6 parcels. Equating only the per-parcel rates would discard the fixed charges.' },
    { id: 'contradiction', title: 'When the unknown disappears', problemMd: 'Solve $5(x-1)=5x+2$.', steps: ['Expand the bracket: $5x-5=5x+2$.', 'Subtract $5x$ from both sides to obtain $-5=2$, which is false for every value.'], answerMd: 'There is no solution. Cancellation does not make zero a solution.' },
  ],
  traps: [
    { title: 'Clearing only visible fractions', md: 'A multiplier applies to each entire side. Put brackets around each side before multiplying if the standalone terms are easy to miss.' },
    { title: 'Dividing by a possible zero', md: 'When the coefficient of the unknown depends on a parameter, examine the zero case before dividing. It may give no solutions or an identity.' },
    { title: 'Ignoring admissible quantities', md: 'A fractional number can solve an equation about whole objects. Return to the definition of the unknown before reporting a feasible quantity.' },
  ],
  check: [
    { id: 'check-1', title: 'Brackets and balance', topic: 'Mathematics', stemMd: 'Solve $3(2x-1)=4x+9$.', options: [
      { id: 'A', text: '$x=3$', note: 'This subtracts 3 from 9 instead of adding it after expansion.' },
      { id: 'B', text: '$x=4$', note: 'This comes from changing the expanded constant to positive 1.' },
      { id: 'C', text: '$x=5$', note: 'This treats the subtraction inside the bracket as an unmultiplied constant.' },
      { id: 'D', text: '$x=6$', note: '' },
      { id: 'E', text: '$x=12$', note: 'This finds $2x=12$ but does not divide by the coefficient.' },
    ], answer: 'D', workingMd: 'Expansion gives $6x-3=4x+9$. Subtract $4x$ and add 3: $2x=12$, so $x=6$. Substitution gives 33 on both sides.', lesson: 'Distribute before collecting unknown terms.' },
    { id: 'check-2', title: 'A cost model', topic: 'Mathematics', stemMd: 'A workshop charges 8 for registration and 4 for each session. A learner pays 36 in total. How many sessions are included?', options: [
      { id: 'A', text: '5', note: 'Five sessions cost 28 after including registration, below the stated total.' },
      { id: 'B', text: '7', note: '' },
      { id: 'C', text: '9', note: 'This divides the entire payment by 4 without removing registration.' },
      { id: 'D', text: '11', note: 'This adds the registration fee before dividing by 4.' },
      { id: 'E', text: '28', note: 'This removes registration but forgets the charge per session.' },
    ], answer: 'B', workingMd: 'With $x$ sessions, $8+4x=36$. Removing registration leaves $4x=28$, giving $x=7$. The check is $8+4(7)=36$.', lesson: 'Remove the fixed charge before dividing by a unit rate.' },
    { id: 'check-3', title: 'An identity', topic: 'Mathematics', stemMd: 'Over the real numbers, which statement describes the solutions of $4(x+2)-3=4x+5$?', options: [
      { id: 'A', text: 'Only $x=0$', note: 'Zero works, but substituting any other real value also preserves equality.' },
      { id: 'B', text: 'Only $x=5$', note: 'The final constant is not a value assigned to the unknown.' },
      { id: 'C', text: 'No real solution', note: 'Cancellation gives a true equality, not a contradiction.' },
      { id: 'D', text: 'Only $x=2$', note: 'The number inside the bracket does not determine the solution set.' },
      { id: 'E', text: 'Every real number', note: '' },
    ], answer: 'E', workingMd: 'The left side expands to $4x+8-3=4x+5$, identical to the right side. Subtracting $4x$ leaves $5=5$, so every real number satisfies the equation.', lesson: 'A true equality after cancellation indicates an identity.' },
  ],
  takeaways: ['Define the unknown and its allowed values.', 'Apply every balancing operation to both entire sides.', 'Cancellation can reveal an identity or a contradiction.', 'Substitute the result into the original situation.'],
  practice: { examKey: 'tolc-e', domain: 'tolce-mathematics', skill: 'tolce-math-equations' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
