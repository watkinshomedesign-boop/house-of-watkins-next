"use client";

import { useEffect, useState } from "react";

type Row = {
  plan_slug: string;
  plan_name: string | null;
  front_image_url: string | null;
  views_count: number;
  favorites_count: number;
  purchases_count: number;
};

export function AnalyticsTable() {
  const [range, setRange] = useState<"30d" | "total">("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/analytics/plan-stats?range=${range}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed");
        return j;
      })
      .then((j) => {
        if (!mounted) return;
        setRows((j.data ?? []) as Row[]);
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

  return (
    <div className="rounded border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="text-sm font-semibold">Plan stats</div>
        <select value={range} onChange={(e) => setRange(e.target.value as any)} className="rounded border px-2 py-1 text-sm">
          <option value="30d">Last 30 days</option>
          <option value="total">Total</option>
        </select>
      </div>

      {loading ? <div className="p-4 text-sm text-neutral-600">Loading...</div> : null}
      {error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}

      {!loading && !error ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500">
              <tr>
                <th className="px-4 py-2 text-left">Plan</th>
                <th className="px-4 py-2 text-right">Views</th>
                <th className="px-4 py-2 text-right">Favorites</th>
                <th className="px-4 py-2 text-right">Purchases</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.plan_slug} className="border-t">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      {r.front_image_url ? (
                        <img
                          src={r.front_image_url}
                          alt={r.plan_name || r.plan_slug}
                          className="h-10 w-14 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded bg-neutral-100 text-xs text-neutral-400">
                          —
                        </div>
                      )}
                      <span className="font-medium">{r.plan_name || r.plan_slug}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">{Number(r.views_count ?? 0)}</td>
                  <td className="px-4 py-2 text-right">{Number(r.favorites_count ?? 0)}</td>
                  <td className="px-4 py-2 text-right">{Number(r.purchases_count ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
