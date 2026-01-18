"use client";

import { useEffect, useMemo, useState } from "react";
import type { AssetFromSource, AssetSourceComponentProps } from "@sanity/types";
import { useClient } from "sanity";

type ImageAssetListItem = {
  _id: string;
  url: string;
  originalFilename?: string;
  size?: number;
};

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  const decimals = i === 0 ? 0 : value < 10 ? 2 : 1;
  return `${value.toFixed(decimals)} ${units[i]}`;
}

function debounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function FilenameImageAssetSource(props: AssetSourceComponentProps) {
  const client = useClient({ apiVersion: "2025-02-07" });

  const [query, setQuery] = useState("");
  const debouncedQuery = debounce(query, 200);

  const [items, setItems] = useState<ImageAssetListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const pageSize = 60;

  const searchPattern = useMemo(() => {
    const q = debouncedQuery.trim();
    if (!q) return null;
    // GROQ match supports wildcards. We only search filenames.
    return `*${q}*`;
  }, [debouncedQuery]);

  useEffect(() => {
    // Reset list on new search
    setPage(0);
    setItems([]);
  }, [searchPattern]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      const start = page * pageSize;
      const end = start + pageSize;

      const groq =
        searchPattern
          ? `*[_type == "sanity.imageAsset" && defined(originalFilename) && originalFilename match $pattern] | order(_createdAt desc) [${start}...${end}] { _id, url, originalFilename, size }`
          : `*[_type == "sanity.imageAsset"] | order(_createdAt desc) [${start}...${end}] { _id, url, originalFilename, size }`;

      try {
        const next = searchPattern
          ? await client.fetch<ImageAssetListItem[]>(groq, { pattern: searchPattern })
          : await client.fetch<ImageAssetListItem[]>(groq);
        if (cancelled) return;
        setItems((prev) => (page === 0 ? next : [...prev, ...next]));
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : "Failed to load assets";
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [client, page, pageSize, searchPattern]);

  function handleSelect(assetId: string) {
    const selection: AssetFromSource[] = [{ kind: "assetDocumentId", value: assetId }];
    props.onSelect(selection);
    props.onClose();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search by file name…"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.15)",
            fontSize: 14,
          }}
        />
        <button
          type="button"
          onClick={() => setQuery("")}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "transparent",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Clear
        </button>
      </div>

      {error ? (
        <div style={{ color: "#b42318", fontSize: 13 }}>{error}</div>
      ) : null}

      <div
        style={{
          overflow: "auto",
          flex: 1,
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.08)",
          padding: 12,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          {items.map((asset) => {
            const name = asset.originalFilename ?? asset._id;
            const size = formatBytes(asset.size);
            return (
              <button
                key={asset._id}
                type="button"
                onClick={() => handleSelect(asset._id)}
                style={{
                  textAlign: "left",
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "#fff",
                  }}
                >
                  <div style={{ aspectRatio: "1 / 1", background: "#f3f4f6" }}>
                    <img
                      src={asset.url}
                      alt={name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: 8 }}>
                    <div
                      title={name}
                      style={{
                        fontSize: 12,
                        lineHeight: "16px",
                        color: "#111827",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {name}
                    </div>
                    <div style={{ fontSize: 12, lineHeight: "16px", color: "#6b7280" }}>{size}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>Loading…</div>
        ) : null}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <button
          type="button"
          onClick={props.onClose}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "transparent",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={loading}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.15)",
            background: loading ? "rgba(0,0,0,0.04)" : "#111827",
            color: loading ? "#6b7280" : "#fff",
            cursor: loading ? "default" : "pointer",
            fontSize: 14,
          }}
        >
          Load more
        </button>
      </div>
    </div>
  );
}
