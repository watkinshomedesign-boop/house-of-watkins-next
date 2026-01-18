"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/sections/ProductGrid/components/ProductCard";
import { PlanListSkeleton } from "@/components/PlanCardsSkeleton";

type CatalogPlan = {
  id?: string;
  slug: string;
  name: string;
  heated_sqft: number;
  beds: number | null;
  baths: number | null;
  stories: number | null;
  garage_bays: number | null;
  cardImages?: { front: string; plan: string };
  tour3d_url?: string | null;
  stats: { views: number; favorites: number; purchases: number };
};

function popularScore(p: CatalogPlan) {
  return (p.stats?.purchases ?? 0) * 100 + (p.stats?.favorites ?? 0) * 10 + (p.stats?.views ?? 0);
}

function formatSqft(n: number) {
  return n.toLocaleString();
}

function startingPriceUsd(heatedSqft: number) {
  const price = 1250 + 0.65 * heatedSqft;
  return `$ ${Math.round(price)}`;
}

function safeImageSrc(p: CatalogPlan) {
  const front = String(p.cardImages?.front ?? "").trim();
  const plan = String(p.cardImages?.plan ?? "").trim();
  return front || plan || "/placeholders/plan-hero.svg";
}

export function MobilePopularPlans() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<CatalogPlan[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setVisible(false);

    fetch("/api/catalog/plans?includeStats=1")
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed to load plans");
        return j;
      })
      .then((j) => {
        if (!mounted) return;
        setPlans((j.plans ?? []) as CatalogPlan[]);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
