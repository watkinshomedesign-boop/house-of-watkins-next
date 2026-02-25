"use client";

import { useEffect, useState } from "react";

type DailyRow = {
  date: string;
  total_visits: number;
  unique_visitors: number;
  new_visitors: number;
  returning_visitors: number;
};

type Referrer = { domain: string; count: number };
type Source = { source: string; count: number };

type Summary = {
  total_visits: number;
  unique_visitors: number;
  new_visitors: number;
  returning_visitors: number;
};

type VisitorData = {
  days: number;
  summary: Summary;
  daily: DailyRow[];
  topReferrers: Referrer[];
  topSources: Source[];
};

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function BarChart(props: { data: { label: string; value: number; secondary?: number }[]; maxValue: number }) {
  const max = props.maxValue || 1;
  return (
    <div className="space-y-1">
      {props.data.map((d, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-14 shrink-0 text-right text-neutral-500">{d.label}</span>
          <div className="relative h-5 flex-1 overflow-hidden rounded bg-neutral-100">
            {d.secondary != null && d.secondary > 0 ? (
              <div
                className="absolute inset-y-0 left-0 rounded bg-blue-200"
                style={{ width: `${Math.max(1, (d.secondary / max) * 100)}%` }}
              />
            ) : null}
            <div
              className="absolute inset-y-0 left-0 rounded bg-blue-500"
              style={{ width: `${Math.max(d.value > 0 ? 1 : 0, (d.value / max) * 100)}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right font-medium">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export function VisitorsDashboard() {
  const [days, setDays] = useState<30 | 7 | 14>(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VisitorData | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/analytics/visitors?days=${days}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed");
        return j as VisitorData;
      })
      .then((j) => {
        if (!mounted) return;
        setData(j);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.message || "Failed");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [days]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daily Visitors</h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value) as any)}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      {loading ? <div className="text-sm text-neutral-600">Loading...</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      {!loading && !error && data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <SummaryCard label="Total Visits" value={data.summary.total_visits} />
            <SummaryCard label="Unique Visitors" value={data.summary.unique_visitors} />
            <SummaryCard label="New Visitors" value={data.summary.new_visitors} />
            <SummaryCard label="Returning" value={data.summary.returning_visitors} />
          </div>

          {/* Daily Chart */}
          <div className="rounded border p-4">
            <div className="mb-3 text-sm font-semibold text-neutral-700">Unique visitors per day</div>
            <BarChart
              data={data.daily.map((d) => ({
                label: formatDate(d.date),
                value: d.unique_visitors,
                secondary: d.total_visits,
              }))}
              maxValue={Math.max(...data.daily.map((d) => d.total_visits), 1)}
            />
            <div className="mt-2 flex gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-3 rounded bg-blue-500" /> Unique visitors
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-3 rounded bg-blue-200" /> Total page views
              </span>
            </div>
          </div>

          {/* Referrers + Sources side by side */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Referrers */}
            <div className="rounded border p-4">
              <div className="mb-3 text-sm font-semibold text-neutral-700">Where visitors came from</div>
              {data.topReferrers.length === 0 ? (
                <div className="text-sm text-neutral-400">No referrer data yet</div>
              ) : (
                <div className="space-y-2">
                  {data.topReferrers.map((r) => (
                    <div key={r.domain} className="flex items-center justify-between text-sm">
                      <span className="truncate text-neutral-700">{r.domain}</span>
                      <span className="ml-2 shrink-0 font-medium">{r.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Sources */}
            <div className="rounded border p-4">
              <div className="mb-3 text-sm font-semibold text-neutral-700">Traffic sources</div>
              {data.topSources.length === 0 ? (
                <div className="text-sm text-neutral-400">No source data yet</div>
              ) : (
                <div className="space-y-2">
                  {data.topSources.map((s) => (
                    <div key={s.source} className="flex items-center justify-between text-sm">
                      <span className="truncate text-neutral-700">{s.source}</span>
                      <span className="ml-2 shrink-0 font-medium">{s.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function SummaryCard(props: { label: string; value: number }) {
  return (
    <div className="rounded border p-4">
      <div className="text-xs text-neutral-500">{props.label}</div>
      <div className="mt-1 text-2xl font-bold">{props.value.toLocaleString()}</div>
    </div>
  );
}
