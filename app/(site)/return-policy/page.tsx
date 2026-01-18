import { LegalPage } from "@/sitePages/LegalPage";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

export default function Page() {
  return (
    <>
      <InteriorHeader />
      <LegalPage
        breadcrumbLabel="Returns"
        breadcrumbHref="/return-policy"
        title="Return & Exchange Policy"
        sections={[
          {
            paragraphs: [
              "All house plan, modification, and custom design sales are non-refundable due to the digital nature of plan delivery.",
              "If you purchased the wrong plan, contact us and we’ll help you evaluate options.",
            ],
          },
          {
            heading: "Exchange (first plan order)",
            bullets: [
              {
                title: "Eligibility",
                body: "The first house plan order may be exchanged within 30 days.",
              },
              {
                title: "Fee",
                body: "A 15% exchange fee applies, plus any price difference between plans.",
              },
            ],
          },
        ]}
      />
      <Footer />
    </>
  );
}
