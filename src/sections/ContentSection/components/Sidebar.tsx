"use client";

import { PricingCard } from "@/sections/ContentSection/components/PricingCard";
import { SpecsCard } from "@/sections/ContentSection/components/SpecsCard";
import { OrderForm } from "@/sections/ContentSection/components/OrderForm";
import { AddToCartButton } from "@/sections/ContentSection/components/AddToCartButton";
import { usePlan } from "@/lib/planContext";

export const Sidebar = () => {
  const plan = usePlan();

  return (
    <div
      id="pdp-order-box"
      className="static [align-items:normal] bg-transparent box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto rounded-none md:relative md:items-start md:aspect-auto md:bg-stone-50 md:box-border md:caret-transparent md:gap-x-[21.376px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-0 md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:max-w-[607px] md:[mask-position:0%] md:bg-left-top md:p-[32px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[32px] lg:max-w-[650px]"
    >
      <PricingCard />
      <SpecsCard />
      <OrderForm />
      <AddToCartButton slug={plan.slug} name={plan.name} heated_sqft={plan.heated_sqft} />
    </div>
  );
};
