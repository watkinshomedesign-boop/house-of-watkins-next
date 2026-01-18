"use client";

import { useEffect, useState } from "react";

export function ReturnPolicyContent() {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/policies/return-policy", { method: "GET" });
        const json = (await res.json()) as any;
        if (cancelled) return;
        if (!res.ok) {
          setError(String(json?.error ?? "Failed to load return policy"));
          return;
        }
        setHtml(String(json?.html ?? ""));
      } catch (e: any) {
        if (!cancelled) setError(String(e?.message ?? "Failed to load return policy"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="text-[13px] text-neutral-600">Loading…</div>;
  if (error) return <div className="text-[13px] text-red-600">{error}</div>;

  return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
