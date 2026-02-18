import { NextResponse } from "next/server";

import { COMMERCE } from "@/config/commerce";
import { quoteCartWithPricing } from "@/lib/pricing";
import { loadPricingSettingsServer } from "@/lib/pricingSettingsServer";
import { getPublishedPlans, type Plan } from "@/lib/plans";

export const revalidate = 60 * 60;

function escapeXml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function getSiteUrl(req: Request): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url) return url.startsWith("http") ? url : `https://${url}`;
  try {
    const u = new URL(req.url);
    return u.origin;
  } catch {
    return "https://houseofwatkins.com";
  }
}

function toAbsoluteUrl(baseUrl: string, maybeUrl: string | null | undefined) {
  const s = String(maybeUrl ?? "").trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("//")) return `https:${s}`;
  if (s.startsWith("/")) return `${baseUrl}${s}`;
  return `${baseUrl}/${s}`;
}

function pickMainImageUrl(plan: Plan) {
  const fromThumb = plan.frontThumbnailUrl || plan.buildFeatureExteriorUrl || null;
  const fromGallery = plan.galleryImages?.[0] || plan.images?.hero_desktop || plan.images?.hero_mobile || plan.images?.hero || plan.images?.gallery?.[0] || null;
  return fromThumb || fromGallery || null;
}

function formatPrice(cents: number, currency: string) {
  const amt = (cents / 100).toFixed(2);
  return `${amt} ${currency.toUpperCase()}`;
}

function computeBaseSingleLicensePriceCents(plan: { id?: string; name: string; heated_sqft: number }, pricing: any) {
  const quote = quoteCartWithPricing(
    [
      {
        planId: String(plan.id ?? plan.name),
        name: plan.name,
        heatedSqFt: Number(plan.heated_sqft ?? 0),
        license: "single" as const,
        qty: 1,
        addOns: {},
        rush: false,
        paperSets: 0,
      },
    ],
    pricing
  );
  return quote.totalCents;
}

export async function GET(req: Request) {
  const baseUrl = await getSiteUrl(req);
  const now = new Date().toUTCString();

  const [plans, pricingSettings] = await Promise.all([getPublishedPlans(), loadPricingSettingsServer()]);

  const pricing = {
    baseCents: pricingSettings.base_price_cents,
    heatedSqFtRateCents: pricingSettings.per_heated_sqft_cents,
    rushRate: Math.max(0, Number(pricingSettings.rush_percent ?? 0)) / 100,
    shippingFlatRateCents: pricingSettings.paper_plan_shipping_cents,
    paperHandlingCents: COMMERCE.paperHandlingCents,
    paperExtraSetCents: pricingSettings.paper_set_price_cents,
    licenseMultipliers: COMMERCE.pricing.licenseMultipliers as any,
    addOnsCents: {
      readableReverse: pricingSettings.mirrored_addon_cents,
      cad: pricingSettings.cad_addon_cents,
      sitePlan: pricingSettings.site_plan_addon_cents,
      smallAdjustments: pricingSettings.small_adjustments_addon_cents,
      minorChanges: pricingSettings.minor_changes_addon_cents,
      additions: pricingSettings.additions_addon_cents,
    },
  };

  const channelTitle = "House of Watkins";
  const channelLink = `${baseUrl}/house-plans`;
  const channelDescription = "House plans by House of Watkins";

  const itemsXml = (plans ?? []).map((p) => {
    const id = String(p.id ?? p.slug);
    const title = String(p.name ?? p.slug);
    const description = String(p.seo_description ?? p.description ?? "");
    const link = `${baseUrl}/house/${encodeURIComponent(String(p.slug))}`;

    const imgRaw = pickMainImageUrl(p);
    const imageLink = toAbsoluteUrl(baseUrl, imgRaw);

    const priceCents = computeBaseSingleLicensePriceCents(
      { id: p.id, name: title, heated_sqft: Number((p as any).heated_sqft ?? 0) },
      pricing
    );

    const productType = Array.isArray(p.tags) && p.tags.length > 0 ? p.tags.join(" > ") : "House Plans";

    return `\n    <item>\n      <g:id>${escapeXml(id)}</g:id>\n      <title>${escapeXml(title)}</title>\n      <description><![CDATA[${description}]]></description>\n      <link>${escapeXml(link)}</link>\n      ${imageLink ? `<g:image_link>${escapeXml(imageLink)}</g:image_link>` : ""}\n      <g:price>${escapeXml(formatPrice(priceCents, COMMERCE.currency))}</g:price>\n      <g:availability>in_stock</g:availability>\n      <g:brand>House of Watkins</g:brand>\n      <g:condition>new</g:condition>\n      <g:product_type>${escapeXml(productType)}</g:product_type>\n      <g:google_product_category>632</g:google_product_category>\n    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n  <channel>\n    <title>${escapeXml(channelTitle)}</title>\n    <link>${escapeXml(channelLink)}</link>\n    <description>${escapeXml(channelDescription)}</description>\n    <lastBuildDate>${escapeXml(now)}</lastBuildDate>\n    ${itemsXml.join("\n")}\n  </channel>\n</rss>\n`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
