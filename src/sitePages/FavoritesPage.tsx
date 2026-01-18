"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Plan } from "@/lib/plans";
import { HouseGrid } from "@/sections/HouseGrid";
import { ConsultationCard } from "@/sections/FilterSidebar/components/ConsultationCard";
import { useFavorites } from "@/lib/favorites/useFavorites";

type FavoritesPageProps = {
  plans: Plan[];
};

export function FavoritesPage(props: FavoritesPageProps) {
  const fav = useFavorites();

  const favoritePlans = useMemo(() => {
    const slugs = fav.favorites;
    return props.plans.filter((p) => slugs.has(p.slug));
  }, [fav.favorites, props.plans]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Favorites</h1>

      {favoritePlans.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-600">No favorites yet</p>
          <Link
            href="/catalog"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Browse catalog
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <HouseGrid plans={favoritePlans} />
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold tracking-tight">Questions about a plan?</h2>
          <p className="mt-2 text-sm text-neutral-600">
            We’re happy to help you compare options and find the right fit for your build.
          </p>
          <div className="mt-4">
            <Link href="/contact-us" className="text-sm font-semibold text-orange-600 underline">
              Contact us
            </Link>
          </div>
        </div>
        <div>
          <ConsultationCard />
        </div>
      </div>
    </main>
  );
}

function FavoritesPageRouteStub() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Favorites</h1>
      <p className="mt-4 text-sm text-neutral-600">This route is not configured.</p>
    </main>
  );
}

export default FavoritesPageRouteStub;
