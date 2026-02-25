"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PageVisitTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string>("");

  useEffect(() => {
    // Avoid duplicate fires for the same path
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    const referrer = document.referrer || null;
    const url = new URL(window.location.href);
    const utm_source = url.searchParams.get("utm_source") || null;
    const utm_medium = url.searchParams.get("utm_medium") || null;
    const utm_campaign = url.searchParams.get("utm_campaign") || null;

    fetch("/api/page-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
      }),
    }).catch(() => {
      // ignore
    });
  }, [pathname]);

  return null;
}
