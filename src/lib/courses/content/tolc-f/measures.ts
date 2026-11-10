import { md, type Lesson } from '../../types';
import { check, example } from './shared';

export const measuresLesson: Lesson = {
  slug: 'physical-quantities-units-and-errors', title: 'Physical quantities, units and errors',
  summary: 'Convert physical units, use scientific notation, compare proportional relationships and interpret simple measurement uncertainties.',
  minutes: 18, objectives: ['Convert units using explicit conversion factors.', 'Check equations through physical dimensions.', 'Interpret absolute and relative uncertainty.'],
  teachMd: md`
### Write a quantity as a number with a unit

A physical measurement combines a numerical value with a unit. Changing the unit changes the number but should not change the physical quantity. A length of 0.40 metres is the same length as 40 centimetres. Treat a conversion factor as a ratio equal to one, arranging it so the old unit cancels. This turns unit conversion into ordinary multiplication and makes the direction of the conversion visible rather than relying on a memorised instruction to move a decimal point.

The SI uses base units including the metre for length, kilogram for mass, second for time and kelvin for temperature. Derived units combine them: speed has units of metres per second, acceleration metres per second squared and force kilograms times metres per second squared. A symbol such as m can represent a metre in a unit expression or a mass variable in a formula, so read the context. Keep a space between the numerical value and a written unit when setting out a calculation.

Scientific notation expresses a number as a coefficient multiplied by a power of ten. It is especially useful for very large or small quantities and for tracking unit prefixes. Milli means one thousandth, micro one millionth and kilo one thousand. When multiplying powers of ten, add exponents; when dividing, subtract them. First estimate the expected order of magnitude. A result that changes a millimetre-sized object into a kilometre-sized object almost certainly contains a reversed factor or an exponent error.

### Convert areas and volumes with their powers

If one centimetre is one hundredth of a metre, one square centimetre is the square of that conversion: one ten-thousandth of a square metre. One cubic centimetre is the cube: one millionth of a cubic metre. The exponent belongs to the entire length unit. Applying a factor of one hundred only once to a volume is therefore incorrect. Draw a cube with each side converted if the exponent feels abstract; its volume multiplies all three converted side lengths.

Compound units require each part of the conversion. To change kilometres per hour into metres per second, convert kilometres to metres and hours to seconds. A density combines a mass and volume, so both may need conversion. One gram per cubic centimetre is one thousand kilograms per cubic metre: the mass number decreases by a factor of one thousand while the volume unit decreases by a factor of one million. Writing the ratio prevents these competing changes from becoming confused.

### Check a relationship before inserting numbers

Dimensional analysis asks whether both sides of an equation have the same physical dimensions. Distance equals speed multiplied by time because length per time multiplied by time produces length. Adding a distance directly to a time is meaningless without a defined conversion or physical relation. A dimensionally correct equation may still have a wrong numerical coefficient, but a dimensionally inconsistent equation cannot represent the stated physical relationship.

Proportionality describes how one quantity responds when another changes while relevant conditions remain fixed. If y is directly proportional to x, doubling x doubles y. If y is proportional to the square of x, doubling x multiplies y by four. If y is inversely proportional to x, doubling x halves y. Identify the exponent and the fixed quantities before scaling a result. A straight-looking graph over a small interval is not by itself proof of direct proportionality through the origin.

### Express uncertainty honestly

A measured value is not an infinitely precise number. Absolute uncertainty uses the same unit as the measurement; relative uncertainty divides that uncertainty by the measured magnitude. Multiplying the relative value by one hundred expresses it as a percentage. For a measurement of 50 cm with an absolute uncertainty of 1 cm, the relative uncertainty is 0.02, or 2%. Changing to metres changes both 50 and 1 by the same factor, leaving the relative uncertainty unchanged.

An uncertainty interval describes the range under the stated measurement convention; it is not a guarantee that every error source has been eliminated. Repeated readings can reveal random variation, while a miscalibrated instrument can shift all readings systematically. Averaging does not automatically remove that shift. Retain sensible precision in intermediate calculations and report an answer consistent with the given measurements. Extra calculator digits would not create extra experimental knowledge, even when the arithmetic itself is exact.
`,
  examples: [example('speed', 'A compound-unit conversion', 'Convert 54 km/h to m/s.', ['Multiply by 1,000 metres per kilometre and divide by 3,600 seconds per hour.', 'The numerical value is 54 × 1,000 / 3,600 = 15.'], 'The speed is 15 m/s.'), example('uncertainty', 'A relative measurement error', 'A length is measured as 80 mm with absolute uncertainty 2 mm. Find the percentage uncertainty.', ['Divide the absolute uncertainty by the measured value: 2/80 = 0.025.', 'Multiply by one hundred to express that fraction as a percentage.'], 'The percentage uncertainty is 2.5%; changing both values to metres leaves that percentage unchanged.')],
  traps: [{ title: 'Converting a squared unit once', md: 'Area involves two length factors and volume three. Raise the length conversion factor to the required power.' }, { title: 'Confusing precision with accuracy', md: 'Closely grouped readings can all be shifted by calibration error. Repetition alone does not establish closeness to the true value.' }],
  check: [
    check('check-area', 'Units and conversions', 'How many square metres equal 300 square centimetres?', [['3', 'This applies the centimetre-to-metre factor only once.'], ['0.03', ''], ['0.3', 'This is ten times the result of squaring the conversion factor.'], ['30', 'This incorrectly treats area as a larger numerical value in square metres.'], ['30,000', 'The conversion direction is reversed and the area factor is mishandled.']], 'B', 'One square centimetre equals 0.0001 square metres. Multiply 300 by 0.0001 to obtain 0.03 square metres.', 'Square a length conversion factor when converting area.'),
    check('check-square', 'Proportionality', 'If y = kx² with k fixed, multiplying x by 3 multiplies y by what factor?', [['3', 'This treats the relationship as linear rather than quadratic.'], ['6', 'This doubles the input factor instead of squaring it.'], ['9', ''], ['1/3', 'This assumes inverse proportionality without justification.'], ['1/9', 'This applies an inverse square rather than a direct square.']], 'C', 'Replacing x with 3x gives k(3x)² = 9kx². The output is multiplied by nine.', 'Apply the stated power to the complete input factor.'),
    check('check-relative', 'Measurement uncertainty', 'A mass is 200 g with absolute uncertainty 4 g. What is the relative uncertainty as a percentage?', [['50%', 'This inverts the measurement-to-uncertainty ratio and mishandles percentage conversion.'], ['4%', 'The absolute uncertainty in grams is not the percentage.'], ['0.02%', 'This is the relative fraction before multiplying by one hundred.'], ['2%', ''], ['20%', 'This is ten times the correct percentage.']], 'D', 'The relative uncertainty is 4/200 = 0.02. As a percentage it is 2%.', 'Divide uncertainty by measured magnitude before converting to a percentage.'),
  ], takeaways: ['Cancel old units with explicit conversion factors.', 'Area and volume require squared and cubed factors.', 'Dimensions can reject inconsistent equations.', 'Relative uncertainty is unchanged by a consistent unit conversion.'],
  practice: { examKey: 'tolc-f', domain: 'tolcf-physics', skill: 'tolcf-phys-measures' }, review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
