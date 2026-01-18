import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { quoteCartWithPricing, type AddOns, type LicenseType } from "@/lib/pricing";
import { loadPricingSettingsServer } from "@/lib/pricingSettingsServer";
import { COMMERCE } from "@/config/commerce";

type QuoteRequestItem = {
  slug: string;
  license: LicenseType;
  addOns?: AddOns;
  rush?: boolean;
  paperSets?: number;
  qty?: number;
};

export type PlanRecord = {
  id: string;
  slug: string;
  name: string;
  heated_sqft: number;
};

export type ServerQuoteInput = {
  items: QuoteRequestItem[];
};

export async function loadPlansBySlug(slugs: string[]): Promise<PlanRecord[]> {
  if (slugs.length === 0) return [];

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("plans")
    .select("id, slug, name, total_sqft")
    .in("slug", slugs);

  if (error) throw error;

  return ((data ?? []) as any[]).map((r) => ({
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    heated_sqft: Number(r.total_sqft ?? 0),
  })) as PlanRecord[];
}

export async function quoteFromSupabase(input: ServerQuoteInput) {
  const slugs = Array.from(new Set(input.items.map((i) => i.slug)));
  const plans = await loadPlansBySlug(slugs);
  const planBySlug = new Map(plans.map((p) => [p.slug, p]));

  for (const it of input.items) {
    const p = planBySlug.get(it.slug);
    if (!p) {
      throw new Error(`Plan not found for slug: ${it.slug}`);
    }
  }

  const cartItems = input.items.map((it) => {
    const p = planBySlug.get(it.slug)!;
    return {
      planId: p.id,
      name: p.name,
      heatedSqFt: p.heated_sqft,
      license: it.license,
      addOns: it.addOns,
      rush: it.rush,
      paperSets: it.paperSets,
      qty: it.qty,
    };
  });

  const pricing = await loadPricingSettingsServer();
  const quote = quoteCartWithPricing(cartItems, {
    baseCents: pricing.base_price_cents,
    heatedSqFtRateCents: pricing.per_heated_sqft_cents,
    rushRate: Math.max(0, Number(pricing.rush_percent ?? 0)) / 100,
    shippingFlatRateCents: pricing.paper_plan_shipping_cents,
    paperHandlingCents: COMMERCE.paperHandlingCents,
    paperExtraSetCents: pricing.paper_set_price_cents,
    licenseMultipliers: COMMERCE.pricing.licenseMultipliers as any,
    addOnsCents: {
      readableReverse: pricing.mirrored_addon_cents,
      cad: pricing.cad_addon_cents,
      sitePlan: pricing.site_plan_addon_cents,
      smallAdjustments: pricing.small_adjustments_addon_cents,
      minorChanges: pricing.minor_changes_addon_cents,
      additions: pricing.additions_addon_cents,
    },
  });
  return { quote, plans };
}

export function formatUsd(cents: number) {
  const dollars = (cents / 100).toFixed(2);
  return `$${dollars}`;
}
