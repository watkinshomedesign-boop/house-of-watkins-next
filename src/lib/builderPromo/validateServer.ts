import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type BuilderPromo = {
  code: string;
  discountPercent: number;
  cadDiscountPercent: number;
  freeMirror: boolean;
  prioritySupport: boolean;
  builderProfileId: string;
};

export async function validateBuilderPromoCode(input: string): Promise<BuilderPromo | null> {
  const code = String(input ?? "").trim().toUpperCase();
  if (!code) return null;

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase
    .from("builder_discount_codes")
    .select(
      "code,active,discount_percent,cad_discount_percent,free_mirror,priority_support,builder_profile_id"
    )
    .eq("code", code)
    .maybeSingle();

  if (error) throw error;
  if (!data || !data.active) return null;

  return {
    code: String(data.code),
    discountPercent: Number(data.discount_percent ?? 15),
    cadDiscountPercent: Number(data.cad_discount_percent ?? 50),
    freeMirror: Boolean(data.free_mirror ?? true),
    prioritySupport: Boolean(data.priority_support ?? true),
    builderProfileId: String(data.builder_profile_id),
  };
}
