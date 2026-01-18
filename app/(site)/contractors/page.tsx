import { getPublishedPlans } from "@/lib/plans";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { ContractorsPage } from "@/sitePages/ContractorsPage";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { SectionsRenderer } from "@/components/SectionsRenderer";
import { getContractorsPage } from "@/lib/contentPages/sanity";
import { isContentPageVisibleToRequest } from "@/lib/contentPages/visibility";
import { urlForImage } from "@/lib/sanity/image";

function imageUrl(source: unknown, width: number) {
  if (!source) return undefined;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(width).fit("max").url();
  } catch {
    return undefined;
  }
}

export default async function Page() {
  const cms = await getContractorsPage();
  const visible = cms && isContentPageVisibleToRequest(cms);
  const hasSections = Boolean(visible && Array.isArray(cms?.sections) && cms!.sections.length > 0);

  const plans = await getPublishedPlans();

  let trendingPlans = plans.slice(0, 6);
  try {
    const supabase = getSupabaseAdmin() as any;
    const { data } = await supabase
      .from("favorite_counts_by_plan")
      .select("plan_slug,favorites_count")
      .order("favorites_count", { ascending: false })
      .limit(6);

    const slugs = (data ?? []).map((r: any) => String(r.plan_slug)).filter(Boolean);
    if (slugs.length > 0) {
      const bySlug = new Map(plans.map((p) => [p.slug, p]));
      trendingPlans = slugs.map((s: string) => bySlug.get(s)).filter(Boolean) as any;
      if (trendingPlans.length === 0) trendingPlans = plans.slice(0, 6);
    }
  } catch {
    // fallback to newest
  }

  return (
    <>
      <InteriorHeader />
      {cms && visible && hasSections ? (
        <main className="mx-auto w-full max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-semibold tracking-tight">{cms.title}</h1>
          <div className="mt-8">
            <SectionsRenderer sections={cms.sections ?? []} />
          </div>
        </main>
      ) : (
        <ContractorsPage
          plans={plans}
          trendingPlans={trendingPlans}
          media={
            visible
              ? {
                  provideImage03Src: imageUrl(cms?.contractorsMedia?.provideImage03, 2000),
                  provideImage03Alt: cms?.contractorsMedia?.provideImage03Alt,
                  provideImage06Src: imageUrl(cms?.contractorsMedia?.provideImage06, 2000),
                  provideImage06Alt: cms?.contractorsMedia?.provideImage06Alt,
                  provideImage09Src: imageUrl(cms?.contractorsMedia?.provideImage09, 2000),
                  provideImage09Alt: cms?.contractorsMedia?.provideImage09Alt,
                  featureIconSrc: imageUrl(cms?.contractorsMedia?.featureIcon, 256),
                  featureIconAlt: cms?.contractorsMedia?.featureIconAlt,
                  videoPosterSrc: imageUrl(cms?.contractorsMedia?.videoPosterImage, 2000),
                  videoPosterAlt: cms?.contractorsMedia?.videoPosterImageAlt,
                }
              : undefined
          }
        />
      )}
      <Footer />
    </>
  );
}
