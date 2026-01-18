import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type StatusPayload = {
  code?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as StatusPayload | null;
  if (!body) return jsonError("Invalid JSON body");

  const code = normalizeCode(String(body.code ?? ""));
  if (!code) return jsonError("Code is required");

  const supabase = getSupabaseAdmin() as any;

  const { data: codeRowRaw, error: codeErr }: any = await supabase
    .from("builder_discount_codes")
    .select(
      "id,code,discount_percent,active,usage_count,last_used_at,builder_profile_id,includes_builder_pack,free_mirror,cad_discount_percent,priority_support"
    )
    .eq("code", code)
    .maybeSingle();

  if (codeErr) return jsonError(codeErr.message, 500);

  const codeRow = codeRowRaw as any;
  if (!codeRow || !codeRow.active) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  const { data: profileRaw, error: profErr }: any = await supabase
    .from("builder_profiles")
    .select("id,created_at,first_name,last_name,email,company,role,license_number")
    .eq("id", codeRow.builder_profile_id)
    .maybeSingle();

  if (profErr) return jsonError(profErr.message, 500);

  return NextResponse.json({
    valid: true,
    builderProfile: profileRaw ?? null,
    code: {
      code: String(codeRow.code),
      discountPercent: Number(codeRow.discount_percent ?? 15),
      usageCount: Number(codeRow.usage_count ?? 0),
      lastUsedAt: codeRow.last_used_at ?? null,
      builderPack: {
        freeMirror: Boolean(codeRow.free_mirror ?? true),
        cadDiscountPercent: Number(codeRow.cad_discount_percent ?? 50),
        prioritySupport: Boolean(codeRow.priority_support ?? true),
      },
    },
  });
}
