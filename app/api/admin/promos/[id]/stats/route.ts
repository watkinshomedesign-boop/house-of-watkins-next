import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function isActiveNow(row: any, now: Date) {
  if (String(row?.status ?? "") !== "active") return false;
  const startsAt = row?.starts_at ? new Date(String(row.starts_at)) : null;
  const endsAt = row?.ends_at ? new Date(String(row.ends_at)) : null;
  if (startsAt && now < startsAt) return false;
  if (endsAt && now > endsAt) return false;
  const max = row?.max_redemptions == null ? null : Number(row.max_redemptions);
  const used = Number(row?.redemptions_count ?? 0);
  if (typeof max === "number" && max >= 0 && used >= max) return false;
  return true;
}

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdmin() as any;

  const { data: promo, error: promoErr }: any = await supabase
    .from("promo_codes")
    .select(
      "id, code, status, discount_type, discount_value, applies_to, starts_at, ends_at, max_redemptions, redemptions_count, min_subtotal_cents, metadata, created_at"
    )
    .eq("id", ctx.params.id)
    .maybeSingle();

  if (promoErr) return NextResponse.json({ error: promoErr.message }, { status: 500 });
  if (!promo) return NextResponse.json({ error: "Promo not found" }, { status: 404 });

  const { data: targets, error: targetsErr }: any = await supabase
    .from("promo_targets")
    .select("promo_id, target_type, target_value")
    .eq("promo_id", ctx.params.id);

  if (targetsErr) return NextResponse.json({ error: targetsErr.message }, { status: 500 });

  const now = new Date();
  const activeNow = isActiveNow(promo, now);

  return NextResponse.json({
    promo,
    targets: targets ?? [],
    stats: {
      activeNow,
      redemptions: Number(promo?.redemptions_count ?? 0),
      maxRedemptions: promo?.max_redemptions == null ? null : Number(promo.max_redemptions),
      revenueInfluencedCents: null,
      builderAttributedOrders: null,
    },
  });
}
