import Link from "next/link";
import { HouseCard } from "@/sections/HouseGrid/components/HouseCard";
import type { Plan } from "@/lib/plans";

function formatSqft(n: number) {
  return n.toLocaleString();
}

function startingPriceUsd(heatedSqft: number) {
  const price = 1250 + 0.65 * heatedSqft;
  return `$ ${Math.round(price)}`;
}

type HouseGridProps = {
  plans: Plan[];
  desktopCols?: 2 | 3;
};

export const HouseGrid = (props: HouseGridProps) => {
  if (props.plans.length === 0) return null;

  return (
    <div className="flex w-full flex-wrap gap-6 text-[15.2625px] leading-[22.8937px] md:text-[14.208px] md:leading-[21.312px]">
      {props.plans.map((p) => (
        <Link key={p.slug} href={`/house/${p.slug}`} className="contents">
          <HouseCard
            imageDesktop={p.images?.hero_desktop || p.images?.hero || "/placeholders/plan-hero.svg"}
            imageMobile={p.images?.hero_mobile || p.images?.hero_desktop || p.images?.hero || "/placeholders/plan-hero.svg"}
            imageHover={p.images?.hover || p.images?.floorplan?.[0] || "/placeholders/floorplan.svg"}
            planSlug={p.slug}
            tour3dUrl={p.tour3d_url ?? null}
            title={p.name}
            squareFeet={`${formatSqft(p.heated_sqft)} Sq Ft`}
            price={startingPriceUsd(p.heated_sqft)}
            bedrooms={`${p.beds ?? "-"} Bed`}
            bathrooms={`${p.baths ?? "-"} Bath`}
            garages={`${p.garage_bays ?? "-"} Garage`}
            stories={`${p.stories ?? "-"} Story`}
          />
        </Link>
      ))}
    </div>
  );
};
