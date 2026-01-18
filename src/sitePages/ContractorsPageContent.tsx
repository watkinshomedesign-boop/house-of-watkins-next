"use client";

import { useState } from "react";

import HeroSection from "@/sections/contractors/HeroSection";
import ProblemsSection from "@/sections/contractors/ProblemsSection";
import SolutionSection from "@/sections/contractors/SolutionSection";
import OfferSection from "@/sections/contractors/OfferSection";
import FeaturesSection from "@/sections/contractors/FeaturesSection";
import TestimonialsSection from "@/sections/contractors/TestimonialsSection";
import BuilderPartnerSection from "@/sections/contractors/BuilderPartnerSection";
import PricingSection from "@/sections/contractors/PricingSection";
import CTASection from "@/sections/contractors/CTASection";
import ContactModal from "@/sections/contractors/ContactModal";

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

      <ContactModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
