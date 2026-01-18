import { LegalPage } from "@/sitePages/LegalPage";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { PageRenderer } from "@/components/PageRenderer";
import { getSitePageByType } from "@/lib/sitePages/sanity";
import { isSitePageVisibleToRequest } from "@/lib/sitePages/visibility";

export default async function Page() {
  const cms = await getSitePageByType("terms");

  return (
    <>
      <InteriorHeader />
      {cms && isSitePageVisibleToRequest(cms) ? (
        <main className="mx-auto w-full max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-semibold tracking-tight">{cms.title}</h1>
          <div className="mt-8">
            <PageRenderer content={cms.content ?? []} />
          </div>
        </main>
      ) : (
        <LegalPage
          breadcrumbLabel="Terms"
          breadcrumbHref="/terms"
          title="Terms & Conditions"
          sections={[
            {
              bullets: [
                {
                  title: "Parties and definitions",
                  body: "\u201cClient\u201d or \u201cPurchaser\u201d is the person or entity buying services or goods; \u201cDesigner,\u201d \u201cHouse of Watkins,\u201d and \u201cLLC\u201d all refer to House of Watkins, LLC and its team.",
                },
                {
                  title: "Plan license and use",
                  body: "Clients receive a non-transferable license to use the house plans for constructing a single house; modified plans remain derivative works with the same copyright protection, and the license ends at completion/occupancy.",
                },
                {
                  title: "Construction responsibilities",
                  body: "The builder is responsible for code compliance, permits, inspections, utilities, and following manufacturer specifications, with written notes and large-scale details taking precedence over drawings in conflicts.",
                },
                {
                  title: "Engineering disclaimer",
                  body: "The Designer does not provide or imply engineering; the Client must separately hire licensed engineers for all required engineering services.",
                },
                {
                  title: "Return/exchange policy",
                  body: "All house plan, modification, and custom design sales are non-refundable, but the first house plan order may be exchanged within 30 days with a 15% fee plus any price differences.",
                },
                {
                  title: "Liability and indemnity",
                  body: "The Designer limits liability for use of plans and is not responsible for contracts between the Client and contractors, vendors, or other professionals, and the Client agrees to indemnify and hold the Designer harmless for subsequent use of the instruments of service.",
                },
                {
                  title: "Termination and waiver",
                  body: "On termination, the Client releases the Designer from further obligations and cannot allow others to claim design credit; failure to enforce a right is not a waiver, and the written Agreement is the complete understanding that can only be modified in writing signed by both parties.",
                },
              ],
            },
          ]}
        />
      )}
      <Footer />
    </>
  );
}
