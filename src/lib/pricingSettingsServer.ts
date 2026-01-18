import { COMMERCE } from "@/config/commerce";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type PricingSettings = {
  base_price_cents: number;
  per_heated_sqft_cents: number;
  cad_addon_cents: number;
  mirrored_addon_cents: number;
  site_plan_addon_cents: number;
  small_adjustments_addon_cents: number;
  minor_changes_addon_cents: number;
  additions_addon_cents: number;
  rush_percent: number;
  paper_plan_shipping_cents: number;
  paper_set_price_cents: number;
};

export function getPricingFallback(): PricingSettings {
  return {
    base_price_cents: COMMERCE.pricing.baseCents,
    per_heated_sqft_cents: COMMERCE.pricing.heatedSqFtRateCents,
    cad_addon_cents: COMMERCE.pricing.addOnsCents.cad,
    mirrored_addon_cents: COMMERCE.pricing.addOnsCents.readableReverse,
    site_plan_addon_cents: COMMERCE.pricing.addOnsCents.sitePlan,
    small_adjustments_addon_cents: COMMERCE.pricing.addOnsCents.smallAdjustments,
    minor_changes_addon_cents: COMMERCE.pricing.addOnsCents.minorChanges,
    additions_addon_cents: COMMERCE.pricing.addOnsCents.additions,
    rush_percent: Math.round(COMMERCE.rushRate * 100),
    paper_plan_shipping_cents: COMMERCE.shippingFlatRateCents,
    paper_set_price_cents: COMMERCE.paperExtraSetCents,
  };
}

export async function loadPricingSettingsServer(): Promise<PricingSettings> {
  const fallback = getPricingFallback();
  try {
    const supabase = getSupabaseAdmin() as any;
    const { data, error }: any = await supabase
      .from("pricing_settings")
      .select(
        "base_price_cents, per_heated_sqft_cents, cad_addon_cents, mirrored_addon_cents, site_plan_addon_cents, small_adjustments_addon_cents, minor_changes_addon_cents, additions_addon_cents, rush_percent, paper_plan_shipping_cents, paper_set_price_cents"
      )
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return fallback;

    return {
      base_price_cents: Number(data.base_price_cents ?? fallback.base_price_cents),
      per_heated_sqft_cents: Number(data.per_heated_sqft_cents ?? fallback.per_heated_sqft_cents),
      cad_addon_cents: Number(data.cad_addon_cents ?? fallback.cad_addon_cents),
      mirrored_addon_cents: Number(data.mirrored_addon_cents ?? fallback.mirrored_addon_cents),
      site_plan_addon_cents: Number(data.site_plan_addon_cents ?? fallback.site_plan_addon_cents),
      small_adjustments_addon_cents: Number(
        data.small_adjustments_addon_cents ?? fallback.small_adjustments_addon_cents
      ),
      minor_changes_addon_cents: Number(data.minor_changes_addon_cents ?? fallback.minor_changes_addon_cents),
      additions_addon_cents: Number(data.additions_addon_cents ?? fallback.additions_addon_cents),
      rush_percent: Number(data.rush_percent ?? fallback.rush_percent),
      paper_plan_shipping_cents: Number(data.paper_plan_shipping_cents ?? fallback.paper_plan_shipping_cents),
      paper_set_price_cents: Number(data.paper_set_price_cents ?? fallback.paper_set_price_cents),
    };
  } catch {
    return fallback;
  }
}
