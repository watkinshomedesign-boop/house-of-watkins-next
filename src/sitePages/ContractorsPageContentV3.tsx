"use client";

import { useState } from "react";
import Link from "next/link";

import HeroSectionV3 from "@/sections/contractorsv3/HeroSectionV3";
import ProblemsSectionV3 from "@/sections/contractorsv3/ProblemsSectionV3";
import SolutionSectionV3 from "@/sections/contractorsv3/SolutionSectionV3";
import OfferSectionV3 from "@/sections/contractorsv3/OfferSectionV3";
import FeaturesSectionV3 from "@/sections/contractorsv3/FeaturesSectionV3";
import TestimonialsSectionV3 from "@/sections/contractorsv3/TestimonialsSectionV3";
import BuilderPartnerSectionV3 from "@/sections/contractorsv3/BuilderPartnerSectionV3";
import PricingSectionV3 from "@/sections/contractorsv3/PricingSectionV3";
import CTASectionV3 from "@/sections/contractorsv3/CTASectionV3";
import ContactModalV3 from "@/sections/contractorsv3/ContactModalV3";

export default function ContractorsPageContentV3() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:py-14">
        <div className="text-xs tracking-[0.24em] text-neutral-500 md:text-[18px] md:font-semibold md:tracking-normal">
          <Link href="/" className="md:text-orange-600">
            MAIN
          </Link>
          <span className="mx-2 md:text-neutral-400">/</span>
          <Link href="/contractorsv3" className="md:text-neutral-700">
            BUILDERS
          </Link>
        </div>
        <HeroSectionV3 onCTAClick={openModal} />
      </main>

      <ProblemsSectionV3 />
      <SolutionSectionV3 />
      <OfferSectionV3 onCTAClick={openModal} />
      <FeaturesSectionV3 />
      <TestimonialsSectionV3 />
      <BuilderPartnerSectionV3 onCTAClick={openModal} />
      <PricingSectionV3 onCTAClick={openModal} />
      <CTASectionV3 onCTAClick={openModal} />

      <ContactModalV3 isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
