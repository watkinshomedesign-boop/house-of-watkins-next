"use client";

import { useEffect, useMemo, useState } from "react";

type PlanRow = { id: string; slug: string; name: string };

type MediaRow = {
  id: string;
  plan_id: string;
  kind: string;
  file_path: string;
  is_external: boolean;
  alt: string | null;
  caption: string | null;
  sort_order: number;
  plans?: { id: string; slug: string; name: string } | null;
};

export function MediaAdmin() {
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [planId, setPlanId] = useState<string>("");
  const [kind, setKind] = useState<string>("");
  const [q, setQ] = useState<string>("");

  const selectedPlan = useMemo(() => plans.find((p) => p.id === planId) ?? null, [plans, planId]);

  async function loadPlans() {
    const res = await fetch("/api/admin/plans?limit=200");
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || "Failed");
    setPlans((j.data ?? []) as any);
  }

  async function loadMedia() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("limit", "500");
      if (planId) params.set("plan_id", planId);
      if (kind) params.set("kind", kind);
      if (q.trim()) params.set("q", q.trim());

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setMedia((j.data ?? []) as any);
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans().catch((e: any) => setError(e?.message || "Failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadMedia();
  }, [planId, kind]);

  async function saveRow(row: MediaRow) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/media/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: row.plan_id,
          kind: row.kind,
          file_path: row.file_path,
          alt: (row.alt ?? "").trim() || null,
          caption: (row.caption ?? "").trim() || null,
          sort_order: row.sort_order,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      await loadMedia();
    } catch (e: any) {
      setError(e?.message || "Failed");
    }
  }

  async function removeRow(row: MediaRow) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/media/${row.id}`, { method: "DELETE" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      await loadMedia();
    } catch (e: any) {
      setError(e?.message || "Failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded border p-4">
        <div className="text-sm font-semibold">Filters</div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <label className="block text-sm">
            <div className="text-xs text-neutral-500">Plan</div>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            >
              <option value="">(all)</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.slug} — {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <div className="text-xs text-neutral-500">Kind</div>
            <input value={kind} onChange={(e) => setKind(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
          </label>
          <label className="block text-sm sm:col-span-2">
            <div className="text-xs text-neutral-500">Search (file_path)</div>
            <input value={q} onChange={(e) => setQ(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
          </label>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button type="button" onClick={() => loadMedia()} className="rounded bg-black px-3 py-2 text-sm font-semibold text-white">
            Apply
          </button>
          {selectedPlan ? <div className="text-xs text-neutral-600">Plan id: {selectedPlan.id}</div> : null}
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
        </div>
      </div>

      <div className="rounded border">
        <div className="border-b px-4 py-3 text-sm font-semibold">Media ({loading ? "Loading..." : media.length})</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500">
              <tr>
                <th className="px-4 py-2 text-left">Plan</th>
                <th className="px-4 py-2 text-left">Kind</th>
                <th className="px-4 py-2 text-left">file_path</th>
                <th className="px-4 py-2 text-left">alt</th>
                <th className="px-4 py-2 text-left">caption</th>
                <th className="px-4 py-2 text-right">sort</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {media.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="px-4 py-2">
                    <select
                      value={m.plan_id}
                      onChange={(e) =>
                        setMedia((prev) => prev.map((x) => (x.id === m.id ? { ...x, plan_id: e.target.value } : x)))
                      }
                      className="w-full rounded border px-2 py-1 text-xs"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.slug}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1 text-[11px] text-neutral-500">
                      {m.plans?.name ? m.plans.name : null}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      value={m.kind}
                      onChange={(e) => setMedia((prev) => prev.map((x) => (x.id === m.id ? { ...x, kind: e.target.value } : x)))}
                      className="w-full rounded border px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      value={m.file_path}
                      onChange={(e) =>
                        setMedia((prev) => prev.map((x) => (x.id === m.id ? { ...x, file_path: e.target.value } : x)))
                      }
                      className="w-[380px] rounded border px-2 py-1 font-mono text-xs"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      value={m.alt ?? ""}
                      onChange={(e) => setMedia((prev) => prev.map((x) => (x.id === m.id ? { ...x, alt: e.target.value } : x)))}
                      className="w-[220px] rounded border px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      value={m.caption ?? ""}
                      onChange={(e) =>
                        setMedia((prev) => prev.map((x) => (x.id === m.id ? { ...x, caption: e.target.value } : x)))
                      }
                      className="w-[240px] rounded border px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      value={String(m.sort_order)}
                      onChange={(e) =>
                        setMedia((prev) =>
                          prev.map((x) => (x.id === m.id ? { ...x, sort_order: e.target.value === "" ? 0 : Number(e.target.value) } : x))
                        )
                      }
                      className="w-[80px] rounded border px-2 py-1 text-xs text-right"
                      inputMode="numeric"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <button type="button" onClick={() => saveRow(m)} className="underline">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm("Delete this media record?")) return;
                          await removeRow(m);
                        }}
                        className="underline text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
