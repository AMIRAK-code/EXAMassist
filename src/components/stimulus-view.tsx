/**
 * Pure presentational rendering of a passage, table or chart.
 *
 * No server-only imports, so the same component serves the server-rendered
 * public pages and the client-side practice player. Markdown is rendered to
 * HTML by the caller (always on the server) and passed in as a string.
 */

export interface ChartSpec {
  type: 'bar' | 'line' | 'scatter';
  xKey: string;
  yKeys: string[];
  xLabel: string;
  yLabel: string;
}

export interface StimulusData {
  columns: Array<{ key: string; label: string }>;
  rows: Array<Record<string, string | number>>;
  caption: string;
  chart: ChartSpec | null;
}

export interface StimulusViewModel {
  id: string;
  title: string | null;
  bodyHtml: string | null;
  data: StimulusData | null;
  accessibilityText: string;
}

const SERIES_COLOURS = ['#1d4e6e', '#98322b', '#1c6b45', '#7a5407'];

/**
 * A small, dependency-free chart.
 *
 * The chart is labelled for assistive technology, but the authoritative copy of
 * the data is the table rendered underneath it, which is never hidden: learners
 * need the actual numbers to answer, and so do screen reader users.
 */
export function Chart({ data, chart }: { data: StimulusData; chart: ChartSpec }) {
  const width = 640;
  const height = 300;
  const pad = { top: 16, right: 16, bottom: 44, left: 56 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;

  const values = data.rows.flatMap((row) =>
    chart.yKeys.map((key) => Number(row[key])).filter((n) => Number.isFinite(n)),
  );
  if (values.length === 0) return null;

  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);
  const span = maxValue - minValue || 1;
  const y = (value: number) => pad.top + plotHeight - ((value - minValue) / span) * plotHeight;
  const step = plotWidth / Math.max(1, data.rows.length);
  const ticks = 4;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${chart.type} chart: ${data.caption || `${chart.yLabel} by ${chart.xLabel}`}. The same data is listed in the table below.`}
    >
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const value = minValue + (span * i) / ticks;
        return (
          <g key={i}>
            <line x1={pad.left} x2={width - pad.right} y1={y(value)} y2={y(value)} stroke="#e0dacf" />
            <text x={pad.left - 8} y={y(value) + 4} textAnchor="end" fontSize="11" fill="#7a7668">
              {Math.round(value * 100) / 100}
            </text>
          </g>
        );
      })}

      {chart.type === 'bar'
        ? data.rows.map((row, rowIndex) =>
            chart.yKeys.map((key, seriesIndex) => {
              const value = Number(row[key]);
              if (!Number.isFinite(value)) return null;
              const barWidth = (step * 0.7) / chart.yKeys.length;
              const x = pad.left + rowIndex * step + step * 0.15 + seriesIndex * barWidth;
              return (
                <rect
                  key={`${rowIndex}-${key}`}
                  x={x}
                  y={Math.min(y(value), y(0))}
                  width={barWidth}
                  height={Math.abs(y(value) - y(0))}
                  fill={SERIES_COLOURS[seriesIndex % SERIES_COLOURS.length]}
                />
              );
            }),
          )
        : chart.yKeys.map((key, seriesIndex) => {
            const points = data.rows
              .map((row, rowIndex) => {
                const value = Number(row[key]);
                if (!Number.isFinite(value)) return null;
                return { x: pad.left + rowIndex * step + step / 2, y: y(value) };
              })
              .filter((p): p is { x: number; y: number } => p !== null);
            const colour = SERIES_COLOURS[seriesIndex % SERIES_COLOURS.length];
            return (
              <g key={key}>
                {chart.type === 'line' ? (
                  <polyline
                    points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke={colour}
                    strokeWidth={2}
                  />
                ) : null}
                {points.map((point, i) => (
                  <circle key={i} cx={point.x} cy={point.y} r={3.5} fill={colour} />
                ))}
              </g>
            );
          })}

      <line x1={pad.left} x2={width - pad.right} y1={y(0)} y2={y(0)} stroke="#7a7668" strokeWidth={1.5} />

      {data.rows.map((row, rowIndex) => (
        <text
          key={rowIndex}
          x={pad.left + rowIndex * step + step / 2}
          y={height - pad.bottom + 18}
          textAnchor="middle"
          fontSize="11"
          fill="#56534a"
        >
          {String(row[chart.xKey] ?? '')}
        </text>
      ))}

      <text x={width / 2} y={height - 6} textAnchor="middle" fontSize="12" fill="#56534a">
        {chart.xLabel}
      </text>
      <text
        x={-(pad.top + plotHeight / 2)}
        y={14}
        transform="rotate(-90)"
        textAnchor="middle"
        fontSize="12"
        fill="#56534a"
      >
        {chart.yLabel}
      </text>
    </svg>
  );
}

export function DataTable({ data }: { data: StimulusData }) {
  return (
    <table className="w-full border-collapse text-sm">
      {data.caption ? (
        <caption className="mb-2 text-left text-sm text-ink-muted">{data.caption}</caption>
      ) : null}
      <thead>
        <tr>
          {data.columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              className="border border-line bg-surface-sunken px-3 py-2 text-left font-semibold"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {data.columns.map((column, columnIndex) =>
              columnIndex === 0 ? (
                <th key={column.key} scope="row" className="border border-line px-3 py-2 text-left font-normal">
                  {String(row[column.key] ?? '')}
                </th>
              ) : (
                <td key={column.key} className="border border-line px-3 py-2">
                  {String(row[column.key] ?? '')}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function StimulusView({ stimulus }: { stimulus: StimulusViewModel }) {
  return (
    <section
      aria-label={stimulus.title ?? 'Source material'}
      className="rounded-card border border-line bg-surface-sunken p-5"
    >
      {stimulus.title ? (
        <h2 className="mb-3 font-serif text-lg font-semibold">{stimulus.title}</h2>
      ) : null}

      {stimulus.bodyHtml ? (
        <div
          className="prose-academic question-body"
          dangerouslySetInnerHTML={{ __html: stimulus.bodyHtml }}
        />
      ) : null}

      {stimulus.data ? (
        <div className={stimulus.bodyHtml ? 'mt-4' : ''}>
          {stimulus.data.chart ? (
            <div className="mb-4 overflow-x-auto rounded border border-line bg-surface p-3">
              <Chart data={stimulus.data} chart={stimulus.data.chart} />
            </div>
          ) : null}
          <div className="overflow-x-auto">
            <DataTable data={stimulus.data} />
          </div>
        </div>
      ) : null}

      {stimulus.accessibilityText ? <p className="sr-only">{stimulus.accessibilityText}</p> : null}
    </section>
  );
}
