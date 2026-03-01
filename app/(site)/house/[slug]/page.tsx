import { ProductDetailsPageResponsive } from "@/sitePages/ProductDetailsPageResponsive.client";
import { PlanProvider } from "@/lib/planContext";
import { getPlanBySlug, resolvePlanOgImageUrl } from "@/lib/plans";
import type { Plan } from "@/lib/plans";
import { TypographyProvider } from "@/lib/typographyContext";
import { getTypographyTemplateContent } from "@/lib/typographyServer";
import { notFound } from "next/navigation";
import { PlanViewTracker } from "@/components/analytics/PlanViewTracker";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";

function defaultTitle(plan: { name: string; beds?: number | null; heated_sqft: number }) {
  const name = String(plan.name || "").trim() || "House Plan";
  const beds = plan.beds ? `${plan.beds} Bedroom` : "";
  const sqft = plan.heated_sqft ? ` ${plan.heated_sqft.toLocaleString()} Sq Ft` : "";
  const specs = [beds, sqft].filter(Boolean).join(" \u2013 ");
  return specs ? `${name} \u2013 ${specs} | House of Watkins` : `${name} House Plan | House of Watkins`;
}

function defaultDescription(plan: { name: string; description?: string | null; beds?: number | null; baths?: number | null; heated_sqft: number; garage_bays?: number | null }) {
  const base = String(plan.description || "").trim();
  if (base) {
    return base.length > 160 ? `${base.slice(0, 157).trim()}...` : base;
  }
  const name = String(plan.name || "").trim() || "this plan";
  const parts: string[] = [];
  if (plan.heated_sqft) parts.push(`${plan.heated_sqft.toLocaleString()} sq ft`);
  if (plan.beds) parts.push(`${plan.beds} bed`);
  if (plan.baths) parts.push(`${plan.baths} bath`);
  if (plan.garage_bays) parts.push(`${plan.garage_bays}-car garage`);
  const specs = parts.length ? ` \u2014 ${parts.join(", ")}` : "";
  const price = plan.heated_sqft ? `. Plans from $${Math.round(1250 + 0.65 * plan.heated_sqft).toLocaleString()}.` : ".";
  return `Browse the ${name} floor plan${specs}. Designed by David Watkins in Bend, Oregon${price}`;
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

  const title = (plan.seo_title || "").trim() || defaultTitle(plan);
  const description = (plan.seo_description || "").trim() || defaultDescription(plan);

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

function buildProductSchema(plan: Plan, imageUrl: string | null) {
  const priceValidUntil = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `https://houseofwatkins.com/house/${plan.slug}#product`,
    "name": plan.name,
    "description": plan.description || `${plan.beds || ""}-Bedroom ${plan.heated_sqft} sq ft house plan. Designed by David Watkins.`,
    "brand": { "@type": "Brand", "name": "House of Watkins" },
    "manufacturer": { "@id": "https://houseofwatkins.com/#organization" },
    ...(imageUrl ? { "image": imageUrl } : {}),
    "url": `https://houseofwatkins.com/house/${plan.slug}`,
    "category": "House Plans",
    "offers": {
      "@type": "Offer",
      "url": `https://houseofwatkins.com/house/${plan.slug}`,
      "price": "1738",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": { "@id": "https://houseofwatkins.com/#organization" },
      "priceValidUntil": priceValidUntil
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Bedrooms", "value": String(plan.beds ?? "") },
      { "@type": "PropertyValue", "name": "Bathrooms", "value": String(plan.baths ?? "") },
      { "@type": "PropertyValue", "name": "Total Square Footage", "value": String(plan.heated_sqft || "") },
      { "@type": "PropertyValue", "name": "Stories", "value": String(plan.stories ?? "") },
      { "@type": "PropertyValue", "name": "Width", "value": plan.width_ft ? `${plan.width_ft} ft` : "" },
      { "@type": "PropertyValue", "name": "Depth", "value": plan.depth_ft ? `${plan.depth_ft} ft` : "" },
      { "@type": "PropertyValue", "name": "Garage Bays", "value": String(plan.garage_bays ?? "0") },
    ].filter((p) => p.value !== "" && p.value !== "undefined")
  };
}

function buildFaqSchema(plan: Plan) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is included in the ${plan.name} plan set?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every House of Watkins plan set includes complete architectural drawings: floor plans, exterior elevations, roof plan, electrical layout, cross-sections, foundation plan, and a detailed material list. Plans are permit-ready for most jurisdictions."
        }
      },
      {
        "@type": "Question",
        "name": `Can the ${plan.name} be customized?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You collaborate directly with designer David Watkins to customize any plan. Modifications are completed in 10 business days or less \u2014 guaranteed. Common customizations include adjusting room sizes, adding or removing bedrooms, changing exterior materials, and adapting the plan to your specific lot."
        }
      },
      {
        "@type": "Question",
        "name": `How much does the ${plan.name} cost?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Plans from House of Watkins start at $1,738. The ${plan.name} is a ${plan.heated_sqft || ""} sq ft, ${plan.beds || ""}-bedroom, ${plan.baths || ""}-bathroom design. Contact us for exact pricing including any customizations.`
        }
      },
      {
        "@type": "Question",
        "name": "Who designed this house plan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All House of Watkins plans are personally designed by David Elijah Watkins, an award-winning residential designer with over 30 years of experience and 400+ homes to his name. David studied at the Art Institute of Denver and is based in Bend, Oregon."
        }
      },
      {
        "@type": "Question",
        "name": "Are these plans suitable for building in Oregon?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. House of Watkins is based in Bend, Oregon, and our plans are designed with Pacific Northwest building requirements in mind. Plans can be adapted for specific local building codes and HOA requirements. ADU plans are designed to comply with Oregon's statewide ADU regulations."
        }
      }
    ]
  };
}

function buildBreadcrumbSchema(plan: Plan) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://houseofwatkins.com" },
      { "@type": "ListItem", "position": 2, "name": "House Plans", "item": "https://houseofwatkins.com/house-plans" },
      { "@type": "ListItem", "position": 3, "name": plan.name, "item": `https://houseofwatkins.com/house/${plan.slug}` }
    ]
  };
}

export default async function Page(props: { params: { slug: string } }) {
  const plan = await getPlanBySlug(props.params.slug);
  if (!plan) {
    notFound();
  }

  const typographyContent = (await getTypographyTemplateContent("house_details")) ?? {};
  const ogUrl = await resolvePlanOgImageUrl(plan);

  return (
    <PlanProvider plan={plan}>
      <TypographyProvider templateKey="house_details" content={typographyContent as any}>
        <JsonLd data={buildProductSchema(plan, ogUrl)} />
        <JsonLd data={buildFaqSchema(plan)} />
        <JsonLd data={buildBreadcrumbSchema(plan)} />
        <PlanViewTracker planSlug={plan.slug} planName={plan.name} />
        <ProductDetailsPageResponsive />
      </TypographyProvider>
    </PlanProvider>
  );
}
