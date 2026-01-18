"use client";

import { SpecItem } from "@/sections/ContentSection/components/SpecItem";
import { usePlan } from "@/lib/planContext";

export const SpecsCard = () => {
  const plan = usePlan();

  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[10.624px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[10.624px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <SpecItem label="Total Area" value={`${plan.heated_sqft.toLocaleString()} Sq Ft`} />
      <SpecItem label="Width" value={plan.width_ft ? `${plan.width_ft} ft` : "-"} />
      <SpecItem label="Depth" value={plan.depth_ft ? `${plan.depth_ft} ft` : "-"} />
      <SpecItem label="Max Ridge Height" value={"18'-7\""} />
    </div>
  );
};
