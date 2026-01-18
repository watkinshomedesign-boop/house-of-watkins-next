"use client";

import React, { useEffect, useMemo, useState } from "react";

type PreviewPaneProps = {
  document?: any;
  options?: {
    path?: string;
  };
};

type PreviewStatus = {
  server?: {
    PREVIEW_SECRET?: boolean;
    SANITY_API_READ_TOKEN?: boolean;
  };
  client?: {
    NEXT_PUBLIC_PREVIEW_SECRET?: boolean;
    NEXT_PUBLIC_SITE_URL?: boolean;
  };
};

export default function PreviewPane(props: PreviewPaneProps) {
  const path = props.options?.path ?? "/";
  const secret = (process.env.NEXT_PUBLIC_PREVIEW_SECRET || "") as string;
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const baseOrRelative = base ? base : "";

  const [status, setStatus] = useState<PreviewStatus | null>(null);
  const [statusLoadError, setStatusLoadError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    fetch(`${baseOrRelative}/api/preview/status`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (canceled) return;
        setStatus({
          server: {
            PREVIEW_SECRET: Boolean(j?.server?.PREVIEW_SECRET),
            SANITY_API_READ_TOKEN: Boolean(j?.server?.SANITY_API_READ_TOKEN),
          },
          client: {
            NEXT_PUBLIC_PREVIEW_SECRET: Boolean(j?.client?.NEXT_PUBLIC_PREVIEW_SECRET),
            NEXT_PUBLIC_SITE_URL: Boolean(j?.client?.NEXT_PUBLIC_SITE_URL),
          },
        });
        setStatusLoadError(null);
      })
      .catch((e) => {
        if (canceled) return;
        setStatus(null);
        setStatusLoadError(String(e?.message || "Failed to load /api/preview/status"));
      });

    return () => {
      canceled = true;
    };
  }, [baseOrRelative]);

  const previewUrl = useMemo(() => {
    const p = path.startsWith("/") ? path : `/${path}`;
    const params = new URLSearchParams();
    if (secret) params.set("secret", secret);
    params.set("redirect", p);
    return `${baseOrRelative}/api/preview?${params.toString()}`;
  }, [path, secret, baseOrRelative]);

  const exitUrl = useMemo(() => {
    const p = path.startsWith("/") ? path : `/${path}`;
    const params = new URLSearchParams();
    params.set("redirect", p);
    return `${baseOrRelative}/api/exit-preview?${params.toString()}`;
  }, [path, baseOrRelative]);

  const checklist = useMemo(() => {
    const clientPreviewSecretOk = Boolean(secret);
    const serverPreviewSecretOk = Boolean(status?.server?.PREVIEW_SECRET);
    const sanityTokenOk = Boolean(status?.server?.SANITY_API_READ_TOKEN);
    const siteUrlOk = Boolean(status?.client?.NEXT_PUBLIC_SITE_URL);

    const requiredOk = clientPreviewSecretOk && serverPreviewSecretOk && sanityTokenOk;

    return {
      clientPreviewSecretOk,
      serverPreviewSecretOk,
      sanityTokenOk,
      siteUrlOk,
      requiredOk,
    };
  }, [secret, status]);

  const showIframe = checklist.requiredOk;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Preview diagnostics</div>

        <div style={{ display: "grid", gap: 6 }}>
          <div>
            {checklist.serverPreviewSecretOk ? "✅" : "❌"} PREVIEW_SECRET configured (server)
          </div>
          <div>
            {checklist.sanityTokenOk ? "✅" : "❌"} SANITY_API_READ_TOKEN configured (server)
          </div>
          <div>
            {checklist.clientPreviewSecretOk ? "✅" : "❌"} NEXT_PUBLIC_PREVIEW_SECRET configured (client)
          </div>
          <div>
            {checklist.siteUrlOk ? "✅" : "⚠️"} NEXT_PUBLIC_SITE_URL configured (optional)
          </div>
        </div>

        {statusLoadError ? (
          <div style={{ marginTop: 10, opacity: 0.8 }}>
            Could not load <code>/api/preview/status</code>: {statusLoadError}
          </div>
        ) : null}

        {!checklist.requiredOk ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>How to fix</div>
            <div style={{ opacity: 0.85, lineHeight: 1.5 }}>
              <div>
                1) In <code>.env.local</code> set:
              </div>
              <div style={{ marginTop: 6 }}>
                <code>PREVIEW_SECRET</code> (server-only)
                <br />
                <code>NEXT_PUBLIC_PREVIEW_SECRET</code> (client) — must match exactly
                <br />
                <code>SANITY_API_READ_TOKEN</code> (server-only)
              </div>
              <div style={{ marginTop: 6 }}>
                2) Restart the dev server (<code>npm run dev</code>).
              </div>
              <div style={{ marginTop: 6 }}>
                3) Reload this Preview tab.
              </div>
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <a href={previewUrl} target="_blank" rel="noreferrer">
            Open Preview
          </a>
          <a href={exitUrl} target="_blank" rel="noreferrer">
            Exit Preview
          </a>
          <span style={{ opacity: 0.7 }}>Path: {path}</span>
        </div>
      </div>

      {showIframe ? (
        <iframe title="Preview" src={previewUrl} style={{ border: 0, width: "100%", flex: 1 }} />
      ) : (
        <div style={{ padding: 16, opacity: 0.8 }}>Preview iframe is disabled until required items are configured.</div>
      )}
    </div>
  );
}
