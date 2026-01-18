"use client";

import { useEffect, useMemo, useState } from "react";

type AssetTypeFilter = "all" | "images" | "videos";

type AssetListItem = {
  _id: string;
  _type: "sanity.imageAsset" | "sanity.fileAsset";
  url: string;
  originalFilename: string | null;
  title?: string | null;
  mimeType?: string | null;
  size?: number | null;
  assetId?: string | null;
  _createdAt?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
      aspectRatio?: number;
    };
  };
};

type AssetUsagePlan = {
  planId: string;
  slug: string;
  name: string;
  fields: string[];
};

function formatBytes(bytes: number | null | undefined) {
  const b = typeof bytes === "number" && Number.isFinite(bytes) ? bytes : null;
  if (b == null) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  return `${(b / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(iso: string | null | undefined) {
  const s = String(iso || "").trim();
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString();
}

function isImage(asset: AssetListItem) {
  return asset._type === "sanity.imageAsset" || String(asset.mimeType || "").startsWith("image/");
}

function toImageRefJson(asset: AssetListItem) {
  return {
    _type: "image",
    asset: {
      _ref: asset._id,
    },
  };
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function SanityMediaLibrary() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<AssetTypeFilter>("all");

  const [items, setItems] = useState<AssetListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(60);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<AssetListItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [usagePlans, setUsagePlans] = useState<AssetUsagePlan[]>([]);

  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  const queryKey = useMemo(() => {
    return JSON.stringify({ q: q.trim(), type, offset, limit });
  }, [q, type, offset, limit]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("offset", String(offset));
      if (q.trim()) params.set("q", q.trim());
      if (type !== "all") params.set("type", type);

      const res = await fetch(`/api/admin/sanity-assets?${params.toString()}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");

      setItems((j.items ?? []) as any);
      setTotal(Number(j.total ?? 0));

      if (j.sanityConfigured === false) {
        setError("Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.");
      }
    } catch (e: any) {
      setError(e?.message || "Failed");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    let canceled = false;
    async function loadUsage(assetId: string) {
      setUsageLoading(true);
      setUsageError(null);
      setUsagePlans([]);
      try {
        const params = new URLSearchParams();
        params.set("assetId", assetId);
        const res = await fetch(`/api/admin/sanity-asset-usage?${params.toString()}`);
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "Failed to load usage");
        if (!canceled) setUsagePlans((j.plans ?? []) as any);
      } catch (e: any) {
        if (!canceled) setUsageError(e?.message || "Failed to load usage");
      } finally {
        if (!canceled) setUsageLoading(false);
      }
    }

    if (selected?._id) {
      loadUsage(selected._id);
    } else {
      setUsagePlans([]);
      setUsageError(null);
      setUsageLoading(false);
    }

    return () => {
      canceled = true;
    };
  }, [selected?._id]);

  return (
    <div className="space-y-4">
      <div className="rounded border p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={q}
              onChange={(e) => {
                setOffset(0);
                setQ(e.target.value);
              }}
              placeholder="Search images…"
              className="w-full rounded border px-3 py-2 text-sm sm:max-w-md"
            />
            <select
              value={type}
              onChange={(e) => {
                setOffset(0);
                setType(e.target.value as any);
              }}
              className="w-full rounded border px-3 py-2 text-sm sm:max-w-[220px]"
            >
              <option value="all">All</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="text-xs text-neutral-600">
              {loading ? "Loading…" : `${total} assets`}
            </div>
            <button
              type="button"
              onClick={() => load()}
              className="rounded bg-black px-3 py-2 text-sm font-semibold text-white"
            >
              Refresh
            </button>
          </div>
        </div>

        {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}
        {toast ? <div className="mt-3 text-sm text-green-700">{toast}</div> : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((a) => {
          const dims = a.metadata?.dimensions;
          const title = String(a.title || a.originalFilename || a._id);
          return (
            <button
              key={a._id}
              type="button"
              onClick={() => setSelected(a)}
              className="group rounded border text-left"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-50">
                {isImage(a) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.url}
                    alt={title}
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                    {String(a.mimeType || a._type)}
                  </div>
                )}
              </div>
              <div className="p-2">
                <div className="truncate text-xs font-semibold">{title}</div>
                <div className="mt-1 text-[11px] text-neutral-500">
                  {dims?.width && dims?.height ? `${dims.width}×${dims.height}` : null}
                  {dims?.width && dims?.height ? " · " : null}
                  {String(a.mimeType || a._type)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setOffset((o) => Math.max(0, o - limit))}
          className="rounded border px-3 py-2 text-sm disabled:opacity-50"
        >
          Prev
        </button>
        <div className="text-xs text-neutral-600">
          {total ? `${offset + 1}–${Math.min(offset + limit, total)} of ${total}` : "0"}
        </div>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setOffset((o) => o + limit)}
          className="rounded border px-3 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40 p-3" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl overflow-auto rounded bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{String(selected.title || selected.originalFilename || selected._id)}</div>
                <div className="mt-1 text-xs text-neutral-500">{selected._id}</div>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded border px-3 py-2 text-sm">
                Close
              </button>
            </div>

            <div className="mt-4">
              {isImage(selected) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.url}
                  alt={String(selected.title || selected.originalFilename || selected._id)}
                  className="max-h-[55vh] w-full rounded border object-contain"
                />
              ) : (
                <div className="rounded border p-4 text-sm">Preview not available for this file type.</div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
              <div className="rounded border p-3">
                <div className="text-xs font-semibold text-neutral-600">Metadata</div>
                <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-neutral-700">
                  <div>
                    <span className="text-neutral-500">Original filename:</span> {String(selected.originalFilename || "")}
                  </div>
                  <div>
                    <span className="text-neutral-500">MIME:</span> {String(selected.mimeType || "")}
                  </div>
                  <div>
                    <span className="text-neutral-500">Size:</span> {formatBytes(selected.size)}
                  </div>
                  <div>
                    <span className="text-neutral-500">Dimensions:</span>{" "}
                    {selected.metadata?.dimensions?.width && selected.metadata?.dimensions?.height
                      ? `${selected.metadata.dimensions.width}×${selected.metadata.dimensions.height}`
                      : ""}
                  </div>
                  <div>
                    <span className="text-neutral-500">Uploaded:</span> {formatDate(selected._createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    await copyText(selected.url);
                    setToast("Copied URL");
                  }}
                  className="rounded bg-black px-3 py-2 text-sm font-semibold text-white"
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await copyText(selected._id);
                    setToast("Copied Asset ID");
                  }}
                  className="rounded border px-3 py-2 text-sm"
                >
                  Copy Asset ID
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const json = JSON.stringify(toImageRefJson(selected));
                    await copyText(json);
                    setToast("Copied Image Ref JSON");
                  }}
                  className="rounded border px-3 py-2 text-sm"
                >
                  Copy Image Ref JSON
                </button>
              </div>

              <div className="mt-2 text-xs text-neutral-500">Image Ref JSON uses _ref = asset document _id (e.g. sanity.imageAsset id).</div>

              <div className="mt-4 rounded border p-3">
                <div className="text-xs font-semibold text-neutral-600">Usage (plans)</div>
                {usageLoading ? <div className="mt-2 text-xs text-neutral-600">Loading…</div> : null}
                {usageError ? <div className="mt-2 text-xs text-red-600">{usageError}</div> : null}
                {!usageLoading && !usageError ? (
                  usagePlans.length ? (
                    <div className="mt-2 space-y-2">
                      {usagePlans.map((p) => (
                        <div key={p.planId} className="rounded border p-2">
                          <div className="text-xs font-semibold">
                            <a href={`/admin/plans/${p.planId}`} className="underline">
                              {p.slug}
                            </a>
                            {p.name ? <span className="text-neutral-500"> — {p.name}</span> : null}
                          </div>
                          <div className="mt-1 text-[11px] text-neutral-600">Fields: {p.fields.join(", ")}</div>
                          <div className="mt-1 text-[11px]">
                            <a href={`/house/${p.slug}`} target="_blank" rel="noreferrer" className="underline">
                              View live
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-neutral-600">No plan usage found.</div>
                  )
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
