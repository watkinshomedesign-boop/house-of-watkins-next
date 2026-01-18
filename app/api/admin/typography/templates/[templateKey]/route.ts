import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_req: Request, ctx: { params: { templateKey: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const templateKey = String(ctx.params.templateKey || "").trim();
  if (!templateKey) return NextResponse.json({ error: "templateKey is required" }, { status: 400 });

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase
    .from("typography_templates")
    .select("template_key, label, instances_count, content, updated_at")
    .eq("template_key", templateKey)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    templateKey,
    row: data ?? { template_key: templateKey, label: templateKey, instances_count: null, content: {} },
  });
}

export async function PUT(req: Request, ctx: { params: { templateKey: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const templateKey = String(ctx.params.templateKey || "").trim();
  if (!templateKey) return NextResponse.json({ error: "templateKey is required" }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as any;
  const content = body?.content ?? {};
  const label = body?.label == null ? null : String(body.label);
  const instancesCount = body?.instancesCount == null ? null : Number(body.instancesCount);

  const supabase = getSupabaseAdmin() as any;
  const upsertRow: any = {
    template_key: templateKey,
    label: label ?? templateKey,
    instances_count: Number.isFinite(instancesCount) ? instancesCount : null,
    content,
  };

  const { data, error }: any = await supabase
    .from("typography_templates")
    .upsert(upsertRow, { onConflict: "template_key" })
    .select("template_key, label, instances_count, content, updated_at")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, row: data ?? null });
}
