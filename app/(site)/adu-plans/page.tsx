import { HousePlansPageResponsive } from "@/sitePages/HousePlansPageResponsive.client";
import { getHousePlansPage } from "@/lib/contentPages/sanity";
import { urlForImage } from "@/lib/sanity/image";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";

async function getSiteUrl(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "https://houseofwatkins.com";
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  const canonicalUrl = `${baseUrl}/adu-plans`;

  const title = "ADU Floor Plans | Accessory Dwelling Unit Plans | House of Watkins";
  const description =
    "Browse curated ADU plans and accessory dwelling unit floor plans designed by David Watkins — 1 and 2 bedroom detached ADU plans under 800 sq ft, backyard cottages, granny flats, in-law suites, and casitas. Designed in Bend, Oregon for owner-builders and families.";

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
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function getImageUrl(source: unknown): string | null {
  if (!source) return null;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(128).height(128).fit("max").url();
  } catch {
    return null;
  }
}

export default async function Page() {
  const cms = await getHousePlansPage();
  const media = (cms as any)?.housePlansMedia;
  const searchIconSrc = getImageUrl(media?.searchIcon);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://houseofwatkins.com" },
      { "@type": "ListItem", "position": 2, "name": "ADU Plans", "item": "https://houseofwatkins.com/adu-plans" }
    ]
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <HousePlansPageResponsive
        headerTitle="ADU Plans"
        headerDescription="Accessory dwelling unit plans designed for real life — backyard cottages, granny flats, in-law suites, and casitas."
        searchIconSrc={searchIconSrc}
        searchIconAlt={media?.searchIconAlt ?? null}
        defaultFilters={{ styles: ["Accessory"] }}
      />
      <section className="mx-auto max-w-4xl px-6 py-12 text-neutral-700">
        <h2 className="text-2xl font-semibold text-neutral-900">ADU Plans Designed for How Families Actually Live</h2>
        <p className="mt-4 leading-relaxed">
          Every ADU plan in our collection began with a real conversation about a real family. Some needed a quiet place for aging parents to live close by without losing their independence. Others wanted a detached guest house for visiting family or a backyard cottage that could generate rental income. A few simply wanted a well-designed small home on their own lot — something compact, beautiful, and buildable.
        </p>
        <p className="mt-4 leading-relaxed">
          I design each accessory dwelling unit plan with the same care and attention I bring to a full-size home. That means thoughtful layouts that make 600 or 800 square feet feel generous — not cramped. It means wide doorways, open sight lines, natural light, and a genuine connection between indoor and outdoor space. These are not afterthoughts or shrunk-down versions of bigger plans. They are intentional small homes.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-neutral-900">What Makes Our ADU Floor Plans Different</h2>
        <p className="mt-4 leading-relaxed">
          Most ADU plans you will find online are generic catalog entries — designed once, sold thousands of times, with no thought given to climate, site, or the people who will actually live there. Our plans are different because they come from a Pacific Northwest design practice rooted in over 30 years of residential experience. They reflect the way light moves through a space in Oregon, how a covered entry works in a rainy climate, and why single-level living matters for aging in place.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed">
          <li><strong>1 and 2 bedroom ADU plans</strong> — compact layouts from under 500 sq ft to just over 1,000 sq ft</li>
          <li><strong>Detached ADU floor plans</strong> — designed as stand-alone structures for backyard or side-lot placement</li>
          <li><strong>Aging-in-place features</strong> — single-level living, no-step entries, wider hallways and doorways</li>
          <li><strong>Contemporary and midcentury modern ADU plans</strong> — distinctive design, not builder-basic</li>
          <li><strong>Oregon ADU compliance</strong> — plans designed with Pacific Northwest building codes in mind</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold text-neutral-900">Who Our ADU Plans Are For</h2>
        <p className="mt-4 leading-relaxed">
          If you are building a backyard cottage for your parents, a guest house for family visits, or a rental unit to help with your mortgage, these plans were drawn with you in mind. Our clients are typically owner-builders, homeowners adding a multigenerational living space, or small contractors looking for permit-ready plans with real design quality. If you value craftsmanship over volume and want a plan that feels considered rather than mass-produced, you are in the right place.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-neutral-900">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="font-semibold text-neutral-900">What comes with an ADU plan?</h3>
            <p className="mt-1 leading-relaxed">
              Every plan includes detailed construction drawings — floor plans, exterior elevations, roof plans, building sections, and foundation details. You receive a complete, permit-ready set that your builder or building department can work from immediately.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">Can I modify an ADU plan?</h3>
            <p className="mt-1 leading-relaxed">
              Yes. I offer direct collaboration on modifications — adjusting layouts, adding features, or adapting a plan to your specific lot and local codes. You work directly with me, not a ticket queue.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">How much does it cost to build an ADU?</h3>
            <p className="mt-1 leading-relaxed">
              Construction costs vary widely by region, but a typical detached ADU in the Pacific Northwest ranges from $150,000 to $350,000 depending on size, finishes, and site conditions. The plan itself is a small fraction of that investment — and the right plan can save you tens of thousands by avoiding costly changes during construction.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
