"use client";

import { MD_UP_MEDIA_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import type { ContactPageMediaProps } from "@/sitePages/ContactPage";
import { ContactPageInner } from "@/sitePages/ContactPage";
import { ContactPageMobile } from "@/sitePages/ContactPageMobile";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

export type ContactPageResponsiveProps = {
  media?: ContactPageMediaProps;
};

export function ContactPageResponsive(props: ContactPageResponsiveProps) {
  const isDesktop = useMediaQuery(MD_UP_MEDIA_QUERY, { serverFallback: true });

  if (isDesktop) {
    return (
      <>
        <InteriorHeader />
        <ContactPageInner media={props.media} />
        <Footer />
      </>
    );
  }

  return <ContactPageMobile media={props.media} />;
}

export default ContactPageResponsive;
