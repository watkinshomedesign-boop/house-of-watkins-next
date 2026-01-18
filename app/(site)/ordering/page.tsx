"use client";

import { OrderingPage } from "@/sitePages/OrderingPage";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { MD_UP_MEDIA_QUERY, useMediaQuery } from "@/lib/useMediaQuery";

export default function OrderingRoutePage() {
  const isDesktop = useMediaQuery(MD_UP_MEDIA_QUERY, { serverFallback: true });

  if (isDesktop) {
    return (
      <>
        <InteriorHeader />
        <OrderingPage />
      </>
    );
  }

  return <OrderingPage />;
}
