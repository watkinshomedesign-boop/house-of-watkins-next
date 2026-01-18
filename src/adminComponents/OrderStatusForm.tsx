"use client";

import { useState } from "react";

const STATUSES = ["pending", "paid", "pdf_sent", "print_queued", "shipped", "complete", "cancelled"] as const;

export function OrderStatusForm(props: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(props.currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function save() {
    setLoading(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch(`/api/admin/orders/${props.orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      setOk(true);
    } catch (e: any) {
      setError(e?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded p-4 text-sm space-y-3">
      <div className="font-medium">Update status</div>

      <div className="flex gap-2 items-center">
        <select className="border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={save}
          disabled={loading}
          className="inline-flex items-center justify-center rounded bg-zinc-900 text-white px-3 py-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {ok ? <span className="text-green-700">Saved</span> : null}
      </div>

      {error ? <div className="text-red-600">{error}</div> : null}
    </div>
  );
}
