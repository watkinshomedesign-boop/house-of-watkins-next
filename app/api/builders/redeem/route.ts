import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type RedeemPayload = {
  code?: string;
  plan_slug?: string;
  buyer_email?: string;
  appliedMirror?: boolean;
  appliedCadDiscount?: boolean;
  appliedPrioritySupport?: boolean;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RedeemPayload | null;
  if (!body) return jsonError("Invalid JSON body");

  const code = normalizeCode(String(body.code ?? ""));
  const planSlug = String(body.plan_slug ?? "").trim();
  const buyerEmail = String(body.buyer_email ?? "").trim();

  if (!code) return jsonError("Code is required");

  const supabase = getSupabaseAdmin() as any;

  const { data: rowRaw, error }: any = await supabase
    .from("builder_discount_codes")
    .select(
      "id,code,active,discount_percent,usage_count,builder_profile_id,includes_builder_pack,free_mirror,cad_discount_percent,priority_support"
    )
    .eq("code", code)
    .maybeSingle();

  const row = rowRaw as any;

  if (error) return jsonError(error.message, 500);

  if (!row || !row.active) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  const discountPercent = Number(row.discount_percent ?? 0);
  if (discountPercent !== 15) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  const builderProfileId = row?.builder_profile_id ? String(row.builder_profile_id) : null;

  // Record redemption (Phase 1: order_id may be unknown)
  const { error: insErr }: any = await supabase.from("builder_code_redemptions").insert({
    code,
    builder_profile_id: builderProfileId,
    email: buyerEmail ? normalizeEmail(buyerEmail) : null,
    plan_slug: planSlug || null,
    order_id: null,
  });

  if (insErr) return jsonError(insErr.message, 500);

  const nextUsage = Number((row as any)?.usage_count ?? 0) + 1;
  const { error: updErr }: any = await supabase
    .from("builder_discount_codes")
    .update({ usage_count: nextUsage, last_used_at: new Date().toISOString() })
    .eq("id", row.id);

  // If update fails, do not block redemption.
  if (updErr) {
    // ignore
  }

  const builderPack = {
    freeMirror: Boolean(row.free_mirror ?? true),
    cadDiscountPercent: Number(row.cad_discount_percent ?? 50),
    prioritySupport: Boolean(row.priority_support ?? true),
  };

  // Optional: store applied perk flags at redeem time when client indicates it
  const anyApplied = Boolean(body.appliedMirror || body.appliedCadDiscount || body.appliedPrioritySupport);
  if (anyApplied) {
    await (supabase as any).from("builder_benefit_redemptions").insert({
      code,
      builder_profile_id: builderProfileId,
      order_id: null,
      plan_slug: planSlug || null,
      applied_mirror: Boolean(body.appliedMirror),
      applied_cad_discount: Boolean(body.appliedCadDiscount),
      applied_priority_support: Boolean(body.appliedPrioritySupport),
    });
  }

  return NextResponse.json({
    valid: true,
    discountPercent,
    builderPack,
  });
}
