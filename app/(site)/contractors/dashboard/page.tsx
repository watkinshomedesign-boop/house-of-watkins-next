import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { BuilderDashboardPage } from "@/sitePages/BuilderDashboardPage";

export default function Page() {
  return (
    <>
      <InteriorHeader />
      <BuilderDashboardPage />
      <Footer />
    </>
  );
}
