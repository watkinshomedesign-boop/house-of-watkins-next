/**
 * One-way sync: Supabase plans → Shopify products.
 *
 * Each plan becomes a Shopify product with two variants:
 *   - "Single Build License" (1× base price)
 *   - "Builder License"      (3× base price)
 *
 * The plan slug is stored as the product handle and variant SKU prefix
 * so we can match existing Shopify products on subsequent syncs.
 */

import { getPublishedPlans, type Plan } from "@/lib/plans";
import { loadPricingSettingsServer } from "@/lib/pricingSettingsServer";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  type ShopifyProduct,
} from "@/lib/shopify";

type SyncResult = {
  created: string[];
  updated: string[];
  skipped: string[];
  errors: Array<{ slug: string; error: string }>;
};

/** Compute the base price in dollars for a plan (single-build license). */
function computeBasePrice(
  heatedSqFt: number,
  baseCents: number,
  perSqFtCents: number
): number {
  const cents = baseCents + perSqFtCents * heatedSqFt;
  return cents / 100;
}

/** Build a product description from plan fields. */
function buildDescription(plan: Plan): string {
  const parts: string[] = [];
  if (plan.description) parts.push(plan.description);

  const specs: string[] = [];
  if (plan.heated_sqft) specs.push(`${plan.heated_sqft.toLocaleString()} Heated Sq Ft`);
  if (plan.beds) specs.push(`${plan.beds} Bed${plan.beds > 1 ? "s" : ""}`);
  if (plan.baths) specs.push(`${plan.baths} Bath${plan.baths > 1 ? "s" : ""}`);
  if (plan.stories) specs.push(`${plan.stories} Stor${plan.stories > 1 ? "ies" : "y"}`);
  if (plan.garage_bays) specs.push(`${plan.garage_bays}-Car Garage`);
  if (plan.width_ft && plan.depth_ft) specs.push(`${plan.width_ft}' W × ${plan.depth_ft}' D`);

  if (specs.length > 0) {
    parts.push(`<p><strong>Plan Specs:</strong> ${specs.join(" | ")}</p>`);
  }

  return parts.join("\n") || plan.name;
}

/** Collect image URLs for a plan (front thumbnail first, then gallery). */
function collectImages(plan: Plan): Array<{ src: string }> {
  const urls: string[] = [];
  const seen = new Set<string>();

  const add = (url: string | null | undefined) => {
    if (!url) return;
    const s = url.trim();
    if (!s || seen.has(s)) return;
    seen.add(s);
    urls.push(s);
  };

  // Thumbnail first (card image)
  add(plan.frontThumbnailUrl);
  add(plan.images?.hero_desktop);
  add(plan.images?.hero_mobile);
  add(plan.images?.hero);

  // Gallery images (limit to 10 to stay within Shopify's limits)
  if (plan.galleryImages) {
    for (const u of plan.galleryImages.slice(0, 10)) add(u);
  }

  // Floorplan images
  if (plan.floorplanImages) {
    for (const u of plan.floorplanImages.slice(0, 5)) add(u);
  }

  return urls.map((src) => ({ src }));
}

/** Build the Shopify product payload for a plan. */
function buildProductPayload(
  plan: Plan,
  baseCents: number,
  perSqFtCents: number,
  builderMultiplier: number
) {
  const singlePrice = computeBasePrice(plan.heated_sqft, baseCents, perSqFtCents);
  const builderPrice = singlePrice * builderMultiplier;

  const tags = [
    ...(plan.tags ?? []),
    plan.beds ? `${plan.beds}-bed` : null,
    plan.baths ? `${plan.baths}-bath` : null,
    plan.stories ? `${plan.stories}-story` : null,
    plan.heated_sqft ? `${plan.heated_sqft}sqft` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title: plan.name,
    handle: plan.slug,
    body_html: buildDescription(plan),
    vendor: "House of Watkins",
    product_type: "House Plan",
    tags,
    options: [{ name: "License", values: ["Single Build License", "Builder License"] }],
    variants: [
      {
        option1: "Single Build License",
        price: singlePrice.toFixed(2),
        sku: `${plan.slug}-single`,
        requires_shipping: false,
        inventory_management: null,
        taxable: true,
      },
      {
        option1: "Builder License",
        price: builderPrice.toFixed(2),
        sku: `${plan.slug}-builder`,
        requires_shipping: false,
        inventory_management: null,
        taxable: true,
      },
    ],
    images: collectImages(plan),
  };
}

export async function syncPlansToShopify(): Promise<SyncResult> {
  const result: SyncResult = { created: [], updated: [], skipped: [], errors: [] };

  // 1. Load plans + pricing
  const [plans, pricing] = await Promise.all([
    getPublishedPlans(),
    loadPricingSettingsServer(),
  ]);

  const baseCents = pricing.base_price_cents;
  const perSqFtCents = pricing.per_heated_sqft_cents;
  const builderMultiplier = 3; // from COMMERCE.pricing.licenseMultipliers.builder

  // 2. Load existing Shopify products to match by handle (slug)
  const existingProducts = await getAllProducts();
  const shopifyByHandle = new Map<string, ShopifyProduct>();
  for (const p of existingProducts) {
    if (p.handle) shopifyByHandle.set(p.handle, p);
  }

  // 3. Sync each plan (with rate-limit delay: ~1 request per 600ms)
  for (const plan of plans) {
    if (!plan.slug) {
      result.skipped.push("(no slug)");
      continue;
    }

    try {
      const payload = buildProductPayload(plan, baseCents, perSqFtCents, builderMultiplier);
      const existing = shopifyByHandle.get(plan.slug);

      if (existing) {
        // Update existing product — keep existing images if no new ones
        const updatePayload: Record<string, any> = { ...payload };
        if (payload.images.length === 0) {
          delete updatePayload.images;
        }
        // Map variant IDs for update
        if (existing.variants && existing.variants.length >= 2) {
          updatePayload.variants = payload.variants.map((v, i) => ({
            ...v,
            id: existing.variants[i]?.id,
          }));
        }
        await updateProduct(existing.id, updatePayload);
        result.updated.push(plan.slug);
      } else {
        // Create new product
        await createProduct(payload);
        result.created.push(plan.slug);
      }
    } catch (e: any) {
      result.errors.push({ slug: plan.slug, error: e?.message || String(e) });
    }

    // Rate limit: Shopify Basic allows 2 req/s; wait 600ms between calls
    await new Promise((r) => setTimeout(r, 600));
  }

  return result;
}
