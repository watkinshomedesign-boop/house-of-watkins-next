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
    <div className="flex w-full flex-wrap gap-6">
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
