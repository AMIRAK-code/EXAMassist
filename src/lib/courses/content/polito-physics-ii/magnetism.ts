import { md, type Unit } from '../../types';
import { check } from './check';

export const magnetism: Unit = {
  slug: 'stationary-magnetic-fields', title: 'Stationary magnetic fields',
  summary: 'Predict the forces that a field exerts, then build the field itself from a wire, a current loop or a solenoid.',
  lessons: [
    {
      slug: 'magnetic-force-and-torque', title: 'Magnetic force, orbits and torque',
      summary: 'Use the Lorentz force to predict deflection, distinguish circular from helical motion, and calculate the torque on a coil.',
      minutes: 17, practice: null,
      objectives: ['Determine the direction and magnitude of magnetic force.', 'Resolve an incoming velocity into circular and axial motion.', 'Find the magnetic moment and torque of a current loop.'],
      teachMd: md`### Start with the motion

A stationary charge on a laboratory bench feels no magnetic force in the bench frame. Give it a velocity across a magnetic field and its path bends. The magnetic term in the Lorentz force is $q\mathbf v\times\mathbf B$. The order of the vectors matters. For a positive charge, point the fingers of your right hand along the velocity and curl towards the field along the smaller angle. Your thumb gives the force direction. Reverse the resulting force for a negative charge. With an electric field present, add the term $q\mathbf E$ as a separate vector.

The magnitude is $|q|vB\sin\theta$, where $\theta$ is the angle between velocity and field. This gives two immediate predictions. A particle moving along a field line feels zero magnetic force. A particle crossing the lines at right angles experiences the largest force available at that speed. The unit of magnetic field is the tesla, equivalent to a newton per ampere metre. Substituting coulombs times metres per second for ampere metres gives a useful unit check for single-particle problems.

### Predicting the path

The instantaneous power delivered by a force is $\mathbf F\cdot\mathbf v$. A cross product with velocity is perpendicular to velocity, so the magnetic force alone does zero work. In a uniform field a particle entering at right angles therefore moves at constant speed along a circle. The force changes which direction the momentum points. Equating its magnitude to the centripetal force gives $r=mv/(|q|B)$ in the nonrelativistic limit. The sign of the charge determines which way the orbit curves. A detector that measures radius and field strength measures momentum per unit charge magnitude.

If the incident velocity makes an oblique angle, project it onto the field and the plane perpendicular to it. Use only $v_\perp$ in the orbit-radius formula. The parallel component $v_\parallel$ carries the particle steadily along the field while the transverse component rotates. The result is a helix. Its period is $T=2\pi m/(|q|B)$ and the axial distance covered per revolution is $|v_\parallel|T$. The period stays independent of speed in this model because increasing the transverse speed increases the circumference in the same proportion. Electric fields, collisions and relativistic speeds can each change the prediction.

### From moving charges to the force on a wire

A steady current transports many charges. Summing their magnetic forces over a thin wire in an external field gives $d\mathbf F=I\,d\boldsymbol\ell\times\mathbf B$. Orient the length element along conventional current. For a straight segment entirely in a uniform field, the integral reduces to $I\boldsymbol\ell\times\mathbf B$. A bent wire in a nonuniform field generally requires integrating each segment with its local field. In a uniform field the net force on a complete closed loop is zero because the directed lengths add to zero.

### How a loop can still rotate

Consider a rectangular coil in a uniform field with two opposite sides perpendicular to the field. The currents on those sides run opposite ways. Their forces can be equal in magnitude and opposite in direction yet act on different lines. This couple rotates the coil. For a planar loop define the area vector by curling the fingers of your right hand with the current. The thumb points along the area vector. The magnetic moment of $N$ identical turns is $\boldsymbol\mu=NI\mathbf A$.

The torque is $\boldsymbol\tau=\boldsymbol\mu\times\mathbf B$ and the orientation energy is $U=-\boldsymbol\mu\cdot\mathbf B$. In a uniform field the same moment rule applies to a flat loop of any shape. An aligned moment has the lowest energy and feels zero torque. An exactly opposite moment also has zero torque, but a small disturbance can rotate it away from that configuration. When interpreting a drawing always label the angle to the area normal. A drawing that shows the field in the plane of the loop corresponds to maximum torque.`,
      examples: [
        { id: 'deflection', title: 'Deflect a positive charge', problemMd: 'A +2 µC charge moves along +x at 3,000 m/s in a uniform 0.40 T field along +z. Find its magnetic force.', steps: ['The vectors are perpendicular. The magnitude is $2\\times10^{-6}\\times3000\\times0.40$ N.', 'The right-handed basis gives $\\hat x\\times\\hat z=-\\hat y$. A positive charge keeps this sign.'], answerMd: 'The force is 2.4 mN along −y.' },
        { id: 'coil', title: 'Twist a rectangular coil', problemMd: 'Each of 12 identical turns encloses 5.0 cm² and carries 0.20 A. A uniform 0.30 T field is perpendicular to the coil’s area vector. Find the torque magnitude.', steps: ['Convert each area to $5.0\\times10^{-4}$ m². The magnetic moment is $NIA=1.2\\times10^{-3}$ A m².', 'The angle between the moment and the field is 90°, so multiply the moment by the field strength.'], answerMd: 'The torque is $3.6\\times10^{-4}\\ \\mathrm{N\\,m}$.' },
      ],
      traps: [{ title: 'Curling in the opposite order', md: 'Write velocity first and field second. Exchanging them reverses the force.' }, { title: 'Using the angle to the coil face', md: 'Draw the area normal before reading an angle for torque. It is perpendicular to the face.' }],
      check: [
        check('parallel', 'Travel along a field', 'Lorentz force', 'An electron travels parallel to a uniform magnetic field. What is the magnitude of its magnetic force?', [['Zero'], ['$e v B$', 'That value requires motion perpendicular to the field.'], ['$2 e v B$', 'Changing the sign of charge reverses direction without doubling a magnitude.']], 'Parallel vectors have a zero cross product, so the charge sign does not affect this result.', 'Check the angle before applying a charge sign.'),
        check('orbit', 'Change orbit speed', 'Magnetic motion', 'The same nonrelativistic particle enters the same uniform field at twice its earlier speed, perpendicular to the field both times. What happens to its orbit radius?', [['It halves.', 'The increased magnetic force is accompanied by a larger momentum.'], ['It stays fixed.', 'The period stays fixed in this model but the radius changes.'], ['It doubles.']], 'The radius is $mv/(|q|B)$ and scales directly with perpendicular speed.', 'Specify which component of velocity determines the radius.'),
        check('axes', 'Use a right-handed coordinate system', 'Lorentz force', 'A positive charge moves along +y in a magnetic field pointing along +x. Where does the magnetic force point?', [['+z', 'This is the direction obtained by reversing the cross product.'], ['−z'], ['+y', 'The magnetic force is perpendicular to velocity.']], '$\\hat y\\times\\hat x=-\\hat z$ in right-handed axes.', 'Write both vectors in order before taking the cross product.'),
      ],
      takeaways: ['A magnetic force alone changes momentum direction while conserving kinetic energy.', 'Only the transverse velocity enters the cyclotron radius.', 'Curl the right hand around the current to orient a loop moment.'],
      flashcards: [{ front: 'What is the power delivered to a point charge by a magnetic field?', back: 'Zero, since the magnetic force is perpendicular to the instantaneous velocity.' }, { front: 'What determines the pitch of a helical trajectory?', back: 'The magnitude of the parallel velocity multiplied by one orbit period.' }, { front: 'How is a loop’s moment oriented?', back: 'Along the area normal picked out by the right-hand rule for the current.' }, { front: 'Which angle gives maximum torque?', back: 'A right angle between the magnetic moment and the applied field.' }],
      review: { aiAssisted: true, independentCheckOn: '2026-11-23', expertReview: null },
    },
    {
      slug: 'fields-from-currents', title: 'Fields from wires, loops and solenoids',
      summary: 'Choose an integration path using symmetry, find fields made by currents and calculate the force between parallel wires.',
      minutes: 18, practice: null,
      objectives: ['Use Ampère’s law with cylindrical symmetry.', 'Apply the Biot–Savart law to a loop or solenoid.', 'Predict the force between parallel currents.'],
      teachMd: md`### Put the observation point on the diagram

The field made by a current depends on both the shape of its path and the point where you measure it. Mark that point first. A small segment gives $d\mathbf B=(\mu_0/4\pi)I\,d\boldsymbol\ell\times\hat{\mathbf r}/r^2$ in vacuum for a steady current. Here $\mathbf r$ points from the segment to the observation point. Follow the wire to add each contribution. The inverse square occurs in the contribution from an element. The field of a whole extended wire can follow a different distance dependence because both the angles and the distances vary along the wire.

At the centre of a circular loop, every element has the same distance $R$ from the observation point. Every directed length is perpendicular to its radius, and every field contribution points along the same axis. Integrating the circumference gives $B=\mu_0 I/(2R)$ for one turn. This expression is specific to the centre. A probe displaced far along the axis sees a much weaker dipole field. At the centre of a tightly wound flat stack of identical turns, multiply the single-turn result by their number.

### A circulation shortcut

Ampère's law for steady currents in vacuum gives $\oint\mathbf B\cdot d\boldsymbol\ell=\mu_0 I_{\rm through}$. The integrating path is an imaginary closed curve in space. An oriented surface spans it. Currents piercing that surface count with sign according to the right-hand rule. A current just outside the curve can still produce a field along it, although that current contributes zero to the complete circulation. To extract a local field value you need a reason the integral simplifies.

For an effectively infinite straight wire, rotational and translational symmetry give a field tangent to concentric circles with constant magnitude on each circle. Take a circular path of radius $r$ outside the wire. Its circulation is $2\pi rB$, giving $B=\mu_0 I/(2\pi r)$. Curl the right-hand fingers around the wire with the thumb pointing along the current to orient this field. Far from the ends of a long wire this approximation works well if the return path is also sufficiently distant. Inside a thick wire the chosen circle encloses only part of the current. First calculate the current within its radius.

### From a circular loop to a long coil

A solenoid stacks many current loops along an axis. Inside a tightly wound long solenoid the axial contributions reinforce each other. Away from its ends the interior field is approximately uniform and the exterior field is small. An Ampèrian rectangle with one long side inside and the other outside gives $B\simeq\mu_0 n I$ for an air core, with $n=N/\ell$ the turns per unit length. Near an end the external contribution and the curvature of the field lines are significant. For a thin finite winding of radius $R$ centred at the origin, the centre field is $\mu_0 n I\,(\ell/2)/\sqrt{R^2+(\ell/2)^2}$. This follows by adding the axial fields of its individual loops. As the length grows at fixed turn density, the geometric factor tends to one.

### Forces between currents

Draw the field of the first wire **at the second wire**. Then apply the force law to the current in the second wire. Two parallel long wires a distance $d$ apart exert a force of magnitude per unit length $\mu_0 I_1 I_2/(2\pi d)$. For currents flowing the same way it is attractive. Reversing either current reverses that force while reversing both currents keeps it attractive. The two wires exert equal and opposite forces on each other.

Gauss's law for magnetism gives $\oint\mathbf B\cdot d\mathbf A=0$ through any closed surface. Trace a field line across the wall of a box. Where it enters, it contributes negative outward flux. Where it leaves, it contributes positive flux. This law constrains magnetic **flux**, while Ampère's law constrains magnetic **circulation**. Distinguishing a closed surface from a closed path is often enough to choose the relevant equation.`,
      examples: [
        { id: 'wire-field', title: 'Place a probe beside a wire', problemMd: 'A long straight wire in vacuum carries 6.0 A. Find the field 3.0 cm from its axis outside the wire. Use $\\mu_0\\simeq4\\pi\\times10^{-7}$ in SI units.', steps: ['Use a circular Ampèrian path of radius 0.030 m centred on the wire.', 'Substitute into $B=(2\\times10^{-7})(6.0)/0.030$ T. The field is tangent to the circular path.'], answerMd: 'The field is 40 µT, circulating around the current by the right-hand rule.' },
        { id: 'wire-force', title: 'Calculate the force per metre', problemMd: 'Two long straight wires in vacuum are 2.0 cm apart and carry 3.0 A and 4.0 A in the same direction. Find the force per metre.', steps: ['At the second wire, the first produces $B=(2\\times10^{-7})(3.0)/0.020=3.0\\times10^{-5}$ T.', 'The second wire crosses this field at right angles, giving $F/\\ell=I_2 B$.'], answerMd: 'Each wire feels $1.2\\times10^{-4}$ N per metre towards the other.' },
      ],
      traps: [{ title: 'Pulling a variable field out of an integral', md: 'Choose a path on which symmetry fixes the field magnitude and the angle to the tangent.' }, { title: 'Counting all turns without measuring length', md: 'In a long solenoid the current enclosed per metre depends on turns per metre. Specify the winding length.' }],
      check: [
        check('turns', 'Change a solenoid winding', 'Magnetostatics', 'In a long air-core solenoid, turn density doubles while current halves. What happens to the central field?', [['It halves.', 'The doubled turn density compensates for the smaller current.'], ['It stays the same.'], ['It doubles.', 'This omits the reduction in current through the turns.']], 'The product $nI$ is unchanged, so $B\\simeq\\mu_0 n I$ stays constant.', 'Separate total turns from turn density.'),
        check('loop-radius', 'Expand a single turn', 'Biot–Savart law', 'Double the radius of a circular loop while holding its current fixed. What is the new field at its centre?', [['Half the original field'], ['One quarter of the original field', 'Each element is farther away but the circumference also doubles.'], ['Twice the original field', 'Increasing the circumference also increases the source distance.']], 'At the centre $B=\\mu_0 I/(2R)$, so doubling $R$ halves the field.', 'The inverse-square element law must be integrated over the source.'),
        check('magnetic-flux', 'Enclose a wire', 'Gauss’s law for magnetism', 'A closed surface surrounds part of a current-carrying wire. What is its net outward magnetic flux?', [['Proportional to the enclosed wire length', 'A closed magnetic flux has no source term for wire length.'], ['Proportional to the current', 'Current enters the circulation law for a closed path.'], ['Zero']], 'The integral of the normal magnetic field over any closed surface vanishes.', 'Identify whether the integration object is a loop or a surface.'),
      ],
      takeaways: ['Mark the field point before constructing source vectors.', 'Symmetry can turn Ampère’s circulation law into a field formula.', 'Parallel currents in the same direction attract.'],
      flashcards: [{ front: 'What path is convenient around an infinite straight wire?', back: 'A circle perpendicular to and centred on the wire.' }, { front: 'Where does the simple circular-loop centre formula apply?', back: 'At the centre of the loop.' }, { front: 'What happens to the interior solenoid approximation near an end?', back: 'The field spreads and the long-solenoid approximation loses accuracy.' }, { front: 'What does a closed magnetic flux integral measure?', back: 'The signed magnetic flux over the entire boundary. Its value is zero.' }],
      review: { aiAssisted: true, independentCheckOn: '2026-11-23', expertReview: null },
    },
  ],
};
