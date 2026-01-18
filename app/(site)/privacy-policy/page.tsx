import { LegalPage } from "@/sitePages/LegalPage";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

export default function Page() {
  return (
    <>
      <InteriorHeader />
      <LegalPage
        breadcrumbLabel="Privacy"
        breadcrumbHref="/privacy-policy"
        title="Privacy Policy"
        sections={[
          {
            paragraphs: [
              "This Privacy Policy describes how House of Watkins, LLC collects, uses, and shares information when you interact with our website and services.",
              "If you have questions about this policy or want to request changes to your information, please contact us.",
            ],
          },
          {
            heading: "Information we collect",
            bullets: [
              {
                title: "Contact information",
                body: "Information you submit through forms (such as your name, email address, and project details).",
              },
              {
                title: "Usage information",
                body: "Basic analytics about how the site is used to improve performance and usability.",
              },
            ],
          },
          {
            heading: "How we use information",
            bullets: [
              { title: "Provide services", body: "Respond to inquiries, deliver plan files, and support your project." },
              { title: "Improve", body: "Understand site usage and improve our offerings and customer experience." },
            ],
          },
        ]}
      />
      <Footer />
    </>
  );
}
