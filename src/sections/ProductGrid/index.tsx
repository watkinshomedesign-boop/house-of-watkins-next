"use client";

import { useMemo } from "react";
import { ProductCard } from "@/sections/ProductGrid/components/ProductCard";
import { usePlansCache } from "@/lib/plans/PlansCache";

function formatSqft(n: number) {
  return n.toLocaleString();
}

function startingPriceUsd(heatedSqft: number) {
  const price = 1250 + 0.65 * heatedSqft;
  return `$ ${Math.round(price)}`;
}

export const ProductGrid = () => {
  const { plans } = usePlansCache();

  const featured = useMemo(() => plans.slice(0, 6), [plans]);
  if (featured.length === 0) return null;

  return (
    <div className="static box-content caret-black gap-x-[normal] block grid-cols-none min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:grid md:grid-cols-[repeat(3,1fr)] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      {featured.map((p) => (
        <ProductCard
          key={p.slug}
          href={`/house/${p.slug}`}
          planSlug={p.slug}
          tour3dUrl={(p as any).tour3d_url ?? null}
          imageSrc={p.cardImages?.front || "/placeholders/plan-hero.svg"}
          title={p.name}
          squareFeet={`${formatSqft(p.heated_sqft || 0)} Sq Ft`}
          price={startingPriceUsd(p.heated_sqft || 0)}
          bedrooms={`${p.beds ?? "-"} Bed`}
          bathrooms={`${p.baths ?? "-"} Bath`}
          garages={`${p.garage_bays ?? "-"} Garage`}
          stories={`${p.stories ?? "-"} Story`}
        />
      ))}
    </div>
  );
};
