import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { syncPlansToShopify } from "@/lib/shopifySync";

// ~80 products × 600ms delay = ~50s; allow up to 120s
export const maxDuration = 120;

export async function POST() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const result = await syncPlansToShopify();
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("[shopify-sync] Failed:", e);
    return NextResponse.json(
      { error: e?.message || "Shopify sync failed" },
      { status: 500 }
    );
  }
}
