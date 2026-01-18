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
  const desktopCols = props.desktopCols ?? 2;

  return (
    <div
      className={`relative text-[15.2625px] box-border caret-transparent gap-x-[22.875px] grid grid-cols-[repeat(1,1fr)] leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[22.875px] w-full overflow-hidden md:text-[14.208px] md:gap-x-[17.792px] md:grid-cols-[repeat(2,1fr)] md:leading-[21.312px] md:gap-y-[17.792px] md:overflow-visible ${
        desktopCols === 3 ? "lg:grid-cols-[repeat(3,1fr)]" : "lg:grid-cols-[repeat(2,1fr)]"
      }`}
    >
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
