import { md, type Unit } from '../../types';
import { check } from './check';

export const waves: Unit = {
  slug: 'electromagnetic-waves', title: 'Electromagnetic waves',
  summary: 'Follow an electromagnetic signal through space, predict its direction of energy flow and measure the effect of rotating a polariser.',
  lessons: [
    {
      slug: 'from-maxwell-to-waves', title: 'From Maxwell’s equations to a travelling wave',
      summary: 'Read the phase of a travelling signal, derive the vacuum wave speed and reconstruct the magnetic field from the electric field.',
      minutes: 18, practice: null,
      objectives: ['Read wavelength, frequency and direction from a phase.', 'Derive the wave equation in source-free vacuum.', 'Construct both fields of a travelling plane wave.'],
      teachMd: md`### One oscillation viewed in two ways

Stretch a string and send a ripple down it. Each small piece of string moves near its resting position while the shape travels along the string. A graph of displacement against position at one instant is a snapshot. A sensor fixed in one place records displacement against time. Adjacent crests on the snapshot are one wavelength apart. Successive crests at the sensor arrive one period apart. For a periodic travelling pattern the speed is the distance one crest advances in a cycle divided by the duration of that cycle, $v=\lambda/T=\lambda f$.

A sinusoidal electromagnetic wave repeats in space and time, but its oscillating quantities are electric and magnetic fields. It can propagate across a vacuum. A sinusoidal component can be written $E_y(x,t)=E_0\cos(kx-\omega t+\phi_0)$. The wave number $k=2\pi/\lambda$ describes phase accumulated per metre, and the angular frequency $\omega=2\pi f$ describes it per second. For positive $k$ and $\omega$, tracking a point of fixed phase gives $dx/dt=\omega/k$ along positive $x$. Changing the sign between these terms reverses the propagation direction. The constant phase offset changes where a crest is at the chosen time origin.

### Why a wave is allowed in empty space

Choose a region containing no charges or currents. Faraday’s law couples the curl of the electric field to a changing magnetic field. The Ampère–Maxwell law couples the curl of the magnetic field to a changing electric field. To eliminate the magnetic field, take the curl of Faraday’s law and substitute the time derivative of the Ampère–Maxwell expression. The result is $\nabla\times(\nabla\times\mathbf E)=-\mu_0\epsilon_0\,\partial^2\mathbf E/\partial t^2$. In this region electric Gauss’s law gives $\nabla\cdot\mathbf E=0$. The identity for the curl of a curl then reduces the left side to $-\nabla^2\mathbf E$.

Rearranging gives $\nabla^2\mathbf E=\mu_0\epsilon_0\,\partial^2\mathbf E/\partial t^2$. The magnetic field satisfies an equation of the same form. Comparing with the travelling-wave equation yields $c=1/\sqrt{\mu_0\epsilon_0}$, about $3.00\times10^8$ m/s. The vacuum and source-free assumptions entered this derivation explicitly. Measuring the wavelength of a radio signal inside a cable requires the propagation speed of the cable. Frequency is set by the source, while the medium can change the distance between successive phase fronts.

### Reconstruct the companion field

For a single travelling plane wave in vacuum, both fields are transverse. The electric field, magnetic field and propagation direction form a right-handed set. If $\hat{\mathbf n}$ points along propagation, then $\mathbf B=\hat{\mathbf n}\times\mathbf E/c$. The fields are in phase, so a peak electric field goes with a peak magnetic field and their magnitudes satisfy $E_0=cB_0$. This is a relation for a propagating plane wave. The electric field near a charged plate and the magnetic field near a steady current have no reason to satisfy this amplitude ratio.

The direction in which energy travels is $\mathbf E\times\mathbf B$. At a fixed point both fields reverse every half-cycle. Reversing both vectors leaves their cross product pointing in the same direction. At instants when both fields vanish the instantaneous energy flux is zero, but the wave still has a well-defined propagation direction.

### Where a signal comes from

An antenna can be modelled, at a first approximation, as charges oscillating over a region small compared with the wavelength. The resulting time-dependent electric dipole radiates. Far from a short oscillating dipole, the radiation is transverse and strongest in a plane perpendicular to the dipole axis. Along the axis the ideal dipole radiation vanishes. Radio, microwave, visible light and X-rays label ranges of the same electromagnetic spectrum. In vacuum the speed is common across these ranges. A higher carrier frequency means a shorter wavelength, which changes which antenna dimensions and spatial structures can interact strongly with the radiation.`,
      examples: [
        { id: 'wireless', title: 'Measure a carrier wavelength', problemMd: 'A 2.4 GHz transmitter emits into vacuum. Taking $c=3.0\\times10^8$ m/s, how far apart are adjacent spatial crests?', steps: ['Convert the frequency to $2.4\\times10^9$ Hz. One crest advances one wavelength in one period.', 'Use $\\lambda=c/f=(3.0/2.4)\\times10^{-1}$ m.'], answerMd: 'Adjacent crests lie 0.125 m, or 12.5 cm, apart.' },
        { id: 'field-pair', title: 'Reconstruct a travelling field', problemMd: 'At a crest of a travelling plane wave in vacuum the electric field is 12 V/m along +y and the magnetic field points along +z. Find the magnetic amplitude and the propagation direction. Use $c=3.0\\times10^8$ m/s.', steps: ['Use $B_0=E_0/c=12/(3.0\\times10^8)$ T.', 'Orient the energy flux with $\\hat y\\times\\hat z=\\hat x$.'], answerMd: 'The magnetic amplitude is 40 nT and the wave travels along +x.' },
      ],
      traps: [{ title: 'Reading frequency from a snapshot', md: 'A snapshot gives spatial spacing. Combine that spacing with propagation speed to infer the time scale.' }, { title: 'Using a plane-wave formula beside a static source', md: 'The amplitude ratio and common phase apply to a travelling vacuum plane wave. Check the field model first.' }],
      check: [
        check('spectrum', 'Compare two carriers', 'Wave propagation', 'A second wave in vacuum has three times the wavelength of a first wave. How does its frequency compare?', [['Three times larger', 'At a common speed, wavelength and frequency change inversely.'], ['One third as large'], ['Unchanged', 'An unchanged frequency in the same vacuum would leave the wavelength unchanged.']], 'Both waves obey $f=c/\\lambda$, so tripling the denominator divides frequency by three.', 'State the common medium before using an inverse ratio.'),
        check('orientation', 'Find the missing direction', 'Electromagnetic waves', 'A single vacuum plane wave travels along +z. At one instant its electric field points along +x. Which way does the magnetic field point?', [['−y', 'This would send energy along −z.'], ['+z', 'The magnetic field must be transverse.'], ['+y']], 'The required direction obeys $\\hat x\\times\\hat y=\\hat z$.', 'Test the candidate direction against energy flow.'),
        check('phase', 'Compare two spatial probes', 'Wave propagation', 'For a sinusoidal travelling wave, what is the smallest positive separation along propagation between points of equal phase at a fixed time?', [['One wavelength'], ['Half a wavelength', 'Half a cycle separates opposite phases.'], ['One period', 'A period is a time interval and the probes are separated in space.']], 'Equal phase first recurs after a phase advance of $2\\pi$, corresponding to a distance $2\\pi/k=\\lambda$.', 'Record whether the independent variable is distance or time.'),
      ],
      takeaways: ['A snapshot gives wavelength and a fixed probe gives period.', 'The two curl equations yield the source-free wave equation.', 'For a vacuum plane wave use propagation direction crossed with the electric field to orient the magnetic field.'],
      flashcards: [{ front: 'What is angular frequency in terms of frequency?', back: '$\\omega=2\\pi f$, in radians per second.' }, { front: 'What makes a vacuum plane wave transverse?', back: 'Its electric and magnetic fields both lie perpendicular to propagation.' }, { front: 'What speed follows from the vacuum Maxwell equations?', back: '$c=1/\\sqrt{\\mu_0\\epsilon_0}$.' }, { front: 'Where is radiation weakest for an ideal short oscillating dipole?', back: 'On its axis, where the far-field radiation vanishes.' }],
      review: { aiAssisted: true, independentCheckOn: '2026-11-23', expertReview: null },
    },
    {
      slug: 'energy-momentum-and-polarisation', title: 'Energy, momentum and polarisation',
      summary: 'Calculate intensity and radiation pressure, then rotate a polariser to see how field projection changes the power it transmits.',
      minutes: 20, practice: null, experiment: 'polarisation',
      objectives: ['Relate field amplitudes to mean energy flow.', 'Calculate the force on an absorbing or reflecting surface.', 'Predict transmission through an ideal linear polariser.'],
      teachMd: md`### What a power meter averages

A plane wave arriving at a detector carries both field energy and momentum. The instantaneous electromagnetic energy passing per second per unit normal area is described by the Poynting vector $\mathbf S=\mathbf E\times\mathbf B/\mu_0$ in vacuum. For a single travelling wave, a detector facing the wave measures an average over many oscillations. That average normal flux is the intensity $I$. A patch of area $A$ perpendicular to a uniform beam intercepts mean power $IA$. Tilting the patch changes its projected area, even if a meter facing the beam would still read the same intensity.

For a sinusoidal wave $E=E_0\cos\phi$ and $B=E/c$ in magnitude with corresponding signs along chosen transverse axes. The instantaneous energy flux is proportional to $\cos^2\phi$. Its average over a full cycle is one half of its peak. Thus $I=E_0^2/(2\mu_0 c)=E_{\rm rms}^2/(\mu_0 c)$. The root-mean-square field is $E_0/\sqrt{2}$. Decide whether a quoted field is peak or rms before squaring it. A meter calibrated in watts per square metre has already done the averaging. The electric and magnetic contributions to the energy density are equal for a travelling vacuum plane wave. Their sum flows at the wave speed.

### A force without contact

Radiation carries momentum in its propagation direction. A pulse of energy $U$ carries momentum $U/c$ in vacuum. A perfectly absorbing surface at normal incidence acquires the incoming momentum. Dividing momentum transferred per second by area gives the mean pressure $p=I/c$. A perfectly reflecting surface at normal incidence sends the wave back along its incoming path. Reversing the outgoing momentum doubles the momentum change, giving $p=2I/c$. To find a force on a uniform illuminated patch, multiply the pressure by the illuminated area. If only part of the object lies in the beam, use that part's area.

### Orient the electric field

At a fixed location, the tip of the electric field in a linearly polarised wave moves back and forth along one line in the plane perpendicular to propagation. Its sign reverses, but its orientation axis stays fixed. Two perpendicular components of equal amplitude with a quarter-cycle phase difference give circular polarisation. General unequal components and phase differences can give elliptical polarisation. Specifying only the propagation direction leaves the polarisation undetermined.

An ideal linear polariser transmits the electric-field component along its transmission axis. For incident linear polarisation making angle $\theta$ with that axis, the transmitted field amplitude is $E_{\rm out}=E_{\rm in}\cos\theta$. Intensity is proportional to squared amplitude in the same medium. Malus's law therefore gives $I_{\rm out}=I_{\rm in}\cos^2\theta$. At a right angle the projection vanishes. At alignment the entire intensity passes in this ideal model. An axis rotated by half a turn describes the same physical filter. This angular dependence helps explain the effect of misalignment in an ideal polarisation-sensitive receiver.

### Work through a sequence of filters

After one ideal linear polariser, the transmitted beam is linearly polarised along that polariser's axis. Use this new axis and the transmitted intensity as the input to a second polariser. The second angle is the difference between the axes, even if both orientations were originally quoted relative to a laboratory vertical. An unpolarised beam has no preferred transverse orientation. Averaging the squared projection over the ensemble gives one half, so the first ideal polariser transmits half the incident intensity. Later polarisers act on a beam with a definite axis. Treating every filter as another factor of one half misses that change of state.

In the experiment below, compare the projected field with the transmitted intensity while rotating the axis. Try an angle halfway between alignment and extinction and predict both readings before moving the slider. Then change only the incident intensity. The transmitted fraction stays fixed at the chosen angle while the transmitted power per square metre follows the input linearly.`,
      examples: [
        { id: 'radiation-force', title: 'Weigh the momentum transfer', problemMd: 'A uniform beam of intensity 180 W/m² in vacuum falls normally on a perfectly absorbing patch of area 20 cm². Find the mean force with $c=3.0\\times10^8$ m/s.', steps: ['The illuminated area is $0.0020$ m², so the intercepted power is $180\\times0.0020=0.36$ W.', 'A perfect absorber takes momentum at the rate $P/c$. Divide 0.36 W by the wave speed.'], answerMd: 'The mean force is $1.2\\times10^{-9}$ N along the beam.' },
        { id: 'polariser', title: 'Rotate a transmission axis', problemMd: 'Light with intensity 80 W/m² is linearly polarised at 60° to an ideal polariser’s axis. Find the transmitted intensity.', steps: ['The transmitted amplitude fraction is $\\cos60^\\circ=1/2$.', 'Square the fraction before applying it to intensity. One quarter of 80 W/m² passes.'], answerMd: 'The transmitted intensity is 20 W/m².' },
      ],
      traps: [{ title: 'Projecting intensity as a vector', md: 'Project the electric field first. Squaring that amplitude introduces the second cosine factor.' }, { title: 'Counting a reflection as absorption', md: 'Draw the incoming and outgoing momentum arrows. A reversal transfers twice the original normal momentum.' }],
      check: [
        check('amplitude', 'Scale a signal', 'Poynting vector', 'At fixed wave impedance a sinusoidal plane wave doubles its peak electric field. What happens to mean intensity?', [['It doubles.', 'The field amplitude doubles but energy flow depends on its square.'], ['It quadruples.'], ['It stays fixed.', 'A field-amplitude change alters the transported energy.']], 'Intensity is proportional to $E_0^2$. The new-to-old ratio is $2^2=4$.', 'Distinguish amplitude ratios from power ratios.'),
        check('mirror', 'Replace an absorber with a mirror', 'Radiation pressure', 'A perfectly reflecting mirror replaces a perfect absorber in the same normally incident beam. What is the ratio of the new pressure to the old?', [['One half', 'Reversing momentum increases the transferred momentum.'], ['One', 'This ignores the momentum carried away by the reflected wave.'], ['Two']], 'The laws give $(2I/c)/(I/c)=2$.', 'Pressure follows momentum transfer per unit time and area.'),
        check('unpolarised', 'Filter an unpolarised beam', 'Polarisation', 'Unpolarised light of intensity 100 W/m² crosses one ideal linear polariser. What is the transmitted intensity?', [['50 W/m²'], ['25 W/m²', 'Averaging the squared projection gives one half directly.'], ['100 W/m²', 'Only the field component parallel to the transmission axis passes.']], 'The mean squared projection fraction is one half. Multiplying by 100 W/m² gives 50 W/m².', 'Use the polarisation state immediately before the filter.'),
      ],
      takeaways: ['Intensity measures time-averaged energy flow across unit normal area.', 'A perfect mirror reverses the normal momentum at normal incidence.', 'Project field amplitude and square the result for the transmitted intensity.'],
      flashcards: [{ front: 'Which cross product points along electromagnetic energy flow in vacuum?', back: '$\\mathbf E\\times\\mathbf B$.' }, { front: 'What is the pressure of a normally incident beam on a perfect absorber?', back: '$I/c$.' }, { front: 'What fraction passes an ideal polariser at 45° to incident linear polarisation?', back: 'One half, since $\\cos^2 45^\\circ=1/2$.' }, { front: 'What sets the polarisation axis after an ideal linear polariser?', back: 'The transmission axis of the polariser, provided some light passes.' }],
      review: { aiAssisted: true, independentCheckOn: '2026-11-23', expertReview: null },
    },
  ],
};
