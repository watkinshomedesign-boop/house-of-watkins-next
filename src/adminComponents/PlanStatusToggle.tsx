"use client";

import { useState } from "react";

export function PlanStatusToggle(props: { planId: string; currentStatus: string }) {
  const [status, setStatus] = useState(props.currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStatus = status === "published" ? "draft" : "published";

  async function toggle() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/plans/${props.planId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      setStatus(nextStatus);
    } catch (e: any) {
      setError(e?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={loading}
        className="inline-flex items-center justify-center rounded border px-3 py-1 disabled:opacity-50"
      >
        {status === "published" ? "Unpublish" : "Publish"}
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
