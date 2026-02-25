"use client";

import { useEffect, useState } from "react";

type DailyLead = { date: string; leads: number };
type LeadSource = { source: string; count: number };

type LeadsData = {
  days: number;
  total_leads: number;
  daily: DailyLead[];
  topSources: LeadSource[];
};

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function LeadsDashboard() {
  const [days, setDays] = useState<30 | 7 | 14>(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LeadsData | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/analytics/leads-daily?days=${days}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed");
        return j as LeadsData;
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

  const maxLeads = data ? Math.max(...data.daily.map((d) => d.leads), 1) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Email Leads Collected</h2>
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
          {/* Total Card */}
          <div className="inline-block rounded border p-4">
            <div className="text-xs text-neutral-500">Total emails collected</div>
            <div className="mt-1 text-2xl font-bold">{data.total_leads.toLocaleString()}</div>
            <div className="text-xs text-neutral-400">last {data.days} days</div>
          </div>

          {/* Daily Bar Chart */}
          <div className="rounded border p-4">
            <div className="mb-3 text-sm font-semibold text-neutral-700">Leads per day</div>
            <div className="space-y-1">
              {data.daily.map((d) => (
                <div key={d.date} className="flex items-center gap-2 text-xs">
                  <span className="w-14 shrink-0 text-right text-neutral-500">{formatDate(d.date)}</span>
                  <div className="relative h-5 flex-1 overflow-hidden rounded bg-neutral-100">
                    <div
                      className="absolute inset-y-0 left-0 rounded bg-green-500"
                      style={{ width: `${Math.max(d.leads > 0 ? 1 : 0, (d.leads / maxLeads) * 100)}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-medium">{d.leads}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          {data.topSources.length > 0 ? (
            <div className="rounded border p-4">
              <div className="mb-3 text-sm font-semibold text-neutral-700">Lead sources</div>
              <div className="space-y-2">
                {data.topSources.map((s) => (
                  <div key={s.source} className="flex items-center justify-between text-sm">
                    <span className="truncate text-neutral-700">{s.source}</span>
                    <span className="ml-2 shrink-0 font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
