// app/(site)/contractors/page.tsx
import { Suspense } from "react";
import { getPlanBySlug } from "@/src/lib/plans";
import ContractorsPageContent from "@/src/sitePages/ContractorsPageContent";

export const metadata = {
  title: "Builder Plans & Licensing | House of Watkins",
  description: "Professional floor plans for builders. License pre-designed plans, customize quickly, and build immediately.",
};

export default async function ContractorsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ContractorsPageContent />
    </Suspense>
  );
}