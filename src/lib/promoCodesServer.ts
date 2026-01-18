import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type PromoCodeRecord = {
  id: string;
  code: string;
  status: string;
  discount_type: "percent" | "amount";
  discount_value: number;
  applies_to: string;
  starts_at: string | null;
  ends_at: string | null;
  max_redemptions: number | null;
  redemptions_count: number;
  min_subtotal_cents: number | null;
  metadata: any;
};

export function normalizePromoCode(input: string): string {
  return String(input || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function isActiveNow(p: PromoCodeRecord, now: Date): boolean {
  if (p.status !== "active") return false;
  if (p.starts_at && now < new Date(p.starts_at)) return false;
  if (p.ends_at && now > new Date(p.ends_at)) return false;
  if (typeof p.max_redemptions === "number" && p.max_redemptions >= 0) {
    if (p.redemptions_count >= p.max_redemptions) return false;
  }
  return true;
}

export async function validatePromoCodeServer(input: {
  code: string;
  subtotalCents?: number;
}): Promise<PromoCodeRecord | null> {
  const code = normalizePromoCode(input.code);
  if (!code) return null;

  const now = new Date();

  try {
    const supabase = getSupabaseAdmin() as any;
    const { data, error }: any = await supabase
      .from("promo_codes")
      .select(
        "id, code, status, discount_type, discount_value, applies_to, starts_at, ends_at, max_redemptions, redemptions_count, min_subtotal_cents, metadata"
      )
      .eq("code", code)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const promo: PromoCodeRecord = {
      id: String(data.id),
      code: String(data.code),
      status: String(data.status),
      discount_type: data.discount_type,
      discount_value: Number(data.discount_value ?? 0),
      applies_to: String(data.applies_to ?? "order"),
      starts_at: data.starts_at ? String(data.starts_at) : null,
      ends_at: data.ends_at ? String(data.ends_at) : null,
      max_redemptions: data.max_redemptions == null ? null : Number(data.max_redemptions),
      redemptions_count: Number(data.redemptions_count ?? 0),
      min_subtotal_cents: data.min_subtotal_cents == null ? null : Number(data.min_subtotal_cents),
      metadata: data.metadata ?? {},
    };

    if (!isActiveNow(promo, now)) return null;

    const min = promo.min_subtotal_cents;
    if (typeof min === "number" && min > 0) {
      const subtotal = Number(input.subtotalCents ?? 0);
      if (subtotal < min) return null;
    }

    return promo;
  } catch {
    return null;
  }
}
