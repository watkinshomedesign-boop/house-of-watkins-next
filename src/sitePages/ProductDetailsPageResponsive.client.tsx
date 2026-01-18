"use client";

import { MD_UP_MEDIA_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { ProductDetailsPage } from "@/sitePages/ProductDetailsPage";
import { ProductDetailsPageMobile } from "@/sitePages/ProductDetailsPageMobile";

export function ProductDetailsPageResponsive() {
  const isDesktop = useMediaQuery(MD_UP_MEDIA_QUERY, { serverFallback: true });

  if (isDesktop) {
    return <ProductDetailsPage />;
  }

  return <ProductDetailsPageMobile />;
}
