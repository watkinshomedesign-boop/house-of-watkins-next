import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizePromoCode } from "@/lib/promoCodesServer";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase
    .from("promo_codes")
    .select(
      "id, code, status, discount_type, discount_value, applies_to, starts_at, ends_at, max_redemptions, redemptions_count, min_subtotal_cents, metadata, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const body = (await req.json().catch(() => ({}))) as any;

  const code = normalizePromoCode(body.code);
  const discountType = String(body.discount_type || "");
  const discountValue = Number(body.discount_value);

  if (!code) return NextResponse.json({ error: "code is required" }, { status: 400 });
  if (discountType !== "percent" && discountType !== "amount") {
    return NextResponse.json({ error: "discount_type must be percent or amount" }, { status: 400 });
  }
  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    return NextResponse.json({ error: "discount_value must be > 0" }, { status: 400 });
  }

  const row: any = {
    code,
    status: String(body.status || "active"),
    discount_type: discountType,
    discount_value: Math.floor(discountValue),
    applies_to: String(body.applies_to || "order"),
    starts_at: body.starts_at ?? null,
    ends_at: body.ends_at ?? null,
    max_redemptions: body.max_redemptions == null ? null : Number(body.max_redemptions),
    redemptions_count: 0,
    min_subtotal_cents: body.min_subtotal_cents == null ? null : Number(body.min_subtotal_cents),
    metadata: body.metadata ?? {},
  };

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase.from("promo_codes").insert(row).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: data?.id ?? null });
}
