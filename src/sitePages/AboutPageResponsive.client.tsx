"use client";

import { MD_UP_MEDIA_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { AboutPage, type AboutPageMediaProps } from "@/sitePages/AboutPage";
import { AboutPageMobile } from "@/sitePages/AboutPageMobile";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

export type AboutPageResponsiveProps = {
  media?: AboutPageMediaProps;
};

export function AboutPageResponsive(props: AboutPageResponsiveProps) {
  const isDesktop = useMediaQuery(MD_UP_MEDIA_QUERY, { serverFallback: true });

  if (isDesktop) {
    return (
      <>
        <InteriorHeader />
        <AboutPage media={props.media} />
        <Footer />
      </>
    );
  }

  return <AboutPageMobile media={props.media} />;
}
