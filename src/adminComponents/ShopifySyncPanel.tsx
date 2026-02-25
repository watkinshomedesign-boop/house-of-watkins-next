"use client";

import { useState } from "react";

type BatchResult = {
  created: string[];
  updated: string[];
  skipped: string[];
  errors: Array<{ slug: string; error: string }>;
  total: number;
  offset: number;
  batchSize: number;
  done: boolean;
};

type SyncResult = {
  created: string[];
  updated: string[];
  skipped: string[];
  errors: Array<{ slug: string; error: string }>;
};

export default function ShopifySyncPanel() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runSync() {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress("Starting sync...");

    const totals: SyncResult = { created: [], updated: [], skipped: [], errors: [] };
    let offset = 0;

    try {
      while (true) {
        setProgress(`Syncing products ${offset + 1}–${offset + 10}...`);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 120_000); // 2 min per batch
        const res = await fetch("/api/admin/shopify-sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offset }),
          signal: controller.signal,
        });
        clearTimeout(timer);

        const json: BatchResult = await res.json();

        if (!res.ok) {
          setError((json as any).error || `Sync failed (${res.status})`);
          break;
        }

        totals.created.push(...json.created);
        totals.updated.push(...json.updated);
        totals.skipped.push(...json.skipped);
        totals.errors.push(...json.errors);

        setProgress(
          `Processed ${Math.min(offset + json.batchSize, json.total)} of ${json.total} plans...`
        );

        if (json.done) break;
        offset += json.batchSize;
      }

      setResult(totals);
    } catch (e: any) {
      if (e?.name === "AbortError") {
        setError(`Batch timed out at offset ${offset}. Partial results shown below. You can re-run to continue.`);
      } else {
        setError(e?.message || "Network error");
      }
      if (totals.created.length > 0 || totals.updated.length > 0 || totals.errors.length > 0) {
        setResult(totals);
      }
    } finally {
      setLoading(false);
      setProgress("");
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={runSync}
        disabled={loading}
        className="inline-flex items-center justify-center rounded bg-zinc-900 text-white px-5 py-2.5 text-sm font-medium disabled:opacity-50 hover:bg-zinc-800 transition-colors"
      >
        {loading ? "Syncing…" : "Sync Plans to Shopify"}
      </button>

      {loading && progress && (
        <div className="rounded border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          {progress}
        </div>
      )}

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Created" value={result.created.length} color="green" />
            <StatCard label="Updated" value={result.updated.length} color="blue" />
            <StatCard label="Skipped" value={result.skipped.length} color="zinc" />
            <StatCard label="Errors" value={result.errors.length} color="red" />
          </div>

          {result.created.length > 0 && (
            <SlugList title="Created" slugs={result.created} />
          )}
          {result.updated.length > 0 && (
            <SlugList title="Updated" slugs={result.updated} />
          )}
          {result.errors.length > 0 && (
            <div className="rounded border border-red-200 bg-red-50 p-4">
              <h3 className="text-sm font-semibold text-red-800 mb-2">Errors</h3>
              <ul className="space-y-1 text-sm text-red-700">
                {result.errors.map((e, i) => (
                  <li key={i}>
                    <span className="font-mono">{e.slug}</span>: {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    zinc: "bg-zinc-50 text-zinc-700 border-zinc-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className={`rounded border p-3 ${colorMap[color] || colorMap.zinc}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}

function SlugList({ title, slugs }: { title: string; slugs: string[] }) {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-50 p-4">
      <h3 className="text-sm font-semibold text-zinc-800 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {slugs.map((s) => (
          <span key={s} className="inline-block rounded bg-white px-2 py-0.5 text-xs font-mono border border-zinc-200">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
