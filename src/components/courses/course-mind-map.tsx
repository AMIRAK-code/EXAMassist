'use client';

import { useId, useState, type KeyboardEvent } from 'react';

/**
 * An interactive mind map of a course: the test in the centre, its units as
 * branches (with what the test gives each area), and a unit's lessons fanned
 * out beside it when the unit is opened. One unit is open at a time, so the
 * lesson titles never overlap; the first is open on load, so the page saved
 * as a static file (src/lib/seo/static-pages.ts) shows a full branch even
 * before any script runs.
 *
 * Wide screens get the drawn map (SVG); narrow ones the same state as a list
 * of branch buttons and the open branch's lessons, since a drawn map would
 * shrink its text below reading size. Both are real controls: branches are
 * buttons with aria-expanded, lessons are links.
 */

export interface MindMapLesson {
  title: string;
  href: string;
  /** Its reading time, already formatted ("18 min"). */
  time: string;
}

export interface MindMapBranch {
  id: string;
  title: string;
  /** A short line under the branch title, e.g. "24 questions". */
  note?: string;
  lessons: MindMapLesson[];
}

export interface MindMapLabels {
  /** Accessible name of the drawn map. */
  map: string;
  /** "{n} lessons", already formatted per branch. */
  lessonCounts: Record<string, string>;
  hint: string;
}

const TONES = [
  { stroke: 'var(--color-accent)', fill: 'var(--color-accent-soft)', ink: 'var(--color-accent-ink)' },
  { stroke: 'var(--color-positive)', fill: 'var(--color-positive-soft)', ink: 'var(--color-positive)' },
  { stroke: 'var(--color-caution)', fill: 'var(--color-caution-soft)', ink: 'var(--color-caution)' },
  { stroke: 'var(--color-negative)', fill: 'var(--color-negative-soft)', ink: 'var(--color-negative)' },
  { stroke: 'var(--color-ink-muted)', fill: 'var(--color-surface-sunken)', ink: 'var(--color-ink)' },
] as const;

const WIDTH = 1120;
const ROOT_W = 210;
const BRANCH_W = 220;
const LESSON_W = 300;
const LESSON_GAP = 46;
const BRANCH_GAP = 120;

function clip(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

export function CourseMindMap({
  centre,
  centreNote,
  branches,
  labels,
}: {
  centre: string;
  centreNote: string;
  branches: MindMapBranch[];
  labels: MindMapLabels;
}) {
  const [open, setOpen] = useState<string | null>(branches[0]?.id ?? null);
  const baseId = useId();
  const toggle = (id: string) => setOpen((current) => (current === id ? null : id));
  const onKey = (id: string) => (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle(id);
    }
  };

  // Branches alternate right and left of the centre, top to bottom.
  const right = branches.filter((_, i) => i % 2 === 0);
  const left = branches.filter((_, i) => i % 2 === 1);
  const maxLessons = Math.max(0, ...branches.map((b) => b.lessons.length));
  const height = Math.max(520, Math.max(right.length, left.length) * BRANCH_GAP + 80, maxLessons * LESSON_GAP + 80);
  const cx = WIDTH / 2;
  const cy = height / 2;

  const placed = branches.map((branch, index) => {
    const side = index % 2 === 0 ? 1 : -1;
    const column = side === 1 ? right : left;
    const row = column.indexOf(branch);
    const y = cy + (row - (column.length - 1) / 2) * BRANCH_GAP;
    const x = cx + side * 250;
    const lessonX = x + side * (BRANCH_W / 2 + 60 + LESSON_W / 2);
    const top = Math.min(Math.max(y - ((branch.lessons.length - 1) * LESSON_GAP) / 2, 40), height - 40 - (branch.lessons.length - 1) * LESSON_GAP);
    return { branch, index, side, x, y, lessonX, top, tone: TONES[index % TONES.length] };
  });

  return (
    <div>
      {/* The drawn map, from 768 px. */}
      <div className="hidden md:block">
        <svg
          viewBox={`0 0 ${WIDTH} ${height}`}
          className="h-auto w-full"
          role="group"
          aria-label={labels.map}
          style={{ fontFamily: 'inherit' }}
        >
          {placed.map(({ branch, x, y, side, lessonX, top, tone }) => {
            const isOpen = open === branch.id;
            const startX = cx + side * (ROOT_W / 2);
            const endX = x - side * (BRANCH_W / 2);
            return (
              <g key={`links-${branch.id}`}>
                <path
                  d={`M ${startX} ${cy} C ${(startX + endX) / 2} ${cy}, ${(startX + endX) / 2} ${y}, ${endX} ${y}`}
                  fill="none"
                  stroke={tone.stroke}
                  strokeWidth={isOpen ? 3 : 2}
                  opacity={open && !isOpen ? 0.45 : 1}
                />
                {isOpen
                  ? branch.lessons.map((lesson, i) => {
                      const ly = top + i * LESSON_GAP;
                      const fromX = x + side * (BRANCH_W / 2);
                      const toX = lessonX - side * (LESSON_W / 2);
                      return (
                        <path
                          key={lesson.href}
                          d={`M ${fromX} ${y} C ${(fromX + toX) / 2} ${y}, ${(fromX + toX) / 2} ${ly}, ${toX} ${ly}`}
                          fill="none"
                          stroke={tone.stroke}
                          strokeWidth={1.5}
                          className="mind-map-fade"
                        />
                      );
                    })
                  : null}
              </g>
            );
          })}

          <g>
            <rect x={cx - ROOT_W / 2} y={cy - 44} width={ROOT_W} height={88} rx={18} fill="var(--color-ink)" />
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize={17} fontWeight={700} fill="var(--color-ink-inverse)">
              {clip(centre, 22)}
            </text>
            <text x={cx} y={cy + 20} textAnchor="middle" fontSize={13} fill="var(--color-ink-inverse-muted)">
              {clip(centreNote, 30)}
            </text>
          </g>

          {placed.map(({ branch, x, y, tone }) => {
            const isOpen = open === branch.id;
            return (
              <g
                key={branch.id}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-${branch.id}`}
                aria-label={`${branch.title}${branch.note ? `, ${branch.note}` : ''}, ${labels.lessonCounts[branch.id]}`}
                onClick={() => toggle(branch.id)}
                onKeyDown={onKey(branch.id)}
                className="mind-map-branch cursor-pointer"
              >
                <rect
                  x={x - BRANCH_W / 2}
                  y={y - 34}
                  width={BRANCH_W}
                  height={68}
                  rx={14}
                  fill={isOpen ? tone.stroke : tone.fill}
                  stroke={tone.stroke}
                  strokeWidth={2}
                />
                <text x={x} y={y - 6} textAnchor="middle" fontSize={15} fontWeight={700} fill={isOpen ? 'var(--color-accent-contrast)' : tone.ink}>
                  {clip(branch.title, 26)}
                </text>
                <text x={x} y={y + 16} textAnchor="middle" fontSize={12} fill={isOpen ? 'var(--color-accent-contrast)' : 'var(--color-ink-muted)'}>
                  {clip([branch.note, labels.lessonCounts[branch.id]].filter(Boolean).join(' · '), 34)}
                </text>
              </g>
            );
          })}

          {placed.map(({ branch, lessonX, top, tone }) =>
            open === branch.id ? (
              <g key={`lessons-${branch.id}`} id={`${baseId}-${branch.id}`} className="mind-map-fade">
                {branch.lessons.map((lesson, i) => {
                  const ly = top + i * LESSON_GAP;
                  return (
                    <a key={lesson.href} href={lesson.href} aria-label={`${lesson.title}, ${lesson.time}`} className="mind-map-lesson">
                      <title>{lesson.title}</title>
                      <rect x={lessonX - LESSON_W / 2} y={ly - 17} width={LESSON_W} height={34} rx={17} fill="var(--color-surface)" stroke={tone.stroke} strokeWidth={1.5} />
                      <text x={lessonX - LESSON_W / 2 + 16} y={ly + 5} fontSize={13} fill="var(--color-ink)">
                        {clip(lesson.title, 40)}
                      </text>
                    </a>
                  );
                })}
              </g>
            ) : null,
          )}
        </svg>
        <p className="mt-2 text-sm text-ink-subtle">{labels.hint}</p>
      </div>

      {/* The same map as a list, below 768 px. */}
      <div className="md:hidden">
        <div className="rounded-card bg-ink px-4 py-3 text-center text-ink-inverse">
          <p className="font-heading font-semibold">{centre}</p>
          <p className="text-sm text-ink-inverse-muted">{centreNote}</p>
        </div>
        <ul className="mt-3 space-y-2">
          {placed.map(({ branch, tone }) => {
            const isOpen = open === branch.id;
            return (
              <li key={branch.id} className="rounded-card border-s-4 bg-surface" style={{ borderColor: tone.stroke }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${baseId}-list-${branch.id}`}
                  onClick={() => toggle(branch.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start"
                >
                  <span>
                    <span className="block font-semibold">{branch.title}</span>
                    <span className="block text-sm text-ink-muted">
                      {[branch.note, labels.lessonCounts[branch.id]].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-ink-subtle">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen ? (
                  <ol id={`${baseId}-list-${branch.id}`} className="space-y-1 px-4 pb-3">
                    {branch.lessons.map((lesson) => (
                      <li key={lesson.href}>
                        <a href={lesson.href} className="flex justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-surface-sunken">
                          <span>{lesson.title}</span>
                          <span className="shrink-0 text-sm text-ink-subtle">{lesson.time}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
