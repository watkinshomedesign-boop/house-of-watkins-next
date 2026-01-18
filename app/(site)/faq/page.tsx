import { InteriorHeader } from "@/sections/InteriorHeader";
import { FAQPage } from "@/sitePages/FAQPage";
import { Footer } from "@/sections/Footer";
import { SectionsRenderer } from "@/components/SectionsRenderer";
import { getFaqPage } from "@/lib/contentPages/sanity";
import { isContentPageVisibleToRequest } from "@/lib/contentPages/visibility";

export default async function Page() {
  const cms = await getFaqPage();

  return (
    <>
      <InteriorHeader />
      {cms && isContentPageVisibleToRequest(cms) ? (
        <main className="mx-auto w-full max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-semibold tracking-tight">{cms.title}</h1>
          <div className="mt-8">
            <SectionsRenderer sections={cms.sections ?? []} />
          </div>
        </main>
      ) : (
        <FAQPage />
      )}
      <Footer />
    </>
  );
}
