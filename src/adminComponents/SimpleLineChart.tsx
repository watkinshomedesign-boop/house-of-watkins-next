"use client";

type Point = { day: string; count: number };

export function SimpleLineChart(props: { title: string; points: Point[] }) {
  const w = 520;
  const h = 120;
  const pad = 8;

  const max = Math.max(1, ...props.points.map((p) => Number(p.count ?? 0)));

  const pts = props.points
    .map((p, idx) => {
      const x = pad + (idx * (w - pad * 2)) / Math.max(1, props.points.length - 1);
      const y = h - pad - (Number(p.count ?? 0) * (h - pad * 2)) / max;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const last = props.points[props.points.length - 1]?.count ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <div>{props.title}</div>
        <div>Latest: {Number(last)}</div>
      </div>
      <div className="mt-2 overflow-x-auto">
        <svg width={w} height={h} className="block">
          <rect x={0} y={0} width={w} height={h} fill="transparent" />
          <polyline fill="none" stroke="black" strokeWidth="2" points={pts} />
        </svg>
      </div>
    </div>
  );
}
