import { md, type Unit } from '../../types';
import { check } from './check';

export const induction: Unit = {
  slug: 'time-dependent-fields', title: 'Time-dependent fields',
  summary: 'Track changing flux through a loop, energy in an inductor and the magnetic field around a charging capacitor.',
  lessons: [
    {
      slug: 'induction-and-coupled-coils', title: 'Induction and coupled coils',
      summary: 'Predict the magnitude and sign of induced voltage when a field changes, a conductor moves or a nearby coil carries changing current.',
      minutes: 19, practice: null,
      objectives: ['Orient a loop and its flux consistently.', 'Distinguish changing-field and motional induction.', 'Calculate a mutually induced voltage from the primary current slope.'],
      teachMd: md`### Count flux through a specified loop

A pickup coil near a piece of electronics responds when the magnetic flux through it changes. To predict its reading, draw the loop and choose a normal to the area it encloses. Curl your right-hand fingers with your thumb along that normal. The fingers define the positive direction around the loop. For one turn, flux is $\Phi_B=\int\mathbf B\cdot d\mathbf A$. A uniform field across a flat area gives $\Phi_B=BA\cos\theta$, with the angle measured to the chosen normal. Flux can change because the field changes, because the area changes, or because the loop rotates. A field parallel to a flat loop gives zero flux through it.

For $N$ turns carrying the same flux, the flux linkage is $N\Phi_B$. Faraday's law gives the signed electromotive force $\mathcal E=-d(N\Phi_B)/dt$ around the oriented loop. A volt is a weber per second. For data at two times, the change in flux linkage divided by the elapsed time gives the **mean** emf, including its sign when you include the minus sign. A curved graph of flux against time has a different instantaneous slope at each point. A large steady flux can give a smaller signal than a small flux that changes rapidly.

### Understand the minus sign physically

Imagine a conducting ring viewed face on. A magnetic field pointing into the page is becoming weaker. If the ring can carry current and its self-inductance can be neglected, the induced current makes a field into the page to counter that decrease. Curl the fingers of the right hand to produce this field and they run clockwise as seen by the observer. The induced field can point the same way as the applied field when the latter is decreasing. Reversing the observer's viewpoint changes the words clockwise and anticlockwise, so specify the viewing side.

An emf is the work per unit charge that drives charge around the loop. The loop can have an induced emf even if a break prevents a sustained current. Finding current requires information about the circuit response as well as the emf. For a stationary thin loop the driving agent is a circulating electric field. Its line integral can be nonzero, so the electrostatic rule of zero work around a closed path no longer describes the entire electric field.

### Motion through a steady field

In a straight conducting rod moving with velocity $\mathbf u$, mobile charges experience the magnetic force $q\mathbf u\times\mathbf B$. Charges separate until an electric field balances this magnetic contribution in an open rod. The end towards which positive charge is pushed is at higher potential. When the rod, velocity and field are mutually perpendicular, the voltage magnitude across the rod is $B\ell u$. Its sign depends on which end you call positive. A sliding rod that completes a circuit on two rails changes the loop area as it moves. Computing the rate of change of flux through the completed loop gives the same emf magnitude.

### Which winding produced the flux?

The current in a coil produces a magnetic field that links its own turns. In a linear, fixed geometry the linkage is $LI$. A changing current produces a self-induced emf $-L\,dI/dt$. The henry measures webers of linkage per ampere. Neighbouring coils can also share flux. If the primary current produces a secondary linkage $M I_1$, a stationary secondary has induced emf $-M\,dI_1/dt$ using consistent winding orientations. Reversing the secondary leads reverses the measured polarity. A quoted mutual inductance magnitude allows a magnitude prediction even without a winding diagram.

Mutual induction is a way for a changing signal in one conductor to couple into another. A steady primary current can store considerable magnetic energy and still induce zero secondary emf. To reason about a fast current edge, sketch the primary current against time. Its steepest segment produces the largest secondary voltage for fixed geometry. Turning a pickup so that less of the primary field threads its area reduces the coupling. These conclusions follow from the flux linkage before any detailed circuit model is chosen.`,
      examples: [
        { id: 'pickup', title: 'Read a pickup coil', problemMd: 'A stationary 40-turn coil has area 2.0 cm² per turn. A uniform field normal to the turns drops from 0.30 T to 0.10 T in 4.0 ms. Find the mean emf magnitude.', steps: ['The flux change per turn has magnitude $2.0\\times10^{-4}\\times0.20=4.0\\times10^{-5}$ Wb.', 'Multiply by 40 to get the change in linkage, then divide by 0.0040 s.'], answerMd: 'The mean emf magnitude is 0.40 V.' },
        { id: 'rod', title: 'Identify the positive end', problemMd: 'An open 12 cm conducting rod lies along the y-axis. It moves at 3.0 m/s along +x in a uniform 0.50 T field along +z. Find the voltage magnitude and the higher-potential end.', steps: ['The positive-charge deflection follows $\\hat x\\times\\hat z=-\\hat y$, so positive charge collects towards the −y end.', 'All three axes are perpendicular. The voltage magnitude is $0.50\\times0.12\\times3.0$ V.'], answerMd: 'The −y end is positive relative to the +y end by 0.18 V.' },
      ],
      traps: [{ title: 'Opposing the field in every case', md: 'Draw the *change* in external flux. The induced response counteracts that change, including a decrease.' }, { title: 'Counting the turns twice', md: 'A flux linkage already includes the turns. Multiply by the turn count only when starting from flux through one turn.' }],
      check: [
        check('ring', 'Orient the induced current', 'Electromagnetic induction', 'As viewed from your side of an initially current-free, closed resistive ring, an external field points into the page and weakens. Which current does it induce?', [['Anticlockwise', 'That direction makes a field towards you and reinforces the decrease.'], ['Zero', 'A changing normal field changes the flux through the ring.'], ['Clockwise']], 'The ring produces a field into the page to oppose the reduction. The right-hand rule gives clockwise current.', 'Use the same viewing side for the field and the current.'),
        check('steady', 'Hold a loop still', 'Faraday’s law', 'A stationary single turn of area 5 cm² is perpendicular to a uniform steady 0.8 T field. What is the induced emf?', [['0 V'], ['0.4 mV', 'The numerical flux in milliwebers does not give a rate of change.'], ['0.8 V', 'A field magnitude alone cannot specify an induced voltage.']], 'The flux is constant because the field, area and orientation stay fixed. Its time derivative vanishes.', 'Distinguish a field reading from a time derivative.'),
        check('mutual', 'Pick up a current ramp', 'Mutual induction', 'Two stationary coils have mutual inductance of magnitude 8 mH. The primary current rises at 150 A/s. What is the magnitude of the induced secondary emf?', [['0.053 V', 'Mutual inductance multiplies the slope of current.'], ['1.2 V'], ['1,200 V', 'The prefix milli contributes a factor of one thousandth.']], '$|\\mathcal E_2|=M|dI_1/dt|=0.008\\times150=1.2$ V.', 'Express mutual inductance in henries before multiplying.'),
      ],
      takeaways: ['Choose a normal and a positive circuit orientation together.', 'A slope on a flux-linkage graph measures an induced voltage.', 'The winding orientation determines the sign of mutual induction.'],
      flashcards: [{ front: 'Which angle belongs in the magnetic flux of a flat loop?', back: 'The angle between the field and the area normal.' }, { front: 'What is one weber per second?', back: 'One volt.' }, { front: 'What produces charge separation in a moving open rod?', back: 'The magnetic force on charges moving with the rod.' }, { front: 'What happens in a secondary coil when a constant primary current flows in fixed geometry?', back: 'The primary linkage is constant, giving zero mutually induced emf.' }],
      review: { aiAssisted: true, independentCheckOn: '2026-11-23', expertReview: null },
    },
    {
      slug: 'maxwell-and-charge-conservation', title: 'Maxwell’s equations and charge conservation',
      summary: 'Connect integral and differential field laws, follow displacement current across a capacitor gap and account for magnetic energy.',
      minutes: 20, practice: null,
      objectives: ['Match each Maxwell equation to its integral and local meanings.', 'Use displacement current to account for a charging gap.', 'Relate the work done on an inductor to its stored energy.'],
      teachMd: md`### Two surfaces for one loop

Picture a wire feeding a charging parallel-plate capacitor in vacuum. Wrap an imaginary loop around the wire. A flat surface spanning the loop cuts the wire. You can also imagine a bulging surface sharing the same boundary which passes between the capacitor plates and avoids the metal. The magnetic circulation around the loop has one value. A rule that used only charge crossing the chosen surface would predict different values for the two surfaces during charging.

Maxwell's extension uses the changing electric flux as well as conduction current. In vacuum the result is $\oint\mathbf B\cdot d\boldsymbol\ell=\mu_0(I_{\rm through}+\epsilon_0\,d\Phi_E/dt)$ for a fixed path and spanning surface. The second term in parentheses is the displacement current. It has units of amperes. It can be nonzero in empty space. Electrons entering one plate need no path across the vacuum gap to create a changing electric field between the plates.

For ideal wide plates with negligible fringing, $E=Q/(\epsilon_0 A)$. Choose a surface in the gap capturing the whole flux. Then $\epsilon_0\Phi_E=Q$ with consistent orientation and the displacement current equals $dQ/dt$. Since a fixed ideal capacitor obeys $Q=CV$, the displacement-current magnitude is $C|dV/dt|$. A surface capturing only part of the uniform field captures a corresponding fraction of the changing flux. Extending the plate formula to a varying capacitance would require differentiating the whole product $CV$.

### Four laws, two ways to read them

Gauss's electric law reads $\oint\mathbf E\cdot d\mathbf A=Q_{\rm in}/\epsilon_0$ and locally $\nabla\cdot\mathbf E=\rho_q/\epsilon_0$. Here $\rho_q$ means charge per unit volume. The magnetic partner is $\oint\mathbf B\cdot d\mathbf A=0$, or $\nabla\cdot\mathbf B=0$. Divergence measures the net outward flux from a tiny volume divided by its volume. Integrating divergence over an extended volume adds neighbouring volumes whose fluxes across internal faces cancel.

Faraday's law for a stationary contour is $\oint\mathbf E\cdot d\boldsymbol\ell=-d\Phi_B/dt$, or $\nabla\times\mathbf E=-\partial\mathbf B/\partial t$. The local Ampère–Maxwell law is $\nabla\times\mathbf B=\mu_0\mathbf J+\mu_0\epsilon_0\,\partial\mathbf E/\partial t$. Curl describes circulation around a tiny loop per unit area, oriented by its normal. Adding adjacent small loops cancels their shared edges and leaves the outer boundary. This is the geometrical reason the local and integral forms describe the same field. For static fields, all time-derivative terms vanish. Magnetic circulation can still arise from a steady current.

### What counts as a current balance?

For a fixed volume the net outward conduction current is the rate at which charge inside decreases. Locally this gives $\partial\rho_q/\partial t+\nabla\cdot\mathbf J=0$. Take the divergence of the local Ampère–Maxwell law. The divergence of a curl is zero. Substituting electric Gauss's law for the divergence of the electric field gives precisely this continuity equation. The field law is consistent with local charge conservation even when a small piece of conductor is accumulating charge. During a steady state the accumulated charge is constant and the net outward current vanishes.

### Energy during a current ramp

To increase current in a linear, fixed inductor, a source must overcome its induced emf. Taking the passive sign convention, the terminal voltage is $v=L\,di/dt$. Multiplying by current gives the instantaneous power entering the inductor. Integrating from zero current to $I$ gives $U=LI^2/2$. When the current falls the stored energy can flow out. The magnetic energy resides in the field. In vacuum its density is $u_B=B^2/(2\mu_0)$. An air-core solenoid provides a check on this interpretation. Multiplying the nearly uniform interior energy density by the interior volume gives the same energy as the inductance formula in the long-solenoid approximation. The quadratic dependence also explains why reversing the current leaves the energy at a given current magnitude unchanged.`,
      examples: [
        { id: 'charging-gap', title: 'Follow a fast voltage edge', problemMd: 'Across a fixed 20 pF ideal vacuum capacitor, voltage rises at 0.30 V/ns. Find the displacement-current magnitude through the whole gap.', steps: ['Use $I_d=C|dV/dt|$ because the changing electric flux accounts for all the plate charge.', 'Convert the slope to $3.0\\times10^8$ V/s and multiply by $20\\times10^{-12}$ F.'], answerMd: 'The displacement current is 6.0 mA.' },
        { id: 'stored-field', title: 'Charge a magnetic field', problemMd: 'A linear 12 mH inductor carries 0.50 A. How much energy is stored?', steps: ['Use $U=LI^2/2$ with $L=0.012$ H.', 'Square the current to obtain 0.25 A² and multiply by half the inductance.'], answerMd: 'The field stores 0.0015 J, or 1.5 mJ.' },
      ],
      traps: [{ title: 'Treating displacement current as charge crossing a vacuum', md: 'The term measures the time derivative of electric flux. Conduction and displacement enter the same circulation law.' }, { title: 'Mixing a path and a surface', md: 'Curl laws use a path around the boundary of a spanning surface. Divergence laws use the outward flux over a closed surface.' }],
      check: [
        check('charge-rate', 'Count the arriving charge', 'Charge conservation', 'The charge stored in a fixed region increases by 6 nC in 3 µs. What was the mean net inward current?', [['0.5 mA', 'This reverses the ratio of charge to elapsed time.'], ['2 mA'], ['2 A', 'Nanocoulombs divided by microseconds gives milliamperes.']], 'Mean inward current is $\\Delta Q/\\Delta t=6\\times10^{-9}/(3\\times10^{-6})=0.002$ A.', 'Specify inward or outward before assigning the current sign.'),
        check('curl-e', 'Apply Faraday’s law', 'Maxwell’s equations', 'The magnetic flux through a fixed loop in vacuum is changing. Which quantity equals minus its rate of change?', [['Electric circulation around the loop'], ['Electric flux through the loop', 'Electric flux pairs with enclosed charge in the electric Gauss law for a closed surface.'], ['Magnetic circulation around the loop', 'Magnetic circulation responds to current and changing electric flux.']], 'The fixed-contour law gives $\\oint\\mathbf E\\cdot d\\boldsymbol\\ell=-d\\Phi_B/dt$.', 'Pair a changing flux with circulation of the other field.'),
        check('curl-b', 'Identify the field law', 'Maxwell’s equations', 'Conduction current through a fixed surface is held constant. Which law includes the changing electric flux when calculating magnetic circulation?', [['Magnetic Gauss law', 'This gives the closed magnetic flux.'], ['Faraday’s law', 'This connects electric circulation with changing magnetic flux.'], ['Ampère–Maxwell law']], 'The displacement term $\\mu_0\\epsilon_0\\,d\\Phi_E/dt$ contributes alongside conduction current.', 'Read the circulation on the left before picking the source on the right.'),
      ],
      takeaways: ['Divergence describes net flux per unit volume.', 'Curl describes oriented circulation per unit area.', 'Displacement current reconciles capacitor charging with magnetic circulation.', 'Stored magnetic energy scales with current squared.'],
      flashcards: [{ front: 'What does the continuity equation conserve?', back: 'Electric charge locally.' }, { front: 'What field source appears in electric Gauss’s law in vacuum?', back: 'The total enclosed charge in the integral form or the charge density in the local form.' }, { front: 'Which time derivative enters magnetic circulation?', back: 'The rate of change of electric flux.' }, { front: 'What energy does a linear inductor store?', back: '$LI^2/2$, measured in joules.' }],
      review: { aiAssisted: true, independentCheckOn: '2026-11-23', expertReview: null },
    },
  ],
};
