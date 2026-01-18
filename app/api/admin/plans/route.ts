import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function parseIntParam(v: string | null, fallback: number) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const q = (url.searchParams.get("q") || "").trim();
  const limit = Math.min(parseIntParam(url.searchParams.get("limit"), 50), 200);
  const offset = Math.max(0, parseIntParam(url.searchParams.get("offset"), 0));

  const supabase = getSupabaseAdmin() as any;

  let query = supabase
    .from("plans")
    .select(
      "id, slug, old_slugs, status, name, description, seo_title, seo_description, og_media_id, filters, heated_sqft, beds, baths, stories, garage_bays, width_ft, depth_ft, tags, created_at, updated_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);
  if (q) query = query.or(`slug.ilike.%${q}%,name.ilike.%${q}%`);

  const { data, error, count }: any = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], count: count ?? null, limit, offset });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const body = (await req.json().catch(() => ({}))) as any;

  const slug = String(body.slug || "").trim();
  const name = String(body.name || "").trim();
  const heatedSqft = Number(body.heated_sqft ?? body.heatedSqft);

  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (!Number.isFinite(heatedSqft) || heatedSqft <= 0) {
    return NextResponse.json({ error: "heated_sqft must be a positive number" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin() as any;
  const insertRow: any = {
    slug,
    name,
    heated_sqft: Math.floor(heatedSqft),
    status: String(body.status || "draft"),
    description: body.description ?? null,
    filters: body.filters ?? undefined,
    beds: body.beds == null ? null : Number(body.beds),
    baths: body.baths == null ? null : Number(body.baths),
    stories: body.stories == null ? null : Number(body.stories),
    garage_bays: body.garage_bays == null ? null : Number(body.garage_bays),
    width_ft: body.width_ft == null ? null : Number(body.width_ft),
    depth_ft: body.depth_ft == null ? null : Number(body.depth_ft),
    tags: Array.isArray(body.tags) ? body.tags.map((t: any) => String(t)) : undefined,
  };

  const { data, error }: any = await supabase
    .from("plans")
    .insert(insertRow)
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data?.id ?? null });
}
