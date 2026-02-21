"use client";

import { useEffect } from "react";
import { gtmPush } from "@/lib/gtm";

export function PlanViewTracker(props: {
  planSlug: string;
  planName?: string;
  planPrice?: number;
}) {
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

    gtmPush({
      event: "view_item",
      ecommerce: {
        items: [
          {
            item_id: slug,
            item_name: props.planName || slug,
            ...(props.planPrice ? { price: props.planPrice } : {}),
          },
        ],
      },
    });
  }, [props.planSlug, props.planName, props.planPrice]);

  return null;
}
