// src/sitePages/ContractorsPageContent.tsx
"use client";

import { useState } from "react";
import HeroSection from "@/src/sections/contractors/HeroSection";
import ProblemsSection from "@/src/sections/contractors/ProblemsSection";
import SolutionSection from "@/src/sections/contractors/SolutionSection";
import OfferSection from "@/src/sections/contractors/OfferSection";
import FeaturesSection from "@/src/sections/contractors/FeaturesSection";
import TestimonialsSection from "@/src/sections/contractors/TestimonialsSection";
import BuilderPartnerSection from "@/src/sections/contractors/BuilderPartnerSection";
import PricingSection from "@/src/sections/contractors/PricingSection";
import CTASection from "@/src/sections/contractors/CTASection";
import ContactModal from "@/src/sections/contractors/ContactModal";

export default function ContractorsPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <HeroSection onCTAClick={openModal} />
      <ProblemsSection />
      <SolutionSection />
      <OfferSection onCTAClick={openModal} />
      <FeaturesSection />
      <TestimonialsSection />
      <BuilderPartnerSection onCTAClick={openModal} />
      <PricingSection onCTAClick={openModal} />
      <CTASection onCTAClick={openModal} />
      
      {isModalOpen && (
        <ContactModal isOpen={isModalOpen} onClose={closeModal} />
      )}
    </div>
  );
}