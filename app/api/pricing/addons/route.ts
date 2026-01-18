import { NextResponse } from "next/server";
import { loadPricingSettingsServer } from "@/lib/pricingSettingsServer";

export async function GET() {
  const pricing = await loadPricingSettingsServer();

  return NextResponse.json({
    addOnsCents: {
      readableReverse: pricing.mirrored_addon_cents,
      sitePlan: pricing.site_plan_addon_cents,
      smallAdjustments: pricing.small_adjustments_addon_cents,
      minorChanges: pricing.minor_changes_addon_cents,
      additions: pricing.additions_addon_cents,
    },
  });
}
