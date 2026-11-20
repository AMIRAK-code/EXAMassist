'use client';

import { useEffect, useRef } from 'react';

/**
 * The home page's moving drawing: a sheet of mathematics in white line work
 * behind the content, tied to the scroll position.
 *
 * - A unit circle whose radius turns as the page scrolls, with a live readout
 *   of the angle and its sine and cosine.
 * - The Fibonacci tiling (squares of 1, 1, 2, 3, 5 and 8) and its golden
 *   spiral, which draws itself.
 * - A 3-4-5 right triangle with its dimensions and Pythagoras' sum.
 * - The parabola f(x) = x² - 4x + 3 on numbered axes, with its roots and vertex.
 * - A number line and the digits of π that slide sideways, and formulas that
 *   drift at their own speeds.
 *
 * Complete at rest: the server renders every shape fully drawn with the angle
 * at 60°, which is what a visitor sees without JavaScript or with reduced
 * motion. Otherwise GSAP and ScrollTrigger load after hydration, in their own
 * chunk (only this page asks for them), and scrub one timeline across the
 * whole page. Drawn shapes carry pathLength="1", so "how much is drawn" is a
 * dash offset from 1 to 0 whatever the shape's real length.
 */

const LINE = '#eaf2ff';
const PENCIL = '#ffd24a';
const MONO = { fontFamily: 'var(--font-martian), Consolas, ui-monospace, monospace' };

// --- Unit circle -----------------------------------------------------------
const UC = { x: 300, y: 240, r: 120 };
const START_DEG = 60;
/** A point on the circle at a mathematical angle (counter-clockwise, y up). */
const onCircle = (deg: number, r = UC.r) => {
  const a = (deg * Math.PI) / 180;
  return { x: +(UC.x + r * Math.cos(a)).toFixed(1), y: +(UC.y - r * Math.sin(a)).toFixed(1) };
};
const ANGLES: Array<[number, string]> = [
  [0, '0'], [30, 'π/6'], [45, 'π/4'], [60, 'π/3'], [90, 'π/2'], [180, 'π'], [270, '3π/2'],
];
const START = onCircle(START_DEG);

// --- Fibonacci tiling, in units of 24 px from (1000, 110) ----------------
const FU = 24;
const fx = (u: number) => 1000 + u * FU;
const fy = (u: number) => 110 + u * FU;
/** [x, y, side] of each square, largest first. */
const FIB: Array<[number, number, number]> = [
  [0, 0, 8], [8, 0, 5], [10, 5, 3], [8, 6, 2], [8, 5, 1], [9, 5, 1],
];
/** The golden spiral: a quarter circle through each square, outside in. */
const SPIRAL =
  `M${fx(0)} ${fy(8)}` +
  `A${8 * FU} ${8 * FU} 0 0 1 ${fx(8)} ${fy(0)}` +
  `A${5 * FU} ${5 * FU} 0 0 1 ${fx(13)} ${fy(5)}` +
  `A${3 * FU} ${3 * FU} 0 0 1 ${fx(10)} ${fy(8)}` +
  `A${2 * FU} ${2 * FU} 0 0 1 ${fx(8)} ${fy(6)}` +
  `A${FU} ${FU} 0 0 1 ${fx(9)} ${fy(5)}` +
  `A${FU} ${FU} 0 0 1 ${fx(10)} ${fy(6)}`;

// --- Parabola f(x) = x² - 4x + 3: origin at (1000, 760), 56 px a unit -----
const PX = (x: number) => 1000 + 56 * x;
const PY = (y: number) => 760 - 56 * y;
// The arc from x = -0.2 to x = 4.2 is one quadratic Bézier; its control point
// is where the tangents at the two ends meet, at x = 2, y = -5.84.
const PARABOLA = `M${PX(-0.2)} ${PY(3.84)}Q${PX(2)} ${PY(-5.84)} ${PX(4.2)} ${PY(3.84)}`;

// --- Number line, wider than the sheet so it can slide --------------------
const NL_Y = 486;
const NUMBER_TICKS = Array.from({ length: 46 }, (_, i) => i - 4); // -4 … 41, every 48 px from x = -192

// The first fifty decimals of π.
const PI_DIGITS = '3.14159 26535 89793 23846 26433 83279 50288 41971 69399 37510 …';

/** Formulas that drift upwards at their own speeds: [x, y, drift, text]. */
const FORMULAS: Array<[number, number, number, string]> = [
  [580, 140, 120, 'a² + b² = c²'],
  [800, 200, 200, '√2 ≈ 1.41421'],
  [560, 600, 160, 'Δ = b² − 4ac'],
  [640, 676, 260, '∫₀¹ x dx = ½'],
  [560, 760, 180, '1 + 2 + … + n = n(n+1)/2'],
  [620, 846, 240, 'log₁₀ 1000 = 3'],
];

const sin = (deg: number) => Math.sin((deg * Math.PI) / 180);
const cos = (deg: number) => Math.cos((deg * Math.PI) / 180);
const fixed = (n: number) => (Math.abs(n) < 0.0005 ? 0 : n).toFixed(3).replace('-', '−');

export function BlueprintBackdrop() {
  const root = useRef<SVGSVGElement>(null);
  const thetaText = useRef<SVGTSpanElement>(null);
  const sinText = useRef<SVGTSpanElement>(null);
  const cosText = useRef<SVGTSpanElement>(null);

  useEffect(() => {
    const svg = root.current;
    if (!svg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(svg);
        gsap.set(q('[data-draw]'), { strokeDasharray: 1, strokeDashoffset: 0 });
        gsap.set(q('[data-draw="late"]'), { strokeDashoffset: 1 });
        gsap.set(q('[data-reveal]'), { opacity: 0 });

        // The readout follows the radius: 60° at the top of the page, a full turn at the bottom.
        const angle = { deg: START_DEG };
        const readout = () => {
          // Sine and cosine of the angle as shown, so θ = 180° reads sin θ = 0.000.
          const deg = Math.round(angle.deg) % 360;
          if (thetaText.current) thetaText.current.textContent = `${deg}°`;
          if (sinText.current) sinText.current.textContent = fixed(sin(deg));
          if (cosText.current) cosText.current.textContent = fixed(cos(deg));
        };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
        });
        tl.to(q('[data-g="radius"]'), { rotation: -(360 - START_DEG), svgOrigin: `${UC.x} ${UC.y}`, duration: 1 }, 0)
          .to(angle, { deg: 360, duration: 1, onUpdate: readout }, 0)
          .to(q('[data-g="spiral"] [data-draw="late"]'), { strokeDashoffset: 0, duration: 0.3 }, 0.02)
          .to(q('[data-g="spiral"] [data-reveal]'), { opacity: 1, duration: 0.05, stagger: 0.03 }, 0.05)
          .to(q('[data-g="numberline"]'), { x: -480, duration: 1 }, 0)
          .to(q('[data-g="pi"]'), { x: -620, duration: 1 }, 0)
          .to(q('[data-g="triangle"] [data-draw="late"]'), { strokeDashoffset: 0, duration: 0.24, stagger: 0.04 }, 0.14)
          .to(q('[data-g="triangle"] [data-reveal]'), { opacity: 1, duration: 0.06, stagger: 0.02 }, 0.34)
          .to(q('[data-g="graph"] [data-draw="late"]'), { strokeDashoffset: 0, duration: 0.28, stagger: 0.05 }, 0.42)
          .to(q('[data-g="graph"] [data-reveal]'), { opacity: 1, duration: 0.06, stagger: 0.02 }, 0.7);
        q('[data-drift]').forEach((el: Element) => {
          tl.to(el, { y: -Number(el.getAttribute('data-drift')), duration: 1 }, 0);
        });
      }, svg);
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <svg
      ref={root}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      fill="none"
      stroke={LINE}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Number line and the digits of π, sliding left. */}
      <g opacity="0.22">
        <g data-g="numberline">
          <path d={`M-200 ${NL_Y}H1960`} />
          {NUMBER_TICKS.map((n) => {
            const x = 48 * n;
            return <path key={n} d={`M${x} ${NL_Y - (n % 5 === 0 ? 9 : 5)}v${n % 5 === 0 ? 18 : 10}`} />;
          })}
          <g fill={LINE} stroke="none" fontSize="13" textAnchor="middle" style={MONO}>
            {NUMBER_TICKS.filter((n) => n % 5 === 0).map((n) => (
              <text key={n} x={48 * n} y={NL_Y + 30}>{String(n).replace('-', '−')}</text>
            ))}
          </g>
        </g>
      </g>
      <g opacity="0.3" fill={LINE} stroke="none" fontSize="20" style={{ ...MONO, letterSpacing: '0.12em' }}>
        <text data-g="pi" x="520" y="430">π = {PI_DIGITS}</text>
      </g>

      <g opacity="0.36">
        {/* Unit circle with a turning radius, top left. */}
        <g>
          <circle data-draw="" pathLength={1} cx={UC.x} cy={UC.y} r={UC.r} />
          <path d={`M${UC.x - UC.r - 30} ${UC.y}H${UC.x + UC.r + 30}M${UC.x} ${UC.y + UC.r + 30}V${UC.y - UC.r - 30}`} strokeDasharray="3 6" />
          {ANGLES.map(([deg]) => {
            const a = onCircle(deg, UC.r - 6);
            const b = onCircle(deg, UC.r + 6);
            return <path key={deg} d={`M${a.x} ${a.y}L${b.x} ${b.y}`} />;
          })}
          <g fill={LINE} stroke="none" fontSize="14" textAnchor="middle" style={MONO}>
            {ANGLES.map(([deg, label]) => {
              const p = onCircle(deg, UC.r + 26);
              return <text key={deg} x={p.x} y={p.y + 5}>{label}</text>;
            })}
            <text x={UC.x - UC.r + 12} y={UC.y + 20}>−1</text>
            <text x={UC.x + UC.r - 10} y={UC.y + 20}>1</text>
          </g>
          <g data-g="radius">
            <path d={`M${UC.x} ${UC.y}L${START.x} ${START.y}`} stroke={PENCIL} strokeWidth="1.6" />
            <path d={`M${START.x} ${START.y}V${UC.y}`} stroke={PENCIL} strokeDasharray="3 5" />
            <circle cx={START.x} cy={START.y} r="5" fill={PENCIL} stroke="none" />
          </g>
          <g fill={LINE} stroke="none" fontSize="15" style={MONO}>
            <text x={UC.x - UC.r - 40} y={UC.y + UC.r + 56}>
              θ = <tspan ref={thetaText} fill={PENCIL}>{START_DEG}°</tspan>
            </text>
            <text x={UC.x - UC.r - 40} y={UC.y + UC.r + 78}>
              sin θ = <tspan ref={sinText}>{fixed(sin(START_DEG))}</tspan>
              {'  '}cos θ = <tspan ref={cosText}>{fixed(cos(START_DEG))}</tspan>
            </text>
            <text x={UC.x - UC.r - 40} y={UC.y + UC.r + 100} opacity="0.75">sin²θ + cos²θ = 1</text>
          </g>
        </g>

        {/* Fibonacci squares and the golden spiral, top right. */}
        <g data-g="spiral">
          {FIB.map(([x, y, side], i) => (
            <rect key={i} x={fx(x)} y={fy(y)} width={side * FU} height={side * FU} />
          ))}
          <path data-draw="late" pathLength={1} d={SPIRAL} stroke={PENCIL} strokeWidth="1.6" />
          <g fill={LINE} stroke="none" textAnchor="middle" style={MONO}>
            {FIB.map(([x, y, side], i) => (
              <text
                key={i}
                data-reveal=""
                x={fx(x + side / 2)}
                y={fy(y + side / 2) + side * 2.6}
                fontSize={Math.max(9, side * 7)}
              >
                {side}
              </text>
            ))}
            <text data-reveal="" x={fx(6.5)} y={fy(8) + 34} fontSize="15">φ = (1 + √5)/2 ≈ 1.618</text>
          </g>
        </g>

        {/* A 3-4-5 right triangle (80 px a unit) with its dimensions, bottom left. */}
        <g data-g="triangle">
          <polygon data-draw="late" pathLength={1} points="170,760 170,520 490,760" />
          <path data-draw="late" pathLength={1} d="M170 736h24v24" />
          <path data-draw="late" pathLength={1} d="M130 520v240M122 520h16M122 760h16" />
          <path data-draw="late" pathLength={1} d="M170 800h320M170 792v16M490 792v16" />
          <g fill={LINE} stroke="none" fontSize="16" style={MONO}>
            <text data-reveal="" x="100" y="646">3</text>
            <text data-reveal="" x="324" y="828">4</text>
            <text data-reveal="" x="344" y="624" fill={PENCIL}>5</text>
            <text data-reveal="" x="140" y="870" fontSize="17">3² + 4² = 5²  ·  9 + 16 = 25</text>
          </g>
        </g>

        {/* f(x) = x² - 4x + 3 on numbered axes, bottom right. */}
        <g data-g="graph">
          <path data-draw="late" pathLength={1} d={`M${PX(-1.4)} ${PY(0)}H${PX(5.6)}M${PX(0)} ${PY(-1.6)}V${PY(4.2)}`} />
          <path data-draw="late" pathLength={1} d={PARABOLA} stroke={PENCIL} strokeWidth="1.6" />
          <g data-reveal="">
            {[-1, 1, 2, 3, 4, 5].map((n) => <path key={`x${n}`} d={`M${PX(n)} ${PY(0) - 5}v10`} />)}
            {[-1, 1, 2, 3, 4].map((n) => <path key={`y${n}`} d={`M${PX(0) - 5} ${PY(n)}h10`} />)}
          </g>
          <g data-reveal="" fill={LINE} stroke="none" fontSize="13" textAnchor="middle" style={MONO}>
            {[-1, 1, 2, 3, 4, 5].map((n) => (
              <text key={`xl${n}`} x={PX(n)} y={PY(0) + 24}>{String(n).replace('-', '−')}</text>
            ))}
            {[-1, 1, 2, 3, 4].map((n) => (
              <text key={`yl${n}`} x={PX(0) - 20} y={PY(n) + 5}>{String(n).replace('-', '−')}</text>
            ))}
            <text x={PX(0) - 14} y={PY(0) + 24}>0</text>
          </g>
          <g data-reveal="">
            <circle cx={PX(1)} cy={PY(0)} r="5" fill={PENCIL} stroke="none" />
            <circle cx={PX(3)} cy={PY(0)} r="5" fill={PENCIL} stroke="none" />
            <circle cx={PX(2)} cy={PY(-1)} r="5" fill={PENCIL} stroke="none" />
          </g>
          <g data-reveal="" fill={LINE} stroke="none" fontSize="15" style={MONO}>
            <text x={PX(2) + 14} y={PY(-1) + 22}>(2, −1)</text>
            {/* Left of the curve's left arm, clear of the number line above. */}
            <text x={PX(-0.3)} y={PY(3.2)} textAnchor="end" fill={PENCIL}>f(x) = x² − 4x + 3</text>
            <text x={PX(-0.3)} y={PY(3.2) + 24} textAnchor="end">= (x − 1)(x − 3)</text>
          </g>
        </g>
      </g>

      {/* Formulas drifting upwards, each at its own speed. */}
      <g opacity="0.3" fill={LINE} stroke="none" fontSize="18" style={MONO}>
        {FORMULAS.map(([x, y, drift, text]) => (
          <text key={text} data-drift={drift} x={x} y={y}>{text}</text>
        ))}
        <text data-drift="140" x="640" y="300">
          e<tspan dy="-9" fontSize="12">iπ</tspan><tspan dy="9"> + 1 = 0</tspan>
        </text>
      </g>
    </svg>
  );
}
