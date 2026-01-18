import type { Metadata } from "next";
import { Suspense } from "react";

import ContractorsPageContent from "@/sitePages/ContractorsPageContent";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

export const metadata: Metadata = {
  title: "Builder Plans & Licensing | House of Watkins",
  description: "Professional floor plans for builders. License pre-designed plans, customize quickly, and build immediately.",
};

export default function ContractorsV2Page() {
  return (
    <>
      <InteriorHeader />
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <ContractorsPageContent />
      </Suspense>
      <Footer />
    </>
  );
}
