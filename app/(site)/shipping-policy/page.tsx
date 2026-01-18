import { LegalPage } from "@/sitePages/LegalPage";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

export default function Page() {
  return (
    <>
      <InteriorHeader />
      <LegalPage
        breadcrumbLabel="Shipping"
        breadcrumbHref="/shipping-policy"
        title="Shipping Policy"
        sections={[
          {
            paragraphs: [
              "Most plan sets are delivered electronically as a PDF.",
              "If you purchase paper plan sets, we charge a flat-rate shipping fee and will provide fulfillment details during checkout.",
            ],
          },
          {
            heading: "Digital delivery",
            bullets: [
              { title: "Format", body: "PDF suitable for printing at 24×36 by a local print shop." },
              { title: "Timing", body: "Digital delivery is typically available shortly after purchase." },
            ],
          },
          {
            heading: "Paper sets",
            bullets: [
              { title: "Shipping fee", body: "If paper plan sets are selected, a flat-rate shipping fee applies." },
              { title: "Address", body: "Please ensure your shipping address is accurate at checkout." },
            ],
          },
        ]}
      />
      <Footer />
    </>
  );
}
