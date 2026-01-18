import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(req: Request, ctx: { params: { mediaId: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const body = (await req.json().catch(() => ({}))) as any;
  const normalizeNullString = (v: any) => {
    if (v === undefined) return undefined;
    if (v === null) return null;
    const s = String(v).trim();
    return s ? s : null;
  };

  const patch: any = {
    plan_id: body.plan_id === undefined && body.planId === undefined ? undefined : String(body.plan_id ?? body.planId),
    kind: body.kind === undefined ? undefined : String(body.kind),
    file_path: body.file_path === undefined ? undefined : String(body.file_path),
    is_external: body.is_external === undefined ? undefined : Boolean(body.is_external),
    alt: normalizeNullString(body.alt),
    caption: normalizeNullString(body.caption),
    sort_order: body.sort_order === undefined ? undefined : Math.floor(Number(body.sort_order)),
    meta: body.meta === undefined ? undefined : body.meta,
  };

  const supabase = getSupabaseAdmin() as any;
  const { error }: any = await supabase.from("plan_media").update(patch).eq("id", ctx.params.mediaId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: { mediaId: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdmin() as any;

  const { count: referencedCount, error: refErr }: any = await supabase
    .from("plans")
    .select("id", { count: "exact", head: true })
    .eq("og_media_id", ctx.params.mediaId);
  if (refErr) return NextResponse.json({ error: refErr.message }, { status: 500 });
  if (Number(referencedCount ?? 0) > 0) {
    return NextResponse.json(
      { error: "Cannot delete: media is referenced as a plan OG image. Clear the plan's OG image first." },
      { status: 409 }
    );
  }

  const { error }: any = await supabase.from("plan_media").delete().eq("id", ctx.params.mediaId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
