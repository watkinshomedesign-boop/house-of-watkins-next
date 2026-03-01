"use client";

import { useEffect } from "react";
import { trackPinterestEvent } from "@/lib/pinterest";

export function PinterestCategoryTracker(props: { category: string }) {
  useEffect(() => {
    trackPinterestEvent('viewcategory', {
      product_category: props.category,
    });
  }, [props.category]);

  return null;
}
