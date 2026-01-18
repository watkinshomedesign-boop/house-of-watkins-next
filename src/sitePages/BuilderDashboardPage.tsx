"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type StatusResponse =
  | { valid: false }
  | {
      valid: true;
      builderProfile: {
        id: string;
        created_at: string;
        first_name: string;
        last_name: string;
        email: string;
        company: string;
        role: string;
        license_number: string | null;
      } | null;
      code: {
        code: string;
        discountPercent: number;
        usageCount: number;
        lastUsedAt: string | null;
        builderPack: {
          freeMirror: boolean;
          cadDiscountPercent: number;
          prioritySupport: boolean;
        };
      };
    };

const STORAGE_KEY = "moss_builder_code_v1";

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export function BuilderDashboardPage() {
  const [codeInput, setCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StatusResponse | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCodeInput(stored);
    } catch {
      // ignore
    }
  }, []);

  const canFetch = useMemo(() => normalizeCode(codeInput).startsWith("BUILDER-") && codeInput.length >= 10, [codeInput]);

  async function fetchStatus() {
    if (!canFetch) return;
    setLoading(true);
    setError(null);

    const code = normalizeCode(codeInput);

    try {
      const res = await fetch("/api/builders/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(String(json?.error ?? "Failed to load"));
        return;
      }

      setData(json as StatusResponse);

      if ((json as any)?.valid) {
        try {
          localStorage.setItem(STORAGE_KEY, code);
        } catch {
          // ignore
        }
      }
    } catch (e: any) {
      setError(String(e?.message ?? "Failed to load"));
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    const code = normalizeCode(codeInput);
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="text-xs tracking-[0.24em] text-neutral-500 md:text-[18px] md:font-semibold md:tracking-normal">
        <Link href="/" className="md:text-orange-600">
          MAIN
        </Link>
        <span className="mx-2 md:text-neutral-400">/</span>
        <Link href="/contractors" className="md:text-neutral-700">
          CONTRACTORS
        </Link>
        <span className="mx-2 md:text-neutral-400">/</span>
        <Link href="/contractors/dashboard" className="md:text-neutral-700">
          DASHBOARD
        </Link>
      </div>

      <div className="mt-4">
        <h1 className="text-3xl font-semibold tracking-tight">Builder Dashboard</h1>
        <p className="mt-2 max-w-[720px] text-sm text-neutral-600">
          Retrieve your builder code, share it with clients, and see basic usage stats.
        </p>
      </div>

      <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="w-full">
            <label className="block text-sm font-medium text-neutral-800">Your builder code</label>
            <input
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="mt-2 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="BUILDER-XXXXXXX"
              autoCapitalize="characters"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={fetchStatus}
              disabled={!canFetch || loading}
              className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-2 text-xs font-semibold tracking-widest text-white disabled:opacity-50"
            >
              {loading ? "Loading…" : "LOAD"}
            </button>
          </div>
        </div>

        {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}

        {data?.valid === false ? (
          <div className="mt-4 text-sm text-neutral-600">Code not found or inactive.</div>
        ) : null}

        {data && (data as any).valid ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="text-sm font-semibold">Usage</div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-3xl font-semibold">{(data as any).code.usageCount}</div>
                <div className="text-sm text-neutral-600">total uses</div>
              </div>
              <div className="mt-3 text-xs text-neutral-500">
                Last used: {(data as any).code.lastUsedAt ? new Date((data as any).code.lastUsedAt).toLocaleString() : "—"}
              </div>

              <div className="mt-6 text-sm font-semibold">Builder details</div>
              <div className="mt-2 text-sm text-neutral-700">
                {(data as any).builderProfile ? (
                  <div className="space-y-1">
                    <div>
                      {(data as any).builderProfile.first_name} {(data as any).builderProfile.last_name}
                    </div>
                    <div>{(data as any).builderProfile.company}</div>
                    <div className="text-neutral-600">{(data as any).builderProfile.email}</div>
                    <div className="text-neutral-600">{(data as any).builderProfile.role}</div>
                  </div>
                ) : (
                  <div className="text-neutral-600">Profile not available.</div>
                )}
              </div>

              <div className="mt-6">
                <Link href="/catalog" className="text-sm font-semibold text-orange-600 underline">
                  Browse plans
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="text-sm font-semibold">Builder Pack</div>
              <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-neutral-700">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">Free mirrored set</div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                  {(data as any).code.builderPack.cadDiscountPercent}% off CAD files
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">Priority support</div>
              </div>
              <div className="mt-4 text-xs text-neutral-500">
                Plan discount: {(data as any).code.discountPercent}%
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight">Need a code?</h2>
        <p className="mt-2 text-sm text-neutral-600">Go back to Contractors and generate your builder code.</p>
        <div className="mt-4">
          <Link href="/contractors" className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-3 text-xs font-semibold tracking-widest text-white">
            GO TO CONTRACTORS
          </Link>
        </div>
      </div>
    </main>
  );
}

export default BuilderDashboardPage;
