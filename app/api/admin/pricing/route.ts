import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase
    .from("pricing_settings")
    .select(
      "id, base_price_cents, per_heated_sqft_cents, cad_addon_cents, mirrored_addon_cents, site_plan_addon_cents, small_adjustments_addon_cents, minor_changes_addon_cents, additions_addon_cents, rush_percent, paper_plan_shipping_cents, paper_set_price_cents, updated_at"
    )
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? null });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const body = (await req.json().catch(() => ({}))) as any;

  const row: any = {
    base_price_cents: Number(body.base_price_cents),
    per_heated_sqft_cents: Number(body.per_heated_sqft_cents),
    cad_addon_cents: Number(body.cad_addon_cents),
    mirrored_addon_cents: Number(body.mirrored_addon_cents),
    site_plan_addon_cents: Number(body.site_plan_addon_cents),
    small_adjustments_addon_cents: Number(body.small_adjustments_addon_cents),
    minor_changes_addon_cents: Number(body.minor_changes_addon_cents),
    additions_addon_cents: Number(body.additions_addon_cents),
    rush_percent: Number(body.rush_percent ?? 0),
    paper_plan_shipping_cents: Number(body.paper_plan_shipping_cents ?? 0),
    paper_set_price_cents: Number(body.paper_set_price_cents ?? 0),
    updated_at: new Date().toISOString(),
  };

  for (const k of [
    "base_price_cents",
    "per_heated_sqft_cents",
    "cad_addon_cents",
    "mirrored_addon_cents",
    "site_plan_addon_cents",
    "small_adjustments_addon_cents",
    "minor_changes_addon_cents",
    "additions_addon_cents",
    "rush_percent",
    "paper_plan_shipping_cents",
    "paper_set_price_cents",
  ]) {
    const v = row[k];
    if (!Number.isFinite(v) || v < 0) {
      return NextResponse.json({ error: `${k} must be a non-negative number` }, { status: 400 });
    }
  }

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase.from("pricing_settings").insert(row).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: data?.id ?? null });
}
