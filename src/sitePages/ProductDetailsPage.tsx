"use client";

import React from "react";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { HeroSection } from "@/sections/HeroSection";
import { ContentSection } from "@/sections/ContentSection";
import { TrendingSection } from "@/sections/TrendingSection";
import { Footer } from "@/sections/Footer";
import { usePlan } from "@/lib/planContext";
import { PdpProvider } from "@/lib/pdpState";

export function ProductDetailsPage() {
  const plan = usePlan();

  return (
    <PdpProvider slug={plan.slug}>
      <div className="text-zinc-800 font-gilroy">
        <InteriorHeader />
        <div className="[align-items:normal] self-auto box-content caret-black gap-x-[normal] block flex-row outline-black gap-y-[normal] p-0 px-4 sm:px-6 md:items-start md:self-stretch md:aspect-auto md:box-border md:caret-transparent md:gap-x-[35.584px] md:flex md:flex-col md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[35.584px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:px-12 lg:px-16 xl:px-20 md:pt-4 md:pb-[35.584px] md:scroll-m-0 md:scroll-p-[auto] w-full">
          <Breadcrumb currentLabel="House plans" currentHref="/house-plans" />
          <HeroSection />
          <ContentSection />
          <TrendingSection />
        </div>
        <Footer />
      </div>
    </PdpProvider>
  );
}

export default ProductDetailsPage;
