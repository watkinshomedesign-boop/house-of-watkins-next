import { LegalPage } from "@/sitePages/LegalPage";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { PageRenderer } from "@/components/PageRenderer";
import { getSitePageByType } from "@/lib/sitePages/sanity";
import { isSitePageVisibleToRequest } from "@/lib/sitePages/visibility";

export default async function Page() {
  const cms = await getSitePageByType("privacy");

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
          breadcrumbLabel="Privacy"
          breadcrumbHref="/privacy"
          title="Privacy Policy"
          sections={[
            {
              bullets: [
                {
                  title: "Scope and role",
                  body: "It describes how House of Watkins, LLC (\u201cwe,\u201d \u201cus,\u201d \u201cour\u201d or \u201cDesigner\u201d) collects, maintains, uses, and shares information when users interact with your website or services.",
                },
                {
                  title: "Information handling",
                  body: "It explains the categories of information collected, how that information is used to provide services, and under what circumstances information may be shared with third parties.",
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
