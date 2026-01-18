"use client";

import { useEffect, useMemo, useState } from "react";
import { SimpleLineChart } from "@/adminComponents/SimpleLineChart";

type StatRow = {
  plan_slug: string;
  views_count: number;
  favorites_count: number;
  purchases_count: number;
};

type Summary = {
  range: "30d" | "total";
  totals: { views: number; favorites: number; purchases: number; conversionRate: number };
  top5: { byViews: StatRow[]; byFavorites: StatRow[]; byPurchases: StatRow[] };
  builder: {
    ordersWithBuilderCode: number;
    totalOrders: number;
    share: number;
    topCodesByRevenue: Array<{ code: string; revenueCents: number; orders: number; currency: string }>;
  };
};

type SeriesPoint = { day: string; count: number };

type Timeseries = {
  days: number;
  series: { views: SeriesPoint[]; favorites: SeriesPoint[]; purchases: SeriesPoint[] };
};

function fmtPct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

export function AdminDashboard() {
  const [range, setRange] = useState<"30d" | "total">("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [ts, setTs] = useState<Timeseries | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/admin/dashboard/summary?range=${range}`).then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed");
        return j as Summary;
      }),
      fetch(`/api/admin/dashboard/timeseries?days=30`).then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed");
        return j as Timeseries;
      }),
    ])
      .then(([s, t]) => {
        if (!mounted) return;
        setSummary(s);
        setTs(t);
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
  }, [range]);

  const kpis = useMemo(() => {
    if (!summary) return null;
    return [
      { label: "Plan views", value: summary.totals.views },
      { label: "Favorites", value: summary.totals.favorites },
      { label: "Purchases", value: summary.totals.purchases },
      { label: "Conversion (views → purchase)", value: fmtPct(summary.totals.conversionRate) },
    ];
  }, [summary]);

  if (loading) return <div className="text-sm text-neutral-600">Loading...</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!summary) return <div className="text-sm text-neutral-600">No data.</div>;

  const topTable = (title: string, rows: StatRow[], field: keyof StatRow) => (
    <div className="rounded border">
      <div className="border-b px-4 py-3 text-sm font-semibold">{title}</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-xs text-neutral-500">
            <tr>
              <th className="px-4 py-2 text-left">Plan</th>
              <th className="px-4 py-2 text-right">Count</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="border-t">
                <td className="px-4 py-3 text-neutral-500" colSpan={2}>
                  No data.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.plan_slug} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">{r.plan_slug}</td>
                  <td className="px-4 py-2 text-right">{Number((r as any)[field] ?? 0)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-sm text-neutral-600">Range</div>
        <select value={range} onChange={(e) => setRange(e.target.value as any)} className="rounded border px-2 py-1 text-sm">
          <option value="30d">Last 30 days</option>
          <option value="total">Total</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {kpis?.map((k) => (
          <div key={k.label} className="rounded border p-4">
            <div className="text-xs text-neutral-500">{k.label}</div>
            <div className="mt-1 text-xl font-semibold">{k.value as any}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {topTable("Top 5 by views", summary.top5.byViews, "views_count")}
        {topTable("Top 5 by favorites", summary.top5.byFavorites, "favorites_count")}
        {topTable("Top 5 by purchases", summary.top5.byPurchases, "purchases_count")}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded border p-4">
          <div className="text-sm font-semibold">Builder impact</div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-neutral-500">Orders w/ builder codes</div>
              <div className="mt-1 font-semibold">{summary.builder.ordersWithBuilderCode}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500">% of orders w/ builder code</div>
              <div className="mt-1 font-semibold">{fmtPct(summary.builder.share)}</div>
            </div>
          </div>

          <div className="mt-4 text-xs text-neutral-500">Top builder codes by revenue (top 10)</div>
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="text-left p-2 border">Code</th>
                  <th className="text-right p-2 border">Orders</th>
                  <th className="text-right p-2 border">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {summary.builder.topCodesByRevenue.length === 0 ? (
                  <tr>
                    <td className="p-2 border" colSpan={3}>
                      No builder orders yet.
                    </td>
                  </tr>
                ) : (
                  summary.builder.topCodesByRevenue.map((r) => (
                    <tr key={`${r.currency}:${r.code}`}>
                      <td className="p-2 border font-mono text-xs">{r.code}</td>
                      <td className="p-2 border text-right">{r.orders}</td>
                      <td className="p-2 border text-right">
                        ${(r.revenueCents / 100).toFixed(2)} {String(r.currency).toUpperCase()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded border p-4">
          <div className="text-sm font-semibold">30d time series</div>
          {ts ? (
            <div className="mt-4 space-y-4">
              <SimpleLineChart title="Views / day" points={ts.series.views} />
              <SimpleLineChart title="Favorites / day" points={ts.series.favorites} />
              <SimpleLineChart title="Purchases / day" points={ts.series.purchases} />
            </div>
          ) : (
            <div className="mt-2 text-sm text-neutral-600">No time series.</div>
          )}
        </div>
      </div>
    </div>
  );
}
