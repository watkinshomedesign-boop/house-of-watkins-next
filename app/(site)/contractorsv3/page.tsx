import type { Metadata } from "next";
import { Suspense } from "react";

import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import ContractorsPageContentV3 from "@/sitePages/ContractorsPageContentV3";

export const metadata: Metadata = {
  title: "Builder Plans & Licensing | House of Watkins",
  description: "Professional floor plans for builders. License pre-designed plans, customize quickly, and build immediately.",
};

export default function ContractorsV3Page() {
  return (
    <>
      <InteriorHeader />
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <ContractorsPageContentV3 />
      </Suspense>
      <Footer />
    </>
  );
}
