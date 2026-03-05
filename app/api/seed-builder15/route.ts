import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST() {
  const supabase = getSupabaseAdmin() as any;

  // Check if BUILDER15 already exists
  const { data: existing, error: findErr }: any = await supabase
    .from("builder_discount_codes")
    .select("id,code,active")
    .eq("code", "BUILDER15")
    .maybeSingle();

  if (findErr) {
    return NextResponse.json({ error: findErr.message }, { status: 500 });
  }

  if (existing?.id) {
    // Ensure it's active
    if (!existing.active) {
      await supabase
        .from("builder_discount_codes")
        .update({ active: true })
        .eq("id", existing.id);
    }
    return NextResponse.json({ message: "BUILDER15 already exists", code: existing });
  }

  // Insert the code — builder_profile_id is nullable for generic promo codes
  const { data: created, error: createErr }: any = await supabase
    .from("builder_discount_codes")
    .insert({
      code: "BUILDER15",
      discount_percent: 15,
      active: true,
      includes_builder_pack: false,
      free_mirror: false,
      cad_discount_percent: 0,
      priority_support: false,
      builder_profile_id: null,
    })
    .select("id,code,discount_percent,active")
    .single();

  if (createErr) {
    return NextResponse.json({ error: createErr.message }, { status: 500 });
  }

  return NextResponse.json({ message: "BUILDER15 created", code: created });
}
