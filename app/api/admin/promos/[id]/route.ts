import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizePromoCode } from "@/lib/promoCodesServer";

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const body = (await req.json().catch(() => ({}))) as any;

  const patch: any = {
    status: body.status === undefined ? undefined : String(body.status),
    discount_type: body.discount_type === undefined ? undefined : String(body.discount_type),
    discount_value: body.discount_value === undefined ? undefined : Math.floor(Number(body.discount_value)),
    applies_to: body.applies_to === undefined ? undefined : String(body.applies_to),
    starts_at: body.starts_at === undefined ? undefined : body.starts_at,
    ends_at: body.ends_at === undefined ? undefined : body.ends_at,
    max_redemptions: body.max_redemptions === undefined ? undefined : body.max_redemptions == null ? null : Number(body.max_redemptions),
    min_subtotal_cents:
      body.min_subtotal_cents === undefined ? undefined : body.min_subtotal_cents == null ? null : Number(body.min_subtotal_cents),
    metadata: body.metadata === undefined ? undefined : body.metadata,
  };

  if (body.code !== undefined) {
    patch.code = normalizePromoCode(body.code);
  }

  const supabase = getSupabaseAdmin() as any;
  const { error }: any = await supabase.from("promo_codes").update(patch).eq("id", ctx.params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
