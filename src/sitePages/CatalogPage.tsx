import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { HouseGrid } from "@/sections/HouseGrid";
import { getPublishedPlans } from "@/lib/plans";
import type { GetStaticProps } from "next";
import type { Plan } from "@/lib/plans";
import { FavoritesProvider } from "@/lib/favorites/useFavorites";
import Link from "next/link";

type CatalogPageProps = {
  plans: Plan[];
};

export function CatalogPage(props: CatalogPageProps) {
  return (
    <FavoritesProvider>
      <>
        <InteriorHeader />
        <main className="mx-auto w-full max-w-5xl px-4 py-12">
          <div className="text-xs tracking-[0.24em] text-neutral-500 md:text-[18px] md:font-semibold md:tracking-normal">
            <Link href="/" className="md:text-orange-600">
              MAIN
            </Link>
            <span className="mx-2 md:text-neutral-400">/</span>
            <Link href="/house-plans" className="md:text-neutral-700">
              HOUSE PLANS
            </Link>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">House plans</h1>
              <p className="mt-3 max-w-[640px] text-base text-neutral-600">
                Browse our collection and compare layouts, square footage, and features.
              </p>
            </div>
            <div className="text-sm text-neutral-600">Houses found: {props.plans.length}</div>
          </div>

          <div className="mt-8">
            <HouseGrid plans={props.plans} />
          </div>
        </main>
        <Footer />
      </>
    </FavoritesProvider>
  );
}

export const getStaticProps: GetStaticProps<CatalogPageProps> = async () => {
  const plans = await getPublishedPlans();
  return { props: { plans } };
};

export default CatalogPage;
