"use client";

import { WhatsIncludedPageRebuild, type WhatsIncludedPageProps } from "./WhatsIncludedPageRebuild";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

export function WhatsIncludedPage(props: WhatsIncludedPageProps) {
  return (
    <>
      <InteriorHeader />
      <WhatsIncludedPageRebuild {...props} />
      <Footer />
    </>
  );
}

export default WhatsIncludedPage;
