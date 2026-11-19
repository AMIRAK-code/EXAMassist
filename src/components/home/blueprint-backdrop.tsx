'use client';

import { useEffect, useRef } from 'react';

/**
 * The home page's moving drawing: geometric constructions in white line work
 * behind the content, tied to the scroll position.
 *
 * Complete at rest: the server renders every shape fully drawn, which is what
 * a visitor sees without JavaScript or with reduced motion. Otherwise GSAP and
 * ScrollTrigger load after hydration, in their own chunk (only this page asks
 * for them), and scrub one timeline across the whole page: the compass and
 * hexagon turn, the triangle and the parabola draw themselves as their part of
 * the page arrives, the wave runs and the registration marks drift.
 *
 * Drawn shapes carry pathLength="1", so "how much is drawn" is a dash offset
 * from 1 to 0 whatever the shape's real length.
 */

const LINE = '#eaf2ff';
const PENCIL = '#ffd24a';

const COMPASS = { x: 1150, y: 230, r: 210 };
const HEX = { x: 300, y: 220, r: 120 };

/** Tick marks round the compass circle, every 15 degrees, longer every 90. */
const TICKS = Array.from({ length: 24 }, (_, i) => {
  const a = (i * Math.PI) / 12;
  const inner = COMPASS.r + 4;
  const outer = COMPASS.r + (i % 6 === 0 ? 22 : 12);
  const p = (r: number) => [(COMPASS.x + r * Math.cos(a)).toFixed(1), (COMPASS.y + r * Math.sin(a)).toFixed(1)];
  const [x1, y1] = p(inner);
  const [x2, y2] = p(outer);
  return `M${x1} ${y1}L${x2} ${y2}`;
}).join('');

const HEX_POINTS = Array.from({ length: 6 }, (_, i) => {
  const a = (i * Math.PI) / 3 - Math.PI / 2;
  return `${(HEX.x + HEX.r * Math.cos(a)).toFixed(1)},${(HEX.y + HEX.r * Math.sin(a)).toFixed(1)}`;
}).join(' ');

/** Registration marks scattered over the sheet. */
const CROSSES = [
  [620, 120], [860, 420], [90, 470], [1380, 520], [700, 690], [420, 860], [1040, 880], [240, 640],
];

/** Two and a half periods of a sine wave, wider than the sheet so it can run sideways. */
const WAVE = (() => {
  const parts: string[] = [];
  for (let x = -200; x <= 1900; x += 20) {
    const y = 450 + 26 * Math.sin((x / 420) * Math.PI * 2);
    parts.push(`${parts.length ? 'L' : 'M'}${x} ${y.toFixed(1)}`);
  }
  return parts.join('');
})();

export function BlueprintBackdrop() {
  const root = useRef<SVGSVGElement>(null);

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
        // Shapes marked "late" start undrawn and are drawn by the scroll.
        gsap.set(q('[data-draw]'), { strokeDasharray: 1, strokeDashoffset: 0 });
        gsap.set(q('[data-draw="late"]'), { strokeDashoffset: 1 });
        gsap.set(q('[data-reveal]'), { opacity: 0 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
        });
        tl.to(q('[data-g="compass"]'), { rotation: 150, svgOrigin: `${COMPASS.x} ${COMPASS.y}`, duration: 1 }, 0)
          .to(q('[data-g="compass-inner"]'), { rotation: -110, svgOrigin: `${COMPASS.x} ${COMPASS.y}`, duration: 1 }, 0)
          .to(q('[data-g="hex"]'), { rotation: -120, scale: 1.25, svgOrigin: `${HEX.x} ${HEX.y}`, duration: 1 }, 0)
          .to(q('[data-g="wave"]'), { x: -420, duration: 1 }, 0)
          .to(q('[data-g="crosses"]'), { y: -200, duration: 1 }, 0)
          .to(q('[data-g="arcs"]'), { rotation: 200, svgOrigin: '1300 880', duration: 1 }, 0)
          .to(q('[data-g="triangle"] [data-draw="late"]'), { strokeDashoffset: 0, duration: 0.28, stagger: 0.04 }, 0.08)
          .to(q('[data-g="triangle"] [data-reveal]'), { opacity: 1, duration: 0.08 }, 0.36)
          .to(q('[data-g="graph"] [data-draw="late"]'), { strokeDashoffset: 0, duration: 0.3, stagger: 0.05 }, 0.4)
          .to(q('[data-g="graph"] [data-reveal]'), { opacity: 1, duration: 0.06 }, 0.72);
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
      <g opacity="0.16">
        <g data-g="wave">
          <path d={WAVE} strokeDasharray="6 10" />
        </g>
      </g>

      <g opacity="0.34">
        {/* Compass construction, top right. */}
        <g data-g="compass">
          <circle data-draw="" pathLength={1} cx={COMPASS.x} cy={COMPASS.y} r={COMPASS.r} />
          <path d={TICKS} />
          <path d={`M${COMPASS.x} ${COMPASS.y}L${COMPASS.x + COMPASS.r} ${COMPASS.y}`} stroke={PENCIL} />
          <circle cx={COMPASS.x + COMPASS.r} cy={COMPASS.y} r="5" fill={PENCIL} stroke="none" />
        </g>
        <g data-g="compass-inner">
          <circle cx={COMPASS.x} cy={COMPASS.y} r="150" strokeDasharray="4 9" />
          <path d={`M${COMPASS.x - 150} ${COMPASS.y}L${COMPASS.x + 150} ${COMPASS.y}M${COMPASS.x} ${COMPASS.y - 150}L${COMPASS.x} ${COMPASS.y + 150}`} strokeDasharray="2 6" />
        </g>
        <path d={`M${COMPASS.x - 10} ${COMPASS.y}h20M${COMPASS.x} ${COMPASS.y - 10}v20`} />

        {/* Hexagon with its circumcircle, top left. */}
        <g data-g="hex">
          <polygon data-draw="" pathLength={1} points={HEX_POINTS} />
          <circle cx={HEX.x} cy={HEX.y} r={HEX.r} strokeDasharray="3 7" />
          <path d={`M${HEX.x} ${HEX.y - HEX.r}L${HEX.x} ${HEX.y + HEX.r}`} strokeDasharray="2 6" />
        </g>

        {/* A 3-4-5 right triangle with its dimensions, bottom left. */}
        <g data-g="triangle">
          <polygon data-draw="late" pathLength={1} points="170,760 170,480 543,760" />
          <path data-draw="late" pathLength={1} d="M170 736h24v24" />
          <path data-draw="late" pathLength={1} d="M130 480v280M122 480h16M122 760h16" />
          <path data-draw="late" pathLength={1} d="M170 800h373M170 792v16M543 792v16" />
          <g data-reveal="" fill={LINE} stroke="none" fontFamily="ui-monospace, monospace" fontSize="15">
            <text x="96" y="625">3</text>
            <text x="350" y="826">4</text>
            <text x="372" y="606" fill={PENCIL}>5</text>
          </g>
        </g>

        {/* y = x² - 4x + 3 on its axes, bottom right. */}
        <g data-g="graph">
          {/* One unit is 72 px: roots at x = 1 and 3, vertex at x = 2. */}
          <path data-draw="late" pathLength={1} d="M880 760H1380M986 860V520" />
          <path data-draw="late" pathLength={1} d="M930 560Q1130 1020 1330 560" stroke={PENCIL} />
          <g data-reveal="">
            <circle cx="1130" cy="790" r="6" fill={PENCIL} stroke="none" />
            <path d="M1058 752v16M1202 752v16" />
          </g>
        </g>

        {/* Concentric arcs, bottom right corner. */}
        <g data-g="arcs" strokeDasharray="5 9">
          <circle cx="1300" cy="880" r="90" />
          <circle cx="1300" cy="880" r="140" />
          <circle cx="1300" cy="880" r="190" />
        </g>

        <g data-g="crosses">
          {CROSSES.map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x - 9} ${y}h18M${x} ${y - 9}v18`} />
          ))}
        </g>
      </g>
    </svg>
  );
}
