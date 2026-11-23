'use client';

import { useState } from 'react';

const percent = (fraction: number) => `${(fraction * 100).toFixed(1)}%`;

export function PolarisationLab() {
  const [angle, setAngle] = useState(45);
  const [incident, setIncident] = useState(80);
  const fieldFraction = angle === 90 ? 0 : Math.cos(angle * Math.PI / 180);
  const powerFraction = fieldFraction ** 2;

  return (
    <section aria-labelledby="polarisation-lab" className="mt-10 rounded-card border border-line bg-surface p-5 sm:p-6">
      <h2 id="polarisation-lab" className="font-heading text-2xl font-semibold">Rotate a polariser</h2>
      <p className="mt-2 text-ink-muted">Look along the beam. The incoming light is linearly polarised along the horizontal. Predict the intensity at 60°, then turn the filter.</p>
      <div className="mt-6 grid items-center gap-6 sm:grid-cols-2">
        <figure className="rounded-card bg-paper p-5 text-center">
          <div aria-hidden="true" className="relative mx-auto grid aspect-square w-full max-w-44 place-items-center rounded-full border-2 border-line-strong bg-surface">
            <span className="absolute h-0 w-[90%] border-t-2 border-dashed border-ink" />
            <span className="absolute h-1 w-[76%] rounded-full bg-accent" style={{ transform: `rotate(-${angle}deg)` }} />
            <span className="absolute size-2 rounded-full bg-ink" />
          </div>
          <figcaption className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
            <span><span className="me-1 inline-block w-5 align-middle border-t-2 border-dashed border-ink" />Incident field</span>
            <span><span className="me-1 inline-block w-5 align-middle border-t-2 border-accent" />Filter axis</span>
          </figcaption>
        </figure>
        <div className="space-y-5">
          <label className="block">
            <span className="flex justify-between gap-2 font-semibold">Filter angle <span>{angle}°</span></span>
            <input className="mt-2 block w-full accent-accent" aria-label="Filter angle" aria-valuetext={`${angle} degrees`} type="range" min="0" max="90" step="1" value={angle} onChange={event => setAngle(event.currentTarget.valueAsNumber)} />
          </label>
          <label className="block">
            <span className="flex justify-between gap-2 font-semibold">Incident intensity <span>{incident} W/m²</span></span>
            <input className="mt-2 block w-full accent-accent" aria-label="Incident intensity" aria-valuetext={`${incident} watts per square metre`} type="range" min="10" max="200" step="5" value={incident} onChange={event => setIncident(event.currentTarget.valueAsNumber)} />
          </label>
          <div className="border-t border-line pt-4">
            <p className="text-sm text-ink-muted">Transmitted intensity</p>
            <output aria-label="Transmitted intensity" className="block text-3xl font-semibold">{(incident * powerFraction).toFixed(1)} W/m²</output>
            <div aria-hidden="true" className="my-2 h-2 overflow-hidden rounded-full bg-surface-sunken"><div className="h-full bg-accent" style={{ width: percent(powerFraction) }} /></div>
            <p className="text-sm text-ink-muted">Field amplitude {percent(fieldFraction)} · Intensity {percent(powerFraction)} of input</p>
          </div>
        </div>
      </div>
    </section>
  );
}
