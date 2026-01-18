import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_req: Request, ctx: { params: { pageKey: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const pageKey = String(ctx.params.pageKey || "").trim();
  if (!pageKey) return NextResponse.json({ error: "pageKey is required" }, { status: 400 });

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase
    .from("typography_pages")
    .select("page_key, label, content, updated_at")
    .eq("page_key", pageKey)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    pageKey,
    row: data ?? { page_key: pageKey, label: pageKey, content: {} },
  });
}

export async function PUT(req: Request, ctx: { params: { pageKey: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const pageKey = String(ctx.params.pageKey || "").trim();
  if (!pageKey) return NextResponse.json({ error: "pageKey is required" }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as any;
  const content = body?.content ?? {};
  const label = body?.label == null ? null : String(body.label);

  const supabase = getSupabaseAdmin() as any;
  const upsertRow: any = {
    page_key: pageKey,
    label: label ?? pageKey,
    content,
  };

  const { data, error }: any = await supabase
    .from("typography_pages")
    .upsert(upsertRow, { onConflict: "page_key" })
    .select("page_key, label, content, updated_at")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, row: data ?? null });
}
