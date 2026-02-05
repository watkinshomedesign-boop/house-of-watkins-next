"use client";

import { useEffect, useMemo, useState } from "react";
import { HouseGrid } from "@/sections/HouseGrid";
import type { Plan } from "@/lib/plans";
import { PlanGridSkeleton } from "@/components/PlanCardsSkeleton";
import { usePlansCache, type CachedPlan } from "@/lib/plans/PlansCache";

function popularScore(p: CachedPlan) {
  return (p.stats?.purchases ?? 0) * 100 + (p.stats?.favorites ?? 0) * 10 + (p.stats?.views ?? 0);
}

function toHouseGridPlan(p: CachedPlan): Plan {
  const hero = p.cardImages?.front || "/placeholders/plan-hero.svg";
  const plan = p.cardImages?.plan || "/placeholders/floorplan.svg";

  return {
    id: p.id ?? p.slug,
    slug: p.slug,
    name: p.name,
    description: p.description ?? null,
    tour3d_url: p.tour3d_url ?? null,
    filters: p.filters ?? {},
    heated_sqft: Number(p.heated_sqft ?? 0),
    beds: p.beds,
    baths: p.baths,
    stories: p.stories,
    garage_bays: p.garage_bays,
    width_ft: p.width_ft ?? null,
    depth_ft: p.depth_ft ?? null,
    tags: p.tags ?? null,
    images: {
      hero_desktop: hero,
      hero_mobile: hero,
      hero,
      hover: plan,
      floorplan: [plan],
    },
  };
}

export const MostPopularPlans = () => {
  const { plans, loading, error } = usePlansCache();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading || error) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [loading, error]);

  const topPlans = useMemo(() => {
    const sorted = [...plans].sort((a, b) => {
      const score = popularScore(b) - popularScore(a);
      if (score !== 0) return score;
      const sqft = Number(b.heated_sqft ?? 0) - Number(a.heated_sqft ?? 0);
      if (sqft !== 0) return sqft;
      return String(a.slug || "").localeCompare(String(b.slug || ""));
    });

    return sorted.slice(0, 6).map(toHouseGridPlan);
  }, [plans]);

  if (loading) return <PlanGridSkeleton count={6} desktopCols={3} />;
  if (error) return null;
  if (topPlans.length === 0) return null;

  return (
    <div className={`transition-opacity duration-300 ease-out ${visible ? "opacity-100" : "opacity-0"}`}>
      <HouseGrid plans={topPlans} desktopCols={3} />
    </div>
  );
};
