"use client";

import { useEffect } from "react";

export function PlanViewTracker(props: { planSlug: string }) {
  useEffect(() => {
    const slug = String(props.planSlug || "");
    if (!slug) return;

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: "plan_view", plan_slug: slug }),
    }).catch(() => {
      // ignore
    });
  }, [props.planSlug]);

  return null;
}
