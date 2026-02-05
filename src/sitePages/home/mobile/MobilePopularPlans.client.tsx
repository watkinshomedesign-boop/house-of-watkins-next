"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/sections/ProductGrid/components/ProductCard";
import { PlanListSkeleton } from "@/components/PlanCardsSkeleton";
import { usePlansCache, type CachedPlan } from "@/lib/plans/PlansCache";

function popularScore(p: CachedPlan) {
  return (p.stats?.purchases ?? 0) * 100 + (p.stats?.favorites ?? 0) * 10 + (p.stats?.views ?? 0);
}

function formatSqft(n: number) {
  return n.toLocaleString();
}

function startingPriceUsd(heatedSqft: number) {
  const price = 1250 + 0.65 * heatedSqft;
  return `$ ${Math.round(price)}`;
}

export function MobilePopularPlans() {
  const { plans, loading, error } = usePlansCache();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading || error) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [loading, error]);

  const top = useMemo(() => {
    const sorted = [...plans].sort((a, b) => {
      const score = popularScore(b) - popularScore(a);
      if (score !== 0) return score;
      const sqft = Number(b.heated_sqft ?? 0) - Number(a.heated_sqft ?? 0);
      if (sqft !== 0) return sqft;
      return String(a.slug || "").localeCompare(String(b.slug || ""));
    });

    return sorted.slice(0, 3);
  }, [plans]);

  if (loading) return <PlanListSkeleton count={3} />;
  if (error) return null;
  if (top.length === 0) return null;

  return (
    <div className={`grid grid-cols-1 gap-4 transition-opacity duration-300 ease-out ${visible ? "opacity-100" : "opacity-0"}`}>
      {top.map((p) => (
        <ProductCard
          key={p.id || p.slug}
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
}
