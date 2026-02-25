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

async function getSiteUrl(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "https://houseofwatkins.com";
}

export async function generateMetadata(props: { params: { slug: string } }): Promise<Metadata> {
  const plan = await getPlanBySlug(props.params.slug);
  if (!plan) {
    notFound();
  }

  const baseUrl = await getSiteUrl();
  const canonicalUrl = `${baseUrl}/house/${plan.slug}`;

  const title = (plan.seo_title || "").trim() || defaultTitle(plan.name);
  const description = (plan.seo_description || "").trim() || defaultDescription(plan.name, plan.description);

  const ogUrl = await resolvePlanOgImageUrl(plan);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "House of Watkins",
      images: ogUrl ? [{ url: ogUrl }] : undefined,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogUrl ? [ogUrl] : undefined,
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
        <PlanViewTracker planSlug={plan.slug} planName={plan.name} />
        <ProductDetailsPageResponsive />
      </TypographyProvider>
    </PlanProvider>
  );
}
