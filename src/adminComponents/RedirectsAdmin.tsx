"use client";

import { useEffect, useState } from "react";

type RedirectRow = {
  id: string;
  from_path: string;
  to_path: string;
  status_code: number;
  disabled: boolean;
  is_auto: boolean;
  created_at: string;
};

export function RedirectsAdmin() {
  const [rows, setRows] = useState<RedirectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [includeDisabled, setIncludeDisabled] = useState(false);

  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newStatus, setNewStatus] = useState(301);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("limit", "500");
      if (q.trim()) params.set("q", q.trim());
      params.set("includeDisabled", includeDisabled ? "true" : "false");

      const res = await fetch(`/api/admin/redirects?${params.toString()}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setRows((j.data ?? []) as RedirectRow[]);
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function create() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_path: newFrom, to_path: newTo, status_code: newStatus }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setNewFrom("");
      setNewTo("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveRow(row: RedirectRow) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/redirects/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_path: row.to_path, status_code: row.status_code, disabled: row.disabled }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded border p-4">
        <div className="text-sm font-semibold">Create redirect</div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            <div className="text-xs text-neutral-500">from_path</div>
            <input value={newFrom} onChange={(e) => setNewFrom(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 font-mono" />
          </label>
          <label className="block text-sm">
            <div className="text-xs text-neutral-500">to_path</div>
            <input value={newTo} onChange={(e) => setNewTo(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 font-mono" />
          </label>
          <label className="block text-sm">
            <div className="text-xs text-neutral-500">status_code</div>
            <select value={String(newStatus)} onChange={(e) => setNewStatus(Number(e.target.value))} className="mt-1 w-full rounded border px-3 py-2">
              <option value="301">301</option>
              <option value="302">302</option>
              <option value="307">307</option>
              <option value="308">308</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button type="button" onClick={create} disabled={saving} className="rounded bg-black px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Create"}
          </button>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
        </div>
      </div>

      <div className="rounded border p-4">
        <div className="text-sm font-semibold">Filters</div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="block text-sm sm:col-span-2">
            <div className="text-xs text-neutral-500">Search</div>
            <input value={q} onChange={(e) => setQ(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
          </label>
          <label className="block text-sm">
            <div className="text-xs text-neutral-500">Include disabled</div>
            <select value={includeDisabled ? "yes" : "no"} onChange={(e) => setIncludeDisabled(e.target.value === "yes")} className="mt-1 w-full rounded border px-3 py-2">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
        </div>
        <div className="mt-3">
          <button type="button" onClick={load} className="rounded bg-black px-3 py-2 text-sm font-semibold text-white">
            Apply
          </button>
        </div>
      </div>

      <div className="rounded border">
        <div className="border-b px-4 py-3 text-sm font-semibold">Redirects ({loading ? "Loading..." : rows.length})</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-neutral-500">
              <tr>
                <th className="px-4 py-2 text-left">from_path</th>
                <th className="px-4 py-2 text-left">to_path</th>
                <th className="px-4 py-2 text-right">code</th>
                <th className="px-4 py-2 text-left">auto</th>
                <th className="px-4 py-2 text-left">disabled</th>
                <th className="px-4 py-2 text-left">action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">{r.from_path}</td>
                  <td className="px-4 py-2">
                    <input
                      value={r.to_path}
                      disabled={r.is_auto}
                      onChange={(e) => setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, to_path: e.target.value } : x)))}
                      className="w-[420px] rounded border px-2 py-1 font-mono text-xs disabled:bg-neutral-100"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <select
                      value={String(r.status_code)}
                      disabled={r.is_auto}
                      onChange={(e) => setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status_code: Number(e.target.value) } : x)))}
                      className="rounded border px-2 py-1 text-xs disabled:bg-neutral-100"
                    >
                      <option value="301">301</option>
                      <option value="302">302</option>
                      <option value="307">307</option>
                      <option value="308">308</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">{r.is_auto ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">
                    <select
                      value={r.disabled ? "yes" : "no"}
                      onChange={(e) => setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, disabled: e.target.value === "yes" } : x)))}
                      className="rounded border px-2 py-1 text-xs"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => saveRow(r)} disabled={saving} className="underline disabled:opacity-50">
                        Save
                      </button>
                      {r.is_auto ? <div className="text-xs text-neutral-500">Locked</div> : null}
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
