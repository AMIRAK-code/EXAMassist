import { md, type Unit } from '../../types';
import { check } from './check';

export const electricity: Unit = {
  slug: 'stationary-electric-fields', title: 'Stationary electric fields',
  summary: 'Go from a charge distribution to a field, a potential difference and the energy stored or dissipated in a device.',
  lessons: [
    {
      slug: 'field-flux-and-potential', title: 'Electric field, flux and potential',
      summary: 'Use symmetry to find an electric field, integrate it to obtain voltage, and predict how a charge or a dipole responds.',
      minutes: 18, practice: null,
      objectives: ['Choose between superposition and a Gaussian surface.', 'Relate field direction, potential and the energy of a moving charge.', 'Predict the torque on an electric dipole.'],
      teachMd: md`### What would a tiny test charge measure?

Imagine mapping the space around a charged metal sphere. At each point you could suspend a small positive test charge, measure the force on it, then divide by its charge. The resulting vector is the electric field. Making the probe small matters because the charges on the metal can move in response to the probe. The field describes the original distribution in the limit where the disturbance is negligible.

In vacuum a point charge produces $\mathbf E=kq\hat{\mathbf r}/r^2$, with $k=1/(4\pi\epsilon_0)$. The displacement points from source to observation point. A negative source reverses the field direction. For several sources, draw an arrow for each contribution at the **same observation point** and add components. For a continuous distribution, a small piece contributes $d\mathbf E=k\,dq\,\hat{\mathbf r}/r^2$. A wire segment supplies $dq=\lambda\,dl$ and a surface patch supplies $dq=\sigma\,dA$. The direction of the displacement generally changes as you integrate. A sketch may reveal pairs of components that cancel before any integration.

### When symmetry does the integration

Flux counts the normal component of the field passing through a surface. A tilted patch contributes $\mathbf E\cdot d\mathbf A$. For a closed surface we choose the normal to point outwards. Gauss's law gives $\oint\mathbf E\cdot d\mathbf A=Q_{\rm in}/\epsilon_0$. Charges outside the surface can affect the field at every point on it. Their total contribution to the closed flux sums to zero.

A uniformly charged isolated sphere gives a particularly useful geometry. Rotational symmetry forces the field to be radial and equally strong everywhere on a concentric spherical surface. The integral then becomes $4\pi r^2 E_r$. Outside the sphere, the result agrees with a point charge at the centre. In the conducting material at electrostatic equilibrium the field vanishes, since free charges would otherwise keep moving. Inside a uniformly charged *insulating* solid sphere a smaller Gaussian sphere encloses only a fraction of the charge. Deciding how much charge lies inside your chosen surface is a physical step before the algebra.

### Getting a voltage from the field

Potential difference is the negative line integral $\Delta V=-\int_A^B\mathbf E\cdot d\mathbf l$. Walking along the field lowers potential. In electrostatics the result depends only on the endpoints. For a local measurement along one coordinate, $E_x=-dV/dx$. A flat potential profile therefore gives zero field along that coordinate even if the profile sits at a large positive voltage. For an isolated sphere choose zero potential far away. Integration from infinity to an exterior radius gives $V=kQ/r$. Throughout the conducting sphere the potential equals its surface value.

A particle of charge $q$ changes potential energy by $q\Delta V$. When the electric force is the only force doing work, its kinetic energy changes by $-q\Delta V$. An electron can gain speed while moving towards higher potential. In a uniform field the force is constant, so a nonrelativistic particle follows constant acceleration $\mathbf a=q\mathbf E/m$. A velocity component perpendicular to the field survives unchanged while the parallel component changes.

### Two opposite charges on a short link

An electric dipole consists of equal opposite charges separated by a displacement from negative to positive. Its dipole moment is $\mathbf p=q\mathbf d$, where $q$ is the positive charge magnitude. A uniform field exerts equal and opposite forces on the ends. If their lines of action differ, the forces form a couple with torque $\mathbf p\times\mathbf E$. The stable alignment puts the positive end along the field and minimises $U=-\mathbf p\cdot\mathbf E$. In a nonuniform field the two ends sample different fields and the net force can be nonzero. This distinction explains how a neutral but polar object can both rotate and drift near a charged body.`,
      examples: [
        { id: 'sphere', title: 'Probe a charged sphere', problemMd: 'An isolated conducting sphere of radius 0.10 m carries +6 nC. Find the field and potential at 0.20 m from its centre in vacuum. Take zero potential at infinity and use $k=9.0\\times10^9$ in SI units.',
          steps: ['The point lies outside. A concentric Gaussian sphere encloses all 6 nC, so $E=kQ/r^2$ radially outwards.', 'Use $kQ=54\\ \\mathrm{V\\,m}$. Divide by $0.20^2$ for the field and by $0.20$ for the potential.'], answerMd: 'The field is 1,350 N/C outwards and the potential is +270 V.' },
        { id: 'dipole', title: 'Turn a dipole', problemMd: 'Charges of +2 nC and −2 nC are held 4 mm apart in a uniform field of 300 V/m. Find the torque magnitude when their link is perpendicular to the field.',
          steps: ['Use the separation between the charges to form $p=qd=8\\times10^{-12}\\ \\mathrm{C\\,m}$.', 'At a right angle the full moment contributes, giving $\\tau=pE$.'], answerMd: 'The torque magnitude is $2.4\\times10^{-9}\\ \\mathrm{N\\,m}$.' },
      ],
      traps: [{ title: 'Zero flux with a strong field', md: 'A uniform field enters one side of a closed box and leaves the other. The two signed fluxes cancel.' }, { title: 'Using the surface radius at the probe', md: 'The inverse-square law uses the distance from the centre to the observation point. Label both radii on your drawing.' }],
      check: [
        check('radius', 'Move a field probe', 'Electric field', 'Outside an isolated charged conducting sphere in electrostatic equilibrium, double the probe distance from the centre. What fraction of the original field remains?', [['One quarter'], ['One half', 'This is the distance dependence of the potential.'], ['One eighth', 'Cubing the distance scales with volume. The flux spreads over a spherical area.']], '$E(2r)/E(r)=r^2/(2r)^2=1/4$.', 'Check which power of distance belongs to the quantity measured.'),
        check('electron', 'Accelerate an electron', 'Potential', 'An electron released from rest gains 12 eV of kinetic energy through electrostatic work alone. What is its final potential minus its initial potential?', [['−12 V', 'A positive charge would gain energy for this potential drop.'], ['+12 V'], ['0 V', 'Equal endpoint potentials give zero electrostatic work.']], 'Since $q=-e$, the gain $-q\\Delta V=e\\Delta V$ requires a rise of 12 V.', 'Keep the sign of the moving charge in the energy balance.'),
        check('flux', 'A closed surface', 'Electric flux', 'A closed surface encloses zero net charge. Which quantity must vanish?', [['The field at each point', 'Fields from external charges can pass through the surface.'], ['The potential everywhere inside', 'Charge outside can contribute a nonzero potential.'], ['The net outward electric flux']], 'Gauss’s law fixes the signed flux at $Q_{\\rm in}/\\epsilon_0=0$.', 'A surface integral can vanish while its integrand varies.'),
      ],
      takeaways: ['Add electric fields as vectors at the observation point.', 'Use symmetry before taking a field outside a flux integral.', 'Use the signed charge in the relation between voltage and energy.'],
      flashcards: [{ front: 'Which direction is an electric dipole moment?', back: 'Along the separation from the negative charge to the positive charge.' }, { front: 'How do you read the field from a voltage graph?', back: 'Take the negative local slope along the chosen coordinate.' }, { front: 'What charge enters Gauss’s law?', back: 'The algebraic total inside the closed surface.' }, { front: 'What is constant throughout a conductor in electrostatic equilibrium?', back: 'Its potential. The electric field in the conducting material is zero.' }],
      review: { aiAssisted: true, independentCheckOn: '2026-11-23', expertReview: null },
    },
    {
      slug: 'capacitance-and-conduction', title: 'Capacitance, conduction and heating',
      summary: 'Decide what stays fixed when a capacitor changes, then connect current density in a trace to resistance and heating.',
      minutes: 16, practice: null,
      objectives: ['Find charge and energy under fixed-voltage and fixed-charge conditions.', 'Connect resistivity and trace geometry to Joule heating.'],
      teachMd: md`### Where does a capacitor store energy?

Imagine two broad conducting pads facing each other across a narrow insulating gap. Transferring charge from one pad to the other leaves equal and opposite free charges on their facing surfaces. Transferring the next small charge takes more work because the voltage difference has risen. This growing opposition explains both the capacitance relation $Q=CV$ and the factor of one half in the stored energy. Plot voltage against charge. The area under the straight line from zero charge to the final charge is the work $U=\int_0^Q V(q)\,dq=Q^2/(2C)$.

For large parallel plates of overlap area $A$ separated by a small uniform gap $d$, the field in the middle is nearly uniform. A Gaussian surface cutting through one facing conductor gives $E=\sigma/\epsilon$ in the gap when it is filled with a homogeneous linear dielectric. Here $\sigma=Q/A$ is the free surface charge density. Integrating the field across the gap gives $V=Ed$. Together these results yield $C=\epsilon A/d$. Fringing matters near the edges and becomes significant if the gap approaches the dimensions of the pads. Geometry and material determine capacitance in this linear model.

### Which quantity survives a change?

Suppose you separate the pads. First look for a path through which charge can leave. A connected ideal voltage source holds the potential difference fixed. As capacitance falls, charge flows back into the source. If the pads are isolated and leakage is negligible, each retains its initial free charge. The same increase in spacing now raises the voltage. A statement about moving the plates without a statement about their electrical connection is incomplete.

The energy formulas $U=CV^2/2$ and $U=Q^2/(2C)$ describe the same state. Choose the form containing the variable held fixed. For isolated pads, pulling them apart raises field energy because an external force does work against the attraction. With a connected source, the source also exchanges energy with the field. A decrease in field energy alone cannot tell you how much work the external agent supplied. In a linear dielectric the energy density is $\epsilon E^2/2$. Multiplying by the volume $Ad$ recovers the parallel-plate energy, a check that the electric field carries energy throughout the gap.

### Following charge through a resistive trace

Current is the rate of transfer of conventional positive charge through a cross-section. If the current density is uniform and parallel to the normal, $I=JA$. More generally $I=\int \mathbf J\cdot d\mathbf A$. In a metal the mobile electrons drift opposite to conventional current. The sign choice for current remains consistent as long as you specify the normal.

For an isotropic ohmic material at a fixed temperature, the local law $\mathbf J=\sigma_{\rm c}\mathbf E$ connects field to current density. Conductivity $\sigma_{\rm c}$ is the reciprocal of resistivity $\rho$. In a straight uniform trace of length $\ell$ and conducting cross-section $A$, the voltage drop along the current is $E\ell$ and the resistance is $R=\rho\ell/A$. A narrow segment can dominate the total heating because it raises the current density for the same through-current.

### From a voltage drop to heat

Each coulomb moving through a drop of one volt loses one joule of electrical energy. Multiplying the drop by coulombs per second gives power $P=VI$. For an ohmic resistor this is also $I^2R$ or $V^2/R$. The same geometric change can therefore have opposite effects depending on what the circuit maintains. At fixed current, making a trace thinner increases heating. At fixed voltage across the trace, increasing resistance reduces the current and reduces the total heating. Use the supply condition before predicting a temperature trend. The power calculation tells you the rate of energy delivery. Temperature itself depends on heat capacity and on the path by which the device loses heat.`,
      examples: [
        { id: 'moving-pad', title: 'Pull apart connected pads', problemMd: 'A 20 pF parallel-plate capacitor with a 0.5 mm gap stays connected to 3 V. The gap doubles. Find the charge magnitude on a plate before and after, neglecting fringing.', steps: ['Initially $Q=CV=20\\times3=60$ pC.', 'Doubling the gap halves the capacitance. With the voltage still fixed, the final charge is $10\\times3$ pC.'], answerMd: 'The charge falls from 60 pC to 30 pC.' },
        { id: 'trace', title: 'Find the heat from a trace', problemMd: 'A uniform 0.08 m trace has cross-section 0.20 mm² and resistivity $2.0\\times10^{-8}\\ \\Omega\\,\\mathrm m$. What heat power does it dissipate at 0.50 A?', steps: ['Convert the area to $2.0\\times10^{-7}\\ \\mathrm{m^2}$. The resistance is $\\rho\\ell/A=0.008\\ \\Omega$.', 'At the given current use $P=I^2R=0.25\\times0.008$ W.'], answerMd: 'The heating power is 0.002 W, or 2 mW.' },
      ],
      traps: [{ title: 'Treating an isolated plate as grounded', md: 'An isolated plate retains its net charge. Grounding a plate gives charge a path to a large reservoir.' }, { title: 'Converting only one dimension', md: 'One square millimetre equals one millionth of a square metre. Square the length conversion when converting area.' }],
      check: [
        check('stored-energy', 'Change an isolated capacitor', 'Capacitance', 'The capacitance of an isolated charged capacitor doubles. What happens to its stored energy?', [['It doubles.', 'Doubling energy would follow at constant voltage.'], ['It stays the same.', 'The charge stays fixed but the voltage changes.'], ['It halves.']], 'At fixed charge $U=Q^2/(2C)$ varies inversely with capacitance.', 'Identify the electrical connection before selecting an energy formula.'),
        check('geometry', 'Redesign a round wire', 'Resistance', 'At fixed resistivity, a round wire is made twice as long and given half its original radius. By what factor does its resistance change?', [['2', 'This accounts only for the change in length.'], ['8'], ['4', 'This accounts only for the smaller cross-section.']], 'The length doubles and the area falls to one quarter. The ratio is $2/(1/4)=8$.', 'Express cross-section in terms of radius before scaling.'),
        check('resistor', 'Measure heat power', 'Joule heating', 'A 120 Ω resistor has a steady 6 V across it. How much power is dissipated?', [['0.30 W'], ['0.05 W', 'The division of voltage by resistance gives current in amperes.'], ['720 W', 'Multiplying voltage by resistance does not give power.']], 'The current is $6/120=0.05$ A, so the power is $6\\times0.05=0.30$ W.', 'Compute the current as an independent check on the power.'),
      ],
      takeaways: ['An ideal connected source fixes voltage.', 'An isolated capacitor conserves its free charge.', 'The cross-section in the resistance formula is perpendicular to current.'],
      flashcards: [{ front: 'What makes the parallel-plate approximation appropriate?', back: 'The gap is small compared with both plate dimensions.' }, { front: 'How does energy depend on capacitance at fixed charge?', back: 'It varies inversely with capacitance.' }, { front: 'What does resistivity measure?', back: 'The electric field required per unit current density in a material.' }, { front: 'What is the SI unit of Joule heating power?', back: 'The watt, or joule per second.' }],
      review: { aiAssisted: true, independentCheckOn: '2026-11-23', expertReview: null },
    },
  ],
};
