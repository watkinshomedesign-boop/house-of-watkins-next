"use client";

import { useEffect, useMemo, useState } from "react";

import { getStoredBuilderCode, normalizeBuilderCode, setStoredBuilderCode } from "@/lib/builderPromo/storage";

export const PromoCode = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<string>("");

  useEffect(() => {
    const next = getStoredBuilderCode();
    setValue(next);
    setApplied(next);

    function onChange() {
      const v = getStoredBuilderCode();
      setValue(v);
      setApplied(v);
    }

    window.addEventListener("moss_builder_code_changed", onChange);
    return () => window.removeEventListener("moss_builder_code_changed", onChange);
  }, []);

  const canApply = useMemo(() => normalizeBuilderCode(value).length > 0, [value]);

  async function apply() {
    if (!canApply) return;
    setLoading(true);
    setError(null);

    const code = normalizeBuilderCode(value);

    try {
      const res = await fetch("/api/builders/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(String(json?.error ?? "Failed to validate code"));
        return;
      }

      if (!json?.valid) {
        setError("Code not found or inactive.");
        return;
      }

      setStoredBuilderCode(code);
      setApplied(code);
    } catch (e: any) {
      setError(String(e?.message ?? "Failed to validate code"));
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setStoredBuilderCode("");
    setApplied("");
    setValue("");
    setError(null);
  }

  return (
    <div className="w-full md:w-[461.312px]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="Enter your builder code"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-full border border-stone-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
          autoCapitalize="characters"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={apply}
            disabled={!canApply || loading}
            className="rounded-full bg-stone-50 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-orange-600 disabled:opacity-50"
          >
            {loading ? "Applying…" : "Apply code"}
          </button>
          {applied ? (
            <button
              type="button"
              onClick={clear}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {applied ? (
        <div className="mt-2 text-xs text-neutral-600">Applied: {applied}</div>
      ) : null}
      {error ? <div className="mt-2 text-xs text-red-600">{error}</div> : null}
    </div>
  );
};
