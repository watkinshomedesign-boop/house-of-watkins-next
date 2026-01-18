import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase
    .from("promo_targets")
    .select("promo_id, target_type, target_value")
    .eq("promo_id", ctx.params.id)
    .order("target_type", { ascending: true })
    .order("target_value", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const body = (await req.json().catch(() => ({}))) as any;
  const targets = Array.isArray(body.targets) ? body.targets : [];

  for (const t of targets) {
    const tt = String(t?.target_type ?? "").trim();
    const tv = String(t?.target_value ?? "").trim();
    if (!tt || !tv) {
      return NextResponse.json({ error: "Invalid targets" }, { status: 400 });
    }
  }

  const supabase = getSupabaseAdmin() as any;

  const { error: delErr }: any = await supabase.from("promo_targets").delete().eq("promo_id", ctx.params.id);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  if (targets.length > 0) {
    const rows = targets.map((t: any) => ({
      promo_id: ctx.params.id,
      target_type: String(t.target_type).trim(),
      target_value: String(t.target_value).trim(),
    }));

    const { error: insErr }: any = await supabase.from("promo_targets").insert(rows);
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
