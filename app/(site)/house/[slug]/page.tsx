import { ProductDetailsPageResponsive } from "@/sitePages/ProductDetailsPageResponsive.client";
import { PlanProvider } from "@/lib/planContext";
import { getPlanBySlug } from "@/lib/plans";
import { resolvePlanOgImageUrl } from "@/lib/plans";
import { TypographyProvider } from "@/lib/typographyContext";
import { getTypographyTemplateContent } from "@/lib/typographyServer";
import { notFound } from "next/navigation";
import { PlanViewTracker } from "@/components/analytics/PlanViewTracker";
import type { Metadata } from "next";

function defaultTitle(planName: string) {
  const name = String(planName || "").trim() || "House Plan";
  return `${name} House Plan | House of Watkins`;
}

function defaultDescription(planName: string, description: string | null | undefined) {
  const base = String(description || "").trim();
  if (base) {
    return base.length > 160 ? `${base.slice(0, 157).trim()}...` : base;
  }
  const name = String(planName || "").trim() || "this plan";
  return `Explore ${name}, including square footage, key features, and downloadable plan options.`;
}

export async function generateMetadata(props: { params: { slug: string } }): Promise<Metadata> {
  const plan = await getPlanBySlug(props.params.slug);
  if (!plan) {
    notFound();
  }

  const title = (plan.seo_title || "").trim() || defaultTitle(plan.name);
  const description = (plan.seo_description || "").trim() || defaultDescription(plan.name, plan.description);

  const ogUrl = await resolvePlanOgImageUrl(plan);

  return {
    title,
    description,
    openGraph: ogUrl
      ? {
          title,
          description,
          images: [{ url: ogUrl }],
        }
      : {
          title,
          description,
        },
  };
}

export default async function Page(props: { params: { slug: string } }) {
  const plan = await getPlanBySlug(props.params.slug);
  if (!plan) {
    notFound();
  }

  const typographyContent = (await getTypographyTemplateContent("house_details")) ?? {};

  return (
    <PlanProvider plan={plan}>
      <TypographyProvider templateKey="house_details" content={typographyContent as any}>
        <PlanViewTracker planSlug={plan.slug} />
        <ProductDetailsPageResponsive />
      </TypographyProvider>
    </PlanProvider>
  );
}
