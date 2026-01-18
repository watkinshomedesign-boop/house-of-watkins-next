"use client";

import { MD_UP_MEDIA_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { HousePlansPageDesktop, HousePlansPageMobile, type HousePlansPageProps } from "@/sitePages/HousePlansPage";

export function HousePlansPageResponsive(props: HousePlansPageProps) {
  const isDesktop = useMediaQuery(MD_UP_MEDIA_QUERY, { serverFallback: true });

  if (isDesktop) {
    return <HousePlansPageDesktop {...props} />;
  }

  return <HousePlansPageMobile {...props} />;
}
