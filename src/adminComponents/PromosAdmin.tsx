"use client";

import { Fragment, useEffect, useState } from "react";

type PromoRow = {
  id: string;
  code: string;
  status: string;
  discount_type: "percent" | "amount";
  discount_value: number;
  applies_to: string;
  starts_at: string | null;
  ends_at: string | null;
  max_redemptions: number | null;
  redemptions_count: number;
  min_subtotal_cents: number | null;
  metadata: any;
  created_at: string;
};

type PromoTargetRow = {
  promo_id: string;
  target_type: string;
  target_value: string;
};

export function PromosAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<PromoRow[]>([]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [edit, setEdit] = useState<PromoRow | null>(null);
  const [saving, setSaving] = useState(false);

  const [targets, setTargets] = useState<PromoTargetRow[]>([]);
  const [targetsLoading, setTargetsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percent" | "amount">("percent");
  const [newValue, setNewValue] = useState<number>(15);

  function formatDateInput(v: string | null | undefined) {
    if (!v) return "";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function toIsoFromDateInput(v: string) {
    const s = String(v || "").trim();
    if (!s) return null;
    const d = new Date(`${s}T00:00:00.000Z`);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  async function loadTargets(promoId: string) {
    setTargetsLoading(true);
    try {
      const res = await fetch(`/api/admin/promos/${promoId}/targets`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setTargets((j.data ?? []) as PromoTargetRow[]);
    } finally {
      setTargetsLoading(false);
    }
  }

  async function saveTargets(promoId: string, next: PromoTargetRow[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/promos/${promoId}/targets`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targets: next.map((t) => ({ target_type: t.target_type, target_value: t.target_value })) }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      await loadTargets(promoId);
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function loadStats(promoId: string) {
    setStatsLoading(true);
    try {
      const res = await fetch(`/api/admin/promos/${promoId}/stats`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setStats(j.stats ?? null);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/promos");
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setRows((j.data ?? []) as PromoRow[]);
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createPromo() {
    setError(null);
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCode, discount_type: newType, discount_value: newValue, status: "active" }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setNewCode("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed");
    }
  }

  async function savePromo() {
    if (!edit) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/promos/${edit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: edit.code,
          status: edit.status,
          discount_type: edit.discount_type,
          discount_value: edit.discount_value,
          applies_to: edit.applies_to,
          starts_at: edit.starts_at,
          ends_at: edit.ends_at,
          max_redemptions: edit.max_redemptions,
          min_subtotal_cents: edit.min_subtotal_cents,
          metadata: edit.metadata ?? {},
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      await load();
      if (expandedId) {
        await loadTargets(expandedId);
        await loadStats(expandedId);
      }
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-neutral-600">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded border p-4">
        <div className="text-sm font-semibold">Create promo</div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            <div className="text-xs text-neutral-500">Code</div>
            <input value={newCode} onChange={(e) => setNewCode(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
          </label>
          <label className="block text-sm">
            <div className="text-xs text-neutral-500">Type</div>
            <select value={newType} onChange={(e) => setNewType(e.target.value as any)} className="mt-1 w-full rounded border px-3 py-2">
              <option value="percent">percent</option>
              <option value="amount">amount</option>
            </select>
          </label>
          <label className="block text-sm">
            <div className="text-xs text-neutral-500">Value</div>
            <input value={String(newValue)} onChange={(e) => setNewValue(Number(e.target.value))} className="mt-1 w-full rounded border px-3 py-2" inputMode="numeric" />
          </label>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button type="button" onClick={createPromo} className="rounded bg-black px-3 py-2 text-sm font-semibold text-white">
            Create
          </button>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
        </div>
      </div>

      <div className="rounded border">
        <div className="border-b px-4 py-3 text-sm font-semibold">Promo codes</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500">
              <tr>
                <th className="px-4 py-2 text-left">Code</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-right">Value</th>
                <th className="px-4 py-2 text-right">Used</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Fragment key={r.id}>
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2 font-mono">{r.code}</td>
                    <td className="px-4 py-2">{r.status}</td>
                    <td className="px-4 py-2">{r.discount_type}</td>
                    <td className="px-4 py-2 text-right">{r.discount_value}</td>
                    <td className="px-4 py-2 text-right">{r.redemptions_count ?? 0}</td>
                    <td className="px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        className="underline"
                        onClick={async () => {
                          const next = expandedId === r.id ? null : r.id;
                          setExpandedId(next);
                          if (next) {
                            setEdit(r);
                            await loadTargets(next);
                            await loadStats(next);
                          }
                        }}
                      >
                        {expandedId === r.id ? "Close" : "Edit"}
                      </button>
                    </td>
                  </tr>

                  {expandedId === r.id ? (
                    <tr key={`${r.id}-expanded`} className="border-t bg-neutral-50">
                      <td className="px-4 py-4" colSpan={8}>
                        {!edit ? null : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                              <label className="block text-sm">
                                <div className="text-xs text-neutral-500">Code</div>
                                <input
                                  value={edit.code}
                                  onChange={(e) => setEdit((p) => (p ? { ...p, code: e.target.value } : p))}
                                  className="mt-1 w-full rounded border px-3 py-2 font-mono"
                                />
                              </label>
                              <label className="block text-sm">
                                <div className="text-xs text-neutral-500">Status</div>
                                <select
                                  value={edit.status}
                                  onChange={(e) => setEdit((p) => (p ? { ...p, status: e.target.value } : p))}
                                  className="mt-1 w-full rounded border px-3 py-2"
                                >
                                  <option value="active">active</option>
                                  <option value="inactive">inactive</option>
                                </select>
                              </label>
                              <label className="block text-sm">
                                <div className="text-xs text-neutral-500">Applies to</div>
                                <input
                                  value={edit.applies_to}
                                  onChange={(e) => setEdit((p) => (p ? { ...p, applies_to: e.target.value } : p))}
                                  className="mt-1 w-full rounded border px-3 py-2"
                                />
                              </label>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                              <label className="block text-sm">
                                <div className="text-xs text-neutral-500">Discount type</div>
                                <select
                                  value={edit.discount_type}
                                  onChange={(e) => setEdit((p) => (p ? { ...p, discount_type: e.target.value as any } : p))}
                                  className="mt-1 w-full rounded border px-3 py-2"
                                >
                                  <option value="percent">percent</option>
                                  <option value="amount">amount</option>
                                </select>
                              </label>
                              <label className="block text-sm">
                                <div className="text-xs text-neutral-500">Discount value</div>
                                <input
                                  value={String(edit.discount_value)}
                                  onChange={(e) => setEdit((p) => (p ? { ...p, discount_value: Number(e.target.value) } : p))}
                                  className="mt-1 w-full rounded border px-3 py-2"
                                  inputMode="numeric"
                                />
                              </label>
                              <label className="block text-sm">
                                <div className="text-xs text-neutral-500">Min subtotal (cents)</div>
                                <input
                                  value={edit.min_subtotal_cents == null ? "" : String(edit.min_subtotal_cents)}
                                  onChange={(e) =>
                                    setEdit((p) =>
                                      p
                                        ? { ...p, min_subtotal_cents: e.target.value === "" ? null : Number(e.target.value) }
                                        : p
                                    )
                                  }
                                  className="mt-1 w-full rounded border px-3 py-2"
                                  inputMode="numeric"
                                />
                              </label>
                              <label className="block text-sm">
                                <div className="text-xs text-neutral-500">Max redemptions</div>
                                <input
                                  value={edit.max_redemptions == null ? "" : String(edit.max_redemptions)}
                                  onChange={(e) =>
                                    setEdit((p) =>
                                      p ? { ...p, max_redemptions: e.target.value === "" ? null : Number(e.target.value) } : p
                                    )
                                  }
                                  className="mt-1 w-full rounded border px-3 py-2"
                                  inputMode="numeric"
                                />
                              </label>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <label className="block text-sm">
                                <div className="text-xs text-neutral-500">Starts at</div>
                                <input
                                  type="date"
                                  value={formatDateInput(edit.starts_at)}
                                  onChange={(e) => setEdit((p) => (p ? { ...p, starts_at: toIsoFromDateInput(e.target.value) } : p))}
                                  className="mt-1 w-full rounded border px-3 py-2"
                                />
                              </label>
                              <label className="block text-sm">
                                <div className="text-xs text-neutral-500">Ends at</div>
                                <input
                                  type="date"
                                  value={formatDateInput(edit.ends_at)}
                                  onChange={(e) => setEdit((p) => (p ? { ...p, ends_at: toIsoFromDateInput(e.target.value) } : p))}
                                  className="mt-1 w-full rounded border px-3 py-2"
                                />
                              </label>
                            </div>

                            <div className="rounded border bg-white p-4">
                              <div className="text-sm font-semibold">Targets</div>
                              <div className="mt-1 text-xs text-neutral-500">Optional. Use target_type + target_value.</div>
                              <div className="mt-3 space-y-2">
                                {targetsLoading ? <div className="text-sm text-neutral-600">Loading...</div> : null}
                                {targets.map((t, idx) => (
                                  <div key={`${t.target_type}:${t.target_value}:${idx}`} className="flex flex-wrap items-center gap-2">
                                    <input
                                      value={t.target_type}
                                      onChange={(e) =>
                                        setTargets((prev) =>
                                          prev.map((x, i) => (i === idx ? { ...x, target_type: e.target.value } : x))
                                        )
                                      }
                                      className="w-[140px] rounded border px-2 py-1 text-xs"
                                    />
                                    <input
                                      value={t.target_value}
                                      onChange={(e) =>
                                        setTargets((prev) =>
                                          prev.map((x, i) => (i === idx ? { ...x, target_value: e.target.value } : x))
                                        )
                                      }
                                      className="w-[280px] rounded border px-2 py-1 text-xs"
                                    />
                                    <button
                                      type="button"
                                      className="underline text-xs text-red-700"
                                      onClick={() => setTargets((prev) => prev.filter((_, i) => i !== idx))}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                <button
                                  type="button"
                                  className="rounded border px-3 py-2 text-sm"
                                  onClick={() =>
                                    setTargets((prev) => [...prev, { promo_id: r.id, target_type: "plan_slug", target_value: "" }])
                                  }
                                >
                                  Add plan target
                                </button>
                                <button
                                  type="button"
                                  className="rounded border px-3 py-2 text-sm"
                                  onClick={() =>
                                    setTargets((prev) => [...prev, { promo_id: r.id, target_type: "builder_only", target_value: "true" }])
                                  }
                                >
                                  Add builder-only flag
                                </button>
                                <button
                                  type="button"
                                  className="rounded bg-black px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                  disabled={saving}
                                  onClick={() => saveTargets(r.id, targets.filter((t) => t.target_type.trim() && t.target_value.trim()))}
                                >
                                  Save targets
                                </button>
                              </div>
                            </div>

                            <div className="rounded border bg-white p-4">
                              <div className="text-sm font-semibold">Stats</div>
                              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-4">
                                <div className="rounded border p-3">
                                  <div className="text-xs text-neutral-500">Active now</div>
                                  <div className="text-sm font-semibold">
                                    {statsLoading ? "…" : stats?.activeNow ? "Yes" : "No"}
                                  </div>
                                </div>
                                <div className="rounded border p-3">
                                  <div className="text-xs text-neutral-500">Redemptions</div>
                                  <div className="text-sm font-semibold">
                                    {statsLoading ? "…" : String(stats?.redemptions ?? r.redemptions_count ?? 0)}
                                  </div>
                                </div>
                                <div className="rounded border p-3">
                                  <div className="text-xs text-neutral-500">Max</div>
                                  <div className="text-sm font-semibold">
                                    {statsLoading ? "…" : stats?.maxRedemptions == null ? "—" : String(stats?.maxRedemptions)}
                                  </div>
                                </div>
                                <div className="rounded border p-3">
                                  <div className="text-xs text-neutral-500">Revenue influenced</div>
                                  <div className="text-sm font-semibold">—</div>
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-neutral-500">
                                Revenue attribution is deferred until promo usage is recorded on orders.
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={savePromo}
                                disabled={saving}
                                className="rounded bg-black px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                              >
                                {saving ? "Saving..." : "Save promo"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEdit((p) => (p ? { ...p, status: "inactive" } : p))}
                                className="rounded border px-3 py-2 text-sm"
                              >
                                Deactivate
                              </button>
                              {error ? <div className="text-sm text-red-600">{error}</div> : null}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
