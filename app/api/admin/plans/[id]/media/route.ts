import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase
    .from("plan_media")
    .select("id, plan_id, kind, file_path, is_external, alt, caption, sort_order, meta, created_at")
    .eq("plan_id", ctx.params.id)
    .order("kind", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const body = (await req.json().catch(() => ({}))) as any;

  const kind = String(body.kind || "").trim();
  const filePath = String(body.file_path || body.filePath || "").trim();
  const sortOrder = body.sort_order == null ? 0 : Number(body.sort_order);

  if (!kind) return NextResponse.json({ error: "kind is required" }, { status: 400 });
  if (!filePath) return NextResponse.json({ error: "file_path is required" }, { status: 400 });

  const row: any = {
    plan_id: ctx.params.id,
    kind,
    file_path: filePath,
    is_external: Boolean(body.is_external ?? body.isExternal ?? false),
    alt: body.alt ?? null,
    caption: body.caption ?? null,
    sort_order: Number.isFinite(sortOrder) ? Math.floor(sortOrder) : 0,
    meta: body.meta ?? {},
  };

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase.from("plan_media").insert(row).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: data?.id ?? null });
}

export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const body = (await req.json().catch(() => ({}))) as any;
  const mediaId = String(body.mediaId || body.id || "").trim();
  if (!mediaId) return NextResponse.json({ error: "mediaId is required" }, { status: 400 });

  const supabase = getSupabaseAdmin() as any;
  const { error }: any = await supabase.from("plan_media").delete().eq("id", mediaId).eq("plan_id", ctx.params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
