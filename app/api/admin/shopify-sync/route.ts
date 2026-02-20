import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { syncPlansToShopify } from "@/lib/shopifySync";

// Each batch of 10 products takes ~15s; 60s is safe
export const maxDuration = 60;

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json().catch(() => ({}));
    const offset = Math.max(0, Number(body.offset) || 0);
    const result = await syncPlansToShopify(offset);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("[shopify-sync] Failed:", e);
    return NextResponse.json(
      { error: e?.message || "Shopify sync failed" },
      { status: 500 }
    );
  }
}
