import { getPublishedPlans } from "@/lib/plans";
import { FavoritesPage } from "@/sitePages/FavoritesPage";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

export default async function Page() {
  const plans = await getPublishedPlans();

  return (
    <>
      <InteriorHeader />
      <FavoritesPage plans={plans} />
      <Footer />
    </>
  );
}
