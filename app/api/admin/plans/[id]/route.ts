import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

async function loadPlanForUpdate(supabase: any, id: string) {
  const { data, error }: any = await supabase
    .from("plans")
    .select("id, slug, old_slugs")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as { id: string; slug: string; old_slugs: string[] | null } | null;
}

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase
    .from("plans")
    .select(
      "id, slug, old_slugs, status, name, description, tour3d_url, filters, heated_sqft, beds, baths, stories, garage_bays, width_ft, depth_ft, tags, seo_title, seo_description, og_media_id, created_at, updated_at"
    )
    .eq("id", ctx.params.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const id = ctx.params.id;
  const body = (await req.json().catch(() => ({}))) as any;

  const supabase = getSupabaseAdmin() as any;

  const current = await loadPlanForUpdate(supabase, id);
  if (!current) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  const nextSlug = body.slug != null ? String(body.slug).trim() : null;
  const slugChanged = Boolean(nextSlug && nextSlug !== current.slug);

  const nextOldSlugs = (() => {
    const prev = Array.isArray(current.old_slugs) ? [...current.old_slugs] : [];
    if (slugChanged) {
      if (!prev.includes(current.slug)) prev.push(current.slug);
    }
    return prev;
  })();

  const normalizeNullString = (v: any) => {
    if (v === undefined) return undefined;
    if (v === null) return null;
    const s = String(v).trim();
    return s.length === 0 ? null : s;
  };

  const normalizeOgMediaId = (v: any) => {
    if (v === undefined) return undefined;
    if (v === null) return null;
    const s = String(v).trim();
    return s.length === 0 ? null : s;
  };

  const patch: any = {
    name: body.name == null ? undefined : String(body.name),
    description: body.description === undefined ? undefined : body.description,
    tour3d_url: normalizeNullString(body.tour3d_url ?? body.tour3dUrl),
    filters: body.filters === undefined ? undefined : body.filters,
    heated_sqft: body.heated_sqft == null ? undefined : Math.floor(Number(body.heated_sqft)),
    beds: body.beds === undefined ? undefined : body.beds == null ? null : Number(body.beds),
    baths: body.baths === undefined ? undefined : body.baths == null ? null : Number(body.baths),
    stories: body.stories === undefined ? undefined : body.stories == null ? null : Number(body.stories),
    garage_bays: body.garage_bays === undefined ? undefined : body.garage_bays == null ? null : Number(body.garage_bays),
    width_ft: body.width_ft === undefined ? undefined : body.width_ft == null ? null : Number(body.width_ft),
    depth_ft: body.depth_ft === undefined ? undefined : body.depth_ft == null ? null : Number(body.depth_ft),
    tags: body.tags === undefined ? undefined : Array.isArray(body.tags) ? body.tags.map((t: any) => String(t)) : null,
    status: body.status === undefined ? undefined : String(body.status),
    seo_title: normalizeNullString(body.seo_title ?? body.seoTitle),
    seo_description: normalizeNullString(body.seo_description ?? body.seoDescription),
    og_media_id: normalizeOgMediaId(body.og_media_id ?? body.ogMediaId),
  };

  if (slugChanged) {
    patch.slug = nextSlug;
    patch.old_slugs = nextOldSlugs;
  }

  const { error: updErr }: any = await supabase.from("plans").update(patch).eq("id", id);
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  if (slugChanged) {
    const fromPath = `/house/${current.slug}`;
    const toPath = `/house/${nextSlug}`;
    const { error: redirErr }: any = await supabase
      .from("redirects")
      .upsert({ from_path: fromPath, to_path: toPath, status_code: 301, is_auto: true }, { onConflict: "from_path" });
    if (redirErr) return NextResponse.json({ error: redirErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slugChanged });
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdmin() as any;
  const { error }: any = await supabase.from("plans").delete().eq("id", ctx.params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
